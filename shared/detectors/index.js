/* Detector catalogue for Software City: Patrol.
   Each detector describes a code smell the parser can find, the visual
   "enemy" that spawns from it, and the lesson the user learns when
   they triage the bug. This is the content of the game.

   Schema for a detector:
     {
       id:           'long-function',
       name:         'Long Function',
       family:       'foundations',         // ties to a pattern family (DLC)
       enemy:        'centipede',           // visual archetype
       severity:     0..3,                  // 0=info, 1=minor, 2=major, 3=critical
       tags:         ['complexity', 'maintainability'],
       detect:       (file) => [issue, ...],// returns array of issues in the file
       question:     'Why is this a problem?',
       why:          'A function longer than ~50 lines does too many things...',
       fix:          'Extract smaller functions; each should do one thing.',
       attackLines:  'from a function with > N lines spawn a bug at its floor',
       citePattern:  'single-responsibility',
       sources:      ['Clean Code (Ch.3)', 'Refactoring (Fowler, Ch.3)']
     }

   The `detect` function is the actual code-smell detector. It takes a
   parsed file (the same shape as `SoftwareCity.analyzeFile` returns) and
   returns an array of issues. Each issue has:
     {
       file, function?, class?,
       line,        // 0-indexed source line
       score,       // 0..1
       message,     // short human-readable reason
       evidence,    // array of strings (variable names, call counts, etc.)
     }
   The game uses these to spawn bugs and to fill the inspector panel.

   `family` values are the short ids from shared/families.js ('oop',
   'domain', 'game', …), never the display names. */

import { familyId } from '../families.js';

/* A CSS/SCSS rule is surveyed as a "function" whose body starts with '{'.
   Function-level smells (length, complexity, nesting, magic numbers) do not
   apply to style rules: 68 declarations are not "complexity 18" and #333
   is not a magic number. */
