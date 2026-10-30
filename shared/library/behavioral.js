// Family: Behavioral. 13 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Behavioral"
  ],
  "patterns": [
    {
      "id": "observer",
      "name": "Observer",
      "family": "Behavioral",
      "aka": [
        "Listener",
        "Event emitter",
        "Signals"
      ],
      "tagline": "One object announces a change; any number of others react to it.",
      "intent": "Let one object (the subject) notify a list of other objects (observers) when its state changes, without knowing what those objects are. Observers subscribe and unsubscribe at runtime, so you can add new reactions without touching the subject.",
      "analogy": "A newsletter: the publisher keeps a mailing list and sends each issue to everyone on it. Readers sign up or leave whenever they like, and the publisher never needs to know what they do with the issue.",
      "cityShape": "Look for one hub building whose notify() floor sends call pipes fanning out to several neighbouring buildings, each of which has an update() floor at roughly the same height. The subject's roof carries a list antenna (the observers array) that subscribe() writes into.",
      "roles": [
        {
          "name": "Subject",
          "desc": "Owns the interesting state and the list of observers; calls notify when the state changes."
        },
        {
          "name": "Observer",
          "desc": "The interface every listener implements, usually a single update method."
        },
        {
          "name": "Concrete Observer",
          "desc": "A real listener that reacts in its own way (draws, logs, alerts)."
        },
        {
          "name": "Client",
          "desc": "Wires observers to the subject, then lets the program run."
        }
      ],
      "whenToUse": [
        "Several parts of a program must react to the same change (UI, logging, saving).",
        "You want to add new reactions later without editing the code that produces the change.",
        "A game object must tell the HUD, sound and achievements about an event."
      ],
      "pitfalls": [
        "Forgotten unsubscribes keep dead observers alive (memory leaks, ghost updates).",
        "Long chains of observers triggering other subjects become hard to trace; the order of notifications is easy to depend on by accident.",
        "Observers that throw can stop the rest of the list from being notified unless you guard the loop."
      ],
      "related": [
        "pub-sub",
        "mediator",
        "mvc"
      ],
      "quiz": [
        {
          "q": "What does the subject need to know about its observers?",
          "options": [
            "Their concrete class names",
            "Only that they implement the update method",
            "Which file they live in",
            "Nothing, not even how to call them"
          ],
          "answer": 1,
          "why": "The subject depends only on the Observer interface, so new observer classes can be added without touching it."
        },
        {
          "q": "In Godot, which built-in feature is the Observer pattern?",
          "options": [
            "Autoload singletons",
            "Signals and connect()",
            "Scene inheritance",
            "export variables"
          ],
          "answer": 1,
          "why": "A node emits a signal (subject) and any connected callable (observer) runs, without the emitter knowing who listens."
        }
      ],
      "demos": [
        {
          "id": "observer-ts-weather",
          "title": "Weather station",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A weather station pushes new readings to three displays. Notice that station.ts never imports displays.ts: the arrow only points from the displays to the Observer interface.",
          "roles": {
            "Subject": [
              "observer-ts-weather/station.ts#WeatherStation"
            ],
            "Observer": [
              "observer-ts-weather/observer.ts#Observer"
            ],
            "Concrete Observer": [
              "observer-ts-weather/displays.ts#CurrentDisplay",
              "observer-ts-weather/displays.ts#StatsDisplay",
              "observer-ts-weather/displays.ts#HeatAlert"
            ],
            "Client": [
              "observer-ts-weather/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "observer-ts-weather/main.ts#main",
              "say": "main() builds the station and subscribes three different displays."
            },
            {
              "at": "observer-ts-weather/station.ts#WeatherStation.subscribe",
              "say": "subscribe() only appends to a list. The station stores observers, not display types."
            },
            {
              "at": "observer-ts-weather/station.ts#WeatherStation.setMeasurements",
              "say": "New data arrives. The station saves it, then calls notify()."
            },
            {
              "at": "observer-ts-weather/station.ts#WeatherStation.notify",
              "say": "notify() loops over the list and calls update() on each observer."
            },
            {
              "at": "observer-ts-weather/displays.ts#CurrentDisplay.update",
              "say": "The first observer prints the current reading."
            },
            {
              "at": "observer-ts-weather/displays.ts#StatsDisplay.update",
              "say": "The second keeps its own history and prints an average."
            },
            {
              "at": "observer-ts-weather/displays.ts#HeatAlert.update",
              "say": "The third only speaks up when it is too hot. Same message, three reactions."
            }
          ],
          "files": {
            "observer-ts-weather/displays.ts": "import { Observer } from './observer';\n\n// Three different observers. The station does not know any of these class names.\nexport class CurrentDisplay implements Observer {\n  update(temperature: number, humidity: number): void {\n    console.log(`Now: ${temperature}°C, ${humidity}% humidity`);\n  }\n}\n\nexport class StatsDisplay implements Observer {\n  private readings: number[] = [];\n\n  update(temperature: number): void {\n    this.readings.push(temperature);\n    const avg = this.readings.reduce((a, b) => a + b, 0) / this.readings.length;\n    console.log(`Average so far: ${avg.toFixed(1)}°C`);\n  }\n}\n\nexport class HeatAlert implements Observer {\n  constructor(private limit: number) {}\n\n  update(temperature: number): void {\n    if (temperature > this.limit) {\n      console.warn(`Heat alert! ${temperature}°C is above ${this.limit}°C`);\n    }\n  }\n}\n",
            "observer-ts-weather/main.ts": "import { WeatherStation } from './station';\nimport { CurrentDisplay, StatsDisplay, HeatAlert } from './displays';\n\nfunction main(): void {\n  const station = new WeatherStation();\n  station.subscribe(new CurrentDisplay());\n  station.subscribe(new StatsDisplay());\n  station.subscribe(new HeatAlert(30));\n\n  station.setMeasurements(24, 60);\n  station.setMeasurements(31, 45);\n}\n\nmain();\n",
            "observer-ts-weather/observer.ts": "// The contract every listener signs: \"call me when something changes\".\nexport interface Observer {\n  update(temperature: number, humidity: number): void;\n}\n",
            "observer-ts-weather/station.ts": "import { Observer } from './observer';\n\n// The Subject: it owns the data and a list of who wants to hear about it.\nexport class WeatherStation {\n  private observers: Observer[] = [];\n  private temperature = 0;\n  private humidity = 0;\n\n  subscribe(o: Observer): void {\n    this.observers.push(o);\n  }\n\n  unsubscribe(o: Observer): void {\n    this.observers = this.observers.filter(x => x !== o);\n  }\n\n  setMeasurements(temperature: number, humidity: number): void {\n    this.temperature = temperature;\n    this.humidity = humidity;\n    this.notify();\n  }\n\n  private notify(): void {\n    for (const o of this.observers) {\n      o.update(this.temperature, this.humidity);\n    }\n  }\n}\n"
          }
        },
        {
          "id": "observer-gd-health",
          "title": "Health bar with Godot signals",
          "lang": "GDScript",
          "level": "beginner",
          "source": null,
          "story": "The player emits health_changed and died. The HUD and game-over screen listen. The level connects them, so the player script never references the UI.",
          "roles": {
            "Subject": [
              "observer-gd-health/player.gd#take_damage",
              "observer-gd-health/player.gd#heal"
            ],
            "Concrete Observer": [
              "observer-gd-health/health_bar.gd#_on_health_changed",
              "observer-gd-health/game_over.gd#_on_player_died"
            ],
            "Client": [
              "observer-gd-health/level.gd#_ready"
            ]
          },
          "trace": [
            {
              "at": "observer-gd-health/level.gd#_ready",
              "say": "The level connects the player's signals to the health bar and the game-over screen."
            },
            {
              "at": "observer-gd-health/level.gd#_on_spike_body_entered",
              "say": "The player touches spikes; the level calls take_damage(30)."
            },
            {
              "at": "observer-gd-health/player.gd#take_damage",
              "say": "The player lowers its health and emits health_changed. It does not know who is listening."
            },
            {
              "at": "observer-gd-health/health_bar.gd#_on_health_changed",
              "say": "The health bar updates its value and turns red when health is low."
            },
            {
              "at": "observer-gd-health/game_over.gd#_on_player_died",
              "say": "If health hits zero, died is emitted and the game-over screen pauses the game."
            }
          ],
          "files": {
            "observer-gd-health/game_over.gd": "extends CanvasLayer\n\n# A second observer of the same player, listening to a different signal.\nfunc _on_player_died() -> void:\n\tvisible = true\n\tget_tree().paused = true\n",
            "observer-gd-health/health_bar.gd": "extends ProgressBar\n\n# An observer: it only reacts, it never asks the player for its health.\nfunc _on_health_changed(new_health: int, max_health: int) -> void:\n\tmax_value = max_health\n\tvalue = new_health\n\tif new_health < max_health * 0.25:\n\t\tmodulate = Color.RED\n\telse:\n\t\tmodulate = Color.WHITE\n",
            "observer-gd-health/level.gd": "extends Node2D\n\n@onready var player: Player = $Player\n@onready var health_bar = $HUD/HealthBar\n@onready var game_over = $GameOver\n\n# The level wires subjects to observers. Neither side knows about the other.\nfunc _ready() -> void:\n\tplayer.health_changed.connect(health_bar._on_health_changed)\n\tplayer.died.connect(game_over._on_player_died)\n\nfunc _on_spike_body_entered(body) -> void:\n\tif body == player:\n\t\tplayer.take_damage(30)\n",
            "observer-gd-health/player.gd": "class_name Player\nextends CharacterBody2D\n\n# Godot signals are the Observer pattern built into the engine.\nsignal health_changed(new_health, max_health)\nsignal died\n\n@export var max_health := 100\nvar health := 100\n\nfunc take_damage(amount: int) -> void:\n\thealth = max(health - amount, 0)\n\thealth_changed.emit(health, max_health)\n\tif health == 0:\n\t\tdied.emit()\n\nfunc heal(amount: int) -> void:\n\thealth = min(health + amount, max_health)\n\thealth_changed.emit(health, max_health)\n"
          }
        },
        {
          "id": "observer-mitt-real",
          "title": "mitt: a 200-byte event emitter",
          "lang": "TypeScript",
          "level": "intermediate",
          "source": {
            "repo": "developit/mitt",
            "url": "https://github.com/developit/mitt/blob/3.0.1/src/index.ts",
            "license": "MIT",
            "note": "mitt/index.ts is verbatim from mitt 3.0.1; usage.ts was written for Software City."
          },
          "story": "Real code from a library with millions of weekly downloads. The whole Observer pattern fits in three functions: on, off and emit, keyed by event name in a Map.",
          "roles": {
            "Subject": [
              "observer-mitt-real/mitt/index.ts#mitt"
            ],
            "Observer": [
              "observer-mitt-real/mitt/index.ts#Emitter"
            ],
            "Concrete Observer": [
              "observer-mitt-real/usage.ts#greet",
              "observer-mitt-real/usage.ts#audit"
            ],
            "Client": [
              "observer-mitt-real/usage.ts#run"
            ]
          },
          "trace": [
            {
              "at": "observer-mitt-real/usage.ts#run",
              "say": "run() creates an emitter and registers two handlers."
            },
            {
              "at": "observer-mitt-real/mitt/index.ts#on",
              "say": "on() looks up the handler list for 'login' in a Map and pushes the handler onto it."
            },
            {
              "at": "observer-mitt-real/mitt/index.ts#emit",
              "say": "emit() copies the list with slice() and calls every handler, then calls the '*' wildcard handlers."
            },
            {
              "at": "observer-mitt-real/usage.ts#greet",
              "say": "The login handler runs with the event payload."
            },
            {
              "at": "observer-mitt-real/usage.ts#audit",
              "say": "The wildcard handler sees every event type, a handy debugging hook."
            },
            {
              "at": "observer-mitt-real/mitt/index.ts#off",
              "say": "off() splices the handler out, so the next 'login' is heard only by the wildcard."
            }
          ],
          "files": {
            "observer-mitt-real/mitt/index.ts": "/*\n * Source: mitt 3.0.1 by Jason Miller — https://github.com/developit/mitt/blob/3.0.1/src/index.ts\n * MIT License, Copyright (c) 2021 Jason Miller. Included verbatim for study.\n */\nexport type EventType = string | symbol;\n\n// An event handler can take an optional event argument\n// and should not return a value\nexport type Handler<T = unknown> = (event: T) => void;\nexport type WildcardHandler<T = Record<string, unknown>> = (\n\ttype: keyof T,\n\tevent: T[keyof T]\n) => void;\n\n// An array of all currently registered event handlers for a type\nexport type EventHandlerList<T = unknown> = Array<Handler<T>>;\nexport type WildCardEventHandlerList<T = Record<string, unknown>> = Array<\n\tWildcardHandler<T>\n>;\n\n// A map of event types and their corresponding event handlers.\nexport type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<\n\tkeyof Events | '*',\n\tEventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>\n>;\n\nexport interface Emitter<Events extends Record<EventType, unknown>> {\n\tall: EventHandlerMap<Events>;\n\n\ton<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;\n\ton(type: '*', handler: WildcardHandler<Events>): void;\n\n\toff<Key extends keyof Events>(\n\t\ttype: Key,\n\t\thandler?: Handler<Events[Key]>\n\t): void;\n\toff(type: '*', handler: WildcardHandler<Events>): void;\n\n\temit<Key extends keyof Events>(type: Key, event: Events[Key]): void;\n\temit<Key extends keyof Events>(\n\t\ttype: undefined extends Events[Key] ? Key : never\n\t): void;\n}\n\n/**\n * Mitt: Tiny (~200b) functional event emitter / pubsub.\n * @name mitt\n * @returns {Mitt}\n */\nexport default function mitt<Events extends Record<EventType, unknown>>(\n\tall?: EventHandlerMap<Events>\n): Emitter<Events> {\n\ttype GenericEventHandler =\n\t\t| Handler<Events[keyof Events]>\n\t\t| WildcardHandler<Events>;\n\tall = all || new Map();\n\n\treturn {\n\t\t/**\n\t\t * A Map of event names to registered handler functions.\n\t\t */\n\t\tall,\n\n\t\t/**\n\t\t * Register an event handler for the given type.\n\t\t * @param {string|symbol} type Type of event to listen for, or `'*'` for all events\n\t\t * @param {Function} handler Function to call in response to given event\n\t\t * @memberOf mitt\n\t\t */\n\t\ton<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {\n\t\t\tconst handlers: Array<GenericEventHandler> | undefined = all!.get(type);\n\t\t\tif (handlers) {\n\t\t\t\thandlers.push(handler);\n\t\t\t} else {\n\t\t\t\tall!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Remove an event handler for the given type.\n\t\t * If `handler` is omitted, all handlers of the given type are removed.\n\t\t * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)\n\t\t * @param {Function} [handler] Handler function to remove\n\t\t * @memberOf mitt\n\t\t */\n\t\toff<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {\n\t\t\tconst handlers: Array<GenericEventHandler> | undefined = all!.get(type);\n\t\t\tif (handlers) {\n\t\t\t\tif (handler) {\n\t\t\t\t\thandlers.splice(handlers.indexOf(handler) >>> 0, 1);\n\t\t\t\t} else {\n\t\t\t\t\tall!.set(type, []);\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Invoke all handlers for the given type.\n\t\t * If present, `'*'` handlers are invoked after type-matched handlers.\n\t\t *\n\t\t * Note: Manually firing '*' handlers is not supported.\n\t\t *\n\t\t * @param {string|symbol} type The event type to invoke\n\t\t * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler\n\t\t * @memberOf mitt\n\t\t */\n\t\temit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {\n\t\t\tlet handlers = all!.get(type);\n\t\t\tif (handlers) {\n\t\t\t\t(handlers as EventHandlerList<Events[keyof Events]>)\n\t\t\t\t\t.slice()\n\t\t\t\t\t.map((handler) => {\n\t\t\t\t\t\thandler(evt!);\n\t\t\t\t\t});\n\t\t\t}\n\n\t\t\thandlers = all!.get('*');\n\t\t\tif (handlers) {\n\t\t\t\t(handlers as WildCardEventHandlerList<Events>)\n\t\t\t\t\t.slice()\n\t\t\t\t\t.map((handler) => {\n\t\t\t\t\t\thandler(type, evt!);\n\t\t\t\t\t});\n\t\t\t}\n\t\t}\n\t};\n}\n",
            "observer-mitt-real/usage.ts": "// Example usage written for Software City (not part of mitt).\nimport mitt from './mitt/index';\n\ntype Events = { login: { user: string }; logout: void };\n\nconst emitter = mitt<Events>();\n\nfunction greet(e: { user: string }): void {\n  console.log('Welcome back, ' + e.user);\n}\n\nfunction audit(type: keyof Events, e: unknown): void {\n  console.log('[audit]', type, e);\n}\n\nexport function run(): void {\n  emitter.on('login', greet);\n  emitter.on('*', audit);\n  emitter.emit('login', { user: 'theo' });\n  emitter.off('login', greet);\n  emitter.emit('login', { user: 'nobody hears this' });\n}\n"
          }
        }
      ]
    },
    {
      "id": "strategy",
      "name": "Strategy",
      "family": "Behavioral",
      "aka": [
        "Policy",
        "Pluggable algorithm"
      ],
      "tagline": "Put each way of doing a job in its own object and swap them at runtime.",
      "intent": "Define a family of algorithms behind one shared interface so the code that uses them (the context) does not care which one it has. The context holds a strategy object and delegates the work to it, so you can add or swap algorithms without editing the context or growing a long if/else chain.",
      "analogy": "Getting to the airport: you can take a taxi, the train or a bike. The trip is the same; you just pick a different way of doing it depending on time, money and weather.",
      "cityShape": "Look for a row of small buildings (the concrete strategies) whose same-named floor (cost, get_velocity, _format) sits at the same height in each one. A single context building holds a strategy antenna on its roof and sends one call pipe to that shared floor instead of branching to many.",
      "roles": [
        {
          "name": "Strategy",
          "desc": "The common interface (or base class) for all algorithms, usually one or two methods."
        },
        {
          "name": "Concrete Strategy",
          "desc": "One specific algorithm that implements the interface."
        },
        {
          "name": "Context",
          "desc": "Holds a reference to a strategy and delegates the varying work to it."
        },
        {
          "name": "Client",
          "desc": "Chooses which strategy the context should use, at setup or while running."
        }
      ],
      "whenToUse": [
        "You have several ways to do the same job (pricing, sorting, pathfinding, formatting) and an if/else that keeps growing.",
        "The choice of algorithm changes at runtime, for example an enemy that switches from patrolling to chasing.",
        "You want to test each algorithm on its own, without the class that uses it."
      ],
      "pitfalls": [
        "For two tiny variants a plain function parameter or a lambda is simpler than a class hierarchy.",
        "The client must know the strategies exist to pick one, so the choice has to live somewhere (a factory, a config value, a settings menu).",
        "Strategies that need lots of the context's private data turn into awkward long parameter lists."
      ],
      "related": [
        "state",
        "template-method",
        "dependency-injection",
        "polymorphism",
        "composition"
      ],
      "quiz": [
        {
          "q": "A checkout class has a switch over 'standard', 'express' and 'pickup' to compute shipping. What does Strategy change?",
          "options": [
            "Each option becomes an object with a cost() method and the checkout calls whichever it holds",
            "The switch moves into a static helper class",
            "Each option becomes a subclass of Checkout",
            "The prices are stored in a database"
          ],
          "answer": 0,
          "why": "Strategy replaces the branching with an object behind an interface; adding a new shipping option means adding a class, not editing the checkout."
        },
        {
          "q": "How is Strategy different from State?",
          "options": [
            "Strategy needs inheritance, State does not",
            "In Strategy the client usually picks the algorithm; in State the object switches its own state as events happen",
            "State can only be used in games",
            "There is no difference at all"
          ],
          "answer": 1,
          "why": "Both delegate to a swappable object. Strategy is chosen from outside for how to do a job; State objects decide transitions themselves to model what the object is doing now."
        }
      ],
      "demos": [
        {
          "id": "strategy-ts-shipping",
          "title": "Shipping costs at checkout",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A checkout computes delivery with whatever shipping strategy it holds. Notice checkout.ts imports only the interface, never the three concrete classes.",
          "roles": {
            "Strategy": [
              "strategy-ts-shipping/shipping.ts#ShippingStrategy"
            ],
            "Concrete Strategy": [
              "strategy-ts-shipping/strategies.ts#StandardShipping",
              "strategy-ts-shipping/strategies.ts#ExpressShipping",
              "strategy-ts-shipping/strategies.ts#StorePickup"
            ],
            "Context": [
              "strategy-ts-shipping/checkout.ts#Checkout"
            ],
            "Client": [
              "strategy-ts-shipping/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "strategy-ts-shipping/main.ts#main",
              "say": "main() creates a checkout and hands it the standard shipping strategy."
            },
            {
              "at": "strategy-ts-shipping/checkout.ts#Checkout.summary",
              "say": "summary() asks the strategy for its name and calls total(). It never checks which strategy it holds."
            },
            {
              "at": "strategy-ts-shipping/checkout.ts#Checkout.total",
              "say": "total() delegates the varying part, the delivery cost, to the strategy object."
            },
            {
              "at": "strategy-ts-shipping/strategies.ts#StandardShipping.cost",
              "say": "The standard algorithm runs: a base fee plus weight and distance."
            },
            {
              "at": "strategy-ts-shipping/checkout.ts#Checkout.setShipping",
              "say": "The client swaps in Express. Only one field changes; the checkout code stays the same."
            },
            {
              "at": "strategy-ts-shipping/strategies.ts#ExpressShipping.cost",
              "say": "The same total() call now runs a different algorithm, with higher rates."
            },
            {
              "at": "strategy-ts-shipping/strategies.ts#StorePickup.cost",
              "say": "Pickup is free. Adding it needed a new class and zero edits to Checkout."
            }
          ],
          "files": {
            "strategy-ts-shipping/checkout.ts": "import { ShippingStrategy } from './shipping';\n\n// The Context: it holds one strategy and delegates the shipping maths to it.\n// There is no if/else over shipping types anywhere in this class.\nexport class Checkout {\n  private shipping: ShippingStrategy;\n\n  constructor(private itemsTotal: number, private weightKg: number, shipping: ShippingStrategy) {\n    this.shipping = shipping;\n  }\n\n  setShipping(shipping: ShippingStrategy): void {\n    this.shipping = shipping;\n  }\n\n  total(distanceKm: number): number {\n    const delivery = this.shipping.cost(this.weightKg, distanceKm);\n    return this.itemsTotal + delivery;\n  }\n\n  summary(distanceKm: number): string {\n    return `${this.shipping.name()}: ${this.total(distanceKm).toFixed(2)} EUR`;\n  }\n}\n",
            "strategy-ts-shipping/main.ts": "import { Checkout } from './checkout';\nimport { StandardShipping, ExpressShipping, StorePickup } from './strategies';\n\n// The Client picks a strategy. The checkout never needs to change.\nfunction main(): void {\n  const checkout = new Checkout(59.9, 2.5, new StandardShipping());\n  console.log(checkout.summary(120));\n\n  checkout.setShipping(new ExpressShipping());\n  console.log(checkout.summary(120));\n\n  checkout.setShipping(new StorePickup());\n  console.log(checkout.summary(120));\n}\n\nmain();\n",
            "strategy-ts-shipping/shipping.ts": "// The Strategy interface: every way of shipping answers the same two questions.\nexport interface ShippingStrategy {\n  name(): string;\n  cost(weightKg: number, distanceKm: number): number;\n}\n",
            "strategy-ts-shipping/strategies.ts": "import { ShippingStrategy } from './shipping';\n\n// Three interchangeable algorithms. Each one is small and can be tested on its own.\nexport class StandardShipping implements ShippingStrategy {\n  name(): string {\n    return 'Standard (3-5 days)';\n  }\n\n  cost(weightKg: number, distanceKm: number): number {\n    return 4.99 + weightKg * 0.5 + distanceKm * 0.01;\n  }\n}\n\nexport class ExpressShipping implements ShippingStrategy {\n  name(): string {\n    return 'Express (next day)';\n  }\n\n  cost(weightKg: number, distanceKm: number): number {\n    return 12.99 + weightKg * 1.2 + distanceKm * 0.03;\n  }\n}\n\nexport class StorePickup implements ShippingStrategy {\n  name(): string {\n    return 'Pick up in store';\n  }\n\n  cost(): number {\n    return 0;\n  }\n}\n"
          }
        },
        {
          "id": "strategy-gd-enemy-ai",
          "title": "Enemy movement in Godot",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Each enemy holds a MovementStrategy (patrol, chase or flee) and asks it for a velocity every physics frame. The spawner assigns behaviours and the enemy swaps to fleeing on its own when hurt.",
          "roles": {
            "Strategy": [
              "strategy-gd-enemy-ai/movement_strategy.gd#get_velocity"
            ],
            "Concrete Strategy": [
              "strategy-gd-enemy-ai/patrol_movement.gd#get_velocity",
              "strategy-gd-enemy-ai/chase_movement.gd#get_velocity",
              "strategy-gd-enemy-ai/flee_movement.gd#get_velocity"
            ],
            "Context": [
              "strategy-gd-enemy-ai/enemy.gd#_physics_process",
              "strategy-gd-enemy-ai/enemy.gd#set_movement"
            ],
            "Client": [
              "strategy-gd-enemy-ai/spawner.gd#_ready",
              "strategy-gd-enemy-ai/spawner.gd#_on_player_spotted"
            ]
          },
          "trace": [
            {
              "at": "strategy-gd-enemy-ai/spawner.gd#_ready",
              "say": "The spawner creates a guard and a hunter and gives each a different movement strategy."
            },
            {
              "at": "strategy-gd-enemy-ai/enemy.gd#set_movement",
              "say": "set_movement() just stores the object. The enemy does not care which kind it got."
            },
            {
              "at": "strategy-gd-enemy-ai/enemy.gd#_physics_process",
              "say": "Every frame the enemy asks its strategy for a velocity, then moves. No if/else over behaviours here."
            },
            {
              "at": "strategy-gd-enemy-ai/patrol_movement.gd#get_velocity",
              "say": "The guard's strategy walks between points and keeps its own index state."
            },
            {
              "at": "strategy-gd-enemy-ai/spawner.gd#_on_player_spotted",
              "say": "The guard spots the player, so the spawner swaps in a ChaseMovement at runtime."
            },
            {
              "at": "strategy-gd-enemy-ai/chase_movement.gd#get_velocity",
              "say": "Same _physics_process call, new behaviour: run straight at the target."
            },
            {
              "at": "strategy-gd-enemy-ai/enemy.gd#take_damage",
              "say": "When health drops low, the enemy picks a strategy itself. Context can choose too."
            },
            {
              "at": "strategy-gd-enemy-ai/flee_movement.gd#get_velocity",
              "say": "Fleeing reverses the direction and speeds up the longer it panics."
            }
          ],
          "files": {
            "strategy-gd-enemy-ai/chase_movement.gd": "class_name ChaseMovement\nextends MovementStrategy\n\nvar speed := 140.0\n\nfunc _init(chase_speed: float = 140.0) -> void:\n\tspeed = chase_speed\n\n# Run straight at the target.\nfunc get_velocity(enemy: Node2D, target: Node2D, delta: float) -> Vector2:\n\tvar direction := enemy.global_position.direction_to(target.global_position)\n\treturn direction * speed\n",
            "strategy-gd-enemy-ai/enemy.gd": "class_name Enemy\nextends CharacterBody2D\n\n# The Context. It owns one movement strategy and asks it for a velocity every frame.\nvar movement: MovementStrategy = MovementStrategy.new()\nvar target: Node2D\nvar health := 100\n\nfunc set_movement(new_movement: MovementStrategy) -> void:\n\tmovement = new_movement\n\nfunc _physics_process(delta: float) -> void:\n\tif target == null:\n\t\treturn\n\tvelocity = movement.get_velocity(self, target, delta)\n\tmove_and_slide()\n\nfunc take_damage(amount: int) -> void:\n\thealth -= amount\n\t# Swapping the strategy at runtime changes the behaviour without any if/else in _physics_process.\n\tif health < 30:\n\t\tset_movement(FleeMovement.new())\n",
            "strategy-gd-enemy-ai/flee_movement.gd": "class_name FleeMovement\nextends MovementStrategy\n\nvar speed := 180.0\nvar panic_time := 0.0\n\n# Run away from the target, a little faster the longer we panic.\nfunc get_velocity(enemy: Node2D, target: Node2D, delta: float) -> Vector2:\n\tpanic_time += delta\n\tvar away := target.global_position.direction_to(enemy.global_position)\n\treturn away * (speed + panic_time * 10.0)\n",
            "strategy-gd-enemy-ai/movement_strategy.gd": "class_name MovementStrategy\nextends RefCounted\n\n# The Strategy base: \"given me and my target, which way should I move?\"\n# Subclasses override get_velocity(). The enemy only ever calls this method.\nfunc get_velocity(enemy: Node2D, target: Node2D, delta: float) -> Vector2:\n\treturn Vector2.ZERO\n",
            "strategy-gd-enemy-ai/patrol_movement.gd": "class_name PatrolMovement\nextends MovementStrategy\n\nvar points: Array[Vector2] = []\nvar index := 0\nvar speed := 80.0\n\nfunc _init(patrol_points: Array[Vector2]) -> void:\n\tpoints = patrol_points\n\n# Walk between fixed points and ignore the target completely.\nfunc get_velocity(enemy: Node2D, target: Node2D, delta: float) -> Vector2:\n\tif points.is_empty():\n\t\treturn Vector2.ZERO\n\tvar goal: Vector2 = points[index]\n\tif enemy.global_position.distance_to(goal) < 8.0:\n\t\tindex = (index + 1) % points.size()\n\treturn enemy.global_position.direction_to(goal) * speed\n",
            "strategy-gd-enemy-ai/spawner.gd": "extends Node2D\n\n# The Client: it decides which enemy gets which behaviour.\nconst EnemyScene = preload(\"res://enemy.tscn\")\n\n@onready var player: Node2D = $Player\n\nfunc _ready() -> void:\n\tvar guard: Enemy = spawn(Vector2(100, 100))\n\tvar points: Array[Vector2] = [Vector2(100, 100), Vector2(400, 100)]\n\tguard.set_movement(PatrolMovement.new(points))\n\n\tvar hunter: Enemy = spawn(Vector2(600, 300))\n\thunter.set_movement(ChaseMovement.new(160.0))\n\nfunc spawn(at: Vector2) -> Enemy:\n\tvar enemy: Enemy = EnemyScene.instantiate()\n\tenemy.position = at\n\tenemy.target = player\n\tadd_child(enemy)\n\treturn enemy\n\nfunc _on_player_spotted(enemy: Enemy) -> void:\n\t# A patrolling guard sees the player and switches to chasing.\n\tenemy.set_movement(ChaseMovement.new())\n"
          }
        },
        {
          "id": "strategy-logging-real",
          "title": "Python logging format styles",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/logging/__init__.py",
            "license": "PSF-2.0",
            "note": "logging/__init__.py is a verbatim excerpt from CPython 3.12.7 with unrelated parts cut (marked with comments); usage.py was written for Software City."
          },
          "story": "Python's standard logging.Formatter supports %, {} and $ format strings. It does this with three style strategy classes, picked from the _STYLES table by the style argument.",
          "roles": {
            "Strategy": [
              "strategy-logging-real/logging/__init__.py#PercentStyle"
            ],
            "Concrete Strategy": [
              "strategy-logging-real/logging/__init__.py#PercentStyle",
              "strategy-logging-real/logging/__init__.py#StrFormatStyle",
              "strategy-logging-real/logging/__init__.py#StringTemplateStyle"
            ],
            "Context": [
              "strategy-logging-real/logging/__init__.py#Formatter"
            ],
            "Client": [
              "strategy-logging-real/usage.py#run"
            ]
          },
          "trace": [
            {
              "at": "strategy-logging-real/usage.py#run",
              "say": "run() builds three Formatters that differ only in the style argument: '%', '{' or '$'."
            },
            {
              "at": "strategy-logging-real/logging/__init__.py#Formatter.__init__",
              "say": "The constructor looks up the style in the _STYLES table and stores a style object in self._style. That object is the strategy."
            },
            {
              "at": "strategy-logging-real/logging/__init__.py#Formatter.format",
              "say": "format() does the shared work: message, time, exceptions. Only the template filling is delegated."
            },
            {
              "at": "strategy-logging-real/logging/__init__.py#Formatter.formatMessage",
              "say": "formatMessage() is a one-liner: self._style.format(record). Pure delegation."
            },
            {
              "at": "strategy-logging-real/logging/__init__.py#PercentStyle.format",
              "say": "The base style wraps _format() to turn a missing field into a clear ValueError."
            },
            {
              "at": "strategy-logging-real/logging/__init__.py#StrFormatStyle._format",
              "say": "The '{' strategy overrides only _format() and uses str.format(). A subclass is a cheap new strategy."
            },
            {
              "at": "strategy-logging-real/logging/__init__.py#StringTemplateStyle._format",
              "say": "The '$' strategy fills a string.Template. Formatter's code is identical for all three."
            }
          ],
          "files": {
            "strategy-logging-real/logging/__init__.py": "# Source: CPython 3.12.7 — https://github.com/python/cpython/blob/v3.12.7/Lib/logging/__init__.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation (module: Copyright 2001-2022 Vinay Sajip). Included for study.\n# Only the formatter \"style\" classes and Formatter are shown; everything else in the module is cut.\n\n# … trimmed: 25 lines (license notice, module docstring) …\nimport sys, os, time, io, re, traceback, warnings, weakref, collections.abc\n\nfrom types import GenericAlias\nfrom string import Template\nfrom string import Formatter as StrFormatter\n\n# … trimmed: 396 lines (__all__, levels, LogRecord) not related to the pattern …\n\n#---------------------------------------------------------------------------\n#   Formatter classes and functions\n#---------------------------------------------------------------------------\n_str_formatter = StrFormatter()\ndel StrFormatter\n\n\nclass PercentStyle(object):\n\n    default_format = '%(message)s'\n    asctime_format = '%(asctime)s'\n    asctime_search = '%(asctime)'\n    validation_pattern = re.compile(r'%\\(\\w+\\)[#0+ -]*(\\*|\\d+)?(\\.(\\*|\\d+))?[diouxefgcrsa%]', re.I)\n\n    def __init__(self, fmt, *, defaults=None):\n        self._fmt = fmt or self.default_format\n        self._defaults = defaults\n\n    def usesTime(self):\n        return self._fmt.find(self.asctime_search) >= 0\n\n    def validate(self):\n        \"\"\"Validate the input format, ensure it matches the correct style\"\"\"\n        if not self.validation_pattern.search(self._fmt):\n            raise ValueError(\"Invalid format '%s' for '%s' style\" % (self._fmt, self.default_format[0]))\n\n    def _format(self, record):\n        if defaults := self._defaults:\n            values = defaults | record.__dict__\n        else:\n            values = record.__dict__\n        return self._fmt % values\n\n    def format(self, record):\n        try:\n            return self._format(record)\n        except KeyError as e:\n            raise ValueError('Formatting field not found in record: %s' % e)\n\n\nclass StrFormatStyle(PercentStyle):\n    default_format = '{message}'\n    asctime_format = '{asctime}'\n    asctime_search = '{asctime'\n\n    fmt_spec = re.compile(r'^(.?[<>=^])?[+ -]?#?0?(\\d+|{\\w+})?[,_]?(\\.(\\d+|{\\w+}))?[bcdefgnosx%]?$', re.I)\n    field_spec = re.compile(r'^(\\d+|\\w+)(\\.\\w+|\\[[^]]+\\])*$')\n\n    def _format(self, record):\n        if defaults := self._defaults:\n            values = defaults | record.__dict__\n        else:\n            values = record.__dict__\n        return self._fmt.format(**values)\n\n    def validate(self):\n        \"\"\"Validate the input format, ensure it is the correct string formatting style\"\"\"\n        fields = set()\n        try:\n            for _, fieldname, spec, conversion in _str_formatter.parse(self._fmt):\n                if fieldname:\n                    if not self.field_spec.match(fieldname):\n                        raise ValueError('invalid field name/expression: %r' % fieldname)\n                    fields.add(fieldname)\n                if conversion and conversion not in 'rsa':\n                    raise ValueError('invalid conversion: %r' % conversion)\n                if spec and not self.fmt_spec.match(spec):\n                    raise ValueError('bad specifier: %r' % spec)\n        except ValueError as e:\n            raise ValueError('invalid format: %s' % e)\n        if not fields:\n            raise ValueError('invalid format: no fields')\n\n\nclass StringTemplateStyle(PercentStyle):\n    default_format = '${message}'\n    asctime_format = '${asctime}'\n    asctime_search = '${asctime}'\n\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)\n        self._tpl = Template(self._fmt)\n\n    def usesTime(self):\n        fmt = self._fmt\n        return fmt.find('$asctime') >= 0 or fmt.find(self.asctime_search) >= 0\n\n    def validate(self):\n        pattern = Template.pattern\n        fields = set()\n        for m in pattern.finditer(self._fmt):\n            d = m.groupdict()\n            if d['named']:\n                fields.add(d['named'])\n            elif d['braced']:\n                fields.add(d['braced'])\n            elif m.group(0) == '$':\n                raise ValueError('invalid format: bare \\'$\\' not allowed')\n        if not fields:\n            raise ValueError('invalid format: no fields')\n\n    def _format(self, record):\n        if defaults := self._defaults:\n            values = defaults | record.__dict__\n        else:\n            values = record.__dict__\n        return self._tpl.substitute(**values)\n\n\nBASIC_FORMAT = \"%(levelname)s:%(name)s:%(message)s\"\n\n_STYLES = {\n    '%': (PercentStyle, BASIC_FORMAT),\n    '{': (StrFormatStyle, '{levelname}:{name}:{message}'),\n    '$': (StringTemplateStyle, '${levelname}:${name}:${message}'),\n}\n\nclass Formatter(object):\n    # … trimmed: 42-line class docstring listing every LogRecord attribute …\n\n    converter = time.localtime\n\n    def __init__(self, fmt=None, datefmt=None, style='%', validate=True, *,\n                 defaults=None):\n        # … trimmed: 15-line docstring …\n\n        if style not in _STYLES:\n            raise ValueError('Style must be one of: %s' % ','.join(\n                             _STYLES.keys()))\n        self._style = _STYLES[style][0](fmt, defaults=defaults)\n        if validate:\n            self._style.validate()\n\n        self._fmt = self._style._fmt\n        self.datefmt = datefmt\n\n    default_time_format = '%Y-%m-%d %H:%M:%S'\n    default_msec_format = '%s,%03d'\n\n    def formatTime(self, record, datefmt=None):\n        # … trimmed: 17-line docstring …\n\n        ct = self.converter(record.created)\n        if datefmt:\n            s = time.strftime(datefmt, ct)\n        else:\n            s = time.strftime(self.default_time_format, ct)\n            if self.default_msec_format:\n                s = self.default_msec_format % (s, record.msecs)\n        return s\n\n    # … trimmed: formatException() and the usesTime() docstring (19 lines) …\n\n    def usesTime(self):\n        return self._style.usesTime()\n\n    def formatMessage(self, record):\n        return self._style.format(record)\n\n    def formatStack(self, stack_info):\n        # … trimmed: 10-line docstring …\n\n        return stack_info\n\n    def format(self, record):\n        # … trimmed: 12-line docstring …\n\n        record.message = record.getMessage()\n        if self.usesTime():\n            record.asctime = self.formatTime(record, self.datefmt)\n        s = self.formatMessage(record)\n        if record.exc_info:\n            # Cache the traceback text to avoid converting it multiple times\n            # (it's constant anyway)\n            if not record.exc_text:\n                record.exc_text = self.formatException(record.exc_info)\n        if record.exc_text:\n            if s[-1:] != \"\\n\":\n                s = s + \"\\n\"\n            s = s + record.exc_text\n        if record.stack_info:\n            if s[-1:] != \"\\n\":\n                s = s + \"\\n\"\n            s = s + self.formatStack(record.stack_info)\n        return s\n\n",
            "strategy-logging-real/usage.py": "# Example usage written for Software City (not part of CPython).\n# In a real program you would write logging.Formatter(...) with the standard library.\nfrom .logging import Formatter\n\n\nclass DemoRecord:\n    \"\"\"A tiny stand-in for logging.LogRecord with just the fields Formatter reads.\"\"\"\n\n    def __init__(self, name, levelname, msg):\n        self.name = name\n        self.levelname = levelname\n        self.msg = msg\n        self.created = 0.0\n        self.msecs = 0\n        self.exc_info = None\n        self.exc_text = None\n        self.stack_info = None\n\n    def getMessage(self):\n        return self.msg\n\n\ndef run():\n    record = DemoRecord(\"shop\", \"INFO\", \"order 42 paid\")\n\n    # Same Formatter class, three different formatting strategies chosen by one argument.\n    percent = Formatter(\"%(levelname)s [%(name)s] %(message)s\", style=\"%\")\n    braces = Formatter(\"{levelname} [{name}] {message}\", style=\"{\")\n    dollar = Formatter(\"${levelname} [${name}] ${message}\", style=\"$\")\n\n    for formatter in (percent, braces, dollar):\n        print(formatter.format(record))\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "command",
      "name": "Command",
      "family": "Behavioral",
      "aka": [
        "Action",
        "Transaction"
      ],
      "tagline": "Wrap a request in an object so you can queue it, log it and undo it.",
      "intent": "Turn an action (\"insert this text\", \"paint this pixel\") into an object with a method to run it and, usually, a method to reverse it. The code that triggers actions (buttons, shortcuts, a history) only talks to that small interface, so it can store commands, replay them, and walk back and forth through an undo/redo history.",
      "analogy": "A waiter writes your order on a slip and pins it in the kitchen. The slip can wait in a queue, be handed to any cook, and be torn up if you change your mind; the waiter never cooks anything.",
      "cityShape": "Look for several command buildings that each have an execute/do floor and an undo floor at matching heights. A history (invoker) building has two list antennas on its roof (the undo and redo stacks) and sends pipes only to those floors, while the command buildings send pipes on to a separate receiver building that does the real work.",
      "roles": [
        {
          "name": "Command",
          "desc": "The interface: execute (or do) and undo, sometimes redo and a name."
        },
        {
          "name": "Concrete Command",
          "desc": "One specific action. It stores its parameters and whatever it needs to reverse itself."
        },
        {
          "name": "Receiver",
          "desc": "The object that actually knows how to do the work (a document, a canvas, a text widget)."
        },
        {
          "name": "Invoker",
          "desc": "Runs commands and keeps them, for example an undo/redo history or a button."
        },
        {
          "name": "Client",
          "desc": "Creates command objects and connects them to their receiver and invoker."
        }
      ],
      "whenToUse": [
        "You need undo/redo in an editor, a level editor or a drawing tool.",
        "Actions should be queued, scheduled, logged or replayed later (macros, network messages, input recording).",
        "Buttons, menu items and keyboard shortcuts should trigger the same action without duplicating its code."
      ],
      "pitfalls": [
        "Undo is only correct if each command saves enough state; forgetting the old value (or the deleted text) breaks it silently.",
        "Running a new command must clear the redo stack, otherwise redo replays actions on a document that has moved on.",
        "Wrapping every trivial call in a class adds lots of small files; use plain functions or closures when you do not need undo or queuing."
      ],
      "related": [
        "memento",
        "composite",
        "chain-of-responsibility",
        "strategy"
      ],
      "quiz": [
        {
          "q": "Why does a DeleteText command store the removed characters when it executes?",
          "options": [
            "To print them in a log",
            "So undo() can insert exactly those characters back",
            "Because the receiver requires it",
            "To make redo faster"
          ],
          "answer": 1,
          "why": "The document forgets deleted text. Only the command knows what was there, so it must remember it to reverse itself."
        },
        {
          "q": "You undo two steps, then type a new letter. What should happen to the redo stack?",
          "options": [
            "Keep it so the user can redo later",
            "Clear it, because those undone actions no longer fit the new history",
            "Move it onto the undo stack",
            "Execute everything in it first"
          ],
          "answer": 1,
          "why": "Redo commands were recorded against an older document state. After a new action they could corrupt the text, so editors discard them."
        }
      ],
      "demos": [
        {
          "id": "command-kt-editor",
          "title": "Text editor with undo and redo",
          "lang": "Kotlin",
          "level": "beginner",
          "source": null,
          "story": "Typing and deleting become InsertText and DeleteText objects. History runs them and keeps undo and redo stacks; Document just edits a string and knows nothing about history.",
          "roles": {
            "Command": [
              "command-kt-editor/Command.kt#Command"
            ],
            "Concrete Command": [
              "command-kt-editor/Commands.kt#InsertText",
              "command-kt-editor/Commands.kt#DeleteText"
            ],
            "Receiver": [
              "command-kt-editor/Document.kt#Document"
            ],
            "Invoker": [
              "command-kt-editor/History.kt#History"
            ],
            "Client": [
              "command-kt-editor/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "command-kt-editor/Main.kt#main",
              "say": "main() wraps each edit in a command object and passes it to the history instead of editing the document directly."
            },
            {
              "at": "command-kt-editor/History.kt#History.run",
              "say": "run() executes the command, pushes it on the undo stack and clears redo, because a new action starts a new future."
            },
            {
              "at": "command-kt-editor/Commands.kt#DeleteText.execute",
              "say": "Delete asks the document to remove text and saves what was removed. That saved text is what makes undo possible."
            },
            {
              "at": "command-kt-editor/Document.kt#Document.remove",
              "say": "The receiver does the real string work. It has no idea it is part of an undo system."
            },
            {
              "at": "command-kt-editor/History.kt#History.undo",
              "say": "undo() pops the last command, tells it to reverse itself, and moves it to the redo stack."
            },
            {
              "at": "command-kt-editor/Commands.kt#DeleteText.undo",
              "say": "The command puts the removed text back at the same position."
            },
            {
              "at": "command-kt-editor/History.kt#History.redo",
              "say": "redo() pops from the redo stack and simply executes the same object again."
            },
            {
              "at": "command-kt-editor/Commands.kt#InsertText.execute",
              "say": "Redoing an insert runs the very same execute() as the first time."
            }
          ],
          "files": {
            "command-kt-editor/Command.kt": "// The Command interface: an action packed into an object that can also take itself back.\ninterface Command {\n    fun execute()\n    fun undo()\n}\n",
            "command-kt-editor/Commands.kt": "// Concrete commands: each one remembers exactly what it needs to undo itself.\nclass InsertText(doc: Document, position: Int, text: String) : Command {\n    private val document: Document = doc\n    private val at = position\n    private val chars = text\n\n    override fun execute() {\n        document.insert(at, chars)\n    }\n\n    override fun undo() {\n        document.remove(at, chars.length)\n    }\n}\n\nclass DeleteText(doc: Document, position: Int, count: Int) : Command {\n    private val document: Document = doc\n    private val at = position\n    private val length = count\n    private var removed = \"\"\n\n    override fun execute() {\n        removed = document.remove(at, length)\n    }\n\n    override fun undo() {\n        document.insert(at, removed)\n    }\n}\n",
            "command-kt-editor/Document.kt": "// The Receiver: it knows how to change text, but nothing about undo or history.\nclass Document {\n    var text: String = \"\"\n\n    fun insert(position: Int, chars: String) {\n        text = text.substring(0, position) + chars + text.substring(position)\n    }\n\n    fun remove(position: Int, length: Int): String {\n        val removed = text.substring(position, position + length)\n        text = text.substring(0, position) + text.substring(position + length)\n        return removed\n    }\n}\n",
            "command-kt-editor/History.kt": "// The Invoker: it runs commands and keeps two stacks so it can step back and forward.\nclass History {\n    private val undoStack = ArrayDeque<Command>()\n    private val redoStack = ArrayDeque<Command>()\n\n    fun run(command: Command) {\n        command.execute()\n        undoStack.addLast(command)\n        redoStack.clear()  // a new action makes the old \"future\" invalid\n    }\n\n    fun undo() {\n        val command = undoStack.removeLastOrNull() ?: return\n        command.undo()\n        redoStack.addLast(command)\n    }\n\n    fun redo() {\n        val command = redoStack.removeLastOrNull() ?: return\n        command.execute()\n        undoStack.addLast(command)\n    }\n}\n",
            "command-kt-editor/Main.kt": "// The Client: it builds commands and hands them to the history.\nfun main() {\n    val doc = Document()\n    val history = History()\n\n    history.run(InsertText(doc, 0, \"Hello\"))\n    history.run(InsertText(doc, 5, \" world\"))\n    history.run(DeleteText(doc, 0, 6))\n    println(doc.text)   // \"world\"\n\n    history.undo()\n    println(doc.text)   // \"Hello world\"\n\n    history.undo()\n    println(doc.text)   // \"Hello\"\n\n    history.redo()\n    println(doc.text)   // \"Hello world\"\n}\n"
          }
        },
        {
          "id": "command-go-pixel-art",
          "title": "Pixel-art canvas with macro commands",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "Painting a pixel is a command, and drawing a line is a macro command made of many pixel commands. The History invoker undoes the whole line in one step.",
          "roles": {
            "Command": [
              "command-go-pixel-art/command.go#Command"
            ],
            "Concrete Command": [
              "command-go-pixel-art/commands.go#PaintCommand",
              "command-go-pixel-art/commands.go#LineCommand"
            ],
            "Receiver": [
              "command-go-pixel-art/canvas.go#Canvas"
            ],
            "Invoker": [
              "command-go-pixel-art/history.go#History"
            ],
            "Client": [
              "command-go-pixel-art/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "command-go-pixel-art/main.go#main",
              "say": "main() builds a single paint command and a whole line command, then hands both to the history."
            },
            {
              "at": "command-go-pixel-art/commands.go#NewHorizontalLine",
              "say": "A line is built as a list of PaintCommands. A command made of commands is called a macro."
            },
            {
              "at": "command-go-pixel-art/history.go#History.Execute",
              "say": "Execute() runs Do(), records the command and clears the redo list. It treats a pixel and a line the same."
            },
            {
              "at": "command-go-pixel-art/commands.go#LineCommand.Do",
              "say": "The macro just calls Do() on each step in order."
            },
            {
              "at": "command-go-pixel-art/commands.go#PaintCommand.Do",
              "say": "Each step reads the old colour from the canvas before painting, so it can restore it later."
            },
            {
              "at": "command-go-pixel-art/history.go#History.Undo",
              "say": "Undo pops the last command, which is the whole line, and asks it to undo."
            },
            {
              "at": "command-go-pixel-art/commands.go#LineCommand.Undo",
              "say": "The macro undoes its steps in reverse order, so overlapping pixels come back correctly."
            },
            {
              "at": "command-go-pixel-art/history.go#History.Redo",
              "say": "Redo moves the line back to the done list by calling Do() again."
            }
          ],
          "files": {
            "command-go-pixel-art/canvas.go": "package main\n\nimport \"strings\"\n\n// Canvas is the Receiver: a grid of colour letters with plain get/set operations.\n// It knows nothing about commands, undo or history.\ntype Canvas struct {\n\twidth  int\n\theight int\n\tpixels []byte\n}\n\nfunc NewCanvas(width, height int) *Canvas {\n\treturn &Canvas{width: width, height: height, pixels: []byte(strings.Repeat(\".\", width*height))}\n}\n\nfunc (c *Canvas) Get(x, y int) byte {\n\treturn c.pixels[y*c.width+x]\n}\n\nfunc (c *Canvas) Set(x, y int, colour byte) {\n\tc.pixels[y*c.width+x] = colour\n}\n\nfunc (c *Canvas) String() string {\n\tvar sb strings.Builder\n\tfor y := 0; y < c.height; y++ {\n\t\tsb.Write(c.pixels[y*c.width : (y+1)*c.width])\n\t\tsb.WriteByte('\\n')\n\t}\n\treturn sb.String()\n}\n",
            "command-go-pixel-art/command.go": "package main\n\n// Command is the interface every editor action implements.\n// Do applies the change; Undo puts the canvas back exactly as it was.\ntype Command interface {\n\tDo()\n\tUndo()\n\tName() string\n}\n",
            "command-go-pixel-art/commands.go": "package main\n\n// PaintCommand colours one pixel and remembers the old colour for undo.\ntype PaintCommand struct {\n\tcanvas *Canvas\n\tx, y   int\n\tcolour byte\n\tbefore byte\n}\n\nfunc (p *PaintCommand) Do() {\n\tp.before = p.canvas.Get(p.x, p.y)\n\tp.canvas.Set(p.x, p.y, p.colour)\n}\n\nfunc (p *PaintCommand) Undo() {\n\tp.canvas.Set(p.x, p.y, p.before)\n}\n\nfunc (p *PaintCommand) Name() string {\n\treturn \"paint\"\n}\n\n// LineCommand is a macro: a list of smaller commands that act as one undo step.\ntype LineCommand struct {\n\tsteps []Command\n}\n\nfunc NewHorizontalLine(canvas *Canvas, x1, x2, y int, colour byte) *LineCommand {\n\tline := &LineCommand{}\n\tfor x := x1; x <= x2; x++ {\n\t\tline.steps = append(line.steps, &PaintCommand{canvas: canvas, x: x, y: y, colour: colour})\n\t}\n\treturn line\n}\n\nfunc (l *LineCommand) Do() {\n\tfor _, step := range l.steps {\n\t\tstep.Do()\n\t}\n}\n\nfunc (l *LineCommand) Undo() {\n\t// Undo in reverse order, so overlapping pixels come back correctly.\n\tfor i := len(l.steps) - 1; i >= 0; i-- {\n\t\tl.steps[i].Undo()\n\t}\n}\n\nfunc (l *LineCommand) Name() string {\n\treturn \"line\"\n}\n",
            "command-go-pixel-art/history.go": "package main\n\nimport \"fmt\"\n\n// History is the Invoker. It never looks inside a command; it only calls Do and Undo\n// and moves commands between the undo and redo stacks.\ntype History struct {\n\tdone   []Command\n\tundone []Command\n}\n\nfunc (h *History) Execute(cmd Command) {\n\tcmd.Do()\n\th.done = append(h.done, cmd)\n\th.undone = nil\n\tfmt.Println(\"did\", cmd.Name())\n}\n\nfunc (h *History) Undo() bool {\n\tif len(h.done) == 0 {\n\t\treturn false\n\t}\n\tcmd := h.done[len(h.done)-1]\n\th.done = h.done[:len(h.done)-1]\n\tcmd.Undo()\n\th.undone = append(h.undone, cmd)\n\treturn true\n}\n\nfunc (h *History) Redo() bool {\n\tif len(h.undone) == 0 {\n\t\treturn false\n\t}\n\tcmd := h.undone[len(h.undone)-1]\n\th.undone = h.undone[:len(h.undone)-1]\n\tcmd.Do()\n\th.done = append(h.done, cmd)\n\treturn true\n}\n",
            "command-go-pixel-art/main.go": "package main\n\nimport \"fmt\"\n\n// The Client: it turns user actions into command objects and gives them to the history.\nfunc main() {\n\tcanvas := NewCanvas(6, 3)\n\thistory := &History{}\n\n\thistory.Execute(&PaintCommand{canvas: canvas, x: 0, y: 0, colour: 'R'})\n\thistory.Execute(NewHorizontalLine(canvas, 0, 5, 1, 'B'))\n\tfmt.Print(canvas)\n\n\thistory.Undo() // the whole line disappears in one step\n\tfmt.Print(canvas)\n\n\thistory.Redo() // and comes back\n\tfmt.Print(canvas)\n}\n"
          }
        },
        {
          "id": "command-idle-undo-real",
          "title": "IDLE's undo system",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/idlelib/undo.py",
            "license": "PSF-2.0",
            "note": "idlelib/undo.py and idlelib/delegator.py are verbatim excerpts from CPython 3.12.7 (Lib/idlelib) with unrelated parts cut and marked; usage.py was written for Software City."
          },
          "story": "Python's own IDLE editor turns every insert and delete into a command object with do, undo and redo. A pointer into one list replaces separate undo/redo stacks, and CommandSequence groups edits into one step.",
          "roles": {
            "Command": [
              "command-idle-undo-real/idlelib/undo.py#Command"
            ],
            "Concrete Command": [
              "command-idle-undo-real/idlelib/undo.py#InsertCommand",
              "command-idle-undo-real/idlelib/undo.py#DeleteCommand",
              "command-idle-undo-real/idlelib/undo.py#CommandSequence"
            ],
            "Receiver": [
              "command-idle-undo-real/idlelib/delegator.py#Delegator"
            ],
            "Invoker": [
              "command-idle-undo-real/idlelib/undo.py#UndoDelegator"
            ],
            "Client": [
              "command-idle-undo-real/usage.py#run"
            ]
          },
          "trace": [
            {
              "at": "command-idle-undo-real/usage.py#run",
              "say": "run() attaches an UndoDelegator to a Text widget, then edits through the delegator instead of the widget."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#UndoDelegator.insert",
              "say": "insert() does not touch the text itself. It wraps the request in an InsertCommand and hands it to addcmd()."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#UndoDelegator.addcmd",
              "say": "addcmd() runs the command, cuts off any redo tail with undolist[pointer:] = [cmd], and moves the pointer forward."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#InsertCommand.do",
              "say": "do() inserts into the real widget (the receiver) and records the indexes it needs to undo itself."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#UndoDelegator.undo_block_stop",
              "say": "Edits between undo_block_start and stop are collected in a CommandSequence and stored as one command."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#UndoDelegator.undo_event",
              "say": "Ctrl+Z: take the command just before the pointer, call its undo(), move the pointer back."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#CommandSequence.undo",
              "say": "A sequence undoes its children in reverse order, the same trick as any macro command."
            },
            {
              "at": "command-idle-undo-real/idlelib/undo.py#UndoDelegator.redo_event",
              "say": "Redo uses the command at the pointer and calls redo(). Nothing is deleted until a new edit arrives."
            }
          ],
          "files": {
            "command-idle-undo-real/idlelib/delegator.py": "# Source: CPython 3.12.7 (IDLE) — https://github.com/python/cpython/blob/v3.12.7/Lib/idlelib/delegator.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\nclass Delegator:\n\n    def __init__(self, delegate=None):\n        self.delegate = delegate\n        self.__cache = set()\n        # Cache is used to only remove added attributes\n        # when changing the delegate.\n\n    def __getattr__(self, name):\n        attr = getattr(self.delegate, name) # May raise AttributeError\n        setattr(self, name, attr)\n        self.__cache.add(name)\n        return attr\n\n    def resetcache(self):\n        \"Removes added attributes while leaving original attributes.\"\n        # Function is really about resetting delegator dict\n        # to original state.  Cache is just a means\n        for key in self.__cache:\n            try:\n                delattr(self, key)\n            except AttributeError:\n                pass\n        self.__cache.clear()\n\n    def setdelegate(self, delegate):\n        \"Reset attributes and change delegate.\"\n        self.resetcache()\n        self.delegate = delegate\n\n\n# … trimmed: 3 lines that run the unit tests …\n",
            "command-idle-undo-real/idlelib/undo.py": "# Source: CPython 3.12.7 (IDLE) — https://github.com/python/cpython/blob/v3.12.7/Lib/idlelib/undo.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\nimport string\n\nfrom idlelib.delegator import Delegator\n\n# tkinter import not needed because module does not create widgets,\n# although many methods operate on text widget arguments.\n\n# … trimmed: 12 lines of key-binding notes (<<undo>> is Control-z, <<redo>> is Control-y) …\n\nclass UndoDelegator(Delegator):\n\n    max_undo = 1000\n\n    def __init__(self):\n        Delegator.__init__(self)\n        self.reset_undo()\n\n    def setdelegate(self, delegate):\n        if self.delegate is not None:\n            self.unbind(\"<<undo>>\")\n            self.unbind(\"<<redo>>\")\n            self.unbind(\"<<dump-undo-state>>\")\n        Delegator.setdelegate(self, delegate)\n        if delegate is not None:\n            self.bind(\"<<undo>>\", self.undo_event)\n            self.bind(\"<<redo>>\", self.redo_event)\n            self.bind(\"<<dump-undo-state>>\", self.dump_event)\n\n    # … trimmed: dump_event(), a 10-line debugging helper …\n\n    def reset_undo(self):\n        self.was_saved = -1\n        self.pointer = 0\n        self.undolist = []\n        self.undoblock = 0  # or a CommandSequence instance\n        self.set_saved(1)\n\n    # … trimmed: 25 lines that track whether the file is \"saved\" (set_saved, get_saved, check_saved, …) …\n\n    def insert(self, index, chars, tags=None):\n        self.addcmd(InsertCommand(index, chars, tags))\n\n    def delete(self, index1, index2=None):\n        self.addcmd(DeleteCommand(index1, index2))\n\n    # Clients should call undo_block_start() and undo_block_stop()\n    # around a sequence of editing cmds to be treated as a unit by\n    # undo & redo.  Nested matching calls are OK, and the inner calls\n    # then act like nops.  OK too if no editing cmds, or only one\n    # editing cmd, is issued in between:  if no cmds, the whole\n    # sequence has no effect; and if only one cmd, that cmd is entered\n    # directly into the undo list, as if undo_block_xxx hadn't been\n    # called.  The intent of all that is to make this scheme easy\n    # to use:  all the client has to worry about is making sure each\n    # _start() call is matched by a _stop() call.\n\n    def undo_block_start(self):\n        if self.undoblock == 0:\n            self.undoblock = CommandSequence()\n        self.undoblock.bump_depth()\n\n    def undo_block_stop(self):\n        if self.undoblock.bump_depth(-1) == 0:\n            cmd = self.undoblock\n            self.undoblock = 0\n            if len(cmd) > 0:\n                if len(cmd) == 1:\n                    # no need to wrap a single cmd\n                    cmd = cmd.getcmd(0)\n                # this blk of cmds, or single cmd, has already\n                # been done, so don't execute it again\n                self.addcmd(cmd, 0)\n\n    def addcmd(self, cmd, execute=True):\n        if execute:\n            cmd.do(self.delegate)\n        if self.undoblock != 0:\n            self.undoblock.append(cmd)\n            return\n        if self.can_merge and self.pointer > 0:\n            lastcmd = self.undolist[self.pointer-1]\n            if lastcmd.merge(cmd):\n                return\n        self.undolist[self.pointer:] = [cmd]\n        if self.saved > self.pointer:\n            self.saved = -1\n        self.pointer = self.pointer + 1\n        if len(self.undolist) > self.max_undo:\n            ##print \"truncating undo list\"\n            del self.undolist[0]\n            self.pointer = self.pointer - 1\n            if self.saved >= 0:\n                self.saved = self.saved - 1\n        self.can_merge = True\n        self.check_saved()\n\n    def undo_event(self, event):\n        if self.pointer == 0:\n            self.bell()\n            return \"break\"\n        cmd = self.undolist[self.pointer - 1]\n        cmd.undo(self.delegate)\n        self.pointer = self.pointer - 1\n        self.can_merge = False\n        self.check_saved()\n        return \"break\"\n\n    def redo_event(self, event):\n        if self.pointer >= len(self.undolist):\n            self.bell()\n            return \"break\"\n        cmd = self.undolist[self.pointer]\n        cmd.redo(self.delegate)\n        self.pointer = self.pointer + 1\n        self.can_merge = False\n        self.check_saved()\n        return \"break\"\n\n\nclass Command:\n    # Base class for Undoable commands\n\n    tags = None\n\n    def __init__(self, index1, index2, chars, tags=None):\n        self.marks_before = {}\n        self.marks_after = {}\n        self.index1 = index1\n        self.index2 = index2\n        self.chars = chars\n        if tags:\n            self.tags = tags\n\n    # … trimmed: __repr__ (6 lines) …\n\n    def do(self, text):\n        pass\n\n    def redo(self, text):\n        pass\n\n    def undo(self, text):\n        pass\n\n    def merge(self, cmd):\n        return 0\n\n    def save_marks(self, text):\n        marks = {}\n        for name in text.mark_names():\n            if name != \"insert\" and name != \"current\":\n                marks[name] = text.index(name)\n        return marks\n\n    def set_marks(self, text, marks):\n        for name, index in marks.items():\n            text.mark_set(name, index)\n\n\nclass InsertCommand(Command):\n    # Undoable insert command\n\n    def __init__(self, index1, chars, tags=None):\n        Command.__init__(self, index1, None, chars, tags)\n\n    def do(self, text):\n        self.marks_before = self.save_marks(text)\n        self.index1 = text.index(self.index1)\n        if text.compare(self.index1, \">\", \"end-1c\"):\n            # Insert before the final newline\n            self.index1 = text.index(\"end-1c\")\n        text.insert(self.index1, self.chars, self.tags)\n        self.index2 = text.index(\"%s+%dc\" % (self.index1, len(self.chars)))\n        self.marks_after = self.save_marks(text)\n        ##sys.__stderr__.write(\"do: %s\\n\" % self)\n\n    def redo(self, text):\n        text.mark_set('insert', self.index1)\n        text.insert(self.index1, self.chars, self.tags)\n        self.set_marks(text, self.marks_after)\n        text.see('insert')\n        ##sys.__stderr__.write(\"redo: %s\\n\" % self)\n\n    def undo(self, text):\n        text.mark_set('insert', self.index1)\n        text.delete(self.index1, self.index2)\n        self.set_marks(text, self.marks_before)\n        text.see('insert')\n        ##sys.__stderr__.write(\"undo: %s\\n\" % self)\n\n    # … trimmed: merge() and classify(), 25 lines that join single typed characters into one undo step …\n\nclass DeleteCommand(Command):\n    # Undoable delete command\n\n    def __init__(self, index1, index2=None):\n        Command.__init__(self, index1, index2, None, None)\n\n    def do(self, text):\n        self.marks_before = self.save_marks(text)\n        self.index1 = text.index(self.index1)\n        if self.index2:\n            self.index2 = text.index(self.index2)\n        else:\n            self.index2 = text.index(self.index1 + \" +1c\")\n        if text.compare(self.index2, \">\", \"end-1c\"):\n            # Don't delete the final newline\n            self.index2 = text.index(\"end-1c\")\n        self.chars = text.get(self.index1, self.index2)\n        text.delete(self.index1, self.index2)\n        self.marks_after = self.save_marks(text)\n        ##sys.__stderr__.write(\"do: %s\\n\" % self)\n\n    def redo(self, text):\n        text.mark_set('insert', self.index1)\n        text.delete(self.index1, self.index2)\n        self.set_marks(text, self.marks_after)\n        text.see('insert')\n        ##sys.__stderr__.write(\"redo: %s\\n\" % self)\n\n    def undo(self, text):\n        text.mark_set('insert', self.index1)\n        text.insert(self.index1, self.chars)\n        self.set_marks(text, self.marks_before)\n        text.see('insert')\n        ##sys.__stderr__.write(\"undo: %s\\n\" % self)\n\n\nclass CommandSequence(Command):\n    # Wrapper for a sequence of undoable cmds to be undone/redone\n    # as a unit\n\n    def __init__(self):\n        self.cmds = []\n        self.depth = 0\n\n    # … trimmed: __repr__ (6 lines) …\n\n    def __len__(self):\n        return len(self.cmds)\n\n    def append(self, cmd):\n        self.cmds.append(cmd)\n\n    def getcmd(self, i):\n        return self.cmds[i]\n\n    def redo(self, text):\n        for cmd in self.cmds:\n            cmd.redo(text)\n\n    def undo(self, text):\n        cmds = self.cmds[:]\n        cmds.reverse()\n        for cmd in cmds:\n            cmd.undo(text)\n\n    def bump_depth(self, incr=1):\n        self.depth = self.depth + incr\n        return self.depth\n\n# … trimmed: 30 lines of manual-test GUI code …\n",
            "command-idle-undo-real/usage.py": "# Example usage written for Software City (not part of CPython).\n# IDLE normally plugs the UndoDelegator into its editor window through a Percolator;\n# here we attach it straight to a tkinter Text widget so the flow is easy to follow.\nimport tkinter as tk\n\nfrom idlelib.undo import UndoDelegator\n\n\ndef run():\n    root = tk.Tk()\n    root.withdraw()\n    text = tk.Text(root)\n\n    undo = UndoDelegator()\n    undo.setdelegate(text)\n\n    # Each edit becomes a command object stored in the undo list.\n    undo.insert(\"1.0\", \"print('hi')\")\n    undo.delete(\"1.0\", \"1.5\")\n    print(text.get(\"1.0\", \"end-1c\"))   # \"('hi')\"\n\n    # Several edits grouped into one CommandSequence: one undo step.\n    undo.undo_block_start()\n    undo.insert(\"end-1c\", \"  # one\")\n    undo.insert(\"end-1c\", \" two\")\n    undo.undo_block_stop()\n\n    undo.undo_event(None)   # removes both comment parts at once\n    undo.undo_event(None)   # brings back \"print\"\n    undo.redo_event(None)   # deletes \"print\" again\n    print(text.get(\"1.0\", \"end-1c\"))\n    root.destroy()\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "state",
      "name": "State",
      "family": "Behavioral",
      "aka": [
        "State machine",
        "Finite state machine (FSM)",
        "Objects for states"
      ],
      "tagline": "An object changes its behaviour by swapping the state object it delegates to.",
      "intent": "When an object behaves differently depending on what mode it is in (idle, running, jumping; pending, paid, shipped), put each mode in its own class. The object (the context) forwards its calls to the current state object, and the states decide when to switch to another state, replacing big if/else or switch blocks that check flags.",
      "analogy": "A traffic light: the same button press or timer tick means something different when the light is red, amber or green. Each colour knows which colour comes next.",
      "cityShape": "Look for a cluster of state buildings, each with the same floors (enter, update/physics_update, or Pay/Ship/Cancel) at the same heights. The context building has one state antenna on its roof and a change_state/TransitionTo floor that the state buildings call back into, so pipes run both ways between the context and the states.",
      "roles": [
        {
          "name": "Context",
          "desc": "The object the outside world talks to. It holds the current state and forwards calls to it."
        },
        {
          "name": "State",
          "desc": "The interface or base class that lists what every state must handle."
        },
        {
          "name": "Concrete State",
          "desc": "One mode of behaviour. It handles calls its own way and decides when to switch to another state."
        }
      ],
      "whenToUse": [
        "A character, UI screen or network connection has clear modes and your code is full of if is_jumping / if state == ... checks.",
        "The rules for what can happen next depend on the current mode (you can't ship an unpaid order, you can't jump while in the air).",
        "You want each mode's logic in one place so adding a new mode (crouch, dash, refunded) does not touch the others."
      ],
      "pitfalls": [
        "For two or three trivial states an enum plus a match statement is shorter and perfectly fine.",
        "When states create each other directly they become coupled; a state machine node with a name-to-state map (as in the Godot demo) keeps them independent.",
        "Forgetting exit/enter work (stopping a timer, resetting velocity) when switching causes bugs that only appear in some transitions."
      ],
      "related": [
        "strategy",
        "memento",
        "observer",
        "game-loop"
      ],
      "quiz": [
        {
          "q": "In the State pattern, who usually decides to switch from Run to Jump?",
          "options": [
            "The Run state, when it sees the jump input",
            "The game engine",
            "A global variable checked every frame",
            "The Jump state, before it exists"
          ],
          "answer": 0,
          "why": "Each concrete state knows its own exits. Run reacts to the jump input by asking the context to change to the Jump state."
        },
        {
          "q": "Why can't the player double jump in the beginner Godot demo, even though there is no 'if not is_jumping' check?",
          "options": [
            "Godot blocks it automatically",
            "The Jump state's physics_update simply never looks at the jump input",
            "The jump button is disabled after one press",
            "Gravity is too strong"
          ],
          "answer": 1,
          "why": "Behaviour lives in the current state object. While in Jump, only Jump's code runs, and it has no jump handling, so the bug cannot happen."
        }
      ],
      "demos": [
        {
          "id": "state-gd-player",
          "title": "Platformer player: idle, run, jump",
          "lang": "GDScript",
          "level": "beginner",
          "source": null,
          "story": "The player hands every physics frame to its current state object. Idle, Run and Jump each decide when to switch, so player.gd has no is_jumping flags at all.",
          "roles": {
            "Context": [
              "state-gd-player/player.gd#_physics_process",
              "state-gd-player/player.gd#change_state"
            ],
            "State": [
              "state-gd-player/player_state.gd#physics_update"
            ],
            "Concrete State": [
              "state-gd-player/idle_state.gd#physics_update",
              "state-gd-player/run_state.gd#physics_update",
              "state-gd-player/jump_state.gd#physics_update"
            ]
          },
          "trace": [
            {
              "at": "state-gd-player/player.gd#_ready",
              "say": "The player starts in the Idle state. It stores a state object instead of flags like is_running."
            },
            {
              "at": "state-gd-player/player.gd#_physics_process",
              "say": "Every frame the player forwards the work to whatever state it holds, then moves."
            },
            {
              "at": "state-gd-player/idle_state.gd#physics_update",
              "say": "Idle checks only its own exits: a direction key means Run, the jump key means Jump."
            },
            {
              "at": "state-gd-player/player.gd#change_state",
              "say": "change_state() swaps the object and calls enter(), so each state can set itself up."
            },
            {
              "at": "state-gd-player/run_state.gd#physics_update",
              "say": "Run moves the player sideways and goes back to Idle when no key is held."
            },
            {
              "at": "state-gd-player/jump_state.gd#enter",
              "say": "Entering Jump sets the upward velocity once. Setup lives with the state it belongs to."
            },
            {
              "at": "state-gd-player/jump_state.gd#physics_update",
              "say": "Jump applies gravity and ignores the jump key, so double jumps are impossible by design. Landing returns to Idle."
            }
          ],
          "files": {
            "state-gd-player/idle_state.gd": "class_name IdleState\nextends PlayerState\n\nfunc enter() -> void:\n\tplayer.velocity.x = 0.0\n\tplayer.play_animation(\"idle\")\n\n# Idle only knows its own exits: start running or jump.\nfunc physics_update(delta: float) -> void:\n\tif Input.is_action_just_pressed(\"jump\"):\n\t\tplayer.change_state(JumpState.new(player))\n\telif Input.get_axis(\"move_left\", \"move_right\") != 0.0:\n\t\tplayer.change_state(RunState.new(player))\n",
            "state-gd-player/jump_state.gd": "class_name JumpState\nextends PlayerState\n\nfunc enter() -> void:\n\tplayer.velocity.y = player.jump_velocity\n\tplayer.play_animation(\"jump\")\n\n# In the air you can steer, but pressing jump again does nothing: no double jump bug.\nfunc physics_update(delta: float) -> void:\n\tplayer.velocity.y += player.gravity * delta\n\tplayer.velocity.x = Input.get_axis(\"move_left\", \"move_right\") * player.speed\n\tif player.is_on_floor() and player.velocity.y >= 0.0:\n\t\tplayer.change_state(IdleState.new(player))\n",
            "state-gd-player/player.gd": "class_name Player\nextends CharacterBody2D\n\n# The Context. It has no \"if is_jumping\" checks; it hands each frame to its current state.\n@export var speed := 220.0\n@export var jump_velocity := -420.0\n@export var gravity := 980.0\n\nvar state: PlayerState\n\nfunc _ready() -> void:\n\tchange_state(IdleState.new(self))\n\nfunc change_state(new_state: PlayerState) -> void:\n\tstate = new_state\n\tstate.enter()\n\nfunc _physics_process(delta: float) -> void:\n\tstate.physics_update(delta)\n\tmove_and_slide()\n\nfunc play_animation(anim_name: String) -> void:\n\t$AnimatedSprite2D.play(anim_name)\n",
            "state-gd-player/player_state.gd": "class_name PlayerState\nextends RefCounted\n\n# The State base class. Each state answers \"what do I do now?\" for the player.\nvar player: Player\n\nfunc _init(owner_player: Player) -> void:\n\tplayer = owner_player\n\nfunc enter() -> void:\n\tpass\n\nfunc physics_update(delta: float) -> void:\n\tpass\n",
            "state-gd-player/run_state.gd": "class_name RunState\nextends PlayerState\n\nfunc enter() -> void:\n\tplayer.play_animation(\"run\")\n\nfunc physics_update(delta: float) -> void:\n\tvar direction := Input.get_axis(\"move_left\", \"move_right\")\n\tplayer.velocity.x = direction * player.speed\n\tif Input.is_action_just_pressed(\"jump\"):\n\t\tplayer.change_state(JumpState.new(player))\n\telif direction == 0.0:\n\t\tplayer.change_state(IdleState.new(player))\n"
          }
        },
        {
          "id": "state-cs-order",
          "title": "Online order lifecycle",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "An order is Pending, Paid, Shipped or Cancelled. Calling Ship() or Cancel() means something different in each state, and the state classes, not Order, decide the transitions.",
          "roles": {
            "Context": [
              "state-cs-order/Order.cs#Order"
            ],
            "State": [
              "state-cs-order/IOrderState.cs#IOrderState"
            ],
            "Concrete State": [
              "state-cs-order/States.cs#PendingState",
              "state-cs-order/States.cs#PaidState",
              "state-cs-order/States.cs#ShippedState",
              "state-cs-order/States.cs#CancelledState"
            ]
          },
          "trace": [
            {
              "at": "state-cs-order/Program.cs#Program.Main",
              "say": "The client tries to ship before paying, pays in two parts, ships, then tries to cancel."
            },
            {
              "at": "state-cs-order/Order.cs#Order.Ship",
              "say": "Order.Ship() has no if/else. It forwards the call to the current state object."
            },
            {
              "at": "state-cs-order/States.cs#PendingState.Ship",
              "say": "In Pending, shipping is refused. The rule lives in the state that owns it."
            },
            {
              "at": "state-cs-order/States.cs#PendingState.Pay",
              "say": "Pending adds up payments and only moves on once the total is covered."
            },
            {
              "at": "state-cs-order/Order.cs#Order.TransitionTo",
              "say": "The state tells the order to switch. TransitionTo is internal, so outsiders cannot jump states."
            },
            {
              "at": "state-cs-order/States.cs#PaidState.Ship",
              "say": "The same Ship() call now succeeds and moves the order to Shipped."
            },
            {
              "at": "state-cs-order/States.cs#ShippedState.Cancel",
              "say": "Cancel after shipping is refused with a helpful message instead of a crash."
            }
          ],
          "files": {
            "state-cs-order/IOrderState.cs": "namespace Shop.Orders;\n\n// The State interface: every order action, answered differently by each state.\npublic interface IOrderState\n{\n    string Name { get; }\n    void Pay(Order order, decimal amount);\n    void Ship(Order order);\n    void Cancel(Order order);\n}\n",
            "state-cs-order/Order.cs": "using System;\n\nnamespace Shop.Orders;\n\n// The Context. Its public methods look the same in every state;\n// what they actually do depends on the state object it currently holds.\npublic class Order\n{\n    private IOrderState _state = new PendingState();\n\n    public string Id { get; }\n    public decimal Total { get; }\n    public decimal Paid { get; set; }\n\n    public Order(string id, decimal total)\n    {\n        Id = id;\n        Total = total;\n    }\n\n    public string Status => _state.Name;\n\n    public void Pay(decimal amount)\n    {\n        _state.Pay(this, amount);\n    }\n\n    public void Ship()\n    {\n        _state.Ship(this);\n    }\n\n    public void Cancel()\n    {\n        _state.Cancel(this);\n    }\n\n    // Only states call this. The order never decides its own next state.\n    internal void TransitionTo(IOrderState next)\n    {\n        Console.WriteLine($\"Order {Id}: {_state.Name} -> {next.Name}\");\n        _state = next;\n    }\n}\n",
            "state-cs-order/Program.cs": "using System;\nusing Shop.Orders;\n\npublic static class Program\n{\n    // The client calls the same three methods; the order's reaction changes with its state.\n    public static void Main()\n    {\n        var order = new Order(\"A-1001\", 50m);\n        order.Ship();        // refused: not paid\n        order.Pay(20m);      // still pending\n        order.Pay(30m);      // Pending -> Paid\n        order.Ship();        // Paid -> Shipped\n        order.Cancel();      // refused: already shipped\n        Console.WriteLine(\"Final status: \" + order.Status);\n    }\n}\n",
            "state-cs-order/States.cs": "using System;\n\nnamespace Shop.Orders;\n\n// Concrete states. Each class holds the rules for one stage of an order's life.\npublic class PendingState : IOrderState\n{\n    public string Name => \"Pending\";\n\n    public void Pay(Order order, decimal amount)\n    {\n        order.Paid += amount;\n        if (order.Paid >= order.Total)\n        {\n            order.TransitionTo(new PaidState());\n        }\n    }\n\n    public void Ship(Order order)\n    {\n        Console.WriteLine(\"Cannot ship: the order is not paid yet.\");\n    }\n\n    public void Cancel(Order order)\n    {\n        order.TransitionTo(new CancelledState(\"customer cancelled before paying\"));\n    }\n}\n\npublic class PaidState : IOrderState\n{\n    public string Name => \"Paid\";\n\n    public void Pay(Order order, decimal amount)\n    {\n        Console.WriteLine(\"Already paid.\");\n    }\n\n    public void Ship(Order order)\n    {\n        order.TransitionTo(new ShippedState());\n    }\n\n    public void Cancel(Order order)\n    {\n        Console.WriteLine($\"Refunding {order.Paid:C}.\");\n        order.TransitionTo(new CancelledState(\"refunded\"));\n    }\n}\n\npublic class ShippedState : IOrderState\n{\n    public string Name => \"Shipped\";\n\n    public void Pay(Order order, decimal amount)\n    {\n        Console.WriteLine(\"Already paid.\");\n    }\n\n    public void Ship(Order order)\n    {\n        Console.WriteLine(\"Already on its way.\");\n    }\n\n    public void Cancel(Order order)\n    {\n        Console.WriteLine(\"Too late to cancel; please return the parcel instead.\");\n    }\n}\n\npublic class CancelledState : IOrderState\n{\n    private readonly string _reason;\n\n    public CancelledState(string reason)\n    {\n        _reason = reason;\n    }\n\n    public string Name => \"Cancelled (\" + _reason + \")\";\n\n    public void Pay(Order order, decimal amount)\n    {\n        Console.WriteLine(\"This order was cancelled.\");\n    }\n\n    public void Ship(Order order)\n    {\n        Console.WriteLine(\"This order was cancelled.\");\n    }\n\n    public void Cancel(Order order)\n    {\n        Console.WriteLine(\"Already cancelled.\");\n    }\n}\n"
          }
        },
        {
          "id": "state-godot-fsm-real",
          "title": "Godot demo: pushdown state machine",
          "lang": "GDScript",
          "level": "advanced",
          "source": {
            "repo": "godotengine/godot-demo-projects",
            "url": "https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/state_machine/state_machine.gd",
            "license": "MIT",
            "note": "Nine verbatim files from 2d/finite_state_machine at tag 4.7-6ad6167 (state machine, base state, player states); combat states, debug views and scenes are not included."
          },
          "story": "The official Godot demo makes each state a child Node. States emit a finished signal with the next state's name, and the machine keeps a stack so Jump can return to whatever state came before.",
          "roles": {
            "Context": [
              "state-godot-fsm-real/state_machine/state_machine.gd#_change_state",
              "state-godot-fsm-real/player/player_state_machine.gd#_change_state"
            ],
            "State": [
              "state-godot-fsm-real/state_machine/state.gd#update",
              "state-godot-fsm-real/state_machine/state.gd#enter"
            ],
            "Concrete State": [
              "state-godot-fsm-real/player/states/motion/on_ground/idle.gd#update",
              "state-godot-fsm-real/player/states/motion/on_ground/move.gd#update",
              "state-godot-fsm-real/player/states/motion/in_air/jump.gd#update"
            ]
          },
          "trace": [
            {
              "at": "state-godot-fsm-real/state_machine/state_machine.gd#_enter_tree",
              "say": "The machine connects every child state's finished signal to _change_state, so states never call each other directly."
            },
            {
              "at": "state-godot-fsm-real/state_machine/state_machine.gd#_physics_process",
              "say": "Each frame the machine forwards to current_state.update(). It is the context."
            },
            {
              "at": "state-godot-fsm-real/player/states/motion/on_ground/idle.gd#update",
              "say": "Idle sees a direction and emits finished('move'). It only names the next state."
            },
            {
              "at": "state-godot-fsm-real/player/states/motion/on_ground/on_ground.gd#handle_input",
              "say": "Shared ground logic sits in a parent class: any ground state can start a jump."
            },
            {
              "at": "state-godot-fsm-real/player/player_state_machine.gd#_change_state",
              "say": "The player machine pushes Jump on top of the stack and passes Move's speed into it before switching."
            },
            {
              "at": "state-godot-fsm-real/state_machine/state_machine.gd#_change_state",
              "say": "The base machine calls exit() on the old state, swaps current_state and calls enter() on the new one."
            },
            {
              "at": "state-godot-fsm-real/player/states/motion/in_air/jump.gd#update",
              "say": "Jump steers in the air and, on landing, emits 'previous'."
            },
            {
              "at": "state-godot-fsm-real/state_machine/state_machine.gd#_change_state",
              "say": "'previous' pops the stack, so the player returns to Idle or Move, whichever it was in. That is a pushdown automaton."
            }
          ],
          "files": {
            "state-godot-fsm-real/player/player_state.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/player_state.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"res://state_machine/state.gd\"\n\nconst PLAYER_STATE: Dictionary[StringName, StringName]= {\n\t&\"previous\": &\"previous\",\n\t&\"jump\": &\"jump\",\n\t&\"idle\": &\"idle\",\n\t&\"move\": &\"move\",\n\t&\"stagger\": &\"stagger\",\n\t&\"attack\": &\"attack\",\n\t&\"die\": &\"die\",\n\t&\"dead\": &\"dead\",\n\t&\"walk\": &\"walk\",\n}\n",
            "state-godot-fsm-real/player/player_state_machine.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/player_state_machine.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"res://state_machine/state_machine.gd\"\n\nvar PLAYER_STATE = preload(\"res://player/player_state.gd\").PLAYER_STATE\n\n@onready var idle: Node = $Idle\n@onready var move: Node = $Move\n@onready var jump: Node = $Jump\n@onready var stagger: Node = $Stagger\n@onready var attack: Node = $Attack\n\nfunc _ready() -> void:\n\tstates_map = {\n\t\tPLAYER_STATE.idle: idle,\n\t\tPLAYER_STATE.move: move,\n\t\tPLAYER_STATE.jump: jump,\n\t\tPLAYER_STATE.stagger: stagger,\n\t\tPLAYER_STATE.attack: attack,\n\t}\n\n\nfunc _change_state(state_name: String) -> void:\n\t# The base state_machine interface this node extends does most of the work.\n\tif not _active:\n\t\treturn\n\tif state_name in [PLAYER_STATE.stagger, PLAYER_STATE.jump, PLAYER_STATE.attack]:\n\t\tstates_stack.push_front(states_map[state_name])\n\tif state_name == PLAYER_STATE.jump and current_state == move:\n\t\tjump.initialize(move.speed, move.velocity)\n\n\tsuper._change_state(state_name)\n\n\nfunc _unhandled_input(input_event: InputEvent) -> void:\n\t# Here we only handle input that can interrupt states, attacking in this case,\n\t# otherwise we let the state node handle it.\n\tif input_event.is_action_pressed(PLAYER_STATE.attack):\n\t\tif current_state in [attack, stagger]:\n\t\t\treturn\n\n\t\t_change_state(PLAYER_STATE.attack)\n\t\treturn\n\n\tcurrent_state.handle_input(input_event)\n",
            "state-godot-fsm-real/player/states/motion/in_air/jump.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/states/motion/in_air/jump.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"../motion.gd\"\n\n@export var base_max_horizontal_speed := 400.0\n\n@export var air_acceleration := 1000.0\n@export var air_deceleration := 2000.0\n@export var air_steering_power := 50.0\n\n@export var gravity := 1600.0\n\nvar enter_velocity := Vector2()\n\nvar max_horizontal_speed := 0.0\nvar horizontal_speed := 0.0\nvar horizontal_velocity := Vector2()\n\nvar vertical_speed := 0.0\nvar height := 0.0\n\nfunc initialize(speed: float, velocity: Vector2) -> void:\n\thorizontal_speed = speed\n\tif speed > 0.0:\n\t\tmax_horizontal_speed = speed\n\telse:\n\t\tmax_horizontal_speed = base_max_horizontal_speed\n\tenter_velocity = velocity\n\n\nfunc enter() -> void:\n\tvar input_direction := get_input_direction()\n\tupdate_look_direction(input_direction)\n\n\tif input_direction:\n\t\thorizontal_velocity = enter_velocity\n\telse:\n\t\thorizontal_velocity = Vector2()\n\tvertical_speed = 600.0\n\n\towner.get_node(^\"AnimationPlayer\").play(PLAYER_STATE.idle)\n\n\nfunc update(delta: float) -> void:\n\tvar input_direction := get_input_direction()\n\tupdate_look_direction(input_direction)\n\n\tmove_horizontally(delta, input_direction)\n\tanimate_jump_height(delta)\n\tif height <= 0.0:\n\t\tfinished.emit(PLAYER_STATE.previous)\n\n\nfunc move_horizontally(delta: float, direction: Vector2) -> void:\n\tif direction:\n\t\thorizontal_speed += air_acceleration * delta\n\telse:\n\t\thorizontal_speed -= air_deceleration * delta\n\thorizontal_speed = clamp(horizontal_speed, 0, max_horizontal_speed)\n\n\tvar target_velocity := horizontal_speed * direction.normalized()\n\tvar steering_velocity := (target_velocity - horizontal_velocity).normalized() * air_steering_power\n\thorizontal_velocity += steering_velocity\n\n\towner.velocity = horizontal_velocity\n\towner.move_and_slide()\n\n\nfunc animate_jump_height(delta: float) -> void:\n\tvertical_speed -= gravity * delta\n\theight += vertical_speed * delta\n\theight = max(0.0, height)\n\n\towner.get_node(^\"BodyPivot\").position.y = -height\n",
            "state-godot-fsm-real/player/states/motion/motion.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/states/motion/motion.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"res://player/player_state.gd\"\n# Collection of important methods to handle direction and animation.\n\nfunc handle_input(input_event: InputEvent) -> void:\n\tif input_event.is_action_pressed(&\"simulate_damage\"):\n\t\tfinished.emit(PLAYER_STATE.stagger)\n\n\nfunc get_input_direction() -> Vector2:\n\treturn Vector2(\n\t\t\tInput.get_axis(&\"move_left\", &\"move_right\"),\n\t\t\tInput.get_axis(&\"move_up\", &\"move_down\")\n\t\t)\n\n\nfunc update_look_direction(direction: Vector2) -> void:\n\tif direction and owner.look_direction != direction:\n\t\towner.look_direction = direction\n",
            "state-godot-fsm-real/player/states/motion/on_ground/idle.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/states/motion/on_ground/idle.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"on_ground.gd\"\n\nfunc enter() -> void:\n\towner.get_node(^\"AnimationPlayer\").play(PLAYER_STATE.idle)\n\n\nfunc handle_input(input_event: InputEvent) -> void:\n\treturn super.handle_input(input_event)\n\n\nfunc update(_delta: float) -> void:\n\tvar input_direction: Vector2 = get_input_direction()\n\tif input_direction:\n\t\tfinished.emit(PLAYER_STATE.move)\n",
            "state-godot-fsm-real/player/states/motion/on_ground/move.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/states/motion/on_ground/move.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"on_ground.gd\"\n\n@export var max_walk_speed := 450.0\n@export var max_run_speed := 700.0\n\nfunc enter() -> void:\n\tspeed = 0.0\n\tvelocity = Vector2()\n\n\tvar input_direction := get_input_direction()\n\tupdate_look_direction(input_direction)\n\towner.get_node(^\"AnimationPlayer\").play(PLAYER_STATE.walk)\n\n\nfunc handle_input(input_event: InputEvent) -> void:\n\treturn super.handle_input(input_event)\n\n\nfunc update(_delta: float) -> void:\n\tvar input_direction := get_input_direction()\n\tif input_direction.is_zero_approx():\n\t\tfinished.emit(PLAYER_STATE.idle)\n\tupdate_look_direction(input_direction)\n\n\tif Input.is_action_pressed(&\"run\"):\n\t\tspeed = max_run_speed\n\telse:\n\t\tspeed = max_walk_speed\n\n\tvar collision_info := move(speed, input_direction)\n\tif not collision_info:\n\t\treturn\n\tif speed == max_run_speed and collision_info.collider.is_in_group(&\"environment\"):\n\t\treturn\n\n\nfunc move(p_speed: float, direction: Vector2) -> KinematicCollision2D:\n\towner.velocity = direction.normalized() * p_speed\n\towner.move_and_slide()\n\tif owner.get_slide_collision_count() == 0:\n\t\treturn null\n\n\treturn owner.get_slide_collision(0)\n",
            "state-godot-fsm-real/player/states/motion/on_ground/on_ground.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/player/states/motion/on_ground/on_ground.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"../motion.gd\"\n\nvar speed := 0.0\nvar velocity := Vector2()\n\nfunc handle_input(input_event: InputEvent) -> void:\n\tif input_event.is_action_pressed(&\"jump\"):\n\t\tfinished.emit(PLAYER_STATE.jump)\n\n\treturn super.handle_input(input_event)\n",
            "state-godot-fsm-real/state_machine/state.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/state_machine/state.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Node\n# Base interface for all states: it doesn't do anything by itself,\n# but forces us to pass the right arguments to the methods below\n# and makes sure every State object had all of these methods.\n\n@warning_ignore(\"unused_signal\")\nsignal finished(next_state_name: StringName)\n\n# Initialize the state. E.g. change the animation.\nfunc enter() -> void:\n\tpass\n\n\n# Clean up the state. Reinitialize values like a timer.\nfunc exit() -> void:\n\tpass\n\n\nfunc handle_input(_input_event: InputEvent) -> void:\n\tpass\n\n\nfunc update(_delta: float) -> void:\n\tpass\n\n\nfunc _on_animation_finished(_anim_name: String) -> void:\n\tpass\n",
            "state-godot-fsm-real/state_machine/state_machine.gd": "# Source: godot-demo-projects 4.7-6ad6167 — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/finite_state_machine/state_machine/state_machine.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Node\n# Base interface for a generic state machine.\n# It handles initializing, setting the machine active or not\n# delegating _physics_process, _input calls to the State nodes,\n# and changing the current/active state.\n# See the PlayerV2 scene for an example on how to use it.\n\nsignal state_changed(current_state: Node)\n\n# You should set a starting node from the inspector or on the node that inherits\n# from this state machine interface. If you don't, the game will default to\n# the first state in the state machine's children.\n@export var start_state: NodePath\nvar states_map := {}\n\nvar states_stack := []\nvar current_state: Node = null\nvar _active: bool = false:\n\tset(value):\n\t\t_active = value\n\t\tset_active(value)\n\n\nfunc _enter_tree() -> void:\n\tvar initial_state: Node\n\tif start_state.is_empty():\n\t\t# Children have not entered the tree yet during their parent's\n\t\t# _enter_tree(), so calling get_path() on get_child(0) would return\n\t\t# an empty NodePath. Resolve to the Node reference directly.\n\t\tinitial_state = get_child(0)\n\telse:\n\t\tinitial_state = get_node(start_state)\n\tfor child in get_children():\n\t\tvar err: bool = child.finished.connect(_change_state)\n\t\tif err:\n\t\t\tprinterr(err)\n\tinitialize(initial_state)\n\n\nfunc initialize(initial_state: Node) -> void:\n\t_active = true\n\tstates_stack.push_front(initial_state)\n\tcurrent_state = states_stack[0]\n\tcurrent_state.enter()\n\n\nfunc set_active(value: bool) -> void:\n\tset_physics_process(value)\n\tset_process_input(value)\n\tif not _active:\n\t\tstates_stack = []\n\t\tcurrent_state = null\n\n\nfunc _unhandled_input(input_event: InputEvent) -> void:\n\tcurrent_state.handle_input(input_event)\n\n\nfunc _physics_process(delta: float) -> void:\n\tcurrent_state.update(delta)\n\n\nfunc _on_animation_finished(anim_name: String) -> void:\n\tif not _active:\n\t\treturn\n\n\tcurrent_state._on_animation_finished(anim_name)\n\n\nfunc _change_state(state_name: String) -> void:\n\tif not _active:\n\t\treturn\n\tcurrent_state.exit()\n\n\tif state_name == \"previous\":\n\t\tstates_stack.pop_front()\n\telse:\n\t\tstates_stack[0] = states_map[state_name]\n\n\tcurrent_state = states_stack[0]\n\tstate_changed.emit(current_state)\n\n\tif state_name != \"previous\":\n\t\tcurrent_state.enter()\n"
          }
        }
      ]
    },
    {
      "id": "iterator",
      "name": "Iterator",
      "family": "Behavioral",
      "aka": [
        "Cursor",
        "Enumerator",
        "Generator (a language-level form)"
      ],
      "tagline": "Walk through a collection one element at a time without seeing how it is stored.",
      "intent": "Give a collection a separate object (the iterator) that remembers a position and hands out the next element on request. Code that loops no longer depends on whether the data lives in an array, a grid or a linked list, and the same collection can offer several ways to walk it (in order, shuffled, filtered, backwards).",
      "analogy": "A bookmark in a book: it remembers where you are, so you can read one page at a time and stop whenever you like. Two people can read the same book with two bookmarks, and neither needs to know how the book was bound.",
      "cityShape": "Look for a collection building with a private list or grid antenna on its roof and small floors that only create iterators (iterator, inOrder, ofKind, Front). Next to it sit small iterator buildings whose short next/hasNext floors read that data through pipes, while the client building's loop talks only to them.",
      "roles": [
        {
          "name": "Collection",
          "desc": "Holds the elements and hands out iterators (iterator(), [Symbol.iterator](), Front()). Also called the aggregate."
        },
        {
          "name": "Iterator",
          "desc": "Keeps the current position and returns one element at a time (next, hasNext). Most languages define the interface for you."
        },
        {
          "name": "Client",
          "desc": "Loops over the collection through the iterator, usually with for-each or for...of."
        }
      ],
      "whenToUse": [
        "Callers should loop over your data without knowing its structure (grid, tree, linked list, paged API).",
        "You need several traversals of the same data: in order, reversed, shuffled, filtered.",
        "You want for-each / for...of / for ... in to work with your own class."
      ],
      "pitfalls": [
        "Changing a collection while an iterator walks it can skip or repeat elements, or throw (ConcurrentModificationException in Java). Save the next position before removing.",
        "An iterator is usually single-use: once it reports done, create a new one to loop again.",
        "If callers only ever need a plain array, returning a read-only copy is simpler than writing an iterator class."
      ],
      "related": [
        "composite",
        "visitor",
        "factory-method",
        "encapsulation"
      ],
      "quiz": [
        {
          "q": "Why does the Java Inventory return a SlotIterator instead of exposing its Item[][] grid?",
          "options": [
            "Arrays cannot be returned in Java",
            "So callers can loop without knowing about rows, columns or empty slots, and the storage can change later",
            "Iterators use less memory than arrays",
            "Because for-each loops only work on lists"
          ],
          "answer": 1,
          "why": "The iterator hides the traversal details. The grid could become a HashMap tomorrow and the for-each loops would not change."
        },
        {
          "q": "In Go's container/list, why must you call e.Next() before l.Remove(e) when deleting during a loop?",
          "options": [
            "Remove panics otherwise",
            "Remove sets e's next and prev links to nil, so e.Next() afterwards would end the loop early",
            "Next() is slow after Remove",
            "Go forbids reading removed elements"
          ],
          "answer": 1,
          "why": "Remove clears the element's links to avoid memory leaks, so the cursor loses its way. Save the next position first, then remove."
        }
      ],
      "demos": [
        {
          "id": "iterator-ts-playlist",
          "title": "Music playlist: in order and shuffled",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A Playlist hides its array and hands out iterators. for...of uses the in-order one, shuffled() gives a different walk over the same songs, and main.ts never touches an index.",
          "roles": {
            "Collection": [
              "iterator-ts-playlist/playlist.ts#Playlist"
            ],
            "Iterator": [
              "iterator-ts-playlist/iterators.ts#InOrderIterator",
              "iterator-ts-playlist/iterators.ts#ShuffleIterator"
            ],
            "Client": [
              "iterator-ts-playlist/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "iterator-ts-playlist/main.ts#main",
              "say": "main() fills a playlist, then loops with for...of. It never asks how the songs are stored."
            },
            {
              "at": "iterator-ts-playlist/playlist.ts#Playlist.inOrder",
              "say": "for...of asks the playlist for an iterator; the playlist creates a fresh InOrderIterator over its private array."
            },
            {
              "at": "iterator-ts-playlist/iterators.ts#InOrderIterator.next",
              "say": "Each next() returns one song and moves the index. When it runs out it says done: true and the loop stops."
            },
            {
              "at": "iterator-ts-playlist/playlist.ts#Playlist.shuffled",
              "say": "shuffled() returns another iterable over the same songs. Same data, different walk."
            },
            {
              "at": "iterator-ts-playlist/iterators.ts#ShuffleIterator.constructor",
              "say": "The shuffle iterator shuffles a list of positions, not the songs, so the playlist itself is untouched."
            },
            {
              "at": "iterator-ts-playlist/iterators.ts#ShuffleIterator.next",
              "say": "next() follows the shuffled positions. The client's loop looks exactly like the in-order one."
            }
          ],
          "files": {
            "iterator-ts-playlist/iterators.ts": "import { Song } from './song';\n\n// Iterators: each one remembers a position and hands out the next song.\n// They follow TypeScript's iterator protocol: next() returns { value, done }.\nexport class InOrderIterator implements Iterator<Song> {\n  private index = 0;\n\n  constructor(private songs: readonly Song[]) {}\n\n  next(): IteratorResult<Song> {\n    if (this.index >= this.songs.length) {\n      return { value: undefined, done: true };\n    }\n    const song = this.songs[this.index];\n    this.index += 1;\n    return { value: song, done: false };\n  }\n}\n\nexport class ShuffleIterator implements Iterator<Song> {\n  private order: number[];\n  private position = 0;\n\n  constructor(private songs: readonly Song[]) {\n    this.order = songs.map((_, i) => i);\n    // Fisher-Yates shuffle of the positions; the songs array itself is never changed.\n    for (let i = this.order.length - 1; i > 0; i--) {\n      const j = Math.floor(Math.random() * (i + 1));\n      [this.order[i], this.order[j]] = [this.order[j], this.order[i]];\n    }\n  }\n\n  next(): IteratorResult<Song> {\n    if (this.position >= this.order.length) {\n      return { value: undefined, done: true };\n    }\n    const song = this.songs[this.order[this.position]];\n    this.position += 1;\n    return { value: song, done: false };\n  }\n}\n",
            "iterator-ts-playlist/main.ts": "import { Playlist } from './playlist';\n\n// The Client walks the playlist without knowing it is an array inside.\nfunction main(): void {\n  const playlist = new Playlist();\n  playlist.add({ title: 'Morning', artist: 'Grieg', seconds: 230 });\n  playlist.add({ title: 'Clair de Lune', artist: 'Debussy', seconds: 300 });\n  playlist.add({ title: 'Gymnopedie No.1', artist: 'Satie', seconds: 190 });\n\n  for (const song of playlist) {\n    console.log(`${song.title} by ${song.artist}`);\n  }\n\n  let total = 0;\n  for (const song of playlist.shuffled()) {\n    total += song.seconds;\n    console.log('Shuffle: ' + song.title);\n  }\n  console.log(`Played ${total} seconds`);\n}\n\nmain();\n",
            "iterator-ts-playlist/playlist.ts": "import { Song } from './song';\nimport { InOrderIterator, ShuffleIterator } from './iterators';\n\n// The Collection. It keeps its array private and gives out iterators instead.\nexport class Playlist implements Iterable<Song> {\n  private songs: Song[] = [];\n\n  add(song: Song): void {\n    this.songs.push(song);\n  }\n\n  // for...of calls this method behind the scenes.\n  [Symbol.iterator](): Iterator<Song> {\n    return this.inOrder();\n  }\n\n  inOrder(): Iterator<Song> {\n    return new InOrderIterator(this.songs);\n  }\n\n  shuffled(): Iterable<Song> {\n    const songs = this.songs;\n    return { [Symbol.iterator]: () => new ShuffleIterator(songs) };\n  }\n}\n",
            "iterator-ts-playlist/song.ts": "export interface Song {\n  title: string;\n  artist: string;\n  seconds: number;\n}\n"
          }
        },
        {
          "id": "iterator-java-inventory",
          "title": "Game inventory grid",
          "lang": "Java",
          "level": "intermediate",
          "source": null,
          "story": "An RPG bag is a grid with empty slots. SlotIterator skips the gaps, and KindFilterIterator wraps any iterator to show only potions. Main.java is two plain for-each loops.",
          "roles": {
            "Collection": [
              "iterator-java-inventory/Inventory.java#Inventory"
            ],
            "Iterator": [
              "iterator-java-inventory/SlotIterator.java#SlotIterator",
              "iterator-java-inventory/KindFilterIterator.java#KindFilterIterator"
            ],
            "Client": [
              "iterator-java-inventory/Main.java#Main.main"
            ]
          },
          "trace": [
            {
              "at": "iterator-java-inventory/Main.java#Main.main",
              "say": "The client puts four items into a 3x4 bag, then loops with for-each. Java calls iterator() for it."
            },
            {
              "at": "iterator-java-inventory/Inventory.java#Inventory.iterator",
              "say": "Inventory implements Iterable, so it only has to return a new SlotIterator over its grid."
            },
            {
              "at": "iterator-java-inventory/SlotIterator.java#SlotIterator.next",
              "say": "next() returns the current item, then moves on and skips empty slots so hasNext() stays honest."
            },
            {
              "at": "iterator-java-inventory/SlotIterator.java#SlotIterator.skipEmpty",
              "say": "All the null checks live here once, instead of in every loop in the game."
            },
            {
              "at": "iterator-java-inventory/Inventory.java#Inventory.ofKind",
              "say": "ofKind() returns an Iterable whose iterator is a filter wrapped around a SlotIterator."
            },
            {
              "at": "iterator-java-inventory/KindFilterIterator.java#KindFilterIterator.findNext",
              "say": "The filter pulls from its source iterator until it finds a matching item. It knows nothing about grids."
            },
            {
              "at": "iterator-java-inventory/KindFilterIterator.java#KindFilterIterator.next",
              "say": "next() hands out the item it found and looks ahead for the following one. Iterators stack like this freely."
            }
          ],
          "files": {
            "iterator-java-inventory/Inventory.java": "import java.util.Iterator;\n\n// The Collection: a fixed grid of slots, many of them empty.\n// Callers never see the 2D array; they ask for an iterator instead.\npublic class Inventory implements Iterable<Item> {\n    private final Item[][] slots;\n\n    public Inventory(int rows, int cols) {\n        slots = new Item[rows][cols];\n    }\n\n    public void put(int row, int col, Item item) {\n        slots[row][col] = item;\n    }\n\n    @Override\n    public Iterator<Item> iterator() {\n        return new SlotIterator(slots);\n    }\n\n    public Iterable<Item> ofKind(Item.Kind kind) {\n        return () -> new KindFilterIterator(new SlotIterator(slots), kind);\n    }\n}\n",
            "iterator-java-inventory/Item.java": "public class Item {\n    public enum Kind { WEAPON, POTION, KEY, JUNK }\n\n    private final String name;\n    private final Kind kind;\n\n    public Item(String name, Kind kind) {\n        this.name = name;\n        this.kind = kind;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public Kind getKind() {\n        return kind;\n    }\n}\n",
            "iterator-java-inventory/KindFilterIterator.java": "import java.util.Iterator;\nimport java.util.NoSuchElementException;\n\n// An iterator that wraps another iterator and only lets one kind of item through.\n// Iterators compose: this one knows nothing about grids.\npublic class KindFilterIterator implements Iterator<Item> {\n    private final Iterator<Item> source;\n    private final Item.Kind kind;\n    private Item upcoming;\n\n    public KindFilterIterator(Iterator<Item> source, Item.Kind kind) {\n        this.source = source;\n        this.kind = kind;\n        findNext();\n    }\n\n    @Override\n    public boolean hasNext() {\n        return upcoming != null;\n    }\n\n    @Override\n    public Item next() {\n        if (upcoming == null) {\n            throw new NoSuchElementException();\n        }\n        Item result = upcoming;\n        findNext();\n        return result;\n    }\n\n    private void findNext() {\n        upcoming = null;\n        while (source.hasNext()) {\n            Item candidate = source.next();\n            if (candidate.getKind() == kind) {\n                upcoming = candidate;\n                return;\n            }\n        }\n    }\n}\n",
            "iterator-java-inventory/Main.java": "// The Client: plain for-each loops, no grid indexes anywhere.\npublic class Main {\n    public static void main(String[] args) {\n        Inventory bag = new Inventory(3, 4);\n        bag.put(0, 1, new Item(\"Rusty sword\", Item.Kind.WEAPON));\n        bag.put(1, 0, new Item(\"Health potion\", Item.Kind.POTION));\n        bag.put(1, 3, new Item(\"Bent spoon\", Item.Kind.JUNK));\n        bag.put(2, 2, new Item(\"Mana potion\", Item.Kind.POTION));\n\n        for (Item item : bag) {\n            System.out.println(\"In bag: \" + item.getName());\n        }\n\n        for (Item potion : bag.ofKind(Item.Kind.POTION)) {\n            System.out.println(\"Drink: \" + potion.getName());\n        }\n    }\n}\n",
            "iterator-java-inventory/SlotIterator.java": "import java.util.Iterator;\nimport java.util.NoSuchElementException;\n\n// A concrete iterator: walks the grid row by row and skips empty slots.\n// All the row/column bookkeeping lives here, not in every loop that uses the inventory.\npublic class SlotIterator implements Iterator<Item> {\n    private final Item[][] slots;\n    private int row = 0;\n    private int col = 0;\n\n    public SlotIterator(Item[][] slots) {\n        this.slots = slots;\n        skipEmpty();\n    }\n\n    @Override\n    public boolean hasNext() {\n        return row < slots.length;\n    }\n\n    @Override\n    public Item next() {\n        if (!hasNext()) {\n            throw new NoSuchElementException();\n        }\n        Item item = slots[row][col];\n        advance();\n        skipEmpty();\n        return item;\n    }\n\n    private void advance() {\n        col++;\n        if (col >= slots[row].length) {\n            col = 0;\n            row++;\n        }\n    }\n\n    private void skipEmpty() {\n        while (row < slots.length && slots[row][col] == null) {\n            advance();\n        }\n    }\n}\n"
          }
        },
        {
          "id": "iterator-go-list-real",
          "title": "Go's container/list cursor",
          "lang": "Go",
          "level": "intermediate",
          "source": {
            "repo": "golang/go",
            "url": "https://github.com/golang/go/blob/go1.22.0/src/container/list/list.go",
            "license": "BSD-3-Clause",
            "note": "list/list.go is a verbatim excerpt of Go 1.22.0 src/container/list/list.go with unrelated methods cut and marked; main.go and go.mod were written for Software City."
          },
          "story": "Go's standard doubly linked list has no iterator class: each Element is its own cursor. Front() starts the walk, Next() and Prev() move, nil means done. The list is secretly a ring around a sentinel root.",
          "roles": {
            "Collection": [
              "iterator-go-list-real/list/list.go#List"
            ],
            "Iterator": [
              "iterator-go-list-real/list/list.go#Element"
            ],
            "Client": [
              "iterator-go-list-real/main.go#printForward",
              "iterator-go-list-real/main.go#printBackward",
              "iterator-go-list-real/main.go#dropOldJobs"
            ]
          },
          "trace": [
            {
              "at": "iterator-go-list-real/main.go#main",
              "say": "main() builds a job queue with PushBack and PushFront, then walks it three ways."
            },
            {
              "at": "iterator-go-list-real/list/list.go#List.PushBack",
              "say": "PushBack links a new Element in just before the sentinel root, so the list is really a ring."
            },
            {
              "at": "iterator-go-list-real/main.go#printForward",
              "say": "The canonical loop: start at Front(), step with e.Next(), stop at nil."
            },
            {
              "at": "iterator-go-list-real/list/list.go#List.Front",
              "say": "Front() returns root.next, or nil for an empty list, so the loop needs no special case."
            },
            {
              "at": "iterator-go-list-real/list/list.go#Element.Next",
              "say": "Next() hides the ring: when the next link is the root sentinel it returns nil, which ends the loop."
            },
            {
              "at": "iterator-go-list-real/list/list.go#Element.Prev",
              "say": "Prev() is the mirror image, so the same cursor can walk backwards."
            },
            {
              "at": "iterator-go-list-real/main.go#dropOldJobs",
              "say": "Deleting while looping: save e.Next() first, then Remove(e)."
            },
            {
              "at": "iterator-go-list-real/list/list.go#List.remove",
              "say": "remove() sets e.next and e.prev to nil to avoid leaks, which is exactly why the loop had to save next first."
            }
          ],
          "files": {
            "iterator-go-list-real/go.mod": "module softwarecity\n\ngo 1.22\n",
            "iterator-go-list-real/list/list.go": "// Source: Go 1.22.0 container/list — https://github.com/golang/go/blob/go1.22.0/src/container/list/list.go\n// BSD-3-Clause License, Copyright (c) 2009 The Go Authors. Included for study.\n// Copyright 2009 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\n// Package list implements a doubly linked list.\n//\n// To iterate over a list (where l is a *List):\n//\n//\tfor e := l.Front(); e != nil; e = e.Next() {\n//\t\t// do something with e.Value\n//\t}\npackage list\n\n// Element is an element of a linked list.\ntype Element struct {\n\t// Next and previous pointers in the doubly-linked list of elements.\n\t// To simplify the implementation, internally a list l is implemented\n\t// as a ring, such that &l.root is both the next element of the last\n\t// list element (l.Back()) and the previous element of the first list\n\t// element (l.Front()).\n\tnext, prev *Element\n\n\t// The list to which this element belongs.\n\tlist *List\n\n\t// The value stored with this element.\n\tValue any\n}\n\n// Next returns the next list element or nil.\nfunc (e *Element) Next() *Element {\n\tif p := e.next; e.list != nil && p != &e.list.root {\n\t\treturn p\n\t}\n\treturn nil\n}\n\n// Prev returns the previous list element or nil.\nfunc (e *Element) Prev() *Element {\n\tif p := e.prev; e.list != nil && p != &e.list.root {\n\t\treturn p\n\t}\n\treturn nil\n}\n\n// List represents a doubly linked list.\n// The zero value for List is an empty list ready to use.\ntype List struct {\n\troot Element // sentinel list element, only &root, root.prev, and root.next are used\n\tlen  int     // current list length excluding (this) sentinel element\n}\n\n// Init initializes or clears list l.\nfunc (l *List) Init() *List {\n\tl.root.next = &l.root\n\tl.root.prev = &l.root\n\tl.len = 0\n\treturn l\n}\n\n// New returns an initialized list.\nfunc New() *List { return new(List).Init() }\n\n// Len returns the number of elements of list l.\n// The complexity is O(1).\nfunc (l *List) Len() int { return l.len }\n\n// Front returns the first element of list l or nil if the list is empty.\nfunc (l *List) Front() *Element {\n\tif l.len == 0 {\n\t\treturn nil\n\t}\n\treturn l.root.next\n}\n\n// Back returns the last element of list l or nil if the list is empty.\nfunc (l *List) Back() *Element {\n\tif l.len == 0 {\n\t\treturn nil\n\t}\n\treturn l.root.prev\n}\n\n// lazyInit lazily initializes a zero List value.\nfunc (l *List) lazyInit() {\n\tif l.root.next == nil {\n\t\tl.Init()\n\t}\n}\n\n// insert inserts e after at, increments l.len, and returns e.\nfunc (l *List) insert(e, at *Element) *Element {\n\te.prev = at\n\te.next = at.next\n\te.prev.next = e\n\te.next.prev = e\n\te.list = l\n\tl.len++\n\treturn e\n}\n\n// insertValue is a convenience wrapper for insert(&Element{Value: v}, at).\nfunc (l *List) insertValue(v any, at *Element) *Element {\n\treturn l.insert(&Element{Value: v}, at)\n}\n\n// remove removes e from its list, decrements l.len\nfunc (l *List) remove(e *Element) {\n\te.prev.next = e.next\n\te.next.prev = e.prev\n\te.next = nil // avoid memory leaks\n\te.prev = nil // avoid memory leaks\n\te.list = nil\n\tl.len--\n}\n\n// … trimmed: move(), a 14-line helper used only by the MoveTo*/MoveBefore/MoveAfter methods …\n// Remove removes e from l if e is an element of list l.\n// It returns the element value e.Value.\n// The element must not be nil.\nfunc (l *List) Remove(e *Element) any {\n\tif e.list == l {\n\t\t// if e.list == l, l must have been initialized when e was inserted\n\t\t// in l or l == nil (e is a zero Element) and l.remove will crash\n\t\tl.remove(e)\n\t}\n\treturn e.Value\n}\n\n// PushFront inserts a new element e with value v at the front of list l and returns e.\nfunc (l *List) PushFront(v any) *Element {\n\tl.lazyInit()\n\treturn l.insertValue(v, &l.root)\n}\n\n// PushBack inserts a new element e with value v at the back of list l and returns e.\nfunc (l *List) PushBack(v any) *Element {\n\tl.lazyInit()\n\treturn l.insertValue(v, l.root.prev)\n}\n\n// … trimmed: 81 lines (InsertBefore/After, MoveToFront/Back, MoveBefore/After, PushBackList, PushFrontList) …\n",
            "iterator-go-list-real/main.go": "// Example usage written for Software City (not part of Go). In a real program you would\n// import \"container/list\"; here it imports the copy in ./list so the arrows show up.\npackage main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n\n\t\"softwarecity/list\"\n)\n\nfunc main() {\n\tjobs := list.New()\n\tjobs.PushBack(\"resize images\")\n\tjobs.PushBack(\"send emails\")\n\tjobs.PushBack(\"old: clear cache\")\n\tjobs.PushFront(\"urgent: restart worker\")\n\n\tprintForward(jobs)\n\tprintBackward(jobs)\n\tdropOldJobs(jobs)\n\tprintForward(jobs)\n}\n\n// The canonical Go loop: start at Front(), step with Next() until nil.\nfunc printForward(l *list.List) {\n\tfor e := l.Front(); e != nil; e = e.Next() {\n\t\tfmt.Println(\"job:\", e.Value)\n\t}\n}\n\n// The same cursor can walk the other way, because each Element links both directions.\nfunc printBackward(l *list.List) {\n\tfor e := l.Back(); e != nil; e = e.Prev() {\n\t\tfmt.Println(\"reverse:\", e.Value)\n\t}\n}\n\n// Removing while iterating: grab Next() first, because Remove clears e's links.\nfunc dropOldJobs(l *list.List) {\n\tfor e := l.Front(); e != nil; {\n\t\tnext := e.Next()\n\t\tif s, ok := e.Value.(string); ok && strings.HasPrefix(s, \"old:\") {\n\t\t\tl.Remove(e)\n\t\t}\n\t\te = next\n\t}\n}\n"
          }
        }
      ]
    },
    {
      "id": "template-method",
      "name": "Template Method",
      "family": "Behavioral",
      "aka": [
        "Hollywood principle (\"don't call us, we'll call you\")",
        "Hook methods"
      ],
      "tagline": "A base class fixes the steps of an algorithm; subclasses fill in the blanks.",
      "intent": "Write the skeleton of an algorithm once, in a base-class method that calls a series of step methods. Subclasses override only the steps that differ (required abstract steps and optional hooks with defaults), so the order and the shared parts can never drift apart between variants.",
      "analogy": "A recipe card for pancakes: mix, rest, fry, serve. Each cook may pick a different topping or flour, but nobody gets to fry before mixing.",
      "cityShape": "Look for a base-class building with one tall template floor (exportReport, take_turn, __init__ or _handle_request_noblock) whose pipes run down to several short step floors. The subclass buildings next to it contain only those step floors, at matching heights, and almost never call each other; the base class calls into them.",
      "roles": [
        {
          "name": "Abstract Class",
          "desc": "Holds the template method that calls the steps in a fixed order, plus default hooks."
        },
        {
          "name": "Template Method",
          "desc": "The method that defines the algorithm's skeleton. Subclasses should not override it."
        },
        {
          "name": "Concrete Class",
          "desc": "A subclass that implements the required steps and may override hooks."
        },
        {
          "name": "Client",
          "desc": "Calls the template method on any concrete class, without caring which one."
        }
      ],
      "whenToUse": [
        "Several classes do the same job in the same order but differ in a few steps (exporting to CSV vs Markdown, enemies that choose targets differently).",
        "A framework wants users to plug in code at fixed points: setup/handle/finish, _ready/_process, setUp/tearDown.",
        "You keep copying a method into subclasses and changing two lines of it."
      ],
      "pitfalls": [
        "Deep inheritance trees make it hard to see which class supplies which step; prefer Strategy (composition) when steps vary independently.",
        "If a subclass overrides the template method itself, the guaranteed order is gone. Mark it final where the language allows.",
        "Too many hooks turn the base class into a puzzle; keep the number of steps small and name them clearly."
      ],
      "related": [
        "strategy",
        "factory-method",
        "inheritance",
        "abstraction"
      ],
      "quiz": [
        {
          "q": "In the Java demo, why is exportReport() declared final?",
          "options": [
            "To make it faster",
            "So subclasses can change the steps but not the order of the algorithm",
            "Because abstract classes require it",
            "So it can be called without an object"
          ],
          "answer": 1,
          "why": "The whole point is that the base class owns the sequence. final stops a subclass from replacing the skeleton."
        },
        {
          "q": "Godot calls your _ready() and _process(delta) at the right moments. Which idea is that?",
          "options": [
            "Template Method: the engine owns the loop and calls your overridden steps",
            "Singleton",
            "Iterator",
            "Adapter"
          ],
          "answer": 0,
          "why": "The engine's main loop is the template; Node's virtual methods are the hooks you fill in. Don't call us, we'll call you."
        }
      ],
      "demos": [
        {
          "id": "template-method-java-report",
          "title": "Sales report exporters",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "ReportExporter.exportReport() writes the header, every row and the total in a fixed order. CSV and Markdown exporters only supply those pieces, and CSV switches off the total through a hook.",
          "roles": {
            "Abstract Class": [
              "template-method-java-report/ReportExporter.java#ReportExporter"
            ],
            "Template Method": [
              "template-method-java-report/ReportExporter.java#ReportExporter.exportReport"
            ],
            "Concrete Class": [
              "template-method-java-report/CsvExporter.java#CsvExporter",
              "template-method-java-report/MarkdownExporter.java#MarkdownExporter"
            ],
            "Client": [
              "template-method-java-report/Main.java#Main.main"
            ]
          },
          "trace": [
            {
              "at": "template-method-java-report/Main.java#Main.main",
              "say": "main() calls the same exportReport() on a CSV exporter and a Markdown exporter."
            },
            {
              "at": "template-method-java-report/ReportExporter.java#ReportExporter.exportReport",
              "say": "exportReport() is the template: header, loop over rows, optional footer. It is final, so the order can't be changed."
            },
            {
              "at": "template-method-java-report/CsvExporter.java#CsvExporter.header",
              "say": "The base class calls down into the subclass for each step. CSV writes a column line."
            },
            {
              "at": "template-method-java-report/CsvExporter.java#CsvExporter.row",
              "say": "row() formats one sale. The loop that calls it lives in the base class, written once."
            },
            {
              "at": "template-method-java-report/CsvExporter.java#CsvExporter.includeTotal",
              "say": "CSV overrides the includeTotal() hook to skip the footer. Hooks are optional steps with defaults."
            },
            {
              "at": "template-method-java-report/ReportExporter.java#ReportExporter.includeTotal",
              "say": "Markdown does not override the hook, so the base default (true) applies."
            },
            {
              "at": "template-method-java-report/MarkdownExporter.java#MarkdownExporter.footer",
              "say": "Markdown's footer prints the bold total that the template computed in its loop."
            }
          ],
          "files": {
            "template-method-java-report/CsvExporter.java": "// A concrete class: it only fills in the steps. It never writes the loop.\npublic class CsvExporter extends ReportExporter {\n\n    @Override\n    protected String header(String title) {\n        return \"product,quantity,total\\n\";\n    }\n\n    @Override\n    protected String row(Sale sale) {\n        return sale.getProduct() + \",\" + sale.getQuantity() + \",\" + String.format(\"%.2f\", sale.total()) + \"\\n\";\n    }\n\n    @Override\n    protected String footer(double sum) {\n        return \"\";\n    }\n\n    // Spreadsheets compute their own totals, so this exporter turns the hook off.\n    @Override\n    protected boolean includeTotal() {\n        return false;\n    }\n}\n",
            "template-method-java-report/Main.java": "import java.util.List;\n\n// The client calls the same exportReport() method on either exporter.\npublic class Main {\n    public static void main(String[] args) {\n        List<Sale> sales = List.of(\n            new Sale(\"Coffee beans\", 3, 8.50),\n            new Sale(\"Mug\", 2, 6.00),\n            new Sale(\"Grinder\", 1, 39.90)\n        );\n\n        ReportExporter csv = new CsvExporter();\n        ReportExporter markdown = new MarkdownExporter();\n\n        System.out.println(csv.exportReport(\"Weekly sales\", sales));\n        System.out.println(markdown.exportReport(\"Weekly sales\", sales));\n    }\n}\n",
            "template-method-java-report/MarkdownExporter.java": "// Another concrete class with the same three steps, written for Markdown.\npublic class MarkdownExporter extends ReportExporter {\n\n    @Override\n    protected String header(String title) {\n        return \"# \" + title + \"\\n\\n| Product | Qty | Total |\\n|---|---|---|\\n\";\n    }\n\n    @Override\n    protected String row(Sale sale) {\n        return \"| \" + sale.getProduct() + \" | \" + sale.getQuantity() + \" | \" + String.format(\"%.2f\", sale.total()) + \" |\\n\";\n    }\n\n    @Override\n    protected String footer(double sum) {\n        return \"\\n**Total: \" + String.format(\"%.2f\", sum) + \"**\\n\";\n    }\n}\n",
            "template-method-java-report/ReportExporter.java": "import java.util.List;\n\n// The abstract class owns the algorithm. exportReport() is final: subclasses can fill in\n// the steps, but they cannot change the order of the steps.\npublic abstract class ReportExporter {\n\n    public final String exportReport(String title, List<Sale> sales) {\n        StringBuilder out = new StringBuilder();\n        out.append(header(title));\n        double sum = 0;\n        for (Sale sale : sales) {\n            out.append(row(sale));\n            sum += sale.total();\n        }\n        if (includeTotal()) {\n            out.append(footer(sum));\n        }\n        return out.toString();\n    }\n\n    // Steps every subclass must write.\n    protected abstract String header(String title);\n\n    protected abstract String row(Sale sale);\n\n    protected abstract String footer(double sum);\n\n    // A hook: a step with a sensible default that subclasses MAY override.\n    protected boolean includeTotal() {\n        return true;\n    }\n}\n",
            "template-method-java-report/Sale.java": "public class Sale {\n    private final String product;\n    private final int quantity;\n    private final double price;\n\n    public Sale(String product, int quantity, double price) {\n        this.product = product;\n        this.quantity = quantity;\n        this.price = price;\n    }\n\n    public String getProduct() {\n        return product;\n    }\n\n    public int getQuantity() {\n        return quantity;\n    }\n\n    public double total() {\n        return quantity * price;\n    }\n}\n"
          }
        },
        {
          "id": "template-method-gd-enemy-turn",
          "title": "Turn-based enemy AI in Godot",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Every enemy turn runs the same steps: can it act, pick a target, do the action, react afterwards. Goblin, Shaman and Ogre fill in the steps differently; take_turn() is written once in EnemyAI.",
          "roles": {
            "Abstract Class": [
              "template-method-gd-enemy-turn/enemy_ai.gd#choose_target",
              "template-method-gd-enemy-turn/enemy_ai.gd#after_turn"
            ],
            "Template Method": [
              "template-method-gd-enemy-turn/enemy_ai.gd#take_turn"
            ],
            "Concrete Class": [
              "template-method-gd-enemy-turn/goblin_ai.gd#choose_target",
              "template-method-gd-enemy-turn/shaman_ai.gd#choose_target",
              "template-method-gd-enemy-turn/ogre_ai.gd#after_turn"
            ],
            "Client": [
              "template-method-gd-enemy-turn/battle.gd#run_enemy_phase"
            ]
          },
          "trace": [
            {
              "at": "template-method-gd-enemy-turn/battle.gd#run_enemy_phase",
              "say": "The battle calls take_turn() on every enemy AI. It never asks which kind of enemy it is."
            },
            {
              "at": "template-method-gd-enemy-turn/enemy_ai.gd#take_turn",
              "say": "take_turn() is the template: check can_act(), choose a target, act, then after_turn(). The order is fixed here."
            },
            {
              "at": "template-method-gd-enemy-turn/enemy_ai.gd#can_act",
              "say": "can_act() is a hook with a default: act unless stunned. No subclass needs to touch it."
            },
            {
              "at": "template-method-gd-enemy-turn/goblin_ai.gd#choose_target",
              "say": "The goblin fills in the target step by picking the weakest hero."
            },
            {
              "at": "template-method-gd-enemy-turn/shaman_ai.gd#choose_target",
              "say": "The shaman fills the same step differently: it picks its most wounded ally."
            },
            {
              "at": "template-method-gd-enemy-turn/ogre_ai.gd#perform_action",
              "say": "The ogre's action grows with its rage. Each subclass only writes the parts that make it unique."
            },
            {
              "at": "template-method-gd-enemy-turn/ogre_ai.gd#after_turn",
              "say": "The ogre overrides the after_turn() hook to build rage, then stuns itself, which the template's can_act() check respects next turn."
            }
          ],
          "files": {
            "template-method-gd-enemy-turn/battle.gd": "class_name Battle\nextends Node\n\nvar heroes: Array[Fighter] = []\nvar enemies: Array[Fighter] = []\nvar enemy_ais: Array[EnemyAI] = []\n\n# The client: it calls the same take_turn() on every AI and never checks their type.\nfunc run_enemy_phase() -> void:\n\tfor ai in enemy_ais:\n\t\tai.take_turn(self)\n\nfunc log_line(text: String) -> void:\n\tprint(text)\n",
            "template-method-gd-enemy-turn/enemy_ai.gd": "class_name EnemyAI\nextends Node\n\n# The base class owns the shape of every enemy turn. Subclasses fill in the steps.\n@export var display_name := \"Enemy\"\nvar stunned_turns := 0\n\n# The template method. Do not override this one; override the steps it calls.\nfunc take_turn(battle: Battle) -> void:\n\tif not can_act():\n\t\tbattle.log_line(\"%s is stunned.\" % display_name)\n\t\tstunned_turns -= 1\n\t\treturn\n\tvar target: Fighter = choose_target(battle)\n\tif target == null:\n\t\treturn\n\tperform_action(battle, target)\n\tafter_turn(battle)\n\n# Hook with a default: most enemies act unless stunned.\nfunc can_act() -> bool:\n\treturn stunned_turns == 0\n\n# Required steps: the base versions only warn, like abstract methods.\nfunc choose_target(battle: Battle) -> Fighter:\n\tpush_error(\"choose_target() not implemented in %s\" % display_name)\n\treturn null\n\nfunc perform_action(battle: Battle, target: Fighter) -> void:\n\tpush_error(\"perform_action() not implemented in %s\" % display_name)\n\n# Hook with an empty default: subclasses may react after acting.\nfunc after_turn(battle: Battle) -> void:\n\tpass\n",
            "template-method-gd-enemy-turn/fighter.gd": "class_name Fighter\nextends RefCounted\n\n# Plain data for anyone on the battlefield, hero or enemy.\nvar name := \"\"\nvar hp := 0\nvar max_hp := 0\n\nfunc _init(fighter_name: String, health: int) -> void:\n\tname = fighter_name\n\thp = health\n\tmax_hp = health\n\nfunc missing_hp() -> int:\n\treturn max_hp - hp\n",
            "template-method-gd-enemy-turn/goblin_ai.gd": "class_name GoblinAI\nextends EnemyAI\n\n@export var damage := 6\n\n# Goblins are cowards: they always pick the weakest hero.\nfunc choose_target(battle: Battle) -> Fighter:\n\tvar weakest: Fighter = null\n\tfor hero in battle.heroes:\n\t\tif hero.hp > 0 and (weakest == null or hero.hp < weakest.hp):\n\t\t\tweakest = hero\n\treturn weakest\n\nfunc perform_action(battle: Battle, target: Fighter) -> void:\n\ttarget.hp -= damage\n\tbattle.log_line(\"%s stabs %s for %d.\" % [display_name, target.name, damage])\n",
            "template-method-gd-enemy-turn/ogre_ai.gd": "class_name OgreAI\nextends EnemyAI\n\nvar rage := 0\n\n# The ogre smashes whoever is first in line.\nfunc choose_target(battle: Battle) -> Fighter:\n\tfor hero in battle.heroes:\n\t\tif hero.hp > 0:\n\t\t\treturn hero\n\treturn null\n\nfunc perform_action(battle: Battle, target: Fighter) -> void:\n\tvar damage := 12 + rage * 4\n\ttarget.hp -= damage\n\tbattle.log_line(\"%s smashes %s for %d.\" % [display_name, target.name, damage])\n\n# Overriding a hook: the ogre gets angrier every turn, then wears itself out.\nfunc after_turn(battle: Battle) -> void:\n\trage += 1\n\tif rage >= 3:\n\t\tbattle.log_line(\"%s is exhausted.\" % display_name)\n\t\tstunned_turns = 1\n\t\trage = 0\n",
            "template-method-gd-enemy-turn/shaman_ai.gd": "class_name ShamanAI\nextends EnemyAI\n\n@export var heal_amount := 10\n\n# The shaman targets its own most wounded ally instead of a hero.\nfunc choose_target(battle: Battle) -> Fighter:\n\tvar most_hurt: Fighter = null\n\tfor ally in battle.enemies:\n\t\tif ally.hp > 0 and (most_hurt == null or ally.missing_hp() > most_hurt.missing_hp()):\n\t\t\tmost_hurt = ally\n\treturn most_hurt\n\nfunc perform_action(battle: Battle, target: Fighter) -> void:\n\ttarget.hp = min(target.hp + heal_amount, target.max_hp)\n\tbattle.log_line(\"%s heals %s.\" % [display_name, target.name])\n"
          }
        },
        {
          "id": "template-method-socketserver-real",
          "title": "Python's socketserver",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/socketserver.py",
            "license": "PSF-2.0",
            "note": "socketserver.py is a verbatim excerpt of CPython 3.12.7 Lib/socketserver.py with unrelated parts cut and marked; echo_server.py was written for Software City."
          },
          "story": "The standard library's server framework is built from two template methods: the server's _handle_request_noblock() (get, verify, process, finish, shut down) and the handler's __init__ (setup, handle, finish). You write one handle() method.",
          "roles": {
            "Abstract Class": [
              "template-method-socketserver-real/socketserver.py#BaseServer",
              "template-method-socketserver-real/socketserver.py#BaseRequestHandler"
            ],
            "Template Method": [
              "template-method-socketserver-real/socketserver.py#BaseServer._handle_request_noblock",
              "template-method-socketserver-real/socketserver.py#BaseRequestHandler.__init__"
            ],
            "Concrete Class": [
              "template-method-socketserver-real/socketserver.py#TCPServer",
              "template-method-socketserver-real/socketserver.py#StreamRequestHandler",
              "template-method-socketserver-real/echo_server.py#ShoutHandler",
              "template-method-socketserver-real/echo_server.py#LocalOnlyServer"
            ],
            "Client": [
              "template-method-socketserver-real/echo_server.py#main"
            ]
          },
          "trace": [
            {
              "at": "template-method-socketserver-real/echo_server.py#main",
              "say": "main() picks a server class and a handler class and starts serving. Everything else is inherited."
            },
            {
              "at": "template-method-socketserver-real/socketserver.py#BaseServer._handle_request_noblock",
              "say": "For each connection the server runs its template: get_request, verify_request, process_request, shutdown_request."
            },
            {
              "at": "template-method-socketserver-real/socketserver.py#TCPServer.get_request",
              "say": "TCPServer fills in the 'get' step with socket.accept(). A UDP server fills the same step differently."
            },
            {
              "at": "template-method-socketserver-real/echo_server.py#LocalOnlyServer.verify_request",
              "say": "Our server overrides the verify_request() hook to refuse anyone but localhost. The base default just returns True."
            },
            {
              "at": "template-method-socketserver-real/socketserver.py#BaseServer.finish_request",
              "say": "finish_request() creates the handler. Its constructor is the second template method."
            },
            {
              "at": "template-method-socketserver-real/socketserver.py#BaseRequestHandler.__init__",
              "say": "The handler's __init__ always runs setup(), then handle(), then finish() in a finally block."
            },
            {
              "at": "template-method-socketserver-real/socketserver.py#StreamRequestHandler.setup",
              "say": "StreamRequestHandler fills setup() with file objects rfile and wfile over the socket."
            },
            {
              "at": "template-method-socketserver-real/echo_server.py#ShoutHandler.handle",
              "say": "Our one method: read a line, write it back in capitals. The framework calls it at the right time."
            }
          ],
          "files": {
            "template-method-socketserver-real/echo_server.py": "# Example usage written for Software City (not part of CPython).\n# In a real program you would write: from socketserver import TCPServer, StreamRequestHandler\nfrom .socketserver import TCPServer, StreamRequestHandler\n\n\nclass ShoutHandler(StreamRequestHandler):\n    \"\"\"Fills in the one step the template leaves open: handle().\"\"\"\n\n    def handle(self):\n        line = self.rfile.readline()\n        self.wfile.write(line.upper())\n\n\nclass LocalOnlyServer(TCPServer):\n    \"\"\"Overrides a hook of the server's own template: verify_request().\"\"\"\n\n    allow_reuse_address = True\n\n    def verify_request(self, request, client_address):\n        host = client_address[0]\n        return host == \"127.0.0.1\"\n\n\ndef main():\n    # Try it with: printf 'hello\\n' | nc 127.0.0.1 9999\n    with LocalOnlyServer((\"127.0.0.1\", 9999), ShoutHandler) as server:\n        server.serve_forever()\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "template-method-socketserver-real/socketserver.py": "# Source: CPython 3.12.7 — https://github.com/python/cpython/blob/v3.12.7/Lib/socketserver.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n# … trimmed: 125 lines (module docstring that explains the server classes, __version__) …\nimport socket\nimport selectors\nimport os\nimport sys\nimport threading\nfrom io import BufferedIOBase\nfrom time import monotonic as time\n# … trimmed: 16 lines that build __all__ …\n\nif hasattr(selectors, 'PollSelector'):\n    _ServerSelector = selectors.PollSelector\nelse:\n    _ServerSelector = selectors.SelectSelector\n\n\nclass BaseServer:\n\n    # … trimmed: 43-line class docstring listing the methods for callers and for subclasses …\n\n    timeout = None\n\n    def __init__(self, server_address, RequestHandlerClass):\n        \"\"\"Constructor.  May be extended, do not override.\"\"\"\n        self.server_address = server_address\n        self.RequestHandlerClass = RequestHandlerClass\n        self.__is_shut_down = threading.Event()\n        self.__shutdown_request = False\n\n    def server_activate(self):\n        \"\"\"Called by constructor to activate the server.\n\n        May be overridden.\n\n        \"\"\"\n        pass\n\n    # … trimmed: serve_forever(), 29 lines: a loop that waits on a selector and calls self._handle_request_noblock() whenever a client connects …\n    # … trimmed: shutdown() and service_actions() (17 lines) …\n\n    # The distinction between handling, getting, processing and finishing a\n    # request is fairly arbitrary.  Remember:\n    #\n    # - handle_request() is the top-level call.  It calls selector.select(),\n    #   get_request(), verify_request() and process_request()\n    # - get_request() is different for stream or datagram sockets\n    # - process_request() is the place that may fork a new process or create a\n    #   new thread to finish the request\n    # - finish_request() instantiates the request handler class; this\n    #   constructor will handle the request all by itself\n\n    # … trimmed: handle_request(), 29 lines that wait for a single request with a timeout, then call self._handle_request_noblock() …\n\n    def _handle_request_noblock(self):\n        \"\"\"Handle one request, without blocking.\n\n        I assume that selector.select() has returned that the socket is\n        readable before this function was called, so there should be no risk of\n        blocking in get_request().\n        \"\"\"\n        try:\n            request, client_address = self.get_request()\n        except OSError:\n            return\n        if self.verify_request(request, client_address):\n            try:\n                self.process_request(request, client_address)\n            except Exception:\n                self.handle_error(request, client_address)\n                self.shutdown_request(request)\n            except:\n                self.shutdown_request(request)\n                raise\n        else:\n            self.shutdown_request(request)\n\n    # … trimmed: handle_timeout() (7 lines) …\n\n    def verify_request(self, request, client_address):\n        \"\"\"Verify the request.  May be overridden.\n\n        Return True if we should proceed with this request.\n\n        \"\"\"\n        return True\n\n    def process_request(self, request, client_address):\n        \"\"\"Call finish_request.\n\n        Overridden by ForkingMixIn and ThreadingMixIn.\n\n        \"\"\"\n        self.finish_request(request, client_address)\n        self.shutdown_request(request)\n\n    # … trimmed: server_close() (8 lines) …\n\n    def finish_request(self, request, client_address):\n        \"\"\"Finish one request by instantiating RequestHandlerClass.\"\"\"\n        self.RequestHandlerClass(request, client_address, self)\n\n    def shutdown_request(self, request):\n        \"\"\"Called to shutdown and close an individual request.\"\"\"\n        self.close_request(request)\n\n    def close_request(self, request):\n        \"\"\"Called to clean up an individual request.\"\"\"\n        pass\n\n    # … trimmed: handle_error() and the context-manager methods (20 lines) …\n\n\nclass TCPServer(BaseServer):\n\n    # … trimmed: 45-line class docstring …\n\n    address_family = socket.AF_INET\n\n    socket_type = socket.SOCK_STREAM\n\n    request_queue_size = 5\n\n    allow_reuse_address = False\n\n    allow_reuse_port = False\n\n    def __init__(self, server_address, RequestHandlerClass, bind_and_activate=True):\n        \"\"\"Constructor.  May be extended, do not override.\"\"\"\n        BaseServer.__init__(self, server_address, RequestHandlerClass)\n        self.socket = socket.socket(self.address_family,\n                                    self.socket_type)\n        if bind_and_activate:\n            try:\n                self.server_bind()\n                self.server_activate()\n            except:\n                self.server_close()\n                raise\n\n    # … trimmed: server_bind(), server_activate(), server_close() and fileno() (37 lines): bind(), listen() and close() on the socket …\n\n    def get_request(self):\n        \"\"\"Get the request and client address from the socket.\n\n        May be overridden.\n\n        \"\"\"\n        return self.socket.accept()\n\n    def shutdown_request(self, request):\n        \"\"\"Called to shutdown and close an individual request.\"\"\"\n        try:\n            #explicitly shutdown.  socket.close() merely releases\n            #the socket and waits for GC to perform the actual close.\n            request.shutdown(socket.SHUT_WR)\n        except OSError:\n            pass #some platforms may raise ENOTCONN here\n        self.close_request(request)\n\n    def close_request(self, request):\n        \"\"\"Called to clean up an individual request.\"\"\"\n        request.close()\n\n\n# … trimmed: 214 lines (UDPServer, ForkingMixIn, ThreadingMixIn and the Unix/threading server variants) …\n\n\nclass BaseRequestHandler:\n\n    # … trimmed: 15-line class docstring: \"To implement a specific service, all you need to do is to derive a class which defines a handle() method.\" …\n\n    def __init__(self, request, client_address, server):\n        self.request = request\n        self.client_address = client_address\n        self.server = server\n        self.setup()\n        try:\n            self.handle()\n        finally:\n            self.finish()\n\n    def setup(self):\n        pass\n\n    def handle(self):\n        pass\n\n    def finish(self):\n        pass\n\n\n# The following two classes make it possible to use the same service\n# class for stream or datagram servers.\n# Each class sets up these instance variables:\n# - rfile: a file object from which receives the request is read\n# - wfile: a file object to which the reply is written\n# When the handle() method returns, wfile is flushed properly\n\n\nclass StreamRequestHandler(BaseRequestHandler):\n\n    \"\"\"Define self.rfile and self.wfile for stream sockets.\"\"\"\n\n    # … trimmed: 7 lines of comments about buffer sizes …\n\n    rbufsize = -1\n    wbufsize = 0\n\n    # A timeout to apply to the request socket, if not None.\n    timeout = None\n\n    # Disable nagle algorithm for this socket, if True.\n    # Use only when wbufsize != 0, to avoid small packets.\n    disable_nagle_algorithm = False\n\n    def setup(self):\n        self.connection = self.request\n        if self.timeout is not None:\n            self.connection.settimeout(self.timeout)\n        if self.disable_nagle_algorithm:\n            self.connection.setsockopt(socket.IPPROTO_TCP,\n                                       socket.TCP_NODELAY, True)\n        self.rfile = self.connection.makefile('rb', self.rbufsize)\n        if self.wbufsize == 0:\n            self.wfile = _SocketWriter(self.connection)\n        else:\n            self.wfile = self.connection.makefile('wb', self.wbufsize)\n\n    def finish(self):\n        if not self.wfile.closed:\n            try:\n                self.wfile.flush()\n            except socket.error:\n                # A final socket error may have occurred here, such as\n                # the local error ECONNABORTED.\n                pass\n        self.wfile.close()\n        self.rfile.close()\n\n# … trimmed: _SocketWriter and DatagramRequestHandler (31 lines) …\n"
          }
        }
      ]
    },
    {
      "id": "chain-of-responsibility",
      "name": "Chain of Responsibility",
      "family": "Behavioral",
      "aka": [
        "Middleware",
        "Handler chain",
        "Pipeline of handlers"
      ],
      "tagline": "Pass a request along a line of handlers until one of them deals with it.",
      "intent": "Give several objects a chance to handle a request by linking them into a chain, so the sender only talks to the first link. Each handler decides to handle the request, change it, or pass it to the next one, and you can reorder or extend the chain without touching the sender.",
      "analogy": "A customer-support hotline: the robot answers first, then a support agent, then a manager. You only ever dial one number; the call moves up the line until someone can help.",
      "cityShape": "Look for a row of handler buildings with a handle() or absorb() floor at the same height, each sending one pipe to its neighbour like a relay. The base class frame holds the next antenna that setNext() writes into; the client building connects only to the first link of the chain.",
      "roles": [
        {
          "name": "Handler",
          "desc": "The shared interface or base class: a way to handle a request and a link to the next handler."
        },
        {
          "name": "Concrete Handler",
          "desc": "Decides whether this request is its job. If not (or not completely), it forwards it down the chain."
        },
        {
          "name": "Request",
          "desc": "The data that travels along the chain (a ticket, a damage amount, an HTTP request)."
        },
        {
          "name": "Client",
          "desc": "Builds the chain once and sends requests to its first link only."
        }
      ],
      "whenToUse": [
        "More than one object may handle a request and you do not want the sender to pick which one.",
        "You want to add, remove or reorder processing steps without editing the code that sends requests.",
        "Web servers and frameworks: logging, auth, caching and compression as stackable middleware.",
        "Games: damage that flows through shield, armor and health, or input that goes to UI before the player."
      ],
      "pitfalls": [
        "A request can fall off the end of the chain unhandled; decide on a default (an error, a catch-all last link).",
        "Long chains are hard to debug because the path a request took is not visible in any single place.",
        "Order matters: putting auth after the endpoint, or armor before the shield, silently changes behaviour."
      ],
      "related": [
        "decorator",
        "command",
        "pipes-and-filters",
        "composite"
      ],
      "quiz": [
        {
          "q": "In a chain of responsibility, what does the client need to know?",
          "options": [
            "Every handler class in the chain",
            "Only the first handler",
            "Which handler will finally handle the request",
            "The length of the chain"
          ],
          "answer": 1,
          "why": "The client hands the request to the first link. Which handler ends up dealing with it is decided inside the chain, so handlers can change without touching the client."
        },
        {
          "q": "A middleware decides not to call next(). What happens?",
          "options": [
            "The request is retried from the start",
            "The chain stops there and later handlers never run",
            "The next handler is called anyway",
            "The server crashes"
          ],
          "answer": 1,
          "why": "Forwarding is a choice each handler makes. Not calling next is how an auth check rejects a request before it reaches the endpoint."
        }
      ],
      "demos": [
        {
          "id": "chain-of-responsibility-ts-support",
          "title": "Support ticket escalation",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A ticket goes to a FAQ bot, then a human agent, then a manager. Notice that handle() lives only in the base class: the concrete handlers just answer 'is this mine?'.",
          "roles": {
            "Handler": [
              "chain-of-responsibility-ts-support/handler.ts#SupportHandler"
            ],
            "Concrete Handler": [
              "chain-of-responsibility-ts-support/handlers.ts#FaqBot",
              "chain-of-responsibility-ts-support/handlers.ts#HumanAgent",
              "chain-of-responsibility-ts-support/handlers.ts#Manager"
            ],
            "Request": [
              "chain-of-responsibility-ts-support/ticket.ts#Ticket"
            ],
            "Client": [
              "chain-of-responsibility-ts-support/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "chain-of-responsibility-ts-support/main.ts#main",
              "say": "main() links bot -> agent -> manager once, then sends every ticket to the bot only."
            },
            {
              "at": "chain-of-responsibility-ts-support/handler.ts#SupportHandler.setNext",
              "say": "setNext() stores the link and returns it, so the chain can be built in one readable line."
            },
            {
              "at": "chain-of-responsibility-ts-support/handler.ts#SupportHandler.handle",
              "say": "handle() asks canHandle(). If the answer is no, it forwards the ticket to next instead of solving it."
            },
            {
              "at": "chain-of-responsibility-ts-support/handlers.ts#FaqBot.canHandle",
              "say": "The bot only knows password questions. A slow-app ticket is not its job, so it moves on."
            },
            {
              "at": "chain-of-responsibility-ts-support/handlers.ts#HumanAgent.canHandle",
              "say": "The agent takes anything up to severity 2. A double charge (severity 3) is passed up."
            },
            {
              "at": "chain-of-responsibility-ts-support/handlers.ts#Manager.resolve",
              "say": "The manager is the catch-all last link, so no ticket falls off the end of the chain."
            }
          ],
          "files": {
            "chain-of-responsibility-ts-support/handler.ts": "import { Ticket } from './ticket';\n\n// The base handler: knows how to hold a \"next\" link and pass a ticket along.\nexport abstract class SupportHandler {\n  private next: SupportHandler | null = null;\n\n  setNext(handler: SupportHandler): SupportHandler {\n    this.next = handler;\n    return handler;\n  }\n\n  handle(ticket: Ticket): string {\n    if (this.canHandle(ticket)) {\n      return this.resolve(ticket);\n    }\n    if (this.next) {\n      return this.next.handle(ticket);\n    }\n    return `Nobody could help with \"${ticket.question}\"`;\n  }\n\n  protected abstract canHandle(ticket: Ticket): boolean;\n  protected abstract resolve(ticket: Ticket): string;\n}\n",
            "chain-of-responsibility-ts-support/handlers.ts": "import { SupportHandler } from './handler';\nimport { Ticket } from './ticket';\n\n// Each concrete handler only decides \"is this mine?\". None of them knows who comes next.\nexport class FaqBot extends SupportHandler {\n  protected canHandle(ticket: Ticket): boolean {\n    return ticket.question.includes('password');\n  }\n\n  protected resolve(ticket: Ticket): string {\n    return 'Bot: click \"Forgot password\" on the login page.';\n  }\n}\n\nexport class HumanAgent extends SupportHandler {\n  protected canHandle(ticket: Ticket): boolean {\n    return ticket.severity <= 2;\n  }\n\n  protected resolve(ticket: Ticket): string {\n    return `Agent: I will look into \"${ticket.question}\" today.`;\n  }\n}\n\nexport class Manager extends SupportHandler {\n  protected canHandle(ticket: Ticket): boolean {\n    return true;\n  }\n\n  protected resolve(ticket: Ticket): string {\n    return `Manager: refund approved for \"${ticket.question}\".`;\n  }\n}\n",
            "chain-of-responsibility-ts-support/main.ts": "import { FaqBot, HumanAgent, Manager } from './handlers';\n\nfunction main(): void {\n  const bot = new FaqBot();\n  // Build the chain once: bot -> agent -> manager.\n  bot.setNext(new HumanAgent()).setNext(new Manager());\n\n  console.log(bot.handle({ question: 'I forgot my password', severity: 1 }));\n  console.log(bot.handle({ question: 'App is slow', severity: 2 }));\n  console.log(bot.handle({ question: 'I was charged twice', severity: 3 }));\n}\n\nmain();\n",
            "chain-of-responsibility-ts-support/ticket.ts": "// The request that travels down the chain.\nexport interface Ticket {\n  question: string;\n  severity: number; // 1 = easy, 3 = serious\n}\n"
          }
        },
        {
          "id": "chain-of-responsibility-gd-damage",
          "title": "Shield, armor, health damage chain",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A hit flows through Shield, Armor and Health nodes. Each one absorbs part of the damage and passes the rest on, so here several handlers can share one request.",
          "roles": {
            "Handler": [
              "chain-of-responsibility-gd-damage/damage_handler.gd#handle",
              "chain-of-responsibility-gd-damage/damage_handler.gd#set_next"
            ],
            "Concrete Handler": [
              "chain-of-responsibility-gd-damage/shield.gd#absorb",
              "chain-of-responsibility-gd-damage/armor.gd#absorb",
              "chain-of-responsibility-gd-damage/health.gd#absorb"
            ],
            "Request": [
              "chain-of-responsibility-gd-damage/damage_handler.gd#handle"
            ],
            "Client": [
              "chain-of-responsibility-gd-damage/player.gd#_ready",
              "chain-of-responsibility-gd-damage/player.gd#take_hit"
            ]
          },
          "trace": [
            {
              "at": "chain-of-responsibility-gd-damage/player.gd#_ready",
              "say": "The player wires its child nodes into a chain: shield, then armor, then health."
            },
            {
              "at": "chain-of-responsibility-gd-damage/player.gd#take_hit",
              "say": "A bullet hits. The player only talks to the first link; it never does damage maths itself."
            },
            {
              "at": "chain-of-responsibility-gd-damage/damage_handler.gd#handle",
              "say": "The shared handle() asks the link to absorb() and forwards whatever is left to next."
            },
            {
              "at": "chain-of-responsibility-gd-damage/shield.gd#absorb",
              "say": "The shield soaks up damage until its energy runs out, then returns the remainder."
            },
            {
              "at": "chain-of-responsibility-gd-damage/armor.gd#absorb",
              "say": "Armor removes a flat amount. It does not care whether the shield was empty or full."
            },
            {
              "at": "chain-of-responsibility-gd-damage/health.gd#absorb",
              "say": "Health is the last link: it takes the rest and emits died at zero, ending the chain."
            }
          ],
          "files": {
            "chain-of-responsibility-gd-damage/armor.gd": "class_name Armor\nextends DamageHandler\n\n# Second in line: armor never runs out, it just removes a flat amount from every hit.\n@export var flat_reduction := 5\n\nfunc absorb(amount: int) -> int:\n\tvar left: int = max(amount - flat_reduction, 0)\n\tprint(\"Armor blocks %d\" % (amount - left))\n\treturn left\n",
            "chain-of-responsibility-gd-damage/damage_handler.gd": "class_name DamageHandler\nextends Node\n\n# One link in the damage chain. It absorbs what it can and passes the rest on.\nvar next: DamageHandler\n\nfunc set_next(handler: DamageHandler) -> DamageHandler:\n\tnext = handler\n\treturn handler\n\nfunc handle(amount: int) -> int:\n\tvar left := absorb(amount)\n\tif left > 0 and next != null:\n\t\treturn next.handle(left)\n\treturn left\n\n# Subclasses override this. The default absorbs nothing.\nfunc absorb(amount: int) -> int:\n\treturn amount\n",
            "chain-of-responsibility-gd-damage/health.gd": "class_name Health\nextends DamageHandler\n\n# Last in line: whatever reaches the health pool hurts.\nsignal died\n\n@export var hp := 100\n\nfunc absorb(amount: int) -> int:\n\thp = max(hp - amount, 0)\n\tprint(\"Health takes %d (hp %d)\" % [amount, hp])\n\tif hp == 0:\n\t\tdied.emit()\n\treturn 0\n",
            "chain-of-responsibility-gd-damage/player.gd": "class_name Player\nextends CharacterBody2D\n\n# The player builds the chain once and then only ever talks to its first link.\n@onready var shield: Shield = $Shield\n@onready var armor: Armor = $Armor\n@onready var health: Health = $Health\n\nfunc _ready() -> void:\n\tshield.set_next(armor).set_next(health)\n\nfunc take_hit(amount: int) -> void:\n\tif shield != null:\n\t\tshield.handle(amount)\n\telse:\n\t\tarmor.handle(amount)\n\nfunc break_shield() -> void:\n\t# Chains can be rewired at runtime: from now on hits start at the armor.\n\tshield = null\n",
            "chain-of-responsibility-gd-damage/shield.gd": "class_name Shield\nextends DamageHandler\n\n# First in line: a recharging energy shield that soaks up hits until it is empty.\n@export var energy := 40\n\nfunc absorb(amount: int) -> int:\n\tvar soaked: int = min(energy, amount)\n\tenergy -= soaked\n\tif soaked > 0:\n\t\tprint(\"Shield absorbs %d (energy left %d)\" % [soaked, energy])\n\treturn amount - soaked\n"
          }
        },
        {
          "id": "chain-of-responsibility-chi-real",
          "title": "chi: HTTP middleware chain in Go",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "go-chi/chi",
            "url": "https://github.com/go-chi/chi/blob/v5.2.1/chain.go",
            "license": "MIT",
            "note": "chi/chain.go and chi/middleware/{basic_auth,heartbeat,nocache}.go are verbatim from chi v5.2.1; chi/chi.go is trimmed to the Middlewares type; main.go was written for Software City."
          },
          "story": "Real middleware from a popular Go router. Each middleware wraps the next http.Handler; Heartbeat and BasicAuth can answer early and never call next, which is the chain's 'stop here'.",
          "roles": {
            "Handler": [
              "chain-of-responsibility-chi-real/chi/chi.go",
              "chain-of-responsibility-chi-real/chi/chain.go#ChainHandler"
            ],
            "Concrete Handler": [
              "chain-of-responsibility-chi-real/chi/middleware/heartbeat.go#Heartbeat",
              "chain-of-responsibility-chi-real/chi/middleware/basic_auth.go#BasicAuth",
              "chain-of-responsibility-chi-real/chi/middleware/nocache.go#NoCache"
            ],
            "Request": [
              "chain-of-responsibility-chi-real/main.go#send"
            ],
            "Client": [
              "chain-of-responsibility-chi-real/main.go#buildHandler",
              "chain-of-responsibility-chi-real/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "chain-of-responsibility-chi-real/main.go#buildHandler",
              "say": "The client lists three middlewares in order and puts adminPage at the end of the chain."
            },
            {
              "at": "chain-of-responsibility-chi-real/chi/chain.go#Middlewares.HandlerFunc",
              "say": "HandlerFunc() builds the chain once and returns a ChainHandler that looks like one ordinary handler."
            },
            {
              "at": "chain-of-responsibility-chi-real/chi/chain.go#chain",
              "say": "chain() wraps from the back: the last middleware wraps the endpoint, each earlier one wraps the result."
            },
            {
              "at": "chain-of-responsibility-chi-real/chi/middleware/heartbeat.go#Heartbeat",
              "say": "First link: a GET /ping is answered right here with '.', so auth and the endpoint never run."
            },
            {
              "at": "chain-of-responsibility-chi-real/chi/middleware/basic_auth.go#BasicAuth",
              "say": "Second link: wrong credentials stop the request. Only a valid user reaches next.ServeHTTP."
            },
            {
              "at": "chain-of-responsibility-chi-real/chi/middleware/basic_auth.go#basicAuthFailed",
              "say": "Rejecting is just writing a 401 and returning without calling next. That ends the chain."
            },
            {
              "at": "chain-of-responsibility-chi-real/chi/middleware/nocache.go#NoCache",
              "say": "Third link: it changes headers and always forwards, a handler that helps instead of deciding."
            },
            {
              "at": "chain-of-responsibility-chi-real/main.go#adminPage",
              "say": "Only a request that survived every link reaches the endpoint."
            }
          ],
          "files": {
            "chain-of-responsibility-chi-real/chi/chain.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/chain.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka, Google Inc. Included for study.\npackage chi\n\nimport \"net/http\"\n\n// Chain returns a Middlewares type from a slice of middleware handlers.\nfunc Chain(middlewares ...func(http.Handler) http.Handler) Middlewares {\n\treturn Middlewares(middlewares)\n}\n\n// Handler builds and returns a http.Handler from the chain of middlewares,\n// with `h http.Handler` as the final handler.\nfunc (mws Middlewares) Handler(h http.Handler) http.Handler {\n\treturn &ChainHandler{h, chain(mws, h), mws}\n}\n\n// HandlerFunc builds and returns a http.Handler from the chain of middlewares,\n// with `h http.Handler` as the final handler.\nfunc (mws Middlewares) HandlerFunc(h http.HandlerFunc) http.Handler {\n\treturn &ChainHandler{h, chain(mws, h), mws}\n}\n\n// ChainHandler is a http.Handler with support for handler composition and\n// execution.\ntype ChainHandler struct {\n\tEndpoint    http.Handler\n\tchain       http.Handler\n\tMiddlewares Middlewares\n}\n\nfunc (c *ChainHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {\n\tc.chain.ServeHTTP(w, r)\n}\n\n// chain builds a http.Handler composed of an inline middleware stack and endpoint\n// handler in the order they are passed.\nfunc chain(middlewares []func(http.Handler) http.Handler, endpoint http.Handler) http.Handler {\n\t// Return ahead of time if there aren't any middlewares for the chain\n\tif len(middlewares) == 0 {\n\t\treturn endpoint\n\t}\n\n\t// Wrap the end handler with the middleware chain\n\th := middlewares[len(middlewares)-1](endpoint)\n\tfor i := len(middlewares) - 2; i >= 0; i-- {\n\t\th = middlewares[i](h)\n\t}\n\n\treturn h\n}\n",
            "chain-of-responsibility-chi-real/chi/chi.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/chi.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka, Google Inc. Included for study.\npackage chi\n\nimport \"net/http\"\n\n// … trimmed: 128 lines (package docs, NewRouter, the Router and Routes interfaces) not related to the chain …\n\n// Middlewares type is a slice of standard middleware handlers with methods\n// to compose middleware chains and http.Handler's.\ntype Middlewares []func(http.Handler) http.Handler\n",
            "chain-of-responsibility-chi-real/chi/middleware/basic_auth.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/middleware/basic_auth.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka, Google Inc. Included for study.\npackage middleware\n\nimport (\n\t\"crypto/subtle\"\n\t\"fmt\"\n\t\"net/http\"\n)\n\n// BasicAuth implements a simple middleware handler for adding basic http auth to a route.\nfunc BasicAuth(realm string, creds map[string]string) func(next http.Handler) http.Handler {\n\treturn func(next http.Handler) http.Handler {\n\t\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\t\tuser, pass, ok := r.BasicAuth()\n\t\t\tif !ok {\n\t\t\t\tbasicAuthFailed(w, realm)\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tcredPass, credUserOk := creds[user]\n\t\t\tif !credUserOk || subtle.ConstantTimeCompare([]byte(pass), []byte(credPass)) != 1 {\n\t\t\t\tbasicAuthFailed(w, realm)\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tnext.ServeHTTP(w, r)\n\t\t})\n\t}\n}\n\nfunc basicAuthFailed(w http.ResponseWriter, realm string) {\n\tw.Header().Add(\"WWW-Authenticate\", fmt.Sprintf(`Basic realm=\"%s\"`, realm))\n\tw.WriteHeader(http.StatusUnauthorized)\n}\n",
            "chain-of-responsibility-chi-real/chi/middleware/heartbeat.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/middleware/heartbeat.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka, Google Inc. Included for study.\npackage middleware\n\nimport (\n\t\"net/http\"\n\t\"strings\"\n)\n\n// Heartbeat endpoint middleware useful to setting up a path like\n// `/ping` that load balancers or uptime testing external services\n// can make a request before hitting any routes. It's also convenient\n// to place this above ACL middlewares as well.\nfunc Heartbeat(endpoint string) func(http.Handler) http.Handler {\n\tf := func(h http.Handler) http.Handler {\n\t\tfn := func(w http.ResponseWriter, r *http.Request) {\n\t\t\tif (r.Method == \"GET\" || r.Method == \"HEAD\") && strings.EqualFold(r.URL.Path, endpoint) {\n\t\t\t\tw.Header().Set(\"Content-Type\", \"text/plain\")\n\t\t\t\tw.WriteHeader(http.StatusOK)\n\t\t\t\tw.Write([]byte(\".\"))\n\t\t\t\treturn\n\t\t\t}\n\t\t\th.ServeHTTP(w, r)\n\t\t}\n\t\treturn http.HandlerFunc(fn)\n\t}\n\treturn f\n}\n",
            "chain-of-responsibility-chi-real/chi/middleware/nocache.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/middleware/nocache.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka, Google Inc. Included for study.\npackage middleware\n\n// Ported from Goji's middleware, source:\n// https://github.com/zenazn/goji/tree/master/web/middleware\n\nimport (\n\t\"net/http\"\n\t\"time\"\n)\n\n// Unix epoch time\nvar epoch = time.Unix(0, 0).UTC().Format(http.TimeFormat)\n\n// Taken from https://github.com/mytrile/nocache\nvar noCacheHeaders = map[string]string{\n\t\"Expires\":         epoch,\n\t\"Cache-Control\":   \"no-cache, no-store, no-transform, must-revalidate, private, max-age=0\",\n\t\"Pragma\":          \"no-cache\",\n\t\"X-Accel-Expires\": \"0\",\n}\n\nvar etagHeaders = []string{\n\t\"ETag\",\n\t\"If-Modified-Since\",\n\t\"If-Match\",\n\t\"If-None-Match\",\n\t\"If-Range\",\n\t\"If-Unmodified-Since\",\n}\n\n// NoCache is a simple piece of middleware that sets a number of HTTP headers to prevent\n// a router (or subrouter) from being cached by an upstream proxy and/or client.\n//\n// As per http://wiki.nginx.org/HttpProxyModule - NoCache sets:\n//\n//\tExpires: Thu, 01 Jan 1970 00:00:00 UTC\n//\tCache-Control: no-cache, private, max-age=0\n//\tX-Accel-Expires: 0\n//\tPragma: no-cache (for HTTP/1.0 proxies/clients)\nfunc NoCache(h http.Handler) http.Handler {\n\tfn := func(w http.ResponseWriter, r *http.Request) {\n\n\t\t// Delete any ETag headers that may have been set\n\t\tfor _, v := range etagHeaders {\n\t\t\tif r.Header.Get(v) != \"\" {\n\t\t\t\tr.Header.Del(v)\n\t\t\t}\n\t\t}\n\n\t\t// Set our NoCache headers\n\t\tfor k, v := range noCacheHeaders {\n\t\t\tw.Header().Set(k, v)\n\t\t}\n\n\t\th.ServeHTTP(w, r)\n\t}\n\n\treturn http.HandlerFunc(fn)\n}\n",
            "chain-of-responsibility-chi-real/main.go": "// Example usage written for Software City (not part of chi).\npackage main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n\n\t\"github.com/go-chi/chi/v5\"\n\t\"github.com/go-chi/chi/v5/middleware\"\n)\n\n// adminPage is the endpoint at the very end of the chain.\nfunc adminPage(w http.ResponseWriter, r *http.Request) {\n\tw.Write([]byte(\"welcome, admin\"))\n}\n\nfunc buildHandler() http.Handler {\n\tcreds := map[string]string{\"theo\": \"s3cret\"}\n\treturn chi.Chain(\n\t\tmiddleware.Heartbeat(\"/ping\"),\n\t\tmiddleware.BasicAuth(\"admin\", creds),\n\t\tmiddleware.NoCache,\n\t).HandlerFunc(adminPage)\n}\n\nfunc send(h http.Handler, path string, user string, pass string) {\n\treq := httptest.NewRequest(\"GET\", path, nil)\n\tif user != \"\" {\n\t\treq.SetBasicAuth(user, pass)\n\t}\n\trec := httptest.NewRecorder()\n\th.ServeHTTP(rec, req)\n\tfmt.Println(path, user, \"->\", rec.Code, rec.Body.String())\n}\n\nfunc main() {\n\th := buildHandler()\n\tsend(h, \"/ping\", \"\", \"\")\n\tsend(h, \"/admin\", \"mallory\", \"guess\")\n\tsend(h, \"/admin\", \"theo\", \"s3cret\")\n}\n"
          }
        }
      ]
    },
    {
      "id": "visitor",
      "name": "Visitor",
      "family": "Behavioral",
      "aka": [
        "Double dispatch",
        "Tree walker listener"
      ],
      "tagline": "Add new operations to a family of classes without editing those classes.",
      "intent": "Move an operation that touches many element types out of the elements and into a separate visitor object with one method per element type. Each element only has an accept(visitor) method that calls the matching visit method, so new operations become new visitor classes instead of edits scattered over every element.",
      "analogy": "A tax inspector visiting a street of shops: the bakery, the garage and the florist each just open the door. The inspector brings the knowledge of how to assess each kind of shop; next month a fire inspector walks the same street with different rules.",
      "cityShape": "Look for element buildings that each have one short accept() floor sending a single pipe across to a visitor building, where a stack of visitX() floors line up, one per element type. A second visitor building has the same stack at the same heights: same questions, different answers.",
      "roles": [
        {
          "name": "Visitor",
          "desc": "Declares one visit method per element type (the operation's interface)."
        },
        {
          "name": "Concrete Visitor",
          "desc": "One operation, such as computing area, a price, or a lint warning, implemented for every element type."
        },
        {
          "name": "Element",
          "desc": "A node or item with an accept(visitor) method that calls back the visit method for its own type."
        },
        {
          "name": "Object Structure",
          "desc": "The collection or tree that walks its elements and lets a visitor visit each one."
        },
        {
          "name": "Client",
          "desc": "Picks a visitor and runs it over the structure."
        }
      ],
      "whenToUse": [
        "The set of element types is stable, but you keep adding new operations over them (export, print, price, validate).",
        "Walking syntax trees: compilers, linters and formatters attach behaviour per node type.",
        "You want related logic for one operation in one file instead of spread across many classes."
      ],
      "pitfalls": [
        "Adding a new element type forces a change to every visitor; choose Visitor only when types rarely change.",
        "Visitors often need access to element internals, which can weaken encapsulation.",
        "For two or three types a simple switch or polymorphic method is clearer than accept/visit ceremony."
      ],
      "related": [
        "composite",
        "iterator",
        "command",
        "strategy"
      ],
      "quiz": [
        {
          "q": "You need to add a 'save to JSON' feature to five existing shape classes that use Visitor. What do you write?",
          "options": [
            "A save method in each of the five classes",
            "One new JsonVisitor class with five visit methods",
            "A new Shape subclass",
            "A new accept method in each class"
          ],
          "answer": 1,
          "why": "Operations live in visitors. A new operation is one new visitor; the shape classes and their accept() methods stay untouched."
        },
        {
          "q": "Why does each element call visitor.visitCircle(this) instead of the visitor checking the type itself?",
          "options": [
            "It is faster to type",
            "The element knows its own type, so the right method is picked without if/instanceof chains",
            "Visitors cannot read fields",
            "To avoid needing an interface"
          ],
          "answer": 1,
          "why": "This is double dispatch: the first call picks the element's accept(), the second picks the visitor method for that exact type."
        }
      ],
      "demos": [
        {
          "id": "visitor-py-shapes",
          "title": "Shapes: area and SVG export",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Two operations, area and SVG export, run over circles and rectangles. Notice that shapes.py has no maths or markup in it: each operation lives in its own visitor class.",
          "roles": {
            "Visitor": [
              "visitor-py-shapes/visitors.py"
            ],
            "Concrete Visitor": [
              "visitor-py-shapes/visitors.py#AreaVisitor",
              "visitor-py-shapes/visitors.py#SvgVisitor"
            ],
            "Element": [
              "visitor-py-shapes/shapes.py#Shape",
              "visitor-py-shapes/shapes.py#Circle",
              "visitor-py-shapes/shapes.py#Rectangle"
            ],
            "Object Structure": [
              "visitor-py-shapes/main.py#main"
            ],
            "Client": [
              "visitor-py-shapes/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "visitor-py-shapes/main.py#main",
              "say": "main() builds a drawing and runs the same list through two different visitors."
            },
            {
              "at": "visitor-py-shapes/shapes.py#Circle.accept",
              "say": "The circle knows it is a circle, so it calls visit_circle. No isinstance checks anywhere."
            },
            {
              "at": "visitor-py-shapes/visitors.py#AreaVisitor.visit_circle",
              "say": "The area rule for circles lives here, next to the rule for rectangles."
            },
            {
              "at": "visitor-py-shapes/shapes.py#Rectangle.accept",
              "say": "The rectangle makes the same move, landing on visit_rectangle instead."
            },
            {
              "at": "visitor-py-shapes/visitors.py#AreaVisitor.visit_rectangle",
              "say": "Width times height. Every shape type has a method, so the sum covers the whole drawing."
            },
            {
              "at": "visitor-py-shapes/visitors.py#SvgVisitor.visit_circle",
              "say": "A second pass with SvgVisitor reuses the same accept() calls to produce markup instead."
            }
          ],
          "files": {
            "visitor-py-shapes/main.py": "from .shapes import Circle, Rectangle\nfrom .visitors import AreaVisitor, SvgVisitor\n\n\ndef main():\n    drawing = [Circle(2), Rectangle(3, 4), Circle(1)]\n\n    area = AreaVisitor()\n    total = sum(shape.accept(area) for shape in drawing)\n    print(f\"Total area: {total:.1f}\")\n\n    svg = SvgVisitor()\n    for shape in drawing:\n        print(shape.accept(svg))\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "visitor-py-shapes/shapes.py": "\n# The elements. Each one has a single extra method, accept(), and nothing else pattern-related.\nclass Shape:\n    def accept(self, visitor):\n        raise NotImplementedError\n\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n\n    def accept(self, visitor):\n        # \"Double dispatch\": the shape picks the visitor method that matches its own type.\n        return visitor.visit_circle(self)\n\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def accept(self, visitor):\n        return visitor.visit_rectangle(self)\n",
            "visitor-py-shapes/visitors.py": "import math\n\n\n# Each visitor is one operation over all shape types. Adding a new operation = adding a new class here.\nclass AreaVisitor:\n    def visit_circle(self, circle):\n        return math.pi * circle.radius ** 2\n\n    def visit_rectangle(self, rect):\n        return rect.width * rect.height\n\n\nclass SvgVisitor:\n    def visit_circle(self, circle):\n        return f'<circle r=\"{circle.radius}\" />'\n\n    def visit_rectangle(self, rect):\n        return f'<rect width=\"{rect.width}\" height=\"{rect.height}\" />'\n"
          }
        },
        {
          "id": "visitor-cs-inventory",
          "title": "RPG inventory: sell value and tooltips",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "An inventory of weapons, potions and armor is visited by a merchant price calculator and a tooltip builder. Visitors carry their own state (a running total, a text buffer).",
          "roles": {
            "Visitor": [
              "visitor-cs-inventory/IItemVisitor.cs#IItemVisitor"
            ],
            "Concrete Visitor": [
              "visitor-cs-inventory/Visitors.cs#SellValueVisitor",
              "visitor-cs-inventory/Visitors.cs#TooltipVisitor"
            ],
            "Element": [
              "visitor-cs-inventory/Items.cs#IItem",
              "visitor-cs-inventory/Items.cs#Weapon",
              "visitor-cs-inventory/Items.cs#Potion",
              "visitor-cs-inventory/Items.cs#Armor"
            ],
            "Object Structure": [
              "visitor-cs-inventory/Inventory.cs#Inventory"
            ],
            "Client": [
              "visitor-cs-inventory/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "visitor-cs-inventory/Program.cs#Program.Main",
              "say": "Main fills a bag with three item types, then hands it a SellValueVisitor."
            },
            {
              "at": "visitor-cs-inventory/Inventory.cs#Inventory.Accept",
              "say": "The inventory only loops. It passes the visitor to each item without knowing what it computes."
            },
            {
              "at": "visitor-cs-inventory/Items.cs#Weapon.Accept",
              "say": "The weapon calls VisitWeapon(this): the compiler now knows the exact type, no casting needed."
            },
            {
              "at": "visitor-cs-inventory/Visitors.cs#SellValueVisitor.VisitWeapon",
              "say": "Price depends on damage and wear. The rule sits with the other price rules, not inside Weapon."
            },
            {
              "at": "visitor-cs-inventory/Visitors.cs#SellValueVisitor.VisitPotion",
              "say": "Potions are priced per charge. The visitor adds to its Total field as it goes."
            },
            {
              "at": "visitor-cs-inventory/Visitors.cs#TooltipVisitor.VisitArmor",
              "say": "A second visitor walks the same bag to build tooltips: a new feature with no edits to Items.cs."
            },
            {
              "at": "visitor-cs-inventory/Visitors.cs#TooltipVisitor.Result",
              "say": "After the walk the client reads the result the visitor collected."
            }
          ],
          "files": {
            "visitor-cs-inventory/IItemVisitor.cs": "// One Visit method per item type. Every operation over the inventory implements this.\npublic interface IItemVisitor\n{\n    void VisitWeapon(Weapon weapon);\n    void VisitPotion(Potion potion);\n    void VisitArmor(Armor armor);\n}\n",
            "visitor-cs-inventory/Inventory.cs": "using System.Collections.Generic;\n\n// The object structure: it knows how to walk its items, not what visitors do with them.\npublic class Inventory\n{\n    private readonly List<IItem> items = new List<IItem>();\n\n    public void Add(IItem item)\n    {\n        items.Add(item);\n    }\n\n    public void Accept(IItemVisitor visitor)\n    {\n        foreach (var item in items)\n        {\n            item.Accept(visitor);\n        }\n    }\n}\n",
            "visitor-cs-inventory/Items.cs": "public interface IItem\n{\n    void Accept(IItemVisitor visitor);\n}\n\n// Items hold data. They do not know about prices, tooltips or saving.\npublic class Weapon : IItem\n{\n    public string Name;\n    public int Damage;\n    public int Durability;\n\n    public Weapon(string name, int damage, int durability)\n    {\n        Name = name;\n        Damage = damage;\n        Durability = durability;\n    }\n\n    public void Accept(IItemVisitor visitor)\n    {\n        visitor.VisitWeapon(this);\n    }\n}\n\npublic class Potion : IItem\n{\n    public string Effect;\n    public int Charges;\n\n    public Potion(string effect, int charges)\n    {\n        Effect = effect;\n        Charges = charges;\n    }\n\n    public void Accept(IItemVisitor visitor)\n    {\n        visitor.VisitPotion(this);\n    }\n}\n\npublic class Armor : IItem\n{\n    public string Slot;\n    public int Defense;\n\n    public Armor(string slot, int defense)\n    {\n        Slot = slot;\n        Defense = defense;\n    }\n\n    public void Accept(IItemVisitor visitor)\n    {\n        visitor.VisitArmor(this);\n    }\n}\n",
            "visitor-cs-inventory/Program.cs": "using System;\n\npublic static class Program\n{\n    public static void Main()\n    {\n        var bag = new Inventory();\n        bag.Add(new Weapon(\"Iron sword\", 12, 80));\n        bag.Add(new Potion(\"healing\", 3));\n        bag.Add(new Armor(\"Chest\", 7));\n\n        var seller = new SellValueVisitor();\n        bag.Accept(seller);\n        Console.WriteLine($\"Merchant offers {seller.Total} gold\");\n\n        var tooltip = new TooltipVisitor();\n        bag.Accept(tooltip);\n        Console.Write(tooltip.Result());\n    }\n}\n",
            "visitor-cs-inventory/Visitors.cs": "using System.Text;\n\n// Operation 1: what would the merchant pay? Keeps a running total as state.\npublic class SellValueVisitor : IItemVisitor\n{\n    public int Total;\n\n    public void VisitWeapon(Weapon weapon)\n    {\n        Total += weapon.Damage * 3 * weapon.Durability / 100;\n    }\n\n    public void VisitPotion(Potion potion)\n    {\n        Total += 10 * potion.Charges;\n    }\n\n    public void VisitArmor(Armor armor)\n    {\n        Total += armor.Defense * 4;\n    }\n}\n\n// Operation 2: build tooltip text. A brand new feature with zero changes to Items.cs.\npublic class TooltipVisitor : IItemVisitor\n{\n    private readonly StringBuilder text = new StringBuilder();\n\n    public void VisitWeapon(Weapon weapon)\n    {\n        text.AppendLine($\"{weapon.Name}: {weapon.Damage} dmg ({weapon.Durability}%)\");\n    }\n\n    public void VisitPotion(Potion potion)\n    {\n        text.AppendLine($\"Potion of {potion.Effect} x{potion.Charges}\");\n    }\n\n    public void VisitArmor(Armor armor)\n    {\n        text.AppendLine($\"{armor.Slot} armor: +{armor.Defense} def\");\n    }\n\n    public string Result()\n    {\n        return text.ToString();\n    }\n}\n"
          }
        },
        {
          "id": "visitor-eslint-real",
          "title": "ESLint rule max-depth",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "eslint/eslint",
            "url": "https://github.com/eslint/eslint/blob/v10.12.0/lib/rules/max-depth.js",
            "license": "MIT",
            "note": "lib/rules/max-depth.js is verbatim from ESLint v10.12.0; lib/mini-linter.js (a tiny tree walker standing in for ESLint's traverser) and usage.js were written for Software City."
          },
          "story": "A real ESLint rule is a visitor: create() returns an object keyed by AST node type. The walker calls IfStatement on the way in and 'IfStatement:exit' on the way out, which is how the rule counts nesting depth.",
          "roles": {
            "Visitor": [
              "visitor-eslint-real/lib/rules/max-depth.js#create"
            ],
            "Concrete Visitor": [
              "visitor-eslint-real/lib/rules/max-depth.js#IfStatement",
              "visitor-eslint-real/lib/rules/max-depth.js#pushBlock",
              "visitor-eslint-real/lib/rules/max-depth.js#popBlock"
            ],
            "Element": [
              "visitor-eslint-real/usage.js#ifStatement",
              "visitor-eslint-real/usage.js#forOf",
              "visitor-eslint-real/usage.js#block"
            ],
            "Object Structure": [
              "visitor-eslint-real/lib/mini-linter.js#visit",
              "visitor-eslint-real/lib/mini-linter.js#childrenOf"
            ],
            "Client": [
              "visitor-eslint-real/lib/mini-linter.js#lint",
              "visitor-eslint-real/usage.js#main"
            ]
          },
          "trace": [
            {
              "at": "visitor-eslint-real/usage.js#main",
              "say": "main() lints a hand-built tree (a loop with two nested ifs) with a maximum depth of 2."
            },
            {
              "at": "visitor-eslint-real/lib/mini-linter.js#lint",
              "say": "lint() asks the rule for its visitor object, then starts walking at the Program node."
            },
            {
              "at": "visitor-eslint-real/lib/rules/max-depth.js#create",
              "say": "create() returns listeners keyed by node type. Many types share one function, e.g. every loop maps to pushBlock."
            },
            {
              "at": "visitor-eslint-real/lib/mini-linter.js#visit",
              "say": "The walker looks up listeners[node.type], visits the children, then calls the ':exit' listener."
            },
            {
              "at": "visitor-eslint-real/lib/rules/max-depth.js#startFunction",
              "say": "Entering a function pushes a fresh depth counter, so nesting is counted per function."
            },
            {
              "at": "visitor-eslint-real/lib/rules/max-depth.js#IfStatement",
              "say": "On each if (except else-if) the rule calls pushBlock to go one level deeper."
            },
            {
              "at": "visitor-eslint-real/lib/rules/max-depth.js#pushBlock",
              "say": "Depth 3 is over the limit of 2, so the rule reports. It never walks the tree itself."
            },
            {
              "at": "visitor-eslint-real/lib/rules/max-depth.js#popBlock",
              "say": "On ':exit' the counter goes back down. Enter/exit pairs let a visitor track context while walking."
            }
          ],
          "files": {
            "visitor-eslint-real/lib/mini-linter.js": "/*\n * Written for Software City (not part of ESLint). A tiny stand-in for ESLint's traverser:\n * it walks a syntax tree and calls the rule's listener for each node type, on enter and on \":exit\".\n */\n\"use strict\";\n\nconst rule = require(\"./rules/max-depth\");\n\nfunction createContext(options, messages) {\n\treturn {\n\t\toptions,\n\t\tsourceCode: {\n\t\t\tgetFirstToken(node) {\n\t\t\t\treturn { loc: node.loc };\n\t\t\t},\n\t\t},\n\t\treport(descriptor) {\n\t\t\tmessages.push(descriptor);\n\t\t},\n\t};\n}\n\nfunction isNode(value) {\n\treturn Boolean(value) && typeof value.type === \"string\";\n}\n\nfunction childrenOf(node) {\n\tconst kids = [];\n\tfor (const key of Object.keys(node)) {\n\t\tif (key === \"parent\" || key === \"loc\") {\n\t\t\tcontinue;\n\t\t}\n\t\tconst value = node[key];\n\t\tif (Array.isArray(value)) {\n\t\t\tkids.push(...value.filter(isNode));\n\t\t} else if (isNode(value)) {\n\t\t\tkids.push(value);\n\t\t}\n\t}\n\treturn kids;\n}\n\nfunction visit(node, parent, listeners) {\n\tnode.parent = parent;\n\tconst enter = listeners[node.type];\n\tif (enter) {\n\t\tenter(node);\n\t}\n\tfor (const child of childrenOf(node)) {\n\t\tvisit(child, node, listeners);\n\t}\n\tconst exit = listeners[`${node.type}:exit`];\n\tif (exit) {\n\t\texit(node);\n\t}\n}\n\nfunction lint(ast, options) {\n\tconst messages = [];\n\tconst listeners = rule.create(createContext(options, messages));\n\tvisit(ast, null, listeners);\n\treturn messages;\n}\n\nmodule.exports = { lint };\n",
            "visitor-eslint-real/lib/rules/max-depth.js": "/*\n * Source: ESLint v10.12.0 — https://github.com/eslint/eslint/blob/v10.12.0/lib/rules/max-depth.js\n * MIT License, Copyright OpenJS Foundation and other contributors, <www.openjsf.org>. Included for study.\n */\n/**\n * @fileoverview A rule to set the maximum depth block can be nested in a function.\n * @author Ian Christian Myers\n */\n\n\"use strict\";\n\n//------------------------------------------------------------------------------\n// Rule Definition\n//------------------------------------------------------------------------------\n\n/** @type {import('../types').Rule.RuleModule} */\nmodule.exports = {\n\tmeta: {\n\t\ttype: \"suggestion\",\n\n\t\tdocs: {\n\t\t\tdescription: \"Enforce a maximum depth that blocks can be nested\",\n\t\t\trecommended: false,\n\t\t\turl: \"https://eslint.org/docs/latest/rules/max-depth\",\n\t\t},\n\n\t\tschema: [\n\t\t\t{\n\t\t\t\toneOf: [\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: \"integer\",\n\t\t\t\t\t\tminimum: 0,\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: \"object\",\n\t\t\t\t\t\tproperties: {\n\t\t\t\t\t\t\tmaximum: {\n\t\t\t\t\t\t\t\ttype: \"integer\",\n\t\t\t\t\t\t\t\tminimum: 0,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tmax: {\n\t\t\t\t\t\t\t\ttype: \"integer\",\n\t\t\t\t\t\t\t\tminimum: 0,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t\tadditionalProperties: false,\n\t\t\t\t\t},\n\t\t\t\t],\n\t\t\t},\n\t\t],\n\n\t\tdefaultOptions: [4],\n\n\t\tmessages: {\n\t\t\ttooDeeply:\n\t\t\t\t\"Blocks are nested too deeply ({{depth}}). Maximum allowed is {{maxDepth}}.\",\n\t\t},\n\t},\n\n\tcreate(context) {\n\t\tconst sourceCode = context.sourceCode;\n\n\t\t//--------------------------------------------------------------------------\n\t\t// Helpers\n\t\t//--------------------------------------------------------------------------\n\n\t\tconst functionStack = [],\n\t\t\toption = context.options[0];\n\t\tlet maxDepth = 4;\n\n\t\tif (\n\t\t\ttypeof option === \"object\" &&\n\t\t\t(Object.hasOwn(option, \"maximum\") || Object.hasOwn(option, \"max\"))\n\t\t) {\n\t\t\tmaxDepth = option.maximum || option.max;\n\t\t}\n\t\tif (typeof option === \"number\") {\n\t\t\tmaxDepth = option;\n\t\t}\n\n\t\t/**\n\t\t * When parsing a new function, store it in our function stack\n\t\t * @returns {void}\n\t\t * @private\n\t\t */\n\t\tfunction startFunction() {\n\t\t\tfunctionStack.push(0);\n\t\t}\n\n\t\t/**\n\t\t * When parsing is done then pop out the reference\n\t\t * @returns {void}\n\t\t * @private\n\t\t */\n\t\tfunction endFunction() {\n\t\t\tfunctionStack.pop();\n\t\t}\n\n\t\t/**\n\t\t * Save the block and Evaluate the node\n\t\t * @param {ASTNode} node node to evaluate\n\t\t * @returns {void}\n\t\t * @private\n\t\t */\n\t\tfunction pushBlock(node) {\n\t\t\tconst len = ++functionStack[functionStack.length - 1];\n\n\t\t\tif (len > maxDepth) {\n\t\t\t\tcontext.report({\n\t\t\t\t\tnode,\n\t\t\t\t\tloc: sourceCode.getFirstToken(node).loc,\n\t\t\t\t\tmessageId: \"tooDeeply\",\n\t\t\t\t\tdata: { depth: len, maxDepth },\n\t\t\t\t});\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Pop the saved block\n\t\t * @returns {void}\n\t\t * @private\n\t\t */\n\t\tfunction popBlock() {\n\t\t\tfunctionStack[functionStack.length - 1]--;\n\t\t}\n\n\t\t/**\n\t\t * Checks whether a node is an else-if statement.\n\t\t * @param {ASTNode} node node to evaluate\n\t\t * @returns {boolean} Whether the node is an else-if statement\n\t\t */\n\t\tfunction isElseIf(node) {\n\t\t\treturn (\n\t\t\t\tnode.parent.type === \"IfStatement\" &&\n\t\t\t\tnode.parent.alternate === node\n\t\t\t);\n\t\t}\n\n\t\t//--------------------------------------------------------------------------\n\t\t// Public API\n\t\t//--------------------------------------------------------------------------\n\n\t\treturn {\n\t\t\tProgram: startFunction,\n\t\t\tFunctionDeclaration: startFunction,\n\t\t\tFunctionExpression: startFunction,\n\t\t\tArrowFunctionExpression: startFunction,\n\t\t\tStaticBlock: startFunction,\n\n\t\t\tIfStatement(node) {\n\t\t\t\tif (!isElseIf(node)) {\n\t\t\t\t\tpushBlock(node);\n\t\t\t\t}\n\t\t\t},\n\t\t\tSwitchStatement: pushBlock,\n\t\t\tTryStatement: pushBlock,\n\t\t\tDoWhileStatement: pushBlock,\n\t\t\tWhileStatement: pushBlock,\n\t\t\tWithStatement: pushBlock,\n\t\t\tForStatement: pushBlock,\n\t\t\tForInStatement: pushBlock,\n\t\t\tForOfStatement: pushBlock,\n\n\t\t\t\"IfStatement:exit\"(node) {\n\t\t\t\tif (!isElseIf(node)) {\n\t\t\t\t\tpopBlock();\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"SwitchStatement:exit\": popBlock,\n\t\t\t\"TryStatement:exit\": popBlock,\n\t\t\t\"DoWhileStatement:exit\": popBlock,\n\t\t\t\"WhileStatement:exit\": popBlock,\n\t\t\t\"WithStatement:exit\": popBlock,\n\t\t\t\"ForStatement:exit\": popBlock,\n\t\t\t\"ForInStatement:exit\": popBlock,\n\t\t\t\"ForOfStatement:exit\": popBlock,\n\n\t\t\t\"FunctionDeclaration:exit\": endFunction,\n\t\t\t\"FunctionExpression:exit\": endFunction,\n\t\t\t\"ArrowFunctionExpression:exit\": endFunction,\n\t\t\t\"StaticBlock:exit\": endFunction,\n\t\t\t\"Program:exit\": endFunction,\n\t\t};\n\t},\n};\n",
            "visitor-eslint-real/usage.js": "/*\n * Written for Software City (not part of ESLint). Builds a small syntax tree by hand\n * (what a parser would produce for nested loops and ifs) and lints it with max-depth = 2.\n */\n\"use strict\";\n\nconst { lint } = require(\"./lib/mini-linter\");\n\nfunction block(...body) {\n\treturn { type: \"BlockStatement\", body, loc: { line: 1 } };\n}\n\nfunction ifStatement(line, consequent) {\n\treturn { type: \"IfStatement\", test: { type: \"Identifier\" }, consequent, alternate: null, loc: { line } };\n}\n\nfunction forOf(line, body) {\n\treturn { type: \"ForOfStatement\", left: { type: \"Identifier\" }, right: { type: \"Identifier\" }, body, loc: { line } };\n}\n\nfunction buildTree() {\n\t// function load(rows) { for (row of rows) { if (row) { if (row.ok) { ... } } } }\n\tconst inner = ifStatement(4, block());\n\tconst outer = ifStatement(3, block(inner));\n\tconst loop = forOf(2, block(outer));\n\tconst fn = { type: \"FunctionDeclaration\", body: block(loop), loc: { line: 1 } };\n\treturn { type: \"Program\", body: [fn], loc: { line: 1 } };\n}\n\nfunction main() {\n\tconst problems = lint(buildTree(), [2]);\n\tfor (const p of problems) {\n\t\tconsole.log(`line ${p.loc.line}: blocks nested ${p.data.depth} deep (max ${p.data.maxDepth})`);\n\t}\n}\n\nmain();\n"
          }
        }
      ]
    },
    {
      "id": "mediator",
      "name": "Mediator",
      "family": "Behavioral",
      "aka": [
        "Controller",
        "Hub",
        "Game manager"
      ],
      "tagline": "Objects talk to one coordinator instead of to each other.",
      "intent": "When many objects need to react to each other, wiring them directly creates a tangle where every object knows every other. A mediator sits in the middle: colleagues report events to it, and it alone decides who must do what, so the coordination rules live in one place.",
      "analogy": "An airport control tower: pilots never radio each other to decide who lands first. Every plane talks only to the tower, and the tower keeps the whole picture.",
      "cityShape": "Look for one central mediator building with a notify() or send() floor; every colleague building sends a pipe to it and receives pipes back from it, forming a star. There are no pipes running directly between colleague buildings.",
      "roles": [
        {
          "name": "Mediator",
          "desc": "The interface colleagues use to report events or requests."
        },
        {
          "name": "Concrete Mediator",
          "desc": "Knows the colleagues and holds the coordination rules: what happens when X reports Y."
        },
        {
          "name": "Colleague",
          "desc": "An object that does its own job and reports to the mediator instead of calling other colleagues."
        },
        {
          "name": "Client",
          "desc": "Creates the mediator and the colleagues and connects them."
        }
      ],
      "whenToUse": [
        "Several objects interact in complex ways and the direct references between them form a web.",
        "You want to reuse a component (a coin, a button) in another scene without dragging its neighbours along.",
        "Rules like 'when all coins are collected, open the door and update the HUD' belong to the level, not to any one object.",
        "Dialogs and forms where widgets enable or disable each other."
      ],
      "pitfalls": [
        "The mediator can grow into a 'god object' that knows everything; split it by feature when it gets large.",
        "Moving logic out of colleagues can leave them as empty data holders; keep each object's own behaviour inside it.",
        "Mediator and Observer often meet: a mediator can listen to signals, but it still makes the decisions an event bus would not."
      ],
      "related": [
        "observer",
        "facade",
        "pub-sub",
        "command"
      ],
      "quiz": [
        {
          "q": "In a Mediator design, a coin is collected and the door must open. Who calls door.open()?",
          "options": [
            "The coin",
            "The player",
            "The mediator",
            "The door itself, by polling the coin"
          ],
          "answer": 2,
          "why": "The coin only reports 'coin collected' to the mediator. The rule 'enough coins opens the door' lives in the mediator, so the coin stays reusable."
        },
        {
          "q": "How is a Mediator different from a plain event bus (pub-sub)?",
          "options": [
            "A mediator cannot send messages",
            "A mediator contains the coordination logic and calls colleagues directly; a bus just forwards messages to subscribers",
            "A bus is always faster",
            "There is no difference"
          ],
          "answer": 1,
          "why": "A bus is a neutral pipe. A mediator understands the events and decides who does what, so the rules live in one known place."
        }
      ],
      "demos": [
        {
          "id": "mediator-ts-chat",
          "title": "Chat room",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Users send messages through a ChatRoom, which forwards them to everyone else. Notice user.ts never imports another user: each user only holds the room.",
          "roles": {
            "Mediator": [
              "mediator-ts-chat/mediator.ts#ChatMediator"
            ],
            "Concrete Mediator": [
              "mediator-ts-chat/chat-room.ts#ChatRoom"
            ],
            "Colleague": [
              "mediator-ts-chat/user.ts#User"
            ],
            "Client": [
              "mediator-ts-chat/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "mediator-ts-chat/main.ts#main",
              "say": "main() creates one room and three users; nobody is given a reference to anybody else."
            },
            {
              "at": "mediator-ts-chat/user.ts#User.enter",
              "say": "A user remembers the room and asks it to join. The room, not the user, keeps the member list."
            },
            {
              "at": "mediator-ts-chat/chat-room.ts#ChatRoom.join",
              "say": "join() adds the user and announces the arrival through send(), reusing the same rule."
            },
            {
              "at": "mediator-ts-chat/user.ts#User.say",
              "say": "Ben says hi by handing the text to the room. He does not know who else is online."
            },
            {
              "at": "mediator-ts-chat/chat-room.ts#ChatRoom.send",
              "say": "The room decides who receives the message: everyone except the sender."
            },
            {
              "at": "mediator-ts-chat/user.ts#User.receive",
              "say": "Each other user shows the message. All traffic went through one hub."
            }
          ],
          "files": {
            "mediator-ts-chat/chat-room.ts": "import { ChatMediator } from './mediator';\nimport { User } from './user';\n\n// The concrete mediator: the only place that knows who is in the room.\nexport class ChatRoom implements ChatMediator {\n  private members: User[] = [];\n\n  join(user: User): void {\n    this.members.push(user);\n    this.send(`${user.name} joined`, user);\n  }\n\n  send(text: string, from: User): void {\n    for (const member of this.members) {\n      if (member !== from) {\n        member.receive(text, from.name);\n      }\n    }\n  }\n}\n",
            "mediator-ts-chat/main.ts": "import { ChatRoom } from './chat-room';\nimport { User } from './user';\n\nfunction main(): void {\n  const room = new ChatRoom();\n  const ana = new User('Ana');\n  const ben = new User('Ben');\n  const cleo = new User('Cleo');\n\n  ana.enter(room);\n  ben.enter(room);\n  cleo.enter(room);\n\n  ben.say('Hi all!');\n}\n\nmain();\n",
            "mediator-ts-chat/mediator.ts": "import { User } from './user';\n\n// The mediator contract: users talk to this, never to each other.\nexport interface ChatMediator {\n  join(user: User): void;\n  send(text: string, from: User): void;\n}\n",
            "mediator-ts-chat/user.ts": "import { ChatMediator } from './mediator';\n\n// A colleague: it holds a reference to the room, not to any other user.\nexport class User {\n  private room: ChatMediator | null = null;\n\n  constructor(public name: string) {}\n\n  enter(room: ChatMediator): void {\n    this.room = room;\n    room.join(this);\n  }\n\n  say(text: string): void {\n    this.room?.send(text, this);\n  }\n\n  receive(text: string, fromName: string): void {\n    console.log(`[${this.name}'s screen] ${fromName}: ${text}`);\n  }\n}\n"
          }
        },
        {
          "id": "mediator-gd-game-manager",
          "title": "Godot game manager: coins open the door",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Coins, the door, the HUD and the player all report to a GameManager node. The level rule 'collect 5 coins to open the door' exists only in game_manager.gd, so a coin scene works in any level.",
          "roles": {
            "Mediator": [
              "mediator-gd-game-manager/game_manager.gd#notify"
            ],
            "Concrete Mediator": [
              "mediator-gd-game-manager/game_manager.gd"
            ],
            "Colleague": [
              "mediator-gd-game-manager/coin.gd",
              "mediator-gd-game-manager/door.gd",
              "mediator-gd-game-manager/hud.gd",
              "mediator-gd-game-manager/player.gd"
            ],
            "Client": [
              "mediator-gd-game-manager/level.gd#_ready"
            ]
          },
          "trace": [
            {
              "at": "mediator-gd-game-manager/level.gd#_ready",
              "say": "The level hands the manager the HUD and the door: the colleagues it will command."
            },
            {
              "at": "mediator-gd-game-manager/coin.gd#_on_body_entered",
              "say": "The player touches a coin. The coin reports 'coin_collected' and frees itself; it never touches the HUD."
            },
            {
              "at": "mediator-gd-game-manager/game_manager.gd#notify",
              "say": "notify() is the single entry point. It matches the event name and routes to the right rule."
            },
            {
              "at": "mediator-gd-game-manager/game_manager.gd#_on_coin_collected",
              "say": "The rule lives here: count, update the HUD, and at 5 coins open the door."
            },
            {
              "at": "mediator-gd-game-manager/door.gd#open",
              "say": "The door just opens when told. It has no idea coins exist."
            },
            {
              "at": "mediator-gd-game-manager/player.gd#fall_into_pit",
              "say": "The player falls and reports 'player_died' instead of resetting things itself."
            },
            {
              "at": "mediator-gd-game-manager/game_manager.gd#_on_player_died",
              "say": "The manager resets coins, closes the door and updates the HUD: one place for the whole reaction."
            }
          ],
          "files": {
            "mediator-gd-game-manager/coin.gd": "class_name Coin\nextends Area2D\n\n# A colleague. It knows nothing about the HUD or the door, only the manager.\nvar manager: GameManager\n\nfunc _ready() -> void:\n\tmanager = get_tree().get_first_node_in_group(\"game_manager\")\n\tbody_entered.connect(_on_body_entered)\n\nfunc _on_body_entered(body: Node) -> void:\n\tif body is Player:\n\t\tmanager.notify(self, \"coin_collected\")\n\t\tqueue_free()\n",
            "mediator-gd-game-manager/door.gd": "class_name Door\nextends StaticBody2D\n\nvar manager: GameManager\nvar is_open := false\n\nfunc _ready() -> void:\n\tmanager = get_tree().get_first_node_in_group(\"game_manager\")\n\nfunc open() -> void:\n\tis_open = true\n\t$CollisionShape2D.set_deferred(\"disabled\", true)\n\t$Sprite2D.frame = 1\n\nfunc close() -> void:\n\tis_open = false\n\t$CollisionShape2D.set_deferred(\"disabled\", false)\n\t$Sprite2D.frame = 0\n\nfunc _on_exit_area_body_entered(body: Node) -> void:\n\tif is_open and body is Player:\n\t\tmanager.notify(self, \"door_entered\")\n",
            "mediator-gd-game-manager/game_manager.gd": "class_name GameManager\nextends Node\n\n# The mediator. Coins, door, HUD and player all report here; only this script knows the rules\n# that connect them (\"5 coins open the door\", \"death resets the coins\").\n@export var coins_needed := 5\n\nvar hud: Hud\nvar door: Door\nvar coins := 0\n\nfunc _enter_tree() -> void:\n\t# Joins the group before any colleague's _ready() looks it up.\n\tadd_to_group(\"game_manager\")\n\nfunc register(new_hud: Hud, new_door: Door) -> void:\n\thud = new_hud\n\tdoor = new_door\n\thud.show_coins(coins, coins_needed)\n\nfunc notify(sender: Node, event: String) -> void:\n\tmatch event:\n\t\t\"coin_collected\":\n\t\t\t_on_coin_collected()\n\t\t\"door_entered\":\n\t\t\thud.show_message(\"Level complete!\")\n\t\t\"player_died\":\n\t\t\t_on_player_died()\n\nfunc _on_coin_collected() -> void:\n\tcoins += 1\n\thud.show_coins(coins, coins_needed)\n\tif coins == coins_needed:\n\t\tdoor.open()\n\t\thud.show_message(\"The door is open\")\n\nfunc _on_player_died() -> void:\n\tcoins = 0\n\tdoor.close()\n\thud.show_coins(coins, coins_needed)\n\thud.show_message(\"Try again\")\n",
            "mediator-gd-game-manager/hud.gd": "class_name Hud\nextends CanvasLayer\n\n# Pure display. The manager decides what to show and when.\nfunc show_coins(count: int, needed: int) -> void:\n\t$CoinLabel.text = \"Coins: %d / %d\" % [count, needed]\n\nfunc show_message(text: String) -> void:\n\t$Message.text = text\n\t$Message/Timer.start()\n",
            "mediator-gd-game-manager/level.gd": "extends Node2D\n\n# Wires the mediator to the colleagues it must command.\n@onready var manager: GameManager = $GameManager\n\nfunc _ready() -> void:\n\tmanager.register($Hud, $Door)\n",
            "mediator-gd-game-manager/player.gd": "class_name Player\nextends CharacterBody2D\n\nvar manager: GameManager\n\nfunc _ready() -> void:\n\tmanager = get_tree().get_first_node_in_group(\"game_manager\")\n\nfunc fall_into_pit() -> void:\n\t# The player does not reset coins or close doors itself; it just reports what happened.\n\tposition = Vector2.ZERO\n\tmanager.notify(self, \"player_died\")\n"
          }
        },
        {
          "id": "mediator-java-airport",
          "title": "Air traffic control tower",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "Planes request landing and runways report when they are clear; the ControlTower keeps a holding queue and assigns runways. Two kinds of colleague, both talking only to the tower.",
          "roles": {
            "Mediator": [
              "mediator-java-airport/AirTrafficControl.java#AirTrafficControl"
            ],
            "Concrete Mediator": [
              "mediator-java-airport/ControlTower.java#ControlTower"
            ],
            "Colleague": [
              "mediator-java-airport/Aircraft.java#Aircraft",
              "mediator-java-airport/Runway.java#Runway"
            ],
            "Client": [
              "mediator-java-airport/Main.java#Main.main"
            ]
          },
          "trace": [
            {
              "at": "mediator-java-airport/Main.java#Main.main",
              "say": "One runway, three planes. Each plane and runway gets the tower in its constructor and nothing else."
            },
            {
              "at": "mediator-java-airport/Aircraft.java#Aircraft.approach",
              "say": "A plane asks the tower for permission. It cannot see the runway or the other planes."
            },
            {
              "at": "mediator-java-airport/ControlTower.java#ControlTower.requestLanding",
              "say": "The tower checks for a free runway. If none is free, the plane joins the holding queue."
            },
            {
              "at": "mediator-java-airport/Aircraft.java#Aircraft.hold",
              "say": "The second and third planes are told to hold. The waiting order lives only in the tower."
            },
            {
              "at": "mediator-java-airport/Runway.java#Runway.vacate",
              "say": "The first plane taxis off. The runway reports that it is clear rather than calling a waiting plane."
            },
            {
              "at": "mediator-java-airport/ControlTower.java#ControlTower.runwayCleared",
              "say": "The tower pulls the next plane from the queue: a decision that needs knowledge of both planes and runways."
            },
            {
              "at": "mediator-java-airport/ControlTower.java#ControlTower.assign",
              "say": "assign() reserves the runway and clears the plane, keeping both colleagues in sync."
            },
            {
              "at": "mediator-java-airport/Aircraft.java#Aircraft.clearedToLand",
              "say": "The plane lands on the runway it was given. Colleagues act; the mediator coordinates."
            }
          ],
          "files": {
            "mediator-java-airport/AirTrafficControl.java": "package airport;\n\n// The mediator interface. Aircraft and runways only ever call these two methods.\npublic interface AirTrafficControl {\n    void requestLanding(Aircraft aircraft);\n\n    void runwayCleared(Runway runway);\n}\n",
            "mediator-java-airport/Aircraft.java": "package airport;\n\n// A colleague. Pilots never radio each other; they only talk to the tower.\npublic class Aircraft {\n    private final String callSign;\n    private final AirTrafficControl tower;\n\n    public Aircraft(String callSign, AirTrafficControl tower) {\n        this.callSign = callSign;\n        this.tower = tower;\n    }\n\n    public String getCallSign() {\n        return callSign;\n    }\n\n    public void approach() {\n        System.out.println(callSign + \": requesting landing\");\n        tower.requestLanding(this);\n    }\n\n    public void hold(int position) {\n        System.out.println(callSign + \": holding, number \" + position + \" in line\");\n    }\n\n    public void clearedToLand(Runway runway) {\n        System.out.println(callSign + \": cleared for runway \" + runway.getName());\n        runway.touchDown(this);\n    }\n}\n",
            "mediator-java-airport/ControlTower.java": "package airport;\n\nimport java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\n// The concrete mediator. All coordination rules live here: who waits, who lands, which runway.\npublic class ControlTower implements AirTrafficControl {\n    private final List<Runway> runways = new ArrayList<>();\n    private final Queue<Aircraft> holdingPattern = new ArrayDeque<>();\n\n    public void addRunway(Runway runway) {\n        runways.add(runway);\n    }\n\n    @Override\n    public void requestLanding(Aircraft aircraft) {\n        Runway free = findFreeRunway();\n        if (free == null) {\n            holdingPattern.add(aircraft);\n            aircraft.hold(holdingPattern.size());\n            return;\n        }\n        assign(aircraft, free);\n    }\n\n    @Override\n    public void runwayCleared(Runway runway) {\n        Aircraft next = holdingPattern.poll();\n        if (next != null) {\n            assign(next, runway);\n        }\n    }\n\n    private Runway findFreeRunway() {\n        for (Runway r : runways) {\n            if (r.isFree()) {\n                return r;\n            }\n        }\n        return null;\n    }\n\n    private void assign(Aircraft aircraft, Runway runway) {\n        runway.reserve(aircraft);\n        aircraft.clearedToLand(runway);\n    }\n}\n",
            "mediator-java-airport/Main.java": "package airport;\n\npublic class Main {\n    public static void main(String[] args) {\n        ControlTower tower = new ControlTower();\n        Runway north = new Runway(\"09L\", tower);\n        tower.addRunway(north);\n\n        Aircraft a = new Aircraft(\"LH123\", tower);\n        Aircraft b = new Aircraft(\"A3-404\", tower);\n        Aircraft c = new Aircraft(\"FR77\", tower);\n\n        a.approach();\n        b.approach();\n        c.approach();\n\n        north.vacate();\n        north.vacate();\n    }\n}\n",
            "mediator-java-airport/Runway.java": "package airport;\n\n// Another colleague. It reports when it is free; it does not pick the next plane itself.\npublic class Runway {\n    private final String name;\n    private final AirTrafficControl tower;\n    private Aircraft occupant;\n\n    public Runway(String name, AirTrafficControl tower) {\n        this.name = name;\n        this.tower = tower;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public boolean isFree() {\n        return occupant == null;\n    }\n\n    public void reserve(Aircraft aircraft) {\n        occupant = aircraft;\n    }\n\n    public void touchDown(Aircraft aircraft) {\n        System.out.println(\"Runway \" + name + \": \" + aircraft.getCallSign() + \" landed\");\n    }\n\n    public void vacate() {\n        System.out.println(\"Runway \" + name + \": \" + occupant.getCallSign() + \" taxied off\");\n        occupant = null;\n        tower.runwayCleared(this);\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "memento",
      "name": "Memento",
      "family": "Behavioral",
      "aka": [
        "Snapshot",
        "Save state",
        "Undo token"
      ],
      "tagline": "Capture an object's state in a snapshot so you can restore it later.",
      "intent": "Let an object (the originator) export its internal state as an opaque snapshot, the memento, and later rebuild itself from one. A separate caretaker stores the mementos for undo or save slots without ever reading or changing what is inside, so the originator keeps its encapsulation.",
      "analogy": "A save point in a video game: the game writes a save file, the menu lists your slots by date, and loading puts you back exactly where you were. The menu never needs to understand what is in the file.",
      "cityShape": "Look for the originator building with a pair of save/restore floors, a small memento building (mostly roof antennas, its fields) and a caretaker building whose roof carries a stack antenna. Pipes run caretaker -> originator.save -> memento and back through restore; the caretaker never pipes into the memento's fields.",
      "roles": [
        {
          "name": "Originator",
          "desc": "The object whose state is saved. Only it creates mementos and restores itself from them."
        },
        {
          "name": "Memento",
          "desc": "A frozen, opaque copy of the originator's state at one moment."
        },
        {
          "name": "Caretaker",
          "desc": "Keeps mementos (an undo stack, save slots) and decides when to save or restore, without peeking inside."
        },
        {
          "name": "Client",
          "desc": "Triggers saves and restores: an undo button, a checkpoint, a hotkey."
        }
      ],
      "whenToUse": [
        "Undo/redo in editors and drawing tools.",
        "Save games, checkpoints and quick-save in games.",
        "Rolling back an object after a failed operation (transactions, form 'cancel' buttons).",
        "You need a snapshot but exposing every private field through getters would break encapsulation."
      ],
      "pitfalls": [
        "Snapshots of big state get expensive in memory; cap the history or store only what changed.",
        "Shallow copies leak: if the memento shares a mutable list with the originator, later edits change the 'saved' state too.",
        "Saved files outlive code changes; plan for versioning when the originator's fields change."
      ],
      "related": [
        "command",
        "prototype",
        "state",
        "iterator"
      ],
      "quiz": [
        {
          "q": "Why should the caretaker not read the fields inside a memento?",
          "options": [
            "Reading is slow",
            "So the originator can change its internal state format without breaking the caretaker",
            "Mementos are encrypted",
            "Because the caretaker has no constructor"
          ],
          "answer": 1,
          "why": "Only the originator understands its own state. Keeping the memento opaque to the caretaker preserves encapsulation and lets the state change freely."
        },
        {
          "q": "An editor saves a memento holding a reference to its live list of lines, then the user keeps typing. What goes wrong on undo?",
          "options": [
            "Nothing, it works",
            "The memento changed along with the editor, so undo restores the new text",
            "Undo throws an error",
            "The list is garbage collected"
          ],
          "answer": 1,
          "why": "A memento must be a copy (or immutable). Sharing the mutable list means the 'snapshot' silently follows every later edit."
        }
      ],
      "demos": [
        {
          "id": "memento-py-editor",
          "title": "Text editor undo",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "An editor saves Snapshot objects into a History stack before each change. Notice that History calls save() and restore() but never touches the snapshot's fields.",
          "roles": {
            "Originator": [
              "memento-py-editor/editor.py#Editor"
            ],
            "Memento": [
              "memento-py-editor/editor.py#Snapshot"
            ],
            "Caretaker": [
              "memento-py-editor/history.py#History"
            ],
            "Client": [
              "memento-py-editor/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "memento-py-editor/main.py#main",
              "say": "main() takes a backup before each edit, the way an editor would before every keystroke batch."
            },
            {
              "at": "memento-py-editor/history.py#History.backup",
              "say": "The caretaker asks the editor for a snapshot and pushes it. It does not know what is inside."
            },
            {
              "at": "memento-py-editor/editor.py#Editor.save",
              "say": "The editor copies its own text and cursor into a new Snapshot. Strings are immutable, so the copy is safe."
            },
            {
              "at": "memento-py-editor/editor.py#Editor.type",
              "say": "Typing changes the live state. The snapshot on the stack still holds the old text."
            },
            {
              "at": "memento-py-editor/history.py#History.undo",
              "say": "Undo pops the latest snapshot and hands it back to the editor."
            },
            {
              "at": "memento-py-editor/editor.py#Editor.restore",
              "say": "Only the editor reads the snapshot's private fields to rebuild itself."
            }
          ],
          "files": {
            "memento-py-editor/editor.py": "# The memento: a frozen copy of the editor's state. Nobody but the Editor reads inside it.\nclass Snapshot:\n    def __init__(self, text, cursor):\n        self._text = text\n        self._cursor = cursor\n\n\n# The originator: it owns the state and knows how to save and restore it.\nclass Editor:\n    def __init__(self):\n        self.text = \"\"\n        self.cursor = 0\n\n    def type(self, words):\n        self.text = self.text[:self.cursor] + words + self.text[self.cursor:]\n        self.cursor += len(words)\n\n    def save(self):\n        return Snapshot(self.text, self.cursor)\n\n    def restore(self, snapshot):\n        self.text = snapshot._text\n        self.cursor = snapshot._cursor\n",
            "memento-py-editor/history.py": "from .editor import Editor, Snapshot\n\n\n# The caretaker: it stores snapshots and decides WHEN to undo, but never looks inside them.\nclass History:\n    def __init__(self, editor: Editor):\n        self.editor: Editor = editor\n        self.snapshots: list[Snapshot] = []\n\n    def backup(self):\n        self.snapshots.append(self.editor.save())\n\n    def undo(self):\n        if not self.snapshots:\n            return\n        self.editor.restore(self.snapshots.pop())\n",
            "memento-py-editor/main.py": "from .editor import Editor\nfrom .history import History\n\n\ndef main():\n    editor = Editor()\n    history = History(editor)\n\n    history.backup()\n    editor.type(\"Hello\")\n    history.backup()\n    editor.type(\", world\")\n    print(editor.text)  # Hello, world\n\n    history.undo()\n    print(editor.text)  # Hello\n    history.undo()\n    print(repr(editor.text))  # ''\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        },
        {
          "id": "memento-gd-savegame",
          "title": "Godot save slots and quick-save",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "The player packs its state into a SaveData resource; a SaveManager keeps a quick-save in memory and writes checkpoint slots to disk. A memento you can store as a .tres file.",
          "roles": {
            "Originator": [
              "memento-gd-savegame/player.gd#create_memento",
              "memento-gd-savegame/player.gd#restore"
            ],
            "Memento": [
              "memento-gd-savegame/save_data.gd"
            ],
            "Caretaker": [
              "memento-gd-savegame/save_manager.gd"
            ],
            "Client": [
              "memento-gd-savegame/world.gd#_on_checkpoint_body_entered",
              "memento-gd-savegame/world.gd#_unhandled_input"
            ]
          },
          "trace": [
            {
              "at": "memento-gd-savegame/world.gd#_on_checkpoint_body_entered",
              "say": "The player touches a checkpoint flag, so the world asks the save manager to write slot 1."
            },
            {
              "at": "memento-gd-savegame/save_manager.gd#save_to_slot",
              "say": "The caretaker asks the player for a memento and saves it with ResourceSaver, without reading its fields."
            },
            {
              "at": "memento-gd-savegame/player.gd#create_memento",
              "say": "The player fills a SaveData. inventory.duplicate() matters: the save must not share the live array."
            },
            {
              "at": "memento-gd-savegame/player.gd#take_damage",
              "say": "Play goes on and health drops. The saved file is unaffected."
            },
            {
              "at": "memento-gd-savegame/world.gd#_unhandled_input",
              "say": "The player presses 'load checkpoint'. Input code decides WHEN to restore, not HOW."
            },
            {
              "at": "memento-gd-savegame/save_manager.gd#load_from_slot",
              "say": "The caretaker loads the file back into a SaveData and passes it to the player."
            },
            {
              "at": "memento-gd-savegame/player.gd#restore",
              "say": "Only the player knows how to apply position, health and inventory from the memento."
            }
          ],
          "files": {
            "memento-gd-savegame/player.gd": "class_name Player\nextends CharacterBody2D\n\n# The originator. Only the player decides what goes into a save and how to load it back.\nvar health := 100\nvar inventory: Array[String] = []\n\nfunc create_memento() -> SaveData:\n\tvar data := SaveData.new()\n\tdata.position = global_position\n\tdata.health = health\n\tdata.inventory = inventory.duplicate()\n\tdata.saved_at = Time.get_datetime_string_from_system()\n\treturn data\n\nfunc restore(data: SaveData) -> void:\n\tglobal_position = data.position\n\thealth = data.health\n\tinventory = data.inventory.duplicate()\n\nfunc pick_up(item: String) -> void:\n\tinventory.append(item)\n\nfunc take_damage(amount: int) -> void:\n\thealth = max(health - amount, 0)\n",
            "memento-gd-savegame/save_data.gd": "class_name SaveData\nextends Resource\n\n# The memento. A Resource can be written to disk with ResourceSaver, which makes it a perfect save slot.\n@export var position: Vector2\n@export var health: int\n@export var inventory: Array[String] = []\n@export var saved_at: String\n",
            "memento-gd-savegame/save_manager.gd": "class_name SaveManager\nextends Node\n\n# The caretaker. It stores and loads SaveData files but never reads their fields.\nconst SLOT_PATH := \"user://slot_%d.tres\"\n\nvar quicksave: SaveData\n\nfunc save_to_slot(player: Player, slot: int) -> void:\n\tvar data := player.create_memento()\n\tResourceSaver.save(data, SLOT_PATH % slot)\n\nfunc load_from_slot(player: Player, slot: int) -> void:\n\tvar path := SLOT_PATH % slot\n\tif not ResourceLoader.exists(path):\n\t\treturn\n\tvar data: SaveData = ResourceLoader.load(path)\n\tplayer.restore(data)\n\nfunc quick_save(player: Player) -> void:\n\tquicksave = player.create_memento()\n\nfunc quick_load(player: Player) -> void:\n\tif quicksave != null:\n\t\tplayer.restore(quicksave)\n",
            "memento-gd-savegame/world.gd": "extends Node2D\n\n@onready var player: Player = $Player\n@onready var saves: SaveManager = $SaveManager\n\n# Checkpoint flags and hotkeys decide WHEN to save; the caretaker and the player do the rest.\nfunc _on_checkpoint_body_entered(body: Node) -> void:\n\tif body == player:\n\t\tsaves.save_to_slot(player, 1)\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"quick_save\"):\n\t\tsaves.quick_save(player)\n\telif event.is_action_pressed(\"quick_load\"):\n\t\tsaves.quick_load(player)\n\telif event.is_action_pressed(\"load_checkpoint\"):\n\t\tsaves.load_from_slot(player, 1)\n"
          }
        },
        {
          "id": "memento-kt-drawing",
          "title": "Drawing app undo and redo",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "A Canvas produces CanvasMemento snapshots; an UndoManager keeps undo and redo stacks with a size limit. The memento's state is internal, so the caretaker can only read its label.",
          "roles": {
            "Originator": [
              "memento-kt-drawing/Canvas.kt#Canvas"
            ],
            "Memento": [
              "memento-kt-drawing/CanvasMemento.kt#CanvasMemento"
            ],
            "Caretaker": [
              "memento-kt-drawing/UndoManager.kt#UndoManager"
            ],
            "Client": [
              "memento-kt-drawing/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "memento-kt-drawing/Main.kt#main",
              "say": "Every edit goes through undo.execute(), so a snapshot is taken before anything changes."
            },
            {
              "at": "memento-kt-drawing/UndoManager.kt#UndoManager.execute",
              "say": "Snapshot first, then drop the oldest if over the limit, clear redo, and only then run the edit."
            },
            {
              "at": "memento-kt-drawing/Canvas.kt#Canvas.snapshot",
              "say": "strokes.toList() copies the list; Stroke is immutable, so sharing strokes between snapshots is safe and cheap."
            },
            {
              "at": "memento-kt-drawing/UndoManager.kt#UndoManager.undo",
              "say": "Undo saves the current state onto the redo stack, then restores the previous memento."
            },
            {
              "at": "memento-kt-drawing/Canvas.kt#Canvas.restore",
              "say": "The canvas rebuilds itself from the memento's internal fields, which the caretaker cannot use."
            },
            {
              "at": "memento-kt-drawing/UndoManager.kt#UndoManager.redo",
              "say": "Redo is the mirror image: two stacks of opaque snapshots give full undo/redo with no per-action code."
            },
            {
              "at": "memento-kt-drawing/UndoManager.kt#UndoManager.history",
              "say": "The caretaker can list labels for an Edit menu: the one public bit of each memento."
            }
          ],
          "files": {
            "memento-kt-drawing/Canvas.kt": "package paint\n\n// The originator: owns the drawing and is the only class that creates or reads mementos.\nclass Canvas {\n    private val strokes = mutableListOf<Stroke>()\n    private var background = \"white\"\n\n    fun draw(stroke: Stroke) {\n        strokes.add(stroke)\n    }\n\n    fun fill(color: String) {\n        background = color\n    }\n\n    fun snapshot(label: String): CanvasMemento {\n        return CanvasMemento(strokes.toList(), background, label)\n    }\n\n    fun restore(memento: CanvasMemento) {\n        strokes.clear()\n        strokes.addAll(memento.strokes)\n        background = memento.background\n    }\n\n    fun describe(): String {\n        return \"${strokes.size} strokes on $background\"\n    }\n}\n",
            "memento-kt-drawing/CanvasMemento.kt": "package paint\n\n// The memento. Its state is `internal`: in a real project Canvas would live in its own module,\n// and the caretaker could only read the public label, never the strokes.\nclass CanvasMemento internal constructor(internal val strokes: List<Stroke>, internal val background: String, val label: String) {\n    override fun toString(): String {\n        return \"CanvasMemento($label)\"\n    }\n}\n",
            "memento-kt-drawing/Main.kt": "package paint\n\nfun main() {\n    val canvas = Canvas()\n    val undo = UndoManager(canvas, limit = 20)\n\n    undo.execute(\"red line\") { canvas.draw(Stroke(\"red\", listOf(0 to 0, 10 to 10))) }\n    undo.execute(\"blue fill\") { canvas.fill(\"blue\") }\n    undo.execute(\"green dot\") { canvas.draw(Stroke(\"green\", listOf(5 to 5))) }\n    println(canvas.describe())      // 2 strokes on blue\n    println(undo.history())         // [red line, blue fill, green dot]\n\n    undo.undo()\n    undo.undo()\n    println(canvas.describe())      // 1 strokes on white\n\n    undo.redo()\n    println(canvas.describe())      // 1 strokes on blue\n}\n",
            "memento-kt-drawing/Stroke.kt": "package paint\n\n// Immutable data, so a snapshot can share strokes safely instead of deep-copying them.\ndata class Stroke(val color: String, val points: List<Pair<Int, Int>>) {\n    fun pointCount(): Int {\n        return points.size\n    }\n}\n",
            "memento-kt-drawing/UndoManager.kt": "package paint\n\n// The caretaker: two stacks of mementos and a size limit. It never looks inside a memento.\nclass UndoManager(private val canvas: Canvas, private val limit: Int = 50) {\n    private val undoStack = ArrayDeque<CanvasMemento>()\n    private val redoStack = ArrayDeque<CanvasMemento>()\n\n    fun execute(label: String, action: () -> Unit) {\n        undoStack.addLast(canvas.snapshot(label))\n        if (undoStack.size > limit) {\n            undoStack.removeFirst()\n        }\n        redoStack.clear()\n        action()\n    }\n\n    fun undo() {\n        val previous = undoStack.removeLastOrNull() ?: return\n        redoStack.addLast(canvas.snapshot(previous.label))\n        canvas.restore(previous)\n    }\n\n    fun redo() {\n        val next = redoStack.removeLastOrNull() ?: return\n        undoStack.addLast(canvas.snapshot(next.label))\n        canvas.restore(next)\n    }\n\n    fun history(): List<String> {\n        return undoStack.map { it.label }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "interpreter",
      "name": "Interpreter",
      "family": "Behavioral",
      "aka": [
        "Expression tree",
        "Little language"
      ],
      "tagline": "Model each rule of a tiny language as a class, then evaluate sentences as trees.",
      "intent": "When users or designers need to write small rules (formulas, filters, dialogue conditions), give the rule language a grammar and turn each grammar rule into a class with an interpret() method. A sentence becomes a tree of these objects, and evaluating the root walks the whole tree, each node combining the results of its children against a shared context.",
      "analogy": "A recipe card: \"mix (flour + sugar) then bake\". Each instruction is simple on its own; the cook follows the nesting from the inside out, using whatever is in this kitchen today (the context).",
      "cityShape": "Look for a row of node buildings that all have an interpret/evaluate floor at the same height. The non-terminal buildings (Add, AndCondition, BinaryNode) send call pipes from that floor back into the same floor of the other node buildings, so the pipes form a tree that ends at the small leaf buildings.",
      "roles": [
        {
          "name": "Abstract Expression",
          "desc": "The shared interface or base class: one interpret (or evaluate) method that every node has."
        },
        {
          "name": "Terminal Expression",
          "desc": "A leaf of the grammar: a number, a variable name or a single check. It reads the context and has no children."
        },
        {
          "name": "Nonterminal Expression",
          "desc": "One class per grammar rule (and, not, plus, times). It holds child expressions and combines their results."
        },
        {
          "name": "Context",
          "desc": "Everything outside the sentence that evaluation may read: variable values, the inventory, game flags."
        },
        {
          "name": "Client",
          "desc": "Builds the tree (by hand or with a small parser) and calls interpret on its root."
        }
      ],
      "whenToUse": [
        "Designers or users write small rules as text (dialogue conditions, discount rules, search filters) and you want them stored as data, not code.",
        "The grammar is small and stable: a handful of operators you can count on your fingers.",
        "You parse once and evaluate the same rule many times against different contexts."
      ],
      "pitfalls": [
        "Each grammar rule is a class, so a large grammar turns into dozens of classes; use a parser generator or an existing expression library instead.",
        "A naive tree walk is slow for hot paths; libraries often compile the tree to code (Symfony's compile()) or bytecode.",
        "The pattern says nothing about parsing text into the tree. That parser is often the harder part, so keep the syntax very simple."
      ],
      "related": [
        "composite",
        "visitor",
        "specification",
        "command"
      ],
      "quiz": [
        {
          "q": "In the tree for \"price * qty - discount\", which node is interpreted last, and why?",
          "options": [
            "Variable('price'), because it is first in the text",
            "Subtract, the root: it can only finish after its children Multiply and Variable('discount') return values",
            "Multiply, because * binds tighter than -",
            "They all run in parallel"
          ],
          "answer": 1,
          "why": "interpret() recurses down to the leaves first; the root combines its children's results, so it is the last to produce a value."
        },
        {
          "q": "You want to add an \"or\" operator to the dialogue condition language. What changes?",
          "options": [
            "Every existing Condition class gets a new method",
            "A new OrCondition class (a nonterminal) plus a small change in the parser",
            "The context Dictionary needs an \"or\" key",
            "Nothing, the language cannot grow"
          ],
          "answer": 1,
          "why": "Adding a grammar rule means adding one nonterminal class; existing nodes stay untouched. Only the parser needs to know the new word."
        }
      ],
      "demos": [
        {
          "id": "interpreter-ts-calculator",
          "title": "Order total formula",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A shop formula \"price * qty - discount + 4.99\" is built as a tree of Expression objects and evaluated against two different carts. Notice that operators.ts never checks what kind of child it holds.",
          "roles": {
            "Abstract Expression": [
              "interpreter-ts-calculator/expression.ts#Expression"
            ],
            "Terminal Expression": [
              "interpreter-ts-calculator/terminals.ts#NumberLiteral",
              "interpreter-ts-calculator/terminals.ts#Variable"
            ],
            "Nonterminal Expression": [
              "interpreter-ts-calculator/operators.ts#Add",
              "interpreter-ts-calculator/operators.ts#Subtract",
              "interpreter-ts-calculator/operators.ts#Multiply"
            ],
            "Context": [
              "interpreter-ts-calculator/expression.ts#Context"
            ],
            "Client": [
              "interpreter-ts-calculator/main.ts#main",
              "interpreter-ts-calculator/main.ts#buildOrderTotal"
            ]
          },
          "trace": [
            {
              "at": "interpreter-ts-calculator/main.ts#buildOrderTotal",
              "say": "The client nests objects the way the formula nests: Multiply inside Subtract inside Add. The tree IS the sentence."
            },
            {
              "at": "interpreter-ts-calculator/main.ts#main",
              "say": "main() puts the cart's numbers into a context map and calls interpret() on the root only."
            },
            {
              "at": "interpreter-ts-calculator/operators.ts#Add.interpret",
              "say": "Add asks both children for their values first. It does not care that its left child is a whole sub-tree."
            },
            {
              "at": "interpreter-ts-calculator/operators.ts#Subtract.interpret",
              "say": "Subtract does the same one level down. Each class handles exactly one grammar rule."
            },
            {
              "at": "interpreter-ts-calculator/operators.ts#Multiply.interpret",
              "say": "Multiply reaches the bottom of the tree: its children are leaves."
            },
            {
              "at": "interpreter-ts-calculator/terminals.ts#Variable.interpret",
              "say": "A terminal asks the context for its value. This is why the same tree gives a different total for a different cart."
            },
            {
              "at": "interpreter-ts-calculator/terminals.ts#NumberLiteral.interpret",
              "say": "The constant 4.99 ignores the context. Results now flow back up to Add, which returns the total."
            }
          ],
          "files": {
            "interpreter-ts-calculator/expression.ts": "// The context: everything outside the sentence that evaluation may read.\n// Here it is just the current values of the variables.\nexport class Context {\n  constructor(private values: Record<string, number>) {}\n\n  lookup(name: string): number {\n    const value = this.values[name];\n    if (value === undefined) {\n      throw new Error(`Unknown variable: ${name}`);\n    }\n    return value;\n  }\n}\n\n// The grammar's common contract: every piece of a sentence knows how to work out its own value.\nexport interface Expression {\n  interpret(context: Context): number;\n  toString(): string;\n}\n",
            "interpreter-ts-calculator/main.ts": "import { Context } from './expression';\nimport { NumberLiteral, Variable } from './terminals';\nimport { Add, Subtract, Multiply } from './operators';\n\n// The client builds the sentence \"price * qty - discount + 4.99\" as a tree, by hand.\n// A real program would let a small parser build this tree from text.\nfunction buildOrderTotal() {\n  const subtotal = new Multiply(new Variable('price'), new Variable('qty'));\n  const afterDiscount = new Subtract(subtotal, new Variable('discount'));\n  return new Add(afterDiscount, new NumberLiteral(4.99));\n}\n\nfunction main(): void {\n  const total = buildOrderTotal();\n  console.log('Formula:', total.toString());\n\n  const cart = new Context({ price: 12, qty: 3, discount: 5 });\n  console.log('Cart 1 total:', total.interpret(cart));\n\n  // Same tree, different context: interpret it again with new numbers.\n  const bigCart = new Context({ price: 12, qty: 10, discount: 20 });\n  console.log('Cart 2 total:', total.interpret(bigCart));\n}\n\nmain();\n",
            "interpreter-ts-calculator/operators.ts": "import { Expression, Context } from './expression';\n\n// Non-terminal expressions: one class per grammar rule. Each holds child expressions\n// and combines their results. None of them knows what kind of child it holds.\n\nexport class Add implements Expression {\n  constructor(private left: Expression, private right: Expression) {}\n\n  interpret(context: Context): number {\n    return this.left.interpret(context) + this.right.interpret(context);\n  }\n\n  toString(): string {\n    return `(${this.left} + ${this.right})`;\n  }\n}\n\nexport class Subtract implements Expression {\n  constructor(private left: Expression, private right: Expression) {}\n\n  interpret(context: Context): number {\n    return this.left.interpret(context) - this.right.interpret(context);\n  }\n\n  toString(): string {\n    return `(${this.left} - ${this.right})`;\n  }\n}\n\nexport class Multiply implements Expression {\n  constructor(private left: Expression, private right: Expression) {}\n\n  interpret(context: Context): number {\n    return this.left.interpret(context) * this.right.interpret(context);\n  }\n\n  toString(): string {\n    return `(${this.left} * ${this.right})`;\n  }\n}\n",
            "interpreter-ts-calculator/terminals.ts": "import { Expression, Context } from './expression';\n\n// Terminal expressions: the leaves of the tree. They have no children.\n\nexport class NumberLiteral implements Expression {\n  constructor(private value: number) {}\n\n  interpret(context: Context): number {\n    return this.value;\n  }\n\n  toString(): string {\n    return String(this.value);\n  }\n}\n\nexport class Variable implements Expression {\n  constructor(private name: string) {}\n\n  interpret(context: Context): number {\n    return context.lookup(this.name);\n  }\n\n  toString(): string {\n    return this.name;\n  }\n}\n"
          }
        },
        {
          "id": "interpreter-gd-dialogue",
          "title": "Dialogue conditions in Godot",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Dialogue choices carry condition strings like \"has:rusty_key and not flag:door_open\". A tiny parser turns each string into Condition objects, and only choices whose tree evaluates to true are shown.",
          "roles": {
            "Abstract Expression": [
              "interpreter-gd-dialogue/condition.gd#evaluate"
            ],
            "Terminal Expression": [
              "interpreter-gd-dialogue/state_check.gd#evaluate"
            ],
            "Nonterminal Expression": [
              "interpreter-gd-dialogue/and_condition.gd#evaluate",
              "interpreter-gd-dialogue/not_condition.gd#evaluate"
            ],
            "Context": [
              "interpreter-gd-dialogue/npc_dialogue.gd#build_context"
            ],
            "Client": [
              "interpreter-gd-dialogue/npc_dialogue.gd#show_choices",
              "interpreter-gd-dialogue/condition_parser.gd#parse"
            ]
          },
          "trace": [
            {
              "at": "interpreter-gd-dialogue/npc_dialogue.gd#show_choices",
              "say": "For each choice the NPC parses its condition text, then asks the resulting tree one question: evaluate()."
            },
            {
              "at": "interpreter-gd-dialogue/condition_parser.gd#parse_expr",
              "say": "The parser follows the grammar: terms joined by \"and\" become one AndCondition holding all of them."
            },
            {
              "at": "interpreter-gd-dialogue/condition_parser.gd#parse_term",
              "say": "\"not\" wraps the next term in a NotCondition; anything else is an atom. Parsing builds the tree once."
            },
            {
              "at": "interpreter-gd-dialogue/npc_dialogue.gd#build_context",
              "say": "The context is plain game state. Conditions may read it but never change it."
            },
            {
              "at": "interpreter-gd-dialogue/and_condition.gd#evaluate",
              "say": "The root AndCondition asks each child in turn and stops at the first false, just like the and keyword."
            },
            {
              "at": "interpreter-gd-dialogue/state_check.gd#evaluate",
              "say": "The leaf has:rusty_key looks in the inventory. Terminals are where the language touches the game."
            },
            {
              "at": "interpreter-gd-dialogue/not_condition.gd#evaluate",
              "say": "NotCondition flips its child's answer. door_open is false, so the cellar choice is shown."
            },
            {
              "at": "interpreter-gd-dialogue/npc_dialogue.gd#_on_door_opened",
              "say": "The door opens; the same condition texts now give different results. Designers changed nothing in code."
            }
          ],
          "files": {
            "interpreter-gd-dialogue/and_condition.gd": "extends Condition\n\n# Non-terminal expression for the grammar rule  expr := term \"and\" term ...\n# It owns child conditions and combines their answers.\n\nvar parts: Array[Condition] = []\n\nfunc _init(p_parts: Array[Condition]) -> void:\n\tparts = p_parts\n\nfunc evaluate(context: Dictionary) -> bool:\n\tfor part in parts:\n\t\tif not part.evaluate(context):\n\t\t\treturn false\n\treturn true\n\nfunc describe() -> String:\n\tvar names: Array[String] = []\n\tfor part in parts:\n\t\tnames.append(part.describe())\n\treturn \"(\" + \" and \".join(names) + \")\"\n",
            "interpreter-gd-dialogue/condition.gd": "class_name Condition\nextends RefCounted\n\n# Abstract expression of a tiny condition language used by dialogue files, e.g.\n#   \"has:rusty_key and not flag:door_open\"\n# Every node of the parsed tree is a Condition and answers one question: is it true right now?\n\nfunc evaluate(context: Dictionary) -> bool:\n\tpush_error(\"Condition.evaluate() must be overridden\")\n\treturn false\n\nfunc describe() -> String:\n\treturn \"?\"\n",
            "interpreter-gd-dialogue/condition_parser.gd": "extends RefCounted\n\n# Turns condition text from a dialogue file into a tree of Condition objects.\n# Grammar:\n#   expr  := term (\"and\" term)*\n#   term  := \"not\" term | atom\n#   atom  := (\"has\" | \"flag\") \":\" name\n# Parsing happens once; the tree can then be evaluated many times.\n\nconst StateCheck = preload(\"res://state_check.gd\")\nconst AndCondition = preload(\"res://and_condition.gd\")\nconst NotCondition = preload(\"res://not_condition.gd\")\n\nvar tokens: PackedStringArray\nvar pos := 0\n\nfunc parse(text: String) -> Condition:\n\ttokens = text.strip_edges().split(\" \", false)\n\tpos = 0\n\treturn parse_expr()\n\nfunc parse_expr() -> Condition:\n\tvar parts: Array[Condition] = [parse_term()]\n\twhile pos < tokens.size() and tokens[pos] == \"and\":\n\t\tpos += 1\n\t\tparts.append(parse_term())\n\tif parts.size() == 1:\n\t\treturn parts[0]\n\treturn AndCondition.new(parts)\n\nfunc parse_term() -> Condition:\n\tif tokens[pos] == \"not\":\n\t\tpos += 1\n\t\treturn NotCondition.new(parse_term())\n\treturn parse_atom()\n\nfunc parse_atom() -> Condition:\n\tvar word := tokens[pos]\n\tpos += 1\n\tvar pieces := word.split(\":\")\n\treturn StateCheck.new(pieces[0], pieces[1])\n",
            "interpreter-gd-dialogue/not_condition.gd": "extends Condition\n\n# Non-terminal expression for the rule  term := \"not\" term\n# It wraps exactly one child and flips its answer.\n\nvar inner: Condition\n\nfunc _init(p_inner: Condition) -> void:\n\tinner = p_inner\n\nfunc evaluate(context: Dictionary) -> bool:\n\treturn not inner.evaluate(context)\n\nfunc describe() -> String:\n\treturn \"not \" + inner.describe()\n",
            "interpreter-gd-dialogue/npc_dialogue.gd": "extends Node\n\n# The client: an NPC whose dialogue choices are guarded by condition strings,\n# the way they would appear in a dialogue resource or JSON file written by a designer.\n\nconst ConditionParser = preload(\"res://condition_parser.gd\")\n\nvar inventory: Array[String] = [\"rusty_key\", \"apple\"]\nvar flags := {\"met_guard\": true, \"door_open\": false}\n\nvar choices := [\n\t{\"text\": \"Unlock the cellar door\", \"when\": \"has:rusty_key and not flag:door_open\"},\n\t{\"text\": \"Ask the guard about the tower\", \"when\": \"flag:met_guard\"},\n\t{\"text\": \"Show the royal seal\", \"when\": \"has:royal_seal\"},\n]\n\nfunc _ready() -> void:\n\tshow_choices()\n\nfunc build_context() -> Dictionary:\n\t# The context: the game state the conditions are allowed to read.\n\treturn {\"inventory\": inventory, \"flags\": flags}\n\nfunc show_choices() -> void:\n\tvar parser := ConditionParser.new()\n\tvar context := build_context()\n\tfor choice in choices:\n\t\tvar condition: Condition = parser.parse(choice[\"when\"])\n\t\tif condition.evaluate(context):\n\t\t\tprint(\"> \", choice[\"text\"], \"   [\", condition.describe(), \"]\")\n\nfunc _on_door_opened() -> void:\n\tflags[\"door_open\"] = true\n\tshow_choices()\n",
            "interpreter-gd-dialogue/state_check.gd": "extends Condition\n\n# Terminal expression: a single word like \"has:rusty_key\" or \"flag:met_guard\".\n# It reads the context and does not hold any child conditions.\n\nvar kind: String\nvar key: String\n\nfunc _init(p_kind: String, p_key: String) -> void:\n\tkind = p_kind\n\tkey = p_key\n\nfunc evaluate(context: Dictionary) -> bool:\n\tif kind == \"has\":\n\t\treturn context[\"inventory\"].has(key)\n\tif kind == \"flag\":\n\t\treturn context[\"flags\"].get(key, false)\n\tpush_warning(\"Unknown check: %s\" % kind)\n\treturn false\n\nfunc describe() -> String:\n\treturn \"%s:%s\" % [kind, key]\n"
          }
        },
        {
          "id": "interpreter-symfony-real",
          "title": "Symfony ExpressionLanguage nodes",
          "lang": "PHP",
          "level": "advanced",
          "source": {
            "repo": "symfony/expression-language",
            "url": "https://github.com/symfony/expression-language/blob/v7.1.6/Node/BinaryNode.php",
            "license": "MIT",
            "note": "Node/*.php are verbatim from symfony/expression-language v7.1.6 (Node.php and ConstantNode.php have printing helpers cut, marked with comments); usage.php was written for Software City."
          },
          "story": "Symfony's expression engine (used for security rules and routing conditions) is a textbook Interpreter: every node class has evaluate($functions, $values). The same tree can also compile() itself to PHP source for speed.",
          "roles": {
            "Abstract Expression": [
              "interpreter-symfony-real/Node/Node.php#Node"
            ],
            "Terminal Expression": [
              "interpreter-symfony-real/Node/ConstantNode.php#ConstantNode",
              "interpreter-symfony-real/Node/NameNode.php#NameNode"
            ],
            "Nonterminal Expression": [
              "interpreter-symfony-real/Node/BinaryNode.php#BinaryNode",
              "interpreter-symfony-real/Node/UnaryNode.php#UnaryNode"
            ],
            "Context": [
              "interpreter-symfony-real/usage.php#customerValues"
            ],
            "Client": [
              "interpreter-symfony-real/usage.php#run",
              "interpreter-symfony-real/usage.php#buildRule"
            ]
          },
          "trace": [
            {
              "at": "interpreter-symfony-real/usage.php#buildRule",
              "say": "We build the tree that Symfony's Parser would build for: not banned and age >= 18 and country in [...]"
            },
            {
              "at": "interpreter-symfony-real/usage.php#run",
              "say": "run() evaluates one tree against three customers. $values is the context the leaves read."
            },
            {
              "at": "interpreter-symfony-real/Node/BinaryNode.php#BinaryNode.evaluate",
              "say": "The root 'and' evaluates its left child first and only touches the right one if needed: short-circuiting lives in the node."
            },
            {
              "at": "interpreter-symfony-real/Node/UnaryNode.php#UnaryNode.evaluate",
              "say": "'not' evaluates its single child, then flips the value with a match on the operator attribute."
            },
            {
              "at": "interpreter-symfony-real/Node/NameNode.php#NameNode.evaluate",
              "say": "A terminal: a variable name is just a lookup in the $values context."
            },
            {
              "at": "interpreter-symfony-real/Node/ConstantNode.php#ConstantNode.evaluate",
              "say": "Another terminal: 18 or the country list returns its stored value and ignores the context."
            },
            {
              "at": "interpreter-symfony-real/Node/Node.php#Node.evaluate",
              "say": "The base class evaluates a list of children, which is how array literals and function arguments work."
            },
            {
              "at": "interpreter-symfony-real/Node/BinaryNode.php#BinaryNode.compile",
              "say": "Bonus: each node can also write itself out as PHP code. Symfony caches that, so hot rules skip the tree walk."
            }
          ],
          "files": {
            "interpreter-symfony-real/Node/BinaryNode.php": "<?php\n\n// Source: symfony/expression-language v7.1.6 — https://github.com/symfony/expression-language/blob/v7.1.6/Node/BinaryNode.php\n// MIT License, Copyright (c) 2004-present Fabien Potencier. Included for study.\n\n/*\n * This file is part of the Symfony package.\n *\n * (c) Fabien Potencier <fabien@symfony.com>\n *\n * For the full copyright and license information, please view the LICENSE\n * file that was distributed with this source code.\n */\n\nnamespace Symfony\\Component\\ExpressionLanguage\\Node;\n\nuse Symfony\\Component\\ExpressionLanguage\\Compiler;\nuse Symfony\\Component\\ExpressionLanguage\\SyntaxError;\n\n/**\n * @author Fabien Potencier <fabien@symfony.com>\n *\n * @internal\n */\nclass BinaryNode extends Node\n{\n    private const OPERATORS = [\n        '~' => '.',\n        'and' => '&&',\n        'or' => '||',\n    ];\n\n    private const FUNCTIONS = [\n        '**' => 'pow',\n        '..' => 'range',\n        'in' => '\\\\in_array',\n        'not in' => '!\\\\in_array',\n        'contains' => 'str_contains',\n        'starts with' => 'str_starts_with',\n        'ends with' => 'str_ends_with',\n    ];\n\n    public function __construct(string $operator, Node $left, Node $right)\n    {\n        parent::__construct(\n            ['left' => $left, 'right' => $right],\n            ['operator' => $operator]\n        );\n    }\n\n    public function compile(Compiler $compiler): void\n    {\n        $operator = $this->attributes['operator'];\n\n        if ('matches' == $operator) {\n            if ($this->nodes['right'] instanceof ConstantNode) {\n                $this->evaluateMatches($this->nodes['right']->evaluate([], []), '');\n            }\n\n            $compiler\n                ->raw('(static function ($regexp, $str) { set_error_handler(static fn ($t, $m) => throw new \\Symfony\\Component\\ExpressionLanguage\\SyntaxError(sprintf(\\'Regexp \"%s\" passed to \"matches\" is not valid\\', $regexp).substr($m, 12))); try { return preg_match($regexp, (string) $str); } finally { restore_error_handler(); } })(')\n                ->compile($this->nodes['right'])\n                ->raw(', ')\n                ->compile($this->nodes['left'])\n                ->raw(')')\n            ;\n\n            return;\n        }\n\n        if (isset(self::FUNCTIONS[$operator])) {\n            $compiler\n                ->raw(sprintf('%s(', self::FUNCTIONS[$operator]))\n                ->compile($this->nodes['left'])\n                ->raw(', ')\n                ->compile($this->nodes['right'])\n            ;\n\n            if ('in' === $operator || 'not in' === $operator) {\n                $compiler->raw(', true');\n            }\n\n            $compiler->raw(')');\n\n            return;\n        }\n\n        if (isset(self::OPERATORS[$operator])) {\n            $operator = self::OPERATORS[$operator];\n        }\n\n        $compiler\n            ->raw('(')\n            ->compile($this->nodes['left'])\n            ->raw(' ')\n            ->raw($operator)\n            ->raw(' ')\n            ->compile($this->nodes['right'])\n            ->raw(')')\n        ;\n    }\n\n    public function evaluate(array $functions, array $values): mixed\n    {\n        $operator = $this->attributes['operator'];\n        $left = $this->nodes['left']->evaluate($functions, $values);\n\n        if (isset(self::FUNCTIONS[$operator])) {\n            $right = $this->nodes['right']->evaluate($functions, $values);\n\n            return match ($operator) {\n                'in' => \\in_array($left, $right, true),\n                'not in' => !\\in_array($left, $right, true),\n                default => self::FUNCTIONS[$operator]($left, $right),\n            };\n        }\n\n        switch ($operator) {\n            case 'or':\n            case '||':\n                return $left || $this->nodes['right']->evaluate($functions, $values);\n            case 'and':\n            case '&&':\n                return $left && $this->nodes['right']->evaluate($functions, $values);\n        }\n\n        $right = $this->nodes['right']->evaluate($functions, $values);\n\n        switch ($operator) {\n            case '|':\n                return $left | $right;\n            case '^':\n                return $left ^ $right;\n            case '&':\n                return $left & $right;\n            case '==':\n                return $left == $right;\n            case '===':\n                return $left === $right;\n            case '!=':\n                return $left != $right;\n            case '!==':\n                return $left !== $right;\n            case '<':\n                return $left < $right;\n            case '>':\n                return $left > $right;\n            case '>=':\n                return $left >= $right;\n            case '<=':\n                return $left <= $right;\n            case 'not in':\n                return !\\in_array($left, $right, true);\n            case 'in':\n                return \\in_array($left, $right, true);\n            case '+':\n                return $left + $right;\n            case '-':\n                return $left - $right;\n            case '~':\n                return $left.$right;\n            case '*':\n                return $left * $right;\n            case '/':\n                if (0 == $right) {\n                    throw new \\DivisionByZeroError('Division by zero.');\n                }\n\n                return $left / $right;\n            case '%':\n                if (0 == $right) {\n                    throw new \\DivisionByZeroError('Modulo by zero.');\n                }\n\n                return $left % $right;\n            case 'matches':\n                return $this->evaluateMatches($right, $left);\n        }\n    }\n\n    public function toArray(): array\n    {\n        return ['(', $this->nodes['left'], ' '.$this->attributes['operator'].' ', $this->nodes['right'], ')'];\n    }\n\n    private function evaluateMatches(string $regexp, ?string $str): int\n    {\n        set_error_handler(static fn ($t, $m) => throw new SyntaxError(sprintf('Regexp \"%s\" passed to \"matches\" is not valid', $regexp).substr($m, 12)));\n        try {\n            return preg_match($regexp, (string) $str);\n        } finally {\n            restore_error_handler();\n        }\n    }\n}\n",
            "interpreter-symfony-real/Node/ConstantNode.php": "<?php\n\n// Source: symfony/expression-language v7.1.6 — https://github.com/symfony/expression-language/blob/v7.1.6/Node/ConstantNode.php\n// MIT License, Copyright (c) 2004-present Fabien Potencier. Included for study.\n\n/*\n * This file is part of the Symfony package.\n *\n * (c) Fabien Potencier <fabien@symfony.com>\n *\n * For the full copyright and license information, please view the LICENSE\n * file that was distributed with this source code.\n */\n\nnamespace Symfony\\Component\\ExpressionLanguage\\Node;\n\nuse Symfony\\Component\\ExpressionLanguage\\Compiler;\n\n/**\n * @author Fabien Potencier <fabien@symfony.com>\n *\n * @internal\n */\nclass ConstantNode extends Node\n{\n    public readonly bool $isNullSafe;\n    private bool $isIdentifier;\n\n    public function __construct(mixed $value, bool $isIdentifier = false, bool $isNullSafe = false)\n    {\n        $this->isIdentifier = $isIdentifier;\n        $this->isNullSafe = $isNullSafe;\n        parent::__construct(\n            [],\n            ['value' => $value]\n        );\n    }\n\n    public function compile(Compiler $compiler): void\n    {\n        $compiler->repr($this->attributes['value']);\n    }\n\n    public function evaluate(array $functions, array $values): mixed\n    {\n        return $this->attributes['value'];\n    }\n\n    // … trimmed: toArray(), 37 lines that print the constant back as expression text …\n}\n",
            "interpreter-symfony-real/Node/NameNode.php": "<?php\n\n// Source: symfony/expression-language v7.1.6 — https://github.com/symfony/expression-language/blob/v7.1.6/Node/NameNode.php\n// MIT License, Copyright (c) 2004-present Fabien Potencier. Included for study.\n\n/*\n * This file is part of the Symfony package.\n *\n * (c) Fabien Potencier <fabien@symfony.com>\n *\n * For the full copyright and license information, please view the LICENSE\n * file that was distributed with this source code.\n */\n\nnamespace Symfony\\Component\\ExpressionLanguage\\Node;\n\nuse Symfony\\Component\\ExpressionLanguage\\Compiler;\n\n/**\n * @author Fabien Potencier <fabien@symfony.com>\n *\n * @internal\n */\nclass NameNode extends Node\n{\n    public function __construct(string $name)\n    {\n        parent::__construct(\n            [],\n            ['name' => $name]\n        );\n    }\n\n    public function compile(Compiler $compiler): void\n    {\n        $compiler->raw('$'.$this->attributes['name']);\n    }\n\n    public function evaluate(array $functions, array $values): mixed\n    {\n        return $values[$this->attributes['name']];\n    }\n\n    public function toArray(): array\n    {\n        return [$this->attributes['name']];\n    }\n}\n",
            "interpreter-symfony-real/Node/Node.php": "<?php\n\n// Source: symfony/expression-language v7.1.6 — https://github.com/symfony/expression-language/blob/v7.1.6/Node/Node.php\n// MIT License, Copyright (c) 2004-present Fabien Potencier. Included for study.\n\n/*\n * This file is part of the Symfony package.\n *\n * (c) Fabien Potencier <fabien@symfony.com>\n *\n * For the full copyright and license information, please view the LICENSE\n * file that was distributed with this source code.\n */\n\nnamespace Symfony\\Component\\ExpressionLanguage\\Node;\n\nuse Symfony\\Component\\ExpressionLanguage\\Compiler;\n\n/**\n * Represents a node in the AST.\n *\n * @author Fabien Potencier <fabien@symfony.com>\n */\nclass Node\n{\n    public array $nodes = [];\n    public array $attributes = [];\n\n    /**\n     * @param array $nodes      An array of nodes\n     * @param array $attributes An array of attributes\n     */\n    public function __construct(array $nodes = [], array $attributes = [])\n    {\n        $this->nodes = $nodes;\n        $this->attributes = $attributes;\n    }\n\n    public function __toString(): string\n    {\n        $attributes = [];\n        foreach ($this->attributes as $name => $value) {\n            $attributes[] = sprintf('%s: %s', $name, str_replace(\"\\n\", '', var_export($value, true)));\n        }\n\n        $repr = [str_replace('Symfony\\Component\\ExpressionLanguage\\Node\\\\', '', static::class).'('.implode(', ', $attributes)];\n\n        if (\\count($this->nodes)) {\n            foreach ($this->nodes as $node) {\n                foreach (explode(\"\\n\", (string) $node) as $line) {\n                    $repr[] = '    '.$line;\n                }\n            }\n\n            $repr[] = ')';\n        } else {\n            $repr[0] .= ')';\n        }\n\n        return implode(\"\\n\", $repr);\n    }\n\n    public function compile(Compiler $compiler): void\n    {\n        foreach ($this->nodes as $node) {\n            $node->compile($compiler);\n        }\n    }\n\n    public function evaluate(array $functions, array $values): mixed\n    {\n        $results = [];\n        foreach ($this->nodes as $node) {\n            $results[] = $node->evaluate($functions, $values);\n        }\n\n        return $results;\n    }\n\n    // … trimmed: toArray(), dump(), dumpString() and isHash(), 36 lines that print an expression back as text …\n}\n",
            "interpreter-symfony-real/Node/UnaryNode.php": "<?php\n\n// Source: symfony/expression-language v7.1.6 — https://github.com/symfony/expression-language/blob/v7.1.6/Node/UnaryNode.php\n// MIT License, Copyright (c) 2004-present Fabien Potencier. Included for study.\n\n/*\n * This file is part of the Symfony package.\n *\n * (c) Fabien Potencier <fabien@symfony.com>\n *\n * For the full copyright and license information, please view the LICENSE\n * file that was distributed with this source code.\n */\n\nnamespace Symfony\\Component\\ExpressionLanguage\\Node;\n\nuse Symfony\\Component\\ExpressionLanguage\\Compiler;\n\n/**\n * @author Fabien Potencier <fabien@symfony.com>\n *\n * @internal\n */\nclass UnaryNode extends Node\n{\n    private const OPERATORS = [\n        '!' => '!',\n        'not' => '!',\n        '+' => '+',\n        '-' => '-',\n    ];\n\n    public function __construct(string $operator, Node $node)\n    {\n        parent::__construct(\n            ['node' => $node],\n            ['operator' => $operator]\n        );\n    }\n\n    public function compile(Compiler $compiler): void\n    {\n        $compiler\n            ->raw('(')\n            ->raw(self::OPERATORS[$this->attributes['operator']])\n            ->compile($this->nodes['node'])\n            ->raw(')')\n        ;\n    }\n\n    public function evaluate(array $functions, array $values): mixed\n    {\n        $value = $this->nodes['node']->evaluate($functions, $values);\n\n        return match ($this->attributes['operator']) {\n            'not',\n            '!' => !$value,\n            '-' => -$value,\n            default => $value,\n        };\n    }\n\n    public function toArray(): array\n    {\n        return ['(', $this->attributes['operator'].' ', $this->nodes['node'], ')'];\n    }\n}\n",
            "interpreter-symfony-real/usage.php": "<?php\n\n// Example usage written for Software City (not part of Symfony).\n// Normally ExpressionLanguage's Parser turns text into this tree. Here we build the tree by hand\n// for the rule: not banned and age >= 18 and country in [\"DE\", \"AT\", \"CH\"]\n\nrequire_once __DIR__ . '/Node/Node.php';\nrequire_once __DIR__ . '/Node/ConstantNode.php';\nrequire_once __DIR__ . '/Node/NameNode.php';\nrequire_once __DIR__ . '/Node/BinaryNode.php';\nrequire_once __DIR__ . '/Node/UnaryNode.php';\n\nuse Symfony\\Component\\ExpressionLanguage\\Node\\BinaryNode;\nuse Symfony\\Component\\ExpressionLanguage\\Node\\ConstantNode;\nuse Symfony\\Component\\ExpressionLanguage\\Node\\NameNode;\nuse Symfony\\Component\\ExpressionLanguage\\Node\\Node;\nuse Symfony\\Component\\ExpressionLanguage\\Node\\UnaryNode;\n\nfunction buildRule(): Node\n{\n    $notBanned = new UnaryNode('not', new NameNode('banned'));\n    $adult = new BinaryNode('>=', new NameNode('age'), new ConstantNode(18));\n    $dach = new BinaryNode('in', new NameNode('country'), new ConstantNode(['DE', 'AT', 'CH']));\n\n    return new BinaryNode('and', new BinaryNode('and', $notBanned, $adult), $dach);\n}\n\nfunction customerValues(int $age, string $country, bool $banned): array\n{\n    // The context: the variables the expression may read by name.\n    return ['age' => $age, 'country' => $country, 'banned' => $banned];\n}\n\nfunction run(): void\n{\n    $rule = buildRule();\n    echo $rule, \"\\n\";\n\n    var_dump($rule->evaluate([], customerValues(34, 'AT', false)));\n    var_dump($rule->evaluate([], customerValues(16, 'DE', false)));\n    var_dump($rule->evaluate([], customerValues(40, 'FR', false)));\n}\n\nrun();\n"
          }
        }
      ]
    },
    {
      "id": "null-object",
      "name": "Null Object",
      "family": "Behavioral",
      "aka": [
        "Do-nothing object",
        "Neutral object",
        "Special case"
      ],
      "tagline": "Instead of null, hand out an object that does nothing, so callers need no null checks.",
      "intent": "When something is optional (a logger, a customer, a weapon), represent 'nothing' with a real object that implements the same interface but does nothing or returns neutral values. Client code calls methods directly, without scattering if-not-null checks, and can never crash on a missing object.",
      "analogy": "A 'Reserved' card on an empty restaurant seat: the waiter can treat every seat the same way (look at it, skip it) instead of first asking 'is there a chair here at all?'.",
      "cityShape": "Look for a short interface building with two or more neighbours that implement it: a real one with tall, busy floors and a null one with the same floor names but tiny, empty floors. The client building's pipes go only to the interface, and you will not find branches checking for null.",
      "roles": [
        {
          "name": "Abstraction",
          "desc": "The interface or base class the client depends on: Logger, Customer, Weapon."
        },
        {
          "name": "Real Object",
          "desc": "A normal implementation that does the actual work."
        },
        {
          "name": "Null Object",
          "desc": "Implements the same interface with do-nothing methods and safe neutral answers (0, empty string, 'guest')."
        },
        {
          "name": "Provider",
          "desc": "Hands out either a real object or the null object, so callers never receive null. Often a lookup, factory or constructor default."
        },
        {
          "name": "Client",
          "desc": "Uses the abstraction freely, without null checks."
        }
      ],
      "whenToUse": [
        "Something is optional, and 'absent' has an obvious harmless behaviour (do not log, no discount, no shot).",
        "The same null check is repeated in many places before calling a method.",
        "A lookup may fail and you want callers to carry on with sensible defaults."
      ],
      "pitfalls": [
        "Hiding real errors: if 'missing' is a bug (a required config), a silent null object makes it hard to notice. Fail loudly instead.",
        "Neutral answers must be truly neutral; a null object that returns made-up data misleads callers.",
        "When callers still need to know (show 'please log in'), add an explicit isNull()/is_empty check or keep a real Optional; do not fake it."
      ],
      "related": [
        "strategy",
        "polymorphism",
        "option-result",
        "singleton",
        "state"
      ],
      "quiz": [
        {
          "q": "What is the main benefit of returning a NoCustomer object instead of null from findByCard()?",
          "options": [
            "It uses less memory",
            "Callers can call customer methods directly; no null checks, no NullPointerException",
            "It makes the database faster",
            "It stores guests in the database"
          ],
          "answer": 1,
          "why": "The null object implements the same interface with neutral behaviour, so every call site works unchanged."
        },
        {
          "q": "When is a null object a bad idea?",
          "options": [
            "When absence is an error that someone must notice",
            "When the interface has more than one method",
            "When the language has a null keyword",
            "When the real object is slow"
          ],
          "answer": 0,
          "why": "A do-nothing object silently swallows the situation. If a missing database connection is a bug, failing fast is better."
        }
      ],
      "demos": [
        {
          "id": "null-object-java-customers",
          "title": "Checkout with a NoCustomer",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "The till looks up a loyalty card. Unknown cards get a shared NoCustomer: no discount, no points, a guest greeting. Notice that Checkout.pay() has no null check at all.",
          "roles": {
            "Abstraction": [
              "null-object-java-customers/Customer.java#Customer"
            ],
            "Real Object": [
              "null-object-java-customers/MemberCustomer.java#MemberCustomer"
            ],
            "Null Object": [
              "null-object-java-customers/NoCustomer.java#NoCustomer"
            ],
            "Provider": [
              "null-object-java-customers/CustomerDirectory.java#CustomerDirectory.findByCard"
            ],
            "Client": [
              "null-object-java-customers/Checkout.java#Checkout.pay"
            ]
          },
          "trace": [
            {
              "at": "null-object-java-customers/Checkout.java#Checkout.main",
              "say": "One member card is registered. Then two payments: a known card and an unknown one."
            },
            {
              "at": "null-object-java-customers/Checkout.java#Checkout.pay",
              "say": "pay() looks up the customer and uses it straight away: discount, points, greeting. No branches."
            },
            {
              "at": "null-object-java-customers/CustomerDirectory.java#CustomerDirectory.findByCard",
              "say": "For card 9999 getOrDefault returns the shared NoCustomer instead of null."
            },
            {
              "at": "null-object-java-customers/MemberCustomer.java#MemberCustomer.discountRate",
              "say": "Ada, a real member, gets 10% because she has over 100 points."
            },
            {
              "at": "null-object-java-customers/NoCustomer.java#NoCustomer.discountRate",
              "say": "The null object answers 0.0: a neutral value that makes the maths come out as full price."
            },
            {
              "at": "null-object-java-customers/NoCustomer.java#NoCustomer.addLoyaltyPoints",
              "say": "Adding points to nobody does nothing, deliberately. The caller did not need to know."
            }
          ],
          "files": {
            "null-object-java-customers/Checkout.java": "// The client: no \"if (customer != null)\" anywhere.\npublic class Checkout {\n    private final CustomerDirectory directory;\n\n    public Checkout(CustomerDirectory directory) {\n        this.directory = directory;\n    }\n\n    public void pay(String cardNumber, double amount) {\n        Customer customer = directory.findByCard(cardNumber);\n        double total = amount * (1 - customer.discountRate());\n        customer.addLoyaltyPoints((int) total);\n        System.out.println(customer.greeting() + \" -> you pay \" + total);\n    }\n\n    public static void main(String[] args) {\n        CustomerDirectory directory = new CustomerDirectory();\n        directory.register(\"1234\", new MemberCustomer(\"Ada\", 120));\n        Checkout checkout = new Checkout(directory);\n        checkout.pay(\"1234\", 50.0);\n        checkout.pay(\"9999\", 50.0);\n    }\n}\n",
            "null-object-java-customers/Customer.java": "// What every customer can do. Checkout only ever talks to this interface.\npublic interface Customer {\n    String greeting();\n\n    double discountRate();\n\n    void addLoyaltyPoints(int points);\n}\n",
            "null-object-java-customers/CustomerDirectory.java": "import java.util.HashMap;\nimport java.util.Map;\n\n// Never returns null: unknown cards get the shared NoCustomer instance.\npublic class CustomerDirectory {\n    private static final Customer NOBODY = new NoCustomer();\n    private final Map<String, Customer> byCard = new HashMap<>();\n\n    public void register(String cardNumber, Customer customer) {\n        byCard.put(cardNumber, customer);\n    }\n\n    public Customer findByCard(String cardNumber) {\n        return byCard.getOrDefault(cardNumber, NOBODY);\n    }\n}\n",
            "null-object-java-customers/MemberCustomer.java": "// A real, registered customer with a discount and a points balance.\npublic class MemberCustomer implements Customer {\n    private final String name;\n    private int points;\n\n    public MemberCustomer(String name, int points) {\n        this.name = name;\n        this.points = points;\n    }\n\n    public String greeting() {\n        return \"Welcome back, \" + name + \" (\" + points + \" points)\";\n    }\n\n    public double discountRate() {\n        return points >= 100 ? 0.10 : 0.05;\n    }\n\n    public void addLoyaltyPoints(int points) {\n        this.points += points;\n    }\n}\n",
            "null-object-java-customers/NoCustomer.java": "// The Null Object: a customer that is \"nobody\". Safe, neutral answers; does nothing.\npublic class NoCustomer implements Customer {\n    public String greeting() {\n        return \"Welcome, guest\";\n    }\n\n    public double discountRate() {\n        return 0.0;\n    }\n\n    public void addLoyaltyPoints(int points) {\n        // guests do not collect points: deliberately empty\n    }\n}\n"
          }
        },
        {
          "id": "null-object-gd-weapons",
          "title": "Spaceship with a NullWeapon",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A ship always holds a Weapon. When unarmed it holds a NullWeapon whose fire() does nothing, so the physics loop and the HUD never test for null, even after the weapon is dropped.",
          "roles": {
            "Abstraction": [
              "null-object-gd-weapons/weapon.gd"
            ],
            "Real Object": [
              "null-object-gd-weapons/blaster.gd"
            ],
            "Null Object": [
              "null-object-gd-weapons/null_weapon.gd"
            ],
            "Provider": [
              "null-object-gd-weapons/armory.gd#create"
            ],
            "Client": [
              "null-object-gd-weapons/ship.gd#_physics_process"
            ]
          },
          "trace": [
            {
              "at": "null-object-gd-weapons/ship.gd#_physics_process",
              "say": "Every frame the ship fires if the button is held and updates the HUD. It never asks whether it has a weapon."
            },
            {
              "at": "null-object-gd-weapons/null_weapon.gd#fire",
              "say": "At first the ship holds a NullWeapon, so fire() quietly does nothing."
            },
            {
              "at": "null-object-gd-weapons/null_weapon.gd#ammo_text",
              "say": "The HUD still gets sensible text: 'Unarmed  -'."
            },
            {
              "at": "null-object-gd-weapons/ship.gd#equip",
              "say": "Picking something up asks the Armory for a weapon by id."
            },
            {
              "at": "null-object-gd-weapons/armory.gd#create",
              "say": "Known ids give a real Blaster; unknown ids give a NullWeapon. null is never returned."
            },
            {
              "at": "null-object-gd-weapons/blaster.gd#fire",
              "say": "Now the same weapon.fire() call spawns bullets and counts ammo. The ship's code did not change."
            },
            {
              "at": "null-object-gd-weapons/ship.gd#drop_weapon",
              "say": "Dropping the weapon swaps in a fresh NullWeapon rather than null, so the next frame is still safe."
            }
          ],
          "files": {
            "null-object-gd-weapons/armory.gd": "class_name Armory\nextends RefCounted\n\n# Hands out weapons by id. Unknown ids get a NullWeapon instead of null.\nstatic func create(weapon_id: String) -> Weapon:\n\tmatch weapon_id:\n\t\t\"blaster\":\n\t\t\treturn Blaster.new()\n\t\t_:\n\t\t\treturn NullWeapon.new()\n",
            "null-object-gd-weapons/blaster.gd": "class_name Blaster\nextends Weapon\n\nconst BulletScene := preload(\"res://bullet.tscn\")\nvar ammo := 30\n\nfunc _init() -> void:\n\tdisplay_name = \"Blaster\"\n\nfunc fire(origin: Vector2, direction: Vector2) -> void:\n\tif ammo <= 0:\n\t\treturn\n\tammo -= 1\n\tvar bullet := BulletScene.instantiate()\n\tbullet.position = origin\n\tbullet.velocity = direction * 900.0\n\tEngine.get_main_loop().current_scene.add_child(bullet)\n\nfunc ammo_text() -> String:\n\treturn \"%d / 30\" % ammo\n",
            "null-object-gd-weapons/null_weapon.gd": "class_name NullWeapon\nextends Weapon\n\n# The Null Object: \"no weapon\" that still answers every call, quietly.\nfunc _init() -> void:\n\tdisplay_name = \"Unarmed\"\n\nfunc fire(_origin: Vector2, _direction: Vector2) -> void:\n\tpass # nothing happens, and nobody has to check\n\nfunc ammo_text() -> String:\n\treturn \"-\"\n",
            "null-object-gd-weapons/ship.gd": "extends CharacterBody2D\n\n@onready var hud_label: Label = $HUD/AmmoLabel\nvar weapon: Weapon = NullWeapon.new()\n\nfunc equip(weapon_id: String) -> void:\n\tweapon = Armory.create(weapon_id)\n\nfunc drop_weapon() -> void:\n\tweapon = NullWeapon.new()\n\n# No \"if weapon != null\" checks anywhere in the game loop.\nfunc _physics_process(_delta: float) -> void:\n\tif Input.is_action_pressed(\"fire\"):\n\t\tweapon.fire(global_position, Vector2.UP)\n\thud_label.text = weapon.display_name + \"  \" + weapon.ammo_text()\n",
            "null-object-gd-weapons/weapon.gd": "class_name Weapon\nextends RefCounted\n\n# The common interface. A ship always holds SOME weapon, never null.\nvar display_name := \"weapon\"\n\nfunc fire(_origin: Vector2, _direction: Vector2) -> void:\n\tpass\n\nfunc ammo_text() -> String:\n\treturn \"\"\n"
          }
        },
        {
          "id": "null-object-psr-log-real",
          "title": "PSR-3 NullLogger",
          "lang": "PHP",
          "level": "intermediate",
          "source": {
            "repo": "php-fig/log",
            "url": "https://github.com/php-fig/log/blob/3.0.2/src/NullLogger.php",
            "license": "MIT",
            "note": "Files under Psr/Log/ are verbatim from psr/log 3.0.2 (LoggerInterface, LoggerTrait, AbstractLogger, NullLogger). app.php was written for Software City."
          },
          "story": "The standard PHP logging interface ships its own Null Object. Libraries default to NullLogger so their code can log unconditionally; the docblock even says it exists to avoid if ($this->logger) blocks.",
          "roles": {
            "Abstraction": [
              "null-object-psr-log-real/Psr/Log/LoggerInterface.php#LoggerInterface",
              "null-object-psr-log-real/Psr/Log/AbstractLogger.php#AbstractLogger"
            ],
            "Real Object": [
              "null-object-psr-log-real/app.php#EchoLogger"
            ],
            "Null Object": [
              "null-object-psr-log-real/Psr/Log/NullLogger.php#NullLogger"
            ],
            "Provider": [
              "null-object-psr-log-real/app.php#ThumbnailService.__construct"
            ],
            "Client": [
              "null-object-psr-log-real/app.php#ThumbnailService.resize"
            ]
          },
          "trace": [
            {
              "at": "null-object-psr-log-real/app.php#main",
              "say": "main() builds one service without a logger and one with an EchoLogger."
            },
            {
              "at": "null-object-psr-log-real/app.php#ThumbnailService.__construct",
              "say": "The constructor accepts null but stores $logger ?? new NullLogger(). From here on the field is never null."
            },
            {
              "at": "null-object-psr-log-real/app.php#ThumbnailService.resize",
              "say": "resize() logs unconditionally. Not a single if ($this->logger) in the class."
            },
            {
              "at": "null-object-psr-log-real/Psr/Log/LoggerTrait.php#info",
              "say": "info() comes from LoggerTrait and just forwards to log() with the INFO level. Every level works this way."
            },
            {
              "at": "null-object-psr-log-real/Psr/Log/NullLogger.php#log",
              "say": "For the quiet service, log() is NullLogger's: its body is the comment '// noop'. The message vanishes harmlessly."
            },
            {
              "at": "null-object-psr-log-real/app.php#EchoLogger.log",
              "say": "For the chatty service the very same calls reach a real logger and get printed."
            }
          ],
          "files": {
            "null-object-psr-log-real/Psr/Log/AbstractLogger.php": "<?php\n/*\n * Source: psr/log 3.0.2 — https://github.com/php-fig/log/blob/3.0.2/src/AbstractLogger.php\n * MIT License, Copyright (c) 2012 PHP Framework Interoperability Group. Included for study.\n */\n\nnamespace Psr\\Log;\n\n/**\n * This is a simple Logger implementation that other Loggers can inherit from.\n *\n * It simply delegates all log-level-specific methods to the `log` method to\n * reduce boilerplate code that a simple Logger that does the same thing with\n * messages regardless of the error level has to implement.\n */\nabstract class AbstractLogger implements LoggerInterface\n{\n    use LoggerTrait;\n}\n",
            "null-object-psr-log-real/Psr/Log/LoggerInterface.php": "<?php\n/*\n * Source: psr/log 3.0.2 — https://github.com/php-fig/log/blob/3.0.2/src/LoggerInterface.php\n * MIT License, Copyright (c) 2012 PHP Framework Interoperability Group. Included for study.\n */\n\nnamespace Psr\\Log;\n\n/**\n * Describes a logger instance.\n *\n * The message MUST be a string or object implementing __toString().\n *\n * The message MAY contain placeholders in the form: {foo} where foo\n * will be replaced by the context data in key \"foo\".\n *\n * The context array can contain arbitrary data. The only assumption that\n * can be made by implementors is that if an Exception instance is given\n * to produce a stack trace, it MUST be in a key named \"exception\".\n *\n * See https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md\n * for the full interface specification.\n */\ninterface LoggerInterface\n{\n    /**\n     * System is unusable.\n     *\n     * @param mixed[] $context\n     */\n    public function emergency(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Action must be taken immediately.\n     *\n     * Example: Entire website down, database unavailable, etc. This should\n     * trigger the SMS alerts and wake you up.\n     *\n     * @param mixed[] $context\n     */\n    public function alert(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Critical conditions.\n     *\n     * Example: Application component unavailable, unexpected exception.\n     *\n     * @param mixed[] $context\n     */\n    public function critical(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Runtime errors that do not require immediate action but should typically\n     * be logged and monitored.\n     *\n     * @param mixed[] $context\n     */\n    public function error(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Exceptional occurrences that are not errors.\n     *\n     * Example: Use of deprecated APIs, poor use of an API, undesirable things\n     * that are not necessarily wrong.\n     *\n     * @param mixed[] $context\n     */\n    public function warning(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Normal but significant events.\n     *\n     * @param mixed[] $context\n     */\n    public function notice(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Interesting events.\n     *\n     * Example: User logs in, SQL logs.\n     *\n     * @param mixed[] $context\n     */\n    public function info(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Detailed debug information.\n     *\n     * @param mixed[] $context\n     */\n    public function debug(string|\\Stringable $message, array $context = []): void;\n\n    /**\n     * Logs with an arbitrary level.\n     *\n     * @param mixed $level\n     * @param mixed[] $context\n     *\n     * @throws \\Psr\\Log\\InvalidArgumentException\n     */\n    public function log($level, string|\\Stringable $message, array $context = []): void;\n}\n",
            "null-object-psr-log-real/Psr/Log/LoggerTrait.php": "<?php\n/*\n * Source: psr/log 3.0.2 — https://github.com/php-fig/log/blob/3.0.2/src/LoggerTrait.php\n * MIT License, Copyright (c) 2012 PHP Framework Interoperability Group. Included for study.\n */\n\nnamespace Psr\\Log;\n\n/**\n * This is a simple Logger trait that classes unable to extend AbstractLogger\n * (because they extend another class, etc) can include.\n *\n * It simply delegates all log-level-specific methods to the `log` method to\n * reduce boilerplate code that a simple Logger that does the same thing with\n * messages regardless of the error level has to implement.\n */\ntrait LoggerTrait\n{\n    /**\n     * System is unusable.\n     */\n    public function emergency(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::EMERGENCY, $message, $context);\n    }\n\n    /**\n     * Action must be taken immediately.\n     *\n     * Example: Entire website down, database unavailable, etc. This should\n     * trigger the SMS alerts and wake you up.\n     */\n    public function alert(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::ALERT, $message, $context);\n    }\n\n    /**\n     * Critical conditions.\n     *\n     * Example: Application component unavailable, unexpected exception.\n     */\n    public function critical(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::CRITICAL, $message, $context);\n    }\n\n    /**\n     * Runtime errors that do not require immediate action but should typically\n     * be logged and monitored.\n     */\n    public function error(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::ERROR, $message, $context);\n    }\n\n    /**\n     * Exceptional occurrences that are not errors.\n     *\n     * Example: Use of deprecated APIs, poor use of an API, undesirable things\n     * that are not necessarily wrong.\n     */\n    public function warning(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::WARNING, $message, $context);\n    }\n\n    /**\n     * Normal but significant events.\n     */\n    public function notice(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::NOTICE, $message, $context);\n    }\n\n    /**\n     * Interesting events.\n     *\n     * Example: User logs in, SQL logs.\n     */\n    public function info(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::INFO, $message, $context);\n    }\n\n    /**\n     * Detailed debug information.\n     */\n    public function debug(string|\\Stringable $message, array $context = []): void\n    {\n        $this->log(LogLevel::DEBUG, $message, $context);\n    }\n\n    /**\n     * Logs with an arbitrary level.\n     *\n     * @param mixed $level\n     *\n     * @throws \\Psr\\Log\\InvalidArgumentException\n     */\n    abstract public function log($level, string|\\Stringable $message, array $context = []): void;\n}\n",
            "null-object-psr-log-real/Psr/Log/NullLogger.php": "<?php\n/*\n * Source: psr/log 3.0.2 — https://github.com/php-fig/log/blob/3.0.2/src/NullLogger.php\n * MIT License, Copyright (c) 2012 PHP Framework Interoperability Group. Included for study.\n */\n\nnamespace Psr\\Log;\n\n/**\n * This Logger can be used to avoid conditional log calls.\n *\n * Logging should always be optional, and if no logger is provided to your\n * library creating a NullLogger instance to have something to throw logs at\n * is a good way to avoid littering your code with `if ($this->logger) { }`\n * blocks.\n */\nclass NullLogger extends AbstractLogger\n{\n    /**\n     * Logs with an arbitrary level.\n     *\n     * @param mixed[] $context\n     *\n     * @throws \\Psr\\Log\\InvalidArgumentException\n     */\n    public function log($level, string|\\Stringable $message, array $context = []): void\n    {\n        // noop\n    }\n}\n",
            "null-object-psr-log-real/app.php": "<?php\n// Example usage written for Software City (not part of psr/log).\nrequire_once __DIR__ . '/Psr/Log/LoggerInterface.php';\nrequire_once __DIR__ . '/Psr/Log/LoggerTrait.php';\nrequire_once __DIR__ . '/Psr/Log/AbstractLogger.php';\nrequire_once __DIR__ . '/Psr/Log/NullLogger.php';\n\nuse Psr\\Log\\AbstractLogger;\nuse Psr\\Log\\LoggerInterface;\nuse Psr\\Log\\NullLogger;\n\n// A real logger: prints every message with its level.\nclass EchoLogger extends AbstractLogger\n{\n    public function log($level, string|\\Stringable $message, array $context = []): void\n    {\n        echo strtoupper((string) $level) . ': ' . $message . \"\\n\";\n    }\n}\n\n// A library class. Logging is optional, but its code never checks for null.\nclass ThumbnailService\n{\n    private LoggerInterface $logger;\n\n    public function __construct(?LoggerInterface $logger = null)\n    {\n        $this->logger = $logger ?? new NullLogger();\n    }\n\n    public function resize(string $file, int $width): string\n    {\n        $this->logger->info(\"Resizing {$file} to {$width}px\");\n        if ($width > 4000) {\n            $this->logger->warning('Very large thumbnail requested');\n        }\n        return \"thumb_{$width}_{$file}\";\n    }\n}\n\nfunction main(): void\n{\n    $quiet = new ThumbnailService();\n    echo $quiet->resize('cat.jpg', 200) . \"\\n\";\n\n    $chatty = new ThumbnailService(new EchoLogger());\n    echo $chatty->resize('dog.jpg', 5000) . \"\\n\";\n}\n\nmain();\n"
          }
        }
      ]
    },
    {
      "id": "specification",
      "name": "Specification",
      "family": "Behavioral",
      "aka": [
        "Composable predicate",
        "Business rule object",
        "Criteria"
      ],
      "tagline": "Turn each business rule into a small object, then combine rules with and, or and not.",
      "intent": "Wrap a yes/no business rule (is this order big enough? is this flat affordable?) in an object with one method, isSatisfiedBy(candidate). Because every rule has the same shape, composite rules can join them with and, or and not, and the same rule objects can be reused for filtering, validation, or even generating a database query.",
      "analogy": "A flat-hunting checklist made of separate cards: 'rent under 800', '2+ rooms', 'ground floor'. You clip cards together with 'and' or 'or' for each search, and reuse the same cards for the next search.",
      "cityShape": "Look for a short base building (the Specification) and a row of small leaf-rule buildings beside it, each with the same isSatisfiedBy floor at the same height. The And/Or/Not buildings have that floor too, with call pipes looping back into other rules' identical floors, so you see the rule tree as pipes.",
      "roles": [
        {
          "name": "Specification",
          "desc": "The common interface: isSatisfiedBy(candidate) returns true or false. A base class often adds and(), or() and not()."
        },
        {
          "name": "Leaf Rule",
          "desc": "One concrete, named business rule such as RentAtMost(800) or InStock. Easy to test alone."
        },
        {
          "name": "Composite Rule",
          "desc": "And, Or and Not specifications that hold other specifications and combine their answers."
        },
        {
          "name": "Client",
          "desc": "Builds a rule tree from small pieces and uses it to filter, validate or query."
        }
      ],
      "whenToUse": [
        "The same business rule is needed in several places: filtering lists, validating input, choosing records from a database.",
        "Rules are combined in many ways (search filters, eligibility checks) and a method per combination would explode.",
        "Non-programmers think in named rules ('premium customer', 'hazardous goods'), and you want the code to read the same way."
      ],
      "pitfalls": [
        "Overkill for one or two fixed conditions: a plain if-statement or lambda is clearer.",
        "Deep rule trees can be slow in memory and hard to debug; give rules a describe() or toString() so you can print the tree.",
        "If specifications also produce SQL, the in-memory and SQL versions can drift apart. Test both against the same examples."
      ],
      "related": [
        "composite",
        "interpreter",
        "strategy",
        "repository",
        "higher-order-functions"
      ],
      "quiz": [
        {
          "q": "Why do And, Or and Not implement the same interface as the leaf rules?",
          "options": [
            "To save memory",
            "So a combined rule can be used, and combined again, anywhere a single rule can (Composite pattern)",
            "Because the language requires it",
            "So the leaf rules can call them"
          ],
          "answer": 1,
          "why": "Same interface means rule trees nest freely: (A and B) or not C is just another Specification."
        },
        {
          "q": "A repository has findCheapOutdoorInStock, findCheapInStock, findOutdoor... What does Specification offer instead?",
          "options": [
            "One findAll(spec) method that accepts any combination of rules",
            "A cache in front of every method",
            "A separate repository per filter",
            "Deleting the filters"
          ],
          "answer": 0,
          "why": "The caller composes the rule; the repository just evaluates or translates it. New combinations need no new methods."
        }
      ],
      "demos": [
        {
          "id": "specification-py-flats",
          "title": "Flat search with combinable rules",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Three tiny rules (rent, rooms, ground floor) are combined into 'affordable with 2+ rooms, or ground floor'. Notice that the combinators know nothing about flats.",
          "roles": {
            "Specification": [
              "specification-py-flats/spec.py#Specification"
            ],
            "Leaf Rule": [
              "specification-py-flats/rules.py#RentAtMost",
              "specification-py-flats/rules.py#HasRooms",
              "specification-py-flats/rules.py#GroundFloor"
            ],
            "Composite Rule": [
              "specification-py-flats/spec.py#AndSpec",
              "specification-py-flats/spec.py#OrSpec",
              "specification-py-flats/spec.py#NotSpec"
            ],
            "Client": [
              "specification-py-flats/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "specification-py-flats/main.py#main",
              "say": "main() builds the rule tree from small pieces, then checks each flat against it."
            },
            {
              "at": "specification-py-flats/spec.py#Specification.and_",
              "say": "and_() does not check anything yet; it just returns a new AndSpec that remembers both rules."
            },
            {
              "at": "specification-py-flats/spec.py#OrSpec.is_satisfied_by",
              "say": "The outer OR asks its left side first; Python's 'or' skips the right side if the left already passed."
            },
            {
              "at": "specification-py-flats/spec.py#AndSpec.is_satisfied_by",
              "say": "The AND asks both of its rules. Composites only combine answers, they hold no business logic."
            },
            {
              "at": "specification-py-flats/rules.py#RentAtMost.is_satisfied_by",
              "say": "A leaf rule does the real check: rent 780 <= 800, yes."
            },
            {
              "at": "specification-py-flats/rules.py#GroundFloor.is_satisfied_by",
              "say": "For the loft, AND fails, so OR tries GroundFloor: floor 3, no match."
            },
            {
              "at": "specification-py-flats/spec.py#NotSpec.is_satisfied_by",
              "say": "The same GroundFloor rule is reused, wrapped in NOT, for a different search."
            }
          ],
          "files": {
            "specification-py-flats/main.py": "from .rules import GroundFloor, HasRooms, RentAtMost\n\nflats = [\n    {\"name\": \"Old Town loft\", \"rent\": 950, \"rooms\": 2, \"floor\": 3},\n    {\"name\": \"Garden flat\", \"rent\": 780, \"rooms\": 3, \"floor\": 0},\n    {\"name\": \"Station studio\", \"rent\": 520, \"rooms\": 1, \"floor\": 1},\n]\n\n\ndef main():\n    # \"Affordable with 2+ rooms, or anything on the ground floor\" – built from small rules.\n    affordable_family = RentAtMost(800).and_(HasRooms(2))\n    wanted = affordable_family.or_(GroundFloor())\n    for flat in flats:\n        if wanted.is_satisfied_by(flat):\n            print(\"Match:\", flat[\"name\"])\n\n    # The same rules, combined differently, for another search.\n    not_ground = GroundFloor().not_()\n    print([f[\"name\"] for f in flats if not_ground.is_satisfied_by(f)])\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "specification-py-flats/rules.py": "from .spec import Specification\n\n\nclass RentAtMost(Specification):\n    def __init__(self, euros):\n        self.euros = euros\n\n    def is_satisfied_by(self, flat):\n        return flat[\"rent\"] <= self.euros\n\n\nclass HasRooms(Specification):\n    def __init__(self, rooms):\n        self.rooms = rooms\n\n    def is_satisfied_by(self, flat):\n        return flat[\"rooms\"] >= self.rooms\n\n\nclass GroundFloor(Specification):\n    def is_satisfied_by(self, flat):\n        return flat[\"floor\"] == 0\n",
            "specification-py-flats/spec.py": "class Specification:\n    \"\"\"A business rule as an object: ask it whether a candidate passes.\"\"\"\n\n    def is_satisfied_by(self, candidate):\n        raise NotImplementedError\n\n    def and_(self, other):\n        return AndSpec(self, other)\n\n    def or_(self, other):\n        return OrSpec(self, other)\n\n    def not_(self):\n        return NotSpec(self)\n\n\nclass AndSpec(Specification):\n    def __init__(self, left, right):\n        self.left = left\n        self.right = right\n\n    def is_satisfied_by(self, candidate):\n        return self.left.is_satisfied_by(candidate) and self.right.is_satisfied_by(candidate)\n\n\nclass OrSpec(Specification):\n    def __init__(self, left, right):\n        self.left = left\n        self.right = right\n\n    def is_satisfied_by(self, candidate):\n        return self.left.is_satisfied_by(candidate) or self.right.is_satisfied_by(candidate)\n\n\nclass NotSpec(Specification):\n    def __init__(self, inner):\n        self.inner = inner\n\n    def is_satisfied_by(self, candidate):\n        return not self.inner.is_satisfied_by(candidate)\n"
          }
        },
        {
          "id": "specification-cs-shipping",
          "title": "Shipping eligibility rules",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "A shop decides free shipping and express delivery from named rules. Generic Specification<T> gives And/Or/Not, and Describe() prints the rule tree so support staff can see why an order did not qualify.",
          "roles": {
            "Specification": [
              "specification-cs-shipping/Specification.cs#ISpecification",
              "specification-cs-shipping/Specification.cs#Specification"
            ],
            "Leaf Rule": [
              "specification-cs-shipping/OrderRules.cs#MinimumSubtotal",
              "specification-cs-shipping/OrderRules.cs#ShipsTo",
              "specification-cs-shipping/OrderRules.cs#ContainsHazardousGoods",
              "specification-cs-shipping/OrderRules.cs#PremiumMember"
            ],
            "Composite Rule": [
              "specification-cs-shipping/Combinators.cs#AndSpecification",
              "specification-cs-shipping/Combinators.cs#OrSpecification",
              "specification-cs-shipping/Combinators.cs#NotSpecification"
            ],
            "Client": [
              "specification-cs-shipping/ShippingPolicy.cs#ShippingPolicy"
            ]
          },
          "trace": [
            {
              "at": "specification-cs-shipping/ShippingPolicy.cs#ShippingPolicy.ShippingPolicy",
              "say": "The policy composes two rules once: (subtotal >= 50 OR premium) AND domestic, and NOT hazardous AND domestic."
            },
            {
              "at": "specification-cs-shipping/Specification.cs#Specification.Or",
              "say": "Or() wraps this rule and the other one in an OrSpecification. Chaining builds the tree left to right."
            },
            {
              "at": "specification-cs-shipping/ShippingPolicy.cs#ShippingPolicy.Quote",
              "say": "Quote() asks both rule trees about one order. It has no if-chains about countries or totals."
            },
            {
              "at": "specification-cs-shipping/Combinators.cs#AndSpecification.IsSatisfiedBy",
              "say": "The AND root asks its children; && stops early when the left side fails."
            },
            {
              "at": "specification-cs-shipping/OrderRules.cs#ShipsTo.IsSatisfiedBy",
              "say": "Leaf rules hold one fact each. The Greek order fails here, so neither free nor express shipping applies."
            },
            {
              "at": "specification-cs-shipping/Combinators.cs#NotSpecification.IsSatisfiedBy",
              "say": "The battery order is hazardous; NOT flips that to false, so express is refused even for a premium member."
            },
            {
              "at": "specification-cs-shipping/Combinators.cs#AndSpecification.Describe",
              "say": "Describe() walks the same tree to print a readable rule, useful in logs and admin screens."
            }
          ],
          "files": {
            "specification-cs-shipping/Combinators.cs": "// Composites: specifications built from other specifications.\npublic class AndSpecification<T> : Specification<T>\n{\n    private readonly Specification<T> left;\n    private readonly Specification<T> right;\n\n    public AndSpecification(Specification<T> left, Specification<T> right)\n    {\n        this.left = left;\n        this.right = right;\n    }\n\n    public override bool IsSatisfiedBy(T candidate)\n    {\n        return left.IsSatisfiedBy(candidate) && right.IsSatisfiedBy(candidate);\n    }\n\n    public override string Describe()\n    {\n        return $\"({left.Describe()} AND {right.Describe()})\";\n    }\n}\n\npublic class OrSpecification<T> : Specification<T>\n{\n    private readonly Specification<T> left;\n    private readonly Specification<T> right;\n\n    public OrSpecification(Specification<T> left, Specification<T> right)\n    {\n        this.left = left;\n        this.right = right;\n    }\n\n    public override bool IsSatisfiedBy(T candidate)\n    {\n        return left.IsSatisfiedBy(candidate) || right.IsSatisfiedBy(candidate);\n    }\n\n    public override string Describe()\n    {\n        return $\"({left.Describe()} OR {right.Describe()})\";\n    }\n}\n\npublic class NotSpecification<T> : Specification<T>\n{\n    private readonly Specification<T> inner;\n\n    public NotSpecification(Specification<T> inner)\n    {\n        this.inner = inner;\n    }\n\n    public override bool IsSatisfiedBy(T candidate)\n    {\n        return !inner.IsSatisfiedBy(candidate);\n    }\n\n    public override string Describe()\n    {\n        return $\"NOT {inner.Describe()}\";\n    }\n}\n",
            "specification-cs-shipping/Order.cs": "using System.Collections.Generic;\nusing System.Linq;\n\npublic class OrderItem\n{\n    public string Name { get; init; }\n    public decimal Price { get; init; }\n    public bool Hazardous { get; init; }\n}\n\npublic class Order\n{\n    public string Country { get; init; }\n    public bool PremiumMember { get; init; }\n    public List<OrderItem> Items { get; init; } = new List<OrderItem>();\n\n    public decimal Subtotal()\n    {\n        return Items.Sum(i => i.Price);\n    }\n}\n",
            "specification-cs-shipping/OrderRules.cs": "using System.Collections.Generic;\nusing System.Linq;\n\n// Small, named business rules. Each one is easy to test on its own.\npublic class MinimumSubtotal : Specification<Order>\n{\n    private readonly decimal amount;\n\n    public MinimumSubtotal(decimal amount)\n    {\n        this.amount = amount;\n    }\n\n    public override bool IsSatisfiedBy(Order order)\n    {\n        return order.Subtotal() >= amount;\n    }\n\n    public override string Describe()\n    {\n        return $\"subtotal >= {amount} EUR\";\n    }\n}\n\npublic class ShipsTo : Specification<Order>\n{\n    private readonly HashSet<string> countries;\n\n    public ShipsTo(params string[] countries)\n    {\n        this.countries = new HashSet<string>(countries);\n    }\n\n    public override bool IsSatisfiedBy(Order order)\n    {\n        return countries.Contains(order.Country);\n    }\n\n    public override string Describe()\n    {\n        return $\"ships to {string.Join(\"/\", countries)}\";\n    }\n}\n\npublic class ContainsHazardousGoods : Specification<Order>\n{\n    public override bool IsSatisfiedBy(Order order)\n    {\n        return order.Items.Any(i => i.Hazardous);\n    }\n\n    public override string Describe()\n    {\n        return \"contains hazardous goods\";\n    }\n}\n\npublic class PremiumMember : Specification<Order>\n{\n    public override bool IsSatisfiedBy(Order order)\n    {\n        return order.PremiumMember;\n    }\n\n    public override string Describe()\n    {\n        return \"premium member\";\n    }\n}\n",
            "specification-cs-shipping/Program.cs": "using System;\nusing System.Collections.Generic;\n\npublic static class Program\n{\n    public static void Main()\n    {\n        var policy = new ShippingPolicy();\n        Console.WriteLine(policy.ExplainRules());\n\n        var books = new Order { Country = \"DE\", Items = new List<OrderItem> { new OrderItem { Name = \"Novel\", Price = 62m } } };\n        var batteries = new Order { Country = \"AT\", PremiumMember = true, Items = new List<OrderItem> { new OrderItem { Name = \"Lithium pack\", Price = 19m, Hazardous = true } } };\n        var abroad = new Order { Country = \"GR\", Items = new List<OrderItem> { new OrderItem { Name = \"Lamp\", Price = 80m } } };\n\n        foreach (var order in new[] { books, batteries, abroad })\n        {\n            Console.WriteLine(policy.Quote(order));\n        }\n    }\n}\n",
            "specification-cs-shipping/ShippingPolicy.cs": "// The client: composes rules once, then reuses them for every order.\npublic class ShippingPolicy\n{\n    private readonly Specification<Order> freeShipping;\n    private readonly Specification<Order> expressAllowed;\n\n    public ShippingPolicy()\n    {\n        var domestic = new ShipsTo(\"DE\", \"AT\");\n        var hazardous = new ContainsHazardousGoods();\n        freeShipping = new MinimumSubtotal(50m).Or(new PremiumMember()).And(domestic);\n        expressAllowed = hazardous.Not().And(domestic);\n    }\n\n    public string Quote(Order order)\n    {\n        string free = freeShipping.IsSatisfiedBy(order) ? \"free shipping\" : \"paid shipping\";\n        string express = expressAllowed.IsSatisfiedBy(order) ? \"express available\" : \"standard only\";\n        return $\"{order.Country}, {order.Subtotal()} EUR: {free}, {express}\";\n    }\n\n    public string ExplainRules()\n    {\n        return $\"Free if {freeShipping.Describe()}\\nExpress if {expressAllowed.Describe()}\";\n    }\n}\n",
            "specification-cs-shipping/Specification.cs": "// Every rule answers one question about a candidate and can describe itself.\npublic interface ISpecification<T>\n{\n    bool IsSatisfiedBy(T candidate);\n    string Describe();\n}\n\n// Base class that gives every rule the And / Or / Not combinators.\npublic abstract class Specification<T> : ISpecification<T>\n{\n    public abstract bool IsSatisfiedBy(T candidate);\n    public abstract string Describe();\n\n    public Specification<T> And(Specification<T> other)\n    {\n        return new AndSpecification<T>(this, other);\n    }\n\n    public Specification<T> Or(Specification<T> other)\n    {\n        return new OrSpecification<T>(this, other);\n    }\n\n    public Specification<T> Not()\n    {\n        return new NotSpecification<T>(this);\n    }\n}\n"
          }
        },
        {
          "id": "specification-java-sql",
          "title": "Specifications that also write SQL",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "Each rule can both test a Product in memory and render itself as a parameterized SQL condition. The repository has one findAll(spec) method instead of a method per filter combination.",
          "roles": {
            "Specification": [
              "specification-java-sql/Specification.java#Specification",
              "specification-java-sql/CompositeSpecification.java#CompositeSpecification"
            ],
            "Leaf Rule": [
              "specification-java-sql/ProductSpecs.java#InCategory",
              "specification-java-sql/ProductSpecs.java#CheaperThan",
              "specification-java-sql/ProductSpecs.java#InStock"
            ],
            "Composite Rule": [
              "specification-java-sql/CompositeSpecification.java#AndSpec",
              "specification-java-sql/CompositeSpecification.java#OrSpec",
              "specification-java-sql/CompositeSpecification.java#NotSpec"
            ],
            "Client": [
              "specification-java-sql/Main.java#Main.main",
              "specification-java-sql/ProductRepository.java#ProductRepository"
            ]
          },
          "trace": [
            {
              "at": "specification-java-sql/Main.java#Main.main",
              "say": "main() names two rules ('shippable outdoor', 'bargains') and later joins them with orElse() for a third query."
            },
            {
              "at": "specification-java-sql/CompositeSpecification.java#CompositeSpecification.andAlso",
              "say": "andAlso() returns an AndSpec. Because it is itself a CompositeSpecification, the result can be combined again."
            },
            {
              "at": "specification-java-sql/ProductRepository.java#ProductRepository.findAll",
              "say": "findAll() accepts any rule. It renders the SQL and filters rows with the same object."
            },
            {
              "at": "specification-java-sql/CompositeSpecification.java#OrSpec.toSql",
              "say": "Composites render their children inside brackets, so precedence in SQL matches the rule tree."
            },
            {
              "at": "specification-java-sql/ProductSpecs.java#InCategory.toSql",
              "say": "Leaves add their value to params and emit '?': the rule can never inject SQL."
            },
            {
              "at": "specification-java-sql/CompositeSpecification.java#NotSpec.toSql",
              "say": "NOT simply prefixes its inner condition: NOT category = ?."
            },
            {
              "at": "specification-java-sql/ProductSpecs.java#InStock.isSatisfiedBy",
              "say": "In memory, the very same tree filters the list: the tent is outdoor but out of stock, so it is dropped."
            }
          ],
          "files": {
            "specification-java-sql/CompositeSpecification.java": "import java.util.List;\n\n// Base class providing andAlso / orElse / negate (and, or, not), so rules read like sentences.\npublic abstract class CompositeSpecification implements Specification {\n\n    public CompositeSpecification andAlso(Specification other) {\n        return new AndSpec(this, other);\n    }\n\n    public CompositeSpecification orElse(Specification other) {\n        return new OrSpec(this, other);\n    }\n\n    public CompositeSpecification negate() {\n        return new NotSpec(this);\n    }\n}\n\nfinal class AndSpec extends CompositeSpecification {\n    private final Specification left;\n    private final Specification right;\n\n    public AndSpec(Specification left, Specification right) {\n        this.left = left;\n        this.right = right;\n    }\n\n    public boolean isSatisfiedBy(Product product) {\n        return left.isSatisfiedBy(product) && right.isSatisfiedBy(product);\n    }\n\n    public String toSql(List<Object> params) {\n        return \"(\" + left.toSql(params) + \" AND \" + right.toSql(params) + \")\";\n    }\n}\n\nfinal class OrSpec extends CompositeSpecification {\n    private final Specification left;\n    private final Specification right;\n\n    public OrSpec(Specification left, Specification right) {\n        this.left = left;\n        this.right = right;\n    }\n\n    public boolean isSatisfiedBy(Product product) {\n        return left.isSatisfiedBy(product) || right.isSatisfiedBy(product);\n    }\n\n    public String toSql(List<Object> params) {\n        return \"(\" + left.toSql(params) + \" OR \" + right.toSql(params) + \")\";\n    }\n}\n\nfinal class NotSpec extends CompositeSpecification {\n    private final Specification inner;\n\n    public NotSpec(Specification inner) {\n        this.inner = inner;\n    }\n\n    public boolean isSatisfiedBy(Product product) {\n        return !inner.isSatisfiedBy(product);\n    }\n\n    public String toSql(List<Object> params) {\n        return \"NOT \" + inner.toSql(params);\n    }\n}\n",
            "specification-java-sql/Main.java": "import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        ProductRepository repository = new ProductRepository(List.of(\n                new Product(\"Trail shoes\", \"outdoor\", 8900, 4),\n                new Product(\"Tent\", \"outdoor\", 21900, 0),\n                new Product(\"Head torch\", \"outdoor\", 2900, 12),\n                new Product(\"Desk lamp\", \"home\", 3900, 7)));\n\n        // \"Outdoor gear we can ship now, cheap or not\" and \"bargains outside outdoor\".\n        CompositeSpecification shippableOutdoor = new InCategory(\"outdoor\").andAlso(new InStock());\n        CompositeSpecification bargains = new CheaperThan(5000).andAlso(new InCategory(\"outdoor\").negate());\n\n        System.out.println(repository.findAll(shippableOutdoor));\n        System.out.println(repository.findAll(shippableOutdoor.orElse(bargains)));\n    }\n}\n",
            "specification-java-sql/Product.java": "public record Product(String name, String category, int priceCents, int stock) {\n}\n",
            "specification-java-sql/ProductRepository.java": "import java.util.ArrayList;\nimport java.util.List;\n\n// The repository accepts any specification instead of growing findByXAndYOrZ methods.\npublic class ProductRepository {\n    private final List<Product> rows;\n\n    public ProductRepository(List<Product> rows) {\n        this.rows = rows;\n    }\n\n    public String buildQuery(Specification spec, List<Object> params) {\n        return \"SELECT * FROM products WHERE \" + spec.toSql(params);\n    }\n\n    public List<Product> findAll(Specification spec) {\n        List<Object> params = new ArrayList<>();\n        System.out.println(buildQuery(spec, params) + \"  \" + params);\n        List<Product> result = new ArrayList<>();\n        for (Product product : rows) {\n            if (spec.isSatisfiedBy(product)) {\n                result.add(product);\n            }\n        }\n        return result;\n    }\n}\n",
            "specification-java-sql/ProductSpecs.java": "import java.util.List;\n\n// Leaf rules. Values go into params, never into the SQL text (no injection).\nfinal class InCategory extends CompositeSpecification {\n    private final String category;\n\n    public InCategory(String category) {\n        this.category = category;\n    }\n\n    public boolean isSatisfiedBy(Product product) {\n        return product.category().equals(category);\n    }\n\n    public String toSql(List<Object> params) {\n        params.add(category);\n        return \"category = ?\";\n    }\n}\n\nfinal class CheaperThan extends CompositeSpecification {\n    private final int priceCents;\n\n    public CheaperThan(int priceCents) {\n        this.priceCents = priceCents;\n    }\n\n    public boolean isSatisfiedBy(Product product) {\n        return product.priceCents() < priceCents;\n    }\n\n    public String toSql(List<Object> params) {\n        params.add(priceCents);\n        return \"price_cents < ?\";\n    }\n}\n\nfinal class InStock extends CompositeSpecification {\n\n    public boolean isSatisfiedBy(Product product) {\n        return product.stock() > 0;\n    }\n\n    public String toSql(List<Object> params) {\n        return \"stock > 0\";\n    }\n}\n",
            "specification-java-sql/Specification.java": "import java.util.List;\n\n// One rule, two ways to run it: in memory, or translated into a SQL WHERE clause.\npublic interface Specification {\n    boolean isSatisfiedBy(Product product);\n\n    String toSql(List<Object> params);\n}\n"
          }
        }
      ]
    }
  ]
};
