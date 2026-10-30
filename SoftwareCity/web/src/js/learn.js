/* Software City learn: the pattern library sheet, the lesson panel, roles,
   narrated traces and quizzes. */

import { App } from './core.js';
import { store } from './store.js';
import { SoftwareCity } from './parser.js';

const LIB = window.CP_LIBRARY || { families: [], patterns: [] };
const Learn = window.Learn = {};
/* Was missing: every template below calls esc(), which threw a
   ReferenceError the moment the library sheet or a lesson rendered. */
const esc = App.esc;
const cache = new Map();
const visited = new Set(store.get('visited', []));
const markVisited = id => { visited.add(id); store.set('visited', [...visited]); };

Learn.demoEntries = d => Object.entries(d.files).map(([path, text]) => ({ path, text }));
Learn.projectFor = d => { if (!cache.has(d.id)) cache.set(d.id, SoftwareCity.analyzeProject(Learn.demoEntries(d))); return cache.get(d.id); };
const codeOf = p => { const fam = App.FAMILY_INFO[p.family]; const list = LIB.patterns.filter(x => x.family === p.family); return (fam ? fam.code : '?') + '-' + String(list.indexOf(p) + 1).padStart(2, '0'); };
Learn.codeOf = codeOf;

let libFilter = { q: '', lang: '' };
Learn.renderLibrary = function () {
  const el = App.$('#library');
  const nDemos = LIB.patterns.reduce((n, p) => n + p.demos.length, 0);
  const nReal = LIB.patterns.reduce((n, p) => n + p.demos.filter(d => d.source).length, 0);
  const langs = [...new Set(LIB.patterns.flatMap(p => p.demos.map(d => d.lang)))].sort();
  let h = '<div class="inner"><div class="libhead"><div><h1>How code is built</h1><p>Every pattern here opens as a living city: buildings are files, floors are functions, pipes carry calls and data. Pick one, press Play, and follow the trace through the code.</p></div>' +
    '<div class="meta"><b>' + LIB.patterns.length + '</b> patterns · <b>' + nDemos + '</b> demos<br><b>' + nReal + '</b> from real open-source projects<br><b>' + visited.size + '</b> demos explored</div></div>' +
    '<div class="libtools"><input id="libSearch" type="search" placeholder="Search patterns, e.g. undo, events, Godot" value="' + esc(libFilter.q) + '" aria-label="Search patterns">' +
    '<select id="libLang" class="dsel" aria-label="Language"><option value="">All languages</option>' + langs.map(l => '<option' + (l === libFilter.lang ? ' selected' : '') + '>' + esc(l) + '</option>').join('') + '</select></div>';
  const match = p => {
    const q = libFilter.q.trim().toLowerCase();
    if (libFilter.lang && !p.demos.some(d => d.lang === libFilter.lang)) return false;
    if (!q) return true;
    return [p.name, p.tagline, p.intent, p.family, ...(p.aka || []), ...p.demos.map(d => d.title + ' ' + d.lang + ' ' + (d.source ? d.source.repo : ''))].join(' ').toLowerCase().includes(q);
  };
  let any = false;
  for (const fam of LIB.families) {
    const list = LIB.patterns.filter(p => p.family === fam && match(p));
    if (!list.length) continue; any = true;
    const info = App.FAMILY_INFO[fam] || {};
    h += '<section class="family"><div class="famhead"><span class="code">' + esc(info.code || '') + '</span><h2>' + esc(fam) + '</h2><p>' + esc(info.blurb || '') + '</p></div><div class="cards">';
    for (const p of list) {
      const done = p.demos.filter(d => visited.has(d.id)).length;
      const ls = [...new Set(p.demos.map(d => d.lang))];
      h += '<button class="card" type="button" data-open="' + esc(p.id) + '"><span class="no"><span>' + codeOf(p) + '</span>' + (done ? '<span class="done">✓ ' + done + '/' + p.demos.length + '</span>' : '<span>' + p.demos.length + ' demos</span>') + '</span>' +
        '<h3>' + esc(p.name) + '</h3><p>' + esc(p.tagline) + '</p><span class="langs">' + ls.map(l => '<span>' + esc(l) + '</span>').join('') + (p.demos.some(d => d.source) ? '<span class="real">real code</span>' : '') + '</span><canvas width="108" height="108" data-glyph="' + esc(p.id) + '" aria-hidden="true"></canvas></button>';
    }
    h += '</div></section>';
  }
  if (!any) h += '<p class="muted" style="font-family:var(--f-body);font-size:15px">No pattern matches that search. Try a broader word, like “object” or “event”.</p>';
  h += '<section class="family"><div class="famhead"><span class="code">Z</span><h2>Your own code</h2><p>Drop any folder onto the page, or open one here. Software City reads it in your browser; nothing is uploaded.</p></div><div class="yours">' +
    '<button type="button" data-act="folder"><b>Open a folder</b><span>A website, a Godot game, an API, a desktop app. Dependencies such as node_modules are skipped.</span></button>' +
    '<button type="button" data-act="files"><b>Open files</b><span>One or more source files in any of 20 languages.</span></button>' +
    '<button type="button" data-act="paste"><b>Paste code</b><span>Paste a single file to see its floors and pipes.</span></button>' +
    '<button type="button" data-act="sample"><b>Starport sample</b><span>A small space trading game, its web shop and its API, in GDScript, TypeScript and Python.</span></button>' +
    '<button type="button" data-act="self"><b>Software City itself</b><span>The parser, city and diagram code behind this page.</span></button></div></section>';
  const real = []; for (const p of LIB.patterns) for (const d of p.demos) if (d.source) real.push({ p, d });
  const byRepo = new Map(); for (const r of real) { const k = r.d.source.repo; if (!byRepo.has(k)) byRepo.set(k, { license: r.d.source.license, url: r.d.source.url, pats: [] }); byRepo.get(k).pats.push(r.p.name); }
  h += '<section class="family"><div class="famhead"><span class="code">§</span><h2>Credits</h2><p>Real-world demos include code from these open-source projects, kept with their license headers for study.</p></div><div class="credits">' +
    [...byRepo.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([repo, v]) => '<div><a href="https://github.com/' + esc(repo) + '" target="_blank" rel="noopener">' + esc(repo) + '</a> <span>' + esc(v.license) + '</span><em>' + esc([...new Set(v.pats)].join(', ')) + '</em></div>').join('') + '</div></section></div>';
  el.innerHTML = h;
  const s = App.$('#libSearch'); s.addEventListener('input', () => { libFilter.q = s.value; const pos = s.selectionStart; Learn.renderLibrary(); const s2 = App.$('#libSearch'); s2.focus(); s2.setSelectionRange(pos, pos); });
  App.$('#libLang').addEventListener('change', e => { libFilter.lang = e.target.value; Learn.renderLibrary(); });
  drawGlyphs();
};
App.$('#library').addEventListener('click', e => {
  const b = e.target.closest('[data-open]'); if (b) { Learn.open(b.dataset.open); return; }
  const a = e.target.closest('[data-act]'); if (a) App.emit('action', a.dataset.act);
});

