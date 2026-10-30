/* Software City 3D view: the blueprint model. Folders are plates, files are
   buildings, functions are floors, nested functions are rooms, classes are
   dashed frames, variables are roof antennas, imports are arcs, and calls
   and data flow run through orthogonal pipes. */

import { App } from './core.js';

const T = window.THREE;
const City = window.City = { ok: !!(T && T.OrbitControls) };
if (!City.ok) { /* running headless (tests) — keep going without rendering. */ }
const COL = { paper: '#0d2a47', line: '#8fd0ff', ink: '#e9f3fb', amber: '#ffbf5a', coral: '#ff7a64', mint: '#7ee0b5', violet: '#c3a6ff' };
const PIPE_COL = { call: COL.line, poly: COL.violet, new: COL.coral, self: '#ffe27a', write: COL.amber, read: COL.mint };
const MAX_PIPES = 1600;

const S = City.state = {
  buildings: [], arcs: [], pipes: [], pickables: [],
  opts: { imports: true, calls: true, data: true, antennas: true, labels: true, floorLabels: true, roles: true, bugs: true, exploded: false },
  explode: 0, explodeTarget: 0, cutH: Infinity, maxH: 10, R: 20, tween: null, matches: null, hot: null, traveler: null, pipesDirty: false, follow: true
};

let renderer, scene, camera, controls, world, cutPlane;

function resize() {
  if (!renderer) return;
  const w = innerWidth, h = innerHeight;
  /* A hidden or not-yet-laid-out tab reports 0×0; w/h would be NaN and a
     NaN aspect poisons the camera for good (OrbitControls never recovers). */
  if (!(w > 0 && h > 0)) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
if (City.ok) {
  const canvas = App.$('#scene');
  renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  scene = new T.Scene();
  scene.background = new T.Color(COL.paper);
  scene.fog = new T.Fog(COL.paper, 140, 700);
  camera = new T.PerspectiveCamera(42, 1, 0.1, 5000);
  controls = new T.OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI * 0.497; controls.screenSpacePanning = true;
  scene.add(new T.HemisphereLight(0xd6eeff, 0x0a2038, 0.95));
  const sun = new T.DirectionalLight(0xffffff, 0.55); sun.position.set(40, 80, 25); scene.add(sun);
  world = new T.Group(); scene.add(world);
  cutPlane = new T.Plane(new T.Vector3(0, -1, 0), 1e6);
  addEventListener('resize', resize); resize();
  City.camera = camera; City.controls = controls;
}

const unitBox = City.ok ? new T.BoxGeometry(1, 1, 1) : null;
if (City.ok) unitBox.translate(0, 0.5, 0);
const unitEdges = City.ok ? new T.EdgesGeometry(unitBox) : null;
const lam = (c, o, e) => new T.MeshLambertMaterial({ color: c, emissive: c, emissiveIntensity: e == null ? 0.22 : e, transparent: true, opacity: o, depthWrite: o > 0.5 });
const fill = App.RAMP.map(c => lam(c, 0.62)), fillDim = App.RAMP.map(c => lam(c, 0.09, 0.05));
const subFill = App.RAMP.map(c => lam(c, 0.85, 0.3));
const fillHot = lam(COL.amber, 0.92, 0.55);
const traceMat = lam(COL.amber, 0.95, 0.8);
const podMat = lam('#1a4f7a', 0.7, 0.15), podDim = lam('#1a4f7a', 0.09, 0.05), podHot = lam('#3d6f95', 0.85, 0.3);
const lineM = (c, o) => new T.LineBasicMaterial({ color: c, transparent: true, opacity: o });
const edge = lineM(COL.line, 0.9), edgeDim = lineM(COL.line, 0.1), edgeHot = lineM(COL.amber, 1);
const clsEdge = new T.LineDashedMaterial({ color: COL.ink, dashSize: 0.22, gapSize: 0.14, transparent: true, opacity: 0.75 });
const plateMat = lam('#123a60', 0.55, 0.1), plateEdge = lineM(COL.line, 0.35);
const arcMat = lineM(COL.amber, 0.32), arcDim = lineM(COL.amber, 0.05), arcHot = lineM(COL.amber, 1);
const antGeo = City.ok ? new T.CylinderGeometry(0.035, 0.035, 1, 5) : null;
if (City.ok) antGeo.translate(0, 0.5, 0);
const tipGeo = City.ok ? new T.SphereGeometry(0.1, 10, 8) : null;
const antMat = new T.MeshBasicMaterial({ color: COL.line, transparent: true, opacity: 0.8 });
const tipMat = { const: new T.MeshBasicMaterial({ color: COL.amber }), var: new T.MeshBasicMaterial({ color: COL.line }), field: new T.MeshBasicMaterial({ color: '#c9e8ff' }), signal: new T.MeshBasicMaterial({ color: COL.coral }), id: new T.MeshBasicMaterial({ color: '#c9e8ff' }) };
const pipeMat = {}, pipeDim = {}, pipeHot = {};
for (const k in PIPE_COL) { pipeMat[k] = lam(PIPE_COL[k], 0.82, 0.35); pipeDim[k] = lam(PIPE_COL[k], 0.08, 0.05); pipeHot[k] = lam(PIPE_COL[k], 1, 0.75); }
const roleMats = new Map();
const roleMat = c => {
  if (!roleMats.has(c)) roleMats.set(c, {
    fill: lam(c, 0.8, 0.45),
    edge: lineM(c, 1),
    pod: lam(c, 0.45, 0.25),
    frame: new T.LineDashedMaterial({ color: c, dashSize: 0.22, gapSize: 0.12, transparent: true, opacity: 1 })
  });
  return roleMats.get(c);
};
const dotTex = (() => {
  if (!City.ok) return null;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,.85)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
})();

function boxPart(w, h, d, mat, eMat) {
  if (!City.ok) return null;
  const g = new T.Group();
  const mesh = new T.Mesh(unitBox, mat);
  const lines = new T.LineSegments(unitEdges, eMat);
  g.add(mesh, lines); g.scale.set(w, h, d);
  return { g, mesh, lines };
}
function textCanvas(text, px, color, font, spacing, bg) {
  if (!City.ok) return null;
  const c = document.createElement('canvas'); const g = c.getContext('2d');
  const f = px + 'px ' + font; g.font = f;
  const sp = spacing || 0; const w = Math.ceil(g.measureText(text).width + sp * text.length) + px;
  c.width = Math.min(2048, w); c.height = Math.ceil(px * 1.5);
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height); }
  g.font = f; g.fillStyle = color; g.textBaseline = 'middle';
  if (sp) { let x = px / 2; for (const ch of text) { g.fillText(ch, x, c.height / 2); x += g.measureText(ch).width + sp; } }
  else g.fillText(text, px / 2, c.height / 2);
  const tex = new T.CanvasTexture(c); tex.anisotropy = 4;
  return { tex, aspect: c.width / c.height };
}

