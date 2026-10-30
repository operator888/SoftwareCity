// Family: Game Programming. 6 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Game Programming"
  ],
  "patterns": [
    {
      "id": "update-method",
      "name": "Update Method",
      "family": "Game Programming",
      "aka": [
        "Per-frame update",
        "Tick method",
        "_process",
        "Update()"
      ],
      "tagline": "Each game object has its own update(dt); the world calls it on all of them every frame.",
      "intent": "A game world is full of things that each behave differently: fish swim, crabs scuttle, towers reload. Instead of one giant function that knows how everything moves, each object gets an update(dt) method that simulates one frame of its own behaviour, and the world simply loops over its objects and calls update on each one.",
      "analogy": "A dance teacher claps once per beat. She does not tell each dancer which step to do; every dancer knows their own routine and does the next move on each clap.",
      "cityShape": "Look for one world building whose update floor sends a fan of call pipes to an update floor at the same height in every entity building. Each entity building writes only its own antennas (position, timer, cooldown), so the data pipes stay short and local.",
      "roles": [
        {
          "name": "Game World",
          "desc": "Owns the collection of active objects and, once per frame, calls update on each of them. It also adds and removes objects safely between frames."
        },
        {
          "name": "Entity",
          "desc": "The shared contract: an update(dt) method (in Godot, _process(delta) or _physics_process(delta)) that advances the object by one frame."
        },
        {
          "name": "Concrete Entity",
          "desc": "A real game object that implements update with its own behaviour and keeps its own state (speed, timers, health) between frames."
        }
      ],
      "whenToUse": [
        "Your game has many objects that each need to do a little bit of work every frame, independently of each other.",
        "Behaviour belongs naturally to the object: a bubble knows when it pops, a tower knows when it has reloaded.",
        "In Godot this is the default: every node gets _process and _physics_process. Use them for the node's own behaviour and keep cross-object rules in a parent or manager."
      ],
      "pitfalls": [
        "Forgetting delta: moving by a fixed amount per call ties game speed to frame rate. Always scale by dt.",
        "Adding or removing objects while the world is iterating over them skips or double-updates entries. Queue spawns and remove dead objects after the loop.",
        "Update order matters when objects read each other's state mid-frame: object B sees A's new position but C sees B's old one. Use a double buffer or a separate phase when that matters."
      ],
      "related": [
        "game-loop",
        "ecs",
        "double-buffer",
        "polymorphism"
      ],
      "quiz": [
        {
          "q": "Why does the world call entity.update(dt) instead of moving every object itself?",
          "options": [
            "Because loops over objects are slow",
            "So each object's behaviour lives with its own state and new kinds of objects need no changes to the world",
            "Because Godot forbids managers",
            "So objects never need delta time"
          ],
          "answer": 1,
          "why": "The world only depends on the update contract. A new Crab or Bubble class brings its own update, and the world loop stays untouched (polymorphism)."
        },
        {
          "q": "A tower spawns a projectile during its update. What should the world do with the new projectile?",
          "options": [
            "Insert it into the list immediately so it updates this frame",
            "Keep it in a pending list and add it after the loop finishes",
            "Ignore it until the level restarts",
            "Call its update twice next frame to catch up"
          ],
          "answer": 1,
          "why": "Changing a container while iterating it can skip or crash. Queuing new objects until the frame ends keeps the loop safe and the order predictable."
        }
      ],
      "demos": [
        {
          "id": "update-method-py-aquarium",
          "title": "An aquarium where every creature updates itself",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Fish swim, a crab turns around on its own timer and a bubble pops at the surface. Notice that Aquarium.update never checks what kind of creature it has: it just calls update(dt) on each.",
          "roles": {
            "Game World": [
              "update-method-py-aquarium/aquarium.py#Aquarium"
            ],
            "Entity": [
              "update-method-py-aquarium/entity.py#Entity"
            ],
            "Concrete Entity": [
              "update-method-py-aquarium/creatures.py#Fish",
              "update-method-py-aquarium/creatures.py#Crab",
              "update-method-py-aquarium/creatures.py#Bubble"
            ]
          },
          "trace": [
            {
              "at": "update-method-py-aquarium/main.py#main",
              "say": "main() fills the tank with different creatures, then runs a simple loop that advances the world by dt = 0.5 s per frame."
            },
            {
              "at": "update-method-py-aquarium/aquarium.py#Aquarium.update",
              "say": "The aquarium loops over its list and calls update(dt) on each entity. It knows nothing about swimming or scuttling."
            },
            {
              "at": "update-method-py-aquarium/creatures.py#Fish.update",
              "say": "A fish moves by speed * dt and turns at the glass. Scaling by dt keeps the speed in units per second, not per frame."
            },
            {
              "at": "update-method-py-aquarium/creatures.py#Crab.update",
              "say": "The crab keeps its own timer between frames. That state lives in the object, so the world loop stays simple."
            },
            {
              "at": "update-method-py-aquarium/creatures.py#Bubble.update",
              "say": "The bubble only marks itself dead when it reaches the surface. Deleting itself from the list mid-loop would break the iteration."
            },
            {
              "at": "update-method-py-aquarium/aquarium.py#Aquarium.update",
              "say": "After everyone has updated, the aquarium filters out dead entities in one safe step."
            },
            {
              "at": "update-method-py-aquarium/entity.py#Entity.update",
              "say": "The base update does nothing, which is the right behaviour for a rock. Adding a new creature means writing one class, not editing the loop."
            }
          ],
          "files": {
            "update-method-py-aquarium/aquarium.py": "# The aquarium does not know how fish swim or crabs walk. It only asks everyone to update.\nfrom .entity import Entity\n\n\nclass Aquarium:\n    def __init__(self):\n        self.entities = []\n\n    def add(self, entity: Entity):\n        self.entities.append(entity)\n\n    def update(self, dt):\n        for entity in self.entities:\n            entity.update(dt)\n        # Remove dead objects after the loop, never while iterating over the list.\n        self.entities = [e for e in self.entities if e.alive]\n\n    def describe(self):\n        return \", \".join(f\"{e.name}@({e.x:.1f},{e.y:.1f})\" for e in self.entities)\n",
            "update-method-py-aquarium/creatures.py": "# Each creature decides for itself what one frame of life looks like.\nfrom .entity import Entity\n\nTANK_WIDTH = 20\n\n\nclass Fish(Entity):\n    def __init__(self, name, x, y, speed):\n        super().__init__(name, x, y)\n        self.speed = speed\n\n    def update(self, dt):\n        self.x += self.speed * dt\n        if self.x < 0 or self.x > TANK_WIDTH:\n            self.speed = -self.speed  # bump the glass, turn around\n\n\nclass Crab(Entity):\n    def __init__(self, name, x, y):\n        super().__init__(name, x, y)\n        self.timer = 0.0\n        self.direction = 1\n\n    def update(self, dt):\n        # The crab keeps its own timer: state that lives with the object, not in a manager.\n        self.timer += dt\n        if self.timer >= 2.0:\n            self.timer = 0.0\n            self.direction = -self.direction\n        self.x += self.direction * dt\n\n\nclass Bubble(Entity):\n    def update(self, dt):\n        self.y -= 3 * dt\n        if self.y <= 0:\n            self.alive = False  # popped at the surface; the aquarium removes it later\n",
            "update-method-py-aquarium/entity.py": "# Everything in the tank shares one tiny contract: update(dt) moves it forward by dt seconds.\nclass Entity:\n    def __init__(self, name, x, y):\n        self.name = name\n        self.x = x\n        self.y = y\n        self.alive = True\n\n    def update(self, dt):\n        # A rock or a plant does nothing. Subclasses override this with their own behaviour.\n        return None\n",
            "update-method-py-aquarium/main.py": "# A tiny game loop: fill the tank, then advance the whole world one frame at a time.\nfrom .aquarium import Aquarium\nfrom .entity import Entity\nfrom .creatures import Fish, Crab, Bubble\n\n\ndef main():\n    tank = Aquarium()\n    tank.add(Fish(\"Nemo\", 2, 5, speed=4))\n    tank.add(Fish(\"Dory\", 18, 3, speed=-6))\n    tank.add(Crab(\"Sebastian\", 10, 9))\n    tank.add(Bubble(\"bubble\", 7, 2))\n    tank.add(Entity(\"rock\", 15, 9))\n\n    dt = 0.5\n    for frame in range(6):\n        tank.update(dt)\n        print(f\"frame {frame}: {tank.describe()}\")\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        },
        {
          "id": "update-method-cpp-towers",
          "title": "Tower defense: enemies, towers and projectiles",
          "lang": "C++",
          "level": "intermediate",
          "source": null,
          "story": "World::update calls the virtual update on every entity. Enemies walk, towers reload and fire, projectiles fly and hit. Notice how spawning goes into a pending list and dead objects are removed only after the loop.",
          "roles": {
            "Game World": [
              "update-method-cpp-towers/world.hpp#World"
            ],
            "Entity": [
              "update-method-cpp-towers/entity.hpp#Entity"
            ],
            "Concrete Entity": [
              "update-method-cpp-towers/enemy.hpp#Enemy",
              "update-method-cpp-towers/tower.hpp#Tower",
              "update-method-cpp-towers/projectile.hpp#Projectile"
            ]
          },
          "trace": [
            {
              "at": "update-method-cpp-towers/main.cpp#main",
              "say": "main() spawns two towers and a wave of enemies, then calls world.update with a fixed dt of 1/30 s for 300 frames."
            },
            {
              "at": "update-method-cpp-towers/world.hpp#World.update",
              "say": "One loop, one virtual call per entity. The world never asks 'is this a tower?': each object's own update does the right thing."
            },
            {
              "at": "update-method-cpp-towers/enemy.hpp#Enemy.update",
              "say": "An enemy advances along the path by speed * dt. If it reaches the end, it tells the world to lose a life and marks itself dead."
            },
            {
              "at": "update-method-cpp-towers/tower.hpp#Tower.update",
              "say": "The tower counts down its own cooldown. When ready and an enemy is in range, it spawns a projectile."
            },
            {
              "at": "update-method-cpp-towers/world.hpp#World.spawn",
              "say": "spawn() only appends to a pending list. Pushing into the vector being iterated could invalidate the loop."
            },
            {
              "at": "update-method-cpp-towers/projectile.hpp#Projectile.update",
              "say": "Next frame the projectile updates itself: it flies toward its target spot and deals damage on arrival."
            },
            {
              "at": "update-method-cpp-towers/world.hpp#World.removeDead",
              "say": "After every entity has updated, dead ones are erased in one pass, then the pending spawns join the list for the next frame."
            }
          ],
          "files": {
            "update-method-cpp-towers/enemy.hpp": "// An enemy walks along the path on its own. Reaching the end costs the player a life.\n#pragma once\n#include \"world.hpp\"\n\nclass Enemy : public Entity {\npublic:\n    Enemy(float walkSpeed, int hitPoints)\n    {\n        speed = walkSpeed;\n        health = hitPoints;\n    }\n\n    void update(World& world, float dt) override\n    {\n        position += speed * dt; // scaled by dt: same pace at 30 or 144 fps\n        if (position >= pathLength) {\n            world.loseLife();\n            dead = true;\n        }\n    }\n\n    void takeHit(int damage) override\n    {\n        health -= damage;\n        if (health <= 0) {\n            dead = true;\n        }\n    }\n\n    bool isTargetable() const override\n    {\n        return true;\n    }\n\nprivate:\n    float speed = 0.0f;\n    int health = 0;\n    static constexpr float pathLength = 100.0f;\n};\n",
            "update-method-cpp-towers/entity.hpp": "// The only thing the World knows about anything in the level: it can update itself by dt seconds.\n#pragma once\n\nclass World;\n\nclass Entity {\npublic:\n    virtual ~Entity() = default;\n\n    // Every subclass writes its own behaviour here. Called once per frame by World::update.\n    virtual void update(World& world, float dt) = 0;\n\n    virtual void takeHit(int damage)\n    {\n        (void)damage; // most things ignore hits; enemies override this\n    }\n\n    virtual bool isTargetable() const\n    {\n        return false;\n    }\n\n    bool isDead() const\n    {\n        return dead;\n    }\n\n    float getPosition() const\n    {\n        return position;\n    }\n\nprotected:\n    float position = 0.0f; // distance along the enemy path\n    bool dead = false;\n};\n",
            "update-method-cpp-towers/main.cpp": "// The game loop: spawn a wave, then call World::update with a fixed dt every frame.\n#include <cstdio>\n#include \"world.hpp\"\n#include \"enemy.hpp\"\n#include \"tower.hpp\"\n\nint main()\n{\n    World world;\n    world.spawn(std::make_unique<Tower>(40.0f, 15.0f));\n    world.spawn(std::make_unique<Tower>(75.0f, 15.0f));\n    world.spawn(std::make_unique<Enemy>(12.0f, 6));\n    world.spawn(std::make_unique<Enemy>(20.0f, 4));\n\n    const float dt = 1.0f / 30.0f;\n    for (int frame = 0; frame < 300; ++frame) {\n        world.update(dt);\n        if (frame % 30 == 0) {\n            std::printf(\"t=%.1fs entities=%zu lives=%d\\n\", frame * dt, world.count(), world.getLives());\n        }\n    }\n    return 0;\n}\n",
            "update-method-cpp-towers/projectile.hpp": "// A projectile flies toward a spot on the path and deals damage when it arrives.\n#pragma once\n#include \"world.hpp\"\n\nclass Projectile : public Entity {\npublic:\n    Projectile(float start, float target, int hitDamage)\n    {\n        position = start;\n        destination = target;\n        damage = hitDamage;\n    }\n\n    void update(World& world, float dt) override\n    {\n        float step = flySpeed * dt;\n        float remaining = destination - position;\n        if (remaining <= step && remaining >= -step) {\n            world.damageNear(destination, damage);\n            dead = true; // its job is done; the world removes it after this frame\n            return;\n        }\n        position += (remaining > 0.0f) ? step : -step;\n    }\n\nprivate:\n    float destination = 0.0f;\n    int damage = 0;\n    static constexpr float flySpeed = 60.0f;\n};\n",
            "update-method-cpp-towers/tower.hpp": "// A tower keeps its own reload timer and fires when an enemy is in range.\n#pragma once\n#include \"world.hpp\"\n#include \"projectile.hpp\"\n\nclass Tower : public Entity {\npublic:\n    Tower(float placedAt, float shootRange)\n    {\n        position = placedAt;\n        range = shootRange;\n    }\n\n    void update(World& world, float dt) override\n    {\n        cooldown -= dt;\n        if (cooldown > 0.0f) {\n            return;\n        }\n        Entity* target = world.findTarget(position, range);\n        if (target != nullptr) {\n            // Spawning during an update is safe: World queues it until the frame ends.\n            world.spawn(std::make_unique<Projectile>(position, target->getPosition(), 2));\n            cooldown = reloadSeconds;\n        }\n    }\n\nprivate:\n    float range = 0.0f;\n    float cooldown = 0.0f;\n    static constexpr float reloadSeconds = 0.8f;\n};\n",
            "update-method-cpp-towers/world.hpp": "// The World owns every entity and runs the update loop. It never asks \"what kind of object is this?\".\n#pragma once\n#include <memory>\n#include <vector>\n#include <algorithm>\n#include \"entity.hpp\"\n\nclass World {\npublic:\n    void spawn(std::unique_ptr<Entity> entity)\n    {\n        // New objects wait in a side list so the loop below never sees the vector change under it.\n        pending.push_back(std::move(entity));\n    }\n\n    void update(float dt)\n    {\n        for (auto& entity : entities) {\n            entity->update(*this, dt);\n        }\n        removeDead();\n        for (auto& entity : pending) {\n            entities.push_back(std::move(entity));\n        }\n        pending.clear();\n    }\n\n    Entity* findTarget(float from, float range)\n    {\n        for (auto& entity : entities) {\n            float distance = entity->getPosition() - from;\n            if (entity->isTargetable() && !entity->isDead() && distance >= -range && distance <= range) {\n                return entity.get();\n            }\n        }\n        return nullptr;\n    }\n\n    void damageNear(float where, int damage)\n    {\n        Entity* target = findTarget(where, 3.0f);\n        if (target != nullptr) {\n            target->takeHit(damage);\n        }\n    }\n\n    void loseLife()\n    {\n        lives -= 1;\n    }\n\n    int getLives() const\n    {\n        return lives;\n    }\n\n    std::size_t count() const\n    {\n        return entities.size();\n    }\n\nprivate:\n    void removeDead()\n    {\n        entities.erase(std::remove_if(entities.begin(), entities.end(),\n            [](const std::unique_ptr<Entity>& e) { return e->isDead(); }), entities.end());\n    }\n\n    std::vector<std::unique_ptr<Entity>> entities;\n    std::vector<std::unique_ptr<Entity>> pending;\n    int lives = 3;\n};\n"
          }
        },
        {
          "id": "update-method-pong-real",
          "title": "Godot Pong: each node moves itself in _process",
          "lang": "GDScript",
          "level": "intermediate",
          "source": {
            "repo": "godotengine/godot-demo-projects",
            "url": "https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/pong/logic/ball.gd",
            "license": "MIT",
            "note": "logic/ball.gd, paddle.gd, wall.gd and ceiling_floor.gd are verbatim from the 2D Pong demo at tag 4.7-6ad6167 (2d/pong/logic/). Only the two-line source header was added. The scene file that wires the nodes is not included."
          },
          "story": "The official Godot Pong demo. There is no game manager: Godot itself is the world and calls _process on every node each frame. The ball and the paddles each update themselves; walls only react to collisions.",
          "roles": {
            "Entity": [
              "update-method-pong-real/logic/ball.gd#_process",
              "update-method-pong-real/logic/paddle.gd#_process"
            ],
            "Concrete Entity": [
              "update-method-pong-real/logic/ball.gd",
              "update-method-pong-real/logic/paddle.gd"
            ]
          },
          "trace": [
            {
              "at": "update-method-pong-real/logic/paddle.gd#_ready",
              "say": "Each paddle builds its own input action names from its node name, so one script can drive both the left and the right paddle."
            },
            {
              "at": "update-method-pong-real/logic/paddle.gd#_process",
              "say": "Godot (the Game World here) calls _process on every node each frame. The paddle reads its input and moves itself, scaled by delta."
            },
            {
              "at": "update-method-pong-real/logic/ball.gd#_process",
              "say": "The ball's own update: it speeds up a little every frame and moves along direction. Nobody else moves the ball."
            },
            {
              "at": "update-method-pong-real/logic/paddle.gd#_on_area_entered",
              "say": "Collisions are signals, not updates. The paddle only changes the ball's direction; the ball's next _process uses it."
            },
            {
              "at": "update-method-pong-real/logic/ceiling_floor.gd#_on_area_entered",
              "say": "The ceiling and floor have no _process at all: static objects need no per-frame work, so they cost nothing each frame."
            },
            {
              "at": "update-method-pong-real/logic/wall.gd#_on_wall_area_entered",
              "say": "When the ball leaves the field, the wall asks it to reset rather than moving it directly."
            },
            {
              "at": "update-method-pong-real/logic/ball.gd#reset",
              "say": "reset() restores the ball's own state. The ball stays the only owner of its position and speed."
            }
          ],
          "files": {
            "update-method-pong-real/logic/ball.gd": "# Source: godot-demo-projects 4.7-6ad6167 (2D Pong) — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/pong/logic/ball.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Area2D\n\nconst DEFAULT_SPEED = 100.0\n\nvar _speed := DEFAULT_SPEED\nvar direction := Vector2.LEFT\n\n@onready var _initial_pos := position\n\nfunc _process(delta: float) -> void:\n\t_speed += delta * 2\n\tposition += _speed * delta * direction\n\n\nfunc reset() -> void:\n\tdirection = Vector2.LEFT\n\tposition = _initial_pos\n\t_speed = DEFAULT_SPEED\n",
            "update-method-pong-real/logic/ceiling_floor.gd": "# Source: godot-demo-projects 4.7-6ad6167 (2D Pong) — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/pong/logic/ceiling_floor.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Area2D\n\n@export var _bounce_direction := 1\n\nfunc _on_area_entered(area: Area2D) -> void:\n\tif area.name == \"Ball\":\n\t\tarea.direction = (area.direction + Vector2(0, _bounce_direction)).normalized()\n",
            "update-method-pong-real/logic/paddle.gd": "# Source: godot-demo-projects 4.7-6ad6167 (2D Pong) — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/pong/logic/paddle.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Area2D\n\nconst MOVE_SPEED = 100.0\n\nvar _ball_dir: int\nvar _up: String\nvar _down: String\n\n@onready var _screen_size_y := get_viewport_rect().size.y\n\nfunc _ready() -> void:\n\tvar n := String(name).to_lower()\n\t_up = n + \"_move_up\"\n\t_down = n + \"_move_down\"\n\tif n == \"left\":\n\t\t_ball_dir = 1\n\telse:\n\t\t_ball_dir = -1\n\n\nfunc _process(delta: float) -> void:\n\t# Move up and down based on input.\n\tvar input := Input.get_action_strength(_down) - Input.get_action_strength(_up)\n\tposition.y = clamp(position.y + input * MOVE_SPEED * delta, 16, _screen_size_y - 16)\n\n\nfunc _on_area_entered(area: Area2D) -> void:\n\tif area.name == \"Ball\":\n\t\t# Assign new direction.\n\t\tarea.direction = Vector2(_ball_dir, randf() * 2 - 1).normalized()\n",
            "update-method-pong-real/logic/wall.gd": "# Source: godot-demo-projects 4.7-6ad6167 (2D Pong) — https://github.com/godotengine/godot-demo-projects/blob/4.7-6ad6167/2d/pong/logic/wall.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Area2D\n\nfunc _on_wall_area_entered(area: Area2D) -> void:\n\tif area.name == \"Ball\":\n\t\t# Ball went out of bounds, reset.\n\t\tarea.reset()\n"
          }
        }
      ]
    },
    {
      "id": "double-buffer",
      "name": "Double Buffer",
      "family": "Game Programming",
      "aka": [
        "Ping-pong buffer",
        "Front and back buffer",
        "Page flipping"
      ],
      "tagline": "Read the finished frame from one buffer while you write the next frame into another.",
      "intent": "When many things change 'at the same time' (cells in a grid, actors reacting to each other, pixels on screen), updating them in place lets early updates leak into later ones. Keep two copies of the state: everyone reads only the current (front) buffer and writes only the next (back) buffer, then the two swap roles in one cheap step.",
      "analogy": "A flip-book artist draws the next page on a fresh sheet while looking at the previous page. Only when the new page is finished does it go on top of the stack.",
      "cityShape": "Look for a building with two buffer antennas (current and next). The step floor has a read pipe from one and a write pipe to the other, and a small swap floor writes both. Rendering floors only read the current buffer.",
      "roles": [
        {
          "name": "Front Buffer",
          "desc": "The finished state of the current frame. Everyone reads from it, nobody writes to it during the step."
        },
        {
          "name": "Back Buffer",
          "desc": "The scratch state for the next frame. The writer fills it completely while the front buffer stays untouched."
        },
        {
          "name": "Writer",
          "desc": "The update step that computes the next state by reading only the front buffer and writing only the back buffer."
        },
        {
          "name": "Swap",
          "desc": "Exchanges the two buffers when the step is complete, usually by swapping references or an index instead of copying data."
        }
      ],
      "whenToUse": [
        "Cellular automata, heat or fluid grids, falling sand: each new cell depends on its neighbours' old values.",
        "Actors that react to each other in the same tick, where the result must not depend on update order.",
        "Rendering: the screen shows a complete frame while the next one is drawn (Godot and every GPU driver do this for you).",
        "GPU compute: a shader cannot read and write the same texture, so it ping-pongs between two render targets."
      ],
      "pitfalls": [
        "Updating in place by accident: one write to the front buffer during the step brings back order-dependent bugs.",
        "Copying the whole buffer every frame instead of swapping references wastes the time the pattern should save.",
        "Twice the memory: fine for a grid, but think before doubling huge state, and remember to clear or fully overwrite the back buffer."
      ],
      "related": [
        "update-method",
        "game-loop",
        "memento",
        "producer-consumer"
      ],
      "quiz": [
        {
          "q": "In the Game of Life, what goes wrong if you write the new value of each cell straight into the grid you are reading?",
          "options": [
            "Nothing, it just uses less memory",
            "Cells visited later see some neighbours already in the next generation, so the result depends on scan order",
            "The grid becomes too large",
            "Only the edges are wrong"
          ],
          "answer": 1,
          "why": "Every cell of generation N+1 must be computed from generation N. Mixing in already-updated neighbours breaks the rule and makes patterns like the blinker fall apart."
        },
        {
          "q": "What is the cheapest correct way to finish a double-buffered step?",
          "options": [
            "Copy every value from next into current",
            "Swap the two references (or flip an index) so next becomes current",
            "Allocate two new buffers",
            "Clear both buffers"
          ],
          "answer": 1,
          "why": "A swap is O(1). The old front buffer becomes the new scratch buffer and will be fully overwritten in the next step."
        }
      ],
      "demos": [
        {
          "id": "double-buffer-py-life",
          "title": "Game of Life with two grids",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A blinker flips between horizontal and vertical. Life.step reads neighbours only from current and writes only into next, then swap() trades the two grids without copying a single cell.",
          "roles": {
            "Front Buffer": [
              "double-buffer-py-life/grid.py#Grid"
            ],
            "Back Buffer": [
              "double-buffer-py-life/grid.py#Grid"
            ],
            "Writer": [
              "double-buffer-py-life/life.py#Life.step"
            ],
            "Swap": [
              "double-buffer-py-life/life.py#Life.swap"
            ]
          },
          "trace": [
            {
              "at": "double-buffer-py-life/main.py#main",
              "say": "main() switches on three cells in a row in the current grid. That shape, a blinker, should flip every generation."
            },
            {
              "at": "double-buffer-py-life/life.py#Life.__init__",
              "say": "Life keeps two grids of the same size: current (what everyone reads) and next (where the new generation is written)."
            },
            {
              "at": "double-buffer-py-life/life.py#Life.step",
              "say": "step() visits every cell. For each one it counts live neighbours, reading only from current."
            },
            {
              "at": "double-buffer-py-life/life.py#Life.count_neighbours",
              "say": "Neighbours come from the old generation even if they were already visited, because nothing has written to current yet."
            },
            {
              "at": "double-buffer-py-life/grid.py#Grid.set",
              "say": "The result goes into next. Writing it into current would change the neighbour counts of cells still to come."
            },
            {
              "at": "double-buffer-py-life/life.py#Life.swap",
              "say": "swap() exchanges the two references. The new generation becomes current and the old one becomes scratch space."
            }
          ],
          "files": {
            "double-buffer-py-life/grid.py": "# A plain 2D grid of booleans. On its own it knows nothing about buffering.\nclass Grid:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.cells = [[False] * width for _ in range(height)]\n\n    def get(self, x, y):\n        # Cells outside the board count as dead, so edges need no special cases.\n        if 0 <= x < self.width and 0 <= y < self.height:\n            return self.cells[y][x]\n        return False\n\n    def set(self, x, y, alive):\n        self.cells[y][x] = alive\n\n    def to_text(self):\n        return \"\\n\".join(\"\".join(\"#\" if c else \".\" for c in row) for row in self.cells)\n",
            "double-buffer-py-life/life.py": "# Conway's Game of Life with two grids: read only from `current`, write only into `next`.\nfrom .grid import Grid\n\n\nclass Life:\n    def __init__(self, width, height):\n        self.current = Grid(width, height)\n        self.next = Grid(width, height)\n\n    def count_neighbours(self, x, y):\n        total = 0\n        for dy in (-1, 0, 1):\n            for dx in (-1, 0, 1):\n                if (dx or dy) and self.current.get(x + dx, y + dy):\n                    total += 1\n        return total\n\n    def step(self):\n        for y in range(self.current.height):\n            for x in range(self.current.width):\n                n = self.count_neighbours(x, y)\n                alive = self.current.get(x, y)\n                # Writing into self.current here would change the neighbours of cells not yet visited.\n                self.next.set(x, y, n == 3 or (alive and n == 2))\n        self.swap()\n\n    def swap(self):\n        # No copying: the two grids simply trade roles. The old frame becomes scratch space.\n        self.current, self.next = self.next, self.current\n",
            "double-buffer-py-life/main.py": "# A \"blinker\": three cells in a row flip between horizontal and vertical forever.\nfrom .life import Life\n\n\ndef main():\n    life = Life(5, 5)\n    for x in (1, 2, 3):\n        life.current.set(x, 2, True)\n\n    for generation in range(3):\n        print(f\"generation {generation}\")\n        print(life.current.to_text())\n        life.step()\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        },
        {
          "id": "double-buffer-gd-slapstick",
          "title": "Godot slapstick stage: order-independent reactions",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Three comedians stand in a ring and pass a slap along. Each beat, everyone reacts to what happened last beat, then everyone swaps. Turn on shuffle_order: the slap still moves exactly one actor per beat.",
          "roles": {
            "Front Buffer": [
              "double-buffer-gd-slapstick/actor.gd#was_slapped"
            ],
            "Back Buffer": [
              "double-buffer-gd-slapstick/actor.gd#slap"
            ],
            "Writer": [
              "double-buffer-gd-slapstick/comedian.gd#on_beat"
            ],
            "Swap": [
              "double-buffer-gd-slapstick/actor.gd#swap",
              "double-buffer-gd-slapstick/stage.gd#_swap_all"
            ]
          },
          "trace": [
            {
              "at": "double-buffer-gd-slapstick/stage.gd#_ready",
              "say": "The stage arranges three actors in a ring, gives Harry the first slap and swaps once so it becomes visible."
            },
            {
              "at": "double-buffer-gd-slapstick/stage.gd#_on_beat",
              "say": "Each beat has two phases: every actor runs on_beat(), and only then does everyone swap. The phases never interleave."
            },
            {
              "at": "double-buffer-gd-slapstick/comedian.gd#on_beat",
              "say": "A comedian asks was_slapped(), which reads the front buffer: what happened last beat, not what happened earlier this beat."
            },
            {
              "at": "double-buffer-gd-slapstick/actor.gd#slap",
              "say": "slap() writes only _next_slapped. If the victim updates later in this same loop, it still sees false and does not react yet."
            },
            {
              "at": "double-buffer-gd-slapstick/stage.gd#_swap_all",
              "say": "After everyone has acted, _swap_all() asks each actor to swap, publishing all the slaps of this beat at once."
            },
            {
              "at": "double-buffer-gd-slapstick/actor.gd#swap",
              "say": "swap() moves next into current and clears next for the coming beat. Two booleans are cheap enough to copy."
            },
            {
              "at": "double-buffer-gd-slapstick/comedian.gd#_process",
              "say": "Drawing runs every frame but reads only the front buffer, so the red flash always matches a completed beat."
            }
          ],
          "files": {
            "double-buffer-gd-slapstick/actor.gd": "# Base class for everyone on stage. The \"was I slapped?\" state is double-buffered:\n# reactions READ _current_slapped and WRITE _next_slapped, so update order cannot leak into this beat.\nclass_name Actor\nextends Node2D\n\nvar facing: Actor\nvar _current_slapped := false\nvar _next_slapped := false\n\nfunc slap() -> void:\n\t# Only the back buffer changes. The victim will notice on the NEXT beat, after the swap.\n\t_next_slapped = true\n\nfunc was_slapped() -> bool:\n\treturn _current_slapped\n\nfunc swap() -> void:\n\t_current_slapped = _next_slapped\n\t_next_slapped = false\n\n# Called once per beat by the stage. Subclasses decide how to react.\nfunc on_beat() -> void:\n\tpass\n",
            "double-buffer-gd-slapstick/comedian.gd": "# A comedian passes every slap on to whoever they are facing.\nextends Actor\n\nfunc on_beat() -> void:\n\tif was_slapped():\n\t\tprint(\"%s was slapped and slaps %s\" % [name, facing.name])\n\t\tfacing.slap()\n\n# Drawing reads only the front buffer, so the screen never shows a half-finished beat.\nfunc _process(_delta: float) -> void:\n\tmodulate = Color.RED if was_slapped() else Color.WHITE\n",
            "double-buffer-gd-slapstick/stage.gd": "# The stage runs the show: on each beat, first every actor updates, then every actor swaps.\nextends Node2D\n\n@export var shuffle_order := false\n\nvar actors: Array[Actor] = []\n\n@onready var beat_timer: Timer = $BeatTimer\n\nfunc _ready() -> void:\n\tfor child in $Actors.get_children():\n\t\tactors.append(child)\n\t# A ring: Harry faces Baldy, Baldy faces Chump, Chump faces Harry.\n\tactors[0].facing = actors[1]\n\tactors[1].facing = actors[2]\n\tactors[2].facing = actors[0]\n\tactors[0].slap()\n\t_swap_all()\n\tbeat_timer.timeout.connect(_on_beat)\n\nfunc _on_beat() -> void:\n\t# Try shuffle_order = true: the slap still moves exactly one actor per beat.\n\t# Without the double buffer, the right order would let it race around the whole ring in one beat.\n\tif shuffle_order:\n\t\tactors.shuffle()\n\tfor actor in actors:\n\t\tactor.on_beat()\n\t_swap_all()\n\nfunc _swap_all() -> void:\n\tfor actor in actors:\n\t\tactor.swap()\n"
          }
        },
        {
          "id": "double-buffer-threejs-real",
          "title": "three.js GPUComputationRenderer: ping-pong render targets",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "mrdoob/three.js",
            "url": "https://github.com/mrdoob/three.js/blob/r186/examples/jsm/misc/GPUComputationRenderer.js",
            "license": "MIT",
            "note": "three/GPUComputationRenderer.js is verbatim from three.js r186 with usage docs, dependency checks, small helpers and shader strings trimmed (marked). life.js and main.js were written for Software City."
          },
          "story": "Each compute variable gets two render targets. compute() renders the next state from the current texture into the other target, then flips currentTextureIndex. life.js uses it to run Game of Life on the GPU.",
          "roles": {
            "Front Buffer": [
              "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.getCurrentRenderTarget"
            ],
            "Back Buffer": [
              "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.getAlternateRenderTarget"
            ],
            "Writer": [
              "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.doRenderTarget",
              "double-buffer-threejs-real/life.js#lifeShader"
            ],
            "Swap": [
              "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.compute"
            ]
          },
          "trace": [
            {
              "at": "double-buffer-threejs-real/life.js#createLife",
              "say": "createLife() adds one variable, textureCells, and makes it depend on itself: each generation is computed from the previous one."
            },
            {
              "at": "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.init",
              "say": "init() creates TWO render targets per variable and copies the starting texture into both. A shader cannot read and write one texture."
            },
            {
              "at": "double-buffer-threejs-real/main.js#main",
              "say": "Every animation frame calls step(), then draws whatever texture it returns."
            },
            {
              "at": "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.compute",
              "say": "compute() binds the CURRENT texture as the shader input and picks the other index as the output: read front, write back."
            },
            {
              "at": "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.doRenderTarget",
              "say": "doRenderTarget() draws a full-screen quad into the back target. Every cell is computed in parallel from the untouched front."
            },
            {
              "at": "double-buffer-threejs-real/three/GPUComputationRenderer.js#GPUComputationRenderer.compute",
              "say": "The swap is one line: currentTextureIndex = nextTextureIndex. No pixels are copied."
            },
            {
              "at": "double-buffer-threejs-real/life.js#step",
              "say": "getCurrentRenderTarget() now returns the freshly written target, which main.js shows on screen while the old one waits to be overwritten."
            }
          ],
          "files": {
            "double-buffer-threejs-real/life.js": "// Written for Software City (not part of three.js): Conway's Game of Life computed on the GPU.\n// Every texel is one cell. The shader READS last generation's texture and WRITES the other one.\nimport { RepeatWrapping } from 'three';\nimport { GPUComputationRenderer } from './three/GPUComputationRenderer.js';\n\nexport const SIZE = 256;\n\n// GPUComputationRenderer declares `uniform sampler2D textureCells;` for us, because cells depends on itself.\nconst lifeShader =\n\t'void main() {\\n' +\n\t'\tvec2 cell = 1.0 / resolution.xy;\\n' +\n\t'\tvec2 uv = gl_FragCoord.xy * cell;\\n' +\n\t'\tfloat alive = texture2D( textureCells, uv ).r;\\n' +\n\t'\tfloat n = 0.0;\\n' +\n\t'\tfor ( int dy = -1; dy <= 1; dy ++ ) {\\n' +\n\t'\t\tfor ( int dx = -1; dx <= 1; dx ++ ) {\\n' +\n\t'\t\t\tif ( dx == 0 && dy == 0 ) continue;\\n' +\n\t'\t\t\tn += texture2D( textureCells, uv + vec2( float( dx ), float( dy ) ) * cell ).r;\\n' +\n\t'\t\t}\\n' +\n\t'\t}\\n' +\n\t'\tfloat next = ( n == 3.0 || ( alive > 0.5 && n == 2.0 ) ) ? 1.0 : 0.0;\\n' +\n\t'\tgl_FragColor = vec4( next, next, next, 1.0 );\\n' +\n\t'}\\n';\n\nexport function seed( texture ) {\n\tconst data = texture.image.data;\n\tfor ( let i = 0; i < data.length; i += 4 ) {\n\t\tdata[ i ] = Math.random() < 0.25 ? 1 : 0;\n\t\tdata[ i + 3 ] = 1;\n\t}\n}\n\nexport function createLife( renderer ) {\n\tconst gpuCompute = new GPUComputationRenderer( SIZE, SIZE, renderer );\n\tconst initial = gpuCompute.createTexture();\n\tseed( initial );\n\tconst cells = gpuCompute.addVariable( 'textureCells', lifeShader, initial );\n\t// The variable depends on itself: generation N+1 is computed from generation N.\n\tgpuCompute.setVariableDependencies( cells, [ cells ] );\n\tcells.wrapS = RepeatWrapping;\n\tcells.wrapT = RepeatWrapping;\n\tconst error = gpuCompute.init();\n\tif ( error !== null ) {\n\t\tthrow new Error( error );\n\t}\n\treturn { gpuCompute, cells };\n}\n\nexport function step( life ) {\n\tlife.gpuCompute.compute();\n\t// After compute() the \"current\" target is the one that was just written.\n\treturn life.gpuCompute.getCurrentRenderTarget( life.cells ).texture;\n}\n",
            "double-buffer-threejs-real/main.js": "// Written for Software City (not part of three.js): one generation per frame, then show the fresh texture.\nimport * as THREE from 'three';\nimport { createLife, step } from './life.js';\n\nfunction main() {\n\tconst renderer = new THREE.WebGLRenderer();\n\trenderer.setSize( 512, 512 );\n\tdocument.body.appendChild( renderer.domElement );\n\n\tconst life = createLife( renderer );\n\tconst material = new THREE.MeshBasicMaterial();\n\tconst scene = new THREE.Scene();\n\tscene.add( new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material ) );\n\tconst camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );\n\n\tfunction animate() {\n\t\tmaterial.map = step( life );\n\t\trenderer.render( scene, camera );\n\t}\n\n\trenderer.setAnimationLoop( animate );\n}\n\nmain();\n",
            "double-buffer-threejs-real/three/GPUComputationRenderer.js": "// Source: three.js r186 — https://github.com/mrdoob/three.js/blob/r186/examples/jsm/misc/GPUComputationRenderer.js\n// MIT License, Copyright © 2010-2026 three.js authors. Included for study.\nimport {\n\tClampToEdgeWrapping,\n\tDataTexture,\n\tFloatType,\n\tNearestFilter,\n\tRGBAFormat,\n\tShaderMaterial,\n\tWebGLRenderTarget\n} from 'three';\n\nimport { FullScreenQuad } from '../postprocessing/Pass.js';\n\n/**\n * GPUComputationRenderer, based on SimulationRenderer by @zz85.\n *\n * The GPUComputationRenderer uses the concept of variables. These variables are RGBA float textures that hold 4 floats\n * for each compute element (texel).\n *\n * Each variable has a fragment shader that defines the computation made to obtain the variable in question.\n * You can use as many variables you need, and make dependencies so you can use textures of other variables in the shader\n * (the sampler uniforms are added automatically) Most of the variables will need themselves as dependency.\n *\n * The renderer has actually two render targets per variable, to make ping-pong. Textures from the current frame are used\n * as inputs to render the textures of the next frame.\n * … trimmed: 77 lines of usage examples (see life.js for a usage written for Software City) …\n * @three_import import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';\n */\nclass GPUComputationRenderer {\n\n\t/**\n\t * Constructs a new GPU computation renderer.\n\t *\n\t * @param {number} sizeX - Computation problem size is always 2d: sizeX * sizeY elements.\n \t * @param {number} sizeY - Computation problem size is always 2d: sizeX * sizeY elements.\n \t * @param {WebGLRenderer} renderer - The renderer.\n\t */\n\tconstructor( sizeX, sizeY, renderer ) {\n\n\t\tthis.variables = [];\n\n\t\tthis.currentTextureIndex = 0;\n\n\t\tlet dataType = FloatType;\n\n\t\tconst passThruUniforms = {\n\t\t\tpassThruTexture: { value: null }\n\t\t};\n\n\t\tconst passThruShader = createShaderMaterial( getPassThroughFragmentShader(), passThruUniforms );\n\n\t\tconst quad = new FullScreenQuad( passThruShader );\n\n\t\t// … trimmed: 13 lines: setDataType() …\n\t\t/**\n\t\t * Adds a compute variable to the renderer.\n\t\t *\n\t\t * @param {string} variableName - The variable name.\n\t\t * @param {string} computeFragmentShader - The compute (fragment) shader source.\n\t\t * @param {Texture} initialValueTexture - The initial value texture.\n\t\t * @return {Object} The compute variable.\n\t\t */\n\t\tthis.addVariable = function ( variableName, computeFragmentShader, initialValueTexture ) {\n\n\t\t\tconst material = this.createShaderMaterial( computeFragmentShader );\n\n\t\t\tconst variable = {\n\t\t\t\tname: variableName,\n\t\t\t\tinitialValueTexture: initialValueTexture,\n\t\t\t\tmaterial: material,\n\t\t\t\tdependencies: null,\n\t\t\t\trenderTargets: [],\n\t\t\t\twrapS: null,\n\t\t\t\twrapT: null,\n\t\t\t\tminFilter: NearestFilter,\n\t\t\t\tmagFilter: NearestFilter\n\t\t\t};\n\n\t\t\tthis.variables.push( variable );\n\n\t\t\treturn variable;\n\n\t\t};\n\n\t\t/**\n\t\t * Sets variable dependencies.\n\t\t *\n\t\t * @param {Object} variable - The compute variable.\n\t\t * @param {Array<Object>} dependencies - Other compute variables that represents the dependencies.\n\t\t */\n\t\tthis.setVariableDependencies = function ( variable, dependencies ) {\n\n\t\t\tvariable.dependencies = dependencies;\n\n\t\t};\n\n\t\t/**\n\t\t * Initializes the renderer.\n\t\t *\n\t\t * @return {?string} Returns `null` if no errors are detected. Otherwise returns the error message.\n\t\t */\n\t\tthis.init = function () {\n\n\t\t\tif ( renderer.capabilities.maxVertexTextures === 0 ) {\n\n\t\t\t\treturn 'No support for vertex shader textures.';\n\n\t\t\t}\n\n\t\t\tfor ( let i = 0; i < this.variables.length; i ++ ) {\n\n\t\t\t\tconst variable = this.variables[ i ];\n\n\t\t\t\t// Creates rendertargets and initialize them with input texture\n\t\t\t\tvariable.renderTargets[ 0 ] = this.createRenderTarget( sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter );\n\t\t\t\tvariable.renderTargets[ 1 ] = this.createRenderTarget( sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter );\n\t\t\t\tthis.renderTexture( variable.initialValueTexture, variable.renderTargets[ 0 ] );\n\t\t\t\tthis.renderTexture( variable.initialValueTexture, variable.renderTargets[ 1 ] );\n\n\t\t\t\t// … trimmed: 41 lines: checks each dependency exists and adds a sampler2D uniform for it to the shader …\n\n\t\t\t}\n\n\t\t\tthis.currentTextureIndex = 0;\n\n\t\t\treturn null;\n\n\t\t};\n\n\t\t/**\n\t\t * Executes the compute. This method is usually called in the animation loop.\n\t\t */\n\t\tthis.compute = function () {\n\n\t\t\tconst currentTextureIndex = this.currentTextureIndex;\n\t\t\tconst nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;\n\n\t\t\tfor ( let i = 0, il = this.variables.length; i < il; i ++ ) {\n\n\t\t\t\tconst variable = this.variables[ i ];\n\n\t\t\t\t// Sets texture dependencies uniforms\n\t\t\t\tif ( variable.dependencies !== null ) {\n\n\t\t\t\t\tconst uniforms = variable.material.uniforms;\n\n\t\t\t\t\tfor ( let d = 0, dl = variable.dependencies.length; d < dl; d ++ ) {\n\n\t\t\t\t\t\tconst depVar = variable.dependencies[ d ];\n\n\t\t\t\t\t\tuniforms[ depVar.name ].value = depVar.renderTargets[ currentTextureIndex ].texture;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\t// Performs the computation for this variable\n\t\t\t\tthis.doRenderTarget( variable.material, variable.renderTargets[ nextTextureIndex ] );\n\n\t\t\t}\n\n\t\t\tthis.currentTextureIndex = nextTextureIndex;\n\n\t\t};\n\n\t\t/**\n\t\t * Returns the current render target for the given compute variable.\n\t\t *\n\t\t * @param {Object} variable - The compute variable.\n\t\t * @return {WebGLRenderTarget} The current render target.\n\t\t */\n\t\tthis.getCurrentRenderTarget = function ( variable ) {\n\n\t\t\treturn variable.renderTargets[ this.currentTextureIndex ];\n\n\t\t};\n\n\t\t/**\n\t\t * Returns the alternate render target for the given compute variable.\n\t\t *\n\t\t * @param {Object} variable - The compute variable.\n\t\t * @return {WebGLRenderTarget} The alternate render target.\n\t\t */\n\t\tthis.getAlternateRenderTarget = function ( variable ) {\n\n\t\t\treturn variable.renderTargets[ this.currentTextureIndex === 0 ? 1 : 0 ];\n\n\t\t};\n\n\t\t// … trimmed: 116 lines: dispose(), addResolutionDefine(), createShaderMaterial(), createRenderTarget() and createTexture() helpers …\n\t\t/**\n\t\t * Renders the given texture into the given render target.\n\t\t *\n\t\t * @param {Texture} input - The input.\n\t\t * @param {WebGLRenderTarget} output - The output.\n\t\t */\n\t\tthis.renderTexture = function ( input, output ) {\n\n\t\t\tpassThruUniforms.passThruTexture.value = input;\n\n\t\t\tthis.doRenderTarget( passThruShader, output );\n\n\t\t\tpassThruUniforms.passThruTexture.value = null;\n\n\t\t};\n\n\n\t\t/**\n\t\t * Renders the given material into the given render target\n\t\t * with a full-screen pass.\n\t\t *\n\t\t * @param {Material} material - The material.\n\t\t * @param {WebGLRenderTarget} output - The output.\n\t\t */\n\t\tthis.doRenderTarget = function ( material, output ) {\n\n\t\t\tconst currentRenderTarget = renderer.getRenderTarget();\n\n\t\t\tconst currentXrEnabled = renderer.xr.enabled;\n\t\t\tconst currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;\n\n\t\t\trenderer.xr.enabled = false; // Avoid camera modification\n\t\t\trenderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows\n\t\t\tquad.material = material;\n\t\t\trenderer.setRenderTarget( output );\n\t\t\tquad.render( renderer );\n\t\t\tquad.material = passThruShader;\n\n\t\t\trenderer.xr.enabled = currentXrEnabled;\n\t\t\trenderer.shadowMap.autoUpdate = currentShadowAutoUpdate;\n\n\t\t\trenderer.setRenderTarget( currentRenderTarget );\n\n\t\t};\n\n\t\t// … trimmed: 25 lines: the pass-through vertex and fragment shader sources …\n\n\t}\n\n}\n\nexport { GPUComputationRenderer };\n"
          }
        }
      ]
    },
    {
      "id": "spatial-partition",
      "name": "Spatial Partition",
      "family": "Game Programming",
      "aka": [
        "Spatial hash",
        "Uniform grid",
        "Quadtree",
        "Broad phase"
      ],
      "tagline": "Sort objects by where they are, so 'what is near me?' only looks at nearby buckets.",
      "intent": "Finding neighbours or collisions by comparing every object with every other costs n×n checks, which explodes with hundreds of objects. A spatial partition files each object into a region (a grid cell or a tree node) by its position. A query then visits only the regions around the point of interest and does exact tests on the few candidates it finds there.",
      "analogy": "A library shelves books by subject. To find books about volcanoes you walk to the geology shelf, you do not read the title of every book in the building.",
      "cityShape": "Look for a partition building with insert, query and clear floors and a buckets or nodes antenna that insert writes and query reads. The game building calls clear and insert once per frame, then query in a loop; only the query results flow on to the exact distance or overlap test.",
      "roles": [
        {
          "name": "Partition",
          "desc": "The structure that divides space into regions (a fixed grid, or a quadtree that splits crowded regions) and files objects into them."
        },
        {
          "name": "Region",
          "desc": "One grid cell or tree node: a bucket holding the objects whose position falls inside it."
        },
        {
          "name": "Query",
          "desc": "Asks for the objects in the regions around a point or box. It returns candidates; the caller still does the precise test (the narrow phase)."
        },
        {
          "name": "Client",
          "desc": "Game code that keeps the partition in sync with moving objects (rebuild or move) and uses queries instead of all-pairs loops."
        }
      ],
      "whenToUse": [
        "Many objects need neighbour or collision checks every frame: bullets vs enemies, boids, crowds, particles.",
        "Proximity queries on a large map: 'who is within 10 m?', aggro radius, picking what is under the mouse.",
        "Objects are spread out: a uniform grid suits evenly sized, evenly spread objects; a quadtree adapts when some areas are crowded.",
        "In Godot, physics bodies and Area2D already use a broad phase internally; roll your own for plain nodes, data-only entities or huge bullet counts."
      ],
      "pitfalls": [
        "Forgetting to update the partition when an object moves: queries silently miss it. Rebuild each frame or move it between buckets.",
        "A bad cell size: too small and objects span many cells, too large and each cell holds everything again. Start near the typical query radius.",
        "Treating candidates as hits. A partition only narrows the search; you still need the exact distance or overlap test."
      ],
      "related": [
        "hash-table",
        "trees",
        "update-method",
        "flyweight"
      ],
      "quiz": [
        {
          "q": "1,000 bullets and 1,000 enemies are spread evenly over a grid. Roughly how does the work change compared with testing every pair?",
          "options": [
            "It stays at about 1,000,000 checks",
            "Each bullet only checks the few enemies in its nearby cells, so the total drops to a few thousand",
            "It becomes exactly 2,000 checks",
            "It gets worse because of the grid overhead"
          ],
          "answer": 1,
          "why": "All-pairs is n×m. With a grid, each bullet sees only the enemies in a handful of cells, so the cost grows with the number of objects, not with its square."
        },
        {
          "q": "query() returned five enemies near a bullet. What should the game do next?",
          "options": [
            "Damage all five",
            "Run the exact distance or overlap test on each of the five",
            "Ask the grid again with a smaller cell size",
            "Nothing, the grid already checked collisions"
          ],
          "answer": 1,
          "why": "The partition is the broad phase: it returns candidates that share a region. The narrow phase decides which ones really touch."
        }
      ],
      "demos": [
        {
          "id": "spatial-partition-cs-park",
          "title": "Who is near me in the park?",
          "lang": "C#",
          "level": "beginner",
          "source": null,
          "story": "5,000 visitors stand in a park divided into 10 m cells. FindNear looks only at the 3×3 cells around Ada and prints how many checks that took, next to the brute-force count.",
          "roles": {
            "Partition": [
              "spatial-partition-cs-park/SpatialGrid.cs#SpatialGrid"
            ],
            "Region": [
              "spatial-partition-cs-park/SpatialGrid.cs#Cell"
            ],
            "Query": [
              "spatial-partition-cs-park/SpatialGrid.cs#SpatialGrid.FindNear"
            ],
            "Client": [
              "spatial-partition-cs-park/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "spatial-partition-cs-park/Program.cs#Program.Main",
              "say": "Main() scatters 5,000 people over a 1 km park and files each one into a grid with 10 m cells."
            },
            {
              "at": "spatial-partition-cs-park/SpatialGrid.cs#SpatialGrid.Add",
              "say": "Add() works out the person's cell and appends them to that cell's list. The dictionary only stores cells that have someone in them."
            },
            {
              "at": "spatial-partition-cs-park/SpatialGrid.cs#SpatialGrid.CellOf",
              "say": "CellOf() turns a position into cell coordinates by dividing by the cell size and rounding down. Nearby people share a key."
            },
            {
              "at": "spatial-partition-cs-park/SpatialGrid.cs#SpatialGrid.FindNear",
              "say": "FindNear() visits only the block of cells a 10 m circle can reach, then does the exact distance test on those few people."
            },
            {
              "at": "spatial-partition-cs-park/Program.cs#Program.FindNearBruteForce",
              "say": "For comparison, the brute-force version measures the distance to all 5,001 people. Same answer, hundreds of times the work."
            },
            {
              "at": "spatial-partition-cs-park/SpatialGrid.cs#SpatialGrid.Move",
              "say": "When Ada walks away, Move() only touches the buckets if she crossed a cell border. Otherwise the grid stays as it is."
            }
          ],
          "files": {
            "spatial-partition-cs-park/Person.cs": "// Someone standing in the park. They only know where they are.\nusing System;\n\npublic class Person\n{\n    public string Name { get; }\n    public float X { get; set; }\n    public float Y { get; set; }\n\n    public Person(string name, float x, float y)\n    {\n        Name = name;\n        X = x;\n        Y = y;\n    }\n\n    public float DistanceTo(Person other)\n    {\n        float dx = other.X - X;\n        float dy = other.Y - Y;\n        return MathF.Sqrt(dx * dx + dy * dy);\n    }\n}\n",
            "spatial-partition-cs-park/Program.cs": "// 5,000 people in a 1 km park. Who is within 10 m of Ada? Compare the grid with checking everyone.\nusing System;\nusing System.Collections.Generic;\n\npublic static class Program\n{\n    public static List<Person> FindNearBruteForce(List<Person> everyone, Person who, float radius)\n    {\n        var found = new List<Person>();\n        foreach (var other in everyone)\n        {\n            if (other != who && who.DistanceTo(other) <= radius)\n            {\n                found.Add(other);\n            }\n        }\n        return found;\n    }\n\n    public static void Main()\n    {\n        var random = new Random(42);\n        var grid = new SpatialGrid(10f);\n        var everyone = new List<Person>();\n        for (int i = 0; i < 5000; i++)\n        {\n            var person = new Person(\"visitor\" + i, random.NextSingle() * 1000f, random.NextSingle() * 1000f);\n            everyone.Add(person);\n            grid.Add(person);\n        }\n        var ada = new Person(\"Ada\", 500f, 500f);\n        everyone.Add(ada);\n        grid.Add(ada);\n\n        var near = grid.FindNear(ada, 10f);\n        Console.WriteLine($\"Grid: {near.Count} people nearby, {grid.ChecksLastQuery} distance checks\");\n        var slow = FindNearBruteForce(everyone, ada, 10f);\n        Console.WriteLine($\"Brute force: {slow.Count} people nearby, {everyone.Count} distance checks\");\n\n        grid.Move(ada, 120f, 80f);\n        Console.WriteLine($\"After moving: {grid.FindNear(ada, 10f).Count} people near Ada\");\n    }\n}\n",
            "spatial-partition-cs-park/SpatialGrid.cs": "// Splits the park into square cells. Each cell keeps a list of the people standing in it.\nusing System;\nusing System.Collections.Generic;\n\n// The coordinates of one cell. A record compares by value, so it works as a dictionary key.\npublic record Cell(int X, int Y);\n\npublic class SpatialGrid\n{\n    private readonly float cellSize;\n    private readonly Dictionary<Cell,List<Person>> cells = new();\n\n    public int ChecksLastQuery { get; private set; }\n\n    public SpatialGrid(float cellSize)\n    {\n        this.cellSize = cellSize;\n    }\n\n    private Cell CellOf(float x, float y)\n    {\n        return new Cell((int)MathF.Floor(x / cellSize), (int)MathF.Floor(y / cellSize));\n    }\n\n    public void Add(Person person)\n    {\n        var key = CellOf(person.X, person.Y);\n        if (!cells.TryGetValue(key, out var list))\n        {\n            list = new List<Person>();\n            cells[key] = list;\n        }\n        list.Add(person);\n    }\n\n    public void Move(Person person, float newX, float newY)\n    {\n        var oldKey = CellOf(person.X, person.Y);\n        person.X = newX;\n        person.Y = newY;\n        // Only crossing a cell border costs anything: remove from the old bucket, add to the new one.\n        if (oldKey != CellOf(newX, newY))\n        {\n            cells[oldKey].Remove(person);\n            Add(person);\n        }\n    }\n\n    public List<Person> FindNear(Person who, float radius)\n    {\n        var found = new List<Person>();\n        ChecksLastQuery = 0;\n        Cell center = CellOf(who.X, who.Y);\n        int reach = (int)MathF.Ceiling(radius / cellSize);\n        // Look only at the block of cells the circle can touch, not at the whole park.\n        for (int dy = -reach; dy <= reach; dy++)\n        {\n            for (int dx = -reach; dx <= reach; dx++)\n            {\n                if (!cells.TryGetValue(new Cell(center.X + dx, center.Y + dy), out var bucket))\n                {\n                    continue;\n                }\n                foreach (var other in bucket)\n                {\n                    ChecksLastQuery++;\n                    if (other != who && who.DistanceTo(other) <= radius)\n                    {\n                        found.Add(other);\n                    }\n                }\n            }\n        }\n        return found;\n    }\n}\n"
          }
        },
        {
          "id": "spatial-partition-gd-bullets",
          "title": "Godot bullet hell with a spatial hash",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Bullets and enemies are plain Node2Ds, without physics bodies. Every physics frame the arena rebuilds a 64 px grid from enemy positions, and each bullet queries only the cells around it. The HUD shows grid checks versus every pair.",
          "roles": {
            "Partition": [
              "spatial-partition-gd-bullets/spatial_hash.gd"
            ],
            "Region": [
              "spatial-partition-gd-bullets/spatial_hash.gd#cell_of"
            ],
            "Query": [
              "spatial-partition-gd-bullets/spatial_hash.gd#query"
            ],
            "Client": [
              "spatial-partition-gd-bullets/arena.gd#_physics_process",
              "spatial-partition-gd-bullets/arena.gd#_resolve_hits"
            ]
          },
          "trace": [
            {
              "at": "spatial-partition-gd-bullets/arena.gd#_physics_process",
              "say": "Each physics frame has two phases: rebuild the grid from where the enemies are now, then resolve bullet hits using it."
            },
            {
              "at": "spatial-partition-gd-bullets/arena.gd#_rebuild_grid",
              "say": "Enemies move every frame, so the simplest correct choice is to clear the grid and insert every living enemy again."
            },
            {
              "at": "spatial-partition-gd-bullets/spatial_hash.gd#insert",
              "say": "insert() turns the global position into a Vector2i cell key and appends the node to that bucket."
            },
            {
              "at": "spatial-partition-gd-bullets/arena.gd#_resolve_hits",
              "say": "Each bullet asks the grid only for enemies near its own position, instead of looping over every enemy in the scene."
            },
            {
              "at": "spatial-partition-gd-bullets/spatial_hash.gd#query",
              "say": "query() visits just the cells the hit circle can overlap, usually one to four, and returns their enemies as candidates."
            },
            {
              "at": "spatial-partition-gd-bullets/arena.gd#_resolve_hits",
              "say": "The exact distance test runs only on those candidates. A hit damages the enemy, frees the bullet and stops its search."
            },
            {
              "at": "spatial-partition-gd-bullets/enemy.gd#hit",
              "say": "The enemy handles its own health. The grid never changes game state, it only answers 'who is nearby?'."
            }
          ],
          "files": {
            "spatial-partition-gd-bullets/arena.gd": "# Hundreds of bullets against hundreds of enemies. Checking every pair would be bullets x enemies tests\n# per frame; the grid cuts that down to the few enemies in the cells around each bullet.\nextends Node2D\n\nconst HIT_DISTANCE := Enemy.RADIUS + Bullet.RADIUS\n\nvar grid := SpatialHash.new(64.0)\nvar checks_this_frame := 0\n\n@onready var enemies: Node2D = $Enemies\n@onready var bullets: Node2D = $Bullets\n@onready var stats: Label = $HUD/Stats\n\nfunc _physics_process(_delta: float) -> void:\n\t_rebuild_grid()\n\t_resolve_hits()\n\tvar brute_force := bullets.get_child_count() * enemies.get_child_count()\n\tstats.text = \"grid checks: %d   (every pair: %d)\" % [checks_this_frame, brute_force]\n\n# Enemies move every frame, so the grid is rebuilt: clearing and re-inserting is cheap and simple.\nfunc _rebuild_grid() -> void:\n\tgrid.clear()\n\tfor enemy in enemies.get_children():\n\t\tif not enemy.is_queued_for_deletion():\n\t\t\tgrid.insert(enemy)\n\nfunc _resolve_hits() -> void:\n\tchecks_this_frame = 0\n\tfor bullet: Bullet in bullets.get_children():\n\t\tif bullet.is_queued_for_deletion():\n\t\t\tcontinue\n\t\tfor enemy: Enemy in grid.query(bullet.global_position, HIT_DISTANCE):\n\t\t\tchecks_this_frame += 1\n\t\t\tif enemy.is_queued_for_deletion():\n\t\t\t\tcontinue\n\t\t\tif bullet.global_position.distance_to(enemy.global_position) <= HIT_DISTANCE:\n\t\t\t\tenemy.hit()\n\t\t\t\tbullet.queue_free()\n\t\t\t\tbreak\n",
            "spatial-partition-gd-bullets/bullet.gd": "# A bullet flies in a straight line and disappears when it leaves the screen.\nclass_name Bullet\nextends Node2D\n\nconst RADIUS := 4.0\n\nvar velocity := Vector2.ZERO\n\nfunc _physics_process(delta: float) -> void:\n\tposition += velocity * delta\n\tif not get_viewport_rect().has_point(global_position):\n\t\tqueue_free()\n",
            "spatial-partition-gd-bullets/enemy.gd": "# An enemy drifts around the arena. It never looks for bullets itself.\nclass_name Enemy\nextends Node2D\n\nconst RADIUS := 12.0\nconst ARENA := Vector2(1152, 648)\n\nvar velocity := Vector2.ZERO\nvar health := 3\n\nfunc _physics_process(delta: float) -> void:\n\tposition = (position + velocity * delta).posmodv(ARENA)\n\nfunc hit() -> void:\n\thealth -= 1\n\tif health <= 0:\n\t\tqueue_free()\n",
            "spatial-partition-gd-bullets/spatial_hash.gd": "# A uniform grid (\"spatial hash\"): nodes are dropped into buckets keyed by the cell they stand in.\nclass_name SpatialHash\nextends RefCounted\n\nvar cell_size: float\nvar _buckets: Dictionary = {}\n\nfunc _init(size: float) -> void:\n\tcell_size = size\n\nfunc clear() -> void:\n\t_buckets.clear()\n\nfunc cell_of(point: Vector2) -> Vector2i:\n\treturn Vector2i(floori(point.x / cell_size), floori(point.y / cell_size))\n\nfunc insert(item: Node2D) -> void:\n\tvar key := cell_of(item.global_position)\n\tif not _buckets.has(key):\n\t\t_buckets[key] = []\n\t_buckets[key].append(item)\n\n# Returns everything in the cells a circle could touch. Callers still do the exact distance test.\nfunc query(center: Vector2, radius: float) -> Array:\n\tvar found: Array = []\n\tvar min_cell := cell_of(center - Vector2(radius, radius))\n\tvar max_cell := cell_of(center + Vector2(radius, radius))\n\tfor y in range(min_cell.y, max_cell.y + 1):\n\t\tfor x in range(min_cell.x, max_cell.x + 1):\n\t\t\tvar key := Vector2i(x, y)\n\t\t\tif _buckets.has(key):\n\t\t\t\tfound.append_array(_buckets[key])\n\treturn found\n"
          }
        },
        {
          "id": "spatial-partition-quadtree-real",
          "title": "quadtree-js: a quadtree for 2D collision checks",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "timohausmann/quadtree-js",
            "url": "https://github.com/timohausmann/quadtree-js/blob/1.2.6/quadtree.js",
            "license": "MIT",
            "note": "quadtree/quadtree.js is verbatim from quadtree-js 1.2.6 with only the MIT permission text trimmed (marked). collisions.js and main.js were written for Software City."
          },
          "story": "A popular, tiny quadtree. A node splits into four children once it holds more than max_objects; retrieve() walks down only the quadrants a box overlaps. main.js finds collisions among 2,000 boxes with about 13,000 checks instead of 2 million.",
          "roles": {
            "Partition": [
              "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree",
              "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.insert"
            ],
            "Region": [
              "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.split",
              "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.getIndex"
            ],
            "Query": [
              "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.retrieve"
            ],
            "Client": [
              "spatial-partition-quadtree-real/collisions.js#findCollisions",
              "spatial-partition-quadtree-real/main.js#frame"
            ]
          },
          "trace": [
            {
              "at": "spatial-partition-quadtree-real/main.js#frame",
              "say": "Every frame starts from scratch: build a tree from the current boxes, find collisions, then clear it."
            },
            {
              "at": "spatial-partition-quadtree-real/collisions.js#buildTree",
              "say": "buildTree() creates a root covering the whole world (split after 10 objects, at most 4 levels) and inserts every box."
            },
            {
              "at": "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.insert",
              "say": "insert() stores the box in this node until it gets crowded. Then it splits and pushes all its boxes down into the matching children."
            },
            {
              "at": "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.split",
              "say": "split() creates four child nodes, one per quadrant. Crowded areas get deeper trees; empty areas stay a single node."
            },
            {
              "at": "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.getIndex",
              "say": "getIndex() compares the box with the node's midpoints. A box crossing a midline belongs to several quadrants."
            },
            {
              "at": "spatial-partition-quadtree-real/collisions.js#findCollisions",
              "say": "For each box, the broad phase asks the tree for candidates, then the narrow phase runs the exact overlap test on them."
            },
            {
              "at": "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.retrieve",
              "say": "retrieve() descends only into quadrants the box touches and collects their objects, removing duplicates at the root."
            },
            {
              "at": "spatial-partition-quadtree-real/quadtree/quadtree.js#Quadtree.clear",
              "say": "clear() empties every node recursively, ready for next frame's positions."
            }
          ],
          "files": {
            "spatial-partition-quadtree-real/collisions.js": "// Written for Software City (not part of quadtree-js): broad phase with the quadtree, narrow phase by hand.\nconst Quadtree = require('./quadtree/quadtree.js');\n\nfunction overlaps(a, b) {\n    return a.x < b.x + b.width && b.x < a.x + a.width &&\n        a.y < b.y + b.height && b.y < a.y + a.height;\n}\n\nfunction buildTree(world, objects) {\n    // Split a node once it holds more than 10 objects, at most 4 levels deep.\n    const tree = new Quadtree({ x: 0, y: 0, width: world.width, height: world.height }, 10, 4);\n    for (const obj of objects) {\n        tree.insert(obj);\n    }\n    return tree;\n}\n\nfunction findCollisions(tree, objects) {\n    const pairs = [];\n    let checks = 0;\n    for (const obj of objects) {\n        // Broad phase: only objects sharing a leaf node with obj come back.\n        const candidates = tree.retrieve(obj);\n        for (const other of candidates) {\n            if (other.id <= obj.id) {\n                continue; // skip itself and pairs we already tested from the other side\n            }\n            checks++;\n            if (overlaps(obj, other)) {\n                pairs.push([obj.id, other.id]);\n            }\n        }\n    }\n    return { pairs, checks };\n}\n\nmodule.exports = { buildTree, findCollisions, overlaps };\n",
            "spatial-partition-quadtree-real/main.js": "// Written for Software City (not part of quadtree-js): one frame of collision detection for 2,000 boxes.\nconst { buildTree, findCollisions } = require('./collisions.js');\n\nfunction randomBoxes(count, world) {\n    const boxes = [];\n    for (let id = 0; id < count; id++) {\n        boxes.push({\n            id: id,\n            x: Math.random() * (world.width - 8),\n            y: Math.random() * (world.height - 8),\n            width: 8,\n            height: 8\n        });\n    }\n    return boxes;\n}\n\nfunction frame(world, boxes) {\n    // Objects move every frame, so the tree is rebuilt from scratch: clear, then insert again.\n    const tree = buildTree(world, boxes);\n    const result = findCollisions(tree, boxes);\n    tree.clear();\n    return result;\n}\n\nfunction main() {\n    const world = { width: 1024, height: 768 };\n    const boxes = randomBoxes(2000, world);\n    const result = frame(world, boxes);\n    const bruteForce = boxes.length * (boxes.length - 1) / 2;\n    console.log(result.pairs.length + ' collisions found with ' + result.checks + ' checks (brute force: ' + bruteForce + ')');\n}\n\nmain();\n",
            "spatial-partition-quadtree-real/quadtree/quadtree.js": "// Source: quadtree-js 1.2.6 — https://github.com/timohausmann/quadtree-js/blob/1.2.6/quadtree.js\n// MIT License, Copyright (c) 2012-2023 Timo Hausmann. Included for study.\n/**\n * quadtree-js\n * @version 1.2.6\n * @license MIT\n * @author Timo Hausmann\n */\n\n/* https://github.com/timohausmann/quadtree-js.git v1.2.6 */\n \n/*\nCopyright © 2012-2023 Timo Hausmann\n… trimmed: 19 lines of MIT permission text (same license as stated in the header) …\n*/\n\n;(function() {\n\n    /**\n     * The Quadtree uses rectangle objects for all areas (\"Rect\").\n     * All rectangles require the properties x, y, width, height\n     * @typedef {Object} Rect\n     * @property {number} x         X-Position\n     * @property {number} y         Y-Position\n     * @property {number} width     Width\n     * @property {number} height    Height\n     */\n     \n    /**\n     * Quadtree Constructor\n     * @class Quadtree\n     * @param {Rect} bounds                 bounds of the node ({ x, y, width, height })\n     * @param {number} [max_objects=10]     (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)\n     * @param {number} [max_levels=4]       (optional) total max levels inside root Quadtree (default: 4) \n     * @param {number} [level=0]            (optional) depth level, required for subnodes (default: 0)\n     */\n    function Quadtree(bounds, max_objects, max_levels, level) {\n        \n        this.max_objects    = max_objects || 10;\n        this.max_levels     = max_levels || 4;\n        \n        this.level  = level || 0;\n        this.bounds = bounds;\n        \n        this.objects    = [];\n        this.nodes      = [];\n    };\n    \n    \n    /**\n     * Split the node into 4 subnodes\n     * @memberof Quadtree\n     */\n    Quadtree.prototype.split = function() {\n        \n        var nextLevel   = this.level + 1,\n            subWidth    = this.bounds.width/2,\n            subHeight   = this.bounds.height/2,\n            x           = this.bounds.x,\n            y           = this.bounds.y;        \n     \n        //top right node\n        this.nodes[0] = new Quadtree({\n            x       : x + subWidth, \n            y       : y, \n            width   : subWidth, \n            height  : subHeight\n        }, this.max_objects, this.max_levels, nextLevel);\n        \n        //top left node\n        this.nodes[1] = new Quadtree({\n            x       : x, \n            y       : y, \n            width   : subWidth, \n            height  : subHeight\n        }, this.max_objects, this.max_levels, nextLevel);\n        \n        //bottom left node\n        this.nodes[2] = new Quadtree({\n            x       : x, \n            y       : y + subHeight, \n            width   : subWidth, \n            height  : subHeight\n        }, this.max_objects, this.max_levels, nextLevel);\n        \n        //bottom right node\n        this.nodes[3] = new Quadtree({\n            x       : x + subWidth, \n            y       : y + subHeight, \n            width   : subWidth, \n            height  : subHeight\n        }, this.max_objects, this.max_levels, nextLevel);\n    };\n    \n    \n    /**\n     * Determine which node the object belongs to\n     * @param {Rect} pRect      bounds of the area to be checked ({ x, y, width, height })\n     * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)\n     * @memberof Quadtree\n     */\n    Quadtree.prototype.getIndex = function(pRect) {\n        \n        var indexes = [],\n            verticalMidpoint    = this.bounds.x + (this.bounds.width/2),\n            horizontalMidpoint  = this.bounds.y + (this.bounds.height/2);    \n\n        var startIsNorth = pRect.y < horizontalMidpoint,\n            startIsWest  = pRect.x < verticalMidpoint,\n            endIsEast    = pRect.x + pRect.width > verticalMidpoint,\n            endIsSouth   = pRect.y + pRect.height > horizontalMidpoint;    \n\n        //top-right quad\n        if(startIsNorth && endIsEast) {\n            indexes.push(0);\n        }\n        \n        //top-left quad\n        if(startIsWest && startIsNorth) {\n            indexes.push(1);\n        }\n\n        //bottom-left quad\n        if(startIsWest && endIsSouth) {\n            indexes.push(2);\n        }\n\n        //bottom-right quad\n        if(endIsEast && endIsSouth) {\n            indexes.push(3);\n        }\n     \n        return indexes;\n    };\n    \n    \n    /**\n     * Insert the object into the node. If the node\n     * exceeds the capacity, it will split and add all\n     * objects to their corresponding subnodes.\n     * @param {Rect} pRect      bounds of the object to be added ({ x, y, width, height })\n     * @memberof Quadtree\n     */\n    Quadtree.prototype.insert = function(pRect) {\n        \n        var i = 0,\n            indexes;\n         \n        //if we have subnodes, call insert on matching subnodes\n        if(this.nodes.length) {\n            indexes = this.getIndex(pRect);\n     \n            for(i=0; i<indexes.length; i++) {\n                this.nodes[indexes[i]].insert(pRect);     \n            }\n            return;\n        }\n     \n        //otherwise, store object here\n        this.objects.push(pRect);\n\n        //max_objects reached\n        if(this.objects.length > this.max_objects && this.level < this.max_levels) {\n\n            //split if we don't already have subnodes\n            if(!this.nodes.length) {\n                this.split();\n            }\n            \n            //add all objects to their corresponding subnode\n            for(i=0; i<this.objects.length; i++) {\n                indexes = this.getIndex(this.objects[i]);\n                for(var k=0; k<indexes.length; k++) {\n                    this.nodes[indexes[k]].insert(this.objects[i]);\n                }\n            }\n\n            //clean up this node\n            this.objects = [];\n        }\n     };\n     \n     \n    /**\n     * Return all objects that could collide with the given object\n     * @param {Rect} pRect      bounds of the object to be checked ({ x, y, width, height })\n     * @return {Rect[]}         array with all detected objects\n     * @memberof Quadtree\n     */\n    Quadtree.prototype.retrieve = function(pRect) {\n         \n        var indexes = this.getIndex(pRect),\n            returnObjects = this.objects;\n            \n        //if we have subnodes, retrieve their objects\n        if(this.nodes.length) {\n            for(var i=0; i<indexes.length; i++) {\n                returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(pRect));\n            }\n        }\n\n        //remove duplicates\n        if(this.level === 0) {\n            return Array.from(new Set(returnObjects));\n        }\n     \n        return returnObjects;\n    };\n    \n    \n    /**\n     * Clear the quadtree\n     * @memberof Quadtree\n     */\n    Quadtree.prototype.clear = function() {\n        \n        this.objects = [];\n     \n        for(var i=0; i < this.nodes.length; i++) {\n            if(this.nodes.length) {\n                this.nodes[i].clear();\n              }\n        }\n\n        this.nodes = [];\n    };\n\n    //export for commonJS or browser\n    if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {\n        module.exports = Quadtree;\n    } else {\n        window.Quadtree = Quadtree;    \n    }\n\n})();\n"
          }
        }
      ]
    },
    {
      "id": "event-queue",
      "name": "Event Queue",
      "family": "Game Programming",
      "aka": [
        "Message queue",
        "Request queue",
        "Deferred events",
        "Mailbox"
      ],
      "tagline": "Post a request now, handle it later: the queue decouples sending from processing.",
      "intent": "Sometimes the code that notices something should not handle it right away: the handler is slow, busy, or must run at a controlled pace. The sender puts a small event object into a queue and returns immediately. The receiver drains the queue later, in order, as fast as it can or wants to, and may merge, reorder or drop events on the way.",
      "analogy": "A restaurant order spike: waiters pin order tickets on the rail and go back to their tables. The chef takes tickets off the rail one by one, at the kitchen's own speed.",
      "cityShape": "Look for a queue building whose push (or enter) floor receives short pipes from several sender buildings, and a separate process floor (run, update, _process) that reads the same pending-list antenna later. Senders never have a pipe to the code that finally handles the event.",
      "roles": [
        {
          "name": "Event",
          "desc": "A small data object describing a request or something that happened. It is stored, so it must carry everything the receiver needs."
        },
        {
          "name": "Sender",
          "desc": "Code that creates an event and posts it to the queue, then continues without waiting for the result."
        },
        {
          "name": "Queue",
          "desc": "Holds pending events in order (FIFO, by time, or by priority). Often bounded, like a ring buffer, so it never grows forever."
        },
        {
          "name": "Receiver",
          "desc": "Takes events out of the queue later, at its own pace, and handles them. It may merge duplicates or limit how many it handles per frame."
        }
      ],
      "whenToUse": [
        "A burst of requests would overwhelm the handler: ten coin sounds in one frame, five achievements at once.",
        "The sender must not block: game code should not wait for audio, disk, or the network.",
        "Something should happen at a later time: timers, cooldowns, scheduled spawns, turn-based simulations.",
        "In Godot, call_deferred() and signals connected with CONNECT_DEFERRED are built-in event queues processed at the end of the frame."
      ],
      "pitfalls": [
        "The world may change before the event is handled: the sender's node can be freed, so carry data, not fragile references.",
        "Feedback loops: a receiver that posts new events while draining can keep the queue from ever emptying. Cap the work per frame.",
        "An unbounded queue hides problems and can grow without limit. Bound it and decide what happens when it is full (drop, merge, warn)."
      ],
      "related": [
        "observer",
        "command",
        "producer-consumer",
        "pub-sub",
        "game-loop"
      ],
      "quiz": [
        {
          "q": "Ten coins are collected in the same frame and each calls play_sound(coin). What does a merging audio queue achieve?",
          "options": [
            "It plays ten overlapping coin sounds",
            "It keeps one pending coin request (at the loudest volume), so the sound plays once",
            "It crashes because the queue is full",
            "It delays the game until the sounds finish"
          ],
          "answer": 1,
          "why": "Because requests wait in the queue before being handled, the receiver can spot duplicates and combine them, which a direct call could never do."
        },
        {
          "q": "How is an event queue different from a plain Observer callback?",
          "options": [
            "Observers are always faster",
            "With a queue the receiver handles the event later, at its own time; an observer handles it during the sender's call",
            "Queues can only hold one event",
            "There is no difference"
          ],
          "answer": 1,
          "why": "Observer decouples who receives; an event queue also decouples when. The sender's call returns before any handling happens."
        }
      ],
      "demos": [
        {
          "id": "event-queue-ts-achievements",
          "title": "Achievement popups, one at a time",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Game rules can unlock several achievements in the same frame. Instead of stacking popups on top of each other, they wait in a queue and the presenter shows one every 2 seconds.",
          "roles": {
            "Event": [
              "event-queue-ts-achievements/achievement.ts#Achievement"
            ],
            "Sender": [
              "event-queue-ts-achievements/game.ts#Game.enemyKilled"
            ],
            "Queue": [
              "event-queue-ts-achievements/event-queue.ts#EventQueue"
            ],
            "Receiver": [
              "event-queue-ts-achievements/popup.ts#PopupPresenter.update"
            ]
          },
          "trace": [
            {
              "at": "event-queue-ts-achievements/main.ts#main",
              "say": "main() kills three enemies in a row. In the same instant, four achievements are unlocked."
            },
            {
              "at": "event-queue-ts-achievements/game.ts#Game.enemyKilled",
              "say": "The game rule only reports what happened. It does not know how long popups take or whether one is already on screen."
            },
            {
              "at": "event-queue-ts-achievements/popup.ts#PopupPresenter.notify",
              "say": "notify() pushes the achievement into the queue and returns at once. Nothing is drawn yet."
            },
            {
              "at": "event-queue-ts-achievements/event-queue.ts#EventQueue.push",
              "say": "push() appends to the list, or refuses when it is full, so a flood of events cannot grow memory forever."
            },
            {
              "at": "event-queue-ts-achievements/popup.ts#PopupPresenter.update",
              "say": "Each frame, update() counts down the current popup. Only when it closes does the presenter take the next event."
            },
            {
              "at": "event-queue-ts-achievements/event-queue.ts#EventQueue.pop",
              "say": "pop() removes the oldest event first (FIFO), so popups appear in the order the achievements were earned."
            }
          ],
          "files": {
            "event-queue-ts-achievements/achievement.ts": "// The event: a small piece of data describing what happened. It carries no behaviour.\nexport interface Achievement {\n  id: string\n  title: string\n}\n",
            "event-queue-ts-achievements/event-queue.ts": "// A first-in, first-out queue. Senders push and walk away; the receiver pops when it is ready.\nexport class EventQueue<T> {\n  private items: T[] = []\n\n  constructor(private capacity: number) {}\n\n  push(event: T): boolean {\n    if (this.items.length >= this.capacity) {\n      return false // full: the caller learns the event was dropped instead of the game stalling\n    }\n    this.items.push(event)\n    return true\n  }\n\n  pop(): T | undefined {\n    return this.items.shift()\n  }\n\n  get size(): number {\n    return this.items.length\n  }\n}\n",
            "event-queue-ts-achievements/game.ts": "// The sender: game rules unlock achievements. They may unlock three in the same frame.\nimport { PopupPresenter } from './popup'\n\nexport class Game {\n  private kills = 0\n\n  constructor(private popups: PopupPresenter) {}\n\n  enemyKilled(byHeadshot: boolean): void {\n    this.kills += 1\n    if (this.kills === 1) {\n      this.popups.notify({ id: 'first-blood', title: 'First Blood' })\n    }\n    if (byHeadshot) {\n      this.popups.notify({ id: 'headshot', title: 'Headshot!' })\n    }\n    if (this.kills === 3) {\n      this.popups.notify({ id: 'triple', title: 'Triple Kill' })\n    }\n  }\n}\n",
            "event-queue-ts-achievements/main.ts": "// Three achievements unlock in one frame, but the player sees them one after another.\nimport { Game } from './game'\nimport { PopupPresenter } from './popup'\n\nfunction main(): void {\n  const popups = new PopupPresenter()\n  const game = new Game(popups)\n\n  game.enemyKilled(true) // First Blood + Headshot, same frame\n  game.enemyKilled(false)\n  game.enemyKilled(true) // Headshot + Triple Kill, same frame\n\n  const dt = 0.5\n  for (let frame = 0; frame < 20; frame++) {\n    console.log(`t=${(frame * dt).toFixed(1)}s`)\n    popups.update(dt)\n  }\n}\n\nmain()\n",
            "event-queue-ts-achievements/popup.ts": "// The receiver: shows one achievement popup at a time, for 2 seconds each, at its own pace.\nimport { Achievement } from './achievement'\nimport { EventQueue } from './event-queue'\n\nexport class PopupPresenter {\n  private queue: EventQueue<Achievement> = new EventQueue<Achievement>(10)\n  private showing: Achievement | null = null\n  private timeLeft = 0\n\n  notify(achievement: Achievement): void {\n    // Returns immediately. Nothing is drawn yet; the request just waits in line.\n    this.queue.push(achievement)\n  }\n\n  update(dt: number): void {\n    if (this.showing) {\n      this.timeLeft -= dt\n      if (this.timeLeft > 0) {\n        return\n      }\n      console.log(`  (popup \"${this.showing.title}\" closes)`)\n      this.showing = null\n    }\n    const next = this.queue.pop()\n    if (next) {\n      this.showing = next\n      this.timeLeft = 2\n      console.log(`  POPUP: ${next.title}  [${this.queue.size} waiting]`)\n    }\n  }\n}\n"
          }
        },
        {
          "id": "event-queue-gd-audio",
          "title": "Godot audio queue with merging and a ring buffer",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "An AudioQueue autoload accepts play_sound() requests from anywhere. Requests wait in a fixed-size ring buffer; identical pending sounds are merged; _process starts at most four per frame on a pool of players.",
          "roles": {
            "Event": [
              "event-queue-gd-audio/sound_request.gd"
            ],
            "Sender": [
              "event-queue-gd-audio/coin.gd#_on_body_entered",
              "event-queue-gd-audio/player.gd#_physics_process"
            ],
            "Queue": [
              "event-queue-gd-audio/audio_queue.gd#play_sound"
            ],
            "Receiver": [
              "event-queue-gd-audio/audio_queue.gd#_process",
              "event-queue-gd-audio/audio_queue.gd#_start"
            ]
          },
          "trace": [
            {
              "at": "event-queue-gd-audio/player.gd#_physics_process",
              "say": "The player jumps and posts a jump sound. Movement continues at once; the physics step never waits for audio."
            },
            {
              "at": "event-queue-gd-audio/coin.gd#_on_body_entered",
              "say": "An explosion collects ten coins in one frame. Each coin posts the same pickup sound and frees itself."
            },
            {
              "at": "event-queue-gd-audio/audio_queue.gd#play_sound",
              "say": "Before queuing, play_sound() scans the pending requests. Nine of the ten coin requests are merged into one, keeping the loudest volume."
            },
            {
              "at": "event-queue-gd-audio/sound_request.gd#_init",
              "say": "A request is plain data: the stream and the volume. It holds no reference to the coin, which is already gone."
            },
            {
              "at": "event-queue-gd-audio/audio_queue.gd#play_sound",
              "say": "New requests go in at _tail of a ring buffer. If tail would catch up with head, the queue is full and the sound is dropped."
            },
            {
              "at": "event-queue-gd-audio/audio_queue.gd#_process",
              "say": "Later in the frame, the receiver takes requests from _head, at most four per frame, so a burst cannot stall a single frame."
            },
            {
              "at": "event-queue-gd-audio/audio_queue.gd#_start",
              "say": "_start() finds a free AudioStreamPlayer from the pool and plays the sound there. Only the queue touches the players."
            }
          ],
          "files": {
            "event-queue-gd-audio/audio_queue.gd": "# Autoload (Project Settings > Globals) named AudioQueue.\n# Senders call play_sound() and return at once; sounds actually start later, in _process.\nextends Node\n\nconst MAX_PENDING := 16\nconst MAX_PER_FRAME := 4\nconst POOL_SIZE := 8\n\nvar _pending: Array[SoundRequest] = []\nvar _head := 0\nvar _tail := 0\nvar _players: Array[AudioStreamPlayer] = []\n\nfunc _ready() -> void:\n\t_pending.resize(MAX_PENDING)\n\tfor i in POOL_SIZE:\n\t\tvar player := AudioStreamPlayer.new()\n\t\tadd_child(player)\n\t\t_players.append(player)\n\nfunc play_sound(stream: AudioStream, volume_db: float = 0.0) -> void:\n\t# Merge: the same sound requested twice before it plays becomes ONE request at the louder volume.\n\tvar i := _head\n\twhile i != _tail:\n\t\tif _pending[i].stream == stream:\n\t\t\t_pending[i].volume_db = maxf(_pending[i].volume_db, volume_db)\n\t\t\treturn\n\t\ti = (i + 1) % MAX_PENDING\n\tif (_tail + 1) % MAX_PENDING == _head:\n\t\tpush_warning(\"AudioQueue full, dropping a sound\")\n\t\treturn\n\t# A ring buffer: head and tail chase each other around a fixed array, so nothing is reallocated.\n\t_pending[_tail] = SoundRequest.new(stream, volume_db)\n\t_tail = (_tail + 1) % MAX_PENDING\n\nfunc _process(_delta: float) -> void:\n\tvar started := 0\n\twhile _head != _tail and started < MAX_PER_FRAME:\n\t\tvar request := _pending[_head]\n\t\t_pending[_head] = null\n\t\t_head = (_head + 1) % MAX_PENDING\n\t\t_start(request)\n\t\tstarted += 1\n\nfunc _start(request: SoundRequest) -> void:\n\tvar player := _free_player()\n\tif player == null:\n\t\treturn\n\tplayer.stream = request.stream\n\tplayer.volume_db = request.volume_db\n\tplayer.play()\n\nfunc _free_player() -> AudioStreamPlayer:\n\tfor player in _players:\n\t\tif not player.playing:\n\t\t\treturn player\n\treturn null\n",
            "event-queue-gd-audio/coin.gd": "# A sender. An explosion can collect ten coins in one physics frame; the queue merges their sounds.\nextends Area2D\n\n@export var pickup_sound: AudioStream\n\nfunc _ready() -> void:\n\tbody_entered.connect(_on_body_entered)\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.is_in_group(\"player\"):\n\t\tAudioQueue.play_sound(pickup_sound, -6.0)\n\t\tqueue_free()\n",
            "event-queue-gd-audio/player.gd": "# Another sender. Jumping does not wait for audio: it posts a request and carries on moving.\nextends CharacterBody2D\n\nconst JUMP_VELOCITY := -420.0\n\n@export var jump_sound: AudioStream\n\nfunc _physics_process(delta: float) -> void:\n\tvelocity += get_gravity() * delta\n\tif is_on_floor() and Input.is_action_just_pressed(\"jump\"):\n\t\tvelocity.y = JUMP_VELOCITY\n\t\tAudioQueue.play_sound(jump_sound)\n\tvelocity.x = Input.get_axis(\"left\", \"right\") * 200.0\n\tmove_and_slide()\n",
            "event-queue-gd-audio/sound_request.gd": "# The event: \"please play this sound at this volume\". Just data, created by senders, consumed later.\nclass_name SoundRequest\nextends RefCounted\n\nvar stream: AudioStream\nvar volume_db: float\n\nfunc _init(sound: AudioStream, volume: float) -> void:\n\tstream = sound\n\tvolume_db = volume\n"
          }
        },
        {
          "id": "event-queue-sched-real",
          "title": "Python's sched: a time-ordered event queue",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.9/Lib/sched.py",
            "license": "PSF-2.0",
            "note": "sched.py is verbatim from CPython 3.12.9 Lib/sched.py. game_clock.py, kitchen.py and main.py were written for Software City."
          },
          "story": "The standard library's scheduler keeps events in a heap ordered by time, priority and sequence. With a simulated clock, a restaurant game schedules orders, dishes and impatient customers, and cancels events that become irrelevant.",
          "roles": {
            "Event": [
              "event-queue-sched-real/sched.py#Event"
            ],
            "Sender": [
              "event-queue-sched-real/kitchen.py#Kitchen.order_arrives",
              "event-queue-sched-real/main.py#main"
            ],
            "Queue": [
              "event-queue-sched-real/sched.py#scheduler.enterabs",
              "event-queue-sched-real/sched.py#scheduler.cancel"
            ],
            "Receiver": [
              "event-queue-sched-real/sched.py#scheduler.run"
            ]
          },
          "trace": [
            {
              "at": "event-queue-sched-real/main.py#main",
              "say": "main() builds a scheduler with simulated time: timefunc reads the game clock and delayfunc jumps it forward instead of sleeping."
            },
            {
              "at": "event-queue-sched-real/sched.py#scheduler.enter",
              "say": "enter() turns a relative delay into an absolute time. It is the friendly front door to enterabs()."
            },
            {
              "at": "event-queue-sched-real/sched.py#scheduler.enterabs",
              "say": "enterabs() wraps the call in an Event tuple and pushes it on a heap. A sequence number keeps equal-time events in posting order."
            },
            {
              "at": "event-queue-sched-real/sched.py#scheduler.run",
              "say": "run() is the receiver. It peeks at the earliest event; if it is not due yet, it calls delayfunc, otherwise it pops it and calls the action."
            },
            {
              "at": "event-queue-sched-real/kitchen.py#Kitchen.order_arrives",
              "say": "Handling one event posts two more: the dish in 8 s, and an urgent 'customer leaves' in 12 s. The kitchen keeps the second event's ID."
            },
            {
              "at": "event-queue-sched-real/kitchen.py#Kitchen.oven_breaks",
              "say": "Waiting events can still be inspected and removed. The broken oven cancels table 2's dish before it is ever handled."
            },
            {
              "at": "event-queue-sched-real/sched.py#scheduler.cancel",
              "say": "cancel() removes the event and re-heapifies. Table 1's patience timer is cancelled the same way when its pizza arrives in time."
            },
            {
              "at": "event-queue-sched-real/kitchen.py#Kitchen.customer_leaves",
              "say": "Table 2's patience event was never cancelled, so at 14 s the queue delivers it and the customer leaves."
            }
          ],
          "files": {
            "event-queue-sched-real/game_clock.py": "# Written for Software City (not part of CPython): simulated game time instead of the wall clock.\n# sched.scheduler accepts any time function and delay function, so a game can run it instantly.\nclass GameClock:\n    def __init__(self):\n        self.seconds = 0.0\n\n    def now(self):\n        return self.seconds\n\n    def advance(self, delay):\n        # Called by the scheduler instead of time.sleep: jump straight to the next event.\n        self.seconds += delay\n",
            "event-queue-sched-real/kitchen.py": "# Written for Software City (not part of CPython): a tiny restaurant game.\n# Senders schedule events for later and return at once; nobody waits for the oven.\nPRIORITY_NORMAL = 1\nPRIORITY_URGENT = 0\n\n\nclass Kitchen:\n    def __init__(self, queue, clock):\n        self.queue = queue\n        self.clock = clock\n        self.patience = {}\n\n    def log(self, text):\n        print(f\"[{self.clock.now():5.1f}s] {text}\")\n\n    def order_arrives(self, table, dish):\n        self.log(f\"table {table} orders {dish}\")\n        self.queue.enter(8.0, PRIORITY_NORMAL, self.dish_ready, argument=(table, dish))\n        # Keep the event ID so this future event can be cancelled if the food arrives first.\n        self.patience[table] = self.queue.enter(12.0, PRIORITY_URGENT, self.customer_leaves, argument=(table,))\n\n    def dish_ready(self, table, dish):\n        self.log(f\"{dish} for table {table} is served\")\n        event = self.patience.pop(table, None)\n        if event is not None:\n            self.queue.cancel(event)\n\n    def customer_leaves(self, table):\n        self.patience.pop(table, None)\n        self.log(f\"table {table} got tired of waiting and left\")\n\n    def oven_breaks(self, table):\n        # Events can be inspected and removed while they wait: drop this table's dish.\n        for event in self.queue.queue:\n            if event.action == self.dish_ready and event.argument[0] == table:\n                self.queue.cancel(event)\n                self.log(f\"the oven broke, table {table} will not get food\")\n",
            "event-queue-sched-real/main.py": "# Written for Software City (not part of CPython): wire the scheduler to simulated time and run the evening.\nfrom .sched import scheduler\nfrom .game_clock import GameClock\nfrom .kitchen import Kitchen\n\n\ndef main():\n    clock = GameClock()\n    queue = scheduler(timefunc=clock.now, delayfunc=clock.advance)\n    kitchen = Kitchen(queue, clock)\n\n    queue.enter(0.0, 1, kitchen.order_arrives, argument=(1, \"pizza\"))\n    queue.enter(2.0, 1, kitchen.order_arrives, argument=(2, \"soup\"))\n    queue.enter(3.0, 1, kitchen.oven_breaks, argument=(2,))\n    # Nothing has happened yet. run() now processes events in time order, one by one.\n    queue.run()\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "event-queue-sched-real/sched.py": "# Source: CPython 3.12.9 Lib/sched.py — https://github.com/python/cpython/blob/v3.12.9/Lib/sched.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n\"\"\"A generally useful event scheduler class.\n\nEach instance of this class manages its own queue.\nNo multi-threading is implied; you are supposed to hack that\nyourself, or use a single instance per application.\n\nEach instance is parametrized with two functions, one that is\nsupposed to return the current time, one that is supposed to\nimplement a delay.  You can implement real-time scheduling by\nsubstituting time and sleep from built-in module time, or you can\nimplement simulated time by writing your own functions.  This can\nalso be used to integrate scheduling with STDWIN events; the delay\nfunction is allowed to modify the queue.  Time can be expressed as\nintegers or floating-point numbers, as long as it is consistent.\n\nEvents are specified by tuples (time, priority, action, argument, kwargs).\nAs in UNIX, lower priority numbers mean higher priority; in this\nway the queue can be maintained as a priority queue.  Execution of the\nevent means calling the action function, passing it the argument\nsequence in \"argument\" (remember that in Python, multiple function\narguments are be packed in a sequence) and keyword parameters in \"kwargs\".\nThe action function may be an instance method so it\nhas another way to reference private data (besides global variables).\n\"\"\"\n\nimport time\nimport heapq\nfrom collections import namedtuple\nfrom itertools import count\nimport threading\nfrom time import monotonic as _time\n\n__all__ = [\"scheduler\"]\n\nEvent = namedtuple('Event', 'time, priority, sequence, action, argument, kwargs')\nEvent.time.__doc__ = ('''Numeric type compatible with the return value of the\ntimefunc function passed to the constructor.''')\nEvent.priority.__doc__ = ('''Events scheduled for the same time will be executed\nin the order of their priority.''')\nEvent.sequence.__doc__ = ('''A continually increasing sequence number that\n    separates events if time and priority are equal.''')\nEvent.action.__doc__ = ('''Executing the event means executing\naction(*argument, **kwargs)''')\nEvent.argument.__doc__ = ('''argument is a sequence holding the positional\narguments for the action.''')\nEvent.kwargs.__doc__ = ('''kwargs is a dictionary holding the keyword\narguments for the action.''')\n\n_sentinel = object()\n\nclass scheduler:\n\n    def __init__(self, timefunc=_time, delayfunc=time.sleep):\n        \"\"\"Initialize a new instance, passing the time and delay\n        functions\"\"\"\n        self._queue = []\n        self._lock = threading.RLock()\n        self.timefunc = timefunc\n        self.delayfunc = delayfunc\n        self._sequence_generator = count()\n\n    def enterabs(self, time, priority, action, argument=(), kwargs=_sentinel):\n        \"\"\"Enter a new event in the queue at an absolute time.\n\n        Returns an ID for the event which can be used to remove it,\n        if necessary.\n\n        \"\"\"\n        if kwargs is _sentinel:\n            kwargs = {}\n\n        with self._lock:\n            event = Event(time, priority, next(self._sequence_generator),\n                          action, argument, kwargs)\n            heapq.heappush(self._queue, event)\n        return event # The ID\n\n    def enter(self, delay, priority, action, argument=(), kwargs=_sentinel):\n        \"\"\"A variant that specifies the time as a relative time.\n\n        This is actually the more commonly used interface.\n\n        \"\"\"\n        time = self.timefunc() + delay\n        return self.enterabs(time, priority, action, argument, kwargs)\n\n    def cancel(self, event):\n        \"\"\"Remove an event from the queue.\n\n        This must be presented the ID as returned by enter().\n        If the event is not in the queue, this raises ValueError.\n\n        \"\"\"\n        with self._lock:\n            self._queue.remove(event)\n            heapq.heapify(self._queue)\n\n    def empty(self):\n        \"\"\"Check whether the queue is empty.\"\"\"\n        with self._lock:\n            return not self._queue\n\n    def run(self, blocking=True):\n        \"\"\"Execute events until the queue is empty.\n        If blocking is False executes the scheduled events due to\n        expire soonest (if any) and then return the deadline of the\n        next scheduled call in the scheduler.\n\n        When there is a positive delay until the first event, the\n        delay function is called and the event is left in the queue;\n        otherwise, the event is removed from the queue and executed\n        (its action function is called, passing it the argument).  If\n        the delay function returns prematurely, it is simply\n        restarted.\n\n        It is legal for both the delay function and the action\n        function to modify the queue or to raise an exception;\n        exceptions are not caught but the scheduler's state remains\n        well-defined so run() may be called again.\n\n        A questionable hack is added to allow other threads to run:\n        just after an event is executed, a delay of 0 is executed, to\n        avoid monopolizing the CPU when other threads are also\n        runnable.\n\n        \"\"\"\n        # localize variable access to minimize overhead\n        # and to improve thread safety\n        lock = self._lock\n        q = self._queue\n        delayfunc = self.delayfunc\n        timefunc = self.timefunc\n        pop = heapq.heappop\n        while True:\n            with lock:\n                if not q:\n                    break\n                (time, priority, sequence, action,\n                 argument, kwargs) = q[0]\n                now = timefunc()\n                if time > now:\n                    delay = True\n                else:\n                    delay = False\n                    pop(q)\n            if delay:\n                if not blocking:\n                    return time - now\n                delayfunc(time - now)\n            else:\n                action(*argument, **kwargs)\n                delayfunc(0)   # Let other threads run\n\n    @property\n    def queue(self):\n        \"\"\"An ordered list of upcoming events.\n\n        Events are named tuples with fields for:\n            time, priority, action, arguments, kwargs\n\n        \"\"\"\n        # Use heapq to sort the queue rather than using 'sorted(self._queue)'.\n        # With heapq, two events scheduled at the same time will show in\n        # the actual order they would be retrieved.\n        with self._lock:\n            events = self._queue[:]\n        return list(map(heapq.heappop, [events]*len(events)))\n"
          }
        }
      ]
    },
    {
      "id": "dirty-flag",
      "name": "Dirty Flag",
      "family": "Game Programming",
      "aka": [
        "Invalidation flag",
        "Lazy recompute",
        "needsUpdate"
      ],
      "tagline": "Remember that derived data is stale, and recompute it only when someone actually needs it.",
      "intent": "Some values are derived from others by expensive work: a world transform from a chain of parents, a layout from text widths, a total from a list. Instead of recomputing on every change or every frame, setters just raise a boolean 'dirty' flag. The getter recomputes only if the flag is set, then clears it, so many changes cost one recompute and no changes cost nothing.",
      "analogy": "A whiteboard with 'needs re-sum' scribbled in the corner. Anyone who changes a number writes the note; the next person who needs the total adds it up once and wipes the note away.",
      "cityShape": "Look for a building with a small boolean antenna (dirty, needsUpdate) that several setter floors write, and a getter floor that reads it and only sometimes calls the expensive recompute floor. That recompute floor is the one that writes the cached-result antenna.",
      "roles": [
        {
          "name": "Primary Data",
          "desc": "The inputs that change: item list, label text, position and rotation. Every change goes through a setter that raises the flag."
        },
        {
          "name": "Dirty Flag",
          "desc": "A boolean that means 'the derived data no longer matches the primary data'. Setting it is cheap, so it can happen many times per frame."
        },
        {
          "name": "Derived Data",
          "desc": "The cached result of the expensive computation: total weight, measured width, world matrix."
        },
        {
          "name": "Recompute",
          "desc": "The getter or update step that checks the flag, rebuilds the derived data only if needed, and clears the flag."
        }
      ],
      "whenToUse": [
        "Derived data is expensive and the inputs change less often than the result is read (every frame).",
        "Several changes can happen before the next read, so batching them into one recompute saves work.",
        "Hierarchies where a parent's change must reach all children: transforms in a scene graph, nested UI layout.",
        "Godot uses it everywhere: Control layout, Node2D global transforms and queue_redraw() all mark something dirty and update once later."
      ],
      "pitfalls": [
        "Forgetting to set the flag in one setter, or letting code write the primary data directly, leaves stale results that are hard to debug.",
        "Forgetting to clear the flag turns the cache into recompute-every-time and hides the bug as 'just slow'.",
        "The recompute now happens at read time, which can cause a sudden spike in the frame that first reads it. Keep the recompute cheap or do it at a known point."
      ],
      "related": [
        "lazy-evaluation",
        "cache-aside",
        "observer",
        "update-method",
        "composite"
      ],
      "quiz": [
        {
          "q": "A chest adds three items to the inventory, then the player reads the total weight 60 times per second. How many times is the total summed with a dirty flag?",
          "options": [
            "Three times, once per item added",
            "Once, on the first read after the changes",
            "60 times per second",
            "Never, the flag replaces the sum"
          ],
          "answer": 1,
          "why": "Each add only sets the flag. The first read sees the flag, sums once and clears it; every later read returns the cached value."
        },
        {
          "q": "In a scene graph, a parent node moves. Why must its children also be treated as dirty?",
          "options": [
            "Because children store a copy of the parent's position in their local matrix",
            "Because each child's world transform is the parent's world transform times its own local one",
            "Because only the root is drawn",
            "They do not need to be updated"
          ],
          "answer": 1,
          "why": "Derived data depends on the whole chain. three.js handles this by passing force = true down to all children once a parent's world matrix was recomputed."
        }
      ],
      "demos": [
        {
          "id": "dirty-flag-gd-inventory",
          "title": "Godot inventory weight that slows the player",
          "lang": "GDScript",
          "level": "beginner",
          "source": null,
          "story": "The player reads the backpack's total weight every physics frame to compute speed. add_item and remove_item only set _weight_dirty; the sum is recalculated once after a change, which the debug label shows next to the frame count.",
          "roles": {
            "Primary Data": [
              "dirty-flag-gd-inventory/inventory.gd#add_item",
              "dirty-flag-gd-inventory/inventory.gd#remove_item",
              "dirty-flag-gd-inventory/item.gd"
            ],
            "Dirty Flag": [
              "dirty-flag-gd-inventory/inventory.gd#_weight_dirty"
            ],
            "Derived Data": [
              "dirty-flag-gd-inventory/inventory.gd#_total_weight"
            ],
            "Recompute": [
              "dirty-flag-gd-inventory/inventory.gd#get_total_weight",
              "dirty-flag-gd-inventory/inventory.gd#_recalculate_weight"
            ]
          },
          "trace": [
            {
              "at": "dirty-flag-gd-inventory/chest.gd#_on_body_entered",
              "say": "The player walks into a chest. It adds three items to the inventory in a row, then disappears."
            },
            {
              "at": "dirty-flag-gd-inventory/inventory.gd#add_item",
              "say": "Each add_item() appends the item and sets _weight_dirty. Three adds cost three cheap flag writes and zero sums."
            },
            {
              "at": "dirty-flag-gd-inventory/player.gd#_physics_process",
              "say": "Every physics frame the player needs the weight to scale its speed, so it calls get_total_weight()."
            },
            {
              "at": "dirty-flag-gd-inventory/inventory.gd#get_total_weight",
              "say": "The getter checks the flag first. It is set, so this one call triggers the recompute."
            },
            {
              "at": "dirty-flag-gd-inventory/inventory.gd#_recalculate_weight",
              "say": "The sum runs once over all items, stores _total_weight and clears the flag. The debug counter goes up by one."
            },
            {
              "at": "dirty-flag-gd-inventory/player.gd#_physics_process",
              "say": "On the next frames the flag is clear, so get_total_weight() just returns the cached number."
            },
            {
              "at": "dirty-flag-gd-inventory/inventory.gd#remove_item",
              "say": "Dropping an item raises the flag again. The weight is summed once more, on the next frame that asks."
            }
          ],
          "files": {
            "dirty-flag-gd-inventory/chest.gd": "# Opening a chest adds several items at once: three writes, three flag sets, still only one recompute.\nextends Area2D\n\n@export var loot: Array[Item] = []\n\nfunc _ready() -> void:\n\tbody_entered.connect(_on_body_entered)\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.has_node(\"Inventory\"):\n\t\tvar inventory: Inventory = body.get_node(\"Inventory\")\n\t\tfor item in loot:\n\t\t\tinventory.add_item(item)\n\t\tqueue_free()\n",
            "dirty-flag-gd-inventory/inventory.gd": "# Keeps the total weight cached. Changing the item list only flips a flag; summing happens when asked.\nclass_name Inventory\nextends Node\n\nvar recalculations := 0\n\nvar _items: Array[Item] = []\nvar _total_weight := 0.0\nvar _weight_dirty := false\n\nfunc add_item(item: Item) -> void:\n\t_items.append(item)\n\t_weight_dirty = true\n\nfunc remove_item(item: Item) -> void:\n\t_items.erase(item)\n\t_weight_dirty = true\n\n# Read 60 times a second by the player, but only recomputed after the items changed.\nfunc get_total_weight() -> float:\n\tif _weight_dirty:\n\t\t_recalculate_weight()\n\treturn _total_weight\n\nfunc _recalculate_weight() -> void:\n\t_total_weight = 0.0\n\tfor item in _items:\n\t\t_total_weight += item.weight\n\t_weight_dirty = false\n\trecalculations += 1\n",
            "dirty-flag-gd-inventory/item.gd": "# Primary data: a simple item resource with a weight.\nclass_name Item\nextends Resource\n\n@export var display_name := \"Rock\"\n@export var weight := 1.0\n",
            "dirty-flag-gd-inventory/player.gd": "# The player slows down as the backpack gets heavier. Speed needs the weight every physics frame.\nextends CharacterBody2D\n\nconst BASE_SPEED := 220.0\nconst MAX_CARRY := 40.0\n\n@onready var inventory: Inventory = $Inventory\n@onready var debug_label: Label = $DebugLabel\n\nfunc _physics_process(_delta: float) -> void:\n\tvar load_factor := clampf(1.0 - inventory.get_total_weight() / MAX_CARRY, 0.3, 1.0)\n\tvelocity = Input.get_vector(\"left\", \"right\", \"up\", \"down\") * BASE_SPEED * load_factor\n\tmove_and_slide()\n\tdebug_label.text = \"frames: %d   weight sums: %d\" % [Engine.get_physics_frames(), inventory.recalculations]\n\nfunc drop(item: Item) -> void:\n\tinventory.remove_item(item)\n"
          }
        },
        {
          "id": "dirty-flag-rs-layout",
          "title": "HUD layout with two levels of dirty flags",
          "lang": "Rust",
          "level": "intermediate",
          "source": null,
          "story": "A HUD bar draws three labels every frame. Each Label caches its measured width; the Panel caches the layout. Over 120 frames it lays out only 5 times and measures text only 7 times, because unchanged text dirties nothing.",
          "roles": {
            "Primary Data": [
              "dirty-flag-rs-layout/widgets.rs#Label.set_text",
              "dirty-flag-rs-layout/panel.rs#Panel.add"
            ],
            "Dirty Flag": [
              "dirty-flag-rs-layout/widgets.rs#Label",
              "dirty-flag-rs-layout/panel.rs#Panel"
            ],
            "Derived Data": [
              "dirty-flag-rs-layout/widgets.rs#Label.width",
              "dirty-flag-rs-layout/panel.rs#Panel.layout"
            ],
            "Recompute": [
              "dirty-flag-rs-layout/panel.rs#Panel.draw",
              "dirty-flag-rs-layout/widgets.rs#Label.width"
            ]
          },
          "trace": [
            {
              "at": "dirty-flag-rs-layout/main.rs#main",
              "say": "main() draws the HUD for 120 frames. The score changes four times; 'Lives: 3' is set every frame with the same text."
            },
            {
              "at": "dirty-flag-rs-layout/panel.rs#Panel.set_text",
              "say": "The panel forwards the text to the label and raises its own layout_dirty only if the label reports a real change."
            },
            {
              "at": "dirty-flag-rs-layout/widgets.rs#Label.set_text",
              "say": "Same text as before? Return false and stay clean. This early-out is why 120 'Lives: 3' calls cost nothing."
            },
            {
              "at": "dirty-flag-rs-layout/panel.rs#Panel.draw",
              "say": "draw() runs every frame but calls layout() only when layout_dirty is set. Most frames skip straight to drawing."
            },
            {
              "at": "dirty-flag-rs-layout/panel.rs#Panel.layout",
              "say": "layout() asks every label for its width to place them side by side, then clears the panel's flag."
            },
            {
              "at": "dirty-flag-rs-layout/widgets.rs#Label.width",
              "say": "Each label re-measures only if its own text changed. The other labels hand back their cached width."
            },
            {
              "at": "dirty-flag-rs-layout/widgets.rs#measure_text",
              "say": "This stands in for slow font shaping. It ran 7 times in 120 frames instead of 360."
            }
          ],
          "files": {
            "dirty-flag-rs-layout/main.rs": "// 120 frames of a HUD. The score changes 4 times; \"Lives: 3\" is set every frame but never changes.\nmod panel;\nmod widgets;\n\nuse panel::Panel;\nuse widgets::Label;\n\nfn main() {\n    let mut hud = Panel::new();\n    hud.add(Label::new(\"Score: 0\"));\n    hud.add(Label::new(\"Lives: 3\"));\n    hud.add(Label::new(\"Level 1\"));\n\n    let mut score = 0;\n    for frame in 0..120 {\n        if frame % 30 == 29 {\n            score += 250;\n            hud.set_text(0, &format!(\"Score: {}\", score));\n        }\n        hud.set_text(1, \"Lives: 3\");\n        let picture = hud.draw();\n        if frame % 30 == 29 {\n            println!(\"frame {}: {}\", frame, picture);\n        }\n    }\n    println!(\n        \"120 frames drawn, {} layouts, {} text measurements\",\n        hud.layout_count,\n        hud.total_measures()\n    );\n}\n",
            "dirty-flag-rs-layout/panel.rs": "// A horizontal HUD bar. Child positions depend on every label's width, so layout has its own dirty flag.\nuse crate::widgets::Label;\n\nconst PADDING: f32 = 12.0;\n\npub struct Panel {\n    labels: Vec<Label>,\n    positions: Vec<f32>,\n    layout_dirty: bool,\n    pub layout_count: u32,\n}\n\nimpl Panel {\n    pub fn new() -> Panel {\n        Panel {\n            labels: Vec::new(),\n            positions: Vec::new(),\n            layout_dirty: true,\n            layout_count: 0,\n        }\n    }\n\n    pub fn add(&mut self, label: Label) {\n        self.labels.push(label);\n        self.layout_dirty = true;\n    }\n\n    pub fn set_text(&mut self, index: usize, text: &str) {\n        // A child's change dirties the parent too; an unchanged text dirties nothing.\n        if self.labels[index].set_text(text) {\n            self.layout_dirty = true;\n        }\n    }\n\n    fn layout(&mut self) {\n        self.positions.clear();\n        let mut x = PADDING;\n        for label in self.labels.iter_mut() {\n            self.positions.push(x);\n            x += label.width() + PADDING;\n        }\n        self.layout_dirty = false;\n        self.layout_count += 1;\n    }\n\n    // Called every frame. The expensive part only runs on frames where something changed.\n    pub fn draw(&mut self) -> String {\n        if self.layout_dirty {\n            self.layout();\n        }\n        self.labels\n            .iter()\n            .zip(self.positions.iter())\n            .map(|(label, x)| format!(\"{}@{}\", label.text(), x))\n            .collect::<Vec<_>>()\n            .join(\"  \")\n    }\n\n    pub fn total_measures(&self) -> u32 {\n        self.labels.iter().map(|l| l.measure_count).sum()\n    }\n}\n",
            "dirty-flag-rs-layout/widgets.rs": "// A text label. Measuring text is slow (font shaping), so the width is cached behind a dirty flag.\npub struct Label {\n    text: String,\n    cached_width: f32,\n    width_dirty: bool,\n    pub measure_count: u32,\n}\n\nimpl Label {\n    pub fn new(text: &str) -> Label {\n        Label {\n            text: text.to_string(),\n            cached_width: 0.0,\n            width_dirty: true, // never measured yet, so start dirty\n            measure_count: 0,\n        }\n    }\n\n    // Returns true only if the text really changed, so callers can propagate the flag upward.\n    pub fn set_text(&mut self, text: &str) -> bool {\n        if self.text == text {\n            return false;\n        }\n        self.text = text.to_string();\n        self.width_dirty = true;\n        true\n    }\n\n    pub fn text(&self) -> &str {\n        &self.text\n    }\n\n    pub fn width(&mut self) -> f32 {\n        if self.width_dirty {\n            self.cached_width = measure_text(&self.text);\n            self.width_dirty = false;\n            self.measure_count += 1;\n        }\n        self.cached_width\n    }\n}\n\n// Stand-in for real font shaping: imagine glyph lookups and kerning pairs for every character.\nfn measure_text(text: &str) -> f32 {\n    text.chars().map(|c| if c.is_uppercase() { 9.0 } else { 7.0 }).sum()\n}\n"
          }
        },
        {
          "id": "dirty-flag-threejs-real",
          "title": "three.js Object3D: matrixWorldNeedsUpdate",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "mrdoob/three.js",
            "url": "https://github.com/mrdoob/three.js/blob/r186/src/core/Object3D.js",
            "license": "MIT",
            "note": "three/Object3D.js is verbatim from three.js r186, trimmed to the matrix fields, add(), updateMatrix() and updateMatrixWorld() (cuts marked). scene.js and main.js were written for Software City; main.js mimics the matrix update that WebGLRenderer.render() starts."
          },
          "story": "Every three.js object caches its world matrix. updateMatrix() raises matrixWorldNeedsUpdate; updateMatrixWorld() recomputes only dirty nodes and forces their children. Static branches with matrixAutoUpdate = false are skipped every frame.",
          "roles": {
            "Primary Data": [
              "dirty-flag-threejs-real/scene.js#animate",
              "dirty-flag-threejs-real/scene.js#moveCity"
            ],
            "Dirty Flag": [
              "dirty-flag-threejs-real/three/Object3D.js#Object3D.updateMatrix"
            ],
            "Derived Data": [
              "dirty-flag-threejs-real/three/Object3D.js#Object3D"
            ],
            "Recompute": [
              "dirty-flag-threejs-real/three/Object3D.js#Object3D.updateMatrixWorld"
            ]
          },
          "trace": [
            {
              "at": "dirty-flag-threejs-real/scene.js#buildScene",
              "say": "The static city sets matrixAutoUpdate = false and calls updateMatrix() once. The planet and its moon stay animated."
            },
            {
              "at": "dirty-flag-threejs-real/three/Object3D.js#Object3D.updateMatrix",
              "say": "updateMatrix() composes the local matrix from position, rotation and scale, then raises matrixWorldNeedsUpdate: the world matrix is now stale."
            },
            {
              "at": "dirty-flag-threejs-real/main.js#renderFrame",
              "say": "Each frame the app only changes the planet's rotation, then starts the recursive update at the root, as the renderer does."
            },
            {
              "at": "dirty-flag-threejs-real/three/Object3D.js#Object3D.updateMatrixWorld",
              "say": "For an auto-updating node, updateMatrix() runs first and dirties it. A clean, static node skips the matrix multiply entirely."
            },
            {
              "at": "dirty-flag-threejs-real/three/Object3D.js#Object3D.updateMatrixWorld",
              "say": "A dirty node recomputes matrixWorld from its parent's, clears the flag and sets force = true, so every child below recomputes too."
            },
            {
              "at": "dirty-flag-threejs-real/scene.js#moveCity",
              "say": "When the static city does move, the app must call updateMatrix() itself, which raises the flag for exactly one frame."
            }
          ],
          "files": {
            "dirty-flag-threejs-real/main.js": "// Written for Software City (not part of three.js): what WebGLRenderer.render() does before drawing,\n// reduced to the matrix update. Run it once per frame.\nimport { buildScene, animate, moveCity } from './scene.js';\n\nfunction renderFrame( nodes, seconds ) {\n\tanimate( nodes, seconds );\n\t// The renderer starts the recursive world-matrix update at the root of the scene.\n\tif ( nodes.scene.matrixWorldAutoUpdate === true ) {\n\t\tnodes.scene.updateMatrixWorld();\n\t}\n\treturn nodes.moon.matrixWorld.elements[ 12 ]; // the moon's world x, now up to date\n}\n\nfunction main() {\n\tconst nodes = buildScene();\n\tfor ( let frame = 0; frame < 3; frame ++ ) {\n\t\tconsole.log( 'moon x =', renderFrame( nodes, frame / 60 ) );\n\t}\n\tmoveCity( nodes, - 6 );\n\trenderFrame( nodes, 3 / 60 );\n}\n\nmain();\n",
            "dirty-flag-threejs-real/scene.js": "// Written for Software City (not part of three.js): a small scene graph built from Object3D nodes.\nimport { Object3D } from './three/Object3D.js';\n\nexport function buildScene() {\n\tconst scene = new Object3D();\n\tconst city = new Object3D();\n\tconst planet = new Object3D();\n\tconst moon = new Object3D();\n\n\t// Static branch: switch off the per-frame updateMatrix() and compose the matrix once by hand.\n\tscene.matrixAutoUpdate = false;\n\tcity.matrixAutoUpdate = false;\n\tcity.position.set( 0, - 5, 0 );\n\tcity.updateMatrix(); // composes the local matrix and sets matrixWorldNeedsUpdate = true, once\n\n\t// Animated branch: matrixAutoUpdate stays true, so these are recomposed (and dirtied) every frame.\n\tmoon.position.set( 3, 0, 0 );\n\tplanet.add( moon );\n\tscene.add( city, planet );\n\n\treturn { scene, city, planet, moon };\n}\n\nexport function animate( nodes, seconds ) {\n\t// The app only edits position/rotation. It never touches matrices directly.\n\tnodes.planet.rotation.y = seconds * 0.5;\n}\n\nexport function moveCity( nodes, y ) {\n\t// A static object that does move must recompose its matrix, which raises its dirty flag again.\n\tnodes.city.position.y = y;\n\tnodes.city.updateMatrix();\n}\n",
            "dirty-flag-threejs-real/three/Object3D.js": "// Source: three.js r186 — https://github.com/mrdoob/three.js/blob/r186/src/core/Object3D.js\n// MIT License, Copyright © 2010-2026 three.js authors. Included for study.\nimport { Quaternion } from '../math/Quaternion.js';\nimport { Vector3 } from '../math/Vector3.js';\nimport { Matrix4 } from '../math/Matrix4.js';\nimport { EventDispatcher } from './EventDispatcher.js';\nimport { Euler } from '../math/Euler.js';\nimport { Layers } from './Layers.js';\nimport { Matrix3 } from '../math/Matrix3.js';\nimport { generateUUID } from '../math/MathUtils.js';\nimport { error } from '../utils.js';\n// … trimmed: 48 lines: shared temporary vectors/quaternions and the added/removed event objects …\n/**\n * This is the base class for most objects in three.js and provides a set of\n * properties and methods for manipulating objects in 3D space.\n *\n * @augments EventDispatcher\n */\nclass Object3D extends EventDispatcher {\n\n\t/**\n\t * Constructs a new 3D object.\n\t */\n\tconstructor() {\n\n\t\tsuper();\n\t\t// … trimmed: 42 lines: isObject3D, id, uuid, name and type fields …\n\n\t\t/**\n\t\t * A reference to the parent object.\n\t\t *\n\t\t * @type {?Object3D}\n\t\t * @default null\n\t\t */\n\t\tthis.parent = null;\n\n\t\t/**\n\t\t * An array holding the child 3D objects of this instance.\n\t\t *\n\t\t * @type {Array<Object3D>}\n\t\t */\n\t\tthis.children = [];\n\t\t// … trimmed: 98 lines: the up vector and the position/rotation/quaternion/scale properties (plain Vector3/Euler/Quaternion values the app edits directly) …\n\n\t\t/**\n\t\t * Represents the object's transformation matrix in local space.\n\t\t *\n\t\t * @type {Matrix4}\n\t\t */\n\t\tthis.matrix = new Matrix4();\n\n\t\t/**\n\t\t * Represents the object's transformation matrix in world space.\n\t\t * If the 3D object has no parent, then it's identical to the local transformation matrix\n\t\t *\n\t\t * @type {Matrix4}\n\t\t */\n\t\tthis.matrixWorld = new Matrix4();\n\n\t\t/**\n\t\t * When set to `true`, the engine automatically computes the local matrix from position,\n\t\t * rotation and scale every frame. If set to `false`, the app is responsible for recomputing\n\t\t * the local matrix by calling `updateMatrix()`.\n\t\t *\n\t\t * The default values for all 3D objects is defined by `Object3D.DEFAULT_MATRIX_AUTO_UPDATE`.\n\t\t *\n\t\t * @type {boolean}\n\t\t * @default true\n\t\t */\n\t\tthis.matrixAutoUpdate = Object3D.DEFAULT_MATRIX_AUTO_UPDATE;\n\n\t\t/**\n\t\t * When set to `true`, the engine automatically computes the world matrix from the current local\n\t\t * matrix and the object's transformation hierarchy. If set to `false`, the app is responsible for\n\t\t * recomputing the world matrix by directly updating the `matrixWorld` property.\n\t\t *\n\t\t * The default values for all 3D objects is defined by `Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE`.\n\t\t *\n\t\t * @type {boolean}\n\t\t * @default true\n\t\t */\n\t\tthis.matrixWorldAutoUpdate = Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE; // checked by the renderer\n\n\t\t/**\n\t\t * When set to `true`, it calculates the world matrix in that frame and resets this property\n\t\t * to `false`.\n\t\t *\n\t\t * @type {boolean}\n\t\t * @default false\n\t\t */\n\t\tthis.matrixWorldNeedsUpdate = false;\n\n\t\t// … trimmed: 103 lines: layers, visibility, shadow, culling and userData fields …\n\n\t\t/**\n\t\t * The pivot point for rotation and scale transformations.\n\t\t * When set, rotation and scale are applied around this point\n\t\t * instead of the object's origin.\n\t\t *\n\t\t * @type {?Vector3}\n\t\t * @default null\n\t\t */\n\t\tthis.pivot = null;\n\n\t}\n\n\t// … trimmed: 343 lines: render callbacks, rotate/translate helpers and lookAt (they edit position/quaternion, never the matrices) …\n\n\t/**\n\t * Adds the given 3D object as a child to this 3D object. An arbitrary number of\n\t * objects may be added. Any current parent on an object passed in here will be\n\t * removed, since an object can have at most one parent.\n\t *\n\t * @fires Object3D#added\n\t * @fires Object3D#childadded\n\t * @param {Object3D} object - The 3D object to add.\n\t * @return {Object3D} A reference to this instance.\n\t */\n\tadd( object ) {\n\n\t\tif ( arguments.length > 1 ) {\n\n\t\t\tfor ( let i = 0; i < arguments.length; i ++ ) {\n\n\t\t\t\tthis.add( arguments[ i ] );\n\n\t\t\t}\n\n\t\t\treturn this;\n\n\t\t}\n\n\t\tif ( object === this ) {\n\n\t\t\terror( 'Object3D.add: object can\\'t be added as a child of itself.', object );\n\t\t\treturn this;\n\n\t\t}\n\n\t\tif ( object && object.isObject3D ) {\n\n\t\t\tobject.removeFromParent();\n\t\t\tobject.parent = this;\n\t\t\tthis.children.push( object );\n\n\t\t\tobject.dispatchEvent( _addedEvent );\n\n\t\t\t_childaddedEvent.child = object;\n\t\t\tthis.dispatchEvent( _childaddedEvent );\n\t\t\t_childaddedEvent.child = null;\n\n\t\t} else {\n\n\t\t\terror( 'Object3D.add: object not an instance of THREE.Object3D.', object );\n\n\t\t}\n\n\t\treturn this;\n\n\t}\n\n\t// … trimmed: 350 lines: remove, attach, getObjectBy*, getWorld* and traverse helpers …\n\n\t/**\n\t * Updates the transformation matrix in local space by computing it from the current\n\t * position, rotation and scale values.\n\t */\n\tupdateMatrix() {\n\n\t\tthis.matrix.compose( this.position, this.quaternion, this.scale );\n\n\t\tconst pivot = this.pivot;\n\n\t\tif ( pivot !== null ) {\n\n\t\t\tconst px = pivot.x, py = pivot.y, pz = pivot.z;\n\t\t\tconst te = this.matrix.elements;\n\n\t\t\tte[ 12 ] += px - te[ 0 ] * px - te[ 4 ] * py - te[ 8 ] * pz;\n\t\t\tte[ 13 ] += py - te[ 1 ] * px - te[ 5 ] * py - te[ 9 ] * pz;\n\t\t\tte[ 14 ] += pz - te[ 2 ] * px - te[ 6 ] * py - te[ 10 ] * pz;\n\n\t\t}\n\n\t\tthis.matrixWorldNeedsUpdate = true;\n\n\t}\n\n\t/**\n\t * Updates the transformation matrix in world space of this 3D objects and its descendants.\n\t *\n\t * To ensure correct results, this method also recomputes the 3D object's transformation matrix in\n\t * local space. The computation of the local and world matrix can be controlled with the\n\t * {@link Object3D#matrixAutoUpdate} and {@link Object3D#matrixWorldAutoUpdate} flags which are both\n\t * `true` by default.  Set these flags to `false` if you need more control over the update matrix process.\n\t *\n\t * @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even\n\t * when {@link Object3D#matrixWorldNeedsUpdate} is `false`.\n\t */\n\tupdateMatrixWorld( force ) {\n\n\t\tif ( this.matrixAutoUpdate ) this.updateMatrix();\n\n\t\tif ( this.matrixWorldNeedsUpdate || force ) {\n\n\t\t\tif ( this.matrixWorldAutoUpdate === true ) {\n\n\t\t\t\tif ( this.parent === null ) {\n\n\t\t\t\t\tthis.matrixWorld.copy( this.matrix );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tthis.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tthis.matrixWorldNeedsUpdate = false;\n\n\t\t\tforce = true;\n\n\t\t}\n\n\t\t// make sure descendants are updated if required\n\n\t\tconst children = this.children;\n\n\t\tfor ( let i = 0, l = children.length; i < l; i ++ ) {\n\n\t\t\tconst child = children[ i ];\n\n\t\t\tchild.updateMatrixWorld( force );\n\n\t\t}\n\n\t}\n\n\t// … trimmed: 60 lines: updateWorldMatrix(), a variant of updateMatrixWorld with control over parents/children …\n\t// … trimmed: 400 lines: toJSON, clone, copy and dispose …\n\n}\n\n// … trimmed: doc comments for the static defaults below …\nObject3D.DEFAULT_UP = /*@__PURE__*/ new Vector3( 0, 1, 0 );\n\nObject3D.DEFAULT_MATRIX_AUTO_UPDATE = true;\n\nObject3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;\n\nexport { Object3D };\n"
          }
        }
      ]
    },
    {
      "id": "behavior-tree",
      "name": "Behavior Tree",
      "family": "Game Programming",
      "aka": [
        "BT",
        "AI behaviour tree",
        "Selector/Sequence tree"
      ],
      "tagline": "Build AI from small nodes: selectors pick, sequences chain, leaves check or act.",
      "intent": "Game AI written as nested ifs or a big state machine becomes hard to extend. A behaviour tree builds decisions from tiny reusable nodes that all answer one call, tick(), with SUCCESS, FAILURE or RUNNING. Composite nodes (selector, sequence) decide which children to tick; leaf nodes ask questions (conditions) or do work (actions). The tree is ticked from the root every frame, so the AI re-checks its priorities continuously.",
      "analogy": "A cooking recipe with fallbacks: 'make pasta: boil water, then cook noodles, then add sauce. If that fails, make a sandwich. If that fails, order pizza.' Each line either works, fails, or is still in progress.",
      "cityShape": "Look for small node buildings that all have a tick floor at the same height. The selector's and sequence's tick floors loop over children, so pipes fan out from them to the tick floors of the other node buildings. The agent building calls only the root's tick, once per frame.",
      "roles": [
        {
          "name": "Tree",
          "desc": "Holds the root and ticks it once per frame for an agent, usually with a blackboard: per-agent memory the nodes read and write."
        },
        {
          "name": "Selector",
          "desc": "A composite that tries children in priority order and stops at the first one that does not fail (an OR). Also called fallback or priority."
        },
        {
          "name": "Sequence",
          "desc": "A composite that runs children in order and stops at the first one that does not succeed (an AND)."
        },
        {
          "name": "Condition",
          "desc": "A leaf that answers a yes/no question about the world (SUCCESS or FAILURE) without changing anything."
        },
        {
          "name": "Action",
          "desc": "A leaf that does work. Long tasks return RUNNING until done, so the tree comes back to them on the next tick."
        }
      ],
      "whenToUse": [
        "NPCs with layered priorities: flee when hurt, attack when an enemy is visible, otherwise patrol.",
        "AI that designers want to rearrange without rewriting code: nodes are reusable and trees can be loaded from data.",
        "Behaviour that must react every frame to a changing world, unlike a script that runs top to bottom once.",
        "In Godot, plugins such as LimboAI and Beehave provide ready-made nodes; writing a tiny one yourself (as in the guard demo) is the best way to understand them."
      ],
      "pitfalls": [
        "Putting side effects in conditions: a check that also changes state makes the tree hard to reason about. Keep questions and actions separate.",
        "Forgetting RUNNING: an action that takes many frames but returns SUCCESS at once makes the AI flicker between branches.",
        "Storing per-agent state inside shared node objects. If one tree serves many agents, keep that state in the blackboard."
      ],
      "related": [
        "state",
        "composite",
        "strategy",
        "command",
        "update-method"
      ],
      "quiz": [
        {
          "q": "A selector has three children. The first returns FAILURE and the second returns RUNNING. What happens?",
          "options": [
            "The selector ticks the third child too",
            "The selector returns RUNNING and does not tick the third child this frame",
            "The selector returns FAILURE",
            "The selector restarts from the first child immediately"
          ],
          "answer": 1,
          "why": "A selector stops at the first child that does not fail. RUNNING counts as 'not failed', so the selector reports RUNNING and the lower-priority third child is skipped."
        },
        {
          "q": "Why does the whole tree get ticked from the root every frame, instead of only the node that was running?",
          "options": [
            "To use more CPU",
            "So higher-priority branches (like 'enemy visible') can interrupt a running lower-priority action such as patrolling",
            "Because nodes cannot remember anything",
            "Because RUNNING is not allowed"
          ],
          "answer": 1,
          "why": "Re-evaluating from the root lets conditions at the top win as soon as they become true. behavior3js then closes nodes that were running last tick but were not reached this time."
        }
      ],
      "demos": [
        {
          "id": "behavior-tree-py-vacuum",
          "title": "A robot vacuum that cleans, docks and charges",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A tiny behaviour-tree library in one file and a robot vacuum that uses it. Watch the tree switch to 'go to dock and charge' when the battery drops, stay there while charging is RUNNING, then go back to cleaning.",
          "roles": {
            "Tree": [
              "behavior-tree-py-vacuum/main.py#build_tree",
              "behavior-tree-py-vacuum/main.py#main"
            ],
            "Selector": [
              "behavior-tree-py-vacuum/nodes.py#Selector"
            ],
            "Sequence": [
              "behavior-tree-py-vacuum/nodes.py#Sequence"
            ],
            "Condition": [
              "behavior-tree-py-vacuum/nodes.py#Condition",
              "behavior-tree-py-vacuum/vacuum.py#needs_charge",
              "behavior-tree-py-vacuum/vacuum.py#has_dirt"
            ],
            "Action": [
              "behavior-tree-py-vacuum/nodes.py#Action",
              "behavior-tree-py-vacuum/vacuum.py#go_to_dock",
              "behavior-tree-py-vacuum/vacuum.py#charge",
              "behavior-tree-py-vacuum/vacuum.py#clean_spot"
            ]
          },
          "trace": [
            {
              "at": "behavior-tree-py-vacuum/main.py#build_tree",
              "say": "The tree reads like a priority list: charge if needed, else clean if there is dirt, else rest. Each branch is a sequence."
            },
            {
              "at": "behavior-tree-py-vacuum/main.py#main",
              "say": "Every tick, main() calls tick on the root only. The root decides which branch to run this time."
            },
            {
              "at": "behavior-tree-py-vacuum/nodes.py#Selector.tick",
              "say": "The selector tries its children top to bottom and stops at the first one that does not fail."
            },
            {
              "at": "behavior-tree-py-vacuum/nodes.py#Sequence.tick",
              "say": "The charging sequence starts with a condition. If it fails, the whole sequence fails and the selector moves on."
            },
            {
              "at": "behavior-tree-py-vacuum/vacuum.py#needs_charge",
              "say": "With 14% battery the question becomes true, so the sequence continues to its actions."
            },
            {
              "at": "behavior-tree-py-vacuum/vacuum.py#go_to_dock",
              "say": "Driving takes time, so the action returns RUNNING. The sequence and the selector pass RUNNING up to the root."
            },
            {
              "at": "behavior-tree-py-vacuum/vacuum.py#charge",
              "say": "On later ticks the robot is docked, so charging runs, returning RUNNING until the battery is full."
            },
            {
              "at": "behavior-tree-py-vacuum/vacuum.py#clean_spot",
              "say": "Once full, needs_charge fails, the selector falls through to the cleaning branch, and the robot gets back to work."
            }
          ],
          "files": {
            "behavior-tree-py-vacuum/main.py": "# Build the tree once, then tick it from the root every \"frame\".\nfrom .nodes import Selector, Sequence, Condition, Action\nfrom .vacuum import Robot, needs_charge, has_dirt, go_to_dock, charge, clean_spot, idle\n\n\ndef build_tree():\n    # Highest priority first: recharge if low, otherwise clean, otherwise rest.\n    return Selector(\n        Sequence(Condition(needs_charge), Action(go_to_dock), Action(charge)),\n        Sequence(Condition(has_dirt), Action(clean_spot)),\n        Action(idle),\n    )\n\n\ndef main():\n    robot = Robot()\n    tree = build_tree()\n    for tick in range(8):\n        print(f\"tick {tick}: {tree.tick(robot).value}\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "behavior-tree-py-vacuum/nodes.py": "# The building blocks of every behaviour tree. Each node's tick() answers with a Status.\nfrom enum import Enum\n\n\nclass Status(Enum):\n    SUCCESS = \"success\"\n    FAILURE = \"failure\"\n    RUNNING = \"running\"\n\n\nclass Node:\n    def tick(self, robot):\n        raise NotImplementedError\n\n\nclass Sequence(Node):\n    \"\"\"Do the children in order. Stop at the first one that does not succeed (an AND).\"\"\"\n\n    def __init__(self, *children):\n        self.children = children\n\n    def tick(self, robot):\n        for child in self.children:\n            status = child.tick(robot)\n            if status != Status.SUCCESS:\n                return status\n        return Status.SUCCESS\n\n\nclass Selector(Node):\n    \"\"\"Try the children in priority order. Stop at the first one that does not fail (an OR).\"\"\"\n\n    def __init__(self, *children):\n        self.children = children\n\n    def tick(self, robot):\n        for child in self.children:\n            status = child.tick(robot)\n            if status != Status.FAILURE:\n                return status\n        return Status.FAILURE\n\n\nclass Condition(Node):\n    \"\"\"A leaf that asks a yes/no question and never changes anything.\"\"\"\n\n    def __init__(self, question):\n        self.question = question\n\n    def tick(self, robot):\n        return Status.SUCCESS if self.question(robot) else Status.FAILURE\n\n\nclass Action(Node):\n    \"\"\"A leaf that does work. It may need several ticks, so it can return RUNNING.\"\"\"\n\n    def __init__(self, work):\n        self.work = work\n\n    def tick(self, robot):\n        return self.work(robot)\n",
            "behavior-tree-py-vacuum/vacuum.py": "# The robot itself: plain state plus small question and work functions for the tree's leaves.\nfrom .nodes import Status\n\n\nclass Robot:\n    def __init__(self):\n        self.battery = 30\n        self.dirty_spots = 3\n        self.at_dock = False\n\n\ndef needs_charge(robot):\n    # Low battery, or already docked and not full yet (so it does not leave half-charged).\n    return robot.battery < 20 or (robot.at_dock and robot.battery < 100)\n\n\ndef has_dirt(robot):\n    return robot.dirty_spots > 0\n\n\ndef go_to_dock(robot):\n    if robot.at_dock:\n        return Status.SUCCESS\n    print(\"  driving to the dock...\")\n    robot.at_dock = True\n    return Status.RUNNING  # takes a tick; the tree will come back here next time\n\n\ndef charge(robot):\n    robot.battery = min(100, robot.battery + 40)\n    print(f\"  charging: {robot.battery}%\")\n    return Status.SUCCESS if robot.battery == 100 else Status.RUNNING\n\n\ndef clean_spot(robot):\n    robot.at_dock = False\n    robot.battery -= 8\n    robot.dirty_spots -= 1\n    print(f\"  cleaned a spot, {robot.dirty_spots} left, battery {robot.battery}%\")\n    return Status.SUCCESS\n\n\ndef idle(robot):\n    print(\"  nothing to do, resting\")\n    return Status.SUCCESS\n"
          }
        },
        {
          "id": "behavior-tree-gd-guard",
          "title": "Godot guard AI: chase, search, patrol",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Five small RefCounted node classes and a guard that builds its tree from Callables to its own methods. Each physics frame the guard ticks the root; the blackboard remembers the last known player position and the patrol index.",
          "roles": {
            "Tree": [
              "behavior-tree-gd-guard/guard.gd#_build_tree",
              "behavior-tree-gd-guard/guard.gd#_physics_process"
            ],
            "Selector": [
              "behavior-tree-gd-guard/bt_selector.gd"
            ],
            "Sequence": [
              "behavior-tree-gd-guard/bt_sequence.gd"
            ],
            "Condition": [
              "behavior-tree-gd-guard/bt_condition.gd",
              "behavior-tree-gd-guard/guard.gd#can_see_target",
              "behavior-tree-gd-guard/guard.gd#has_last_known_position"
            ],
            "Action": [
              "behavior-tree-gd-guard/bt_action.gd",
              "behavior-tree-gd-guard/guard.gd#chase_target",
              "behavior-tree-gd-guard/guard.gd#search_last_position",
              "behavior-tree-gd-guard/guard.gd#patrol"
            ]
          },
          "trace": [
            {
              "at": "behavior-tree-gd-guard/guard.gd#_build_tree",
              "say": "The guard builds its tree once in _ready: a selector over chase, search and patrol. Leaves wrap Callables to the guard's own methods."
            },
            {
              "at": "behavior-tree-gd-guard/guard.gd#_physics_process",
              "say": "Every physics frame the guard ticks the root with itself and its blackboard, then moves with whatever velocity the tree chose."
            },
            {
              "at": "behavior-tree-gd-guard/bt_selector.gd#tick",
              "say": "The selector tries the chase branch first. Only if it fails does it look at searching, then patrolling."
            },
            {
              "at": "behavior-tree-gd-guard/bt_sequence.gd#tick",
              "say": "Each branch is a sequence: its condition must succeed before its action runs."
            },
            {
              "at": "behavior-tree-gd-guard/bt_condition.gd#tick",
              "say": "A condition leaf turns a bool from its Callable into SUCCESS or FAILURE, so any method can become a question."
            },
            {
              "at": "behavior-tree-gd-guard/guard.gd#can_see_target",
              "say": "When the player is in range, the guard also writes their position into the blackboard for the search branch to use later."
            },
            {
              "at": "behavior-tree-gd-guard/guard.gd#search_last_position",
              "say": "Lost sight? The search action walks to the remembered spot and looks around, returning RUNNING until it gives up."
            },
            {
              "at": "behavior-tree-gd-guard/guard.gd#patrol",
              "say": "With nothing else to do, the lowest-priority action walks between patrol points. Seeing the player interrupts it next tick."
            }
          ],
          "files": {
            "behavior-tree-gd-guard/bt_action.gd": "# Action leaf: wraps a Callable that does work and returns SUCCESS, FAILURE or RUNNING.\nclass_name BTAction\nextends BTNode\n\nvar _work: Callable\n\nfunc _init(work: Callable) -> void:\n\t_work = work\n\nfunc tick(actor: Node, blackboard: Dictionary) -> Status:\n\treturn _work.call(actor, blackboard)\n",
            "behavior-tree-gd-guard/bt_condition.gd": "# Condition leaf: wraps a Callable that answers yes or no. It should not change the world.\nclass_name BTCondition\nextends BTNode\n\nvar _check: Callable\n\nfunc _init(check: Callable) -> void:\n\t_check = check\n\nfunc tick(actor: Node, blackboard: Dictionary) -> Status:\n\treturn Status.SUCCESS if _check.call(actor, blackboard) else Status.FAILURE\n",
            "behavior-tree-gd-guard/bt_node.gd": "# Base of every behaviour-tree node. Plain RefCounted objects: the tree is data, not scene nodes.\nclass_name BTNode\nextends RefCounted\n\nenum Status { SUCCESS, FAILURE, RUNNING }\n\n# Called every physics frame for the nodes on the active path. Subclasses override it.\nfunc tick(_actor: Node, _blackboard: Dictionary) -> Status:\n\treturn Status.FAILURE\n",
            "behavior-tree-gd-guard/bt_selector.gd": "# Selector (a \"fallback\"): try children in priority order until one does not fail.\nclass_name BTSelector\nextends BTNode\n\nvar children: Array[BTNode] = []\n\nfunc _init(nodes: Array) -> void:\n\tchildren.assign(nodes)\n\nfunc tick(actor: Node, blackboard: Dictionary) -> Status:\n\tfor child in children:\n\t\tvar status := child.tick(actor, blackboard)\n\t\tif status != Status.FAILURE:\n\t\t\treturn status\n\treturn Status.FAILURE\n",
            "behavior-tree-gd-guard/bt_sequence.gd": "# Sequence: run children in order; any child that does not succeed stops the sequence.\nclass_name BTSequence\nextends BTNode\n\nvar children: Array[BTNode] = []\n\nfunc _init(nodes: Array) -> void:\n\tchildren.assign(nodes)\n\nfunc tick(actor: Node, blackboard: Dictionary) -> Status:\n\tfor child in children:\n\t\tvar status := child.tick(actor, blackboard)\n\t\tif status != Status.SUCCESS:\n\t\t\treturn status\n\treturn Status.SUCCESS\n",
            "behavior-tree-gd-guard/guard.gd": "# A guard: chase the player when seen, search where they were last seen, otherwise patrol.\nextends CharacterBody2D\n\nconst WALK_SPEED := 90.0\nconst CHASE_SPEED := 150.0\nconst SIGHT_RANGE := 260.0\n\n@export var patrol_points: Array[Vector2] = []\n@export var target: Node2D\n\n# The blackboard: memory shared by all nodes of this guard's tree.\nvar blackboard := {\"patrol_index\": 0, \"search_time\": 0.0, \"delta\": 0.0}\nvar tree: BTNode\n\nfunc _ready() -> void:\n\ttree = _build_tree()\n\nfunc _build_tree() -> BTNode:\n\t# Read top to bottom as priorities: the first branch that does not fail wins this tick.\n\treturn BTSelector.new([\n\t\tBTSequence.new([BTCondition.new(can_see_target), BTAction.new(chase_target)]),\n\t\tBTSequence.new([BTCondition.new(has_last_known_position), BTAction.new(search_last_position)]),\n\t\tBTAction.new(patrol),\n\t])\n\nfunc _physics_process(delta: float) -> void:\n\tblackboard[\"delta\"] = delta\n\ttree.tick(self, blackboard)\n\tmove_and_slide()\n\nfunc can_see_target(_actor: Node, bb: Dictionary) -> bool:\n\tif target == null:\n\t\treturn false\n\tvar seen := global_position.distance_to(target.global_position) <= SIGHT_RANGE\n\tif seen:\n\t\tbb[\"last_known_position\"] = target.global_position\n\t\tbb[\"search_time\"] = 3.0\n\treturn seen\n\nfunc chase_target(_actor: Node, _bb: Dictionary) -> BTNode.Status:\n\tvelocity = global_position.direction_to(target.global_position) * CHASE_SPEED\n\treturn BTNode.Status.RUNNING\n\nfunc has_last_known_position(_actor: Node, bb: Dictionary) -> bool:\n\treturn bb.has(\"last_known_position\")\n\nfunc search_last_position(_actor: Node, bb: Dictionary) -> BTNode.Status:\n\tvar spot: Vector2 = bb[\"last_known_position\"]\n\tif global_position.distance_to(spot) > 8.0:\n\t\tvelocity = global_position.direction_to(spot) * WALK_SPEED\n\t\treturn BTNode.Status.RUNNING\n\t# Arrived: look around for a few seconds, then give up and forget the spot.\n\tvelocity = Vector2.ZERO\n\tbb[\"search_time\"] -= bb[\"delta\"]\n\tif bb[\"search_time\"] > 0.0:\n\t\treturn BTNode.Status.RUNNING\n\tbb.erase(\"last_known_position\")\n\treturn BTNode.Status.SUCCESS\n\nfunc patrol(_actor: Node, bb: Dictionary) -> BTNode.Status:\n\tif patrol_points.is_empty():\n\t\tvelocity = Vector2.ZERO\n\t\treturn BTNode.Status.SUCCESS\n\tvar point := patrol_points[bb[\"patrol_index\"]]\n\tif global_position.distance_to(point) < 8.0:\n\t\tbb[\"patrol_index\"] = (bb[\"patrol_index\"] + 1) % patrol_points.size()\n\tvelocity = global_position.direction_to(point) * WALK_SPEED\n\treturn BTNode.Status.RUNNING\n"
          }
        },
        {
          "id": "behavior-tree-behavior3-real",
          "title": "behavior3js: ticks, open nodes and the blackboard",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "behavior3/behavior3js",
            "url": "https://github.com/behavior3/behavior3js/blob/0.2.2/src/core/BaseNode.js",
            "license": "MIT",
            "note": "b3/core/BaseNode.js, b3/core/BehaviorTree.js, b3/composites/Sequence.js, b3/composites/Priority.js and b3/constants.js are verbatim from behavior3js 0.2.2 (src/), with doc comments, load() and dump() trimmed (marked). guard.js was written for Software City and imports Action, Condition and Blackboard from the package."
          },
          "story": "A well-known JavaScript behaviour-tree library. Every node runs through _execute: enter, open (only if not already open), tick, close (unless RUNNING), exit. The tree remembers which nodes were open and closes the ones a new decision skipped.",
          "roles": {
            "Tree": [
              "behavior-tree-behavior3-real/b3/core/BehaviorTree.js#tick",
              "behavior-tree-behavior3-real/guard.js#buildTree"
            ],
            "Selector": [
              "behavior-tree-behavior3-real/b3/composites/Priority.js#tick"
            ],
            "Sequence": [
              "behavior-tree-behavior3-real/b3/composites/Sequence.js#tick"
            ],
            "Condition": [
              "behavior-tree-behavior3-real/guard.js#EnemyVisible"
            ],
            "Action": [
              "behavior-tree-behavior3-real/guard.js#Shoot",
              "behavior-tree-behavior3-real/guard.js#Patrol"
            ]
          },
          "trace": [
            {
              "at": "behavior-tree-behavior3-real/guard.js#buildTree",
              "say": "The guard's tree: a Priority (selector) over 'enemy visible, then shoot' and 'patrol'. Custom leaves extend the library's Condition and Action."
            },
            {
              "at": "behavior-tree-behavior3-real/b3/core/BehaviorTree.js#tick",
              "say": "tree.tick() packs target, blackboard and tree into a Tick object and executes the root. One tree can serve many agents."
            },
            {
              "at": "behavior-tree-behavior3-real/b3/core/BaseNode.js#_execute",
              "say": "Every node goes through the same lifecycle. open() runs only if the blackboard says this node is not already open for this tree."
            },
            {
              "at": "behavior-tree-behavior3-real/b3/composites/Priority.js#tick",
              "say": "Priority ticks children until one does not fail. The enemy is far away, so the first sequence fails and Patrol runs."
            },
            {
              "at": "behavior-tree-behavior3-real/guard.js#Patrol.tick",
              "say": "Patrol counts its steps in the blackboard, scoped by tree and node id, and returns RUNNING, so it stays open between ticks."
            },
            {
              "at": "behavior-tree-behavior3-real/b3/composites/Sequence.js#tick",
              "say": "Frames later the enemy is within 6 m. The sequence's condition succeeds and Shoot runs; the higher-priority branch wins."
            },
            {
              "at": "behavior-tree-behavior3-real/b3/core/BehaviorTree.js#tick",
              "say": "After the root returns, the tree compares last tick's open nodes with this tick's. Patrol was not reached, so it gets closed."
            },
            {
              "at": "behavior-tree-behavior3-real/guard.js#Patrol.close",
              "say": "close() lets the interrupted action clean up. Its open() will run again next time patrolling starts fresh."
            }
          ],
          "files": {
            "behavior-tree-behavior3-real/b3/composites/Priority.js": "// Source: behavior3js 0.2.2 — https://github.com/behavior3/behavior3js/blob/0.2.2/src/composites/Priority.js\n// MIT License, Copyright (c) 2015 Renato de Pontes Pereira. Included for study.\nimport {Class} from '../b3.functions';\nimport Composite from '../core/Composite';\nimport {FAILURE} from '../constants';\n\n/**\n * Priority ticks its children sequentially until one of them returns\n * `SUCCESS`, `RUNNING` or `ERROR`. If all children return the failure state,\n * the priority also returns `FAILURE`.\n *\n * @module b3\n * @class Priority\n * @extends Composite\n **/\n\nexport default Class(Composite, {\n\n  /**\n   * Node name. Default to `Priority`.\n   * @property {String} name\n   * @readonly\n   **/\n  name: 'Priority',\n\n  /**\n   * Tick method.\n   * @method tick\n   * @param {Tick} tick A tick instance.\n   * @return {Constant} A state constant.\n   **/\n  tick: function(tick) {\n    for (var i=0; i<this.children.length; i++) {\n      var status = this.children[i]._execute(tick);\n\n      if (status !== FAILURE) {\n        return status;\n      }\n    }\n\n    return FAILURE;\n  }\n});\n",
            "behavior-tree-behavior3-real/b3/composites/Sequence.js": "// Source: behavior3js 0.2.2 — https://github.com/behavior3/behavior3js/blob/0.2.2/src/composites/Sequence.js\n// MIT License, Copyright (c) 2015 Renato de Pontes Pereira. Included for study.\nimport {Class} from '../b3.functions';\nimport Composite from '../core/Composite';\nimport {SUCCESS} from '../constants';\n\n/**\n * The Sequence node ticks its children sequentially until one of them\n * returns `FAILURE`, `RUNNING` or `ERROR`. If all children return the\n * success state, the sequence also returns `SUCCESS`.\n *\n * @module b3\n * @class Sequence\n * @extends Composite\n **/\n\nexport default Class(Composite, {\n\n  /**\n   * Node name. Default to `Sequence`.\n   * @property {String} name\n   * @readonly\n   **/\n  name: 'Sequence',\n\n  /**\n   * Tick method.\n   * @method tick\n   * @param {b3.Tick} tick A tick instance.\n   * @return {Constant} A state constant.\n   **/\n  tick: function(tick) {\n    for (var i=0; i<this.children.length; i++) {\n      var status = this.children[i]._execute(tick);\n\n      if (status !== SUCCESS) {\n        return status;\n      }\n    }\n\n    return SUCCESS;\n  }\n});\n",
            "behavior-tree-behavior3-real/b3/constants.js": "// Source: behavior3js 0.2.2 — https://github.com/behavior3/behavior3js/blob/0.2.2/src/constants.js\n// MIT License, Copyright (c) 2015 Renato de Pontes Pereira. Included for study.\nexport const VERSION = '0.2.2';\nexport const SUCCESS = 1;\nexport const FAILURE = 2;\nexport const RUNNING = 3;\nexport const ERROR = 4;\nexport const COMPOSITE = 'composite';\nexport const DECORATOR = 'decorator';\nexport const ACTION = 'action';\nexport const CONDITION = 'condition';\n",
            "behavior-tree-behavior3-real/b3/core/BaseNode.js": "// Source: behavior3js 0.2.2 — https://github.com/behavior3/behavior3js/blob/0.2.2/src/core/BaseNode.js\n// MIT License, Copyright (c) 2015 Renato de Pontes Pereira. Included for study.\nimport {Class, createUUID} from '../b3.functions';\nimport {RUNNING} from '../constants';\n\n/**\n * The BaseNode class is used as super class to all nodes in BehaviorJS. It\n * comprises all common variables and methods that a node must have to\n * execute.\n *\n * **IMPORTANT:** Do not inherit from this class, use `Composite`,\n * `Decorator`, `Action` or `Condition`, instead.\n *\n * The attributes are specially designed to serialization of the node in a\n * JSON format. In special, the `parameters` attribute can be set into the\n * visual editor (thus, in the JSON file), and it will be used as parameter\n * on the node initialization at `BehaviorTree.load`.\n *\n * BaseNode also provide 5 callback methods, which the node implementations\n * can override. They are `enter`, `open`, `tick`, `close` and `exit`. See\n * their documentation to know more. These callbacks are called inside the\n * `_execute` method, which is called in the tree traversal.\n *\n * @module b3\n * @class BaseNode\n **/\n\nexport default Class(null, {\n\n  // … trimmed: 67 lines: documented null defaults for id, name, category, title, description, parameters and properties …\n  /**\n   * Initialization method.\n   * @method initialize\n   * @constructor\n   **/\n  initialize: function(params) {\n    this.id          = createUUID();\n    this.title       = this.title || this.name;\n    this.description = '';\n    this.parameters  = {};\n    this.properties  = {};\n  },\n\n  /**\n   * This is the main method to propagate the tick signal to this node. This\n   * method calls all callbacks: `enter`, `open`, `tick`, `close`, and\n   * `exit`. It only opens a node if it is not already open. In the same\n   * way, this method only close a node if the node  returned a status\n   * different of `RUNNING`.\n   *\n   * @method _execute\n   * @param {Tick} tick A tick instance.\n   * @return {Constant} The tick state.\n   * @protected\n   **/\n  _execute: function(tick) {\n    // ENTER\n    this._enter(tick);\n\n    // OPEN\n    if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {\n      this._open(tick);\n    }\n\n    // TICK\n    var status = this._tick(tick);\n\n    // CLOSE\n    if (status !== RUNNING) {\n      this._close(tick);\n    }\n\n    // EXIT\n    this._exit(tick);\n\n    return status;\n  },\n\n  /**\n   * Wrapper for enter method.\n   * @method _enter\n   * @param {Tick} tick A tick instance.\n   * @protected\n   **/\n  _enter: function(tick) {\n    tick._enterNode(this);\n    this.enter(tick);\n  },\n\n  /**\n   * Wrapper for open method.\n   * @method _open\n   * @param {Tick} tick A tick instance.\n   * @protected\n   **/\n  _open: function(tick) {\n    tick._openNode(this);\n    tick.blackboard.set('isOpen', true, tick.tree.id, this.id);\n    this.open(tick);\n  },\n\n  /**\n   * Wrapper for tick method.\n   * @method _tick\n   * @param {Tick} tick A tick instance.\n   * @return {Constant} A state constant.\n   * @protected\n   **/\n  _tick: function(tick) {\n    tick._tickNode(this);\n    return this.tick(tick);\n  },\n\n  /**\n   * Wrapper for close method.\n   * @method _close\n   * @param {Tick} tick A tick instance.\n   * @protected\n   **/\n  _close: function(tick) {\n    tick._closeNode(this);\n    tick.blackboard.set('isOpen', false, tick.tree.id, this.id);\n    this.close(tick);\n  },\n\n  /**\n   * Wrapper for exit method.\n   * @method _exit\n   * @param {Tick} tick A tick instance.\n   * @protected\n   **/\n  _exit: function(tick) {\n    tick._exitNode(this);\n    this.exit(tick);\n  },\n\n  /**\n   * Enter method, override this to use. It is called every time a node is\n   * asked to execute, before the tick itself.\n   *\n   * @method enter\n   * @param {Tick} tick A tick instance.\n   **/\n  enter: function(tick) {},\n\n  /**\n   * Open method, override this to use. It is called only before the tick\n   * callback and only if the not isn't closed.\n   *\n   * Note: a node will be closed if it returned `RUNNING` in the tick.\n   *\n   * @method open\n   * @param {Tick} tick A tick instance.\n   **/\n  open: function(tick) {},\n\n  /**\n   * Tick method, override this to use. This method must contain the real\n   * execution of node (perform a task, call children, etc.). It is called\n   * every time a node is asked to execute.\n   *\n   * @method tick\n   * @param {Tick} tick A tick instance.\n   **/\n  tick: function(tick) {},\n\n  /**\n   * Close method, override this to use. This method is called after the tick\n   * callback, and only if the tick return a state different from\n   * `RUNNING`.\n   *\n   * @method close\n   * @param {Tick} tick A tick instance.\n   **/\n  close: function(tick) {},\n\n  /**\n   * Exit method, override this to use. Called every time in the end of the\n   * execution.\n   *\n   * @method exit\n   * @param {Tick} tick A tick instance.\n   **/\n  exit: function(tick) {},\n});\n",
            "behavior-tree-behavior3-real/b3/core/BehaviorTree.js": "// Source: behavior3js 0.2.2 — https://github.com/behavior3/behavior3js/blob/0.2.2/src/core/BehaviorTree.js\n// MIT License, Copyright (c) 2015 Renato de Pontes Pereira. Included for study.\nimport {Class, createUUID} from '../b3.functions';\nimport {COMPOSITE, DECORATOR} from '../constants';\nimport * as Decorators from '../decorators';\nimport * as Composites from '../composites';\nimport * as Actions from '../actions';\nimport Tick from './Tick';\n\n/**\n * The BehaviorTree class, as the name implies, represents the Behavior Tree\n * structure.\n *\n * There are two ways to construct a Behavior Tree: by manually setting the\n * root node, or by loading it from a data structure (which can be loaded\n * from a JSON). Both methods are shown in the examples below and better\n * explained in the user guide.\n *\n * The tick method must be called periodically, in order to send the tick\n * signal to all nodes in the tree, starting from the root. The method\n * `BehaviorTree.tick` receives a target object and a blackboard as\n * parameters. The target object can be anything: a game agent, a system, a\n * DOM object, etc. This target is not used by any piece of Behavior3JS,\n * i.e., the target object will only be used by custom nodes.\n *\n * The blackboard is obligatory and must be an instance of `Blackboard`. This\n * requirement is necessary due to the fact that neither `BehaviorTree` or\n * any node will store the execution variables in its own object (e.g., the\n * BT does not store the target, information about opened nodes or number of\n * times the tree was called). But because of this, you only need a single\n * tree instance to control multiple (maybe hundreds) objects.\n *\n * Manual construction of a Behavior Tree\n * --------------------------------------\n *\n *     var tree = new b3.BehaviorTree();\n *\n *     tree.root = new b3.Sequence({children:[\n *       new b3.Priority({children:[\n *         new MyCustomNode(),\n *         new MyCustomNode()\n *       ]}),\n *       ...\n *     ]});\n *\n * … trimmed: 23 lines: example of loading a tree from a JSON structure, and the @module tag …\n * @class BehaviorTree\n **/\n\nexport default Class(null, {\n\n  /**\n   * The tree id, must be unique. By default, created with `createUUID`.\n   * @property {String} id\n   * @readOnly\n   **/\n  id: null,\n\n  /**\n   * The tree title.\n   * @property {String} title\n   * @readonly\n   **/\n  title: null,\n\n  /**\n   * Description of the tree.\n   * @property {String} description\n   * @readonly\n   **/\n  description: null,\n\n  /**\n   * A dictionary with (key-value) properties. Useful to define custom\n   * variables in the visual editor.\n   *\n   * @property {Object} properties\n   * @readonly\n   **/\n  properties: null,\n\n  /**\n   * The reference to the root node. Must be an instance of `BaseNode`.\n   * @property {BaseNode} root\n   **/\n  root: null,\n\n  /**\n   * The reference to the debug instance.\n   * @property {Object} debug\n   **/\n  debug: null,\n\n  /**\n   * Initialization method.\n   * @method initialize\n   * @constructor\n   **/\n  initialize: function() {\n    this.id          = createUUID();\n    this.title       = 'The behavior tree';\n    this.description = 'Default description';\n    this.properties  = {};\n    this.root        = null;\n    this.debug       = null;\n  },\n\n  // … trimmed: 151 lines: load() and dump(), which convert the tree to and from JSON for the visual editor …\n  /**\n   * Propagates the tick signal through the tree, starting from the root.\n   *\n   * This method receives a target object of any type (Object, Array,\n   * DOMElement, whatever) and a `Blackboard` instance. The target object has\n   * no use at all for all Behavior3JS components, but surely is important\n   * for custom nodes. The blackboard instance is used by the tree and nodes\n   * to store execution variables (e.g., last node running) and is obligatory\n   * to be a `Blackboard` instance (or an object with the same interface).\n   *\n   * Internally, this method creates a Tick object, which will store the\n   * target and the blackboard objects.\n   *\n   * Note: BehaviorTree stores a list of open nodes from last tick, if these\n   * nodes weren't called after the current tick, this method will close them\n   * automatically.\n   *\n   * @method tick\n   * @param {Object} target A target object.\n   * @param {Blackboard} blackboard An instance of blackboard object.\n   * @return {Constant} The tick signal state.\n   **/\n  tick: function(target, blackboard) {\n    if (!blackboard) {\n      throw 'The blackboard parameter is obligatory and must be an ' +\n        'instance of b3.Blackboard';\n    }\n\n    /* CREATE A TICK OBJECT */\n    var tick = new Tick();\n    tick.debug      = this.debug;\n    tick.target     = target;\n    tick.blackboard = blackboard;\n    tick.tree       = this;\n\n    /* TICK NODE */\n    var state = this.root._execute(tick);\n\n    /* CLOSE NODES FROM LAST TICK, IF NEEDED */\n    var lastOpenNodes = blackboard.get('openNodes', this.id);\n    var currOpenNodes = tick._openNodes.slice(0);\n\n    // does not close if it is still open in this tick\n    var start = 0;\n    var i;\n    for (i=0; i<Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {\n      start = i+1;\n      if (lastOpenNodes[i] !== currOpenNodes[i]) {\n        break;\n      }\n    }\n\n    // close the nodes\n    for (i=lastOpenNodes.length-1; i>=start; i--) {\n      lastOpenNodes[i]._close(tick);\n    }\n\n    /* POPULATE BLACKBOARD */\n    blackboard.set('openNodes', currOpenNodes, this.id);\n    blackboard.set('nodeCount', tick._nodeCount, this.id);\n\n    return state;\n  }\n});\n",
            "behavior-tree-behavior3-real/guard.js": "// Written for Software City (not part of behavior3js): a guard AI built from behavior3js nodes.\n// Action, Condition and Blackboard come from the same package but are not included in this demo.\nimport BehaviorTree from './b3/core/BehaviorTree';\nimport Sequence from './b3/composites/Sequence';\nimport Priority from './b3/composites/Priority';\nimport { SUCCESS, FAILURE, RUNNING } from './b3/constants';\nimport { Action, Condition, Blackboard } from 'behavior3js';\n\nclass EnemyVisible extends Condition {\n  tick(tick) {\n    // tick.target is whatever object was passed to tree.tick(): here, the guard.\n    return tick.target.canSeeEnemy() ? SUCCESS : FAILURE;\n  }\n}\n\nclass Shoot extends Action {\n  tick(tick) {\n    tick.target.log('bang!');\n    return SUCCESS;\n  }\n}\n\nclass Patrol extends Action {\n  open(tick) {\n    // Runs only when the node starts fresh, not on every tick while it is RUNNING.\n    tick.blackboard.set('steps', 0, tick.tree.id, this.id);\n    tick.target.log('starts patrolling');\n  }\n\n  tick(tick) {\n    const steps = tick.blackboard.get('steps', tick.tree.id, this.id) + 1;\n    tick.blackboard.set('steps', steps, tick.tree.id, this.id);\n    tick.target.log('patrol step ' + steps);\n    return RUNNING; // patrolling never finishes by itself\n  }\n\n  close(tick) {\n    tick.target.log('stops patrolling');\n  }\n}\n\nclass Guard {\n  constructor() {\n    this.enemyDistance = 12;\n  }\n\n  canSeeEnemy() {\n    return this.enemyDistance <= 6;\n  }\n\n  log(text) {\n    console.log('  guard ' + text + ' (enemy at ' + this.enemyDistance + ' m)');\n  }\n}\n\nfunction buildTree() {\n  const tree = new BehaviorTree();\n  // Priority is behavior3's name for a selector: the first child that does not fail wins.\n  tree.root = new Priority({ children: [\n    new Sequence({ children: [new EnemyVisible(), new Shoot()] }),\n    new Patrol()\n  ] });\n  return tree;\n}\n\nfunction main() {\n  const tree = buildTree();\n  const blackboard = new Blackboard(); // one blackboard per agent; the tree itself can be shared\n  const guard = new Guard();\n  for (let frame = 0; frame < 5; frame++) {\n    console.log('frame ' + frame);\n    tree.tick(guard, blackboard);\n    guard.enemyDistance -= 2; // the enemy walks closer\n  }\n}\n\nmain();\n"
          }
        }
      ]
    }
  ]
};
