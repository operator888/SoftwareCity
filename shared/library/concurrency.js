// Family: Concurrency. 6 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Concurrency"
  ],
  "patterns": [
    {
      "id": "async-await",
      "name": "Async / Await",
      "family": "Concurrency",
      "aka": [
        "Promises",
        "Futures",
        "Tasks",
        "Coroutines",
        "Non-blocking I/O"
      ],
      "tagline": "Start slow work, keep going, and pick up the result later without blocking the thread.",
      "intent": "Slow operations (network, disk, timers) return a promise of a value instead of the value itself, so the program is free to do other work while waiting. An async function can pause at each await and is resumed by the event loop when the result is ready; starting several jobs before awaiting them lets their waits overlap.",
      "analogy": "Ordering at a food court: you get a buzzer (the promise) instead of standing at the counter. You can order at three stalls, sit down, and collect each meal when its buzzer goes off.",
      "cityShape": "Look for a row of small async floors (brewCoffee, LoadMapAsync, fetch) that all send call pipes down into one tiny wait/delay floor at the bottom of the city. Above them sit two caller floors side by side: the sequential one calls the jobs one after another, the parallel one fans out to all of them at once and then into Promise.all / WhenAll / TaskGroup.",
      "roles": [
        {
          "name": "Async Function",
          "desc": "A function marked async that can pause at await and returns a promise/task of its result."
        },
        {
          "name": "Promise",
          "desc": "A placeholder for a value that will arrive later (Promise, Task, Future). It can be awaited, combined or passed around."
        },
        {
          "name": "Combinator",
          "desc": "Waits for many promises at once: Promise.all, Task.WhenAll, asyncio.gather or a TaskGroup."
        },
        {
          "name": "Event Loop",
          "desc": "The scheduler that parks paused functions and resumes them when their I/O or timer finishes."
        },
        {
          "name": "Caller",
          "desc": "Decides the order: await one by one when steps depend on each other, start everything first when they do not."
        }
      ],
      "whenToUse": [
        "Your code waits on I/O: HTTP calls, database queries, file reads, timers.",
        "Several independent requests can run at the same time (load a page's data, a game level's assets).",
        "A UI or game must stay responsive while something loads in the background.",
        "You want readable top-to-bottom code instead of nested callbacks."
      ],
      "pitfalls": [
        "Awaiting inside a loop runs the jobs one by one; start them first and await them together if they are independent.",
        "Async does not make CPU-heavy work faster: a long calculation still blocks the single event-loop thread.",
        "Forgetting to await (or to handle a rejected promise) loses errors silently or lets code run before the data is ready."
      ],
      "related": [
        "callback-hell",
        "worker-pool",
        "reactive-streams",
        "producer-consumer"
      ],
      "quiz": [
        {
          "q": "Three independent downloads take 3 s, 2 s and 1 s. You write `await a(); await b(); await c();`. How long does it take, and how do you fix it?",
          "options": [
            "3 s; it is already parallel",
            "6 s; start all three first and await them together with Promise.all",
            "1 s; await always runs the fastest first",
            "6 s; and nothing can make it faster"
          ],
          "answer": 1,
          "why": "Each await pauses until that job finishes before the next one even starts. Starting all three first lets their waits overlap, so the total is about the slowest job: 3 s."
        },
        {
          "q": "What does `await` actually do to the thread running your code?",
          "options": [
            "It blocks the thread until the result arrives",
            "It pauses only this function and gives the thread back to the event loop",
            "It creates a new thread for the awaited job",
            "It makes the awaited function run synchronously"
          ],
          "answer": 1,
          "why": "await suspends the current async function and returns control to the event loop, which runs other work and resumes the function when the promise settles."
        }
      ],
      "demos": [
        {
          "id": "async-await-ts-breakfast",
          "title": "Making breakfast, one by one or all at once",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Coffee, toast and eggs each take a few hundred milliseconds. Cooked one by one it takes about 750 ms; started together it takes about 300 ms. Same three functions, only the awaiting changes.",
          "roles": {
            "Async Function": [
              "async-await-ts-breakfast/kitchen.ts#brewCoffee",
              "async-await-ts-breakfast/kitchen.ts#toastBread",
              "async-await-ts-breakfast/kitchen.ts#fryEggs"
            ],
            "Promise": [
              "async-await-ts-breakfast/timer.ts#wait"
            ],
            "Combinator": [
              "async-await-ts-breakfast/breakfast.ts#cookAllAtOnce"
            ],
            "Event Loop": [
              "async-await-ts-breakfast/timer.ts#wait"
            ],
            "Caller": [
              "async-await-ts-breakfast/main.ts#main",
              "async-await-ts-breakfast/breakfast.ts#cookOneByOne"
            ]
          },
          "trace": [
            {
              "at": "async-await-ts-breakfast/main.ts#main",
              "say": "main() times two ways of cooking the same breakfast. It awaits each approach so the timings do not overlap."
            },
            {
              "at": "async-await-ts-breakfast/breakfast.ts#cookOneByOne",
              "say": "Each line awaits before the next starts, so the toaster sits idle while the coffee brews. Total ≈ 750 ms."
            },
            {
              "at": "async-await-ts-breakfast/kitchen.ts#brewCoffee",
              "say": "brewCoffee pauses at await. The thread is not stuck: the event loop is free to run other code meanwhile."
            },
            {
              "at": "async-await-ts-breakfast/timer.ts#wait",
              "say": "wait() wraps setTimeout in a Promise. The event loop calls resolve when the timer fires, which resumes the paused function."
            },
            {
              "at": "async-await-ts-breakfast/breakfast.ts#cookAllAtOnce",
              "say": "Calling all three without await starts them immediately. Promise.all then waits for the slowest: total ≈ 300 ms."
            },
            {
              "at": "async-await-ts-breakfast/kitchen.ts#toastBread",
              "say": "Toast finishes first and pushes onto the shared plate. With parallel jobs the finish order is set by timing, not by code order."
            }
          ],
          "files": {
            "async-await-ts-breakfast/breakfast.ts": "import { brewCoffee, toastBread, fryEggs } from './kitchen';\n\n// In sequence: each await waits for the previous job. Total ≈ 300 + 200 + 250 ms.\nexport async function cookOneByOne(): Promise<string[]> {\n  const coffee = await brewCoffee();\n  const toast = await toastBread();\n  const eggs = await fryEggs();\n  return [coffee, toast, eggs];\n}\n\n// In parallel: start all three first, then await them together. Total ≈ 300 ms (the slowest).\nexport async function cookAllAtOnce(): Promise<string[]> {\n  const jobs = [brewCoffee(), toastBread(), fryEggs()];\n  return Promise.all(jobs);\n}\n",
            "async-await-ts-breakfast/kitchen.ts": "import { wait } from './timer';\n\n// Everything that is ready lands on the plate.\nexport const plate: string[] = [];\n\nexport async function brewCoffee(): Promise<string> {\n  await wait(300);\n  plate.push('coffee');\n  return 'coffee';\n}\n\nexport async function toastBread(): Promise<string> {\n  await wait(200);\n  plate.push('toast');\n  return 'toast';\n}\n\nexport async function fryEggs(): Promise<string> {\n  await wait(250);\n  plate.push('eggs');\n  return 'eggs';\n}\n",
            "async-await-ts-breakfast/main.ts": "import { cookOneByOne, cookAllAtOnce } from './breakfast';\n\nasync function main(): Promise<void> {\n  let start = Date.now();\n  await cookOneByOne();\n  console.log(`One by one: ${Date.now() - start} ms`);\n\n  start = Date.now();\n  const food = await cookAllAtOnce();\n  console.log(`All at once: ${Date.now() - start} ms -> ${food.join(', ')}`);\n}\n\nmain();\n",
            "async-await-ts-breakfast/timer.ts": "// wait() turns a timer into a Promise. setTimeout hands the callback to the event loop,\n// so nothing blocks while we wait; the loop resolves the promise when the time is up.\nexport function wait(ms: number): Promise<void> {\n  return new Promise(resolve => {\n    setTimeout(resolve, ms);\n  });\n}\n"
          }
        },
        {
          "id": "async-await-cs-level-loader",
          "title": "Loading a game level with Task.WhenAll",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "The level needs a map, a texture and music, which do not depend on each other, so they load together. Enemies need the finished map, so that step is awaited afterwards. Notice both kinds of awaiting in one method.",
          "roles": {
            "Async Function": [
              "async-await-cs-level-loader/AssetLoader.cs#AssetLoader.LoadMapAsync",
              "async-await-cs-level-loader/AssetLoader.cs#AssetLoader.LoadTextureAsync",
              "async-await-cs-level-loader/AssetLoader.cs#AssetLoader.LoadSoundAsync",
              "async-await-cs-level-loader/LevelLoader.cs#LevelLoader.SpawnEnemiesAsync"
            ],
            "Promise": [
              "async-await-cs-level-loader/LevelLoader.cs#LevelLoader.LoadLevelAsync"
            ],
            "Combinator": [
              "async-await-cs-level-loader/LevelLoader.cs#LevelLoader.LoadLevelAsync"
            ],
            "Caller": [
              "async-await-cs-level-loader/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "async-await-cs-level-loader/Program.cs#Program.Main",
              "say": "Main is itself async, so it can await the whole level load and measure how long it took."
            },
            {
              "at": "async-await-cs-level-loader/LevelLoader.cs#LevelLoader.LoadLevelAsync",
              "say": "Three loads start without await. Each call returns a running Task right away, so all three wait at the same time."
            },
            {
              "at": "async-await-cs-level-loader/AssetLoader.cs#AssetLoader.LoadMapAsync",
              "say": "LoadMapAsync awaits Task.Delay, standing in for disk I/O. While it waits, no thread is blocked."
            },
            {
              "at": "async-await-cs-level-loader/AssetLoader.cs#AssetLoader.LoadSoundAsync",
              "say": "The sound finishes first even though it started second. Parallel tasks complete in timing order."
            },
            {
              "at": "async-await-cs-level-loader/LoadingScreen.cs#LoadingScreen.StepFinished",
              "say": "Task.WhenAll resumed LoadLevelAsync once all three were done; the loading screen ticks forward."
            },
            {
              "at": "async-await-cs-level-loader/LevelLoader.cs#LevelLoader.SpawnEnemiesAsync",
              "say": "Enemies depend on the map, so this await comes after WhenAll. Sequence where there is a dependency, parallel where there is none."
            }
          ],
          "files": {
            "async-await-cs-level-loader/AssetLoader.cs": "using System;\nusing System.Threading.Tasks;\n\n// Pretend disk/network loads. Task.Delay stands in for I/O: the thread is free while it waits.\npublic class AssetLoader\n{\n    public async Task<string> LoadTextureAsync(string name)\n    {\n        await Task.Delay(400);\n        Console.WriteLine($\"  texture {name} ready\");\n        return name + \".png\";\n    }\n\n    public async Task<string> LoadSoundAsync(string name)\n    {\n        await Task.Delay(300);\n        Console.WriteLine($\"  sound {name} ready\");\n        return name + \".ogg\";\n    }\n\n    public async Task<string> LoadMapAsync(string level)\n    {\n        await Task.Delay(500);\n        Console.WriteLine($\"  map {level} ready\");\n        return level + \".tmx\";\n    }\n}\n",
            "async-await-cs-level-loader/LevelLoader.cs": "using System;\nusing System.Threading.Tasks;\n\n// Loads a level: independent assets in parallel, dependent steps in sequence.\npublic class LevelLoader\n{\n    private readonly AssetLoader assets = new AssetLoader();\n    private readonly LoadingScreen screen = new LoadingScreen(2);\n\n    public async Task LoadLevelAsync(string level)\n    {\n        // Start three independent loads at once. Nothing is awaited yet.\n        Task<string> map = assets.LoadMapAsync(level);\n        Task<string> hero = assets.LoadTextureAsync(\"hero\");\n        Task<string> music = assets.LoadSoundAsync(\"theme\");\n\n        await Task.WhenAll(map, hero, music);\n        screen.StepFinished(\"assets\");\n\n        // Enemies need the map, so this step must come after it.\n        int count = await SpawnEnemiesAsync(map.Result);\n        screen.StepFinished($\"{count} enemies\");\n    }\n\n    private async Task<int> SpawnEnemiesAsync(string mapFile)\n    {\n        await Task.Delay(100);\n        Console.WriteLine($\"  placing enemies from {mapFile}\");\n        return 12;\n    }\n}\n",
            "async-await-cs-level-loader/LoadingScreen.cs": "using System;\n\n// Shows progress. Every finished step bumps the counter.\npublic class LoadingScreen\n{\n    private int done;\n    private readonly int total;\n\n    public LoadingScreen(int total)\n    {\n        this.total = total;\n    }\n\n    public void StepFinished(string what)\n    {\n        done++;\n        Console.WriteLine($\"[{done}/{total}] {what}\");\n    }\n}\n",
            "async-await-cs-level-loader/Program.cs": "using System;\nusing System.Diagnostics;\nusing System.Threading.Tasks;\n\npublic class Program\n{\n    public static async Task Main()\n    {\n        var clock = Stopwatch.StartNew();\n        var loader = new LevelLoader();\n        await loader.LoadLevelAsync(\"forest-1\");\n        // ~600 ms instead of ~1300 ms: the three loads overlapped.\n        Console.WriteLine($\"Level loaded in {clock.ElapsedMilliseconds} ms\");\n    }\n}\n"
          }
        },
        {
          "id": "async-await-taskgroup-real",
          "title": "CPython's asyncio.TaskGroup",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.9/Lib/asyncio/taskgroups.py",
            "license": "PSF-2.0",
            "note": "asyncio/taskgroups.py is from CPython 3.12.9, verbatim apart from three marked trims (a __repr__ and two long comments); usage.py was written for Software City."
          },
          "story": "Real standard-library code for 'structured concurrency': tasks created inside an async with block must all finish before the block exits, and if one fails the group cancels its siblings. Compare in_sequence with in_parallel in usage.py.",
          "roles": {
            "Async Function": [
              "async-await-taskgroup-real/usage.py#fetch"
            ],
            "Promise": [
              "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup.create_task"
            ],
            "Combinator": [
              "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup"
            ],
            "Event Loop": [
              "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup.__aenter__"
            ],
            "Caller": [
              "async-await-taskgroup-real/usage.py#main",
              "async-await-taskgroup-real/usage.py#in_sequence",
              "async-await-taskgroup-real/usage.py#in_parallel"
            ]
          },
          "trace": [
            {
              "at": "async-await-taskgroup-real/usage.py#in_sequence",
              "say": "Three awaits in a row: 0.3 + 0.2 + 0.1 s. Each fetch starts only after the previous one returned."
            },
            {
              "at": "async-await-taskgroup-real/usage.py#in_parallel",
              "say": "Same three fetches inside a TaskGroup. They all start at once, so the block takes about 0.3 s."
            },
            {
              "at": "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup.__aenter__",
              "say": "Entering the block grabs the running event loop and remembers the parent task, so the group can cancel it if a child fails."
            },
            {
              "at": "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup.create_task",
              "say": "create_task schedules the coroutine on the loop right away and records it in _tasks with a done-callback."
            },
            {
              "at": "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup._aexit",
              "say": "Leaving the block awaits a future until _tasks is empty. This is the 'wait for all of them' moment, like Promise.all."
            },
            {
              "at": "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup._on_task_done",
              "say": "Each finished task removes itself. A failed one records its error and, if nobody is aborting yet, starts the abort."
            },
            {
              "at": "async-await-taskgroup-real/asyncio/taskgroups.py#TaskGroup._abort",
              "say": "_abort cancels every unfinished sibling, which is why one_fails() does not wait the full second for the slow task."
            },
            {
              "at": "async-await-taskgroup-real/usage.py#one_fails",
              "say": "The errors come back as an ExceptionGroup, caught with except*. No task is left running in the background."
            }
          ],
          "files": {
            "async-await-taskgroup-real/asyncio/taskgroups.py": "# Source: CPython 3.12.9 — https://github.com/python/cpython/blob/v3.12.9/Lib/asyncio/taskgroups.py\n# PSF License (Python Software Foundation License Version 2), Copyright (c) 2001-2023 Python Software Foundation; All Rights Reserved. Included for study.\n\n# Adapted with permission from the EdgeDB project;\n# license: PSFL.\n\n\n__all__ = (\"TaskGroup\",)\n\nfrom . import events\nfrom . import exceptions\nfrom . import tasks\n\n\nclass TaskGroup:\n    \"\"\"Asynchronous context manager for managing groups of tasks.\n\n    Example use:\n\n        async with asyncio.TaskGroup() as group:\n            task1 = group.create_task(some_coroutine(...))\n            task2 = group.create_task(other_coroutine(...))\n        print(\"Both tasks have completed now.\")\n\n    All tasks are awaited when the context manager exits.\n\n    Any exceptions other than `asyncio.CancelledError` raised within\n    a task will cancel all remaining tasks and wait for them to exit.\n    The exceptions are then combined and raised as an `ExceptionGroup`.\n    \"\"\"\n    def __init__(self):\n        self._entered = False\n        self._exiting = False\n        self._aborting = False\n        self._loop = None\n        self._parent_task = None\n        self._parent_cancel_requested = False\n        self._tasks = set()\n        self._errors = []\n        self._base_error = None\n        self._on_completed_fut = None\n\n    # … trimmed: 13 lines of __repr__ (debug text, not related to the pattern) …\n\n    async def __aenter__(self):\n        if self._entered:\n            raise RuntimeError(\n                f\"TaskGroup {self!r} has already been entered\")\n        if self._loop is None:\n            self._loop = events.get_running_loop()\n        self._parent_task = tasks.current_task(self._loop)\n        if self._parent_task is None:\n            raise RuntimeError(\n                f'TaskGroup {self!r} cannot determine the parent task')\n        self._entered = True\n\n        return self\n\n    async def __aexit__(self, et, exc, tb):\n        tb = None\n        try:\n            return await self._aexit(et, exc)\n        finally:\n            # Exceptions are heavy objects that can have object\n            # cycles (bad for GC); let's not keep a reference to\n            # a bunch of them. It would be nicer to use a try/finally\n            # in __aexit__ directly but that introduced some diff noise\n            self._parent_task = None\n            self._errors = None\n            self._base_error = None\n            exc = None\n\n    async def _aexit(self, et, exc):\n        self._exiting = True\n\n        if (exc is not None and\n                self._is_base_error(exc) and\n                self._base_error is None):\n            self._base_error = exc\n\n        propagate_cancellation_error = \\\n            exc if et is exceptions.CancelledError else None\n        if self._parent_cancel_requested:\n            # If this flag is set we *must* call uncancel().\n            if self._parent_task.uncancel() == 0:\n                # If there are no pending cancellations left,\n                # don't propagate CancelledError.\n                propagate_cancellation_error = None\n\n        if et is not None:\n            if not self._aborting:\n                # … trimmed: 12 lines of comments with examples of a cancelled parent task …\n                self._abort()\n\n        # We use while-loop here because \"self._on_completed_fut\"\n        # can be cancelled multiple times if our parent task\n        # is being cancelled repeatedly (or even once, when\n        # our own cancellation is already in progress)\n        while self._tasks:\n            if self._on_completed_fut is None:\n                self._on_completed_fut = self._loop.create_future()\n\n            try:\n                await self._on_completed_fut\n            except exceptions.CancelledError as ex:\n                if not self._aborting:\n                    # Our parent task is being cancelled:\n                    #\n                    #    async def wrapper():\n                    #        async with TaskGroup() as g:\n                    #            g.create_task(foo)\n                    #\n                    # \"wrapper\" is being cancelled while \"foo\" is\n                    # still running.\n                    propagate_cancellation_error = ex\n                    self._abort()\n\n            self._on_completed_fut = None\n\n        assert not self._tasks\n\n        if self._base_error is not None:\n            try:\n                raise self._base_error\n            finally:\n                exc = None\n\n        # Propagate CancelledError if there is one, except if there\n        # are other errors -- those have priority.\n        try:\n            if propagate_cancellation_error and not self._errors:\n                try:\n                    raise propagate_cancellation_error\n                finally:\n                    exc = None\n        finally:\n            propagate_cancellation_error = None\n\n        if et is not None and et is not exceptions.CancelledError:\n            self._errors.append(exc)\n\n        if self._errors:\n            try:\n                raise BaseExceptionGroup(\n                    'unhandled errors in a TaskGroup',\n                    self._errors,\n                ) from None\n            finally:\n                exc = None\n\n\n    def create_task(self, coro, *, name=None, context=None):\n        \"\"\"Create a new task in this group and return it.\n\n        Similar to `asyncio.create_task`.\n        \"\"\"\n        if not self._entered:\n            raise RuntimeError(f\"TaskGroup {self!r} has not been entered\")\n        if self._exiting and not self._tasks:\n            raise RuntimeError(f\"TaskGroup {self!r} is finished\")\n        if self._aborting:\n            raise RuntimeError(f\"TaskGroup {self!r} is shutting down\")\n        if context is None:\n            task = self._loop.create_task(coro)\n        else:\n            task = self._loop.create_task(coro, context=context)\n        tasks._set_task_name(task, name)\n\n        # Always schedule the done callback even if the task is\n        # already done (e.g. if the coro was able to complete eagerly),\n        # otherwise if the task completes with an exception then it will cancel\n        # the current task too early. gh-128550, gh-128588\n\n        self._tasks.add(task)\n        task.add_done_callback(self._on_task_done)\n        try:\n            return task\n        finally:\n            # gh-128552: prevent a refcycle of\n            # task.exception().__traceback__->TaskGroup.create_task->task\n            del task\n\n    # Since Python 3.8 Tasks propagate all exceptions correctly,\n    # except for KeyboardInterrupt and SystemExit which are\n    # still considered special.\n\n    def _is_base_error(self, exc: BaseException) -> bool:\n        assert isinstance(exc, BaseException)\n        return isinstance(exc, (SystemExit, KeyboardInterrupt))\n\n    def _abort(self):\n        self._aborting = True\n\n        for t in self._tasks:\n            if not t.done():\n                t.cancel()\n\n    def _on_task_done(self, task):\n        self._tasks.discard(task)\n\n        if self._on_completed_fut is not None and not self._tasks:\n            if not self._on_completed_fut.done():\n                self._on_completed_fut.set_result(True)\n\n        if task.cancelled():\n            return\n\n        exc = task.exception()\n        if exc is None:\n            return\n\n        self._errors.append(exc)\n        if self._is_base_error(exc) and self._base_error is None:\n            self._base_error = exc\n\n        if self._parent_task.done():\n            # Not sure if this case is possible, but we want to handle\n            # it anyways.\n            self._loop.call_exception_handler({\n                'message': f'Task {task!r} has errored out but its parent '\n                           f'task {self._parent_task} is already completed',\n                'exception': exc,\n                'task': task,\n            })\n            return\n\n        if not self._aborting and not self._parent_cancel_requested:\n            # If parent task *is not* being cancelled, it means that we want\n            # … trimmed: 17 lines of comments explaining why the parent task is cancelled here …\n            self._abort()\n            self._parent_cancel_requested = True\n            self._parent_task.cancel()\n",
            "async-await-taskgroup-real/usage.py": "# Example usage written for Software City (not part of CPython).\n# Fetches three \"pages\" in sequence, then in parallel with a TaskGroup,\n# then shows what happens when one task in the group fails.\nimport asyncio\nimport time\n\nfrom asyncio.taskgroups import TaskGroup\n\n\nasync def fetch(name, seconds, fail=False):\n    await asyncio.sleep(seconds)\n    if fail:\n        raise ConnectionError(f\"{name} timed out\")\n    return f\"<{name}>\"\n\n\nasync def in_sequence():\n    a = await fetch(\"home\", 0.3)\n    b = await fetch(\"news\", 0.2)\n    c = await fetch(\"shop\", 0.1)\n    return [a, b, c]\n\n\nasync def in_parallel():\n    async with TaskGroup() as group:\n        a = group.create_task(fetch(\"home\", 0.3))\n        b = group.create_task(fetch(\"news\", 0.2))\n        c = group.create_task(fetch(\"shop\", 0.1))\n    # Leaving the \"async with\" block waited for all three.\n    return [a.result(), b.result(), c.result()]\n\n\nasync def one_fails():\n    try:\n        async with TaskGroup() as group:\n            group.create_task(fetch(\"slow\", 1.0))\n            group.create_task(fetch(\"broken\", 0.1, fail=True))\n    except* ConnectionError as errors:\n        print(\"group cancelled the slow task; error:\", errors.exceptions[0])\n\n\nasync def main():\n    start = time.perf_counter()\n    await in_sequence()\n    print(f\"sequence: {time.perf_counter() - start:.1f}s\")\n    start = time.perf_counter()\n    await in_parallel()\n    print(f\"parallel: {time.perf_counter() - start:.1f}s\")\n    await one_fails()\n\n\nasyncio.run(main())\n"
          }
        }
      ]
    },
    {
      "id": "producer-consumer",
      "name": "Producer–Consumer",
      "family": "Concurrency",
      "aka": [
        "Bounded buffer",
        "Work queue",
        "Back-pressure"
      ],
      "tagline": "Producers drop work into a shared queue; consumers take it out at their own pace.",
      "intent": "Decouple the code that creates work from the code that handles it by putting a queue between them, so each side can run at its own speed. A bounded queue adds back-pressure: when consumers fall behind, producers are made to wait instead of piling up unlimited work in memory.",
      "analogy": "A bakery counter with room for three loaves: the baker keeps baking until the counter is full, then waits; customers take loaves when there are some, and wait when it is empty.",
      "cityShape": "Find the queue in the middle: a building (or roof antenna) that the producer's floor pipes into with put() and the consumer's floor pipes out of with get(). Producer and consumer buildings never call each other directly; every pipe between them goes through the queue.",
      "roles": [
        {
          "name": "Producer",
          "desc": "Creates items of work and puts them into the queue. Waits when the queue is full."
        },
        {
          "name": "Bounded Buffer",
          "desc": "The thread-safe queue with a maximum size. It is the only thing producers and consumers share."
        },
        {
          "name": "Consumer",
          "desc": "Takes items out of the queue and processes them. Waits (or skips) when the queue is empty."
        },
        {
          "name": "Coordinator",
          "desc": "Creates the queue, starts both sides and decides how the work ends (a sentinel value, join, or stop flag)."
        }
      ],
      "whenToUse": [
        "Work arrives faster or more unevenly than it can be handled (uploads, log lines, print jobs).",
        "Slow work must move off a thread that has to stay responsive, such as a game's main thread.",
        "You want to add more consumers later to raise throughput without touching the producer.",
        "Memory must stay bounded even when a downstream step is slow: back-pressure instead of an ever-growing list."
      ],
      "pitfalls": [
        "An unbounded queue hides a slow consumer until memory runs out; give it a maximum size.",
        "Shutdown is the hard part: consumers need a sentinel, a closed flag or join() to know when to stop, and a producer blocked on a full queue must be woken.",
        "Never block a UI or game main thread on get(); use a non-blocking take and handle 'nothing yet'."
      ],
      "related": [
        "worker-pool",
        "actor-model",
        "pipes-and-filters",
        "event-queue",
        "async-await"
      ],
      "quiz": [
        {
          "q": "The queue has maxsize 3 and is full. What happens when the producer calls put()?",
          "options": [
            "The oldest item is thrown away",
            "put() waits until a consumer takes an item",
            "The queue grows to 4",
            "An exception is always raised"
          ],
          "answer": 1,
          "why": "That waiting is back-pressure: the fast side is slowed down to the speed of the slow side, so memory stays bounded. (put_nowait() is the variant that raises instead.)"
        },
        {
          "q": "Why does the Godot demo use try_take() on the main thread instead of a blocking take?",
          "options": [
            "Blocking calls do not exist in GDScript",
            "If the main thread waits for a chunk, the whole game freezes for that time",
            "try_take() is faster for the CPU",
            "Semaphores only work on the main thread"
          ],
          "answer": 1,
          "why": "The main thread draws every frame. It may only take what is ready right now; the worker thread is the one allowed to wait."
        }
      ],
      "demos": [
        {
          "id": "producer-consumer-py-bakery",
          "title": "Bakery counter with a 3-loaf limit",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A fast baker and a slow customer run in two threads and share one queue.Queue(maxsize=3). Watch the baker pause when the counter is full, and the None sentinel tell the customer the shop is closed.",
          "roles": {
            "Producer": [
              "producer-consumer-py-bakery/baker.py#bake"
            ],
            "Bounded Buffer": [
              "producer-consumer-py-bakery/counter.py#counter",
              "producer-consumer-py-bakery/counter.py#put_loaf",
              "producer-consumer-py-bakery/counter.py#take_loaf"
            ],
            "Consumer": [
              "producer-consumer-py-bakery/customer.py#buy_bread"
            ],
            "Coordinator": [
              "producer-consumer-py-bakery/main.py#open_shop",
              "producer-consumer-py-bakery/counter.py#CLOSED"
            ]
          },
          "trace": [
            {
              "at": "producer-consumer-py-bakery/main.py#open_shop",
              "say": "open_shop() starts the baker and the customer as two threads. They never call each other; they only share the counter."
            },
            {
              "at": "producer-consumer-py-bakery/baker.py#bake",
              "say": "The baker bakes a loaf every 0.1 s and hands it to put_loaf(). It never talks to the customer directly."
            },
            {
              "at": "producer-consumer-py-bakery/counter.py#put_loaf",
              "say": "put_loaf() calls counter.put(). After three loaves the counter is full, so put() blocks the baker's thread right here."
            },
            {
              "at": "producer-consumer-py-bakery/counter.py#take_loaf",
              "say": "The customer takes one loaf every 0.3 s. Each get() frees a slot, which wakes the waiting baker."
            },
            {
              "at": "producer-consumer-py-bakery/baker.py#bake",
              "say": "Back-pressure in action: the fast baker is slowed to the customer's pace instead of stacking 8 loaves in memory."
            },
            {
              "at": "producer-consumer-py-bakery/customer.py#buy_bread",
              "say": "After the last loaf the baker puts CLOSED (None). The customer sees it, leaves the loop, and both threads can be joined."
            }
          ],
          "files": {
            "producer-consumer-py-bakery/baker.py": "import time\n\nfrom .counter import put_loaf, loaves_waiting, CLOSED\n\n\ndef bake(loaves):\n    for n in range(1, loaves + 1):\n        time.sleep(0.1)  # baking is fast...\n        waiting = loaves_waiting()\n        print(f\"baker: loaf {n} ready, counter has {waiting}\")\n        put_loaf(f\"loaf {n}\")  # ...but waits here when the counter is full\n    put_loaf(CLOSED)\n",
            "producer-consumer-py-bakery/counter.py": "import queue\n\n# The shop counter only has room for 3 loaves. This is the bounded buffer.\ncounter = queue.Queue(maxsize=3)\n\n# A special value that means \"no more bread today\".\nCLOSED = None\n\n\ndef put_loaf(loaf):\n    counter.put(loaf)  # blocks while the counter is full\n\n\ndef take_loaf():\n    return counter.get()  # blocks while the counter is empty\n\n\ndef loaves_waiting():\n    return counter.qsize()\n",
            "producer-consumer-py-bakery/customer.py": "import time\n\nfrom .counter import take_loaf, CLOSED\n\n\ndef buy_bread():\n    while True:\n        loaf = take_loaf()  # waits here when the counter is empty\n        if loaf is CLOSED:\n            print(\"customer: shop closed, going home\")\n            return\n        time.sleep(0.3)  # paying and chatting is slow\n        print(f\"customer: bought {loaf}\")\n",
            "producer-consumer-py-bakery/main.py": "import threading\n\nfrom .baker import bake\nfrom .customer import buy_bread\n\n\ndef open_shop():\n    baker = threading.Thread(target=bake, args=(8,))\n    customer = threading.Thread(target=buy_bread)\n    baker.start()\n    customer.start()\n    baker.join()\n    customer.join()\n\n\nif __name__ == \"__main__\":\n    open_shop()\n"
          }
        },
        {
          "id": "producer-consumer-gd-chunks",
          "title": "Streaming terrain chunks off the main thread",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A background Thread builds terrain chunks with noise (slow) and puts them into a 4-slot ChunkQueue. The main thread takes at most two per frame. A Semaphore counts free slots, a Mutex guards the array.",
          "roles": {
            "Producer": [
              "producer-consumer-gd-chunks/chunk_generator.gd#_generate_all",
              "producer-consumer-gd-chunks/chunk_generator.gd#_build_chunk"
            ],
            "Bounded Buffer": [
              "producer-consumer-gd-chunks/chunk_queue.gd"
            ],
            "Consumer": [
              "producer-consumer-gd-chunks/world.gd#_process",
              "producer-consumer-gd-chunks/world.gd#_spawn_chunk"
            ],
            "Coordinator": [
              "producer-consumer-gd-chunks/world.gd#_ready",
              "producer-consumer-gd-chunks/world.gd#_exit_tree"
            ]
          },
          "trace": [
            {
              "at": "producer-consumer-gd-chunks/world.gd#_ready",
              "say": "The world creates a queue with 4 slots, hands it to the generator and starts it with 36 chunk coordinates."
            },
            {
              "at": "producer-consumer-gd-chunks/chunk_queue.gd#_init",
              "say": "The semaphore is posted once per slot. Its count is 'how many more chunks fit'."
            },
            {
              "at": "producer-consumer-gd-chunks/chunk_generator.gd#_generate_all",
              "say": "On the worker thread, the generator builds chunks one after another and puts each into the queue."
            },
            {
              "at": "producer-consumer-gd-chunks/chunk_queue.gd#put",
              "say": "put() first waits on the semaphore. With 4 chunks already waiting it sleeps here, so the worker never races far ahead."
            },
            {
              "at": "producer-consumer-gd-chunks/world.gd#_process",
              "say": "Each frame the main thread takes at most two chunks. Spreading the work avoids a frame-time spike."
            },
            {
              "at": "producer-consumer-gd-chunks/chunk_queue.gd#try_take",
              "say": "try_take() locks the mutex, pops a chunk if there is one, and posts the semaphore to free a slot. It never waits."
            },
            {
              "at": "producer-consumer-gd-chunks/chunk_generator.gd#stop",
              "say": "On exit, stop() clears the flag and wakes a producer that may be stuck in put(), then joins the thread. No hang on quit."
            }
          ],
          "files": {
            "producer-consumer-gd-chunks/chunk_generator.gd": "class_name ChunkGenerator\nextends RefCounted\n## The producer: builds terrain chunks on a background thread.\n\nconst SIZE := 16\n\nvar _queue: ChunkQueue\nvar _thread := Thread.new()\nvar _wanted: Array[Vector2i] = []\nvar _running := false\nvar _noise := FastNoiseLite.new()\n\n\nfunc _init(queue: ChunkQueue) -> void:\n\t_queue = queue\n\n\nfunc start(coords: Array[Vector2i]) -> void:\n\t_wanted = coords\n\t_running = true\n\t_thread.start(_generate_all)\n\n\nfunc _generate_all() -> void:\n\tfor coord in _wanted:\n\t\tif not _running:\n\t\t\treturn\n\t\tvar chunk := _build_chunk(coord)\n\t\t_queue.put(chunk)  # waits here if the main thread falls behind\n\n\n## The slow part: thousands of noise samples. Perfect work for a background thread.\nfunc _build_chunk(coord: Vector2i) -> Dictionary:\n\tvar heights := PackedFloat32Array()\n\tfor z in SIZE:\n\t\tfor x in SIZE:\n\t\t\theights.append(_noise.get_noise_2d(coord.x * SIZE + x, coord.y * SIZE + z) * 8.0)\n\treturn {\"coord\": coord, \"heights\": heights}\n\n\nfunc stop() -> void:\n\t_running = false\n\t_queue.wake_producer()\n\t_thread.wait_to_finish()\n",
            "producer-consumer-gd-chunks/chunk_queue.gd": "class_name ChunkQueue\nextends RefCounted\n## A bounded, thread-safe buffer between the generator thread and the main thread.\n\nvar _items: Array = []\nvar _mutex := Mutex.new()\nvar _free_slots := Semaphore.new()\n\n\nfunc _init(capacity: int) -> void:\n\t# One semaphore count per empty slot. When it hits zero, put() has to wait.\n\tfor i in capacity:\n\t\t_free_slots.post()\n\n\n## Producer side (worker thread). Blocks while the buffer is full: that is the back-pressure.\nfunc put(chunk: Dictionary) -> void:\n\t_free_slots.wait()\n\t_mutex.lock()\n\t_items.append(chunk)\n\t_mutex.unlock()\n\n\n## Consumer side (main thread). Never blocks: the game must keep drawing frames.\nfunc try_take() -> Variant:\n\t_mutex.lock()\n\tif _items.is_empty():\n\t\t_mutex.unlock()\n\t\treturn null\n\tvar chunk: Dictionary = _items.pop_front()\n\t_mutex.unlock()\n\t_free_slots.post()\n\treturn chunk\n\n\n## Lets a producer stuck in put() continue, so it can notice it should stop.\nfunc wake_producer() -> void:\n\t_free_slots.post()\n",
            "producer-consumer-gd-chunks/world.gd": "extends Node3D\n## The consumer: the main thread adds at most a few ready chunks per frame.\n\nconst MAX_PER_FRAME := 2\n\nvar queue: ChunkQueue\nvar generator: ChunkGenerator\nvar spawned := 0\n\n\nfunc _ready() -> void:\n\tqueue = ChunkQueue.new(4)\n\tgenerator = ChunkGenerator.new(queue)\n\tvar coords: Array[Vector2i] = []\n\tfor z in range(-3, 3):\n\t\tfor x in range(-3, 3):\n\t\t\tcoords.append(Vector2i(x, z))\n\tgenerator.start(coords)\n\n\nfunc _process(_delta: float) -> void:\n\tfor i in MAX_PER_FRAME:\n\t\tvar chunk = queue.try_take()\n\t\tif chunk == null:\n\t\t\treturn\n\t\t_spawn_chunk(chunk)\n\n\nfunc _spawn_chunk(chunk: Dictionary) -> void:\n\tvar marker := MeshInstance3D.new()\n\tmarker.mesh = BoxMesh.new()\n\tmarker.position = Vector3(chunk.coord.x * ChunkGenerator.SIZE, chunk.heights[0], chunk.coord.y * ChunkGenerator.SIZE)\n\tadd_child(marker)\n\tspawned += 1\n\n\nfunc _exit_tree() -> void:\n\tgenerator.stop()\n"
          }
        },
        {
          "id": "producer-consumer-asyncio-real",
          "title": "CPython's asyncio.Queue",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.9/Lib/asyncio/queues.py",
            "license": "PSF-2.0",
            "note": "asyncio/queues.py is from CPython 3.12.9, verbatim apart from two marked trims (debug __repr__ helpers and the PriorityQueue/LifoQueue subclasses); usage.py was written for Software City."
          },
          "story": "The real bounded queue from the standard library. There are no locks: waiting producers and consumers park as futures in the _putters and _getters lists, and each put or get wakes exactly one waiter on the other side.",
          "roles": {
            "Producer": [
              "producer-consumer-asyncio-real/usage.py#office_worker"
            ],
            "Bounded Buffer": [
              "producer-consumer-asyncio-real/asyncio/queues.py#Queue"
            ],
            "Consumer": [
              "producer-consumer-asyncio-real/usage.py#printer"
            ],
            "Coordinator": [
              "producer-consumer-asyncio-real/usage.py#main"
            ]
          },
          "trace": [
            {
              "at": "producer-consumer-asyncio-real/usage.py#main",
              "say": "main() makes a Queue(maxsize=2), starts two printer tasks, then lets the office worker submit six jobs."
            },
            {
              "at": "producer-consumer-asyncio-real/asyncio/queues.py#Queue.put",
              "say": "While full(), put() creates a future, appends it to _putters and awaits it. The producer is parked, not spinning."
            },
            {
              "at": "producer-consumer-asyncio-real/asyncio/queues.py#Queue.get",
              "say": "A printer calls get(). If the queue is empty it parks itself in _getters the same way."
            },
            {
              "at": "producer-consumer-asyncio-real/asyncio/queues.py#Queue.get_nowait",
              "say": "Taking an item frees a slot, so get_nowait() wakes the next parked producer via _wakeup_next(_putters)."
            },
            {
              "at": "producer-consumer-asyncio-real/asyncio/queues.py#Queue._wakeup_next",
              "say": "_wakeup_next skips cancelled waiters and resolves the first live future, so exactly one waiting task resumes."
            },
            {
              "at": "producer-consumer-asyncio-real/asyncio/queues.py#Queue.task_done",
              "say": "Each printer reports finished work. When the unfinished count hits zero, the _finished event is set."
            },
            {
              "at": "producer-consumer-asyncio-real/asyncio/queues.py#Queue.join",
              "say": "join() waits on that event, so main() knows every job was printed, not just taken off the queue."
            }
          ],
          "files": {
            "producer-consumer-asyncio-real/asyncio/queues.py": "# Source: CPython 3.12.9 — https://github.com/python/cpython/blob/v3.12.9/Lib/asyncio/queues.py\n# PSF License (Python Software Foundation License Version 2), Copyright (c) 2001-2023 Python Software Foundation; All Rights Reserved. Included for study.\n\n__all__ = ('Queue', 'PriorityQueue', 'LifoQueue', 'QueueFull', 'QueueEmpty')\n\nimport collections\nimport heapq\nfrom types import GenericAlias\n\nfrom . import locks\nfrom . import mixins\n\n\nclass QueueEmpty(Exception):\n    \"\"\"Raised when Queue.get_nowait() is called on an empty Queue.\"\"\"\n    pass\n\n\nclass QueueFull(Exception):\n    \"\"\"Raised when the Queue.put_nowait() method is called on a full Queue.\"\"\"\n    pass\n\n\nclass Queue(mixins._LoopBoundMixin):\n    \"\"\"A queue, useful for coordinating producer and consumer coroutines.\n\n    If maxsize is less than or equal to zero, the queue size is infinite. If it\n    is an integer greater than 0, then \"await put()\" will block when the\n    queue reaches maxsize, until an item is removed by get().\n\n    Unlike the standard library Queue, you can reliably know this Queue's size\n    with qsize(), since your single-threaded asyncio application won't be\n    interrupted between calling qsize() and doing an operation on the Queue.\n    \"\"\"\n\n    def __init__(self, maxsize=0):\n        self._maxsize = maxsize\n\n        # Futures.\n        self._getters = collections.deque()\n        # Futures.\n        self._putters = collections.deque()\n        self._unfinished_tasks = 0\n        self._finished = locks.Event()\n        self._finished.set()\n        self._init(maxsize)\n\n    # These three are overridable in subclasses.\n\n    def _init(self, maxsize):\n        self._queue = collections.deque()\n\n    def _get(self):\n        return self._queue.popleft()\n\n    def _put(self, item):\n        self._queue.append(item)\n\n    # End of the overridable methods.\n\n    def _wakeup_next(self, waiters):\n        # Wake up the next waiter (if any) that isn't cancelled.\n        while waiters:\n            waiter = waiters.popleft()\n            if not waiter.done():\n                waiter.set_result(None)\n                break\n\n    # … trimmed: 25 lines of __repr__, __str__, __class_getitem__ and _format (debug text) …\n\n    def qsize(self):\n        \"\"\"Number of items in the queue.\"\"\"\n        return len(self._queue)\n\n    @property\n    def maxsize(self):\n        \"\"\"Number of items allowed in the queue.\"\"\"\n        return self._maxsize\n\n    def empty(self):\n        \"\"\"Return True if the queue is empty, False otherwise.\"\"\"\n        return not self._queue\n\n    def full(self):\n        \"\"\"Return True if there are maxsize items in the queue.\n\n        Note: if the Queue was initialized with maxsize=0 (the default),\n        then full() is never True.\n        \"\"\"\n        if self._maxsize <= 0:\n            return False\n        else:\n            return self.qsize() >= self._maxsize\n\n    async def put(self, item):\n        \"\"\"Put an item into the queue.\n\n        Put an item into the queue. If the queue is full, wait until a free\n        slot is available before adding item.\n        \"\"\"\n        while self.full():\n            putter = self._get_loop().create_future()\n            self._putters.append(putter)\n            try:\n                await putter\n            except:\n                putter.cancel()  # Just in case putter is not done yet.\n                try:\n                    # Clean self._putters from canceled putters.\n                    self._putters.remove(putter)\n                except ValueError:\n                    # The putter could be removed from self._putters by a\n                    # previous get_nowait call.\n                    pass\n                if not self.full() and not putter.cancelled():\n                    # We were woken up by get_nowait(), but can't take\n                    # the call.  Wake up the next in line.\n                    self._wakeup_next(self._putters)\n                raise\n        return self.put_nowait(item)\n\n    def put_nowait(self, item):\n        \"\"\"Put an item into the queue without blocking.\n\n        If no free slot is immediately available, raise QueueFull.\n        \"\"\"\n        if self.full():\n            raise QueueFull\n        self._put(item)\n        self._unfinished_tasks += 1\n        self._finished.clear()\n        self._wakeup_next(self._getters)\n\n    async def get(self):\n        \"\"\"Remove and return an item from the queue.\n\n        If queue is empty, wait until an item is available.\n        \"\"\"\n        while self.empty():\n            getter = self._get_loop().create_future()\n            self._getters.append(getter)\n            try:\n                await getter\n            except:\n                getter.cancel()  # Just in case getter is not done yet.\n                try:\n                    # Clean self._getters from canceled getters.\n                    self._getters.remove(getter)\n                except ValueError:\n                    # The getter could be removed from self._getters by a\n                    # previous put_nowait call.\n                    pass\n                if not self.empty() and not getter.cancelled():\n                    # We were woken up by put_nowait(), but can't take\n                    # the call.  Wake up the next in line.\n                    self._wakeup_next(self._getters)\n                raise\n        return self.get_nowait()\n\n    def get_nowait(self):\n        \"\"\"Remove and return an item from the queue.\n\n        Return an item if one is immediately available, else raise QueueEmpty.\n        \"\"\"\n        if self.empty():\n            raise QueueEmpty\n        item = self._get()\n        self._wakeup_next(self._putters)\n        return item\n\n    def task_done(self):\n        \"\"\"Indicate that a formerly enqueued task is complete.\n\n        Used by queue consumers. For each get() used to fetch a task,\n        a subsequent call to task_done() tells the queue that the processing\n        on the task is complete.\n\n        If a join() is currently blocking, it will resume when all items have\n        been processed (meaning that a task_done() call was received for every\n        item that had been put() into the queue).\n\n        Raises ValueError if called more times than there were items placed in\n        the queue.\n        \"\"\"\n        if self._unfinished_tasks <= 0:\n            raise ValueError('task_done() called too many times')\n        self._unfinished_tasks -= 1\n        if self._unfinished_tasks == 0:\n            self._finished.set()\n\n    async def join(self):\n        \"\"\"Block until all items in the queue have been gotten and processed.\n\n        The count of unfinished tasks goes up whenever an item is added to the\n        queue. The count goes down whenever a consumer calls task_done() to\n        indicate that the item was retrieved and all work on it is complete.\n        When the count of unfinished tasks drops to zero, join() unblocks.\n        \"\"\"\n        if self._unfinished_tasks > 0:\n            await self._finished.wait()\n\n# … trimmed: 27 lines of PriorityQueue and LifoQueue (subclasses that only override _init/_put/_get) …\n",
            "producer-consumer-asyncio-real/usage.py": "# Example usage written for Software City (not part of CPython).\n# One fast producer, two slow consumers, a queue that holds at most 2 jobs.\nimport asyncio\n\nfrom asyncio.queues import Queue\n\n\nasync def office_worker(queue, pages):\n    for n, count in enumerate(pages, start=1):\n        print(f\"submit job {n} ({count} pages), waiting jobs: {queue.qsize()}\")\n        await queue.put((n, count))  # pauses here while the queue is full: back-pressure\n    print(\"all jobs submitted\")\n\n\nasync def printer(name, queue):\n    while True:\n        n, count = await queue.get()  # pauses here while the queue is empty\n        await asyncio.sleep(count * 0.05)\n        print(f\"{name} printed job {n}\")\n        queue.task_done()\n\n\nasync def main():\n    queue = Queue(maxsize=2)\n    printers = [asyncio.create_task(printer(f\"printer-{i}\", queue)) for i in (1, 2)]\n    await office_worker(queue, [3, 10, 2, 8, 1, 5])\n    await queue.join()  # wait until every job was marked task_done()\n    for p in printers:\n        p.cancel()\n\n\nasyncio.run(main())\n"
          }
        }
      ]
    },
    {
      "id": "worker-pool",
      "name": "Worker Pool",
      "family": "Concurrency",
      "aka": [
        "Thread pool",
        "Goroutine pool",
        "Concurrency limit",
        "Semaphore"
      ],
      "tagline": "A fixed set of workers shares one queue of jobs: parallel, but never too much at once.",
      "intent": "Instead of starting one thread or request per job (which can exhaust memory, sockets or a server's rate limit), keep a small, fixed set of workers that pull jobs from a shared queue. The same idea appears as a semaphore: any number of tasks may exist, but only N may hold a permit and run at the same time.",
      "analogy": "A supermarket with three open tills: however long the queue, only three customers are served at once, and the next in line goes to whichever till frees up first.",
      "cityShape": "Look for one worker floor that receives several parallel call pipes from the pool's start floor (one per worker, or one per task through a limiter), and a single slow floor (makeThumbnail, fetch, checkPrice) that all work funnels into. The limiter's counter (activeCount, permits, the jobs channel) sits in the middle where the pipes cross.",
      "roles": [
        {
          "name": "Task Queue",
          "desc": "The jobs waiting their turn: a channel, a queue, or the callers suspended on a semaphore."
        },
        {
          "name": "Worker",
          "desc": "Takes one job at a time and runs it. Many identical workers run the same loop in parallel."
        },
        {
          "name": "Limiter",
          "desc": "Fixes how many jobs run at once: the number of workers started, or a semaphore with N permits."
        },
        {
          "name": "Results",
          "desc": "Where finished work is collected: a results channel, a list, or the resolved promises."
        },
        {
          "name": "Client",
          "desc": "Submits all the jobs, signals that no more are coming, and waits for every result."
        }
      ],
      "whenToUse": [
        "Many independent jobs (resize 1,000 images, call an API for 500 users) that would overload something if all started at once.",
        "An external service has a rate or connection limit you must respect.",
        "Thread or process creation is expensive, so you want to reuse a few long-lived workers.",
        "CPU-bound work, where more workers than cores only adds switching overhead."
      ],
      "pitfalls": [
        "Pick the size on purpose: about the number of cores for CPU work; higher for I/O, but below the downstream limit.",
        "A job that waits for another job in the same pool can deadlock once every worker is busy waiting.",
        "Forgetting to close the job queue (or to release a permit after an error) leaves workers or callers waiting forever."
      ],
      "related": [
        "producer-consumer",
        "object-pool",
        "async-await",
        "locks-and-races"
      ],
      "quiz": [
        {
          "q": "You need thumbnails for 10,000 photos on an 8-core machine. What is the main reason to use a pool of about 8 workers instead of 10,000 goroutines or threads?",
          "options": [
            "Goroutines cannot run in parallel",
            "CPU work cannot go faster than the cores; extra workers only add memory and switching overhead",
            "Channels can only hold 8 values",
            "Workers must be created in pairs"
          ],
          "answer": 1,
          "why": "With 8 cores at most 8 resize jobs truly run at once. A bounded pool reaches that speed while keeping memory and scheduling overhead small."
        },
        {
          "q": "In the Kotlin demo every episode gets its own coroutine. Why is that still a worker pool?",
          "options": [
            "It is not; coroutines have no limit",
            "The Semaphore(3) only lets three coroutines past withPermit at a time, so three is the concurrency limit",
            "runBlocking makes them run one by one",
            "awaitAll limits the parallelism"
          ],
          "answer": 1,
          "why": "A semaphore with N permits is a pool without long-lived workers: the waiting coroutines are the queue, and the permits are the workers."
        }
      ],
      "demos": [
        {
          "id": "worker-pool-go-thumbnails",
          "title": "Three goroutines making thumbnails",
          "lang": "Go",
          "level": "beginner",
          "source": null,
          "story": "Nine photos go into a jobs channel, three identical worker goroutines pull from it, and results come back on a second channel. A WaitGroup tells us when every worker has finished.",
          "roles": {
            "Task Queue": [
              "worker-pool-go-thumbnails/photo.go#Job"
            ],
            "Worker": [
              "worker-pool-go-thumbnails/worker.go#Pool.worker",
              "worker-pool-go-thumbnails/photo.go#makeThumbnail"
            ],
            "Limiter": [
              "worker-pool-go-thumbnails/worker.go#Pool",
              "worker-pool-go-thumbnails/worker.go#Pool.Start"
            ],
            "Results": [
              "worker-pool-go-thumbnails/photo.go#Result"
            ],
            "Client": [
              "worker-pool-go-thumbnails/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "worker-pool-go-thumbnails/main.go#main",
              "say": "main() makes a jobs channel and a results channel, then starts a Pool of exactly 3 workers."
            },
            {
              "at": "worker-pool-go-thumbnails/worker.go#Pool.Start",
              "say": "Start launches Size = 3 goroutines running the same worker loop. That one number is the whole concurrency limit."
            },
            {
              "at": "worker-pool-go-thumbnails/main.go#main",
              "say": "main() sends 9 jobs and closes the channel. Closing is the signal 'no more work is coming'."
            },
            {
              "at": "worker-pool-go-thumbnails/worker.go#Pool.worker",
              "say": "Each worker ranges over jobs. Whichever is free takes the next photo, so fast workers naturally do more."
            },
            {
              "at": "worker-pool-go-thumbnails/photo.go#makeThumbnail",
              "say": "The slow step. Three run at the same moment, so 9 photos take about 600 ms instead of 1800 ms."
            },
            {
              "at": "worker-pool-go-thumbnails/worker.go#Pool.Start",
              "say": "When jobs is drained every worker calls wg.Done(); the helper goroutine then closes results so main's loop ends."
            }
          ],
          "files": {
            "worker-pool-go-thumbnails/main.go": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tfiles := []string{\"beach.jpg\", \"cat.jpg\", \"cake.jpg\", \"dog.jpg\", \"hill.jpg\", \"boat.jpg\", \"tree.jpg\", \"moon.jpg\", \"car.jpg\"}\n\tjobs := make(chan Job, len(files))\n\tresults := make(chan Result, len(files))\n\n\tstart := time.Now()\n\tpool := &Pool{Size: 3}\n\tpool.Start(jobs, results)\n\n\tfor i, f := range files {\n\t\tjobs <- Job{ID: i + 1, File: f}\n\t}\n\tclose(jobs) // no more work: workers finish their loops and exit\n\n\tfor r := range results {\n\t\tfmt.Printf(\"worker %d made %s\\n\", r.Worker, r.Thumb)\n\t}\n\t// 9 photos x 200 ms with 3 workers = about 600 ms, not 1800 ms.\n\tfmt.Println(\"done in\", time.Since(start).Round(time.Millisecond))\n}\n",
            "worker-pool-go-thumbnails/photo.go": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\n// Job is one photo that needs a thumbnail.\ntype Job struct {\n\tID   int\n\tFile string\n}\n\n// Result is what a worker hands back.\ntype Result struct {\n\tJobID  int\n\tThumb  string\n\tWorker int\n}\n\n// makeThumbnail pretends to resize an image. It is the slow part.\nfunc makeThumbnail(file string) string {\n\ttime.Sleep(200 * time.Millisecond)\n\treturn fmt.Sprintf(\"thumb_%s\", file)\n}\n",
            "worker-pool-go-thumbnails/worker.go": "package main\n\nimport \"sync\"\n\n// Pool is a fixed number of workers. Size is the whole concurrency limit.\ntype Pool struct {\n\tSize int\n\twg   sync.WaitGroup\n}\n\n// Start launches Size workers, then closes results once every worker has returned.\nfunc (p *Pool) Start(jobs <-chan Job, results chan<- Result) {\n\tfor id := 1; id <= p.Size; id++ {\n\t\tp.wg.Add(1)\n\t\tgo p.worker(id, jobs, results)\n\t}\n\tgo func() {\n\t\tp.wg.Wait()\n\t\tclose(results) // lets the reader's range loop end\n\t}()\n}\n\n// worker takes jobs until the jobs channel is closed. Every worker runs this same loop.\nfunc (p *Pool) worker(id int, jobs <-chan Job, results chan<- Result) {\n\tdefer p.wg.Done()\n\tfor job := range jobs {\n\t\tthumb := makeThumbnail(job.File)\n\t\tresults <- Result{JobID: job.ID, Thumb: thumb, Worker: id}\n\t}\n}\n"
          }
        },
        {
          "id": "worker-pool-kt-podcasts",
          "title": "Podcast downloads with a coroutine Semaphore",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "Seven episodes start as seven coroutines, but a Semaphore with 3 permits lets only three download at once. The log line 'active: n' never shows more than 3.",
          "roles": {
            "Task Queue": [
              "worker-pool-kt-podcasts/Episode.kt#feed"
            ],
            "Worker": [
              "worker-pool-kt-podcasts/Downloader.kt#Downloader.fetch"
            ],
            "Limiter": [
              "worker-pool-kt-podcasts/Downloader.kt#Downloader.download",
              "worker-pool-kt-podcasts/Downloader.kt#Downloader"
            ],
            "Results": [
              "worker-pool-kt-podcasts/Library.kt#Library"
            ],
            "Client": [
              "worker-pool-kt-podcasts/Main.kt#main",
              "worker-pool-kt-podcasts/Library.kt#Library.syncAll"
            ]
          },
          "trace": [
            {
              "at": "worker-pool-kt-podcasts/Main.kt#main",
              "say": "main() builds a Downloader allowed 3 parallel downloads and asks the library to sync the whole feed."
            },
            {
              "at": "worker-pool-kt-podcasts/Library.kt#Library.syncAll",
              "say": "syncAll starts one async coroutine per episode. Coroutines are cheap, so creating seven is fine; limiting them is someone else's job."
            },
            {
              "at": "worker-pool-kt-podcasts/Downloader.kt#Downloader.download",
              "say": "withPermit takes one of 3 permits. Coroutine number 4 suspends here, without blocking a thread, until a permit is free."
            },
            {
              "at": "worker-pool-kt-podcasts/Downloader.kt#Downloader.fetch",
              "say": "fetch counts active downloads with an AtomicInteger, which is safe to bump from several coroutines at once."
            },
            {
              "at": "worker-pool-kt-podcasts/Downloader.kt#Downloader.download",
              "say": "When fetch returns, withPermit releases the permit even if fetch threw, and a waiting coroutine starts."
            },
            {
              "at": "worker-pool-kt-podcasts/Library.kt#Library.syncAll",
              "say": "awaitAll collects the seven file names in order. coroutineScope guarantees none is still running after it returns."
            }
          ],
          "files": {
            "worker-pool-kt-podcasts/Downloader.kt": "package podcasts\n\nimport java.util.concurrent.atomic.AtomicInteger\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.sync.Semaphore\nimport kotlinx.coroutines.sync.withPermit\n\n// The pool is a set of permits, not a set of threads: at most maxParallel downloads run at once.\nclass Downloader(maxParallel: Int) {\n    private val permits = Semaphore(maxParallel)\n    private val active = AtomicInteger(0)\n\n    suspend fun download(episode: Episode): String {\n        return permits.withPermit {\n            fetch(episode)\n        }\n    }\n\n    private suspend fun fetch(episode: Episode): String {\n        val now = active.incrementAndGet()\n        println(\"start  ${episode.title} (active: $now)\")\n        delay(episode.sizeMb * 10L) // pretend network transfer\n        active.decrementAndGet()\n        println(\"finish ${episode.title}\")\n        return episode.title.lowercase().replace(' ', '-') + \".mp3\"\n    }\n}\n",
            "worker-pool-kt-podcasts/Episode.kt": "package podcasts\n\ndata class Episode(val title: String, val sizeMb: Int)\n\nval feed = listOf(\n    Episode(\"Intro to Kotlin\", 30),\n    Episode(\"Coroutines Deep Dive\", 80),\n    Episode(\"Flows in Practice\", 55),\n    Episode(\"Testing Async Code\", 40),\n    Episode(\"Structured Concurrency\", 65),\n    Episode(\"Channels vs Flows\", 35),\n    Episode(\"Q&A Special\", 20),\n)\n",
            "worker-pool-kt-podcasts/Library.kt": "package podcasts\n\nimport kotlinx.coroutines.async\nimport kotlinx.coroutines.awaitAll\nimport kotlinx.coroutines.coroutineScope\n\nclass Library(private val downloader: Downloader) {\n    private val files = mutableListOf<String>()\n\n    // One coroutine per episode is cheap; the Downloader's semaphore is what limits the work.\n    suspend fun syncAll(episodes: List<Episode>): List<String> {\n        val saved = coroutineScope {\n            episodes.map { ep -> async { downloader.download(ep) } }.awaitAll()\n        }\n        files.addAll(saved)\n        return saved\n    }\n}\n",
            "worker-pool-kt-podcasts/Main.kt": "package podcasts\n\nimport kotlinx.coroutines.runBlocking\nimport kotlin.system.measureTimeMillis\n\nfun main() {\n    runBlocking {\n        val library = Library(Downloader(maxParallel = 3))\n        val ms = measureTimeMillis {\n            val saved = library.syncAll(feed)\n            println(\"saved ${saved.size} episodes\")\n        }\n        println(\"took $ms ms (never more than 3 downloads at once)\")\n    }\n}\n"
          }
        },
        {
          "id": "worker-pool-p-limit-real",
          "title": "p-limit: run promises N at a time",
          "lang": "JavaScript",
          "level": "intermediate",
          "source": {
            "repo": "sindresorhus/p-limit",
            "url": "https://github.com/sindresorhus/p-limit/blob/v7.3.3/index.js",
            "license": "MIT",
            "note": "p-limit/index.js is verbatim from p-limit 7.3.3 (only the source header was added; it imports the separate yocto-queue package, not included); usage.js was written for Software City."
          },
          "story": "Real code from one of npm's most downloaded packages. There are no threads at all: a counter (activeCount) and a queue of parked functions keep at most N promises running.",
          "roles": {
            "Task Queue": [
              "worker-pool-p-limit-real/p-limit/index.js#enqueue"
            ],
            "Worker": [
              "worker-pool-p-limit-real/p-limit/index.js#run"
            ],
            "Limiter": [
              "worker-pool-p-limit-real/p-limit/index.js#pLimit",
              "worker-pool-p-limit-real/p-limit/index.js#resumeNext"
            ],
            "Results": [
              "worker-pool-p-limit-real/usage.js#report"
            ],
            "Client": [
              "worker-pool-p-limit-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "worker-pool-p-limit-real/usage.js#run",
              "say": "run() wraps each of 8 price checks in limit(...). All 8 calls happen at once, but they only get queued."
            },
            {
              "at": "worker-pool-p-limit-real/p-limit/index.js#generator",
              "say": "Calling limit(fn) returns a promise right away and passes fn to enqueue. The caller can await it like any promise."
            },
            {
              "at": "worker-pool-p-limit-real/p-limit/index.js#enqueue",
              "say": "enqueue parks fn in the queue behind an inner promise, then calls resumeNext if fewer than 2 are running."
            },
            {
              "at": "worker-pool-p-limit-real/p-limit/index.js#resumeNext",
              "say": "resumeNext is the gate: only while activeCount < concurrency does it bump the counter and release the next queued job."
            },
            {
              "at": "worker-pool-p-limit-real/p-limit/index.js#run",
              "say": "run calls the real function, resolves the caller's promise with its result, and awaits it, catching errors so the pool keeps going."
            },
            {
              "at": "worker-pool-p-limit-real/usage.js#checkPrice",
              "say": "Each job logs activeCount and pendingCount. You will see 'running: 2' at most, with the rest waiting."
            },
            {
              "at": "worker-pool-p-limit-real/p-limit/index.js#next",
              "say": "When a job settles, next() lowers activeCount and calls resumeNext, so the freed slot goes to the next job."
            },
            {
              "at": "worker-pool-p-limit-real/usage.js#report",
              "say": "Promise.all resolved once all 8 finished, in original order, though only two ever ran at the same time."
            }
          ],
          "files": {
            "worker-pool-p-limit-real/p-limit/index.js": "/*\n * Source: p-limit 7.3.3 by Sindre Sorhus — https://github.com/sindresorhus/p-limit/blob/v7.3.3/index.js\n * MIT License, Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com). Included verbatim for study.\n */\nimport Queue from 'yocto-queue';\n\nexport default function pLimit(concurrency) {\n\tlet rejectOnClear = false;\n\n\tif (typeof concurrency === 'object') {\n\t\t({concurrency, rejectOnClear = false} = concurrency);\n\t}\n\n\tvalidateConcurrency(concurrency);\n\n\tif (typeof rejectOnClear !== 'boolean') {\n\t\tthrow new TypeError('Expected `rejectOnClear` to be a boolean');\n\t}\n\n\tconst queue = new Queue();\n\tlet activeCount = 0;\n\n\tconst resumeNext = () => {\n\t\t// Process the next queued function if we're under the concurrency limit\n\t\tif (activeCount < concurrency && queue.size > 0) {\n\t\t\tactiveCount++;\n\t\t\tqueue.dequeue().run();\n\t\t}\n\t};\n\n\tconst next = () => {\n\t\tactiveCount--;\n\t\tresumeNext();\n\t};\n\n\tconst run = async (function_, resolve, arguments_) => {\n\t\t// Execute the function and capture the result promise\n\t\tconst result = (async () => function_(...arguments_))();\n\n\t\t// Resolve immediately with the promise (don't wait for completion)\n\t\tresolve(result);\n\n\t\t// Wait for the function to complete (success or failure)\n\t\t// We catch errors here to prevent unhandled rejections,\n\t\t// but the original promise rejection is preserved for the caller\n\t\ttry {\n\t\t\tawait result;\n\t\t} catch {}\n\n\t\t// Decrement active count and process next queued function\n\t\tnext();\n\t};\n\n\tconst enqueue = (function_, resolve, reject, arguments_) => {\n\t\tconst queueItem = {reject};\n\n\t\t// Queue the internal resolve function instead of the run function\n\t\t// to preserve the asynchronous execution context.\n\t\tnew Promise(internalResolve => { // eslint-disable-line promise/param-names\n\t\t\tqueueItem.run = internalResolve;\n\t\t\tqueue.enqueue(queueItem);\n\t\t}).then(run.bind(undefined, function_, resolve, arguments_)); // eslint-disable-line promise/prefer-await-to-then\n\n\t\t// Start processing immediately if we haven't reached the concurrency limit\n\t\tif (activeCount < concurrency) {\n\t\t\tresumeNext();\n\t\t}\n\t};\n\n\tconst generator = (function_, ...arguments_) => new Promise((resolve, reject) => {\n\t\tenqueue(function_, resolve, reject, arguments_);\n\t});\n\n\tObject.defineProperties(generator, {\n\t\tactiveCount: {\n\t\t\tget: () => activeCount,\n\t\t},\n\t\tpendingCount: {\n\t\t\tget: () => queue.size,\n\t\t},\n\t\tclearQueue: {\n\t\t\tvalue() {\n\t\t\t\tif (!rejectOnClear) {\n\t\t\t\t\tqueue.clear();\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tconst abortError = AbortSignal.abort().reason;\n\n\t\t\t\twhile (queue.size > 0) {\n\t\t\t\t\tqueue.dequeue().reject(abortError);\n\t\t\t\t}\n\t\t\t},\n\t\t},\n\t\tconcurrency: {\n\t\t\tget: () => concurrency,\n\n\t\t\tset(newConcurrency) {\n\t\t\t\tvalidateConcurrency(newConcurrency);\n\t\t\t\tconcurrency = newConcurrency;\n\n\t\t\t\tqueueMicrotask(() => {\n\t\t\t\t\t// eslint-disable-next-line no-unmodified-loop-condition\n\t\t\t\t\twhile (activeCount < concurrency && queue.size > 0) {\n\t\t\t\t\t\tresumeNext();\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t},\n\t\t},\n\t\tmap: {\n\t\t\tasync value(iterable, function_) {\n\t\t\t\tconst promises = [];\n\n\t\t\t\ttry {\n\t\t\t\t\tArray.from(iterable, (value, index) => {\n\t\t\t\t\t\tconst promise = generator(function_, value, index);\n\t\t\t\t\t\tpromises.push(promise);\n\t\t\t\t\t\treturn promise;\n\t\t\t\t\t});\n\t\t\t\t} catch (error) {\n\t\t\t\t\t// The iterable threw, so `Promise.all` never observes the already scheduled promises. Observe them here to avoid unhandled rejections.\n\t\t\t\t\tfor (const promise of promises) {\n\t\t\t\t\t\tpromise.catch(() => {}); // eslint-disable-line promise/prefer-await-to-then\n\t\t\t\t\t}\n\n\t\t\t\t\tthrow error;\n\t\t\t\t}\n\n\t\t\t\treturn Promise.all(promises);\n\t\t\t},\n\t\t},\n\t});\n\n\treturn generator;\n}\n\nexport function limitFunction(function_, options) {\n\tconst limit = pLimit(options);\n\n\tconst limitedFunction = (...arguments_) => limit(() => function_(...arguments_));\n\tObject.defineProperty(limitedFunction, 'clearQueue', {\n\t\tvalue: limit.clearQueue,\n\t});\n\n\treturn limitedFunction;\n}\n\nfunction validateConcurrency(concurrency) {\n\tif (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {\n\t\tthrow new TypeError('Expected `concurrency` to be a number from 1 and up');\n\t}\n}\n",
            "worker-pool-p-limit-real/usage.js": "// Example usage written for Software City (not part of p-limit).\n// Check the price of eight products, but never hit the shop API more than twice at once.\nimport pLimit from './p-limit/index.js';\n\nconst limit = pLimit(2);\n\nfunction checkPrice(product) {\n\treturn new Promise(resolve => {\n\t\tconsole.log(`ask   ${product} (running: ${limit.activeCount}, waiting: ${limit.pendingCount})`);\n\t\tsetTimeout(() => resolve({product, price: product.length * 3}), 300);\n\t});\n}\n\nfunction report(prices) {\n\tfor (const {product, price} of prices) {\n\t\tconsole.log(`${product}: ${price} EUR`);\n\t}\n}\n\nexport async function run() {\n\tconst products = ['mug', 'lamp', 'desk', 'chair', 'pen', 'notebook', 'bag', 'clock'];\n\tconst jobs = products.map(product => limit(() => checkPrice(product)));\n\tconst prices = await Promise.all(jobs);\n\treport(prices);\n}\n\nrun();\n"
          }
        }
      ]
    },
    {
      "id": "actor-model",
      "name": "Actor Model",
      "family": "Concurrency",
      "aka": [
        "Actors",
        "Message passing",
        "Mailbox",
        "Erlang/Akka style"
      ],
      "tagline": "Each actor owns its state and talks to others only by sending messages to their mailboxes.",
      "intent": "Avoid shared mutable state by giving every piece of state a single owner, the actor, which handles the messages in its mailbox one at a time. Other code never touches that state; it sends a message (tell) or sends one and waits for a reply (ask). Because only one thread ever changes the state, no locks are needed.",
      "analogy": "An office where each clerk has an in-tray. You never reach into a clerk's filing cabinet; you drop a note in the tray, and the clerk handles notes one by one and, if asked, sends a note back.",
      "cityShape": "Each actor building has a tall run/loop floor that pipes into a single handle/on_receive floor, and only that floor writes to the actor's state antenna. Every other building reaches the actor through small tell/ask floors on a reference (AccountRef, ActorRef) that only write into the mailbox: no amber pipe from outside ever touches the state.",
      "roles": [
        {
          "name": "Actor",
          "desc": "Owns private state and a behaviour. Handles one message at a time, so its state needs no lock."
        },
        {
          "name": "Mailbox",
          "desc": "The queue of incoming messages. Senders add to it; only the actor's own loop takes from it."
        },
        {
          "name": "Message",
          "desc": "An immutable value describing a request or an event. Ask-style messages carry a place to send the reply."
        },
        {
          "name": "Actor Reference",
          "desc": "The address other code holds. It can tell and ask, but cannot reach the actor's fields."
        },
        {
          "name": "Sender",
          "desc": "Any code (or other actor) that sends messages and maybe waits for replies."
        }
      ],
      "whenToUse": [
        "Some state is changed from many threads, and you would rather serialise access than sprinkle locks.",
        "Your system is naturally many independent entities (users, game NPCs, devices, chat rooms) that talk to each other.",
        "You want failures isolated: one actor can crash and be restarted without corrupting the others.",
        "The work may later be spread across processes or machines, where messages are the only option anyway."
      ],
      "pitfalls": [
        "Sending a mutable object in a message brings shared state back; send copies or immutable values.",
        "Two actors that ask each other and wait for the reply can deadlock; prefer tell with a reply message.",
        "One busy actor is a bottleneck: everything it owns is handled strictly one message at a time. Split hot state across several actors."
      ],
      "related": [
        "producer-consumer",
        "locks-and-races",
        "mediator",
        "command",
        "event-queue"
      ],
      "quiz": [
        {
          "q": "Why does the Go Account actor need no mutex even though 100 goroutines deposit at once?",
          "options": [
            "Go makes all integer additions atomic",
            "The goroutines only send messages; a single goroutine, the actor, applies them to balance one by one",
            "The channel is buffered",
            "Deposits are rare"
          ],
          "answer": 1,
          "why": "Only the actor's own loop ever reads or writes balance. The mailbox turns 100 simultaneous requests into an orderly line."
        },
        {
          "q": "What is the difference between tell and ask?",
          "options": [
            "tell is for actors, ask is for threads",
            "tell sends and returns at once; ask also sends a reply channel or future and waits for the answer",
            "ask skips the mailbox",
            "There is none"
          ],
          "answer": 1,
          "why": "tell is fire-and-forget. ask puts a reply slot (Reply channel, Future) in the message and the sender waits on it, which is convenient but can block or deadlock."
        }
      ],
      "demos": [
        {
          "id": "actor-model-go-bank",
          "title": "A piggy bank actor in Go",
          "lang": "Go",
          "level": "beginner",
          "source": null,
          "story": "An Account goroutine owns the balance. 100 goroutines deposit at the same time through an AccountRef, and the result is always right without a single lock. Deposit is a tell; Withdraw and Balance are asks with a reply channel.",
          "roles": {
            "Actor": [
              "actor-model-go-bank/account.go#Account",
              "actor-model-go-bank/account.go#Account.handle"
            ],
            "Mailbox": [
              "actor-model-go-bank/account.go#Account.run"
            ],
            "Message": [
              "actor-model-go-bank/messages.go#Deposit",
              "actor-model-go-bank/messages.go#Withdraw",
              "actor-model-go-bank/messages.go#GetBalance"
            ],
            "Actor Reference": [
              "actor-model-go-bank/ref.go#AccountRef",
              "actor-model-go-bank/ref.go#Spawn"
            ],
            "Sender": [
              "actor-model-go-bank/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "actor-model-go-bank/main.go#main",
              "say": "main() spawns one account actor and gets back only its address, an AccountRef."
            },
            {
              "at": "actor-model-go-bank/ref.go#Spawn",
              "say": "Spawn makes the Account with a mailbox channel and starts its loop in a goroutine. The Account pointer never leaves this function."
            },
            {
              "at": "actor-model-go-bank/ref.go#AccountRef.Deposit",
              "say": "100 goroutines call Deposit at once. Each one only drops a Deposit message in the mailbox: a tell."
            },
            {
              "at": "actor-model-go-bank/account.go#Account.run",
              "say": "The actor's loop takes messages one at a time. This single line is what makes 100 concurrent deposits safe."
            },
            {
              "at": "actor-model-go-bank/account.go#Account.handle",
              "say": "handle is the only code that writes balance. No other goroutine can see it, so there is nothing to race on."
            },
            {
              "at": "actor-model-go-bank/ref.go#AccountRef.Withdraw",
              "say": "Withdraw is an ask: it sends a reply channel inside the message and waits for the actor's yes or no."
            },
            {
              "at": "actor-model-go-bank/ref.go#AccountRef.Balance",
              "say": "Balance asks the same way. The mailbox is first-in, first-out, so it sees every earlier deposit: always 700."
            }
          ],
          "files": {
            "actor-model-go-bank/account.go": "package main\n\n// Account is the actor. Only its own goroutine ever touches balance, so no lock is needed.\ntype Account struct {\n\tbalance int\n\tinbox   chan any\n}\n\n// run is the actor's life: take one message from the mailbox, handle it, repeat.\nfunc (a *Account) run() {\n\tfor msg := range a.inbox {\n\t\ta.handle(msg)\n\t}\n}\n\nfunc (a *Account) handle(msg any) {\n\tswitch m := msg.(type) {\n\tcase Deposit:\n\t\ta.balance += m.Amount\n\tcase Withdraw:\n\t\tok := m.Amount <= a.balance\n\t\tif ok {\n\t\t\ta.balance -= m.Amount\n\t\t}\n\t\tm.Reply <- ok\n\tcase GetBalance:\n\t\tm.Reply <- a.balance\n\t}\n}\n",
            "actor-model-go-bank/main.go": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc main() {\n\tvar account AccountRef = Spawn() // the address, not the actor itself\n\n\t// 100 goroutines deposit at the same time. No mutex anywhere.\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < 100; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\taccount.Deposit(10)\n\t\t}()\n\t}\n\twg.Wait()\n\n\tfmt.Println(\"withdraw 300:\", account.Withdraw(300))\n\tfmt.Println(\"withdraw 5000:\", account.Withdraw(5000))\n\tfmt.Println(\"balance:\", account.Balance()) // always 700\n}\n",
            "actor-model-go-bank/messages.go": "package main\n\n// Messages are plain values. The only way to talk to an actor is to send one.\ntype Deposit struct {\n\tAmount int\n}\n\ntype Withdraw struct {\n\tAmount int\n\tReply  chan bool // the actor answers on this channel\n}\n\ntype GetBalance struct {\n\tReply chan int\n}\n",
            "actor-model-go-bank/ref.go": "package main\n\n// AccountRef is the address of an account actor. It can send, but it cannot reach balance.\ntype AccountRef struct {\n\tinbox chan<- any\n}\n\n// Spawn starts a new Account actor in its own goroutine and returns its address.\nfunc Spawn() AccountRef {\n\ta := &Account{inbox: make(chan any, 16)}\n\tgo a.run()\n\treturn AccountRef{inbox: a.inbox}\n}\n\n// Deposit is fire-and-forget (\"tell\").\nfunc (r AccountRef) Deposit(amount int) {\n\tr.inbox <- Deposit{Amount: amount}\n}\n\n// Withdraw waits for an answer (\"ask\").\nfunc (r AccountRef) Withdraw(amount int) bool {\n\treply := make(chan bool)\n\tr.inbox <- Withdraw{Amount: amount, Reply: reply}\n\treturn <-reply\n}\n\nfunc (r AccountRef) Balance() int {\n\treply := make(chan int)\n\tr.inbox <- GetBalance{Reply: reply}\n\treturn <-reply\n}\n"
          }
        },
        {
          "id": "actor-model-cs-chat",
          "title": "Chat room actors with System.Threading.Channels",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "A ChatRoomActor owns the member list; each UserActor owns its history. Actors talk only through Tell with immutable record messages. A reusable Actor base class holds the mailbox and the one-at-a-time loop.",
          "roles": {
            "Actor": [
              "actor-model-cs-chat/ChatRoomActor.cs#ChatRoomActor",
              "actor-model-cs-chat/UserActor.cs#UserActor",
              "actor-model-cs-chat/Actor.cs#Actor"
            ],
            "Mailbox": [
              "actor-model-cs-chat/Actor.cs#Actor.RunAsync"
            ],
            "Message": [
              "actor-model-cs-chat/Messages.cs#IMessage",
              "actor-model-cs-chat/Messages.cs#Deliver"
            ],
            "Actor Reference": [
              "actor-model-cs-chat/Actor.cs#Actor.Tell",
              "actor-model-cs-chat/Actor.cs#Actor.StopAsync"
            ],
            "Sender": [
              "actor-model-cs-chat/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "actor-model-cs-chat/Program.cs#Program.Main",
              "say": "Main creates three actors, starts their loops, and from then on only sends them messages."
            },
            {
              "at": "actor-model-cs-chat/Actor.cs#Actor.Start",
              "say": "Start runs the mailbox loop on the thread pool. Each actor gets exactly one loop."
            },
            {
              "at": "actor-model-cs-chat/Actor.cs#Actor.Tell",
              "say": "Tell writes into the channel and returns immediately. The sender does not wait for the message to be handled."
            },
            {
              "at": "actor-model-cs-chat/Actor.cs#Actor.RunAsync",
              "say": "RunAsync awaits each message and finishes HandleAsync before reading the next, so an actor never runs two handlers at once."
            },
            {
              "at": "actor-model-cs-chat/ChatRoomActor.cs#ChatRoomActor.HandleAsync",
              "say": "Join adds to the members dictionary. A plain Dictionary is fine: no other thread can reach it."
            },
            {
              "at": "actor-model-cs-chat/ChatRoomActor.cs#ChatRoomActor.Broadcast",
              "say": "Broadcast does not call users' methods to change them; it Tells each one a new Deliver record."
            },
            {
              "at": "actor-model-cs-chat/UserActor.cs#UserActor.HandleAsync",
              "say": "Each user handles Deliver in its own loop and appends to its own history."
            },
            {
              "at": "actor-model-cs-chat/Actor.cs#Actor.StopAsync",
              "say": "StopAsync completes the mailbox; the loop drains what is left and ends. Graceful shutdown is part of the actor's contract."
            }
          ],
          "files": {
            "actor-model-cs-chat/Actor.cs": "using System.Threading.Channels;\nusing System.Threading.Tasks;\n\n// Base class for every actor: a private mailbox and a loop that handles one message at a time.\npublic abstract class Actor\n{\n    private readonly Channel<IMessage> mailbox = Channel.CreateUnbounded<IMessage>();\n    private Task loop = Task.CompletedTask;\n\n    // Anyone may Tell. It only drops the message in the mailbox and returns at once.\n    public void Tell(IMessage message)\n    {\n        mailbox.Writer.TryWrite(message);\n    }\n\n    public void Start()\n    {\n        loop = Task.Run(RunAsync);\n    }\n\n    public Task StopAsync()\n    {\n        mailbox.Writer.Complete();\n        return loop;\n    }\n\n    private async Task RunAsync()\n    {\n        await foreach (var message in mailbox.Reader.ReadAllAsync())\n        {\n            await HandleAsync(message);\n        }\n    }\n\n    protected abstract Task HandleAsync(IMessage message);\n}\n",
            "actor-model-cs-chat/ChatRoomActor.cs": "using System.Collections.Generic;\nusing System.Threading.Tasks;\n\n// The room owns the member list. Only its own loop touches it, so there is no lock.\npublic class ChatRoomActor : Actor\n{\n    private readonly Dictionary<string, UserActor> members = new Dictionary<string, UserActor>();\n\n    protected override Task HandleAsync(IMessage message)\n    {\n        switch (message)\n        {\n            case Join join:\n                members[join.Name] = join.User;\n                Broadcast(\"room\", $\"{join.Name} joined\");\n                break;\n            case Say say:\n                Broadcast(say.From, say.Text);\n                break;\n            case Leave leave:\n                members.Remove(leave.Name);\n                Broadcast(\"room\", $\"{leave.Name} left\");\n                break;\n        }\n        return Task.CompletedTask;\n    }\n\n    private void Broadcast(string from, string text)\n    {\n        foreach (var member in members.Values)\n        {\n            Actor user = member;\n            user.Tell(new Deliver(from, text));\n        }\n    }\n}\n",
            "actor-model-cs-chat/Messages.cs": "// Messages are immutable records: safe to pass between actors because nobody can change them.\npublic interface IMessage\n{\n}\n\npublic record Join(string Name, UserActor User) : IMessage;\n\npublic record Say(string From, string Text) : IMessage;\n\npublic record Deliver(string From, string Text) : IMessage;\n\npublic record Leave(string Name) : IMessage;\n",
            "actor-model-cs-chat/Program.cs": "using System.Threading.Tasks;\n\npublic class Program\n{\n    public static async Task Main()\n    {\n        Actor room = new ChatRoomActor();\n        var ana = new UserActor(\"ana\");\n        var ben = new UserActor(\"ben\");\n        room.Start();\n        ana.Start();\n        ben.Start();\n\n        // Main never touches the room's member list; it only sends messages.\n        room.Tell(new Join(\"ana\", ana));\n        room.Tell(new Join(\"ben\", ben));\n        room.Tell(new Say(\"ana\", \"hi ben!\"));\n        room.Tell(new Leave(\"ben\"));\n\n        await room.StopAsync();\n        await ana.StopAsync();\n        await ben.StopAsync();\n    }\n}\n",
            "actor-model-cs-chat/UserActor.cs": "using System;\nusing System.Collections.Generic;\nusing System.Threading.Tasks;\n\n// Each user keeps its own chat history. Again: private state, changed only by its own loop.\npublic class UserActor : Actor\n{\n    private readonly string name;\n    private readonly List<string> history = new List<string>();\n\n    public UserActor(string name)\n    {\n        this.name = name;\n    }\n\n    protected override Task HandleAsync(IMessage message)\n    {\n        if (message is Deliver deliver)\n        {\n            history.Add($\"{deliver.From}: {deliver.Text}\");\n            Console.WriteLine($\"[{name}'s screen] {deliver.From}: {deliver.Text}\");\n        }\n        return Task.CompletedTask;\n    }\n}\n"
          }
        },
        {
          "id": "actor-model-pykka-real",
          "title": "Pykka: actors for Python threads",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "jodal/pykka",
            "url": "https://github.com/jodal/pykka/blob/v4.4.2/src/pykka/_actor.py",
            "license": "Apache-2.0",
            "note": "pykka/_actor.py, _threading.py, _ref.py and _envelope.py are from Pykka 4.4.2 (src/pykka/), verbatim apart from marked trims of long docstrings and unrelated parts (ThreadingFuture, stop() overloads, proxy(), on_failure()); usage.py was written for Software City."
          },
          "story": "Real code from Pykka, a Python actor library used by the Mopidy music server. Every actor gets a thread and a queue.Queue inbox; tell wraps the message in an Envelope, and ask adds a future for the reply.",
          "roles": {
            "Actor": [
              "actor-model-pykka-real/pykka/_actor.py#Actor",
              "actor-model-pykka-real/usage.py#ScoreBoard"
            ],
            "Mailbox": [
              "actor-model-pykka-real/pykka/_threading.py#ThreadingActor._create_actor_inbox",
              "actor-model-pykka-real/pykka/_actor.py#Actor._actor_loop_running"
            ],
            "Message": [
              "actor-model-pykka-real/pykka/_envelope.py#Envelope"
            ],
            "Actor Reference": [
              "actor-model-pykka-real/pykka/_ref.py#ActorRef"
            ],
            "Sender": [
              "actor-model-pykka-real/usage.py#player",
              "actor-model-pykka-real/usage.py#main"
            ]
          },
          "trace": [
            {
              "at": "actor-model-pykka-real/usage.py#main",
              "say": "main() starts a ScoreBoard. start() hands back an ActorRef, so the caller never holds the actor object itself."
            },
            {
              "at": "actor-model-pykka-real/pykka/_actor.py#Actor.start",
              "say": "start() builds the actor, registers it, and calls _start_actor_loop. Your __init__ runs in the caller's thread."
            },
            {
              "at": "actor-model-pykka-real/pykka/_actor.py#Actor.__init__",
              "say": "The base __init__ creates the inbox, a stopped flag, and the ActorRef that wraps them."
            },
            {
              "at": "actor-model-pykka-real/pykka/_threading.py#ThreadingActor._start_actor_loop",
              "say": "ThreadingActor gives the actor its own thread, running _actor_loop. One thread per actor, one message at a time."
            },
            {
              "at": "actor-model-pykka-real/pykka/_ref.py#ActorRef.tell",
              "say": "Three player threads call tell() hundreds of times. tell checks the actor is alive and puts an Envelope in the inbox."
            },
            {
              "at": "actor-model-pykka-real/pykka/_actor.py#Actor._actor_loop_running",
              "say": "The loop gets one envelope, handles it, and sets the reply future if there is one. Errors are routed back to the asker."
            },
            {
              "at": "actor-model-pykka-real/usage.py#ScoreBoard.on_receive",
              "say": "on_receive updates self.scores with no lock: only this thread ever runs it."
            },
            {
              "at": "actor-model-pykka-real/pykka/_ref.py#ActorRef.ask",
              "say": "ask() puts a future in the envelope as reply_to and blocks on future.get() until the actor answers with the top three."
            }
          ],
          "files": {
            "actor-model-pykka-real/pykka/_actor.py": "# Source: Pykka 4.4.2 — https://github.com/jodal/pykka/blob/v4.4.2/src/pykka/_actor.py\n# Apache License 2.0, Copyright (c) 2010-2026 Stein Magnus Jodal and contributors. Included for study.\nfrom __future__ import annotations\n\nimport abc\nimport logging\nimport sys\nimport threading\nimport uuid\nfrom typing import TYPE_CHECKING, Any, Protocol, TypeVar\n\nfrom pykka import ActorDeadError, ActorRef, ActorRegistry, messages\nfrom pykka._introspection import get_attr_directly\n\nif TYPE_CHECKING:\n    from types import TracebackType\n\n    from pykka import Future\n    from pykka._envelope import Envelope\n\n__all__ = [\"Actor\"]\n\n\nlogger = logging.getLogger(\"pykka\")\n\n\nA = TypeVar(\"A\", bound=\"Actor\")\n\n\nclass ActorInbox(Protocol):\n    def put(self, envelope: Envelope[Any], /) -> None: ...\n\n    def get(self) -> Envelope[Any]: ...\n\n    def empty(self) -> bool: ...\n\n\nclass Actor(abc.ABC):\n    # … trimmed: 44-line docstring …\n\n    @classmethod\n    def start(\n        cls: type[A],\n        *args: Any,\n        **kwargs: Any,\n    ) -> ActorRef[A]:\n        # … trimmed: 30-line docstring …\n        obj = cls(*args, **kwargs)\n        assert obj.actor_ref is not None, (\n            \"Actor.__init__() have not been called. \"\n            \"Did you forget to call super() in your override?\"\n        )\n        ActorRegistry.register(obj.actor_ref)\n        logger.debug(f\"Starting {obj}\")\n        obj._start_actor_loop()\n        return obj.actor_ref\n\n    @staticmethod\n    @abc.abstractmethod\n    def _create_actor_inbox() -> ActorInbox:\n        # … trimmed: 4-line docstring …\n        msg = \"Use a subclass of Actor\"\n        raise NotImplementedError(msg)\n\n    @staticmethod\n    @abc.abstractmethod\n    def _create_future() -> Future[Any]:\n        # … trimmed: 4-line docstring …\n        msg = \"Use a subclass of Actor\"\n        raise NotImplementedError(msg)\n\n    @abc.abstractmethod\n    def _start_actor_loop(self) -> None:\n        # … trimmed: 4-line docstring …\n        msg = \"Use a subclass of Actor\"\n        raise NotImplementedError(msg)\n\n    actor_urn: str\n    # … trimmed: 6-line docstring …\n\n    actor_inbox: ActorInbox\n    # … trimmed: 7-line docstring …\n\n    _actor_ref: ActorRef[Any]\n\n    @property\n    def actor_ref(self: A) -> ActorRef[A]:\n        \"\"\"The actor's [`ActorRef`][pykka.ActorRef] instance.\"\"\"\n        # This property only exists to improve the typing of the ActorRef.\n        return self._actor_ref\n\n    actor_stopped: threading.Event\n    # … trimmed: 6-line docstring …\n\n    def __init__(\n        self,\n        *_args: Any,\n        **_kwargs: Any,\n    ) -> None:\n        # … trimmed: 19-line docstring …\n        self.actor_urn = uuid.uuid4().urn\n        self.actor_inbox = self._create_actor_inbox()\n        self.actor_stopped = threading.Event()\n\n        self._actor_ref = ActorRef(self)\n\n    def __str__(self) -> str:\n        return f\"{self.__class__.__name__} ({self.actor_urn})\"\n\n    def stop(self) -> None:\n        # … trimmed: 5-line docstring …\n        self.actor_ref.tell(messages._ActorStop())  # noqa: SLF001\n\n    def _stop(self) -> None:\n        \"\"\"Stop the actor immediately without processing the rest of the inbox.\"\"\"\n        ActorRegistry.unregister(self.actor_ref)\n        self.actor_stopped.set()\n        logger.debug(f\"Stopped {self}\")\n        try:\n            self.on_stop()\n        except Exception:  # noqa: BLE001\n            self._handle_failure(*sys.exc_info())\n\n    def _actor_loop(self) -> None:\n        # … trimmed: 4-line docstring …\n        self._actor_loop_setup()\n        self._actor_loop_running()\n        self._actor_loop_teardown()\n\n    def _actor_loop_setup(self) -> None:\n        try:\n            self.on_start()\n        except Exception:  # noqa: BLE001\n            self._handle_failure(*sys.exc_info())\n\n    def _actor_loop_running(self) -> None:\n        while not self.actor_stopped.is_set():\n            envelope = self.actor_inbox.get()\n            try:\n                response = self._handle_receive(envelope.message)\n                if envelope.reply_to is not None:\n                    envelope.reply_to.set(response)\n            except Exception:  # noqa: BLE001\n                if envelope.reply_to is not None:\n                    logger.info(\n                        f\"Exception returned from {self} to caller:\",\n                        exc_info=sys.exc_info(),\n                    )\n                    envelope.reply_to.set_exception()\n                else:\n                    self._handle_failure(*sys.exc_info())\n                    try:\n                        self.on_failure(*sys.exc_info())\n                    except Exception:  # noqa: BLE001\n                        self._handle_failure(*sys.exc_info())\n            except BaseException:  # noqa: BLE001\n                exception_value = sys.exc_info()[1]\n                logger.debug(f\"{exception_value!r} in {self}. Stopping all actors.\")\n                self._stop()\n                ActorRegistry.stop_all()\n\n    def _actor_loop_teardown(self) -> None:\n        while not self.actor_inbox.empty():\n            envelope = self.actor_inbox.get()\n            if envelope.reply_to is not None:\n                if isinstance(envelope.message, messages._ActorStop):  # noqa: SLF001\n                    envelope.reply_to.set(None)\n                else:\n                    envelope.reply_to.set_exception(\n                        exc_info=(\n                            ActorDeadError,\n                            ActorDeadError(\n                                f\"{self.actor_ref} stopped before handling the message\"\n                            ),\n                            None,\n                        )\n                    )\n\n    def on_start(self) -> None:  # noqa: B027\n        \"\"\"Run code at the beginning of the actor's life.\n\n        Hook for doing any setup that should be done *after* the actor is\n        started, but *before* it starts processing messages.\n\n        /// note | Threading runtime\n        For [`ThreadingActor`][pykka.ThreadingActor], this method is\n        executed in the actor's own thread, while `__init__()` is executed\n        in the thread that created the actor.\n        ///\n\n        If an exception is raised by this method the stack trace will be\n        logged, and the actor will stop.\n        \"\"\"\n\n    # … trimmed: 19 lines of the on_stop() hook (an empty method with a long docstring) …\n    def _handle_failure(\n        self,\n        exception_type: type[BaseException] | None,\n        exception_value: BaseException | None,\n        traceback: TracebackType | None,\n    ) -> None:\n        \"\"\"Log unexpected failures, unregisters and stops the actor.\"\"\"\n        logger.error(\n            f\"Unhandled exception in {self}:\",\n            exc_info=(exception_type, exception_value, traceback),  # type: ignore[arg-type]\n        )\n        ActorRegistry.unregister(self.actor_ref)\n        self.actor_stopped.set()\n\n    # … trimmed: 23 lines of the on_failure() hook (an empty method with a long docstring) …\n    def _handle_receive(self, message: Any) -> Any:\n        \"\"\"Handle messages sent to the actor.\"\"\"\n        if isinstance(message, messages._ActorStop):  # noqa: SLF001\n            return self._stop()\n        if isinstance(message, messages.ProxyCall):\n            callee = get_attr_directly(self, message.attr_path)\n            return callee(*message.args, **message.kwargs)\n        if isinstance(message, messages.ProxyGetAttr):\n            attr = get_attr_directly(self, message.attr_path)\n            return attr\n        if isinstance(message, messages.ProxySetAttr):\n            parent_attr = get_attr_directly(self, message.attr_path[:-1])\n            attr_name = message.attr_path[-1]\n            return setattr(parent_attr, attr_name, message.value)\n        return self.on_receive(message)\n\n    def on_receive(self, message: Any) -> Any:\n        # … trimmed: 9-line docstring …\n        logger.warning(f\"Unexpected message received by {self}: {message}\")\n",
            "actor-model-pykka-real/pykka/_envelope.py": "# Source: Pykka 4.4.2 — https://github.com/jodal/pykka/blob/v4.4.2/src/pykka/_envelope.py\n# Apache License 2.0, Copyright (c) 2010-2026 Stein Magnus Jodal and contributors. Included for study.\nfrom __future__ import annotations\n\nfrom typing import TYPE_CHECKING, Any, Generic, TypeVar\n\nif TYPE_CHECKING:\n    from pykka import Future\n\n\nT = TypeVar(\"T\")\n\n\nclass Envelope(Generic[T]):\n    \"\"\"Envelope to add metadata to a message.\n\n    This is an internal type and is not part of the public API.\n    \"\"\"\n\n    # Using slots speeds up envelope creation with ~20%\n    __slots__ = [\"message\", \"reply_to\"]\n\n    message: T\n    \"\"\"The message to send.\"\"\"\n\n    reply_to: Future[Any] | None\n    \"\"\"The future to reply to if there is a response.\"\"\"\n\n    def __init__(self, message: T, reply_to: Future[Any] | None = None) -> None:\n        self.message = message\n        self.reply_to = reply_to\n\n    def __repr__(self) -> str:\n        return f\"Envelope(message={self.message!r}, reply_to={self.reply_to!r})\"\n",
            "actor-model-pykka-real/pykka/_ref.py": "# Source: Pykka 4.4.2 — https://github.com/jodal/pykka/blob/v4.4.2/src/pykka/_ref.py\n# Apache License 2.0, Copyright (c) 2010-2026 Stein Magnus Jodal and contributors. Included for study.\nfrom __future__ import annotations\n\nimport weakref\nfrom typing import (\n    TYPE_CHECKING,\n    Any,\n    Generic,\n    Literal,\n    TypeVar,\n    cast,\n    overload,\n)\n\nfrom pykka import ActorDeadError, ActorProxy\nfrom pykka._envelope import Envelope\nfrom pykka.messages import _ActorStop\n\nif TYPE_CHECKING:\n    from threading import Event\n\n    from pykka import Actor, Future\n    from pykka._actor import ActorInbox\n\n__all__ = [\"ActorRef\"]\n\n\nA = TypeVar(\"A\", bound=\"Actor\")\n\n\nclass ActorRef(Generic[A]):\n    # … trimmed: 7-line docstring …\n\n    actor_class: type[A]\n    \"\"\"The class of the referenced actor.\"\"\"\n\n    actor_urn: str\n    \"\"\"See [`Actor.actor_urn`][pykka.Actor.actor_urn].\"\"\"\n\n    actor_inbox: ActorInbox\n    \"\"\"See [`Actor.actor_inbox`][pykka.Actor.actor_inbox].\"\"\"\n\n    actor_stopped: Event\n    \"\"\"See [`Actor.actor_stopped`][pykka.Actor.actor_stopped].\"\"\"\n\n    def __init__(\n        self,\n        actor: A,\n    ) -> None:\n        self._actor_weakref = weakref.ref(actor)\n        self.actor_class = actor.__class__\n        self.actor_urn = actor.actor_urn\n        self.actor_inbox = actor.actor_inbox\n        self.actor_stopped = actor.actor_stopped\n\n    def __repr__(self) -> str:\n        return f\"<ActorRef for {self}>\"\n\n    def __str__(self) -> str:\n        return f\"{self.actor_class.__name__} ({self.actor_urn})\"\n\n    def is_alive(self) -> bool:\n        # … trimmed: 10-line docstring …\n        return not self.actor_stopped.is_set()\n\n    def tell(\n        self,\n        message: Any,\n    ) -> None:\n        # … trimmed: 12-line docstring …\n        if not self.is_alive():\n            msg = f\"{self} not found\"\n            raise ActorDeadError(msg)\n        self.actor_inbox.put(Envelope(message))\n\n    # … trimmed: 27 lines of three @overload type stubs for ask() …\n    def ask(\n        self,\n        message: Any,\n        *,\n        block: bool = True,\n        timeout: float | None = None,\n    ) -> Any | Future[Any]:\n        # … trimmed: 24-line docstring …\n        future = self.actor_class._create_future()  # noqa: SLF001\n\n        try:\n            if not self.is_alive():\n                msg = f\"{self} not found\"\n                raise ActorDeadError(msg)  # noqa: TRY301\n        except ActorDeadError:\n            future.set_exception()\n        else:\n            self.actor_inbox.put(Envelope(message, reply_to=future))\n\n        if block:\n            return future.get(timeout=timeout)\n\n        return future\n\n    # … trimmed: 89 lines of stop() with its overloads and proxy() (not used in this demo) …\n",
            "actor-model-pykka-real/pykka/_threading.py": "# Source: Pykka 4.4.2 — https://github.com/jodal/pykka/blob/v4.4.2/src/pykka/_threading.py\n# Apache License 2.0, Copyright (c) 2010-2026 Stein Magnus Jodal and contributors. Included for study.\nfrom __future__ import annotations\n\nimport queue\nimport sys\nimport threading\nimport time\nfrom itertools import count\nfrom typing import TYPE_CHECKING, Any, ClassVar, NamedTuple, TypeVar\n\nfrom pykka import Actor, Future, Timeout\n\nif TYPE_CHECKING:\n    from pykka._actor import ActorInbox\n    from pykka._envelope import Envelope\n    from pykka._future import GetHookFunc\n    from pykka._types import OptExcInfo\n\n__all__ = [\"ThreadingActor\", \"ThreadingFuture\"]\n\n\nT = TypeVar(\"T\")\n\n\n# … trimmed: 94 lines of ThreadingFutureResult and ThreadingFuture (a future built on threading.Condition) …\n\n_actor_thread_counter = count(0)\n\n\nclass ThreadingActor(Actor):\n    \"\"\"Implementation of [`Actor`][pykka.Actor] using regular Python threads.\"\"\"\n\n    use_daemon_thread: ClassVar[bool] = False\n    # … trimmed: 14-line docstring …\n\n    @staticmethod\n    def _create_actor_inbox() -> ActorInbox:\n        inbox: queue.Queue[Envelope[Any]] = queue.Queue()\n        return inbox\n\n    @staticmethod\n    def _create_future() -> Future[Any]:\n        return ThreadingFuture()\n\n    def _start_actor_loop(self) -> None:\n        thread = threading.Thread(\n            target=self._actor_loop,\n            name=f\"{self.__class__.__name__}-{next(_actor_thread_counter)}\",\n        )\n        thread.daemon = self.use_daemon_thread\n        thread.start()\n",
            "actor-model-pykka-real/usage.py": "# Example usage written for Software City (not part of Pykka).\n# A scoreboard actor: many player threads report points, nobody uses a lock.\nimport threading\n\nfrom pykka._threading import ThreadingActor\n\n\nclass ScoreBoard(ThreadingActor):\n    def __init__(self):\n        super().__init__()\n        self.scores = {}  # private state: only the actor's own thread touches it\n\n    def on_receive(self, message):\n        if message[\"type\"] == \"add\":\n            name = message[\"name\"]\n            self.scores[name] = self.scores.get(name, 0) + message[\"points\"]\n            return None\n        if message[\"type\"] == \"top\":\n            return sorted(self.scores.items(), key=lambda kv: -kv[1])[:3]\n        return None\n\n\ndef player(board, name, rounds):\n    for _ in range(rounds):\n        board.tell({\"type\": \"add\", \"name\": name, \"points\": 10})\n\n\ndef main():\n    board = ScoreBoard.start()  # returns an ActorRef, not the ScoreBoard object\n    threads = [threading.Thread(target=player, args=(board, n, r)) for n, r in [(\"ana\", 300), (\"ben\", 200), (\"cy\", 250)]]\n    for t in threads:\n        t.start()\n    for t in threads:\n        t.join()\n    print(board.ask({\"type\": \"top\"}))  # [('ana', 3000), ('cy', 2500), ('ben', 2000)], never less\n    board.stop()\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        }
      ]
    },
    {
      "id": "reactive-streams",
      "name": "Reactive Streams",
      "family": "Concurrency",
      "aka": [
        "Observables",
        "Rx / ReactiveX",
        "Kotlin Flow",
        "Event streams",
        "FRP"
      ],
      "tagline": "Treat events over time as a stream and shape it with small operators like map and filter.",
      "intent": "Model things that happen over time (keystrokes, sensor readings, clicks, messages) as a stream of values you can transform with reusable operators, much like an array. Each operator wraps the stream before it and returns a new one, so a pipeline is built declaratively and only starts running when someone subscribes.",
      "analogy": "A sushi conveyor belt: plates pass by over time, and stations along the belt remove some plates, add sauce to others, or wait until the belt has been quiet. You sit at the end and simply take what arrives.",
      "cityShape": "Look for a row of short operator floors (map, filter, debounce, scan, take) of the same shape, each piping into the stream's subscribe floor, and a single wiring floor (main/run) that calls every operator once in order. The source floor (typing, temperatureReadings, hitsFromArena) sits at one end and the subscriber (search, show, showScore) at the other.",
      "roles": [
        {
          "name": "Observable",
          "desc": "The source: produces values over time and starts producing only when subscribed to."
        },
        {
          "name": "Operator",
          "desc": "A function that takes a stream and returns a new stream (map, filter, debounce, scan, take). It never changes its input."
        },
        {
          "name": "Subscriber",
          "desc": "The consumer at the end that receives next values, plus error and complete signals."
        },
        {
          "name": "Subscription",
          "desc": "What subscribe returns: a handle to stop the stream and run its teardown (clear timers, close sockets)."
        },
        {
          "name": "Pipeline",
          "desc": "The code that chains source, operators and subscriber together, usually with pipe()."
        }
      ],
      "whenToUse": [
        "UI events that need timing logic: search-as-you-type, double-click detection, drag and drop.",
        "Continuous data such as sensor readings, prices or game telemetry that must be filtered, smoothed or combined.",
        "Several async sources must be merged, raced or switched (cancel the old request when a new one starts).",
        "You want event-handling logic as a readable, testable chain instead of scattered callbacks and flags."
      ],
      "pitfalls": [
        "Nothing happens until you subscribe; and each subscriber may restart the whole source (cold streams).",
        "Forgetting to unsubscribe leaks timers and listeners, especially in UI components that come and go.",
        "Long operator chains are hard to debug; name intermediate streams and keep each operator small."
      ],
      "related": [
        "observer",
        "pipes-and-filters",
        "iterator",
        "async-await",
        "lazy-evaluation"
      ],
      "quiz": [
        {
          "q": "In the search demo, the user types 13 keys but only 2 searches run. Which operator is mainly responsible?",
          "options": [
            "map, because it trims the text",
            "filter, because it drops short queries",
            "debounce, because it only emits after 200 ms of silence",
            "subscribe, because it ignores repeated values"
          ],
          "answer": 2,
          "why": "filter removes a few short prefixes, but debounce is what collapses a burst of keystrokes into one value after the user pauses."
        },
        {
          "q": "You build a Flow or Observable pipeline but never call collect/subscribe. What happens?",
          "options": [
            "It runs once in the background",
            "It runs and buffers all values",
            "Nothing: the source is never started",
            "It throws an error"
          ],
          "answer": 2,
          "why": "These streams are lazy (cold). Each operator only wraps the one before it; the source starts producing when a subscriber arrives at the end."
        }
      ],
      "demos": [
        {
          "id": "reactive-streams-ts-search",
          "title": "Search-as-you-type with a tiny home-made Stream",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A small Stream class plus three operators turn simulated keystrokes into search queries. Notice that each operator just subscribes to its upstream and emits into a new Stream.",
          "roles": {
            "Observable": [
              "reactive-streams-ts-search/stream.ts#Stream",
              "reactive-streams-ts-search/keyboard.ts#typing"
            ],
            "Operator": [
              "reactive-streams-ts-search/operators.ts#map",
              "reactive-streams-ts-search/operators.ts#filter",
              "reactive-streams-ts-search/operators.ts#debounce"
            ],
            "Subscriber": [
              "reactive-streams-ts-search/main.ts#search"
            ],
            "Subscription": [
              "reactive-streams-ts-search/stream.ts#Stream.subscribe"
            ],
            "Pipeline": [
              "reactive-streams-ts-search/main.ts#main",
              "reactive-streams-ts-search/stream.ts#Stream.pipe"
            ]
          },
          "trace": [
            {
              "at": "reactive-streams-ts-search/main.ts#main",
              "say": "main() chains three operators onto the keystroke stream. So far nothing runs: we only built a recipe."
            },
            {
              "at": "reactive-streams-ts-search/stream.ts#Stream.pipe",
              "say": "pipe() just calls the operator with this stream and returns the new stream it makes."
            },
            {
              "at": "reactive-streams-ts-search/stream.ts#Stream.subscribe",
              "say": "subscribe(search) starts the chain. debounce subscribes to filter, filter to map, map to the keyboard."
            },
            {
              "at": "reactive-streams-ts-search/keyboard.ts#typing",
              "say": "The source emits the box's text after every keystroke and returns a cleanup that cancels the timers."
            },
            {
              "at": "reactive-streams-ts-search/operators.ts#map",
              "say": "map trims every value on its way through. Same number of values out as in."
            },
            {
              "at": "reactive-streams-ts-search/operators.ts#filter",
              "say": "filter drops queries shorter than 3 characters, so 're' never reaches the server."
            },
            {
              "at": "reactive-streams-ts-search/operators.ts#debounce",
              "say": "debounce restarts a timer on each value and only emits after 200 ms of quiet: a burst of typing becomes one query."
            },
            {
              "at": "reactive-streams-ts-search/main.ts#search",
              "say": "The subscriber runs just twice: 'react' and 'react hooks'. Calling stop() later would cancel every timer."
            }
          ],
          "files": {
            "reactive-streams-ts-search/keyboard.ts": "import { Stream } from './stream';\n\n// Simulates a user typing into a search box: one value per keystroke, a pause after each word.\nexport function typing(words: string[]): Stream<string> {\n  return new Stream<string>(emit => {\n    const timers: ReturnType<typeof setTimeout>[] = [];\n    let text = '';\n    let at = 0;\n    for (const word of words) {\n      for (const ch of word) {\n        at += 60;\n        timers.push(setTimeout(() => emit((text += ch)), at));\n      }\n      at += 400; // the user stops to think\n    }\n    return () => timers.forEach(t => clearTimeout(t));\n  });\n}\n",
            "reactive-streams-ts-search/main.ts": "import { typing } from './keyboard';\nimport { map, filter, debounce } from './operators';\n\nfunction search(query: string): void {\n  console.log(`searching for \"${query}\"`);\n}\n\nexport function main(): void {\n  // 13 keystrokes in, 2 searches out: \"react\" and \"react hooks\".\n  const keyStream = typing(['  re', 'act ', 'hooks']);\n  const queryStream = keyStream\n    .pipe(map(text => text.trim()))\n    .pipe(filter(text => text.length >= 3))\n    .pipe(debounce(200));\n\n  const stop = queryStream.subscribe(search);\n  setTimeout(stop, 3000);\n}\n\nmain();\n",
            "reactive-streams-ts-search/operators.ts": "import { Stream } from './stream';\n\n// Each operator takes a stream and returns a new one. The upstream is never changed.\nexport function map<T, R>(project: (value: T) => R) {\n  return (upstream: Stream<T>) => new Stream<R>(emit => upstream.subscribe(value => emit(project(value))));\n}\n\nexport function filter<T>(keep: (value: T) => boolean) {\n  return (upstream: Stream<T>) => new Stream<T>(emit => upstream.subscribe(value => {\n    if (keep(value)) emit(value);\n  }));\n}\n\n// Only let a value through after the upstream has been quiet for `ms` milliseconds.\nexport function debounce<T>(ms: number) {\n  return (upstream: Stream<T>) => new Stream<T>(emit => {\n    let timer: ReturnType<typeof setTimeout> | undefined;\n    const stop = upstream.subscribe(value => {\n      clearTimeout(timer);\n      timer = setTimeout(() => emit(value), ms);\n    });\n    return () => { clearTimeout(timer); stop(); };\n  });\n}\n",
            "reactive-streams-ts-search/stream.ts": "export type Listener<T> = (value: T) => void;\nexport type Unsubscribe = () => void;\n\n// A Stream is a source of values over time. Nothing runs until someone subscribes.\nexport class Stream<T> {\n  constructor(private start: (emit: Listener<T>) => Unsubscribe) {}\n\n  subscribe(listener: Listener<T>): Unsubscribe {\n    return this.start(listener);\n  }\n\n  // pipe() hands this stream to an operator and gets a new stream back.\n  pipe<R>(operator: (source: Stream<T>) => Stream<R>): Stream<R> {\n    return operator(this);\n  }\n}\n"
          }
        },
        {
          "id": "reactive-streams-kt-greenhouse",
          "title": "Greenhouse temperature with Kotlin Flow",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "A cold Flow of sensor readings is cleaned, smoothed with a home-made moving-average operator, de-duplicated and shown on a dashboard. Flows are coroutine-based, so the sensor's delay() suspends instead of blocking.",
          "roles": {
            "Observable": [
              "reactive-streams-kt-greenhouse/Sensors.kt#Sensors.temperatureReadings"
            ],
            "Operator": [
              "reactive-streams-kt-greenhouse/Operators.kt#Smoothing.movingAverage",
              "reactive-streams-kt-greenhouse/Operators.kt#Smoothing.isPlausible"
            ],
            "Subscriber": [
              "reactive-streams-kt-greenhouse/Dashboard.kt#Dashboard.show",
              "reactive-streams-kt-greenhouse/Dashboard.kt#Dashboard.checkHeat"
            ],
            "Subscription": [
              "reactive-streams-kt-greenhouse/Main.kt#main"
            ],
            "Pipeline": [
              "reactive-streams-kt-greenhouse/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "reactive-streams-kt-greenhouse/Main.kt#main",
              "say": "main() builds clean, smooth and display one after another. None of these lines reads the sensor yet."
            },
            {
              "at": "reactive-streams-kt-greenhouse/Main.kt#main",
              "say": "collect inside runBlocking is the subscription. Only now does the flow { } block in Sensors start running."
            },
            {
              "at": "reactive-streams-kt-greenhouse/Sensors.kt#Sensors.temperatureReadings",
              "say": "The sensor emits a reading every 100 ms. delay() suspends the coroutine, so no thread sits blocked."
            },
            {
              "at": "reactive-streams-kt-greenhouse/Operators.kt#Smoothing.isPlausible",
              "say": "The filter step asks isPlausible for each value and drops the -999 glitch before it can ruin the average."
            },
            {
              "at": "reactive-streams-kt-greenhouse/Operators.kt#Smoothing.movingAverage",
              "say": "A custom operator is just a new flow that collects upstream and emits downstream, keeping a 3-value window."
            },
            {
              "at": "reactive-streams-kt-greenhouse/Dashboard.kt#Dashboard.checkHeat",
              "say": "onEach is a side effect in the middle of the chain: above 30 °C the dashboard counts an alert."
            },
            {
              "at": "reactive-streams-kt-greenhouse/Dashboard.kt#Dashboard.show",
              "say": "The collector at the end shows each new average. distinctUntilChanged already skipped repeats."
            }
          ],
          "files": {
            "reactive-streams-kt-greenhouse/Dashboard.kt": "package greenhouse\n\nclass Dashboard(private val limit: Double) {\n    private var alerts = 0\n\n    fun show(average: Double) {\n        println(\"avg temperature: %.1f °C\".format(average))\n    }\n\n    fun checkHeat(average: Double) {\n        if (average > limit) {\n            alerts++\n            println(\"  open the windows! (alert #$alerts)\")\n        }\n    }\n}\n",
            "reactive-streams-kt-greenhouse/Main.kt": "package greenhouse\n\nimport kotlinx.coroutines.flow.distinctUntilChanged\nimport kotlinx.coroutines.flow.filter\nimport kotlinx.coroutines.flow.map\nimport kotlinx.coroutines.flow.onEach\nimport kotlinx.coroutines.runBlocking\n\nfun main() {\n    val dashboard = Dashboard(limit = 30.0)\n    // Building the pipeline does nothing yet: flows are lazy.\n    val clean = Sensors.temperatureReadings().filter { Smoothing.isPlausible(it) }\n    val smooth = Smoothing.movingAverage(clean, 3)\n    val display = smooth\n        .map { Math.round(it * 10) / 10.0 }\n        .distinctUntilChanged()\n        .onEach { dashboard.checkHeat(it) }\n\n    runBlocking {\n        display.collect { dashboard.show(it) } // now the sensor starts emitting\n    }\n}\n",
            "reactive-streams-kt-greenhouse/Operators.kt": "package greenhouse\n\nimport kotlinx.coroutines.flow.Flow\nimport kotlinx.coroutines.flow.flow\n\nobject Smoothing {\n    // A home-made operator: averages the last `size` values. It collects upstream and emits downstream.\n    fun movingAverage(upstream: Flow<Double>, size: Int): Flow<Double> {\n        return flow {\n            val window = ArrayDeque<Double>()\n            upstream.collect { value ->\n                window.addLast(value)\n                if (window.size > size) window.removeFirst()\n                emit(window.average())\n            }\n        }\n    }\n\n    // Sensors sometimes report -999 when a cable is loose. Drop impossible values.\n    fun isPlausible(celsius: Double): Boolean {\n        return celsius > -40.0 && celsius < 60.0\n    }\n}\n",
            "reactive-streams-kt-greenhouse/Sensors.kt": "package greenhouse\n\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.flow.Flow\nimport kotlinx.coroutines.flow.flow\n\nobject Sensors {\n    // A cold Flow: readings start only when someone collects, and start again for each collector.\n    fun temperatureReadings(): Flow<Double> {\n        val raw = listOf(21.0, 22.5, -999.0, 24.0, 27.5, 31.0, 33.5, 32.0, 29.0, 26.5)\n        return flow {\n            for (celsius in raw) {\n                delay(100) // one reading every 100 ms\n                emit(celsius)\n            }\n        }\n    }\n}\n"
          }
        },
        {
          "id": "reactive-streams-rxjs-real",
          "title": "RxJS operators: map, filter, scan, take",
          "lang": "TypeScript",
          "level": "advanced",
          "source": {
            "repo": "ReactiveX/rxjs",
            "url": "https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/map.ts",
            "license": "Apache-2.0",
            "note": "rxjs/operators/{map,filter,scan,scanInternals,take,OperatorSubscriber}.ts and rxjs/util/lift.ts are verbatim from RxJS 7.8.2 src/internal (only a source header was added; Observable, Subscriber and types live in files not included). usage.ts was written for Software City."
          },
          "story": "Real operator code from RxJS. Every operator has the same shape: operate() lifts the source, the operator subscribes to it with an OperatorSubscriber, and forwards (or transforms, or drops) each value to the next subscriber.",
          "roles": {
            "Observable": [
              "reactive-streams-rxjs-real/usage.ts#hitsFromArena"
            ],
            "Operator": [
              "reactive-streams-rxjs-real/rxjs/operators/map.ts#map",
              "reactive-streams-rxjs-real/rxjs/operators/filter.ts#filter",
              "reactive-streams-rxjs-real/rxjs/operators/scan.ts#scan",
              "reactive-streams-rxjs-real/rxjs/operators/take.ts#take",
              "reactive-streams-rxjs-real/rxjs/util/lift.ts#operate"
            ],
            "Subscriber": [
              "reactive-streams-rxjs-real/rxjs/operators/OperatorSubscriber.ts#OperatorSubscriber",
              "reactive-streams-rxjs-real/usage.ts#showScore"
            ],
            "Subscription": [
              "reactive-streams-rxjs-real/rxjs/operators/OperatorSubscriber.ts#OperatorSubscriber.unsubscribe"
            ],
            "Pipeline": [
              "reactive-streams-rxjs-real/usage.ts#run"
            ]
          },
          "trace": [
            {
              "at": "reactive-streams-rxjs-real/usage.ts#run",
              "say": "run() pipes a stream of arena hits through four real RxJS operators: only ana's hits, doubled, summed, first four totals."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/util/lift.ts#operate",
              "say": "Every operator is built with operate(): it returns a function that lifts the source into a new Observable with init as its subscribe logic."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/operators/filter.ts#filter",
              "say": "filter subscribes to its source and calls subscriber.next(value) only when the predicate is true."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/operators/OperatorSubscriber.ts#createOperatorSubscriber",
              "say": "Each operator wraps the next subscriber in an OperatorSubscriber, which routes errors and completion down the chain for free."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/operators/map.ts#map",
              "say": "map is the same shape as filter, but always forwards project(value). Operators are tiny because the plumbing is shared."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/operators/scanInternals.ts#scanInternals",
              "say": "scan keeps state across values: each hit updates the running total, which is emitted every time."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/operators/take.ts#take",
              "say": "take counts values and calls complete() after the fourth. Completion travels down to the subscriber."
            },
            {
              "at": "reactive-streams-rxjs-real/rxjs/operators/OperatorSubscriber.ts#OperatorSubscriber.unsubscribe",
              "say": "Completing unsubscribes upstream, which runs the source's teardown: clearInterval stops the arena timer."
            }
          ],
          "files": {
            "reactive-streams-rxjs-real/rxjs/operators/OperatorSubscriber.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { Subscriber } from '../Subscriber';\n\n/**\n * Creates an instance of an `OperatorSubscriber`.\n * @param destination The downstream subscriber.\n * @param onNext Handles next values, only called if this subscriber is not stopped or closed. Any\n * error that occurs in this function is caught and sent to the `error` method of this subscriber.\n * @param onError Handles errors from the subscription, any errors that occur in this handler are caught\n * and send to the `destination` error handler.\n * @param onComplete Handles completion notification from the subscription. Any errors that occur in\n * this handler are sent to the `destination` error handler.\n * @param onFinalize Additional teardown logic here. This will only be called on teardown if the\n * subscriber itself is not already closed. This is called after all other teardown logic is executed.\n */\nexport function createOperatorSubscriber<T>(\n  destination: Subscriber<any>,\n  onNext?: (value: T) => void,\n  onComplete?: () => void,\n  onError?: (err: any) => void,\n  onFinalize?: () => void\n): Subscriber<T> {\n  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);\n}\n\n/**\n * A generic helper for allowing operators to be created with a Subscriber and\n * use closures to capture necessary state from the operator function itself.\n */\nexport class OperatorSubscriber<T> extends Subscriber<T> {\n  /**\n   * Creates an instance of an `OperatorSubscriber`.\n   * @param destination The downstream subscriber.\n   * @param onNext Handles next values, only called if this subscriber is not stopped or closed. Any\n   * error that occurs in this function is caught and sent to the `error` method of this subscriber.\n   * @param onError Handles errors from the subscription, any errors that occur in this handler are caught\n   * and send to the `destination` error handler.\n   * @param onComplete Handles completion notification from the subscription. Any errors that occur in\n   * this handler are sent to the `destination` error handler.\n   * @param onFinalize Additional finalization logic here. This will only be called on finalization if the\n   * subscriber itself is not already closed. This is called after all other finalization logic is executed.\n   * @param shouldUnsubscribe An optional check to see if an unsubscribe call should truly unsubscribe.\n   * NOTE: This currently **ONLY** exists to support the strange behavior of {@link groupBy}, where unsubscription\n   * to the resulting observable does not actually disconnect from the source if there are active subscriptions\n   * to any grouped observable. (DO NOT EXPOSE OR USE EXTERNALLY!!!)\n   */\n  constructor(\n    destination: Subscriber<any>,\n    onNext?: (value: T) => void,\n    onComplete?: () => void,\n    onError?: (err: any) => void,\n    private onFinalize?: () => void,\n    private shouldUnsubscribe?: () => boolean\n  ) {\n    // It's important - for performance reasons - that all of this class's\n    // members are initialized and that they are always initialized in the same\n    // order. This will ensure that all OperatorSubscriber instances have the\n    // same hidden class in V8. This, in turn, will help keep the number of\n    // hidden classes involved in property accesses within the base class as\n    // low as possible. If the number of hidden classes involved exceeds four,\n    // the property accesses will become megamorphic and performance penalties\n    // will be incurred - i.e. inline caches won't be used.\n    //\n    // The reasons for ensuring all instances have the same hidden class are\n    // further discussed in this blog post from Benedikt Meurer:\n    // https://benediktmeurer.de/2018/03/23/impact-of-polymorphism-on-component-based-frameworks-like-react/\n    super(destination);\n    this._next = onNext\n      ? function (this: OperatorSubscriber<T>, value: T) {\n          try {\n            onNext(value);\n          } catch (err) {\n            destination.error(err);\n          }\n        }\n      : super._next;\n    this._error = onError\n      ? function (this: OperatorSubscriber<T>, err: any) {\n          try {\n            onError(err);\n          } catch (err) {\n            // Send any errors that occur down stream.\n            destination.error(err);\n          } finally {\n            // Ensure finalization.\n            this.unsubscribe();\n          }\n        }\n      : super._error;\n    this._complete = onComplete\n      ? function (this: OperatorSubscriber<T>) {\n          try {\n            onComplete();\n          } catch (err) {\n            // Send any errors that occur down stream.\n            destination.error(err);\n          } finally {\n            // Ensure finalization.\n            this.unsubscribe();\n          }\n        }\n      : super._complete;\n  }\n\n  unsubscribe() {\n    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {\n      const { closed } = this;\n      super.unsubscribe();\n      // Execute additional teardown if we have any and we didn't already do so.\n      !closed && this.onFinalize?.();\n    }\n  }\n}\n",
            "reactive-streams-rxjs-real/rxjs/operators/filter.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { OperatorFunction, MonoTypeOperatorFunction, TruthyTypesOf } from '../types';\nimport { operate } from '../util/lift';\nimport { createOperatorSubscriber } from './OperatorSubscriber';\n\n/** @deprecated Use a closure instead of a `thisArg`. Signatures accepting a `thisArg` will be removed in v8. */\nexport function filter<T, S extends T, A>(predicate: (this: A, value: T, index: number) => value is S, thisArg: A): OperatorFunction<T, S>;\nexport function filter<T, S extends T>(predicate: (value: T, index: number) => value is S): OperatorFunction<T, S>;\nexport function filter<T>(predicate: BooleanConstructor): OperatorFunction<T, TruthyTypesOf<T>>;\n/** @deprecated Use a closure instead of a `thisArg`. Signatures accepting a `thisArg` will be removed in v8. */\nexport function filter<T, A>(predicate: (this: A, value: T, index: number) => boolean, thisArg: A): MonoTypeOperatorFunction<T>;\nexport function filter<T>(predicate: (value: T, index: number) => boolean): MonoTypeOperatorFunction<T>;\n\n/**\n * Filter items emitted by the source Observable by only emitting those that\n * satisfy a specified predicate.\n *\n * <span class=\"informal\">Like\n * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),\n * it only emits a value from the source if it passes a criterion function.</span>\n *\n * ![](filter.png)\n *\n * Similar to the well-known `Array.prototype.filter` method, this operator\n * takes values from the source Observable, passes them through a `predicate`\n * function and only emits those values that yielded `true`.\n *\n * ## Example\n *\n * Emit only click events whose target was a DIV element\n *\n * ```ts\n * import { fromEvent, filter } from 'rxjs';\n *\n * const div = document.createElement('div');\n * div.style.cssText = 'width: 200px; height: 200px; background: #09c;';\n * document.body.appendChild(div);\n *\n * const clicks = fromEvent(document, 'click');\n * const clicksOnDivs = clicks.pipe(filter(ev => (<HTMLElement>ev.target).tagName === 'DIV'));\n * clicksOnDivs.subscribe(x => console.log(x));\n * ```\n *\n * @see {@link distinct}\n * @see {@link distinctUntilChanged}\n * @see {@link distinctUntilKeyChanged}\n * @see {@link ignoreElements}\n * @see {@link partition}\n * @see {@link skip}\n *\n * @param predicate A function that\n * evaluates each value emitted by the source Observable. If it returns `true`,\n * the value is emitted, if `false` the value is not passed to the output\n * Observable. The `index` parameter is the number `i` for the i-th source\n * emission that has happened since the subscription, starting from the number\n * `0`.\n * @param thisArg An optional argument to determine the value of `this`\n * in the `predicate` function.\n * @return A function that returns an Observable that emits items from the\n * source Observable that satisfy the specified `predicate`.\n */\nexport function filter<T>(predicate: (value: T, index: number) => boolean, thisArg?: any): MonoTypeOperatorFunction<T> {\n  return operate((source, subscriber) => {\n    // An index passed to our predicate function on each call.\n    let index = 0;\n\n    // Subscribe to the source, all errors and completions are\n    // forwarded to the consumer.\n    source.subscribe(\n      // Call the predicate with the appropriate `this` context,\n      // if the predicate returns `true`, then send the value\n      // to the consumer.\n      createOperatorSubscriber(subscriber, (value) => predicate.call(thisArg, value, index++) && subscriber.next(value))\n    );\n  });\n}\n",
            "reactive-streams-rxjs-real/rxjs/operators/map.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/map.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { OperatorFunction } from '../types';\nimport { operate } from '../util/lift';\nimport { createOperatorSubscriber } from './OperatorSubscriber';\n\nexport function map<T, R>(project: (value: T, index: number) => R): OperatorFunction<T, R>;\n/** @deprecated Use a closure instead of a `thisArg`. Signatures accepting a `thisArg` will be removed in v8. */\nexport function map<T, R, A>(project: (this: A, value: T, index: number) => R, thisArg: A): OperatorFunction<T, R>;\n\n/**\n * Applies a given `project` function to each value emitted by the source\n * Observable, and emits the resulting values as an Observable.\n *\n * <span class=\"informal\">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),\n * it passes each source value through a transformation function to get\n * corresponding output values.</span>\n *\n * ![](map.png)\n *\n * Similar to the well known `Array.prototype.map` function, this operator\n * applies a projection to each value and emits that projection in the output\n * Observable.\n *\n * ## Example\n *\n * Map every click to the `clientX` position of that click\n *\n * ```ts\n * import { fromEvent, map } from 'rxjs';\n *\n * const clicks = fromEvent<PointerEvent>(document, 'click');\n * const positions = clicks.pipe(map(ev => ev.clientX));\n *\n * positions.subscribe(x => console.log(x));\n * ```\n *\n * @see {@link mapTo}\n * @see {@link pluck}\n *\n * @param project The function to apply to each `value` emitted by the source\n * Observable. The `index` parameter is the number `i` for the i-th emission\n * that has happened since the subscription, starting from the number `0`.\n * @param thisArg An optional argument to define what `this` is in the\n * `project` function.\n * @return A function that returns an Observable that emits the values from the\n * source Observable transformed by the given `project` function.\n */\nexport function map<T, R>(project: (value: T, index: number) => R, thisArg?: any): OperatorFunction<T, R> {\n  return operate((source, subscriber) => {\n    // The index of the value from the source. Used with projection.\n    let index = 0;\n    // Subscribe to the source, all errors and completions are sent along\n    // to the consumer.\n    source.subscribe(\n      createOperatorSubscriber(subscriber, (value: T) => {\n        // Call the projection function with the appropriate this context,\n        // and send the resulting value to the consumer.\n        subscriber.next(project.call(thisArg, value, index++));\n      })\n    );\n  });\n}\n",
            "reactive-streams-rxjs-real/rxjs/operators/scan.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/scan.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { OperatorFunction } from '../types';\nimport { operate } from '../util/lift';\nimport { scanInternals } from './scanInternals';\n\nexport function scan<V, A = V>(accumulator: (acc: A | V, value: V, index: number) => A): OperatorFunction<V, V | A>;\nexport function scan<V, A>(accumulator: (acc: A, value: V, index: number) => A, seed: A): OperatorFunction<V, A>;\nexport function scan<V, A, S>(accumulator: (acc: A | S, value: V, index: number) => A, seed: S): OperatorFunction<V, A>;\n\n// TODO: link to a \"redux pattern\" section in the guide (location TBD)\n\n/**\n * Useful for encapsulating and managing state. Applies an accumulator (or \"reducer function\")\n * to each value from the source after an initial state is established -- either via\n * a `seed` value (second argument), or from the first value from the source.\n *\n * <span class=\"informal\">It's like {@link reduce}, but emits the current\n * accumulation state after each update</span>\n *\n * ![](scan.png)\n *\n * This operator maintains an internal state and emits it after processing each value as follows:\n *\n * 1. First value arrives\n *   - If a `seed` value was supplied (as the second argument to `scan`), let `state = seed` and `value = firstValue`.\n *   - If NO `seed` value was supplied (no second argument), let `state = firstValue` and go to 3.\n * 2. Let `state = accumulator(state, value)`.\n *   - If an error is thrown by `accumulator`, notify the consumer of an error. The process ends.\n * 3. Emit `state`.\n * 4. Next value arrives, let `value = nextValue`, go to 2.\n *\n * ## Examples\n *\n * An average of previous numbers. This example shows how\n * not providing a `seed` can prime the stream with the\n * first value from the source.\n *\n * ```ts\n * import { of, scan, map } from 'rxjs';\n *\n * const numbers$ = of(1, 2, 3);\n *\n * numbers$\n *   .pipe(\n *     // Get the sum of the numbers coming in.\n *     scan((total, n) => total + n),\n *     // Get the average by dividing the sum by the total number\n *     // received so far (which is 1 more than the zero-based index).\n *     map((sum, index) => sum / (index + 1))\n *   )\n *   .subscribe(console.log);\n * ```\n *\n * The Fibonacci sequence. This example shows how you can use\n * a seed to prime accumulation process. Also... you know... Fibonacci.\n * So important to like, computers and stuff that its whiteboarded\n * in job interviews. Now you can show them the Rx version! (Please don't, haha)\n *\n * ```ts\n * import { interval, scan, map, startWith } from 'rxjs';\n *\n * const firstTwoFibs = [0, 1];\n * // An endless stream of Fibonacci numbers.\n * const fibonacci$ = interval(1000).pipe(\n *   // Scan to get the fibonacci numbers (after 0, 1)\n *   scan(([a, b]) => [b, a + b], firstTwoFibs),\n *   // Get the second number in the tuple, it's the one you calculated\n *   map(([, n]) => n),\n *   // Start with our first two digits :)\n *   startWith(...firstTwoFibs)\n * );\n *\n * fibonacci$.subscribe(console.log);\n * ```\n *\n * @see {@link expand}\n * @see {@link mergeScan}\n * @see {@link reduce}\n * @see {@link switchScan}\n *\n * @param accumulator A \"reducer function\". This will be called for each value after an initial state is\n * acquired.\n * @param seed The initial state. If this is not provided, the first value from the source will\n * be used as the initial state, and emitted without going through the accumulator. All subsequent values\n * will be processed by the accumulator function. If this is provided, all values will go through\n * the accumulator function.\n * @return A function that returns an Observable of the accumulated values.\n */\nexport function scan<V, A, S>(accumulator: (acc: V | A | S, value: V, index: number) => A, seed?: S): OperatorFunction<V, V | A> {\n  // providing a seed of `undefined` *should* be valid and trigger\n  // hasSeed! so don't use `seed !== undefined` checks!\n  // For this reason, we have to check it here at the original call site\n  // otherwise inside Operator/Subscriber we won't know if `undefined`\n  // means they didn't provide anything or if they literally provided `undefined`\n  return operate(scanInternals(accumulator, seed as S, arguments.length >= 2, true));\n}\n",
            "reactive-streams-rxjs-real/rxjs/operators/scanInternals.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/scanInternals.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { Observable } from '../Observable';\nimport { Subscriber } from '../Subscriber';\nimport { createOperatorSubscriber } from './OperatorSubscriber';\n\n/**\n * A basic scan operation. This is used for `scan` and `reduce`.\n * @param accumulator The accumulator to use\n * @param seed The seed value for the state to accumulate\n * @param hasSeed Whether or not a seed was provided\n * @param emitOnNext Whether or not to emit the state on next\n * @param emitBeforeComplete Whether or not to emit the before completion\n */\n\nexport function scanInternals<V, A, S>(\n  accumulator: (acc: V | A | S, value: V, index: number) => A,\n  seed: S,\n  hasSeed: boolean,\n  emitOnNext: boolean,\n  emitBeforeComplete?: undefined | true\n) {\n  return (source: Observable<V>, subscriber: Subscriber<any>) => {\n    // Whether or not we have state yet. This will only be\n    // false before the first value arrives if we didn't get\n    // a seed value.\n    let hasState = hasSeed;\n    // The state that we're tracking, starting with the seed,\n    // if there is one, and then updated by the return value\n    // from the accumulator on each emission.\n    let state: any = seed;\n    // An index to pass to the accumulator function.\n    let index = 0;\n\n    // Subscribe to our source. All errors and completions are passed through.\n    source.subscribe(\n      createOperatorSubscriber(\n        subscriber,\n        (value) => {\n          // Always increment the index.\n          const i = index++;\n          // Set the state\n          state = hasState\n            ? // We already have state, so we can get the new state from the accumulator\n              accumulator(state, value, i)\n            : // We didn't have state yet, a seed value was not provided, so\n\n              // we set the state to the first value, and mark that we have state now\n              ((hasState = true), value);\n\n          // Maybe send it to the consumer.\n          emitOnNext && subscriber.next(state);\n        },\n        // If an onComplete was given, call it, otherwise\n        // just pass through the complete notification to the consumer.\n        emitBeforeComplete &&\n          (() => {\n            hasState && subscriber.next(state);\n            subscriber.complete();\n          })\n      )\n    );\n  };\n}\n",
            "reactive-streams-rxjs-real/rxjs/operators/take.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/take.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { MonoTypeOperatorFunction } from '../types';\nimport { EMPTY } from '../observable/empty';\nimport { operate } from '../util/lift';\nimport { createOperatorSubscriber } from './OperatorSubscriber';\n\n/**\n * Emits only the first `count` values emitted by the source Observable.\n *\n * <span class=\"informal\">Takes the first `count` values from the source, then\n * completes.</span>\n *\n * ![](take.png)\n *\n * `take` returns an Observable that emits only the first `count` values emitted\n * by the source Observable. If the source emits fewer than `count` values then\n * all of its values are emitted. After that, it completes, regardless if the\n * source completes.\n *\n * ## Example\n *\n * Take the first 5 seconds of an infinite 1-second interval Observable\n *\n * ```ts\n * import { interval, take } from 'rxjs';\n *\n * const intervalCount = interval(1000);\n * const takeFive = intervalCount.pipe(take(5));\n * takeFive.subscribe(x => console.log(x));\n *\n * // Logs:\n * // 0\n * // 1\n * // 2\n * // 3\n * // 4\n * ```\n *\n * @see {@link takeLast}\n * @see {@link takeUntil}\n * @see {@link takeWhile}\n * @see {@link skip}\n *\n * @param count The maximum number of `next` values to emit.\n * @return A function that returns an Observable that emits only the first\n * `count` values emitted by the source Observable, or all of the values from\n * the source if the source emits fewer than `count` values.\n */\nexport function take<T>(count: number): MonoTypeOperatorFunction<T> {\n  return count <= 0\n    ? // If we are taking no values, that's empty.\n      () => EMPTY\n    : operate((source, subscriber) => {\n        let seen = 0;\n        source.subscribe(\n          createOperatorSubscriber(subscriber, (value) => {\n            // Increment the number of values we have seen,\n            // then check it against the allowed count to see\n            // if we are still letting values through.\n            if (++seen <= count) {\n              subscriber.next(value);\n              // If we have met or passed our allowed count,\n              // we need to complete. We have to do <= here,\n              // because re-entrant code will increment `seen` twice.\n              if (count <= seen) {\n                subscriber.complete();\n              }\n            }\n          })\n        );\n      });\n}\n",
            "reactive-streams-rxjs-real/rxjs/util/lift.ts": "/**\n * Source: RxJS 7.8.2 — https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/util/lift.ts\n * Apache License 2.0, Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors. Included verbatim for study.\n */\nimport { Observable } from '../Observable';\nimport { Subscriber } from '../Subscriber';\nimport { OperatorFunction } from '../types';\nimport { isFunction } from './isFunction';\n\n/**\n * Used to determine if an object is an Observable with a lift function.\n */\nexport function hasLift(source: any): source is { lift: InstanceType<typeof Observable>['lift'] } {\n  return isFunction(source?.lift);\n}\n\n/**\n * Creates an `OperatorFunction`. Used to define operators throughout the library in a concise way.\n * @param init The logic to connect the liftedSource to the subscriber at the moment of subscription.\n */\nexport function operate<T, R>(\n  init: (liftedSource: Observable<T>, subscriber: Subscriber<R>) => (() => void) | void\n): OperatorFunction<T, R> {\n  return (source: Observable<T>) => {\n    if (hasLift(source)) {\n      return source.lift(function (this: Subscriber<R>, liftedSource: Observable<T>) {\n        try {\n          return init(liftedSource, this);\n        } catch (err) {\n          this.error(err);\n        }\n      });\n    }\n    throw new TypeError('Unable to lift unknown Observable type');\n  };\n}\n",
            "reactive-streams-rxjs-real/usage.ts": "// Example usage written for Software City (not part of RxJS).\n// The operators come from the copied RxJS files; Observable comes from the rxjs package itself.\nimport { Observable } from 'rxjs';\nimport { filter } from './rxjs/operators/filter';\nimport { map } from './rxjs/operators/map';\nimport { scan } from './rxjs/operators/scan';\nimport { take } from './rxjs/operators/take';\n\ninterface Hit {\n  player: string;\n  points: number;\n}\n\n// A source: every 100 ms someone in the arena scores a hit.\nfunction hitsFromArena(): Observable<Hit> {\n  return new Observable<Hit>(subscriber => {\n    const hits: Hit[] = [{ player: 'ana', points: 5 }, { player: 'ben', points: 3 }, { player: 'ana', points: 8 }];\n    let i = 0;\n    const timer = setInterval(() => subscriber.next(hits[i++ % hits.length]), 100);\n    return () => clearInterval(timer); // teardown runs when take() completes\n  });\n}\n\nfunction showScore(total: number): void {\n  console.log(`ana's score: ${total}`);\n}\n\nexport function run(): void {\n  hitsFromArena()\n    .pipe(\n      filter(hit => hit.player === 'ana'),\n      map(hit => hit.points * 2),\n      scan((total, points) => total + points, 0),\n      take(4)\n    )\n    .subscribe({ next: showScore, complete: () => console.log('round over') });\n}\n\nrun();\n"
          }
        }
      ]
    },
    {
      "id": "locks-and-races",
      "name": "Locks and Race Conditions",
      "family": "Concurrency",
      "aka": [
        "Mutex",
        "Critical section",
        "Data race",
        "Atomics",
        "Deadlock"
      ],
      "tagline": "When threads share mutable data, guard every check-then-act with a lock or an atomic step.",
      "intent": "A race condition happens when the result depends on how threads happen to interleave, typically when one thread checks a shared value and another changes it before the first one acts. A mutex makes a block of code a critical section that only one thread can run at a time, and atomic operations make a single read-modify-write indivisible; taking several locks in a fixed order avoids deadlock.",
      "analogy": "A single-person bathroom with a lock: checking 'is it free?' and walking in must be one action, otherwise two people both see 'free' and walk in. And if two people each hold one of two keys and wait for the other's, nobody ever gets in: that is a deadlock.",
      "cityShape": "Look at the shared-variable antennas (tickets_left, sold, config) on the roofs: several amber writer pipes from different floors land on the same antenna. In the buggy district nothing stands between those floors; in the fixed district the same floors are there, but every write happens inside the lock or once.Do. The buggy/ and fixed/ folders sit side by side as two districts so you can compare them.",
      "roles": [
        {
          "name": "Shared State",
          "desc": "Mutable data that more than one thread reads and writes: a counter, a balance, a lazily created object."
        },
        {
          "name": "Critical Section",
          "desc": "The lines that must run without interruption, usually a check followed by an update."
        },
        {
          "name": "Guard",
          "desc": "What makes the critical section safe: a mutex/lock, an atomic operation, or a once/lazy initialiser."
        },
        {
          "name": "Thread",
          "desc": "The concurrent workers (threads, goroutines) whose unlucky timing exposes the race."
        }
      ],
      "whenToUse": [
        "Several threads update the same counter, collection, cache or balance.",
        "Lazy initialisation that may be triggered from more than one thread at the same time.",
        "Any 'if the value is X then change it' logic on data that other threads can change in between.",
        "Operations that must update two things together (move money between two accounts) so nobody sees a half-done state."
      ],
      "pitfalls": [
        "Locking only the write is not enough; the check and the act must sit in the same critical section.",
        "Taking two locks in different orders in different threads causes deadlock; agree on one global order.",
        "Holding a lock while doing slow work (I/O, sleeping, calling unknown code) serialises everything; keep critical sections short, or avoid sharing with actors or queues."
      ],
      "related": [
        "actor-model",
        "worker-pool",
        "singleton",
        "producer-consumer"
      ],
      "quiz": [
        {
          "q": "Two threads run `if tickets_left > 0: tickets_left -= 1` when tickets_left is 1. Without a lock, what can happen?",
          "options": [
            "Only one ticket can ever be sold, Python guarantees it",
            "Both see 1, both decrement, and tickets_left ends at -1",
            "The program always crashes",
            "The second thread waits automatically"
          ],
          "answer": 1,
          "why": "Between the check and the decrement the other thread may run its own check. Both checks pass, so the ticket is sold twice. The check and the act must be inside one lock."
        },
        {
          "q": "Thread A locks account 1 then 2; thread B locks account 2 then 1. What is the simplest reliable fix?",
          "options": [
            "Add a sleep between the two locks",
            "Make every thread lock the lower account id first",
            "Use more threads",
            "Unlock and retry when it seems stuck"
          ],
          "answer": 1,
          "why": "A deadlock needs a cycle of threads each waiting for a lock held by the next. If everyone takes locks in the same global order, no cycle can form."
        }
      ],
      "demos": [
        {
          "id": "locks-and-races-py-tickets",
          "title": "Overselling concert tickets",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Eight seller threads compete for 100 tickets. In buggy/ the check and the decrement are separate steps, so the box office often sells 105 or more tickets. fixed/ is the same code with one threading.Lock around check-and-act.",
          "roles": {
            "Shared State": [
              "locks-and-races-py-tickets/buggy/box_office.py#tickets_left",
              "locks-and-races-py-tickets/buggy/box_office.py#sold",
              "locks-and-races-py-tickets/fixed/box_office.py#tickets_left"
            ],
            "Critical Section": [
              "locks-and-races-py-tickets/buggy/box_office.py#sell_online",
              "locks-and-races-py-tickets/fixed/box_office.py#sell_online",
              "locks-and-races-py-tickets/fixed/box_office.py#sell_at_counter"
            ],
            "Guard": [
              "locks-and-races-py-tickets/fixed/box_office.py#lock"
            ],
            "Thread": [
              "locks-and-races-py-tickets/buggy/main.py#run_sale",
              "locks-and-races-py-tickets/fixed/main.py#run_sale"
            ]
          },
          "trace": [
            {
              "at": "locks-and-races-py-tickets/buggy/main.py#run_sale",
              "say": "Eight threads want 50 tickets each, but only 100 exist. They all start at the same time."
            },
            {
              "at": "locks-and-races-py-tickets/buggy/box_office.py#sell_online",
              "say": "A seller checks tickets_left > 0. Before it decrements, sleep(0) lets another thread run and pass the same check."
            },
            {
              "at": "locks-and-races-py-tickets/buggy/box_office.py#sell_at_counter",
              "say": "A second function writes the same antenna. Each check was true when it ran; both decrements still happen. Oversold."
            },
            {
              "at": "locks-and-races-py-tickets/buggy/box_office.py#report",
              "say": "Typical result: 'sold 107, left -7'. The bug only shows under unlucky timing, which is why races are hard to test."
            },
            {
              "at": "locks-and-races-py-tickets/fixed/box_office.py#sell_online",
              "say": "Fixed: 'with lock' wraps the check AND the decrement. Only one thread at a time can be between them."
            },
            {
              "at": "locks-and-races-py-tickets/fixed/box_office.py#sell_at_counter",
              "say": "Every writer must use the same lock. One unguarded writer would bring the race straight back."
            },
            {
              "at": "locks-and-races-py-tickets/fixed/box_office.py#report",
              "say": "Now it is always 'sold 100, left 0', however the threads are scheduled."
            }
          ],
          "files": {
            "locks-and-races-py-tickets/buggy/box_office.py": "import time\n\n# Shared state: every selling thread reads and writes these two numbers.\ntickets_left = 100\nsold = 0\n\n\ndef sell_online(count):\n    global tickets_left, sold\n    for _ in range(count):\n        if tickets_left > 0:  # 1. check ...\n            time.sleep(0)  # (another thread may run right here)\n            tickets_left -= 1  # 2. ... then act. Too late: the check may be stale.\n            sold += 1\n\n\ndef sell_at_counter(count):\n    global tickets_left, sold\n    for _ in range(count):\n        if tickets_left > 0:\n            time.sleep(0)\n            tickets_left -= 1\n            sold += 1\n\n\ndef report():\n    return f\"sold {sold}, left {tickets_left}\"\n",
            "locks-and-races-py-tickets/buggy/main.py": "import threading\n\nfrom .box_office import sell_online, sell_at_counter, report\n\n\ndef run_sale():\n    # 8 sellers want 50 tickets each, but only 100 exist.\n    sellers = [threading.Thread(target=lambda: sell_online(50)) for _ in range(4)]\n    sellers += [threading.Thread(target=lambda: sell_at_counter(50)) for _ in range(4)]\n    for s in sellers:\n        s.start()\n    for s in sellers:\n        s.join()\n    print(report())  # often: sold 107, left -7\n\n\nif __name__ == \"__main__\":\n    run_sale()\n",
            "locks-and-races-py-tickets/fixed/box_office.py": "import threading\nimport time\n\n# Same shared state, now guarded by one lock.\ntickets_left = 100\nsold = 0\nlock = threading.Lock()\n\n\ndef sell_online(count):\n    global tickets_left, sold\n    for _ in range(count):\n        with lock:  # only one thread at a time may check AND act\n            if tickets_left > 0:\n                time.sleep(0)  # a thread switch here is now harmless\n                tickets_left -= 1\n                sold += 1\n\n\ndef sell_at_counter(count):\n    global tickets_left, sold\n    for _ in range(count):\n        with lock:\n            if tickets_left > 0:\n                time.sleep(0)\n                tickets_left -= 1\n                sold += 1\n\n\ndef report():\n    return f\"sold {sold}, left {tickets_left}\"\n",
            "locks-and-races-py-tickets/fixed/main.py": "import threading\n\nfrom .box_office import sell_online, sell_at_counter, report\n\n\ndef run_sale():\n    # 8 sellers want 50 tickets each, but only 100 exist.\n    sellers = [threading.Thread(target=lambda: sell_online(50)) for _ in range(4)]\n    sellers += [threading.Thread(target=lambda: sell_at_counter(50)) for _ in range(4)]\n    for s in sellers:\n        s.start()\n    for s in sellers:\n        s.join()\n    print(report())  # always: sold 100, left 0\n\n\nif __name__ == \"__main__\":\n    run_sale()\n"
          }
        },
        {
          "id": "locks-and-races-rs-bank",
          "title": "A bank-transfer deadlock in Rust",
          "lang": "Rust",
          "level": "intermediate",
          "source": null,
          "story": "Rust refuses plain shared mutable data at compile time, so each balance sits in a Mutex and the transfer counter is an AtomicU64. That stops data races, but not deadlock: buggy/ hangs forever, fixed/ locks in id order.",
          "roles": {
            "Shared State": [
              "locks-and-races-rs-bank/buggy/bank.rs#Account",
              "locks-and-races-rs-bank/buggy/bank.rs#TRANSFERS"
            ],
            "Critical Section": [
              "locks-and-races-rs-bank/buggy/bank.rs#transfer",
              "locks-and-races-rs-bank/fixed/bank.rs#transfer_in_order"
            ],
            "Guard": [
              "locks-and-races-rs-bank/fixed/bank.rs#transfer_in_order",
              "locks-and-races-rs-bank/fixed/bank.rs#TRANSFERS"
            ],
            "Thread": [
              "locks-and-races-rs-bank/buggy/main.rs#main",
              "locks-and-races-rs-bank/fixed/main.rs#main"
            ]
          },
          "trace": [
            {
              "at": "locks-and-races-rs-bank/buggy/main.rs#main",
              "say": "Two threads transfer at once in opposite directions: alice to bob, and bob to alice. Arc shares the accounts between them."
            },
            {
              "at": "locks-and-races-rs-bank/buggy/bank.rs#transfer",
              "say": "Thread 1 locks alice and sleeps; thread 2 locks bob. Now each asks for the lock the other holds. Neither can ever continue."
            },
            {
              "at": "locks-and-races-rs-bank/buggy/main.rs#main",
              "say": "join() waits forever. No crash and no error message: a deadlock just stops progress, which makes it hard to spot."
            },
            {
              "at": "locks-and-races-rs-bank/fixed/main.rs#main",
              "say": "The fixed district runs the same two opposite transfers at the same moment."
            },
            {
              "at": "locks-and-races-rs-bank/fixed/bank.rs#transfer_in_order",
              "say": "Both threads lock the lower id first. Whoever gets account 1 also gets 2; the other simply waits its turn. No cycle, no deadlock."
            },
            {
              "at": "locks-and-races-rs-bank/fixed/bank.rs#transfer_in_order",
              "say": "TRANSFERS.fetch_add is atomic: one indivisible step, so this counter needs no Mutex at all."
            },
            {
              "at": "locks-and-races-rs-bank/fixed/main.rs#print_totals",
              "say": "alice 80, bob 120, total 200: money is neither lost nor created, and both transfers were counted."
            }
          ],
          "files": {
            "locks-and-races-rs-bank/buggy/bank.rs": "use std::sync::atomic::{AtomicU64, Ordering};\nuse std::sync::Mutex;\nuse std::thread;\nuse std::time::Duration;\n\n// Each account guards its own balance with its own Mutex.\npub struct Account {\n    pub id: u32,\n    pub balance: Mutex<i64>,\n}\n\n// An atomic counter: fetch_add is one indivisible step, so no lock is needed for it.\npub static TRANSFERS: AtomicU64 = AtomicU64::new(0);\n\n// BUG: always locks `from` first, then `to`.\n// Thread 1 moves alice -> bob and holds alice; thread 2 moves bob -> alice and holds bob.\n// Each now waits for the lock the other one holds: a deadlock. Both threads hang forever.\npub fn transfer(from: &Account, to: &Account, amount: i64) {\n    let mut from_balance = from.balance.lock().unwrap();\n    thread::sleep(Duration::from_millis(10)); // makes the bad timing very likely\n    let mut to_balance = to.balance.lock().unwrap();\n    *from_balance -= amount;\n    *to_balance += amount;\n    TRANSFERS.fetch_add(1, Ordering::Relaxed);\n}\n",
            "locks-and-races-rs-bank/buggy/main.rs": "mod bank;\n\nuse bank::{transfer, Account, TRANSFERS};\nuse std::sync::atomic::Ordering;\nuse std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let alice = Arc::new(Account { id: 1, balance: Mutex::new(100) });\n    let bob = Arc::new(Account { id: 2, balance: Mutex::new(100) });\n\n    // Two transfers in opposite directions, at the same time.\n    let (a1, b1) = (alice.clone(), bob.clone());\n    let t1 = thread::spawn(move || transfer(&a1, &b1, 30));\n    let (a2, b2) = (alice.clone(), bob.clone());\n    let t2 = thread::spawn(move || transfer(&b2, &a2, 10));\n\n    t1.join().unwrap(); // buggy version: usually never returns\n    t2.join().unwrap();\n    print_totals(&alice, &bob);\n}\n\n// Note: Rust would not even compile a plain `let mut total = 0;` shared by two threads.\n// Shared mutable data must go through a Mutex or an atomic, which is why races here are about locking order.\nfn print_totals(alice: &Account, bob: &Account) {\n    let a = *alice.balance.lock().unwrap();\n    let b = *bob.balance.lock().unwrap();\n    println!(\"alice {a}, bob {b}, total {}, transfers {}\", a + b, TRANSFERS.load(Ordering::Relaxed));\n}\n",
            "locks-and-races-rs-bank/fixed/bank.rs": "use std::sync::atomic::{AtomicU64, Ordering};\nuse std::sync::Mutex;\nuse std::thread;\nuse std::time::Duration;\n\n// Each account guards its own balance with its own Mutex.\npub struct Account {\n    pub id: u32,\n    pub balance: Mutex<i64>,\n}\n\n// An atomic counter: fetch_add is one indivisible step, so no lock is needed for it.\npub static TRANSFERS: AtomicU64 = AtomicU64::new(0);\n\n// FIX: every thread locks the account with the lower id first.\n// With one global order, nobody can hold \"the second lock\" while waiting for \"the first\",\n// so a waiting cycle can never form.\npub fn transfer_in_order(from: &Account, to: &Account, amount: i64) {\n    let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };\n    let mut first_balance = first.balance.lock().unwrap();\n    thread::sleep(Duration::from_millis(10)); // same bad timing, now harmless\n    let mut second_balance = second.balance.lock().unwrap();\n    if from.id < to.id {\n        *first_balance -= amount;\n        *second_balance += amount;\n    } else {\n        *second_balance -= amount;\n        *first_balance += amount;\n    }\n    TRANSFERS.fetch_add(1, Ordering::Relaxed);\n}\n",
            "locks-and-races-rs-bank/fixed/main.rs": "mod bank;\n\nuse bank::{transfer_in_order, Account, TRANSFERS};\nuse std::sync::atomic::Ordering;\nuse std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let alice = Arc::new(Account { id: 1, balance: Mutex::new(100) });\n    let bob = Arc::new(Account { id: 2, balance: Mutex::new(100) });\n\n    // Two transfers in opposite directions, at the same time.\n    let (a1, b1) = (alice.clone(), bob.clone());\n    let t1 = thread::spawn(move || transfer_in_order(&a1, &b1, 30));\n    let (a2, b2) = (alice.clone(), bob.clone());\n    let t2 = thread::spawn(move || transfer_in_order(&b2, &a2, 10));\n\n    t1.join().unwrap(); // fixed version: alice 80, bob 120, total 200\n    t2.join().unwrap();\n    print_totals(&alice, &bob);\n}\n\n// Note: Rust would not even compile a plain `let mut total = 0;` shared by two threads.\n// Shared mutable data must go through a Mutex or an atomic, which is why races here are about locking order.\nfn print_totals(alice: &Account, bob: &Account) {\n    let a = *alice.balance.lock().unwrap();\n    let b = *bob.balance.lock().unwrap();\n    println!(\"alice {a}, bob {b}, total {}, transfers {}\", a + b, TRANSFERS.load(Ordering::Relaxed));\n}\n"
          }
        },
        {
          "id": "locks-and-races-go-once-real",
          "title": "Go's sync.Once: lazy init without a race",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "golang/go",
            "url": "https://github.com/golang/go/blob/go1.22.0/src/sync/once.go",
            "license": "BSD-3-Clause",
            "note": "sync/once.go is verbatim from Go go1.22.0 (only a source header was added); main.go was written for Software City and uses the standard sync.Once."
          },
          "story": "Real standard-library code that combines both kinds of guard: an atomic flag for the fast path and a Mutex for the slow path. Its own comment even shows the tempting but wrong version. main.go races first, then uses Once.",
          "roles": {
            "Shared State": [
              "locks-and-races-go-once-real/main.go#config",
              "locks-and-races-go-once-real/main.go#loads"
            ],
            "Critical Section": [
              "locks-and-races-go-once-real/main.go#getConfigRacy",
              "locks-and-races-go-once-real/sync/once.go#Once.doSlow"
            ],
            "Guard": [
              "locks-and-races-go-once-real/sync/once.go#Once",
              "locks-and-races-go-once-real/sync/once.go#Once.Do"
            ],
            "Thread": [
              "locks-and-races-go-once-real/main.go#callFromManyGoroutines"
            ]
          },
          "trace": [
            {
              "at": "locks-and-races-go-once-real/main.go#main",
              "say": "main() lets 50 goroutines fetch the config, first with the racy getter, then with the sync.Once getter."
            },
            {
              "at": "locks-and-races-go-once-real/main.go#callFromManyGoroutines",
              "say": "50 goroutines start almost together, so many of them reach the 'is it loaded yet?' check at the same moment."
            },
            {
              "at": "locks-and-races-go-once-real/main.go#getConfigRacy",
              "say": "Check-then-act with no guard: several goroutines see nil and all call loadConfig. go run -race flags the unsynchronised writes."
            },
            {
              "at": "locks-and-races-go-once-real/main.go#loadConfig",
              "say": "loads.Add(1) is atomic, so the count of loads is exact even though the loading itself raced: often more than 1."
            },
            {
              "at": "locks-and-races-go-once-real/main.go#getConfig",
              "say": "The fixed getter hands the work to once.Do. The two amber pipes into config now both go through a guard."
            },
            {
              "at": "locks-and-races-go-once-real/sync/once.go#Once.Do",
              "say": "Fast path: one atomic Load of done. After the first call this is all anyone pays: no lock at all."
            },
            {
              "at": "locks-and-races-go-once-real/sync/once.go#Once.doSlow",
              "say": "Slow path: lock the Mutex, check done again, run f, and only then store done = 1. Late callers wait on the lock until f has finished."
            },
            {
              "at": "locks-and-races-go-once-real/sync/once.go#Once.Do",
              "say": "Read the comment in Do: a lone CompareAndSwap would let callers return before f finished. Atomics alone are not always enough."
            }
          ],
          "files": {
            "locks-and-races-go-once-real/main.go": "// Example usage written for Software City (not part of Go).\n// Lazy loading of a config, first with a check-then-act race, then with sync.Once.\npackage main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\t\"sync/atomic\"\n)\n\ntype Config struct {\n\tDSN string\n}\n\nvar config *Config\nvar loads atomic.Int32 // an atomic counter: safe to bump from many goroutines\nvar once sync.Once     // the sync.Once whose source is in sync/once.go\n\nfunc loadConfig() *Config {\n\tloads.Add(1)\n\treturn &Config{DSN: \"postgres://localhost/shop\"}\n}\n\n// BUG: check-then-act. Several goroutines can all see nil and all load.\n// Reading and writing config without synchronisation is also a data race (go run -race reports it).\nfunc getConfigRacy() *Config {\n\tif config == nil {\n\t\tconfig = loadConfig()\n\t}\n\treturn config\n}\n\n// FIX: once.Do runs loadConfig exactly once, and every caller waits until it has finished.\nfunc getConfig() *Config {\n\tonce.Do(func() {\n\t\tconfig = loadConfig()\n\t})\n\treturn config\n}\n\nfunc callFromManyGoroutines(get func() *Config) {\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < 50; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tget()\n\t\t}()\n\t}\n\twg.Wait()\n}\n\nfunc main() {\n\tcallFromManyGoroutines(getConfigRacy)\n\tfmt.Println(\"racy loads:\", loads.Load()) // sometimes 1, often more\n\n\tconfig = nil\n\tloads.Store(0)\n\tcallFromManyGoroutines(getConfig)\n\tfmt.Println(\"once loads:\", loads.Load()) // always 1\n}\n",
            "locks-and-races-go-once-real/sync/once.go": "// Source: Go go1.22.0 — https://github.com/golang/go/blob/go1.22.0/src/sync/once.go\n// BSD-3-Clause License, Copyright (c) 2009 The Go Authors. All rights reserved. Included verbatim for study.\n\n// Copyright 2009 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\n\npackage sync\n\nimport (\n\t\"sync/atomic\"\n)\n\n// Once is an object that will perform exactly one action.\n//\n// A Once must not be copied after first use.\n//\n// In the terminology of the Go memory model,\n// the return from f “synchronizes before”\n// the return from any call of once.Do(f).\ntype Once struct {\n\t// done indicates whether the action has been performed.\n\t// It is first in the struct because it is used in the hot path.\n\t// The hot path is inlined at every call site.\n\t// Placing done first allows more compact instructions on some architectures (amd64/386),\n\t// and fewer instructions (to calculate offset) on other architectures.\n\tdone atomic.Uint32\n\tm    Mutex\n}\n\n// Do calls the function f if and only if Do is being called for the\n// first time for this instance of Once. In other words, given\n//\n//\tvar once Once\n//\n// if once.Do(f) is called multiple times, only the first call will invoke f,\n// even if f has a different value in each invocation. A new instance of\n// Once is required for each function to execute.\n//\n// Do is intended for initialization that must be run exactly once. Since f\n// is niladic, it may be necessary to use a function literal to capture the\n// arguments to a function to be invoked by Do:\n//\n//\tconfig.once.Do(func() { config.init(filename) })\n//\n// Because no call to Do returns until the one call to f returns, if f causes\n// Do to be called, it will deadlock.\n//\n// If f panics, Do considers it to have returned; future calls of Do return\n// without calling f.\nfunc (o *Once) Do(f func()) {\n\t// Note: Here is an incorrect implementation of Do:\n\t//\n\t//\tif o.done.CompareAndSwap(0, 1) {\n\t//\t\tf()\n\t//\t}\n\t//\n\t// Do guarantees that when it returns, f has finished.\n\t// This implementation would not implement that guarantee:\n\t// given two simultaneous calls, the winner of the cas would\n\t// call f, and the second would return immediately, without\n\t// waiting for the first's call to f to complete.\n\t// This is why the slow path falls back to a mutex, and why\n\t// the o.done.Store must be delayed until after f returns.\n\n\tif o.done.Load() == 0 {\n\t\t// Outlined slow-path to allow inlining of the fast-path.\n\t\to.doSlow(f)\n\t}\n}\n\nfunc (o *Once) doSlow(f func()) {\n\to.m.Lock()\n\tdefer o.m.Unlock()\n\tif o.done.Load() == 0 {\n\t\tdefer o.done.Store(1)\n\t\tf()\n\t}\n}\n"
          }
        }
      ]
    }
  ]
};
