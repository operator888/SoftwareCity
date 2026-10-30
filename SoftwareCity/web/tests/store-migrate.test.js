/* Settings saved before the rename (the former prefix) move to "softwarecity:"
   on first load; an existing new key wins and the old copies are removed. */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const data = new Map();
globalThis.localStorage = {
  get length() { return data.size; },
  key: i => [...data.keys()][i] ?? null,
  getItem: k => (data.has(k) ? data.get(k) : null),
  setItem: (k, v) => { data.set(k, String(v)); },
  removeItem: k => { data.delete(k); }
};
const OLD = 'code' + 'print:';
data.set(OLD + 'visited', JSON.stringify(['observer']));
data.set(OLD + 'opts', JSON.stringify({ old: true }));
const OLD2 = 'code' + 'city:';
data.set(OLD2 + 'layer', JSON.stringify('bugs'));
data.set('softwarecity:opts', JSON.stringify({ new: true }));
data.set('other-app:x', '1');

test('legacy keys move to the softwarecity: prefix once', async () => {
  const { store } = await import('../src/js/store.js');
  assert.deepEqual(store.get('visited'), ['observer']);
  assert.deepEqual(store.get('opts'), { new: true }, 'an existing new key wins');
  assert.deepEqual(store.get('layer'), 'bugs', 'the second former prefix moves too');
  assert.equal([...data.keys()].filter(k => k.startsWith(OLD) || k.startsWith(OLD2)).length, 0, 'old keys removed');
  assert.equal(data.get('other-app:x'), '1', 'other apps untouched');
});
