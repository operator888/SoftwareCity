/* Software City app: loading code, navigation, selection, inspector, search,
   layers, drag-and-drop, and keyboard. */

import { App } from './core.js';
import { SoftwareCity } from './parser.js';
import { Search } from './search.js';
import { DragDrop } from './dragdrop.js';
import { Bugs } from './bugs.js';

const $ = App.$; const $$ = App.$$; const esc = App.esc;

export function mount({ City, Diagrams, Learn }) {
  if (!window.City || !City.ok) App.toast('The 3D engine could not start. WebGL may be disabled in this browser; the Library and Diagrams still work.', true);

  function setView(v) {
    App.view = v;
    $$('[data-nav]').forEach(b => b.setAttribute('aria-current', b.dataset.nav === v ? 'page' : 'false'));
    $('#library').hidden = v !== 'library';
    $('#diagrams').hidden = v !== 'diagrams';
    if (v === 'library') Learn.renderLibrary();
    if (v === 'diagrams') Diagrams.render();
    $('#dock').style.visibility = v === 'city' ? '' : 'hidden';
  }
  App.on('view', setView);
  $$('[data-nav]').forEach(b => b.addEventListener('click', () => App.emit('view', b.dataset.nav)));

  function layout() {
    const wide = innerWidth > 760;
    const l = $('#lesson'), r = $('#insp');
    const dl = wide && !l.hidden ? l.getBoundingClientRect().right + 12 : 16;
    const dr = wide && !r.hidden ? innerWidth - r.getBoundingClientRect().left + 12 : 16;
    const dock = $('#dock'); dock.style.setProperty('--dock-l', dl + 'px'); dock.style.setProperty('--dock-r', dr + 'px');
    dock.style.bottom = !wide && !l.hidden ? (innerHeight - l.getBoundingClientRect().top + 10) + 'px' : '';
    document.body.classList.toggle('has-lesson', !l.hidden);
  }
  App.on('layout', layout); addEventListener('resize', layout);

  App.on('load-project', ({ project, name, source }) => {
    App.project = project; App.projectName = name; App.source = source || { kind: 'user' };
    App.sel = null; App.selFn = null; App.selCls = null;
    $('#insp').hidden = true;
    clearSearch(true);
    City && City.build(project);
    Search.buildIndex(project);
    scanBugs();
    updateStats();
    if (!source || source.kind !== 'demo') App.emit('project-user');
    if (App.view === 'diagrams') Diagrams.render();
    layout();
  });
  function updateStats() {
    const t = App.project.totals;
    $('#projName').textContent = App.projectName; $('#projName').title = App.projectName;
    const cells = [['files', t.files], ['lines', t.lines], ['functions', t.fns], ['classes', t.classes], ['calls', t.calls || 0], ['data flows', t.flows || 0]];
    $('#stats').innerHTML = cells.map(([k, v]) => '<span><b>' + v.toLocaleString('en-US') + '</b> ' + k + '</span>').join('');
  }

  /* Bugs: the shared detectors run on every survey. The list shows in the
     left panel (the lesson slot), markers in the city, and the findings for
     the selected file or function in the inspector. */
  let bugSev = -1;
  function scanBugs() {
    let bugs = [];
    try { bugs = Bugs.scan(App.project); } catch (e) { console.error('bug scan failed', e); }
    App.bugs = bugs;
    if (City && City.setBugs) City.setBugs(bugs);
    $('#bBugs').hidden = false;
    $('#bugCount').textContent = bugs.length.toLocaleString('en-US');
    if (bugsShown()) renderBugs();
  }
  const bugsShown = () => !$('#lesson').hidden && !!$('#lesson .buglist');
  function renderBugs() {
    const el = $('#lesson'); const all = App.bugs || []; const c = Bugs.counts(all);
    const list = bugSev < 0 ? all : all.filter(b => b.severity === bugSev);
    const SHOW = 400;
    const fBtn = (v, label, n) => '<button class="btn" type="button" data-bugsev="' + v + '" aria-pressed="' + (bugSev === v) + '">' + label + ' ' + n + '</button>';
    let h = '<header><div class="fam"><span class="lbl">Bugs · ' + esc(App.projectName) + '</span><span style="flex:1"></span><button class="x" type="button" data-act="close" aria-label="Close bug list">×</button></div>' +
      '<h2>' + all.length.toLocaleString('en-US') + ' finding' + (all.length === 1 ? '' : 's') + '</h2>' +
      '<div class="tagline">From ' + Bugs.DETECTOR_COUNT + ' code-smell detectors. They are heuristics: review each one before you change code.</div></header><div class="body">';
    h += '<section><div class="bugfilter" role="group" aria-label="Filter by severity">' + fBtn(-1, 'All', all.length) + fBtn(3, 'Critical', c[3]) + fBtn(2, 'Major', c[2]) + fBtn(1, 'Minor', c[1]) + fBtn(0, 'Info', c[0]) + '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="btn primary" type="button" data-bugact="csv"' + (all.length ? '' : ' disabled') + '>Export CSV</button><button class="btn" type="button" data-bugact="prompt"' + (all.length ? '' : ' disabled') + '>AI review prompt</button></div></section>';
    h += '<section class="buglist">';
    if (!list.length) h += '<p class="muted">' + (all.length ? 'No findings at this severity.' : 'No findings. Either this code is in good shape or the detectors do not cover its language well yet.') + '</p>';
    list.slice(0, SHOW).forEach(b => {
      h += '<button class="bugrow" type="button" data-bug="' + all.indexOf(b) + '"><span class="sev sev' + b.severity + '" title="' + Bugs.SEVERITY[b.severity] + '"></span><span><span class="bn">' + esc(b.name) + '</span><br>' + esc(b.message) + '<br><span class="bp">' + esc(b.file.path) + ':' + (b.line + 1) + '</span></span></button>';
    });
    if (list.length > SHOW) h += '<p class="muted">… and ' + (list.length - SHOW).toLocaleString('en-US') + ' more. Export the CSV to see every finding.</p>';
    h += '</section></div>';
    el.innerHTML = h; el.hidden = false; el.classList.remove('collapsed');
    $('#bBugs').setAttribute('aria-pressed', 'true');
    layout();
  }
  function toggleBugs() {
    if (bugsShown()) { if (Learn) Learn.close(); else $('#lesson').hidden = true; $('#bBugs').setAttribute('aria-pressed', 'false'); layout(); return; }
    if (Learn) Learn.close();
    if (App.view !== 'city') App.emit('view', 'city');
    renderBugs();
  }
  App.on('lesson', () => { if (!bugsShown()) $('#bBugs').setAttribute('aria-pressed', 'false'); });
  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  $('#bBugs').addEventListener('click', toggleBugs);
  $('#lesson').addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t || !bugsShown()) return;
    if (t.dataset.bugsev != null) { bugSev = +t.dataset.bugsev; renderBugs(); return; }
    if (t.dataset.bugact === 'csv' || t.dataset.bugact === 'prompt') {
      const name = Bugs.csvName(App.projectName);
      /* The BOM makes Excel and Numbers open the file as UTF-8. */
      if (t.dataset.bugact === 'csv') download(name, '﻿' + Bugs.toCsv(App.bugs), 'text/csv;charset=utf-8');
      else download(name.replace(/\.csv$/, '.prompt.md'), Bugs.prompt(App.projectName, name, App.bugs.length), 'text/markdown;charset=utf-8');
      App.toast(t.dataset.bugact === 'csv' ? 'Saved ' + App.bugs.length + ' findings as ' + name + '. Columns ai_verdict and ai_notes are left for your reviewer.' : 'Saved the review prompt. Give it to your coding AI together with the CSV.');
      return;
    }
    if (t.dataset.bug != null) { const b = App.bugs[+t.dataset.bug]; if (b) App.emit('select', { file: b.file, fn: b.fn, fly: true }); }
  });
  function bugsHtml(f, fn) {
    const here = Bugs.bugsIn(App.bugs || [], f, fn); if (!here.length) return '';
    return '<section><h3>Bugs here · ' + here.length + '</h3>' + here.slice(0, 30).map(b =>
      '<div class="bugcard s' + b.severity + '"><b>' + esc(b.name) + '</b> <span class="lbl">' + Bugs.SEVERITY[b.severity] + ' · line ' + (b.line + 1) + '</span><div>' + esc(b.message) + '</div>' +
      (b.evidence.length ? '<div class="muted mono" style="font-size:11.5px">' + esc(b.evidence.join(' · ')) + '</div>' : '') +
      '<details><summary>Why it matters, and the fix</summary><p>' + esc(b.why) + '</p><p><b>Fix:</b> ' + esc(b.fix) + '</p></details></div>').join('') +
      (here.length > 30 ? '<p class="muted">+' + (here.length - 30) + ' more in the bug list</p>' : '') + '</section>';
  }

  const tick = () => new Promise(r => setTimeout(r, 0));
  async function loadEntries(list, label) {
    let items = list.filter(x => DragDrop.accept(x.path));
    const skipped = list.length - items.length;
    if (!items.length) { App.toast(list.length ? 'None of those files contain code Software City can read. Try a folder with source files.' : 'No files found in that selection.', true); return; }
    items.sort((a, b) => a.path.localeCompare(b.path));
    const CAP = App.config.maxFiles; let capped = 0;
    if (items.length > CAP) { capped = items.length - CAP; items = items.slice(0, CAP); }
    const entries = [];
    busy(true, 'Surveying…', 'Reading files', 0);
    let failed = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      try {
        if (it.text != null) entries.push({ path: it.path, text: it.text });
        else if (it.file.size <= App.config.maxBytesPerFile) entries.push({ path: it.path, text: await it.file.text() });
        else failed++;
      } catch (e) { failed++; }
      if (i % 40 === 0) { busy(true, 'Surveying…', 'Reading ' + (i + 1) + ' of ' + items.length + ' files', i / items.length * 0.5); await tick(); }
    }
    if (!entries.length) { busy(false); App.toast('Every file was skipped: each one is larger than ' + Math.round(App.config.maxBytesPerFile / 1000) + ' kB or could not be read.', true); return; }
    busy(true, 'Drafting…', 'Measuring functions, classes, calls and data flow', 0.6); await tick();
    let project;
    try { project = SoftwareCity.analyzeProject(entries); }
    catch (e) { busy(false); App.toast('The survey failed on this code: ' + e.message, true); console.error(e); return; }
    busy(true, 'Drafting…', 'Raising ' + project.files.length + ' buildings and laying pipes', 0.85); await tick();
    const first = entries[0].path.split('/');
    const name = label || (entries.length === 1 ? entries[0].path : (entries.every(e => e.path.split('/')[0] === first[0]) ? first[0] : 'project'));
    if (Learn) Learn.close();
    App.emit('load-project', { project, name, source: { kind: 'user' } });
    App.emit('view', 'city');
    busy(false);
    const st = City.state; const notes = [];
    if (skipped) notes.push(skipped + ' non-code or dependency files skipped');
    if (capped) notes.push('only the first ' + CAP + ' files drawn');
    if (failed) notes.push(failed + ' file(s) skipped (too large or unreadable)');
    if (st.pipeTotal && st.pipeTotal.calls > App.config.maxPipes) notes.push(App.config.maxPipes.toLocaleString('en-US') + ' of ' + st.pipeTotal.calls.toLocaleString('en-US') + ' call pipes drawn; select a building to see all of its pipes');
    if (notes.length) App.toast(notes.join(' · '));
  }

  function busy(on, msg, sub, frac) {
    $('#busy').hidden = !on; if (!on) return;
    if (msg) $('#busyMsg').textContent = msg; $('#busySub').textContent = sub || ''; $('#busyBar').style.width = Math.round((frac || 0) * 100) + '%';
  }

  const menu = $('#openMenu'), bOpen = $('#bOpen');
  const closeMenu = () => { menu.hidden = true; bOpen.setAttribute('aria-expanded', 'false'); };
  bOpen.addEventListener('click', e => { e.stopPropagation(); menu.hidden = !menu.hidden; bOpen.setAttribute('aria-expanded', String(!menu.hidden)); });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('#openWrap')) closeMenu(); for (const [b, p] of [['#bLayers', '#layersPop'], ['#bLegend', '#legendPop']]) if (!$(p).hidden && !e.target.closest(p) && !e.target.closest(b)) { $(p).hidden = true; $(b).setAttribute('aria-expanded', 'false'); } });
  $('#bFolder').addEventListener('click', () => { closeMenu(); App.emit('action', 'folder'); });
  $('#bFiles').addEventListener('click', () => { closeMenu(); App.emit('action', 'files'); });
  $('#bPaste').addEventListener('click', () => { closeMenu(); App.emit('action', 'paste'); });
  $('#bSample').addEventListener('click', () => { closeMenu(); App.emit('action', 'sample'); });
  $('#bSelf').addEventListener('click', () => { closeMenu(); App.emit('action', 'self'); });
  /* Credits and licence. The licence's Required Notice lines must travel
     with every copy; this panel is the visible, in-app form of them. */
  const about = $('#about');
  const closeAbout = () => { about.hidden = true; bOpen.focus(); };
  $('#bAbout').addEventListener('click', () => { closeMenu(); about.hidden = false; $('#aboutClose').focus(); });
  $('#aboutClose').addEventListener('click', closeAbout);
  about.addEventListener('click', e => { if (e.target === about) closeAbout(); });

  App.on('action', async a => {
    if (a === 'folder') $('#dirInput').click();
    else if (a === 'files') $('#fileInput').click();
    else if (a === 'paste') { $('#paste').hidden = false; $('#pasteText').focus(); }
    else if (a === 'sample') import('../data/_generated/starport.js').then((m) => loadEntries(Object.entries(m.default).filter(([k]) => k !== '_manifest').map(([path, text]) => ({ path, text })), 'starport'));
    else if (a === 'self') {
      /* The build copies the app's source (and the shared parser) to
         dist/src/ with a manifest listing the files. Fetch relative to the
         page so this works from any sub-path; file:// blocks fetch in most
         browsers, so explain that instead of showing an empty city. */
      busy(true, 'Surveying…', "Reading Software City's own source", 0.2);
      try {
        const man = await fetch('src/manifest.json');
        if (!man.ok) throw new Error('manifest ' + man.status);
        const { files } = await man.json();
        const out = [];
        for (const p of files) { const r = await fetch(p); if (r.ok) out.push({ path: 'software-city/' + p.replace(/^src\//, ''), text: await r.text() }); }
        if (!out.length) throw new Error('no files');
        busy(false); loadEntries(out, 'software-city');
      } catch (e) {
        busy(false);
        console.warn('self-survey failed', e);
        App.toast(location.protocol === 'file:'
          ? "Browsers block reading files over file://. Serve the dist folder (npm run dev) to survey Software City's own source."
          : "Could not fetch Software City's source files from this server.", true);
      }
    }
  });

  $('#dirInput').addEventListener('change', e => { const fs = Array.from(e.target.files); e.target.value = ''; loadEntries(fs.map(f => ({ path: f.webkitRelativePath || f.name, file: f }))); });
  $('#fileInput').addEventListener('change', e => { const fs = Array.from(e.target.files); e.target.value = ''; loadEntries(fs.map(f => ({ path: f.name, file: f }))); });
  $('#pasteCancel').addEventListener('click', () => { $('#paste').hidden = true; });
  $('#pasteForm').addEventListener('submit', e => {
    e.preventDefault(); const text = $('#pasteText').value; let name = $('#pasteName').value.trim() || 'snippet.ts';
    if (!text.trim()) { App.toast('Paste some code first.', true); return; }
    if (!name.includes('.')) name += '.ts';
    $('#paste').hidden = true; loadEntries([{ path: name, text }], name);
  });

  /* Drag-and-drop. The DragDrop module is touch-aware; on a touch device the
     dropzone shows a hint to use the file picker. */
  DragDrop.makeDragDrop({
    onProgress: (msg, frac) => busy(true, msg || 'Surveying…', 'Walking folders', frac || 0),
    onEntries: entries => loadEntries(entries)
  });

  App.on('select', s => {
    App.sel = s ? s.file : null; App.selFn = s ? s.fn || null : null; App.selCls = s ? s.cls || null : null;
    if (s && App.matches) clearSearch(true);
    City && City.refresh();
    renderInspector();
    if (s && s.fly && City) City.flyTo((s.fn && City.floorOf(s.fn) ? City.floorOf(s.fn).b : s.file._b));
    if (App.view === 'diagrams') { Diagrams._keep = true; Diagrams.render(); Diagrams._keep = false; }
    layout();
  });

  function chipFn(fn, here, kind) {
    const label = (fn.file === here ? '' : fn.file.name + ' · ') + App.fnLabel(fn);
    const col = kind === 'new' ? 'var(--coral)' : kind === 'poly' ? 'var(--violet)' : null;
    return '<button class="chip" type="button" data-goto="' + esc(fn.file.path) + '" data-goto-fn="' + fn.file.functions.indexOf(fn) + '"' + (col ? ' style="border-color:' + col + '"' : '') + ' title="' + (kind === 'new' ? 'creates an object' : kind === 'poly' ? 'through an interface' : 'call') + '">' + esc(label) + '</button>';
  }
  const chipFile = f => '<button class="chip" type="button" data-file="' + esc(f.path) + '">' + esc(f.name) + '</button>';
  const chipCls = c => '<button class="chip" type="button" data-cls="' + esc(c.file.path + '#' + c.name) + '">' + esc(c.name) + '</button>';
  function roleBadge(fn, file, cls) {
    const R = App.roles; if (!R) return '';
    let i = null; if (fn) i = R.fns.get(fn); if (i == null && cls) i = R.clsByName.get(cls.file.path + '#' + cls.name); if (i == null && file) i = R.files.get(file);
    if (i == null) return '';
    const r = R.list[i]; return '<section><span class="lbl">Pattern role</span><div style="margin-top:6px;font-family:var(--f-ui);font-size:16px;font-weight:600;color:' + r.color + '">' + esc(r.name) + '</div><div style="font-family:var(--f-body);font-size:13px;color:var(--ink-dim)">' + esc(r.desc) + '</div></section>';
  }
  function renderInspector() {
    const el = $('#insp'); const f = App.sel;
    if (!f) { el.hidden = true; layout(); return; }
    const fn = App.selFn, cls = App.selCls;
    const isCss = f.lang === 'css';
    let h;
    if (cls) {
      const kids = [...(cls.subclasses || []), ...(cls.implementors || [])];
      h = '<header><h2>' + esc(cls.name) + '</h2><button class="x" type="button" data-act="close" aria-label="Close inspector">×</button><div class="path">' + esc(cls.kind) + ' in ' + esc(f.path) + ' · lines ' + (cls.start + 1) + '–' + (cls.end + 1) + '</div></header><div class="body">';
      h += roleBadge(null, f, cls);
      h += bugsHtml(f, { start: cls.start, end: cls.end });
      h += '<section><div class="kv"><div><span class="lbl">Methods</span><b>' + cls.methods.length + '</b></div><div><span class="lbl">Fields</span><b>' + cls.fields.length + '</b></div><div><span class="lbl">Subtypes</span><b>' + kids.length + '</b></div></div></section>';
      const rel = [['Extends', cls.extendsC], ['Implements', cls.implementsC], ['Has (fields)', cls.has], ['Subclasses', cls.subclasses || []], ['Implemented by', cls.implementors || []], ['Uses', (cls.uses || []).slice(0, 20)]].filter(r => r[1].length);
      if (rel.length) h += '<section><h3>Relations</h3>' + rel.map(([k, list]) => '<div class="flowrow"><span class="tag lbl">' + k + '</span>' + list.map(chipCls).join('') + '</div>').join('') + '</section>';
      const ext = [...cls.ext, ...cls.impl].filter(n => !App.project.classIdx.has(n));
      if (ext.length) h += '<section><h3>Outside types</h3>' + ext.map(n => '<span class="chip ext">' + esc(n) + '</span>').join('') + '</section>';
      if (cls.methods.length) h += '<section><h3>Methods</h3>' + cls.methods.map(m => '<button class="fnrow" type="button" data-goto="' + esc(m.file.path) + '" data-goto-fn="' + m.file.functions.indexOf(m) + '"><span class="n">' + esc(m.name) + '<small>(' + esc((m.sig || '').slice(0, 30)) + ')</small></span><span class="bar"><i style="width:' + Math.min(100, m.lines * 3) + '%"></i></span><span class="cx"><span class="cxdot" style="background:' + App.RAMP[App.bucket(m.cx)] + '"></span>' + m.cx + '</span></button>').join('') + '</section>';
      if (cls.abstract && cls.abstract.length) h += '<section><h3>Abstract members</h3>' + cls.abstract.map(a => '<span class="chip">' + esc(a.name) + '(' + esc(a.sig) + ')</span>').join('') + '</section>';
      if (cls.fields.length) h += '<section><h3>Fields</h3>' + cls.fields.map(v => '<span class="chip ' + v.kind + '">' + esc(v.name) + '</span>').join('') + '</section>';
      h += '<section><h3>Source</h3>' + App.codeBlock(f, cls.start, cls.end, 90) + '</section>';
      h += '<section style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" type="button" data-act="uml">Class diagram</button></section></div>';
    } else {
      const maxL = Math.max(1, ...f.functions.map(x => x.lines));
      const cxMax = f.functions.reduce((m, x) => Math.max(m, x.cx), 0);
      const fnWord = isCss ? 'Rules' : 'Functions';
      h = '<header><h2>' + esc(fn ? App.fnLabel(fn) + (isCss ? '' : '()') : f.name) + '</h2><button class="x" type="button" data-act="close" aria-label="Close inspector">×</button><div class="path">' + esc(f.path) + ' · ' + esc(f.langName) + '</div></header><div class="body">';
      h += roleBadge(fn, f, null);
      h += bugsHtml(f, fn);
      if (fn) {
        h += '<section><div class="fnhead"><span class="muted">Lines ' + (fn.start + 1) + '–' + (fn.end + 1) + ' · ' + fn.lines + ' lines · <span class="cxdot" style="background:' + App.RAMP[App.bucket(fn.cx)] + '"></span>complexity ' + fn.cx + (fn.locals ? ' · ' + fn.locals + ' locals' : '') + '</span></div>';
        if (fn.cls) { const c = App.project.classIdx.get(fn.cls); h += '<div class="flowrow"><span class="tag lbl">Class</span>' + (c ? chipCls(c) : '<span class="chip">' + esc(fn.cls) + '</span>') + '</div>'; }
        if (fn.parent) h += '<div class="flowrow"><span class="tag lbl">Inside</span>' + chipFn(fn.parent, f) + '</div>';
        if (fn.recursive) h += '<div class="flowrow"><span class="tag lbl" style="color:#ffe27a">Recursive</span><span class="chip" style="border-color:#ffe27a">calls itself</span></div>';
        if (fn.calls && fn.calls.length) h += '<div class="flowrow"><span class="tag lbl" style="color:var(--line)">Calls</span>' + fn.calls.map(c => chipFn(c, f, fn.callKind && fn.callKind.get(c))).join('') + '</div>';
        if (fn.calledBy && fn.calledBy.length) h += '<div class="flowrow"><span class="tag lbl">Called by</span>' + fn.calledBy.map(c => chipFn(c, f, c.callKind && c.callKind.get(fn))).join('') + '</div>';
        if (fn.writes && fn.writes.length) h += '<div class="flowrow"><span class="tag lbl" style="color:var(--amber)">Writes</span>' + fn.writes.map(v => '<span class="chip const">' + esc(v.name) + '</span>').join('') + '</div>';
        if (fn.reads && fn.reads.length) h += '<div class="flowrow"><span class="tag lbl" style="color:var(--mint)">Reads</span>' + fn.reads.map(v => '<span class="chip" style="border-color:rgba(126,224,181,.55)">' + esc(v.name) + '</span>').join('') + '</div>';
        if (!isCss) h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">' + (fn.calls && fn.calls.length ? '<button class="btn primary" type="button" data-act="trace">Trace from here</button><button class="btn" type="button" data-act="seq">Sequence</button>' : '') + '<button class="btn" type="button" data-act="flow">Data flow</button></div>';
        h += App.codeBlock(f, fn.start, fn.end, 80) + '</section>';
      }
      h += '<section><div class="kv"><div><span class="lbl">Lines</span><b>' + f.lines + '</b></div><div><span class="lbl">' + fnWord + '</span><b>' + f.functions.length + '</b></div><div><span class="lbl">' + (isCss ? 'At-rules' : 'Classes') + '</span><b>' + f.classes.length + '</b></div><div><span class="lbl">Variables</span><b>' + f.variables.length + '</b></div><div><span class="lbl">Peak cx</span><b>' + cxMax + '</b></div><div><span class="lbl">Imports</span><b>' + f.importsTo.length + '</b></div></div></section>';
      if (f.functions.length) {
        h += '<section><h3>' + fnWord + ' · floors from the ground up</h3>';
        for (const x of f.functions) {
          const depth = x.parent ? 1 : 0;
          h += '<button class="fnrow' + (x === fn ? ' on' : '') + '" type="button" data-fn="' + f.functions.indexOf(x) + '"><span class="n" style="padding-left:' + depth * 12 + 'px">' + (depth ? '↳ ' : '') + esc(x.name) + (x.cls && !depth && x.cls !== x.name ? ' <small>' + esc(x.cls) + '</small>' : '') + '</span><span class="bar"><i style="width:' + Math.max(4, x.lines / maxL * 100) + '%"></i></span><span class="cx"><span class="cxdot" style="background:' + App.RAMP[App.bucket(x.cx)] + '"></span>' + x.cx + '</span></button>';
        }
        h += '</section>';
      } else h += '<section><p class="muted" style="font-family:var(--f-body)">No functions found here. This file stands as a single block whose height comes from its line count.</p></section>';
      const cl = f.classes.filter(c => !c.css && c.kind !== 'impl');
      if (cl.length) h += '<section><h3>Classes & types</h3>' + cl.map(c => '<button class="chip" type="button" data-cls="' + esc(f.path + '#' + c.name) + '">' + esc(c.kind) + ' ' + esc(c.name) + '</button>').join('') + '</section>';
      if (f.variables.length) h += '<section><h3>Variables</h3>' + f.variables.slice(0, 80).map(v => '<span class="chip ' + v.kind + '" title="' + v.kind + ', line ' + (v.line + 1) + ((v.writers || []).length ? ', written by ' + v.writers.length : '') + ((v.readers || []).length ? ', read by ' + v.readers.length : '') + '">' + esc((v.cls ? v.cls + '.' : '') + v.name) + '</span>').join('') + (f.variables.length > 80 ? '<span class="muted">+' + (f.variables.length - 80) + '</span>' : '') + '</section>';
      if (f.importsTo.length || f.external.length) h += '<section><h3>Uses</h3>' + f.importsTo.map(chipFile).join('') + f.external.slice(0, 40).map(x => '<span class="chip ext">' + esc(x) + '</span>').join('') + '</section>';
      if (f.importedBy.length) h += '<section><h3>Used by</h3>' + f.importedBy.map(chipFile).join('') + '</section>';
      if (!fn) h += '<section><h3>Source</h3>' + App.codeBlock(f, 0, f.lines - 1, 120) + '</section>';
      h += '</div>';
    }
    el.innerHTML = h; el.hidden = false;
    el.querySelector('.body').scrollTop = 0;
    layout();
  }
  App.renderInspector = renderInspector;
  const fileByPath = p => App.project.files.find(f => f.path === p);
  $('#insp').addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const act = t.dataset.act;
    if (act === 'close') return App.emit('select', null);
    if (act === 'trace') { Learn.autoTrace(App.selFn); App.emit('view', 'city'); return; }
    if (act === 'seq') { Diagrams.kind = 'sequence'; Diagrams.scope = 'fn:' + App.selFn.file.path + '@' + App.selFn.start; App.emit('view', 'diagrams'); return; }
    if (act === 'flow') { Diagrams.kind = 'dataflow'; Diagrams.scope = App.sel.path; App.emit('view', 'diagrams'); return; }
    if (act === 'uml') { Diagrams.kind = 'classes'; Diagrams.scope = null; App.emit('view', 'diagrams'); return; }
    if (t.dataset.fn != null) { App.emit('select', { file: App.sel, fn: App.sel.functions[+t.dataset.fn] }); return; }
    if (t.dataset.file) { const f = fileByPath(t.dataset.file); if (f) App.emit('select', { file: f, fly: App.view === 'city' }); return; }
    if (t.dataset.cls) { const [p, n] = t.dataset.cls.split('#'); const f = fileByPath(p); const c = f && f.classes.find(x => x.name === n); if (c) App.emit('select', { file: f, cls: c, fly: App.view === 'city' && f !== App.sel }); return; }
    if (t.dataset.goto) { const f = fileByPath(t.dataset.goto); if (f) App.emit('select', { file: f, fn: f.functions[+t.dataset.gotoFn], fly: App.view === 'city' && f !== App.sel }); }
  });

  /* Picking & tooltip in the city. */
  const canvas = $('#scene'); const tip = $('#tip');
  let hoverRAF = 0, lastMove = null, down = null;
  canvas.addEventListener('pointermove', e => {
    lastMove = e;
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) canvas.classList.add('dragging');
    if (hoverRAF || e.pointerType === 'touch') return;
    hoverRAF = requestAnimationFrame(() => {
      hoverRAF = 0; const ev = lastMove; const u = City && City.pick(ev.clientX, ev.clientY);
      if (!u || down) { tip.hidden = true; return; }
      const f = u.b.file;
      if (u.kind === 'bug') {
        const top = u.bugs.slice(0, 3).map(b => '<div class="t2">' + esc(Bugs.SEVERITY[b.severity]) + ' · ' + esc(b.message) + '</div>').join('');
        tip.innerHTML = '<b>' + u.bugs.length + ' bug' + (u.bugs.length === 1 ? '' : 's') + ' · ' + esc(u.fn ? App.fnLabel(u.fn) + '()' : f.name) + '</b>' + top + (u.bugs.length > 3 ? '<div class="t2">+' + (u.bugs.length - 3) + ' more · click to see them</div>' : '');
      } else if (u.kind === 'fn') {
        const isCss = f.lang === 'css'; const fn = u.fn;
        tip.innerHTML = '<b>' + (isCss ? '' : 'ƒ ') + esc(App.fnLabel(fn)) + (isCss ? '' : '()') + '</b><div class="t2">' + esc(f.path) + ' · L' + (fn.start + 1) + '–' + (fn.end + 1) + '</div><div class="t2">' + fn.lines + ' lines · complexity ' + fn.cx + ((fn.calls || []).length ? ' · calls ' + fn.calls.length : '') + ((fn.writes || []).length ? ' · writes ' + fn.writes.map(v => v.name).slice(0, 3).join(', ') : '') + '</div>';
      } else if (u.kind === 'var') {
        const v = u.v; tip.innerHTML = '<b>' + esc((v.cls ? v.cls + '.' : '') + v.name) + '</b><div class="t2">' + esc(v.kind) + ' in ' + esc(f.name) + ', line ' + (v.line + 1) + '</div><div class="t2">' + (v.writers || []).length + ' writer' + ((v.writers || []).length === 1 ? '' : 's') + ' · ' + (v.readers || []).length + ' reader' + ((v.readers || []).length === 1 ? '' : 's') + '</div>';
      } else tip.innerHTML = '<b>' + esc(f.name) + '</b><div class="t2">' + esc(f.path) + '</div><div class="t2">' + f.lines + ' lines · ' + f.langName + ' · ' + f.functions.length + ' functions</div>';
      tip.hidden = false;
      tip.style.left = Math.min(ev.clientX, innerWidth - 330) + 'px'; tip.style.top = Math.min(ev.clientY, innerHeight - 90) + 'px';
    });
  });
  canvas.addEventListener('pointerleave', () => { tip.hidden = true; });
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; tip.hidden = true; });
  addEventListener('pointerup', e => {
    if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null; canvas.classList.remove('dragging');
    if (moved > 5 || e.target !== canvas) return;
    const u = City && City.pick(e.clientX, e.clientY);
    if (!u) { App.emit('select', null); return; }
    if (u.kind === 'bug') { App.emit('select', { file: u.b.file, fn: u.fn || null }); return; }
    if (u.kind === 'var') { const w = (u.v.writers || [])[0] || (u.v.readers || [])[0]; App.emit('select', { file: u.b.file, fn: w || null }); return; }
    App.emit('select', { file: u.b.file, fn: u.kind === 'fn' ? u.fn : null });
  });

  /* Search. Now powered by the Search module: debounced, ranked, with
     fuzzy fallback. Enter jumps to the top result. */
  function runSearch(q) {
    if (!App.project) { clearSearch(); return; }
    const m = Search.run(q);
    if (!q.trim()) { clearSearch(); return; }
    const files = m.files, fns = m.fns;
    if (m.text === '') { clearSearch(); return; }
    App.matches = { files, fns };
    const info = $('#searchInfo'); info.hidden = false;
    info.textContent = m.text + (fns.size + files.size ? ' · Enter to fly there' : '');
    App.sel = null; App.selFn = null; App.selCls = null; $('#insp').hidden = true; layout();
    City && City.setMatches(App.matches);
  }
  let searchTimer = 0;
  function clearSearch(quiet) { App.matches = null; $('#search').value = ''; $('#searchInfo').hidden = true; if (!quiet && City) City.setMatches(null); else if (City) City.state.matches = null; }
  $('#search').addEventListener('input', e => { if (App.view !== 'city') App.emit('view', 'city'); clearTimeout(searchTimer); searchTimer = setTimeout(() => runSearch(e.target.value), 80); });
  $('#search').addEventListener('keydown', e => {
    if (e.key === 'Escape') { clearSearch(); e.target.blur(); }
    if (e.key === 'Enter' && App.matches) {
      const fn = [...App.matches.fns][0]; const f = fn ? fn.file : [...App.matches.files][0];
      if (f) App.emit('select', { file: f, fn: fn || null, fly: true });
    }
  });

  $$('[data-view]').forEach(b => b.addEventListener('click', () => City.view(b.dataset.view)));
  $('#cut').addEventListener('input', () => City.applyCut());
  const LAYERS = [
    ['calls', 'Call pipes', '<svg width="26" height="14" viewBox="0 0 26 14"><path d="M1 11H8V3H25" stroke="#8fd0ff" stroke-width="3" fill="none"/></svg>'],
    ['data', 'Data pipes', '<svg width="26" height="14" viewBox="0 0 26 14"><path d="M1 11H14V3H25" stroke="#ffbf5a" stroke-width="2.4" fill="none"/></svg>'],
    ['imports', 'Import arcs', '<svg width="26" height="14" viewBox="0 0 26 14"><path d="M2 13Q13 -6 24 13" stroke="#ffbf5a" fill="none"/></svg>'],
    ['antennas', 'Variable antennas', '<svg width="26" height="14" viewBox="0 0 26 14"><path d="M8 13V4M18 13V6" stroke="#8fd0ff"/><circle cx="8" cy="3" r="2" fill="#ffbf5a"/><circle cx="18" cy="5" r="2" fill="#8fd0ff"/></svg>'],
    ['floorLabels', 'Function names on floors', '<svg width="26" height="14" viewBox="0 0 26 14"><rect x="3" y="2" width="20" height="10" fill="none" stroke="#8fd0ff"/><path d="M7 7h12" stroke="#e9f3fb"/></svg>'],
    ['labels', 'File names', '<svg width="26" height="14" viewBox="0 0 26 14"><text x="2" y="11" font-size="10" fill="#e9f3fb" font-family="monospace">a.ts</text></svg>'],
    ['bugs', 'Bug markers (B: bug list)', '<svg width="26" height="14" viewBox="0 0 26 14"><path d="M13 1L18 7L13 13L8 7Z" fill="#ff7a64"/></svg>'],
    ['roles', 'Pattern role colours', '<svg width="26" height="14" viewBox="0 0 26 14"><rect x="2" y="3" width="6" height="8" fill="#ffbf5a"/><rect x="10" y="3" width="6" height="8" fill="#7ee0b5"/><rect x="18" y="3" width="6" height="8" fill="#ff7a64"/></svg>'],
    ['exploded', 'Exploded floors (E)', '<svg width="26" height="14" viewBox="0 0 26 14"><rect x="6" y="1" width="14" height="3" fill="none" stroke="#8fd0ff"/><rect x="6" y="6" width="14" height="3" fill="none" stroke="#8fd0ff"/><rect x="6" y="11" width="14" height="2.5" fill="none" stroke="#8fd0ff"/></svg>']
  ];
  function renderLayers() {
    $('#layersPop').innerHTML = LAYERS.map(([k, label, sw]) => '<button class="toggle" type="button" data-layer="' + k + '" aria-pressed="' + !!City.state.opts[k] + '"><span class="sw">' + sw + '</span><span>' + label + '</span><span class="ck"></span></button>').join('') +
      '<button class="toggle" type="button" data-layer="follow" aria-pressed="' + !!City.state.follow + '"><span class="sw"><svg width="26" height="14" viewBox="0 0 26 14"><circle cx="13" cy="7" r="4" fill="#ffbf5a"/></svg></span><span>Camera follows the trace</span><span class="ck"></span></button>';
  }
  $('#layersPop').addEventListener('click', e => { const t = e.target.closest('[data-layer]'); if (!t) return; const k = t.dataset.layer; if (k === 'follow') City.state.follow = !City.state.follow; else City.setOption(k, !City.state.opts[k]); renderLayers(); });
  App.on('options', () => { if (!$('#layersPop').hidden) renderLayers(); });
  for (const [b, p] of [['#bLayers', '#layersPop'], ['#bLegend', '#legendPop']]) $(b).addEventListener('click', e => { e.stopPropagation(); const el = $(p); el.hidden = !el.hidden; $(b).setAttribute('aria-expanded', String(!el.hidden)); if (p === '#layersPop' && !el.hidden) renderLayers(); for (const [b2, p2] of [['#bLayers', '#layersPop'], ['#bLegend', '#legendPop']]) if (p2 !== p) { $(p2).hidden = true; $(b2).setAttribute('aria-expanded', 'false'); } });

  addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.key === 'Escape') { if (!$('#about').hidden) closeAbout(); else if (!$('#paste').hidden) $('#paste').hidden = true; else if (!menu.hidden) closeMenu(); else if (App.view !== 'city') App.emit('view', 'city'); else App.emit('select', null); }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); $('#search').focus(); }
    if (App.view !== 'city') return;
    if (e.key === 'f' || e.key === 'F') City.view('fit');
    if (e.key === 'e' || e.key === 'E') City.setOption('exploded', !City.state.opts.exploded);
    if ((e.key === 'b' || e.key === 'B') && App.project) toggleBugs();
    if (App.trace && App.trace.steps.length) {
      if (e.key === 'ArrowRight') { e.preventDefault(); Learn.stop(); Learn.gotoStep(App.trace.i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); Learn.stop(); Learn.gotoStep(App.trace.i - 1); }
      if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); Learn.play(); }
    }
  });

  function start() {
    const hash = (location.hash || '').slice(1);
    const lib = window.CP_LIBRARY;
    if (hash === 'library') { App.emit('view', 'library'); if (lib && lib.patterns.length) Learn.open('observer', null, { noplay: true }); App.emit('view', 'library'); return; }
    if (lib && lib.patterns.length) { const p = App.findPattern(hash) || App.findPattern('observer') || lib.patterns[0]; Learn.open(p.id); }
    else App.emit('action', 'sample');
  }
  /* index.js already waited for the fonts (capped at 2.5 s) before calling
     mount, so start right away rather than waiting a second time. */
  start();
}
