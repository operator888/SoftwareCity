# Changelog

All notable changes to Software City are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-10-26

### Added

- **Bugs in the city.** The 19 shared code-smell detectors now run on every survey in the web app. A bug list (button in the top bar, or `B`) with severity filters; diamond markers beside the floors where findings live, coloured by severity (layer toggle); the findings for the selected file, class or function in the inspector, with why it matters and the fix.
- **CSV export for your coding AI.** One click saves every finding with its code excerpt (RFC 4180, same columns as Software City: Patrol's export) and a review prompt that asks an AI to mark each one real or false positive and fix the real ones.
- **About Software City** (Open code menu): credits, licence and the commercial-licence contact, the in-app form of the licence's Required Notice lines.

### Changed

- **The app's name is Software City everywhere:** the npm package (`software-city`), the parser's global (`window.SoftwareCity`), the bug CSV file names (`…-softwarecity-bugs-…`) and the public repository, github.com/operator888/SoftwareCity. Settings saved under the app's former storage prefix move to `softwarecity:` automatically.
- Licence preamble names the licensor (Dimitriou eCommerce Web Services UG (haftungsbeschränkt)) and the author (Theodor Dimitriou) and adds `Required Notice:` credit lines that every copy and fork must keep. Contributions are accepted under a Contributor Licence Agreement (`CLA.md`), so they can be offered under both licences.

### Fixed (shared parser and detectors, also used by the Steam game)

- Tested against 13 well-known open-source projects (React, Vue, Svelte, Preact, Express, jQuery, Lodash, Axios, three.js, Bootstrap, Vite, Laravel, Astro), which cut false findings sharply (Express 7,685 → 20, React 4,183 → 1,054):
  - a test call with a callback (`it('works', function (done) {`) was read as a method named `it`, and every `it(…)` inside looked like recursion;
  - a bare `name()` inside a JS/PHP/Python/Lua/Go/Rust method (`req.accepts = function () { return accepts(this) }`, `{ use(x) { return use(x) } }`) was taken for a call to itself;
  - an arrow with an expression body (`const parse = (s) => baseParse(s, {…})`) ran on into the following statements;
  - Recursion Without Base Case read the first 3 lines of the function, which for a multi-line signature are only parameters; it now reads the first lines of the body;
  - Magic Number skips tests, fixtures and examples, well-known values (HTTP status codes, ports, byte sizes), repeats of a value and nested functions' lines;
  - Duplicated Code skips tests, ignores trivial lines (braces, `else`, bare `return`) and reports each function once with all its copies;
  - Circular Dependency reports each cycle once, on its first file, so a 1,000-file tangle is not 1,000 findings.
- The two-word "Software City" logo wrapped onto two lines next to a long project name.

- Files with CRLF or CR line endings lost their classes and some functions (the line regexes could not match across the `\r`), and a leading BOM hid the first declaration. Sources are now normalised to LF first.
- Duplicated Code and Circular Dependency reported every project-wide hit once per file. Each is now reported once, on the file it belongs to, and duplicated-code uses a name index instead of comparing every function pair.
- Deep Nesting counted indentation, so every method of a 4-space-indented class looked deeply nested. Brace languages now count block depth.
- A TypeScript parameter typed as a function (`fn: (x) => T`) or with an arrow default was read as an object method spanning the enclosing function, and calls to parameters were linked to same-named functions; together they produced false recursion findings and false call pipes.
- Public Mutable State flagged `private`/`protected` and `#private` fields; Swallowed Exception missed `catch {}` without a binding; CSS rules were treated as long, complex functions full of magic numbers.

## [1.0.1] — 2026-10-12

### Fixed

- The 3D city never started in the built app: three.js was loaded as an ES module, which sets no `window.THREE`, and OrbitControls was never loaded at all. three.js, OrbitControls and dagre are now bundled (`src/js/vendor.js`).
- The Library sheet and every lesson threw `ReferenceError: esc is not defined` in `learn.js`.
- "Software City itself" fetched files that the build never produced; the build now ships the app's own source under `dist/src/`.
- Same-package call linking for Go, Java, C#, Kotlin and Swift silently did nothing (the parser read an empty module-level map).
- Font URLs were absolute (`/fonts/…`), which broke `file://` and sub-path hosting.
- `npm run dev` did not exist; watch mode deleted its own output folder. `npm run lint` had no ESLint 9 config.
- Opening a selection where every file is too large crashed instead of explaining.

### Changed

- Parser moved to `../../shared/parser/` (one copy for web, Patrol and Edu). `src/js/parser.js` is a re-export.
- `LICENSE.md` now carries the verbatim PolyForm Noncommercial 1.0.0 text; the previous file paraphrased it under the same SPDX id.
- Family ids/names come from `../../shared/families.js`.

## [1.0.0] — 2026-10-10

First public release.

### Added

- 98 patterns across 12 families: Foundations, OOP Basics, Principles, Creational, Structural, Behavioral, Functional, Concurrency, Architecture, Domain & Data, Game Programming, Anti-patterns.
- ~290 working demos, of which ~70 are real-code snippets drawn from Redux, Django, SQLAlchemy, three.js, Microsoft's eShop, Symfony, TheAlgorithms, Godot, Bevy, Preact, axios, p-limit, PubSubJS, behaviour3, RxJS and others.
- All 23 Gang-of-Four patterns (Interpreter was the last to be added). Plus Null Object, Specification, MVVM, hexagonal, clean architecture, microservices, plugins, service locator, event sourcing, CQRS, circuit breaker, cache-aside, double buffer, spatial partitioning, event queue, dirty flag, behavior trees, ECS pattern, and the standard anti-patterns.
- Recursion now renders as a yellow loop pipe on the floor that calls itself.
- Lessons with named roles (Base Case, Subject, Observer, etc.) highlighted on the right floors of the right buildings.
- Narrated traces per demo and an automatic trace for any function in the user's own code.
- 4 diagrams: class, module, sequence, data-flow, copyable as SVG.
- Search across files, functions, classes and variables.
- Self-hosted WOFF2 fonts (no Google Fonts, no third-party CDN).
- Dual licence: Polyform Noncommercial 1.0.0 for non-commercial use, paid commercial licence for commercial use.

### Parser fixes

- PHP and Java classes with `{` on the next line now keep their `extends`/`implements` links.
- Classes with the same name in different folders link to the right one.
- Python functions whose arguments span several lines keep their bodies.
- C# generic methods are no longer skipped.
- Kotlin `enum class`, Kotlin extension functions and C# `record class` are read correctly.
- Calls between files of the same Go or Java package now link.
- False recursion loops on some patterns are removed.

### Build and packaging

- esbuild setup with `dev` (watch + live reload), `build`, `test`, `lint`, `validate:library`.
- Vendored three.js r161 and dagre 0.8.5.
- A node:test suite covering every parser language, every demo (294 projects parsed), search, layout, call graph, data flow, the store and the detectors.
- Schema validator for the modular pattern library.