function squarify(items, rect) {
  const out = []; let r = { ...rect }; let row = []; let i = 0;
  const worst = (rw, side) => { let s = 0, mx = 0, mn = Infinity; for (const it of rw) { s += it.area; mx = Math.max(mx, it.area); mn = Math.min(mn, it.area); } const s2 = s * s, w2 = side * side; return Math.max(w2 * mx / s2, s2 / (w2 * mn)); };
  const place = rw => {
    const s = rw.reduce((a, b) => a + b.area, 0);
    if (r.w >= r.h) { const cw = s / r.h; let y = r.y; for (const it of rw) { const hh = it.area / cw; out.push({ it, x: r.x, y, w: cw, h: hh }); y += hh; } r = { x: r.x + cw, y: r.y, w: r.w - cw, h: r.h }; }
    else { const rh = s / r.w; let x = r.x; for (const it of rw) { const ww = it.area / rh; out.push({ it, x, y: r.y, w: ww, h: rh }); x += ww; } r = { x: r.x, y: r.y + rh, w: r.w, h: r.h - rh }; }
  };
  while (i < items.length) {
    const side = Math.min(r.w, r.h), it = items[i];
    if (!row.length || worst(row.concat([it]), side) <= worst(row, side)) { row.push(it); i++; } else { place(row); row = []; }
  }
  if (row.length) place(row);
  return out;
}
function buildTree(files) {
  const parts = files.map(f => f.path.split('/'));
  let strip = 0;
  if (files.length > 1) { while (parts.every(p => p.length > strip + 1 && p[strip] === parts[0][strip])) strip++; }
  const root = { name: 'root', dirs: new Map(), files: [], depth: 0 };
  files.forEach((f, k) => {
    let node = root; const segs = parts[k].slice(strip, -1);
    for (const s of segs) { if (!node.dirs.has(s)) node.dirs.set(s, { name: s, dirs: new Map(), files: [], depth: node.depth + 1, parent: node }); node = node.dirs.get(s); }
    node.files.push(f);
  });
  const weigh = n => { let w = 0; for (const f of n.files) w += f._w; for (const d of n.dirs.values()) w += weigh(d); n.w = w * 1.2 + (n.depth ? 7 : 0); return n.w; };
  weigh(root);
  return root;
}

function disposeWorld() {
  if (!City.ok || !world) return;
  world.traverse(o => {
    if (o.material && o.material.map && o.material.map !== dotTex) { o.material.map.dispose(); o.material.dispose(); }
    if (o.userData.ownGeo) o.geometry.dispose();
  });
  scene.remove(world); world = new T.Group(); scene.add(world);
  S.pipeGroup = null; S.hotGroup = null; S.traveler = null; S.bugGroup = null;
}

