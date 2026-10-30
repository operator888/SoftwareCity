/* Bugs: runs the shared code-smell detectors (shared/detectors/) over a
   surveyed project and exports the findings as CSV for review by a person
   or a coding AI.

   Pure module, no DOM: the city draws the markers, app.js draws the panel,
   and the tests run this file in Node. The bug shape and the CSV columns
   match Software City: Patrol's export (SoftwareCity/patrol/Project/scripts/
   bug_export.gd) so one review pipeline reads both; the web app has no
   triage or Bug Swarm, so those columns stay "untriaged" and empty. */

import { BASE_DETECTORS } from '../../../../shared/detectors/index.js';

export const SEVERITY = ['info', 'minor', 'major', 'critical'];

export const CSV_COLUMNS = [
  'bug_id', 'severity', 'severity_level', 'detector_id', 'detector_name', 'family',
  'file', 'absolute_path', 'line', 'end_line', 'function', 'class',
  'message', 'evidence', 'why_it_matters', 'suggested_fix', 'detector_score',
  'triage_status', 'swarm_result', 'code_excerpt', 'ai_verdict', 'ai_notes'
];

const EXCERPT_MAX = 40;

const fnLabel = fn => (fn.cls && fn.name !== fn.cls ? fn.cls + '.' : '') + fn.name;

/* Every finding of every detector, most severe first, then by file and line.
   A detector that throws on one file is skipped for that file only (the
   detectors are heuristics; one odd file must not hide every other bug). */
export function scan(project, detectors = BASE_DETECTORS) {
  const bugs = [];
  if (!project || !project.files) return bugs;
  for (const file of project.files) {
    for (const d of detectors) {
      let issues;
      try { issues = d.detect(file, project.files) || []; }
      catch (e) { continue; }
      for (const is of issues) {
        bugs.push({
          id: d.id + ':' + file.path + ':' + is.line + ':' + is.message,
          detectorId: d.id, name: d.name, family: d.family, enemy: d.enemy,
          severity: d.severity | 0, score: +is.score || 0,
          file, fn: is.fn || null, cls: is.cls || null, line: is.line | 0,
          message: is.message, evidence: is.evidence || [],
          question: d.question || '', why: d.why || '', fix: d.fix || ''
        });
      }
    }
  }
  bugs.sort((a, b) => b.severity - a.severity || (a.file.path < b.file.path ? -1 : a.file.path > b.file.path ? 1 : 0) || a.line - b.line);
  return bugs;
}

/* Counts per severity level, index 0 = info … 3 = critical. */
export function counts(bugs) {
  const c = [0, 0, 0, 0];
  for (const b of bugs) c[Math.max(0, Math.min(3, b.severity))]++;
  return c;
}

/* The bugs that live in a file, or in one function of it. */
export function bugsIn(bugs, file, fn) {
  return bugs.filter(b => b.file === file && (!fn || b.fn === fn || (b.line >= fn.start && b.line <= fn.end)));
}

/* Source lines around the finding, numbered, '>' on the flagged line: the
   whole function (first EXCERPT_MAX lines) or ±3 lines. */
export function excerpt(file, fn, line) {
  const lines = (file.src || '').split('\n');
  let a = Math.max(0, line - 3), z = Math.min(lines.length - 1, line + 3);
  if (fn) {
    a = fn.start; z = Math.min(fn.end, fn.start + EXCERPT_MAX - 1);
    if (line > z) z = Math.min(lines.length - 1, line + 1);
  }
  const out = [];
  for (let i = a; i <= z; i++) out.push((i === line ? '>' : ' ') + String(i + 1).padStart(5) + '| ' + lines[i]);
  if (fn && fn.end > z) out.push('       … ' + (fn.end - z) + ' more lines in ' + fn.name + '()');
  return out.join('\n');
}

const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';

/* RFC 4180: every text field quoted, quotes doubled, CRLF row ends, newlines
   inside the excerpt kept inside the quotes. UTF-8 (the caller adds a BOM
   when the file is for a spreadsheet app). */
export function toCsv(bugs, root = '') {
  const rows = [CSV_COLUMNS.map(q).join(',')];
  bugs.forEach((b, i) => {
    const f = b.file, fn = b.fn, cls = b.cls;
    const end = fn ? fn.end + 1 : cls ? cls.end + 1 : b.line + 1;
    rows.push([
      q('B' + String(i + 1).padStart(4, '0')), q(SEVERITY[Math.max(0, Math.min(3, b.severity))]), String(b.severity),
      q(b.detectorId), q(b.name), q(b.family),
      q(f.path), q(root ? root.replace(/\/+$/, '') + '/' + f.path : ''), String(b.line + 1), String(end),
      q(fn ? fnLabel(fn) : ''), q(cls ? cls.name : fn && fn.cls ? fn.cls : ''),
      q(b.message), q(b.evidence.map(String).join('; ')),
      q(b.why), q(b.fix), b.score.toFixed(2),
      q('untriaged'), q(''), q(excerpt(f, fn, b.line)), q(''), q('')
    ].join(','));
  });
  return rows.join('\r\n') + '\r\n';
}

/* The companion prompt that tells a coding AI what to do with the CSV. */
export function prompt(projectName, csvName, count) {
  return `# Software City findings — review request

\`${csvName}\` lists ${count} findings that Software City's static detectors reported
in the project "${projectName}". The detectors are heuristics (regex + structure,
no type checker), so some findings are real defects and some are false positives.

## Your task

For every row:

1. Open \`file\` at \`line\` (paths are relative to the project root).
   \`code_excerpt\` shows the code the detector saw; \`>\` marks the flagged line.
2. Decide whether the finding is a real problem worth changing.
3. Fill \`ai_verdict\` with exactly one of \`real_bug\`, \`real_smell\` (works but
   should be refactored), \`false_positive\`, or \`not_sure\`.
4. Fill \`ai_notes\` with one or two sentences: why, and for real findings the
   concrete fix (or the fix you applied).

Then fix the \`real_bug\` rows first, most severe first (\`severity_level\` 3 to 0),
and keep fixes minimal and covered by tests where the project has them.

## Columns

- \`detector_name\`, \`message\`, \`evidence\`: what was detected.
- \`why_it_matters\`, \`suggested_fix\`: the detector's general explanation.
- \`detector_score\`: 0–1, how strongly the heuristic fired (not a probability).
- \`triage_status\` and \`swarm_result\` are filled by Software City: Patrol only.

Return the same CSV with \`ai_verdict\` and \`ai_notes\` filled in.
`;
}

/* A file name like "my-app-softwarecity-bugs-20261026-1412.csv". */
export function csvName(projectName, now = new Date()) {
  const safe = (projectName || 'project').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').slice(0, 40) || 'project';
  const p = n => String(n).padStart(2, '0');
  return safe + '-softwarecity-bugs-' + now.getFullYear() + p(now.getMonth() + 1) + p(now.getDate()) + '-' + p(now.getHours()) + p(now.getMinutes()) + '.csv';
}

export const DETECTOR_COUNT = BASE_DETECTORS.length;

export const Bugs = { DETECTOR_COUNT, scan, counts, bugsIn, excerpt, toCsv, prompt, csvName, SEVERITY, CSV_COLUMNS };
