/* The per-language statement extractors. Each takes the masked source, the
   already-computed line starts, and the file object, and pushes discovered
   classes, functions and variables onto it. The shared `parseBraceBody` and
   `parseIndentBody` dispatch on the language. */

import { RX, ind, lastSeg, splitTop, splitTypes } from './parser-regexes.js';
import { NAME_BAD, STMT_START } from './parser-constants.js';
import { findBody } from './parser-mask.js';
import { scanHeader, ctorParams, heritage } from './parser-header.js';

/* Brace-language loop. Detects one of: function/method declaration,
   class/interface/struct declaration, or a variable declaration. The
   ordering of `tries` matters: class regexes come first because they
   start with the same keywords that a function would, and the class
   regex requires a `{` whereas a function regex does not. */
const JS_MEMBER_RX = new Set([RX.jsMethod, RX.jsMethodML, RX.jsObj, RX.jsProp, RX.jsAssign]);
const isCallWithCallback = rest => {
  const args = rest.slice(0, rest.indexOf('{') < 0 ? rest.length : rest.indexOf('{'));
  return /^\s*(?:<[^>]*>)?\s*\(\s*['"`\d]/.test(args) || /\bfunction\b|=>/.test(args);
};

export function parseBrace(F, lang, m, ml, starts, lineOf, fns, classes, vars) {
  const depthAt = []; let d = 0;
  for (let i = 0; i < ml.length; i++) { depthAt.push(d); for (const ch of ml[i]) { if (ch === '{') d++; else if (ch === '}') d--; } }
  /* Innermost open bracket at the start of each line. A `name: (x) => T` or
     `name = (x) => …` line inside an open '(' is a parameter (a TS type
     annotation or a default value), not an object-literal method or a class
     field: treating it as one invented a function spanning the enclosing
     function's body (and a false recursion when the parameter was called). */
  const openAt = [''];
  { const st = []; for (const ch of m) { if (ch === '\n') openAt.push(st.length ? st[st.length - 1] : ''); else if (ch === '(' || ch === '[' || ch === '{') st.push(ch); else if ((ch === ')' || ch === ']' || ch === '}') && st.length) st.pop(); } }
  const fnLines = new Set(), varCand = [];
  const isGo = lang === 'go';
  for (let i = 0; i < ml.length; i++) {
    const line = ml[i];
    if (!line.trim() || /^\s*[}\])]/.test(line) && !/\b(function|func|fn|fun)\b/.test(line)) continue;
    let mm;
    if (isGo && (mm = RX.goType.exec(line))) {
      const e = findBody(m, starts[i] + mm.index + mm[0].length, false);
      if (e >= 0) { classes.push({ name: mm[1], kind: mm[2], start: i, end: lineOf(e), depth: depthAt[i], ext: [], impl: [] }); continue; }
    }
    if (isGo && (mm = RX.goType2.exec(line))) { classes.push({ name: mm[1], kind: 'type', start: i, end: i, depth: depthAt[i], ext: [], impl: [] }); continue; }
    mm = RX.cls.exec(line);
    if (mm && /^(?:namespace|module)$/.test(mm[1])) continue; // containers, not classes
    if (mm && (mm[2] || mm[3]) && !(lang === 'js' && /^\s*(?:object|record)\b/.test(line) && !/\{/.test(line))) {
      const name = mm[3] || mm[2];
      const namePos = starts[i] + mm.index + mm[0].length - (mm[4] || '').length;
      const hd = scanHeader(m, namePos);
      const bodyless = !hd.brace && (lang === 'kt' || lang === 'swift' || F.ext === 'cs' || F.ext === 'java' || F.ext === 'scala') && /class|record|struct|object/.test(mm[1]);
      if (hd.brace || bodyless) {
        let e = hd.end;
        if (hd.brace) { let dd = 0; for (let k = hd.end; k < m.length; k++) { const c = m[k]; if (c === '{') dd++; else if (c === '}') { dd--; if (dd === 0) { e = k; break; } } } }
        const cp = ctorParams(hd.text);
        const h = mm[3] ? { ext: [], impl: [mm[2]] } : heritage(lang, F.ext, cp.rest, mm[1]);
        const kind = mm[3]
          ? 'impl'
          : (/\babstract\b/.test(line) && mm[1] === 'class' ? 'abstract class'
             : /\bdata\s+class\b/.test(line) ? 'class'
             : /\benum\s+class\b/.test(line) ? 'enum'
             : /\brecord\s+(?:class|struct)\b/.test(line) ? 'record'
             : mm[1]);
        const cl = { name, kind, start: i, end: Math.max(i, lineOf(e)), depth: depthAt[i], ext: h.ext, impl: h.impl };
        classes.push(cl);
        if (cp.params) for (const prm of splitTop(cp.params)) {
          let pm = /(?:^|\s)(val|var)\s+([A-Za-z_]\w*)\s*:\s*(.+)$/.exec(prm);
          if (pm) { vars.push({ name: pm[2], line: i, kind: pm[1] === 'val' ? 'const' : 'field', cls: name, typeLine: prm }); continue; }
          if ((F.ext === 'cs' || F.ext === 'java') && (pm = /^\s*(?:\[[^\]]*\]\s*)?([\w<>\[\],.?]+)\s+([A-Za-z_]\w*)\s*(?:=.*)?$/.exec(prm))) vars.push({ name: pm[2], line: i, kind: 'field', cls: name, typeLine: prm });
        }
        continue;
      }
    }
    let name = null, lenient = false, recv = null, recvVar = null, bodyFrom = -1, hitRx = null;
    const tries = lang === 'js' ? [[RX.jsFn], [RX.jsArrow, 1], [RX.jsProp, 1], [RX.jsAssign, 1], [RX.jsObj, 1], [RX.jsMethod], [RX.jsMethodML], [RX.jsNamedExpr]]
      : lang === 'go' ? [[RX.goFn]]
      : lang === 'rs' ? [[RX.rsFn]]
      : lang === 'php' ? [[RX.phpFn]]
      : lang === 'kt' || lang === 'swift' ? [[RX.ktFn, 1], [RX.ktInit]]
      : [[RX.cFn]];
    const AMBIG = new Set([RX.jsObj, RX.jsMethod, RX.jsMethodML, RX.cFn, RX.jsProp]);
    for (const [rx, len] of tries) {
      mm = rx.exec(line);
      if (!mm) continue;
      if ((rx === RX.jsObj || rx === RX.jsProp) && openAt[i] === '(') continue;
      let nm = mm[1];
      if (rx === RX.goFn) { nm = mm[3]; recv = mm[2] || null; recvVar = mm[1] || null; }
      if (rx === RX.jsAssign) {
        nm = mm[2]; const chain = mm[1].slice(0, -1).split('.');
        const named = /function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/.exec(line); if (nm === 'exports' && named) nm = named[1];
        if (chain[0] === 'this' || chain[0] === 'exports' || chain[0] === 'module' || chain[0] === 'window') recv = null;
        else { const pi = chain.indexOf('prototype'); recv = pi > 0 ? chain[pi - 1] : chain[chain.length - 1]; }
      }
      if (rx === RX.cFn && STMT_START.test(line)) continue;
      /* `it('works', function (done) {` or `describe('x', () => {` is a CALL
         whose last argument is a callback, not a method named `it`: a
         parameter list never starts with a string or number and never holds
         `function` or `=>` (args are read up to the first '{'). */
      if (rx === RX.jsMethod && isCallWithCallback(line.slice(line.indexOf(nm, mm.index) + nm.length))) continue;
      if (rx === RX.jsMethodML) {
        if (depthAt[i] < 1 || NAME_BAD.has(nm)) continue;
        const o = starts[i] + line.indexOf('(', mm.index + line.slice(mm.index).indexOf(nm) + nm.length);
        let dd = 0, k = o; for (; k < m.length && k < o + 2000; k++) { if (m[k] === '(') dd++; else if (m[k] === ')') { dd--; if (!dd) break; } }
        const tail = m.slice(k + 1, m.indexOf('\n', k + 1) < 0 ? m.length : m.indexOf('\n', k + 1) + 1);
        if (!/^\s*(?::\s*[^{;=]+)?\{/.test(tail)) continue;
        bodyFrom = k + 1;
      }
      if ((rx === RX.ktFn) && !/[{=]/.test(line.slice(line.indexOf(nm) + nm.length).replace(/\([^)]*\)/, ''))) {
        const nx = (ml[i + 1] || '').trim();
        if (!/^[{=]/.test(nx)) continue;
      }
      if (!nm) continue;
      const bad = AMBIG.has(rx) ? NAME_BAD.has(nm) && nm !== 'constructor' : false;
      if (!bad) { name = nm; lenient = !!len; hitRx = rx; break; }
    }
    if (!name) {
      extractBraceVariable(F, lang, line, varCand, i, depthAt[i]);
      continue;
    }
    const at = line.indexOf(name, mm.index) + name.length;
    const e = findBody(m, bodyFrom >= 0 ? bodyFrom : starts[i] + at, lenient);
    if (e < 0) continue;
    const end = Math.max(i, lineOf(e));
    fnLines.add(i);
    const body = ml.slice(i, end + 1).join('\n');
    const sig = sigOf(ml, i, name);
    /* `member`: a JS method, object-literal method, class field or
       `a.b = function`; its own name is not in scope inside it. */
    fns.push({ name, start: i, end, body, sig, recv, recvVar, member: lang === 'js' && JS_MEMBER_RX.has(hitRx) });
  }
  for (const f of fns) {
    if (f.name !== 'constructor' && f.name !== '__construct') continue;
    const cl = classes.filter(c => f.start > c.start && f.end <= c.end).sort((a, b) => b.start - a.start)[0]; if (!cl) continue;
    for (const prm of splitTop(f.sig || '')) {
      if (!/^(?:public|private|protected|readonly)\b/.test(prm)) continue;
      const pm = /([A-Za-z_$][\w$]*)\s*[?!]?\s*(?::|=|$)/.exec(prm.replace(/^(?:(?:public|private|protected|readonly)\s+)+/, '').replace(/^[\w\\?|<>\[\]]+\s+(?=\$)/, '').replace(/^\$/, ''));
      if (pm) vars.push({ name: pm[1], line: f.start, kind: /readonly/.test(prm) ? 'const' : 'field', cls: cl.name, typeLine: prm });
    }
  }
  const inFn = i => fns.some(f => i > f.start && i <= f.end);
  for (const v of varCand) {
    const cl = classes.filter(c => v.line > c.start && v.line <= c.end).sort((a, b) => b.start - a.start)[0];
    if (v.d === 0 && !v.fieldOnly && !cl) vars.push(v);
    else if (cl && v.d === cl.depth + 1 && !inFn(v.line) && !fnLines.has(v.line)) vars.push({ ...v, kind: v.kind === 'var' ? 'field' : v.kind, cls: cl.name, typeLine: ml[v.line] });
  }
  for (const c of classes) {
    if (!/interface|protocol|trait|abstract/.test(c.kind)) continue;
    c.abstract = [];
    for (let i = c.start + 1; i < c.end; i++) {
      if (depthAt[i] !== c.depth + 1 || fnLines.has(i)) continue;
      const mm = /^\s*(?:(?:public|abstract|virtual|func|fun|fn|def|async)\s+)*(?:[\w<>\[\],.?]+\s+)?([A-Za-z_]\w*)\s*(?:<[^>]*>)?\s*\(([^)]*)\)[^{]*;?\s*$/.exec(ml[i]);
      if (mm && !NAME_BAD.has(mm[1])) c.abstract.push({ name: mm[1], sig: mm[2].replace(/\s+/g, ' ').trim() });
    }
  }
}

function extractBraceVariable(F, lang, line, varCand, i, depth) {
  let mm;
  if (lang === 'js') {
    mm = /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)/.exec(line);
    if (mm) { varCand.push({ name: mm[1], line: i, kind: /\bconst\b/.test(line) ? 'const' : 'var', d: depth }); return; }
    mm = /^\s*(?:(?:public|private|protected|static|readonly|declare|abstract)\s+)*(#?[A-Za-z_$][\w$]*)\s*[?!]?\s*[:=]\s*[^=>]/.exec(line);
    if (mm && !NAME_BAD.has(mm[1])) varCand.push({ name: mm[1], line: i, kind: /readonly|static/.test(line) ? 'const' : 'field', d: depth, fieldOnly: true });
  } else if (lang === 'go') {
    mm = /^\s*(?:var|const)\s+([A-Za-z_]\w*)/.exec(line);
    if (mm) { varCand.push({ name: mm[1], line: i, kind: /const/.test(line) ? 'const' : 'var', d: depth }); return; }
    mm = /^\s*([A-Za-z_]\w*)((?:\s*,\s*[A-Za-z_]\w*)*)\s+[\[\]*\w.{}]+(?:\s*`.*`)?\s*$/.exec(line);
    if (mm && !NAME_BAD.has(mm[1])) {
      varCand.push({ name: mm[1], line: i, kind: 'field', d: depth, fieldOnly: true });
      (mm[2].match(/[A-Za-z_]\w*/g) || []).forEach(n2 => varCand.push({ name: n2, line: i, kind: 'field', d: depth, fieldOnly: true }));
    } else {
      mm = /^\s*\*?([A-Z]\w*)\s*$/.exec(line);
      if (mm) varCand.push({ name: mm[1], line: i, kind: 'field', d: depth, fieldOnly: true, embed: true });
    }
  } else if (lang === 'rs') {
    mm = /^\s*(?:pub(?:\([^)]*\))?\s+)?(const|static)\s+(?:mut\s+)?([A-Za-z_]\w*)/.exec(line);
    if (mm) { varCand.push({ name: mm[2], line: i, kind: 'const', d: depth }); return; }
    mm = /^\s*(?:pub(?:\([^)]*\))?\s+)?([a-z_]\w*)\s*:\s*[^:]/.exec(line);
    if (mm && !NAME_BAD.has(mm[1])) varCand.push({ name: mm[1], line: i, kind: 'field', d: depth, fieldOnly: true });
  } else if (lang === 'kt' || lang === 'swift') {
    mm = /^\s*(?:(?:private|public|internal|protected|override|lateinit|static|open|final|weak|lazy|@\w+)\s+)*(val|var|let|const\s+val)\s+([A-Za-z_]\w*)/.exec(line);
    if (mm) varCand.push({ name: mm[2], line: i, kind: /val|let/.test(mm[1]) ? 'const' : 'var', d: depth });
  } else if (lang === 'php') {
    mm = /^\s*(?:(?:public|private|protected|static|var|const|readonly)\s+)+\??[\w|\\]*\s*\$?([A-Za-z_]\w*)\s*[=;]/.exec(line) || /^\s*\$([A-Za-z_]\w*)\s*=[^=]/.exec(line);
    if (mm) varCand.push({ name: mm[1], line: i, kind: /const/.test(line) ? 'const' : 'var', d: depth });
  } else {
    mm = /^\s*(?:(?:public|private|protected|internal|static|final|const|readonly|volatile|extern|constexpr|inline|mutable)\s+)*(?:[\w<>\[\],.:*&?]+)\s+\**&?([A-Za-z_]\w*)\s*(?:=[^=>]|;|\[|\{\s*get)/.exec(line);
    if (mm && !NAME_BAD.has(mm[1]) && !/^\s*(return|using|namespace|typedef|package|import|throw|goto|delete|else|case|new)\b/.test(line)) varCand.push({ name: mm[1], line: i, kind: /\b(const|final|readonly|constexpr)\b/.test(line) ? 'const' : 'var', d: depth });
  }
}

function sigOf(ml, i, name) {
  const t = ml.slice(i, i + 8).join(' ');
  const k = t.indexOf(name); const o = t.indexOf('(', k + name.length);
  if (o < 0 || o - k - name.length > 30) return '';
  let d = 0, j = o;
  for (; j < t.length; j++) { if (t[j] === '(') d++; else if (t[j] === ')') { d--; if (!d) break; } }
  return t.slice(o + 1, j).replace(/\s+/g, ' ').trim();
}

/* Indentation-language loop. Detects class, function, and module-level
   variable declarations. The body of a function ends when the next
   non-blank line is at the same or smaller indent, except in Ruby/Lua
   where `end` closes the block. */
export function parseIndent(F, lang, m, ml, starts, lineOf, fns, classes, vars) {
  const lines = ml;
  const indentEnd = (i, n0) => {
    let last = i;
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim()) continue;
      const k = ind(l);
      if (k <= n0) {
        if ((lang === 'rb' || lang === 'lua') && k === n0 && /^\s*end\b/.test(l)) last = j;
        break;
      }
      last = j;
    }
    return last;
  };
  let fileExt = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; if (!line.trim()) continue;
    let mm;
    if (lang === 'gd') {
      if ((mm = /^\s*class_name\s+(\w+)(?:\s+extends\s+(\w+))?/.exec(line))) { F.className = mm[1]; if (mm[2]) { fileExt = mm[2]; F.rawImports.push({ spec: mm[2], kind: 'class' }); } continue; }
      if ((mm = /^\s*extends\s+(\w+)/.exec(line))) { fileExt = mm[1]; F.rawImports.push({ spec: mm[1], kind: 'class' }); continue; }
      if ((mm = /^\s*extends\s+"([^"]+)"/.exec(line))) { fileExt = mm[1].split('/').pop().replace(/\.gd$/, '').split(/[_-]/).map(x => x ? x[0].toUpperCase() + x.slice(1) : '').join(''); continue; }
      if ((mm = /^\s*signal\s+(\w+)/.exec(line))) { vars.push({ name: mm[1], line: i, kind: 'signal' }); continue; }
      if ((mm = /^\s*(?:@export\S*\s+|export(?:\([^)]*\))?\s+|onready\s+|@onready\s+|static\s+)*(var|const)\s+([A-Za-z_]\w*)/.exec(line))) { vars.push({ name: mm[2], line: i, kind: mm[1] === 'const' ? 'const' : 'var', typeLine: line }); continue; }
    }
    const clsRx = lang === 'rb' ? RX.rbCls : lang === 'lua' ? null : RX.pyCls;
    if (clsRx && (mm = clsRx.exec(line))) {
      const h = { ext: [], impl: [] }; const rest = mm[3] || '';
      if (lang === 'py') { const p = /^\s*\(([^)]*)\)/.exec(rest); if (p) p[1].split(',').map(s => s.trim()).filter(s => s && !s.includes('=') && s !== 'object').forEach(s => (/^(ABC|Protocol|Generic|Interface)\b/.test(lastSeg(s)) ? h.impl : h.ext).push(lastSeg(s))); }
      else if (lang === 'rb') { const p = /^\s*<\s*([\w:]+)/.exec(rest); if (p) h.ext.push(lastSeg(p[1])); }
      else if (lang === 'gd') { const p = /extends\s+(\w+)/.exec(rest); if (p) h.ext.push(p[1]); }
      const isAbs = lang === 'py' && /\b(ABC|Protocol)\b/.test(rest);
      classes.push({ name: mm[2].split('::').pop(), kind: isAbs ? (/Protocol/.test(rest) ? 'protocol' : 'abstract class') : (lang === 'rb' && /^\s*module/.test(line) ? 'module' : 'class'), start: i, end: indentEnd(i, mm[1].length), ind: mm[1].length, ext: h.ext, impl: h.impl });
      continue;
    }
    const fnRx = lang === 'gd' ? RX.gdFn : lang === 'rb' ? RX.rbFn : lang === 'lua' ? RX.luaFn : RX.pyFn;
    if ((mm = fnRx.exec(line))) {
      const n0 = (mm[1] || mm[3] || '').length; let name = mm[2] || mm[4];
      let sigEnd = i;
      if (lang === 'py' || lang === 'gd') { let d = 0; for (let j = i; j < lines.length && j < i + 40; j++) { for (const ch of lines[j]) { if (ch === '(' || ch === '[') d++; else if (ch === ')' || ch === ']') d--; } if (d <= 0) { sigEnd = j; break; } } }
      const end = Math.max(sigEnd, indentEnd(sigEnd, n0));
      let deco = ''; for (let k = i - 1; k >= 0 && /^\s*@/.test(lines[k]); k--) deco = lines[k].trim() + ' ' + deco;
      if (lang === 'lua' && /[.:]/.test(name)) { const parts = name.split(/[.:]/); name = parts.pop(); fns.push({ name, start: i, end, body: ml.slice(i, end + 1).join('\n'), sig: sigOf(ml, i, name), luaOwner: parts.join('.') }); continue; }
      fns.push({ name, start: i, end, body: ml.slice(i, end + 1).join('\n'), sig: sigOf(ml, i, name), deco: deco.trim(), abstract: /abstractmethod/.test(deco) });
      continue;
    }
    if (ind(line) === 0) {
      mm = lang === 'py' ? /^([A-Za-z_]\w*)\s*(?::\s*[^=]+)?=(?!=)/.exec(line) : lang === 'lua' ? /^local\s+([A-Za-z_]\w*)\s*=/.exec(line) : lang === 'rb' ? /^([A-Z][A-Z0-9_]*)\s*=/.exec(line) : null;
      if (mm) vars.push({ name: mm[1], line: i, kind: /^[A-Z][A-Z0-9_]+$/.test(mm[1]) ? 'const' : 'var', typeLine: line });
    }
  }
  for (const c of classes) {
    const seen = new Set();
    for (let i = c.start + 1; i <= c.end; i++) {
      const l = lines[i]; let mm;
      if ((lang === 'py' || lang === 'gd') && (mm = /\bself\.([A-Za-z_]\w*)\s*(?::[^=]+)?=(?!=)\s*(.*)$/.exec(l))) {
        if (!seen.has(mm[1])) {
          seen.add(mm[1]); let tl = l;
          const rhs = /^([A-Za-z_]\w*)\s*$/.exec(mm[2] || '');
          if (rhs) { const enc = fns.find(f => i > f.start && i <= f.end); const pa = enc && new RegExp('\\b' + rhs[1] + '\\s*:\\s*([\\w.\\[\\], |]+)').exec(enc.sig || ''); if (pa) tl += ' # ' + pa[1]; }
          vars.push({ name: mm[1], line: i, kind: 'field', cls: c.name, typeLine: tl });
        }
      } else if ((lang === 'py' || lang === 'gd') && (mm = /^\s+(?:var\s+|const\s+)?([A-Za-z_]\w*)\s*(?::\s*[^=]+)?(?:=(?!=)|:\s*\w+\s*$)/.exec(l)) && ind(l) === c.ind + 4 && !fns.some(f => i > f.start && i <= f.end)) {
        if (!seen.has(mm[1])) { seen.add(mm[1]); vars.push({ name: mm[1], line: i, kind: 'field', cls: c.name, typeLine: l }); }
      } else if (lang === 'rb' && (mm = /attr_(?:accessor|reader|writer)\s+(.+)/.exec(l))) mm[1].split(',').forEach(s => { const n = s.replace(/[:\s]/g, ''); if (n && !seen.has(n)) { seen.add(n); vars.push({ name: n, line: i, kind: 'field', cls: c.name, typeLine: l }); } });
      else if (lang === 'rb' && (mm = /@([a-z_]\w*)\s*=[^=]/.exec(l))) { if (!seen.has(mm[1])) { seen.add(mm[1]); vars.push({ name: mm[1], line: i, kind: 'field', cls: c.name, typeLine: l }); } }
    }
  }
  if (lang === 'gd' && (F.className || fileExt)) {
    const stem = F.name.replace(/\.gd$/, '');
    const nm = F.className || stem.split(/[_-]/).map(s => s[0] ? s[0].toUpperCase() + s.slice(1) : '').join('');
    F.fileClass = nm;
    classes.unshift({ name: nm, kind: 'class', start: 0, end: lines.length - 1, ext: fileExt ? [fileExt] : [], impl: [], fileLevel: true });
    for (const v of vars) if (!v.cls && v.kind !== 'signal') { v.cls = nm; if (v.kind === 'var') v.kind = 'field'; }
  }
}

