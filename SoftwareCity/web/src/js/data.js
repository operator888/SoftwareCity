/* Static data wiring. The generated pattern library and starport sample
   are put on window here, in a module that index.js imports right after
   vendor.js — BEFORE learn.js evaluates. learn.js reads window.CP_LIBRARY
   at module-evaluation time; when index.js set it in its own body (which
   runs after every import has evaluated) the library sheet rendered empty
   and every lesson was coded "X-00". */

import library from '../data/_generated/library.js';
import starport from '../data/_generated/starport.js';

window.CP_LIBRARY = library;
window.CP_STARPORT = starport;

export { library, starport };