function drawGlyphs() {
  const cans = App.$$('canvas[data-glyph]'); let i = 0;
  const step = () => {
    const t0 = performance.now();
    while (i < cans.length && performance.now() - t0 < 12) { glyph(cans[i]); i++; }
    if (i < cans.length) { if (window.requestIdleCallback) requestIdleCallback(step, { timeout: 60 }); else setTimeout(step, 16); }
  };
  step();
}
function glyph(cv) {
  const p = App.findPattern(cv.dataset.glyph); if (!p) return;
  let proj; try { proj = Learn.projectFor(p.demos[0]); } catch (e) { return; }
  const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height);
  const files = proj.files.filter(f => f.lang !== 'doc').slice(0, 9);
  const n = Math.ceil(Math.sqrt(files.length)); const cell = 18;
  const ox = 54, oy = 74; const iso = (x, y, z) => [ox + (x - y) * 0.87, oy + (x + y) * 0.5 - z];
  const order = files.map((f, k) => ({ f, gx: k % n, gy: Math.floor(k / n) })).sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy));
  for (const { f, gx, gy } of order) {
    const x = (gx - (n - 1) / 2) * cell, y = (gy - (n - 1) / 2) * cell; const w = 6.5;
    const floors = Math.max(1, Math.min(9, f.functions.filter(fn => !fn.parent).length));
    let z = 0;
    for (let k = 0; k < floors + 1; k++) {
      const hh = k === 0 ? 3 : 4.2;
      const col = k === 0 ? 'rgba(61,111,149,.9)' : App.RAMP[Math.min(7, App.bucket((f.functions.filter(fn => !fn.parent)[k - 1] || {}).cx || 1))];
      const top = [iso(x - w, y - w, z + hh), iso(x + w, y - w, z + hh), iso(x + w, y + w, z + hh), iso(x - w, y + w, z + hh)];
      const bot = [iso(x - w, y - w, z), iso(x + w, y - w, z), iso(x + w, y + w, z), iso(x - w, y + w, z)];
      g.globalAlpha = 0.85; g.fillStyle = col; g.strokeStyle = '#8fd0ff'; g.lineWidth = 0.7;
      for (const face of [[bot[1], bot[2], top[2], top[1]], [bot[2], bot[3], top[3], top[2]]]) { g.beginPath(); face.forEach((pt, j) => j ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1])); g.closePath(); g.fill(); g.globalAlpha = 1; g.stroke(); g.globalAlpha = 0.85; }
      g.beginPath(); top.forEach((pt, j) => j ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1])); g.closePath(); g.fill(); g.globalAlpha = 1; g.stroke();
      z += hh + 0.6;
    }
  }
}

