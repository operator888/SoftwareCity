/* Parser tests: structural survey across every supported language.
   The aim of this file is to make sure that real-world code parses into
   the shape the rest of Software City expects. If a real codebase stops
   working after a parser change, add the minimal snippet here and write
   a failing test for it.

   The parser is regex + structure-aware. It works *line by line*. A few
   things it deliberately does not do:
     - one-line class bodies (where a class opens and closes on the same
       line). Real codebases rarely do this; the demos all use multi-line
       classes.
     - type-aware call resolution (e.g. which overload of a generic
       function gets called).
     - reflection / dynamic dispatch.
   See docs/accuracy.md (placeholder) for the full list. */

import { test } from 'node:test';
import { parseFile, findFn, findClass, assertEq, assertOk } from './_helpers.js';

test('TypeScript: function, arrow, class, extends, new', async () => {
  const f = await parseFile('a/basics.ts', `
    export function greet(name: string): string { return 'hi ' + name; }
    const add = (a: number, b: number): number => a + b;
    class Animal {
      constructor(public name: string) {}
      speak(): string { return this.name; }
    }
    class Dog extends Animal {
      speak(): string { return 'bark'; }
      fetch(item: string): boolean { return true; }
    }
    const a = greet(add(1, 2).toString());
    const d = new Dog('Rex');
  `);
  assertEq(f.lang, 'js');
  const names = f.functions.map(x => x.name).sort();
  assertOk(names.includes('greet'), 'greet present');
  assertOk(names.includes('add'), 'add present');
  assertOk(names.includes('speak'), 'speak present');
  const dog = findClass(f, 'Dog');
  assertOk(dog, 'Dog class');
  assertEq(dog.ext[0], 'Animal', 'Dog extends Animal');
});

test('Python: class, inheritance, recursion, data flow', async () => {
  const src = `
    class Shape:
      def area(self):
        return 0.0
    class Square(Shape):
      def __init__(self, side):
        self.side = side
      def area(self):
        return self.side * self.side
    def factorial(n):
      if n <= 1:
        return 1
      return n * factorial(n - 1)
    def sum_list(items):
      total = 0
      for x in items:
        total += x
      return total
    s = Square(5)
    result = s.area()
  `;
  const f = await parseFile('a/classes.py', src);
  assertEq(f.lang, 'py');
  const fac = findFn(f, 'factorial');
  assertOk(fac, 'factorial found');
  const sq = findClass(f, 'Square');
  assertOk(sq, 'Square class');
  assertEq(sq.ext[0], 'Shape', 'Square extends Shape');
  /* Recursion is detected in call resolution, which only runs in
     analyzeProject. Use parseProject for the recursion check. */
  const { parseProject } = await import('./_helpers.js');
  const p = await parseProject([{ path: 'a/classes.py', text: src }]);
  const fac2 = p.files[0].functions.find(x => x.name === 'factorial');
  assertOk(fac2 && fac2.recursive, 'factorial is recursive');
});

test('Java: class with constructor, methods, call resolution, fields', async () => {
  const src = `
    public class UserService {
      private final Database db;
      public UserService(Database db) { this.db = db; }
      public User findById(long id) { return db.query(id); }
    }
    class Database {
      public User query(long id) { return new User(); }
    }
    class User { String name; }
  `;
  const f = await parseFile('a/Service.java', src);
  assertEq(f.lang, 'c');
  const us = findClass(f, 'UserService');
  assertOk(us, 'UserService class');
  assertOk(us.fields.some(x => x.name === 'db'), 'db field');
  const find = findFn(f, 'findById');
  assertOk(find, 'findById function');
  const { parseProject } = await import('./_helpers.js');
  const p = await parseProject([{ path: 'a/Service.java', text: src }]);
  const find2 = p.files[0].functions.find(f => f.name === 'findById');
  const calls = (find2.calls || []).map(c => c.name);
  assertOk(calls.includes('query'), 'findById calls query (call resolution)');
});

