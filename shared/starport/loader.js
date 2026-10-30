// Starport sample loader. Reads files from disk via fs and returns
// entries { path, text } ready for analyzeProject. Used by the test
// suite. The browser bundle gets the inlined version via
// scripts/inline-starport.js → src/data/_generated/starport.js.
//
// Note: the original re-exporting file's import.meta.url is the
// re-exporter's path, not ours. We use a relative path that doesn't
// depend on the caller's location.
import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import manifest from './index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILES_DIR = resolve(__dirname, 'files');

export function loadStarport() {
  const out = [];
  for (const [path, meta] of Object.entries(manifest)) {
    if (path === '_manifest') continue;
    const onDisk = resolve(FILES_DIR, meta.file);
    if (!existsSync(onDisk)) continue;
    out.push({ path, text: readFileSync(onDisk, 'utf8') });
  }
  return out;
}

export { manifest };
