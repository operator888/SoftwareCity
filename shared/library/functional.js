// Family: Functional. 6 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Functional"
  ],
  "patterns": [
    {
      "id": "pure-functions",
      "name": "Pure Functions and Immutability",
      "family": "Functional",
      "aka": [
        "Referential transparency",
        "Side-effect-free functions",
        "Functional core, imperative shell"
      ],
      "tagline": "Same input, same output, and nothing else in the program changes.",
      "intent": "A pure function computes its result only from its arguments and does nothing else: no changing shared variables, no printing, no reading the clock. Pair it with immutable data (build a new value instead of editing the old one) and most of your logic becomes easy to test, reuse and reason about, while the few side effects live in a thin outer shell.",
      "analogy": "A calculator is pure: 7 × 6 is 42 every time, and pressing the keys does not change anything else in the room. A vending machine is not: the same button gives you a drink or nothing, depending on what is left inside.",
      "cityShape": "Look at the data pipes. Pure functions are floors with no amber or mint pipes at all, only call pipes in and out. Impure ones are wired to roof antennas (cart, total, stats) by amber read and mint write pipes, and those tangles are where the surprises live.",
      "roles": [
        {
          "name": "Pure Function",
          "desc": "Returns a value computed only from its arguments. Same input, same output, and nothing outside it changes."
        },
        {
          "name": "Side Effect",
          "desc": "Anything a function does besides returning a value: changing a shared variable, printing, saving, emitting a signal, rolling a random number."
        },
        {
          "name": "Shared State",
          "desc": "A variable that lives outside the function (module global, object field) and can be read or changed by many functions."
        },
        {
          "name": "Immutable Update",
          "desc": "Instead of changing a value in place, build a new copy with the change, so the old version stays valid for whoever still holds it."
        },
        {
          "name": "Imperative Shell",
          "desc": "The thin outer layer that performs the side effects (I/O, state, signals, randomness) and asks pure functions for every decision."
        }
      ],
      "whenToUse": [
        "Business rules and calculations (prices, damage, tax, validation) that you want to unit-test without setting up a scene, database or server.",
        "State updates in UI stores such as Redux, where 'did anything change?' is answered by comparing object references.",
        "Code that must give the same answer on replay, undo/redo, networking rollback or caching.",
        "Any function you want to call from many places without worrying about the order of calls."
      ],
      "pitfalls": [
        "A program with no side effects does nothing useful. The goal is to push them to the edges, not to remove them.",
        "Copying big structures on every change can be slow; use structural sharing (copy only the changed path) or a library like Immer.",
        "Hidden impurity sneaks in easily: randf(), Date.now(), reading a global config or mutating an argument all break purity."
      ],
      "related": [
        "higher-order-functions",
        "closures",
        "value-object",
        "flux-store",
        "memento"
      ],
      "quiz": [
        {
          "q": "Which of these functions is pure?",
          "options": [
            "total() that adds every price in a global cart list",
            "apply_discount(amount, rate) that returns round(amount * (1 - rate), 2)",
            "roll() that returns randf() * 6",
            "save(order) that writes the order to disk and returns True"
          ],
          "answer": 1,
          "why": "apply_discount reads only its arguments and changes nothing. The others depend on or change something outside: a global, a random generator, the file system."
        },
        {
          "q": "A Redux reducer does state.push(item) and returns state. Why does the UI not update?",
          "options": [
            "push() is too slow",
            "The returned array is the same object as before, so reference comparison says nothing changed",
            "Reducers cannot handle arrays",
            "Redux only accepts strings as state"
          ],
          "answer": 1,
          "why": "combineReducers and React compare old and new state with ===. Mutating in place keeps the same reference, so the change is invisible. Return a new array instead."
        }
      ],
      "demos": [
        {
          "id": "pure-functions-py-cart",
          "title": "Shopping cart: impure vs pure",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "The same checkout is written twice. The impure version shares a global cart and total and charges 8.10 for an empty cart on the second call; the pure version only passes values around. Compare the pipes on the two buildings.",
          "roles": {
            "Pure Function": [
              "pure-functions-py-cart/pure_cart.py#cart_total",
              "pure-functions-py-cart/pure_cart.py#apply_discount"
            ],
            "Side Effect": [
              "pure-functions-py-cart/impure_cart.py#checkout",
              "pure-functions-py-cart/impure_cart.py#recalc_total"
            ],
            "Shared State": [
              "pure-functions-py-cart/impure_cart.py#cart",
              "pure-functions-py-cart/impure_cart.py#total"
            ],
            "Immutable Update": [
              "pure-functions-py-cart/pure_cart.py#with_item"
            ],
            "Imperative Shell": [
              "pure-functions-py-cart/main.py#run_pure"
            ]
          },
          "trace": [
            {
              "at": "pure-functions-py-cart/main.py#run_impure",
              "say": "First the impure way. run_impure() never passes data around; everything goes through module globals."
            },
            {
              "at": "pure-functions-py-cart/impure_cart.py#add_to_cart",
              "say": "add_to_cart() appends to the global cart, then triggers recalc_total(). Two hidden writes for one call."
            },
            {
              "at": "pure-functions-py-cart/impure_cart.py#recalc_total",
              "say": "recalc_total() reads cart and rewrites total. Its result depends on everything that ran before it."
            },
            {
              "at": "pure-functions-py-cart/impure_cart.py#checkout",
              "say": "checkout() discounts total, prints and clears cart, but forgets to reset total. Call it twice and an empty cart costs 8.10."
            },
            {
              "at": "pure-functions-py-cart/main.py#run_pure",
              "say": "Now the pure way. Values flow in and out as arguments and return values; only the print() at the end touches the world."
            },
            {
              "at": "pure-functions-py-cart/pure_cart.py#with_item",
              "say": "with_item() returns cart + [item], a brand-new list. The empty list passed in is still empty afterwards."
            },
            {
              "at": "pure-functions-py-cart/pure_cart.py#cart_total",
              "say": "cart_total() only reads its argument. No antenna, no pipes: you can test it with one line."
            },
            {
              "at": "pure-functions-py-cart/pure_cart.py#apply_discount",
              "say": "Calling apply_discount() twice with the same numbers gives the same answer. That is what 'pure' buys you."
            }
          ],
          "files": {
            "pure-functions-py-cart/impure_cart.py": "# The impure version: every function reaches outside itself.\n# Watch the roof antennas: cart and total are shared by everyone.\n\ncart = []\ntotal = 0.0\ndiscount_rate = 0.1\n\n\ndef add_to_cart(name, price):\n    cart.append({\"name\": name, \"price\": price})\n    recalc_total()\n\n\ndef recalc_total():\n    global total\n    total = 0.0\n    for item in cart:\n        total += item[\"price\"]\n\n\ndef checkout():\n    global total\n    total = total * (1 - discount_rate)\n    print(f\"Charged {total:.2f}\")\n    cart.clear()\n    return total\n",
            "pure-functions-py-cart/main.py": "from .impure_cart import add_to_cart, checkout\nfrom .pure_cart import with_item, cart_total, apply_discount\n\n\ndef run_impure():\n    add_to_cart(\"Tea\", 4.0)\n    add_to_cart(\"Cake\", 6.0)\n    checkout()          # Charged 9.00\n    checkout()          # Charged 8.10 for an EMPTY cart: hidden state leaked\n\n\ndef run_pure():\n    empty = []\n    cart = with_item(empty, \"Tea\", 4.0)\n    cart = with_item(cart, \"Cake\", 6.0)\n    due = apply_discount(cart_total(cart), 0.1)\n    print(f\"Charged {due:.2f}\")                            # the side effect lives out here\n    print(apply_discount(cart_total(cart), 0.1) == due)   # True: same input, same answer\n    print(len(empty))                                      # 0: nothing was mutated\n\n\nif __name__ == \"__main__\":\n    run_impure()\n    run_pure()\n",
            "pure-functions-py-cart/pure_cart.py": "# The pure version: arguments in, a new value out.\n# No globals, no printing, no changing what you were given.\n\n\ndef with_item(cart, name, price):\n    # Build a NEW list. The cart that was passed in stays exactly as it was.\n    return cart + [{\"name\": name, \"price\": price}]\n\n\ndef cart_total(cart):\n    return sum(item[\"price\"] for item in cart)\n\n\ndef apply_discount(amount, rate):\n    return round(amount * (1 - rate), 2)\n"
          }
        },
        {
          "id": "pure-functions-gd-combat",
          "title": "Combat rules: functional core, imperative shell",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "DamageRules holds static pure functions; the Player node is the shell that rolls dice, keeps stats and emits signals. A headless test script checks the rules with no scene at all.",
          "roles": {
            "Pure Function": [
              "pure-functions-gd-combat/damage_rules.gd#mitigated",
              "pure-functions-gd-combat/damage_rules.gd#critical"
            ],
            "Side Effect": [
              "pure-functions-gd-combat/player.gd#take_hit_legacy"
            ],
            "Shared State": [
              "pure-functions-gd-combat/player.gd#stats"
            ],
            "Immutable Update": [
              "pure-functions-gd-combat/damage_rules.gd#apply_hit"
            ],
            "Imperative Shell": [
              "pure-functions-gd-combat/player.gd#take_hit",
              "pure-functions-gd-combat/enemy.gd#_on_body_entered"
            ]
          },
          "trace": [
            {
              "at": "pure-functions-gd-combat/enemy.gd#_on_body_entered",
              "say": "An enemy touches the player and calls take_hit(). This is the event world: physics, nodes, timing."
            },
            {
              "at": "pure-functions-gd-combat/player.gd#take_hit",
              "say": "The shell rolls randf() for the crit itself. Randomness is a side effect, so it is kept out of the rules and passed in as a bool."
            },
            {
              "at": "pure-functions-gd-combat/damage_rules.gd#mitigated",
              "say": "mitigated() is pure arithmetic on its two arguments. Notice its floor has no data pipes."
            },
            {
              "at": "pure-functions-gd-combat/damage_rules.gd#critical",
              "say": "critical() doubles the amount only when told to. Given the same bool, it always answers the same."
            },
            {
              "at": "pure-functions-gd-combat/damage_rules.gd#apply_hit",
              "say": "apply_hit() duplicates the stats dictionary and changes the copy, then returns it. The caller decides what to keep."
            },
            {
              "at": "pure-functions-gd-combat/player.gd#take_hit_legacy",
              "say": "Compare the old version: rules and mutation in one place, writing stats directly. It cannot be tested without a Player node."
            },
            {
              "at": "pure-functions-gd-combat/test_damage_rules.gd#test_hit_does_not_mutate",
              "say": "The payoff: a headless test feeds numbers in and checks numbers out, and proves the original dictionary was untouched."
            }
          ],
          "files": {
            "pure-functions-gd-combat/damage_rules.gd": "class_name DamageRules\nextends RefCounted\n## Pure combat rules. No nodes, no signals, no randf(), no globals.\n## Every function only looks at its arguments and returns a new value.\n\n\nstatic func mitigated(base: int, armor: int) -> int:\n\treturn max(1, base - armor)\n\n\nstatic func critical(amount: int, is_crit: bool) -> int:\n\treturn amount * 2 if is_crit else amount\n\n\nstatic func apply_hit(stats: Dictionary, amount: int) -> Dictionary:\n\t# Copy first, then change the copy: the caller's dictionary is never touched.\n\tvar next := stats.duplicate()\n\tnext.hp = max(0, stats.hp - amount)\n\tnext.alive = next.hp > 0\n\treturn next\n",
            "pure-functions-gd-combat/enemy.gd": "extends Area2D\n\n@export var base_damage := 12\n@export var crit_chance := 0.25\n\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.has_method(\"take_hit\"):\n\t\tbody.take_hit(base_damage, crit_chance)\n",
            "pure-functions-gd-combat/player.gd": "extends CharacterBody2D\n## The imperative shell: it owns state, rolls dice and emits signals,\n## but asks the pure rules for every number.\n\nconst Rules = preload(\"res://damage_rules.gd\")\n\nsignal health_changed(hp: int)\nsignal died\n\n@export var armor := 3\nvar stats := {\"hp\": 100, \"alive\": true}\n\n\nfunc take_hit(base_damage: int, crit_chance: float) -> void:\n\tvar is_crit := randf() < crit_chance   # randomness is a side effect, so it stays here\n\tvar amount := Rules.critical(Rules.mitigated(base_damage, armor), is_crit)\n\tstats = Rules.apply_hit(stats, amount)\n\thealth_changed.emit(stats.hp)\n\tif not stats.alive:\n\t\tdied.emit()\n\n\nfunc take_hit_legacy(base_damage: int) -> void:\n\t# The old impure way: rules and mutation tangled together, hard to test.\n\tstats.hp -= max(1, base_damage - armor)\n\tif stats.hp <= 0:\n\t\tstats.alive = false\n\t\tdied.emit()\n",
            "pure-functions-gd-combat/test_damage_rules.gd": "extends SceneTree\n## Run with: godot --headless --script res://test_damage_rules.gd\n## Pure functions need no scene, no player and no luck to test.\n\nconst Rules = preload(\"res://damage_rules.gd\")\n\n\nfunc _init() -> void:\n\ttest_mitigation()\n\ttest_hit_does_not_mutate()\n\tprint(\"all damage rules pass\")\n\tquit()\n\n\nfunc test_mitigation() -> void:\n\tassert(Rules.mitigated(12, 3) == 9)\n\tassert(Rules.mitigated(2, 10) == 1)\n\tassert(Rules.critical(9, true) == 18)\n\n\nfunc test_hit_does_not_mutate() -> void:\n\tvar before := {\"hp\": 10, \"alive\": true}\n\tvar after := Rules.apply_hit(before, 25)\n\tassert(after.hp == 0 and not after.alive)\n\tassert(before.hp == 10)   # the original is unchanged\n"
          }
        },
        {
          "id": "pure-functions-redux-real",
          "title": "Redux combineReducers: purity by reference",
          "lang": "TypeScript",
          "level": "advanced",
          "source": {
            "repo": "reduxjs/redux",
            "url": "https://github.com/reduxjs/redux/blob/v5.0.1/src/combineReducers.ts",
            "license": "MIT",
            "note": "redux/combineReducers.ts is from Redux v5.0.1, verbatim except two marked cuts (a dev-only warning helper and a type-only overload). reducers.ts and usage.ts were written for Software City."
          },
          "story": "Redux relies on reducers being pure and never mutating. combineReducers runs each slice reducer and decides whether anything changed with a plain !== check, which only works because updates return new objects.",
          "roles": {
            "Pure Function": [
              "pure-functions-redux-real/reducers.ts#todos",
              "pure-functions-redux-real/reducers.ts#visibility"
            ],
            "Side Effect": [
              "pure-functions-redux-real/reducers.ts#brokenTodos"
            ],
            "Immutable Update": [
              "pure-functions-redux-real/reducers.ts#todos"
            ],
            "Imperative Shell": [
              "pure-functions-redux-real/usage.ts#run"
            ]
          },
          "trace": [
            {
              "at": "pure-functions-redux-real/usage.ts#run",
              "say": "run() combines two slice reducers into one root reducer and feeds it a few actions."
            },
            {
              "at": "pure-functions-redux-real/redux/combineReducers.ts#combineReducers",
              "say": "combineReducers() keeps only the function values, then returns a new reducer that runs each slice and builds nextState."
            },
            {
              "at": "pure-functions-redux-real/redux/combineReducers.ts#assertReducerShape",
              "say": "It even calls each reducer with undefined state up front. That is only safe because a pure reducer has no side effects to trigger."
            },
            {
              "at": "pure-functions-redux-real/reducers.ts#todos",
              "say": "todos() returns [...state, newTodo] or state.map(...). New arrays for changes, the very same array when nothing changed."
            },
            {
              "at": "pure-functions-redux-real/reducers.ts#visibility",
              "say": "visibility() is a one-line pure function. For any action it does not know, it hands back the old value untouched."
            },
            {
              "at": "pure-functions-redux-real/usage.ts#runBroken",
              "say": "runBroken() uses a reducer that push()es into the old array. The data changes, but after === before, so subscribers never re-render."
            },
            {
              "at": "pure-functions-redux-real/reducers.ts#brokenTodos",
              "say": "The culprit: mutating the argument is a side effect. hasChanged stays false because the reference never moved."
            }
          ],
          "files": {
            "pure-functions-redux-real/reducers.ts": "// Written for Software City (not part of Redux): two pure reducers and one impure one.\n// A reducer is (state, action) => nextState. It must not change state in place.\n\nexport type Todo = { id: number; text: string; done: boolean }\nexport type Action = { type: string; [extra: string]: any }\n\nexport function todos(state: Todo[] = [], action: Action): Todo[] {\n  switch (action.type) {\n    case 'todo/added':\n      return [...state, { id: state.length + 1, text: action.text, done: false }]\n    case 'todo/toggled':\n      return state.map(t => (t.id === action.id ? { ...t, done: !t.done } : t))\n    default:\n      return state\n  }\n}\n\nexport function visibility(state = 'all', action: Action): string {\n  return action.type === 'filter/set' ? action.value : state\n}\n\n// The bug every Redux beginner writes once: push() changes the old array.\nexport function brokenTodos(state: Todo[] = [], action: Action): Todo[] {\n  if (action.type === 'todo/added') {\n    state.push({ id: state.length + 1, text: action.text, done: false })\n  }\n  return state\n}\n",
            "pure-functions-redux-real/redux/combineReducers.ts": "/*\n * Source: Redux v5.0.1 — https://github.com/reduxjs/redux/blob/v5.0.1/src/combineReducers.ts\n * MIT License, Copyright (c) 2015-present Dan Abramov. Included for study.\n */\nimport { Action } from './types/actions'\nimport {\n  ActionFromReducersMapObject,\n  PreloadedStateShapeFromReducersMapObject,\n  Reducer,\n  StateFromReducersMapObject\n} from './types/reducers'\n\nimport ActionTypes from './utils/actionTypes'\nimport isPlainObject from './utils/isPlainObject'\nimport warning from './utils/warning'\nimport { kindOf } from './utils/kindOf'\n\n// … trimmed: getUnexpectedStateShapeWarningMessage(), 47 lines of dev-only warning text not related to the pattern …\n\nfunction assertReducerShape(reducers: {\n  [key: string]: Reducer<any, any, any>\n}) {\n  Object.keys(reducers).forEach(key => {\n    const reducer = reducers[key]\n    const initialState = reducer(undefined, { type: ActionTypes.INIT })\n\n    if (typeof initialState === 'undefined') {\n      throw new Error(\n        `The slice reducer for key \"${key}\" returned undefined during initialization. ` +\n          `If the state passed to the reducer is undefined, you must ` +\n          `explicitly return the initial state. The initial state may ` +\n          `not be undefined. If you don't want to set a value for this reducer, ` +\n          `you can use null instead of undefined.`\n      )\n    }\n\n    if (\n      typeof reducer(undefined, {\n        type: ActionTypes.PROBE_UNKNOWN_ACTION()\n      }) === 'undefined'\n    ) {\n      throw new Error(\n        `The slice reducer for key \"${key}\" returned undefined when probed with a random type. ` +\n          `Don't try to handle '${ActionTypes.INIT}' or other actions in \"redux/*\" ` +\n          `namespace. They are considered private. Instead, you must return the ` +\n          `current state for any unknown actions, unless it is undefined, ` +\n          `in which case you must return the initial state, regardless of the ` +\n          `action type. The initial state may not be undefined, but can be null.`\n      )\n    }\n  })\n}\n\n/**\n * Turns an object whose values are different reducer functions, into a single\n * reducer function. It will call every child reducer, and gather their results\n * into a single state object, whose keys correspond to the keys of the passed\n * reducer functions.\n *\n * @template S Combined state object type.\n *\n * @param reducers An object whose values correspond to different reducer\n *   functions that need to be combined into one. One handy way to obtain it\n *   is to use `import * as reducers` syntax. The reducers may never\n *   return undefined for any action. Instead, they should return their\n *   initial state if the state passed to them was undefined, and the current\n *   state for any unrecognized action.\n *\n * @returns A reducer function that invokes every reducer inside the passed\n *   object, and builds a state object with the same shape.\n */\n// … trimmed: the 9-line generic TypeScript overload signature of combineReducers; the implementation follows …\nexport default function combineReducers(reducers: {\n  [key: string]: Reducer<any, any, any>\n}) {\n  const reducerKeys = Object.keys(reducers)\n  const finalReducers: { [key: string]: Reducer<any, any, any> } = {}\n  for (let i = 0; i < reducerKeys.length; i++) {\n    const key = reducerKeys[i]\n\n    if (process.env.NODE_ENV !== 'production') {\n      if (typeof reducers[key] === 'undefined') {\n        warning(`No reducer provided for key \"${key}\"`)\n      }\n    }\n\n    if (typeof reducers[key] === 'function') {\n      finalReducers[key] = reducers[key]\n    }\n  }\n  const finalReducerKeys = Object.keys(finalReducers)\n\n  // This is used to make sure we don't warn about the same\n  // keys multiple times.\n  let unexpectedKeyCache: { [key: string]: true }\n  if (process.env.NODE_ENV !== 'production') {\n    unexpectedKeyCache = {}\n  }\n\n  let shapeAssertionError: unknown\n  try {\n    assertReducerShape(finalReducers)\n  } catch (e) {\n    shapeAssertionError = e\n  }\n\n  return function combination(\n    state: StateFromReducersMapObject<typeof reducers> = {},\n    action: Action\n  ) {\n    if (shapeAssertionError) {\n      throw shapeAssertionError\n    }\n\n    if (process.env.NODE_ENV !== 'production') {\n      const warningMessage = getUnexpectedStateShapeWarningMessage(\n        state,\n        finalReducers,\n        action,\n        unexpectedKeyCache\n      )\n      if (warningMessage) {\n        warning(warningMessage)\n      }\n    }\n\n    let hasChanged = false\n    const nextState: StateFromReducersMapObject<typeof reducers> = {}\n    for (let i = 0; i < finalReducerKeys.length; i++) {\n      const key = finalReducerKeys[i]\n      const reducer = finalReducers[key]\n      const previousStateForKey = state[key]\n      const nextStateForKey = reducer(previousStateForKey, action)\n      if (typeof nextStateForKey === 'undefined') {\n        const actionType = action && action.type\n        throw new Error(\n          `When called with an action of type ${\n            actionType ? `\"${String(actionType)}\"` : '(unknown type)'\n          }, the slice reducer for key \"${key}\" returned undefined. ` +\n            `To ignore an action, you must explicitly return the previous state. ` +\n            `If you want this reducer to hold no value, you can return null instead of undefined.`\n        )\n      }\n      nextState[key] = nextStateForKey\n      hasChanged = hasChanged || nextStateForKey !== previousStateForKey\n    }\n    hasChanged =\n      hasChanged || finalReducerKeys.length !== Object.keys(state).length\n    return hasChanged ? nextState : state\n  }\n}\n",
            "pure-functions-redux-real/usage.ts": "// Example usage written for Software City (not part of Redux).\nimport combineReducers from './redux/combineReducers'\nimport { todos, visibility, brokenTodos } from './reducers'\n\nexport function run(): void {\n  const root = combineReducers({ todos, visibility })\n  const s0 = root(undefined, { type: '@@app/init' })\n  const s1 = root(s0, { type: 'todo/added', text: 'Learn pure functions' })\n  const s2 = root(s1, { type: 'filter/set', value: 'open' })\n  const s3 = root(s2, { type: 'something/else' })\n  console.log(s0.todos.length, s1.todos.length) // 0 1: s0 is still the old state\n  console.log(s2.todos === s1.todos)            // true: unchanged slices are shared, not copied\n  console.log(s3 === s2)                        // true: nothing changed, same object comes back\n}\n\nexport function runBroken(): void {\n  const root = combineReducers({ todos: brokenTodos })\n  const before = root(undefined, { type: '@@app/init' })\n  const after = root(before, { type: 'todo/added', text: 'Mutate me' })\n  console.log(after === before) // true: the change happened, but nobody can tell, so the UI never re-renders\n}\n"
          }
        }
      ]
    },
    {
      "id": "higher-order-functions",
      "name": "Higher-Order Functions",
      "family": "Functional",
      "aka": [
        "map / filter / reduce",
        "Callbacks",
        "Functions as values",
        "Decorators"
      ],
      "tagline": "Functions that take other functions as arguments or return new ones.",
      "intent": "Treat functions as ordinary values you can pass in, store and return. A higher-order function owns the repeated mechanics (the loop, the timing, the sorting) and takes the changing part as a function argument, so one helper like map, filter or reduce serves hundreds of different jobs.",
      "analogy": "A food processor is a higher-order machine: the motor and bowl stay the same, and you clip in a blade, a grater or a whisk depending on the job. The blade does the cutting; the machine just spins it.",
      "cityShape": "Look for a short, generic building (listTools, Inventory, functools) whose floors are called from many places but call nothing by name, because the function they run arrives as an argument. The small callback floors (isPassing, is_rare, toLabel) sit in a separate building with no data pipes: they answer one question about one item.",
      "roles": [
        {
          "name": "Higher-Order Function",
          "desc": "Takes a function as an argument (map, filter, reduce, sort with a key) and uses it inside its own loop or logic."
        },
        {
          "name": "Callback",
          "desc": "The small function passed in. It handles one item or one pair and knows nothing about the loop around it."
        },
        {
          "name": "Function Factory",
          "desc": "A function that returns a new function, often pre-configured with a value (atLeast(80), usable_at(level), wraps(f))."
        },
        {
          "name": "Client",
          "desc": "Chooses which callbacks to plug into which higher-order functions."
        }
      ],
      "whenToUse": [
        "You keep writing the same loop with a different line in the middle: extract the loop, pass in the line.",
        "Transforming, selecting or summarising collections (map, filter, reduce, sort by key).",
        "Wrapping behaviour around many functions at once: timing, logging, caching, retry (decorators).",
        "Letting callers customise a library without subclassing, as Godot does with Callables in sort_custom and signals."
      ],
      "pitfalls": [
        "Long chains of anonymous lambdas get unreadable; give the callbacks names so stack traces and the city show them.",
        "A callback with side effects (changing a global inside map) brings back all the problems of impure code.",
        "Wrapping a function hides its name and docs unless you copy them over, which is exactly why functools.wraps exists."
      ],
      "related": [
        "pure-functions",
        "closures",
        "currying-composition",
        "strategy",
        "iterator"
      ],
      "quiz": [
        {
          "q": "What does students.filter(atLeast(80)) pass to filter?",
          "options": [
            "The number 80",
            "The result true or false",
            "A new function, created by atLeast, that checks one student",
            "The whole students list"
          ],
          "answer": 2,
          "why": "atLeast(80) runs first and returns a function. filter then calls that function once per student."
        },
        {
          "q": "Why does a decorator such as timed() usually call functools.wraps?",
          "options": [
            "To make the function run faster",
            "To copy the original function's name, docstring and other metadata onto the wrapper",
            "To catch exceptions",
            "Because Python requires it for every inner function"
          ],
          "answer": 1,
          "why": "Without wraps the decorated function would be named 'wrapper'. update_wrapper copies __name__, __doc__ and more, and records __wrapped__."
        }
      ],
      "demos": [
        {
          "id": "higher-order-functions-js-grades",
          "title": "Grading students with map, filter and reduce",
          "lang": "JavaScript",
          "level": "beginner",
          "source": null,
          "story": "listTools.js re-implements map, filter and reduce with plain loops so you can see what the built-ins do. rules.js holds tiny callbacks and one factory, atLeast(min), that manufactures a filter.",
          "roles": {
            "Higher-Order Function": [
              "higher-order-functions-js-grades/listTools.js#myMap",
              "higher-order-functions-js-grades/listTools.js#myFilter",
              "higher-order-functions-js-grades/listTools.js#myReduce"
            ],
            "Callback": [
              "higher-order-functions-js-grades/rules.js#isPassing",
              "higher-order-functions-js-grades/rules.js#toLabel",
              "higher-order-functions-js-grades/rules.js#addScore"
            ],
            "Function Factory": [
              "higher-order-functions-js-grades/rules.js#atLeast"
            ],
            "Client": [
              "higher-order-functions-js-grades/main.js#report",
              "higher-order-functions-js-grades/main.js#honours"
            ]
          },
          "trace": [
            {
              "at": "higher-order-functions-js-grades/main.js#report",
              "say": "report() never writes a loop. It hands each job a list plus the function that does the item-level work."
            },
            {
              "at": "higher-order-functions-js-grades/listTools.js#myFilter",
              "say": "myFilter() owns the loop and the output list. It calls keep(item) without knowing what keep checks."
            },
            {
              "at": "higher-order-functions-js-grades/rules.js#isPassing",
              "say": "isPassing is the callback: one student in, true or false out. It has no idea it is inside a loop."
            },
            {
              "at": "higher-order-functions-js-grades/listTools.js#myMap",
              "say": "myMap() turns each passing student into a label by calling toLabel. Same loop shape, different job."
            },
            {
              "at": "higher-order-functions-js-grades/listTools.js#myReduce",
              "say": "myReduce() folds the list into one number. addScore(sum, student) is called once per item, carrying the running total."
            },
            {
              "at": "higher-order-functions-js-grades/main.js#honours",
              "say": "honours() uses the built-in filter and map. They behave exactly like the home-made ones."
            },
            {
              "at": "higher-order-functions-js-grades/rules.js#atLeast",
              "say": "atLeast(80) is a factory: it returns a new function with 80 baked in, ready to hand to filter."
            }
          ],
          "files": {
            "higher-order-functions-js-grades/listTools.js": "// Home-made map, filter and reduce. Each one takes a FUNCTION as an argument\n// and calls it for every item. The loop is written once; the behaviour is passed in.\n\nexport function myMap(list, transform) {\n  const out = [];\n  for (const item of list) {\n    out.push(transform(item));\n  }\n  return out;\n}\n\nexport function myFilter(list, keep) {\n  const out = [];\n  for (const item of list) {\n    if (keep(item)) {\n      out.push(item);\n    }\n  }\n  return out;\n}\n\nexport function myReduce(list, combine, start) {\n  let acc = start;\n  for (const item of list) {\n    acc = combine(acc, item);\n  }\n  return acc;\n}\n",
            "higher-order-functions-js-grades/main.js": "import { myMap, myFilter, myReduce } from './listTools.js';\nimport { isPassing, toLabel, addScore, atLeast } from './rules.js';\n\nconst students = [\n  { name: 'Ana', score: 91 },\n  { name: 'Ben', score: 47 },\n  { name: 'Chloe', score: 68 },\n  { name: 'Dev', score: 83 },\n];\n\nfunction report() {\n  const passed = myFilter(students, isPassing);\n  const labels = myMap(passed, toLabel);\n  const total = myReduce(students, addScore, 0);\n  console.log('Passed:', labels.join(', '));\n  console.log('Average:', total / students.length);\n}\n\nfunction honours() {\n  // The built-in array methods work exactly the same way.\n  const top = students.filter(atLeast(80)).map(toLabel);\n  console.log('Honours:', top.join(', '));\n}\n\nreport();\nhonours();\n",
            "higher-order-functions-js-grades/rules.js": "// Small callbacks. None of them knows about lists or loops.\n\nexport function isPassing(student) {\n  return student.score >= 50;\n}\n\nexport function toLabel(student) {\n  return `${student.name} (${student.score})`;\n}\n\nexport function addScore(sum, student) {\n  return sum + student.score;\n}\n\n// A function that RETURNS a function: a ready-made filter for any threshold.\nexport function atLeast(min) {\n  return function (student) {\n    return student.score >= min;\n  };\n}\n"
          }
        },
        {
          "id": "higher-order-functions-gd-loot",
          "title": "Loot screen with Godot Callables",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "The Inventory node offers generic helpers that take a Callable; LootRules supplies the questions (is_rare, gold_value, more_valuable). In Godot 4, writing rules.is_rare without parentheses gives you a Callable you can pass around.",
          "roles": {
            "Higher-Order Function": [
              "higher-order-functions-gd-loot/inventory.gd#items_where",
              "higher-order-functions-gd-loot/inventory.gd#total_by",
              "higher-order-functions-gd-loot/inventory.gd#sorted_by",
              "higher-order-functions-gd-loot/inventory.gd#for_each"
            ],
            "Callback": [
              "higher-order-functions-gd-loot/loot_rules.gd#is_rare",
              "higher-order-functions-gd-loot/loot_rules.gd#gold_value",
              "higher-order-functions-gd-loot/loot_rules.gd#more_valuable",
              "higher-order-functions-gd-loot/loot_screen.gd#_add_row"
            ],
            "Function Factory": [
              "higher-order-functions-gd-loot/loot_rules.gd#usable_at"
            ],
            "Client": [
              "higher-order-functions-gd-loot/loot_screen.gd#show_summary"
            ]
          },
          "trace": [
            {
              "at": "higher-order-functions-gd-loot/loot_screen.gd#_ready",
              "say": "The screen fills the inventory, then asks for a summary and a row per item. It decides which functions go where."
            },
            {
              "at": "higher-order-functions-gd-loot/loot_screen.gd#show_summary",
              "say": "Four questions, four helpers. Each call passes a Callable such as rules.is_rare, with no parentheses, so it is not run yet."
            },
            {
              "at": "higher-order-functions-gd-loot/inventory.gd#items_where",
              "say": "items_where() forwards the predicate to Array.filter(). The inventory never needs a 'rare_items' method."
            },
            {
              "at": "higher-order-functions-gd-loot/loot_rules.gd#usable_at",
              "say": "usable_at(7) returns a lambda that remembers hero_level, a function built on demand for this hero."
            },
            {
              "at": "higher-order-functions-gd-loot/inventory.gd#total_by",
              "say": "total_by() maps every item through value_of, then reduces the numbers to one sum. Pass a different function, get a different total."
            },
            {
              "at": "higher-order-functions-gd-loot/loot_rules.gd#gold_value",
              "say": "gold_value is the callback map() runs per item: value times stack size. Notice it is reused by more_valuable too."
            },
            {
              "at": "higher-order-functions-gd-loot/inventory.gd#sorted_by",
              "say": "sorted_by() copies the array and hands comes_first to sort_custom, Godot's own higher-order sort."
            },
            {
              "at": "higher-order-functions-gd-loot/inventory.gd#for_each",
              "say": "for_each() calls action.call(item) for each entry. The screen passed _add_row, so the UI fills itself."
            }
          ],
          "files": {
            "higher-order-functions-gd-loot/inventory.gd": "class_name Inventory\nextends Node\n## Generic helpers that take a Callable. The inventory never decides\n## WHAT to look for; the caller passes that in as a function.\n\nvar items: Array = []\n\n\nfunc items_where(predicate: Callable) -> Array:\n\treturn items.filter(predicate)\n\n\nfunc total_by(value_of: Callable) -> int:\n\treturn items.map(value_of).reduce(func(acc, v): return acc + v, 0)\n\n\nfunc sorted_by(comes_first: Callable) -> Array:\n\tvar copy := items.duplicate()\n\tcopy.sort_custom(comes_first)\n\treturn copy\n\n\nfunc for_each(action: Callable) -> void:\n\tfor item in items:\n\t\taction.call(item)\n",
            "higher-order-functions-gd-loot/loot_rules.gd": "class_name LootRules\nextends RefCounted\n## Plain functions that answer one question about one item.\n## They are passed around as Callables: rules.is_rare (no parentheses).\n\n\nfunc is_rare(item: Dictionary) -> bool:\n\treturn item.rarity >= 3\n\n\nfunc gold_value(item: Dictionary) -> int:\n\treturn item.value * item.get(\"stack\", 1)\n\n\nfunc more_valuable(a: Dictionary, b: Dictionary) -> bool:\n\treturn gold_value(a) > gold_value(b)\n\n\n# A function that BUILDS a predicate: \"usable by a hero of this level\".\nfunc usable_at(hero_level: int) -> Callable:\n\treturn func(item: Dictionary) -> bool: return item.level <= hero_level\n",
            "higher-order-functions-gd-loot/loot_screen.gd": "extends Control\n## The client: picks which functions to plug into the inventory helpers.\n\n@export var hero_level := 7\n@onready var inventory: Inventory = $Inventory\n@onready var list: ItemList = $List\nvar rules := LootRules.new()\n\n\nfunc _ready() -> void:\n\tinventory.items = [\n\t\t{\"name\": \"Rusty Sword\", \"rarity\": 1, \"level\": 1, \"value\": 3},\n\t\t{\"name\": \"Phoenix Feather\", \"rarity\": 4, \"level\": 12, \"value\": 250},\n\t\t{\"name\": \"Healing Potion\", \"rarity\": 2, \"level\": 1, \"value\": 10, \"stack\": 5},\n\t\t{\"name\": \"Moonblade\", \"rarity\": 3, \"level\": 6, \"value\": 120},\n\t]\n\tshow_summary()\n\tinventory.for_each(_add_row)\n\n\nfunc show_summary() -> void:\n\tvar rare := inventory.items_where(rules.is_rare)\n\tvar usable := inventory.items_where(rules.usable_at(hero_level))\n\tvar best: Dictionary = inventory.sorted_by(rules.more_valuable)[0]\n\tprint(\"%d rare, %d usable now, best: %s\" % [rare.size(), usable.size(), best.name])\n\tprint(\"Sell all for %d gold\" % inventory.total_by(rules.gold_value))\n\n\nfunc _add_row(item: Dictionary) -> void:\n\tlist.add_item(\"%s  (%d g)\" % [item.name, rules.gold_value(item)])\n"
          }
        },
        {
          "id": "higher-order-functions-functools-real",
          "title": "Python functools: wraps, reduce, cmp_to_key",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.13.0/Lib/functools.py",
            "license": "PSF-2.0",
            "note": "functools/functools.py is an excerpt of CPython v3.13.0 Lib/functools.py, verbatim with marked cuts. These are the pure-Python fallbacks; CPython normally swaps in C versions from _functools. usage.py was written for Software City."
          },
          "story": "The standard library's toolbox for functions. reduce takes a function, cmp_to_key turns a function into a class, partial and wraps return new callables, and a decorator built on wraps ties them together.",
          "roles": {
            "Higher-Order Function": [
              "higher-order-functions-functools-real/functools/functools.py#reduce",
              "higher-order-functions-functools-real/functools/functools.py#update_wrapper",
              "higher-order-functions-functools-real/usage.py#timed"
            ],
            "Callback": [
              "higher-order-functions-functools-real/usage.py#by_length_then_alpha"
            ],
            "Function Factory": [
              "higher-order-functions-functools-real/functools/functools.py#wraps",
              "higher-order-functions-functools-real/functools/functools.py#cmp_to_key",
              "higher-order-functions-functools-real/functools/functools.py#partial"
            ],
            "Client": [
              "higher-order-functions-functools-real/usage.py#main",
              "higher-order-functions-functools-real/usage.py#word_report"
            ]
          },
          "trace": [
            {
              "at": "higher-order-functions-functools-real/usage.py#timed",
              "say": "timed() is a decorator: it receives word_report and returns wrapper, a new function that measures and then calls the original."
            },
            {
              "at": "higher-order-functions-functools-real/functools/functools.py#wraps",
              "say": "wraps(func) is a factory. It returns partial(update_wrapper, wrapped=func), a function waiting for the wrapper."
            },
            {
              "at": "higher-order-functions-functools-real/functools/functools.py#update_wrapper",
              "say": "update_wrapper() copies __name__, __doc__ and friends onto the wrapper and sets __wrapped__, so tools still see the original."
            },
            {
              "at": "higher-order-functions-functools-real/usage.py#word_report",
              "say": "Inside the report, sorted() takes a key function and reduce() takes a lambda. Two more functions passed as values."
            },
            {
              "at": "higher-order-functions-functools-real/functools/functools.py#cmp_to_key",
              "say": "cmp_to_key() wraps an old two-argument compare function in a class whose < and > call it. A function in, a key maker out."
            },
            {
              "at": "higher-order-functions-functools-real/functools/functools.py#reduce",
              "say": "reduce() keeps one running value and calls function(value, element) for each item. That loop is the whole idea of folding."
            },
            {
              "at": "higher-order-functions-functools-real/functools/functools.py#partial.__call__",
              "say": "partial.__call__ merges the stored arguments with new ones and calls the wrapped function: a function saved with some inputs filled in."
            }
          ],
          "files": {
            "higher-order-functions-functools-real/functools/functools.py": "# Source: CPython v3.13.0 Lib/functools.py — https://github.com/python/cpython/blob/v3.13.0/Lib/functools.py\n# PSF License (Python Software Foundation License Version 2), Copyright (c) 2001-2024 Python Software Foundation. Included for study.\n\"\"\"functools.py - Tools for working with functions and callable objects\n\"\"\"\n# Python module wrapper for _functools C module\n# to allow utilities written in Python to be added\n# to the functools module.\n# Written by Nick Coghlan <ncoghlan at gmail.com>,\n# Raymond Hettinger <python at rcn.com>,\n# and Łukasz Langa <lukasz at langa.pl>.\n#   Copyright (C) 2006-2013 Python Software Foundation.\n# See C source code for _functools credits/copyright\n\n__all__ = ['update_wrapper', 'wraps', 'WRAPPER_ASSIGNMENTS', 'WRAPPER_UPDATES',\n           'total_ordering', 'cache', 'cmp_to_key', 'lru_cache', 'reduce',\n           'partial', 'partialmethod', 'singledispatch', 'singledispatchmethod',\n           'cached_property']\n\nfrom abc import get_cache_token\nfrom collections import namedtuple\n# import types, weakref  # Deferred to single_dispatch()\nfrom reprlib import recursive_repr\nfrom _thread import RLock\n\n# Avoid importing types, so we can speedup import time\nGenericAlias = type(list[int])\n\n################################################################################\n### update_wrapper() and wraps() decorator\n################################################################################\n\n# update_wrapper() and wraps() are tools to help write\n# wrapper functions that can handle naive introspection\n\nWRAPPER_ASSIGNMENTS = ('__module__', '__name__', '__qualname__', '__doc__',\n                       '__annotations__', '__type_params__')\nWRAPPER_UPDATES = ('__dict__',)\ndef update_wrapper(wrapper,\n                   wrapped,\n                   assigned = WRAPPER_ASSIGNMENTS,\n                   updated = WRAPPER_UPDATES):\n    \"\"\"Update a wrapper function to look like the wrapped function\n\n       wrapper is the function to be updated\n       wrapped is the original function\n       assigned is a tuple naming the attributes assigned directly\n       from the wrapped function to the wrapper function (defaults to\n       functools.WRAPPER_ASSIGNMENTS)\n       updated is a tuple naming the attributes of the wrapper that\n       are updated with the corresponding attribute from the wrapped\n       function (defaults to functools.WRAPPER_UPDATES)\n    \"\"\"\n    for attr in assigned:\n        try:\n            value = getattr(wrapped, attr)\n        except AttributeError:\n            pass\n        else:\n            setattr(wrapper, attr, value)\n    for attr in updated:\n        getattr(wrapper, attr).update(getattr(wrapped, attr, {}))\n    # Issue #17482: set __wrapped__ last so we don't inadvertently copy it\n    # from the wrapped function when updating __dict__\n    wrapper.__wrapped__ = wrapped\n    # Return the wrapper so this can be used as a decorator via partial()\n    return wrapper\n\ndef wraps(wrapped,\n          assigned = WRAPPER_ASSIGNMENTS,\n          updated = WRAPPER_UPDATES):\n    \"\"\"Decorator factory to apply update_wrapper() to a wrapper function\n\n       Returns a decorator that invokes update_wrapper() with the decorated\n       function as the wrapper argument and the arguments to wraps() as the\n       remaining arguments. Default arguments are as for update_wrapper().\n       This is a convenience function to simplify applying partial() to\n       update_wrapper().\n    \"\"\"\n    return partial(update_wrapper, wrapped=wrapped,\n                   assigned=assigned, updated=updated)\n\n\n# … trimmed: total_ordering() and its twelve comparison helpers, 120 lines not related to the pattern …\n\n################################################################################\n### cmp_to_key() function converter\n################################################################################\n\ndef cmp_to_key(mycmp):\n    \"\"\"Convert a cmp= function into a key= function\"\"\"\n    class K(object):\n        __slots__ = ['obj']\n        def __init__(self, obj):\n            self.obj = obj\n        def __lt__(self, other):\n            return mycmp(self.obj, other.obj) < 0\n        def __gt__(self, other):\n            return mycmp(self.obj, other.obj) > 0\n        def __eq__(self, other):\n            return mycmp(self.obj, other.obj) == 0\n        def __le__(self, other):\n            return mycmp(self.obj, other.obj) <= 0\n        def __ge__(self, other):\n            return mycmp(self.obj, other.obj) >= 0\n        __hash__ = None\n    return K\n\ntry:\n    from _functools import cmp_to_key\nexcept ImportError:\n    pass\n\n\n################################################################################\n### reduce() sequence to a single item\n################################################################################\n\n_initial_missing = object()\n\ndef reduce(function, sequence, initial=_initial_missing):\n    \"\"\"\n    reduce(function, iterable[, initial], /) -> value\n\n    Apply a function of two arguments cumulatively to the items of a sequence\n    or iterable, from left to right, so as to reduce the iterable to a single\n    value.  For example, reduce(lambda x, y: x+y, [1, 2, 3, 4, 5]) calculates\n    ((((1+2)+3)+4)+5).  If initial is present, it is placed before the items\n    of the iterable in the calculation, and serves as a default when the\n    iterable is empty.\n    \"\"\"\n\n    it = iter(sequence)\n\n    if initial is _initial_missing:\n        try:\n            value = next(it)\n        except StopIteration:\n            raise TypeError(\n                \"reduce() of empty iterable with no initial value\") from None\n    else:\n        value = initial\n\n    for element in it:\n        value = function(value, element)\n\n    return value\n\ntry:\n    from _functools import reduce\nexcept ImportError:\n    pass\n\n\n################################################################################\n### partial() argument application\n################################################################################\n\n# Purely functional, no descriptor behaviour\nclass partial:\n    \"\"\"New function with partial application of the given arguments\n    and keywords.\n    \"\"\"\n\n    __slots__ = \"func\", \"args\", \"keywords\", \"__dict__\", \"__weakref__\"\n\n    def __new__(cls, func, /, *args, **keywords):\n        if not callable(func):\n            raise TypeError(\"the first argument must be callable\")\n\n        if isinstance(func, partial):\n            args = func.args + args\n            keywords = {**func.keywords, **keywords}\n            func = func.func\n\n        self = super(partial, cls).__new__(cls)\n\n        self.func = func\n        self.args = args\n        self.keywords = keywords\n        return self\n\n    def __call__(self, /, *args, **keywords):\n        keywords = {**self.keywords, **keywords}\n        return self.func(*self.args, *args, **keywords)\n\n    # … trimmed: __repr__, __get__, __reduce__ and __setstate__ (pickling and printing support), 47 lines …\n\ntry:\n    from _functools import partial\nexcept ImportError:\n    pass\n\n# … trimmed: partialmethod, lru_cache, singledispatch and cached_property, about 690 lines …\n",
            "higher-order-functions-functools-real/usage.py": "# Example usage written for Software City (not part of CPython).\n# Every helper below takes a function, returns a function, or both.\nimport time\nfrom .functools.functools import wraps, reduce, cmp_to_key, partial\n\n\ndef timed(func):\n    # A decorator is a higher-order function: function in, new function out.\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        print(f\"{func.__name__} took {time.perf_counter() - start:.4f}s\")\n        return result\n    return wrapper\n\n\ndef by_length_then_alpha(a, b):\n    # An old-style comparison function: negative, zero or positive.\n    if len(a) != len(b):\n        return len(a) - len(b)\n    return (a > b) - (a < b)\n\n\n@timed\ndef word_report(words):\n    longest_first = sorted(words, key=cmp_to_key(by_length_then_alpha), reverse=True)\n    total_letters = reduce(lambda acc, w: acc + len(w), words, 0)\n    return longest_first[0], total_letters\n\n\ndef main():\n    print(word_report([\"map\", \"filter\", \"reduce\", \"wraps\"]))\n    print(word_report.__name__)            # 'word_report', thanks to wraps()\n    shout = partial(str.upper)\n    print(list(map(shout, [\"hi\", \"there\"])))\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        }
      ]
    },
    {
      "id": "closures",
      "name": "Closures",
      "family": "Functional",
      "aka": [
        "Lexical closures",
        "Captured variables",
        "Function factories"
      ],
      "tagline": "An inner function that remembers the variables around it after its creator has returned.",
      "intent": "When a function is created inside another function, it keeps access to the outer function's variables for as long as it lives. That lets you build small functions with private, remembered state (a counter, a cache, a timer, a configured greeting) without a class and without a global variable.",
      "analogy": "A backpack: a hiker (the inner function) leaves the house (the outer function) carrying a few things packed at home. The house can be locked up, but whatever is in the backpack goes everywhere the hiker goes, and nobody else can reach into it.",
      "cityShape": "The factory floor (make_counter, debounce, memoize) holds a nested floor for the function it returns. Compare the roofs: the global counter has an antenna wired to click() and reset() by amber and mint pipes, while the closure's count has no antenna at all, because captured state is private to the closure and invisible to the rest of the city.",
      "roles": [
        {
          "name": "Enclosing Function",
          "desc": "The outer function. It declares the variables, defines the inner function and returns it."
        },
        {
          "name": "Closure",
          "desc": "The inner function that is returned. It still reads and writes the outer variables each time it is called."
        },
        {
          "name": "Captured Variable",
          "desc": "State that lives in the enclosing scope (count, cache, timeout). Each call of the enclosing function makes a fresh, private copy."
        },
        {
          "name": "Caller",
          "desc": "Asks the enclosing function for closures, keeps them, and calls them later, often many times."
        }
      ],
      "whenToUse": [
        "You need a function with a little private memory (counters, id generators, caches, once-only setup) and a class would be overkill.",
        "Configuring a function once and using it many times: a greeter for one language, a middleware for one API key.",
        "Callbacks and event handlers that must remember context from where they were created (debounce, timers, signal handlers).",
        "Hiding implementation details: callers can only use the returned function, not touch its state."
      ],
      "pitfalls": [
        "Closures in a loop capture the variable, not its value at that moment: three lambdas created with i in range(3) all return 2 in Python. Bind the value explicitly.",
        "Captured objects stay alive as long as the closure does, so long-lived callbacks can leak memory (large caches, freed nodes in Godot).",
        "Python needs nonlocal to assign to a captured variable; without it, count += 1 creates a new local and raises UnboundLocalError."
      ],
      "related": [
        "higher-order-functions",
        "currying-composition",
        "encapsulation",
        "decorator",
        "singleton"
      ],
      "quiz": [
        {
          "q": "likes = make_counter() and views = make_counter() are both called twice. What does likes() return on its next call?",
          "options": [
            "5, because the counters share one count",
            "3, because each call to make_counter created its own private count",
            "1, because count is reset on every call",
            "An error, because make_counter has already returned"
          ],
          "answer": 1,
          "why": "Every run of the enclosing function creates fresh local variables. Each returned closure carries its own count."
        },
        {
          "q": "Where does the state of a closure-based counter live?",
          "options": [
            "In a global variable",
            "In a field of a class",
            "In the enclosing function's scope, kept alive by the closure that references it",
            "On the call stack only while the closure runs"
          ],
          "answer": 2,
          "why": "The outer scope would normally disappear when the function returns, but because the inner function still refers to it, the language keeps it alive."
        }
      ],
      "demos": [
        {
          "id": "closures-py-counters",
          "title": "Counters and greeters",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A global click counter sits next to make_counter(), which hands out independent counters with private state. make_greeter() remembers a greeting, and late_binding_trap() shows the classic loop surprise.",
          "roles": {
            "Enclosing Function": [
              "closures-py-counters/counters.py#make_counter",
              "closures-py-counters/counters.py#make_greeter"
            ],
            "Closure": [
              "closures-py-counters/counters.py#increment",
              "closures-py-counters/counters.py#greet"
            ],
            "Captured Variable": [
              "closures-py-counters/counters.py#make_counter"
            ],
            "Caller": [
              "closures-py-counters/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "closures-py-counters/global_counter.py#click",
              "say": "The old way: click() changes a module global. Note its pipes to the clicks antenna, shared with reset() and anyone else."
            },
            {
              "at": "closures-py-counters/main.py#main",
              "say": "main() asks make_counter() twice and gets two separate counters: likes and page_views."
            },
            {
              "at": "closures-py-counters/counters.py#make_counter",
              "say": "make_counter() sets count, defines increment, and returns it without calling it. Then make_counter itself is finished."
            },
            {
              "at": "closures-py-counters/counters.py#increment",
              "say": "Yet increment still sees count. nonlocal lets it update the captured variable, and the new value survives until the next call."
            },
            {
              "at": "closures-py-counters/counters.py#make_greeter",
              "say": "The same trick with read-only state: each greeter remembers the greeting it was built with."
            },
            {
              "at": "closures-py-counters/counters.py#greet",
              "say": "greet('Ana') reads greeting from its backpack. Hello and Kalimera greeters live side by side."
            },
            {
              "at": "closures-py-counters/counters.py#late_binding_trap",
              "say": "The trap: lambdas made in a loop share one variable i and all return 2. i=i as a default argument freezes each value."
            }
          ],
          "files": {
            "closures-py-counters/counters.py": "# Closures: an inner function that remembers the variables of the\n# function that created it, even after that outer function has returned.\n\n\ndef make_counter(start=0, step=1):\n    count = start            # captured: lives on inside the closure\n\n    def increment():\n        nonlocal count       # we want to CHANGE the captured variable, not make a new local\n        count += step\n        return count\n\n    return increment\n\n\ndef make_greeter(greeting):\n    def greet(name):\n        return f\"{greeting}, {name}!\"   # reads the captured greeting\n\n    return greet\n\n\ndef late_binding_trap():\n    # A classic surprise: the lambdas capture the variable i, not its value at the time.\n    callbacks = [lambda: i for i in range(3)]\n    fixed = [lambda i=i: i for i in range(3)]   # default argument freezes each value\n    return [f() for f in callbacks], [f() for f in fixed]\n",
            "closures-py-counters/global_counter.py": "# The \"before\" picture: a counter kept in a module-level global.\n# Any function in the program can read or break it, and there is only one.\n\nclicks = 0\n\n\ndef click():\n    global clicks\n    clicks += 1\n    return clicks\n\n\ndef reset():\n    global clicks\n    clicks = 0\n",
            "closures-py-counters/main.py": "from .global_counter import click, reset\nfrom .counters import make_counter, make_greeter, late_binding_trap\n\n\ndef main():\n    click()\n    click()\n    reset()                        # one shared counter: anyone can wipe it\n\n    likes = make_counter()\n    page_views = make_counter(start=100, step=10)\n    likes()\n    likes()\n    print(likes(), page_views())   # 3 110: each closure has its own private count\n\n    hello = make_greeter(\"Hello\")\n    kalimera = make_greeter(\"Kalimera\")\n    print(hello(\"Ana\"), kalimera(\"Nikos\"))\n\n    print(late_binding_trap())     # ([2, 2, 2], [0, 1, 2])\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        },
        {
          "id": "closures-go-middleware",
          "title": "HTTP middleware in Go",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "Each middleware is a function that returns a function that returns a handler. The innermost func literal remembers the prefix, the API key, or a counter and mutex shared across every request.",
          "roles": {
            "Enclosing Function": [
              "closures-go-middleware/middleware/middleware.go#Logger",
              "closures-go-middleware/middleware/middleware.go#RateLimit",
              "closures-go-middleware/middleware/middleware.go#RequireKey",
              "closures-go-middleware/handlers/handlers.go#NextID"
            ],
            "Closure": [
              "closures-go-middleware/middleware/middleware.go#Middleware",
              "closures-go-middleware/handlers/handlers.go#Greeter"
            ],
            "Captured Variable": [
              "closures-go-middleware/middleware/middleware.go#RateLimit"
            ],
            "Caller": [
              "closures-go-middleware/main.go#main",
              "closures-go-middleware/middleware/middleware.go#Chain"
            ]
          },
          "trace": [
            {
              "at": "closures-go-middleware/main.go#main",
              "say": "main() builds closures at startup: an id generator, a greeter and three configured middlewares, then hands them to the server."
            },
            {
              "at": "closures-go-middleware/handlers/handlers.go#NextID",
              "say": "NextID() declares n and returns a func that increments it. order-1, order-2: the counter survives between calls."
            },
            {
              "at": "closures-go-middleware/handlers/handlers.go#Greeter",
              "say": "Greeter('Hello') returns a handler that remembers greeting. Two routes, two greetings, one function."
            },
            {
              "at": "closures-go-middleware/middleware/middleware.go#Chain",
              "say": "Chain() wraps the handler in each middleware, last first, so requests pass through them in the listed order."
            },
            {
              "at": "closures-go-middleware/middleware/middleware.go#Logger",
              "say": "Logger('[api]') captures prefix. The innermost func uses it on every request, long after Logger returned."
            },
            {
              "at": "closures-go-middleware/middleware/middleware.go#RequireKey",
              "say": "RequireKey captures the expected key once. No global config: each route can be built with its own key."
            },
            {
              "at": "closures-go-middleware/middleware/middleware.go#RateLimit",
              "say": "RateLimit captures used and mu. All requests share them, so the mutex matters, yet no other code can touch the counter."
            }
          ],
          "files": {
            "closures-go-middleware/handlers/handlers.go": "package handlers\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\n// Greeter builds a handler that remembers its greeting.\nfunc Greeter(greeting string) http.HandlerFunc {\n\treturn func(w http.ResponseWriter, r *http.Request) {\n\t\tname := r.URL.Query().Get(\"name\")\n\t\tfmt.Fprintf(w, \"%s, %s!\\n\", greeting, name)\n\t}\n}\n\n// NextID returns a function that hands out increasing ids.\n// Each call to NextID makes a fresh, independent sequence.\nfunc NextID(prefix string) func() string {\n\tn := 0\n\treturn func() string {\n\t\tn++\n\t\treturn fmt.Sprintf(\"%s-%d\", prefix, n)\n\t}\n}\n",
            "closures-go-middleware/main.go": "package main\n\nimport (\n\t\"log\"\n\t\"net/http\"\n\n\t\"example.com/closures/handlers\"\n\t\"example.com/closures/middleware\"\n)\n\nfunc main() {\n\torderID := handlers.NextID(\"order\")\n\tlog.Println(orderID(), orderID()) // order-1 order-2\n\n\tapi := middleware.Chain(handlers.Greeter(\"Hello\"),\n\t\tmiddleware.Logger(\"[api]\"),\n\t\tmiddleware.RequireKey(\"s3cret\"),\n\t\tmiddleware.RateLimit(100),\n\t)\n\thttp.Handle(\"/hello\", api)\n\thttp.Handle(\"/kalimera\", middleware.Chain(handlers.Greeter(\"Kalimera\"), middleware.Logger(\"[gr]\")))\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}\n",
            "closures-go-middleware/middleware/middleware.go": "package middleware\n\nimport (\n\t\"log\"\n\t\"net/http\"\n\t\"sync\"\n\t\"time\"\n)\n\n// Middleware wraps a handler with extra behaviour.\ntype Middleware func(http.Handler) http.Handler\n\n// Logger returns a middleware whose inner function remembers prefix.\nfunc Logger(prefix string) Middleware {\n\treturn func(next http.Handler) http.Handler {\n\t\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\t\tstart := time.Now()\n\t\t\tnext.ServeHTTP(w, r)\n\t\t\tlog.Printf(\"%s %s %s in %v\", prefix, r.Method, r.URL.Path, time.Since(start))\n\t\t})\n\t}\n}\n\n// RateLimit captures a counter and a mutex. Every request shares them,\n// yet no other code in the program can reach them.\nfunc RateLimit(max int) Middleware {\n\tused := 0\n\tvar mu sync.Mutex\n\treturn func(next http.Handler) http.Handler {\n\t\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\t\tmu.Lock()\n\t\t\tused++\n\t\t\tover := used > max\n\t\t\tmu.Unlock()\n\t\t\tif over {\n\t\t\t\thttp.Error(w, \"slow down\", http.StatusTooManyRequests)\n\t\t\t\treturn\n\t\t\t}\n\t\t\tnext.ServeHTTP(w, r)\n\t\t})\n\t}\n}\n\n// RequireKey captures the expected API key once, at startup.\nfunc RequireKey(key string) Middleware {\n\treturn func(next http.Handler) http.Handler {\n\t\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\t\tif r.Header.Get(\"X-Api-Key\") != key {\n\t\t\t\thttp.Error(w, \"unauthorized\", http.StatusUnauthorized)\n\t\t\t\treturn\n\t\t\t}\n\t\t\tnext.ServeHTTP(w, r)\n\t\t})\n\t}\n}\n\n// Chain applies middlewares so the first one listed runs first.\nfunc Chain(h http.Handler, mws ...Middleware) http.Handler {\n\tfor i := len(mws) - 1; i >= 0; i-- {\n\t\th = mws[i](h)\n\t}\n\treturn h\n}\n"
          }
        },
        {
          "id": "closures-underscore-real",
          "title": "Underscore: once, before, memoize, debounce",
          "lang": "JavaScript",
          "level": "intermediate",
          "source": {
            "repo": "jashkenas/underscore",
            "url": "https://github.com/jashkenas/underscore/blob/1.13.8/modules/debounce.js",
            "license": "MIT",
            "note": "underscore/before.js, once.js, memoize.js and debounce.js are verbatim from Underscore.js 1.13.8 modules/ (only the source header was added). usage.js was written for Software City."
          },
          "story": "Four classic utilities, each only a few lines, and every one is a closure: a counter of remaining calls, a cache object, and a timeout handle all live in the enclosing function's scope.",
          "roles": {
            "Enclosing Function": [
              "closures-underscore-real/underscore/before.js#before",
              "closures-underscore-real/underscore/debounce.js#debounce"
            ],
            "Closure": [
              "closures-underscore-real/underscore/debounce.js#later"
            ],
            "Captured Variable": [
              "closures-underscore-real/underscore/before.js#before",
              "closures-underscore-real/underscore/memoize.js#memoize"
            ],
            "Caller": [
              "closures-underscore-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "closures-underscore-real/usage.js#run",
              "say": "run() wraps ordinary functions: a database connect, a slow square, a draft saver. Each wrapper is a closure with a different memory."
            },
            {
              "at": "closures-underscore-real/underscore/before.js#before",
              "say": "before(times, func) returns a function that decrements the captured times and keeps the last result in memo. once is just before(2)."
            },
            {
              "at": "closures-underscore-real/usage.js#connectToDatabase",
              "say": "Called through once(), this runs a single time; the second init() returns the memo without connecting again."
            },
            {
              "at": "closures-underscore-real/underscore/memoize.js#memoize",
              "say": "memoize() returns a function whose cache object stores answers by key. slowSquare(12) is computed once."
            },
            {
              "at": "closures-underscore-real/underscore/debounce.js#debounce",
              "say": "debounce() captures timeout, previous and args. Every keystroke updates them; only the last one in a quiet period wins."
            },
            {
              "at": "closures-underscore-real/underscore/debounce.js#later",
              "say": "later is a closure inside the closure: when the timer fires it checks the captured previous time and either waits more or finally calls func."
            },
            {
              "at": "closures-underscore-real/usage.js#saveDraft",
              "say": "After 300 ms of silence saveDraft runs once with 'Hello'. Three calls, one save, and no global timer variable anywhere."
            }
          ],
          "files": {
            "closures-underscore-real/underscore/before.js": "// Source: Underscore.js 1.13.8 — https://github.com/jashkenas/underscore/blob/1.13.8/modules/before.js\n// MIT License, Copyright (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors. Included for study.\n// Returns a function that will only be executed up to (but not including) the\n// Nth call.\nexport default function before(times, func) {\n  var memo;\n  return function() {\n    if (--times > 0) {\n      memo = func.apply(this, arguments);\n    }\n    if (times <= 1) func = null;\n    return memo;\n  };\n}\n",
            "closures-underscore-real/underscore/debounce.js": "// Source: Underscore.js 1.13.8 — https://github.com/jashkenas/underscore/blob/1.13.8/modules/debounce.js\n// MIT License, Copyright (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors. Included for study.\nimport restArguments from './restArguments.js';\nimport now from './now.js';\n\n// When a sequence of calls of the returned function ends, the argument\n// function is triggered. The end of a sequence is defined by the `wait`\n// parameter. If `immediate` is passed, the argument function will be\n// triggered at the beginning of the sequence instead of at the end.\nexport default function debounce(func, wait, immediate) {\n  var timeout, previous, args, result, context;\n\n  var later = function() {\n    var passed = now() - previous;\n    if (wait > passed) {\n      timeout = setTimeout(later, wait - passed);\n    } else {\n      timeout = null;\n      if (!immediate) result = func.apply(context, args);\n      // This check is needed because `func` can recursively invoke `debounced`.\n      if (!timeout) args = context = null;\n    }\n  };\n\n  var debounced = restArguments(function(_args) {\n    context = this;\n    args = _args;\n    previous = now();\n    if (!timeout) {\n      timeout = setTimeout(later, wait);\n      if (immediate) result = func.apply(context, args);\n    }\n    return result;\n  });\n\n  debounced.cancel = function() {\n    clearTimeout(timeout);\n    timeout = args = context = null;\n  };\n\n  return debounced;\n}\n",
            "closures-underscore-real/underscore/memoize.js": "// Source: Underscore.js 1.13.8 — https://github.com/jashkenas/underscore/blob/1.13.8/modules/memoize.js\n// MIT License, Copyright (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors. Included for study.\nimport has from './_has.js';\n\n// Memoize an expensive function by storing its results.\nexport default function memoize(func, hasher) {\n  var memoize = function(key) {\n    var cache = memoize.cache;\n    var address = '' + (hasher ? hasher.apply(this, arguments) : key);\n    if (!has(cache, address)) cache[address] = func.apply(this, arguments);\n    return cache[address];\n  };\n  memoize.cache = {};\n  return memoize;\n}\n",
            "closures-underscore-real/underscore/once.js": "// Source: Underscore.js 1.13.8 — https://github.com/jashkenas/underscore/blob/1.13.8/modules/once.js\n// MIT License, Copyright (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors. Included for study.\nimport partial from './partial.js';\nimport before from './before.js';\n\n// Returns a function that will be executed at most one time, no matter how\n// often you call it. Useful for lazy initialization.\nexport default partial(before, 2);\n",
            "closures-underscore-real/usage.js": "// Example usage written for Software City (not part of Underscore).\nimport once from './underscore/once.js';\nimport before from './underscore/before.js';\nimport memoize from './underscore/memoize.js';\nimport debounce from './underscore/debounce.js';\n\nfunction connectToDatabase() {\n  console.log('connecting...');\n  return { connected: true };\n}\n\nfunction slowSquare(n) {\n  console.log('computing', n);\n  return n * n;\n}\n\nfunction saveDraft(text) {\n  console.log('saved:', text);\n}\n\nexport function run() {\n  const init = once(connectToDatabase);\n  init();\n  init(); // nothing printed: the closure remembers it already ran\n\n  const twoFreeHints = before(3, () => 'hint!');\n  console.log(twoFreeHints(), twoFreeHints(), twoFreeHints()); // hint! hint! hint!  (third returns the memo)\n\n  const square = memoize(slowSquare);\n  square(12);\n  square(12); // 'computing' printed once: the answer lives in the closure's cache\n\n  const autosave = debounce(saveDraft, 300);\n  autosave('H');\n  autosave('He');\n  autosave('Hello'); // only 'saved: Hello' after 300 ms of quiet\n}\n"
          }
        }
      ]
    },
    {
      "id": "currying-composition",
      "name": "Currying and Composition",
      "family": "Functional",
      "aka": [
        "Partial application",
        "compose / pipe",
        "Function pipelines",
        "Point-free style"
      ],
      "tagline": "Fill in a function's arguments a few at a time, then snap small functions together.",
      "intent": "Currying turns f(a, b, c) into f(a)(b)(c), so you can fix some arguments now and supply the rest later (partial application). Composition joins one-argument functions into a new function where each output feeds the next input. Together they let you build specialised behaviour, like a slugifier or a price rule, out of small general pieces without writing new functions by hand.",
      "analogy": "A coffee order taken in stages: the barista fixes the size, then the milk, then the flavour, and only makes the drink when the last choice is in. Composition is the assembly line behind the counter: grind, then brew, then pour, each station handing its output to the next.",
      "cityShape": "Look for a small toolkit building (fp.ts, Fp, ramda) whose curry, pipe and compose floors are called while things are being set up, not while data flows. The domain buildings (text, PriceRules) are rows of short, one-job floors with no data pipes, and the client floor that assembles them (buildSlugify, ruleFor) has call pipes fanning out to both.",
      "roles": [
        {
          "name": "Curried Function",
          "desc": "A function that takes its arguments one (or a few) at a time, returning a new function until it has them all."
        },
        {
          "name": "Partially Applied Function",
          "desc": "The function you get back after fixing some arguments, e.g. euros = price('EUR', 2). It waits for the rest."
        },
        {
          "name": "Composer",
          "desc": "compose or pipe: takes several functions and returns one new function that runs them in sequence."
        },
        {
          "name": "Client",
          "desc": "Assembles small functions into the specific behaviour it needs, then hands that function to whoever calls it."
        }
      ],
      "whenToUse": [
        "The same function is called again and again with the same first arguments (currency, tax rate, regex): fix them once.",
        "Data goes through several small transformations in a row: name the steps and pipe them instead of nesting calls.",
        "Building callbacks for map, filter or event handlers that need extra configuration.",
        "Making reusable rule sets (pricing, validation, formatting) that can be combined differently per customer or country."
      ],
      "pitfalls": [
        "Argument order matters: put the configuration first and the data last, or currying will not help.",
        "Deep point-free chains can be hard to read and debug; stack traces show anonymous wrappers. Name the intermediate functions.",
        "compose runs right to left and pipe left to right. Mixing them up silently changes the result."
      ],
      "related": [
        "higher-order-functions",
        "closures",
        "pipes-and-filters",
        "decorator",
        "builder"
      ],
      "quiz": [
        {
          "q": "add is curried: add(a)(b) returns a + b. What is add(5)?",
          "options": [
            "5",
            "An error: too few arguments",
            "A new function that adds 5 to whatever it is given",
            "The number 10"
          ],
          "answer": 2,
          "why": "Giving only the first argument returns a partially applied function. add(5)(3) would then return 8."
        },
        {
          "q": "What does compose(exclaim, upper, trim)('  hi ') return?",
          "options": [
            "'HI!'",
            "'  HI !'",
            "'hi!'",
            "'!HI'"
          ],
          "answer": 0,
          "why": "compose runs right to left: trim gives 'hi', upper gives 'HI', exclaim gives 'HI!'. pipe(trim, upper, exclaim) does the same in reading order."
        }
      ],
      "demos": [
        {
          "id": "currying-composition-ts-slugs",
          "title": "Building a URL slugifier",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Tiny string functions take the text as their last argument. buildSlugify() fixes regexes and a length in advance, then pipes everything into one slugify function. buildHeadline() shows the right-to-left compose.",
          "roles": {
            "Curried Function": [
              "currying-composition-ts-slugs/text.ts#replaceAll",
              "currying-composition-ts-slugs/fp.ts#curry2",
              "currying-composition-ts-slugs/text.ts#truncate"
            ],
            "Partially Applied Function": [
              "currying-composition-ts-slugs/slug.ts#buildSlugify"
            ],
            "Composer": [
              "currying-composition-ts-slugs/fp.ts#pipe",
              "currying-composition-ts-slugs/fp.ts#compose"
            ],
            "Client": [
              "currying-composition-ts-slugs/slug.ts#main"
            ]
          },
          "trace": [
            {
              "at": "currying-composition-ts-slugs/slug.ts#main",
              "say": "main() asks for a slugify function first and only then uses it. Building and running are two separate moments."
            },
            {
              "at": "currying-composition-ts-slugs/slug.ts#buildSlugify",
              "say": "buildSlugify() fills in the first arguments of replaceAll and truncate now. The text they will work on arrives later."
            },
            {
              "at": "currying-composition-ts-slugs/text.ts#replaceAll",
              "say": "replaceAll is hand-curried: pattern, then replacement, then text. Two calls in, it is a ready-made one-argument cleaner."
            },
            {
              "at": "currying-composition-ts-slugs/fp.ts#curry2",
              "say": "curry2 does the same job generically: truncateRaw(max, s) becomes truncate(max)(s) without rewriting it."
            },
            {
              "at": "currying-composition-ts-slugs/fp.ts#pipe",
              "say": "pipe() returns one function that reduces over the list, feeding each output into the next. Reads left to right."
            },
            {
              "at": "currying-composition-ts-slugs/text.ts#trim",
              "say": "When slugify finally runs, trim is the first station, then lower, the cleaners and truncate. Each knows only its own job."
            },
            {
              "at": "currying-composition-ts-slugs/fp.ts#compose",
              "say": "buildHeadline() uses compose, which runs right to left: trim first, exclaim last, giving 'BIG NEWS!'."
            }
          ],
          "files": {
            "currying-composition-ts-slugs/fp.ts": "// A tiny functional toolkit: curry2, pipe and compose.\n\n// Turn f(a, b) into f(a)(b), so the first argument can be fixed early.\nexport function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {\n  return (a: A) => (b: B) => fn(a, b);\n}\n\n// Left to right: pipe(f, g, h)(x) === h(g(f(x)))\nexport function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {\n  return (x: T) => fns.reduce((acc, f) => f(acc), x);\n}\n\n// Right to left, like maths: compose(f, g, h)(x) === f(g(h(x)))\nexport function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {\n  return (x: T) => fns.reduceRight((acc, f) => f(acc), x);\n}\n",
            "currying-composition-ts-slugs/slug.ts": "import { pipe, compose } from './fp';\nimport { trim, lower, replaceAll, truncate } from './text';\n\nexport function buildSlugify(maxLength: number): (title: string) => string {\n  // Partial application: fix pattern and replacement now, give the text later.\n  const dropSymbols = replaceAll(/[^a-z0-9\\s-]/g)('');\n  const spacesToDashes = replaceAll(/\\s+/g)('-');\n  return pipe(trim, lower, dropSymbols, spacesToDashes, truncate(maxLength));\n}\n\nexport function buildHeadline(): (title: string) => string {\n  const exclaim = (s: string) => s + '!';\n  const upper = (s: string) => s.toUpperCase();\n  return compose(exclaim, upper, trim); // read it right to left: trim, then upper, then exclaim\n}\n\nexport function main(): void {\n  const slugify = buildSlugify(30);\n  console.log(slugify('  Currying & Composition, Explained Simply  '));\n  // -> \"currying-composition-explained\"\n  console.log(buildHeadline()('  big news '));\n  // -> \"BIG NEWS!\"\n}\n",
            "currying-composition-ts-slugs/text.ts": "import { curry2 } from './fp';\n\n// Small, single-purpose string functions. Each takes the text LAST,\n// so the other arguments can be filled in ahead of time.\n\nexport function trim(s: string): string {\n  return s.trim();\n}\n\nexport function lower(s: string): string {\n  return s.toLowerCase();\n}\n\n// Hand-curried: one argument per call.\nexport function replaceAll(pattern: RegExp) {\n  return function (replacement: string) {\n    return function (s: string): string {\n      return s.replace(pattern, replacement);\n    };\n  };\n}\n\nfunction truncateRaw(max: number, s: string): string {\n  return s.length > max ? s.slice(0, max) : s;\n}\n\n// Curried by a helper instead of by hand.\nexport const truncate = curry2(truncateRaw);\n"
          }
        },
        {
          "id": "currying-composition-kt-pricing",
          "title": "Checkout price rules in Kotlin",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "Pricing functions take their settings first and the price last. Checkout curries them with function references (PriceRules::addTax), fixes the tax rate per country, and pipes discount, floor, tax and rounding into one rule per customer type.",
          "roles": {
            "Curried Function": [
              "currying-composition-kt-pricing/shop/fp/Fp.kt#Fp.curry"
            ],
            "Partially Applied Function": [
              "currying-composition-kt-pricing/shop/Checkout.kt#Checkout.ruleFor"
            ],
            "Composer": [
              "currying-composition-kt-pricing/shop/fp/Fp.kt#Fp.pipeline",
              "currying-composition-kt-pricing/shop/fp/Fp.kt#Fp.compose"
            ],
            "Client": [
              "currying-composition-kt-pricing/shop/Checkout.kt#Checkout",
              "currying-composition-kt-pricing/shop/Checkout.kt#main"
            ]
          },
          "trace": [
            {
              "at": "currying-composition-kt-pricing/shop/Checkout.kt#main",
              "say": "main() gets a receipt-line function for a Greek member and calls it with 20.0. All the assembly happens before the first price."
            },
            {
              "at": "currying-composition-kt-pricing/shop/Checkout.kt#Checkout.ruleFor",
              "say": "ruleFor() turns two-argument rules into one-argument steps by fixing their settings: tax rate, floor, 10 percent."
            },
            {
              "at": "currying-composition-kt-pricing/shop/fp/Fp.kt#Fp.curry",
              "say": "curry(PriceRules::addTax) returns { a -> { b -> addTax(a, b) } }. Calling it with taxRate() leaves a function waiting for the price."
            },
            {
              "at": "currying-composition-kt-pricing/shop/Checkout.kt#Checkout.taxRate",
              "say": "The only floor with a data pipe: it reads the country field. Everything else is pure arithmetic on arguments."
            },
            {
              "at": "currying-composition-kt-pricing/shop/fp/Fp.kt#Fp.pipeline",
              "say": "pipeline() folds over the steps, so 20.0 becomes 18.0, stays above the floor, gets tax, then is rounded."
            },
            {
              "at": "currying-composition-kt-pricing/shop/pricing/PriceRules.kt#PriceRules.addTax",
              "say": "addTax itself is an ordinary function. Currying happens outside, so it stays easy to call and test directly."
            },
            {
              "at": "currying-composition-kt-pricing/shop/fp/Fp.kt#Fp.compose",
              "say": "receiptLine() composes formatEuro after the rule: compose(f, g)(x) is f(g(x)), giving '22.32 EUR'."
            }
          ],
          "files": {
            "currying-composition-kt-pricing/shop/Checkout.kt": "package shop\n\nimport shop.fp.Fp\nimport shop.pricing.PriceRules\n\nclass Checkout(private val country: String) {\n\n    fun taxRate(): Double {\n        return if (country == \"DE\") 0.19 else 0.24\n    }\n\n    // Build the price rule once per customer type, then reuse it for every line.\n    fun ruleFor(member: Boolean): (Double) -> Double {\n        val tax = Fp.curry(PriceRules::addTax)(taxRate()) // partial application: rate fixed, price later\n        val floor = Fp.curry(PriceRules::atLeast)(1.0)\n        val noDiscount: (Double) -> Double = { it }\n        val discount = if (member) Fp.curry(PriceRules::percentOff)(10) else noDiscount\n        return Fp.pipeline(discount, floor, tax, PriceRules::roundCents)\n    }\n\n    fun receiptLine(member: Boolean): (Double) -> String {\n        return Fp.compose(PriceRules::formatEuro, ruleFor(member))\n    }\n\n    fun total(prices: List<Double>, member: Boolean): Double {\n        val rule = ruleFor(member)\n        return PriceRules.roundCents(prices.sumOf(rule))\n    }\n}\n\nfun main() {\n    val greek = Checkout(\"GR\")\n    val line = greek.receiptLine(member = true)\n    println(line(20.0))                                    // 22.32 EUR\n    println(greek.total(listOf(20.0, 0.5, 9.99), member = false))\n}\n",
            "currying-composition-kt-pricing/shop/fp/Fp.kt": "package shop.fp\n\n// A tiny functional toolkit, grouped in an object so it can be imported as one name.\nobject Fp {\n    // Turn a two-argument function into a chain of one-argument functions.\n    fun <A, B, C> curry(f: (A, B) -> C): (A) -> (B) -> C {\n        return { a -> { b -> f(a, b) } }\n    }\n\n    // Right to left: compose(f, g)(x) == f(g(x))\n    fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {\n        return { x -> f(g(x)) }\n    }\n\n    // Left to right for any number of price steps: the output of one is the input of the next.\n    fun pipeline(vararg steps: (Double) -> Double): (Double) -> Double {\n        return { start -> steps.fold(start) { price, step -> step(price) } }\n    }\n}\n",
            "currying-composition-kt-pricing/shop/pricing/PriceRules.kt": "package shop.pricing\n\nobject PriceRules {\n    // Plain two-argument functions. The \"settings\" come first, the price comes last,\n    // which makes them easy to curry and partially apply.\n\n    fun percentOff(percent: Int, price: Double): Double {\n        return price * (100 - percent) / 100.0\n    }\n\n    fun addTax(rate: Double, price: Double): Double {\n        return price * (1 + rate)\n    }\n\n    fun atLeast(floor: Double, price: Double): Double {\n        return maxOf(price, floor)\n    }\n\n    fun roundCents(price: Double): Double {\n        return Math.round(price * 100) / 100.0\n    }\n\n    fun formatEuro(price: Double): String {\n        return \"%.2f EUR\".format(price)\n    }\n}\n"
          }
        },
        {
          "id": "currying-composition-ramda-real",
          "title": "Ramda: curryN, pipe and compose",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "ramda/ramda",
            "url": "https://github.com/ramda/ramda/blob/v0.32.0/source/curryN.js",
            "license": "MIT",
            "note": "Files under ramda/ are verbatim from Ramda v0.32.0 source/ (curryN.js, pipe.js, compose.js and internal/_curryN.js, _curry1.js, _curry2.js, _pipe.js); helpers they import such as _arity, reduce and reverse are not included. usage.js was written for Software City."
          },
          "story": "Ramda curries every function it exports. _curryN collects arguments across calls until it has enough, pipe is a reduce over _pipe, and compose is simply pipe with the arguments reversed.",
          "roles": {
            "Curried Function": [
              "currying-composition-ramda-real/ramda/curryN.js#curryN",
              "currying-composition-ramda-real/ramda/internal/_curryN.js#_curryN",
              "currying-composition-ramda-real/ramda/internal/_curry2.js#_curry2"
            ],
            "Partially Applied Function": [
              "currying-composition-ramda-real/ramda/internal/_curry1.js#_curry1"
            ],
            "Composer": [
              "currying-composition-ramda-real/ramda/pipe.js#pipe",
              "currying-composition-ramda-real/ramda/compose.js#compose",
              "currying-composition-ramda-real/ramda/internal/_pipe.js#_pipe"
            ],
            "Client": [
              "currying-composition-ramda-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "currying-composition-ramda-real/usage.js#run",
              "say": "run() curries a three-argument formatter and calls it in several shapes: two then one, or one at a time."
            },
            {
              "at": "currying-composition-ramda-real/ramda/internal/_curry2.js#_curry2",
              "say": "curryN is itself curried with _curry2: called with one argument, f2 returns a function waiting for the second."
            },
            {
              "at": "currying-composition-ramda-real/ramda/internal/_curryN.js#_curryN",
              "say": "_curryN merges stored and new arguments. If some are still missing it returns another _curryN with the combined list."
            },
            {
              "at": "currying-composition-ramda-real/ramda/internal/_curry1.js#_curry1",
              "say": "_curry1 is the last step for one missing argument: no argument returns itself, a real argument finally calls fn."
            },
            {
              "at": "currying-composition-ramda-real/ramda/pipe.js#pipe",
              "say": "pipe() reduces the function list with _pipe, so pipe(f, g, h) becomes _pipe(_pipe(f, g), h). The first function may take several arguments."
            },
            {
              "at": "currying-composition-ramda-real/ramda/internal/_pipe.js#_pipe",
              "say": "_pipe is the whole idea of composition in three lines: call f, pass its result to g."
            },
            {
              "at": "currying-composition-ramda-real/ramda/compose.js#compose",
              "say": "compose() just reverses the arguments and calls pipe. Right to left and left to right are the same machine."
            }
          ],
          "files": {
            "currying-composition-ramda-real/ramda/compose.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/compose.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nimport pipe from './pipe.js';\nimport reverse from './reverse.js';\n\n\n/**\n * Performs right-to-left function composition. The last argument may have\n * any arity; the remaining arguments must be unary.\n *\n * **Note:** The result of compose is not automatically curried.\n *\n * @func\n * @memberOf R\n * @since v0.1.0\n * @category Function\n * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)\n * @param {...Function} ...functions The functions to compose\n * @return {Function}\n * @see R.pipe\n * @example\n *\n *      const classyGreeting = (firstName, lastName) => \"The name's \" + lastName + \", \" + firstName + \" \" + lastName\n *      const yellGreeting = R.compose(R.toUpper, classyGreeting);\n *      yellGreeting('James', 'Bond'); //=> \"THE NAME'S BOND, JAMES BOND\"\n *\n *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7\n *\n * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))\n * @symb R.compose(f, g, h)(a)(b) = f(g(h(a)))(b)\n */\nexport default function compose() {\n  if (arguments.length === 0) {\n    throw new Error('compose requires at least one argument');\n  }\n  return pipe.apply(this, reverse(arguments));\n}\n",
            "currying-composition-ramda-real/ramda/curryN.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/curryN.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nimport _arity from './internal/_arity.js';\nimport _curry1 from './internal/_curry1.js';\nimport _curry2 from './internal/_curry2.js';\nimport _curryN from './internal/_curryN.js';\n\n\n/**\n * Returns a curried equivalent of the provided function, with the specified\n * arity. The curried function has two unusual capabilities. First, its\n * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the\n * following are equivalent:\n *\n *   - `g(1)(2)(3)`\n *   - `g(1)(2, 3)`\n *   - `g(1, 2)(3)`\n *   - `g(1, 2, 3)`\n *\n * Secondly, the special placeholder value [`R.__`](#__) may be used to specify\n * \"gaps\", allowing partial application of any combination of arguments,\n * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),\n * the following are equivalent:\n *\n *   - `g(1, 2, 3)`\n *   - `g(_, 2, 3)(1)`\n *   - `g(_, _, 3)(1)(2)`\n *   - `g(_, _, 3)(1, 2)`\n *   - `g(_, 2)(1)(3)`\n *   - `g(_, 2)(1, 3)`\n *   - `g(_, 2)(_, 3)(1)`\n *\n * @func\n * @memberOf R\n * @since v0.5.0\n * @category Function\n * @sig Number -> (* -> a) -> (* -> a)\n * @param {Number} length The arity for the returned function.\n * @param {Function} fn The function to curry.\n * @return {Function} A new, curried function.\n * @see R.curry\n * @example\n *\n *      const sumArgs = (...args) => R.sum(args);\n *\n *      const curriedAddFourNumbers = R.curryN(4, sumArgs);\n *      const f = curriedAddFourNumbers(1, 2);\n *      const g = f(3);\n *      g(4); //=> 10\n */\nvar curryN = _curry2(function curryN(length, fn) {\n  if (length === 1) {\n    return _curry1(fn);\n  }\n  return _arity(length, _curryN(length, [], fn));\n});\nexport default curryN;\n",
            "currying-composition-ramda-real/ramda/internal/_curry1.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/internal/_curry1.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nimport _isPlaceholder from './_isPlaceholder.js';\n\n\n/**\n * Optimized internal one-arity curry function.\n *\n * @private\n * @category Function\n * @param {Function} fn The function to curry.\n * @return {Function} The curried function.\n */\nexport default function _curry1(fn) {\n  return function f1(a) {\n    if (arguments.length === 0 || _isPlaceholder(a)) {\n      return f1;\n    } else {\n      return fn.apply(this, arguments);\n    }\n  };\n}\n",
            "currying-composition-ramda-real/ramda/internal/_curry2.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/internal/_curry2.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nimport _curry1 from './_curry1.js';\nimport _isPlaceholder from './_isPlaceholder.js';\n\n\n/**\n * Optimized internal two-arity curry function.\n *\n * @private\n * @category Function\n * @param {Function} fn The function to curry.\n * @return {Function} The curried function.\n */\nexport default function _curry2(fn) {\n  return function f2(a, b) {\n    switch (arguments.length) {\n      case 0:\n        return f2;\n      case 1:\n        return _isPlaceholder(a)\n          ? f2\n          : _curry1(function(_b) { return fn(a, _b); });\n      default:\n        return _isPlaceholder(a) && _isPlaceholder(b)\n          ? f2\n          : _isPlaceholder(a)\n            ? _curry1(function(_a) { return fn(_a, b); })\n            : _isPlaceholder(b)\n              ? _curry1(function(_b) { return fn(a, _b); })\n              : fn(a, b);\n    }\n  };\n}\n",
            "currying-composition-ramda-real/ramda/internal/_curryN.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/internal/_curryN.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nimport _arity from './_arity.js';\nimport _isPlaceholder from './_isPlaceholder.js';\n\n\n/**\n * Internal curryN function.\n *\n * @private\n * @category Function\n * @param {Number} length The arity of the curried function.\n * @param {Array} received An array of arguments received thus far.\n * @param {Function} fn The function to curry.\n * @return {Function} The curried function.\n */\nexport default function _curryN(length, received, fn) {\n  return function() {\n    var combined = [];\n    var argsIdx = 0;\n    var left = length;\n    var combinedIdx = 0;\n    var hasPlaceholder = false;\n    while (combinedIdx < received.length || argsIdx < arguments.length) {\n      var result;\n      if (combinedIdx < received.length &&\n          (!_isPlaceholder(received[combinedIdx]) ||\n           argsIdx >= arguments.length)) {\n        result = received[combinedIdx];\n      } else {\n        result = arguments[argsIdx];\n        argsIdx += 1;\n      }\n      combined[combinedIdx] = result;\n      if (!_isPlaceholder(result)) {\n        left -= 1;\n      } else {\n        hasPlaceholder = true;\n      }\n      combinedIdx += 1;\n    }\n\n    return (!hasPlaceholder && left <= 0)\n      ? fn.apply(this, combined)\n      : _arity(Math.max(0, left), _curryN(length, combined, fn));\n  };\n}\n",
            "currying-composition-ramda-real/ramda/internal/_pipe.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/internal/_pipe.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nexport default function _pipe(f, g) {\n  return function() {\n    return g.call(this, f.apply(this, arguments));\n  };\n}\n",
            "currying-composition-ramda-real/ramda/pipe.js": "// Source: Ramda v0.32.0 — https://github.com/ramda/ramda/blob/v0.32.0/source/pipe.js\n// MIT License, Copyright (c) 2013-2025 Scott Sauyet and Michael Hurley. Included for study.\nimport _arity from './internal/_arity.js';\nimport _pipe from './internal/_pipe.js';\nimport reduce from './reduce.js';\nimport tail from './tail.js';\n\n\n/**\n * Performs left-to-right function composition. The first argument may have\n * any arity; the remaining arguments must be unary.\n *\n * In some libraries this function is named `sequence`.\n *\n * **Note:** The result of pipe is not automatically curried.\n *\n * @func\n * @memberOf R\n * @since v0.1.0\n * @category Function\n * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)\n * @param {...Function} functions\n * @return {Function}\n * @see R.compose\n * @example\n *\n *      const f = R.pipe(Math.pow, R.negate, R.inc);\n *\n *      f(3, 4); // -(3^4) + 1\n * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))\n * @symb R.pipe(f, g, h)(a)(b) = h(g(f(a)))(b)\n */\nexport default function pipe() {\n  if (arguments.length === 0) {\n    throw new Error('pipe requires at least one argument');\n  }\n  return _arity(\n    arguments[0].length,\n    reduce(_pipe, arguments[0], tail(arguments))\n  );\n}\n",
            "currying-composition-ramda-real/usage.js": "// Example usage written for Software City (not part of Ramda).\nimport curryN from './ramda/curryN.js';\nimport pipe from './ramda/pipe.js';\nimport compose from './ramda/compose.js';\n\nfunction formatPrice(currency, decimals, amount) {\n  return currency + ' ' + amount.toFixed(decimals);\n}\n\nfunction addVat(rate, amount) {\n  return amount * (1 + rate);\n}\n\nexport function run() {\n  const price = curryN(3, formatPrice);\n  const euros = price('EUR', 2);          // partially applied: waiting for the amount\n  console.log(euros(9.5));                // EUR 9.50\n  console.log(price('USD')(0)(42));       // USD 42: one argument at a time works too\n\n  const withGreekVat = curryN(2, addVat)(0.24);\n  const checkout = pipe(withGreekVat, euros);            // left to right\n  const sameThing = compose(euros, withGreekVat);        // right to left\n  console.log(checkout(100), sameThing(100));            // EUR 124.00 EUR 124.00\n}\n"
          }
        }
      ]
    },
    {
      "id": "option-result",
      "name": "Option and Result",
      "family": "Functional",
      "aka": [
        "Maybe",
        "Either",
        "Railway-oriented programming",
        "Errors as values"
      ],
      "tagline": "Return missing values and errors as data, and chain steps that stop at the first error.",
      "intent": "Instead of returning null or throwing, a function returns an Option (Some value or None) when a value may be missing, or a Result (Ok value or Err reason) when something can fail. Methods like map and andThen run the next step only on success, so a whole chain of checks reads as a straight line and the first error rides to the end, where one place decides what to show.",
      "analogy": "A railway with two parallel tracks: the train runs on the green track through every station, but any station can switch it onto the red track, and from then on it rolls past the remaining stations to the end of the line, still carrying the note that says why.",
      "cityShape": "Look for a small type building (result.py, error.rs, neverthrow) whose Ok and Err classes have floors with the same names at the same heights: bind or andThen, map, unwrap_or. One side calls the next step, its twin just returns itself. The step functions sit in a row with no data pipes, and only one edge floor (describe, report, placeOrder) looks inside the result.",
      "roles": [
        {
          "name": "Option",
          "desc": "A value that may be missing: Some(x) or None (Rust Option, Python None, TypeScript undefined). Forces the caller to handle 'nothing'."
        },
        {
          "name": "Result",
          "desc": "A value or an error: Ok(x) or Err(e). The error is ordinary data, so it can be passed on, mapped and inspected."
        },
        {
          "name": "Chain Step",
          "desc": "A function that takes a plain value and returns a new Option or Result. Joined with map / andThen / bind, it only runs on the success track."
        },
        {
          "name": "Edge Handler",
          "desc": "The single place at the boundary (UI, HTTP response, main) that unpacks the result with match or unwrap_or and decides what to do with each case."
        }
      ],
      "whenToUse": [
        "Validation and parsing pipelines where each step can fail with a reason the user should see (forms, config files, request bodies).",
        "Lookups that may legitimately find nothing, so callers cannot forget the empty case.",
        "Expected failures that are part of normal business, not programmer bugs (out of stock, name taken, bad input).",
        "Languages where it is the native style: Rust Result and ?, Kotlin Result and null-safety, Swift optionals, TypeScript libraries like neverthrow or fp-ts."
      ],
      "pitfalls": [
        "Calling unwrap() or .value everywhere just moves the crash; unpack the result at the edge, not in the middle.",
        "Mixing styles (some steps throw, some return Err) leaves holes in the railway. Wrap throwing code once, at the border.",
        "Very long chains can hide which step failed; give errors a kind or a type so the edge can tell them apart."
      ],
      "related": [
        "null-object",
        "pipes-and-filters",
        "higher-order-functions",
        "chain-of-responsibility",
        "currying-composition"
      ],
      "quiz": [
        {
          "q": "In ok(x).andThen(a).andThen(b).andThen(c), step a returns Err('bad'). What happens next?",
          "options": [
            "b and c run with the error",
            "b and c are skipped and the final result is Err('bad')",
            "An exception is thrown",
            "The chain restarts from the beginning"
          ],
          "answer": 1,
          "why": "Err.andThen ignores the step and returns itself, so the first error travels unchanged to the end of the chain."
        },
        {
          "q": "What is the difference between map and andThen (bind / flatMap)?",
          "options": [
            "There is none",
            "map's function returns a plain value that gets wrapped; andThen's function returns a Result itself, so it can fail",
            "andThen only works on errors",
            "map can only be used once per chain"
          ],
          "answer": 1,
          "why": "Use map for steps that cannot fail (formatting) and andThen for steps that can (validation), so you never end up with a Result inside a Result."
        }
      ],
      "demos": [
        {
          "id": "option-result-py-signup",
          "title": "Sign-up form on the railway",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A home-made Ok/Err pair with bind and map. Four validation steps are chained in signup(); none of them checks whether an earlier one failed, and describe() is the only code that looks inside the result.",
          "roles": {
            "Option": [
              "option-result-py-signup/users.py#find_user",
              "option-result-py-signup/result.py#from_optional"
            ],
            "Result": [
              "option-result-py-signup/result.py#Ok",
              "option-result-py-signup/result.py#Err"
            ],
            "Chain Step": [
              "option-result-py-signup/steps.py#parse_age",
              "option-result-py-signup/steps.py#check_adult",
              "option-result-py-signup/steps.py#check_email",
              "option-result-py-signup/steps.py#check_name_free"
            ],
            "Edge Handler": [
              "option-result-py-signup/signup.py#describe"
            ]
          },
          "trace": [
            {
              "at": "option-result-py-signup/signup.py#signup",
              "say": "signup() reads top to bottom like a checklist: start on Ok(form), bind four checks, map the happy ending."
            },
            {
              "at": "option-result-py-signup/result.py#Ok.bind",
              "say": "On the Ok track, bind() simply calls the next step with the value. The step returns a new Ok or an Err."
            },
            {
              "at": "option-result-py-signup/steps.py#parse_age",
              "say": "parse_age() returns Err when the age is not a number, a reason the user can read instead of a stack trace."
            },
            {
              "at": "option-result-py-signup/result.py#Err.bind",
              "say": "Once on the Err track, bind() returns self and skips the step. That is why no step has to re-check earlier failures."
            },
            {
              "at": "option-result-py-signup/steps.py#check_email",
              "say": "form.get('email') may be None. from_optional() turns that Option into a Result with a message, then bind checks the '@'."
            },
            {
              "at": "option-result-py-signup/steps.py#check_name_free",
              "say": "find_user() returns a user or None: Python's everyday Option. Here 'found' means failure, so it becomes Err."
            },
            {
              "at": "option-result-py-signup/signup.py#describe",
              "say": "The edge: describe() is the one place that asks 'Ok or Err?' and turns the answer into a message."
            }
          ],
          "files": {
            "option-result-py-signup/result.py": "# A tiny Result type. A step returns Ok(value) to keep going\n# or Err(reason) to switch to the error track. No exceptions needed.\n\n\nclass Ok:\n    def __init__(self, value):\n        self.value = value\n\n    def bind(self, step):\n        # Happy track: hand the value to the next step, which returns a new Result.\n        return step(self.value)\n\n    def map(self, fn):\n        return Ok(fn(self.value))\n\n    def unwrap_or(self, default):\n        return self.value\n\n\nclass Err:\n    def __init__(self, error):\n        self.error = error\n\n    def bind(self, step):\n        # Error track: skip the step and carry the first error to the end.\n        return self\n\n    def map(self, fn):\n        return self\n\n    def unwrap_or(self, default):\n        return default\n\n\ndef from_optional(value, error):\n    # Turn \"maybe nothing\" (None) into a Result with a reason attached.\n    return Err(error) if value is None else Ok(value)\n",
            "option-result-py-signup/signup.py": "from .result import Ok, Err\nfrom .steps import parse_age, check_adult, check_email, check_name_free\n\n\ndef create_account(form):\n    return f\"Welcome, {form['name']}!\"\n\n\ndef signup(form):\n    # Read it like a railway: the value rides along until a step derails it.\n    return (\n        Ok(form)\n        .bind(parse_age)\n        .bind(check_adult)\n        .bind(check_email)\n        .bind(check_name_free)\n        .map(create_account)\n    )\n\n\ndef describe(result):\n    # The edge of the program: the only place that looks inside a Result.\n    if isinstance(result, Err):\n        return \"Sign-up failed: \" + result.error\n    return result.value\n\n\ndef main():\n    forms = [\n        {\"name\": \"eleni\", \"age\": \"29\", \"email\": \"eleni@example.gr\"},\n        {\"name\": \"tom\", \"age\": \"abc\", \"email\": \"tom@example.com\"},\n        {\"name\": \"ana\", \"age\": \"31\", \"email\": \"ana2@example.com\"},\n        {\"name\": \"kid\", \"age\": \"12\", \"email\": \"kid@example.com\"},\n        {\"name\": \"maria\", \"age\": \"40\"},\n    ]\n    for form in forms:\n        print(describe(signup(form)))\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "option-result-py-signup/steps.py": "from .result import Ok, Err, from_optional\nfrom .users import find_user\n\n# Each step takes the form and returns Ok(form) or Err(\"why\").\n# None of them checks whether an earlier step failed; bind() takes care of that.\n\n\ndef parse_age(form):\n    raw = form.get(\"age\", \"\")\n    if not raw.isdigit():\n        return Err(f\"age '{raw}' is not a number\")\n    return Ok({**form, \"age\": int(raw)})\n\n\ndef check_adult(form):\n    return Ok(form) if form[\"age\"] >= 18 else Err(\"you must be 18 or older\")\n\n\ndef check_email(form):\n    email = from_optional(form.get(\"email\"), \"email is required\")\n    return email.bind(lambda e: Ok(form) if \"@\" in e else Err(f\"'{e}' is not an email\"))\n\n\ndef check_name_free(form):\n    taken = find_user(form[\"name\"])\n    return Ok(form) if taken is None else Err(f\"the name '{form['name']}' is taken\")\n",
            "option-result-py-signup/users.py": "# The \"database\". find_user returns a user or None: an Option in Python clothing.\n\nUSERS = [\n    {\"name\": \"ana\", \"email\": \"ana@example.com\"},\n    {\"name\": \"nikos\", \"email\": \"nikos@example.gr\"},\n]\n\n\ndef find_user(name):\n    for user in USERS:\n        if user[\"name\"] == name:\n            return user\n    return None\n"
          }
        },
        {
          "id": "option-result-rs-config",
          "title": "Loading a server config in Rust",
          "lang": "Rust",
          "level": "intermediate",
          "source": null,
          "story": "Rust has Option and Result built in, and the compiler will not let you ignore them. load() chains require, parse_number and in_range with and_then, uses ? to leave early, and falls back to defaults for optional keys.",
          "roles": {
            "Option": [
              "option-result-rs-config/src/config.rs#lookup"
            ],
            "Result": [
              "option-result-rs-config/src/error.rs#ConfigError",
              "option-result-rs-config/src/config.rs#require"
            ],
            "Chain Step": [
              "option-result-rs-config/src/config.rs#parse_number",
              "option-result-rs-config/src/config.rs#in_range"
            ],
            "Edge Handler": [
              "option-result-rs-config/src/main.rs#report"
            ]
          },
          "trace": [
            {
              "at": "option-result-rs-config/src/main.rs#main",
              "say": "main() tries five config texts: a good one, one using defaults, a typo, an empty file and a value out of range."
            },
            {
              "at": "option-result-rs-config/src/config.rs#load",
              "say": "load() returns Result<Config, ConfigError>. Each ? means: if this is Err, return it right now; otherwise unwrap and continue."
            },
            {
              "at": "option-result-rs-config/src/config.rs#require",
              "say": "require() turns lookup's Option into a Result with ok_or_else: a missing port is an error, with the key name attached."
            },
            {
              "at": "option-result-rs-config/src/config.rs#lookup",
              "say": "lookup() returns Option<String>. For 'workers' and 'name' None is fine, so load() uses match and unwrap_or_else to pick defaults."
            },
            {
              "at": "option-result-rs-config/src/config.rs#parse_number",
              "say": "parse_number() converts the parse error into our own ConfigError with map_err, so every failure has the same type."
            },
            {
              "at": "option-result-rs-config/src/config.rs#in_range",
              "say": "in_range() is a chain step that can fail on purpose: Ok(value) or Err(OutOfRange). 500 workers derails the train here."
            },
            {
              "at": "option-result-rs-config/src/main.rs#report",
              "say": "report() is the edge: one match with an Ok arm and an Err arm. The compiler would refuse to build if either were missing."
            },
            {
              "at": "option-result-rs-config/src/error.rs#ConfigError.fmt",
              "say": "Errors are plain enum data until the very end, where Display turns each variant into a readable sentence."
            }
          ],
          "files": {
            "option-result-rs-config/Cargo.toml": "[package]\nname = \"option-result-config\"\nversion = \"0.1.0\"\nedition = \"2021\"\n",
            "option-result-rs-config/src/config.rs": "use std::collections::HashMap;\n\nuse crate::error::ConfigError;\n\n#[derive(Debug)]\npub struct Config {\n    pub port: u16,\n    pub workers: u32,\n    pub name: String,\n}\n\npub fn parse_pairs(text: &str) -> HashMap<String, String> {\n    text.lines()\n        .filter_map(|line| line.split_once('='))\n        .map(|(k, v)| (k.trim().to_string(), v.trim().to_string()))\n        .collect()\n}\n\n// Option: the key may simply not be there. That is not an error yet.\npub fn lookup(map: &HashMap<String, String>, key: &str) -> Option<String> {\n    map.get(key).cloned()\n}\n\n// Option -> Result: here a missing key IS an error, so we name it.\npub fn require(map: &HashMap<String, String>, key: &str) -> Result<String, ConfigError> {\n    lookup(map, key).ok_or_else(|| ConfigError::Missing(key.to_string()))\n}\n\npub fn parse_number(key: &str, raw: String) -> Result<u32, ConfigError> {\n    raw.parse::<u32>().map_err(|_| ConfigError::NotANumber {\n        key: key.to_string(),\n        value: raw.clone(),\n    })\n}\n\npub fn in_range(key: &str, value: u32, min: u32, max: u32) -> Result<u32, ConfigError> {\n    if value >= min && value <= max {\n        Ok(value)\n    } else {\n        Err(ConfigError::OutOfRange { key: key.to_string(), value })\n    }\n}\n\n// The railway: each step either passes its value on or switches to the error track.\npub fn load(text: &str) -> Result<Config, ConfigError> {\n    let map = parse_pairs(text);\n    let port = require(&map, \"port\")\n        .and_then(|raw| parse_number(\"port\", raw))\n        .and_then(|n| in_range(\"port\", n, 1, 65535))?;\n    let workers = match lookup(&map, \"workers\") {\n        Some(raw) => parse_number(\"workers\", raw).and_then(|n| in_range(\"workers\", n, 1, 64))?,\n        None => 4,\n    };\n    let name = lookup(&map, \"name\").unwrap_or_else(|| \"server\".to_string());\n    Ok(Config { port: port as u16, workers, name })\n}\n",
            "option-result-rs-config/src/error.rs": "use std::fmt::{self, Display, Formatter};\n\n// Every way loading can fail, as plain data. No exceptions, no panics.\n#[derive(Debug, PartialEq)]\npub enum ConfigError {\n    Missing(String),\n    NotANumber { key: String, value: String },\n    OutOfRange { key: String, value: u32 },\n}\n\nimpl Display for ConfigError {\n    fn fmt(&self, f: &mut Formatter) -> fmt::Result {\n        match self {\n            ConfigError::Missing(key) => write!(f, \"missing setting '{}'\", key),\n            ConfigError::NotANumber { key, value } => write!(f, \"'{}' should be a number, got '{}'\", key, value),\n            ConfigError::OutOfRange { key, value } => write!(f, \"'{}' is out of range: {}\", key, value),\n        }\n    }\n}\n",
            "option-result-rs-config/src/main.rs": "mod config;\nmod error;\n\nuse config::load;\n\nfn report(label: &str, text: &str) {\n    // The edge of the program: the only place that looks inside the Result.\n    match load(text) {\n        Ok(cfg) => println!(\"{}: {} on port {} with {} workers\", label, cfg.name, cfg.port, cfg.workers),\n        Err(e) => println!(\"{}: cannot start, {}\", label, e),\n    }\n}\n\nfn main() {\n    report(\"good\", \"port = 8080\\nworkers = 8\\nname = shop-api\");\n    report(\"defaults\", \"port = 3000\");\n    report(\"typo\", \"port = 80a0\");\n    report(\"empty\", \"\");\n    report(\"greedy\", \"port = 8080\\nworkers = 500\");\n}\n"
          }
        },
        {
          "id": "option-result-neverthrow-real",
          "title": "neverthrow: Ok and Err in TypeScript",
          "lang": "TypeScript",
          "level": "intermediate",
          "source": {
            "repo": "supermacro/neverthrow",
            "url": "https://github.com/supermacro/neverthrow/blob/v8.2.0/src/result.ts",
            "license": "MIT",
            "note": "neverthrow/result.ts is an excerpt of neverthrow v8.2.0 src/result.ts, verbatim with marked cuts (helpers, async variants, JSDoc and typed overload signatures). usage.ts was written for Software City."
          },
          "story": "A popular library that brings Rust-style Result to TypeScript. Ok and Err implement the same interface; each method is one line, and the two classes are mirror images: Ok runs your function, Err passes itself along.",
          "roles": {
            "Option": [
              "option-result-neverthrow-real/usage.ts#findStock"
            ],
            "Result": [
              "option-result-neverthrow-real/neverthrow/result.ts#Ok",
              "option-result-neverthrow-real/neverthrow/result.ts#Err",
              "option-result-neverthrow-real/neverthrow/result.ts#IResult"
            ],
            "Chain Step": [
              "option-result-neverthrow-real/usage.ts#parseJson",
              "option-result-neverthrow-real/usage.ts#validateOrder",
              "option-result-neverthrow-real/usage.ts#reserveStock"
            ],
            "Edge Handler": [
              "option-result-neverthrow-real/usage.ts#placeOrder"
            ]
          },
          "trace": [
            {
              "at": "option-result-neverthrow-real/usage.ts#placeOrder",
              "say": "placeOrder() chains parse, validate and reserve with andThen, maps the success to a message and ends in match(): one straight line."
            },
            {
              "at": "option-result-neverthrow-real/usage.ts#parseJson",
              "say": "parseJson() is the border with throwing code: JSON.parse may throw, so it is wrapped once and turned into ok or err."
            },
            {
              "at": "option-result-neverthrow-real/neverthrow/result.ts#ok",
              "say": "ok() and err() are tiny constructors. The error is a normal object with a kind and a detail, not an exception."
            },
            {
              "at": "option-result-neverthrow-real/neverthrow/result.ts#Ok.andThen",
              "say": "Ok.andThen calls f(this.value) and returns whatever Result the step produced, so validation can switch tracks."
            },
            {
              "at": "option-result-neverthrow-real/usage.ts#reserveStock",
              "say": "reserveStock() gets an Option-like number | undefined from findStock and turns 'nothing' into an unknown-item error."
            },
            {
              "at": "option-result-neverthrow-real/neverthrow/result.ts#Err.andThen",
              "say": "Err.andThen ignores f and returns err(this.error). Every later step is skipped and the first problem is kept."
            },
            {
              "at": "option-result-neverthrow-real/neverthrow/result.ts#Err.match",
              "say": "At the edge, match() calls exactly one of the two handlers. Err picks the error handler, so the user sees 'Rejected (out-of-stock)'."
            }
          ],
          "files": {
            "option-result-neverthrow-real/neverthrow/result.ts": "/*\n * Source: neverthrow v8.2.0 — https://github.com/supermacro/neverthrow/blob/v8.2.0/src/result.ts\n * MIT License, Copyright (c) 2019 Giorgio Delgado. Included for study.\n */\nimport { errAsync, ResultAsync } from './'\nimport { createNeverThrowError, ErrorConfig } from './_internals/error'\nimport {\n  combineResultList,\n  combineResultListWithAllErrors,\n  ExtractErrTypes,\n  ExtractOkTypes,\n  InferAsyncErrTypes,\n  InferErrTypes,\n  InferOkTypes,\n} from './_internals/utils'\n\n// … trimmed: namespace Result with fromThrowable(), combine() and combineWithAllErrors(), 48 lines …\n\nexport type Result<T, E> = Ok<T, E> | Err<T, E>\n\n// … trimmed: the typed overload signatures of ok() and err(); their implementations follow …\nexport function ok<T, E = never>(value: T): Ok<T, E> {\n  return new Ok(value)\n}\n\nexport function err<T = never, E = unknown>(err: E): Err<T, E> {\n  return new Err(err)\n}\n\n// … trimmed: safeTry() and its overloads, 57 lines about generator-based early return …\n\ninterface IResult<T, E> {\n  // … trimmed: JSDoc comments, multi-line overloads, and the tee / async / unsafe method signatures …\n  isOk(): this is Ok<T, E>\n  isErr(): this is Err<T, E>\n  map<A>(f: (t: T) => A): Result<A, E>\n  mapErr<U>(f: (e: E) => U): Result<T, U>\n  andThen<U, F>(f: (t: T) => Result<U, F>): Result<U, E | F>\n  orElse<U, A>(f: (e: E) => Result<U, A>): Result<U | T, A>\n  unwrapOr<A>(v: A): T | A\n  match<A, B = A>(ok: (t: T) => A, err: (e: E) => B): A | B\n}\n\nexport class Ok<T, E> implements IResult<T, E> {\n  constructor(readonly value: T) {}\n\n  isOk(): this is Ok<T, E> {\n    return true\n  }\n\n  isErr(): this is Err<T, E> {\n    return !this.isOk()\n  }\n\n  map<A>(f: (t: T) => A): Result<A, E> {\n    return ok(f(this.value))\n  }\n\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  mapErr<U>(_f: (e: E) => U): Result<T, U> {\n    return ok(this.value)\n  }\n\n  // … trimmed: typed overload signatures of andThen …\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  andThen(f: any): any {\n    return f(this.value)\n  }\n\n  // … trimmed: andThrough, andTee, orTee (19 lines) …\n\n  // … trimmed: typed overload signatures of orElse …\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  orElse(_f: any): any {\n    return ok(this.value)\n  }\n\n  // … trimmed: asyncAndThen, asyncAndThrough, asyncMap (17 lines) …\n\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  unwrapOr<A>(_v: A): T | A {\n    return this.value\n  }\n\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  match<A, B = A>(ok: (t: T) => A, _err: (e: E) => B): A | B {\n    return ok(this.value)\n  }\n\n  // … trimmed: safeUnwrap, _unsafeUnwrap, _unsafeUnwrapErr and [Symbol.iterator] (20 lines) …\n}\n\nexport class Err<T, E> implements IResult<T, E> {\n  constructor(readonly error: E) {}\n\n  isOk(): this is Ok<T, E> {\n    return false\n  }\n\n  isErr(): this is Err<T, E> {\n    return !this.isOk()\n  }\n\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars\n  map<A>(_f: (t: T) => A): Result<A, E> {\n    return err(this.error)\n  }\n\n  mapErr<U>(f: (e: E) => U): Result<T, U> {\n    return err(f(this.error))\n  }\n\n  // … trimmed: andThrough, andTee, orTee (17 lines) …\n\n  // … trimmed: typed overload signatures of andThen …\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  andThen(_f: any): any {\n    return err(this.error)\n  }\n\n  // … trimmed: typed overload signatures of orElse …\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types\n  orElse(f: any): any {\n    return f(this.error)\n  }\n\n  // … trimmed: asyncAndThen, asyncAndThrough, asyncMap (13 lines) …\n\n  unwrapOr<A>(v: A): T | A {\n    return v\n  }\n\n  match<A, B = A>(_ok: (t: T) => A, err: (e: E) => B): A | B {\n    return err(this.error)\n  }\n\n  // … trimmed: safeUnwrap, _unsafeUnwrap, _unsafeUnwrapErr and [Symbol.iterator] (25 lines) …\n}\n",
            "option-result-neverthrow-real/usage.ts": "// Example usage written for Software City (not part of neverthrow).\nimport { ok, err, Result } from './neverthrow/result'\n\ntype Order = { item: string; qty: number }\ntype Problem = { kind: 'bad-json' | 'invalid' | 'unknown-item' | 'out-of-stock'; detail: string }\n\nconst STOCK: Record<string, number> = { mug: 3, poster: 0 }\n\n// An \"Option\" in plain TypeScript: a number, or undefined when there is nothing.\nexport function findStock(item: string): number | undefined {\n  return STOCK[item]\n}\n\nexport function parseJson(text: string): Result<unknown, Problem> {\n  try {\n    return ok(JSON.parse(text))\n  } catch (e) {\n    return err({ kind: 'bad-json', detail: String(e) })\n  }\n}\n\nexport function validateOrder(data: any): Result<Order, Problem> {\n  if (typeof data?.item !== 'string' || !(data.qty > 0)) {\n    return err({ kind: 'invalid', detail: 'need an item and a positive qty' })\n  }\n  return ok({ item: data.item, qty: data.qty })\n}\n\nexport function reserveStock(order: Order): Result<Order, Problem> {\n  const left = findStock(order.item)\n  if (left === undefined) {\n    return err({ kind: 'unknown-item', detail: order.item })\n  }\n  return left >= order.qty ? ok(order) : err({ kind: 'out-of-stock', detail: `${order.item}: ${left} left` })\n}\n\n// The railway: andThen only runs on the Ok track; the first Err rides straight to match().\nexport function placeOrder(body: string): string {\n  return parseJson(body)\n    .andThen(validateOrder)\n    .andThen(reserveStock)\n    .map(order => `Order for ${order.qty} x ${order.item} accepted`)\n    .match(\n      message => message,\n      problem => `Rejected (${problem.kind}): ${problem.detail}`,\n    )\n}\n\nexport function run(): void {\n  console.log(placeOrder('{\"item\": \"mug\", \"qty\": 2}'))    // accepted\n  console.log(placeOrder('{\"item\": \"mug\", \"qty\": 2'))     // bad-json\n  console.log(placeOrder('{\"item\": \"mug\", \"qty\": -1}'))   // invalid\n  console.log(placeOrder('{\"item\": \"poster\", \"qty\": 1}')) // out-of-stock\n  console.log(placeOrder('{\"item\": \"lamp\", \"qty\": 1}'))   // unknown-item\n}\n"
          }
        }
      ]
    },
    {
      "id": "lazy-evaluation",
      "name": "Lazy Evaluation",
      "family": "Functional",
      "aka": [
        "Generators",
        "Lazy streams",
        "Iterators on demand",
        "Deferred execution",
        "yield"
      ],
      "tagline": "Compute values only when someone actually asks for them, one at a time.",
      "intent": "Instead of building a whole list up front, a lazy source (a generator or iterator) produces each value on demand and pauses in between. Lazy operators such as map, filter and take wrap the source without running it, so you can describe huge or even infinite sequences, and only the work the consumer really needs is ever done.",
      "analogy": "A tap instead of a bucket: you do not fill a bucket with all the water you might need; you open the tap when you want a glass and close it when the glass is full. The reservoir behind it can be as big as it likes.",
      "cityShape": "Look for a source floor (naturals, Chunks, tabulate) with a loop that never ends, and a row of short operator floors (map, filter, take, InBiome, Limit) in their own building that each wrap the one before. The consumer floor (main, Program.Main, usage) is where call pipes start. The only data pipes belong to counters such as generated or pulls, which tell you exactly how much work was done.",
      "roles": [
        {
          "name": "Lazy Source",
          "desc": "A generator or iterator that produces values on demand, often from an endless loop or a large file, pausing at each yield."
        },
        {
          "name": "Lazy Operator",
          "desc": "Wraps another iterator and transforms it (map, filter, take). Calling it only builds a recipe; no item is processed yet."
        },
        {
          "name": "Consumer",
          "desc": "Pulls values out (a for loop, list(), ToList(), next()). This is the moment the whole chain actually runs, and it decides when to stop."
        }
      ],
      "whenToUse": [
        "Data that is too big for memory or arrives over time: log files, database cursors, network streams, sensor readings.",
        "Infinite or open-ended sequences: ids, procedurally generated worlds, simulation steps, number series.",
        "Searches where you usually stop early (the first error, the first match), so the rest never needs computing.",
        "Building processing pipelines that are cheap to define and only cost something when consumed."
      ],
      "pitfalls": [
        "Iterating a lazy query twice runs the whole pipeline twice, and a generator can be used up after one pass; materialise with list() or ToList() when you need the results again.",
        "Side effects inside lazy steps happen later than you expect, or not at all if nobody consumes the result.",
        "Calling a 'take everything' operation (list(), Count(), sorted) on an infinite source never returns."
      ],
      "related": [
        "iterator",
        "pipes-and-filters",
        "higher-order-functions",
        "reactive-streams",
        "producer-consumer"
      ],
      "quiz": [
        {
          "q": "take(map(filter(naturals(), isOdd), square), 5) where naturals() never ends. What happens?",
          "options": [
            "It loops forever",
            "It returns the first five odd squares, because take stops pulling after five",
            "It throws an out-of-memory error at once",
            "It returns an empty list"
          ],
          "answer": 1,
          "why": "Nothing runs until the result is consumed, and then each value is pulled through the chain one at a time. After five, take() stops asking, so the infinite source is never asked again."
        },
        {
          "q": "In C#, var q = world.Chunks().Where(...).Take(3); Console.WriteLine(q.Count()); Console.WriteLine(q.First()); How many times does the generator run?",
          "options": [
            "Once, LINQ caches it",
            "Never, Count() is precomputed",
            "Twice: every enumeration starts the pipeline again from the beginning",
            "Three times, once per Take"
          ],
          "answer": 2,
          "why": "A lazy query is a recipe, not a result. Each foreach, Count() or First() replays it. Call ToList() once if you need the values again."
        }
      ],
      "demos": [
        {
          "id": "lazy-evaluation-js-logs",
          "title": "Generators: infinite numbers and a lazy log reader",
          "lang": "JavaScript",
          "level": "beginner",
          "source": null,
          "story": "naturals() never ends, yet five odd squares come out instantly. The log reader prints each line it reads, so you can see that finding the first ERROR reads only three of six lines.",
          "roles": {
            "Lazy Source": [
              "lazy-evaluation-js-logs/sources.js#naturals",
              "lazy-evaluation-js-logs/sources.js#readLines"
            ],
            "Lazy Operator": [
              "lazy-evaluation-js-logs/operators.js#map",
              "lazy-evaluation-js-logs/operators.js#filter",
              "lazy-evaluation-js-logs/operators.js#take"
            ],
            "Consumer": [
              "lazy-evaluation-js-logs/main.js#firstOddSquares",
              "lazy-evaluation-js-logs/main.js#firstError"
            ]
          },
          "trace": [
            {
              "at": "lazy-evaluation-js-logs/main.js#firstOddSquares",
              "say": "Four nested calls build the pipeline, and the log line proves nothing has been computed yet. Spreading it into an array starts the pulling."
            },
            {
              "at": "lazy-evaluation-js-logs/operators.js#take",
              "say": "take() asks its source for one item at a time and returns after five. That return is what makes an infinite source safe."
            },
            {
              "at": "lazy-evaluation-js-logs/operators.js#map",
              "say": "map() asks filter for the next item, squares it and yields. It never holds more than one value."
            },
            {
              "at": "lazy-evaluation-js-logs/operators.js#filter",
              "say": "filter() keeps pulling from naturals until isOdd says yes, then pauses at yield until someone asks again."
            },
            {
              "at": "lazy-evaluation-js-logs/sources.js#naturals",
              "say": "naturals() is a while (true) loop. Each yield freezes the function, local n included, until the next value is wanted."
            },
            {
              "at": "lazy-evaluation-js-logs/main.js#firstError",
              "say": "firstError() filters a log for ERROR lines and takes just one. Destructuring [first] pulls a single value."
            },
            {
              "at": "lazy-evaluation-js-logs/sources.js#readLines",
              "say": "readLines() logs each line it reads. Only three appear: the rest of the file is never touched."
            }
          ],
          "files": {
            "lazy-evaluation-js-logs/main.js": "import { naturals, readLines } from './sources.js';\nimport { map, filter, take } from './operators.js';\n\nconst SERVER_LOG = [\n  'INFO  server started',\n  'INFO  user ana logged in',\n  'ERROR disk almost full',\n  'INFO  user nikos logged in',\n  'ERROR payment timeout',\n  'INFO  nightly backup done',\n].join('\\n');\n\nfunction isOdd(n) {\n  return n % 2 === 1;\n}\n\nfunction square(n) {\n  return n * n;\n}\n\nfunction firstOddSquares() {\n  // naturals() never ends, yet this finishes: take() stops asking after 5.\n  const pipeline = take(map(filter(naturals(), isOdd), square), 5);\n  console.log('pipeline built, nothing computed yet');\n  console.log([...pipeline]); // [1, 9, 25, 49, 81]\n}\n\nfunction firstError() {\n  const errors = filter(readLines(SERVER_LOG), (line) => line.startsWith('ERROR'));\n  const [first] = take(errors, 1);\n  console.log('first error:', first); // only 3 of 6 lines were read\n}\n\nfirstOddSquares();\nfirstError();\n",
            "lazy-evaluation-js-logs/operators.js": "// Lazy operators: each wraps an iterator and returns a new one.\n// Calling them does no work at all; work happens one item at a time, on demand.\n\nexport function* map(items, fn) {\n  for (const item of items) {\n    yield fn(item);\n  }\n}\n\nexport function* filter(items, keep) {\n  for (const item of items) {\n    if (keep(item)) {\n      yield item;\n    }\n  }\n}\n\nexport function* take(items, count) {\n  if (count <= 0) return;\n  for (const item of items) {\n    yield item;\n    count -= 1;\n    if (count === 0) return; // stop pulling: the source is never asked again\n  }\n}\n",
            "lazy-evaluation-js-logs/sources.js": "// Generators produce values only when someone asks for the next one.\n\n// An infinite sequence: safe, because nothing runs until next() is called.\nexport function* naturals(start = 1) {\n  let n = start;\n  while (true) {\n    yield n;\n    n += 1;\n  }\n}\n\n// Reads a big log one line at a time and says so, so you can watch the laziness.\nexport function* readLines(text) {\n  for (const line of text.split('\\n')) {\n    console.log('  reading:', line.slice(0, 30));\n    yield line;\n  }\n}\n"
          }
        },
        {
          "id": "lazy-evaluation-cs-chunks",
          "title": "Endless procedural world with yield return",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "World.Chunks() streams an endless map with yield return, and the hand-written InBiome, WithDungeon and Limit work exactly like LINQ's Where and Take. A counter on the world shows how many chunks were really generated, and how a second enumeration regenerates them.",
          "roles": {
            "Lazy Source": [
              "lazy-evaluation-cs-chunks/World.cs#World.Chunks"
            ],
            "Lazy Operator": [
              "lazy-evaluation-cs-chunks/ChunkQuery.cs#ChunkQuery.InBiome",
              "lazy-evaluation-cs-chunks/ChunkQuery.cs#ChunkQuery.WithDungeon",
              "lazy-evaluation-cs-chunks/ChunkQuery.cs#ChunkQuery.Limit"
            ],
            "Consumer": [
              "lazy-evaluation-cs-chunks/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "lazy-evaluation-cs-chunks/Program.cs#Program.Main",
              "say": "Main() chains a query over an infinite world and prints the counter: 0 chunks. Building the query cost nothing."
            },
            {
              "at": "lazy-evaluation-cs-chunks/ChunkQuery.cs#ChunkQuery.Limit",
              "say": "ToList() pulls from Limit, which pulls from WithDungeon, and so on back to the source: one MoveNext() ripples down the chain."
            },
            {
              "at": "lazy-evaluation-cs-chunks/ChunkQuery.cs#ChunkQuery.WithDungeon",
              "say": "WithDungeon() keeps asking for chunks until one has a dungeon, then hands it up with yield return and pauses."
            },
            {
              "at": "lazy-evaluation-cs-chunks/ChunkQuery.cs#ChunkQuery.InBiome",
              "say": "InBiome() drops chunks of other biomes. It is an iterator block too, so it only does work when pulled."
            },
            {
              "at": "lazy-evaluation-cs-chunks/World.cs#World.Chunks",
              "say": "Chunks() is a while (true) loop with yield return. The compiler turns it into a state machine that resumes right after the yield."
            },
            {
              "at": "lazy-evaluation-cs-chunks/World.cs#World.Generate",
              "say": "Generate() is the expensive part and the only floor writing the generated field. Its count shows exactly how much work the query needed."
            },
            {
              "at": "lazy-evaluation-cs-chunks/Program.cs#Program.ShowDoubleEnumerationTrap",
              "say": "The trap: Count() and First() each enumerate the query from scratch, so chunks are generated twice. Materialise with ToList() once."
            }
          ],
          "files": {
            "lazy-evaluation-cs-chunks/Chunk.cs": "namespace LazyWorld\n{\n    public class Chunk\n    {\n        public int Index { get; }\n        public string Biome { get; }\n        public bool HasDungeon { get; }\n\n        public Chunk(int index, string biome, bool hasDungeon)\n        {\n            Index = index;\n            Biome = biome;\n            HasDungeon = hasDungeon;\n        }\n\n        public override string ToString()\n        {\n            return $\"#{Index} {Biome}\" + (HasDungeon ? \" (dungeon)\" : \"\");\n        }\n    }\n}\n",
            "lazy-evaluation-cs-chunks/ChunkQuery.cs": "using System.Collections.Generic;\n\nnamespace LazyWorld\n{\n    // Hand-written versions of LINQ's Where and Take, so the city can show them.\n    // Each method is an iterator block: calling it only builds a recipe.\n    public static class ChunkQuery\n    {\n        public static IEnumerable<Chunk> InBiome(this IEnumerable<Chunk> chunks, string biome)\n        {\n            foreach (var chunk in chunks)\n            {\n                if (chunk.Biome == biome)\n                {\n                    yield return chunk;\n                }\n            }\n        }\n\n        public static IEnumerable<Chunk> WithDungeon(this IEnumerable<Chunk> chunks)\n        {\n            foreach (var chunk in chunks)\n            {\n                if (chunk.HasDungeon)\n                {\n                    yield return chunk;\n                }\n            }\n        }\n\n        public static IEnumerable<Chunk> Limit(this IEnumerable<Chunk> chunks, int count)\n        {\n            if (count <= 0) yield break;\n            foreach (var chunk in chunks)\n            {\n                yield return chunk;\n                if (--count == 0) yield break;   // stop pulling from the infinite source\n            }\n        }\n    }\n}\n",
            "lazy-evaluation-cs-chunks/Program.cs": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nnamespace LazyWorld\n{\n    public static class Program\n    {\n        public static void Main()\n        {\n            var world = new World(seed: 42);\n\n            IEnumerable<Chunk> quest = world.Chunks().InBiome(\"forest\").WithDungeon().Limit(3);\n            Console.WriteLine($\"Query built. Chunks generated: {world.GeneratedCount()}\");   // 0\n\n            List<Chunk> targets = quest.ToList();                                         // runs NOW\n            Console.WriteLine($\"Found: {string.Join(\", \", targets)}\");\n            Console.WriteLine($\"Chunks generated: {world.GeneratedCount()}\");             // only as many as needed\n\n            ShowDoubleEnumerationTrap(world);\n        }\n\n        private static void ShowDoubleEnumerationTrap(World world)\n        {\n            var before = world.GeneratedCount();\n            IEnumerable<Chunk> deserts = world.Chunks().InBiome(\"desert\").Limit(2);\n            Console.WriteLine(deserts.Count());   // runs the whole pipeline...\n            Console.WriteLine(deserts.First());   // ...and runs it AGAIN from the start\n            Console.WriteLine($\"Extra chunks generated: {world.GeneratedCount() - before}\");\n        }\n    }\n}\n",
            "lazy-evaluation-cs-chunks/World.cs": "using System;\nusing System.Collections.Generic;\n\nnamespace LazyWorld\n{\n    // An endless procedural world. Chunks are generated only when something\n    // iterates far enough to need them.\n    public class World\n    {\n        private static readonly string[] Biomes = { \"forest\", \"desert\", \"tundra\", \"swamp\" };\n        private readonly int seed;\n        private int generated = 0;\n\n        public World(int seed)\n        {\n            this.seed = seed;\n        }\n\n        public int GeneratedCount()\n        {\n            return generated;\n        }\n\n        public IEnumerable<Chunk> Chunks()\n        {\n            int index = 0;\n            while (true)\n            {\n                yield return Generate(index);   // execution pauses here until the next MoveNext()\n                index++;\n            }\n        }\n\n        private Chunk Generate(int index)\n        {\n            generated++;\n            var rng = new Random(seed * 31 + index);\n            string biome = Biomes[rng.Next(Biomes.Length)];\n            return new Chunk(index, biome, rng.NextDouble() < 0.15);\n        }\n    }\n}\n"
          }
        },
        {
          "id": "lazy-evaluation-itertools-real",
          "title": "Python itertools recipes in more-itertools",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "more-itertools/more-itertools",
            "url": "https://github.com/more-itertools/more-itertools/blob/v11.1.0/more_itertools/recipes.py",
            "license": "MIT",
            "note": "more_itertools/recipes.py is an excerpt of more-itertools v11.1.0, verbatim with marked cuts; these are the official itertools documentation recipes. usage.py was written for Software City."
          },
          "story": "The itertools recipes are one-liners built on lazy building blocks such as islice, count and map. tabulate() makes an infinite stream of sensor readings, and take, consume, nth and first_true each pull only what they need.",
          "roles": {
            "Lazy Source": [
              "lazy-evaluation-itertools-real/more_itertools/recipes.py#tabulate",
              "lazy-evaluation-itertools-real/more_itertools/recipes.py#iter_except"
            ],
            "Lazy Operator": [
              "lazy-evaluation-itertools-real/more_itertools/recipes.py#consume",
              "lazy-evaluation-itertools-real/more_itertools/recipes.py#nth",
              "lazy-evaluation-itertools-real/more_itertools/recipes.py#first_true"
            ],
            "Consumer": [
              "lazy-evaluation-itertools-real/usage.py#main",
              "lazy-evaluation-itertools-real/more_itertools/recipes.py#take"
            ]
          },
          "trace": [
            {
              "at": "lazy-evaluation-itertools-real/usage.py#main",
              "say": "main() creates an endless stream of readings and prints the pull counter: still 0, because creating the stream reads nothing."
            },
            {
              "at": "lazy-evaluation-itertools-real/more_itertools/recipes.py#tabulate",
              "say": "tabulate() is just map(function, count(start)). Both are lazy, so the result is an infinite iterator that costs nothing yet."
            },
            {
              "at": "lazy-evaluation-itertools-real/more_itertools/recipes.py#take",
              "say": "take() wraps the stream in islice and calls list(). Only now are exactly five readings pulled."
            },
            {
              "at": "lazy-evaluation-itertools-real/usage.py#read_sensor",
              "say": "Each pull calls read_sensor(), whose pulls counter (a mint data pipe) is the honest record of how much work was done."
            },
            {
              "at": "lazy-evaluation-itertools-real/more_itertools/recipes.py#consume",
              "say": "consume() advances the iterator by ten using an empty islice. The readings are computed but never stored."
            },
            {
              "at": "lazy-evaluation-itertools-real/more_itertools/recipes.py#first_true",
              "say": "first_true() is next(filter(pred, iterable)): it stops at the first overheating reading, however long the stream is."
            },
            {
              "at": "lazy-evaluation-itertools-real/more_itertools/recipes.py#iter_except",
              "say": "iter_except() turns 'call pop() until IndexError' into a generator, so even a destructive loop becomes a lazy source."
            }
          ],
          "files": {
            "lazy-evaluation-itertools-real/more_itertools/recipes.py": "# Source: more-itertools v11.1.0 — https://github.com/more-itertools/more-itertools/blob/v11.1.0/more_itertools/recipes.py\n# MIT License, Copyright (c) 2012 Erik Rose. Included for study.\n\"\"\"Imported from the recipes section of the itertools documentation.\n\nAll functions taken from the recipes section of the itertools library docs\n[1]_.\nSome backward-compatible usability improvements have been made.\n\n.. [1] http://docs.python.org/library/itertools.html#recipes\n\n\"\"\"\n\nimport random\n\nfrom bisect import bisect_left, insort\nfrom collections import deque\nfrom contextlib import suppress\nfrom dataclasses import dataclass\nfrom functools import lru_cache, reduce\nfrom heapq import heappush, heappushpop\nfrom itertools import (\n    accumulate,\n    chain,\n    combinations,\n    compress,\n    count,\n    cycle,\n    filterfalse,\n    groupby,\n    islice,\n    pairwise as itertools_pairwise,\n    product,\n    repeat,\n    starmap,\n    takewhile,\n    tee,\n    zip_longest,\n)\nfrom math import prod, comb, isqrt, gcd\nfrom operator import mul, getitem, index as _index, is_, itemgetter, truediv\nfrom random import randrange, sample, choice, shuffle\nfrom sys import hexversion\n\n# … trimmed: the __all__ export list, a sentinel and an optional heapq import (69 lines) …\n\n\ndef take(n, iterable):\n    \"\"\"Return first *n* items of the *iterable* as a list.\n\n        >>> take(3, range(10))\n        [0, 1, 2]\n\n    If there are fewer than *n* items in the iterable, all of them are\n    returned.\n\n        >>> take(10, range(3))\n        [0, 1, 2]\n\n    \"\"\"\n    return list(islice(iterable, n))\n\n\ndef tabulate(function, start=0):\n    \"\"\"Return an iterator over the results of ``func(start)``,\n    ``func(start + 1)``, ``func(start + 2)``...\n\n    *func* should be a function that accepts one integer argument.\n\n    If *start* is not specified it defaults to 0. It will be incremented each\n    time the iterator is advanced.\n\n        >>> square = lambda x: x ** 2\n        >>> iterator = tabulate(square, -3)\n        >>> take(4, iterator)\n        [9, 4, 1, 0]\n\n    \"\"\"\n    return map(function, count(start))\n\n\ndef tail(n, iterable):\n    \"\"\"Return an iterator over the last *n* items of *iterable*.\n\n    >>> t = tail(3, 'ABCDEFG')\n    >>> list(t)\n    ['E', 'F', 'G']\n\n    \"\"\"\n    try:\n        size = len(iterable)\n    except TypeError:\n        return iter(deque(iterable, maxlen=n))\n    else:\n        return islice(iterable, max(0, size - n), None)\n\n\ndef consume(iterator, n=None):\n    \"\"\"Advance *iterable* by *n* steps. If *n* is ``None``, consume it\n    entirely.\n\n    Efficiently exhausts an iterator without returning values. Defaults to\n    consuming the whole iterator, but an optional second argument may be\n    provided to limit consumption.\n\n        >>> i = (x for x in range(10))\n        >>> next(i)\n        0\n        >>> consume(i, 3)\n        >>> next(i)\n        4\n        >>> consume(i)\n        >>> next(i)\n        Traceback (most recent call last):\n          File \"<stdin>\", line 1, in <module>\n        StopIteration\n\n    If the iterator has fewer items remaining than the provided limit, the\n    whole iterator will be consumed.\n\n        >>> i = (x for x in range(3))\n        >>> consume(i, 5)\n        >>> next(i)\n        Traceback (most recent call last):\n          File \"<stdin>\", line 1, in <module>\n        StopIteration\n\n    \"\"\"\n    # Use functions that consume iterators at C speed.\n    if n is None:\n        # feed the entire iterator into a zero-length deque\n        deque(iterator, maxlen=0)\n    else:\n        # advance to the empty slice starting at position n\n        next(islice(iterator, n, n), None)\n\n\ndef nth(iterable, n, default=None):\n    \"\"\"Returns the nth item or a default value.\n\n    >>> l = range(10)\n    >>> nth(l, 3)\n    3\n    >>> nth(l, 20, \"zebra\")\n    'zebra'\n\n    \"\"\"\n    return next(islice(iterable, n, None), default)\n\n\n# … trimmed: 16 recipes from all_equal() to unique() not used in this demo …\n\n\ndef iter_except(function, exception, first=None):\n    \"\"\"Yields results from a function repeatedly until an exception is raised.\n\n    Converts a call-until-exception interface to an iterator interface.\n    Like ``iter(function, sentinel)``, but uses an exception instead of a sentinel\n    to end the loop.\n\n        >>> l = [0, 1, 2]\n        >>> list(iter_except(l.pop, IndexError))\n        [2, 1, 0]\n\n    Multiple exceptions can be specified as a stopping condition:\n\n        >>> l = [1, 2, 3, '...', 4, 5, 6]\n        >>> list(iter_except(lambda: 1 + l.pop(), (IndexError, TypeError)))\n        [7, 6, 5]\n        >>> list(iter_except(lambda: 1 + l.pop(), (IndexError, TypeError)))\n        [4, 3, 2]\n        >>> list(iter_except(lambda: 1 + l.pop(), (IndexError, TypeError)))\n        []\n\n    \"\"\"\n    with suppress(exception):\n        if first is not None:\n            yield first()\n        while True:\n            yield function()\n\n\ndef first_true(iterable, default=None, pred=None):\n    \"\"\"\n    Returns the first true value in the iterable.\n\n    If no true value is found, returns *default*\n\n    If *pred* is not None, returns the first item for which\n    ``pred(item) == True`` .\n\n        >>> first_true(range(10))\n        1\n        >>> first_true(range(10), pred=lambda x: x > 5)\n        6\n        >>> first_true(range(10), default='missing', pred=lambda x: x > 9)\n        'missing'\n\n    \"\"\"\n    return next(filter(pred, iterable), default)\n\n\n# … trimmed: the remaining recipes (random_*, sliding_window, sieve, polynomial and statistics helpers), about 1000 lines …\n",
            "lazy-evaluation-itertools-real/usage.py": "# Example usage written for Software City (not part of more-itertools).\n# A sensor that would happily produce readings forever, and helpers that\n# only ever pull as many as they need.\nimport random\nfrom .more_itertools.recipes import take, tabulate, tail, consume, nth, iter_except, first_true\n\npulls = 0\n\n\ndef read_sensor(second):\n    global pulls\n    pulls += 1\n    random.seed(second)\n    return round(20 + random.uniform(-3, 9), 1)\n\n\ndef is_overheating(celsius):\n    return celsius > 28.0\n\n\ndef drain(queue):\n    # Turn \"call pop() until it fails\" into an ordinary iterator.\n    return list(iter_except(queue.pop, IndexError))\n\n\ndef main():\n    readings = tabulate(read_sensor)                 # infinite, but nothing is read yet\n    print(\"pulled so far:\", pulls)                   # 0\n    print(\"first five:\", take(5, readings))          # pulls 5\n    consume(readings, 10)                            # skip ten readings without storing them\n    print(\"the 3rd after that:\", nth(readings, 2))\n    print(\"first overheat:\", first_true(readings, pred=is_overheating))\n    print(\"pulled in total:\", pulls)                 # only as many as the questions needed\n\n    print(\"last two of a finite batch:\", list(tail(2, take(20, tabulate(read_sensor)))))\n    print(\"drained:\", drain([1, 2, 3]))\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        }
      ]
    }
  ]
};
