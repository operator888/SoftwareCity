/* Software City core: shared state, event bus, small helpers used everywhere.
   Bundled into the app's IIFE; accessible as window.App at runtime. */

import { FAMILIES } from '../../../../shared/families.js';

const listeners = Object.create(null);

const App = {
  project: null,
  projectName: '',
  source: null,                          // {kind:'demo', pattern, demo} | {kind:'user'}
  sel: null,
  selFn: null,
  selCls: null,
  lesson: null,                          // {pattern, demo}
  roles: null,                           // {list, files, fns, clsByName}
  roleFocus: null,
  trace: null,                           // {steps, i, playing}
  view: 'city',
  config: {
    maxFiles: 2500,                      // soft cap for the file picker / folder
    maxPipes: 1600,                      // cap on simultaneous pipes
    maxBytesPerFile: 900_000,            // 900kB, skip larger
    maxLocals: 200,                      // cap for body-local extraction
    maxWordsPerFile: 8000                // for same-package class-name linking
  },

  on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
  emit(evt, data) {
    for (const fn of listeners[evt] || []) {
      try { fn(data); } catch (e) { console.error('[' + evt + ']', e); }
    }
  }
};

App.$ = s => document.querySelector(s);
App.$$ = s => Array.from(document.querySelectorAll(s));
App.esc = s => String(s == null ? '' : s)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
App.REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
App.RAMP = ['#1e5f8f', '#2a7fb0', '#3aa0c8', '#7fc4d9', '#d8d0a8', '#ffbf5a', '#ff8f5a', '#ff5e57'];
App.CX_T = [1, 3, 5, 8, 12, 18, 26];
App.bucket = cx => { let b = 0; while (b < App.CX_T.length && cx > App.CX_T[b]) b++; return b; };
App.ROLE_COLORS = ['#ffbf5a', '#7ee0b5', '#ff7a64', '#c3a6ff', '#ffe27a', '#6fd3ff'];
/* Family codes and blurbs come from the shared table (shared/families.js)
   so the web, Patrol and Edu never disagree on a family's letter or name. */
App.FAMILY_INFO = Object.fromEntries(FAMILIES.map(f => [f.name, { id: f.id, code: f.code, blurb: f.blurb }]));
App.fnLabel = fn => (fn.cls && fn.name !== fn.cls ? fn.cls + '.' : '') + fn.name;

/* Tiny syntax colouriser for the code viewer. Operates on escaped text line by line. */
const KWS = new Set(
  ('abstract async await break case catch class const constructor continue def default defer delete do elif else enum export extends extern final finally fn for foreach from func function go if impl implements import in interface is lambda let match module mut namespace new nil null object override package pass private protected pub public raise return self signal static struct super switch this throw throws trait true false try type typeof use val var void when where while with yield onready export None True False'
  ).split(' ')
);
App.highlight = function (line, lang) {
  let out = '', i = 0; const n = line.length;
  const hashC = /^(py|gd|rb|sh)$/.test(lang), slashC = !hashC || lang === 'php';
  while (i < n) {
    const c = line[i];
    if ((slashC && c === '/' && line[i + 1] === '/') || (hashC && c === '#') || (lang === 'lua' && c === '-' && line[i + 1] === '-')) {
      out += '<span class="cm">' + App.esc(line.slice(i)) + '</span>';
      break;
    }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && line[j] !== c) { if (line[j] === '\\') j++; j++; }
      out += '<span class="st">' + App.esc(line.slice(i, j + 1)) + '</span>';
      i = j + 1; continue;
    }
    if (/[A-Za-z_@$]/.test(c)) {
      let j = i + 1;
      while (j < n && /[\w$]/.test(line[j])) j++;
      const w = line.slice(i, j);
      out += KWS.has(w.replace(/^@/, '')) ? '<span class="kw">' + App.esc(w) + '</span>' : App.esc(w);
      i = j; continue;
    }
    out += App.esc(c); i++;
  }
  return out;
};
App.codeBlock = function (file, from, to, max) {
  const lines = file.src.split('\n');
  const end = Math.min(to, from + (max || 80) - 1);
  let h = '';
  for (let i = from; i <= end && i < lines.length; i++) h += '<span class="ln">' + (i + 1) + '</span>' + App.highlight(lines[i], file.lang) + '\n';
  if (to > end) h += '<span class="ln"></span><span class="cm">… ' + (to - end) + ' more lines</span>\n';
  return '<pre class="src">' + h + '</pre>';
};

/* Toast notifications. Errors stay longer. */
let toastT = 0;
App.toast = function (msg, isErr) {
  const el = App.$('#toast');
  el.textContent = msg; el.hidden = false;
  el.classList.toggle('err', !!isErr);
  clearTimeout(toastT);
  toastT = setTimeout(() => { el.hidden = true; }, isErr ? 7000 : 4500);
};

/* findPattern: look up a pattern by id (or alias) in the loaded library. */
App.findPattern = id => {
  const lib = window.CP_LIBRARY;
  if (!lib || !id) return null;
  return lib.patterns.find(p => p.id === id) || lib.patterns.find(p => (p.aka || []).includes(id)) || null;
};

export { App };

if (typeof window !== 'undefined') window.App = App;
