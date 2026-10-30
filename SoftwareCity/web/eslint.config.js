// ESLint 9 flat config. `npm run lint` covers src/, tests/ and scripts/.
// Style rules follow AGENTS.md: 2-space indent, single quotes, no semicolons
// are NOT enforced here (the codebase uses semicolons throughout); the aim of
// this config is correctness — undefined globals, unused symbols, no eval.

import js from '@eslint/js';

const browserGlobals = {
  window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly', history: 'readonly',
  localStorage: 'readonly', sessionStorage: 'readonly', fetch: 'readonly', console: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
  requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly', requestIdleCallback: 'readonly',
  addEventListener: 'readonly', removeEventListener: 'readonly', matchMedia: 'readonly',
  innerWidth: 'readonly', innerHeight: 'readonly', devicePixelRatio: 'readonly', performance: 'readonly',
  XMLSerializer: 'readonly', Blob: 'readonly', URL: 'readonly', FileReader: 'readonly',
  // Set on window by src/js/vendor.js and the modules themselves.
  dagre: 'readonly', City: 'readonly', Learn: 'readonly', Diagrams: 'readonly'
};

const nodeGlobals = {
  process: 'readonly', console: 'readonly', Buffer: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
  fetch: 'readonly', URL: 'readonly', WeakMap: 'readonly', localStorage: 'readonly'
};

export default [
  { ignores: ['dist/**', 'node_modules/**', 'src/data/_generated/**', '.build/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: browserGlobals },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-cond-assign': ['error', 'except-parens'],
      'no-prototype-builtins': 'off'
    }
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: nodeGlobals },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  }
];
