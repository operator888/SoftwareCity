/* Class header parsing: given the text between the class keyword and the
   opening brace (or the end of the line for bodyless declarations), extract
   the extends / implements list, the primary-constructor parameters, and the
   kind (class, struct, interface, enum, etc.).

   This is shared across brace-language parsers (Java, C#, Kotlin, Swift,
   Go, Rust, PHP, etc.) and the body of `heritage` here is what was inlined
   in the original parser, but factored into its own module with a smaller
   public surface so it can be tested in isolation. */

import { lastSeg, splitTypes, splitTop } from './parser-regexes.js';
import { matchClose } from './parser-mask.js';

/* Read the header of a class/interface/struct/... declaration starting at pos.
   Returns { text, end, brace } where end is the offset of the opening brace
   (or the end of the declaration header if no brace follows on this line). */
export function scanHeader(m, pos) {
  let p = 0, last = '';
  for (let j = pos; j < m.length && j < pos + 1500; j++) {
    const ch = m[j];
    if (ch === '(' || ch === '[') p++;
    else if (ch === ')' || ch === ']') p--;
    else if (p <= 0 && ch === '{') return { text: m.slice(pos, j), end: j, brace: true };
    else if (p <= 0 && ch === ';') return { text: m.slice(pos, j), end: j, brace: false };
    else if (p <= 0 && ch === '\n') {
      const nx = m.slice(j + 1, j + 80).trimStart();
      if (!/[,:(<]$/.test(last) && !/^(?:[:,{(]|extends\b|implements\b|where\b|with\b)/.test(nx)) return { text: m.slice(pos, j), end: j - 1, brace: false };
    }
    if (ch > ' ') last = ch;
  }
  return { text: '', end: pos, brace: false };
}

/* Pull off the leading "( ... )" of a header, used for Kotlin/C#/Java record
   primary constructors. Returns { params, rest } where `params` is the text
   inside the parens and `rest` is what comes after. */
export function ctorParams(h) {
  const t = h.replace(/^\s*<[^>]*>/, '');
  const s0 = t.search(/\S/);
  if (s0 < 0 || t[s0] !== '(') return { params: null, rest: h };
  let d = 0, j = s0;
  for (; j < t.length; j++) {
    if (t[j] === '(') d++;
    else if (t[j] === ')') { d--; if (!d) break; }
  }
  return { params: t.slice(s0 + 1, j), rest: t.slice(j + 1) };
}

/* Class heritage. For each language we normalise "extends X implements Y"
   into separate arrays. The decision of "which is the parent class and
   which is the implemented interface" depends on the language:
     - Java:    first extends, then implements
     - C#:      a class is either extends OR implements; a class is never
                both. I[A-Z] names are interfaces.
     - Kotlin:  a class with parens is the parent (Foo() : Base), the rest
                are interfaces. With colon: first is the parent.
     - Swift:   first is the parent class (only for class declarations).
     - TS/Go/Php/Python/Ruby/Scala: first is the parent, the rest implement. */
export function heritage(lang, ext, rest, kind) {
  const out = { ext: [], impl: [] };
  if (!rest) return out;
  rest = rest.replace(/\s+/g, ' ').replace(/\{.*$/, '').replace(/\bwhere\b.*$/, '').trim();
  let m;
  if ((m = /\bextends\s+(.+?)(?=\bimplements\b|\bwith\b|$)/.exec(rest))) (kind === 'interface' ? out.impl : out.ext).push(...splitTypes(m[1]));
  if ((m = /\bimplements\s+(.+)$/.exec(rest))) out.impl.push(...splitTypes(m[1]));
  if ((m = /\bwith\s+(.+?)(?=\bimplements\b|$)/.exec(rest))) out.impl.push(...splitTypes(m[1]));
  if (!out.ext.length && !out.impl.length && (m = /^\s*:\s*([^=]+)/.exec(rest))) {
    const raw = splitTop(m[1]);
    raw.forEach((r, i) => {
      const t = splitTypes(r.replace(/\(.*\)/, ''))[0]; if (!t) return;
      const paren = /\(/.test(r);
      const nm = t.replace('()', '');
      if (lang === 'kt') (paren ? out.ext : out.impl).push(nm);
      else if (ext === 'cs') (/^I[A-Z]/.test(lastSeg(nm)) || i > 0 && out.ext.length ? out.impl : out.ext).push(nm);
      else if (lang === 'swift') (i === 0 && kind === 'class' ? out.ext : out.impl).push(nm);
      else (i === 0 ? out.ext : out.impl).push(nm);
    });
  }
  out.ext = out.ext.map(x => lastSeg(x.replace('()', '')));
  out.impl = out.impl.map(x => lastSeg(x.replace('()', '')));
  return out;
}

/* For bodyless declarations (Kotlin/Swift interfaces, Java/C# records),
   skip past the body. We don't need the body for those — the parser will
   pick up the methods/fields from inside. We do need to advance past the
   end so we don't re-parse them. */
export function skipBodyless(m, pos) {
  return matchClose(m, pos) === m.length - 1 ? m.length - 1 : matchClose(m, pos);
}
