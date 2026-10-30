/* Bugs module: the detectors run over a surveyed project, the CSV export
   matches Software City: Patrol's column set, and RFC 4180 quoting holds for
   quotes, commas and newlines inside the code excerpt. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeProject } from '../src/js/parser.js';
import { loadStarport } from '../../../shared/starport/loader.js';
import { Bugs } from '../src/js/bugs.js';

const longFn = 'export function big(a) {\n' + Array.from({ length: 60 }, (_, i) => `  if (a > ${i + 2}) { a = a * 3; console.log("x, \\"y\\"", a); }`).join('\n') + '\n  return a;\n}\n';

test('scan finds the long function, sorted most severe first', () => {
  const p = analyzeProject([{ path: 'src/big.js', text: longFn }]);
  const bugs = Bugs.scan(p);
  assert.ok(bugs.some(b => b.detectorId === 'long-function' && b.fn && b.fn.name === 'big'), 'long-function on big()');
  for (let i = 1; i < bugs.length; i++) assert.ok(bugs[i - 1].severity >= bugs[i].severity, 'sorted by severity');
  assert.equal(Bugs.counts(bugs).reduce((a, b) => a + b, 0), bugs.length);
  assert.ok(Bugs.bugsIn(bugs, p.files[0], bugs[0].fn).length >= 1);
});

test('CSV: Patrol column set, one row per bug, RFC 4180 quoting', () => {
  const p = analyzeProject([{ path: 'src/big.js', text: longFn }]);
  const bugs = Bugs.scan(p);
  const csv = Bugs.toCsv(bugs);
  assert.ok(csv.endsWith('\r\n'));
  const header = csv.split('\r\n')[0];
  assert.equal(header, Bugs.CSV_COLUMNS.map(c => '"' + c + '"').join(','));
  assert.equal(Bugs.CSV_COLUMNS.length, 22);
  // Minimal RFC 4180 parser: count records and fields.
  const recs = []; let row = [], cur = '', inQ = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (inQ) { if (c === '"') { if (csv[i + 1] === '"') { cur += '"'; i++; } else inQ = false; } else cur += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\r' && csv[i + 1] === '\n') { row.push(cur); recs.push(row); row = []; cur = ''; i++; }
    else cur += c;
  }
  assert.equal(recs.length, bugs.length + 1);
  for (const r of recs) assert.equal(r.length, 22);
  const lf = recs.find(r => r[3] === 'long-function');
  assert.equal(lf[6], 'src/big.js'); assert.equal(lf[8], '1'); assert.equal(lf[10], 'big');
  assert.ok(lf[19].includes('>    1| export function big(a) {'), 'excerpt marks the flagged line');
  assert.ok(lf[19].includes('"y\\"'), 'quotes survive the round trip');
  assert.equal(lf[17], 'untriaged');
});

test('starport sample yields bugs and a file name / prompt', () => {
  const bugs = Bugs.scan(analyzeProject(loadStarport()));
  assert.ok(bugs.length > 0);
  const name = Bugs.csvName('My App!', new Date(2026, 9, 26, 14, 5));
  assert.equal(name, 'my-app--softwarecity-bugs-20261026-1405.csv');
  assert.ok(Bugs.prompt('My App', name, bugs.length).includes(String(bugs.length) + ' findings'));
});

test('a throwing detector is skipped, not fatal', () => {
  const p = analyzeProject([{ path: 'a.js', text: 'function a() { return 1; }\n' }]);
  const bad = { id: 'bad', name: 'Bad', family: 'foundations', severity: 1, detect() { throw new Error('boom'); } };
  assert.deepEqual(Bugs.scan(p, [bad]), []);
});