function resolveRoles(p, d, proj) {
  const R = SoftwareCity.resolveRef;
  const roles = { list: p.roles.map((r, i) => ({ name: r.name, desc: r.desc, color: App.ROLE_COLORS[i % App.ROLE_COLORS.length], present: !!(d.roles && d.roles[r.name]) })), files: new Map(), fns: new Map(), clsByName: new Map() };
  p.roles.forEach((r, i) => {
    for (const ref of [].concat((d.roles || {})[r.name] || [])) {
      const hit = R(proj, ref); if (!hit) continue;
      if (hit.fn) roles.fns.set(hit.fn, i);
      else if (hit.cls) { roles.clsByName.set(hit.file.path + '#' + hit.cls.name, i); for (const m of hit.cls.methods || []) if (!roles.fns.has(m)) roles.fns.set(m, i); if (hit.cls.fileLevel) roles.files.set(hit.file, i); }
      else roles.files.set(hit.file, i);
    }
  });
  return roles;
}

Learn.open = function (pid, demoId, opts) {
  const p = App.findPattern(pid); if (!p) return;
  const d = p.demos.find(x => x.id === demoId) || p.demos[0];
  const proj = Learn.projectFor(d);
  App.emit('load-project', { project: proj, name: d.id, source: { kind: 'demo', pattern: p, demo: d } });
  App.lesson = { pattern: p, demo: d };
  App.roles = resolveRoles(p, d, proj); App.roleFocus = null;
  const steps = (d.trace || []).map(s => { const hit = SoftwareCity.resolveRef(proj, s.at); return { at: s.at, say: s.say, fn: hit && hit.fn }; }).filter(s => s.fn);
  stop(); App.trace = { steps, i: -1, playing: false, auto: true };
  App.$('#tracebar').hidden = true; App.$('#traceText').textContent = ''; App.$('#traceNum').textContent = '';
  window.City && City.clearTrace();
  markVisited(d.id);
  try { history.replaceState(null, '', '#' + p.id); } catch (e) { /* sandboxed */ }
  App.emit('view', 'city');
  renderLesson();
  App.emit('lesson', App.lesson);
  window.City && City.refresh();
  if (!(opts && opts.noplay) && steps.length) { clearTimeout(playT); playT = setTimeout(() => { gotoStep(0); if (!App.REDUCED) Learn.play(true); }, 900); }
};
Learn.close = function () {
  stop(); App.lesson = null; App.roles = null; App.roleFocus = null; App.trace = null;
  App.$('#lesson').hidden = true; App.$('#tracebar').hidden = true;
  window.City && City.clearTrace();
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* sandboxed */ }
  App.emit('lesson', null);
};

