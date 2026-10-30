/* The twelve pattern families, in catalogue order. One table shared by all
   three products so that the pattern library (which stores the display
   `name`), the detector catalogue and the Patrol DLC packs (which store the
   short `id`) and the Edu curriculum can refer to the same family without
   string drift. Letters are the catalogue codes shown on the cards (A-01…). */

export const FAMILIES = [
  { id: 'foundations',   code: 'A', name: 'Foundations',      blurb: 'The computer-science groundwork under every pattern: recursion, cost in Big-O, and the classic data structures and algorithms.' },
  { id: 'oop',           code: 'B', name: 'OOP Basics',       blurb: 'The four ideas every object-oriented language is built on, plus the rule of thumb that keeps them healthy.' },
  { id: 'principles',    code: 'C', name: 'Principles',       blurb: 'The design rules behind the patterns: SOLID and the other habits that keep code easy to change.' },
  { id: 'creational',    code: 'D', name: 'Creational',       blurb: 'Ways to create objects without hard-wiring which class gets built, or how many.' },
  { id: 'structural',    code: 'E', name: 'Structural',       blurb: 'Ways to plug objects together: wrap them, adapt them, share them, or nest them.' },
  { id: 'behavioral',    code: 'F', name: 'Behavioral',       blurb: 'Ways for objects to talk: who calls whom, who decides, and who remembers.' },
  { id: 'functional',    code: 'G', name: 'Functional',       blurb: 'Building programs from small pure functions: passing them around, composing them, and keeping data unchanged.' },
  { id: 'concurrency',   code: 'H', name: 'Concurrency',      blurb: 'Doing several things at once without corrupting data: async code, queues, workers, actors and streams.' },
  { id: 'architecture',  code: 'I', name: 'Architecture',     blurb: 'Shapes for whole programs: how layers, services, data and events flow through an app or a game.' },
  { id: 'domain',        code: 'J', name: 'Domain & Data',    blurb: 'Modelling the business itself (Domain-Driven Design) and moving its data in and out of storage.' },
  { id: 'game',          code: 'K', name: 'Game Programming', blurb: 'Patterns from game engines for running a world many times per second.' },
  { id: 'anti-patterns', code: 'L', name: 'Anti-patterns',    blurb: 'Shapes to avoid. Each demo shows the tangled version and the repaired one side by side.' }
];

const byId = new Map(FAMILIES.map(f => [f.id, f]));
const byName = new Map(FAMILIES.map(f => [f.name, f]));

/* 'OOP Basics' → 'oop'. Accepts an id too, so callers can normalise freely. */
export function familyId(nameOrId) {
  if (byId.has(nameOrId)) return nameOrId;
  const f = byName.get(nameOrId);
  return f ? f.id : null;
}

/* 'oop' → 'OOP Basics'. Accepts a name too. */
export function familyName(idOrName) {
  if (byName.has(idOrName)) return idOrName;
  const f = byId.get(idOrName);
  return f ? f.name : null;
}

export function familyInfo(nameOrId) {
  return byId.get(nameOrId) || byName.get(nameOrId) || null;
}
