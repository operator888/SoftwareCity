/* Software City diagrams: UML class diagram, module map, sequence diagram and
   data-flow diagram, laid out with dagre and drawn as SVG. */

import { App } from './core.js';
import { store } from './store.js';

const D = { kind: store.get('dg', 'classes'), uses: false, scope: null };
if (typeof window !== 'undefined') window.Diagrams = D;
const svg = App.$('#dsvg'); const NS = 'http://www.w3.org/2000/svg';
const CH = 6.75;
const esc = App.esc;
let vb = { x: 0, y: 0, w: 1000, h: 700 }, content = { w: 1000, h: 700 };
const COLORS = { ink: '#e9f3fb', dim: '#9cb9d2', line: '#8fd0ff', amber: '#ffbf5a', mint: '#7ee0b5', coral: '#ff7a64', violet: '#c3a6ff', paper: '#0d2a47' };

const owner = fn => fn.cls ? (fn.file.classes.find(c => c.name === fn.cls && c.kind !== 'impl' && !c.css) || (App.project.classIdx && App.project.classIdx.get(fn.cls)) || null) : null;
const ownerId = fn => { const c = owner(fn); return c ? 'C:' + c.file.path + '#' + c.name : 'M:' + fn.file.path; };
const ownerName = fn => { const c = owner(fn); return c ? c.name : fn.file.name; };
function folders() {
  const set = new Map();
  for (const f of App.project.files) { const segs = f.path.split('/'); for (let d = 1; d < Math.min(segs.length, 4); d++) { const k = segs.slice(0, d).join('/'); set.set(k, (set.get(k) || 0) + 1); } }
  return [...set.entries()].filter(([k, n]) => n > 1 && n < App.project.files.length).map(([k]) => k).sort();
}
function inScope(path) { return !D.scope || D.scope === '*' || path === D.scope || path.startsWith(D.scope + '/'); }
function fillScope() {
  const sel = App.$('#dScope'); const lbl = App.$('#dScopeLbl'); const opts = [];
  const k = D.kind;
  if (k === 'classes' || k === 'modules') { opts.push(['*', 'Whole project']); for (const f of folders()) opts.push([f, f + '/']); }
  else if (k === 'sequence') {
    if (App.trace && App.trace.steps.length) opts.push(['trace', 'Lesson trace']);
    if (App.selFn) opts.push(['fn:' + fnKey(App.selFn), 'From ' + App.fnLabel(App.selFn) + '()']);
    const entries = App.project.files.flatMap(f => f.functions).filter(fn => fn.calls && fn.calls.length && !fn.calledBy.length).sort((a, b) => b.calls.length - a.calls.length).slice(0, 40);
    for (const fn of entries) if (fn !== App.selFn) opts.push(['fn:' + fnKey(fn), 'From ' + App.fnLabel(fn) + '()']);
  } else if (k === 'dataflow') {
    opts.push(['*', 'Whole project']);
    const files = App.project.files.filter(f => f.functions.some(fn => (fn.reads || []).length + (fn.writes || []).length));
    for (const f of files) opts.push([f.path, f.path]);
  }
  lbl.hidden = sel.hidden = opts.length < 2;
  sel.innerHTML = opts.map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + '</option>').join('');
  let want = D.scope;
  if (k === 'sequence') want = App.trace && App.trace.steps.length && (!want || !want.startsWith('fn:')) ? 'trace' : (App.selFn ? 'fn:' + fnKey(App.selFn) : want);
  if (k === 'dataflow' && App.sel && (!want || want === '*') && opts.some(o => o[0] === App.sel.path)) want = App.sel.path;
  if (!want && (k === 'classes' || k === 'modules')) {
    const P = App.project; const count = d => k === 'classes' ? P.classes.filter(c => !c.css && (c.file.path === d || c.file.path.startsWith(d + '/'))).length : P.files.filter(f => f.path.startsWith(d + '/')).length;
    const big = k === 'classes' ? P.classes.length > 70 : P.files.length > 90;
    if (big) { let best = null, bn = 0; for (const [v] of opts) if (v !== '*') { const n = count(v); if (n >= 4 && n <= 60 && n > bn) { bn = n; best = v; } } if (best) want = best; }
  }
  if (!opts.some(o => o[0] === want)) want = opts.length ? opts[0][0] : null;
  D.scope = want; sel.value = want || '';
}
const fnKey = fn => fn.file.path + '@' + fn.start;
const fnByKey = k => { const [p, s] = k.split('@'); const f = App.project.files.find(x => x.path === p); return f && f.functions.find(fn => fn.start === +s); };

