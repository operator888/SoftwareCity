/* localStorage wrapper tests. */

import { test } from 'node:test';
import { store } from '../src/js/store.js';
import { assertEq, assertOk } from './_helpers.js';

test('store has a version', () => {
  assertEq(typeof store.getVersion(), 'number', 'version is a number');
});

test('set then get returns the value', () => {
  store.__reset();
  store.setSync('test', { a: 1 });
  assertEq(store.get('test').a, 1, 'round-trip works');
});

test('get with default returns default when missing', () => {
  store.__reset();
  const v = store.get('missing-key', { b: 2 });
  assertEq(v.b, 2, 'default returned');
});

test('debounced set eventually persists', async () => {
  store.__reset();
  store.set('debounced', 'value');
  await new Promise(r => setTimeout(r, 300));
  assertEq(store.get('debounced'), 'value', 'value present after debounce');
});

test('subscribe fires on change', async () => {
  store.__reset();
  let called = 0;
  const off = store.subscribe('watched', () => { called++; });
  store.set('watched', 1);
  store.set('watched', 2);
  await new Promise(r => setTimeout(r, 250));
  assertOk(called >= 1, 'subscribe fired at least once');
  off();
});

test('del removes a key', () => {
  store.__reset();
  store.setSync('gone', 'now');
  store.del('gone');
  assertEq(store.get('gone', null), null, 'gone after del');
});

test('migrate is a no-op for current version', () => {
  // Should not throw.
  store.migrate(store.getVersion());
});
