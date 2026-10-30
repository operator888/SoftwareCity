/* Thin re-export so the web product's imports and tests keep working.
   The parser itself lives in shared/parser/ (the monorepo's source of
   truth, shared by the web app, Patrol and Edu). Do not add code here. */
export * from '../../../../shared/parser/index.js';