City.build = function (project) {
  if (!City.ok) return;
  disposeWorld();
  S.buildings = []; S.arcs = []; S.pipes = []; S.pickables = []; S.matches = null; S.hot = null;
  S.project = project; S.bugs = null; S.bugPicks = []; S.plates = [];
  const files = project.files;
  let floorCount = 0;
  for (const f of files) {
    f._top = f.functions.filter(fn => !fn.parent);
    const inFns = f._top.reduce((s, fn) => s + fn.lines, 0);
    f._rest = Math.max(0, f.lines - inFns);
    f._fp = Math.min(7.5, Math.max(1.25, 0.9 + Math.sqrt(Math.max(f.lines, 1)) * 0.17));
    f._w = Math.pow(f._fp + 1.6, 2);
    floorCount += f._top.length;
  }
  S.small = floorCount <= 220 && files.length <= 60;
  const root = buildTree(files);
  const side = Math.sqrt(root.w);
  const labelSet = new Set(files.slice().sort((a, b) => b.lines - a.lines).slice(0, 140));

  const layoutNode = (node, rect) => {
    const d = node.depth;
    let inner = rect;
    if (d > 0) {
      const pad = 0.45;
      const plate = boxPart(rect.w - 0.1, 0.07, rect.h - 0.1, plateMat, plateEdge);
      plate.g.position.set(rect.x + rect.w / 2, (d - 1) * 0.07, rect.y + rect.h / 2);
      world.add(plate.g);
      S.plates.push({ name: node.name, depth: d, x: rect.x, z: rect.y, w: rect.w, h: rect.h });
      let strip = 0;
      if (d <= 3 && rect.w > 2.4 && rect.h > 2.4) {
        const t = textCanvas(node.name.toUpperCase(), 64, 'rgba(233,243,251,.92)', '"Architects Daughter", cursive', 6);
        const s = Math.min(1.1, Math.max(0.42, rect.h * 0.08), (rect.w - 1) / t.aspect);
        const pl = new T.Mesh(new T.PlaneGeometry(t.aspect * s, s), new T.MeshBasicMaterial({ map: t.tex, transparent: true, depthWrite: false }));
        pl.userData.ownGeo = true; pl.rotation.x = -Math.PI / 2;
        pl.position.set(rect.x + pad + t.aspect * s / 2, d * 0.07 + 0.012, rect.y + rect.h - pad - s * 0.55);
        world.add(pl); strip = s * 1.15;
      }
      inner = { x: rect.x + pad, y: rect.y + pad, w: Math.max(0.2, rect.w - pad * 2), h: Math.max(0.2, rect.h - pad * 2 - strip) };
    }
    const items = [];
    for (const f of node.files) items.push({ area: f._w, f });
    for (const c of node.dirs.values()) items.push({ area: c.w, n: c });
    const tot = items.reduce((s, it) => s + it.area, 0) || 1;
    const k = inner.w * inner.h / tot;
    items.forEach(it => it.area *= k);
    items.sort((a, b) => b.area - a.area);
    for (const cell of squarify(items, inner)) {
      if (cell.it.n) layoutNode(cell.it.n, cell);
      else makeBuilding(cell.it.f, cell, d * 0.07, labelSet.has(cell.it.f));
    }
  };

  const makeBuilding = (f, cell, baseY, labelled) => {
    const fp = Math.max(0.45, Math.min(f._fp, cell.w - 0.45, cell.h - 0.45));
    const g = new T.Group(); g.position.set(cell.x + cell.w / 2, baseY, cell.y + cell.h / 2);
    const b = { file: f, group: g, fp, fw: fp * 0.84, x: g.position.x, z: g.position.z, baseY, floors: [], frames: [], height: 0, varPos: new Map() };
    f._b = b;
    const hasFns = f._top.length > 0;
    const podH = hasFns ? 0.22 + Math.sqrt(f._rest) * 0.05 : 0.3 + Math.sqrt(Math.max(1, f.lines)) * 0.13;
    const pod = boxPart(fp, podH, fp, podMat, edge);
    pod.mesh.userData = { kind: 'file', b };
    g.add(pod.g); S.pickables.push(pod.mesh); b.pod = pod; b.podH = podH;
    let y = podH; const fw = b.fw;
    const tops = f._top.slice(0, 90);
    tops.forEach((fn, i) => {
      const h = 0.2 + Math.sqrt(fn.lines) * 0.105;
      const part = boxPart(fw, h, fw, fill[App.bucket(fn.cx)], edge);
      part.g.position.y = y; g.add(part.g);
      part.mesh.userData = { kind: 'fn', b, fn };
      S.pickables.push(part.mesh);
      const rec = { part, fn, h, baseY: y, explY: y + (i + 1) * 0.55, bkt: App.bucket(fn.cx), b, subs: [] };
      b.floors.push(rec); fn._floor = rec;
      const kids = f.functions.filter(k => k.parent === fn).slice(0, 40);
      for (const k of kids) {
        const a0 = (k.start - fn.start) / fn.lines, a1 = (k.end - fn.start + 1) / fn.lines;
        const sp = boxPart(fw * 0.6, 1, fw * 0.6, subFill[App.bucket(k.cx)], edge);
        g.add(sp.g); sp.mesh.userData = { kind: 'fn', b, fn: k };
        S.pickables.push(sp.mesh);
        const sr = { part: sp, fn: k, a0, a1, parentRec: rec, bkt: App.bucket(k.cx), b, sub: true, h: 0 };
        rec.subs.push(sr); k._floor = sr;
      }
      if (S.small) {
        const label = fn.name.length > 26 ? fn.name.slice(0, 25) + '…' : fn.name;
        const t = textCanvas(label, 40, '#ffffff', '"JetBrains Mono", monospace', 0);
        const lh = Math.min(h * 0.62, 0.34), lw = Math.min(fw * 0.94, t.aspect * lh);
        const lh2 = lw / t.aspect;
        const mat = new T.MeshBasicMaterial({ map: t.tex, transparent: true, depthWrite: false, opacity: 0.95 });
        const front = new T.Mesh(new T.PlaneGeometry(lw, lh2), mat); front.userData.ownGeo = true;
        const side2 = new T.Mesh(front.geometry, mat); side2.rotation.y = Math.PI / 2;
        rec.labels = [front, side2];
        g.add(front, side2);
      }
      y += h + 0.04;
    });
    b.height = y; b.explHeight = tops.length ? y + tops.length * 0.55 : y;
    let run = null;
    const flush = () => { if (run && run.cls) { const ls = new T.LineSegments(new T.EdgesGeometry(unitBox), clsEdge); ls.userData.ownGeo = true; g.add(ls); b.frames.push({ ls, a: run.a, z: run.z, cls: run.cls }); } };
    tops.forEach((fn, i) => { if (!run || run.cls !== fn.cls) { flush(); run = { cls: fn.cls, a: i, z: i }; } else run.z = i; });
    flush();
    const roof = new T.Group(); g.add(roof); b.roof = roof;
    const vars = f.variables.slice(0, 30);
    const n = Math.ceil(Math.sqrt(vars.length)); const span = fw * 0.74;
    vars.forEach((v, i) => {
      const r = Math.floor(i / n), c = i % n;
      const px = n > 1 ? -span / 2 + span * c / (n - 1) : 0, pz = n > 1 ? -span / 2 + span * r / (n - 1) : 0;
      const ah = v.kind === 'const' ? 0.4 : v.kind === 'signal' ? 0.8 : 0.6;
      const a = new T.Mesh(antGeo, antMat); a.scale.y = ah; a.position.set(px, 0, pz);
      const tip = new T.Mesh(tipGeo, tipMat[v.kind] || tipMat.var); tip.position.set(px, ah, pz);
      tip.userData = { kind: 'var', b, v };
      roof.add(a, tip); S.pickables.push(tip);
      b.varPos.set(v, new T.Vector3(px, ah, pz));
    });
    if (labelled) {
      const t = textCanvas(f.name, 44, '#e9f3fb', '"JetBrains Mono", monospace', 0);
      const sp = new T.Sprite(new T.SpriteMaterial({ map: t.tex, transparent: true, depthWrite: false, depthTest: true }));
      const s = 0.34 + fp * 0.07; sp.scale.set(t.aspect * s, s, 1); sp.center.set(0.5, 0);
      g.add(sp); b.label = sp;
    }
    world.add(g);
    S.buildings.push(b);
    layoutBuilding(b, 0);
  };

  layoutNode(root, { x: 0, y: 0, w: side, h: side });
  world.position.set(-side / 2, 0, -side / 2);
  S.side = side; S.R = Math.max(6, side * 0.75);
  S.maxH = Math.max(2, ...S.buildings.map(b => b.baseY + b.height));

  const gsize = Math.ceil(side * 2.4 / 10) * 10 + 20;
  const g1 = new T.GridHelper(gsize, gsize, 0x3d6f95, 0x1b4468); g1.material.transparent = true; g1.material.opacity = 0.32; g1.position.set(side / 2, -0.02, side / 2);
  const g2 = new T.GridHelper(gsize, gsize / 10, 0x5a8cb3, 0x5a8cb3); g2.material.transparent = true; g2.material.opacity = 0.42; g2.position.set(side / 2, -0.015, side / 2);
  g1.userData.ownGeo = g2.userData.ownGeo = true; world.add(g1, g2);
  const bnd = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(side + 1.2, 0.01, side + 1.2)), lineM(COL.line, 0.6));
  bnd.userData.ownGeo = true; bnd.position.set(side / 2, 0, side / 2); world.add(bnd);
  const ci = new T.Mesh(new T.PlaneGeometry(side + 2, side + 2), new T.MeshBasicMaterial({ color: COL.amber, transparent: true, opacity: 0.06, side: T.DoubleSide, depthWrite: false }));
  ci.rotation.x = -Math.PI / 2; ci.position.set(side / 2, 0, side / 2); ci.visible = false; ci.userData.ownGeo = true;
  const cie = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(side + 2, side + 2)), lineM(COL.amber, 0.8)); cie.userData.ownGeo = true;
  ci.add(cie); world.add(ci); S.cutMesh = ci;

  const tr = new T.Group();
  const core = new T.Mesh(new T.SphereGeometry(0.2, 16, 12), new T.MeshBasicMaterial({ color: COL.amber }));
  const halo = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: COL.amber, transparent: true, depthWrite: false, opacity: 0.9 })); halo.scale.set(1.5, 1.5, 1);
  core.userData.ownGeo = true; tr.add(core, halo); tr.visible = false; world.add(tr);
  S.traveler = { g: tr, path: null, t: 1 };

  buildArcs();
  buildPipes();
  City.applyOptions();
  City.applyCut();
  City.refresh();
  City.view('iso', true);
};

