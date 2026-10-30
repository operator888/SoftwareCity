# Software City

**Created by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt).**

Source code visualised as a 3D blueprint city: folders are plates, files are buildings, functions are floors, classes are dashed frames, variables are antennas, calls are cyan pipes, data flow is amber and mint, recursion is a yellow loop, imports are arcs. Ships with a pattern library of 98 patterns and ~290 working demos (70 of them from real open-source projects), four classic diagrams (UML class, module map, sequence, data flow) and narrated traces with a quiz per pattern.

> **Software City is dual-licensed.** It is free for any noncommercial purpose — personal use, study, research, hobby projects, and use by charities, schools, universities, public research bodies and government — under the PolyForm Noncommercial 1.0.0 licence. Any other use (inside a company, in a product or service that is sold or carries advertising, in paid training) requires a separate paid commercial licence from the author. See `LICENSE.md` (verbatim licence text, with the credit lines every copy must keep) and `LICENSE/COMMERCIAL.md`. PolyForm Noncommercial is source-available, not OSI open source.

## Quick start

```bash
npm install
npm run build      # writes dist/ (one JS bundle incl. three.js + dagre, CSS, fonts, own source)
npm test           # parser, call graph, data flow, search, store, detectors, every demo loads
npm run lint       # ESLint 9 (eslint.config.js)
npm run check      # all of the above + validate:library, in one go
npm run dev        # rebuild on save + a static server on http://localhost:8080
```

`dist/` is a self-contained folder: serve it with any static server, or open `dist/index.html` over `file://` (everything works offline except the "Software City itself" sample, which needs `fetch`).

## Features

- **Bugs.** 19 code-smell detectors run on every survey: a bug list with severity filters (`B`), diamond markers on the floors where findings live, the details in the inspector, and a CSV export plus a ready prompt for your coding AI to review and fix them.
- **3D city.** Pan, orbit, zoom. Click a building to inspect a file; click a floor to inspect a function. Trace from any function with a button.
- **Pattern library.** 98 patterns across 12 families: Foundations, OOP Basics, Principles, Creational, Structural, Behavioral, Functional, Concurrency, Architecture, Domain & Data, Game Programming, Anti-patterns.
- **Real-code demos.** ~70 demos are reduced versions of files from Redux, Django, SQLAlchemy, three.js, Microsoft's eShop, Symfony, TheAlgorithms, Godot, Bevy, Preact, axios, p-limit, PubSubJS, behaviour trees, RxJS and others — kept with their original licence headers for study.
- **Four diagrams.** Class diagram, module map, sequence diagram, data flow diagram — all zoomable, pannable, and copyable as SVG.
- **Roles.** Each pattern highlights the named roles (Base Case, Recursive Case, Subject, Observer, Creator, Product…) on the right floors of the right buildings, so you can see *what* a pattern looks like in code.
- **Narrated traces.** Play walks you through the named call graph of any demo with a script per step. Use the same trace from the inspector of your own code.
- **Privacy.** Everything happens in the browser. Files never leave your machine. No analytics. Self-hosted fonts.
- **Accessibility.** Keyboard shortcuts (`/` for search, `F` to fit, `E` to explode, arrows to step through a trace, `Esc` to close). `prefers-reduced-motion` honoured. Mobile layout reflows side panels to the bottom.

## Supported languages

TypeScript, JavaScript, JSX, TSX, Vue, Svelte, Astro, HTML, Java, C#, C, C++, Kotlin, Swift, Scala, Dart, Go, Rust, PHP, Python, GDScript, Ruby, Lua, CSS, SCSS, Less, Shell, SQL. Full extension list in `../../shared/parser/parser-constants.js`.

## Accuracy

Software City uses a regex + structure-aware parser. It is fast and works offline, but it is not a compiler. It will miss:

- types hidden behind generics (the call pipe points at the *name* it sees, not at the resolved overload),
- calls resolved through reflection, dynamic dispatch, plugins loaded at runtime, observer registries populated by config files,
- precise polymorphism through interfaces when the receiver type is not annotated in the function signature.

