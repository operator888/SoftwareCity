/* Data flow analysis: which functions read or write which variables in a file.
   We use a regex-based scan of the function body, with two refinements:
     - for class methods, the same name with a `this.`, `self.`, `@`, or
       `$this->` prefix is a class field write
     - mutating methods (.push, .append, .set, etc.) are also writes
   Returns nothing — mutates each function with .reads and .writes, and each
   variable with .readers and .writers. */

const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* The text after the parameter list, so the parameters and the signature
   don't get mistaken for calls or reads. */
function afterSig(b) {
  const nl = b.indexOf('\n'); const first = nl >= 0 ? b.slice(0, nl) : b;
  const o = first.indexOf('(');
  if (o < 0) return nl >= 0 ? b.slice(nl + 1) : b.slice(Math.max(0, b.indexOf('=>') + 2));
  const close = k => { let d = 0, j = k; for (; j < b.length; j++) { if (b[j] === '(') d++; else if (b[j] === ')') { d--; if (!d) break; } } return j; };
  let j = close(o);
  if (/^\s*func\s*\(/.test(first)) { const o2 = b.indexOf('(', j + 1); if (o2 >= 0 && (nl < 0 || o2 < nl)) j = close(o2); }
  return b.slice(j + 1);
}

const MUT = '(?:[+\\-*/%|&]?=(?!=)|\\+\\+|--|\\.(?:push|append|add|set|insert|remove|pop|clear|erase|delete|splice|extend|update|put|shift|unshift|appendleft|popleft|discard|setdefault)\\s*\\()';

export function dataFlow(F) {
  if (!F.variables.length || !F.functions.length) return;
  const isCss = F.lang === 'css';
  const fileVars = F.variables.filter(v => !v.cls && v.kind !== 'id' && v.kind !== 'signal');
  for (const fn of F.functions) {
    fn.reads = []; fn.writes = [];
    const b = fn.body; if (!b) continue;
    const inner = isCss ? b : afterSig(b);
    const own = fn.cls ? F.variables.filter(v => v.cls === fn.cls && v.kind !== 'signal') : [];
    const selfP = '(?:\\bthis\\s*\\.|\\bself\\s*\\.|@|\\$this\\s*->' + (fn.recvVar ? '|\\b' + reEsc(fn.recvVar) + '\\s*\\.' : '') + ')\\s*';
    const MEMBER = '(?:\\s*\\[[^\\]\\n]*\\]|\\s*\\.\\s*[\\w$]+(?!\\s*\\())*';
    const check = (v, pref) => {
      const nm = reEsc(v.name);
      const ref = pref ? new RegExp(selfP + nm + '(?![\\w$-])') : new RegExp('(?<![\\w$.#>-])' + nm + '(?![\\w$-])');
      let bareOk = false;
      if (!ref.test(inner)) {
        if (pref && (F.lang === 'gd' || F.lang === 'c' || F.lang === 'kt' || F.lang === 'swift' || F.lang === 'rb')) {
          const bare = new RegExp('(?<![\\w$.@])' + nm + '(?![\\w$(])');
          if (!bare.test(inner)) return;
          bareOk = true;
        } else return;
      }
      if (!pref && new RegExp('\\b(?:const|let|var|val|local|auto)\\s+' + nm + '\\b').test(inner)) return;
      const lead = pref ? (bareOk ? '(?:' + selfP + ')?(?<![\\w$.])' : selfP) : '(?<![\\w$.#>-])';
      const w = isCss ? new RegExp('(?<![\\w-])' + nm + '\\s*:') : new RegExp(lead + nm + MEMBER + '\\s*' + MUT + '|(?:\\+\\+|--)' + lead + nm + '\\b');
      const r = isCss ? new RegExp('var\\(\\s*' + nm + '\\b') : null;
      const writes = w.test(inner);
      const reads = isCss ? r.test(inner) : (inner.replace(new RegExp(lead + nm + MEMBER + '\\s*' + MUT, 'g'), '').match(new RegExp((pref ? lead : '(?<![\\w$.#>-])') + nm + '(?![\\w$-])')) != null);
      if (writes) fn.writes.push(v);
      if (reads || !writes) fn.reads.push(v);
    };
    for (const v of fileVars) check(v, false);
    for (const v of own) check(v, true);
    for (const v of fn.writes) (v.writers = v.writers || []).push(fn);
    for (const v of fn.reads) (v.readers = v.readers || []).push(fn);
  }
  return { vars: F.variables.length, flows: F.functions.reduce((n, f) => n + (f.reads?.length || 0) + (f.writes?.length || 0), 0) };
}