function layoutBuilding(b, t) {
  for (const f of b.floors) {
    f.part.g.position.y = f.baseY + (f.explY - f.baseY) * t;
    for (const s of f.subs) { const y0 = f.part.g.position.y + f.h * s.a0, y1 = f.part.g.position.y + f.h * s.a1; s.part.g.position.y = y0 + 0.01; s.part.g.scale.y = Math.max(0.04, y1 - y0 - 0.02); s.h = y1 - y0; }
    if (f.labels) { const y = f.part.g.position.y + f.h / 2; f.labels[0].position.set(0, y, b.fw / 2 + 0.012); f.labels[1].position.set(b.fw / 2 + 0.012, y, 0); }
  }
  const last = b.floors[b.floors.length - 1];
  const top = last ? last.part.g.position.y + last.h : b.height;
  for (const fr of b.frames) {
    const a = b.floors[fr.a], z = b.floors[fr.z];
    const y0 = a.part.g.position.y - 0.05, y1 = z.part.g.position.y + z.h + 0.05, w = b.fp * 0.96;
    fr.ls.scale.set(w, y1 - y0, w); fr.ls.position.y = y0; fr.ls.computeLineDistances();
  }
  b.roof.position.y = top; b.top = top;
  if (b.label) b.label.position.y = top + (b.roof.children.length ? 1.15 : 0.3);
}

function buildArcs() {
  if (!City.ok) return;
  for (const a of S.arcs) { world.remove(a.line); a.line.geometry.dispose(); }
  if (S.arcPoints) { world.remove(S.arcPoints); S.arcPoints.geometry.dispose(); S.arcPoints = null; }
  S.arcs = [];
  for (const e of S.project.edges.slice(0, 900)) {
    const A = e.from._b, B = e.to._b; if (!A || !B) continue;
    const ya = A.baseY + A.top + 0.15, yb = B.baseY + B.top + 0.15;
    const p0 = new T.Vector3(A.x, ya, A.z), p2 = new T.Vector3(B.x, yb, B.z);
    const dist = p0.distanceTo(p2);
    const p1 = new T.Vector3((A.x + B.x) / 2, Math.max(ya, yb) + 1.2 + dist * 0.33, (A.z + B.z) / 2);
    const curve = new T.QuadraticBezierCurve3(p0, p1, p2);
    const line = new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(32)), arcMat);
    world.add(line);
    S.arcs.push({ e, curve, line, off: Math.random(), speed: 0.1 + 2.5 / (dist + 12) });
  }
  if (S.arcs.length) {
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(S.arcs.length * 3), 3));
    S.arcPoints = new T.Points(geo, new T.PointsMaterial({ size: 0.5, map: dotTex, color: COL.amber, transparent: true, depthWrite: false }));
    world.add(S.arcPoints);
  }
}

class Poly extends T.Curve {
  constructor(pts) { super(); this.pts = pts; this.lens = [0]; for (let i = 1; i < pts.length; i++) this.lens.push(this.lens[i - 1] + pts[i].distanceTo(pts[i - 1])); this.len = this.lens[this.lens.length - 1] || 1; }
  getPoint(t, out = new T.Vector3()) {
    const d = Math.min(1, Math.max(0, t)) * this.len; let i = 1; while (i < this.lens.length - 1 && this.lens[i] < d) i++;
    const a = this.pts[i - 1], b = this.pts[i]; const seg = this.lens[i] - this.lens[i - 1] || 1;
    return out.copy(a).lerp(b, (d - this.lens[i - 1]) / seg);
  }
}
City.Poly = Poly;
const FACES = [new T.Vector3(1, 0, 0), new T.Vector3(-1, 0, 0), new T.Vector3(0, 0, 1), new T.Vector3(0, 0, -1)];
function recY(rec) { return rec.b.baseY + rec.part.g.position.y + (rec.sub ? rec.h / 2 : rec.h / 2); }
function faceFor(b, toward) { let best = FACES[0], bd = -Infinity; for (const f of FACES) { const d = f.x * (toward.x - b.x) + f.z * (toward.z - b.z); if (d > bd) { bd = d; best = f; } } return best; }
function anchor(rec, n, lane) {
  const b = rec.b; const off = rec.sub ? b.fw * 0.3 : b.fw / 2;
  const side = new T.Vector3(-n.z, 0, n.x).multiplyScalar(((lane % 5) - 2) * Math.min(0.12, b.fw * 0.08));
  return new T.Vector3(b.x + n.x * off, recY(rec), b.z + n.z * off).add(side);
}
function route(ra, rb, lane, kind) {
  const A = ra.b, B = rb.b;
  if (A === B) {
    const n = kind === 'new' ? FACES[3] : FACES[0];
    const out = 0.28 + (lane % 6) * 0.11;
    const a = anchor(ra, n, lane), b = anchor(rb, n, lane + 1);
    const a1 = a.clone().addScaledVector(n, out), b1 = b.clone().addScaledVector(n, out);
    b1.y = b.y; const m = new T.Vector3(a1.x, b.y, a1.z);
    return [a, a1, m, b1, b];
  }
  const na = faceFor(A, B), nb = faceFor(B, A);
  const a = anchor(ra, na, lane), b = anchor(rb, nb, lane);
  const a1 = a.clone().addScaledVector(na, 0.3 + (lane % 4) * 0.06), b1 = b.clone().addScaledVector(nb, 0.3 + (lane % 4) * 0.06);
  const H = Math.max(a.y, b.y, A.baseY + A.top * 0.5, B.baseY + B.top * 0.5) + 0.7 + (lane % 7) * 0.16;
  const a2 = new T.Vector3(a1.x, H, a1.z), b2 = new T.Vector3(b1.x, H, b1.z);
  const m = Math.abs(na.x) > 0 ? new T.Vector3(b2.x, H, a2.z) : new T.Vector3(a2.x, H, b2.z);
  return [a, a1, a2, m, b2, b1, b];
}
function loopRoute(rec) {
  const n = FACES[0]; const side = new T.Vector3(0, 0, 1);
  const a = anchor(rec, n, 1).addScaledVector(side, -0.12), b = anchor(rec, n, 3).addScaledVector(side, 0.12);
  const out = 0.45, lift = Math.max(0.12, (rec.h || 0.3) * 0.35);
  return [a, a.clone().addScaledVector(n, out), a.clone().addScaledVector(n, out).add(new T.Vector3(0, lift, 0)), b.clone().addScaledVector(n, out).add(new T.Vector3(0, lift, 0)), b.clone().addScaledVector(n, out), b];
}
function varRoute(rec, v, lane) {
  const b = rec.b; const vp = b.varPos.get(v); if (!vp) return null;
  const n = FACES[2];
  const a = anchor(rec, n, lane);
  const tip = new T.Vector3(b.x + vp.x, b.baseY + b.top + vp.y, b.z + vp.z);
  const out = 0.22 + (lane % 6) * 0.09;
  const a1 = a.clone().addScaledVector(n, out);
  const up = new T.Vector3(a1.x, tip.y + 0.25 + (lane % 3) * 0.07, a1.z);
  const over = new T.Vector3(tip.x, up.y, tip.z);
  return [a, a1, up, over, tip];
}
function dedupe(pts) { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) if (pts[i].distanceToSquared(out[out.length - 1]) > 1e-6) out.push(pts[i]); return out; }
function tubeOf(pts, r) {
  const c = new Poly(dedupe(pts));
  return { curve: c, geo: new T.TubeGeometry(c, Math.max(12, Math.min(120, Math.round(c.len * 5))), r, 6, false) };
}
function mergeGeos(list) {
  let nv = 0, ni = 0; for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = new Uint32Array(ni);
  let vo = 0, io = 0;
  for (const g of list) { pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3); const ix = g.index.array; for (let k = 0; k < ix.length; k++) idx[io + k] = ix[k] + vo; vo += g.attributes.position.count; io += g.index.length; g.dispose(); }
  const m = new T.BufferGeometry(); m.setAttribute('position', new T.BufferAttribute(pos, 3)); m.setAttribute('normal', new T.BufferAttribute(nor, 3)); m.setIndex(new T.BufferAttribute(idx, 1));
  return m;
}
function collectPipes() {
  const out = []; const laneOf = new Map(); const lane = k => { const v = laneOf.get(k) || 0; laneOf.set(k, v + 1); return v; };
  for (const c of S.project.calls) {
    const ra = c.from._floor, rb = c.to._floor; if (!ra || !rb || ra === rb) continue;
    out.push({ kind: c.kind, from: c.from, to: c.to, ra, rb, lane: lane(ra.b.file.path + (ra.b === rb.b ? '' : '>' + rb.b.file.path)) });
  }
  for (const f of S.project.files) for (const fn of f.functions) {
    const r = fn._floor; if (!r) continue;
    if (fn.recursive) out.push({ kind: 'self', from: fn, to: fn, ra: r, rb: r, loop: true, lane: 0 });
    for (const v of fn.writes || []) out.push({ kind: 'write', from: fn, v, ra: r, lane: lane('v' + f.path) });
    for (const v of fn.reads || []) if (!(fn.writes || []).includes(v)) out.push({ kind: 'read', from: fn, v, ra: r, lane: lane('v' + f.path) });
  }
  return out;
}
function geomFor(p) {
  const pts = p.v ? varRoute(p.ra, p.v, p.lane) : p.loop ? loopRoute(p.ra) : route(p.ra, p.rb, p.lane, p.kind);
  if (!pts) return null;
  if (p.kind === 'read') pts.reverse();
  return pts;
}
function buildPipes() {
  if (!City.ok) return;
  if (S.pipeGroup) { S.pipeGroup.traverse(o => o.geometry && o.geometry.dispose()); world.remove(S.pipeGroup); }
  S.pipeGroup = new T.Group(); world.add(S.pipeGroup);
  const all = collectPipes();
  S.pipeTotal = { calls: all.filter(p => !p.v).length, data: all.filter(p => p.v).length };
  const callP = all.filter(p => !p.v).slice(0, MAX_PIPES), dataP = all.filter(p => p.v).slice(0, MAX_PIPES);
  S.pipes = callP.concat(dataP);
  const geos = {}; for (const k in PIPE_COL) geos[k] = [];
  for (const p of S.pipes) {
    const pts = geomFor(p); if (!pts) continue;
    const t = tubeOf(pts, p.v ? 0.035 : 0.05);
    p.curve = t.curve; geos[p.kind].push(t.geo);
  }
  S.pipeMeshes = {};
  for (const k in geos) if (geos[k].length) {
    const m = new T.Mesh(mergeGeos(geos[k]), pipeMat[k]); m.userData.kind = k; S.pipeGroup.add(m); S.pipeMeshes[k] = m;
  }
  const mk = (list, color) => { if (!list.length) return null; const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(list.length * 3), 3)); const pts = new T.Points(geo, new T.PointsMaterial({ size: 0.32, map: dotTex, color, transparent: true, depthWrite: false })); pts.userData.list = list; S.pipeGroup.add(pts); return pts; };
  const withCurve = S.pipes.filter(p => p.curve);
  withCurve.forEach(p => { p.off = Math.random(); p.speed = 0.6 / (p.curve.len + 2); });
  S.packets = [mk(withCurve.filter(p => !p.v), '#e9f3fb'), mk(withCurve.filter(p => p.kind === 'write'), COL.amber), mk(withCurve.filter(p => p.kind === 'read'), COL.mint)].filter(Boolean);
  S.pipesDirty = false;
  City.refresh();
}