For projects where this matters, a SCIP or LSP index file can be dropped in (roadmap). For runtime behaviour, an OpenTelemetry or instrumentation trace can be played back (roadmap). Both are described in `docs/accuracy.md` (placeholder, see issue tracker).

## Project layout

The parser, the pattern library, the family table and the detectors live in the monorepo's `../../shared/` folder and are shared with the Steam game and Edu. This folder holds the web app only.

```
src/
  index.js           # entry: vendor first, then fonts, then mount()
  index.html         # the page shell
  js/
    vendor.js        # bundles three.js + OrbitControls + dagre onto window (must be imported first)
    core.js          # shared state, event bus, esc, toasts, syntax highlight, family info
    parser.js        # one-line re-export of ../../shared/parser
    city.js          # three.js scene, layout, picking, pipes, traces
    diagrams.js      # dagre + SVG: class, module, sequence, data-flow diagrams
    learn.js         # library sheet, lesson panel, roles, traces, quizzes
    app.js           # views, layout, loading, inspector, search, dock, keyboard, bug panel
    bugs.js          # runs shared/detectors over a survey; CSV + AI-review prompt export (no DOM)
    dragdrop.js      # drag-and-drop + folder walking + accept list
    search.js        # ranked, fuzzy search across files, functions, classes
    store.js         # namespaced, debounced, versioned localStorage wrapper
  data/_generated/   # library.js + starport.js, written by the build from shared/ (git-ignored output)
  css/               # reset, fonts (@font-face, self-hosted), base (layout, theme)
assets/fonts/        # WOFF2 files for the four bundled fonts
tests/               # node:test suites: parser, callgraph, dataflow, library, search, store, detectors, layout, starport
scripts/
  build.js           # esbuild bundle → dist/ (prod: hashed; --watch: dev)
  dev.js             # watch build + static server on :8080
  build-library.js   # standalone library/starport data files
  validate-library.js# schema validator for shared/library/*
  inline-starport.js # starport → src/data/_generated/starport.js (pretest/prebuild)
  fetch-fonts.js     # downloads the four WOFF2 fonts once
dist/                # build output
```

## Contributing

See `CONTRIBUTING.md`. Short version:

- Patterns and demos live in `../../shared/library/<family>.js`. One file per family. The schema is checked by `scripts/validate-library.js` and a worked example is in `CONTRIBUTING.md`.
- New languages go in `../../shared/parser/` with a fixture in `tests/fixtures/`.
- Bug fixes for the city, search, or diagrams come with a screenshot or short screen recording.

## License

Dual-licensed:

- **PolyForm Noncommercial 1.0.0** for personal, study, research, charity, educational-institution and government use. See `LICENSE.md`.
- **Commercial licence** required for any other use. See `LICENSE/COMMERCIAL.md`.

Third-party demo code is under its own licence, recorded in `THIRD_PARTY_NOTICES.md`.

## Credits

Built by Theodor Dimitriou. Pattern catalogue draws on the Gang-of-Four book, Robert C. Martin's SOLID essays, Eric Evans' Domain-Driven Design, Robert Nystrom's *Game Programming Patterns*, and the broader literature cited in each pattern's entry.

Real-code demo sources: Redux, Django, SQLAlchemy, three.js, Microsoft's eShop, Symfony, TheAlgorithms, Godot, Bevy, Preact, axios, p-limit, PubSubJS, behaviour3, RxJS, MainLoop.js, microservices-demo, knex, webpack/tapable, eslint, connor4312/cockatiel, jodal/pykka, go-chi/chi, ramda, more-itertools, tastejs/todomvc, python/cpython, timohausmann/quadtree-js, sindresorhus/on-change, php-fig/log, bxcodec/go-clean-arch, tkem/cachetools, IceCreamYou/MainLoop.js, mrdober­ick/PubSubJS, bxcodec, bobthemighty/punq, developit/mitt, supermacro/neverthrow, wooorm/trough, golang/go. See `THIRD_PARTY_NOTICES.md`.