/* CSS-specific: a file is a flat list of selectors and at-rules. */
export function parseCss(F, lang, m, ml, starts, lineOf, fns, classes, vars) {
  let segStart = 0, kfEnd = -1;
  for (let j = 0; j < m.length; j++) {
    const ch = m[j];
    if (ch === '{') {
      const sel = m.slice(segStart, j).replace(/\s+/g, ' ').trim();
      let d = 0, k = j; for (; k < m.length; k++) { if (m[k] === '{') d++; else if (m[k] === '}') { d--; if (d === 0) break; } }
      const s = lineOf(segStart + (m.slice(segStart, j).length - m.slice(segStart, j).trimStart().length)), e = lineOf(k);
      if (sel.startsWith('@')) {
        classes.push({ name: sel.slice(0, 48), kind: sel.split(/[\s(]/)[0].slice(1), start: s, end: e, css: true });
        if (/^@(-\w+-)?keyframes/.test(sel)) kfEnd = k;
      } else if (j > kfEnd && sel) {
        const decl = (m.slice(j, k).match(/;/g) || []).length;
        fns.push({ name: sel.slice(0, 56), start: s, end: e, cx: 1 + Math.floor(decl / 4), body: m.slice(j, k + 1), sig: '' });
      }
      segStart = j + 1;
    } else if (ch === '}') segStart = j + 1;
    else if (ch === ';') segStart = j + 1;
  }
  const seen = new Set();
  for (let i = 0; i < ml.length; i++) {
    const r = /(--[\w-]+)\s*:|^\s*(\$[\w-]+)\s*:/g; let mm;
    while ((mm = r.exec(ml[i]))) { const nm = mm[1] || mm[2]; if (!seen.has(nm)) { seen.add(nm); vars.push({ name: nm, line: i, kind: 'const' }); } }
  }
}