let playT = 0;
function stepDelay(s) { return Math.min(6500, Math.max(2800, 1800 + (s.say || '').length * 32)); }
function gotoStep(i) {
  const tr = App.trace; if (!tr || !tr.steps.length) return;
  i = Math.max(0, Math.min(tr.steps.length - 1, i));
  const prev = tr.i >= 0 ? tr.steps[tr.i].fn : null;
  tr.i = i;
  const s = tr.steps[i];
  window.City && City.traceTo(s.fn, i > 0 && prev !== s.fn ? prev : null);
  App.$$('#lesson .step').forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); if (k === i && b.scrollIntoView && App.$('#lesson').contains(b)) b.scrollIntoView({ block: 'nearest', behavior: App.REDUCED ? 'auto' : 'smooth' }); });
  App.$('#traceText').innerHTML = '<code>' + esc(App.fnLabel(s.fn)) + '()</code>' + esc(s.say);
  App.$('#traceNum').textContent = (i + 1) + ' / ' + tr.steps.length;
  App.$('#tracebar').hidden = App.view !== 'city';
  App.emit('trace-step', i);
}
Learn.gotoStep = gotoStep;
function stop() { clearTimeout(playT); if (App.trace) App.trace.playing = false; const b = App.$('#tPlay'); b.textContent = 'Play'; b.setAttribute('aria-label', 'Play'); }
Learn.stop = stop;
Learn.play = function (fromStart) {
  const tr = App.trace; if (!tr || !tr.steps.length) return;
  if (tr.playing && !fromStart) { stop(); return; }
  tr.playing = true; const b = App.$('#tPlay'); b.textContent = 'Pause'; b.setAttribute('aria-label', 'Pause');
  if (tr.i >= tr.steps.length - 1 || tr.i < 0) gotoStep(0);
  const tick = () => {
    if (!tr.playing || App.trace !== tr) return;
    if (tr.i >= tr.steps.length - 1) { stop(); return; }
    gotoStep(tr.i + 1); playT = setTimeout(tick, stepDelay(tr.steps[tr.i]));
  };
  clearTimeout(playT); playT = setTimeout(tick, stepDelay(tr.steps[Math.max(0, tr.i)]));
};
App.$('#tPlay').addEventListener('click', () => Learn.play());
App.$('#tPrev').addEventListener('click', () => { stop(); if (App.trace) gotoStep(App.trace.i - 1); });
App.$('#tNext').addEventListener('click', () => { stop(); if (App.trace) gotoStep(App.trace.i + 1); });
App.on('trace-goto', i => { stop(); gotoStep(i); });

Learn.autoTrace = function (fn) {
  const steps = []; const seen = new Set();
  const walk = (f, from, depth) => {
    if (steps.length >= 14 || seen.has(f)) return; seen.add(f);
    const kind = from && from.callKind ? from.callKind.get(f) : null;
    const say = !from ? f.name + '() starts here. It makes ' + f.calls.length + ' call' + (f.calls.length === 1 ? '' : 's') + (f.writes && f.writes.length ? ' and writes ' + f.writes.map(v => v.name).slice(0, 3).join(', ') : '') + '.'
      : (kind === 'new' ? from.name + '() creates a ' + (f.cls || f.name) + ' object, so its constructor runs.' : kind === 'poly' ? from.name + '() calls ' + f.name + '() through an interface; ' + (f.cls || 'this version') + ' is one of the implementations.' : from.name + '() calls ' + f.name + '()' + (f.file !== from.file ? ' over in ' + f.file.name : '') + '.') +
        (f.writes && f.writes.length ? ' It writes ' + f.writes.map(v => v.name).slice(0, 3).join(', ') + '.' : f.reads && f.readers ? ' It reads ' + f.reads.map(v => v.name).slice(0, 3).join(', ') + '.' : '');
    steps.push({ fn: f, say, at: '' });
    if (depth < 4) for (const c of f.calls.slice(0, 5)) walk(c, f, depth + 1);
  };
  walk(fn, null, 0);
  stop();
  App.trace = { steps, i: -1, playing: false, auto: true, custom: true };
  renderLesson();
  gotoStep(0); Learn.play(true);
};