const isRule = fn => /^\s*\{/.test(fn.body || '');
const INDENT_LANGS = new Set(['py', 'gd', 'rb', 'lua']);

/* Tests, fixtures and examples repeat helpers and spell out expected values
   on purpose; Duplicated Code and Magic Number skip them. */
const TESTISH_DIR = /(^|\/)(tests?|__tests__|__mocks__|specs?|fixtures?|examples?|demos?|benchmarks?|e2e)\//i;
const TESTISH_FILE = /\.(test|spec|e2e)\.[a-z0-9]+$/i;
const isTestish = path => TESTISH_DIR.test(path) || TESTISH_FILE.test(path);

/* Numbers with a meaning every reader knows: HTTP status codes, common
   ports, byte sizes, a second in milliseconds, angles, days of a year. */
const MAGIC_OK = new Set(['200', '201', '202', '204', '206', '301', '302', '303', '304', '307', '308',
  '400', '401', '403', '404', '405', '406', '409', '410', '412', '413', '415', '422', '429',
  '500', '501', '502', '503', '504', '255', '256', '360', '365', '443', '512', '1000', '1024',
  '2048', '4096', '3000', '8000', '8080']);

/* A line that is the same in any two functions: braces, else/try, a bare return. */
const TRIVIAL_LINE = /^[\s{}()\[\];,]*$|^\}?\s*(else|try|finally|do)\s*\{?$|^(return|break|continue)\s*;?$/;

/* name → functions across the project, built once per allFiles array. */
const nameIndexCache = new WeakMap();
function nameIndex(allFiles) {
  let idx = nameIndexCache.get(allFiles);
  if (!idx) {
    idx = new Map();
    for (const f of allFiles) for (const fn of f.functions || []) {
      if (!idx.has(fn.name)) idx.set(fn.name, []);
      idx.get(fn.name).push(fn);
    }
    nameIndexCache.set(allFiles, idx);
  }
  return idx;
}

export const ENEMY_VISUALS = {
  /* One per archetype. Patrol renders these in 3D. The descriptions are
     enough for a concept artist or AI image generator to draw them. */
  centipede:    { name: 'Centipede',    description: 'Long, low to the ground, with too many legs. Each leg is a parameter or branch.' },
  spider:       { name: 'Spider',       description: 'Small body, long legs reaching into many other buildings. Coupling incarnate.' },
  wasp:         { name: 'Wasp',         description: 'Sleek, fast, stings. Public mutable state. A wasp on a window means the field is unprotected.' },
  termite:      { name: 'Termite',      description: 'Slow, eats foundations. Public fields that are mutated from many places.' },
  cockroach:    { name: 'Cockroach',    description: 'Lurks in dark branches. Survives bare except, swallowed exceptions, ignored returns.' },
  firefly:      { name: 'Firefly',      description: 'Small, glowing. Magic numbers, hard-coded strings, mystery constants.' },
  mold:         { name: 'Mold',         description: 'Sticky, spreads. Duplicated code, copy-pasted blocks, dead branches.' },
  hornet:       { name: 'Hornet',       description: 'Aggressive, nests. God objects, classes with too many fields.' },
  beetle:       { name: 'Beetle',       description: 'Heavy, slow, hard to move. Long methods, deep nesting, large parameter lists.' },
  maggot:       { name: 'Maggot',       description: 'Lives in the data. Type confusion, weak typing, implicit conversions.' },
  tick:         { name: 'Tick',         description: 'Embedded in code. TODO, FIXME, HACK comments. Marks unfinished work.' },
  lichen:       { name: 'Lichen',       description: 'Forms on abandoned interfaces. Unused exports, dead code paths.' },
  worm:         { name: 'Worm',         description: 'Bores through recursion, through loops, through dependencies. The recursion bug.' },
  cluster:      { name: 'Cluster',      description: 'Hive of small bugs in a tight area. Many small smells in one file.' },
  moth:         { name: 'Moth',         description: 'Drawn to light. Public APIs that should be private. Visibility leaks.' },
  aphid:        { name: 'Aphid',        description: 'Reproduces. Inconsistent naming, magic-string duplication.' },
  fungus:       { name: 'Fungus',       description: 'Grows in damp, dark places. Try/catch that swallows, comments that lie.' },
  beetle2:      { name: 'Scarab',       description: 'Encased. Tight coupling, circular imports, hidden dependencies.' },
  leech:        { name: 'Leech',        description: 'Attached, draining. Listeners, observers, callbacks never removed.' },
  virus:        { name: 'Virus',        description: 'A bug that is not your code — third-party, untested, unmaintained. Dependency risk.' }
};

/* The base game ships with 20 detectors. Each maps to one enemy visual.
   The DLCs (one per pattern family) add more, focused on that family. */

export const BASE_DETECTORS = [
  /* Foundations family ---------------------------------------------------------- */
  {
    id: 'long-function',
    name: 'Long Function',
    family: 'foundations',
    enemy: 'centipede',
    severity: 2,
    tags: ['size', 'maintainability'],
    question: 'Why is a long function a problem?',
    why: 'A function longer than ~50 lines usually does more than one thing. The branches stop fitting in your head, the tests stop covering every case, and one of the branches is wrong.',
    fix: 'Extract smaller functions; each should do one thing. Aim for under 30 lines, with a name that fits on one line.',
    citePattern: 'single-responsibility',
    sources: ['Clean Code, Ch. 3', 'Refactoring, Ch. 3'],
    /* Issue = function over 50 lines. The score grows with length and complexity. */
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        if (fn.lines >= 50 && !isRule(fn)) {
          const score = Math.min(1, (fn.lines - 50) / 150 + (fn.cx - 1) / 20);
          issues.push({ file, fn, line: fn.start, score,
            message: `${fn.name}() is ${fn.lines} lines long`,
            evidence: [`${fn.lines} lines`, `cyclomatic complexity ${fn.cx}`, `parent: ${fn.parent ? fn.parent.name : 'none'}`] });
        }
      }
      return issues;
    }
  },
  {
    id: 'deep-nesting',
    name: 'Deep Nesting',
    family: 'foundations',
    enemy: 'beetle',
    severity: 2,
    tags: ['complexity', 'readability'],
    question: 'Why is deep nesting a problem?',
    why: 'When ifs and loops are nested four or five levels deep, you cannot see the code path. Bugs hide in the inner branches because no one reads them carefully.',
    fix: 'Use early returns. Pull nested branches into named functions. A function should read top-to-bottom like a story.',
    citePattern: 'single-responsibility',
    sources: ['Clean Code, Ch. 3'],
    detect(file) {
      /* Walk the body line by line and count how deep the indentation
         goes. For Python this is real indentation; for braces we use the
         depthAt array from the parser. */
      const issues = [];
      for (const fn of file.functions || []) {
        if (!fn.body || isRule(fn)) continue;
        let max = 0;
        if (INDENT_LANGS.has(file.lang)) {
          for (const line of fn.body.split('\n')) {
            const leading = line.match(/^(\s*)/)[1];
            const depth = Math.floor(leading.replace(/\t/g, '    ').length / 2);
            if (depth > max) max = depth;
          }
        } else {
          /* Brace languages: block depth inside the masked body, minus the
             function's own block. (Indentation counted 4-space-indented
             class methods as deeply nested.) */
          let d = 0, top = 0;
          for (const ch of fn.body) { if (ch === '{') { d++; if (d > top) top = d; } else if (ch === '}') d--; }
          max = top - 1;
        }
        if (max >= 5) {
          issues.push({ file, fn, line: fn.start, score: Math.min(1, (max - 4) / 4),
            message: `${fn.name}() nests ${max} levels deep`,
            evidence: [`max nesting depth ${max}`] });
        }
      }
      return issues;
    }
  },
  {
    id: 'high-complexity',
    name: 'High Cyclomatic Complexity',
    family: 'foundations',
    enemy: 'centipede',
    severity: 2,
    tags: ['complexity', 'testing'],
    question: 'What does cyclomatic complexity measure?',
    why: 'It is the number of independent paths through the function. Above ~20, exhaustive testing is impractical and the function almost certainly has bugs that the tests will not catch.',
    fix: 'Split the function. Use polymorphism or a strategy pattern. Each branch should be a small named function.',
    citePattern: 'single-responsibility',
    sources: ['NIST Special Publication 500-235'],
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        if (fn.cx >= 18 && !isRule(fn)) {
          const callCount = (fn.calls || []).length;
          issues.push({ file, fn, line: fn.start, score: Math.min(1, (fn.cx - 18) / 18),
            message: `${fn.name}() has cyclomatic complexity ${fn.cx}`,
            evidence: [`complexity ${fn.cx}`, `${callCount} calls`] });
        }
      }
      return issues;
    }
  },
  {
    id: 'recursion-no-base',
    name: 'Recursion Without Clear Base Case',
    family: 'foundations',
    enemy: 'worm',
    severity: 3,
    tags: ['recursion', 'correctness'],
    question: 'When is recursion dangerous?',
    why: 'A recursive function without a clear base case, or with a base case that is not reached on every input, will blow the stack on the wrong call. The test that exercises the bug is rarely the test that runs.',
    fix: 'Make the base case explicit. Add a guard. Test with a depth limit. Consider an iterative version.',
    citePattern: 'recursion',
    sources: ['SICP, Ch. 1'],
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        if (!fn.recursive) continue;
        /* Look for an early return or guard near the top of the body: the
           window starts at the line that opens the body, so a signature
           spread over several lines does not hide the guard. */
        const lines = (fn.body || '').split('\n');
        let s = 0;
        for (let k = 0; k < Math.min(lines.length, 12); k++) if (/(\{|=>|:)\s*$/.test(lines[k])) { s = k; break; }
        const firstLine = lines.slice(s, s + 4).join(' ');
        const hasGuard = /if\b|return\b.*\b(0|1|null|none|empty|base)/i.test(firstLine);
        if (!hasGuard) {
          issues.push({ file, fn, line: fn.start, score: 0.8,
            message: `${fn.name}() recurses but no early-return guard is visible`,
            evidence: ['recursive', 'no base case in the first 3 lines of the body'] });
        }
      }
      return issues;
    }
  },
  /* OOP Basics family ---------------------------------------------------------- */
  {
    id: 'god-object',
    name: 'God Object',
    family: 'oop',
    enemy: 'hornet',
    severity: 3,
    tags: ['oop', 'cohesion'],
    question: 'What is a god object?',
    why: 'A class with too many fields and too many methods knows about and does too much. Every other class in the system depends on it. When it changes, the whole system rebuilds.',
    fix: 'Extract smaller classes. A UserService is not a User. A GameManager is not a game.',
    citePattern: 'single-responsibility',
    sources: ['Refactoring, Ch. 3', 'Clean Code, Ch. 10'],
    detect(file) {
      const issues = [];
      for (const cls of file.classes || []) {
        if (cls.kind === 'impl' || cls.css) continue;
        if (cls.fields.length >= 8 && cls.methods.length >= 12) {
          const score = Math.min(1, (cls.fields.length - 8) / 12 + (cls.methods.length - 12) / 18);
          issues.push({ file, cls, line: cls.start, score,
            message: `${cls.name} has ${cls.fields.length} fields and ${cls.methods.length} methods`,
            evidence: [`${cls.fields.length} fields`, `${cls.methods.length} methods`, `kind: ${cls.kind}`] });
        }
      }
      return issues;
    }
  },
  {
    id: 'leaky-encapsulation',
    name: 'Leaky Encapsulation',
    family: 'oop',
    enemy: 'moth',
    severity: 1,
    tags: ['oop', 'encapsulation'],
    question: 'What is leaky encapsulation?',
    why: 'A field marked public, or a method that returns the internal list, lets the rest of the system reach inside the class. The class can no longer enforce its invariants.',
    fix: 'Make fields private. Return defensive copies. Expose behaviour, not data.',
    citePattern: 'encapsulation',
    sources: ['Effective Java, Item 15'],
    detect(file) {
      const issues = [];
      for (const cls of file.classes || []) {
        for (const f of cls.fields || []) {
          if (f.kind !== 'field' && f.kind !== 'var') continue;
          /* The parser tags `kind: const` for Kotlin val and `kind: var`
             for mutable. Anything else with a public-ish typeLine in a
             brace language is suspicious. */
          if (f.kind === 'var') {
            issues.push({ file, cls, line: f.line, score: 0.6,
              message: `${cls.name}.${f.name} is a public mutable field`,
              evidence: ['public', 'mutable'] });
          }
        }
      }
      return issues;
    }
  },
  {
    id: 'refused-bequest',
    name: 'Refused Bequest',
    family: 'oop',
    enemy: 'tick',
    severity: 1,
    tags: ['oop', 'inheritance'],
    question: 'When is inheritance the wrong choice?',
    why: 'A subclass that overrides a parent method to throw "not implemented" or to do nothing is signalling that the inheritance is wrong. The subclass refuses what it inherits.',
    fix: 'Replace inheritance with composition. The subclass is not a kind-of parent; it has-a parent.',
    citePattern: 'liskov-substitution',
    sources: ['Effective Java, Item 18'],
    detect(file) {
      /* Detected manually: any subclass method whose body is just
         `throw new NotImplementedError()` or `pass` or `// TODO`. */
      const issues = [];
      for (const cls of file.classes || []) {
        if (cls.ext.length === 0) continue;
        for (const m of cls.methods || []) {
          const body = (m.body || '').trim();
          if (/throw\s+new\s+NotImplemented|raise\s+NotImplementedError|pass\s*$|^\/\/\s*TODO/m.test(body)) {
            issues.push({ file, cls, line: m.start, score: 0.7,
              message: `${cls.name}.${m.name}() refuses what it inherits`,
              evidence: ['inherits from ' + cls.ext[0], 'method body is empty or throws'] });
          }
        }
      }
      return issues;
    }
  },
  /* Principles family ---------------------------------------------------------- */
  {
    id: 'tight-coupling',
    name: 'Tight Coupling',
    family: 'principles',
    enemy: 'spider',
    severity: 2,
    tags: ['coupling', 'design'],
    question: 'When is coupling too tight?',
    why: 'A class that imports and instantiates a dozen concrete dependencies cannot be tested in isolation and cannot be reused in a different context. The web of references means changing one file breaks three others.',
    fix: 'Inject dependencies. Depend on interfaces, not implementations. The class should be testable with a 5-line fake.',
    citePattern: 'dependency-inversion',
    sources: ['Clean Architecture, Ch. 11'],
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        /* A function that calls into 8+ distinct receivers is a smell. */
        const recvs = new Set();
        for (const c of fn.calls || []) {
          if (c.cls) recvs.add(c.cls);
          else if (c.file && c.file !== fn.file) recvs.add(c.file.name);
        }
        if (recvs.size >= 8) {
          issues.push({ file, fn, line: fn.start, score: Math.min(1, (recvs.size - 7) / 8),
            message: `${fn.name}() reaches into ${recvs.size} other classes/files`,
            evidence: ['distinct receivers: ' + recvs.size, 'fan-out smell'] });
        }
      }
      return issues;
    }
  },
  {
    id: 'duplicated-code',
    name: 'Duplicated Code',
    family: 'principles',
    enemy: 'mold',
    severity: 2,
    tags: ['duplication', 'maintainability'],
    question: 'Why is duplicated code a problem?',
    why: 'Two functions that do almost the same thing will drift over time. One will get a bug fix the other will not. The fix is to extract the shared part.',
    fix: 'Extract the shared logic into a third function. The two callers become one-liners.',
    citePattern: 'dry',
    sources: ['Refactoring, Ch. 3'],
    detect(file, allFiles) {
      /* Same name, similar length, at least 4 of the first 10 (masked)
         lines identical. Each pair is reported once, on the function that
         comes first (by path, then line), so a project-wide run does not
         repeat the same duplicate for every file. Uses a name index, so a
         2,500-file project is not O(functions²). */
      const issues = [];
      const all = allFiles || [file];
      const idx = nameIndex(all);
      if (isTestish(file.path)) return issues;
      const firstLines = fn => (fn.body || '').split('\n').slice(0, 10).map(l => l.trim());
      for (const a of file.functions || []) {
        if (a.lines < 5 || isRule(a)) continue;
        const copies = [];
        for (const b of idx.get(a.name) || []) {
          if (b === a || b.lines < 5 || Math.abs(a.lines - b.lines) > 3) continue;
          const bp = b.file ? b.file.path : file.path;
          if (bp < file.path || (bp === file.path && b.start < a.start) || isTestish(bp)) continue;
          const al = firstLines(a), bl = firstLines(b);
          let same = 0;
          for (let k = 0; k < Math.min(al.length, bl.length); k++) if (al[k] && al[k] === bl[k] && !TRIVIAL_LINE.test(al[k])) same++;
          if (same >= 4) copies.push({ b, bp });
        }
        /* One finding per function, however many copies it has. */
        if (copies.length) {
          issues.push({ file, fn: a, line: a.start, score: 0.6,
            message: copies.length === 1 ? `${a.name}() appears in two forms (${a.lines} and ${copies[0].b.lines} lines)` : `${a.name}() has ${copies.length} near-copies (${a.lines} lines here)`,
            evidence: ['two functions with the same name', ...copies.slice(0, 3).map(c => `also at ${c.bp}:${c.b.start + 1}`)] });
        }
      }
      return issues;
    }
  },
  /* Behavioural family --------------------------------------------------------- */
  {
    id: 'swallowed-exception',
    name: 'Swallowed Exception',
    family: 'behavioral',
    enemy: 'cockroach',
    severity: 3,
    tags: ['errors', 'correctness'],
    question: 'What is a swallowed exception?',
    why: 'A try/catch that catches an error and does nothing — or just logs and continues — hides the bug. The next time the user sees the failure, it is several layers of stack away.',
    fix: 'Either handle the error, re-throw it with context, or let it propagate. Never catch without intent.',
    citePattern: 'errors-and-exceptions',
    sources: ['Effective Java, Item 65'],
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        const body = fn.body || '';
        /* Look for `catch (...) {}` or `except: pass` patterns. */
        if (/catch\s*(?:\([^)]*\))?\s*\{\s*\}/.test(body) || /except\s*:\s*pass\b/.test(body)) {
          issues.push({ file, fn, line: fn.start, score: 0.9,
            message: `${fn.name}() catches an exception and does nothing`,
            evidence: ['empty catch', 'exception discarded'] });
        }
      }
      return issues;
    }
  },
  {
    id: 'callback-hell',
    name: 'Callback Pyramid',
    family: 'behavioral',
    enemy: 'centipede',
    severity: 1,
    tags: ['async', 'readability'],
    question: 'What is callback hell?',
    why: 'A function with nested callbacks four levels deep is impossible to read, and the error handling at each level is different. The user sees a wall of `})})})})` at the end.',
    fix: 'Use async/await, or extract each callback into a named function. The bottom of the file should not be a wall of braces.',
    citePattern: 'async-await',
    sources: ['Callback Hell (callbackhell.com)'],
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        const body = fn.body || '';
        /* Count the deepest `function(` nesting in JS. */
        let depth = 0, max = 0, d = 0;
        for (let i = 0; i < body.length; i++) {
          if (body[i] === '(' || body[i] === '[' || body[i] === '{') d++;
          else if (body[i] === ')' || body[i] === ']' || body[i] === '}') d--;
          if (body.substr(i, 8) === 'function') max = Math.max(max, d);
        }
        if (max >= 5) {
          issues.push({ file, fn, line: fn.start, score: 0.7,
            message: `${fn.name}() nests ${max} levels of callbacks`,
            evidence: [`nesting depth ${max}`] });
        }
      }
      return issues;
    }
  },
  /* Architecture family ------------------------------------------------------- */
  {
    id: 'circular-dependency',
    name: 'Circular Dependency',
    family: 'architecture',
    enemy: 'scarab',
    severity: 3,
    tags: ['architecture', 'imports'],
    question: 'Why is a circular import dangerous?',
    why: 'File A imports B, B imports A. At runtime, one of them gets a half-initialised module from the other. The bug is non-deterministic; the build is technically correct; the test suite is wrong.',
    fix: 'Break the cycle. Usually one of the imports is for a type only — move the type to a third file. Or invert the dependency.',
    citePattern: 'dependency-inversion',
    sources: ['Clean Architecture, Ch. 11'],
    detect(file, allFiles) {
      /* The shortest dependency cycle that runs through this file (BFS over
         importsTo, which includes the class-name links of languages that
         need no import). Each cycle is reported once, on its first file by
         path, so a tangle of 1,000 mutually importing files (Laravel) is
         not 1,000 findings; every tangle still gets at least one, on its
         first file, whose own shortest cycle starts there. */
      const prev = new Map([[file, null]]);
      const q = [file];
      while (q.length) {
        const x = q.shift();
        for (const y of x.importsTo || []) {
          if (y === file) {
            const chain = [];
            for (let z = x; z; z = prev.get(z)) chain.unshift(z.path);
            chain.push(file.path);
            if (chain.some(p => p < file.path)) return [];
            return [{ file, line: 0, score: 0.95,
              message: 'Circular dependency: ' + chain.join(' → '),
              evidence: ['cycle of ' + (chain.length - 1) + ' file(s) in the dependency graph'] }];
          }
          if (!prev.has(y)) { prev.set(y, x); q.push(y); }
        }
      }
      return [];
    }
  },
  {
    id: 'leaky-abstraction',
    name: 'Leaky Abstraction',
    family: 'architecture',
    enemy: 'moth',
    severity: 2,
    tags: ['abstraction', 'design'],
    question: 'What is a leaky abstraction?',
    why: 'A module whose internals are visible at the call site — required configuration, exposed types, error codes that mean nothing — forces every caller to know how it works. The abstraction is a lie.',
    fix: 'Hide the internals. Make the API the smallest possible surface that solves the user problem.',
    citePattern: 'abstraction',
    sources: ['The Mythical Man-Month, Ch. 5', 'Clean Architecture, Ch. 4'],
    detect(file) {
      /* Heuristic: a class whose public methods return other concrete
         classes from the same file (or that are tagged "internal"). */
      const issues = [];
      for (const cls of file.classes || []) {
        if (cls.methods.length < 3) continue;
        const concrete = cls.methods.filter(m => /Internal|Holder|Impl|Helper/.test(m.name));
        if (concrete.length >= 2) {
          issues.push({ file, cls, line: cls.start, score: 0.5,
            message: `${cls.name} exposes ${concrete.length} internal-shaped methods`,
            evidence: ['names suggest internals: ' + concrete.map(m => m.name).join(', ')] });
        }
      }
      return issues;
    }
  },
  /* Domain & Data family ------------------------------------------------------ */
  {
    id: 'public-mutable-state',
    name: 'Public Mutable State',
    family: 'domain',
    enemy: 'wasp',
    severity: 2,
    tags: ['state', 'concurrency'],
    question: 'Why is public mutable state dangerous?',
    why: 'A field that anyone can read or write cannot have invariants. When the program runs in two threads, the worst race conditions appear there first. When the program is one thread, the worst debugging sessions appear there first.',
    fix: 'Make it private. Expose a method that returns the value, and a method that changes it through a controlled transition.',
    citePattern: 'encapsulation',
    sources: ['Effective Java, Item 15'],
    detect(file) {
      const issues = [];
      for (const cls of file.classes || []) {
        if (cls.kind === 'impl' || cls.css) continue;
        /* Public = not `private`/`protected`, not a JS #private field. */
        const mut = cls.fields.filter(f => (f.kind === 'var' || f.kind === 'field') && !f.name.startsWith('#') && !/\b(private|protected)\b/.test(f.typeLine || ''));
        if (mut.length >= 3) {
          issues.push({ file, cls, line: cls.start, score: 0.6,
            message: `${cls.name} has ${mut.length} mutable fields`,
            evidence: [`${mut.length} mutable fields`] });
        }
      }
      return issues;
    }
  },
  /* Game Programming family --------------------------------------------------- */
  {
    id: 'untested-recursive-method',
    name: 'Untested Recursive Update',
    family: 'game',
    enemy: 'worm',
    severity: 2,
    tags: ['recursion', 'game-loop'],
    question: 'When is recursion risky in a game loop?',
    why: 'A recursive function called every frame, or one called on user input that can recurse on itself, will eventually overflow the call stack on a long-running session. The bug only appears after 20 minutes of play.',
    fix: 'Track depth explicitly. Bail out above a maximum. Or rewrite the recursion as iteration with a worklist.',
    citePattern: 'recursion',
    sources: ['Game Programming Patterns, Ch. 2'],
    detect(file) {
      const issues = [];
      for (const fn of file.functions || []) {
        if (fn.recursive && /delta|_process|update|tick|step/i.test(fn.name)) {
          issues.push({ file, fn, line: fn.start, score: 0.6,
            message: `${fn.name}() is a recursive update function`,
            evidence: ['recursive', 'name suggests a per-frame or per-input call'] });
        }
      }
      return issues;
    }
  },
  /* Anti-patterns family ------------------------------------------------------- */
  {
    id: 'todo-comment',
    name: 'TODO Comment',
    family: 'anti-patterns',
    enemy: 'tick',
    severity: 0,
    tags: ['process', 'todo'],
    question: 'What does a TODO comment mean?',
    why: 'A TODO is a promise to fix later. The longer the file has been in the codebase, the longer the TODO has been there. The bug it was meant to fix is the bug the user is reporting.',
    fix: 'File an issue, or fix it now. A TODO is not a fix, it is a delay.',
    citePattern: 'no-pattern',
    sources: ['The Pragmatic Programmer, Tip 33'],
    detect(file) {
      /* Read the file source via the path lookup, or just trust the
         parser to keep `file.src` for us. */
      const issues = [];
      const src = (file._src) || (file.src || '');
      const re = /\b(TODO|FIXME|HACK|XXX)\b[^\n]*/g;
      let m;
      while ((m = re.exec(src))) {
        issues.push({ file, line: src.slice(0, m.index).split('\n').length - 1, score: 0.3,
          message: 'Marked ' + m[0].split(/\s+/)[0],
          evidence: [m[0].trim().slice(0, 80)] });
      }
      return issues;
    }
  },
  {
    id: 'magic-number',
    name: 'Magic Number',
    family: 'anti-patterns',
    enemy: 'firefly',
    severity: 0,
    tags: ['readability'],
    question: 'What is a magic number?',
    why: 'A number in code whose meaning is not obvious. 86400 is a day; 0.017 is "approximately a frame at 60fps" only if you happen to know.',
    fix: 'Name it. `const SECONDS_PER_DAY = 86400`. The name tells the next reader what the number means.',
    citePattern: 'no-pattern',
    sources: ['Clean Code, Ch. 17'],
    detect(file) {
      const issues = [];
      if (isTestish(file.path)) return issues;
      for (const fn of file.functions || []) {
        if (isRule(fn)) continue;
        const body = fn.body || '';
        const re = /(?<![A-Za-z_\$\.\d])([2-9]\d{2,}|[1-9]\.\d+)(?![A-Za-z_\d])/g;
        /* Lines of a nested function are its own findings, not the parent's;
           each value is reported once per function. */
        const kids = (file.functions || []).filter(k => k.parent === fn);
        const seen = new Set();
        let m;
        while ((m = re.exec(body))) {
          if (/^(\d|true|false|null|0|1)$/.test(m[1]) || MAGIC_OK.has(m[1]) || seen.has(m[1])) continue;
          const line = fn.start + body.slice(0, m.index).split('\n').length - 1;
          if (kids.some(k => line >= k.start && line <= k.end)) continue;
          seen.add(m[1]);
          issues.push({ file, fn, line, score: 0.3,
            message: `Magic number ${m[1]} in ${fn.name}()`,
            evidence: [`value: ${m[1]}`] });
        }
      }
      return issues;
    }
  },
  {
    id: 'inconsistent-naming',
    name: 'Inconsistent Naming',
    family: 'anti-patterns',
    enemy: 'aphid',
    severity: 0,
    tags: ['naming', 'consistency'],
    question: 'When is naming a problem?',
    why: 'When two variables do the same thing but have different names (`userId` vs `user_id` vs `uid`), the next reader does not know they are the same. The bug is invisible.',
    fix: 'Pick one convention per language and enforce it. Use a linter.',
    citePattern: 'no-pattern',
    sources: ['Clean Code, Ch. 2'],
    detect(file) {
      const issues = [];
      const seen = new Map();  /* canonical (lowercased, no _/-) -> {first, others} */
      const canon = s => s.toLowerCase().replace(/[_-]/g, '');
      for (const f of file.variables || []) {
        if (!f.name || f.name.startsWith('_')) continue;
        const c = canon(f.name);
        if (!seen.has(c)) seen.set(c, { first: f.name, others: [] });
        else seen.get(c).others.push(f.name);
      }
      for (const [, v] of seen) {
        if (v.others.length) {
          issues.push({ file, line: 0, score: 0.4,
            message: `Inconsistent naming: ${v.first} vs ${v.others.join(', ')}`,
            evidence: ['multiple spellings for the same concept'] });
          break;  /* one per file is enough */
        }
      }
      return issues;
    }
  },
  {
    id: 'dependency-risk',
    name: 'Risky Third-Party Dependency',
    family: 'anti-patterns',
    enemy: 'virus',
    severity: 1,
    tags: ['dependencies', 'security'],
    question: 'When is a third-party dependency a risk?',
    why: 'Every dependency is code you did not write, did not test, and cannot patch. A package that is 5 years old, has 3 commits, and is depended on by 200 of your files is a single point of failure.',
    fix: 'Audit your dependencies. Pin versions. Have a plan to remove any one of them.',
    citePattern: 'no-pattern',
    sources: ['The Practice of Programming, Ch. 8'],
    detect(file) {
      /* Heuristic: a file with 10+ distinct external imports. */
      const issues = [];
      const externals = (file.external || []).filter(e => !/^(@|\.|node:)/.test(e));
      if (externals.length >= 10) {
        issues.push({ file, line: 0, score: Math.min(1, (externals.length - 10) / 10),
          message: `File depends on ${externals.length} external packages`,
          evidence: externals.slice(0, 5).map(e => e) });
      }
      return issues;
    }
  }
];

