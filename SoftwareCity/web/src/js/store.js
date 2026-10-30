/* Namespaced, versioned, debounced localStorage wrapper.
   Provides:
     store.get(key, default)             → read, with JSON parse
     store.set(key, value)               → write, with JSON stringify, debounced 200ms
     store.del(key)                      → remove
     store.getVersion()                  → schema version, currently 1
     store.migrate(fromVersion)          → run any pending migrations (no-op for v1)
     store.subscribe(key, fn)            → fire fn whenever key changes
   All keys are stored under the "softwarecity:" prefix, which the rest of the
   app uses too. Keys saved under a former prefix (the app's earlier names)
   are moved over once on load, so nobody loses their settings in the rename. Namespacing matters when one project shares a domain with
   another (e.g. localhost) — a flat key like "visited" would collide. */

const NAMESPACE = 'softwarecity:';
// The app's two former names, spelled in parts so a rename sweep finds only this line.
const LEGACY_NAMESPACES = ['code' + 'print:', 'code' + 'city:'];
const VERSION = 1;
const DEBOUNCE = 200;

const memory = Object.create(null);    // in-memory fallback when localStorage is unavailable
let memOnly = false;
try { localStorage.setItem('__cc_probe', '1'); localStorage.removeItem('__cc_probe'); }
catch (e) { memOnly = true; }

/* One-time move of keys saved under a former prefix. A key that already
   exists under the new prefix wins; the old copy is removed either way. */
function migrateLegacyKeys() {
  if (memOnly) return 0;
  let moved = 0;
  try {
    const old = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && LEGACY_NAMESPACES.some(p => k.startsWith(p))) old.push(k);
    }
    for (const k of old) {
      const rest = k.slice(k.indexOf(':') + 1);
      if (localStorage.getItem(NAMESPACE + rest) == null) { localStorage.setItem(NAMESPACE + rest, localStorage.getItem(k)); moved++; }
      localStorage.removeItem(k);
    }
  } catch (e) { /* storage full or blocked: keep the old keys, nothing breaks */ }
  return moved;
}
migrateLegacyKeys();

const subs = new Map();                // key → Set<fn>
function notify(key) {
  const set = subs.get(key);
  if (!set) return;
  for (const fn of set) { try { fn(); } catch (e) { console.error(e); } }
}

const writeTimers = new Map();
function scheduleWrite(key, value) {
  clearTimeout(writeTimers.get(key));
  writeTimers.set(key, setTimeout(() => doWrite(key, value), DEBOUNCE));
}
function doWrite(key, value) {
  const fullKey = NAMESPACE + key;
  const str = JSON.stringify(value);
  if (!memOnly) { try { localStorage.setItem(fullKey, str); } catch (e) { memOnly = true; } }
  memory[key] = value;
  notify(key);
}

const store = {
  getVersion() { return VERSION; },

  get(key, fallback) {
    if (key in memory) return memory[key];
    if (memOnly) return fallback;
    try {
      const raw = localStorage.getItem(NAMESPACE + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },

  set(key, value) { scheduleWrite(key, value); },

  setSync(key, value) {
    /* For tests and the few call sites that need a deterministic read-after-write. */
    clearTimeout(writeTimers.get(key));
    doWrite(key, value);
  },

  del(key) {
    clearTimeout(writeTimers.get(key));
    if (!memOnly) { try { localStorage.removeItem(NAMESPACE + key); } catch (e) { memOnly = true; } }
    delete memory[key];
    notify(key);
  },

  flush() {
    /* Force any pending debounced writes to apply now. */
    for (const [key, t] of writeTimers) { clearTimeout(t); doWrite(key, memory[key] === undefined ? store.get(key) : memory[key]); }
    writeTimers.clear();
  },

  subscribe(key, fn) {
    if (!subs.has(key)) subs.set(key, new Set());
    subs.get(key).add(fn);
    return () => subs.get(key).delete(fn);
  },

  migrate(fromVersion) {
    if (fromVersion === VERSION) return;
    // v1 is the first version. Future migrations go here, e.g. if we ever
    // rename a key or change the shape of `visited`. Always return *something*
    // and never throw on missing data.
  },

  /* Test-only: reset all keys. The app code should never call this. */
  __reset() {
    for (const k of Object.keys(memory)) delete memory[k];
    for (const t of writeTimers.values()) clearTimeout(t);
    writeTimers.clear();
    if (!memOnly) {
      try {
        const toDel = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(NAMESPACE)) toDel.push(k);
        }
        toDel.forEach(k => localStorage.removeItem(k));
      } catch (e) { /* ignore */ }
    }
  }
};

export { store, migrateLegacyKeys };
if (typeof window !== 'undefined') window.SoftwareCityStore = store;