function relatedSet() {
  const sel = App.sel, fn = App.selFn, cls = App.selCls;
  if (!sel && !fn && !cls) return null;
  const files = new Set(), fns = new Set();
  if (fn) { fns.add(fn); (fn.calls || []).forEach(x => fns.add(x)); (fn.calledBy || []).forEach(x => fns.add(x)); fns.forEach(x => files.add(x.file)); }
  else if (cls) { for (const m of cls.methods) { fns.add(m); (m.calls || []).forEach(x => fns.add(x)); (m.calledBy || []).forEach(x => fns.add(x)); } fns.forEach(x => files.add(x.file)); files.add(cls.file); }
  else { files.add(sel); sel.importsTo.forEach(f => files.add(f)); sel.importedBy.forEach(f => files.add(f)); for (const x of sel.functions) { fns.add(x); (x.calls || []).forEach(y => { fns.add(y); files.add(y.file); }); (x.calledBy || []).forEach(y => { fns.add(y); files.add(y.file); }); } }
  return { files, fns };
}
function setFloor(rec, mode, role) {
  if (mode === 'hot') { rec.part.mesh.material = fillHot; rec.part.lines.material = edgeHot; return; }
  if (mode === 'trace') { rec.part.mesh.material = traceMat; rec.part.lines.material = edgeHot; return; }
  if (role && mode !== 'dim') { const rm = roleMat(role); rec.part.mesh.material = rm.fill; rec.part.lines.material = rm.edge; return; }
  const arr = rec.sub ? subFill : fill;
  rec.part.mesh.material = mode === 'dim' ? fillDim[rec.bkt] : arr[rec.bkt];
  rec.part.lines.material = mode === 'dim' ? edgeDim : edge;
}
function setPod(b, mode, role) {
  if (role && mode !== 'dim' && mode !== 'hot') { const rm = roleMat(role); b.pod.mesh.material = rm.pod; b.pod.lines.material = rm.edge; return; }
  b.pod.mesh.material = mode === 'hot' ? podHot : mode === 'dim' ? podDim : podMat;
  b.pod.lines.material = mode === 'hot' ? edgeHot : mode === 'dim' ? edgeDim : edge;
}
City.refresh = function () {
  if (!City.ok || !S.project) return;
  const m = S.matches; const rel = relatedSet(); const roles = S.opts.roles ? App.roles : null; const focus = App.roleFocus;
  const roleOfFn = fn => { if (!roles) return null; let r = roles.fns.get(fn); if (r == null && fn.cls) r = roles.clsByName.get(fn.file.path + '#' + fn.cls); if (r == null) r = roles.files.get(fn.file); if (r == null && fn.parent) return roleOfFn(fn.parent); return r == null ? null : r; };
  const traceFn = S.hot;
  for (const b of S.buildings) {
    const f = b.file;
    const fileRole = roles ? roles.files.get(f) : null;
    const allFloors = b.floors.flatMap(r => [r, ...r.subs]);
    const clsRole = roles ? f.classes.map(c => roles.clsByName.get(f.path + '#' + c.name)).find(x => x != null) : null;
    const anyRole = roles && (fileRole != null || clsRole != null || allFloors.some(r => roleOfFn(r.fn) != null));
    for (const r of allFloors) {
      const ri = roleOfFn(r.fn); const rc = ri != null ? roles.list[ri].color : null;
      let mode = 'normal';
      if (traceFn && r.fn === traceFn) mode = 'trace';
      else if (m) mode = m.fns.has(r.fn) ? 'hot' : m.files.has(f) ? 'normal' : 'dim';
      else if (rel) mode = App.selFn === r.fn ? 'hot' : (rel.fns.has(r.fn) || (!App.selFn && !App.selCls && f === App.sel)) ? 'normal' : 'dim';
      else if (focus != null) mode = ri === focus ? 'normal' : 'dim';
      else if (roles && !anyRole) mode = 'dim';
      setFloor(r, mode, mode === 'normal' || mode === 'dim' ? (mode === 'dim' ? null : rc) : null);
    }
    let pm = 'normal';
    if (m) pm = m.files.has(f) ? 'hot' : 'dim';
    else if (rel) pm = (f === App.sel && !App.selFn && !App.selCls) ? 'hot' : rel.files.has(f) ? 'normal' : 'dim';
    else if (focus != null) pm = fileRole === focus || clsRole === focus || allFloors.some(r => roleOfFn(r.fn) === focus) ? 'normal' : 'dim';
    else if (roles && !anyRole) pm = 'dim';
    const podRole = fileRole != null ? fileRole : (clsRole != null && !allFloors.length ? clsRole : null);
    setPod(b, pm, podRole != null && pm === 'normal' && (focus == null || podRole === focus) ? roles.list[podRole].color : null);
    for (const fr of b.frames) { const ri = roles ? roles.clsByName.get(f.path + '#' + fr.cls) : null; fr.ls.material = ri != null && (focus == null || focus === ri) && pm !== 'dim' ? roleMat(roles.list[ri].color).frame : clsEdge; }
  }
  for (const a of S.arcs) a.line.material = m ? arcDim : !rel ? arcMat : (rel.files.has(a.e.from) && rel.files.has(a.e.to) && (a.e.from === App.sel || a.e.to === App.sel || App.selFn || App.selCls)) ? arcHot : arcDim;
  if (S.hotGroup) { S.hotGroup.traverse(o => o.geometry && o.geometry.dispose()); world.remove(S.hotGroup); S.hotGroup = null; }
  const dimAll = !!(m || rel || focus != null);
  if (S.pipeMeshes) for (const k in S.pipeMeshes) S.pipeMeshes[k].material = dimAll ? pipeDim[k] : pipeMat[k];
  let hotPipes = [];
  if (rel) {
    const keyFns = App.selFn ? new Set([App.selFn]) : App.selCls ? new Set(App.selCls.methods) : new Set(App.sel.functions);
    hotPipes = collectAllFor(keyFns);
  } else if (focus != null && roles) {
    hotPipes = S.pipes.filter(p => p.curve && !p.v && roleOfFn(p.from) === focus);
  }
  if (hotPipes.length) {
    S.hotGroup = new T.Group(); world.add(S.hotGroup);
    const geos = {};
    for (const p of hotPipes.slice(0, 400)) { const pts = p.curve ? p.curve.pts : geomFor(p); if (!pts) continue; const t = tubeOf(pts, p.v ? 0.05 : 0.07); (geos[p.kind] = geos[p.kind] || []).push(t.geo); }
    for (const k in geos) S.hotGroup.add(new T.Mesh(mergeGeos(geos[k]), pipeHot[k]));
    S.hotGroup.visible = true;
  }
  City.applyOptions(true);
};
function collectAllFor(fnSet) {
  const out = []; let lane = 0;
  for (const p of S.pipes) if (fnSet.has(p.from) || (p.to && fnSet.has(p.to))) out.push(p);
  if (S.pipeTotal && S.pipeTotal.calls > MAX_PIPES) for (const fn of fnSet) for (const t of fn.calls || []) if (fn._floor && t._floor && !out.some(p => p.from === fn && p.to === t)) out.push({ kind: fn.callKind ? fn.callKind.get(t) || 'call' : 'call', from: fn, to: t, ra: fn._floor, rb: t._floor, lane: lane++ });
  return out;
}

