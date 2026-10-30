/* Starport sample tests. The bundled starport sample is the smoke test
   for the whole pipeline. */

import { test } from 'node:test';
import { analyzeProject } from '../src/js/parser.js';
import { loadStarport } from '../../../shared/starport/loader.js';
import { assertOk } from './_helpers.js';

test('starport sample is non-empty and parses', () => {
  const entries = loadStarport();
  assertOk(entries.length > 0, 'starport has files, got ' + entries.length);
  const project = analyzeProject(entries);
  assertOk(project.totals.files > 0, 'parsed some files');
  assertOk(project.totals.fns > 0, 'parsed some functions');
  assertOk(project.totals.classes > 0, 'parsed some classes');
});
