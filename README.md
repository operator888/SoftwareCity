# Software City — your code as a city, with its bugs

**Created by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt).** Free for personal and
noncommercial use. Commercial use needs a licence.

Software City turns a source-code folder into a 3D blueprint city: folders are
districts, files are buildings, functions are floors (height = length, colour
= complexity), classes are dashed frames, variables are antennas, and calls,
data flow and imports run between them as pipes and arcs. Nineteen code-smell
detectors then find the bugs and mark the floors where they live.

Everything runs in your browser. Your code never leaves your machine.

Website: **[softwarecity.eu](https://softwarecity.eu)**

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-support%20Software%20City-ffbf5a?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/theodorosdc)

## What is in this repository

| Folder | What it is |
|---|---|
| `SoftwareCity/web/` | **Software City**, the web app: 3D city, bug list and markers, CSV export for your coding AI, four diagrams, a library of 98 design patterns with lessons and quizzes. |
| `shared/parser/` | The source-code survey: files → functions, classes, calls, data flow. Regex + structure, no compiler, ~30 languages. |
| `shared/detectors/` | The bug detectors: long and tangled functions, deep nesting, swallowed exceptions, circular dependencies, god objects, magic numbers and more. |
| `shared/library/` | The pattern library (98 patterns, 12 families) with real-code demos. |
| `shared/starport/` | A small sample codebase to try everything on. |

Coming next: **VR flight through the city** (WebXR, see `ROADMAP.md`).

## Quick start

```bash
cd SoftwareCity/web
npm install
npm run dev          # http://localhost:8080
npm run check        # tests + lint + library validation + build
```

Open a folder (or drop it on the window), then press `B` for the bug list.
`npm run build` writes a self-contained `dist/` you can serve from any
static host.

## Software City: Patrol on Steam

**Software City: Patrol** is the game built on this core: walk your city, triage
the bugs, and survive the Bug Swarm before it blows your code up. It is a
separate, paid product on Steam (Early Access). Buying it supports the
development of this free core. The game itself is not open source.

## Licence

Software City is **dual-licensed**:

- **Free** under the [PolyForm Noncommercial 1.0.0](LICENSE.md) licence for
  personal use, hobby projects, study, research, and use by schools,
  universities, charities and public bodies.
- **Paid commercial licence** for anything else: use at work in a company,
  in a product or service, as a hosted service, or in paid training. See
  [COMMERCIAL.md](COMMERCIAL.md).

Every copy and fork must keep the licence and its `Required Notice:` credit
lines, which name the original author. The names "Software City", "Software City: Patrol"
and "Software City Edu" are covered by [TRADEMARKS.md](TRADEMARKS.md).

PolyForm Noncommercial is *source-available*: you can read, run, change and
share the code for noncommercial purposes, but it is not an OSI-approved
open-source licence, because commercial use is reserved.

## Community

Questions, ideas and screenshots of your city go to
[Discussions](https://github.com/operator888/SoftwareCity/discussions).
The user guide is in the [wiki](https://github.com/operator888/SoftwareCity/wiki),
and the plans are on the [roadmap board](https://github.com/operator888/SoftwareCity/projects).

## Support the project

Software City is built by one person. If it helped you see your code differently,
you can [buy me a coffee](https://buymeacoffee.com/theodorosdc). It pays for
the time that goes into new detectors, languages and lessons.

## Contributing

Contributions are welcome: parser fixes for real code, new detectors, fewer
false positives, patterns, demos, accessibility, translations. Read
[CONTRIBUTING.md](CONTRIBUTING.md); every contributor agrees once to the
[Contributor Licence Agreement](CLA.md), which keeps the dual licence possible.
Report security issues as described in [SECURITY.md](SECURITY.md).
