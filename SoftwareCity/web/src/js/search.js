/* Debounced, ranked search across files, functions, classes and variables.
   Ranks name matches above body matches, and exact-prefix matches above
   substring matches. Fuzzy matching is used as a fallback for typos.

   Public API:
     Search.buildIndex(project)   - precomputes lookup tables
     Search.run(query)            - returns ranked results
     Search.debouncedRun(query)   - same, with a 100ms debounce
     Search.clear()
   The search itself is delegated to the running app; this module only
   owns the matching algorithm. */

const rank = (() => {
  /* A tiny ranking table.
     1000 - name exact match
     800  - name case-insensitive exact
     600  - name prefix
     400  - name substring
     300  - signature
     200  - file path
     100  - fuzzy (typo-tolerant)
     0    - no match
  */
  return {
    exact: 1000,
    iexact: 800,
    prefix: 600,
    contains: 400,
    sig: 300,
    path: 200,
    fuzzy: 100
  };
})();

let idx = null;          // {files, fns, classes, vars}
let timer = 0;

function buildIndex(project) {
  idx = {
    files: project.files,
    fns: [],
    classes: [],
    vars: []
  };
  for (const f of project.files) {
    for (const fn of f.functions) idx.fns.push({ fn, file: f, name: fn.name, cls: fn.cls || '', sig: fn.sig || '' });
    for (const c of f.classes) idx.classes.push({ cls: c, file: f, name: c.name });
    for (const v of f.variables) idx.vars.push({ v, file: f, name: v.name });
  }
  return idx;
}

function clear() { idx = null; }

/* Scoring one candidate against one query. Returns the best score, or 0. */
function score(query, lc, name, sig, path) {
  if (name === query) return rank.exact;
  if (name.toLowerCase() === lc) return rank.iexact;
  if (name.toLowerCase().startsWith(lc)) return rank.prefix;
  if (name.toLowerCase().includes(lc)) return rank.contains;
  if (sig && sig.toLowerCase().includes(lc)) return rank.sig;
  if (path && path.toLowerCase().includes(lc)) return rank.path;
  if (fuzzy(name.toLowerCase(), lc)) return rank.fuzzy;
  return 0;
}

/* Tiny Levenshtein for fuzzy. Only used as a fallback for the most
   common case (one or two typos in a short name), and only when no
   substring match exists. The cost of returning false for a longer
   string is one extra walk, so we cap name length here. */
function fuzzy(a, b) {
  if (Math.abs(a.length - b.length) > 3) return false;
  if (a.length > 40 || b.length > 40) return false;
  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length] <= Math.max(1, Math.floor(b.length / 4));
}

function run(q) {
  if (!idx) return { files: new Set(), fns: new Set(), classes: [], text: '' };
  q = (q || '').trim();
  if (!q) return { files: new Set(), fns: new Set(), classes: [], text: '' };
  const lc = q.toLowerCase();
  const files = new Set(); const fns = new Set(); const classes = [];
  /* Score all candidates, keep top 200. */
  const all = [];
  for (const x of idx.fns) {
    const s = score(q, lc, x.name, x.sig, x.file.path + (x.cls ? '#' + x.cls : ''));
    if (s) all.push({ kind: 'fn', s, x });
  }
  for (const x of idx.classes) {
    const s = score(q, lc, x.name, '', x.file.path);
    if (s) all.push({ kind: 'class', s, x });
  }
  for (const f of idx.files) {
    const s = score(q, lc, f.name, '', f.path);
    if (s) all.push({ kind: 'file', s, x: { file: f, name: f.name } });
  }
  all.sort((a, b) => b.s - a.s || a.x.name.length - b.x.name.length);
  for (const r of all.slice(0, 200)) {
    if (r.kind === 'fn') { fns.add(r.x.fn); files.add(r.x.file); }
    else if (r.kind === 'class') { classes.push(r.x); files.add(r.x.file); }
    else { files.add(r.x.file); }
  }
  const text = fns.size + ' function' + (fns.size === 1 ? '' : 's') + ', ' + files.size + ' file' + (files.size === 1 ? '' : 's');
  return { files, fns, classes, text };
}

function debouncedRun(q, delay = 100) {
  clearTimeout(timer);
  return new Promise(resolve => {
    timer = setTimeout(() => resolve(run(q)), delay);
  });
}

export const Search = { buildIndex, run, debouncedRun, clear };
