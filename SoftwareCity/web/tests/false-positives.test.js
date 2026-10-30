/* False positives found by surveying Express, React, Vue and Preact
   (2026-10-26). Each case is the smallest snippet of the real pattern. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeProject } from '../src/js/parser.js';
import { Bugs } from '../src/js/bugs.js';

const fns = p => p.files.flatMap(f => f.functions);
const byDetector = (bugs, id) => bugs.filter(b => b.detectorId === id);

test('a test callback is a call, not a method named after the test helper', () => {
  const p = analyzeProject([{ path: 'test/app.js', text: "describe('app', function () {\n  it('works', function (done) {\n    it('nested', 1);\n    done();\n  });\n  test(`x`, () => {\n    return 1;\n  });\n});\n" }]);
  assert.deepEqual(fns(p).map(f => f.name).filter(n => /^(it|describe|test)$/.test(n)), []);
  assert.equal(fns(p).filter(f => f.recursive).length, 0);
});

test('a JS property method calling a same-named free function is not recursion', () => {
  const p = analyzeProject([{ path: 'lib/request.js', text: "var accepts = require('accepts');\nreq.accepts = function () {\n  var accept = accepts(this);\n  return accept.types();\n};\nclass Walker {\n  walk(n) {\n    if (!n) return 0;\n    return this.walk(n.next);\n  }\n  load({ a, b }) {\n    return a + b;\n  }\n}\n" }]);
  const f = Object.fromEntries(fns(p).map(x => [x.name, x]));
  assert.ok(f.accepts && !f.accepts.recursive, 'accepts() calls the imported accepts');
  assert.ok(f.walk.recursive, 'this.walk() is still recursion');
  assert.ok(f.load, 'a destructured parameter list is still a method');
});

test('magic numbers: HTTP codes, test files and nested functions are not reported twice', () => {
  const src = "function handler(res) {\n  res.status(404);\n  const ttl = 86400;\n  const again = 86400;\n  function inner() {\n    return 7777;\n  }\n  return inner;\n}\n";
  const bugs = Bugs.scan(analyzeProject([{ path: 'lib/h.js', text: src }, { path: 'test/h.test.js', text: src }]));
  const magic = byDetector(bugs, 'magic-number').map(b => b.file.path + ' ' + b.message).sort();
  assert.deepEqual(magic, ['lib/h.js Magic number 7777 in inner()', 'lib/h.js Magic number 86400 in handler()']);
});

test('duplicated code: one finding per function, trivial lines do not count, tests skipped', () => {
  const body = n => `function render(x) {\n  if (!x) {\n    return;\n  }\n  const y = x * ${n};\n  log(y);\n  save(y);\n  return y;\n}\n`;
  const shell = 'function render(x) {\n  {\n  }\n  return;\n  }\n  {\n  }\n}\n';
  const bugs = Bugs.scan(analyzeProject([
    { path: 'src/a.js', text: body(2) }, { path: 'src/b.js', text: body(2) }, { path: 'src/c.js', text: body(2) },
    { path: 'test/a.test.js', text: body(2) }, { path: 'src/s1.js', text: shell }, { path: 'src/s2.js', text: shell }
  ]));
  const dup = byDetector(bugs, 'duplicated-code');
  assert.deepEqual(dup.map(b => b.file.path), ['src/a.js', 'src/b.js'], 'a.js once (two copies), b.js once (c.js), shells and tests not');
  assert.match(dup[0].message, /has 2 near-copies/);
});

test('an arrow with an expression body ends with its expression', () => {
  const p = analyzeProject([{ path: 'src/a.ts', text: "const parse = (content: string, options?: Opts) =>\n  baseParse(content, {\n    ws: 'x',\n    ...options,\n  })\n\ntest('x', () => {\n  const ast = parse('<div/>')\n})\nconst add = (a, b) => a + b;\nconst big = (a) =>\n  a\n    .map(x => x)\n    .filter(Boolean)\nconst blk = (a) => {\n  return a\n}\n" }]);
  const span = Object.fromEntries(fns(p).map(f => [f.name, [f.start + 1, f.end + 1, !!f.recursive]]));
  assert.deepEqual(span, { parse: [1, 5, false], add: [10, 10, false], big: [11, 14, false], blk: [15, 17, false] });
});

test('a dependency cycle is reported once, on its first file', () => {
  const p = analyzeProject([
    { path: 'src/a.js', text: "import { b } from './b.js';\nexport const a = () => b();\n" },
    { path: 'src/b.js', text: "import { c } from './c.js';\nexport const b = () => c();\n" },
    { path: 'src/c.js', text: "import { a } from './a.js';\nexport const c = () => a();\n" }
  ]);
  const cyc = Bugs.scan(p).filter(b => b.detectorId === 'circular-dependency');
  assert.deepEqual(cyc.map(b => b.file.path), ['src/a.js']);
  assert.match(cyc[0].message, /src\/a\.js → src\/b\.js → src\/c\.js → src\/a\.js/);
});

test('an object-literal method calling the outer function is not recursion; a long signature does not hide the guard', () => {
  const p = analyzeProject([{ path: 'src/hooks.js', text: "export function useMemoCache(size) {\n  return [size];\n}\nconst Dispatcher = {\n  useMemoCache(size) {\n    warn();\n    return useMemoCache(size);\n  },\n};\nfunction createChild(\n  returnFiber,\n  newChild,\n  lanes,\n) {\n  if (newChild == null) return null;\n  return createChild(returnFiber, newChild.next, lanes);\n}\n" }]);
  const rec = fns(p).filter(f => f.recursive).map(f => f.name);
  assert.deepEqual(rec, ['createChild']);
  assert.equal(Bugs.scan(p).filter(b => b.detectorId === 'recursion-no-base').length, 0, 'createChild has a guard right after its signature');
});
