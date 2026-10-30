/* Public entry point of the shared Software City parser.
   analyzeProject(entries) → { files, edges, totals, classes, relations, classIdx, calls }
   analyzeFile(path, src)  → one parsed file
   resolveRef(project, ref) → { file, fn?, cls?, v? } for "path#Symbol" refs
   EXT / EXT_NAME           → extension → language id / display name
   Consumers: SoftwareCity/web (bundled by esbuild), SoftwareCity/patrol (parser_runner.js), SoftwareCity/edu. */
export { SoftwareCity, analyzeProject, analyzeFile, resolveRef, EXT, EXT_NAME } from './parser.js';
