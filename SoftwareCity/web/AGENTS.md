# AGENTS.md

Conventions for AI agents and human contributors working in this repository.

## Always run before opening a PR

```bash
npm install
npm run check      # = npm test && npm run lint && npm run validate:library && npm run build
```

All four must pass.

## Working with the parser

The parser is in `../../shared/parser/` (shared with Patrol and Edu; `src/js/parser.js` only re-exports it). It is a regex + structure-aware scanner. It is intentionally minimal and accurate to about 80% of real code; the remaining 20% is documented in `docs/accuracy.md` (placeholder; see issue tracker) and accepted as future work.

When you add a regex, anchor it, test it on the fixtures in `tests/fixtures/`, and add a test in `tests/parser.test.js`. Run the full test suite, not just your new test.

## Working with the library

The library is split into one file per family under `../../shared/library/`. The schema is documented in `CONTRIBUTING.md` and verified by `scripts/validate-library.js`. Never edit `src/data/_generated/*` — it is generated.

After changing a library file, run `npm run validate:library`. After changing the library structure, run `npm run build:library`.

## Style

- 2-space indent, single quotes, semicolons (matches the rest of the project).
- Keep functions under 80 lines. If a function grows past that, split it.
- No `eval`, no `new Function` (use `import()` in scripts). No untrusted innerHTML. Use `App.esc()` (exported from `src/js/core.js`).
- No `let` where `const` will do.

## File layout

The build is `esbuild` and reads from `src/`. Output goes to `dist/`. `dist/` is the artifact a user downloads. `src/` is the source of truth. Never hand-edit `dist/`.

## When you don't know

Ask. Use `question`. The schema for the library is verified by `scripts/validate-library.js`; if you are unsure, run it.