const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const txt = (s, attrs, parent) => { const t = el('text', attrs, parent); t.textContent = s; return t; };
function defs(root) {
  const d = el('defs', {}, root);
  const mk = (id, path, fill, stroke, w, h, rx, ry, orient) => { const m = el('marker', { id, viewBox: '0 0 ' + w + ' ' + h, refX: rx, refY: ry, markerWidth: w, markerHeight: h, orient: orient || 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, d); el('path', { d: path, fill, stroke, 'stroke-width': 1.3 }, m); };
  mk('m-tri', 'M1,1 L15,8 L1,15 Z', COLORS.paper, COLORS.ink, 16, 16, 15, 8);
  mk('m-dia', 'M1,7 L9,1 L17,7 L9,13 Z', COLORS.line, COLORS.line, 18, 14, 1, 7, 'auto');
  mk('m-arr', 'M1,1 L11,6 L1,11', 'none', COLORS.dim, 12, 12, 11, 6);
  for (const [k, c] of [['amber', COLORS.amber], ['mint', COLORS.mint], ['line', COLORS.line], ['coral', COLORS.coral], ['violet', COLORS.violet], ['ink', COLORS.ink]]) mk('m-a-' + k, 'M1,1 L11,6 L1,11 Z', c, c, 12, 12, 11, 6);
}
function pathOf(points) {
  if (!points.length) return '';
  let d = 'M' + points[0].x.toFixed(1) + ',' + points[0].y.toFixed(1);
  if (points.length === 2) return d + 'L' + points[1].x.toFixed(1) + ',' + points[1].y.toFixed(1);
  for (let i = 1; i < points.length - 1; i++) { const p = points[i], q = points[i + 1]; const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2; d += 'Q' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ' ' + (i === points.length - 2 ? q.x.toFixed(1) + ',' + q.y.toFixed(1) : mx.toFixed(1) + ',' + my.toFixed(1)); }
  return d;
}
function setEmpty(title, body) {
  const e = App.$('#dempty'); e.hidden = !title; if (title) e.firstElementChild.innerHTML = '<b>' + esc(title) + '</b>' + esc(body || '');
}
function note(html) { const n = App.$('#dnote'); n.hidden = !html; n.innerHTML = html || ''; }

function classDiagram(root) {
  const P = App.project;
  let classes = P.classes.filter(c => !c.css && c.kind !== 'impl' && inScope(c.file.path));
  const roles = App.roles;
  const total = classes.length;
  if (classes.length > 120) { const deg = c => c.extendsC.length + c.implementsC.length + c.has.length + (c.subclasses || []).length + (c.implementors || []).length + c.methods.length * 0.2; classes = classes.sort((a, b) => deg(b) - deg(a)).slice(0, 120); }
  const set = new Set(classes);
  const modules = [];
  const fileFns = new Map();
  for (const f of P.files) {
    if (!inScope(f.path) || f.lang === 'css' || f.lang === 'doc' || f.lang === 'data') continue;
    const loose = f.functions.filter(fn => !owner(fn) && !fn.parent);
    const mvars = f.variables.filter(v => !v.cls && v.kind !== 'id');
    if (loose.length && (classes.length < 60 || loose.length >= 3)) { modules.push(f); fileFns.set(f, { fns: loose, vars: mvars }); }
  }
  if (modules.length > 60) modules.length = 60;
  if (!classes.length && !modules.length) { setEmpty('No classes here', ' This code has no classes or module functions in the chosen scope. Try the Modules diagram.'); return null; }
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: 'BT', nodesep: 34, ranksep: 64, marginx: 30, marginy: 30 });
  g.setDefaultEdgeLabel(() => ({}));
  const nodes = new Map();
  const lineFor = (s, max) => s.length > max ? s.slice(0, max - 1) + '…' : s;
  const memberLines = (c) => {
    const fields = c.fields.slice(0, 10).map(v => { const tl = (v.typeLine || ''); const m = /:\s*([^=;{]+)/.exec(tl.replace(/^.*?\b(val|var|let)\s+\w+/, m0 => m0)); let ty = ''; if (m && !/^\s*\/\//.test(m[1])) ty = m[1].trim().replace(/\s+/g, ' ').replace(/[,)].*$/, ''); return (v.kind === 'const' ? '◦ ' : '− ') + v.name + (ty && ty.length < 26 ? ': ' + ty : ''); });
    if (c.fields.length > 10) fields.push('  +' + (c.fields.length - 10) + ' more');
    const ms = c.methods.filter(m => !m.parent || m.parent.cls !== c.name).slice(0, 14).map(m => '+ ' + m.name + '(' + lineFor((m.sig || '').replace(/\s+/g, ' '), 28) + ')');
    for (const a of (c.abstract || []).slice(0, 10)) if (!c.methods.some(m => m.name === a.name)) ms.push('+ ' + a.name + '(' + lineFor(a.sig || '', 28) + ') ᵃ');
    if (c.methods.length > 14) ms.push('  +' + (c.methods.length - 14) + ' more');
    return { fields, ms };
  };
  for (const c of classes) {
    const id = 'C:' + c.file.path + '#' + c.name;
    const { fields, ms } = memberLines(c);
    const ster = /interface|protocol|trait/.test(c.kind) ? '«' + c.kind + '»' : /abstract/.test(c.kind) ? '«abstract»' : c.kind === 'struct' || c.kind === 'type' ? '«' + c.kind + '»' : c.kind === 'enum' || c.kind === 'object' || c.kind === 'record' ? '«' + c.kind + '»' : c.fileLevel ? '«script»' : '';
    const ri = roles ? roles.clsByName.get(c.file.path + '#' + c.name) : null;
    const w = Math.max(150, (Math.max(c.name.length * 1.25, ster.length, ...fields.map(s => s.length), ...ms.map(s => s.length)) * CH) + 28);
    const h = 56 + (ster ? 12 : 0) + Math.max(1, fields.length) * 15 + 10 + Math.max(1, ms.length) * 15 + 10 + (ri != null ? 14 : 0);
    nodes.set(id, { id, c, fields, ms, ster, ri, width: w, height: h, kind: 'class' });
    g.setNode(id, { width: w, height: h });
  }
  for (const f of modules) {
    const id = 'M:' + f.path; const info = fileFns.get(f);
    const ms = info.fns.slice(0, 14).map(fn => 'ƒ ' + fn.name + '(' + lineFor(fn.sig || '', 26) + ')'); if (info.fns.length > 14) ms.push('  +' + (info.fns.length - 14) + ' more');
    const fields = info.vars.slice(0, 8).map(v => (v.kind === 'const' ? '◦ ' : '− ') + v.name);
    const ri = roles ? roles.files.get(f) : null;
    let fri = ri; if (fri == null && roles) for (const fn of info.fns) { const r = roles.fns.get(fn); if (r != null) { fri = r; break; } }
    const w = Math.max(150, Math.max(f.name.length * 1.25, 10, ...ms.map(s => s.length), ...fields.map(s => s.length)) * CH + 28);
    const h = 56 + Math.max(1, fields.length) * 15 + 10 + Math.max(1, ms.length) * 15 + 10 + (fri != null ? 14 : 0);
    nodes.set(id, { id, f, fields, ms, ster: '«module»', ri: fri, width: w, height: h, kind: 'module' });
    g.setNode(id, { width: w, height: h });
  }
  const edges = [];
  const addE = (a, b, kind, label) => { if (!nodes.has(a) || !nodes.has(b)) return; const name = kind + edges.length; edges.push({ a, b, kind, label, name }); g.setEdge(a, b, { kind, label, width: label ? label.length * 6 : 0, height: label ? 12 : 0, labelpos: 'c', minlen: kind === 'uses' ? 1 : 1 }, name); };
  for (const r of P.relations) {
    const a = 'C:' + r.from.file.path + '#' + r.from.name, b = 'C:' + r.to.file.path + '#' + r.to.name;
    if (!set.has(r.from) || !set.has(r.to)) continue;
    if (r.kind === 'uses' && !D.uses) continue;
    if (r.kind === 'has' && a === b) continue;
    addE(a, b, r.kind, r.kind === 'has' ? r.via : null);
  }
  const seen = new Set();
  for (const c of P.calls) {
    const a = ownerId(c.from), b = ownerId(c.to);
    if (a === b || (!a.startsWith('M:') && !b.startsWith('M:'))) continue;
    const k = a + '>' + b; if (seen.has(k)) continue; seen.add(k);
    addE(a, b, 'uses');
  }
  dagre.layout(g);
  const gr = el('g', {}, root);
  const eg = el('g', {}, gr);
  for (const e of edges) {
    const ed = g.edge(e.a, e.b, e.name); if (!ed || !ed.points) continue;
    const attrs = { d: pathOf(ed.points), class: 'edge e-' + e.kind };
    if (e.kind === 'extends' || e.kind === 'implements') attrs['marker-end'] = 'url(#m-tri)';
    if (e.kind === 'has') attrs['marker-start'] = 'url(#m-dia)';
    if (e.kind === 'uses') attrs['marker-end'] = 'url(#m-arr)';
    el('path', attrs, eg).dataset.a = e.a;
    if (e.label && ed.x != null) txt(e.label, { x: ed.x, y: ed.y + 4, class: 't-dim', 'text-anchor': 'middle' }, eg);
  }
  for (const n of nodes.values()) {
    const pos = g.node(n.id); const x = pos.x - n.width / 2, y = pos.y - n.height / 2;
    const ng = el('g', { class: 'node', transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')', tabindex: 0 }, gr);
    ng.dataset.id = n.id;
    const isSel = (n.c && App.selCls === n.c) || (n.f && App.sel === n.f && !App.selCls && !App.selFn) || (n.c && App.selFn && owner(App.selFn) === n.c);
    if (isSel) ng.classList.add('sel');
    if (App.roleFocus != null && n.ri !== App.roleFocus) ng.classList.add('dim');
    const rc = n.ri != null ? roles.list[n.ri].color : null;
    el('rect', { class: 'nodebox', width: n.width, height: n.height, style: rc ? 'stroke:' + rc : (n.kind === 'module' ? 'stroke-dasharray:5 3' : null) }, ng);
    let yy = 0;
    if (rc) { el('rect', { width: n.width, height: 14, fill: rc, opacity: 0.9 }, ng); txt(roles.list[n.ri].name, { x: 8, y: 10.5, class: 't-role', fill: COLORS.paper }, ng); yy = 14; }
    const fileLbl = n.kind === 'class' && n.c.file && !n.c.fileLevel ? n.c.file.name : null;
    const headH = (n.ster ? 12 : 0) + 34 + (fileLbl ? 12 : 0);
    el('rect', { class: 'hdr', y: yy, width: n.width, height: headH }, ng);
    if (n.ster) txt(n.ster, { x: n.width / 2, y: yy + 15, class: 't-ster', 'text-anchor': 'middle' }, ng);
    txt(n.c ? n.c.name : n.f.name, { x: n.width / 2, y: yy + (n.ster ? 34 : 23), class: 't-name', 'text-anchor': 'middle', 'font-style': n.ster === '«abstract»' || n.ster === '«interface»' ? 'italic' : null }, ng);
    yy += headH;
    if (fileLbl) txt(fileLbl, { x: n.width / 2, y: yy - 6, class: 't-dim', 'text-anchor': 'middle', 'font-size': 9.5 }, ng);
    el('line', { class: 'sep', x1: 0, x2: n.width, y1: yy, y2: yy }, ng);
    yy += 6;
    if (!n.fields.length) yy += 15; for (const s of n.fields) { yy += 15; txt(s, { x: 10, y: yy - 3, class: 't-mem' }, ng); }
    yy += 6; el('line', { class: 'sep', x1: 0, x2: n.width, y1: yy, y2: yy }, ng); yy += 4;
    if (!n.ms.length) yy += 15; for (const s of n.ms) { yy += 15; txt(s, { x: 10, y: yy - 3, class: 't-mem', fill: s.endsWith('ᵃ') ? COLORS.dim : null, 'font-style': s.endsWith('ᵃ') ? 'italic' : null }, ng); }
  }
  const gi = g.graph();
  const hidden = total - classes.length;
  note((hidden > 0 ? '<b>Showing the 120 most connected of ' + total + ' classes.</b> Pick a folder in Scope to see the rest. ' : '') +
    '<b>Reading it:</b> hollow triangle = inherits or implements (dashed). Diamond = has a field of that type. Dashed box = a module of plain functions. ' + (D.uses ? 'Grey dashed arrows = uses.' : 'Turn on <b>Uses</b> for looser dependencies.') + ' Click a box to select it in the city.');
  return { w: gi.width || 400, h: gi.height || 300 };
}

function moduleDiagram(root) {
  const P = App.project;
  let files = P.files.filter(f => inScope(f.path) && f.lang !== 'doc');
  const total = files.length;
  if (files.length > 220) { const deg = f => f.importsTo.length + f.importedBy.length; files = files.sort((a, b) => deg(b) - deg(a)).slice(0, 220); }
  const set = new Set(files);
  if (!files.length) { setEmpty('No files in this scope'); return null; }
  const g = new dagre.graphlib.Graph({ compound: true, multigraph: true });
  g.setGraph({ rankdir: 'LR', nodesep: 18, ranksep: 70, marginx: 30, marginy: 30 });
  g.setDefaultEdgeLabel(() => ({}));
  const dirs = new Set();
  const dirOf = f => f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/')) : '';
  const strip = (() => { const ps = files.map(f => f.path.split('/')); let s = 0; if (files.length > 1) while (ps.every(p => p.length > s + 1 && p[s] === ps[0][s])) s++; return s; })();
  for (const f of files) {
    const meta = f.langName + ' · ' + f.lines + ' lines · ' + f.functions.length + ' fn' + (f.classes.filter(c => !c.css).length ? ' · ' + f.classes.filter(c => !c.css).length + ' cls' : '');
    const w = Math.max(130, f.name.length * 8.6 + 24, meta.length * 6.6 + 24);
    g.setNode('F:' + f.path, { width: w, height: 44, f });
    const d = dirOf(f); const segs = d ? d.split('/') : [];
    if (segs.length > strip) {
      let parent = null;
      for (let i = strip + 1; i <= segs.length; i++) { const k = segs.slice(0, i).join('/'); if (!dirs.has(k)) { dirs.add(k); g.setNode('D:' + k, { label: segs[i - 1] + '/', clusterLabelPos: 'top' }); if (parent) g.setParent('D:' + k, parent); } parent = 'D:' + k; }
      g.setParent('F:' + f.path, parent);
    }
  }
  let n = 0;
  for (const e of P.edges) if (set.has(e.from) && set.has(e.to)) g.setEdge('F:' + e.from.path, 'F:' + e.to.path, { implicit: !!e.implicit }, 'e' + n++);
  dagre.layout(g);
  const gr = el('g', {}, root);
  for (const id of g.nodes()) if (id.startsWith('D:')) {
    const c = g.node(id); if (!c || c.width == null) continue;
    const cg = el('g', { class: 'cluster' }, gr);
    el('rect', { x: c.x - c.width / 2, y: c.y - c.height / 2, width: c.width, height: c.height }, cg);
    txt(c.label, { x: c.x - c.width / 2 + 8, y: c.y - c.height / 2 + 16 }, cg);
  }
  for (const e of g.edges()) {
    const ed = g.edge(e); if (!ed.points) continue;
    el('path', { d: pathOf(ed.points), class: 'edge ' + (ed.implicit ? 'e-implicit' : 'e-import'), 'marker-end': 'url(#m-a-amber)' }, gr).dataset.a = e.v;
  }
  const roles = App.roles;
  for (const id of g.nodes()) if (id.startsWith('F:')) {
    const nd = g.node(id); const f = nd.f;
    const ng = el('g', { class: 'node', transform: 'translate(' + (nd.x - nd.width / 2).toFixed(1) + ',' + (nd.y - nd.height / 2).toFixed(1) + ')', tabindex: 0 }, gr);
    ng.dataset.id = id;
    if (App.sel === f) ng.classList.add('sel');
    let ri = roles ? roles.files.get(f) : null;
    if (ri == null && roles) for (const fn of f.functions) { const r = roles.fns.get(fn); if (r != null) { ri = r; break; } }
    if (ri == null && roles) for (const c of f.classes) { const r = roles.clsByName.get(f.path + '#' + c.name); if (r != null) { ri = r; break; } }
    if (App.roleFocus != null && ri !== App.roleFocus) ng.classList.add('dim');
    el('rect', { class: 'nodebox', width: nd.width, height: nd.height, style: ri != null ? 'stroke:' + roles.list[ri].color : null }, ng);
    txt(f.name, { x: 10, y: 18, class: 't-name', 'font-size': 14 }, ng);
    txt(f.langName + ' · ' + f.lines + ' lines · ' + f.functions.length + ' fn' + (f.classes.filter(c => !c.css).length ? ' · ' + f.classes.filter(c => !c.css).length + ' cls' : ''), { x: 10, y: 34, class: 't-dim' }, ng);
  }
  note((total > files.length ? '<b>Showing the 220 most connected of ' + total + ' files.</b> ' : '') + '<b>Reading it:</b> each box is a file, dotted frames are folders. Solid amber arrows are imports; dashed ones are found by class name (Java, C#, Go and Godot need no import). Arrows point to the file being used.');
  const gi = g.graph(); return { w: gi.width || 400, h: gi.height || 300 };
}

function sequenceSteps() {
  if (D.scope === 'trace' && App.trace) return App.trace.steps.map((s, i) => ({ fn: s.fn, say: s.say, i }));
  if (D.scope && D.scope.startsWith('fn:')) {
    const start = fnByKey(D.scope.slice(3)); if (!start) return [];
    const out = []; const stack = new Set();
    const walk = (fn, depth, from) => {
      if (out.length > 48) return;
      out.push({ fn, from, depth }); if (depth >= 4 || stack.has(fn)) return; stack.add(fn);
      for (const c of fn.calls.slice(0, 8)) walk(c, depth + 1, fn);
      stack.delete(fn); out.push({ ret: true, fn, to: from });
    };
    walk(start, 0, null);
    return out;
  }
  return [];
}
function sequenceDiagram(root) {
  const steps = sequenceSteps();
  if (!steps.length) { setEmpty('No sequence to draw', ' Start a lesson trace, or select a function in the city to see the calls it makes.'); return null; }
  const isTrace = D.scope === 'trace';
  const parts = []; const pIdx = new Map();
  const pOf = fn => { const id = ownerId(fn); if (!pIdx.has(id)) { pIdx.set(id, parts.length); parts.push({ id, name: ownerName(fn), fn }); } return pIdx.get(id); };
  if (isTrace) { const first = steps[0].fn; if (first) pOf(first); }
  const msgs = [];
  if (isTrace) {
    steps.forEach((s, i) => {
      if (!s.fn) return; const to = pOf(s.fn);
      let from = null, kind = 'call';
      if (i === 0) { from = -1; kind = 'start'; }
      else {
        for (let k = i - 1; k >= 0; k--) { const pf = steps[k].fn; if (pf && pf.calls.includes(s.fn)) { from = pOf(pf); kind = pf.callKind && pf.callKind.get(s.fn) || 'call'; break; } }
        if (from == null) { from = pOf(steps[i - 1].fn); kind = 'next'; }
      }
      msgs.push({ from, to, label: s.fn.name + '()', kind, step: i, say: s.say });
    });
  } else {
    for (const s of steps) {
      if (s.ret) { if (s.to) msgs.push({ from: pOf(s.fn), to: pOf(s.to), label: 'return', kind: 'ret' }); continue; }
      const to = pOf(s.fn); const from = s.from ? pOf(s.from) : -1;
      msgs.push({ from, to, label: s.fn.name + '()', kind: s.from ? (s.from.callKind && s.from.callKind.get(s.fn)) || 'call' : 'start' });
    }
  }
  const colW = Math.max(150, ...parts.map(p => p.name.length * 8.4 + 40));
  const left = 70, top = 30, rowH = isTrace ? 46 : 32;
  const W = left + parts.length * colW + 40, H = top + 60 + msgs.length * rowH + 50;
  const gr = el('g', {}, root);
  const cx = i => left + i * colW + colW / 2;
  const roles = App.roles;
  parts.forEach((p, i) => {
    const x = cx(i); const ri = roles ? (owner(p.fn) ? roles.clsByName.get(owner(p.fn).file.path + '#' + owner(p.fn).name) : roles.files.get(p.fn.file)) : null;
    el('line', { class: 'life', x1: x, x2: x, y1: top + 40, y2: H - 20 }, gr);
    const ng = el('g', { class: 'node', transform: 'translate(' + (x - colW / 2 + 12) + ',' + top + ')', tabindex: 0 }, gr);
    ng.dataset.id = p.id;
    el('rect', { class: 'nodebox', width: colW - 24, height: 34, style: ri != null ? 'stroke:' + roles.list[ri].color : null }, ng);
    txt(p.name, { x: (colW - 24) / 2, y: 22, class: 't-name', 'text-anchor': 'middle', 'font-size': 14 }, ng);
    if (ri != null) txt(roles.list[ri].name, { x: (colW - 24) / 2, y: -5, class: 't-role', 'text-anchor': 'middle', fill: roles.list[ri].color }, ng);
  });
  msgs.forEach((m, k) => {
    const y = top + 70 + k * rowH;
    const mg = el('g', { class: 'msgrow' + (isTrace && App.trace && App.trace.i === m.step ? ' cur' : ''), style: isTrace ? 'cursor:pointer' : null }, gr);
    if (isTrace) mg.dataset.step = m.step;
    const markColor = m.kind === 'new' ? 'coral' : m.kind === 'poly' ? 'violet' : m.kind === 'ret' ? null : 'ink';
    if (m.from === -1) {
      const x2 = cx(m.to); el('circle', { cx: left - 30, cy: y, r: 4, fill: COLORS.amber }, mg);
      el('path', { class: 'msg', d: 'M' + (left - 26) + ',' + y + ' L' + (x2 - 4) + ',' + y, 'marker-end': 'url(#m-a-ink)' }, mg);
      txt(m.label, { x: (left - 26 + x2) / 2, y: y - 6, class: 'msgtxt', 'text-anchor': 'middle' }, mg);
    } else if (m.from === m.to) {
      const x = cx(m.from);
      el('path', { class: 'msg' + (m.kind === 'next' ? ' ret' : ''), d: 'M' + x + ',' + (y - 8) + ' h34 v16 h-30', 'marker-end': markColor ? 'url(#m-a-' + markColor + ')' : null }, mg);
      txt(m.label, { x: x + 40, y: y + 4, class: 'msgtxt' }, mg);
    } else {
      const x1 = cx(m.from), x2 = cx(m.to); const dir = x2 > x1 ? 1 : -1;
      el('path', { class: 'msg' + (m.kind === 'ret' || m.kind === 'next' ? ' ret' : ''), d: 'M' + x1 + ',' + y + ' L' + (x2 - dir * 4) + ',' + y, 'marker-end': markColor ? 'url(#m-a-' + markColor + ')' : 'url(#m-arr)', style: m.kind === 'new' ? 'stroke:' + COLORS.coral : m.kind === 'poly' ? 'stroke:' + COLORS.violet : null }, mg);
      txt((m.kind === 'new' ? '«create» ' : '') + m.label, { x: (x1 + x2) / 2, y: y - 6, class: 'msgtxt', 'text-anchor': 'middle', fill: m.kind === 'ret' ? COLORS.dim : null }, mg);
    }
    if (isTrace) txt(String(m.step + 1), { x: 14, y: y + 4, class: 'stepno' }, mg);
  });
  const cur = isTrace && App.trace ? App.trace.steps[App.trace.i] : null;
  note(isTrace ? (cur ? '<b>Step ' + (App.trace.i + 1) + ':</b> ' + esc(cur.say) + ' <span class="muted">Click a row to jump to that step.</span>' : '') :
    '<b>Reading it:</b> time runs downwards. Each column is a class or file; solid arrows are calls, dashed arrows are returns. Coral arrows create objects, violet ones go through an interface. Calls are found by name, so read this as a sketch.');
  return { w: W, h: H };
}

function dataflowDiagram(root) {
  const P = App.project;
  const files = P.files.filter(f => D.scope === '*' || !D.scope ? true : f.path === D.scope);
  let vars = [];
  for (const f of files) for (const v of f.variables) if ((v.writers || []).length || (v.readers || []).length) vars.push({ v, f });
  const total = vars.length;
  vars.sort((a, b) => ((b.v.writers || []).length + (b.v.readers || []).length) - ((a.v.writers || []).length + (a.v.readers || []).length));
  vars = vars.slice(0, 50);
  if (!vars.length) { setEmpty('No data flow found', ' None of these functions read or write shared variables or fields that the survey can see.'); return null; }
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: 'LR', nodesep: 14, ranksep: 90, marginx: 30, marginy: 30 });
  g.setDefaultEdgeLabel(() => ({}));
  const fnNodes = new Map(); let n = 0;
  const fnId = (fn, side) => { const k = 'F' + side + ':' + fn.file.path + '@' + fn.start; if (!fnNodes.has(k)) { const label = App.fnLabel(fn) + '()'; fnNodes.set(k, { fn, label, side }); g.setNode(k, { width: Math.max(110, label.length * 7.2 + 22), height: 30 }); } return k; };
  const edges = [];
  for (const { v, f } of vars) {
    const id = 'V:' + f.path + '#' + v.name + '@' + v.line;
    const label = (v.cls ? v.cls + '.' : '') + v.name;
    g.setNode(id, { width: Math.max(96, label.length * 7.4 + 30), height: 40, v, f, label });
    for (const w of (v.writers || []).slice(0, 12)) { const a = fnId(w, 'w'); edges.push([a, id, 'write']); g.setEdge(a, id, {}, 'e' + n++); }
    /* Readers that also write are still drawn as readers: a function that
       updates a tank usually reads it first, and the diagram should say so. */
    for (const r of (v.readers || []).slice(0, 12)) { const b = fnId(r, 'r'); edges.push([id, b, 'read']); g.setEdge(id, b, {}, 'e' + n++); }
  }
  dagre.layout(g);
  const gr = el('g', {}, root);
  for (const e of g.edges()) {
    const ed = g.edge(e); const kind = e.v.startsWith('V:') ? 'read' : 'write';
    el('path', { d: pathOf(ed.points), class: 'edge e-' + kind, 'marker-end': 'url(#m-a-' + (kind === 'write' ? 'amber' : 'mint') + ')', style: kind === 'read' ? 'stroke:' + COLORS.mint : null }, gr);
  }
  for (const id of g.nodes()) {
    const nd = g.node(id); const x = nd.x - nd.width / 2, y = nd.y - nd.height / 2;
    const ng = el('g', { class: 'node', transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')', tabindex: 0 }, gr);
    ng.dataset.id = id;
    if (id.startsWith('V:')) {
      const w = nd.width, h = nd.height;
      el('path', { class: 'tank', d: 'M0,7 A' + (w / 2) + ',7 0 0 1 ' + w + ',7 V' + (h - 7) + ' A' + (w / 2) + ',7 0 0 1 0,' + (h - 7) + ' Z' }, ng);
      el('path', { d: 'M0,7 A' + (w / 2) + ',7 0 0 0 ' + w + ',7', fill: 'none', stroke: COLORS.amber, 'stroke-opacity': 0.6 }, ng);
      txt(nd.label, { x: w / 2, y: h / 2 + 6, class: 't-mem', 'text-anchor': 'middle', fill: COLORS.ink }, ng);
    } else {
      const fnn = fnNodes.get(id);
      if (App.selFn === fnn.fn) ng.classList.add('sel');
      el('rect', { class: 'nodebox', width: nd.width, height: nd.height }, ng);
      txt(fnn.label, { x: 10, y: 19, class: 't-mem' }, ng);
    }
  }
  note((total > vars.length ? '<b>Showing the 50 busiest of ' + total + ' variables.</b> ' : '') + '<b>Reading it:</b> data moves left to right. Functions on the left <span style="color:#ffbf5a">write</span> into a variable (the tank); functions on the right <span style="color:#7ee0b5">read</span> it. A tank with many writers is shared state worth watching.');
  const gi = g.graph(); return { w: gi.width || 400, h: gi.height || 300 };
}

D.render = function () {
  if (!App.project || App.view !== 'diagrams') return;
  if (!window.dagre) { setEmpty('The diagram engine could not load', ' Check your connection and reload.'); return; }
  App.$$('[data-dg]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.dg === D.kind)) || b.classList.toggle('on', b.dataset.dg === D.kind));
  App.$('#dUses').hidden = D.kind !== 'classes';
  App.$('#dUses').setAttribute('aria-pressed', String(D.uses));
  App.$('#dTitle').textContent = { classes: 'Class diagram', modules: 'Module map', sequence: 'Sequence diagram', dataflow: 'Data flow' }[D.kind] + ' · ' + (App.projectName || '');
  fillScope();
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  setEmpty(null); note(null);
  defs(svg);
  const root = el('g', { id: 'droot' }, svg);
  let size = null;
  try { size = { classes: classDiagram, modules: moduleDiagram, sequence: sequenceDiagram, dataflow: dataflowDiagram }[D.kind](root); }
  catch (e) { console.error(e); setEmpty('This diagram could not be drawn', ' ' + e.message); }
  if (size) { const keep = D._keep && Math.abs(content.w - size.w) < 1 && Math.abs(content.h - size.h) < 1; content = size; if (keep) applyVB(); else D.fit(); }
};
function applyVB() { svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h); }
D.fit = function () {
  const r = svg.getBoundingClientRect(); const W = Math.max(200, r.width), H = Math.max(200, r.height);
  const s = Math.min(2.6, Math.max(content.w / W, content.h / H, 0.8));
  vb = { w: W * s, h: H * s, x: (content.w - W * s) / 2, y: content.h > H * s ? 0 : (content.h - H * s) / 2 };
  applyVB();
};
function zoom(f, cx, cy) {
  const r = svg.getBoundingClientRect();
  const px = cx == null ? 0.5 : (cx - r.left) / r.width, py = cy == null ? 0.5 : (cy - r.top) / r.height;
  const nw = Math.min(Math.max(vb.w * f, 80), 40000), nh = nw * vb.h / vb.w;
  vb.x += (vb.w - nw) * px; vb.y += (vb.h - nh) * py; vb.w = nw; vb.h = nh; applyVB();
}
svg.addEventListener('wheel', e => { e.preventDefault(); zoom(Math.exp(e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
let drag = null; const ptrs = new Map();
svg.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, moved: false, pinch: ptrs.size === 2 ? { d: dist2(), w: vb.w } : null }; svg.setPointerCapture(e.pointerId); });
const dist2 = () => { const p = [...ptrs.values()]; return p.length < 2 ? 0 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };
svg.addEventListener('pointermove', e => {
  if (!drag) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (drag.pinch && ptrs.size === 2) { const f = drag.pinch.d / Math.max(1, dist2()); const nw = drag.pinch.w * f; zoom(nw / vb.w); drag.moved = true; return; }
  const r = svg.getBoundingClientRect(); const s = vb.w / r.width;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 4) { drag.moved = true; svg.classList.add('dragging'); }
  vb.x = drag.vx - dx * s; vb.y = drag.vy - dy * s; applyVB();
});
const end = e => { ptrs.delete(e.pointerId); if (!drag) return; const moved = drag.moved; drag = ptrs.size ? drag : null; svg.classList.remove('dragging'); if (!moved && e.type === 'pointerup') clickAt(e); };
svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
function clickAt(e) {
  const t = document.elementFromPoint(e.clientX, e.clientY); if (!t) return;
  const row = t.closest('.msgrow'); if (row && row.dataset.step != null) { App.emit('trace-goto', +row.dataset.step); return; }
  const nd = t.closest('.node'); if (!nd) { App.emit('select', null); return; }
  activate(nd.dataset.id);
}
svg.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('node')) activate(e.target.dataset.id); });
function activate(id) {
  const P = App.project;
  if (id.startsWith('C:')) { const [p, n] = id.slice(2).split('#'); const f = P.files.find(x => x.path === p); const c = f && f.classes.find(x => x.name === n); if (c) App.emit('select', { file: f, cls: c }); }
  else if (id.startsWith('M:') || id.startsWith('F:')) { const f = P.files.find(x => x.path === id.slice(2)); if (f) App.emit('select', { file: f }); }
  else if (id.startsWith('Fw:') || id.startsWith('Fr:')) { const fn = fnByKey(id.slice(3)); if (fn) App.emit('select', { file: fn.file, fn }); }
  else if (id.startsWith('V:')) { const p = id.slice(2).split('#')[0]; const f = P.files.find(x => x.path === p); if (f) App.emit('select', { file: f }); }
}
App.$('#dnote').addEventListener('click', e => { if (innerWidth <= 760) e.currentTarget.hidden = true; });
App.$$('[data-dz]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.dz; if (k === 'fit') D.fit(); else zoom(k === 'in' ? 0.75 : 1.33); }));
App.$$('[data-dg]').forEach(b => b.addEventListener('click', () => { D.kind = b.dataset.dg; D.scope = null; store.set('dg', D.kind); D.render(); }));
App.$('#dScope').addEventListener('change', e => { D.scope = e.target.value; D.render(); });
App.$('#dUses').addEventListener('click', () => { D.uses = !D.uses; D.render(); });
App.$('#dCopy').addEventListener('click', async () => {
  const clone = svg.cloneNode(true); clone.setAttribute('xmlns', NS);
  const st = document.createElementNS(NS, 'style');
  st.textContent = 'text{font-family:JetBrains Mono,monospace;fill:#e9f3fb}.nodebox{fill:#081d33;stroke:#8fd0ff}.hdr{fill:rgba(143,208,255,.12)}.sep{stroke:rgba(143,208,255,.5)}.t-name{font-family:Barlow Condensed,sans-serif;font-size:15px;font-weight:600}.t-ster{font-size:10px;fill:#9cb9d2}.t-mem{font-size:11px;fill:#cfe3f3}.t-dim{font-size:10.5px;fill:#9cb9d2}.edge{fill:none;stroke-width:1.4}.e-extends,.e-implements{stroke:#e9f3fb}.e-implements{stroke-dasharray:6 4}.e-has{stroke:#8fd0ff}.e-uses{stroke:#6f8fae;stroke-dasharray:3 4}.e-import{stroke:#ffbf5a}.e-implicit{stroke:#ffbf5a;stroke-dasharray:4 4}.e-write{stroke:#ffbf5a}.e-read{stroke:#7ee0b5}.cluster rect{fill:none;stroke:rgba(143,208,255,.5);stroke-dasharray:2 3}.cluster text{fill:#8fd0ff}.life{stroke:rgba(143,208,255,.5);stroke-dasharray:4 4}.msg{stroke:#e9f3fb;fill:none}.msg.ret{stroke-dasharray:4 3}.tank{fill:rgba(255,191,90,.1);stroke:#ffbf5a}';
  clone.insertBefore(st, clone.firstChild);
  const bg = document.createElementNS(NS, 'rect'); bg.setAttribute('x', vb.x); bg.setAttribute('y', vb.y); bg.setAttribute('width', vb.w); bg.setAttribute('height', vb.h); bg.setAttribute('fill', '#0d2a47'); clone.insertBefore(bg, st.nextSibling);
  const text = new XMLSerializer().serializeToString(clone);
  try { await navigator.clipboard.writeText(text); App.toast('Copied the diagram as SVG. Paste it into a file or a design tool.'); }
  catch (err) { App.toast('Your browser blocked the clipboard here. Try again after clicking inside the page.', true); }
});
addEventListener('resize', () => { if (App.view === 'diagrams') D.fit(); });
export { D as Diagrams };
