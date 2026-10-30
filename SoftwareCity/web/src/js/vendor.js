/* Vendored runtime libraries, bundled by esbuild and exposed on window
   for the rest of the app. city.js reads window.THREE (with OrbitControls
   attached) and diagrams.js reads window.dagre at module-evaluation time,
   so this module must be the FIRST import in src/index.js — ES module
   evaluation order follows import order.

   Why not <script type="module" src="vendor/three.module.js">? An ES
   module never creates globals, so that approach left window.THREE
   undefined and the city reported "The 3D engine could not load". Bundling
   also keeps the dist/ folder self-contained for file:// use. */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import dagre from 'dagre';

window.THREE = Object.assign({}, THREE, { OrbitControls });
window.dagre = dagre;
