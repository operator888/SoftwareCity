// Library schema validator.
//
// Checks every pattern in src/data/library/ against the schema documented
// in CONTRIBUTING.md. Designed to be fast (a few seconds even on the full
// library) and to print actionable error messages.
//
// Usage:
//   node scripts/validate-library.js
//   node scripts/validate-library.js --pattern=strategy
//   node scripts/validate-library.js --json

import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..', '..');
const libraryDir = resolve(root, 'shared', 'library');
const args = new Set(process.argv.slice(2));
const jsonMode = args.has('--json');
const patternFilter = (args.has('--pattern') ? process.argv[process.argv.indexOf('--pattern') + 1] : null);
if (patternFilter) args.delete('--pattern');

const errors = [];
const warnings = [];
function err(patternId, msg) { errors.push({ pattern: patternId, msg }); }
function warn(patternId, msg) { warnings.push({ pattern: patternId, msg }); }

const REQUIRED_PATTERN_KEYS = ['id', 'family', 'name', 'tagline', 'intent', 'analogy', 'cityShape', 'roles', 'whenToUse', 'pitfalls', 'quiz', 'demos'];
const REQUIRED_DEMO_KEYS = ['id', 'lang', 'level', 'title', 'story', 'files'];
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const VALID_LANGS = new Set([
  'TypeScript', 'JavaScript', 'TSX', 'JSX', 'Vue', 'Svelte', 'Astro', 'HTML',
  'Java', 'C#', 'C', 'C++', 'Kotlin', 'Swift', 'Scala', 'Dart',
  'Go', 'Rust', 'PHP', 'Python', 'GDScript', 'Ruby', 'Lua',
  'CSS', 'SCSS', 'Less', 'SQL', 'Shell', 'HTML+CSS'
]);

async function loadFamilies() {
  const families = [];
  const patterns = [];
  const allIds = new Set();
  const allDemos = new Set();
  const files = readdirSync(libraryDir).filter(f => f.endsWith('.js')).sort();
  for (const file of files) {
    if (patternFilter && !file.includes(patternFilter)) continue;
    const mod = await import(resolve(libraryDir, file).replace(/\\/g, '/'));
    const data = mod.default;
    if (!data.families || !Array.isArray(data.families)) err(file, 'missing families array');
    if (!data.patterns || !Array.isArray(data.patterns)) err(file, 'missing patterns array');
    families.push(...(data.families || []));
    for (const p of data.patterns) {
      if (allIds.has(p.id)) err(p.id, `duplicate pattern id`);
      allIds.add(p.id);
      patterns.push({ ...p, _file: file });
      for (const d of p.demos || []) {
        const demoId = d.id || `${p.id}#?`;
        if (allDemos.has(demoId)) err(p.id, `duplicate demo id "${demoId}"`);
        allDemos.add(demoId);
      }
    }
  }
  return { families, patterns, allIds, allDemos };
}

function validatePattern(p) {
  for (const k of REQUIRED_PATTERN_KEYS) {
    if (!(k in p)) err(p.id, `missing required field "${k}"`);
  }
  if (p.related) for (const r of p.related) {
    if (typeof r !== 'string') err(p.id, `related entries must be strings`);
  }
  if (!Array.isArray(p.roles) || p.roles.length < 2) err(p.id, `roles must have at least 2 entries`);
  for (const r of p.roles || []) {
    if (!r.name) err(p.id, `role missing name`);
    if (!r.desc) err(p.id, `role "${r.name}" missing desc`);
  }
  if (!Array.isArray(p.demos) || p.demos.length === 0) err(p.id, `demos must be a non-empty array`);
  for (const d of p.demos || []) {
    for (const k of REQUIRED_DEMO_KEYS) {
      if (!(k in d)) err(p.id, `demo "${d.id || '?'}" missing required field "${k}"`);
    }
    if (d.level && !VALID_LEVELS.includes(d.level)) {
      const norm = d.level.charAt(0).toUpperCase() + d.level.slice(1).toLowerCase();
      if (!VALID_LEVELS.includes(norm)) err(p.id, `demo "${d.id}" has unknown level "${d.level}"`);
    }
    if (d.lang && !VALID_LANGS.has(d.lang)) warn(p.id, `demo "${d.id}" has unknown lang "${d.lang}" — add it to the schema if real`);
    if (d.files && typeof d.files === 'object') {
      for (const [path, content] of Object.entries(d.files)) {
        if (typeof content !== 'string') err(p.id, `demo "${d.id}" file "${path}" is not a string`);
        if (content.length > 200_000) warn(p.id, `demo "${d.id}" file "${path}" is ${(content.length / 1000).toFixed(0)}kB — consider reducing`);
      }
    }
    if (d.roles && typeof d.roles === 'object') {
      for (const [roleName, refs] of Object.entries(d.roles)) {
        if (!Array.isArray(refs)) err(p.id, `demo "${d.id}" role "${roleName}" must be an array`);
        for (const ref of refs || []) {
          if (typeof ref !== 'string') err(p.id, `demo "${d.id}" role "${roleName}" reference "${ref}" must be a string`);
          // accepted shapes: "path/to/file.ts" or "path/to/file.ts#Symbol"
        }
      }
    }
    if (d.source) {
      if (!d.source.repo) err(p.id, `demo "${d.id}" source missing repo`);
      if (!d.source.url) err(p.id, `demo "${d.id}" source missing url`);
      if (!d.source.license) err(p.id, `demo "${d.id}" source missing license`);
    }
    if (d.trace) for (const step of d.trace) {
      if (!step.at) err(p.id, `demo "${d.id}" trace step missing "at"`);
      if (!step.say) err(p.id, `demo "${d.id}" trace step missing "say"`);
    }
  }
  if (p.quiz) for (const q of p.quiz) {
    if (!q.q) err(p.id, `quiz question missing text`);
    if (!Array.isArray(q.options) || q.options.length < 2) err(p.id, `quiz question must have at least 2 options`);
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options || []).length) err(p.id, `quiz answer index out of range`);
    if (!q.why) err(p.id, `quiz question missing "why" explanation`);
  }
}

const { families, patterns, allIds, allDemos } = await loadFamilies();
for (const p of patterns) {
  validatePattern(p);
  if (p.related) for (const r of p.related) {
    if (!allIds.has(r)) err(p.id, `related pattern "${r}" does not exist`);
  }
}

if (jsonMode) {
  console.log(JSON.stringify({ ok: errors.length === 0, errors, warnings, families, patterns: patterns.length, demos: allDemos.size }, null, 2));
} else {
  const ok = errors.length === 0;
  console.log(`\n  ${ok ? '✓' : '✗'} ${patterns.length} pattern(s) across ${families.length} famil${families.length === 1 ? 'y' : 'ies'}, ${allDemos.size} demo(s)\n`);
  if (errors.length) {
    console.log(`  ${errors.length} error(s):`);
    for (const e of errors) console.log(`    ${e.pattern}: ${e.msg}`);
  }
  if (warnings.length) {
    console.log(`  ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`    ${w.pattern}: ${w.msg}`);
  }
  if (!ok) process.exit(1);
}
