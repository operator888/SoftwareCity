// Family: Architecture. 19 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Architecture"
  ],
  "patterns": [
    {
      "id": "mvc",
      "name": "Model-View-Controller",
      "family": "Architecture",
      "aka": [
        "MVC"
      ],
      "tagline": "Split an app into data and rules, what the user sees, and the glue that reacts to input.",
      "intent": "Keep the data and business rules (Model) apart from the presentation (View), and put a Controller in between that turns user input into model changes and then asks the view to redraw. Each part can change, be tested or be replaced without rewriting the other two.",
      "analogy": "A restaurant: the kitchen (model) cooks and knows the recipes, the plate on the table (view) is what the guest sees, and the waiter (controller) takes the order, tells the kitchen, and brings back the result.",
      "cityShape": "Look for three districts, models/, views/ and controllers/ (or three neighbouring buildings). The controller building sits in the middle with call pipes going out in two directions: to model floors like add() and to the view's render() floor. The view and model buildings have no pipes between each other.",
      "roles": [
        {
          "name": "Model",
          "desc": "Holds the data and enforces the rules (validation, totals, limits). Knows nothing about screens or input."
        },
        {
          "name": "View",
          "desc": "Turns model data into output (HTML, console text, DOM). Reads data, never changes it."
        },
        {
          "name": "Controller",
          "desc": "Receives user input, calls the model to change state, then tells the view what to show."
        },
        {
          "name": "App",
          "desc": "The entry point that creates the model, view and controller and wires them together."
        }
      ],
      "whenToUse": [
        "An app with a user interface whose rules should be testable without clicking through screens.",
        "You expect several views of the same data (web page, JSON API, admin screen).",
        "A team where designers change templates while developers change business rules."
      ],
      "pitfalls": [
        "Fat controllers: business rules creep into the controller instead of the model, and the model becomes a dumb data bag.",
        "Views that query the database or change state directly break the separation and make bugs hard to find.",
        "Over-engineering a tiny script with three layers when a single function would be clearer."
      ],
      "related": [
        "observer",
        "strategy",
        "flux-store",
        "client-server",
        "repository"
      ],
      "quiz": [
        {
          "q": "A shop must not let anyone order more than 10 of one item. Where should that rule live?",
          "options": [
            "In the view, so the button can be disabled",
            "In the model, so every controller and view gets the same rule",
            "In the controller, because it handles the click",
            "In the CSS"
          ],
          "answer": 1,
          "why": "Rules belong in the model. Views and controllers can change or multiply; the rule must hold no matter who calls the model."
        },
        {
          "q": "What should a view do when it needs data?",
          "options": [
            "Query the database itself",
            "Receive the data from the controller (or read it from the model) and only display it",
            "Call the controller's add() method",
            "Keep its own copy of the business rules"
          ],
          "answer": 1,
          "why": "A view only presents. It gets data handed to it, which keeps it easy to swap (HTML, console, JSON) and free of side effects."
        }
      ],
      "demos": [
        {
          "id": "mvc-py-library",
          "title": "Reading list in the console",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A tiny reading list driven by typed commands. Notice that BookList never prints and ConsoleView never changes data: only the controller talks to both.",
          "roles": {
            "Model": [
              "mvc-py-library/models/book_list.py#BookList"
            ],
            "View": [
              "mvc-py-library/views/console_view.py#ConsoleView"
            ],
            "Controller": [
              "mvc-py-library/controllers/library_controller.py#LibraryController"
            ],
            "App": [
              "mvc-py-library/app.py#main"
            ]
          },
          "trace": [
            {
              "at": "mvc-py-library/app.py#main",
              "say": "main() builds a model and a view, hands both to the controller, then feeds it user commands."
            },
            {
              "at": "mvc-py-library/controllers/library_controller.py#LibraryController.handle",
              "say": "The controller parses 'add Dune'. It decides which model method to call but holds no data itself."
            },
            {
              "at": "mvc-py-library/models/book_list.py#BookList.add",
              "say": "The model checks the rule (a title is required) and stores the book. No printing here."
            },
            {
              "at": "mvc-py-library/controllers/library_controller.py#LibraryController.refresh",
              "say": "After a change, the controller reads fresh data from the model and passes it to the view."
            },
            {
              "at": "mvc-py-library/views/console_view.py#ConsoleView.show_books",
              "say": "The view only formats what it is given. Swap it for a web page and the model stays the same."
            },
            {
              "at": "mvc-py-library/models/book_list.py#BookList.mark_read",
              "say": "'read 7' breaks a rule. The model raises an error instead of deciding how to display it."
            },
            {
              "at": "mvc-py-library/views/console_view.py#ConsoleView.show_error",
              "say": "The controller catches the error and lets the view present it. Each part keeps its own job."
            }
          ],
          "files": {
            "mvc-py-library/app.py": "from models.book_list import BookList\nfrom views.console_view import ConsoleView\nfrom controllers.library_controller import LibraryController\n\n\ndef main():\n    controller = LibraryController(BookList(), ConsoleView())\n    for command in [\"add Dune\", \"add The Hobbit\", \"read 0\", \"read 7\"]:\n        print(\"> \" + command)\n        controller.handle(command)\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "mvc-py-library/controllers/library_controller.py": "from models.book_list import BookList\nfrom views.console_view import ConsoleView\n\n\n# Controller: reads a user command, updates the model, asks the view to redraw.\nclass LibraryController:\n    def __init__(self, model, view):\n        self.model: BookList = model\n        self.view: ConsoleView = view\n\n    def handle(self, command):\n        action, _, arg = command.partition(\" \")\n        try:\n            if action == \"add\":\n                self.model.add(arg)\n            elif action == \"read\":\n                self.model.mark_read(int(arg))\n        except (ValueError, IndexError) as error:\n            self.view.show_error(str(error))\n            return\n        self.refresh()\n\n    def refresh(self):\n        self.view.show_books(self.model.all_books())\n",
            "mvc-py-library/models/book_list.py": "# Model: owns the data and the rules. It knows nothing about printing or input.\nclass BookList:\n    def __init__(self):\n        self.books = []\n\n    def add(self, title):\n        if not title.strip():\n            raise ValueError(\"A book needs a title\")\n        self.books.append({\"title\": title.strip(), \"read\": False})\n\n    def mark_read(self, index):\n        if index < 0 or index >= len(self.books):\n            raise IndexError(\"No book number \" + str(index))\n        self.books[index][\"read\"] = True\n\n    def all_books(self):\n        return list(self.books)\n",
            "mvc-py-library/views/console_view.py": "# View: turns data into something the user sees. No rules, no storage.\nclass ConsoleView:\n    def show_books(self, books):\n        print(\"--- My reading list ---\")\n        for i, book in enumerate(books):\n            mark = \"x\" if book[\"read\"] else \" \"\n            print(f\"{i}. [{mark}] {book['title']}\")\n\n    def show_error(self, message):\n        print(\"Oops: \" + message)\n"
          }
        },
        {
          "id": "mvc-php-shop",
          "title": "Shopping cart with a front controller",
          "lang": "PHP",
          "level": "intermediate",
          "source": null,
          "story": "A classic PHP web shop: public/index.php routes ?action=add&id=2 to CartController. Notice that the max-quantity rule sits in Cart, and HTML only appears in CartView.",
          "roles": {
            "Model": [
              "mvc-php-shop/src/Models/Cart.php#Cart",
              "mvc-php-shop/src/Models/ProductCatalog.php#ProductCatalog",
              "mvc-php-shop/src/Models/Product.php#Product"
            ],
            "View": [
              "mvc-php-shop/src/Views/CartView.php#CartView"
            ],
            "Controller": [
              "mvc-php-shop/src/Controllers/CartController.php#CartController"
            ],
            "App": [
              "mvc-php-shop/public/index.php#route"
            ]
          },
          "trace": [
            {
              "at": "mvc-php-shop/public/index.php#route",
              "say": "Every request enters the front controller. route() reads ?action and picks a controller method, so URLs stay out of the models."
            },
            {
              "at": "mvc-php-shop/src/Controllers/CartController.php#CartController.add",
              "say": "The controller asks the catalog for the product. If it is missing, it chooses the not-found view and a 404."
            },
            {
              "at": "mvc-php-shop/src/Models/ProductCatalog.php#ProductCatalog.find",
              "say": "The catalog model is the only place that knows where products come from."
            },
            {
              "at": "mvc-php-shop/src/Models/Cart.php#Cart.add",
              "say": "The cart applies the business rule: never more than MAX_QUANTITY. Any future controller gets the same rule for free."
            },
            {
              "at": "mvc-php-shop/src/Controllers/CartController.php#CartController.show",
              "say": "The controller gathers lines and total from the model and hands plain data to the view."
            },
            {
              "at": "mvc-php-shop/src/Models/Cart.php#Cart.totalCents",
              "say": "Totals are computed by the model, in cents, so the view never does money maths."
            },
            {
              "at": "mvc-php-shop/src/Views/CartView.php#CartView.render",
              "say": "The view builds HTML and escapes user-visible text. It reads data but never changes the cart."
            }
          ],
          "files": {
            "mvc-php-shop/public/index.php": "<?php\n// Front controller: every request enters here and is routed to a controller action.\nrequire_once __DIR__ . '/../src/Controllers/CartController.php';\n\nsession_start();\n\nfunction cartFromSession(): Cart\n{\n    if (!isset($_SESSION['cart'])) {\n        $_SESSION['cart'] = new Cart();\n    }\n    return $_SESSION['cart'];\n}\n\nfunction route(CartController $controller, array $query): string\n{\n    $action = $query['action'] ?? 'show';\n    $id = (int)($query['id'] ?? 0);\n    if ($action === 'add') {\n        return $controller->add($id, (int)($query['qty'] ?? 1));\n    }\n    if ($action === 'remove') {\n        return $controller->remove($id);\n    }\n    return $controller->show();\n}\n\n$controller = new CartController(cartFromSession(), new ProductCatalog(), new CartView());\necho route($controller, $_GET);\n",
            "mvc-php-shop/src/Controllers/CartController.php": "<?php\nrequire_once __DIR__ . '/../Models/Cart.php';\nrequire_once __DIR__ . '/../Models/ProductCatalog.php';\nrequire_once __DIR__ . '/../Views/CartView.php';\n\n// Controller: translates an HTTP request into model calls, then picks a view.\nclass CartController\n{\n    private Cart $cart;\n    private ProductCatalog $catalog;\n    private CartView $view;\n\n    public function __construct(Cart $cart, ProductCatalog $catalog, CartView $view)\n    {\n        $this->cart = $cart;\n        $this->catalog = $catalog;\n        $this->view = $view;\n    }\n\n    public function add(int $productId, int $quantity): string\n    {\n        $product = $this->catalog->find($productId);\n        if ($product === null) {\n            http_response_code(404);\n            return $this->view->renderNotFound($productId);\n        }\n        $this->cart->add($product, max(1, $quantity));\n        return $this->show('Added ' . $product->name);\n    }\n\n    public function remove(int $productId): string\n    {\n        $this->cart->remove($productId);\n        return $this->show('Item removed');\n    }\n\n    public function show(string $flash = ''): string\n    {\n        return $this->view->render($this->cart->lines(), $this->cart->totalCents(), $flash);\n    }\n}\n",
            "mvc-php-shop/src/Models/Cart.php": "<?php\nrequire_once __DIR__ . '/Product.php';\n\n// Model: the business rules of a cart. No HTML, no $_GET, no echo.\nclass Cart\n{\n    public const MAX_QUANTITY = 10;\n    private array $lines = [];\n\n    public function add(Product $product, int $quantity): void\n    {\n        $current = $this->lines[$product->id]['qty'] ?? 0;\n        $newQty = min($current + $quantity, self::MAX_QUANTITY);\n        $this->lines[$product->id] = ['product' => $product, 'qty' => $newQty];\n    }\n\n    public function remove(int $productId): void\n    {\n        unset($this->lines[$productId]);\n    }\n\n    public function lines(): array\n    {\n        return array_values($this->lines);\n    }\n\n    public function totalCents(): int\n    {\n        $total = 0;\n        foreach ($this->lines as $line) {\n            $total += $line['product']->priceCents * $line['qty'];\n        }\n        return $total;\n    }\n}\n",
            "mvc-php-shop/src/Models/Product.php": "<?php\n// Model: a plain value object. Prices are stored in cents to avoid rounding bugs.\nclass Product\n{\n    public int $id;\n    public string $name;\n    public int $priceCents;\n\n    public function __construct(int $id, string $name, int $priceCents)\n    {\n        $this->id = $id;\n        $this->name = $name;\n        $this->priceCents = $priceCents;\n    }\n}\n",
            "mvc-php-shop/src/Models/ProductCatalog.php": "<?php\nrequire_once __DIR__ . '/Product.php';\n\n// Model: where products come from. A real shop would query a database here.\nclass ProductCatalog\n{\n    private array $products = [];\n\n    public function __construct()\n    {\n        $this->products[1] = new Product(1, 'Espresso beans 1kg', 1890);\n        $this->products[2] = new Product(2, 'Milk frother', 2450);\n        $this->products[3] = new Product(3, 'Ceramic cup', 790);\n    }\n\n    public function find(int $id): ?Product\n    {\n        return $this->products[$id] ?? null;\n    }\n}\n",
            "mvc-php-shop/src/Views/CartView.php": "<?php\n// View: turns model data into HTML. It reads values but never changes them.\nclass CartView\n{\n    public function render(array $lines, int $totalCents, string $flash = ''): string\n    {\n        $html = '<h1>Your cart</h1>';\n        if ($flash !== '') {\n            $html .= '<p class=\"flash\">' . htmlspecialchars($flash) . '</p>';\n        }\n        $html .= '<ul>';\n        foreach ($lines as $line) {\n            $html .= '<li>' . htmlspecialchars($line['product']->name) . ' x ' . $line['qty'] . '</li>';\n        }\n        $html .= '</ul>';\n        return $html . '<p>Total: ' . $this->money($totalCents) . '</p>';\n    }\n\n    public function renderNotFound(int $productId): string\n    {\n        return '<h1>Sorry</h1><p>Product ' . $productId . ' does not exist.</p>';\n    }\n\n    private function money(int $cents): string\n    {\n        return number_format($cents / 100, 2) . ' EUR';\n    }\n}\n"
          }
        },
        {
          "id": "mvc-todomvc-real",
          "title": "TodoMVC in plain ES6",
          "lang": "JavaScript",
          "level": "intermediate",
          "source": {
            "repo": "tastejs/todomvc",
            "url": "https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/controller.js",
            "license": "MIT",
            "note": "All seven files are verbatim from examples/javascript-es6/src at tag v1.4; only a source header comment was added to each."
          },
          "story": "The famous TodoMVC app without a framework. The View wraps the DOM behind render() and bindCallback(), the Model wraps a Store, and the Controller connects them with callbacks.",
          "roles": {
            "Model": [
              "mvc-todomvc-real/src/model.js#Model",
              "mvc-todomvc-real/src/store.js#Store"
            ],
            "View": [
              "mvc-todomvc-real/src/view.js#View",
              "mvc-todomvc-real/src/template.js#Template"
            ],
            "Controller": [
              "mvc-todomvc-real/src/controller.js#Controller"
            ],
            "App": [
              "mvc-todomvc-real/src/app.js#Todo"
            ]
          },
          "trace": [
            {
              "at": "mvc-todomvc-real/src/app.js#Todo",
              "say": "Todo() is the wiring: Store into Model, Template into View, then Model and View into the Controller."
            },
            {
              "at": "mvc-todomvc-real/src/controller.js#Controller.constructor",
              "say": "The controller registers callbacks with the view. The view reports 'newTodo' without knowing who handles it."
            },
            {
              "at": "mvc-todomvc-real/src/view.js#View.bindCallback",
              "say": "bindCallback() hides DOM events. When Enter is pressed in the input, it calls the handler with the typed title."
            },
            {
              "at": "mvc-todomvc-real/src/controller.js#Controller.addItem",
              "say": "The controller ignores empty titles, then asks the model to create the todo."
            },
            {
              "at": "mvc-todomvc-real/src/model.js#Model.create",
              "say": "The model builds the todo object and saves it through the store. It never touches the DOM."
            },
            {
              "at": "mvc-todomvc-real/src/store.js#Store.save",
              "say": "The store assigns an id and persists the list. Swapping it for localStorage would not change the controller."
            },
            {
              "at": "mvc-todomvc-real/src/controller.js#Controller._filter",
              "say": "Back in the controller, _filter() refreshes counts and re-renders the list for the active route."
            },
            {
              "at": "mvc-todomvc-real/src/view.js#View.render",
              "say": "render() takes a command like 'showEntries' and updates the DOM using the template. All DOM work lives here."
            }
          ],
          "files": {
            "mvc-todomvc-real/src/app.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/app.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\nimport View from \"./view\";\nimport Controller from \"./controller\";\nimport Model from \"./model\";\nimport Store from \"./store\";\nimport Template from \"./template\";\n\nimport \"todomvc-app-css/index.css\";\nimport \"./app.css\";\n\nlet todo;\nconst onHashChange = () => {\n    todo.controller.setView(document.location.hash);\n};\n\nconst onLoad = () => {\n    todo = new Todo(\"javascript-es6-webpack\");\n    onHashChange();\n};\n\nfunction Todo(name) {\n    this.storage = new Store(name);\n    this.model = new Model(this.storage);\n    this.template = new Template();\n    this.view = new View(this.template);\n    this.controller = new Controller(this.model, this.view);\n}\n\n/* HOT MODULE SPECIFIC */\nif (module.hot) {\n    module.hot.accept(function (err) {});\n    if (document.readyState === \"complete\")\n        onLoad();\n}\n\nwindow.addEventListener(\"load\", onLoad);\nwindow.addEventListener(\"hashchange\", onHashChange);\n",
            "mvc-todomvc-real/src/controller.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/controller.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\nclass Controller {\n    /**\n     * Take a model & view, then act as controller between them\n     * @param  {object} model The model instance\n     * @param  {object} view  The view instance\n     */\n    constructor(model, view) {\n        this.model = model;\n        this.view = view;\n\n        this.view.bindCallback(\"newTodo\", (title) => this.addItem(title));\n        this.view.bindCallback(\"itemEdit\", (item) => this.editItem(item.id));\n        this.view.bindCallback(\"itemEditDone\", (item) => this.editItemSave(item.id, item.title));\n        this.view.bindCallback(\"itemEditCancel\", (item) => this.editItemCancel(item.id));\n        this.view.bindCallback(\"itemRemove\", (item) => this.removeItem(item.id));\n        this.view.bindCallback(\"itemToggle\", (item) => this.toggleComplete(item.id, item.completed));\n        this.view.bindCallback(\"removeCompleted\", () => this.removeCompletedItems());\n        this.view.bindCallback(\"toggleAll\", (status) => this.toggleAll(status.completed));\n    }\n\n    /**\n     * Load & Initialize the view\n     * @param {string}  '' | 'active' | 'completed'\n     */\n    setView(hash) {\n        const route = hash.split(\"/\")[1];\n        const page = route || \"\";\n        this._updateFilter(page);\n    }\n\n    /**\n     * Event fires on load. Gets all items & displays them\n     */\n    showAll() {\n        this.model.read((data) => this.view.render(\"showEntries\", data));\n    }\n\n    /**\n     * Renders all active tasks\n     */\n    showActive() {\n        this.model.read({ completed: false }, (data) => this.view.render(\"showEntries\", data));\n    }\n\n    /**\n     * Renders all completed tasks\n     */\n    showCompleted() {\n        this.model.read({ completed: true }, (data) => this.view.render(\"showEntries\", data));\n    }\n\n    /**\n     * An event to fire whenever you want to add an item. Simply pass in the event\n     * object and it'll handle the DOM insertion and saving of the new item.\n     */\n    addItem(title) {\n        if (title.trim() === \"\")\n            return;\n\n        this.model.create(title, () => {\n            this.view.render(\"clearNewTodo\");\n            this._filter(true);\n        });\n    }\n\n    /*\n     * Triggers the item editing mode.\n     */\n    editItem(id) {\n        this.model.read(id, (data) => {\n            let title = data[0].title;\n            this.view.render(\"editItem\", { id, title });\n        });\n    }\n\n    /*\n     * Finishes the item editing mode successfully.\n     */\n    editItemSave(id, title) {\n        title = title.trim();\n\n        if (title.length !== 0) {\n            this.model.update(id, { title }, () => {\n                this.view.render(\"editItemDone\", { id, title });\n            });\n        } else {\n            this.removeItem(id);\n        }\n    }\n\n    /*\n     * Cancels the item editing mode.\n     */\n    editItemCancel(id) {\n        this.model.read(id, (data) => {\n            const title = data[0].title;\n            this.view.render(\"editItemDone\", { id, title });\n        });\n    }\n\n    /**\n     * Find the DOM element with given ID,\n     * Then remove it from DOM & Storage\n     */\n    removeItem(id) {\n        this.model.remove(id, () => this.view.render(\"removeItem\", id));\n        this._filter();\n    }\n\n    /**\n     * Will remove all completed items from the DOM and storage.\n     */\n    removeCompletedItems() {\n        this.model.read({ completed: true }, (data) => {\n            for (let item of data)\n                this.removeItem(item.id);\n        });\n\n        this._filter();\n    }\n\n    /**\n     * Give it an ID of a model and a checkbox and it will update the item\n     * in storage based on the checkbox's state.\n     *\n     * @param {number} id The ID of the element to complete or uncomplete\n     * @param {object} checkbox The checkbox to check the state of complete\n     *                          or not\n     * @param {boolean|undefined} silent Prevent re-filtering the todo items\n     */\n    toggleComplete(id, completed, silent) {\n        this.model.update(id, { completed }, () => {\n            this.view.render(\"elementComplete\", { id, completed });\n        });\n\n        if (!silent)\n            this._filter();\n    }\n\n    /**\n     * Will toggle ALL checkboxes' on/off state and completeness of models.\n     * Just pass in the event object.\n     */\n    toggleAll(completed) {\n        this.model.read({ completed: !completed }, (data) => {\n            for (let item of data)\n                this.toggleComplete(item.id, completed, true);\n        });\n\n        this._filter();\n    }\n\n    /**\n     * Updates the pieces of the page which change depending on the remaining\n     * number of todos.\n     */\n    _updateCount() {\n        this.model.getCount((todos) => {\n            const completed = todos.completed;\n            const visible = completed > 0;\n            const checked = completed === todos.total;\n\n            this.view.render(\"updateElementCount\", todos.active);\n            this.view.render(\"clearCompletedButton\", { completed, visible });\n            this.view.render(\"toggleAll\", { checked });\n            this.view.render(\"contentBlockVisibility\", { visible: todos.total > 0 });\n        });\n    }\n\n    /**\n     * Re-filters the todo items, based on the active route.\n     * @param {boolean|undefined} force  forces a re-painting of todo items.\n     */\n    _filter(force) {\n        const active = this._activeRoute;\n        const activeRoute = active.charAt(0).toUpperCase() + active.substr(1);\n\n        // Update the elements on the page, which change with each completed todo\n        this._updateCount();\n\n        // If the last active route isn't \"All\", or we're switching routes, we\n        // re-create the todo item elements, calling:\n        //   this.show[All|Active|Completed]()\n        if (force || this._lastActiveRoute !== \"All\" || this._lastActiveRoute !== activeRoute)\n            this[`show${activeRoute}`]();\n\n        this._lastActiveRoute = activeRoute;\n    }\n\n    /**\n     * Simply updates the filter nav's selected states\n     */\n    _updateFilter(currentPage) {\n        // Store a reference to the active route, allowing us to re-filter todo\n        // items as they are marked complete or incomplete.\n        this._activeRoute = currentPage;\n\n        if (currentPage === \"\")\n            this._activeRoute = \"All\";\n\n        this._filter();\n\n        this.view.render(\"setFilter\", currentPage);\n    }\n}\n\nexport default Controller;\n",
            "mvc-todomvc-real/src/helpers.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/helpers.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\nexport { qs, qsa, $on, $delegate, $parent, remove };\n\n// Get element(s) by CSS selector:\nconst qs = (selector, scope) => {\n    return (scope || document).querySelector(selector);\n};\n\nconst qsa = (selector, scope) => {\n    return (scope || document).querySelectorAll(selector);\n};\n\n// addEventListener wrapper:\nconst $on = (target, type, callback, useCapture) => {\n    target.addEventListener(type, callback, !!useCapture);\n};\n\n// Attach a handler to event for all elements that match the selector,\n// now or in the future, based on a root element\nconst $delegate = (target, selector, type, handler) => {\n    // https://developer.mozilla.org/en-US/docs/Web/Events/blur\n    const useCapture = type === \"blur\" || type === \"focus\";\n    $on(target, type, dispatchEvent, useCapture);\n\n    function dispatchEvent(event) {\n        const targetElement = event.target;\n        const potentialElements = qsa(selector, target);\n        const hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;\n\n        if (hasMatch)\n            handler.call(targetElement, event);\n    }\n};\n\n// Find the element's parent with the given tag name:\n// $parent(qs('a'), 'div');\nconst $parent = (element, tagName) => {\n    if (!element.parentNode)\n        return undefined;\n\n    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase())\n        return element.parentNode;\n\n    return $parent(element.parentNode, tagName);\n};\n\n// removes an element from an array\n// const x = [1,2,3]\n// remove(x, 2)\n// x ~== [1,3]\nconst remove = (array, thing) => {\n    const index = array.indexOf(thing);\n    if (index === -1)\n        return array;\n\n    return array.splice(index, 1);\n};\n\n// Allow for looping on nodes by chaining:\n// qsa('.foo').forEach(function () {})\nNodeList.prototype.forEach = Array.prototype.forEach;\n",
            "mvc-todomvc-real/src/model.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/model.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\n/**\n * Creates a new Model instance and hooks up the storage.\n * @constructor\n * @param {object} storage A reference to the client side storage class\n */\nclass Model {\n    constructor(storage) {\n        this.storage = storage;\n    }\n\n    /**\n     * Creates a new todo model\n     *\n     * @param {string} [title] The title of the task\n     * @param {function} [callback] The callback to fire after the model is created\n     */\n    create(title, callback) {\n        title = title || \"\";\n\n        const newItem = {\n            title: title.trim(),\n            completed: false,\n        };\n\n        this.storage.save(newItem, callback);\n    }\n\n    /**\n     * Finds and returns a model in storage. If no query is given it'll simply\n     * return everything. If you pass in a string or number it'll look that up as\n     * the ID of the model to find. Lastly, you can pass it an object to match\n     * against.\n     *\n     * @param {string|number|object} [query] A query to match models against\n     * @param {function} [callback] The callback to fire after the model is found\n     *\n     * @example\n     * model.read(1, func) // Will find the model with an ID of 1\n     * model.read('1') // Same as above\n     * //Below will find a model with foo equalling bar and hello equalling world.\n     * model.read({ foo: 'bar', hello: 'world' })\n     */\n    read(query, callback) {\n        const queryType = typeof query;\n\n        if (queryType === \"function\") {\n            callback = query;\n            this.storage.findAll(callback);\n        } else if (queryType === \"string\" || queryType === \"number\") {\n            query = parseInt(query, 10);\n            this.storage.find({ id: query }, callback);\n        } else {\n            this.storage.find(query, callback);\n        }\n    }\n\n    /**\n     * Updates a model by giving it an ID, data to update, and a callback to fire when\n     * the update is complete.\n     *\n     * @param {number} id The id of the model to update\n     * @param {object} data The properties to update and their new value\n     * @param {function} callback The callback to fire when the update is complete.\n     */\n    update(id, data, callback) {\n        this.storage.save(data, callback, id);\n    }\n\n    /**\n     * Removes a model from storage\n     *\n     * @param {number} id The ID of the model to remove\n     * @param {function} callback The callback to fire when the removal is complete.\n     */\n    remove(id, callback) {\n        this.storage.remove(id, callback);\n    }\n\n    /**\n     * WARNING: Will remove ALL data from storage.\n     *\n     * @param {function} callback The callback to fire when the storage is wiped.\n     */\n    removeAll(callback) {\n        this.storage.drop(callback);\n    }\n\n    /**\n     * Returns a count of all todos\n     */\n    getCount(callback) {\n        if (!callback)\n            return;\n\n        const stats = {\n            active: 0,\n            completed: 0,\n            total: 0,\n        };\n\n        this.storage.findAll((data) => {\n            for (let todo of data) {\n                if (todo.completed)\n                    stats.completed++;\n                else\n                    stats.active++;\n\n                stats.total++;\n            }\n\n            callback(stats);\n        });\n    }\n}\n\nexport default Model;\n",
            "mvc-todomvc-real/src/store.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/store.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\nlet uniqueID = 1;\n/* HOT MODULE SPECIFIC\n * Since hot reload blows away class instances, storage object is\n * moved outside of the class.\n */\nlet memoryStorage = {};\n\n/**\n * Creates a new client side storage object and will create an empty\n * collection if no collection already exists.\n *\n * @param {string} name The name of our DB we want to use\n * @param {function} callback Our fake DB uses callbacks because in\n * real life you probably would be making AJAX calls\n */\nexport class Store {\n    constructor(name, callback) {\n        this._dbName = name;\n\n        if (!memoryStorage[name]) {\n            const data = {\n                todos: [],\n            };\n\n            memoryStorage[name] = JSON.stringify(data);\n        }\n\n        if (callback)\n            callback(JSON.parse(memoryStorage[name]));\n    }\n\n    /**\n     * Finds items based on a query given as a JS object\n     *\n     * @param {object} query The query to match against (i.e. {foo: 'bar'})\n     * @param {function} callback   The callback to fire when the query has\n     * completed running\n     *\n     * @example\n     * db.find({foo: 'bar', hello: 'world'}, function (data) {\n     *   // data will return any items that have foo: bar and\n     *   // hello: world in their properties\n     * })\n     */\n    find(query, callback) {\n        if (!callback)\n            return;\n\n        const { todos } = JSON.parse(memoryStorage[this._dbName]);\n\n        callback(\n            todos.filter((todo) => {\n                for (let q in query) {\n                    if (query[q] !== todo[q])\n                        return false;\n                }\n\n                return true;\n            })\n        );\n    }\n\n    /**\n     * Will retrieve all data from the collection\n     *\n     * @param {function} callback The callback to fire upon retrieving data\n     */\n    findAll(callback) {\n        if (!callback)\n            return;\n\n        callback(JSON.parse(memoryStorage[this._dbName]).todos);\n    }\n\n    /**\n     * Will save the given data to the DB. If no item exists it will create a new\n     * item, otherwise it'll simply update an existing item's properties\n     *\n     * @param {object} updateData The data to save back into the DB\n     * @param {function} callback The callback to fire after saving\n     * @param {number} id An optional param to enter an ID of an item to update\n     */\n    save(updateData, callback, id) {\n        const data = JSON.parse(memoryStorage[this._dbName]);\n        const { todos } = data;\n\n        // If an ID was actually given, find the item and update each property\n        if (id) {\n            for (let i = 0; i < todos.length; i++) {\n                if (todos[i].id === id) {\n                    for (let key in updateData)\n                        todos[i][key] = updateData[key];\n\n                    break;\n                }\n            }\n\n            memoryStorage[this._dbName] = JSON.stringify(data);\n\n            if (callback)\n                callback(JSON.parse(memoryStorage[this._dbName]).todos);\n        } else {\n            // Generate an ID\n            updateData.id = uniqueID++;\n\n            todos.push(updateData);\n            memoryStorage[this._dbName] = JSON.stringify(data);\n\n            if (callback)\n                callback([updateData]);\n        }\n    }\n\n    /**\n     * Will remove an item from the Store based on its ID\n     *\n     * @param {number} id The ID of the item you want to remove\n     * @param {function} callback The callback to fire after saving\n     */\n    remove(id, callback) {\n        const data = JSON.parse(memoryStorage[this._dbName]);\n        const { todos } = data;\n\n        for (let i = 0; i < todos.length; i++) {\n            if (todos[i].id === id) {\n                todos.splice(i, 1);\n                break;\n            }\n        }\n\n        memoryStorage[this._dbName] = JSON.stringify(data);\n\n        if (callback)\n            callback(JSON.parse(memoryStorage[this._dbName]).todos);\n    }\n\n    /**\n     * Will drop all storage and start fresh\n     *\n     * @param {function} callback The callback to fire after dropping the data\n     */\n    drop(callback) {\n        memoryStorage[this._dbName] = JSON.stringify({ todos: [] });\n\n        if (callback)\n            callback(JSON.parse(memoryStorage[this._dbName]).todos);\n    }\n}\n\nexport default Store;\n",
            "mvc-todomvc-real/src/template.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/template.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\n\"use strict\";\n\nconst htmlEscapes = {\n    \"&\": \"&amp\",\n    \"<\": \"&lt\",\n    \">\": \"&gt\",\n    '\"': \"&quot\",\n    \"'\": \"&#x27\",\n    \"`\": \"&#x60\",\n};\n\nconst reUnescapedHtml = /[&<>\"'`]/g;\nconst reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);\n\nconst escape = (str) => str && reHasUnescapedHtml.test(str) ? str.replace(reUnescapedHtml, escapeHtmlChar) : str;\nconst escapeHtmlChar = (chr) => htmlEscapes[chr];\n\nconst createTodoItem = ({ id, title, completed, checked, index }) => `\n<li data-id=\"${id}\" class=\"${completed}\">\n    <div class=\"view\">\n        <input class=\"toggle\" type=\"checkbox\" ${checked}>\n        <label>${title}</label>\n        <button class=\"destroy\"></button>\n    </div>\n</li>\n`;\n\nclass Template {\n    /**\n     * Creates an <li> HTML string and returns it for placement in your app.\n     *\n     * NOTE: In real life you should be using a templating engine such as Mustache\n     * or Handlebars, however, this is a vanilla JS example.\n     *\n     * @param {object} data The object containing keys you want to find in the\n     *                      template to replace.\n     * @returns {string} HTML String of an <li> element\n     *\n     * @example\n     * view.show({\n     *  id: 1,\n     *  title: \"Hello World\",\n     *  completed: 0,\n     * })\n     */\n    show(data) {\n        let view = \"\";\n\n        data.reverse().forEach((item, index) => {\n            view += createTodoItem({\n                id: item.id,\n                title: escape(item.title),\n                completed: item.completed ? \"completed\" : \"\",\n                checked: item.completed ? \"checked\" : \"\",\n                index: index,\n            });\n        });\n\n        return view;\n    }\n\n    /**\n     * Displays a counter of how many to dos are left to complete\n     *\n     * @param {number} activeTodos The number of active todos.\n     * @returns {string} String containing the count\n     */\n    itemCounter(activeTodos) {\n        const plural = activeTodos === 1 ? \"\" : \"s\";\n        return `<strong>${activeTodos}</strong> item${plural} left`;\n    }\n\n    /**\n     * Updates the text within the \"Clear completed\" button\n     *\n     * @param  {[type]} completedTodos The number of completed todos.\n     * @returns {string} String containing the count\n     */\n    clearCompletedButton(completedTodos) {\n        return completedTodos > 0 ? \"Clear completed\" : \"\";\n    }\n}\n\nexport default Template;\n",
            "mvc-todomvc-real/src/view.js": "/*\n * Source: TodoMVC v1.4 (examples/javascript-es6) — https://github.com/tastejs/todomvc/blob/v1.4/examples/javascript-es6/src/view.js\n * MIT License, Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk. Included for study.\n */\n/* eslint no-invalid-this: 0, complexity:[2, 9] */\nimport { qs, qsa, $on, $parent, $delegate } from \"./helpers\";\n\nconst ENTER_KEY = 13;\nconst ESCAPE_KEY = 27;\n\nconst _setFilter = (currentPage) => {\n    qs(\".filters .selected\").className = \"\";\n    qs(`.filters [href=\"#/${currentPage}\"]`).className = \"selected\";\n};\n\nconst _elementComplete = (id, completed) => {\n    const listItem = qs(`[data-id=\"${id}\"]`);\n\n    if (!listItem)\n        return;\n\n    listItem.className = completed ? \"completed\" : \"\";\n\n    // In case it was toggled from an event and not by clicking the checkbox\n    qs(\"input\", listItem).checked = completed;\n};\n\nconst _editItem = (id, title) => {\n    const listItem = qs(`[data-id=\"${id}\"]`);\n\n    if (!listItem)\n        return;\n\n    listItem.className = `${listItem.className} editing`;\n\n    const input = document.createElement(\"input\");\n    input.className = \"edit\";\n\n    listItem.appendChild(input);\n    input.focus();\n    input.value = title;\n};\n\nconst _editItemDone = (id, title) => {\n    const listItem = qs(`[data-id=\"${id}\"]`);\n\n    if (!listItem)\n        return;\n\n    const input = qs(\"input.edit\", listItem);\n    listItem.removeChild(input);\n\n    listItem.className = listItem.className.replace(\" editing\", \"\");\n\n    qsa(\"label\", listItem).forEach((label) => {\n        label.textContent = title;\n    });\n};\n\nconst _itemId = (element) => {\n    const li = $parent(element, \"li\");\n    return parseInt(li.dataset.id, 10);\n};\n\nconst _removeItem = (id, list) => {\n    const elem = qs(`[data-id=\"${id}\"]`);\n\n    if (elem)\n        list.removeChild(elem);\n};\n\n/**\n * View that abstracts away the browser's DOM completely.\n * It has two simple entry points:\n *\n *   - bind(eventName, handler)\n *     Takes a todo application event and registers the handler\n *   - render(command, parameterObject)\n *     Renders the given command with the options\n */\nexport default class View {\n    constructor(template) {\n        this.template = template;\n\n        this.$todoList = qs(\".todo-list\");\n        this.$todoItemCounter = qs(\".todo-count\");\n        this.$clearCompleted = qs(\".clear-completed\");\n        this.$main = qs(\".main\");\n        this.$footer = qs(\".footer\");\n        this.$toggleAllInput = qs(\".toggle-all\");\n        this.$toggleAll = qs(\".toggle-all-label\");\n        this.$newTodo = qs(\".new-todo\");\n\n        this.render = this.render.bind(this);\n        this.bindCallback = this.bindCallback.bind(this);\n    }\n\n    _clearCompletedButton(completedCount, visible) {\n        this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);\n        this.$clearCompleted.style.display = visible ? \"block\" : \"none\";\n    }\n\n    // eslint-disable-next-line complexity\n    render(viewCmd, parameter) {\n        switch (viewCmd) {\n            case \"showEntries\":\n                this.$todoList.innerHTML = this.template.show(parameter);\n                break;\n            case \"updateElementCount\":\n                this.$todoItemCounter.innerHTML = this.template.itemCounter(parameter);\n                break;\n            case \"contentBlockVisibility\":\n                this.$main.style.display = this.$footer.style.display = parameter.visible ? \"block\" : \"none\";\n                break;\n            case \"toggleAll\":\n                this.$toggleAllInput.checked = parameter.checked;\n                break;\n            case \"clearNewTodo\":\n                this.$newTodo.value = \"\";\n                break;\n            case \"removeItem\":\n                _removeItem(parameter, this.$todoList);\n                break;\n            case \"setFilter\":\n                _setFilter(parameter);\n                break;\n            case \"elementComplete\":\n                _elementComplete(parameter.id, parameter.completed);\n                break;\n            case \"editItem\":\n                _editItem(parameter.id, parameter.title);\n                break;\n            case \"editItemDone\":\n                _editItemDone(parameter.id, parameter.title);\n                break;\n            case \"clearCompletedButton\":\n                this._clearCompletedButton(parameter.completed, parameter.visible, this.clearCompletedButton);\n                break;\n        }\n    }\n\n    bindCallback(event, handler) {\n        switch (event) {\n            case \"newTodo\":\n                $on(this.$newTodo, \"change\", () => handler(this.$newTodo.value));\n                break;\n            case \"removeCompleted\":\n                $on(this.$clearCompleted, \"click\", handler);\n                break;\n            case \"toggleAll\":\n                $on(this.$toggleAll, \"click\", () => {\n                    this.$toggleAllInput.click();\n                    handler({ completed: this.$toggleAllInput.checked });\n                });\n                break;\n            case \"itemEdit\":\n                $delegate(this.$todoList, \"li label\", \"dblclick\", (e) => handler({ id: _itemId(e.target) }));\n                break;\n            case \"itemRemove\":\n                $delegate(this.$todoList, \".destroy\", \"click\", (e) => handler({ id: _itemId(e.target) }));\n                break;\n            case \"itemToggle\":\n                $delegate(this.$todoList, \".toggle\", \"click\", (e) => handler({ id: _itemId(e.target), completed: e.target.checked }));\n                break;\n            case \"itemEditDone\":\n                $delegate(this.$todoList, \"li .edit\", \"blur\", function (e) {\n                    if (!e.target.dataset.iscanceled) {\n                        handler({\n                            id: _itemId(e.target),\n                            title: e.target.value,\n                        });\n                    }\n                });\n                $delegate(this.$todoList, \"li .edit\", \"keypress\", function (e) {\n                    if (e.keyCode === ENTER_KEY)\n                        e.target.blur();\n                });\n                break;\n            case \"itemEditCancel\":\n                $delegate(this.$todoList, \"li .edit\", \"keyup\", (e) => {\n                    if (e.keyCode === ESCAPE_KEY) {\n                        e.target.dataset.iscanceled = true;\n                        e.target.blur();\n                        handler({ id: _itemId(e.target) });\n                    }\n                });\n                break;\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "mvvm",
      "name": "Model-View-ViewModel",
      "family": "Architecture",
      "aka": [
        "MVVM",
        "Presentation Model (ancestor)"
      ],
      "tagline": "A ViewModel holds screen state; data binding keeps the view in sync automatically.",
      "intent": "Move everything the screen needs (formatted text, enabled flags, loading states, commands) into a ViewModel that has no widgets in it. A binding mechanism copies ViewModel changes into the View and user input back into the ViewModel, so the View shrinks to layout and the screen logic becomes testable without a UI.",
      "analogy": "A car dashboard: the engine (model) does the real work, a small computer (view model) turns sensor numbers into 'Fuel low' or '87 km/h', and the gauges (view) are wired to those signals and simply move when they change.",
      "cityShape": "Look for a viewmodels/ district in the middle: the views/ building has no pipes to models/, only to the view model and the binding code. The view model building's roof is crowded with antennas (observable fields like celsius, TotalText, state), and its floors are small handlers that write those fields.",
      "roles": [
        {
          "name": "Model",
          "desc": "Domain data and rules (conversions, cart limits, a weather API). Knows nothing about screens."
        },
        {
          "name": "ViewModel",
          "desc": "Screen state and commands in plain, ready-to-display form. Calls the model, exposes observable properties, never references a widget."
        },
        {
          "name": "View",
          "desc": "Widgets and layout. Binds to ViewModel properties and forwards user events; contains no business logic."
        },
        {
          "name": "Binding",
          "desc": "The machinery that keeps View and ViewModel in sync: observables, PropertyChanged events, StateFlow collectors, or a framework's {Binding}."
        }
      ],
      "whenToUse": [
        "UI frameworks with data binding built in: WPF/MAUI/Avalonia, Android Jetpack (ViewModel + StateFlow/Compose), Vue, Knockout, SwiftUI.",
        "Screen logic (validation, enabling buttons, formatting, loading states) should be unit-tested without starting a UI.",
        "Several views (phone and tablet layout, light and full editor) present the same screen state."
      ],
      "pitfalls": [
        "A ViewModel that grows into a god object with business rules inside; keep rules in the model and only screen logic in the ViewModel.",
        "Two-way bindings that update each other in a loop; guard setters with an 'unchanged? then stop' check.",
        "Magic bindings (string property names, reflection) fail silently at runtime when a name is misspelled; prefer nameof() or typed bindings."
      ],
      "related": [
        "mvc",
        "observer",
        "command",
        "flux-store",
        "repository"
      ],
      "quiz": [
        {
          "q": "How does a View learn that CartViewModel.TotalText has changed?",
          "options": [
            "The ViewModel calls view.SetTotal()",
            "The binding listens to PropertyChanged and copies the new value into the label",
            "The View polls the Cart model every frame",
            "The Model raises an event on the View"
          ],
          "answer": 1,
          "why": "The ViewModel only announces the change. The binding layer, not the ViewModel, knows which widget shows that property, so the ViewModel never references the View."
        },
        {
          "q": "Which test is easiest to write in MVVM?",
          "options": [
            "Clicking a real button in a UI test runner",
            "Calling WeatherViewModel.onSearchClicked() with a fake repository and checking state",
            "Screenshot comparison of the View",
            "Testing the binding engine itself"
          ],
          "answer": 1,
          "why": "The ViewModel is a plain object: give it a fake model, call its commands, and assert on its observable state. No window is needed."
        }
      ],
      "demos": [
        {
          "id": "mvvm-ts-temperature",
          "title": "Two-way temperature converter",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Type into the Celsius box and the Fahrenheit box updates, and the other way round. Notice that converter-view.ts contains no maths and the view model contains no widgets: binding.ts is the only bridge.",
          "roles": {
            "Model": [
              "mvvm-ts-temperature/models/temperature.ts#celsiusToFahrenheit",
              "mvvm-ts-temperature/models/temperature.ts#fahrenheitToCelsius",
              "mvvm-ts-temperature/models/temperature.ts#isPhysical"
            ],
            "ViewModel": [
              "mvvm-ts-temperature/viewmodels/converter-view-model.ts#ConverterViewModel"
            ],
            "View": [
              "mvvm-ts-temperature/views/converter-view.ts#ConverterView"
            ],
            "Binding": [
              "mvvm-ts-temperature/core/observable.ts#Observable",
              "mvvm-ts-temperature/core/binding.ts#bindValue",
              "mvvm-ts-temperature/core/binding.ts#bindText"
            ]
          },
          "trace": [
            {
              "at": "mvvm-ts-temperature/main.ts#main",
              "say": "main() creates the view model first, then a view around three widgets, and asks the view to bind itself."
            },
            {
              "at": "mvvm-ts-temperature/views/converter-view.ts#ConverterView.bind",
              "say": "The view only declares 'this box shows that property'. It never decides what the numbers mean."
            },
            {
              "at": "mvvm-ts-temperature/core/binding.ts#bindValue",
              "say": "A two-way binding: view model changes are written into the box, and typing in the box calls set() on the observable."
            },
            {
              "at": "mvvm-ts-temperature/core/observable.ts#Observable.set",
              "say": "The user typed 100. set() stores it and notifies listeners, but stops early if nothing changed, which prevents an endless C-F-C loop."
            },
            {
              "at": "mvvm-ts-temperature/viewmodels/converter-view-model.ts#ConverterViewModel.onCelsiusChanged",
              "say": "The view model reacts: it asks the model to convert and updates the warning and the Fahrenheit text."
            },
            {
              "at": "mvvm-ts-temperature/models/temperature.ts#celsiusToFahrenheit",
              "say": "The actual rule lives in the model, reusable by any screen or test."
            },
            {
              "at": "mvvm-ts-temperature/viewmodels/converter-view-model.ts#ConverterViewModel.onFahrenheitChanged",
              "say": "Setting fahrenheit triggers this handler too, but it converts back to the same 100.0 C, so the chain settles."
            }
          ],
          "files": {
            "mvvm-ts-temperature/core/binding.ts": "import { Observable } from './observable';\n\n// The binder: glue code you would normally get from a framework.\nexport interface TextInput {\n  value: string;\n  onInput(handler: (text: string) => void): void;\n}\n\nexport interface Label {\n  text: string;\n}\n\n// One-way: view model -> view.\nexport function bindText(label: Label, source: Observable<string>): void {\n  source.subscribe(v => {\n    label.text = v;\n  });\n}\n\n// Two-way: view model <-> view.\nexport function bindValue(input: TextInput, source: Observable<string>): void {\n  source.subscribe(v => {\n    input.value = v;\n  });\n  input.onInput(text => source.set(text));\n}\n",
            "mvvm-ts-temperature/core/observable.ts": "// A tiny observable value: the heart of data binding.\nexport type Listener<T> = (value: T) => void;\n\nexport class Observable<T> {\n  private listeners: Listener<T>[] = [];\n\n  constructor(private value: T) {}\n\n  get(): T {\n    return this.value;\n  }\n\n  set(next: T): void {\n    if (next === this.value) return; // stops two-way bindings from looping forever\n    this.value = next;\n    for (const l of this.listeners) {\n      l(next);\n    }\n  }\n\n  subscribe(l: Listener<T>): void {\n    this.listeners.push(l);\n    l(this.value);\n  }\n}\n",
            "mvvm-ts-temperature/main.ts": "import { TextInput, Label } from './core/binding';\nimport { ConverterViewModel } from './viewmodels/converter-view-model';\nimport { ConverterView } from './views/converter-view';\n\n// A fake text box so the demo runs in Node; in a browser this wraps an <input>.\nfunction fakeInput(name: string): TextInput & { type(text: string): void } {\n  let handler: (text: string) => void = () => {};\n  return {\n    value: '',\n    onInput(h) { handler = h; },\n    type(text: string) {\n      this.value = text;\n      console.log(name + ' typed: ' + text);\n      handler(text);\n    },\n  };\n}\n\nexport function main(): void {\n  const c = fakeInput('C');\n  const f = fakeInput('F');\n  const warn: Label = { text: '' };\n  const vm = new ConverterViewModel();\n  new ConverterView(c, f, warn).bind(vm);\n  c.type('100');\n  console.log('F box now shows', f.value);\n  c.type('-300');\n  console.log('warning:', warn.text);\n}\n\nmain();\n",
            "mvvm-ts-temperature/models/temperature.ts": "// Model: plain rules about temperatures. No UI, no observables.\nexport const ABSOLUTE_ZERO_C = -273.15;\n\nexport function celsiusToFahrenheit(c: number): number {\n  return c * 9 / 5 + 32;\n}\n\nexport function fahrenheitToCelsius(f: number): number {\n  return (f - 32) * 5 / 9;\n}\n\nexport function isPhysical(c: number): boolean {\n  return c >= ABSOLUTE_ZERO_C;\n}\n",
            "mvvm-ts-temperature/viewmodels/converter-view-model.ts": "import { Observable } from '../core/observable';\nimport { celsiusToFahrenheit, fahrenheitToCelsius, isPhysical } from '../models/temperature';\n\n// ViewModel: state shaped for the screen. Strings in, strings out.\nexport class ConverterViewModel {\n  readonly celsius = new Observable<string>('20');\n  readonly fahrenheit = new Observable<string>('68');\n  readonly warning = new Observable<string>('');\n\n  constructor() {\n    this.celsius.subscribe(text => this.onCelsiusChanged(text));\n    this.fahrenheit.subscribe(text => this.onFahrenheitChanged(text));\n  }\n\n  private onCelsiusChanged(text: string): void {\n    const c = Number(text);\n    if (Number.isNaN(c)) return;\n    this.warning.set(isPhysical(c) ? '' : 'Colder than absolute zero!');\n    this.fahrenheit.set(celsiusToFahrenheit(c).toFixed(1));\n  }\n\n  private onFahrenheitChanged(text: string): void {\n    const f = Number(text);\n    if (Number.isNaN(f)) return;\n    this.celsius.set(fahrenheitToCelsius(f).toFixed(1));\n  }\n}\n",
            "mvvm-ts-temperature/views/converter-view.ts": "import { bindText, bindValue, Label, TextInput } from '../core/binding';\nimport { ConverterViewModel } from '../viewmodels/converter-view-model';\n\n// View: only widgets and bindings. No maths, no if-statements about temperatures.\nexport class ConverterView {\n  constructor(\n    private celsiusBox: TextInput,\n    private fahrenheitBox: TextInput,\n    private warningLabel: Label,\n  ) {}\n\n  bind(vm: ConverterViewModel): void {\n    bindValue(this.celsiusBox, vm.celsius);\n    bindValue(this.fahrenheitBox, vm.fahrenheit);\n    bindText(this.warningLabel, vm.warning);\n  }\n}\n"
          }
        },
        {
          "id": "mvvm-cs-cart",
          "title": "Shopping cart with INotifyPropertyChanged",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "The WPF way without XAML: CartViewModel raises PropertyChanged, a RelayCommand backs the Add button, and Binder.cs does what {Binding} would. After five items the command disables the button by itself.",
          "roles": {
            "Model": [
              "mvvm-cs-cart/Models/Cart.cs#Cart",
              "mvvm-cs-cart/Models/Product.cs"
            ],
            "ViewModel": [
              "mvvm-cs-cart/ViewModels/CartViewModel.cs#CartViewModel",
              "mvvm-cs-cart/ViewModels/ViewModelBase.cs#ViewModelBase",
              "mvvm-cs-cart/ViewModels/RelayCommand.cs#RelayCommand"
            ],
            "View": [
              "mvvm-cs-cart/Views/CartView.cs#CartView"
            ],
            "Binding": [
              "mvvm-cs-cart/Binding/Binder.cs#Binder"
            ]
          },
          "trace": [
            {
              "at": "mvvm-cs-cart/Program.cs#Program.Main",
              "say": "Main builds the model, then the view model around it, then the view around the view model: dependencies point inward."
            },
            {
              "at": "mvvm-cs-cart/Views/CartView.cs#CartView.CartView",
              "say": "The view's constructor only sets up bindings: two labels follow properties, the button's enabled state follows the command."
            },
            {
              "at": "mvvm-cs-cart/Binding/Binder.cs#Binder.BindText",
              "say": "BindText subscribes to PropertyChanged and re-reads the property by name. This is the plumbing XAML hides from you."
            },
            {
              "at": "mvvm-cs-cart/Views/CartView.cs#CartView.ClickAdd",
              "say": "A click does not call cart code. It executes the bound command, exactly like Command=\"{Binding AddFeaturedCommand}\"."
            },
            {
              "at": "mvvm-cs-cart/ViewModels/RelayCommand.cs#RelayCommand.Execute",
              "say": "The command checks CanExecute first, so the 'max 5 lines' rule also protects against a stale enabled button."
            },
            {
              "at": "mvvm-cs-cart/ViewModels/CartViewModel.cs#CartViewModel.AddFeatured",
              "say": "The view model calls the model, then sets TotalText and Status as ready-to-show strings and tells the command to re-check."
            },
            {
              "at": "mvvm-cs-cart/ViewModels/ViewModelBase.cs#ViewModelBase.SetProperty",
              "say": "SetProperty skips equal values and raises PropertyChanged with the caller's name, which wakes up exactly the matching binding."
            },
            {
              "at": "mvvm-cs-cart/Models/Cart.cs#Cart.Total",
              "say": "Money maths stays in the model. The view model only formats it, the view only shows it."
            }
          ],
          "files": {
            "mvvm-cs-cart/Binding/Binder.cs": "using System;\nusing System.ComponentModel;\nusing System.Windows.Input;\n\nnamespace Shop.Binding;\n\n// What XAML's {Binding} does for you, written out by hand.\npublic static class Binder\n{\n    public static void BindText(INotifyPropertyChanged source, string property, Action<string> setTarget)\n    {\n        setTarget(Read(source, property));\n        source.PropertyChanged += (sender, e) =>\n        {\n            if (e.PropertyName == property) setTarget(Read(source, property));\n        };\n    }\n\n    public static void BindEnabled(ICommand command, Action<bool> setEnabled)\n    {\n        setEnabled(command.CanExecute(null));\n        command.CanExecuteChanged += (sender, e) => setEnabled(command.CanExecute(null));\n    }\n\n    private static string Read(object source, string property)\n    {\n        var value = source.GetType().GetProperty(property)?.GetValue(source);\n        return value?.ToString() ?? \"\";\n    }\n}\n",
            "mvvm-cs-cart/Models/Cart.cs": "using System.Collections.Generic;\nusing System.Linq;\n\nnamespace Shop.Models;\n\npublic class Cart\n{\n    public const int MaxLines = 5;\n    private readonly List<Product> _items = new();\n\n    public IReadOnlyList<Product> Items => _items;\n\n    public bool CanAdd()\n    {\n        return _items.Count < MaxLines;\n    }\n\n    public void Add(Product product)\n    {\n        if (!CanAdd()) throw new System.InvalidOperationException(\"Cart is full\");\n        _items.Add(product);\n    }\n\n    public decimal Total()\n    {\n        return _items.Sum(p => p.Price);\n    }\n}\n",
            "mvvm-cs-cart/Models/Product.cs": "namespace Shop.Models;\n\n// Model: domain data and rules. Knows nothing about screens.\npublic record Product(string Sku, string Name, decimal Price);\n",
            "mvvm-cs-cart/Program.cs": "using Shop.Models;\nusing Shop.ViewModels;\nusing Shop.Views;\n\nnamespace Shop;\n\npublic static class Program\n{\n    public static void Main()\n    {\n        var cart = new Cart();\n        var mug = new Product(\"MUG-1\", \"Software City mug\", 12.50m);\n        var vm = new CartViewModel(cart, mug);\n        var view = new CartView(vm);\n        for (var i = 0; i < 6; i++)\n        {\n            view.ClickAdd();\n        }\n    }\n}\n",
            "mvvm-cs-cart/ViewModels/CartViewModel.cs": "using Shop.Models;\n\nnamespace Shop.ViewModels;\n\n// ViewModel: exposes ready-to-show strings and commands. No widgets in here.\npublic class CartViewModel : ViewModelBase\n{\n    private readonly Cart _cart;\n    private readonly Product _featured;\n    private string _totalText = \"0.00 EUR\";\n    private string _status = \"\";\n\n    public RelayCommand AddFeaturedCommand { get; }\n\n    public CartViewModel(Cart cart, Product featured)\n    {\n        _cart = cart;\n        _featured = featured;\n        AddFeaturedCommand = new RelayCommand(AddFeatured, _cart.CanAdd);\n    }\n\n    public string TotalText\n    {\n        get => _totalText;\n        private set => SetProperty(ref _totalText, value);\n    }\n\n    public string Status\n    {\n        get => _status;\n        private set => SetProperty(ref _status, value);\n    }\n\n    private void AddFeatured()\n    {\n        _cart.Add(_featured);\n        TotalText = _cart.Total().ToString(\"0.00\") + \" EUR\";\n        Status = _cart.Items.Count + \" item(s) in cart\";\n        AddFeaturedCommand.RaiseCanExecuteChanged();\n    }\n}\n",
            "mvvm-cs-cart/ViewModels/RelayCommand.cs": "using System;\nusing System.Windows.Input;\n\nnamespace Shop.ViewModels;\n\n// A button binds to a command instead of calling code-behind.\npublic class RelayCommand : ICommand\n{\n    private readonly Action _execute;\n    private readonly Func<bool> _canExecute;\n\n    public event EventHandler? CanExecuteChanged;\n\n    public RelayCommand(Action execute, Func<bool> canExecute)\n    {\n        _execute = execute;\n        _canExecute = canExecute;\n    }\n\n    public bool CanExecute(object? parameter)\n    {\n        return _canExecute();\n    }\n\n    public void Execute(object? parameter)\n    {\n        if (CanExecute(parameter)) _execute();\n    }\n\n    public void RaiseCanExecuteChanged()\n    {\n        CanExecuteChanged?.Invoke(this, EventArgs.Empty);\n    }\n}\n",
            "mvvm-cs-cart/ViewModels/ViewModelBase.cs": "using System.ComponentModel;\nusing System.Runtime.CompilerServices;\n\nnamespace Shop.ViewModels;\n\n// Every view model raises PropertyChanged so bindings know when to refresh.\npublic abstract class ViewModelBase : INotifyPropertyChanged\n{\n    public event PropertyChangedEventHandler? PropertyChanged;\n\n    // Real projects make this generic (SetProperty<T>); every property here is a string.\n    protected bool SetProperty(ref string field, string value, [CallerMemberName] string name = \"\")\n    {\n        if (field == value) return false;\n        field = value;\n        OnPropertyChanged(name);\n        return true;\n    }\n\n    protected void OnPropertyChanged(string name)\n    {\n        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));\n    }\n}\n",
            "mvvm-cs-cart/Views/CartView.cs": "using System;\nusing Shop.Binding;\nusing Shop.ViewModels;\n\nnamespace Shop.Views;\n\n// The View: \"widgets\" plus bindings. In WPF this would be CartView.xaml.\npublic class CartView\n{\n    private readonly CartViewModel _vm;\n    public string TotalLabel = \"\";\n    public string StatusLabel = \"\";\n    public bool AddButtonEnabled;\n\n    public CartView(CartViewModel vm)\n    {\n        _vm = vm;\n        Binder.BindText(vm, nameof(CartViewModel.TotalText), text => TotalLabel = text);\n        Binder.BindText(vm, nameof(CartViewModel.Status), text => StatusLabel = text);\n        Binder.BindEnabled(vm.AddFeaturedCommand, enabled => AddButtonEnabled = enabled);\n    }\n\n    public void ClickAdd()\n    {\n        _vm.AddFeaturedCommand.Execute(null);\n        Console.WriteLine($\"[{StatusLabel}] total {TotalLabel} | add button enabled: {AddButtonEnabled}\");\n    }\n}\n"
          }
        },
        {
          "id": "mvvm-kt-weather",
          "title": "Weather screen with StateFlow",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "Android-style MVVM in plain Kotlin: the ViewModel exposes one StateFlow of a sealed UI state, the screen collects it and renders. Loading, success and error are all just values, so the screen has no flags to juggle.",
          "roles": {
            "Model": [
              "mvvm-kt-weather/src/data/WeatherRepository.kt#WeatherRepository",
              "mvvm-kt-weather/src/data/WeatherRepository.kt#FakeWeatherApi",
              "mvvm-kt-weather/src/data/Forecast.kt#Forecast"
            ],
            "ViewModel": [
              "mvvm-kt-weather/src/ui/WeatherViewModel.kt#WeatherViewModel",
              "mvvm-kt-weather/src/ui/WeatherUiState.kt#WeatherUiState"
            ],
            "View": [
              "mvvm-kt-weather/src/ui/WeatherScreen.kt#WeatherScreen"
            ],
            "Binding": [
              "mvvm-kt-weather/src/ui/WeatherScreen.kt#WeatherScreen.bind"
            ]
          },
          "trace": [
            {
              "at": "mvvm-kt-weather/src/Main.kt#main",
              "say": "main wires a fake API into the view model and the view model into the screen, then simulates a user."
            },
            {
              "at": "mvvm-kt-weather/src/ui/WeatherScreen.kt#WeatherScreen.bind",
              "say": "The binding: the screen collects the state flow and calls render() for every new value. On Android, Compose does this with collectAsState()."
            },
            {
              "at": "mvvm-kt-weather/src/ui/WeatherViewModel.kt#WeatherViewModel.onQueryChanged",
              "say": "Typing only updates the view model's query. No network call yet, no UI code."
            },
            {
              "at": "mvvm-kt-weather/src/ui/WeatherViewModel.kt#WeatherViewModel.onSearchClicked",
              "say": "Search sets Loading at once (the screen updates), cancels any older search and launches a coroutine."
            },
            {
              "at": "mvvm-kt-weather/src/data/WeatherRepository.kt#FakeWeatherApi.forecastFor",
              "say": "The model fetches data. It returns a Forecast with a Double, not a display string."
            },
            {
              "at": "mvvm-kt-weather/src/ui/WeatherViewModel.kt#WeatherViewModel.toUiState",
              "say": "The view model turns domain data into screen data: a title, a formatted temperature and an isHot flag."
            },
            {
              "at": "mvvm-kt-weather/src/ui/WeatherScreen.kt#WeatherScreen.render",
              "say": "The screen just maps each state to output. 'Atlantis' arrives as a Failed state, not an exception, so the view needs no try/catch."
            }
          ],
          "files": {
            "mvvm-kt-weather/src/Main.kt": "package weather\n\nimport kotlinx.coroutines.cancelChildren\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.runBlocking\nimport weather.data.FakeWeatherApi\nimport weather.ui.WeatherScreen\nimport weather.ui.WeatherViewModel\n\nfun main() = runBlocking {\n    val viewModel = WeatherViewModel(FakeWeatherApi(), this)\n    val screen = WeatherScreen(viewModel)\n    screen.bind(this)\n\n    screen.userTypes(\"Athens\")\n    screen.userTapsSearch()\n    delay(500)\n    screen.userTypes(\"Atlantis\")\n    screen.userTapsSearch()\n    delay(500)\n    coroutineContext.cancelChildren()\n}\n",
            "mvvm-kt-weather/src/data/Forecast.kt": "package weather.data\n\n// Model: what the weather service returns.\ndata class Forecast(val city: String, val tempC: Double, val summary: String)\n\nclass CityNotFound(city: String) : Exception(\"Unknown city: $city\")\n",
            "mvvm-kt-weather/src/data/WeatherRepository.kt": "package weather.data\n\nimport kotlinx.coroutines.delay\n\n// Model layer: where the data comes from. The ViewModel only sees this interface.\ninterface WeatherRepository {\n    suspend fun forecastFor(city: String): Forecast\n}\n\nclass FakeWeatherApi : WeatherRepository {\n    private val known = mapOf(\n        \"augsburg\" to Forecast(\"Augsburg\", 14.0, \"Cloudy\"),\n        \"athens\" to Forecast(\"Athens\", 27.5, \"Sunny\"),\n    )\n\n    override suspend fun forecastFor(city: String): Forecast {\n        delay(300) // pretend network\n        return known[city.lowercase()] ?: throw CityNotFound(city)\n    }\n}\n",
            "mvvm-kt-weather/src/ui/WeatherScreen.kt": "package weather.ui\n\nimport kotlinx.coroutines.CoroutineScope\nimport kotlinx.coroutines.launch\n\n// View: renders whatever state arrives and forwards user events. Like a Compose screen, minus Compose.\nclass WeatherScreen(private val viewModel: WeatherViewModel) {\n\n    fun bind(scope: CoroutineScope) {\n        scope.launch {\n            viewModel.state.collect { state -> render(state) }\n        }\n    }\n\n    fun userTypes(text: String) {\n        viewModel.onQueryChanged(text)\n    }\n\n    fun userTapsSearch() {\n        viewModel.onSearchClicked()\n    }\n\n    private fun render(state: WeatherUiState) {\n        val line = when (state) {\n            is WeatherUiState.Idle -> \"Type a city\"\n            is WeatherUiState.Loading -> \"Loading...\"\n            is WeatherUiState.Shown -> state.title + \"  \" + state.temperature + if (state.isHot) \"  (hot!)\" else \"\"\n            is WeatherUiState.Failed -> \"Error: \" + state.message\n        }\n        println(\"[screen] $line\")\n    }\n}\n",
            "mvvm-kt-weather/src/ui/WeatherUiState.kt": "package weather.ui\n\n// Everything the screen can show, as one immutable value.\nsealed interface WeatherUiState {\n    object Idle : WeatherUiState\n    object Loading : WeatherUiState\n    data class Shown(val title: String, val temperature: String, val isHot: Boolean) : WeatherUiState\n    data class Failed(val message: String) : WeatherUiState\n}\n",
            "mvvm-kt-weather/src/ui/WeatherViewModel.kt": "package weather.ui\n\nimport kotlinx.coroutines.CoroutineScope\nimport kotlinx.coroutines.Job\nimport kotlinx.coroutines.flow.MutableStateFlow\nimport kotlinx.coroutines.flow.StateFlow\nimport kotlinx.coroutines.flow.asStateFlow\nimport kotlinx.coroutines.launch\nimport weather.data.Forecast\nimport weather.data.WeatherRepository\n\n// ViewModel: owns screen state, survives screen rotation on Android, never touches a widget.\nclass WeatherViewModel(\n    private val repository: WeatherRepository,\n    private val scope: CoroutineScope,\n) {\n    private val _state = MutableStateFlow<WeatherUiState>(WeatherUiState.Idle)\n    val state: StateFlow<WeatherUiState> = _state.asStateFlow()\n\n    private var query = \"\"\n    private var running: Job? = null\n\n    fun onQueryChanged(text: String) {\n        query = text.trim()\n    }\n\n    fun onSearchClicked() {\n        if (query.isEmpty()) return\n        running?.cancel() // a new search replaces an old one\n        _state.value = WeatherUiState.Loading\n        running = scope.launch {\n            _state.value = load(query)\n        }\n    }\n\n    private suspend fun load(city: String): WeatherUiState {\n        return try {\n            toUiState(repository.forecastFor(city))\n        } catch (e: Exception) {\n            WeatherUiState.Failed(e.message ?: \"Something went wrong\")\n        }\n    }\n\n    private fun toUiState(f: Forecast): WeatherUiState {\n        return WeatherUiState.Shown(\n            title = \"${f.city}: ${f.summary}\",\n            temperature = \"%.1f °C\".format(f.tempC),\n            isHot = f.tempC >= 25.0,\n        )\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "repository",
      "name": "Repository",
      "family": "Architecture",
      "aka": [
        "Data access layer",
        "DAO (close cousin)"
      ],
      "tagline": "Hide storage behind a collection-like interface so business code never writes SQL.",
      "intent": "Put all reading and writing of one kind of object behind an interface that looks like a collection (add, find, update). Services depend only on that interface, so you can swap an in-memory list for SQL, a file or an API without touching the business rules, and tests run without a database.",
      "analogy": "A library desk: you ask the librarian for a book by title and hand returns back to them. Whether the book sits on a shelf, in the basement or arrives from another branch is the librarian's problem, not yours.",
      "cityShape": "Look for layered districts: controllers/ or handler/ calls into services/, which calls into repositories/. Inside repositories/ two buildings (in-memory and SQL) have floors with the same names at the same heights, both linked to one interface. Only the SQL building has pipes to the storage code.",
      "roles": [
        {
          "name": "Repository Interface",
          "desc": "The contract: collection-style methods like add, findById, findByCustomer. Speaks in domain objects, not rows."
        },
        {
          "name": "Concrete Repository",
          "desc": "One implementation per storage: an in-memory list for tests, a SQL version for production."
        },
        {
          "name": "Service",
          "desc": "Business rules that load and save objects only through the repository interface."
        },
        {
          "name": "Controller",
          "desc": "The outer layer (HTTP handler, CLI, UI) that calls the service and formats the result."
        },
        {
          "name": "Composition Root",
          "desc": "The one place that picks which concrete repository to build and passes it in."
        }
      ],
      "whenToUse": [
        "Business rules should be unit-tested without starting a database.",
        "You may change storage later (SQLite now, Postgres later, or a remote API).",
        "Several services read and write the same kind of object and you want the queries in one place."
      ],
      "pitfalls": [
        "Leaky abstractions: returning ORM entities, SQL rows or query builders from the interface ties callers to the database anyway.",
        "Generic repositories with dozens of methods (findByThisAndThat) grow into a second query language; prefer a few intention-revealing methods.",
        "Wrapping an ORM that already is a repository can add a layer with no benefit in small apps."
      ],
      "related": [
        "dependency-injection",
        "adapter",
        "facade",
        "strategy",
        "mvc",
        "client-server"
      ],
      "quiz": [
        {
          "q": "You want to test OrderService's 'minimum order value' rule quickly. What does the Repository pattern let you do?",
          "options": [
            "Mock the HTTP layer",
            "Pass an in-memory repository to the service instead of the SQL one",
            "Disable the rule in tests",
            "Run the SQL against a spreadsheet"
          ],
          "answer": 1,
          "why": "The service depends only on the repository interface, so a fast in-memory implementation can stand in for the database."
        },
        {
          "q": "Which method signature fits a repository interface best?",
          "options": [
            "GetById(int id): Order",
            "ExecuteSql(string sql): DataTable",
            "RenderOrderHtml(Order o): string",
            "OpenConnection(): SqliteConnection"
          ],
          "answer": 0,
          "why": "A repository speaks the language of the domain (orders, ids). SQL strings, connections and HTML are details it should hide or never touch."
        }
      ],
      "demos": [
        {
          "id": "repository-ts-notes",
          "title": "Notes: memory or localStorage",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Notes flow through three layers: controller, service, repository. Two repositories share one interface and main.ts picks one. Notice the service never imports either implementation.",
          "roles": {
            "Repository Interface": [
              "repository-ts-notes/repositories/note-repository.ts#NoteRepository"
            ],
            "Concrete Repository": [
              "repository-ts-notes/repositories/in-memory-note-repository.ts#InMemoryNoteRepository",
              "repository-ts-notes/repositories/local-storage-note-repository.ts#LocalStorageNoteRepository"
            ],
            "Service": [
              "repository-ts-notes/services/note-service.ts#NoteService"
            ],
            "Controller": [
              "repository-ts-notes/controllers/note-controller.ts#NoteController"
            ],
            "Composition Root": [
              "repository-ts-notes/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "repository-ts-notes/main.ts#main",
              "say": "main() picks the in-memory repository and passes it inward. This is the only line that names a storage."
            },
            {
              "at": "repository-ts-notes/controllers/note-controller.ts#NoteController.handle",
              "say": "The controller turns 'add Buy milk' into a service call. It knows commands, not storage."
            },
            {
              "at": "repository-ts-notes/services/note-service.ts#NoteService.addNote",
              "say": "The service applies its rule (no empty notes), then asks the repository to save. It never sees an array or a key."
            },
            {
              "at": "repository-ts-notes/repositories/in-memory-note-repository.ts#InMemoryNoteRepository.save",
              "say": "The in-memory version gives the note an id and pushes it into an array."
            },
            {
              "at": "repository-ts-notes/services/note-service.ts#NoteService.listNotes",
              "say": "For 'list', the service asks for findAll() and only formats the result."
            },
            {
              "at": "repository-ts-notes/repositories/in-memory-note-repository.ts#InMemoryNoteRepository.findAll",
              "say": "It returns a copy, so callers cannot change the stored list by accident."
            },
            {
              "at": "repository-ts-notes/repositories/local-storage-note-repository.ts#LocalStorageNoteRepository.save",
              "say": "The browser version keeps the same contract but writes JSON to localStorage. Swap it in main() and no other file changes."
            }
          ],
          "files": {
            "repository-ts-notes/controllers/note-controller.ts": "import { NoteService } from '../services/note-service';\n\n// Outer layer: turns a typed command into a service call.\nexport class NoteController {\n  private service: NoteService;\n\n  constructor(service: NoteService) {\n    this.service = service;\n  }\n\n  handle(command: string): string {\n    if (command.startsWith('add ')) {\n      return this.service.addNote(command.slice(4));\n    }\n    return this.service.listNotes().join('\\n');\n  }\n}\n",
            "repository-ts-notes/main.ts": "import { NoteController } from './controllers/note-controller';\nimport { NoteService } from './services/note-service';\nimport { InMemoryNoteRepository } from './repositories/in-memory-note-repository';\n\nfunction main(): void {\n  // Swap in new LocalStorageNoteRepository() and nothing else changes.\n  const repo = new InMemoryNoteRepository();\n  const controller = new NoteController(new NoteService(repo));\n  for (const command of ['add Buy milk', 'add   ', 'add Call grandma', 'list']) {\n    console.log(controller.handle(command));\n  }\n}\n\nmain();\n",
            "repository-ts-notes/models/note.ts": "export interface Note {\n  id: number;\n  text: string;\n}\n",
            "repository-ts-notes/repositories/in-memory-note-repository.ts": "import { Note } from '../models/note';\nimport { NoteRepository } from './note-repository';\n\n// Keeps notes in an array. Perfect for tests and prototypes.\nexport class InMemoryNoteRepository implements NoteRepository {\n  private notes: Note[] = [];\n  private nextId = 1;\n\n  save(text: string): Note {\n    const note = { id: this.nextId++, text };\n    this.notes.push(note);\n    return note;\n  }\n\n  findAll(): Note[] {\n    return [...this.notes];\n  }\n\n  findById(id: number): Note | undefined {\n    return this.notes.find(n => n.id === id);\n  }\n}\n",
            "repository-ts-notes/repositories/local-storage-note-repository.ts": "import { Note } from '../models/note';\nimport { NoteRepository } from './note-repository';\n\n// Same contract, but notes survive a page reload in the browser.\nexport class LocalStorageNoteRepository implements NoteRepository {\n  private key = 'notes';\n\n  save(text: string): Note {\n    const notes = this.findAll();\n    const note = { id: notes.length + 1, text };\n    localStorage.setItem(this.key, JSON.stringify([...notes, note]));\n    return note;\n  }\n\n  findAll(): Note[] {\n    return JSON.parse(localStorage.getItem(this.key) ?? '[]');\n  }\n\n  findById(id: number): Note | undefined {\n    return this.findAll().find(n => n.id === id);\n  }\n}\n",
            "repository-ts-notes/repositories/note-repository.ts": "import { Note } from '../models/note';\n\n// The contract the rest of the app depends on: \"a collection of notes\".\nexport interface NoteRepository {\n  save(text: string): Note;\n  findAll(): Note[];\n  findById(id: number): Note | undefined;\n}\n",
            "repository-ts-notes/services/note-service.ts": "import { NoteRepository } from '../repositories/note-repository';\n\n// Business logic only. It never knows where notes are stored.\nexport class NoteService {\n  private repo: NoteRepository;\n\n  constructor(repo: NoteRepository) {\n    this.repo = repo;\n  }\n\n  addNote(text: string): string {\n    if (text.trim().length === 0) {\n      return 'Empty notes are not saved.';\n    }\n    const note = this.repo.save(text.trim());\n    return `Saved note #${note.id}`;\n  }\n\n  listNotes(): string[] {\n    return this.repo.findAll().map(n => `${n.id}: ${n.text}`);\n  }\n}\n"
          }
        },
        {
          "id": "repository-cs-orders",
          "title": "Orders: in-memory vs SQLite",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "A layered order API: OrdersController calls OrderService, which uses IOrderRepository. Run with --sql to switch to SQLite. Notice SQL appears only in SqlOrderRepository and Database.",
          "roles": {
            "Repository Interface": [
              "repository-cs-orders/Repositories/IOrderRepository.cs#IOrderRepository"
            ],
            "Concrete Repository": [
              "repository-cs-orders/Repositories/InMemoryOrderRepository.cs#InMemoryOrderRepository",
              "repository-cs-orders/Repositories/SqlOrderRepository.cs#SqlOrderRepository"
            ],
            "Service": [
              "repository-cs-orders/Services/OrderService.cs#OrderService"
            ],
            "Controller": [
              "repository-cs-orders/Controllers/OrdersController.cs#OrdersController"
            ],
            "Composition Root": [
              "repository-cs-orders/Program.cs#Program.CreateRepository"
            ]
          },
          "trace": [
            {
              "at": "repository-cs-orders/Program.cs#Program.Main",
              "say": "Main builds the layers from the inside out: repository, then service, then controller."
            },
            {
              "at": "repository-cs-orders/Program.cs#Program.CreateRepository",
              "say": "One flag decides the storage. With --sql it prepares the database and returns the SQL repository; both have the same type."
            },
            {
              "at": "repository-cs-orders/Controllers/OrdersController.cs#OrdersController.Post",
              "say": "The controller only maps the request to a service call and the result (or error) to a status code."
            },
            {
              "at": "repository-cs-orders/Services/OrderService.cs#OrderService.PlaceOrder",
              "say": "The business rule (minimum 5 EUR) lives here, then the service calls _orders.Add without knowing which class is behind it."
            },
            {
              "at": "repository-cs-orders/Repositories/InMemoryOrderRepository.cs#InMemoryOrderRepository.Add",
              "say": "In memory, adding means giving an id and putting the order into a Dictionary."
            },
            {
              "at": "repository-cs-orders/Repositories/SqlOrderRepository.cs#SqlOrderRepository.Add",
              "say": "In SQL, the same call becomes an INSERT with parameters. The service cannot tell the difference."
            },
            {
              "at": "repository-cs-orders/Storage/Database.cs#Database.Open",
              "say": "The storage layer below the repository just opens connections. It knows tables, not business rules."
            },
            {
              "at": "repository-cs-orders/Services/OrderService.cs#OrderService.Cancel",
              "say": "Cancelling loads, checks a rule (shipped orders stay), changes status and saves back: load-modify-save through one interface."
            }
          ],
          "files": {
            "repository-cs-orders/Controllers/OrdersController.cs": "using Shop.Services;\n\nnamespace Shop.Controllers;\n\n// The outer layer: turns requests into service calls and results into responses.\npublic class OrdersController\n{\n    private readonly OrderService _service;\n\n    public OrdersController(OrderService service)\n    {\n        _service = service;\n    }\n\n    public string Post(string customer, decimal total)\n    {\n        try\n        {\n            var order = _service.PlaceOrder(customer, total);\n            return $\"201 Created: order {order.Id}\";\n        }\n        catch (ArgumentException ex)\n        {\n            return $\"400 Bad Request: {ex.Message}\";\n        }\n    }\n\n    public string Delete(int id)\n    {\n        return _service.Cancel(id) ? \"204 No Content\" : \"409 Conflict\";\n    }\n\n    public string GetHistory(string customer)\n    {\n        var orders = _service.History(customer);\n        return string.Join(\"\\n\", orders.Select(o => $\"#{o.Id} {o.Total} EUR {o.Status}\"));\n    }\n}\n",
            "repository-cs-orders/Models/Order.cs": "namespace Shop.Models;\n\npublic class Order\n{\n    public int Id { get; set; }\n    public string Customer { get; set; } = \"\";\n    public decimal Total { get; set; }\n    public string Status { get; set; } = \"new\";\n}\n",
            "repository-cs-orders/Program.cs": "using Shop.Controllers;\nusing Shop.Repositories;\nusing Shop.Services;\nusing Shop.Storage;\n\npublic static class Program\n{\n    public static void Main(string[] args)\n    {\n        IOrderRepository repo = CreateRepository(args.Contains(\"--sql\"));\n        var controller = new OrdersController(new OrderService(repo));\n\n        Console.WriteLine(controller.Post(\"ana\", 42.50m));\n        Console.WriteLine(controller.Post(\"ana\", 2m));\n        Console.WriteLine(controller.Delete(1));\n        Console.WriteLine(controller.GetHistory(\"ana\"));\n    }\n\n    // The only line that knows which storage is used.\n    private static IOrderRepository CreateRepository(bool useSql)\n    {\n        if (!useSql)\n        {\n            return new InMemoryOrderRepository();\n        }\n        var db = new Database(\"Data Source=shop.db\");\n        db.EnsureSchema();\n        return new SqlOrderRepository(db);\n    }\n}\n",
            "repository-cs-orders/Repositories/IOrderRepository.cs": "using Shop.Models;\n\nnamespace Shop.Repositories;\n\n// The collection-like contract. Services depend on this, never on SQL.\npublic interface IOrderRepository\n{\n    Order? GetById(int id);\n    IReadOnlyList<Order> FindByCustomer(string customer);\n    void Add(Order order);\n    void Update(Order order);\n}\n",
            "repository-cs-orders/Repositories/InMemoryOrderRepository.cs": "using Shop.Models;\n\nnamespace Shop.Repositories;\n\n// Used by unit tests and local demos: a Dictionary pretending to be a table.\npublic class InMemoryOrderRepository : IOrderRepository\n{\n    private readonly Dictionary<int, Order> _orders = new();\n    private int _nextId = 1;\n\n    public Order? GetById(int id)\n    {\n        return _orders.TryGetValue(id, out var order) ? order : null;\n    }\n\n    public IReadOnlyList<Order> FindByCustomer(string customer)\n    {\n        return _orders.Values.Where(o => o.Customer == customer).ToList();\n    }\n\n    public void Add(Order order)\n    {\n        order.Id = _nextId++;\n        _orders[order.Id] = order;\n    }\n\n    public void Update(Order order)\n    {\n        _orders[order.Id] = order;\n    }\n}\n",
            "repository-cs-orders/Repositories/SqlOrderRepository.cs": "using Microsoft.Data.Sqlite;\nusing Shop.Models;\nusing Shop.Storage;\n\nnamespace Shop.Repositories;\n\n// Same contract as the in-memory version, backed by SQLite.\npublic class SqlOrderRepository : IOrderRepository\n{\n    private readonly Database _db;\n\n    public SqlOrderRepository(Database db)\n    {\n        _db = db;\n    }\n\n    public Order? GetById(int id)\n    {\n        using var connection = _db.Open();\n        var cmd = connection.CreateCommand();\n        cmd.CommandText = \"SELECT id, customer, total, status FROM orders WHERE id = $id\";\n        cmd.Parameters.AddWithValue(\"$id\", id);\n        using var reader = cmd.ExecuteReader();\n        return reader.Read() ? Map(reader) : null;\n    }\n\n    public IReadOnlyList<Order> FindByCustomer(string customer)\n    {\n        using var connection = _db.Open();\n        var cmd = connection.CreateCommand();\n        cmd.CommandText = \"SELECT id, customer, total, status FROM orders WHERE customer = $c\";\n        cmd.Parameters.AddWithValue(\"$c\", customer);\n        using var reader = cmd.ExecuteReader();\n        var result = new List<Order>();\n        while (reader.Read())\n        {\n            result.Add(Map(reader));\n        }\n        return result;\n    }\n\n    public void Add(Order order)\n    {\n        using var connection = _db.Open();\n        var cmd = connection.CreateCommand();\n        cmd.CommandText = \"INSERT INTO orders (customer, total, status) VALUES ($c, $t, $s); SELECT last_insert_rowid();\";\n        cmd.Parameters.AddWithValue(\"$c\", order.Customer);\n        cmd.Parameters.AddWithValue(\"$t\", order.Total);\n        cmd.Parameters.AddWithValue(\"$s\", order.Status);\n        order.Id = Convert.ToInt32(cmd.ExecuteScalar());\n    }\n\n    public void Update(Order order)\n    {\n        using var connection = _db.Open();\n        var cmd = connection.CreateCommand();\n        cmd.CommandText = \"UPDATE orders SET status = $s, total = $t WHERE id = $id\";\n        cmd.Parameters.AddWithValue(\"$s\", order.Status);\n        cmd.Parameters.AddWithValue(\"$t\", order.Total);\n        cmd.Parameters.AddWithValue(\"$id\", order.Id);\n        cmd.ExecuteNonQuery();\n    }\n\n    private static Order Map(SqliteDataReader reader)\n    {\n        return new Order { Id = reader.GetInt32(0), Customer = reader.GetString(1), Total = reader.GetDecimal(2), Status = reader.GetString(3) };\n    }\n}\n",
            "repository-cs-orders/Services/OrderService.cs": "using Shop.Models;\nusing Shop.Repositories;\n\nnamespace Shop.Services;\n\n// Business rules: minimum order value, which orders may be cancelled.\npublic class OrderService\n{\n    private const decimal MinimumTotal = 5m;\n    private readonly IOrderRepository _orders;\n\n    public OrderService(IOrderRepository orders)\n    {\n        _orders = orders;\n    }\n\n    public Order PlaceOrder(string customer, decimal total)\n    {\n        if (total < MinimumTotal)\n        {\n            throw new ArgumentException($\"Orders must be at least {MinimumTotal} EUR\");\n        }\n        var order = new Order { Customer = customer, Total = total };\n        _orders.Add(order);\n        return order;\n    }\n\n    public bool Cancel(int orderId)\n    {\n        var order = _orders.GetById(orderId);\n        if (order == null || order.Status == \"shipped\")\n        {\n            return false;\n        }\n        order.Status = \"cancelled\";\n        _orders.Update(order);\n        return true;\n    }\n\n    public IReadOnlyList<Order> History(string customer)\n    {\n        return _orders.FindByCustomer(customer);\n    }\n}\n",
            "repository-cs-orders/Storage/Database.cs": "using Microsoft.Data.Sqlite;\n\nnamespace Shop.Storage;\n\n// The storage layer: opens connections and creates the schema. No business words here.\npublic class Database\n{\n    private readonly string _connectionString;\n\n    public Database(string connectionString)\n    {\n        _connectionString = connectionString;\n    }\n\n    public SqliteConnection Open()\n    {\n        var connection = new SqliteConnection(_connectionString);\n        connection.Open();\n        return connection;\n    }\n\n    public void EnsureSchema()\n    {\n        using var connection = Open();\n        var cmd = connection.CreateCommand();\n        cmd.CommandText = \"CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, customer TEXT, total REAL, status TEXT)\";\n        cmd.ExecuteNonQuery();\n    }\n}\n"
          }
        },
        {
          "id": "repository-go-scores",
          "title": "Arcade leaderboard: memory or Postgres",
          "lang": "Go",
          "level": "advanced",
          "source": null,
          "story": "An HTTP leaderboard in Go. The handler calls the Leaderboard service, which uses a ScoreRepository interface; main picks memory or Postgres from DATABASE_URL. Go interfaces are implicit, so a var _ line checks each type.",
          "roles": {
            "Repository Interface": [
              "repository-go-scores/repository/repository.go#ScoreRepository"
            ],
            "Concrete Repository": [
              "repository-go-scores/repository/memory.go#MemoryScoreRepository",
              "repository-go-scores/repository/postgres.go#PostgresScoreRepository"
            ],
            "Service": [
              "repository-go-scores/service/leaderboard.go#Leaderboard"
            ],
            "Controller": [
              "repository-go-scores/handler/scores.go#ScoreHandler"
            ],
            "Composition Root": [
              "repository-go-scores/main.go#chooseRepository"
            ]
          },
          "trace": [
            {
              "at": "repository-go-scores/main.go#main",
              "say": "main wires the layers: repository into the service, the service into the HTTP handler, the handler into the router."
            },
            {
              "at": "repository-go-scores/main.go#chooseRepository",
              "say": "The storage choice depends on one environment variable. Everything else receives the ScoreRepository interface."
            },
            {
              "at": "repository-go-scores/handler/scores.go#ScoreHandler.Submit",
              "say": "The handler decodes JSON and maps errors to HTTP codes. It never touches storage."
            },
            {
              "at": "repository-go-scores/service/leaderboard.go#Leaderboard.Submit",
              "say": "The service validates and keeps only personal bests. It checks repository.ErrNotFound, not sql.ErrNoRows, so it stays storage-neutral."
            },
            {
              "at": "repository-go-scores/repository/postgres.go#PostgresScoreRepository.BestFor",
              "say": "The Postgres version runs a query and translates sql.ErrNoRows into the repository's own ErrNotFound."
            },
            {
              "at": "repository-go-scores/repository/memory.go#MemoryScoreRepository.BestFor",
              "say": "The memory version answers the same question by looping over a slice under a read lock. Tests use this one."
            },
            {
              "at": "repository-go-scores/repository/postgres.go#PostgresScoreRepository.Save",
              "say": "Saving is an INSERT here, an append in memory. The service called Save and does not care which."
            },
            {
              "at": "repository-go-scores/handler/scores.go#ScoreHandler.Top",
              "say": "Reads go the same way: handler, then service TopTen, then repository Top with ORDER BY or sort.Slice."
            }
          ],
          "files": {
            "repository-go-scores/handler/scores.go": "package handler\n\nimport (\n\t\"encoding/json\"\n\t\"net/http\"\n\n\t\"example.com/arcade/service\"\n)\n\n// ScoreHandler is the controller layer: HTTP in, service call, JSON out.\ntype ScoreHandler struct {\n\tboard *service.Leaderboard\n}\n\nfunc NewScoreHandler(board *service.Leaderboard) *ScoreHandler {\n\treturn &ScoreHandler{board: board}\n}\n\ntype submitRequest struct {\n\tPlayer string `json:\"player\"`\n\tPoints int    `json:\"points\"`\n}\n\nfunc (h *ScoreHandler) Submit(w http.ResponseWriter, r *http.Request) {\n\tvar req submitRequest\n\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil {\n\t\thttp.Error(w, \"bad json\", http.StatusBadRequest)\n\t\treturn\n\t}\n\tisBest, err := h.board.Submit(r.Context(), req.Player, req.Points)\n\tif err != nil {\n\t\thttp.Error(w, err.Error(), http.StatusUnprocessableEntity)\n\t\treturn\n\t}\n\tjson.NewEncoder(w).Encode(map[string]bool{\"personalBest\": isBest})\n}\n\nfunc (h *ScoreHandler) Top(w http.ResponseWriter, r *http.Request) {\n\tscores, err := h.board.TopTen(r.Context())\n\tif err != nil {\n\t\thttp.Error(w, \"storage unavailable\", http.StatusServiceUnavailable)\n\t\treturn\n\t}\n\tjson.NewEncoder(w).Encode(scores)\n}\n",
            "repository-go-scores/main.go": "package main\n\nimport (\n\t\"database/sql\"\n\t\"log\"\n\t\"net/http\"\n\t\"os\"\n\n\t_ \"github.com/lib/pq\"\n\n\t\"example.com/arcade/handler\"\n\t\"example.com/arcade/repository\"\n\t\"example.com/arcade/service\"\n)\n\n// chooseRepository is the single place that decides memory or Postgres.\nfunc chooseRepository() repository.ScoreRepository {\n\tdsn := os.Getenv(\"DATABASE_URL\")\n\tif dsn == \"\" {\n\t\tlog.Println(\"no DATABASE_URL: using in-memory scores\")\n\t\treturn repository.NewMemory()\n\t}\n\tdb, err := sql.Open(\"postgres\", dsn)\n\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n\treturn repository.NewPostgres(db)\n}\n\nfunc main() {\n\tboard := service.NewLeaderboard(chooseRepository())\n\th := handler.NewScoreHandler(board)\n\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"POST /scores\", h.Submit)\n\tmux.HandleFunc(\"GET /scores/top\", h.Top)\n\tlog.Fatal(http.ListenAndServe(\":8080\", mux))\n}\n",
            "repository-go-scores/model/score.go": "package model\n\nimport \"time\"\n\n// Score is a plain domain object. It has no idea how it is stored.\ntype Score struct {\n\tPlayer   string\n\tPoints   int\n\tAchieved time.Time\n}\n",
            "repository-go-scores/repository/memory.go": "package repository\n\nimport (\n\t\"context\"\n\t\"sort\"\n\t\"sync\"\n\n\t\"example.com/arcade/model\"\n)\n\n// MemoryScoreRepository keeps scores in a slice guarded by a mutex.\n// Tests use it because it needs no database and starts empty every time.\ntype MemoryScoreRepository struct {\n\tmu     sync.RWMutex\n\tscores []model.Score\n}\n\n// Compile-time check: the build fails if this type stops matching the interface.\nvar _ ScoreRepository = (*MemoryScoreRepository)(nil)\n\nfunc NewMemory() *MemoryScoreRepository {\n\treturn &MemoryScoreRepository{}\n}\n\nfunc (r *MemoryScoreRepository) Save(ctx context.Context, s model.Score) error {\n\tr.mu.Lock()\n\tdefer r.mu.Unlock()\n\tr.scores = append(r.scores, s)\n\treturn nil\n}\n\nfunc (r *MemoryScoreRepository) BestFor(ctx context.Context, player string) (model.Score, error) {\n\tr.mu.RLock()\n\tdefer r.mu.RUnlock()\n\tbest, found := model.Score{}, false\n\tfor _, s := range r.scores {\n\t\tif s.Player == player && (!found || s.Points > best.Points) {\n\t\t\tbest, found = s, true\n\t\t}\n\t}\n\tif !found {\n\t\treturn model.Score{}, ErrNotFound\n\t}\n\treturn best, nil\n}\n\nfunc (r *MemoryScoreRepository) Top(ctx context.Context, limit int) ([]model.Score, error) {\n\tr.mu.RLock()\n\tdefer r.mu.RUnlock()\n\tsorted := append([]model.Score(nil), r.scores...)\n\tsort.Slice(sorted, func(i, j int) bool { return sorted[i].Points > sorted[j].Points })\n\tif len(sorted) > limit {\n\t\tsorted = sorted[:limit]\n\t}\n\treturn sorted, nil\n}\n",
            "repository-go-scores/repository/postgres.go": "package repository\n\nimport (\n\t\"context\"\n\t\"database/sql\"\n\t\"errors\"\n\n\t\"example.com/arcade/model\"\n)\n\n// PostgresScoreRepository fulfils the same contract with SQL.\n// All SQL in the program lives in this one file.\ntype PostgresScoreRepository struct {\n\tdb *sql.DB\n}\n\n// Compile-time check: the build fails if this type stops matching the interface.\nvar _ ScoreRepository = (*PostgresScoreRepository)(nil)\n\nfunc NewPostgres(db *sql.DB) *PostgresScoreRepository {\n\treturn &PostgresScoreRepository{db: db}\n}\n\nfunc (r *PostgresScoreRepository) Save(ctx context.Context, s model.Score) error {\n\t_, err := r.db.ExecContext(ctx,\n\t\t`INSERT INTO scores (player, points, achieved) VALUES ($1, $2, $3)`,\n\t\ts.Player, s.Points, s.Achieved)\n\treturn err\n}\n\nfunc (r *PostgresScoreRepository) BestFor(ctx context.Context, player string) (model.Score, error) {\n\trow := r.db.QueryRowContext(ctx,\n\t\t`SELECT player, points, achieved FROM scores WHERE player = $1 ORDER BY points DESC LIMIT 1`,\n\t\tplayer)\n\tvar s model.Score\n\terr := row.Scan(&s.Player, &s.Points, &s.Achieved)\n\tif errors.Is(err, sql.ErrNoRows) {\n\t\treturn model.Score{}, ErrNotFound\n\t}\n\treturn s, err\n}\n\nfunc (r *PostgresScoreRepository) Top(ctx context.Context, limit int) ([]model.Score, error) {\n\trows, err := r.db.QueryContext(ctx,\n\t\t`SELECT player, points, achieved FROM scores ORDER BY points DESC LIMIT $1`, limit)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer rows.Close()\n\treturn scanScores(rows)\n}\n\nfunc scanScores(rows *sql.Rows) ([]model.Score, error) {\n\tvar out []model.Score\n\tfor rows.Next() {\n\t\tvar s model.Score\n\t\tif err := rows.Scan(&s.Player, &s.Points, &s.Achieved); err != nil {\n\t\t\treturn nil, err\n\t\t}\n\t\tout = append(out, s)\n\t}\n\treturn out, rows.Err()\n}\n",
            "repository-go-scores/repository/repository.go": "package repository\n\nimport (\n\t\"context\"\n\t\"errors\"\n\n\t\"example.com/arcade/model\"\n)\n\n// ErrNotFound lets callers react to \"missing\" without knowing about sql.ErrNoRows.\nvar ErrNotFound = errors.New(\"score not found\")\n\n// ScoreRepository is the contract the service depends on.\ntype ScoreRepository interface {\n\tSave(ctx context.Context, s model.Score) error\n\tBestFor(ctx context.Context, player string) (model.Score, error)\n\tTop(ctx context.Context, limit int) ([]model.Score, error)\n}\n",
            "repository-go-scores/service/leaderboard.go": "package service\n\nimport (\n\t\"context\"\n\t\"errors\"\n\t\"fmt\"\n\t\"time\"\n\n\t\"example.com/arcade/model\"\n\t\"example.com/arcade/repository\"\n)\n\nconst MaxPoints = 1_000_000\n\n// Leaderboard holds the game rules. It only talks to the repository interface.\ntype Leaderboard struct {\n\trepo repository.ScoreRepository\n\tnow  func() time.Time\n}\n\nfunc NewLeaderboard(repo repository.ScoreRepository) *Leaderboard {\n\treturn &Leaderboard{repo: repo, now: time.Now}\n}\n\n// Submit stores a score only if it is valid and beats the player's personal best.\nfunc (b *Leaderboard) Submit(ctx context.Context, player string, points int) (bool, error) {\n\tif player == \"\" || points < 0 || points > MaxPoints {\n\t\treturn false, fmt.Errorf(\"invalid score %d for %q\", points, player)\n\t}\n\tbest, err := b.repo.BestFor(ctx, player)\n\tif err != nil && !errors.Is(err, repository.ErrNotFound) {\n\t\treturn false, err\n\t}\n\tif err == nil && best.Points >= points {\n\t\treturn false, nil\n\t}\n\treturn true, b.repo.Save(ctx, model.Score{Player: player, Points: points, Achieved: b.now()})\n}\n\nfunc (b *Leaderboard) TopTen(ctx context.Context) ([]model.Score, error) {\n\treturn b.repo.Top(ctx, 10)\n}\n"
          }
        }
      ]
    },
    {
      "id": "dependency-injection",
      "name": "Dependency Injection",
      "family": "Architecture",
      "aka": [
        "DI",
        "Inversion of Control (IoC)",
        "Constructor injection"
      ],
      "tagline": "Objects receive the helpers they need instead of creating or looking them up.",
      "intent": "Instead of a class calling new EmailSender() or reaching for a global, it declares what it needs (usually as constructor parameters typed by an interface) and someone else passes those objects in. One place, the composition root or a DI container, decides which concrete classes are used, so swapping a real service for a fake in tests or a cheaper one in production is a one-line change.",
      "analogy": "A film set: actors do not bring their own costumes and props. The props department hands each actor exactly what the scene needs, and can swap a real sword for a rubber one without the actor changing how they act.",
      "cityShape": "Look for one composition-root building (main, the container setup or the scene root) with construction pipes fanning out to every other building. The service buildings have a constructor or setup() floor at the bottom and 'has' links pointing to an interface building, never to the concrete classes beside it.",
      "roles": [
        {
          "name": "Service Interface",
          "desc": "The abstraction a client depends on (Notifier, MessageSender, AudioService)."
        },
        {
          "name": "Concrete Service",
          "desc": "A real or fake implementation that can be plugged in."
        },
        {
          "name": "Client",
          "desc": "The class that receives its dependencies through its constructor or a setup method and never constructs them."
        },
        {
          "name": "Injector",
          "desc": "The composition root or DI container that builds the object graph and passes dependencies in."
        }
      ],
      "whenToUse": [
        "You want to unit-test a class without sending real emails, playing sounds or hitting a database.",
        "The same code must run with different implementations (dev vs production, headless server vs desktop).",
        "Object graphs are growing and you want one place that shows how everything is wired."
      ],
      "pitfalls": [
        "Service locator in disguise: passing the whole container around (or using globals/autoloads everywhere) hides what a class really needs.",
        "Constructors with eight parameters are a sign the class does too much, not that DI is wrong.",
        "Containers resolve things by reflection; a missing registration only fails at runtime, so test the wiring once at startup."
      ],
      "related": [
        "strategy",
        "factory-method",
        "repository",
        "singleton",
        "abstract-factory"
      ],
      "quiz": [
        {
          "q": "ShippingService needs to send notifications. Which version uses dependency injection?",
          "options": [
            "self.notifier = EmailNotifier() inside __init__",
            "def __init__(self, notifier: Notifier): self.notifier = notifier",
            "notifier = globals()['notifier']",
            "class ShippingService(EmailNotifier)"
          ],
          "answer": 1,
          "why": "The service receives its notifier from outside and only knows the Notifier abstraction, so the caller decides which implementation it gets."
        },
        {
          "q": "In Godot, a Player script calls get_node(\"/root/Audio\").play(). What is the main DI-style improvement?",
          "options": [
            "Rename the autoload",
            "Give Player a setup(audio) method or exported field and let the scene root pass the audio service in",
            "Make Audio a singleton",
            "Move the code into _process()"
          ],
          "answer": 1,
          "why": "Looking up a global is a service locator. Passing the service in makes the dependency visible and lets a test hand in a silent fake."
        }
      ],
      "demos": [
        {
          "id": "dependency-injection-py-alerts",
          "title": "Shipping alerts by email or SMS",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "ShippingService gets its Notifier through __init__. main.py plugs in email or SMS, and the test plugs in a fake that just records messages. Notice shipping.py never imports email.py or sms.py.",
          "roles": {
            "Service Interface": [
              "dependency-injection-py-alerts/notifiers/base.py#Notifier"
            ],
            "Concrete Service": [
              "dependency-injection-py-alerts/notifiers/email.py#EmailNotifier",
              "dependency-injection-py-alerts/notifiers/sms.py#SmsNotifier",
              "dependency-injection-py-alerts/tests/test_shipping.py#FakeNotifier"
            ],
            "Client": [
              "dependency-injection-py-alerts/services/shipping.py#ShippingService"
            ],
            "Injector": [
              "dependency-injection-py-alerts/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "dependency-injection-py-alerts/main.py#main",
              "say": "main() is the composition root: it builds two services and injects a different notifier into each."
            },
            {
              "at": "dependency-injection-py-alerts/services/shipping.py#ShippingService.__init__",
              "say": "The service just stores what it was given. It never decides which notifier to create."
            },
            {
              "at": "dependency-injection-py-alerts/services/shipping.py#ShippingService.ship",
              "say": "ship() calls self.notifier.send(). It works with any object that follows the Notifier contract."
            },
            {
              "at": "dependency-injection-py-alerts/notifiers/email.py#EmailNotifier.send",
              "say": "For the first service the call lands in the email notifier."
            },
            {
              "at": "dependency-injection-py-alerts/notifiers/sms.py#SmsNotifier.send",
              "say": "For the second, the same line of service code sends an SMS instead."
            },
            {
              "at": "dependency-injection-py-alerts/tests/test_shipping.py#test_ship_sends_one_message",
              "say": "The payoff: the test injects a FakeNotifier, so it checks the message without sending anything."
            }
          ],
          "files": {
            "dependency-injection-py-alerts/main.py": "from notifiers.email import EmailNotifier\nfrom notifiers.sms import SmsNotifier\nfrom services.shipping import ShippingService\n\n\n# Composition root: the one place that decides which notifier is used.\ndef main():\n    by_email = ShippingService(EmailNotifier(\"shop@example.com\"))\n    by_sms = ShippingService(SmsNotifier())\n    by_email.ship(\"A-17\", \"maria@example.com\")\n    by_sms.ship(\"A-18\", \"+49 170 1234567\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "dependency-injection-py-alerts/notifiers/base.py": "from abc import ABC, abstractmethod\n\n\n# The abstraction the service depends on.\nclass Notifier(ABC):\n    @abstractmethod\n    def send(self, to, message):\n        ...\n",
            "dependency-injection-py-alerts/notifiers/email.py": "from notifiers.base import Notifier\n\n\nclass EmailNotifier(Notifier):\n    def __init__(self, sender):\n        self.sender = sender\n\n    def send(self, to, message):\n        print(f\"[email from {self.sender} to {to}] {message}\")\n",
            "dependency-injection-py-alerts/notifiers/sms.py": "from notifiers.base import Notifier\n\n\nclass SmsNotifier(Notifier):\n    def send(self, to, message):\n        print(f\"[sms to {to}] {message[:160]}\")\n",
            "dependency-injection-py-alerts/services/shipping.py": "from notifiers.base import Notifier\n\n\n# The service RECEIVES its notifier. It never calls EmailNotifier() itself.\nclass ShippingService:\n    def __init__(self, notifier: Notifier):\n        self.notifier: Notifier = notifier\n        self.shipped = []\n\n    def ship(self, order_id, customer):\n        self.shipped.append(order_id)\n        self.notifier.send(customer, f\"Order {order_id} is on its way!\")\n",
            "dependency-injection-py-alerts/tests/test_shipping.py": "from notifiers.base import Notifier\nfrom services.shipping import ShippingService\n\n\n# A fake that records messages instead of sending them.\nclass FakeNotifier(Notifier):\n    def __init__(self):\n        self.sent = []\n\n    def send(self, to, message):\n        self.sent.append((to, message))\n\n\ndef test_ship_sends_one_message():\n    fake = FakeNotifier()\n    service = ShippingService(fake)\n    service.ship(\"A-17\", \"maria@example.com\")\n    assert fake.sent == [(\"maria@example.com\", \"Order A-17 is on its way!\")]\n"
          }
        },
        {
          "id": "dependency-injection-gd-arena",
          "title": "Arena game: injecting audio instead of autoloads",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "The main scene builds AudioService, ScoreStore and a random generator once and passes them to Player and EnemySpawner via setup(). A GUT test injects SilentAudio. Notice no actor calls get_node(\"/root/...\").",
          "roles": {
            "Service Interface": [
              "dependency-injection-gd-arena/services/audio_service.gd"
            ],
            "Concrete Service": [
              "dependency-injection-gd-arena/services/silent_audio.gd",
              "dependency-injection-gd-arena/services/score_store.gd"
            ],
            "Client": [
              "dependency-injection-gd-arena/actors/player.gd",
              "dependency-injection-gd-arena/actors/enemy_spawner.gd"
            ],
            "Injector": [
              "dependency-injection-gd-arena/main.gd#_ready"
            ]
          },
          "trace": [
            {
              "at": "dependency-injection-gd-arena/main.gd#_ready",
              "say": "The scene root is the composition root: it creates each service once, then hands them to the nodes that need them."
            },
            {
              "at": "dependency-injection-gd-arena/main.gd#_make_audio",
              "say": "The only place that chooses real or silent audio. A headless server gets SilentAudio and no actor needs to know."
            },
            {
              "at": "dependency-injection-gd-arena/actors/player.gd#setup",
              "say": "Player receives its AudioService in setup(). Its typed var makes the dependency visible in the editor and the UML."
            },
            {
              "at": "dependency-injection-gd-arena/actors/enemy_spawner.gd#setup",
              "say": "Even randomness is injected: a seeded RandomNumberGenerator makes waves reproducible in tests and replays."
            },
            {
              "at": "dependency-injection-gd-arena/actors/player.gd#take_hit",
              "say": "When hit, the player calls audio.play(). It works with whichever AudioService subclass it was given."
            },
            {
              "at": "dependency-injection-gd-arena/services/audio_service.gd#play",
              "say": "In the game, the real service lazily creates an AudioStreamPlayer per sound effect."
            },
            {
              "at": "dependency-injection-gd-arena/tests/test_player.gd#test_three_hits_end_the_game",
              "say": "In the test, SilentAudio is injected instead and records calls, so the test can assert exactly which sounds were requested."
            }
          ],
          "files": {
            "dependency-injection-gd-arena/actors/enemy_spawner.gd": "class_name EnemySpawner\nextends Node2D\n\n@export var enemy_scene: PackedScene\n\nvar rng: RandomNumberGenerator\nvar audio: AudioService\n\n# Even randomness is injected: a seeded generator makes waves reproducible in tests and replays.\nfunc setup(p_rng: RandomNumberGenerator, p_audio: AudioService) -> void:\n\trng = p_rng\n\taudio = p_audio\n\nfunc spawn_wave(count: int) -> void:\n\tfor i in count:\n\t\tvar enemy: Node2D = enemy_scene.instantiate()\n\t\tenemy.position = Vector2(rng.randf_range(0.0, 1024.0), -32.0)\n\t\tadd_child(enemy)\n\taudio.play(\"wave_start\")\n",
            "dependency-injection-gd-arena/actors/player.gd": "class_name Player\nextends CharacterBody2D\n\nsignal died\n\nvar audio: AudioService\nvar lives := 3\n\n# Dependencies arrive through setup() instead of being looked up with get_node(\"/root/...\").\nfunc setup(p_audio: AudioService) -> void:\n\taudio = p_audio\n\nfunc take_hit() -> void:\n\tlives -= 1\n\taudio.play(\"hurt\")\n\tif lives <= 0:\n\t\taudio.play(\"game_over\")\n\t\tdied.emit()\n",
            "dependency-injection-gd-arena/main.gd": "extends Node2D\n\n# Composition root: builds every service once and hands it to the nodes that need it.\n@onready var player: Player = $Player\n@onready var spawner: EnemySpawner = $EnemySpawner\n\nvar audio: AudioService\nvar scores: ScoreStore\nvar score := 0\n\nfunc _ready() -> void:\n\taudio = _make_audio()\n\tscores = ScoreStore.new()\n\tvar rng := RandomNumberGenerator.new()\n\trng.randomize()\n\tplayer.setup(audio)\n\tspawner.setup(rng, audio)\n\tplayer.died.connect(_on_player_died)\n\tspawner.spawn_wave(5)\n\n# The only place that decides between real and silent audio.\nfunc _make_audio() -> AudioService:\n\tvar service: AudioService = SilentAudio.new() if DisplayServer.get_name() == \"headless\" else AudioService.new()\n\tadd_child(service)\n\treturn service\n\nfunc _on_player_died() -> void:\n\tif score > scores.load_best():\n\t\tscores.save_best(score)\n",
            "dependency-injection-gd-arena/services/audio_service.gd": "class_name AudioService\nextends Node\n\n# Plays sound effects. Actors receive it instead of reaching for a global autoload.\nvar _players := {}\n\nfunc play(sfx: String) -> void:\n\tvar player: AudioStreamPlayer = _players.get(sfx)\n\tif player == null:\n\t\tplayer = AudioStreamPlayer.new()\n\t\tplayer.stream = load(\"res://sfx/%s.ogg\" % sfx)\n\t\tadd_child(player)\n\t\t_players[sfx] = player\n\tplayer.play()\n",
            "dependency-injection-gd-arena/services/score_store.gd": "class_name ScoreStore\nextends RefCounted\n\n# Saves the high score. The file path is injected too, so tests can use a temp file.\nvar path: String\n\nfunc _init(p_path: String = \"user://highscore.save\") -> void:\n\tpath = p_path\n\nfunc load_best() -> int:\n\tif not FileAccess.file_exists(path):\n\t\treturn 0\n\tvar file := FileAccess.open(path, FileAccess.READ)\n\treturn file.get_32()\n\nfunc save_best(score: int) -> void:\n\tvar file := FileAccess.open(path, FileAccess.WRITE)\n\tfile.store_32(score)\n",
            "dependency-injection-gd-arena/services/silent_audio.gd": "class_name SilentAudio\nextends AudioService\n\n# Drop-in replacement for tests and headless servers: same API, no sound, remembers calls.\nvar played: Array[String] = []\n\nfunc play(sfx: String) -> void:\n\tplayed.append(sfx)\n",
            "dependency-injection-gd-arena/tests/test_player.gd": "extends GutTest\n\n# Because Player receives its AudioService, a test can hand it a silent fake and check what it asked for.\nfunc test_three_hits_end_the_game() -> void:\n\tvar audio := SilentAudio.new()\n\tvar player := Player.new()\n\tplayer.setup(audio)\n\twatch_signals(player)\n\tfor i in 3:\n\t\tplayer.take_hit()\n\tassert_eq(audio.played, [\"hurt\", \"hurt\", \"hurt\", \"game_over\"])\n\tassert_signal_emitted(player, \"died\")\n\tplayer.free()\n\taudio.free()\n"
          }
        },
        {
          "id": "dependency-injection-punq-real",
          "title": "punq: a tiny Python DI container",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "bobthemighty/punq",
            "url": "https://github.com/bobthemighty/punq/blob/v0.7.0/punq/__init__.py",
            "license": "MIT",
            "note": "punq/__init__.py and punq/_compat.py are from punq 0.7.0; long docstrings, the exception classes and instantiate() are trimmed and marked. The app/ folder was written for Software City."
          },
          "story": "A real DI container. You register 'MessageSender means ConsoleSender', then resolve ReminderService: punq reads its __init__ type hints and builds the whole graph for you. The app classes never import punq.",
          "roles": {
            "Service Interface": [
              "dependency-injection-punq-real/app/services.py#MessageSender"
            ],
            "Concrete Service": [
              "dependency-injection-punq-real/app/services.py#ConsoleSender",
              "dependency-injection-punq-real/app/services.py#Clock"
            ],
            "Client": [
              "dependency-injection-punq-real/app/services.py#ReminderService"
            ],
            "Injector": [
              "dependency-injection-punq-real/punq/__init__.py#Container",
              "dependency-injection-punq-real/app/main.py#build_container"
            ]
          },
          "trace": [
            {
              "at": "dependency-injection-punq-real/app/main.py#build_container",
              "say": "The app registers three things: an interface with its implementation, a singleton Clock, and the service itself."
            },
            {
              "at": "dependency-injection-punq-real/punq/__init__.py#_Registry.register",
              "say": "register() decides the kind of registration: a ready instance, a class standing for itself, or an interface mapped to a factory."
            },
            {
              "at": "dependency-injection-punq-real/punq/__init__.py#_Registry._get_needs_for_ctor",
              "say": "The key trick: get_type_hints reads __init__ annotations, so punq learns that ReminderService needs a MessageSender and a Clock."
            },
            {
              "at": "dependency-injection-punq-real/app/main.py#run",
              "say": "run() asks for a ReminderService. It never calls a constructor itself."
            },
            {
              "at": "dependency-injection-punq-real/punq/__init__.py#Container._resolve_impl",
              "say": "Resolving checks singletons and the per-call cache first, then takes the newest registration for the key."
            },
            {
              "at": "dependency-injection-punq-real/punq/__init__.py#Container._build_impl",
              "say": "_build_impl resolves every needed argument recursively, calls the constructor and caches singletons. This is the graph being built."
            },
            {
              "at": "dependency-injection-punq-real/app/services.py#ReminderService.remind",
              "say": "The finished service uses a ConsoleSender and a Clock that it never created. Register a different sender and this code is unchanged."
            }
          ],
          "files": {
            "dependency-injection-punq-real/app/main.py": "# Example usage written for Software City (not part of punq).\nfrom datetime import date\n\nfrom punq import Container, Scope\n\nfrom .services import Clock, ConsoleSender, MessageSender, ReminderService\n\n\ndef build_container() -> Container:\n    container = Container()\n    container.register(MessageSender, ConsoleSender)\n    container.register(Clock, scope=Scope.singleton)\n    container.register(ReminderService)\n    return container\n\n\ndef run() -> None:\n    container = build_container()\n    service = container.resolve(ReminderService)\n    service.remind(\"ana@example.com\", date(2026, 12, 1))\n",
            "dependency-injection-punq-real/app/services.py": "# Example application code written for Software City (not part of punq).\n# None of these classes import punq: they only declare what they need in __init__.\nfrom datetime import date\n\n\nclass MessageSender:\n    def send(self, to: str, text: str) -> None:\n        raise NotImplementedError\n\n\nclass ConsoleSender(MessageSender):\n    def send(self, to: str, text: str) -> None:\n        print(f\"to {to}: {text}\")\n\n\nclass Clock:\n    def today(self) -> date:\n        return date.today()\n\n\nclass ReminderService:\n    def __init__(self, sender: MessageSender, clock: Clock):\n        self.sender: MessageSender = sender\n        self.clock: Clock = clock\n\n    def remind(self, customer: str, due: date) -> None:\n        days = (due - self.clock.today()).days\n        self.sender.send(customer, f\"Your invoice is due in {days} days.\")\n",
            "dependency-injection-punq-real/punq/__init__.py": "# Source: punq 0.7.0 — https://github.com/bobthemighty/punq/blob/v0.7.0/punq/__init__.py\n# MIT License, Copyright (c) 2017 Bob Gregory. Included for study.\n# … trimmed: 17-line module docstring listing the exported names …\nimport inspect\nfrom collections import defaultdict\nfrom enum import Enum\nfrom typing import Any\nfrom typing import Callable\nfrom typing import get_type_hints\nfrom typing import List\nfrom typing import NamedTuple\nfrom importlib.metadata import PackageNotFoundError, version\n\nfrom ._compat import ensure_forward_ref\nfrom ._compat import is_generic_list\n\n# … trimmed: 5 lines that read the installed package version …\n\n\n# … trimmed: 90 lines defining six exception classes (MissingDependencyError,\n#     InvalidRegistrationError, InvalidForwardReferenceError and deprecated aliases) …\n\n\nclass Scope(Enum):\n    # … trimmed: 6-line docstring …\n\n    transient = 0\n    singleton = 1\n\n\nclass _Registration(NamedTuple):\n    service: str\n    scope: Scope\n    builder: Callable[[], Any]\n    needs: Any\n    args: List[Any]\n\n\nclass _Empty:\n    pass\n\n\nempty = _Empty()\n\n\ndef _match_defaults(args, defaults):\n    # … trimmed: 6-line docstring …\n    if defaults is None:\n        return dict()\n\n    offset = len(args) - len(defaults)\n    defaults = ([None] * offset) + list(defaults)\n\n    return {\n        key: value\n        for key, value in zip(args, defaults)  # noqa: B905\n        if value is not None\n    }\n\n\nclass _Registry:\n    def __init__(self):\n        self.__registrations = defaultdict(list)\n        self._localns = dict()\n\n    def _get_needs_for_ctor(self, cls):\n        try:\n            return get_type_hints(cls.__init__, None, self._localns)\n        except NameError as e:\n            raise InvalidForwardReferenceError(str(e)) from e\n\n    def register_service_and_impl(self, service, scope, impl, resolve_args):\n        # … trimmed: 23-line docstring with doctest examples …\n        self.__registrations[service].append(\n            _Registration(\n                service, scope, impl, self._get_needs_for_ctor(impl), resolve_args\n            )\n        )\n\n    def register_service_and_instance(self, service, instance):\n        # … trimmed: 25-line docstring with doctest examples …\n        self.__registrations[service].append(\n            _Registration(service, Scope.singleton, lambda: instance, {}, {})\n        )\n\n    def register_concrete_service(self, service, scope):\n        # … trimmed: 16-line docstring with doctest examples …\n        if not inspect.isclass(service):\n            raise InvalidRegistrationError(\n                \"The service %s can't be registered as its own implementation\"\n                % (repr(service))\n            )\n        self.__registrations[service].append(\n            _Registration(\n                service, scope, service, self._get_needs_for_ctor(service), {}\n            )\n        )\n\n    def build_context(self, key, existing=None):\n        if existing is None:\n            return _ResolutionContext(key, list(self.__getitem__(key)))\n\n        if key not in existing.targets:\n            existing.targets[key] = _ResolutionTarget(key, list(self.__getitem__(key)))\n\n        return existing\n\n    def _update_localns(self, service):\n        if isinstance(service, type):\n            self._localns[service.__name__] = service\n        else:\n            self._localns[service] = service\n\n    def register(\n        self, service, factory=empty, instance=empty, scope=Scope.transient, **kwargs\n    ):\n        resolve_args = kwargs or {}\n\n        if instance is not empty:\n            self.register_service_and_instance(service, instance)\n        elif factory is empty:\n            self.register_concrete_service(service, scope)\n        elif callable(factory):\n            self.register_service_and_impl(service, scope, factory, resolve_args)\n        else:\n            raise InvalidRegistrationError(\n                f\"Expected a callable factory for the service {service} but received {factory}\"  # noqa\n            )\n\n        self._update_localns(service)\n        ensure_forward_ref(self, service, factory, instance, **kwargs)\n\n    def __getitem__(self, service):\n        return self.__registrations[service]\n\n\nclass _ResolutionTarget:\n    def __init__(self, key, impls):\n        self.service = key\n        self.impls = impls\n\n    def is_generic_list(self):\n        return is_generic_list(self.service)\n\n    @property\n    def generic_parameter(self):\n        return self.service.__args__[0]\n\n    def next_impl(self):\n        if len(self.impls) > 0:\n            return self.impls.pop()\n\n\nclass _ResolutionContext:\n    def __init__(self, key, impls):\n        self.targets = {key: _ResolutionTarget(key, impls)}\n        self.cache = {}\n        self.service = key\n\n    def target(self, key):\n        return self.targets.get(key)\n\n    def has_cached(self, key):\n        return key in self.cache\n\n    def __getitem__(self, key):\n        return self.cache.get(key)\n\n    def __setitem__(self, key, instance):\n        self.cache[key] = instance\n\n    def all_registrations(self, service):\n        return self.targets[service].impls\n\n\nclass Container:\n    \"\"\"Provides dependency registration and resolution.\n\n    This is the main entrypoint of the Punq library. In normal scenarios users\n    will only need to interact with this class.\n    \"\"\"\n\n    def __init__(self):\n        self.registrations = _Registry()\n        self.register(Container, instance=self)\n        self._singletons = {}\n\n    def register(\n        self, service, factory=empty, instance=empty, scope=Scope.transient, **kwargs\n    ):\n        # … trimmed: 60-line docstring with doctest examples …\n        self.registrations.register(service, factory, instance, scope, **kwargs)\n        return self\n\n    def resolve_all(self, service, **kwargs):\n        # … trimmed: 31-line docstring with doctest examples …\n        context = self.registrations.build_context(service)\n\n        return [\n            self._build_impl(x, kwargs, context)\n            for x in context.all_registrations(service)\n        ]\n\n    def _build_impl(self, registration, resolution_args, context):\n        \"\"\"Instantiate the registered service.\"\"\"\n        spec = inspect.getfullargspec(registration.builder)\n        target_args = spec.args\n\n        args = _match_defaults(spec.args, spec.defaults)\n        args.update(\n            {\n                k: self._resolve_impl(v, resolution_args, context, args.get(k))\n                for k, v in registration.needs.items()\n                if k != \"return\"\n                and k not in registration.args\n                and k not in resolution_args\n            }\n        )\n        args.update(registration.args)\n\n        if \"self\" in target_args:\n            target_args.remove(\"self\")\n        condensed_resolution_args = {\n            key: resolution_args[key] for key in resolution_args if key in target_args\n        }\n        args.update(condensed_resolution_args or {})\n\n        result = registration.builder(**args)\n\n        if registration.scope == Scope.singleton:\n            self._singletons[registration.service] = result\n\n        context[registration.service] = result\n\n        return result\n\n    def _resolve_impl(self, service_key, kwargs, context, default=None):\n\n        context = self.registrations.build_context(service_key, context)\n\n        if service_key in self._singletons:\n            return self._singletons[service_key]\n\n        if context.has_cached(service_key):\n            return context[service_key]\n\n        target = context.target(service_key)\n\n        if target.is_generic_list():\n            return self.resolve_all(target.generic_parameter)\n\n        registration = target.next_impl()\n\n        if registration is None and default is not None:\n            return default\n\n        if registration is None:\n            raise MissingDependencyError(\n                \"Failed to resolve implementation for \" + str(service_key)\n            )\n\n        if service_key in registration.needs.values():\n            self._resolve_impl(service_key, kwargs, context)\n\n        return self._build_impl(registration, kwargs, context)\n\n    def resolve(self, service_key, **kwargs):\n        \"\"\"Build an return an instance of a registered service.\"\"\"\n        context = self.registrations.build_context(service_key)\n\n        return self._resolve_impl(service_key, kwargs, context)\n\n    # … trimmed: 13-line instantiate() method that builds an unregistered class the same way …\n",
            "dependency-injection-punq-real/punq/_compat.py": "# Source: punq 0.7.0 — https://github.com/bobthemighty/punq/blob/v0.7.0/punq/_compat.py\n# MIT License, Copyright (c) 2017 Bob Gregory. Included for study.\nimport sys\n\nif sys.version_info >= (3, 7, 0):\n    from typing import ForwardRef\n\n    GenericListClass = list\nelse:\n    from typing import List, _ForwardRef as ForwardRef\n\n    GenericListClass = List\n\n\ndef is_generic_list(service):\n    try:\n        return service.__origin__ == GenericListClass\n    except AttributeError:\n        return False\n\n\ndef ensure_forward_ref(self, service, factory, instance, **kwargs):\n    if isinstance(service, str):\n        self.register(ForwardRef(service), factory, instance, **kwargs)\n"
          }
        }
      ]
    },
    {
      "id": "service-locator",
      "name": "Service Locator",
      "family": "Architecture",
      "aka": [
        "Registry",
        "Godot autoloads (a flavour of it)"
      ],
      "tagline": "A central registry that code asks for the services it needs, instead of receiving them.",
      "intent": "Give the program one well-known place where services (audio, messaging, game state) are registered at startup, and let any code ask that place for a service by type or name. Callers depend on the service's interface, not on a concrete class, and the implementation can be swapped at runtime. The price is that dependencies become hidden: they no longer appear in constructors, unlike Dependency Injection.",
      "analogy": "A hotel reception desk: you do not carry a plumber, a taxi driver and a chef around with you. You call reception and ask for whoever is on duty, and the hotel can change who answers without telling you.",
      "cityShape": "Look for one small locator building (ServiceLocator, Locator, or project.godot plus an autoload) with a map or slot antenna on its roof, and many client buildings whose floors have call pipes into its get()/Audio() floor rather than into the service buildings. Compare OrderNotifierDI: its pipe goes straight to the service field it was handed.",
      "roles": [
        {
          "name": "Service Locator",
          "desc": "The registry or global access point. Stores implementations by type or name and returns them on request."
        },
        {
          "name": "Service Interface",
          "desc": "What clients depend on: an interface in typed languages, or simply the set of methods they call in dynamic ones."
        },
        {
          "name": "Concrete Service",
          "desc": "A real implementation (email, SMS, console audio, a null or logging variant) that is registered with the locator."
        },
        {
          "name": "Client",
          "desc": "Code that asks the locator for a service when it needs one, instead of receiving it through a constructor."
        },
        {
          "name": "Registration",
          "desc": "The startup code or configuration that decides which implementation the locator hands out."
        }
      ],
      "whenToUse": [
        "Truly cross-cutting services used from deep, framework-created objects you cannot construct yourself (game nodes, plugins, legacy code): audio, logging, analytics.",
        "Engines and frameworks that already provide one (Godot autoloads, Unity service registries, Android's getSystemService) where fighting the grain costs more.",
        "As a step while refactoring old code towards Dependency Injection: first route globals through a locator, then inject."
      ],
      "pitfalls": [
        "Hidden dependencies: a class's constructor no longer tells you what it needs, so missing registrations fail only at runtime, on the code path that uses them.",
        "Tests must remember to register (and reset) global services, and parallel tests can trample each other's registrations; with DI you simply pass a fake.",
        "It easily becomes a bag of globals that any code can reach, increasing coupling. Prefer constructor injection for your own classes and keep the locator for the few true cross-cutting services."
      ],
      "related": [
        "dependency-injection",
        "singleton",
        "null-object",
        "decorator",
        "plugin-architecture"
      ],
      "quiz": [
        {
          "q": "OrderNotifier works in production but throws 'No service registered for MessageSender' in a unit test. Why is this typical for a Service Locator?",
          "options": [
            "Java cannot cast interfaces",
            "The dependency is hidden inside the method, so nothing forced the test to provide it",
            "The locator is not thread-safe",
            "SmsSender is broken"
          ],
          "answer": 1,
          "why": "With a locator, dependencies are fetched at call time. The constructor looks dependency-free, so the missing registration only shows up when that line runs."
        },
        {
          "q": "What does Dependency Injection do differently from a Service Locator?",
          "options": [
            "It uses reflection",
            "Objects receive their dependencies from outside (usually the constructor) instead of asking a registry for them",
            "It only works with interfaces",
            "It forbids singletons"
          ],
          "answer": 1,
          "why": "Both decouple the client from concrete classes. DI pushes dependencies in and makes them visible in the signature; a locator lets the client pull them, which is more flexible but hides them."
        }
      ],
      "demos": [
        {
          "id": "service-locator-java-notify",
          "title": "Order notifications: locator vs injection",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "OrderNotifier asks the ServiceLocator for a MessageSender; OrderNotifierDI receives one in its constructor. Both send the same message. Compare the two buildings: one has a pipe to the locator, the other a 'has' link to the interface.",
          "roles": {
            "Service Locator": [
              "service-locator-java-notify/src/shop/locator/ServiceLocator.java#ServiceLocator"
            ],
            "Service Interface": [
              "service-locator-java-notify/src/shop/services/MessageSender.java#MessageSender"
            ],
            "Concrete Service": [
              "service-locator-java-notify/src/shop/services/EmailSender.java#EmailSender",
              "service-locator-java-notify/src/shop/services/SmsSender.java#SmsSender"
            ],
            "Client": [
              "service-locator-java-notify/src/shop/app/OrderNotifier.java#OrderNotifier"
            ],
            "Registration": [
              "service-locator-java-notify/src/shop/app/Main.java#Main.main"
            ]
          },
          "trace": [
            {
              "at": "service-locator-java-notify/src/shop/app/Main.java#Main.main",
              "say": "Startup registers EmailSender under the MessageSender interface. From now on anyone may ask for it."
            },
            {
              "at": "service-locator-java-notify/src/shop/locator/ServiceLocator.java#ServiceLocator.register",
              "say": "The locator is just a static map from interface type to object."
            },
            {
              "at": "service-locator-java-notify/src/shop/app/OrderNotifier.java#OrderNotifier.orderShipped",
              "say": "The client pulls its dependency in the middle of a method. Its constructor gives no hint that it needs a sender."
            },
            {
              "at": "service-locator-java-notify/src/shop/locator/ServiceLocator.java#ServiceLocator.get",
              "say": "get() looks up the type. If nobody registered it, the error appears only now, at runtime."
            },
            {
              "at": "service-locator-java-notify/src/shop/services/EmailSender.java#EmailSender.send",
              "say": "The registered implementation does the work. The client only knew the interface."
            },
            {
              "at": "service-locator-java-notify/src/shop/services/SmsSender.java#SmsSender.send",
              "say": "Main re-registers SmsSender and every OrderNotifier switches at once: handy, but also global state any code can change."
            },
            {
              "at": "service-locator-java-notify/src/shop/app/OrderNotifierDI.java#OrderNotifierDI.orderShipped",
              "say": "The DI version does the same job with a sender handed to its constructor: visible, easy to fake in tests, no global."
            }
          ],
          "files": {
            "service-locator-java-notify/src/shop/app/Main.java": "package shop.app;\n\nimport shop.locator.ServiceLocator;\nimport shop.services.EmailSender;\nimport shop.services.MessageSender;\nimport shop.services.SmsSender;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Registration: done once at startup.\n        ServiceLocator.register(MessageSender.class, new EmailSender());\n\n        new OrderNotifier().orderShipped(\"ana@example.com\", \"A-17\");\n\n        // Swapping the service for everyone at once is easy...\n        ServiceLocator.register(MessageSender.class, new SmsSender());\n        new OrderNotifier().orderShipped(\"+30 690 000 0000\", \"A-18\");\n\n        // ...but with DI you see the dependency right at the call site, and a test just passes a fake.\n        new OrderNotifierDI(new EmailSender()).orderShipped(\"ben@example.com\", \"B-02\");\n    }\n}\n",
            "service-locator-java-notify/src/shop/app/OrderNotifier.java": "package shop.app;\n\nimport shop.locator.ServiceLocator;\nimport shop.services.MessageSender;\n\n// Service Locator style: the class REACHES OUT for its dependency.\n// Its constructor looks dependency-free, but it secretly needs a MessageSender to be registered.\npublic class OrderNotifier {\n    public void orderShipped(String customer, String orderId) {\n        MessageSender sender = ServiceLocator.get(MessageSender.class);\n        sender.send(customer, \"Your order \" + orderId + \" is on its way!\");\n    }\n}\n",
            "service-locator-java-notify/src/shop/app/OrderNotifierDI.java": "package shop.app;\n\nimport shop.services.MessageSender;\n\n// Dependency Injection style, for comparison: the dependency is HANDED IN and visible in the constructor.\npublic class OrderNotifierDI {\n    private final MessageSender sender;\n\n    public OrderNotifierDI(MessageSender sender) {\n        this.sender = sender;\n    }\n\n    public void orderShipped(String customer, String orderId) {\n        sender.send(customer, \"Your order \" + orderId + \" is on its way!\");\n    }\n}\n",
            "service-locator-java-notify/src/shop/locator/ServiceLocator.java": "package shop.locator;\n\nimport java.util.HashMap;\nimport java.util.Map;\n\n// The registry: anyone can ask it for a service by its interface type.\npublic final class ServiceLocator {\n    private static final Map<Class<?>, Object> services = new HashMap<>();\n\n    private ServiceLocator() {\n    }\n\n    public static <T> void register(Class<T> type, T implementation) {\n        services.put(type, implementation);\n    }\n\n    public static <T> T get(Class<T> type) {\n        Object service = services.get(type);\n        if (service == null) {\n            // The classic locator failure: it only shows up at runtime, when the code path runs.\n            throw new IllegalStateException(\"No service registered for \" + type.getSimpleName());\n        }\n        return type.cast(service);\n    }\n}\n",
            "service-locator-java-notify/src/shop/services/EmailSender.java": "package shop.services;\n\npublic class EmailSender implements MessageSender {\n    @Override\n    public void send(String to, String text) {\n        System.out.println(\"EMAIL to \" + to + \": \" + text);\n    }\n}\n",
            "service-locator-java-notify/src/shop/services/MessageSender.java": "package shop.services;\n\n// The service interface clients ask the locator for.\npublic interface MessageSender {\n    void send(String to, String text);\n}\n",
            "service-locator-java-notify/src/shop/services/SmsSender.java": "package shop.services;\n\npublic class SmsSender implements MessageSender {\n    @Override\n    public void send(String to, String text) {\n        System.out.println(\"SMS to \" + to + \": \" + text.substring(0, Math.min(text.length(), 160)));\n    }\n}\n"
          }
        },
        {
          "id": "service-locator-cs-audio",
          "title": "Game audio locator with a null service",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "The audio locator from Game Programming Patterns: gameplay code calls Locator.Audio().PlaySound(), the locator starts with a silent NullAudio, and a debug flag wraps the real service in a logging decorator. Player never changes.",
          "roles": {
            "Service Locator": [
              "service-locator-cs-audio/Services/Locator.cs#Locator"
            ],
            "Service Interface": [
              "service-locator-cs-audio/Audio/IAudio.cs#IAudio"
            ],
            "Concrete Service": [
              "service-locator-cs-audio/Audio/ConsoleAudio.cs#ConsoleAudio",
              "service-locator-cs-audio/Audio/NullAudio.cs#NullAudio",
              "service-locator-cs-audio/Audio/LoggedAudio.cs#LoggedAudio"
            ],
            "Client": [
              "service-locator-cs-audio/Game/Player.cs#Player"
            ],
            "Registration": [
              "service-locator-cs-audio/Game/Program.cs#Program.Main"
            ]
          },
          "trace": [
            {
              "at": "service-locator-cs-audio/Game/Program.cs#Program.Main",
              "say": "The player jumps before any audio is provided. With a plain locator this would crash; here it is silently fine."
            },
            {
              "at": "service-locator-cs-audio/Game/Player.cs#Player.Jump",
              "say": "Gameplay code asks the locator at the moment it needs sound. Audio did not have to be passed through every layer."
            },
            {
              "at": "service-locator-cs-audio/Services/Locator.cs#Locator.Audio",
              "say": "The locator returns whatever is current. At startup that is the shared NullAudio."
            },
            {
              "at": "service-locator-cs-audio/Audio/NullAudio.cs#NullAudio.PlaySound",
              "say": "The Null Object does nothing, so clients never need 'if (audio != null)' checks."
            },
            {
              "at": "service-locator-cs-audio/Services/Locator.cs#Locator.Provide",
              "say": "Main provides ConsoleAudio, wrapped in LoggedAudio when --debug-audio is set. Provide(null) restores the null service."
            },
            {
              "at": "service-locator-cs-audio/Audio/LoggedAudio.cs#LoggedAudio.PlaySound",
              "say": "Because clients only see IAudio, a decorator can be slipped in for debugging without touching Player."
            },
            {
              "at": "service-locator-cs-audio/Audio/ConsoleAudio.cs#ConsoleAudio.PlaySound",
              "say": "The real service finally plays the sound. Note the cost: Player's dependency on audio is invisible from outside."
            }
          ],
          "files": {
            "service-locator-cs-audio/Audio/ConsoleAudio.cs": "using System;\n\nnamespace Arcade.Audio;\n\n// The \"real\" service. In Unity or Godot this would drive an audio engine.\npublic class ConsoleAudio : IAudio\n{\n    public void PlaySound(string soundId)\n    {\n        Console.WriteLine($\"♪ {soundId}\");\n    }\n\n    public void StopAll()\n    {\n        Console.WriteLine(\"♪ (silence)\");\n    }\n}\n",
            "service-locator-cs-audio/Audio/IAudio.cs": "namespace Arcade.Audio;\n\n// The service interface. Gameplay code only ever sees this.\npublic interface IAudio\n{\n    void PlaySound(string soundId);\n    void StopAll();\n}\n",
            "service-locator-cs-audio/Audio/LoggedAudio.cs": "using System;\n\nnamespace Arcade.Audio;\n\n// A decorator registered in debug builds: wraps whatever service was there and logs every call.\npublic class LoggedAudio : IAudio\n{\n    private readonly IAudio _wrapped;\n\n    public LoggedAudio(IAudio wrapped)\n    {\n        _wrapped = wrapped;\n    }\n\n    public void PlaySound(string soundId)\n    {\n        Console.WriteLine($\"[audio log] play {soundId}\");\n        _wrapped.PlaySound(soundId);\n    }\n\n    public void StopAll()\n    {\n        Console.WriteLine(\"[audio log] stop all\");\n        _wrapped.StopAll();\n    }\n}\n",
            "service-locator-cs-audio/Audio/NullAudio.cs": "namespace Arcade.Audio;\n\n// Null Object: what the locator hands out before a real service is provided (or when muted).\npublic class NullAudio : IAudio\n{\n    public void PlaySound(string soundId)\n    {\n        // Intentionally silent.\n    }\n\n    public void StopAll()\n    {\n    }\n}\n",
            "service-locator-cs-audio/Game/Player.cs": "using Arcade.Services;\n\nnamespace Arcade.Game;\n\n// A client deep in gameplay code. It asks the locator instead of having audio passed through every layer.\npublic class Player\n{\n    public int Health { get; private set; } = 3;\n\n    public void Jump()\n    {\n        Locator.Audio().PlaySound(\"jump\");\n    }\n\n    public void TakeHit()\n    {\n        Health -= 1;\n        Locator.Audio().PlaySound(Health > 0 ? \"ouch\" : \"game_over\");\n    }\n}\n",
            "service-locator-cs-audio/Game/Program.cs": "using Arcade.Audio;\nusing Arcade.Services;\n\nnamespace Arcade.Game;\n\npublic static class Program\n{\n    public static void Main(string[] args)\n    {\n        var player = new Player();\n        player.Jump(); // nothing provided yet: NullAudio, silently fine\n\n        IAudio audio = new ConsoleAudio();\n        if (args.Length > 0 && args[0] == \"--debug-audio\")\n        {\n            audio = new LoggedAudio(audio);\n        }\n        Locator.Provide(audio);\n        player.Jump();\n        player.TakeHit();\n\n        Locator.Provide(null); // \"mute\": the null service comes back\n        player.TakeHit();\n    }\n}\n",
            "service-locator-cs-audio/Services/Locator.cs": "using Arcade.Audio;\n\nnamespace Arcade.Services;\n\n// The Service Locator from \"Game Programming Patterns\": one global access point per service.\npublic static class Locator\n{\n    private static readonly IAudio NullService = new NullAudio();\n    private static IAudio _audio = NullService;\n\n    public static IAudio Audio()\n    {\n        return _audio;\n    }\n\n    public static void Provide(IAudio? service)\n    {\n        // Never store null: callers can always call Audio().PlaySound() safely.\n        _audio = service ?? NullService;\n    }\n}\n"
          }
        },
        {
          "id": "service-locator-godot-bomber-real",
          "title": "Godot autoloads in Multiplayer Bomber",
          "lang": "GDScript",
          "level": "intermediate",
          "source": {
            "repo": "godotengine/godot-demo-projects",
            "url": "https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/networking/multiplayer_bomber/gamestate.gd",
            "license": "MIT",
            "note": "gamestate.gd, lobby.gd and score.gd are verbatim from networking/multiplayer_bomber at tag 4.2-31d1c0c; project.godot is cut after its [autoload] section."
          },
          "story": "Godot's autoloads are a built-in service locator: project.godot registers gamestate.gd under a global name, the engine adds it under /root, and any script just writes gamestate.host_game(). gamestate itself finds other nodes by path with get_node('/root/World').",
          "roles": {
            "Service Locator": [
              "service-locator-godot-bomber-real/gamestate.gd#end_game",
              "service-locator-godot-bomber-real/gamestate.gd#load_world"
            ],
            "Service Interface": [
              "service-locator-godot-bomber-real/gamestate.gd#host_game",
              "service-locator-godot-bomber-real/gamestate.gd#join_game",
              "service-locator-godot-bomber-real/gamestate.gd#get_player_list",
              "service-locator-godot-bomber-real/gamestate.gd#begin_game"
            ],
            "Concrete Service": [
              "service-locator-godot-bomber-real/gamestate.gd"
            ],
            "Client": [
              "service-locator-godot-bomber-real/lobby.gd",
              "service-locator-godot-bomber-real/score.gd"
            ],
            "Registration": [
              "service-locator-godot-bomber-real/project.godot"
            ]
          },
          "trace": [
            {
              "at": "service-locator-godot-bomber-real/gamestate.gd#_ready",
              "say": "Because project.godot lists gamestate under [autoload], Godot instantiates it before any scene and adds it at /root/gamestate. Its _ready hooks up network callbacks."
            },
            {
              "at": "service-locator-godot-bomber-real/lobby.gd#_ready",
              "say": "The lobby never receives gamestate; it simply uses the global name to connect to its signals. That name lookup is the locator at work."
            },
            {
              "at": "service-locator-godot-bomber-real/lobby.gd#_on_host_pressed",
              "say": "Pressing Host calls gamestate.host_game(). Easy to reach from anywhere, but nothing in lobby.gd's declarations says it needs gamestate."
            },
            {
              "at": "service-locator-godot-bomber-real/gamestate.gd#host_game",
              "say": "The service creates an ENet peer and owns the shared state: player name, peers, the player list."
            },
            {
              "at": "service-locator-godot-bomber-real/lobby.gd#refresh_lobby",
              "say": "Reading state goes the same way: the lobby asks the global service for the player list each time it redraws."
            },
            {
              "at": "service-locator-godot-bomber-real/gamestate.gd#load_world",
              "say": "gamestate locates nodes by path too: get_root().get_node('Lobby') and world.get_node('Score'). The scene tree is another registry."
            },
            {
              "at": "service-locator-godot-bomber-real/score.gd#_on_exit_game_pressed",
              "say": "A completely different scene, the score bar, reaches the same autoload to end the game: shared, global, and invisible in its interface."
            },
            {
              "at": "service-locator-godot-bomber-real/gamestate.gd#end_game",
              "say": "end_game() checks has_node('/root/World') before freeing it. Path lookups fail at runtime if a node is renamed, the classic locator trade-off."
            }
          ],
          "files": {
            "service-locator-godot-bomber-real/gamestate.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/networking/multiplayer_bomber/gamestate.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Node\n\n# Default game server port. Can be any number between 1024 and 49151.\n# Not on the list of registered or common ports as of November 2020:\n# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers\nconst DEFAULT_PORT = 10567\n\n# Max number of players.\nconst MAX_PEERS = 12\n\nvar peer = null\n\n# Name for my player.\nvar player_name = \"The Warrior\"\n\n# Names for remote players in id:name format.\nvar players = {}\nvar players_ready = []\n\n# Signals to let lobby GUI know what's going on.\nsignal player_list_changed()\nsignal connection_failed()\nsignal connection_succeeded()\nsignal game_ended()\nsignal game_error(what)\n\n# Callback from SceneTree.\nfunc _player_connected(id):\n\t# Registration of a client beings here, tell the connected player that we are here.\n\tregister_player.rpc_id(id, player_name)\n\n\n# Callback from SceneTree.\nfunc _player_disconnected(id):\n\tif has_node(\"/root/World\"): # Game is in progress.\n\t\tif multiplayer.is_server():\n\t\t\tgame_error.emit(\"Player \" + players[id] + \" disconnected\")\n\t\t\tend_game()\n\telse: # Game is not in progress.\n\t\t# Unregister this player.\n\t\tunregister_player(id)\n\n\n# Callback from SceneTree, only for clients (not server).\nfunc _connected_ok():\n\t# We just connected to a server\n\tconnection_succeeded.emit()\n\n\n# Callback from SceneTree, only for clients (not server).\nfunc _server_disconnected():\n\tgame_error.emit(\"Server disconnected\")\n\tend_game()\n\n\n# Callback from SceneTree, only for clients (not server).\nfunc _connected_fail():\n\tmultiplayer.set_network_peer(null) # Remove peer\n\tconnection_failed.emit()\n\n\n# Lobby management functions.\n@rpc(\"any_peer\")\nfunc register_player(new_player_name):\n\tvar id = multiplayer.get_remote_sender_id()\n\tplayers[id] = new_player_name\n\tplayer_list_changed.emit()\n\n\nfunc unregister_player(id):\n\tplayers.erase(id)\n\tplayer_list_changed.emit()\n\n\n@rpc(\"call_local\")\nfunc load_world():\n\t# Change scene.\n\tvar world = load(\"res://world.tscn\").instantiate()\n\tget_tree().get_root().add_child(world)\n\tget_tree().get_root().get_node(\"Lobby\").hide()\n\n\t# Set up score.\n\tworld.get_node(\"Score\").add_player(multiplayer.get_unique_id(), player_name)\n\tfor pn in players:\n\t\tworld.get_node(\"Score\").add_player(pn, players[pn])\n\tget_tree().set_pause(false) # Unpause and unleash the game!\n\n\nfunc host_game(new_player_name):\n\tplayer_name = new_player_name\n\tpeer = ENetMultiplayerPeer.new()\n\tpeer.create_server(DEFAULT_PORT, MAX_PEERS)\n\tmultiplayer.set_multiplayer_peer(peer)\n\n\nfunc join_game(ip, new_player_name):\n\tplayer_name = new_player_name\n\tpeer = ENetMultiplayerPeer.new()\n\tpeer.create_client(ip, DEFAULT_PORT)\n\tmultiplayer.set_multiplayer_peer(peer)\n\n\nfunc get_player_list():\n\treturn players.values()\n\n\nfunc get_player_name():\n\treturn player_name\n\n\nfunc begin_game():\n\tassert(multiplayer.is_server())\n\tload_world.rpc()\n\n\tvar world = get_tree().get_root().get_node(\"World\")\n\tvar player_scene = load(\"res://player.tscn\")\n\n\t# Create a dictionary with peer id and respective spawn points, could be improved by randomizing.\n\tvar spawn_points = {}\n\tspawn_points[1] = 0 # Server in spawn point 0.\n\tvar spawn_point_idx = 1\n\tfor p in players:\n\t\tspawn_points[p] = spawn_point_idx\n\t\tspawn_point_idx += 1\n\n\tfor p_id in spawn_points:\n\t\tvar spawn_pos = world.get_node(\"SpawnPoints/\" + str(spawn_points[p_id])).position\n\t\tvar player = player_scene.instantiate()\n\t\tplayer.synced_position = spawn_pos\n\t\tplayer.name = str(p_id)\n\t\tplayer.set_player_name(player_name if p_id == multiplayer.get_unique_id() else players[p_id])\n\t\tworld.get_node(\"Players\").add_child(player)\n\n\nfunc end_game():\n\tif has_node(\"/root/World\"): # Game is in progress.\n\t\t# End it\n\t\tget_node(\"/root/World\").queue_free()\n\n\tgame_ended.emit()\n\tplayers.clear()\n\n\nfunc _ready():\n\tmultiplayer.peer_connected.connect(_player_connected)\n\tmultiplayer.peer_disconnected.connect(_player_disconnected)\n\tmultiplayer.connected_to_server.connect(_connected_ok)\n\tmultiplayer.connection_failed.connect(_connected_fail)\n\tmultiplayer.server_disconnected.connect(_server_disconnected)\n",
            "service-locator-godot-bomber-real/lobby.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/networking/multiplayer_bomber/lobby.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends Control\n\nfunc _ready():\n\t# Called every time the node is added to the scene.\n\tgamestate.connection_failed.connect(_on_connection_failed)\n\tgamestate.connection_succeeded.connect(_on_connection_success)\n\tgamestate.player_list_changed.connect(refresh_lobby)\n\tgamestate.game_ended.connect(_on_game_ended)\n\tgamestate.game_error.connect(_on_game_error)\n\t# Set the player name according to the system username. Fallback to the path.\n\tif OS.has_environment(\"USERNAME\"):\n\t\t$Connect/Name.text = OS.get_environment(\"USERNAME\")\n\telse:\n\t\tvar desktop_path = OS.get_system_dir(0).replace(\"\\\\\", \"/\").split(\"/\")\n\t\t$Connect/Name.text = desktop_path[desktop_path.size() - 2]\n\n\nfunc _on_host_pressed():\n\tif $Connect/Name.text == \"\":\n\t\t$Connect/ErrorLabel.text = \"Invalid name!\"\n\t\treturn\n\n\t$Connect.hide()\n\t$Players.show()\n\t$Connect/ErrorLabel.text = \"\"\n\n\tvar player_name = $Connect/Name.text\n\tgamestate.host_game(player_name)\n\trefresh_lobby()\n\n\nfunc _on_join_pressed():\n\tif $Connect/Name.text == \"\":\n\t\t$Connect/ErrorLabel.text = \"Invalid name!\"\n\t\treturn\n\n\tvar ip = $Connect/IPAddress.text\n\tif not ip.is_valid_ip_address():\n\t\t$Connect/ErrorLabel.text = \"Invalid IP address!\"\n\t\treturn\n\n\t$Connect/ErrorLabel.text = \"\"\n\t$Connect/Host.disabled = true\n\t$Connect/Join.disabled = true\n\n\tvar player_name = $Connect/Name.text\n\tgamestate.join_game(ip, player_name)\n\n\nfunc _on_connection_success():\n\t$Connect.hide()\n\t$Players.show()\n\n\nfunc _on_connection_failed():\n\t$Connect/Host.disabled = false\n\t$Connect/Join.disabled = false\n\t$Connect/ErrorLabel.set_text(\"Connection failed.\")\n\n\nfunc _on_game_ended():\n\tshow()\n\t$Connect.show()\n\t$Players.hide()\n\t$Connect/Host.disabled = false\n\t$Connect/Join.disabled = false\n\n\nfunc _on_game_error(errtxt):\n\t$ErrorDialog.dialog_text = errtxt\n\t$ErrorDialog.popup_centered()\n\t$Connect/Host.disabled = false\n\t$Connect/Join.disabled = false\n\n\nfunc refresh_lobby():\n\tvar players = gamestate.get_player_list()\n\tplayers.sort()\n\t$Players/List.clear()\n\t$Players/List.add_item(gamestate.get_player_name() + \" (You)\")\n\tfor p in players:\n\t\t$Players/List.add_item(p)\n\n\t$Players/Start.disabled = not multiplayer.is_server()\n\n\nfunc _on_start_pressed():\n\tgamestate.begin_game()\n\n\nfunc _on_find_public_ip_pressed():\n\tOS.shell_open(\"https://icanhazip.com/\")\n",
            "service-locator-godot-bomber-real/project.godot": "; Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/networking/multiplayer_bomber/project.godot\n; MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\n; Engine configuration file.\n; It's best edited using the editor UI and not directly,\n; since the parameters that go here are not all obvious.\n;\n; Format:\n;   [section] ; section goes between []\n;   param=value ; assign values to parameters\n\nconfig_version=5\n\n[application]\n\nconfig/name=\"Multiplayer Bomber\"\nconfig/description=\"A multiplayer implementation of the classic bomberman game.\nOne of the players should press \\\"Host\\\", while the other\nshould type in his address and press \\\"Play\\\".\"\nconfig/tags=PackedStringArray(\"2d\", \"demo\", \"network\", \"official\")\nrun/main_scene=\"res://lobby.tscn\"\nconfig/features=PackedStringArray(\"4.2\")\nconfig/icon=\"res://icon.webp\"\n\n[autoload]\n\ngamestate=\"*res://gamestate.gd\"\n\n; … trimmed: display and input-map sections (key bindings) not related to the pattern …\n",
            "service-locator-godot-bomber-real/score.gd": "# Source: godot-demo-projects 4.2-31d1c0c — https://github.com/godotengine/godot-demo-projects/blob/4.2-31d1c0c/networking/multiplayer_bomber/score.gd\n# MIT License, Copyright (c) 2014-present Godot Engine contributors. Included for study.\nextends HBoxContainer\n\nvar player_labels = {}\n\nfunc _process(_delta):\n\tvar rocks_left = $\"../Rocks\".get_child_count()\n\tif rocks_left == 0:\n\t\tvar winner_name = \"\"\n\t\tvar winner_score = 0\n\t\tfor p in player_labels:\n\t\t\tif player_labels[p].score > winner_score:\n\t\t\t\twinner_score = player_labels[p].score\n\t\t\t\twinner_name = player_labels[p].name\n\n\t\t$\"../Winner\".set_text(\"THE WINNER IS:\\n\" + winner_name)\n\t\t$\"../Winner\".show()\n\n\nfunc increase_score(for_who):\n\tassert(for_who in player_labels)\n\tvar pl = player_labels[for_who]\n\tpl.score += 1\n\tpl.label.set_text(pl.name + \"\\n\" + str(pl.score))\n\n\nfunc add_player(id, new_player_name):\n\tvar l = Label.new()\n\tl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER\n\tl.set_text(new_player_name + \"\\n\" + \"0\")\n\tl.set_h_size_flags(SIZE_EXPAND_FILL)\n\tvar font = preload(\"res://montserrat.otf\")\n\tl.set(\"custom_fonts/font\", font)\n\tl.set(\"custom_font_size/font_size\", 18)\n\tadd_child(l)\n\n\tplayer_labels[id] = { name = new_player_name, label = l, score = 0 }\n\n\nfunc _ready():\n\t$\"../Winner\".hide()\n\tset_process(true)\n\n\nfunc _on_exit_game_pressed():\n\tgamestate.end_game()\n"
          }
        }
      ]
    },
    {
      "id": "client-server",
      "name": "Client-Server",
      "family": "Architecture",
      "aka": [
        "Request-response",
        "Layered web backend"
      ],
      "tagline": "Clients send requests over a network; a server owns the data and sends answers back.",
      "intent": "Split a system into clients that ask (browsers, apps, scripts) and a server that answers, talking only through an agreed protocol such as HTTP and JSON. The server keeps the data and the rules in one place and is usually layered inside: a router picks a controller, the controller calls a service, the service uses a repository or database, and the answer travels back the same way.",
      "analogy": "A restaurant counter: customers (clients) hand in an order slip in an agreed format, the kitchen (server) checks it, cooks with its own ingredients, and passes back a plate. Customers never walk into the kitchen.",
      "cityShape": "Look for a client district on one side and a server district split into routes/, controllers/, services/ and repositories/. Follow the call pipes in a straight line from the server entry building through the router, controller and service down to the repository. No pipe crosses from the client into server code: they share only the data shape.",
      "roles": [
        {
          "name": "Client",
          "desc": "Builds a request (URL, method, body), sends it over the network and interprets the response."
        },
        {
          "name": "Server & Router",
          "desc": "Listens for connections, reads the raw request and routes method + path to the right handler."
        },
        {
          "name": "Controller",
          "desc": "Turns HTTP input into a call to the service and turns the result or error into a status code and body."
        },
        {
          "name": "Service",
          "desc": "The server's business rules (limits, validation, permissions), with no HTTP or SQL in it."
        },
        {
          "name": "Data Access",
          "desc": "Repository or database code: the only part that reads and writes storage."
        }
      ],
      "whenToUse": [
        "Many users or devices must share the same data and rules (web apps, mobile backends, multiplayer games).",
        "You want to update the logic or data in one place without shipping a new client to everyone.",
        "Sensitive data or secrets must stay on a machine the user does not control."
      ],
      "pitfalls": [
        "Trusting the client: anything checked only in the browser or game client can be bypassed, so the server must validate again.",
        "Chatty APIs: dozens of small requests per screen make apps slow on real networks; design endpoints around what the client needs.",
        "Letting HTTP details leak into services (request objects, status codes) makes the rules hard to reuse and test."
      ],
      "related": [
        "mvc",
        "repository",
        "dependency-injection",
        "facade",
        "proxy",
        "chain-of-responsibility"
      ],
      "quiz": [
        {
          "q": "The client form already refuses empty titles. Should the server check again?",
          "options": [
            "No, that duplicates code",
            "Yes, because any program can send a request directly and skip the client's checks",
            "Only if the database complains",
            "Only for admin users"
          ],
          "answer": 1,
          "why": "The server cannot see or trust the client. curl, a script or a modified app can send anything, so the rules must live on the server."
        },
        {
          "q": "In a layered server, which part should translate 'loan limit reached' into HTTP 409?",
          "options": [
            "The repository",
            "The service",
            "The controller",
            "The client"
          ],
          "answer": 2,
          "why": "The service reports the business problem in its own terms; the controller is the HTTP-aware layer that chooses status codes and response bodies."
        }
      ],
      "demos": [
        {
          "id": "client-server-ts-todos",
          "title": "Todo API: fetch to repository and back",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A browser-style client calls fetch(); a Node server routes the request through controller, service and repository. Notice the client and server share only shared/todo.ts, the shape of the JSON.",
          "roles": {
            "Client": [
              "client-server-ts-todos/client/app.ts#addTodo",
              "client-server-ts-todos/client/app.ts#listTodos"
            ],
            "Server & Router": [
              "client-server-ts-todos/server/server.ts#onRequest",
              "client-server-ts-todos/server/routes/todo-routes.ts#handle"
            ],
            "Controller": [
              "client-server-ts-todos/server/controllers/todo-controller.ts#TodoController"
            ],
            "Service": [
              "client-server-ts-todos/server/services/todo-service.ts#TodoService"
            ],
            "Data Access": [
              "client-server-ts-todos/server/repositories/todo-repository.ts#TodoRepository"
            ]
          },
          "trace": [
            {
              "at": "client-server-ts-todos/client/app.ts#addTodo",
              "say": "The client sends POST /api/todos with a JSON body. It knows a URL and a data shape, nothing about server classes."
            },
            {
              "at": "client-server-ts-todos/server/server.ts#onRequest",
              "say": "The server reads the raw bytes of the request body, then asks the router for a reply."
            },
            {
              "at": "client-server-ts-todos/server/routes/todo-routes.ts#handle",
              "say": "The router matches method and path. POST /api/todos goes to controller.create()."
            },
            {
              "at": "client-server-ts-todos/server/controllers/todo-controller.ts#TodoController.create",
              "say": "The controller parses JSON and rejects a missing title with 400. The server checks even if the client already did."
            },
            {
              "at": "client-server-ts-todos/server/services/todo-service.ts#TodoService.add",
              "say": "The service applies the app's rules (trim, max 100 chars) with no HTTP in sight."
            },
            {
              "at": "client-server-ts-todos/server/repositories/todo-repository.ts#TodoRepository.insert",
              "say": "The repository assigns an id and stores the row. The new todo now travels back up: service, controller (201), server, network."
            },
            {
              "at": "client-server-ts-todos/client/app.ts#listTodos",
              "say": "The client sends a second request, GET /api/todos, and gets the stored list as JSON. Every round trip follows the same path."
            }
          ],
          "files": {
            "client-server-ts-todos/client/app.ts": "import { Todo } from '../shared/todo';\n\nconst API = 'http://localhost:3000/api/todos';\n\n// The client only knows a URL and a JSON shape, never the server's classes.\nasync function addTodo(title: string): Promise<Todo> {\n  const res = await fetch(API, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title }),\n  });\n  if (!res.ok) {\n    throw new Error(`Server answered ${res.status}`);\n  }\n  return res.json();\n}\n\nasync function listTodos(): Promise<Todo[]> {\n  const res = await fetch(API);\n  return res.json();\n}\n\nasync function main(): Promise<void> {\n  const created = await addTodo('Learn client-server');\n  console.log('created', created);\n  console.log('all', await listTodos());\n}\n\nmain();\n",
            "client-server-ts-todos/server/controllers/todo-controller.ts": "import { TodoService } from '../services/todo-service';\n\nexport interface Reply {\n  status: number;\n  data: unknown;\n}\n\n// Controller: HTTP-shaped input in, HTTP-shaped reply out.\nexport class TodoController {\n  private service: TodoService;\n\n  constructor(service: TodoService) {\n    this.service = service;\n  }\n\n  list(): Reply {\n    return { status: 200, data: this.service.all() };\n  }\n\n  create(body: string): Reply {\n    const title = String(JSON.parse(body || '{}').title ?? '');\n    if (title.trim() === '') {\n      return { status: 400, data: { error: 'title is required' } };\n    }\n    return { status: 201, data: this.service.add(title) };\n  }\n}\n",
            "client-server-ts-todos/server/repositories/todo-repository.ts": "import { Todo } from '../../shared/todo';\n\n// Repository: the only code that touches storage (a Map standing in for a database).\nexport class TodoRepository {\n  private rows = new Map<number, Todo>();\n  private nextId = 1;\n\n  insert(data: Omit<Todo, 'id'>): Todo {\n    const todo = { id: this.nextId++, ...data };\n    this.rows.set(todo.id, todo);\n    return todo;\n  }\n\n  findAll(): Todo[] {\n    return [...this.rows.values()];\n  }\n}\n",
            "client-server-ts-todos/server/routes/todo-routes.ts": "import { TodoController, Reply } from '../controllers/todo-controller';\nimport { TodoService } from '../services/todo-service';\nimport { TodoRepository } from '../repositories/todo-repository';\n\nconst controller = new TodoController(new TodoService(new TodoRepository()));\n\n// Routing: match method + path to a controller action.\nexport function handle(method: string, url: string, body: string): Reply {\n  if (url === '/api/todos' && method === 'GET') {\n    return controller.list();\n  }\n  if (url === '/api/todos' && method === 'POST') {\n    return controller.create(body);\n  }\n  return { status: 404, data: { error: 'Not found' } };\n}\n",
            "client-server-ts-todos/server/server.ts": "import { createServer, IncomingMessage, ServerResponse } from 'node:http';\nimport { handle } from './routes/todo-routes';\n\n// Reads the raw HTTP request, lets the router answer, writes JSON back.\nasync function onRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {\n  let body = '';\n  for await (const chunk of req) {\n    body += chunk;\n  }\n  const reply = handle(req.method ?? 'GET', req.url ?? '/', body);\n  res.writeHead(reply.status, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify(reply.data));\n}\n\ncreateServer(onRequest).listen(3000);\n",
            "client-server-ts-todos/server/services/todo-service.ts": "import { Todo } from '../../shared/todo';\nimport { TodoRepository } from '../repositories/todo-repository';\n\n// Service: the rules of the app, independent of HTTP.\nexport class TodoService {\n  private repo: TodoRepository;\n\n  constructor(repo: TodoRepository) {\n    this.repo = repo;\n  }\n\n  add(title: string): Todo {\n    return this.repo.insert({ title: title.trim().slice(0, 100), done: false });\n  }\n\n  all(): Todo[] {\n    return this.repo.findAll();\n  }\n}\n",
            "client-server-ts-todos/shared/todo.ts": "// The contract both sides agree on. It travels over the wire as JSON.\nexport interface Todo {\n  id: number;\n  title: string;\n  done: boolean;\n}\n"
          }
        },
        {
          "id": "client-server-java-library",
          "title": "Library loans over HTTP with JDBC",
          "lang": "Java",
          "level": "intermediate",
          "source": null,
          "story": "Two separate programs: LibraryClient uses java.net.http, LibraryServer uses the JDK's HttpServer. A loan request passes Router, LoanController, LoanService and BookRepository (SQL). Business errors become HTTP 409.",
          "roles": {
            "Client": [
              "client-server-java-library/src/main/java/library/client/LibraryClient.java#LibraryClient"
            ],
            "Server & Router": [
              "client-server-java-library/src/main/java/library/server/LibraryServer.java#LibraryServer",
              "client-server-java-library/src/main/java/library/server/routes/Router.java#Router"
            ],
            "Controller": [
              "client-server-java-library/src/main/java/library/server/controllers/LoanController.java#LoanController"
            ],
            "Service": [
              "client-server-java-library/src/main/java/library/server/services/LoanService.java#LoanService"
            ],
            "Data Access": [
              "client-server-java-library/src/main/java/library/server/repositories/BookRepository.java#BookRepository"
            ]
          },
          "trace": [
            {
              "at": "client-server-java-library/src/main/java/library/server/LibraryServer.java#LibraryServer.main",
              "say": "The server starts first: it wires repository, service and controller once, then listens on port 8080."
            },
            {
              "at": "client-server-java-library/src/main/java/library/client/LibraryClient.java#LibraryClient.borrow",
              "say": "In another process the client POSTs to /api/books/{isbn}/loan with a small JSON body and waits for the response."
            },
            {
              "at": "client-server-java-library/src/main/java/library/server/routes/Router.java#Router.handle",
              "say": "The router splits the path, sees POST .../loan and calls controller.borrow with the ISBN and the raw body."
            },
            {
              "at": "client-server-java-library/src/main/java/library/server/controllers/LoanController.java#LoanController.borrow",
              "say": "The controller extracts the member, calls the service and maps a LoanException to 409. HTTP knowledge stops here."
            },
            {
              "at": "client-server-java-library/src/main/java/library/server/services/LoanService.java#LoanService.borrow",
              "say": "The service enforces the rules: the book must exist, be on the shelf, and the member may hold at most three loans."
            },
            {
              "at": "client-server-java-library/src/main/java/library/server/repositories/BookRepository.java#BookRepository.countLoans",
              "say": "Each rule needs data, so the service asks the repository, which runs a parameterised SQL query."
            },
            {
              "at": "client-server-java-library/src/main/java/library/server/repositories/BookRepository.java#BookRepository.markBorrowed",
              "say": "All checks passed: the repository writes the loan with an UPDATE. The result now flows back up the layers."
            },
            {
              "at": "client-server-java-library/src/main/java/library/server/routes/Router.java#Router.respond",
              "say": "The router writes status and JSON to the socket. The client prints '201 ...' the first time and '409 already borrowed' for the second member."
            }
          ],
          "files": {
            "client-server-java-library/src/main/java/library/client/LibraryClient.java": "package library.client;\n\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\n// The client process: it only knows URLs, HTTP verbs and JSON text.\npublic class LibraryClient {\n    private final HttpClient http = HttpClient.newHttpClient();\n    private final String baseUrl;\n\n    public LibraryClient(String baseUrl) {\n        this.baseUrl = baseUrl;\n    }\n\n    public String borrow(String isbn, String member) throws Exception {\n        String json = \"{\\\"member\\\":\\\"\" + member + \"\\\"}\";\n        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + \"/api/books/\" + isbn + \"/loan\"))\n                .header(\"Content-Type\", \"application/json\")\n                .POST(HttpRequest.BodyPublishers.ofString(json))\n                .build();\n        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());\n        return response.statusCode() + \" \" + response.body();\n    }\n\n    public String available() throws Exception {\n        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + \"/api/books\")).GET().build();\n        return http.send(request, HttpResponse.BodyHandlers.ofString()).body();\n    }\n\n    public static void main(String[] args) throws Exception {\n        LibraryClient client = new LibraryClient(\"http://localhost:8080\");\n        System.out.println(client.borrow(\"978-0441172719\", \"ana\"));\n        System.out.println(client.borrow(\"978-0441172719\", \"ben\"));\n        System.out.println(client.available());\n    }\n}\n",
            "client-server-java-library/src/main/java/library/server/LibraryServer.java": "package library.server;\n\nimport com.sun.net.httpserver.HttpServer;\nimport java.net.InetSocketAddress;\nimport java.sql.Connection;\nimport java.sql.DriverManager;\nimport library.server.controllers.LoanController;\nimport library.server.repositories.BookRepository;\nimport library.server.routes.Router;\nimport library.server.services.LoanService;\n\n// The server process: wires the layers once, then waits for requests.\npublic class LibraryServer {\n    public static void main(String[] args) throws Exception {\n        Connection db = DriverManager.getConnection(\"jdbc:sqlite:library.db\");\n        BookRepository books = new BookRepository(db);\n        LoanController controller = new LoanController(new LoanService(books));\n\n        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);\n        server.createContext(\"/api/books\", new Router(controller));\n        server.start();\n        System.out.println(\"Library API on http://localhost:8080\");\n    }\n}\n",
            "client-server-java-library/src/main/java/library/server/controllers/LoanController.java": "package library.server.controllers;\n\nimport java.util.List;\nimport java.util.regex.Matcher;\nimport java.util.regex.Pattern;\nimport library.server.models.Book;\nimport library.server.services.LoanException;\nimport library.server.services.LoanService;\n\n// Controller: parses the request, calls the service, maps results and errors to HTTP.\npublic class LoanController {\n    private static final Pattern MEMBER = Pattern.compile(\"\\\"member\\\"\\\\s*:\\\\s*\\\"([^\\\"]+)\\\"\");\n    private final LoanService service;\n\n    public LoanController(LoanService service) {\n        this.service = service;\n    }\n\n    public Reply borrow(String isbn, String body) {\n        Matcher m = MEMBER.matcher(body);\n        if (!m.find()) {\n            return new Reply(400, \"{\\\"error\\\":\\\"member is required\\\"}\");\n        }\n        try {\n            Book book = service.borrow(isbn, m.group(1));\n            return new Reply(201, \"{\\\"isbn\\\":\\\"\" + book.isbn() + \"\\\",\\\"borrowedBy\\\":\\\"\" + book.borrowedBy() + \"\\\"}\");\n        } catch (LoanException e) {\n            return new Reply(409, \"{\\\"error\\\":\\\"\" + e.getMessage() + \"\\\"}\");\n        }\n    }\n\n    public Reply listAvailable() {\n        List<Book> books = service.available();\n        StringBuilder json = new StringBuilder(\"[\");\n        for (Book b : books) {\n            json.append(json.length() > 1 ? \",\" : \"\").append(\"{\\\"isbn\\\":\\\"\").append(b.isbn()).append(\"\\\",\\\"title\\\":\\\"\").append(b.title()).append(\"\\\"}\");\n        }\n        return new Reply(200, json.append(\"]\").toString());\n    }\n}\n",
            "client-server-java-library/src/main/java/library/server/controllers/Reply.java": "package library.server.controllers;\n\n// What a controller hands back to the router: a status code and a JSON body.\npublic record Reply(int status, String json) {\n}\n",
            "client-server-java-library/src/main/java/library/server/models/Book.java": "package library.server.models;\n\n// A row from the books table, as the rest of the server sees it.\npublic record Book(String isbn, String title, String borrowedBy) {\n}\n",
            "client-server-java-library/src/main/java/library/server/repositories/BookRepository.java": "package library.server.repositories;\n\nimport java.sql.Connection;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.SQLException;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Optional;\nimport library.server.models.Book;\n\n// Repository: the only class that speaks SQL to the database.\npublic class BookRepository {\n    private final Connection db;\n\n    public BookRepository(Connection db) {\n        this.db = db;\n    }\n\n    public Optional<Book> findByIsbn(String isbn) throws SQLException {\n        try (PreparedStatement st = db.prepareStatement(\"SELECT isbn, title, borrowed_by FROM books WHERE isbn = ?\")) {\n            st.setString(1, isbn);\n            ResultSet rs = st.executeQuery();\n            return rs.next() ? Optional.of(map(rs)) : Optional.empty();\n        }\n    }\n\n    public int countLoans(String member) throws SQLException {\n        try (PreparedStatement st = db.prepareStatement(\"SELECT COUNT(*) FROM books WHERE borrowed_by = ?\")) {\n            st.setString(1, member);\n            ResultSet rs = st.executeQuery();\n            return rs.next() ? rs.getInt(1) : 0;\n        }\n    }\n\n    public void markBorrowed(String isbn, String member) throws SQLException {\n        try (PreparedStatement st = db.prepareStatement(\"UPDATE books SET borrowed_by = ? WHERE isbn = ?\")) {\n            st.setString(1, member);\n            st.setString(2, isbn);\n            st.executeUpdate();\n        }\n    }\n\n    public List<Book> findAvailable() throws SQLException {\n        List<Book> result = new ArrayList<>();\n        try (PreparedStatement st = db.prepareStatement(\"SELECT isbn, title, borrowed_by FROM books WHERE borrowed_by IS NULL\")) {\n            ResultSet rs = st.executeQuery();\n            while (rs.next()) {\n                result.add(map(rs));\n            }\n        }\n        return result;\n    }\n\n    private Book map(ResultSet rs) throws SQLException {\n        return new Book(rs.getString(\"isbn\"), rs.getString(\"title\"), rs.getString(\"borrowed_by\"));\n    }\n}\n",
            "client-server-java-library/src/main/java/library/server/routes/Router.java": "package library.server.routes;\n\nimport com.sun.net.httpserver.HttpExchange;\nimport com.sun.net.httpserver.HttpHandler;\nimport java.io.IOException;\nimport java.io.OutputStream;\nimport java.nio.charset.StandardCharsets;\nimport library.server.controllers.LoanController;\nimport library.server.controllers.Reply;\n\n// Routing: turns \"POST /api/books/{isbn}/loan\" into a controller call.\npublic class Router implements HttpHandler {\n    private final LoanController controller;\n\n    public Router(LoanController controller) {\n        this.controller = controller;\n    }\n\n    @Override\n    public void handle(HttpExchange exchange) throws IOException {\n        String method = exchange.getRequestMethod();\n        String[] parts = exchange.getRequestURI().getPath().split(\"/\");\n        Reply reply;\n        if (method.equals(\"GET\") && parts.length == 3) {\n            reply = controller.listAvailable();\n        } else if (method.equals(\"POST\") && parts.length == 5 && parts[4].equals(\"loan\")) {\n            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);\n            reply = controller.borrow(parts[3], body);\n        } else {\n            reply = new Reply(404, \"{\\\"error\\\":\\\"not found\\\"}\");\n        }\n        respond(exchange, reply);\n    }\n\n    private void respond(HttpExchange exchange, Reply reply) throws IOException {\n        byte[] bytes = reply.json().getBytes(StandardCharsets.UTF_8);\n        exchange.getResponseHeaders().set(\"Content-Type\", \"application/json\");\n        exchange.sendResponseHeaders(reply.status(), bytes.length);\n        try (OutputStream out = exchange.getResponseBody()) {\n            out.write(bytes);\n        }\n    }\n}\n",
            "client-server-java-library/src/main/java/library/server/services/LoanException.java": "package library.server.services;\n\n// A business-rule violation. The controller decides which HTTP status it becomes.\npublic class LoanException extends Exception {\n    public LoanException(String message) {\n        super(message);\n    }\n}\n",
            "client-server-java-library/src/main/java/library/server/services/LoanService.java": "package library.server.services;\n\nimport java.sql.SQLException;\nimport java.util.List;\nimport library.server.models.Book;\nimport library.server.repositories.BookRepository;\n\n// Service: the library's rules. No HTTP, no SQL strings.\npublic class LoanService {\n    public static final int MAX_LOANS = 3;\n    private final BookRepository books;\n\n    public LoanService(BookRepository books) {\n        this.books = books;\n    }\n\n    public Book borrow(String isbn, String member) throws LoanException {\n        try {\n            Book book = books.findByIsbn(isbn).orElseThrow(() -> new LoanException(\"no such book\"));\n            if (book.borrowedBy() != null) {\n                throw new LoanException(\"already borrowed\");\n            }\n            if (books.countLoans(member) >= MAX_LOANS) {\n                throw new LoanException(\"loan limit reached\");\n            }\n            books.markBorrowed(isbn, member);\n            return new Book(book.isbn(), book.title(), member);\n        } catch (SQLException e) {\n            throw new LoanException(\"storage error\");\n        }\n    }\n\n    public List<Book> available() {\n        try {\n            return books.findAvailable();\n        } catch (SQLException e) {\n            return List.of();\n        }\n    }\n}\n"
          }
        },
        {
          "id": "client-server-flaskr-real",
          "title": "Flask's tutorial blog (flaskr)",
          "lang": "Python",
          "level": "intermediate",
          "source": {
            "repo": "pallets/flask",
            "url": "https://github.com/pallets/flask/blob/3.1.3/examples/tutorial/flaskr/blog.py",
            "license": "BSD-3-Clause",
            "note": "flaskr/*.py are verbatim from examples/tutorial at tag 3.1.3 (templates and schema.sql not included). client/client.py was written for Software City to play the browser."
          },
          "story": "The official Flask tutorial app. A scripted client registers, logs in and creates a post. On the server, blueprints route URLs to view functions that check the session, validate input and talk to SQLite through get_db().",
          "roles": {
            "Client": [
              "client-server-flaskr-real/client/client.py#run",
              "client-server-flaskr-real/client/client.py#post_form"
            ],
            "Server & Router": [
              "client-server-flaskr-real/flaskr/__init__.py#create_app",
              "client-server-flaskr-real/flaskr/auth.py#load_logged_in_user"
            ],
            "Controller": [
              "client-server-flaskr-real/flaskr/blog.py#create",
              "client-server-flaskr-real/flaskr/blog.py#index",
              "client-server-flaskr-real/flaskr/auth.py#login"
            ],
            "Service": [
              "client-server-flaskr-real/flaskr/blog.py#get_post",
              "client-server-flaskr-real/flaskr/auth.py#login_required"
            ],
            "Data Access": [
              "client-server-flaskr-real/flaskr/db.py#get_db"
            ]
          },
          "trace": [
            {
              "at": "client-server-flaskr-real/flaskr/__init__.py#create_app",
              "say": "The server is built by an app factory: config, database hooks, then the auth and blog blueprints that hold the routes."
            },
            {
              "at": "client-server-flaskr-real/client/client.py#run",
              "say": "The client registers, logs in and keeps the session cookie, then posts a new blog entry, exactly what a browser would do."
            },
            {
              "at": "client-server-flaskr-real/flaskr/auth.py#login",
              "say": "POST /auth/login checks the password hash and stores the user id in the session cookie sent back to the client."
            },
            {
              "at": "client-server-flaskr-real/flaskr/auth.py#load_logged_in_user",
              "say": "Before every request, the server turns that cookie back into g.user. The server never trusts the client to say who it is."
            },
            {
              "at": "client-server-flaskr-real/flaskr/blog.py#create",
              "say": "@bp.route maps POST /create here; @login_required guards it. The view validates the title, then inserts the row."
            },
            {
              "at": "client-server-flaskr-real/flaskr/db.py#get_db",
              "say": "get_db() opens one SQLite connection per request and reuses it, so all data access goes through one door."
            },
            {
              "at": "client-server-flaskr-real/flaskr/blog.py#index",
              "say": "The redirect makes the client request GET /, which queries all posts and renders HTML: the response travels back to the client."
            },
            {
              "at": "client-server-flaskr-real/flaskr/blog.py#get_post",
              "say": "Updates and deletes go through get_post(), which returns 404 or 403. Permission rules live on the server, not in the client."
            }
          ],
          "files": {
            "client-server-flaskr-real/client/client.py": "# Example client written for Software City (not part of Flask).\n# It plays the role of the browser: it sends HTTP requests and keeps the session cookie.\nimport re\nfrom http.cookiejar import CookieJar\nfrom urllib.parse import urlencode\nfrom urllib.request import HTTPCookieProcessor, build_opener\n\nBASE = \"http://127.0.0.1:5000\"\nopener = build_opener(HTTPCookieProcessor(CookieJar()))\n\n\ndef post_form(path, fields):\n    data = urlencode(fields).encode()\n    with opener.open(BASE + path, data=data) as response:\n        return response.status, response.read().decode()\n\n\ndef get_page(path):\n    with opener.open(BASE + path) as response:\n        return response.read().decode()\n\n\ndef run():\n    post_form(\"/auth/register\", {\"username\": \"ana\", \"password\": \"s3cret\"})\n    post_form(\"/auth/login\", {\"username\": \"ana\", \"password\": \"s3cret\"})\n    status, _ = post_form(\"/create\", {\"title\": \"Hello from a client\", \"body\": \"Sent over HTTP.\"})\n    print(\"create ->\", status)\n    titles = re.findall(r\"<h1>(.*?)</h1>\", get_page(\"/\"))\n    print(\"posts on the server:\", titles)\n\n\nif __name__ == \"__main__\":\n    run()\n",
            "client-server-flaskr-real/flaskr/__init__.py": "# Source: Flask 3.1.3 tutorial app (flaskr) — https://github.com/pallets/flask/blob/3.1.3/examples/tutorial/flaskr/__init__.py\n# BSD-3-Clause License, Copyright 2010 Pallets. Included for study.\nimport os\n\nfrom flask import Flask\n\n\ndef create_app(test_config=None):\n    \"\"\"Create and configure an instance of the Flask application.\"\"\"\n    app = Flask(__name__, instance_relative_config=True)\n    app.config.from_mapping(\n        # a default secret that should be overridden by instance config\n        SECRET_KEY=\"dev\",\n        # store the database in the instance folder\n        DATABASE=os.path.join(app.instance_path, \"flaskr.sqlite\"),\n    )\n\n    if test_config is None:\n        # load the instance config, if it exists, when not testing\n        app.config.from_pyfile(\"config.py\", silent=True)\n    else:\n        # load the test config if passed in\n        app.config.update(test_config)\n\n    # ensure the instance folder exists\n    os.makedirs(app.instance_path, exist_ok=True)\n\n    @app.route(\"/hello\")\n    def hello():\n        return \"Hello, World!\"\n\n    # register the database commands\n    from . import db\n\n    db.init_app(app)\n\n    # apply the blueprints to the app\n    from . import auth\n    from . import blog\n\n    app.register_blueprint(auth.bp)\n    app.register_blueprint(blog.bp)\n\n    # make url_for('index') == url_for('blog.index')\n    # in another app, you might define a separate main index here with\n    # app.route, while giving the blog blueprint a url_prefix, but for\n    # the tutorial the blog will be the main index\n    app.add_url_rule(\"/\", endpoint=\"index\")\n\n    return app\n",
            "client-server-flaskr-real/flaskr/auth.py": "# Source: Flask 3.1.3 tutorial app (flaskr) — https://github.com/pallets/flask/blob/3.1.3/examples/tutorial/flaskr/auth.py\n# BSD-3-Clause License, Copyright 2010 Pallets. Included for study.\nimport functools\n\nfrom flask import Blueprint\nfrom flask import flash\nfrom flask import g\nfrom flask import redirect\nfrom flask import render_template\nfrom flask import request\nfrom flask import session\nfrom flask import url_for\nfrom werkzeug.security import check_password_hash\nfrom werkzeug.security import generate_password_hash\n\nfrom .db import get_db\n\nbp = Blueprint(\"auth\", __name__, url_prefix=\"/auth\")\n\n\ndef login_required(view):\n    \"\"\"View decorator that redirects anonymous users to the login page.\"\"\"\n\n    @functools.wraps(view)\n    def wrapped_view(**kwargs):\n        if g.user is None:\n            return redirect(url_for(\"auth.login\"))\n\n        return view(**kwargs)\n\n    return wrapped_view\n\n\n@bp.before_app_request\ndef load_logged_in_user():\n    \"\"\"If a user id is stored in the session, load the user object from\n    the database into ``g.user``.\"\"\"\n    user_id = session.get(\"user_id\")\n\n    if user_id is None:\n        g.user = None\n    else:\n        g.user = (\n            get_db().execute(\"SELECT * FROM user WHERE id = ?\", (user_id,)).fetchone()\n        )\n\n\n@bp.route(\"/register\", methods=(\"GET\", \"POST\"))\ndef register():\n    \"\"\"Register a new user.\n\n    Validates that the username is not already taken. Hashes the\n    password for security.\n    \"\"\"\n    if request.method == \"POST\":\n        username = request.form[\"username\"]\n        password = request.form[\"password\"]\n        db = get_db()\n        error = None\n\n        if not username:\n            error = \"Username is required.\"\n        elif not password:\n            error = \"Password is required.\"\n\n        if error is None:\n            try:\n                db.execute(\n                    \"INSERT INTO user (username, password) VALUES (?, ?)\",\n                    (username, generate_password_hash(password)),\n                )\n                db.commit()\n            except db.IntegrityError:\n                # The username was already taken, which caused the\n                # commit to fail. Show a validation error.\n                error = f\"User {username} is already registered.\"\n            else:\n                # Success, go to the login page.\n                return redirect(url_for(\"auth.login\"))\n\n        flash(error)\n\n    return render_template(\"auth/register.html\")\n\n\n@bp.route(\"/login\", methods=(\"GET\", \"POST\"))\ndef login():\n    \"\"\"Log in a registered user by adding the user id to the session.\"\"\"\n    if request.method == \"POST\":\n        username = request.form[\"username\"]\n        password = request.form[\"password\"]\n        db = get_db()\n        error = None\n        user = db.execute(\n            \"SELECT * FROM user WHERE username = ?\", (username,)\n        ).fetchone()\n\n        if user is None:\n            error = \"Incorrect username.\"\n        elif not check_password_hash(user[\"password\"], password):\n            error = \"Incorrect password.\"\n\n        if error is None:\n            # store the user id in a new session and return to the index\n            session.clear()\n            session[\"user_id\"] = user[\"id\"]\n            return redirect(url_for(\"index\"))\n\n        flash(error)\n\n    return render_template(\"auth/login.html\")\n\n\n@bp.route(\"/logout\")\ndef logout():\n    \"\"\"Clear the current session, including the stored user id.\"\"\"\n    session.clear()\n    return redirect(url_for(\"index\"))\n",
            "client-server-flaskr-real/flaskr/blog.py": "# Source: Flask 3.1.3 tutorial app (flaskr) — https://github.com/pallets/flask/blob/3.1.3/examples/tutorial/flaskr/blog.py\n# BSD-3-Clause License, Copyright 2010 Pallets. Included for study.\nfrom flask import Blueprint\nfrom flask import flash\nfrom flask import g\nfrom flask import redirect\nfrom flask import render_template\nfrom flask import request\nfrom flask import url_for\nfrom werkzeug.exceptions import abort\n\nfrom .auth import login_required\nfrom .db import get_db\n\nbp = Blueprint(\"blog\", __name__)\n\n\n@bp.route(\"/\")\ndef index():\n    \"\"\"Show all the posts, most recent first.\"\"\"\n    db = get_db()\n    posts = db.execute(\n        \"SELECT p.id, title, body, created, author_id, username\"\n        \" FROM post p JOIN user u ON p.author_id = u.id\"\n        \" ORDER BY created DESC\"\n    ).fetchall()\n    return render_template(\"blog/index.html\", posts=posts)\n\n\ndef get_post(id, check_author=True):\n    \"\"\"Get a post and its author by id.\n\n    Checks that the id exists and optionally that the current user is\n    the author.\n\n    :param id: id of post to get\n    :param check_author: require the current user to be the author\n    :return: the post with author information\n    :raise 404: if a post with the given id doesn't exist\n    :raise 403: if the current user isn't the author\n    \"\"\"\n    post = (\n        get_db()\n        .execute(\n            \"SELECT p.id, title, body, created, author_id, username\"\n            \" FROM post p JOIN user u ON p.author_id = u.id\"\n            \" WHERE p.id = ?\",\n            (id,),\n        )\n        .fetchone()\n    )\n\n    if post is None:\n        abort(404, f\"Post id {id} doesn't exist.\")\n\n    if check_author and post[\"author_id\"] != g.user[\"id\"]:\n        abort(403)\n\n    return post\n\n\n@bp.route(\"/create\", methods=(\"GET\", \"POST\"))\n@login_required\ndef create():\n    \"\"\"Create a new post for the current user.\"\"\"\n    if request.method == \"POST\":\n        title = request.form[\"title\"]\n        body = request.form[\"body\"]\n        error = None\n\n        if not title:\n            error = \"Title is required.\"\n\n        if error is not None:\n            flash(error)\n        else:\n            db = get_db()\n            db.execute(\n                \"INSERT INTO post (title, body, author_id) VALUES (?, ?, ?)\",\n                (title, body, g.user[\"id\"]),\n            )\n            db.commit()\n            return redirect(url_for(\"blog.index\"))\n\n    return render_template(\"blog/create.html\")\n\n\n@bp.route(\"/<int:id>/update\", methods=(\"GET\", \"POST\"))\n@login_required\ndef update(id):\n    \"\"\"Update a post if the current user is the author.\"\"\"\n    post = get_post(id)\n\n    if request.method == \"POST\":\n        title = request.form[\"title\"]\n        body = request.form[\"body\"]\n        error = None\n\n        if not title:\n            error = \"Title is required.\"\n\n        if error is not None:\n            flash(error)\n        else:\n            db = get_db()\n            db.execute(\n                \"UPDATE post SET title = ?, body = ? WHERE id = ?\", (title, body, id)\n            )\n            db.commit()\n            return redirect(url_for(\"blog.index\"))\n\n    return render_template(\"blog/update.html\", post=post)\n\n\n@bp.route(\"/<int:id>/delete\", methods=(\"POST\",))\n@login_required\ndef delete(id):\n    \"\"\"Delete a post.\n\n    Ensures that the post exists and that the logged in user is the\n    author of the post.\n    \"\"\"\n    get_post(id)\n    db = get_db()\n    db.execute(\"DELETE FROM post WHERE id = ?\", (id,))\n    db.commit()\n    return redirect(url_for(\"blog.index\"))\n",
            "client-server-flaskr-real/flaskr/db.py": "# Source: Flask 3.1.3 tutorial app (flaskr) — https://github.com/pallets/flask/blob/3.1.3/examples/tutorial/flaskr/db.py\n# BSD-3-Clause License, Copyright 2010 Pallets. Included for study.\nimport sqlite3\nfrom datetime import datetime\n\nimport click\nfrom flask import current_app\nfrom flask import g\n\n\ndef get_db():\n    \"\"\"Connect to the application's configured database. The connection\n    is unique for each request and will be reused if this is called\n    again.\n    \"\"\"\n    if \"db\" not in g:\n        g.db = sqlite3.connect(\n            current_app.config[\"DATABASE\"], detect_types=sqlite3.PARSE_DECLTYPES\n        )\n        g.db.row_factory = sqlite3.Row\n\n    return g.db\n\n\ndef close_db(e=None):\n    \"\"\"If this request connected to the database, close the\n    connection.\n    \"\"\"\n    db = g.pop(\"db\", None)\n\n    if db is not None:\n        db.close()\n\n\ndef init_db():\n    \"\"\"Clear existing data and create new tables.\"\"\"\n    db = get_db()\n\n    with current_app.open_resource(\"schema.sql\") as f:\n        db.executescript(f.read().decode(\"utf8\"))\n\n\n@click.command(\"init-db\")\ndef init_db_command():\n    \"\"\"Clear existing data and create new tables.\"\"\"\n    init_db()\n    click.echo(\"Initialized the database.\")\n\n\nsqlite3.register_converter(\"timestamp\", lambda v: datetime.fromisoformat(v.decode()))\n\n\ndef init_app(app):\n    \"\"\"Register database functions with the Flask app. This is called by\n    the application factory.\n    \"\"\"\n    app.teardown_appcontext(close_db)\n    app.cli.add_command(init_db_command)\n"
          }
        }
      ]
    },
    {
      "id": "microservices",
      "name": "Microservices",
      "family": "Architecture",
      "aka": [
        "Service-oriented architecture (lighter cousin)"
      ],
      "tagline": "Split one app into small services that each own their data and talk over the network.",
      "intent": "Build the system as several small, independently deployable services, each owning one business capability and its own data. Services never share tables or import each other's code; they cooperate only through network APIs (HTTP, gRPC) or messages, so teams can change, scale and release each one on its own.",
      "analogy": "A food court instead of one big restaurant: the pizza stand, the drinks bar and the till each have their own staff, stock and opening hours, and they only talk by passing order slips.",
      "cityShape": "Look for one district plate per service (services/orders, services/kitchen, src/checkoutservice, src/paymentservice...) with no import arcs between them: each district is a self-contained little city. The only links across districts are thin call pipes from client code (requestCooking, quoteShipping, publish) toward another district's handler floor, and each service has its own storage building.",
      "roles": [
        {
          "name": "Service",
          "desc": "A small, separately deployed program that owns one capability (orders, kitchen, payments, shipping)."
        },
        {
          "name": "API Contract",
          "desc": "The public interface of a service: its HTTP routes, gRPC/protobuf definitions or event names and payloads. The only thing other services may depend on."
        },
        {
          "name": "Private Data",
          "desc": "A data store owned by exactly one service. Others must ask through its API or listen to its events, never read its tables."
        },
        {
          "name": "Remote Communication",
          "desc": "Code that crosses the network: HTTP or gRPC clients, or a message bus for publishing and subscribing to events."
        },
        {
          "name": "Coordinator",
          "desc": "The code that drives a workflow spanning services: an orchestrator calling others in turn, or (in choreography) event handlers reacting to each other."
        }
      ],
      "whenToUse": [
        "Several teams need to release parts of a large system independently, without one shared deploy.",
        "Parts of the system have very different load, scaling or technology needs (a CPU-heavy pricing engine next to a simple catalog).",
        "Clear business boundaries already exist and a well-structured monolith has started to slow teams down."
      ],
      "pitfalls": [
        "A distributed monolith: services that share a database or must deploy together get all the network costs and none of the independence.",
        "Every call can now fail or be slow; without timeouts, retries, idempotency and fallbacks one sick service takes down the rest.",
        "Splitting too early: for a small team, a modular monolith is cheaper to build, test, debug and run."
      ],
      "related": [
        "client-server",
        "pub-sub",
        "circuit-breaker",
        "hexagonal",
        "event-sourcing",
        "cqrs"
      ],
      "quiz": [
        {
          "q": "The Kitchen service needs the customer's name, which lives in the Orders database. What is the microservices way to get it?",
          "options": [
            "Query the orders table directly",
            "Import the Orders service's OrderStore class",
            "Ask the Orders API, or receive the name in the request or event payload",
            "Merge both services into one database"
          ],
          "answer": 2,
          "why": "Each service owns its data. Others get it through the owner's API or through data included in messages, so the owner can change its storage freely."
        },
        {
          "q": "What is the main trade-off of choreography (services reacting to events) versus one orchestrator calling everyone?",
          "options": [
            "Choreography needs a shared database",
            "Choreography decouples services but makes the overall workflow harder to see in one place",
            "Orchestration cannot use HTTP",
            "There is no difference"
          ],
          "answer": 1,
          "why": "With events, no service knows the full flow, which keeps them independent, but you need tracing and docs to understand what happens end to end."
        }
      ],
      "demos": [
        {
          "id": "microservices-ts-pizza",
          "title": "Pizza orders and kitchen over HTTP",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Two Node services in two folders, each with its own server, port and data. Orders asks Kitchen to cook over HTTP. Notice that no file in orders/ imports anything from kitchen/: only a URL and a JSON shape connect them.",
          "roles": {
            "Service": [
              "microservices-ts-pizza/services/orders/src/server.ts",
              "microservices-ts-pizza/services/kitchen/src/server.ts"
            ],
            "API Contract": [
              "microservices-ts-pizza/services/kitchen/src/server.ts#handle",
              "microservices-ts-pizza/services/orders/src/server.ts#handle"
            ],
            "Private Data": [
              "microservices-ts-pizza/services/orders/src/order-store.ts#OrderStore",
              "microservices-ts-pizza/services/kitchen/src/ticket-queue.ts#TicketQueue"
            ],
            "Remote Communication": [
              "microservices-ts-pizza/services/orders/src/kitchen-client.ts#requestCooking"
            ],
            "Coordinator": [
              "microservices-ts-pizza/services/orders/src/server.ts#placeOrder"
            ]
          },
          "trace": [
            {
              "at": "microservices-ts-pizza/services/orders/src/server.ts#handle",
              "say": "A customer POSTs /orders to the Orders service on port 4001. This route is part of Orders' public contract."
            },
            {
              "at": "microservices-ts-pizza/services/orders/src/server.ts#placeOrder",
              "say": "Orders stores the order in its own data first, so it never loses an order even if the kitchen is down."
            },
            {
              "at": "microservices-ts-pizza/services/orders/src/order-store.ts#OrderStore.create",
              "say": "This Map belongs to Orders alone. In production it would be Orders' own database."
            },
            {
              "at": "microservices-ts-pizza/services/orders/src/kitchen-client.ts#requestCooking",
              "say": "The network hop: a fetch to the Kitchen's URL. A failure returns false instead of crashing Orders."
            },
            {
              "at": "microservices-ts-pizza/services/kitchen/src/server.ts#handle",
              "say": "A different process receives POST /tickets. It only trusts the JSON it was sent."
            },
            {
              "at": "microservices-ts-pizza/services/kitchen/src/server.ts#acceptTicket",
              "say": "The Kitchen applies its own rule (only pizzas on the menu) and answers with a status code."
            },
            {
              "at": "microservices-ts-pizza/services/kitchen/src/ticket-queue.ts#TicketQueue.push",
              "say": "The Kitchen keeps its own queue. It could be rewritten in Go tomorrow and Orders would not notice."
            },
            {
              "at": "microservices-ts-pizza/services/orders/src/order-store.ts#OrderStore.setStatus",
              "say": "Back in Orders, the answer becomes 'cooking' or 'rejected' in Orders' own copy of the truth."
            }
          ],
          "files": {
            "microservices-ts-pizza/docker-compose.yml": "# Two services, two containers, two ports. Each could use a different language or database.\nservices:\n  orders:\n    build: ./services/orders\n    ports: [\"4001:4001\"]\n    environment:\n      KITCHEN_URL: http://kitchen:4002\n  kitchen:\n    build: ./services/kitchen\n    ports: [\"4002:4002\"]\n",
            "microservices-ts-pizza/services/kitchen/src/server.ts": "import { createServer, IncomingMessage, ServerResponse } from 'node:http';\nimport { TicketQueue } from './ticket-queue';\n\n// Kitchen service: deployed, scaled and restarted independently of Orders.\nconst queue = new TicketQueue();\n\nexport function acceptTicket(orderId: number, pizza: string): number {\n  if (!queue.canCook(pizza)) return 422;\n  const position = queue.push({ orderId, pizza });\n  console.log('ticket for order ' + orderId + ' is #' + position + ' in the queue');\n  return 201;\n}\n\nconst handle = async (req: IncomingMessage, res: ServerResponse) => {\n  if (req.method === 'POST' && req.url === '/tickets') {\n    let body = '';\n    for await (const chunk of req) body += chunk;\n    const { orderId, pizza } = JSON.parse(body);\n    res.writeHead(acceptTicket(orderId, pizza)).end();\n    return;\n  }\n  res.writeHead(404).end();\n};\n\ncreateServer(handle).listen(4002, () => console.log('kitchen on :4002'));\n",
            "microservices-ts-pizza/services/kitchen/src/ticket-queue.ts": "// Kitchen's OWN data: a queue of tickets. It does not know what an \"order\" record looks like.\nexport interface Ticket {\n  orderId: number;\n  pizza: string;\n}\n\nconst MENU = ['margherita', 'funghi', 'diavola'];\n\nexport class TicketQueue {\n  private tickets: Ticket[] = [];\n\n  canCook(pizza: string): boolean {\n    return MENU.includes(pizza.toLowerCase());\n  }\n\n  push(ticket: Ticket): number {\n    this.tickets.push(ticket);\n    return this.tickets.length;\n  }\n}\n",
            "microservices-ts-pizza/services/orders/src/kitchen-client.ts": "// The ONLY place in Orders that knows the Kitchen exists: its URL and its JSON contract.\nconst KITCHEN_URL = process.env.KITCHEN_URL ?? 'http://localhost:4002';\n\nexport async function requestCooking(orderId: number, pizza: string): Promise<boolean> {\n  try {\n    const res = await fetch(KITCHEN_URL + '/tickets', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ orderId, pizza }),\n    });\n    return res.status === 201;\n  } catch {\n    return false; // the kitchen is down: Orders must still answer\n  }\n}\n",
            "microservices-ts-pizza/services/orders/src/order-store.ts": "// Orders service's OWN data. No other service may read this; they must ask over HTTP.\nexport interface Order {\n  id: number;\n  pizza: string;\n  status: 'waiting' | 'cooking' | 'rejected';\n}\n\nexport class OrderStore {\n  private orders = new Map<number, Order>();\n  private nextId = 1;\n\n  create(pizza: string): Order {\n    const order: Order = { id: this.nextId++, pizza, status: 'waiting' };\n    this.orders.set(order.id, order);\n    return order;\n  }\n\n  setStatus(id: number, status: Order['status']): void {\n    const order = this.orders.get(id);\n    if (order) order.status = status;\n  }\n}\n",
            "microservices-ts-pizza/services/orders/src/server.ts": "import { createServer, IncomingMessage, ServerResponse } from 'node:http';\nimport { OrderStore } from './order-store';\nimport { requestCooking } from './kitchen-client';\n\n// Orders service: its own process, its own port, its own data.\nconst store = new OrderStore();\n\nexport async function placeOrder(pizza: string) {\n  const order = store.create(pizza);\n  const accepted = await requestCooking(order.id, pizza);\n  store.setStatus(order.id, accepted ? 'cooking' : 'rejected');\n  return order;\n}\n\nconst handle = async (req: IncomingMessage, res: ServerResponse) => {\n  if (req.method === 'POST' && req.url === '/orders') {\n    let body = '';\n    for await (const chunk of req) body += chunk;\n    const order = await placeOrder(JSON.parse(body).pizza);\n    res.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify(order));\n    return;\n  }\n  res.writeHead(404).end();\n};\n\ncreateServer(handle).listen(4001, () => console.log('orders on :4001'));\n"
          }
        },
        {
          "id": "microservices-py-events",
          "title": "Shop services talking through events",
          "lang": "Python",
          "level": "intermediate",
          "source": null,
          "story": "Orders, Payments and Notifications never call each other. Orders publishes order.placed, Payments reacts and publishes the result, and the others listen. Each has its own database (or none), and Notifications was added without touching the rest.",
          "roles": {
            "Service": [
              "microservices-py-events/services/orders/api.py",
              "microservices-py-events/services/payments/worker.py",
              "microservices-py-events/services/notifications/worker.py"
            ],
            "API Contract": [
              "microservices-py-events/services/orders/api.py#place_order"
            ],
            "Private Data": [
              "microservices-py-events/services/orders/repository.py#OrderRepository",
              "microservices-py-events/services/payments/ledger.py#Ledger"
            ],
            "Remote Communication": [
              "microservices-py-events/shared/bus.py#publish",
              "microservices-py-events/shared/bus.py#subscribe"
            ],
            "Coordinator": [
              "microservices-py-events/services/payments/worker.py#on_order_placed",
              "microservices-py-events/services/orders/events.py#on_payment_succeeded",
              "microservices-py-events/services/notifications/worker.py#on_payment_succeeded"
            ]
          },
          "trace": [
            {
              "at": "microservices-py-events/services/orders/api.py#place_order",
              "say": "POST /orders saves the order as pending and answers 202 Accepted at once: the rest happens asynchronously."
            },
            {
              "at": "microservices-py-events/services/orders/repository.py#OrderRepository.add",
              "say": "orders.db belongs to Orders only. Payments cannot join against it, and that is the point."
            },
            {
              "at": "microservices-py-events/shared/bus.py#publish",
              "say": "Orders publishes a fact, 'order.placed', with everything listeners need. It does not know who listens."
            },
            {
              "at": "microservices-py-events/services/payments/worker.py#on_order_placed",
              "say": "The Payments worker, a separate process, picks up the event and charges the wallet."
            },
            {
              "at": "microservices-py-events/services/payments/ledger.py#Ledger.charge",
              "say": "Balances live in payments.db. The rule 'enough balance?' belongs to Payments alone."
            },
            {
              "at": "microservices-py-events/services/orders/events.py#on_payment_succeeded",
              "say": "Orders listens for the outcome and updates its own status. This is choreography: no central coordinator."
            },
            {
              "at": "microservices-py-events/services/notifications/worker.py#on_payment_succeeded",
              "say": "Notifications heard the same event and emails the customer. Adding it required zero changes elsewhere."
            }
          ],
          "files": {
            "microservices-py-events/services/notifications/worker.py": "# Notifications service: no database at all. Added later without changing Orders or Payments.\nfrom shared.bus import subscribe\n\n\ndef on_payment_succeeded(event):\n    send_email(event[\"customer\"], \"Thanks! Order \" + str(event[\"order_id\"]) + \" is paid.\")\n\n\ndef on_payment_failed(event):\n    send_email(event[\"customer\"], \"Payment for order \" + str(event[\"order_id\"]) + \" failed. Please top up.\")\n\n\ndef send_email(to, text):\n    print(\"[email to \" + to + \"] \" + text)\n\n\ndef run():\n    subscribe({\"payment.succeeded\": on_payment_succeeded, \"payment.failed\": on_payment_failed})\n",
            "microservices-py-events/services/orders/api.py": "# Orders service: HTTP in, events out. It does not call Payments; it announces a fact.\nfrom flask import Flask, jsonify, request\n\nfrom shared.bus import publish\nfrom .repository import OrderRepository\n\napp = Flask(__name__)\norders = OrderRepository()\n\n\n@app.post(\"/orders\")\ndef place_order():\n    body = request.get_json()\n    order_id = orders.add(body[\"customer\"], body[\"total_cents\"])\n    publish(\"order.placed\", {\"order_id\": order_id, \"customer\": body[\"customer\"], \"total_cents\": body[\"total_cents\"]})\n    return jsonify({\"order_id\": order_id, \"status\": \"pending\"}), 202\n",
            "microservices-py-events/services/orders/events.py": "# Orders also LISTENS: it keeps its own copy of the order status up to date.\nfrom shared.bus import subscribe\nfrom .repository import OrderRepository\n\norders = OrderRepository()\n\n\ndef on_payment_succeeded(event):\n    orders.set_status(event[\"order_id\"], \"paid\")\n\n\ndef on_payment_failed(event):\n    orders.set_status(event[\"order_id\"], \"payment_failed\")\n\n\ndef run():\n    subscribe({\"payment.succeeded\": on_payment_succeeded, \"payment.failed\": on_payment_failed})\n",
            "microservices-py-events/services/orders/repository.py": "# Orders' private database. Payments has its own; nobody joins across them.\nimport sqlite3\n\n\nclass OrderRepository:\n    def __init__(self, path=\"orders.db\"):\n        self.db = sqlite3.connect(path, check_same_thread=False)\n        self.db.execute(\"CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, customer TEXT, total INTEGER, status TEXT)\")\n\n    def add(self, customer, total_cents):\n        cur = self.db.execute(\"INSERT INTO orders (customer, total, status) VALUES (?, ?, 'pending')\", (customer, total_cents))\n        self.db.commit()\n        return cur.lastrowid\n\n    def set_status(self, order_id, status):\n        self.db.execute(\"UPDATE orders SET status = ? WHERE id = ?\", (status, order_id))\n        self.db.commit()\n",
            "microservices-py-events/services/payments/ledger.py": "# Payments' private data: customer wallets. Orders never sees this table.\nimport sqlite3\n\n\nclass Ledger:\n    def __init__(self, path=\"payments.db\"):\n        self.db = sqlite3.connect(path)\n        self.db.execute(\"CREATE TABLE IF NOT EXISTS wallets (customer TEXT PRIMARY KEY, balance INTEGER)\")\n\n    def charge(self, customer, cents):\n        row = self.db.execute(\"SELECT balance FROM wallets WHERE customer = ?\", (customer,)).fetchone()\n        if row is None or row[0] < cents:\n            return False\n        self.db.execute(\"UPDATE wallets SET balance = balance - ? WHERE customer = ?\", (cents, customer))\n        self.db.commit()\n        return True\n",
            "microservices-py-events/services/payments/worker.py": "# Payments service: reacts to order.placed and publishes the outcome. Runs and scales on its own.\nfrom shared.bus import publish, subscribe\nfrom .ledger import Ledger\n\nledger = Ledger()\n\n\ndef on_order_placed(event):\n    ok = ledger.charge(event[\"customer\"], event[\"total_cents\"])\n    topic = \"payment.succeeded\" if ok else \"payment.failed\"\n    publish(topic, {\"order_id\": event[\"order_id\"], \"customer\": event[\"customer\"]})\n\n\ndef run():\n    subscribe({\"order.placed\": on_order_placed})\n",
            "microservices-py-events/shared/bus.py": "# A thin wrapper over Redis pub/sub. Services share this tiny library, never each other's code or tables.\nimport json\n\nimport redis\n\n_redis = redis.Redis.from_url(\"redis://broker:6379\")\n\n\ndef publish(topic, payload):\n    _redis.publish(topic, json.dumps(payload))\n\n\ndef subscribe(handlers):\n    \"\"\"handlers maps a topic to a function(payload). Blocks forever, like a worker should.\"\"\"\n    pubsub = _redis.pubsub()\n    pubsub.subscribe(*handlers.keys())\n    for message in pubsub.listen():\n        if message[\"type\"] == \"message\":\n            topic = message[\"channel\"].decode()\n            handlers[topic](json.loads(message[\"data\"]))\n"
          }
        },
        {
          "id": "microservices-hipster-shop-real",
          "title": "Online Boutique: checkout orchestrates over gRPC",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "GoogleCloudPlatform/microservices-demo",
            "url": "https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/checkoutservice/main.go",
            "license": "Apache-2.0",
            "note": "Files from tag v0.10.3: checkoutservice/main.go and shippingservice/main.go are trimmed (logging, tracing, server boot); quote.go, tracker.go, charge.js and server.js are complete; demo.proto is an excerpt with only three service definitions. paymentservice is Node.js in the original too."
          },
          "story": "Google's reference microservices app. The Checkout service (Go) orchestrates a purchase by calling Cart, Catalog, Currency, Shipping (Go), Payment (Node.js) and Email over gRPC. demo.proto is the shared contract; nothing else is shared.",
          "roles": {
            "Service": [
              "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService",
              "microservices-hipster-shop-real/src/shippingservice/main.go#server",
              "microservices-hipster-shop-real/src/paymentservice/server.js#HipsterShopServer"
            ],
            "API Contract": [
              "microservices-hipster-shop-real/protos/demo.proto"
            ],
            "Private Data": [
              "microservices-hipster-shop-real/src/shippingservice/quote.go#Quote"
            ],
            "Remote Communication": [
              "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.quoteShipping",
              "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.chargeCard",
              "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.shipOrder"
            ],
            "Coordinator": [
              "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.PlaceOrder"
            ]
          },
          "trace": [
            {
              "at": "microservices-hipster-shop-real/src/checkoutservice/main.go#main",
              "say": "Checkout learns six other services' addresses from environment variables. In Kubernetes these are just DNS names like shippingservice:50051."
            },
            {
              "at": "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.PlaceOrder",
              "say": "PlaceOrder is the orchestrator: prepare items and shipping, sum the total, charge, ship, empty the cart, send email."
            },
            {
              "at": "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.prepareOrderItemsAndShippingQuoteFromCart",
              "say": "One step fans out to Cart, ProductCatalog, Shipping and Currency. Every call is a network call that can fail, so each error is wrapped."
            },
            {
              "at": "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.quoteShipping",
              "say": "A generated gRPC client calls ShippingService.GetQuote, exactly as declared in demo.proto."
            },
            {
              "at": "microservices-hipster-shop-real/src/shippingservice/main.go#server.GetQuote",
              "say": "Inside the separate Shipping process, GetQuote builds a quote and answers in the contract's Money format."
            },
            {
              "at": "microservices-hipster-shop-real/src/checkoutservice/main.go#checkoutService.chargeCard",
              "say": "Next, Checkout calls PaymentService.Charge. Checkout neither knows nor cares that Payment is written in JavaScript."
            },
            {
              "at": "microservices-hipster-shop-real/src/paymentservice/server.js#HipsterShopServer.ChargeServiceHandler",
              "say": "The Node.js Payment service receives the gRPC call and delegates to charge(), turning thrown errors into gRPC errors."
            },
            {
              "at": "microservices-hipster-shop-real/src/shippingservice/main.go#server.ShipOrder",
              "say": "Finally Checkout asks Shipping to ship and gets a tracking ID back. If Shipping is down, PlaceOrder returns Unavailable after the card was charged: a real distributed-systems headache."
            }
          ],
          "files": {
            "microservices-hipster-shop-real/protos/demo.proto": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/protos/demo.proto\n// Apache-2.0, Copyright (c) 2020 Google LLC. Included for study.\n// Copyright 2020 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nsyntax = \"proto3\";\n\npackage hipstershop;\n\n// … trimmed: Cart, Recommendation and ProductCatalog services and their messages …\n\nservice ShippingService {\n    rpc GetQuote(GetQuoteRequest) returns (GetQuoteResponse) {}\n    rpc ShipOrder(ShipOrderRequest) returns (ShipOrderResponse) {}\n}\n\n// … trimmed: shipping and currency messages …\n\nservice PaymentService {\n    rpc Charge(ChargeRequest) returns (ChargeResponse) {}\n}\n\n// … trimmed: payment and email messages …\n\nservice CheckoutService {\n    rpc PlaceOrder(PlaceOrderRequest) returns (PlaceOrderResponse) {}\n}\n\n// … trimmed: checkout messages and AdService …\n",
            "microservices-hipster-shop-real/src/checkoutservice/main.go": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/checkoutservice/main.go\n// Apache-2.0, Copyright (c) 2018 Google LLC. Included for study.\n// Copyright 2018 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\npackage main\n\n// … trimmed: 25 lines of imports (grpc, logrus, uuid, otel, generated protobuf code pb, money) …\n\nconst (\n\tlistenPort  = \"5050\"\n\tusdCurrency = \"USD\"\n)\n\n// … trimmed: 16 lines of logrus logger setup …\n\ntype checkoutService struct {\n\tpb.UnimplementedCheckoutServiceServer\n\n\tproductCatalogSvcAddr string\n\tproductCatalogSvcConn *grpc.ClientConn\n\n\tcartSvcAddr string\n\tcartSvcConn *grpc.ClientConn\n\n\tcurrencySvcAddr string\n\tcurrencySvcConn *grpc.ClientConn\n\n\tshippingSvcAddr string\n\tshippingSvcConn *grpc.ClientConn\n\n\temailSvcAddr string\n\temailSvcConn *grpc.ClientConn\n\n\tpaymentSvcAddr string\n\tpaymentSvcConn *grpc.ClientConn\n}\n\nfunc main() {\n\tctx := context.Background()\n\t// … trimmed: 15 lines of optional tracing / profiling setup …\n\tport := listenPort\n\tif os.Getenv(\"PORT\") != \"\" {\n\t\tport = os.Getenv(\"PORT\")\n\t}\n\n\tsvc := new(checkoutService)\n\tmustMapEnv(&svc.shippingSvcAddr, \"SHIPPING_SERVICE_ADDR\")\n\tmustMapEnv(&svc.productCatalogSvcAddr, \"PRODUCT_CATALOG_SERVICE_ADDR\")\n\tmustMapEnv(&svc.cartSvcAddr, \"CART_SERVICE_ADDR\")\n\tmustMapEnv(&svc.currencySvcAddr, \"CURRENCY_SERVICE_ADDR\")\n\tmustMapEnv(&svc.emailSvcAddr, \"EMAIL_SERVICE_ADDR\")\n\tmustMapEnv(&svc.paymentSvcAddr, \"PAYMENT_SERVICE_ADDR\")\n\n\tmustConnGRPC(ctx, &svc.shippingSvcConn, svc.shippingSvcAddr)\n\tmustConnGRPC(ctx, &svc.productCatalogSvcConn, svc.productCatalogSvcAddr)\n\tmustConnGRPC(ctx, &svc.cartSvcConn, svc.cartSvcAddr)\n\tmustConnGRPC(ctx, &svc.currencySvcConn, svc.currencySvcAddr)\n\tmustConnGRPC(ctx, &svc.emailSvcConn, svc.emailSvcAddr)\n\tmustConnGRPC(ctx, &svc.paymentSvcConn, svc.paymentSvcAddr)\n\n\tlog.Infof(\"service config: %+v\", svc)\n\t// … trimmed: 22 lines that start the gRPC server and register this service …\n}\n\n// … trimmed: 82 lines: tracing/profiling setup, mustMapEnv, mustConnGRPC (dial each address) and health checks …\n\nfunc (cs *checkoutService) PlaceOrder(ctx context.Context, req *pb.PlaceOrderRequest) (*pb.PlaceOrderResponse, error) {\n\tlog.Infof(\"[PlaceOrder] user_id=%q user_currency=%q\", req.UserId, req.UserCurrency)\n\n\torderID, err := uuid.NewUUID()\n\tif err != nil {\n\t\treturn nil, status.Errorf(codes.Internal, \"failed to generate order uuid\")\n\t}\n\n\tprep, err := cs.prepareOrderItemsAndShippingQuoteFromCart(ctx, req.UserId, req.UserCurrency, req.Address)\n\tif err != nil {\n\t\treturn nil, status.Errorf(codes.Internal, err.Error())\n\t}\n\n\ttotal := pb.Money{CurrencyCode: req.UserCurrency,\n\t\tUnits: 0,\n\t\tNanos: 0}\n\ttotal = money.Must(money.Sum(total, *prep.shippingCostLocalized))\n\tfor _, it := range prep.orderItems {\n\t\tmultPrice := money.MultiplySlow(*it.Cost, uint32(it.GetItem().GetQuantity()))\n\t\ttotal = money.Must(money.Sum(total, multPrice))\n\t}\n\n\ttxID, err := cs.chargeCard(ctx, &total, req.CreditCard)\n\tif err != nil {\n\t\treturn nil, status.Errorf(codes.Internal, \"failed to charge card: %+v\", err)\n\t}\n\tlog.Infof(\"payment went through (transaction_id: %s)\", txID)\n\n\tshippingTrackingID, err := cs.shipOrder(ctx, req.Address, prep.cartItems)\n\tif err != nil {\n\t\treturn nil, status.Errorf(codes.Unavailable, \"shipping error: %+v\", err)\n\t}\n\n\t_ = cs.emptyUserCart(ctx, req.UserId)\n\n\torderResult := &pb.OrderResult{\n\t\tOrderId:            orderID.String(),\n\t\tShippingTrackingId: shippingTrackingID,\n\t\tShippingCost:       prep.shippingCostLocalized,\n\t\tShippingAddress:    req.Address,\n\t\tItems:              prep.orderItems,\n\t}\n\n\tif err := cs.sendOrderConfirmation(ctx, req.Email, orderResult); err != nil {\n\t\tlog.Warnf(\"failed to send order confirmation to %q: %+v\", req.Email, err)\n\t} else {\n\t\tlog.Infof(\"order confirmation email sent to %q\", req.Email)\n\t}\n\tresp := &pb.PlaceOrderResponse{Order: orderResult}\n\treturn resp, nil\n}\n\ntype orderPrep struct {\n\torderItems            []*pb.OrderItem\n\tcartItems             []*pb.CartItem\n\tshippingCostLocalized *pb.Money\n}\n\nfunc (cs *checkoutService) prepareOrderItemsAndShippingQuoteFromCart(ctx context.Context, userID, userCurrency string, address *pb.Address) (orderPrep, error) {\n\tvar out orderPrep\n\tcartItems, err := cs.getUserCart(ctx, userID)\n\tif err != nil {\n\t\treturn out, fmt.Errorf(\"cart failure: %+v\", err)\n\t}\n\torderItems, err := cs.prepOrderItems(ctx, cartItems, userCurrency)\n\tif err != nil {\n\t\treturn out, fmt.Errorf(\"failed to prepare order: %+v\", err)\n\t}\n\tshippingUSD, err := cs.quoteShipping(ctx, address, cartItems)\n\tif err != nil {\n\t\treturn out, fmt.Errorf(\"shipping quote failure: %+v\", err)\n\t}\n\tshippingPrice, err := cs.convertCurrency(ctx, shippingUSD, userCurrency)\n\tif err != nil {\n\t\treturn out, fmt.Errorf(\"failed to convert shipping cost to currency: %+v\", err)\n\t}\n\n\tout.shippingCostLocalized = shippingPrice\n\tout.cartItems = cartItems\n\tout.orderItems = orderItems\n\treturn out, nil\n}\n\nfunc (cs *checkoutService) quoteShipping(ctx context.Context, address *pb.Address, items []*pb.CartItem) (*pb.Money, error) {\n\tshippingQuote, err := pb.NewShippingServiceClient(cs.shippingSvcConn).\n\t\tGetQuote(ctx, &pb.GetQuoteRequest{\n\t\t\tAddress: address,\n\t\t\tItems:   items})\n\tif err != nil {\n\t\treturn nil, fmt.Errorf(\"failed to get shipping quote: %+v\", err)\n\t}\n\treturn shippingQuote.GetCostUsd(), nil\n}\n\nfunc (cs *checkoutService) getUserCart(ctx context.Context, userID string) ([]*pb.CartItem, error) {\n\tcart, err := pb.NewCartServiceClient(cs.cartSvcConn).GetCart(ctx, &pb.GetCartRequest{UserId: userID})\n\tif err != nil {\n\t\treturn nil, fmt.Errorf(\"failed to get user cart during checkout: %+v\", err)\n\t}\n\treturn cart.GetItems(), nil\n}\n\n// … trimmed: 7 lines of emptyUserCart (one more CartService call) …\n\nfunc (cs *checkoutService) prepOrderItems(ctx context.Context, items []*pb.CartItem, userCurrency string) ([]*pb.OrderItem, error) {\n\tout := make([]*pb.OrderItem, len(items))\n\tcl := pb.NewProductCatalogServiceClient(cs.productCatalogSvcConn)\n\n\tfor i, item := range items {\n\t\tproduct, err := cl.GetProduct(ctx, &pb.GetProductRequest{Id: item.GetProductId()})\n\t\tif err != nil {\n\t\t\treturn nil, fmt.Errorf(\"failed to get product #%q\", item.GetProductId())\n\t\t}\n\t\tprice, err := cs.convertCurrency(ctx, product.GetPriceUsd(), userCurrency)\n\t\tif err != nil {\n\t\t\treturn nil, fmt.Errorf(\"failed to convert price of %q to %s\", item.GetProductId(), userCurrency)\n\t\t}\n\t\tout[i] = &pb.OrderItem{\n\t\t\tItem: item,\n\t\t\tCost: price}\n\t}\n\treturn out, nil\n}\n\nfunc (cs *checkoutService) convertCurrency(ctx context.Context, from *pb.Money, toCurrency string) (*pb.Money, error) {\n\tresult, err := pb.NewCurrencyServiceClient(cs.currencySvcConn).Convert(context.TODO(), &pb.CurrencyConversionRequest{\n\t\tFrom:   from,\n\t\tToCode: toCurrency})\n\tif err != nil {\n\t\treturn nil, fmt.Errorf(\"failed to convert currency: %+v\", err)\n\t}\n\treturn result, err\n}\n\nfunc (cs *checkoutService) chargeCard(ctx context.Context, amount *pb.Money, paymentInfo *pb.CreditCardInfo) (string, error) {\n\tpaymentResp, err := pb.NewPaymentServiceClient(cs.paymentSvcConn).Charge(ctx, &pb.ChargeRequest{\n\t\tAmount:     amount,\n\t\tCreditCard: paymentInfo})\n\tif err != nil {\n\t\treturn \"\", fmt.Errorf(\"could not charge the card: %+v\", err)\n\t}\n\treturn paymentResp.GetTransactionId(), nil\n}\n\nfunc (cs *checkoutService) sendOrderConfirmation(ctx context.Context, email string, order *pb.OrderResult) error {\n\t_, err := pb.NewEmailServiceClient(cs.emailSvcConn).SendOrderConfirmation(ctx, &pb.SendOrderConfirmationRequest{\n\t\tEmail: email,\n\t\tOrder: order})\n\treturn err\n}\n\nfunc (cs *checkoutService) shipOrder(ctx context.Context, address *pb.Address, items []*pb.CartItem) (string, error) {\n\tresp, err := pb.NewShippingServiceClient(cs.shippingSvcConn).ShipOrder(ctx, &pb.ShipOrderRequest{\n\t\tAddress: address,\n\t\tItems:   items})\n\tif err != nil {\n\t\treturn \"\", fmt.Errorf(\"shipment failed: %+v\", err)\n\t}\n\treturn resp.GetTrackingId(), nil\n}\n",
            "microservices-hipster-shop-real/src/paymentservice/charge.js": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/paymentservice/charge.js\n// Apache-2.0, Copyright (c) 2018 Google LLC. Included for study.\n// Copyright 2018 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nconst cardValidator = require('simple-card-validator');\nconst { v4: uuidv4 } = require('uuid');\nconst pino = require('pino');\n\nconst logger = pino({\n  name: 'paymentservice-charge',\n  messageKey: 'message',\n  formatters: {\n    level (logLevelString, logLevelNum) {\n      return { severity: logLevelString }\n    }\n  }\n});\n\n\nclass CreditCardError extends Error {\n  constructor (message) {\n    super(message);\n    this.code = 400; // Invalid argument error\n  }\n}\n\nclass InvalidCreditCard extends CreditCardError {\n  constructor (cardType) {\n    super(`Credit card info is invalid`);\n  }\n}\n\nclass UnacceptedCreditCard extends CreditCardError {\n  constructor (cardType) {\n    super(`Sorry, we cannot process ${cardType} credit cards. Only VISA or MasterCard is accepted.`);\n  }\n}\n\nclass ExpiredCreditCard extends CreditCardError {\n  constructor (number, month, year) {\n    super(`Your credit card (ending ${number.substr(-4)}) expired on ${month}/${year}`);\n  }\n}\n\n/**\n * Verifies the credit card number and (pretend) charges the card.\n *\n * @param {*} request\n * @return transaction_id - a random uuid.\n */\nmodule.exports = function charge (request) {\n  const { amount, credit_card: creditCard } = request;\n  const cardNumber = creditCard.credit_card_number;\n  const cardInfo = cardValidator(cardNumber);\n  const {\n    card_type: cardType,\n    valid\n  } = cardInfo.getCardDetails();\n\n  if (!valid) { throw new InvalidCreditCard(); }\n\n  // Only VISA and mastercard is accepted, other card types (AMEX, dinersclub) will\n  // throw UnacceptedCreditCard error.\n  if (!(cardType === 'visa' || cardType === 'mastercard')) { throw new UnacceptedCreditCard(cardType); }\n\n  // Also validate expiration is > today.\n  const currentMonth = new Date().getMonth() + 1;\n  const currentYear = new Date().getFullYear();\n  const { credit_card_expiration_year: year, credit_card_expiration_month: month } = creditCard;\n  if ((currentYear * 12 + currentMonth) > (year * 12 + month)) { throw new ExpiredCreditCard(cardNumber.replace('-', ''), month, year); }\n\n  logger.info(`Transaction processed: ${cardType} ending ${cardNumber.substr(-4)} \\\n    Amount: ${amount.currency_code}${amount.units}.${amount.nanos}`);\n\n  return { transaction_id: uuidv4() };\n};\n",
            "microservices-hipster-shop-real/src/paymentservice/server.js": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/paymentservice/server.js\n// Apache-2.0, Copyright (c) 2018 Google LLC. Included for study.\n// Copyright 2018 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\nconst path = require('path');\nconst grpc = require('@grpc/grpc-js');\nconst protoLoader = require('@grpc/proto-loader');\n\nconst charge = require('./charge');\n\nconst logger = require('./logger')\n\nclass HipsterShopServer {\n  constructor(protoRoot, port = HipsterShopServer.PORT) {\n    this.port = port;\n\n    this.packages = {\n      hipsterShop: this.loadProto(path.join(protoRoot, 'demo.proto')),\n      health: this.loadProto(path.join(protoRoot, 'grpc/health/v1/health.proto'))\n    };\n\n    this.server = new grpc.Server();\n    this.loadAllProtos(protoRoot);\n  }\n\n  /**\n   * Handler for PaymentService.Charge.\n   * @param {*} call  { ChargeRequest }\n   * @param {*} callback  fn(err, ChargeResponse)\n   */\n  static ChargeServiceHandler(call, callback) {\n    try {\n      logger.info(`PaymentService#Charge invoked with request ${JSON.stringify(call.request)}`);\n      const response = charge(call.request);\n      callback(null, response);\n    } catch (err) {\n      console.warn(err);\n      callback(err);\n    }\n  }\n\n  static CheckHandler(call, callback) {\n    callback(null, { status: 'SERVING' });\n  }\n\n\n  listen() {\n    const server = this.server \n    const port = this.port\n    server.bindAsync(\n      `[::]:${port}`,\n      grpc.ServerCredentials.createInsecure(),\n      function () {\n        logger.info(`PaymentService gRPC server started on port ${port}`);\n        server.start();\n      }\n    );\n  }\n\n  loadProto(path) {\n    const packageDefinition = protoLoader.loadSync(\n      path,\n      {\n        keepCase: true,\n        longs: String,\n        enums: String,\n        defaults: true,\n        oneofs: true\n      }\n    );\n    return grpc.loadPackageDefinition(packageDefinition);\n  }\n\n  loadAllProtos(protoRoot) {\n    const hipsterShopPackage = this.packages.hipsterShop.hipstershop;\n    const healthPackage = this.packages.health.grpc.health.v1;\n\n    this.server.addService(\n      hipsterShopPackage.PaymentService.service,\n      {\n        charge: HipsterShopServer.ChargeServiceHandler.bind(this)\n      }\n    );\n\n    this.server.addService(\n      healthPackage.Health.service,\n      {\n        check: HipsterShopServer.CheckHandler.bind(this)\n      }\n    );\n  }\n}\n\nHipsterShopServer.PORT = process.env.PORT;\n\nmodule.exports = HipsterShopServer;\n",
            "microservices-hipster-shop-real/src/shippingservice/main.go": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/shippingservice/main.go\n// Apache-2.0, Copyright (c) 2018 Google LLC. Included for study.\n// Copyright 2018 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\npackage main\n\nimport (\n\t\"fmt\"\n\t\"net\"\n\t\"os\"\n\t\"time\"\n\n\t\"cloud.google.com/go/profiler\"\n\t\"github.com/sirupsen/logrus\"\n\t\"golang.org/x/net/context\"\n\t\"google.golang.org/grpc\"\n\t\"google.golang.org/grpc/codes\"\n\t\"google.golang.org/grpc/reflection\"\n\t\"google.golang.org/grpc/status\"\n\n\tpb \"github.com/GoogleCloudPlatform/microservices-demo/src/shippingservice/genproto\"\n\thealthpb \"google.golang.org/grpc/health/grpc_health_v1\"\n)\n\nconst (\n\tdefaultPort = \"50051\"\n)\n\n// … trimmed: 16 lines of logger setup …\n\nfunc main() {\n\t// … trimmed: 34 lines of tracing, profiling, port and stats setup …\n\tsvc := &server{}\n\tpb.RegisterShippingServiceServer(srv, svc)\n\thealthpb.RegisterHealthServer(srv, svc)\n\tlog.Infof(\"Shipping Service listening on port %s\", port)\n\n\t// Register reflection service on gRPC server.\n\treflection.Register(srv)\n\tif err := srv.Serve(lis); err != nil {\n\t\tlog.Fatalf(\"failed to serve: %v\", err)\n\t}\n}\n\n// server controls RPC service responses.\ntype server struct {\n\tpb.UnimplementedShippingServiceServer\n}\n\n// … trimmed: 9 lines of gRPC health-check handlers …\n\n// GetQuote produces a shipping quote (cost) in USD.\nfunc (s *server) GetQuote(ctx context.Context, in *pb.GetQuoteRequest) (*pb.GetQuoteResponse, error) {\n\tlog.Info(\"[GetQuote] received request\")\n\tdefer log.Info(\"[GetQuote] completed request\")\n\n\t// 1. Generate a quote based on the total number of items to be shipped.\n\tquote := CreateQuoteFromCount(0)\n\n\t// 2. Generate a response.\n\treturn &pb.GetQuoteResponse{\n\t\tCostUsd: &pb.Money{\n\t\t\tCurrencyCode: \"USD\",\n\t\t\tUnits:        int64(quote.Dollars),\n\t\t\tNanos:        int32(quote.Cents * 10000000)},\n\t}, nil\n\n}\n\n// ShipOrder mocks that the requested items will be shipped.\n// It supplies a tracking ID for notional lookup of shipment delivery status.\nfunc (s *server) ShipOrder(ctx context.Context, in *pb.ShipOrderRequest) (*pb.ShipOrderResponse, error) {\n\tlog.Info(\"[ShipOrder] received request\")\n\tdefer log.Info(\"[ShipOrder] completed request\")\n\t// 1. Create a Tracking ID\n\tbaseAddress := fmt.Sprintf(\"%s, %s, %s\", in.Address.StreetAddress, in.Address.City, in.Address.State)\n\tid := CreateTrackingId(baseAddress)\n\n\t// 2. Generate a response.\n\treturn &pb.ShipOrderResponse{\n\t\tTrackingId: id,\n\t}, nil\n}\n\n// … trimmed: 29 lines of initStats / initTracing / initProfiling …\n",
            "microservices-hipster-shop-real/src/shippingservice/quote.go": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/shippingservice/quote.go\n// Apache-2.0, Copyright (c) 2018 Google LLC. Included for study.\n// Copyright 2018 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\npackage main\n\nimport (\n\t\"fmt\"\n\t\"math\"\n)\n\n// Quote represents a currency value.\ntype Quote struct {\n\tDollars uint32\n\tCents   uint32\n}\n\n// String representation of the Quote.\nfunc (q Quote) String() string {\n\treturn fmt.Sprintf(\"$%d.%d\", q.Dollars, q.Cents)\n}\n\n// CreateQuoteFromCount takes a number of items and returns a Price struct.\nfunc CreateQuoteFromCount(count int) Quote {\n\treturn CreateQuoteFromFloat(8.99)\n}\n\n// CreateQuoteFromFloat takes a price represented as a float and creates a Price struct.\nfunc CreateQuoteFromFloat(value float64) Quote {\n\tunits, fraction := math.Modf(value)\n\treturn Quote{\n\t\tuint32(units),\n\t\tuint32(math.Trunc(fraction * 100)),\n\t}\n",
            "microservices-hipster-shop-real/src/shippingservice/tracker.go": "// Source: GoogleCloudPlatform/microservices-demo v0.10.3 — https://github.com/GoogleCloudPlatform/microservices-demo/blob/v0.10.3/src/shippingservice/tracker.go\n// Apache-2.0, Copyright (c) 2018 Google LLC. Included for study.\n// Copyright 2018 Google LLC\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\npackage main\n\nimport (\n\t\"fmt\"\n\t\"math/rand\"\n\t\"time\"\n)\n\n// seeded determines if the random number generator is ready.\nvar seeded bool = false\n\n// CreateTrackingId generates a tracking ID.\nfunc CreateTrackingId(salt string) string {\n\tif !seeded {\n\t\trand.Seed(time.Now().UnixNano())\n\t\tseeded = true\n\t}\n\n\treturn fmt.Sprintf(\"%c%c-%d%s-%d%s\",\n\t\tgetRandomLetterCode(),\n\t\tgetRandomLetterCode(),\n\t\tlen(salt),\n\t\tgetRandomNumber(3),\n\t\tlen(salt)/2,\n\t\tgetRandomNumber(7),\n\t)\n}\n\n// getRandomLetterCode generates a code point value for a capital letter.\nfunc getRandomLetterCode() uint32 {\n\treturn 65 + uint32(rand.Intn(25))\n}\n\n// getRandomNumber generates a string representation of a number with the requested number of digits.\nfunc getRandomNumber(digits int) string {\n\tstr := \"\"\n\tfor i := 0; i < digits; i++ {\n\t\tstr = fmt.Sprintf(\"%s%d\", str, rand.Intn(10))\n\t}\n\n\treturn str\n}\n"
          }
        }
      ]
    },
    {
      "id": "hexagonal",
      "name": "Hexagonal Architecture",
      "family": "Architecture",
      "aka": [
        "Ports and Adapters"
      ],
      "tagline": "Keep the core app ignorant of the outside world; plug UIs and databases in through ports.",
      "intent": "Put the business logic in a core that defines its own interfaces (ports): driving ports for what the world may ask of it, driven ports for what it needs from the world. Everything technical (HTTP, CLI, SQL, email, payment APIs, tests) is an adapter that plugs into a port, so all source dependencies point into the core and any adapter can be swapped.",
      "analogy": "A travel adapter kit: your laptop (the core) has one fixed plug shape. In each country you use a different adapter for the wall socket, and the laptop never changes.",
      "cityShape": "Look for a core/ (or library/, application/) district with no import arcs leaving it, and an adapters/ district around it whose arcs all point inward to the ports building. The ports building is mostly interfaces, so it is short; the service building next to it has the tall floor (borrow, Transfer, bookRoom) with pipes to port methods only.",
      "roles": [
        {
          "name": "Domain",
          "desc": "Business objects and rules (Book, Account, Booking) with no technical dependencies."
        },
        {
          "name": "Driving Port",
          "desc": "Interface for what the outside world may ask the core to do (a use case). Driving adapters call it."
        },
        {
          "name": "Driven Port",
          "desc": "Interface owned by the core for what it needs from the outside (store this, charge that, notify them). Driven adapters implement it."
        },
        {
          "name": "Driving Adapter",
          "desc": "Primary adapter that turns an outside trigger (HTTP request, CLI line, test) into a call on a driving port."
        },
        {
          "name": "Driven Adapter",
          "desc": "Secondary adapter that implements a driven port with real technology (SQL, HTTP client, log, in-memory fake)."
        }
      ],
      "whenToUse": [
        "Business rules are valuable and long-lived while frameworks, databases and providers change around them.",
        "The same core must be driven in several ways: REST, CLI, message queue, scheduled job, tests.",
        "You want fast tests of the whole use case with fake adapters instead of mocks of a framework."
      ],
      "pitfalls": [
        "Ports that mirror the technology (executeSql, sendHttp) instead of the domain's needs make the hexagon leak.",
        "Ceremony overload: a CRUD app with no real rules gets interfaces, mappers and packages that add nothing.",
        "Adapters that call each other directly (the controller reaching into the SQL adapter) bypass the core and its rules."
      ],
      "related": [
        "clean-architecture",
        "dependency-inversion",
        "adapter",
        "repository",
        "dependency-injection"
      ],
      "quiz": [
        {
          "q": "Who owns (defines) the PaymentGateway interface in a hexagonal app?",
          "options": [
            "The payment provider's SDK",
            "The core application, as a driven port",
            "The web controller",
            "The database layer"
          ],
          "answer": 1,
          "why": "Driven ports belong to the core and speak its language. The provider-specific adapter implements them, so the dependency arrow points from adapter to core."
        },
        {
          "q": "In the hexagonal model, what is a unit test of BookingService?",
          "options": [
            "A violation, because it bypasses the HTTP adapter",
            "Just another driving adapter, using fake driven adapters",
            "Part of the domain",
            "A driven port"
          ],
          "answer": 1,
          "why": "The test calls the driving port like any other primary adapter and plugs in-memory fakes into the driven ports, so the whole use case runs without a database or network."
        }
      ],
      "demos": [
        {
          "id": "hexagonal-py-library",
          "title": "Library loans with a CLI",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A tiny lending library. The library/ package (domain, ports, application) imports nothing from adapters/; the CLI, the dict catalog and the console notifier plug in from outside, and main.py wires them.",
          "roles": {
            "Domain": [
              "hexagonal-py-library/library/domain/book.py#Book"
            ],
            "Driving Port": [
              "hexagonal-py-library/library/ports/inbound.py#BorrowBook"
            ],
            "Driven Port": [
              "hexagonal-py-library/library/ports/outbound.py#BookCatalog",
              "hexagonal-py-library/library/ports/outbound.py#Notifier"
            ],
            "Driving Adapter": [
              "hexagonal-py-library/adapters/cli.py#LibraryCli"
            ],
            "Driven Adapter": [
              "hexagonal-py-library/adapters/memory_catalog.py#MemoryCatalog",
              "hexagonal-py-library/adapters/console_notifier.py#ConsoleNotifier"
            ]
          },
          "trace": [
            {
              "at": "hexagonal-py-library/main.py#main",
              "say": "main() is the only place that names concrete adapters. It plugs a catalog and a notifier into the service, and the service into the CLI."
            },
            {
              "at": "hexagonal-py-library/adapters/cli.py#LibraryCli.run",
              "say": "The CLI is a driving adapter: it parses 'ana 111' and calls the BorrowBook port. It does not know BorrowService exists."
            },
            {
              "at": "hexagonal-py-library/library/application/borrow_service.py#BorrowService.borrow",
              "say": "The use case inside the hexagon asks the BookCatalog port for the book and the member's loan count."
            },
            {
              "at": "hexagonal-py-library/adapters/memory_catalog.py#MemoryCatalog.find",
              "say": "A driven adapter answers. Here it is a dict; a SQL adapter would implement the same port."
            },
            {
              "at": "hexagonal-py-library/library/domain/book.py#Book.lend_to",
              "say": "The rules (already out? too many loans?) live in the domain, with no I/O at all."
            },
            {
              "at": "hexagonal-py-library/adapters/console_notifier.py#ConsoleNotifier.book_lent",
              "say": "The core says 'book lent' through the Notifier port; this adapter decides that means printing."
            },
            {
              "at": "hexagonal-py-library/adapters/cli.py#LibraryCli.run",
              "say": "Ben's request fails with LoanRefused. The driving adapter turns the domain error into a friendly message."
            }
          ],
          "files": {
            "hexagonal-py-library/adapters/cli.py": "# Driving adapter: turns typed commands into calls on the driving port.\nfrom library.domain.book import LoanRefused\nfrom library.ports.inbound import BorrowBook\n\n\nclass LibraryCli:\n    def __init__(self, borrow_book: BorrowBook):\n        self.borrow_book = borrow_book\n\n    def run(self, line):\n        member, isbn = line.split()\n        try:\n            title = self.borrow_book.borrow(member, isbn)\n            print(\"OK: \" + member + \" took \" + title)\n        except LoanRefused as e:\n            print(\"Sorry: \" + str(e))\n",
            "hexagonal-py-library/adapters/console_notifier.py": "# Driven adapter: \"sends\" notifications by printing. Swap for an email adapter in production.\nfrom library.ports.outbound import Notifier\n\n\nclass ConsoleNotifier(Notifier):\n    def book_lent(self, member, title):\n        print(\"[mail to \" + member + \"] Enjoy \" + title + \"!\")\n",
            "hexagonal-py-library/adapters/memory_catalog.py": "# Driven adapter: a dict pretending to be the database. A SQL adapter would plug into the same port.\nfrom library.domain.book import Book\nfrom library.ports.outbound import BookCatalog\n\n\nclass MemoryCatalog(BookCatalog):\n    def __init__(self):\n        self.books = {\"111\": Book(\"111\", \"Dune\"), \"222\": Book(\"222\", \"Neuromancer\")}\n\n    def find(self, isbn):\n        return self.books[isbn]\n\n    def count_loans(self, member):\n        return sum(1 for b in self.books.values() if b.borrowed_by == member)\n\n    def save(self, book):\n        self.books[book.isbn] = book\n",
            "hexagonal-py-library/library/application/borrow_service.py": "# The hexagon's use case: implements the driving port, talks only to driven ports.\nfrom ..domain.book import Book\nfrom ..ports.inbound import BorrowBook\nfrom ..ports.outbound import BookCatalog, Notifier\n\n\nclass BorrowService(BorrowBook):\n    def __init__(self, catalog: BookCatalog, notifier: Notifier):\n        self.catalog = catalog\n        self.notifier = notifier\n\n    def borrow(self, member, isbn):\n        book: Book = self.catalog.find(isbn)\n        book.lend_to(member, self.catalog.count_loans(member))\n        self.catalog.save(book)\n        self.notifier.book_lent(member, book.title)\n        return book.title\n",
            "hexagonal-py-library/library/domain/book.py": "# Domain: the rules of lending, in plain Python. No database, no email, no input().\nMAX_LOANS = 3\n\n\nclass LoanRefused(Exception):\n    pass\n\n\nclass Book:\n    def __init__(self, isbn, title):\n        self.isbn = isbn\n        self.title = title\n        self.borrowed_by = None\n\n    def lend_to(self, member, loans_held):\n        if self.borrowed_by is not None:\n            raise LoanRefused(self.title + \" is already out\")\n        if loans_held >= MAX_LOANS:\n            raise LoanRefused(member + \" already has \" + str(MAX_LOANS) + \" books\")\n        self.borrowed_by = member\n",
            "hexagonal-py-library/library/ports/inbound.py": "# Driving port: what the outside world may ask the library to do.\nfrom abc import ABC, abstractmethod\n\n\nclass BorrowBook(ABC):\n    @abstractmethod\n    def borrow(self, member, isbn):\n        ...\n",
            "hexagonal-py-library/library/ports/outbound.py": "# Driven ports: what the library needs from the outside world, in its own words.\nfrom abc import ABC, abstractmethod\n\n\nclass BookCatalog(ABC):\n    @abstractmethod\n    def find(self, isbn):\n        ...\n\n    @abstractmethod\n    def count_loans(self, member):\n        ...\n\n    @abstractmethod\n    def save(self, book):\n        ...\n\n\nclass Notifier(ABC):\n    @abstractmethod\n    def book_lent(self, member, title):\n        ...\n",
            "hexagonal-py-library/main.py": "# Composition root: the only file that knows every adapter.\nfrom adapters.cli import LibraryCli\nfrom adapters.console_notifier import ConsoleNotifier\nfrom adapters.memory_catalog import MemoryCatalog\nfrom library.application.borrow_service import BorrowService\n\n\ndef main():\n    service = BorrowService(MemoryCatalog(), ConsoleNotifier())\n    cli = LibraryCli(service)\n    cli.run(\"ana 111\")\n    cli.run(\"ben 111\")\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        },
        {
          "id": "hexagonal-go-transfers",
          "title": "Bank transfers over HTTP",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "A money-transfer service laid out the Go way: internal/core holds domain, ports and services; internal/adapters holds HTTP, memory storage and an event log. Follow the import arcs: they all point into core.",
          "roles": {
            "Domain": [
              "hexagonal-go-transfers/internal/core/domain/account.go#Account"
            ],
            "Driving Port": [
              "hexagonal-go-transfers/internal/core/ports/ports.go#TransferUseCase"
            ],
            "Driven Port": [
              "hexagonal-go-transfers/internal/core/ports/ports.go#AccountStore",
              "hexagonal-go-transfers/internal/core/ports/ports.go#EventPublisher"
            ],
            "Driving Adapter": [
              "hexagonal-go-transfers/internal/adapters/httpapi/handler.go#Handler"
            ],
            "Driven Adapter": [
              "hexagonal-go-transfers/internal/adapters/memory/store.go#Store",
              "hexagonal-go-transfers/internal/adapters/eventlog/publisher.go#Publisher"
            ]
          },
          "trace": [
            {
              "at": "hexagonal-go-transfers/cmd/bank/main.go#main",
              "say": "main plugs the memory store and the log publisher into the core service, then hands the service to the HTTP adapter."
            },
            {
              "at": "hexagonal-go-transfers/internal/adapters/httpapi/handler.go#Handler.PostTransfer",
              "say": "The HTTP adapter decodes JSON and calls the TransferUseCase port. Status codes are its job, not the core's."
            },
            {
              "at": "hexagonal-go-transfers/internal/core/services/transfer.go#TransferService.Transfer",
              "say": "The core loads both accounts through the AccountStore port, applies the rules and saves both."
            },
            {
              "at": "hexagonal-go-transfers/internal/adapters/memory/store.go#Store.Get",
              "say": "The memory adapter returns a copy of the account, so the core can only change stored data through SaveBoth."
            },
            {
              "at": "hexagonal-go-transfers/internal/core/domain/account.go#Account.Withdraw",
              "say": "'Insufficient funds' is a domain rule and a domain error; the HTTP adapter maps it to 422 later."
            },
            {
              "at": "hexagonal-go-transfers/internal/adapters/memory/store.go#Store.SaveBoth",
              "say": "Saving both accounts in one locked step: a Postgres adapter would use one transaction behind the same port."
            },
            {
              "at": "hexagonal-go-transfers/internal/adapters/eventlog/publisher.go#Publisher.MoneyMoved",
              "say": "Finally the core announces the event through a port. Today it is a log line; tomorrow a Kafka adapter, with no core change."
            }
          ],
          "files": {
            "hexagonal-go-transfers/cmd/bank/main.go": "package main\n\nimport (\n\t\"log\"\n\t\"net/http\"\n\n\t\"example.com/bank/internal/adapters/eventlog\"\n\t\"example.com/bank/internal/adapters/httpapi\"\n\t\"example.com/bank/internal/adapters/memory\"\n\t\"example.com/bank/internal/core/services\"\n)\n\n// main plugs adapters into the ports. Nothing inside internal/core imports internal/adapters.\nfunc main() {\n\tstore := memory.NewStore()\n\tcore := services.NewTransferService(store, eventlog.Publisher{})\n\thandler := httpapi.NewHandler(core)\n\n\thttp.HandleFunc(\"POST /transfers\", handler.PostTransfer)\n\tlog.Println(\"listening on :8080\")\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}\n",
            "hexagonal-go-transfers/go.mod": "module example.com/bank\n\ngo 1.22\n",
            "hexagonal-go-transfers/internal/adapters/eventlog/publisher.go": "package eventlog\n\nimport \"log\"\n\n// Publisher is a driven adapter that just logs. A Kafka adapter would implement the same port.\ntype Publisher struct{}\n\nfunc (p Publisher) MoneyMoved(from, to string, cents int64) {\n\tlog.Printf(\"event MoneyMoved from=%s to=%s cents=%d\", from, to, cents)\n}\n",
            "hexagonal-go-transfers/internal/adapters/httpapi/handler.go": "package httpapi\n\nimport (\n\t\"encoding/json\"\n\t\"errors\"\n\t\"net/http\"\n\n\t\"example.com/bank/internal/core/domain\"\n\t\"example.com/bank/internal/core/ports\"\n)\n\n// Handler is a driving adapter: HTTP in, port call out. A CLI or gRPC adapter could sit beside it.\ntype Handler struct {\n\ttransfers ports.TransferUseCase\n}\n\ntype transferRequest struct {\n\tFrom  string `json:\"from\"`\n\tTo    string `json:\"to\"`\n\tCents int64  `json:\"cents\"`\n}\n\nfunc NewHandler(t ports.TransferUseCase) *Handler {\n\treturn &Handler{transfers: t}\n}\n\nfunc (h *Handler) PostTransfer(w http.ResponseWriter, r *http.Request) {\n\tvar req transferRequest\n\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil {\n\t\thttp.Error(w, \"bad json\", http.StatusBadRequest)\n\t\treturn\n\t}\n\terr := h.transfers.Transfer(req.From, req.To, req.Cents)\n\tif errors.Is(err, domain.ErrInsufficientFunds) {\n\t\thttp.Error(w, err.Error(), http.StatusUnprocessableEntity)\n\t\treturn\n\t}\n\tif err != nil {\n\t\thttp.Error(w, err.Error(), http.StatusBadRequest)\n\t\treturn\n\t}\n\tw.WriteHeader(http.StatusNoContent)\n}\n",
            "hexagonal-go-transfers/internal/adapters/memory/store.go": "package memory\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\n\t\"example.com/bank/internal/core/domain\"\n)\n\n// Store is a driven adapter backed by a map. A Postgres adapter would satisfy the same port.\ntype Store struct {\n\tmu       sync.Mutex\n\taccounts map[string]domain.Account\n}\n\nfunc NewStore() *Store {\n\treturn &Store{accounts: map[string]domain.Account{\n\t\t\"alice\": {ID: \"alice\", BalanceCents: 10000},\n\t\t\"bob\":   {ID: \"bob\", BalanceCents: 500},\n\t}}\n}\n\nfunc (s *Store) Get(id string) (*domain.Account, error) {\n\ts.mu.Lock()\n\tdefer s.mu.Unlock()\n\tacc, ok := s.accounts[id]\n\tif !ok {\n\t\treturn nil, fmt.Errorf(\"account %q not found\", id)\n\t}\n\treturn &acc, nil // a copy: the core cannot change stored data without SaveBoth\n}\n\nfunc (s *Store) SaveBoth(a, b *domain.Account) error {\n\ts.mu.Lock()\n\tdefer s.mu.Unlock()\n\ts.accounts[a.ID] = *a\n\ts.accounts[b.ID] = *b\n\treturn nil\n}\n",
            "hexagonal-go-transfers/internal/core/domain/account.go": "package domain\n\nimport \"errors\"\n\n// ErrInsufficientFunds is a business rule, so it lives in the domain.\nvar ErrInsufficientFunds = errors.New(\"insufficient funds\")\n\n// Account is a plain struct with behaviour. It has no JSON tags and no SQL.\ntype Account struct {\n\tID           string\n\tBalanceCents int64\n}\n\nfunc (a *Account) Withdraw(cents int64) error {\n\tif cents > a.BalanceCents {\n\t\treturn ErrInsufficientFunds\n\t}\n\ta.BalanceCents -= cents\n\treturn nil\n}\n\nfunc (a *Account) Deposit(cents int64) {\n\ta.BalanceCents += cents\n}\n",
            "hexagonal-go-transfers/internal/core/ports/ports.go": "package ports\n\nimport \"example.com/bank/internal/core/domain\"\n\n// TransferUseCase is the driving (primary) port: what adapters may ask the core to do.\ntype TransferUseCase interface {\n\tTransfer(from, to string, cents int64) error\n}\n\n// AccountStore is a driven (secondary) port: the core needs accounts loaded and saved.\ntype AccountStore interface {\n\tGet(id string) (*domain.Account, error)\n\tSaveBoth(a, b *domain.Account) error\n}\n\n// EventPublisher is a driven port for telling the world what happened.\ntype EventPublisher interface {\n\tMoneyMoved(from, to string, cents int64)\n}\n",
            "hexagonal-go-transfers/internal/core/services/transfer.go": "package services\n\nimport (\n\t\"errors\"\n\n\t\"example.com/bank/internal/core/ports\"\n)\n\nvar ErrSameAccount = errors.New(\"cannot transfer to the same account\")\n\n// TransferService implements the driving port using only driven ports.\ntype TransferService struct {\n\tstore  ports.AccountStore\n\tevents ports.EventPublisher\n}\n\nfunc NewTransferService(store ports.AccountStore, events ports.EventPublisher) *TransferService {\n\treturn &TransferService{store: store, events: events}\n}\n\nfunc (s *TransferService) Transfer(from, to string, cents int64) error {\n\tif from == to {\n\t\treturn ErrSameAccount\n\t}\n\tsrc, err := s.store.Get(from)\n\tif err != nil {\n\t\treturn err\n\t}\n\tdst, err := s.store.Get(to)\n\tif err != nil {\n\t\treturn err\n\t}\n\tif err := src.Withdraw(cents); err != nil {\n\t\treturn err\n\t}\n\tdst.Deposit(cents)\n\tif err := s.store.SaveBoth(src, dst); err != nil {\n\t\treturn err\n\t}\n\ts.events.MoneyMoved(from, to, cents)\n\treturn nil\n}\n"
          }
        },
        {
          "id": "hexagonal-java-booking",
          "title": "Hotel booking with real and fake adapters",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "Packages follow the well-known port/in, port/out, adapter/in, adapter/out layout. Production plugs in JDBC and an HTTP payment client; the test plugs in an in-memory list and a fake gateway and drives the very same core.",
          "roles": {
            "Domain": [
              "hexagonal-java-booking/src/main/com/example/booking/domain/Booking.java#Booking"
            ],
            "Driving Port": [
              "hexagonal-java-booking/src/main/com/example/booking/application/port/in/BookRoomUseCase.java#BookRoomUseCase"
            ],
            "Driven Port": [
              "hexagonal-java-booking/src/main/com/example/booking/application/port/out/BookingRepository.java#BookingRepository",
              "hexagonal-java-booking/src/main/com/example/booking/application/port/out/PaymentGateway.java#PaymentGateway"
            ],
            "Driving Adapter": [
              "hexagonal-java-booking/src/main/com/example/booking/adapter/in/web/BookingController.java#BookingController",
              "hexagonal-java-booking/src/test/com/example/booking/BookingServiceTest.java#BookingServiceTest"
            ],
            "Driven Adapter": [
              "hexagonal-java-booking/src/main/com/example/booking/adapter/out/persistence/JdbcBookingRepository.java#JdbcBookingRepository",
              "hexagonal-java-booking/src/main/com/example/booking/adapter/out/payment/CardPaymentGateway.java#CardPaymentGateway"
            ]
          },
          "trace": [
            {
              "at": "hexagonal-java-booking/src/main/com/example/booking/App.java#App.main",
              "say": "The composition root picks production adapters: JDBC for bookings, an HTTP client for payments."
            },
            {
              "at": "hexagonal-java-booking/src/main/com/example/booking/adapter/in/web/BookingController.java#BookingController.post",
              "say": "The web adapter builds a BookRoomCommand and calls the use-case port; it maps exceptions to 409 or 400."
            },
            {
              "at": "hexagonal-java-booking/src/main/com/example/booking/application/BookingService.java#BookingService.bookRoom",
              "say": "The core checks for overlaps, prices the stay and charges, talking to two driven ports and nothing else."
            },
            {
              "at": "hexagonal-java-booking/src/main/com/example/booking/domain/Booking.java#Booking.totalCents",
              "say": "Pricing (7+ nights get 10% off) is pure domain logic, trivially testable."
            },
            {
              "at": "hexagonal-java-booking/src/main/com/example/booking/adapter/out/payment/CardPaymentGateway.java#CardPaymentGateway.charge",
              "say": "In production the payment port is an HTTP call with an API key. None of that leaks into BookingService."
            },
            {
              "at": "hexagonal-java-booking/src/main/com/example/booking/adapter/out/persistence/JdbcBookingRepository.java#JdbcBookingRepository.save",
              "say": "SQL and column names live only in the persistence adapter."
            },
            {
              "at": "hexagonal-java-booking/src/test/com/example/booking/BookingServiceTest.java#BookingServiceTest.main",
              "say": "The test is a second driving adapter with fake driven adapters. It checks the discount and the double-booking rule with no database."
            },
            {
              "at": "hexagonal-java-booking/src/test/com/example/booking/BookingServiceTest.java#FakePayments.charge",
              "say": "The fake gateway just records the amount. Swapping it in needed zero changes to the core."
            }
          ],
          "files": {
            "hexagonal-java-booking/src/main/com/example/booking/App.java": "package com.example.booking;\n\nimport com.example.booking.adapter.in.web.BookingController;\nimport com.example.booking.adapter.out.payment.CardPaymentGateway;\nimport com.example.booking.adapter.out.persistence.JdbcBookingRepository;\nimport com.example.booking.application.BookingService;\nimport java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.util.Map;\n\n// Composition root: picks the production adapters and plugs them into the ports.\npublic class App {\n    public static void main(String[] args) throws Exception {\n        Connection db = DriverManager.getConnection(System.getenv(\"JDBC_URL\"));\n        BookingService core = new BookingService(\n            new JdbcBookingRepository(db),\n            new CardPaymentGateway(System.getenv(\"PAYMENTS_KEY\")));\n        BookingController web = new BookingController(core);\n\n        System.out.println(web.post(Map.of(\n            \"room\", \"101\", \"guest\", \"Theo\", \"from\", \"2026-10-10\", \"to\", \"2026-10-17\", \"card\", \"tok_visa\")));\n    }\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/adapter/in/web/BookingController.java": "package com.example.booking.adapter.in.web;\n\nimport com.example.booking.application.port.in.BookRoomUseCase;\nimport com.example.booking.application.port.in.BookRoomUseCase.BookRoomCommand;\nimport java.time.LocalDate;\nimport java.util.Map;\n\n// Driving adapter: translates an HTTP-ish request into the port's command and back.\npublic class BookingController {\n    private final BookRoomUseCase bookRoom;\n\n    public BookingController(BookRoomUseCase bookRoom) {\n        this.bookRoom = bookRoom;\n    }\n\n    public Response post(Map<String, String> json) {\n        try {\n            BookRoomCommand cmd = new BookRoomCommand(\n                json.get(\"room\"), json.get(\"guest\"),\n                LocalDate.parse(json.get(\"from\")), LocalDate.parse(json.get(\"to\")),\n                json.get(\"card\"));\n            return new Response(201, \"confirmed \" + bookRoom.bookRoom(cmd));\n        } catch (IllegalStateException e) {\n            return new Response(409, e.getMessage());\n        } catch (IllegalArgumentException e) {\n            return new Response(400, e.getMessage());\n        }\n    }\n\n    public record Response(int status, String body) {}\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/adapter/out/payment/CardPaymentGateway.java": "package com.example.booking.adapter.out.payment;\n\nimport com.example.booking.application.port.out.PaymentGateway;\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\n// Driven adapter: speaks a payment provider's HTTP API. The core only sees charge().\npublic class CardPaymentGateway implements PaymentGateway {\n    private final HttpClient http = HttpClient.newHttpClient();\n    private final String apiKey;\n\n    public CardPaymentGateway(String apiKey) {\n        this.apiKey = apiKey;\n    }\n\n    @Override\n    public String charge(String cardToken, long amountCents) {\n        String body = \"{\\\"source\\\":\\\"\" + cardToken + \"\\\",\\\"amount\\\":\" + amountCents + \",\\\"currency\\\":\\\"eur\\\"}\";\n        HttpRequest req = HttpRequest.newBuilder(URI.create(\"https://payments.example.com/v1/charges\"))\n            .header(\"Authorization\", \"Bearer \" + apiKey)\n            .POST(HttpRequest.BodyPublishers.ofString(body))\n            .build();\n        try {\n            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());\n            if (res.statusCode() != 200) {\n                throw new IllegalStateException(\"card declined\");\n            }\n            return res.body().replaceAll(\".*\\\"id\\\":\\\"([^\\\"]+)\\\".*\", \"$1\");\n        } catch (java.io.IOException | InterruptedException e) {\n            throw new IllegalStateException(\"payment provider unreachable\", e);\n        }\n    }\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/adapter/out/persistence/JdbcBookingRepository.java": "package com.example.booking.adapter.out.persistence;\n\nimport com.example.booking.application.port.out.BookingRepository;\nimport com.example.booking.domain.Booking;\nimport java.sql.Connection;\nimport java.sql.Date;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.SQLException;\nimport java.util.ArrayList;\nimport java.util.List;\n\n// Driven adapter: the only class that knows table names and SQL.\npublic class JdbcBookingRepository implements BookingRepository {\n    private final Connection connection;\n\n    public JdbcBookingRepository(Connection connection) {\n        this.connection = connection;\n    }\n\n    @Override\n    public List<Booking> findByRoom(String roomId) {\n        String sql = \"SELECT room_id, guest, date_from, date_to FROM bookings WHERE room_id = ?\";\n        try (PreparedStatement st = connection.prepareStatement(sql)) {\n            st.setString(1, roomId);\n            ResultSet rs = st.executeQuery();\n            List<Booking> result = new ArrayList<>();\n            while (rs.next()) {\n                result.add(new Booking(rs.getString(1), rs.getString(2),\n                    rs.getDate(3).toLocalDate(), rs.getDate(4).toLocalDate()));\n            }\n            return result;\n        } catch (SQLException e) {\n            throw new IllegalStateException(\"database error\", e);\n        }\n    }\n\n    @Override\n    public long nightlyRateCents(String roomId) {\n        try (PreparedStatement st = connection.prepareStatement(\"SELECT rate_cents FROM rooms WHERE id = ?\")) {\n            st.setString(1, roomId);\n            ResultSet rs = st.executeQuery();\n            rs.next();\n            return rs.getLong(1);\n        } catch (SQLException e) {\n            throw new IllegalStateException(\"database error\", e);\n        }\n    }\n\n    @Override\n    public void save(Booking b) {\n        String sql = \"INSERT INTO bookings (room_id, guest, date_from, date_to, payment_ref) VALUES (?, ?, ?, ?, ?)\";\n        try (PreparedStatement st = connection.prepareStatement(sql)) {\n            st.setString(1, b.roomId());\n            st.setString(2, b.guest());\n            st.setDate(3, Date.valueOf(b.from()));\n            st.setDate(4, Date.valueOf(b.to()));\n            st.setString(5, b.paymentRef());\n            st.executeUpdate();\n        } catch (SQLException e) {\n            throw new IllegalStateException(\"database error\", e);\n        }\n    }\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/application/BookingService.java": "package com.example.booking.application;\n\nimport com.example.booking.application.port.in.BookRoomUseCase;\nimport com.example.booking.application.port.out.BookingRepository;\nimport com.example.booking.application.port.out.PaymentGateway;\nimport com.example.booking.domain.Booking;\n\n// Inside the hexagon: orchestrates domain objects through ports only.\npublic class BookingService implements BookRoomUseCase {\n    private final BookingRepository bookings;\n    private final PaymentGateway payments;\n\n    public BookingService(BookingRepository bookings, PaymentGateway payments) {\n        this.bookings = bookings;\n        this.payments = payments;\n    }\n\n    @Override\n    public String bookRoom(BookRoomCommand cmd) {\n        Booking wanted = new Booking(cmd.roomId(), cmd.guest(), cmd.from(), cmd.to());\n        for (Booking existing : bookings.findByRoom(cmd.roomId())) {\n            if (existing.overlaps(wanted)) {\n                throw new IllegalStateException(\"Room \" + cmd.roomId() + \" is taken for those dates\");\n            }\n        }\n        long amount = wanted.totalCents(bookings.nightlyRateCents(cmd.roomId()));\n        wanted.confirm(payments.charge(cmd.cardToken(), amount));\n        bookings.save(wanted);\n        return wanted.paymentRef();\n    }\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/application/port/in/BookRoomUseCase.java": "package com.example.booking.application.port.in;\n\nimport java.time.LocalDate;\n\n// Driving port: the one thing the outside may ask for. Adapters depend on this, not on BookingService.\npublic interface BookRoomUseCase {\n\n    record BookRoomCommand(String roomId, String guest, LocalDate from, LocalDate to, String cardToken) {}\n\n    String bookRoom(BookRoomCommand command);\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/application/port/out/BookingRepository.java": "package com.example.booking.application.port.out;\n\nimport com.example.booking.domain.Booking;\nimport java.util.List;\n\n// Driven port, owned by the core: shaped by what the use case needs, not by the database.\npublic interface BookingRepository {\n    List<Booking> findByRoom(String roomId);\n    long nightlyRateCents(String roomId);\n    void save(Booking booking);\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/application/port/out/PaymentGateway.java": "package com.example.booking.application.port.out;\n\n// Driven port: \"take this much money\". Stripe, Adyen or a test fake can sit behind it.\npublic interface PaymentGateway {\n    String charge(String cardToken, long amountCents);\n}\n",
            "hexagonal-java-booking/src/main/com/example/booking/domain/Booking.java": "package com.example.booking.domain;\n\nimport java.time.LocalDate;\nimport java.time.temporal.ChronoUnit;\n\n// Domain object: knows how to price a stay. No annotations, no SQL, no HTTP.\npublic class Booking {\n    private final String roomId;\n    private final String guest;\n    private final LocalDate from;\n    private final LocalDate to;\n    private String paymentRef;\n\n    public Booking(String roomId, String guest, LocalDate from, LocalDate to) {\n        if (!to.isAfter(from)) {\n            throw new IllegalArgumentException(\"Stay must be at least one night\");\n        }\n        this.roomId = roomId;\n        this.guest = guest;\n        this.from = from;\n        this.to = to;\n    }\n\n    public long totalCents(long nightlyRateCents) {\n        long nights = ChronoUnit.DAYS.between(from, to);\n        long total = nights * nightlyRateCents;\n        return nights >= 7 ? total * 90 / 100 : total; // weekly discount is a business rule\n    }\n\n    public boolean overlaps(Booking other) {\n        return roomId.equals(other.roomId) && from.isBefore(other.to) && other.from.isBefore(to);\n    }\n\n    public void confirm(String paymentRef) {\n        this.paymentRef = paymentRef;\n    }\n\n    public String roomId() {\n        return roomId;\n    }\n\n    public String guest() {\n        return guest;\n    }\n\n    public LocalDate from() {\n        return from;\n    }\n\n    public LocalDate to() {\n        return to;\n    }\n\n    public String paymentRef() {\n        return paymentRef;\n    }\n}\n",
            "hexagonal-java-booking/src/test/com/example/booking/BookingServiceTest.java": "package com.example.booking;\n\nimport com.example.booking.application.BookingService;\nimport com.example.booking.application.port.in.BookRoomUseCase.BookRoomCommand;\nimport com.example.booking.application.port.out.BookingRepository;\nimport com.example.booking.application.port.out.PaymentGateway;\nimport com.example.booking.domain.Booking;\nimport java.time.LocalDate;\nimport java.util.ArrayList;\nimport java.util.List;\n\n// A test is just another driving adapter, and fakes are just more driven adapters. No DB, no network.\npublic class BookingServiceTest {\n\n    static class InMemoryBookings implements BookingRepository {\n        final List<Booking> saved = new ArrayList<>();\n\n        public List<Booking> findByRoom(String roomId) {\n            return saved.stream().filter(b -> b.roomId().equals(roomId)).toList();\n        }\n\n        public long nightlyRateCents(String roomId) {\n            return 10000;\n        }\n\n        public void save(Booking booking) {\n            saved.add(booking);\n        }\n    }\n\n    static class FakePayments implements PaymentGateway {\n        long charged;\n\n        public String charge(String cardToken, long amountCents) {\n            charged = amountCents;\n            return \"fake-123\";\n        }\n    }\n\n    public static void main(String[] args) {\n        InMemoryBookings bookings = new InMemoryBookings();\n        FakePayments payments = new FakePayments();\n        BookingService service = new BookingService(bookings, payments);\n\n        service.bookRoom(new BookRoomCommand(\"101\", \"Ana\",\n            LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 8), \"tok\"));\n        if (payments.charged != 63000) throw new AssertionError(\"weekly discount not applied\");\n\n        try {\n            service.bookRoom(new BookRoomCommand(\"101\", \"Ben\",\n                LocalDate.of(2026, 10, 5), LocalDate.of(2026, 10, 6), \"tok\"));\n            throw new AssertionError(\"double booking allowed\");\n        } catch (IllegalStateException expected) {\n            System.out.println(\"ok: \" + expected.getMessage());\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "clean-architecture",
      "name": "Clean Architecture",
      "family": "Architecture",
      "aka": [
        "Onion Architecture (close cousin)",
        "The Dependency Rule"
      ],
      "tagline": "Concentric rings where source code dependencies only point inward, toward business rules.",
      "intent": "Organise code in rings: entities (business rules) in the middle, use cases (application rules) around them, interface adapters (controllers, presenters, gateways) next, and frameworks and drivers (web server, database driver, UI) outside. The Dependency Rule says code may only depend on rings further in; when an inner ring must call outward it declares an interface and the outer ring implements it.",
      "analogy": "A restaurant kitchen: the recipes (entities) do not care which waiter takes the order, the head chef's workflow (use cases) does not care whether the order came by phone or app, and the front desk and delivery apps (adapters, frameworks) can change every year.",
      "cityShape": "Look for districts named after the rings (entities/ or Domain/, use-cases/ or Application/, adapters/ or Adapter/, frameworks/ or public/ or app/). Import arcs flow one way: from the outer districts toward the entities building, which has no outgoing arcs at all. The use-case building's execute floor fans pipes to interface methods that outer buildings implement.",
      "roles": [
        {
          "name": "Entity",
          "desc": "Enterprise-wide business rules and data (a loyalty card, an event with seats, an article). Depends on nothing."
        },
        {
          "name": "Use Case",
          "desc": "Application-specific rules: one interactor per action (AddStamp, ReserveSeat). Orchestrates entities through boundaries."
        },
        {
          "name": "Boundary",
          "desc": "Interfaces and plain data structures declared by an inner ring (gateways, output ports, request/response models) so outer rings can plug in."
        },
        {
          "name": "Interface Adapter",
          "desc": "Controllers, presenters and gateways that convert between the use cases' format and the outside world's format (HTTP params, JSON, SQL rows)."
        },
        {
          "name": "Framework & Driver",
          "desc": "The outermost glue: web server, database driver, CLI, main(). Wires everything together and contains as little logic as possible."
        }
      ],
      "whenToUse": [
        "A product with real business rules expected to outlive its framework, database or delivery mechanism.",
        "Several delivery mechanisms (REST, CLI, jobs) must run the same use cases with the same rules.",
        "Teams want to test use cases in milliseconds, without web servers or databases."
      ],
      "pitfalls": [
        "Ring-shaped folders with dependencies still pointing outward (an entity importing the ORM) give the ceremony without the benefit; check the import arrows, not folder names.",
        "Mapping the same data through request models, entities, DTOs and view models for a simple CRUD screen costs more than it saves.",
        "Treating the four rings as a fixed recipe; the rule is about dependency direction, and small apps can merge rings."
      ],
      "related": [
        "hexagonal",
        "dependency-inversion",
        "repository",
        "mvc",
        "dependency-injection"
      ],
      "quiz": [
        {
          "q": "The ReserveSeat use case must save a reservation to MySQL. How does it do that without breaking the Dependency Rule?",
          "options": [
            "It imports PDO directly",
            "It calls an EventGateway interface that the use-case layer declares and an adapter implements",
            "It returns SQL for the controller to run",
            "It extends the database class"
          ],
          "answer": 1,
          "why": "The inner ring declares the interface it needs; the outer ring implements it. The source-code arrow points inward even though control flows outward at runtime."
        },
        {
          "q": "Which change should require editing the Entity ring?",
          "options": [
            "Switching from MySQL to Postgres",
            "Returning XML instead of JSON",
            "Changing how many stamps earn a free coffee",
            "Moving from Express to Fastify"
          ],
          "answer": 2,
          "why": "Entities hold business rules. Storage, formats and frameworks are outer-ring details and should change without touching them."
        }
      ],
      "demos": [
        {
          "id": "clean-architecture-ts-loyalty",
          "title": "Coffee loyalty card",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Every 10th coffee is free. Four folders, four rings: entities, use-cases, adapters, frameworks. Notice that the use case does not return a string: it pushes a response into an output port and a presenter formats it.",
          "roles": {
            "Entity": [
              "clean-architecture-ts-loyalty/entities/loyalty-card.ts#LoyaltyCard"
            ],
            "Use Case": [
              "clean-architecture-ts-loyalty/use-cases/add-stamp.ts#AddStamp"
            ],
            "Boundary": [
              "clean-architecture-ts-loyalty/use-cases/ports.ts#CardGateway",
              "clean-architecture-ts-loyalty/use-cases/ports.ts#AddStampOutput",
              "clean-architecture-ts-loyalty/use-cases/ports.ts#AddStampResponse"
            ],
            "Interface Adapter": [
              "clean-architecture-ts-loyalty/adapters/stamp-controller.ts#StampController",
              "clean-architecture-ts-loyalty/adapters/console-presenter.ts#ConsolePresenter",
              "clean-architecture-ts-loyalty/adapters/in-memory-card-gateway.ts#InMemoryCardGateway"
            ],
            "Framework & Driver": [
              "clean-architecture-ts-loyalty/frameworks/cli.ts#runCli"
            ]
          },
          "trace": [
            {
              "at": "clean-architecture-ts-loyalty/frameworks/cli.ts#runCli",
              "say": "The outermost ring builds everything: gateway and presenter go into the use case, the use case into the controller."
            },
            {
              "at": "clean-architecture-ts-loyalty/adapters/stamp-controller.ts#StampController.handle",
              "say": "The controller cleans raw argv input ('  Ana ' becomes 'ana') and calls the use case. It holds no business rule."
            },
            {
              "at": "clean-architecture-ts-loyalty/use-cases/add-stamp.ts#AddStamp.execute",
              "say": "The use case loads the card through the CardGateway interface it declared itself, then lets the entity decide."
            },
            {
              "at": "clean-architecture-ts-loyalty/adapters/in-memory-card-gateway.ts#InMemoryCardGateway.findOrCreate",
              "say": "The gateway turns a stored number back into an entity. A SQL gateway would do the same with rows."
            },
            {
              "at": "clean-architecture-ts-loyalty/entities/loyalty-card.ts#LoyaltyCard.addStamp",
              "say": "The core rule, 'the 10th coffee is free', lives in the innermost ring and imports nothing."
            },
            {
              "at": "clean-architecture-ts-loyalty/use-cases/add-stamp.ts#AddStamp.execute",
              "say": "The use case saves the card and sends a plain response object to its output port, not a formatted string."
            },
            {
              "at": "clean-architecture-ts-loyalty/adapters/console-presenter.ts#ConsolePresenter.present",
              "say": "The presenter chooses the wording. A web presenter could build JSON from the same response."
            }
          ],
          "files": {
            "clean-architecture-ts-loyalty/adapters/console-presenter.ts": "import { AddStampOutput, AddStampResponse } from '../use-cases/ports';\n\n// Interface adapter (presenter): turns the use case's response into text for this UI.\nexport class ConsolePresenter implements AddStampOutput {\n  message = '';\n\n  present(r: AddStampResponse): void {\n    this.message = r.freeCoffee\n      ? 'Enjoy your FREE coffee, ' + r.customerId + '!'\n      : r.customerId + ' has ' + r.stamps + '/9 stamps';\n  }\n}\n",
            "clean-architecture-ts-loyalty/adapters/in-memory-card-gateway.ts": "import { LoyaltyCard } from '../entities/loyalty-card';\nimport { CardGateway } from '../use-cases/ports';\n\n// Interface adapter (gateway): converts between entities and whatever storage format we use.\nexport class InMemoryCardGateway implements CardGateway {\n  private rows = new Map<string, number>();\n\n  findOrCreate(customerId: string): LoyaltyCard {\n    return new LoyaltyCard(customerId, this.rows.get(customerId) ?? 0);\n  }\n\n  save(card: LoyaltyCard): void {\n    this.rows.set(card.customerId, card.stampCount());\n  }\n}\n",
            "clean-architecture-ts-loyalty/adapters/stamp-controller.ts": "import { AddStamp } from '../use-cases/add-stamp';\n\n// Interface adapter (controller): cleans raw input and calls the use case.\nexport class StampController {\n  constructor(private addStamp: AddStamp) {}\n\n  handle(rawArgs: string[]): void {\n    const customerId = (rawArgs[0] ?? '').trim().toLowerCase();\n    if (customerId === '') throw new Error('usage: stamp <customer>');\n    this.addStamp.execute(customerId);\n  }\n}\n",
            "clean-architecture-ts-loyalty/entities/loyalty-card.ts": "// Entity: the innermost circle. Pure business rules that would exist even without software.\nexport const STAMPS_FOR_FREE_COFFEE = 9;\n\nexport class LoyaltyCard {\n  constructor(public readonly customerId: string, private stamps: number = 0) {}\n\n  addStamp(): boolean {\n    this.stamps += 1;\n    if (this.stamps > STAMPS_FOR_FREE_COFFEE) {\n      this.stamps = 0;\n      return true; // the 10th coffee is free\n    }\n    return false;\n  }\n\n  stampCount(): number {\n    return this.stamps;\n  }\n}\n",
            "clean-architecture-ts-loyalty/frameworks/cli.ts": "import { InMemoryCardGateway } from '../adapters/in-memory-card-gateway';\nimport { ConsolePresenter } from '../adapters/console-presenter';\nimport { StampController } from '../adapters/stamp-controller';\nimport { AddStamp } from '../use-cases/add-stamp';\n\n// Frameworks & drivers: the outermost ring. The console, argv and wiring live here.\nexport function runCli(argv: string[]): void {\n  const gateway = new InMemoryCardGateway();\n  const presenter = new ConsolePresenter();\n  const controller = new StampController(new AddStamp(gateway, presenter));\n\n  for (let i = 0; i < 10; i++) {\n    controller.handle(argv);\n    console.log(presenter.message);\n  }\n}\n\nrunCli(process.argv.slice(2));\n",
            "clean-architecture-ts-loyalty/use-cases/add-stamp.ts": "import { AddStampOutput, CardGateway } from './ports';\n\n// Use case: application rules. It knows entities and its own ports, never Express, SQL or console.\nexport class AddStamp {\n  constructor(private cards: CardGateway, private output: AddStampOutput) {}\n\n  execute(customerId: string): void {\n    const card = this.cards.findOrCreate(customerId);\n    const freeCoffee = card.addStamp();\n    this.cards.save(card);\n    this.output.present({ customerId, stamps: card.stampCount(), freeCoffee });\n  }\n}\n",
            "clean-architecture-ts-loyalty/use-cases/ports.ts": "import { LoyaltyCard } from '../entities/loyalty-card';\n\n// Boundaries are declared by the use-case layer. Outer layers implement them.\nexport interface CardGateway {\n  findOrCreate(customerId: string): LoyaltyCard;\n  save(card: LoyaltyCard): void;\n}\n\nexport interface AddStampResponse {\n  customerId: string;\n  stamps: number;\n  freeCoffee: boolean;\n}\n\nexport interface AddStampOutput {\n  present(response: AddStampResponse): void;\n}\n"
          }
        },
        {
          "id": "clean-architecture-php-tickets",
          "title": "Event tickets: interactor, presenter, gateway",
          "lang": "PHP",
          "level": "intermediate",
          "source": null,
          "story": "Reserving seats for a concert, laid out as Domain, Application, Adapter and public/. The ReserveSeat interactor never returns HTTP: it calls reserved() or rejected() on an output port, and JsonPresenter decides status codes.",
          "roles": {
            "Entity": [
              "clean-architecture-php-tickets/src/Domain/Event.php#Event"
            ],
            "Use Case": [
              "clean-architecture-php-tickets/src/Application/ReserveSeat.php#ReserveSeat"
            ],
            "Boundary": [
              "clean-architecture-php-tickets/src/Application/Port/EventGateway.php#EventGateway",
              "clean-architecture-php-tickets/src/Application/Port/ReserveSeatOutput.php#ReserveSeatOutput",
              "clean-architecture-php-tickets/src/Application/ReserveSeatResponse.php#ReserveSeatResponse"
            ],
            "Interface Adapter": [
              "clean-architecture-php-tickets/src/Adapter/Http/ReservationController.php#ReservationController",
              "clean-architecture-php-tickets/src/Adapter/Http/JsonPresenter.php#JsonPresenter",
              "clean-architecture-php-tickets/src/Adapter/Persistence/PdoEventGateway.php#PdoEventGateway"
            ],
            "Framework & Driver": [
              "clean-architecture-php-tickets/public/index.php#handleRequest"
            ]
          },
          "trace": [
            {
              "at": "clean-architecture-php-tickets/public/index.php#handleRequest",
              "say": "The driver ring: PDO, routing by regex, http_response_code and echo. It wires adapters around the interactor."
            },
            {
              "at": "clean-architecture-php-tickets/src/Adapter/Http/ReservationController.php#ReservationController.post",
              "say": "The controller converts strings from the URL and form into typed input for the use case."
            },
            {
              "at": "clean-architecture-php-tickets/src/Application/ReserveSeat.php#ReserveSeat.execute",
              "say": "The interactor asks the EventGateway port for the event. Application rules like 'missing event is rejected' live here."
            },
            {
              "at": "clean-architecture-php-tickets/src/Adapter/Persistence/PdoEventGateway.php#PdoEventGateway.byId",
              "say": "The gateway runs SQL and builds an Event entity from the row. SQL never crosses into the inner rings."
            },
            {
              "at": "clean-architecture-php-tickets/src/Domain/Event.php#Event.reserve",
              "say": "The entity enforces 1 to 6 seats and capacity. These rules hold for any app that sells these tickets."
            },
            {
              "at": "clean-architecture-php-tickets/src/Adapter/Persistence/PdoEventGateway.php#PdoEventGateway.saveReservation",
              "say": "Saving uses a transaction and returns a confirmation code: a storage detail hidden behind the port."
            },
            {
              "at": "clean-architecture-php-tickets/src/Adapter/Http/JsonPresenter.php#JsonPresenter.reserved",
              "say": "The interactor hands a ReserveSeatResponse to the output port; the presenter chooses 201 and the JSON shape."
            },
            {
              "at": "clean-architecture-php-tickets/src/Adapter/Http/JsonPresenter.php#JsonPresenter.rejected",
              "say": "Domain errors arrive as rejected(reason). Only the presenter knows that this means HTTP 422."
            }
          ],
          "files": {
            "clean-architecture-php-tickets/public/index.php": "<?php\ndeclare(strict_types=1);\n\n// Frameworks & drivers: the web server entry point, the database driver and the wiring.\nrequire __DIR__ . '/../vendor/autoload.php';\n\nuse Tickets\\Adapter\\Http\\JsonPresenter;\nuse Tickets\\Adapter\\Http\\ReservationController;\nuse Tickets\\Adapter\\Persistence\\PdoEventGateway;\nuse Tickets\\Application\\ReserveSeat;\n\nfunction handleRequest(string $method, string $path, array $body): void\n{\n    $pdo = new PDO(getenv('DATABASE_DSN') ?: 'sqlite:' . __DIR__ . '/../tickets.db');\n    $presenter = new JsonPresenter();\n    $controller = new ReservationController(new ReserveSeat(new PdoEventGateway($pdo), $presenter));\n\n    if ($method === 'POST' && preg_match('#^/events/(\\d+)/reservations$#', $path, $m)) {\n        $controller->post(['id' => $m[1]], $body);\n    } else {\n        $presenter->rejected('Not found');\n        $presenter->status = 404;\n    }\n\n    http_response_code($presenter->status);\n    header('Content-Type: application/json');\n    echo json_encode($presenter->body);\n}\n\nhandleRequest($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), $_POST);\n",
            "clean-architecture-php-tickets/src/Adapter/Http/JsonPresenter.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Adapter\\Http;\n\nuse Tickets\\Application\\Port\\ReserveSeatOutput;\nuse Tickets\\Application\\ReserveSeatResponse;\n\n// Presenter (interface adapter): converts the use case's output into the web's format.\nclass JsonPresenter implements ReserveSeatOutput {\n    public int $status = 500;\n    public array $body = [];\n\n    public function reserved(ReserveSeatResponse $r): void\n    {\n        $this->status = 201;\n        $this->body = [\n            'code' => $r->confirmationCode,\n            'message' => \"{$r->seats} seat(s) for {$r->eventTitle}\",\n            'seats_left' => $r->seatsLeft,\n        ];\n    }\n\n    public function rejected(string $reason): void\n    {\n        $this->status = 422;\n        $this->body = ['error' => $reason];\n    }\n}\n",
            "clean-architecture-php-tickets/src/Adapter/Http/ReservationController.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Adapter\\Http;\n\nuse Tickets\\Application\\ReserveSeat;\n\n// Controller (interface adapter): converts the web's format (arrays of strings) into use-case input.\nclass ReservationController\n{\n    public function __construct(private ReserveSeat $reserveSeat)\n    {\n    }\n\n    public function post(array $routeParams, array $body): void\n    {\n        $this->reserveSeat->execute(\n            (int) $routeParams['id'],\n            trim((string) ($body['email'] ?? '')),\n            (int) ($body['seats'] ?? 0),\n        );\n    }\n}\n",
            "clean-architecture-php-tickets/src/Adapter/Persistence/PdoEventGateway.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Adapter\\Persistence;\n\nuse PDO;\nuse Tickets\\Application\\Port\\EventGateway;\nuse Tickets\\Domain\\Event;\n\n// Gateway (interface adapter): converts between rows and entities. SQL lives only here.\nclass PdoEventGateway implements EventGateway {\n    public function __construct(private PDO $pdo)\n    {\n    }\n\n    public function byId(int $id): ?Event\n    {\n        $st = $this->pdo->prepare('SELECT id, title, capacity, reserved FROM events WHERE id = ?');\n        $st->execute([$id]);\n        $row = $st->fetch(PDO::FETCH_ASSOC);\n        if ($row === false) {\n            return null;\n        }\n        return new Event((int) $row['id'], $row['title'], (int) $row['capacity'], (int) $row['reserved']);\n    }\n\n    public function saveReservation(Event $event, string $email, int $seats): string\n    {\n        $code = strtoupper(bin2hex(random_bytes(4)));\n        $this->pdo->beginTransaction();\n        $this->pdo->prepare('UPDATE events SET reserved = ? WHERE id = ?')\n            ->execute([$event->reservedCount(), $event->id]);\n        $this->pdo->prepare('INSERT INTO reservations (code, event_id, email, seats) VALUES (?, ?, ?, ?)')\n            ->execute([$code, $event->id, $email, $seats]);\n        $this->pdo->commit();\n        return $code;\n    }\n}\n",
            "clean-architecture-php-tickets/src/Application/Port/EventGateway.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Application\\Port;\n\nuse Tickets\\Domain\\Event;\n\n// Output boundary toward data: declared here, implemented in the adapter ring.\ninterface EventGateway\n{\n    public function byId(int $id): ?Event;\n\n    public function saveReservation(Event $event, string $email, int $seats): string;\n}\n",
            "clean-architecture-php-tickets/src/Application/Port/ReserveSeatOutput.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Application\\Port;\n\nuse Tickets\\Application\\ReserveSeatResponse;\n\n// Output boundary toward the UI: the use case pushes results here instead of returning HTML or JSON.\ninterface ReserveSeatOutput\n{\n    public function reserved(ReserveSeatResponse $response): void;\n\n    public function rejected(string $reason): void;\n}\n",
            "clean-architecture-php-tickets/src/Application/ReserveSeat.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Application;\n\nuse Tickets\\Application\\Port\\EventGateway;\nuse Tickets\\Application\\Port\\ReserveSeatOutput;\n\n// Use case interactor: application rules. Depends inward (Domain) and on its own ports only.\nclass ReserveSeat\n{\n    public function __construct(\n        private EventGateway $events,\n        private ReserveSeatOutput $output,\n    ) {\n    }\n\n    public function execute(int $eventId, string $email, int $seats): void\n    {\n        $event = $this->events->byId($eventId);\n        if ($event === null) {\n            $this->output->rejected('No such event');\n            return;\n        }\n        try {\n            $event->reserve($seats);\n        } catch (\\DomainException $e) {\n            $this->output->rejected($e->getMessage());\n            return;\n        }\n        $code = $this->events->saveReservation($event, $email, $seats);\n        $this->output->reserved(new ReserveSeatResponse($code, $event->title, $seats, $event->seatsLeft()));\n    }\n}\n",
            "clean-architecture-php-tickets/src/Application/ReserveSeatResponse.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Application;\n\n// Plain data crossing the boundary outward. No entity leaks out.\nclass ReserveSeatResponse\n{\n    public function __construct(\n        public readonly string $confirmationCode,\n        public readonly string $eventTitle,\n        public readonly int $seats,\n        public readonly int $seatsLeft,\n    ) {\n    }\n}\n",
            "clean-architecture-php-tickets/src/Domain/Event.php": "<?php\ndeclare(strict_types=1);\n\nnamespace Tickets\\Domain;\n\n// Entity: enterprise rules about an event. No PDO, no HTTP, no JSON.\nclass Event\n{\n    public function __construct(\n        public readonly int $id,\n        public readonly string $title,\n        private int $capacity,\n        private int $reserved,\n    ) {\n    }\n\n    public function seatsLeft(): int\n    {\n        return $this->capacity - $this->reserved;\n    }\n\n    public function reserve(int $seats): void\n    {\n        if ($seats < 1 || $seats > 6) {\n            throw new \\DomainException('You can reserve 1 to 6 seats at a time');\n        }\n        if ($seats > $this->seatsLeft()) {\n            throw new \\DomainException('Only ' . $this->seatsLeft() . ' seats left');\n        }\n        $this->reserved += $seats;\n    }\n\n    public function reservedCount(): int\n    {\n        return $this->reserved;\n    }\n}\n"
          }
        },
        {
          "id": "clean-architecture-go-articles-real",
          "title": "go-clean-arch: an article REST API",
          "lang": "Go",
          "level": "intermediate",
          "source": {
            "repo": "bxcodec/go-clean-arch",
            "url": "https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/article/service.go",
            "license": "MIT",
            "note": "Eight files verbatim from master at commit e06c6d0 (v4 layout); internal/repository/mysql/article.go has Delete and Update trimmed. Tests, mocks, middleware and helpers were left out."
          },
          "story": "One of the most-starred Clean Architecture examples in Go. domain/ holds entities, article/ holds the use case and declares the repository interfaces it needs, internal/rest and internal/repository/mysql are adapters, and app/main.go is the driver that wires them.",
          "roles": {
            "Entity": [
              "clean-architecture-go-articles-real/domain/article.go#Article",
              "clean-architecture-go-articles-real/domain/author.go#Author"
            ],
            "Use Case": [
              "clean-architecture-go-articles-real/article/service.go#Service"
            ],
            "Boundary": [
              "clean-architecture-go-articles-real/article/service.go#ArticleRepository",
              "clean-architecture-go-articles-real/article/service.go#AuthorRepository",
              "clean-architecture-go-articles-real/internal/rest/article.go#ArticleService"
            ],
            "Interface Adapter": [
              "clean-architecture-go-articles-real/internal/rest/article.go#ArticleHandler",
              "clean-architecture-go-articles-real/internal/repository/mysql/article.go#ArticleRepository",
              "clean-architecture-go-articles-real/internal/repository/mysql/author.go#AuthorRepository"
            ],
            "Framework & Driver": [
              "clean-architecture-go-articles-real/app/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "clean-architecture-go-articles-real/app/main.go#main",
              "say": "The driver opens MySQL and Echo, builds the two mysql repositories, passes them to article.NewService and registers the REST handler."
            },
            {
              "at": "clean-architecture-go-articles-real/internal/rest/article.go#NewArticleHandler",
              "say": "The handler depends on an ArticleService interface declared right here in the rest package: Go's consumer-side interfaces keep the arrow pointing inward."
            },
            {
              "at": "clean-architecture-go-articles-real/internal/rest/article.go#ArticleHandler.Store",
              "say": "POST /articles: the adapter binds JSON into a domain.Article, validates it and calls the use case."
            },
            {
              "at": "clean-architecture-go-articles-real/article/service.go#Service.Store",
              "say": "The use case rule: a title must be unique, so it looks the title up first and returns domain.ErrConflict if it exists."
            },
            {
              "at": "clean-architecture-go-articles-real/article/service.go#Service.GetByTitle",
              "say": "Lookups go through the ArticleRepository and AuthorRepository interfaces that the article package itself declares."
            },
            {
              "at": "clean-architecture-go-articles-real/internal/repository/mysql/article.go#ArticleRepository.Store",
              "say": "The mysql adapter implements that interface implicitly. SQL and LastInsertId stay in this outer ring."
            },
            {
              "at": "clean-architecture-go-articles-real/internal/rest/article.go#getStatusCode",
              "say": "Domain errors (ErrNotFound, ErrConflict) are translated to HTTP codes only in the REST adapter."
            },
            {
              "at": "clean-architecture-go-articles-real/article/service.go#Service.fillAuthorDetails",
              "say": "Fetch enriches articles with authors concurrently via errgroup: orchestration across two repositories is use-case work."
            }
          ],
          "files": {
            "clean-architecture-go-articles-real/app/main.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/app/main.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage main\n\nimport (\n\t\"database/sql\"\n\t\"fmt\"\n\t\"log\"\n\t\"net/url\"\n\t\"os\"\n\t\"strconv\"\n\t\"time\"\n\n\t_ \"github.com/go-sql-driver/mysql\"\n\t\"github.com/labstack/echo/v4\"\n\n\tmysqlRepo \"github.com/bxcodec/go-clean-arch/internal/repository/mysql\"\n\n\t\"github.com/bxcodec/go-clean-arch/article\"\n\t\"github.com/bxcodec/go-clean-arch/internal/rest\"\n\t\"github.com/bxcodec/go-clean-arch/internal/rest/middleware\"\n\t\"github.com/joho/godotenv\"\n)\n\nconst (\n\tdefaultTimeout = 30\n\tdefaultAddress = \":9090\"\n)\n\nfunc init() {\n\terr := godotenv.Load()\n\tif err != nil {\n\t\tlog.Fatal(\"Error loading .env file\")\n\t}\n}\n\nfunc main() {\n\t//prepare database\n\tdbHost := os.Getenv(\"DATABASE_HOST\")\n\tdbPort := os.Getenv(\"DATABASE_PORT\")\n\tdbUser := os.Getenv(\"DATABASE_USER\")\n\tdbPass := os.Getenv(\"DATABASE_PASS\")\n\tdbName := os.Getenv(\"DATABASE_NAME\")\n\tconnection := fmt.Sprintf(\"%s:%s@tcp(%s:%s)/%s\", dbUser, dbPass, dbHost, dbPort, dbName)\n\tval := url.Values{}\n\tval.Add(\"parseTime\", \"1\")\n\tval.Add(\"loc\", \"Asia/Jakarta\")\n\tdsn := fmt.Sprintf(\"%s?%s\", connection, val.Encode())\n\tdbConn, err := sql.Open(`mysql`, dsn)\n\tif err != nil {\n\t\tlog.Fatal(\"failed to open connection to database\", err)\n\t}\n\terr = dbConn.Ping()\n\tif err != nil {\n\t\tlog.Fatal(\"failed to ping database \", err)\n\t}\n\n\tdefer func() {\n\t\terr := dbConn.Close()\n\t\tif err != nil {\n\t\t\tlog.Fatal(\"got error when closing the DB connection\", err)\n\t\t}\n\t}()\n\t// prepare echo\n\n\te := echo.New()\n\te.Use(middleware.CORS)\n\ttimeoutStr := os.Getenv(\"CONTEXT_TIMEOUT\")\n\ttimeout, err := strconv.Atoi(timeoutStr)\n\tif err != nil {\n\t\tlog.Println(\"failed to parse timeout, using default timeout\")\n\t\ttimeout = defaultTimeout\n\t}\n\ttimeoutContext := time.Duration(timeout) * time.Second\n\te.Use(middleware.SetRequestContextWithTimeout(timeoutContext))\n\n\t// Prepare Repository\n\tauthorRepo := mysqlRepo.NewAuthorRepository(dbConn)\n\tarticleRepo := mysqlRepo.NewArticleRepository(dbConn)\n\n\t// Build service Layer\n\tsvc := article.NewService(articleRepo, authorRepo)\n\trest.NewArticleHandler(e, svc)\n\n\t// Start Server\n\taddress := os.Getenv(\"SERVER_ADDRESS\")\n\tif address == \"\" {\n\t\taddress = defaultAddress\n\t}\n\tlog.Fatal(e.Start(address)) //nolint\n}\n",
            "clean-architecture-go-articles-real/article/service.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/article/service.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage article\n\nimport (\n\t\"context\"\n\t\"time\"\n\n\t\"github.com/sirupsen/logrus\"\n\t\"golang.org/x/sync/errgroup\"\n\n\t\"github.com/bxcodec/go-clean-arch/domain\"\n)\n\n// ArticleRepository represent the article's repository contract\n//\n//go:generate mockery --name ArticleRepository\ntype ArticleRepository interface {\n\tFetch(ctx context.Context, cursor string, num int64) (res []domain.Article, nextCursor string, err error)\n\tGetByID(ctx context.Context, id int64) (domain.Article, error)\n\tGetByTitle(ctx context.Context, title string) (domain.Article, error)\n\tUpdate(ctx context.Context, ar *domain.Article) error\n\tStore(ctx context.Context, a *domain.Article) error\n\tDelete(ctx context.Context, id int64) error\n}\n\n// AuthorRepository represent the author's repository contract\n//\n//go:generate mockery --name AuthorRepository\ntype AuthorRepository interface {\n\tGetByID(ctx context.Context, id int64) (domain.Author, error)\n}\n\ntype Service struct {\n\tarticleRepo ArticleRepository\n\tauthorRepo  AuthorRepository\n}\n\n// NewService will create a new article service object\nfunc NewService(a ArticleRepository, ar AuthorRepository) *Service {\n\treturn &Service{\n\t\tarticleRepo: a,\n\t\tauthorRepo:  ar,\n\t}\n}\n\n/*\n* In this function below, I'm using errgroup with the pipeline pattern\n* Look how this works in this package explanation\n* in godoc: https://godoc.org/golang.org/x/sync/errgroup#ex-Group--Pipeline\n */\nfunc (a *Service) fillAuthorDetails(ctx context.Context, data []domain.Article) ([]domain.Article, error) {\n\tg, ctx := errgroup.WithContext(ctx)\n\t// Get the author's id\n\tmapAuthors := map[int64]domain.Author{}\n\n\tfor _, article := range data { //nolint\n\t\tmapAuthors[article.Author.ID] = domain.Author{}\n\t}\n\t// Using goroutine to fetch the author's detail\n\tchanAuthor := make(chan domain.Author)\n\tfor authorID := range mapAuthors {\n\t\tauthorID := authorID\n\t\tg.Go(func() error {\n\t\t\tres, err := a.authorRepo.GetByID(ctx, authorID)\n\t\t\tif err != nil {\n\t\t\t\treturn err\n\t\t\t}\n\t\t\tchanAuthor <- res\n\t\t\treturn nil\n\t\t})\n\t}\n\n\tgo func() {\n\t\tdefer close(chanAuthor)\n\t\terr := g.Wait()\n\t\tif err != nil {\n\t\t\tlogrus.Error(err)\n\t\t\treturn\n\t\t}\n\n\t}()\n\n\tfor author := range chanAuthor {\n\t\tif author != (domain.Author{}) {\n\t\t\tmapAuthors[author.ID] = author\n\t\t}\n\t}\n\n\tif err := g.Wait(); err != nil {\n\t\treturn nil, err\n\t}\n\n\t// merge the author's data\n\tfor index, item := range data { //nolint\n\t\tif a, ok := mapAuthors[item.Author.ID]; ok {\n\t\t\tdata[index].Author = a\n\t\t}\n\t}\n\treturn data, nil\n}\n\nfunc (a *Service) Fetch(ctx context.Context, cursor string, num int64) (res []domain.Article, nextCursor string, err error) {\n\tres, nextCursor, err = a.articleRepo.Fetch(ctx, cursor, num)\n\tif err != nil {\n\t\treturn nil, \"\", err\n\t}\n\n\tres, err = a.fillAuthorDetails(ctx, res)\n\tif err != nil {\n\t\tnextCursor = \"\"\n\t}\n\treturn\n}\n\nfunc (a *Service) GetByID(ctx context.Context, id int64) (res domain.Article, err error) {\n\tres, err = a.articleRepo.GetByID(ctx, id)\n\tif err != nil {\n\t\treturn\n\t}\n\n\tresAuthor, err := a.authorRepo.GetByID(ctx, res.Author.ID)\n\tif err != nil {\n\t\treturn domain.Article{}, err\n\t}\n\tres.Author = resAuthor\n\treturn\n}\n\nfunc (a *Service) Update(ctx context.Context, ar *domain.Article) (err error) {\n\tar.UpdatedAt = time.Now()\n\treturn a.articleRepo.Update(ctx, ar)\n}\n\nfunc (a *Service) GetByTitle(ctx context.Context, title string) (res domain.Article, err error) {\n\tres, err = a.articleRepo.GetByTitle(ctx, title)\n\tif err != nil {\n\t\treturn\n\t}\n\n\tresAuthor, err := a.authorRepo.GetByID(ctx, res.Author.ID)\n\tif err != nil {\n\t\treturn domain.Article{}, err\n\t}\n\n\tres.Author = resAuthor\n\treturn\n}\n\nfunc (a *Service) Store(ctx context.Context, m *domain.Article) (err error) {\n\texistedArticle, _ := a.GetByTitle(ctx, m.Title) // ignore if any error\n\tif existedArticle != (domain.Article{}) {\n\t\treturn domain.ErrConflict\n\t}\n\n\terr = a.articleRepo.Store(ctx, m)\n\treturn\n}\n\nfunc (a *Service) Delete(ctx context.Context, id int64) (err error) {\n\texistedArticle, err := a.articleRepo.GetByID(ctx, id)\n\tif err != nil {\n\t\treturn\n\t}\n\tif existedArticle == (domain.Article{}) {\n\t\treturn domain.ErrNotFound\n\t}\n\treturn a.articleRepo.Delete(ctx, id)\n}\n",
            "clean-architecture-go-articles-real/domain/article.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/domain/article.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage domain\n\nimport (\n\t\"time\"\n)\n\n// Article is representing the Article data struct\ntype Article struct {\n\tID        int64     `json:\"id\"`\n\tTitle     string    `json:\"title\" validate:\"required\"`\n\tContent   string    `json:\"content\" validate:\"required\"`\n\tAuthor    Author    `json:\"author\"`\n\tUpdatedAt time.Time `json:\"updated_at\"`\n\tCreatedAt time.Time `json:\"created_at\"`\n}\n",
            "clean-architecture-go-articles-real/domain/author.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/domain/author.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage domain\n\n// Author representing the Author data struct\ntype Author struct {\n\tID        int64  `json:\"id\"`\n\tName      string `json:\"name\"`\n\tCreatedAt string `json:\"created_at\"`\n\tUpdatedAt string `json:\"updated_at\"`\n}\n",
            "clean-architecture-go-articles-real/domain/errors.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/domain/errors.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage domain\n\nimport \"errors\"\n\nvar (\n\t// ErrInternalServerError will throw if any the Internal Server Error happen\n\tErrInternalServerError = errors.New(\"internal Server Error\")\n\t// ErrNotFound will throw if the requested item is not exists\n\tErrNotFound = errors.New(\"your requested Item is not found\")\n\t// ErrConflict will throw if the current action already exists\n\tErrConflict = errors.New(\"your Item already exist\")\n\t// ErrBadParamInput will throw if the given request-body or params is not valid\n\tErrBadParamInput = errors.New(\"given Param is not valid\")\n)\n",
            "clean-architecture-go-articles-real/internal/repository/mysql/article.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/internal/repository/mysql/article.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage mysql\n\nimport (\n\t\"context\"\n\t\"database/sql\"\n\t\"fmt\"\n\n\t\"github.com/sirupsen/logrus\"\n\n\t\"github.com/bxcodec/go-clean-arch/domain\"\n\t\"github.com/bxcodec/go-clean-arch/internal/repository\"\n)\n\ntype ArticleRepository struct {\n\tConn *sql.DB\n}\n\n// NewArticleRepository will create an object that represent the article.Repository interface\nfunc NewArticleRepository(conn *sql.DB) *ArticleRepository {\n\treturn &ArticleRepository{conn}\n}\n\nfunc (m *ArticleRepository) fetch(ctx context.Context, query string, args ...interface{}) (result []domain.Article, err error) {\n\trows, err := m.Conn.QueryContext(ctx, query, args...)\n\tif err != nil {\n\t\tlogrus.Error(err)\n\t\treturn nil, err\n\t}\n\n\tdefer func() {\n\t\terrRow := rows.Close()\n\t\tif errRow != nil {\n\t\t\tlogrus.Error(errRow)\n\t\t}\n\t}()\n\n\tresult = make([]domain.Article, 0)\n\tfor rows.Next() {\n\t\tt := domain.Article{}\n\t\tauthorID := int64(0)\n\t\terr = rows.Scan(\n\t\t\t&t.ID,\n\t\t\t&t.Title,\n\t\t\t&t.Content,\n\t\t\t&authorID,\n\t\t\t&t.UpdatedAt,\n\t\t\t&t.CreatedAt,\n\t\t)\n\n\t\tif err != nil {\n\t\t\tlogrus.Error(err)\n\t\t\treturn nil, err\n\t\t}\n\t\tt.Author = domain.Author{\n\t\t\tID: authorID,\n\t\t}\n\t\tresult = append(result, t)\n\t}\n\n\treturn result, nil\n}\n\nfunc (m *ArticleRepository) Fetch(ctx context.Context, cursor string, num int64) (res []domain.Article, nextCursor string, err error) {\n\tquery := `SELECT id,title,content, author_id, updated_at, created_at\n  \t\t\t\t\t\tFROM article WHERE created_at > ? ORDER BY created_at LIMIT ? `\n\n\tdecodedCursor, err := repository.DecodeCursor(cursor)\n\tif err != nil && cursor != \"\" {\n\t\treturn nil, \"\", domain.ErrBadParamInput\n\t}\n\n\tres, err = m.fetch(ctx, query, decodedCursor, num)\n\tif err != nil {\n\t\treturn nil, \"\", err\n\t}\n\n\tif len(res) == int(num) {\n\t\tnextCursor = repository.EncodeCursor(res[len(res)-1].CreatedAt)\n\t}\n\n\treturn\n}\nfunc (m *ArticleRepository) GetByID(ctx context.Context, id int64) (res domain.Article, err error) {\n\tquery := `SELECT id,title,content, author_id, updated_at, created_at\n  \t\t\t\t\t\tFROM article WHERE ID = ?`\n\n\tlist, err := m.fetch(ctx, query, id)\n\tif err != nil {\n\t\treturn domain.Article{}, err\n\t}\n\n\tif len(list) > 0 {\n\t\tres = list[0]\n\t} else {\n\t\treturn res, domain.ErrNotFound\n\t}\n\n\treturn\n}\n\nfunc (m *ArticleRepository) GetByTitle(ctx context.Context, title string) (res domain.Article, err error) {\n\tquery := `SELECT id,title,content, author_id, updated_at, created_at\n  \t\t\t\t\t\tFROM article WHERE title = ?`\n\n\tlist, err := m.fetch(ctx, query, title)\n\tif err != nil {\n\t\treturn\n\t}\n\n\tif len(list) > 0 {\n\t\tres = list[0]\n\t} else {\n\t\treturn res, domain.ErrNotFound\n\t}\n\treturn\n}\n\nfunc (m *ArticleRepository) Store(ctx context.Context, a *domain.Article) (err error) {\n\tquery := `INSERT  article SET title=? , content=? , author_id=?, updated_at=? , created_at=?`\n\tstmt, err := m.Conn.PrepareContext(ctx, query)\n\tif err != nil {\n\t\treturn\n\t}\n\n\tres, err := stmt.ExecContext(ctx, a.Title, a.Content, a.Author.ID, a.UpdatedAt, a.CreatedAt)\n\tif err != nil {\n\t\treturn\n\t}\n\tlastID, err := res.LastInsertId()\n\tif err != nil {\n\t\treturn\n\t}\n\ta.ID = lastID\n\treturn\n}\n\n// … trimmed: Delete and Update (48 lines), the same prepare/exec pattern as Store …\n",
            "clean-architecture-go-articles-real/internal/repository/mysql/author.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/internal/repository/mysql/author.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage mysql\n\nimport (\n\t\"context\"\n\t\"database/sql\"\n\n\t\"github.com/bxcodec/go-clean-arch/domain\"\n)\n\ntype AuthorRepository struct {\n\tDB *sql.DB\n}\n\n// NewMysqlAuthorRepository will create an implementation of author.Repository\nfunc NewAuthorRepository(db *sql.DB) *AuthorRepository {\n\treturn &AuthorRepository{\n\t\tDB: db,\n\t}\n}\n\nfunc (m *AuthorRepository) getOne(ctx context.Context, query string, args ...interface{}) (res domain.Author, err error) {\n\tstmt, err := m.DB.PrepareContext(ctx, query)\n\tif err != nil {\n\t\treturn domain.Author{}, err\n\t}\n\trow := stmt.QueryRowContext(ctx, args...)\n\tres = domain.Author{}\n\n\terr = row.Scan(\n\t\t&res.ID,\n\t\t&res.Name,\n\t\t&res.CreatedAt,\n\t\t&res.UpdatedAt,\n\t)\n\treturn\n}\n\nfunc (m *AuthorRepository) GetByID(ctx context.Context, id int64) (domain.Author, error) {\n\tquery := `SELECT id, name, created_at, updated_at FROM author WHERE id=?`\n\treturn m.getOne(ctx, query, id)\n}\n",
            "clean-architecture-go-articles-real/internal/rest/article.go": "// Source: bxcodec/go-clean-arch (master @ e06c6d0) — https://github.com/bxcodec/go-clean-arch/blob/e06c6d0cb37069b0ef56e3df67f80ca130a1ab82/internal/rest/article.go\n// MIT License, Copyright (c) 2019 Iman Tumorang. Included for study.\npackage rest\n\nimport (\n\t\"context\"\n\t\"net/http\"\n\t\"strconv\"\n\n\t\"github.com/labstack/echo/v4\"\n\t\"github.com/sirupsen/logrus\"\n\tvalidator \"gopkg.in/go-playground/validator.v9\"\n\n\t\"github.com/bxcodec/go-clean-arch/domain\"\n)\n\n// ResponseError represent the response error struct\ntype ResponseError struct {\n\tMessage string `json:\"message\"`\n}\n\n// ArticleService represent the article's usecases\n//\n//go:generate mockery --name ArticleService\ntype ArticleService interface {\n\tFetch(ctx context.Context, cursor string, num int64) ([]domain.Article, string, error)\n\tGetByID(ctx context.Context, id int64) (domain.Article, error)\n\tUpdate(ctx context.Context, ar *domain.Article) error\n\tGetByTitle(ctx context.Context, title string) (domain.Article, error)\n\tStore(context.Context, *domain.Article) error\n\tDelete(ctx context.Context, id int64) error\n}\n\n// ArticleHandler  represent the httphandler for article\ntype ArticleHandler struct {\n\tService ArticleService\n}\n\nconst defaultNum = 10\n\n// NewArticleHandler will initialize the articles/ resources endpoint\nfunc NewArticleHandler(e *echo.Echo, svc ArticleService) {\n\thandler := &ArticleHandler{\n\t\tService: svc,\n\t}\n\te.GET(\"/articles\", handler.FetchArticle)\n\te.POST(\"/articles\", handler.Store)\n\te.GET(\"/articles/:id\", handler.GetByID)\n\te.DELETE(\"/articles/:id\", handler.Delete)\n}\n\n// FetchArticle will fetch the article based on given params\nfunc (a *ArticleHandler) FetchArticle(c echo.Context) error {\n\n\tnumS := c.QueryParam(\"num\")\n\tnum, err := strconv.Atoi(numS)\n\tif err != nil || num == 0 {\n\t\tnum = defaultNum\n\t}\n\n\tcursor := c.QueryParam(\"cursor\")\n\tctx := c.Request().Context()\n\n\tlistAr, nextCursor, err := a.Service.Fetch(ctx, cursor, int64(num))\n\tif err != nil {\n\t\treturn c.JSON(getStatusCode(err), ResponseError{Message: err.Error()})\n\t}\n\n\tc.Response().Header().Set(`X-Cursor`, nextCursor)\n\treturn c.JSON(http.StatusOK, listAr)\n}\n\n// GetByID will get article by given id\nfunc (a *ArticleHandler) GetByID(c echo.Context) error {\n\tidP, err := strconv.Atoi(c.Param(\"id\"))\n\tif err != nil {\n\t\treturn c.JSON(http.StatusNotFound, domain.ErrNotFound.Error())\n\t}\n\n\tid := int64(idP)\n\tctx := c.Request().Context()\n\n\tart, err := a.Service.GetByID(ctx, id)\n\tif err != nil {\n\t\treturn c.JSON(getStatusCode(err), ResponseError{Message: err.Error()})\n\t}\n\n\treturn c.JSON(http.StatusOK, art)\n}\n\nfunc isRequestValid(m *domain.Article) (bool, error) {\n\tvalidate := validator.New()\n\terr := validate.Struct(m)\n\tif err != nil {\n\t\treturn false, err\n\t}\n\treturn true, nil\n}\n\n// Store will store the article by given request body\nfunc (a *ArticleHandler) Store(c echo.Context) (err error) {\n\tvar article domain.Article\n\terr = c.Bind(&article)\n\tif err != nil {\n\t\treturn c.JSON(http.StatusUnprocessableEntity, err.Error())\n\t}\n\n\tvar ok bool\n\tif ok, err = isRequestValid(&article); !ok {\n\t\treturn c.JSON(http.StatusBadRequest, err.Error())\n\t}\n\n\tctx := c.Request().Context()\n\terr = a.Service.Store(ctx, &article)\n\tif err != nil {\n\t\treturn c.JSON(getStatusCode(err), ResponseError{Message: err.Error()})\n\t}\n\n\treturn c.JSON(http.StatusCreated, article)\n}\n\n// Delete will delete article by given param\nfunc (a *ArticleHandler) Delete(c echo.Context) error {\n\tidP, err := strconv.Atoi(c.Param(\"id\"))\n\tif err != nil {\n\t\treturn c.JSON(http.StatusNotFound, domain.ErrNotFound.Error())\n\t}\n\n\tid := int64(idP)\n\tctx := c.Request().Context()\n\n\terr = a.Service.Delete(ctx, id)\n\tif err != nil {\n\t\treturn c.JSON(getStatusCode(err), ResponseError{Message: err.Error()})\n\t}\n\n\treturn c.NoContent(http.StatusNoContent)\n}\n\nfunc getStatusCode(err error) int {\n\tif err == nil {\n\t\treturn http.StatusOK\n\t}\n\n\tlogrus.Error(err)\n\tswitch err {\n\tcase domain.ErrInternalServerError:\n\t\treturn http.StatusInternalServerError\n\tcase domain.ErrNotFound:\n\t\treturn http.StatusNotFound\n\tcase domain.ErrConflict:\n\t\treturn http.StatusConflict\n\tdefault:\n\t\treturn http.StatusInternalServerError\n\t}\n}\n"
          }
        }
      ]
    },
    {
      "id": "plugin-architecture",
      "name": "Plugin Architecture",
      "family": "Architecture",
      "aka": [
        "Microkernel",
        "Extension points",
        "Hooks",
        "Add-ons / Mods"
      ],
      "tagline": "A small host offers named extension points; independent plugins register into them.",
      "intent": "Keep the core (host) small and stable, and let features live in plugins that the host discovers or is given at startup. The host publishes extension points (hooks, filters, events, registries) and a plugin contract; plugins register their behaviour into those points, so new features ship without editing or even recompiling the host.",
      "analogy": "A power strip: the strip (host) defines the socket shape, and you plug in a lamp, a charger or a radio. The strip never needs to know what any of them do.",
      "cityShape": "Look for a core/ or editor/ district with no import arcs toward plugins/ or mods/, while every plugin building has an arc pointing back to the plugin contract. The hook registry building has a list antenna (taps, filters, coin_modifiers) that tap/register floors write into and call/apply floors loop over.",
      "roles": [
        {
          "name": "Host",
          "desc": "The core application. It decides where extension happens and calls the hooks at the right moments, without knowing which plugins exist."
        },
        {
          "name": "Extension Point",
          "desc": "A named hook, filter, event or registry that plugins can attach to, plus the rules for how attached functions are called (in order, can change values, async)."
        },
        {
          "name": "Plugin",
          "desc": "An independent unit that follows the plugin contract (setup(), apply(), _register()) and registers its behaviour into extension points."
        },
        {
          "name": "Plugin Loader",
          "desc": "Finds plugins (config list, folder scan, package names), creates them and hands them the host's API."
        }
      ],
      "whenToUse": [
        "Products that third parties or modders extend: editors, browsers, build tools, CMSs, games.",
        "Optional features that some installs need and others do not, enabled by configuration.",
        "A core team wants to keep the core small while many contributors add features in parallel."
      ],
      "pitfalls": [
        "Every hook is a public API: changing its name, arguments or timing breaks plugins you have never seen, so version the contract.",
        "Plugin order and interactions (two plugins filtering the same value) become a source of subtle bugs; document and expose ordering.",
        "Plugins usually run with full trust; a buggy or malicious one can crash or compromise the host unless you sandbox or isolate it."
      ],
      "related": [
        "observer",
        "strategy",
        "chain-of-responsibility",
        "dependency-injection",
        "open-closed",
        "service-locator"
      ],
      "quiz": [
        {
          "q": "You add a new plugin to the Python editor. Which file must change besides the plugin itself?",
          "options": [
            "editor/editor.py",
            "editor/hooks.py",
            "Only the list of enabled plugins (configuration)",
            "Every existing plugin"
          ],
          "answer": 2,
          "why": "The host knows hook names, not plugin classes. Enabling a plugin is configuration; the core code stays closed for modification (Open/Closed Principle)."
        },
        {
          "q": "What is the difference between a filter hook (apply_filters, modify_coins) and an action hook (do_action, enemy_killed)?",
          "options": [
            "Filters run asynchronously",
            "Each filter receives the value and returns a possibly changed value for the next one; actions only react",
            "Actions can only have one listener",
            "There is none"
          ],
          "answer": 1,
          "why": "Filters form a pipeline that can change data; actions are notifications. Choosing the right kind tells plugin authors what they are allowed to do."
        }
      ],
      "demos": [
        {
          "id": "plugin-architecture-py-editor",
          "title": "Text editor with save hooks",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A tiny editor offers two hooks: before_save (a filter) and after_save (an action). Two plugins are loaded by name from a list. Notice that editor/ has no arc to plugins/: the arcs only go from plugins to the plugin contract.",
          "roles": {
            "Host": [
              "plugin-architecture-py-editor/editor/editor.py#Editor"
            ],
            "Extension Point": [
              "plugin-architecture-py-editor/editor/hooks.py#HookRegistry",
              "plugin-architecture-py-editor/editor/plugin_api.py#Plugin"
            ],
            "Plugin": [
              "plugin-architecture-py-editor/plugins/trim_whitespace.py#TrimWhitespace",
              "plugin-architecture-py-editor/plugins/word_count.py#WordCount"
            ],
            "Plugin Loader": [
              "plugin-architecture-py-editor/main.py#load_plugins"
            ]
          },
          "trace": [
            {
              "at": "plugin-architecture-py-editor/main.py#main",
              "say": "main() creates the host and passes it a list of plugin module names: configuration, not code."
            },
            {
              "at": "plugin-architecture-py-editor/main.py#load_plugins",
              "say": "The loader imports each module by its name at runtime and asks it to create() its plugin object."
            },
            {
              "at": "plugin-architecture-py-editor/editor/editor.py#Editor.install",
              "say": "install() hands the plugin the hook registry. The editor does not care what the plugin will do with it."
            },
            {
              "at": "plugin-architecture-py-editor/plugins/trim_whitespace.py#TrimWhitespace.setup",
              "say": "The plugin attaches its trim function to the before_save filter."
            },
            {
              "at": "plugin-architecture-py-editor/editor/editor.py#Editor.save",
              "say": "On save, the host runs the filters, writes the text, then fires after_save. These two calls are the extension points."
            },
            {
              "at": "plugin-architecture-py-editor/editor/hooks.py#HookRegistry.apply_filters",
              "say": "Filters form a chain: each plugin gets the text and returns a possibly changed version for the next."
            },
            {
              "at": "plugin-architecture-py-editor/plugins/trim_whitespace.py#TrimWhitespace.trim",
              "say": "Trailing spaces disappear before the file is written, a feature the editor never coded."
            },
            {
              "at": "plugin-architecture-py-editor/plugins/word_count.py#WordCount.report",
              "say": "The after_save action lets another plugin react. It can observe but not change the saved text."
            }
          ],
          "files": {
            "plugin-architecture-py-editor/editor/editor.py": "# The host application. It knows hook names, never plugin classes.\nfrom .hooks import HookRegistry\n\n\nclass Editor:\n    def __init__(self):\n        self.hooks = HookRegistry()\n        self.loaded = []\n\n    def install(self, plugin):\n        plugin.setup(self.hooks)\n        self.loaded.append(plugin.name)\n\n    def save(self, filename, text):\n        text = self.hooks.apply_filters(\"before_save\", text)\n        print(\"--- saved \" + filename + \" ---\\n\" + text)\n        self.hooks.do_action(\"after_save\", filename, text)\n",
            "plugin-architecture-py-editor/editor/hooks.py": "# Extension points: named hooks that plugins attach functions to.\nclass HookRegistry:\n    def __init__(self):\n        self.filters = {}\n        self.actions = {}\n\n    def add_filter(self, name, fn):\n        self.filters.setdefault(name, []).append(fn)\n\n    def add_action(self, name, fn):\n        self.actions.setdefault(name, []).append(fn)\n\n    def apply_filters(self, name, value):\n        for fn in self.filters.get(name, []):\n            value = fn(value)  # each plugin may change the value and pass it on\n        return value\n\n    def do_action(self, name, *args):\n        for fn in self.actions.get(name, []):\n            fn(*args)  # plugins react, but cannot change anything\n",
            "plugin-architecture-py-editor/editor/plugin_api.py": "# The contract every plugin follows. This is all a plugin author needs to read.\nclass Plugin:\n    name = \"unnamed\"\n\n    def setup(self, hooks):\n        raise NotImplementedError(\"A plugin must register its hooks in setup()\")\n",
            "plugin-architecture-py-editor/main.py": "# Loads plugins by NAME from a config list. The editor code has no import of any plugin.\nimport importlib\n\nfrom editor.editor import Editor\n\nENABLED_PLUGINS = [\"plugins.trim_whitespace\", \"plugins.word_count\"]\n\n\ndef load_plugins(editor, module_names):\n    for module_name in module_names:\n        module = importlib.import_module(module_name)\n        editor.install(module.create())\n\n\ndef main():\n    editor = Editor()\n    load_plugins(editor, ENABLED_PLUGINS)\n    print(\"plugins: \" + \", \".join(editor.loaded))\n    editor.save(\"notes.txt\", \"hello world   \\nplugins are neat    \")\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "plugin-architecture-py-editor/plugins/trim_whitespace.py": "from editor.plugin_api import Plugin\n\n\nclass TrimWhitespace(Plugin):\n    name = \"trim-whitespace\"\n\n    def setup(self, hooks):\n        hooks.add_filter(\"before_save\", self.trim)\n\n    def trim(self, text):\n        return \"\\n\".join(line.rstrip() for line in text.splitlines())\n\n\ndef create():\n    return TrimWhitespace()\n",
            "plugin-architecture-py-editor/plugins/word_count.py": "from editor.plugin_api import Plugin\n\n\nclass WordCount(Plugin):\n    name = \"word-count\"\n\n    def setup(self, hooks):\n        hooks.add_action(\"after_save\", self.report)\n\n    def report(self, filename, text):\n        print(\"[word-count] \" + filename + \": \" + str(len(text.split())) + \" words\")\n\n\ndef create():\n    return WordCount()\n"
          }
        },
        {
          "id": "plugin-architecture-gd-mods",
          "title": "Godot mod loader",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A game scans res://mods at startup. Each mod extends GameMod and registers itself through ModApi: one adds a shop item and listens to a signal, the other changes coin rewards through a filter. world.gd never names a mod.",
          "roles": {
            "Host": [
              "plugin-architecture-gd-mods/game/world.gd"
            ],
            "Extension Point": [
              "plugin-architecture-gd-mods/core/mod_api.gd",
              "plugin-architecture-gd-mods/core/game_mod.gd"
            ],
            "Plugin": [
              "plugin-architecture-gd-mods/mods/frost_blade/frost_blade_mod.gd",
              "plugin-architecture-gd-mods/mods/double_coins/double_coins_mod.gd"
            ],
            "Plugin Loader": [
              "plugin-architecture-gd-mods/core/mod_loader.gd"
            ]
          },
          "trace": [
            {
              "at": "plugin-architecture-gd-mods/game/world.gd#_ready",
              "say": "The game creates the ModApi (its extension points) and asks the loader to install whatever mods are on disk."
            },
            {
              "at": "plugin-architecture-gd-mods/core/mod_loader.gd#load_all",
              "say": "The loader lists folders in res://mods. Dropping in a new folder is all it takes to add a mod."
            },
            {
              "at": "plugin-architecture-gd-mods/core/mod_loader.gd#_load_one",
              "say": "Each script is loaded by path and checked: anything that does not extend GameMod is rejected, protecting the host."
            },
            {
              "at": "plugin-architecture-gd-mods/mods/frost_blade/frost_blade_mod.gd#_register",
              "say": "A content mod adds an item to the registry and connects to the enemy_killed signal."
            },
            {
              "at": "plugin-architecture-gd-mods/core/mod_api.gd#register_item",
              "say": "Registries are extension points too. The API refuses duplicate ids so two mods cannot silently overwrite each other."
            },
            {
              "at": "plugin-architecture-gd-mods/mods/double_coins/double_coins_mod.gd#_register",
              "say": "A rules mod adds a coin modifier: a filter that receives a number and returns a new one."
            },
            {
              "at": "plugin-architecture-gd-mods/game/world.gd#award_coins",
              "say": "When coins are awarded, the host asks the API to run all modifiers instead of using the raw amount."
            },
            {
              "at": "plugin-architecture-gd-mods/core/mod_api.gd#modify_coins",
              "say": "Each modifier is called in load order. With Double Coins installed, 1 coin becomes 2; uninstall it and nothing else changes."
            }
          ],
          "files": {
            "plugin-architecture-gd-mods/core/game_mod.gd": "class_name GameMod\nextends RefCounted\n## Base class every mod extends. The game only ever talks to mods through this.\n\nvar mod_id: String = \"unnamed\"\n\n\nfunc _register(_api: ModApi) -> void:\n\tpush_error(\"Mod %s forgot to override _register()\" % mod_id)\n",
            "plugin-architecture-gd-mods/core/mod_api.gd": "class_name ModApi\nextends RefCounted\n## The extension points the game offers. Mods may only touch the game through these.\n\nsignal enemy_killed(enemy_name: String, position: Vector2)\n\nvar items: Dictionary = {}\nvar coin_modifiers: Array[Callable] = []\n\n\nfunc register_item(id: String, data: Dictionary) -> void:\n\tif items.has(id):\n\t\tpush_warning(\"Item %s registered twice; keeping the first\" % id)\n\t\treturn\n\titems[id] = data\n\n\nfunc add_coin_modifier(modifier: Callable) -> void:\n\tcoin_modifiers.append(modifier)\n\n\nfunc modify_coins(amount: int) -> int:\n\tfor modifier in coin_modifiers:\n\t\tamount = modifier.call(amount)\n\treturn amount\n",
            "plugin-architecture-gd-mods/core/mod_loader.gd": "class_name ModLoader\nextends RefCounted\n## Finds mods on disk at runtime. The game code never names a specific mod.\n\nconst MODS_DIR := \"res://mods\"\n\n\nfunc load_all(api: ModApi) -> Array[GameMod]:\n\tvar loaded: Array[GameMod] = []\n\tfor folder in DirAccess.get_directories_at(MODS_DIR):\n\t\tvar mod := _load_one(MODS_DIR.path_join(folder), folder)\n\t\tif mod:\n\t\t\tmod._register(api)\n\t\t\tloaded.append(mod)\n\treturn loaded\n\n\nfunc _load_one(dir: String, folder: String) -> GameMod:\n\tvar path := dir.path_join(folder + \"_mod.gd\")\n\tif not ResourceLoader.exists(path):\n\t\treturn null\n\tvar instance = load(path).new()\n\tif not instance is GameMod:\n\t\tpush_warning(\"%s does not extend GameMod; skipped\" % path)\n\t\treturn null\n\tinstance.mod_id = folder\n\treturn instance\n",
            "plugin-architecture-gd-mods/game/world.gd": "extends Node2D\n## The host game. It creates the API, lets the loader install mods, then uses the extension points.\n\nvar api := ModApi.new()\nvar coins := 0\n\n\nfunc _ready() -> void:\n\tvar mods := ModLoader.new().load_all(api)\n\tprint(\"Mods loaded: \", mods.map(func(m): return m.mod_id))\n\tfor id in api.items:\n\t\tprint(\"Shop now sells: \", api.items[id].name)\n\n\nfunc award_coins(base_amount: int) -> void:\n\tcoins += api.modify_coins(base_amount)\n\tprint(\"Coins: \", coins)\n\n\nfunc on_enemy_died(enemy: Node2D) -> void:\n\tapi.enemy_killed.emit(enemy.name, enemy.global_position)\n\taward_coins(1)\n",
            "plugin-architecture-gd-mods/mods/double_coins/double_coins_mod.gd": "class_name DoubleCoinsMod\nextends GameMod\n## A rules mod: changes a number the game computes, through a filter-style hook.\n\n\nfunc _register(api: ModApi) -> void:\n\tapi.add_coin_modifier(_double)\n\n\nfunc _double(amount: int) -> int:\n\treturn amount * 2\n",
            "plugin-architecture-gd-mods/mods/frost_blade/frost_blade_mod.gd": "class_name FrostBladeMod\nextends GameMod\n## A content mod: adds an item and reacts to a game event.\n\nvar kills := 0\n\n\nfunc _register(api: ModApi) -> void:\n\tapi.register_item(\"frost_blade\", {\"name\": \"Frost Blade\", \"damage\": 12, \"price\": 40})\n\tapi.enemy_killed.connect(_on_enemy_killed)\n\n\nfunc _on_enemy_killed(enemy_name: String, _position: Vector2) -> void:\n\tkills += 1\n\tprint(\"Frost Blade chills %s (%d kills)\" % [enemy_name, kills])\n"
          }
        },
        {
          "id": "plugin-architecture-tapable-real",
          "title": "tapable: the hook engine behind webpack",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "webpack/tapable",
            "url": "https://github.com/webpack/tapable/blob/v2.3.3/lib/Hook.js",
            "license": "MIT",
            "note": "tapable/lib/* is from tapable v2.3.3: SyncHook.js and AsyncSeriesHook.js are complete, Hook.js has withOptions() trimmed, HookCodeFactory.js keeps create/setup/init/deinit and trims the code generators. Everything in mini-bundler/ was written for Software City in webpack's plugin style."
          },
          "story": "Every webpack plugin taps into hooks made by tapable. A mini compiler exposes a sync processAssets hook and an async emit hook; two plugins with apply(compiler) tap into them. Watch how tap() only records, and the first call() compiles a fast function for all taps.",
          "roles": {
            "Host": [
              "plugin-architecture-tapable-real/mini-bundler/compiler.js#Compiler"
            ],
            "Extension Point": [
              "plugin-architecture-tapable-real/tapable/lib/Hook.js#Hook",
              "plugin-architecture-tapable-real/tapable/lib/SyncHook.js#SyncHook",
              "plugin-architecture-tapable-real/tapable/lib/AsyncSeriesHook.js#AsyncSeriesHook",
              "plugin-architecture-tapable-real/tapable/lib/HookCodeFactory.js#HookCodeFactory"
            ],
            "Plugin": [
              "plugin-architecture-tapable-real/mini-bundler/plugins/banner-plugin.js#BannerPlugin",
              "plugin-architecture-tapable-real/mini-bundler/plugins/size-report-plugin.js#SizeReportPlugin"
            ],
            "Plugin Loader": [
              "plugin-architecture-tapable-real/mini-bundler/build.js#build"
            ]
          },
          "trace": [
            {
              "at": "plugin-architecture-tapable-real/mini-bundler/build.js#build",
              "say": "Like a webpack config: build() creates the compiler, then calls apply(compiler) on each plugin in the list."
            },
            {
              "at": "plugin-architecture-tapable-real/mini-bundler/plugins/banner-plugin.js#BannerPlugin.apply",
              "say": "The plugin taps the processAssets hook with a name, so tools and error messages can tell plugins apart."
            },
            {
              "at": "plugin-architecture-tapable-real/tapable/lib/Hook.js#Hook._tap",
              "say": "tap() lands here: tapable normalizes 'BannerPlugin' into a tap descriptor {type, fn, name} and lets interceptors see it."
            },
            {
              "at": "plugin-architecture-tapable-real/tapable/lib/Hook.js#Hook._insert",
              "say": "_insert() places the tap by stage and 'before' options and resets the compiled call, because the list changed."
            },
            {
              "at": "plugin-architecture-tapable-real/mini-bundler/compiler.js#Compiler.run",
              "say": "The host fires its extension points at fixed moments: processAssets.call(assets), then emit.callAsync(assets, done)."
            },
            {
              "at": "plugin-architecture-tapable-real/tapable/lib/Hook.js#CALL_DELEGATE",
              "say": "The first call() is a placeholder: it compiles the real call function, stores it on the hook and runs it."
            },
            {
              "at": "plugin-architecture-tapable-real/tapable/lib/HookCodeFactory.js#HookCodeFactory.create",
              "say": "create() writes JavaScript source that calls every tap in order and builds it with new Function: fast calls for webpack's hundreds of taps."
            },
            {
              "at": "plugin-architecture-tapable-real/mini-bundler/plugins/size-report-plugin.js#SizeReportPlugin.report",
              "say": "On the AsyncSeriesHook, each tap gets a callback; the next tap or the final done() only runs after callback() is called."
            }
          ],
          "files": {
            "plugin-architecture-tapable-real/mini-bundler/build.js": "// Written for Software City: the config decides which plugins are installed.\nconst Compiler = require(\"./compiler\");\nconst BannerPlugin = require(\"./plugins/banner-plugin\");\nconst SizeReportPlugin = require(\"./plugins/size-report-plugin\");\n\nfunction build() {\n\tconst compiler = new Compiler();\n\tconst plugins = [new BannerPlugin(\"built with tapable\"), new SizeReportPlugin()];\n\tfor (const plugin of plugins) {\n\t\tplugin.apply(compiler);\n\t}\n\tcompiler.run(\"console.log('hi');\", (err, assets) => {\n\t\tif (err) throw err;\n\t\tconsole.log(assets[\"main.js\"]);\n\t});\n}\n\nbuild();\n",
            "plugin-architecture-tapable-real/mini-bundler/compiler.js": "// Written for Software City (not part of tapable): a tiny webpack-like host that exposes tapable hooks.\nconst SyncHook = require(\"../tapable/lib/SyncHook\");\nconst AsyncSeriesHook = require(\"../tapable/lib/AsyncSeriesHook\");\n\nclass Compiler {\n\tconstructor() {\n\t\t// The extension points. Plugins tap into these; the compiler never imports a plugin.\n\t\tthis.hooks = {\n\t\t\tprocessAssets: new SyncHook([\"assets\"]),\n\t\t\temit: new AsyncSeriesHook([\"assets\"])\n\t\t};\n\t}\n\n\trun(source, done) {\n\t\tconst assets = { \"main.js\": source };\n\t\tthis.hooks.processAssets.call(assets);\n\t\tthis.hooks.emit.callAsync(assets, (err) => {\n\t\t\tif (err) return done(err);\n\t\t\tdone(null, assets);\n\t\t});\n\t}\n}\n\nmodule.exports = Compiler;\n",
            "plugin-architecture-tapable-real/mini-bundler/plugins/banner-plugin.js": "// Written for Software City: a webpack-style plugin is just an object with apply(compiler).\nclass BannerPlugin {\n\tconstructor(text) {\n\t\tthis.text = text;\n\t}\n\n\tapply(compiler) {\n\t\tcompiler.hooks.processAssets.tap(\"BannerPlugin\", (assets) => this.addBanner(assets));\n\t}\n\n\taddBanner(assets) {\n\t\tfor (const name of Object.keys(assets)) {\n\t\t\tassets[name] = \"/* \" + this.text + \" */\\n\" + assets[name];\n\t\t}\n\t}\n}\n\nmodule.exports = BannerPlugin;\n",
            "plugin-architecture-tapable-real/mini-bundler/plugins/size-report-plugin.js": "// Written for Software City: an async plugin. The next tap waits until callback() is called.\nclass SizeReportPlugin {\n\tapply(compiler) {\n\t\tcompiler.hooks.emit.tapAsync(\"SizeReportPlugin\", (assets, callback) => this.report(assets, callback));\n\t}\n\n\treport(assets, callback) {\n\t\tsetTimeout(() => {\n\t\t\tfor (const [name, code] of Object.entries(assets)) {\n\t\t\t\tconsole.log(name + \": \" + code.length + \" bytes\");\n\t\t\t}\n\t\t\tcallback();\n\t\t}, 10);\n\t}\n}\n\nmodule.exports = SizeReportPlugin;\n",
            "plugin-architecture-tapable-real/tapable/lib/AsyncSeriesHook.js": "// Source: tapable 2.3.3 — https://github.com/webpack/tapable/blob/v2.3.3/lib/AsyncSeriesHook.js\n// MIT License, Copyright JS Foundation and other contributors. Included for study.\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\"use strict\";\n\nconst Hook = require(\"./Hook\");\nconst HookCodeFactory = require(\"./HookCodeFactory\");\n\nclass AsyncSeriesHookCodeFactory extends HookCodeFactory {\n\tcontent({ onError, onDone }) {\n\t\treturn this.callTapsSeries({\n\t\t\tonError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),\n\t\t\tonDone\n\t\t});\n\t}\n}\n\nconst factory = new AsyncSeriesHookCodeFactory();\n\nfunction COMPILE(options) {\n\tfactory.setup(this, options);\n\treturn factory.create(options);\n}\n\nfunction AsyncSeriesHook(args = [], name = undefined) {\n\tconst hook = new Hook(args, name);\n\thook.constructor = AsyncSeriesHook;\n\thook.compile = COMPILE;\n\thook._call = undefined;\n\thook.call = undefined;\n\treturn hook;\n}\n\nAsyncSeriesHook.prototype = null;\n\nmodule.exports = AsyncSeriesHook;\n",
            "plugin-architecture-tapable-real/tapable/lib/Hook.js": "// Source: tapable 2.3.3 — https://github.com/webpack/tapable/blob/v2.3.3/lib/Hook.js\n// MIT License, Copyright JS Foundation and other contributors. Included for study.\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\"use strict\";\n\nconst util = require(\"util\");\n\nconst deprecateContext = util.deprecate(\n\t() => {},\n\t\"Hook.context is deprecated and will be removed\"\n);\n\nfunction CALL_DELEGATE(...args) {\n\tthis.call = this._createCall(\"sync\");\n\treturn this.call(...args);\n}\n\nfunction CALL_ASYNC_DELEGATE(...args) {\n\tthis.callAsync = this._createCall(\"async\");\n\treturn this.callAsync(...args);\n}\n\nfunction PROMISE_DELEGATE(...args) {\n\tthis.promise = this._createCall(\"promise\");\n\treturn this.promise(...args);\n}\n\nclass Hook {\n\tconstructor(args = [], name = undefined) {\n\t\tthis._args = args;\n\t\tthis.name = name;\n\t\tthis.taps = [];\n\t\tthis.interceptors = [];\n\t\tthis._call = CALL_DELEGATE;\n\t\tthis.call = CALL_DELEGATE;\n\t\tthis._callAsync = CALL_ASYNC_DELEGATE;\n\t\tthis.callAsync = CALL_ASYNC_DELEGATE;\n\t\tthis._promise = PROMISE_DELEGATE;\n\t\tthis.promise = PROMISE_DELEGATE;\n\t\tthis._x = undefined;\n\n\t\t// eslint-disable-next-line no-self-assign\n\t\tthis.compile = this.compile;\n\t\t// eslint-disable-next-line no-self-assign\n\t\tthis.tap = this.tap;\n\t\t// eslint-disable-next-line no-self-assign\n\t\tthis.tapAsync = this.tapAsync;\n\t\t// eslint-disable-next-line no-self-assign\n\t\tthis.tapPromise = this.tapPromise;\n\t}\n\n\tcompile(_options) {\n\t\tthrow new Error(\"Abstract: should be overridden\");\n\t}\n\n\t_createCall(type) {\n\t\treturn this.compile({\n\t\t\ttaps: this.taps,\n\t\t\tinterceptors: this.interceptors,\n\t\t\targs: this._args,\n\t\t\ttype\n\t\t});\n\t}\n\n\t_tap(type, options, fn) {\n\t\tif (typeof options === \"string\") {\n\t\t\t// Fast path: a string options (\"name\") is by far the most common\n\t\t\t// case. Build the final descriptor in a single allocation instead\n\t\t\t// of creating `{ name }` and then `Object.assign`ing it.\n\t\t\tconst name = options.trim();\n\t\t\tif (name === \"\") {\n\t\t\t\tthrow new Error(\"Missing name for tap\");\n\t\t\t}\n\t\t\toptions = { type, fn, name };\n\t\t} else {\n\t\t\tif (typeof options !== \"object\" || options === null) {\n\t\t\t\tthrow new Error(\"Invalid tap options\");\n\t\t\t}\n\t\t\tlet { name } = options;\n\t\t\tif (typeof name === \"string\") {\n\t\t\t\tname = name.trim();\n\t\t\t}\n\t\t\tif (typeof name !== \"string\" || name === \"\") {\n\t\t\t\tthrow new Error(\"Missing name for tap\");\n\t\t\t}\n\t\t\tif (typeof options.context !== \"undefined\") {\n\t\t\t\tdeprecateContext();\n\t\t\t}\n\t\t\t// Fast path: only `name` is set. Build the descriptor as a literal\n\t\t\t// so `_insert` and downstream consumers see the same hidden class\n\t\t\t// as the string-options path, avoiding a polymorphic call site.\n\t\t\t// Scan with `for...in` (cheaper than allocating `Object.keys`)\n\t\t\t// to verify no other user-provided properties exist - e.g.\n\t\t\t// webpack's `additionalAssets` - otherwise they'd be dropped.\n\t\t\tlet onlyName = true;\n\t\t\tfor (const key in options) {\n\t\t\t\tif (key !== \"name\") {\n\t\t\t\t\tonlyName = false;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (onlyName) {\n\t\t\t\toptions = { type, fn, name };\n\t\t\t} else {\n\t\t\t\toptions.name = name;\n\t\t\t\t// Preserve previous precedence: user-provided keys win over the internal `type`/`fn`.\n\t\t\t\toptions = Object.assign({ type, fn }, options);\n\t\t\t}\n\t\t}\n\t\toptions = this._runRegisterInterceptors(options);\n\t\tthis._insert(options);\n\t}\n\n\ttap(options, fn) {\n\t\tthis._tap(\"sync\", options, fn);\n\t}\n\n\ttapAsync(options, fn) {\n\t\tthis._tap(\"async\", options, fn);\n\t}\n\n\ttapPromise(options, fn) {\n\t\tthis._tap(\"promise\", options, fn);\n\t}\n\n\t_runRegisterInterceptors(options) {\n\t\tconst { interceptors } = this;\n\t\tconst { length } = interceptors;\n\t\t// Common case: no interceptors.\n\t\tif (length === 0) return options;\n\t\tfor (let i = 0; i < length; i++) {\n\t\t\tconst interceptor = interceptors[i];\n\t\t\tif (interceptor.register) {\n\t\t\t\tconst newOptions = interceptor.register(options);\n\t\t\t\tif (newOptions !== undefined) {\n\t\t\t\t\toptions = newOptions;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn options;\n\t}\n\n\t// … trimmed: 15 lines of withOptions(), a helper that pre-fills tap options …\n\n\tisUsed() {\n\t\treturn this.taps.length > 0 || this.interceptors.length > 0;\n\t}\n\n\tintercept(interceptor) {\n\t\tthis._resetCompilation();\n\t\tthis.interceptors.push(Object.assign({}, interceptor));\n\t\tif (interceptor.register) {\n\t\t\tfor (let i = 0; i < this.taps.length; i++) {\n\t\t\t\tthis.taps[i] = interceptor.register(this.taps[i]);\n\t\t\t}\n\t\t}\n\t}\n\n\t_resetCompilation() {\n\t\tthis.call = this._call;\n\t\tthis.callAsync = this._callAsync;\n\t\tthis.promise = this._promise;\n\t}\n\n\t_insert(item) {\n\t\tthis._resetCompilation();\n\t\tconst { taps } = this;\n\t\tconst stage = typeof item.stage === \"number\" ? item.stage : 0;\n\n\t\t// Fast path: the overwhelmingly common `hook.tap(\"name\", fn)` case\n\t\t// has no `before` and default stage 0. If the list is empty or the\n\t\t// last tap's stage is <= the new item's stage the item belongs at\n\t\t// the end - append in O(1), skipping the Set allocation and the\n\t\t// shift loop.\n\t\tif (!(typeof item.before === \"string\" || Array.isArray(item.before))) {\n\t\t\tconst n = taps.length;\n\t\t\tif (n === 0 || (taps[n - 1].stage || 0) <= stage) {\n\t\t\t\ttaps[n] = item;\n\t\t\t\treturn;\n\t\t\t}\n\t\t}\n\n\t\tlet before;\n\n\t\tif (typeof item.before === \"string\") {\n\t\t\tbefore = new Set([item.before]);\n\t\t} else if (Array.isArray(item.before)) {\n\t\t\tbefore = new Set(item.before);\n\t\t}\n\n\t\tlet i = taps.length;\n\n\t\twhile (i > 0) {\n\t\t\ti--;\n\t\t\tconst tap = taps[i];\n\t\t\ttaps[i + 1] = tap;\n\t\t\tconst xStage = tap.stage || 0;\n\t\t\tif (before) {\n\t\t\t\tif (before.has(tap.name)) {\n\t\t\t\t\tbefore.delete(tap.name);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tif (before.size > 0) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (xStage > stage) {\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\ti++;\n\t\t\tbreak;\n\t\t}\n\t\ttaps[i] = item;\n\t}\n}\n\nObject.setPrototypeOf(Hook.prototype, null);\n\nmodule.exports = Hook;\n",
            "plugin-architecture-tapable-real/tapable/lib/HookCodeFactory.js": "// Source: tapable 2.3.3 — https://github.com/webpack/tapable/blob/v2.3.3/lib/HookCodeFactory.js\n// MIT License, Copyright JS Foundation and other contributors. Included for study.\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\"use strict\";\n\nclass HookCodeFactory {\n\tconstructor(config) {\n\t\tthis.config = config;\n\t\tthis.options = undefined;\n\t\tthis._args = undefined;\n\t}\n\n\tcreate(options) {\n\t\tthis.init(options);\n\t\tlet fn;\n\t\tswitch (options.type) {\n\t\t\tcase \"sync\":\n\t\t\t\tfn = new Function(\n\t\t\t\t\tthis.args(),\n\t\t\t\t\t`\"use strict\";\\n${this.header()}${this.contentWithInterceptors({\n\t\t\t\t\t\tonError: (err) => `throw ${err};\\n`,\n\t\t\t\t\t\tonResult: (result) => `return ${result};\\n`,\n\t\t\t\t\t\tresultReturns: true,\n\t\t\t\t\t\tonDone: () => \"\",\n\t\t\t\t\t\trethrowIfPossible: true\n\t\t\t\t\t})}`\n\t\t\t\t);\n\t\t\t\tbreak;\n\t\t\tcase \"async\":\n\t\t\t\tfn = new Function(\n\t\t\t\t\tthis.args({\n\t\t\t\t\t\tafter: \"_callback\"\n\t\t\t\t\t}),\n\t\t\t\t\t`\"use strict\";\\n${this.header()}${this.contentWithInterceptors({\n\t\t\t\t\t\tonError: (err) => `_callback(${err});\\n`,\n\t\t\t\t\t\tonResult: (result) => `_callback(null, ${result});\\n`,\n\t\t\t\t\t\tonDone: () => \"_callback();\\n\"\n\t\t\t\t\t})}`\n\t\t\t\t);\n\t\t\t\tbreak;\n\t\t\t// … trimmed: 32 lines of the \"promise\" case, same idea wrapped in new Promise(…) …\n\t\t}\n\t\tthis.deinit();\n\t\treturn fn;\n\t}\n\n\tsetup(instance, options) {\n\t\tconst { taps } = options;\n\t\tconst { length } = taps;\n\t\tconst fns = Array.from({ length });\n\t\tfor (let i = 0; i < length; i++) {\n\t\t\tfns[i] = taps[i].fn;\n\t\t}\n\t\tinstance._x = fns;\n\t}\n\n\t/**\n\t * @param {{ type: \"sync\" | \"promise\" | \"async\", taps: Array<Tap>, interceptors: Array<Interceptor> }} options\n\t */\n\tinit(options) {\n\t\tthis.options = options;\n\t\t// `_args` is only read (length / join / [0]) - never mutated - so we\n\t\t// can share the caller's array directly instead of paying for a copy\n\t\t// on every compile.\n\t\tthis._args = options.args;\n\t\tthis._joinedArgs = undefined;\n\t}\n\n\tdeinit() {\n\t\tthis.options = undefined;\n\t\tthis._args = undefined;\n\t\tthis._joinedArgs = undefined;\n\t}\n\t// … trimmed: 382 lines of code generation (header, callTapsSeries, callTap, args …) that write the\n\t// JavaScript source of the final call function, one loop iteration per registered tap …\n}\n\nmodule.exports = HookCodeFactory;\n",
            "plugin-architecture-tapable-real/tapable/lib/SyncHook.js": "// Source: tapable 2.3.3 — https://github.com/webpack/tapable/blob/v2.3.3/lib/SyncHook.js\n// MIT License, Copyright JS Foundation and other contributors. Included for study.\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\"use strict\";\n\nconst Hook = require(\"./Hook\");\nconst HookCodeFactory = require(\"./HookCodeFactory\");\n\nclass SyncHookCodeFactory extends HookCodeFactory {\n\tcontent({ onError, onDone, rethrowIfPossible }) {\n\t\treturn this.callTapsSeries({\n\t\t\tonError: (i, err) => onError(err),\n\t\t\tonDone,\n\t\t\trethrowIfPossible\n\t\t});\n\t}\n}\n\nconst factory = new SyncHookCodeFactory();\n\nconst TAP_ASYNC = () => {\n\tthrow new Error(\"tapAsync is not supported on a SyncHook\");\n};\n\nconst TAP_PROMISE = () => {\n\tthrow new Error(\"tapPromise is not supported on a SyncHook\");\n};\n\nfunction COMPILE(options) {\n\tfactory.setup(this, options);\n\treturn factory.create(options);\n}\n\nfunction SyncHook(args = [], name = undefined) {\n\tconst hook = new Hook(args, name);\n\thook.constructor = SyncHook;\n\thook.tapAsync = TAP_ASYNC;\n\thook.tapPromise = TAP_PROMISE;\n\thook.compile = COMPILE;\n\treturn hook;\n}\n\nSyncHook.prototype = null;\n\nmodule.exports = SyncHook;\n"
          }
        }
      ]
    },
    {
      "id": "pipes-and-filters",
      "name": "Pipes and Filters",
      "family": "Architecture",
      "aka": [
        "Pipeline",
        "Data pipeline",
        "Unix pipes",
        "ETL chain"
      ],
      "tagline": "Data flows through a chain of small, independent steps, each doing one job.",
      "intent": "Break a big data-processing job into small filters that each take input, transform it, and pass output on. Pipes connect the filters, so you can reorder, remove or reuse steps without rewriting the others.",
      "analogy": "A car wash: the car rolls through soap, brushes, rinse and dryer stations in a row. Each station does one thing and does not care what the others do.",
      "cityShape": "Follow the data-flow pipes: they run in a line from a source building, through a row of short filter functions that sit side by side in one building, into a sink at the end. The pipeline's run() floor is the junction that calls each filter in turn, and no filter calls another.",
      "roles": [
        {
          "name": "Source",
          "desc": "Produces the raw input and pushes it into the first pipe."
        },
        {
          "name": "Filter",
          "desc": "A small step that reads input, transforms it, and writes output. It knows nothing about its neighbours."
        },
        {
          "name": "Pipe",
          "desc": "The connection between two filters: a return value, a list, a channel or a stream."
        },
        {
          "name": "Pipeline",
          "desc": "Assembles the filters in order and runs data through them."
        },
        {
          "name": "Sink",
          "desc": "Consumes the final output: prints it, saves it or sends it somewhere."
        }
      ],
      "whenToUse": [
        "Data goes through several clean-up or transform steps (ETL jobs, log processing, text normalisation).",
        "You want to reorder, add or test steps one at a time.",
        "Stages could run in parallel or be streamed, like Unix commands joined with |.",
        "Image or audio processing where effects are stacked (blur, then sharpen, then resize)."
      ],
      "pitfalls": [
        "Every filter must agree on the data format between them; a format change ripples through the chain.",
        "Errors in the middle of a long chain are hard to locate unless each stage reports where it failed.",
        "Too many tiny stages add copying and overhead; merge steps that always run together."
      ],
      "related": [
        "chain-of-responsibility",
        "decorator",
        "iterator",
        "pub-sub"
      ],
      "quiz": [
        {
          "q": "You need to add a 'remove profanity' step between two existing filters. What should change?",
          "options": [
            "Both neighbouring filters, so they call the new one",
            "Only the pipeline assembly: insert the new filter in the list",
            "The source, so it cleans the text before sending it",
            "Nothing; filters discover new steps automatically"
          ],
          "answer": 1,
          "why": "Filters do not know about each other. Only the code that assembles the pipeline lists the order, so adding a step is one line there."
        },
        {
          "q": "How is Pipes and Filters different from Chain of Responsibility?",
          "options": [
            "They are the same thing",
            "In a pipeline every filter usually runs and transforms the data; in a chain one handler usually takes the request and stops",
            "Pipelines can only be used with text",
            "A chain always runs in parallel"
          ],
          "answer": 1,
          "why": "A pipeline is about transforming data step by step. A chain is about finding the one handler that deals with a request."
        }
      ],
      "demos": [
        {
          "id": "pipes-and-filters-py-groceries",
          "title": "Cleaning a shopping list",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A messy shopping note goes through four tiny filters: strip spaces, drop blank lines, lower-case, remove duplicates. Notice that filters.py imports nothing; only main.py knows the order.",
          "roles": {
            "Source": [
              "pipes-and-filters-py-groceries/source.py#read_lines",
              "pipes-and-filters-py-groceries/source.py#RAW_NOTE"
            ],
            "Filter": [
              "pipes-and-filters-py-groceries/filters.py#strip_spaces",
              "pipes-and-filters-py-groceries/filters.py#drop_blank",
              "pipes-and-filters-py-groceries/filters.py#to_lower",
              "pipes-and-filters-py-groceries/filters.py#remove_duplicates"
            ],
            "Pipe": [
              "pipes-and-filters-py-groceries/pipeline.py#Pipeline.run"
            ],
            "Pipeline": [
              "pipes-and-filters-py-groceries/pipeline.py#Pipeline",
              "pipes-and-filters-py-groceries/main.py#main"
            ],
            "Sink": [
              "pipes-and-filters-py-groceries/sink.py#print_list"
            ]
          },
          "trace": [
            {
              "at": "pipes-and-filters-py-groceries/main.py#main",
              "say": "main() lists the filters in order. This is the only place that knows the whole chain."
            },
            {
              "at": "pipes-and-filters-py-groceries/pipeline.py#Pipeline.add",
              "say": "add() just appends a function to a list, so steps can be swapped or reordered freely."
            },
            {
              "at": "pipes-and-filters-py-groceries/source.py#read_lines",
              "say": "The source splits the raw note into lines. It has no idea what cleaning will happen next."
            },
            {
              "at": "pipes-and-filters-py-groceries/pipeline.py#Pipeline.run",
              "say": "run() feeds each filter's output into the next one. The variable data is the pipe."
            },
            {
              "at": "pipes-and-filters-py-groceries/filters.py#strip_spaces",
              "say": "First filter: trims spaces. It takes a list and returns a new list, nothing more."
            },
            {
              "at": "pipes-and-filters-py-groceries/filters.py#to_lower",
              "say": "A later filter lower-cases items, so 'Milk' and 'milk' become equal for the next step."
            },
            {
              "at": "pipes-and-filters-py-groceries/filters.py#remove_duplicates",
              "say": "Now duplicates can be removed. Order matters: run this before to_lower and 'Eggs' would survive."
            },
            {
              "at": "pipes-and-filters-py-groceries/sink.py#print_list",
              "say": "The sink prints the finished list. Swap it for save_to_file() and no filter changes."
            }
          ],
          "files": {
            "pipes-and-filters-py-groceries/filters.py": "# Filters: each one takes a list, returns a new list, and knows nothing about the others.\n\n\ndef strip_spaces(items):\n    return [item.strip() for item in items]\n\n\ndef drop_blank(items):\n    return [item for item in items if item != \"\"]\n\n\ndef to_lower(items):\n    return [item.lower() for item in items]\n\n\ndef remove_duplicates(items):\n    seen = []\n    for item in items:\n        if item not in seen:\n            seen.append(item)\n    return seen\n",
            "pipes-and-filters-py-groceries/main.py": "from .source import read_lines\nfrom .filters import strip_spaces, drop_blank, to_lower, remove_duplicates\nfrom .pipeline import Pipeline\nfrom .sink import print_list\n\n\ndef main():\n    pipeline = Pipeline()\n    pipeline.add(strip_spaces).add(drop_blank).add(to_lower).add(remove_duplicates)\n\n    raw = read_lines()\n    clean = pipeline.run(raw)\n    print_list(clean)\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "pipes-and-filters-py-groceries/pipeline.py": "# The Pipeline knows the ORDER of the filters, not what any of them does.\n\n\nclass Pipeline:\n    def __init__(self):\n        self.filters = []\n\n    def add(self, step):\n        self.filters.append(step)\n        return self\n\n    def run(self, items):\n        data = items\n        for step in self.filters:\n            data = step(data)\n        return data\n",
            "pipes-and-filters-py-groceries/sink.py": "# The Sink: the end of the line. It only consumes the finished data.\n\n\ndef print_list(items):\n    print(\"Shopping list:\")\n    for number, item in enumerate(items, start=1):\n        print(f\"  {number}. {item}\")\n",
            "pipes-and-filters-py-groceries/source.py": "# The Source: where raw, messy data enters the pipeline.\nRAW_NOTE = \"\"\"\n  Milk\neggs\n   BREAD\n\nEggs\n  apples  \nmilk\n\"\"\"\n\n\ndef read_lines():\n    return RAW_NOTE.split(\"\\n\")\n"
          }
        },
        {
          "id": "pipes-and-filters-go-logs",
          "title": "Streaming log alerts with channels",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "Server log lines stream through parse, onlyErrors and enrich stages, each in its own goroutine, joined by channels. Go channels are literal pipes, and every stage works at the same time.",
          "roles": {
            "Source": [
              "pipes-and-filters-go-logs/source.go#readLines",
              "pipes-and-filters-go-logs/source.go#rawLog"
            ],
            "Filter": [
              "pipes-and-filters-go-logs/filters.go#parse",
              "pipes-and-filters-go-logs/filters.go#onlyErrors",
              "pipes-and-filters-go-logs/filters.go#enrich"
            ],
            "Pipe": [
              "pipes-and-filters-go-logs/entry.go#Entry"
            ],
            "Pipeline": [
              "pipes-and-filters-go-logs/main.go#main"
            ],
            "Sink": [
              "pipes-and-filters-go-logs/sink.go#countByTeam"
            ]
          },
          "trace": [
            {
              "at": "pipes-and-filters-go-logs/main.go#main",
              "say": "main() plugs each stage's output channel into the next stage's input. The wiring reads like a Unix pipe."
            },
            {
              "at": "pipes-and-filters-go-logs/source.go#readLines",
              "say": "The source starts a goroutine that sends raw lines into a channel and closes it at the end."
            },
            {
              "at": "pipes-and-filters-go-logs/filters.go#parse",
              "say": "parse() turns text into Entry structs. It only knows its input and output channels."
            },
            {
              "at": "pipes-and-filters-go-logs/filters.go#onlyErrors",
              "say": "onlyErrors() drops INFO and WARN. Filtering early means later stages do less work."
            },
            {
              "at": "pipes-and-filters-go-logs/filters.go#enrich",
              "say": "enrich() reads the owners table and adds a team name, a typical ETL 'join' step."
            },
            {
              "at": "pipes-and-filters-go-logs/sink.go#countByTeam",
              "say": "The sink drains the last channel. Closed channels end each range loop, so the stream stops cleanly."
            }
          ],
          "files": {
            "pipes-and-filters-go-logs/entry.go": "package main\n\n// Entry is the structured record that flows between the later filters.\ntype Entry struct {\n\tLevel   string\n\tService string\n\tMessage string\n\tTeam    string\n}\n",
            "pipes-and-filters-go-logs/filters.go": "package main\n\nimport \"strings\"\n\n// owners is lookup data used by the enrich filter.\nvar owners = map[string]string{\n\t\"checkout\": \"team-cart\",\n\t\"payments\": \"team-money\",\n\t\"search\":   \"team-find\",\n}\n\n// parse turns text lines into Entry values. It reads one pipe and writes another.\nfunc parse(in <-chan string) <-chan Entry {\n\tout := make(chan Entry)\n\tgo func() {\n\t\tfor line := range in {\n\t\t\tparts := strings.Fields(line)\n\t\t\tout <- Entry{Level: parts[0], Service: parts[1], Message: strings.Join(parts[2:], \" \")}\n\t\t}\n\t\tclose(out)\n\t}()\n\treturn out\n}\n\n// onlyErrors drops everything that is not an ERROR.\nfunc onlyErrors(in <-chan Entry) <-chan Entry {\n\tout := make(chan Entry)\n\tgo func() {\n\t\tfor e := range in {\n\t\t\tif e.Level == \"ERROR\" {\n\t\t\t\tout <- e\n\t\t\t}\n\t\t}\n\t\tclose(out)\n\t}()\n\treturn out\n}\n\n// enrich adds the owning team, so the sink can route alerts.\nfunc enrich(in <-chan Entry) <-chan Entry {\n\tout := make(chan Entry)\n\tgo func() {\n\t\tfor e := range in {\n\t\t\te.Team = owners[e.Service]\n\t\t\tout <- e\n\t\t}\n\t\tclose(out)\n\t}()\n\treturn out\n}\n",
            "pipes-and-filters-go-logs/main.go": "package main\n\nimport \"fmt\"\n\n// main connects the stages. Each stage runs in its own goroutine, so all of them work at the same time.\nfunc main() {\n\tlines := readLines()\n\tentries := parse(lines)\n\terrors := onlyErrors(entries)\n\trouted := enrich(errors)\n\tcounts := countByTeam(routed)\n\tfmt.Println(\"errors per team:\", counts)\n}\n",
            "pipes-and-filters-go-logs/sink.go": "package main\n\nimport \"fmt\"\n\n// countByTeam is the Sink: it drains the last pipe and produces the final report.\nfunc countByTeam(in <-chan Entry) map[string]int {\n\tcounts := map[string]int{}\n\tfor e := range in {\n\t\tcounts[e.Team]++\n\t\tfmt.Printf(\"[%s] %s: %s\\n\", e.Team, e.Service, e.Message)\n\t}\n\treturn counts\n}\n",
            "pipes-and-filters-go-logs/source.go": "package main\n\n// rawLog is what a server might write to disk: one event per line.\nvar rawLog = []string{\n\t\"INFO  checkout  order 1042 paid\",\n\t\"ERROR payments  card declined for order 1043\",\n\t\"WARN  search    slow query 900ms\",\n\t\"ERROR checkout  stock service timeout\",\n\t\"ERROR payments  card declined for order 1050\",\n}\n\n// readLines is the Source. It pushes each line into a channel (the first pipe) and closes it when done.\nfunc readLines() <-chan string {\n\tout := make(chan string)\n\tgo func() {\n\t\tfor _, line := range rawLog {\n\t\t\tout <- line\n\t\t}\n\t\tclose(out)\n\t}()\n\treturn out\n}\n"
          }
        },
        {
          "id": "pipes-and-filters-trough-real",
          "title": "trough: the pipeline inside unified",
          "lang": "JavaScript",
          "level": "intermediate",
          "source": {
            "repo": "wooorm/trough",
            "url": "https://github.com/wooorm/trough/blob/2.2.0/lib/index.js",
            "license": "MIT",
            "note": "trough/index.js is verbatim from trough 2.2.0 (only the source header was added); usage.js was written for Software City."
          },
          "story": "Real code from the small library that runs the plugin pipeline in unified (remark, rehype). Filters can return a value, return a promise, or call done(), and trough's wrap() makes them all look the same.",
          "roles": {
            "Filter": [
              "pipes-and-filters-trough-real/usage.js#trimText",
              "pipes-and-filters-trough-real/usage.js#lowerCase",
              "pipes-and-filters-trough-real/usage.js#slugify"
            ],
            "Pipe": [
              "pipes-and-filters-trough-real/trough/index.js#wrap"
            ],
            "Pipeline": [
              "pipes-and-filters-trough-real/trough/index.js#trough"
            ],
            "Sink": [
              "pipes-and-filters-trough-real/usage.js#report"
            ],
            "Source": [
              "pipes-and-filters-trough-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "pipes-and-filters-trough-real/usage.js#run",
              "say": "run() builds a pipeline with three filters and pushes one string in, with report as the final callback."
            },
            {
              "at": "pipes-and-filters-trough-real/trough/index.js#use",
              "say": "use() pushes each filter onto the fns array and returns the pipeline, so calls can be chained."
            },
            {
              "at": "pipes-and-filters-trough-real/trough/index.js#next",
              "say": "next() takes the next filter by index, saves the latest output as the new values, and runs it."
            },
            {
              "at": "pipes-and-filters-trough-real/trough/index.js#wrapped",
              "say": "wrapped() checks the filter's arity: if it wants an extra argument it gets done(), otherwise its return value is used."
            },
            {
              "at": "pipes-and-filters-trough-real/usage.js#lowerCase",
              "say": "lowerCase returns a promise; wrap() waits for it with then() before the next filter runs."
            },
            {
              "at": "pipes-and-filters-trough-real/usage.js#slugify",
              "say": "slugify asks for done, so trough waits until it calls back. Three styles, one uniform pipe."
            },
            {
              "at": "pipes-and-filters-trough-real/usage.js#report",
              "say": "With no filters left, next() calls the final callback: the sink receives 'pipes-filters-explained'."
            }
          ],
          "files": {
            "pipes-and-filters-trough-real/trough/index.js": "// Source: trough 2.2.0 — https://github.com/wooorm/trough/blob/2.2.0/lib/index.js\n// MIT License, Copyright (c) 2016 Titus Wormer. Included for study.\n// To do: remove `void`s\n// To do: remove `null` from output of our APIs, allow it as user APIs.\n\n/**\n * @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback\n *   Callback.\n *\n * @typedef {(...input: Array<any>) => any} Middleware\n *   Ware.\n *\n * @typedef Pipeline\n *   Pipeline.\n * @property {Run} run\n *   Run the pipeline.\n * @property {Use} use\n *   Add middleware.\n *\n * @typedef {(...input: Array<any>) => void} Run\n *   Call all middleware.\n *\n *   Calls `done` on completion with either an error or the output of the\n *   last middleware.\n *\n *   > 👉 **Note**: as the length of input defines whether async functions get a\n *   > `next` function,\n *   > it’s recommended to keep `input` at one value normally.\n\n *\n * @typedef {(fn: Middleware) => Pipeline} Use\n *   Add middleware.\n */\n\n/**\n * Create new middleware.\n *\n * @returns {Pipeline}\n *   Pipeline.\n */\nexport function trough() {\n  /** @type {Array<Middleware>} */\n  const fns = []\n  /** @type {Pipeline} */\n  const pipeline = {run, use}\n\n  return pipeline\n\n  /** @type {Run} */\n  function run(...values) {\n    let middlewareIndex = -1\n    /** @type {Callback} */\n    const callback = values.pop()\n\n    if (typeof callback !== 'function') {\n      throw new TypeError('Expected function as last argument, not ' + callback)\n    }\n\n    next(null, ...values)\n\n    /**\n     * Run the next `fn`, or we’re done.\n     *\n     * @param {Error | null | undefined} error\n     * @param {Array<any>} output\n     */\n    function next(error, ...output) {\n      const fn = fns[++middlewareIndex]\n      let index = -1\n\n      if (error) {\n        callback(error)\n        return\n      }\n\n      // Copy non-nullish input into values.\n      while (++index < values.length) {\n        if (output[index] === null || output[index] === undefined) {\n          output[index] = values[index]\n        }\n      }\n\n      // Save the newly created `output` for the next call.\n      values = output\n\n      // Next or done.\n      if (fn) {\n        wrap(fn, next)(...output)\n      } else {\n        callback(null, ...output)\n      }\n    }\n  }\n\n  /** @type {Use} */\n  function use(middelware) {\n    if (typeof middelware !== 'function') {\n      throw new TypeError(\n        'Expected `middelware` to be a function, not ' + middelware\n      )\n    }\n\n    fns.push(middelware)\n    return pipeline\n  }\n}\n\n/**\n * Wrap `middleware` into a uniform interface.\n *\n * You can pass all input to the resulting function.\n * `callback` is then called with the output of `middleware`.\n *\n * If `middleware` accepts more arguments than the later given in input,\n * an extra `done` function is passed to it after that input,\n * which must be called by `middleware`.\n *\n * The first value in `input` is the main input value.\n * All other input values are the rest input values.\n * The values given to `callback` are the input values,\n * merged with every non-nullish output value.\n *\n * * if `middleware` throws an error,\n *   returns a promise that is rejected,\n *   or calls the given `done` function with an error,\n *   `callback` is called with that error\n * * if `middleware` returns a value or returns a promise that is resolved,\n *   that value is the main output value\n * * if `middleware` calls `done`,\n *   all non-nullish values except for the first one (the error) overwrite the\n *   output values\n *\n * @param {Middleware} middleware\n *   Function to wrap.\n * @param {Callback} callback\n *   Callback called with the output of `middleware`.\n * @returns {Run}\n *   Wrapped middleware.\n */\nexport function wrap(middleware, callback) {\n  /** @type {boolean} */\n  let called\n\n  return wrapped\n\n  /**\n   * Call `middleware`.\n   * @this {any}\n   * @param {Array<any>} parameters\n   * @returns {void}\n   */\n  function wrapped(...parameters) {\n    const fnExpectsCallback = middleware.length > parameters.length\n    /** @type {any} */\n    let result\n\n    if (fnExpectsCallback) {\n      parameters.push(done)\n    }\n\n    try {\n      result = middleware.apply(this, parameters)\n    } catch (error) {\n      const exception = /** @type {Error} */ (error)\n\n      // Well, this is quite the pickle.\n      // `middleware` received a callback and called it synchronously, but that\n      // threw an error.\n      // The only thing left to do is to throw the thing instead.\n      if (fnExpectsCallback && called) {\n        throw exception\n      }\n\n      return done(exception)\n    }\n\n    if (!fnExpectsCallback) {\n      if (result && result.then && typeof result.then === 'function') {\n        result.then(then, done)\n      } else if (result instanceof Error) {\n        done(result)\n      } else {\n        then(result)\n      }\n    }\n  }\n\n  /**\n   * Call `callback`, only once.\n   *\n   * @type {Callback}\n   */\n  function done(error, ...output) {\n    if (!called) {\n      called = true\n      callback(error, ...output)\n    }\n  }\n\n  /**\n   * Call `done` with one value.\n   *\n   * @param {any} [value]\n   */\n  function then(value) {\n    done(null, value)\n  }\n}\n",
            "pipes-and-filters-trough-real/usage.js": "// Example usage written for Software City (not part of trough).\n// trough is the pipeline engine inside unified, the tool chain behind remark and rehype.\nimport {trough} from './trough/index.js'\n\n// A synchronous filter: return the new value.\nfunction trimText(text) {\n  return text.trim()\n}\n\n// An async filter: return a promise.\nfunction lowerCase(text) {\n  return Promise.resolve(text.toLowerCase())\n}\n\n// A callback filter: it asks for one more argument than it gets, so trough hands it `done`.\nfunction slugify(text, done) {\n  setTimeout(function () {\n    done(null, text.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))\n  }, 10)\n}\n\n// The sink: trough calls this with the output of the last filter (or the first error).\nfunction report(error, slug) {\n  if (error) throw error\n  console.log('slug:', slug)\n}\n\nexport function run() {\n  const pipeline = trough().use(trimText).use(lowerCase).use(slugify)\n  pipeline.run('  Pipes & Filters, Explained!  ', report)\n}\n\nrun()\n"
          }
        }
      ]
    },
    {
      "id": "pub-sub",
      "name": "Publish–Subscribe",
      "family": "Architecture",
      "aka": [
        "Pub/Sub",
        "Event bus",
        "Message broker",
        "Topic-based messaging"
      ],
      "tagline": "Senders publish to a topic on a broker; receivers subscribe to topics, never to senders.",
      "intent": "Put a broker (event bus) between the code that announces things and the code that reacts. Publishers send messages to named topics and subscribers register for topics, so neither side holds a reference to the other and either can be added or removed freely.",
      "analogy": "A radio station: the DJ broadcasts on 98.1 FM without knowing who is listening, and listeners tune in to a frequency, not to a DJ. The frequency is the topic, the airwaves are the broker.",
      "cityShape": "Look for one broker building in the middle with a subscribers/topics antenna on its roof. Publisher and subscriber buildings all send arcs to the broker (and to a small topics building), but no arcs run directly between publishers and subscribers. subscribe() floors write into the broker's map; publish() floors read it.",
      "roles": [
        {
          "name": "Broker",
          "desc": "The event bus in the middle. Keeps a map from topic to subscribers and delivers each message."
        },
        {
          "name": "Publisher",
          "desc": "Sends a message to a topic. Does not know who, if anyone, will receive it."
        },
        {
          "name": "Subscriber",
          "desc": "Registers a handler for a topic and reacts when a message arrives."
        },
        {
          "name": "Topic",
          "desc": "The agreed name (channel) that links publishers and subscribers, often a string constant."
        }
      ],
      "whenToUse": [
        "Many unrelated parts of a program react to the same events (score changes, user logged in, order placed).",
        "Senders and receivers live in different modules, scenes or services and should not import each other.",
        "You want to add analytics, logging or achievements later without touching the code that raises the events.",
        "Messages may be delivered later (queued) or across processes, as with Redis, MQTT or Kafka."
      ],
      "pitfalls": [
        "Topic names are stringly typed: a typo means a message silently reaches nobody. Keep them in constants.",
        "Flow becomes invisible: you cannot see from the publisher who reacts, so debugging needs logging on the bus.",
        "A global bus makes it tempting to send everything through it, even calls that should be plain function calls."
      ],
      "related": [
        "observer",
        "mediator",
        "flux-store",
        "client-server"
      ],
      "quiz": [
        {
          "q": "What is the key difference between Observer and Publish–Subscribe?",
          "options": [
            "Pub-sub can only send strings",
            "In Observer, subscribers attach to the subject itself; in pub-sub, both sides only know a broker and a topic name",
            "Observer is asynchronous, pub-sub is always synchronous",
            "There is no difference"
          ],
          "answer": 1,
          "why": "An observer holds a direct link to the subject. In pub-sub a broker sits in between, so publishers and subscribers never reference each other."
        },
        {
          "q": "A coin publishes 'coin.collected' but the HUD never updates. What is the most likely cause?",
          "options": [
            "The coin needs a reference to the HUD",
            "The HUD subscribed to a slightly different topic name, or subscribed after the message was sent",
            "The broker must be a singleton class",
            "Publishers must wait for subscribers to return"
          ],
          "answer": 1,
          "why": "Topics are matched by name and only current subscribers receive a message, so typos and late subscription are the classic bugs."
        }
      ],
      "demos": [
        {
          "id": "pub-sub-ts-newsroom",
          "title": "Newsroom topics",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A reporter files stories to topics like news/sports; readers subscribe to the topics they care about. Notice that reporter.ts and readers.ts never import each other: both only import the broker.",
          "roles": {
            "Broker": [
              "pub-sub-ts-newsroom/broker.ts#Broker"
            ],
            "Publisher": [
              "pub-sub-ts-newsroom/reporter.ts#Reporter"
            ],
            "Subscriber": [
              "pub-sub-ts-newsroom/readers.ts#SportsFan",
              "pub-sub-ts-newsroom/readers.ts#Commuter"
            ],
            "Topic": [
              "pub-sub-ts-newsroom/topics.ts#SPORTS",
              "pub-sub-ts-newsroom/topics.ts#WEATHER"
            ]
          },
          "trace": [
            {
              "at": "pub-sub-ts-newsroom/main.ts#main",
              "say": "main() creates one broker and hands it to every reader and reporter. That is the only shared object."
            },
            {
              "at": "pub-sub-ts-newsroom/readers.ts#Commuter.constructor",
              "say": "The commuter subscribes to two topics. It registers with the broker, not with any reporter."
            },
            {
              "at": "pub-sub-ts-newsroom/broker.ts#Broker.subscribe",
              "say": "subscribe() adds the handler to the list stored under that topic name in the topics map."
            },
            {
              "at": "pub-sub-ts-newsroom/reporter.ts#Reporter.file",
              "say": "The reporter files a sports story. It only names a topic and has no idea who reads it."
            },
            {
              "at": "pub-sub-ts-newsroom/broker.ts#Broker.publish",
              "say": "publish() looks up the topic and calls every handler on its list."
            },
            {
              "at": "pub-sub-ts-newsroom/readers.ts#SportsFan.cheer",
              "say": "The sports fan reacts. The commuter reacts to the same message in its own way."
            },
            {
              "at": "pub-sub-ts-newsroom/broker.ts#Broker.publish",
              "say": "The politics story finds no subscribers and returns 0. Publishing to an empty topic is allowed and silent."
            }
          ],
          "files": {
            "pub-sub-ts-newsroom/broker.ts": "// The Broker sits in the middle. It maps topic names to lists of handlers.\nexport type Handler = (headline: string) => void;\n\nexport class Broker {\n  private topics: Map<string, Handler[]> = new Map();\n\n  subscribe(topic: string, handler: Handler): void {\n    const list = this.topics.get(topic) ?? [];\n    list.push(handler);\n    this.topics.set(topic, list);\n  }\n\n  publish(topic: string, headline: string): number {\n    const list = this.topics.get(topic) ?? [];\n    for (const handler of list) {\n      handler(headline);\n    }\n    return list.length;\n  }\n}\n",
            "pub-sub-ts-newsroom/main.ts": "import { Broker } from './broker';\nimport { Reporter } from './reporter';\nimport { SportsFan, Commuter } from './readers';\nimport { SPORTS, WEATHER } from './topics';\n\nfunction main(): void {\n  const broker = new Broker();\n  new SportsFan(broker);\n  new Commuter(broker);\n\n  const ana = new Reporter(broker, 'Ana');\n  ana.file(SPORTS, 'Local team wins the cup');\n  ana.file(WEATHER, 'Snow expected tonight');\n  ana.file('news/politics', 'Budget vote delayed');\n}\n\nmain();\n",
            "pub-sub-ts-newsroom/readers.ts": "import { Broker } from './broker';\nimport { SPORTS, WEATHER } from './topics';\n\n// Subscribers. They sign up for topics through the broker, never through a reporter.\nexport class SportsFan {\n  constructor(broker: Broker) {\n    broker.subscribe(SPORTS, (h) => this.cheer(h));\n  }\n\n  cheer(headline: string): void {\n    console.log('Sports fan: ' + headline + '!!');\n  }\n}\n\nexport class Commuter {\n  constructor(broker: Broker) {\n    broker.subscribe(WEATHER, (h) => this.planRoute(h));\n    broker.subscribe(SPORTS, (h) => this.planRoute(h));\n  }\n\n  planRoute(headline: string): void {\n    console.log('Commuter checks traffic after: ' + headline);\n  }\n}\n",
            "pub-sub-ts-newsroom/reporter.ts": "import { Broker } from './broker';\n\n// A Publisher. It knows the broker and a topic name, never who reads the story.\nexport class Reporter {\n  private broker: Broker;\n  private name: string;\n\n  constructor(broker: Broker, name: string) {\n    this.broker = broker;\n    this.name = name;\n  }\n\n  file(topic: string, headline: string): void {\n    const readers = this.broker.publish(topic, `${headline} (by ${this.name})`);\n    console.log(`${this.name} filed a story; ${readers} reader(s) got it.`);\n  }\n}\n",
            "pub-sub-ts-newsroom/topics.ts": "// Topics are just agreed-upon names. Publishers and subscribers share these, not each other.\nexport const SPORTS = 'news/sports';\nexport const WEATHER = 'news/weather';\n"
          }
        },
        {
          "id": "pub-sub-gd-eventbus",
          "title": "Godot event bus autoload",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A global EventBus autoload queues messages and delivers them in _process. Coins publish, the HUD subscribes, and the achievement system does both. No scene needs a NodePath to another.",
          "roles": {
            "Broker": [
              "pub-sub-gd-eventbus/event_bus.gd#publish",
              "pub-sub-gd-eventbus/event_bus.gd#_deliver",
              "pub-sub-gd-eventbus/event_bus.gd#_subscribers"
            ],
            "Publisher": [
              "pub-sub-gd-eventbus/coin.gd#_on_body_entered",
              "pub-sub-gd-eventbus/achievements.gd#_on_coin_collected"
            ],
            "Subscriber": [
              "pub-sub-gd-eventbus/hud.gd#_on_coin_collected",
              "pub-sub-gd-eventbus/hud.gd#_on_achievement",
              "pub-sub-gd-eventbus/achievements.gd#_on_coin_collected"
            ],
            "Topic": [
              "pub-sub-gd-eventbus/topics.gd"
            ]
          },
          "trace": [
            {
              "at": "pub-sub-gd-eventbus/hud.gd#_ready",
              "say": "The HUD subscribes to two topics on the autoload. It never searches the tree for coins."
            },
            {
              "at": "pub-sub-gd-eventbus/event_bus.gd#subscribe",
              "say": "subscribe() stores the Callable in a Dictionary keyed by topic name."
            },
            {
              "at": "pub-sub-gd-eventbus/coin.gd#_on_body_entered",
              "say": "The player touches a coin. It publishes coin.collected with a payload and frees itself."
            },
            {
              "at": "pub-sub-gd-eventbus/event_bus.gd#publish",
              "say": "publish() only queues the message, so the coin can be freed safely before anyone reacts."
            },
            {
              "at": "pub-sub-gd-eventbus/event_bus.gd#_process",
              "say": "Next frame the bus swaps out the queue and delivers each message. Delivery is decoupled in time too."
            },
            {
              "at": "pub-sub-gd-eventbus/event_bus.gd#_deliver",
              "say": "_deliver() calls every valid handler for the topic, skipping ones whose node was freed."
            },
            {
              "at": "pub-sub-gd-eventbus/achievements.gd#_on_coin_collected",
              "say": "Achievements counts coins and, on the tenth, publishes a new topic: subscribers can be publishers too."
            },
            {
              "at": "pub-sub-gd-eventbus/hud.gd#_on_achievement",
              "say": "The HUD shows a toast. Coin, achievements and HUD never referenced one another."
            }
          ],
          "files": {
            "pub-sub-gd-eventbus/achievements.gd": "# Both a Subscriber and a Publisher: it hears coins and announces achievements.\nextends Node\n\nconst Topics = preload(\"res://topics.gd\")\n\nvar coins_seen := 0\n\nfunc _ready() -> void:\n\tEventBus.subscribe(Topics.COIN_COLLECTED, _on_coin_collected)\n\nfunc _exit_tree() -> void:\n\tEventBus.unsubscribe(Topics.COIN_COLLECTED, _on_coin_collected)\n\nfunc _on_coin_collected(_payload: Dictionary) -> void:\n\tcoins_seen += 1\n\tif coins_seen == 10:\n\t\tEventBus.publish(Topics.ACHIEVEMENT_UNLOCKED, {\"title\": \"Treasure Hunter\"})\n",
            "pub-sub-gd-eventbus/coin.gd": "# A Publisher. The coin does not know a HUD, a sound or an achievement system exists.\nextends Area2D\n\nconst Topics = preload(\"res://topics.gd\")\n\n@export var value := 10\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.is_in_group(\"player\"):\n\t\tEventBus.publish(Topics.COIN_COLLECTED, {\"value\": value, \"where\": global_position})\n\t\tqueue_free()\n",
            "pub-sub-gd-eventbus/event_bus.gd": "# Autoload this script as \"EventBus\" (Project Settings > Autoload).\n# It is the Broker: everyone talks to it, nobody talks to each other.\nextends Node\n\nvar _subscribers := {}\nvar _queue: Array = []\n\nfunc subscribe(topic: String, handler: Callable) -> void:\n\tif not _subscribers.has(topic):\n\t\t_subscribers[topic] = []\n\t_subscribers[topic].append(handler)\n\nfunc unsubscribe(topic: String, handler: Callable) -> void:\n\tif _subscribers.has(topic):\n\t\t_subscribers[topic].erase(handler)\n\n# Publishing only queues the message. Delivery happens later in _process,\n# so a publisher never waits for (or crashes inside) a subscriber.\nfunc publish(topic: String, payload: Dictionary = {}) -> void:\n\t_queue.append([topic, payload])\n\nfunc _process(_delta: float) -> void:\n\tvar batch := _queue\n\t_queue = []\n\tfor message in batch:\n\t\t_deliver(message[0], message[1])\n\nfunc _deliver(topic: String, payload: Dictionary) -> void:\n\tfor handler in _subscribers.get(topic, []):\n\t\tif handler.is_valid():\n\t\t\thandler.call(payload)\n",
            "pub-sub-gd-eventbus/hud.gd": "# A Subscriber. It listens to topics on the bus, not to coins.\nextends CanvasLayer\n\nconst Topics = preload(\"res://topics.gd\")\n\nvar score := 0\n\nfunc _ready() -> void:\n\tEventBus.subscribe(Topics.COIN_COLLECTED, _on_coin_collected)\n\tEventBus.subscribe(Topics.ACHIEVEMENT_UNLOCKED, _on_achievement)\n\nfunc _on_coin_collected(payload: Dictionary) -> void:\n\tscore += payload[\"value\"]\n\t$ScoreLabel.text = \"Score: %d\" % score\n\nfunc _on_achievement(payload: Dictionary) -> void:\n\t$Toast.text = \"Unlocked: \" + payload[\"title\"]\n\t$Toast.show()\n",
            "pub-sub-gd-eventbus/topics.gd": "# Topic names in one place, so a typo becomes a compile error instead of a silent miss.\n\nconst COIN_COLLECTED := \"coin.collected\"\nconst ACHIEVEMENT_UNLOCKED := \"achievement.unlocked\"\n"
          }
        },
        {
          "id": "pub-sub-pubsubjs-real",
          "title": "PubSubJS: topic-based messaging",
          "lang": "JavaScript",
          "level": "intermediate",
          "source": {
            "repo": "mroderick/PubSubJS",
            "url": "https://github.com/mroderick/PubSubJS/blob/v1.9.5/src/pubsub.js",
            "license": "MIT",
            "note": "pubsub/pubsub.js is verbatim from PubSubJS 1.9.5 with JSDoc, module-export boilerplate and inspection helpers trimmed (marked). topics.js, cart.js, listeners.js and main.js were written for Software City."
          },
          "story": "A real, long-lived pub-sub library. Topics are dotted strings, so a subscriber to 'cart' also hears 'cart.item.added'. publish() is asynchronous by default; publishSync() delivers immediately.",
          "roles": {
            "Broker": [
              "pub-sub-pubsubjs-real/pubsub/pubsub.js#publish",
              "pub-sub-pubsubjs-real/pubsub/pubsub.js#deliverMessage",
              "pub-sub-pubsubjs-real/pubsub/pubsub.js#createDeliveryFunction"
            ],
            "Publisher": [
              "pub-sub-pubsubjs-real/cart.js#addItem",
              "pub-sub-pubsubjs-real/cart.js#checkout"
            ],
            "Subscriber": [
              "pub-sub-pubsubjs-real/listeners.js#updateBadge",
              "pub-sub-pubsubjs-real/listeners.js#sendReceipt",
              "pub-sub-pubsubjs-real/listeners.js#analytics"
            ],
            "Topic": [
              "pub-sub-pubsubjs-real/topics.js#ITEM_ADDED",
              "pub-sub-pubsubjs-real/topics.js#CHECKOUT",
              "pub-sub-pubsubjs-real/topics.js#CART"
            ]
          },
          "trace": [
            {
              "at": "pub-sub-pubsubjs-real/main.js#main",
              "say": "main() starts the listeners and uses the cart. It never connects the two; the topic names do that."
            },
            {
              "at": "pub-sub-pubsubjs-real/listeners.js#registerListeners",
              "say": "PubSub.subscribe stores each handler in the messages object under its topic, with a unique token for unsubscribing."
            },
            {
              "at": "pub-sub-pubsubjs-real/cart.js#addItem",
              "say": "The cart publishes cart.item.added with publishSync, so delivery happens right now."
            },
            {
              "at": "pub-sub-pubsubjs-real/pubsub/pubsub.js#publish",
              "say": "publish() first asks messageHasSubscribers(); if nobody listens it returns false and does nothing."
            },
            {
              "at": "pub-sub-pubsubjs-real/pubsub/pubsub.js#createDeliveryFunction",
              "say": "The delivery function walks up the dotted name: cart.item.added, then cart.item, then cart, then '*'."
            },
            {
              "at": "pub-sub-pubsubjs-real/pubsub/pubsub.js#deliverMessage",
              "say": "deliverMessage() calls every subscriber for one level of the hierarchy, catching errors so one bad handler cannot stop the rest."
            },
            {
              "at": "pub-sub-pubsubjs-real/listeners.js#analytics",
              "say": "analytics subscribed to plain 'cart', so it hears every cart.* message: hierarchical topics in action."
            },
            {
              "at": "pub-sub-pubsubjs-real/cart.js#checkout",
              "say": "checkout() uses async publish via setTimeout. main() unsubscribes analytics before it fires, so only sendReceipt hears it."
            }
          ],
          "files": {
            "pub-sub-pubsubjs-real/cart.js": "// Written for Software City (not part of PubSubJS). A publisher: it only knows topic names.\nimport PubSub from './pubsub/pubsub.js'\nimport { ITEM_ADDED, CHECKOUT } from './topics.js'\n\nconst items = []\n\nexport function addItem(name, price) {\n  items.push({ name, price })\n  PubSub.publishSync(ITEM_ADDED, { name, price, count: items.length })\n}\n\nexport function checkout() {\n  const total = items.reduce((sum, item) => sum + item.price, 0)\n  PubSub.publish(CHECKOUT, { total })\n}\n",
            "pub-sub-pubsubjs-real/listeners.js": "// Written for Software City (not part of PubSubJS). Subscribers: none of them imports cart.js.\nimport PubSub from './pubsub/pubsub.js'\nimport { CART, ITEM_ADDED, CHECKOUT } from './topics.js'\n\nfunction updateBadge(topic, data) {\n  console.log('badge shows', data.count, 'items')\n}\n\nfunction sendReceipt(topic, data) {\n  console.log('emailing receipt for', data.total)\n}\n\nfunction analytics(topic, data) {\n  console.log('[analytics]', topic, data)\n}\n\nexport function registerListeners() {\n  PubSub.subscribe(ITEM_ADDED, updateBadge)\n  PubSub.subscribe(CHECKOUT, sendReceipt)\n  return PubSub.subscribe(CART, analytics)\n}\n",
            "pub-sub-pubsubjs-real/main.js": "// Written for Software City (not part of PubSubJS). Wires nothing together directly:\n// it only starts the listeners and then uses the cart.\nimport PubSub from './pubsub/pubsub.js'\nimport { registerListeners } from './listeners.js'\nimport { addItem, checkout } from './cart.js'\n\nfunction main() {\n  const analyticsToken = registerListeners()\n  addItem('Tea', 4)\n  addItem('Mug', 9)\n  checkout()\n  PubSub.unsubscribe(analyticsToken)\n}\n\nmain()\n",
            "pub-sub-pubsubjs-real/pubsub/pubsub.js": "// Source: PubSubJS 1.9.5 — https://github.com/mroderick/PubSubJS/blob/v1.9.5/src/pubsub.js\n// MIT License, Copyright (c) 2010 Morgan Roderick. Included for study.\n/**\n * Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk\n * License: MIT - http://mrgnrdrck.mit-license.org\n *\n * https://github.com/mroderick/PubSubJS\n */\n\n(function (root, factory){\n    'use strict';\n\n    var PubSub = {};\n\n    if (root.PubSub) {\n        PubSub = root.PubSub;\n        console.warn(\"PubSub already loaded, using existing version\");\n    } else {\n        root.PubSub = PubSub;\n        factory(PubSub);\n    }\n    // … trimmed: 14 lines of CommonJS/AMD module export boilerplate …\n\n}(( typeof window === 'object' && window ) || this || global, function (PubSub){\n    'use strict';\n\n    var messages = {},\n        lastUid = -1,\n        ALL_SUBSCRIBING_MSG = '*';\n\n    function hasKeys(obj){\n        var key;\n\n        for (key in obj){\n            if ( Object.prototype.hasOwnProperty.call(obj, key) ){\n                return true;\n            }\n        }\n        return false;\n    }\n\n    // … trimmed: 6 lines of JSDoc …\n    function throwException( ex ){\n        return function reThrowException(){\n            throw ex;\n        };\n    }\n\n    function callSubscriberWithDelayedExceptions( subscriber, message, data ){\n        try {\n            subscriber( message, data );\n        } catch( ex ){\n            setTimeout( throwException( ex ), 0);\n        }\n    }\n\n    function callSubscriberWithImmediateExceptions( subscriber, message, data ){\n        subscriber( message, data );\n    }\n\n    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){\n        var subscribers = messages[matchedMessage],\n            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,\n            s;\n\n        if ( !Object.prototype.hasOwnProperty.call( messages, matchedMessage ) ) {\n            return;\n        }\n\n        for (s in subscribers){\n            if ( Object.prototype.hasOwnProperty.call(subscribers, s)){\n                callSubscriber( subscribers[s], originalMessage, data );\n            }\n        }\n    }\n\n    function createDeliveryFunction( message, data, immediateExceptions ){\n        return function deliverNamespaced(){\n            var topic = String( message ),\n                position = topic.lastIndexOf( '.' );\n\n            // deliver the message as it is now\n            deliverMessage(message, message, data, immediateExceptions);\n\n            // trim the hierarchy and deliver message to each level\n            while( position !== -1 ){\n                topic = topic.substr( 0, position );\n                position = topic.lastIndexOf('.');\n                deliverMessage( message, topic, data, immediateExceptions );\n            }\n\n            deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);\n        };\n    }\n\n    function hasDirectSubscribersFor( message ) {\n        var topic = String( message ),\n            found = Boolean(Object.prototype.hasOwnProperty.call( messages, topic ) && hasKeys(messages[topic]));\n\n        return found;\n    }\n\n    function messageHasSubscribers( message ){\n        var topic = String( message ),\n            found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG),\n            position = topic.lastIndexOf( '.' );\n\n        while ( !found && position !== -1 ){\n            topic = topic.substr( 0, position );\n            position = topic.lastIndexOf( '.' );\n            found = hasDirectSubscribersFor(topic);\n        }\n\n        return found;\n    }\n\n    function publish( message, data, sync, immediateExceptions ){\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        var deliver = createDeliveryFunction( message, data, immediateExceptions ),\n            hasSubscribers = messageHasSubscribers( message );\n\n        if ( !hasSubscribers ){\n            return false;\n        }\n\n        if ( sync === true ){\n            deliver();\n        } else {\n            setTimeout( deliver, 0 );\n        }\n        return true;\n    }\n\n    // … trimmed: 8 lines of JSDoc …\n    PubSub.publish = function( message, data ){\n        return publish( message, data, false, PubSub.immediateExceptions );\n    };\n\n    // … trimmed: 8 lines of JSDoc …\n    PubSub.publishSync = function( message, data ){\n        return publish( message, data, true, PubSub.immediateExceptions );\n    };\n\n    // … trimmed: 8 lines of JSDoc …\n    PubSub.subscribe = function( message, func ){\n        if ( typeof func !== 'function'){\n            return false;\n        }\n\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        // message is not registered yet\n        if ( !Object.prototype.hasOwnProperty.call( messages, message ) ){\n            messages[message] = {};\n        }\n\n        // forcing token as String, to allow for future expansions without breaking usage\n        // and allow for easy use as key names for the 'messages' object\n        var token = 'uid_' + String(++lastUid);\n        messages[message][token] = func;\n\n        // return token for unsubscribing\n        return token;\n    };\n\n    PubSub.subscribeAll = function( func ){\n        return PubSub.subscribe(ALL_SUBSCRIBING_MSG, func);\n    };\n\n    // … trimmed: 26 lines (subscribeOnce, clearAllSubscriptions) not needed for the pattern …\n\n    // … trimmed: 7 lines of JSDoc …\n    PubSub.clearSubscriptions = function clearSubscriptions(topic){\n        var m;\n        for (m in messages){\n            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0){\n                delete messages[m];\n            }\n        }\n    };\n\n    // … trimmed: 40 lines (countSubscriptions, getSubscriptions): inspection helpers …\n\n    // … trimmed: 20 lines of JSDoc for unsubscribe(token | function | topic) …\n    PubSub.unsubscribe = function(value){\n        var descendantTopicExists = function(topic) {\n                var m;\n                for ( m in messages ){\n                    if ( Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0 ){\n                        // a descendant of the topic exists:\n                        return true;\n                    }\n                }\n\n                return false;\n            },\n            isTopic    = typeof value === 'string' && ( Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value) ),\n            isToken    = !isTopic && typeof value === 'string',\n            isFunction = typeof value === 'function',\n            result = false,\n            m, message, t;\n\n        if (isTopic){\n            PubSub.clearSubscriptions(value);\n            return;\n        }\n\n        for ( m in messages ){\n            if ( Object.prototype.hasOwnProperty.call( messages, m ) ){\n                message = messages[m];\n\n                if ( isToken && message[value] ){\n                    delete message[value];\n                    result = value;\n                    // tokens are unique, so we can just stop here\n                    break;\n                }\n\n                if (isFunction) {\n                    for ( t in message ){\n                        if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value){\n                            delete message[t];\n                            result = true;\n                        }\n                    }\n                }\n            }\n        }\n\n        return result;\n    };\n}));\n",
            "pub-sub-pubsubjs-real/topics.js": "// Written for Software City (not part of PubSubJS).\n// PubSubJS topics are dotted strings; subscribing to 'cart' also hears 'cart.item.added'.\nexport const CART = 'cart'\nexport const ITEM_ADDED = 'cart.item.added'\nexport const CHECKOUT = 'cart.checkout'\n"
          }
        }
      ]
    },
    {
      "id": "flux-store",
      "name": "Flux / Redux Store",
      "family": "Architecture",
      "aka": [
        "Flux",
        "Redux",
        "Unidirectional data flow",
        "Single store",
        "Elm architecture"
      ],
      "tagline": "State lives in one store; it changes only when an action is dispatched through a reducer.",
      "intent": "Keep all shared application state in a single store and make data flow in one direction: the view dispatches an action, a pure reducer computes the next state, and the store notifies the views. Because every change goes through one door, changes are predictable, loggable and easy to test.",
      "analogy": "A bank account: you cannot edit the balance yourself. You hand the teller a deposit or withdrawal slip (action), the bank's rules (reducer) compute the new balance, and your banking app (view) refreshes.",
      "cityShape": "Look for a loop of pipes that only goes one way: view floors call dispatch(), dispatch() calls the reducer building, and only dispatch() writes the store's state antenna. Every view building reads that one antenna; no view floor ever writes it.",
      "roles": [
        {
          "name": "Action",
          "desc": "A plain data object describing what happened, such as {type: 'todo/add', text}. Often built by small action-creator functions."
        },
        {
          "name": "Reducer",
          "desc": "A pure function (state, action) -> new state. It never mutates the old state and has no side effects."
        },
        {
          "name": "Store",
          "desc": "Holds the single state tree, exposes getState(), subscribe() and dispatch(), and calls the reducer."
        },
        {
          "name": "View",
          "desc": "Reads state to render and dispatches actions in response to the user. It never changes state directly."
        }
      ],
      "whenToUse": [
        "Many screens or components share the same data and must stay in sync (cart badge and checkout page).",
        "You want to log, replay, undo or time-travel through state changes.",
        "State changes are getting hard to follow because any component can modify anything.",
        "You want business rules (the reducers) testable without any UI."
      ],
      "pitfalls": [
        "Boilerplate: small apps pay for actions, reducers and a store they do not need.",
        "Mutating state inside a reducer breaks change detection and makes bugs that only appear sometimes.",
        "Putting everything in the global store, including short-lived UI state like 'is this dropdown open'."
      ],
      "related": [
        "observer",
        "command",
        "mvc",
        "pub-sub",
        "memento"
      ],
      "quiz": [
        {
          "q": "Why must a reducer return a new object instead of changing the old state?",
          "options": [
            "Because JavaScript objects cannot be changed",
            "So that old and new states can be compared cheaply, and history (undo, replay) stays correct",
            "Because the store is read-only for performance",
            "It does not matter either way"
          ],
          "answer": 1,
          "why": "If the old state is never mutated, 'did it change?' is a simple reference check, and earlier states stay valid for logging and time travel."
        },
        {
          "q": "A button needs to add an item to the cart. In a Flux design, what should its click handler do?",
          "options": [
            "Push the item into store.state.items",
            "Call the reducer directly",
            "Dispatch an action such as {type: 'cart/add', item}",
            "Re-render the cart badge itself"
          ],
          "answer": 2,
          "why": "Views describe what happened by dispatching an action. Only the store, via the reducer, turns that into new state, then every subscribed view re-renders."
        }
      ],
      "demos": [
        {
          "id": "flux-store-py-todos",
          "title": "To-do list with a tiny store",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A whole Flux loop in five small files. The view turns clicks into actions, the store runs the reducer and calls render(). Notice that only Store.dispatch ever writes self.state.",
          "roles": {
            "Action": [
              "flux-store-py-todos/actions.py#add_todo",
              "flux-store-py-todos/actions.py#toggle_todo"
            ],
            "Reducer": [
              "flux-store-py-todos/reducer.py#todo_reducer"
            ],
            "Store": [
              "flux-store-py-todos/store.py#Store"
            ],
            "View": [
              "flux-store-py-todos/view.py#render",
              "flux-store-py-todos/view.py#on_user_typed",
              "flux-store-py-todos/view.py#on_user_clicked"
            ]
          },
          "trace": [
            {
              "at": "flux-store-py-todos/main.py#main",
              "say": "main() creates the store with a reducer and starting state, and subscribes render() to it."
            },
            {
              "at": "flux-store-py-todos/view.py#on_user_typed",
              "say": "The user types a to-do. The view does not touch the list; it dispatches an action."
            },
            {
              "at": "flux-store-py-todos/actions.py#add_todo",
              "say": "The action creator returns a plain dict: a type plus the data needed. It is just a description."
            },
            {
              "at": "flux-store-py-todos/store.py#Store.dispatch",
              "say": "dispatch() is the only door to change state. It asks the reducer for the next state, then tells every listener."
            },
            {
              "at": "flux-store-py-todos/reducer.py#todo_reducer",
              "say": "The reducer builds a NEW dict with the extra to-do. The old state is left untouched."
            },
            {
              "at": "flux-store-py-todos/view.py#render",
              "say": "render() receives the fresh state and redraws the whole list. Data went one way round the loop."
            },
            {
              "at": "flux-store-py-todos/view.py#on_user_clicked",
              "say": "Ticking a box follows exactly the same path: action, dispatch, reducer, render."
            }
          ],
          "files": {
            "flux-store-py-todos/actions.py": "# Actions are plain data that describe WHAT happened. They change nothing by themselves.\nADD_TODO = \"todo/add\"\nTOGGLE_TODO = \"todo/toggle\"\n\n\ndef add_todo(text):\n    return {\"type\": ADD_TODO, \"text\": text}\n\n\ndef toggle_todo(index):\n    return {\"type\": TOGGLE_TODO, \"index\": index}\n",
            "flux-store-py-todos/main.py": "from .store import Store\nfrom .reducer import todo_reducer, INITIAL_STATE\nfrom .view import render, on_user_typed, on_user_clicked\n\n\ndef main():\n    store = Store(todo_reducer, INITIAL_STATE)\n    store.subscribe(render)\n\n    on_user_typed(store, \"Buy coffee\")\n    on_user_typed(store, \"Water the plants\")\n    on_user_clicked(store, 0)\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "flux-store-py-todos/reducer.py": "from .actions import ADD_TODO, TOGGLE_TODO\n\nINITIAL_STATE = {\"todos\": []}\n\n\n# The reducer is a pure function: (old state, action) -> new state. It never edits the old state.\ndef todo_reducer(state, action):\n    if action[\"type\"] == ADD_TODO:\n        new_todo = {\"text\": action[\"text\"], \"done\": False}\n        return {\"todos\": state[\"todos\"] + [new_todo]}\n    if action[\"type\"] == TOGGLE_TODO:\n        todos = list(state[\"todos\"])\n        old = todos[action[\"index\"]]\n        todos[action[\"index\"]] = {\"text\": old[\"text\"], \"done\": not old[\"done\"]}\n        return {\"todos\": todos}\n    return state\n",
            "flux-store-py-todos/store.py": "# The Store holds the one and only copy of the state. dispatch() is the only way to change it.\n\n\nclass Store:\n    def __init__(self, reducer, initial_state):\n        self.reducer = reducer\n        self.state = initial_state\n        self.listeners = []\n\n    def get_state(self):\n        return self.state\n\n    def subscribe(self, listener):\n        self.listeners.append(listener)\n\n    def dispatch(self, action):\n        self.state = self.reducer(self.state, action)\n        for listener in self.listeners:\n            listener(self.state)\n",
            "flux-store-py-todos/view.py": "# The View reads state and turns user clicks into actions. It never edits state directly.\nfrom .actions import add_todo, toggle_todo\n\n\ndef render(state):\n    print(\"--- My todos ---\")\n    for number, todo in enumerate(state[\"todos\"]):\n        mark = \"x\" if todo[\"done\"] else \" \"\n        print(f\"[{mark}] {number}: {todo['text']}\")\n\n\ndef on_user_typed(store, text):\n    store.dispatch(add_todo(text))\n\n\ndef on_user_clicked(store, index):\n    store.dispatch(toggle_todo(index))\n"
          }
        },
        {
          "id": "flux-store-cs-cart",
          "title": "Shopping cart store with middleware",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "A cart badge and a checkout panel share one CartStore. Actions are small classes, CartState is immutable, and middleware can log or block actions before the reducer runs.",
          "roles": {
            "Action": [
              "flux-store-cs-cart/Actions.cs#ICartAction",
              "flux-store-cs-cart/Actions.cs#AddItem",
              "flux-store-cs-cart/Actions.cs#RemoveItem",
              "flux-store-cs-cart/Actions.cs#ApplyCoupon"
            ],
            "Reducer": [
              "flux-store-cs-cart/CartReducer.cs#CartReducer.Reduce"
            ],
            "Store": [
              "flux-store-cs-cart/CartStore.cs#CartStore",
              "flux-store-cs-cart/CartState.cs#CartState"
            ],
            "View": [
              "flux-store-cs-cart/Views.cs#CartBadge",
              "flux-store-cs-cart/Views.cs#CheckoutPanel"
            ]
          },
          "trace": [
            {
              "at": "flux-store-cs-cart/Program.cs#Program.Main",
              "say": "Main() builds one store, plugs in two middleware steps, and creates two views that share it."
            },
            {
              "at": "flux-store-cs-cart/Views.cs#CheckoutPanel.CheckoutPanel",
              "say": "Each view subscribes its Render method. Subscribe() also renders once, so views start in sync."
            },
            {
              "at": "flux-store-cs-cart/CartStore.cs#CartStore.Dispatch",
              "say": "An AddItem action arrives. Dispatch runs every middleware first; any of them may stop the action."
            },
            {
              "at": "flux-store-cs-cart/Program.cs#Program.LogAction",
              "say": "The logging middleware prints the action name. Because all changes pass here, this is a full audit trail."
            },
            {
              "at": "flux-store-cs-cart/CartReducer.cs#CartReducer.Reduce",
              "say": "The reducer pattern-matches on the action type and returns a new CartState. No UI code in sight."
            },
            {
              "at": "flux-store-cs-cart/Views.cs#CartBadge.Render",
              "say": "Both views re-render from the same new state, so the badge and the total can never disagree."
            },
            {
              "at": "flux-store-cs-cart/Views.cs#CheckoutPanel.OnCouponEntered",
              "say": "The user enters a 90% coupon. The panel dispatches ApplyCoupon instead of changing the total itself."
            },
            {
              "at": "flux-store-cs-cart/Program.cs#Program.RejectHugeCoupons",
              "say": "This middleware returns false for coupons over 50%, so the reducer never sees it and state stays the same."
            }
          ],
          "files": {
            "flux-store-cs-cart/Actions.cs": "// Actions: small immutable messages that say what the user did.\npublic interface ICartAction\n{\n}\n\npublic class AddItem : ICartAction\n{\n    public string Sku { get; }\n    public decimal Price { get; }\n\n    public AddItem(string sku, decimal price)\n    {\n        Sku = sku;\n        Price = price;\n    }\n}\n\npublic class RemoveItem : ICartAction\n{\n    public string Sku { get; }\n\n    public RemoveItem(string sku)\n    {\n        Sku = sku;\n    }\n}\n\npublic class ApplyCoupon : ICartAction\n{\n    public int PercentOff { get; }\n\n    public ApplyCoupon(int percentOff)\n    {\n        PercentOff = percentOff;\n    }\n}\n",
            "flux-store-cs-cart/CartReducer.cs": "// The reducer: pure function from (state, action) to new state. Easy to unit test with no UI at all.\npublic static class CartReducer\n{\n    public static CartState Reduce(CartState state, ICartAction action)\n    {\n        switch (action)\n        {\n            case AddItem add:\n                return new CartState(state.Lines.SetItem(add.Sku, add.Price), state.PercentOff);\n            case RemoveItem remove:\n                return new CartState(state.Lines.Remove(remove.Sku), state.PercentOff);\n            case ApplyCoupon coupon:\n                return new CartState(state.Lines, coupon.PercentOff);\n            default:\n                return state;\n        }\n    }\n}\n",
            "flux-store-cs-cart/CartState.cs": "using System.Collections.Immutable;\n\n// The state is immutable: every change produces a new CartState.\npublic class CartState\n{\n    public ImmutableDictionary<string, decimal> Lines { get; }\n    public int PercentOff { get; }\n\n    public CartState(ImmutableDictionary<string, decimal> lines, int percentOff)\n    {\n        Lines = lines;\n        PercentOff = percentOff;\n    }\n\n    public static CartState Empty()\n    {\n        return new CartState(ImmutableDictionary<string, decimal>.Empty, 0);\n    }\n\n    public decimal Total()\n    {\n        decimal sum = 0;\n        foreach (var price in Lines.Values)\n        {\n            sum += price;\n        }\n        return sum * (100 - PercentOff) / 100;\n    }\n}\n",
            "flux-store-cs-cart/CartStore.cs": "using System;\nusing System.Collections.Generic;\n\n// The Store: holds the current state, runs middleware, then the reducer, then notifies views.\npublic class CartStore\n{\n    private CartState state = CartState.Empty();\n    private readonly List<Action<CartState>> listeners = new List<Action<CartState>>();\n    private readonly List<Func<ICartAction, bool>> middleware = new List<Func<ICartAction, bool>>();\n\n    public CartState State\n    {\n        get { return state; }\n    }\n\n    public void Subscribe(Action<CartState> listener)\n    {\n        listeners.Add(listener);\n        listener(state);\n    }\n\n    public void Use(Func<ICartAction, bool> step)\n    {\n        middleware.Add(step);\n    }\n\n    public void Dispatch(ICartAction action)\n    {\n        foreach (var step in middleware)\n        {\n            if (!step(action))\n            {\n                return;\n            }\n        }\n        state = CartReducer.Reduce(state, action);\n        foreach (var listener in listeners)\n        {\n            listener(state);\n        }\n    }\n}\n",
            "flux-store-cs-cart/Program.cs": "using System;\n\npublic static class Program\n{\n    // Middleware sees every action before the reducer: perfect for logging or validation.\n    public static bool LogAction(ICartAction action)\n    {\n        Console.WriteLine($\"> {action.GetType().Name}\");\n        return true;\n    }\n\n    public static bool RejectHugeCoupons(ICartAction action)\n    {\n        return !(action is ApplyCoupon c && c.PercentOff > 50);\n    }\n\n    public static void Main()\n    {\n        var store = new CartStore();\n        store.Use(LogAction);\n        store.Use(RejectHugeCoupons);\n\n        var badge = new CartBadge(store);\n        var panel = new CheckoutPanel(store);\n\n        store.Dispatch(new AddItem(\"tea\", 4.50m));\n        store.Dispatch(new AddItem(\"mug\", 9.00m));\n        panel.OnCouponEntered(90);\n        panel.OnCouponEntered(10);\n        store.Dispatch(new RemoveItem(\"tea\"));\n    }\n}\n",
            "flux-store-cs-cart/Views.cs": "using System;\n\n// Views only read state and dispatch actions. Two views stay in sync because both read the same store.\npublic class CartBadge\n{\n    private readonly CartStore store;\n\n    public CartBadge(CartStore store)\n    {\n        this.store = store;\n        store.Subscribe(Render);\n    }\n\n    public void Render(CartState state)\n    {\n        Console.WriteLine($\"[badge] {state.Lines.Count} item(s)\");\n    }\n}\n\npublic class CheckoutPanel\n{\n    private readonly CartStore store;\n\n    public CheckoutPanel(CartStore store)\n    {\n        this.store = store;\n        store.Subscribe(Render);\n    }\n\n    public void Render(CartState state)\n    {\n        Console.WriteLine($\"[checkout] total {state.Total():0.00} EUR ({state.PercentOff}% off)\");\n    }\n\n    public void OnCouponEntered(int percent)\n    {\n        store.Dispatch(new ApplyCoupon(percent));\n    }\n}\n"
          }
        },
        {
          "id": "flux-store-redux-real",
          "title": "Redux createStore",
          "lang": "TypeScript",
          "level": "advanced",
          "source": {
            "repo": "reduxjs/redux",
            "url": "https://github.com/reduxjs/redux/blob/v5.0.1/src/createStore.ts",
            "license": "MIT",
            "note": "redux/createStore.ts is verbatim from Redux 5.0.1 with overload signatures, long doc notes, replaceReducer/observable and legacy_createStore trimmed (marked). actions.ts, reducer.ts and view.ts were written for Software City."
          },
          "story": "The real heart of Redux. createStore keeps currentState in a closure, and dispatch() is the only code that assigns it. Notice how little code the core needs: getState, subscribe, dispatch.",
          "roles": {
            "Action": [
              "flux-store-redux-real/actions.ts#like",
              "flux-store-redux-real/actions.ts#comment"
            ],
            "Reducer": [
              "flux-store-redux-real/reducer.ts#postReducer"
            ],
            "Store": [
              "flux-store-redux-real/redux/createStore.ts#dispatch",
              "flux-store-redux-real/redux/createStore.ts#getState",
              "flux-store-redux-real/redux/createStore.ts#subscribe"
            ],
            "View": [
              "flux-store-redux-real/view.ts#render",
              "flux-store-redux-real/view.ts#onLikeClicked"
            ]
          },
          "trace": [
            {
              "at": "flux-store-redux-real/view.ts#main",
              "say": "The module created the store with createStore(postReducer). Redux immediately dispatched an INIT action so the reducer returns its initial state."
            },
            {
              "at": "flux-store-redux-real/redux/createStore.ts#subscribe",
              "say": "subscribe() adds render to a Map of listeners and returns an unsubscribe function."
            },
            {
              "at": "flux-store-redux-real/redux/createStore.ts#ensureCanMutateNextListeners",
              "say": "It copies the listener map before changing it, so subscribing during a dispatch cannot break the loop in progress."
            },
            {
              "at": "flux-store-redux-real/view.ts#onLikeClicked",
              "say": "A click dispatches like(), a plain {type: 'post/liked'} object."
            },
            {
              "at": "flux-store-redux-real/redux/createStore.ts#dispatch",
              "say": "dispatch() checks the action is a plain object with a type, sets isDispatching, and replaces currentState with the reducer's result."
            },
            {
              "at": "flux-store-redux-real/reducer.ts#postReducer",
              "say": "The reducer spreads the old state into a new object with likes + 1. It never mutates."
            },
            {
              "at": "flux-store-redux-real/view.ts#render",
              "say": "Back in dispatch, every listener runs. render() pulls fresh data with getState()."
            },
            {
              "at": "flux-store-redux-real/redux/createStore.ts#getState",
              "say": "getState() just returns currentState, but throws if called from inside a reducer, keeping reducers pure."
            }
          ],
          "files": {
            "flux-store-redux-real/actions.ts": "// Written for Software City (not part of Redux). Action creators return plain objects with a type.\nexport const LIKED = 'post/liked'\nexport const COMMENTED = 'post/commented'\n\nexport type PostAction =\n  | { type: typeof LIKED }\n  | { type: typeof COMMENTED; text: string }\n\nexport function like(): PostAction {\n  return { type: LIKED }\n}\n\nexport function comment(text: string): PostAction {\n  return { type: COMMENTED, text }\n}\n",
            "flux-store-redux-real/reducer.ts": "// Written for Software City (not part of Redux). A pure reducer: no mutation, no side effects.\nimport { LIKED, COMMENTED, PostAction } from './actions'\n\nexport interface PostState {\n  likes: number\n  comments: string[]\n}\n\nconst initialState: PostState = { likes: 0, comments: [] }\n\nexport function postReducer(state: PostState = initialState, action: PostAction): PostState {\n  switch (action.type) {\n    case LIKED:\n      return { ...state, likes: state.likes + 1 }\n    case COMMENTED:\n      return { ...state, comments: [...state.comments, action.text] }\n    default:\n      return state\n  }\n}\n",
            "flux-store-redux-real/redux/createStore.ts": "// Source: Redux 5.0.1 — https://github.com/reduxjs/redux/blob/v5.0.1/src/createStore.ts\n// MIT License, Copyright (c) 2015-present Dan Abramov. Included for study.\nimport $$observable from './utils/symbol-observable'\n\nimport {\n  Store,\n  StoreEnhancer,\n  Dispatch,\n  Observer,\n  ListenerCallback,\n  UnknownIfNonSpecific\n} from './types/store'\nimport { Action } from './types/actions'\nimport { Reducer } from './types/reducers'\nimport ActionTypes from './utils/actionTypes'\nimport isPlainObject from './utils/isPlainObject'\nimport { kindOf } from './utils/kindOf'\n\n// … trimmed: 70 lines (deprecation notice and two overload signatures of createStore) …\nexport function createStore<\n  S,\n  A extends Action,\n  Ext extends {} = {},\n  StateExt extends {} = {},\n  PreloadedState = S\n>(\n  reducer: Reducer<S, A, PreloadedState>,\n  preloadedState?: PreloadedState | StoreEnhancer<Ext, StateExt> | undefined,\n  enhancer?: StoreEnhancer<Ext, StateExt>\n): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext {\n  if (typeof reducer !== 'function') {\n    throw new Error(\n      `Expected the root reducer to be a function. Instead, received: '${kindOf(\n        reducer\n      )}'`\n    )\n  }\n\n  // … trimmed: 10 lines checking that several enhancers were not passed …\n\n  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {\n    enhancer = preloadedState as StoreEnhancer<Ext, StateExt>\n    preloadedState = undefined\n  }\n\n  if (typeof enhancer !== 'undefined') {\n    if (typeof enhancer !== 'function') {\n      throw new Error(\n        `Expected the enhancer to be a function. Instead, received: '${kindOf(\n          enhancer\n        )}'`\n      )\n    }\n\n    return enhancer(createStore)(\n      reducer,\n      preloadedState as PreloadedState | undefined\n    )\n  }\n\n  let currentReducer = reducer\n  let currentState: S | PreloadedState | undefined = preloadedState as\n    | PreloadedState\n    | undefined\n  let currentListeners: Map<number, ListenerCallback> | null = new Map()\n  let nextListeners = currentListeners\n  let listenerIdCounter = 0\n  let isDispatching = false\n\n  /**\n   * This makes a shallow copy of currentListeners so we can use\n   * nextListeners as a temporary list while dispatching.\n   *\n   * This prevents any bugs around consumers calling\n   * subscribe/unsubscribe in the middle of a dispatch.\n   */\n  function ensureCanMutateNextListeners() {\n    if (nextListeners === currentListeners) {\n      nextListeners = new Map()\n      currentListeners.forEach((listener, key) => {\n        nextListeners.set(key, listener)\n      })\n    }\n  }\n\n  /**\n   * Reads the state tree managed by the store.\n   *\n   * @returns The current state tree of your application.\n   */\n  function getState(): S {\n    if (isDispatching) {\n      throw new Error(\n        'You may not call store.getState() while the reducer is executing. ' +\n          'The reducer has already received the state as an argument. ' +\n          'Pass it down from the top reducer instead of reading it from the store.'\n      )\n    }\n\n    return currentState as S\n  }\n\n  /**\n   * Adds a change listener. It will be called any time an action is dispatched,\n   * and some part of the state tree may potentially have changed. You may then\n   * call `getState()` to read the current state tree inside the callback.\n   *\n   * … trimmed: 15 lines of notes on subscribing during a dispatch …\n   * @param listener A callback to be invoked on every dispatch.\n   * @returns A function to remove this change listener.\n   */\n  function subscribe(listener: () => void) {\n    if (typeof listener !== 'function') {\n      throw new Error(\n        `Expected the listener to be a function. Instead, received: '${kindOf(\n          listener\n        )}'`\n      )\n    }\n\n    if (isDispatching) {\n      throw new Error(\n        'You may not call store.subscribe() while the reducer is executing. ' +\n          'If you would like to be notified after the store has been updated, subscribe from a ' +\n          'component and invoke store.getState() in the callback to access the latest state. ' +\n          'See https://redux.js.org/api/store#subscribelistener for more details.'\n      )\n    }\n\n    let isSubscribed = true\n\n    ensureCanMutateNextListeners()\n    const listenerId = listenerIdCounter++\n    nextListeners.set(listenerId, listener)\n\n    return function unsubscribe() {\n      if (!isSubscribed) {\n        return\n      }\n\n      if (isDispatching) {\n        throw new Error(\n          'You may not unsubscribe from a store listener while the reducer is executing. ' +\n            'See https://redux.js.org/api/store#subscribelistener for more details.'\n        )\n      }\n\n      isSubscribed = false\n\n      ensureCanMutateNextListeners()\n      nextListeners.delete(listenerId)\n      currentListeners = null\n    }\n  }\n\n  /**\n   * Dispatches an action. It is the only way to trigger a state change.\n   *\n   * The `reducer` function, used to create the store, will be called with the\n   * current state tree and the given `action`. Its return value will\n   * be considered the **next** state of the tree, and the change listeners\n   * will be notified.\n   *\n   * … trimmed: 16 lines of notes on middleware and serializable actions …\n   */\n  function dispatch(action: A) {\n    if (!isPlainObject(action)) {\n      throw new Error(\n        `Actions must be plain objects. Instead, the actual type was: '${kindOf(\n          action\n        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`\n      )\n    }\n\n    if (typeof action.type === 'undefined') {\n      throw new Error(\n        'Actions may not have an undefined \"type\" property. You may have misspelled an action type string constant.'\n      )\n    }\n\n    if (typeof action.type !== 'string') {\n      throw new Error(\n        `Action \"type\" property must be a string. Instead, the actual type was: '${kindOf(\n          action.type\n        )}'. Value was: '${action.type}' (stringified)`\n      )\n    }\n\n    if (isDispatching) {\n      throw new Error('Reducers may not dispatch actions.')\n    }\n\n    try {\n      isDispatching = true\n      currentState = currentReducer(currentState, action)\n    } finally {\n      isDispatching = false\n    }\n\n    const listeners = (currentListeners = nextListeners)\n    listeners.forEach(listener => {\n      listener()\n    })\n    return action\n  }\n\n  // … trimmed: 70 lines: replaceReducer() (hot reloading) and observable() (RxJS interop) …\n\n  // When a store is created, an \"INIT\" action is dispatched so that every\n  // reducer returns their initial state. This effectively populates\n  // the initial state tree.\n  dispatch({ type: ActionTypes.INIT } as A)\n\n  const store = {\n    dispatch: dispatch as Dispatch<A>,\n    subscribe,\n    getState,\n    replaceReducer,\n    [$$observable]: observable\n  } as unknown as Store<S, A, StateExt> & Ext\n  return store\n}\n\n// … trimmed: 93 lines: legacy_createStore, an alias that calls createStore …\n",
            "flux-store-redux-real/view.ts": "// Written for Software City (not part of Redux). The view reads with getState() and writes with dispatch().\nimport { createStore } from './redux/createStore'\nimport { postReducer } from './reducer'\nimport { like, comment } from './actions'\n\nconst store = createStore(postReducer)\n\nfunction render(): void {\n  const state = store.getState()\n  console.log(`♥ ${state.likes}  💬 ${state.comments.length}`)\n}\n\nfunction onLikeClicked(): void {\n  store.dispatch(like())\n}\n\nexport function main(): void {\n  const unsubscribe = store.subscribe(render)\n  onLikeClicked()\n  store.dispatch(comment('Nice post!'))\n  unsubscribe()\n  onLikeClicked()\n}\n\nmain()\n"
          }
        }
      ]
    },
    {
      "id": "event-sourcing",
      "name": "Event Sourcing",
      "family": "Architecture",
      "aka": [
        "Event log",
        "Append-only store",
        "Event-sourced aggregate"
      ],
      "tagline": "Store every change as an event; rebuild current state by replaying the log.",
      "intent": "Instead of saving only the latest state (a balance, an inventory), save the full list of things that happened, as immutable events in an append-only log. Current state is computed by replaying those events, and any number of projections (read models, reports) can be built from the same log, even ones invented long after the events were written.",
      "analogy": "A bank statement or a chess score sheet: nobody stores 'the board right now'; they write down every move. To see the position at any point you replay the moves, and you can analyse the game in new ways later.",
      "cityShape": "Look for an event-store building with an append floor that writes one growing log antenna, and no floor that edits or deletes it. Several other buildings (the aggregate and the projections) each have an apply or handle floor fed by loop pipes from replay floors, so you see the same events flowing into different places.",
      "roles": [
        {
          "name": "Event",
          "desc": "An immutable fact in the past tense: Deposited, ItemPicked, OrderShipped. It carries the data needed to replay it."
        },
        {
          "name": "Event Store",
          "desc": "The append-only log. It can add events and read them back, never update or delete them."
        },
        {
          "name": "Aggregate",
          "desc": "The object whose state is rebuilt by applying its events in order. Its commands check rules and emit new events."
        },
        {
          "name": "Projection",
          "desc": "A read model built by folding events into a shape that is handy for one screen or report. It can be thrown away and rebuilt by replay."
        },
        {
          "name": "Client",
          "desc": "Issues commands, appends the resulting events, and reads projections."
        }
      ],
      "whenToUse": [
        "You need a full audit trail of who changed what and when (finance, orders, medical records).",
        "You want to answer new questions about the past, or debug by replaying exactly what happened.",
        "Save games, undo history, multiplayer sync or replays, where the sequence of actions is the real data.",
        "Several read models (lists, reports, search indexes) must be derived from the same changes."
      ],
      "pitfalls": [
        "Changing the meaning or shape of an old event breaks replay. Version events and write upcasters instead of editing history.",
        "Replaying millions of events on every load is slow; use snapshots and keep projections up to date incrementally.",
        "Projections are eventually consistent: a read right after a write may not see it yet. It also adds real complexity for simple CRUD apps that do not need history."
      ],
      "related": [
        "cqrs",
        "command",
        "memento",
        "domain-events",
        "aggregate",
        "flux-store"
      ],
      "quiz": [
        {
          "q": "In an event-sourced bank account, how do you fix a deposit that was recorded with the wrong amount?",
          "options": [
            "Edit the amount in the old Deposited event",
            "Delete the event and write a new one",
            "Append a new compensating event, such as DepositCorrected or Withdrawn",
            "Change the stored balance field directly"
          ],
          "answer": 2,
          "why": "The log is append-only history. You record a new fact that corrects the old one, so the audit trail stays honest and replay still works."
        },
        {
          "q": "Your boss wants a new report about all orders since 2019. What does event sourcing let you do?",
          "options": [
            "Nothing; reports must exist before the data",
            "Write a new projection and replay all stored events through it",
            "Copy the current state table into a spreadsheet",
            "Ask users to re-enter their orders"
          ],
          "answer": 1,
          "why": "Because every event was kept, a projection invented today can be built from the complete history."
        }
      ],
      "demos": [
        {
          "id": "event-sourcing-ts-bank",
          "title": "Bank account rebuilt from events",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "The account never stores its balance anywhere permanent; it replays Deposited and Withdrawn events. Notice that the statement printer is a second view built from the very same log.",
          "roles": {
            "Event": [
              "event-sourcing-ts-bank/events.ts#Deposited",
              "event-sourcing-ts-bank/events.ts#Withdrawn"
            ],
            "Event Store": [
              "event-sourcing-ts-bank/eventStore.ts#EventStore"
            ],
            "Aggregate": [
              "event-sourcing-ts-bank/account.ts#BankAccount"
            ],
            "Projection": [
              "event-sourcing-ts-bank/statement.ts#printStatement"
            ],
            "Client": [
              "event-sourcing-ts-bank/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "event-sourcing-ts-bank/main.ts#main",
              "say": "main() appends two deposits. Only the facts are stored, never a balance."
            },
            {
              "at": "event-sourcing-ts-bank/eventStore.ts#EventStore.append",
              "say": "append() pushes onto the log. There is no update or delete method: history only grows."
            },
            {
              "at": "event-sourcing-ts-bank/account.ts#BankAccount.replay",
              "say": "To get the current account, replay() starts from zero and applies every event in order."
            },
            {
              "at": "event-sourcing-ts-bank/account.ts#BankAccount.apply",
              "say": "apply() is the only code that changes the balance: +100, +50 gives 150."
            },
            {
              "at": "event-sourcing-ts-bank/account.ts#BankAccount.withdraw",
              "say": "A command checks the rule against the rebuilt state and returns a new Withdrawn event; main appends it."
            },
            {
              "at": "event-sourcing-ts-bank/statement.ts#printStatement",
              "say": "A projection walks the same log to print a statement with running totals. New views need no new data."
            }
          ],
          "files": {
            "event-sourcing-ts-bank/account.ts": "import { AccountEvent } from './events';\n\n// The balance is never stored. It is rebuilt by replaying events.\nexport class BankAccount {\n  balance = 0;\n\n  static replay(history: AccountEvent[]): BankAccount {\n    const account = new BankAccount();\n    for (const event of history) {\n      account.apply(event);\n    }\n    return account;\n  }\n\n  apply(event: AccountEvent): void {\n    if (event.type === 'Deposited') {\n      this.balance += event.amount;\n    } else {\n      this.balance -= event.amount;\n    }\n  }\n\n  // Decide: check the rule, then return the new fact (do not change state here).\n  withdraw(amount: number, at: string): AccountEvent {\n    if (amount > this.balance) {\n      throw new Error('Insufficient funds');\n    }\n    return { type: 'Withdrawn', amount, at };\n  }\n}\n",
            "event-sourcing-ts-bank/eventStore.ts": "import { AccountEvent } from './events';\n\n// Append-only: there is no update() and no delete().\nexport class EventStore {\n  private log: AccountEvent[] = [];\n\n  append(event: AccountEvent): void {\n    this.log.push(event);\n  }\n\n  readAll(): AccountEvent[] {\n    return [...this.log];\n  }\n}\n",
            "event-sourcing-ts-bank/events.ts": "// Events are facts in the past tense. Once written, they never change.\nexport interface Deposited {\n  type: 'Deposited';\n  amount: number;\n  at: string;\n}\n\nexport interface Withdrawn {\n  type: 'Withdrawn';\n  amount: number;\n  at: string;\n}\n\nexport type AccountEvent = Deposited | Withdrawn;\n",
            "event-sourcing-ts-bank/main.ts": "import { EventStore } from './eventStore';\nimport { BankAccount } from './account';\nimport { printStatement } from './statement';\n\nexport function main(): void {\n  const store = new EventStore();\n  store.append({ type: 'Deposited', amount: 100, at: 'Mon' });\n  store.append({ type: 'Deposited', amount: 50, at: 'Tue' });\n\n  const account = BankAccount.replay(store.readAll());\n  store.append(account.withdraw(30, 'Wed'));\n\n  console.log('balance now:', BankAccount.replay(store.readAll()).balance); // 120\n  printStatement(store.readAll());\n}\n\nmain();\n",
            "event-sourcing-ts-bank/statement.ts": "import { AccountEvent } from './events';\n\n// A projection: a different view built from the very same events.\nexport function printStatement(history: AccountEvent[]): void {\n  let running = 0;\n  for (const event of history) {\n    running += event.type === 'Deposited' ? event.amount : -event.amount;\n    console.log(`${event.at}  ${event.type.padEnd(9)} ${event.amount}  balance ${running}`);\n  }\n}\n"
          }
        },
        {
          "id": "event-sourcing-gd-savegame",
          "title": "Save game as an event log",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "The save file is the list of things the player did. Loading replays it into the inventory and an achievements projection; live play applies each new event as it happens.",
          "roles": {
            "Event": [
              "event-sourcing-gd-savegame/game_event.gd"
            ],
            "Event Store": [
              "event-sourcing-gd-savegame/event_log.gd"
            ],
            "Aggregate": [
              "event-sourcing-gd-savegame/inventory.gd"
            ],
            "Projection": [
              "event-sourcing-gd-savegame/stats_projection.gd"
            ],
            "Client": [
              "event-sourcing-gd-savegame/game.gd#_ready",
              "event-sourcing-gd-savegame/game.gd#drink_potion"
            ]
          },
          "trace": [
            {
              "at": "event-sourcing-gd-savegame/game.gd#_ready",
              "say": "On start the game loads the event log, then replays it into the inventory and the stats projection."
            },
            {
              "at": "event-sourcing-gd-savegame/event_log.gd#load_from_disk",
              "say": "The save file is JSON rows of events. Each row becomes a GameEvent again."
            },
            {
              "at": "event-sourcing-gd-savegame/inventory.gd#replay",
              "say": "replay() resets to empty and applies every event: the classic 'state = fold(events)'."
            },
            {
              "at": "event-sourcing-gd-savegame/inventory.gd#apply",
              "say": "apply() matches on the event type. It is the only code that changes items and gold."
            },
            {
              "at": "event-sourcing-gd-savegame/game.gd#drink_potion",
              "say": "Play continues. The rule check uses current state, then a new item_used fact is recorded."
            },
            {
              "at": "event-sourcing-gd-savegame/event_log.gd#record",
              "say": "record() appends the event and emits a signal, so views update without a full replay."
            },
            {
              "at": "event-sourcing-gd-savegame/stats_projection.gd#handle",
              "say": "The achievements projection counts potions drunk from the same event. Inventory never had to track that."
            },
            {
              "at": "event-sourcing-gd-savegame/event_log.gd#save_to_disk",
              "say": "Saving writes the whole log. A replay of a save file re-creates the exact run, great for bug reports."
            }
          ],
          "files": {
            "event-sourcing-gd-savegame/event_log.gd": "class_name EventLog\nextends Node\n\n# The save game IS this list: an append-only log of everything that happened.\nsignal event_recorded(event: GameEvent)\n\nconst SAVE_PATH := \"user://save_events.json\"\nvar events: Array[GameEvent] = []\n\nfunc record(type: StringName, data: Dictionary) -> void:\n\tvar event := GameEvent.new(type, data, Engine.get_process_frames())\n\tevents.append(event)\n\tevent_recorded.emit(event)\n\nfunc save_to_disk() -> void:\n\tvar rows: Array = []\n\tfor event in events:\n\t\trows.append(event.to_dict())\n\tvar file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)\n\tfile.store_string(JSON.stringify(rows))\n\nfunc load_from_disk() -> void:\n\tevents.clear()\n\tvar file := FileAccess.open(SAVE_PATH, FileAccess.READ)\n\tif file == null:\n\t\treturn\n\tfor row in JSON.parse_string(file.get_as_text()):\n\t\tevents.append(GameEvent.from_dict(row))\n",
            "event-sourcing-gd-savegame/game.gd": "extends Node\n\n@onready var event_log: EventLog = $EventLog\nvar inventory: Inventory = Inventory.new()\nvar stats: StatsProjection = StatsProjection.new()\n\n# Loading a save = replaying its events into fresh state.\nfunc _ready() -> void:\n\tevent_log.event_recorded.connect(_on_event_recorded)\n\tevent_log.load_from_disk()\n\tinventory.replay(event_log.events)\n\tstats.rebuild(event_log.events)\n\tprint(\"Loaded: \", inventory.items, \" gold \", inventory.gold)\n\n# Live play: each new event updates every view incrementally.\nfunc _on_event_recorded(event: GameEvent) -> void:\n\tinventory.apply(event)\n\tstats.handle(event)\n\nfunc pick_up(item: String) -> void:\n\tevent_log.record(&\"item_picked\", {\"item\": item})\n\nfunc sell_loot(price: int) -> void:\n\tevent_log.record(&\"gold_earned\", {\"amount\": price})\n\nfunc drink_potion() -> void:\n\tif inventory.can_use(\"potion\"):\n\t\tevent_log.record(&\"item_used\", {\"item\": \"potion\"})\n\nfunc _on_quit_requested() -> void:\n\tevent_log.save_to_disk()\n",
            "event-sourcing-gd-savegame/game_event.gd": "class_name GameEvent\nextends RefCounted\n\n# One fact that happened in the game. Never edited after it is recorded.\nvar type: StringName\nvar data: Dictionary\nvar frame: int\n\nfunc _init(event_type: StringName, event_data: Dictionary, at_frame: int) -> void:\n\ttype = event_type\n\tdata = event_data\n\tframe = at_frame\n\nfunc to_dict() -> Dictionary:\n\treturn {\"type\": type, \"data\": data, \"frame\": frame}\n\nstatic func from_dict(d: Dictionary) -> GameEvent:\n\treturn GameEvent.new(StringName(d[\"type\"]), d[\"data\"], d[\"frame\"])\n",
            "event-sourcing-gd-savegame/inventory.gd": "class_name Inventory\nextends RefCounted\n\n# Current state is derived: it is whatever you get by applying every event in order.\nvar items: Dictionary = {}\nvar gold := 0\n\nfunc replay(history: Array[GameEvent]) -> void:\n\titems.clear()\n\tgold = 0\n\tfor event in history:\n\t\tapply(event)\n\nfunc apply(event: GameEvent) -> void:\n\tmatch event.type:\n\t\t&\"item_picked\":\n\t\t\titems[event.data.item] = items.get(event.data.item, 0) + 1\n\t\t&\"item_used\":\n\t\t\titems[event.data.item] -= 1\n\t\t&\"gold_earned\":\n\t\t\tgold += event.data.amount\n\nfunc can_use(item: String) -> bool:\n\treturn items.get(item, 0) > 0\n",
            "event-sourcing-gd-savegame/stats_projection.gd": "class_name StatsProjection\nextends RefCounted\n\n# A projection: a read model for the achievements screen, built from the same events.\nvar potions_drunk := 0\nvar total_gold_earned := 0\n\nfunc handle(event: GameEvent) -> void:\n\tif event.type == &\"item_used\" and event.data.item == \"potion\":\n\t\tpotions_drunk += 1\n\telif event.type == &\"gold_earned\":\n\t\ttotal_gold_earned += event.data.amount\n\nfunc rebuild(history: Array[GameEvent]) -> void:\n\tpotions_drunk = 0\n\ttotal_gold_earned = 0\n\tfor event in history:\n\t\thandle(event)\n"
          }
        },
        {
          "id": "event-sourcing-go-orders",
          "title": "Orders with streams, concurrency checks and a late projection",
          "lang": "Go",
          "level": "advanced",
          "source": null,
          "story": "Each order is its own stream. Saves use optimistic concurrency (expected version), a subscribed projection updates live, and a brand-new revenue report is built afterwards by replaying the global log.",
          "roles": {
            "Event": [
              "event-sourcing-go-orders/events.go#Event",
              "event-sourcing-go-orders/events.go#OrderPlaced",
              "event-sourcing-go-orders/events.go#LineAdded",
              "event-sourcing-go-orders/events.go#OrderShipped"
            ],
            "Event Store": [
              "event-sourcing-go-orders/store.go#EventStore",
              "event-sourcing-go-orders/repository.go#OrderRepository"
            ],
            "Aggregate": [
              "event-sourcing-go-orders/order.go#Order"
            ],
            "Projection": [
              "event-sourcing-go-orders/projections.go#ShippingQueue",
              "event-sourcing-go-orders/projections.go#RevenueByCustomer"
            ],
            "Client": [
              "event-sourcing-go-orders/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "event-sourcing-go-orders/main.go#main",
              "say": "main() wires a store, a live ShippingQueue projection and a repository, then places an order."
            },
            {
              "at": "event-sourcing-go-orders/order.go#Order.AddLine",
              "say": "Commands check rules against current state and raise events. They never assign fields directly."
            },
            {
              "at": "event-sourcing-go-orders/order.go#Order.raise",
              "say": "raise() applies the event and also keeps it in changes, the list of not-yet-saved facts."
            },
            {
              "at": "event-sourcing-go-orders/repository.go#OrderRepository.Save",
              "say": "Save() appends only the new events, passing the version the order was loaded at."
            },
            {
              "at": "event-sourcing-go-orders/store.go#EventStore.Append",
              "say": "If the stream grew since that version, the append is refused. Clerk B's stale order cannot overwrite clerk A's shipment."
            },
            {
              "at": "event-sourcing-go-orders/projections.go#ShippingQueue.Handle",
              "say": "Subscribers get each stored record. The queue adds an order on LineAdded and removes it on OrderShipped."
            },
            {
              "at": "event-sourcing-go-orders/order.go#LoadOrder",
              "say": "repo.Get() replays a stream through apply(), tracking the version, to rebuild an Order from scratch."
            },
            {
              "at": "event-sourcing-go-orders/projections.go#Replay",
              "say": "A new report did not exist when the events were written. Replaying the global log builds it anyway."
            }
          ],
          "files": {
            "event-sourcing-go-orders/events.go": "package main\n\nimport \"time\"\n\n// Event is any fact about an order. Names are in the past tense.\ntype Event interface {\n\tEventName() string\n}\n\ntype OrderPlaced struct {\n\tOrderID  string\n\tCustomer string\n\tAt       time.Time\n}\n\ntype LineAdded struct {\n\tOrderID    string\n\tSKU        string\n\tQty        int\n\tPriceCents int\n}\n\ntype OrderShipped struct {\n\tOrderID string\n\tAt      time.Time\n}\n\nfunc (OrderPlaced) EventName() string {\n\treturn \"OrderPlaced\"\n}\n\nfunc (LineAdded) EventName() string {\n\treturn \"LineAdded\"\n}\n\nfunc (OrderShipped) EventName() string {\n\treturn \"OrderShipped\"\n}\n\n// Record is an event as stored: which stream it belongs to and its position in it.\ntype Record struct {\n\tStreamID string\n\tVersion  int\n\tEvent    Event\n}\n",
            "event-sourcing-go-orders/main.go": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tstore := NewEventStore()\n\tqueue := &ShippingQueue{pending: map[string]bool{}}\n\tstore.Subscribe(queue.Handle)\n\trepo := &OrderRepository{store: store}\n\n\torder := &Order{}\n\torder.Place(\"o-1\", \"maria\", time.Now())\n\torder.AddLine(\"mug\", 2, 1200)\n\trepo.Save(order)\n\tfmt.Println(\"to ship:\", queue.pending)\n\n\t// Two clerks load the same order; the second save is rejected.\n\ta := repo.Get(\"o-1\")\n\tb := repo.Get(\"o-1\")\n\ta.Ship(time.Now())\n\tfmt.Println(\"clerk A:\", repo.Save(a))\n\tb.AddLine(\"spoon\", 1, 300)\n\tfmt.Println(\"clerk B:\", repo.Save(b))\n\n\t// A brand-new report, built by replaying every event ever stored.\n\trevenue := &RevenueByCustomer{customerOf: map[string]string{}, totals: map[string]int{}}\n\tReplay(store.ReadAll(), revenue.Handle)\n\tfmt.Println(\"revenue:\", revenue.totals, \"to ship:\", queue.pending)\n}\n",
            "event-sourcing-go-orders/order.go": "package main\n\nimport (\n\t\"errors\"\n\t\"time\"\n)\n\n// Order is the aggregate. It has no setters: commands check rules and raise events,\n// and apply() is the only place that changes fields.\ntype Order struct {\n\tID         string\n\tversion    int\n\tplaced     bool\n\tshipped    bool\n\tlines      int\n\ttotalCents int\n\tchanges    []Event\n}\n\nfunc LoadOrder(history []Record) *Order {\n\to := &Order{}\n\tfor _, r := range history {\n\t\to.apply(r.Event)\n\t\to.version = r.Version\n\t}\n\treturn o\n}\n\nfunc (o *Order) Place(id, customer string, at time.Time) error {\n\tif o.placed {\n\t\treturn errors.New(\"order already placed\")\n\t}\n\to.raise(OrderPlaced{OrderID: id, Customer: customer, At: at})\n\treturn nil\n}\n\nfunc (o *Order) AddLine(sku string, qty, priceCents int) error {\n\tif !o.placed || o.shipped {\n\t\treturn errors.New(\"can only add lines to an open order\")\n\t}\n\to.raise(LineAdded{OrderID: o.ID, SKU: sku, Qty: qty, PriceCents: priceCents})\n\treturn nil\n}\n\nfunc (o *Order) Ship(at time.Time) error {\n\tif o.lines == 0 || o.shipped {\n\t\treturn errors.New(\"nothing to ship\")\n\t}\n\to.raise(OrderShipped{OrderID: o.ID, At: at})\n\treturn nil\n}\n\nfunc (o *Order) raise(e Event) {\n\to.apply(e)\n\to.changes = append(o.changes, e)\n}\n\nfunc (o *Order) apply(e Event) {\n\tswitch ev := e.(type) {\n\tcase OrderPlaced:\n\t\to.ID = ev.OrderID\n\t\to.placed = true\n\tcase LineAdded:\n\t\to.lines++\n\t\to.totalCents += ev.Qty * ev.PriceCents\n\tcase OrderShipped:\n\t\to.shipped = true\n\t}\n}\n",
            "event-sourcing-go-orders/projections.go": "package main\n\n// ShippingQueue is a read model: which orders still need to leave the warehouse.\ntype ShippingQueue struct {\n\tpending map[string]bool\n}\n\nfunc (p *ShippingQueue) Handle(r Record) {\n\tswitch ev := r.Event.(type) {\n\tcase LineAdded:\n\t\tp.pending[ev.OrderID] = true\n\tcase OrderShipped:\n\t\tdelete(p.pending, ev.OrderID)\n\t}\n}\n\n// RevenueByCustomer answers a question nobody asked when the events were written.\ntype RevenueByCustomer struct {\n\tcustomerOf map[string]string\n\ttotals     map[string]int\n}\n\nfunc (p *RevenueByCustomer) Handle(r Record) {\n\tswitch ev := r.Event.(type) {\n\tcase OrderPlaced:\n\t\tp.customerOf[ev.OrderID] = ev.Customer\n\tcase LineAdded:\n\t\tp.totals[p.customerOf[ev.OrderID]] += ev.Qty * ev.PriceCents\n\t}\n}\n\n// Replay feeds a full history into any projection, e.g. one added years later.\nfunc Replay(history []Record, handle func(Record)) {\n\tfor _, r := range history {\n\t\thandle(r)\n\t}\n}\n",
            "event-sourcing-go-orders/repository.go": "package main\n\n// OrderRepository hides the store: Get replays a stream, Save appends the new events.\ntype OrderRepository struct {\n\tstore *EventStore\n}\n\nfunc (r *OrderRepository) Get(id string) *Order {\n\treturn LoadOrder(r.store.Load(id))\n}\n\nfunc (r *OrderRepository) Save(o *Order) error {\n\tif err := r.store.Append(o.ID, o.version, o.changes); err != nil {\n\t\treturn err\n\t}\n\to.version += len(o.changes)\n\to.changes = nil\n\treturn nil\n}\n",
            "event-sourcing-go-orders/store.go": "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrConcurrency = errors.New(\"stream was changed by someone else\")\n\n// EventStore is append-only. Streams are per order; all keeps the global order for projections.\ntype EventStore struct {\n\tstreams     map[string][]Record\n\tall         []Record\n\tsubscribers []func(Record)\n}\n\nfunc NewEventStore() *EventStore {\n\treturn &EventStore{streams: map[string][]Record{}}\n}\n\n// Append only succeeds if nobody else wrote to the stream since we read it (optimistic concurrency).\nfunc (s *EventStore) Append(streamID string, expectedVersion int, events []Event) error {\n\tcurrent := len(s.streams[streamID])\n\tif current != expectedVersion {\n\t\treturn fmt.Errorf(\"%w: expected v%d, found v%d\", ErrConcurrency, expectedVersion, current)\n\t}\n\tfor i, e := range events {\n\t\trec := Record{StreamID: streamID, Version: expectedVersion + i + 1, Event: e}\n\t\ts.streams[streamID] = append(s.streams[streamID], rec)\n\t\ts.all = append(s.all, rec)\n\t\tfor _, notify := range s.subscribers {\n\t\t\tnotify(rec)\n\t\t}\n\t}\n\treturn nil\n}\n\nfunc (s *EventStore) Load(streamID string) []Record {\n\treturn append([]Record(nil), s.streams[streamID]...)\n}\n\nfunc (s *EventStore) ReadAll() []Record {\n\treturn append([]Record(nil), s.all...)\n}\n\nfunc (s *EventStore) Subscribe(handler func(Record)) {\n\ts.subscribers = append(s.subscribers, handler)\n}\n"
          }
        }
      ]
    },
    {
      "id": "cqrs",
      "name": "CQRS",
      "family": "Architecture",
      "aka": [
        "Command Query Responsibility Segregation",
        "Read/write split",
        "Separate read model"
      ],
      "tagline": "Use one model to change data and a separate, simpler model to read it.",
      "intent": "Split the code (and often the data) that changes state from the code that answers questions. Commands go to a write model that enforces business rules; queries go to a read model that stores data already shaped for each screen. A projector keeps the read model in sync, usually by listening to events from the write side.",
      "analogy": "A restaurant kitchen and its menu board: orders go to the kitchen, where the chefs follow strict recipes (writes). Guests read the menu board, which is updated whenever a dish sells out (reads). Nobody cooks at the menu board, and nobody reads the recipes to choose a meal.",
      "cityShape": "Look for two separate groups of buildings: a write side whose handler floors check rules and publish, and a read side whose query floors only read a read-model antenna. The only pipes between the two groups go through the projector building, which is the single place that writes the read model.",
      "roles": [
        {
          "name": "Command",
          "desc": "A request to change something, named as an order (PlaceOrder, MoveTask). It may be rejected."
        },
        {
          "name": "Write Model",
          "desc": "The command handlers and entities that enforce business rules and record changes. It answers no screen queries."
        },
        {
          "name": "Projector",
          "desc": "Listens to changes from the write side and updates the read model. The only bridge between the two sides."
        },
        {
          "name": "Read Model",
          "desc": "Denormalized data in exactly the shape a screen or report needs, so reads are trivial and fast."
        },
        {
          "name": "Query",
          "desc": "A question plus its handler. It reads the read model and never changes anything."
        }
      ],
      "whenToUse": [
        "Reads and writes have very different shapes or loads (many dashboard reads, few complex writes).",
        "Screens need data combined from several entities, and building it on every request is slow or messy.",
        "Business rules on the write side are complex enough that mixing them with reporting code hurts.",
        "You use event sourcing: the events are a natural feed for read-model projectors."
      ],
      "pitfalls": [
        "Eventual consistency: right after a command, the read model may not show it yet. Users may need 'read your own write' handling.",
        "Two models, a projector and maybe a message bus are a lot of moving parts for a simple CRUD screen. Apply it to the parts that need it, not the whole app.",
        "Letting queries sneak into the write model (or rules into the read side) slowly merges the two models back together."
      ],
      "related": [
        "event-sourcing",
        "command",
        "mediator",
        "repository",
        "dto",
        "pub-sub"
      ],
      "quiz": [
        {
          "q": "A dashboard needs each customer's open orders and total spend. Where should that combined data come from in CQRS?",
          "options": [
            "Load every Order from the write model and sum them in the query",
            "A read-model row per customer that a projector keeps up to date",
            "The command handler should return it after each command",
            "The UI should compute it from raw database tables"
          ],
          "answer": 1,
          "why": "The read model stores data already shaped for the screen, so the query is a simple lookup. The write model stays focused on rules."
        },
        {
          "q": "A user moves a task and the board still shows it in the old column for a moment. What is the likely cause?",
          "options": [
            "The command was rejected",
            "The read model is updated asynchronously and has not caught up yet",
            "The write model forgot the change",
            "Queries are not allowed to read tasks"
          ],
          "answer": 1,
          "why": "With separate models, the projector runs after the write. Until it processes the event, queries see the previous state: eventual consistency."
        }
      ],
      "demos": [
        {
          "id": "cqrs-py-library",
          "title": "Library loans: write rules, read shelves",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Borrowing and returning go to a command handler that enforces 'one loan per book'. The shelf list and 'my books' screen read a separate model that is updated after each change.",
          "roles": {
            "Command": [
              "cqrs-py-library/commands.py#BorrowBook",
              "cqrs-py-library/commands.py#ReturnBook"
            ],
            "Write Model": [
              "cqrs-py-library/write_side.py#LibraryCommandHandler"
            ],
            "Projector": [
              "cqrs-py-library/read_side.py#CatalogReadModel.project"
            ],
            "Read Model": [
              "cqrs-py-library/read_side.py#CatalogReadModel"
            ],
            "Query": [
              "cqrs-py-library/read_side.py#CatalogReadModel.available_titles",
              "cqrs-py-library/read_side.py#CatalogReadModel.books_of"
            ]
          },
          "trace": [
            {
              "at": "cqrs-py-library/main.py#main",
              "say": "main() creates the read model first, then a command handler that reports every change to it."
            },
            {
              "at": "cqrs-py-library/write_side.py#LibraryCommandHandler.borrow",
              "say": "A BorrowBook command checks the rule (book not already lent), records the loan, then announces the change."
            },
            {
              "at": "cqrs-py-library/read_side.py#CatalogReadModel.project",
              "say": "The read side reshapes the change for its screens: remove from the shelf set, add the title to Nora's list."
            },
            {
              "at": "cqrs-py-library/read_side.py#CatalogReadModel.available_titles",
              "say": "A query just reads prepared data. It never checks rules or touches the loans dict."
            },
            {
              "at": "cqrs-py-library/read_side.py#CatalogReadModel.books_of",
              "say": "'My books' is a ready-made list per member, so this screen costs one lookup."
            },
            {
              "at": "cqrs-py-library/write_side.py#LibraryCommandHandler.give_back",
              "say": "Returning follows the same one-way path: command, rule, change notice, projection."
            }
          ],
          "files": {
            "cqrs-py-library/commands.py": "from dataclasses import dataclass\n\n\n# Commands ask the system to DO something. They are named as orders, not facts.\n@dataclass\nclass BorrowBook:\n    isbn: str\n    member: str\n\n\n@dataclass\nclass ReturnBook:\n    isbn: str\n",
            "cqrs-py-library/main.py": "from .commands import BorrowBook, ReturnBook\nfrom .read_side import CatalogReadModel\nfrom .write_side import LibraryCommandHandler\n\n\ndef main():\n    reads = CatalogReadModel({\"111\": \"Dune\", \"222\": \"Emma\", \"333\": \"Ulysses\"})\n    writes = LibraryCommandHandler(on_change=reads.project)\n\n    writes.borrow(BorrowBook(isbn=\"111\", member=\"nora\"))\n    writes.borrow(BorrowBook(isbn=\"333\", member=\"nora\"))\n    print(\"Shelf:\", reads.available_titles())\n    print(\"Nora has:\", reads.books_of(\"nora\"))\n\n    writes.give_back(ReturnBook(isbn=\"111\"))\n    print(\"Shelf:\", reads.available_titles())\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "cqrs-py-library/read_side.py": "class CatalogReadModel:\n    \"\"\"Read side: data kept in exactly the shape the screens need.\"\"\"\n\n    def __init__(self, titles):\n        self.titles = titles\n        self.available = set(titles)\n        self.loans_by_member = {}\n\n    def project(self, change, isbn, member):\n        books = self.loans_by_member.setdefault(member, [])\n        if change == \"borrowed\":\n            self.available.discard(isbn)\n            books.append(self.titles[isbn])\n        else:\n            self.available.add(isbn)\n            books.remove(self.titles[isbn])\n\n    def available_titles(self):\n        return sorted(self.titles[isbn] for isbn in self.available)\n\n    def books_of(self, member):\n        return list(self.loans_by_member.get(member, []))\n",
            "cqrs-py-library/write_side.py": "from .commands import BorrowBook, ReturnBook\n\n\nclass LibraryCommandHandler:\n    \"\"\"Write side: enforces the rules. It never answers 'show me' questions.\"\"\"\n\n    def __init__(self, on_change):\n        self.loans = {}  # isbn -> member\n        self.on_change = on_change\n\n    def borrow(self, cmd: BorrowBook):\n        if cmd.isbn in self.loans:\n            raise ValueError(\"That book is already on loan\")\n        self.loans[cmd.isbn] = cmd.member\n        self.on_change(\"borrowed\", cmd.isbn, cmd.member)\n\n    def give_back(self, cmd: ReturnBook):\n        member = self.loans.pop(cmd.isbn)\n        self.on_change(\"returned\", cmd.isbn, member)\n"
          }
        },
        {
          "id": "cqrs-cs-orders",
          "title": "Shop orders with a customer dashboard",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "Placing and cancelling orders runs through a rule-checking handler and publishes events on a bus. A projector keeps one dashboard row per customer, so the query side returns a DTO without ever loading an Order.",
          "roles": {
            "Command": [
              "cqrs-cs-orders/Messages.cs#PlaceOrder",
              "cqrs-cs-orders/Messages.cs#CancelOrder"
            ],
            "Write Model": [
              "cqrs-cs-orders/OrderCommandHandler.cs#OrderCommandHandler",
              "cqrs-cs-orders/OrderCommandHandler.cs#Order"
            ],
            "Projector": [
              "cqrs-cs-orders/DashboardProjector.cs#DashboardProjector"
            ],
            "Read Model": [
              "cqrs-cs-orders/DashboardProjector.cs#DashboardRow"
            ],
            "Query": [
              "cqrs-cs-orders/DashboardQueries.cs#DashboardQueries",
              "cqrs-cs-orders/Messages.cs#GetCustomerDashboard"
            ]
          },
          "trace": [
            {
              "at": "cqrs-cs-orders/Program.cs#Program.Main",
              "say": "Main builds two sides that share nothing but the bus and the read store: commands write, queries read."
            },
            {
              "at": "cqrs-cs-orders/OrderCommandHandler.cs#OrderCommandHandler.Handle",
              "say": "PlaceOrder is validated, the Order is saved to the write store, and an OrderPlaced event is published."
            },
            {
              "at": "cqrs-cs-orders/EventBus.cs#EventBus.Publish",
              "say": "The bus hands the event to every subscriber. In production this is a queue, so the read side updates a bit later."
            },
            {
              "at": "cqrs-cs-orders/DashboardProjector.cs#DashboardProjector.On",
              "say": "The projector updates the customer's row: open orders +1, spend + total, a line of activity. Cancel undoes it."
            },
            {
              "at": "cqrs-cs-orders/DashboardProjector.cs#DashboardProjector.RowFor",
              "say": "Rows are created on first use. The read store is just a dictionary keyed the way the screen looks things up."
            },
            {
              "at": "cqrs-cs-orders/DashboardQueries.cs#DashboardQueries.Handle",
              "say": "The query copies one row into a DashboardDto. No joins, no sums over orders, no rules."
            }
          ],
          "files": {
            "cqrs-cs-orders/DashboardProjector.cs": "using System.Collections.Generic;\n\n// One denormalized row per customer: exactly what the dashboard shows.\npublic class DashboardRow\n{\n    public int OpenOrders { get; set; }\n    public decimal LifetimeSpend { get; set; }\n    public List<string> RecentActivity { get; } = new List<string>();\n}\n\n// Keeps the read model in sync by listening to write-side events.\npublic class DashboardProjector\n{\n    private readonly Dictionary<string, DashboardRow> readStore;\n\n    public DashboardProjector(Dictionary<string, DashboardRow> readStore)\n    {\n        this.readStore = readStore;\n    }\n\n    public void On(object domainEvent)\n    {\n        switch (domainEvent)\n        {\n            case OrderPlaced placed:\n                var row = RowFor(placed.CustomerId);\n                row.OpenOrders++;\n                row.LifetimeSpend += placed.Total;\n                row.RecentActivity.Insert(0, $\"Placed order for {placed.Total:C}\");\n                break;\n            case OrderCancelled cancelled:\n                var cancelledRow = RowFor(cancelled.CustomerId);\n                cancelledRow.OpenOrders--;\n                cancelledRow.LifetimeSpend -= cancelled.Total;\n                cancelledRow.RecentActivity.Insert(0, \"Cancelled an order\");\n                break;\n        }\n    }\n\n    private DashboardRow RowFor(string customerId)\n    {\n        if (!readStore.TryGetValue(customerId, out var row))\n        {\n            row = new DashboardRow();\n            readStore[customerId] = row;\n        }\n        return row;\n    }\n}\n",
            "cqrs-cs-orders/DashboardQueries.cs": "using System.Collections.Generic;\nusing System.Linq;\n\n// Query side: reads the prepared rows, never touches Order or its rules.\npublic class DashboardQueries\n{\n    private readonly Dictionary<string, DashboardRow> readStore;\n\n    public DashboardQueries(Dictionary<string, DashboardRow> readStore)\n    {\n        this.readStore = readStore;\n    }\n\n    public DashboardDto Handle(GetCustomerDashboard query)\n    {\n        if (!readStore.TryGetValue(query.CustomerId, out var row))\n        {\n            return new DashboardDto(query.CustomerId, 0, 0m, new List<string>());\n        }\n        return new DashboardDto(query.CustomerId, row.OpenOrders, row.LifetimeSpend, row.RecentActivity.Take(5).ToList());\n    }\n}\n",
            "cqrs-cs-orders/EventBus.cs": "using System;\nusing System.Collections.Generic;\n\n// In-process stand-in for a message broker between the write and read sides.\npublic class EventBus\n{\n    private readonly List<Action<object>> handlers = new List<Action<object>>();\n\n    public void Subscribe(Action<object> handler)\n    {\n        handlers.Add(handler);\n    }\n\n    public void Publish(object domainEvent)\n    {\n        foreach (var handler in handlers)\n        {\n            handler(domainEvent);\n        }\n    }\n}\n",
            "cqrs-cs-orders/Messages.cs": "using System;\nusing System.Collections.Generic;\n\n// Commands: requests to change something. Handled once, may be rejected.\npublic record PlaceOrder(Guid OrderId, string CustomerId, List<OrderLine> Lines);\npublic record CancelOrder(Guid OrderId, string Reason);\npublic record OrderLine(string Sku, int Quantity, decimal UnitPrice);\n\n// Events: what the write side announces after a successful command.\npublic record OrderPlaced(Guid OrderId, string CustomerId, decimal Total, DateTime At);\npublic record OrderCancelled(Guid OrderId, string CustomerId, decimal Total);\n\n// Query and its answer: shaped for one screen, no business rules inside.\npublic record GetCustomerDashboard(string CustomerId);\npublic record DashboardDto(string CustomerId, int OpenOrders, decimal LifetimeSpend, List<string> RecentActivity);\n",
            "cqrs-cs-orders/OrderCommandHandler.cs": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\n// Write model: normalized, rule-heavy, optimized for correctness, not for screens.\npublic class Order\n{\n    public Guid Id { get; init; }\n    public string CustomerId { get; init; }\n    public List<OrderLine> Lines { get; init; }\n    public bool Cancelled { get; set; }\n\n    public decimal Total()\n    {\n        return Lines.Sum(l => l.Quantity * l.UnitPrice);\n    }\n}\n\npublic class OrderCommandHandler\n{\n    private readonly Dictionary<Guid, Order> writeStore = new Dictionary<Guid, Order>();\n    private readonly EventBus bus;\n\n    public OrderCommandHandler(EventBus bus)\n    {\n        this.bus = bus;\n    }\n\n    public void Handle(PlaceOrder cmd)\n    {\n        if (cmd.Lines.Count == 0 || cmd.Lines.Any(l => l.Quantity <= 0))\n        {\n            throw new InvalidOperationException(\"An order needs at least one line with a positive quantity\");\n        }\n        var order = new Order { Id = cmd.OrderId, CustomerId = cmd.CustomerId, Lines = cmd.Lines };\n        writeStore[order.Id] = order;\n        bus.Publish(new OrderPlaced(order.Id, order.CustomerId, order.Total(), DateTime.UtcNow));\n    }\n\n    public void Handle(CancelOrder cmd)\n    {\n        var order = writeStore[cmd.OrderId];\n        if (order.Cancelled)\n        {\n            throw new InvalidOperationException(\"Order is already cancelled\");\n        }\n        order.Cancelled = true;\n        bus.Publish(new OrderCancelled(order.Id, order.CustomerId, order.Total()));\n    }\n}\n",
            "cqrs-cs-orders/Program.cs": "using System;\nusing System.Collections.Generic;\n\npublic static class Program\n{\n    public static void Main()\n    {\n        var bus = new EventBus();\n        var readStore = new Dictionary<string, DashboardRow>();\n        var projector = new DashboardProjector(readStore);\n        bus.Subscribe(projector.On);\n\n        var commands = new OrderCommandHandler(bus);\n        var queries = new DashboardQueries(readStore);\n\n        var first = Guid.NewGuid();\n        commands.Handle(new PlaceOrder(first, \"c-42\", new List<OrderLine> { new OrderLine(\"mug\", 2, 12m) }));\n        commands.Handle(new PlaceOrder(Guid.NewGuid(), \"c-42\", new List<OrderLine> { new OrderLine(\"teapot\", 1, 35m) }));\n        commands.Handle(new CancelOrder(first, \"changed my mind\"));\n\n        DashboardDto dashboard = queries.Handle(new GetCustomerDashboard(\"c-42\"));\n        Console.WriteLine($\"{dashboard.OpenOrders} open, spent {dashboard.LifetimeSpend:C}\");\n        foreach (var line in dashboard.RecentActivity)\n        {\n            Console.WriteLine(\" - \" + line);\n        }\n    }\n}\n"
          }
        },
        {
          "id": "cqrs-kt-taskboard",
          "title": "Task board with a command bus and a lagging read model",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "Commands are routed by type through a bus; the write side enforces a work-in-progress limit and drops events into an outbox. The read model only changes when the projector catches up, so you can see eventual consistency happen.",
          "roles": {
            "Command": [
              "cqrs-kt-taskboard/Messages.kt#CreateTask",
              "cqrs-kt-taskboard/Messages.kt#MoveTask",
              "cqrs-kt-taskboard/CommandBus.kt#CommandBus"
            ],
            "Write Model": [
              "cqrs-kt-taskboard/TaskWriteModel.kt#TaskCommandHandler",
              "cqrs-kt-taskboard/TaskWriteModel.kt#Task"
            ],
            "Projector": [
              "cqrs-kt-taskboard/BoardProjector.kt#BoardProjector",
              "cqrs-kt-taskboard/Outbox.kt#Outbox"
            ],
            "Read Model": [
              "cqrs-kt-taskboard/BoardProjector.kt#BoardReadModel",
              "cqrs-kt-taskboard/Messages.kt#TaskCard"
            ],
            "Query": [
              "cqrs-kt-taskboard/BoardQueries.kt#BoardQueries"
            ]
          },
          "trace": [
            {
              "at": "cqrs-kt-taskboard/Main.kt#main",
              "say": "main() wires the write side, an outbox, the projector and the query side, then registers one handler per command type."
            },
            {
              "at": "cqrs-kt-taskboard/CommandBus.kt#CommandBus.send",
              "say": "send() looks up the handler by the command's class. Callers depend on the bus, not on the write model."
            },
            {
              "at": "cqrs-kt-taskboard/TaskWriteModel.kt#TaskCommandHandler.move",
              "say": "The write side checks the WIP limit against its own full Task entities, changes the column and records TaskMoved."
            },
            {
              "at": "cqrs-kt-taskboard/Outbox.kt#Outbox.add",
              "say": "The event waits in the outbox. Nothing on the read side has changed yet."
            },
            {
              "at": "cqrs-kt-taskboard/BoardQueries.kt#BoardQueries.cardsIn",
              "say": "Querying DOING now returns an empty list: the read model is behind. This is eventual consistency."
            },
            {
              "at": "cqrs-kt-taskboard/BoardProjector.kt#BoardProjector.catchUp",
              "say": "catchUp() drains the outbox and applies each event, like a consumer reading from a queue."
            },
            {
              "at": "cqrs-kt-taskboard/BoardProjector.kt#BoardProjector.apply",
              "say": "Cards are immutable data; apply() replaces them with copies that carry the new column and a move counter."
            },
            {
              "at": "cqrs-kt-taskboard/TaskWriteModel.kt#TaskCommandHandler.move",
              "say": "Moving t2 to DOING breaks the limit of 1. Rules live only on the write side, so the command is rejected there."
            }
          ],
          "files": {
            "cqrs-kt-taskboard/BoardProjector.kt": "// Read model: one ready-to-render card per task, no rules.\nclass BoardReadModel {\n    val cards = mutableMapOf<String, TaskCard>()\n}\n\n// Applies events to the read model. Runs later than the write, so reads can lag a little.\nclass BoardProjector(private val outbox: Outbox, private val readModel: BoardReadModel) {\n\n    fun catchUp(): Int {\n        val batch = outbox.drain()\n        for (event in batch) {\n            apply(event)\n        }\n        return batch.size\n    }\n\n    private fun apply(event: TaskEvent) {\n        when (event) {\n            is TaskCreated -> readModel.cards[event.id] = TaskCard(event.id, event.title, Column.TODO, 0)\n            is TaskMoved -> {\n                val card = readModel.cards.getValue(event.id)\n                readModel.cards[event.id] = card.copy(column = event.to, moves = card.moves + 1)\n            }\n        }\n    }\n}\n",
            "cqrs-kt-taskboard/BoardQueries.kt": "// Query side: cheap lookups on the read model. It cannot change anything.\nclass BoardQueries(private val readModel: BoardReadModel) {\n\n    fun cardsIn(query: CardsInColumn): List<TaskCard> {\n        return readModel.cards.values.filter { it.column == query.column }.sortedBy { it.title }\n    }\n\n    fun mostMoved(): TaskCard? {\n        return readModel.cards.values.maxByOrNull { it.moves }\n    }\n}\n",
            "cqrs-kt-taskboard/CommandBus.kt": "import kotlin.reflect.KClass\n\n// Routes each command type to exactly one handler. Callers never see the write model.\nclass CommandBus {\n    private val handlers = mutableMapOf<KClass<out Command>, (Command) -> Unit>()\n\n    fun <C : Command> register(type: KClass<C>, handler: (C) -> Unit) {\n        @Suppress(\"UNCHECKED_CAST\")\n        handlers[type] = { command -> handler(command as C) }\n    }\n\n    fun send(command: Command) {\n        val handler = handlers[command::class] ?: error(\"No handler for ${command::class.simpleName}\")\n        handler(command)\n    }\n}\n",
            "cqrs-kt-taskboard/Main.kt": "fun main() {\n    val outbox = Outbox()\n    val writes = TaskCommandHandler(outbox, wipLimit = 1)\n    val readModel = BoardReadModel()\n    val projector = BoardProjector(outbox, readModel)\n    val queries = BoardQueries(readModel)\n\n    val bus = CommandBus()\n    bus.register(CreateTask::class) { writes.create(it) }\n    bus.register(MoveTask::class) { writes.move(it) }\n\n    bus.send(CreateTask(\"t1\", \"Write intro\"))\n    bus.send(CreateTask(\"t2\", \"Draw diagram\"))\n    bus.send(MoveTask(\"t1\", Column.DOING))\n    println(\"Before catch-up: ${queries.cardsIn(CardsInColumn(Column.DOING))}\")\n\n    println(\"Projected ${projector.catchUp()} events\")\n    println(\"DOING: ${queries.cardsIn(CardsInColumn(Column.DOING))}\")\n\n    runCatching { bus.send(MoveTask(\"t2\", Column.DOING)) }\n        .onFailure { println(\"Rejected: ${it.message}\") }\n}\n",
            "cqrs-kt-taskboard/Messages.kt": "enum class Column { TODO, DOING, DONE }\n\n// Commands: what a user wants to happen.\nsealed interface Command {\n    // Marker: the bus only accepts types that implement this.\n}\n\ndata class CreateTask(val id: String, val title: String) : Command\ndata class MoveTask(val id: String, val to: Column) : Command\n\n// Events: what the write side reports after accepting a command.\nsealed interface TaskEvent {\n    // Marker for everything the projector understands.\n}\n\ndata class TaskCreated(val id: String, val title: String) : TaskEvent\ndata class TaskMoved(val id: String, val from: Column, val to: Column) : TaskEvent\n\n// Queries and the flat cards they return.\ndata class CardsInColumn(val column: Column)\ndata class TaskCard(val id: String, val title: String, val column: Column, val moves: Int)\n",
            "cqrs-kt-taskboard/Outbox.kt": "// Events wait here until the read side picks them up, like a message queue would.\nclass Outbox {\n    private val pending = ArrayDeque<TaskEvent>()\n\n    fun add(event: TaskEvent) {\n        pending.addLast(event)\n    }\n\n    fun drain(): List<TaskEvent> {\n        val batch = pending.toList()\n        pending.clear()\n        return batch\n    }\n}\n",
            "cqrs-kt-taskboard/TaskWriteModel.kt": "// Write model: the full entity plus the rules. Optimized for consistency, not for display.\nclass Task(val id: String, val title: String, var column: Column)\n\nclass TaskCommandHandler(private val outbox: Outbox, private val wipLimit: Int) {\n    private val tasks = mutableMapOf<String, Task>()\n\n    fun create(cmd: CreateTask) {\n        require(cmd.id !in tasks) { \"Task ${cmd.id} already exists\" }\n        tasks[cmd.id] = Task(cmd.id, cmd.title, Column.TODO)\n        outbox.add(TaskCreated(cmd.id, cmd.title))\n    }\n\n    fun move(cmd: MoveTask) {\n        val task = tasks[cmd.id] ?: error(\"Unknown task ${cmd.id}\")\n        val inProgress = tasks.values.count { it.column == Column.DOING }\n        check(cmd.to != Column.DOING || inProgress < wipLimit) { \"WIP limit of $wipLimit reached\" }\n        val from = task.column\n        task.column = cmd.to\n        outbox.add(TaskMoved(cmd.id, from, cmd.to))\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "circuit-breaker",
      "name": "Circuit Breaker",
      "family": "Architecture",
      "aka": [
        "Breaker",
        "Fail fast",
        "Resilience policy"
      ],
      "tagline": "Stop calling a failing service for a while, then carefully test whether it has recovered.",
      "intent": "Wrap calls to a remote dependency in an object that counts failures. After too many, the breaker 'opens' and fails fast without calling the service at all, which protects both your app and the struggling service. After a cool-down it goes 'half-open', lets one trial call through, and closes again only if that call succeeds.",
      "analogy": "The fuse box in your house: when a faulty kettle keeps shorting, the fuse trips and cuts the power instead of letting the wires burn. After you fix the problem you flip it back, and if it trips again you know the fault is still there.",
      "cityShape": "Look for one breaker building standing between the client and the service: every call pipe from the client enters its execute() floor, and only that floor has a pipe on to the remote service. Its roof carries state and failure-count antennas that the success and failure floors keep rewriting.",
      "roles": [
        {
          "name": "Circuit Breaker",
          "desc": "Wraps every call, keeps the state (Closed, Open, Half-Open) and a failure counter, and decides whether a call may go through."
        },
        {
          "name": "Protected Service",
          "desc": "The slow or unreliable dependency: a remote API, database or payment provider."
        },
        {
          "name": "Retry / Backoff",
          "desc": "Retries short glitches after growing pauses (backoff), and stops at once when the breaker is open."
        },
        {
          "name": "Fallback",
          "desc": "What the caller does instead when the call fails fast: a cached value, a default, or 'queue it for later'."
        },
        {
          "name": "Client",
          "desc": "The code that needs the service. It calls through the breaker and handles the fast failure."
        }
      ],
      "whenToUse": [
        "Your app calls a remote service that can become slow or unavailable, and waiting on timeouts would tie up threads or users.",
        "A struggling service needs breathing room to recover instead of a flood of retries.",
        "You can offer a sensible fallback (cached data, a default, 'try again later') when the dependency is down.",
        "You already retry failed calls and want a limit so retries do not turn an outage into a storm."
      ],
      "pitfalls": [
        "Retrying inside an open breaker, or retrying without backoff, multiplies load on a service that is already down.",
        "Thresholds that are too sensitive open the circuit on normal noise; too lax and it never protects anything. Tune with real error rates.",
        "Sharing one breaker for unrelated endpoints: one bad endpoint then blocks healthy ones. Use one breaker per dependency."
      ],
      "related": [
        "proxy",
        "decorator",
        "state",
        "cache-aside",
        "microservices"
      ],
      "quiz": [
        {
          "q": "The breaker is Open and the cool-down has just ended. What happens to the next call?",
          "options": [
            "It is rejected like all calls while open",
            "The breaker goes Half-Open and lets it through as a trial; success closes the circuit, failure opens it again",
            "The failure counter is reset and the breaker closes immediately",
            "All queued calls are sent at once"
          ],
          "answer": 1,
          "why": "Half-Open is the careful test: one call checks whether the service recovered before normal traffic resumes."
        },
        {
          "q": "Why should a retry loop stop immediately when the breaker reports it is open?",
          "options": [
            "Because retries are always a bad idea",
            "Because the breaker has already decided the service is unhealthy; retrying only burns time and adds load",
            "Because the breaker deletes the request",
            "It should not; retries are how the breaker closes"
          ],
          "answer": 1,
          "why": "Retry handles short glitches; the open breaker signals a longer outage. Failing fast and using the fallback is the point."
        }
      ],
      "demos": [
        {
          "id": "circuit-breaker-py-weather",
          "title": "Weather widget with a fuse",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A weather widget calls a flaky API through a breaker and a small retry helper. Notice the order: retry wraps the breaker, so once the circuit opens the retry gives up at once.",
          "roles": {
            "Circuit Breaker": [
              "circuit-breaker-py-weather/breaker.py#CircuitBreaker"
            ],
            "Protected Service": [
              "circuit-breaker-py-weather/weather_api.py#WeatherApi"
            ],
            "Retry / Backoff": [
              "circuit-breaker-py-weather/retry.py#retry_with_backoff"
            ],
            "Fallback": [
              "circuit-breaker-py-weather/main.py#show_forecast"
            ],
            "Client": [
              "circuit-breaker-py-weather/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "circuit-breaker-py-weather/main.py#main",
              "say": "main() asks for forecasts while the API is healthy, then simulates an outage."
            },
            {
              "at": "circuit-breaker-py-weather/main.py#show_forecast",
              "say": "The widget never calls the API directly: it goes through retry, then the breaker, and has a friendly fallback text."
            },
            {
              "at": "circuit-breaker-py-weather/retry.py#retry_with_backoff",
              "say": "A timeout is retried after 0.2s, then 0.4s. Doubling the pause gives a short glitch time to pass."
            },
            {
              "at": "circuit-breaker-py-weather/breaker.py#CircuitBreaker.call",
              "say": "Closed: the call goes through. Any exception is recorded before it is re-raised."
            },
            {
              "at": "circuit-breaker-py-weather/breaker.py#CircuitBreaker.record_failure",
              "say": "The third failure in a row flips the state to open and notes the time."
            },
            {
              "at": "circuit-breaker-py-weather/breaker.py#CircuitBreaker.call",
              "say": "For Berlin the circuit is open, so call() raises CircuitOpenError at once. The API is not even touched."
            },
            {
              "at": "circuit-breaker-py-weather/breaker.py#CircuitBreaker.record_success",
              "say": "After the cool-down, one half-open trial succeeds. The counter resets and the circuit closes."
            }
          ],
          "files": {
            "circuit-breaker-py-weather/breaker.py": "import time\n\n\nclass CircuitOpenError(Exception):\n    \"\"\"Raised instead of calling the service while the circuit is open.\"\"\"\n\n\nclass CircuitBreaker:\n    \"\"\"Counts failures and stops calling a sick service for a while.\"\"\"\n\n    def __init__(self, max_failures=3, reset_after=2.0):\n        self.max_failures = max_failures\n        self.reset_after = reset_after\n        self.failures = 0\n        self.state = \"closed\"\n        self.opened_at = 0.0\n\n    def call(self, func, *args):\n        if self.state == \"open\":\n            if time.time() - self.opened_at < self.reset_after:\n                raise CircuitOpenError(\"circuit is open, skipping the call\")\n            self.state = \"half-open\"\n        try:\n            result = func(*args)\n        except Exception:\n            self.record_failure()\n            raise\n        self.record_success()\n        return result\n\n    def record_failure(self):\n        self.failures += 1\n        if self.state == \"half-open\" or self.failures >= self.max_failures:\n            self.state = \"open\"\n            self.opened_at = time.time()\n\n    def record_success(self):\n        self.failures = 0\n        self.state = \"closed\"\n",
            "circuit-breaker-py-weather/main.py": "import time\nfrom .breaker import CircuitBreaker, CircuitOpenError\nfrom .retry import retry_with_backoff\nfrom .weather_api import WeatherApi\n\napi = WeatherApi()\nbreaker = CircuitBreaker(max_failures=3, reset_after=2.0)\n\n\ndef show_forecast(city):\n    try:\n        text = retry_with_backoff(lambda: breaker.call(api.get_forecast, city))\n    except CircuitOpenError:\n        text = f\"{city}: forecast unavailable, try again in a moment\"\n    except TimeoutError:\n        text = f\"{city}: the weather service is slow right now\"\n    print(f\"[{breaker.state}] {text}\")\n\n\ndef main():\n    show_forecast(\"Augsburg\")\n    api.healthy = False\n    show_forecast(\"Athens\")\n    show_forecast(\"Berlin\")\n    time.sleep(2.1)\n    api.healthy = True\n    show_forecast(\"Berlin\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "circuit-breaker-py-weather/retry.py": "import time\nfrom .breaker import CircuitOpenError\n\n\ndef retry_with_backoff(action, attempts=3, first_delay=0.2):\n    \"\"\"Try again after short, growing pauses: 0.2s, 0.4s, 0.8s ...\"\"\"\n    delay = first_delay\n    for attempt in range(1, attempts + 1):\n        try:\n            return action()\n        except CircuitOpenError:\n            raise  # the breaker said stop: retrying now would be pointless\n        except Exception as error:\n            if attempt == attempts:\n                raise\n            print(f\"  attempt {attempt} failed ({error}), waiting {delay}s\")\n            time.sleep(delay)\n            delay *= 2\n",
            "circuit-breaker-py-weather/weather_api.py": "class WeatherApi:\n    \"\"\"Pretend remote service. Set healthy = False to simulate an outage.\"\"\"\n\n    def __init__(self):\n        self.healthy = True\n\n    def get_forecast(self, city):\n        if not self.healthy:\n            raise TimeoutError(\"weather service timed out\")\n        return f\"{city}: 21°C, sunny\"\n"
          }
        },
        {
          "id": "circuit-breaker-cs-payments",
          "title": "Checkout with retry, backoff and a breaker",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "A checkout service charges cards through a retry policy (exponential backoff with jitter) wrapped around a circuit breaker. When the provider is down, orders are queued instead of making customers wait.",
          "roles": {
            "Circuit Breaker": [
              "circuit-breaker-cs-payments/CircuitBreaker.cs#CircuitBreaker"
            ],
            "Protected Service": [
              "circuit-breaker-cs-payments/PaymentGateway.cs#IPaymentGateway",
              "circuit-breaker-cs-payments/PaymentGateway.cs#RemotePaymentGateway"
            ],
            "Retry / Backoff": [
              "circuit-breaker-cs-payments/RetryPolicy.cs#RetryPolicy"
            ],
            "Fallback": [
              "circuit-breaker-cs-payments/CheckoutService.cs#CheckoutService.QueueForLater"
            ],
            "Client": [
              "circuit-breaker-cs-payments/CheckoutService.cs#CheckoutService"
            ]
          },
          "trace": [
            {
              "at": "circuit-breaker-cs-payments/Program.cs#Program.Main",
              "say": "Main wires gateway, breaker (3 failures, 30s open) and retry into one CheckoutService. The clock is injected so time can be fast-forwarded."
            },
            {
              "at": "circuit-breaker-cs-payments/CheckoutService.cs#CheckoutService.CheckoutAsync",
              "say": "Each charge goes retry → breaker → gateway. The order of wrappers matters: the breaker sees every single attempt."
            },
            {
              "at": "circuit-breaker-cs-payments/RetryPolicy.cs#RetryPolicy.ExecuteAsync",
              "say": "A timeout is retried, but a BrokenCircuitException is re-thrown at once: retrying an open circuit only adds load."
            },
            {
              "at": "circuit-breaker-cs-payments/RetryPolicy.cs#RetryPolicy.DelayFor",
              "say": "Waits grow 100, 200, 400 ms plus random jitter, so many clients do not retry in lockstep."
            },
            {
              "at": "circuit-breaker-cs-payments/CircuitBreaker.cs#CircuitBreaker.OnFailure",
              "say": "The third consecutive failure opens the circuit and remembers when, starting the cool-down."
            },
            {
              "at": "circuit-breaker-cs-payments/CircuitBreaker.cs#CircuitBreaker.BeforeCall",
              "say": "Order A-3 arrives while open: BeforeCall throws immediately, so the customer gets an answer in microseconds, not seconds."
            },
            {
              "at": "circuit-breaker-cs-payments/CheckoutService.cs#CheckoutService.QueueForLater",
              "say": "The fallback accepts the order and queues the payment. Degraded, but the shop stays usable."
            },
            {
              "at": "circuit-breaker-cs-payments/CircuitBreaker.cs#CircuitBreaker.OnSuccess",
              "say": "31 seconds later one half-open trial call succeeds, the counter resets and the circuit closes again."
            }
          ],
          "files": {
            "circuit-breaker-cs-payments/CheckoutService.cs": "using System;\nusing System.Collections.Generic;\nusing System.Threading.Tasks;\n\n// The client: charges orders through retry + breaker, and has a fallback.\npublic class CheckoutService\n{\n    private readonly IPaymentGateway gateway;\n    private readonly CircuitBreaker breaker;\n    private readonly RetryPolicy retry;\n    private readonly Queue<string> pendingOrders = new Queue<string>();\n\n    public CheckoutService(IPaymentGateway gateway, CircuitBreaker breaker, RetryPolicy retry)\n    {\n        this.gateway = gateway;\n        this.breaker = breaker;\n        this.retry = retry;\n    }\n\n    public async Task<string> CheckoutAsync(string orderId, decimal amount)\n    {\n        try\n        {\n            string receipt = await retry.ExecuteAsync(() => breaker.ExecuteAsync(() => gateway.ChargeAsync(orderId, amount)));\n            return $\"{orderId}: paid ({receipt})\";\n        }\n        catch (Exception error) when (error is BrokenCircuitException || error is TimeoutException)\n        {\n            return QueueForLater(orderId, error.Message);\n        }\n    }\n\n    private string QueueForLater(string orderId, string reason)\n    {\n        pendingOrders.Enqueue(orderId);\n        return $\"{orderId}: accepted, payment will be retried later ({reason})\";\n    }\n}\n",
            "circuit-breaker-cs-payments/CircuitBreaker.cs": "using System;\nusing System.Threading.Tasks;\n\npublic enum CircuitState { Closed, Open, HalfOpen }\n\npublic class BrokenCircuitException : Exception\n{\n    public BrokenCircuitException(TimeSpan retryIn) : base($\"Circuit open, retry in {retryIn.TotalSeconds:0}s\") { }\n}\n\n// Guards one remote dependency (here: the payment provider). All calls to it go through ExecuteAsync.\npublic class CircuitBreaker\n{\n    private readonly int failureThreshold;\n    private readonly TimeSpan openDuration;\n    private readonly Func<DateTime> clock;\n    private int consecutiveFailures;\n    private DateTime openedAt;\n    private bool trialInFlight;\n\n    public CircuitState State { get; private set; } = CircuitState.Closed;\n\n    public CircuitBreaker(int failureThreshold, TimeSpan openDuration, Func<DateTime> clock)\n    {\n        this.failureThreshold = failureThreshold;\n        this.openDuration = openDuration;\n        this.clock = clock;\n    }\n\n    public async Task<string> ExecuteAsync(Func<Task<string>> action)\n    {\n        BeforeCall();\n        try\n        {\n            string result = await action();\n            OnSuccess();\n            return result;\n        }\n        catch (Exception)\n        {\n            OnFailure();\n            throw;\n        }\n    }\n\n    private void BeforeCall()\n    {\n        if (State == CircuitState.Closed)\n        {\n            return;\n        }\n        TimeSpan waited = clock() - openedAt;\n        if (State == CircuitState.Open && waited >= openDuration)\n        {\n            State = CircuitState.HalfOpen;\n            trialInFlight = true;\n            Console.WriteLine(\"  breaker: half-open, letting one trial call through\");\n            return;\n        }\n        throw new BrokenCircuitException(openDuration - waited);\n    }\n\n    private void OnSuccess()\n    {\n        consecutiveFailures = 0;\n        trialInFlight = false;\n        if (State != CircuitState.Closed)\n        {\n            Console.WriteLine(\"  breaker: trial succeeded, closing\");\n        }\n        State = CircuitState.Closed;\n    }\n\n    private void OnFailure()\n    {\n        consecutiveFailures++;\n        if (State == CircuitState.HalfOpen || consecutiveFailures >= failureThreshold)\n        {\n            State = CircuitState.Open;\n            openedAt = clock();\n            trialInFlight = false;\n            Console.WriteLine($\"  breaker: OPEN after {consecutiveFailures} failures\");\n        }\n    }\n}\n",
            "circuit-breaker-cs-payments/PaymentGateway.cs": "using System;\nusing System.Threading.Tasks;\n\npublic interface IPaymentGateway\n{\n    Task<string> ChargeAsync(string orderId, decimal amount);\n}\n\n// Simulated remote payment provider that can be switched into an outage.\npublic class RemotePaymentGateway : IPaymentGateway\n{\n    public bool IsDown { get; set; }\n\n    public async Task<string> ChargeAsync(string orderId, decimal amount)\n    {\n        await Task.Delay(20);\n        if (IsDown)\n        {\n            throw new TimeoutException(\"payment provider did not answer\");\n        }\n        return $\"receipt-{orderId}\";\n    }\n}\n",
            "circuit-breaker-cs-payments/Program.cs": "using System;\nusing System.Threading.Tasks;\n\npublic static class Program\n{\n    private static DateTime now = new DateTime(2026, 1, 1, 12, 0, 0);\n\n    public static async Task Main()\n    {\n        var gateway = new RemotePaymentGateway();\n        var breaker = new CircuitBreaker(3, TimeSpan.FromSeconds(30), () => now);\n        var retry = new RetryPolicy(3, TimeSpan.FromMilliseconds(100));\n        var checkout = new CheckoutService(gateway, breaker, retry);\n\n        Console.WriteLine(await checkout.CheckoutAsync(\"A-1\", 25m));\n\n        gateway.IsDown = true;\n        Console.WriteLine(await checkout.CheckoutAsync(\"A-2\", 40m));\n        Console.WriteLine(await checkout.CheckoutAsync(\"A-3\", 12m));\n\n        now = now.AddSeconds(31);\n        gateway.IsDown = false;\n        Console.WriteLine(await checkout.CheckoutAsync(\"A-4\", 99m));\n        Console.WriteLine($\"final state: {breaker.State}\");\n    }\n}\n",
            "circuit-breaker-cs-payments/RetryPolicy.cs": "using System;\nusing System.Threading.Tasks;\n\n// Retries transient errors with exponential backoff plus jitter,\n// but gives up at once when the breaker is open.\npublic class RetryPolicy\n{\n    private readonly int maxAttempts;\n    private readonly TimeSpan baseDelay;\n    private readonly Random random = new Random(42);\n\n    public RetryPolicy(int maxAttempts, TimeSpan baseDelay)\n    {\n        this.maxAttempts = maxAttempts;\n        this.baseDelay = baseDelay;\n    }\n\n    public async Task<string> ExecuteAsync(Func<Task<string>> action)\n    {\n        for (int attempt = 1; ; attempt++)\n        {\n            try\n            {\n                return await action();\n            }\n            catch (BrokenCircuitException)\n            {\n                throw;\n            }\n            catch (TimeoutException) when (attempt < maxAttempts)\n            {\n                TimeSpan wait = DelayFor(attempt);\n                Console.WriteLine($\"  retry: attempt {attempt} timed out, waiting {wait.TotalMilliseconds:0} ms\");\n                await Task.Delay(wait);\n            }\n        }\n    }\n\n    public TimeSpan DelayFor(int attempt)\n    {\n        double exponential = baseDelay.TotalMilliseconds * Math.Pow(2, attempt - 1);\n        double jitter = random.NextDouble() * baseDelay.TotalMilliseconds;\n        return TimeSpan.FromMilliseconds(exponential + jitter);\n    }\n}\n"
          }
        },
        {
          "id": "circuit-breaker-cockatiel-real",
          "title": "cockatiel: CircuitBreakerPolicy",
          "lang": "TypeScript",
          "level": "advanced",
          "source": {
            "repo": "connor4312/cockatiel",
            "url": "https://github.com/connor4312/cockatiel/blob/v3.2.1/src/CircuitBreakerPolicy.ts",
            "license": "MIT",
            "note": "Files under cockatiel/ are verbatim from cockatiel 3.2.1; CircuitBreakerPolicy.ts has state hydration, isolate(), toJSON() and the public event accessors trimmed (marked), and Breaker.ts/Backoff.ts lose their re-export lines. usage.ts was written for Software City."
          },
          "story": "The breaker from a popular resilience library modelled on .NET's Polly. Notice the split of jobs: the policy owns the state machine, a pluggable IBreaker decides when to open, and a backoff object decides how long to stay open.",
          "roles": {
            "Circuit Breaker": [
              "circuit-breaker-cockatiel-real/cockatiel/CircuitBreakerPolicy.ts#CircuitBreakerPolicy",
              "circuit-breaker-cockatiel-real/cockatiel/breaker/ConsecutiveBreaker.ts#ConsecutiveBreaker"
            ],
            "Protected Service": [
              "circuit-breaker-cockatiel-real/usage.ts#fetchPrices"
            ],
            "Retry / Backoff": [
              "circuit-breaker-cockatiel-real/cockatiel/backoff/ConstantBackoff.ts#ConstantBackoff"
            ],
            "Fallback": [
              "circuit-breaker-cockatiel-real/usage.ts#loadPrices"
            ],
            "Client": [
              "circuit-breaker-cockatiel-real/usage.ts#run"
            ]
          },
          "trace": [
            {
              "at": "circuit-breaker-cockatiel-real/usage.ts#run",
              "say": "run() loads prices five times while the pricing service is down, waits out the cool-down, then tries once more."
            },
            {
              "at": "circuit-breaker-cockatiel-real/usage.ts#loadPrices",
              "say": "Every call goes through policy.execute(); any error, including 'circuit open', becomes yesterday's prices."
            },
            {
              "at": "circuit-breaker-cockatiel-real/cockatiel/CircuitBreakerPolicy.ts#CircuitBreakerPolicy.execute",
              "say": "A switch on the state. Closed: run the function via the executor and report the outcome to the breaker strategy."
            },
            {
              "at": "circuit-breaker-cockatiel-real/cockatiel/common/Executor.ts#ExecuteWrapper.invoke",
              "say": "invoke() turns a thrown error into a {error} result instead of an exception, so the policy can inspect it calmly."
            },
            {
              "at": "circuit-breaker-cockatiel-real/cockatiel/breaker/ConsecutiveBreaker.ts#ConsecutiveBreaker.failure",
              "say": "The strategy only answers 'should we open?': true on the third failure in a row. Swap it for a sampling breaker without touching the policy."
            },
            {
              "at": "circuit-breaker-cockatiel-real/cockatiel/CircuitBreakerPolicy.ts#CircuitBreakerPolicy.open",
              "say": "open() asks the backoff for how long to stay open, stores openedAt, and emits break events."
            },
            {
              "at": "circuit-breaker-cockatiel-real/cockatiel/CircuitBreakerPolicy.ts#CircuitBreakerPolicy.halfOpen",
              "say": "After the backoff duration, execute() starts a single test call. Concurrent callers await this same test promise."
            },
            {
              "at": "circuit-breaker-cockatiel-real/cockatiel/CircuitBreakerPolicy.ts#CircuitBreakerPolicy.close",
              "say": "The test succeeded, so the state returns to Closed and reset events fire. Normal traffic resumes."
            }
          ],
          "files": {
            "circuit-breaker-cockatiel-real/cockatiel/CircuitBreakerPolicy.ts": "/*\n * Source: cockatiel 3.2.1 — https://github.com/connor4312/cockatiel/blob/v3.2.1/src/CircuitBreakerPolicy.ts\n * MIT License, Copyright (c) 2019 Connor Peet. Included for study.\n */\nimport { ConstantBackoff, IBackoff, IBackoffFactory } from './backoff/Backoff';\nimport { IBreaker } from './breaker/Breaker';\nimport { neverAbortedSignal } from './common/abort';\nimport { EventEmitter } from './common/Event';\nimport { ExecuteWrapper, returnOrThrow } from './common/Executor';\nimport { BrokenCircuitError, HydratingCircuitError, TaskCancelledError } from './errors/Errors';\nimport { IsolatedCircuitError } from './errors/IsolatedCircuitError';\nimport { FailureReason, IDefaultPolicyContext, IPolicy } from './Policy';\n\nexport enum CircuitState {\n  /**\n   * Normal operation. Execution of actions allowed.\n   */\n  Closed,\n\n  /**\n   * The automated controller has opened the circuit. Execution of actions blocked.\n   */\n  Open,\n\n  /**\n   * Recovering from open state, after the automated break duration has\n   * expired. Execution of actions permitted. Success of subsequent action/s\n   * controls onward transition to Open or Closed state.\n   */\n  HalfOpen,\n\n  /**\n   * Circuit held manually in an open state. Execution of actions blocked.\n   */\n  Isolated,\n}\n\n/**\n * Context passed into halfOpenAfter backoff delegate.\n */\nexport interface IHalfOpenAfterBackoffContext extends IDefaultPolicyContext {\n  /**\n   * The consecutive number of times the circuit has entered the\n   * {@link CircuitState.Open} state.\n   */\n  attempt: number;\n  /**\n   * The result of the last method call that caused the circuit to enter the\n   * {@link CircuitState.Open} state. Either a thrown error, or a value that we\n   * determined should open the circuit.\n   */\n  result: FailureReason<unknown>;\n}\n\nexport interface ICircuitBreakerOptions {\n  breaker: IBreaker;\n\n  /**\n   * When to (potentially) enter the {@link CircuitState.HalfOpen} state from\n   * the {@link CircuitState.Open} state. Either a duration in milliseconds or a\n   * backoff factory.\n   */\n  halfOpenAfter: number | IBackoffFactory<IHalfOpenAfterBackoffContext>;\n\n  /**\n   * Initial state from a previous call to {@link CircuitBreakerPolicy.toJSON}.\n   */\n  initialState?: unknown;\n}\n\ntype InnerState =\n  | { value: CircuitState.Closed }\n  | { value: CircuitState.Isolated; counters: number }\n  | {\n      value: CircuitState.Open;\n      openedAt: number;\n      attemptNo: number;\n      backoff: IBackoff<IHalfOpenAfterBackoffContext>;\n    }\n  | {\n      value: CircuitState.HalfOpen;\n      test: Promise<any>;\n      attemptNo: number;\n      backoff: IBackoff<IHalfOpenAfterBackoffContext>;\n    };\n\n// … trimmed: 4 lines, ISerializedState type used only by toJSON()/initialState …\n\nexport class CircuitBreakerPolicy implements IPolicy {\n  declare readonly _altReturn: never;\n\n  private readonly breakEmitter = new EventEmitter<FailureReason<unknown> | { isolated: true }>();\n  private readonly resetEmitter = new EventEmitter<void>();\n  private readonly halfOpenEmitter = new EventEmitter<void>();\n  private readonly stateChangeEmitter = new EventEmitter<CircuitState>();\n  private readonly halfOpenAfterBackoffFactory: IBackoffFactory<IHalfOpenAfterBackoffContext>;\n  private innerLastFailure?: FailureReason<unknown>;\n  private innerState: InnerState = { value: CircuitState.Closed };\n\n  // … trimmed: 30 lines of public event accessors (onBreak, onReset, onHalfOpen, onStateChange, onSuccess, onFailure) …\n\n  /**\n   * Gets the current circuit breaker state.\n   */\n  public get state(): CircuitState {\n    return this.innerState.value;\n  }\n\n  /**\n   * Gets the last reason the circuit breaker failed.\n   */\n  public get lastFailure() {\n    return this.innerLastFailure;\n  }\n\n  constructor(\n    private readonly options: ICircuitBreakerOptions,\n    private readonly executor: ExecuteWrapper,\n  ) {\n    this.halfOpenAfterBackoffFactory =\n      typeof options.halfOpenAfter === 'number'\n        ? new ConstantBackoff(options.halfOpenAfter)\n        : options.halfOpenAfter;\n\n    // … trimmed: 25 lines restoring a serialized initialState (hydration after a restart) …\n  }\n\n  // … trimmed: 30 lines, isolate() which holds the circuit open manually …\n\n  /**\n   * Executes the given function.\n   * @param fn Function to run\n   * @throws a {@link BrokenCircuitError} if the circuit is open\n   * @throws a {@link IsolatedCircuitError} if the circuit is held\n   * open via {@link CircuitBreakerPolicy.isolate}\n   * @returns a Promise that resolves or rejects with the function results.\n   */\n  public async execute<T>(\n    fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,\n    signal = neverAbortedSignal,\n  ): Promise<T> {\n    const state = this.innerState;\n    switch (state.value) {\n      case CircuitState.Closed:\n        const result = await this.executor.invoke(fn, { signal });\n        if ('success' in result) {\n          this.options.breaker.success(state.value);\n        } else {\n          this.innerLastFailure = result;\n          if (this.options.breaker.failure(state.value)) {\n            this.open(result, signal);\n          }\n        }\n\n        return returnOrThrow(result);\n\n      case CircuitState.HalfOpen:\n        await state.test.catch(() => undefined);\n        if (this.state === CircuitState.Closed && signal.aborted) {\n          throw new TaskCancelledError();\n        }\n\n        return this.execute(fn);\n\n      case CircuitState.Open:\n        if (Date.now() - state.openedAt < state.backoff.duration) {\n          throw new BrokenCircuitError();\n        }\n        const test = this.halfOpen(fn, signal);\n        this.innerState = {\n          value: CircuitState.HalfOpen,\n          test,\n          backoff: state.backoff,\n          attemptNo: state.attemptNo + 1,\n        };\n        this.stateChangeEmitter.emit(CircuitState.HalfOpen);\n        return test;\n\n      case CircuitState.Isolated:\n        throw new IsolatedCircuitError();\n\n      default:\n        throw new Error(`Unexpected circuit state ${state}`);\n    }\n  }\n\n  // … trimmed: 27 lines, toJSON() which serializes the breaker state …\n\n  private async halfOpen<T>(\n    fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,\n    signal: AbortSignal,\n  ): Promise<T> {\n    this.halfOpenEmitter.emit();\n\n    try {\n      const result = await this.executor.invoke(fn, { signal });\n      if ('success' in result) {\n        this.options.breaker.success(CircuitState.HalfOpen);\n        this.close();\n      } else {\n        this.innerLastFailure = result;\n        this.options.breaker.failure(CircuitState.HalfOpen);\n        this.open(result, signal);\n      }\n\n      return returnOrThrow(result);\n    } catch (err) {\n      // It's an error, but not one the circuit is meant to retry, so\n      // for our purposes it's a success. Task failed successfully!\n      this.close();\n      throw err;\n    }\n  }\n\n  private open(reason: FailureReason<unknown>, signal: AbortSignal) {\n    if (this.state === CircuitState.Isolated || this.state === CircuitState.Open) {\n      return;\n    }\n\n    const attemptNo =\n      this.innerState.value === CircuitState.HalfOpen ? this.innerState.attemptNo : 1;\n    const context = { attempt: attemptNo, result: reason, signal };\n    const backoff =\n      this.innerState.value === CircuitState.HalfOpen\n        ? this.innerState.backoff.next(context)\n        : this.halfOpenAfterBackoffFactory.next(context);\n\n    this.innerState = { value: CircuitState.Open, openedAt: Date.now(), backoff, attemptNo };\n    this.breakEmitter.emit(reason);\n    this.stateChangeEmitter.emit(CircuitState.Open);\n  }\n\n  private close() {\n    if (this.state === CircuitState.HalfOpen) {\n      this.innerState = { value: CircuitState.Closed };\n      this.resetEmitter.emit();\n      this.stateChangeEmitter.emit(CircuitState.Closed);\n    }\n  }\n}\n",
            "circuit-breaker-cockatiel-real/cockatiel/backoff/Backoff.ts": "/*\n * Source: cockatiel 3.2.1 — https://github.com/connor4312/cockatiel/blob/v3.2.1/src/backoff/Backoff.ts\n * MIT License, Copyright (c) 2019 Connor Peet. Included for study.\n */\n/**\n * A generic type that returns backoff intervals.\n */\nexport interface IBackoffFactory<T> {\n  /**\n   * Returns the first backoff duration.\n   */\n  next(context: T): IBackoff<T>;\n}\n\n/**\n * A generic type that returns backoff intervals.\n */\nexport interface IBackoff<T> extends IBackoffFactory<T> {\n  /**\n   * Returns the number of milliseconds to wait for this backoff attempt.\n   */\n  readonly duration: number;\n}\n\n// … trimmed: re-exports of the other backoff strategies (exponential, delegate, iterable) …\n",
            "circuit-breaker-cockatiel-real/cockatiel/backoff/ConstantBackoff.ts": "/*\n * Source: cockatiel 3.2.1 — https://github.com/connor4312/cockatiel/blob/v3.2.1/src/backoff/ConstantBackoff.ts\n * MIT License, Copyright (c) 2019 Connor Peet. Included for study.\n */\nimport { IBackoff, IBackoffFactory } from './Backoff';\n\nexport class ConstantBackoff implements IBackoffFactory<unknown> {\n  /**\n   * Backoff that returns a constant interval.\n   */\n  constructor(private readonly interval: number) {}\n\n  /**\n   * @inheritdoc\n   */\n  public next() {\n    return instance(this.interval);\n  }\n}\n\nconst instance = (interval: number): IBackoff<unknown> => ({\n  duration: interval,\n  next() {\n    return this;\n  },\n});\n",
            "circuit-breaker-cockatiel-real/cockatiel/breaker/Breaker.ts": "/*\n * Source: cockatiel 3.2.1 — https://github.com/connor4312/cockatiel/blob/v3.2.1/src/breaker/Breaker.ts\n * MIT License, Copyright (c) 2019 Connor Peet. Included for study.\n */\nimport { CircuitState } from '../CircuitBreakerPolicy';\n\n/**\n * The breaker determines when the circuit breaker should open.\n */\nexport interface IBreaker {\n  /**\n   * Gets or sets the internal state of the breaker. Used for serialization\n   * with {@link CircuitBreaker.toJSON}.\n   */\n  state: unknown;\n\n  /**\n   * Called when a call succeeds.\n   */\n  success(state: CircuitState): void;\n\n  /**\n   * Called when a call fails. Returns true if the circuit should open.\n   */\n  failure(state: CircuitState): boolean;\n}\n\n\n// … trimmed: re-exports of CountBreaker and SamplingBreaker (other breaker strategies) …\n",
            "circuit-breaker-cockatiel-real/cockatiel/breaker/ConsecutiveBreaker.ts": "/*\n * Source: cockatiel 3.2.1 — https://github.com/connor4312/cockatiel/blob/v3.2.1/src/breaker/ConsecutiveBreaker.ts\n * MIT License, Copyright (c) 2019 Connor Peet. Included for study.\n */\nimport { IBreaker } from './Breaker';\n\nexport class ConsecutiveBreaker implements IBreaker {\n  /**\n   * @inheritdoc\n   */\n  public state = 0;\n\n  /**\n   * ConsecutiveBreaker breaks if more than `threshold` exceptions are received\n   * over a time period.\n   */\n  constructor(private readonly threshold: number) {}\n\n  /**\n   * @inheritdoc\n   */\n  public success() {\n    this.state = 0;\n  }\n\n  /**\n   * @inheritdoc\n   */\n  public failure() {\n    return ++this.state >= this.threshold;\n  }\n}\n",
            "circuit-breaker-cockatiel-real/cockatiel/common/Executor.ts": "/*\n * Source: cockatiel 3.2.1 — https://github.com/connor4312/cockatiel/blob/v3.2.1/src/common/Executor.ts\n * MIT License, Copyright (c) 2019 Connor Peet. Included for study.\n */\nimport { FailureReason, IFailureEvent, ISuccessEvent } from '../Policy';\nimport { EventEmitter } from './Event';\n\nexport type FailureOrSuccess<R> = FailureReason<R> | { success: R };\n\nexport const returnOrThrow = <R>(failure: FailureOrSuccess<R>) => {\n  if ('error' in failure) {\n    throw failure.error;\n  }\n\n  if ('success' in failure) {\n    return failure.success;\n  }\n\n  return failure.value;\n};\n\ndeclare const performance: { now(): number };\n\nconst makeStopwatch = () => {\n  if (typeof performance !== 'undefined') {\n    const start = performance.now();\n    return () => performance.now() - start;\n  } else {\n    const start = process.hrtime.bigint();\n    return () => Number(process.hrtime.bigint() - start) / 1000000; // ns->ms\n  }\n};\n\nexport class ExecuteWrapper {\n  private readonly successEmitter = new EventEmitter<ISuccessEvent>();\n  private readonly failureEmitter = new EventEmitter<IFailureEvent>();\n  public readonly onSuccess = this.successEmitter.addListener;\n  public readonly onFailure = this.failureEmitter.addListener;\n\n  constructor(\n    private readonly errorFilter: (error: Error) => boolean = () => false,\n    private readonly resultFilter: (result: unknown) => boolean = () => false,\n  ) {}\n\n  public clone() {\n    return new ExecuteWrapper(this.errorFilter, this.resultFilter);\n  }\n\n  public async invoke<T extends unknown[], R>(\n    fn: (...args: T) => PromiseLike<R> | R,\n    ...args: T\n  ): Promise<FailureOrSuccess<R>> {\n    const stopwatch = this.successEmitter.size || this.failureEmitter.size ? makeStopwatch() : null;\n\n    try {\n      const value = await fn(...args);\n      if (!this.resultFilter(value)) {\n        if (stopwatch) {\n          this.successEmitter.emit({ duration: stopwatch() });\n        }\n        return { success: value };\n      }\n\n      if (stopwatch) {\n        this.failureEmitter.emit({ duration: stopwatch(), handled: true, reason: { value } });\n      }\n\n      return { value };\n    } catch (rawError) {\n      const error = rawError as Error;\n      const handled = this.errorFilter(error as Error);\n      if (stopwatch) {\n        this.failureEmitter.emit({ duration: stopwatch(), handled, reason: { error } });\n      }\n\n      if (!handled) {\n        throw error;\n      }\n\n      return { error };\n    }\n  }\n}\n",
            "circuit-breaker-cockatiel-real/usage.ts": "// Example usage written for Software City (not part of cockatiel).\n// It builds the policy by hand; cockatiel's circuitBreaker() helper does the same wiring for you.\nimport { CircuitBreakerPolicy } from './cockatiel/CircuitBreakerPolicy';\nimport { ConsecutiveBreaker } from './cockatiel/breaker/ConsecutiveBreaker';\nimport { ExecuteWrapper } from './cockatiel/common/Executor';\n\nlet pricingServiceUp = false;\n\nasync function fetchPrices(): Promise<number[]> {\n  if (!pricingServiceUp) {\n    throw new Error('pricing service timed out');\n  }\n  return [9.99, 4.5];\n}\n\nfunction handleEveryError(error: Error): boolean {\n  return true;\n}\n\nconst policy = new CircuitBreakerPolicy(\n  { breaker: new ConsecutiveBreaker(3), halfOpenAfter: 10_000 },\n  new ExecuteWrapper(handleEveryError),\n);\n\nasync function loadPrices(): Promise<string> {\n  try {\n    const prices = await policy.execute(() => fetchPrices());\n    return 'prices: ' + prices.join(', ');\n  } catch (e) {\n    return 'fallback: yesterday\\'s prices (' + (e as Error).message + ')';\n  }\n}\n\nexport async function run(): Promise<void> {\n  for (let i = 0; i < 5; i++) {\n    console.log(await loadPrices(), '| state =', policy.state);\n  }\n  await new Promise((resolve) => setTimeout(resolve, 10_000));\n  pricingServiceUp = true;\n  console.log(await loadPrices(), '| state =', policy.state);\n}\n"
          }
        }
      ]
    },
    {
      "id": "cache-aside",
      "name": "Cache-Aside",
      "family": "Architecture",
      "aka": [
        "Lazy loading cache",
        "Read-through caching (app-managed)",
        "Memoization with expiry"
      ],
      "tagline": "Check the cache first; on a miss, load from the source, store a copy, and expire it later.",
      "intent": "Keep a fast copy of slow-to-fetch data beside your real data source. The application looks in the cache first; on a miss it loads from the database or API and puts the result in the cache with an expiry time. When data changes, the application updates the source and deletes (invalidates) the cached copy so the next read loads fresh data.",
      "analogy": "A sticky note on your monitor with a colleague's phone number: you read the note instead of searching the company directory each time. If the number changes, you tear the note off and look it up again; and you throw old notes away now and then because they go stale.",
      "cityShape": "Look for a service building whose read floor sends a pipe to the cache building first and only then a second pipe to the slow data-source building. The cache building's roof carries the entries antenna, written by set() and cleared by delete() or expiry; the write floor pipes to the data source and then to the cache's delete floor.",
      "roles": [
        {
          "name": "Cache",
          "desc": "A fast key/value store (memory, Redis, Memcached) whose entries expire after a time-to-live (TTL)."
        },
        {
          "name": "Data Source",
          "desc": "The slow system of record: database, remote API or expensive computation. It is always right."
        },
        {
          "name": "Cache-Aside Loader",
          "desc": "Application code that reads the cache, and on a miss loads from the source and stores the result."
        },
        {
          "name": "Invalidation",
          "desc": "The write path: update the source, then delete every cached copy that is now stale."
        },
        {
          "name": "Client",
          "desc": "Code that just asks for data and does not care whether it came from the cache."
        }
      ],
      "whenToUse": [
        "The same data is read far more often than it changes (product pages, user profiles, configuration).",
        "Reads from the source are slow or expensive (remote API, heavy SQL, rate-limited services).",
        "Slightly stale data is acceptable for a short, known time (the TTL).",
        "You want caching without changing the database: the app decides what to cache and for how long."
      ],
      "pitfalls": [
        "Forgetting to invalidate on writes, or forgetting a second key that holds the same data (a list page), leaves users seeing old values until the TTL runs out.",
        "Cache stampede: when a popular entry expires, many requests miss at once and all hit the database. Use locks, early refresh or jittered TTLs.",
        "Caching 'not found' or error results by accident, or caching per-user data under a shared key, which can leak data between users."
      ],
      "related": [
        "proxy",
        "decorator",
        "repository",
        "circuit-breaker",
        "lazy-evaluation",
        "hash-table"
      ],
      "quiz": [
        {
          "q": "A product's price is changed in the database. What should the cache-aside write path do?",
          "options": [
            "Nothing; the cache will notice by itself",
            "Update the database, then delete the cached product (and any lists that contain it)",
            "Delete the database row and keep the cached copy",
            "Clear the entire cache every time anything changes"
          ],
          "answer": 1,
          "why": "The source stays the truth. Deleting the stale keys makes the next read a miss, which reloads the new price. Clearing everything works but throws away useful entries."
        },
        {
          "q": "Why give cache entries a TTL even when you invalidate on every write?",
          "options": [
            "It makes reads faster",
            "As a safety net: if some write path forgets to invalidate, or the source is changed by another system, stale data still disappears eventually",
            "TTL is required by every cache library",
            "So the cache uses more memory"
          ],
          "answer": 1,
          "why": "Invalidation can be missed (other services, manual SQL, bugs). The TTL bounds how long any stale value can survive."
        }
      ],
      "demos": [
        {
          "id": "cache-aside-ts-profiles",
          "title": "User profiles with a TTL cache",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "getProfile() checks a small Map-based cache before asking the slow database, and renameUser() deletes the cached copy after saving. Notice that the database file knows nothing about caching.",
          "roles": {
            "Cache": [
              "cache-aside-ts-profiles/cache.ts#TtlCache"
            ],
            "Data Source": [
              "cache-aside-ts-profiles/userDb.ts#findUser",
              "cache-aside-ts-profiles/userDb.ts#saveUserName"
            ],
            "Cache-Aside Loader": [
              "cache-aside-ts-profiles/profileService.ts#getProfile"
            ],
            "Invalidation": [
              "cache-aside-ts-profiles/profileService.ts#renameUser"
            ],
            "Client": [
              "cache-aside-ts-profiles/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "cache-aside-ts-profiles/main.ts#main",
              "say": "main() asks for user 1 twice, renames her, and asks again."
            },
            {
              "at": "cache-aside-ts-profiles/profileService.ts#getProfile",
              "say": "First the cache is checked with the key 'user:1'. Nothing there yet: a miss."
            },
            {
              "at": "cache-aside-ts-profiles/userDb.ts#findUser",
              "say": "On a miss the service pays for the slow query once..."
            },
            {
              "at": "cache-aside-ts-profiles/cache.ts#TtlCache.set",
              "say": "...and stores the result with an expiry time 60 s from now. The second getProfile() is a hit."
            },
            {
              "at": "cache-aside-ts-profiles/cache.ts#TtlCache.get",
              "say": "get() also checks expiry, so an old entry is removed and treated as a miss."
            },
            {
              "at": "cache-aside-ts-profiles/profileService.ts#renameUser",
              "say": "A write saves to the database first, then deletes 'user:1'. The cache never holds a value the database does not."
            },
            {
              "at": "cache-aside-ts-profiles/cache.ts#TtlCache.delete",
              "say": "The next getProfile() misses and loads the new name. Invalidation is just a delete."
            }
          ],
          "files": {
            "cache-aside-ts-profiles/cache.ts": "// A tiny in-memory cache where every entry expires after ttlMs.\ntype Entry<V> = { value: V; expiresAt: number };\n\nexport class TtlCache<V> {\n  private entries = new Map<string, Entry<V>>();\n\n  constructor(private ttlMs: number) {}\n\n  get(key: string): V | undefined {\n    const entry = this.entries.get(key);\n    if (!entry) {\n      return undefined;\n    }\n    if (Date.now() > entry.expiresAt) {\n      this.entries.delete(key);\n      return undefined;\n    }\n    return entry.value;\n  }\n\n  set(key: string, value: V): void {\n    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });\n  }\n\n  delete(key: string): void {\n    this.entries.delete(key);\n  }\n}\n",
            "cache-aside-ts-profiles/main.ts": "import { getProfile, renameUser } from './profileService';\n\nexport function main(): void {\n  console.log(getProfile(1)?.name); // miss: hits the database\n  console.log(getProfile(1)?.name); // hit: instant\n  renameUser(1, 'Ada Lovelace');\n  console.log(getProfile(1)?.name); // miss again, fresh name loaded\n}\n\nmain();\n",
            "cache-aside-ts-profiles/profileService.ts": "import { TtlCache } from './cache';\nimport { findUser, saveUserName, User } from './userDb';\n\nconst cache = new TtlCache<User>(60_000);\n\n// Cache-aside read: look in the cache first, fall back to the database, then remember.\nexport function getProfile(id: number): User | undefined {\n  const key = `user:${id}`;\n  const cached = cache.get(key);\n  if (cached) {\n    return cached;\n  }\n  const user = findUser(id);\n  if (user) {\n    cache.set(key, user);\n  }\n  return user;\n}\n\n// Write: update the source of truth, then throw away the stale copy.\nexport function renameUser(id: number, name: string): void {\n  saveUserName(id, name);\n  cache.delete(`user:${id}`);\n}\n",
            "cache-aside-ts-profiles/userDb.ts": "// The source of truth. Pretend every call takes 300 ms.\nexport type User = { id: number; name: string };\n\nconst rows: User[] = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }];\n\nexport function findUser(id: number): User | undefined {\n  console.log(`  (slow database query for user ${id})`);\n  return rows.find((u) => u.id === id);\n}\n\nexport function saveUserName(id: number, name: string): void {\n  const user = rows.find((u) => u.id === id);\n  if (user) {\n    user.name = name;\n  }\n}\n"
          }
        },
        {
          "id": "cache-aside-php-catalog",
          "title": "Product catalog with remember() and invalidation",
          "lang": "PHP",
          "level": "intermediate",
          "source": null,
          "story": "A shop caches single products for 10 minutes and category lists for 1 minute. A price change must invalidate both keys; notice the list key, the one people forget.",
          "roles": {
            "Cache": [
              "cache-aside-php-catalog/src/ArrayCache.php#ArrayCache"
            ],
            "Data Source": [
              "cache-aside-php-catalog/src/ProductRepository.php#ProductRepository"
            ],
            "Cache-Aside Loader": [
              "cache-aside-php-catalog/src/ArrayCache.php#ArrayCache.remember",
              "cache-aside-php-catalog/src/CatalogService.php#CatalogService.getProduct"
            ],
            "Invalidation": [
              "cache-aside-php-catalog/src/CatalogService.php#CatalogService.changePrice"
            ],
            "Client": [
              "cache-aside-php-catalog/public/index.php#main",
              "cache-aside-php-catalog/public/index.php#showPrice"
            ]
          },
          "trace": [
            {
              "at": "cache-aside-php-catalog/public/index.php#main",
              "say": "main() builds the service with an in-memory cache and a movable clock, then reads, writes and waits."
            },
            {
              "at": "cache-aside-php-catalog/src/CatalogService.php#CatalogService.getProduct",
              "say": "The service picks the key 'product:7' and a TTL, and hands remember() a closure that knows how to load."
            },
            {
              "at": "cache-aside-php-catalog/src/ArrayCache.php#ArrayCache.remember",
              "say": "remember() is cache-aside in one helper: try get(), on a miss run the loader and set() the result."
            },
            {
              "at": "cache-aside-php-catalog/src/ProductRepository.php#ProductRepository.find",
              "say": "Only on a miss does SQL run. The second showPrice() never reaches this floor."
            },
            {
              "at": "cache-aside-php-catalog/src/CatalogService.php#CatalogService.changePrice",
              "say": "The price changes in the database, then both 'product:7' and 'category:kitchen' are deleted, because both contain the old price."
            },
            {
              "at": "cache-aside-php-catalog/src/ArrayCache.php#ArrayCache.get",
              "say": "After the clock moves 601 s, get() sees the entry has expired, drops it and returns null, so the product reloads."
            }
          ],
          "files": {
            "cache-aside-php-catalog/public/index.php": "<?php\nrequire_once __DIR__ . '/../src/CatalogService.php';\n\nfunction showPrice(CatalogService $catalog, int $id): void\n{\n    $product = $catalog->getProduct($id);\n    echo \"{$product['name']} costs {$product['price']} EUR\\n\";\n}\n\nfunction main(): void\n{\n    $clock = new Clock(time());\n    $catalog = new CatalogService(new ArrayCache($clock), new ProductRepository());\n\n    showPrice($catalog, 7);             // miss: loaded from SQL\n    showPrice($catalog, 7);             // hit\n    $catalog->listCategory('kitchen');  // miss: list cached for 60 s\n\n    $catalog->changePrice(7, 9.9);      // invalidates product:7 and category:kitchen\n    showPrice($catalog, 7);             // miss: fresh price\n    $catalog->listCategory('kitchen');  // miss: fresh list\n\n    $clock->advance(601);\n    showPrice($catalog, 7);             // miss again: the entry expired\n}\n\nmain();\n",
            "cache-aside-php-catalog/src/ArrayCache.php": "<?php\nrequire_once __DIR__ . '/Clock.php';\n\n// Stands in for Redis or Memcached: key/value pairs with a time-to-live.\nclass ArrayCache\n{\n    private array $items = [];\n    private Clock $clock;\n\n    public function __construct(Clock $clock)\n    {\n        $this->clock = $clock;\n    }\n\n    public function get(string $key): mixed\n    {\n        if (!isset($this->items[$key])) {\n            return null;\n        }\n        [$value, $expiresAt] = $this->items[$key];\n        if ($this->clock->now() >= $expiresAt) {\n            unset($this->items[$key]);\n            return null;\n        }\n        return $value;\n    }\n\n    public function set(string $key, mixed $value, int $ttlSeconds): void\n    {\n        $this->items[$key] = [$value, $this->clock->now() + $ttlSeconds];\n    }\n\n    public function delete(string $key): void\n    {\n        unset($this->items[$key]);\n    }\n\n    // The cache-aside read in one helper: return the cached value or compute, store and return it.\n    public function remember(string $key, int $ttlSeconds, callable $load): mixed\n    {\n        $value = $this->get($key);\n        if ($value !== null) {\n            echo \"  cache hit  {$key}\\n\";\n            return $value;\n        }\n        echo \"  cache miss {$key}\\n\";\n        $value = $load();\n        if ($value !== null) {\n            $this->set($key, $value, $ttlSeconds);\n        }\n        return $value;\n    }\n}\n",
            "cache-aside-php-catalog/src/CatalogService.php": "<?php\nrequire_once __DIR__ . '/ArrayCache.php';\nrequire_once __DIR__ . '/ProductRepository.php';\n\n// Application logic owns the caching decisions: keys, TTLs and what to invalidate.\nclass CatalogService\n{\n    private const PRODUCT_TTL = 600;\n    private const LIST_TTL = 60;\n\n    private ArrayCache $cache;\n    private ProductRepository $repository;\n\n    public function __construct(ArrayCache $cache, ProductRepository $repository)\n    {\n        $this->cache = $cache;\n        $this->repository = $repository;\n    }\n\n    public function getProduct(int $id): ?array\n    {\n        return $this->cache->remember(\"product:{$id}\", self::PRODUCT_TTL, fn() => $this->repository->find($id));\n    }\n\n    public function listCategory(string $category): array\n    {\n        return $this->cache->remember(\"category:{$category}\", self::LIST_TTL, fn() => $this->repository->findByCategory($category));\n    }\n\n    // Write path: database first, then delete every cached copy that contains this product.\n    public function changePrice(int $id, float $price): void\n    {\n        $product = $this->repository->find($id);\n        $this->repository->updatePrice($id, $price);\n        $this->cache->delete(\"product:{$id}\");\n        $this->cache->delete(\"category:{$product['category']}\");\n    }\n}\n",
            "cache-aside-php-catalog/src/Clock.php": "<?php\n// A clock we can move forward in the demo, so expiry is easy to see.\nclass Clock\n{\n    private int $now;\n\n    public function __construct(int $start)\n    {\n        $this->now = $start;\n    }\n\n    public function now(): int\n    {\n        return $this->now;\n    }\n\n    public function advance(int $seconds): void\n    {\n        $this->now += $seconds;\n    }\n}\n",
            "cache-aside-php-catalog/src/ProductRepository.php": "<?php\n// The system of record. In real life: SQL queries that take tens of milliseconds.\nclass ProductRepository\n{\n    private array $products = [\n        7 => ['id' => 7, 'name' => 'Espresso cup', 'price' => 12.0, 'category' => 'kitchen'],\n        8 => ['id' => 8, 'name' => 'Milk jug', 'price' => 18.5, 'category' => 'kitchen'],\n    ];\n\n    public function find(int $id): ?array\n    {\n        echo \"  SQL: SELECT * FROM products WHERE id = {$id}\\n\";\n        return $this->products[$id] ?? null;\n    }\n\n    public function findByCategory(string $category): array\n    {\n        echo \"  SQL: SELECT * FROM products WHERE category = '{$category}'\\n\";\n        return array_values(array_filter($this->products, fn($p) => $p['category'] === $category));\n    }\n\n    public function updatePrice(int $id, float $price): void\n    {\n        $this->products[$id]['price'] = $price;\n    }\n}\n"
          }
        },
        {
          "id": "cache-aside-cachetools-real",
          "title": "cachetools: @cached with a TTLCache",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "tkem/cachetools",
            "url": "https://github.com/tkem/cachetools/blob/v7.2.1/src/cachetools/__init__.py",
            "license": "MIT",
            "note": "Files under cachetools/ are verbatim from cachetools 7.2.1 (__init__.py, _cached.py, keys.py) with other cache classes, pickling, statistics and helper variants trimmed (marked). forecast.py was written for Software City."
          },
          "story": "A widely used Python caching library. The @cached decorator is the cache-aside loader, TTLCache is the expiring cache, and you invalidate by deleting a key. Notice how a miss is just a KeyError.",
          "roles": {
            "Cache": [
              "cache-aside-cachetools-real/cachetools/__init__.py#TTLCache",
              "cache-aside-cachetools-real/cachetools/__init__.py#Cache"
            ],
            "Data Source": [
              "cache-aside-cachetools-real/forecast.py#get_forecast"
            ],
            "Cache-Aside Loader": [
              "cache-aside-cachetools-real/cachetools/__init__.py#cached",
              "cache-aside-cachetools-real/cachetools/_cached.py#_unlocked"
            ],
            "Invalidation": [
              "cache-aside-cachetools-real/forecast.py#invalidate",
              "cache-aside-cachetools-real/cachetools/__init__.py#TTLCache.expire"
            ],
            "Client": [
              "cache-aside-cachetools-real/forecast.py#main"
            ]
          },
          "trace": [
            {
              "at": "cache-aside-cachetools-real/cachetools/__init__.py#cached",
              "say": "At import time @cached(forecast_cache) wraps get_forecast. The function body itself stays a plain slow API call."
            },
            {
              "at": "cache-aside-cachetools-real/cachetools/_cached.py#_wrapper",
              "say": "_wrapper picks a variant: no lock and no statistics requested, so the simple _unlocked version is used."
            },
            {
              "at": "cache-aside-cachetools-real/cachetools/_cached.py#_unlocked",
              "say": "Its inner wrapper is cache-aside: build a key, try cache[k], on KeyError call the real function and store v."
            },
            {
              "at": "cache-aside-cachetools-real/cachetools/keys.py#hashkey",
              "say": "The key is a hashable tuple of the arguments, so ('Augsburg',) always maps to the same entry."
            },
            {
              "at": "cache-aside-cachetools-real/cachetools/__init__.py#TTLCache.__getitem__",
              "say": "Reading checks the entry's link: missing or past its expiry means __missing__ raises KeyError, i.e. a miss."
            },
            {
              "at": "cache-aside-cachetools-real/forecast.py#get_forecast",
              "say": "Only on a miss does the slow weather API run."
            },
            {
              "at": "cache-aside-cachetools-real/cachetools/__init__.py#TTLCache.__setitem__",
              "say": "Storing first expires old entries, then stamps this one with now + ttl and appends it to a time-ordered linked list."
            },
            {
              "at": "cache-aside-cachetools-real/forecast.py#invalidate",
              "say": "Invalidation is just del cache[key]. The next get_forecast('Augsburg') misses and fetches fresh data."
            }
          ],
          "files": {
            "cache-aside-cachetools-real/cachetools/__init__.py": "# Source: cachetools 7.2.1 — https://github.com/tkem/cachetools/blob/v7.2.1/src/cachetools/__init__.py\n# MIT License, Copyright (c) 2014-2026 Thomas Kemmer. Included for study.\n\"\"\"Extensible memoizing collections and decorators.\"\"\"\n\n# … trimmed: 11 lines, the __all__ export list …\n\n__version__ = \"7.2.1\"\n\nimport collections\nimport collections.abc\nimport functools\nimport heapq\nimport random\nimport time\n\nfrom . import keys\n\n\n# … trimmed: 17 lines, _DefaultSize helper (a fake dict that reports size 1 for every value) …\n\n\nclass Cache(collections.abc.MutableMapping):\n    \"\"\"Mutable mapping to serve as a simple cache or cache base class.\"\"\"\n\n    __marker = object()\n\n    __size = _DefaultSize()\n\n    def __init__(self, maxsize, getsizeof=None):\n        if maxsize < 0:\n            raise ValueError(\"maxsize must be non-negative\")\n        if getsizeof is not None:\n            self.getsizeof = getsizeof\n        if self.getsizeof is not Cache.getsizeof:\n            self.__size = {}\n        self.__data = {}\n        self.__currsize = 0\n        self.__maxsize = maxsize\n\n    # … trimmed: 7 lines, __repr__ …\n\n    def __getitem__(self, key):\n        try:\n            return self.__data[key]\n        except KeyError:\n            return self.__missing__(key)\n\n    def __setitem__(self, key, value):\n        maxsize = self.__maxsize\n        size = self.getsizeof(value)\n        if size < 0:\n            raise ValueError(\"value size must be non-negative\")\n        if size > maxsize:\n            raise ValueError(\"value too large\")\n        if key not in self.__data:\n            diffsize = size\n            while self.__currsize + diffsize > maxsize:\n                self.popitem()\n        else:\n            diffsize = size - self.__size[key]\n            while self.__currsize + diffsize > maxsize:\n                self.popitem()\n                if key not in self.__data:\n                    diffsize = size\n        self.__data[key] = value\n        self.__size[key] = size\n        self.__currsize += diffsize\n\n    def __delitem__(self, key):\n        size = self.__size.pop(key)\n        del self.__data[key]\n        self.__currsize -= size\n\n    def __contains__(self, key):\n        return key in self.__data\n\n    def __missing__(self, key):\n        raise KeyError(key)\n\n    # … trimmed: 46 lines, __iter__, __len__, get(), pop(), setdefault(), clear() and the maxsize/currsize properties …\n\n    @staticmethod\n    def getsizeof(value):\n        \"\"\"Return the size of a cache element's value.\"\"\"\n        return 1\n\n\n# … trimmed: 200 lines, FIFOCache, LFUCache, LRUCache and RRCache (other eviction strategies) …\n\n\nclass _TimedCache(Cache):\n    \"\"\"Base class for time aware cache implementations.\"\"\"\n\n    class _Timer:\n        # … trimmed: 28 lines, _Timer wraps the timer so one operation sees a single frozen 'now' …\n\n    def __init__(self, maxsize, timer, getsizeof=None):\n        Cache.__init__(self, maxsize, getsizeof)\n        self.__timer = _TimedCache._Timer(timer)\n\n    # … trimmed: 16 lines, __repr__, __len__ and currsize that expire items first …\n\n    @property\n    def timer(self):\n        \"\"\"The timer function used by the cache.\"\"\"\n        return self.__timer\n\n    # … trimmed: 12 lines, get(), pop() and setdefault() run under the frozen timer …\n\n    def clear(self):\n        # Subclasses must override to also reset their own time-tracking\n        # structures; we do not call expire() here since clear() should\n        # be O(1) regardless of cache contents.\n        Cache.clear(self)\n\n    def expire(self, time=None):  # pragma: no cover\n        raise NotImplementedError\n\n\nclass TTLCache(_TimedCache):\n    \"\"\"LRU Cache implementation with per-item time-to-live (TTL) value.\"\"\"\n\n    class _Link:\n        __slots__ = (\"expires\", \"key\", \"next\", \"prev\")\n\n        def __init__(self, key=None, expires=None):\n            self.key = key\n            self.expires = expires\n\n        # … trimmed: 3 lines, __reduce__ for pickling …\n\n        def unlink(self):\n            next = self.next\n            prev = self.prev\n            prev.next = next\n            next.prev = prev\n\n    def __init__(self, maxsize, ttl, timer=time.monotonic, getsizeof=None):\n        _TimedCache.__init__(self, maxsize, timer, getsizeof)\n        self.__root = root = TTLCache._Link()\n        root.prev = root.next = root\n        self.__links = collections.OrderedDict()\n        self.__ttl = ttl\n\n    def __contains__(self, key):\n        try:\n            link = self.__links[key]  # no reordering\n        except KeyError:\n            return False\n        else:\n            return self.timer() < link.expires\n\n    def __getitem__(self, key, cache_getitem=Cache.__getitem__):\n        try:\n            link = self.__getlink(key)\n        except KeyError:\n            expired = False\n        else:\n            expired = not (self.timer() < link.expires)\n        if expired:\n            return self.__missing__(key)\n        else:\n            return cache_getitem(self, key)\n\n    def __setitem__(self, key, value, cache_setitem=Cache.__setitem__):\n        with self.timer as time:\n            self.expire(time)\n            cache_setitem(self, key, value)\n        try:\n            link = self.__getlink(key)\n        except KeyError:\n            self.__links[key] = link = TTLCache._Link(key)\n        else:\n            link.unlink()\n        link.expires = time + self.__ttl\n        link.next = root = self.__root\n        link.prev = prev = root.prev\n        prev.next = root.prev = link\n\n    def __delitem__(self, key, cache_delitem=Cache.__delitem__):\n        cache_delitem(self, key)\n        link = self.__links.pop(key)\n        link.unlink()\n        if not (self.timer() < link.expires):\n            raise KeyError(key)\n\n    # … trimmed: 25 lines, __iter__, __setstate__ (pickling) and the ttl property …\n\n    def expire(self, time=None):\n        \"\"\"Remove expired items from the cache and return an iterable of the\n        expired `(key, value)` pairs.\n\n        \"\"\"\n        if time is None:\n            time = self.timer()\n        root = self.__root\n        curr = root.next\n        links = self.__links\n        expired = []\n        cache_delitem = Cache.__delitem__\n        cache_getitem = Cache.__getitem__\n        while curr is not root and not (time < curr.expires):\n            expired.append((curr.key, cache_getitem(self, curr.key)))\n            cache_delitem(self, curr.key)\n            del links[curr.key]\n            next = curr.next\n            curr.unlink()\n            curr = next\n        return expired\n\n    # … trimmed: 20 lines, popitem() (evicts the least recently used entry when full) and clear() …\n\n    def __getlink(self, key):\n        value = self.__links[key]\n        self.__links.move_to_end(key)\n        return value\n\n\n# … trimmed: 137 lines, TLRUCache (per-item time-to-use) and the _CacheInfo named tuple …\n\n\ndef cached(cache, key=keys.hashkey, lock=None, condition=None, info=False):\n    \"\"\"Decorator to wrap a function with a memoizing callable that saves\n    results in a cache.\n\n    \"\"\"\n    from ._cached import _wrapper\n\n    def decorator(func):\n        if info:\n            # … trimmed: 15 lines building make_info() for hit/miss statistics …\n            return _wrapper(func, cache, key, lock, condition, info=make_info)\n        else:\n            return _wrapper(func, cache, key, lock, condition)\n\n    return decorator\n\n# … trimmed: 25 lines, cachedmethod(), the same decorator for methods …\n",
            "cache-aside-cachetools-real/cachetools/_cached.py": "# Source: cachetools 7.2.1 — https://github.com/tkem/cachetools/blob/v7.2.1/src/cachetools/_cached.py\n# MIT License, Copyright (c) 2014-2026 Thomas Kemmer. Included for study.\n\"\"\"Function decorator helpers.\"\"\"\n\n# pyright: reportFunctionMemberAccess=false\n\n__all__ = ()\n\nimport functools\nimport warnings\n\n# At least for now, the implementation prefers clarity and performance\n# over ease of maintenance, thus providing separate wrappers for\n# all valid combinations of decorator parameters lock, condition and\n# info.\n\n\n# … trimmed: 130 lines, the *_info and _condition variants (same idea plus hit/miss counters or a condition variable) …\n\n\ndef _locked(func, cache, key, lock):\n    def wrapper(*args, **kwargs):\n        k = key(*args, **kwargs)\n        with lock:\n            try:\n                return cache[k]\n            except KeyError:\n                pass  # key not found\n        v = func(*args, **kwargs)\n        with lock:\n            try:\n                # In case of a race condition, i.e. if another thread\n                # stored a value for this key while we were calling\n                # func(), prefer the cached value.\n                return cache.setdefault(k, v)\n            except ValueError:\n                return v  # value too large\n\n    def cache_clear():\n        with lock:\n            cache.clear()\n\n    wrapper.cache_clear = cache_clear\n    return wrapper\n\n\ndef _unlocked(func, cache, key):\n    def wrapper(*args, **kwargs):\n        k = key(*args, **kwargs)\n        try:\n            return cache[k]\n        except KeyError:\n            pass  # key not found\n        v = func(*args, **kwargs)\n        try:\n            cache[k] = v\n        except ValueError:\n            pass  # value too large\n        return v\n\n    wrapper.cache_clear = lambda: cache.clear()\n    return wrapper\n\n\n# … trimmed: 7 lines, _uncached() for the deprecated cache=None case …\n\n\ndef _wrapper(func, cache, key, lock=None, cond=None, info=None):\n    if cache is None:\n        warnings.warn(\n            \"@cachetools.cached(cache=None) is deprecated\",\n            DeprecationWarning,\n            stacklevel=3,\n        )\n\n    if info is not None:\n        if cache is None:\n            wrapper = _uncached_info(func, info)\n        elif cond is not None and lock is not None:\n            wrapper = _condition_info(func, cache, key, lock, cond, info)\n        elif cond is not None:\n            wrapper = _condition_info(func, cache, key, cond, cond, info)\n        elif lock is not None:\n            wrapper = _locked_info(func, cache, key, lock, info)\n        else:\n            wrapper = _unlocked_info(func, cache, key, info)\n    else:\n        if cache is None:\n            wrapper = _uncached(func)\n        elif cond is not None and lock is not None:\n            wrapper = _condition(func, cache, key, lock, cond)\n        elif cond is not None:\n            wrapper = _condition(func, cache, key, cond, cond)\n        elif lock is not None:\n            wrapper = _locked(func, cache, key, lock)\n        else:\n            wrapper = _unlocked(func, cache, key)\n        wrapper.cache_info = None\n\n    wrapper.cache = cache\n    wrapper.cache_key = key\n    wrapper.cache_lock = lock if lock is not None else cond\n    wrapper.cache_condition = cond\n\n    return functools.update_wrapper(wrapper, func)\n",
            "cache-aside-cachetools-real/cachetools/keys.py": "# Source: cachetools 7.2.1 — https://github.com/tkem/cachetools/blob/v7.2.1/src/cachetools/keys.py\n# MIT License, Copyright (c) 2014-2026 Thomas Kemmer. Included for study.\n\"\"\"Key functions for memoizing decorators.\"\"\"\n\n__all__ = (\"hashkey\", \"methodkey\", \"typedkey\", \"typedmethodkey\")\n\n\nclass _HashedTuple(tuple):\n    \"\"\"A tuple that ensures that hash() will be called no more than once\n    per element, since cache decorators will hash the key multiple\n    times on a cache miss.  See also _HashedSeq in the standard\n    library functools implementation.\n\n    \"\"\"\n\n    __hashvalue = None  # default value, set in instance on first use\n\n    def __hash__(self, hash=tuple.__hash__):\n        hashvalue = self.__hashvalue\n        if hashvalue is None:\n            self.__hashvalue = hashvalue = hash(self)\n        return hashvalue\n\n    def __add__(self, other, add=tuple.__add__):\n        return _HashedTuple(add(self, other))\n\n    def __radd__(self, other, add=tuple.__add__):\n        return _HashedTuple(add(other, self))\n\n    def __getstate__(self):\n        return {}\n\n\n# A sentinel for separating args from kwargs.  Using the class itself\n# ensures uniqueness and preserves identity when pickling/unpickling.\n_kwmark = (_HashedTuple,)\n\n\ndef hashkey(*args, **kwargs):\n    \"\"\"Return a cache key for the specified hashable arguments.\"\"\"\n\n    if kwargs:\n        return _HashedTuple(args + _kwmark + tuple(sorted(kwargs.items())))\n    else:\n        return _HashedTuple(args)\n\n\n# … trimmed: methodkey(), typedkey() and typedmethodkey(), variations of hashkey() …\n",
            "cache-aside-cachetools-real/forecast.py": "# Example usage written for Software City (not part of cachetools).\nimport time\nfrom .cachetools import TTLCache, cached\nfrom .cachetools.keys import hashkey\n\n# Entries live for 10 minutes; at most 100 cities are kept.\nforecast_cache = TTLCache(maxsize=100, ttl=600)\n\n\n@cached(forecast_cache)\ndef get_forecast(city):\n    print(f\"  calling the slow weather API for {city}\")\n    time.sleep(0.5)\n    return {\"city\": city, \"temp\": 21}\n\n\ndef invalidate(city):\n    \"\"\"A correction arrived upstream: drop our copy so the next read reloads it.\"\"\"\n    try:\n        del forecast_cache[hashkey(city)]\n    except KeyError:\n        pass\n\n\ndef main():\n    print(get_forecast(\"Augsburg\"))  # miss: slow call, result stored\n    print(get_forecast(\"Augsburg\"))  # hit: instant\n    invalidate(\"Augsburg\")\n    print(get_forecast(\"Augsburg\"))  # miss again: fresh data\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        }
      ]
    },
    {
      "id": "ecs",
      "name": "Entity–Component–System",
      "family": "Architecture",
      "aka": [
        "ECS",
        "Data-oriented design",
        "Component-based entities"
      ],
      "tagline": "Entities are just ids, components are plain data, and systems hold all the behaviour.",
      "intent": "Instead of deep class hierarchies (Enemy extends Character extends GameObject), an entity is only an id with a set of data components attached. Systems loop over every entity that has the components they need and update that data, so you build new kinds of objects by mixing components, not by subclassing.",
      "analogy": "A school's records office: a student is only an ID number. The library keeps a table of borrowed books, the canteen a table of meal plans, the sports office a table of teams. Each office (system) works through its own table, and a student is whatever rows exist for their ID.",
      "cityShape": "Look for a row of systems, often run() floors at the same height, that never call each other. Instead every system reaches into one World building (import arcs and call pipes into its query/get floors). Component buildings are short: data only, no floors.",
      "roles": [
        {
          "name": "Entity",
          "desc": "A unique id (often just an integer). It has no data or behaviour of its own."
        },
        {
          "name": "Component",
          "desc": "A small plain-data struct (Position, Health, Poisoned) attached to an entity."
        },
        {
          "name": "System",
          "desc": "A function that queries all entities with a given set of components and updates them. All behaviour lives here."
        },
        {
          "name": "World",
          "desc": "Stores entities and their components, answers queries, and runs systems in order."
        }
      ],
      "whenToUse": [
        "Games and simulations with many objects that share traits in changing combinations (things that burn, float, can be picked up).",
        "Inheritance trees keep breaking because a new object needs behaviour from two branches.",
        "You process thousands of similar objects per frame and want cache-friendly, parallel loops.",
        "Designers should be able to make new object types by combining components, without new code."
      ],
      "pitfalls": [
        "Overkill for small apps or UI-heavy code: a handful of objects is clearer as normal classes.",
        "System order matters (damage before death check) and becomes a hidden dependency if not stated explicitly.",
        "Logic spread across many systems can make 'what happens to a goblin?' harder to read in one place."
      ],
      "related": [
        "composition",
        "game-loop",
        "flyweight",
        "object-pool",
        "strategy"
      ],
      "quiz": [
        {
          "q": "In ECS, how do you make a burning, flying crate?",
          "options": [
            "Write class FlyingBurningCrate extends Crate",
            "Spawn an entity with Crate, Flying and Burning components; the existing systems handle the rest",
            "Add fly() and burn() methods to the Crate component",
            "Ask the World to subclass the entity at runtime"
          ],
          "answer": 1,
          "why": "Behaviour comes from systems that match components. Attaching the right data is enough, so combinations need no new classes."
        },
        {
          "q": "A rock has Position but no Velocity. What does the movement system do with it?",
          "options": [
            "Crashes because velocity is missing",
            "Moves it with a default speed",
            "Skips it, because its query only matches entities that have both Position and Velocity",
            "Removes the rock from the world"
          ],
          "answer": 2,
          "why": "Systems query by component set. Entities without the needed components are simply not part of that system's loop."
        }
      ],
      "demos": [
        {
          "id": "ecs-ts-pond",
          "title": "Ducks and rocks on a pond",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Two entities, a duck and a rock, built from the same components. The duck moves because it has a Velocity; the rock does not. Notice that components.ts has no functions at all.",
          "roles": {
            "Entity": [
              "ecs-ts-pond/world.ts#World.createEntity"
            ],
            "Component": [
              "ecs-ts-pond/components.ts#Position",
              "ecs-ts-pond/components.ts#Velocity",
              "ecs-ts-pond/components.ts#Label"
            ],
            "System": [
              "ecs-ts-pond/systems.ts#movementSystem",
              "ecs-ts-pond/systems.ts#renderSystem"
            ],
            "World": [
              "ecs-ts-pond/world.ts#World"
            ]
          },
          "trace": [
            {
              "at": "ecs-ts-pond/main.ts#main",
              "say": "main() makes a world, then builds a duck and a rock purely by attaching component data to ids."
            },
            {
              "at": "ecs-ts-pond/world.ts#World.createEntity",
              "say": "createEntity() only hands out the next number. An entity has no fields, no methods, no class."
            },
            {
              "at": "ecs-ts-pond/systems.ts#movementSystem",
              "say": "movementSystem loops over everything with a Velocity and nudges its Position. The rock has none, so it is skipped."
            },
            {
              "at": "ecs-ts-pond/systems.ts#renderSystem",
              "say": "renderSystem loops over everything with a Label and prints where it is. Both duck and rock qualify."
            },
            {
              "at": "ecs-ts-pond/main.ts#main",
              "say": "Each tick runs the systems in order. Give the rock a Velocity and it would start drifting, with no new code."
            }
          ],
          "files": {
            "ecs-ts-pond/components.ts": "// Components are plain data. No methods, no behaviour.\nexport interface Position {\n  x: number;\n  y: number;\n}\n\nexport interface Velocity {\n  dx: number;\n  dy: number;\n}\n\nexport interface Label {\n  text: string;\n}\n",
            "ecs-ts-pond/main.ts": "import { World } from './world';\nimport { movementSystem, renderSystem } from './systems';\n\nfunction main(): void {\n  const world = new World();\n\n  // A duck: it has a position, a velocity and a label, so it moves AND is drawn.\n  const duck = world.createEntity();\n  world.positions.set(duck, { x: 0, y: 0 });\n  world.velocities.set(duck, { dx: 1, dy: 0 });\n  world.labels.set(duck, { text: 'Duck' });\n\n  // A rock: no velocity, so movementSystem simply skips it.\n  const rock = world.createEntity();\n  world.positions.set(rock, { x: 5, y: 2 });\n  world.labels.set(rock, { text: 'Rock' });\n\n  for (let tick = 0; tick < 3; tick++) {\n    movementSystem(world);\n    renderSystem(world);\n  }\n}\n\nmain();\n",
            "ecs-ts-pond/systems.ts": "import { World } from './world';\n\n// A System is a function that runs over every entity that has the components it needs.\nexport function movementSystem(world: World): void {\n  for (const [id, vel] of world.velocities) {\n    const pos = world.positions.get(id);\n    if (pos) {\n      pos.x += vel.dx;\n      pos.y += vel.dy;\n    }\n  }\n}\n\nexport function renderSystem(world: World): void {\n  for (const [id, label] of world.labels) {\n    const pos = world.positions.get(id);\n    if (pos) {\n      console.log(`${label.text} is at (${pos.x}, ${pos.y})`);\n    }\n  }\n}\n",
            "ecs-ts-pond/world.ts": "import { Position, Velocity, Label } from './components';\n\n// An Entity is just a number. The World keeps one table per component type, keyed by entity id.\nexport type Entity = number;\n\nexport class World {\n  private nextId = 1;\n  positions: Map<Entity, Position> = new Map();\n  velocities: Map<Entity, Velocity> = new Map();\n  labels: Map<Entity, Label> = new Map();\n\n  createEntity(): Entity {\n    const id = this.nextId;\n    this.nextId += 1;\n    return id;\n  }\n}\n"
          }
        },
        {
          "id": "ecs-kt-dungeon",
          "title": "Poison and regeneration in a dungeon",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "A turn-based dungeon: knights, goblins and a troll are mixes of Health, Poisoned and Regeneration. Four systems run in a fixed order each turn. The troll gets both poison and regeneration for free.",
          "roles": {
            "Entity": [
              "ecs-kt-dungeon/World.kt#World.spawn",
              "ecs-kt-dungeon/World.kt#World.despawn"
            ],
            "Component": [
              "ecs-kt-dungeon/Components.kt#Name",
              "ecs-kt-dungeon/Components.kt#Health",
              "ecs-kt-dungeon/Components.kt#Poisoned",
              "ecs-kt-dungeon/Components.kt#Regeneration"
            ],
            "System": [
              "ecs-kt-dungeon/Systems.kt#GameSystem",
              "ecs-kt-dungeon/Systems.kt#PoisonSystem",
              "ecs-kt-dungeon/Systems.kt#RegenerationSystem",
              "ecs-kt-dungeon/Systems.kt#DeathSystem",
              "ecs-kt-dungeon/Systems.kt#StatusSystem"
            ],
            "World": [
              "ecs-kt-dungeon/World.kt#World"
            ]
          },
          "trace": [
            {
              "at": "ecs-kt-dungeon/Main.kt#main",
              "say": "main() spawns four entities with different component mixes, including a torch that only has a Name."
            },
            {
              "at": "ecs-kt-dungeon/World.kt#World.spawn",
              "say": "spawn() takes a fresh id and files each component in the store for its type, keyed by that id."
            },
            {
              "at": "ecs-kt-dungeon/Main.kt#runTurn",
              "say": "Each turn runs the systems in a fixed order. The order is a design decision: damage before the death check."
            },
            {
              "at": "ecs-kt-dungeon/Systems.kt#PoisonSystem.run",
              "say": "PoisonSystem asks for entities with Health AND Poisoned, deals damage, and removes the component when it runs out."
            },
            {
              "at": "ecs-kt-dungeon/World.kt#World.query",
              "say": "query() filters living ids to those present in every requested store. This is how systems pick their entities."
            },
            {
              "at": "ecs-kt-dungeon/Systems.kt#RegenerationSystem.run",
              "say": "Regeneration heals anything with that component. The troll has both, so both systems touch it without knowing of each other."
            },
            {
              "at": "ecs-kt-dungeon/Systems.kt#DeathSystem.run",
              "say": "DeathSystem despawns anything at 0 HP. The goblin falls; the torch was never in this query at all."
            },
            {
              "at": "ecs-kt-dungeon/World.kt#World.despawn",
              "say": "despawn() removes the id from every store, so no system will see that entity again."
            }
          ],
          "files": {
            "ecs-kt-dungeon/Components.kt": "// Components: data classes only. Behaviour lives in systems, never in here.\ndata class Name(val value: String) {\n    // What to call this entity in the log.\n}\n\ndata class Health(var hp: Int, val max: Int) {\n    // Anything with Health can be hurt, healed and killed.\n}\n\ndata class Poisoned(var turnsLeft: Int, val damage: Int) {\n    // A temporary status: PoisonSystem removes it when turnsLeft reaches 0.\n}\n\ndata class Regeneration(val perTurn: Int) {\n    // Heals a little every turn. Mix it with Poisoned and both systems apply.\n}\n",
            "ecs-kt-dungeon/Main.kt": "// The game is just a world plus an ordered list of systems, run once per turn.\nfun main() {\n    val world = World()\n    world.spawn(Name(\"Knight\"), Health(30, 30), Regeneration(2))\n    world.spawn(Name(\"Goblin\"), Health(8, 8), Poisoned(turnsLeft = 3, damage = 3))\n    world.spawn(Name(\"Troll\"), Health(40, 40), Poisoned(turnsLeft = 2, damage = 5), Regeneration(4))\n    // A torch has a name but no health: health systems never even see it.\n    world.spawn(Name(\"Torch\"))\n\n    val systems: List<GameSystem> = listOf(PoisonSystem(), RegenerationSystem(), DeathSystem(), StatusSystem())\n    for (turn in 1..3) {\n        println(\"-- turn $turn --\")\n        runTurn(world, systems)\n    }\n}\n\nfun runTurn(world: World, systems: List<GameSystem>) {\n    for (system in systems) {\n        system.run(world)\n    }\n}\n",
            "ecs-kt-dungeon/Systems.kt": "// Every system has the same shape: look up entities by components, then update data.\ninterface GameSystem {\n    fun run(world: World)\n}\n\nclass PoisonSystem : GameSystem {\n    override fun run(world: World) {\n        for (id in world.query(Health::class, Poisoned::class)) {\n            val health = world.get(id, Health::class)!!\n            val poison = world.get(id, Poisoned::class)!!\n            health.hp -= poison.damage\n            poison.turnsLeft -= 1\n            if (poison.turnsLeft == 0) {\n                world.remove(id, Poisoned::class)\n            }\n        }\n    }\n}\n\nclass RegenerationSystem : GameSystem {\n    override fun run(world: World) {\n        for (id in world.query(Health::class, Regeneration::class)) {\n            val health = world.get(id, Health::class)!!\n            val regen = world.get(id, Regeneration::class)!!\n            health.hp = minOf(health.max, health.hp + regen.perTurn)\n        }\n    }\n}\n\nclass DeathSystem : GameSystem {\n    override fun run(world: World) {\n        for (id in world.query(Health::class)) {\n            if (world.get(id, Health::class)!!.hp <= 0) {\n                val name = world.get(id, Name::class)?.value ?: \"something\"\n                println(\"$name has fallen.\")\n                world.despawn(id)\n            }\n        }\n    }\n}\n\nclass StatusSystem : GameSystem {\n    override fun run(world: World) {\n        for (id in world.query(Name::class, Health::class)) {\n            val name = world.get(id, Name::class)!!\n            val health = world.get(id, Health::class)!!\n            println(\"${name.value}: ${health.hp}/${health.max} HP\")\n        }\n    }\n}\n",
            "ecs-kt-dungeon/World.kt": "import kotlin.reflect.KClass\n\n// The World stores components in one map per component type. Entities are plain Ints.\nclass World {\n    private var nextId = 0\n    private val stores = mutableMapOf<KClass<*>, MutableMap<Int, Any>>()\n    val alive = mutableSetOf<Int>()\n\n    fun spawn(vararg components: Any): Int {\n        val id = nextId++\n        alive.add(id)\n        for (c in components) {\n            add(id, c)\n        }\n        return id\n    }\n\n    fun add(entity: Int, component: Any) {\n        stores.getOrPut(component::class) { mutableMapOf() }[entity] = component\n    }\n\n    fun remove(entity: Int, type: KClass<*>) {\n        stores[type]?.remove(entity)\n    }\n\n    fun <T : Any> get(entity: Int, type: KClass<T>): T? {\n        @Suppress(\"UNCHECKED_CAST\")\n        return stores[type]?.get(entity) as T?\n    }\n\n    // A query: every entity that has ALL of the given component types.\n    fun query(vararg types: KClass<*>): List<Int> {\n        return alive.filter { id -> types.all { t -> stores[t]?.containsKey(id) == true } }\n    }\n\n    fun despawn(entity: Int) {\n        alive.remove(entity)\n        for (store in stores.values) {\n            store.remove(entity)\n        }\n    }\n}\n"
          }
        },
        {
          "id": "ecs-bevy-real",
          "title": "Bevy's ECS guide",
          "lang": "Rust",
          "level": "advanced",
          "source": {
            "repo": "bevyengine/bevy",
            "url": "https://github.com/bevyengine/bevy/blob/v0.19.1/examples/ecs/ecs_guide.rs",
            "license": "MIT OR Apache-2.0",
            "note": "Verbatim from Bevy 0.19.1 examples/ecs/ecs_guide.rs, split by Software City into main.rs (lines 1-33, 283-366), components.rs (35-86) and systems.rs (88-281). Only the marked mod/use lines were added to join the files."
          },
          "story": "The official guided tour of Bevy's ECS: a tiny scoring game. Systems are ordinary Rust functions whose parameters (Query, Res, ResMut, Commands) tell Bevy what data they need, and Bevy schedules them.",
          "roles": {
            "Entity": [
              "ecs-bevy-real/systems.rs#startup_system",
              "ecs-bevy-real/systems.rs#new_player_system"
            ],
            "Component": [
              "ecs-bevy-real/components.rs#Player",
              "ecs-bevy-real/components.rs#Score",
              "ecs-bevy-real/components.rs#PlayerStreak"
            ],
            "System": [
              "ecs-bevy-real/systems.rs#score_system",
              "ecs-bevy-real/systems.rs#score_check_system",
              "ecs-bevy-real/systems.rs#new_round_system",
              "ecs-bevy-real/systems.rs#game_over_system"
            ],
            "World": [
              "ecs-bevy-real/main.rs#main",
              "ecs-bevy-real/systems.rs#exclusive_player_system",
              "ecs-bevy-real/components.rs#GameState",
              "ecs-bevy-real/components.rs#GameRules"
            ]
          },
          "trace": [
            {
              "at": "ecs-bevy-real/main.rs#main",
              "say": "main() builds the App: it registers resources and systems, groups them into ordered sets, then calls run()."
            },
            {
              "at": "ecs-bevy-real/systems.rs#startup_system",
              "say": "The Startup system runs once. commands.spawn_batch creates two entities, each a bundle of Player, Score and PlayerStreak."
            },
            {
              "at": "ecs-bevy-real/systems.rs#new_round_system",
              "say": "Each update a round begins. ResMut<GameState> means this system may change a global resource; Res is read-only."
            },
            {
              "at": "ecs-bevy-real/systems.rs#new_player_system",
              "say": "Commands queue a new entity instead of touching the World directly, so systems can safely run in parallel."
            },
            {
              "at": "ecs-bevy-real/systems.rs#score_system",
              "say": "Query<(&Player, &mut Score, &mut PlayerStreak)> hands this system every entity with those three components."
            },
            {
              "at": "ecs-bevy-real/systems.rs#score_check_system",
              "say": "A second system reads the same Score data plus the GameRules resource to find a winner."
            },
            {
              "at": "ecs-bevy-real/systems.rs#game_over_system",
              "say": "Runs after score_check_system (set by .after()). It writes an AppExit message when someone wins or rounds run out."
            },
            {
              "at": "ecs-bevy-real/systems.rs#exclusive_player_system",
              "say": "An exclusive system takes &mut World for full access, at the cost of blocking all parallel systems while it runs."
            }
          ],
          "files": {
            "ecs-bevy-real/components.rs": "// Source: Bevy 0.19.1 examples/ecs/ecs_guide.rs — https://github.com/bevyengine/bevy/blob/v0.19.1/examples/ecs/ecs_guide.rs\n// MIT License (Bevy is dual-licensed MIT OR Apache-2.0), Copyright (c) Bevy Contributors. Included for study.\n// Software City split: this file holds lines 35-86 of ecs_guide.rs (components and resources).\n// added by Software City: imports needed after the split\nuse bevy::prelude::*;\nuse std::fmt;\n\n// COMPONENTS: Pieces of functionality we add to entities. These are just normal Rust data types\n//\n\n// Our game will have a number of \"players\". Each player has a name that identifies them\n#[derive(Component)]\nstruct Player {\n    name: String,\n}\n\n// Each player also has a score. This component holds on to that score\n#[derive(Component)]\nstruct Score {\n    value: usize,\n}\n\n// Enums can also be used as components.\n// This component tracks how many consecutive rounds a player has/hasn't scored in.\n#[derive(Component)]\nenum PlayerStreak {\n    Hot(usize),\n    None,\n    Cold(usize),\n}\n\nimpl fmt::Display for PlayerStreak {\n    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n        match self {\n            PlayerStreak::Hot(n) => write!(f, \"{n} round hot streak\"),\n            PlayerStreak::None => write!(f, \"0 round streak\"),\n            PlayerStreak::Cold(n) => write!(f, \"{n} round cold streak\"),\n        }\n    }\n}\n\n// RESOURCES: \"Global\" state accessible by systems. These are also just normal Rust data types!\n//\n\n// This resource holds information about the game:\n#[derive(Resource, Default)]\nstruct GameState {\n    current_round: usize,\n    total_players: usize,\n    winning_player: Option<String>,\n}\n\n// This resource provides rules for our \"game\".\n#[derive(Resource)]\nstruct GameRules {\n    winning_score: usize,\n    max_rounds: usize,\n    max_players: usize,\n}\n",
            "ecs-bevy-real/main.rs": "// Source: Bevy 0.19.1 examples/ecs/ecs_guide.rs — https://github.com/bevyengine/bevy/blob/v0.19.1/examples/ecs/ecs_guide.rs\n// MIT License (Bevy is dual-licensed MIT OR Apache-2.0), Copyright (c) Bevy Contributors. Included for study.\n// Software City split this one example file into main.rs, components.rs and systems.rs (lines 1-33 and 283-366 are here).\n//! This is a guided introduction to Bevy's \"Entity Component System\" (ECS)\n//! All Bevy app logic is built using the ECS pattern, so definitely pay attention!\n//!\n//! Why ECS?\n//! * Data oriented: Functionality is driven by data\n//! * Clean Architecture: Loose coupling of functionality / prevents deeply nested inheritance\n//! * High Performance: Massively parallel and cache friendly\n//!\n//! ECS Definitions:\n//!\n//! Component: just a normal Rust data type. generally scoped to a single piece of functionality\n//!     Examples: position, velocity, health, color, name\n//!\n//! Entity: a collection of components with a unique id\n//!     Examples: Entity1 { Name(\"Alice\"), Position(0, 0) },\n//!               Entity2 { Name(\"Bill\"), Position(10, 5) }\n//!\n//! Resource: a shared global piece of data\n//!     Examples: asset storage, messages, system state\n//!\n//! System: runs logic on entities, components, and resources\n//!     Examples: move system, damage system\n//!\n//! Now that you know a little bit about ECS, lets look at some Bevy code!\n//! We will now make a simple \"game\" to illustrate what Bevy's ECS looks like in practice.\n\nuse bevy::{\n    app::{AppExit, ScheduleRunnerPlugin},\n    prelude::*,\n};\nuse core::time::Duration;\nuse rand::random;\nuse std::fmt;\n// added by Software City: join the split files\nmod components;\nmod systems;\nuse components::*;\nuse systems::*;\n\n/// A group of related system sets, used for controlling the order of systems. Systems can be\n/// added to any number of sets.\n#[derive(SystemSet, Debug, Hash, PartialEq, Eq, Clone)]\nenum MySystems {\n    BeforeRound,\n    Round,\n    AfterRound,\n}\n\n// Our Bevy app's entry point\nfn main() {\n    // Bevy apps are created using the builder pattern. We use the builder to add systems,\n    // resources, and plugins to our app\n    App::new()\n        // Resources that implement the Default or FromWorld trait can be added like this:\n        .init_resource::<GameState>()\n        // Plugins are just a grouped set of app builder calls (just like we're doing here).\n        // We could easily turn our game into a plugin, but you can check out the plugin example for\n        // that :) The plugin below runs our app's \"system schedule\" once every 5 seconds.\n        .add_plugins(ScheduleRunnerPlugin::run_loop(Duration::from_secs(5)))\n        // `Startup` systems run exactly once BEFORE all other systems. These are generally used for\n        // app initialization code (ex: adding entities and resources)\n        .add_systems(Startup, startup_system)\n        // `Update` systems run once every update. These are generally used for \"real-time app logic\"\n        .add_systems(Update, print_message_system)\n        // SYSTEM EXECUTION ORDER\n        //\n        // Each system belongs to a `Schedule`, which controls the execution strategy and broad order\n        // of the systems within each tick. The `Startup` schedule holds\n        // startup systems, which are run a single time before `Update` runs. `Update` runs once per app update,\n        // which is generally one \"frame\" or one \"tick\".\n        //\n        // By default, all systems in a `Schedule` run in parallel, except when they require mutable access to a\n        // piece of data. This is efficient, but sometimes order matters.\n        // For example, we want our \"game over\" system to execute after all other systems to ensure\n        // we don't accidentally run the game for an extra round.\n        //\n        // You can force an explicit ordering between systems using the `.before` or `.after` methods.\n        // Systems will not be scheduled until all of the systems that they have an \"ordering dependency\" on have\n        // completed.\n        // There are other schedules, such as `Last` which runs at the very end of each run.\n        .add_systems(Last, print_at_end_round)\n        // We can also create new system sets, and order them relative to other system sets.\n        // Here is what our games execution order will look like:\n        // \"before_round\": new_player_system, new_round_system\n        // \"round\": print_message_system, score_system\n        // \"after_round\": score_check_system, game_over_system\n        .configure_sets(\n            Update,\n            // chain() will ensure sets run in the order they are listed\n            (\n                MySystems::BeforeRound,\n                MySystems::Round,\n                MySystems::AfterRound,\n            )\n                .chain(),\n        )\n        // The add_systems function is powerful. You can define complex system configurations with ease!\n        .add_systems(\n            Update,\n            (\n                // These `BeforeRound` systems will run before `Round` systems, thanks to the chained set configuration\n                (\n                    // You can also chain systems! new_round_system will run first, followed by new_player_system\n                    (new_round_system, new_player_system).chain(),\n                    exclusive_player_system,\n                )\n                    // All of the systems in the tuple above will be added to this set\n                    .in_set(MySystems::BeforeRound),\n                // This `Round` system will run after the `BeforeRound` systems thanks to the chained set configuration\n                score_system.in_set(MySystems::Round),\n                // These `AfterRound` systems will run after the `Round` systems thanks to the chained set configuration\n                (\n                    score_check_system,\n                    // In addition to chain(), you can also use `before(system)` and `after(system)`. This also works\n                    // with sets!\n                    game_over_system.after(score_check_system),\n                )\n                    .in_set(MySystems::AfterRound),\n            ),\n        )\n        // This call to run() starts the app we just built!\n        .run();\n}\n",
            "ecs-bevy-real/systems.rs": "// Source: Bevy 0.19.1 examples/ecs/ecs_guide.rs — https://github.com/bevyengine/bevy/blob/v0.19.1/examples/ecs/ecs_guide.rs\n// MIT License (Bevy is dual-licensed MIT OR Apache-2.0), Copyright (c) Bevy Contributors. Included for study.\n// Software City split: this file holds lines 88-281 of ecs_guide.rs (the systems).\n// added by Software City: imports needed after the split\nuse bevy::{app::AppExit, prelude::*};\nuse rand::random;\nuse crate::components::*;\n\n// SYSTEMS: Logic that runs on entities, components, and resources. These generally run once each\n// time the app updates.\n//\n\n// This is the simplest type of system. It just prints \"This game is fun!\" on each run:\nfn print_message_system() {\n    println!(\"This game is fun!\");\n}\n\n// Systems can also read and modify resources. This system starts a new \"round\" on each update:\n// NOTE: \"mut\" denotes that the resource is \"mutable\"\n// Res<GameRules> is read-only. ResMut<GameState> can modify the resource\nfn new_round_system(game_rules: Res<GameRules>, mut game_state: ResMut<GameState>) {\n    game_state.current_round += 1;\n    println!(\n        \"Begin round {} of {}\",\n        game_state.current_round, game_rules.max_rounds\n    );\n}\n\n// This system updates the score for each entity with the `Player`, `Score` and `PlayerStreak` components.\nfn score_system(mut query: Query<(&Player, &mut Score, &mut PlayerStreak)>) {\n    for (player, mut score, mut streak) in &mut query {\n        let scored_a_point = random::<bool>();\n        if scored_a_point {\n            // Accessing components immutably is done via a regular reference - `player`\n            // has type `&Player`.\n            //\n            // Accessing components mutably is performed via type `Mut<T>` - `score`\n            // has type `Mut<Score>` and `streak` has type `Mut<PlayerStreak>`.\n            //\n            // `Mut<T>` implements `Deref<T>`, so struct fields can be updated using\n            // standard field update syntax ...\n            score.value += 1;\n            // ... and matching against enums requires dereferencing them\n            *streak = match *streak {\n                PlayerStreak::Hot(n) => PlayerStreak::Hot(n + 1),\n                PlayerStreak::Cold(_) | PlayerStreak::None => PlayerStreak::Hot(1),\n            };\n            println!(\n                \"{} scored a point! Their score is: {} ({})\",\n                player.name, score.value, *streak\n            );\n        } else {\n            *streak = match *streak {\n                PlayerStreak::Hot(_) | PlayerStreak::None => PlayerStreak::Cold(1),\n                PlayerStreak::Cold(n) => PlayerStreak::Cold(n + 1),\n            };\n\n            println!(\n                \"{} did not score a point! Their score is: {} ({})\",\n                player.name, score.value, *streak\n            );\n        }\n    }\n\n    // this game isn't very fun is it :)\n}\n\n// This system runs on all entities with the `Player` and `Score` components, but it also\n// accesses the `GameRules` resource to determine if a player has won.\nfn score_check_system(\n    game_rules: Res<GameRules>,\n    mut game_state: ResMut<GameState>,\n    query: Query<(&Player, &Score)>,\n) {\n    for (player, score) in &query {\n        if score.value == game_rules.winning_score {\n            game_state.winning_player = Some(player.name.clone());\n        }\n    }\n}\n\n// This system ends the game if we meet the right conditions. This fires an AppExit message, which\n// tells our App to quit. Check out the \"message.rs\" example if you want to learn more about using\n// messages.\nfn game_over_system(\n    game_rules: Res<GameRules>,\n    game_state: Res<GameState>,\n    mut app_exit_writer: MessageWriter<AppExit>,\n) {\n    if let Some(ref player) = game_state.winning_player {\n        println!(\"{player} won the game!\");\n        app_exit_writer.write(AppExit::Success);\n    } else if game_state.current_round == game_rules.max_rounds {\n        println!(\"Ran out of rounds. Nobody wins!\");\n        app_exit_writer.write(AppExit::Success);\n    }\n}\n\n// This is a \"startup\" system that runs exactly once when the app starts up. Startup systems are\n// generally used to create the initial \"state\" of our game. The only thing that distinguishes a\n// \"startup\" system from a \"normal\" system is how it is registered:\n//      Startup: app.add_systems(Startup, startup_system)\n//      Normal:  app.add_systems(Update, normal_system)\nfn startup_system(mut commands: Commands, mut game_state: ResMut<GameState>) {\n    // Create our game rules resource\n    commands.insert_resource(GameRules {\n        max_rounds: 10,\n        winning_score: 4,\n        max_players: 4,\n    });\n\n    // Add some players to our world. Players start with a score of 0 ... we want our game to be\n    // fair!\n    commands.spawn_batch(vec![\n        (\n            Player {\n                name: \"Alice\".to_string(),\n            },\n            Score { value: 0 },\n            PlayerStreak::None,\n        ),\n        (\n            Player {\n                name: \"Bob\".to_string(),\n            },\n            Score { value: 0 },\n            PlayerStreak::None,\n        ),\n    ]);\n\n    // set the total players to \"2\"\n    game_state.total_players = 2;\n}\n\n// This system uses a command buffer to (potentially) add a new player to our game on each\n// iteration. Normal systems cannot safely access the World instance directly because they run in\n// parallel. Our World contains all of our components, so mutating arbitrary parts of it in parallel\n// is not thread safe. Command buffers give us the ability to queue up changes to our World without\n// directly accessing it\nfn new_player_system(\n    mut commands: Commands,\n    game_rules: Res<GameRules>,\n    mut game_state: ResMut<GameState>,\n) {\n    // Randomly add a new player\n    let add_new_player = random::<bool>();\n    if add_new_player && game_state.total_players < game_rules.max_players {\n        game_state.total_players += 1;\n        commands.spawn((\n            Player {\n                name: format!(\"Player {}\", game_state.total_players),\n            },\n            Score { value: 0 },\n            PlayerStreak::None,\n        ));\n\n        println!(\"Player {} joined the game!\", game_state.total_players);\n    }\n}\n\n// If you really need full, immediate read/write access to the world or resources, you can use an\n// \"exclusive system\".\n// WARNING: These will block all parallel execution of other systems until they finish, so they\n// should generally be avoided if you want to maximize parallelism.\nfn exclusive_player_system(world: &mut World) {\n    // this does the same thing as \"new_player_system\"\n    let total_players = world.resource_mut::<GameState>().total_players;\n    let should_add_player = {\n        let game_rules = world.resource::<GameRules>();\n        let add_new_player = random::<bool>();\n        add_new_player && total_players < game_rules.max_players\n    };\n    // Randomly add a new player\n    if should_add_player {\n        println!(\"Player {} has joined the game!\", total_players + 1);\n        world.spawn((\n            Player {\n                name: format!(\"Player {}\", total_players + 1),\n            },\n            Score { value: 0 },\n            PlayerStreak::None,\n        ));\n\n        let mut game_state = world.resource_mut::<GameState>();\n        game_state.total_players += 1;\n    }\n}\n\n// Sometimes systems need to be stateful. Bevy's ECS provides the `Local` system parameter\n// for this case. A `Local<T>` refers to a value of type `T` that is owned by the system.\n// This value is automatically initialized using `T`'s `FromWorld`* implementation upon the system's initialization.\n// In this system's `Local` (`counter`), `T` is `u32`.\n// Therefore, on the first turn, `counter` has a value of 0.\n//\n// *: `FromWorld` is a trait which creates a value using the contents of the `World`.\n// For any type which is `Default`, like `u32` in this example, `FromWorld` creates the default value.\nfn print_at_end_round(mut counter: Local<u32>) {\n    *counter += 1;\n    println!(\"In set 'Last' for the {}th time\", *counter);\n    // Print an empty line between rounds\n    println!();\n}\n"
          }
        }
      ]
    },
    {
      "id": "game-loop",
      "name": "Game Loop",
      "family": "Architecture",
      "aka": [
        "Main loop",
        "Fixed timestep",
        "Update/render loop",
        "Tick loop"
      ],
      "tagline": "Repeat forever: measure time, update the world in fixed steps, then draw it.",
      "intent": "Keep a program running continuously, independent of user input: each frame it measures how much real time passed, advances the simulation in fixed-size steps until it has caught up, then renders once. Separating fixed-step updates from variable-rate drawing makes physics behave the same on fast and slow machines.",
      "analogy": "A film projector and a puppet show combined: the puppeteers move in fixed beats to a metronome (updates), while a camera takes pictures as fast as it can (renders). A slow camera means fewer pictures, never slower puppets.",
      "cityShape": "Look for one loop function whose pipes fan out every frame to a clock (reading time), an update floor (called repeatedly, writing the game state antennas) and a render floor (only reading them). The accumulator/lag variable is an antenna that the loop both writes and reads.",
      "roles": [
        {
          "name": "Main Loop",
          "desc": "Runs every frame: asks the clock for elapsed time, calls update as many times as needed, then calls render."
        },
        {
          "name": "Clock",
          "desc": "Measures real time between frames and keeps the leftover time (the accumulator) that has not been simulated yet."
        },
        {
          "name": "Update",
          "desc": "Advances game state by one fixed step (physics, AI, rules). Called zero, one or several times per frame."
        },
        {
          "name": "Render",
          "desc": "Draws the current state once per frame, optionally interpolating between the last two updates. It never changes game rules."
        }
      ],
      "whenToUse": [
        "Games, simulations and animations that must keep moving even when the user does nothing.",
        "Physics or rules must give the same result at 30 fps and at 240 fps (fair multiplayer, replays, determinism).",
        "Some logic should tick at a slower, fixed rate than rendering, like a farm or city simulation.",
        "In engines like Godot or Unity the engine owns the loop; you still choose which callback (_process vs _physics_process) your code belongs in."
      ],
      "pitfalls": [
        "Moving things by a fixed amount per frame ties game speed to frame rate; always scale by delta or use fixed steps.",
        "Spiral of death: if one update takes longer than the time it simulates, the loop falls further behind every frame. Cap the catch-up steps.",
        "Putting heavy visual work in the fixed update, or gameplay rules in the render step, mixes the two clocks and causes jitter."
      ],
      "related": [
        "ecs",
        "state",
        "observer",
        "command"
      ],
      "quiz": [
        {
          "q": "A frame took 50 ms and the fixed step is 1/60 s (about 16.7 ms). What does a fixed-timestep loop do?",
          "options": [
            "Calls update once with 50 ms",
            "Calls update three times with 16.7 ms each, then renders once",
            "Skips this frame entirely",
            "Renders three times and updates once"
          ],
          "answer": 1,
          "why": "The accumulator receives 50 ms and is drained in equal fixed steps, so the simulation catches up without ever taking a big, unstable step."
        },
        {
          "q": "In Godot, where should a CharacterBody2D's movement and move_and_slide() go?",
          "options": [
            "_process(delta)",
            "_physics_process(delta)",
            "_ready()",
            "_draw()"
          ],
          "answer": 1,
          "why": "_physics_process runs at a fixed rate in sync with the physics engine, so collisions and movement are consistent; _process runs once per rendered frame."
        }
      ],
      "demos": [
        {
          "id": "game-loop-py-ball",
          "title": "Bouncing ball in the terminal",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A ball falls and bounces, drawn as text. run_loop() collects real elapsed time in lag and spends it in fixed 1/60 s updates. Notice that only Ball.update writes y and speed; draw() only reads them.",
          "roles": {
            "Main Loop": [
              "game-loop-py-ball/main.py#run_loop"
            ],
            "Clock": [
              "game-loop-py-ball/clock.py#Clock"
            ],
            "Update": [
              "game-loop-py-ball/ball.py#Ball.update"
            ],
            "Render": [
              "game-loop-py-ball/renderer.py#draw"
            ]
          },
          "trace": [
            {
              "at": "game-loop-py-ball/main.py#run_loop",
              "say": "run_loop() repeats for every frame. First it asks the clock how much real time has passed and adds it to lag."
            },
            {
              "at": "game-loop-py-ball/clock.py#Clock.tick",
              "say": "tick() returns the seconds since the previous call. This number changes from frame to frame."
            },
            {
              "at": "game-loop-py-ball/main.py#run_loop",
              "say": "The inner while loop spends lag in fixed STEP-sized chunks. A slow frame simply means more chunks."
            },
            {
              "at": "game-loop-py-ball/ball.py#Ball.update",
              "say": "update() always advances by exactly STEP seconds, so the bounce looks the same on a fast or slow computer."
            },
            {
              "at": "game-loop-py-ball/renderer.py#draw",
              "say": "Finally draw() runs once per frame. It reads the ball's height and never changes it."
            }
          ],
          "files": {
            "game-loop-py-ball/ball.py": "GRAVITY = -9.8\nFLOOR = 0.0\n\n\n# The game state. update() advances it by exactly dt seconds, so physics is the same on any PC.\nclass Ball:\n    def __init__(self, height):\n        self.y = height\n        self.speed = 0.0\n\n    def update(self, dt):\n        self.speed += GRAVITY * dt\n        self.y += self.speed * dt\n        if self.y < FLOOR:\n            self.y = FLOOR\n            self.speed = -self.speed * 0.8\n",
            "game-loop-py-ball/clock.py": "import time\n\n\n# The Clock measures real time between frames. Frames are never exactly the same length.\nclass Clock:\n    def __init__(self):\n        self.last = time.perf_counter()\n\n    def tick(self):\n        now = time.perf_counter()\n        elapsed = now - self.last\n        self.last = now\n        return elapsed\n",
            "game-loop-py-ball/main.py": "import time\n\nfrom .clock import Clock\nfrom .ball import Ball\nfrom .renderer import draw\n\nSTEP = 1 / 60\nMAX_FRAMES = 120\n\n\n# The game loop: measure time, catch up with fixed-size updates, then draw once.\ndef run_loop():\n    clock = Clock()\n    ball = Ball(height=10.0)\n    lag = 0.0\n    for frame in range(MAX_FRAMES):\n        lag += clock.tick()\n        while lag >= STEP:\n            ball.update(STEP)\n            lag -= STEP\n        draw(ball, frame)\n        time.sleep(0.03)\n\n\nif __name__ == \"__main__\":\n    run_loop()\n",
            "game-loop-py-ball/renderer.py": "# Rendering only READS the state. It may run more or less often than update().\n\n\ndef draw(ball, frame):\n    column = int(ball.y * 4)\n    print(f\"frame {frame:3d} |\" + \" \" * column + \"o\")\n"
          }
        },
        {
          "id": "game-loop-gd-farm",
          "title": "Godot: physics, frames and a farm tick",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Godot runs the loop for you. The player moves in _physics_process (fixed 60 Hz), visuals use _process (per frame), and a custom SimClock adds a third, slower fixed timestep for crop growth.",
          "roles": {
            "Main Loop": [
              "game-loop-gd-farm/farm.gd#_process"
            ],
            "Clock": [
              "game-loop-gd-farm/sim_clock.gd#_process",
              "game-loop-gd-farm/sim_clock.gd#get_alpha"
            ],
            "Update": [
              "game-loop-gd-farm/player.gd#_physics_process",
              "game-loop-gd-farm/crop.gd#_on_tick"
            ],
            "Render": [
              "game-loop-gd-farm/player.gd#_process",
              "game-loop-gd-farm/crop.gd#_process"
            ]
          },
          "trace": [
            {
              "at": "game-loop-gd-farm/player.gd#_physics_process",
              "say": "Godot calls _physics_process at a fixed rate. Movement and collisions live here, so they behave the same at any fps."
            },
            {
              "at": "game-loop-gd-farm/player.gd#_process",
              "say": "_process runs once per drawn frame. Turning the sprite smoothly is visual, so it uses the frame's delta."
            },
            {
              "at": "game-loop-gd-farm/farm.gd#_ready",
              "say": "The farm hands every crop the SimClock. Crops will grow on its ticks, not on frames."
            },
            {
              "at": "game-loop-gd-farm/sim_clock.gd#_process",
              "say": "A hand-made accumulator: add delta each frame, emit a tick per 0.25 s gathered, and cap catch-up at 8 ticks."
            },
            {
              "at": "game-loop-gd-farm/crop.gd#_on_tick",
              "say": "Growth only changes on a tick, so a crop ripens after exactly 40 ticks whether the game runs at 30 or 144 fps."
            },
            {
              "at": "game-loop-gd-farm/sim_clock.gd#get_alpha",
              "say": "get_alpha() says how far we are toward the next tick (0 to 1): the leftover time as a fraction."
            },
            {
              "at": "game-loop-gd-farm/crop.gd#_process",
              "say": "The crop's per-frame _process blends toward the next growth step with alpha, so it looks smooth between ticks."
            },
            {
              "at": "game-loop-gd-farm/farm.gd#_process",
              "say": "The HUD shows all three rates side by side: render fps, physics Hz and farm ticks."
            }
          ],
          "files": {
            "game-loop-gd-farm/crop.gd": "# Game state updated only on simulation ticks, so growth is deterministic and save-friendly.\nextends Node2D\n\nconst SimClock = preload(\"res://sim_clock.gd\")\n\n@export var ticks_to_ripen := 40\n\nvar growth := 0\nvar clock: SimClock\n\nfunc setup(sim_clock: SimClock) -> void:\n\tclock = sim_clock\n\tclock.ticked.connect(_on_tick)\n\nfunc _on_tick(_tick_number: int) -> void:\n\tif growth < ticks_to_ripen:\n\t\tgrowth += 1\n\n# Rendering every frame: blend toward the next growth step so it looks smooth between ticks.\nfunc _process(_delta: float) -> void:\n\tvar smooth := growth + (clock.get_alpha() if growth < ticks_to_ripen else 0.0)\n\tscale = Vector2.ONE * (0.3 + 0.7 * smooth / ticks_to_ripen)\n",
            "game-loop-gd-farm/farm.gd": "# The scene root wires things up and shows the loop rates on screen.\nextends Node2D\n\n@onready var sim_clock = $SimClock\n@onready var fps_label: Label = $HUD/FpsLabel\n\nfunc _ready() -> void:\n\tfor crop in $Crops.get_children():\n\t\tcrop.setup(sim_clock)\n\nfunc _process(_delta: float) -> void:\n\tfps_label.text = \"render: %d fps | physics: %d Hz | farm: 4 ticks/s\" % [\n\t\tEngine.get_frames_per_second(), Engine.physics_ticks_per_second]\n",
            "game-loop-gd-farm/player.gd": "# Godot owns the game loop. It calls _physics_process at a FIXED rate (60 Hz by default)\n# and _process once per rendered frame, however fast or slow that is.\nextends CharacterBody2D\n\nconst SPEED := 200.0\n\n@onready var sprite: Sprite2D = $Sprite2D\n\n# Fixed step: movement and collisions behave the same at 30 or 240 fps.\nfunc _physics_process(_delta: float) -> void:\n\tvar direction := Input.get_vector(\"left\", \"right\", \"up\", \"down\")\n\tvelocity = direction * SPEED\n\tmove_and_slide()\n\n# Per frame: purely visual work, scaled by the frame's delta.\nfunc _process(delta: float) -> void:\n\tif velocity.length() > 0.0:\n\t\tsprite.rotation = lerp_angle(sprite.rotation, velocity.angle(), 10.0 * delta)\n",
            "game-loop-gd-farm/sim_clock.gd": "# A hand-made fixed timestep for game rules that should tick slower than physics:\n# the farm simulation advances exactly 4 times per second, whatever the frame rate.\nextends Node\n\nsignal ticked(tick_number: int)\n\nconst TICK_SECONDS := 0.25\nconst MAX_TICKS_PER_FRAME := 8\n\nvar accumulator := 0.0\nvar tick_number := 0\n\nfunc _process(delta: float) -> void:\n\taccumulator += delta\n\tvar ticks_this_frame := 0\n\twhile accumulator >= TICK_SECONDS and ticks_this_frame < MAX_TICKS_PER_FRAME:\n\t\taccumulator -= TICK_SECONDS\n\t\ttick_number += 1\n\t\tticks_this_frame += 1\n\t\tticked.emit(tick_number)\n\nfunc get_alpha() -> float:\n\treturn accumulator / TICK_SECONDS\n"
          }
        },
        {
          "id": "game-loop-mainloop-real",
          "title": "MainLoop.js: fixed timestep for the browser",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "IceCreamYou/MainLoop.js",
            "url": "https://github.com/IceCreamYou/MainLoop.js/blob/1.0.4/src/mainloop.js",
            "license": "MIT",
            "note": "mainloop/mainloop.js is verbatim from MainLoop.js 1.0.4 with long doc comments, the requestAnimationFrame polyfill and simple getters/setters trimmed (marked). game.js and main.js were written for Software City."
          },
          "story": "A well-known library implementing the 'Fix Your Timestep' loop on top of requestAnimationFrame. You register begin/update/draw/end callbacks; animate() runs the accumulator, the panic check and interpolation.",
          "roles": {
            "Main Loop": [
              "game-loop-mainloop-real/mainloop/mainloop.js#animate",
              "game-loop-mainloop-real/mainloop/mainloop.js#start"
            ],
            "Clock": [
              "game-loop-mainloop-real/mainloop/mainloop.js#resetFrameDelta"
            ],
            "Update": [
              "game-loop-mainloop-real/game.js#update"
            ],
            "Render": [
              "game-loop-mainloop-real/game.js#draw"
            ]
          },
          "trace": [
            {
              "at": "game-loop-mainloop-real/main.js#main",
              "say": "main() registers the game's update, draw and end functions with chained setters, then starts the loop."
            },
            {
              "at": "game-loop-mainloop-real/mainloop/mainloop.js#start",
              "say": "start() draws the initial state once, resets the timing variables, then schedules animate() with requestAnimationFrame."
            },
            {
              "at": "game-loop-mainloop-real/mainloop/mainloop.js#animate",
              "say": "Each frame animate() re-schedules itself first, then adds the elapsed time to frameDelta, the accumulator."
            },
            {
              "at": "game-loop-mainloop-real/game.js#update",
              "say": "While frameDelta holds a full timestep, update() runs with that fixed delta. The box moves the same distance at any frame rate."
            },
            {
              "at": "game-loop-mainloop-real/mainloop/mainloop.js#animate",
              "say": "After 240 updates in one frame it sets panic and breaks out, avoiding a spiral of death."
            },
            {
              "at": "game-loop-mainloop-real/game.js#draw",
              "say": "draw() gets frameDelta / timestep, a 0..1 interpolation, and blends between the last two positions for smooth motion."
            },
            {
              "at": "game-loop-mainloop-real/game.js#end",
              "say": "end() gets the FPS average and the panic flag. On panic it calls resetFrameDelta() to drop the backlog."
            },
            {
              "at": "game-loop-mainloop-real/mainloop/mainloop.js#resetFrameDelta",
              "say": "resetFrameDelta() zeroes the accumulator and returns what was discarded: the game jumps ahead instead of freezing."
            }
          ],
          "files": {
            "game-loop-mainloop-real/game.js": "// Written for Software City (not part of MainLoop.js): the game state and the callbacks MainLoop runs.\nimport MainLoop from './mainloop/mainloop.js'\n\nconst box = { x: 0, lastX: 0, speed: 0.2 }\nlet fpsLabel = ''\n\n// Called with a FIXED delta (1000/60 ms), maybe several times per frame. All movement happens here.\nexport function update(delta) {\n  box.lastX = box.x\n  box.x += box.speed * delta\n  if (box.x > 500 || box.x < 0) {\n    box.speed = -box.speed\n  }\n}\n\n// Called once per frame. interpolation (0..1) says how far we are between the last two updates.\nexport function draw(interpolation) {\n  const x = box.lastX + (box.x - box.lastX) * interpolation\n  console.log(`box at ${x.toFixed(1)}px ${fpsLabel}`)\n}\n\n// Called at the end of each frame with the measured FPS and a panic flag.\nexport function end(fps, panic) {\n  fpsLabel = `(${Math.round(fps)} fps)`\n  if (panic) {\n    const lost = MainLoop.resetFrameDelta()\n    console.warn(`fell behind; skipped ${Math.round(lost)}ms of simulation`)\n  }\n}\n",
            "game-loop-mainloop-real/main.js": "// Written for Software City (not part of MainLoop.js): plug the game callbacks into the loop and start it.\nimport MainLoop from './mainloop/mainloop.js'\nimport { update, draw, end } from './game.js'\n\nfunction main() {\n  MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start()\n}\n\nmain()\n",
            "game-loop-mainloop-real/mainloop/mainloop.js": "// Source: MainLoop.js 1.0.4 — https://github.com/IceCreamYou/MainLoop.js/blob/1.0.4/src/mainloop.js\n// MIT License, Copyright (c) 2016 Isaac Sukin. Included for study.\n/*\n * A main loop useful for games and other animated applications.\n */\n(function(root) {\n\n    // The amount of time (in milliseconds) to simulate each time update()\n    // runs. See `MainLoop.setSimulationTimestep()` for details.\nvar simulationTimestep = 1000 / 60,\n\n    // The cumulative amount of in-app time that hasn't been simulated yet.\n    // See the comments inside animate() for details.\n    frameDelta = 0,\n\n    // The timestamp in milliseconds of the last time the main loop was run.\n    // Used to compute the time elapsed between frames.\n    lastFrameTimeMs = 0,\n\n    // An exponential moving average of the frames per second.\n    fps = 60,\n\n    // A factor that affects how heavily to weight more recent seconds'\n    // performance when calculating the average frames per second. Valid values\n    // range from zero to one inclusive. Higher values result in weighting more\n    // recent seconds more heavily.\n    fpsAlpha = 0.9,\n\n    // The minimum duration between updates to the frames-per-second estimate.\n    // Higher values increase accuracy, but result in slower updates.\n    fpsUpdateInterval = 1000,\n\n    // The timestamp (in milliseconds) of the last time the `fps` moving\n    // average was updated.\n    lastFpsUpdate = 0,\n\n    // The number of frames delivered since the last time the `fps` moving\n    // average was updated (i.e. since `lastFpsUpdate`).\n    framesSinceLastFpsUpdate = 0,\n\n    // The number of times update() is called in a given frame. This is only\n    // relevant inside of animate(), but a reference is held externally so that\n    // this variable is not marked for garbage collection every time the main\n    // loop runs.\n    numUpdateSteps = 0,\n\n    // The minimum amount of time in milliseconds that must pass since the last\n    // frame was executed before another frame can be executed. The\n    // multiplicative inverse caps the FPS (the default of zero means there is\n    // no cap).\n    minFrameDelay = 0,\n\n    // Whether the main loop is running.\n    running = false,\n\n    // `true` if `MainLoop.start()` has been called and the most recent time it\n    // was called has not been followed by a call to `MainLoop.stop()`. This is\n    // different than `running` because there is a delay of a few milliseconds\n    // after `MainLoop.start()` is called before the application is considered\n    // \"running.\" This delay is due to waiting for the next frame.\n    started = false,\n\n    // Whether the simulation has fallen too far behind real time.\n    // Specifically, `panic` will be set to `true` if too many updates occur in\n    // one frame. This is only relevant inside of animate(), but a reference is\n    // held externally so that this variable is not marked for garbage\n    // collection every time the main loop runs.\n    panic = false,\n\n    // The object most likely to have `requestAnimationFrame` attached is\n    // `window`, if it's available in this environment. Otherwise, fall back to\n    // the root context.\n    windowOrRoot = typeof window === 'object' ? window : root,\n\n    // … trimmed: 21 lines: requestAnimationFrame = window.requestAnimationFrame, or a setTimeout-based polyfill for node.js …\n\n    // The function that stops the main loop. The unprefixed version of\n    // `window.cancelAnimationFrame()` is available in all modern browsers now,\n    // but node.js doesn't have it, so fall back to timers.\n    cancelAnimationFrame = windowOrRoot.cancelAnimationFrame || clearTimeout,\n\n    // In all major browsers, replacing non-specified functions with NOOPs\n    // seems to be as fast or slightly faster than using conditions to only\n    // call the functions if they are specified. This is probably due to empty\n    // functions being optimized away. http://jsperf.com/noop-vs-condition\n    NOOP = function() {},\n\n    // A function that runs at the beginning of the main loop.\n    // See `MainLoop.setBegin()` for details.\n    begin = NOOP,\n\n    // A function that runs updates (i.e. AI and physics).\n    // See `MainLoop.setUpdate()` for details.\n    update = NOOP,\n\n    // A function that draws things on the screen.\n    // See `MainLoop.setDraw()` for details.\n    draw = NOOP,\n\n    // A function that runs at the end of the main loop.\n    // See `MainLoop.setEnd()` for details.\n    end = NOOP,\n\n    // The ID of the currently executing frame. Used to cancel frames when\n    // stopping the loop.\n    rafHandle;\n\n// … trimmed: 26-line doc comment (API documentation) …\nroot.MainLoop = {\n    // … trimmed: 41 lines: getters/setters for the timestep and the FPS cap …\n    // … trimmed: 21-line doc comment (API documentation) …\n    resetFrameDelta: function() {\n        var oldFrameDelta = frameDelta;\n        frameDelta = 0;\n        return oldFrameDelta;\n    },\n\n    // … trimmed: 30-line doc comment (API documentation) …\n    setBegin: function(fun) {\n        begin = fun || begin;\n        return this;\n    },\n\n    // … trimmed: 51-line doc comment (API documentation) …\n    setUpdate: function(fun) {\n        update = fun || update;\n        return this;\n    },\n\n    // … trimmed: 34-line doc comment (API documentation) …\n    setDraw: function(fun) {\n        draw = fun || draw;\n        return this;\n    },\n\n    // … trimmed: 49-line doc comment (API documentation) …\n    setEnd: function(fun) {\n        end = fun || end;\n        return this;\n    },\n\n    // … trimmed: 17-line doc comment (API documentation) …\n    start: function() {\n        if (!started) {\n            // Since the application doesn't start running immediately, track\n            // whether this function was called and use that to keep it from\n            // starting the main loop multiple times.\n            started = true;\n\n            // In the main loop, draw() is called after update(), so if we\n            // entered the main loop immediately, we would never render the\n            // initial state before any updates occur. Instead, we run one\n            // frame where all we do is draw, and then start the main loop with\n            // the next frame.\n            rafHandle = requestAnimationFrame(function(timestamp) {\n                // Render the initial state before any updates occur.\n                draw(1);\n\n                // The application isn't considered \"running\" until the\n                // application starts drawing.\n                running = true;\n\n                // Reset variables that are used for tracking time so that we\n                // don't simulate time passed while the application was paused.\n                lastFrameTimeMs = timestamp;\n                lastFpsUpdate = timestamp;\n                framesSinceLastFpsUpdate = 0;\n\n                // Start the main loop.\n                rafHandle = requestAnimationFrame(animate);\n            });\n        }\n        return this;\n    },\n\n    // … trimmed: 13-line doc comment (API documentation) …\n    stop: function() {\n        running = false;\n        started = false;\n        cancelAnimationFrame(rafHandle);\n        return this;\n    },\n\n    // … trimmed: 4 lines: isRunning() …\n};\n\n// … trimmed: 15-line doc comment (API documentation) …\nfunction animate(timestamp) {\n    // Run the loop again the next time the browser is ready to render.\n    // We set rafHandle immediately so that the next frame can be canceled\n    // during the current frame.\n    rafHandle = requestAnimationFrame(animate);\n\n    // Throttle the frame rate (if minFrameDelay is set to a non-zero value by\n    // `MainLoop.setMaxAllowedFPS()`).\n    if (timestamp < lastFrameTimeMs + minFrameDelay) {\n        return;\n    }\n\n    // frameDelta is the cumulative amount of in-app time that hasn't been\n    // simulated yet. Add the time since the last frame. We need to track total\n    // not-yet-simulated time (as opposed to just the time elapsed since the\n    // last frame) because not all actually elapsed time is guaranteed to be\n    // simulated each frame. See the comments below for details.\n    frameDelta += timestamp - lastFrameTimeMs;\n    lastFrameTimeMs = timestamp;\n\n    // Run any updates that are not dependent on time in the simulation. See\n    // `MainLoop.setBegin()` for additional details on how to use this.\n    begin(timestamp, frameDelta);\n\n    // Update the estimate of the frame rate, `fps`. Approximately every\n    // second, the number of frames that occurred in that second are included\n    // in an exponential moving average of all frames per second. This means\n    // that more recent seconds affect the estimated frame rate more than older\n    // seconds.\n    if (timestamp > lastFpsUpdate + fpsUpdateInterval) {\n        // Compute the new exponential moving average.\n        fps =\n            // Divide the number of frames since the last FPS update by the\n            // amount of time that has passed to get the mean frames per second\n            // over that period. This is necessary because slightly more than a\n            // second has likely passed since the last update.\n            fpsAlpha * framesSinceLastFpsUpdate * 1000 / (timestamp - lastFpsUpdate) +\n            (1 - fpsAlpha) * fps;\n\n        // Reset the frame counter and last-updated timestamp since their\n        // latest values have now been incorporated into the FPS estimate.\n        lastFpsUpdate = timestamp;\n        framesSinceLastFpsUpdate = 0;\n    }\n    // Count the current frame in the next frames-per-second update. This\n    // happens after the previous section because the previous section\n    // calculates the frames that occur up until `timestamp`, and `timestamp`\n    // refers to a time just before the current frame was delivered.\n    framesSinceLastFpsUpdate++;\n\n    // … trimmed: 59-line comment explaining why updates use a fixed timestep (see gafferongames.com 'Fix Your Timestep') …\n    numUpdateSteps = 0;\n    while (frameDelta >= simulationTimestep) {\n        update(simulationTimestep);\n        frameDelta -= simulationTimestep;\n\n        // … trimmed: 24-line comment: bail out after 240 updates to avoid a 'spiral of death' …\n        if (++numUpdateSteps >= 240) {\n            panic = true;\n            break;\n        }\n    }\n\n    // … trimmed: 18-line comment: always draw, passing how far we are between two updates …\n    draw(frameDelta / simulationTimestep);\n\n    // Run any updates that are not dependent on time in the simulation. See\n    // `MainLoop.setEnd()` for additional details on how to use this.\n    end(fps, panic);\n\n    panic = false;\n}\n\n// AMD support\nif (typeof define === 'function' && define.amd) {\n    define(root.MainLoop);\n}\n// CommonJS support\nelse if (typeof module === 'object' && module !== null && typeof module.exports === 'object') {\n    module.exports = root.MainLoop;\n}\n\n})(this);\n"
          }
        }
      ]
    }
  ]
};