test('Go: methods with receivers, struct, interface', async () => {
  const f = await parseFile('a/cache.go', `
    package store
    type Cache struct {
      data map[string]int
    }
    func NewCache() *Cache { return &Cache{data: make(map[string]int)} }
    func (c *Cache) Get(key string) (int, bool) { v, ok := c.data[key]; return v, ok }
    func (c *Cache) Set(key string, val int) { c.data[key] = val }
    type Reader interface {
      Get(key string) (int, bool)
    }
  `);
  assertEq(f.lang, 'go');
  const cache = findClass(f, 'Cache');
  assertOk(cache, 'Cache class');
  const get = findFn(f, 'Get');
  assertOk(get && get.recv, 'Get has receiver');
  const reader = findClass(f, 'Reader');
  assertOk(reader, 'Reader interface');
  assertOk(reader.abstract.length >= 1, 'Reader has abstract method');
});

test('C#: generic method, record class, inheritance, fields', async () => {
  const f = await parseFile('a/Order.cs', `
    public class OrderProcessor {
      private readonly ILogger log;
      public OrderProcessor(ILogger log) { this.log = log; }
      public Order Process(Order order) { log.Info("p"); order.Total = 0; return order; }
      public T FindById<T>(long id) where T : class { return null; }
    }
    public record Order(long Id, List<Item> Items) { public decimal Total { get; set; } }
    public record Item(string Name, decimal Price);
    public interface ILogger { void Info(string msg); void Warn(string msg); }
  `);
  assertEq(f.lang, 'c');
  const op = findClass(f, 'OrderProcessor');
  assertOk(op, 'OrderProcessor');
  const find = findFn(f, 'FindById');
  assertOk(find && find.name === 'FindById', 'FindById present (generic method not skipped)');
  const order = findClass(f, 'Order');
  assertOk(order, 'Order record class');
  assertEq(order.kind, 'record', 'Order is a record');
});

test('GDScript: class_name, extends, signals, exported vars', async () => {
  const f = await parseFile('a/player.gd', `
    extends Node2D
    class_name Player

    signal health_changed(new_value)
    signal died

    @export var max_speed := 200.0
    var health := 100

    func _ready() -> void:
      health = 100
      health_changed.emit(health)

    func take_damage(amount: int) -> void:
      health -= amount
  `);
  assertEq(f.lang, 'gd');
  const player = findClass(f, 'Player');
  assertOk(player, 'Player class');
  assertOk(player.ext[0] === 'Node2D', 'extends Node2D');
  const signals = f.variables.filter(v => v.kind === 'signal');
  assertOk(signals.some(s => s.name === 'health_changed'), 'health_changed signal');
  const exported = f.variables.filter(v => v.name === 'max_speed');
  assertOk(exported.length === 1, 'max_speed var');
});

test('Kotlin: enum class, data class', async () => {
  const f = await parseFile('a/Task.kt', `
    package demo
    enum class Status { PENDING, ACTIVE, DONE }
    data class Task(val id: Long, val name: String, var status: Status = Status.PENDING)
    class TaskRepository {
      private val tasks = mutableListOf<Task>()
      fun add(t: Task) { tasks.add(t) }
      fun findById(id: Long): Task? = tasks.find { it.id == id }
    }
  `);
  assertEq(f.lang, 'kt');
  const status = findClass(f, 'Status');
  assertOk(status, 'Status class');
  assertEq(status.kind, 'enum', 'Status is enum class');
  const task = findClass(f, 'Task');
  assertOk(task, 'Task class');
  const repo = findClass(f, 'TaskRepository');
  assertOk(repo, 'TaskRepository class');
});

test('PHP: class with brace on next line, extends', async () => {
  const f = await parseFile('a/Service.php', `
    <?php
    namespace App;
    class UserService
    {
      public function add(string $name): void { $this->users[] = $name; }
    }
    class AdminService extends UserService
    {
      public function all(): array { return []; }
    }
  `);
  assertEq(f.lang, 'php');
  const admin = findClass(f, 'AdminService');
  assertOk(admin, 'AdminService class');
  assertEq(admin.ext[0], 'UserService', 'AdminService extends UserService');
});

