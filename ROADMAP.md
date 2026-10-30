# Roadmap

Plans, not promises. Ideas and votes are welcome as issues.

## Next: VR flight through the city

Fly through your codebase in a VR headset, straight from the browser, with
no install. The design is in [docs/VR_FLIGHT.md](docs/VR_FLIGHT.md). In short:

1. **Fly mode on desktop first**: WASD + mouse free flight inside the city,
   so the navigation is right before a headset is involved.
2. **WebXR session** (three.js `WebXRManager`): the city at room scale, the
   floors you point at highlighted, the inspector as a panel on your wrist.
3. **Flight**: thumbstick fly with snap turning and a comfort vignette;
   teleport to any building from a minimap.
4. **Bugs in VR**: the bug markers float beside their floors; point and
   click to read the finding and the code.

Targets: Meta Quest browser and SteamVR through a WebXR-capable desktop browser.

## Then

- More languages surveyed in depth: Python, Go, Java/Kotlin, C#, Rust.
- More detectors and fewer false positives, driven by exported CSV reviews.
- Import a precise index (SCIP / LSP) for exact call graphs where it matters.
- Playback of a runtime trace (OpenTelemetry) through the city.
