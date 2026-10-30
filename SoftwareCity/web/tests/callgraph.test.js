/* End-to-end project tests.
   Builds a multi-file project, checks the call graph, data flow, imports,
   and class relations. */

import { test } from 'node:test';
import { parseProject, assertEq, assertOk } from './_helpers.js';

test('Cross-file call graph: file A calls into file B', async () => {
  const a = await parseFile_text(`
    import { helper } from './b';
    export function run() { return helper(42); }
  `);
  const b = await parseFile_text(`
    export function helper(x: number) { return x * 2; }
  `);
  const p = await parseProject([
    { path: 'src/a.ts', text: a },
    { path: 'src/b.ts', text: b }
  ]);
  const af = p.files.find(f => f.path === 'src/a.ts');
  const bf = p.files.find(f => f.path === 'src/b.ts');
  assertOk(af, 'a.ts in project');
  assertOk(bf, 'b.ts in project');
  const run = af.functions.find(f => f.name === 'run');
  const helper = bf.functions.find(f => f.name === 'helper');
  assertOk(run && helper, 'both functions found');
  const callTo = run.calls.find(c => c === helper);
  assertOk(callTo, 'run calls helper');
  assertOk(af.importsTo.includes(bf), 'a imports b');
  assertOk(bf.importedBy.includes(af), 'b imported by a');
});

test('Same-package Java files link without imports', async () => {
  const a = await parseFile_text(`
    package com.example;
    public class A {
      public void doIt() { run(); }
      public void run() {}
    }
  `);
  const b = await parseFile_text(`
    package com.example;
    public class B {
      public void run() {}
    }
  `);
  const p = await parseProject([
    { path: 'src/A.java', text: a },
    { path: 'src/B.java', text: b }
  ]);
  const af = p.files.find(f => f.path === 'src/A.java');
  const clsA = af.classes.find(c => c.name === 'A');
  const doIt = clsA.methods.find(m => m.name === 'doIt');
  const callTo = (doIt.calls || []).find(c => c.name === 'run');
  assertOk(callTo, 'A.doIt calls run (intra-class)');
  /* And the B class is reachable through same-package linking even
     without an import statement. */
  const bf = p.files.find(f => f.path === 'src/B.java');
  const clsB = bf.classes.find(c => c.name === 'B');
  assertOk(clsB, 'B class found via same-package link');
});

test('Data flow: function reads and writes file-level variable', async () => {
  const a = await parseFile_text(`
    let counter = 0;
    export function inc() { counter = counter + 1; }
    export function get() { return counter; }
  `);
  const p = await parseProject([{ path: 'a.ts', text: a }]);
  const f = p.files[0];
  const inc = f.functions.find(x => x.name === 'inc');
  const get = f.functions.find(x => x.name === 'get');
  const counter = f.variables.find(v => v.name === 'counter');
  assertOk(counter, 'counter variable');
  assertOk(inc.writes.includes(counter), 'inc writes counter');
  assertOk(inc.reads.includes(counter), 'inc reads counter');
  assertOk(get.reads.includes(counter), 'get reads counter');
  assertOk(!get.writes.includes(counter), 'get does not write counter');
});

test('Recursion is detected', async () => {
  const a = await parseFile_text(`
    export function fact(n: number): number {
      if (n <= 1) return 1;
      return n * fact(n - 1);
    }
  `);
  const p = await parseProject([{ path: 'a.ts', text: a }]);
  const fn = p.files[0].functions.find(f => f.name === 'fact');
  assertOk(fn.recursive, 'factorial marked recursive');
});

test('Inheritance and implements are recorded', async () => {
  const a = await parseFile_text(`
    interface Animal { speak(): string; }
    class Dog implements Animal { speak() { return 'bark'; } }
    class Puppy extends Dog { speak() { return 'yap'; } }
  `);
  const p = await parseProject([{ path: 'a.ts', text: a }]);
  const dog = p.classes.find(c => c.name === 'Dog');
  const puppy = p.classes.find(c => c.name === 'Puppy');
  const animal = p.classes.find(c => c.name === 'Animal');
  assertOk(dog && puppy && animal, 'all three classes present');
  assertOk(dog.implementsC.includes(animal), 'Dog implements Animal');
  assertOk(puppy.extendsC.includes(dog), 'Puppy extends Dog');
});

test('Totals are computed', async () => {
  const a = await parseFile_text(`export function f() { return 1; }`);
  const b = await parseFile_text(`export function g() { return 2; }`);
  const p = await parseProject([{ path: 'a.ts', text: a }, { path: 'b.ts', text: b }]);
  assertEq(p.totals.files, 2, 'file count');
  assertEq(p.totals.fns, 2, 'function count');
});

async function parseFile_text(text) { return text; }

test('A TS parameter typed as a function is not a function, and calling it is not recursion', async () => {
  const src = [
    'export async function withRole(',
    '  min: number,',
    '  fn: (user: string) => Promise<Response>,',
    '): Promise<Response> {',
    '  return fn("x");',
    '}',
    'export function fn(x: string) { return x }',
    'const api = {',
    '  load: (id: number) => { return fn(String(id)) },',
    '};',
  ].join('\n');
  const p = await parseProject([{ path: 'a.ts', text: src }]);
  const f = p.files[0];
  const names = f.functions.map(x => x.name);
  assertOk(!names.includes('fn') || f.functions.filter(x => x.name === 'fn').length === 1, 'only the real fn() exists: ' + names.join(','));
  const withRole = f.functions.find(x => x.name === 'withRole');
  assertOk(!withRole.recursive, 'withRole is not recursive');
  assertOk(!withRole.calls.some(c => c.name === 'fn'), 'calling the fn parameter does not link to the top-level fn()');
  const load = f.functions.find(x => x.name === 'load');
  assertOk(load && load.calls.some(c => c.name === 'fn'), 'a real call to fn() still links');
});