function renderLesson() {
  const el = App.$('#lesson');
  if (!App.lesson && !(App.trace && App.trace.custom)) { el.hidden = true; return; }
  if (!App.lesson) {
    const tr = App.trace;
    el.innerHTML = '<header><div class="fam"><span class="lbl">Trace · your code</span><span style="flex:1"></span><button class="x" type="button" data-act="close" aria-label="Close trace">×</button></div><h2>' + esc(App.fnLabel(tr.steps[0].fn)) + '()</h2><div class="tagline">An automatic walk through the calls this function makes, depth first.</div></header>' +
      '<div class="body"><section><h3>Walkthrough <button class="btn" type="button" data-act="play">Play</button></h3><ol class="steps">' + stepsHtml(tr) + '</ol></section>' +
      '<section><p class="muted">Calls are matched by name and receiver, so this is a good map but not a debugger. Open <b>Diagrams → Sequence</b> to see the same calls on a timeline.</p></section></div>';
    el.hidden = false; layout(); return;
  }
  const { pattern: p, demo: d } = App.lesson; const roles = App.roles;
  let h = '<header><div class="fam"><span class="lbl">' + esc(codeOf(p)) + ' · ' + esc(p.family) + '</span><span style="flex:1"></span><button class="btn ghost" id="lessonToggle" type="button" data-act="collapse" style="padding:2px 8px;font-size:12px">Hide</button>' +
    '<button class="x" type="button" data-act="close" aria-label="Close lesson">×</button></div><h2>' + esc(p.name) + '</h2><div class="tagline">' + esc(p.tagline) + '</div></header><div class="body">';
  h += '<section><p>' + esc(p.intent) + '</p><p class="analogy">' + esc(p.analogy) + '</p></section>';
  h += '<section><h3>Demos</h3><div class="demotabs" role="tablist">' + p.demos.map(x => '<button class="demotab" type="button" role="tab" data-demo="' + esc(x.id) + '" aria-selected="' + (x === d) + '"><b>' + esc(x.title) + '</b><span>' + esc(x.lang) + ' · ' + esc(x.level) + (x.source ? ' · <span class="real">real</span>' : '') + (visited.has(x.id) && x !== d ? ' ✓' : '') + '</span></button>').join('') + '</div>' +
    '<p>' + esc(d.story) + '</p>' +
    (d.source ? '<div class="source">From <a href="' + esc(d.source.url) + '" target="_blank" rel="noopener">' + esc(d.source.repo) + '</a> · ' + esc(d.source.license) + (d.source.note ? '<br>' + esc(d.source.note) : '') + '</div>' : '') + '</section>';
  if (App.trace && App.trace.steps.length) h += '<section><h3>Walkthrough <button class="btn" type="button" data-act="play">Play</button></h3><ol class="steps">' + stepsHtml(App.trace) + '</ol></section>';
  h += '<section><h3>Roles <button class="btn ghost" type="button" data-act="roles" aria-pressed="' + (window.City && City.state.opts.roles) + '" style="padding:2px 8px;font-size:12px">' + ((window.City && City.state.opts.roles) ? 'Colours on' : 'Colours off') + '</button></h3><div class="roles">' +
    roles.list.map((r, i) => '<button class="role' + (r.present ? '' : ' missing') + '" type="button" data-role="' + i + '" aria-pressed="' + (App.roleFocus === i) + '" style="color:' + r.color + '"><i style="background:' + r.color + '"></i><b>' + esc(r.name) + '</b><span>' + esc(r.desc) + (r.present ? '' : ' (not in this demo)') + '</span></button>').join('') + '</div></section>';
  h += '<section><div class="cityshape"><span class="hand">What to look for in the city</span>' + esc(p.cityShape) + '</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn" type="button" data-act="shape">Show me</button><button class="btn" type="button" data-act="uml">Class diagram</button><button class="btn" type="button" data-act="seq">Sequence</button></div></section>';
  const anti = p.family === 'Anti-patterns';
  h += '<section><h3>' + (anti ? 'How it creeps in' : 'Use it when') + '</h3><ul>' + p.whenToUse.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>';
  h += '<section><h3>' + (anti ? 'How to fix it' : 'Watch out for') + '</h3><ul>' + p.pitfalls.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>';
  h += '<section><h3>Check yourself</h3><div class="quiz">' + p.quiz.map((q, qi) => '<div class="q" data-q="' + qi + '"><p>' + esc(q.q) + '</p><div class="opts">' + q.options.map((o, oi) => '<button class="opt" type="button" data-opt="' + oi + '">' + esc(o) + '</button>').join('') + '</div><div class="why" hidden></div></div>').join('') + '</div></section>';
  const rel = (p.related || []).map(App.findPattern).filter(Boolean);
  if (rel.length) h += '<section><h3>Related patterns</h3><div class="rel">' + rel.map(r => '<button class="chip" type="button" data-open="' + esc(r.id) + '">' + esc(r.name) + '</button>').join('') + '</div></section>';
  h += '</div>';
  el.innerHTML = h; el.hidden = false;
  if (innerWidth <= 760 && lastLesson !== d.id) { el.classList.add('collapsed'); document.body.classList.add('lesson-collapsed'); }
  if (el.classList.contains('collapsed')) { const tg = el.querySelector('#lessonToggle'); if (tg) tg.textContent = 'Show'; }
  lastLesson = d.id;
  if (App.trace && App.trace.i >= 0) App.$$('#lesson .step').forEach((b, k) => { b.classList.toggle('on', k === App.trace.i); b.classList.toggle('done', k < App.trace.i); });
  layout();
}
let lastLesson = null;
Learn.renderLesson = renderLesson;
function stepsHtml(tr) { return tr.steps.map((s, i) => '<li><button class="step" type="button" data-step="' + i + '"><span class="n">' + (i + 1) + '</span><span><code>' + esc(App.fnLabel(s.fn)) + '()</code>' + esc(s.say) + '</span></button></li>').join(''); }
function layout() { document.body.classList.toggle('has-lesson', !App.$('#lesson').hidden); App.emit('layout'); }