City.applyOptions = function (quiet) {
  if (!City.ok) return;
  const o = S.opts;
  for (const a of S.arcs) a.line.visible = o.imports;
  if (S.arcPoints) S.arcPoints.visible = o.imports;
  if (S.pipeMeshes) for (const k in S.pipeMeshes) S.pipeMeshes[k].visible = (k === 'write' || k === 'read') ? o.data : o.calls;
  if (S.packets) for (const p of S.packets) { const l = p.userData.list[0]; p.visible = l && l.v ? o.data : o.calls; }
  if (S.hotGroup) S.hotGroup.visible = o.calls || o.data;
  for (const b of S.buildings) { b.roof.visible = o.antennas; if (b.label) b.label.visible = o.labels; for (const r of b.floors) if (r.labels) r.labels.forEach(l => { l.visible = o.floorLabels; }); }
  if (S.bugGroup) S.bugGroup.visible = o.bugs && S.explode === S.explodeTarget;
  S.explodeTarget = o.exploded ? 1 : 0;
  if (!quiet) App.emit('options', o);
};
City.setOption = function (k, v) { S.opts[k] = v; if (k === 'roles') City.refresh(); else City.applyOptions(); if (k === 'exploded') City.applyCut(); };

City.applyCut = function () {
  if (!City.ok) return;
  const v = +App.$('#cut').value;
  if (v >= 100 || !S.project) { renderer.clippingPlanes = []; S.cutH = Infinity; if (S.cutMesh) S.cutMesh.visible = false; App.$('#cutVal').textContent = 'off'; return; }
  const top = S.opts.exploded ? Math.max(...S.buildings.map(b => b.baseY + b.explHeight)) : S.maxH;
  const h = Math.max(0.05, top * v / 100);
  S.cutH = h; cutPlane.constant = h; renderer.clippingPlanes = [cutPlane];
  S.cutMesh.visible = true; S.cutMesh.position.y = h - 0.01;
  App.$('#cutVal').textContent = '+' + h.toFixed(2) + ' m';
};
City.setMatches = function (m) { S.matches = m; City.refresh(); };

