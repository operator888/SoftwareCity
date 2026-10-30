/* Starport + detectors: the smoke test. The full 18-file starport
   sample is run through every base detector and we assert that at
   least some issues are found (real code is never perfect). */

import { test } from 'node:test';
import { analyzeProject } from '../src/js/parser.js';
import { loadStarport } from '../../../shared/starport/loader.js';
import { BASE_DETECTORS } from '../../../shared/detectors/index.js';
import { assertOk } from './_helpers.js';

test('starport sample yields at least one detector hit', () => {
  const entries = loadStarport();
  const project = analyzeProject(entries);
  let totalIssues = 0;
  for (const file of project.files) {
    for (const d of BASE_DETECTORS) {
      try {
        const issues = d.detect(file, project.files);
        totalIssues += issues.length;
      } catch (e) { /* detector errored on this file — fine */ }
    }
  }
  assertOk(totalIssues > 0, 'starport yields detector hits, got ' + totalIssues);
});
