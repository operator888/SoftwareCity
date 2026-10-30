// Family: Anti-patterns. 7 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Anti-patterns"
  ],
  "patterns": [
    {
      "id": "god-object",
      "name": "God Object",
      "family": "Anti-patterns",
      "aka": [
        "God Class",
        "Blob",
        "The Manager class"
      ],
      "tagline": "One class knows everything and does everything, so every change goes through it.",
      "intent": "A God Object is a class that has collected many unrelated jobs: data, rules, I/O, UI updates and logging all live in one place. Everything else depends on it, so it is hard to read, hard to test and every edit risks breaking something far away. The fix is to split it along its responsibilities into small focused classes and let a thin coordinator wire them together.",
      "analogy": "An office where one person answers the phone, does the accounting, fixes the printer and signs every contract. Nothing happens while they are on holiday, and nobody else knows how anything works.",
      "cityShape": "In before/ one building towers over the district (game_manager.gd, shopManager.ts, ClinicManager.java): a dozen floors stacked on one plate with a roof full of antennas, and call pipes from every small neighbour converge on it. In after/ the same district is a row of short buildings of similar height; pipes run between specific floors instead of all landing on one tower.",
      "roles": [
        {
          "name": "God Object",
          "desc": "The oversized class that owns unrelated state and behaviour: data, rules, I/O, UI and logging."
        },
        {
          "name": "Dependents",
          "desc": "The many callers that reach into the God Object, even when they need just one of its features."
        },
        {
          "name": "Focused Classes",
          "desc": "The small classes extracted from it in after/, each with one reason to change."
        },
        {
          "name": "Coordinator",
          "desc": "A thin class or script in after/ that wires the focused classes together for one use case."
        }
      ],
      "whenToUse": [
        "A central 'Manager' or autoload exists, and adding a method there is always the quickest way to ship a feature.",
        "Fields get added for unrelated features (volume, score, save path) because 'everything already has access to it'.",
        "Nobody splits it because many files depend on it, which makes splitting look scarier every week."
      ],
      "pitfalls": [
        "List what the class does in one sentence per job; each 'and' is a candidate class (Cart, Pricing, Billing, SaveSystem).",
        "Move one responsibility at a time (Extract Class), keeping behaviour the same, and let callers depend only on the piece they use.",
        "Replace 'the manager updates the UI' with signals or events, so the data classes no longer need to know the screens."
      ],
      "related": [
        "single-responsibility",
        "coupling-cohesion",
        "facade",
        "observer",
        "shotgun-surgery"
      ],
      "quiz": [
        {
          "q": "Which sign most strongly suggests a God Object?",
          "options": [
            "A class with many lines of comments",
            "A class whose methods change for unrelated reasons (prices, emails, stock, logging)",
            "A class with a constructor that takes no parameters",
            "A class that is used in only one place"
          ],
          "answer": 1,
          "why": "Size alone is not the problem; mixing many unrelated reasons to change in one class is. That is a violation of the Single Responsibility Principle."
        },
        {
          "q": "In the refactored Godot demo, why does the HUD connect to signals instead of ScoreKeeper calling the HUD?",
          "options": [
            "Signals are faster than function calls",
            "So ScoreKeeper does not need to know any UI node paths and can be reused or tested alone",
            "Because autoloads cannot call functions",
            "To make the HUD a singleton"
          ],
          "answer": 1,
          "why": "With signals the data owner only announces changes. The UI depends on the data, not the other way round, so the dependency arrows stop pointing into one hub."
        }
      ],
      "demos": [
        {
          "id": "god-object-gd-autoload",
          "title": "The GameManager autoload",
          "lang": "GDScript",
          "level": "beginner",
          "source": null,
          "story": "A Godot platformer whose GameManager autoload handles score, lives, saving, sound, pause and the HUD. In after/ it becomes ScoreKeeper, Lives, SaveSystem, Sfx and a HUD that listens to signals.",
          "roles": {
            "God Object": [
              "god-object-gd-autoload/before/game_manager.gd"
            ],
            "Dependents": [
              "god-object-gd-autoload/before/coin.gd",
              "god-object-gd-autoload/before/enemy.gd",
              "god-object-gd-autoload/before/pause_menu.gd"
            ],
            "Focused Classes": [
              "god-object-gd-autoload/after/score_keeper.gd",
              "god-object-gd-autoload/after/lives.gd",
              "god-object-gd-autoload/after/save_system.gd",
              "god-object-gd-autoload/after/sfx.gd"
            ],
            "Coordinator": [
              "god-object-gd-autoload/after/hud.gd#_ready"
            ]
          },
          "trace": [
            {
              "at": "god-object-gd-autoload/before/coin.gd#_on_body_entered",
              "say": "A coin is picked up. It calls GameManager twice: once for the counter, once for the sound. Small scripts all lean on the big one."
            },
            {
              "at": "god-object-gd-autoload/before/game_manager.gd#add_coin",
              "say": "add_coin() changes coins, lives, plays a sound and redraws the HUD. Four jobs in five lines."
            },
            {
              "at": "god-object-gd-autoload/before/game_manager.gd#update_hud",
              "say": "The manager knows the HUD's node paths. Rename a label and the score code breaks."
            },
            {
              "at": "god-object-gd-autoload/before/game_manager.gd#add_score",
              "say": "Scoring also saves to disk. Nobody would look here when the save file is wrong."
            },
            {
              "at": "god-object-gd-autoload/after/score_keeper.gd#add_coin",
              "say": "After: ScoreKeeper only counts and emits signals. It has no idea a HUD or a save file exists."
            },
            {
              "at": "god-object-gd-autoload/after/lives.gd#gain_life",
              "say": "Lives listens for extra_life_earned. The bonus rule lives with the coin counter, the life count lives here."
            },
            {
              "at": "god-object-gd-autoload/after/hud.gd#_ready",
              "say": "The HUD subscribes to what it shows. Each signal handler is one line, and only this script knows the node paths."
            },
            {
              "at": "god-object-gd-autoload/after/save_system.gd#_on_score_changed",
              "say": "Saving is its own autoload. Compare the cities: five short buildings replace one tall tower."
            }
          ],
          "files": {
            "god-object-gd-autoload/after/coin.gd": "extends Area2D\n\nfunc _on_body_entered(_body: Node2D) -> void:\n\tScoreKeeper.add_coin()\n\tSfx.play_sound(\"coin\")\n\tqueue_free()\n",
            "god-object-gd-autoload/after/enemy.gd": "extends CharacterBody2D\n\nfunc _on_stomped() -> void:\n\tScoreKeeper.add_points(100)\n\tSfx.play_sound(\"stomp\")\n\tqueue_free()\n\nfunc _on_hit_player() -> void:\n\tLives.lose_life()\n\tSfx.play_sound(\"hurt\")\n",
            "god-object-gd-autoload/after/hud.gd": "extends CanvasLayer\n\n# The HUD listens; nobody else needs to know its node paths.\n\nfunc _ready() -> void:\n\tScoreKeeper.score_changed.connect(_on_score_changed)\n\tScoreKeeper.coins_changed.connect(_on_coins_changed)\n\tLives.lives_changed.connect(_on_lives_changed)\n\tLives.ran_out.connect(_on_ran_out)\n\nfunc _on_score_changed(score: int) -> void:\n\t$Score.text = str(score)\n\nfunc _on_coins_changed(coins: int) -> void:\n\t$Coins.text = \"x %d\" % coins\n\nfunc _on_lives_changed(lives: int) -> void:\n\t$Lives.text = \"♥ %d\" % lives\n\nfunc _on_ran_out() -> void:\n\tget_tree().paused = true\n\t$GameOver.show()\n",
            "god-object-gd-autoload/after/lives.gd": "extends Node\n\n# Autoload \"Lives\": counts lives and says when they run out.\n\nsignal lives_changed(lives: int)\nsignal ran_out\n\nvar lives := 3\n\nfunc _ready() -> void:\n\tScoreKeeper.extra_life_earned.connect(gain_life)\n\nfunc gain_life() -> void:\n\tlives += 1\n\tlives_changed.emit(lives)\n\nfunc lose_life() -> void:\n\tlives -= 1\n\tlives_changed.emit(lives)\n\tif lives <= 0:\n\t\tran_out.emit()\n",
            "god-object-gd-autoload/after/save_system.gd": "extends Node\n\n# Autoload \"SaveSystem\": the only script that touches the save file.\n\nconst PATH := \"user://save.json\"\n\nvar data := {\"high_score\": 0, \"level\": 1, \"volume\": 0.8}\n\nfunc _ready() -> void:\n\tload_data()\n\tScoreKeeper.score_changed.connect(_on_score_changed)\n\nfunc _on_score_changed(score: int) -> void:\n\tif score > data[\"high_score\"]:\n\t\tdata[\"high_score\"] = score\n\t\twrite()\n\nfunc load_data() -> void:\n\tif FileAccess.file_exists(PATH):\n\t\tdata.merge(JSON.parse_string(FileAccess.get_file_as_string(PATH)), true)\n\nfunc write() -> void:\n\tvar file := FileAccess.open(PATH, FileAccess.WRITE)\n\tfile.store_string(JSON.stringify(data))\n",
            "god-object-gd-autoload/after/score_keeper.gd": "extends Node\n\n# Autoload \"ScoreKeeper\": only points and coins. It announces changes\n# with signals instead of poking the HUD itself.\n\nsignal score_changed(score: int)\nsignal coins_changed(coins: int)\nsignal extra_life_earned\n\nvar score := 0\nvar coins := 0\n\nfunc add_points(points: int) -> void:\n\tscore += points\n\tscore_changed.emit(score)\n\nfunc add_coin() -> void:\n\tcoins += 1\n\tif coins >= 100:\n\t\tcoins = 0\n\t\textra_life_earned.emit()\n\tcoins_changed.emit(coins)\n",
            "god-object-gd-autoload/after/sfx.gd": "extends AudioStreamPlayer\n\n# Autoload \"Sfx\": plays one-shot sounds by name.\n\nfunc play_sound(sound_name: String) -> void:\n\tstream = load(\"res://sfx/%s.wav\" % sound_name)\n\tplay()\n",
            "god-object-gd-autoload/before/coin.gd": "extends Area2D\n\n# Even a coin has to know the whole GameManager.\n\nfunc _on_body_entered(_body: Node2D) -> void:\n\tGameManager.add_coin()\n\tGameManager.play_sfx(\"coin\")\n\tqueue_free()\n",
            "god-object-gd-autoload/before/enemy.gd": "extends CharacterBody2D\n\nfunc _on_stomped() -> void:\n\tGameManager.add_score(100)\n\tGameManager.play_sfx(\"stomp\")\n\tqueue_free()\n\nfunc _on_hit_player() -> void:\n\tGameManager.lose_life()\n\nfunc _on_reached_goal() -> void:\n\tGameManager.next_level()\n",
            "god-object-gd-autoload/before/game_manager.gd": "extends Node\n\n# Autoload \"GameManager\". It started as a score counter.\n# Every new feature was \"just one more function\" in here.\n\nvar score := 0\nvar coins := 0\nvar lives := 3\nvar high_score := 0\nvar music_volume := 0.8\nvar is_paused := false\nvar current_level := 1\nvar hud: CanvasLayer\nvar sfx_player: AudioStreamPlayer\n\nfunc add_score(points: int) -> void:\n\tscore += points\n\tif score > high_score:\n\t\thigh_score = score\n\t\tsave_game()\n\tupdate_hud()\n\nfunc add_coin() -> void:\n\tcoins += 1\n\tif coins >= 100:\n\t\tcoins = 0\n\t\tlives += 1\n\t\tplay_sfx(\"extra_life\")\n\tupdate_hud()\n\nfunc lose_life() -> void:\n\tlives -= 1\n\tplay_sfx(\"hurt\")\n\tupdate_hud()\n\tif lives <= 0:\n\t\tgame_over()\n\nfunc game_over() -> void:\n\tsave_game()\n\tis_paused = true\n\tget_tree().paused = true\n\thud.get_node(\"GameOver\").show()\n\nfunc next_level() -> void:\n\tcurrent_level += 1\n\tsave_game()\n\tget_tree().change_scene_to_file(\"res://levels/level_%d.tscn\" % current_level)\n\nfunc toggle_pause() -> void:\n\tis_paused = not is_paused\n\tget_tree().paused = is_paused\n\thud.get_node(\"PauseMenu\").visible = is_paused\n\nfunc set_music_volume(value: float) -> void:\n\tmusic_volume = value\n\tAudioServer.set_bus_volume_db(1, linear_to_db(value))\n\tsave_game()\n\nfunc play_sfx(sound_name: String) -> void:\n\tsfx_player.stream = load(\"res://sfx/%s.wav\" % sound_name)\n\tsfx_player.play()\n\nfunc update_hud() -> void:\n\thud.get_node(\"Score\").text = str(score)\n\thud.get_node(\"Coins\").text = \"x %d\" % coins\n\thud.get_node(\"Lives\").text = \"♥ %d\" % lives\n\nfunc save_game() -> void:\n\tvar file := FileAccess.open(\"user://save.json\", FileAccess.WRITE)\n\tfile.store_string(JSON.stringify({\"high_score\": high_score, \"level\": current_level, \"volume\": music_volume}))\n\nfunc load_game() -> void:\n\tif not FileAccess.file_exists(\"user://save.json\"):\n\t\treturn\n\tvar data = JSON.parse_string(FileAccess.get_file_as_string(\"user://save.json\"))\n\thigh_score = data[\"high_score\"]\n\tcurrent_level = data[\"level\"]\n\tmusic_volume = data[\"volume\"]\n",
            "god-object-gd-autoload/before/pause_menu.gd": "extends Control\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"pause\"):\n\t\tGameManager.toggle_pause()\n\nfunc _on_volume_slider_value_changed(value: float) -> void:\n\tGameManager.set_music_volume(value)\n"
          }
        },
        {
          "id": "god-object-ts-shop",
          "title": "ShopManager in a web shop",
          "lang": "TypeScript",
          "level": "intermediate",
          "source": null,
          "story": "Every page of a small web shop imports one ShopManager that holds the cart, coupons, shipping, payment, email, stock and logs. The after/ version splits it into Cart, Pricing, Inventory, gateways and a CheckoutService.",
          "roles": {
            "God Object": [
              "god-object-ts-shop/before/shopManager.ts#ShopManager"
            ],
            "Dependents": [
              "god-object-ts-shop/before/productPage.ts#onAddClicked",
              "god-object-ts-shop/before/checkoutPage.ts#onPayClicked",
              "god-object-ts-shop/before/adminPage.ts#onRestock"
            ],
            "Focused Classes": [
              "god-object-ts-shop/after/cart.ts#Cart",
              "god-object-ts-shop/after/pricing.ts#Pricing",
              "god-object-ts-shop/after/inventory.ts#Inventory",
              "god-object-ts-shop/after/gateways.ts#PaymentGateway",
              "god-object-ts-shop/after/gateways.ts#Mailer"
            ],
            "Coordinator": [
              "god-object-ts-shop/after/checkoutService.ts#CheckoutService"
            ]
          },
          "trace": [
            {
              "at": "god-object-ts-shop/before/checkoutPage.ts#onPayClicked",
              "say": "The checkout page imports the shared shop instance. So do the product page and the admin page: three arcs into one file."
            },
            {
              "at": "god-object-ts-shop/before/shopManager.ts#ShopManager.checkout",
              "say": "checkout() prices, charges a card over HTTP, edits stock, sends mail, resets the cart and logs. Test it and you need a fake payment server."
            },
            {
              "at": "god-object-ts-shop/before/shopManager.ts#ShopManager.sendConfirmation",
              "say": "Email HTML sits next to shipping rules. A designer's change and a tax change land in the same file and collide in review."
            },
            {
              "at": "god-object-ts-shop/before/shopManager.ts#ShopManager.restock",
              "say": "Admin-only stock features also live here, so the storefront ships code it never uses."
            },
            {
              "at": "god-object-ts-shop/after/pricing.ts#Pricing.total",
              "say": "After: pricing is pure. It takes a Cart and returns a number, so a unit test needs no network at all."
            },
            {
              "at": "god-object-ts-shop/after/checkoutService.ts#CheckoutService.placeOrder",
              "say": "The order flow reads like a recipe: total, charge, take stock, mail, clear. Each step is one call to a focused class."
            },
            {
              "at": "god-object-ts-shop/after/gateways.ts#PaymentGateway.charge",
              "say": "HTTP lives only at the edge. Swap PaymentGateway for a fake in tests without touching Cart or Pricing."
            }
          ],
          "files": {
            "god-object-ts-shop/after/cart.ts": "// Cart: only knows which items the customer picked.\n\nexport interface CartLine { sku: string; name: string; price: number; qty: number; }\n\nexport class Cart {\n  lines: CartLine[] = [];\n\n  add(sku: string, name: string, price: number): void {\n    const line = this.lines.find(l => l.sku === sku);\n    if (line) line.qty++;\n    else this.lines.push({ sku, name, price, qty: 1 });\n  }\n\n  remove(sku: string): void {\n    this.lines = this.lines.filter(l => l.sku !== sku);\n  }\n\n  subtotal(): number {\n    return this.lines.reduce((sum, l) => sum + l.price * l.qty, 0);\n  }\n\n  clear(): void {\n    this.lines = [];\n  }\n}\n",
            "god-object-ts-shop/after/checkoutPage.ts": "import { Cart } from './cart';\nimport { Pricing } from './pricing';\nimport { Inventory } from './inventory';\nimport { PaymentGateway, Mailer } from './gateways';\nimport { CheckoutService } from './checkoutService';\n\nconst cart = new Cart();\nconst pricing = new Pricing();\nconst inventory = new Inventory();\nconst checkout = new CheckoutService(cart, pricing, inventory, new PaymentGateway(), new Mailer());\n\nexport function onAddClicked(sku: string, name: string, price: number): void {\n  if (!inventory.has(sku)) throw new Error('Out of stock');\n  cart.add(sku, name, price);\n}\n\nexport async function onPayClicked(email: string, cardToken: string, country: string): Promise<string> {\n  const total = pricing.total(cart, country);\n  const orderId = await checkout.placeOrder(email, cardToken, country);\n  return 'Paid ' + total + ' EUR, order ' + orderId;\n}\n",
            "god-object-ts-shop/after/checkoutService.ts": "import { Cart } from './cart';\nimport { Pricing } from './pricing';\nimport { Inventory } from './inventory';\nimport { PaymentGateway, Mailer } from './gateways';\n\n// CheckoutService coordinates the small classes. It owns the order flow, nothing else.\nexport class CheckoutService {\n  constructor(\n    private cart: Cart,\n    private pricing: Pricing,\n    private inventory: Inventory,\n    private payments: PaymentGateway,\n    private mailer: Mailer,\n  ) {}\n\n  async placeOrder(email: string, cardToken: string, country: string): Promise<string> {\n    const amount = this.pricing.total(this.cart, country);\n    await this.payments.charge(cardToken, amount);\n    this.inventory.take(this.cart.lines);\n    const orderId = 'ord_' + Date.now();\n    await this.mailer.sendConfirmation(email, orderId, this.cart.lines, amount);\n    this.cart.clear();\n    return orderId;\n  }\n}\n",
            "god-object-ts-shop/after/gateways.ts": "import { CartLine } from './cart';\n\n// Talking to the outside world lives at the edge, behind two tiny classes.\n\nexport class PaymentGateway {\n  async charge(cardToken: string, amount: number): Promise<void> {\n    const res = await fetch('https://pay.example.com/charge', { method: 'POST', body: JSON.stringify({ cardToken, amount }) });\n    if (!res.ok) throw new Error('Payment failed');\n  }\n}\n\nexport class Mailer {\n  async sendConfirmation(email: string, orderId: string, lines: CartLine[], amount: number): Promise<void> {\n    const items = lines.map(l => '<li>' + l.qty + ' x ' + l.name + '</li>').join('');\n    const html = '<h1>Thanks!</h1><p>Order ' + orderId + '</p><ul>' + items + '</ul><p>Total: ' + amount + ' EUR</p>';\n    await fetch('https://mail.example.com/send', { method: 'POST', body: JSON.stringify({ to: email, html }) });\n  }\n}\n",
            "god-object-ts-shop/after/inventory.ts": "import { CartLine } from './cart';\n\nexport class Inventory {\n  private stock: Record<string, number> = {};\n\n  has(sku: string): boolean {\n    return (this.stock[sku] ?? 0) > 0;\n  }\n\n  take(lines: CartLine[]): void {\n    for (const l of lines) this.stock[l.sku] -= l.qty;\n  }\n\n  restock(sku: string, qty: number): void {\n    this.stock[sku] = (this.stock[sku] ?? 0) + qty;\n  }\n\n  lowStock(): string[] {\n    return Object.keys(this.stock).filter(sku => this.stock[sku] < 5);\n  }\n}\n",
            "god-object-ts-shop/after/pricing.ts": "import { Cart } from './cart';\n\n// Pricing: coupons and shipping rules, no I/O at all, so it is easy to test.\n\nconst COUPONS: Record<string, number> = { WELCOME10: 10, VIP20: 20 };\n\nexport class Pricing {\n  private couponPercent = 0;\n\n  applyCoupon(code: string): boolean {\n    if (!(code in COUPONS)) return false;\n    this.couponPercent = COUPONS[code];\n    return true;\n  }\n\n  shipping(subtotal: number, country: string): number {\n    if (subtotal > 50) return 0;\n    if (country === 'DE') return 4.9;\n    if (country === 'AT' || country === 'CH') return 9.9;\n    return 14.9;\n  }\n\n  total(cart: Cart, country: string): number {\n    const sub = cart.subtotal();\n    const discounted = sub * (1 - this.couponPercent / 100);\n    return Math.round((discounted + this.shipping(sub, country)) * 100) / 100;\n  }\n}\n",
            "god-object-ts-shop/before/adminPage.ts": "import { shop } from './shopManager';\n\nexport function onRestock(sku: string, qty: number): string[] {\n  shop.restock(sku, qty);\n  return shop.lowStockReport();\n}\n",
            "god-object-ts-shop/before/checkoutPage.ts": "import { shop } from './shopManager';\n\nexport function onCouponEntered(code: string): string {\n  return shop.applyCoupon(code) ? 'Coupon applied' : 'Unknown coupon';\n}\n\nexport async function onPayClicked(email: string, cardToken: string, country: string): Promise<string> {\n  const total = shop.total(country);\n  const orderId = await shop.checkout(email, cardToken, country);\n  return 'Paid ' + total + ' EUR, order ' + orderId;\n}\n",
            "god-object-ts-shop/before/productPage.ts": "import { shop } from './shopManager';\n\nexport function onAddClicked(sku: string, name: string, price: number): string {\n  shop.addToCart(sku, name, price);\n  return shop.renderCartHtml();\n}\n",
            "god-object-ts-shop/before/shopManager.ts": "// ShopManager: \"the class that runs the shop\". Every page imports it,\n// and every new feature request ended up as another method here.\n\nexport interface LineItem { sku: string; name: string; price: number; qty: number; }\n\nexport class ShopManager {\n  private lines: LineItem[] = [];\n  private couponPercent = 0;\n  private stock: Record<string, number> = {};\n  private log: string[] = [];\n\n  addToCart(sku: string, name: string, price: number): void {\n    if ((this.stock[sku] ?? 0) <= 0) throw new Error('Out of stock');\n    const line = this.lines.find(l => l.sku === sku);\n    if (line) line.qty++;\n    else this.lines.push({ sku, name, price, qty: 1 });\n    this.logEvent('add ' + sku);\n  }\n\n  removeFromCart(sku: string): void {\n    this.lines = this.lines.filter(l => l.sku !== sku);\n    this.logEvent('remove ' + sku);\n  }\n\n  applyCoupon(code: string): boolean {\n    if (code === 'WELCOME10') this.couponPercent = 10;\n    else if (code === 'VIP20') this.couponPercent = 20;\n    else return false;\n    this.logEvent('coupon ' + code);\n    return true;\n  }\n\n  subtotal(): number {\n    return this.lines.reduce((sum, l) => sum + l.price * l.qty, 0);\n  }\n\n  shipping(country: string): number {\n    const sub = this.subtotal();\n    if (sub > 50) return 0;\n    if (country === 'DE') return 4.9;\n    if (country === 'AT' || country === 'CH') return 9.9;\n    return 14.9;\n  }\n\n  total(country: string): number {\n    const discounted = this.subtotal() * (1 - this.couponPercent / 100);\n    return Math.round((discounted + this.shipping(country)) * 100) / 100;\n  }\n\n  async checkout(email: string, cardToken: string, country: string): Promise<string> {\n    const amount = this.total(country);\n    const res = await fetch('https://pay.example.com/charge', { method: 'POST', body: JSON.stringify({ cardToken, amount }) });\n    if (!res.ok) {\n      this.logEvent('payment failed');\n      throw new Error('Payment failed');\n    }\n    for (const l of this.lines) this.stock[l.sku] -= l.qty;\n    const orderId = 'ord_' + Date.now();\n    await this.sendConfirmation(email, orderId, amount);\n    this.lines = [];\n    this.couponPercent = 0;\n    this.logEvent('order ' + orderId);\n    return orderId;\n  }\n\n  async sendConfirmation(email: string, orderId: string, amount: number): Promise<void> {\n    const html = '<h1>Thanks!</h1><p>Order ' + orderId + '</p>' + this.renderCartHtml() + '<p>Total: ' + amount + ' EUR</p>';\n    await fetch('https://mail.example.com/send', { method: 'POST', body: JSON.stringify({ to: email, html }) });\n  }\n\n  renderCartHtml(): string {\n    return '<ul>' + this.lines.map(l => '<li>' + l.qty + ' x ' + l.name + '</li>').join('') + '</ul>';\n  }\n\n  restock(sku: string, qty: number): void {\n    this.stock[sku] = (this.stock[sku] ?? 0) + qty;\n    this.logEvent('restock ' + sku);\n  }\n\n  lowStockReport(): string[] {\n    return Object.keys(this.stock).filter(sku => this.stock[sku] < 5);\n  }\n\n  logEvent(msg: string): void {\n    this.log.push(new Date().toISOString() + ' ' + msg);\n  }\n}\n\nexport const shop = new ShopManager();\n"
          }
        },
        {
          "id": "god-object-java-clinic",
          "title": "ClinicManager backend",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "A medical practice backend where ClinicManager stores patients as String arrays, books slots, bills insurers, sends SMS and writes reports. The refactor splits it into PatientRegistry, AppointmentBook, Billing and SmsNotifier, used by two small use-case classes.",
          "roles": {
            "God Object": [
              "god-object-java-clinic/before/ClinicManager.java#ClinicManager"
            ],
            "Dependents": [
              "god-object-java-clinic/before/ReceptionDesk.java#ReceptionDesk",
              "god-object-java-clinic/before/NightlyJob.java#NightlyJob"
            ],
            "Focused Classes": [
              "god-object-java-clinic/after/PatientRegistry.java#PatientRegistry",
              "god-object-java-clinic/after/AppointmentBook.java#AppointmentBook",
              "god-object-java-clinic/after/Billing.java#Billing",
              "god-object-java-clinic/after/SmsNotifier.java#SmsNotifier"
            ],
            "Coordinator": [
              "god-object-java-clinic/after/FrontDesk.java#FrontDesk",
              "god-object-java-clinic/after/ReminderJob.java#ReminderJob"
            ]
          },
          "trace": [
            {
              "at": "god-object-java-clinic/before/ReceptionDesk.java#ReceptionDesk.newPatientVisit",
              "say": "Reception registers, books and charges, all through one manager. Its constructor asks for the whole clinic."
            },
            {
              "at": "god-object-java-clinic/before/ClinicManager.java#ClinicManager.book",
              "say": "book() checks double bookings, opening hours, sends an SMS and writes an audit line. Calendar logic and messaging are glued together."
            },
            {
              "at": "god-object-java-clinic/before/ClinicManager.java#ClinicManager.charge",
              "say": "Billing reads patients.get(id)[2], a String array index. Only the God Object knows what slot 2 means."
            },
            {
              "at": "god-object-java-clinic/before/NightlyJob.java#NightlyJob.run",
              "say": "The cron job needs reminders, yet it depends on every feature. Any edit to ClinicManager forces it to be retested."
            },
            {
              "at": "god-object-java-clinic/after/AppointmentBook.java#AppointmentBook.book",
              "say": "After: the calendar rules fit in a few lines, and putIfAbsent makes the double-booking check one call."
            },
            {
              "at": "god-object-java-clinic/after/Billing.java#Billing.patientShare",
              "say": "The insurer share is a switch over an enum instead of string compares on an array slot."
            },
            {
              "at": "god-object-java-clinic/after/FrontDesk.java#FrontDesk.newPatientVisit",
              "say": "FrontDesk is a thin coordinator: register, book, charge, notify. It holds four small collaborators, not one giant."
            },
            {
              "at": "god-object-java-clinic/after/ReminderJob.java#ReminderJob.run",
              "say": "The nightly job now depends only on the calendar, the registry and SMS. Smaller dependencies, smaller blast radius."
            }
          ],
          "files": {
            "god-object-java-clinic/after/AppointmentBook.java": "package clinic.refactored;\n\nimport java.time.LocalDateTime;\nimport java.util.*;\n\n// Owns the calendar rules: opening hours and double bookings.\npublic class AppointmentBook {\n    private final Map<LocalDateTime, String> slots = new TreeMap<>();\n\n    public boolean book(String patientId, LocalDateTime slot) {\n        if (slot.getHour() < 8 || slot.getHour() >= 18) {\n            return false;\n        }\n        return slots.putIfAbsent(slot, patientId) == null;\n    }\n\n    public boolean cancel(String patientId, LocalDateTime slot) {\n        return slots.remove(slot, patientId);\n    }\n\n    public Map<LocalDateTime, String> onDay(LocalDateTime day) {\n        Map<LocalDateTime, String> out = new TreeMap<>();\n        for (Map.Entry<LocalDateTime, String> e : slots.entrySet()) {\n            if (e.getKey().toLocalDate().equals(day.toLocalDate())) {\n                out.put(e.getKey(), e.getValue());\n            }\n        }\n        return out;\n    }\n}\n",
            "god-object-java-clinic/after/Billing.java": "package clinic.refactored;\n\nimport java.util.HashMap;\nimport java.util.Map;\n\n// Money rules only: who pays which share.\npublic class Billing {\n    private final Map<String, Double> openBalance = new HashMap<>();\n\n    public double patientShare(PatientRegistry.Insurer insurer) {\n        switch (insurer) {\n            case PUBLIC: return 0.1;\n            case PRIVATE: return 1.0;\n            default: return 0.5;\n        }\n    }\n\n    public void charge(PatientRegistry.Patient p, double amount) {\n        openBalance.merge(p.id(), amount * patientShare(p.insurer()), Double::sum);\n    }\n\n    public double totalOpen() {\n        return openBalance.values().stream().mapToDouble(Double::doubleValue).sum();\n    }\n}\n",
            "god-object-java-clinic/after/FrontDesk.java": "package clinic.refactored;\n\nimport java.time.LocalDateTime;\n\n// The use case \"a new patient comes in\" coordinates three small services.\npublic class FrontDesk {\n    private final PatientRegistry registry;\n    private final AppointmentBook book;\n    private final Billing billing;\n    private final SmsNotifier sms;\n\n    public FrontDesk(PatientRegistry registry, AppointmentBook book, Billing billing, SmsNotifier sms) {\n        this.registry = registry;\n        this.book = book;\n        this.billing = billing;\n        this.sms = sms;\n    }\n\n    public String newPatientVisit(PatientRegistry.Patient p, LocalDateTime slot) {\n        registry.register(p);\n        if (!book.book(p.id(), slot)) {\n            return \"Slot not available\";\n        }\n        billing.charge(p, 60.0);\n        sms.send(p, \"Your appointment: \" + slot);\n        return \"Booked\";\n    }\n}\n",
            "god-object-java-clinic/after/PatientRegistry.java": "package clinic.refactored;\n\nimport java.util.HashMap;\nimport java.util.Map;\n\n// Knows patients and nothing else.\npublic class PatientRegistry {\n    public record Patient(String id, String name, String phone, Insurer insurer) {}\n\n    public enum Insurer { PUBLIC, PRIVATE, OTHER }\n\n    private final Map<String, Patient> byId = new HashMap<>();\n\n    public void register(Patient p) {\n        if (byId.putIfAbsent(p.id(), p) != null) {\n            throw new IllegalStateException(\"Patient exists: \" + p.id());\n        }\n    }\n\n    public Patient find(String id) {\n        return byId.get(id);\n    }\n\n    public int count() {\n        return byId.size();\n    }\n}\n",
            "god-object-java-clinic/after/ReminderJob.java": "package clinic.refactored;\n\nimport java.time.LocalDateTime;\nimport java.util.Map;\n\n// The nightly job now depends only on what it uses.\npublic class ReminderJob {\n    private final AppointmentBook book;\n    private final PatientRegistry registry;\n    private final SmsNotifier sms;\n\n    public ReminderJob(AppointmentBook book, PatientRegistry registry, SmsNotifier sms) {\n        this.book = book;\n        this.registry = registry;\n        this.sms = sms;\n    }\n\n    public void run() {\n        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);\n        for (Map.Entry<LocalDateTime, String> e : book.onDay(tomorrow).entrySet()) {\n            sms.send(registry.find(e.getValue()), \"Reminder: tomorrow at \" + e.getKey().toLocalTime());\n        }\n    }\n}\n",
            "god-object-java-clinic/after/SmsNotifier.java": "package clinic.refactored;\n\nimport java.util.ArrayList;\nimport java.util.List;\n\n// Sends text messages. Swap it for a real SMS provider without touching the rest.\npublic class SmsNotifier {\n    private final List<String> outbox = new ArrayList<>();\n\n    public void send(PatientRegistry.Patient p, String text) {\n        outbox.add(p.phone() + \": \" + text);\n    }\n\n    public int sentCount() {\n        return outbox.size();\n    }\n}\n",
            "god-object-java-clinic/before/ClinicManager.java": "package clinic;\n\nimport java.time.LocalDateTime;\nimport java.util.*;\n\n// ClinicManager: patients, calendar, billing, reminders and reports in one class.\n// 1,800 lines in the real-life version of this story; trimmed to the shape here.\npublic class ClinicManager {\n    private final Map<String, String[]> patients = new HashMap<>();\n    private final Map<String, List<LocalDateTime>> appointments = new HashMap<>();\n    private final Map<String, Double> openBalance = new HashMap<>();\n    private final List<String> smsOutbox = new ArrayList<>();\n    private final List<String> auditLog = new ArrayList<>();\n\n    public void registerPatient(String id, String name, String phone, String insurer) {\n        if (patients.containsKey(id)) {\n            throw new IllegalStateException(\"Patient exists: \" + id);\n        }\n        patients.put(id, new String[] { name, phone, insurer });\n        audit(\"registered \" + id);\n    }\n\n    public boolean book(String patientId, LocalDateTime slot) {\n        for (List<LocalDateTime> taken : appointments.values()) {\n            if (taken.contains(slot)) {\n                return false;\n            }\n        }\n        if (slot.getHour() < 8 || slot.getHour() >= 18) {\n            return false;\n        }\n        appointments.computeIfAbsent(patientId, k -> new ArrayList<>()).add(slot);\n        sendSms(patientId, \"Your appointment: \" + slot);\n        audit(\"booked \" + patientId + \" \" + slot);\n        return true;\n    }\n\n    public void cancel(String patientId, LocalDateTime slot) {\n        appointments.getOrDefault(patientId, new ArrayList<>()).remove(slot);\n        if (slot.minusHours(24).isBefore(LocalDateTime.now())) {\n            charge(patientId, 25.0);\n        }\n        sendSms(patientId, \"Cancelled: \" + slot);\n        audit(\"cancelled \" + patientId);\n    }\n\n    public void charge(String patientId, double amount) {\n        String insurer = patients.get(patientId)[2];\n        double share = insurer.equals(\"PUBLIC\") ? 0.1 : insurer.equals(\"PRIVATE\") ? 1.0 : 0.5;\n        openBalance.merge(patientId, amount * share, Double::sum);\n        audit(\"charged \" + patientId + \" \" + amount * share);\n    }\n\n    public void sendSms(String patientId, String text) {\n        String phone = patients.get(patientId)[1];\n        smsOutbox.add(phone + \": \" + text);\n    }\n\n    public void sendTomorrowReminders() {\n        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);\n        for (Map.Entry<String, List<LocalDateTime>> e : appointments.entrySet()) {\n            for (LocalDateTime slot : e.getValue()) {\n                if (slot.toLocalDate().equals(tomorrow.toLocalDate())) {\n                    sendSms(e.getKey(), \"Reminder: tomorrow at \" + slot.toLocalTime());\n                }\n            }\n        }\n    }\n\n    public String monthlyReport() {\n        StringBuilder sb = new StringBuilder(\"Patients: \" + patients.size() + \"\\n\");\n        double total = 0;\n        for (double b : openBalance.values()) {\n            total += b;\n        }\n        sb.append(\"Open balance: \").append(total).append(\"\\n\");\n        sb.append(\"SMS sent: \").append(smsOutbox.size());\n        return sb.toString();\n    }\n\n    private void audit(String line) {\n        auditLog.add(LocalDateTime.now() + \" \" + line);\n    }\n}\n",
            "god-object-java-clinic/before/NightlyJob.java": "package clinic;\n\n// The cron job only needs reminders and a report, but it gets the whole manager.\npublic class NightlyJob {\n    private final ClinicManager manager;\n\n    public NightlyJob(ClinicManager manager) {\n        this.manager = manager;\n    }\n\n    public void run() {\n        manager.sendTomorrowReminders();\n        System.out.println(manager.monthlyReport());\n    }\n}\n",
            "god-object-java-clinic/before/ReceptionDesk.java": "package clinic;\n\nimport java.time.LocalDateTime;\n\n// The reception screen talks to the ClinicManager for everything.\npublic class ReceptionDesk {\n    private final ClinicManager manager;\n\n    public ReceptionDesk(ClinicManager manager) {\n        this.manager = manager;\n    }\n\n    public String newPatientVisit(String id, String name, String phone, String insurer, LocalDateTime slot) {\n        manager.registerPatient(id, name, phone, insurer);\n        boolean ok = manager.book(id, slot);\n        if (ok) {\n            manager.charge(id, 60.0);\n        }\n        return ok ? \"Booked\" : \"Slot not available\";\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "spaghetti-code",
      "name": "Spaghetti Code",
      "family": "Anti-patterns",
      "aka": [
        "Big ball of mud (at small scale)",
        "Flag soup"
      ],
      "tagline": "Control flow and shared state are so tangled that you cannot follow one thread.",
      "intent": "Spaghetti code has no clear structure: functions jump into each other in surprising orders, global variables and boolean flags carry hidden meaning, and the same concern (validation, I/O, output) is scattered through deep nested ifs. The repair is to give the code a visible shape: a straight top-to-bottom flow, small functions that take inputs and return outputs, and explicit state instead of flag combinations.",
      "analogy": "A drawer of tangled cables: to unplug the lamp you pull one cable and the router, the phone charger and the speaker come with it. Labelled cables in a cable tray let you take out exactly one.",
      "cityShape": "In before/ look for a thick floor glowing orange (guard.gd's _physics_process, order.php's handle_order_page) or a cluster of floors whose data pipes loop up to roof antennas (the globals and flags) and back down into many floors. In after/ the district is a calm row of small, cool-blue floors, data stays inside functions, and the call pipes form a tree that fans out from one entry point (main, handle, _physics_process).",
      "roles": [
        {
          "name": "Tangled Flow",
          "desc": "Functions that call each other in a surprising order and mix several concerns in nested branches."
        },
        {
          "name": "Shared Mutable State",
          "desc": "Globals and boolean flags that many functions read and write, so the meaning depends on call order."
        },
        {
          "name": "Untangled Steps",
          "desc": "Small functions or classes in after/ that each do one step and pass data explicitly."
        },
        {
          "name": "Driver",
          "desc": "The single entry point in after/ that runs the steps top to bottom."
        }
      ],
      "whenToUse": [
        "A script is extended with 'one more if' for each new requirement, without ever restructuring.",
        "Globals and boolean flags are added to pass information between functions instead of parameters and return values.",
        "Validation, database access, business rules and output are written inline in one place because it was quickest the first time."
      ],
      "pitfalls": [
        "Draw the flow on paper, then make the code look like the drawing: one entry point that calls named steps in order.",
        "Replace globals with parameters and return values, and replace combinations of bool flags with one explicit state (an enum).",
        "Separate the layers: parsing/validation, pure calculations, storage, and output each in their own function or class."
      ],
      "related": [
        "state",
        "pure-functions",
        "single-responsibility",
        "kiss-yagni",
        "god-object"
      ],
      "quiz": [
        {
          "q": "The guard script has is_chasing, is_attacking and is_patrolling as separate bools. What is the core problem?",
          "options": [
            "Bools use too much memory",
            "Impossible combinations (chasing AND patrolling) can happen, and every branch must check several flags",
            "GDScript does not support bools well",
            "Flags cannot be exported to the inspector"
          ],
          "answer": 1,
          "why": "Three bools allow eight combinations, but only a few are valid. One enum state makes invalid combinations impossible and gives each state one function."
        },
        {
          "q": "Why does the refactored grades script return lists from functions instead of updating globals?",
          "options": [
            "Returning values is required by Python",
            "Each function can then be read, tested and reused on its own, and the order of calls is visible in main()",
            "Globals are slower to access",
            "It makes the file shorter"
          ],
          "answer": 1,
          "why": "When data flows through parameters and return values, a function's behaviour depends only on its inputs. You no longer need to know what ran before it."
        }
      ],
      "demos": [
        {
          "id": "spaghetti-code-py-grades",
          "title": "Class grades script",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A small script reads test scores from a CSV and prints a report. In before/ six globals and a mode flag steer the flow; in after/ parsing, stats and formatting are separate and main() reads top to bottom.",
          "roles": {
            "Tangled Flow": [
              "spaghetti-code-py-grades/before/grades.py#read_file",
              "spaghetti-code-py-grades/before/grades.py#handle_line",
              "spaghetti-code-py-grades/before/grades.py#finish"
            ],
            "Shared Mutable State": [
              "spaghetti-code-py-grades/before/grades.py#total",
              "spaghetti-code-py-grades/before/grades.py#had_error",
              "spaghetti-code-py-grades/before/grades.py#mode"
            ],
            "Untangled Steps": [
              "spaghetti-code-py-grades/after/parsing.py#read_scores",
              "spaghetti-code-py-grades/after/stats.py#average",
              "spaghetti-code-py-grades/after/report.py#report_lines"
            ],
            "Driver": [
              "spaghetti-code-py-grades/after/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "spaghetti-code-py-grades/before/grades.py#start",
              "say": "start() sets the global mode, then hands over to read_file. You already need to remember a flag to understand what comes next."
            },
            {
              "at": "spaghetti-code-py-grades/before/grades.py#read_file",
              "say": "Reading the file also decides when to finish. If had_error was set anywhere, the report silently never prints."
            },
            {
              "at": "spaghetti-code-py-grades/before/grades.py#handle_line",
              "say": "One line updates four globals, prints for bad scores, and checks mode to print leaders mid-read. Parsing, stats and output in one place."
            },
            {
              "at": "spaghetti-code-py-grades/before/grades.py#print_report",
              "say": "print_report() resets total to 0 as a side effect. Call it twice and the second average is wrong."
            },
            {
              "at": "spaghetti-code-py-grades/after/main.py#main",
              "say": "After: main() shows the whole story in order: read, check empty, then either top or report. No globals."
            },
            {
              "at": "spaghetti-code-py-grades/after/parsing.py#read_scores",
              "say": "read_scores() turns a file into a list. Bad lines are skipped in one place, parse_line, which returns None."
            },
            {
              "at": "spaghetti-code-py-grades/after/report.py#report_lines",
              "say": "Formatting returns lines instead of printing, so it is easy to test and the caller chooses the output."
            }
          ],
          "files": {
            "spaghetti-code-py-grades/after/main.py": "# The flow reads top to bottom: parse arguments, read, compute, print.\nimport sys\nfrom .parsing import read_scores\nfrom .stats import top_student\nfrom .report import report_lines\n\n\ndef main(argv):\n    path = argv[1]\n    show_top = \"--top\" in argv[2:]\n    try:\n        scores = read_scores(path)\n    except FileNotFoundError:\n        print(\"file not found\")\n        return 1\n    if not scores:\n        print(\"no students\")\n        return 0\n    if show_top:\n        name, score = top_student(scores)\n        print(\"top:\", name, score)\n    else:\n        print(\"\\n\".join(report_lines(scores)))\n    return 0\n\n\nif __name__ == \"__main__\":\n    sys.exit(main(sys.argv))\n",
            "spaghetti-code-py-grades/after/parsing.py": "# Turning text into data. No printing, no globals: input in, list out.\n\n\ndef parse_line(line):\n    parts = line.strip().split(\",\")\n    if len(parts) != 2 or not parts[1].strip().isdigit():\n        return None\n    return parts[0].strip(), int(parts[1])\n\n\ndef read_scores(path):\n    scores = []\n    with open(path) as f:\n        for line in f:\n            row = parse_line(line)\n            if row is not None:\n                scores.append(row)\n    return scores\n",
            "spaghetti-code-py-grades/after/report.py": "# Formatting only: builds lines of text, the caller decides where they go.\nfrom .stats import average\n\n\ndef report_lines(scores):\n    avg = average(scores)\n    lines = []\n    for name, score in scores:\n        mark = \"*\" if score > avg else \"\"\n        lines.append(f\"{name} {score} {mark}\".rstrip())\n    lines.append(f\"average: {avg:.1f}\")\n    return lines\n",
            "spaghetti-code-py-grades/after/stats.py": "# Calculations only. Each function gets what it needs as an argument.\n\n\ndef average(scores):\n    return sum(score for _, score in scores) / len(scores)\n\n\ndef top_student(scores):\n    return max(scores, key=lambda row: row[1])\n",
            "spaghetti-code-py-grades/before/grades.py": "# grades.py: reads a CSV of test scores and prints a class report.\n# It grew one \"quick fix\" at a time. Follow the flow and see where it jumps.\nimport sys\n\nstudents = []\ntotal = 0\ncount = 0\nbest = None\nhad_error = False\nmode = \"report\"\n\n\ndef start():\n    global mode\n    if len(sys.argv) > 2 and sys.argv[2] == \"--top\":\n        mode = \"top\"\n    read_file(sys.argv[1])\n\n\ndef read_file(path):\n    global had_error\n    try:\n        for line in open(path):\n            handle_line(line)\n    except FileNotFoundError:\n        had_error = True\n        print(\"file not found\")\n    if not had_error:\n        finish()\n\n\ndef handle_line(line):\n    global total, count, best, had_error\n    parts = line.strip().split(\",\")\n    if len(parts) != 2:\n        had_error = True\n        return\n    name, score = parts[0], parts[1]\n    if not score.isdigit():\n        print(\"bad score for\", name)\n        return\n    score = int(score)\n    students.append((name, score))\n    total += score\n    count += 1\n    if best is None or score > best[1]:\n        best = (name, score)\n        if mode == \"top\":\n            print(\"new leader:\", name)\n\n\ndef finish():\n    if count == 0:\n        print(\"no students\")\n        return\n    if mode == \"top\":\n        print(\"top:\", best[0], best[1])\n        return\n    print_report()\n\n\ndef print_report():\n    global total\n    avg = total / count\n    for name, score in students:\n        mark = \"*\" if score > avg else \"\"\n        print(name, score, mark)\n    print(\"average:\", round(avg, 1))\n    total = 0\n\n\nstart()\n"
          }
        },
        {
          "id": "spaghetti-code-gd-guard",
          "title": "Patrolling guard with flag soup",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A Godot guard enemy patrols, chases, attacks, gets stunned and gives up. The before/ version juggles six bools and three timers in one _physics_process; the after/ version uses one State enum and one small function per state.",
          "roles": {
            "Tangled Flow": [
              "spaghetti-code-gd-guard/before/guard.gd#_physics_process"
            ],
            "Shared Mutable State": [
              "spaghetti-code-gd-guard/before/guard.gd#is_chasing",
              "spaghetti-code-gd-guard/before/guard.gd#gave_up",
              "spaghetti-code-gd-guard/before/guard.gd#was_alerted"
            ],
            "Untangled Steps": [
              "spaghetti-code-gd-guard/after/guard.gd#patrol",
              "spaghetti-code-gd-guard/after/guard.gd#chase",
              "spaghetti-code-gd-guard/after/guard.gd#attack",
              "spaghetti-code-gd-guard/after/guard.gd#give_up"
            ],
            "Driver": [
              "spaghetti-code-gd-guard/after/guard.gd#_physics_process"
            ]
          },
          "trace": [
            {
              "at": "spaghetti-code-gd-guard/before/guard.gd#_physics_process",
              "say": "One thick orange floor holds the whole AI. To know what the guard does now you must evaluate six bools in your head."
            },
            {
              "at": "spaghetti-code-gd-guard/before/guard.gd#stun",
              "say": "stun() clears two flags but forgets is_chasing. After the stun, chase and patrol code can both run in the same frame."
            },
            {
              "at": "spaghetti-code-gd-guard/before/guard.gd#_forgive",
              "say": "A timer callback resets gave_up five seconds later, from outside the main flow. Another hidden path that edits the flags."
            },
            {
              "at": "spaghetti-code-gd-guard/after/guard.gd#_physics_process",
              "say": "After: one match on state. Exactly one branch runs per frame, so impossible combinations cannot happen."
            },
            {
              "at": "spaghetti-code-gd-guard/after/guard.gd#enter",
              "say": "Every state change goes through enter(), which also sets the timer and animation. One place to log or debug transitions."
            },
            {
              "at": "spaghetti-code-gd-guard/after/guard.gd#chase",
              "say": "chase() only answers: attack, give up, or keep running? The rules for one state sit together on one small floor."
            },
            {
              "at": "spaghetti-code-gd-guard/after/guard.gd#stun",
              "say": "stun() is a single call to enter(). The trap.gd caller did not change at all; only the inside got its shape back."
            }
          ],
          "files": {
            "spaghetti-code-gd-guard/after/guard.gd": "extends CharacterBody2D\n\n# Same guard with one explicit state. Each state has its own small function,\n# and the only place states change is enter().\n\nenum State { PATROL, CHASE, ATTACK, STUNNED, GIVE_UP }\n\n@export var player: Node2D\nvar speed := 60.0\nvar state := State.PATROL\nvar timer := 0.0\nvar dir := 1\n\nfunc _physics_process(delta: float) -> void:\n\ttimer -= delta\n\tmatch state:\n\t\tState.PATROL:\n\t\t\tpatrol()\n\t\tState.CHASE:\n\t\t\tchase(delta)\n\t\tState.ATTACK:\n\t\t\tattack()\n\t\tState.STUNNED:\n\t\t\tstunned()\n\t\tState.GIVE_UP:\n\t\t\tgive_up()\n\tmove_and_slide()\n\nfunc enter(new_state: State, duration := 0.0) -> void:\n\tstate = new_state\n\ttimer = duration\n\t$Sprite.play(State.keys()[new_state].to_lower())\n\nfunc distance_to_player() -> float:\n\treturn global_position.distance_to(player.global_position)\n\nfunc patrol() -> void:\n\tvelocity.x = dir * speed\n\tif is_on_wall():\n\t\tdir = -dir\n\tif distance_to_player() < 200:\n\t\tenter(State.CHASE, 3.0)\n\nfunc chase(_delta: float) -> void:\n\tvar dist := distance_to_player()\n\tif dist < 30:\n\t\tenter(State.ATTACK, 0.6)\n\telif dist > 300 and timer <= 0:\n\t\tenter(State.GIVE_UP, 5.0)\n\telse:\n\t\tif dist <= 300:\n\t\t\ttimer = 3.0\n\t\tvelocity.x = sign(player.global_position.x - global_position.x) * speed * 2\n\nfunc attack() -> void:\n\tvelocity.x = 0\n\tif timer <= 0:\n\t\tif distance_to_player() < 30:\n\t\t\tplayer.hurt(10)\n\t\tenter(State.CHASE, 3.0)\n\nfunc stunned() -> void:\n\tvelocity.x = 0\n\tif timer <= 0:\n\t\tenter(State.PATROL)\n\nfunc give_up() -> void:\n\tvelocity.x = dir * speed\n\tif is_on_wall():\n\t\tdir = -dir\n\tif timer <= 0:\n\t\tenter(State.PATROL)\n\nfunc stun(seconds: float) -> void:\n\tenter(State.STUNNED, seconds)\n",
            "spaghetti-code-gd-guard/after/trap.gd": "extends Area2D\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.has_method(\"stun\"):\n\t\tbody.stun(2.0)\n",
            "spaghetti-code-gd-guard/before/guard.gd": "extends CharacterBody2D\n\n# A patrolling guard. Every bug fix added a bool; now the bools fight each other.\n\n@export var player: Node2D\nvar speed := 60.0\nvar is_patrolling := true\nvar is_chasing := false\nvar is_attacking := false\nvar is_stunned := false\nvar was_alerted := false\nvar gave_up := false\nvar stun_timer := 0.0\nvar attack_timer := 0.0\nvar lost_timer := 0.0\nvar dir := 1\n\nfunc _physics_process(delta: float) -> void:\n\tif is_stunned:\n\t\tstun_timer -= delta\n\t\tif stun_timer <= 0:\n\t\t\tis_stunned = false\n\t\t\tif was_alerted:\n\t\t\t\tis_chasing = true\n\t\t\telse:\n\t\t\t\tis_patrolling = true\n\t\treturn\n\tvar dist := global_position.distance_to(player.global_position)\n\tif dist < 200 and not gave_up:\n\t\tis_patrolling = false\n\t\tis_chasing = true\n\t\twas_alerted = true\n\t\tlost_timer = 0\n\tif is_chasing and not is_attacking:\n\t\tif dist < 30:\n\t\t\tis_attacking = true\n\t\t\tattack_timer = 0.6\n\t\t\t$Sprite.play(\"attack\")\n\t\telif dist > 300:\n\t\t\tlost_timer += delta\n\t\t\tif lost_timer > 3:\n\t\t\t\tis_chasing = false\n\t\t\t\tgave_up = true\n\t\t\t\tis_patrolling = true\n\t\t\t\tget_tree().create_timer(5).timeout.connect(_forgive)\n\t\telse:\n\t\t\tvelocity.x = sign(player.global_position.x - global_position.x) * speed * 2\n\t\t\t$Sprite.play(\"run\")\n\tif is_attacking:\n\t\tattack_timer -= delta\n\t\tvelocity.x = 0\n\t\tif attack_timer <= 0:\n\t\t\tis_attacking = false\n\t\t\tif dist < 30:\n\t\t\t\tplayer.hurt(10)\n\tif is_patrolling and not is_chasing:\n\t\tvelocity.x = dir * speed\n\t\t$Sprite.play(\"walk\")\n\t\tif is_on_wall():\n\t\t\tdir = -dir\n\tmove_and_slide()\n\nfunc _forgive() -> void:\n\tgave_up = false\n\twas_alerted = false\n\nfunc stun(seconds: float) -> void:\n\tis_stunned = true\n\tis_attacking = false\n\tis_patrolling = false\n\tstun_timer = seconds\n",
            "spaghetti-code-gd-guard/before/trap.gd": "extends Area2D\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.has_method(\"stun\"):\n\t\tbody.stun(2.0)\n"
          }
        },
        {
          "id": "spaghetti-code-php-orders",
          "title": "Legacy PHP order page",
          "lang": "PHP",
          "level": "advanced",
          "source": null,
          "story": "A classic order form handler: SQL built from strings, globals shared with a helpers file, discounts computed mid-loop and HTML echoed in between. The after/ version has a request object, a repository, a pure price calculator, templates and a controller with one straight path.",
          "roles": {
            "Tangled Flow": [
              "spaghetti-code-php-orders/before/order.php#handle_order_page",
              "spaghetti-code-php-orders/before/functions.php#apply_bulk_discount"
            ],
            "Shared Mutable State": [
              "spaghetti-code-php-orders/before/functions.php#save_order",
              "spaghetti-code-php-orders/before/functions.php#check_customer"
            ],
            "Untangled Steps": [
              "spaghetti-code-php-orders/after/OrderRequest.php#OrderRequest",
              "spaghetti-code-php-orders/after/OrderRepository.php#OrderRepository",
              "spaghetti-code-php-orders/after/PriceCalculator.php#PriceCalculator"
            ],
            "Driver": [
              "spaghetti-code-php-orders/after/OrderController.php#OrderController.handle"
            ]
          },
          "trace": [
            {
              "at": "spaghetti-code-php-orders/before/order.php#handle_order_page",
              "say": "Five nesting levels mix validation, SQL, pricing, newsletter sign-up, mail and HTML. The only shared language is four globals."
            },
            {
              "at": "spaghetti-code-php-orders/before/functions.php#check_customer",
              "say": "A helper reports problems by appending to global $errors. You cannot tell from the call site that it changes anything."
            },
            {
              "at": "spaghetti-code-php-orders/before/functions.php#apply_bulk_discount",
              "say": "The discount reads global $total while the loop is still adding to it, so the +20 bonus depends on product order."
            },
            {
              "at": "spaghetti-code-php-orders/before/functions.php#save_order",
              "say": "SQL is glued from $_POST strings (an injection hole) and depends on globals set earlier. Reorder two lines upstream and it breaks."
            },
            {
              "at": "spaghetti-code-php-orders/after/OrderRequest.php#OrderRequest.fromPost",
              "say": "After: the raw form becomes a typed, read-only object once. Nothing later touches $_POST."
            },
            {
              "at": "spaghetti-code-php-orders/after/OrderController.php#OrderController.handle",
              "say": "handle() reads like a checklist: request, errors, lines, total, save, mail, render. Each step returns a value."
            },
            {
              "at": "spaghetti-code-php-orders/after/PriceCalculator.php#PriceCalculator.orderTotal",
              "say": "Pricing is pure: totals in, total out. The +20 bonus now applies once, after all lines are known."
            },
            {
              "at": "spaghetti-code-php-orders/after/OrderRepository.php#OrderRepository.save",
              "say": "All writes use prepared statements inside one transaction. Storage is one cool building, not sprinkled through the page."
            }
          ],
          "files": {
            "spaghetti-code-php-orders/after/OrderController.php": "<?php\n// One straight path: read request, check, price, save, notify, render.\nrequire_once 'OrderRequest.php';\nrequire_once 'OrderRepository.php';\nrequire_once 'PriceCalculator.php';\n\nfinal class OrderController\n{\n    public function __construct(private OrderRepository $orders, private PriceCalculator $prices)\n    {\n    }\n\n    public function handle(array $post): string\n    {\n        if (!$post) {\n            return $this->render('form', ['errors' => []]);\n        }\n        $req = OrderRequest::fromPost($post);\n        $errors = $req->errors();\n        $lines = [];\n        foreach ($req->quantities as $productId => $qty) {\n            $product = $this->orders->product($productId);\n            if ($product['stock'] < $qty) {\n                $errors[] = \"Only {$product['stock']} left of product $productId\";\n            }\n            $lines[] = $this->prices->lineTotal($product['price'], $qty);\n        }\n        if ($errors) {\n            return $this->render('form', ['errors' => $errors]);\n        }\n        $total = $this->prices->orderTotal($lines);\n        $orderId = $this->orders->save($req, $total);\n        mail($req->email, \"Order #$orderId\", 'Total: ' . number_format($total, 2));\n        return $this->render('confirmation', ['orderId' => $orderId, 'total' => $total]);\n    }\n\n    private function render(string $view, array $vars): string\n    {\n        extract($vars);\n        ob_start();\n        include __DIR__ . \"/views/$view.php\";\n        return ob_get_clean();\n    }\n}\n",
            "spaghetti-code-php-orders/after/OrderRepository.php": "<?php\n// All SQL in one place, with prepared statements instead of string concatenation.\n\nfinal class OrderRepository\n{\n    public function __construct(private PDO $db)\n    {\n    }\n\n    public function product(int $id): array\n    {\n        $stmt = $this->db->prepare('SELECT id, price, stock FROM products WHERE id = ?');\n        $stmt->execute([$id]);\n        return $stmt->fetch();\n    }\n\n    public function save(OrderRequest $req, float $total): int\n    {\n        $this->db->beginTransaction();\n        $this->db->prepare('INSERT INTO orders (name, email, total) VALUES (?, ?, ?)')->execute([$req->name, $req->email, $total]);\n        $id = (int) $this->db->lastInsertId();\n        $dec = $this->db->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');\n        foreach ($req->quantities as $productId => $qty) {\n            $dec->execute([$qty, $productId]);\n        }\n        if ($req->newsletter) {\n            $this->db->prepare('INSERT INTO newsletter (email) VALUES (?)')->execute([$req->email]);\n        }\n        $this->db->commit();\n        return $id;\n    }\n}\n",
            "spaghetti-code-php-orders/after/OrderRequest.php": "<?php\n// The posted form, read and validated once. Everything after this works with clean data.\n\nfinal class OrderRequest\n{\n    public function __construct(\n        public readonly string $name,\n        public readonly string $email,\n        public readonly array $quantities,\n        public readonly bool $newsletter,\n    ) {\n    }\n\n    public static function fromPost(array $post): self\n    {\n        $qty = array_filter(array_map('intval', $post['qty'] ?? []), fn ($q) => $q > 0);\n        return new self(trim($post['name'] ?? ''), trim($post['email'] ?? ''), $qty, ($post['newsletter'] ?? '') === 'yes');\n    }\n\n    public function errors(): array\n    {\n        $errors = [];\n        if ($this->name === '') {\n            $errors[] = 'Name is required';\n        }\n        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {\n            $errors[] = 'Email looks wrong';\n        }\n        if (!$this->quantities) {\n            $errors[] = 'Your cart is empty';\n        }\n        return $errors;\n    }\n}\n",
            "spaghetti-code-php-orders/after/PriceCalculator.php": "<?php\n// Pure pricing rules: same input, same output, no globals, easy to unit test.\n\nfinal class PriceCalculator\n{\n    public function lineTotal(float $price, int $qty): float\n    {\n        $sum = $price * $qty;\n        return $qty >= 10 ? $sum * 0.95 : $sum;\n    }\n\n    public function orderTotal(array $lineTotals): float\n    {\n        $total = array_sum($lineTotals);\n        return $total > 500 ? $total - 20 : $total;\n    }\n}\n",
            "spaghetti-code-php-orders/after/index.php": "<?php\n// Front controller: builds the objects and hands the request over.\nrequire_once 'OrderController.php';\n\nfunction run_order_page(): void\n{\n    $db = new PDO('mysql:host=localhost;dbname=shop', 'shop', 'secret');\n    $controller = new OrderController(new OrderRepository($db), new PriceCalculator());\n    echo $controller->handle($_SERVER['REQUEST_METHOD'] === 'POST' ? $_POST : []);\n}\n\nrun_order_page();\n",
            "spaghetti-code-php-orders/after/views/confirmation.php": "<h1>Thank you!</h1>\n<p>Order #<?= (int) $orderId ?>, total <?= number_format($total, 2) ?> EUR</p>\n",
            "spaghetti-code-php-orders/after/views/form.php": "<?php foreach ($errors as $e): ?>\n  <p class=\"error\"><?= htmlspecialchars($e) ?></p>\n<?php endforeach; ?>\n<form method=\"post\"><!-- the order form markup --></form>\n",
            "spaghetti-code-php-orders/before/functions.php": "<?php\n// Helpers that read and write the page's globals. Call order matters, silently.\n\nfunction check_customer()\n{\n    global $errors;\n    if (empty($_POST['name'])) {\n        $errors[] = \"Name is required\";\n    }\n    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {\n        $errors[] = \"Email looks wrong\";\n    }\n}\n\nfunction apply_bulk_discount($lineTotal)\n{\n    global $discount, $total;\n    $discount += $lineTotal * 0.05;\n    if ($total > 500) {\n        $discount += 20;\n    }\n}\n\nfunction save_order()\n{\n    global $db, $total, $discount;\n    $db->exec(\"INSERT INTO orders (name, email, total) VALUES ('\" . $_POST['name'] . \"', '\" . $_POST['email'] . \"', \" . ($total - $discount) . \")\");\n    foreach ($_POST['qty'] as $productId => $qty) {\n        $db->exec(\"UPDATE products SET stock = stock - \" . (int)$qty . \" WHERE id = \" . (int)$productId);\n    }\n    return $db->lastInsertId();\n}\n\nfunction show_form()\n{\n    global $errors;\n    foreach ($errors as $e) {\n        echo \"<p class='error'>$e</p>\";\n    }\n    echo \"<form method='post'><!-- 80 lines of inline HTML in the real file --></form>\";\n}\n",
            "spaghetti-code-php-orders/before/order.php": "<?php\n// order.php: the form posts here. Validation, SQL, discounts, mail and HTML\n// are interleaved, and helpers in functions.php talk back through globals.\nrequire 'functions.php';\n\n$db = new PDO('mysql:host=localhost;dbname=shop', 'shop', 'secret');\n$errors = [];\n$total = 0;\n$discount = 0;\n\nfunction handle_order_page()\n{\n    global $db, $errors, $total, $discount;\n    if ($_SERVER['REQUEST_METHOD'] == 'POST') {\n        check_customer();\n        if (count($errors) == 0) {\n            foreach ($_POST['qty'] as $productId => $qty) {\n                if ($qty > 0) {\n                    $row = $db->query(\"SELECT price, stock FROM products WHERE id = \" . (int)$productId)->fetch();\n                    if ($row['stock'] < $qty) {\n                        $errors[] = \"Only {$row['stock']} left of product $productId\";\n                        continue;\n                    }\n                    $total += $row['price'] * $qty;\n                    if ($qty >= 10) {\n                        apply_bulk_discount($row['price'] * $qty);\n                    }\n                }\n            }\n            if ($total == 0 && count($errors) == 0) {\n                $errors[] = \"Your cart is empty\";\n            }\n        }\n        if (count($errors) == 0) {\n            $orderId = save_order();\n            echo \"<h1>Thank you!</h1><p>Order #$orderId, total \" . number_format($total - $discount, 2) . \" EUR</p>\";\n            if ($_POST['newsletter'] == 'yes') {\n                $db->exec(\"INSERT INTO newsletter (email) VALUES ('\" . $_POST['email'] . \"')\");\n            }\n            mail($_POST['email'], \"Order #$orderId\", \"Total: \" . ($total - $discount));\n            exit;\n        }\n    }\n    show_form();\n}\n\nhandle_order_page();\n"
          }
        }
      ]
    },
    {
      "id": "circular-dependency",
      "name": "Circular Dependency",
      "family": "Anti-patterns",
      "aka": [
        "Dependency cycle",
        "Import cycle",
        "Cyclic reference"
      ],
      "tagline": "Module A needs B and B needs A, so neither can be understood, built or tested alone.",
      "intent": "A circular dependency happens when two or more modules or classes depend on each other, directly or through a loop. They become one knot: you cannot load, reuse or test one without the other, imports break in surprising ways, and dependency injection needs hacks. The fix is to make arrows point one way, by moving the shared piece down into its own module, moving the rule that needs both up a level, or replacing a call-back with an event or a passed-in function.",
      "analogy": "Two people who each refuse to sign a contract until the other has signed first. Nothing moves until a third person (a notary) takes both signatures in order.",
      "cityShape": "In before/ look for import arcs that go both ways between two buildings (books.py and members.py, cartStore.ts with badge.ts and toast.ts, OrdersManager and CustomersManager), drawing a closed loop. In after/ every arc points one way: a top building (loans.py, main.ts, OrderService) sends arcs down to the others, and the bottom buildings send none back.",
      "roles": [
        {
          "name": "Cycle Members",
          "desc": "The modules or classes that depend on each other and form the loop."
        },
        {
          "name": "Workaround",
          "desc": "The trick that keeps the cycle running: imports inside functions, setter injection, late lookups."
        },
        {
          "name": "Lower Layer",
          "desc": "In after/: the independent piece the others depend on, which depends on nothing in the loop."
        },
        {
          "name": "Wiring Point",
          "desc": "In after/: the module at the top that knows both sides and connects them (a use case, main, a composition root)."
        }
      ],
      "whenToUse": [
        "A module needs 'just one function' from another module that already imports it, so a second import goes in the opposite direction.",
        "A data store or model calls the UI directly to refresh it, and the UI imports the store to read data.",
        "Two services each need a bit of the other's data; the DI container complains, so someone switches to property injection to make it compile."
      ],
      "pitfalls": [
        "Find the shared fact both sides need and extract it into a lower module that imports neither (OrderHistory, a plain books catalog).",
        "Move the rule that needs both sides one level up (loans.py, OrderService), so arrows only point down.",
        "Break 'model calls UI' loops with events, subscriptions or passed-in callbacks, so the lower layer never imports the higher one."
      ],
      "related": [
        "dependency-inversion",
        "observer",
        "coupling-cohesion",
        "dependency-injection",
        "clean-architecture"
      ],
      "quiz": [
        {
          "q": "Why does moving 'from .books import loans_of' inside a function make the Python error go away?",
          "options": [
            "It removes the cycle",
            "It delays the import until the function runs, when both modules are fully loaded; the cycle is only hidden",
            "Function-level imports are faster",
            "Python ignores imports inside functions"
          ],
          "answer": 1,
          "why": "The modules still depend on each other. The lazy import just avoids importing a half-initialised module at load time, so the knot remains and is harder to see."
        },
        {
          "q": "In the TypeScript cart, how does the store notify the badge without importing it?",
          "options": [
            "It calls window.location.reload()",
            "The badge registers a listener with subscribe(), and main.ts does the wiring",
            "The badge polls the store every second",
            "Both files are merged into one"
          ],
          "answer": 1,
          "why": "With a subscription the store only knows the listener type, not the badge. The arrow points from UI to store, and the loop is broken."
        }
      ],
      "demos": [
        {
          "id": "circular-dependency-py-library",
          "title": "Library books and members",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A tiny library app where books.py imports members.py and members.py imports books.py back, kept alive by imports inside functions. In after/ both modules import nothing, and a new loans.py holds the rules that need both.",
          "roles": {
            "Cycle Members": [
              "circular-dependency-py-library/before/books.py",
              "circular-dependency-py-library/before/members.py"
            ],
            "Workaround": [
              "circular-dependency-py-library/before/members.py#can_borrow",
              "circular-dependency-py-library/before/members.py#summary"
            ],
            "Lower Layer": [
              "circular-dependency-py-library/after/books.py",
              "circular-dependency-py-library/after/members.py"
            ],
            "Wiring Point": [
              "circular-dependency-py-library/after/loans.py"
            ]
          },
          "trace": [
            {
              "at": "circular-dependency-py-library/before/main.py#demo",
              "say": "The demo adds a book, a member, lends the book and prints a summary. Simple, but the two modules it uses are knotted."
            },
            {
              "at": "circular-dependency-py-library/before/books.py#lend_book",
              "say": "Lending lives in books.py and asks members.py whether the member may borrow: arc books -> members."
            },
            {
              "at": "circular-dependency-py-library/before/members.py#can_borrow",
              "say": "can_borrow() asks books.py how many loans exist: arc members -> books. The import hides inside the function to dodge a crash."
            },
            {
              "at": "circular-dependency-py-library/before/members.py#summary",
              "say": "summary() needs titles, so members reaches into books again. Neither file can be tested without the other."
            },
            {
              "at": "circular-dependency-py-library/after/books.py#loans_of",
              "say": "After: books.py only answers questions about books. It imports nothing, so it can be loaded and tested alone."
            },
            {
              "at": "circular-dependency-py-library/after/loans.py#lend_book",
              "say": "The rule that needs both sides moves up into loans.py. Both arcs now leave loans.py and point down."
            },
            {
              "at": "circular-dependency-py-library/after/main.py#demo",
              "say": "Same behaviour, but the module map is a tree: main -> loans -> books and members, and nothing points back."
            }
          ],
          "files": {
            "circular-dependency-py-library/after/books.py": "# books.py: the catalog knows titles and borrowers. It imports nothing from the app.\n\n_books = {}\n\n\ndef add_book(book_id, title):\n    _books[book_id] = {\"title\": title, \"borrower\": None}\n\n\ndef title_of(book_id):\n    return _books[book_id][\"title\"]\n\n\ndef is_available(book_id):\n    return _books[book_id][\"borrower\"] is None\n\n\ndef set_borrower(book_id, member_id):\n    _books[book_id][\"borrower\"] = member_id\n\n\ndef loans_of(member_id):\n    return [b for b, info in _books.items() if info[\"borrower\"] == member_id]\n",
            "circular-dependency-py-library/after/loans.py": "# loans.py: the rule that needs BOTH books and members lives one level above them.\n# Arrows now only point down: loans -> books, loans -> members. No cycle.\nfrom .books import is_available, loans_of, set_borrower, title_of\nfrom .members import limit_of, name_of, note_activity\n\n\ndef lend_book(book_id, member_id):\n    if not is_available(book_id):\n        return False\n    if len(loans_of(member_id)) >= limit_of(member_id):\n        return False\n    set_borrower(book_id, member_id)\n    note_activity(member_id)\n    return True\n\n\ndef summary(member_id):\n    titles = [title_of(b) for b in loans_of(member_id)]\n    return name_of(member_id) + \" has: \" + \", \".join(titles)\n",
            "circular-dependency-py-library/after/main.py": "from .books import add_book\nfrom .members import register\nfrom .loans import lend_book, summary\n\n\ndef demo():\n    add_book(\"b1\", \"Dune\")\n    register(\"m1\", \"Ada\", limit=1)\n    lend_book(\"b1\", \"m1\")\n    print(summary(\"m1\"))\n",
            "circular-dependency-py-library/after/members.py": "# members.py: members know their own data only. Also imports nothing from the app.\n\n_members = {}\n\n\ndef register(member_id, name, limit=3):\n    _members[member_id] = {\"name\": name, \"limit\": limit, \"last_seen\": None}\n\n\ndef name_of(member_id):\n    return _members[member_id][\"name\"]\n\n\ndef limit_of(member_id):\n    return _members[member_id][\"limit\"]\n\n\ndef note_activity(member_id):\n    _members[member_id][\"last_seen\"] = \"today\"\n",
            "circular-dependency-py-library/before/books.py": "# books.py: the catalog. It needed to check member limits, so it imported members...\nfrom .members import can_borrow, note_activity\n\n_books = {}\n\n\ndef add_book(book_id, title):\n    _books[book_id] = {\"title\": title, \"borrower\": None}\n\n\ndef title_of(book_id):\n    return _books[book_id][\"title\"]\n\n\ndef loans_of(member_id):\n    return [b for b, info in _books.items() if info[\"borrower\"] == member_id]\n\n\ndef lend_book(book_id, member_id):\n    if _books[book_id][\"borrower\"] is not None:\n        return False\n    if not can_borrow(member_id):\n        return False\n    _books[book_id][\"borrower\"] = member_id\n    note_activity(member_id)\n    return True\n",
            "circular-dependency-py-library/before/main.py": "from .books import add_book, lend_book\nfrom .members import register, summary\n\n\ndef demo():\n    add_book(\"b1\", \"Dune\")\n    register(\"m1\", \"Ada\", limit=1)\n    lend_book(\"b1\", \"m1\")\n    print(summary(\"m1\"))\n",
            "circular-dependency-py-library/before/members.py": "# members.py: ...and members needed book titles and loan counts, so it needs books.\n# A top-level \"from .books import loans_of\" crashes with \"partially initialized\n# module\", so the imports were tucked inside the functions. The cycle is still there.\n\n_members = {}\n\n\ndef register(member_id, name, limit=3):\n    _members[member_id] = {\"name\": name, \"limit\": limit, \"last_seen\": None}\n\n\ndef can_borrow(member_id):\n    from .books import loans_of\n    return len(loans_of(member_id)) < _members[member_id][\"limit\"]\n\n\ndef note_activity(member_id):\n    _members[member_id][\"last_seen\"] = \"today\"\n\n\ndef summary(member_id):\n    from .books import title_of, loans_of\n    titles = [title_of(b) for b in loans_of(member_id)]\n    return _members[member_id][\"name\"] + \" has: \" + \", \".join(titles)\n"
          }
        },
        {
          "id": "circular-dependency-ts-cart",
          "title": "Cart store that pokes the UI",
          "lang": "TypeScript",
          "level": "intermediate",
          "source": null,
          "story": "A shop's cart store calls the badge and toast directly, while the badge imports the store for the count and the toast imports it for Undo: two loops. The fix lets UI subscribe to store events and passes Undo in as a callback.",
          "roles": {
            "Cycle Members": [
              "circular-dependency-ts-cart/before/cartStore.ts",
              "circular-dependency-ts-cart/before/badge.ts",
              "circular-dependency-ts-cart/before/toast.ts"
            ],
            "Workaround": [
              "circular-dependency-ts-cart/before/toast.ts#showToast"
            ],
            "Lower Layer": [
              "circular-dependency-ts-cart/after/cartStore.ts"
            ],
            "Wiring Point": [
              "circular-dependency-ts-cart/after/main.ts#wireUi"
            ]
          },
          "trace": [
            {
              "at": "circular-dependency-ts-cart/before/cartStore.ts#addItem",
              "say": "Adding an item renders the badge and shows a toast. The store imports two UI files: data depends on screens."
            },
            {
              "at": "circular-dependency-ts-cart/before/badge.ts#renderBadge",
              "say": "The badge imports count() from the store. Store -> badge -> store: the first loop of arcs."
            },
            {
              "at": "circular-dependency-ts-cart/before/toast.ts#showToast",
              "say": "The toast's Undo calls undoLast() in the store: a second loop. Bundlers may now hand one file an undefined import."
            },
            {
              "at": "circular-dependency-ts-cart/after/cartStore.ts#addItem",
              "say": "After: the store pushes the item and emits an event. It has no imports at all."
            },
            {
              "at": "circular-dependency-ts-cart/after/cartStore.ts#emit",
              "say": "emit() calls whoever subscribed, with the new count. The store knows a listener type, not the badge."
            },
            {
              "at": "circular-dependency-ts-cart/after/main.ts#wireUi",
              "say": "main.ts is the one place that knows everybody, and it subscribes the badge and an announcer."
            },
            {
              "at": "circular-dependency-ts-cart/after/main.ts#announce",
              "say": "Undo is passed into showToast as a function. toast.ts imports nothing, so every arc now points away from main.ts."
            }
          ],
          "files": {
            "circular-dependency-ts-cart/after/badge.ts": "// The badge depends on the store's event type only. Arrow: badge -> store.\nimport { CartEvent } from './cartStore';\n\nexport function renderBadge(e: CartEvent): void {\n  const el = document.querySelector('#cart-badge')!;\n  el.textContent = String(e.count);\n  el.classList.toggle('empty', e.count === 0);\n}\n",
            "circular-dependency-ts-cart/after/cartStore.ts": "// cartStore.ts: the store imports nothing from the UI. It tells listeners\n// \"something changed\" and lets them decide what to draw.\n\nexport interface Item { id: string; name: string; price: number; }\nexport type CartEvent = { kind: 'added' | 'removed'; item: Item; count: number };\ntype Listener = (e: CartEvent) => void;\n\nconst items: Item[] = [];\nconst listeners: Listener[] = [];\n\nexport function subscribe(fn: Listener): void {\n  listeners.push(fn);\n}\n\nfunction emit(kind: 'added' | 'removed', item: Item): void {\n  for (const fn of listeners) fn({ kind, item, count: items.length });\n}\n\nexport function addItem(item: Item): void {\n  items.push(item);\n  emit('added', item);\n}\n\nexport function undoLast(): void {\n  const removed = items.pop();\n  if (removed) emit('removed', removed);\n}\n",
            "circular-dependency-ts-cart/after/main.ts": "// main.ts is the only place that knows everybody. It wires store events to UI.\nimport { addItem, undoLast, subscribe, CartEvent } from './cartStore';\nimport { renderBadge } from './badge';\nimport { showToast } from './toast';\n\nexport function wireUi(): void {\n  subscribe(renderBadge);\n  subscribe(announce);\n}\n\nfunction announce(e: CartEvent): void {\n  if (e.kind === 'added') showToast('Added ' + e.item.name, undoLast);\n  else showToast('Removed ' + e.item.name);\n}\n\nexport function onBuyClick(id: string, name: string, price: number): void {\n  addItem({ id, name, price });\n}\n",
            "circular-dependency-ts-cart/after/toast.ts": "// The toast gets the undo action passed in. It never imports the store.\n\nexport function showToast(text: string, onUndo?: () => void): void {\n  const el = document.createElement('div');\n  el.className = 'toast';\n  el.textContent = text;\n  if (onUndo) {\n    const undo = document.createElement('button');\n    undo.textContent = 'Undo';\n    undo.onclick = () => onUndo();\n    el.append(undo);\n  }\n  document.body.append(el);\n  setTimeout(() => el.remove(), 4000);\n}\n",
            "circular-dependency-ts-cart/before/badge.ts": "// ...and the badge imports the store to read the count. Store -> badge -> store.\nimport { count } from './cartStore';\n\nexport function renderBadge(): void {\n  const el = document.querySelector('#cart-badge')!;\n  el.textContent = String(count());\n  el.classList.toggle('empty', count() === 0);\n}\n",
            "circular-dependency-ts-cart/before/cartStore.ts": "// cartStore.ts: holds the cart. When it changes it pokes the UI directly,\n// so it imports the badge and the toast...\nimport { renderBadge } from './badge';\nimport { showToast } from './toast';\n\nexport interface CartItem { id: string; name: string; price: number; }\n\nconst items: CartItem[] = [];\n\nexport function addItem(item: CartItem): void {\n  items.push(item);\n  renderBadge();\n  showToast('Added ' + item.name);\n}\n\nexport function undoLast(): void {\n  const removed = items.pop();\n  renderBadge();\n  if (removed) showToast('Removed ' + removed.name);\n}\n\nexport function count(): number {\n  return items.length;\n}\n",
            "circular-dependency-ts-cart/before/main.ts": "import { addItem } from './cartStore';\n\nexport function onBuyClick(id: string, name: string, price: number): void {\n  addItem({ id, name, price });\n}\n",
            "circular-dependency-ts-cart/before/toast.ts": "// ...and the toast's Undo button calls back into the store. A second loop.\nimport { undoLast } from './cartStore';\n\nexport function showToast(text: string): void {\n  const el = document.createElement('div');\n  el.className = 'toast';\n  el.textContent = text;\n  const undo = document.createElement('button');\n  undo.textContent = 'Undo';\n  undo.onclick = () => undoLast();\n  el.append(undo);\n  document.body.append(el);\n  setTimeout(() => el.remove(), 4000);\n}\n"
          }
        },
        {
          "id": "circular-dependency-cs-loyalty",
          "title": "Orders and customers in a C# service",
          "lang": "C#",
          "level": "advanced",
          "source": null,
          "story": "OrdersManager needs discounts from CustomersManager, which needs total spend from OrdersManager. Setter injection hides the loop. In after/ the shared fact moves to OrderHistory, so plain constructor injection works bottom-up.",
          "roles": {
            "Cycle Members": [
              "circular-dependency-cs-loyalty/before/OrdersManager.cs#OrdersManager",
              "circular-dependency-cs-loyalty/before/CustomersManager.cs#CustomersManager"
            ],
            "Workaround": [
              "circular-dependency-cs-loyalty/before/Startup.cs#Startup.Build"
            ],
            "Lower Layer": [
              "circular-dependency-cs-loyalty/after/OrderHistory.cs#OrderHistory"
            ],
            "Wiring Point": [
              "circular-dependency-cs-loyalty/after/OrderService.cs#OrderService",
              "circular-dependency-cs-loyalty/after/CompositionRoot.cs#CompositionRoot"
            ]
          },
          "trace": [
            {
              "at": "circular-dependency-cs-loyalty/before/Startup.cs#Startup.Build",
              "say": "Neither class can be built first, so both are created empty and patched together with setters. Forget one line and you get a NullReferenceException."
            },
            {
              "at": "circular-dependency-cs-loyalty/before/OrdersManager.cs#OrdersManager.PlaceOrder",
              "say": "Placing an order calls into CustomersManager twice: once for the discount, once for points."
            },
            {
              "at": "circular-dependency-cs-loyalty/before/CustomersManager.cs#CustomersManager.GetDiscount",
              "say": "The discount depends on spend, which lives in OrdersManager. The has-arrows in the class diagram point both ways."
            },
            {
              "at": "circular-dependency-cs-loyalty/after/OrderHistory.cs#OrderHistory.TotalSpent",
              "say": "After: 'how much was spent' is its own class at the bottom. It depends on nothing, so both sides can use it."
            },
            {
              "at": "circular-dependency-cs-loyalty/after/CustomerTiers.cs#CustomerTiers.GetDiscount",
              "say": "Tiers read the history and never call ordering. One arrow, pointing down."
            },
            {
              "at": "circular-dependency-cs-loyalty/after/OrderService.cs#OrderService.PlaceOrder",
              "say": "The use case on top uses tiers and history. Same discount and points as before, but the graph is a tree."
            },
            {
              "at": "circular-dependency-cs-loyalty/after/CompositionRoot.cs#CompositionRoot.Build",
              "say": "Constructor injection works again: build history, then tiers, then the service. Every object is complete when it is born."
            }
          ],
          "files": {
            "circular-dependency-cs-loyalty/after/CompositionRoot.cs": "namespace Shop\n{\n    public static class CompositionRoot\n    {\n        // Plain constructor injection works again: build from the bottom up.\n        public static OrderService Build()\n        {\n            var history = new OrderHistory();\n            var tiers = new CustomerTiers(history);\n            return new OrderService(tiers, history);\n        }\n    }\n}\n",
            "circular-dependency-cs-loyalty/after/CustomerTiers.cs": "using System.Collections.Generic;\n\nnamespace Shop\n{\n    // Tiers read the history; they never call back into ordering.\n    public class CustomerTiers\n    {\n        private readonly OrderHistory history;\n        private readonly Dictionary<string, int> points = new();\n\n        public CustomerTiers(OrderHistory history)\n        {\n            this.history = history;\n        }\n\n        public decimal GetDiscount(string customerId)\n        {\n            decimal spent = history.TotalSpent(customerId);\n            if (spent > 1000m)\n            {\n                return 0.10m;\n            }\n            return spent > 200m ? 0.05m : 0m;\n        }\n\n        public void AddPoints(string customerId, decimal amount)\n        {\n            points[customerId] = points.GetValueOrDefault(customerId) + (int)amount;\n        }\n    }\n}\n",
            "circular-dependency-cs-loyalty/after/OrderHistory.cs": "using System.Collections.Generic;\nusing System.Linq;\n\nnamespace Shop\n{\n    // The fact both sides needed (\"what has this customer spent?\") moves into\n    // its own class at the bottom. It depends on nothing.\n    public class OrderHistory\n    {\n        private readonly List<(string CustomerId, decimal Amount)> orders = new();\n\n        public void Record(string customerId, decimal amount)\n        {\n            orders.Add((customerId, amount));\n        }\n\n        public decimal TotalSpent(string customerId)\n        {\n            return orders.Where(o => o.CustomerId == customerId).Sum(o => o.Amount);\n        }\n    }\n}\n",
            "circular-dependency-cs-loyalty/after/OrderService.cs": "namespace Shop\n{\n    // The use case sits on top and depends downward on both. Arrows form a tree.\n    public class OrderService\n    {\n        private readonly CustomerTiers tiers;\n        private readonly OrderHistory history;\n\n        public OrderService(CustomerTiers tiers, OrderHistory history)\n        {\n            this.tiers = tiers;\n            this.history = history;\n        }\n\n        public decimal PlaceOrder(string customerId, decimal subtotal)\n        {\n            decimal total = subtotal * (1 - tiers.GetDiscount(customerId));\n            history.Record(customerId, total);\n            tiers.AddPoints(customerId, total);\n            return total;\n        }\n    }\n}\n",
            "circular-dependency-cs-loyalty/before/CustomersManager.cs": "using System.Collections.Generic;\n\nnamespace Shop.Legacy\n{\n    // Customer tiers depend on how much was spent, so CustomersManager knows OrdersManager.\n    public class CustomersManager\n    {\n        public OrdersManager Orders { get; set; }\n\n        private readonly Dictionary<string, int> points = new();\n\n        public decimal GetDiscount(string customerId)\n        {\n            decimal spent = Orders.TotalSpent(customerId);\n            if (spent > 1000m)\n            {\n                return 0.10m;\n            }\n            return spent > 200m ? 0.05m : 0m;\n        }\n\n        public void AddPoints(string customerId, decimal amount)\n        {\n            points[customerId] = points.GetValueOrDefault(customerId) + (int)amount;\n        }\n\n        public int Points(string customerId)\n        {\n            return points.GetValueOrDefault(customerId);\n        }\n    }\n}\n",
            "circular-dependency-cs-loyalty/before/OrdersManager.cs": "using System.Collections.Generic;\nusing System.Linq;\n\nnamespace Shop.Legacy\n{\n    // Orders need the customer's discount, so OrdersManager knows CustomersManager.\n    public class OrdersManager\n    {\n        // Setter injection: the DI container cannot build two classes that need\n        // each other in their constructors, so the cycle is hidden in properties.\n        public CustomersManager Customers { get; set; }\n\n        private readonly List<(string CustomerId, decimal Amount)> orders = new();\n\n        public decimal PlaceOrder(string customerId, decimal subtotal)\n        {\n            decimal discount = Customers.GetDiscount(customerId);\n            decimal total = subtotal * (1 - discount);\n            orders.Add((customerId, total));\n            Customers.AddPoints(customerId, total);\n            return total;\n        }\n\n        public decimal TotalSpent(string customerId)\n        {\n            return orders.Where(o => o.CustomerId == customerId).Sum(o => o.Amount);\n        }\n    }\n}\n",
            "circular-dependency-cs-loyalty/before/Startup.cs": "namespace Shop.Legacy\n{\n    public static class Startup\n    {\n        // Half-built objects: until both setters run, either one crashes with a null reference.\n        public static OrdersManager Build()\n        {\n            var orders = new OrdersManager();\n            var customers = new CustomersManager();\n            orders.Customers = customers;\n            customers.Orders = orders;\n            return orders;\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "shotgun-surgery",
      "name": "Shotgun Surgery",
      "family": "Anti-patterns",
      "aka": [
        "Scattered change",
        "Change ripple"
      ],
      "tagline": "One small change forces you to edit many files, and missing one is a bug.",
      "intent": "Shotgun Surgery is the smell where a single idea (how prices are shown, what a weapon is, how customers are notified) is spread as copies across many files. Every change to that idea means hunting down each copy, and the copies quietly drift apart. The fix is to gather the idea into one place, a module, a data object or an interface, so a change touches one file.",
      "analogy": "Changing your address and having to tell the bank, the doctor, the gym and ten shops yourself, versus a postal forwarding service that every letter passes through.",
      "cityShape": "In before/ the same kind of floor (a price formatter, a match on weapon names, an if email/else sms) appears in several buildings at once, each a bit warm from its own branches, and no pipes connect them: the duplication is invisible except by looking floor by floor. In after/ one building (money.ts, weapon_data.gd, Notifier with its Channel classes) becomes the hub, and pipes from every user point into it.",
      "roles": [
        {
          "name": "Scattered Copies",
          "desc": "The many places that each hold their own copy of the same decision or formula."
        },
        {
          "name": "Drifted Copy",
          "desc": "A copy that already differs from the others: the bug that shotgun surgery breeds."
        },
        {
          "name": "Single Home",
          "desc": "In after/: the one module, data type or interface that now owns the decision."
        },
        {
          "name": "Callers",
          "desc": "In after/: the former copies, now short code that asks the single home."
        }
      ],
      "whenToUse": [
        "A formula or rule is copy-pasted because 'it's only one line' (a VAT factor, a toFixed(2), a string switch).",
        "Each feature is written by a different person who re-implements the same decision locally instead of finding the existing one.",
        "A type code (a string like \"email\" or \"shotgun\") is checked with if/match in every system that cares about it."
      ],
      "pitfalls": [
        "Ask 'what will change together?' and move all of it into one module (Move Function, Extract Module).",
        "Replace switches on a type string with data objects (Godot Resources) or polymorphism (one class per variant behind an interface).",
        "After the move, search the codebase for leftover copies of the literal values; drifted copies are often the first bugs you find."
      ],
      "related": [
        "dry",
        "strategy",
        "polymorphism",
        "open-closed",
        "magic-numbers",
        "god-object"
      ],
      "quiz": [
        {
          "q": "How is Shotgun Surgery different from a God Object?",
          "options": [
            "They are the same smell",
            "A God Object puts too much in one place; Shotgun Surgery spreads one idea over too many places",
            "Shotgun Surgery only happens in games",
            "A God Object is always faster"
          ],
          "answer": 1,
          "why": "They are opposites. A God Object is too much cohesion in the wrong place; Shotgun Surgery is one responsibility scattered so widely that one change needs many edits."
        },
        {
          "q": "In the refactored Godot demo, what do you change to add a Freeze Ray?",
          "options": [
            "player.gd, hud.gd, sounds.gd and save_game.gd",
            "Add a new WeaponData .tres file (and an icon and sound)",
            "Only hud.gd",
            "Nothing, Godot generates it automatically"
          ],
          "answer": 1,
          "why": "All weapon differences live in WeaponData. The player, HUD and save code read fields from it, so a new weapon is new data, not new code."
        }
      ],
      "demos": [
        {
          "id": "shotgun-surgery-ts-prices",
          "title": "Prices formatted everywhere",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A web shop formats prices and adds 19% VAT in four different files. Supporting CHF would mean editing all four, and the order email already drifted. In after/ money.ts owns VAT and formatting.",
          "roles": {
            "Scattered Copies": [
              "shotgun-surgery-ts-prices/before/productCard.ts#productCard",
              "shotgun-surgery-ts-prices/before/cart.ts#cartTotal",
              "shotgun-surgery-ts-prices/before/invoice.ts#invoiceLines"
            ],
            "Drifted Copy": [
              "shotgun-surgery-ts-prices/before/orderEmail.ts#orderEmail"
            ],
            "Single Home": [
              "shotgun-surgery-ts-prices/after/money.ts"
            ],
            "Callers": [
              "shotgun-surgery-ts-prices/after/productCard.ts#productCard",
              "shotgun-surgery-ts-prices/after/cart.ts#cartTotal",
              "shotgun-surgery-ts-prices/after/invoice.ts#invoiceLines",
              "shotgun-surgery-ts-prices/after/orderEmail.ts#orderEmail"
            ]
          },
          "trace": [
            {
              "at": "shotgun-surgery-ts-prices/before/productCard.ts#productCard",
              "say": "The product card multiplies by 1.19 and formats with a comma and €. Remember this line; you will see it again."
            },
            {
              "at": "shotgun-surgery-ts-prices/before/cart.ts#cartTotal",
              "say": "The cart does the same maths and formatting, copied by hand."
            },
            {
              "at": "shotgun-surgery-ts-prices/before/invoice.ts#invoiceLines",
              "say": "The invoice uses 0.19 and prints EUR without the comma. Same idea, different spelling."
            },
            {
              "at": "shotgun-surgery-ts-prices/before/orderEmail.ts#orderEmail",
              "say": "The email forgets to round VAT and uses a dot. Four copies, four behaviours, and CHF needs four edits."
            },
            {
              "at": "shotgun-surgery-ts-prices/after/money.ts#formatMoney",
              "say": "After: one formatter using Intl.NumberFormat, with a locale per currency. CHF is one table entry."
            },
            {
              "at": "shotgun-surgery-ts-prices/after/money.ts#grossOf",
              "say": "VAT rates live next to the formatter, so the rule 'what does the customer pay' has a single home."
            },
            {
              "at": "shotgun-surgery-ts-prices/after/cart.ts#cartTotal",
              "say": "Every screen is now a short caller. In the city, pipes from all four buildings meet in money.ts."
            }
          ],
          "files": {
            "shotgun-surgery-ts-prices/after/cart.ts": "import { Currency, grossOf, formatMoney } from './money';\n\nexport interface CartRow { name: string; priceCents: number; qty: number; }\n\nexport function netTotal(rows: CartRow[]): number {\n  return rows.reduce((sum, r) => sum + r.priceCents * r.qty, 0);\n}\n\nexport function cartTotal(rows: CartRow[], currency: Currency): string {\n  return 'Total: ' + formatMoney(grossOf(netTotal(rows), currency), currency);\n}\n",
            "shotgun-surgery-ts-prices/after/invoice.ts": "import { CartRow } from './cart';\nimport { Currency, vatOf, formatMoney } from './money';\n\nexport function invoiceLines(rows: CartRow[], currency: Currency): string[] {\n  return rows.map(r => {\n    const net = r.priceCents * r.qty;\n    return r.name + '  net ' + formatMoney(net, currency) + '  VAT ' + formatMoney(vatOf(net, currency), currency);\n  });\n}\n",
            "shotgun-surgery-ts-prices/after/money.ts": "// money.ts: the ONE place that knows about VAT, rounding and currency display.\n// Adding CHF means editing this file and nothing else.\n\nexport type Currency = 'EUR' | 'CHF';\n\nconst VAT: Record<Currency, number> = { EUR: 0.19, CHF: 0.081 };\nconst LOCALE: Record<Currency, string> = { EUR: 'de-DE', CHF: 'de-CH' };\n\nexport function vatOf(netCents: number, currency: Currency): number {\n  return Math.round(netCents * VAT[currency]);\n}\n\nexport function grossOf(netCents: number, currency: Currency): number {\n  return netCents + vatOf(netCents, currency);\n}\n\nexport function formatMoney(cents: number, currency: Currency): string {\n  return new Intl.NumberFormat(LOCALE[currency], { style: 'currency', currency }).format(cents / 100);\n}\n",
            "shotgun-surgery-ts-prices/after/orderEmail.ts": "import { Currency, grossOf, formatMoney } from './money';\n\nexport function orderEmail(customer: string, totalNetCents: number, currency: Currency): string {\n  return 'Hi ' + customer + ', you paid ' + formatMoney(grossOf(totalNetCents, currency), currency) + '. Thank you!';\n}\n",
            "shotgun-surgery-ts-prices/after/productCard.ts": "import { Currency, grossOf, formatMoney } from './money';\n\nexport function productCard(name: string, priceCents: number, currency: Currency): string {\n  return '<div class=\"card\">' + name + ' <b>' + formatMoney(grossOf(priceCents, currency), currency) + '</b></div>';\n}\n",
            "shotgun-surgery-ts-prices/before/cart.ts": "export interface CartEntry { name: string; priceCents: number; qty: number; }\n\nexport function cartTotal(rows: CartEntry[]): string {\n  let net = 0;\n  for (const r of rows) net += r.priceCents * r.qty;\n  const gross = Math.round(net * 1.19);\n  return 'Total: ' + (gross / 100).toFixed(2).replace('.', ',') + ' €';\n}\n",
            "shotgun-surgery-ts-prices/before/invoice.ts": "import { CartEntry } from './cart';\n\nexport function invoiceLines(rows: CartEntry[]): string[] {\n  return rows.map(r => {\n    const net = r.priceCents * r.qty;\n    const vat = Math.round(net * 0.19);\n    return r.name + '  net ' + (net / 100).toFixed(2) + ' EUR  VAT ' + (vat / 100).toFixed(2) + ' EUR';\n  });\n}\n",
            "shotgun-surgery-ts-prices/before/orderEmail.ts": "// Someone wrote this one months later and forgot the comma decimal separator.\nexport function orderEmail(customer: string, totalNetCents: number): string {\n  const gross = totalNetCents + totalNetCents * 0.19;\n  return 'Hi ' + customer + ', you paid ' + (gross / 100).toFixed(2) + '€. Thank you!';\n}\n",
            "shotgun-surgery-ts-prices/before/productCard.ts": "// Every screen formats prices itself. Today the boss asks: \"We now sell in\n// Switzerland too, prices in CHF please.\" Count the files you must open.\n\nexport function productCard(name: string, priceCents: number): string {\n  const gross = Math.round(priceCents * 1.19);\n  return '<div class=\"card\">' + name + ' <b>' + (gross / 100).toFixed(2).replace('.', ',') + ' €</b></div>';\n}\n"
          }
        },
        {
          "id": "shotgun-surgery-gd-weapons",
          "title": "Weapons as string names",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "In a Godot shooter, weapons are strings, and player, HUD, sounds and save code each match on them. Adding a Freeze Ray means four edits. In after/ a WeaponData Resource holds every difference, and the Freeze Ray is just a new .tres file.",
          "roles": {
            "Scattered Copies": [
              "shotgun-surgery-gd-weapons/before/player.gd#fire",
              "shotgun-surgery-gd-weapons/before/hud.gd#_on_weapon_changed",
              "shotgun-surgery-gd-weapons/before/sounds.gd#play_weapon"
            ],
            "Drifted Copy": [
              "shotgun-surgery-gd-weapons/before/save_game.gd#weapon_to_id"
            ],
            "Single Home": [
              "shotgun-surgery-gd-weapons/after/weapon_data.gd",
              "shotgun-surgery-gd-weapons/after/weapons/freeze_ray.tres"
            ],
            "Callers": [
              "shotgun-surgery-gd-weapons/after/player.gd#fire",
              "shotgun-surgery-gd-weapons/after/hud.gd#_on_weapon_changed",
              "shotgun-surgery-gd-weapons/after/save_slot.gd#weapon_to_path"
            ]
          },
          "trace": [
            {
              "at": "shotgun-surgery-gd-weapons/before/player.gd#cycle_weapon",
              "say": "Weapon order is a match on strings. A new weapon needs a new branch here first."
            },
            {
              "at": "shotgun-surgery-gd-weapons/before/player.gd#fire",
              "say": "Damage and cooldown are a second match in the same file, and the sound is delegated by name."
            },
            {
              "at": "shotgun-surgery-gd-weapons/before/hud.gd#_on_weapon_changed",
              "say": "The HUD repeats the list to pick icons and labels. Forget it and the new weapon shows the old icon."
            },
            {
              "at": "shotgun-surgery-gd-weapons/before/sounds.gd#play_weapon",
              "say": "Sounds repeats it again with if/elif. A typo like \"shotgn\" fails silently."
            },
            {
              "at": "shotgun-surgery-gd-weapons/before/save_game.gd#weapon_to_id",
              "say": "Saves store the index in a copied array. Insert a weapon in the middle and every old save loads the wrong gun."
            },
            {
              "at": "shotgun-surgery-gd-weapons/after/player.gd#fire",
              "say": "After: fire() reads cooldown, sound and damage from the current WeaponData. No weapon names appear in code."
            },
            {
              "at": "shotgun-surgery-gd-weapons/after/hud.gd#_on_weapon_changed",
              "say": "The HUD shows weapon.icon and display_name. The Freeze Ray works here without touching this file."
            },
            {
              "at": "shotgun-surgery-gd-weapons/after/save_slot.gd#weapon_to_path",
              "say": "Saving uses the resource path, unique for free. Adding a weapon is now one .tres file in weapons/."
            }
          ],
          "files": {
            "shotgun-surgery-gd-weapons/after/hud.gd": "extends CanvasLayer\n\n@export var player: CharacterBody2D\n\nfunc _ready() -> void:\n\tplayer.weapon_changed.connect(_on_weapon_changed)\n\nfunc _on_weapon_changed(weapon: WeaponData) -> void:\n\t$WeaponIcon.texture = weapon.icon\n\t$WeaponLabel.text = weapon.display_name\n",
            "shotgun-surgery-gd-weapons/after/player.gd": "extends CharacterBody2D\n\n# The player holds WeaponData objects and never asks \"which weapon is this?\".\n\nsignal weapon_changed(weapon: WeaponData)\n\n@export var weapons: Array[WeaponData] = []\nvar index := 0\nvar cooldown := 0.0\n\nfunc _process(delta: float) -> void:\n\tcooldown -= delta\n\tif Input.is_action_just_pressed(\"next_weapon\"):\n\t\tcycle_weapon()\n\tif Input.is_action_pressed(\"fire\") and cooldown <= 0:\n\t\tfire()\n\nfunc current() -> WeaponData:\n\treturn weapons[index]\n\nfunc cycle_weapon() -> void:\n\tindex = (index + 1) % weapons.size()\n\tweapon_changed.emit(current())\n\nfunc fire() -> void:\n\tcooldown = current().cooldown\n\t$FireSound.stream = current().fire_sound\n\t$FireSound.play()\n\t$Muzzle.shoot(current().damage)\n",
            "shotgun-surgery-gd-weapons/after/save_slot.gd": "extends Node\n\n# Autoload \"SaveSlot\". Saves the weapon's resource path, which is unique for free.\n\nfunc weapon_to_path(weapon: WeaponData) -> String:\n\treturn weapon.resource_path\n\nfunc path_to_weapon(path: String) -> WeaponData:\n\treturn load(path) as WeaponData\n",
            "shotgun-surgery-gd-weapons/after/weapon_data.gd": "class_name WeaponData\nextends Resource\n\n# Everything that differs between weapons lives in one data object.\n# A new weapon is a new .tres file; no script needs to change.\n\n@export var display_name := \"Weapon\"\n@export var damage := 10\n@export var cooldown := 0.3\n@export var icon: Texture2D\n@export var fire_sound: AudioStream\n",
            "shotgun-surgery-gd-weapons/after/weapons/freeze_ray.tres": "[gd_resource type=\"Resource\" script_class=\"WeaponData\" load_steps=4 format=3]\n\n[ext_resource type=\"Script\" path=\"res://weapon_data.gd\" id=\"1\"]\n[ext_resource type=\"Texture2D\" path=\"res://ui/freeze_ray.png\" id=\"2\"]\n[ext_resource type=\"AudioStream\" path=\"res://sfx/brr.wav\" id=\"3\"]\n\n[resource]\nscript = ExtResource(\"1\")\ndisplay_name = \"Freeze Ray\"\ndamage = 2\ncooldown = 0.1\nicon = ExtResource(\"2\")\nfire_sound = ExtResource(\"3\")\n",
            "shotgun-surgery-gd-weapons/after/weapons/laser.tres": "[gd_resource type=\"Resource\" script_class=\"WeaponData\" load_steps=4 format=3]\n\n[ext_resource type=\"Script\" path=\"res://weapon_data.gd\" id=\"1\"]\n[ext_resource type=\"Texture2D\" path=\"res://ui/laser.png\" id=\"2\"]\n[ext_resource type=\"AudioStream\" path=\"res://sfx/zap.wav\" id=\"3\"]\n\n[resource]\nscript = ExtResource(\"1\")\ndisplay_name = \"Laser\"\ndamage = 5\ncooldown = 0.05\nicon = ExtResource(\"2\")\nfire_sound = ExtResource(\"3\")\n",
            "shotgun-surgery-gd-weapons/after/weapons/pistol.tres": "[gd_resource type=\"Resource\" script_class=\"WeaponData\" load_steps=4 format=3]\n\n[ext_resource type=\"Script\" path=\"res://weapon_data.gd\" id=\"1\"]\n[ext_resource type=\"Texture2D\" path=\"res://ui/pistol.png\" id=\"2\"]\n[ext_resource type=\"AudioStream\" path=\"res://sfx/pew.wav\" id=\"3\"]\n\n[resource]\nscript = ExtResource(\"1\")\ndisplay_name = \"Pistol\"\ndamage = 10\ncooldown = 0.3\nicon = ExtResource(\"2\")\nfire_sound = ExtResource(\"3\")\n",
            "shotgun-surgery-gd-weapons/after/weapons/shotgun.tres": "[gd_resource type=\"Resource\" script_class=\"WeaponData\" load_steps=4 format=3]\n\n[ext_resource type=\"Script\" path=\"res://weapon_data.gd\" id=\"1\"]\n[ext_resource type=\"Texture2D\" path=\"res://ui/shotgun.png\" id=\"2\"]\n[ext_resource type=\"AudioStream\" path=\"res://sfx/boom.wav\" id=\"3\"]\n\n[resource]\nscript = ExtResource(\"1\")\ndisplay_name = \"Shotgun\"\ndamage = 40\ncooldown = 1.0\nicon = ExtResource(\"2\")\nfire_sound = ExtResource(\"3\")\n",
            "shotgun-surgery-gd-weapons/before/hud.gd": "extends CanvasLayer\n\n@export var player: CharacterBody2D\n\nfunc _ready() -> void:\n\tplayer.weapon_changed.connect(_on_weapon_changed)\n\nfunc _on_weapon_changed(weapon_name: String) -> void:\n\tmatch weapon_name:\n\t\t\"pistol\":\n\t\t\t$WeaponIcon.texture = load(\"res://ui/pistol.png\")\n\t\t\t$WeaponLabel.text = \"Pistol\"\n\t\t\"shotgun\":\n\t\t\t$WeaponIcon.texture = load(\"res://ui/shotgun.png\")\n\t\t\t$WeaponLabel.text = \"Shotgun\"\n\t\t\"laser\":\n\t\t\t$WeaponIcon.texture = load(\"res://ui/laser.png\")\n\t\t\t$WeaponLabel.text = \"Laser\"\n",
            "shotgun-surgery-gd-weapons/before/player.gd": "extends CharacterBody2D\n\n# Weapons are just names. To add a \"freeze_ray\" you must edit this file,\n# hud.gd, sounds.gd and save_game.gd, and hope you found every match.\n\nsignal weapon_changed(weapon_name: String)\n\nvar weapon_name := \"pistol\"\nvar cooldown := 0.0\n\nfunc _process(delta: float) -> void:\n\tcooldown -= delta\n\tif Input.is_action_just_pressed(\"next_weapon\"):\n\t\tcycle_weapon()\n\tif Input.is_action_pressed(\"fire\") and cooldown <= 0:\n\t\tfire()\n\nfunc cycle_weapon() -> void:\n\tmatch weapon_name:\n\t\t\"pistol\":\n\t\t\tweapon_name = \"shotgun\"\n\t\t\"shotgun\":\n\t\t\tweapon_name = \"laser\"\n\t\t_:\n\t\t\tweapon_name = \"pistol\"\n\tweapon_changed.emit(weapon_name)\n\nfunc fire() -> void:\n\tvar damage := 0\n\tmatch weapon_name:\n\t\t\"pistol\":\n\t\t\tdamage = 10\n\t\t\tcooldown = 0.3\n\t\t\"shotgun\":\n\t\t\tdamage = 40\n\t\t\tcooldown = 1.0\n\t\t\"laser\":\n\t\t\tdamage = 5\n\t\t\tcooldown = 0.05\n\tSounds.play_weapon(weapon_name)\n\t$Muzzle.shoot(damage)\n",
            "shotgun-surgery-gd-weapons/before/save_game.gd": "extends Node\n\n# Autoload \"SaveGame\". Old saves store a number, so the mapping is copied here too.\n\nfunc weapon_to_id(weapon_name: String) -> int:\n\treturn [\"pistol\", \"shotgun\", \"laser\"].find(weapon_name)\n\nfunc id_to_weapon(id: int) -> String:\n\treturn [\"pistol\", \"shotgun\", \"laser\"][id]\n",
            "shotgun-surgery-gd-weapons/before/sounds.gd": "extends AudioStreamPlayer\n\n# Autoload \"Sounds\".\n\nfunc play_weapon(weapon_name: String) -> void:\n\tif weapon_name == \"pistol\":\n\t\tstream = load(\"res://sfx/pew.wav\")\n\telif weapon_name == \"shotgun\":\n\t\tstream = load(\"res://sfx/boom.wav\")\n\telif weapon_name == \"laser\":\n\t\tstream = load(\"res://sfx/zap.wav\")\n\tplay()\n"
          }
        },
        {
          "id": "shotgun-surgery-java-notify",
          "title": "Notification channels in a backend",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "Three event handlers and a validator each contain their own if email / else sms. Adding push touches all four, and the digest job already forgot SMS. In after/ each channel is a class behind a Channel interface, and adding push is one new file plus one line.",
          "roles": {
            "Scattered Copies": [
              "shotgun-surgery-java-notify/before/OrderShippedHandler.java#OrderShippedHandler.onShipped",
              "shotgun-surgery-java-notify/before/PasswordResetHandler.java#PasswordResetHandler.onResetRequested",
              "shotgun-surgery-java-notify/before/SettingsValidator.java#SettingsValidator.isValidChannel"
            ],
            "Drifted Copy": [
              "shotgun-surgery-java-notify/before/WeeklyDigestJob.java#WeeklyDigestJob.sendDigest"
            ],
            "Single Home": [
              "shotgun-surgery-java-notify/after/Notifier.java#Notifier",
              "shotgun-surgery-java-notify/after/Channel.java#Channel"
            ],
            "Callers": [
              "shotgun-surgery-java-notify/after/AccountEvents.java#AccountEvents"
            ]
          },
          "trace": [
            {
              "at": "shotgun-surgery-java-notify/before/OrderShippedHandler.java#OrderShippedHandler.onShipped",
              "say": "The shipping handler picks mail or SMS itself and truncates SMS to 160 chars. Delivery rules are mixed into an order event."
            },
            {
              "at": "shotgun-surgery-java-notify/before/PasswordResetHandler.java#PasswordResetHandler.onResetRequested",
              "say": "The reset handler repeats the switch with a different string style and no error for unknown channels."
            },
            {
              "at": "shotgun-surgery-java-notify/before/WeeklyDigestJob.java#WeeklyDigestJob.sendDigest",
              "say": "The digest copy already drifted: SMS users get nothing. Each copy is a place to forget something."
            },
            {
              "at": "shotgun-surgery-java-notify/before/SettingsValidator.java#SettingsValidator.isValidChannel",
              "say": "Even the settings page keeps its own channel list. Push means a fourth edit, in another team's file."
            },
            {
              "at": "shotgun-surgery-java-notify/after/AccountEvents.java#AccountEvents.onShipped",
              "say": "After: events only decide what to say, then hand it to the Notifier. No channel names here."
            },
            {
              "at": "shotgun-surgery-java-notify/after/Notifier.java#Notifier.notify",
              "say": "The Notifier looks up the recipient's channel in one map. This is the single home of 'how do we reach people'."
            },
            {
              "at": "shotgun-surgery-java-notify/after/SmsChannel.java#SmsChannel.send",
              "say": "The 160-char rule now lives inside SmsChannel, the only class that cares, so every event gets it for free."
            },
            {
              "at": "shotgun-surgery-java-notify/after/PushChannel.java#PushChannel.send",
              "say": "Push is one new class implementing Channel, registered once. The change is one building, not four."
            }
          ],
          "files": {
            "shotgun-surgery-java-notify/after/AccountEvents.java": "package shop.notify2;\n\n// Events now only decide WHAT to say. HOW to deliver it is the Notifier's job.\npublic class AccountEvents {\n    private final Notifier notifier;\n\n    public AccountEvents(Notifier notifier) {\n        this.notifier = notifier;\n    }\n\n    public void onShipped(Recipient to, String orderId) {\n        notifier.notify(to, \"Order shipped\", \"Your order \" + orderId + \" is on its way.\");\n    }\n\n    public void onResetRequested(Recipient to, String code) {\n        notifier.notify(to, \"Reset your password\", \"Your code: \" + code);\n    }\n\n    public void sendDigest(Recipient to, String digest) {\n        notifier.notify(to, \"Your week\", digest);\n    }\n}\n",
            "shotgun-surgery-java-notify/after/Channel.java": "package shop.notify2;\n\n// The one thing that varies per channel, behind one interface.\npublic interface Channel {\n    String id();\n\n    void send(Recipient to, String subject, String body);\n}\n",
            "shotgun-surgery-java-notify/after/EmailChannel.java": "package shop.notify2;\n\npublic class EmailChannel implements Channel {\n    public String id() {\n        return \"email\";\n    }\n\n    public void send(Recipient to, String subject, String body) {\n        System.out.println(\"MAIL \" + to.email() + \": \" + subject);\n    }\n}\n",
            "shotgun-surgery-java-notify/after/Notifier.java": "package shop.notify2;\n\nimport java.util.List;\nimport java.util.Map;\nimport java.util.function.Function;\nimport java.util.stream.Collectors;\n\n// The single place that maps a channel id to its implementation.\npublic class Notifier {\n    private final Map<String, Channel> channels = List.of(new EmailChannel(), new SmsChannel(), new PushChannel())\n            .stream().collect(Collectors.toMap(Channel::id, Function.identity()));\n\n    public boolean supports(String channelId) {\n        return channels.containsKey(channelId);\n    }\n\n    public void notify(Recipient to, String subject, String body) {\n        Channel ch = channels.get(to.channel());\n        if (ch == null) {\n            throw new IllegalArgumentException(\"Unknown channel \" + to.channel());\n        }\n        ch.send(to, subject, body);\n    }\n}\n",
            "shotgun-surgery-java-notify/after/PushChannel.java": "package shop.notify2;\n\n// The new feature: one new file plus one line in Notifier. Nothing else changed.\npublic class PushChannel implements Channel {\n    public String id() {\n        return \"push\";\n    }\n\n    public void send(Recipient to, String subject, String body) {\n        System.out.println(\"PUSH \" + to.pushToken() + \": \" + subject);\n    }\n}\n",
            "shotgun-surgery-java-notify/after/Recipient.java": "package shop.notify2;\n\n// Who to reach and how they prefer it, travelling together.\npublic record Recipient(String channel, String email, String phone, String pushToken) {}\n",
            "shotgun-surgery-java-notify/after/SmsChannel.java": "package shop.notify2;\n\npublic class SmsChannel implements Channel {\n    public String id() {\n        return \"sms\";\n    }\n\n    public void send(Recipient to, String subject, String body) {\n        String text = body.length() > 160 ? body.substring(0, 157) + \"...\" : body;\n        System.out.println(\"SMS \" + to.phone() + \": \" + text);\n    }\n}\n",
            "shotgun-surgery-java-notify/before/Clients.java": "package shop.notify;\n\nclass MailClient {\n    void send(String to, String subject, String body) {\n        System.out.println(\"MAIL \" + to + \": \" + subject);\n    }\n}\n\nclass SmsClient {\n    void send(String phone, String text) {\n        System.out.println(\"SMS \" + phone + \": \" + text);\n    }\n}\n",
            "shotgun-surgery-java-notify/before/OrderShippedHandler.java": "package shop.notify;\n\n// Each event decides by itself how to reach the customer. Product now wants\n// \"push\" notifications: that means editing this file, PasswordResetHandler,\n// WeeklyDigestJob and SettingsValidator, in one risky pull request.\npublic class OrderShippedHandler {\n    private final MailClient mail = new MailClient();\n    private final SmsClient sms = new SmsClient();\n\n    public void onShipped(String channel, String email, String phone, String orderId) {\n        String text = \"Your order \" + orderId + \" is on its way.\";\n        if (\"email\".equals(channel)) {\n            mail.send(email, \"Order shipped\", text);\n        } else if (\"sms\".equals(channel)) {\n            sms.send(phone, text.length() > 160 ? text.substring(0, 157) + \"...\" : text);\n        } else {\n            throw new IllegalArgumentException(\"Unknown channel \" + channel);\n        }\n    }\n}\n",
            "shotgun-surgery-java-notify/before/PasswordResetHandler.java": "package shop.notify;\n\npublic class PasswordResetHandler {\n    private final MailClient mail = new MailClient();\n    private final SmsClient sms = new SmsClient();\n\n    public void onResetRequested(String channel, String email, String phone, String code) {\n        if (channel.equals(\"email\")) {\n            mail.send(email, \"Reset your password\", \"Your code: \" + code);\n        } else if (channel.equals(\"sms\")) {\n            sms.send(phone, \"Code: \" + code);\n        }\n    }\n}\n",
            "shotgun-surgery-java-notify/before/SettingsValidator.java": "package shop.notify;\n\nimport java.util.List;\n\npublic class SettingsValidator {\n    private static final List<String> CHANNELS = List.of(\"email\", \"sms\");\n\n    public boolean isValidChannel(String channel) {\n        return CHANNELS.contains(channel);\n    }\n}\n",
            "shotgun-surgery-java-notify/before/WeeklyDigestJob.java": "package shop.notify;\n\n// Added later by another team. SMS was forgotten here: customers who chose\n// SMS silently get nothing. Copies of the same switch drift apart.\npublic class WeeklyDigestJob {\n    private final MailClient mail = new MailClient();\n\n    public void sendDigest(String channel, String email, String digest) {\n        if (\"email\".equals(channel)) {\n            mail.send(email, \"Your week\", digest);\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "primitive-obsession",
      "name": "Primitive Obsession",
      "family": "Anti-patterns",
      "aka": [
        "Stringly typed code",
        "Missing value types"
      ],
      "tagline": "Strings, ints and floats stand in for real concepts like money, dates and IDs.",
      "intent": "Primitive Obsession means modelling domain ideas with bare built-in types: an email is a str, money is a float, a grid slot is an [x, y] array, a rarity is a String. The compiler cannot catch swapped arguments, and every function re-validates the same values in slightly different ways. The fix is to introduce small value types that validate themselves once, carry their own behaviour, and make wrong combinations impossible to write.",
      "analogy": "A pharmacy that keeps every pill in identical unlabeled bottles. It works if everyone remembers which is which, until the day someone swaps two shelves.",
      "cityShape": "In before/ look for thick floors with long parameter lists that run warmer than their after/ twins because of repeated checks (if '@' not in…, if currency != …, if slot[0] < 0 …), and few buildings, because the concepts have no home of their own. In after/ a new building of tiny, cool floors appears (values.py, item_stack.gd, the Iban/Money records), and the callers' floors shrink because validation moved into those types.",
      "roles": [
        {
          "name": "Primitive Parameters",
          "desc": "Functions whose signature is a row of str/int/float/Array, easy to call in the wrong order."
        },
        {
          "name": "Scattered Validation",
          "desc": "The same checks and parsing repeated wherever the raw values are used."
        },
        {
          "name": "Value Types",
          "desc": "In after/: small immutable types (Email, Money, Iban, ItemStack) that validate on creation and own their behaviour."
        },
        {
          "name": "Typed Callers",
          "desc": "In after/: code that now passes value types around and no longer re-checks them."
        }
      ],
      "whenToUse": [
        "A value starts as 'just a string' in a prototype (an email, an ID, a status) and never gets promoted to a type.",
        "Money is stored as float because the first feature only displayed prices.",
        "Creating a class for two fields feels like overkill, so [x, y] arrays and Dictionaries spread through the code."
      ],
      "pitfalls": [
        "Introduce a small value type per concept (Replace Primitive with Object): Email, Money, Iban, Vector2i, ItemStack.",
        "Validate inside the constructor so an invalid instance can never exist, then delete the scattered checks.",
        "Move behaviour that belongs to the value (adding money, nights of a stay, a fee rule) onto the type itself, and use enums instead of magic strings."
      ],
      "related": [
        "value-object",
        "encapsulation",
        "magic-numbers",
        "dto"
      ],
      "quiz": [
        {
          "q": "In the booking demo, why does book_room(…, 33.10, …, 204, …) not raise an error in before/?",
          "options": [
            "Python checks argument order",
            "Room number and price are both plain numbers, so nothing tells them apart",
            "The function sorts its arguments",
            "Floats are converted to ints automatically"
          ],
          "answer": 1,
          "why": "When concepts share a primitive type, a swap is still 'valid'. With RoomNumber and Money types the same mistake fails immediately."
        },
        {
          "q": "Where should an IBAN be validated once you have an Iban type?",
          "options": [
            "In every method that receives one",
            "In the Iban constructor, so no invalid Iban can exist",
            "Only in the database",
            "In the UI only"
          ],
          "answer": 1,
          "why": "Validating at creation means every Iban in the program is already valid. Callers can trust the type instead of repeating the checks."
        }
      ],
      "demos": [
        {
          "id": "primitive-obsession-py-booking",
          "title": "Hotel booking with plain values",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A booking function takes an email, room, two date strings, a float price and a currency string. The demo swaps room and price without any error. In after/ Email, RoomNumber, Stay and Money make that mistake impossible.",
          "roles": {
            "Primitive Parameters": [
              "primitive-obsession-py-booking/before/booking.py#book_room",
              "primitive-obsession-py-booking/before/booking.py#add_city_tax"
            ],
            "Scattered Validation": [
              "primitive-obsession-py-booking/before/booking.py#nights_between"
            ],
            "Value Types": [
              "primitive-obsession-py-booking/after/values.py#Email",
              "primitive-obsession-py-booking/after/values.py#Money",
              "primitive-obsession-py-booking/after/values.py#Stay",
              "primitive-obsession-py-booking/after/values.py#RoomNumber"
            ],
            "Typed Callers": [
              "primitive-obsession-py-booking/after/booking.py#book_room",
              "primitive-obsession-py-booking/after/main.py#demo"
            ]
          },
          "trace": [
            {
              "at": "primitive-obsession-py-booking/before/main.py#demo",
              "say": "The caller passes 33.10 as the room and 204 as the price. Both are numbers, so Python runs it happily."
            },
            {
              "at": "primitive-obsession-py-booking/before/booking.py#book_room",
              "say": "Six positional parameters, five of them primitives. The email check and lowercasing live here and nowhere else."
            },
            {
              "at": "primitive-obsession-py-booking/before/booking.py#nights_between",
              "say": "Dates are parsed from strings by hand. Any other format crashes deep inside the booking flow."
            },
            {
              "at": "primitive-obsession-py-booking/before/booking.py#add_city_tax",
              "say": "Float money gives 99.30000000000001, and nothing stops adding EUR tax to a CHF total."
            },
            {
              "at": "primitive-obsession-py-booking/after/values.py#Money.__add__",
              "say": "After: Money uses Decimal and refuses to add different currencies. The rule lives with the value."
            },
            {
              "at": "primitive-obsession-py-booking/after/values.py#Stay.nights",
              "say": "Stay checks its dates once, at creation, and knows how many nights it covers."
            },
            {
              "at": "primitive-obsession-py-booking/after/booking.py#book_room",
              "say": "book_room() shrinks to one line: the types already guarantee valid input."
            },
            {
              "at": "primitive-obsession-py-booking/after/main.py#demo",
              "say": "Swapping RoomNumber(204) and Money now reads wrong to a human and fails with a type checker."
            }
          ],
          "files": {
            "primitive-obsession-py-booking/after/booking.py": "from dataclasses import dataclass\nfrom .values import Email, Money, Stay, RoomNumber\n\n\n@dataclass(frozen=True)\nclass Booking:\n    guest: Email\n    room: RoomNumber\n    stay: Stay\n    total: Money\n\n\ndef book_room(guest: Email, room: RoomNumber, stay: Stay, nightly: Money) -> Booking:\n    # No validation here: the types already guarantee it.\n    return Booking(guest, room, stay, nightly.times(stay.nights()))\n\n\ndef add_city_tax(booking: Booking, tax_per_night: Money) -> Booking:\n    total = booking.total + tax_per_night.times(booking.stay.nights())\n    return Booking(booking.guest, booking.room, booking.stay, total)\n",
            "primitive-obsession-py-booking/after/main.py": "from datetime import date\nfrom decimal import Decimal\nfrom .values import Email, Money, Stay, RoomNumber\nfrom .booking import book_room, add_city_tax\n\n\ndef demo():\n    stay = Stay(date(2026, 7, 1), date(2026, 7, 4))\n    # Swapping room and price now fails loudly: a RoomNumber is not a Money.\n    b = book_room(Email(\"Ada@Example.com\"), RoomNumber(204), stay, Money(Decimal(\"33.10\"), \"EUR\"))\n    b = add_city_tax(b, Money(Decimal(\"2.50\"), \"EUR\"))\n    print(b.total)\n",
            "primitive-obsession-py-booking/after/values.py": "# Small value types. Each checks itself once, when it is created,\n# so the rest of the code can trust it.\nfrom dataclasses import dataclass\nfrom datetime import date\nfrom decimal import Decimal\n\n\n@dataclass(frozen=True)\nclass Email:\n    value: str\n\n    def __post_init__(self):\n        if \"@\" not in self.value:\n            raise ValueError(\"bad email: \" + self.value)\n        object.__setattr__(self, \"value\", self.value.lower())\n\n\n@dataclass(frozen=True)\nclass Money:\n    amount: Decimal\n    currency: str\n\n    def __add__(self, other):\n        if other.currency != self.currency:\n            raise ValueError(\"cannot add \" + other.currency + \" to \" + self.currency)\n        return Money(self.amount + other.amount, self.currency)\n\n    def times(self, n):\n        return Money(self.amount * n, self.currency)\n\n\n@dataclass(frozen=True)\nclass Stay:\n    check_in: date\n    check_out: date\n\n    def __post_init__(self):\n        if self.check_out <= self.check_in:\n            raise ValueError(\"check-out must be after check-in\")\n\n    def nights(self):\n        return (self.check_out - self.check_in).days\n\n\n@dataclass(frozen=True)\nclass RoomNumber:\n    value: int\n",
            "primitive-obsession-py-booking/before/booking.py": "# booking.py: everything is a str, int or float. It works until someone\n# passes arguments in the wrong order, or 0.1 + 0.2 shows up on an invoice.\nfrom datetime import date\n\n\ndef nights_between(check_in, check_out):\n    # dates are \"YYYY-MM-DD\" strings; hope nobody sends \"01.07.2026\"\n    y1, m1, d1 = [int(x) for x in check_in.split(\"-\")]\n    y2, m2, d2 = [int(x) for x in check_out.split(\"-\")]\n    return (date(y2, m2, d2) - date(y1, m1, d1)).days\n\n\ndef book_room(guest_email, room_number, check_in, check_out, price_per_night, currency):\n    if \"@\" not in guest_email:\n        raise ValueError(\"bad email\")\n    nights = nights_between(check_in, check_out)\n    if nights <= 0:\n        raise ValueError(\"check-out must be after check-in\")\n    total = price_per_night * nights  # float money: 3 x 33.10 = 99.30000000000001\n    return {\"email\": guest_email.lower(), \"room\": room_number, \"nights\": nights, \"total\": total, \"currency\": currency}\n\n\ndef add_city_tax(booking, tax_per_night):\n    # nothing stops adding EUR tax to a CHF booking\n    booking[\"total\"] = booking[\"total\"] + tax_per_night * booking[\"nights\"]\n    return booking\n",
            "primitive-obsession-py-booking/before/main.py": "from .booking import book_room, add_city_tax\n\n\ndef demo():\n    # Spot the bug: room and price are swapped. Both are numbers, so Python is happy.\n    b = book_room(\"Ada@Example.com\", 33.10, \"2026-07-01\", \"2026-07-04\", 204, \"EUR\")\n    b = add_city_tax(b, 2.5)\n    print(b)\n"
          }
        },
        {
          "id": "primitive-obsession-gd-inventory",
          "title": "Inventory of Dictionaries",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A Godot inventory stores items as Dictionaries, rarity as Strings and slots as [col, row] Arrays. A swapped index, a capital letter and a typo all fail silently. The after/ version uses Vector2i, an ItemStack class and a Rarity enum.",
          "roles": {
            "Primitive Parameters": [
              "primitive-obsession-gd-inventory/before/inventory.gd#add_item",
              "primitive-obsession-gd-inventory/before/inventory.gd#move_item"
            ],
            "Scattered Validation": [
              "primitive-obsession-gd-inventory/before/inventory.gd#sell_value"
            ],
            "Value Types": [
              "primitive-obsession-gd-inventory/after/item_stack.gd"
            ],
            "Typed Callers": [
              "primitive-obsession-gd-inventory/after/inventory.gd#put",
              "primitive-obsession-gd-inventory/after/chest.gd#_on_opened"
            ]
          },
          "trace": [
            {
              "at": "primitive-obsession-gd-inventory/before/chest.gd#_on_opened",
              "say": "The chest calls add_item with an Array, two Strings and an int. \"Epic\" with a capital E is accepted without complaint."
            },
            {
              "at": "primitive-obsession-gd-inventory/before/inventory.gd#add_item",
              "say": "Bounds checks, key building and the 99 cap all happen inline, because an Array slot knows nothing about itself."
            },
            {
              "at": "primitive-obsession-gd-inventory/before/inventory.gd#move_item",
              "say": "slot[1] and slot[0] are swapped when building the key. Indexes have no names, so the bug hides in plain sight."
            },
            {
              "at": "primitive-obsession-gd-inventory/before/inventory.gd#sell_value",
              "say": "Rarity is compared as strings; \"legandary\" never matches. Every reader of rarity must repeat these ifs."
            },
            {
              "at": "primitive-obsession-gd-inventory/after/item_stack.gd#_init",
              "say": "After: ItemStack clamps the count once and takes a Rarity enum. A typo is now a parse error, not a silent bug."
            },
            {
              "at": "primitive-obsession-gd-inventory/after/item_stack.gd#value",
              "say": "The sell value is a lookup on the enum, kept inside the type that owns the data."
            },
            {
              "at": "primitive-obsession-gd-inventory/after/inventory.gd#put",
              "say": "Slots are Vector2i, checked with Rect2i.has_point. Merging asks the stack itself."
            },
            {
              "at": "primitive-obsession-gd-inventory/after/inventory.gd#sell_value",
              "say": "The total is just a sum of stack.value(). No string compares left in the inventory."
            }
          ],
          "files": {
            "primitive-obsession-gd-inventory/after/chest.gd": "extends Area2D\n\n@export var inventory: Node\n\nfunc _on_opened() -> void:\n\tinventory.put(Vector2i(2, 1), ItemStack.new(&\"potion\", 3, ItemStack.Rarity.RARE))\n\tinventory.put(Vector2i(0, 0), ItemStack.new(&\"gold_ring\", 1, ItemStack.Rarity.EPIC))\n",
            "primitive-obsession-gd-inventory/after/inventory.gd": "extends Node\n\n# Slots are Vector2i (col and row cannot be swapped by accident: .x and .y are named),\n# and contents are ItemStack objects that keep their own rules.\n\nconst SIZE := Vector2i(6, 4)\n\nvar slots: Dictionary = {}  # Vector2i -> ItemStack\n\nfunc is_inside(slot: Vector2i) -> bool:\n\treturn Rect2i(Vector2i.ZERO, SIZE).has_point(slot)\n\nfunc put(slot: Vector2i, stack: ItemStack) -> bool:\n\tif not is_inside(slot):\n\t\treturn false\n\tif not slots.has(slot):\n\t\tslots[slot] = stack\n\t\treturn true\n\tif not slots[slot].can_merge(stack):\n\t\treturn false\n\tslots[slot] = slots[slot].merged(stack)\n\treturn true\n\nfunc move(from_slot: Vector2i, to_slot: Vector2i) -> void:\n\tslots[to_slot] = slots[from_slot]\n\tslots.erase(from_slot)\n\nfunc sell_value() -> int:\n\tvar total := 0\n\tfor stack: ItemStack in slots.values():\n\t\ttotal += stack.value()\n\treturn total\n",
            "primitive-obsession-gd-inventory/after/item_stack.gd": "class_name ItemStack\nextends RefCounted\n\n# A tiny value type: an item id, a count that is always 1..99, and a real enum.\n\nenum Rarity { COMMON, RARE, EPIC, LEGENDARY }\n\nconst MAX_COUNT := 99\nconst BASE_VALUE := {Rarity.COMMON: 5, Rarity.RARE: 20, Rarity.EPIC: 80, Rarity.LEGENDARY: 300}\n\nvar id: StringName\nvar count: int\nvar rarity: Rarity\n\nfunc _init(item_id: StringName, amount: int, item_rarity: Rarity = Rarity.COMMON) -> void:\n\tid = item_id\n\tcount = clampi(amount, 1, MAX_COUNT)\n\trarity = item_rarity\n\nfunc can_merge(other: ItemStack) -> bool:\n\treturn other.id == id\n\nfunc merged(other: ItemStack) -> ItemStack:\n\treturn ItemStack.new(id, count + other.count, rarity)\n\nfunc value() -> int:\n\treturn BASE_VALUE[rarity] * count\n",
            "primitive-obsession-gd-inventory/before/chest.gd": "extends Area2D\n\n@export var inventory: Node\n\nfunc _on_opened() -> void:\n\tinventory.add_item([2, 1], \"potion\", 3, \"rare\")\n\tinventory.add_item([0, 0], \"gold_ring\", 1, \"Epic\")  # capital E: sells as common\n",
            "primitive-obsession-gd-inventory/before/inventory.gd": "extends Node\n\n# Items are Dictionaries, rarity is a String, slots are [col, row] Arrays.\n# Every function re-checks the same things, and typos only show up at runtime.\n\nconst COLUMNS := 6\nconst ROWS := 4\n\nvar slots := {}  # \"col,row\" -> {\"id\": String, \"count\": int, \"rarity\": String}\n\nfunc add_item(slot: Array, id: String, count: int, rarity: String) -> bool:\n\tif slot[0] < 0 or slot[0] >= COLUMNS or slot[1] < 0 or slot[1] >= ROWS:\n\t\treturn false\n\tvar key := str(slot[0]) + \",\" + str(slot[1])\n\tif slots.has(key):\n\t\tif slots[key][\"id\"] != id:\n\t\t\treturn false\n\t\tslots[key][\"count\"] = min(slots[key][\"count\"] + count, 99)\n\telse:\n\t\tslots[key] = {\"id\": id, \"count\": min(count, 99), \"rarity\": rarity}\n\treturn true\n\nfunc move_item(from_slot: Array, to_slot: Array) -> void:\n\tvar from_key := str(from_slot[0]) + \",\" + str(from_slot[1])\n\tvar to_key := str(to_slot[1]) + \",\" + str(to_slot[0])  # bug: col and row swapped\n\tslots[to_key] = slots[from_key]\n\tslots.erase(from_key)\n\nfunc sell_value() -> int:\n\tvar total := 0\n\tfor key in slots:\n\t\tvar item: Dictionary = slots[key]\n\t\tvar base := 5\n\t\tif item[\"rarity\"] == \"rare\":\n\t\t\tbase = 20\n\t\telif item[\"rarity\"] == \"epic\":\n\t\t\tbase = 80\n\t\telif item[\"rarity\"] == \"legandary\":  # typo: never matches\n\t\t\tbase = 300\n\t\ttotal += base * item[\"count\"]\n\treturn total\n"
          }
        },
        {
          "id": "primitive-obsession-cs-transfers",
          "title": "Bank transfers with strings",
          "lang": "C#",
          "level": "advanced",
          "source": null,
          "story": "A transfer method takes four strings and a decimal; the demo call swaps the target IBAN and the reference text and still compiles. In after/ Iban, Money and TransferRequest records make the request a sentence of types, and the fee rule moves onto the request.",
          "roles": {
            "Primitive Parameters": [
              "primitive-obsession-cs-transfers/before/PaymentService.cs#PaymentService.Transfer"
            ],
            "Scattered Validation": [
              "primitive-obsession-cs-transfers/before/FeeRules.cs#FeeRules.FeeFor"
            ],
            "Value Types": [
              "primitive-obsession-cs-transfers/after/Iban.cs#Iban",
              "primitive-obsession-cs-transfers/after/Money.cs#Money",
              "primitive-obsession-cs-transfers/after/TransferRequest.cs#TransferRequest"
            ],
            "Typed Callers": [
              "primitive-obsession-cs-transfers/after/TransferService.cs#TransferService"
            ]
          },
          "trace": [
            {
              "at": "primitive-obsession-cs-transfers/before/Program.cs#Program.Demo",
              "say": "The reference \"Rent July\" lands in the toIban slot. Strings fit anywhere, so the compiler cannot help."
            },
            {
              "at": "primitive-obsession-cs-transfers/before/PaymentService.cs#PaymentService.Transfer",
              "say": "Half the method normalises and validates raw strings before any banking happens."
            },
            {
              "at": "primitive-obsession-cs-transfers/before/FeeRules.cs#FeeRules.FeeFor",
              "say": "The fee rule re-parses country codes with Substring and trusts that someone cleaned the IBAN first."
            },
            {
              "at": "primitive-obsession-cs-transfers/after/Iban.cs#Iban.Iban",
              "say": "After: the Iban constructor normalises and checks once. Every Iban instance is valid by construction."
            },
            {
              "at": "primitive-obsession-cs-transfers/after/Money.cs#Money.Plus",
              "say": "Money pairs amount with a Currency enum and refuses to add EUR to CHF."
            },
            {
              "at": "primitive-obsession-cs-transfers/after/TransferRequest.cs#TransferRequest.Fee",
              "say": "The fee rule moves next to the data it needs, and asks the Ibans for their country codes."
            },
            {
              "at": "primitive-obsession-cs-transfers/after/TransferService.cs#TransferService.Execute",
              "say": "Execute() has no validation left: two lines of real work. Swapping From and Reference would not compile."
            }
          ],
          "files": {
            "primitive-obsession-cs-transfers/after/Iban.cs": "using System;\n\nnamespace Bank\n{\n    // An IBAN is normalised and checked once. After that it is always valid.\n    public sealed record Iban\n    {\n        public string Value { get; }\n\n        public Iban(string raw)\n        {\n            string v = raw.Replace(\" \", \"\").ToUpperInvariant();\n            if (v.Length < 15)\n            {\n                throw new ArgumentException(\"IBAN too short\");\n            }\n            Value = v;\n        }\n\n        public string CountryCode()\n        {\n            return Value.Substring(0, 2);\n        }\n\n        public override string ToString() => Value;\n    }\n}\n",
            "primitive-obsession-cs-transfers/after/Money.cs": "using System;\n\nnamespace Bank\n{\n    public enum Currency { EUR, CHF }\n\n    // Amount and currency always travel together, and mixing them is an error.\n    public sealed record Money(decimal Amount, Currency Currency)\n    {\n        public static Money Of(decimal amount, Currency currency)\n        {\n            if (amount <= 0)\n            {\n                throw new ArgumentException(\"Amount must be positive\");\n            }\n            return new Money(amount, currency);\n        }\n\n        public Money Plus(Money other)\n        {\n            if (other.Currency != Currency)\n            {\n                throw new InvalidOperationException(\"Currency mismatch\");\n            }\n            return new Money(Amount + other.Amount, Currency);\n        }\n\n        public Money Percent(decimal pct)\n        {\n            return new Money(Math.Round(Amount * pct / 100m, 2), Currency);\n        }\n\n        public override string ToString() => $\"{Amount:0.00} {Currency}\";\n    }\n}\n",
            "primitive-obsession-cs-transfers/after/TransferRequest.cs": "namespace Bank\n{\n    // The request is a sentence made of types: from, to, how much, why.\n    public sealed record TransferRequest(Iban From, Iban To, Money Amount, string Reference)\n    {\n        public bool IsDomestic()\n        {\n            return From.CountryCode() == To.CountryCode();\n        }\n\n        public Money Fee()\n        {\n            if (IsDomestic())\n            {\n                return new Money(0m, Amount.Currency);\n            }\n            return Amount.Currency == Currency.CHF ? new Money(5m, Currency.CHF) : Amount.Percent(0.2m);\n        }\n    }\n}\n",
            "primitive-obsession-cs-transfers/after/TransferService.cs": "namespace Bank\n{\n    // No validation left here: every input was valid the moment it existed.\n    public class TransferService\n    {\n        public string Execute(TransferRequest request)\n        {\n            Money charged = request.Amount.Plus(request.Fee());\n            return $\"{request.From} -> {request.To}: {charged} ({request.Reference})\";\n        }\n\n        public static string Demo(TransferService transfers)\n        {\n            var request = new TransferRequest(\n                new Iban(\"DE89 3704 0044 0532 0130 00\"),\n                new Iban(\"CH93 0076 2011 6238 5295 7\"),\n                Money.Of(12.5m, Currency.EUR),\n                \"Rent July\");\n            return transfers.Execute(request);\n        }\n    }\n}\n",
            "primitive-obsession-cs-transfers/before/FeeRules.cs": "namespace Bank.Legacy\n{\n    public static class FeeRules\n    {\n        // The country code is \"the first two chars of a string\", re-parsed here\n        // and assumed to be already cleaned. Nobody guarantees that.\n        public static decimal FeeFor(string fromIban, string toIban, decimal amount, string currency)\n        {\n            bool domestic = fromIban.Substring(0, 2) == toIban.Substring(0, 2);\n            if (domestic)\n            {\n                return 0m;\n            }\n            return currency == \"CHF\" ? 5m : System.Math.Round(amount * 0.002m, 2);\n        }\n    }\n}\n",
            "primitive-obsession-cs-transfers/before/PaymentService.cs": "using System;\n\nnamespace Bank.Legacy\n{\n    // Five strings and a decimal. The compiler cannot tell an IBAN from a\n    // reference text, or EUR cents from CHF francs.\n    public class PaymentService\n    {\n        public string Transfer(string fromIban, string toIban, decimal amount, string currency, string reference)\n        {\n            fromIban = fromIban.Replace(\" \", \"\").ToUpperInvariant();\n            toIban = toIban.Replace(\" \", \"\").ToUpperInvariant();\n            if (fromIban.Length < 15 || toIban.Length < 15)\n            {\n                throw new ArgumentException(\"IBAN too short\");\n            }\n            if (amount <= 0)\n            {\n                throw new ArgumentException(\"Amount must be positive\");\n            }\n            if (currency != \"EUR\" && currency != \"CHF\")\n            {\n                throw new ArgumentException(\"Unsupported currency \" + currency);\n            }\n            decimal fee = FeeRules.FeeFor(fromIban, toIban, amount, currency);\n            return $\"{fromIban} -> {toIban}: {amount + fee:0.00} {currency} ({reference})\";\n        }\n    }\n}\n",
            "primitive-obsession-cs-transfers/before/Program.cs": "namespace Bank.Legacy\n{\n    public static class Program\n    {\n        public static string Demo(PaymentService payments)\n        {\n            // Compiles fine: reference and toIban are swapped, and 12.5 has no currency.\n            return payments.Transfer(\"DE89 3704 0044 0532 0130 00\", \"Rent July\", 12.5m, \"EUR\", \"CH93 0076 2011 6238 5295 7\");\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "magic-numbers",
      "name": "Magic Numbers",
      "family": "Anti-patterns",
      "aka": [
        "Magic strings",
        "Unnamed constants",
        "Hard-coded values"
      ],
      "tagline": "Unexplained literals like 0.12, 86400000 or \"admin\" hide what the code means.",
      "intent": "Magic numbers and magic strings are literal values dropped into code without a name: a 1.4 surcharge, a status code 3, a physics layer 4, a role 'admin'. Readers cannot tell what they mean or whether two equal literals are the same rule, so changes miss copies and misreadings become bugs. The fix is to give each value a name (a constant, an enum, an exported setting) with its unit, defined once.",
      "analogy": "A recipe that says 'add 3 of the white stuff and bake at 7'. The cook who wrote it knows; everyone after them guesses.",
      "cityShape": "In before/ the logic sits in a few thick floors with almost no roof antennas, because the knowledge is buried inside expressions. In after/ antennas sprout: named exports on player.gd's roof and constant-filled buildings like game_layers.gd, config.ts, domain.ts and Tariff.java, while the logic floors get thinner and cooler as if-chains turn into lookups and named factors.",
      "roles": [
        {
          "name": "Magic Literals",
          "desc": "Code where tuning values, codes and identifiers appear as bare numbers or strings."
        },
        {
          "name": "Misread Copy",
          "desc": "A second place that uses the same literal (or the wrong one) because its meaning was never written down."
        },
        {
          "name": "Named Constants",
          "desc": "In after/: constants, enums and exported settings that give each value a name, a unit and one definition."
        },
        {
          "name": "Readable Logic",
          "desc": "In after/: the same calculations, now expressed with names instead of raw literals."
        }
      ],
      "whenToUse": [
        "Values are tuned by trial and error ('420 feels right') and stay in the line where they were typed.",
        "Codes from a backend or database (status 3, region 1) are copied straight from an API response into if statements.",
        "Strings like 'admin', 'jump' or 'enemies' are typed by hand in several files, so a typo compiles and fails quietly."
      ],
      "pitfalls": [
        "Replace each literal with a named constant, including its unit (ORDER_CACHE_TTL_MS, coyote_time in seconds).",
        "Turn related codes into an enum (OrderStatus, Region, VehicleCategory) and put strings like animation names and roles into constants or types.",
        "In Godot, expose tuning values with @export so designers can change them in the inspector instead of in code. Leave 0, 1 and obvious maths alone."
      ],
      "related": [
        "primitive-obsession",
        "shotgun-surgery",
        "dry",
        "kiss-yagni"
      ],
      "quiz": [
        {
          "q": "Which literal is usually fine to leave in code?",
          "options": [
            "0.12 as a coyote time",
            "86400000 as a cache duration",
            "The 2 in 'x / 2' to find the middle",
            "429 as an HTTP status"
          ],
          "answer": 2,
          "why": "Values whose meaning is obvious from the maths (0, 1, halving) need no name. Domain values, units and codes do."
        },
        {
          "q": "In the TypeScript demo, why could orderList.ts check status === 4 for 'shipped'?",
          "options": [
            "4 really means shipped",
            "With raw numbers there is no single definition of what each code means, so a wrong guess still compiles",
            "TypeScript converts 4 to 3",
            "Because the API returns strings"
          ],
          "answer": 1,
          "why": "Without an enum, every file re-learns the codes. OrderStatus.Shipped gives the meaning one home, and a non-existent status cannot be written."
        }
      ],
      "demos": [
        {
          "id": "magic-numbers-gd-platformer",
          "title": "Platformer tuning values",
          "lang": "GDScript",
          "level": "beginner",
          "source": null,
          "story": "A Godot player controller full of 980, 220, -420, 0.12 and collision layer 4, plus spikes that check layer 2. In after/ every value is a named @export with a unit, animation names are constants and layers live in GameLayers.",
          "roles": {
            "Magic Literals": [
              "magic-numbers-gd-platformer/before/player.gd#_physics_process",
              "magic-numbers-gd-platformer/before/player.gd#hurt"
            ],
            "Misread Copy": [
              "magic-numbers-gd-platformer/before/spikes.gd#_on_body_entered"
            ],
            "Named Constants": [
              "magic-numbers-gd-platformer/after/game_layers.gd",
              "magic-numbers-gd-platformer/after/player.gd#coyote_time",
              "magic-numbers-gd-platformer/after/player.gd#jump_velocity"
            ],
            "Readable Logic": [
              "magic-numbers-gd-platformer/after/player.gd#apply_gravity",
              "magic-numbers-gd-platformer/after/player.gd#jump"
            ]
          },
          "trace": [
            {
              "at": "magic-numbers-gd-platformer/before/player.gd#_physics_process",
              "say": "Seven bare numbers in one function. Is 600 a speed or a height? To tune the jump you must read and re-test the whole thing."
            },
            {
              "at": "magic-numbers-gd-platformer/before/player.gd#hurt",
              "say": "collision_mask &= ~4 means 'ignore enemies', but only if layer 3 (bit value 4) is still enemies. Nothing says so."
            },
            {
              "at": "magic-numbers-gd-platformer/before/spikes.gd#_on_body_entered",
              "say": "Spikes compare collision_layer == 2. If the player ever gets a second layer, == fails and spikes stop hurting."
            },
            {
              "at": "magic-numbers-gd-platformer/after/player.gd#_physics_process",
              "say": "After: the same flow reads like prose: run_speed, acceleration, ANIM_RUN. Designers tune values in the inspector."
            },
            {
              "at": "magic-numbers-gd-platformer/after/player.gd#apply_gravity",
              "say": "gravity and max_fall_speed are named @exports with units in a comment. Gravity moved into its own small floor."
            },
            {
              "at": "magic-numbers-gd-platformer/after/player.gd#hurt",
              "say": "The mask uses GameLayers.ENEMIES, and the invincibility time has a name you can search for."
            },
            {
              "at": "magic-numbers-gd-platformer/after/spikes.gd#_on_body_entered",
              "say": "Spikes test the PLAYER bit with & instead of ==, and damage is an export per spike scene."
            }
          ],
          "files": {
            "magic-numbers-gd-platformer/after/game_layers.gd": "class_name GameLayers\nextends RefCounted\n\n# Physics layers as named bit values. They match Project Settings > Layer Names.\n\nconst PLAYER := 1 << 1\nconst ENEMIES := 1 << 2\n",
            "magic-numbers-gd-platformer/after/player.gd": "extends CharacterBody2D\n\n# Every tuning value has a name, a unit and lives in the inspector.\n\nconst ANIM_IDLE := &\"idle\"\nconst ANIM_RUN := &\"run\"\nconst ANIM_JUMP := &\"jump\"\nconst RUN_ANIM_MIN_SPEED := 10.0\n\n@export var gravity := 980.0              # px/s²\n@export var max_fall_speed := 600.0       # px/s\n@export var run_speed := 220.0            # px/s\n@export var acceleration := 1400.0        # px/s²\n@export var jump_velocity := -420.0       # px/s, negative is up\n@export var coyote_time := 0.12           # s you may still jump after leaving a ledge\n@export var knockback_velocity := -250.0  # px/s\n@export var invincible_time := 1.5        # s\n\nconst HURT_TINT := Color(1, 0.3, 0.3)\n\nvar coyote_left := 0.0\n\nfunc _physics_process(delta: float) -> void:\n\tapply_gravity(delta)\n\tvar dir := Input.get_axis(\"ui_left\", \"ui_right\")\n\tvelocity.x = move_toward(velocity.x, dir * run_speed, acceleration * delta)\n\tif Input.is_action_just_pressed(\"ui_accept\") and coyote_left > 0:\n\t\tjump()\n\telif is_on_floor():\n\t\t$AnimatedSprite2D.play(ANIM_RUN if abs(velocity.x) > RUN_ANIM_MIN_SPEED else ANIM_IDLE)\n\tmove_and_slide()\n\nfunc apply_gravity(delta: float) -> void:\n\tif is_on_floor():\n\t\tcoyote_left = coyote_time\n\t\treturn\n\tvelocity.y = min(velocity.y + gravity * delta, max_fall_speed)\n\tcoyote_left -= delta\n\nfunc jump() -> void:\n\tvelocity.y = jump_velocity\n\tcoyote_left = 0\n\t$AnimatedSprite2D.play(ANIM_JUMP)\n\nfunc hurt(_amount: int) -> void:\n\tmodulate = HURT_TINT\n\tvelocity.y = knockback_velocity\n\tcollision_mask &= ~GameLayers.ENEMIES\n\tawait get_tree().create_timer(invincible_time).timeout\n\tcollision_mask |= GameLayers.ENEMIES\n\tmodulate = Color.WHITE\n",
            "magic-numbers-gd-platformer/after/spikes.gd": "extends Area2D\n\n@export var damage := 25\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.collision_layer & GameLayers.PLAYER:\n\t\tbody.hurt(damage)\n",
            "magic-numbers-gd-platformer/before/player.gd": "extends CharacterBody2D\n\n# Works great. Now: why 0.12? Is 420 the jump height or speed? Which layer is 4?\n\nvar coyote := 0.0\n\nfunc _physics_process(delta: float) -> void:\n\tif not is_on_floor():\n\t\tvelocity.y = min(velocity.y + 980 * delta, 600)\n\t\tcoyote -= delta\n\telse:\n\t\tcoyote = 0.12\n\tvar dir := Input.get_axis(\"ui_left\", \"ui_right\")\n\tvelocity.x = move_toward(velocity.x, dir * 220, 1400 * delta)\n\tif Input.is_action_just_pressed(\"ui_accept\") and coyote > 0:\n\t\tvelocity.y = -420\n\t\tcoyote = 0\n\t\t$AnimatedSprite2D.play(\"jump\")\n\telif is_on_floor():\n\t\t$AnimatedSprite2D.play(\"run\" if abs(velocity.x) > 10 else \"idle\")\n\tmove_and_slide()\n\nfunc hurt(amount: int) -> void:\n\tmodulate = Color(1, 0.3, 0.3)\n\tvelocity.y = -250\n\tcollision_mask &= ~4\n\tawait get_tree().create_timer(1.5).timeout\n\tcollision_mask |= 4\n\tmodulate = Color(1, 1, 1)\n",
            "magic-numbers-gd-platformer/before/spikes.gd": "extends Area2D\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body.collision_layer == 2:\n\t\tbody.hurt(25)\n"
          }
        },
        {
          "id": "magic-numbers-ts-orders",
          "title": "Order status codes in a web app",
          "lang": "TypeScript",
          "level": "intermediate",
          "source": null,
          "story": "An order client with a 86400000 cache, retries on 429/503, numeric status codes and role strings. Another file already uses the wrong code for 'shipped'. In after/ config.ts and domain.ts name everything, and an OrderStatus enum makes the bug impossible.",
          "roles": {
            "Magic Literals": [
              "magic-numbers-ts-orders/before/orderApi.ts#fetchOrder",
              "magic-numbers-ts-orders/before/orderView.ts#orderBadge"
            ],
            "Misread Copy": [
              "magic-numbers-ts-orders/before/orderList.ts#isOnTheWay"
            ],
            "Named Constants": [
              "magic-numbers-ts-orders/after/config.ts",
              "magic-numbers-ts-orders/after/domain.ts#OrderStatus"
            ],
            "Readable Logic": [
              "magic-numbers-ts-orders/after/orderApi.ts#fetchOrder",
              "magic-numbers-ts-orders/after/orderView.ts#canRefund"
            ]
          },
          "trace": [
            {
              "at": "magic-numbers-ts-orders/before/orderApi.ts#fetchOrder",
              "say": "86400000, 4, 250, 429, 503, 'X-7': six decisions with no names. Is 4 attempts or retries? Is the cache a day or a typo?"
            },
            {
              "at": "magic-numbers-ts-orders/before/orderView.ts#orderBadge",
              "say": "Status codes 1, 2, 3, 9 are decoded inline, and 15000 cents is a refund policy hidden in a condition."
            },
            {
              "at": "magic-numbers-ts-orders/before/orderList.ts#isOnTheWay",
              "say": "A second file guesses 4 means shipped. It compiles, and orders never show as on the way."
            },
            {
              "at": "magic-numbers-ts-orders/after/orderApi.ts#fetchOrder",
              "say": "After: the same retry loop reads ORDER_CACHE_TTL_MS, MAX_ATTEMPTS and RETRYABLE_STATUS from config.ts."
            },
            {
              "at": "magic-numbers-ts-orders/after/orderApi.ts#backoffMs",
              "say": "The backoff formula gets a name, so the 'why' of 250 * 2^n is no longer a comment you hope exists."
            },
            {
              "at": "magic-numbers-ts-orders/after/orderView.ts#canRefund",
              "say": "The refund policy is its own function using OrderStatus.Cancelled and SUPPORT_REFUND_LIMIT_CENTS."
            },
            {
              "at": "magic-numbers-ts-orders/after/orderList.ts#isOnTheWay",
              "say": "OrderStatus.Shipped replaces the guess. There is no member for 4, so the old bug cannot be typed."
            }
          ],
          "files": {
            "magic-numbers-ts-orders/after/config.ts": "// Every tuning knob in one place, with a unit in its name.\n\nexport const CLIENT_ID = 'X-7'; // issued by the backend team, see API contract §2\nexport const ORDER_CACHE_TTL_MS = 24 * 60 * 60 * 1000;\nexport const MAX_ATTEMPTS = 4;\nexport const BACKOFF_BASE_MS = 250;\nexport const SUPPORT_REFUND_LIMIT_CENTS = 15_000;\nexport const NOTE_PREVIEW_CHARS = 40;\n\nexport const HTTP_OK = 200;\nexport const RETRYABLE_STATUS = new Set([429, 503]); // Too Many Requests, Service Unavailable\n",
            "magic-numbers-ts-orders/after/domain.ts": "// The backend's numeric codes get names once; the rest of the app uses the names.\n\nexport enum OrderStatus {\n  Paid = 1,\n  Packed = 2,\n  Shipped = 3,\n  Cancelled = 9,\n}\n\nexport type Role = 'admin' | 'support' | 'customer';\n\nexport interface OrderDto { status: OrderStatus; total: number; note: string; }\n\nexport const STATUS_LABEL: Record<OrderStatus, string> = {\n  [OrderStatus.Paid]: 'Paid',\n  [OrderStatus.Packed]: 'Packed',\n  [OrderStatus.Shipped]: 'Shipped',\n  [OrderStatus.Cancelled]: 'Cancelled',\n};\n",
            "magic-numbers-ts-orders/after/orderApi.ts": "import { CLIENT_ID, ORDER_CACHE_TTL_MS, MAX_ATTEMPTS, BACKOFF_BASE_MS, HTTP_OK, RETRYABLE_STATUS } from './config';\nimport { OrderDto } from './domain';\n\nconst cache = new Map<string, { at: number; data: OrderDto }>();\n\nfunction backoffMs(attempt: number): number {\n  return BACKOFF_BASE_MS * 2 ** attempt;\n}\n\nexport async function fetchOrder(id: string): Promise<OrderDto> {\n  const hit = cache.get(id);\n  if (hit && Date.now() - hit.at < ORDER_CACHE_TTL_MS) return hit.data;\n  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {\n    const res = await fetch('/api/orders/' + id, { headers: { 'X-Client': CLIENT_ID } });\n    if (res.status === HTTP_OK) {\n      const data: OrderDto = await res.json();\n      cache.set(id, { at: Date.now(), data });\n      return data;\n    }\n    if (!RETRYABLE_STATUS.has(res.status)) throw new Error('HTTP ' + res.status);\n    await new Promise(r => setTimeout(r, backoffMs(attempt)));\n  }\n  throw new Error('gave up after ' + MAX_ATTEMPTS + ' attempts');\n}\n",
            "magic-numbers-ts-orders/after/orderList.ts": "import { fetchOrder } from './orderApi';\nimport { OrderStatus } from './domain';\n\n// \"4\" is not a status. With the enum the bug cannot be written.\nexport async function isOnTheWay(id: string): Promise<boolean> {\n  const order = await fetchOrder(id);\n  return order.status === OrderStatus.Shipped;\n}\n",
            "magic-numbers-ts-orders/after/orderView.ts": "import { fetchOrder } from './orderApi';\nimport { OrderDto, OrderStatus, Role, STATUS_LABEL } from './domain';\nimport { SUPPORT_REFUND_LIMIT_CENTS, NOTE_PREVIEW_CHARS } from './config';\n\nexport function canRefund(order: OrderDto, role: Role): boolean {\n  if (order.status === OrderStatus.Cancelled) return false;\n  return role === 'admin' || (role === 'support' && order.total < SUPPORT_REFUND_LIMIT_CENTS);\n}\n\nexport async function orderBadge(id: string, role: Role): Promise<string> {\n  const order = await fetchOrder(id);\n  const label = STATUS_LABEL[order.status] ?? 'Unknown';\n  return label + (canRefund(order, role) ? ' [refund]' : '') + ' ' + order.note.slice(0, NOTE_PREVIEW_CHARS);\n}\n",
            "magic-numbers-ts-orders/before/orderApi.ts": "// orderApi.ts: talks to the order backend. Quiz for the reviewer:\n// what is status 3? why 4? why 86400000? why 'X-7'?\n\nconst cache = new Map<string, { at: number; data: any }>();\n\nexport async function fetchOrder(id: string): Promise<any> {\n  const hit = cache.get(id);\n  if (hit && Date.now() - hit.at < 86400000) return hit.data;\n  for (let attempt = 0; attempt < 4; attempt++) {\n    const res = await fetch('/api/orders/' + id, { headers: { 'X-Client': 'X-7' } });\n    if (res.status === 200) {\n      const data = await res.json();\n      cache.set(id, { at: Date.now(), data });\n      return data;\n    }\n    if (res.status !== 429 && res.status !== 503) throw new Error('HTTP ' + res.status);\n    await new Promise(r => setTimeout(r, 250 * 2 ** attempt));\n  }\n  throw new Error('gave up');\n}\n",
            "magic-numbers-ts-orders/before/orderList.ts": "import { fetchOrder } from './orderApi';\n\n// Written by someone else: they think 4 means shipped.\nexport async function isOnTheWay(id: string): Promise<boolean> {\n  const order = await fetchOrder(id);\n  return order.status === 4;\n}\n",
            "magic-numbers-ts-orders/before/orderView.ts": "import { fetchOrder } from './orderApi';\n\nexport async function orderBadge(id: string, role: string): Promise<string> {\n  const order = await fetchOrder(id);\n  let label = 'Unknown';\n  if (order.status === 1) label = 'Paid';\n  else if (order.status === 2) label = 'Packed';\n  else if (order.status === 3) label = 'Shipped';\n  else if (order.status === 9) label = 'Cancelled';\n  const canRefund = role === 'admin' || (role === 'support' && order.total < 15000);\n  return label + (canRefund && order.status !== 9 ? ' [refund]' : '') + ' ' + order.note.slice(0, 40);\n}\n"
          }
        },
        {
          "id": "magic-numbers-java-insurance",
          "title": "Insurance premium tariff",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "A car insurance premium is computed from 380.0, 1.4 (used twice for different things), region code 3, category \"S\" and a 2500 cap. In after/ a Tariff class, Region and VehicleCategory enums and small factor methods give every number a name.",
          "roles": {
            "Magic Literals": [
              "magic-numbers-java-insurance/before/PremiumCalculator.java#PremiumCalculator.yearlyPremium"
            ],
            "Misread Copy": [
              "magic-numbers-java-insurance/before/PremiumCalculator.java#PremiumCalculator.monthly",
              "magic-numbers-java-insurance/before/QuoteController.java#QuoteController.quote"
            ],
            "Named Constants": [
              "magic-numbers-java-insurance/after/Tariff.java#Tariff",
              "magic-numbers-java-insurance/after/Region.java#Region",
              "magic-numbers-java-insurance/after/VehicleCategory.java#VehicleCategory"
            ],
            "Readable Logic": [
              "magic-numbers-java-insurance/after/PremiumPricing.java#PremiumPricing"
            ]
          },
          "trace": [
            {
              "at": "magic-numbers-java-insurance/before/QuoteController.java#QuoteController.quote",
              "say": "The controller rejects ages below 18 and above 99, then passes region 3 and category \"S\" as raw codes."
            },
            {
              "at": "magic-numbers-java-insurance/before/PremiumCalculator.java#PremiumCalculator.yearlyPremium",
              "say": "1.4 appears twice: once for young drivers, once for sports cars. A tariff change to one will likely hit both."
            },
            {
              "at": "magic-numbers-java-insurance/before/PremiumCalculator.java#PremiumCalculator.monthly",
              "say": "12 is obvious, 1.03 is not: it is a monthly payment fee. Without a name it reads like a rounding trick."
            },
            {
              "at": "magic-numbers-java-insurance/after/PremiumPricing.java#PremiumPricing.ageFactor",
              "say": "After: age rules use YOUNG_DRIVER_MAX_AGE and SENIOR_DRIVER_SURCHARGE from the Tariff, defined once."
            },
            {
              "at": "magic-numbers-java-insurance/after/PremiumPricing.java#PremiumPricing.yearlyPremium",
              "say": "The premium is one product of named factors. Region and VehicleCategory carry their own factor, so the if-chains vanish."
            },
            {
              "at": "magic-numbers-java-insurance/after/PremiumPricing.java#PremiumPricing.monthly",
              "say": "MONTHLY_PAYMENT_FEE explains the 1.03, and roundToCents names the *100/100 trick."
            },
            {
              "at": "magic-numbers-java-insurance/after/QuoteEndpoint.java#QuoteEndpoint.quote",
              "say": "The endpoint takes enums, so region 4 or category \"X\" cannot reach the pricing code at all."
            }
          ],
          "files": {
            "magic-numbers-java-insurance/after/PremiumPricing.java": "package insure.v2;\n\nimport static insure.v2.Tariff.*;\n\n// The same maths, but each line now says WHAT it is, not just a number.\npublic class PremiumPricing {\n\n    public double ageFactor(int age) {\n        if (age <= YOUNG_DRIVER_MAX_AGE) {\n            return YOUNG_DRIVER_SURCHARGE;\n        }\n        return age >= SENIOR_DRIVER_MIN_AGE ? SENIOR_DRIVER_SURCHARGE : 1.0;\n    }\n\n    public double noClaimsFactor(int claimFreeYears) {\n        return Math.max(MIN_NO_CLAIMS_FACTOR, 1 - claimFreeYears * DISCOUNT_PER_CLAIM_FREE_YEAR);\n    }\n\n    public double yearlyPremium(int age, Region region, VehicleCategory category, int claimFreeYears) {\n        double premium = BASE_PREMIUM_EUR\n                * ageFactor(age)\n                * region.factor\n                * category.factor\n                * noClaimsFactor(claimFreeYears);\n        return Math.min(roundToCents(premium), MAX_YEARLY_PREMIUM_EUR);\n    }\n\n    public double monthly(double yearly) {\n        return roundToCents(yearly / MONTHS_PER_YEAR * MONTHLY_PAYMENT_FEE);\n    }\n\n    private static double roundToCents(double eur) {\n        return Math.round(eur * 100) / 100.0;\n    }\n}\n",
            "magic-numbers-java-insurance/after/QuoteEndpoint.java": "package insure.v2;\n\nimport static insure.v2.Tariff.MAX_INSURABLE_AGE;\nimport static insure.v2.Tariff.MIN_INSURABLE_AGE;\n\npublic class QuoteEndpoint {\n    private final PremiumPricing pricing = new PremiumPricing();\n\n    public String quote(int age, Region region, VehicleCategory category, int claimFreeYears, boolean monthly) {\n        if (age < MIN_INSURABLE_AGE || age > MAX_INSURABLE_AGE) {\n            return \"Not insurable\";\n        }\n        double yearly = pricing.yearlyPremium(age, region, category, claimFreeYears);\n        return monthly ? pricing.monthly(yearly) + \" / month\" : yearly + \" / year\";\n    }\n}\n",
            "magic-numbers-java-insurance/after/Region.java": "package insure.v2;\n\n// The backend's region codes 1-3, given names and their tariff factor.\npublic enum Region {\n    RURAL(0.9),\n    SUBURBAN(1.0),\n    CITY(1.3);\n\n    public final double factor;\n\n    Region(double factor) {\n        this.factor = factor;\n    }\n}\n",
            "magic-numbers-java-insurance/after/Tariff.java": "package insure.v2;\n\n// Tariff 2026, as published by the actuarial team. One named constant per decision.\npublic final class Tariff {\n    public static final double BASE_PREMIUM_EUR = 380.0;\n    public static final double MAX_YEARLY_PREMIUM_EUR = 2500.0;\n\n    public static final int YOUNG_DRIVER_MAX_AGE = 24;\n    public static final double YOUNG_DRIVER_SURCHARGE = 1.4;\n    public static final int SENIOR_DRIVER_MIN_AGE = 71;\n    public static final double SENIOR_DRIVER_SURCHARGE = 1.25;\n\n    public static final double DISCOUNT_PER_CLAIM_FREE_YEAR = 0.05;\n    public static final double MIN_NO_CLAIMS_FACTOR = 0.3;\n\n    public static final int MONTHS_PER_YEAR = 12;\n    public static final double MONTHLY_PAYMENT_FEE = 1.03;\n\n    public static final int MIN_INSURABLE_AGE = 18;\n    public static final int MAX_INSURABLE_AGE = 99;\n\n    private Tariff() {\n    }\n}\n",
            "magic-numbers-java-insurance/after/VehicleCategory.java": "package insure.v2;\n\npublic enum VehicleCategory {\n    ELECTRIC(0.85),\n    STANDARD(1.0),\n    SPORTS(1.4);\n\n    public final double factor;\n\n    VehicleCategory(double factor) {\n        this.factor = factor;\n    }\n}\n",
            "magic-numbers-java-insurance/before/PremiumCalculator.java": "package insure;\n\n// Car insurance premium. Correct today, unreadable tomorrow: when the 2027\n// tariff changes \"the young driver surcharge\", which 1.4 do you edit?\npublic class PremiumCalculator {\n\n    public double yearlyPremium(int age, int region, String category, int claimFreeYears) {\n        double premium = 380.0;\n        if (age < 25) {\n            premium *= 1.4;\n        } else if (age > 70) {\n            premium *= 1.25;\n        }\n        if (region == 3) {\n            premium *= 1.3;\n        } else if (region == 1) {\n            premium *= 0.9;\n        }\n        if (category.equals(\"S\")) {\n            premium *= 1.4;\n        } else if (category.equals(\"E\")) {\n            premium *= 0.85;\n        }\n        premium *= Math.max(0.3, 1 - claimFreeYears * 0.05);\n        return Math.min(Math.round(premium * 100) / 100.0, 2500.0);\n    }\n\n    public double monthly(double yearly) {\n        return Math.round(yearly / 12 * 1.03 * 100) / 100.0;\n    }\n}\n",
            "magic-numbers-java-insurance/before/QuoteController.java": "package insure;\n\npublic class QuoteController {\n    private final PremiumCalculator calc = new PremiumCalculator();\n\n    public String quote(int age, int region, String category, int claimFreeYears, boolean monthly) {\n        if (age < 18 || age > 99) {\n            return \"Not insurable\";\n        }\n        double yearly = calc.yearlyPremium(age, region, category, claimFreeYears);\n        return monthly ? calc.monthly(yearly) + \" / month\" : yearly + \" / year\";\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "callback-hell",
      "name": "Callback Hell",
      "family": "Anti-patterns",
      "aka": [
        "Pyramid of doom",
        "Nested callbacks"
      ],
      "tagline": "Each async step nests inside the last one's callback until the code is a sideways pyramid.",
      "intent": "Callback Hell appears when asynchronous steps that must run in order are chained by passing callbacks, each defined inside the previous one. The code drifts right, error handling is copied at every level, parallel work and early exits are hard, and it is easy to call the final callback twice or never. The fix is to use promises, async/await, coroutines or Godot's await, so the steps read top to bottom and errors flow to one handler.",
      "analogy": "A set of Russian dolls where each doll holds the instructions for opening the next. To read step five you must open four dolls first, and if one is cracked you have no idea which.",
      "cityShape": "In before/ look for one unusually thick floor (runBackup, play, onLoginClicked): inline lambdas are not separate floors, so the whole pyramid is one slab, warm in the Node demo from its repeated if (err) checks, and almost no pipes leave it because the steps are anonymous. In after/ that slab becomes a thin floor, and a stack of small named floors appears beside it (loadConfig, fade_to, say, loadHome) with neat pipes from the entry function to each step.",
      "roles": [
        {
          "name": "Pyramid",
          "desc": "The function whose async steps are nested callback inside callback."
        },
        {
          "name": "Callback API",
          "desc": "The functions that report results through callbacks instead of returning a value or a promise."
        },
        {
          "name": "Flat Flow",
          "desc": "In after/: the same sequence written with await (or suspend calls), one line per step."
        },
        {
          "name": "Awaitable Steps",
          "desc": "In after/: small named helpers that return a promise / can be awaited, each doing one step."
        }
      ],
      "whenToUse": [
        "An API only offers callbacks (old Node fs, SDKs, signals), and each new requirement adds 'and then…' one level deeper.",
        "Sequencing is done by connecting a signal or timer inside the handler of the previous one.",
        "Error handling is added per level by copy-paste, because there is no single place where failures arrive."
      ],
      "pitfalls": [
        "Switch to the promise or suspend version of the API (fs/promises, fetch, suspend functions), or wrap a callback API once in a Promise.",
        "Write the steps with async/await (Godot: await signal), extract each step into a small named function, and keep one try/catch at the top.",
        "Run independent steps in parallel on purpose (Promise.all, async/await in coroutineScope) instead of nesting them by accident."
      ],
      "related": [
        "async-await",
        "pipes-and-filters",
        "spaghetti-code",
        "option-result"
      ],
      "quiz": [
        {
          "q": "In the Node backup demo, which bug is hard to see in the callback version?",
          "options": [
            "It copies files twice",
            "done() can be called several times if more than one copy fails",
            "It never creates the target folder",
            "It deletes the source files"
          ],
          "answer": 1,
          "why": "Each failing copyFile callback calls done(err). With async/await and Promise.all the function rejects exactly once, and the caller's catch runs once."
        },
        {
          "q": "In Godot 4, what replaces connecting a timer's timeout inside another callback?",
          "options": [
            "yield(get_tree(), 'idle_frame')",
            "await get_tree().create_timer(2.0).timeout",
            "A while loop that checks the time",
            "call_deferred()"
          ],
          "answer": 1,
          "why": "await pauses the function until the signal fires and then continues on the next line, so sequential steps stay flat and readable."
        }
      ],
      "demos": [
        {
          "id": "callback-hell-js-backup",
          "title": "Node.js file backup",
          "lang": "JavaScript",
          "level": "beginner",
          "source": null,
          "story": "A Node script reads a config, creates a folder, copies .txt files, appends a log and posts a report, using callback-style fs. The before/ code is seven levels deep; the after/ code uses fs/promises and async/await.",
          "roles": {
            "Pyramid": [
              "callback-hell-js-backup/before/backup.js#runBackup"
            ],
            "Callback API": [
              "callback-hell-js-backup/before/notify.js#sendReport"
            ],
            "Flat Flow": [
              "callback-hell-js-backup/after/backup.js#runBackup",
              "callback-hell-js-backup/after/main.js#main"
            ],
            "Awaitable Steps": [
              "callback-hell-js-backup/after/backup.js#loadConfig",
              "callback-hell-js-backup/after/backup.js#copyTextFiles",
              "callback-hell-js-backup/after/notify.js#sendReport"
            ]
          },
          "trace": [
            {
              "at": "callback-hell-js-backup/before/main.js#main",
              "say": "main() passes a callback and checks err inside it. Results only exist inside that function."
            },
            {
              "at": "callback-hell-js-backup/before/backup.js#runBackup",
              "say": "Read, mkdir, readdir, copy, append, report: each step lives inside the previous callback. 'if (err) return done(err)' is repeated at every level."
            },
            {
              "at": "callback-hell-js-backup/before/notify.js#sendReport",
              "say": "The webhook helper is callback-style too, so even the last step adds another level."
            },
            {
              "at": "callback-hell-js-backup/after/backup.js#runBackup",
              "say": "After: the same six steps, one await per line. Errors throw and travel up on their own."
            },
            {
              "at": "callback-hell-js-backup/after/backup.js#copyTextFiles",
              "say": "Copies run in parallel with Promise.all, and the function rejects once, not once per failed file."
            },
            {
              "at": "callback-hell-js-backup/after/notify.js#sendReport",
              "say": "The webhook returns a promise; the caller decides with .catch that a failed report is only a warning."
            },
            {
              "at": "callback-hell-js-backup/after/main.js#main",
              "say": "One try/catch handles every failure. The pyramid's thick warm slab became a thin cool floor plus named helpers."
            }
          ],
          "files": {
            "callback-hell-js-backup/after/backup.js": "// backup.js: the same steps, written top to bottom with async/await.\n// Errors flow to one place (the caller's try/catch) automatically.\nimport fs from 'fs/promises';\nimport path from 'path';\nimport { sendReport } from './notify.js';\n\nasync function loadConfig(configPath) {\n  return JSON.parse(await fs.readFile(configPath, 'utf8'));\n}\n\nasync function copyTextFiles(source, target) {\n  const names = (await fs.readdir(source)).filter(n => n.endsWith('.txt'));\n  await Promise.all(names.map(n => fs.copyFile(path.join(source, n), path.join(target, n))));\n  return names.length;\n}\n\nexport async function runBackup(configPath) {\n  const config = await loadConfig(configPath);\n  await fs.mkdir(config.target, { recursive: true });\n  const copied = await copyTextFiles(config.source, config.target);\n  if (copied === 0) return 0;\n  await fs.appendFile('backup.log', new Date().toISOString() + ' ' + copied + ' files\\n');\n  await sendReport('Backed up ' + copied + ' files').catch(err => console.warn('report failed', err));\n  return copied;\n}\n",
            "callback-hell-js-backup/after/main.js": "import { runBackup } from './backup.js';\n\nexport async function main() {\n  try {\n    const count = await runBackup('backup.json');\n    console.log('Done,', count, 'files');\n  } catch (err) {\n    console.error('Backup failed:', err.message);\n    process.exitCode = 1;\n  }\n}\n",
            "callback-hell-js-backup/after/notify.js": "// notify.js: the same webhook, returning a Promise instead of taking a callback.\n\nexport async function sendReport(text) {\n  const res = await fetch('https://hooks.example.com/backup', { method: 'POST', body: text });\n  if (!res.ok) throw new Error('webhook ' + res.status);\n}\n",
            "callback-hell-js-backup/before/backup.js": "// backup.js: copy every .txt file from notes/ to backup/, log it, then report.\n// Each step waits for the previous one, so each step is nested one level deeper.\nimport fs from 'fs';\nimport path from 'path';\nimport { sendReport } from './notify.js';\n\nexport function runBackup(configPath, done) {\n  fs.readFile(configPath, 'utf8', (err, raw) => {\n    if (err) return done(err);\n    const config = JSON.parse(raw);\n    fs.mkdir(config.target, { recursive: true }, err => {\n      if (err) return done(err);\n      fs.readdir(config.source, (err, names) => {\n        if (err) return done(err);\n        const files = names.filter(n => n.endsWith('.txt'));\n        let copied = 0;\n        if (files.length === 0) return done(null, 0);\n        files.forEach(name => {\n          fs.copyFile(path.join(config.source, name), path.join(config.target, name), err => {\n            if (err) return done(err); // may call done() several times!\n            copied++;\n            if (copied === files.length) {\n              fs.appendFile('backup.log', new Date().toISOString() + ' ' + copied + ' files\\n', err => {\n                if (err) return done(err);\n                sendReport('Backed up ' + copied + ' files', err => {\n                  if (err) console.warn('report failed', err);\n                  done(null, copied);\n                });\n              });\n            }\n          });\n        });\n      });\n    });\n  });\n}\n",
            "callback-hell-js-backup/before/main.js": "import { runBackup } from './backup.js';\n\nexport function main() {\n  runBackup('backup.json', (err, count) => {\n    if (err) {\n      console.error('Backup failed:', err.message);\n      process.exitCode = 1;\n      return;\n    }\n    console.log('Done,', count, 'files');\n  });\n}\n",
            "callback-hell-js-backup/before/notify.js": "// notify.js: a callback-style helper, (err, result) as the last argument.\nimport https from 'https';\n\nexport function sendReport(text, done) {\n  const req = https.request('https://hooks.example.com/backup', { method: 'POST' }, res => {\n    done(res.statusCode === 200 ? null : new Error('webhook ' + res.statusCode));\n  });\n  req.on('error', done);\n  req.end(text);\n}\n"
          }
        },
        {
          "id": "callback-hell-gd-cutscene",
          "title": "Godot cutscene with nested signals",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "An intro cutscene fades in, walks the hero, shows two lines, opens a door and changes scene. The before/ version connects each tween or timer inside the previous lambda; the after/ version awaits signals in order and can be skipped safely.",
          "roles": {
            "Pyramid": [
              "callback-hell-gd-cutscene/before/intro_cutscene.gd#play"
            ],
            "Callback API": [
              "callback-hell-gd-cutscene/before/trigger.gd#_on_body_entered"
            ],
            "Flat Flow": [
              "callback-hell-gd-cutscene/after/intro_cutscene.gd#run"
            ],
            "Awaitable Steps": [
              "callback-hell-gd-cutscene/after/intro_cutscene.gd#fade_to",
              "callback-hell-gd-cutscene/after/intro_cutscene.gd#walk_to",
              "callback-hell-gd-cutscene/after/intro_cutscene.gd#say"
            ]
          },
          "trace": [
            {
              "at": "callback-hell-gd-cutscene/before/trigger.gd#_on_body_entered",
              "say": "The player walks into the trigger and the cutscene starts."
            },
            {
              "at": "callback-hell-gd-cutscene/before/intro_cutscene.gd#play",
              "say": "Six beats, six nested lambdas. Adding a line of dialogue in the middle means re-indenting everything below it."
            },
            {
              "at": "callback-hell-gd-cutscene/before/intro_cutscene.gd#_unhandled_input",
              "say": "Skipping changes scene, but the pending timers and tweens still fire their callbacks on freed nodes."
            },
            {
              "at": "callback-hell-gd-cutscene/after/intro_cutscene.gd#run",
              "say": "After: the cutscene reads like a script, one await per beat. Inserting a line is inserting a line."
            },
            {
              "at": "callback-hell-gd-cutscene/after/intro_cutscene.gd#say",
              "say": "say() shows a line, awaits the timer and clears it. Two dialogue beats reuse the same helper instead of two copies."
            },
            {
              "at": "callback-hell-gd-cutscene/after/intro_cutscene.gd#fade_to",
              "say": "Tweens are awaited through their finished signal, so fade-in and fade-out share one small floor."
            },
            {
              "at": "callback-hell-gd-cutscene/after/intro_cutscene.gd#_unhandled_input",
              "say": "Skipping sets a flag that run() checks, so the rest of the sequence stops cleanly."
            }
          ],
          "files": {
            "callback-hell-gd-cutscene/after/intro_cutscene.gd": "extends Node2D\n\n# The same cutscene with await. It reads like a script for an actor,\n# one line per beat, and each helper is a small reusable floor.\n\nconst NEXT_SCENE := \"res://levels/house.tscn\"\n\n@onready var hero: Node2D = $Hero\n@onready var dialogue: Label = $UI/Dialogue\n@onready var fade: ColorRect = $UI/Fade\n\nvar skipped := false\n\nfunc run() -> void:\n\tawait fade_to(0.0)\n\tawait walk_to(480.0)\n\tawait say(\"Hero: Is anyone home?\")\n\tawait say(\"Voice: Come in... slowly.\")\n\tif skipped:\n\t\treturn\n\t$Door.play(\"open\")\n\tawait $Door.animation_finished\n\tawait fade_to(1.0)\n\tfinish()\n\nfunc fade_to(alpha: float) -> void:\n\tawait create_tween().tween_property(fade, \"modulate:a\", alpha, 1.0).finished\n\nfunc walk_to(x: float) -> void:\n\tawait create_tween().tween_property(hero, \"position:x\", x, 2.0).finished\n\nfunc say(line: String, seconds := 2.0) -> void:\n\tdialogue.text = line\n\tawait get_tree().create_timer(seconds).timeout\n\tdialogue.text = \"\"\n\nfunc finish() -> void:\n\tget_tree().change_scene_to_file(NEXT_SCENE)\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"ui_cancel\") and not skipped:\n\t\tskipped = true\n\t\tfinish()\n",
            "callback-hell-gd-cutscene/after/trigger.gd": "extends Area2D\n\n@export var cutscene: Node2D\n\nfunc _on_body_entered(_body: Node2D) -> void:\n\tcutscene.run()\n\tset_deferred(\"monitoring\", false)\n",
            "callback-hell-gd-cutscene/before/intro_cutscene.gd": "extends Node2D\n\n# Intro cutscene: fade in, walk the hero to the door, show two lines of\n# dialogue, open the door, fade out, change scene. Every step is a callback\n# connected inside the previous callback, so the code drifts to the right.\n\n@onready var hero: Node2D = $Hero\n@onready var dialogue: Label = $UI/Dialogue\n@onready var fade: ColorRect = $UI/Fade\n\nfunc play() -> void:\n\tvar t1 := create_tween()\n\tt1.tween_property(fade, \"modulate:a\", 0.0, 1.0)\n\tt1.finished.connect(func():\n\t\tvar t2 := create_tween()\n\t\tt2.tween_property(hero, \"position:x\", 480.0, 2.0)\n\t\tt2.finished.connect(func():\n\t\t\tdialogue.text = \"Hero: Is anyone home?\"\n\t\t\tget_tree().create_timer(2.0).timeout.connect(func():\n\t\t\t\tdialogue.text = \"Voice: Come in... slowly.\"\n\t\t\t\tget_tree().create_timer(2.0).timeout.connect(func():\n\t\t\t\t\tdialogue.text = \"\"\n\t\t\t\t\t$Door.play(\"open\")\n\t\t\t\t\t$Door.animation_finished.connect(func():\n\t\t\t\t\t\tvar t3 := create_tween()\n\t\t\t\t\t\tt3.tween_property(fade, \"modulate:a\", 1.0, 1.0)\n\t\t\t\t\t\tt3.finished.connect(func():\n\t\t\t\t\t\t\tget_tree().change_scene_to_file(\"res://levels/house.tscn\")\n\t\t\t\t\t\t)\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t)\n\t\t)\n\t)\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\t# Skipping is almost impossible: the pending callbacks would still fire.\n\tif event.is_action_pressed(\"ui_cancel\"):\n\t\tget_tree().change_scene_to_file(\"res://levels/house.tscn\")\n",
            "callback-hell-gd-cutscene/before/trigger.gd": "extends Area2D\n\n@export var cutscene: Node2D\n\nfunc _on_body_entered(_body: Node2D) -> void:\n\tcutscene.play()\n\tset_deferred(\"monitoring\", false)\n"
          }
        },
        {
          "id": "callback-hell-kt-login",
          "title": "Login flow: callbacks vs coroutines",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "An Android-style login: log in, load profile, cart and recommendations. The MVP-era presenter nests four success/error lambda pairs; the coroutine ViewModel uses suspend calls, one try/catch and loads cart and recommendations in parallel.",
          "roles": {
            "Pyramid": [
              "callback-hell-kt-login/before/LoginPresenter.kt#LoginPresenter.onLoginClicked"
            ],
            "Callback API": [
              "callback-hell-kt-login/before/CallbackApi.kt#CallbackApi",
              "callback-hell-kt-login/before/FakeCallbackApi.kt#FakeCallbackApi"
            ],
            "Flat Flow": [
              "callback-hell-kt-login/after/LoginViewModel.kt#LoginViewModel.onLoginClicked",
              "callback-hell-kt-login/after/LoginViewModel.kt#LoginViewModel.loadHome"
            ],
            "Awaitable Steps": [
              "callback-hell-kt-login/after/SuspendApi.kt#SuspendApi",
              "callback-hell-kt-login/after/LoginViewModel.kt#LoginViewModel.recommendationsOrEmpty"
            ]
          },
          "trace": [
            {
              "at": "callback-hell-kt-login/before/LoginPresenter.kt#LoginPresenter.onLoginClicked",
              "say": "Four calls, eight lambdas, five places that hide the spinner. Cart and recommendations could load at once, but nesting forces them in a row."
            },
            {
              "at": "callback-hell-kt-login/before/FakeCallbackApi.kt#FakeCallbackApi.login",
              "say": "Every API call reports through onOk or onError. Nothing is returned, so results can only be used inside the next lambda."
            },
            {
              "at": "callback-hell-kt-login/before/FakeCallbackApi.kt#FakeCallbackApi.loadRecommendations",
              "say": "The deepest call sits four levels down. Its error lambda quietly falls back to an empty list, easy to miss in review."
            },
            {
              "at": "callback-hell-kt-login/after/LoginViewModel.kt#LoginViewModel.onLoginClicked",
              "say": "After: launch a coroutine, try the whole flow, catch once. The UI state is set in exactly two places."
            },
            {
              "at": "callback-hell-kt-login/after/LoginViewModel.kt#LoginViewModel.loadHome",
              "say": "Steps read top to bottom. async starts cart and recommendations together; await joins them."
            },
            {
              "at": "callback-hell-kt-login/after/LoginViewModel.kt#LoginViewModel.recommendationsOrEmpty",
              "say": "The 'recommendations are optional' rule gets its own named function instead of hiding in the innermost error lambda."
            },
            {
              "at": "callback-hell-kt-login/after/FakeSuspendApi.kt#FakeSuspendApi.login",
              "say": "Suspend functions return values or throw, like normal code. The pyramid is gone, not just reformatted."
            }
          ],
          "files": {
            "callback-hell-kt-login/after/FakeSuspendApi.kt": "package app\n\n// The same stand-in: plain return values and exceptions, no lambdas.\nclass FakeSuspendApi : SuspendApi {\n    override suspend fun login(email: String, password: String): String {\n        require(password.isNotEmpty()) { \"empty password\" }\n        return \"token-\" + email\n    }\n\n    override suspend fun loadProfile(token: String): Profile {\n        return Profile(\"u1\", \"Ada\")\n    }\n\n    override suspend fun loadCart(token: String): Cart {\n        return Cart(2)\n    }\n\n    override suspend fun loadRecommendations(userId: String): List<String> {\n        return listOf(\"Keyboard\", \"Mouse\")\n    }\n}\n",
            "callback-hell-kt-login/after/LoginViewModel.kt": "package app\n\nimport kotlinx.coroutines.CoroutineScope\nimport kotlinx.coroutines.async\nimport kotlinx.coroutines.coroutineScope\nimport kotlinx.coroutines.launch\n\n// With coroutines the flow is flat again: one line per step, one catch for\n// all errors, and cart + recommendations load in parallel.\nclass LoginViewModel(private val remote: SuspendApi, private val scope: CoroutineScope) {\n    var state: HomeState = HomeState.Loading\n        private set\n\n    fun onLoginClicked(email: String, password: String) {\n        scope.launch {\n            state = HomeState.Loading\n            state = try {\n                loadHome(email, password)\n            } catch (e: Exception) {\n                HomeState.Failed(\"Login failed: \" + e.message)\n            }\n        }\n    }\n\n    private suspend fun loadHome(email: String, password: String): HomeState = coroutineScope {\n        val token = remote.login(email, password)\n        val profile = remote.loadProfile(token)\n        val cart = async { remote.loadCart(token) }\n        val recs = async { recommendationsOrEmpty(profile.id) }\n        HomeState.Ready(profile, cart.await(), recs.await())\n    }\n\n    private suspend fun recommendationsOrEmpty(userId: String): List<String> {\n        return try {\n            remote.loadRecommendations(userId)\n        } catch (e: Exception) {\n            emptyList()\n        }\n    }\n}\n",
            "callback-hell-kt-login/after/SuspendApi.kt": "package app\n\ndata class Profile(val id: String, val name: String)\ndata class Cart(val items: Int)\n\n// The same API as suspend functions: they return a value or throw.\ninterface SuspendApi {\n    suspend fun login(email: String, password: String): String\n    suspend fun loadProfile(token: String): Profile\n    suspend fun loadCart(token: String): Cart\n    suspend fun loadRecommendations(userId: String): List<String>\n}\n\nsealed interface HomeState {\n    object Loading : HomeState\n    data class Ready(val profile: Profile, val cart: Cart, val recs: List<String>) : HomeState\n    data class Failed(val message: String) : HomeState\n}\n",
            "callback-hell-kt-login/before/CallbackApi.kt": "package app.legacy\n\ndata class UserProfile(val id: String, val name: String)\ndata class CartSummary(val items: Int)\n\n// A classic callback API: every call takes a success lambda and an error lambda.\ninterface CallbackApi {\n    fun login(email: String, password: String, onOk: (String) -> Unit, onError: (Throwable) -> Unit)\n    fun loadProfile(token: String, onOk: (UserProfile) -> Unit, onError: (Throwable) -> Unit)\n    fun loadCart(token: String, onOk: (CartSummary) -> Unit, onError: (Throwable) -> Unit)\n    fun loadRecommendations(userId: String, onOk: (List<String>) -> Unit, onError: (Throwable) -> Unit)\n}\n\ninterface LoginView {\n    fun showSpinner(visible: Boolean)\n    fun showHome(profile: UserProfile, cart: CartSummary, recs: List<String>)\n    fun showError(message: String)\n}\n",
            "callback-hell-kt-login/before/FakeCallbackApi.kt": "package app.legacy\n\n// In-memory stand-in used by tests and the demo app.\nclass FakeCallbackApi : CallbackApi {\n    override fun login(email: String, password: String, onOk: (String) -> Unit, onError: (Throwable) -> Unit) {\n        if (password.isEmpty()) onError(IllegalArgumentException(\"empty password\")) else onOk(\"token-\" + email)\n    }\n\n    override fun loadProfile(token: String, onOk: (UserProfile) -> Unit, onError: (Throwable) -> Unit) {\n        onOk(UserProfile(\"u1\", \"Ada\"))\n    }\n\n    override fun loadCart(token: String, onOk: (CartSummary) -> Unit, onError: (Throwable) -> Unit) {\n        onOk(CartSummary(2))\n    }\n\n    override fun loadRecommendations(userId: String, onOk: (List<String>) -> Unit, onError: (Throwable) -> Unit) {\n        onOk(listOf(\"Keyboard\", \"Mouse\"))\n    }\n}\n",
            "callback-hell-kt-login/before/LoginPresenter.kt": "package app.legacy\n\n// Log in, then load profile, then cart, then recommendations. Each step is a\n// lambda inside the previous one: the \"pyramid of doom\". The error lambda is\n// copied four times, and the spinner must be hidden on five different paths.\nclass LoginPresenter(private val backend: CallbackApi, private val view: LoginView) {\n\n    fun onLoginClicked(email: String, password: String) {\n        view.showSpinner(true)\n        backend.login(email, password, { token ->\n            backend.loadProfile(token, { profile ->\n                backend.loadCart(token, { cart ->\n                    backend.loadRecommendations(profile.id, { recs ->\n                        view.showSpinner(false)\n                        view.showHome(profile, cart, recs)\n                    }, { e ->\n                        view.showSpinner(false)\n                        view.showHome(profile, cart, emptyList())\n                    })\n                }, { e ->\n                    view.showSpinner(false)\n                    view.showError(\"Cart failed: \" + e.message)\n                })\n            }, { e ->\n                view.showSpinner(false)\n                view.showError(\"Profile failed: \" + e.message)\n            })\n        }, { e ->\n            view.showSpinner(false)\n            view.showError(\"Login failed: \" + e.message)\n        })\n    }\n}\n"
          }
        }
      ]
    }
  ]
};
