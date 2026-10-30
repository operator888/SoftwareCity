// Family: Foundations. 8 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Foundations"
  ],
  "patterns": [
    {
      "id": "recursion",
      "name": "Recursion",
      "family": "Foundations",
      "aka": [
        "Recursive function",
        "Divide and conquer (when the problem splits)"
      ],
      "tagline": "A function solves a big problem by calling itself on a smaller piece of it.",
      "intent": "Some problems are made of smaller copies of themselves: a folder holds folders, n! contains (n-1)!, a region of tiles is a tile plus its neighbouring regions. A recursive function answers the smallest case directly (the base case) and handles everything else by calling itself on a smaller input (the recursive case), letting the call stack remember where each call left off.",
      "analogy": "Russian nesting dolls: to count the dolls you open one, add one to the count, and ask the same question about the doll inside. When a doll does not open, you stop and the answers add up on the way back out.",
      "cityShape": "Look for floors with a yellow loop pipe that leaves the floor and comes straight back to it: that is a function calling itself. factorial and totalSize carry one loop, flood_fill and diffs are the busy ones, and the caller (main, click, count_islands) sits on another floor with a single ordinary pipe into the loop.",
      "roles": [
        {
          "name": "Base Case",
          "desc": "The input small enough to answer directly without another call. Every path through the recursion must reach it, or the call stack overflows."
        },
        {
          "name": "Recursive Case",
          "desc": "The step that splits off a smaller problem and calls the same function on it, then combines the answer."
        },
        {
          "name": "Entry Point",
          "desc": "The ordinary caller that starts the first call with the full problem and uses the final result."
        },
        {
          "name": "Recursive Data",
          "desc": "A structure that contains smaller versions of itself (tree, folder, grid region), which is why recursion fits it naturally."
        }
      ],
      "whenToUse": [
        "The data is recursive: trees, nested folders, JSON, scene trees, menus with sub-menus.",
        "The problem splits into smaller copies of itself: sorting halves, searching sub-trees, filling connected regions.",
        "Backtracking searches (mazes, puzzles, permutations) where the call stack conveniently remembers the path back."
      ],
      "pitfalls": [
        "A missing or unreachable base case recurses until the stack overflows (Python stops at about 1000 calls, GDScript and browsers not much later).",
        "Branching recursion like naive fib(n) recomputes the same sub-problems again and again; cache results (memoization) or loop instead.",
        "Very deep inputs (a 1000x1000 flood fill) can exceed the stack even when the logic is right; switch to an explicit stack or queue."
      ],
      "related": [
        "stack-queue",
        "big-o",
        "trees",
        "graph-traversal",
        "dynamic-programming",
        "composite"
      ],
      "quiz": [
        {
          "q": "factorial(4) calls factorial(3), which calls factorial(2), then factorial(1). What happens next?",
          "options": [
            "factorial(1) calls factorial(0) and so on forever",
            "factorial(1) returns 1 and each waiting call multiplies on the way back up",
            "All four calls run at the same time",
            "The program jumps straight back to main"
          ],
          "answer": 1,
          "why": "factorial(1) is the base case. The earlier calls are paused on the call stack and finish in reverse order: 1, then 2*1, 3*2, 4*6 = 24."
        },
        {
          "q": "Why does the flood fill check 'not the target colour' before painting?",
          "options": [
            "To make it faster on big maps only",
            "It is the base case: painted or blocked cells stop the recursion, otherwise neighbours would call each other forever",
            "GDScript requires an if statement in every function",
            "To count the walls"
          ],
          "answer": 1,
          "why": "Painting a cell changes its colour, so a second visit hits the base case. Without that check two neighbours would keep calling each other until the stack overflows."
        }
      ],
      "demos": [
        {
          "id": "recursion-ts-basics",
          "title": "Factorial, Fibonacci and a folder tree",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Three small recursive functions on numbers and one on a folder tree. Notice that each one checks its stopping case first, and that fib calls itself twice, which makes its call tree branch.",
          "roles": {
            "Base Case": [
              "recursion-ts-basics/math.ts#factorial",
              "recursion-ts-basics/math.ts#fib"
            ],
            "Recursive Case": [
              "recursion-ts-basics/math.ts#factorial",
              "recursion-ts-basics/math.ts#fib",
              "recursion-ts-basics/folders.ts#totalSize",
              "recursion-ts-basics/folders.ts#printTree"
            ],
            "Entry Point": [
              "recursion-ts-basics/main.ts#main"
            ],
            "Recursive Data": [
              "recursion-ts-basics/folders.ts#Folder"
            ]
          },
          "trace": [
            {
              "at": "recursion-ts-basics/main.ts#main",
              "say": "main() asks for 4!. It cannot know the answer yet, so a call to factorial(4) goes onto the call stack."
            },
            {
              "at": "recursion-ts-basics/math.ts#factorial",
              "say": "factorial(4) needs factorial(3), which needs factorial(2), then factorial(1). Four calls now wait on the stack, each paused mid-multiply."
            },
            {
              "at": "recursion-ts-basics/math.ts#factorial",
              "say": "factorial(1) hits the base case and returns 1. The stack unwinds: 2*1, 3*2, 4*6 = 24."
            },
            {
              "at": "recursion-ts-basics/math.ts#fib",
              "say": "fib(4) calls fib(3) and fib(2); fib(3) calls fib(2) again. The same work is done twice, a hint of exponential cost."
            },
            {
              "at": "recursion-ts-basics/folders.ts#printTree",
              "say": "printTree walks the folder tree, passing depth + 1 down. Each level of indentation is one level of the call stack."
            },
            {
              "at": "recursion-ts-basics/folders.ts#totalSize",
              "say": "totalSize adds its own files, then the totals of its children. A folder with no children is the base case: the loop simply does not recurse."
            }
          ],
          "files": {
            "recursion-ts-basics/folders.ts": "// A folder tree is recursive data: a folder contains files and more folders.\nexport interface Folder {\n  name: string;\n  fileSizes: number[];\n  children: Folder[];\n}\n\n// Total size of a folder = its own files + the total size of every child folder.\nexport function totalSize(folder: Folder): number {\n  let sum = 0;\n  for (const size of folder.fileSizes) {\n    sum += size;\n  }\n  for (const child of folder.children) {\n    sum += totalSize(child); // the recursion stops by itself when a folder has no children\n  }\n  return sum;\n}\n\n// Print the tree with indentation. depth grows by one on every level of the call stack.\nexport function printTree(folder: Folder, depth: number): void {\n  console.log('  '.repeat(depth) + folder.name + '/');\n  for (const child of folder.children) {\n    printTree(child, depth + 1);\n  }\n}\n",
            "recursion-ts-basics/main.ts": "import { factorial, fib } from './math';\nimport { Folder, totalSize, printTree } from './folders';\n\nconst photos: Folder = { name: 'photos', fileSizes: [300, 450], children: [] };\nconst docs: Folder = { name: 'docs', fileSizes: [20], children: [] };\nconst home: Folder = { name: 'home', fileSizes: [5], children: [photos, docs] };\n\nexport function main(): void {\n  console.log('4! =', factorial(4)); // 24: four calls stacked, then unwound\n  console.log('fib(4) =', fib(4)); // 3: nine calls in total, fib(2) is computed twice\n  printTree(home, 0);\n  console.log('home uses', totalSize(home), 'KB');\n}\n\nmain();\n",
            "recursion-ts-basics/math.ts": "// Two classic recursive functions. Each one has a base case (stop) and a recursive case (call yourself on a smaller problem).\n\n// n! = n * (n-1) * ... * 1\nexport function factorial(n: number): number {\n  if (n <= 1) {\n    return 1; // base case: the smallest problem we can answer directly\n  }\n  return n * factorial(n - 1); // recursive case: shrink n by one and trust the call\n}\n\n// fib(n) = fib(n-1) + fib(n-2). Two recursive calls, so the call tree branches.\nexport function fib(n: number): number {\n  if (n < 2) {\n    return n; // base cases: fib(0) = 0, fib(1) = 1\n  }\n  return fib(n - 1) + fib(n - 2);\n}\n"
          }
        },
        {
          "id": "recursion-gd-flood-fill",
          "title": "Paint bucket flood fill in a Godot level editor",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Clicking the paint bucket recolours every connected grass tile. flood_fill paints one tile and calls itself on four neighbours; the off-map and wrong-colour checks are the base cases that stop it.",
          "roles": {
            "Base Case": [
              "recursion-gd-flood-fill/tile_grid.gd#in_bounds",
              "recursion-gd-flood-fill/tile_grid.gd#flood_fill"
            ],
            "Recursive Case": [
              "recursion-gd-flood-fill/tile_grid.gd#flood_fill"
            ],
            "Entry Point": [
              "recursion-gd-flood-fill/paint_bucket.gd#click",
              "recursion-gd-flood-fill/level_editor.gd#_ready"
            ],
            "Recursive Data": [
              "recursion-gd-flood-fill/tile_grid.gd"
            ]
          },
          "trace": [
            {
              "at": "recursion-gd-flood-fill/level_editor.gd#_ready",
              "say": "The editor builds a 4x3 tile grid and clicks the paint bucket on the top-left grass tile."
            },
            {
              "at": "recursion-gd-flood-fill/paint_bucket.gd#click",
              "say": "click() reads the old colour and refuses to fill a tile with its own colour, a guard that would otherwise recurse forever."
            },
            {
              "at": "recursion-gd-flood-fill/tile_grid.gd#flood_fill",
              "say": "flood_fill(0,0) paints the tile, then calls itself on the right, left, down and up neighbours."
            },
            {
              "at": "recursion-gd-flood-fill/tile_grid.gd#in_bounds",
              "say": "Neighbour (-1,0) is off the map: in_bounds fails and that call returns 0 at once. That is a base case."
            },
            {
              "at": "recursion-gd-flood-fill/tile_grid.gd#flood_fill",
              "say": "A neighbour that is a wall or already painted also returns 0. Painted tiles change colour, so no tile is ever visited twice."
            },
            {
              "at": "recursion-gd-flood-fill/tile_grid.gd#flood_fill",
              "say": "Each call returns how many tiles it painted, so the counts add up as the stack unwinds back to the first call."
            },
            {
              "at": "recursion-gd-flood-fill/level_editor.gd#print_grid",
              "say": "The editor prints the grid: all six connected grass tiles are now water, and the walls kept the fill from leaking anywhere else."
            }
          ],
          "files": {
            "recursion-gd-flood-fill/level_editor.gd": "extends Node2D\n\nvar grid: TileGrid\nvar bucket: PaintBucket\n\nfunc _ready() -> void:\n\tgrid = TileGrid.new([\n\t\t[0, 0, 2, 1],\n\t\t[0, 2, 2, 1],\n\t\t[0, 0, 0, 1],\n\t])\n\tbucket = PaintBucket.new(grid)\n\tvar changed := bucket.click(0, 0, 1)\n\tprint(\"Painted \", changed, \" grass tiles blue\")\n\tprint_grid()\n\nfunc print_grid() -> void:\n\tfor row in grid.cells:\n\t\tprint(row)\n",
            "recursion-gd-flood-fill/paint_bucket.gd": "class_name PaintBucket\nextends RefCounted\n\n# The level-editor tool that the player clicks with. It only starts the recursion.\nvar grid: TileGrid\n\nfunc _init(target_grid: TileGrid) -> void:\n\tgrid = target_grid\n\nfunc click(x: int, y: int, new_colour: int) -> int:\n\tvar old_colour := grid.get_cell(x, y)\n\tif old_colour == new_colour:\n\t\treturn 0 # guard: without it the fill would recurse forever on the same colour\n\treturn grid.flood_fill(x, y, old_colour, new_colour)\n",
            "recursion-gd-flood-fill/tile_grid.gd": "class_name TileGrid\nextends RefCounted\n\n# A tiny tile map stored as rows of colour ids. 0 = grass, 1 = water, 2 = wall.\nvar width := 0\nvar height := 0\nvar cells: Array = []\n\nfunc _init(rows: Array) -> void:\n\tcells = rows\n\theight = rows.size()\n\twidth = rows[0].size()\n\nfunc in_bounds(x: int, y: int) -> bool:\n\treturn x >= 0 and y >= 0 and x < width and y < height\n\nfunc get_cell(x: int, y: int) -> int:\n\treturn cells[y][x]\n\nfunc set_cell(x: int, y: int, value: int) -> void:\n\tcells[y][x] = value\n\n# Recursive flood fill: paint this cell, then ask each neighbour to paint itself.\n# The base cases come first: off the map, or not the colour we are replacing.\nfunc flood_fill(x: int, y: int, target: int, replacement: int) -> int:\n\tif not in_bounds(x, y):\n\t\treturn 0\n\tif get_cell(x, y) != target:\n\t\treturn 0\n\tset_cell(x, y, replacement)\n\tvar painted := 1\n\tpainted += flood_fill(x + 1, y, target, replacement)\n\tpainted += flood_fill(x - 1, y, target, replacement)\n\tpainted += flood_fill(x, y + 1, target, replacement)\n\tpainted += flood_fill(x, y - 1, target, replacement)\n\treturn painted\n"
          }
        },
        {
          "id": "recursion-py-islands-real",
          "title": "TheAlgorithms: counting islands with recursive DFS",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "TheAlgorithms/Python",
            "url": "https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/matrix/count_islands_in_matrix.py",
            "license": "MIT",
            "note": "islands/count_islands_in_matrix.py is verbatim from TheAlgorithms/Python at commit 215c1f0; main.py was written for Software City."
          },
          "story": "Real code from the most-starred algorithms repo on GitHub. count_islands scans the map; every time it finds unvisited land it calls diffs, which marks that cell and recursively sinks all 8 connected neighbours.",
          "roles": {
            "Base Case": [
              "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.is_safe"
            ],
            "Recursive Case": [
              "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.diffs"
            ],
            "Entry Point": [
              "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.count_islands",
              "recursion-py-islands-real/main.py#run"
            ],
            "Recursive Data": [
              "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix"
            ]
          },
          "trace": [
            {
              "at": "recursion-py-islands-real/main.py#run",
              "say": "run() wraps a 5x5 land/sea photo in a Matrix and asks how many islands it has."
            },
            {
              "at": "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.count_islands",
              "say": "count_islands loops over every cell. Unvisited land means a new island: it calls diffs once and adds one to the count."
            },
            {
              "at": "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.diffs",
              "say": "diffs marks the cell visited, then tries all 8 neighbours using two offset lists."
            },
            {
              "at": "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.is_safe",
              "say": "is_safe is the base-case test: off the grid, already visited or sea means no recursive call for that neighbour."
            },
            {
              "at": "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.diffs",
              "say": "A safe neighbour gets its own diffs call, which goes deeper still. The whole island is marked before control returns to count_islands."
            },
            {
              "at": "recursion-py-islands-real/islands/count_islands_in_matrix.py#Matrix.count_islands",
              "say": "Back in the scan, every cell of that island is already visited, so it is never counted twice. Answer: 5 islands."
            }
          ],
          "files": {
            "recursion-py-islands-real/islands/count_islands_in_matrix.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/matrix/count_islands_in_matrix.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n# An island in matrix is a group of linked areas, all having the same value.\n# This code counts number of islands in a given matrix, with including diagonal\n# connections.\nclass Matrix:  # Public class to implement a graph\n    def __init__(self, graph: list[list[bool]]) -> None:\n        \"\"\"\n        Initialise matrix with number of rows, columns, and graph.\n\n        >>> m = Matrix([[True, False, False, False],\n        ...              [True, False, True, False],\n        ...              [False, False, True, True]])\n        >>> m.ROW\n        3\n        >>> m.COL\n        4\n        >>> m.graph  # doctest: +NORMALIZE_WHITESPACE\n        [[True, False, False, False],\n         [True, False, True, False],\n         [False, False, True, True]]\n        \"\"\"\n        self.graph = graph\n        self.ROW = len(graph)\n        self.COL = len(graph[0])\n\n    def is_safe(self, i: int, j: int, visited: list[list[bool]]) -> bool:\n        \"\"\"\n        >>> visited = [[False, False, False],\n        ...             [False, False, False],\n        ...             [False, False, False]]\n        >>> m = Matrix([[True, False, False],\n        ...              [False, False, True],\n        ...              [False, False, True]])\n        >>> m.is_safe(0, 0, visited)\n        True\n        >>> m.is_safe(0, 2, visited)\n        False\n        >>> m.is_safe(-1, 2, visited)\n        False\n        >>> m.is_safe(1, 5, visited)\n        False\n        \"\"\"\n        return (\n            0 <= i < self.ROW\n            and 0 <= j < self.COL\n            and not visited[i][j]\n            and self.graph[i][j] == 1\n        )\n\n    def diffs(self, i: int, j: int, visited: list[list[bool]]) -> None:\n        \"\"\"\n        Checking all 8 elements surrounding nth element.\n\n        >>> visited = [[False, False, False],\n        ...             [False, False, False],\n        ...             [False, False, False]]\n        >>> m = Matrix([[True, True, False],\n        ...              [False, True, False],\n        ...              [True, False, True]])\n        >>> m.diffs(0, 0, visited)\n        >>> visited  # doctest: +NORMALIZE_WHITESPACE\n        [[True, True, False],\n         [False, True, False],\n         [True, False, True]]\n        \"\"\"\n        row_nbr = [-1, -1, -1, 0, 0, 1, 1, 1]  # Coordinate order\n        col_nbr = [-1, 0, 1, -1, 1, -1, 0, 1]\n        visited[i][j] = True  # Make those cells visited\n        for k in range(8):\n            if self.is_safe(i + row_nbr[k], j + col_nbr[k], visited):\n                self.diffs(i + row_nbr[k], j + col_nbr[k], visited)\n\n    def count_islands(self) -> int:\n        \"\"\"\n        >>> m = Matrix([[True, True, False, False],\n        ...              [False, True, False, True],\n        ...              [True, False, False, True]])\n        >>> m.count_islands()\n        2\n        >>> m2 = Matrix([[True, True, False],\n        ...               [True, False, False],\n        ...               [False, False, True]])\n        >>> m2.count_islands()\n        2\n        \"\"\"\n        visited = [[False for j in range(self.COL)] for i in range(self.ROW)]\n        count = 0\n        for i in range(self.ROW):\n            for j in range(self.COL):\n                if not visited[i][j] and self.graph[i][j]:\n                    self.diffs(i, j, visited)\n                    count += 1\n        return count\n",
            "recursion-py-islands-real/main.py": "# Example usage written for Software City (not part of TheAlgorithms/Python).\nfrom islands.count_islands_in_matrix import Matrix\n\n\ndef run() -> None:\n    # A satellite photo: True = land, False = sea. Diagonal neighbours count as connected.\n    photo = [\n        [True, True, False, False, False],\n        [False, True, False, False, True],\n        [True, False, False, True, True],\n        [False, False, False, False, False],\n        [True, False, True, False, True],\n    ]\n    world = Matrix(photo)\n    print(\"islands:\", world.count_islands())\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "big-o",
      "name": "Big-O Notation",
      "family": "Foundations",
      "aka": [
        "Time complexity",
        "Asymptotic complexity",
        "Growth rate"
      ],
      "tagline": "Describe how the work grows as the input grows, then pick the version that grows slowest.",
      "intent": "Big-O describes how many steps an algorithm needs as the input size n grows, ignoring constant factors: one loop over the data is O(n), a loop inside a loop is O(n²), halving the search space each step is O(log n), a dictionary lookup is O(1). Comparing the same job written different ways shows why a program that is fine with 100 items freezes with 100,000, and which data structure (set, sorted list, hash buckets) makes it fast again.",
      "analogy": "Finding a word in a dictionary: reading every page from the start is O(n); opening in the middle and halving each time is O(log n). Comparing every guest at a party with every other guest to find matching shirts is O(n²); asking everyone to stand by their shirt colour is O(n).",
      "cityShape": "Each building holds the same job done two or three ways, and the function names end in their growth rate (_n_squared, _n_log_n, _n, _log_n) so you can compare floors side by side. Nested-loop floors such as has_duplicate_n_squared and find_hits_n_squared glow warmer than the single-loop floors next to them; but watch binary search: its floor is as warm as the linear scan, or warmer, because the colour counts branches, not steps.",
      "roles": [
        {
          "name": "Brute Force",
          "desc": "The obvious version: scan everything, or compare every pair with nested loops. Correct and simple, but its work grows fastest (O(n) or O(n²))."
        },
        {
          "name": "Smarter Version",
          "desc": "The same job with less work per item: O(n log n), O(n), O(log n) or O(1), usually thanks to a better data structure or a precondition."
        },
        {
          "name": "Enabler",
          "desc": "The data structure or precondition that buys the speed: a set or dictionary, a sorted list, grid buckets."
        },
        {
          "name": "Harness",
          "desc": "Runs the versions on the same input so the step counts can be compared as n grows."
        }
      ],
      "whenToUse": [
        "Before shipping code that loops over user data, items, entities or rows: ask what happens when there are 100 times more.",
        "When a game or page gets slower as the level, list or save file grows, look for a loop inside a loop.",
        "When choosing between a list, a set/dictionary and a sorted list for lookups.",
        "In code review and interviews, to explain why one version scales and another does not."
      ],
      "pitfalls": [
        "Big-O hides constants: for 10 items a simple O(n²) loop is often faster than a clever O(n log n) one. Measure before optimizing.",
        "Hidden loops count: 'x in some_list', list.index(), sorted() and list.insert() each walk the list, so one innocent line inside a loop can make it O(n²).",
        "Cyclomatic complexity (the floor colour) and Big-O are different things: binary search has more branches than a linear scan but does far fewer steps."
      ],
      "related": [
        "hash-table",
        "sorting-searching",
        "recursion",
        "dynamic-programming",
        "spatial-partition"
      ],
      "quiz": [
        {
          "q": "has_duplicate_n_squared takes 1 second for 10,000 items. Roughly how long for 20,000?",
          "options": [
            "1 second",
            "2 seconds",
            "4 seconds",
            "20 seconds"
          ],
          "answer": 2,
          "why": "O(n²) work grows with the square of n: twice the items means four times the pairs to compare."
        },
        {
          "q": "Why can binary_search_log_n not be used on any list?",
          "options": [
            "It only works on numbers",
            "The list must already be sorted, otherwise throwing away half is not safe",
            "It needs a set",
            "It is slower on long lists"
          ],
          "answer": 1,
          "why": "Binary search relies on order: if the middle item is smaller than the target, everything left of it must be smaller too. Sorting is the enabler."
        }
      ],
      "demos": [
        {
          "id": "big-o-py-duplicates",
          "title": "Duplicate tickets and name search, three speeds",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "The same two questions answered several ways, each returning how many steps it took. Run it for n = 10, 100, 1000 and watch 500,500 steps shrink to 1,001, and 1,000 to 10.",
          "roles": {
            "Brute Force": [
              "big-o-py-duplicates/duplicates.py#has_duplicate_n_squared",
              "big-o-py-duplicates/search.py#linear_search_n"
            ],
            "Smarter Version": [
              "big-o-py-duplicates/duplicates.py#has_duplicate_n_log_n",
              "big-o-py-duplicates/duplicates.py#has_duplicate_n",
              "big-o-py-duplicates/search.py#binary_search_log_n"
            ],
            "Enabler": [
              "big-o-py-duplicates/duplicates.py#has_duplicate_n",
              "big-o-py-duplicates/main.py#compare_search"
            ],
            "Harness": [
              "big-o-py-duplicates/main.py#main",
              "big-o-py-duplicates/main.py#compare_duplicates"
            ]
          },
          "trace": [
            {
              "at": "big-o-py-duplicates/main.py#main",
              "say": "main() runs every version for n = 10, 100 and 1000, always the worst case, so the step counts show pure growth."
            },
            {
              "at": "big-o-py-duplicates/main.py#compare_duplicates",
              "say": "The duplicate ticket is the very last item, so no version gets lucky and stops early."
            },
            {
              "at": "big-o-py-duplicates/duplicates.py#has_duplicate_n_squared",
              "say": "A loop inside a loop compares every pair: about n²/2 steps. At n = 1000 that is 500,500 comparisons."
            },
            {
              "at": "big-o-py-duplicates/duplicates.py#has_duplicate_n_log_n",
              "say": "Sorting first puts equal tickets side by side, so one pass finds them. The sort costs about n log n, which now dominates."
            },
            {
              "at": "big-o-py-duplicates/duplicates.py#has_duplicate_n",
              "say": "A set remembers what we have seen and answers 'seen before?' in O(1). One loop: 1,001 steps for 1,000 tickets."
            },
            {
              "at": "big-o-py-duplicates/search.py#linear_search_n",
              "say": "Linear search checks names one by one. Doubling the list doubles the work."
            },
            {
              "at": "big-o-py-duplicates/search.py#binary_search_log_n",
              "say": "Binary search halves the range every step: 1000 names need only 10 looks. The list being sorted is what makes this legal."
            }
          ],
          "files": {
            "big-o-py-duplicates/duplicates.py": "# Three ways to answer \"does this list contain a duplicate?\".\n# Each function returns (answer, steps) so you can watch the work grow with n.\n\n\ndef has_duplicate_n_squared(items: list) -> tuple:\n    \"\"\"O(n^2): compare every item with every later item. Two nested loops.\"\"\"\n    steps = 0\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            steps += 1\n            if items[i] == items[j]:\n                return True, steps\n    return False, steps\n\n\ndef has_duplicate_n_log_n(items: list) -> tuple:\n    \"\"\"O(n log n): sort a copy first, then duplicates sit next to each other.\"\"\"\n    ordered = sorted(items)\n    steps = len(items) * len(items).bit_length()  # roughly what sorted() costs: n * log2(n)\n    for i in range(1, len(ordered)):\n        steps += 1\n        if ordered[i] == ordered[i - 1]:\n            return True, steps\n    return False, steps\n\n\ndef has_duplicate_n(items: list) -> tuple:\n    \"\"\"O(n): remember what we have seen in a set. One loop, each lookup is O(1).\"\"\"\n    seen = set()\n    steps = 0\n    for item in items:\n        steps += 1\n        if item in seen:\n            return True, steps\n        seen.add(item)\n    return False, steps\n",
            "big-o-py-duplicates/main.py": "from duplicates import has_duplicate_n_squared, has_duplicate_n_log_n, has_duplicate_n\nfrom search import linear_search_n, binary_search_log_n\n\n\ndef compare_duplicates(n: int) -> None:\n    # Worst case: the only duplicate is the very last item.\n    tickets = list(range(n)) + [n - 1]\n    print(f\"n={n}\")\n    print(\"  n^2     steps:\", has_duplicate_n_squared(tickets)[1])\n    print(\"  n log n steps:\", has_duplicate_n_log_n(tickets)[1])\n    print(\"  n       steps:\", has_duplicate_n(tickets)[1])\n\n\ndef compare_search(n: int) -> None:\n    names = sorted(f\"user{i:05d}\" for i in range(n))\n    target = names[-1]\n    print(\"  linear  steps:\", linear_search_n(names, target)[1])\n    print(\"  binary  steps:\", binary_search_log_n(names, target)[1])\n\n\ndef main() -> None:\n    for n in (10, 100, 1000):\n        compare_duplicates(n)\n        compare_search(n)\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "big-o-py-duplicates/search.py": "# Two ways to find a name in a list that is already sorted.\n\n\ndef linear_search_n(sorted_names: list, target: str) -> tuple:\n    \"\"\"O(n): check names one by one from the start.\"\"\"\n    steps = 0\n    for index, name in enumerate(sorted_names):\n        steps += 1\n        if name == target:\n            return index, steps\n    return -1, steps\n\n\ndef binary_search_log_n(sorted_names: list, target: str) -> tuple:\n    \"\"\"O(log n): look at the middle and throw away the half that cannot contain the target.\"\"\"\n    low = 0\n    high = len(sorted_names) - 1\n    steps = 0\n    while low <= high:\n        steps += 1\n        middle = (low + high) // 2\n        if sorted_names[middle] == target:\n            return middle, steps\n        if sorted_names[middle] < target:\n            low = middle + 1\n        else:\n            high = middle - 1\n    return -1, steps\n"
          }
        },
        {
          "id": "big-o-gd-collisions",
          "title": "Bullet hits and leaderboard ranks in Godot",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "400 bullets against 400 enemies: checking every pair costs 160,000 distance tests per frame, while a spatial hash only tests enemies in the bullet's own grid cell. The leaderboard compares a linear rank lookup with binary search.",
          "roles": {
            "Brute Force": [
              "big-o-gd-collisions/pair_check.gd#find_hits_n_squared",
              "big-o-gd-collisions/leaderboard.gd#rank_of_n"
            ],
            "Smarter Version": [
              "big-o-gd-collisions/spatial_hash.gd#find_hits_n",
              "big-o-gd-collisions/leaderboard.gd#rank_of_log_n"
            ],
            "Enabler": [
              "big-o-gd-collisions/spatial_hash.gd#insert_all_n",
              "big-o-gd-collisions/spatial_hash.gd#cell_of"
            ],
            "Harness": [
              "big-o-gd-collisions/arena.gd#_ready",
              "big-o-gd-collisions/arena.gd#compare_collisions",
              "big-o-gd-collisions/arena.gd#compare_ranks"
            ]
          },
          "trace": [
            {
              "at": "big-o-gd-collisions/arena.gd#_ready",
              "say": "The arena spawns 400 enemies and 400 bullets at random positions and runs both collision versions on them."
            },
            {
              "at": "big-o-gd-collisions/pair_check.gd#find_hits_n_squared",
              "say": "Every bullet tests every enemy: 400 x 400 = 160,000 checks. At 60 frames a second this is what makes bullet-hell games stutter."
            },
            {
              "at": "big-o-gd-collisions/spatial_hash.gd#insert_all_n",
              "say": "One pass drops each enemy into a dictionary bucket keyed by its grid cell. O(n), paid once per frame."
            },
            {
              "at": "big-o-gd-collisions/spatial_hash.gd#find_hits_n",
              "say": "One loop over bullets. Each bullet asks only its own cell, so the total is n times a small constant."
            },
            {
              "at": "big-o-gd-collisions/spatial_hash.gd#hits_in_cell",
              "say": "The inner loop still exists, but it only sees the two or three enemies in one 64-pixel cell, not all 400."
            },
            {
              "at": "big-o-gd-collisions/arena.gd#compare_ranks",
              "say": "The leaderboard holds 1000 sorted scores. Where does 93,500 rank?"
            },
            {
              "at": "big-o-gd-collisions/leaderboard.gd#rank_of_n",
              "say": "The linear version walks down the board: about 930 comparisons for this score."
            },
            {
              "at": "big-o-gd-collisions/leaderboard.gd#rank_of_log_n",
              "say": "Binary search needs about 10. Its floor colour is no cooler, because colour counts branches; Big-O counts steps."
            }
          ],
          "files": {
            "big-o-gd-collisions/arena.gd": "extends Node2D\n\n# Spawns a crowd, then runs the slow and the fast version of each job so you can compare.\nvar pair_check: PairCheck\nvar spatial_hash: SpatialHash\nvar leaderboard: Leaderboard\n\nfunc _ready() -> void:\n\tpair_check = PairCheck.new()\n\tspatial_hash = SpatialHash.new()\n\tleaderboard = Leaderboard.new()\n\tvar enemies := spawn_points(400)\n\tvar bullets := spawn_points(400)\n\tcompare_collisions(bullets, enemies)\n\tcompare_ranks()\n\nfunc spawn_points(count: int) -> Array:\n\tvar points: Array = []\n\tfor i in count:\n\t\tpoints.append(Vector2(randf_range(0, 1280), randf_range(0, 720)))\n\treturn points\n\nfunc compare_collisions(bullets: Array, enemies: Array) -> void:\n\tpair_check.find_hits_n_squared(bullets, enemies)\n\tspatial_hash.insert_all_n(enemies)\n\tspatial_hash.find_hits_n(bullets)\n\tprint(\"n^2 checks: \", pair_check.checks, \"   grid checks: \", spatial_hash.checks)\n\nfunc compare_ranks() -> void:\n\tfor i in 1000:\n\t\tleaderboard.scores.append(100000 - i * 7)\n\tprint(\"rank linear: \", leaderboard.rank_of_n(93500))\n\tprint(\"rank binary: \", leaderboard.rank_of_log_n(93500))\n",
            "big-o-gd-collisions/leaderboard.gd": "class_name Leaderboard\nextends RefCounted\n\n# Scores kept sorted from highest to lowest.\nvar scores: Array = []\n\n# O(n): walk down the board until we find a smaller score.\nfunc rank_of_n(score: int) -> int:\n\tfor i in scores.size():\n\t\tif score >= scores[i]:\n\t\t\treturn i + 1\n\treturn scores.size() + 1\n\n# O(log n): halve the search range each step. More branches in the code, far fewer steps at run time.\nfunc rank_of_log_n(score: int) -> int:\n\tvar low := 0\n\tvar high := scores.size()\n\twhile low < high:\n\t\tvar middle := (low + high) / 2\n\t\tif scores[middle] > score:\n\t\t\tlow = middle + 1\n\t\telse:\n\t\t\thigh = middle\n\treturn low + 1\n",
            "big-o-gd-collisions/pair_check.gd": "class_name PairCheck\nextends RefCounted\n\n# The obvious way: test every bullet against every enemy.\n# 100 bullets x 100 enemies = 10,000 distance checks per frame. Double both and it is 40,000.\nconst HIT_RADIUS := 12.0\n\nvar checks := 0\n\nfunc find_hits_n_squared(bullets: Array, enemies: Array) -> Array:\n\tvar hits: Array = []\n\tchecks = 0\n\tfor bullet in bullets:\n\t\tfor enemy in enemies:\n\t\t\tchecks += 1\n\t\t\tif bullet.distance_to(enemy) < HIT_RADIUS:\n\t\t\t\thits.append(enemy)\n\treturn hits\n",
            "big-o-gd-collisions/spatial_hash.gd": "class_name SpatialHash\nextends RefCounted\n\n# Sort enemies into grid buckets once (O(n)), then each bullet only looks in its own bucket.\n# A real game would also check the 8 neighbouring cells; that is still a constant amount of work per bullet.\nconst CELL_SIZE := 64.0\nconst HIT_RADIUS := 12.0\n\nvar buckets: Dictionary = {}\nvar checks := 0\n\nfunc cell_of(point: Vector2) -> Vector2i:\n\treturn Vector2i(floori(point.x / CELL_SIZE), floori(point.y / CELL_SIZE))\n\nfunc insert_all_n(enemies: Array) -> void:\n\tbuckets.clear()\n\tfor enemy in enemies:\n\t\tvar cell := cell_of(enemy)\n\t\tbuckets[cell] = buckets.get(cell, []) + [enemy]\n\nfunc find_hits_n(bullets: Array) -> Array:\n\tvar hits: Array = []\n\tchecks = 0\n\tfor bullet in bullets:\n\t\thits.append_array(hits_in_cell(bullet))\n\treturn hits\n\n# Only the handful of enemies that share the bullet's cell are tested.\nfunc hits_in_cell(bullet: Vector2) -> Array:\n\tvar found: Array = []\n\tfor enemy in buckets.get(cell_of(bullet), []):\n\t\tchecks += 1\n\t\tif bullet.distance_to(enemy) < HIT_RADIUS:\n\t\t\tfound.append(enemy)\n\treturn found\n"
          }
        },
        {
          "id": "big-o-py-bisect-real",
          "title": "CPython's bisect module: O(log n) in 20 lines",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.9/Lib/bisect.py",
            "license": "PSF-2.0",
            "note": "stdlib/bisect.py is verbatim from CPython 3.12.9 (whole file). At run time CPython swaps in an identical C version via 'from _bisect import *'. prices.py was written for Software City."
          },
          "story": "The standard library's binary search, used by real code everywhere. prices.py puts a beginner's O(n) scan next to bisect's O(log n), and shows that insort finds the slot fast but still pays O(n) to shift the list.",
          "roles": {
            "Brute Force": [
              "big-o-py-bisect-real/prices.py#contains_n",
              "big-o-py-bisect-real/prices.py#add_price_n_log_n"
            ],
            "Smarter Version": [
              "big-o-py-bisect-real/prices.py#contains_log_n",
              "big-o-py-bisect-real/prices.py#count_in_range_log_n",
              "big-o-py-bisect-real/prices.py#add_price_n"
            ],
            "Enabler": [
              "big-o-py-bisect-real/stdlib/bisect.py#bisect_left",
              "big-o-py-bisect-real/stdlib/bisect.py#bisect_right",
              "big-o-py-bisect-real/stdlib/bisect.py#insort_right"
            ],
            "Harness": [
              "big-o-py-bisect-real/prices.py#run"
            ]
          },
          "trace": [
            {
              "at": "big-o-py-bisect-real/prices.py#run",
              "say": "run() builds a sorted list of 200,000 prices and asks whether 999,995 is in it, twice."
            },
            {
              "at": "big-o-py-bisect-real/prices.py#contains_n",
              "say": "The scan touches all 200,000 prices before it finds the last one: O(n)."
            },
            {
              "at": "big-o-py-bisect-real/prices.py#contains_log_n",
              "say": "bisect_left jumps to the slot where the price must be, then a single comparison confirms it."
            },
            {
              "at": "big-o-py-bisect-real/stdlib/bisect.py#bisect_left",
              "say": "The real thing: lo and hi close in on the answer, halving each loop. 200,000 items need only 18 rounds."
            },
            {
              "at": "big-o-py-bisect-real/prices.py#count_in_range_log_n",
              "say": "bisect_right minus bisect_left counts a whole price range without visiting it: two O(log n) searches."
            },
            {
              "at": "big-o-py-bisect-real/stdlib/bisect.py#bisect_right",
              "say": "bisect_right is the mirror image: on a tie it moves right, so it lands just after the last equal item."
            },
            {
              "at": "big-o-py-bisect-real/prices.py#add_price_n_log_n",
              "say": "Appending and re-sorting for each new price costs O(n log n) per insert, a common hidden slowdown."
            },
            {
              "at": "big-o-py-bisect-real/stdlib/bisect.py#insort_right",
              "say": "insort finds the slot in O(log n), but list.insert must shift the items after it, so one insert is O(n) overall."
            }
          ],
          "files": {
            "big-o-py-bisect-real/prices.py": "# Example usage written for Software City (not part of CPython).\n# A price-alert service keeps a sorted list of prices and answers two questions fast.\nfrom stdlib.bisect import bisect_left, bisect_right, insort_right\n\n\ndef contains_n(sorted_prices: list, price: int) -> bool:\n    \"\"\"O(n): the beginner way, scan from the start.\"\"\"\n    for p in sorted_prices:\n        if p == price:\n            return True\n    return False\n\n\ndef contains_log_n(sorted_prices: list, price: int) -> bool:\n    \"\"\"O(log n): bisect_left jumps to where price would be, then we check one slot.\"\"\"\n    i = bisect_left(sorted_prices, price)\n    return i < len(sorted_prices) and sorted_prices[i] == price\n\n\ndef count_in_range_log_n(sorted_prices: list, low: int, high: int) -> int:\n    \"\"\"Two binary searches give the size of a whole range without looking at it.\"\"\"\n    return bisect_right(sorted_prices, high) - bisect_left(sorted_prices, low)\n\n\ndef add_price_n_log_n(sorted_prices: list, price: int) -> None:\n    \"\"\"Append, then re-sort everything: O(n log n) for a single insert.\"\"\"\n    sorted_prices.append(price)\n    sorted_prices.sort()\n\n\ndef add_price_n(sorted_prices: list, price: int) -> None:\n    \"\"\"insort finds the slot in O(log n); list.insert still shifts items, so O(n) overall.\"\"\"\n    insort_right(sorted_prices, price)\n\n\ndef run() -> None:\n    prices = list(range(0, 1_000_000, 5))\n    print(contains_n(prices, 999_995), contains_log_n(prices, 999_995))\n    print(\"prices between 100 and 200:\", count_in_range_log_n(prices, 100, 200))\n    add_price_n_log_n(prices, 42)\n    add_price_n(prices, 43)\n\n\nif __name__ == \"__main__\":\n    run()\n",
            "big-o-py-bisect-real/stdlib/bisect.py": "# Source: CPython 3.12.9 Lib/bisect.py — https://github.com/python/cpython/blob/v3.12.9/Lib/bisect.py\n# PSF License, Copyright (c) 2001-2023 Python Software Foundation; All Rights Reserved. Included for study.\n\"\"\"Bisection algorithms.\"\"\"\n\n\ndef insort_right(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Insert item x in list a, and keep it sorted assuming a is sorted.\n\n    If x is already in a, insert it to the right of the rightmost x.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n    if key is None:\n        lo = bisect_right(a, x, lo, hi)\n    else:\n        lo = bisect_right(a, key(x), lo, hi, key=key)\n    a.insert(lo, x)\n\n\ndef bisect_right(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Return the index where to insert item x in list a, assuming a is sorted.\n\n    The return value i is such that all e in a[:i] have e <= x, and all e in\n    a[i:] have e > x.  So if x already appears in the list, a.insert(i, x) will\n    insert just after the rightmost x already there.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n\n    if lo < 0:\n        raise ValueError('lo must be non-negative')\n    if hi is None:\n        hi = len(a)\n    # Note, the comparison uses \"<\" to match the\n    # __lt__() logic in list.sort() and in heapq.\n    if key is None:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if x < a[mid]:\n                hi = mid\n            else:\n                lo = mid + 1\n    else:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if x < key(a[mid]):\n                hi = mid\n            else:\n                lo = mid + 1\n    return lo\n\n\ndef insort_left(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Insert item x in list a, and keep it sorted assuming a is sorted.\n\n    If x is already in a, insert it to the left of the leftmost x.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n\n    if key is None:\n        lo = bisect_left(a, x, lo, hi)\n    else:\n        lo = bisect_left(a, key(x), lo, hi, key=key)\n    a.insert(lo, x)\n\ndef bisect_left(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Return the index where to insert item x in list a, assuming a is sorted.\n\n    The return value i is such that all e in a[:i] have e < x, and all e in\n    a[i:] have e >= x.  So if x already appears in the list, a.insert(i, x) will\n    insert just before the leftmost x already there.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n\n    if lo < 0:\n        raise ValueError('lo must be non-negative')\n    if hi is None:\n        hi = len(a)\n    # Note, the comparison uses \"<\" to match the\n    # __lt__() logic in list.sort() and in heapq.\n    if key is None:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if a[mid] < x:\n                lo = mid + 1\n            else:\n                hi = mid\n    else:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if key(a[mid]) < x:\n                lo = mid + 1\n            else:\n                hi = mid\n    return lo\n\n\n# Overwrite above definitions with a fast C implementation\ntry:\n    from _bisect import *\nexcept ImportError:\n    pass\n\n# Create aliases\nbisect = bisect_right\ninsort = insort_right\n"
          }
        }
      ]
    },
    {
      "id": "stack-queue",
      "name": "Stacks and Queues",
      "family": "Foundations",
      "aka": [
        "LIFO and FIFO",
        "Push/pop and enqueue/dequeue",
        "Deque"
      ],
      "tagline": "Two simple lines of items: a stack hands back the newest, a queue the oldest.",
      "intent": "Many problems only ever need the most recent item (undo, matching brackets, backtracking, function calls) or the oldest waiting item (print jobs, network messages, breadth-first search). A stack (Last In, First Out) and a queue (First In, First Out) restrict a list to exactly those operations, which makes the intent obvious and keeps both ends fast.",
      "analogy": "A stack is a pile of plates: you put clean plates on top and take from the top. A queue is the line at a bakery: new customers join at the back, and the one who has waited longest is served next.",
      "cityShape": "Look for two small buildings with short push/pop and enqueue/dequeue floors, each with one roof antenna (the items list) that both floors write. The busy buildings (TextEditor, Printer, planner.go, lint_server.py) send pipes into them; in the Go demo FewestStops pipes into the Queue while buildRoute pipes into the Stack.",
      "roles": [
        {
          "name": "Stack",
          "desc": "LIFO container: push adds on top, pop removes the top. The newest item always comes out first."
        },
        {
          "name": "Queue",
          "desc": "FIFO container: enqueue adds at the back, dequeue removes from the front. The oldest item always comes out first."
        },
        {
          "name": "Client",
          "desc": "Code that picks the right one for the job: undo history, a print spooler, a route planner, a linter."
        }
      ],
      "whenToUse": [
        "Stack: undo/redo, matching brackets or tags, depth-first search, turning a backwards path the right way round, anything 'most recent first'.",
        "Queue: jobs that must be handled in arrival order (print, upload, chat messages), breadth-first search, game event queues.",
        "When a plain list would let other code poke into the middle and you want to make the allowed operations explicit."
      ],
      "pitfalls": [
        "Taking from the front of a plain array (Python list.pop(0), JavaScript shift()) is O(n): use a deque, a ring buffer or a head index for big queues.",
        "Popping an empty stack or dequeuing an empty queue crashes or returns null; check isEmpty / Len first or handle the error.",
        "Recursion uses the hidden call stack; very deep recursion overflows it, and an explicit stack is the usual fix."
      ],
      "related": [
        "recursion",
        "graph-traversal",
        "command",
        "memento",
        "event-queue",
        "producer-consumer"
      ],
      "quiz": [
        {
          "q": "A user types A, then B, then C, and presses undo twice. Which change is left?",
          "options": [
            "A",
            "C",
            "B and C",
            "None"
          ],
          "answer": 0,
          "why": "The undo stack hands back the newest change first: C is undone, then B, leaving only A."
        },
        {
          "q": "Why does breadth-first search use a queue rather than a stack?",
          "options": [
            "Queues use less memory",
            "A queue visits places in the order they were found, so all 1-step stations come before any 2-step station",
            "Stacks cannot hold strings",
            "It does not matter, both give the shortest path"
          ],
          "answer": 1,
          "why": "FIFO order explores in rings of distance, so the first time BFS reaches the goal is via the fewest steps. A stack would dive deep first (DFS) and could find a long route first."
        }
      ],
      "demos": [
        {
          "id": "stack-queue-kt-editor",
          "title": "Undo history and a print queue",
          "lang": "Kotlin",
          "level": "beginner",
          "source": null,
          "story": "A text editor keeps its old versions on a stack, so undo always takes back the newest change. A printer keeps jobs in a queue, so the first document submitted prints first.",
          "roles": {
            "Stack": [
              "stack-queue-kt-editor/Stack.kt#Stack"
            ],
            "Queue": [
              "stack-queue-kt-editor/Queue.kt#Queue"
            ],
            "Client": [
              "stack-queue-kt-editor/TextEditor.kt#TextEditor",
              "stack-queue-kt-editor/Printer.kt#Printer",
              "stack-queue-kt-editor/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "stack-queue-kt-editor/Main.kt#main",
              "say": "main() types three pieces of text, then presses undo twice."
            },
            {
              "at": "stack-queue-kt-editor/TextEditor.kt#TextEditor.type",
              "say": "Before changing the text, type() pushes the old version onto the undo stack."
            },
            {
              "at": "stack-queue-kt-editor/Stack.kt#Stack.push",
              "say": "push() adds to the end of the list, which we treat as the top."
            },
            {
              "at": "stack-queue-kt-editor/TextEditor.kt#TextEditor.undo",
              "say": "undo() pops the most recent snapshot, so '!!!' disappears first, then ', world'. Last in, first out."
            },
            {
              "at": "stack-queue-kt-editor/Stack.kt#Stack.pop",
              "say": "pop() removes the top item and returns null when empty, so undoing too often is harmless."
            },
            {
              "at": "stack-queue-kt-editor/Printer.kt#Printer.submit",
              "say": "Three documents are submitted; each one joins the back of the queue."
            },
            {
              "at": "stack-queue-kt-editor/Queue.kt#Queue.dequeue",
              "say": "dequeue() takes from the front of an ArrayDeque, which is O(1) unlike removing index 0 from a list."
            },
            {
              "at": "stack-queue-kt-editor/Printer.kt#Printer.printNext",
              "say": "invoice.pdf prints first because it waited longest. First in, first out."
            }
          ],
          "files": {
            "stack-queue-kt-editor/Main.kt": "fun main() {\n    val editor = TextEditor()\n    editor.type(\"Hello\")\n    editor.type(\", world\")\n    editor.type(\"!!!\")\n    editor.undo() // takes back \"!!!\", the last thing typed\n    editor.undo() // then \", world\"\n    println(editor.text) // Hello\n\n    val printer = Printer()\n    printer.submit(\"invoice.pdf\")\n    printer.submit(\"photo.png\")\n    printer.submit(\"essay.docx\")\n    printer.printNext() // invoice.pdf, the first one submitted\n    printer.printNext() // photo.png\n}\n",
            "stack-queue-kt-editor/Printer.kt": "// Print jobs use a queue: whoever clicked Print first gets their pages first.\nclass Printer {\n    private val jobs: Queue<String> = Queue()\n\n    fun submit(document: String) {\n        jobs.enqueue(document)\n        println(\"queued $document (${jobs.size()} waiting)\")\n    }\n\n    fun printNext() {\n        val document = jobs.dequeue()\n        if (document == null) {\n            println(\"nothing to print\")\n            return\n        }\n        println(\"printing $document\")\n    }\n}\n",
            "stack-queue-kt-editor/Queue.kt": "// A queue: First In, First Out. Add at the back, take from the front.\nclass Queue<T> {\n    private val items = ArrayDeque<T>() // removing from the front of ArrayDeque is O(1)\n\n    fun enqueue(item: T) {\n        items.addLast(item)\n    }\n\n    fun dequeue(): T? {\n        return items.removeFirstOrNull()\n    }\n\n    fun size(): Int = items.size\n}\n",
            "stack-queue-kt-editor/Stack.kt": "// A stack: Last In, First Out. You only ever touch the top.\nclass Stack<T> {\n    private val items = mutableListOf<T>()\n\n    fun push(item: T) {\n        items.add(item) // the end of the list is the top\n    }\n\n    fun pop(): T? {\n        if (items.isEmpty()) {\n            return null\n        }\n        return items.removeAt(items.size - 1)\n    }\n\n    fun isEmpty(): Boolean = items.isEmpty()\n}\n",
            "stack-queue-kt-editor/TextEditor.kt": "// Undo uses a stack: the most recent change is the first one to take back.\nclass TextEditor {\n    var text = \"\"\n    private val undoStack: Stack<String> = Stack()\n\n    fun type(words: String) {\n        undoStack.push(text) // remember the text as it was before this change\n        text += words\n    }\n\n    fun undo() {\n        val previous = undoStack.pop()\n        if (previous != null) {\n            text = previous\n        }\n    }\n}\n"
          }
        },
        {
          "id": "stack-queue-go-metro",
          "title": "Metro route planner: BFS queue plus a route stack",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "Breadth-first search uses a queue to find the route with the fewest stops; the route is discovered backwards, and a stack flips it into travel order. Both structures appear in one small program.",
          "roles": {
            "Stack": [
              "stack-queue-go-metro/metro/stack.go#Stack"
            ],
            "Queue": [
              "stack-queue-go-metro/metro/queue.go#Queue"
            ],
            "Client": [
              "stack-queue-go-metro/metro/planner.go#FewestStops",
              "stack-queue-go-metro/metro/planner.go#buildRoute",
              "stack-queue-go-metro/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "stack-queue-go-metro/main.go#main",
              "say": "main() builds three metro lines and asks for the route from Airport to Zoo with the fewest stops."
            },
            {
              "at": "stack-queue-go-metro/metro/network.go#Network.AddLine",
              "say": "AddLine records each pair of neighbouring stations in both directions, giving an adjacency list."
            },
            {
              "at": "stack-queue-go-metro/metro/planner.go#FewestStops",
              "say": "BFS starts with Airport in the queue and a cameFrom map that remembers how each station was reached."
            },
            {
              "at": "stack-queue-go-metro/metro/queue.go#Queue.Dequeue",
              "say": "Dequeue hands out the station found earliest, so all 1-stop stations are explored before any 2-stop station."
            },
            {
              "at": "stack-queue-go-metro/metro/queue.go#Queue.Enqueue",
              "say": "Unseen neighbours join the back of the queue. The cameFrom check stops a station being queued twice."
            },
            {
              "at": "stack-queue-go-metro/metro/planner.go#buildRoute",
              "say": "Reaching Zoo, we follow cameFrom backwards: Zoo, Museum, Market, Harbour, Airport, pushing each onto a stack."
            },
            {
              "at": "stack-queue-go-metro/metro/stack.go#Stack.Pop",
              "say": "Popping returns them newest-first, which is travel order: Airport -> Harbour -> Market -> Museum -> Zoo."
            }
          ],
          "files": {
            "stack-queue-go-metro/go.mod": "module softwarecity\n\ngo 1.22\n",
            "stack-queue-go-metro/main.go": "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n\n\t\"softwarecity/metro\"\n)\n\nfunc main() {\n\tcity := metro.NewNetwork()\n\tcity.AddLine(\"Airport\", \"Harbour\", \"Market\", \"Old Town\", \"University\")\n\tcity.AddLine(\"Harbour\", \"Stadium\", \"Museum\")\n\tcity.AddLine(\"Market\", \"Museum\", \"Zoo\")\n\n\troute := metro.FewestStops(city, \"Airport\", \"Zoo\")\n\tfmt.Println(strings.Join(route, \" -> \"))\n}\n",
            "stack-queue-go-metro/metro/network.go": "package metro\n\n// Network stores which stations are directly connected (an adjacency list).\ntype Network struct {\n\tlinks map[string][]string\n}\n\nfunc NewNetwork() *Network {\n\treturn &Network{links: map[string][]string{}}\n}\n\n// AddLine connects each station on a line to the next one, in both directions.\nfunc (n *Network) AddLine(stations ...string) {\n\tfor i := 1; i < len(stations); i++ {\n\t\ta, b := stations[i-1], stations[i]\n\t\tn.links[a] = append(n.links[a], b)\n\t\tn.links[b] = append(n.links[b], a)\n\t}\n}\n\nfunc (n *Network) Neighbours(station string) []string {\n\treturn n.links[station]\n}\n",
            "stack-queue-go-metro/metro/planner.go": "package metro\n\n// FewestStops runs breadth-first search. Because the queue hands out stations\n// in the order they were found, the first time we reach the goal is the shortest way.\nfunc FewestStops(n *Network, from, to string) []string {\n\tcameFrom := map[string]string{from: \"\"}\n\tfrontier := &Queue{}\n\tfrontier.Enqueue(from)\n\tfor frontier.Len() > 0 {\n\t\tcurrent := frontier.Dequeue()\n\t\tif current == to {\n\t\t\treturn buildRoute(cameFrom, to)\n\t\t}\n\t\tfor _, next := range n.Neighbours(current) {\n\t\t\tif _, seen := cameFrom[next]; !seen {\n\t\t\t\tcameFrom[next] = current\n\t\t\t\tfrontier.Enqueue(next)\n\t\t\t}\n\t\t}\n\t}\n\treturn nil\n}\n\n// buildRoute follows the cameFrom links backwards onto a stack, then pops them off in travel order.\nfunc buildRoute(cameFrom map[string]string, to string) []string {\n\tbackwards := &Stack{}\n\tfor station := to; station != \"\"; station = cameFrom[station] {\n\t\tbackwards.Push(station)\n\t}\n\troute := []string{}\n\tfor backwards.Len() > 0 {\n\t\troute = append(route, backwards.Pop())\n\t}\n\treturn route\n}\n",
            "stack-queue-go-metro/metro/queue.go": "package metro\n\n// Queue is a FIFO line of station names. BFS needs it to visit stations in rings:\n// first everything 1 stop away, then everything 2 stops away, and so on.\ntype Queue struct {\n\titems []string\n}\n\nfunc (q *Queue) Enqueue(station string) {\n\tq.items = append(q.items, station)\n}\n\nfunc (q *Queue) Dequeue() string {\n\tfront := q.items[0]\n\tq.items = q.items[1:]\n\treturn front\n}\n\nfunc (q *Queue) Len() int {\n\treturn len(q.items)\n}\n",
            "stack-queue-go-metro/metro/stack.go": "package metro\n\n// Stack is a LIFO pile of station names. The route is discovered backwards\n// (destination to start), so pushing then popping turns it the right way round.\ntype Stack struct {\n\titems []string\n}\n\nfunc (s *Stack) Push(station string) {\n\ts.items = append(s.items, station)\n}\n\nfunc (s *Stack) Pop() string {\n\ttop := s.items[len(s.items)-1]\n\ts.items = s.items[:len(s.items)-1]\n\treturn top\n}\n\nfunc (s *Stack) Len() int {\n\treturn len(s.items)\n}\n"
          }
        },
        {
          "id": "stack-queue-py-brackets-real",
          "title": "TheAlgorithms: bracket checker and list-backed queue",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "TheAlgorithms/Python",
            "url": "https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/stacks/balanced_parentheses.py",
            "license": "MIT",
            "note": "stacks/balanced_parentheses.py and queues/queue_by_list.py are verbatim; stacks/stack.py is verbatim except for a trimmed self-test (marked). All from TheAlgorithms/Python at commit 215c1f0 (data_structures/stacks and data_structures/queues). lint_server.py was written for Software City."
          },
          "story": "A tiny lint server: code snippets wait in a FIFO queue and each one is checked for balanced brackets with a LIFO stack. Notice that the real QueueByList.get uses list.pop(0), which is simple but O(n).",
          "roles": {
            "Stack": [
              "stack-queue-py-brackets-real/stacks/stack.py#Stack"
            ],
            "Queue": [
              "stack-queue-py-brackets-real/queues/queue_by_list.py#QueueByList"
            ],
            "Client": [
              "stack-queue-py-brackets-real/stacks/balanced_parentheses.py#balanced_parentheses",
              "stack-queue-py-brackets-real/lint_server.py#lint_all"
            ]
          },
          "trace": [
            {
              "at": "stack-queue-py-brackets-real/lint_server.py#run",
              "say": "run() creates an inbox queue and submits three code snippets for checking."
            },
            {
              "at": "stack-queue-py-brackets-real/queues/queue_by_list.py#QueueByList.put",
              "say": "put() appends to the end of a Python list: the back of the queue."
            },
            {
              "at": "stack-queue-py-brackets-real/lint_server.py#lint_all",
              "say": "lint_all keeps taking the oldest snippet until the queue is empty, so files are checked in the order they arrived."
            },
            {
              "at": "stack-queue-py-brackets-real/queues/queue_by_list.py#QueueByList.get",
              "say": "get() uses list.pop(0). Correct FIFO, but every other item shifts left, so it is O(n); collections.deque avoids that."
            },
            {
              "at": "stack-queue-py-brackets-real/stacks/balanced_parentheses.py#balanced_parentheses",
              "say": "Each opening bracket is pushed. A closing bracket must match the most recently opened one, which is exactly what pop() returns."
            },
            {
              "at": "stack-queue-py-brackets-real/stacks/stack.py#Stack.push",
              "say": "push() refuses to grow past its limit and raises StackOverflowError, a nod to the real call stack."
            },
            {
              "at": "stack-queue-py-brackets-real/stacks/stack.py#Stack.is_empty",
              "say": "is_empty() gives the final verdict: in 'if (a[0] > 1) {' the '{' is still on the stack, so that snippet is reported as unbalanced."
            }
          ],
          "files": {
            "stack-queue-py-brackets-real/lint_server.py": "# Example usage written for Software City (not part of TheAlgorithms/Python).\n# A tiny lint server: files wait in a FIFO queue, and each one is checked with a LIFO stack.\nfrom queues.queue_by_list import QueueByList\nfrom stacks.balanced_parentheses import balanced_parentheses\n\n\ndef submit_files(inbox: QueueByList, snippets: list) -> None:\n    for snippet in snippets:\n        inbox.put(snippet)\n\n\ndef lint_all(inbox: QueueByList) -> None:\n    while len(inbox) > 0:\n        code = inbox.get()\n        verdict = \"ok\" if balanced_parentheses(code) else \"unbalanced brackets\"\n        print(f\"{code!r}: {verdict}\")\n\n\ndef run() -> None:\n    inbox: QueueByList[str] = QueueByList()\n    submit_files(inbox, [\"print(len([1, 2]))\", \"if (a[0] > 1) {\", \"{x: [1, (2)]}\"])\n    lint_all(inbox)\n\n\nif __name__ == \"__main__\":\n    run()\n",
            "stack-queue-py-brackets-real/queues/queue_by_list.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/queues/queue_by_list.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n\"\"\"Queue represented by a Python list\"\"\"\n\nfrom collections.abc import Iterable\n\n\nclass QueueByList[T]:\n    def __init__(self, iterable: Iterable[T] | None = None) -> None:\n        \"\"\"\n        >>> QueueByList()\n        Queue(())\n        >>> QueueByList([10, 20, 30])\n        Queue((10, 20, 30))\n        >>> QueueByList((i**2 for i in range(1, 4)))\n        Queue((1, 4, 9))\n        \"\"\"\n        self.entries: list[T] = list(iterable or [])\n\n    def __len__(self) -> int:\n        \"\"\"\n        >>> len(QueueByList())\n        0\n        >>> from string import ascii_lowercase\n        >>> len(QueueByList(ascii_lowercase))\n        26\n        >>> queue = QueueByList()\n        >>> for i in range(1, 11):\n        ...     queue.put(i)\n        >>> len(queue)\n        10\n        >>> for i in range(2):\n        ...   queue.get()\n        1\n        2\n        >>> len(queue)\n        8\n        \"\"\"\n\n        return len(self.entries)\n\n    def __repr__(self) -> str:\n        \"\"\"\n        >>> queue = QueueByList()\n        >>> queue\n        Queue(())\n        >>> str(queue)\n        'Queue(())'\n        >>> queue.put(10)\n        >>> queue\n        Queue((10,))\n        >>> queue.put(20)\n        >>> queue.put(30)\n        >>> queue\n        Queue((10, 20, 30))\n        \"\"\"\n\n        return f\"Queue({tuple(self.entries)})\"\n\n    def put(self, item: T) -> None:\n        \"\"\"Put `item` to the Queue\n\n        >>> queue = QueueByList()\n        >>> queue.put(10)\n        >>> queue.put(20)\n        >>> len(queue)\n        2\n        >>> queue\n        Queue((10, 20))\n        \"\"\"\n\n        self.entries.append(item)\n\n    def get(self) -> T:\n        \"\"\"\n        Get `item` from the Queue\n\n        >>> queue = QueueByList((10, 20, 30))\n        >>> queue.get()\n        10\n        >>> queue.put(40)\n        >>> queue.get()\n        20\n        >>> queue.get()\n        30\n        >>> len(queue)\n        1\n        >>> queue.get()\n        40\n        >>> queue.get()\n        Traceback (most recent call last):\n            ...\n        IndexError: Queue is empty\n        \"\"\"\n\n        if not self.entries:\n            raise IndexError(\"Queue is empty\")\n        return self.entries.pop(0)\n\n    def rotate(self, rotation: int) -> None:\n        \"\"\"Rotate the items of the Queue `rotation` times\n\n        >>> queue = QueueByList([10, 20, 30, 40])\n        >>> queue\n        Queue((10, 20, 30, 40))\n        >>> queue.rotate(1)\n        >>> queue\n        Queue((20, 30, 40, 10))\n        >>> queue.rotate(2)\n        >>> queue\n        Queue((40, 10, 20, 30))\n        \"\"\"\n\n        put = self.entries.append\n        get = self.entries.pop\n\n        for _ in range(rotation):\n            put(get(0))\n\n    def get_front(self) -> T:\n        \"\"\"Get the front item from the Queue\n\n        >>> queue = QueueByList((10, 20, 30))\n        >>> queue.get_front()\n        10\n        >>> queue\n        Queue((10, 20, 30))\n        >>> queue.get()\n        10\n        >>> queue.get_front()\n        20\n        \"\"\"\n\n        return self.entries[0]\n\n\nif __name__ == \"__main__\":\n    from doctest import testmod\n\n    testmod()\n",
            "stack-queue-py-brackets-real/stacks/balanced_parentheses.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/stacks/balanced_parentheses.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\nfrom .stack import Stack\n\n\ndef balanced_parentheses(parentheses: str) -> bool:\n    \"\"\"Use a stack to check if a string of parentheses is balanced.\n    >>> balanced_parentheses(\"([]{})\")\n    True\n    >>> balanced_parentheses(\"[()]{}{[()()]()}\")\n    True\n    >>> balanced_parentheses(\"[(])\")\n    False\n    >>> balanced_parentheses(\"1+2*3-4\")\n    True\n    >>> balanced_parentheses(\"{}\")\n    True\n    >>> balanced_parentheses(\"))((\")\n    False\n    >>> balanced_parentheses(\"((\")\n    False\n    >>> balanced_parentheses(\"\")\n    True\n    \"\"\"\n    stack: Stack[str] = Stack()\n    bracket_pairs = {\"(\": \")\", \"[\": \"]\", \"{\": \"}\"}\n    for bracket in parentheses:\n        if bracket in bracket_pairs:\n            stack.push(bracket)\n        elif bracket in (\")\", \"]\", \"}\") and (\n            stack.is_empty() or bracket_pairs[stack.pop()] != bracket\n        ):\n            return False\n    return stack.is_empty()\n\n\nif __name__ == \"__main__\":\n    from doctest import testmod\n\n    testmod()\n\n    examples = [\"((()))\", \"((())\", \"(()))\"]\n    print(\"Balanced parentheses demonstration:\\n\")\n    for example in examples:\n        not_str = \"\" if balanced_parentheses(example) else \"not \"\n        print(f\"{example} is {not_str}balanced\")\n",
            "stack-queue-py-brackets-real/stacks/stack.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/stacks/stack.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\nfrom __future__ import annotations\n\nfrom typing import TypeVar\n\nT = TypeVar(\"T\")\n\n\nclass StackOverflowError(BaseException):\n    pass\n\n\nclass StackUnderflowError(BaseException):\n    pass\n\n\nclass Stack[T]:\n    \"\"\"A stack is an abstract data type that serves as a collection of\n    elements with two principal operations: push() and pop(). push() adds an\n    element to the top of the stack, and pop() removes an element from the top\n    of a stack. The order in which elements come off of a stack are\n    Last In, First Out (LIFO).\n    https://en.wikipedia.org/wiki/Stack_(abstract_data_type)\n    \"\"\"\n\n    def __init__(self, limit: int = 10) -> None:\n        self.stack: list[T] = []\n        self.limit = limit\n\n    def __bool__(self) -> bool:\n        return bool(self.stack)\n\n    def __str__(self) -> str:\n        return str(self.stack)\n\n    def push(self, data: T) -> None:\n        \"\"\"\n        Push an element to the top of the stack.\n\n        >>> S = Stack(2) # stack size = 2\n        >>> S.push(10)\n        >>> S.push(20)\n        >>> print(S)\n        [10, 20]\n\n        >>> S = Stack(1) # stack size = 1\n        >>> S.push(10)\n        >>> S.push(20)\n        Traceback (most recent call last):\n        ...\n        data_structures.stacks.stack.StackOverflowError\n\n        \"\"\"\n        if len(self.stack) >= self.limit:\n            raise StackOverflowError\n        self.stack.append(data)\n\n    def pop(self) -> T:\n        \"\"\"\n        Pop an element off of the top of the stack.\n\n        >>> S = Stack()\n        >>> S.push(-5)\n        >>> S.push(10)\n        >>> S.pop()\n        10\n\n        >>> Stack().pop()\n        Traceback (most recent call last):\n            ...\n        data_structures.stacks.stack.StackUnderflowError\n        \"\"\"\n        if not self.stack:\n            raise StackUnderflowError\n        return self.stack.pop()\n\n    def peek(self) -> T:\n        \"\"\"\n        Peek at the top-most element of the stack.\n\n        >>> S = Stack()\n        >>> S.push(-5)\n        >>> S.push(10)\n        >>> S.peek()\n        10\n\n        >>> Stack().peek()\n        Traceback (most recent call last):\n            ...\n        data_structures.stacks.stack.StackUnderflowError\n        \"\"\"\n        if not self.stack:\n            raise StackUnderflowError\n        return self.stack[-1]\n\n    def is_empty(self) -> bool:\n        \"\"\"\n        Check if a stack is empty.\n\n        >>> S = Stack()\n        >>> S.is_empty()\n        True\n\n        >>> S = Stack()\n        >>> S.push(10)\n        >>> S.is_empty()\n        False\n        \"\"\"\n        return not bool(self.stack)\n\n    def is_full(self) -> bool:\n        \"\"\"\n        >>> S = Stack()\n        >>> S.is_full()\n        False\n\n        >>> S = Stack(1)\n        >>> S.push(10)\n        >>> S.is_full()\n        True\n        \"\"\"\n        return self.size() == self.limit\n\n    def size(self) -> int:\n        \"\"\"\n        Return the size of the stack.\n\n        >>> S = Stack(3)\n        >>> S.size()\n        0\n\n        >>> S = Stack(3)\n        >>> S.push(10)\n        >>> S.size()\n        1\n\n        >>> S = Stack(3)\n        >>> S.push(10)\n        >>> S.push(20)\n        >>> S.size()\n        2\n        \"\"\"\n        return len(self.stack)\n\n    def __contains__(self, item: T) -> bool:\n        \"\"\"\n        Check if item is in stack\n\n        >>> S = Stack(3)\n        >>> S.push(10)\n        >>> 10 in S\n        True\n\n        >>> S = Stack(3)\n        >>> S.push(10)\n        >>> 20 in S\n        False\n        \"\"\"\n        return item in self.stack\n\n\n# … trimmed: 55 lines, test_stack() self-test and the __main__ doctest runner, not related to the pattern …\n"
          }
        }
      ]
    },
    {
      "id": "hash-table",
      "name": "Hash Table",
      "family": "Foundations",
      "aka": [
        "Hash map",
        "Dictionary",
        "Associative array",
        "HashMap / dict / Dictionary"
      ],
      "tagline": "Turn a key into an array index, so finding a value takes one jump instead of a search.",
      "intent": "A hash table stores key/value pairs in an array of buckets. A hash function turns each key into a number, and that number modulo the array size picks the bucket, so put and get go straight to the right place in O(1) on average. When two keys land in the same bucket (a collision) the table either chains them in a small list or probes for the next free slot, and it grows and rehashes when it gets too full.",
      "analogy": "A cloakroom: your coat goes on hook 42 and you get ticket 42. Fetching it later means walking straight to hook 42, not checking every coat. If two people would get the same hook, the attendant hangs the second coat on the same hook (chaining) or on the next empty one (probing).",
      "cityShape": "Look for the map's building with a short hash floor that almost every other floor pipes into: Hash in TinyHashMap, hash_function in the Python HashTable. Put/insert floors write the buckets antenna on the roof, Get reads it, and in the Python table insert_data carries a yellow loop pipe: after rehashing it calls itself to retry. In the Rust shop the HashMap is inside std, so you see the everyday side instead: price_of pipes to fetch_price only on a cache miss.",
      "roles": [
        {
          "name": "Hash Function",
          "desc": "Turns a key into a number and then a bucket index. Same key, same index, every time; different keys should spread out evenly."
        },
        {
          "name": "Buckets",
          "desc": "The array behind the table. Each slot holds one entry (open addressing) or a small chain of entries (separate chaining)."
        },
        {
          "name": "Collision Handling",
          "desc": "What happens when two keys want the same slot: append to the chain, probe the next slot, or grow the table and rehash."
        },
        {
          "name": "Client",
          "desc": "Everyday code that uses a map for fast lookups: a phone book, counting votes or search terms, caching slow answers."
        }
      ],
      "whenToUse": [
        "Looking things up by a key (id, name, SKU, grid cell) many times: O(1) instead of scanning a list.",
        "Counting how often things occur (words, votes, item drops) in a single pass.",
        "Caching or memoizing the results of slow work (database calls, pathfinding, fib(n)).",
        "Removing duplicates or remembering 'have I seen this already?' (a set is a hash table without values)."
      ],
      "pitfalls": [
        "A poor hash function (or many keys hashing alike) piles entries into a few buckets and lookups degrade towards O(n).",
        "Keys must not change after insertion: mutating a key object changes its hash, and the entry becomes unfindable.",
        "Hash tables have no useful order; if you need sorted keys or ranges, use a sorted list or a tree instead."
      ],
      "related": [
        "big-o",
        "stack-queue",
        "cache-aside",
        "flyweight",
        "spatial-partition",
        "dynamic-programming"
      ],
      "quiz": [
        {
          "q": "In TinyHashMap, 'Amy' and 'May' land in the same bucket. What does Get(\"May\") do?",
          "options": [
            "Returns Amy's number because the bucket is shared",
            "Throws an error because of the collision",
            "Goes to that bucket and compares keys in its short list until it finds 'May'",
            "Searches every bucket in the map"
          ],
          "answer": 2,
          "why": "The hash only picks the bucket. Inside it, entries are compared by key, so collisions cost a few extra comparisons but never mix up values."
        },
        {
          "q": "Why does a hash table grow and rehash when it gets too full?",
          "options": [
            "To keep keys sorted",
            "Because full buckets or long probe runs make lookups slower, and a bigger array spreads keys out again",
            "Because arrays cannot hold more than 75 items",
            "To change the keys' values"
          ],
          "answer": 1,
          "why": "The O(1) promise depends on short buckets. A higher load factor means more collisions; growing and re-inserting every key restores short chains."
        }
      ],
      "demos": [
        {
          "id": "hash-table-cs-phonebook",
          "title": "A tiny hand-made phone book map",
          "lang": "C#",
          "level": "beginner",
          "source": null,
          "story": "A 4-bucket hash map with a deliberately naive hash (add up the letters), so 'Amy' and 'May' collide and share a bucket. Then the built-in Dictionary counts votes, the same idea used every day.",
          "roles": {
            "Hash Function": [
              "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap.Hash"
            ],
            "Buckets": [
              "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap",
              "hash-table-cs-phonebook/Entry.cs#Entry"
            ],
            "Collision Handling": [
              "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap.Put",
              "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap.Get"
            ],
            "Client": [
              "hash-table-cs-phonebook/Program.cs#Program.Main",
              "hash-table-cs-phonebook/Program.cs#Program.CountVotes"
            ]
          },
          "trace": [
            {
              "at": "hash-table-cs-phonebook/Program.cs#Program.Main",
              "say": "Main() stores three phone numbers. Amy and May use the same letters, which this simple hash cannot tell apart."
            },
            {
              "at": "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap.Hash",
              "say": "Hash adds the letter codes (A+m+y = 295) and takes the remainder by 4, giving bucket 3. M+a+y is also 295: a collision."
            },
            {
              "at": "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap.Put",
              "say": "Put creates the bucket list if needed, overwrites an existing key, or appends. May is chained after Amy in bucket 3."
            },
            {
              "at": "hash-table-cs-phonebook/TinyHashMap.cs#TinyHashMap.Get",
              "say": "Get hashes 'May' to bucket 3 and compares keys only in that short list. Collisions cost a little, they never mix up values."
            },
            {
              "at": "hash-table-cs-phonebook/Program.cs#Program.CountVotes",
              "say": "Everyday use: Dictionary<string,int> counts votes in one pass, each tally[vote] update an O(1) hash lookup."
            }
          ],
          "files": {
            "hash-table-cs-phonebook/Entry.cs": "// One key/value pair stored inside a bucket.\npublic class Entry\n{\n    public string Key;\n    public string Value;\n\n    public Entry(string key, string value)\n    {\n        Key = key;\n        Value = value;\n    }\n}\n",
            "hash-table-cs-phonebook/Program.cs": "using System;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main()\n    {\n        var phonebook = new TinyHashMap();\n        phonebook.Put(\"Amy\", \"555-0101\");\n        phonebook.Put(\"May\", \"555-0199\"); // same letters as Amy, same bucket: a collision\n        phonebook.Put(\"Eve\", \"555-0142\"); // lands in a different bucket\n        Console.WriteLine(\"May: \" + phonebook.Get(\"May\"));\n        Console.WriteLine(\"Amy and May share bucket \" + phonebook.Hash(\"Amy\"));\n\n        CountVotes(new[] { \"pizza\", \"sushi\", \"pizza\", \"tacos\", \"pizza\" });\n    }\n\n    // Everyday use: the built-in Dictionary is the same idea, tuned and ready.\n    public static void CountVotes(string[] votes)\n    {\n        var tally = new Dictionary<string, int>();\n        foreach (string vote in votes)\n        {\n            tally[vote] = tally.GetValueOrDefault(vote) + 1;\n        }\n        Console.WriteLine(\"pizza votes: \" + tally[\"pizza\"]);\n    }\n}\n",
            "hash-table-cs-phonebook/TinyHashMap.cs": "using System.Collections.Generic;\n\n// A hand-made hash map with separate chaining: an array of buckets, each bucket a small list.\npublic class TinyHashMap\n{\n    private List<Entry>[] buckets = new List<Entry>[4];\n\n    // Deliberately simple hash: add up the letters. \"Amy\" and \"May\" get the same number,\n    // so they collide. Real hash functions also mix in each letter's position.\n    public int Hash(string key)\n    {\n        int sum = 0;\n        foreach (char c in key)\n        {\n            sum += c;\n        }\n        return sum % buckets.Length;\n    }\n\n    public void Put(string key, string value)\n    {\n        int index = Hash(key);\n        if (buckets[index] == null)\n        {\n            buckets[index] = new List<Entry>();\n        }\n        foreach (Entry e in buckets[index])\n        {\n            if (e.Key == key)\n            {\n                e.Value = value; // same key: overwrite instead of adding a second entry\n                return;\n            }\n        }\n        buckets[index].Add(new Entry(key, value));\n        // A real map also counts its entries and doubles the bucket array when it gets too full.\n    }\n\n    public string Get(string key)\n    {\n        List<Entry> bucket = buckets[Hash(key)];\n        if (bucket == null)\n        {\n            return null;\n        }\n        foreach (Entry e in bucket)\n        {\n            if (e.Key == key)\n            {\n                return e.Value; // only this one short list is searched, not the whole map\n            }\n        }\n        return null;\n    }\n}\n"
          }
        },
        {
          "id": "hash-table-rs-shop",
          "title": "Shop backend: counting searches and caching prices",
          "lang": "Rust",
          "level": "intermediate",
          "source": null,
          "story": "Everyday hashing in an online shop: counting search terms with the entry API, caching slow price lookups so the database is asked once per product, and hashing a key to pick a server shard. Five basket items cost only two queries.",
          "roles": {
            "Hash Function": [
              "hash-table-rs-shop/src/sharding.rs#shard_for"
            ],
            "Buckets": [
              "hash-table-rs-shop/src/search_stats.rs#SearchStats",
              "hash-table-rs-shop/src/price_cache.rs#PriceCache"
            ],
            "Collision Handling": [
              "hash-table-rs-shop/src/search_stats.rs#SearchStats.record"
            ],
            "Client": [
              "hash-table-rs-shop/src/main.rs#main",
              "hash-table-rs-shop/src/price_cache.rs#PriceCache.price_of",
              "hash-table-rs-shop/src/search_stats.rs#SearchStats.top"
            ]
          },
          "trace": [
            {
              "at": "hash-table-rs-shop/src/main.rs#main",
              "say": "main() feeds six search terms into the stats, then prices a five-item basket through the cache."
            },
            {
              "at": "hash-table-rs-shop/src/search_stats.rs#SearchStats.record",
              "say": "record() normalises the term so 'Socks' and 'socks ' become one key, then entry().or_insert(0) adds 1: insert-or-update in a single hash lookup."
            },
            {
              "at": "hash-table-rs-shop/src/sharding.rs#shard_for",
              "say": "shard_for shows what a HashMap does inside: hash the key, take the remainder, pick a bucket. Here the bucket is one of 4 servers."
            },
            {
              "at": "hash-table-rs-shop/src/search_stats.rs#SearchStats.top",
              "say": "A HashMap has no order, so top() copies the pairs into a Vec and sorts them by count when a ranking is needed."
            },
            {
              "at": "hash-table-rs-shop/src/price_cache.rs#PriceCache.price_of",
              "say": "price_of() checks the map first. SOCK-01 is not there yet, so this is a cache miss."
            },
            {
              "at": "hash-table-rs-shop/src/catalog.rs#Catalog.fetch_price",
              "say": "Only on a miss does the slow catalog run. The answer is stored under the SKU for next time."
            },
            {
              "at": "hash-table-rs-shop/src/price_cache.rs#PriceCache.price_of",
              "say": "The next SOCK-01 is a hit: one hash, one bucket, no database. Result: 2 queries and 3 hits for 5 items."
            },
            {
              "at": "hash-table-rs-shop/src/price_cache.rs#PriceCache.database_queries",
              "say": "database_queries() reports how much work the cache saved, the number you would watch in production."
            }
          ],
          "files": {
            "hash-table-rs-shop/Cargo.toml": "[package]\nname = \"shop\"\nversion = \"0.1.0\"\nedition = \"2021\"\n",
            "hash-table-rs-shop/src/catalog.rs": "// Pretend database: every lookup is slow, which is why the shop wants a cache in front of it.\npub struct Catalog {\n    pub queries: u32,\n}\n\nimpl Catalog {\n    pub fn new() -> Self {\n        Catalog { queries: 0 }\n    }\n\n    pub fn fetch_price(&mut self, sku: &str) -> f64 {\n        self.queries += 1; // imagine 50 ms of network and disk here\n        let cents: u32 = sku.bytes().map(|b| b as u32).sum();\n        cents as f64 / 10.0\n    }\n}\n",
            "hash-table-rs-shop/src/main.rs": "mod catalog;\nmod price_cache;\nmod search_stats;\nmod sharding;\n\nuse catalog::Catalog;\nuse price_cache::PriceCache;\nuse search_stats::SearchStats;\nuse sharding::shard_for;\n\nfn main() {\n    let mut stats = SearchStats::new();\n    for term in [\"Socks\", \"hat\", \"socks \", \"scarf\", \"SOCKS\", \"hat\"] {\n        stats.record(term);\n    }\n    println!(\"top searches: {:?}\", stats.top(2));\n    println!(\"'socks' counter lives on server {}\", shard_for(\"socks\", 4));\n\n    let mut cache = PriceCache::new(Catalog::new());\n    let basket = [\"SOCK-01\", \"HAT-07\", \"SOCK-01\", \"SOCK-01\", \"HAT-07\"];\n    let total: f64 = basket.iter().map(|sku| cache.price_of(sku)).sum();\n    println!(\"basket total {:.2}\", total);\n    println!(\"{} database queries, {} cache hits\", cache.database_queries(), cache.hits);\n}\n",
            "hash-table-rs-shop/src/price_cache.rs": "use std::collections::HashMap;\n\nuse crate::catalog::Catalog;\n\n// Caching: remember answers by key so the slow catalog is asked only once per SKU.\npub struct PriceCache {\n    prices: HashMap<String, f64>,\n    catalog: Catalog,\n    pub hits: u32,\n}\n\nimpl PriceCache {\n    pub fn new(catalog: Catalog) -> Self {\n        PriceCache { prices: HashMap::new(), catalog, hits: 0 }\n    }\n\n    pub fn price_of(&mut self, sku: &str) -> f64 {\n        if let Some(price) = self.prices.get(sku) {\n            self.hits += 1; // O(1) on average: hash the key, jump to its bucket\n            return *price;\n        }\n        let price = self.catalog.fetch_price(sku);\n        self.prices.insert(sku.to_string(), price);\n        price\n    }\n\n    pub fn database_queries(&self) -> u32 {\n        self.catalog.queries\n    }\n}\n",
            "hash-table-rs-shop/src/search_stats.rs": "use std::collections::HashMap;\n\n// Counting: one pass over the log, one map entry per distinct search term.\npub struct SearchStats {\n    counts: HashMap<String, u32>,\n}\n\nimpl SearchStats {\n    pub fn new() -> Self {\n        SearchStats { counts: HashMap::new() }\n    }\n\n    pub fn record(&mut self, term: &str) {\n        let key = term.trim().to_lowercase(); // normalise so \"Socks\" and \"socks \" count together\n        *self.counts.entry(key).or_insert(0) += 1;\n    }\n\n    pub fn top(&self, n: usize) -> Vec<(String, u32)> {\n        let mut pairs: Vec<(String, u32)> = self.counts.iter().map(|(k, v)| (k.clone(), *v)).collect();\n        pairs.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));\n        pairs.truncate(n);\n        pairs\n    }\n}\n",
            "hash-table-rs-shop/src/sharding.rs": "use std::collections::hash_map::DefaultHasher;\nuse std::hash::{Hash, Hasher};\n\n// The same trick a HashMap uses inside, applied across servers:\n// hash the key, take the remainder, and that picks the bucket (here: which server stores it).\npub fn shard_for(key: &str, shard_count: u64) -> u64 {\n    let mut hasher = DefaultHasher::new();\n    key.hash(&mut hasher);\n    hasher.finish() % shard_count\n}\n"
          }
        },
        {
          "id": "hash-table-py-probing-real",
          "title": "TheAlgorithms: linear probing vs chaining",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "TheAlgorithms/Python",
            "url": "https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/hashing/hash_table.py",
            "license": "MIT",
            "note": "Files under hashing/ come from TheAlgorithms/Python at commit 215c1f0 (data_structures/hashing): hash_table_with_linked_list.py and number_theory/prime_numbers.py are verbatim; hash_table.py is verbatim except three long doctest docstrings (marked as trimmed). locker_room.py was written for Software City."
          },
          "story": "A real teaching implementation with both collision strategies: HashTable uses open addressing with linear probing and rehashes into a prime-sized table when full; HashTableWithLinkedList overrides two methods to chain colliding keys in a deque instead.",
          "roles": {
            "Hash Function": [
              "hash-table-py-probing-real/hashing/hash_table.py#HashTable.hash_function"
            ],
            "Buckets": [
              "hash-table-py-probing-real/hashing/hash_table.py#HashTable",
              "hash-table-py-probing-real/hashing/hash_table.py#HashTable._set_value",
              "hash-table-py-probing-real/hashing/hash_table_with_linked_list.py#HashTableWithLinkedList._set_value"
            ],
            "Collision Handling": [
              "hash-table-py-probing-real/hashing/hash_table.py#HashTable._collision_resolution",
              "hash-table-py-probing-real/hashing/hash_table.py#HashTable.rehashing",
              "hash-table-py-probing-real/hashing/hash_table_with_linked_list.py#HashTableWithLinkedList._collision_resolution"
            ],
            "Client": [
              "hash-table-py-probing-real/locker_room.py#assign_with_probing",
              "hash-table-py-probing-real/locker_room.py#assign_with_chaining"
            ]
          },
          "trace": [
            {
              "at": "hash-table-py-probing-real/locker_room.py#assign_with_probing",
              "say": "A 5-slot table receives members 12, 17, 22 and 7. All four give the same remainder, 2, so they all want slot 2."
            },
            {
              "at": "hash-table-py-probing-real/hashing/hash_table.py#HashTable.insert_data",
              "say": "insert_data hashes the key: an empty slot is filled, an equal value is skipped, anything else is a collision."
            },
            {
              "at": "hash-table-py-probing-real/hashing/hash_table.py#HashTable.hash_function",
              "say": "The hash is simply key % size_table. Fine for spread-out integers, terrible for keys that share a remainder like ours."
            },
            {
              "at": "hash-table-py-probing-real/hashing/hash_table.py#HashTable._collision_resolution",
              "say": "Linear probing walks to the next slot until one is free, so 17 lands in 3, 22 in 4, and 7 wraps round to 0."
            },
            {
              "at": "hash-table-py-probing-real/hashing/hash_table.py#HashTable.rehashing",
              "say": "When no slot is free, rehashing picks the next prime above double the size (11) and re-inserts every survivor."
            },
            {
              "at": "hash-table-py-probing-real/hashing/number_theory/prime_numbers.py#next_prime",
              "say": "Prime table sizes make 'key % size' spread keys more evenly, because common patterns in keys rarely share a factor with a prime."
            },
            {
              "at": "hash-table-py-probing-real/locker_room.py#assign_with_chaining",
              "say": "The chained table gets the same four members. This time they can all share slot 2."
            },
            {
              "at": "hash-table-py-probing-real/hashing/hash_table_with_linked_list.py#HashTableWithLinkedList._set_value",
              "say": "The subclass swaps the slot for a deque and appendlefts into it: separate chaining by overriding just two methods."
            }
          ],
          "files": {
            "hash-table-py-probing-real/hashing/hash_table.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/hashing/hash_table.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n#!/usr/bin/env python3\nfrom abc import abstractmethod\n\nfrom .number_theory.prime_numbers import next_prime\n\n\nclass HashTable:\n    \"\"\"\n    Basic Hash Table example with open addressing and linear probing\n    \"\"\"\n\n    def __init__(\n        self,\n        size_table: int,\n        charge_factor: int | None = None,\n        lim_charge: float | None = None,\n    ) -> None:\n        self.size_table = size_table\n        self.values = [None] * self.size_table\n        self.lim_charge = 0.75 if lim_charge is None else lim_charge\n        self.charge_factor = 1 if charge_factor is None else charge_factor\n        self.__aux_list: list = []\n        self._keys: dict = {}\n\n    def keys(self) -> dict:\n        # … trimmed: 23-line docstring of doctest examples for keys() …\n        return self._keys\n\n    def balanced_factor(self) -> float:\n        return sum(1 for slot in self.values if slot is not None) / (\n            self.size_table * self.charge_factor\n        )\n\n    def hash_function(self, key) -> int:\n        \"\"\"\n        Generates hash for the given key value\n\n        Examples:\n\n        Creating HashTable with size 5\n        >>> ht = HashTable(5)\n        >>> ht.hash_function(10)\n        0\n        >>> ht.hash_function(20)\n        0\n        >>> ht.hash_function(4)\n        4\n        >>> ht.hash_function(18)\n        3\n        >>> ht.hash_function(-18)\n        2\n        >>> ht.hash_function(18.5)\n        3.5\n        >>> ht.hash_function(0)\n        0\n        >>> ht.hash_function(-0)\n        0\n        \"\"\"\n        return key % self.size_table\n\n    def _step_by_step(self, step_ord) -> None:\n        print(f\"step {step_ord}\")\n        print(list(range(len(self.values))))\n        print(self.values)\n\n    def bulk_insert(self, values) -> None:\n        # … trimmed: 37-line docstring of doctest examples for bulk_insert() …\n        i = 1\n        self.__aux_list = values\n        for value in values:\n            self.insert_data(value)\n            self._step_by_step(i)\n            i += 1\n\n    def _set_value(self, key, data) -> None:\n        # … trimmed: 41-line docstring of doctest examples for _set_value() …\n        self.values[key] = data\n        self._keys[key] = data\n\n    @abstractmethod\n    def _collision_resolution(self, key, data=None):\n        \"\"\"\n        This method is a type of open addressing which is used for handling collision.\n\n        In this implementation the concept of linear probing has been used.\n\n        The hash table is searched sequentially from the original location of the\n        hash, if the new hash/location we get is already occupied we check for the next\n        hash/location.\n\n        references:\n            - https://en.wikipedia.org/wiki/Linear_probing\n\n        Examples:\n        1. The collision will be with keys 18 & 99, so new hash will be created for 99\n        >>> ht = HashTable(3)\n        >>> ht.insert_data(17)\n        >>> ht.insert_data(18)\n        >>> ht.insert_data(99)\n        >>> ht.keys()\n        {2: 17, 0: 18, 1: 99}\n\n        2. The collision will be with keys 17 & 101, so new hash\n        will be created for 101\n        >>> ht = HashTable(4)\n        >>> ht.insert_data(17)\n        >>> ht.insert_data(18)\n        >>> ht.insert_data(99)\n        >>> ht.insert_data(101)\n        >>> ht.keys()\n        {1: 17, 2: 18, 3: 99, 0: 101}\n\n        2. The collision will be with all keys, so new hash will be created for all\n        >>> ht = HashTable(1)\n        >>> ht.insert_data(17)\n        >>> ht.insert_data(18)\n        >>> ht.insert_data(99)\n        >>> ht.keys()\n        {2: 17, 3: 18, 4: 99}\n\n        3. Trying to insert float key in hash\n        >>> ht = HashTable(1)\n        >>> ht.insert_data(17)\n        >>> ht.insert_data(18)\n        >>> ht.insert_data(99.99)\n        Traceback (most recent call last):\n        ...\n        TypeError: list indices must be integers or slices, not float\n        \"\"\"\n        new_key = self.hash_function(key + 1)\n\n        while self.values[new_key] is not None and self.values[new_key] != key:\n            if self.values.count(None) > 0:\n                new_key = self.hash_function(new_key + 1)\n            else:\n                new_key = None\n                break\n\n        return new_key\n\n    def rehashing(self) -> None:\n        survivor_values = [value for value in self.values if value is not None]\n        self.size_table = next_prime(self.size_table, factor=2)\n        self._keys.clear()\n        self.values = [None] * self.size_table  # hell's pointers D: don't DRY ;/\n        for value in survivor_values:\n            self.insert_data(value)\n\n    def insert_data(self, data) -> None:\n        \"\"\"\n        insert_data is used for inserting a single element at a time in the HashTable.\n\n        Examples:\n\n        >>> ht = HashTable(3)\n        >>> ht.insert_data(5)\n        >>> ht.keys()\n        {2: 5}\n        >>> ht = HashTable(5)\n        >>> ht.insert_data(30)\n        >>> ht.insert_data(50)\n        >>> ht.keys()\n        {0: 30, 1: 50}\n        \"\"\"\n        key = self.hash_function(data)\n\n        if self.values[key] is None:\n            self._set_value(key, data)\n\n        elif self.values[key] == data:\n            pass\n\n        else:\n            collision_resolution = self._collision_resolution(key, data)\n            if collision_resolution is not None:\n                self._set_value(collision_resolution, data)\n            else:\n                self.rehashing()\n                self.insert_data(data)\n\n\nif __name__ == \"__main__\":\n    import doctest\n\n    doctest.testmod()\n",
            "hash-table-py-probing-real/hashing/hash_table_with_linked_list.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/hashing/hash_table_with_linked_list.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\nfrom collections import deque\n\nfrom .hash_table import HashTable\n\n\nclass HashTableWithLinkedList(HashTable):\n    def __init__(self, *args, **kwargs) -> None:\n        super().__init__(*args, **kwargs)\n\n    def _set_value(self, key, data) -> None:\n        self.values[key] = deque() if self.values[key] is None else self.values[key]\n        self.values[key].appendleft(data)\n        self._keys[key] = self.values[key]\n\n    def balanced_factor(self) -> float:\n        return (\n            sum(self.charge_factor - len(slot) for slot in self.values)\n            / self.size_table\n            * self.charge_factor\n        )\n\n    def _collision_resolution(self, key, data=None):\n        if not (\n            len(self.values[key]) == self.charge_factor and self.values.count(None) == 0\n        ):\n            return key\n        return super()._collision_resolution(key, data)\n",
            "hash-table-py-probing-real/hashing/number_theory/prime_numbers.py": "# Source: TheAlgorithms/Python @ 215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/hashing/number_theory/prime_numbers.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n#!/usr/bin/env python3\n\"\"\"\nmodule to operations with prime numbers\n\"\"\"\n\nimport math\n\n\ndef is_prime(number: int) -> bool:\n    \"\"\"Checks to see if a number is a prime in O(sqrt(n)).\n\n    A number is prime if it has exactly two factors: 1 and itself.\n\n    >>> is_prime(0)\n    False\n    >>> is_prime(1)\n    False\n    >>> is_prime(2)\n    True\n    >>> is_prime(3)\n    True\n    >>> is_prime(27)\n    False\n    >>> is_prime(87)\n    False\n    >>> is_prime(563)\n    True\n    >>> is_prime(2999)\n    True\n    >>> is_prime(67483)\n    False\n    \"\"\"\n\n    # precondition\n    assert isinstance(number, int) and (number >= 0), (\n        \"'number' must been an int and positive\"\n    )\n\n    if 1 < number < 4:\n        # 2 and 3 are primes\n        return True\n    elif number < 2 or not number % 2:\n        # Negatives, 0, 1 and all even numbers are not primes\n        return False\n\n    odd_numbers = range(3, int(math.sqrt(number) + 1), 2)\n    return not any(not number % i for i in odd_numbers)\n\n\ndef next_prime(value, factor=1, **kwargs):\n    value = factor * value\n    first_value_val = value\n\n    while not is_prime(value):\n        value += 1 if not (\"desc\" in kwargs and kwargs[\"desc\"] is True) else -1\n\n    if value == first_value_val:\n        return next_prime(value + 1, **kwargs)\n    return value\n",
            "hash-table-py-probing-real/locker_room.py": "# Example usage written for Software City (not part of TheAlgorithms/Python).\n# A gym assigns lockers by member number. Each table maps a member number to a locker slot.\nfrom hashing.hash_table import HashTable\nfrom hashing.hash_table_with_linked_list import HashTableWithLinkedList\n\n\ndef assign_with_probing() -> None:\n    # Open addressing: one member per slot; on a collision walk to the next free slot.\n    lockers = HashTable(5)\n    for member in (12, 17, 22, 7):\n        lockers.insert_data(member)  # all four hash to slot 2 (n % 5 == 2)\n    print(\"probing:\", lockers.keys())\n    lockers.insert_data(3)\n    lockers.insert_data(9)  # table is full: it rehashes into a larger prime-sized table\n    print(\"after rehash:\", lockers.size_table, \"slots\", lockers.keys())\n\n\ndef assign_with_chaining() -> None:\n    # Separate chaining: a slot holds a deque, so colliding members share it.\n    lockers = HashTableWithLinkedList(5, charge_factor=3)\n    for member in (12, 17, 22, 7):\n        lockers.insert_data(member)\n    print(\"chaining:\", lockers.keys())\n\n\ndef run() -> None:\n    assign_with_probing()\n    assign_with_chaining()\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "trees",
      "name": "Trees",
      "family": "Foundations",
      "aka": [
        "Binary search tree",
        "BST",
        "Hierarchy",
        "Scene tree"
      ],
      "tagline": "Nodes that point to children, so you can halve a search or walk a whole hierarchy.",
      "intent": "A tree stores data as nodes linked parent to child, with exactly one path from the root to every node. A binary search tree keeps smaller values on the left and bigger on the right, so each comparison skips half of what is left; general trees (skill trees, folders, Godot scenes) model anything that nests. Almost every tree algorithm is a short recursive function that handles one node and calls itself on the children.",
      "analogy": "A family tree, or the folders on your computer: start at the top, open one folder, then one of its subfolders, and you never have to look inside the folders you skipped.",
      "cityShape": "Look for a node building with almost no floors (just data antennas like left, right, children) and a tree building whose walk, insert and search floors each carry a yellow loop pipe: they call themselves once per child. The client building sends a single call pipe in at the top; the recursion does the rest.",
      "roles": [
        {
          "name": "Node",
          "desc": "Holds one value plus links to its children (left/right in a binary tree, a list in a general tree)."
        },
        {
          "name": "Tree",
          "desc": "Owns the root and offers the public operations: insert, search, size, sorted output."
        },
        {
          "name": "Traversal",
          "desc": "A recursive walk that visits every node in a fixed order: pre-order (me first), in-order (left, me, right) or post-order (children first)."
        },
        {
          "name": "Client",
          "desc": "Builds the tree and asks it questions without caring how the links are arranged."
        }
      ],
      "whenToUse": [
        "You need a collection that stays sorted while you insert, and fast lookups (a BST, or a built-in sorted map built on one).",
        "Your data nests: menus, folders, skill trees, org charts, JSON, HTML, a Godot scene.",
        "You want to answer questions about a whole branch at once (total cost of a subtree, find a node by name anywhere below)."
      ],
      "pitfalls": [
        "Inserting already-sorted data into a plain BST builds a one-sided chain, and every operation drops from O(log n) to O(n). Real libraries use self-balancing trees (red-black, AVL, B-trees).",
        "Very deep trees can overflow the call stack with recursion; switch to an explicit stack or queue for huge or untrusted inputs.",
        "Child links without a parent link make 'go up' and delete awkward; adding parent links means keeping both directions in sync."
      ],
      "related": [
        "recursion",
        "composite",
        "graph-traversal",
        "iterator",
        "big-o",
        "visitor"
      ],
      "quiz": [
        {
          "q": "Why does an in-order walk of a binary search tree print the values sorted?",
          "options": [
            "Because insert() sorts the array each time",
            "Because it visits the whole left subtree (all smaller values), then the node, then the right subtree (all bigger values)",
            "Because it uses a hash table internally",
            "It only does so if the tree is balanced"
          ],
          "answer": 1,
          "why": "The BST rule puts every smaller value on the left and every bigger value on the right, so left, me, right is sorted order at every level."
        },
        {
          "q": "You insert 1, 2, 3, 4, 5 into an empty plain BST. How many comparisons does searching for 5 take?",
          "options": [
            "About log2(5), so 2 or 3",
            "5, because the tree became a straight chain to the right",
            "1, because 5 is the last one inserted",
            "0, because the root remembers the maximum"
          ],
          "answer": 1,
          "why": "Each new value is bigger than all before it, so every node only has a right child. The tree degenerates into a linked list and search is O(n)."
        }
      ],
      "demos": [
        {
          "id": "trees-ts-bst",
          "title": "Dictionary in a binary search tree",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Seven fruit words go into a BST. Notice that insertAt, searchFrom and inOrder all call themselves: each one handles one node and hands the rest to its left or right child.",
          "roles": {
            "Node": [
              "trees-ts-bst/node.ts#TreeNode"
            ],
            "Tree": [
              "trees-ts-bst/bst.ts#WordTree"
            ],
            "Traversal": [
              "trees-ts-bst/bst.ts#WordTree.inOrder"
            ],
            "Client": [
              "trees-ts-bst/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "trees-ts-bst/main.ts#main",
              "say": "main() adds seven words in a mixed order. Mixed order matters: it keeps the tree bushy instead of a long chain."
            },
            {
              "at": "trees-ts-bst/bst.ts#WordTree.insertAt",
              "say": "insertAt compares with the current node and calls itself on the left or right child, until it reaches an empty spot."
            },
            {
              "at": "trees-ts-bst/node.ts#TreeNode.constructor",
              "say": "At the empty spot a new TreeNode is born. Its parent stores it because insertAt returns it."
            },
            {
              "at": "trees-ts-bst/bst.ts#WordTree.searchFrom",
              "say": "Searching 'fig': mango says go left, cherry says go right, fig found. Three steps instead of checking all seven."
            },
            {
              "at": "trees-ts-bst/bst.ts#WordTree.searchFrom",
              "say": "Searching 'lime' ends when the recursion reaches null. Running out of tree means the word is not there."
            },
            {
              "at": "trees-ts-bst/bst.ts#WordTree.sorted",
              "say": "sorted() just starts an in-order walk at the root and collects the words."
            },
            {
              "at": "trees-ts-bst/bst.ts#WordTree.inOrder",
              "say": "Left subtree, then this word, then right subtree. Doing that at every level prints the words alphabetically."
            }
          ],
          "files": {
            "trees-ts-bst/bst.ts": "import { TreeNode } from './node';\n\n// A dictionary stored as a binary search tree.\n// Each step down the tree throws away half of what is left (if the tree is balanced).\nexport class WordTree {\n  private root: TreeNode | null = null;\n  size = 0;\n\n  add(word: string): void {\n    this.root = this.insertAt(this.root, word);\n  }\n\n  // Recursive: walk left or right until we fall off the tree, then hang a new node there.\n  private insertAt(node: TreeNode | null, word: string): TreeNode {\n    if (node === null) {\n      this.size++;\n      return new TreeNode(word);\n    }\n    if (word < node.word) {\n      node.left = this.insertAt(node.left, word);\n    } else if (word > node.word) {\n      node.right = this.insertAt(node.right, word);\n    }\n    return node;\n  }\n\n  has(word: string): boolean {\n    return this.searchFrom(this.root, word);\n  }\n\n  // Recursive search: one comparison decides which half to keep looking in.\n  private searchFrom(node: TreeNode | null, word: string): boolean {\n    if (node === null) {\n      return false;\n    }\n    if (word === node.word) {\n      return true;\n    }\n    if (word < node.word) {\n      return this.searchFrom(node.left, word);\n    }\n    return this.searchFrom(node.right, word);\n  }\n\n  sorted(): string[] {\n    const out: string[] = [];\n    this.inOrder(this.root, out);\n    return out;\n  }\n\n  // In-order walk: left subtree, then me, then right subtree. Gives sorted output for free.\n  private inOrder(node: TreeNode | null, out: string[]): void {\n    if (node === null) {\n      return;\n    }\n    this.inOrder(node.left, out);\n    out.push(node.word);\n    this.inOrder(node.right, out);\n  }\n}\n",
            "trees-ts-bst/main.ts": "import { WordTree } from './bst';\n\nexport function main(): void {\n  const dict = new WordTree();\n  // Inserted in a \"random\" order on purpose: sorted input would make a lopsided tree.\n  for (const w of ['mango', 'cherry', 'pear', 'apple', 'fig', 'plum', 'kiwi']) {\n    dict.add(w);\n  }\n  console.log('has fig?', dict.has('fig'));\n  console.log('has lime?', dict.has('lime'));\n  console.log('alphabetical:', dict.sorted().join(', '));\n}\n\nmain();\n",
            "trees-ts-bst/node.ts": "// One node of a binary search tree: a value and at most two children.\n// Everything smaller goes left, everything bigger goes right.\nexport class TreeNode {\n  word: string;\n  left: TreeNode | null = null;\n  right: TreeNode | null = null;\n\n  constructor(word: string) {\n    this.word = word;\n  }\n\n  isLeaf(): boolean {\n    return this.left === null && this.right === null;\n  }\n}\n"
          }
        },
        {
          "id": "trees-gd-skills",
          "title": "RPG skill tree and the Godot scene tree",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A talent tree where each skill can have any number of children. The same recursive shape that sums costs and finds skills also walks Godot's own scene tree to count nodes and collect buttons.",
          "roles": {
            "Node": [
              "trees-gd-skills/skill_node.gd#SkillNode"
            ],
            "Tree": [
              "trees-gd-skills/skill_menu.gd#build_tree"
            ],
            "Traversal": [
              "trees-gd-skills/skill_node.gd#total_cost",
              "trees-gd-skills/skill_node.gd#print_tree",
              "trees-gd-skills/scene_walker.gd#count_nodes",
              "trees-gd-skills/scene_walker.gd#collect_of_type"
            ],
            "Client": [
              "trees-gd-skills/skill_menu.gd#_ready"
            ]
          },
          "trace": [
            {
              "at": "trees-gd-skills/skill_menu.gd#_ready",
              "say": "The menu builds the skill tree, prints it, sums its cost and unlocks one skill."
            },
            {
              "at": "trees-gd-skills/skill_menu.gd#build_tree",
              "say": "Magic is the root; Fire and Ice are its children; each has its own children. Only the root is kept in a variable."
            },
            {
              "at": "trees-gd-skills/skill_node.gd#print_tree",
              "say": "Pre-order walk: print this skill, then call print_tree on each child with depth + 1, which produces the indentation."
            },
            {
              "at": "trees-gd-skills/skill_node.gd#total_cost",
              "say": "My cost plus each child's total_cost(). The yellow loop pipe runs once per node: 6 skills, 6 calls."
            },
            {
              "at": "trees-gd-skills/skill_menu.gd#unlock",
              "say": "unlock() does not know where Fireball sits; it asks the root to find it."
            },
            {
              "at": "trees-gd-skills/skill_node.gd#find",
              "say": "Depth-first search: check myself, then each child branch, and stop as soon as one branch returns a hit."
            },
            {
              "at": "trees-gd-skills/scene_walker.gd#collect_of_type",
              "say": "Godot scenes are trees too. The same walk over get_children() finds every Button however deeply it is nested."
            },
            {
              "at": "trees-gd-skills/scene_walker.gd#count_nodes",
              "say": "1 for me plus the count of each child subtree: the same shape as total_cost, on real Nodes."
            }
          ],
          "files": {
            "trees-gd-skills/scene_walker.gd": "class_name SceneWalker\nextends RefCounted\n\n# Godot's scene is itself a tree of Nodes. The same recursive walk works on it.\n\n# Count every node below (and including) root.\nstatic func count_nodes(root: Node) -> int:\n\tvar total := 1\n\tfor child in root.get_children():\n\t\ttotal += count_nodes(child)\n\treturn total\n\n# Collect all nodes of one class, e.g. every Button in a menu, however deep they sit.\nstatic func collect_of_type(root: Node, type_name: String, out: Array) -> void:\n\tif root.is_class(type_name):\n\t\tout.append(root)\n\tfor child in root.get_children():\n\t\tcollect_of_type(child, type_name, out)\n",
            "trees-gd-skills/skill_menu.gd": "extends Control\n\nconst SkillNodeScript = preload(\"res://skill_node.gd\")\nconst Walker = preload(\"res://scene_walker.gd\")\n\nvar root_skill: SkillNode\n\nfunc _ready() -> void:\n\troot_skill = build_tree()\n\troot_skill.print_tree()\n\tprint(\"Points to max out the tree: \", root_skill.total_cost())\n\tunlock(\"Fireball\")\n\tvar buttons: Array = []\n\tWalker.collect_of_type(self, \"Button\", buttons)\n\tprint(\"Menu has \", Walker.count_nodes(self), \" nodes and \", buttons.size(), \" buttons\")\n\nfunc build_tree() -> SkillNode:\n\tvar magic := make_skill(\"Magic\", 1)\n\tvar fire := magic.add_child_skill(make_skill(\"Fire\", 2))\n\tfire.add_child_skill(make_skill(\"Fireball\", 3))\n\tfire.add_child_skill(make_skill(\"Fire Wall\", 4))\n\tvar ice := magic.add_child_skill(make_skill(\"Ice\", 2))\n\tice.add_child_skill(make_skill(\"Frost Nova\", 3))\n\treturn magic\n\nfunc make_skill(skill_name: String, cost: int) -> SkillNode:\n\tvar s: SkillNode = SkillNodeScript.new()\n\ts.skill_name = skill_name\n\ts.cost = cost\n\treturn s\n\nfunc unlock(skill_name: String) -> void:\n\tvar skill := root_skill.find(skill_name)\n\tif skill != null:\n\t\tskill.unlocked = true\n\t\troot_skill.print_tree()\n",
            "trees-gd-skills/skill_node.gd": "class_name SkillNode\nextends Resource\n\n# One skill in a talent tree. Unlike a binary tree it can have any number of children.\n@export var skill_name: String\n@export var cost: int = 1\nvar unlocked := false\nvar children: Array[SkillNode] = []\n\nfunc add_child_skill(child: SkillNode) -> SkillNode:\n\tchildren.append(child)\n\treturn child\n\n# Recursive: my cost plus the cost of every skill below me.\nfunc total_cost() -> int:\n\tvar sum := cost\n\tfor child in children:\n\t\tsum += child.total_cost()\n\treturn sum\n\n# Depth-first search by name. Returns null when the branch does not contain it.\nfunc find(wanted: String) -> SkillNode:\n\tif skill_name == wanted:\n\t\treturn self\n\tfor child in children:\n\t\tvar hit := child.find(wanted)\n\t\tif hit != null:\n\t\t\treturn hit\n\treturn null\n\n# Pre-order walk: print me first, then my children indented one level deeper.\nfunc print_tree(depth: int = 0) -> void:\n\tvar mark := \"[x] \" if unlocked else \"[ ] \"\n\tprint(\"  \".repeat(depth) + mark + skill_name + \" (\" + str(cost) + \")\")\n\tfor child in children:\n\t\tchild.print_tree(depth + 1)\n"
          }
        },
        {
          "id": "trees-py-bst-real",
          "title": "TheAlgorithms: binary search tree",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "TheAlgorithms/Python",
            "url": "https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/binary_tree/binary_search_tree.py",
            "license": "MIT",
            "note": "binary_search_tree.py is verbatim from commit 215c1f0 with long doctest docstrings cut and marked; usage.py was written for Software City."
          },
          "story": "A real, community-maintained BST. Insert and search are loops that walk down one path, while the traversals are recursive. Nodes keep a parent link, which makes remove() possible.",
          "roles": {
            "Node": [
              "trees-py-bst-real/binary_search_tree.py#Node"
            ],
            "Tree": [
              "trees-py-bst-real/binary_search_tree.py#BinarySearchTree"
            ],
            "Traversal": [
              "trees-py-bst-real/binary_search_tree.py#inorder",
              "trees-py-bst-real/binary_search_tree.py#postorder",
              "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.inorder",
              "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.preorder_traverse"
            ],
            "Client": [
              "trees-py-bst-real/usage.py#run"
            ]
          },
          "trace": [
            {
              "at": "trees-py-bst-real/usage.py#run",
              "say": "run() inserts nine numbers in one call, then searches, asks for the 3rd smallest, and prints two traversals."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.insert",
              "say": "insert(*values) loops over the arguments and returns self, so calls can be chained."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.__insert",
              "say": "Here the walk down is a while loop instead of recursion: go left or right until a child slot is empty, then link the parent."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.search",
              "say": "search() follows one path from the root. On a balanced tree that is about log2(n) steps."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.find_kth_smallest",
              "say": "k-th smallest = position k in sorted order, so it collects an in-order list and indexes it."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#BinarySearchTree.inorder",
              "say": "The recursive in-order method: left subtree, append me, right subtree. This is where the yellow loop pipe comes from."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#inorder",
              "say": "The module-level inorder builds the same order by joining lists: [*left, node, *right]."
            },
            {
              "at": "trees-py-bst-real/binary_search_tree.py#postorder",
              "say": "Post-order visits children before the parent: the order you need to delete or free a tree safely."
            }
          ],
          "files": {
            "trees-py-bst-real/binary_search_tree.py": "# Source: TheAlgorithms/Python @215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/data_structures/binary_tree/binary_search_tree.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n# … trimmed: 90-line module docstring of doctest examples …\n\nfrom __future__ import annotations\n\nfrom collections.abc import Iterable, Iterator\nfrom dataclasses import dataclass\nfrom typing import Any, Self\n\n\n@dataclass\nclass Node:\n    value: int\n    left: Node | None = None\n    right: Node | None = None\n    parent: Node | None = None  # Added in order to delete a node easier\n\n    def __iter__(self) -> Iterator[int]:\n        # … trimmed: 6-line docstring with doctests …\n        yield from self.left or []\n        yield self.value\n        yield from self.right or []\n\n    def __repr__(self) -> str:\n        from pprint import pformat\n\n        if self.left is None and self.right is None:\n            return str(self.value)\n        return pformat({f\"{self.value}\": (self.left, self.right)}, indent=1)\n\n    @property\n    def is_right(self) -> bool:\n        return bool(self.parent and self is self.parent.right)\n\n\n@dataclass\nclass BinarySearchTree:\n    root: Node | None = None\n\n    def __bool__(self) -> bool:\n        return bool(self.root)\n\n    def __iter__(self) -> Iterator[int]:\n        yield from self.root or []\n\n    def __str__(self) -> str:\n        \"\"\"\n        Return a string of all the Nodes using in order traversal\n        \"\"\"\n        return str(self.root)\n\n    def __reassign_nodes(self, node: Node, new_children: Node | None) -> None:\n        if new_children is not None:  # reset its kids\n            new_children.parent = node.parent\n        if node.parent is not None:  # reset its parent\n            if node.is_right:  # If it is the right child\n                node.parent.right = new_children\n            else:\n                node.parent.left = new_children\n        else:\n            self.root = new_children\n\n    def empty(self) -> bool:\n        # … trimmed: 11-line docstring with doctests …\n        return not self.root\n\n    def __insert(self, value) -> None:\n        \"\"\"\n        Insert a new node in Binary Search Tree with value label\n        \"\"\"\n        new_node = Node(value)  # create a new Node\n        if self.empty():  # if Tree is empty\n            self.root = new_node  # set its root\n        else:  # Tree is not empty\n            parent_node = self.root  # from root\n            if parent_node is None:\n                return\n            while True:  # While we don't get to a leaf\n                if value < parent_node.value:  # We go left\n                    if parent_node.left is None:\n                        parent_node.left = new_node  # We insert the new node in a leaf\n                        break\n                    parent_node = parent_node.left\n                elif parent_node.right is None:\n                    parent_node.right = new_node\n                    break\n                else:\n                    parent_node = parent_node.right\n            new_node.parent = parent_node\n\n    def insert(self, *values) -> Self:\n        for value in values:\n            self.__insert(value)\n        return self\n\n    def search(self, value) -> Node | None:\n        # … trimmed: 23-line docstring with doctests …\n\n        if self.empty():\n            raise IndexError(\"Warning: Tree is empty! please use another.\")\n        node = self.root\n        # use lazy evaluation here to avoid NoneType Attribute error\n        while node is not None and node.value is not value:\n            node = node.left if value < node.value else node.right\n        return node\n\n    def get_max(self, node: Node | None = None) -> Node | None:\n        # … trimmed: 12-line docstring with doctests …\n        if node is None:\n            if self.root is None:\n                return None\n            node = self.root\n\n        if not self.empty():\n            while node.right is not None:\n                node = node.right\n        return node\n\n    def get_min(self, node: Node | None = None) -> Node | None:\n        # … trimmed: 12-line docstring with doctests …\n        if node is None:\n            node = self.root\n        if self.root is None:\n            return None\n        if not self.empty():\n            node = self.root\n            while node.left is not None:\n                node = node.left\n        return node\n\n    def remove(self, value: int) -> None:\n        # Look for the node with that label\n        node = self.search(value)\n        if node is None:\n            msg = f\"Value {value} not found\"\n            raise ValueError(msg)\n\n        if node.left is None and node.right is None:  # If it has no children\n            self.__reassign_nodes(node, None)\n        elif node.left is None:  # Has only right children\n            self.__reassign_nodes(node, node.right)\n        elif node.right is None:  # Has only left children\n            self.__reassign_nodes(node, node.left)\n        else:\n            predecessor = self.get_max(\n                node.left\n            )  # Gets the max value of the left branch\n            self.remove(predecessor.value)  # type: ignore[union-attr]\n            node.value = (\n                predecessor.value  # type: ignore[union-attr]\n            )  # Assigns the value to the node to delete and keep tree structure\n\n    def preorder_traverse(self, node: Node | None) -> Iterable:\n        if node is not None:\n            yield node  # Preorder Traversal\n            yield from self.preorder_traverse(node.left)\n            yield from self.preorder_traverse(node.right)\n\n    def traversal_tree(self, traversal_function=None) -> Any:\n        \"\"\"\n        This function traversal the tree.\n        You can pass a function to traversal the tree as needed by client code\n        \"\"\"\n        if traversal_function is None:\n            return self.preorder_traverse(self.root)\n        else:\n            return traversal_function(self.root)\n\n    def inorder(self, arr: list, node: Node | None) -> None:\n        \"\"\"Perform an inorder traversal and append values of the nodes to\n        a list named arr\"\"\"\n        if node:\n            self.inorder(arr, node.left)\n            arr.append(node.value)\n            self.inorder(arr, node.right)\n\n    def find_kth_smallest(self, k: int, node: Node) -> int:\n        \"\"\"Return the kth smallest element in a binary search tree\"\"\"\n        arr: list[int] = []\n        self.inorder(arr, node)  # append all values to list using inorder traversal\n        return arr[k - 1]\n\n\ndef inorder(curr_node: Node | None) -> list[Node]:\n    \"\"\"\n    inorder (left, self, right)\n    \"\"\"\n    node_list = []\n    if curr_node is not None:\n        node_list = [*inorder(curr_node.left), curr_node, *inorder(curr_node.right)]\n    return node_list\n\n\ndef postorder(curr_node: Node | None) -> list[Node]:\n    \"\"\"\n    postOrder (left, right, self)\n    \"\"\"\n    node_list = []\n    if curr_node is not None:\n        node_list = postorder(curr_node.left) + postorder(curr_node.right) + [curr_node]\n    return node_list\n\n\n# … trimmed: doctest runner under if __name__ == \"__main__\" …\n",
            "trees-py-bst-real/usage.py": "# Example usage written for Software City (not part of TheAlgorithms/Python).\nfrom .binary_search_tree import BinarySearchTree, inorder, postorder\n\n\ndef run() -> None:\n    # The same numbers as the tree drawn in the original module docstring:\n    #           8\n    #          / \\\n    #         3   10\n    #        / \\    \\\n    #       1   6    14\n    #          / \\   /\n    #         4   7 13\n    tree = BinarySearchTree().insert(8, 3, 6, 1, 10, 14, 13, 4, 7)\n    print(\"6 found:\", tree.search(6) is not None)\n    print(\"3rd smallest:\", tree.find_kth_smallest(3, tree.root))\n    print(\"in-order:\", [n.value for n in inorder(tree.root)])\n    print(\"post-order:\", [n.value for n in postorder(tree.root)])\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "graph-traversal",
      "name": "Graph Traversal (BFS & DFS)",
      "family": "Foundations",
      "aka": [
        "Breadth-first search",
        "Depth-first search",
        "BFS",
        "DFS",
        "Pathfinding",
        "Flood fill"
      ],
      "tagline": "Visit every reachable node of a network once, nearest first (BFS) or deepest first (DFS).",
      "intent": "A graph is nodes plus edges, with no single root and possibly cycles, so a search must remember what it has already seen. Breadth-first search keeps a queue and explores in rings, which finds the fewest-steps path; depth-first search uses a stack (or recursion) and dives down one branch first, which suits reachability, cycle checks and dependency ordering. Swap the queue for a priority queue keyed by distance and you get Dijkstra, the basis of weighted pathfinding and A*.",
      "analogy": "Looking for a lost cat. BFS is checking every house on your street, then every house one street over. DFS is following one road as far as it goes, then coming back to the last crossing and trying the next road.",
      "cityShape": "Look for a small graph building that only answers 'who are my neighbours?' and a search building whose main floor sends a call pipe to that neighbours floor again and again from inside a while loop. The recursive DFS floor carries a yellow loop pipe; BFS and Dijkstra floors have none, because the queue or heap does the remembering instead of the call stack.",
      "roles": [
        {
          "name": "Graph",
          "desc": "The nodes and their edges, usually an adjacency list (node -> list of neighbours) or a grid whose neighbours are computed on the fly."
        },
        {
          "name": "Search",
          "desc": "The traversal itself: take a node from the frontier, look at its neighbours, add the unseen ones."
        },
        {
          "name": "Frontier & Visited",
          "desc": "The bookkeeping: a queue (BFS), stack (DFS) or priority queue (Dijkstra) of nodes to explore, plus a visited set or came-from map so nothing is processed twice."
        },
        {
          "name": "Client",
          "desc": "Builds the graph and asks a question: is B reachable, what is the shortest route, in what order should tasks run?"
        }
      ],
      "whenToUse": [
        "Shortest path when every step costs the same: grid movement in games, fewest metro stops, degrees of separation (BFS).",
        "Reachability, connected regions, flood fill, cycle detection and dependency/build ordering (DFS, topological sort).",
        "Shortest path when edges have different costs, like travel time or terrain (Dijkstra; A* adds a distance-to-goal guess to search fewer cells)."
      ],
      "pitfalls": [
        "Forgetting the visited set: on a graph with cycles the search loops forever or explodes in size. Mark a node when you add it to the frontier, not only when you take it out.",
        "BFS gives the fewest edges, not the cheapest route. With weighted edges you need Dijkstra or A*.",
        "Recursive DFS can overflow the call stack on large graphs (a 1000x1000 grid); use an explicit stack."
      ],
      "related": [
        "trees",
        "stack-queue",
        "recursion",
        "hash-table",
        "big-o",
        "dynamic-programming"
      ],
      "quiz": [
        {
          "q": "Why does BFS find the path with the fewest steps on an unweighted grid?",
          "options": [
            "Because it always turns towards the goal",
            "Because the queue makes it finish every cell k steps away before any cell k+1 steps away, so the first time it reaches the goal is via a shortest path",
            "Because it tries every possible path and keeps the best",
            "It does not; only DFS guarantees that"
          ],
          "answer": 1,
          "why": "First in, first out means the search grows in rings of equal distance. The goal is reached in the earliest ring that contains it."
        },
        {
          "q": "In the real Dijkstra demo, Home to Mall is 2 roads via the Bakery but Dijkstra returns the 3-road route through the Park and Lake. Why?",
          "options": [
            "Dijkstra has a bug",
            "Dijkstra minimises total edge cost (minutes), and 2 + 3 + 2 = 7 beats 4 + 6 = 10",
            "The heap sorts by node name",
            "Dijkstra prefers longer paths to explore more"
          ],
          "answer": 1,
          "why": "The priority queue always expands the cheapest known total cost next, so fewer edges can still lose to a cheaper sum."
        }
      ],
      "demos": [
        {
          "id": "graph-traversal-java-metro",
          "title": "Metro map: fewest stops and reachability",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "A tiny metro network as an adjacency list. BFS with a queue finds the route with the fewest stops; recursive DFS lists every station you can reach and shows that Airport is on a separate line.",
          "roles": {
            "Graph": [
              "graph-traversal-java-metro/MetroMap.java#MetroMap"
            ],
            "Search": [
              "graph-traversal-java-metro/RouteFinder.java#RouteFinder.fewestStops",
              "graph-traversal-java-metro/RouteFinder.java#RouteFinder.reachable"
            ],
            "Frontier & Visited": [
              "graph-traversal-java-metro/RouteFinder.java#RouteFinder.rebuild"
            ],
            "Client": [
              "graph-traversal-java-metro/Main.java#Main.main"
            ]
          },
          "trace": [
            {
              "at": "graph-traversal-java-metro/Main.java#Main.main",
              "say": "main() connects six stations. Airport and Depot form their own little island with no link to the rest."
            },
            {
              "at": "graph-traversal-java-metro/MetroMap.java#MetroMap.connect",
              "say": "Each connection is stored in both directions because trains run both ways. That makes this an undirected graph."
            },
            {
              "at": "graph-traversal-java-metro/RouteFinder.java#RouteFinder.fewestStops",
              "say": "BFS: poll a station, add its unseen neighbours to the back of the queue. cameFrom doubles as the visited set."
            },
            {
              "at": "graph-traversal-java-metro/MetroMap.java#MetroMap.neighbours",
              "say": "The search only ever asks one question of the graph: who is one stop away from here?"
            },
            {
              "at": "graph-traversal-java-metro/RouteFinder.java#RouteFinder.rebuild",
              "say": "Stadium reached. Following cameFrom back gives Stadium, Museum, Market, Harbor; reversing it gives the route."
            },
            {
              "at": "graph-traversal-java-metro/RouteFinder.java#RouteFinder.reachable",
              "say": "DFS: mark this station, then call reachable() on each neighbour. seen.add() returning false stops the cycle Market-Museum-Stadium-Park."
            },
            {
              "at": "graph-traversal-java-metro/RouteFinder.java#RouteFinder.reachable",
              "say": "The recursion unwinds when every branch is seen. Airport never appears: it is in a different connected component."
            }
          ],
          "files": {
            "graph-traversal-java-metro/Main.java": "import java.util.LinkedHashSet;\nimport java.util.Set;\n\npublic class Main {\n    public static void main(String[] args) {\n        MetroMap metro = new MetroMap();\n        metro.connect(\"Harbor\", \"Market\");\n        metro.connect(\"Market\", \"Museum\");\n        metro.connect(\"Museum\", \"Stadium\");\n        metro.connect(\"Market\", \"Park\");\n        metro.connect(\"Park\", \"Stadium\");\n        metro.connect(\"Airport\", \"Depot\");\n\n        RouteFinder finder = new RouteFinder(metro);\n        System.out.println(finder.fewestStops(\"Harbor\", \"Stadium\"));\n\n        Set<String> seen = new LinkedHashSet<>();\n        finder.reachable(\"Harbor\", seen);\n        System.out.println(\"Reachable from Harbor: \" + seen);\n        System.out.println(\"Airport reachable? \" + seen.contains(\"Airport\"));\n    }\n}\n",
            "graph-traversal-java-metro/MetroMap.java": "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\n// A graph stored as an adjacency list: each station maps to the stations one stop away.\npublic class MetroMap {\n    private final Map<String, List<String>> links = new HashMap<>();\n\n    // Tracks run both ways, so every connection is added twice.\n    public void connect(String a, String b) {\n        links.computeIfAbsent(a, k -> new ArrayList<>()).add(b);\n        links.computeIfAbsent(b, k -> new ArrayList<>()).add(a);\n    }\n\n    public List<String> neighbours(String station) {\n        return links.getOrDefault(station, List.of());\n    }\n}\n",
            "graph-traversal-java-metro/RouteFinder.java": "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.Queue;\nimport java.util.Set;\n\npublic class RouteFinder {\n    private final MetroMap map;\n\n    public RouteFinder(MetroMap map) {\n        this.map = map;\n    }\n\n    // Breadth-first search: explore in rings (1 stop away, then 2, ...).\n    // The first time we reach the goal we have used the fewest stops.\n    public List<String> fewestStops(String from, String to) {\n        Queue<String> queue = new ArrayDeque<>();\n        Map<String, String> cameFrom = new HashMap<>();\n        queue.add(from);\n        cameFrom.put(from, null);\n        while (!queue.isEmpty()) {\n            String here = queue.poll();\n            if (here.equals(to)) {\n                return rebuild(cameFrom, to);\n            }\n            for (String next : map.neighbours(here)) {\n                if (!cameFrom.containsKey(next)) {\n                    cameFrom.put(next, here);\n                    queue.add(next);\n                }\n            }\n        }\n        return List.of();\n    }\n\n    // Follow the breadcrumbs back from the goal, then flip them.\n    private List<String> rebuild(Map<String, String> cameFrom, String to) {\n        List<String> path = new ArrayList<>();\n        for (String s = to; s != null; s = cameFrom.get(s)) {\n            path.add(s);\n        }\n        Collections.reverse(path);\n        return path;\n    }\n\n    // Depth-first search: go as deep as possible down one branch, then back up.\n    public void reachable(String station, Set<String> seen) {\n        if (!seen.add(station)) {\n            return;\n        }\n        for (String next : map.neighbours(station)) {\n            reachable(next, seen);\n        }\n    }\n}\n"
          }
        },
        {
          "id": "graph-traversal-gd-grid",
          "title": "Enemy pathfinding on a tile grid",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "The level is a grid of strings; every free cell is a graph node. The enemy asks the Pathfinder for a BFS path around the walls and follows it cell by cell. distance_map shows the goal-less flood fill many enemies can share.",
          "roles": {
            "Graph": [
              "graph-traversal-gd-grid/nav_grid.gd#NavGrid"
            ],
            "Search": [
              "graph-traversal-gd-grid/pathfinder.gd#find_path",
              "graph-traversal-gd-grid/pathfinder.gd#distance_map"
            ],
            "Frontier & Visited": [
              "graph-traversal-gd-grid/pathfinder.gd#rebuild"
            ],
            "Client": [
              "graph-traversal-gd-grid/enemy.gd#_ready",
              "graph-traversal-gd-grid/enemy.gd#chase"
            ]
          },
          "trace": [
            {
              "at": "graph-traversal-gd-grid/enemy.gd#_ready",
              "say": "The enemy builds a NavGrid from five text rows ('#' is a wall) and a Pathfinder over it, then chases a cell behind the walls."
            },
            {
              "at": "graph-traversal-gd-grid/enemy.gd#chase",
              "say": "It converts its pixel position to a cell and asks for a path. It never looks at the walls itself."
            },
            {
              "at": "graph-traversal-gd-grid/pathfinder.gd#find_path",
              "say": "BFS with an array used as a queue: pop_front takes the oldest cell, append adds new ones at the back."
            },
            {
              "at": "graph-traversal-gd-grid/nav_grid.gd#neighbours",
              "say": "Edges are not stored. The grid computes them on demand: the up to four free cells next to this one."
            },
            {
              "at": "graph-traversal-gd-grid/nav_grid.gd#is_walkable",
              "say": "Out of bounds or a wall means no edge. This is where level design becomes graph structure."
            },
            {
              "at": "graph-traversal-gd-grid/pathfinder.gd#rebuild",
              "say": "came_from records which cell discovered each cell; walking it backwards from the goal gives the shortest path."
            },
            {
              "at": "graph-traversal-gd-grid/enemy.gd#_physics_process",
              "say": "Each frame the enemy moves toward path[0] and drops it when reached. Pathfinding runs once; following is cheap."
            },
            {
              "at": "graph-traversal-gd-grid/pathfinder.gd#distance_map",
              "say": "The same BFS without a goal labels every cell with its distance from the player: one search can guide every enemy."
            }
          ],
          "files": {
            "graph-traversal-gd-grid/enemy.gd": "extends CharacterBody2D\n\nconst NavGridScript = preload(\"res://nav_grid.gd\")\nconst PathfinderScript = preload(\"res://pathfinder.gd\")\nconst TILE := 16\n\nvar finder: Pathfinder\nvar path: Array[Vector2i] = []\n@export var speed := 60.0\n\nfunc _ready() -> void:\n\tvar level: Array[String] = [\n\t\t\"..........\",\n\t\t\".####.###.\",\n\t\t\"....#...#.\",\n\t\t\".##.###.#.\",\n\t\t\"..........\",\n\t]\n\tfinder = PathfinderScript.new(NavGridScript.new(level))\n\tchase(Vector2i(9, 2))\n\nfunc chase(target_cell: Vector2i) -> void:\n\tvar my_cell := Vector2i(position / TILE)\n\tpath = finder.find_path(my_cell, target_cell)\n\tif not path.is_empty():\n\t\tpath.pop_front()\n\n# Each frame, steer towards the next cell of the path and drop it once reached.\nfunc _physics_process(delta: float) -> void:\n\tif path.is_empty():\n\t\treturn\n\tvar target := Vector2(path[0] * TILE)\n\tposition = position.move_toward(target, speed * delta)\n\tif position.distance_to(target) < 1.0:\n\t\tpath.pop_front()\n",
            "graph-traversal-gd-grid/nav_grid.gd": "class_name NavGrid\nextends RefCounted\n\n# A tile map seen as a graph: every free cell is a vertex,\n# and it has an edge to each free cell directly next to it.\nconst DIRS := [Vector2i.RIGHT, Vector2i.DOWN, Vector2i.LEFT, Vector2i.UP]\n\nvar rows: Array[String] = []\n\nfunc _init(level_rows: Array[String]) -> void:\n\trows = level_rows\n\nfunc is_walkable(cell: Vector2i) -> bool:\n\tif cell.y < 0 or cell.y >= rows.size():\n\t\treturn false\n\tif cell.x < 0 or cell.x >= rows[cell.y].length():\n\t\treturn false\n\treturn rows[cell.y][cell.x] != \"#\"\n\n# The edges of the graph are computed on demand instead of stored.\nfunc neighbours(cell: Vector2i) -> Array[Vector2i]:\n\tvar out: Array[Vector2i] = []\n\tfor d in DIRS:\n\t\tif is_walkable(cell + d):\n\t\t\tout.append(cell + d)\n\treturn out\n",
            "graph-traversal-gd-grid/pathfinder.gd": "class_name Pathfinder\nextends RefCounted\n\nvar grid: NavGrid\n\nfunc _init(nav_grid: NavGrid) -> void:\n\tgrid = nav_grid\n\n# Breadth-first search from start. On a grid where every step costs the same,\n# the first time BFS reaches the goal it has found a shortest path.\nfunc find_path(start: Vector2i, goal: Vector2i) -> Array[Vector2i]:\n\tvar frontier: Array[Vector2i] = [start]\n\tvar came_from := {start: start}\n\twhile not frontier.is_empty():\n\t\tvar current: Vector2i = frontier.pop_front()\n\t\tif current == goal:\n\t\t\treturn rebuild(came_from, start, goal)\n\t\tfor next in grid.neighbours(current):\n\t\t\tif not came_from.has(next):\n\t\t\t\tcame_from[next] = current\n\t\t\t\tfrontier.append(next)\n\treturn []\n\n# Walk the came_from links backwards from the goal, then reverse.\nfunc rebuild(came_from: Dictionary, start: Vector2i, goal: Vector2i) -> Array[Vector2i]:\n\tvar path: Array[Vector2i] = [goal]\n\tvar cell := goal\n\twhile cell != start:\n\t\tcell = came_from[cell]\n\t\tpath.append(cell)\n\tpath.reverse()\n\treturn path\n\n# A flood fill is the same BFS without a goal: how many steps to every cell?\n# Many enemies can then share one map and just walk \"downhill\" towards the player.\nfunc distance_map(from: Vector2i) -> Dictionary:\n\tvar dist := {from: 0}\n\tvar frontier: Array[Vector2i] = [from]\n\twhile not frontier.is_empty():\n\t\tvar current: Vector2i = frontier.pop_front()\n\t\tfor next in grid.neighbours(current):\n\t\t\tif not dist.has(next):\n\t\t\t\tdist[next] = dist[current] + 1\n\t\t\t\tfrontier.append(next)\n\treturn dist\n"
          }
        },
        {
          "id": "graph-traversal-py-real",
          "title": "TheAlgorithms: BFS, DFS and Dijkstra",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "TheAlgorithms/Python",
            "url": "https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/graphs/dijkstra.py",
            "license": "MIT",
            "note": "dijkstra.py, breadth_first_search_2.py and depth_first_search.py are verbatim from graphs/ at commit 215c1f0, with benchmark code and extra sample graphs cut and marked; usage.py was written for Software City."
          },
          "story": "Three real traversals side by side. They are the same loop with a different container: a deque (BFS), a list used as a stack (DFS) and a heap ordered by cost (Dijkstra). Bonus: depth_first_search has a real bug to spot.",
          "roles": {
            "Graph": [
              "graph-traversal-py-real/usage.py#ROADS",
              "graph-traversal-py-real/usage.py#MINUTES"
            ],
            "Search": [
              "graph-traversal-py-real/breadth_first_search_2.py#breadth_first_search_with_deque",
              "graph-traversal-py-real/breadth_first_search_2.py#breadth_first_search",
              "graph-traversal-py-real/depth_first_search.py#depth_first_search",
              "graph-traversal-py-real/dijkstra.py#dijkstra"
            ],
            "Frontier & Visited": [
              "graph-traversal-py-real/dijkstra.py#dijkstra"
            ],
            "Client": [
              "graph-traversal-py-real/usage.py#run"
            ]
          },
          "trace": [
            {
              "at": "graph-traversal-py-real/usage.py#run",
              "say": "run() explores one road network three ways. ROADS is unweighted; MINUTES is the same roads with travel times."
            },
            {
              "at": "graph-traversal-py-real/breadth_first_search_2.py#breadth_first_search_with_deque",
              "say": "BFS: popleft() takes the oldest node, so nodes come out in rings: Home, then Bakery and Park, then School, Mall, Lake."
            },
            {
              "at": "graph-traversal-py-real/breadth_first_search_2.py#breadth_first_search",
              "say": "The same algorithm with queue.Queue. The authors' benchmark found deque about 15x faster, because Queue adds thread locking."
            },
            {
              "at": "graph-traversal-py-real/depth_first_search.py#depth_first_search",
              "say": "DFS: stack.pop() takes the newest node, so the search dives deep first. Reversing neighbours keeps the natural left-to-right order."
            },
            {
              "at": "graph-traversal-py-real/depth_first_search.py#depth_first_search",
              "say": "Spot the bug: set(start) splits 'Home' into letters H, o, m, e. set([start]) or {start} was meant. Single-letter tests hid it."
            },
            {
              "at": "graph-traversal-py-real/dijkstra.py#dijkstra",
              "say": "Dijkstra: heappop always returns the cheapest total so far, so the first time a node is popped its cost is final."
            },
            {
              "at": "graph-traversal-py-real/dijkstra.py#dijkstra",
              "say": "Home to Mall: 2 roads via Bakery cost 10 minutes, 3 roads via Park and Lake cost 7. The heap finds the 7."
            }
          ],
          "files": {
            "graph-traversal-py-real/breadth_first_search_2.py": "# Source: TheAlgorithms/Python @215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/graphs/breadth_first_search_2.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n\"\"\"\nhttps://en.wikipedia.org/wiki/Breadth-first_search\npseudo-code:\nbreadth_first_search(graph G, start vertex s):\n// all nodes initially unexplored\nmark s as explored\nlet Q = queue data structure, initialized with s\nwhile Q is non-empty:\n    remove the first node of Q, call it v\n    for each edge(v, w):  // for w in graph[v]\n        if w unexplored:\n            mark w as explored\n            add w to Q (at the end)\n\"\"\"\n\nfrom __future__ import annotations\n\nfrom collections import deque\nfrom queue import Queue\n# … trimmed: from timeit import timeit (only used by the benchmark) …\n\nG = {\n    \"A\": [\"B\", \"C\"],\n    \"B\": [\"A\", \"D\", \"E\"],\n    \"C\": [\"A\", \"F\"],\n    \"D\": [\"B\"],\n    \"E\": [\"B\", \"F\"],\n    \"F\": [\"C\", \"E\"],\n}\n\n\ndef breadth_first_search(graph: dict, start: str) -> list[str]:\n    \"\"\"\n    Implementation of breadth first search using queue.Queue.\n\n    >>> ''.join(breadth_first_search(G, 'A'))\n    'ABCDEF'\n    \"\"\"\n    explored = {start}\n    result = [start]\n    queue: Queue = Queue()\n    queue.put(start)\n    while not queue.empty():\n        v = queue.get()\n        for w in graph[v]:\n            if w not in explored:\n                explored.add(w)\n                result.append(w)\n                queue.put(w)\n    return result\n\n\ndef breadth_first_search_with_deque(graph: dict, start: str) -> list[str]:\n    \"\"\"\n    Implementation of breadth first search using collection.queue.\n\n    >>> ''.join(breadth_first_search_with_deque(G, 'A'))\n    'ABCDEF'\n    \"\"\"\n    visited = {start}\n    result = [start]\n    queue = deque([start])\n    while queue:\n        v = queue.popleft()\n        for child in graph[v]:\n            if child not in visited:\n                visited.add(child)\n                result.append(child)\n                queue.append(child)\n    return result\n\n\n# … trimmed: benchmark_function and the __main__ timing block (not about traversal) …\n",
            "graph-traversal-py-real/depth_first_search.py": "# Source: TheAlgorithms/Python @215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/graphs/depth_first_search.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n\"\"\"Non recursive implementation of a DFS algorithm.\"\"\"\n\nfrom __future__ import annotations\n\n\ndef depth_first_search(graph: dict, start: str) -> set[str]:\n    \"\"\"Depth First Search on Graph\n    :param graph: directed graph in dictionary format\n    :param start: starting vertex as a string\n    :returns: the trace of the search\n    >>> input_G = { \"A\": [\"B\", \"C\", \"D\"], \"B\": [\"A\", \"D\", \"E\"],\n    ... \"C\": [\"A\", \"F\"], \"D\": [\"B\", \"D\"], \"E\": [\"B\", \"F\"],\n    ... \"F\": [\"C\", \"E\", \"G\"], \"G\": [\"F\"] }\n    >>> output_G = list({'A', 'B', 'C', 'D', 'E', 'F', 'G'})\n    >>> all(x in output_G for x in list(depth_first_search(input_G, \"A\")))\n    True\n    >>> all(x in output_G for x in list(depth_first_search(input_G, \"G\")))\n    True\n    \"\"\"\n    explored, stack = set(start), [start]\n\n    while stack:\n        v = stack.pop()\n        explored.add(v)\n        # Differences from BFS:\n        # 1) pop last element instead of first one\n        # 2) add adjacent elements to stack without exploring them\n        for adj in reversed(graph[v]):\n            if adj not in explored:\n                stack.append(adj)\n    return explored\n\n\nG = {\n    \"A\": [\"B\", \"C\", \"D\"],\n    \"B\": [\"A\", \"D\", \"E\"],\n    \"C\": [\"A\", \"F\"],\n    \"D\": [\"B\", \"D\"],\n    \"E\": [\"B\", \"F\"],\n    \"F\": [\"C\", \"E\", \"G\"],\n    \"G\": [\"F\"],\n}\n\nif __name__ == \"__main__\":\n    import doctest\n\n    doctest.testmod()\n    print(depth_first_search(G, \"A\"))\n",
            "graph-traversal-py-real/dijkstra.py": "# Source: TheAlgorithms/Python @215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/graphs/dijkstra.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n\"\"\"\npseudo-code\n\nDIJKSTRA(graph G, start vertex s, destination vertex d):\n\n// all nodes initially unexplored\n\n1 -  let H = min heap data structure, initialized with (0, s)\n     // 0 is the distance from start vertex s\n2 -  let costs = dictionary to store minimum costs to reach each node,\n     initialized with {s: 0}\n3 -  while H is non-empty:\n4 -    remove the first node and cost from H, call them U and cost\n5 -    if U has been previously explored:\n6 -      continue // skip further processing and go back to while loop, line 3\n7 -    mark U as explored\n8 -    if U is d:\n9 -      return cost // total cost from start to destination vertex\n10 -   for each neighbor V and edge cost c of U in G:\n11 -     if V has been previously explored:\n12 -       continue to next neighbor V in line 10\n13 -     total_cost = cost + c\n14 -     if total_cost is less than costs.get(V, ∞):\n15 -       update costs[V] to total_cost\n16 -       add (total_cost, V) to H\n\n// At the end, if destination d is not reachable, return -1\n\nYou can think at cost as a distance where Dijkstra finds the shortest distance\nbetween vertices s and v in a graph G. The use of a min heap as H guarantees\nthat if a vertex has already been explored there will be no other path with\nshortest distance, that happens because heapq.heappop will always return the\nnext vertex with the shortest distance, considering that the heap stores not\nonly the distance between previous vertex and current vertex but the entire\ndistance between each vertex that makes up the path from start vertex to target\nvertex.\n\"\"\"\n\nimport heapq\n\n\ndef dijkstra(graph: dict[str, list[tuple[str, int]]], start: str, end: str) -> int:\n    \"\"\"Return the cost of the shortest path between vertices start and end.\n\n    >>> dijkstra(G, \"E\", \"C\")\n    6\n    >>> dijkstra(G2, \"E\", \"F\")\n    3\n    >>> dijkstra(G3, \"E\", \"F\")\n    3\n    \"\"\"\n    heap: list[tuple[int, str]] = [(0, start)]  # (cost, node)\n    visited: set[str] = set()\n    costs: dict[str, int] = {start: 0}  # Store minimum costs to reach each node\n\n    while heap:\n        cost, u = heapq.heappop(heap)\n        if u in visited:\n            continue\n        visited.add(u)\n        if u == end:\n            return cost\n\n        for v, c in graph[u]:\n            if v in visited:\n                continue\n            next_cost = cost + c\n            # Only push to heap if a cheaper path is found\n            if next_cost < costs.get(v, float(\"inf\")):\n                costs[v] = next_cost\n                heapq.heappush(heap, (next_cost, v))\n\n    return -1\n\n\nG = {\n    \"A\": [(\"B\", 2), (\"C\", 5)],\n    \"B\": [(\"A\", 2), (\"D\", 3), (\"E\", 1), (\"F\", 1)],\n    \"C\": [(\"A\", 5), (\"F\", 3)],\n    \"D\": [(\"B\", 3)],\n    \"E\": [(\"B\", 4), (\"F\", 3)],\n    \"F\": [(\"C\", 3), (\"E\", 3)],\n}\n\n# … trimmed: example graphs G2 and G3 and module-level prints of three sample runs …\n\nif __name__ == \"__main__\":\n    import doctest\n\n    doctest.testmod()\n",
            "graph-traversal-py-real/usage.py": "# Example usage written for Software City (not part of TheAlgorithms/Python).\n# One small road network, explored three ways: queue (BFS), stack (DFS), priority queue (Dijkstra).\nfrom .breadth_first_search_2 import breadth_first_search_with_deque\nfrom .depth_first_search import depth_first_search\nfrom .dijkstra import dijkstra\n\nROADS = {\n    \"Home\": [\"Bakery\", \"Park\"],\n    \"Bakery\": [\"Home\", \"School\", \"Mall\"],\n    \"Park\": [\"Home\", \"Lake\"],\n    \"School\": [\"Bakery\"],\n    \"Mall\": [\"Bakery\", \"Lake\"],\n    \"Lake\": [\"Park\", \"Mall\"],\n}\n\n# Same roads with travel minutes, for Dijkstra.\nMINUTES = {\n    \"Home\": [(\"Bakery\", 4), (\"Park\", 2)],\n    \"Bakery\": [(\"Home\", 4), (\"School\", 3), (\"Mall\", 6)],\n    \"Park\": [(\"Home\", 2), (\"Lake\", 3)],\n    \"School\": [(\"Bakery\", 3)],\n    \"Mall\": [(\"Bakery\", 6), (\"Lake\", 2)],\n    \"Lake\": [(\"Park\", 3), (\"Mall\", 2)],\n}\n\n\ndef run() -> None:\n    print(\"BFS order:\", breadth_first_search_with_deque(ROADS, \"Home\"))\n    print(\"DFS visited:\", sorted(depth_first_search(ROADS, \"Home\")))\n    print(\"Fastest Home -> Mall:\", dijkstra(MINUTES, \"Home\", \"Mall\"), \"minutes\")\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "sorting-searching",
      "name": "Sorting & Searching",
      "family": "Foundations",
      "aka": [
        "Insertion sort",
        "Merge sort",
        "Quick sort",
        "Binary search",
        "Bisect"
      ],
      "tagline": "Put data in order once, then find anything in it by halving the search each step.",
      "intent": "Simple sorts like insertion sort compare neighbours and cost about n^2 steps; divide-and-conquer sorts (merge sort, quick sort) split the work recursively and cost about n log n. Sorted data unlocks binary search, which looks at the middle and discards half the remaining items each time, so a million items need about 20 looks instead of a million.",
      "analogy": "Finding a word in a paper dictionary: you open near the middle, see you are too far, and never look at the second half again. That only works because someone sorted the dictionary first.",
      "cityShape": "Look for sorter buildings with a tall recursive floor (MergeSorter.Sort, QuickSorter.Sort) whose yellow loop pipe calls itself twice, plus a busy helper floor (Merge, Partition) that does the real comparing. Search buildings are short: binarySearch and bisect_left are single loops with no outgoing pipes at all.",
      "roles": [
        {
          "name": "Sort",
          "desc": "Rearranges items into order: insertion sort shifts items one by one; merge and quick sort split the list and recurse on the parts."
        },
        {
          "name": "Divide & Combine",
          "desc": "The helper that does the linear work at each level of recursion: Merge joins two sorted halves, Partition splits around a pivot."
        },
        {
          "name": "Search",
          "desc": "Finds a value or an insertion point: linear search on any list, binary search (bisect) on a sorted one."
        },
        {
          "name": "Client",
          "desc": "Owns the data, decides when to sort, and which search the current order allows."
        }
      ],
      "whenToUse": [
        "You search the same data many times: sort once (n log n), then each lookup is log n.",
        "You need ranges, ranks or 'closest value' queries (scores between 500 and 900, the tier for a score, the next free time slot).",
        "Lists are tiny or nearly sorted: insertion sort is simple and very fast there (real libraries switch to it below ~16 items).",
        "Outside of learning, call the built-in sort; knowing how it works tells you its cost and whether it is stable."
      ],
      "pitfalls": [
        "Binary search on unsorted data returns wrong answers silently. Keep the list sorted (insort) or sort before searching.",
        "Quick sort with a naive pivot (first or last item) degrades to n^2 on already sorted input. Use a random or median-of-three pivot.",
        "Off-by-one errors in low/high/mid are the classic binary search bug; decide whether high is inclusive or exclusive and stick to it."
      ],
      "related": [
        "big-o",
        "recursion",
        "trees",
        "hash-table",
        "strategy"
      ],
      "quiz": [
        {
          "q": "Why is merge sort O(n log n)?",
          "options": [
            "Each recursive call sorts log n items",
            "Halving the list reaches single items after log2(n) levels, and the merges on each level together touch all n items",
            "It compares every pair of items once",
            "Because merging is done in parallel"
          ],
          "answer": 1,
          "why": "Depth log n times n work per level. For 8 products that is 3 levels with at most 8 comparisons each, so at most 24; the demo needs 16."
        },
        {
          "q": "bisect_right([500, 800, 950], 860) returns 2. What does that 2 mean?",
          "options": [
            "860 is at index 2",
            "Two thresholds are less than or equal to 860, so inserting 860 at index 2 keeps the list sorted",
            "860 was found after 2 comparisons",
            "There are 2 items bigger than 860"
          ],
          "answer": 1,
          "why": "bisect returns an insertion point, which also counts how many items are <= x. Using it as an index into the tiers list turns a score into a tier with no if-chain."
        }
      ],
      "demos": [
        {
          "id": "sorting-searching-kt-leaderboard",
          "title": "Leaderboard: insertion sort and binary search",
          "lang": "Kotlin",
          "level": "beginner",
          "source": null,
          "story": "Seven game scores are searched one by one, then sorted like a hand of cards, then searched by halving. Compare the plain loop in linearSearch with the shrinking low..high window in binarySearch.",
          "roles": {
            "Sort": [
              "sorting-searching-kt-leaderboard/Sorting.kt#Sorting.insertionSort"
            ],
            "Search": [
              "sorting-searching-kt-leaderboard/Search.kt#Search.linearSearch",
              "sorting-searching-kt-leaderboard/Search.kt#Search.binarySearch"
            ],
            "Client": [
              "sorting-searching-kt-leaderboard/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "sorting-searching-kt-leaderboard/Main.kt#main",
              "say": "main() starts with unsorted scores. Only linear search is safe on them."
            },
            {
              "at": "sorting-searching-kt-leaderboard/Search.kt#Search.linearSearch",
              "say": "Check index 0, 1, 2... up to n checks. Fine for 7 scores, slow for 7 million."
            },
            {
              "at": "sorting-searching-kt-leaderboard/Sorting.kt#Sorting.insertionSort",
              "say": "Each new score slides left past bigger ones. Up to i shifts for item i, so about n^2/2 steps on reversed input, but fast on nearly sorted data."
            },
            {
              "at": "sorting-searching-kt-leaderboard/Search.kt#Search.binarySearch",
              "say": "Looking for 760: the middle is 420, too small, so the whole left half is dropped. Next look lands on 760."
            },
            {
              "at": "sorting-searching-kt-leaderboard/Search.kt#Search.binarySearch",
              "say": "Looking for 999: the window shrinks until low passes high. Three looks prove it is missing, without touching every item."
            }
          ],
          "files": {
            "sorting-searching-kt-leaderboard/Main.kt": "fun main() {\n    val scores = mutableListOf(420, 150, 980, 310, 760, 150, 530)\n    println(\"found 760 at \" + Search.linearSearch(scores, 760) + \" by checking items one by one\")\n\n    Sorting.insertionSort(scores)\n    println(\"sorted: $scores\")\n\n    // Now that the list is sorted we may use binary search.\n    println(\"760 is at index \" + Search.binarySearch(scores, 760))\n    println(\"999 is at index \" + Search.binarySearch(scores, 999))\n}\n",
            "sorting-searching-kt-leaderboard/Search.kt": "object Search {\n    // Linear search: check every item. Works on any list, costs up to n checks.\n    fun linearSearch(scores: List<Int>, target: Int): Int {\n        for (i in scores.indices) {\n            if (scores[i] == target) return i\n        }\n        return -1\n    }\n\n    // Binary search: only works on SORTED data. Look in the middle and throw away the half\n    // that cannot contain the target. 1,000,000 items need at most 20 looks.\n    fun binarySearch(scores: List<Int>, target: Int): Int {\n        var low = 0\n        var high = scores.size - 1\n        while (low <= high) {\n            val mid = (low + high) / 2\n            when {\n                scores[mid] == target -> return mid\n                scores[mid] < target -> low = mid + 1\n                else -> high = mid - 1\n            }\n        }\n        return -1\n    }\n}\n",
            "sorting-searching-kt-leaderboard/Sorting.kt": "object Sorting {\n    // Insertion sort: like sorting a hand of cards.\n    // Take the next card and slide it left until the card before it is not bigger.\n    fun insertionSort(scores: MutableList<Int>) {\n        for (i in 1 until scores.size) {\n            val card = scores[i]\n            var j = i - 1\n            while (j >= 0 && scores[j] > card) {\n                scores[j + 1] = scores[j]\n                j--\n            }\n            scores[j + 1] = card\n        }\n    }\n}\n"
          }
        },
        {
          "id": "sorting-searching-cs-shop",
          "title": "Shop catalog: merge sort vs quick sort",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "Eight products sorted by price two ways, counting comparisons. Merge sort's recursion halves the list 3 times (log2 8) and merges 8 items per level. Quick sort is fast on shuffled data but hits 28 comparisons on sorted input.",
          "roles": {
            "Sort": [
              "sorting-searching-cs-shop/MergeSorter.cs#MergeSorter.Sort",
              "sorting-searching-cs-shop/QuickSorter.cs#QuickSorter.Sort"
            ],
            "Divide & Combine": [
              "sorting-searching-cs-shop/MergeSorter.cs#MergeSorter.Merge",
              "sorting-searching-cs-shop/QuickSorter.cs#QuickSorter.Partition"
            ],
            "Search": [
              "sorting-searching-cs-shop/PriceSearch.cs#PriceSearch.FirstAtLeast"
            ],
            "Client": [
              "sorting-searching-cs-shop/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "sorting-searching-cs-shop/Program.cs#Program.Main",
              "say": "Main() builds an unsorted catalog of 8 products and hands it to both sorters, which count every price comparison."
            },
            {
              "at": "sorting-searching-cs-shop/MergeSorter.cs#MergeSorter.Sort",
              "say": "Sort(8 items) splits into two halves of 4 and calls itself on each. No comparing happens on the way down."
            },
            {
              "at": "sorting-searching-cs-shop/MergeSorter.cs#MergeSorter.Sort",
              "say": "4 becomes 2 becomes 1. A list of one is sorted, so the recursion stops: 3 levels of halving because 2^3 = 8."
            },
            {
              "at": "sorting-searching-cs-shop/MergeSorter.cs#MergeSorter.Merge",
              "say": "On the way back up, Merge takes the cheaper front item of two sorted lists. Each level merges 8 items in total: 3 levels x 8 = n log n."
            },
            {
              "at": "sorting-searching-cs-shop/PriceSearch.cs#PriceSearch.FirstAtLeast",
              "say": "The payoff of sorting: a binary search finds the first product of 50.00 or more in 3 looks, and everything after it qualifies."
            },
            {
              "at": "sorting-searching-cs-shop/QuickSorter.cs#QuickSorter.Sort",
              "say": "Quick sort does the work before recursing: partition first, then sort the left and right parts in place."
            },
            {
              "at": "sorting-searching-cs-shop/QuickSorter.cs#QuickSorter.Partition",
              "say": "Items cheaper than the pivot are swapped to the front, then the pivot lands in its final spot. On the shuffled catalog: 18 comparisons."
            },
            {
              "at": "sorting-searching-cs-shop/QuickSorter.cs#QuickSorter.Partition",
              "say": "On sorted input the last item is always the biggest, so each split peels off one item: 7+6+...+1 = 28 comparisons, the n^2 trap."
            }
          ],
          "files": {
            "sorting-searching-cs-shop/MergeSorter.cs": "using System.Collections.Generic;\n\nnamespace Shop\n{\n    // Merge sort: split in half, sort each half (recursively), merge the two sorted halves.\n    // Halving n items reaches size 1 after log2(n) levels, and each level merges n items in total,\n    // so the whole sort costs about n * log2(n) comparisons, in the best AND worst case.\n    public class MergeSorter\n    {\n        public int Comparisons { get; private set; }\n\n        public List<Product> Sort(List<Product> items)\n        {\n            if (items.Count <= 1)\n            {\n                return items;\n            }\n            int mid = items.Count / 2;\n            List<Product> left = Sort(items.GetRange(0, mid));\n            List<Product> right = Sort(items.GetRange(mid, items.Count - mid));\n            return Merge(left, right);\n        }\n\n        // Two sorted piles: repeatedly take the cheaper top card. Linear time.\n        private List<Product> Merge(List<Product> left, List<Product> right)\n        {\n            var result = new List<Product>(left.Count + right.Count);\n            int i = 0;\n            int j = 0;\n            while (i < left.Count && j < right.Count)\n            {\n                Comparisons++;\n                if (left[i].Price <= right[j].Price)\n                {\n                    result.Add(left[i++]);\n                }\n                else\n                {\n                    result.Add(right[j++]);\n                }\n            }\n            while (i < left.Count) result.Add(left[i++]);\n            while (j < right.Count) result.Add(right[j++]);\n            return result;\n        }\n    }\n}\n",
            "sorting-searching-cs-shop/PriceSearch.cs": "using System.Collections.Generic;\n\nnamespace Shop\n{\n    public static class PriceSearch\n    {\n        // Binary search for the first product that costs at least minPrice.\n        // Only valid because the list is sorted by price. Returns Count if none qualifies.\n        public static int FirstAtLeast(List<Product> sortedByPrice, decimal minPrice)\n        {\n            int low = 0;\n            int high = sortedByPrice.Count;\n            while (low < high)\n            {\n                int mid = low + (high - low) / 2;\n                if (sortedByPrice[mid].Price < minPrice)\n                {\n                    low = mid + 1;\n                }\n                else\n                {\n                    high = mid;\n                }\n            }\n            return low;\n        }\n    }\n}\n",
            "sorting-searching-cs-shop/Product.cs": "namespace Shop\n{\n    public class Product\n    {\n        public string Name { get; }\n        public decimal Price { get; }\n\n        public Product(string name, decimal price)\n        {\n            Name = name;\n            Price = price;\n        }\n\n        public override string ToString()\n        {\n            return Name + \" \" + Price.ToString(\"0.00\");\n        }\n    }\n}\n",
            "sorting-searching-cs-shop/Program.cs": "using System;\nusing System.Collections.Generic;\n\nnamespace Shop\n{\n    public static class Program\n    {\n        public static void Main()\n        {\n            var catalog = new List<Product>\n            {\n                new Product(\"Lamp\", 39.90m), new Product(\"Mug\", 8.50m),\n                new Product(\"Desk\", 249.00m), new Product(\"Pen\", 1.20m),\n                new Product(\"Chair\", 129.00m), new Product(\"Rug\", 89.00m),\n                new Product(\"Clock\", 24.99m), new Product(\"Vase\", 19.00m),\n            };\n\n            var merge = new MergeSorter();\n            List<Product> byPrice = merge.Sort(catalog);\n            Console.WriteLine(string.Join(\", \", byPrice));\n            // 8 items: log2(8) = 3 levels of merging, at most 8 comparisons per level.\n            Console.WriteLine(\"merge sort comparisons: \" + merge.Comparisons + \" (n log n = 24)\");\n\n            // Sorted data unlocks binary search: everything from 50.00 up, in 3 looks.\n            int from = PriceSearch.FirstAtLeast(byPrice, 50.00m);\n            Console.WriteLine(\"50+ budget: \" + string.Join(\", \", byPrice.GetRange(from, byPrice.Count - from)));\n\n            var quick = new QuickSorter();\n            var copy = new List<Product>(catalog);\n            quick.Sort(copy, 0, copy.Count - 1);\n            Console.WriteLine(\"quick sort comparisons: \" + quick.Comparisons);\n\n            // Already sorted input is quick sort's worst case with a last-item pivot.\n            var worst = new QuickSorter();\n            worst.Sort(byPrice, 0, byPrice.Count - 1);\n            Console.WriteLine(\"quick sort on sorted input: \" + worst.Comparisons + \" (n(n-1)/2 = 28)\");\n        }\n    }\n}\n",
            "sorting-searching-cs-shop/QuickSorter.cs": "using System.Collections.Generic;\n\nnamespace Shop\n{\n    // Quick sort: pick a pivot, move cheaper items to its left and dearer ones to its right,\n    // then sort both sides in place. Average n log n, but a bad pivot every time gives n^2.\n    public class QuickSorter\n    {\n        public int Comparisons { get; private set; }\n\n        public void Sort(List<Product> items, int low, int high)\n        {\n            if (low >= high)\n            {\n                return;\n            }\n            int p = Partition(items, low, high);\n            Sort(items, low, p - 1);\n            Sort(items, p + 1, high);\n        }\n\n        // Lomuto partition with the last item as pivot.\n        private int Partition(List<Product> items, int low, int high)\n        {\n            decimal pivot = items[high].Price;\n            int store = low;\n            for (int i = low; i < high; i++)\n            {\n                Comparisons++;\n                if (items[i].Price < pivot)\n                {\n                    Swap(items, i, store);\n                    store++;\n                }\n            }\n            Swap(items, store, high);\n            return store;\n        }\n\n        private void Swap(List<Product> items, int a, int b)\n        {\n            Product tmp = items[a];\n            items[a] = items[b];\n            items[b] = tmp;\n        }\n    }\n}\n"
          }
        },
        {
          "id": "sorting-searching-py-bisect-real",
          "title": "CPython bisect: binary search in the standard library",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "python/cpython",
            "url": "https://github.com/python/cpython/blob/v3.12.9/Lib/bisect.py",
            "license": "PSF-2.0",
            "note": "bisect.py is the complete, verbatim Lib/bisect.py from CPython 3.12.9 (at runtime CPython swaps in an identical C version from _bisect); ranking.py was written for Software City."
          },
          "story": "Python's own binary search. bisect_left and bisect_right return insertion points rather than found/not found, which makes them good for ranks, ranges and keeping a list sorted with insort.",
          "roles": {
            "Sort": [
              "sorting-searching-py-bisect-real/bisect.py#insort_right",
              "sorting-searching-py-bisect-real/bisect.py#insort_left"
            ],
            "Search": [
              "sorting-searching-py-bisect-real/bisect.py#bisect_right",
              "sorting-searching-py-bisect-real/bisect.py#bisect_left"
            ],
            "Client": [
              "sorting-searching-py-bisect-real/ranking.py#run",
              "sorting-searching-py-bisect-real/ranking.py#tier_for",
              "sorting-searching-py-bisect-real/ranking.py#count_between"
            ]
          },
          "trace": [
            {
              "at": "sorting-searching-py-bisect-real/ranking.py#run",
              "say": "run() never calls sort(). Each score is inserted at its correct place, so the table is always sorted."
            },
            {
              "at": "sorting-searching-py-bisect-real/bisect.py#insort_right",
              "say": "insort finds the spot with a binary search (log n), then list.insert shifts the tail (n). Still a good deal for a growing table."
            },
            {
              "at": "sorting-searching-py-bisect-real/bisect.py#bisect_right",
              "say": "The classic loop: mid = (lo + hi) // 2, keep the half that can hold x. hi is exclusive, so lo == hi is the answer."
            },
            {
              "at": "sorting-searching-py-bisect-real/ranking.py#tier_for",
              "say": "bisect_right over [500, 800, 950] counts the thresholds reached, and that count indexes the tier name directly."
            },
            {
              "at": "sorting-searching-py-bisect-real/ranking.py#count_between",
              "say": "Range count = right edge of 900 minus left edge of 500. Two O(log n) searches instead of a scan."
            },
            {
              "at": "sorting-searching-py-bisect-real/bisect.py#bisect_left",
              "say": "bisect_left differs only in < vs <=: with duplicates it stops before the first 500 instead of after the last."
            }
          ],
          "files": {
            "sorting-searching-py-bisect-real/bisect.py": "# Source: CPython 3.12.9 Lib/bisect.py — https://github.com/python/cpython/blob/v3.12.9/Lib/bisect.py\n# PSF License (Python Software Foundation License Version 2), Copyright (c) 2001-2023 Python Software Foundation. Included for study.\n\"\"\"Bisection algorithms.\"\"\"\n\n\ndef insort_right(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Insert item x in list a, and keep it sorted assuming a is sorted.\n\n    If x is already in a, insert it to the right of the rightmost x.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n    if key is None:\n        lo = bisect_right(a, x, lo, hi)\n    else:\n        lo = bisect_right(a, key(x), lo, hi, key=key)\n    a.insert(lo, x)\n\n\ndef bisect_right(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Return the index where to insert item x in list a, assuming a is sorted.\n\n    The return value i is such that all e in a[:i] have e <= x, and all e in\n    a[i:] have e > x.  So if x already appears in the list, a.insert(i, x) will\n    insert just after the rightmost x already there.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n\n    if lo < 0:\n        raise ValueError('lo must be non-negative')\n    if hi is None:\n        hi = len(a)\n    # Note, the comparison uses \"<\" to match the\n    # __lt__() logic in list.sort() and in heapq.\n    if key is None:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if x < a[mid]:\n                hi = mid\n            else:\n                lo = mid + 1\n    else:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if x < key(a[mid]):\n                hi = mid\n            else:\n                lo = mid + 1\n    return lo\n\n\ndef insort_left(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Insert item x in list a, and keep it sorted assuming a is sorted.\n\n    If x is already in a, insert it to the left of the leftmost x.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n\n    if key is None:\n        lo = bisect_left(a, x, lo, hi)\n    else:\n        lo = bisect_left(a, key(x), lo, hi, key=key)\n    a.insert(lo, x)\n\ndef bisect_left(a, x, lo=0, hi=None, *, key=None):\n    \"\"\"Return the index where to insert item x in list a, assuming a is sorted.\n\n    The return value i is such that all e in a[:i] have e < x, and all e in\n    a[i:] have e >= x.  So if x already appears in the list, a.insert(i, x) will\n    insert just before the leftmost x already there.\n\n    Optional args lo (default 0) and hi (default len(a)) bound the\n    slice of a to be searched.\n\n    A custom key function can be supplied to customize the sort order.\n    \"\"\"\n\n    if lo < 0:\n        raise ValueError('lo must be non-negative')\n    if hi is None:\n        hi = len(a)\n    # Note, the comparison uses \"<\" to match the\n    # __lt__() logic in list.sort() and in heapq.\n    if key is None:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if a[mid] < x:\n                lo = mid + 1\n            else:\n                hi = mid\n    else:\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if key(a[mid]) < x:\n                lo = mid + 1\n            else:\n                hi = mid\n    return lo\n\n\n# Overwrite above definitions with a fast C implementation\ntry:\n    from _bisect import *\nexcept ImportError:\n    pass\n\n# Create aliases\nbisect = bisect_right\ninsort = insort_right\n",
            "sorting-searching-py-bisect-real/ranking.py": "# Example usage written for Software City (not part of CPython).\n# Keeps a sorted high-score table and turns scores into medal tiers with binary search.\nfrom .bisect import bisect_left, bisect_right, insort_right\n\nTHRESHOLDS = [500, 800, 950]\nTIERS = [\"none\", \"bronze\", \"silver\", \"gold\"]\n\n\ndef tier_for(score):\n    # bisect_right counts how many thresholds the score has reached: 0..3.\n    return TIERS[bisect_right(THRESHOLDS, score)]\n\n\ndef count_between(sorted_scores, low, high):\n    # Two binary searches give a range count without scanning the list.\n    return bisect_right(sorted_scores, high) - bisect_left(sorted_scores, low)\n\n\ndef run():\n    table = []\n    for score in [720, 150, 990, 500, 860, 500]:\n        insort_right(table, score)\n    print(\"table:\", table)\n    print(\"tiers:\", [tier_for(s) for s in table])\n    print(\"scores from 500 to 900:\", count_between(table, 500, 900))\n\n\nif __name__ == \"__main__\":\n    run()\n"
          }
        }
      ]
    },
    {
      "id": "dynamic-programming",
      "name": "Dynamic Programming",
      "family": "Foundations",
      "aka": [
        "DP",
        "Memoization",
        "Tabulation",
        "Top-down / bottom-up"
      ],
      "tagline": "Solve each overlapping subproblem once, store it, and build the big answer from it.",
      "intent": "Many problems split into smaller versions of themselves that overlap: naive recursion solves the same pieces again and again and takes exponential time. Dynamic programming stores each piece's answer, either top-down (memoization: recursion plus a cache) or bottom-up (tabulation: fill a table from the smallest case upward), turning exponential work into roughly 'number of subproblems x work per subproblem'.",
      "analogy": "Someone asks you 1+1+1+1+1+1+1. You count: 7. They add '+1' and you answer 8 at once, because you remembered 7 instead of counting again. That remembering is the whole trick.",
      "cityShape": "Look for a naive floor whose yellow loop pipe calls itself two or three times, and a memo floor with the same loop pipe but a cache check in front of it (in the knapsack demo it also reads and writes the global table f). The tabulated floor has no loop pipe at all, just nested loops filling a table. Same answer, three very different shapes.",
      "roles": [
        {
          "name": "Recurrence",
          "desc": "The plain recursive definition: the answer for n expressed through answers for smaller inputs. Correct, but repeats work."
        },
        {
          "name": "Memo (top-down)",
          "desc": "The same recursion with a cache: check the memo first, compute only if missing, store before returning."
        },
        {
          "name": "Table (bottom-up)",
          "desc": "An iterative fill of an array or grid in an order where every cell's ingredients are already computed."
        },
        {
          "name": "Client",
          "desc": "Sets up the inputs (and the empty memo or table) and reads the final answer, sometimes walking the table back to see which choices were made."
        }
      ],
      "whenToUse": [
        "A recursive solution recomputes the same arguments (draw the call tree: repeated nodes mean overlapping subproblems).",
        "You are counting ways or finding the best choice: coin change, knapsack/loot, cheapest path on a grid, longest common subsequence.",
        "Comparing sequences: edit distance for typo suggestions and diff tools, DNA alignment.",
        "Game balancing tables or AI that score many states that are reached by different move orders."
      ],
      "pitfalls": [
        "Memoizing a function whose answer depends on something outside its arguments (a global, the clock) caches wrong answers.",
        "Deep top-down recursion can hit the recursion limit; tabulation avoids the call stack entirely.",
        "Tables can be large (n x capacity); if each row only reads the previous one, keep two rows or two variables instead."
      ],
      "related": [
        "recursion",
        "big-o",
        "hash-table",
        "cache-aside",
        "lazy-evaluation",
        "graph-traversal"
      ],
      "quiz": [
        {
          "q": "Why does memoized fib(30) need only 59 calls when the naive version needs about 2.7 million?",
          "options": [
            "The memo version uses a faster formula",
            "Each fib(k) for k = 0..30 is computed once; every later request is answered from the map, so the call tree collapses to a line",
            "Go optimises recursion automatically",
            "The memo version skips odd numbers"
          ],
          "answer": 1,
          "why": "Naive recursion recomputes fib(28), fib(27)... over and over. With the cache there are only 31 distinct subproblems, each costing a couple of calls."
        },
        {
          "q": "In the edit-distance table, which cells must be filled before dp[i][j]?",
          "options": [
            "All cells in the table",
            "dp[i-1][j], dp[i][j-1] and dp[i-1][j-1]: the cells above, left and diagonally above-left",
            "Only dp[i-1][j-1]",
            "dp[i+1][j+1], because it works backwards"
          ],
          "answer": 1,
          "why": "Delete, insert and replace each come from one neighbour. Filling row by row, left to right, guarantees all three are ready."
        }
      ],
      "demos": [
        {
          "id": "dynamic-programming-go-fib",
          "title": "Fibonacci four ways",
          "lang": "Go",
          "level": "beginner",
          "source": null,
          "story": "The same fib(30) computed by plain recursion, memoized recursion, a table and two variables, with call counters. Watch 2.7 million calls shrink to 59, then to a simple loop.",
          "roles": {
            "Recurrence": [
              "dynamic-programming-go-fib/fib/naive.go#Naive"
            ],
            "Memo (top-down)": [
              "dynamic-programming-go-fib/fib/memo.go#Memo"
            ],
            "Table (bottom-up)": [
              "dynamic-programming-go-fib/fib/table.go#Table",
              "dynamic-programming-go-fib/fib/table.go#TwoVars"
            ],
            "Client": [
              "dynamic-programming-go-fib/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "dynamic-programming-go-fib/main.go#main",
              "say": "main() asks four functions for fib(30) and prints how much work each one did."
            },
            {
              "at": "dynamic-programming-go-fib/fib/naive.go#Naive",
              "say": "fib(30) calls fib(29) and fib(28). The yellow loop pipe fires twice per call..."
            },
            {
              "at": "dynamic-programming-go-fib/fib/naive.go#Naive",
              "say": "...and fib(29) calls fib(28) again. fib(28) is solved twice, fib(27) three times: 2,692,537 calls in total."
            },
            {
              "at": "dynamic-programming-go-fib/fib/memo.go#Memo",
              "say": "Same recursion, but each answer goes into memo. The second time fib(28) is asked, the map answers instantly."
            },
            {
              "at": "dynamic-programming-go-fib/fib/memo.go#Memo",
              "say": "Only 31 different subproblems exist (0..30), so the whole run takes 59 calls. Exponential became linear."
            },
            {
              "at": "dynamic-programming-go-fib/fib/table.go#Table",
              "say": "Bottom-up: start from fib(0) and fib(1) and fill upward. No recursion, no stack, 29 loop steps."
            },
            {
              "at": "dynamic-programming-go-fib/fib/table.go#TwoVars",
              "say": "Each cell only reads the two before it, so the table shrinks to two variables: O(n) time, O(1) memory."
            }
          ],
          "files": {
            "dynamic-programming-go-fib/fib/memo.go": "package fib\n\nvar MemoCalls = 0\n\n// Step 2: memoization (top-down). Same recursion, but remember every answer.\n// Each fib(k) is computed once, so fib(30) needs only 59 calls.\nfunc Memo(n int, memo map[int]int) int {\n\tMemoCalls++\n\tif n < 2 {\n\t\treturn n\n\t}\n\tif v, ok := memo[n]; ok {\n\t\treturn v\n\t}\n\tmemo[n] = Memo(n-1, memo) + Memo(n-2, memo)\n\treturn memo[n]\n}\n",
            "dynamic-programming-go-fib/fib/naive.go": "package fib\n\nvar NaiveCalls = 0\n\n// Step 1: the definition, written straight down. fib(n) = fib(n-1) + fib(n-2).\n// It is correct but solves the same subproblems again and again:\n// fib(30) makes over 2.6 million calls.\nfunc Naive(n int) int {\n\tNaiveCalls++\n\tif n < 2 {\n\t\treturn n\n\t}\n\treturn Naive(n-1) + Naive(n-2)\n}\n",
            "dynamic-programming-go-fib/fib/table.go": "package fib\n\n// Step 3: tabulation (bottom-up). No recursion at all: fill a table from the\n// smallest subproblem upwards, so every value we need is already there.\nfunc Table(n int) int {\n\tif n < 2 {\n\t\treturn n\n\t}\n\ttable := make([]int, n+1)\n\ttable[1] = 1\n\tfor i := 2; i <= n; i++ {\n\t\ttable[i] = table[i-1] + table[i-2]\n\t}\n\treturn table[n]\n}\n\n// Step 4: we only ever read the last two cells, so two variables are enough.\nfunc TwoVars(n int) int {\n\tprev, cur := 0, 1\n\tfor i := 0; i < n; i++ {\n\t\tprev, cur = cur, prev+cur\n\t}\n\treturn prev\n}\n",
            "dynamic-programming-go-fib/go.mod": "module example.com/fibdemo\n\ngo 1.22\n",
            "dynamic-programming-go-fib/main.go": "package main\n\nimport (\n\t\"fmt\"\n\n\t\"example.com/fibdemo/fib\"\n)\n\nfunc main() {\n\tn := 30\n\tfmt.Println(\"naive:\", fib.Naive(n), \"calls:\", fib.NaiveCalls)\n\tfmt.Println(\"memo: \", fib.Memo(n, map[int]int{}), \"calls:\", fib.MemoCalls)\n\tfmt.Println(\"table:\", fib.Table(n), \"loop steps:\", n-1)\n\tfmt.Println(\"vars: \", fib.TwoVars(n))\n}\n"
          }
        },
        {
          "id": "dynamic-programming-rs-spell",
          "title": "\"Did you mean...?\" with edit distance",
          "lang": "Rust",
          "level": "intermediate",
          "source": null,
          "story": "A CLI suggests the closest command when you mistype, like git does. Edit distance is written three ways: naive recursion, memoized recursion over a grid of Options, and a filled table that suggest() uses.",
          "roles": {
            "Recurrence": [
              "dynamic-programming-rs-spell/distance.rs#edit_naive"
            ],
            "Memo (top-down)": [
              "dynamic-programming-rs-spell/distance.rs#edit_memo"
            ],
            "Table (bottom-up)": [
              "dynamic-programming-rs-spell/distance.rs#edit_table"
            ],
            "Client": [
              "dynamic-programming-rs-spell/main.rs#main",
              "dynamic-programming-rs-spell/suggest.rs#suggest"
            ]
          },
          "trace": [
            {
              "at": "dynamic-programming-rs-spell/main.rs#main",
              "say": "main() measures 'comit' against 'commit' three ways, then runs typo suggestions for four inputs."
            },
            {
              "at": "dynamic-programming-rs-spell/distance.rs#edit_naive",
              "say": "If the last letters match, drop both for free. Otherwise try insert, delete and replace: three recursive calls each time."
            },
            {
              "at": "dynamic-programming-rs-spell/distance.rs#edit_naive",
              "say": "Those branches meet the same pair of prefixes again and again. For two 10-letter words that is millions of calls."
            },
            {
              "at": "dynamic-programming-rs-spell/distance.rs#edit_memo",
              "say": "A prefix pair is identified by its two lengths (i, j), so a (len a + 1) x (len b + 1) grid of Options caches every answer."
            },
            {
              "at": "dynamic-programming-rs-spell/distance.rs#edit_table",
              "say": "Bottom-up: row 0 and column 0 are 'turn an empty word into a prefix'. Each cell takes the cheapest of its three neighbours."
            },
            {
              "at": "dynamic-programming-rs-spell/suggest.rs#suggest",
              "say": "suggest() scores every command with the table version and keeps the closest one within 2 edits. 'deploy' is too far from all."
            },
            {
              "at": "dynamic-programming-rs-spell/distance.rs#edit_table",
              "say": "'psuh' vs 'push' costs 2: plain edit distance has no swap move, so the swapped letters count as two replacements."
            }
          ],
          "files": {
            "dynamic-programming-rs-spell/distance.rs": "// Edit distance: the fewest single-letter inserts, deletes or replacements\n// that turn word a into word b. \"comit\" -> \"commit\" is 1.\n\n// Naive recursion: compare the last letters, then try all three edits.\n// Three recursive calls per step means roughly 3^n calls.\npub fn edit_naive(a: &[u8], b: &[u8]) -> usize {\n    if a.is_empty() {\n        return b.len();\n    }\n    if b.is_empty() {\n        return a.len();\n    }\n    let (i, j) = (a.len() - 1, b.len() - 1);\n    if a[i] == b[j] {\n        return edit_naive(&a[..i], &b[..j]);\n    }\n    let insert = edit_naive(a, &b[..j]);\n    let delete = edit_naive(&a[..i], b);\n    let replace = edit_naive(&a[..i], &b[..j]);\n    1 + insert.min(delete).min(replace)\n}\n\n// Memoized: the same recursion, but subproblem (i, j) is solved once and stored.\n// There are only (len a + 1) * (len b + 1) different subproblems.\npub fn edit_memo(a: &[u8], b: &[u8], memo: &mut Vec<Vec<Option<usize>>>) -> usize {\n    let (i, j) = (a.len(), b.len());\n    if let Some(known) = memo[i][j] {\n        return known;\n    }\n    let answer = if i == 0 {\n        j\n    } else if j == 0 {\n        i\n    } else if a[i - 1] == b[j - 1] {\n        edit_memo(&a[..i - 1], &b[..j - 1], memo)\n    } else {\n        let insert = edit_memo(a, &b[..j - 1], memo);\n        let delete = edit_memo(&a[..i - 1], b, memo);\n        let replace = edit_memo(&a[..i - 1], &b[..j - 1], memo);\n        1 + insert.min(delete).min(replace)\n    };\n    memo[i][j] = Some(answer);\n    answer\n}\n\n// Tabulated: fill the same grid row by row from the empty prefixes upward.\n// Cell [i][j] only needs its left, upper and upper-left neighbours.\npub fn edit_table(a: &str, b: &str) -> usize {\n    let (a, b) = (a.as_bytes(), b.as_bytes());\n    let mut dp = vec![vec![0usize; b.len() + 1]; a.len() + 1];\n    for i in 0..=a.len() {\n        dp[i][0] = i;\n    }\n    for j in 0..=b.len() {\n        dp[0][j] = j;\n    }\n    for i in 1..=a.len() {\n        for j in 1..=b.len() {\n            let cost = if a[i - 1] == b[j - 1] { 0 } else { 1 };\n            dp[i][j] = (dp[i - 1][j] + 1).min(dp[i][j - 1] + 1).min(dp[i - 1][j - 1] + cost);\n        }\n    }\n    dp[a.len()][b.len()]\n}\n",
            "dynamic-programming-rs-spell/main.rs": "mod distance;\nmod suggest;\n\nuse distance::{edit_memo, edit_naive, edit_table};\nuse suggest::suggest;\n\nfn main() {\n    let (a, b) = (\"comit\", \"commit\");\n    println!(\"naive: {}\", edit_naive(a.as_bytes(), b.as_bytes()));\n    let mut memo = vec![vec![None; b.len() + 1]; a.len() + 1];\n    println!(\"memo:  {}\", edit_memo(a.as_bytes(), b.as_bytes(), &mut memo));\n    println!(\"table: {}\", edit_table(a, b));\n\n    let commands = [\"commit\", \"checkout\", \"status\", \"push\", \"pull\", \"merge\"];\n    for typed in [\"stauts\", \"psuh\", \"chekcout\", \"deploy\"] {\n        match suggest(typed, &commands) {\n            Some(cmd) => println!(\"'{}' is not a command. Did you mean '{}'?\", typed, cmd),\n            None => println!(\"'{}' is not a command.\", typed),\n        }\n    }\n}\n",
            "dynamic-programming-rs-spell/suggest.rs": "use crate::distance::edit_table;\n\n// \"Did you mean ...?\" for a command-line tool, like git's typo hints.\n// Every known command is scored with the tabulated edit distance; close ones win.\npub fn suggest<'a>(typed: &str, commands: &[&'a str]) -> Option<&'a str> {\n    let mut best: Option<(&'a str, usize)> = None;\n    for cmd in commands {\n        let d = edit_table(typed, cmd);\n        if d <= 2 && best.map_or(true, |(_, bd)| d < bd) {\n            best = Some((cmd, d));\n        }\n    }\n    best.map(|(cmd, _)| cmd)\n}\n"
          }
        },
        {
          "id": "dynamic-programming-py-knapsack-real",
          "title": "TheAlgorithms: knapsack and coin change",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "TheAlgorithms/Python",
            "url": "https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/dynamic_programming/knapsack.py",
            "license": "MIT",
            "note": "knapsack.py and minimum_coin_change.py are complete and verbatim from dynamic_programming/ at commit 215c1f0; loot.py was written for Software City."
          },
          "story": "Real 0/1 knapsack code in both styles: mf_knapsack is memoized recursion, knapsack fills a table, and _construct_solution walks the table backwards to see which items were taken. loot.py packs a game backpack with it.",
          "roles": {
            "Recurrence": [
              "dynamic-programming-py-knapsack-real/knapsack.py#_construct_solution"
            ],
            "Memo (top-down)": [
              "dynamic-programming-py-knapsack-real/knapsack.py#mf_knapsack"
            ],
            "Table (bottom-up)": [
              "dynamic-programming-py-knapsack-real/knapsack.py#knapsack",
              "dynamic-programming-py-knapsack-real/minimum_coin_change.py#dp_count"
            ],
            "Client": [
              "dynamic-programming-py-knapsack-real/loot.py#run",
              "dynamic-programming-py-knapsack-real/knapsack.py#knapsack_with_example_solution"
            ]
          },
          "trace": [
            {
              "at": "dynamic-programming-py-knapsack-real/loot.py#run",
              "say": "Four loot items, a 10 kg backpack. run() first fills the module's global memo table f with -1, meaning 'not solved yet'."
            },
            {
              "at": "dynamic-programming-py-knapsack-real/knapsack.py#mf_knapsack",
              "say": "Subproblem (i, j) = best gold from the first i items with j kg free. Either skip item i, or take it and lose its weight."
            },
            {
              "at": "dynamic-programming-py-knapsack-real/knapsack.py#mf_knapsack",
              "say": "Both branches recurse on i - 1. The f[i][j] < 0 check means each (i, j) is solved once: at most 4 x 10 cells, not 2^4 subsets."
            },
            {
              "at": "dynamic-programming-py-knapsack-real/knapsack.py#knapsack",
              "say": "The bottom-up version fills dp row by row (items) and column by column (capacity) with the same take-or-skip rule. Answer: 100 gold."
            },
            {
              "at": "dynamic-programming-py-knapsack-real/knapsack.py#knapsack_with_example_solution",
              "say": "Validates the inputs, runs knapsack, then asks for the actual items, not just the best value."
            },
            {
              "at": "dynamic-programming-py-knapsack-real/knapsack.py#_construct_solution",
              "say": "Walk back from the corner: if the cell equals the one above, item i was skipped; otherwise it was taken. Result: sword, crown, potion."
            },
            {
              "at": "dynamic-programming-py-knapsack-real/minimum_coin_change.py#dp_count",
              "say": "Counting ways is DP too: table[j] += table[j - coin] for each coin. 13 ways to pay 12 gold with 1, 2 and 5."
            }
          ],
          "files": {
            "dynamic-programming-py-knapsack-real/knapsack.py": "# Source: TheAlgorithms/Python @215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/dynamic_programming/knapsack.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n\"\"\"\nGiven weights and values of n items, put these items in a knapsack of\ncapacity W to get the maximum total value in the knapsack.\n\nNote that only the integer weights 0-1 knapsack problem is solvable\nusing dynamic programming.\n\"\"\"\n\n\ndef mf_knapsack(i, wt, val, j):\n    \"\"\"\n    This code involves the concept of memory functions. Here we solve the subproblems\n    which are needed unlike the below example\n    F is a 2D array with ``-1`` s filled up\n    \"\"\"\n    global f  # a global dp table for knapsack\n    if f[i][j] < 0:\n        if j < wt[i - 1]:\n            val = mf_knapsack(i - 1, wt, val, j)\n        else:\n            val = max(\n                mf_knapsack(i - 1, wt, val, j),\n                mf_knapsack(i - 1, wt, val, j - wt[i - 1]) + val[i - 1],\n            )\n        f[i][j] = val\n    return f[i][j]\n\n\ndef knapsack(w, wt, val, n):\n    dp = [[0] * (w + 1) for _ in range(n + 1)]\n\n    for i in range(1, n + 1):\n        for w_ in range(1, w + 1):\n            if wt[i - 1] <= w_:\n                dp[i][w_] = max(val[i - 1] + dp[i - 1][w_ - wt[i - 1]], dp[i - 1][w_])\n            else:\n                dp[i][w_] = dp[i - 1][w_]\n\n    return dp[n][w_], dp\n\n\ndef knapsack_with_example_solution(w: int, wt: list, val: list):\n    \"\"\"\n    Solves the integer weights knapsack problem returns one of\n    the several possible optimal subsets.\n\n    Parameters\n    ----------\n\n    * `w`: int, the total maximum weight for the given knapsack problem.\n    * `wt`: list, the vector of weights for all items where ``wt[i]`` is the weight\n       of the ``i``-th item.\n    * `val`: list, the vector of values for all items where ``val[i]`` is the value\n      of the ``i``-th item\n\n    Returns\n    -------\n\n    * `optimal_val`: float, the optimal value for the given knapsack problem\n    * `example_optional_set`: set, the indices of one of the optimal subsets\n      which gave rise to the optimal value.\n\n    Examples\n    --------\n\n    >>> knapsack_with_example_solution(10, [1, 3, 5, 2], [10, 20, 100, 22])\n    (142, {2, 3, 4})\n    >>> knapsack_with_example_solution(6, [4, 3, 2, 3], [3, 2, 4, 4])\n    (8, {3, 4})\n    >>> knapsack_with_example_solution(6, [4, 3, 2, 3], [3, 2, 4])\n    Traceback (most recent call last):\n        ...\n    ValueError: The number of weights must be the same as the number of values.\n    But got 4 weights and 3 values\n    \"\"\"\n    if not (isinstance(wt, (list, tuple)) and isinstance(val, (list, tuple))):\n        raise ValueError(\n            \"Both the weights and values vectors must be either lists or tuples\"\n        )\n\n    num_items = len(wt)\n    if num_items != len(val):\n        msg = (\n            \"The number of weights must be the same as the number of values.\\n\"\n            f\"But got {num_items} weights and {len(val)} values\"\n        )\n        raise ValueError(msg)\n    for i in range(num_items):\n        if not isinstance(wt[i], int):\n            msg = (\n                \"All weights must be integers but got weight of \"\n                f\"type {type(wt[i])} at index {i}\"\n            )\n            raise TypeError(msg)\n\n    optimal_val, dp_table = knapsack(w, wt, val, num_items)\n    example_optional_set: set = set()\n    _construct_solution(dp_table, wt, num_items, w, example_optional_set)\n\n    return optimal_val, example_optional_set\n\n\ndef _construct_solution(dp: list, wt: list, i: int, j: int, optimal_set: set) -> None:\n    \"\"\"\n    Recursively reconstructs one of the optimal subsets given\n    a filled DP table and the vector of weights\n\n    Parameters\n    ----------\n\n    * `dp`: list of list, the table of a solved integer weight dynamic programming\n      problem\n    * `wt`: list or tuple, the vector of weights of the items\n    * `i`: int, the index of the item under consideration\n    * `j`: int, the current possible maximum weight\n    * `optimal_set`: set, the optimal subset so far. This gets modified by the function.\n\n    Returns\n    -------\n\n    ``None``\n    \"\"\"\n    # for the current item i at a maximum weight j to be part of an optimal subset,\n    # the optimal value at (i, j) must be greater than the optimal value at (i-1, j).\n    # where i - 1 means considering only the previous items at the given maximum weight\n    if i > 0 and j > 0:\n        if dp[i - 1][j] == dp[i][j]:\n            _construct_solution(dp, wt, i - 1, j, optimal_set)\n        else:\n            optimal_set.add(i)\n            _construct_solution(dp, wt, i - 1, j - wt[i - 1], optimal_set)\n\n\nif __name__ == \"__main__\":\n    \"\"\"\n    Adding test case for knapsack\n    \"\"\"\n    val = [3, 2, 4, 4]\n    wt = [4, 3, 2, 3]\n    n = 4\n    w = 6\n    f = [[0] * (w + 1)] + [[0] + [-1] * (w + 1) for _ in range(n + 1)]\n    optimal_solution, _ = knapsack(w, wt, val, n)\n    print(optimal_solution)\n    print(mf_knapsack(n, wt, val, w))  # switched the n and w\n\n    # testing the dynamic programming problem with example\n    # the optimal subset for the above example are items 3 and 4\n    optimal_solution, optimal_subset = knapsack_with_example_solution(w, wt, val)\n    assert optimal_solution == 8\n    assert optimal_subset == {3, 4}\n    print(\"optimal_value = \", optimal_solution)\n    print(\"An optimal subset corresponding to the optimal value\", optimal_subset)\n",
            "dynamic-programming-py-knapsack-real/loot.py": "# Example usage written for Software City (not part of TheAlgorithms/Python).\n# A game backpack holds 10 kg. Which loot should the player keep to carry the most gold?\nfrom . import knapsack as knapsack_module\nfrom .knapsack import knapsack, knapsack_with_example_solution, mf_knapsack\nfrom .minimum_coin_change import dp_count\n\nLOOT = [\"sword\", \"shield\", \"crown\", \"potion\"]\nWEIGHTS = [5, 4, 3, 2]\nGOLD = [40, 30, 50, 10]\nCAPACITY = 10\n\n\ndef run() -> None:\n    n = len(LOOT)\n    # mf_knapsack reads a module-level memo table named f, filled with -1 (\"not solved yet\").\n    knapsack_module.f = [[0] * (CAPACITY + 1)] + [[0] + [-1] * (CAPACITY + 1) for _ in range(n + 1)]\n    print(\"memoized:\", mf_knapsack(n, WEIGHTS, GOLD, CAPACITY))\n\n    best, _table = knapsack(CAPACITY, WEIGHTS, GOLD, n)\n    print(\"tabulated:\", best)\n\n    best, chosen = knapsack_with_example_solution(CAPACITY, WEIGHTS, GOLD)\n    print(\"keep:\", [LOOT[i - 1] for i in sorted(chosen)], \"for\", best, \"gold\")\n\n    # Bonus: how many ways can a shop pay out 12 gold with 1, 2 and 5 coins?\n    print(\"ways to pay 12:\", dp_count([1, 2, 5], 12))\n\n\nif __name__ == \"__main__\":\n    run()\n",
            "dynamic-programming-py-knapsack-real/minimum_coin_change.py": "# Source: TheAlgorithms/Python @215c1f0 — https://github.com/TheAlgorithms/Python/blob/215c1f0710f610aaf5ebaeab04edacec3f5308cd/dynamic_programming/minimum_coin_change.py\n# MIT License, Copyright (c) 2016-2022 TheAlgorithms and contributors. Included for study.\n\"\"\"\nYou have m types of coins available in infinite quantities\nwhere the value of each coins is given in the array S=[S0,... Sm-1]\nCan you determine number of ways of making change for n units using\nthe given types of coins?\nhttps://www.hackerrank.com/challenges/coin-change/problem\n\"\"\"\n\n\ndef dp_count(s, n):\n    \"\"\"\n    >>> dp_count([1, 2, 3], 4)\n    4\n    >>> dp_count([1, 2, 3], 7)\n    8\n    >>> dp_count([2, 5, 3, 6], 10)\n    5\n    >>> dp_count([10], 99)\n    0\n    >>> dp_count([4, 5, 6], 0)\n    1\n    >>> dp_count([1, 2, 3], -5)\n    0\n    \"\"\"\n    if n < 0:\n        return 0\n    # table[i] represents the number of ways to get to amount i\n    table = [0] * (n + 1)\n\n    # There is exactly 1 way to get to zero(You pick no coins).\n    table[0] = 1\n\n    # Pick all coins one by one and update table[] values\n    # after the index greater than or equal to the value of the\n    # picked coin\n    for coin_val in s:\n        for j in range(coin_val, n + 1):\n            table[j] += table[j - coin_val]\n\n    return table[n]\n\n\nif __name__ == \"__main__\":\n    import doctest\n\n    doctest.testmod()\n"
          }
        }
      ]
    }
  ]
};
