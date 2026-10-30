/* Test helpers. Importing this from each test file gets a small fixture
   loader and a few common matchers. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const FIXTURES = resolve(__dirname, 'fixtures');
/* The starport sample lives in the monorepo's shared/ folder; use
   shared/starport/loader.js (loadStarport) to read it as entries. */
export const STARPORT = resolve(__dirname, '..', '..', '..', 'shared', 'starport', 'files');

export { test };

/* Analyze a single source file. */
export async function parseFile(path, src) {
  const { analyzeFile } = await import('../src/js/parser.js');
  return analyzeFile(path, src);
}

/* Analyze a project. */
export async function parseProject(entries) {
  const { analyzeProject } = await import('../src/js/parser.js');
  return analyzeProject(entries);
}

/* Walk the fixtures directory and return a list of { path, text }. */
export function listFixtures(dir = FIXTURES) {
  const out = [];
  const walk = d => {
    if (!statSync(d, { throwIfNoEntry: false })) return;
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else out.push({ path: p.slice(FIXTURES.length + 1), text: readFileSync(p, 'utf8') });
    }
  };
  walk(dir);
  return out;
}

/* Convenience: find a function by name in a parsed file. */
export function findFn(file, name) {
  return file.functions.find(f => f.name === name);
}
export function findClass(file, name) {
  return file.classes.find(c => c.name === name);
}

/* Assert helpers. We re-use node:test's built-in `assert` through `test`. */
export function assertEq(actual, expected, msg) {
  if (actual !== expected) throw new Error((msg || 'assertEq') + `\n  expected: ${JSON.stringify(expected)}\n    actual: ${JSON.stringify(actual)}`);
}
export function assertOk(cond, msg) {
  if (!cond) throw new Error((msg || 'assertOk'));
}
export function assertContains(haystack, needle, msg) {
  if (!String(haystack).includes(needle)) throw new Error((msg || 'assertContains') + `\n  needle: ${JSON.stringify(needle)}\n  haystack: ${JSON.stringify(haystack).slice(0, 400)}`);
}