/* Every detector's family must be a known family id. Checked once at load
   time so a typo surfaces immediately rather than as a silently empty DLC. */
for (const d of BASE_DETECTORS) {
  if (familyId(d.family) !== d.family) throw new Error(`detector ${d.id}: unknown family id "${d.family}"`);
}

/* The DLC pipeline. Each family pack adds more detectors focused on
   that family's patterns. The map below tells the game which DLC is
   needed to unlock which detectors. Keys are family ids. */
export const DLC_PACKS = {
  foundations:  { name: 'Foundations Patrol',  price: 3.99, file: 'dlc/foundations.js' },
  oop:          { name: 'OOP Patrol',          price: 3.99, file: 'dlc/oop.js' },
  principles:   { name: 'SOLID Patrol',        price: 3.99, file: 'dlc/principles.js' },
  creational:   { name: 'Creational Patrol',   price: 3.99, file: 'dlc/creational.js' },
  structural:   { name: 'Structural Patrol',   price: 3.99, file: 'dlc/structural.js' },
  behavioral:   { name: 'Behavioral Patrol',   price: 3.99, file: 'dlc/behavioral.js' },
  functional:   { name: 'Functional Patrol',   price: 3.99, file: 'dlc/functional.js' },
  concurrency:  { name: 'Concurrency Patrol',  price: 3.99, file: 'dlc/concurrency.js' },
  architecture: { name: 'Architectural Patrol',price: 4.99, file: 'dlc/architecture.js' },
  domain:       { name: 'Domain Patrol',       price: 3.99, file: 'dlc/domain.js' },
  game:         { name: 'Game Patrol',         price: 3.99, file: 'dlc/game.js' },
  'anti-patterns': { name: 'Anti-Pattern Patrol', price: 4.99, file: 'dlc/anti-patterns.js' }
};

/* DLC registry. A DLC pack is an ES module exporting `DETECTORS` (same
   shape as BASE_DETECTORS). Whoever owns the loading mechanism (Steam DLC
   folder, Edu licence server) imports the pack and registers it here; this
   file stays free of any file-system or require() logic so it runs
   unchanged in the browser, in Node and when transpiled for Godot.
   (The old version called require() from an ES module, which threw and was
   silently swallowed, so unlocked families never added detectors.) */
const dlcRegistry = new Map();   // family id → detectors[]

export function registerDlc(family, detectors) {
  if (!DLC_PACKS[family]) throw new Error('Unknown DLC family: ' + family);
  dlcRegistry.set(family, [...detectors]);
}

export function unregisterDlc(family) { dlcRegistry.delete(family); }

/* Base detectors plus the registered detectors of every unlocked family. */
export function activeDetectors(unlockedFamilies) {
  const out = [...BASE_DETECTORS];
  for (const fam of unlockedFamilies || []) {
    const extra = dlcRegistry.get(fam);
    if (extra) out.push(...extra);
  }
  return out;
}
