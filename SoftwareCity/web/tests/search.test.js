/* Search tests: ranking, debounce, fuzzy fallback, and exact match. */

import { test } from 'node:test';
import { Search } from '../src/js/search.js';
import { parseProject, assertEq, assertOk } from './_helpers.js';

async function buildProject() {
  const a = await parseFile_text(`
    export function authenticate(user: string) { return user; }
    export function login() {}
    export class AuthService { verify() {} }
  `);
  const b = await parseFile_text(`
    export function logout() {}
  `);
  return await parseProject([{ path: 'src/auth.ts', text: a }, { path: 'src/session.ts', text: b }]);
}

async function parseFile_text(t) { return t; }

test('Exact name match ranks above substring', async () => {
  const p = await buildProject();
  Search.buildIndex(p);
  const m = Search.run('authenticate');
  assertOk(m.fns.size > 0, 'finds authenticate');
  const first = [...m.fns][0];
  assertEq(first.name, 'authenticate', 'top hit is exact name');
});

test('Class name is found', async () => {
  const p = await buildProject();
  Search.buildIndex(p);
  const m = Search.run('AuthService');
  assertOk(m.classes.length > 0, 'class found');
  assertEq(m.classes[0].name, 'AuthService', 'class name matches');
});

test('Substring across files', async () => {
  const p = await buildProject();
  Search.buildIndex(p);
  const m = Search.run('login');
  assertOk(m.fns.size > 0, 'login found');
});

test('Empty query returns empty results', async () => {
  const p = await buildProject();
  Search.buildIndex(p);
  const m = Search.run('');
  assertEq(m.fns.size, 0, 'no functions for empty query');
  assertEq(m.text, '', 'no text for empty query');
});

test('Fuzzy match for a typo', async () => {
  const p = await buildProject();
  Search.buildIndex(p);
  const m = Search.run('authentcate'); // missing the 'i'
  assertOk(m.fns.size > 0 || m.classes.length > 0, 'fuzzy still finds something');
});
