// Family: Creational. 6 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Creational"
  ],
  "patterns": [
    {
      "id": "singleton",
      "name": "Singleton",
      "family": "Creational",
      "aka": [
        "Autoload",
        "Global instance"
      ],
      "tagline": "Exactly one instance of a class, reachable from anywhere. Handy, and easy to overuse.",
      "intent": "Make sure a class has only one instance and give the whole program one well-known way to reach it. The class creates the instance lazily on first use and returns the same object on every later request. The price is global mutable state: any code can change it, and every user of it hides a dependency that tests must reset.",
      "analogy": "A town has one town hall. Everybody knows where it is and anyone can walk in and change a record, which is convenient until a record changes and nobody knows who did it.",
      "cityShape": "Look for one building that every other building points an import arc at, like a town hall in the middle of the district. Its access floor (get_instance, getLogger or the autoload's methods) receives call pipes from all around the city, while the singleton itself calls almost nobody back.",
      "roles": [
        {
          "name": "Singleton",
          "desc": "The class with exactly one instance. It holds the shared state."
        },
        {
          "name": "Access Point",
          "desc": "The one well-known way to get the instance: a static get_instance(), a module function, or a Godot autoload name. It creates the instance the first time."
        },
        {
          "name": "Client",
          "desc": "Any code that grabs the instance and reads or changes it. Each client quietly depends on global state."
        }
      ],
      "whenToUse": [
        "There really is one of something for the whole process: a logging hub, a configuration loaded once, a game's save-data manager.",
        "Many distant parts of a program need the same object and passing it through every call would be noise.",
        "In Godot, an autoload for state that must survive scene changes (score, settings, audio bus manager)."
      ],
      "pitfalls": [
        "It is global mutable state with a nicer name: any code can change it, so bugs show up far from their cause.",
        "Hidden dependencies hurt tests. A function that calls get_instance() cannot be tested in isolation, and state leaks from one test into the next unless you reset it.",
        "Often the better design is to create one instance at startup and pass it in (dependency injection). You still get 'only one', without the global access."
      ],
      "related": [
        "dependency-injection",
        "object-pool",
        "abstract-factory",
        "flyweight",
        "facade"
      ],
      "quiz": [
        {
          "q": "Two unit tests both call greet(), which reads Settings.get_instance(). The second test passes alone but fails when run after the first. Why?",
          "options": [
            "get_instance() creates a new Settings each time",
            "The first test changed the single shared instance and that change is still there",
            "Python runs tests in parallel",
            "greet() caches its result"
          ],
          "answer": 1,
          "why": "There is one instance for the whole process, so state written by one test leaks into the next unless something resets it. That is the main testing cost of a singleton."
        },
        {
          "q": "What is the usual way to keep 'only one instance' but drop the downsides of a singleton?",
          "options": [
            "Make every field static",
            "Create the object once at startup and pass it to the code that needs it",
            "Copy the instance into every module",
            "Use a global variable instead of a class"
          ],
          "answer": 1,
          "why": "Passing the one instance in (dependency injection) keeps a single object while making dependencies visible and letting tests pass in their own instance."
        }
      ],
      "demos": [
        {
          "id": "singleton-py-settings",
          "title": "App settings, and why tests hate them",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Settings.get_instance() always returns the same object, so a change in main() shows up in greet(). The test file shows the cost: one test's change leaks into the next, and the version that passes settings in needs no reset at all.",
          "roles": {
            "Singleton": [
              "singleton-py-settings/settings.py#Settings"
            ],
            "Access Point": [
              "singleton-py-settings/settings.py#Settings.get_instance"
            ],
            "Client": [
              "singleton-py-settings/main.py#main",
              "singleton-py-settings/greeting.py#greet",
              "singleton-py-settings/theme.py#page_background",
              "singleton-py-settings/test_greeting.py#test_default_greeting"
            ]
          },
          "trace": [
            {
              "at": "singleton-py-settings/main.py#main",
              "say": "main() asks for the settings twice. Both names end up pointing at one object, so `a is b` prints True."
            },
            {
              "at": "singleton-py-settings/settings.py#Settings.get_instance",
              "say": "The first call creates the instance and stores it on the class. Every later call skips creation and returns the stored one."
            },
            {
              "at": "singleton-py-settings/greeting.py#greet",
              "say": "greet() fetches the same instance and sees the language main() changed. Nothing in its signature warns you it reads global state."
            },
            {
              "at": "singleton-py-settings/theme.py#page_background",
              "say": "Another distant reader of the same object. Every client of the singleton is coupled to every writer."
            },
            {
              "at": "singleton-py-settings/test_greeting.py#test_german_greeting",
              "say": "This test writes 'de' into the shared instance and never puts it back."
            },
            {
              "at": "singleton-py-settings/test_greeting.py#test_default_greeting",
              "say": "So the next test must call reset_for_tests() first, a back door that only exists because the state is global."
            },
            {
              "at": "singleton-py-settings/test_greeting.py#test_without_the_singleton",
              "say": "The alternative: build a Settings and pass it to greet_with(). No shared state, no reset, and the dependency is visible."
            }
          ],
          "files": {
            "singleton-py-settings/greeting.py": "from .settings import Settings\n\n\ndef greet(name):\n    # Hidden dependency: nothing in the signature says this reads global settings.\n    settings = Settings.get_instance()\n    if settings.language == \"de\":\n        return \"Hallo, \" + name\n    return \"Hello, \" + name\n\n\ndef greet_with(settings, name):\n    # The honest alternative: the caller passes the settings in.\n    if settings.language == \"de\":\n        return \"Hallo, \" + name\n    return \"Hello, \" + name\n",
            "singleton-py-settings/main.py": "from .settings import Settings\nfrom .greeting import greet\nfrom .theme import page_background\n\n\ndef main():\n    a = Settings.get_instance()\n    b = Settings.get_instance()\n    print(a is b)  # True: both names point at the same object\n\n    a.language = \"de\"\n    a.dark_mode = True\n    print(greet(\"Theo\"))       # \"Hallo, Theo\": greet() sees a change made far away\n    print(page_background())   # \"#111111\"\n\n\nmain()\n",
            "singleton-py-settings/settings.py": "# The Singleton: one shared Settings object for the whole program.\nclass Settings:\n    _instance = None\n\n    def __init__(self):\n        self.language = \"en\"\n        self.dark_mode = False\n\n    @classmethod\n    def get_instance(cls):\n        # The access point: create the object the first time, then always return it.\n        if cls._instance is None:\n            cls._instance = cls()\n        return cls._instance\n\n    @classmethod\n    def reset_for_tests(cls):\n        # A warning sign: tests need a back door to wipe the global state.\n        cls._instance = None\n",
            "singleton-py-settings/test_greeting.py": "from .settings import Settings\nfrom .greeting import greet, greet_with\n\n\ndef test_german_greeting():\n    Settings.get_instance().language = \"de\"\n    assert greet(\"Ana\") == \"Hallo, Ana\"\n\n\ndef test_default_greeting():\n    # Without this reset the test fails whenever it runs after the one above.\n    Settings.reset_for_tests()\n    assert greet(\"Ana\") == \"Hello, Ana\"\n\n\ndef test_without_the_singleton():\n    # No global state to reset: build exactly the settings this test needs.\n    settings = Settings()\n    settings.language = \"de\"\n    assert greet_with(settings, \"Ana\") == \"Hallo, Ana\"\n",
            "singleton-py-settings/theme.py": "from .settings import Settings\n\n\ndef page_background():\n    settings = Settings.get_instance()\n    if settings.dark_mode:\n        return \"#111111\"\n    return \"#ffffff\"\n"
          }
        },
        {
          "id": "singleton-gd-autoload",
          "title": "Godot autoload: GameState",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Godot's autoloads are singletons: the engine creates one GameState node at startup and every script can call it by name. Coins, the HUD, the shop and the menu all share it. Notice how many scripts write to it, and that the menu must remember to reset it.",
          "roles": {
            "Singleton": [
              "singleton-gd-autoload/game_state.gd"
            ],
            "Access Point": [
              "singleton-gd-autoload/game_state.gd#add_coins",
              "singleton-gd-autoload/game_state.gd#spend_coins",
              "singleton-gd-autoload/game_state.gd#reset"
            ],
            "Client": [
              "singleton-gd-autoload/coin.gd#_on_body_entered",
              "singleton-gd-autoload/hud.gd#_ready",
              "singleton-gd-autoload/shop.gd#_on_buy_potion_pressed",
              "singleton-gd-autoload/main_menu.gd#_on_new_game_pressed"
            ]
          },
          "trace": [
            {
              "at": "singleton-gd-autoload/hud.gd#_ready",
              "say": "The HUD reaches GameState by its autoload name and connects to coins_changed. No reference was passed in; the name is global."
            },
            {
              "at": "singleton-gd-autoload/coin.gd#_on_body_entered",
              "say": "A coin adds itself to the global total. Handy, but coin.tscn now crashes if you run it alone without the autoload."
            },
            {
              "at": "singleton-gd-autoload/game_state.gd#add_coins",
              "say": "The single instance updates its state and emits a signal, so the HUD redraws without the coin knowing about the HUD."
            },
            {
              "at": "singleton-gd-autoload/shop.gd#_on_buy_potion_pressed",
              "say": "The shop writes to the same state. When the coin count is wrong, every script in the project is a suspect."
            },
            {
              "at": "singleton-gd-autoload/game_state.gd#spend_coins",
              "say": "Keeping the rules (no negative coins) inside the singleton helps: writers must go through methods, not poke the field."
            },
            {
              "at": "singleton-gd-autoload/main_menu.gd#_on_new_game_pressed",
              "say": "Autoloads survive scene changes, which is why they exist, and also why a new game must call reset() or inherit last run's coins."
            },
            {
              "at": "singleton-gd-autoload/game_state.gd#reset",
              "say": "reset() puts everything back. Forgetting one field here is a classic singleton bug."
            }
          ],
          "files": {
            "singleton-gd-autoload/coin.gd": "extends Area2D\n\n@export var value := 1\n\n# Any script can reach the autoload by name. Convenient, but the scene now\n# only works when GameState exists: run coin.tscn on its own and it crashes.\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.is_in_group(\"player\"):\n\t\tGameState.add_coins(value)\n\t\tqueue_free()\n",
            "singleton-gd-autoload/game_state.gd": "extends Node\n\n# Registered in Project Settings > Autoload as \"GameState\".\n# Godot creates exactly one instance at startup and every script can reach it by name.\n# No class_name here: the autoload name is the global access point.\n\nsignal coins_changed(total: int)\n\nconst START_LIVES := 3\n\nvar coins := 0\nvar lives := START_LIVES\nvar unlocked_levels: Array[String] = [\"level_1\"]\n\nfunc add_coins(amount: int) -> void:\n\tcoins += amount\n\tcoins_changed.emit(coins)\n\nfunc spend_coins(price: int) -> bool:\n\tif coins < price:\n\t\treturn false\n\tcoins -= price\n\tcoins_changed.emit(coins)\n\treturn true\n\nfunc reset() -> void:\n\t# Easy to forget: global state survives scene changes, so a new run must clear it.\n\tcoins = 0\n\tlives = START_LIVES\n\tunlocked_levels = [\"level_1\"]\n\tcoins_changed.emit(coins)\n",
            "singleton-gd-autoload/hud.gd": "extends CanvasLayer\n\n@onready var coin_label: Label = $CoinLabel\n\n# The HUD reads the same single instance the coins write to.\nfunc _ready() -> void:\n\tGameState.coins_changed.connect(_on_coins_changed)\n\t_on_coins_changed(GameState.coins)\n\nfunc _on_coins_changed(total: int) -> void:\n\tcoin_label.text = \"Coins: %d\" % total\n",
            "singleton-gd-autoload/main_menu.gd": "extends Control\n\nfunc _on_new_game_pressed() -> void:\n\t# Forget this line and the new run starts with last run's coins.\n\tGameState.reset()\n\tget_tree().change_scene_to_file(\"res://levels/level_1.tscn\")\n",
            "singleton-gd-autoload/shop.gd": "extends Control\n\nconst POTION_PRICE := 5\n\n@onready var message: Label = $Message\n\nfunc _on_buy_potion_pressed() -> void:\n\t# The shop changes global state too. When coins go wrong, who did it?\n\t# Every script in the project is a suspect, which is the real cost of a singleton.\n\tif GameState.spend_coins(POTION_PRICE):\n\t\tmessage.text = \"You bought a potion.\"\n\telse:\n\t\tmessage.text = \"Not enough coins.\"\n"
          }
        },
        {
          "id": "singleton-logging-real",
          "title": "Python's logging.getLogger()",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/logging/__init__.py",
            "license": "PSF-2.0",
            "note": "logging/__init__.py is CPython 3.12.7 code trimmed to the getLogger/Manager path (cuts are marked). app.py and db.py were written for Software City."
          },
          "story": "The standard library keeps one root logger and one Manager per process, and getLogger(name) returns the same Logger for the same name: a registry of singletons. Notice the lock around creation and the PlaceHolder trick for building the dotted hierarchy.",
          "roles": {
            "Singleton": [
              "singleton-logging-real/logging/__init__.py#Manager",
              "singleton-logging-real/logging/__init__.py#RootLogger"
            ],
            "Access Point": [
              "singleton-logging-real/logging/__init__.py#getLogger",
              "singleton-logging-real/logging/__init__.py#Manager.getLogger"
            ],
            "Client": [
              "singleton-logging-real/app.py#run",
              "singleton-logging-real/db.py#save_order"
            ]
          },
          "trace": [
            {
              "at": "singleton-logging-real/app.py#run",
              "say": "run() asks for 'shop.db' twice. Any module anywhere that asks for that name gets the same object, which is why logging config applies everywhere."
            },
            {
              "at": "singleton-logging-real/logging/__init__.py#getLogger",
              "say": "The public access point. No name means the one root logger; any other name is passed to the single Manager stored on Logger.manager."
            },
            {
              "at": "singleton-logging-real/logging/__init__.py#Manager.getLogger",
              "say": "The Manager looks the name up in loggerDict and only creates a Logger if it is missing. That lookup-or-create is the heart of every singleton."
            },
            {
              "at": "singleton-logging-real/logging/__init__.py#_acquireLock",
              "say": "Creation happens under a lock, so two threads asking at once cannot create two loggers for one name. Lazy singletons need this care."
            },
            {
              "at": "singleton-logging-real/logging/__init__.py#Manager._fixupParents",
              "say": "New loggers are wired to their parent ('shop.db' to 'shop'), using PlaceHolders for parents that do not exist yet."
            },
            {
              "at": "singleton-logging-real/logging/__init__.py#Manager._fixupChildren",
              "say": "When 'shop' is finally requested, its PlaceHolder is replaced and the waiting children are re-pointed at the real logger."
            },
            {
              "at": "singleton-logging-real/db.py#save_order",
              "say": "db.py grabbed its logger at import time. Same object as in app.py, so a level set in one place affects both."
            }
          ],
          "files": {
            "singleton-logging-real/app.py": "# Example usage written for Software City (not part of CPython).\n# In a real project you would write `import logging`; the relative import lets Software City draw the arrow.\nfrom .logging import getLogger, root\nfrom .db import save_order\n\n\ndef run():\n    # Two calls with the same name: the Manager returns the very same Logger object.\n    a = getLogger(\"shop.db\")\n    b = getLogger(\"shop.db\")\n    print(a is b)  # True\n\n    # \"shop\" is created after its child, so the Manager swaps out a PlaceHolder.\n    shop = getLogger(\"shop\")\n    print(a.parent is shop)  # True\n\n    # No name at all gives the single root logger.\n    print(getLogger() is root)  # True\n    save_order(42)\n",
            "singleton-logging-real/db.py": "# Example usage written for Software City (not part of CPython).\n# In a real project you would write `import logging`; the relative import lets Software City draw the arrow.\nfrom .logging import getLogger\n\n# Module-level: this runs once, when db.py is first imported.\nlog = getLogger(\"shop.db\")\n\n\ndef save_order(order_id):\n    log.info(\"saving order %s\", order_id)\n    return order_id\n",
            "singleton-logging-real/logging/__init__.py": "# Source: CPython 3.12.7 Lib/logging — https://github.com/python/cpython/blob/v3.12.7/Lib/logging/__init__.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n# Trimmed to the parts that make getLogger() hand out one shared Logger per name.\n#\n# Copyright 2001-2022 by Vinay Sajip. All Rights Reserved.\n#\n# Permission to use, copy, modify, and distribute this software and its\n# documentation for any purpose and without fee is hereby granted,\n# provided that the above copyright notice appear in all copies and that\n# both that copyright notice and this permission notice appear in\n# supporting documentation, and that the name of Vinay Sajip\n# not be used in advertising or publicity pertaining to distribution\n# of the software without specific, written prior permission.\n# VINAY SAJIP DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE, INCLUDING\n# ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL\n# VINAY SAJIP BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR\n# ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER\n# IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT\n# OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n\n# … trimmed: module docstring …\nimport sys, os, time, io, re, traceback, warnings, weakref, collections.abc\n# … trimmed: 13 lines of other imports and __all__ …\nimport threading\n# … trimmed: 50 lines of module metadata and comments …\n\nCRITICAL = 50\nFATAL = CRITICAL\nERROR = 40\nWARNING = 30\nWARN = WARNING\nINFO = 20\nDEBUG = 10\nNOTSET = 0\n# … trimmed: 120 lines of level-name lookups and _checkLevel() …\n\n_lock = threading.RLock()\n\ndef _acquireLock():\n    \"\"\"\n    Acquire the module-level lock for serializing access to shared data.\n\n    This should be released with _releaseLock().\n    \"\"\"\n    if _lock:\n        _lock.acquire()\n\ndef _releaseLock():\n    \"\"\"\n    Release the module-level lock acquired by calling _acquireLock().\n    \"\"\"\n    if _lock:\n        _lock.release()\n\n# … trimmed: 1060 lines: fork handling, LogRecord, Formatter, Filter, Handler, StreamHandler …\n\nclass PlaceHolder(object):\n    \"\"\"\n    PlaceHolder instances are used in the Manager logger hierarchy to take\n    the place of nodes for which no loggers have been defined. This class is\n    intended for internal use only and not as part of the public API.\n    \"\"\"\n    def __init__(self, alogger):\n        \"\"\"\n        Initialize with the specified logger being a child of this placeholder.\n        \"\"\"\n        self.loggerMap = { alogger : None }\n\n    def append(self, alogger):\n        \"\"\"\n        Add the specified logger as a child of this placeholder.\n        \"\"\"\n        if alogger not in self.loggerMap:\n            self.loggerMap[alogger] = None\n\n#\n#   Determine which class to use when instantiating loggers.\n#\n\n# … trimmed: setLoggerClass() and getLoggerClass() …\n\nclass Manager(object):\n    \"\"\"\n    There is [under normal circumstances] just one Manager instance, which\n    holds the hierarchy of loggers.\n    \"\"\"\n    def __init__(self, rootnode):\n        \"\"\"\n        Initialize the manager with the root node of the logger hierarchy.\n        \"\"\"\n        self.root = rootnode\n        self.disable = 0\n        self.emittedNoHandlerWarning = False\n        self.loggerDict = {}\n        self.loggerClass = None\n        self.logRecordFactory = None\n\n    @property\n    # … trimmed: the \"disable\" property …\n\n    def getLogger(self, name):\n        \"\"\"\n        Get a logger with the specified name (channel name), creating it\n        if it doesn't yet exist. This name is a dot-separated hierarchical\n        name, such as \"a\", \"a.b\", \"a.b.c\" or similar.\n\n        If a PlaceHolder existed for the specified name [i.e. the logger\n        didn't exist but a child of it did], replace it with the created\n        logger and fix up the parent/child references which pointed to the\n        placeholder to now point to the logger.\n        \"\"\"\n        rv = None\n        if not isinstance(name, str):\n            raise TypeError('A logger name must be a string')\n        _acquireLock()\n        try:\n            if name in self.loggerDict:\n                rv = self.loggerDict[name]\n                if isinstance(rv, PlaceHolder):\n                    ph = rv\n                    rv = (self.loggerClass or _loggerClass)(name)\n                    rv.manager = self\n                    self.loggerDict[name] = rv\n                    self._fixupChildren(ph, rv)\n                    self._fixupParents(rv)\n            else:\n                rv = (self.loggerClass or _loggerClass)(name)\n                rv.manager = self\n                self.loggerDict[name] = rv\n                self._fixupParents(rv)\n        finally:\n            _releaseLock()\n        return rv\n\n    # … trimmed: setLoggerClass() and setLogRecordFactory() …\n\n    def _fixupParents(self, alogger):\n        \"\"\"\n        Ensure that there are either loggers or placeholders all the way\n        from the specified logger to the root of the logger hierarchy.\n        \"\"\"\n        name = alogger.name\n        i = name.rfind(\".\")\n        rv = None\n        while (i > 0) and not rv:\n            substr = name[:i]\n            if substr not in self.loggerDict:\n                self.loggerDict[substr] = PlaceHolder(alogger)\n            else:\n                obj = self.loggerDict[substr]\n                if isinstance(obj, Logger):\n                    rv = obj\n                else:\n                    assert isinstance(obj, PlaceHolder)\n                    obj.append(alogger)\n            i = name.rfind(\".\", 0, i - 1)\n        if not rv:\n            rv = self.root\n        alogger.parent = rv\n\n    def _fixupChildren(self, ph, alogger):\n        \"\"\"\n        Ensure that children of the placeholder ph are connected to the\n        specified logger.\n        \"\"\"\n        name = alogger.name\n        namelen = len(name)\n        for c in ph.loggerMap.keys():\n            #The if means ... if not c.parent.name.startswith(nm)\n            if c.parent.name[:namelen] != name:\n                alogger.parent = c.parent\n                c.parent = alogger\n\n# … trimmed: _clear_cache() …\n\nclass Logger(Filterer):\n    # … trimmed: 14-line docstring about dotted channel names such as \"input.csv\" …\n    def __init__(self, name, level=NOTSET):\n        \"\"\"\n        Initialize the logger with a name and an optional level.\n        \"\"\"\n        Filterer.__init__(self)\n        self.name = name\n        self.level = _checkLevel(level)\n        self.parent = None\n        self.propagate = True\n        self.handlers = []\n        self.disabled = False\n        self._cache = {}\n    # … trimmed: 340 lines of setLevel, debug/info/warning/error, handlers and level checks …\n\nclass RootLogger(Logger):\n    \"\"\"\n    A root logger is not that different to any other logger, except that\n    it must have a logging level and there is only one instance of it in\n    the hierarchy.\n    \"\"\"\n    def __init__(self, level):\n        \"\"\"\n        Initialize the logger with the name \"root\".\n        \"\"\"\n        Logger.__init__(self, \"root\", level)\n\n    # … trimmed: __reduce__ …\n\n_loggerClass = Logger\n# … trimmed: LoggerAdapter (135 lines) …\n\nroot = RootLogger(WARNING)\nLogger.root = root\nLogger.manager = Manager(Logger.root)\n# … trimmed: basicConfig() (130 lines) …\n\ndef getLogger(name=None):\n    \"\"\"\n    Return a logger with the specified name, creating it if necessary.\n\n    If no name is specified, return the root logger.\n    \"\"\"\n    if not name or isinstance(name, str) and name == root.name:\n        return root\n    return Logger.manager.getLogger(name)\n# … trimmed: module-level helpers (critical, error, info…) and shutdown …\n"
          }
        }
      ]
    },
    {
      "id": "factory-method",
      "name": "Factory Method",
      "family": "Creational",
      "aka": [
        "Virtual constructor",
        "Factory function"
      ],
      "tagline": "Shared code asks a method to create the object; subclasses decide which class it is.",
      "intent": "Move the 'new SomeClass()' call out of the code that uses the object and into a method of its own. The base class (the creator) holds the shared workflow and calls the factory method when it needs a product; each subclass overrides that one method to return a different product. New product types arrive as new subclasses, without editing the workflow.",
      "analogy": "A franchise kitchen manual says 'prepare the house burger', then 'serve it'. Every branch follows the same serving steps, but each branch decides for itself what its house burger is.",
      "cityShape": "Look for a creator building whose workflow floor (notify, spawn) sends a call pipe to its own create floor, and several small sibling buildings that each have a create floor at the same height, all extending the creator. The client's arcs point only at the creator, never at the product buildings.",
      "roles": [
        {
          "name": "Product",
          "desc": "The interface or base class of the objects being created."
        },
        {
          "name": "Concrete Product",
          "desc": "A specific kind of product (EmailMessage, Slime)."
        },
        {
          "name": "Creator",
          "desc": "Holds the shared workflow and declares the factory method it calls to get a product."
        },
        {
          "name": "Concrete Creator",
          "desc": "Overrides the factory method to return one concrete product."
        },
        {
          "name": "Client",
          "desc": "Works with the creator and the product interface, never with concrete product classes."
        }
      ],
      "whenToUse": [
        "A workflow is the same for every variant, and only the object it creates differs.",
        "You want new kinds of products to plug in as new subclasses without touching existing code.",
        "A framework or engine needs users to supply their own objects (spawners, document types, UI elements)."
      ],
      "pitfalls": [
        "One subclass per product can explode into many tiny classes; a function or a lookup table (a simple factory) is often enough.",
        "If the product type is chosen by a big if/else on a string somewhere else, you have moved the switch, not removed it. Keep that choice in one place.",
        "Subclassing only to change a creation detail couples the subclass to the whole base workflow."
      ],
      "related": [
        "abstract-factory",
        "template-method",
        "prototype",
        "builder",
        "polymorphism"
      ],
      "quiz": [
        {
          "q": "In the notifier demo, which code changes when you add a PushNotifier that sends push messages?",
          "options": [
            "Notifier.notify()",
            "A new PushMessage class and a new PushNotifier that overrides createMessage()",
            "Every place that calls notify()",
            "The Message interface"
          ],
          "answer": 1,
          "why": "The workflow in the creator stays closed. You add a product and a concrete creator; existing code that talks to Notifier keeps working."
        },
        {
          "q": "How does Factory Method relate to Template Method?",
          "options": [
            "They are unrelated",
            "Factory Method is a Template Method whose overridable step creates an object",
            "Template Method creates objects, Factory Method does not",
            "Factory Method needs interfaces, Template Method needs abstract classes"
          ],
          "answer": 1,
          "why": "The creator's workflow is a template; the factory method is just the step subclasses fill in, and that step happens to return a new object."
        }
      ],
      "demos": [
        {
          "id": "factory-method-ts-notify",
          "title": "Email and SMS notifiers",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Notifier.notify() logs and sends, but asks createMessage() for the message object. EmailNotifier and SmsNotifier only override that one method. Notice main.ts never imports message.ts.",
          "roles": {
            "Product": [
              "factory-method-ts-notify/message.ts#Message"
            ],
            "Concrete Product": [
              "factory-method-ts-notify/message.ts#EmailMessage",
              "factory-method-ts-notify/message.ts#SmsMessage"
            ],
            "Creator": [
              "factory-method-ts-notify/notifier.ts#Notifier"
            ],
            "Concrete Creator": [
              "factory-method-ts-notify/notifiers.ts#EmailNotifier",
              "factory-method-ts-notify/notifiers.ts#SmsNotifier"
            ],
            "Client": [
              "factory-method-ts-notify/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "factory-method-ts-notify/main.ts#main",
              "say": "main() picks a notifier per channel, then only ever calls notify(). It does not know message classes exist."
            },
            {
              "at": "factory-method-ts-notify/main.ts#notifierFor",
              "say": "The one place that chooses a concrete creator. Keep this choice in a single spot so it does not spread."
            },
            {
              "at": "factory-method-ts-notify/notifier.ts#Notifier.notify",
              "say": "The shared workflow. When it needs a message it calls this.createMessage() instead of writing new EmailMessage()."
            },
            {
              "at": "factory-method-ts-notify/notifiers.ts#EmailNotifier.createMessage",
              "say": "The email creator's override returns an EmailMessage. That is the only thing this subclass adds."
            },
            {
              "at": "factory-method-ts-notify/message.ts#EmailMessage.send",
              "say": "notify() calls send() through the Message interface, so it works with any product."
            },
            {
              "at": "factory-method-ts-notify/notifiers.ts#SmsNotifier.createMessage",
              "say": "Second notify() call: same workflow, different factory method, so an SmsMessage is made."
            },
            {
              "at": "factory-method-ts-notify/message.ts#SmsMessage.send",
              "say": "The SMS product cuts text to 160 characters. Product-specific rules live in the product."
            }
          ],
          "files": {
            "factory-method-ts-notify/main.ts": "import { Notifier } from './notifier';\nimport { EmailNotifier, SmsNotifier } from './notifiers';\n\nfunction notifierFor(channel: string): Notifier {\n  if (channel === 'sms') {\n    return new SmsNotifier();\n  }\n  return new EmailNotifier();\n}\n\nfunction main(): void {\n  // This code only talks to Notifier. It never picks a message class itself.\n  notifierFor('email').notify('ana@example.com', 'Your order has shipped.');\n  notifierFor('sms').notify('+49 170 0000000', 'Your parcel arrives today.');\n}\n\nmain();\n",
            "factory-method-ts-notify/message.ts": "// The Product: what every notifier works with, no matter how it is delivered.\nexport interface Message {\n  send(to: string, text: string): void;\n}\n\nexport class EmailMessage implements Message {\n  send(to: string, text: string): void {\n    console.log(`Email to ${to}: ${text}`);\n  }\n}\n\nexport class SmsMessage implements Message {\n  send(to: string, text: string): void {\n    console.log(`SMS to ${to}: ${text.slice(0, 160)}`);\n  }\n}\n",
            "factory-method-ts-notify/notifier.ts": "import { Message } from './message';\n\n// The Creator: it has the shared logic, but leaves \"which Message?\" to subclasses.\nexport abstract class Notifier {\n  protected abstract createMessage(): Message;\n\n  notify(to: string, text: string): void {\n    const message = this.createMessage();\n    console.log(`[${new Date().toISOString()}] notifying ${to}`);\n    message.send(to, text);\n  }\n}\n",
            "factory-method-ts-notify/notifiers.ts": "import { Notifier } from './notifier';\nimport { Message, EmailMessage, SmsMessage } from './message';\n\n// Concrete Creators: each one overrides only the factory method.\nexport class EmailNotifier extends Notifier {\n  protected createMessage(): Message {\n    return new EmailMessage();\n  }\n}\n\nexport class SmsNotifier extends Notifier {\n  protected createMessage(): Message {\n    return new SmsMessage();\n  }\n}\n"
          }
        },
        {
          "id": "factory-method-gd-spawners",
          "title": "Enemy spawners in Godot",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Spawner.spawn() places, scales and adds an enemy, but calls create_enemy() to get it. SlimeSpawner instantiates a scene, BatSpawner configures a plain Enemy. Drop a new spawner subclass in the level and the wave manager just works.",
          "roles": {
            "Product": [
              "factory-method-gd-spawners/enemy.gd"
            ],
            "Concrete Product": [
              "factory-method-gd-spawners/slime.gd"
            ],
            "Creator": [
              "factory-method-gd-spawners/spawner.gd"
            ],
            "Concrete Creator": [
              "factory-method-gd-spawners/slime_spawner.gd",
              "factory-method-gd-spawners/bat_spawner.gd"
            ],
            "Client": [
              "factory-method-gd-spawners/wave_manager.gd#start_next_wave"
            ]
          },
          "trace": [
            {
              "at": "factory-method-gd-spawners/wave_manager.gd#start_next_wave",
              "say": "The wave manager loops over Spawner nodes and calls spawn(). It has no idea which enemies will appear."
            },
            {
              "at": "factory-method-gd-spawners/spawner.gd#spawn",
              "say": "The shared workflow: get an enemy, place it, scale it to the wave, add it to the tree. Step one is the factory method."
            },
            {
              "at": "factory-method-gd-spawners/slime_spawner.gd#create_enemy",
              "say": "This override instantiates the slime scene. Scenes are Godot's way of shipping a ready-made product."
            },
            {
              "at": "factory-method-gd-spawners/enemy.gd#setup",
              "say": "Back in spawn(), setup() runs on whatever came back, because every product is an Enemy."
            },
            {
              "at": "factory-method-gd-spawners/bat_spawner.gd#create_enemy",
              "say": "A different override builds a fast flying Enemy in code. Same workflow, different product, no if/else in spawn()."
            },
            {
              "at": "factory-method-gd-spawners/spawner.gd#create_enemy",
              "say": "The base version is a sensible default, so a plain Spawner still works. Subclasses replace only this method."
            }
          ],
          "files": {
            "factory-method-gd-spawners/bat_spawner.gd": "class_name BatSpawner\nextends Spawner\n\n# Another Concrete Creator: no scene at all, it configures a plain Enemy as a bat.\nfunc create_enemy() -> Enemy:\n\tvar bat := Enemy.new()\n\tbat.flying = true\n\tbat.speed = 140.0\n\tbat.max_hp = 4\n\treturn bat\n",
            "factory-method-gd-spawners/enemy.gd": "class_name Enemy\nextends CharacterBody2D\n\n# The Product: every spawner hands back an Enemy, whatever kind it is.\nvar max_hp := 10\nvar hp := 10\nvar speed := 60.0\nvar flying := false\n\nfunc setup(wave: int) -> void:\n\tmax_hp += wave * 2\n\thp = max_hp\n\nfunc _physics_process(_delta: float) -> void:\n\tvelocity = Vector2.LEFT * speed\n\tmove_and_slide()\n",
            "factory-method-gd-spawners/slime.gd": "class_name Slime\nextends Enemy\n\n# A Concrete Product with its own scene and behaviour.\nfunc _ready() -> void:\n\tspeed = 35.0\n\tmax_hp = 16\n\nfunc split() -> void:\n\tscale *= 0.7\n\tspeed *= 1.5\n",
            "factory-method-gd-spawners/slime_spawner.gd": "class_name SlimeSpawner\nextends Spawner\n\nconst SLIME_SCENE := preload(\"res://enemies/slime.tscn\")\n\n# A Concrete Creator: builds a slime from a packed scene.\nfunc create_enemy() -> Enemy:\n\treturn SLIME_SCENE.instantiate() as Slime\n",
            "factory-method-gd-spawners/spawner.gd": "class_name Spawner\nextends Marker2D\n\n# The Creator: spawn() is the same for every enemy type.\n# Only create_enemy(), the factory method, is left for subclasses to change.\nfunc spawn(wave: int) -> Enemy:\n\tvar enemy := create_enemy()\n\tenemy.global_position = global_position\n\tenemy.setup(wave)\n\tget_parent().add_child(enemy)\n\treturn enemy\n\nfunc create_enemy() -> Enemy:\n\treturn Enemy.new()\n",
            "factory-method-gd-spawners/wave_manager.gd": "extends Node2D\n\n# The Client: it knows it has Spawners, not which enemies they make.\n@export var spawners: Array[Spawner] = []\n\nvar wave := 0\n\nfunc start_next_wave() -> void:\n\twave += 1\n\tfor spawner in spawners:\n\t\tspawner.spawn(wave)\n"
          }
        },
        {
          "id": "factory-method-preact-real",
          "title": "Preact's createElement()",
          "lang": "JavaScript",
          "level": "intermediate",
          "source": {
            "repo": "preactjs/preact",
            "url": "https://github.com/preactjs/preact/blob/10.24.3/src/create-element.js",
            "license": "MIT",
            "note": "Files in preact/ are verbatim from Preact 10.24.3 (src/create-element.js, src/util.js, src/options.js). app.js was written for Software City."
          },
          "story": "Real-world code often uses the simplest form of the idea: a factory function. Every JSX tag becomes a createElement() call, and the one place that builds VNode objects is createVNode(). Callers never write the object literal themselves.",
          "roles": {
            "Creator": [
              "factory-method-preact-real/preact/create-element.js#createElement",
              "factory-method-preact-real/preact/create-element.js#createVNode"
            ],
            "Client": [
              "factory-method-preact-real/app.js#ProductCard",
              "factory-method-preact-real/app.js#Button",
              "factory-method-preact-real/app.js#render"
            ]
          },
          "trace": [
            {
              "at": "factory-method-preact-real/app.js#render",
              "say": "render() builds a product card. In real Preact code this would be JSX; the compiler turns tags into createElement() calls."
            },
            {
              "at": "factory-method-preact-real/app.js#ProductCard",
              "say": "The component describes what it wants (a Fragment, an h2, a Button) and lets the factory build the objects."
            },
            {
              "at": "factory-method-preact-real/preact/create-element.js#createElement",
              "say": "The factory normalizes input: pulls out key and ref, gathers children, and fills defaultProps for components like Button."
            },
            {
              "at": "factory-method-preact-real/preact/create-element.js#createVNode",
              "say": "The single place where a VNode object is allocated, with all its internal fields. A comment even says why it must not be inlined."
            },
            {
              "at": "factory-method-preact-real/app.js#Button",
              "say": "Later, when Preact renders, Button runs with defaultProps already applied, because the factory added them at creation time."
            },
            {
              "at": "factory-method-preact-real/preact/create-element.js#isValidElement",
              "say": "Because every VNode comes from one factory, Preact can recognise them by shape (constructor is undefined)."
            }
          ],
          "files": {
            "factory-method-preact-real/app.js": "// Example usage written for Software City (not part of Preact).\n// With JSX, a compiler turns <Button label=\"Buy\" /> into createElement(Button, { label: 'Buy' }).\nimport { createElement, Fragment } from './preact/create-element';\n\nfunction Button(props) {\n\treturn createElement('button', { class: props.variant }, props.label);\n}\nButton.defaultProps = { variant: 'primary' };\n\nexport function ProductCard(product) {\n\t// The caller never builds a VNode object by hand. It asks the factory.\n\treturn createElement(\n\t\tFragment,\n\t\tnull,\n\t\tcreateElement('h2', { key: 'title' }, product.name),\n\t\tcreateElement(Button, { label: 'Buy for ' + product.price })\n\t);\n}\n\nexport function render() {\n\tconst vnode = ProductCard({ name: 'Desk lamp', price: '29 EUR' });\n\tconsole.log(vnode.type === Fragment, vnode.props.children.length);\n}\n",
            "factory-method-preact-real/preact/create-element.js": "/*\n * Source: Preact 10.24.3 — https://github.com/preactjs/preact/blob/10.24.3/src/create-element.js\n * MIT License, Copyright (c) 2015-present Jason Miller. Included for study.\n */\nimport { slice } from './util';\nimport options from './options';\n\nlet vnodeId = 0;\n\n/**\n * Create an virtual node (used for JSX)\n * @param {VNode[\"type\"]} type The node name or Component constructor for this\n * virtual node\n * @param {object | null | undefined} [props] The properties of the virtual node\n * @param {Array<import('.').ComponentChildren>} [children] The children of the\n * virtual node\n * @returns {VNode}\n */\nexport function createElement(type, props, children) {\n\tlet normalizedProps = {},\n\t\tkey,\n\t\tref,\n\t\ti;\n\tfor (i in props) {\n\t\tif (i == 'key') key = props[i];\n\t\telse if (i == 'ref') ref = props[i];\n\t\telse normalizedProps[i] = props[i];\n\t}\n\n\tif (arguments.length > 2) {\n\t\tnormalizedProps.children =\n\t\t\targuments.length > 3 ? slice.call(arguments, 2) : children;\n\t}\n\n\t// If a Component VNode, check for and apply defaultProps\n\t// Note: type may be undefined in development, must never error here.\n\tif (typeof type == 'function' && type.defaultProps != null) {\n\t\tfor (i in type.defaultProps) {\n\t\t\tif (normalizedProps[i] === undefined) {\n\t\t\t\tnormalizedProps[i] = type.defaultProps[i];\n\t\t\t}\n\t\t}\n\t}\n\n\treturn createVNode(type, normalizedProps, key, ref, null);\n}\n\n/**\n * Create a VNode (used internally by Preact)\n * @param {VNode[\"type\"]} type The node name or Component\n * Constructor for this virtual node\n * @param {object | string | number | null} props The properties of this virtual node.\n * If this virtual node represents a text node, this is the text of the node (string or number).\n * @param {string | number | null} key The key for this virtual node, used when\n * diffing it against its children\n * @param {VNode[\"ref\"]} ref The ref property that will\n * receive a reference to its created child\n * @returns {VNode}\n */\nexport function createVNode(type, props, key, ref, original) {\n\t// V8 seems to be better at detecting type shapes if the object is allocated from the same call site\n\t// Do not inline into createElement and coerceToVNode!\n\t/** @type {VNode} */\n\tconst vnode = {\n\t\ttype,\n\t\tprops,\n\t\tkey,\n\t\tref,\n\t\t_children: null,\n\t\t_parent: null,\n\t\t_depth: 0,\n\t\t_dom: null,\n\t\t// _nextDom must be initialized to undefined b/c it will eventually\n\t\t// be set to dom.nextSibling which can return `null` and it is important\n\t\t// to be able to distinguish between an uninitialized _nextDom and\n\t\t// a _nextDom that has been set to `null`\n\t\t_nextDom: undefined,\n\t\t_component: null,\n\t\tconstructor: undefined,\n\t\t_original: original == null ? ++vnodeId : original,\n\t\t_index: -1,\n\t\t_flags: 0\n\t};\n\n\t// Only invoke the vnode hook if this was *not* a direct copy:\n\tif (original == null && options.vnode != null) options.vnode(vnode);\n\n\treturn vnode;\n}\n\nexport function createRef() {\n\treturn { current: null };\n}\n\nexport function Fragment(props) {\n\treturn props.children;\n}\n\n/**\n * Check if a the argument is a valid Preact VNode.\n * @param {*} vnode\n * @returns {vnode is VNode}\n */\nexport const isValidElement = vnode =>\n\tvnode != null && vnode.constructor == undefined;\n",
            "factory-method-preact-real/preact/options.js": "/*\n * Source: Preact 10.24.3 — https://github.com/preactjs/preact/blob/10.24.3/src/options.js\n * MIT License, Copyright (c) 2015-present Jason Miller. Included for study.\n */\nimport { _catchError } from './diff/catch-error';\n\n/**\n * The `option` object can potentially contain callback functions\n * that are called during various stages of our renderer. This is the\n * foundation on which all our addons like `preact/debug`, `preact/compat`,\n * and `preact/hooks` are based on. See the `Options` type in `internal.d.ts`\n * for a full list of available option hooks (most editors/IDEs allow you to\n * ctrl+click or cmd+click on mac the type definition below).\n * @type {Options}\n */\nconst options = {\n\t_catchError\n};\n\nexport default options;\n",
            "factory-method-preact-real/preact/util.js": "/*\n * Source: Preact 10.24.3 — https://github.com/preactjs/preact/blob/10.24.3/src/util.js\n * MIT License, Copyright (c) 2015-present Jason Miller. Included for study.\n */\nimport { EMPTY_ARR } from './constants';\n\nexport const isArray = Array.isArray;\n\n/**\n * Assign properties from `props` to `obj`\n * @template O, P The obj and props types\n * @param {O} obj The object to copy properties to\n * @param {P} props The object to copy properties from\n * @returns {O & P}\n */\nexport function assign(obj, props) {\n\t// @ts-expect-error We change the type of `obj` to be `O & P`\n\tfor (let i in props) obj[i] = props[i];\n\treturn /** @type {O & P} */ (obj);\n}\n\n/**\n * Remove a child node from its parent if attached. This is a workaround for\n * IE11 which doesn't support `Element.prototype.remove()`. Using this function\n * is smaller than including a dedicated polyfill.\n * @param {preact.ContainerNode} node The node to remove\n */\nexport function removeNode(node) {\n\tif (node && node.parentNode) node.parentNode.removeChild(node);\n}\n\nexport const slice = EMPTY_ARR.slice;\n"
          }
        }
      ]
    },
    {
      "id": "abstract-factory",
      "name": "Abstract Factory",
      "family": "Creational",
      "aka": [
        "Kit",
        "Provider factory"
      ],
      "tagline": "One object creates a whole family of related objects that are made to work together.",
      "intent": "When several kinds of objects must match each other (a dark button with a dark checkbox, a Postgres connection with a Postgres command), put all their create methods on one factory interface. Each concrete factory builds one complete family. Client code receives a factory and never names a concrete class, so it cannot mix pieces from different families by accident.",
      "analogy": "Furniture stores sell a sofa, a table and chairs as one collection. Pick the 'Nordic' catalogue and everything you order from it matches; you never end up with one baroque chair.",
      "cityShape": "Look for two or more family buildings standing side by side, each with the same stack of create floors (createButton, createCheckbox) at the same heights, all pointing to one small interface building. The client building's arcs go only to the interfaces, plus a single arc from the startup code that picks the family.",
      "roles": [
        {
          "name": "Abstract Factory",
          "desc": "Interface with one create method per product type in the family."
        },
        {
          "name": "Concrete Factory",
          "desc": "Implements every create method for one family (Light, Dark, SQLite, Cloud)."
        },
        {
          "name": "Abstract Product",
          "desc": "Interface for one kind of product (Button, BlobStore, DbCommand)."
        },
        {
          "name": "Concrete Product",
          "desc": "A family-specific implementation, only ever created by its own factory."
        },
        {
          "name": "Client",
          "desc": "Gets a factory from outside and uses only the abstract interfaces."
        }
      ],
      "whenToUse": [
        "Your code must work with several families of related objects (themes, platforms, database drivers, cloud vs local services).",
        "Pieces from different families must never be mixed, and you want the type system or the structure to enforce that.",
        "You want to switch the whole family in one place: startup config, environment, or a test setup."
      ],
      "pitfalls": [
        "Adding a new kind of product (say a Slider) means changing the factory interface and every concrete factory.",
        "It is a lot of classes for a choice that may never change; with one family, plain constructors are fine.",
        "If the client still checks 'is this the dark theme?', the abstraction is leaking and the factory is not doing its job."
      ],
      "related": [
        "factory-method",
        "singleton",
        "builder",
        "prototype",
        "bridge"
      ],
      "quiz": [
        {
          "q": "You add a Slider widget to the themes demo. What has to change?",
          "options": [
            "Only SettingsScreen",
            "UIFactory gets createSlider(), and every concrete factory must implement it",
            "Nothing, the factory adapts automatically",
            "Only Main.java"
          ],
          "answer": 1,
          "why": "Adding a new product type changes the factory interface, so every family must provide its version. Adding a new family, by contrast, touches no existing code."
        },
        {
          "q": "What is the main difference from Factory Method?",
          "options": [
            "Abstract Factory creates a family of related objects from one object; Factory Method lets subclasses create one product",
            "Abstract Factory is only for UI",
            "Factory Method cannot return interfaces",
            "There is no difference"
          ],
          "answer": 0,
          "why": "Factory Method is one overridable create step inside a workflow. Abstract Factory is an object whose whole job is creating matching products, passed to the client."
        }
      ],
      "demos": [
        {
          "id": "abstract-factory-java-themes",
          "title": "Light and dark UI themes",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "A settings screen draws a checkbox and a button from whatever UIFactory it is given. Light and dark factories each produce a matching pair, so the screen can never show a dark button next to a light checkbox.",
          "roles": {
            "Abstract Factory": [
              "abstract-factory-java-themes/UIFactory.java#UIFactory"
            ],
            "Concrete Factory": [
              "abstract-factory-java-themes/LightTheme.java#LightThemeFactory",
              "abstract-factory-java-themes/DarkTheme.java#DarkThemeFactory"
            ],
            "Abstract Product": [
              "abstract-factory-java-themes/Widgets.java#Button",
              "abstract-factory-java-themes/Widgets.java#Checkbox"
            ],
            "Concrete Product": [
              "abstract-factory-java-themes/LightTheme.java#LightButton",
              "abstract-factory-java-themes/LightTheme.java#LightCheckbox",
              "abstract-factory-java-themes/DarkTheme.java#DarkButton",
              "abstract-factory-java-themes/DarkTheme.java#DarkCheckbox"
            ],
            "Client": [
              "abstract-factory-java-themes/SettingsScreen.java#SettingsScreen"
            ]
          },
          "trace": [
            {
              "at": "abstract-factory-java-themes/Main.java#Main.main",
              "say": "The only line that names a concrete family. Change the theme here and nothing else in the app changes."
            },
            {
              "at": "abstract-factory-java-themes/SettingsScreen.java#SettingsScreen.SettingsScreen",
              "say": "The screen stores the factory as a UIFactory. It does not know or care whether it is light or dark."
            },
            {
              "at": "abstract-factory-java-themes/SettingsScreen.java#SettingsScreen.show",
              "say": "show() asks the factory for a checkbox and a button, using only the abstract interfaces."
            },
            {
              "at": "abstract-factory-java-themes/DarkTheme.java#DarkThemeFactory.createCheckbox",
              "say": "With the dark factory, both create methods come from the same family file, so the pieces always match."
            },
            {
              "at": "abstract-factory-java-themes/DarkTheme.java#DarkThemeFactory.createButton",
              "say": "Same factory, second product. The client could not ask this factory for a light button even if it wanted to."
            },
            {
              "at": "abstract-factory-java-themes/DarkTheme.java#DarkButton.render",
              "say": "The products do the family-specific work. The screen just calls render() through the Button interface."
            }
          ],
          "files": {
            "abstract-factory-java-themes/DarkTheme.java": "// A second family with the same shape. You cannot get a dark button with a light checkbox.\nclass DarkButton implements Button {\n    public String render(String label) {\n        return \"[ \" + label + \" ] (charcoal, glowing border)\";\n    }\n}\n\nclass DarkCheckbox implements Checkbox {\n    public String render(String label, boolean checked) {\n        return (checked ? \"[*] \" : \"[ ] \") + label + \" (light text)\";\n    }\n}\n\npublic class DarkThemeFactory implements UIFactory {\n    public Button createButton() {\n        return new DarkButton();\n    }\n\n    public Checkbox createCheckbox() {\n        return new DarkCheckbox();\n    }\n}\n",
            "abstract-factory-java-themes/LightTheme.java": "// One family: everything here is meant to be used together.\nclass LightButton implements Button {\n    public String render(String label) {\n        return \"[ \" + label + \" ] (white, grey border)\";\n    }\n}\n\nclass LightCheckbox implements Checkbox {\n    public String render(String label, boolean checked) {\n        return (checked ? \"[x] \" : \"[ ] \") + label + \" (black text)\";\n    }\n}\n\npublic class LightThemeFactory implements UIFactory {\n    public Button createButton() {\n        return new LightButton();\n    }\n\n    public Checkbox createCheckbox() {\n        return new LightCheckbox();\n    }\n}\n",
            "abstract-factory-java-themes/Main.java": "public class Main {\n    public static void main(String[] args) {\n        boolean nightTime = args.length > 0 && args[0].equals(\"dark\");\n        // The only line that names a concrete family.\n        UIFactory factory = nightTime ? new DarkThemeFactory() : new LightThemeFactory();\n        new SettingsScreen(factory).show();\n    }\n}\n",
            "abstract-factory-java-themes/SettingsScreen.java": "// The Client: it only knows UIFactory, Button and Checkbox.\npublic class SettingsScreen {\n    private final UIFactory factory;\n\n    public SettingsScreen(UIFactory factory) {\n        this.factory = factory;\n    }\n\n    public void show() {\n        Checkbox sound = factory.createCheckbox();\n        Button save = factory.createButton();\n        System.out.println(sound.render(\"Sound effects\", true));\n        System.out.println(save.render(\"Save\"));\n    }\n}\n",
            "abstract-factory-java-themes/UIFactory.java": "// The Abstract Factory: one create method per product in the family.\npublic interface UIFactory {\n    Button createButton();\n    Checkbox createCheckbox();\n}\n",
            "abstract-factory-java-themes/Widgets.java": "// The Abstract Products: one interface per kind of widget.\ninterface Button {\n    String render(String label);\n}\n\ninterface Checkbox {\n    String render(String label, boolean checked);\n}\n"
          }
        },
        {
          "id": "abstract-factory-go-storage",
          "title": "Local vs cloud backends in Go",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "An upload service needs a file store and a job queue that belong together. LocalBackend gives a disk store and an in-memory queue for development; CloudBackend gives a bucket and a hosted queue that share region and credentials.",
          "roles": {
            "Abstract Factory": [
              "abstract-factory-go-storage/backend.go#Backend"
            ],
            "Concrete Factory": [
              "abstract-factory-go-storage/local.go#LocalBackend",
              "abstract-factory-go-storage/cloud.go#CloudBackend"
            ],
            "Abstract Product": [
              "abstract-factory-go-storage/backend.go#BlobStore",
              "abstract-factory-go-storage/backend.go#Queue"
            ],
            "Concrete Product": [
              "abstract-factory-go-storage/local.go#DiskStore",
              "abstract-factory-go-storage/local.go#MemoryQueue",
              "abstract-factory-go-storage/cloud.go#BucketStore",
              "abstract-factory-go-storage/cloud.go#HostedQueue"
            ],
            "Client": [
              "abstract-factory-go-storage/uploads.go#UploadService"
            ]
          },
          "trace": [
            {
              "at": "abstract-factory-go-storage/main.go#Run",
              "say": "Run() builds the upload service from whatever backend ChooseBackend() returns."
            },
            {
              "at": "abstract-factory-go-storage/main.go#ChooseBackend",
              "say": "The family is chosen once, from the environment. Tests and laptops get local; production gets cloud."
            },
            {
              "at": "abstract-factory-go-storage/uploads.go#NewUploadService",
              "say": "The client asks one backend for both products, so the store and the queue always come from the same family."
            },
            {
              "at": "abstract-factory-go-storage/local.go#LocalBackend.NewBlobStore",
              "say": "The local factory hands out a disk store rooted in its own directory. Config lives in the factory, not in the client."
            },
            {
              "at": "abstract-factory-go-storage/uploads.go#UploadService.UploadAvatar",
              "say": "Uploading uses only the BlobStore and Queue interfaces. The same code runs against disk or the cloud."
            },
            {
              "at": "abstract-factory-go-storage/cloud.go#BucketStore.URL",
              "say": "In production the URL the worker receives is a bucket URL, which the hosted queue's workers can reach. Matching families matter."
            },
            {
              "at": "abstract-factory-go-storage/cloud.go#HostedQueue.Publish",
              "say": "The hosted queue shares region and token with the bucket because one CloudBackend created both."
            }
          ],
          "files": {
            "abstract-factory-go-storage/backend.go": "package storage\n\n// Abstract Products: the app needs a place for files and a queue for jobs.\ntype BlobStore interface {\n\tPut(key string, data []byte) error\n\tURL(key string) string\n}\n\ntype Queue interface {\n\tPublish(topic string, msg string) error\n}\n\n// Abstract Factory: one backend creates a matching store and queue.\ntype Backend interface {\n\tNewBlobStore() BlobStore\n\tNewQueue() Queue\n}\n",
            "abstract-factory-go-storage/cloud.go": "package storage\n\nimport \"fmt\"\n\nvar _ Backend = CloudBackend{}\n\n// Family 2: a hosted object store plus a hosted queue, sharing one region and credentials.\ntype CloudBackend struct {\n\tRegion string\n\tBucket string\n\tToken  string\n}\n\nfunc (b CloudBackend) NewBlobStore() BlobStore {\n\treturn &BucketStore{region: b.Region, bucket: b.Bucket, token: b.Token}\n}\n\nfunc (b CloudBackend) NewQueue() Queue {\n\treturn &HostedQueue{region: b.Region, token: b.Token}\n}\n\ntype BucketStore struct {\n\tregion string\n\tbucket string\n\ttoken  string\n}\n\nfunc (s *BucketStore) Put(key string, data []byte) error {\n\tfmt.Printf(\"PUT %d bytes to bucket %s/%s\\n\", len(data), s.bucket, key)\n\treturn nil\n}\n\nfunc (s *BucketStore) URL(key string) string {\n\treturn fmt.Sprintf(\"https://%s.objects.%s.example.com/%s\", s.bucket, s.region, key)\n}\n\ntype HostedQueue struct {\n\tregion string\n\ttoken  string\n}\n\nfunc (q *HostedQueue) Publish(topic string, msg string) error {\n\tfmt.Printf(\"POST to queue %s in %s: %s\\n\", topic, q.region, msg)\n\treturn nil\n}\n",
            "abstract-factory-go-storage/local.go": "package storage\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"path/filepath\"\n)\n\n// Compile-time checks: Go has no \"implements\" keyword, so these lines prove the fit.\nvar _ Backend = LocalBackend{}\nvar _ BlobStore = (*DiskStore)(nil)\n\n// Family 1: everything on your laptop, for development and tests.\ntype LocalBackend struct {\n\tDir string\n}\n\nfunc (b LocalBackend) NewBlobStore() BlobStore {\n\treturn &DiskStore{root: b.Dir}\n}\n\nfunc (b LocalBackend) NewQueue() Queue {\n\treturn &MemoryQueue{}\n}\n\ntype DiskStore struct {\n\troot string\n}\n\nfunc (s *DiskStore) Put(key string, data []byte) error {\n\treturn os.WriteFile(filepath.Join(s.root, key), data, 0o644)\n}\n\nfunc (s *DiskStore) URL(key string) string {\n\treturn \"file://\" + filepath.Join(s.root, key)\n}\n\ntype MemoryQueue struct {\n\tmessages []string\n}\n\nfunc (q *MemoryQueue) Publish(topic string, msg string) error {\n\tq.messages = append(q.messages, topic+\": \"+msg)\n\tfmt.Println(\"queued locally:\", topic, msg)\n\treturn nil\n}\n",
            "abstract-factory-go-storage/main.go": "package storage\n\nimport \"os\"\n\n// Pick the family once, at the edge of the program.\nfunc ChooseBackend() Backend {\n\tif os.Getenv(\"APP_ENV\") == \"production\" {\n\t\treturn CloudBackend{Region: \"eu-central\", Bucket: \"acme-media\", Token: os.Getenv(\"STORE_TOKEN\")}\n\t}\n\treturn LocalBackend{Dir: os.TempDir()}\n}\n\nfunc Run() error {\n\tvar service *UploadService = NewUploadService(ChooseBackend())\n\t_, err := service.UploadAvatar(\"u42\", []byte(\"fake png bytes\"))\n\treturn err\n}\n",
            "abstract-factory-go-storage/uploads.go": "package storage\n\n// The Client: it receives a Backend and never names a concrete store or queue.\ntype UploadService struct {\n\tfiles BlobStore\n\tjobs  Queue\n}\n\nfunc NewUploadService(b Backend) *UploadService {\n\treturn &UploadService{files: b.NewBlobStore(), jobs: b.NewQueue()}\n}\n\nfunc (u *UploadService) UploadAvatar(userID string, image []byte) (string, error) {\n\tkey := \"avatars/\" + userID + \".png\"\n\tif err := u.files.Put(key, image); err != nil {\n\t\treturn \"\", err\n\t}\n\t// The thumbnail worker reads from the same family's store, so URL and queue always match.\n\turl := u.files.URL(key)\n\treturn url, u.jobs.Publish(\"thumbnails\", url)\n}\n"
          }
        },
        {
          "id": "abstract-factory-kt-database",
          "title": "Database provider factories",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "Modelled on .NET's DbProviderFactory and JDBC drivers. A repository writes SQL with :name parameters; the SQLite factory makes '?' commands, the Postgres one makes '$1' commands, and each connection refuses commands from the other family. A registry picks the factory from the URL.",
          "roles": {
            "Abstract Factory": [
              "abstract-factory-kt-database/Contracts.kt#DbProviderFactory"
            ],
            "Concrete Factory": [
              "abstract-factory-kt-database/Sqlite.kt#SqliteFactory",
              "abstract-factory-kt-database/Postgres.kt#PostgresFactory"
            ],
            "Abstract Product": [
              "abstract-factory-kt-database/Contracts.kt#DbConnection",
              "abstract-factory-kt-database/Contracts.kt#DbCommand"
            ],
            "Concrete Product": [
              "abstract-factory-kt-database/Sqlite.kt#SqliteConnection",
              "abstract-factory-kt-database/Sqlite.kt#SqliteCommand",
              "abstract-factory-kt-database/Postgres.kt#PostgresConnection",
              "abstract-factory-kt-database/Postgres.kt#PostgresCommand"
            ],
            "Client": [
              "abstract-factory-kt-database/UserRepository.kt#UserRepository"
            ]
          },
          "trace": [
            {
              "at": "abstract-factory-kt-database/UserRepository.kt#main",
              "say": "Startup registers the available factories. Each is a Kotlin object, so there is exactly one of each family's factory."
            },
            {
              "at": "abstract-factory-kt-database/Providers.kt#DbProviders.forUrl",
              "say": "The registry maps the URL scheme to a factory. A plugin could register a MySQL family here without touching the repository."
            },
            {
              "at": "abstract-factory-kt-database/UserRepository.kt#UserRepository.findByEmail",
              "say": "The repository asks the same factory for a connection and a command, and writes portable SQL with :email."
            },
            {
              "at": "abstract-factory-kt-database/Sqlite.kt#SqliteFactory.createCommand",
              "say": "With a sqlite: URL, the command comes from the SQLite family..."
            },
            {
              "at": "abstract-factory-kt-database/Sqlite.kt#SqliteCommand.boundValues",
              "say": "...which rewrote :email to '?' and keeps values in positional order, the way SQLite expects."
            },
            {
              "at": "abstract-factory-kt-database/Sqlite.kt#SqliteConnection.query",
              "say": "The connection checks it got a SqliteCommand. Mixing families fails loudly; with the factory, it cannot happen."
            },
            {
              "at": "abstract-factory-kt-database/Postgres.kt#PostgresCommand.numberPlaceholders",
              "say": "With a postgres URL the same repository code gets '$1' placeholders instead. The difference lives entirely inside the family."
            }
          ],
          "files": {
            "abstract-factory-kt-database/Contracts.kt": "package db\n\n// Abstract Products. A command must be run by a connection of the same database family.\ninterface DbCommand {\n    val sql: String\n    fun bind(name: String, value: Any?): DbCommand\n    fun boundValues(): List<Any?>\n}\n\ninterface DbConnection {\n    fun open(): Unit\n    fun query(command: DbCommand): List<Map<String, Any?>>\n    fun close(): Unit\n}\n\n// The Abstract Factory, shaped like .NET's DbProviderFactory and Java's JDBC drivers.\nabstract class DbProviderFactory {\n    abstract val name: String\n    abstract fun createConnection(url: String): DbConnection\n    abstract fun createCommand(sql: String): DbCommand\n}\n",
            "abstract-factory-kt-database/Postgres.kt": "package db\n\n// Family 2. PostgreSQL wants numbered \"$1, $2\" placeholders and a network connection.\nclass PostgresCommand(template: String) : DbCommand {\n    private val names = Regex(\":(\\\\w+)\").findAll(template).map { it.groupValues[1] }.distinct().toList()\n    private val values = mutableMapOf<String, Any?>()\n    override val sql: String = numberPlaceholders(template)\n\n    private fun numberPlaceholders(template: String): String {\n        var result = template\n        names.forEachIndexed { i, n -> result = result.replace(\":$n\", \"\\$${i + 1}\") }\n        return result\n    }\n\n    override fun bind(name: String, value: Any?): DbCommand {\n        values[name] = value\n        return this\n    }\n\n    override fun boundValues(): List<Any?> {\n        return names.map { values[it] }\n    }\n}\n\nclass PostgresConnection(private val host: String) : DbConnection {\n    private var connected = false\n\n    override fun open() {\n        connected = true\n        println(\"postgres: TCP handshake with $host\")\n    }\n\n    override fun query(command: DbCommand): List<Map<String, Any?>> {\n        require(connected) { \"open() first\" }\n        require(command is PostgresCommand) { \"Postgres cannot run ${command::class.simpleName}\" }\n        println(\"postgres: ${command.sql} ${command.boundValues()}\")\n        return emptyList()\n    }\n\n    override fun close() {\n        connected = false\n    }\n}\n\nobject PostgresFactory : DbProviderFactory() {\n    override val name = \"postgres\"\n\n    override fun createConnection(url: String): DbConnection {\n        return PostgresConnection(url.removePrefix(\"postgres://\"))\n    }\n\n    override fun createCommand(sql: String): DbCommand {\n        return PostgresCommand(sql)\n    }\n}\n",
            "abstract-factory-kt-database/Providers.kt": "package db\n\n// A registry of factories, picked by the scheme of the connection URL.\n// Plugins can register a new family without the rest of the app changing.\nobject DbProviders {\n    private val factories = mutableMapOf<String, DbProviderFactory>()\n\n    fun register(factory: DbProviderFactory) {\n        factories[factory.name] = factory\n    }\n\n    fun forUrl(url: String): DbProviderFactory {\n        val scheme = url.substringBefore(\":\")\n        return factories[scheme] ?: error(\"No database provider for '$scheme'\")\n    }\n}\n",
            "abstract-factory-kt-database/Sqlite.kt": "package db\n\n// Family 1. SQLite wants positional \"?\" placeholders.\nclass SqliteCommand(template: String) : DbCommand {\n    private val names = Regex(\":(\\\\w+)\").findAll(template).map { it.groupValues[1] }.toList()\n    private val values = mutableMapOf<String, Any?>()\n    override val sql: String = template.replace(Regex(\":\\\\w+\"), \"?\")\n\n    override fun bind(name: String, value: Any?): DbCommand {\n        values[name] = value\n        return this\n    }\n\n    override fun boundValues(): List<Any?> {\n        return names.map { values[it] }\n    }\n}\n\nclass SqliteConnection(private val file: String) : DbConnection {\n    override fun open() {\n        println(\"sqlite: opening $file\")\n    }\n\n    override fun query(command: DbCommand): List<Map<String, Any?>> {\n        require(command is SqliteCommand) { \"SQLite cannot run ${command::class.simpleName}\" }\n        println(\"sqlite: ${command.sql} ${command.boundValues()}\")\n        return emptyList()\n    }\n\n    override fun close() {\n        println(\"sqlite: closed\")\n    }\n}\n\nobject SqliteFactory : DbProviderFactory() {\n    override val name = \"sqlite\"\n\n    override fun createConnection(url: String): DbConnection {\n        return SqliteConnection(url.removePrefix(\"sqlite:\"))\n    }\n\n    override fun createCommand(sql: String): DbCommand {\n        return SqliteCommand(sql)\n    }\n}\n",
            "abstract-factory-kt-database/UserRepository.kt": "package db\n\n// The Client: it writes portable SQL with \":name\" parameters and lets the factory\n// produce a connection and a command that are guaranteed to fit together.\nclass UserRepository(private val factory: DbProviderFactory, private val url: String) {\n\n    fun findByEmail(email: String): Map<String, Any?>? {\n        val connection = factory.createConnection(url)\n        val command = factory.createCommand(\"SELECT id, name FROM users WHERE email = :email\")\n        command.bind(\"email\", email)\n        connection.open()\n        try {\n            return connection.query(command).firstOrNull()\n        } finally {\n            connection.close()\n        }\n    }\n}\n\nfun main() {\n    DbProviders.register(SqliteFactory)\n    DbProviders.register(PostgresFactory)\n\n    val url = System.getenv(\"DATABASE_URL\") ?: \"sqlite:app.db\"\n    val users = UserRepository(DbProviders.forUrl(url), url)\n    users.findByEmail(\"ana@example.com\")\n}\n"
          }
        }
      ]
    },
    {
      "id": "builder",
      "name": "Builder",
      "family": "Creational",
      "aka": [
        "Fluent builder",
        "Step builder"
      ],
      "tagline": "Assemble a complex object step by step, then get the finished, checked result.",
      "intent": "Some objects have many optional parts and rules about which combinations are valid. Instead of one constructor with ten parameters, a builder offers one small method per step, usually returning itself so calls chain. A final build() (or toSQL()) checks everything and produces the finished product, and an optional director keeps reusable recipes.",
      "analogy": "Ordering at a sandwich counter: bread, then filling, then extras, then sauce, and only at the till do you get the wrapped sandwich. The staff can also make 'the usual' for you without you listing every step.",
      "cityShape": "Look for a tall builder building made of many short, similar floors (one per step, each ending in 'return this') with a heavier build floor on top. The director's floor sends one bundle of call pipes into almost every floor of that tower, in order, and the product building next door is small and has few floors.",
      "roles": [
        {
          "name": "Builder",
          "desc": "Collects the choices one step at a time and knows how to assemble and validate the product."
        },
        {
          "name": "Product",
          "desc": "The finished object (or result, such as SQL text) that the builder produces."
        },
        {
          "name": "Director",
          "desc": "Optional. Knows a recipe: which steps to call, in which order, for a common case."
        },
        {
          "name": "Client",
          "desc": "Uses a director's recipe or drives the builder itself, then takes the product."
        }
      ],
      "whenToUse": [
        "A constructor would need many parameters, several of them optional or easy to mix up.",
        "The product must be valid as a whole, and you want one place (build()) to check the rules.",
        "You build the same kind of object in several recipes (default request, admin request) or describe something (a query, a request) before executing it."
      ],
      "pitfalls": [
        "In languages with named and default arguments (Kotlin, Python, C#) a plain constructor is often clearer for simple objects.",
        "A builder that can be reused after build() may leak state into the next product; copy its data or reset it.",
        "Forgetting the final build() or validating in each step instead of at the end scatters the rules."
      ],
      "related": [
        "abstract-factory",
        "factory-method",
        "composite",
        "prototype",
        "encapsulation"
      ],
      "quiz": [
        {
          "q": "Why do the builder's step methods return the builder itself?",
          "options": [
            "To make the builder a singleton",
            "So calls can be chained into one readable expression",
            "Because the product needs a reference to the builder",
            "To avoid garbage collection"
          ],
          "answer": 1,
          "why": "Returning this (or b in Go) lets you write builder.bun(...).topping(...).build(), which reads like a description of the object."
        },
        {
          "q": "In the Go request builder, where is the 'GET cannot have a body' rule checked?",
          "options": [
            "In every step method",
            "In Build(), once all the choices are known",
            "In the Request struct's fields",
            "In the director only"
          ],
          "answer": 1,
          "why": "Some rules depend on several choices together. Build() sees the whole picture, so cross-field validation belongs there."
        }
      ],
      "demos": [
        {
          "id": "builder-kt-burger",
          "title": "Burger builder",
          "lang": "Kotlin",
          "level": "beginner",
          "source": null,
          "story": "BurgerBuilder collects bun, patties, toppings and sauce one call at a time, and build() checks the rules before making an immutable Burger. Kitchen is the director with a ready-made recipe.",
          "roles": {
            "Builder": [
              "builder-kt-burger/BurgerBuilder.kt#BurgerBuilder"
            ],
            "Product": [
              "builder-kt-burger/Burger.kt#Burger"
            ],
            "Director": [
              "builder-kt-burger/Kitchen.kt#Kitchen"
            ],
            "Client": [
              "builder-kt-burger/Kitchen.kt#main"
            ]
          },
          "trace": [
            {
              "at": "builder-kt-burger/Kitchen.kt#main",
              "say": "main() orders the classic recipe from the director, then builds a custom burger by hand."
            },
            {
              "at": "builder-kt-burger/Kitchen.kt#Kitchen.classicCheeseburger",
              "say": "The director knows the steps for a common burger so nobody has to repeat them."
            },
            {
              "at": "builder-kt-burger/BurgerBuilder.kt#BurgerBuilder.topping",
              "say": "Each step changes one thing and returns the builder, so the next call can chain on."
            },
            {
              "at": "builder-kt-burger/BurgerBuilder.kt#BurgerBuilder.extraPatty",
              "say": "The custom order takes different steps. Steps you skip keep their defaults."
            },
            {
              "at": "builder-kt-burger/BurgerBuilder.kt#BurgerBuilder.build",
              "say": "build() checks the whole order at once and copies the toppings, so the Burger cannot change later."
            },
            {
              "at": "builder-kt-burger/Burger.kt#Burger.describe",
              "say": "The product is simple and immutable. All the 'how do I assemble it' logic stayed in the builder."
            }
          ],
          "files": {
            "builder-kt-burger/Burger.kt": "package food\n\n// The Product: immutable once built. Its constructor is internal, so code\n// outside this module has to go through the builder.\nclass Burger internal constructor(\n    val bun: String,\n    val patties: Int,\n    val toppings: List<String>,\n    val sauce: String?\n) {\n    fun describe(): String {\n        val extras = toppings.joinToString(\", \").ifEmpty { \"nothing else\" }\n        return \"$patties-patty burger on $bun with $extras, sauce: ${sauce ?: \"none\"}\"\n    }\n}\n",
            "builder-kt-burger/BurgerBuilder.kt": "package food\n\n// The Builder: collects choices step by step, then checks them all at once in build().\nclass BurgerBuilder {\n    private var bun = \"sesame\"\n    private var patties = 1\n    private val toppings = mutableListOf<String>()\n    private var sauce: String? = null\n\n    fun bun(type: String): BurgerBuilder {\n        bun = type\n        return this\n    }\n\n    fun extraPatty(): BurgerBuilder {\n        patties += 1\n        return this\n    }\n\n    fun topping(name: String): BurgerBuilder {\n        toppings.add(name)\n        return this\n    }\n\n    fun sauce(name: String): BurgerBuilder {\n        sauce = name\n        return this\n    }\n\n    fun build(): Burger {\n        require(patties <= 3) { \"Nobody can eat more than 3 patties\" }\n        return Burger(bun, patties, toppings.toList(), sauce)\n    }\n}\n",
            "builder-kt-burger/Kitchen.kt": "package food\n\n// The Director: knows the recipes, i.e. which steps in which order.\nobject Kitchen {\n    fun classicCheeseburger(): Burger {\n        return BurgerBuilder().topping(\"cheddar\").topping(\"pickles\").sauce(\"ketchup\").build()\n    }\n}\n\nfun main() {\n    println(Kitchen.classicCheeseburger().describe())\n\n    // A custom order: the same builder, different steps, read like a sentence.\n    val custom = BurgerBuilder().bun(\"brioche\").extraPatty().topping(\"bacon\").build()\n    println(custom.describe())\n}\n"
          }
        },
        {
          "id": "builder-go-request",
          "title": "HTTP request builder in Go",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "NewRequest(...).Header(...).JSON(...).Timeout(...).Build() builds an API request. Errors are remembered inside the builder, so the caller checks one error at Build(). UsersAPI is a director with a recipe per endpoint.",
          "roles": {
            "Builder": [
              "builder-go-request/builder.go#RequestBuilder"
            ],
            "Product": [
              "builder-go-request/request.go#Request"
            ],
            "Director": [
              "builder-go-request/users.go#UsersAPI"
            ],
            "Client": [
              "builder-go-request/main.go#Example"
            ]
          },
          "trace": [
            {
              "at": "builder-go-request/main.go#Example",
              "say": "The client asks the director for a 'create user' request and gets back a finished Request or one error."
            },
            {
              "at": "builder-go-request/users.go#UsersAPI.CreateUser",
              "say": "The director drives the builder through auth, body, timeout and retries. Every endpoint gets the same headers for free."
            },
            {
              "at": "builder-go-request/builder.go#NewRequest",
              "say": "Starting the builder fills safe defaults and records an error for non-https URLs instead of returning it right away."
            },
            {
              "at": "builder-go-request/builder.go#RequestBuilder.JSON",
              "say": "A step that can fail stores the error and turns later steps into no-ops. The chain never breaks."
            },
            {
              "at": "builder-go-request/builder.go#RequestBuilder.Header",
              "say": "Steps can call other steps: JSON() sets the Content-Type header through Header()."
            },
            {
              "at": "builder-go-request/builder.go#RequestBuilder.Build",
              "say": "Build() reports the first error, checks rules that need several fields, and returns a copy so the builder cannot change it later."
            },
            {
              "at": "builder-go-request/request.go#Request.Describe",
              "say": "The product has no setters at all. Once built, it is safe to pass around and retry."
            }
          ],
          "files": {
            "builder-go-request/builder.go": "package api\n\nimport (\n\t\"encoding/json\"\n\t\"errors\"\n\t\"net/http\"\n\t\"strings\"\n\t\"time\"\n)\n\n// The Builder. Each step returns the builder so calls chain, and the first error\n// is remembered instead of returned, so the caller checks once at Build().\ntype RequestBuilder struct {\n\treq Request\n\terr error\n}\n\nfunc NewRequest(method, url string) *RequestBuilder {\n\tb := &RequestBuilder{req: Request{method: method, url: url, headers: http.Header{}, timeout: 10 * time.Second}}\n\tif !strings.HasPrefix(url, \"https://\") {\n\t\tb.err = errors.New(\"only https URLs are allowed\")\n\t}\n\treturn b\n}\n\nfunc (b *RequestBuilder) Header(key, value string) *RequestBuilder {\n\tb.req.headers.Set(key, value)\n\treturn b\n}\n\nfunc (b *RequestBuilder) JSON(v any) *RequestBuilder {\n\tif b.err != nil {\n\t\treturn b\n\t}\n\tdata, err := json.Marshal(v)\n\tif err != nil {\n\t\tb.err = err\n\t\treturn b\n\t}\n\tb.req.body = data\n\treturn b.Header(\"Content-Type\", \"application/json\")\n}\n\nfunc (b *RequestBuilder) Timeout(d time.Duration) *RequestBuilder {\n\tb.req.timeout = d\n\treturn b\n}\n\nfunc (b *RequestBuilder) Retries(n int) *RequestBuilder {\n\tb.req.retries = n\n\treturn b\n}\n\nfunc (b *RequestBuilder) Build() (*Request, error) {\n\tif b.err != nil {\n\t\treturn nil, b.err\n\t}\n\tif b.req.method == http.MethodGet && b.req.body != nil {\n\t\treturn nil, errors.New(\"GET requests cannot have a body\")\n\t}\n\tr := b.req\n\treturn &r, nil\n}\n",
            "builder-go-request/main.go": "package api\n\nimport \"fmt\"\n\nfunc Example() {\n\tusers := UsersAPI{baseURL: \"https://api.example.com\", token: \"secret\"}\n\n\treq, err := users.CreateUser(\"Ana\", \"ana@example.com\")\n\tif err != nil {\n\t\tfmt.Println(\"could not build request:\", err)\n\t\treturn\n\t}\n\tfmt.Println(req.Describe())\n\n\t// One error check covers every step, even when the first one failed.\n\t_, err = NewRequest(\"POST\", \"http://insecure.example.com\").JSON(42).Build()\n\tfmt.Println(err)\n}\n",
            "builder-go-request/request.go": "package api\n\nimport (\n\t\"net/http\"\n\t\"time\"\n)\n\n// The Product: a fully checked request, ready to send. Nothing can change it after Build().\ntype Request struct {\n\tmethod  string\n\turl     string\n\theaders http.Header\n\tbody    []byte\n\ttimeout time.Duration\n\tretries int\n}\n\nfunc (r *Request) Describe() string {\n\treturn r.method + \" \" + r.url + \" (timeout \" + r.timeout.String() + \")\"\n}\n",
            "builder-go-request/users.go": "package api\n\nimport (\n\t\"net/http\"\n\t\"time\"\n)\n\n// The Director: knows the recipes. Each method drives a RequestBuilder through\n// the steps this API needs, so callers never repeat auth headers or timeouts.\ntype UsersAPI struct {\n\tbaseURL string\n\ttoken   string\n}\n\nfunc (u UsersAPI) CreateUser(name, email string) (*Request, error) {\n\treturn NewRequest(http.MethodPost, u.baseURL+\"/users\").\n\t\tHeader(\"Authorization\", \"Bearer \"+u.token).\n\t\tJSON(map[string]string{\"name\": name, \"email\": email}).\n\t\tTimeout(5 * time.Second).\n\t\tRetries(2).\n\t\tBuild()\n}\n\nfunc (u UsersAPI) GetUser(id string) (*Request, error) {\n\treturn NewRequest(http.MethodGet, u.baseURL+\"/users/\"+id).\n\t\tHeader(\"Authorization\", \"Bearer \"+u.token).\n\t\tBuild()\n}\n"
          }
        },
        {
          "id": "builder-knex-real",
          "title": "knex query builder",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "knex/knex",
            "url": "https://github.com/knex/knex/blob/3.1.0/lib/query/querybuilder.js",
            "license": "MIT",
            "note": "knex/querybuilder.js is knex 3.1.0 trimmed from 1793 to about 220 lines (cuts marked). usage.js and toy-client.js (a stand-in for knex's SQL compilers) were written for Software City."
          },
          "story": "knex's Builder records each step (select, where, orderBy, limit) as a plain object in _statements or _single, and returns this. Nothing is turned into SQL until toSQL() hands the whole recording to a dialect compiler.",
          "roles": {
            "Builder": [
              "builder-knex-real/knex/querybuilder.js#Builder"
            ],
            "Product": [
              "builder-knex-real/toy-client.js#compileSelect"
            ],
            "Director": [
              "builder-knex-real/usage.js#newestCustomers"
            ],
            "Client": [
              "builder-knex-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "builder-knex-real/usage.js#run",
              "say": "run() asks a small recipe function for a query. At this point no SQL exists, only a builder full of recorded steps."
            },
            {
              "at": "builder-knex-real/usage.js#newestCustomers",
              "say": "A chain of steps. select and from are aliases for columns() and table(), assigned on Builder.prototype near the end of the file."
            },
            {
              "at": "builder-knex-real/knex/querybuilder.js#Builder.columns",
              "say": "Each step only pushes a small description onto _statements and returns this, which is what makes chaining work."
            },
            {
              "at": "builder-knex-real/knex/querybuilder.js#Builder.where",
              "say": "where() accepts many call shapes and normalizes them: two arguments means '=', and the result is one whereBasic statement."
            },
            {
              "at": "builder-knex-real/knex/querybuilder.js#Builder._bool",
              "say": "Flags such as and/or are read once and then reset, so orWhere() affects only the next statement."
            },
            {
              "at": "builder-knex-real/knex/querybuilder.js#Builder.limit",
              "say": "Single-value parts (table, limit) go into _single, so calling limit() twice just replaces the value."
            },
            {
              "at": "builder-knex-real/knex/querybuilder.js#Builder.toSQL",
              "say": "The build step: the whole recording goes to the client's compiler. One builder can produce SQL for Postgres, MySQL or SQLite."
            },
            {
              "at": "builder-knex-real/toy-client.js#compileSelect",
              "say": "Our toy compiler walks the recorded statements and returns the product: SQL text with ? placeholders plus the bindings."
            }
          ],
          "files": {
            "builder-knex-real/knex/querybuilder.js": "// Source: knex 3.1.0 — https://github.com/knex/knex/blob/3.1.0/lib/query/querybuilder.js\n// MIT License, Copyright (c) 2013-present Tim Griesser. Included for study.\n// Trimmed from 1793 lines to the builder steps used in usage.js; every cut is marked.\n// Builder\n// -------\nconst assert = require('assert');\nconst { EventEmitter } = require('events');\nconst clone = require('lodash/clone');\n// … trimmed: 8 more lodash imports …\n\nconst { addQueryContext, normalizeArr } = require('../util/helpers');\n// … trimmed: joinclause, analytic, save-async-stack imports …\nconst {\n  isBoolean,\n  isNumber,\n  isObject,\n  isString,\n  isFunction,\n} = require('../util/is');\n// … trimmed: lock-mode constants and builder-interface-augmenter imports …\n// … trimmed: 25 lines of SELECT_COMMANDS / CLEARABLE_STATEMENTS / LOCK_MODES sets …\n\n// Typically called from `knex.builder`,\n// start a new query building chain.\nclass Builder extends EventEmitter {\n  constructor(client) {\n    super();\n    this.client = client;\n    this.and = this;\n    this._single = {};\n    this._comments = [];\n    this._statements = [];\n    this._method = 'select';\n    if (client.config) {\n      saveAsyncStack(this, 5);\n      this._debug = client.config.debug;\n    }\n    // Internal flags used in the builder.\n    this._joinFlag = 'inner';\n    this._boolFlag = 'and';\n    this._notFlag = false;\n    this._asColumnFlag = false;\n  }\n\n  toString() {\n    return this.toQuery();\n  }\n\n  // Convert the current query \"toSQL\"\n  toSQL(method, tz) {\n    return this.client.queryCompiler(this).toSQL(method || this._method, tz);\n  }\n  // … trimmed: clone(), timeout() and the WITH / CTE helpers (140 lines) …\n\n  // Select\n  // ------\n\n  // Adds a column or columns to the list of \"columns\"\n  // being selected on the query.\n  columns(column) {\n    if (!column && column !== 0) return this;\n    this._statements.push({\n      grouping: 'columns',\n      value: normalizeArr(...arguments),\n    });\n    return this;\n  }\n\n  // … trimmed: comment(), as(), hintComment(), withSchema() …\n\n\n  // Sets the `tableName` on the query.\n  // Alias to \"from\" for select and \"into\" for insert statements\n  // e.g. builder.insert({a: value}).into('tableName')\n  // `options`: options object containing keys:\n  //   - `only`: whether the query should use SQL's ONLY to not return\n  //           inheriting table data. Defaults to false.\n  table(tableName, options = {}) {\n    this._single.table = tableName;\n    this._single.only = options.only === true;\n    return this;\n  }\n\n  // … trimmed: distinct(), and all join methods (100 lines) …\n\n  // The where function can be used in several ways:\n  // The most basic is `where(key, value)`, which expands to\n  // where key = value.\n  where(column, operator, value) {\n    const argsLength = arguments.length;\n\n    // Support \"where true || where false\"\n    if (column === false || column === true) {\n      return this.where(1, '=', column ? 1 : 0);\n    }\n\n    // Check if the column is a function, in which case it's\n    // a where statement wrapped in parens.\n    if (typeof column === 'function') {\n      return this.whereWrapped(column);\n    }\n\n    // Allows `where({id: 2})` syntax.\n    if (isObject(column) && !column.isRawInstance)\n      return this._objectWhere(column);\n\n    // Allow a raw statement to be passed along to the query.\n    if (column && column.isRawInstance && argsLength === 1)\n      return this.whereRaw(column);\n\n    // Enable the where('key', value) syntax, only when there\n    // are explicitly two arguments passed, so it's not possible to\n    // do where('key', '!=') and have that turn into where key != null\n    if (argsLength === 2) {\n      value = operator;\n      operator = '=';\n\n      // If the value is null, and it's a two argument query,\n      // we assume we're going for a `whereNull`.\n      if (value === null) {\n        return this.whereNull(column);\n      }\n    }\n\n    // lower case the operator for comparison purposes\n    const checkOperator = `${operator}`.toLowerCase().trim();\n\n    // … trimmed: 22 lines that turn where(col, 'in' | 'between' | 'is', …) into whereIn / whereBetween / whereNull …\n\n    // Push onto the where statement stack.\n    this._statements.push({\n      grouping: 'where',\n      type: 'whereBasic',\n      column,\n      operator,\n      value,\n      not: this._not(),\n      bool: this._bool(),\n      asColumn: this._asColumnFlag,\n    });\n    return this;\n  }\n  // … trimmed: 270 lines of whereColumn, orWhere, whereIn, whereNull, whereBetween, whereLike, groupBy …\n\n  // Adds a `order by` clause to the query.\n  orderBy(column, direction, nulls = '') {\n    if (Array.isArray(column)) {\n      return this._orderByArray(column);\n    }\n    this._statements.push({\n      grouping: 'order',\n      type: 'orderByBasic',\n      value: column,\n      direction,\n      nulls,\n    });\n    return this;\n  }\n\n  // … trimmed: orderByRaw, union, having* (250 lines) …\n\n  // set the skip binding parameter (= insert the raw value in the query) for an attribute.\n  _setSkipBinding(attribute, options) {\n    let skipBinding = options;\n    if (isObject(options)) {\n      skipBinding = options.skipBinding;\n    }\n    this._single.skipBinding = this._single.skipBinding || {};\n    this._single.skipBinding[attribute] = skipBinding;\n  }\n  // … trimmed: offset() …\n\n  // Only allow a single \"limit\" to be set for the current query.\n  limit(value, options) {\n    const val = parseInt(value, 10);\n    if (isNaN(val)) {\n      this.client.logger.warn('A valid integer must be provided to limit');\n    } else {\n      this._single.limit = val;\n      this._setSkipBinding('limit', options);\n    }\n    return this;\n  }\n\n  // … trimmed: 590 lines of aggregates, insert/update/delete, locking, JSON helpers, analytics …\n\n\n  // Helper to get or set the \"boolFlag\" value.\n  _bool(val) {\n    if (arguments.length === 1) {\n      this._boolFlag = val;\n      return this;\n    }\n    const ret = this._boolFlag;\n    this._boolFlag = 'and';\n    return ret;\n  }\n\n  // Helper to get or set the \"notFlag\" value.\n  _not(val) {\n    if (arguments.length === 1) {\n      this._notFlag = val;\n      return this;\n    }\n    const ret = this._notFlag;\n    this._notFlag = false;\n    return ret;\n  }\n\n  // … trimmed: _joinType, _analyticMethod, _aggregate and other private helpers …\n}\n\nBuilder.prototype.select = Builder.prototype.columns;\nBuilder.prototype.column = Builder.prototype.columns;\n// … trimmed: 22 more aliases (andWhere, andHaving, …) …\nBuilder.prototype.from = Builder.prototype.table;\nBuilder.prototype.into = Builder.prototype.table;\n// … trimmed: del alias …\n\n\n// Attach all of the top level promise methods that should be chainable.\naugmentWithBuilderInterface(Builder);\naddQueryContext(Builder);\n// … trimmed: Builder.extend and OnConflictBuilder …\n\nmodule.exports = Builder;\n",
            "builder-knex-real/toy-client.js": "// Written for Software City (not part of knex): a toy stand-in for knex's dialect clients and\n// lib/query/querycompiler.js, just enough to show what the builder hands over.\n\nfunction compileSelect(builder) {\n  const columns = builder._statements.filter((s) => s.grouping === 'columns').flatMap((s) => s.value);\n  const wheres = builder._statements.filter((s) => s.grouping === 'where');\n  const orders = builder._statements.filter((s) => s.grouping === 'order');\n  let sql = 'select ' + (columns.length ? columns.join(', ') : '*') + ' from ' + builder._single.table;\n  if (wheres.length) {\n    sql += ' where ' + wheres.map((w) => w.column + ' ' + w.operator + ' ?').join(' and ');\n  }\n  if (orders.length) {\n    sql += ' order by ' + orders.map((o) => o.value + ' ' + (o.direction || 'asc')).join(', ');\n  }\n  const bindings = wheres.map((w) => w.value);\n  if (builder._single.limit !== undefined) {\n    sql += ' limit ?';\n    bindings.push(builder._single.limit);\n  }\n  return { sql, bindings };\n}\n\nfunction queryCompiler(builder) {\n  return {\n    toSQL(method) {\n      return compileSelect(builder);\n    },\n  };\n}\n\nmodule.exports = { queryCompiler, logger: console };\n",
            "builder-knex-real/usage.js": "// Example usage written for Software City (not part of knex).\n// In an app you would write knex('users').select(...); here we create the Builder directly.\nconst Builder = require('./knex/querybuilder');\nconst toyClient = require('./toy-client');\n\n// A small \"director\": it knows the recipe for one common query.\nfunction newestCustomers(country, count) {\n  return new Builder(toyClient)\n    .select('id', 'name', 'email')\n    .from('users')\n    .where('country', country)\n    .where('orders', '>', 0)\n    .orderBy('created_at', 'desc')\n    .limit(count);\n}\n\nfunction run() {\n  const query = newestCustomers('DE', 10);\n  // Nothing has touched a database yet. The builder only recorded statements.\n  console.log(query._statements.length, 'statements recorded');\n  console.log(query.toSQL());\n  // { sql: 'select id, name, email from users where country = ? and orders > ? order by created_at desc limit ?',\n  //   bindings: [ 'DE', 0, 10 ] }\n}\n\nrun();\n"
          }
        }
      ]
    },
    {
      "id": "prototype",
      "name": "Prototype",
      "family": "Creational",
      "aka": [
        "Clone",
        "Template object"
      ],
      "tagline": "Make new objects by copying a ready-made example instead of building from scratch.",
      "intent": "When an object is tedious or costly to set up, configure one example (the prototype) and create new ones by cloning it, then change only what differs. The object itself knows how to copy itself correctly, including which parts must be duplicated and which may be shared. A registry can hold named prototypes so code asks for 'an orc' rather than a class.",
      "analogy": "A cookie cutter, or a document template: you do the careful work once, then stamp out copies and personalise each one. Photocopying a signed form only works if the copy does not share the original's pen marks.",
      "cityShape": "Look for a small clone floor in the prototype's building that receives call pipes from a registry or spawner building. The registry's roof carries a map antenna of templates, and its make floor is short: one pipe out to clone(), none to any constructor.",
      "roles": [
        {
          "name": "Prototype",
          "desc": "Interface or base type that promises a clone method."
        },
        {
          "name": "Concrete Prototype",
          "desc": "A class that copies itself correctly: duplicating mutable parts, sharing immutable or heavy ones."
        },
        {
          "name": "Registry",
          "desc": "Optional. Keeps named, pre-configured prototypes and hands out clones on request."
        },
        {
          "name": "Client",
          "desc": "Asks for a clone and tweaks it, without knowing how the original was built."
        }
      ],
      "whenToUse": [
        "Objects need lots of setup (loaded data, tuned stats, many fields) and you need many similar ones.",
        "Designers tune templates as data (Godot .tres resources, JSON, prefabs) and code should spawn variants of them.",
        "You want to create objects whose exact class is only known at runtime, from an existing instance."
      ],
      "pitfalls": [
        "Shallow copies share nested lists and objects: changing one clone silently changes the template and every other clone.",
        "Deep copies can copy too much (huge textures, database handles) or loop forever on cycles; decide per field what to share.",
        "In Godot, a loaded Resource is shared by every user. Editing it without duplicate() changes it everywhere."
      ],
      "related": [
        "factory-method",
        "abstract-factory",
        "memento",
        "flyweight",
        "composite"
      ],
      "quiz": [
        {
          "q": "A Meeting's clone() returns new Meeting(..., this.attendees). You add a name to one clone's attendees. What happens?",
          "options": [
            "Only that clone changes",
            "The template and every clone that shares the array change too",
            "An error is thrown",
            "Nothing, arrays are immutable"
          ],
          "answer": 1,
          "why": "Passing the same array makes a shallow copy. All clones point at one list, so a change through any of them is seen by all. Copy the array ([...this.attendees]) in clone()."
        },
        {
          "q": "In the CPython demo, why does Character define __deepcopy__ instead of relying on the default?",
          "options": [
            "Because deepcopy cannot copy classes without it",
            "To copy the inventory but share the big Texture instead of duplicating it",
            "To make copies faster by skipping the memo",
            "Because __init__ has arguments"
          ],
          "answer": 1,
          "why": "The default deep copy would duplicate everything, including the megabyte of pixels. The hook lets the prototype decide what is copied and what is shared."
        }
      ],
      "demos": [
        {
          "id": "prototype-ts-meetings",
          "title": "Cloning a meeting template",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "One stand-up meeting is set up in full, then cloned for the rest of the week. clone() copies the date and the attendee list, so moving or editing one copy never affects the others.",
          "roles": {
            "Prototype": [
              "prototype-ts-meetings/prototype.ts#Cloneable"
            ],
            "Concrete Prototype": [
              "prototype-ts-meetings/meeting.ts#Meeting"
            ],
            "Client": [
              "prototype-ts-meetings/main.ts#planSprint"
            ]
          },
          "trace": [
            {
              "at": "prototype-ts-meetings/main.ts#planSprint",
              "say": "The template is built once with all five constructor arguments. Every other meeting starts as a copy of it."
            },
            {
              "at": "prototype-ts-meetings/meeting.ts#Meeting.clone",
              "say": "clone() makes a new Meeting and copies the Date and the attendees array, because sharing them would link every copy together."
            },
            {
              "at": "prototype-ts-meetings/meeting.ts#Meeting.moveByDays",
              "say": "Each copy shifts its own date. This mutates the Date, which is exactly why clone() had to copy it."
            },
            {
              "at": "prototype-ts-meetings/main.ts#planSprint",
              "say": "Adding Dana to Friday's copy leaves the other days alone. With a shallow copy, all five meetings would gain her."
            }
          ],
          "files": {
            "prototype-ts-meetings/main.ts": "import { Meeting } from './meeting';\n\nfunction planSprint(): Meeting[] {\n  // Configure one template meeting...\n  const standup = new Meeting('Daily stand-up', new Date('2026-10-12T09:15'), 15, 'Room 2', ['Ana', 'Ben', 'Chris']);\n  const week: Meeting[] = [standup];\n\n  // ...then clone it instead of repeating every constructor argument.\n  for (let day = 1; day < 5; day++) {\n    const copy = standup.clone();\n    copy.moveByDays(day);\n    week.push(copy);\n  }\n\n  // Changing one copy does not touch the others, because clone() copied the list.\n  week[4].attendees.push('Dana');\n  return week;\n}\n\nconsole.log(planSprint().map((m) => m.start.toDateString() + ' ' + m.attendees.length));\n",
            "prototype-ts-meetings/meeting.ts": "import { Cloneable } from './prototype';\n\n// A Concrete Prototype. Setting one up takes many fields; copying a finished one is easy.\nexport class Meeting implements Cloneable<Meeting> {\n  constructor(\n    public title: string,\n    public start: Date,\n    public minutes: number,\n    public room: string,\n    public attendees: string[],\n  ) {}\n\n  clone(): Meeting {\n    // Copy the array and the date too. A plain {...this} would share them with the original.\n    return new Meeting(this.title, new Date(this.start), this.minutes, this.room, [...this.attendees]);\n  }\n\n  moveByDays(days: number): void {\n    this.start.setDate(this.start.getDate() + days);\n  }\n}\n",
            "prototype-ts-meetings/prototype.ts": "// The Prototype interface: anything that can make a copy of itself.\nexport interface Cloneable<T> {\n  clone(): T;\n}\n"
          }
        },
        {
          "id": "prototype-gd-enemies",
          "title": "Enemy templates as Godot resources",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Designers tune orc and archer stats as .tres resources. A catalog keeps them as prototypes and always returns clones, so an elite orc can triple its HP without changing every other orc. The buggy function shows what happens without cloning.",
          "roles": {
            "Prototype": [
              "prototype-gd-enemies/enemy_stats.gd#clone"
            ],
            "Concrete Prototype": [
              "prototype-gd-enemies/enemy_stats.gd"
            ],
            "Registry": [
              "prototype-gd-enemies/enemy_catalog.gd"
            ],
            "Client": [
              "prototype-gd-enemies/spawner.gd#spawn",
              "prototype-gd-enemies/spawner.gd#spawn_elite"
            ]
          },
          "trace": [
            {
              "at": "prototype-gd-enemies/enemy_catalog.gd#_ready",
              "say": "The catalog loads each tuned template once and registers it under an id. These are the prototypes."
            },
            {
              "at": "prototype-gd-enemies/spawner.gd#spawn_elite",
              "say": "To make an elite, the spawner asks for an orc copy, then changes only the name, HP, tint and loot."
            },
            {
              "at": "prototype-gd-enemies/enemy_catalog.gd#make",
              "say": "make() never returns the stored template, only a clone, so callers cannot damage it."
            },
            {
              "at": "prototype-gd-enemies/enemy_stats.gd#clone",
              "say": "duplicate() copies the exported values, and the loot array is copied too, so appending a gem affects this elite only."
            },
            {
              "at": "prototype-gd-enemies/enemy.gd#apply_stats",
              "say": "The enemy reads its own private copy of the stats. Different enemies, same template, no shared state."
            },
            {
              "at": "prototype-gd-enemies/spawner.gd#spawn_elite_buggy",
              "say": "The trap: preload() returns the one shared resource. Changing it without cloning turns every orc golden."
            }
          ],
          "files": {
            "prototype-gd-enemies/enemy.gd": "class_name Enemy\nextends CharacterBody2D\n\nvar stats: EnemyStats\nvar hp := 0\n\nfunc apply_stats(new_stats: EnemyStats) -> void:\n\tstats = new_stats\n\thp = stats.max_hp\n\tmodulate = stats.tint\n\nfunc take_damage(amount: int) -> void:\n\thp -= amount\n\tif hp <= 0:\n\t\tqueue_free()\n",
            "prototype-gd-enemies/enemy_catalog.gd": "class_name EnemyCatalog\nextends Node\n\n# The prototype registry: one tuned template per enemy id, loaded once.\nvar _prototypes := {}\n\nfunc _ready() -> void:\n\tregister(\"orc\", preload(\"res://enemies/orc.tres\"))\n\tregister(\"archer\", preload(\"res://enemies/archer.tres\"))\n\nfunc register(id: String, stats: EnemyStats) -> void:\n\t_prototypes[id] = stats\n\nfunc make(id: String) -> EnemyStats:\n\t# Never hand out the prototype itself: callers always get their own copy.\n\treturn _prototypes[id].clone()\n",
            "prototype-gd-enemies/enemy_stats.gd": "class_name EnemyStats\nextends Resource\n\n# The Prototype: a Resource you tune in the inspector and save as a .tres file.\n@export var display_name := \"Orc\"\n@export var max_hp := 30\n@export var speed := 80.0\n@export var tint := Color.WHITE\n@export var loot: Array[String] = [\"coin\"]\n\nfunc clone() -> EnemyStats:\n\tvar copy := duplicate() as EnemyStats\n\t# Copy the list explicitly: clones must never share a mutable array with the template.\n\tcopy.loot = loot.duplicate()\n\treturn copy\n",
            "prototype-gd-enemies/spawner.gd": "extends Node2D\n\nconst ENEMY_SCENE := preload(\"res://enemies/enemy.tscn\")\n\n@onready var catalog: EnemyCatalog = $\"../EnemyCatalog\"\n\nfunc spawn(id: String, at: Vector2) -> Enemy:\n\tvar enemy := ENEMY_SCENE.instantiate() as Enemy\n\tenemy.apply_stats(catalog.make(id))\n\tenemy.position = at\n\tadd_child(enemy)\n\treturn enemy\n\nfunc spawn_elite(id: String, at: Vector2) -> Enemy:\n\t# Start from a copy of the template, then tweak only what makes it elite.\n\tvar stats := catalog.make(id)\n\tstats.display_name = \"Elite \" + stats.display_name\n\tstats.max_hp *= 3\n\tstats.tint = Color.GOLD\n\tstats.loot.append(\"rare_gem\")\n\tvar enemy := ENEMY_SCENE.instantiate() as Enemy\n\tenemy.apply_stats(stats)\n\tenemy.position = at\n\tadd_child(enemy)\n\treturn enemy\n\nfunc spawn_elite_buggy(id: String, at: Vector2) -> void:\n\t# The classic Godot bug: a preloaded Resource is shared by everyone who loads it.\n\t# Editing it without clone() turns EVERY orc in the game golden, now and later.\n\tvar shared: EnemyStats = preload(\"res://enemies/orc.tres\")\n\tshared.tint = Color.GOLD\n"
          }
        },
        {
          "id": "prototype-copy-real",
          "title": "Python's copy module",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/copy.py",
            "license": "PSF-2.0",
            "note": "copy.py is CPython 3.12.7 Lib/copy.py with the module docstring and two helpers trimmed (marked). prototypes.py and main.py were written for Software City."
          },
          "story": "copy.copy() and copy.deepcopy() are Python's built-in Prototype machinery. Any object can be cloned; classes customise it with __copy__ or __deepcopy__. The memo dictionary stops infinite loops and keeps shared objects shared.",
          "roles": {
            "Prototype": [
              "prototype-copy-real/copy.py#deepcopy",
              "prototype-copy-real/copy.py#copy"
            ],
            "Concrete Prototype": [
              "prototype-copy-real/prototypes.py#Character"
            ],
            "Client": [
              "prototype-copy-real/main.py#spawn_wave"
            ]
          },
          "trace": [
            {
              "at": "prototype-copy-real/main.py#spawn_wave",
              "say": "One Character is configured as the template, then deep-copied three times to fill a wave."
            },
            {
              "at": "prototype-copy-real/copy.py#deepcopy",
              "say": "deepcopy() first checks the memo (already copied?), then a table of known types, then asks the object for a __deepcopy__ hook."
            },
            {
              "at": "prototype-copy-real/prototypes.py#Character.__deepcopy__",
              "say": "The prototype decides how it is cloned: a fresh inventory and position, but the same heavy Texture."
            },
            {
              "at": "prototype-copy-real/copy.py#_deepcopy_list",
              "say": "Lists are copied item by item, and the new list goes into the memo first, so a list that contains itself does not loop forever."
            },
            {
              "at": "prototype-copy-real/copy.py#_keep_alive",
              "say": "The memo is keyed by id(); keeping originals alive stops Python from reusing an id mid-copy."
            },
            {
              "at": "prototype-copy-real/copy.py#copy",
              "say": "copy.copy() makes a shallow clone. Character has no __copy__, so Python falls back to the pickle protocol (__reduce_ex__)."
            },
            {
              "at": "prototype-copy-real/copy.py#_reconstruct",
              "say": "The shallow path builds a new object and drops in the same __dict__ values. The inventory list is shared, which is why the template gains the stolen gem."
            }
          ],
          "files": {
            "prototype-copy-real/copy.py": "# Source: CPython 3.12.7 Lib/copy.py — https://github.com/python/cpython/blob/v3.12.7/Lib/copy.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n\"\"\"Generic (shallow and deep) copying operations.\n\n[module docstring trimmed: 47 lines explaining shallow vs deep copies and the\n __copy__ / __deepcopy__ hooks; see the source link above]\n\"\"\"\n\nimport types\nimport weakref\nfrom copyreg import dispatch_table\n\nclass Error(Exception):\n    pass\nerror = Error   # backward compatibility\n\n__all__ = [\"Error\", \"copy\", \"deepcopy\"]\n\ndef copy(x):\n    \"\"\"Shallow copy operation on arbitrary Python objects.\n\n    See the module's __doc__ string for more info.\n    \"\"\"\n\n    cls = type(x)\n\n    copier = _copy_dispatch.get(cls)\n    if copier:\n        return copier(x)\n\n    if issubclass(cls, type):\n        # treat it as a regular class:\n        return _copy_immutable(x)\n\n    copier = getattr(cls, \"__copy__\", None)\n    if copier is not None:\n        return copier(x)\n\n    reductor = dispatch_table.get(cls)\n    if reductor is not None:\n        rv = reductor(x)\n    else:\n        reductor = getattr(x, \"__reduce_ex__\", None)\n        if reductor is not None:\n            rv = reductor(4)\n        else:\n            reductor = getattr(x, \"__reduce__\", None)\n            if reductor:\n                rv = reductor()\n            else:\n                raise Error(\"un(shallow)copyable object of type %s\" % cls)\n\n    if isinstance(rv, str):\n        return x\n    return _reconstruct(x, None, *rv)\n\n\n_copy_dispatch = d = {}\n\ndef _copy_immutable(x):\n    return x\nfor t in (types.NoneType, int, float, bool, complex, str, tuple,\n          bytes, frozenset, type, range, slice, property,\n          types.BuiltinFunctionType, types.EllipsisType,\n          types.NotImplementedType, types.FunctionType, types.CodeType,\n          weakref.ref):\n    d[t] = _copy_immutable\n\nd[list] = list.copy\nd[dict] = dict.copy\nd[set] = set.copy\nd[bytearray] = bytearray.copy\n\ndel d, t\n\ndef deepcopy(x, memo=None, _nil=[]):\n    \"\"\"Deep copy operation on arbitrary Python objects.\n\n    See the module's __doc__ string for more info.\n    \"\"\"\n\n    if memo is None:\n        memo = {}\n\n    d = id(x)\n    y = memo.get(d, _nil)\n    if y is not _nil:\n        return y\n\n    cls = type(x)\n\n    copier = _deepcopy_dispatch.get(cls)\n    if copier is not None:\n        y = copier(x, memo)\n    else:\n        if issubclass(cls, type):\n            y = _deepcopy_atomic(x, memo)\n        else:\n            copier = getattr(x, \"__deepcopy__\", None)\n            if copier is not None:\n                y = copier(memo)\n            else:\n                reductor = dispatch_table.get(cls)\n                if reductor:\n                    rv = reductor(x)\n                else:\n                    reductor = getattr(x, \"__reduce_ex__\", None)\n                    if reductor is not None:\n                        rv = reductor(4)\n                    else:\n                        reductor = getattr(x, \"__reduce__\", None)\n                        if reductor:\n                            rv = reductor()\n                        else:\n                            raise Error(\n                                \"un(deep)copyable object of type %s\" % cls)\n                if isinstance(rv, str):\n                    y = x\n                else:\n                    y = _reconstruct(x, memo, *rv)\n\n    # If is its own copy, don't memoize.\n    if y is not x:\n        memo[d] = y\n        _keep_alive(x, memo) # Make sure x lives at least as long as d\n    return y\n\n_deepcopy_dispatch = d = {}\n\ndef _deepcopy_atomic(x, memo):\n    return x\nd[types.NoneType] = _deepcopy_atomic\nd[types.EllipsisType] = _deepcopy_atomic\nd[types.NotImplementedType] = _deepcopy_atomic\nd[int] = _deepcopy_atomic\nd[float] = _deepcopy_atomic\nd[bool] = _deepcopy_atomic\nd[complex] = _deepcopy_atomic\nd[bytes] = _deepcopy_atomic\nd[str] = _deepcopy_atomic\nd[types.CodeType] = _deepcopy_atomic\nd[type] = _deepcopy_atomic\nd[range] = _deepcopy_atomic\nd[types.BuiltinFunctionType] = _deepcopy_atomic\nd[types.FunctionType] = _deepcopy_atomic\nd[weakref.ref] = _deepcopy_atomic\nd[property] = _deepcopy_atomic\n\ndef _deepcopy_list(x, memo, deepcopy=deepcopy):\n    y = []\n    memo[id(x)] = y\n    append = y.append\n    for a in x:\n        append(deepcopy(a, memo))\n    return y\nd[list] = _deepcopy_list\n\n# … trimmed: _deepcopy_tuple(), which copies tuples only when an item inside changed …\n\ndef _deepcopy_dict(x, memo, deepcopy=deepcopy):\n    y = {}\n    memo[id(x)] = y\n    for key, value in x.items():\n        y[deepcopy(key, memo)] = deepcopy(value, memo)\n    return y\nd[dict] = _deepcopy_dict\n\n# … trimmed: _deepcopy_method() for bound methods …\n\ndel d\n\ndef _keep_alive(x, memo):\n    # … trimmed: 9-line docstring: memo is keyed by id(), so originals must stay alive …\n    try:\n        memo[id(memo)].append(x)\n    except KeyError:\n        # aha, this is the first one :-)\n        memo[id(memo)]=[x]\n\ndef _reconstruct(x, memo, func, args,\n                 state=None, listiter=None, dictiter=None,\n                 *, deepcopy=deepcopy):\n    deep = memo is not None\n    if deep and args:\n        args = (deepcopy(arg, memo) for arg in args)\n    y = func(*args)\n    if deep:\n        memo[id(x)] = y\n\n    if state is not None:\n        if deep:\n            state = deepcopy(state, memo)\n        if hasattr(y, '__setstate__'):\n            y.__setstate__(state)\n        else:\n            if isinstance(state, tuple) and len(state) == 2:\n                state, slotstate = state\n            else:\n                slotstate = None\n            if state is not None:\n                y.__dict__.update(state)\n            if slotstate is not None:\n                for key, value in slotstate.items():\n                    setattr(y, key, value)\n\n    if listiter is not None:\n        if deep:\n            for item in listiter:\n                item = deepcopy(item, memo)\n                y.append(item)\n        else:\n            for item in listiter:\n                y.append(item)\n    if dictiter is not None:\n        if deep:\n            for key, value in dictiter:\n                key = deepcopy(key, memo)\n                value = deepcopy(value, memo)\n                y[key] = value\n        else:\n            for key, value in dictiter:\n                y[key] = value\n    return y\n\ndel types, weakref\n",
            "prototype-copy-real/main.py": "# Example usage written for Software City (not part of CPython).\nfrom .copy import copy, deepcopy\nfrom .prototypes import Character, Texture\n\n\ndef spawn_wave():\n    template = Character(\"Orc\", Texture(\"orc.png\"), [\"axe\", \"potion\"])\n\n    # Deep clones: each orc gets its own inventory, all share one texture.\n    wave = [deepcopy(template) for _ in range(3)]\n    wave[0].inventory.append(\"gold key\")\n    print(template.inventory)                     # ['axe', 'potion']\n    print(wave[1].texture is template.texture)    # True\n\n    # A shallow copy shares the inventory list with the template: a classic bug.\n    sloppy = copy(template)\n    sloppy.inventory.append(\"stolen gem\")\n    print(template.inventory)                     # ['axe', 'potion', 'stolen gem']\n    return wave\n",
            "prototype-copy-real/prototypes.py": "# Example usage written for Software City (not part of CPython).\n# Real code would write `import copy`; the relative import lets Software City draw the arrow.\nfrom .copy import deepcopy\n\n\nclass Texture:\n    \"\"\"Big, read-only image data. Clones should share it, not copy it.\"\"\"\n\n    def __init__(self, path):\n        self.path = path\n        self.pixels = bytearray(1024 * 1024)\n\n\nclass Character:\n    \"\"\"A prototype: configure one, then clone it for every enemy on screen.\"\"\"\n\n    def __init__(self, name, texture, inventory):\n        self.name = name\n        self.texture = texture  # a shared Texture\n        self.inventory = inventory\n        self.position = [0, 0]\n\n    def __deepcopy__(self, memo):\n        # The hook copy.deepcopy() looks for: copy the game state, share the heavy texture.\n        clone = Character(self.name, self.texture, deepcopy(self.inventory, memo))\n        clone.position = deepcopy(self.position, memo)\n        return clone\n"
          }
        }
      ]
    },
    {
      "id": "object-pool",
      "name": "Object Pool",
      "family": "Creational",
      "aka": [
        "Resource pool",
        "Free list"
      ],
      "tagline": "Borrow ready-made objects and give them back, instead of creating and destroying them.",
      "intent": "Some objects are expensive to create or to throw away: database connections, threads, bullets and particles in a game, big byte buffers. A pool keeps a stock of them; clients acquire one, use it, and release it so the next client can reuse it. The pool resets objects between uses and decides what to do when it runs dry.",
      "analogy": "A bike-share station: you take a bike, ride, and dock it again for the next person. Nobody builds a new bike for each trip, and a broken basket must be fixed before the bike goes back on the rack.",
      "cityShape": "Look for a pool building with an acquire floor and a release floor, and a list antenna on its roof (the idle objects). Client buildings send pipes into acquire; the pooled object's building sends a pipe back into release, forming a loop instead of a create-then-destroy line.",
      "roles": [
        {
          "name": "Pool",
          "desc": "Owns the idle objects. acquire/rent hands one out (creating it only if needed and allowed); release/return takes it back."
        },
        {
          "name": "Reusable",
          "desc": "The pooled object. Has a reset step so no state leaks from one user to the next."
        },
        {
          "name": "Client",
          "desc": "Borrows an object, uses it briefly, and must give it back exactly once."
        }
      ],
      "whenToUse": [
        "Creating the object is slow (network handshakes, threads) or allocation causes garbage-collector hiccups (bullets, particles every frame).",
        "Many short-lived uses of the same kind of object happen at a high rate.",
        "You need a hard upper limit on how many of something exist at once (database connections)."
      ],
      "pitfalls": [
        "Forgetting to reset an object leaks state to the next borrower: an open transaction, an old velocity, stale buffer bytes.",
        "Forgetting to release (or releasing twice, or using an object after release) corrupts the pool. Use try/finally, using, defer or a lease object.",
        "For cheap objects a pool only adds complexity; modern allocators and GCs are fast. Measure first."
      ],
      "related": [
        "flyweight",
        "singleton",
        "factory-method",
        "prototype",
        "game-loop"
      ],
      "quiz": [
        {
          "q": "OrderService opens a transaction and never commits. Why does the next order not inherit that transaction?",
          "options": [
            "C# closes connections automatically",
            "The pool calls Reset() on the connection when the lease is returned",
            "Each Rent() creates a brand new connection",
            "Transactions expire after one second"
          ],
          "answer": 1,
          "why": "Return() resets the object before putting it back. Without that step, the next borrower would silently run inside someone else's transaction."
        },
        {
          "q": "Why does a Godot bullet call pool.release(self) instead of queue_free() when it expires?",
          "options": [
            "queue_free() is deprecated",
            "So the node is hidden and reused for the next shot instead of being destroyed and re-instantiated",
            "release() frees memory faster",
            "Area2D nodes cannot be freed"
          ],
          "answer": 1,
          "why": "Instantiating and freeing nodes every shot costs time and memory churn. Returning the node to the pool lets the gun reuse it with fire()."
        }
      ],
      "demos": [
        {
          "id": "object-pool-gd-bullets",
          "title": "Bullet pool in Godot",
          "lang": "GDScript",
          "level": "beginner",
          "source": null,
          "story": "The pool instantiates 32 bullets once. The gun acquires one per shot and calls fire(); when its lifetime ends the bullet returns itself to the pool. Nothing is instantiated or freed while the game is running.",
          "roles": {
            "Pool": [
              "object-pool-gd-bullets/bullet_pool.gd"
            ],
            "Reusable": [
              "object-pool-gd-bullets/bullet.gd"
            ],
            "Client": [
              "object-pool-gd-bullets/gun.gd#shoot"
            ]
          },
          "trace": [
            {
              "at": "object-pool-gd-bullets/bullet_pool.gd#_ready",
              "say": "At load time the pool creates every bullet it will ever need, parks them deactivated, and keeps them in a free list."
            },
            {
              "at": "object-pool-gd-bullets/gun.gd#shoot",
              "say": "The gun asks the pool for a bullet instead of instantiating a scene. If the pool is empty, it just does not fire."
            },
            {
              "at": "object-pool-gd-bullets/bullet_pool.gd#acquire",
              "say": "acquire() pops an idle bullet off the list. Cheap: no allocation, no scene loading."
            },
            {
              "at": "object-pool-gd-bullets/bullet.gd#fire",
              "say": "fire() plays the role of a constructor for a reused object: it sets position, direction and lifetime, then wakes the node up."
            },
            {
              "at": "object-pool-gd-bullets/bullet.gd#_physics_process",
              "say": "When its time is up, the bullet hands itself back to the pool rather than calling queue_free()."
            },
            {
              "at": "object-pool-gd-bullets/bullet_pool.gd#release",
              "say": "release() puts it back on the free list after deactivating it..."
            },
            {
              "at": "object-pool-gd-bullets/bullet.gd#deactivate",
              "say": "...which resets everything the last shot changed. Forget a field here and the next shot inherits it."
            }
          ],
          "files": {
            "object-pool-gd-bullets/bullet.gd": "class_name Bullet\nextends Area2D\n\nconst SPEED := 900.0\n\nvar pool: BulletPool\nvar direction := Vector2.ZERO\nvar _life := 0.0\n\n# The Reusable object: instead of _init/queue_free it has fire() and deactivate().\nfunc fire(from: Vector2, dir: Vector2) -> void:\n\tglobal_position = from\n\tdirection = dir\n\t_life = 1.5\n\tshow()\n\tset_physics_process(true)\n\tset_deferred(\"monitoring\", true)\n\nfunc deactivate() -> void:\n\t# Reset everything a previous shot could have changed.\n\thide()\n\tset_physics_process(false)\n\tset_deferred(\"monitoring\", false)\n\tdirection = Vector2.ZERO\n\nfunc _physics_process(delta: float) -> void:\n\tposition += direction * SPEED * delta\n\t_life -= delta\n\tif _life <= 0.0:\n\t\tpool.release(self)  # not queue_free(): the node goes back to the pool\n",
            "object-pool-gd-bullets/bullet_pool.gd": "class_name BulletPool\nextends Node\n\nconst BULLET_SCENE := preload(\"res://bullet.tscn\")\n\n@export var size := 32\n\n# The Pool: every bullet is created once, up front, and then recycled.\nvar _free: Array[Bullet] = []\n\nfunc _ready() -> void:\n\tfor i in size:\n\t\tvar bullet := BULLET_SCENE.instantiate() as Bullet\n\t\tbullet.pool = self\n\t\tadd_child(bullet)\n\t\tbullet.deactivate()\n\t\t_free.append(bullet)\n\nfunc acquire() -> Bullet:\n\tif _free.is_empty():\n\t\treturn null  # pool exhausted: the gun simply cannot fire this frame\n\treturn _free.pop_back()\n\nfunc release(bullet: Bullet) -> void:\n\tbullet.deactivate()\n\t_free.append(bullet)\n",
            "object-pool-gd-bullets/gun.gd": "extends Node2D\n\n@export var pool: BulletPool\n\n# The Client: borrows a bullet, never creates or frees one.\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"shoot\"):\n\t\tshoot()\n\nfunc shoot() -> void:\n\tvar bullet := pool.acquire()\n\tif bullet:\n\t\tbullet.fire(global_position, Vector2.RIGHT.rotated(global_rotation))\n"
          }
        },
        {
          "id": "object-pool-cs-connections",
          "title": "Database connection pool in C#",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "Opening a connection takes 200 ms, so the pool keeps idle ones and caps the total. Rent() returns a lease; disposing it (via using) returns the connection and resets it. Five orders run on one real connection.",
          "roles": {
            "Pool": [
              "object-pool-cs-connections/ConnectionPool.cs#ConnectionPool"
            ],
            "Reusable": [
              "object-pool-cs-connections/DbConnection.cs#DbConnection",
              "object-pool-cs-connections/PooledConnection.cs#PooledConnection"
            ],
            "Client": [
              "object-pool-cs-connections/OrderService.cs#OrderService"
            ]
          },
          "trace": [
            {
              "at": "object-pool-cs-connections/OrderService.cs#OrderService.Main",
              "say": "One pool with a limit of two connections serves five orders in a row."
            },
            {
              "at": "object-pool-cs-connections/OrderService.cs#OrderService.PlaceOrder",
              "say": "Each order rents a connection inside a using block, so it is returned even if the code throws."
            },
            {
              "at": "object-pool-cs-connections/ConnectionPool.cs#ConnectionPool.Rent",
              "say": "Rent() reuses an idle connection if there is one, opens a new one if under the limit, and refuses otherwise."
            },
            {
              "at": "object-pool-cs-connections/DbConnection.cs#DbConnection.DbConnection",
              "say": "Only the first order pays this slow constructor. That saved time is the whole point of the pool."
            },
            {
              "at": "object-pool-cs-connections/PooledConnection.cs#PooledConnection.Dispose",
              "say": "Leaving the using block disposes the lease, which returns the connection once and then forgets it."
            },
            {
              "at": "object-pool-cs-connections/ConnectionPool.cs#ConnectionPool.Return",
              "say": "The pool resets the connection before pushing it onto the idle stack."
            },
            {
              "at": "object-pool-cs-connections/DbConnection.cs#DbConnection.Reset",
              "say": "Reset rolls back the transaction the order forgot to commit, so the next borrower starts clean."
            }
          ],
          "files": {
            "object-pool-cs-connections/ConnectionPool.cs": "using System;\nusing System.Collections.Generic;\n\n// The Pool: hands out idle connections, opens new ones up to a limit, takes them back.\npublic class ConnectionPool\n{\n    private readonly string _connectionString;\n    private readonly int _maxSize;\n    private readonly Stack<DbConnection> _idle = new Stack<DbConnection>();\n    private readonly object _lock = new object();\n    private int _created;\n\n    public ConnectionPool(string connectionString, int maxSize)\n    {\n        _connectionString = connectionString;\n        _maxSize = maxSize;\n    }\n\n    public PooledConnection Rent()\n    {\n        lock (_lock)\n        {\n            if (_idle.Count > 0)\n            {\n                return new PooledConnection(this, _idle.Pop());\n            }\n            if (_created >= _maxSize)\n            {\n                throw new InvalidOperationException(\"Pool exhausted: too many connections in use.\");\n            }\n            _created++;\n        }\n        // Open outside the lock so other threads are not blocked by a slow handshake.\n        return new PooledConnection(this, new DbConnection(_connectionString));\n    }\n\n    internal void Return(DbConnection connection)\n    {\n        connection.Reset();\n        lock (_lock)\n        {\n            _idle.Push(connection);\n        }\n    }\n}\n",
            "object-pool-cs-connections/DbConnection.cs": "using System;\nusing System.Threading;\n\n// The Reusable object: expensive to open (TCP + TLS + login), cheap to reuse.\npublic class DbConnection\n{\n    private static int _nextId = 1;\n    public int Id { get; }\n    public string? CurrentDatabase { get; private set; }\n    public bool InTransaction { get; private set; }\n\n    public DbConnection(string connectionString)\n    {\n        Id = _nextId++;\n        Thread.Sleep(200); // pretend: network handshake and authentication\n        Console.WriteLine($\"opened connection #{Id}\");\n    }\n\n    public void Use(string database)\n    {\n        CurrentDatabase = database;\n    }\n\n    public void BeginTransaction()\n    {\n        InTransaction = true;\n    }\n\n    public void Reset()\n    {\n        // Leftovers from the last borrower must never reach the next one.\n        if (InTransaction)\n        {\n            Console.WriteLine($\"rolling back forgotten transaction on #{Id}\");\n            InTransaction = false;\n        }\n        CurrentDatabase = null;\n    }\n}\n",
            "object-pool-cs-connections/OrderService.cs": "using System;\n\n// The Client: borrows a connection per request and never opens or closes one itself.\npublic class OrderService\n{\n    private readonly ConnectionPool _pool;\n\n    public OrderService(ConnectionPool pool)\n    {\n        _pool = pool;\n    }\n\n    public void PlaceOrder(int orderId)\n    {\n        using (PooledConnection lease = _pool.Rent())\n        {\n            DbConnection db = lease.Connection;\n            db.Use(\"shop\");\n            db.BeginTransaction();\n            Console.WriteLine($\"order {orderId} written with connection #{db.Id}\");\n            // No commit here on purpose: Reset() will clean up when the lease is returned.\n        }\n    }\n\n    public static void Main()\n    {\n        var service = new OrderService(new ConnectionPool(\"Host=db;Database=shop\", maxSize: 2));\n        for (int i = 1; i <= 5; i++)\n        {\n            service.PlaceOrder(i); // five orders, only one connection is ever opened\n        }\n    }\n}\n",
            "object-pool-cs-connections/PooledConnection.cs": "using System;\n\n// A lease: wraps a borrowed connection and gives it back when disposed,\n// so `using` makes returning automatic even when an exception is thrown.\npublic sealed class PooledConnection : IDisposable\n{\n    private readonly ConnectionPool _pool;\n    private DbConnection? _connection;\n\n    public PooledConnection(ConnectionPool pool, DbConnection connection)\n    {\n        _pool = pool;\n        _connection = connection;\n    }\n\n    public DbConnection Connection\n    {\n        get { return _connection ?? throw new ObjectDisposedException(\"connection already returned\"); }\n    }\n\n    public void Dispose()\n    {\n        if (_connection == null)\n        {\n            return;\n        }\n        _pool.Return(_connection);\n        _connection = null; // the lease cannot be used after the object went back\n    }\n}\n"
          }
        },
        {
          "id": "object-pool-go-real",
          "title": "Go's sync.Pool and fmt printers",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "golang/go",
            "url": "https://github.com/golang/go/blob/go1.22.5/src/sync/pool.go",
            "license": "BSD-3-Clause",
            "note": "sync/pool.go and fmt/print.go (https://github.com/golang/go/blob/go1.22.5/src/fmt/print.go) are Go 1.22.5 source, trimmed with marked cuts. main.go was written for Software City."
          },
          "story": "Every fmt.Sprintf and Fprintf borrows a printer (pp) from a sync.Pool and puts it back when done, so formatting does not allocate a new buffer each call. Notice how free() resets the printer and drops oversized buffers, and that the GC may empty the pool at any time.",
          "roles": {
            "Pool": [
              "object-pool-go-real/sync/pool.go#Pool"
            ],
            "Reusable": [
              "object-pool-go-real/fmt/print.go#pp"
            ],
            "Client": [
              "object-pool-go-real/fmt/print.go#Fprintf",
              "object-pool-go-real/fmt/print.go#Sprintf",
              "object-pool-go-real/main.go#renderGreeting"
            ]
          },
          "trace": [
            {
              "at": "object-pool-go-real/main.go#handler",
              "say": "A web handler formats a response with fmt.Fprintf, which happens thousands of times per second on a busy server."
            },
            {
              "at": "object-pool-go-real/fmt/print.go#Fprintf",
              "say": "Fprintf gets a printer, formats into its buffer, writes it out, and frees it. Acquire, use, release in four lines."
            },
            {
              "at": "object-pool-go-real/fmt/print.go#newPrinter",
              "say": "newPrinter borrows a pp from ppFree and resets its flags. If the pool is empty, the pool's New function allocates one."
            },
            {
              "at": "object-pool-go-real/sync/pool.go#Pool.Get",
              "say": "Get looks in this CPU's private slot first, then its shared list, then steals from others, so goroutines rarely contend."
            },
            {
              "at": "object-pool-go-real/fmt/print.go#pp.free",
              "say": "Before going back, the printer is cleaned, and huge buffers are dropped so one giant message cannot bloat the pool forever."
            },
            {
              "at": "object-pool-go-real/sync/pool.go#Pool.Put",
              "say": "Put stores the object in the current CPU's slot for the next Get."
            },
            {
              "at": "object-pool-go-real/sync/pool.go#poolCleanup",
              "say": "At each garbage collection, pooled objects move to a victim cache and are dropped one GC later. A sync.Pool is a cache, not a guarantee."
            },
            {
              "at": "object-pool-go-real/main.go#renderGreeting",
              "say": "Your own code can use the same tool: get a buffer, Reset it, defer Put, and never keep a reference after returning it."
            }
          ],
          "files": {
            "object-pool-go-real/fmt/print.go": "// Source: Go go1.22.5 src/fmt/print.go — https://github.com/golang/go/blob/go1.22.5/src/fmt/print.go\n// BSD-3-Clause, Copyright (c) 2009 The Go Authors. Included for study.\n// Copyright 2009 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\npackage fmt\n\nimport (\n\t\"internal/fmtsort\"\n\t\"io\"\n\t\"os\"\n\t\"reflect\"\n\t\"strconv\"\n\t\"sync\"\n\t\"unicode/utf8\"\n)\n\n// … trimmed: error-string constants and the State/Formatter/Stringer interfaces (85 lines) …\n\n// Use simple []byte instead of bytes.Buffer to avoid large dependency.\ntype buffer []byte\n\nfunc (b *buffer) write(p []byte) {\n\t*b = append(*b, p...)\n}\n\nfunc (b *buffer) writeString(s string) {\n\t*b = append(*b, s...)\n}\n\nfunc (b *buffer) writeByte(c byte) {\n\t*b = append(*b, c)\n}\n\nfunc (b *buffer) writeRune(r rune) {\n\t*b = utf8.AppendRune(*b, r)\n}\n\n// pp is used to store a printer's state and is reused with sync.Pool to avoid allocations.\ntype pp struct {\n\tbuf buffer\n\n\t// arg holds the current item, as an interface{}.\n\targ any\n\n\t// value is used instead of arg for reflect values.\n\tvalue reflect.Value\n\n\t// fmt is used to format basic items such as integers or strings.\n\tfmt fmt\n\n\t// reordered records whether the format string used argument reordering.\n\treordered bool\n\t// goodArgNum records whether the most recent reordering directive was valid.\n\tgoodArgNum bool\n\t// panicking is set by catchPanic to avoid infinite panic, recover, panic, ... recursion.\n\tpanicking bool\n\t// erroring is set when printing an error string to guard against calling handleMethods.\n\terroring bool\n\t// wrapErrs is set when the format string may contain a %w verb.\n\twrapErrs bool\n\t// wrappedErrs records the targets of the %w verb.\n\twrappedErrs []int\n}\n\nvar ppFree = sync.Pool{\n\tNew: func() any { return new(pp) },\n}\n\n// newPrinter allocates a new pp struct or grabs a cached one.\nfunc newPrinter() *pp {\n\tp := ppFree.Get().(*pp)\n\tp.panicking = false\n\tp.erroring = false\n\tp.wrapErrs = false\n\tp.fmt.init(&p.buf)\n\treturn p\n}\n\n// free saves used pp structs in ppFree; avoids an allocation per invocation.\nfunc (p *pp) free() {\n\t// Proper usage of a sync.Pool requires each entry to have approximately\n\t// the same memory cost. To obtain this property when the stored type\n\t// contains a variably-sized buffer, we add a hard limit on the maximum\n\t// buffer to place back in the pool. If the buffer is larger than the\n\t// limit, we drop the buffer and recycle just the printer.\n\t//\n\t// See https://golang.org/issue/23199.\n\tif cap(p.buf) > 64*1024 {\n\t\tp.buf = nil\n\t} else {\n\t\tp.buf = p.buf[:0]\n\t}\n\tif cap(p.wrappedErrs) > 8 {\n\t\tp.wrappedErrs = nil\n\t}\n\n\tp.arg = nil\n\tp.value = reflect.Value{}\n\tp.wrappedErrs = p.wrappedErrs[:0]\n\tppFree.Put(p)\n}\n\n// … trimmed: Width, Precision, Flag, Write and WriteString (the State interface) …\n\n// These routines end in 'f' and take a format string.\n\n// Fprintf formats according to a format specifier and writes to w.\n// It returns the number of bytes written and any write error encountered.\nfunc Fprintf(w io.Writer, format string, a ...any) (n int, err error) {\n\tp := newPrinter()\n\tp.doPrintf(format, a)\n\tn, err = w.Write(p.buf)\n\tp.free()\n\treturn\n}\n\n// Printf formats according to a format specifier and writes to standard output.\n// It returns the number of bytes written and any write error encountered.\nfunc Printf(format string, a ...any) (n int, err error) {\n\treturn Fprintf(os.Stdout, format, a...)\n}\n\n// Sprintf formats according to a format specifier and returns the resulting string.\nfunc Sprintf(format string, a ...any) string {\n\tp := newPrinter()\n\tp.doPrintf(format, a)\n\ts := string(p.buf)\n\tp.free()\n\treturn s\n}\n\n// … trimmed: Appendf, Fprint, Print, Sprint, Println… (all follow the same newPrinter/free pattern) …\n// … trimmed: 860 lines of argument formatting (printArg, printValue, doPrintf) …\n\nfunc (p *pp) doPrint(a []any) {\n\tprevString := false\n\tfor argNum, arg := range a {\n\t\tisString := arg != nil && reflect.TypeOf(arg).Kind() == reflect.String\n\t\t// Add a space between two non-string arguments.\n\t\tif argNum > 0 && !isString && !prevString {\n\t\t\tp.buf.writeByte(' ')\n\t\t}\n\t\tp.printArg(arg, 'v')\n\t\tprevString = isString\n\t}\n}\n\n// … trimmed: doPrintln …\n",
            "object-pool-go-real/main.go": "// Example usage written for Software City (not part of Go).\npackage main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"net/http\"\n\t\"sync\"\n)\n\n// The same trick fmt uses internally, applied to our own buffers.\nvar bufPool = sync.Pool{\n\tNew: func() any { return new(bytes.Buffer) },\n}\n\nfunc renderGreeting(name string) string {\n\tbuf := bufPool.Get().(*bytes.Buffer)\n\tbuf.Reset() // a pooled object can arrive dirty: always reset it before use\n\tdefer bufPool.Put(buf)\n\tbuf.WriteString(\"Hello, \")\n\tbuf.WriteString(name)\n\treturn buf.String() // String() copies, so returning the buffer to the pool is safe\n}\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n\t// Every Fprintf borrows a printer from fmt's pool and gives it back before returning.\n\tfmt.Fprintf(w, \"%s\\n\", renderGreeting(r.URL.Query().Get(\"name\")))\n}\n\nfunc main() {\n\thttp.HandleFunc(\"/\", handler)\n\thttp.ListenAndServe(\":8080\", nil)\n}\n",
            "object-pool-go-real/sync/pool.go": "// Source: Go go1.22.5 src/sync/pool.go — https://github.com/golang/go/blob/go1.22.5/src/sync/pool.go\n// BSD-3-Clause, Copyright (c) 2009 The Go Authors. Included for study.\n// Copyright 2013 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\npackage sync\n\nimport (\n\t\"internal/race\"\n\t\"runtime\"\n\t\"sync/atomic\"\n\t\"unsafe\"\n)\n\n// A Pool is a set of temporary objects that may be individually saved and\n// retrieved.\n//\n// Any item stored in the Pool may be removed automatically at any time without\n// notification. If the Pool holds the only reference when this happens, the\n// item might be deallocated.\n//\n// A Pool is safe for use by multiple goroutines simultaneously.\n//\n// Pool's purpose is to cache allocated but unused items for later reuse,\n// relieving pressure on the garbage collector. That is, it makes it easy to\n// build efficient, thread-safe free lists. However, it is not suitable for all\n// free lists.\n//\n// An appropriate use of a Pool is to manage a group of temporary items\n// silently shared among and potentially reused by concurrent independent\n// clients of a package. Pool provides a way to amortize allocation overhead\n// across many clients.\n//\n// An example of good use of a Pool is in the fmt package, which maintains a\n// dynamically-sized store of temporary output buffers. The store scales under\n// load (when many goroutines are actively printing) and shrinks when\n// quiescent.\n//\n// On the other hand, a free list maintained as part of a short-lived object is\n// not a suitable use for a Pool, since the overhead does not amortize well in\n// that scenario. It is more efficient to have such objects implement their own\n// free list.\n//\n// A Pool must not be copied after first use.\n//\n// In the terminology of the Go memory model, a call to Put(x) “synchronizes before”\n// a call to Get returning that same value x.\n// Similarly, a call to New returning x “synchronizes before”\n// a call to Get returning that same value x.\ntype Pool struct {\n\tnoCopy noCopy\n\n\tlocal     unsafe.Pointer // local fixed-size per-P pool, actual type is [P]poolLocal\n\tlocalSize uintptr        // size of the local array\n\n\tvictim     unsafe.Pointer // local from previous cycle\n\tvictimSize uintptr        // size of victims array\n\n\t// New optionally specifies a function to generate\n\t// a value when Get would otherwise return nil.\n\t// It may not be changed concurrently with calls to Get.\n\tNew func() any\n}\n\n// Local per-P Pool appendix.\ntype poolLocalInternal struct {\n\tprivate any       // Can be used only by the respective P.\n\tshared  poolChain // Local P can pushHead/popHead; any P can popTail.\n}\n\ntype poolLocal struct {\n\tpoolLocalInternal\n\n\t// Prevents false sharing on widespread platforms with\n\t// 128 mod (cache line size) = 0 .\n\tpad [128 - unsafe.Sizeof(poolLocalInternal{})%128]byte\n}\n\n// … trimmed: race-detector helpers (runtime_randn, poolRaceHash, poolRaceAddr) …\n\n// Put adds x to the pool.\nfunc (p *Pool) Put(x any) {\n\tif x == nil {\n\t\treturn\n\t}\n\tif race.Enabled {\n\t\tif runtime_randn(4) == 0 {\n\t\t\t// Randomly drop x on floor.\n\t\t\treturn\n\t\t}\n\t\trace.ReleaseMerge(poolRaceAddr(x))\n\t\trace.Disable()\n\t}\n\tl, _ := p.pin()\n\tif l.private == nil {\n\t\tl.private = x\n\t} else {\n\t\tl.shared.pushHead(x)\n\t}\n\truntime_procUnpin()\n\tif race.Enabled {\n\t\trace.Enable()\n\t}\n}\n\n// Get selects an arbitrary item from the Pool, removes it from the\n// Pool, and returns it to the caller.\n// Get may choose to ignore the pool and treat it as empty.\n// Callers should not assume any relation between values passed to Put and\n// the values returned by Get.\n//\n// If Get would otherwise return nil and p.New is non-nil, Get returns\n// the result of calling p.New.\nfunc (p *Pool) Get() any {\n\tif race.Enabled {\n\t\trace.Disable()\n\t}\n\tl, pid := p.pin()\n\tx := l.private\n\tl.private = nil\n\tif x == nil {\n\t\t// Try to pop the head of the local shard. We prefer\n\t\t// the head over the tail for temporal locality of\n\t\t// reuse.\n\t\tx, _ = l.shared.popHead()\n\t\tif x == nil {\n\t\t\tx = p.getSlow(pid)\n\t\t}\n\t}\n\truntime_procUnpin()\n\tif race.Enabled {\n\t\trace.Enable()\n\t\tif x != nil {\n\t\t\trace.Acquire(poolRaceAddr(x))\n\t\t}\n\t}\n\tif x == nil && p.New != nil {\n\t\tx = p.New()\n\t}\n\treturn x\n}\n\nfunc (p *Pool) getSlow(pid int) any {\n\t// See the comment in pin regarding ordering of the loads.\n\tsize := runtime_LoadAcquintptr(&p.localSize) // load-acquire\n\tlocals := p.local                            // load-consume\n\t// Try to steal one element from other procs.\n\tfor i := 0; i < int(size); i++ {\n\t\tl := indexLocal(locals, (pid+i+1)%int(size))\n\t\tif x, _ := l.shared.popTail(); x != nil {\n\t\t\treturn x\n\t\t}\n\t}\n\n\t// Try the victim cache. We do this after attempting to steal\n\t// from all primary caches because we want objects in the\n\t// victim cache to age out if at all possible.\n\tsize = atomic.LoadUintptr(&p.victimSize)\n\tif uintptr(pid) >= size {\n\t\treturn nil\n\t}\n\tlocals = p.victim\n\tl := indexLocal(locals, pid)\n\tif x := l.private; x != nil {\n\t\tl.private = nil\n\t\treturn x\n\t}\n\tfor i := 0; i < int(size); i++ {\n\t\tl := indexLocal(locals, (pid+i)%int(size))\n\t\tif x, _ := l.shared.popTail(); x != nil {\n\t\t\treturn x\n\t\t}\n\t}\n\n\t// Mark the victim cache as empty for future gets don't bother\n\t// with it.\n\tatomic.StoreUintptr(&p.victimSize, 0)\n\n\treturn nil\n}\n\n// … trimmed: pin() and pinSlow(), which find this goroutine's per-CPU shard (50 lines) …\n\nfunc poolCleanup() {\n\t// This function is called with the world stopped, at the beginning of a garbage collection.\n\t// It must not allocate and probably should not call any runtime functions.\n\n\t// Because the world is stopped, no pool user can be in a\n\t// pinned section (in effect, this has all Ps pinned).\n\n\t// Drop victim caches from all pools.\n\tfor _, p := range oldPools {\n\t\tp.victim = nil\n\t\tp.victimSize = 0\n\t}\n\n\t// Move primary cache to victim cache.\n\tfor _, p := range allPools {\n\t\tp.victim = p.local\n\t\tp.victimSize = p.localSize\n\t\tp.local = nil\n\t\tp.localSize = 0\n\t}\n\n\t// The pools with non-empty primary caches now have non-empty\n\t// victim caches and no pools have primary caches.\n\toldPools, allPools = allPools, nil\n}\n\n// … trimmed: allPools/oldPools variables, init(), indexLocal() and runtime linkname stubs …\n"
          }
        }
      ]
    }
  ]
};
