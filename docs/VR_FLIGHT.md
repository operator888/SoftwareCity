# VR flight — design notes

Goal: fly through a codebase in a VR headset from the Software City web app,
using WebXR, with the same city, pipes and bug markers as on desktop.

## Why WebXR in the web app

- No install and no store review: open the page on a Quest or with SteamVR.
- three.js (already bundled) has `renderer.xr` and controller helpers.
- The parser, layout and detectors are reused unchanged.

## Scale and comfort

- The city is laid out in scene units (a building footprint is 1–7.5 units); a
  large project spans a few hundred units. In VR the default is a "table-top" scale (city ~3 m wide) with a
  button to switch to walk-in scale (1:1).
- Motion: thumbstick flight with acceleration limits, snap turning (30°),
  a vignette while moving, and teleport. No forced camera moves; the desktop
  "fly to" animation becomes a fade-and-teleport.
- Text: floor and file labels are sprites today; in VR they need a minimum
  angular size and must face the viewer.

## Interaction

- Controller ray picks floors and bug markers (the existing raycast picker
  works with a ray from the controller instead of the mouse).
- The inspector becomes a panel on the off-hand wrist (HTML rendered to a
  canvas texture, re-rendered on selection).
- The bug list becomes a floating board; selecting a bug teleports beside it.

## Performance budget (Quest 3, 72–90 fps)

- Floors are individual meshes today; for VR they move to one InstancedMesh
  per complexity colour (as the bug markers already are).
- Pipes are already merged per kind; cap them lower in VR.
- Labels only within a radius of the viewer.

## Steps

1. Desktop fly mode (pointer-lock + WASD) behind a toggle.
2. `renderer.xr.enabled = true`, a VRButton, table-top scale, controller ray picking.
3. Locomotion and comfort options; wrist inspector.
4. Instanced floors; performance pass on a Quest.
