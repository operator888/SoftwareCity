/* Library tests: every pattern is well-formed, every demo loads, every
   real-code attribution is valid. */

import { test } from 'node:test';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeProject } from '../src/js/parser.js';
import { assertEq, assertOk } from './_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const libraryDir = resolve(__dirname, '..', '..', '..', 'shared', 'library');

function loadAllFamilies() {
  const families = [];
  const patterns = [];
  const seen = new Set();
  for (const f of readdirSync(libraryDir).filter(x => x.endsWith('.js')).sort()) {
    const mod = require(resolve(libraryDir, f));
    if (!mod.default) continue;
    families.push(...mod.default.families);
    for (const p of mod.default.patterns) {
      if (seen.has(p.id)) throw new Error('duplicate pattern id: ' + p.id);
      seen.add(p.id);
      patterns.push(p);
    }
  }
  return { families, patterns };
}

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

test('Library has at least 90 patterns and 250 demos', () => {
  const { families, patterns } = loadAllFamilies();
  assertOk(patterns.length >= 90, 'patterns >= 90, got ' + patterns.length);
  const nDemos = patterns.reduce((n, p) => n + p.demos.length, 0);
  assertOk(nDemos >= 250, 'demos >= 250, got ' + nDemos);
  assertOk(families.length >= 10, 'families >= 10, got ' + families.length);
});

test('Every pattern has the required fields', () => {
  const { patterns } = loadAllFamilies();
  for (const p of patterns) {
    for (const k of ['id', 'family', 'name', 'tagline', 'intent', 'analogy', 'cityShape', 'roles', 'whenToUse', 'pitfalls', 'quiz', 'demos']) {
      assertOk(p[k] !== undefined, `pattern ${p.id} missing ${k}`);
    }
    assertOk(p.demos.length > 0, `pattern ${p.id} has no demos`);
  }
});

test('Every demo has files that parse', () => {
  const { patterns } = loadAllFamilies();
  const seen = new Set();
  let bad = 0;
  for (const p of patterns) for (const d of p.demos) {
    const id = d.id || `${p.id}#?`;
    if (seen.has(id)) { console.error('duplicate demo id', id); bad++; continue; }
    seen.add(id);
    const entries = Object.entries(d.files).map(([path, text]) => ({ path, text }));
    try {
      const proj = analyzeProject(entries);
      if (!proj.files.length) { console.error('demo', id, 'analysed to zero files'); bad++; }
    } catch (e) {
      console.error('demo', id, 'failed to parse:', e.message);
      bad++;
    }
  }
  assertEq(bad, 0, 'no demos should fail to parse');
});

test('Every demo with source has repo, url, license', () => {
  const { patterns } = loadAllFamilies();
  for (const p of patterns) for (const d of p.demos) {
    if (!d.source) continue;
    assertOk(d.source.repo, `${p.id}/${d.id} source missing repo`);
    assertOk(d.source.url, `${p.id}/${d.id} source missing url`);
    assertOk(d.source.license, `${p.id}/${d.id} source missing license`);
  }
});

test('Related patterns all exist', () => {
  const { patterns } = loadAllFamilies();
  const ids = new Set(patterns.map(p => p.id));
  for (const p of patterns) {
    for (const r of p.related || []) {
      assertOk(ids.has(r), `${p.id} related to non-existent ${r}`);
    }
  }
});

test('Quiz answer index is valid', () => {
  const { patterns } = loadAllFamilies();
  for (const p of patterns) for (const q of p.quiz || []) {
    assertOk(q.answer >= 0 && q.answer < q.options.length, `${p.id} quiz answer out of range`);
  }
});
