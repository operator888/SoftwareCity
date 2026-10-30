// Family: OOP Basics. 5 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "OOP Basics"
  ],
  "patterns": [
    {
      "id": "encapsulation",
      "name": "Encapsulation",
      "family": "OOP Basics",
      "aka": [
        "Information hiding",
        "Data hiding"
      ],
      "tagline": "Keep an object's data private and change it only through methods that enforce the rules.",
      "intent": "Bundle data together with the code that is allowed to change it, and hide the data from everyone else. Outside code calls a small set of public methods, so the object can keep its own rules (no negative balance, no overfull stack) and can change how it stores things without breaking callers.",
      "analogy": "A vending machine: you press buttons and insert coins, but you cannot reach inside and grab a can. The machine checks your money before it hands anything out, and the owner can rearrange the shelves without changing the buttons.",
      "cityShape": "Look for one building whose roof carries the antennas (the private fields) and whose floors are the only ones with data-flow pipes writing into them. Other buildings connect to it with call pipes only; no pipe from outside reaches the antennas directly.",
      "roles": [
        {
          "name": "Encapsulated Class",
          "desc": "The class that owns the data and is the only code allowed to change it."
        },
        {
          "name": "Public Methods",
          "desc": "The small, deliberate interface: each method checks the rules, then updates the hidden data."
        },
        {
          "name": "Private Helpers",
          "desc": "Internal methods and storage details that callers never see and that can change freely."
        },
        {
          "name": "Client",
          "desc": "Code that uses the object only through its public methods."
        }
      ],
      "whenToUse": [
        "Data has rules that must always hold (a balance never below zero, a stack never above its limit).",
        "Several parts of the program change the same data and you want one place to check it.",
        "You expect to change how data is stored later (list to dictionary, array to heap) without touching the callers.",
        "You hand data to UI or other code and do not want it modified behind your back (return copies)."
      ],
      "pitfalls": [
        "Writing a getter and setter for every field ('public with extra steps') hides nothing; expose behaviour (withdraw) instead of raw data (setBalance).",
        "Returning a reference to an internal list or dictionary lets callers change it anyway; return a copy or a read-only view.",
        "Over-hiding: a plain record with no rules does not need private fields and a wall of accessors."
      ],
      "related": [
        "abstraction",
        "composition",
        "facade",
        "proxy"
      ],
      "quiz": [
        {
          "q": "A BankAccount has a private balance and a public withdraw(amount) that refuses to go below zero. What is the main benefit over a public balance field?",
          "options": [
            "It makes the code run faster",
            "The no-overdraft rule lives in one place and no caller can skip it",
            "It lets subclasses change the balance",
            "It removes the need for tests"
          ],
          "answer": 1,
          "why": "Every change goes through withdraw(), so the rule is checked every time. With a public field any caller could set any value."
        },
        {
          "q": "Python's LifoQueue reuses Queue but stores items in a list and pops from the end. Why does code that only calls put() and get() keep working?",
          "options": [
            "Because Python has no private fields",
            "Because callers depend only on the public methods, not on how items are stored",
            "Because LifoQueue copies every item",
            "Because put() and get() are static methods"
          ],
          "answer": 1,
          "why": "The storage (_init, _put, _get) is hidden behind put()/get(). Changing the hidden part does not change the contract callers rely on."
        }
      ],
      "demos": [
        {
          "id": "encapsulation-ts-bank",
          "title": "Bank account",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A bank account keeps its balance private and refuses overdrafts. Notice that main.ts can only call deposit(), withdraw() and getBalance(); the statement it gets back is a copy.",
          "roles": {
            "Encapsulated Class": [
              "encapsulation-ts-bank/account.ts#BankAccount"
            ],
            "Public Methods": [
              "encapsulation-ts-bank/account.ts#BankAccount.deposit",
              "encapsulation-ts-bank/account.ts#BankAccount.withdraw",
              "encapsulation-ts-bank/account.ts#BankAccount.getBalance",
              "encapsulation-ts-bank/account.ts#BankAccount.getStatement"
            ],
            "Private Helpers": [
              "encapsulation-ts-bank/account.ts#BankAccount.requirePositive",
              "encapsulation-ts-bank/transaction.ts#Transaction"
            ],
            "Client": [
              "encapsulation-ts-bank/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "encapsulation-ts-bank/main.ts#main",
              "say": "main() opens an account. It cannot see the balance field, only the methods the class chose to make public."
            },
            {
              "at": "encapsulation-ts-bank/account.ts#BankAccount.deposit",
              "say": "deposit() validates first, then changes the balance and records a transaction. Data and rule travel together."
            },
            {
              "at": "encapsulation-ts-bank/account.ts#BankAccount.requirePositive",
              "say": "A private helper holds the shared check. Callers never call it, so it can change freely."
            },
            {
              "at": "encapsulation-ts-bank/account.ts#BankAccount.withdraw",
              "say": "Withdrawing 250 from 100 is refused here. There is no other door to the balance, so the rule cannot be skipped."
            },
            {
              "at": "encapsulation-ts-bank/account.ts#BankAccount.getBalance",
              "say": "Reading is allowed, writing is not: a getter with no matching setter."
            },
            {
              "at": "encapsulation-ts-bank/account.ts#BankAccount.getStatement",
              "say": "The history comes back as new strings, not the real array, so nobody can push fake entries into it."
            }
          ],
          "files": {
            "encapsulation-ts-bank/account.ts": "import { Transaction } from './transaction';\n\n// The balance is private. The only way to change it is through deposit() and withdraw(),\n// which check the rules first. That is encapsulation: data plus the rules that guard it.\nexport class BankAccount {\n  private balance = 0;\n  private history: Transaction[] = [];\n\n  constructor(readonly owner: string) {}\n\n  deposit(amount: number): void {\n    this.requirePositive(amount);\n    this.balance += amount;\n    this.history.push(new Transaction('deposit', amount, this.balance));\n  }\n\n  withdraw(amount: number): boolean {\n    this.requirePositive(amount);\n    if (amount > this.balance) {\n      return false;\n    }\n    this.balance -= amount;\n    this.history.push(new Transaction('withdrawal', amount, this.balance));\n    return true;\n  }\n\n  getBalance(): number {\n    return this.balance;\n  }\n\n  // Hand out a copy, so callers cannot push fake entries into our real list.\n  getStatement(): string[] {\n    return this.history.map(t => t.describe());\n  }\n\n  private requirePositive(amount: number): void {\n    if (!(amount > 0)) {\n      throw new Error('Amount must be a positive number');\n    }\n  }\n}\n",
            "encapsulation-ts-bank/main.ts": "import { BankAccount } from './account';\n\nfunction main(): void {\n  const account = new BankAccount('Mia');\n  account.deposit(100);\n\n  const ok = account.withdraw(250);\n  console.log(ok ? 'Paid' : 'Refused: not enough money');\n\n  // account.balance = 1_000_000;  <- does not compile: balance is private.\n  account.withdraw(40);\n\n  console.log(`Balance: ${account.getBalance()}`);\n  console.log(account.getStatement().join('\\n'));\n}\n\nmain();\n",
            "encapsulation-ts-bank/transaction.ts": "// A small value object. Its fields are readonly: once a record is written, nobody can change it.\nexport class Transaction {\n  constructor(\n    readonly kind: 'deposit' | 'withdrawal',\n    readonly amount: number,\n    readonly balanceAfter: number,\n  ) {}\n\n  describe(): string {\n    return `${this.kind} of ${this.amount.toFixed(2)} -> balance ${this.balanceAfter.toFixed(2)}`;\n  }\n}\n"
          }
        },
        {
          "id": "encapsulation-gd-inventory",
          "title": "Godot inventory with a guarded setter",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "An Inventory resource hides its slots dictionary behind add_item(), remove_item() and a gold property whose setter clamps at zero. The shop, player and UI never touch _slots.",
          "roles": {
            "Encapsulated Class": [
              "encapsulation-gd-inventory/inventory.gd#Inventory"
            ],
            "Public Methods": [
              "encapsulation-gd-inventory/inventory.gd#add_item",
              "encapsulation-gd-inventory/inventory.gd#remove_item",
              "encapsulation-gd-inventory/inventory.gd#count_of",
              "encapsulation-gd-inventory/inventory.gd#get_items"
            ],
            "Private Helpers": [
              "encapsulation-gd-inventory/inventory.gd#_slots"
            ],
            "Client": [
              "encapsulation-gd-inventory/player.gd#pick_up",
              "encapsulation-gd-inventory/shop.gd#sell",
              "encapsulation-gd-inventory/shop.gd#buy",
              "encapsulation-gd-inventory/inventory_ui.gd#_refresh"
            ]
          },
          "trace": [
            {
              "at": "encapsulation-gd-inventory/player.gd#pick_up",
              "say": "The player picks up loot and simply asks the inventory to store it."
            },
            {
              "at": "encapsulation-gd-inventory/inventory.gd#add_item",
              "say": "Only the inventory knows the stack limit. It stores what fits and reports the leftover instead of breaking its own rule."
            },
            {
              "at": "encapsulation-gd-inventory/shop.gd#sell",
              "say": "The shop sells items. It asks remove_item() and adds gold, but never edits _slots itself."
            },
            {
              "at": "encapsulation-gd-inventory/inventory.gd#remove_item",
              "say": "remove_item() refuses if there are not enough, and cleans up empty slots. Callers cannot leave a slot at -3."
            },
            {
              "at": "encapsulation-gd-inventory/shop.gd#buy",
              "say": "Buying subtracts gold. Even a wrong subtraction cannot go negative, because the gold setter clamps the value."
            },
            {
              "at": "encapsulation-gd-inventory/inventory_ui.gd#_refresh",
              "say": "The UI redraws on the changed signal and works from a duplicate of the items, so drawing can never corrupt game state."
            }
          ],
          "files": {
            "encapsulation-gd-inventory/inventory.gd": "class_name Inventory\nextends Resource\n\n# Encapsulation in GDScript: the leading underscore marks _slots as private by convention.\n# Other scripts never touch it; they call add_item(), remove_item() and count_of().\nsignal changed\n\nconst MAX_STACK := 99\n\nvar _slots: Dictionary = {}\n\n# A property with a setter: gold can never go below zero, no matter who assigns it.\nvar gold: int = 0:\n\tset(value):\n\t\tgold = max(value, 0)\n\t\tchanged.emit()\n\n# Returns how many items did NOT fit, so the caller can leave them on the floor.\nfunc add_item(item_id: String, amount: int) -> int:\n\tvar current: int = _slots.get(item_id, 0)\n\tvar fits: int = min(amount, MAX_STACK - current)\n\t_slots[item_id] = current + fits\n\tchanged.emit()\n\treturn amount - fits\n\nfunc remove_item(item_id: String, amount: int) -> bool:\n\tif count_of(item_id) < amount:\n\t\treturn false\n\t_slots[item_id] -= amount\n\tif _slots[item_id] == 0:\n\t\t_slots.erase(item_id)\n\tchanged.emit()\n\treturn true\n\nfunc count_of(item_id: String) -> int:\n\treturn _slots.get(item_id, 0)\n\n# Give the UI a copy. Editing the copy cannot corrupt the real inventory.\nfunc get_items() -> Dictionary:\n\treturn _slots.duplicate()\n",
            "encapsulation-gd-inventory/inventory_ui.gd": "extends VBoxContainer\n\n@export var player: Player\n\nfunc _ready() -> void:\n\tplayer.inventory.changed.connect(_refresh)\n\t_refresh()\n\n# Read-only view: it asks for a copy of the items and draws labels from it.\nfunc _refresh() -> void:\n\tfor child in get_children():\n\t\tchild.queue_free()\n\tvar items := player.inventory.get_items()\n\tfor item_id in items:\n\t\tvar label := Label.new()\n\t\tlabel.text = \"%s x%d\" % [item_id, items[item_id]]\n\t\tadd_child(label)\n",
            "encapsulation-gd-inventory/player.gd": "class_name Player\nextends CharacterBody2D\n\nvar inventory: Inventory = Inventory.new()\n\nfunc pick_up(loot: Dictionary) -> void:\n\tvar leftover := inventory.add_item(loot.id, loot.amount)\n\tif leftover > 0:\n\t\tprint(\"Bag full, %d %s left on the ground\" % [leftover, loot.id])\n",
            "encapsulation-gd-inventory/shop.gd": "extends Node\n\nconst PRICES := {\"potion\": 12, \"arrow\": 1}\n\n# The shop asks the inventory to do the work. It never edits _slots or checks stack sizes itself.\nfunc sell(player: Player, item_id: String, amount: int) -> void:\n\tif player.inventory.remove_item(item_id, amount):\n\t\tplayer.inventory.gold += PRICES[item_id] * amount\n\telse:\n\t\tprint(\"You do not have %d %s\" % [amount, item_id])\n\nfunc buy(player: Player, item_id: String) -> void:\n\tvar price: int = PRICES[item_id]\n\tif player.inventory.gold < price:\n\t\treturn\n\tplayer.inventory.gold -= price\n\tplayer.inventory.add_item(item_id, 1)\n"
          }
        },
        {
          "id": "encapsulation-py-queue-real",
          "title": "CPython's thread-safe queue",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/queue.py",
            "license": "PSF-2.0",
            "note": "cpython/queue.py is from CPython 3.12.7, trimmed where marked; kitchen.py was written for Software City."
          },
          "story": "Python's standard queue hides a lock, three condition variables and its storage behind put() and get(). LifoQueue and PriorityQueue swap only the hidden storage hooks, and callers never notice.",
          "roles": {
            "Encapsulated Class": [
              "encapsulation-py-queue-real/cpython/queue.py#Queue"
            ],
            "Public Methods": [
              "encapsulation-py-queue-real/cpython/queue.py#Queue.put",
              "encapsulation-py-queue-real/cpython/queue.py#Queue.get",
              "encapsulation-py-queue-real/cpython/queue.py#Queue.qsize"
            ],
            "Private Helpers": [
              "encapsulation-py-queue-real/cpython/queue.py#Queue._init",
              "encapsulation-py-queue-real/cpython/queue.py#Queue._put",
              "encapsulation-py-queue-real/cpython/queue.py#Queue._get",
              "encapsulation-py-queue-real/cpython/queue.py#LifoQueue"
            ],
            "Client": [
              "encapsulation-py-queue-real/kitchen.py#run_kitchen",
              "encapsulation-py-queue-real/kitchen.py#run_plate_stack"
            ]
          },
          "trace": [
            {
              "at": "encapsulation-py-queue-real/kitchen.py#run_kitchen",
              "say": "The kitchen makes a queue with room for two orders and starts a cook thread. It never sees a lock."
            },
            {
              "at": "encapsulation-py-queue-real/cpython/queue.py#Queue.__init__",
              "say": "The constructor builds the hidden machinery: storage via _init(), one mutex and three conditions sharing it."
            },
            {
              "at": "encapsulation-py-queue-real/cpython/queue.py#Queue.put",
              "say": "put() takes the lock, waits while the queue is full, then calls the private _put(). Thread safety is the queue's job, not the caller's."
            },
            {
              "at": "encapsulation-py-queue-real/cpython/queue.py#Queue._put",
              "say": "The actual storage detail: append to a deque. Only code holding the lock ever reaches this line."
            },
            {
              "at": "encapsulation-py-queue-real/cpython/queue.py#Queue.get",
              "say": "get() waits until something is there, takes it via _get() and wakes a waiting producer."
            },
            {
              "at": "encapsulation-py-queue-real/kitchen.py#run_plate_stack",
              "say": "Now a LifoQueue. The calling code is identical, but the last plate in comes out first."
            },
            {
              "at": "encapsulation-py-queue-real/cpython/queue.py#LifoQueue._get",
              "say": "LifoQueue only replaced the private hooks with list.pop(). Hidden storage changed; the public contract did not."
            }
          ],
          "files": {
            "encapsulation-py-queue-real/cpython/queue.py": "# Source: CPython 3.12.7 — https://github.com/python/cpython/blob/v3.12.7/Lib/queue.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n# Changes: trimmed as marked below; everything else is verbatim.\n'''A multi-producer, multi-consumer queue.'''\n\nimport threading\nimport types\nfrom collections import deque\nfrom heapq import heappush, heappop\nfrom time import monotonic as time\ntry:\n    from _queue import SimpleQueue\nexcept ImportError:\n    SimpleQueue = None\n\n__all__ = ['Empty', 'Full', 'Queue', 'PriorityQueue', 'LifoQueue', 'SimpleQueue']\n\n\ntry:\n    from _queue import Empty\nexcept ImportError:\n    class Empty(Exception):\n        'Exception raised by Queue.get(block=0)/get_nowait().'\n        pass\n\nclass Full(Exception):\n    'Exception raised by Queue.put(block=0)/put_nowait().'\n    pass\n\n\nclass Queue:\n    '''Create a queue object with a given maximum size.\n\n    If maxsize is <= 0, the queue size is infinite.\n    '''\n\n    def __init__(self, maxsize=0):\n        self.maxsize = maxsize\n        self._init(maxsize)\n\n        # mutex must be held whenever the queue is mutating.  All methods\n        # that acquire mutex must release it before returning.  mutex\n        # is shared between the three conditions, so acquiring and\n        # releasing the conditions also acquires and releases mutex.\n        self.mutex = threading.Lock()\n\n        # Notify not_empty whenever an item is added to the queue; a\n        # thread waiting to get is notified then.\n        self.not_empty = threading.Condition(self.mutex)\n\n        # Notify not_full whenever an item is removed from the queue;\n        # a thread waiting to put is notified then.\n        self.not_full = threading.Condition(self.mutex)\n\n        # Notify all_tasks_done whenever the number of unfinished tasks\n        # drops to zero; thread waiting to join() is notified to resume\n        self.all_tasks_done = threading.Condition(self.mutex)\n        self.unfinished_tasks = 0\n\n    # … trimmed: task_done() and join(), 35 lines that count finished tasks; not needed to see encapsulation …\n\n    def qsize(self):\n        '''Return the approximate size of the queue (not reliable!).'''\n        with self.mutex:\n            return self._qsize()\n\n    # … trimmed: empty() and full(), 25 lines; both just lock the mutex and call _qsize() like qsize() …\n\n    def put(self, item, block=True, timeout=None):\n        '''Put an item into the queue.\n\n        If optional args 'block' is true and 'timeout' is None (the default),\n        block if necessary until a free slot is available. If 'timeout' is\n        a non-negative number, it blocks at most 'timeout' seconds and raises\n        the Full exception if no free slot was available within that time.\n        Otherwise ('block' is false), put an item on the queue if a free slot\n        is immediately available, else raise the Full exception ('timeout'\n        is ignored in that case).\n        '''\n        with self.not_full:\n            if self.maxsize > 0:\n                if not block:\n                    if self._qsize() >= self.maxsize:\n                        raise Full\n                elif timeout is None:\n                    while self._qsize() >= self.maxsize:\n                        self.not_full.wait()\n                elif timeout < 0:\n                    raise ValueError(\"'timeout' must be a non-negative number\")\n                else:\n                    endtime = time() + timeout\n                    while self._qsize() >= self.maxsize:\n                        remaining = endtime - time()\n                        if remaining <= 0.0:\n                            raise Full\n                        self.not_full.wait(remaining)\n            self._put(item)\n            self.unfinished_tasks += 1\n            self.not_empty.notify()\n\n    def get(self, block=True, timeout=None):\n        '''Remove and return an item from the queue.\n\n        If optional args 'block' is true and 'timeout' is None (the default),\n        block if necessary until an item is available. If 'timeout' is\n        a non-negative number, it blocks at most 'timeout' seconds and raises\n        the Empty exception if no item was available within that time.\n        Otherwise ('block' is false), return an item if one is immediately\n        available, else raise the Empty exception ('timeout' is ignored\n        in that case).\n        '''\n        with self.not_empty:\n            if not block:\n                if not self._qsize():\n                    raise Empty\n            elif timeout is None:\n                while not self._qsize():\n                    self.not_empty.wait()\n            elif timeout < 0:\n                raise ValueError(\"'timeout' must be a non-negative number\")\n            else:\n                endtime = time() + timeout\n                while not self._qsize():\n                    remaining = endtime - time()\n                    if remaining <= 0.0:\n                        raise Empty\n                    self.not_empty.wait(remaining)\n            item = self._get()\n            self.not_full.notify()\n            return item\n\n    def put_nowait(self, item):\n        '''Put an item into the queue without blocking.\n\n        Only enqueue the item if a free slot is immediately available.\n        Otherwise raise the Full exception.\n        '''\n        return self.put(item, block=False)\n\n    def get_nowait(self):\n        '''Remove and return an item from the queue without blocking.\n\n        Only get an item if one is immediately available. Otherwise\n        raise the Empty exception.\n        '''\n        return self.get(block=False)\n\n    # Override these methods to implement other queue organizations\n    # (e.g. stack or priority queue).\n    # These will only be called with appropriate locks held\n\n    # Initialize the queue representation\n    def _init(self, maxsize):\n        self.queue = deque()\n\n    def _qsize(self):\n        return len(self.queue)\n\n    # Put a new item in the queue\n    def _put(self, item):\n        self.queue.append(item)\n\n    # Get an item from the queue\n    def _get(self):\n        return self.queue.popleft()\n\n    __class_getitem__ = classmethod(types.GenericAlias)\n\n\nclass PriorityQueue(Queue):\n    '''Variant of Queue that retrieves open entries in priority order (lowest first).\n\n    Entries are typically tuples of the form:  (priority number, data).\n    '''\n\n    def _init(self, maxsize):\n        self.queue = []\n\n    def _qsize(self):\n        return len(self.queue)\n\n    def _put(self, item):\n        heappush(self.queue, item)\n\n    def _get(self):\n        return heappop(self.queue)\n\n\nclass LifoQueue(Queue):\n    '''Variant of Queue that retrieves most recently added entries first.'''\n\n    def _init(self, maxsize):\n        self.queue = []\n\n    def _qsize(self):\n        return len(self.queue)\n\n    def _put(self, item):\n        self.queue.append(item)\n\n    def _get(self):\n        return self.queue.pop()\n\n\n# … trimmed: _PySimpleQueue, a pure-Python fallback for SimpleQueue (68 lines) …\n",
            "encapsulation-py-queue-real/kitchen.py": "# Example usage written for Software City (not part of CPython).\n# A restaurant kitchen: waiters put orders in, cooks take them out, from different threads.\nimport threading\nfrom .cpython.queue import Queue, LifoQueue\n\n\ndef waiter(orders, dishes):\n    for dish in dishes:\n        orders.put(dish)\n\n\ndef cook(name, orders, count):\n    for _ in range(count):\n        dish = orders.get()\n        print(name, 'cooks', dish)\n\n\ndef run_kitchen():\n    # We never touch orders.queue, orders.mutex or the conditions. put() and get() keep them consistent.\n    orders = Queue(maxsize=2)\n    chef = threading.Thread(target=cook, args=('chef', orders, 4))\n    chef.start()\n    waiter(orders, ['soup', 'pasta', 'salad', 'cake'])\n    chef.join()\n\n\ndef run_plate_stack():\n    # Same public API, different hidden storage: LifoQueue only swaps the private _put/_get hooks.\n    plates = LifoQueue()\n    waiter(plates, ['plate 1', 'plate 2', 'plate 3'])\n    cook('dishwasher', plates, 3)\n\n\nif __name__ == '__main__':\n    run_kitchen()\n    run_plate_stack()\n"
          }
        }
      ]
    },
    {
      "id": "abstraction",
      "name": "Abstraction",
      "family": "OOP Basics",
      "aka": [
        "Interface",
        "Abstract class",
        "Hiding complexity"
      ],
      "tagline": "Expose what an object does through a simple contract and hide how it does it.",
      "intent": "Describe a capability with a small interface or abstract class (brew, put, get) and let concrete classes fill in the messy details. Code that uses the capability depends only on the contract, so it stays short, readable and unchanged when the implementation is swapped.",
      "analogy": "A car's pedals and steering wheel: you drive a petrol car and an electric car the same way, though what happens under the bonnet is completely different.",
      "cityShape": "Look for a small building holding the interface (UML-only methods, few or no floors) that several taller buildings implement (drawn as implements arrows in Java; Go satisfies interfaces implicitly). Their tall stacks of private floors are the hidden details; the client building's pipes only reach the short public floor at the same height in each.",
      "roles": [
        {
          "name": "Abstraction",
          "desc": "The interface or abstract class: names the operations and promises what they do, with no details of how."
        },
        {
          "name": "Implementation",
          "desc": "A concrete class that fulfils the contract in its own way."
        },
        {
          "name": "Hidden Details",
          "desc": "The private steps, storage and helpers inside an implementation that callers never see."
        },
        {
          "name": "Client",
          "desc": "Code that holds a reference typed as the abstraction and calls only its operations."
        }
      ],
      "whenToUse": [
        "A task has a simple idea (store a file, brew a coffee) but a complicated or changing way of doing it.",
        "You want to test business logic with a fake (in-memory store) instead of the real thing (disk, network).",
        "Several implementations will exist, or you want to keep the door open for one later.",
        "You want readers of high-level code to see the problem, not the plumbing."
      ],
      "pitfalls": [
        "Leaky abstractions: if callers must know it is a file (paths, permissions) to use it correctly, the interface is hiding the wrong things.",
        "Premature interfaces: an interface with exactly one implementation and no test fake often adds a file and nothing else.",
        "Too wide: an interface with twenty methods forces every implementation to fake the ones it does not need; keep contracts small."
      ],
      "related": [
        "encapsulation",
        "polymorphism",
        "inheritance",
        "dependency-injection",
        "repository",
        "bridge"
      ],
      "quiz": [
        {
          "q": "AvatarService holds a BlobStore and calls Put/Get. What must change to store avatars in memory during tests?",
          "options": [
            "AvatarService must be rewritten",
            "Only the wiring code passes a MemoryStore instead of a DiskStore",
            "BlobStore must gain a new method",
            "DiskStore must be deleted"
          ],
          "answer": 1,
          "why": "AvatarService depends on the abstraction only, so any BlobStore works. Only the code that chooses the concrete class changes."
        },
        {
          "q": "Python's Mapping ABC asks you to write only __getitem__, __iter__ and __len__. Why do get() and 'in' then work for free?",
          "options": [
            "Python copies your object into a dict",
            "Mapping implements get() and __contains__ in terms of the abstract methods you supply",
            "They are built into every class",
            "The ABC registers your class with C code"
          ],
          "answer": 1,
          "why": "The abstract class defines the contract and builds extra behaviour on top of it. Your class supplies the 'how' for three methods and inherits the rest."
        }
      ],
      "demos": [
        {
          "id": "abstraction-java-coffee",
          "title": "Office coffee machine",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "The office makes coffee through a one-method CoffeeMachine interface. An espresso machine and a capsule machine do wildly different things inside, and Office.java never knows which one it has.",
          "roles": {
            "Abstraction": [
              "abstraction-java-coffee/CoffeeMachine.java#CoffeeMachine"
            ],
            "Implementation": [
              "abstraction-java-coffee/EspressoMachine.java#EspressoMachine",
              "abstraction-java-coffee/CapsuleMachine.java#CapsuleMachine"
            ],
            "Hidden Details": [
              "abstraction-java-coffee/EspressoMachine.java#EspressoMachine.heatWater",
              "abstraction-java-coffee/EspressoMachine.java#EspressoMachine.grindBeans",
              "abstraction-java-coffee/EspressoMachine.java#EspressoMachine.pressShot",
              "abstraction-java-coffee/CapsuleMachine.java#CapsuleMachine.pierceCapsule"
            ],
            "Client": [
              "abstraction-java-coffee/Office.java#Office"
            ]
          },
          "trace": [
            {
              "at": "abstraction-java-coffee/Office.java#Office.main",
              "say": "main() builds two offices, one with each machine. This is the only place that names a concrete class."
            },
            {
              "at": "abstraction-java-coffee/Office.java#Office.morningBreak",
              "say": "The office asks for a cappuccino through the interface. One line, no knowledge of boilers or capsules."
            },
            {
              "at": "abstraction-java-coffee/EspressoMachine.java#EspressoMachine.brew",
              "say": "The espresso machine answers with a three-step recipe. The steps are its business, not the office's."
            },
            {
              "at": "abstraction-java-coffee/EspressoMachine.java#EspressoMachine.grindBeans",
              "say": "A private detail with its own state (grams of beans left). It could change tomorrow without touching Office."
            },
            {
              "at": "abstraction-java-coffee/CapsuleMachine.java#CapsuleMachine.brew",
              "say": "Second office, same call, totally different inside: count capsules, pierce one, done."
            },
            {
              "at": "abstraction-java-coffee/CapsuleMachine.java#CapsuleMachine.pierceCapsule",
              "say": "Hidden again. The abstraction let us replace a whole machine while morningBreak() stayed identical."
            }
          ],
          "files": {
            "abstraction-java-coffee/CapsuleMachine.java": "// A completely different inside, behind the same simple outside.\npublic class CapsuleMachine implements CoffeeMachine {\n    private int capsules = 10;\n\n    public String brew(String drink) {\n        if (capsules == 0) {\n            return \"No capsules left\";\n        }\n        capsules--;\n        pierceCapsule();\n        return drink + \" from a capsule\";\n    }\n\n    private void pierceCapsule() {\n        System.out.println(\"Piercing capsule, \" + capsules + \" left\");\n    }\n}\n",
            "abstraction-java-coffee/CoffeeMachine.java": "// The abstraction: WHAT a coffee machine can do, with no word about HOW.\n// Anyone who has a CoffeeMachine can make coffee without knowing pumps, grinders or capsules.\npublic interface CoffeeMachine {\n    String brew(String drink);\n}\n",
            "abstraction-java-coffee/EspressoMachine.java": "// One way to do it, with many steps. All of them are private: the office never sees them.\npublic class EspressoMachine implements CoffeeMachine {\n    private int beansInGrams = 500;\n\n    public String brew(String drink) {\n        heatWater(93);\n        grindBeans(18);\n        pressShot();\n        return drink + \" from fresh beans\";\n    }\n\n    private void heatWater(int celsius) {\n        System.out.println(\"Heating boiler to \" + celsius + \"°C\");\n    }\n\n    private void grindBeans(int grams) {\n        beansInGrams -= grams;\n        System.out.println(\"Grinding \" + grams + \"g, \" + beansInGrams + \"g left\");\n    }\n\n    private void pressShot() {\n        System.out.println(\"Pressing 9 bar through the puck\");\n    }\n}\n",
            "abstraction-java-coffee/Office.java": "// The office only knows the interface. Swap the machine and this code does not change.\npublic class Office {\n    private final CoffeeMachine machine;\n\n    public Office(CoffeeMachine machine) {\n        this.machine = machine;\n    }\n\n    public void morningBreak() {\n        System.out.println(machine.brew(\"Cappuccino\"));\n    }\n\n    public static void main(String[] args) {\n        new Office(new EspressoMachine()).morningBreak();\n        new Office(new CapsuleMachine()).morningBreak();\n    }\n}\n"
          }
        },
        {
          "id": "abstraction-go-storage",
          "title": "Avatar uploads behind a BlobStore",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "A backend service saves user avatars through a two-method BlobStore interface. Disk and in-memory stores implement it; AvatarService reads like the business rule and never mentions files or maps.",
          "roles": {
            "Abstraction": [
              "abstraction-go-storage/store.go#BlobStore"
            ],
            "Implementation": [
              "abstraction-go-storage/disk_store.go#DiskStore",
              "abstraction-go-storage/memory_store.go#MemoryStore"
            ],
            "Hidden Details": [
              "abstraction-go-storage/disk_store.go#DiskStore.pathFor",
              "abstraction-go-storage/avatar_service.go#AvatarService.keyFor"
            ],
            "Client": [
              "abstraction-go-storage/avatar_service.go#AvatarService",
              "abstraction-go-storage/main.go#Run"
            ]
          },
          "trace": [
            {
              "at": "abstraction-go-storage/main.go#Run",
              "say": "Run() picks a concrete store and hands it over as a BlobStore. After this line nobody cares which one it was."
            },
            {
              "at": "abstraction-go-storage/avatar_service.go#NewAvatarService",
              "say": "The service stores the abstraction in a field. Its type is the interface, not *DiskStore."
            },
            {
              "at": "abstraction-go-storage/avatar_service.go#AvatarService.Upload",
              "say": "Upload enforces the business rule (max size) and then says only 'put this'. No paths, no permissions."
            },
            {
              "at": "abstraction-go-storage/disk_store.go#DiskStore.Put",
              "say": "In production the call lands here: create folders, write the file with the right permissions."
            },
            {
              "at": "abstraction-go-storage/disk_store.go#DiskStore.pathFor",
              "say": "A hidden detail that also blocks '../' tricks. Callers get that safety without knowing it exists."
            },
            {
              "at": "abstraction-go-storage/memory_store.go#MemoryStore.Put",
              "say": "In a test the same Upload lands here instead: a map write. Same contract, zero files to clean up."
            },
            {
              "at": "abstraction-go-storage/avatar_service.go#AvatarService.Download",
              "say": "Reading back is just Get through the interface, whichever store sits behind it."
            }
          ],
          "files": {
            "abstraction-go-storage/avatar_service.go": "package storage\n\nimport \"fmt\"\n\n// AvatarService is business logic. It depends on the BlobStore abstraction only,\n// so it reads like the problem (\"save this user's avatar\"), not like file handling.\ntype AvatarService struct {\n\tstore   BlobStore\n\tmaxSize int\n}\n\nfunc NewAvatarService(store BlobStore) *AvatarService {\n\treturn &AvatarService{store: store, maxSize: 256 * 1024}\n}\n\nfunc (s *AvatarService) Upload(userID string, image []byte) error {\n\tif len(image) > s.maxSize {\n\t\treturn fmt.Errorf(\"avatar too large: %d bytes\", len(image))\n\t}\n\treturn s.store.Put(s.keyFor(userID), image)\n}\n\nfunc (s *AvatarService) Download(userID string) ([]byte, error) {\n\treturn s.store.Get(s.keyFor(userID))\n}\n\nfunc (s *AvatarService) keyFor(userID string) string {\n\treturn \"avatars/\" + userID + \".png\"\n}\n",
            "abstraction-go-storage/disk_store.go": "package storage\n\nimport (\n\t\"os\"\n\t\"path/filepath\"\n)\n\n// DiskStore hides file paths, permissions and directories behind Put and Get.\ntype DiskStore struct {\n\troot string\n}\n\nfunc NewDiskStore(root string) *DiskStore {\n\treturn &DiskStore{root: root}\n}\n\nfunc (d *DiskStore) Put(key string, data []byte) error {\n\tpath := d.pathFor(key)\n\tif err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {\n\t\treturn err\n\t}\n\treturn os.WriteFile(path, data, 0o644)\n}\n\nfunc (d *DiskStore) Get(key string) ([]byte, error) {\n\treturn os.ReadFile(d.pathFor(key))\n}\n\nfunc (d *DiskStore) pathFor(key string) string {\n\treturn filepath.Join(d.root, filepath.Clean(\"/\"+key))\n}\n",
            "abstraction-go-storage/main.go": "package storage\n\nimport \"fmt\"\n\n// Run wires the pieces: production uses disk, a test would pass NewMemoryStore().\n// Only this function knows which concrete store exists.\nfunc Run(useDisk bool) {\n\tvar store BlobStore\n\tif useDisk {\n\t\tstore = NewDiskStore(\"/var/lib/app\")\n\t} else {\n\t\tstore = NewMemoryStore()\n\t}\n\tavatars := NewAvatarService(store)\n\tif err := avatars.Upload(\"theo\", []byte(\"png bytes\")); err != nil {\n\t\tfmt.Println(\"upload failed:\", err)\n\t\treturn\n\t}\n\tdata, _ := avatars.Download(\"theo\")\n\tfmt.Println(\"downloaded\", len(data), \"bytes\")\n}\n",
            "abstraction-go-storage/memory_store.go": "package storage\n\nimport \"fmt\"\n\n// MemoryStore keeps everything in a map. Perfect for tests: no files to clean up.\ntype MemoryStore struct {\n\tblobs map[string][]byte\n}\n\nfunc NewMemoryStore() *MemoryStore {\n\treturn &MemoryStore{blobs: map[string][]byte{}}\n}\n\nfunc (m *MemoryStore) Put(key string, data []byte) error {\n\tm.blobs[key] = append([]byte(nil), data...)\n\treturn nil\n}\n\nfunc (m *MemoryStore) Get(key string) ([]byte, error) {\n\tdata, ok := m.blobs[key]\n\tif !ok {\n\t\treturn nil, fmt.Errorf(\"no blob %q\", key)\n\t}\n\treturn data, nil\n}\n",
            "abstraction-go-storage/store.go": "package storage\n\n// BlobStore is the abstraction: save bytes under a key, get them back.\n// Nothing here says disk, memory or cloud. That decision lives elsewhere.\ntype BlobStore interface {\n\tPut(key string, data []byte) error\n\tGet(key string) ([]byte, error)\n}\n"
          }
        },
        {
          "id": "abstraction-py-mapping-real",
          "title": "CPython's Mapping abstract base class",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.7/Lib/_collections_abc.py",
            "license": "PSF-2.0",
            "note": "cpython/collections_abc.py is an excerpt of Lib/_collections_abc.py from CPython 3.12.7 (renamed without the leading underscore, cuts marked); settings.py was written for Software City."
          },
          "story": "The standard library defines what a mapping is with abstract methods, then builds get(), 'in' and values() on top of them. A settings class supplies three methods and behaves like a dict everywhere.",
          "roles": {
            "Abstraction": [
              "abstraction-py-mapping-real/cpython/collections_abc.py#Mapping",
              "abstraction-py-mapping-real/cpython/collections_abc.py#Collection",
              "abstraction-py-mapping-real/cpython/collections_abc.py#Sized",
              "abstraction-py-mapping-real/cpython/collections_abc.py#Iterable"
            ],
            "Implementation": [
              "abstraction-py-mapping-real/settings.py#EnvSettings"
            ],
            "Hidden Details": [
              "abstraction-py-mapping-real/settings.py#EnvSettings.__getitem__",
              "abstraction-py-mapping-real/settings.py#EnvSettings.__iter__"
            ],
            "Client": [
              "abstraction-py-mapping-real/settings.py#describe"
            ]
          },
          "trace": [
            {
              "at": "abstraction-py-mapping-real/settings.py#main",
              "say": "main() calls describe() twice: once with environment-backed settings, once with a plain dict."
            },
            {
              "at": "abstraction-py-mapping-real/settings.py#describe",
              "say": "describe() uses get(), 'in', len() and values(): the Mapping contract. It never asks where the data lives."
            },
            {
              "at": "abstraction-py-mapping-real/cpython/collections_abc.py#Mapping.get",
              "say": "get() is written once, for every mapping, using only self[key]. The abstract class adds behaviour on top of the contract."
            },
            {
              "at": "abstraction-py-mapping-real/settings.py#EnvSettings.__getitem__",
              "say": "self[key] lands in our class: the hidden detail of reading APP_PORT from the environment."
            },
            {
              "at": "abstraction-py-mapping-real/cpython/collections_abc.py#Mapping.__contains__",
              "say": "'debug' in config is also free: it tries self[key] and turns KeyError into False."
            },
            {
              "at": "abstraction-py-mapping-real/cpython/collections_abc.py#ValuesView.__iter__",
              "say": "values() returns a view that loops over the mapping's keys and looks each one up, again via the abstract methods only."
            },
            {
              "at": "abstraction-py-mapping-real/settings.py#EnvSettings.__iter__",
              "say": "Iteration filters environment variables by prefix. Swap this for a file or a database and describe() still works."
            }
          ],
          "files": {
            "abstraction-py-mapping-real/cpython/collections_abc.py": "# Source: CPython 3.12.7 — https://github.com/python/cpython/blob/v3.12.7/Lib/_collections_abc.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n# Changes: excerpt; trimmed parts are marked below, everything else is verbatim.\n# Copyright 2007 Google, Inc. All Rights Reserved.\n# Licensed to PSF under a Contributor Agreement.\n\n\"\"\"Abstract Base Classes (ABCs) for collections, according to PEP 3119.\n\nUnit tests are in test_collections.\n\"\"\"\n# … trimmed: 27 lines of maintenance notes …\n\nfrom abc import ABCMeta, abstractmethod\nimport sys\n\nGenericAlias = type(list[int])\nEllipsisType = type(...)\ndef _f(): pass\n# … trimmed: 62 lines that collect the built-in iterator types for register() calls …\n\n### ONE-TRICK PONIES ###\n\ndef _check_methods(C, *methods):\n    mro = C.__mro__\n    for method in methods:\n        for B in mro:\n            if method in B.__dict__:\n                if B.__dict__[method] is None:\n                    return NotImplemented\n                break\n        else:\n            return NotImplemented\n    return True\n\n# … trimmed: Hashable, Awaitable, Coroutine, AsyncIterable, AsyncIterator, AsyncGenerator (160 lines) …\n\nclass Iterable(metaclass=ABCMeta):\n\n    __slots__ = ()\n\n    @abstractmethod\n    def __iter__(self):\n        while False:\n            yield None\n\n    @classmethod\n    def __subclasshook__(cls, C):\n        if cls is Iterable:\n            return _check_methods(C, \"__iter__\")\n        return NotImplemented\n\n    __class_getitem__ = classmethod(GenericAlias)\n\n\n# … trimmed: Iterator, Reversible, Generator (100 lines) …\n\nclass Sized(metaclass=ABCMeta):\n\n    __slots__ = ()\n\n    @abstractmethod\n    def __len__(self):\n        return 0\n\n    @classmethod\n    def __subclasshook__(cls, C):\n        if cls is Sized:\n            return _check_methods(C, \"__len__\")\n        return NotImplemented\n\n\nclass Container(metaclass=ABCMeta):\n\n    __slots__ = ()\n\n    @abstractmethod\n    def __contains__(self, x):\n        return False\n\n    @classmethod\n    def __subclasshook__(cls, C):\n        if cls is Container:\n            return _check_methods(C, \"__contains__\")\n        return NotImplemented\n\n    __class_getitem__ = classmethod(GenericAlias)\n\n\nclass Collection(Sized, Iterable, Container):\n\n    __slots__ = ()\n\n    @classmethod\n    def __subclasshook__(cls, C):\n        if cls is Collection:\n            return _check_methods(C,  \"__len__\", \"__iter__\", \"__contains__\")\n        return NotImplemented\n\n\n# … trimmed: Buffer, Callable, Set, MutableSet (343 lines) …\n\n### MAPPINGS ###\n\nclass Mapping(Collection):\n    \"\"\"A Mapping is a generic container for associating key/value\n    pairs.\n\n    This class provides concrete generic implementations of all\n    methods except for __getitem__, __iter__, and __len__.\n    \"\"\"\n\n    __slots__ = ()\n\n    # Tell ABCMeta.__new__ that this class should have TPFLAGS_MAPPING set.\n    __abc_tpflags__ = 1 << 6 # Py_TPFLAGS_MAPPING\n\n    @abstractmethod\n    def __getitem__(self, key):\n        raise KeyError\n\n    def get(self, key, default=None):\n        'D.get(k[,d]) -> D[k] if k in D, else d.  d defaults to None.'\n        try:\n            return self[key]\n        except KeyError:\n            return default\n\n    def __contains__(self, key):\n        try:\n            self[key]\n        except KeyError:\n            return False\n        else:\n            return True\n\n    def keys(self):\n        \"D.keys() -> a set-like object providing a view on D's keys\"\n        return KeysView(self)\n\n    def items(self):\n        \"D.items() -> a set-like object providing a view on D's items\"\n        return ItemsView(self)\n\n    def values(self):\n        \"D.values() -> an object providing a view on D's values\"\n        return ValuesView(self)\n\n    def __eq__(self, other):\n        if not isinstance(other, Mapping):\n            return NotImplemented\n        return dict(self.items()) == dict(other.items())\n\n    __reversed__ = None\n\nMapping.register(mappingproxy)\n\n\nclass MappingView(Sized):\n\n    __slots__ = '_mapping',\n\n    def __init__(self, mapping):\n        self._mapping = mapping\n\n    def __len__(self):\n        return len(self._mapping)\n\n    def __repr__(self):\n        return '{0.__class__.__name__}({0._mapping!r})'.format(self)\n\n    __class_getitem__ = classmethod(GenericAlias)\n\n\n# … trimmed: KeysView and ItemsView (42 lines; set-like views built on the trimmed Set ABC) …\n\n\nclass ValuesView(MappingView, Collection):\n\n    __slots__ = ()\n\n    def __contains__(self, value):\n        for key in self._mapping:\n            v = self._mapping[key]\n            if v is value or v == value:\n                return True\n        return False\n\n    def __iter__(self):\n        for key in self._mapping:\n            yield self._mapping[key]\n\n\nValuesView.register(dict_values)\n\n# … trimmed: MutableMapping, Sequence, MutableSequence and their register() calls (about 250 lines) …\n",
            "abstraction-py-mapping-real/settings.py": "# Example usage written for Software City (not part of CPython).\n# A read-only settings object built on the Mapping abstraction.\nimport os\nfrom .cpython.collections_abc import Mapping\n\n\nclass EnvSettings(Mapping):\n    \"\"\"Settings read from environment variables that start with a prefix, e.g. APP_PORT.\"\"\"\n\n    def __init__(self, prefix):\n        self.prefix = prefix\n\n    # The three abstract methods: the only \"how\" we have to supply.\n    def __getitem__(self, key):\n        return os.environ[self.prefix + key.upper()]\n\n    def __iter__(self):\n        for name in os.environ:\n            if name.startswith(self.prefix):\n                yield name[len(self.prefix):].lower()\n\n    def __len__(self):\n        return sum(1 for _ in self)\n\n\ndef describe(config):\n    # This function only relies on the Mapping abstraction. A dict works here too.\n    port = config.get('port', '8000')\n    debug = 'debug' in config\n    print('port', port, 'debug', debug, 'keys', len(config))\n    for value in config.values():\n        print(' -', value)\n\n\ndef main():\n    os.environ['APP_PORT'] = '9000'\n    os.environ['APP_DEBUG'] = '1'\n    describe(EnvSettings('APP_'))\n    describe({'port': '8080'})\n\n\nif __name__ == '__main__':\n    main()\n"
          }
        }
      ]
    },
    {
      "id": "inheritance",
      "name": "Inheritance",
      "family": "OOP Basics",
      "aka": [
        "Subclassing",
        "is-a relationship",
        "extends"
      ],
      "tagline": "A new class extends an existing one, reusing its code and changing only what differs.",
      "intent": "A subclass inherits the fields and methods of a base class and then adds new ones or overrides existing ones. Shared behaviour is written once in the parent, and each child describes only what makes it special, often calling super to extend rather than replace the parent's work.",
      "analogy": "A recipe for 'pizza dough' that every pizza starts from: the margherita recipe says 'make the dough, then add tomato and mozzarella' instead of repeating the dough steps.",
      "cityShape": "Look for extends arrows climbing from small child buildings to a base building. Children have only a few floors, and their overriding floors (draw, update, monthly_pay) sit at the same height as the parent's floor of the same name, with super calls piping back into the parent.",
      "roles": [
        {
          "name": "Base Class",
          "desc": "The parent: holds the shared fields and default behaviour."
        },
        {
          "name": "Subclass",
          "desc": "A child that extends the base, adding fields and methods of its own."
        },
        {
          "name": "Override",
          "desc": "A child method with the same name as a parent method; it replaces the parent's version or extends it with super."
        },
        {
          "name": "Client",
          "desc": "Code that treats every object as the base type and lets each one run its own version."
        }
      ],
      "whenToUse": [
        "There is a true 'is-a' relationship: a Manager is an Employee, a Button is a Widget.",
        "Several classes share a lot of code and differ in a few well-defined methods.",
        "A framework gives you a base class to extend (Godot nodes, UI toolkits, test cases)."
      ],
      "pitfalls": [
        "Deep hierarchies (five or more levels) become hard to follow: to understand one method you read every ancestor.",
        "Fragile base class: a change in the parent silently changes every child; overrides that forget super() skip important setup.",
        "Inheriting only to reuse a helper ('Stack extends ArrayList') exposes methods that break the child's rules; prefer composition for has-a relationships."
      ],
      "related": [
        "polymorphism",
        "composition",
        "abstraction",
        "template-method",
        "state"
      ],
      "quiz": [
        {
          "q": "Manager.monthly_pay() returns super().monthly_pay() + bonus / 12. What happens if the base salary formula in Employee changes?",
          "options": [
            "Manager keeps the old formula",
            "Manager automatically uses the new formula and still adds the bonus",
            "Python raises an error",
            "Only Intern is affected"
          ],
          "answer": 1,
          "why": "Calling super extends the parent's behaviour instead of copying it, so a fix in the parent flows to the child."
        },
        {
          "q": "Which relationship is a poor fit for inheritance?",
          "options": [
            "Checkbox and Widget",
            "Manager and Employee",
            "Car and Engine",
            "IdleState and State"
          ],
          "answer": 2,
          "why": "A car HAS an engine; it is not a kind of engine. That is composition. The others are genuine is-a relationships."
        }
      ],
      "demos": [
        {
          "id": "inheritance-py-employees",
          "title": "Payroll: employees, managers, interns",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Employee has a name, a salary and describe(). Manager extends monthly_pay() with super() and adds a bonus; Intern replaces it with a stipend. describe() is written once and works for all.",
          "roles": {
            "Base Class": [
              "inheritance-py-employees/employee.py#Employee"
            ],
            "Subclass": [
              "inheritance-py-employees/manager.py#Manager",
              "inheritance-py-employees/intern.py#Intern"
            ],
            "Override": [
              "inheritance-py-employees/manager.py#Manager.monthly_pay",
              "inheritance-py-employees/intern.py#Intern.monthly_pay"
            ],
            "Client": [
              "inheritance-py-employees/payroll.py#run_payroll"
            ]
          },
          "trace": [
            {
              "at": "inheritance-py-employees/payroll.py#run_payroll",
              "say": "Payroll creates a manager, a regular employee and an intern, then asks each to describe itself."
            },
            {
              "at": "inheritance-py-employees/manager.py#Manager.__init__",
              "say": "The manager calls super().__init__ so the parent sets name and salary. The child only adds bonus and team."
            },
            {
              "at": "inheritance-py-employees/employee.py#Employee.describe",
              "say": "describe() exists only in Employee. Every subclass inherits it, so the text format lives in one place."
            },
            {
              "at": "inheritance-py-employees/manager.py#Manager.monthly_pay",
              "say": "describe() calls monthly_pay(). For a manager this override runs: it extends the parent's result instead of copying the formula."
            },
            {
              "at": "inheritance-py-employees/employee.py#Employee.monthly_pay",
              "say": "super().monthly_pay() lands back in the parent: salary divided by twelve. Change it here and managers follow."
            },
            {
              "at": "inheritance-py-employees/intern.py#Intern.monthly_pay",
              "say": "The intern overrides without super: a fixed stipend fully replaces the parent's version."
            }
          ],
          "files": {
            "inheritance-py-employees/employee.py": "# The base class: what every employee has and does.\nclass Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def monthly_pay(self):\n        return self.salary / 12\n\n    def describe(self):\n        # Inherited by every subclass. Note it calls monthly_pay(), which a subclass may override.\n        return f\"{self.name}: {self.monthly_pay():.2f} per month\"\n",
            "inheritance-py-employees/intern.py": "from .employee import Employee\n\n\n# An Intern IS an Employee too, but is paid a fixed stipend.\nclass Intern(Employee):\n    def __init__(self, name, stipend):\n        super().__init__(name, salary=0)\n        self.stipend = stipend\n\n    # Replace the parent's behaviour completely.\n    def monthly_pay(self):\n        return self.stipend\n",
            "inheritance-py-employees/manager.py": "from .employee import Employee\n\n\n# A Manager IS an Employee, plus a team and a bonus.\nclass Manager(Employee):\n    def __init__(self, name, salary, bonus):\n        super().__init__(name, salary)\n        self.bonus = bonus\n        self.team = []\n\n    def add_to_team(self, employee):\n        self.team.append(employee)\n\n    # Extend the parent's behaviour: start from the normal pay, then add to it.\n    def monthly_pay(self):\n        return super().monthly_pay() + self.bonus / 12\n",
            "inheritance-py-employees/payroll.py": "from .employee import Employee\nfrom .manager import Manager\nfrom .intern import Intern\n\n\ndef run_payroll():\n    boss = Manager(\"Ana\", salary=72000, bonus=6000)\n    dev = Employee(\"Ben\", salary=54000)\n    trainee = Intern(\"Cleo\", stipend=900)\n    boss.add_to_team(dev)\n    boss.add_to_team(trainee)\n\n    # describe() was written once in Employee and reused by all three.\n    for person in [boss, dev, trainee]:\n        print(person.describe())\n\n\nif __name__ == \"__main__\":\n    run_payroll()\n"
          }
        },
        {
          "id": "inheritance-kt-widgets",
          "title": "UI widgets three levels deep",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "Widget knows its frame and hit-testing. Button and Checkbox extend it, and IconButton extends Button. Each draw() calls super.draw() first, so every level adds a layer on top of its parent.",
          "roles": {
            "Base Class": [
              "inheritance-kt-widgets/Widget.kt#Widget"
            ],
            "Subclass": [
              "inheritance-kt-widgets/Button.kt#Button",
              "inheritance-kt-widgets/IconButton.kt#IconButton",
              "inheritance-kt-widgets/Checkbox.kt#Checkbox"
            ],
            "Override": [
              "inheritance-kt-widgets/Button.kt#Button.draw",
              "inheritance-kt-widgets/IconButton.kt#IconButton.draw",
              "inheritance-kt-widgets/Checkbox.kt#Checkbox.draw",
              "inheritance-kt-widgets/Checkbox.kt#Checkbox.onClick"
            ],
            "Client": [
              "inheritance-kt-widgets/Screen.kt#Screen"
            ]
          },
          "trace": [
            {
              "at": "inheritance-kt-widgets/Screen.kt#main",
              "say": "main() adds a Button, an IconButton and a Checkbox. The screen stores all of them as plain Widget."
            },
            {
              "at": "inheritance-kt-widgets/Screen.kt#Screen.render",
              "say": "render() calls draw() on each Widget. Kotlin picks the most specific override for each object."
            },
            {
              "at": "inheritance-kt-widgets/IconButton.kt#IconButton.draw",
              "say": "IconButton's draw starts with super.draw(): let my parent, Button, do its part first."
            },
            {
              "at": "inheritance-kt-widgets/Button.kt#Button.draw",
              "say": "Button also calls super, then adds its label. Each level adds one layer of drawing."
            },
            {
              "at": "inheritance-kt-widgets/Widget.kt#Widget.draw",
              "say": "At the top, Widget draws the frame. Three classes cooperated, each writing only what is new."
            },
            {
              "at": "inheritance-kt-widgets/Screen.kt#Screen.click",
              "say": "click() uses contains(), which is inherited unchanged: hit-testing is written once for every widget."
            },
            {
              "at": "inheritance-kt-widgets/Checkbox.kt#Checkbox.onClick",
              "say": "The checkbox overrides onClick to flip its own state; the base version did nothing."
            }
          ],
          "files": {
            "inheritance-kt-widgets/Button.kt": "// A Button IS a Widget: it reuses contains() and the frame, and adds a label and an action.\nopen class Button(x: Int, y: Int, val label: String, val action: ClickAction) : Widget(x, y, 120, 32) {\n    override fun draw(canvas: Canvas) {\n        super.draw(canvas)\n        canvas.text(x + 8, y + 10, label)\n    }\n\n    override fun onClick() {\n        if (enabled) {\n            action()\n        }\n    }\n}\n",
            "inheritance-kt-widgets/Checkbox.kt": "// A sibling of Button. It keeps the base frame logic but has its own state and click behaviour.\nclass Checkbox(x: Int, y: Int, val label: String) : Widget(x, y, 24, 24) {\n    var checked: Boolean = false\n\n    override fun draw(canvas: Canvas) {\n        super.draw(canvas)\n        val mark = if (checked) \"[x]\" else \"[ ]\"\n        canvas.text(x, y, \"$mark $label\")\n    }\n\n    override fun onClick() {\n        checked = !checked\n    }\n}\n",
            "inheritance-kt-widgets/IconButton.kt": "// Third level: IconButton -> Button -> Widget. It only adds what is new: the icon.\nclass IconButton(x: Int, y: Int, label: String, val icon: String, action: ClickAction) : Button(x, y, label, action) {\n    override fun draw(canvas: Canvas) {\n        super.draw(canvas)\n        canvas.text(x + 100, y + 10, icon)\n    }\n}\n",
            "inheritance-kt-widgets/Screen.kt": "// The screen stores everything as Widget. It can draw and route clicks without knowing the subclasses.\nclass Screen {\n    private val widgets = mutableListOf<Widget>()\n    private val canvas = Canvas()\n\n    fun add(widget: Widget) {\n        widgets.add(widget)\n    }\n\n    fun render() {\n        for (w in widgets) {\n            w.draw(canvas)\n        }\n    }\n\n    fun click(px: Int, py: Int) {\n        val hit = widgets.lastOrNull { it.contains(px, py) }\n        hit?.onClick()\n    }\n}\n\nfun main() {\n    val screen = Screen()\n    screen.add(Button(10, 10, \"Save\") { println(\"saved\") })\n    screen.add(IconButton(10, 50, \"Share\", \"↗\") { println(\"shared\") })\n    screen.add(Checkbox(10, 90, \"Dark mode\"))\n    screen.render()\n    screen.click(15, 95)\n    screen.render()\n}\n",
            "inheritance-kt-widgets/Widget.kt": "typealias ClickAction = () -> Unit\n\n// The base class. Kotlin classes are final by default, so 'open' marks what children may change.\nopen class Widget(val x: Int, val y: Int, val width: Int, val height: Int) {\n    var enabled: Boolean = true\n\n    fun contains(px: Int, py: Int): Boolean {\n        return px >= x && px < x + width && py >= y && py < y + height\n    }\n\n    open fun draw(canvas: Canvas) {\n        canvas.rect(x, y, width, height)\n    }\n\n    open fun onClick() {\n    }\n}\n\nclass Canvas {\n    fun rect(x: Int, y: Int, w: Int, h: Int) {\n        println(\"rect at ($x,$y) size ${w}x$h\")\n    }\n\n    fun text(x: Int, y: Int, value: String) {\n        println(\"text '$value' at ($x,$y)\")\n    }\n}\n"
          }
        },
        {
          "id": "inheritance-gd-fsm-real",
          "title": "Godot demo: state classes that extend each other",
          "lang": "GDScript",
          "level": "intermediate",
          "source": {
            "repo": "godotengine/godot-demo-projects",
            "url": "https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/state_machine/state.gd",
            "license": "MIT",
            "note": "Six verbatim files from 2d/finite_state_machine at tag 4.2-31d1c0c (player, jump, stagger and attack states left out). Each file links to its own source."
          },
          "story": "The official Godot state-machine demo builds a chain: State, then Motion, then OnGround, then Idle and Move. Each level adds one thing, and handle_input() climbs the chain with super.",
          "roles": {
            "Base Class": [
              "inheritance-gd-fsm-real/state_machine/state.gd"
            ],
            "Subclass": [
              "inheritance-gd-fsm-real/player/states/motion/motion.gd",
              "inheritance-gd-fsm-real/player/states/motion/on_ground/on_ground.gd",
              "inheritance-gd-fsm-real/player/states/motion/on_ground/idle.gd",
              "inheritance-gd-fsm-real/player/states/motion/on_ground/move.gd"
            ],
            "Override": [
              "inheritance-gd-fsm-real/player/states/motion/on_ground/idle.gd#update",
              "inheritance-gd-fsm-real/player/states/motion/on_ground/move.gd#enter",
              "inheritance-gd-fsm-real/player/states/motion/on_ground/move.gd#handle_input",
              "inheritance-gd-fsm-real/player/states/motion/on_ground/on_ground.gd#handle_input"
            ],
            "Client": [
              "inheritance-gd-fsm-real/state_machine/state_machine.gd#_physics_process",
              "inheritance-gd-fsm-real/state_machine/state_machine.gd#_change_state"
            ]
          },
          "trace": [
            {
              "at": "inheritance-gd-fsm-real/state_machine/state_machine.gd#_physics_process",
              "say": "Every physics frame the machine calls update() on the current state. It only relies on the methods State defines."
            },
            {
              "at": "inheritance-gd-fsm-real/player/states/motion/on_ground/idle.gd#update",
              "say": "Idle overrides update(). It calls get_input_direction(), which it never wrote: it inherits it from Motion."
            },
            {
              "at": "inheritance-gd-fsm-real/player/states/motion/motion.gd#get_input_direction",
              "say": "Motion, the middle class, holds the input helpers every moving state shares. Written once, used by Idle, Move and Jump."
            },
            {
              "at": "inheritance-gd-fsm-real/state_machine/state_machine.gd#_change_state",
              "say": "Idle emitted finished('move'). The machine calls exit() and enter(); the base State gives harmless defaults for both."
            },
            {
              "at": "inheritance-gd-fsm-real/player/states/motion/on_ground/move.gd#enter",
              "say": "Move overrides enter() to reset speed and velocity, fields it inherited from OnGround."
            },
            {
              "at": "inheritance-gd-fsm-real/player/states/motion/on_ground/move.gd#handle_input",
              "say": "Move passes input up with super.handle_input(event): extend, do not replace."
            },
            {
              "at": "inheritance-gd-fsm-real/player/states/motion/on_ground/on_ground.gd#handle_input",
              "say": "OnGround adds jumping, then calls super again so Motion can handle the damage key. Each level adds one rule."
            },
            {
              "at": "inheritance-gd-fsm-real/player/states/motion/motion.gd#handle_input",
              "say": "The chain ends in Motion. One key press visited three classes, each owning a single responsibility."
            }
          ],
          "files": {
            "inheritance-gd-fsm-real/player/states/motion/motion.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/player/states/motion/motion.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"res://state_machine/state.gd\"\n# Collection of important methods to handle direction and animation.\n\nfunc handle_input(event):\n\tif event.is_action_pressed(\"simulate_damage\"):\n\t\tfinished.emit(\"stagger\")\n\n\nfunc get_input_direction():\n\tvar input_direction = Vector2(\n\t\t\tInput.get_axis(&\"move_left\", &\"move_right\"),\n\t\t\tInput.get_axis(&\"move_up\", &\"move_down\")\n\t)\n\treturn input_direction\n\n\nfunc update_look_direction(direction):\n\tif direction and owner.look_direction != direction:\n\t\towner.look_direction = direction\n",
            "inheritance-gd-fsm-real/player/states/motion/on_ground/idle.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/player/states/motion/on_ground/idle.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"on_ground.gd\"\n\nfunc enter():\n\towner.get_node(^\"AnimationPlayer\").play(\"idle\")\n\n\nfunc handle_input(event):\n\treturn super.handle_input(event)\n\n\nfunc update(_delta):\n\tvar input_direction = get_input_direction()\n\tif input_direction:\n\t\tfinished.emit(\"move\")\n",
            "inheritance-gd-fsm-real/player/states/motion/on_ground/move.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/player/states/motion/on_ground/move.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"on_ground.gd\"\n\n@export var max_walk_speed: float = 450\n@export var max_run_speed: float = 700\n\nfunc enter():\n\tspeed = 0.0\n\tvelocity = Vector2()\n\n\tvar input_direction = get_input_direction()\n\tupdate_look_direction(input_direction)\n\towner.get_node(^\"AnimationPlayer\").play(\"walk\")\n\n\nfunc handle_input(event):\n\treturn super.handle_input(event)\n\n\nfunc update(_delta):\n\tvar input_direction = get_input_direction()\n\tif input_direction.is_zero_approx():\n\t\tfinished.emit(\"idle\")\n\tupdate_look_direction(input_direction)\n\n\tif Input.is_action_pressed(\"run\"):\n\t\tspeed = max_run_speed\n\telse:\n\t\tspeed = max_walk_speed\n\n\tvar collision_info = move(speed, input_direction)\n\tif not collision_info:\n\t\treturn\n\tif speed == max_run_speed and collision_info.collider.is_in_group(\"environment\"):\n\t\treturn null\n\n\nfunc move(speed, direction):\n\towner.velocity = direction.normalized() * speed\n\towner.move_and_slide()\n\tif owner.get_slide_collision_count() == 0:\n\t\treturn\n\treturn owner.get_slide_collision(0)\n",
            "inheritance-gd-fsm-real/player/states/motion/on_ground/on_ground.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/player/states/motion/on_ground/on_ground.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends \"../motion.gd\"\n\n# warning-ignore-all:unused_class_variable\nvar speed = 0.0\nvar velocity = Vector2()\n\nfunc handle_input(event):\n\tif event.is_action_pressed(\"jump\"):\n\t\tfinished.emit(\"jump\")\n\treturn super.handle_input(event)\n",
            "inheritance-gd-fsm-real/state_machine/state.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/state_machine/state.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Node\n# Base interface for all states: it doesn't do anything by itself,\n# but forces us to pass the right arguments to the methods below\n# and makes sure every State object had all of these methods.\n\n# warning-ignore:unused_signal\nsignal finished(next_state_name)\n\n# Initialize the state. E.g. change the animation.\nfunc enter():\n\tpass\n\n\n# Clean up the state. Reinitialize values like a timer.\nfunc exit():\n\tpass\n\n\nfunc handle_input(_event):\n\tpass\n\n\nfunc update(_delta):\n\tpass\n\n\nfunc _on_animation_finished(_anim_name):\n\tpass\n",
            "inheritance-gd-fsm-real/state_machine/state_machine.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/2d/finite_state_machine/state_machine/state_machine.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Node\n# Base interface for a generic state machine.\n# It handles initializing, setting the machine active or not\n# delegating _physics_process, _input calls to the State nodes,\n# and changing the current/active state.\n# See the PlayerV2 scene for an example on how to use it.\n\nsignal state_changed(current_state)\n\n# You should set a starting node from the inspector or on the node that inherits\n# from this state machine interface. If you don't, the game will default to\n# the first state in the state machine's children.\n@export var start_state: NodePath\nvar states_map = {}\n\nvar states_stack = []\nvar current_state = null\nvar _active = false:\n\tset(value):\n\t\t_active = value\n\t\tset_active(value)\n\nfunc _enter_tree():\n\tif start_state.is_empty():\n\t\tstart_state = get_child(0).get_path()\n\tfor child in get_children():\n\t\tvar err = child.finished.connect(_change_state)\n\t\tif err:\n\t\t\tprinterr(err)\n\tinitialize(start_state)\n\n\nfunc initialize(initial_state):\n\t_active = true\n\tstates_stack.push_front(get_node(initial_state))\n\tcurrent_state = states_stack[0]\n\tcurrent_state.enter()\n\n\nfunc set_active(value):\n\tset_physics_process(value)\n\tset_process_input(value)\n\tif not _active:\n\t\tstates_stack = []\n\t\tcurrent_state = null\n\n\nfunc _unhandled_input(event):\n\tcurrent_state.handle_input(event)\n\n\nfunc _physics_process(delta):\n\tcurrent_state.update(delta)\n\n\nfunc _on_animation_finished(anim_name):\n\tif not _active:\n\t\treturn\n\tcurrent_state._on_animation_finished(anim_name)\n\n\nfunc _change_state(state_name):\n\tif not _active:\n\t\treturn\n\tcurrent_state.exit()\n\n\tif state_name == \"previous\":\n\t\tstates_stack.pop_front()\n\telse:\n\t\tstates_stack[0] = states_map[state_name]\n\n\tcurrent_state = states_stack[0]\n\tstate_changed.emit(current_state)\n\n\tif state_name != \"previous\":\n\t\tcurrent_state.enter()\n"
          }
        }
      ]
    },
    {
      "id": "polymorphism",
      "name": "Polymorphism",
      "family": "OOP Basics",
      "aka": [
        "Dynamic dispatch",
        "Subtype polymorphism",
        "Duck typing"
      ],
      "tagline": "One call works on many types; each object answers it in its own way.",
      "intent": "Write code against a shared method name (Price, interact, Less) instead of checking which concrete type you have. At run time each object supplies its own version, so one call site handles every type, and adding a new type means adding a class, not editing a chain of if/else.",
      "analogy": "A 'Start' button at a car rental desk: whether you are handed a petrol car, an electric car or a hybrid, you press Start and each car does whatever starting means for it.",
      "cityShape": "Look for one call-site floor whose call pipes fan out to floors with the same name at the same height in several sibling buildings (Price in Book, Groceries and Subscription; interact in Door, Chest and Npc). The calling building has no pipes to the siblings' other floors.",
      "roles": [
        {
          "name": "Common Interface",
          "desc": "The shared method names every type promises to answer (an interface, a base class, or an agreed set of methods)."
        },
        {
          "name": "Concrete Type",
          "desc": "A type with its own implementation of the shared methods."
        },
        {
          "name": "Polymorphic Call Site",
          "desc": "The one place that calls the shared method without knowing or checking the concrete type."
        },
        {
          "name": "Client",
          "desc": "Code that creates the concrete objects and hands them to the call site."
        }
      ],
      "whenToUse": [
        "You find yourself writing if/switch on a type field ('if item.kind == \"book\"') in several places.",
        "New variants are added often (new enemy, new payment type, new file format).",
        "A generic algorithm (sorting, rendering, saving) should work on types written later by other people."
      ],
      "pitfalls": [
        "Checking the type anyway ('if item is Book') inside the call site throws away the benefit; move that logic into the type.",
        "Forcing unrelated things under one interface makes methods that half the types cannot honour (throwing 'not supported').",
        "It can be harder to find which code runs for a call: the answer depends on the object at run time, so name and document the contract well."
      ],
      "related": [
        "inheritance",
        "abstraction",
        "strategy",
        "state",
        "visitor"
      ],
      "quiz": [
        {
          "q": "Checkout.Total() calls item.Price() on every item. You add a GiftCard class. What else must change?",
          "options": [
            "Total() needs a new if branch for GiftCard",
            "Nothing else, if GiftCard implements ICartItem",
            "ICartItem needs a GiftCard method",
            "Every other item class must be recompiled with a new switch"
          ],
          "answer": 1,
          "why": "The call site depends only on the shared method. A new type plugs in by implementing it; existing code stays closed to change."
        },
        {
          "q": "Go's sort.Sort sorts players, strings and ints with one function. How?",
          "options": [
            "It uses reflection to inspect every field",
            "Each type supplies Len, Less and Swap, and Sort only calls those",
            "It converts everything to strings first",
            "There is a separate Sort function generated for each type"
          ],
          "answer": 1,
          "why": "sort.Interface is the common contract. The algorithm calls Less and Swap, and each type answers in its own way."
        }
      ],
      "demos": [
        {
          "id": "polymorphism-cs-cart",
          "title": "Shopping cart prices",
          "lang": "C#",
          "level": "beginner",
          "source": null,
          "story": "A book, groceries sold by weight and a yearly subscription all price themselves differently. Checkout.Total() has one loop and one call, item.Price(), with no type checks.",
          "roles": {
            "Common Interface": [
              "polymorphism-cs-cart/ICartItem.cs#ICartItem"
            ],
            "Concrete Type": [
              "polymorphism-cs-cart/Items.cs#Book",
              "polymorphism-cs-cart/Items.cs#Groceries",
              "polymorphism-cs-cart/Items.cs#Subscription"
            ],
            "Polymorphic Call Site": [
              "polymorphism-cs-cart/Checkout.cs#Checkout.Total"
            ],
            "Client": [
              "polymorphism-cs-cart/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "polymorphism-cs-cart/Program.cs#Program.Main",
              "say": "Main fills the cart with three different kinds of item. Checkout receives them all as ICartItem."
            },
            {
              "at": "polymorphism-cs-cart/Checkout.cs#Checkout.Total",
              "say": "The one call site: loop, call Price(), add. No 'if book', no switch on a type field."
            },
            {
              "at": "polymorphism-cs-cart/Items.cs#Book.Price",
              "say": "For the book, Price() just returns the cover price."
            },
            {
              "at": "polymorphism-cs-cart/Items.cs#Groceries.Price",
              "say": "Same call, different answer: groceries multiply price per kilo by weight."
            },
            {
              "at": "polymorphism-cs-cart/Items.cs#Subscription.Price",
              "say": "The subscription applies a 20% yearly discount. Each type owns its own pricing rule."
            }
          ],
          "files": {
            "polymorphism-cs-cart/Checkout.cs": "// The single call site. It does not contain one 'if item is Book'. Adding a new item type\n// means writing a new class; this file never changes.\npublic class Checkout\n{\n    private readonly List<ICartItem> items = new List<ICartItem>();\n\n    public void Add(ICartItem item)\n    {\n        items.Add(item);\n    }\n\n    public decimal Total()\n    {\n        decimal sum = 0;\n        foreach (ICartItem item in items)\n        {\n            decimal price = item.Price();\n            Console.WriteLine($\"{item.Name,-20} {price,8:0.00}\");\n            sum += price;\n        }\n        return sum;\n    }\n}\n",
            "polymorphism-cs-cart/ICartItem.cs": "// One shape that every item in the cart takes. Checkout only ever talks to this.\npublic interface ICartItem\n{\n    string Name { get; }\n    decimal Price();\n}\n",
            "polymorphism-cs-cart/Items.cs": "// Four very different ways to work out a price, all behind the same Price() method.\npublic class Book : ICartItem\n{\n    public string Name { get; }\n    private readonly decimal coverPrice;\n\n    public Book(string name, decimal coverPrice)\n    {\n        Name = name;\n        this.coverPrice = coverPrice;\n    }\n\n    public decimal Price()\n    {\n        return coverPrice;\n    }\n}\n\npublic class Groceries : ICartItem\n{\n    public string Name { get; }\n    private readonly decimal pricePerKg;\n    private readonly decimal kg;\n\n    public Groceries(string name, decimal pricePerKg, decimal kg)\n    {\n        Name = name;\n        this.pricePerKg = pricePerKg;\n        this.kg = kg;\n    }\n\n    public decimal Price()\n    {\n        return Math.Round(pricePerKg * kg, 2);\n    }\n}\n\npublic class Subscription : ICartItem\n{\n    public string Name { get; }\n    private readonly decimal monthly;\n    private readonly int months;\n\n    public Subscription(string name, decimal monthly, int months)\n    {\n        Name = name;\n        this.monthly = monthly;\n        this.months = months;\n    }\n\n    public decimal Price()\n    {\n        decimal total = monthly * months;\n        return months >= 12 ? total * 0.8m : total;\n    }\n}\n",
            "polymorphism-cs-cart/Program.cs": "public static class Program\n{\n    public static void Main()\n    {\n        var checkout = new Checkout();\n        checkout.Add(new Book(\"Clean Code\", 32.50m));\n        checkout.Add(new Groceries(\"Apples\", 2.40m, 1.5m));\n        checkout.Add(new Subscription(\"Music, 12 months\", 9.99m, 12));\n        Console.WriteLine($\"Total: {checkout.Total():0.00}\");\n    }\n}\n"
          }
        },
        {
          "id": "polymorphism-gd-interact",
          "title": "Press E to interact (Godot)",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Doors, chests and NPCs all extend Interactable and override get_prompt() and interact(). The player has one line that calls interact() on whatever is in reach.",
          "roles": {
            "Common Interface": [
              "polymorphism-gd-interact/interactable.gd#Interactable"
            ],
            "Concrete Type": [
              "polymorphism-gd-interact/door.gd#Door",
              "polymorphism-gd-interact/chest.gd#Chest",
              "polymorphism-gd-interact/npc.gd#Npc"
            ],
            "Polymorphic Call Site": [
              "polymorphism-gd-interact/player.gd#_process"
            ],
            "Client": [
              "polymorphism-gd-interact/player.gd#_nearest_interactable"
            ]
          },
          "trace": [
            {
              "at": "polymorphism-gd-interact/player.gd#_process",
              "say": "Every frame the player looks for something in reach, shows its prompt and, on E, calls interact(self)."
            },
            {
              "at": "polymorphism-gd-interact/player.gd#_nearest_interactable",
              "say": "The only type check is 'is Interactable', the shared contract. The player never asks for Door or Chest."
            },
            {
              "at": "polymorphism-gd-interact/door.gd#get_prompt",
              "say": "Standing at a door, the prompt reads 'Open door'. The HUD line is polymorphic too."
            },
            {
              "at": "polymorphism-gd-interact/door.gd#interact",
              "say": "The door's interact() toggles and plays an animation."
            },
            {
              "at": "polymorphism-gd-interact/chest.gd#interact",
              "say": "At a chest the same line gives loot once, calling back into the player."
            },
            {
              "at": "polymorphism-gd-interact/player.gd#receive_item",
              "say": "The chest decided to give an item; the player just receives it."
            },
            {
              "at": "polymorphism-gd-interact/npc.gd#interact",
              "say": "An NPC cycles dialogue lines. A new lever or shop would be one more script; player.gd would not change."
            }
          ],
          "files": {
            "polymorphism-gd-interact/chest.gd": "class_name Chest\nextends Interactable\n\n@export var loot := \"gold_coin\"\nvar looted := false\n\nfunc get_prompt() -> String:\n\treturn \"Empty\" if looted else \"Open chest\"\n\nfunc interact(player: Node2D) -> void:\n\tif looted:\n\t\treturn\n\tlooted = true\n\tplayer.receive_item(loot)\n",
            "polymorphism-gd-interact/door.gd": "class_name Door\nextends Interactable\n\nvar is_open := false\n\nfunc get_prompt() -> String:\n\treturn \"Close door\" if is_open else \"Open door\"\n\nfunc interact(_player: Node2D) -> void:\n\tis_open = not is_open\n\t$AnimationPlayer.play(\"open\" if is_open else \"close\")\n",
            "polymorphism-gd-interact/interactable.gd": "class_name Interactable\nextends Area2D\n\n# The common face of everything the player can use. Subclasses override these two methods.\nfunc get_prompt() -> String:\n\treturn \"Use\"\n\nfunc interact(_player: Node2D) -> void:\n\tpass\n",
            "polymorphism-gd-interact/npc.gd": "class_name Npc\nextends Interactable\n\n@export var lines: Array[String] = [\"Hello, traveller.\", \"The bridge is out to the east.\"]\nvar _next_line := 0\n\nfunc get_prompt() -> String:\n\treturn \"Talk\"\n\nfunc interact(_player: Node2D) -> void:\n\tprint(lines[_next_line])\n\t_next_line = (_next_line + 1) % lines.size()\n",
            "polymorphism-gd-interact/player.gd": "class_name Player\nextends CharacterBody2D\n\n@onready var reach: Area2D = $Reach\n@onready var prompt_label: Label = $HUD/Prompt\nvar items: Array[String] = []\n\nfunc _process(_delta: float) -> void:\n\tvar target := _nearest_interactable()\n\tprompt_label.text = target.get_prompt() if target else \"\"\n\tif target and Input.is_action_just_pressed(\"interact\"):\n\t\ttarget.interact(self)\n\n# One call site for doors, chests and NPCs: the player never asks \"what are you?\".\nfunc _nearest_interactable() -> Interactable:\n\tfor area in reach.get_overlapping_areas():\n\t\tif area is Interactable:\n\t\t\treturn area\n\treturn null\n\nfunc receive_item(item: String) -> void:\n\titems.append(item)\n"
          }
        },
        {
          "id": "polymorphism-go-sort-real",
          "title": "Go's sort.Interface",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "golang/go",
            "url": "https://github.com/golang/go/blob/go1.22.0/src/sort/sort.go",
            "license": "BSD-3-Clause",
            "note": "sort/sort.go and sort/zsortinterface.go are excerpts from Go go1.22.0 (cuts marked); leaderboard.go was written for Software City."
          },
          "story": "Go's standard sort algorithm never knows what it sorts. It only calls Len, Less and Swap, so players, strings and ints, even reversed ints, all flow through the same code.",
          "roles": {
            "Common Interface": [
              "polymorphism-go-sort-real/sort/sort.go#Interface"
            ],
            "Concrete Type": [
              "polymorphism-go-sort-real/leaderboard.go#ByScore.Less",
              "polymorphism-go-sort-real/leaderboard.go#ByScore.Swap",
              "polymorphism-go-sort-real/sort/sort.go#StringSlice.Less",
              "polymorphism-go-sort-real/sort/sort.go#IntSlice.Less",
              "polymorphism-go-sort-real/sort/sort.go#reverse.Less"
            ],
            "Polymorphic Call Site": [
              "polymorphism-go-sort-real/sort/sort.go#Sort",
              "polymorphism-go-sort-real/sort/zsortinterface.go#insertionSort",
              "polymorphism-go-sort-real/sort/zsortinterface.go#pdqsort"
            ],
            "Client": [
              "polymorphism-go-sort-real/leaderboard.go#main"
            ]
          },
          "trace": [
            {
              "at": "polymorphism-go-sort-real/leaderboard.go#main",
              "say": "main() sorts players, names and levels with the same sort.Sort call. Three types, one function."
            },
            {
              "at": "polymorphism-go-sort-real/sort/sort.go#Sort",
              "say": "Sort asks data.Len() and hands off to pdqsort. data is typed as Interface, nothing more specific."
            },
            {
              "at": "polymorphism-go-sort-real/sort/zsortinterface.go#pdqsort",
              "say": "A serious sorting algorithm, and still every comparison is data.Less and every move is data.Swap."
            },
            {
              "at": "polymorphism-go-sort-real/sort/zsortinterface.go#insertionSort",
              "say": "Short slices use insertion sort: Less to compare neighbours, Swap to move them. It works on any type that answers those calls."
            },
            {
              "at": "polymorphism-go-sort-real/leaderboard.go#ByScore.Less",
              "say": "For players, Less compares scores descending. This is our type's answer to the shared question."
            },
            {
              "at": "polymorphism-go-sort-real/sort/sort.go#Reverse",
              "say": "Reverse wraps any Interface in a new type whose Less flips the arguments. Polymorphism stacked on polymorphism."
            }
          ],
          "files": {
            "polymorphism-go-sort-real/leaderboard.go": "// Example usage written for Software City (not part of Go).\n// Three unrelated types go through the very same sort.Sort call.\npackage main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\ntype Player struct {\n\tName  string\n\tScore int\n}\n\n// ByScore teaches sort how to handle our own type: three small methods, nothing else.\ntype ByScore []Player\n\nfunc (s ByScore) Len() int {\n\treturn len(s)\n}\n\nfunc (s ByScore) Less(i, j int) bool {\n\treturn s[i].Score > s[j].Score\n}\n\nfunc (s ByScore) Swap(i, j int) {\n\ts[i], s[j] = s[j], s[i]\n}\n\nfunc main() {\n\tplayers := ByScore{{\"ana\", 120}, {\"ben\", 340}, {\"cleo\", 75}}\n\tsort.Sort(players)\n\tfmt.Println(\"leaderboard:\", players)\n\n\tnames := sort.StringSlice{\"zoe\", \"adam\", \"mia\"}\n\tsort.Sort(names)\n\tfmt.Println(\"names:\", names)\n\n\tlevels := sort.IntSlice{3, 1, 2}\n\tsort.Sort(sort.Reverse(levels))\n\tfmt.Println(\"levels, highest first:\", levels)\n}\n",
            "polymorphism-go-sort-real/sort/sort.go": "// Source: Go go1.22.0 — https://github.com/golang/go/blob/go1.22.0/src/sort/sort.go\n// BSD-3-Clause, Copyright (c) 2009 The Go Authors. Included for study.\n// Copyright 2009 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\n//go:generate go run gen_sort_variants.go\n\n// Package sort provides primitives for sorting slices and user-defined collections.\npackage sort\n\nimport \"math/bits\"\n\n// An implementation of Interface can be sorted by the routines in this package.\n// The methods refer to elements of the underlying collection by integer index.\ntype Interface interface {\n\t// Len is the number of elements in the collection.\n\tLen() int\n\n\t// Less reports whether the element with index i\n\t// must sort before the element with index j.\n\t//\n\t// If both Less(i, j) and Less(j, i) are false,\n\t// then the elements at index i and j are considered equal.\n\t// Sort may place equal elements in any order in the final result,\n\t// while Stable preserves the original input order of equal elements.\n\t//\n\t// Less must describe a transitive ordering:\n\t//  - if both Less(i, j) and Less(j, k) are true, then Less(i, k) must be true as well.\n\t//  - if both Less(i, j) and Less(j, k) are false, then Less(i, k) must be false as well.\n\t//\n\t// Note that floating-point comparison (the < operator on float32 or float64 values)\n\t// is not a transitive ordering when not-a-number (NaN) values are involved.\n\t// See Float64Slice.Less for a correct implementation for floating-point values.\n\tLess(i, j int) bool\n\n\t// Swap swaps the elements with indexes i and j.\n\tSwap(i, j int)\n}\n\n// Sort sorts data in ascending order as determined by the Less method.\n// It makes one call to data.Len to determine n and O(n*log(n)) calls to\n// data.Less and data.Swap. The sort is not guaranteed to be stable.\n//\n// Note: in many situations, the newer [slices.SortFunc] function is more\n// ergonomic and runs faster.\nfunc Sort(data Interface) {\n\tn := data.Len()\n\tif n <= 1 {\n\t\treturn\n\t}\n\tlimit := bits.Len(uint(n))\n\tpdqsort(data, 0, n, limit)\n}\n\ntype sortedHint int // hint for pdqsort when choosing the pivot\n\nconst (\n\tunknownHint sortedHint = iota\n\tincreasingHint\n\tdecreasingHint\n)\n\n// xorshift paper: https://www.jstatsoft.org/article/view/v008i14/xorshift.pdf\ntype xorshift uint64\n\nfunc (r *xorshift) Next() uint64 {\n\t*r ^= *r << 13\n\t*r ^= *r >> 17\n\t*r ^= *r << 5\n\treturn uint64(*r)\n}\n\nfunc nextPowerOfTwo(length int) uint {\n\tshift := uint(bits.Len(uint(length)))\n\treturn uint(1 << shift)\n}\n\n// lessSwap is a pair of Less and Swap function for use with the\n// auto-generated func-optimized variant of sort.go in\n// zfuncversion.go.\ntype lessSwap struct {\n\tLess func(i, j int) bool\n\tSwap func(i, j int)\n}\n\ntype reverse struct {\n\t// This embedded Interface permits Reverse to use the methods of\n\t// another Interface implementation.\n\tInterface\n}\n\n// Less returns the opposite of the embedded implementation's Less method.\nfunc (r reverse) Less(i, j int) bool {\n\treturn r.Interface.Less(j, i)\n}\n\n// Reverse returns the reverse order for data.\nfunc Reverse(data Interface) Interface {\n\treturn &reverse{data}\n}\n\n// IsSorted reports whether data is sorted.\n//\n// Note: in many situations, the newer [slices.IsSortedFunc] function is more\n// ergonomic and runs faster.\nfunc IsSorted(data Interface) bool {\n\tn := data.Len()\n\tfor i := n - 1; i > 0; i-- {\n\t\tif data.Less(i, i-1) {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}\n\n// Convenience types for common cases\n\n// IntSlice attaches the methods of Interface to []int, sorting in increasing order.\ntype IntSlice []int\n\nfunc (x IntSlice) Len() int           { return len(x) }\nfunc (x IntSlice) Less(i, j int) bool { return x[i] < x[j] }\nfunc (x IntSlice) Swap(i, j int)      { x[i], x[j] = x[j], x[i] }\n\n// Sort is a convenience method: x.Sort() calls Sort(x).\nfunc (x IntSlice) Sort() { Sort(x) }\n\n// Float64Slice implements Interface for a []float64, sorting in increasing order,\n// with not-a-number (NaN) values ordered before other values.\n// … trimmed: Float64Slice and its NaN handling (21 lines), same shape as IntSlice …\n\n// StringSlice attaches the methods of Interface to []string, sorting in increasing order.\ntype StringSlice []string\n\nfunc (x StringSlice) Len() int           { return len(x) }\nfunc (x StringSlice) Less(i, j int) bool { return x[i] < x[j] }\nfunc (x StringSlice) Swap(i, j int)      { x[i], x[j] = x[j], x[i] }\n\n// Sort is a convenience method: x.Sort() calls Sort(x).\nfunc (x StringSlice) Sort() { Sort(x) }\n\n// … trimmed: slice convenience wrappers and Stable sorting (125 lines) …\n",
            "polymorphism-go-sort-real/sort/zsortinterface.go": "// Source: Go go1.22.0 — https://github.com/golang/go/blob/go1.22.0/src/sort/zsortinterface.go\n// BSD-3-Clause, Copyright (c) 2009 The Go Authors. Included for study.\n// Code generated by gen_sort_variants.go; DO NOT EDIT.\n\n// Copyright 2022 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\npackage sort\n\n// insertionSort sorts data[a:b] using insertion sort.\nfunc insertionSort(data Interface, a, b int) {\n\tfor i := a + 1; i < b; i++ {\n\t\tfor j := i; j > a && data.Less(j, j-1); j-- {\n\t\t\tdata.Swap(j, j-1)\n\t\t}\n\t}\n}\n\n// siftDown implements the heap property on data[lo:hi].\n// first is an offset into the array where the root of the heap lies.\nfunc siftDown(data Interface, lo, hi, first int) {\n\troot := lo\n\tfor {\n\t\tchild := 2*root + 1\n\t\tif child >= hi {\n\t\t\tbreak\n\t\t}\n\t\tif child+1 < hi && data.Less(first+child, first+child+1) {\n\t\t\tchild++\n\t\t}\n\t\tif !data.Less(first+root, first+child) {\n\t\t\treturn\n\t\t}\n\t\tdata.Swap(first+root, first+child)\n\t\troot = child\n\t}\n}\n\nfunc heapSort(data Interface, a, b int) {\n\tfirst := a\n\tlo := 0\n\thi := b - a\n\n\t// Build heap with greatest element at top.\n\tfor i := (hi - 1) / 2; i >= 0; i-- {\n\t\tsiftDown(data, i, hi, first)\n\t}\n\n\t// Pop elements, largest first, into end of data.\n\tfor i := hi - 1; i >= 0; i-- {\n\t\tdata.Swap(first, first+i)\n\t\tsiftDown(data, lo, i, first)\n\t}\n}\n\n// pdqsort sorts data[a:b].\n// The algorithm based on pattern-defeating quicksort(pdqsort), but without the optimizations from BlockQuicksort.\n// pdqsort paper: https://arxiv.org/pdf/2106.05123.pdf\n// C++ implementation: https://github.com/orlp/pdqsort\n// Rust implementation: https://docs.rs/pdqsort/latest/pdqsort/\n// limit is the number of allowed bad (very unbalanced) pivots before falling back to heapsort.\nfunc pdqsort(data Interface, a, b, limit int) {\n\tconst maxInsertion = 12\n\n\tvar (\n\t\twasBalanced    = true // whether the last partitioning was reasonably balanced\n\t\twasPartitioned = true // whether the slice was already partitioned\n\t)\n\n\tfor {\n\t\tlength := b - a\n\n\t\tif length <= maxInsertion {\n\t\t\tinsertionSort(data, a, b)\n\t\t\treturn\n\t\t}\n\n\t\t// Fall back to heapsort if too many bad choices were made.\n\t\tif limit == 0 {\n\t\t\theapSort(data, a, b)\n\t\t\treturn\n\t\t}\n\n\t\t// If the last partitioning was imbalanced, we need to breaking patterns.\n\t\tif !wasBalanced {\n\t\t\tbreakPatterns(data, a, b)\n\t\t\tlimit--\n\t\t}\n\n\t\tpivot, hint := choosePivot(data, a, b)\n\t\tif hint == decreasingHint {\n\t\t\treverseRange(data, a, b)\n\t\t\t// The chosen pivot was pivot-a elements after the start of the array.\n\t\t\t// After reversing it is pivot-a elements before the end of the array.\n\t\t\t// The idea came from Rust's implementation.\n\t\t\tpivot = (b - 1) - (pivot - a)\n\t\t\thint = increasingHint\n\t\t}\n\n\t\t// The slice is likely already sorted.\n\t\tif wasBalanced && wasPartitioned && hint == increasingHint {\n\t\t\tif partialInsertionSort(data, a, b) {\n\t\t\t\treturn\n\t\t\t}\n\t\t}\n\n\t\t// Probably the slice contains many duplicate elements, partition the slice into\n\t\t// elements equal to and elements greater than the pivot.\n\t\tif a > 0 && !data.Less(a-1, pivot) {\n\t\t\tmid := partitionEqual(data, a, b, pivot)\n\t\t\ta = mid\n\t\t\tcontinue\n\t\t}\n\n\t\tmid, alreadyPartitioned := partition(data, a, b, pivot)\n\t\twasPartitioned = alreadyPartitioned\n\n\t\tleftLen, rightLen := mid-a, b-mid\n\t\tbalanceThreshold := length / 8\n\t\tif leftLen < rightLen {\n\t\t\twasBalanced = leftLen >= balanceThreshold\n\t\t\tpdqsort(data, a, mid, limit)\n\t\t\ta = mid + 1\n\t\t} else {\n\t\t\twasBalanced = rightLen >= balanceThreshold\n\t\t\tpdqsort(data, mid+1, b, limit)\n\t\t\tb = mid\n\t\t}\n\t}\n}\n\n// partition does one quicksort partition.\n// Let p = data[pivot]\n// Moves elements in data[a:b] around, so that data[i]<p and data[j]>=p for i<newpivot and j>newpivot.\n// On return, data[newpivot] = p\nfunc partition(data Interface, a, b, pivot int) (newpivot int, alreadyPartitioned bool) {\n\tdata.Swap(a, pivot)\n\ti, j := a+1, b-1 // i and j are inclusive of the elements remaining to be partitioned\n\n\tfor i <= j && data.Less(i, a) {\n\t\ti++\n\t}\n\tfor i <= j && !data.Less(j, a) {\n\t\tj--\n\t}\n\tif i > j {\n\t\tdata.Swap(j, a)\n\t\treturn j, true\n\t}\n\tdata.Swap(i, j)\n\ti++\n\tj--\n\n\tfor {\n\t\tfor i <= j && data.Less(i, a) {\n\t\t\ti++\n\t\t}\n\t\tfor i <= j && !data.Less(j, a) {\n\t\t\tj--\n\t\t}\n\t\tif i > j {\n\t\t\tbreak\n\t\t}\n\t\tdata.Swap(i, j)\n\t\ti++\n\t\tj--\n\t}\n\tdata.Swap(j, a)\n\treturn j, false\n}\n\n// … trimmed: partitionEqual, partialInsertionSort, breakPatterns, choosePivot and the stable-sort helpers (310 lines); they too only touch data through Less and Swap …\n"
          }
        }
      ]
    },
    {
      "id": "composition",
      "name": "Composition over Inheritance",
      "family": "OOP Basics",
      "aka": [
        "Composition",
        "has-a",
        "Delegation",
        "Favor composition over inheritance"
      ],
      "tagline": "Build objects from small swappable parts they hold, instead of from deep subclass trees.",
      "intent": "Instead of creating a subclass for every combination of behaviours, give an object fields that hold parts (a movement, a weapon, a formatter, a list of writers) and let it delegate work to them. Parts can be mixed freely and even replaced at run time, and each part stays small and testable.",
      "analogy": "A camera body with interchangeable lenses: you do not buy a new camera for every lens. The body holds whichever lens you attach, and you can swap it in the middle of a shoot.",
      "cityShape": "Look for an owner building with 'has' links and roof antennas for its part fields, sending call pipes from one floor into floors of small part buildings. In the TypeScript demo, compare it with the inheritance version: a ladder of extends arrows where a floor is copied between buildings.",
      "roles": [
        {
          "name": "Owner",
          "desc": "The object that holds parts in fields and delegates work to them."
        },
        {
          "name": "Part Interface",
          "desc": "The small contract a part must meet, so any part of that kind fits the slot."
        },
        {
          "name": "Concrete Part",
          "desc": "One interchangeable implementation of a part: a Bow, an SmsChannel, a Writer."
        },
        {
          "name": "Client",
          "desc": "Code that picks the parts, assembles the owner and may swap parts later."
        }
      ],
      "whenToUse": [
        "Behaviours vary independently (how it moves AND how it attacks), so subclasses would multiply: 2 x 2 x 2 classes instead of 6 parts.",
        "Behaviour must change while the program runs (pick up a new weapon, switch to urgent alerts).",
        "You want to reuse a piece of behaviour in unrelated classes without a shared base class.",
        "In Godot: child component nodes (HealthComponent, Hitbox) attached to many different scenes."
      ],
      "pitfalls": [
        "More small objects and wiring code: a few very simple classes can be clearer with plain inheritance.",
        "Delegation boilerplate: an owner that just forwards twenty methods to one part may want inheritance (or that part's interface) instead.",
        "Parts that reach back into their owner's internals recreate tight coupling; pass what they need as arguments."
      ],
      "related": [
        "inheritance",
        "strategy",
        "decorator",
        "dependency-injection",
        "ecs"
      ],
      "quiz": [
        {
          "q": "A game has 3 ways to move and 4 weapons. How many classes does each approach need to cover every combination?",
          "options": [
            "Inheritance 7, composition 12",
            "Inheritance 12 (one per combo), composition 7 parts plus one Hero",
            "Both need 12",
            "Both need 7"
          ],
          "answer": 1,
          "why": "Subclassing multiplies (3 x 4 = 12 combinations). Composition adds (3 + 4 = 7 parts) and one owner that holds any pair."
        },
        {
          "q": "What can composition do that a subclass cannot?",
          "options": [
            "Call methods on another object",
            "Change its behaviour at run time by replacing a part",
            "Have fields",
            "Implement an interface"
          ],
          "answer": 1,
          "why": "An object's class is fixed once created. A field that holds a part can be reassigned, as in equip() or setFormatter()."
        }
      ],
      "demos": [
        {
          "id": "composition-ts-heroes",
          "title": "Heroes: subclasses vs parts",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "inheritance-version.ts needs a FlyingArcher class and copies the bow code into it. hero.ts holds a Movement and a Weapon instead, so Robin can swap her bow for a sword and learn to fly mid-game.",
          "roles": {
            "Owner": [
              "composition-ts-heroes/hero.ts#Hero"
            ],
            "Part Interface": [
              "composition-ts-heroes/parts.ts#Movement",
              "composition-ts-heroes/parts.ts#Weapon"
            ],
            "Concrete Part": [
              "composition-ts-heroes/parts.ts#Walk",
              "composition-ts-heroes/parts.ts#Fly",
              "composition-ts-heroes/parts.ts#Bow",
              "composition-ts-heroes/parts.ts#Sword"
            ],
            "Client": [
              "composition-ts-heroes/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "composition-ts-heroes/main.ts#main",
              "say": "main() first builds a FlyingArcher the old way, then Robin from parts."
            },
            {
              "at": "composition-ts-heroes/inheritance-version.ts#FlyingArcher.attack",
              "say": "The old way needs a class per combination, and this one copies Archer's attack because it can only extend one parent."
            },
            {
              "at": "composition-ts-heroes/hero.ts#Hero.act",
              "say": "Robin's act() asks her parts: movement.move() and weapon.attack(). Hero has no attack logic of its own."
            },
            {
              "at": "composition-ts-heroes/parts.ts#Bow.attack",
              "say": "The bow answers. The same Bow could be held by any hero, or a tower, with no shared base class."
            },
            {
              "at": "composition-ts-heroes/hero.ts#Hero.equip",
              "say": "equip() just replaces the field. With subclasses Robin would have to become a different object."
            },
            {
              "at": "composition-ts-heroes/hero.ts#Hero.learnToFly",
              "say": "Movement is swapped too. Two parts, any combination, changeable while the game runs."
            },
            {
              "at": "composition-ts-heroes/parts.ts#Fly.move",
              "say": "The next act() reaches Fly and Sword. Two small classes gave us what FlyingSwordHero would have."
            }
          ],
          "files": {
            "composition-ts-heroes/hero.ts": "import { Movement, Weapon } from './parts';\n\n// The composition way: a Hero HAS a movement and HAS a weapon, and passes the work to them.\nexport class Hero {\n  private movement: Movement;\n  private weapon: Weapon;\n\n  constructor(readonly name: string, movement: Movement, weapon: Weapon) {\n    this.movement = movement;\n    this.weapon = weapon;\n  }\n\n  act(): string {\n    return `${this.name} ${this.movement.move()} and ${this.weapon.attack()}`;\n  }\n\n  // Parts can be replaced while the game runs. A subclass can never change at runtime.\n  equip(weapon: Weapon): void {\n    this.weapon = weapon;\n  }\n\n  learnToFly(movement: Movement): void {\n    this.movement = movement;\n  }\n}\n",
            "composition-ts-heroes/inheritance-version.ts": "// The inheritance way, for comparison. Every new combination needs a new subclass,\n// and FlyingArcher has to copy code because it cannot extend both Archer and FlyingHero.\nexport class OldHero {\n  move(): string {\n    return 'walks';\n  }\n\n  attack(): string {\n    return 'punches';\n  }\n}\n\nexport class Archer extends OldHero {\n  attack(): string {\n    return 'shoots an arrow';\n  }\n}\n\nexport class FlyingHero extends OldHero {\n  move(): string {\n    return 'flies';\n  }\n}\n\nexport class FlyingArcher extends FlyingHero {\n  attack(): string {\n    return 'shoots an arrow'; // duplicated from Archer\n  }\n}\n",
            "composition-ts-heroes/main.ts": "import { Hero } from './hero';\nimport { Walk, Fly, Bow, Sword } from './parts';\nimport { FlyingArcher } from './inheritance-version';\n\nfunction main(): void {\n  // Old way: one class per combination, fixed forever.\n  const old = new FlyingArcher();\n  console.log(`Old hero ${old.move()} and ${old.attack()}`);\n\n  // New way: any combination from the same few parts.\n  const robin = new Hero('Robin', new Walk(), new Bow());\n  console.log(robin.act());\n\n  robin.equip(new Sword());\n  robin.learnToFly(new Fly());\n  console.log(robin.act());\n}\n\nmain();\n",
            "composition-ts-heroes/parts.ts": "// Small, swappable parts. Each does one job and knows nothing about heroes.\nexport interface Movement {\n  move(): string;\n}\n\nexport interface Weapon {\n  attack(): string;\n}\n\nexport class Walk implements Movement {\n  move(): string {\n    return 'walks';\n  }\n}\n\nexport class Fly implements Movement {\n  move(): string {\n    return 'flies';\n  }\n}\n\nexport class Bow implements Weapon {\n  attack(): string {\n    return 'shoots an arrow';\n  }\n}\n\nexport class Sword implements Weapon {\n  attack(): string {\n    return 'swings a sword';\n  }\n}\n"
          }
        },
        {
          "id": "composition-java-notifier",
          "title": "Alert notifier assembled from parts",
          "lang": "Java",
          "level": "intermediate",
          "source": null,
          "story": "An on-call Notifier holds a formatter, a main channel and a fallback channel. Instead of a subclass per combination (UrgentSmsNotifier...), parts are mixed in the constructor and swapped with a setter.",
          "roles": {
            "Owner": [
              "composition-java-notifier/Notifier.java#Notifier"
            ],
            "Part Interface": [
              "composition-java-notifier/Formatting.java#MessageFormatter",
              "composition-java-notifier/Channels.java#Channel"
            ],
            "Concrete Part": [
              "composition-java-notifier/Formatting.java#PlainFormatter",
              "composition-java-notifier/Formatting.java#UrgentFormatter",
              "composition-java-notifier/Channels.java#EmailChannel",
              "composition-java-notifier/Channels.java#SmsChannel"
            ],
            "Client": [
              "composition-java-notifier/App.java#App.main"
            ]
          },
          "trace": [
            {
              "at": "composition-java-notifier/App.java#App.main",
              "say": "The app assembles a notifier: plain text, SMS first, email as fallback. Wiring parts replaces writing a subclass."
            },
            {
              "at": "composition-java-notifier/Notifier.java#Notifier.alert",
              "say": "alert() delegates: format with one part, send with another, fall back to the third if sending fails."
            },
            {
              "at": "composition-java-notifier/Formatting.java#PlainFormatter.format",
              "say": "The formatter only knows about text. It has no idea SMS exists."
            },
            {
              "at": "composition-java-notifier/Channels.java#SmsChannel.send",
              "say": "The SMS channel sends while it has credits. The second alert will find none left and return false."
            },
            {
              "at": "composition-java-notifier/Notifier.java#Notifier.setFormatter",
              "say": "An incident starts: the app swaps in the urgent formatter. Same Notifier object, new behaviour."
            },
            {
              "at": "composition-java-notifier/Formatting.java#UrgentFormatter.format",
              "say": "The next message is shouted in capitals."
            },
            {
              "at": "composition-java-notifier/Channels.java#EmailChannel.send",
              "say": "SMS is out of credits, so the fallback part delivers it. Retry logic came from combining parts, not from a class tree."
            }
          ],
          "files": {
            "composition-java-notifier/App.java": "public class App {\n    public static void main(String[] args) {\n        Notifier oncall = new Notifier(new PlainFormatter(), new SmsChannel(), new EmailChannel());\n        oncall.alert(\"+49 170 000000\", \"Deploy\", \"version 2.3 is live\");\n\n        oncall.setFormatter(new UrgentFormatter());\n        oncall.alert(\"+49 170 000000\", \"Database\", \"disk 95% full\");\n    }\n}\n",
            "composition-java-notifier/Channels.java": "// Part 2: where a message goes.\ninterface Channel {\n    boolean send(String recipient, String text);\n}\n\nclass EmailChannel implements Channel {\n    public boolean send(String recipient, String text) {\n        System.out.println(\"email to \" + recipient + \": \" + text);\n        return true;\n    }\n}\n\nclass SmsChannel implements Channel {\n    private int creditsLeft = 1;\n\n    public boolean send(String recipient, String text) {\n        if (creditsLeft == 0) {\n            return false;\n        }\n        creditsLeft--;\n        System.out.println(\"sms to \" + recipient + \": \" + text);\n        return true;\n    }\n}\n",
            "composition-java-notifier/Formatting.java": "// Part 1: how a message looks. Each formatter is tiny and testable on its own.\ninterface MessageFormatter {\n    String format(String title, String body);\n}\n\nclass PlainFormatter implements MessageFormatter {\n    public String format(String title, String body) {\n        return title + \": \" + body;\n    }\n}\n\nclass UrgentFormatter implements MessageFormatter {\n    public String format(String title, String body) {\n        return \"[URGENT] \" + title.toUpperCase() + \" - \" + body;\n    }\n}\n",
            "composition-java-notifier/Notifier.java": "// The Notifier is assembled from parts instead of inherited from a base class.\n// With inheritance we would need PlainEmailNotifier, UrgentEmailNotifier, PlainSmsNotifier,\n// UrgentSmsNotifier... one class per combination. Here: 2 formatters + 2 channels, any mix.\npublic class Notifier {\n    private MessageFormatter formatter;\n    private Channel channel;\n    private Channel fallback;\n\n    public Notifier(MessageFormatter formatter, Channel channel, Channel fallback) {\n        this.formatter = formatter;\n        this.channel = channel;\n        this.fallback = fallback;\n    }\n\n    public void alert(String recipient, String title, String body) {\n        String text = formatter.format(title, body);\n        if (!channel.send(recipient, text)) {\n            fallback.send(recipient, text);\n        }\n    }\n\n    // Swap a part at runtime, e.g. when an incident is declared.\n    public void setFormatter(MessageFormatter formatter) {\n        this.formatter = formatter;\n    }\n}\n"
          }
        },
        {
          "id": "composition-go-multi-real",
          "title": "Go's io.MultiReader and io.MultiWriter",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "golang/go",
            "url": "https://github.com/golang/go/blob/go1.22.0/src/io/multi.go",
            "license": "BSD-3-Clause",
            "note": "io/multi.go is the complete file from Go go1.22.0; io/io.go is an excerpt of src/io/io.go (cuts marked); backup.go was written for Software City."
          },
          "story": "Go has no class inheritance at all. Its standard library builds a tee writer and a concatenating reader by holding slices of other Readers and Writers and delegating to each one.",
          "roles": {
            "Owner": [
              "composition-go-multi-real/io/multi.go#multiWriter",
              "composition-go-multi-real/io/multi.go#multiReader"
            ],
            "Part Interface": [
              "composition-go-multi-real/io/io.go#Reader",
              "composition-go-multi-real/io/io.go#Writer"
            ],
            "Concrete Part": [
              "composition-go-multi-real/backup.go#shouter"
            ],
            "Client": [
              "composition-go-multi-real/backup.go#main"
            ]
          },
          "trace": [
            {
              "at": "composition-go-multi-real/backup.go#main",
              "say": "main() glues two readers into one source and a buffer plus a custom shouter into one target, then copies."
            },
            {
              "at": "composition-go-multi-real/io/multi.go#MultiWriter",
              "say": "MultiWriter just stores the writers in a slice (flattening nested ones). The new object is made of parts, not derived from them."
            },
            {
              "at": "composition-go-multi-real/io/io.go#copyBuffer",
              "say": "Copy sees that the source can write itself out (WriterTo) and lets it, otherwise it loops Read then Write."
            },
            {
              "at": "composition-go-multi-real/io/multi.go#multiReader.writeToWithBuffer",
              "say": "The multiReader walks its own parts in order, copying each reader into the destination."
            },
            {
              "at": "composition-go-multi-real/io/multi.go#multiWriter.Write",
              "say": "Each chunk reaches multiWriter.Write, which delegates the same bytes to every writer it holds."
            },
            {
              "at": "composition-go-multi-real/backup.go#shouter.Write",
              "say": "Our own part, written in five lines, slots in next to bytes.Buffer because it meets the Writer contract."
            },
            {
              "at": "composition-go-multi-real/io/multi.go#multiReader.Read",
              "say": "Plain Read works the same way: read from the first part until EOF, then drop it and move to the next."
            }
          ],
          "files": {
            "composition-go-multi-real/backup.go": "// Example usage written for Software City (not part of Go).\n// A backup job built by combining small readers and writers instead of subclassing a \"BackupFile\" type.\npackage main\n\nimport (\n\t\"bytes\"\n\t\"io\"\n\t\"os\"\n\t\"strings\"\n)\n\n// shouter is our own tiny Writer. It plugs into MultiWriter like any standard one.\ntype shouter struct {\n\tout io.Writer\n}\n\nfunc (s shouter) Write(p []byte) (int, error) {\n\t_, err := s.out.Write(bytes.ToUpper(p))\n\treturn len(p), err\n}\n\nfunc main() {\n\theader := strings.NewReader(\"# backup v1\\n\")\n\tbody := strings.NewReader(\"users: 3\\norders: 42\\n\")\n\tsource := io.MultiReader(header, body)\n\n\tvar archive bytes.Buffer\n\tlog := shouter{out: os.Stdout}\n\ttarget := io.MultiWriter(&archive, log)\n\n\tio.Copy(target, source)\n\tos.WriteFile(\"backup.txt\", archive.Bytes(), 0o644)\n}\n",
            "composition-go-multi-real/io/io.go": "// Source: Go go1.22.0 — https://github.com/golang/go/blob/go1.22.0/src/io/io.go\n// BSD-3-Clause, Copyright (c) 2009 The Go Authors. Included for study.\n// Copyright 2009 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\n// Package io provides basic interfaces to I/O primitives.\n// Its primary job is to wrap existing implementations of such primitives,\n// such as those in package os, into shared public interfaces that\n// abstract the functionality, plus some other related primitives.\n//\n// Because these interfaces and primitives wrap lower-level operations with\n// various implementations, unless otherwise informed clients should not\n// assume they are safe for parallel execution.\npackage io\n\nimport (\n\t\"errors\"\n\t\"sync\"\n)\n// … trimmed: Seek constants (6 lines) …\n\n// ErrShortWrite means that a write accepted fewer bytes than requested\n// but failed to return an explicit error.\nvar ErrShortWrite = errors.New(\"short write\")\n\n// errInvalidWrite means that a write returned an impossible count.\nvar errInvalidWrite = errors.New(\"invalid write result\")\n\n// ErrShortBuffer means that a read required a longer buffer than was provided.\nvar ErrShortBuffer = errors.New(\"short buffer\")\n\n// EOF is the error returned by Read when no more input is available.\n// (Read must return EOF itself, not an error wrapping EOF,\n// because callers will test for EOF using ==.)\n// Functions should return EOF only to signal a graceful end of input.\n// If the EOF occurs unexpectedly in a structured data stream,\n// the appropriate error is either [ErrUnexpectedEOF] or some other error\n// giving more detail.\nvar EOF = errors.New(\"EOF\")\n// … trimmed: three more error values (8 lines) …\n\n// Reader is the interface that wraps the basic Read method.\n//\n// Read reads up to len(p) bytes into p. It returns the number of bytes\n// read (0 <= n <= len(p)) and any error encountered. Even if Read\n// returns n < len(p), it may use all of p as scratch space during the call.\n// If some data is available but not len(p) bytes, Read conventionally\n// returns what is available instead of waiting for more.\n//\n// When Read encounters an error or end-of-file condition after\n// successfully reading n > 0 bytes, it returns the number of\n// bytes read. It may return the (non-nil) error from the same call\n// or return the error (and n == 0) from a subsequent call.\n// An instance of this general case is that a Reader returning\n// a non-zero number of bytes at the end of the input stream may\n// return either err == EOF or err == nil. The next Read should\n// return 0, EOF.\n//\n// Callers should always process the n > 0 bytes returned before\n// considering the error err. Doing so correctly handles I/O errors\n// that happen after reading some bytes and also both of the\n// allowed EOF behaviors.\n//\n// If len(p) == 0, Read should always return n == 0. It may return a\n// non-nil error if some error condition is known, such as EOF.\n//\n// Implementations of Read are discouraged from returning a\n// zero byte count with a nil error, except when len(p) == 0.\n// Callers should treat a return of 0 and nil as indicating that\n// nothing happened; in particular it does not indicate EOF.\n//\n// Implementations must not retain p.\ntype Reader interface {\n\tRead(p []byte) (n int, err error)\n}\n\n// Writer is the interface that wraps the basic Write method.\n//\n// Write writes len(p) bytes from p to the underlying data stream.\n// It returns the number of bytes written from p (0 <= n <= len(p))\n// and any error encountered that caused the write to stop early.\n// Write must return a non-nil error if it returns n < len(p).\n// Write must not modify the slice data, even temporarily.\n//\n// Implementations must not retain p.\ntype Writer interface {\n\tWrite(p []byte) (n int, err error)\n}\n\n// … trimmed: Closer, Seeker, the combined interfaces, ReaderFrom, WriterTo, StringWriter and friends, ReadAtLeast/ReadFull (270 lines) …\n\n// Copy copies from src to dst until either EOF is reached\n// on src or an error occurs. It returns the number of bytes\n// copied and the first error encountered while copying, if any.\n//\n// A successful Copy returns err == nil, not err == EOF.\n// Because Copy is defined to read from src until EOF, it does\n// not treat an EOF from Read as an error to be reported.\n//\n// If src implements [WriterTo],\n// the copy is implemented by calling src.WriteTo(dst).\n// Otherwise, if dst implements [ReaderFrom],\n// the copy is implemented by calling dst.ReadFrom(src).\nfunc Copy(dst Writer, src Reader) (written int64, err error) {\n\treturn copyBuffer(dst, src, nil)\n}\n\n// … trimmed: CopyBuffer, a thin wrapper (12 lines) …\n\n}\n\n// copyBuffer is the actual implementation of Copy and CopyBuffer.\n// if buf is nil, one is allocated.\nfunc copyBuffer(dst Writer, src Reader, buf []byte) (written int64, err error) {\n\t// If the reader has a WriteTo method, use it to do the copy.\n\t// Avoids an allocation and a copy.\n\tif wt, ok := src.(WriterTo); ok {\n\t\treturn wt.WriteTo(dst)\n\t}\n\t// Similarly, if the writer has a ReadFrom method, use it to do the copy.\n\tif rt, ok := dst.(ReaderFrom); ok {\n\t\treturn rt.ReadFrom(src)\n\t}\n\tif buf == nil {\n\t\tsize := 32 * 1024\n\t\tif l, ok := src.(*LimitedReader); ok && int64(size) > l.N {\n\t\t\tif l.N < 1 {\n\t\t\t\tsize = 1\n\t\t\t} else {\n\t\t\t\tsize = int(l.N)\n\t\t\t}\n\t\t}\n\t\tbuf = make([]byte, size)\n\t}\n\tfor {\n\t\tnr, er := src.Read(buf)\n\t\tif nr > 0 {\n\t\t\tnw, ew := dst.Write(buf[0:nr])\n\t\t\tif nw < 0 || nr < nw {\n\t\t\t\tnw = 0\n\t\t\t\tif ew == nil {\n\t\t\t\t\tew = errInvalidWrite\n\t\t\t\t}\n\t\t\t}\n\t\t\twritten += int64(nw)\n\t\t\tif ew != nil {\n\t\t\t\terr = ew\n\t\t\t\tbreak\n\t\t\t}\n\t\t\tif nr != nw {\n\t\t\t\terr = ErrShortWrite\n\t\t\t\tbreak\n\t\t\t}\n\t\t}\n\t\tif er != nil {\n\t\t\tif er != EOF {\n\t\t\t\terr = er\n\t\t\t}\n\t\t\tbreak\n\t\t}\n\t}\n\treturn written, err\n}\n\n// … trimmed: LimitReader, SectionReader, TeeReader, Discard and the rest of the file (330 lines) …\n",
            "composition-go-multi-real/io/multi.go": "// Source: Go go1.22.0 — https://github.com/golang/go/blob/go1.22.0/src/io/multi.go\n// BSD-3-Clause, Copyright (c) 2009 The Go Authors. Included for study (verbatim, complete file).\n// Copyright 2010 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\npackage io\n\ntype eofReader struct{}\n\nfunc (eofReader) Read([]byte) (int, error) {\n\treturn 0, EOF\n}\n\ntype multiReader struct {\n\treaders []Reader\n}\n\nfunc (mr *multiReader) Read(p []byte) (n int, err error) {\n\tfor len(mr.readers) > 0 {\n\t\t// Optimization to flatten nested multiReaders (Issue 13558).\n\t\tif len(mr.readers) == 1 {\n\t\t\tif r, ok := mr.readers[0].(*multiReader); ok {\n\t\t\t\tmr.readers = r.readers\n\t\t\t\tcontinue\n\t\t\t}\n\t\t}\n\t\tn, err = mr.readers[0].Read(p)\n\t\tif err == EOF {\n\t\t\t// Use eofReader instead of nil to avoid nil panic\n\t\t\t// after performing flatten (Issue 18232).\n\t\t\tmr.readers[0] = eofReader{} // permit earlier GC\n\t\t\tmr.readers = mr.readers[1:]\n\t\t}\n\t\tif n > 0 || err != EOF {\n\t\t\tif err == EOF && len(mr.readers) > 0 {\n\t\t\t\t// Don't return EOF yet. More readers remain.\n\t\t\t\terr = nil\n\t\t\t}\n\t\t\treturn\n\t\t}\n\t}\n\treturn 0, EOF\n}\n\nfunc (mr *multiReader) WriteTo(w Writer) (sum int64, err error) {\n\treturn mr.writeToWithBuffer(w, make([]byte, 1024*32))\n}\n\nfunc (mr *multiReader) writeToWithBuffer(w Writer, buf []byte) (sum int64, err error) {\n\tfor i, r := range mr.readers {\n\t\tvar n int64\n\t\tif subMr, ok := r.(*multiReader); ok { // reuse buffer with nested multiReaders\n\t\t\tn, err = subMr.writeToWithBuffer(w, buf)\n\t\t} else {\n\t\t\tn, err = copyBuffer(w, r, buf)\n\t\t}\n\t\tsum += n\n\t\tif err != nil {\n\t\t\tmr.readers = mr.readers[i:] // permit resume / retry after error\n\t\t\treturn sum, err\n\t\t}\n\t\tmr.readers[i] = nil // permit early GC\n\t}\n\tmr.readers = nil\n\treturn sum, nil\n}\n\nvar _ WriterTo = (*multiReader)(nil)\n\n// MultiReader returns a Reader that's the logical concatenation of\n// the provided input readers. They're read sequentially. Once all\n// inputs have returned EOF, Read will return EOF.  If any of the readers\n// return a non-nil, non-EOF error, Read will return that error.\nfunc MultiReader(readers ...Reader) Reader {\n\tr := make([]Reader, len(readers))\n\tcopy(r, readers)\n\treturn &multiReader{r}\n}\n\ntype multiWriter struct {\n\twriters []Writer\n}\n\nfunc (t *multiWriter) Write(p []byte) (n int, err error) {\n\tfor _, w := range t.writers {\n\t\tn, err = w.Write(p)\n\t\tif err != nil {\n\t\t\treturn\n\t\t}\n\t\tif n != len(p) {\n\t\t\terr = ErrShortWrite\n\t\t\treturn\n\t\t}\n\t}\n\treturn len(p), nil\n}\n\nvar _ StringWriter = (*multiWriter)(nil)\n\nfunc (t *multiWriter) WriteString(s string) (n int, err error) {\n\tvar p []byte // lazily initialized if/when needed\n\tfor _, w := range t.writers {\n\t\tif sw, ok := w.(StringWriter); ok {\n\t\t\tn, err = sw.WriteString(s)\n\t\t} else {\n\t\t\tif p == nil {\n\t\t\t\tp = []byte(s)\n\t\t\t}\n\t\t\tn, err = w.Write(p)\n\t\t}\n\t\tif err != nil {\n\t\t\treturn\n\t\t}\n\t\tif n != len(s) {\n\t\t\terr = ErrShortWrite\n\t\t\treturn\n\t\t}\n\t}\n\treturn len(s), nil\n}\n\n// MultiWriter creates a writer that duplicates its writes to all the\n// provided writers, similar to the Unix tee(1) command.\n//\n// Each write is written to each listed writer, one at a time.\n// If a listed writer returns an error, that overall write operation\n// stops and returns the error; it does not continue down the list.\nfunc MultiWriter(writers ...Writer) Writer {\n\tallWriters := make([]Writer, 0, len(writers))\n\tfor _, w := range writers {\n\t\tif mw, ok := w.(*multiWriter); ok {\n\t\t\tallWriters = append(allWriters, mw.writers...)\n\t\t} else {\n\t\t\tallWriters = append(allWriters, w)\n\t\t}\n\t}\n\treturn &multiWriter{allWriters}\n}\n"
          }
        }
      ]
    }
  ]
};