const DIRS = { iso: new T.Vector3(1, 0.85, 1.15), plan: new T.Vector3(0.0001, 1, 0.0006), elev: new T.Vector3(0.0001, 0.16, 1) };
function tweenTo(pos, target, instant) {
  if (![...pos.toArray(), ...target.toArray()].every(Number.isFinite)) { console.warn('camera: non-finite target ignored'); return; }
  if (instant || App.REDUCED) { camera.position.copy(pos); controls.target.copy(target); controls.update(); S.tween = null; return; }
  S.tween = { p0: camera.position.clone(), p1: pos, t0: controls.target.clone(), t1: target, k: 0 };
}
function screenOffset() {
  const l = App.$('#lesson'), r = App.$('#insp');
  const lw = l && !l.hidden && innerWidth > 760 ? l.offsetWidth + 16 : 0, rw = r && !r.hidden && innerWidth > 760 ? r.offsetWidth + 16 : 0;
  return { frac: (lw - rw) / 2 / innerWidth, free: Math.max(0.35, (innerWidth - lw - rw) / innerWidth) };
}
City.view = function (kind, instant) {
  if (!City.ok || !S.project) return;
  const dir = (DIRS[kind] || DIRS.iso).clone().normalize();
  if (kind === 'fit') { const cur = camera.position.clone().sub(controls.target).normalize(); dir.copy(cur.lengthSq() ? cur : DIRS.iso.clone().normalize()); }
  const so = screenOffset();
  const aspect = camera.aspect * so.free;
  const dist = S.R * (kind === 'plan' ? 2.5 : kind === 'elev' ? 2.2 : 1.95) / Math.min(1, aspect * 0.9) + 2.5;
  const target = new T.Vector3(0, kind === 'elev' ? S.maxH * 0.35 : S.maxH * 0.12, 0);
  const right = new T.Vector3().crossVectors(dir, new T.Vector3(0, 1, 0)).normalize();
  const vw = 2 * dist * Math.tan(camera.fov * Math.PI / 360) * camera.aspect;
  target.addScaledVector(right, vw * so.frac);
  tweenTo(target.clone().add(dir.multiplyScalar(dist)), target, instant);
};
City.flyTo = function (b, keepZoom) {
  if (!City.ok || !b) return;
  const target = new T.Vector3(b.x + world.position.x, b.baseY + b.top * 0.5, b.z + world.position.z);
  let dir = camera.position.clone().sub(controls.target); const curDist = dir.length(); if (dir.lengthSq() < 1e-6) dir = DIRS.iso.clone(); dir.normalize();
  if (dir.y < 0.25) { dir.y = 0.4; dir.normalize(); }
  const dist = keepZoom ? Math.min(curDist, Math.max(12, b.top * 2.6 + b.fp * 4)) : Math.max(8, b.top * 2.2 + b.fp * 3.4);
  const so = screenOffset(); const right = new T.Vector3().crossVectors(dir, new T.Vector3(0, 1, 0)).normalize();
  const vw = 2 * dist * Math.tan(camera.fov * Math.PI / 360) * camera.aspect;
  target.addScaledVector(right, vw * so.frac);
  tweenTo(target.clone().add(dir.multiplyScalar(dist)), target);
};
City.isVisible = function (b) {
  if (!City.ok) return true;
  const v = new T.Vector3(b.x + world.position.x, b.baseY + b.top * 0.5, b.z + world.position.z).project(camera);
  const so = screenOffset(); const l = -1 + 2 * Math.max(0, so.frac * 2 > 0 ? so.frac * 2 : 0);
  return v.z < 1 && v.x > l - 0.1 && v.x < 0.85 && Math.abs(v.y) < 0.8;
};

const floorOf = fn => fn ? (fn._floor || floorOf(fn.parent)) : null;
City.floorOf = floorOf;
City.traceTo = function (fn, prevFn) {
  if (!City.ok) return;
  S.hot = fn || null;
  City.refresh();
  if (!fn || !floorOf(fn)) { if (S.traveler) S.traveler.g.visible = false; return; }
  const rb = floorOf(fn); const tr = S.traveler; if (!tr) return;
  let pts = null;
  if (prevFn && floorOf(prevFn) && floorOf(prevFn) !== rb) {
    const p = S.pipes.find(q => q.from === prevFn && q.to === fn && q.curve) || null;
    pts = p ? p.curve.pts.slice() : route(floorOf(prevFn), rb, 0, 'call');
    if (!p) { const back = S.pipes.find(q => q.from === fn && q.to === prevFn && q.curve); if (back) pts = back.curve.pts.slice().reverse(); }
  }
  const end = new T.Vector3(rb.b.x, recY(rb), rb.b.z);
  if (pts) { tr.path = new Poly(dedupe(pts)); tr.t = 0; }
  else { tr.path = null; tr.g.position.copy(end); }
  tr.g.visible = true;
  if (S.follow && !City.isVisible(rb.b)) City.flyTo(rb.b, true);
};
City.clearTrace = function () { S.hot = null; if (City.ok && S.traveler) S.traveler.g.visible = false; City.refresh(); };


/* Bug markers: one glowing diamond per floor (or per building base, for
   file-level findings) that has detector findings, coloured by the worst
   severity there and a little larger when several findings share it. One
   InstancedMesh + one halo Points per severity keeps thousands of findings
   cheap to draw and to pick. */
const BUG_COL = ['#9cb9d2', '#ffbf5a', '#ff7a64', '#ff4d6d'];
const bugGeo = City.ok ? new T.OctahedronGeometry(0.17, 0) : null;
const bugMat = City.ok ? BUG_COL.map(c => new T.MeshLambertMaterial({ color: c, emissive: c, emissiveIntensity: 0.65 })) : [];
const bugHalo = City.ok ? BUG_COL.map(c => new T.PointsMaterial({ size: 0.9, map: dotTex, color: c, transparent: true, depthWrite: false, opacity: 0.55 })) : [];
City.BUG_COL = BUG_COL;
function bugSpots() {
  const spots = new Map();
  for (const bug of S.bugs || []) {
    const b = bug.file._b; if (!b) continue;
    const rec = floorOf(bug.fn);
    const key = rec && rec.b === b ? rec : b;
    let s = spots.get(key);
    if (!s) { s = { kind: 'bug', b, fn: rec && rec.b === b ? rec.fn : null, rec: rec && rec.b === b ? rec : null, bugs: [], sev: 0 }; spots.set(key, s); }
    s.bugs.push(bug); s.sev = Math.max(s.sev, bug.severity);
  }
  return [...spots.values()];
}
function buildBugs() {
  if (!City.ok) return;
  if (S.bugGroup) { S.bugGroup.traverse(o => { if (o.isInstancedMesh) o.dispose(); else if (o.isPoints) o.geometry.dispose(); }); world.remove(S.bugGroup); S.bugGroup = null; }
  if (S.bugPicks) S.pickables = S.pickables.filter(o => !S.bugPicks.includes(o));
  S.bugPicks = [];
  if (!S.bugs || !S.bugs.length) return;
  S.bugGroup = new T.Group(); world.add(S.bugGroup);
  const bySev = [[], [], [], []];
  for (const s of bugSpots()) bySev[Math.max(0, Math.min(3, s.sev))].push(s);
  const m4 = new T.Matrix4(), q = new T.Quaternion().setFromEuler(new T.Euler(0, Math.PI / 4, 0)), sc = new T.Vector3(), p = new T.Vector3();
  bySev.forEach((list, sev) => {
    if (!list.length) return;
    const mesh = new T.InstancedMesh(bugGeo, bugMat[sev], list.length);
    const halo = new Float32Array(list.length * 3);
    list.forEach((s, i) => {
      const b = s.b, off = b.fp / 2 + 0.2;
      const y = s.rec ? b.baseY + s.rec.part.g.position.y + s.rec.h / 2 : b.baseY + b.podH / 2;
      p.set(b.x + off, y, b.z + off);
      const k = 1 + Math.min(1, Math.log2(s.bugs.length) * 0.3);
      m4.compose(p, q, sc.set(k, k * 1.25, k)); mesh.setMatrixAt(i, m4);
      halo.set([p.x, p.y, p.z], i * 3);
    });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
    mesh.userData = { kind: 'bugs', list };
    const hg = new T.BufferGeometry(); hg.setAttribute('position', new T.BufferAttribute(halo, 3));
    S.bugGroup.add(mesh, new T.Points(hg, bugHalo[sev]));
    S.pickables.push(mesh); S.bugPicks.push(mesh);
  });
  S.bugGroup.visible = S.opts.bugs && S.explode === S.explodeTarget;
}
City.setBugs = function (bugs) { S.bugs = bugs || null; buildBugs(); };

