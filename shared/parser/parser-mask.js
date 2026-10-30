/* Tokenising helpers used by the parser.
   Two functions:
     mask(src, fam, lang)   - replace comments and string contents with spaces,
                              so that braces, brackets and other syntax markers
                              inside them are not miscounted.
     findBody(m, pos, ...)  - from a position right after a function header,
                              find the offset where the body ends.
   These used to be inlined in the parser. They are extracted here so the
   parser itself can focus on the language-specific shape detection. */

import { KW } from './parser-constants.js';

/* Find the matching closing brace/bracket for an opening one. Returns the
   index of the matching close, or src.length - 1 if no match (we still
   produce a body, just truncated). */
function matchClose(src, open) {
  const close = open === '{' ? '}' : open === '(' ? ')' : open === '[' ? ']' : open === '<' ? '>' : null;
  if (!close) return -1;
  let depth = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      i = skipString(src, i, c);
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      i = src.indexOf('\n', i);
      if (i < 0) return src.length - 1;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const j = src.indexOf('*/', i + 2);
      if (j < 0) return src.length - 1;
      i = j + 1;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return i; }
  }
  return src.length - 1;
}

function skipString(src, start, quote) {
  const triple = quote !== '`' && src.substr(start, 3) === quote.repeat(3);
  if (triple) {
    const j = src.indexOf(quote.repeat(3), start + 3);
    return j < 0 ? src.length - 1 : j + 2;
  }
  const multi = quote === '`';
  let i = start + 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') { i += 2; continue; }
    if (c === quote) return i;
    if (c === '\n' && !multi) return i - 1;
    i++;
  }
  return src.length - 1;
}

/* Mask comments and string contents with spaces, keeping structure intact.
   `fam` is the family (brace/indent/css/hash) and `lang` is the language id
   so we can pick the right comment syntax. */
export function mask(src, fam, lang) {
  const out = src.split('');
  const n = src.length;
  const slash = fam === 'brace' || fam === 'css';
  const hash = fam === 'indent' && lang !== 'lua' || fam === 'hash' || lang === 'php';
  let i = 0, prev = '\n';
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (src[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (slash && fam !== 'css' && c === '/' && d === '/') { let j = src.indexOf('\n', i); if (j < 0) j = n; blank(i, j); i = j; continue; }
    if (slash && c === '/' && d === '*') { let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; blank(i, j); i = j; continue; }
    if (hash && c === '#' && !(lang === 'php' && d === '[')) { let j = src.indexOf('\n', i); if (j < 0) j = n; blank(i, j); i = j; continue; }
    if (lang === 'lua' && c === '-' && d === '-') { let j = src.indexOf('\n', i); if (j < 0) j = n; blank(i, j); i = j; continue; }
    if (lang === 'js' && c === '/' && '(,=:[!&|?{};+-*%<>~^'.includes(prev)) {
      let j = i + 1, cls = false;
      while (j < n && src[j] !== '\n') { const ch = src[j]; if (ch === '\\') { j += 2; continue; } if (ch === '[') cls = true; else if (ch === ']') cls = false; else if (ch === '/' && !cls) break; j++; }
      if (j < n && src[j] === '/') { blank(i, j + 1); i = j + 1; prev = 'x'; continue; }
    }
    if (c === '"' || c === "'" || c === '`') {
      const close = skipString(src, i, c);
      blank(i + 1, close); i = close + 1; prev = 'x'; continue;
    }
    if (c !== ' ' && c !== '\t' && c !== '\r') prev = c;
    i++;
  }
  return out.join('');
}

/* From a position right after a function header, find the offset where the
   body ends. Returns -1 if no body was found. `lenient` lets us return the
   end of a same-line statement (`;`) for languages where braces are rare. */
export function findBody(m, pos, lenient) {
  let p = 0, last = '', expr = false;
  for (let j = pos; j < m.length && j < pos + 3000; j++) {
    const ch = m[j];
    /* An arrow with an expression body (`=> call(x)`, not `=> {`) ends where
       that expression ends: at a top-level ';' or ',', at a bracket that
       closes something opened before it, or at a line break that no operator
       continues. A ')' at the end of a line does NOT continue it here, or the
       body would run on into the next statement. */
    if (expr) {
      if (ch === '(' || ch === '[' || ch === '{') p++;
      else if (ch === ')' || ch === ']' || ch === '}') { if (--p < 0) return j - 1; }
      else if ((ch === ';' || ch === ',') && p <= 0) return j - 1;
      else if (ch === '\n' && p <= 0) {
        const next = m.slice(j + 1, j + 60).trimStart()[0] || '';
        if (!/[=>,(|&+\-?:]/.test(last) && !'.?:|&+-*/'.includes(next)) return j - 1;
      }
      if (ch > ' ') last = ch;
      continue;
    }
    if (ch === '>' && m[j - 1] === '=' && p <= 0 && lenient) {
      const rest = m.slice(j + 1, j + 200).trimStart();
      if (rest[0] !== '{') { expr = true; last = '>'; continue; }
    }
    if (ch === '(' || ch === '[') p++;
    else if (ch === ')' || ch === ']') p--;
    else if (ch === ';' && p <= 0) return lenient ? j : -1;
    else if (ch === '{' && p <= 0) {
      /* Walk forward from this '{' looking for its matching '}', respecting
         nested braces and string/comment contents. We can't use matchClose
         because that function starts from offset 0. */
      let depth = 1;
      let k = j + 1;
      while (k < m.length) {
        const c = m[k];
        if (c === '"' || c === "'" || c === '`') { k = skipString(m, k, c) + 1; continue; }
        if (c === '/' && m[k + 1] === '/') {
          const nl = m.indexOf('\n', k);
          k = nl < 0 ? m.length : nl + 1; continue;
        }
        if (c === '/' && m[k + 1] === '*') {
          const end = m.indexOf('*/', k + 2);
          k = end < 0 ? m.length : end + 2; continue;
        }
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) return k; }
        k++;
      }
      return -1;
    }
    else if (ch === '\n' && p <= 0) {
      const next = m.slice(j + 1, j + 60).trimStart()[0] || '';
      if (!(/[)=>,:(|&+\-]/.test(last)) && !'{:-.='.includes(next)) return lenient ? j - 1 : -1;
    }
    if (ch > ' ') last = ch;
  }
  return -1;
}

export { matchClose, skipString };