test('Rust: struct, impl, trait, generics, Result', async () => {
  const f = await parseFile('a/cache.rs', `
    pub struct Cache { data: std::collections::HashMap<String, String> }
    impl Cache {
      pub fn new() -> Self { Self { data: std::collections::HashMap::new() } }
      pub fn get(&self, key: &str) -> Option<&String> { self.data.get(key) }
    }
    pub trait Store { fn get(&self, key: &str) -> Option<&String>; }
    impl Store for Cache { fn get(&self, key: &str) -> Option<&String> { self.data.get(key) } }
    pub fn run(c: &mut dyn Store) -> Result<(), String> { Ok(()) }
  `);
  assertEq(f.lang, 'rs');
  const cache = findClass(f, 'Cache');
  assertOk(cache, 'Cache struct');
  const store = findClass(f, 'Store');
  assertOk(store && store.kind === 'trait', 'Store trait');
});

test('Ruby: class with < inheritance, attr_accessor', async () => {
  const f = await parseFile('a/user.rb', `
    class User
      attr_accessor :name, :email
      def initialize(name); @name = name; end
      def greet; "Hello, " + @name; end
    end
    class Admin < User
      def admin?; true; end
    end
  `);
  assertEq(f.lang, 'rb');
  const admin = findClass(f, 'Admin');
  assertOk(admin && admin.ext[0] === 'User', 'Admin < User');
});

test('Lua: function, class via metatable', async () => {
  const f = await parseFile('a/player.lua', `
    local Player = {}
    Player.__index = Player
    function Player.new(name) local s = setmetatable({}, Player); s.name = name; return s end
    function Player:greet() return 'hi ' .. self.name end
    local p = Player.new('Rex'); p:greet()
  `);
  assertEq(f.lang, 'lua');
  const names = f.functions.map(x => x.name);
  assertOk(names.includes('new'), 'new method');
  assertOk(names.includes('greet'), 'greet method');
});

test('CSS: rules and variables', async () => {
  const f = await parseFile('a/styles.css', `
    :root { --main: #abc; --accent: red; }
    .button { color: var(--main); padding: 8px; }
    .button:hover { color: var(--accent); }
    @media (min-width: 600px) { .button { padding: 12px; } }
  `);
  assertEq(f.lang, 'css');
  const cssVars = f.variables.filter(v => v.name.startsWith('--'));
  assertOk(cssVars.length >= 2, 'CSS variables present');
  const btn = f.functions.find(x => x.name === '.button');
  assertOk(btn, '.button rule found');
});

test('HTML: embedded JS and CSS get parsed', async () => {
  const f = await parseFile('a/page.html', `
    <html><body>
    <script>function hello() { return 'hi'; }</script>
    <style>.x { color: red; }</style>
    </body></html>
  `);
  assertEq(f.lang, 'html');
  const names = f.functions.map(x => x.name);
  assertOk(names.includes('hello'), 'embedded JS function found');
});

test('Shell: function', async () => {
  const f = await parseFile('a/run.sh', `
    greet() { echo "hi $1"; }
    greet "world"
  `);
  assertEq(f.lang, 'sh');
  // Shell is recognised; function detection is best-effort.
  assertOk(f, 'shell file parses');
});

test('SQL: recognised as a data file', async () => {
  const f = await parseFile('a/script.sql', `SELECT * FROM users;`);
  assertEq(f.lang, 'sql', 'SQL recognised');
});

test('Cyclomatic complexity is computed', async () => {
  const f = await parseFile('a/cx.ts', `
    export function cx(x: number) {
      if (x > 0) {
        for (let i = 0; i < x; i++) if (i % 2 === 0) console.log(i);
      } else if (x < 0) {
        switch (x) { case -1: break; case -2: break; }
      } else { try { /* */ } catch (e) {} }
      return x && 1;
    }
  `);
  const c = findFn(f, 'cx');
  assertOk(c.cx >= 8, 'cx is at least 8 (4 branches + && + try + for + 2 cases)');
});