const ray = City.ok ? new T.Raycaster() : null;
const ndc = City.ok ? new T.Vector2() : null;
City.pick = function (cx, cy) {
  if (!City.ok || !S.pickables.length) return null;
  const canvas = document.getElementById('scene');
  const r = canvas.getBoundingClientRect();
  ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(S.pickables.filter(o => o.visible && o.parent && o.parent.visible !== false), false);
  let best = null;
  for (const h of hits) { if (h.point.y > S.cutH + 0.01) continue; let u = h.object.userData; if (u.kind === 'bugs') { u = u.list[h.instanceId]; if (!u) continue; } if (!best) best = { u, d: h.distance }; else if (u.kind === 'fn' && u.fn.parent && best.u.fn === u.fn.parent && h.distance - best.d < 1.5) best = { u, d: h.distance }; }
  return best ? best.u : null;
};

if (City.ok) {
  const clock = new T.Clock();
  const tmp = new T.Vector3();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(0.05, clock.getDelta()), time = clock.elapsedTime;
    if (S.tween) {
      const tw = S.tween; tw.k = Math.min(1, tw.k + dt * 1.5); const e = 1 - Math.pow(1 - tw.k, 3);
      camera.position.lerpVectors(tw.p0, tw.p1, e); controls.target.lerpVectors(tw.t0, tw.t1, e);
      if (tw.k >= 1) S.tween = null;
    }
    if (S.explode !== S.explodeTarget) {
      const d = S.explodeTarget - S.explode, step = App.REDUCED ? 1 : dt * 2.6;
      S.explode = Math.abs(d) <= step ? S.explodeTarget : S.explode + Math.sign(d) * step;
      const e = S.explode * S.explode * (3 - 2 * S.explode);
      for (const b of S.buildings) layoutBuilding(b, e);
      if (S.pipeGroup) S.pipeGroup.visible = false; if (S.hotGroup) S.hotGroup.visible = false; if (S.bugGroup) S.bugGroup.visible = false;
      if (S.explode === S.explodeTarget) { buildArcs(); buildPipes(); buildBugs(); if (S.pipeGroup) S.pipeGroup.visible = true; City.applyOptions(true); }
    }
    if (S.arcPoints && S.arcPoints.visible) {
      const pos = S.arcPoints.geometry.attributes.position;
      S.arcs.forEach((a, i) => { const t = App.REDUCED ? 0.5 : (a.off + time * a.speed) % 1; a.curve.getPoint(t, tmp); pos.setXYZ(i, tmp.x, tmp.y, tmp.z); });
      pos.needsUpdate = true;
    }
    if (S.packets) for (const pk of S.packets) {
      if (!pk.visible) continue;
      const pos = pk.geometry.attributes.position; const list = pk.userData.list;
      for (let i = 0; i < list.length; i++) { const p = list[i]; const t = App.REDUCED ? 0.5 : (p.off + time * p.speed) % 1; p.curve.getPoint(t, tmp); pos.setXYZ(i, tmp.x, tmp.y, tmp.z); }
      pos.needsUpdate = true;
    }
    const tr = S.traveler;
    if (tr && tr.g.visible) {
      if (tr.path && tr.t < 1) { tr.t = Math.min(1, tr.t + dt / Math.max(0.5, Math.min(1.4, tr.path.len * 0.06))); tr.path.getPoint(tr.t * tr.t * (3 - 2 * tr.t), tr.g.position); }
      else if (S.hot && floorOf(S.hot)) { const rb = floorOf(S.hot); tr.g.position.set(rb.b.x, recY(rb), rb.b.z); }
      const s = 1 + Math.sin(time * 6) * 0.15; tr.g.children[1].scale.set(1.5 * s, 1.5 * s, 1);
    }
    traceMat.emissiveIntensity = 0.6 + Math.sin(time * 5) * 0.25;
    if (S.bugGroup && S.bugGroup.visible && !App.REDUCED) { const k = 0.75 + Math.sin(time * 4) * 0.25; for (const m of bugHalo) m.opacity = 0.55 * k; }
    controls.update();
    renderer.render(scene, camera);
  });
}

City.exportState = () => S;

/* A compact, renderer-free description of the current city: plates,
   buildings with their floors (height and complexity bucket), import arcs
   and bug spots. The project website redraws real cities from it. */
City.snapshot = function () {
  if (!City.ok || !S.project) return null;
  const r2 = v => Math.round(v * 100) / 100;
  const idx = new Map(S.buildings.map((b, i) => [b, i]));
  return {
    side: r2(S.side), maxH: r2(S.maxH),
    plates: S.plates.map(p => [p.depth, r2(p.x), r2(p.z), r2(p.w), r2(p.h), p.depth <= 2 ? p.name : '']),
    buildings: S.buildings.map(b => [r2(b.x), r2(b.z), r2(b.baseY), r2(b.fp), r2(b.podH), b.floors.map(f => [r2(f.baseY), r2(f.h), f.bkt]), b.file.path]),
    arcs: S.arcs.slice(0, 500).map(a => [idx.get(a.e.from._b), idx.get(a.e.to._b)]).filter(([x, y]) => x != null && y != null),
    bugs: (S.bugPicks || []).flatMap(m => m.userData.list.map(s => [idx.get(s.b), s.rec ? s.b.floors.indexOf(s.rec.parentRec || s.rec) : -1, s.sev, s.bugs.length]))
  };
};
export { City };
