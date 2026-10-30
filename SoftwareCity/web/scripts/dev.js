// Dev server: serves dist/ on http://localhost:8080 and rebuilds on save.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');
const port = +(process.env.PORT || 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// One build process in watch mode: it does the initial build (dist/ is
// recreated, assets copied, index.html written) and then rebuilds
// dist/app.js on every save. Wait until dist/index.html exists before
// serving so the first request never 404s.
console.log('Building…');
const watcher = spawn(process.execPath, [resolve(__dirname, 'build.js'), '--mode=development', '--watch'], { stdio: 'inherit' });
watcher.on('exit', code => { if (code) { console.error('build failed'); process.exit(code); } });
process.on('exit', () => watcher.kill());
for (let i = 0; i < 600 && !existsSync(resolve(dist, 'index.html')); i++) await new Promise(r => setTimeout(r, 100));

const server = createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  let p = join(dist, url === '/' ? 'index.html' : url);
  if (!existsSync(p) || statSync(p).isDirectory()) p = join(dist, 'index.html');
  if (!existsSync(p)) { res.statusCode = 404; res.end('not found'); return; }
  res.setHeader('Content-Type', MIME[extname(p)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(readFileSync(p));
});
server.listen(port, () => console.log(`Serving ${dist} on http://localhost:${port}`));
