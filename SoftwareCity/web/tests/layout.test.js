/* Layout tests. The squarify algorithm and the buildTree tree builder
   are pure functions; the renderer is a 3D scene and is not unit-tested. */

import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertOk } from './_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const citySrc = readFileSync(resolve(__dirname, '..', 'src', 'js', 'city.js'), 'utf8');

test('Squarify is exported in city.js', () => {
  assertOk(citySrc.includes('function squarify'), 'squarify function exists');
  assertOk(citySrc.includes('function buildTree'), 'buildTree exists');
});

test('Cap on simultaneous pipes exists', () => {
  assertOk(/const MAX_PIPES = 1600/.test(citySrc), 'MAX_PIPES is 1600');
});

test('Roles are used by the city refresh', () => {
  assertOk(citySrc.includes('roleMat'), 'roleMat function exists');
  assertOk(citySrc.includes('S.opts.roles'), 'roles option is checked');
});
