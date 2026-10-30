# Deploying Software City (web)

Software City is a static site: one HTML file, one JS bundle, CSS, fonts, and the
app's own source for the "Software City itself" sample. No server code, no
database, no analytics. Any static host works.

## Build

```bash
cd SoftwareCity/web
npm ci
npm run check          # test + lint + validate:library + build → dist/
```

`dist/` is the deployable folder (about 10 MB; 3.3 MB is the JS bundle, the
rest is the source map, which you may delete for production: `rm dist/*.map`).

## Host it

Serve `dist/` at the root of a domain or any sub-path (all URLs are
relative). Recommended headers:

- `Cache-Control: public, max-age=31536000, immutable` for `app.*.js`,
  `fonts/*` (content-hashed / never change),
- `Cache-Control: no-cache` for `index.html`,
- `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'`
  (the app uses inline `style=` attributes, no inline scripts, no third-party origins).

Example with rsync + Caddy (the pattern used for the other sites):

```bash
rsync -az --delete dist/ user@host:/srv/software-city/
```

```caddyfile
softwarecity.example.com {
  root * /srv/software-city
  file_server
  encode zstd gzip
  @immutable path /app.*.js /fonts/*
  header @immutable Cache-Control "public, max-age=31536000, immutable"
  header /index.html Cache-Control "no-cache"
}
```

## Release checklist

- [ ] `npm run check` green.
- [ ] Bump `version` in `package.json`, date the entry in `CHANGELOG.md`.
- [ ] `npm pack` for the downloadable archive (`software-city-<version>.tgz`, contains `dist/` + licences).
- [ ] Tag: `git tag web-v<version>`.
- [ ] Smoke test the deployed URL: Library shows 98 cards, a lesson plays, "Starport sample" and
      "Software City itself" load, no console errors.
