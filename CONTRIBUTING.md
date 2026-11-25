# Contributing to Software City

Thank you for helping. Issues and pull requests of any size are welcome.

## Before your first pull request: the CLA

Software City is dual-licensed: free for noncommercial use, paid for commercial
use. That only works if the project can offer every contribution under both
licences. So each contributor agrees once to the
[Contributor Licence Agreement](CLA.md). When you open your first pull
request, the **CLA Assistant** bot asks you to comment
`I have read the CLA Document and I hereby sign the CLA`; that records your
signature for all your future pull requests too.

In short: your contribution becomes part of Software City and may be used in
its free and paid editions; you receive no payment or revenue share for it;
you keep the right to use your own code elsewhere. Pull requests without a
signed CLA cannot be merged.

## Ground rules

- Be kind; see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- One change per pull request, with a test where the change is testable.
- No new runtime network calls, analytics or CDNs: Software City is offline and private by design.
- Keep the credit lines (`Required Notice:` in `LICENSE.md`) and the in-app About panel intact.

## Setting up

```bash
cd SoftwareCity/web
npm install
npm run check        # tests, lint, library schema, build: run before every PR
npm run dev          # http://localhost:8080, rebuilds on save
```

There is no CI on this repository yet. `npm run check` is the gate; paste its
last lines into the pull request.

## Where things live

- **Parser** (`shared/parser/`): a false parse or a missed function is the most
  valuable bug report. Add a minimal fixture under `SoftwareCity/web/tests/fixtures/<lang>/`
  and a test that fails before your fix.
- **Detectors** (`shared/detectors/index.js`): each detector has an id, a family,
  a severity, an explanation (`why`, `fix`) and a `detect(file, allFiles)` function.
  A false positive is a bug: send the smallest code that triggers it.
- **Web app** (`SoftwareCity/web/src/`): see `SoftwareCity/web/CONTRIBUTING.md` for the
  module map, the pattern schema and the demo rules.

## Reporting bugs found by Software City itself

If a detector flags something that is not a problem, export the CSV from the
bug list, keep the row in question, and attach it to an issue together with
the code excerpt (the CSV already contains it). Remove anything private first.
