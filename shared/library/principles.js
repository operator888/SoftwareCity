// Family: Principles. 9 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Principles"
  ],
  "patterns": [
    {
      "id": "single-responsibility",
      "name": "Single Responsibility (SOLID · S)",
      "family": "Principles",
      "aka": [
        "SRP",
        "One reason to change"
      ],
      "tagline": "A class should have one job, so it has only one reason to change.",
      "intent": "Keep each class or module focused on one responsibility, meaning one group of people or one kind of decision that can force it to change. When file parsing, business rules, formatting and storage live in separate pieces, a change to one cannot break the others and each piece is easy to test on its own.",
      "analogy": "A restaurant has a chef, a waiter and a cashier. If one person did all three, a new menu, a new seating plan and a new card reader would all mean retraining the same tired person.",
      "cityShape": "In before/ look for one tall building whose floors do unrelated things (load, compute, render, save) with pipes running to several outside concerns. In after/ the same floors are spread over several short buildings, and one small coordinator building pipes into each of them.",
      "roles": [
        {
          "name": "Mixed-up Class",
          "desc": "The violation: one class that does several unrelated jobs, so many different changes all land in it."
        },
        {
          "name": "Focused Class",
          "desc": "A class with a single responsibility, e.g. only parsing, only rules, only formatting or only storage."
        },
        {
          "name": "Coordinator",
          "desc": "A thin piece of code that calls the focused classes in the right order but contains no detail of its own."
        }
      ],
      "whenToUse": [
        "A class keeps changing for unrelated reasons (a new report layout, a new database column, a new e-mail text).",
        "You cannot test a business rule without a real file, database or screen.",
        "Two people keep getting merge conflicts in the same file while working on different features.",
        "A Godot node script handles input, health, UI and saving all at once."
      ],
      "pitfalls": [
        "Splitting too far: ten one-line classes that always change together are harder to follow than one cohesive class.",
        "'One responsibility' is about reasons to change, not about having one method; a class may have many methods that serve the same job.",
        "Moving code into separate classes but keeping them tightly coupled (reaching into each other's fields) gives the cost of splitting without the benefit."
      ],
      "related": [
        "coupling-cohesion",
        "facade",
        "dependency-inversion",
        "interface-segregation",
        "god-object"
      ],
      "quiz": [
        {
          "q": "What does 'responsibility' mean in the Single Responsibility Principle?",
          "options": [
            "Exactly one public method per class",
            "One reason to change, usually one person or concern that can ask for changes",
            "One file per function",
            "One instance of the class at runtime"
          ],
          "answer": 1,
          "why": "Robert C. Martin defines it as one reason to change: a class should answer to one actor or concern, not that it may only have one method."
        },
        {
          "q": "A SalesReport class loads a CSV, computes totals and writes formatted text. Marketing wants a new layout. What is the risk?",
          "options": [
            "None, layouts never touch data",
            "Editing the layout code can accidentally break loading or the maths in the same class",
            "The CSV file becomes larger",
            "The class can no longer be instantiated"
          ],
          "answer": 1,
          "why": "All three jobs share one class, its fields and its tests, so a layout change is also a risk for the parsing and the calculations."
        }
      ],
      "demos": [
        {
          "id": "single-responsibility-py-report",
          "title": "Sales report: one class vs three",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "before/ has a SalesReport that reads a CSV, does the maths and builds the text. after/ splits it into a loader, a summary and a formatter. Notice SalesSummary can now be tested with a plain list.",
          "roles": {
            "Mixed-up Class": [
              "single-responsibility-py-report/before/report.py#SalesReport"
            ],
            "Focused Class": [
              "single-responsibility-py-report/after/loader.py#CsvSalesLoader",
              "single-responsibility-py-report/after/summary.py#SalesSummary",
              "single-responsibility-py-report/after/formatter.py#TextFormatter"
            ],
            "Coordinator": [
              "single-responsibility-py-report/after/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "single-responsibility-py-report/before/main.py#main",
              "say": "Before: main() hands a file name to SalesReport and asks it to do everything."
            },
            {
              "at": "single-responsibility-py-report/before/report.py#SalesReport.save",
              "say": "save() loads the data, builds the text and writes the file. Three jobs hide behind one call."
            },
            {
              "at": "single-responsibility-py-report/before/report.py#SalesReport.build_text",
              "say": "Maths and layout are mixed in one method, so a new layout risks breaking the totals."
            },
            {
              "at": "single-responsibility-py-report/after/main.py#main",
              "say": "After: main() is a short list of steps. Each step is done by a class with one job."
            },
            {
              "at": "single-responsibility-py-report/after/loader.py#CsvSalesLoader.load",
              "say": "The loader only knows the CSV layout. A renamed column changes this file alone."
            },
            {
              "at": "single-responsibility-py-report/after/summary.py#SalesSummary.__init__",
              "say": "The summary only does maths on a list, so a test can feed it rows without any file."
            },
            {
              "at": "single-responsibility-py-report/after/formatter.py#TextFormatter.render",
              "say": "The formatter only decides the look. An HTML formatter could sit beside it without touching the maths."
            }
          ],
          "files": {
            "single-responsibility-py-report/after/formatter.py": "from .summary import SalesSummary\n\n\n# Only knows how the report looks. Swap it for an HtmlFormatter without touching the maths.\nclass TextFormatter:\n    def render(self, summary: SalesSummary):\n        lines = [\"SALES REPORT\", \"=\" * 12]\n        lines.append(f\"Total: {summary.total:.2f} EUR\")\n        lines.append(f\"Best day: {summary.best['day']} ({summary.best['amount']:.2f} EUR)\")\n        return \"\\n\".join(lines)\n",
            "single-responsibility-py-report/after/loader.py": "import csv\n\n\n# Only knows the CSV file layout. A new column name changes this file and nothing else.\nclass CsvSalesLoader:\n    def load(self, csv_path):\n        with open(csv_path, newline=\"\") as f:\n            return [{\"day\": r[\"day\"], \"amount\": float(r[\"amount\"])} for r in csv.DictReader(f)]\n",
            "single-responsibility-py-report/after/main.py": "from .loader import CsvSalesLoader\nfrom .summary import SalesSummary\nfrom .formatter import TextFormatter\n\n\n# A thin coordinator: it decides the order of the steps, each step lives in its own class.\ndef main():\n    loader = CsvSalesLoader()\n    formatter = TextFormatter()\n    rows = loader.load(\"sales.csv\")\n    summary = SalesSummary(rows)\n    text = formatter.render(summary)\n    write_file(\"report.txt\", text)\n\n\ndef write_file(out_path, text):\n    with open(out_path, \"w\") as f:\n        f.write(text)\n",
            "single-responsibility-py-report/after/summary.py": "# Only knows the business maths. Easy to unit-test with a plain list, no files needed.\nclass SalesSummary:\n    def __init__(self, rows):\n        self.total = sum(r[\"amount\"] for r in rows)\n        self.best = max(rows, key=lambda r: r[\"amount\"])\n",
            "single-responsibility-py-report/before/main.py": "from .report import SalesReport\n\n\ndef main():\n    report = SalesReport(\"sales.csv\")\n    report.save(\"report.txt\")\n",
            "single-responsibility-py-report/before/report.py": "import csv\n\n\n# One class, three reasons to change: the CSV layout, the maths, and the look of the report.\nclass SalesReport:\n    def __init__(self, csv_path):\n        self.csv_path = csv_path\n        self.rows = []\n\n    def load(self):\n        with open(self.csv_path, newline=\"\") as f:\n            for row in csv.DictReader(f):\n                self.rows.append({\"day\": row[\"day\"], \"amount\": float(row[\"amount\"])})\n\n    def build_text(self):\n        total = sum(r[\"amount\"] for r in self.rows)\n        best = max(self.rows, key=lambda r: r[\"amount\"])\n        lines = [\"SALES REPORT\", \"=\" * 12]\n        lines.append(f\"Total: {total:.2f} EUR\")\n        lines.append(f\"Best day: {best['day']} ({best['amount']:.2f} EUR)\")\n        return \"\\n\".join(lines)\n\n    def save(self, out_path):\n        self.load()\n        with open(out_path, \"w\") as f:\n            f.write(self.build_text())\n"
          }
        },
        {
          "id": "single-responsibility-gd-player",
          "title": "Godot player that does everything",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "In before/ player.gd moves, tracks health, paints the HUD label and writes save files. after/ gives each job its own node script; the level wires them with signals. Notice player.gd shrinks to movement.",
          "roles": {
            "Mixed-up Class": [
              "single-responsibility-gd-player/before/player.gd"
            ],
            "Focused Class": [
              "single-responsibility-gd-player/after/player.gd",
              "single-responsibility-gd-player/after/health.gd",
              "single-responsibility-gd-player/after/health_bar.gd",
              "single-responsibility-gd-player/after/save_service.gd"
            ],
            "Coordinator": [
              "single-responsibility-gd-player/after/level.gd#_ready"
            ]
          },
          "trace": [
            {
              "at": "single-responsibility-gd-player/before/player.gd#take_damage",
              "say": "Before: one hit changes health, paints the label, picks a colour and may reload the scene. Four concerns in one function."
            },
            {
              "at": "single-responsibility-gd-player/before/player.gd#save_game",
              "say": "The save format also lives in the player, so a new save system means editing movement code's file."
            },
            {
              "at": "single-responsibility-gd-player/after/level.gd#_ready",
              "say": "After: the level connects Health to the HUD and to its own death handler. No piece knows the others."
            },
            {
              "at": "single-responsibility-gd-player/after/player.gd#take_damage",
              "say": "The player just forwards the hit to its Health child; it no longer knows about labels or files."
            },
            {
              "at": "single-responsibility-gd-player/after/health.gd#damage",
              "say": "Health owns the rules and emits signals. Enemies and crates could reuse this same node."
            },
            {
              "at": "single-responsibility-gd-player/after/health_bar.gd#show_health",
              "say": "The HUD label decides how health looks. Restyling it cannot break gameplay."
            },
            {
              "at": "single-responsibility-gd-player/after/level.gd#_on_checkpoint",
              "say": "At a checkpoint the level asks SaveService to store the spot, the only script that knows the file format."
            },
            {
              "at": "single-responsibility-gd-player/after/save_service.gd#save_checkpoint",
              "say": "Switching to binary or cloud saves now touches this one file."
            }
          ],
          "files": {
            "single-responsibility-gd-player/after/health.gd": "class_name Health\nextends Node\n\n# Owns the health rules and nothing else. It announces changes with signals.\nsignal changed(current: int, maximum: int)\nsignal depleted\n\n@export var max_health := 100\nvar current := 100\n\nfunc damage(amount: int) -> void:\n\tcurrent = max(current - amount, 0)\n\tchanged.emit(current, max_health)\n\tif current == 0:\n\t\tdepleted.emit()\n",
            "single-responsibility-gd-player/after/health_bar.gd": "extends Label\n\n# Owns how health looks on screen. Designers can restyle it without opening player code.\nfunc show_health(current: int, maximum: int) -> void:\n\ttext = \"HP %d / %d\" % [current, maximum]\n\tmodulate = Color.RED if current <= maximum / 4 else Color.WHITE\n",
            "single-responsibility-gd-player/after/level.gd": "extends Node2D\n\n# The level connects the focused pieces. Each one can be reused or replaced alone.\n@onready var player: Player = $Player\n@onready var health_bar = $HUD/HealthBar\n@onready var saves: SaveService = $SaveService\n\nfunc _ready() -> void:\n\tplayer.health.changed.connect(health_bar.show_health)\n\tplayer.health.depleted.connect(_on_player_died)\n\tplayer.checkpoint_reached.connect(_on_checkpoint)\n\nfunc _on_checkpoint(spot: Vector2) -> void:\n\tsaves.save_checkpoint(spot, player.health.current)\n\nfunc _on_player_died() -> void:\n\tget_tree().reload_current_scene()\n",
            "single-responsibility-gd-player/after/player.gd": "class_name Player\nextends CharacterBody2D\n\n# The player now only moves and forwards hits to its Health child.\nsignal checkpoint_reached(spot: Vector2)\n\nconst SPEED := 220.0\n@onready var health: Health = $Health\n\nfunc _physics_process(_delta: float) -> void:\n\tvelocity = Input.get_vector(\"left\", \"right\", \"up\", \"down\") * SPEED\n\tmove_and_slide()\n\nfunc take_damage(amount: int) -> void:\n\thealth.damage(amount)\n\nfunc reach_checkpoint() -> void:\n\tcheckpoint_reached.emit(position)\n",
            "single-responsibility-gd-player/after/save_service.gd": "class_name SaveService\nextends Node\n\n# Owns the save file format. A move to binary saves or cloud saves happens only here.\nconst SAVE_PATH := \"user://checkpoint.json\"\n\nfunc save_checkpoint(spot: Vector2, health: int) -> void:\n\tvar file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)\n\tvar data := {\"x\": spot.x, \"y\": spot.y, \"health\": health}\n\tfile.store_string(JSON.stringify(data))\n",
            "single-responsibility-gd-player/before/player.gd": "extends CharacterBody2D\n\n# One script with four jobs: movement, health rules, drawing the HUD and saving.\n# A change to the save format or the HUD colours means editing the player.\nconst SPEED := 220.0\nconst SAVE_PATH := \"user://checkpoint.json\"\n\n@export var max_health := 100\nvar health := 100\n@onready var health_label: Label = $\"../HUD/HealthLabel\"\n\nfunc _physics_process(_delta: float) -> void:\n\tvelocity = Input.get_vector(\"left\", \"right\", \"up\", \"down\") * SPEED\n\tmove_and_slide()\n\nfunc take_damage(amount: int) -> void:\n\thealth = max(health - amount, 0)\n\thealth_label.text = \"HP %d / %d\" % [health, max_health]\n\tif health <= max_health / 4:\n\t\thealth_label.modulate = Color.RED\n\tif health == 0:\n\t\tget_tree().reload_current_scene()\n\nfunc reach_checkpoint() -> void:\n\tsave_game()\n\nfunc save_game() -> void:\n\tvar file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)\n\tvar data := {\"x\": position.x, \"y\": position.y, \"health\": health}\n\tfile.store_string(JSON.stringify(data))\n"
          }
        },
        {
          "id": "single-responsibility-go-signup",
          "title": "Signup endpoint: handler vs use case",
          "lang": "Go",
          "level": "advanced",
          "source": null,
          "story": "before/ has an HTTP handler that validates, hashes, runs SQL and sends SMTP mail. after/ splits it by who asks for changes: web, product rules, database, marketing and security, joined in main().",
          "roles": {
            "Mixed-up Class": [
              "single-responsibility-go-signup/before/main.go#SignupHandler"
            ],
            "Focused Class": [
              "single-responsibility-go-signup/after/httpapi/signup_handler.go#SignupEndpoint",
              "single-responsibility-go-signup/after/accounts/service.go#Service",
              "single-responsibility-go-signup/after/storage/postgres_users.go#PostgresUsers",
              "single-responsibility-go-signup/after/mail/welcome.go#SMTPWelcome"
            ],
            "Coordinator": [
              "single-responsibility-go-signup/after/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "single-responsibility-go-signup/before/main.go#SignupHandler.ServeHTTP",
              "say": "Before: one method decodes JSON, checks rules, hashes, writes SQL and replies. Five teams would edit this one function."
            },
            {
              "at": "single-responsibility-go-signup/before/main.go#SignupHandler.sendWelcome",
              "say": "Even the e-mail wording sits on the HTTP handler, so testing it needs a database and a web request."
            },
            {
              "at": "single-responsibility-go-signup/after/main.go#main",
              "say": "After: main() builds storage, mailer and hasher and passes them to the accounts service. It is the only place that sees every piece."
            },
            {
              "at": "single-responsibility-go-signup/after/httpapi/signup_handler.go#SignupEndpoint.ServeHTTP",
              "say": "The handler now only speaks HTTP: decode the body, call Register, map errors to status codes."
            },
            {
              "at": "single-responsibility-go-signup/after/accounts/service.go#Service.Register",
              "say": "Register holds the product rules and the order of steps, using small interfaces it declared itself."
            },
            {
              "at": "single-responsibility-go-signup/after/storage/postgres_users.go#PostgresUsers.Insert",
              "say": "SQL lives in storage. A schema change touches this file, not the web layer or the rules."
            },
            {
              "at": "single-responsibility-go-signup/after/mail/welcome.go#SMTPWelcome.SendWelcome",
              "say": "The welcome mail is marketing's corner. Changing the text cannot break signup validation."
            },
            {
              "at": "single-responsibility-go-signup/after/main.go#bcryptHasher.Hash",
              "say": "The hashing algorithm got its own type, so security can switch from bcrypt to argon2 in one place."
            }
          ],
          "files": {
            "single-responsibility-go-signup/after/accounts/service.go": "package accounts\n\nimport (\n\t\"context\"\n\t\"errors\"\n\t\"strings\"\n)\n\nvar ErrInvalid = errors.New(\"invalid email or password too short\")\n\n// The accounts package owns the signup rules. It describes what it needs as small\n// interfaces, so storage and e-mail live elsewhere and change for their own reasons.\ntype UserStore interface {\n\tInsert(ctx context.Context, email, passwordHash string) error\n}\n\ntype WelcomeMailer interface {\n\tSendWelcome(ctx context.Context, email string) error\n}\n\ntype Hasher interface {\n\tHash(password string) (string, error)\n}\n\ntype Service struct {\n\tusers  UserStore\n\tmailer WelcomeMailer\n\thasher Hasher\n}\n\nfunc NewService(users UserStore, mailer WelcomeMailer, hasher Hasher) *Service {\n\treturn &Service{users: users, mailer: mailer, hasher: hasher}\n}\n\n// Register is the use case: validate, hash, store, greet. No HTTP, no SQL, no SMTP.\nfunc (s *Service) Register(ctx context.Context, email, password string) error {\n\temail = normalizeEmail(email)\n\tif !strings.Contains(email, \"@\") || len(password) < 10 {\n\t\treturn ErrInvalid\n\t}\n\thash, err := s.hasher.Hash(password)\n\tif err != nil {\n\t\treturn err\n\t}\n\tif err := s.users.Insert(ctx, email, hash); err != nil {\n\t\treturn err\n\t}\n\treturn s.mailer.SendWelcome(ctx, email)\n}\n\nfunc normalizeEmail(email string) string {\n\treturn strings.ToLower(strings.TrimSpace(email))\n}\n",
            "single-responsibility-go-signup/after/httpapi/signup_handler.go": "package httpapi\n\nimport (\n\t\"encoding/json\"\n\t\"errors\"\n\t\"net/http\"\n\n\t\"example.com/shop/after/accounts\"\n)\n\n// The handler only translates HTTP to a use-case call and errors back to status codes.\ntype SignupEndpoint struct {\n\taccounts *accounts.Service\n}\n\ntype signupBody struct {\n\tEmail    string `json:\"email\"`\n\tPassword string `json:\"password\"`\n}\n\nfunc NewSignupEndpoint(svc *accounts.Service) *SignupEndpoint {\n\treturn &SignupEndpoint{accounts: svc}\n}\n\nfunc (h *SignupEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) {\n\tvar req signupBody\n\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil {\n\t\thttp.Error(w, \"bad json\", http.StatusBadRequest)\n\t\treturn\n\t}\n\terr := h.accounts.Register(r.Context(), req.Email, req.Password)\n\tif errors.Is(err, accounts.ErrInvalid) {\n\t\thttp.Error(w, err.Error(), http.StatusUnprocessableEntity)\n\t\treturn\n\t}\n\tif err != nil {\n\t\thttp.Error(w, \"signup failed\", http.StatusInternalServerError)\n\t\treturn\n\t}\n\tw.WriteHeader(http.StatusCreated)\n}\n",
            "single-responsibility-go-signup/after/mail/welcome.go": "package mail\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"net/smtp\"\n)\n\n// Only marketing's concerns: the wording and delivery of the welcome mail.\ntype SMTPWelcome struct {\n\tHost string\n\tFrom string\n}\n\nfunc (m *SMTPWelcome) SendWelcome(ctx context.Context, email string) error {\n\tbody := fmt.Sprintf(\"Subject: Welcome!\\r\\n\\r\\nHi %s, thanks for signing up.\", email)\n\treturn smtp.SendMail(m.Host, nil, m.From, []string{email}, []byte(body))\n}\n",
            "single-responsibility-go-signup/after/main.go": "package main\n\nimport (\n\t\"database/sql\"\n\t\"net/http\"\n\n\t\"example.com/shop/after/accounts\"\n\t\"example.com/shop/after/httpapi\"\n\t\"example.com/shop/after/mail\"\n\t\"example.com/shop/after/storage\"\n\t\"golang.org/x/crypto/bcrypt\"\n)\n\n// bcryptHasher is the security team's piece: changing the algorithm touches only this type.\ntype bcryptHasher struct{}\n\nfunc (bcryptHasher) Hash(password string) (string, error) {\n\tb, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)\n\treturn string(b), err\n}\n\n// main is the only place that knows all the pieces and plugs them together.\nfunc main() {\n\tdb, _ := sql.Open(\"postgres\", \"postgres://localhost/app\")\n\tusers := storage.NewPostgresUsers(db)\n\tmailer := &mail.SMTPWelcome{Host: \"localhost:25\", From: \"hello@example.com\"}\n\tsvc := accounts.NewService(users, mailer, bcryptHasher{})\n\thttp.Handle(\"/signup\", httpapi.NewSignupEndpoint(svc))\n\t_ = http.ListenAndServe(\":8080\", nil)\n}\n",
            "single-responsibility-go-signup/after/storage/postgres_users.go": "package storage\n\nimport (\n\t\"context\"\n\t\"database/sql\"\n)\n\n// Only the database team's concerns: SQL text, tables and connections.\ntype PostgresUsers struct {\n\tdb *sql.DB\n}\n\nfunc NewPostgresUsers(db *sql.DB) *PostgresUsers {\n\treturn &PostgresUsers{db: db}\n}\n\nfunc (p *PostgresUsers) Insert(ctx context.Context, email, passwordHash string) error {\n\t_, err := p.db.ExecContext(ctx, \"INSERT INTO users (email, password_hash) VALUES ($1, $2)\", email, passwordHash)\n\treturn err\n}\n",
            "single-responsibility-go-signup/before/main.go": "package main\n\nimport (\n\t\"crypto/sha256\"\n\t\"database/sql\"\n\t\"encoding/hex\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/smtp\"\n\t\"strings\"\n)\n\n// SignupHandler does everything: HTTP, validation, hashing, SQL and e-mail.\n// Product, security, DBA and marketing changes all land in this one file.\ntype SignupHandler struct {\n\tdb       *sql.DB\n\tsmtpHost string\n}\n\ntype signupRequest struct {\n\tEmail    string `json:\"email\"`\n\tPassword string `json:\"password\"`\n}\n\nfunc (h *SignupHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {\n\tvar req signupRequest\n\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil {\n\t\thttp.Error(w, \"bad json\", http.StatusBadRequest)\n\t\treturn\n\t}\n\temail := strings.ToLower(strings.TrimSpace(req.Email))\n\tif !strings.Contains(email, \"@\") || len(req.Password) < 10 {\n\t\thttp.Error(w, \"invalid email or password too short\", http.StatusUnprocessableEntity)\n\t\treturn\n\t}\n\tsum := sha256.Sum256([]byte(\"pepper:\" + req.Password))\n\thash := hex.EncodeToString(sum[:])\n\t_, err := h.db.Exec(\"INSERT INTO users (email, password_hash) VALUES ($1, $2)\", email, hash)\n\tif err != nil {\n\t\thttp.Error(w, \"could not save user\", http.StatusConflict)\n\t\treturn\n\t}\n\th.sendWelcome(email)\n\tw.WriteHeader(http.StatusCreated)\n}\n\nfunc (h *SignupHandler) sendWelcome(email string) {\n\tbody := fmt.Sprintf(\"Subject: Welcome!\\r\\n\\r\\nHi %s, thanks for signing up.\", email)\n\t_ = smtp.SendMail(h.smtpHost, nil, \"hello@example.com\", []string{email}, []byte(body))\n}\n\nfunc main() {\n\tdb, _ := sql.Open(\"postgres\", \"postgres://localhost/app\")\n\thttp.Handle(\"/signup\", &SignupHandler{db: db, smtpHost: \"localhost:25\"})\n\t_ = http.ListenAndServe(\":8080\", nil)\n}\n"
          }
        }
      ]
    },
    {
      "id": "open-closed",
      "name": "Open/Closed (SOLID · O)",
      "family": "Principles",
      "aka": [
        "OCP",
        "Open for extension, closed for modification"
      ],
      "tagline": "Add new behaviour by adding new code, not by editing code that already works.",
      "intent": "Design modules so that new cases (a new discount, weapon or file format) can be added by writing a new class that plugs into an extension point, instead of editing a growing if/else or switch. The tested core stays untouched, so old features cannot break when new ones arrive.",
      "analogy": "A power strip: you plug in a lamp, a phone charger or a kettle without rewiring the wall. The socket is the stable contract; new devices just follow it.",
      "cityShape": "In before/ look for one building with a tall, branch-heavy floor (the switch) that every feature runs through. In after/ an interface or base-class building sits in the middle, several small sibling buildings point 'implements/extends' arrows at it, and the core building has one short loop floor with a pipe to the interface only.",
      "roles": [
        {
          "name": "Switch on Type",
          "desc": "The violation: an if/else or switch that must be edited every time a new kind is added."
        },
        {
          "name": "Extension Point",
          "desc": "The interface or base class that new behaviour plugs into."
        },
        {
          "name": "Extension",
          "desc": "A concrete class for one case. New cases are new classes, often in new files."
        },
        {
          "name": "Closed Module",
          "desc": "Core code that uses only the extension point, so it never changes when extensions are added."
        }
      ],
      "whenToUse": [
        "The same switch on a 'type' string or enum appears in several places and grows with every feature.",
        "Third parties or other teams should be able to add cases (plugins, mods, new payment providers) without your source.",
        "A stable, well-tested core keeps being broken by edits that were meant for one new case.",
        "In Godot, new enemies, weapons or pickups should be droppable into the scene without editing the player."
      ],
      "pitfalls": [
        "Guessing every future variation up front creates abstractions nobody uses; add the extension point when the second or third case arrives.",
        "No code is closed against every change: choose which kind of change you protect against (new formats, new rules) and accept others.",
        "A registry of extensions still needs one place that lists them (the composition root); that is fine, it is configuration, not logic."
      ],
      "related": [
        "strategy",
        "template-method",
        "plugin-architecture",
        "polymorphism",
        "liskov-substitution"
      ],
      "quiz": [
        {
          "q": "Which change best follows the Open/Closed Principle when you add a Markdown export?",
          "options": [
            "Add a new 'md' branch to every switch on format",
            "Write a MarkdownExporter class that implements Exporter and register it",
            "Copy the ExportService and change the copy",
            "Make all exporter fields public so others can edit them"
          ],
          "answer": 1,
          "why": "The existing exporters and the service stay unchanged; the new behaviour arrives as a new class that plugs into the existing interface."
        },
        {
          "q": "Which language feature is the usual tool for making code 'closed for modification but open for extension'?",
          "options": [
            "Global variables",
            "Polymorphism through an interface or base class",
            "Longer switch statements",
            "Copy and paste"
          ],
          "answer": 1,
          "why": "Code that calls an interface method works for any future class that implements it, so new cases need no edits to the caller."
        }
      ],
      "demos": [
        {
          "id": "open-closed-ts-discounts",
          "title": "Shop discounts without the if-chain",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "before/ prices a cart with an if/else per customer type. after/ turns each discount into a DiscountRule. Notice black-friday.ts was added later without editing PriceCalculator.",
          "roles": {
            "Switch on Type": [
              "open-closed-ts-discounts/before/checkout.ts#Checkout.total"
            ],
            "Extension Point": [
              "open-closed-ts-discounts/after/discounts.ts#DiscountRule"
            ],
            "Extension": [
              "open-closed-ts-discounts/after/discounts.ts#StudentDiscount",
              "open-closed-ts-discounts/after/discounts.ts#SeniorDiscount",
              "open-closed-ts-discounts/after/black-friday.ts#BlackFridayDiscount"
            ],
            "Closed Module": [
              "open-closed-ts-discounts/after/checkout.ts#PriceCalculator"
            ]
          },
          "trace": [
            {
              "at": "open-closed-ts-discounts/before/main.ts#main",
              "say": "Before: main() asks Checkout for the total of a student's cart."
            },
            {
              "at": "open-closed-ts-discounts/before/checkout.ts#Checkout.total",
              "say": "total() checks the type in an if/else chain. A new promotion means editing, retesting and redeploying this method."
            },
            {
              "at": "open-closed-ts-discounts/after/main.ts#main",
              "say": "After: main() hands PriceCalculator a list of rules. Adding a promotion is one more item in this list."
            },
            {
              "at": "open-closed-ts-discounts/after/checkout.ts#PriceCalculator.total",
              "say": "total() loops over DiscountRule objects. It has no idea which discounts exist, so it never needs to change."
            },
            {
              "at": "open-closed-ts-discounts/after/black-friday.ts#BlackFridayDiscount.applies",
              "say": "The newest rule lives in its own file. It is asked first and declines on other dates."
            },
            {
              "at": "open-closed-ts-discounts/after/discounts.ts#StudentDiscount.applies",
              "say": "The student rule recognises Ana, so its apply() gives 10% off. Old rules stayed untouched."
            }
          ],
          "files": {
            "open-closed-ts-discounts/after/black-friday.ts": "import { Customer, DiscountRule } from \"./discounts\";\n\n// Added months later in a NEW file. PriceCalculator was not edited to support it.\nexport class BlackFridayDiscount implements DiscountRule {\n  constructor(private today: string) {}\n  applies(_customer: Customer): boolean {\n    return this.today === \"2026-11-27\";\n  }\n  apply(amount: number): number {\n    return amount * 0.6;\n  }\n}\n",
            "open-closed-ts-discounts/after/checkout.ts": "import { Customer, DiscountRule } from \"./discounts\";\n\n// Closed for modification: this loop works for discounts that do not exist yet.\nexport class PriceCalculator {\n  constructor(private rules: DiscountRule[]) {}\n\n  total(amount: number, customer: Customer): number {\n    for (const rule of this.rules) {\n      if (rule.applies(customer)) {\n        return rule.apply(amount);\n      }\n    }\n    return amount;\n  }\n}\n",
            "open-closed-ts-discounts/after/discounts.ts": "export interface Customer {\n  name: string;\n  type: string;\n}\n\n// The extension point: anything that can decide and apply a discount.\nexport interface DiscountRule {\n  applies(customer: Customer): boolean;\n  apply(amount: number): number;\n}\n\nexport class StudentDiscount implements DiscountRule {\n  applies(customer: Customer): boolean {\n    return customer.type === \"student\";\n  }\n  apply(amount: number): number {\n    return amount * 0.9;\n  }\n}\n\nexport class SeniorDiscount implements DiscountRule {\n  applies(customer: Customer): boolean {\n    return customer.type === \"senior\";\n  }\n  apply(amount: number): number {\n    return amount * 0.85;\n  }\n}\n",
            "open-closed-ts-discounts/after/main.ts": "import { PriceCalculator } from \"./checkout\";\nimport { StudentDiscount, SeniorDiscount } from \"./discounts\";\nimport { BlackFridayDiscount } from \"./black-friday\";\n\n// Open for extension: new behaviour is plugged in here, as a list of rules.\nexport function main(): void {\n  const calc = new PriceCalculator([\n    new BlackFridayDiscount(\"2026-11-27\"),\n    new StudentDiscount(),\n    new SeniorDiscount(),\n  ]);\n  console.log(calc.total(100, { name: \"Ana\", type: \"student\" }));\n}\n",
            "open-closed-ts-discounts/before/checkout.ts": "export interface Customer {\n  name: string;\n  type: string;\n}\n\n// Every new kind of discount means opening this class and adding another branch.\nexport class Checkout {\n  total(amount: number, customer: Customer): number {\n    if (customer.type === \"student\") {\n      return amount * 0.9;\n    } else if (customer.type === \"senior\") {\n      return amount * 0.85;\n    } else if (customer.type === \"employee\") {\n      return amount * 0.7;\n    }\n    return amount;\n  }\n}\n",
            "open-closed-ts-discounts/before/main.ts": "import { Checkout } from \"./checkout\";\n\nexport function main(): void {\n  const checkout = new Checkout();\n  console.log(checkout.total(100, { name: \"Ana\", type: \"student\" }));\n}\n"
          }
        },
        {
          "id": "open-closed-gd-weapons",
          "title": "Godot weapons as pluggable nodes",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "In before/ the player matches on a weapon string. In after/ each weapon extends Weapon and the player holds an exported Weapon slot. Notice rocket_launcher.gd was added without touching player.gd.",
          "roles": {
            "Switch on Type": [
              "open-closed-gd-weapons/before/player.gd#fire"
            ],
            "Extension Point": [
              "open-closed-gd-weapons/after/weapon.gd"
            ],
            "Extension": [
              "open-closed-gd-weapons/after/pistol.gd",
              "open-closed-gd-weapons/after/shotgun.gd",
              "open-closed-gd-weapons/after/rocket_launcher.gd"
            ],
            "Closed Module": [
              "open-closed-gd-weapons/after/player.gd"
            ]
          },
          "trace": [
            {
              "at": "open-closed-gd-weapons/before/player.gd#_unhandled_input",
              "say": "Before: pressing shoot calls the player's own fire() with the aim vector."
            },
            {
              "at": "open-closed-gd-weapons/before/player.gd#fire",
              "say": "fire() matches on a string. A rocket launcher would mean a new branch here and a typo risk in every other one."
            },
            {
              "at": "open-closed-gd-weapons/after/player.gd#_unhandled_input",
              "say": "After: the player calls weapon.fire() on whatever Weapon node sits in its exported slot."
            },
            {
              "at": "open-closed-gd-weapons/after/shotgun.gd#fire",
              "say": "A Shotgun answers by spreading pellets. The spread lives with the shotgun, not with the player."
            },
            {
              "at": "open-closed-gd-weapons/after/weapon.gd#spawn_bullet",
              "say": "Shared helpers live in the base class, so extensions stay tiny."
            },
            {
              "at": "open-closed-gd-weapons/after/player.gd#equip",
              "say": "Picking up a new weapon swaps the node. equip() works for weapons that have not been written yet."
            },
            {
              "at": "open-closed-gd-weapons/after/rocket_launcher.gd#fire",
              "say": "The rocket launcher arrived as a new file and scene. Player and existing weapons were not edited at all."
            }
          ],
          "files": {
            "open-closed-gd-weapons/after/pistol.gd": "class_name Pistol\nextends Weapon\n\nfunc fire(aim: Vector2) -> void:\n\tspawn_bullet(aim.normalized(), 600.0)\n",
            "open-closed-gd-weapons/after/player.gd": "class_name Player\nextends CharacterBody2D\n\n# Closed for modification: the player works with any Weapon dropped into this slot.\n@export var weapon: Weapon\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"shoot\"):\n\t\tweapon.fire(get_global_mouse_position() - global_position)\n\nfunc equip(new_weapon: Weapon) -> void:\n\tweapon.queue_free()\n\tweapon = new_weapon\n\tadd_child(new_weapon)\n",
            "open-closed-gd-weapons/after/rocket_launcher.gd": "class_name RocketLauncher\nextends Weapon\n\n# A brand new weapon: one new file and one new scene. player.gd was not touched.\nconst ROCKET := preload(\"res://rocket.tscn\")\n\nfunc fire(aim: Vector2) -> void:\n\tvar rocket := ROCKET.instantiate()\n\trocket.position = global_position\n\trocket.target = global_position + aim\n\tget_tree().current_scene.add_child(rocket)\n",
            "open-closed-gd-weapons/after/shotgun.gd": "class_name Shotgun\nextends Weapon\n\n@export var pellets := 5\n\nfunc fire(aim: Vector2) -> void:\n\tfor i in pellets:\n\t\tspawn_bullet(aim.normalized().rotated(deg_to_rad(-20 + i * 10)), 450.0)\n",
            "open-closed-gd-weapons/after/weapon.gd": "class_name Weapon\nextends Node2D\n\n# The extension point. Players talk only to this base class.\nconst BULLET := preload(\"res://bullet.tscn\")\n\nfunc fire(_aim: Vector2) -> void:\n\tpush_warning(\"%s does not override fire()\" % name)\n\nfunc spawn_bullet(direction: Vector2, speed: float) -> void:\n\tvar bullet := BULLET.instantiate()\n\tbullet.position = global_position\n\tbullet.velocity = direction * speed\n\tget_tree().current_scene.add_child(bullet)\n",
            "open-closed-gd-weapons/before/player.gd": "extends CharacterBody2D\n\n# Every new weapon means another branch here, and every branch can break the others.\nconst BULLET := preload(\"res://bullet.tscn\")\n\n@export var weapon_kind := \"pistol\"\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"shoot\"):\n\t\tfire(get_global_mouse_position() - global_position)\n\nfunc fire(aim: Vector2) -> void:\n\tmatch weapon_kind:\n\t\t\"pistol\":\n\t\t\t_spawn_bullet(aim.normalized(), 600.0)\n\t\t\"shotgun\":\n\t\t\tfor i in 5:\n\t\t\t\t_spawn_bullet(aim.normalized().rotated(deg_to_rad(-20 + i * 10)), 450.0)\n\t\t_:\n\t\t\tpush_warning(\"unknown weapon \" + weapon_kind)\n\nfunc _spawn_bullet(direction: Vector2, speed: float) -> void:\n\tvar bullet := BULLET.instantiate()\n\tbullet.position = global_position\n\tbullet.velocity = direction * speed\n\tget_parent().add_child(bullet)\n"
          }
        },
        {
          "id": "open-closed-kt-exporters",
          "title": "Report exporters with a registry",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "before/ keeps two `when (format)` blocks that must stay in sync. after/ gives each format its own Exporter and an ExportService that looks them up by key. Notice MarkdownExporter could even ship from another module.",
          "roles": {
            "Switch on Type": [
              "open-closed-kt-exporters/before/ReportExporter.kt#ReportExporter"
            ],
            "Extension Point": [
              "open-closed-kt-exporters/after/Exporter.kt#Exporter"
            ],
            "Extension": [
              "open-closed-kt-exporters/after/BuiltInExporters.kt#CsvExporter",
              "open-closed-kt-exporters/after/BuiltInExporters.kt#JsonExporter",
              "open-closed-kt-exporters/after/MarkdownExporter.kt#MarkdownExporter"
            ],
            "Closed Module": [
              "open-closed-kt-exporters/after/ExportService.kt#ExportService"
            ]
          },
          "trace": [
            {
              "at": "open-closed-kt-exporters/before/Main.kt#main",
              "say": "Before: main() asks the exporter for a content type and the body, passing the format string twice."
            },
            {
              "at": "open-closed-kt-exporters/before/ReportExporter.kt#ReportExporter.contentType",
              "say": "contentType() has its own `when`. Forget to update it and Markdown files are served with a crash."
            },
            {
              "at": "open-closed-kt-exporters/before/ReportExporter.kt#ReportExporter.export",
              "say": "export() repeats the same branching. Each new format edits a class whose CSV and JSON code already worked."
            },
            {
              "at": "open-closed-kt-exporters/after/Main.kt#main",
              "say": "After: the composition root lists the exporters once. This is configuration, not logic."
            },
            {
              "at": "open-closed-kt-exporters/after/ExportService.kt#ExportService.export",
              "say": "The service finds an Exporter by key and calls it. No format names appear in its code."
            },
            {
              "at": "open-closed-kt-exporters/after/MarkdownExporter.kt#MarkdownExporter.export",
              "say": "Markdown is a new class that carries its own type and logic. Nothing else was recompiled to add it."
            },
            {
              "at": "open-closed-kt-exporters/after/ExportService.kt#ExportService.supportedFormats",
              "say": "Even the error message stays correct for future formats, because it reads the registry instead of a hard-coded list."
            }
          ],
          "files": {
            "open-closed-kt-exporters/after/BuiltInExporters.kt": "package after\n\nclass CsvExporter : Exporter {\n    override val format = \"csv\"\n    override val contentType = \"text/csv\"\n\n    override fun export(rows: List<SalesRow>): String {\n        return \"region,revenue\\n\" + rows.joinToString(\"\\n\") { \"${it.region},${it.revenue}\" }\n    }\n}\n\nclass JsonExporter : Exporter {\n    override val format = \"json\"\n    override val contentType = \"application/json\"\n\n    override fun export(rows: List<SalesRow>): String {\n        return rows.joinToString(\",\", \"[\", \"]\") { \"\"\"{\"region\":\"${it.region}\",\"revenue\":${it.revenue}}\"\"\" }\n    }\n}\n",
            "open-closed-kt-exporters/after/ExportService.kt": "package after\n\nclass ExportResult(val contentType: String, val body: String)\n\n// Closed for modification: it looks exporters up by key and never names a concrete one.\nclass ExportService(exporters: List<Exporter>) {\n    private val byFormat: Map<String, Exporter> = exporters.associateBy { it.format }\n\n    fun supportedFormats(): Set<String> {\n        return byFormat.keys\n    }\n\n    fun export(rows: List<SalesRow>, format: String): ExportResult {\n        val chosen = byFormat[format] ?: throw IllegalArgumentException(\"Unknown format $format, try ${supportedFormats()}\")\n        return ExportResult(chosen.contentType, chosen.export(rows))\n    }\n}\n",
            "open-closed-kt-exporters/after/Exporter.kt": "package after\n\ndata class SalesRow(val region: String, val revenue: Double)\n\n// The extension point. Each format carries its own name, content type and logic,\n// so nothing has to be kept in sync across `when` blocks.\ninterface Exporter {\n    val format: String\n    val contentType: String\n    fun export(rows: List<SalesRow>): String\n}\n",
            "open-closed-kt-exporters/after/Main.kt": "package after\n\n// The composition root is the one place that lists the formats.\nfun main() {\n    val service = ExportService(listOf(CsvExporter(), JsonExporter(), MarkdownExporter()))\n    val rows = listOf(SalesRow(\"North\", 1200.0), SalesRow(\"South\", 950.0))\n    val result = service.export(rows, \"md\")\n    println(result.contentType)\n    println(result.body)\n}\n",
            "open-closed-kt-exporters/after/MarkdownExporter.kt": "package after\n\n// Shipped later, possibly from another module or a plugin JAR found via ServiceLoader.\n// ExportService and the built-in exporters were not modified.\nclass MarkdownExporter : Exporter {\n    override val format = \"md\"\n    override val contentType = \"text/markdown\"\n\n    override fun export(rows: List<SalesRow>): String {\n        val header = \"| Region | Revenue |\\n|---|---:|\\n\"\n        return header + rows.joinToString(\"\\n\") { \"| ${it.region} | ${\"%.2f\".format(it.revenue)} |\" }\n    }\n}\n",
            "open-closed-kt-exporters/before/Main.kt": "package before\n\nfun main() {\n    val exporter = ReportExporter()\n    val rows = listOf(SalesRow(\"North\", 1200.0), SalesRow(\"South\", 950.0))\n    println(exporter.contentType(\"csv\"))\n    println(exporter.export(rows, \"csv\"))\n}\n",
            "open-closed-kt-exporters/before/ReportExporter.kt": "package before\n\ndata class SalesRow(val region: String, val revenue: Double)\n\n// Two `when` blocks that must be kept in sync. Adding Markdown means editing both,\n// recompiling this class and retesting CSV and JSON that did not change.\nclass ReportExporter {\n    fun export(rows: List<SalesRow>, format: String): String = when (format) {\n        \"csv\" -> \"region,revenue\\n\" + rows.joinToString(\"\\n\") { \"${it.region},${it.revenue}\" }\n        \"json\" -> rows.joinToString(\",\", \"[\", \"]\") { \"\"\"{\"region\":\"${it.region}\",\"revenue\":${it.revenue}}\"\"\" }\n        else -> throw IllegalArgumentException(\"Unknown format $format\")\n    }\n\n    fun contentType(format: String): String = when (format) {\n        \"csv\" -> \"text/csv\"\n        \"json\" -> \"application/json\"\n        else -> throw IllegalArgumentException(\"Unknown format $format\")\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "liskov-substitution",
      "name": "Liskov Substitution (SOLID · L)",
      "family": "Principles",
      "aka": [
        "LSP",
        "Substitutability",
        "Design by contract for subtypes"
      ],
      "tagline": "A subclass must work anywhere its parent is expected, without surprises.",
      "intent": "Code written against a base type relies on that type's promises: what inputs it accepts, what it returns and what stays true. A subclass may do the job differently, but it must not demand more, deliver less or throw where the parent would not; otherwise callers need type checks and inheritance stops paying off.",
      "analogy": "A rental company promises 'a car with automatic gears'. Handing you a manual car with the same paint breaks the deal, even though it is technically a car.",
      "cityShape": "In before/ look for a subclass building whose overriding floor is short and ends in an error, plus a client floor with branches that pipe to specific subclasses (type checks). In after/ the client building has one plain loop or call floor piping only to the base type, and the hierarchy is rearranged so every 'extends' arrow points to a parent whose promises the child really keeps.",
      "roles": [
        {
          "name": "Base Type",
          "desc": "The class or interface whose contract (preconditions, results, invariants) clients rely on."
        },
        {
          "name": "Breaking Subtype",
          "desc": "The violation: a subclass that throws, ignores calls or changes meaning where the base type promised otherwise."
        },
        {
          "name": "Honest Subtype",
          "desc": "A subclass that keeps every promise of its parent, so it can be swapped in safely."
        },
        {
          "name": "Client",
          "desc": "Code written only against the base type. It reveals a violation when it needs instanceof or 'is' checks."
        }
      ],
      "whenToUse": [
        "An override throws 'not supported', does nothing, or needs extra conditions its parent did not have.",
        "Callers start writing `if x is Turret` or `instanceof FixedTermDeposit` before calling a base-class method.",
        "You model 'is-a' from real life (a square is a rectangle, a penguin is a bird) but the behaviour does not fit.",
        "You design a base class or interface that others will subclass, and must decide what it really promises."
      ],
      "pitfalls": [
        "Fixing violations with type checks in the caller hides the problem and spreads it to every new caller.",
        "Making a base method so vague that it promises nothing ('may or may not work') technically avoids violations but makes the type useless.",
        "Contracts include more than signatures: exceptions, side effects, timing and invariants all count, and compilers do not check them."
      ],
      "related": [
        "inheritance",
        "polymorphism",
        "interface-segregation",
        "open-closed",
        "composition"
      ],
      "quiz": [
        {
          "q": "Square extends Rectangle and overrides setWidth to also set the height. Why is this a Liskov violation?",
          "options": [
            "Squares have fewer fields than rectangles",
            "Code that sets width 5 and height 4 on a Rectangle expects area 20 and gets 16",
            "Overriding methods is never allowed",
            "Square should be an interface"
          ],
          "answer": 1,
          "why": "Rectangle promises that width and height change independently. Square breaks that promise, so it cannot be substituted for Rectangle."
        },
        {
          "q": "Which subclass change keeps the Liskov Substitution Principle?",
          "options": [
            "Accepting MORE inputs than the parent (weaker precondition)",
            "Throwing a new exception the parent never throws",
            "Requiring an extra condition before a method may be called",
            "Returning null where the parent always returned a value"
          ],
          "answer": 0,
          "why": "A subtype may accept more and promise more, but never accept less or promise less than its parent."
        }
      ],
      "demos": [
        {
          "id": "liskov-substitution-py-shapes",
          "title": "The classic Square and Rectangle",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "In before/ Square inherits Rectangle's setters and quietly changes their meaning. In after/ RectangleShape and SquareShape are siblings under Shape, which only promises area(). Notice make_frame() now asks for exactly what it needs.",
          "roles": {
            "Base Type": [
              "liskov-substitution-py-shapes/before/shapes.py#Rectangle",
              "liskov-substitution-py-shapes/after/shapes.py#Shape"
            ],
            "Breaking Subtype": [
              "liskov-substitution-py-shapes/before/shapes.py#Square"
            ],
            "Honest Subtype": [
              "liskov-substitution-py-shapes/after/shapes.py#RectangleShape",
              "liskov-substitution-py-shapes/after/shapes.py#SquareShape"
            ],
            "Client": [
              "liskov-substitution-py-shapes/before/main.py#make_frame",
              "liskov-substitution-py-shapes/after/main.py#total_area"
            ]
          },
          "trace": [
            {
              "at": "liskov-substitution-py-shapes/before/main.py#main",
              "say": "Before: main() sends a Rectangle and then a Square into make_frame()."
            },
            {
              "at": "liskov-substitution-py-shapes/before/main.py#make_frame",
              "say": "make_frame() sets width 5 and height 4 and fairly expects an area of 20."
            },
            {
              "at": "liskov-substitution-py-shapes/before/shapes.py#Square.set_height",
              "say": "Square's setter also changes the width, so the earlier set_width(5) is silently undone."
            },
            {
              "at": "liskov-substitution-py-shapes/before/shapes.py#Rectangle.area",
              "say": "area() returns 16 for the Square. No error, just a wrong answer: the worst kind of bug."
            },
            {
              "at": "liskov-substitution-py-shapes/after/main.py#total_area",
              "say": "After: total_area() relies only on area(), a promise RectangleShape and SquareShape both keep."
            },
            {
              "at": "liskov-substitution-py-shapes/after/shapes.py#SquareShape.area",
              "say": "SquareShape is now a sibling of RectangleShape. It has its own side and never fakes rectangle setters."
            },
            {
              "at": "liskov-substitution-py-shapes/after/main.py#make_frame",
              "say": "make_frame() needs independent sides, so it asks for a RectangleShape by type and gets a new resized copy."
            },
            {
              "at": "liskov-substitution-py-shapes/after/shapes.py#RectangleShape.with_size",
              "say": "Immutable shapes return new objects, so there is no setter left for a subclass to bend."
            }
          ],
          "files": {
            "liskov-substitution-py-shapes/after/main.py": "from .shapes import RectangleShape, Shape, SquareShape\n\n\n# Works for every Shape, including ones written next year.\ndef total_area(shapes: list[Shape]):\n    return sum(shape.area() for shape in shapes)\n\n\n# Needs width and height to differ, so it asks for a RectangleShape by type. A SquareShape cannot sneak in.\ndef make_frame(rect: RectangleShape):\n    frame = rect.with_size(5, 4)\n    return frame.area()\n\n\ndef main():\n    print(total_area([RectangleShape(2, 3), SquareShape(2)]))  # 10\n    print(make_frame(RectangleShape(2, 3)))               # 20\n",
            "liskov-substitution-py-shapes/after/shapes.py": "# The shared promise is now only what every shape can keep: \"I can tell you my area.\"\nclass Shape:\n    def area(self):\n        raise NotImplementedError\n\n\n# Shapes are immutable: \"resizing\" returns a new object, so no subclass can break a setter.\nclass RectangleShape(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def with_size(self, width, height):\n        return RectangleShape(width, height)\n\n    def area(self):\n        return self.width * self.height\n\n\nclass SquareShape(Shape):\n    def __init__(self, side):\n        self.side = side\n\n    def with_side(self, side):\n        return SquareShape(side)\n\n    def area(self):\n        return self.side * self.side\n",
            "liskov-substitution-py-shapes/before/main.py": "from .shapes import Rectangle, Square\n\n\n# Written for Rectangle. It is a fair expectation: set 5 by 4, get 20.\ndef make_frame(rect):\n    rect.set_width(5)\n    rect.set_height(4)\n    return rect.area()\n\n\ndef main():\n    print(make_frame(Rectangle(2, 3)))  # 20\n    print(make_frame(Square(2)))        # 16, surprise!\n",
            "liskov-substitution-py-shapes/before/shapes.py": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def set_width(self, width):\n        self.width = width\n\n    def set_height(self, height):\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n\n# \"A square IS-A rectangle\" sounds right in maths class, but the setters break the promise\n# that width and height can change independently.\nclass Square(Rectangle):\n    def __init__(self, side):\n        super().__init__(side, side)\n\n    def set_width(self, width):\n        self.width = width\n        self.height = width\n\n    def set_height(self, height):\n        self.width = height\n        self.height = height\n"
          }
        },
        {
          "id": "liskov-substitution-gd-enemies",
          "title": "Godot enemies: the turret that cannot chase",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "In before/ Turret extends ChasingEnemy but its chase() just errors, so the wave loop checks `is Turret`. In after/ the base Enemy promises act(), which Walker and Sentry both honour. Notice the type check disappears.",
          "roles": {
            "Base Type": [
              "liskov-substitution-gd-enemies/before/enemy.gd",
              "liskov-substitution-gd-enemies/after/enemy.gd"
            ],
            "Breaking Subtype": [
              "liskov-substitution-gd-enemies/before/turret.gd"
            ],
            "Honest Subtype": [
              "liskov-substitution-gd-enemies/after/walker.gd",
              "liskov-substitution-gd-enemies/after/sentry.gd"
            ],
            "Client": [
              "liskov-substitution-gd-enemies/before/wave.gd#_physics_process",
              "liskov-substitution-gd-enemies/after/wave.gd#_physics_process"
            ]
          },
          "trace": [
            {
              "at": "liskov-substitution-gd-enemies/before/enemy.gd#chase",
              "say": "Before: the base class ChasingEnemy promises that every enemy can chase the player."
            },
            {
              "at": "liskov-substitution-gd-enemies/before/turret.gd#chase",
              "say": "Turret inherits that promise but cannot keep it, so its override only reports an error."
            },
            {
              "at": "liskov-substitution-gd-enemies/before/wave.gd#_physics_process",
              "say": "The wave loop must now check `is Turret`. Every new odd enemy will add another branch here."
            },
            {
              "at": "liskov-substitution-gd-enemies/after/enemy.gd#act",
              "say": "After: the base promise is act() once per frame. Doing nothing is allowed, so no subclass is forced to lie."
            },
            {
              "at": "liskov-substitution-gd-enemies/after/wave.gd#_physics_process",
              "say": "The loop calls act() on every Enemy with no type checks. Any subclass can be dropped into the group."
            },
            {
              "at": "liskov-substitution-gd-enemies/after/walker.gd#act",
              "say": "A Walker keeps the promise by moving towards the target."
            },
            {
              "at": "liskov-substitution-gd-enemies/after/sentry.gd#act",
              "say": "A Sentry (the new turret) keeps the same promise in its own way: it turns and counts down its cooldown."
            },
            {
              "at": "liskov-substitution-gd-enemies/after/sentry.gd#shoot",
              "say": "Shooting is the sentry's own detail, hidden behind act() where the wave never has to know about it."
            }
          ],
          "files": {
            "liskov-substitution-gd-enemies/after/enemy.gd": "class_name Enemy\nextends CharacterBody2D\n\n# The base promise is now \"act once per frame towards the target\",\n# which a walker AND a turret can both keep. Doing nothing is a valid act.\nvar health := 30\n\nfunc act(_target: Node2D, _delta: float) -> void:\n\tpass\n\nfunc take_damage(amount: int) -> void:\n\thealth -= amount\n\tif health <= 0:\n\t\tqueue_free()\n",
            "liskov-substitution-gd-enemies/after/sentry.gd": "class_name Sentry\nextends Enemy\n\n@export var fire_interval := 1.5\nvar cooldown := 0.0\n\n# Keeps the same promise in its own way: it turns and shoots instead of walking.\nfunc act(target: Node2D, delta: float) -> void:\n\tlook_at(target.global_position)\n\tcooldown -= delta\n\tif cooldown <= 0.0:\n\t\tcooldown = fire_interval\n\t\tshoot()\n\nfunc shoot() -> void:\n\t$Muzzle/AnimationPlayer.play(\"flash\")\n",
            "liskov-substitution-gd-enemies/after/walker.gd": "class_name Walker\nextends Enemy\n\n@export var speed := 120.0\n\nfunc act(target: Node2D, _delta: float) -> void:\n\tvelocity = global_position.direction_to(target.global_position) * speed\n\tmove_and_slide()\n",
            "liskov-substitution-gd-enemies/after/wave.gd": "extends Node2D\n\n# Every Enemy is fully substitutable, so the loop needs no type checks.\n@onready var player: Node2D = $Player\n\nfunc _physics_process(delta: float) -> void:\n\tfor enemy: Enemy in get_tree().get_nodes_in_group(\"enemies\"):\n\t\tenemy.act(player, delta)\n",
            "liskov-substitution-gd-enemies/before/enemy.gd": "class_name ChasingEnemy\nextends CharacterBody2D\n\n# The base promise: every enemy can chase a target. That is the whole contract.\n@export var speed := 120.0\nvar health := 30\n\nfunc chase(target: Node2D, _delta: float) -> void:\n\tvelocity = global_position.direction_to(target.global_position) * speed\n\tmove_and_slide()\n\nfunc take_damage(amount: int) -> void:\n\thealth -= amount\n\tif health <= 0:\n\t\tqueue_free()\n",
            "liskov-substitution-gd-enemies/before/turret.gd": "class_name Turret\nextends ChasingEnemy\n\n# A turret cannot move, so it breaks the promise of its parent class.\nfunc chase(_target: Node2D, _delta: float) -> void:\n\tpush_error(\"Turrets cannot chase!\")\n\nfunc aim_at(target: Node2D) -> void:\n\tlook_at(target.global_position)\n",
            "liskov-substitution-gd-enemies/before/wave.gd": "extends Node2D\n\n# Because one subclass misbehaves, the caller has to check concrete types.\n@onready var player: Node2D = $Player\n\nfunc _physics_process(delta: float) -> void:\n\tfor enemy in get_tree().get_nodes_in_group(\"enemies\"):\n\t\tif enemy is Turret:\n\t\t\tenemy.aim_at(player)\n\t\telse:\n\t\t\tenemy.chase(player, delta)\n"
          }
        },
        {
          "id": "liskov-substitution-java-accounts",
          "title": "Bank accounts and a locked deposit",
          "lang": "Java",
          "level": "advanced",
          "source": null,
          "story": "In before/ FixedTermDeposit extends Account but adds a stronger precondition to withdraw(), so a transfer crashes halfway. In after/ BankAccount only promises deposit and balance; withdrawing moves into WithdrawableAccount, and TermDeposit gets its own operation. Notice the compiler now rejects the bad call.",
          "roles": {
            "Base Type": [
              "liskov-substitution-java-accounts/before/Account.java#Account",
              "liskov-substitution-java-accounts/after/BankAccount.java#BankAccount"
            ],
            "Breaking Subtype": [
              "liskov-substitution-java-accounts/before/FixedTermDeposit.java#FixedTermDeposit"
            ],
            "Honest Subtype": [
              "liskov-substitution-java-accounts/after/WithdrawableAccount.java#WithdrawableAccount",
              "liskov-substitution-java-accounts/after/TermDeposit.java#TermDeposit"
            ],
            "Client": [
              "liskov-substitution-java-accounts/before/TransferService.java#TransferService",
              "liskov-substitution-java-accounts/after/Transfers.java#Transfers"
            ]
          },
          "trace": [
            {
              "at": "liskov-substitution-java-accounts/before/TransferService.java#TransferService.transfer",
              "say": "Before: transfer() checks the balance, exactly as Account's contract says, then withdraws."
            },
            {
              "at": "liskov-substitution-java-accounts/before/FixedTermDeposit.java#FixedTermDeposit.withdraw",
              "say": "The deposit adds an extra rule, 'not before maturity', and throws. A stronger precondition breaks substitutability."
            },
            {
              "at": "liskov-substitution-java-accounts/before/Account.java#Account.withdraw",
              "say": "The parent's withdraw() only fails on insufficient funds. Callers had no way to foresee the new exception."
            },
            {
              "at": "liskov-substitution-java-accounts/after/Transfers.java#Transfers.transfer",
              "say": "After: transfer() asks for a WithdrawableAccount. Passing a TermDeposit is now a compile error, not a runtime crash."
            },
            {
              "at": "liskov-substitution-java-accounts/after/WithdrawableAccount.java#WithdrawableAccount.canWithdraw",
              "say": "The contract is explicit and checkable. Subclasses may allow more (a bigger overdraft), never less."
            },
            {
              "at": "liskov-substitution-java-accounts/after/WithdrawableAccount.java#WithdrawableAccount.withdraw",
              "say": "withdraw() fails only in the case canWithdraw() already reports, so the client is never surprised."
            },
            {
              "at": "liskov-substitution-java-accounts/after/BankAccount.java#BankAccount.deposit",
              "say": "Every BankAccount, term deposits included, keeps the smaller base promise: deposit and balance."
            },
            {
              "at": "liskov-substitution-java-accounts/after/TermDeposit.java#TermDeposit.closeAtMaturity",
              "say": "The deposit offers its own honest operation with its own rule, instead of bending an inherited one."
            }
          ],
          "files": {
            "liskov-substitution-java-accounts/after/BankAccount.java": "package after;\n\n/**\n * Base contract kept by EVERY account: you can deposit and read the balance.\n * Withdrawing is no longer promised here.\n */\npublic abstract class BankAccount {\n    protected long balanceCents;\n\n    public void deposit(long cents) {\n        balanceCents += cents;\n    }\n\n    public long getBalance() {\n        return balanceCents;\n    }\n}\n",
            "liskov-substitution-java-accounts/after/TermDeposit.java": "package after;\n\nimport java.time.LocalDate;\n\n/**\n * Only extends BankAccount, so it never pretends to support withdraw().\n * Its own operation states its own rule openly.\n */\npublic class TermDeposit extends BankAccount {\n    private final LocalDate maturity;\n\n    public TermDeposit(LocalDate maturity) {\n        this.maturity = maturity;\n    }\n\n    public long closeAtMaturity(LocalDate today) {\n        if (today.isBefore(maturity)) {\n            throw new IllegalStateException(\"Term ends \" + maturity);\n        }\n        long payout = balanceCents;\n        balanceCents = 0;\n        return payout;\n    }\n}\n",
            "liskov-substitution-java-accounts/after/Transfers.java": "package after;\n\npublic class Transfers {\n    // The parameter type now says exactly what is needed. The compiler rejects a\n    // TermDeposit here, so no runtime surprise and no instanceof checks.\n    public boolean transfer(WithdrawableAccount from, BankAccount to, long cents) {\n        if (!from.canWithdraw(cents)) {\n            return false;\n        }\n        from.withdraw(cents);\n        to.deposit(cents);\n        return true;\n    }\n}\n",
            "liskov-substitution-java-accounts/after/WithdrawableAccount.java": "package after;\n\n/**\n * Contract: withdraw(amount) succeeds whenever amount <= balance + overdraftLimit.\n * Subclasses may loosen this (bigger limit) but never tighten it.\n */\npublic class WithdrawableAccount extends BankAccount {\n    private final long overdraftLimitCents;\n\n    public WithdrawableAccount(long overdraftLimitCents) {\n        this.overdraftLimitCents = overdraftLimitCents;\n    }\n\n    public boolean canWithdraw(long cents) {\n        return cents <= balanceCents + overdraftLimitCents;\n    }\n\n    public void withdraw(long cents) {\n        if (!canWithdraw(cents)) {\n            throw new IllegalArgumentException(\"Insufficient funds\");\n        }\n        balanceCents -= cents;\n    }\n}\n",
            "liskov-substitution-java-accounts/before/Account.java": "package before;\n\n/**\n * Contract: withdraw(amount) succeeds whenever amount <= balance.\n */\npublic class Account {\n    protected long balanceCents;\n\n    public void deposit(long cents) {\n        balanceCents += cents;\n    }\n\n    public void withdraw(long cents) {\n        if (cents > balanceCents) {\n            throw new IllegalArgumentException(\"Insufficient funds\");\n        }\n        balanceCents -= cents;\n    }\n\n    public long getBalance() {\n        return balanceCents;\n    }\n}\n",
            "liskov-substitution-java-accounts/before/FixedTermDeposit.java": "package before;\n\nimport java.time.LocalDate;\n\n/**\n * Inherits withdraw() but adds a stronger precondition: \"and the term is over\".\n * Code written against Account cannot know about that extra rule.\n */\npublic class FixedTermDeposit extends Account {\n    private final LocalDate maturity;\n\n    public FixedTermDeposit(LocalDate maturity) {\n        this.maturity = maturity;\n    }\n\n    @Override\n    public void withdraw(long cents) {\n        if (LocalDate.now().isBefore(maturity)) {\n            throw new UnsupportedOperationException(\"Locked until \" + maturity);\n        }\n        super.withdraw(cents);\n    }\n}\n",
            "liskov-substitution-java-accounts/before/TransferService.java": "package before;\n\npublic class TransferService {\n    // Honest code, written against Account's contract. It still blows up halfway for deposits,\n    // and the only \"fix\" is an instanceof check, which spreads the problem to every caller.\n    public void transfer(Account from, Account to, long cents) {\n        if (from.getBalance() >= cents) {\n            from.withdraw(cents);\n            to.deposit(cents);\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "interface-segregation",
      "name": "Interface Segregation (SOLID · I)",
      "family": "Principles",
      "aka": [
        "ISP",
        "Role interfaces",
        "Many small interfaces"
      ],
      "tagline": "Clients should not be forced to depend on methods they do not use.",
      "intent": "Instead of one large interface that every implementer must fill in and every client must depend on, offer several small role interfaces, each describing one ability. Classes implement only the roles they really have, and each client asks only for the roles it calls, so changes and fakes stay small.",
      "analogy": "A restaurant menu split into breakfast, lunch and drinks. A coffee bar only needs to offer the drinks menu; it should not have to print a lunch menu and then say 'sorry, not available' for every dish.",
      "cityShape": "In before/ look for one interface building whose many methods force every implementing building to stack the same floors, some of them tiny stubs that only throw. In after/ the interface is split into several small buildings, implementers point 'implements' arrows only at the roles they need, and client floors pipe to one small role each.",
      "roles": [
        {
          "name": "Fat Interface",
          "desc": "The violation: one interface bundling unrelated abilities, so implementers write stubs and clients depend on too much."
        },
        {
          "name": "Role Interface",
          "desc": "A small interface for one ability (print, scan, take damage, get a blob)."
        },
        {
          "name": "Implementer",
          "desc": "A concrete class that implements exactly the roles it can honestly support, maybe several."
        },
        {
          "name": "Client",
          "desc": "Code that uses an object; after the split it asks only for the role it calls."
        }
      ],
      "whenToUse": [
        "Implementers contain methods that throw 'not supported' or are left empty just to satisfy an interface.",
        "Test fakes must implement many methods that the code under test never calls.",
        "Different clients use clearly different subsets of one interface (readers vs writers, renderers vs savers).",
        "In game code, one 'IEntity' interface forces chests, doors and enemies to implement each other's abilities."
      ],
      "pitfalls": [
        "Splitting into one-method interfaces everywhere can scatter a concept; group methods that are always used together.",
        "Role interfaces are best defined from the client's point of view (what it needs), not by chopping a class into pieces at random.",
        "A class implementing many roles is fine; the goal is smaller dependencies for clients, not smaller classes."
      ],
      "related": [
        "single-responsibility",
        "liskov-substitution",
        "dependency-inversion",
        "adapter",
        "abstraction"
      ],
      "quiz": [
        {
          "q": "A BasicPrinter implements OfficeMachine and throws in scan() and fax(). What does Interface Segregation suggest?",
          "options": [
            "Catch the exceptions in every caller",
            "Split OfficeMachine into Printer, Scanner and Fax, and let BasicPrinter implement only Printer",
            "Make scan() and fax() return empty values instead",
            "Merge all printer classes into one"
          ],
          "answer": 1,
          "why": "With small role interfaces, BasicPrinter is no longer forced to fake abilities, and callers needing a scanner cannot be handed a printer by mistake."
        },
        {
          "q": "Why does Go's io.Reader (a one-method interface) follow the Interface Segregation Principle so well?",
          "options": [
            "Because one method is always faster",
            "Because any type that can Read works with every function that needs only reading, without implementing anything else",
            "Because Go forbids larger interfaces",
            "Because io.Reader is a struct"
          ],
          "answer": 1,
          "why": "Functions that only read ask for io.Reader, so files, network connections, buffers and test strings can all be passed in with no extra methods to stub."
        }
      ],
      "demos": [
        {
          "id": "interface-segregation-ts-printers",
          "title": "Office printers and a fat interface",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "In before/ every device must implement print, scan and fax, so BasicPrinter throws. In after/ the roles Printer, Scanner and Fax are separate. Notice the type checker now prevents asking a HomePrinter to scan.",
          "roles": {
            "Fat Interface": [
              "interface-segregation-ts-printers/before/office-machine.ts#OfficeMachine"
            ],
            "Role Interface": [
              "interface-segregation-ts-printers/after/roles.ts#Printer",
              "interface-segregation-ts-printers/after/roles.ts#Scanner",
              "interface-segregation-ts-printers/after/roles.ts#Fax"
            ],
            "Implementer": [
              "interface-segregation-ts-printers/before/office-machine.ts#BasicPrinter",
              "interface-segregation-ts-printers/after/devices.ts#MultiFunctionPrinter",
              "interface-segregation-ts-printers/after/devices.ts#HomePrinter"
            ],
            "Client": [
              "interface-segregation-ts-printers/before/main.ts#archive",
              "interface-segregation-ts-printers/after/main.ts#printInvoice",
              "interface-segregation-ts-printers/after/main.ts#archive"
            ]
          },
          "trace": [
            {
              "at": "interface-segregation-ts-printers/before/main.ts#main",
              "say": "Before: main() passes a BasicPrinter to archive(). The types say this is fine."
            },
            {
              "at": "interface-segregation-ts-printers/before/main.ts#archive",
              "say": "archive() accepts any OfficeMachine, so it may call scan(). Nothing in the type warns that some machines cannot."
            },
            {
              "at": "interface-segregation-ts-printers/before/office-machine.ts#BasicPrinter.scan",
              "say": "BasicPrinter was forced to write scan() and fax() stubs that throw. The fat interface turned a design gap into a runtime crash."
            },
            {
              "at": "interface-segregation-ts-printers/after/main.ts#main",
              "say": "After: each call gets a device that has the role it needs."
            },
            {
              "at": "interface-segregation-ts-printers/after/main.ts#printInvoice",
              "say": "printInvoice() asks only for a Printer, so a cheap HomePrinter fits perfectly."
            },
            {
              "at": "interface-segregation-ts-printers/after/devices.ts#HomePrinter.print",
              "say": "HomePrinter implements just print(). No stubs, nothing that can throw 'not supported'."
            },
            {
              "at": "interface-segregation-ts-printers/after/main.ts#archive",
              "say": "archive() asks for a Scanner. Passing a HomePrinter here is now a compile error instead of a crash."
            },
            {
              "at": "interface-segregation-ts-printers/after/devices.ts#MultiFunctionPrinter.scan",
              "say": "A device with many abilities simply implements several roles at once."
            }
          ],
          "files": {
            "interface-segregation-ts-printers/after/devices.ts": "import { Fax, Printer, Scanner } from \"./roles\";\n\n// A device implements only the roles it really has.\nexport class MultiFunctionPrinter implements Printer, Scanner, Fax {\n  print(doc: string): void {\n    console.log(\"printing \" + doc);\n  }\n  scan(): string {\n    return \"scanned page\";\n  }\n  fax(doc: string, phone: string): void {\n    console.log(\"faxing \" + doc + \" to \" + phone);\n  }\n}\n\nexport class HomePrinter implements Printer {\n  print(doc: string): void {\n    console.log(\"printing \" + doc);\n  }\n}\n",
            "interface-segregation-ts-printers/after/main.ts": "import { HomePrinter, MultiFunctionPrinter } from \"./devices\";\nimport { Printer, Scanner } from \"./roles\";\n\n// Each function asks for exactly the roles it uses. The compiler now stops\n// anyone from passing a HomePrinter where scanning is needed.\nexport function printInvoice(printer: Printer, doc: string): void {\n  printer.print(doc);\n}\n\nexport function archive(scanner: Scanner): void {\n  console.log(\"archived \" + scanner.scan());\n}\n\nexport function main(): void {\n  printInvoice(new HomePrinter(), \"invoice.pdf\");\n  archive(new MultiFunctionPrinter());\n}\n",
            "interface-segregation-ts-printers/after/roles.ts": "// Small role interfaces: each one describes one thing a client may need.\nexport interface Printer {\n  print(doc: string): void;\n}\n\nexport interface Scanner {\n  scan(): string;\n}\n\nexport interface Fax {\n  fax(doc: string, phone: string): void;\n}\n",
            "interface-segregation-ts-printers/before/main.ts": "import { BasicPrinter, OfficeMachine } from \"./office-machine\";\n\n// Only needs printing, but the type lets it call scan() too, and nothing warns us.\nexport function archive(machine: OfficeMachine, doc: string): void {\n  machine.print(doc);\n  const copy = machine.scan();\n  console.log(\"archived \" + copy);\n}\n\nexport function main(): void {\n  archive(new BasicPrinter(), \"invoice.pdf\");\n}\n",
            "interface-segregation-ts-printers/before/office-machine.ts": "// One big interface for every office device.\nexport interface OfficeMachine {\n  print(doc: string): void;\n  scan(): string;\n  fax(doc: string, phone: string): void;\n}\n\nexport class AllInOnePrinter implements OfficeMachine {\n  print(doc: string): void {\n    console.log(\"printing \" + doc);\n  }\n  scan(): string {\n    return \"scanned page\";\n  }\n  fax(doc: string, phone: string): void {\n    console.log(\"faxing \" + doc + \" to \" + phone);\n  }\n}\n\n// A cheap printer is forced to \"implement\" things it cannot do.\nexport class BasicPrinter implements OfficeMachine {\n  print(doc: string): void {\n    console.log(\"printing \" + doc);\n  }\n  scan(): string {\n    throw new Error(\"BasicPrinter cannot scan\");\n  }\n  fax(doc: string, phone: string): void {\n    throw new Error(\"BasicPrinter cannot fax\");\n  }\n}\n"
          }
        },
        {
          "id": "interface-segregation-cs-entities",
          "title": "Dungeon entities and role interfaces",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "In before/ IGameEntity makes chests implement MoveTo and Attack. In after/ abilities become IMovable, IDamageable, IInteractable and ISaveable. Notice BlastSystem now accepts anything breakable, chests included.",
          "roles": {
            "Fat Interface": [
              "interface-segregation-cs-entities/before/IGameEntity.cs#IGameEntity"
            ],
            "Role Interface": [
              "interface-segregation-cs-entities/after/Roles.cs#IMovable",
              "interface-segregation-cs-entities/after/Roles.cs#IDamageable",
              "interface-segregation-cs-entities/after/Roles.cs#IInteractable",
              "interface-segregation-cs-entities/after/Roles.cs#ISaveable"
            ],
            "Implementer": [
              "interface-segregation-cs-entities/before/Entities.cs#TreasureChest",
              "interface-segregation-cs-entities/after/Actors.cs#Orc",
              "interface-segregation-cs-entities/after/Actors.cs#Chest"
            ],
            "Client": [
              "interface-segregation-cs-entities/before/Explosion.cs#Explosion",
              "interface-segregation-cs-entities/after/Systems.cs#BlastSystem",
              "interface-segregation-cs-entities/after/Systems.cs#SaveSystem"
            ]
          },
          "trace": [
            {
              "at": "interface-segregation-cs-entities/before/Explosion.cs#Explosion.Blast",
              "say": "Before: an explosion only calls TakeDamage, but it depends on the whole IGameEntity with five methods."
            },
            {
              "at": "interface-segregation-cs-entities/before/Entities.cs#TreasureChest.TakeDamage",
              "say": "The chest handles damage fine; this is the one method the explosion needs."
            },
            {
              "at": "interface-segregation-cs-entities/before/Entities.cs#TreasureChest.MoveTo",
              "say": "But the chest also had to write MoveTo and Attack stubs that throw. Any AI system calling them crashes."
            },
            {
              "at": "interface-segregation-cs-entities/before/Entities.cs#Goblin.Interact",
              "say": "Even the goblin has an empty Interact(). Readers cannot tell 'not supported' from 'not done yet'."
            },
            {
              "at": "interface-segregation-cs-entities/after/Systems.cs#BlastSystem.Blast",
              "say": "After: BlastSystem asks for IDamageable only. It works for orcs, chests and any future breakable wall."
            },
            {
              "at": "interface-segregation-cs-entities/after/Actors.cs#Chest.TakeDamage",
              "say": "Chest implements IDamageable, IInteractable and ISaveable: its real abilities and nothing more."
            },
            {
              "at": "interface-segregation-cs-entities/after/Systems.cs#SaveSystem.Snapshot",
              "say": "The save system depends only on ISaveable, so changes to combat interfaces never touch it."
            },
            {
              "at": "interface-segregation-cs-entities/after/Actors.cs#Orc.Strike",
              "say": "Even the orc's attack targets the narrow IDamageable role, not a whole entity."
            }
          ],
          "files": {
            "interface-segregation-cs-entities/after/Actors.cs": "using System.Numerics;\n\nnamespace Dungeon.After\n{\n    // Each class lists only the abilities it really has. No stubs, no NotSupportedException.\n    public class Orc : IMovable, IDamageable, ISaveable\n    {\n        public Vector2 Position;\n        public int Health = 20;\n\n        public void MoveTo(Vector2 target)\n        {\n            Position = target;\n        }\n\n        public void Strike(IDamageable target)\n        {\n            target.TakeDamage(4);\n        }\n\n        public void TakeDamage(int amount)\n        {\n            Health -= amount;\n        }\n\n        public string SaveState()\n        {\n            return $\"orc:{Health}\";\n        }\n    }\n\n    public class Chest : IDamageable, IInteractable, ISaveable\n    {\n        public int Durability = 10;\n        public bool Open;\n\n        public void TakeDamage(int amount)\n        {\n            Durability -= amount;\n            if (Durability <= 0) Open = true;\n        }\n\n        public void Interact(string playerName)\n        {\n            Open = true;\n        }\n\n        public string SaveState()\n        {\n            return $\"chest:{Open}\";\n        }\n    }\n}\n",
            "interface-segregation-cs-entities/after/Roles.cs": "using System.Numerics;\n\nnamespace Dungeon.After\n{\n    // Role interfaces: one per ability. Systems depend on the roles they use.\n    public interface IMovable\n    {\n        void MoveTo(Vector2 target);\n    }\n\n    public interface IDamageable\n    {\n        void TakeDamage(int amount);\n    }\n\n    public interface IInteractable\n    {\n        void Interact(string playerName);\n    }\n\n    public interface ISaveable\n    {\n        string SaveState();\n    }\n}\n",
            "interface-segregation-cs-entities/after/Systems.cs": "using System.Collections.Generic;\n\nnamespace Dungeon.After\n{\n    // Each system depends on one narrow role, so it accepts any object with that ability,\n    // including future ones such as a breakable wall that is IDamageable only.\n    public class BlastSystem\n    {\n        public void Blast(IEnumerable<IDamageable> inRange, int power)\n        {\n            foreach (var target in inRange)\n            {\n                target.TakeDamage(power);\n            }\n        }\n    }\n\n    public class SaveSystem\n    {\n        public List<string> Snapshot(IEnumerable<ISaveable> saveables)\n        {\n            var lines = new List<string>();\n            foreach (var s in saveables)\n            {\n                lines.Add(s.SaveState());\n            }\n            return lines;\n        }\n    }\n}\n",
            "interface-segregation-cs-entities/before/Entities.cs": "using System;\nusing System.Numerics;\n\nnamespace Dungeon.Before\n{\n    public class Goblin : IGameEntity\n    {\n        public Vector2 Position;\n        public int Health = 20;\n\n        public void MoveTo(Vector2 target)\n        {\n            Position = target;\n        }\n\n        public void Attack(IGameEntity target)\n        {\n            target.TakeDamage(4);\n        }\n\n        public void TakeDamage(int amount)\n        {\n            Health -= amount;\n        }\n\n        public void Interact(string playerName)\n        {\n            // Goblins do not talk. Empty on purpose... or a forgotten feature?\n        }\n\n        public string SaveState()\n        {\n            return $\"goblin:{Health}\";\n        }\n    }\n\n    // A chest does not move or attack, yet must pretend it can.\n    public class TreasureChest : IGameEntity\n    {\n        public int Durability = 10;\n        public bool Open;\n\n        public void MoveTo(Vector2 target)\n        {\n            throw new NotSupportedException(\"Chests cannot move\");\n        }\n\n        public void Attack(IGameEntity target)\n        {\n            throw new NotSupportedException(\"Chests cannot attack\");\n        }\n\n        public void TakeDamage(int amount)\n        {\n            Durability -= amount;\n            if (Durability <= 0) Open = true;\n        }\n\n        public void Interact(string playerName)\n        {\n            Open = true;\n        }\n\n        public string SaveState()\n        {\n            return $\"chest:{Open}\";\n        }\n    }\n}\n",
            "interface-segregation-cs-entities/before/Explosion.cs": "using System.Collections.Generic;\n\nnamespace Dungeon.Before\n{\n    public class Explosion\n    {\n        // Only needs TakeDamage, but depends on the whole fat interface.\n        // Any change to MoveTo or SaveState forces this class to recompile and retest.\n        public void Blast(IEnumerable<IGameEntity> inRange, int power)\n        {\n            foreach (var entity in inRange)\n            {\n                entity.TakeDamage(power);\n            }\n        }\n    }\n}\n",
            "interface-segregation-cs-entities/before/IGameEntity.cs": "using System.Numerics;\n\nnamespace Dungeon.Before\n{\n    // Every object in the dungeon must implement every ability.\n    public interface IGameEntity\n    {\n        void MoveTo(Vector2 target);\n        void Attack(IGameEntity target);\n        void TakeDamage(int amount);\n        void Interact(string playerName);\n        string SaveState();\n    }\n}\n"
          }
        },
        {
          "id": "interface-segregation-go-blobs",
          "title": "Blob storage: Getter instead of BlobStore",
          "lang": "Go",
          "level": "advanced",
          "source": null,
          "story": "In before/ Backup needs a six-method BlobStore, so its test fake stubs five methods with panic. In after/ jobs ask for Getter or GetPutter, like io.Reader. Notice the test fake shrinks to one method.",
          "roles": {
            "Fat Interface": [
              "interface-segregation-go-blobs/before/blobstore.go#BlobStore"
            ],
            "Role Interface": [
              "interface-segregation-go-blobs/after/roles.go#Getter",
              "interface-segregation-go-blobs/after/roles.go#Putter",
              "interface-segregation-go-blobs/after/roles.go#GetPutter"
            ],
            "Implementer": [
              "interface-segregation-go-blobs/before/jobs_test.go#fakeStore",
              "interface-segregation-go-blobs/after/s3bucket.go#S3Bucket",
              "interface-segregation-go-blobs/after/jobs_test.go#mapGetter"
            ],
            "Client": [
              "interface-segregation-go-blobs/before/jobs.go#Backup",
              "interface-segregation-go-blobs/after/jobs.go#BackupAll",
              "interface-segregation-go-blobs/after/jobs.go#MakeThumbnail"
            ]
          },
          "trace": [
            {
              "at": "interface-segregation-go-blobs/before/jobs.go#Backup",
              "say": "Before: Backup only calls Get, but its parameter type is the six-method BlobStore."
            },
            {
              "at": "interface-segregation-go-blobs/before/blobstore.go#S3Store.Get",
              "say": "In production S3Store fills all six methods, so nobody notices the cost yet."
            },
            {
              "at": "interface-segregation-go-blobs/before/jobs_test.go#fakeStore.SignURL",
              "say": "The cost shows up in tests: the fake stubs five unused methods with panic, and grows with every new BlobStore method."
            },
            {
              "at": "interface-segregation-go-blobs/after/jobs_test.go#TestBackupAll",
              "say": "After: the test hands BackupAll a plain map type. Starting from the test shows how little the job really needs."
            },
            {
              "at": "interface-segregation-go-blobs/after/jobs.go#BackupAll",
              "say": "BackupAll asks for a Getter, a one-method role in the spirit of io.Reader."
            },
            {
              "at": "interface-segregation-go-blobs/after/jobs.go#copyOne",
              "say": "copyOne also needs only Get. Small roles flow naturally through helper functions."
            },
            {
              "at": "interface-segregation-go-blobs/after/jobs_test.go#mapGetter.Get",
              "say": "The fake implements one method. Go satisfies Getter implicitly, no 'implements' keyword needed."
            },
            {
              "at": "interface-segregation-go-blobs/after/jobs.go#MakeThumbnail",
              "say": "Thumbnails read and write, so they ask for GetPutter, a combination of roles, still without Delete or List."
            }
          ],
          "files": {
            "interface-segregation-go-blobs/after/jobs.go": "package media\n\nimport (\n\t\"context\"\n\t\"io\"\n)\n\n// BackupAll asks only for the role it uses. Any Getter works: S3, disk, HTTP, a test map.\nfunc BackupAll(ctx context.Context, src Getter, keys []string, out io.Writer) error {\n\tfor _, k := range keys {\n\t\tif err := copyOne(ctx, src, k, out); err != nil {\n\t\t\treturn err\n\t\t}\n\t}\n\treturn nil\n}\n\nfunc copyOne(ctx context.Context, src Getter, key string, out io.Writer) error {\n\trc, err := src.Get(ctx, key)\n\tif err != nil {\n\t\treturn err\n\t}\n\tdefer rc.Close()\n\t_, err = io.Copy(out, rc)\n\treturn err\n}\n\n// shrink (image resizing) is left out; it returns an io.Reader with the smaller image.\n// MakeThumbnail reads and writes, so it asks for exactly GetPutter. Still no Delete or List.\nfunc MakeThumbnail(ctx context.Context, store GetPutter, key string) error {\n\trc, err := store.Get(ctx, key)\n\tif err != nil {\n\t\treturn err\n\t}\n\tdefer rc.Close()\n\treturn store.Put(ctx, \"thumbs/\"+key, shrink(rc))\n}\n",
            "interface-segregation-go-blobs/after/jobs_test.go": "package media\n\nimport (\n\t\"bytes\"\n\t\"context\"\n\t\"io\"\n\t\"strings\"\n\t\"testing\"\n)\n\n// The fake implements one method, because BackupAll needs one method.\ntype mapGetter map[string]string\n\nfunc (m mapGetter) Get(ctx context.Context, key string) (io.ReadCloser, error) {\n\treturn io.NopCloser(strings.NewReader(m[key])), nil\n}\n\nfunc TestBackupAll(t *testing.T) {\n\tvar out bytes.Buffer\n\tsrc := mapGetter{\"a.txt\": \"hello \", \"b.txt\": \"world\"}\n\tif err := BackupAll(context.Background(), src, []string{\"a.txt\", \"b.txt\"}, &out); err != nil {\n\t\tt.Fatal(err)\n\t}\n\tif out.String() != \"hello world\" {\n\t\tt.Fatalf(\"got %q\", out.String())\n\t}\n}\n",
            "interface-segregation-go-blobs/after/roles.go": "package media\n\nimport (\n\t\"context\"\n\t\"io\"\n)\n\n// Small role interfaces, in the style of io.Reader and io.Writer.\n// Go types satisfy them implicitly: S3Bucket never has to mention them.\ntype Getter interface {\n\tGet(ctx context.Context, key string) (io.ReadCloser, error)\n}\n\ntype Putter interface {\n\tPut(ctx context.Context, key string, r io.Reader) error\n}\n\n// Combine roles only where a client truly needs both.\ntype GetPutter interface {\n\tGetter\n\tPutter\n}\n",
            "interface-segregation-go-blobs/after/s3bucket.go": "package media\n\nimport (\n\t\"context\"\n\t\"io\"\n)\n\n// The concrete store can still offer everything; it just is not forced on clients.\n// s3GetObject and friends are thin AWS SDK wrappers, left out to keep the demo short.\ntype S3Bucket struct {\n\tname string\n}\n\nfunc (b *S3Bucket) Get(ctx context.Context, key string) (io.ReadCloser, error) {\n\treturn s3GetObject(ctx, b.name, key)\n}\n\nfunc (b *S3Bucket) Put(ctx context.Context, key string, r io.Reader) error {\n\treturn s3PutObject(ctx, b.name, key, r)\n}\n\nfunc (b *S3Bucket) Delete(ctx context.Context, key string) error {\n\treturn s3DeleteObject(ctx, b.name, key)\n}\n",
            "interface-segregation-go-blobs/before/blobstore.go": "package media\n\nimport (\n\t\"context\"\n\t\"io\"\n\t\"time\"\n)\n\n// BlobStore is the \"one interface to rule them all\" for object storage.\n// Every consumer and every test fake depends on all six methods.\ntype BlobStore interface {\n\tGet(ctx context.Context, key string) (io.ReadCloser, error)\n\tPut(ctx context.Context, key string, r io.Reader) error\n\tDelete(ctx context.Context, key string) error\n\tList(ctx context.Context, prefix string) ([]string, error)\n\tStat(ctx context.Context, key string) (int64, error)\n\tSignURL(key string, ttl time.Duration) (string, error)\n}\n\n// s3GetObject and friends are thin AWS SDK wrappers, left out to keep the demo short.\ntype S3Store struct {\n\tbucket string\n}\n\nfunc (s *S3Store) Get(ctx context.Context, key string) (io.ReadCloser, error) {\n\treturn s3GetObject(ctx, s.bucket, key)\n}\n\nfunc (s *S3Store) Put(ctx context.Context, key string, r io.Reader) error {\n\treturn s3PutObject(ctx, s.bucket, key, r)\n}\n\nfunc (s *S3Store) Delete(ctx context.Context, key string) error {\n\treturn s3DeleteObject(ctx, s.bucket, key)\n}\n\nfunc (s *S3Store) List(ctx context.Context, prefix string) ([]string, error) {\n\treturn s3ListKeys(ctx, s.bucket, prefix)\n}\n\nfunc (s *S3Store) Stat(ctx context.Context, key string) (int64, error) {\n\treturn s3HeadObject(ctx, s.bucket, key)\n}\n\nfunc (s *S3Store) SignURL(key string, ttl time.Duration) (string, error) {\n\treturn s3Presign(s.bucket, key, ttl)\n}\n",
            "interface-segregation-go-blobs/before/jobs.go": "package media\n\nimport (\n\t\"context\"\n\t\"io\"\n)\n\n// Backup only reads, yet it demands a full BlobStore.\nfunc Backup(ctx context.Context, store BlobStore, keys []string, out io.Writer) error {\n\tfor _, k := range keys {\n\t\trc, err := store.Get(ctx, k)\n\t\tif err != nil {\n\t\t\treturn err\n\t\t}\n\t\t_, err = io.Copy(out, rc)\n\t\trc.Close()\n\t\tif err != nil {\n\t\t\treturn err\n\t\t}\n\t}\n\treturn nil\n}\n",
            "interface-segregation-go-blobs/before/jobs_test.go": "package media\n\nimport (\n\t\"context\"\n\t\"io\"\n\t\"strings\"\n\t\"time\"\n)\n\n// To test Backup we must fake SIX methods, five of them never called.\ntype fakeStore struct {\n\tfiles map[string]string\n}\n\nfunc (f *fakeStore) Get(ctx context.Context, key string) (io.ReadCloser, error) {\n\treturn io.NopCloser(strings.NewReader(f.files[key])), nil\n}\n\nfunc (f *fakeStore) Put(ctx context.Context, key string, r io.Reader) error {\n\tpanic(\"not used\")\n}\n\nfunc (f *fakeStore) Delete(ctx context.Context, key string) error {\n\tpanic(\"not used\")\n}\n\nfunc (f *fakeStore) List(ctx context.Context, prefix string) ([]string, error) {\n\tpanic(\"not used\")\n}\n\nfunc (f *fakeStore) Stat(ctx context.Context, key string) (int64, error) {\n\tpanic(\"not used\")\n}\n\nfunc (f *fakeStore) SignURL(key string, ttl time.Duration) (string, error) {\n\tpanic(\"not used\")\n}\n"
          }
        }
      ]
    },
    {
      "id": "dependency-inversion",
      "name": "Dependency Inversion (SOLID · D)",
      "family": "Principles",
      "aka": [
        "DIP",
        "Depend on abstractions, not concretions"
      ],
      "tagline": "Business rules depend on interfaces they own; databases and APIs plug into them.",
      "intent": "High-level modules (the business rules) should not depend on low-level modules (databases, HTTP clients, devices); both should depend on an abstraction. The abstraction is shaped by what the high-level code needs, so the source-code dependency of the detail points up towards the policy, while control still flows down at runtime.",
      "analogy": "A wall socket is defined by the house, not by any one appliance maker. Lamps, fans and chargers all adapt to the socket, so you can change appliances without rewiring the house.",
      "cityShape": "In before/ the policy building has a 'has' link and an import arc pointing straight at the database or client building, which it builds itself. In after/ a small interface building sits between them: the policy points at it, the detail buildings point 'implements' arrows at it too, and only the composition-root building (main or bootstrap) has construction pipes to the concrete classes.",
      "roles": [
        {
          "name": "High-level Policy",
          "desc": "The business rules: what the program is for. It should be the most stable code."
        },
        {
          "name": "Abstraction",
          "desc": "An interface owned by the policy side and phrased in its terms (save an order, give me temperatures)."
        },
        {
          "name": "Low-level Detail",
          "desc": "A concrete database, HTTP client, device or framework class that implements the abstraction."
        },
        {
          "name": "Composition Root",
          "desc": "The one place (main, bootstrap) that picks concrete details and plugs them into the policy."
        }
      ],
      "whenToUse": [
        "Business logic calls `new MySqlConnection()`, `HttpClient()` or a specific device class inside its own constructor.",
        "You cannot unit-test a rule without a database, a network or real hardware.",
        "A vendor, database or engine API is likely to change, and you want that change to stay at the edge.",
        "Several implementations must be swappable (production, test fake, offline mode)."
      ],
      "pitfalls": [
        "An interface that just mirrors one vendor's API (MySqlLikeThing with query(sql)) inverts nothing; shape it around the policy's needs.",
        "Inversion is not the same as a DI container: plain constructor parameters and one composition root are usually enough.",
        "Do not invert everything; stable libraries such as the standard collections or math functions are fine to depend on directly."
      ],
      "related": [
        "dependency-injection",
        "hexagonal",
        "clean-architecture",
        "repository",
        "adapter",
        "interface-segregation"
      ],
      "quiz": [
        {
          "q": "What exactly gets 'inverted' in the Dependency Inversion Principle?",
          "options": [
            "The order in which functions run",
            "The direction of the source-code dependency: the low-level detail now depends on an abstraction owned by the high-level policy",
            "The inheritance tree, so parents extend children",
            "The database, which now calls the business logic"
          ],
          "answer": 1,
          "why": "At runtime the policy still calls the database, but in the source code the database adapter imports and implements the policy's interface, so the arrow points the other way."
        },
        {
          "q": "OrderService creates `new MySqlConnection()` in its constructor. What is the main cost?",
          "options": [
            "MySQL becomes slower",
            "The business rules cannot be used or tested without that specific database, and changing databases means editing OrderService",
            "PHP cannot load the class",
            "Nothing, constructors are the right place for that"
          ],
          "answer": 1,
          "why": "The policy is welded to one detail. Depending on an OrderRepository interface lets tests use an in-memory version and lets the database change at the edge."
        }
      ],
      "demos": [
        {
          "id": "dependency-inversion-py-switch",
          "title": "A switch that is not welded to a lamp",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "In before/ WallSwitch builds its own Lamp, so it can only ever switch that lamp. In after/ SmartSwitch depends on a Switchable abstraction. Notice devices.py now imports switchable.py, not the other way round.",
          "roles": {
            "High-level Policy": [
              "dependency-inversion-py-switch/before/switch.py#WallSwitch",
              "dependency-inversion-py-switch/after/smart_switch.py#SmartSwitch"
            ],
            "Abstraction": [
              "dependency-inversion-py-switch/after/switchable.py#Switchable"
            ],
            "Low-level Detail": [
              "dependency-inversion-py-switch/before/lamp.py#Lamp",
              "dependency-inversion-py-switch/after/devices.py#LedLamp",
              "dependency-inversion-py-switch/after/devices.py#CeilingFan"
            ],
            "Composition Root": [
              "dependency-inversion-py-switch/after/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "dependency-inversion-py-switch/before/switch.py#WallSwitch.__init__",
              "say": "Before: the switch builds its own Lamp. The import arc points from the policy straight down to the detail."
            },
            {
              "at": "dependency-inversion-py-switch/before/switch.py#WallSwitch.press",
              "say": "press() holds the real idea, toggling, but it can only ever toggle this one lamp model."
            },
            {
              "at": "dependency-inversion-py-switch/before/lamp.py#Lamp.turn_on",
              "say": "Replacing the lamp with a fan would mean editing or copying WallSwitch."
            },
            {
              "at": "dependency-inversion-py-switch/after/main.py#main",
              "say": "After: main() picks a device and passes it into each SmartSwitch. Only main knows the concrete classes."
            },
            {
              "at": "dependency-inversion-py-switch/after/smart_switch.py#SmartSwitch.__init__",
              "say": "SmartSwitch receives any Switchable. Its file imports only the abstraction."
            },
            {
              "at": "dependency-inversion-py-switch/after/smart_switch.py#SmartSwitch.press",
              "say": "The same toggling logic now works for lamps, fans and devices that do not exist yet."
            },
            {
              "at": "dependency-inversion-py-switch/after/devices.py#CeilingFan.turn_on",
              "say": "The detail depends upward on Switchable. That reversed arrow is the 'inversion'."
            }
          ],
          "files": {
            "dependency-inversion-py-switch/after/devices.py": "from .switchable import Switchable\n\n\n# Low-level details now point UP to the abstraction.\nclass LedLamp(Switchable):\n    def turn_on(self):\n        print(\"LED on\")\n\n    def turn_off(self):\n        print(\"LED off\")\n\n\nclass CeilingFan(Switchable):\n    def turn_on(self):\n        print(\"fan spinning\")\n\n    def turn_off(self):\n        print(\"fan stopped\")\n",
            "dependency-inversion-py-switch/after/main.py": "from .devices import CeilingFan, LedLamp\nfrom .smart_switch import SmartSwitch\n\n\n# Only main knows which device goes with which switch.\ndef main():\n    hall = SmartSwitch(LedLamp())\n    bedroom = SmartSwitch(CeilingFan())\n    hall.press()\n    bedroom.press()\n",
            "dependency-inversion-py-switch/after/smart_switch.py": "from .switchable import Switchable\n\n\n# Depends only on the abstraction. It never imports a device module.\nclass SmartSwitch:\n    def __init__(self, device: Switchable):\n        self.device = device\n        self.active = False\n\n    def press(self):\n        self.active = not self.active\n        if self.active:\n            self.device.turn_on()\n        else:\n            self.device.turn_off()\n",
            "dependency-inversion-py-switch/after/switchable.py": "from abc import ABC, abstractmethod\n\n\n# The abstraction both sides depend on. It is owned by the switch side:\n# it describes what a switch needs, not what a lamp happens to offer.\nclass Switchable(ABC):\n    @abstractmethod\n    def turn_on(self):\n        raise NotImplementedError\n\n    @abstractmethod\n    def turn_off(self):\n        raise NotImplementedError\n",
            "dependency-inversion-py-switch/before/lamp.py": "# A low-level detail: one specific lamp model.\nclass Lamp:\n    def __init__(self):\n        self.on = False\n\n    def turn_on(self):\n        self.on = True\n        print(\"lamp on\")\n\n    def turn_off(self):\n        self.on = False\n        print(\"lamp off\")\n",
            "dependency-inversion-py-switch/before/switch.py": "from .lamp import Lamp\n\n\n# The high-level policy (\"pressing toggles something\") is welded to one lamp.\n# A fan or a heater would need a new switch class.\nclass WallSwitch:\n    def __init__(self):\n        self.lamp = Lamp()\n        self.active = False\n\n    def press(self):\n        self.active = not self.active\n        if self.active:\n            self.lamp.turn_on()\n        else:\n            self.lamp.turn_off()\n"
          }
        },
        {
          "id": "dependency-inversion-php-orders",
          "title": "Checkout that does not new-up MySQL",
          "lang": "PHP",
          "level": "intermediate",
          "source": null,
          "story": "In before/ OrderService constructs a MySqlConnection, so it cannot run without a database. In after/ CheckoutService needs an OrderRepository, with a PDO and an in-memory version. Notice only bootstrap.php names concrete classes.",
          "roles": {
            "High-level Policy": [
              "dependency-inversion-php-orders/before/OrderService.php#OrderService",
              "dependency-inversion-php-orders/after/CheckoutService.php#CheckoutService"
            ],
            "Abstraction": [
              "dependency-inversion-php-orders/after/OrderRepository.php#OrderRepository"
            ],
            "Low-level Detail": [
              "dependency-inversion-php-orders/before/MySqlConnection.php#MySqlConnection",
              "dependency-inversion-php-orders/after/PdoOrderRepository.php#PdoOrderRepository",
              "dependency-inversion-php-orders/after/InMemoryOrderRepository.php#InMemoryOrderRepository"
            ],
            "Composition Root": [
              "dependency-inversion-php-orders/after/bootstrap.php#buildCheckout"
            ]
          },
          "trace": [
            {
              "at": "dependency-inversion-php-orders/before/OrderService.php#OrderService.__construct",
              "say": "Before: the service news-up a MySqlConnection. Creating an OrderService already opens a database connection."
            },
            {
              "at": "dependency-inversion-php-orders/before/OrderService.php#OrderService.placeOrder",
              "say": "The pricing rule is fine, but it ends in raw SQL through a concrete class. Testing the rule needs MySQL."
            },
            {
              "at": "dependency-inversion-php-orders/before/MySqlConnection.php#MySqlConnection.insert",
              "say": "The detail's API (SQL strings) leaks into the business layer."
            },
            {
              "at": "dependency-inversion-php-orders/after/bootstrap.php#main",
              "say": "After: main() asks the composition root for a ready CheckoutService."
            },
            {
              "at": "dependency-inversion-php-orders/after/bootstrap.php#buildCheckout",
              "say": "Only this function chooses PDO or in-memory storage. Swapping databases is a change here, not in the rules."
            },
            {
              "at": "dependency-inversion-php-orders/after/CheckoutService.php#CheckoutService.placeOrder",
              "say": "The same rule now ends with $orders->add(), a business-level call on the interface."
            },
            {
              "at": "dependency-inversion-php-orders/after/PdoOrderRepository.php#PdoOrderRepository.add",
              "say": "In production the PDO adapter turns add() into SQL. The detail implements the policy's interface."
            },
            {
              "at": "dependency-inversion-php-orders/after/InMemoryOrderRepository.php#InMemoryOrderRepository.add",
              "say": "In tests an array stands in for the database, which the before/ design made impossible."
            }
          ],
          "files": {
            "dependency-inversion-php-orders/after/CheckoutService.php": "<?php\n\nnamespace Shop\\After;\n\n// High-level policy depends on the abstraction and receives it from outside.\nclass CheckoutService {\n    public function __construct(private OrderRepository $orders)\n    {\n    }\n\n    public function placeOrder(string $customer, array $items): int\n    {\n        $total = 0;\n        foreach ($items as $item) {\n            $total += $item['price'] * $item['qty'];\n        }\n        if ($total <= 0) {\n            throw new \\InvalidArgumentException('Empty order');\n        }\n        return $this->orders->add($customer, $total);\n    }\n}\n",
            "dependency-inversion-php-orders/after/InMemoryOrderRepository.php": "<?php\n\nnamespace Shop\\After;\n\n// A second implementation for tests and local demos. No database needed.\nclass InMemoryOrderRepository implements OrderRepository {\n    public array $rows = [];\n\n    public function add(string $customer, int $totalCents): int\n    {\n        $this->rows[] = ['customer' => $customer, 'total' => $totalCents];\n        return count($this->rows);\n    }\n}\n",
            "dependency-inversion-php-orders/after/OrderRepository.php": "<?php\n\nnamespace Shop\\After;\n\n// The abstraction, written in the language of the business: \"store an order\".\n// No SQL, no PDO, no MySQL in sight.\ninterface OrderRepository {\n    public function add(string $customer, int $totalCents): int;\n}\n",
            "dependency-inversion-php-orders/after/PdoOrderRepository.php": "<?php\n\nnamespace Shop\\After;\n\n// The low-level detail now depends on the abstraction (it implements it).\n// Moving from MySQL to Postgres means a new class like this one, not a new CheckoutService.\nclass PdoOrderRepository implements OrderRepository {\n    public function __construct(private \\PDO $pdo)\n    {\n    }\n\n    public function add(string $customer, int $totalCents): int\n    {\n        $stmt = $this->pdo->prepare('INSERT INTO orders (customer, total) VALUES (?, ?)');\n        $stmt->execute([$customer, $totalCents]);\n        return (int) $this->pdo->lastInsertId();\n    }\n}\n",
            "dependency-inversion-php-orders/after/bootstrap.php": "<?php\n\nnamespace Shop\\After;\n\n// The composition root: the only file that names concrete classes.\nfunction buildCheckout(bool $testing): CheckoutService\n{\n    if ($testing) {\n        return new CheckoutService(new InMemoryOrderRepository());\n    }\n    $pdo = new \\PDO('mysql:host=localhost;dbname=shop', 'shop', getenv('DB_PASS'));\n    return new CheckoutService(new PdoOrderRepository($pdo));\n}\n\nfunction main(): void\n{\n    $checkout = buildCheckout(getenv('APP_ENV') === 'test');\n    $id = $checkout->placeOrder('ana@example.com', [['price' => 1250, 'qty' => 2]]);\n    echo \"Order #$id placed\\n\";\n}\n",
            "dependency-inversion-php-orders/before/MySqlConnection.php": "<?php\n\nnamespace Shop\\Before;\n\nclass MySqlConnection {\n    private \\PDO $pdo;\n\n    public function __construct(string $host, string $database)\n    {\n        $this->pdo = new \\PDO(\"mysql:host=$host;dbname=$database\", 'shop', getenv('DB_PASS'));\n    }\n\n    public function insert(string $sql, array $params): int\n    {\n        $this->pdo->prepare($sql)->execute($params);\n        return (int) $this->pdo->lastInsertId();\n    }\n}\n",
            "dependency-inversion-php-orders/before/OrderService.php": "<?php\n\nnamespace Shop\\Before;\n\n// High-level business rules that create and depend on a low-level detail.\n// You cannot run placeOrder() without a live MySQL server, not even in a unit test.\nclass OrderService {\n    private MySqlConnection $db;\n\n    public function __construct()\n    {\n        $this->db = new MySqlConnection('localhost', 'shop');\n    }\n\n    public function placeOrder(string $customer, array $items): int\n    {\n        $total = 0;\n        foreach ($items as $item) {\n            $total += $item['price'] * $item['qty'];\n        }\n        if ($total <= 0) {\n            throw new \\InvalidArgumentException('Empty order');\n        }\n        return $this->db->insert(\n            'INSERT INTO orders (customer, total) VALUES (?, ?)',\n            [$customer, $total]\n        );\n    }\n}\n"
          }
        },
        {
          "id": "dependency-inversion-kt-frost",
          "title": "Frost alerts with domain-owned ports",
          "lang": "Kotlin",
          "level": "advanced",
          "source": null,
          "story": "In before/ FrostAlerter imports the weather client and parses its JSON. In after/ the domain package owns TemperatureSource and AlertChannel, and infra adapters implement them. Notice the import arcs: infra points up to domain.",
          "roles": {
            "High-level Policy": [
              "dependency-inversion-kt-frost/before/alerts/FrostAlerter.kt#FrostAlerter",
              "dependency-inversion-kt-frost/after/domain/FrostWatch.kt#FrostWatch"
            ],
            "Abstraction": [
              "dependency-inversion-kt-frost/after/domain/Ports.kt#TemperatureSource",
              "dependency-inversion-kt-frost/after/domain/Ports.kt#AlertChannel"
            ],
            "Low-level Detail": [
              "dependency-inversion-kt-frost/before/weather/OpenMeteoClient.kt#OpenMeteoClient",
              "dependency-inversion-kt-frost/after/infra/Adapters.kt#OpenMeteoSource",
              "dependency-inversion-kt-frost/after/infra/Adapters.kt#SmsChannel"
            ],
            "Composition Root": [
              "dependency-inversion-kt-frost/after/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "dependency-inversion-kt-frost/before/alerts/FrostAlerter.kt#FrostAlerter.checkTonight",
              "say": "Before: the frost rule calls a concrete HTTP client it created itself. Policy depends on detail."
            },
            {
              "at": "dependency-inversion-kt-frost/before/weather/OpenMeteoClient.kt#OpenMeteoClient.fetchHourlyJson",
              "say": "The client returns the provider's raw JSON, so the policy must understand that format too."
            },
            {
              "at": "dependency-inversion-kt-frost/before/alerts/FrostAlerter.kt#FrostAlerter.parseTemperatures",
              "say": "JSON parsing inside the alert class: a provider change now breaks the gardening rule."
            },
            {
              "at": "dependency-inversion-kt-frost/after/Main.kt#main",
              "say": "After: the composition root builds the adapters and hands them to FrostWatch as interfaces."
            },
            {
              "at": "dependency-inversion-kt-frost/after/domain/FrostWatch.kt#FrostWatch.checkTonight",
              "say": "The rule speaks only domain words: places, temperatures, alerts. Its package imports nothing from infra."
            },
            {
              "at": "dependency-inversion-kt-frost/after/infra/Adapters.kt#OpenMeteoSource.nextHours",
              "say": "The adapter imports garden.domain and implements TemperatureSource. Control flows down; the source dependency points up."
            },
            {
              "at": "dependency-inversion-kt-frost/after/infra/Adapters.kt#SmsChannel.deliver",
              "say": "Switching from SMS to push notifications is a new AlertChannel, with no change to the domain."
            },
            {
              "at": "dependency-inversion-kt-frost/after/test/FrostWatchTest.kt#FrostWatchTest.warnsWhenItFreezes",
              "say": "The payoff: a test plugs in fixed temperatures and a recording channel, with no network and no SMS."
            }
          ],
          "files": {
            "dependency-inversion-kt-frost/after/Main.kt": "package garden\n\nimport garden.domain.FrostWatch\nimport garden.domain.Place\nimport garden.infra.OpenMeteoSource\nimport garden.infra.SmsChannel\nimport java.net.http.HttpClient\n\n// Composition root: the only code that knows both the policy and the details.\nfun main() {\n    val watch = FrostWatch(\n        temperatures = OpenMeteoSource(HttpClient.newHttpClient()),\n        alerts = SmsChannel(\"+49 151 0000000\"),\n    )\n    watch.checkTonight(Place(48.37, 10.89))\n}\n",
            "dependency-inversion-kt-frost/after/domain/FrostWatch.kt": "package garden.domain\n\n// Pure policy. No HTTP, no JSON, no SMS gateway, and no imports from infra.\nclass FrostWatch(\n    private val temperatures: TemperatureSource,\n    private val alerts: AlertChannel,\n    private val thresholdC: Double = 0.0,\n) {\n    fun checkTonight(place: Place): Boolean {\n        val coldest = temperatures.nextHours(place, 12).minOrNull() ?: return false\n        if (coldest < thresholdC) {\n            alerts.deliver(\"Frost tonight (${coldest}°C), cover the tomatoes!\")\n            return true\n        }\n        return false\n    }\n}\n",
            "dependency-inversion-kt-frost/after/domain/Ports.kt": "package garden.domain\n\ndata class Place(val lat: Double, val lon: Double)\n\n// Abstractions OWNED by the high-level module and phrased in its own words.\n// The domain decides what it needs; infrastructure has to adapt to it.\ninterface TemperatureSource {\n    fun nextHours(place: Place, hours: Int): List<Double>\n}\n\ninterface AlertChannel {\n    fun deliver(message: String)\n}\n",
            "dependency-inversion-kt-frost/after/infra/Adapters.kt": "package garden.infra\n\nimport garden.domain.AlertChannel\nimport garden.domain.Place\nimport garden.domain.TemperatureSource\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\n\n// The inversion: this low-level module now imports the domain and implements its\n// interfaces. The source-code arrow points UP, against the flow of control.\nclass OpenMeteoSource(private val http: HttpClient) : TemperatureSource {\n    override fun nextHours(place: Place, hours: Int): List<Double> {\n        val url = \"https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&hourly=temperature_2m\"\n        val body = http.send(HttpRequest.newBuilder(URI(url)).build(), HttpResponse.BodyHandlers.ofString()).body()\n        return parseTemperatures(body).take(hours)\n    }\n\n    private fun parseTemperatures(json: String): List<Double> {\n        val array = json.substringAfter(\"\\\"temperature_2m\\\":[\").substringBefore(\"]\")\n        return array.split(\",\").map { it.trim().toDouble() }\n    }\n}\n\nclass SmsChannel(private val phone: String) : AlertChannel {\n    override fun deliver(message: String) {\n        println(\"SMS to $phone: $message\")\n    }\n}\n",
            "dependency-inversion-kt-frost/after/test/FrostWatchTest.kt": "package garden.test\n\nimport garden.domain.AlertChannel\nimport garden.domain.FrostWatch\nimport garden.domain.Place\nimport garden.domain.TemperatureSource\nimport kotlin.test.Test\nimport kotlin.test.assertEquals\n\n// Because the policy depends on abstractions, a test can plug in fakes: no network, no SMS.\nclass FixedTemperatures(private val temps: List<Double>) : TemperatureSource {\n    override fun nextHours(place: Place, hours: Int): List<Double> {\n        return temps.take(hours)\n    }\n}\n\nclass RecordingChannel : AlertChannel {\n    val sent = mutableListOf<String>()\n\n    override fun deliver(message: String) {\n        sent.add(message)\n    }\n}\n\nclass FrostWatchTest {\n    @Test\n    fun warnsWhenItFreezes() {\n        val channel = RecordingChannel()\n        val watch = FrostWatch(FixedTemperatures(listOf(4.0, 1.5, -2.0)), channel)\n        watch.checkTonight(Place(0.0, 0.0))\n        assertEquals(1, channel.sent.size)\n    }\n}\n",
            "dependency-inversion-kt-frost/before/alerts/FrostAlerter.kt": "package garden.alerts\n\nimport garden.weather.OpenMeteoClient\n\n// High-level policy (\"warn the gardener before a frost night\") imports and builds\n// the low-level client itself. The dependency arrow points DOWN, from policy to detail.\nclass FrostAlerter {\n    private val client = OpenMeteoClient()\n\n    fun checkTonight(lat: Double, lon: Double): Boolean {\n        val json = client.fetchHourlyJson(lat, lon)\n        val temps = parseTemperatures(json)\n        val coldest = temps.take(12).minOrNull() ?: return false\n        if (coldest < 0.0) {\n            println(\"SMS: frost tonight (${coldest}°C), cover the tomatoes!\")\n            return true\n        }\n        return false\n    }\n\n    // Even the provider's JSON format leaks into the policy class.\n    private fun parseTemperatures(json: String): List<Double> {\n        val array = json.substringAfter(\"\\\"temperature_2m\\\":[\").substringBefore(\"]\")\n        return array.split(\",\").map { it.trim().toDouble() }\n    }\n}\n",
            "dependency-inversion-kt-frost/before/weather/OpenMeteoClient.kt": "package garden.weather\n\nimport java.net.URI\nimport java.net.http.HttpClient\nimport java.net.http.HttpRequest\nimport java.net.http.HttpResponse\n\n// Low-level module: knows URLs, HTTP and the provider's JSON format.\nclass OpenMeteoClient {\n    private val http = HttpClient.newHttpClient()\n\n    fun fetchHourlyJson(lat: Double, lon: Double): String {\n        val url = \"https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&hourly=temperature_2m\"\n        val request = HttpRequest.newBuilder(URI(url)).build()\n        return http.send(request, HttpResponse.BodyHandlers.ofString()).body()\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "dry",
      "name": "DRY: Don't Repeat Yourself",
      "family": "Principles",
      "aka": [
        "Single source of truth",
        "Once and only once"
      ],
      "tagline": "Every piece of knowledge should live in exactly one place in the code.",
      "intent": "When the same rule (a tax rate, a damage formula, what counts as a valid email) is written out in several places, the copies drift apart and every change must be made N times. DRY says to give each piece of knowledge one authoritative home, and let everything else call it, so a change happens once and stays consistent.",
      "analogy": "A family shares one calendar on the fridge. If everyone kept their own copy, the dentist appointment would be moved in one copy and missed in the others.",
      "cityShape": "In before/ look for neighbouring buildings with floors of the same height and size: the copies. In after/ those floors shrink and send call pipes to one small building (pricing, damage_rules, input/respond), the single source that all of them depend on.",
      "roles": [
        {
          "name": "Duplicate",
          "desc": "In before/: a copy of the same rule written out in another place, often already drifting from the original."
        },
        {
          "name": "Single Source",
          "desc": "In after/: the one function, constant or type that now owns the rule."
        },
        {
          "name": "Caller",
          "desc": "Code that used to contain a copy and now asks the single source instead, keeping only what is truly different about it."
        }
      ],
      "whenToUse": [
        "You fix a bug and then have to search the codebase for the other places that do the same thing.",
        "Two copies already disagree and nobody knows which one is right.",
        "A business or game-balance rule (rates, formulas, limits) appears in more than one file."
      ],
      "pitfalls": [
        "DRY is about knowledge, not text: two pieces of code that look alike but change for different reasons should stay separate. Merging them couples unrelated features.",
        "Wait for the third copy (rule of three) before abstracting; a premature shared helper with many flags is worse than two honest copies.",
        "A shared helper that every module imports becomes a bottleneck; keep it small and focused."
      ],
      "related": [
        "kiss-yagni",
        "coupling-cohesion",
        "single-responsibility",
        "template-method",
        "magic-numbers",
        "shotgun-surgery"
      ],
      "quiz": [
        {
          "q": "An invoice and a shipping label both format addresses with the same five lines of code today, but legal says invoice addresses will soon need a tax ID. What does DRY suggest?",
          "options": [
            "Always merge identical code immediately",
            "Be careful: they look alike but may change for different reasons, so a shared helper might soon need flags",
            "Copy the code into a third place to be safe",
            "Delete one of the features"
          ],
          "answer": 1,
          "why": "DRY is about one home for one piece of knowledge. If the two formats are different knowledge that just happens to match today, merging them couples two features that will diverge."
        },
        {
          "q": "In the before/ fireball, crits deal 1.5x while the sword deals 2x. What is the real problem DRY exposes?",
          "options": [
            "Fireballs are overpowered",
            "Nobody can tell whether the difference is intentional, because the rule exists in two places",
            "GDScript cannot share code",
            "randf() is called twice"
          ],
          "answer": 1,
          "why": "With copies, a difference might be a design decision or a forgotten edit. A single source makes intentional differences explicit parameters."
        }
      ],
      "demos": [
        {
          "id": "dry-py-receipts",
          "title": "VAT on a shop receipt",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Three receipt lines each compute VAT and format the price. In before/ the rule is copied and one copy still uses an old rate; in after/ pricing.py owns rates, rounding and formatting.",
          "roles": {
            "Duplicate": [
              "dry-py-receipts/before/receipts.py#book_line",
              "dry-py-receipts/before/receipts.py#food_line",
              "dry-py-receipts/before/receipts.py#gift_card_line"
            ],
            "Single Source": [
              "dry-py-receipts/after/pricing.py#gross_price",
              "dry-py-receipts/after/pricing.py#format_line",
              "dry-py-receipts/after/pricing.py#VAT_RATES"
            ],
            "Caller": [
              "dry-py-receipts/after/receipts.py#book_line",
              "dry-py-receipts/after/receipts.py#food_line",
              "dry-py-receipts/after/receipts.py#gift_card_line"
            ]
          },
          "trace": [
            {
              "at": "dry-py-receipts/before/receipts.py#print_receipt",
              "say": "The receipt prints three lines. Each line function computes its own price."
            },
            {
              "at": "dry-py-receipts/before/receipts.py#book_line",
              "say": "Book: multiply by 1.19, round, format. Remember this shape."
            },
            {
              "at": "dry-py-receipts/before/receipts.py#gift_card_line",
              "say": "Same rule pasted again, but this copy still has the old 16% rate. When the rate changed, one copy was missed."
            },
            {
              "at": "dry-py-receipts/after/receipts.py#print_receipt",
              "say": "after/ prints the same receipt. Its line functions are now one-liners."
            },
            {
              "at": "dry-py-receipts/after/receipts.py#food_line",
              "say": "food_line states only what is special: the reduced VAT class. How VAT works is not its business."
            },
            {
              "at": "dry-py-receipts/after/pricing.py#gross_price",
              "say": "The rule lives here once. A rate change or a rounding fix now reaches every line automatically."
            },
            {
              "at": "dry-py-receipts/after/pricing.py#format_line",
              "say": "Formatting knowledge also has one home, so all lines stay aligned."
            }
          ],
          "files": {
            "dry-py-receipts/after/pricing.py": "# AFTER: one home for the pricing knowledge. Rates, rounding and formatting live here once.\n\nVAT_RATES = {\"standard\": 0.19, \"reduced\": 0.07}\n\n\ndef gross_price(net_price, rate_name=\"standard\"):\n    rate = VAT_RATES[rate_name]\n    return round(net_price * (1 + rate), 2)\n\n\ndef format_line(label, amount):\n    return f\"{label:<20}{amount:>8.2f} EUR\"\n",
            "dry-py-receipts/after/receipts.py": "# AFTER: each line says only what is different about it (its label and VAT class).\nfrom .pricing import gross_price, format_line\n\n\ndef book_line(title, net_price):\n    return format_line(title, gross_price(net_price))\n\n\ndef food_line(item, net_price):\n    return format_line(item, gross_price(net_price, \"reduced\"))\n\n\ndef gift_card_line(code, net_price):\n    return format_line(code, gross_price(net_price))\n\n\ndef print_receipt():\n    print(book_line(\"Dune\", 12.50))\n    print(food_line(\"Coffee beans\", 8.99))\n    print(gift_card_line(\"GIFT-25\", 21.01))\n\n\nif __name__ == \"__main__\":\n    print_receipt()\n",
            "dry-py-receipts/before/receipts.py": "# BEFORE: the rule \"add 19% VAT and round to cents\" is copied into three functions.\n# When the rate went back from 16% to 19%, one copy was missed.\n\n\ndef book_line(title, net_price):\n    gross = round(net_price * 1.19, 2)\n    return f\"{title:<20}{gross:>8.2f} EUR\"\n\n\ndef food_line(item, net_price):\n    gross = round(net_price * 1.07, 2)  # food has a reduced rate: fine, but it's the same rule\n    return f\"{item:<20}{gross:>8.2f} EUR\"\n\n\ndef gift_card_line(code, net_price):\n    gross = round(net_price * 1.16, 2)  # copy-pasted in 2020, still the old rate\n    return f\"{code:<20}{gross:>8.2f} EUR\"\n\n\ndef print_receipt():\n    print(book_line(\"Dune\", 12.50))\n    print(food_line(\"Coffee beans\", 8.99))\n    print(gift_card_line(\"GIFT-25\", 21.01))\n\n\nif __name__ == \"__main__\":\n    print_receipt()\n"
          }
        },
        {
          "id": "dry-gd-damage",
          "title": "Weapon damage in Godot",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A sword and a fireball both compute crits, armor reduction and a damage popup. In before/ each has its own copy (they already disagree); in after/ damage_rules.gd is the single source and weapons pass only their numbers.",
          "roles": {
            "Duplicate": [
              "dry-gd-damage/before/sword.gd#hit",
              "dry-gd-damage/before/fireball.gd#explode"
            ],
            "Single Source": [
              "dry-gd-damage/after/damage_rules.gd#compute",
              "dry-gd-damage/after/damage_rules.gd#apply"
            ],
            "Caller": [
              "dry-gd-damage/after/sword.gd#hit",
              "dry-gd-damage/after/fireball.gd#explode"
            ]
          },
          "trace": [
            {
              "at": "dry-gd-damage/before/sword.gd#hit",
              "say": "The sword rolls a crit (x2), applies armor, rounds with a minimum of 1 and spawns a popup label."
            },
            {
              "at": "dry-gd-damage/before/fireball.gd#explode",
              "say": "The fireball repeats all of it, but crits are x1.5 and the minimum is gone. Design choice or typo? Nobody knows."
            },
            {
              "at": "dry-gd-damage/enemy.gd#receive_damage",
              "say": "Both copies end here. A balance pass would mean editing every weapon script and hoping none is missed."
            },
            {
              "at": "dry-gd-damage/after/sword.gd#hit",
              "say": "after/: the sword just hands its base damage and crit chance to DamageRules."
            },
            {
              "at": "dry-gd-damage/after/damage_rules.gd#compute",
              "say": "One formula, with named constants. Changing CRIT_MULTIPLIER rebalances every weapon at once."
            },
            {
              "at": "dry-gd-damage/after/damage_rules.gd#armor_factor",
              "say": "Even the armor curve has a name now, so a designer can find and tune it."
            },
            {
              "at": "dry-gd-damage/after/fireball.gd#explode",
              "say": "The fireball's only real difference, fire resistance, becomes an explicit parameter instead of a hidden edit."
            },
            {
              "at": "dry-gd-damage/after/damage_rules.gd#apply",
              "say": "Applying damage and the popup are shared too, so every weapon's numbers look identical on screen."
            }
          ],
          "files": {
            "dry-gd-damage/after/damage_rules.gd": "extends RefCounted\n\n# AFTER: the single source of truth for \"how much does a hit hurt?\".\n# Balance changes happen here once, and every weapon picks them up.\n\nconst CRIT_MULTIPLIER := 2.0\nconst MIN_DAMAGE := 1.0\n\nstatic func compute(base: float, crit_chance: float, enemy: Enemy, resist := 0.0) -> float:\n\tvar amount := base\n\tif randf() < crit_chance:\n\t\tamount *= CRIT_MULTIPLIER\n\tamount *= armor_factor(enemy.armor)\n\tamount *= 1.0 - resist\n\treturn max(MIN_DAMAGE, round(amount))\n\nstatic func armor_factor(armor: float) -> float:\n\treturn 100.0 / (100.0 + armor)\n\nstatic func apply(source: Node, enemy: Enemy, amount: float) -> void:\n\tenemy.receive_damage(amount)\n\tvar label := Label.new()\n\tlabel.text = str(amount)\n\tlabel.position = enemy.position + Vector2(0, -24)\n\tsource.get_tree().current_scene.add_child(label)\n",
            "dry-gd-damage/after/fireball.gd": "extends Area2D\n\n# AFTER: the fireball passes its one real difference, fire resistance, as data.\n\nconst DamageRules = preload(\"res://after/damage_rules.gd\")\n\n@export var base_damage := 40.0\n@export var crit_chance := 0.1\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body is Enemy:\n\t\texplode(body)\n\nfunc explode(enemy: Enemy) -> void:\n\tvar amount := DamageRules.compute(base_damage, crit_chance, enemy, enemy.fire_resist)\n\tDamageRules.apply(self, enemy, amount)\n\tqueue_free()\n",
            "dry-gd-damage/after/sword.gd": "extends Area2D\n\n# AFTER: the sword only says what is special about a sword: its numbers.\n\nconst DamageRules = preload(\"res://after/damage_rules.gd\")\n\n@export var base_damage := 25.0\n@export var crit_chance := 0.1\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body is Enemy:\n\t\thit(body)\n\nfunc hit(enemy: Enemy) -> void:\n\tvar amount := DamageRules.compute(base_damage, crit_chance, enemy)\n\tDamageRules.apply(self, enemy, amount)\n",
            "dry-gd-damage/before/fireball.gd": "extends Area2D\n\n# BEFORE: ...and copied here, with small drifts. Crits deal 1.5x instead of 2x, nobody knows if\n# that is a design choice or a typo, and the minimum-1 rule was lost.\n\n@export var base_damage := 40.0\n@export var crit_chance := 0.1\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body is Enemy:\n\t\texplode(body)\n\nfunc explode(enemy: Enemy) -> void:\n\tvar amount := base_damage\n\tif randf() < crit_chance:\n\t\tamount *= 1.5\n\tamount *= 100.0 / (100.0 + enemy.armor)\n\tamount *= 1.0 - enemy.fire_resist\n\tamount = round(amount)\n\tenemy.receive_damage(amount)\n\tvar label := Label.new()\n\tlabel.text = str(amount)\n\tlabel.position = enemy.position + Vector2(0, -24)\n\tget_tree().current_scene.add_child(label)\n\tqueue_free()\n",
            "dry-gd-damage/before/sword.gd": "extends Area2D\n\n# BEFORE: the damage rules (armor, crits, the popup number) are written out right here...\n\n@export var base_damage := 25.0\n@export var crit_chance := 0.1\n\nfunc _on_body_entered(body: Node2D) -> void:\n\tif body is Enemy:\n\t\thit(body)\n\nfunc hit(enemy: Enemy) -> void:\n\tvar amount := base_damage\n\tif randf() < crit_chance:\n\t\tamount *= 2.0\n\tamount *= 100.0 / (100.0 + enemy.armor)\n\tamount = max(1.0, round(amount))\n\tenemy.receive_damage(amount)\n\tvar label := Label.new()\n\tlabel.text = str(amount)\n\tlabel.position = enemy.position + Vector2(0, -24)\n\tget_tree().current_scene.add_child(label)\n",
            "dry-gd-damage/enemy.gd": "class_name Enemy\nextends CharacterBody2D\n\n# Shared by both versions: the thing being hit. It did not change during the refactor.\n\n@export var armor := 20.0\n@export var fire_resist := 0.5\nvar health := 100.0\n\nfunc receive_damage(amount: float) -> void:\n\thealth -= amount\n\tif health <= 0.0:\n\t\tqueue_free()\n"
          }
        },
        {
          "id": "dry-go-validation",
          "title": "Input validation in Go HTTP handlers",
          "lang": "Go",
          "level": "advanced",
          "source": null,
          "story": "Two endpoints accept the same user fields. In before/ each decodes, validates and writes errors by hand, and the email rules have drifted. In after/ one type owns validation and one generic helper owns the request plumbing.",
          "roles": {
            "Duplicate": [
              "dry-go-validation/before/handlers.go#UserHandlers.Signup",
              "dry-go-validation/before/handlers.go#UserHandlers.UpdateProfile"
            ],
            "Single Source": [
              "dry-go-validation/after/input.go#UserInput.Validate",
              "dry-go-validation/after/respond.go#decodeValid",
              "dry-go-validation/after/respond.go#writeError"
            ],
            "Caller": [
              "dry-go-validation/after/handlers.go#UserAPI.Signup",
              "dry-go-validation/after/handlers.go#UserAPI.UpdateProfile"
            ]
          },
          "trace": [
            {
              "at": "dry-go-validation/before/handlers.go#UserHandlers.Signup",
              "say": "Signup decodes JSON, checks the email has an @, writes a JSON error, lowercases the email, stores it."
            },
            {
              "at": "dry-go-validation/before/handlers.go#UserHandlers.UpdateProfile",
              "say": "UpdateProfile repeats it with a stricter email rule, another status code, another error key and no lowercasing. Clients see two APIs."
            },
            {
              "at": "dry-go-validation/after/handlers.go#UserAPI.Signup",
              "say": "after/: Signup asks for valid input in one line, then does its actual job."
            },
            {
              "at": "dry-go-validation/after/respond.go#decodeValid",
              "say": "The plumbing lives once. Generics let any input type that has Validate() reuse it."
            },
            {
              "at": "dry-go-validation/after/input.go#UserInput.Validate",
              "say": "The knowledge of a valid user, including lowercasing the email, now has a single owner."
            },
            {
              "at": "dry-go-validation/after/respond.go#writeError",
              "say": "One error format for the whole API: same content type, same JSON key, every time."
            },
            {
              "at": "dry-go-validation/after/handlers.go#UserAPI.UpdateProfile",
              "say": "UpdateProfile gets exactly the same rules for free. A third endpoint would cost three lines."
            }
          ],
          "files": {
            "dry-go-validation/after/handlers.go": "// AFTER: each handler now reads like a sentence: get valid input, do the one thing it is for.\npackage after\n\nimport \"net/http\"\n\ntype UserAPI struct {\n\tusers map[string]string\n}\n\nfunc (a *UserAPI) Signup(w http.ResponseWriter, r *http.Request) {\n\tin, ok := decodeValid[UserInput](w, r)\n\tif !ok {\n\t\treturn\n\t}\n\ta.users[in.Email] = in.Name\n\tw.WriteHeader(http.StatusCreated)\n}\n\nfunc (a *UserAPI) UpdateProfile(w http.ResponseWriter, r *http.Request) {\n\tin, ok := decodeValid[UserInput](w, r)\n\tif !ok {\n\t\treturn\n\t}\n\ta.users[in.Email] = in.Name\n\tw.WriteHeader(http.StatusOK)\n}\n",
            "dry-go-validation/after/input.go": "// AFTER: one type and one Validate method hold the knowledge \"what is valid user input\".\npackage after\n\nimport (\n\t\"errors\"\n\t\"strings\"\n)\n\ntype UserInput struct {\n\tEmail string `json:\"email\"`\n\tName  string `json:\"name\"`\n}\n\nfunc (in *UserInput) Validate() error {\n\tat := strings.Index(in.Email, \"@\")\n\tif at < 1 || !strings.Contains(in.Email[at:], \".\") {\n\t\treturn errors.New(\"email must look like name@domain.tld\")\n\t}\n\tif len(in.Name) < 2 {\n\t\treturn errors.New(\"name must have at least 2 characters\")\n\t}\n\tin.Email = strings.ToLower(in.Email)\n\treturn nil\n}\n",
            "dry-go-validation/after/respond.go": "// AFTER: the mechanics every handler shares (decode, validate, report) written once.\npackage after\n\nimport (\n\t\"encoding/json\"\n\t\"net/http\"\n)\n\ntype validator interface {\n\tValidate() error\n}\n\n// decodeValid reads JSON into a fresh T and validates it. Generic, so any input type can reuse it.\nfunc decodeValid[T any, PT interface {\n\t*T\n\tvalidator\n}](w http.ResponseWriter, r *http.Request) (*T, bool) {\n\tvar v T\n\tif err := json.NewDecoder(r.Body).Decode(&v); err != nil {\n\t\twriteError(w, http.StatusBadRequest, \"bad json\")\n\t\treturn nil, false\n\t}\n\tif err := PT(&v).Validate(); err != nil {\n\t\twriteError(w, http.StatusUnprocessableEntity, err.Error())\n\t\treturn nil, false\n\t}\n\treturn &v, true\n}\n\nfunc writeError(w http.ResponseWriter, status int, msg string) {\n\tw.Header().Set(\"Content-Type\", \"application/json\")\n\tw.WriteHeader(status)\n\tjson.NewEncoder(w).Encode(map[string]string{\"error\": msg})\n}\n",
            "dry-go-validation/before/handlers.go": "// BEFORE: two HTTP handlers that each decode, validate and report errors their own way.\n// The \"what is a valid email\" rule exists twice, and the copies already disagree.\npackage before\n\nimport (\n\t\"encoding/json\"\n\t\"net/http\"\n\t\"strings\"\n)\n\ntype signupForm struct {\n\tEmail string `json:\"email\"`\n\tName  string `json:\"name\"`\n}\n\ntype profileForm struct {\n\tEmail string `json:\"email\"`\n\tName  string `json:\"name\"`\n}\n\ntype UserHandlers struct {\n\tusers map[string]string\n}\n\nfunc (h *UserHandlers) Signup(w http.ResponseWriter, r *http.Request) {\n\tvar f signupForm\n\tif err := json.NewDecoder(r.Body).Decode(&f); err != nil {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tw.WriteHeader(http.StatusBadRequest)\n\t\tjson.NewEncoder(w).Encode(map[string]string{\"error\": \"bad json\"})\n\t\treturn\n\t}\n\tif !strings.Contains(f.Email, \"@\") || len(f.Name) < 2 {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tw.WriteHeader(http.StatusUnprocessableEntity)\n\t\tjson.NewEncoder(w).Encode(map[string]string{\"error\": \"invalid email or name\"})\n\t\treturn\n\t}\n\th.users[strings.ToLower(f.Email)] = f.Name\n\tw.WriteHeader(http.StatusCreated)\n}\n\nfunc (h *UserHandlers) UpdateProfile(w http.ResponseWriter, r *http.Request) {\n\tvar f profileForm\n\tif err := json.NewDecoder(r.Body).Decode(&f); err != nil {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tw.WriteHeader(http.StatusBadRequest)\n\t\tjson.NewEncoder(w).Encode(map[string]string{\"error\": \"bad json\"})\n\t\treturn\n\t}\n\t// Copied from Signup, then \"improved\" here only: now the two endpoints accept different emails.\n\tat := strings.Index(f.Email, \"@\")\n\tif at < 1 || !strings.Contains(f.Email[at:], \".\") || len(f.Name) < 2 {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tw.WriteHeader(http.StatusBadRequest)\n\t\tjson.NewEncoder(w).Encode(map[string]string{\"message\": \"invalid input\"})\n\t\treturn\n\t}\n\th.users[f.Email] = f.Name\n\tw.WriteHeader(http.StatusOK)\n}\n"
          }
        }
      ]
    },
    {
      "id": "kiss-yagni",
      "name": "KISS and YAGNI",
      "family": "Principles",
      "aka": [
        "Keep It Simple, Stupid",
        "You Aren't Gonna Need It",
        "Simplest thing that could possibly work"
      ],
      "tagline": "Build the simplest thing that solves today's real problem, not tomorrow's imagined one.",
      "intent": "KISS says to prefer the plainest design that works; YAGNI says not to build features, options or extension points until a real need arrives. Together they fight speculative generality: interfaces with one implementation, factories with one product and options nobody reads, which cost time to write, read, test and change.",
      "analogy": "Packing for a weekend trip: you take what you need for two days, not a tent, a snorkel and a winter coat \"just in case\". If you really need something, you can buy it there.",
      "cityShape": "In before/ the city has a cluster of buildings (interfaces, registries, factories, pipelines) whose pipes all funnel into one short floor that does the real work. In after/ that cluster collapses into one or two small buildings, and the client's call pipe goes straight to the work.",
      "roles": [
        {
          "name": "Speculative Generality",
          "desc": "In before/: abstractions, options and extension points built for needs that do not exist yet."
        },
        {
          "name": "Real Work",
          "desc": "The few lines that actually solve the problem; in before/ they are buried, in after/ they are the whole design."
        },
        {
          "name": "Client",
          "desc": "The code that uses the feature. Notice how much it must know in each version."
        }
      ],
      "whenToUse": [
        "You catch yourself saying \"in case we later need...\" while adding an interface, a flag or a plugin system.",
        "An abstraction has exactly one implementation and no test double uses it.",
        "A reviewer needs a diagram to understand a feature that one sentence describes."
      ],
      "pitfalls": [
        "Simple is not the same as sloppy: input checks, error handling and tests are part of the simplest thing that works.",
        "YAGNI applies to features, not to keeping code easy to change; small, well-named functions are what let you add the real need later.",
        "Some decisions are expensive to reverse (public APIs, data formats, security); think ahead for those, not for everything."
      ],
      "related": [
        "dry",
        "coupling-cohesion",
        "single-responsibility",
        "open-closed",
        "god-object",
        "strategy"
      ],
      "quiz": [
        {
          "q": "A team adds an IPaymentProvider interface while only one payment provider exists and none is planned. When is that NOT speculative generality?",
          "options": [
            "Never, interfaces are always good",
            "When tests use a fake implementation of it today",
            "When the interface has many methods",
            "When the class name ends in Provider"
          ],
          "answer": 1,
          "why": "An abstraction earns its place by a real, current use: a second implementation, including a test double. Otherwise it is cost without benefit."
        },
        {
          "q": "Why does the after/ Kotlin export handle commas in titles while the before/ version does not?",
          "options": [
            "Kotlin's CSV library does it automatically",
            "With less machinery to maintain, attention went to the real requirement and its edge cases",
            "The before/ version uses XML",
            "Commas are not allowed in todo titles"
          ],
          "answer": 1,
          "why": "Speculative code spends effort on imagined needs. The simple version is small enough that its real edge cases become visible and get handled."
        }
      ],
      "demos": [
        {
          "id": "kiss-ts-temperature",
          "title": "Celsius to Fahrenheit, two ways",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A weather widget must show °F next to °C. before/ builds an interface, an abstract base, a singleton registry and string keys; after/ is one function. Both print the same label.",
          "roles": {
            "Speculative Generality": [
              "kiss-ts-temperature/before/converters.ts#UnitConverter",
              "kiss-ts-temperature/before/converters.ts#BaseConverter",
              "kiss-ts-temperature/before/registry.ts#ConverterRegistry"
            ],
            "Real Work": [
              "kiss-ts-temperature/before/converters.ts#CelsiusToFahrenheit.apply",
              "kiss-ts-temperature/after/temperature.ts#celsiusToFahrenheit"
            ],
            "Client": [
              "kiss-ts-temperature/before/widget.ts#weatherLabel",
              "kiss-ts-temperature/after/widget.ts#weatherLabel"
            ]
          },
          "trace": [
            {
              "at": "kiss-ts-temperature/before/widget.ts#weatherLabel",
              "say": "The widget must fetch a registry singleton and look up a converter by string keys just to show one number."
            },
            {
              "at": "kiss-ts-temperature/before/registry.ts#ConverterRegistry.get",
              "say": "A lazily created singleton registers the only converter that will ever exist."
            },
            {
              "at": "kiss-ts-temperature/before/registry.ts#ConverterRegistry.find",
              "say": "Lookup by 'C->F' can fail at runtime with a typo, an error the simple version cannot even have."
            },
            {
              "at": "kiss-ts-temperature/before/converters.ts#BaseConverter.convert",
              "say": "A template method for one subclass: you have to open two classes to read one formula."
            },
            {
              "at": "kiss-ts-temperature/before/converters.ts#CelsiusToFahrenheit.apply",
              "say": "Finally the real work: one line of arithmetic, buried three levels deep."
            },
            {
              "at": "kiss-ts-temperature/after/widget.ts#weatherLabel",
              "say": "after/: the widget calls a plain function. The code reads like the requirement."
            },
            {
              "at": "kiss-ts-temperature/after/temperature.ts#celsiusToFahrenheit",
              "say": "Same result, same rounding, one function to test. A second unit later would be a second small function."
            }
          ],
          "files": {
            "kiss-ts-temperature/after/temperature.ts": "// AFTER: the simplest thing that does today's job. One function, one formula, easy to test.\n// If a second unit is ever really needed, adding a second function takes a minute.\nexport function celsiusToFahrenheit(celsius: number): number {\n  return Math.round((celsius * 9 / 5 + 32) * 10) / 10;\n}\n",
            "kiss-ts-temperature/after/widget.ts": "import { celsiusToFahrenheit } from './temperature';\n\n// The caller reads exactly like the requirement.\nexport function weatherLabel(celsius: number): string {\n  return `${celsius}°C / ${celsiusToFahrenheit(celsius)}°F`;\n}\n",
            "kiss-ts-temperature/before/converters.ts": "// BEFORE: the task was \"show a temperature in °F next to °C\".\n// We got an interface, an abstract base class and a registry \"in case we add more units\".\n\nexport interface UnitConverter {\n  readonly from: string;\n  readonly to: string;\n  convert(value: number): number;\n}\n\nexport abstract class BaseConverter implements UnitConverter {\n  abstract readonly from: string;\n  abstract readonly to: string;\n\n  convert(value: number): number {\n    return this.round(this.apply(value));\n  }\n\n  protected abstract apply(value: number): number;\n\n  protected round(value: number): number {\n    return Math.round(value * 10) / 10;\n  }\n}\n\nexport class CelsiusToFahrenheit extends BaseConverter {\n  readonly from = 'C';\n  readonly to = 'F';\n\n  protected apply(value: number): number {\n    return value * 9 / 5 + 32;\n  }\n}\n",
            "kiss-ts-temperature/before/registry.ts": "import { UnitConverter, CelsiusToFahrenheit } from './converters';\n\n// A plugin registry with exactly one plugin, and a factory that looks things up by string keys.\nexport class ConverterRegistry {\n  private static instance: ConverterRegistry | null = null;\n  private converters = new Map<string, UnitConverter>();\n\n  static get(): ConverterRegistry {\n    if (!ConverterRegistry.instance) {\n      ConverterRegistry.instance = new ConverterRegistry();\n      ConverterRegistry.instance.register(new CelsiusToFahrenheit());\n    }\n    return ConverterRegistry.instance;\n  }\n\n  register(converter: UnitConverter): void {\n    this.converters.set(`${converter.from}->${converter.to}`, converter);\n  }\n\n  find(from: string, to: string): UnitConverter {\n    const converter = this.converters.get(`${from}->${to}`);\n    if (!converter) {\n      throw new Error(`No converter from ${from} to ${to}`);\n    }\n    return converter;\n  }\n}\n",
            "kiss-ts-temperature/before/widget.ts": "import { ConverterRegistry } from './registry';\n\n// The caller has to know about registries and string keys just to show one number.\nexport function weatherLabel(celsius: number): string {\n  const converter = ConverterRegistry.get().find('C', 'F');\n  return `${celsius}°C / ${converter.convert(celsius)}°F`;\n}\n"
          }
        },
        {
          "id": "kiss-kt-export",
          "title": "Exporting todos as CSV",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "The ticket asked for a CSV download. before/ built formats, a hook pipeline, an XML stub and options nobody reads; after/ is two functions and also fixes the comma bug the flexible version missed.",
          "roles": {
            "Speculative Generality": [
              "kiss-kt-export/before/Exporters.kt#ExportFormat",
              "kiss-kt-export/before/Exporters.kt#ExportOptions",
              "kiss-kt-export/before/Exporters.kt#XmlFormat",
              "kiss-kt-export/before/ExportPipeline.kt#ExportPipeline"
            ],
            "Real Work": [
              "kiss-kt-export/before/Exporters.kt#CsvFormat.row",
              "kiss-kt-export/after/CsvExport.kt#todosToCsv",
              "kiss-kt-export/after/CsvExport.kt#csvCell"
            ],
            "Client": [
              "kiss-kt-export/Main.kt#main",
              "kiss-kt-export/before/ExportPipeline.kt#downloadTodos",
              "kiss-kt-export/after/CsvExport.kt#downloadTodos"
            ]
          },
          "trace": [
            {
              "at": "kiss-kt-export/Main.kt#main",
              "say": "The same two todos are exported by both versions. One title contains a comma."
            },
            {
              "at": "kiss-kt-export/before/ExportPipeline.kt#downloadTodos",
              "say": "Wiring the pipeline needs a format map, including an XML format that only throws TODO."
            },
            {
              "at": "kiss-kt-export/before/ExportPipeline.kt#ExportPipeline.run",
              "say": "run() loops over empty hook lists and reads options that are always defaults. Each line must still be read and tested."
            },
            {
              "at": "kiss-kt-export/before/Exporters.kt#CsvFormat.row",
              "say": "The real job is here, and it writes 'Buy milk, eggs' unquoted: the CSV row breaks into four columns."
            },
            {
              "at": "kiss-kt-export/after/CsvExport.kt#downloadTodos",
              "say": "after/: the entry point just calls todosToCsv. No registry, no options object."
            },
            {
              "at": "kiss-kt-export/after/CsvExport.kt#todosToCsv",
              "say": "Header plus one line per todo. Everything the ticket asked for fits on one screen."
            },
            {
              "at": "kiss-kt-export/after/CsvExport.kt#csvCell",
              "say": "With the noise gone, the real edge case gets attention: cells with commas or quotes are quoted."
            }
          ],
          "files": {
            "kiss-kt-export/Main.kt": "// Written for both versions: the same todos, exported the old way and the new way.\n\nimport model.Todo\n\nfun main() {\n    val todos = listOf(\n        Todo(\"Buy milk, eggs\", false, \"2026-10-08\"),\n        Todo(\"Ship v1\", true, null)\n    )\n    println(before.downloadTodos(todos))\n    println(after.downloadTodos(todos))\n}\n",
            "kiss-kt-export/Todo.kt": "// Shared by both versions: the data being exported.\n\npackage model\n\ndata class Todo(val title: String, val done: Boolean, val due: String?)\n",
            "kiss-kt-export/after/CsvExport.kt": "// AFTER: exactly what the ticket asked for. It also quotes commas inside titles,\n// a real bug the \"flexible\" version never handled while it was busy being flexible.\n\npackage after\n\nimport model.Todo\n\nfun todosToCsv(todos: List<Todo>): String {\n    val lines = mutableListOf(\"title,done,due\")\n    for (todo in todos) {\n        lines.add(listOf(csvCell(todo.title), todo.done.toString(), todo.due ?: \"\").joinToString(\",\"))\n    }\n    return lines.joinToString(\"\\n\")\n}\n\nfun csvCell(text: String): String {\n    if (text.contains(',') || text.contains('\"')) {\n        return \"\\\"\" + text.replace(\"\\\"\", \"\\\"\\\"\") + \"\\\"\"\n    }\n    return text\n}\n\nfun downloadTodos(todos: List<Todo>): String {\n    return todosToCsv(todos)\n}\n",
            "kiss-kt-export/before/ExportPipeline.kt": "// BEFORE: a pipeline with pluggable formats and before/after hooks. Every hook list is empty.\n\npackage before\n\nimport model.Todo\n\nclass ExportPipeline(private val formats: Map<String, ExportFormat>) {\n    private val beforeHooks = mutableListOf<(List<Todo>) -> List<Todo>>()\n    private val afterHooks = mutableListOf<(String) -> String>()\n\n    fun addBeforeHook(hook: (List<Todo>) -> List<Todo>) {\n        beforeHooks.add(hook)\n    }\n\n    fun run(todos: List<Todo>, formatKey: String, options: ExportOptions = ExportOptions()): String {\n        val format = formats[formatKey] ?: error(\"Unknown format $formatKey\")\n        var items = todos\n        for (hook in beforeHooks) {\n            items = hook(items)\n        }\n        val lines = mutableListOf<String>()\n        if (options.includeHeader) {\n            lines.add(format.header(options))\n        }\n        for (todo in items) {\n            lines.add(format.row(todo, options))\n        }\n        var output = lines.joinToString(\"\\n\")\n        for (hook in afterHooks) {\n            output = hook(output)\n        }\n        return output\n    }\n}\n\nfun downloadTodos(todos: List<Todo>): String {\n    val pipeline = ExportPipeline(mapOf(\"csv\" to CsvFormat(), \"xml\" to XmlFormat()))\n    return pipeline.run(todos, \"csv\")\n}\n",
            "kiss-kt-export/before/Exporters.kt": "// BEFORE: the ticket said \"let users download their todos as CSV\".\n// The code is ready for XML, custom hooks and options nobody asked for.\n\npackage before\n\nimport model.Todo\n\ninterface ExportFormat {\n    val extension: String\n    fun header(options: ExportOptions): String\n    fun row(todo: Todo, options: ExportOptions): String\n}\n\ndata class ExportOptions(\n    val delimiter: Char = ',',\n    val includeHeader: Boolean = true,\n    val dateFormat: String = \"yyyy-MM-dd\",   // never read anywhere\n    val locale: String = \"en-US\",            // never read anywhere\n    val compress: Boolean = false,           // \"for later\"\n    val encryptWith: String? = null          // \"for later\"\n)\n\nclass CsvFormat : ExportFormat {\n    override val extension = \"csv\"\n\n    override fun header(options: ExportOptions): String {\n        return listOf(\"title\", \"done\", \"due\").joinToString(options.delimiter.toString())\n    }\n\n    override fun row(todo: Todo, options: ExportOptions): String {\n        return listOf(todo.title, todo.done.toString(), todo.due ?: \"\").joinToString(options.delimiter.toString())\n    }\n}\n\nclass XmlFormat : ExportFormat {\n    override val extension = \"xml\"\n\n    override fun header(options: ExportOptions): String {\n        TODO(\"XML export is planned for v3\")\n    }\n\n    override fun row(todo: Todo, options: ExportOptions): String {\n        TODO(\"XML export is planned for v3\")\n    }\n}\n"
          }
        },
        {
          "id": "kiss-cs-leaderboard",
          "title": "A game's high-score table",
          "lang": "C#",
          "level": "advanced",
          "source": null,
          "story": "A small game keeps its top scores in one JSON file. before/ wraps that in a generic repository, a cache decorator and a backend factory; after/ is one HighScores class. The game-over screen uses both.",
          "roles": {
            "Speculative Generality": [
              "kiss-cs-leaderboard/before/Repositories.cs#IRepository",
              "kiss-cs-leaderboard/before/Repositories.cs#CachingRepository",
              "kiss-cs-leaderboard/before/RepositoryFactory.cs#RepositoryFactory"
            ],
            "Real Work": [
              "kiss-cs-leaderboard/before/LeaderboardService.cs#LeaderboardService",
              "kiss-cs-leaderboard/after/HighScores.cs#HighScores"
            ],
            "Client": [
              "kiss-cs-leaderboard/GameOverScreen.cs#GameOverScreen"
            ]
          },
          "trace": [
            {
              "at": "kiss-cs-leaderboard/GameOverScreen.cs#GameOverScreen.ShowWithService",
              "say": "The game-over screen submits a score and prints the top 10 using the layered version."
            },
            {
              "at": "kiss-cs-leaderboard/before/LeaderboardService.cs#LeaderboardService.LeaderboardService",
              "say": "The service's constructor needs a factory, a backend enum and an entity type with a GUID id nobody uses."
            },
            {
              "at": "kiss-cs-leaderboard/before/RepositoryFactory.cs#RepositoryFactory.Create",
              "say": "A switch over three backends where two only throw 'planned'. YAGNI: they are guesses, not requirements."
            },
            {
              "at": "kiss-cs-leaderboard/before/Repositories.cs#CachingRepository.GetAll",
              "say": "A cache in front of a list that is already in memory: an extra layer to debug, zero speed gained."
            },
            {
              "at": "kiss-cs-leaderboard/before/Repositories.cs#JsonFileRepository.SaveChanges",
              "say": "The real I/O is one line. Notice the file still grows forever: the actual top-10 rule was never written."
            },
            {
              "at": "kiss-cs-leaderboard/GameOverScreen.cs#GameOverScreen.ShowWithHighScores",
              "say": "Same screen, new class: create it with a path, submit, print. Nothing else to know."
            },
            {
              "at": "kiss-cs-leaderboard/after/HighScores.cs#HighScores.Submit",
              "say": "Add, sort, keep the best 10, save. The real requirement is visible and done in four lines."
            }
          ],
          "files": {
            "kiss-cs-leaderboard/GameOverScreen.cs": "// Shared client: the game-over screen, shown wired to the old service and to the new class.\nusing System;\n\npublic class GameOverScreen\n{\n    public void ShowWithService(string player, int points)\n    {\n        var service = new LeaderboardService();\n        service.Submit(player, points);\n        foreach (var s in service.Top(10))\n        {\n            Console.WriteLine($\"{s.Player,-12}{s.Points,8}\");\n        }\n    }\n\n    public void ShowWithHighScores(string player, int points)\n    {\n        var scores = new HighScores(\"scores.json\");\n        scores.Submit(player, points);\n        foreach (var s in scores.Top)\n        {\n            Console.WriteLine($\"{s.Player,-12}{s.Points,8}\");\n        }\n    }\n}\n",
            "kiss-cs-leaderboard/after/HighScores.cs": "// AFTER: one small class that does what the game needs: load, add, keep the best 10, save.\n// No IDs, no generic repository, no factory. If the game ever needs a server, that will be a\n// new requirement with real details, and this class is small enough to replace in an afternoon.\nusing System.Collections.Generic;\nusing System.IO;\nusing System.Linq;\nusing System.Text.Json;\n\npublic record Score(string Player, int Points);\n\npublic class HighScores\n{\n    private const int MaxEntries = 10;\n    private readonly string _path;\n    private List<Score> _scores;\n\n    public HighScores(string path)\n    {\n        _path = path;\n        _scores = File.Exists(path) ? JsonSerializer.Deserialize<List<Score>>(File.ReadAllText(path)) ?? new() : new();\n    }\n\n    public IReadOnlyList<Score> Top => _scores;\n\n    public void Submit(string player, int points)\n    {\n        _scores.Add(new Score(player, points));\n        _scores = _scores.OrderByDescending(s => s.Points).Take(MaxEntries).ToList();\n        File.WriteAllText(_path, JsonSerializer.Serialize(_scores));\n    }\n}\n",
            "kiss-cs-leaderboard/before/LeaderboardService.cs": "// BEFORE: the code that actually matters, buried under three layers it has to wire up.\nusing System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic record ScoreEntity(string Id, string Player, int Points) : IEntity;\n\npublic class LeaderboardService\n{\n    private readonly IRepository<ScoreEntity> _scores;\n\n    public LeaderboardService()\n    {\n        var factory = new RepositoryFactory<ScoreEntity>();\n        _scores = factory.Create(StorageBackend.JsonFile, \"scores.json\");\n    }\n\n    public void Submit(string player, int points)\n    {\n        _scores.Add(new ScoreEntity(Guid.NewGuid().ToString(), player, points));\n        _scores.SaveChanges();\n    }\n\n    public IReadOnlyList<ScoreEntity> Top(int count)\n    {\n        return _scores.GetAll().OrderByDescending(s => s.Points).Take(count).ToList();\n    }\n}\n",
            "kiss-cs-leaderboard/before/Repositories.cs": "// BEFORE: a small game needs to keep its top-10 scores in one JSON file.\n// What got built: a generic repository layer, a cache decorator and a factory.\nusing System.Collections.Generic;\nusing System.IO;\nusing System.Linq;\nusing System.Text.Json;\n\npublic interface IEntity\n{\n    string Id { get; }\n}\n\npublic interface IRepository<T> where T : IEntity\n{\n    IEnumerable<T> GetAll();\n    T? GetById(string id);\n    void Add(T item);\n    void SaveChanges();\n}\n\npublic class JsonFileRepository<T> : IRepository<T> where T : IEntity\n{\n    private readonly string _path;\n    private List<T> _items;\n\n    public JsonFileRepository(string path)\n    {\n        _path = path;\n        _items = File.Exists(path) ? JsonSerializer.Deserialize<List<T>>(File.ReadAllText(path)) ?? new() : new();\n    }\n\n    public IEnumerable<T> GetAll()\n    {\n        return _items;\n    }\n\n    public T? GetById(string id)\n    {\n        return _items.FirstOrDefault(x => x.Id == id);\n    }\n\n    public void Add(T item)\n    {\n        _items.Add(item);\n    }\n\n    public void SaveChanges()\n    {\n        File.WriteAllText(_path, JsonSerializer.Serialize(_items));\n    }\n}\n\n// \"Reading a 1 KB file might get slow one day.\"\npublic class CachingRepository<T> : IRepository<T> where T : IEntity\n{\n    private readonly IRepository<T> _inner;\n    private List<T>? _cache;\n\n    public CachingRepository(IRepository<T> inner)\n    {\n        _inner = inner;\n    }\n\n    public IEnumerable<T> GetAll()\n    {\n        return _cache ??= _inner.GetAll().ToList();\n    }\n\n    public T? GetById(string id)\n    {\n        return GetAll().FirstOrDefault(x => x.Id == id);\n    }\n\n    public void Add(T item)\n    {\n        _cache = null;\n        _inner.Add(item);\n    }\n\n    public void SaveChanges()\n    {\n        _inner.SaveChanges();\n    }\n}\n",
            "kiss-cs-leaderboard/before/RepositoryFactory.cs": "// BEFORE: a factory with a backend switch for databases the game will never have.\npublic enum StorageBackend { JsonFile, Sqlite, Cloud }\n\npublic class RepositoryFactory<T> where T : IEntity\n{\n    public IRepository<T> Create(StorageBackend backend, string location)\n    {\n        switch (backend)\n        {\n            case StorageBackend.JsonFile:\n                return new CachingRepository<T>(new JsonFileRepository<T>(location));\n            default:\n                throw new System.NotSupportedException($\"{backend} is planned\");\n        }\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "law-of-demeter",
      "name": "Law of Demeter",
      "family": "Principles",
      "aka": [
        "Principle of least knowledge",
        "Talk only to your friends",
        "Tell, don't ask"
      ],
      "tagline": "Talk to your direct friends, not to your friends' friends.",
      "intent": "A method should only call methods on itself, its fields, its parameters and objects it creates. Chains like a.getB().getC().doIt() (train wrecks) make the caller depend on the inner structure of objects it does not own, so a change deep inside ripples outward. The fix is to ask the direct friend to do the job (tell, don't ask), and let each object pass the request one hop further.",
      "analogy": "At a shop you hand the cashier your payment; the cashier does not reach into your bag, open your wallet and count out the coins. You decide how to pay.",
      "cityShape": "Watch the pipes from the client building. The train-wreck floor sends pipes that skip over the friend building and land in a stranger building further away. The fixed floor sends a single short pipe to its friend, which forwards one hop at a time, so the pipes form a tidy chain of neighbours instead of a long jump.",
      "roles": [
        {
          "name": "Client",
          "desc": "The object that needs something done (the paperboy, the enemy, the controller)."
        },
        {
          "name": "Friend",
          "desc": "A direct collaborator: one of the client's fields, a parameter, or an object it created."
        },
        {
          "name": "Stranger",
          "desc": "An object the client can only reach through a friend's getter. Depending on it is the problem."
        },
        {
          "name": "Train Wreck",
          "desc": "The violating code: a chain of getters that reaches a stranger and works on its data."
        },
        {
          "name": "Delegating Method",
          "desc": "The fix: a method on the friend that answers the real question, passing the request one hop further."
        }
      ],
      "whenToUse": [
        "You see chains of getters like order.getCustomer().getAddress().getCountry() in code that is not the owner of those objects.",
        "A small change inside one class (renaming a field, moving data) breaks callers far away.",
        "Godot scripts use long node paths like get_node(\"../../World/Player/Inventory\") to reach other scenes' insides."
      ],
      "pitfalls": [
        "Counting dots is not the rule: fluent builders and LINQ/stream chains return the same or a value-like object, so they are fine.",
        "Blindly adding a wrapper method for every getter bloats the friend with pass-through methods; add methods that answer real questions (threatLevel, vat), not getWalletMoney.",
        "Plain data objects (DTOs, config structs) are meant to be read; demanding delegation everywhere there adds noise without reducing coupling."
      ],
      "related": [
        "coupling-cohesion",
        "encapsulation",
        "facade",
        "mediator",
        "dependency-inversion"
      ],
      "quiz": [
        {
          "q": "Which call breaks the Law of Demeter?",
          "options": [
            "this.logger.info(\"saved\")",
            "order.getCustomer().getAddress().getZip()",
            "builder.setName(\"x\").setAge(3).build()",
            "new Invoice(order).total()"
          ],
          "answer": 1,
          "why": "It reaches through Customer and Address, two strangers. The builder chain keeps talking to the same object, and an object you create is a friend."
        },
        {
          "q": "What is the main benefit of replacing customer.getWallet().subtractMoney(x) with customer.pay(x)?",
          "options": [
            "It runs faster",
            "The paperboy no longer depends on Wallet, so the customer can change how it pays without breaking him",
            "It removes the Wallet class",
            "It makes the Customer class shorter"
          ],
          "answer": 1,
          "why": "Demeter reduces how many classes a caller is coupled to. The knowledge of how to pay stays inside Customer."
        }
      ],
      "demos": [
        {
          "id": "demeter-java-paperboy",
          "title": "The paperboy and the wallet",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "The classic example. The paperboy collects money twice: once by grabbing the customer's wallet, once by asking the customer to pay. Compare which buildings each method's pipes reach.",
          "roles": {
            "Client": [
              "demeter-java-paperboy/Paperboy.java#Paperboy"
            ],
            "Friend": [
              "demeter-java-paperboy/Customer.java#Customer"
            ],
            "Stranger": [
              "demeter-java-paperboy/Wallet.java#Wallet"
            ],
            "Train Wreck": [
              "demeter-java-paperboy/Paperboy.java#Paperboy.collectRudely"
            ],
            "Delegating Method": [
              "demeter-java-paperboy/Customer.java#Customer.pay"
            ]
          },
          "trace": [
            {
              "at": "demeter-java-paperboy/Route.java#Route.main",
              "say": "The route visits two customers, first with the rude paperboy, then with the polite one."
            },
            {
              "at": "demeter-java-paperboy/Paperboy.java#Paperboy.collectRudely",
              "say": "The rude way: get the customer's wallet, check its money, take it. The paperboy now depends on Wallet."
            },
            {
              "at": "demeter-java-paperboy/Customer.java#Customer.getWallet",
              "say": "This getter is the leak. Once a stranger is handed out, any class can start poking at it."
            },
            {
              "at": "demeter-java-paperboy/Wallet.java#Wallet.subtractMoney",
              "say": "Money leaves the wallet without the customer deciding anything. Card payments would break the paperboy."
            },
            {
              "at": "demeter-java-paperboy/Paperboy.java#Paperboy.collect",
              "say": "The polite way: one call to the friend he was given. The paperboy has no idea a Wallet exists."
            },
            {
              "at": "demeter-java-paperboy/Customer.java#Customer.pay",
              "say": "The customer talks to its own field. How to pay, and what to do when short, is its own business."
            }
          ],
          "files": {
            "demeter-java-paperboy/Customer.java": "// The paperboy's friend: he is handed a Customer, so he may talk to it.\npublic class Customer {\n    private final String name;\n    private final Wallet wallet;\n\n    public Customer(String name, Wallet wallet) {\n        this.name = name;\n        this.wallet = wallet;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    // The leak: handing out the wallet lets anyone dig through it.\n    public Wallet getWallet() {\n        return wallet;\n    }\n\n    // The fix: \"tell, don't ask\". The customer decides how to pay.\n    public double pay(double amount) {\n        if (wallet.getTotalMoney() < amount) {\n            return 0;\n        }\n        wallet.subtractMoney(amount);\n        return amount;\n    }\n}\n",
            "demeter-java-paperboy/Paperboy.java": "public class Paperboy {\n    private double collected = 0;\n\n    // VIOLATION: customer.getWallet().subtractMoney(...) reaches through a friend into a stranger.\n    // The paperboy now depends on Wallet too, and if customers ever pay by card, this breaks.\n    public void collectRudely(Customer customer, double due) {\n        Wallet wallet = customer.getWallet();\n        if (wallet.getTotalMoney() >= due) {\n            wallet.subtractMoney(due);\n            collected += due;\n        }\n    }\n\n    // FIX: talk only to the friend you were given. One dot, one object.\n    public void collect(Customer customer, double due) {\n        double paid = customer.pay(due);\n        collected += paid;\n        if (paid == 0) {\n            System.out.println(customer.getName() + \" will pay next week.\");\n        }\n    }\n\n    public double getCollected() {\n        return collected;\n    }\n}\n",
            "demeter-java-paperboy/Route.java": "import java.util.List;\n\n// Runs the morning route twice: the rude way and the polite way.\npublic class Route {\n    public static void main(String[] args) {\n        List<Customer> street = List.of(\n            new Customer(\"Ana\", new Wallet(20)),\n            new Customer(\"Ben\", new Wallet(1))\n        );\n\n        Paperboy rude = new Paperboy();\n        for (Customer c : street) {\n            rude.collectRudely(c, 2.50);\n        }\n\n        Paperboy polite = new Paperboy();\n        for (Customer c : street) {\n            polite.collect(c, 2.50);\n        }\n        System.out.println(\"Collected: \" + polite.getCollected());\n    }\n}\n",
            "demeter-java-paperboy/Wallet.java": "// A stranger to the paperboy. Only the customer should ever touch it.\npublic class Wallet {\n    private double money;\n\n    public Wallet(double money) {\n        this.money = money;\n    }\n\n    public double getTotalMoney() {\n        return money;\n    }\n\n    public void subtractMoney(double amount) {\n        money -= amount;\n    }\n}\n"
          }
        },
        {
          "id": "demeter-gd-enemy-courage",
          "title": "When should the goblin flee?",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A goblin flees from strong players. One version walks a long node path and digs through Player, Inventory and Weapon; the other asks its exported player for threat_level() and lets each object answer one hop.",
          "roles": {
            "Client": [
              "demeter-gd-enemy-courage/enemy.gd#_physics_process"
            ],
            "Friend": [
              "demeter-gd-enemy-courage/player.gd#threat_level"
            ],
            "Stranger": [
              "demeter-gd-enemy-courage/weapon.gd#damage_per_hit",
              "demeter-gd-enemy-courage/inventory.gd#get_equipped"
            ],
            "Train Wreck": [
              "demeter-gd-enemy-courage/enemy.gd#should_flee_train_wreck"
            ],
            "Delegating Method": [
              "demeter-gd-enemy-courage/player.gd#threat_level",
              "demeter-gd-enemy-courage/inventory.gd#equipped_damage"
            ]
          },
          "trace": [
            {
              "at": "demeter-gd-enemy-courage/enemy.gd#should_flee_train_wreck",
              "say": "The node path hard-codes the scene layout, then the chain digs through inventory and weapon fields."
            },
            {
              "at": "demeter-gd-enemy-courage/player.gd#get_inventory",
              "say": "Exposing the inventory invites strangers in. Now goblins know how inventories work."
            },
            {
              "at": "demeter-gd-enemy-courage/inventory.gd#get_equipped",
              "say": "A second hop. The goblin also copies the damage formula, which will silently go stale."
            },
            {
              "at": "demeter-gd-enemy-courage/enemy.gd#_physics_process",
              "say": "The goblin's real loop calls the polite version and moves away or toward its exported player."
            },
            {
              "at": "demeter-gd-enemy-courage/enemy.gd#should_flee",
              "say": "One dot to a friend the level gave us: how threatening are you? No paths, no inventory."
            },
            {
              "at": "demeter-gd-enemy-courage/player.gd#threat_level",
              "say": "The player combines its own health with what its own friend, the inventory, reports."
            },
            {
              "at": "demeter-gd-enemy-courage/inventory.gd#equipped_damage",
              "say": "The inventory asks its own weapon. Each object only talks to its direct neighbour."
            },
            {
              "at": "demeter-gd-enemy-courage/weapon.gd#damage_per_hit",
              "say": "The formula lives with the data it uses. Changing upgrades now touches only weapon.gd."
            }
          ],
          "files": {
            "demeter-gd-enemy-courage/enemy.gd": "extends CharacterBody2D\n\n# A goblin that runs away from dangerous players. Same decision, written twice.\n\n@export var player: Player   # a friend: the level hands it to us\n@export var courage := 15.0\n\n# VIOLATION 1: a node path that walks the whole scene tree. Rename \"World\" and every enemy breaks.\n# VIOLATION 2: a train wreck through Player -> Inventory -> Weapon -> fields.\nfunc should_flee_train_wreck() -> bool:\n\tvar p = get_tree().root.get_node(\"Main/World/Player\")\n\tvar weapon = p.get_inventory().get_equipped()\n\tvar danger = weapon.base_damage * (1.0 + weapon.upgrade_level * 0.1) * (p.health / p.max_health)\n\treturn danger > courage\n\n# FIX: one dot, to a friend we were given. The damage formula stays the weapon's business.\nfunc should_flee() -> bool:\n\treturn player.threat_level() > courage\n\nfunc _physics_process(delta: float) -> void:\n\tif should_flee():\n\t\tvelocity = (global_position - player.global_position).normalized() * 120.0\n\telse:\n\t\tvelocity = (player.global_position - global_position).normalized() * 80.0\n\tmove_and_slide()\n",
            "demeter-gd-enemy-courage/inventory.gd": "class_name Inventory\nextends Node\n\n# The player's friend. It owns the weapons and knows which one is equipped.\n\nvar weapons: Array[Weapon] = []\nvar equipped: Weapon\n\nfunc get_equipped() -> Weapon:\n\treturn equipped\n\nfunc equipped_damage() -> float:\n\tif equipped == null:\n\t\treturn 1.0\n\treturn equipped.damage_per_hit()\n",
            "demeter-gd-enemy-courage/player.gd": "class_name Player\nextends CharacterBody2D\n\n@onready var inventory: Inventory = $Inventory\nvar health := 100.0\nvar max_health := 100.0\n\n# The leak that makes train wrecks possible.\nfunc get_inventory() -> Inventory:\n\treturn inventory\n\n# The fix: the player answers the question enemies actually have.\n# It asks only its own friend (the inventory), which asks only its friend (the weapon).\nfunc threat_level() -> float:\n\treturn inventory.equipped_damage() * (health / max_health)\n\nfunc take_damage(amount: float) -> void:\n\thealth = max(0.0, health - amount)\n",
            "demeter-gd-enemy-courage/weapon.gd": "class_name Weapon\nextends Resource\n\n# Deep inside the player. Enemies should not even know this class exists.\n\n@export var base_damage := 10.0\n@export var upgrade_level := 0\n\nfunc damage_per_hit() -> float:\n\treturn base_damage * (1.0 + upgrade_level * 0.1)\n"
          }
        },
        {
          "id": "demeter-php-checkout",
          "title": "VAT at checkout, and when chains are fine",
          "lang": "PHP",
          "level": "advanced",
          "source": null,
          "story": "A controller computes VAT through four getters, then the polite way through Order::vat(). A QueryBuilder chain shows that fluent interfaces returning $this do not break the law.",
          "roles": {
            "Client": [
              "demeter-php-checkout/CheckoutController.php#CheckoutController"
            ],
            "Friend": [
              "demeter-php-checkout/Order.php#Order"
            ],
            "Stranger": [
              "demeter-php-checkout/Address.php#Address",
              "demeter-php-checkout/Country.php#Country"
            ],
            "Train Wreck": [
              "demeter-php-checkout/CheckoutController.php#CheckoutController.vatTrainWreck"
            ],
            "Delegating Method": [
              "demeter-php-checkout/Order.php#Order.vat",
              "demeter-php-checkout/Customer.php#Customer.vatRate",
              "demeter-php-checkout/Address.php#Address.vatRate"
            ]
          },
          "trace": [
            {
              "at": "demeter-php-checkout/CheckoutController.php#CheckoutController.vatTrainWreck",
              "say": "Four getters in a row: the controller now depends on Order, Customer, Address and Country and on how they connect."
            },
            {
              "at": "demeter-php-checkout/Country.php#Country.getVatRate",
              "say": "The data lives three hops away. If VAT ever depends on more than the country, every such chain must change."
            },
            {
              "at": "demeter-php-checkout/CheckoutController.php#CheckoutController.vat",
              "say": "The fix: tell the order what you need. The controller knows one class, its parameter."
            },
            {
              "at": "demeter-php-checkout/Order.php#Order.vat",
              "say": "Order owns the calculation and asks only its own field, the customer, for a rate."
            },
            {
              "at": "demeter-php-checkout/Customer.php#Customer.vatRate",
              "say": "Customer forwards to its billing address: one hop, no peeking further."
            },
            {
              "at": "demeter-php-checkout/Address.php#Address.vatRate",
              "say": "Address asks its country. Each hop is short, and each class can change its insides freely."
            },
            {
              "at": "demeter-php-checkout/CheckoutController.php#CheckoutController.recentOrdersSql",
              "say": "Many arrows, zero violations: every call in the chain returns the same QueryBuilder, a friend."
            }
          ],
          "files": {
            "demeter-php-checkout/Address.php": "<?php\n\nrequire_once __DIR__ . '/Country.php';\n\nfinal class Address {\n    private string $street;\n    private Country $country;\n\n    public function __construct(string $street, Country $country) {\n        $this->street = $street;\n        $this->country = $country;\n    }\n\n    public function getCountry(): Country {\n        return $this->country;\n    }\n\n    // Demeter-friendly: Address talks to its own field and answers the question.\n    public function vatRate(): float {\n        return $this->country->getVatRate();\n    }\n}\n",
            "demeter-php-checkout/CheckoutController.php": "<?php\n\nrequire_once __DIR__ . '/Order.php';\nrequire_once __DIR__ . '/QueryBuilder.php';\n\nfinal class CheckoutController {\n    private QueryBuilder $query;\n\n    public function __construct(QueryBuilder $query) {\n        $this->query = $query;\n    }\n\n    // VIOLATION: the controller knows the shape of four classes to compute one number.\n    // A change to Address or Country (say, EU reverse charge) ripples up into every controller.\n    public function vatTrainWreck(Order $order): float {\n        $rate = $order->getCustomer()->getBillingAddress()->getCountry()->getVatRate();\n        return round($order->getNet() * $rate, 2);\n    }\n\n    // FIX: tell the order what you need. One dot, to a parameter (a friend).\n    public function vat(Order $order): float {\n        return $order->vat();\n    }\n\n    // Chained, but fine: every call goes to the same QueryBuilder.\n    public function recentOrdersSql(): string {\n        return $this->query->select('*')->from('orders')->where('email = :email')->toSql();\n    }\n\n    public function show(Order $order): void {\n        echo 'Net: ', $order->getNet(), ' VAT: ', $this->vat($order), \"\\n\";\n        echo $this->recentOrdersSql(), \"\\n\";\n    }\n}\n\n$germany = new Country('DE', 0.19);\n$order = new Order(new Customer('ana@example.com', new Address('Hauptstr. 1', $germany)), 100.0);\n(new CheckoutController(new QueryBuilder()))->show($order);\n",
            "demeter-php-checkout/Country.php": "<?php\n\nfinal class Country {\n    private string $code;\n    private float $vatRate;\n\n    public function __construct(string $code, float $vatRate) {\n        $this->code = $code;\n        $this->vatRate = $vatRate;\n    }\n\n    public function getVatRate(): float {\n        return $this->vatRate;\n    }\n}\n",
            "demeter-php-checkout/Customer.php": "<?php\n\nrequire_once __DIR__ . '/Address.php';\n\nfinal class Customer {\n    private string $email;\n    private Address $billingAddress;\n\n    public function __construct(string $email, Address $billingAddress) {\n        $this->email = $email;\n        $this->billingAddress = $billingAddress;\n    }\n\n    public function getBillingAddress(): Address {\n        return $this->billingAddress;\n    }\n\n    public function vatRate(): float {\n        return $this->billingAddress->vatRate();\n    }\n}\n",
            "demeter-php-checkout/Order.php": "<?php\n\nrequire_once __DIR__ . '/Customer.php';\n\nfinal class Order {\n    private Customer $customer;\n    private float $net;\n\n    public function __construct(Customer $customer, float $net) {\n        $this->customer = $customer;\n        $this->net = $net;\n    }\n\n    public function getCustomer(): Customer {\n        return $this->customer;\n    }\n\n    public function getNet(): float {\n        return $this->net;\n    }\n\n    // Each object asks only its direct neighbour. If tax later depends on shipping address\n    // or on the product type, only Order changes; the controller never notices.\n    public function vat(): float {\n        return round($this->net * $this->customer->vatRate(), 2);\n    }\n}\n",
            "demeter-php-checkout/QueryBuilder.php": "<?php\n\n// NOT a violation: a fluent interface returns $this, so every call in\n// $qb->select(...)->where(...)->orderBy(...) talks to the same object, a friend.\nfinal class QueryBuilder {\n    private array $parts = [];\n\n    public function select(string $columns): self {\n        $this->parts[] = 'SELECT ' . $columns;\n        return $this;\n    }\n\n    public function from(string $table): self {\n        $this->parts[] = 'FROM ' . $table;\n        return $this;\n    }\n\n    public function where(string $condition): self {\n        $this->parts[] = 'WHERE ' . $condition;\n        return $this;\n    }\n\n    public function toSql(): string {\n        return implode(' ', $this->parts);\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "coupling-cohesion",
      "name": "Coupling, Cohesion and Separation of Concerns",
      "family": "Principles",
      "aka": [
        "Low coupling, high cohesion",
        "Separation of concerns",
        "SoC"
      ],
      "tagline": "Keep related code together and unrelated code apart, joined by thin, explicit seams.",
      "intent": "Cohesion measures how well the code inside one module belongs together; coupling measures how much modules depend on each other's details. Aim for high cohesion and low coupling by separating concerns (data access, logic, presentation, delivery) into their own modules that talk through small interfaces, so each part can change, be tested and be reused on its own.",
      "analogy": "A restaurant kitchen has stations: grill, salads, desserts. Each station keeps its own tools together (cohesion), and they hand plates through one pass window (a thin seam) instead of reaching into each other's fridges (coupling).",
      "cityShape": "In before/ look for one tall building with many unrelated floors and pipes shooting out to infrastructure in every direction. In after/ the same floors are spread over several short buildings, each with similar floors, and only a few pipes cross between them, mostly from one small glue building (main, Checkout, TodoPanel).",
      "roles": [
        {
          "name": "Tangled Module",
          "desc": "In before/: one unit that mixes several concerns and wires itself to concrete details (paths, servers, globals, the DOM)."
        },
        {
          "name": "Cohesive Module",
          "desc": "In after/: a unit with one concern; everything inside changes for the same reason."
        },
        {
          "name": "Seam",
          "desc": "The thin, explicit connection between modules: an interface, a function parameter or a callback."
        },
        {
          "name": "Composition Root",
          "desc": "The small piece of glue that picks concrete parts and plugs them together; the only place that knows them all."
        }
      ],
      "whenToUse": [
        "You cannot test a calculation without a database, a file or a network connection.",
        "One file changes for many unrelated reasons (new report format, new mail server, new CSV column).",
        "A change in one module regularly forces edits in modules that seem unrelated.",
        "A Godot script handles input, physics, UI, audio and saving all at once."
      ],
      "pitfalls": [
        "Splitting too finely creates many tiny modules that are all coupled to each other anyway; group by reason to change, not by line count.",
        "Interfaces everywhere are not loose coupling by themselves; a fat interface that exposes every detail couples just as tightly.",
        "Hidden coupling through globals, shared mutable state or event names is still coupling, just harder to see."
      ],
      "related": [
        "single-responsibility",
        "dependency-inversion",
        "law-of-demeter",
        "dependency-injection",
        "mvc",
        "god-object",
        "hexagonal"
      ],
      "quiz": [
        {
          "q": "Which change most directly raises cohesion?",
          "options": [
            "Moving the email-sending code out of the class that calculates sales totals",
            "Adding an interface for every class",
            "Putting all helpers into one utils.py",
            "Making every field public"
          ],
          "answer": 0,
          "why": "Cohesion is about keeping only related things together. Sending mail and summing sales change for different reasons, so separating them makes each module more focused. A shared utils file does the opposite."
        },
        {
          "q": "OrderService now takes an IOrderStore instead of creating a SqlConnection. What got better?",
          "options": [
            "Orders are saved faster",
            "OrderService is coupled only to a one-method interface, so it can be tested with an in-memory store and run on any database",
            "The SQL is now shorter",
            "Nothing, it is just more code"
          ],
          "answer": 1,
          "why": "Depending on a narrow seam instead of concrete infrastructure lowers coupling; the composition root chooses the real implementation."
        }
      ],
      "demos": [
        {
          "id": "coupling-py-sales-report",
          "title": "A weekly sales report script",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "before/ reads a CSV, sums sales, formats text and emails it in one function. after/ splits the four concerns into small modules joined by plain data, and main passes in how to send.",
          "roles": {
            "Tangled Module": [
              "coupling-py-sales-report/before/report.py#weekly_report"
            ],
            "Cohesive Module": [
              "coupling-py-sales-report/after/sales_data.py",
              "coupling-py-sales-report/after/sales_stats.py",
              "coupling-py-sales-report/after/report_text.py"
            ],
            "Seam": [
              "coupling-py-sales-report/after/sales_stats.py#totals_by_region"
            ],
            "Composition Root": [
              "coupling-py-sales-report/after/main.py#run_weekly_report"
            ]
          },
          "trace": [
            {
              "at": "coupling-py-sales-report/before/report.py#weekly_report",
              "say": "One function: hard-coded path, CSV column numbers, math, formatting and an SMTP server. Four reasons to change, zero parts to reuse."
            },
            {
              "at": "coupling-py-sales-report/after/main.py#run_weekly_report",
              "say": "after/: the job reads as three steps. The way to send is a parameter, so tests can pass a list's append."
            },
            {
              "at": "coupling-py-sales-report/after/sales_data.py#load_sales",
              "say": "Only this module knows the CSV layout. A new column changes one line here, nowhere else."
            },
            {
              "at": "coupling-py-sales-report/after/sales_stats.py#totals_by_region",
              "say": "The math takes and returns plain data. The seam between modules is just a list of tuples."
            },
            {
              "at": "coupling-py-sales-report/after/report_text.py#format_report",
              "say": "Presentation is its own concern; an HTML version would be a sibling function, the math untouched."
            }
          ],
          "files": {
            "coupling-py-sales-report/after/main.py": "# AFTER: the composition root. The only place that knows how the pieces fit together,\n# and the only place with real paths and a real way to deliver the report.\nfrom .sales_data import load_sales\nfrom .sales_stats import totals_by_region\nfrom .report_text import format_report\n\n\ndef run_weekly_report(path, send):\n    sales = load_sales(path)\n    totals = totals_by_region(sales)\n    send(format_report(totals))\n\n\nif __name__ == \"__main__\":\n    run_weekly_report(\"/var/data/sales.csv\", send=print)\n",
            "coupling-py-sales-report/after/report_text.py": "# AFTER: concern 3, presentation. Swap it for an HTML version without touching the math.\n\n\ndef format_report(totals):\n    lines = [\"Weekly sales\"]\n    for region, amount in sorted(totals.items()):\n        lines.append(f\"{region:<10}{amount:>10.2f}\")\n    return \"\\n\".join(lines)\n",
            "coupling-py-sales-report/after/sales_data.py": "# AFTER: concern 1, getting data. Knows the CSV layout and nothing else.\nimport csv\n\n\ndef load_sales(path):\n    with open(path) as f:\n        return [(row[2], float(row[4])) for row in csv.reader(f)]\n",
            "coupling-py-sales-report/after/sales_stats.py": "# AFTER: concern 2, the math. Pure functions on plain data: trivial to test, no files, no network.\n\n\ndef totals_by_region(sales):\n    totals = {}\n    for region, amount in sales:\n        totals[region] = totals.get(region, 0) + amount\n    return totals\n",
            "coupling-py-sales-report/before/main.py": "from .report import weekly_report\n\n# To test the math you need a real CSV at /var/data and a running mail server.\nif __name__ == \"__main__\":\n    weekly_report()\n",
            "coupling-py-sales-report/before/report.py": "# BEFORE: one function mixes four concerns: reading files, doing math, formatting, sending.\n# Low cohesion (unrelated jobs in one place) and high coupling (hard-wired to a file path,\n# a CSV layout, a mail server and a global), so none of it can be reused or tested alone.\nimport csv\nimport smtplib\n\nSMTP_HOST = \"mail.example.com\"\nlast_totals = {}\n\n\ndef weekly_report():\n    totals = {}\n    with open(\"/var/data/sales.csv\") as f:\n        for row in csv.reader(f):\n            region, amount = row[2], float(row[4])\n            totals[region] = totals.get(region, 0) + amount\n    last_totals.update(totals)  # another module reads this global... sometimes\n\n    lines = [\"Weekly sales\"]\n    for region, amount in sorted(totals.items()):\n        lines.append(f\"{region:<10}{amount:>10.2f}\")\n    body = \"\\n\".join(lines)\n\n    with smtplib.SMTP(SMTP_HOST) as server:\n        server.sendmail(\"bot@example.com\", [\"boss@example.com\"], body)\n"
          }
        },
        {
          "id": "coupling-cs-orders",
          "title": "Placing an order in a shop backend",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "before/ OrderManager inserts SQL, sends SMTP mail, renders invoices and runs reports. after/ OrderService only places orders through two small interfaces, and adapters at the edge do the I/O.",
          "roles": {
            "Tangled Module": [
              "coupling-cs-orders/before/OrderManager.cs#OrderManager"
            ],
            "Cohesive Module": [
              "coupling-cs-orders/after/OrderService.cs#OrderService",
              "coupling-cs-orders/after/Adapters.cs#EmailNotifier",
              "coupling-cs-orders/after/Adapters.cs#InvoiceText"
            ],
            "Seam": [
              "coupling-cs-orders/after/Ports.cs#IOrderStore",
              "coupling-cs-orders/after/Ports.cs#INotifier"
            ],
            "Composition Root": [
              "coupling-cs-orders/after/Checkout.cs#Checkout.Run"
            ]
          },
          "trace": [
            {
              "at": "coupling-cs-orders/before/OrderManager.cs#OrderManager.PlaceOrder",
              "say": "Placing an order opens a production SQL connection and an SMTP client itself. Testing it means touching real servers."
            },
            {
              "at": "coupling-cs-orders/before/OrderManager.cs#OrderManager.MonthlyRevenueReport",
              "say": "Reporting has nothing to do with placing orders, yet lives here too: low cohesion."
            },
            {
              "at": "coupling-cs-orders/after/Checkout.cs#Checkout.Run",
              "say": "after/: the composition root picks concrete parts and hands them to the service."
            },
            {
              "at": "coupling-cs-orders/after/OrderService.cs#OrderService.PlaceOrder",
              "say": "Validate, save, notify, all through interfaces. Every line is about placing an order."
            },
            {
              "at": "coupling-cs-orders/after/Adapters.cs#InMemoryOrderStore.Save",
              "say": "Behind the IOrderStore seam: today a list for tests, tomorrow SQL, and OrderService never changes."
            },
            {
              "at": "coupling-cs-orders/after/Adapters.cs#EmailNotifier.OrderPlaced",
              "say": "Mail details live at the edge, and the invoice text is its own small class."
            },
            {
              "at": "coupling-cs-orders/after/Adapters.cs#InvoiceText.Render",
              "say": "A PDF invoice later means a new renderer, not another method on a growing manager."
            }
          ],
          "files": {
            "coupling-cs-orders/Order.cs": "// Shared by both versions: plain order data.\npublic record Order(int Id, string CustomerEmail, decimal Total);\n",
            "coupling-cs-orders/after/Adapters.cs": "// AFTER: infrastructure lives at the edges, each class with one job.\nusing System.Collections.Generic;\nusing System.Net.Mail;\n\npublic class InvoiceText\n{\n    public string Render(Order order)\n    {\n        return $\"Invoice #{order.Id}\\nTotal: {order.Total:C}\\n\";\n    }\n}\n\npublic class EmailNotifier : INotifier\n{\n    private readonly SmtpClient _smtp;\n    private readonly InvoiceText _invoice;\n\n    public EmailNotifier(SmtpClient smtp, InvoiceText invoice)\n    {\n        _smtp = smtp;\n        _invoice = invoice;\n    }\n\n    public void OrderPlaced(Order order)\n    {\n        _smtp.Send(\"shop@example.com\", order.CustomerEmail, \"Thanks!\", _invoice.Render(order));\n    }\n}\n\n// A test double is now a five-line class instead of a test database.\npublic class InMemoryOrderStore : IOrderStore\n{\n    public List<Order> Saved { get; } = new();\n\n    public void Save(Order order)\n    {\n        Saved.Add(order);\n    }\n}\n",
            "coupling-cs-orders/after/Checkout.cs": "// AFTER: the composition root decides which concrete pieces plug into the seams.\nusing System.Net.Mail;\n\npublic static class Checkout\n{\n    public static void Run()\n    {\n        var store = new InMemoryOrderStore();\n        var notifier = new EmailNotifier(new SmtpClient(\"smtp.example.com\"), new InvoiceText());\n        var service = new OrderService(store, notifier);\n        service.PlaceOrder(new Order(42, \"ana@example.com\", 19.99m));\n    }\n}\n",
            "coupling-cs-orders/after/OrderService.cs": "// AFTER: high cohesion. Everything in here is about the act of placing an order.\npublic class OrderService\n{\n    private readonly IOrderStore _store;\n    private readonly INotifier _notifier;\n\n    public OrderService(IOrderStore store, INotifier notifier)\n    {\n        _store = store;\n        _notifier = notifier;\n    }\n\n    public void PlaceOrder(Order order)\n    {\n        if (order.Total <= 0)\n        {\n            throw new System.ArgumentException(\"Order total must be positive\");\n        }\n        _store.Save(order);\n        _notifier.OrderPlaced(order);\n    }\n}\n",
            "coupling-cs-orders/after/Ports.cs": "// AFTER: narrow seams. The order logic depends on these two small interfaces,\n// not on SQL Server or SMTP. Fewer, thinner connections = loose coupling.\npublic interface IOrderStore\n{\n    void Save(Order order);\n}\n\npublic interface INotifier\n{\n    void OrderPlaced(Order order);\n}\n",
            "coupling-cs-orders/before/OrderManager.cs": "// BEFORE: a class that places orders, talks SQL, sends mail and renders invoices.\n// Low cohesion: four reasons to change. High coupling: it news up concrete infrastructure,\n// so you cannot place an order in a test without a database and a mail server.\nusing System.Data.SqlClient;\nusing System.Net.Mail;\nusing System.Text;\n\npublic class OrderManager\n{\n    private const string ConnectionString = \"Server=prod-db;Database=shop;\";\n\n    public void PlaceOrder(Order order)\n    {\n        using var db = new SqlConnection(ConnectionString);\n        db.Open();\n        var cmd = new SqlCommand(\"INSERT INTO Orders (Id, Email, Total) VALUES (@id, @e, @t)\", db);\n        cmd.Parameters.AddWithValue(\"@id\", order.Id);\n        cmd.Parameters.AddWithValue(\"@e\", order.CustomerEmail);\n        cmd.Parameters.AddWithValue(\"@t\", order.Total);\n        cmd.ExecuteNonQuery();\n\n        var smtp = new SmtpClient(\"smtp.example.com\");\n        smtp.Send(\"shop@example.com\", order.CustomerEmail, \"Thanks!\", RenderInvoice(order));\n    }\n\n    public string RenderInvoice(Order order)\n    {\n        var sb = new StringBuilder();\n        sb.AppendLine($\"Invoice #{order.Id}\");\n        sb.AppendLine($\"Total: {order.Total:C}\");\n        return sb.ToString();\n    }\n\n    public decimal MonthlyRevenueReport()\n    {\n        using var db = new SqlConnection(ConnectionString);\n        db.Open();\n        return (decimal)new SqlCommand(\"SELECT SUM(Total) FROM Orders\", db).ExecuteScalar();\n    }\n}\n"
          }
        },
        {
          "id": "coupling-ts-todo-ui",
          "title": "A todo widget: fetch, state and view",
          "lang": "TypeScript",
          "level": "advanced",
          "source": null,
          "story": "before/ TodoWidget fetches, mutates, persists, tracks analytics and writes innerHTML in one class. after/ separates API, store and view; the panel wires them with callbacks and a subscription.",
          "roles": {
            "Tangled Module": [
              "coupling-ts-todo-ui/before/TodoWidget.ts#TodoWidget"
            ],
            "Cohesive Module": [
              "coupling-ts-todo-ui/after/todoApi.ts#TodoApi",
              "coupling-ts-todo-ui/after/todoStore.ts#TodoStore",
              "coupling-ts-todo-ui/after/todoView.ts#renderTodoList"
            ],
            "Seam": [
              "coupling-ts-todo-ui/after/todoStore.ts#TodoStore.subscribe"
            ],
            "Composition Root": [
              "coupling-ts-todo-ui/after/todoPanel.ts#TodoPanel"
            ]
          },
          "trace": [
            {
              "at": "coupling-ts-todo-ui/before/TodoWidget.ts#TodoWidget.toggle",
              "say": "One click mutates state, calls the API, writes localStorage, pings a global analytics object and re-renders."
            },
            {
              "at": "coupling-ts-todo-ui/before/TodoWidget.ts#TodoWidget.render",
              "say": "Rendering wires clicks straight back to toggle(): view and logic call each other in a loop."
            },
            {
              "at": "coupling-ts-todo-ui/after/todoPanel.ts#TodoPanel.start",
              "say": "after/: the panel loads from the API and hands the list to the store. It is the only file that imports all three parts."
            },
            {
              "at": "coupling-ts-todo-ui/after/todoStore.ts#TodoStore.replaceAll",
              "say": "The store owns the state and emits. It knows nothing of HTTP or the DOM, so it tests with plain arrays."
            },
            {
              "at": "coupling-ts-todo-ui/after/todoView.ts#renderTodoList",
              "say": "The view turns data into DOM and reports clicks through a callback. textContent also fixes the innerHTML injection risk."
            },
            {
              "at": "coupling-ts-todo-ui/after/todoPanel.ts#TodoPanel.onToggle",
              "say": "The glue translates a click into a store change plus an API call. Policies live here, not in the view."
            },
            {
              "at": "coupling-ts-todo-ui/after/todoApi.ts#TodoApi.setDone",
              "say": "URLs and verbs have one home. Switching to GraphQL changes this class only."
            }
          ],
          "files": {
            "coupling-ts-todo-ui/after/todoApi.ts": "import { Todo } from '../types';\n\n// AFTER, concern 1: talking to the server. The only file that knows URLs and HTTP verbs.\nexport class TodoApi {\n  constructor(private baseUrl: string) {}\n\n  async list(): Promise<Todo[]> {\n    const res = await fetch(`${this.baseUrl}/todos`);\n    return res.json();\n  }\n\n  async setDone(id: number, done: boolean): Promise<void> {\n    await fetch(`${this.baseUrl}/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ done }) });\n  }\n}\n",
            "coupling-ts-todo-ui/after/todoPanel.ts": "import { TodoApi } from './todoApi';\nimport { TodoStore } from './todoStore';\nimport { renderTodoList } from './todoView';\n\n// AFTER: the glue. It is the only module that knows all three, and it is short.\nexport class TodoPanel {\n  private store = new TodoStore();\n\n  constructor(private root: HTMLElement, private api: TodoApi) {\n    this.store.subscribe(todos => renderTodoList(this.root, todos, id => this.onToggle(id)));\n  }\n\n  async start(): Promise<void> {\n    this.store.replaceAll(await this.api.list());\n  }\n\n  async onToggle(id: number): Promise<void> {\n    const todo = this.store.toggle(id);\n    await this.api.setDone(id, todo.done);\n  }\n}\n",
            "coupling-ts-todo-ui/after/todoStore.ts": "import { Todo } from '../types';\n\n// AFTER, concern 2: state. Holds the list, changes it, and tells subscribers.\n// It knows nothing about HTTP or the DOM, so it can be tested with plain arrays.\ntype Listener = (todos: readonly Todo[]) => void;\n\nexport class TodoStore {\n  private todos: Todo[] = [];\n  private listeners: Listener[] = [];\n\n  subscribe(listener: Listener): void {\n    this.listeners.push(listener);\n  }\n\n  replaceAll(todos: Todo[]): void {\n    this.todos = todos;\n    this.emit();\n  }\n\n  toggle(id: number): Todo {\n    this.todos = this.todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));\n    this.emit();\n    return this.todos.find(t => t.id === id)!;\n  }\n\n  private emit(): void {\n    for (const listener of this.listeners) {\n      listener(this.todos);\n    }\n  }\n}\n",
            "coupling-ts-todo-ui/after/todoView.ts": "import { Todo } from '../types';\n\n// AFTER, concern 3: drawing. A function from data to DOM; clicks are reported through a callback,\n// so the view does not know what toggling means.\nexport function renderTodoList(root: HTMLElement, todos: readonly Todo[], onToggle: (id: number) => void): void {\n  root.innerHTML = '';\n  for (const t of todos) {\n    const li = document.createElement('li');\n    li.textContent = t.title;\n    li.className = t.done ? 'done' : '';\n    li.addEventListener('click', () => onToggle(t.id));\n    root.appendChild(li);\n  }\n}\n",
            "coupling-ts-todo-ui/before/TodoWidget.ts": "import { Todo } from '../types';\n\n// BEFORE: one class fetches, caches, mutates, persists and renders.\n// Every concern reaches into every other: rendering knows the URL, toggling knows the DOM,\n// and the analytics global couples it to code it should not know about.\ndeclare const window: any;\n\nexport class TodoWidget {\n  private todos: Todo[] = [];\n\n  constructor(private root: HTMLElement) {}\n\n  async load(): Promise<void> {\n    const res = await fetch('https://api.example.com/todos');\n    this.todos = await res.json();\n    localStorage.setItem('todos', JSON.stringify(this.todos));\n    this.render();\n  }\n\n  async toggle(id: number): Promise<void> {\n    const todo = this.todos.find(t => t.id === id)!;\n    todo.done = !todo.done;\n    await fetch(`https://api.example.com/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ done: todo.done }) });\n    localStorage.setItem('todos', JSON.stringify(this.todos));\n    window.analytics.track('todo_toggled', { id });\n    this.render();\n  }\n\n  render(): void {\n    this.root.innerHTML = this.todos\n      .map(t => `<li data-id=\"${t.id}\" class=\"${t.done ? 'done' : ''}\">${t.title}</li>`)\n      .join('');\n    this.root.querySelectorAll('li').forEach(li => {\n      li.addEventListener('click', () => this.toggle(Number(li.getAttribute('data-id'))));\n    });\n  }\n}\n",
            "coupling-ts-todo-ui/types.ts": "// Shared by both versions.\nexport interface Todo {\n  id: number;\n  title: string;\n  done: boolean;\n}\n"
          }
        }
      ]
    }
  ]
};
