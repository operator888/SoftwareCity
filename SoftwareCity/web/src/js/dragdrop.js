/* Drag-and-drop and file picker for opening a project.
   Two paths:
     1. A folder or files via the Open button.
     2. Drag-and-drop of a folder/files onto the page.
   Both paths call the same `onEntries(entries)` callback with an array of
   { path, file } or { path, text } objects.

   Mobile fallback: the File inputs work on touch, but drag-and-drop does
   not. We add a "Use the file picker" hint inside the dropzone on touch
   devices so users aren't left wondering why the drop didn't work. */

const SKIP = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', 'vendor', '.next', '.nuxt',
  '__pycache__', '.godot', '.import', 'Library', 'Temp', 'obj', 'bin', 'target',
  '.venv', 'venv', 'env', 'coverage', '.idea', '.vscode', '.cache', 'Pods',
  'DerivedData', '.svelte-kit', '.turbo', '.parcel-cache', 'bower_components', 'addons'
]);

const EXT_LANG = {
  js: 1, mjs: 1, cjs: 1, jsx: 1, ts: 1, tsx: 1, mts: 1, cts: 1,
  vue: 1, svelte: 1, astro: 1, html: 1, htm: 1, liquid: 1,
  java: 1, cs: 1, c: 1, h: 1, cpp: 1, cc: 1, cxx: 1, hpp: 1, hh: 1, dart: 1,
  kt: 1, kts: 1, scala: 1, swift: 1,
  go: 1, rs: 1, php: 1, py: 1, gd: 1, rb: 1, lua: 1,
  css: 1, scss: 1, less: 1,
  sql: 1, sh: 1, bash: 1,
  json: 1, yml: 1, yaml: 1, toml: 1, xml: 1, tscn: 1, tres: 1, godot: 1,
  md: 1, txt: 1
};

function accept(p) {
  const segs = p.split('/');
  const name = segs[segs.length - 1];
  if (segs.slice(0, -1).some(s => SKIP.has(s) || (s.startsWith('.') && s !== '.github'))) return false;
  if (/\.min\.(js|css)$|\.map$|^package-lock\.json$|^yarn\.lock$|^pnpm-lock|\.d\.ts$|\.(tscn|tres|godot|import)$/.test(name)) return false;
  const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  return !!EXT_LANG[ext];
}

function makeDragDrop({ onEntries, onProgress, isTouch }) {
  let dragDepth = 0;
  const dropzone = document.getElementById('dropzone');

  function showHint() {
    if (dropzone) {
      const div = dropzone.querySelector('div');
      if (div && isTouch) div.textContent = 'Tap the Open code button instead — drag and drop is not available on touch devices.';
      else if (div) div.textContent = 'Drop a folder or files to survey this code';
    }
  }
  showHint();

  addEventListener('dragenter', e => {
    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
      e.preventDefault(); dragDepth++;
      if (dropzone) dropzone.hidden = false;
    }
  });
  addEventListener('dragover', e => { e.preventDefault(); });
  addEventListener('dragleave', () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth && dropzone) dropzone.hidden = true;
  });

  addEventListener('drop', async e => {
    e.preventDefault(); dragDepth = 0; if (dropzone) dropzone.hidden = true;
    const dt = e.dataTransfer; if (!dt) return;
    const items = Array.from(dt.items || []).map(i => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
    if (!items.length) {
      /* No folder walking available; pass through plain file list. */
      onEntries(Array.from(dt.files).map(f => ({ path: f.name, file: f })));
      return;
    }
    if (onProgress) onProgress('Walking folders', 0);
    const out = [];
    const walk = async (entry, prefix) => {
      if (out.length > 20000) return;
      if (entry.isFile) {
        if (accept(prefix + entry.name)) {
          const file = await new Promise((res, rej) => entry.file(res, rej)).catch(() => null);
          if (file) out.push({ path: prefix + entry.name, file });
        }
        return;
      }
      if (SKIP.has(entry.name) || (entry.name.startsWith('.') && prefix)) return;
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise(res => reader.readEntries(res, () => res([])));
        for (const c of batch) await walk(c, prefix + entry.name + '/');
      } while (batch.length);
    };
    for (const it of items) await walk(it, '');
    if (onProgress) onProgress(null, 1);
    onEntries(out);
  });

  /* File inputs: the existing picker buttons in app.js call onEntries
     directly with an array. We just expose a `pickFiles(multiple)` and
     `pickFolder()` so the rest of the app can wire up the inputs. */
  function pickFiles(multiple) {
    return new Promise(resolve => {
      const input = document.getElementById('fileInput');
      if (!input) return resolve([]);
      input.multiple = !!multiple;
      input.value = '';
      const onChange = () => {
        input.removeEventListener('change', onChange);
        resolve(Array.from(input.files));
      };
      input.addEventListener('change', onChange);
      input.click();
    });
  }
  function pickFolder() {
    return new Promise(resolve => {
      const input = document.getElementById('dirInput');
      if (!input) return resolve([]);
      input.value = '';
      const onChange = () => {
        input.removeEventListener('change', onChange);
        resolve(Array.from(input.files));
      };
      input.addEventListener('change', onChange);
      input.click();
    });
  }
  return { pickFiles, pickFolder };
}

export const DragDrop = { accept, makeDragDrop };
