/* Software City entry point. Bundled by esbuild into dist/app.<hash>.js (iife).
   Import order matters: vendor.js puts THREE (+OrbitControls) and dagre on
   window, data.js puts the library and starport on window; both before
   city.js / diagrams.js / learn.js evaluate and read them. */

import './js/vendor.js';
import { library, starport } from './js/data.js';
import { App } from './js/core.js';
import { City } from './js/city.js';
import { Diagrams } from './js/diagrams.js';
import { Learn } from './js/learn.js';
import { SoftwareCity } from './js/parser.js';
import { store } from './js/store.js';
import { Search } from './js/search.js';
import { DragDrop } from './js/dragdrop.js';
import { mount } from './js/app.js';

// Wait for fonts before starting so the first paint (canvas labels are
// rasterised from these fonts) is correct. Capped at 2.5 s so a missing
// font never blocks the app. This is the only font wait; app.js starts
// immediately once mounted.
const fontReady = (document.fonts && document.fonts.load)
  ? Promise.all([
      document.fonts.load('64px "Architects Daughter"'),
      document.fonts.load('40px "JetBrains Mono"'),
      document.fonts.load('14px "Barlow"'),
      document.fonts.load('14px "Barlow Condensed"')
    ]).catch(() => {})
  : Promise.resolve();
Promise.race([fontReady, new Promise(r => setTimeout(r, 2500))]).then(() => {
  mount({ App, City, Diagrams, Learn, SoftwareCity, store, Search, DragDrop });
});

// Expose for tests
export { App, City, Diagrams, Learn, SoftwareCity, store, library, starport };