App.$('#lesson').addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const act = t.dataset.act;
  if (act === 'close') { Learn.close(); layout(); return; }
  if (act === 'collapse') { const el = App.$('#lesson'); el.classList.toggle('collapsed'); document.body.classList.toggle('lesson-collapsed', el.classList.contains('collapsed')); t.textContent = el.classList.contains('collapsed') ? 'Show' : 'Hide'; layout(); return; }
  if (act === 'play') { Learn.play(); return; }
  if (act === 'roles') { City.setOption('roles', !City.state.opts.roles); renderLesson(); App.emit('roles'); return; }
  if (act === 'shape') { App.roleFocus = null; App.emit('select', null); City.setOption('calls', true); City.setOption('data', true); City.setOption('roles', true); City.view('iso'); renderLesson(); return; }
  if (act === 'uml') { App.emit('view', 'diagrams'); window.Diagrams.kind = 'classes'; window.Diagrams.scope = null; window.Diagrams.render(); return; }
  if (act === 'seq') { App.emit('view', 'diagrams'); window.Diagrams.kind = 'sequence'; window.Diagrams.scope = 'trace'; window.Diagrams.render(); return; }
  if (t.dataset.demo) { stop(); Learn.open(App.lesson.pattern.id, t.dataset.demo); return; }
  if (t.dataset.step != null) { stop(); gotoStep(+t.dataset.step); return; }
  if (t.dataset.role != null) { const i = +t.dataset.role; App.roleFocus = App.roleFocus === i ? null : i; if (!City.state.opts.roles) City.setOption('roles', true); App.emit('select', null); City.refresh(); renderLesson(); App.emit('roles'); return; }
  if (t.dataset.open) { stop(); Learn.open(t.dataset.open); return; }
  if (t.dataset.opt != null) {
    const qd = t.closest('.q'); const q = App.lesson.pattern.quiz[+qd.dataset.q]; const oi = +t.dataset.opt;
    qd.querySelectorAll('.opt').forEach((b, k) => { b.classList.toggle('right', k === q.answer); b.classList.toggle('wrong', k === oi && oi !== q.answer); });
    const w = qd.querySelector('.why'); w.hidden = false; w.innerHTML = '<b>' + (oi === q.answer ? 'Right.' : 'Not quite.') + '</b> ' + esc(q.why);
  }
});
App.on('view', v => { if (v !== 'city') App.$('#tracebar').hidden = true; else if (App.trace && App.trace.i >= 0) App.$('#tracebar').hidden = false; });
App.on('project-user', () => { if (App.lesson || (App.trace && App.trace.custom)) Learn.close(); });
export { Learn };
