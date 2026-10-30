/* Call graph resolution and project analysis. This is the part the README
   calls "level 1" — we resolve as much as the source can tell us without
   running the code or running a real type-checker.

   The output of analyzeProject is what the rest of Software City consumes. */

import { FAMILY, TYPE_SKIP, EXT, EXT_NAME as EXT_N } from './parser-constants.js';
import { parseBrace, parseIndent, parseCss } from './parser-languages.js';
import { dataFlow } from './parser-dataflow.js';
import { mask } from './parser-mask.js';
import { splitTop } from './parser-regexes.js';

/* Parameter names of a signature ("a, b: T, ...rest" → a, b, rest). */
const NO_IMPLICIT_SELF = new Set(['js', 'php', 'py', 'lua', 'go', 'rs']);
const paramNames = sig => new Set(splitTop(sig || '').map(p => { const m = /^(?:\.\.\.)?\s*([A-Za-z_$][\w$]*)/.exec(p.trim()); return m ? m[1] : null; }).filter(Boolean));

/* ---------- imports / requires ---------- */

function rawImports(F, src) {
  const add = (spec, kind) => { if (spec) F.rawImports.push({ spec: spec.trim(), kind: kind || 'path' }); };
  const all = (re, k, g = 1) => { let mm; re.lastIndex = 0; while ((mm = re.exec(src))) add(mm[g], k); };
  const L = F.lang, e = F.ext;
  if (L === 'js' || L === 'html') {
    all(/\bimport\s+(?:type\s+)?(?:[\w*{}\s,$]*?\s+from\s+)?['"]([^'"\n]+)['"]/g);
    all(/\bexport\s+(?:type\s+)?(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s+from\s+['"]([^'"\n]+)['"]/g);
    all(/\brequire\(\s*['"]([^'"\n]+)['"]\s*\)/g);
    all(/\bimport\(\s*['"]([^'"\n]+)['"]\s*\)/g);
  }
  if (L === 'html') { all(/\b(?:src|href)=["']([^"'#?\s]+)["']/g); }
  if (L === 'css' || L === 'html') all(/@(?:import|use|forward)\s+(?:url\()?['"]?([^'")\s;]+)/g);
  if (L === 'py') {
    all(/^\s*from\s+([.\w]*\w[.\w]*)\s+import/gm, 'dotted');
    { let mm; const re = /^\s*from\s+(\.+)\s+import\s+\(?([\w\s,]+)\)?/gm; while ((mm = re.exec(src))) mm[2].split(',').map(x => x.trim().split(/\s+/)[0]).filter(Boolean).forEach(n => add(mm[1] + n, 'dotted')); }
    let mm; const re = /^\s*import\s+([\w.]+(?:\s+as\s+\w+)?(?:\s*,\s*[\w.]+(?:\s+as\s+\w+)?)*)/gm;
    while ((mm = re.exec(src))) mm[1].split(',').forEach(s => add(s.trim().split(/\s+/)[0], 'dotted'));
  }
  if (L === 'gd') { all(/(?:preload|load)\(\s*["']([^"']+)["']\s*\)/g); all(/^extends\s+["']([^"']+)["']/gm); }
  if (L === 'go') {
    all(/^\s*import\s+(?:\w+\s+)?"([^"]+)"/gm, 'go');
    const blk = /import\s*\(([\s\S]*?)\)/g; let mm;
    while ((mm = blk.exec(src))) mm[1].split('\n').forEach(l => { const q = /"([^"]+)"/.exec(l); if (q) add(q[1], 'go'); });
  }
  if (L === 'rs') { all(/^\s*(?:pub\s+)?use\s+([\w:]+)/gm, 'rust'); all(/^\s*(?:pub\s+)?mod\s+(\w+)\s*;/gm, 'mod'); }
  if (L === 'c' || L === 'kt' || L === 'swift') {
    all(/#include\s*"([^"]+)"/g); all(/#include\s*<([^>]+)>/g, 'sys');
    all(/^\s*import\s+(?:static\s+)?([\w.]+)(?:\.\*)?\s*;?\s*$/gm, 'dotted');
    if (e === 'dart') all(/^\s*import\s+['"]([^'"]+)['"]/gm);
    if (e === 'cs') all(/^\s*using\s+(?:static\s+)?([\w.]+)\s*;/gm, 'dotted');
  }
  if (L === 'php') { all(/\b(?:require|include)(?:_once)?\s*\(?\s*(?:__DIR__\s*\.\s*)?['"]([^"']+)['"]/g); all(/^\s*use\s+([\w\\]+)/gm, 'ns'); }
  if (L === 'rb') { all(/require_relative\s+['"]([^"']+)['"]/g, 'rel'); all(/\brequire\s+['"]([^"']+)['"]/g, 'dotted'); }
  if (L === 'lua') all(/\brequire\s*\(?\s*['"]([^"']+)['"]/g, 'dotted');
}

/* ---------- per-file analysis ---------- */

function analyzeFile(path, src) {
  /* CRLF / CR line endings left a '\r' on every line, and `(.*)$` never
     matches across it in JS, so Windows-authored files lost their classes.
     A leading BOM broke the first line. The GDScript port does the same. */
  if (src) src = src.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const name = path.split('/').pop();
  const ext = (name.includes('.') ? name.split('.').pop() : '').toLowerCase();
  const lang = EXT_OF(ext);
  const F = { path, name, ext, lang, langName: EXT_NAME(ext) || (ext ? ext.toUpperCase() : 'Text'), src,
    lines: src ? src.split('\n').length : 0,
    functions: [], classes: [], variables: [], rawImports: [], className: null, fileClass: null, masked: null };

  if (lang === 'html') {
    let mm;
    const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    while ((mm = re.exec(src))) {
      if (/\bsrc=/.test(mm[1]) || /type=["'](?:text\/template|application\/(?:ld\+)?json)/.test(mm[1])) continue;
      const cStart = mm.index + mm[0].indexOf('>') + 1;
      parseInto(F, 'js', mm[2], (src.slice(0, cStart).match(/\n/g) || []).length);
    }
    const st = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    while ((mm = st.exec(src))) {
      const cStart = mm.index + mm[0].indexOf('>') + 1;
      parseInto(F, 'css', mm[1], (src.slice(0, cStart).match(/\n/g) || []).length);
    }
    const ids = /\bid=["']([A-Za-z][\w-]*)["']/g; let n = 0;
    while ((mm = ids.exec(src)) && n++ < 60) F.variables.push({ name: '#' + mm[1], line: (src.slice(0, mm.index).match(/\n/g) || []).length, kind: 'id' });
  } else {
    parseInto(F, lang, src, 0);
  }
  rawImports(F, src);

  F.functions.sort((a, b) => a.start - b.start || b.end - a.end);
  for (const f of F.functions) {
    f.file = F;
    let par = null;
    for (const g of F.functions) if (g !== f && g.start <= f.start && g.end >= f.end && (g.start < f.start || g.end > f.end) && (!par || g.end - g.start < par.end - par.start)) par = g;
    f.parent = par;
    let cl = null;
    for (const c of F.classes) if (!c.css && c.start <= f.start && c.end >= f.end && (!cl || c.end - c.start < cl.end - cl.start)) cl = c;
    f.cls = cl ? cl.name : (f.recv || f.luaOwner || null);
  }
  for (const v of F.variables) if (!v.cls && v.kind === 'field') {
    let cl = null;
    for (const c of F.classes) if (c.start <= v.line && c.end >= v.line && (!cl || c.end - c.start < cl.end - cl.start)) cl = c;
    if (cl) v.cls = cl.name;
  }
  for (const c of F.classes) {
    c.file = F; c.ext = c.ext || []; c.impl = c.impl || [];
    c.methods = F.functions.filter(f => f.cls === c.name && (!f.parent || f.parent.cls !== c.name || f.parent === null));
    c.fields = F.variables.filter(v => v.cls === c.name);
  }
  dataFlow(F);
  return F;
}

function parseInto(F, lang, src, off) {
  const fam = FAMILY[lang]; if (!fam) return;
  const m = mask(src, fam, lang);
  if (!off && F.lang === lang) F.masked = m;
  const ml = m.split('\n');
  const starts = []; let acc = 0; for (const l of ml) { starts.push(acc); acc += l.length + 1; }
  const lineOf = pos => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= pos) lo = mid; else hi = mid - 1; } return lo; };
  const fns = [], classes = [], vars = [];
  if (fam === 'css') parseCss(F, lang, m, ml, starts, lineOf, fns, classes, vars);
  else if (fam === 'brace') parseBrace(F, lang, m, ml, starts, lineOf, fns, classes, vars);
  else parseIndent(F, lang, m, ml, starts, lineOf, fns, classes, vars);

  for (const f of fns) {
    if (f.cx == null) f.cx = 1 + ((f.body || '').match(CX_RE) || []).length;
    const b = f.body || '';
    f.locals = fam === 'indent'
      ? new Set((b.match(/^\s+(?:var\s+|local\s+)?([A-Za-z_]\w*)\s*(?::[^=\n]*)?=(?!=)/gm) || []).map(s => s.trim().split(/[\s:=]/)[0])).size
      : (b.match(/\b(?:const|let|var|val|auto|my)\s+[A-Za-z_$]/g) || []).length;
    f.start += off; f.end += off; f.lines = f.end - f.start + 1;
    F.functions.push(f);
  }
  for (const c of classes) { c.start += off; c.end += off; F.classes.push(c); }
  for (const v of vars) { v.line += off; F.variables.push(v); }
}

const CX_RE = /\b(?:if|for|foreach|while|case|catch|except|elif|elsif|when|guard|unless|until|rescue)\b|&&|\|\||\?\?|\band\b|\bor\b/g;
/* EXT / EXT_N live in parser-constants.js (single source of truth; the
   drag-drop accept list and the Patrol runner read the same table). */
const EXT_OF = e => EXT[e] || 'doc';
const EXT_NAME = e => EXT_N[e];

/* ---------- resolution helpers ---------- */

const TRY_EXT = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.vue', '.svelte', '.py', '.gd', '.css', '.scss', '.rs', '.go', '.php', '.rb', '.lua', '.h', '.hpp', '.java', '.kt', '.cs', '.dart', '.swift', '/index.ts', '/index.tsx', '/index.js', '/index.jsx', '/__init__.py', '/mod.rs', '/lib.rs', '/init.lua'];
const joinPath = (dir, rel) => { const parts = (dir ? dir.split('/') : []); for (const s of rel.split('/')) { if (s === '..') parts.pop(); else if (s && s !== '.') parts.push(s); } return parts.join('/'); };

function resolveOne(r, f, byPath, byName, byStem, byClass, byDir) {
  let s = r.spec; const dir = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/')) : '';
  if (/^(https?:)?\/\//.test(s) || /^(data|mailto|tel):/.test(s)) return { ext: s };
  if (r.kind === 'class') { const t = byClass.get(s); return t && t !== f ? { file: t } : (t === f ? null : { ext: s }); }
  if (r.kind === 'sys') return { ext: s };
  s = s.replace(/^res:\/\//, '/').replace(/^[@~]\//, '/').replace(/^\$lib\//, '/lib/');
  const tryPath = p => {
    p = p.replace(/^\/+/, '');
    for (const e of TRY_EXT) {
      const full = p + e; if (byPath.has(full)) return byPath.get(full);
      const nm = full.split('/').pop(); const c = byName.get(nm);
      if (c) { const hit = c.find(x => x.path === full || x.path.endsWith('/' + full)); if (hit) return hit; }
    }
    return null;
  };
  let t = null;
  if (r.kind === 'dotted' && f.lang === 'py' && s.startsWith('.')) {
    const dots = s.match(/^\.+/)[0].length; let d = dir; for (let k = 1; k < dots; k++) d = d.includes('/') ? d.slice(0, d.lastIndexOf('/')) : '';
    t = tryPath(joinPath(d, s.slice(dots).replace(/\./g, '/')));
  } else if (r.kind === 'dotted' || r.kind === 'ns') {
    const p = s.replace(/[.\\]/g, '/');
    t = tryPath(joinPath(dir, p)) || tryPath(p);
    if (!t) { const segs = p.split('/'); while (!t && segs.length > 1) { segs.shift(); t = tryPath(segs.join('/')); } }
  } else if (r.kind === 'rust') {
    const segs = s.replace(/^(crate|self|super)::/, '').split('::');
    while (!t && segs.length) { t = tryPath(joinPath(dir, segs.join('/'))) || tryPath(segs.join('/')); segs.pop(); }
  } else if (r.kind === 'mod') { t = tryPath(joinPath(dir, s)); }
  else if (r.kind === 'go') {
    const segs = s.split('/');
    for (let k = Math.min(3, segs.length); k >= 1 && !t; k--) { const suf = segs.slice(-k).join('/'); for (const [d, fs] of byDir) if ((d === suf || d.endsWith('/' + suf)) && fs.length) { t = fs.find(x => x.lang === 'go') || fs[0]; break; } }
  } else if (s.startsWith('.') || r.kind === 'rel') t = tryPath(joinPath(dir, s));
  else if (s.startsWith('/')) t = tryPath(s);
  else t = tryPath(joinPath(dir, s)) || (s.includes('/') && !s.startsWith('@') ? tryPath(s) : null);
  if (!t && !s.startsWith('.') && f.lang !== 'js') { const stem = s.split(/[/.:\\]/).pop().toLowerCase(); const c = byStem.get(stem); if (c && c.length === 1) t = c[0]; }
  if (t && t !== f) return { file: t };
  return t === f ? null : { ext: r.spec };
}

/* ---------- project analysis (entry point) ---------- */

function analyzeProject(entries) {
  const files = entries.map(e => analyzeFile(e.path, e.text));
  const byPath = new Map(files.map(f => [f.path, f]));
  const byName = new Map(); const byStem = new Map(); const byClass = new Map(); const byDir = new Map();
  for (const f of files) {
    (byName.get(f.name) || byName.set(f.name, []).get(f.name)).push(f);
    const stem = f.name.replace(/\.[^.]+$/, '').toLowerCase();
    (byStem.get(stem) || byStem.set(stem, []).get(stem)).push(f);
    if (f.className) byClass.set(f.className, f);
    for (const c of f.classes) if (!c.css && !byClass.has(c.name)) byClass.set(c.name, f);
    const dir = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/')) : '';
    (byDir.get(dir) || byDir.set(dir, []).get(dir)).push(f);
  }
  const edges = []; const seenE = new Set();
  for (const f of files) { f.importsTo = []; f.external = []; f.importedBy = []; }
  for (const f of files) {
    const seen = new Set();
    for (const r of f.rawImports) {
      const res = resolveOne(r, f, byPath, byName, byStem, byClass, byDir); if (!res) continue;
      if (res.file) {
        if (seen.has(res.file.path)) continue;
        seen.add(res.file.path); f.importsTo.push(res.file); res.file.importedBy.push(f);
        const k = f.path + '>' + res.file.path; if (!seenE.has(k)) { seenE.add(k); edges.push({ from: f, to: res.file }); }
      }
      else if (!f.external.includes(res.ext) && f.external.length < 80) f.external.push(res.ext);
      if (res.file && r.kind === 'go') {
        const d = res.file.path.slice(0, res.file.path.lastIndexOf('/'));
        for (const g of byDir.get(d) || []) if (g !== f && g.lang === 'go' && !seen.has(g.path)) {
          seen.add(g.path); f.importsTo.push(g); g.importedBy.push(f);
          const k = f.path + '>' + g.path; if (!seenE.has(k)) { seenE.add(k); edges.push({ from: f, to: g }); }
        }
      }
    }
  }
  /* Same-package languages (Java, C#, Go, Kotlin, Swift) reference each other
     without imports: link by class name. We do this with one word-set per
     file so the O(n*m) is bounded. */
  const codeText = f => f.masked != null ? f.masked : f.src;
  const linesOf = f => f._mlines || (f._mlines = codeText(f).split('\n'));
  const wordsOf = f => f._words || (f._words = new Set((codeText(f).match(/[A-Za-z_]\w*/g) || []).slice(0, 12000)));
  const allClasses = [];
  for (const f of files) for (const c of f.classes) if (!c.css) allClasses.push(c);
  const classIdx = new Map(); const byNameAll = new Map();
  for (const c of allClasses) if (c.kind !== 'impl') (byNameAll.get(c.name) || byNameAll.set(c.name, []).get(c.name)).push(c);
  const shared = (a, b) => { const x = a.split('/'), y = b.split('/'); let n = 0; while (n < x.length - 1 && n < y.length - 1 && x[n] === y[n]) n++; return n; };
  const near = (name, f) => {
    const l = byNameAll.get(name); if (!l) return classIdx.get(name);
    if (l.length === 1 || !f) return l[0];
    let best = l[0], bs = -1;
    for (const c of l) { const sc = c.file === f ? 99 : shared(c.file.path, f.path); if (sc > bs) { bs = sc; best = c; } }
    return best;
  };
  for (const c of allClasses) if (c.kind !== 'impl' && !classIdx.has(c.name)) classIdx.set(c.name, c);
  for (const c of allClasses) if (c.kind === 'impl' && !classIdx.has(c.name)) classIdx.set(c.name, c);
  const addEdge = (a, b) => { if (!a || !b || a === b) return; const k = a.path + '>' + b.path; if (seenE.has(k)) return; seenE.add(k); edges.push({ from: a, to: b, implicit: true }); a.importsTo.push(b); b.importedBy.push(a); };
  if (classIdx.size && files.length <= 2500) {
    const names = [...classIdx.keys()].filter(n => n.length > 1);
    if (names.length <= 3000) for (const f of files) {
      if (f.lang === 'css' || f.lang === 'doc' || f.lang === 'data') continue;
      const words = wordsOf(f);
      for (const n of names) if (words.has(n)) {
        const c = near(n, f);
        if (c.file !== f && (!c.fileLevel || f.lang === c.file.lang)) addEdge(f, c.file);
      }
    }
  }
  const relations = []; const relSeen = new Set();
  const addRel = (a, b, kind, via) => { const k = a.name + '|' + b.name + '|' + kind; if (relSeen.has(k)) return; relSeen.add(k); relations.push({ from: a, to: b, kind, via }); };
  for (const c of allClasses) { c.extendsC = []; c.implementsC = []; c.has = []; c.uses = []; c.subclasses = []; c.implementors = []; }
  for (const c of allClasses) if (c.kind === 'impl') {
    const t = near(c.name, c.file);
    if (t && t !== c) t.methods.push(...c.methods.filter(m => !t.methods.includes(m)));
  }
  for (const f of files) if (f.lang === 'go') for (const fn of f.functions) if (fn.recv) {
    const t = near(fn.recv, f);
    if (t && !t.methods.includes(fn)) t.methods.push(fn);
  }
  for (const c of allClasses) {
    const me = c.kind === 'impl' ? (near(c.name, c.file) || c) : c;
    for (const nm of c.ext) { const t = near(nm, c.file); if (t && t !== me && !me.extendsC.includes(t)) { me.extendsC.push(t); t.subclasses.push(me); addRel(me, t, 'extends'); } }
    for (const nm of c.impl) {
      const t = near(nm, c.file);
      if (t && t !== me && !me.implementsC.includes(t)) {
        const k = /interface|protocol|trait/.test(t.kind) || c.kind === 'impl' ? 'implements' : 'extends';
        (k === 'extends' ? me.extendsC : me.implementsC).push(t);
        (k === 'extends' ? t.subclasses : t.implementors).push(me);
        addRel(me, t, k);
      }
    }
  }
  const goIfaces = allClasses.filter(c => c.file.lang === 'go' && c.kind === 'interface' && c.abstract && c.abstract.length);
  if (goIfaces.length) for (const t of allClasses) if (t.file.lang === 'go' && t.kind !== 'interface') {
    const ms = new Set(t.methods.map(m => m.name)); if (!ms.size) continue;
    for (const I of goIfaces) if (I.abstract.every(a => ms.has(a.name)) && !t.implementsC.includes(I) && shared(I.file.path, t.file.path) >= Math.min(I.file.path.split('/').length, t.file.path.split('/').length) - 2) {
      t.implementsC.push(I); I.implementors.push(t); addRel(t, I, 'implements');
    }
  }
  for (const c of allClasses) {
    if (c.kind === 'impl') continue;
    const seen = new Set();
    for (const v of c.fields) {
      const words = ((v.typeLine || linesOf(c.file)[v.line] || '').match(/[A-Za-z_]\w*/g) || []);
      for (const w of words) if (!seen.has(w) && w !== v.name && classIdx.has(w) && !TYPE_SKIP.has(w)) { seen.add(w); const t = near(w, c.file); if (t.kind === 'impl') continue; c.has.push(t); addRel(c, t, 'has', v.name); }
    }
    const skip = new Set([c.name, ...c.ext, ...c.impl, ...seen]);
    const words = new Set(linesOf(c.file).slice(c.start + 1, c.end + 1).join('\n').match(/[A-Za-z_]\w*/g) || []);
    for (const w of words) if (!skip.has(w) && classIdx.has(w)) { const t = near(w, c.file); if (t !== c && t.kind !== 'impl') { c.uses.push(t); addRel(c, t, 'uses'); } }
  }
  const calls = resolveCalls(files, classIdx, near, byDir);
  const totals = { files: files.length, lines: 0, fns: 0, classes: 0, vars: 0, links: edges.length, maxCx: 1, flows: 0 };
  for (const f of files) {
    totals.lines += f.lines;
    if (f.lang !== 'css') totals.fns += f.functions.length;
    totals.classes += f.classes.filter(c => !c.css && c.kind !== 'impl').length;
    totals.vars += f.variables.length;
    for (const fn of f.functions) { totals.maxCx = Math.max(totals.maxCx, fn.cx); totals.flows += (fn.reads || []).length + (fn.writes || []).length; }
  }
  totals.calls = calls.length;
  totals.recursive = files.reduce((n, f) => n + f.functions.filter(x => x.recursive).length, 0);
  return { files, edges, totals, classes: allClasses.filter(c => c.kind !== 'impl'), relations, classIdx, calls };
}

/* Call graph resolution. Walk the body of every function, find every
   call-shaped expression, and try to point it at a concrete function
   declaration. */
function resolveCalls(files, classIdx, near, byDir) {
  /* byDir: dir → files, built by analyzeProject. It used to be read from a
     module-level empty Map, which silently disabled same-package call
     linking for Go/Java/C#/Kotlin/Swift. Now passed in explicitly. */
  const nameIdx = new Map();
  for (const f of files) for (const fn of f.functions) {
    fn.calls = []; fn.calledBy = []; fn.callKind = new Map();
    if (f.lang === 'css') continue;
    (nameIdx.get(fn.name) || nameIdx.set(fn.name, []).get(fn.name)).push(fn);
  }
  const clsOf = fn => fn._c !== undefined ? fn._c : (fn._c = fn.cls ? (fn.file.classes.find(c => c.name === fn.cls && c.kind !== 'impl' && !c.css) || near(fn.cls, fn.file) || null) : null);
  const walkUp = c => { const out = [], q = [c], sn = new Set(); while (q.length) { const x = q.shift(); if (!x || sn.has(x)) continue; sn.add(x); out.push(x); q.push(...x.extendsC, ...x.implementsC); } return out; };
  const walkDown = c => { const out = [], st = [c], sn = new Set(); while (st.length) { const x = st.pop(); if (!x || sn.has(x)) continue; sn.add(x); out.push(x); st.push(...x.subclasses, ...x.implementors); } return out; };
  const ctorsOf = (cname, from) => {
    const c0 = near(cname, from); if (!c0) return [];
    for (const c of walkUp(c0)) {
      const hit = c.file.functions.filter(x => (x.cls === c.name || c.fileLevel && !x.parent) && (/^(constructor|__init__|_init|__construct|init)$/.test(x.name) || x.name === c.name));
      if (hit.length) return hit;
    }
    return [];
  };
  const afterSig = b => {
    const nl = b.indexOf('\n'); const first = nl >= 0 ? b.slice(0, nl) : b;
    const o = first.indexOf('(');
    if (o < 0) return nl >= 0 ? b.slice(nl + 1) : b.slice(Math.max(0, b.indexOf('=>') + 2));
    const close = k => { let d = 0, j = k; for (; j < b.length; j++) { if (b[j] === '(') d++; else if (b[j] === ')') { d--; if (!d) break; } } return j; };
    let j = close(o);
    if (/^\s*func\s*\(/.test(first)) { const o2 = b.indexOf('(', j + 1); if (o2 >= 0 && (nl < 0 || o2 < nl)) j = close(o2); }
    return b.slice(j + 1);
  };
  const calls = [];
  for (const f of files) {
    if (f.lang === 'css') continue;
    const imp = new Set(f.importsTo);
    if (/^(go|c|kt|swift)$/.test(f.lang) && !/^(c|h|cpp|cc|hpp)$/.test(f.ext)) {
      const d = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/')) : '';
      for (const g of byDir.get(d) || []) if (g.lang === f.lang) imp.add(g);
    }
    for (const fn of f.functions) {
      if (!fn.body) continue;
      const text = afterSig(fn.body); const me = clsOf(fn);
      const params = paramNames(fn.sig);
      const link = (ts, kind) => {
        if (ts.length > 1) { const conc = ts.filter(t => !t.abstract); if (conc.length) ts = conc; }
        for (const t of ts.slice(0, 8)) {
          if (t === fn) { fn.recursive = true; continue; }
          if (t === fn.parent || fn.calls.includes(t)) continue;
          fn.calls.push(t); fn.callKind.set(t, kind); t.calledBy.push(fn);
          calls.push({ from: fn, to: t, kind });
        }
      };
      const re = /(\bnew\s+)?(?:([A-Za-z_$][\w$]*|[)\]"'`])\s*(?:\?\.|\.|->|::)\s*)?([A-Za-z_$][\w$]*)\s*\(/g;
      let mm; const seenK = new Set();
      while ((mm = re.exec(text)) && fn.calls.length < 60) {
        const isNew = !!mm[1]; let recv = mm[2] || null; const n = mm[3];
        if (recv === ')' && /super\s*\(\s*$/.test(text.slice(Math.max(0, mm.index - 10), mm.index))) recv = 'super';
        const key = (isNew ? 'new ' : '') + (recv || '') + '.' + n; if (seenK.has(key)) continue; seenK.add(key);
        if (!isNew && CALL_SKIP_SET.has(n)) continue;
        /* Calling a parameter (a callback) is not a call to some function
           that happens to share its name, and never recursion. */
        if (!isNew && !recv && params.has(n)) continue;
        if (isNew || n === 'new' && recv && classIdx.has(recv) || !recv && /^[A-Z]/.test(n) && classIdx.has(n) && f.lang !== 'go') {
          const ct = ctorsOf(n === 'new' ? recv : n, f);
          if (ct.length) { link(ct, 'new'); continue; }
          if (isNew || n === 'new') continue;
        }
        const cands = nameIdx.get(n); if (!cands) continue;
        let targets = [], kind = 'call';
        /* A bare `name()` inside a method only calls that method in languages
           with an implicit `this` (Java, C#, Kotlin, C++, GDScript, Ruby…). In
           JS/TS, PHP, Python, Lua, Go and Rust it calls a free function, so
           `req.accepts = function () { return accepts(this) }` and an object
           method `{ use(x) { return use(x) } }` are not recursion. */
        const bareIsSelf = !recv && !((fn.cls || fn.member) && NO_IMPLICIT_SELF.has(f.lang));
        if ((bareIsSelf || recv === 'this' || recv === 'self' || recv === '$this' || fn.recvVar && recv === fn.recvVar) && n === fn.name && cands.includes(fn)) { fn.recursive = true; continue; }
        const selfRecv = recv && (recv === 'this' || recv === 'self' || recv === '$this' || recv === 'super' || fn.recvVar && recv === fn.recvVar);
        if (!recv || selfRecv) {
          if (me) {
            const up = walkUp(me); const from = recv === 'super' ? up.slice(1) : up;
            for (const k of from) { const hit = cands.filter(x => x !== fn && clsOf(x) === k); if (hit.length) { targets = hit; break; } }
            if (recv !== 'super') {
              const down = walkDown(me).slice(1);
              const poly = cands.filter(x => down.includes(clsOf(x)) && !targets.includes(x));
              if (poly.length) { if (!targets.length) kind = 'poly'; targets.push(...poly); }
            }
          }
          if (!targets.length && !selfRecv) targets = cands.filter(x => x !== fn && x.file === f && (!x.cls || !me && f.lang !== 'js'));
          if (!targets.length && !selfRecv) targets = cands.filter(x => !x.cls && imp.has(x.file));
          if (!targets.length && selfRecv && !me) targets = cands.filter(x => x.file === f && x !== fn);
        } else {
          const r = recv.replace(/^\$/, ''); const rl = r.toLowerCase().replace(/[_-]/g, '');
          const hint = new Set();
          if (me) for (const k of walkUp(me)) for (const v of k.fields) if (v.name === r) for (const w of (v.typeLine || '').match(/[A-Za-z_]\w*/g) || []) hint.add(w);
          for (const v of f.variables) if (!v.cls && v.name === r) for (const w of (linesOf(f)[v.line] || '').match(/[A-Za-z_]\w*/g) || []) hint.add(w);
          if (fn.sig) {
            const pm = new RegExp('(?:\\$?\\b' + reEsc(r) + '\\s*:\\s*([\\w.<>\\[\\]|, ]+))|(?:([\\w.<>\\[\\]]+)\\s+\\*?\\$?' + reEsc(r) + '\\b)').exec(fn.sig);
            if (pm) for (const w of (pm[1] || pm[2]).match(/[A-Za-z_]\w*/g) || []) hint.add(w);
          }
          const lm = new RegExp('(?:\\b' + reEsc(r) + '\\s*(?::=|=|:\\s*[\\w.<>\\[\\]]+\\s*=)\\s*(?:new\\s+|&)?([A-Z]\\w*))|(?:\\b([A-Z]\\w*)(?:<[^>]*>)?\\s+' + reEsc(r) + '\\s*[=;:])').exec(text);
          if (lm) hint.add(lm[1] || lm[2]);
          for (const h of [...hint]) { const hc = classIdx.has(h) ? near(h, f) : null; if (hc) for (const a of walkUp(hc)) hint.add(a.name); }
          const fuzzy = [];
          for (const x of cands) {
            const xc = clsOf(x);
            if (!x.cls || x.luaOwner) {
              const stem = x.file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[_-]/g, '');
              if ((stem === rl || x.luaOwner === r) && (imp.has(x.file) || x.file === f)) targets.push(x);
              continue;
            }
            const tn = xc ? walkUp(xc).flatMap(a => [a.name, ...a.ext, ...a.impl]) : [x.cls];
            const cl = x.cls.toLowerCase();
            if (tn.some(t => hint.has(t)) || r === x.cls || x.file.fileClass === r || x.file.className === r) targets.push(x);
            else if (x !== fn && rl.length >= 3 && (cl.includes(rl) || rl.includes(cl))) fuzzy.push(x);
          }
          if (!targets.length && fuzzy.length && new Set(fuzzy.map(x => x.cls)).size === 1) targets = fuzzy;
          if (targets.includes(fn) && !(hint.has(fn.cls) || r === fn.cls)) targets = targets.filter(x => x !== fn);
          if (kind === 'poly' || targets.length > 1) targets = targets.filter(x => x !== fn || hint.has(fn.cls));
          if (targets.length > 1) {
            const exact = targets.filter(x => hint.has(x.cls) && !x.abstract);
            if (exact.length) targets = exact; else kind = 'poly';
          }
          if (!targets.length) {
            const words = wordsOf(f);
            const mc = cands.filter(x => x.cls && x !== fn && clsOf(x));
            if (mc.length && mc.length <= 12) {
              targets = mc.filter(x => walkUp(clsOf(x)).slice(1).some(a => words.has(a.name)));
              if (targets.length) kind = 'poly';
            }
          }
          if (!targets.length && cands.length <= 2) targets = cands.filter(x => !x.cls && x !== fn && imp.has(x.file));
        }
        link(targets, kind);
      }
    }
  }
  return calls;
}

const CALL_SKIP_SET = new Set('if for while switch catch function return with typeof new await sizeof elif foreach using lock fixed unless until loop match yield delete void throw case in of instanceof super import require assert print defer go select when not and or lambda elsif rescue ensure is as'.split(' '));
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const linesOf = f => f._mlines || (f._mlines = (f.masked != null ? f.masked : f.src).split('\n'));
const wordsOf = f => f._words || (f._words = new Set((f.masked != null ? f.masked : f.src).match(/[A-Za-z_]\w*/g) || []));

function resolveRef(project, ref) {
  const [path, sym] = ref.split('#');
  const file = project.files.find(f => f.path === path) || project.files.find(f => f.path.endsWith('/' + path));
  if (!file) return null;
  if (!sym) return { file };
  if (sym.includes('.')) {
    const [cn, mn] = [sym.slice(0, sym.lastIndexOf('.')), sym.slice(sym.lastIndexOf('.') + 1)];
    const fn = file.functions.find(f => f.name === mn && (f.cls === cn || f.cls && f.cls.endsWith('.' + cn) || (file.fileClass === cn && !f.parent)));
    if (fn) return { file, fn };
    return null;
  }
  const cls = file.classes.find(c => c.name === sym && !c.css && c.kind !== 'impl') || file.classes.find(c => c.name === sym);
  const fn = file.functions.find(f => f.name === sym && !f.parent) || file.functions.find(f => f.name === sym);
  if (cls) return { file, cls, fn: null };
  if (fn) return { file, fn };
  const v = file.variables.find(x => x.name === sym);
  if (v) return { file, v };
  return null;
}

export const SoftwareCity = { analyzeProject, analyzeFile, resolveRef, EXT, EXT_NAME: EXT_N };
if (typeof window !== 'undefined') window.SoftwareCity = SoftwareCity;
export { analyzeProject, analyzeFile, resolveRef, EXT, EXT_N as EXT_NAME };
