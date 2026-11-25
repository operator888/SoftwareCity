# Contributing

Thank you for your interest in Software City. Contributions of all sizes are welcome: typos, parser fixes for real code, new patterns, real-code demos, bug reports, diagrams, accessibility improvements, performance work, and translations of the lesson copy.

## Code of conduct

By participating you agree to the Contributor Covenant in `CODE_OF_CONDUCT.md`.

## Licence and CLA

Software City is dual-licensed (PolyForm Noncommercial 1.0.0 for noncommercial use, plus a paid commercial licence). So that contributions can be offered under both, every contributor signs the Contributor Licence Agreement in `CLA.md` at the repository root once, by commenting `I have read the CLA Document and I hereby sign the CLA` when the CLA Assistant bot asks on their first pull request. Contributions become part of Software City and may be used in its free and paid editions, without payment or revenue share; contributors keep the right to use their own code elsewhere and are credited in the changelog.

The dual licence exists so that the project can fund further development while staying free for personal, study, research and educational-institution use.

## Setting up

```bash
npm install
npm test            # node:test suites (every language, every demo)
npm run lint
npm run dev         # local server with watch on http://localhost:8080
```

The dev server opens `http://localhost:8080`. Hot reload rebuilds JS on save.

## Working on the parser

The parser is in `../../shared/parser/` (shared with the Steam game and Edu). It is a regex + brace/indent scanner. It is intentionally minimal.

When you fix one, write a fixture in `tests/fixtures/<lang>/<name>.<ext>`, then a test in `tests/parser.test.js`. The fixture should be a *minimal* snippet of real-world code that the parser currently mishandles. The test asserts the resulting function/class/field/call looks the way you expect.

The parser is the most fragile part of the codebase. Real-code demos that fail to parse become part of the regression suite.

## Adding a pattern

Patterns live in `../../shared/library/<family>.js`. Each family is one file exporting `{ families: [name], patterns: [...] }`; each pattern object has this schema:

```js
export default {
  id: 'strategy',
  family: 'Behavioral',
  name: 'Strategy',
  aka: ['Policy'],
  tagline: 'Swap an algorithm at runtime by holding a reference to it.',
  intent: 'A class needs different behaviour at different times or in different contexts, but the surrounding code should not care which one is in use. Wrap each algorithm in its own class with a shared interface and let the context hold a reference to one of them.',
  analogy: 'A payment screen that takes a card, a wallet or a bank transfer: each one knows how to charge, the screen does not know how any of them work.',
  cityShape: 'Look for one interface class with several subclasses and a context class that holds one of them as a field. Method calls into that field arrive as violet (polymorphic) pipes.',
  roles: [
    { name: 'Strategy interface', desc: 'The shared shape of all algorithms.' },
    { name: 'Concrete strategy', desc: 'A specific algorithm.' },
    { name: 'Context', desc: 'Holds a strategy reference and delegates to it.' }
  ],
  whenToUse: ['You have several variants of the same algorithm.', '...'],
  pitfalls: ['Don\'t add a strategy when there is only ever one variant.', '...'],
  related: ['state', 'command', 'template-method'],
  quiz: [
    {
      q: 'What does the Context hold?',
      options: ['A concrete algorithm', 'A reference to the strategy interface', 'The strategy interface itself'],
      answer: 1,
      why: 'The Context depends on the interface, not on any concrete strategy. That is what makes the swap possible.'
    }
  ],
  demos: [
    {
      id: 'strategy-ts-shipping',
      lang: 'TypeScript',
      level: 'Beginner',
      title: 'Shipping cost strategies',
      story: 'A checkout picks the right shipping strategy at runtime.',
      files: { 'src/shipping.ts': '...', 'src/flat.ts': '...' },
      trace: [{ at: 'src/shipping.ts:Cart#checkout', say: 'Cart delegates to the strategy.' }],
      roles: { 'Strategy interface': ['src/shipping.ts#ShippingStrategy'], 'Concrete strategy': ['src/shipping.ts#FlatRate', 'src/shipping.ts#WeightBased'], 'Context': ['src/shipping.ts#Cart'] }
    },
    {
      id: 'strategy-cs-payment',
      lang: 'C#',
      level: 'Intermediate',
      title: 'Payment processors',
      story: 'A checkout chooses between card, wallet and bank-transfer.',
      files: { '...': '...' }
    }
  ]
};
```

The schema validator (`scripts/validate-library.js`) and the test suite (`tests/library.test.js`) check:

- every `id` is unique,
- every `related` pointer exists,
- every `roles` reference resolves in the demo files,
- every `trace` step resolves to a function,
- every `demo.id` is unique,
- every demo has at least one function the city can render.

Run `npm run validate:library` to check a single pattern.

## Adding a real-code demo

Real-code demos are short, faithful snippets drawn from an open-source project. The point is to give the learner something close to real production code.

To add one:

1. Find a small, well-isolated function or class in an open-source project.
2. Verify the project licence is compatible: MIT, BSD-2/3-Clause, Apache-2.0, PSF-2.0, ISC, MPL-2.0, or the project's own permissive licence. AGPL, GPL, SSPL, BUSL, Elastic, source-available and "fair-source" licences are *not* acceptable.
3. Keep the original copyright and licence header in the snippet.
4. Add the demo to the relevant pattern's `demos` array with a `source` field:

   ```js
   source: {
     repo: 'reduxjs/redux',
     url: 'https://github.com/reduxjs/redux/blob/v5.0.0/src/combineReducers.ts',
     license: 'MIT',
     note: 'Reduced to a single function for teaching. Original file: ~250 lines.'
   }
   ```

5. Run `npm run validate:library -- --pattern=<pattern-id>` to confirm the demo parses and renders.

A real-code demo that fails to render is worse than no demo — it stops the lesson for everyone. Add it to `tests/fixtures/real/<pattern-id>-<demo-id>/` and write a parse test for it.

## Bug reports

Open an issue. Include:

- the language and a minimal snippet that fails,
- what you expected vs. what you saw (which call is missing, which class is wrong, etc.),
- a screenshot if it is a visual bug.

## Pull requests

- One change per PR.
- Add or update tests.
- Keep the diff small. Refactors that touch the parser should come with a benchmark in `tests/benchmark.test.js`.
- The PR template is in `.github/PULL_REQUEST_TEMPLATE.md`.

## Releases

The maintainer tags releases by hand. The changelog is `CHANGELOG.md`.