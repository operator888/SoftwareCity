// Fetches self-hosted WOFF2 fonts from Google Fonts once, into assets/fonts/.
// One-time. After the first run, the app is fully offline.
//
// Strategy:
//   1. Fetch the Google Fonts CSS2 with a User-Agent that targets a modern
//      browser (so the response contains woff2 URLs).
//   2. Parse the CSS to find every font-face block, then for each one
//      download the woff2 file.
//   3. Rewrite the URL in the downloaded file's @font-face block to point
//      to ../fonts/<file>.woff2 (relative, so file:// and sub-path hosting work).
//   4. Write the rewritten CSS as src/css/fonts.css so the page references
//      self-hosted files only.
//
// Usage: node scripts/fetch-fonts.js [--check]
//   --check: only verify the files are present and non-zero

import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const fontsDir = resolve(root, 'assets', 'fonts');
const cssOut = resolve(root, 'src', 'css', 'fonts.css');
const checkOnly = process.argv.includes('--check');

// The exact CSS2 URL Google Fonts generates for the four fonts Software City uses.
// Each weight/style combination is requested separately so the CSS we parse
// is the right shape.
const CSS_URL = 'https://fonts.googleapis.com/css2?' + [
  'family=Architects+Daughter',
  'family=Barlow:ital,wght@0,400;0,500;0,600;1,400',
  'family=Barlow+Condensed:wght@400;500;600;700',
  'family=JetBrains+Mono:wght@400;600'
].join('&') + '&display=swap';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function slugifyFamily(family) {
  return family.toLowerCase().replace(/\s+/g, '-');
}

function parseFontFace(css) {
  // Split into @font-face blocks. Each block looks like:
  //   @font-face {
  //     font-family: 'X';
  //     font-style: normal;
  //     font-weight: 400;
  //     src: url(https://...) format('woff2');
  //     unicode-range: ...;
  //   }
  const blocks = [];
  const re = /@font-face\s*\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const body = m[1];
    const family = /font-family:\s*'([^']+)'/.exec(body)?.[1] || '';
    const weight = /font-weight:\s*(\d+)/.exec(body)?.[1] || '400';
    const style = /font-style:\s*(\w+)/.exec(body)?.[1] || 'normal';
    const url = /url\((https:[^)]+\.woff2)\)/.exec(body)?.[1] || '';
    if (!family || !url) continue;
    blocks.push({ family, weight, style, url });
  }
  return blocks;
}

function fileNameFor(block) {
  const fam = slugifyFamily(block.family);
  const style = block.style === 'italic' ? 'i' : '';
  return `${fam}-${block.weight}${style}.woff2`;
}

function cssFor(block) {
  const fam = block.family;
  const file = fileNameFor(block);
  return `@font-face {
  font-family: '${fam}';
  font-style: ${block.style};
  font-weight: ${block.weight};
  font-display: swap;
  src: url('../fonts/${file}') format('woff2');
}`;
}

async function fetchOne(block) {
  const file = fileNameFor(block);
  const out = resolve(fontsDir, file);
  if (existsSync(out) && statSync(out).size > 1000) return file;
  if (checkOnly) { console.log(`  MISSING ${file}`); return null; }
  process.stdout.write(`  fetching ${file}…`);
  const res = await fetch(block.url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) { console.log(` failed (${res.status})`); return null; }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(out, buf);
  console.log(` ${(buf.length / 1024).toFixed(1)}kB`);
  return file;
}

async function main() {
  mkdirSync(fontsDir, { recursive: true });
  mkdirSync(dirname(cssOut), { recursive: true });

  let blocks;
  if (checkOnly) {
    // We still need the family/weight/style list. Re-fetch the CSS even
    // when only checking; it's a tiny file.
    const res = await fetch(CSS_URL, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) { console.error(`CSS fetch failed: ${res.status}`); process.exit(1); }
    blocks = parseFontFace(await res.text());
  } else {
    console.log('Fetching Google Fonts CSS…');
    const res = await fetch(CSS_URL, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) { console.error(`CSS fetch failed: ${res.status}`); process.exit(1); }
    const css = await res.text();
    blocks = parseFontFace(css);
  }

  if (!blocks.length) { console.error('No @font-face blocks parsed.'); process.exit(1); }

  let ok = true;
  for (const block of blocks) {
    const file = await fetchOne(block);
    if (!file) ok = false;
  }

  if (ok && !checkOnly) {
    const css = blocks.map(cssFor).join('\n\n') + '\n';
    writeFileSync(cssOut, css);
    console.log(`\nWrote ${blocks.length} @font-face block(s) to ${cssOut}.`);
  }

  if (checkOnly) process.exit(ok ? 0 : 1);
}

await main();
