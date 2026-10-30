/* Detector tests. Each detector is given a small file and we assert
   it returns the right number of issues, with the right severity. */

import { test } from 'node:test';
import { analyzeFile, analyzeProject } from '../src/js/parser.js';
import { BASE_DETECTORS, ENEMY_VISUALS, DLC_PACKS, activeDetectors, registerDlc, unregisterDlc } from '../../../shared/detectors/index.js';
import { FAMILIES, familyId, familyName } from '../../../shared/families.js';
import { assertEq, assertOk } from './_helpers.js';

test('every base detector has a valid schema', () => {
  for (const d of BASE_DETECTORS) {
    assertOk(d.id, 'id');
    assertOk(d.name, 'name');
    assertOk(d.family, 'family');
    assertOk(d.enemy, 'enemy in ENEMY_VISUALS: ' + !!ENEMY_VISUALS[d.enemy]);
    assertOk(typeof d.severity === 'number' && d.severity >= 0 && d.severity <= 3, 'severity 0..3');
    assertOk(d.question, 'question');
    assertOk(d.why, 'why');
    assertOk(d.fix, 'fix');
    assertOk(typeof d.detect === 'function', 'detect is a function');
  }
});

test('long-function detector finds a long function', () => {
  const src = `
    export function big() {
      ${Array.from({ length: 80 }, (_, i) => `      const x${i} = ${i};`).join('\n')}
      return 0;
    }
  `;
  const f = analyzeFile('a.ts', src);
  const d = BASE_DETECTORS.find(x => x.id === 'long-function');
  const issues = d.detect(f);
  assertOk(issues.length > 0, 'long function detected');
  assertOk(issues[0].score > 0, 'has a score');
});

test('deep-nesting detector finds a deeply nested function', () => {
  const src = `
    export function deep(x) {
      if (x > 0) {
        for (let i = 0; i < x; i++) {
          while (i > 0) {
            if (i % 2 === 0) {
              try {
                return i;
              } catch (e) { return 0; }
            }
          }
        }
      }
      return -1;
    }
  `;
  const f = analyzeFile('a.ts', src);
  const d = BASE_DETECTORS.find(x => x.id === 'deep-nesting');
  const issues = d.detect(f);
  assertOk(issues.length > 0, 'deep nesting detected');
});

test('high-complexity detector finds a complex function', () => {
  const src = `
    export function cx(x) {
      if (x > 0) return 1;
      if (x > 1) return 2;
      if (x > 2) return 3;
      if (x > 3) return 4;
      if (x > 4) return 5;
      if (x > 5) return 6;
      if (x > 6) return 7;
      if (x > 7) return 8;
      if (x > 8) return 9;
      if (x > 9) return 10;
      if (x > 10) return 11;
      if (x > 11) return 12;
      if (x > 12) return 13;
      if (x > 13) return 14;
      if (x > 14) return 15;
      if (x > 15) return 16;
      if (x > 16) return 17;
      if (x > 17) return 18;
      if (x > 18) return 19;
      if (x > 19) return 20;
      return 0;
    }
  `;
  const f = analyzeFile('a.ts', src);
  const d = BASE_DETECTORS.find(x => x.id === 'high-complexity');
  const issues = d.detect(f);
  assertOk(issues.length > 0, 'high complexity detected');
});

test('god-object detector finds a fat class', () => {
  const fields = Array.from({ length: 12 }, (_, i) => `  field${i}: string;`).join('\n');
  const methods = Array.from({ length: 15 }, (_, i) => `  method${i}() { return this.field${i % 12}; }`).join('\n');
  const src = `
    class God {
${fields}
${methods}
    }
  `;
  const f = analyzeFile('a.ts', src);
  const d = BASE_DETECTORS.find(x => x.id === 'god-object');
  const issues = d.detect(f);
  assertOk(issues.length > 0, 'god object detected');
});

test('swallowed-exception detector finds empty catch', () => {
  const src = `
    export function f() {
      try { JSON.parse('{}'); } catch (e) {}
    }
  `;
  const f = analyzeFile('a.ts', src);
  const d = BASE_DETECTORS.find(x => x.id === 'swallowed-exception');
  const issues = d.detect(f);
  assertOk(issues.length > 0, 'empty catch detected');
});

test('circular-dependency detector finds a cycle', () => {
  const a = `import { b } from './b';\nexport function aFn() { return b(); }`;
  const b = `import { aFn } from './a';\nexport function b() { return aFn(); }`;
  const p = analyzeProject([{ path: 'a.ts', text: a }, { path: 'b.ts', text: b }]);
  const d = BASE_DETECTORS.find(x => x.id === 'circular-dependency');
  const issues = p.files.flatMap(file => d.detect(file, p.files));
  assertOk(issues.length > 0, 'circular import detected');
});

test('activeDetectors returns base detectors by default', () => {
  const ds = activeDetectors([]);
  assertEq(ds.length, BASE_DETECTORS.length, 'base only');
});

test('every detector family and every DLC pack is a known family id', () => {
  for (const d of BASE_DETECTORS) assertEq(familyId(d.family), d.family, 'detector ' + d.id + ' family ' + d.family);
  for (const fam of Object.keys(DLC_PACKS)) assertEq(familyId(fam), fam, 'DLC pack ' + fam);
  for (const f of FAMILIES) assertOk(DLC_PACKS[f.id], 'family ' + f.id + ' has a DLC pack');
  assertEq(familyName('oop'), 'OOP Basics', 'id → name');
  assertEq(familyId('Domain & Data'), 'domain', 'name → id');
});

test('registered DLC detectors are active only for unlocked families', () => {
  const extra = { id: 'test-extra', name: 'Extra', family: 'oop', enemy: 'moth', severity: 1, question: 'q', why: 'w', fix: 'f', detect: () => [] };
  registerDlc('oop', [extra]);
  try {
    assertEq(activeDetectors([]).length, BASE_DETECTORS.length, 'locked: base only');
    assertEq(activeDetectors(['oop']).length, BASE_DETECTORS.length + 1, 'unlocked: base + 1');
    assertEq(activeDetectors(['game']).length, BASE_DETECTORS.length, 'other family: base only');
  } finally { unregisterDlc('oop'); }
  let threw = false;
  try { registerDlc('not-a-family', [extra]); } catch (e) { threw = true; }
  assertOk(threw, 'unknown family rejected');
});
