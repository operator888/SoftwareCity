/* Tests for the data flow analysis: which functions read/write which variables. */

import { test } from 'node:test';
import { parseFile, assertOk } from './_helpers.js';

test('Simple write+read of a file variable', async () => {
  const f = await parseFile('a.ts', `
    let x = 0;
    export function set(v: number) { x = v; }
    export function read() { let y = x; return y; }
  `);
  const x = f.variables.find(v => v.name === 'x');
  const set = f.functions.find(fn => fn.name === 'set');
  const read = f.functions.find(fn => fn.name === 'read');
  assertOk(x, 'x exists');
  assertOk(set.writes.includes(x), 'set writes x');
  assertOk(!set.writes.some(v => v.name === 'y'), 'set does not write the local y');
  assertOk(read.reads.includes(x), 'read reads x');
});

test('Class field write via this.x', async () => {
  const f = await parseFile('a.ts', `
    class Counter {
      count = 0;
      inc() { this.count = this.count + 1; }
      get() { return this.count; }
    }
  `);
  const cls = f.classes.find(c => c.name === 'Counter');
  const count = f.variables.find(v => v.name === 'count');
  assertOk(cls && count, 'class and field present');
  const inc = f.functions.find(fn => fn.name === 'inc');
  const get = f.functions.find(fn => fn.name === 'get');
  assertOk(inc && inc.writes.includes(count), 'inc writes count');
  assertOk(inc && inc.reads.includes(count), 'inc reads count');
  assertOk(get && get.reads.includes(count), 'get reads count');
});

test('Mutating method on an array counts as a write', async () => {
  const f = await parseFile('a.ts', `
    let items: number[] = [];
    export function add(x: number) { items.push(x); }
  `);
  const items = f.variables.find(v => v.name === 'items');
  const add = f.functions.find(fn => fn.name === 'add');
  assertOk(items && add, 'present');
  assertOk(add.writes.includes(items), 'add writes items via .push');
});

test('A function that does not touch the variable does not read or write it', async () => {
  const f = await parseFile('a.ts', `
    let x = 0;
    export function noop() { return 42; }
    export function set() { x = 1; }
  `);
  const x = f.variables.find(v => v.name === 'x');
  const noop = f.functions.find(fn => fn.name === 'noop');
  assertOk(!noop.reads.includes(x), 'noop does not read x');
  assertOk(!noop.writes.includes(x), 'noop does not write x');
});

test('Locals are counted', async () => {
  const f = await parseFile('a.ts', `
    export function f() {
      let a = 1; let b = 2; const c = a + b; return c;
    }
  `);
  const fn = f.functions.find(x => x.name === 'f');
  assertOk(fn.locals >= 2, 'at least two locals');
});
