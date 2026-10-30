// TypeScript: function declaration, arrow function, class with extends, async.
export function greet(name: string): string {
  return `Hello, ${name}`;
}

const add = (a: number, b: number): number => a + b;

class Animal {
  constructor(public name: string) {}
  speak(): string { return this.name + ' makes a sound.'; }
}

class Dog extends Animal {
  speak(): string { return this.name + ' barks.'; }
  fetch(item: string): boolean { return true; }
}

const a = greet(add(1, 2).toString());
const d = new Dog('Rex');
d.speak();
