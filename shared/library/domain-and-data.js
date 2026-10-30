// Family: Domain & Data. 6 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Domain & Data"
  ],
  "patterns": [
    {
      "id": "value-object",
      "name": "Value Object",
      "family": "Domain & Data",
      "aka": [
        "Value type",
        "Immutable value"
      ],
      "tagline": "A small immutable object defined by its values, not by an id.",
      "intent": "Model concepts like Money, Email or Coordinates as small immutable objects that validate themselves when created and compare equal when their contents are equal. Operations return new values instead of changing the old one, so a value can be shared freely and never ends up half-valid. Contrast with an entity, which keeps an identity while its data changes.",
      "analogy": "Two 5-euro notes: you do not care which one you get back, only that it is worth 5 euros. Your bank account is different: it has a number, and it stays your account even when the balance changes.",
      "cityShape": "Value-object buildings are short and self-contained: a constructor or factory floor at the bottom, then small floors like add, plus or equals with few outgoing pipes, sitting in their own values district. Entity buildings nearby have an equals floor that only reads the id, plus mutator floors (rename, moveTo) whose data pipes write into their own fields.",
      "roles": [
        {
          "name": "Value Object",
          "desc": "Immutable type with no id. Validates in its constructor or factory, so every instance is valid."
        },
        {
          "name": "Equality by Value",
          "desc": "equals/hashCode that compare all components; two instances with the same contents are interchangeable."
        },
        {
          "name": "Entity",
          "desc": "The contrast: an object with an identity (id) that stays the same while its fields change."
        },
        {
          "name": "Client",
          "desc": "Code that creates values, combines them and uses them as fields of entities."
        }
      ],
      "whenToUse": [
        "A primitive (string, number) carries rules: an email must be valid, money needs a currency, a latitude has a range.",
        "You want to compare or use something as a map key by its contents (coordinates, date ranges, addresses).",
        "Several fields always travel together (amount + currency, street + city + zip).",
        "You want to share an object between threads or entities without defensive copies."
      ],
      "pitfalls": [
        "Adding setters or mutable collections breaks the promise: a value used as a map key that later changes is lost in the map.",
        "Giving a value object an id (or storing it in its own table with a primary key) quietly turns it into an entity.",
        "Forgetting hashCode when overriding equals (or comparing floats exactly) gives subtle bugs in sets and caches."
      ],
      "related": [
        "primitive-obsession",
        "aggregate",
        "dto",
        "encapsulation",
        "flyweight"
      ],
      "quiz": [
        {
          "q": "Two Money objects both hold 10.00 EUR but were created separately. What should money1.equals(money2) return?",
          "options": [
            "false, they are different objects in memory",
            "true, their contents are equal",
            "It depends on which was created first",
            "It throws, values cannot be compared"
          ],
          "answer": 1,
          "why": "A value object has no identity of its own. Equal contents mean equal values, so the two are interchangeable."
        },
        {
          "q": "A courier moves across town. Why is Courier an entity while Coordinates is a value object?",
          "options": [
            "Courier has more fields",
            "The courier keeps its identity while its location changes; a coordinate is fully described by its numbers",
            "Coordinates are stored in a database",
            "Entities must be immutable"
          ],
          "answer": 1,
          "why": "Entities are tracked by id through change. A different location is simply a different Coordinates value assigned to the same courier."
        }
      ],
      "demos": [
        {
          "id": "value-object-ts-money",
          "title": "Money and a customer",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Money validates its currency, adds by returning a new Money and compares by amount and currency. Customer is the contrast: it compares by id, so renaming keeps it the same customer.",
          "roles": {
            "Value Object": [
              "value-object-ts-money/money.ts#Money"
            ],
            "Equality by Value": [
              "value-object-ts-money/money.ts#Money.equals"
            ],
            "Entity": [
              "value-object-ts-money/customer.ts#Customer"
            ],
            "Client": [
              "value-object-ts-money/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "value-object-ts-money/main.ts#main",
              "say": "main() creates two coffees worth 3.50 EUR as separate objects, then asks whether they are equal."
            },
            {
              "at": "value-object-ts-money/money.ts#Money.fromAmount",
              "say": "The factory is the only way in. It rejects bad input once, so every Money that exists is valid."
            },
            {
              "at": "value-object-ts-money/money.ts#Money.equals",
              "say": "equals() compares cents and currency, not memory addresses. Same contents means same value."
            },
            {
              "at": "value-object-ts-money/money.ts#Money.add",
              "say": "add() returns a brand-new Money. The original coffee price is untouched, so nobody sharing it gets surprised."
            },
            {
              "at": "value-object-ts-money/customer.ts#Customer.equals",
              "say": "Customer is an entity: two customers named Ana are different because their ids differ."
            },
            {
              "at": "value-object-ts-money/customer.ts#Customer.rename",
              "say": "Entities change in place. After rename() it is still customer c-1; only its data moved on."
            },
            {
              "at": "value-object-ts-money/customer.ts#Customer.deposit",
              "say": "The entity holds a Money and replaces it with a new value on every deposit, instead of mutating it."
            }
          ],
          "files": {
            "value-object-ts-money/customer.ts": "import { Money } from './money';\n\n// An entity: it has an id that stays the same while its data changes.\n// Two customers called \"Ana\" are still two different people.\nexport class Customer {\n  private balance: Money;\n\n  constructor(readonly id: string, public name: string) {\n    this.balance = Money.fromAmount(0, 'EUR');\n  }\n\n  rename(newName: string): void {\n    this.name = newName;\n  }\n\n  deposit(amount: Money): void {\n    this.balance = this.balance.add(amount);\n  }\n\n  getBalance(): Money {\n    return this.balance;\n  }\n\n  equals(other: Customer): boolean {\n    return this.id === other.id;\n  }\n}\n",
            "value-object-ts-money/main.ts": "import { Money } from './money';\nimport { Customer } from './customer';\n\nexport function main(): void {\n  const coffee = Money.fromAmount(3.5, 'EUR');\n  const sameCoffee = Money.fromAmount(3.5, 'EUR');\n  console.log('equal values?', coffee.equals(sameCoffee)); // true: same amount, same currency\n\n  const total = coffee.add(Money.fromAmount(1.2, 'EUR'));\n  console.log(coffee.toString(), '+ 1.20 EUR =', total.toString()); // coffee itself is unchanged\n\n  const ana = new Customer('c-1', 'Ana');\n  const otherAna = new Customer('c-2', 'Ana');\n  console.log('same customer?', ana.equals(otherAna)); // false: different ids\n\n  ana.rename('Ana Maria');\n  ana.deposit(total);\n  console.log(ana.name, 'has', ana.getBalance().toString()); // still customer c-1\n}\n\nmain();\n",
            "value-object-ts-money/money.ts": "// A value object: no id, cannot change, two Money values with the same\n// amount and currency are interchangeable, like two 5-euro notes.\nexport class Money {\n  private constructor(readonly cents: number, readonly currency: string) {\n    Object.freeze(this);\n  }\n\n  static fromAmount(amount: number, currency: string): Money {\n    if (!Number.isFinite(amount)) {\n      throw new Error('Amount must be a number');\n    }\n    if (!/^[A-Z]{3}$/.test(currency)) {\n      throw new Error('Currency must be a 3-letter code like EUR');\n    }\n    return new Money(Math.round(amount * 100), currency);\n  }\n\n  add(other: Money): Money {\n    if (other.currency !== this.currency) {\n      throw new Error('Cannot add ' + other.currency + ' to ' + this.currency);\n    }\n    return new Money(this.cents + other.cents, this.currency);\n  }\n\n  equals(other: Money): boolean {\n    return this.cents === other.cents && this.currency === other.currency;\n  }\n\n  toString(): string {\n    return (this.cents / 100).toFixed(2) + ' ' + this.currency;\n  }\n}\n"
          }
        },
        {
          "id": "value-object-kt-delivery",
          "title": "Food delivery: Email, Coordinates, Money",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "Kotlin makes value objects cheap: data classes give Coordinates and Money equality for free, while Email spells out equals and hashCode by hand. The pricing service works only with values, while Courier is an entity whose location keeps changing.",
          "roles": {
            "Value Object": [
              "value-object-kt-delivery/values/Email.kt#Email",
              "value-object-kt-delivery/values/Coordinates.kt#Coordinates",
              "value-object-kt-delivery/values/Money.kt#Money"
            ],
            "Equality by Value": [
              "value-object-kt-delivery/values/Email.kt#Email.equals",
              "value-object-kt-delivery/values/Email.kt#Email.hashCode",
              "value-object-kt-delivery/values/Coordinates.kt#Coordinates"
            ],
            "Entity": [
              "value-object-kt-delivery/couriers/Courier.kt#Courier"
            ],
            "Client": [
              "value-object-kt-delivery/pricing/QuoteService.kt#QuoteService",
              "value-object-kt-delivery/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "value-object-kt-delivery/Main.kt#main",
              "say": "main() compares two Coordinates built separately. data class equality says they are the same place."
            },
            {
              "at": "value-object-kt-delivery/values/Email.kt#Email.parse",
              "say": "Email.parse trims and lower-cases before validating, so ' Sam@Example.COM ' and 'sam@example.com' become equal values."
            },
            {
              "at": "value-object-kt-delivery/pricing/QuoteService.kt#QuoteService.quote",
              "say": "The quote is pure value arithmetic: distance, fees and a rush factor. No ids, no state, trivial to unit test."
            },
            {
              "at": "value-object-kt-delivery/values/Coordinates.kt#Coordinates.distanceKm",
              "say": "Behaviour lives on the value itself. Distance belongs to coordinates, not to some helper class."
            },
            {
              "at": "value-object-kt-delivery/values/Money.kt#Money.plus",
              "say": "plus() refuses mixed currencies and returns a new Money. The rule sits in one place instead of in every caller."
            },
            {
              "at": "value-object-kt-delivery/values/Money.kt#Money.times",
              "say": "times() uses copy(): Kotlin's way to say 'the same value, but with this field different', as a new object."
            },
            {
              "at": "value-object-kt-delivery/couriers/Courier.kt#Courier.moveTo",
              "say": "The courier is an entity: moveTo() swaps in a new Coordinates value but the courier keeps its id."
            },
            {
              "at": "value-object-kt-delivery/couriers/Courier.kt#Courier.equals",
              "say": "Courier equality looks at the id only, so the courier at two locations is still one courier."
            }
          ],
          "files": {
            "value-object-kt-delivery/Main.kt": "import delivery.couriers.Courier\nimport delivery.pricing.QuoteService\nimport delivery.values.Coordinates\nimport delivery.values.Email\nimport delivery.values.Money\n\nfun main() {\n    val restaurant = Coordinates(48.3705, 10.8978)\n    val customer = Coordinates(48.3550, 10.8850)\n\n    // Values compare by content, so a cache or a set treats these as one key.\n    println(restaurant == Coordinates(48.3705, 10.8978))\n    println(Email.parse(\"  Sam@Example.COM \") == Email.parse(\"sam@example.com\"))\n\n    val quotes = QuoteService(baseFee = Money(250, \"EUR\"), perKm = Money(90, \"EUR\"))\n    println(\"Quote: \" + quotes.quote(restaurant, customer, rush = false))\n\n    // The courier is an entity: it moves, yet stays the same courier.\n    val courier = Courier(\"courier-7\", Email.parse(\"kim@fastbites.io\"), restaurant)\n    val sameCourierLater = Courier(\"courier-7\", Email.parse(\"kim@fastbites.io\"), customer)\n    courier.moveTo(customer)\n    println(courier == sameCourierLater)\n}\n",
            "value-object-kt-delivery/couriers/Courier.kt": "package delivery.couriers\n\nimport delivery.values.Coordinates\nimport delivery.values.Email\n\n// An entity: identified by id. Its location changes all the time,\n// but it is still the same courier. Equality looks only at the id.\nclass Courier(val id: String, var email: Email, var location: Coordinates) {\n\n    fun moveTo(newLocation: Coordinates) {\n        location = newLocation\n    }\n\n    fun changeEmail(newEmail: Email) {\n        email = newEmail\n    }\n\n    override fun equals(other: Any?): Boolean {\n        return other is Courier && other.id == id\n    }\n\n    override fun hashCode(): Int {\n        return id.hashCode()\n    }\n}\n",
            "value-object-kt-delivery/pricing/QuoteService.kt": "package delivery.pricing\n\nimport delivery.values.Coordinates\nimport delivery.values.Money\n\n// Works purely with values: no ids, no database, easy to test.\nclass QuoteService(private val baseFee: Money, private val perKm: Money) {\n\n    fun quote(pickup: Coordinates, dropoff: Coordinates, rush: Boolean): Money {\n        val km = pickup.distanceKm(dropoff)\n        val distanceFee = perKm.times(km)\n        val total = baseFee + distanceFee\n        return if (rush) total.times(1.5) else total\n    }\n}\n",
            "value-object-kt-delivery/values/Coordinates.kt": "package delivery.values\n\nimport kotlin.math.atan2\nimport kotlin.math.cos\nimport kotlin.math.sin\nimport kotlin.math.sqrt\n\n// A data class gets equals, hashCode and copy() for free: two Coordinates\n// with the same lat/lng are equal. All fields are val, so it never changes.\ndata class Coordinates(val lat: Double, val lng: Double) {\n    init {\n        require(lat in -90.0..90.0) { \"Latitude out of range: $lat\" }\n        require(lng in -180.0..180.0) { \"Longitude out of range: $lng\" }\n    }\n\n    fun distanceKm(other: Coordinates): Double {\n        val dLat = Math.toRadians(other.lat - lat)\n        val dLng = Math.toRadians(other.lng - lng)\n        val a = sin(dLat / 2) * sin(dLat / 2) +\n            cos(Math.toRadians(lat)) * cos(Math.toRadians(other.lat)) * sin(dLng / 2) * sin(dLng / 2)\n        return 6371.0 * 2 * atan2(sqrt(a), sqrt(1 - a))\n    }\n}\n",
            "value-object-kt-delivery/values/Email.kt": "package delivery.values\n\n// Wraps one String but gives it a meaning and a rule. After parse()\n// it is always a valid, lower-case address. Equality compares the text.\nclass Email private constructor(val value: String) {\n    companion object {\n        private val PATTERN = Regex(\"^[^@\\\\s]+@[^@\\\\s]+\\\\.[a-z]{2,}$\")\n\n        fun parse(raw: String): Email {\n            val cleaned = raw.trim().lowercase()\n            require(PATTERN.matches(cleaned)) { \"Not an email address: $raw\" }\n            return Email(cleaned)\n        }\n    }\n\n    fun domain(): String {\n        return value.substringAfter('@')\n    }\n\n    override fun equals(other: Any?): Boolean {\n        return other is Email && other.value == value\n    }\n\n    override fun hashCode(): Int {\n        return value.hashCode()\n    }\n\n    override fun toString(): String {\n        return value\n    }\n}\n",
            "value-object-kt-delivery/values/Money.kt": "package delivery.values\n\n// Money in cents plus a currency. Operations return a new Money.\ndata class Money(val cents: Long, val currency: String) {\n    init {\n        require(cents >= 0) { \"Money cannot be negative\" }\n        require(currency.length == 3) { \"Use a 3-letter currency code\" }\n    }\n\n    operator fun plus(other: Money): Money {\n        require(other.currency == currency) { \"Currency mismatch\" }\n        return Money(cents + other.cents, currency)\n    }\n\n    fun times(factor: Double): Money {\n        return copy(cents = Math.round(cents * factor))\n    }\n\n    override fun toString(): String {\n        return \"%.2f %s\".format(cents / 100.0, currency)\n    }\n}\n"
          }
        },
        {
          "id": "value-object-eshop-real",
          "title": "eShop: Address and the ValueObject base class",
          "lang": "C#",
          "level": "intermediate",
          "source": {
            "repo": "dotnet/eShop",
            "url": "https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/SeedWork/ValueObject.cs",
            "license": "MIT",
            "note": "ValueObject.cs, Address.cs and Entity.cs are from Microsoft's eShop reference app at commit dc7ea49 (Entity.cs trimmed, marked). AddressExample.cs was written for Software City."
          },
          "story": "Microsoft's reference shop gives every value object one base class: subclasses only list their equality components. Compare Entity.Equals next door, which looks only at Id.",
          "roles": {
            "Value Object": [
              "value-object-eshop-real/OrderAggregate/Address.cs#Address",
              "value-object-eshop-real/SeedWork/ValueObject.cs#ValueObject"
            ],
            "Equality by Value": [
              "value-object-eshop-real/SeedWork/ValueObject.cs#ValueObject.Equals",
              "value-object-eshop-real/SeedWork/ValueObject.cs#ValueObject.GetHashCode"
            ],
            "Entity": [
              "value-object-eshop-real/SeedWork/Entity.cs#Entity"
            ],
            "Client": [
              "value-object-eshop-real/AddressExample.cs#AddressExample.Run"
            ]
          },
          "trace": [
            {
              "at": "value-object-eshop-real/AddressExample.cs#AddressExample.Run",
              "say": "Run() builds three Addresses. The constructor sets every field at once and the setters are private, so none can be edited later."
            },
            {
              "at": "value-object-eshop-real/SeedWork/ValueObject.cs#ValueObject.Equals",
              "say": "The base class compares two sequences of components. Same type plus same components means equal."
            },
            {
              "at": "value-object-eshop-real/OrderAggregate/Address.cs#Address.GetEqualityComponents",
              "say": "Address only says which fields matter, with yield return. Adding a field later means adding one line here."
            },
            {
              "at": "value-object-eshop-real/SeedWork/ValueObject.cs#ValueObject.GetHashCode",
              "say": "The hash is built from the same components, so equal addresses land in the same dictionary bucket."
            },
            {
              "at": "value-object-eshop-real/SeedWork/Entity.cs#Entity.Equals",
              "say": "Contrast: Entity.Equals ignores the data and compares Id. Unsaved (transient) entities are never equal."
            }
          ],
          "files": {
            "value-object-eshop-real/AddressExample.cs": "// Example usage written for Software City (not part of eShop).\nusing eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\nnamespace eShop.Examples;\n\npublic class AddressExample\n{\n    public static void Run()\n    {\n        var shipTo = new Address(\"1 Main St\", \"Springfield\", \"IL\", \"USA\", \"62701\");\n        var sameText = new Address(\"1 Main St\", \"Springfield\", \"IL\", \"USA\", \"62701\");\n        var other = new Address(\"9 Oak Ave\", \"Springfield\", \"IL\", \"USA\", \"62704\");\n\n        // Two separate objects, but equal because every component matches.\n        Console.WriteLine(shipTo.Equals(sameText));\n        Console.WriteLine(shipTo.GetHashCode() == sameText.GetHashCode());\n        Console.WriteLine(shipTo.Equals(other));\n\n        // No setters are public: to \"change\" an address you build a new one.\n        var copy = shipTo.GetCopy();\n        Console.WriteLine(copy.Equals(shipTo));\n    }\n}\n",
            "value-object-eshop-real/OrderAggregate/Address.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/AggregatesModel/OrderAggregate/Address.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nusing eShop.Ordering.Domain.SeedWork;\n\nnamespace eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\npublic class Address : ValueObject\n{\n    public string Street { get; private set; }\n    public string City { get; private set; }\n    public string State { get; private set; }\n    public string Country { get; private set; }\n    public string ZipCode { get; private set; }\n\n    public Address() { }\n\n    public Address(string street, string city, string state, string country, string zipcode)\n    {\n        Street = street;\n        City = city;\n        State = state;\n        Country = country;\n        ZipCode = zipcode;\n    }\n\n    protected override IEnumerable<object> GetEqualityComponents()\n    {\n        // Using a yield return statement to return each element one at a time\n        yield return Street;\n        yield return City;\n        yield return State;\n        yield return Country;\n        yield return ZipCode;\n    }\n}\n",
            "value-object-eshop-real/SeedWork/Entity.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/SeedWork/Entity.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.Domain.Seedwork;\n\npublic abstract class Entity\n{\n    int? _requestedHashCode;\n    int _Id;\n    public virtual int Id\n    {\n        get\n        {\n            return _Id;\n        }\n        protected set\n        {\n            _Id = value;\n        }\n    }\n\n    // … trimmed: 18 lines of domain-event bookkeeping (AddDomainEvent, ClearDomainEvents), shown in the domain-events pattern …\n\n    public bool IsTransient()\n    {\n        return this.Id == default;\n    }\n\n    public override bool Equals(object obj)\n    {\n        if (obj == null || !(obj is Entity))\n            return false;\n\n        if (Object.ReferenceEquals(this, obj))\n            return true;\n\n        if (this.GetType() != obj.GetType())\n            return false;\n\n        Entity item = (Entity)obj;\n\n        if (item.IsTransient() || this.IsTransient())\n            return false;\n        else\n            return item.Id == this.Id;\n    }\n\n    public override int GetHashCode()\n    {\n        if (!IsTransient())\n        {\n            if (!_requestedHashCode.HasValue)\n                _requestedHashCode = this.Id.GetHashCode() ^ 31; // XOR for random distribution (http://blogs.msdn.com/b/ericlippert/archive/2011/02/28/guidelines-and-rules-for-gethashcode.aspx)\n\n            return _requestedHashCode.Value;\n        }\n        else\n            return base.GetHashCode();\n\n    }\n    public static bool operator ==(Entity left, Entity right)\n    {\n        if (Object.Equals(left, null))\n            return (Object.Equals(right, null)) ? true : false;\n        else\n            return left.Equals(right);\n    }\n\n    public static bool operator !=(Entity left, Entity right)\n    {\n        return !(left == right);\n    }\n}\n",
            "value-object-eshop-real/SeedWork/ValueObject.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/SeedWork/ValueObject.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.Domain.SeedWork;\n\npublic abstract class ValueObject\n{\n    protected static bool EqualOperator(ValueObject left, ValueObject right)\n    {\n        if (ReferenceEquals(left, null) ^ ReferenceEquals(right, null))\n        {\n            return false;\n        }\n        return ReferenceEquals(left, null) || left.Equals(right);\n    }\n\n    protected static bool NotEqualOperator(ValueObject left, ValueObject right)\n    {\n        return !(EqualOperator(left, right));\n    }\n\n    protected abstract IEnumerable<object> GetEqualityComponents();\n\n    public override bool Equals(object obj)\n    {\n        if (obj == null || obj.GetType() != GetType())\n        {\n            return false;\n        }\n\n        var other = (ValueObject)obj;\n\n        return this.GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());\n    }\n\n    public override int GetHashCode()\n    {\n        return GetEqualityComponents()\n            .Select(x => x != null ? x.GetHashCode() : 0)\n            .Aggregate((x, y) => x ^ y);\n    }\n\n    public ValueObject GetCopy()\n    {\n        return this.MemberwiseClone() as ValueObject;\n    }\n}\n"
          }
        }
      ]
    },
    {
      "id": "aggregate",
      "name": "Aggregate",
      "family": "Domain & Data",
      "aka": [
        "Aggregate root",
        "Consistency boundary"
      ],
      "tagline": "A cluster of objects changed only through one root that guards the rules.",
      "intent": "Group objects that must stay consistent together (an order and its lines, a screening and its seats) and expose only one of them, the aggregate root. Outside code calls the root's methods; the root checks the business rules (invariants) before touching its inner entities, and the whole cluster is loaded and saved as one unit.",
      "analogy": "A restaurant kitchen: guests never walk in and grab plates. They order through the waiter, who checks the order makes sense (no dessert before it is paid for, no dish that is sold out) before the kitchen changes anything.",
      "cityShape": "The root is the tallest building in the district, with public floors (add_item, Reserve, AddOrderItem) whose call pipes run down into the short buildings of the inner entities (increase, assign, AddUnits). No pipe from main or the repository reaches those inner floors directly: every route passes through the root first.",
      "roles": [
        {
          "name": "Aggregate Root",
          "desc": "The one entity outsiders may hold. Its methods enforce the invariants of the whole cluster."
        },
        {
          "name": "Inner Entity",
          "desc": "Entities inside the boundary (order lines, seats). Changed only by the root, never fetched or saved on their own."
        },
        {
          "name": "Invariant Check",
          "desc": "The guard code inside the root: rules that must hold after every change (no double booking, no edits after submit)."
        },
        {
          "name": "Repository",
          "desc": "Loads and saves the whole aggregate at once; there is one per root, none for inner entities."
        },
        {
          "name": "Client",
          "desc": "Application code that loads a root, calls its methods and saves it back."
        }
      ],
      "whenToUse": [
        "Several objects share a rule that must never be broken, even briefly (seat sold once, order total within a limit).",
        "You want one obvious place to look for the rules instead of checks scattered over services and controllers.",
        "Concurrent users edit the same data and you need a clear unit for locking or versioning."
      ],
      "pitfalls": [
        "Huge aggregates (a Customer holding every order ever) are slow to load and cause constant locking conflicts; keep them small and refer to other aggregates by id.",
        "Exposing the inner list (a public, mutable lines array) lets callers bypass the root and its rules.",
        "Changing two aggregates in one transaction couples them; prefer domain events and eventual consistency between aggregates."
      ],
      "related": [
        "value-object",
        "domain-events",
        "repository",
        "unit-of-work",
        "encapsulation",
        "law-of-demeter"
      ],
      "quiz": [
        {
          "q": "Code outside the aggregate wants to change the quantity of one order line. What should it call?",
          "options": [
            "line.quantity = 5 on a line it fetched from an OrderLineRepository",
            "A method on the Order root, which finds the line and checks the rules",
            "The database directly with an UPDATE",
            "A static helper on OrderLine"
          ],
          "answer": 1,
          "why": "Inner entities change only through the root, so the root can verify invariants such as 'no edits after submit' every time."
        },
        {
          "q": "Why does Screening.Reserve check all seats before assigning any?",
          "options": [
            "It is faster",
            "So a failed booking leaves the aggregate unchanged and consistent",
            "Go requires it",
            "So the repository can skip saving"
          ],
          "answer": 1,
          "why": "An aggregate method should either apply the whole change or none of it. Checking first avoids half-booked states."
        }
      ],
      "demos": [
        {
          "id": "aggregate-py-order",
          "title": "Order with order lines",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Order is the root; OrderLine lives inside it. Every change goes through Order, which merges duplicate products, caps the number of lines and locks itself after submit. The repository stores whole orders only.",
          "roles": {
            "Aggregate Root": [
              "aggregate-py-order/order.py#Order"
            ],
            "Inner Entity": [
              "aggregate-py-order/order_line.py#OrderLine"
            ],
            "Invariant Check": [
              "aggregate-py-order/order.py#Order._ensure_open",
              "aggregate-py-order/order.py#Order.add_item"
            ],
            "Repository": [
              "aggregate-py-order/order_repository.py#OrderRepository"
            ],
            "Client": [
              "aggregate-py-order/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "aggregate-py-order/main.py#main",
              "say": "main() talks only to Order: it never creates or edits an OrderLine itself."
            },
            {
              "at": "aggregate-py-order/order.py#Order.add_item",
              "say": "add_item checks the rules first: order still open, positive quantity, at most five products."
            },
            {
              "at": "aggregate-py-order/order.py#Order._find_line",
              "say": "Adding a notebook twice must not create two lines, so the root looks for an existing line."
            },
            {
              "at": "aggregate-py-order/order_line.py#OrderLine.increase",
              "say": "Only the root calls increase(). The line has no rules of its own to protect the order as a whole."
            },
            {
              "at": "aggregate-py-order/order_repository.py#OrderRepository.save",
              "say": "The repository saves the whole order, lines included. There is no separate place to save a line."
            },
            {
              "at": "aggregate-py-order/order.py#Order.submit",
              "say": "submit() refuses empty orders, then locks the aggregate."
            },
            {
              "at": "aggregate-py-order/order.py#Order._ensure_open",
              "say": "After submit, every changing method hits this guard, so the eraser is refused."
            }
          ],
          "files": {
            "aggregate-py-order/main.py": "from .order import Order, OrderError\nfrom .order_repository import OrderRepository\n\n\ndef main():\n    repo = OrderRepository()\n    order = Order(\"A-100\", \"Mia\")\n    order.add_item(\"notebook\", 4.50, 2)\n    order.add_item(\"pen\", 1.20)\n    order.add_item(\"notebook\", 4.50)  # merges into the existing line\n    repo.save(order)\n\n    loaded = repo.get(\"A-100\")\n    loaded.submit()\n    repo.save(loaded)\n    print(\"Total:\", loaded.total())\n\n    try:\n        loaded.add_item(\"eraser\", 0.80)\n    except OrderError as err:\n        print(\"Refused:\", err)\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "aggregate-py-order/order.py": "from .order_line import OrderLine\n\nMAX_LINES = 5\n\n\nclass OrderError(Exception):\n    pass\n\n\n# The aggregate root. Every change to the order or its lines goes through\n# these methods, so the rules below are checked in exactly one place.\nclass Order:\n    def __init__(self, order_id, customer):\n        self.order_id = order_id\n        self.customer = customer\n        self.lines: list[OrderLine] = []\n        self.submitted = False\n\n    def add_item(self, product, unit_price, quantity=1):\n        self._ensure_open()\n        if quantity <= 0:\n            raise OrderError(\"Quantity must be positive\")\n        existing = self._find_line(product)\n        if existing:\n            existing.increase(quantity)\n            return\n        if len(self.lines) >= MAX_LINES:\n            raise OrderError(\"An order can have at most %d different products\" % MAX_LINES)\n        self.lines.append(OrderLine(product, unit_price, quantity))\n\n    def remove_item(self, product):\n        self._ensure_open()\n        self.lines = [line for line in self.lines if line.product != product]\n\n    def total(self):\n        return sum(line.subtotal() for line in self.lines)\n\n    def submit(self):\n        self._ensure_open()\n        if not self.lines:\n            raise OrderError(\"Cannot submit an empty order\")\n        self.submitted = True\n\n    def _find_line(self, product):\n        for line in self.lines:\n            if line.product == product:\n                return line\n        return None\n\n    def _ensure_open(self):\n        if self.submitted:\n            raise OrderError(\"Order %s is already submitted\" % self.order_id)\n",
            "aggregate-py-order/order_line.py": "# An entity INSIDE the aggregate. Outside code never holds on to it or\n# changes it directly; it is reached only through its Order.\nclass OrderLine:\n    def __init__(self, product, unit_price, quantity):\n        self.product = product\n        self.unit_price = unit_price\n        self.quantity = quantity\n\n    def increase(self, amount):\n        self.quantity += amount\n\n    def subtotal(self):\n        return self.unit_price * self.quantity\n",
            "aggregate-py-order/order_repository.py": "import copy\n\nfrom .order import Order\n\n\n# Loads and saves the WHOLE aggregate as one unit. There is no\n# OrderLineRepository: lines are never stored or fetched on their own.\nclass OrderRepository:\n    def __init__(self):\n        self._orders: dict[str, Order] = {}\n\n    def save(self, order):\n        self._orders[order.order_id] = copy.deepcopy(order)\n\n    def get(self, order_id):\n        return copy.deepcopy(self._orders[order_id])\n"
          }
        },
        {
          "id": "aggregate-go-booking",
          "title": "Cinema screening and seats",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "A Screening owns its seats and bookings. Reserve validates every seat before changing any, so a seat is never sold twice. The repository saves whole screenings with a version number for optimistic locking.",
          "roles": {
            "Aggregate Root": [
              "aggregate-go-booking/booking/screening.go#Screening"
            ],
            "Inner Entity": [
              "aggregate-go-booking/booking/seat.go#Seat"
            ],
            "Invariant Check": [
              "aggregate-go-booking/booking/screening.go#Screening.Reserve"
            ],
            "Repository": [
              "aggregate-go-booking/booking/repository.go#ScreeningRepository"
            ],
            "Client": [
              "aggregate-go-booking/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "aggregate-go-booking/main.go#main",
              "say": "main loads one screening, tries two overlapping bookings and saves the result."
            },
            {
              "at": "aggregate-go-booking/booking/repository.go#ScreeningRepository.Get",
              "say": "Get hands out a deep copy, so changes stay private until Save accepts them."
            },
            {
              "at": "aggregate-go-booking/booking/screening.go#Screening.Reserve",
              "say": "Reserve checks seat count and every seat first. Only when all rules pass does it touch anything."
            },
            {
              "at": "aggregate-go-booking/booking/seat.go#Seat.IsFree",
              "say": "Seats answer simple questions about themselves, but the cross-seat rule lives in the root."
            },
            {
              "at": "aggregate-go-booking/booking/seat.go#Seat.assign",
              "say": "assign is unexported: only code in the booking package, in practice the Screening, can call it."
            },
            {
              "at": "aggregate-go-booking/booking/repository.go#ScreeningRepository.Save",
              "say": "Save compares versions. If someone else saved first, it refuses: the aggregate is the unit of locking."
            },
            {
              "at": "aggregate-go-booking/booking/screening.go#Screening.Cancel",
              "say": "Cancelling goes through the root too, releasing exactly the seats of that booking."
            }
          ],
          "files": {
            "aggregate-go-booking/booking/repository.go": "package booking\n\nimport (\n\t\"errors\"\n\t\"sync\"\n)\n\nvar ErrConflict = errors.New(\"screening was changed by someone else, reload and retry\")\n\n// ScreeningRepository stores whole aggregates. The version number gives\n// optimistic locking: two clerks cannot both sell the last seat.\ntype ScreeningRepository struct {\n\tmu   sync.Mutex\n\trows map[string]*Screening\n}\n\nfunc NewRepository() *ScreeningRepository {\n\treturn &ScreeningRepository{rows: map[string]*Screening{}}\n}\n\nfunc (r *ScreeningRepository) Get(id string) (*Screening, bool) {\n\tr.mu.Lock()\n\tdefer r.mu.Unlock()\n\ts, ok := r.rows[id]\n\tif !ok {\n\t\treturn nil, false\n\t}\n\treturn s.clone(), true\n}\n\nfunc (r *ScreeningRepository) Save(s *Screening) error {\n\tr.mu.Lock()\n\tdefer r.mu.Unlock()\n\tif current, ok := r.rows[s.ID]; ok && current.Version != s.Version {\n\t\treturn ErrConflict\n\t}\n\ts.Version++\n\tr.rows[s.ID] = s.clone()\n\treturn nil\n}\n",
            "aggregate-go-booking/booking/screening.go": "package booking\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nconst MaxSeatsPerBooking = 6\n\nvar (\n\tErrSeatTaken    = errors.New(\"seat already booked\")\n\tErrTooManySeats = errors.New(\"too many seats in one booking\")\n\tErrUnknownSeat  = errors.New(\"no such seat\")\n)\n\n// Booking is a value: the receipt the root hands back to callers.\ntype Booking struct {\n\tID       string\n\tCustomer string\n\tSeats    []string\n}\n\n// Screening is the aggregate root. It owns its seats and bookings and is\n// the only door through which they change, so \"no seat is sold twice\"\n// can be checked inside one object and saved in one transaction.\ntype Screening struct {\n\tID       string\n\tVersion  int\n\tseats    map[string]*Seat\n\tbookings map[string]Booking\n\tnextID   int\n}\n\nfunc NewScreening(id string, seatIDs []string) *Screening {\n\ts := &Screening{ID: id, seats: map[string]*Seat{}, bookings: map[string]Booking{}}\n\tfor _, sid := range seatIDs {\n\t\ts.seats[sid] = &Seat{ID: sid}\n\t}\n\treturn s\n}\n\nfunc (s *Screening) Reserve(customer string, seatIDs []string) (Booking, error) {\n\tif len(seatIDs) == 0 || len(seatIDs) > MaxSeatsPerBooking {\n\t\treturn Booking{}, ErrTooManySeats\n\t}\n\t// Check every seat first, change nothing until all rules pass.\n\tfor _, sid := range seatIDs {\n\t\tseat, ok := s.seats[sid]\n\t\tif !ok {\n\t\t\treturn Booking{}, fmt.Errorf(\"%w: %s\", ErrUnknownSeat, sid)\n\t\t}\n\t\tif !seat.IsFree() {\n\t\t\treturn Booking{}, fmt.Errorf(\"%w: %s\", ErrSeatTaken, sid)\n\t\t}\n\t}\n\ts.nextID++\n\tb := Booking{ID: fmt.Sprintf(\"%s-%d\", s.ID, s.nextID), Customer: customer, Seats: seatIDs}\n\tfor _, sid := range seatIDs {\n\t\ts.seats[sid].assign(customer, b.ID)\n\t}\n\ts.bookings[b.ID] = b\n\treturn b, nil\n}\n\nfunc (s *Screening) Cancel(bookingID string) error {\n\tb, ok := s.bookings[bookingID]\n\tif !ok {\n\t\treturn errors.New(\"unknown booking\")\n\t}\n\tfor _, sid := range b.Seats {\n\t\ts.seats[sid].release()\n\t}\n\tdelete(s.bookings, bookingID)\n\treturn nil\n}\n\nfunc (s *Screening) FreeSeats() int {\n\tfree := 0\n\tfor _, seat := range s.seats {\n\t\tif seat.IsFree() {\n\t\t\tfree++\n\t\t}\n\t}\n\treturn free\n}\n\n// clone deep-copies the aggregate so a loaded copy can be changed\n// without touching the stored one until Save succeeds.\nfunc (s *Screening) clone() *Screening {\n\tc := &Screening{ID: s.ID, Version: s.Version, nextID: s.nextID,\n\t\tseats: map[string]*Seat{}, bookings: map[string]Booking{}}\n\tfor id, seat := range s.seats {\n\t\tcopied := *seat\n\t\tc.seats[id] = &copied\n\t}\n\tfor id, b := range s.bookings {\n\t\tc.bookings[id] = b\n\t}\n\treturn c\n}\n",
            "aggregate-go-booking/booking/seat.go": "package booking\n\n// Seat is an entity inside the Screening aggregate. Its fields are\n// unexported: other packages can read it but only Screening changes it.\ntype Seat struct {\n\tID      string\n\theldBy  string\n\tbooking string\n}\n\nfunc (s *Seat) IsFree() bool {\n\treturn s.booking == \"\"\n}\n\nfunc (s *Seat) assign(customer, bookingID string) {\n\ts.heldBy = customer\n\ts.booking = bookingID\n}\n\nfunc (s *Seat) release() {\n\ts.heldBy = \"\"\n\ts.booking = \"\"\n}\n",
            "aggregate-go-booking/main.go": "package main\n\nimport (\n\t\"fmt\"\n\n\t\"example.com/cinema/booking\"\n)\n\nfunc main() {\n\trepo := booking.NewRepository()\n\trepo.Save(booking.NewScreening(\"dune-20h\", []string{\"A1\", \"A2\", \"A3\", \"B1\", \"B2\"}))\n\n\tscreening, _ := repo.Get(\"dune-20h\")\n\tfirst, err := screening.Reserve(\"ana\", []string{\"A1\", \"A2\"})\n\tfmt.Println(first.ID, err)\n\n\t_, err = screening.Reserve(\"ben\", []string{\"A2\", \"A3\"})\n\tfmt.Println(\"second booking:\", err) // A2 is taken, so nothing changes\n\n\tif err := repo.Save(screening); err != nil {\n\t\tfmt.Println(err)\n\t}\n\tfmt.Println(\"free seats:\", screening.FreeSeats())\n}\n"
          }
        },
        {
          "id": "aggregate-eshop-real",
          "title": "eShop: the Order aggregate",
          "lang": "C#",
          "level": "advanced",
          "source": {
            "repo": "dotnet/eShop",
            "url": "https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/AggregatesModel/OrderAggregate/Order.cs",
            "license": "MIT",
            "note": "Order.cs, OrderItem.cs, Entity.cs and IAggregateRoot.cs are verbatim from Microsoft's eShop reference app at commit dc7ea49. PlaceOrderExample.cs was written for Software City."
          },
          "story": "Microsoft's reference shop marks Order with IAggregateRoot and keeps its items in a private list. AddOrderItem and the status methods are the only ways in, and they hold the rules.",
          "roles": {
            "Aggregate Root": [
              "aggregate-eshop-real/OrderAggregate/Order.cs#Order",
              "aggregate-eshop-real/SeedWork/IAggregateRoot.cs#IAggregateRoot"
            ],
            "Inner Entity": [
              "aggregate-eshop-real/OrderAggregate/OrderItem.cs#OrderItem"
            ],
            "Invariant Check": [
              "aggregate-eshop-real/OrderAggregate/Order.cs#Order.AddOrderItem",
              "aggregate-eshop-real/OrderAggregate/Order.cs#Order.SetCancelledStatus"
            ],
            "Client": [
              "aggregate-eshop-real/PlaceOrderExample.cs#PlaceOrderExample.Run"
            ]
          },
          "trace": [
            {
              "at": "aggregate-eshop-real/PlaceOrderExample.cs#PlaceOrderExample.Run",
              "say": "The example builds an Order and only ever calls the root's methods."
            },
            {
              "at": "aggregate-eshop-real/OrderAggregate/Order.cs#Order.AddOrderItem",
              "say": "AddOrderItem is the only door into the private _orderItems list. A repeated product merges into its existing line."
            },
            {
              "at": "aggregate-eshop-real/OrderAggregate/OrderItem.cs#OrderItem.SetNewDiscount",
              "say": "The root keeps the higher discount by telling the inner item to change. Callers cannot reach this directly."
            },
            {
              "at": "aggregate-eshop-real/OrderAggregate/OrderItem.cs#OrderItem.AddUnits",
              "say": "AddUnits rejects negative units; the OrderItem constructor rejects a discount above the line total, so the mug fails. Order-wide rules stay in the root."
            },
            {
              "at": "aggregate-eshop-real/OrderAggregate/Order.cs#Order.SetPaidStatus",
              "say": "Status moves only along allowed steps; each transition checks the current status first."
            },
            {
              "at": "aggregate-eshop-real/OrderAggregate/Order.cs#Order.SetCancelledStatus",
              "say": "A paid order cannot be cancelled. The root throws instead of leaving the aggregate in a forbidden state."
            }
          ],
          "files": {
            "aggregate-eshop-real/OrderAggregate/Order.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/AggregatesModel/OrderAggregate/Order.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nusing System.ComponentModel.DataAnnotations;\n\nnamespace eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\npublic class Order\n    : Entity, IAggregateRoot\n{\n    public DateTime OrderDate { get; private set; }\n\n    // Address is a Value Object pattern example persisted as EF Core 2.0 owned entity\n    [Required]\n    public Address Address { get; private set; }\n\n    public int? BuyerId { get; private set; }\n\n    public Buyer Buyer { get; }\n\n    public OrderStatus OrderStatus { get; private set; }\n    \n    public string Description { get; private set; }\n\n    // Draft orders have this set to true. Currently we don't check anywhere the draft status of an Order, but we could do it if needed\n#pragma warning disable CS0414 // The field 'Order._isDraft' is assigned but its value is never used\n    private bool _isDraft;\n#pragma warning restore CS0414\n\n    // DDD Patterns comment\n    // Using a private collection field, better for DDD Aggregate's encapsulation\n    // so OrderItems cannot be added from \"outside the AggregateRoot\" directly to the collection,\n    // but only through the method OrderAggregateRoot.AddOrderItem() which includes behavior.\n    private readonly List<OrderItem> _orderItems;\n   \n    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();\n\n    public int? PaymentId { get; private set; }\n\n    public static Order NewDraft()\n    {\n        var order = new Order\n        {\n            _isDraft = true\n        };\n        return order;\n    }\n\n    protected Order()\n    {\n        _orderItems = new List<OrderItem>();\n        _isDraft = false;\n    }\n\n    public Order(string userId, string userName, Address address, int cardTypeId, string cardNumber, string cardSecurityNumber,\n            string cardHolderName, DateTime cardExpiration, int? buyerId = null, int? paymentMethodId = null) : this()\n    {\n        BuyerId = buyerId;\n        PaymentId = paymentMethodId;\n        OrderStatus = OrderStatus.Submitted;\n        OrderDate = DateTime.UtcNow;\n        Address = address;\n\n        // Add the OrderStarterDomainEvent to the domain events collection \n        // to be raised/dispatched when committing changes into the Database [ After DbContext.SaveChanges() ]\n        AddOrderStartedDomainEvent(userId, userName, cardTypeId, cardNumber,\n                                    cardSecurityNumber, cardHolderName, cardExpiration);\n    }\n\n    // DDD Patterns comment\n    // This Order AggregateRoot's method \"AddOrderItem()\" should be the only way to add Items to the Order,\n    // so any behavior (discounts, etc.) and validations are controlled by the AggregateRoot \n    // in order to maintain consistency between the whole Aggregate. \n    public void AddOrderItem(int productId, string productName, decimal unitPrice, decimal discount, string pictureUrl, int units = 1)\n    {\n        var existingOrderForProduct = _orderItems.SingleOrDefault(o => o.ProductId == productId);\n\n        if (existingOrderForProduct != null)\n        {\n            //if previous line exist modify it with higher discount  and units..\n            if (discount > existingOrderForProduct.Discount)\n            {\n                existingOrderForProduct.SetNewDiscount(discount);\n            }\n\n            existingOrderForProduct.AddUnits(units);\n        }\n        else\n        {\n            //add validated new order item\n            var orderItem = new OrderItem(productId, productName, unitPrice, discount, pictureUrl, units);\n            _orderItems.Add(orderItem);\n        }\n    }\n\n    public void SetPaymentMethodVerified(int buyerId, int paymentId)\n    {\n        BuyerId = buyerId;\n        PaymentId = paymentId;\n    }\n    \n    public void SetAwaitingValidationStatus()\n    {\n        if (OrderStatus == OrderStatus.Submitted)\n        {\n            AddDomainEvent(new OrderStatusChangedToAwaitingValidationDomainEvent(Id, _orderItems));\n            OrderStatus = OrderStatus.AwaitingValidation;\n        }\n    }\n\n    public void SetStockConfirmedStatus()\n    {\n        if (OrderStatus == OrderStatus.AwaitingValidation)\n        {\n            AddDomainEvent(new OrderStatusChangedToStockConfirmedDomainEvent(Id));\n\n            OrderStatus = OrderStatus.StockConfirmed;\n            Description = \"All the items were confirmed with available stock.\";\n        }\n    }\n\n    public void SetPaidStatus()\n    {\n        if (OrderStatus == OrderStatus.StockConfirmed)\n        {\n            AddDomainEvent(new OrderStatusChangedToPaidDomainEvent(Id, OrderItems));\n\n            OrderStatus = OrderStatus.Paid;\n            Description = \"The payment was performed at a simulated \\\"American Bank checking bank account ending on XX35071\\\"\";\n        }\n    }\n\n    public void SetShippedStatus()\n    {\n        if (OrderStatus != OrderStatus.Paid)\n        {\n            StatusChangeException(OrderStatus.Shipped);\n        }\n\n        OrderStatus = OrderStatus.Shipped;\n        Description = \"The order was shipped.\";\n        AddDomainEvent(new OrderShippedDomainEvent(this));\n    }\n\n    public void SetCancelledStatus()\n    {\n        if (OrderStatus == OrderStatus.Paid ||\n            OrderStatus == OrderStatus.Shipped)\n        {\n            StatusChangeException(OrderStatus.Cancelled);\n        }\n\n        OrderStatus = OrderStatus.Cancelled;\n        Description = \"The order was cancelled.\";\n        AddDomainEvent(new OrderCancelledDomainEvent(this));\n    }\n\n    public void SetCancelledStatusWhenStockIsRejected(IEnumerable<int> orderStockRejectedItems)\n    {\n        if (OrderStatus == OrderStatus.AwaitingValidation)\n        {\n            OrderStatus = OrderStatus.Cancelled;\n\n            var itemsStockRejectedProductNames = OrderItems\n                .Where(c => orderStockRejectedItems.Contains(c.ProductId))\n                .Select(c => c.ProductName);\n\n            var itemsStockRejectedDescription = string.Join(\", \", itemsStockRejectedProductNames);\n            Description = $\"The product items don't have stock: ({itemsStockRejectedDescription}).\";\n        }\n    }\n\n    private void AddOrderStartedDomainEvent(string userId, string userName, int cardTypeId, string cardNumber,\n            string cardSecurityNumber, string cardHolderName, DateTime cardExpiration)\n    {\n        var orderStartedDomainEvent = new OrderStartedDomainEvent(this, userId, userName, cardTypeId,\n                                                                    cardNumber, cardSecurityNumber,\n                                                                    cardHolderName, cardExpiration);\n\n        this.AddDomainEvent(orderStartedDomainEvent);\n    }\n\n    private void StatusChangeException(OrderStatus orderStatusToChange)\n    {\n        throw new OrderingDomainException($\"Is not possible to change the order status from {OrderStatus} to {orderStatusToChange}.\");\n    }\n\n    public decimal GetTotal() => _orderItems.Sum(o => o.Units * o.UnitPrice);\n}\n",
            "aggregate-eshop-real/OrderAggregate/OrderItem.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/AggregatesModel/OrderAggregate/OrderItem.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nusing System.ComponentModel.DataAnnotations;\n\nnamespace eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\npublic class OrderItem\n    : Entity\n{\n    [Required]\n    public string ProductName { get; private set; }\n    \n    public string PictureUrl { get; private set;}\n    \n    public decimal UnitPrice { get; private set;}\n    \n    public decimal Discount { get; private set; }\n    \n    public int Units { get; private set; }\n\n    public int ProductId { get; private set; }\n\n    protected OrderItem() { }\n\n    public OrderItem(int productId, string productName, decimal unitPrice, decimal discount, string pictureUrl, int units = 1)\n    {\n        if (units <= 0)\n        {\n            throw new OrderingDomainException(\"Invalid number of units\");\n        }\n\n        if ((unitPrice * units) < discount)\n        {\n            throw new OrderingDomainException(\"The total of order item is lower than applied discount\");\n        }\n\n        ProductId = productId;\n\n        ProductName = productName;\n        UnitPrice = unitPrice;\n        Discount = discount;\n        Units = units;\n        PictureUrl = pictureUrl;\n    }\n    \n    public void SetNewDiscount(decimal discount)\n    {\n        if (discount < 0)\n        {\n            throw new OrderingDomainException(\"Discount is not valid\");\n        }\n\n        Discount = discount;\n    }\n\n    public void AddUnits(int units)\n    {\n        if (units < 0)\n        {\n            throw new OrderingDomainException(\"Invalid units\");\n        }\n\n        Units += units;\n    }\n}\n",
            "aggregate-eshop-real/PlaceOrderExample.cs": "// Example usage written for Software City (not part of eShop).\nusing eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\nnamespace eShop.Examples;\n\npublic class PlaceOrderExample\n{\n    public static void Run()\n    {\n        var address = new Address(\"1 Main St\", \"Springfield\", \"IL\", \"USA\", \"62701\");\n        var order = new Order(\"user-1\", \"Alice\", address, cardTypeId: 1, cardNumber: \"4012888888881881\",\n            cardSecurityNumber: \"123\", cardHolderName: \"Alice\", cardExpiration: DateTime.UtcNow.AddYears(2));\n\n        // All changes go through the root. The same product twice becomes one line with more units.\n        order.AddOrderItem(productId: 7, productName: \".NET Hoodie\", unitPrice: 40m, discount: 0m, pictureUrl: \"\", units: 1);\n        order.AddOrderItem(productId: 7, productName: \".NET Hoodie\", unitPrice: 40m, discount: 5m, pictureUrl: \"\", units: 2);\n        Console.WriteLine($\"{order.OrderItems.Count} line, total {order.GetTotal()}\");\n\n        // order.OrderItems is read-only: callers cannot Add() to it and skip the rules.\n        try\n        {\n            order.AddOrderItem(productId: 9, productName: \"Mug\", unitPrice: 5m, discount: 50m, pictureUrl: \"\");\n        }\n        catch (OrderingDomainException ex)\n        {\n            Console.WriteLine(\"Rejected: \" + ex.Message);\n        }\n\n        // Status changes are guarded by the root too.\n        order.SetAwaitingValidationStatus();\n        order.SetStockConfirmedStatus();\n        order.SetPaidStatus();\n        try\n        {\n            order.SetCancelledStatus();\n        }\n        catch (OrderingDomainException ex)\n        {\n            Console.WriteLine(\"Rejected: \" + ex.Message);\n        }\n    }\n}\n",
            "aggregate-eshop-real/SeedWork/Entity.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/SeedWork/Entity.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.Domain.Seedwork;\n\npublic abstract class Entity\n{\n    int? _requestedHashCode;\n    int _Id;\n    public virtual int Id\n    {\n        get\n        {\n            return _Id;\n        }\n        protected set\n        {\n            _Id = value;\n        }\n    }\n\n    private List<INotification> _domainEvents;\n    public IReadOnlyCollection<INotification> DomainEvents => _domainEvents?.AsReadOnly();\n\n    public void AddDomainEvent(INotification eventItem)\n    {\n        _domainEvents = _domainEvents ?? new List<INotification>();\n        _domainEvents.Add(eventItem);\n    }\n\n    public void RemoveDomainEvent(INotification eventItem)\n    {\n        _domainEvents?.Remove(eventItem);\n    }\n\n    public void ClearDomainEvents()\n    {\n        _domainEvents?.Clear();\n    }\n\n    public bool IsTransient()\n    {\n        return this.Id == default;\n    }\n\n    public override bool Equals(object obj)\n    {\n        if (obj == null || !(obj is Entity))\n            return false;\n\n        if (Object.ReferenceEquals(this, obj))\n            return true;\n\n        if (this.GetType() != obj.GetType())\n            return false;\n\n        Entity item = (Entity)obj;\n\n        if (item.IsTransient() || this.IsTransient())\n            return false;\n        else\n            return item.Id == this.Id;\n    }\n\n    public override int GetHashCode()\n    {\n        if (!IsTransient())\n        {\n            if (!_requestedHashCode.HasValue)\n                _requestedHashCode = this.Id.GetHashCode() ^ 31; // XOR for random distribution (http://blogs.msdn.com/b/ericlippert/archive/2011/02/28/guidelines-and-rules-for-gethashcode.aspx)\n\n            return _requestedHashCode.Value;\n        }\n        else\n            return base.GetHashCode();\n\n    }\n    public static bool operator ==(Entity left, Entity right)\n    {\n        if (Object.Equals(left, null))\n            return (Object.Equals(right, null)) ? true : false;\n        else\n            return left.Equals(right);\n    }\n\n    public static bool operator !=(Entity left, Entity right)\n    {\n        return !(left == right);\n    }\n}\n",
            "aggregate-eshop-real/SeedWork/IAggregateRoot.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/SeedWork/IAggregateRoot.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.Domain.Seedwork;\n\npublic interface IAggregateRoot { }\n"
          }
        }
      ]
    },
    {
      "id": "domain-events",
      "name": "Domain Events",
      "family": "Domain & Data",
      "aka": [
        "Domain event",
        "Business event"
      ],
      "tagline": "Aggregates record facts that happened; other parts of the system react to them.",
      "intent": "When something meaningful happens in the domain (a book was returned, a plan was upgraded), the aggregate records an immutable event named in the past tense instead of calling other modules itself. After the change is saved, a dispatcher hands each event to its handlers, so fees, emails and invoices can be added without touching the aggregate.",
      "analogy": "A shop till prints a receipt line for every sale. The till does not restock shelves or update the accounts; the stock clerk and the accountant read the receipts later and do their own jobs.",
      "cityShape": "The aggregate building has a small recordThat/AddDomainEvent floor whose data pipe writes into its own events antenna. A separate dispatcher building has a dispatch floor that reads those events and fans out call pipes to handler buildings in another district. Notice there is no pipe from the aggregate to the handlers.",
      "roles": [
        {
          "name": "Event Source",
          "desc": "The aggregate that changes state and records an event describing what happened."
        },
        {
          "name": "Domain Event",
          "desc": "An immutable, past-tense fact (BookReturned, PlanUpgraded) carrying the data handlers need."
        },
        {
          "name": "Dispatcher",
          "desc": "Collects recorded events after the change is saved and delivers them to registered handlers."
        },
        {
          "name": "Handler",
          "desc": "Reacts to one kind of event in its own module: charge a fee, send an email, update another aggregate."
        }
      ],
      "whenToUse": [
        "One business action has side effects owned by other modules (billing, notifications, analytics).",
        "You want aggregates to stay focused on their own rules instead of calling services.",
        "A change in one aggregate should update another without both being changed in the same method.",
        "You may later move reactions to a message queue or another service."
      ],
      "pitfalls": [
        "Publishing before the database commit lets handlers react to changes that are then rolled back; dispatch after saving (or inside the same transaction on purpose).",
        "Events named like commands (SendEmail) or carrying whole mutable entities blur what actually happened.",
        "Long chains of handlers raising more events are hard to follow and debug; keep chains short and log them."
      ],
      "related": [
        "observer",
        "pub-sub",
        "aggregate",
        "event-sourcing",
        "unit-of-work",
        "mediator"
      ],
      "quiz": [
        {
          "q": "Which name fits a domain event best?",
          "options": [
            "SendCancellationEmail",
            "SubscriptionCancelled",
            "CancelSubscriptionHandler",
            "SubscriptionManager"
          ],
          "answer": 1,
          "why": "Events state a fact that already happened, in the past tense. Sending the email is one possible reaction to it."
        },
        {
          "q": "Why does the service publish the events only after saving the aggregate?",
          "options": [
            "Events are too big to keep in memory",
            "So handlers never act on a change that failed to save",
            "PHP requires it",
            "To make the aggregate immutable"
          ],
          "answer": 1,
          "why": "If the save fails, nothing happened. Publishing afterwards keeps side effects like invoices consistent with stored data."
        }
      ],
      "demos": [
        {
          "id": "domain-events-ts-library",
          "title": "Library: a book was returned",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A Loan records a BookReturned event when the book comes back. A dispatcher hands it to two handlers: late fees and the waitlist. Notice loan.ts imports neither handler.",
          "roles": {
            "Event Source": [
              "domain-events-ts-library/loan.ts#Loan"
            ],
            "Domain Event": [
              "domain-events-ts-library/events.ts#BookReturned",
              "domain-events-ts-library/events.ts#DomainEvent"
            ],
            "Dispatcher": [
              "domain-events-ts-library/dispatcher.ts#EventDispatcher"
            ],
            "Handler": [
              "domain-events-ts-library/handlers.ts#chargeLateFee",
              "domain-events-ts-library/handlers.ts#notifyWaitlist"
            ]
          },
          "trace": [
            {
              "at": "domain-events-ts-library/main.ts#main",
              "say": "main() registers two handlers for 'BookReturned', then returns a book three days late."
            },
            {
              "at": "domain-events-ts-library/dispatcher.ts#EventDispatcher.on",
              "say": "on() files each handler under an event name. The dispatcher knows names, not business rules."
            },
            {
              "at": "domain-events-ts-library/loan.ts#Loan.returnBook",
              "say": "returnBook() applies its own rule, then records a BookReturned fact. It calls no fee or email code."
            },
            {
              "at": "domain-events-ts-library/loan.ts#Loan.pullEvents",
              "say": "pullEvents() hands over the recorded events and empties the list, so each fact is published once."
            },
            {
              "at": "domain-events-ts-library/dispatcher.ts#EventDispatcher.dispatch",
              "say": "dispatch() loops over events and calls every matching handler."
            },
            {
              "at": "domain-events-ts-library/handlers.ts#chargeLateFee",
              "say": "The fee handler reads daysLate from the event and charges 1.50 EUR. The fee policy lives here, not in Loan."
            },
            {
              "at": "domain-events-ts-library/handlers.ts#notifyWaitlist",
              "say": "A second, unrelated reaction to the same fact. Adding a third would not change loan.ts at all."
            }
          ],
          "files": {
            "domain-events-ts-library/dispatcher.ts": "import { DomainEvent } from './events';\n\nexport type Handler = (event: DomainEvent) => void;\n\n// Delivers each event to every handler registered for its name.\nexport class EventDispatcher {\n  private handlers = new Map<string, Handler[]>();\n\n  on(eventName: string, handler: Handler): void {\n    const list = this.handlers.get(eventName) ?? [];\n    list.push(handler);\n    this.handlers.set(eventName, list);\n  }\n\n  dispatch(events: DomainEvent[]): void {\n    for (const event of events) {\n      for (const handler of this.handlers.get(event.name) ?? []) {\n        handler(event);\n      }\n    }\n  }\n}\n",
            "domain-events-ts-library/events.ts": "// A domain event is a fact, named in the past tense. It is immutable:\n// once a book was returned, that cannot \"un-happen\".\nexport interface DomainEvent {\n  readonly name: string;\n  readonly occurredAt: Date;\n}\n\nexport class BookReturned implements DomainEvent {\n  readonly name = 'BookReturned';\n  readonly occurredAt = new Date();\n\n  constructor(readonly bookId: string, readonly memberId: string, readonly daysLate: number) {}\n}\n",
            "domain-events-ts-library/handlers.ts": "import { DomainEvent, BookReturned } from './events';\n\n// Reactions live outside the Loan. Adding one never touches loan.ts.\nexport function chargeLateFee(event: DomainEvent): void {\n  const returned = event as BookReturned;\n  if (returned.daysLate > 0) {\n    console.log('Charge member ' + returned.memberId + ' ' + (returned.daysLate * 0.5).toFixed(2) + ' EUR');\n  }\n}\n\nexport function notifyWaitlist(event: DomainEvent): void {\n  const returned = event as BookReturned;\n  console.log('Email the next reader on the waitlist for ' + returned.bookId);\n}\n",
            "domain-events-ts-library/loan.ts": "import { DomainEvent, BookReturned } from './events';\n\n// The loan records WHAT happened. It does not know about fees or emails.\nexport class Loan {\n  private returned = false;\n  private pending: DomainEvent[] = [];\n\n  constructor(readonly bookId: string, readonly memberId: string, readonly dueDate: Date) {}\n\n  returnBook(today: Date): void {\n    if (this.returned) {\n      throw new Error('Book already returned');\n    }\n    this.returned = true;\n    const msPerDay = 24 * 60 * 60 * 1000;\n    const daysLate = Math.max(0, Math.ceil((today.getTime() - this.dueDate.getTime()) / msPerDay));\n    this.pending.push(new BookReturned(this.bookId, this.memberId, daysLate));\n  }\n\n  pullEvents(): DomainEvent[] {\n    const events = this.pending;\n    this.pending = [];\n    return events;\n  }\n}\n",
            "domain-events-ts-library/main.ts": "import { Loan } from './loan';\nimport { EventDispatcher } from './dispatcher';\nimport { chargeLateFee, notifyWaitlist } from './handlers';\n\nexport function main(): void {\n  const dispatcher = new EventDispatcher();\n  dispatcher.on('BookReturned', chargeLateFee);\n  dispatcher.on('BookReturned', notifyWaitlist);\n\n  const loan = new Loan('dune-01', 'member-42', new Date('2026-03-01'));\n  loan.returnBook(new Date('2026-03-04'));\n\n  // In a real app: save the loan first, then publish what happened.\n  dispatcher.dispatch(loan.pullEvents());\n}\n\nmain();\n"
          }
        },
        {
          "id": "domain-events-php-subscription",
          "title": "SaaS subscription: upgrade and cancel",
          "lang": "PHP",
          "level": "intermediate",
          "source": null,
          "story": "A Subscription aggregate records PlanUpgraded and SubscriptionCancelled. The application service saves first and then publishes, and handlers in another module prorate invoices and send exit surveys.",
          "roles": {
            "Event Source": [
              "domain-events-php-subscription/src/Domain/Subscription.php#Subscription",
              "domain-events-php-subscription/src/Domain/AggregateRoot.php#AggregateRoot"
            ],
            "Domain Event": [
              "domain-events-php-subscription/src/Domain/Events.php#PlanUpgraded",
              "domain-events-php-subscription/src/Domain/Events.php#SubscriptionCancelled"
            ],
            "Dispatcher": [
              "domain-events-php-subscription/src/Application/EventBus.php#EventBus",
              "domain-events-php-subscription/src/Application/SubscriptionService.php#SubscriptionService.save"
            ],
            "Handler": [
              "domain-events-php-subscription/src/Application/Handlers.php#ProrateInvoiceHandler",
              "domain-events-php-subscription/src/Application/Handlers.php#SendExitSurveyHandler"
            ]
          },
          "trace": [
            {
              "at": "domain-events-php-subscription/main.php#main",
              "say": "main() subscribes one handler per event class, then upgrades and cancels a subscription."
            },
            {
              "at": "domain-events-php-subscription/src/Application/SubscriptionService.php#SubscriptionService.upgrade",
              "say": "The service loads the aggregate and calls upgradeTo(). It does not know which side effects exist."
            },
            {
              "at": "domain-events-php-subscription/src/Domain/Subscription.php#Subscription.upgradeTo",
              "say": "The aggregate checks its rules, switches plan and records PlanUpgraded with the data billing will need."
            },
            {
              "at": "domain-events-php-subscription/src/Domain/AggregateRoot.php#AggregateRoot.recordThat",
              "say": "recordThat() only appends to a private list. Nothing is sent yet, the change is not saved yet."
            },
            {
              "at": "domain-events-php-subscription/src/Application/SubscriptionService.php#SubscriptionService.save",
              "say": "save() stores the aggregate first, then releases its events to the bus. A failed save publishes nothing."
            },
            {
              "at": "domain-events-php-subscription/src/Application/EventBus.php#EventBus.publishAll",
              "say": "The bus looks up handlers by the event's class name and calls each one."
            },
            {
              "at": "domain-events-php-subscription/src/Application/Handlers.php#ProrateInvoiceHandler.__invoke",
              "say": "Billing turns the fact into a prorated charge. Pricing rules for invoices stay in the billing module."
            },
            {
              "at": "domain-events-php-subscription/src/Domain/Subscription.php#Subscription.cancel",
              "say": "Cancelling twice records nothing the second time: no new fact, so no second survey email."
            }
          ],
          "files": {
            "domain-events-php-subscription/main.php": "<?php\nrequire_once __DIR__ . '/src/Application/EventBus.php';\nrequire_once __DIR__ . '/src/Application/Handlers.php';\nrequire_once __DIR__ . '/src/Application/SubscriptionService.php';\n\nfunction main(): void\n{\n    $bus = new EventBus();\n    $bus->subscribe(PlanUpgraded::class, new ProrateInvoiceHandler());\n    $bus->subscribe(SubscriptionCancelled::class, new SendExitSurveyHandler());\n\n    $service = new SubscriptionService($bus);\n    $service->add(new Subscription('sub-1', 'lena@example.com', 'starter', new DateTimeImmutable('2026-05-25')));\n\n    $service->upgrade('sub-1', 'team');\n    $service->cancel('sub-1', 'switching tools');\n    $service->cancel('sub-1', 'clicked twice'); // no second event\n}\n\nmain();\n",
            "domain-events-php-subscription/src/Application/EventBus.php": "<?php\n\n// A tiny in-process bus: event class name -> list of handler callables.\nclass EventBus\n{\n    private array $handlers = [];\n\n    public function subscribe(string $eventClass, callable $handler): void\n    {\n        $this->handlers[$eventClass][] = $handler;\n    }\n\n    public function publishAll(array $events): void\n    {\n        foreach ($events as $event) {\n            foreach ($this->handlers[get_class($event)] ?? [] as $handler) {\n                $handler($event);\n            }\n        }\n    }\n}\n",
            "domain-events-php-subscription/src/Application/Handlers.php": "<?php\nrequire_once __DIR__ . '/../Domain/Events.php';\nrequire_once __DIR__ . '/../Domain/Subscription.php';\n\n// Billing reacts to upgrades. It lives in another module and could be\n// replaced by a message queue consumer without touching Subscription.\nclass ProrateInvoiceHandler\n{\n    public function __invoke(PlanUpgraded $event): void\n    {\n        $difference = Subscription::priceOf($event->toPlan) - Subscription::priceOf($event->fromPlan);\n        $charge = intdiv($difference * $event->daysLeftInPeriod, 30);\n        echo \"Invoice {$event->subscriptionId}: prorated charge {$charge} cents\\n\";\n    }\n}\n\n// Customer success reacts to cancellations.\nclass SendExitSurveyHandler\n{\n    public function __invoke(SubscriptionCancelled $event): void\n    {\n        echo \"Email {$event->customerEmail}: sorry to see you go ({$event->reason})\\n\";\n    }\n}\n",
            "domain-events-php-subscription/src/Application/SubscriptionService.php": "<?php\nrequire_once __DIR__ . '/../Domain/Subscription.php';\nrequire_once __DIR__ . '/EventBus.php';\n\n// Application service: load, call the aggregate, save, THEN publish.\n// Publishing after the save means handlers never react to a change\n// that was rolled back.\nclass SubscriptionService\n{\n    private array $store = [];\n\n    public function __construct(private EventBus $bus)\n    {\n    }\n\n    public function add(Subscription $subscription): void\n    {\n        $this->store[$subscription->id] = $subscription;\n    }\n\n    public function upgrade(string $id, string $plan): void\n    {\n        $subscription = $this->store[$id];\n        $subscription->upgradeTo($plan, new DateTimeImmutable('2026-05-10'));\n        $this->save($subscription);\n    }\n\n    public function cancel(string $id, string $reason): void\n    {\n        $subscription = $this->store[$id];\n        $subscription->cancel($reason);\n        $this->save($subscription);\n    }\n\n    private function save(Subscription $subscription): void\n    {\n        $this->store[$subscription->id] = $subscription; // a real app writes to the DB here\n        $this->bus->publishAll($subscription->releaseEvents());\n    }\n}\n",
            "domain-events-php-subscription/src/Domain/AggregateRoot.php": "<?php\n\n// Base class for aggregates that record domain events while they change.\nabstract class AggregateRoot\n{\n    private array $recordedEvents = [];\n\n    protected function recordThat(object $event): void\n    {\n        $this->recordedEvents[] = $event;\n    }\n\n    public function releaseEvents(): array\n    {\n        $events = $this->recordedEvents;\n        $this->recordedEvents = [];\n        return $events;\n    }\n}\n",
            "domain-events-php-subscription/src/Domain/Events.php": "<?php\n\n// Events are small, immutable facts in past tense. They carry the data a\n// handler needs, so handlers do not have to reload the subscription.\nfinal class PlanUpgraded\n{\n    public function __construct(\n        public readonly string $subscriptionId,\n        public readonly string $fromPlan,\n        public readonly string $toPlan,\n        public readonly int $daysLeftInPeriod,\n        public readonly DateTimeImmutable $occurredAt = new DateTimeImmutable(),\n    ) {\n    }\n}\n\nfinal class SubscriptionCancelled\n{\n    public function __construct(\n        public readonly string $subscriptionId,\n        public readonly string $customerEmail,\n        public readonly string $reason,\n        public readonly DateTimeImmutable $occurredAt = new DateTimeImmutable(),\n    ) {\n    }\n}\n",
            "domain-events-php-subscription/src/Domain/Subscription.php": "<?php\nrequire_once __DIR__ . '/AggregateRoot.php';\nrequire_once __DIR__ . '/Events.php';\n\n// The aggregate changes its own state and records what happened.\n// It never sends emails or creates invoices itself.\nclass Subscription extends AggregateRoot {\n    private const PRICES = ['starter' => 900, 'team' => 2900, 'business' => 7900];\n\n    private string $status = 'active';\n\n    public function __construct(\n        public readonly string $id,\n        public readonly string $customerEmail,\n        private string $plan,\n        private DateTimeImmutable $periodEnd,\n    ) {\n    }\n\n    public function upgradeTo(string $newPlan, DateTimeImmutable $today): void\n    {\n        if ($this->status !== 'active') {\n            throw new DomainException('Only active subscriptions can change plan');\n        }\n        if (self::PRICES[$newPlan] <= self::PRICES[$this->plan]) {\n            throw new DomainException('Use downgradeTo() for cheaper plans');\n        }\n        $old = $this->plan;\n        $this->plan = $newPlan;\n        $daysLeft = (int) $today->diff($this->periodEnd)->days;\n        $this->recordThat(new PlanUpgraded($this->id, $old, $newPlan, $daysLeft));\n    }\n\n    public function cancel(string $reason): void\n    {\n        if ($this->status === 'cancelled') {\n            return; // nothing happened, so no event\n        }\n        $this->status = 'cancelled';\n        $this->recordThat(new SubscriptionCancelled($this->id, $this->customerEmail, $reason));\n    }\n\n    public static function priceOf(string $plan): int\n    {\n        return self::PRICES[$plan];\n    }\n}\n"
          }
        },
        {
          "id": "domain-events-eshop-real",
          "title": "eShop: events raised by Order, dispatched on save",
          "lang": "C#",
          "level": "advanced",
          "source": {
            "repo": "dotnet/eShop",
            "url": "https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Infrastructure/MediatorExtension.cs",
            "license": "MIT",
            "note": "All files are from Microsoft's eShop reference app at commit dc7ea49; Entity.cs, Order.cs and OrderingContext.cs are trimmed (marked) to the event-related parts."
          },
          "story": "The Order aggregate adds events to a list on its Entity base class. When OrderingContext saves, it first dispatches every collected event through MediatR, so handlers like the buyer validator run inside the same unit of work.",
          "roles": {
            "Event Source": [
              "domain-events-eshop-real/Domain/OrderAggregate/Order.cs#Order",
              "domain-events-eshop-real/Domain/SeedWork/Entity.cs#Entity"
            ],
            "Domain Event": [
              "domain-events-eshop-real/Domain/Events/OrderStartedDomainEvent.cs"
            ],
            "Dispatcher": [
              "domain-events-eshop-real/Infrastructure/MediatorExtension.cs#MediatorExtension",
              "domain-events-eshop-real/Infrastructure/OrderingContext.cs#OrderingContext.SaveEntitiesAsync"
            ],
            "Handler": [
              "domain-events-eshop-real/Application/ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler.cs#ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler"
            ]
          },
          "trace": [
            {
              "at": "domain-events-eshop-real/Domain/OrderAggregate/Order.cs#Order.AddOrderStartedDomainEvent",
              "say": "When an order is created, the constructor calls this helper, which wraps the buyer and card data in an OrderStartedDomainEvent."
            },
            {
              "at": "domain-events-eshop-real/Domain/SeedWork/Entity.cs#Entity.AddDomainEvent",
              "say": "Every entity can hold events. Raising one just adds it to a private list; nothing runs yet."
            },
            {
              "at": "domain-events-eshop-real/Domain/OrderAggregate/Order.cs#Order.SetPaidStatus",
              "say": "State changes follow the same habit: check the current status, record a past-tense event, change state."
            },
            {
              "at": "domain-events-eshop-real/Infrastructure/OrderingContext.cs#OrderingContext.SaveEntitiesAsync",
              "say": "Saving the unit of work first dispatches all events, then calls SaveChangesAsync, so handler changes commit together."
            },
            {
              "at": "domain-events-eshop-real/Infrastructure/MediatorExtension.cs#MediatorExtension.DispatchDomainEventsAsync",
              "say": "The dispatcher asks EF's change tracker for every entity with events, collects them and publishes each through MediatR."
            },
            {
              "at": "domain-events-eshop-real/Domain/SeedWork/Entity.cs#Entity.ClearDomainEvents",
              "say": "Lists are cleared before publishing, so an event is never dispatched twice on a later save."
            },
            {
              "at": "domain-events-eshop-real/Application/ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler.cs#ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler.Handle",
              "say": "A handler in another layer reacts: it finds or creates the Buyer aggregate and records the payment method. Order never knew."
            }
          ],
          "files": {
            "domain-events-eshop-real/Application/ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.API/Application/DomainEventHandlers/ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.API.Application.DomainEventHandlers;\n\npublic class ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler\n                    : INotificationHandler<OrderStartedDomainEvent>\n{\n    private readonly ILogger _logger;\n    private readonly IBuyerRepository _buyerRepository;\n    private readonly IOrderingIntegrationEventService _orderingIntegrationEventService;\n\n    public ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler(\n        ILogger<ValidateOrAddBuyerAggregateWhenOrderStartedDomainEventHandler> logger,\n        IBuyerRepository buyerRepository,\n        IOrderingIntegrationEventService orderingIntegrationEventService)\n    {\n        _buyerRepository = buyerRepository ?? throw new ArgumentNullException(nameof(buyerRepository));\n        _orderingIntegrationEventService = orderingIntegrationEventService ?? throw new ArgumentNullException(nameof(orderingIntegrationEventService));\n        _logger = logger ?? throw new ArgumentNullException(nameof(logger));\n    }\n\n    public async Task Handle(OrderStartedDomainEvent domainEvent, CancellationToken cancellationToken)\n    {\n        var cardTypeId = domainEvent.CardTypeId != 0 ? domainEvent.CardTypeId : 1;\n        var buyer = await _buyerRepository.FindAsync(domainEvent.UserId);\n        var buyerExisted = buyer is not null;\n\n        if (!buyerExisted)\n        {\n            buyer = new Buyer(domainEvent.UserId, domainEvent.UserName);\n        }\n\n        // REVIEW: The event this creates needs to be sent after SaveChanges has propagated the buyer Id. It currently only\n        // works by coincidence. If we remove HiLo or if anything decides to yield earlier, it will break.\n\n        buyer.VerifyOrAddPaymentMethod(cardTypeId,\n                                        $\"Payment Method on {DateTime.UtcNow}\",\n                                        domainEvent.CardNumber,\n                                        domainEvent.CardSecurityNumber,\n                                        domainEvent.CardHolderName,\n                                        domainEvent.CardExpiration,\n                                        domainEvent.Order.Id);\n\n        if (!buyerExisted)\n        {\n            _buyerRepository.Add(buyer);\n        }\n\n        await _buyerRepository.UnitOfWork\n            .SaveEntitiesAsync(cancellationToken);\n\n        var integrationEvent = new OrderStatusChangedToSubmittedIntegrationEvent(domainEvent.Order.Id, domainEvent.Order.OrderStatus, buyer.Name, buyer.IdentityGuid);\n        await _orderingIntegrationEventService.AddAndSaveEventAsync(integrationEvent);\n        OrderingApiTrace.LogOrderBuyerAndPaymentValidatedOrUpdated(_logger, buyer.Id, domainEvent.Order.Id);\n    }\n}\n",
            "domain-events-eshop-real/Domain/Events/OrderStartedDomainEvent.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/Events/OrderStartedDomainEvent.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\n\nnamespace eShop.Ordering.Domain.Events;\n\n/// <summary>\n/// Event used when an order is created\n/// </summary>\npublic record class OrderStartedDomainEvent(\n    Order Order, \n    string UserId,\n    string UserName,\n    int CardTypeId,\n    string CardNumber,\n    string CardSecurityNumber,\n    string CardHolderName,\n    DateTime CardExpiration) : INotification;\n",
            "domain-events-eshop-real/Domain/OrderAggregate/Order.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/AggregatesModel/OrderAggregate/Order.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nusing System.ComponentModel.DataAnnotations;\n\nnamespace eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\npublic class Order\n    : Entity, IAggregateRoot\n{\n    public DateTime OrderDate { get; private set; }\n\n    // … trimmed: 25 lines of properties (Address, Buyer, Description, draft flag, order items) …\n    public int? PaymentId { get; private set; }\n\n    // … trimmed: 9 lines (NewDraft factory) …\n\n    protected Order()\n    {\n        _orderItems = new List<OrderItem>();\n        _isDraft = false;\n    }\n\n    public Order(string userId, string userName, Address address, int cardTypeId, string cardNumber, string cardSecurityNumber,\n            string cardHolderName, DateTime cardExpiration, int? buyerId = null, int? paymentMethodId = null) : this()\n    {\n        BuyerId = buyerId;\n        PaymentId = paymentMethodId;\n        OrderStatus = OrderStatus.Submitted;\n        OrderDate = DateTime.UtcNow;\n        Address = address;\n\n        // Add the OrderStarterDomainEvent to the domain events collection \n        // to be raised/dispatched when committing changes into the Database [ After DbContext.SaveChanges() ]\n        AddOrderStartedDomainEvent(userId, userName, cardTypeId, cardNumber,\n                                    cardSecurityNumber, cardHolderName, cardExpiration);\n    }\n\n    // … trimmed: 32 lines (AddOrderItem, SetPaymentMethodVerified) not related to events …\n\n    public void SetAwaitingValidationStatus()\n    {\n        if (OrderStatus == OrderStatus.Submitted)\n        {\n            AddDomainEvent(new OrderStatusChangedToAwaitingValidationDomainEvent(Id, _orderItems));\n            OrderStatus = OrderStatus.AwaitingValidation;\n        }\n    }\n\n    public void SetStockConfirmedStatus()\n    {\n        if (OrderStatus == OrderStatus.AwaitingValidation)\n        {\n            AddDomainEvent(new OrderStatusChangedToStockConfirmedDomainEvent(Id));\n\n            OrderStatus = OrderStatus.StockConfirmed;\n            Description = \"All the items were confirmed with available stock.\";\n        }\n    }\n\n    public void SetPaidStatus()\n    {\n        if (OrderStatus == OrderStatus.StockConfirmed)\n        {\n            AddDomainEvent(new OrderStatusChangedToPaidDomainEvent(Id, OrderItems));\n\n            OrderStatus = OrderStatus.Paid;\n            Description = \"The payment was performed at a simulated \\\"American Bank checking bank account ending on XX35071\\\"\";\n        }\n    }\n\n    // … trimmed: 40 lines (shipped, cancelled and stock-rejected transitions raise events the same way) …\n\n    private void AddOrderStartedDomainEvent(string userId, string userName, int cardTypeId, string cardNumber,\n            string cardSecurityNumber, string cardHolderName, DateTime cardExpiration)\n    {\n        var orderStartedDomainEvent = new OrderStartedDomainEvent(this, userId, userName, cardTypeId,\n                                                                    cardNumber, cardSecurityNumber,\n                                                                    cardHolderName, cardExpiration);\n\n        this.AddDomainEvent(orderStartedDomainEvent);\n    }\n\n    private void StatusChangeException(OrderStatus orderStatusToChange)\n    {\n        throw new OrderingDomainException($\"Is not possible to change the order status from {OrderStatus} to {orderStatusToChange}.\");\n    }\n\n    public decimal GetTotal() => _orderItems.Sum(o => o.Units * o.UnitPrice);\n}\n",
            "domain-events-eshop-real/Domain/SeedWork/Entity.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/SeedWork/Entity.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.Domain.Seedwork;\n\npublic abstract class Entity\n{\n    int? _requestedHashCode;\n    int _Id;\n    public virtual int Id\n    {\n        get\n        {\n            return _Id;\n        }\n        protected set\n        {\n            _Id = value;\n        }\n    }\n\n    private List<INotification> _domainEvents;\n    public IReadOnlyCollection<INotification> DomainEvents => _domainEvents?.AsReadOnly();\n\n    public void AddDomainEvent(INotification eventItem)\n    {\n        _domainEvents = _domainEvents ?? new List<INotification>();\n        _domainEvents.Add(eventItem);\n    }\n\n    public void RemoveDomainEvent(INotification eventItem)\n    {\n        _domainEvents?.Remove(eventItem);\n    }\n\n    public void ClearDomainEvents()\n    {\n        _domainEvents?.Clear();\n    }\n\n    // … trimmed: 50 lines of identity and equality code (IsTransient, Equals, GetHashCode, operators) …\n}\n",
            "domain-events-eshop-real/Infrastructure/MediatorExtension.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Infrastructure/MediatorExtension.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.Infrastructure;\n\nstatic class MediatorExtension\n{\n    public static async Task DispatchDomainEventsAsync(this IMediator mediator, OrderingContext ctx)\n    {\n        var domainEntities = ctx.ChangeTracker\n            .Entries<Entity>()\n            .Where(x => x.Entity.DomainEvents != null && x.Entity.DomainEvents.Any());\n\n        var domainEvents = domainEntities\n            .SelectMany(x => x.Entity.DomainEvents)\n            .ToList();\n\n        domainEntities.ToList()\n            .ForEach(entity => entity.Entity.ClearDomainEvents());\n\n        foreach (var domainEvent in domainEvents)\n            await mediator.Publish(domainEvent);\n    }\n}\n",
            "domain-events-eshop-real/Infrastructure/OrderingContext.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Infrastructure/OrderingContext.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nusing eShop.IntegrationEventLogEF;\n\nnamespace eShop.Ordering.Infrastructure;\n\n// … trimmed: 6-line remarks comment about running EF migrations …\npublic class OrderingContext : DbContext, IUnitOfWork\n{\n    // … trimmed: 5 lines of DbSet properties (Orders, OrderItems, Payments, Buyers, CardTypes) …\n\n    private readonly IMediator _mediator;\n    // … trimmed: 8 lines (transaction field, test constructor, transaction getters) …\n\n    public OrderingContext(DbContextOptions<OrderingContext> options, IMediator mediator) : base(options)\n    {\n        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));\n\n\n        System.Diagnostics.Debug.WriteLine(\"OrderingContext::ctor ->\" + this.GetHashCode());\n    }\n    // … trimmed: 13 lines of OnModelCreating (EF Core table mappings) …\n\n    public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default)\n    {\n        // Dispatch Domain Events collection. \n        // Choices:\n        // A) Right BEFORE committing data (EF SaveChanges) into the DB will make a single transaction including  \n        // side effects from the domain event handlers which are using the same DbContext with \"InstancePerLifetimeScope\" or \"scoped\" lifetime\n        // B) Right AFTER committing data (EF SaveChanges) into the DB will make multiple transactions. \n        // You will need to handle eventual consistency and compensatory actions in case of failures in any of the Handlers. \n        await _mediator.DispatchDomainEventsAsync(this);\n\n        // After executing this line all the changes (from the Command Handler and Domain Event Handlers) \n        // performed through the DbContext will be committed\n        _ = await base.SaveChangesAsync(cancellationToken);\n\n        return true;\n    }\n\n    // … trimmed: 50 lines of explicit transaction helpers (Begin/Commit/Rollback) …\n}\n"
          }
        }
      ]
    },
    {
      "id": "unit-of-work",
      "name": "Unit of Work",
      "family": "Domain & Data",
      "aka": [
        "Session",
        "DbContext",
        "Change tracking"
      ],
      "tagline": "Track every change during an operation, then write them all in one transaction.",
      "intent": "Instead of writing to the database each time an object changes, a unit of work keeps lists of new, changed (dirty) and removed objects. When the business operation is done, commit() opens one transaction, issues all inserts, updates and deletes in a safe order and commits, so the database never sees half of an operation.",
      "analogy": "A shopping trolley: you pick things up, put some back and swap others while walking through the shop, but you pay once at the till. If your card is declined, you leave with nothing rather than half your groceries.",
      "cityShape": "Look for one unit-of-work building with several small register floors (registerNew, registerDirty, load, add) whose data pipes all feed its list antennas, and one tall commit floor at the top that is the only floor with pipes into the database building (begin, run or update, commit, rollback). Business code buildings change entities but have no pipes to the database.",
      "roles": [
        {
          "name": "Unit of Work",
          "desc": "Keeps the new, dirty and removed lists (often plus an identity map) for one business transaction and owns commit()."
        },
        {
          "name": "Tracked Entity",
          "desc": "A domain object that changes in memory without knowing when or how it is saved."
        },
        {
          "name": "Business Operation",
          "desc": "Service code that loads objects, changes them and asks the unit of work to commit once at the end."
        },
        {
          "name": "Database",
          "desc": "The connection or transaction that receives all the writes together and commits or rolls back."
        }
      ],
      "whenToUse": [
        "One operation changes several rows that must all be saved or none (money transfers, checkouts).",
        "The same object is changed several times and you want one UPDATE, not five.",
        "You want business code free of save() calls and SQL, with persistence decided at one boundary.",
        "You use an ORM (SQLAlchemy Session, EF Core DbContext, Hibernate Session): it already is a unit of work, so learn how it decides what to flush."
      ],
      "pitfalls": [
        "Long-lived units of work (one per app instead of one per request) grow huge, hold stale data and leak memory.",
        "Forgetting to register a change (in hand-written versions) silently loses it; snapshot-based dirty checking avoids this but costs CPU.",
        "Calling external services (email, payment) inside the operation and then failing to commit leaves the world out of sync with the database."
      ],
      "related": [
        "repository",
        "aggregate",
        "domain-events",
        "active-record",
        "command"
      ],
      "quiz": [
        {
          "q": "A product's stock is changed three times during one checkout. With a unit of work, how many UPDATE statements reach the database?",
          "options": [
            "Three, one per change",
            "One, written at commit",
            "None, units of work never write",
            "It depends on the product name"
          ],
          "answer": 1,
          "why": "The unit of work only remembers that the object is dirty and writes its final state once when committing."
        },
        {
          "q": "What happens if the second of two UPDATEs fails during commit?",
          "options": [
            "The first one stays saved",
            "The transaction is rolled back, so neither change is saved",
            "The unit of work retries forever",
            "The entity is deleted"
          ],
          "answer": 1,
          "why": "All writes run in one transaction; on error the unit of work rolls back, so the operation is all-or-nothing."
        }
      ],
      "demos": [
        {
          "id": "unit-of-work-ts-shop",
          "title": "Shop stock in one transaction",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A checkout sells a mug twice, retires a poster and adds a tote bag. The unit of work collects these changes and writes them between one BEGIN and one COMMIT. Product never imports the database.",
          "roles": {
            "Unit of Work": [
              "unit-of-work-ts-shop/unit-of-work.ts#UnitOfWork"
            ],
            "Tracked Entity": [
              "unit-of-work-ts-shop/product.ts#Product"
            ],
            "Business Operation": [
              "unit-of-work-ts-shop/main.ts#main"
            ],
            "Database": [
              "unit-of-work-ts-shop/database.ts#Database"
            ]
          },
          "trace": [
            {
              "at": "unit-of-work-ts-shop/main.ts#main",
              "say": "main() runs one checkout. It changes products and registers them, but writes nothing itself."
            },
            {
              "at": "unit-of-work-ts-shop/product.ts#Product.sell",
              "say": "sell() only changes memory. The entity has no save() and no SQL."
            },
            {
              "at": "unit-of-work-ts-shop/unit-of-work.ts#UnitOfWork.registerDirty",
              "say": "Dirty products go into a Set, so the mug registered twice still gets a single UPDATE."
            },
            {
              "at": "unit-of-work-ts-shop/unit-of-work.ts#UnitOfWork.commit",
              "say": "commit() opens one transaction and writes inserts, updates and deletes in a fixed order."
            },
            {
              "at": "unit-of-work-ts-shop/database.ts#Database.startTransaction",
              "say": "Everything after BEGIN is invisible to other users until COMMIT."
            },
            {
              "at": "unit-of-work-ts-shop/database.ts#Database.rollback",
              "say": "If any statement throws, commit() rolls back: no row of the checkout is saved."
            },
            {
              "at": "unit-of-work-ts-shop/unit-of-work.ts#UnitOfWork.clear",
              "say": "Afterwards the lists are emptied so the next operation starts clean."
            }
          ],
          "files": {
            "unit-of-work-ts-shop/database.ts": "// Stand-in for a real database connection: it just prints the SQL.\nexport class Database {\n  startTransaction(): void {\n    console.log('BEGIN');\n  }\n\n  run(sql: string): void {\n    console.log('  ' + sql);\n  }\n\n  commit(): void {\n    console.log('COMMIT');\n  }\n\n  rollback(): void {\n    console.log('ROLLBACK');\n  }\n}\n",
            "unit-of-work-ts-shop/main.ts": "import { Product } from './product';\nimport { Database } from './database';\nimport { UnitOfWork } from './unit-of-work';\n\nexport function main(): void {\n  const uow = new UnitOfWork(new Database());\n  const mug = new Product(1, 'Mug', 10);       // pretend these were loaded earlier\n  const poster = new Product(2, 'Poster', 3);\n\n  // One checkout touches several rows. Nothing is written yet.\n  mug.sell(2);\n  uow.registerDirty(mug);\n  mug.sell(1);\n  uow.registerDirty(mug);\n  uow.registerRemoved(poster);                  // discontinued\n  uow.registerNew(new Product(3, 'Tote bag', 25));\n\n  uow.commit(); // BEGIN, INSERT, UPDATE (once), DELETE, COMMIT\n}\n\nmain();\n",
            "unit-of-work-ts-shop/product.ts": "// A plain entity. It has no idea how or when it gets saved.\nexport class Product {\n  constructor(readonly id: number, public name: string, public stock: number) {}\n\n  sell(quantity: number): void {\n    if (quantity > this.stock) {\n      throw new Error('Only ' + this.stock + ' ' + this.name + ' left');\n    }\n    this.stock -= quantity;\n  }\n}\n",
            "unit-of-work-ts-shop/unit-of-work.ts": "import { Product } from './product';\nimport { Database } from './database';\n\n// Remembers every change during one business operation, then writes\n// them all in a single transaction: all succeed or none do.\nexport class UnitOfWork {\n  private newProducts: Product[] = [];\n  private dirtyProducts = new Set<Product>();\n  private removedProducts: Product[] = [];\n\n  constructor(private db: Database) {}\n\n  registerNew(product: Product): void {\n    this.newProducts.push(product);\n  }\n\n  registerDirty(product: Product): void {\n    this.dirtyProducts.add(product); // a Set: changing twice still means one UPDATE\n  }\n\n  registerRemoved(product: Product): void {\n    this.removedProducts.push(product);\n  }\n\n  commit(): void {\n    this.db.startTransaction();\n    try {\n      for (const p of this.newProducts) {\n        this.db.run(`INSERT INTO products VALUES (${p.id}, '${p.name}', ${p.stock})`);\n      }\n      for (const p of this.dirtyProducts) {\n        this.db.run(`UPDATE products SET stock = ${p.stock} WHERE id = ${p.id}`);\n      }\n      for (const p of this.removedProducts) {\n        this.db.run(`DELETE FROM products WHERE id = ${p.id}`);\n      }\n      this.db.commit();\n    } catch (err) {\n      this.db.rollback();\n      throw err;\n    } finally {\n      this.clear();\n    }\n  }\n\n  private clear(): void {\n    this.newProducts = [];\n    this.dirtyProducts.clear();\n    this.removedProducts = [];\n  }\n}\n"
          }
        },
        {
          "id": "unit-of-work-java-bank",
          "title": "Bank transfer with change tracking",
          "lang": "Java",
          "level": "intermediate",
          "source": null,
          "story": "This unit of work tracks changes automatically: load() keeps an identity map and a snapshot, and commit() compares snapshots to find dirty accounts. The transfer writes two UPDATEs and an audit row in one transaction.",
          "roles": {
            "Unit of Work": [
              "unit-of-work-java-bank/UnitOfWork.java#UnitOfWork"
            ],
            "Tracked Entity": [
              "unit-of-work-java-bank/Account.java#Account"
            ],
            "Business Operation": [
              "unit-of-work-java-bank/TransferService.java#TransferService.transfer"
            ],
            "Database": [
              "unit-of-work-java-bank/Connection.java#Connection"
            ]
          },
          "trace": [
            {
              "at": "unit-of-work-java-bank/Main.java#Main.main",
              "say": "main seeds three accounts and runs two transfers; the second asks for more than account 2 has."
            },
            {
              "at": "unit-of-work-java-bank/TransferService.java#TransferService.transfer",
              "say": "The service opens a unit of work, loads three accounts, changes two and commits once."
            },
            {
              "at": "unit-of-work-java-bank/UnitOfWork.java#UnitOfWork.load",
              "say": "load() returns the same object for the same id and remembers its balance as a snapshot."
            },
            {
              "at": "unit-of-work-java-bank/Account.java#Account.withdraw",
              "say": "The entity enforces its own rule and changes memory only. For the second transfer it throws before commit."
            },
            {
              "at": "unit-of-work-java-bank/UnitOfWork.java#UnitOfWork.commit",
              "say": "commit() begins a transaction, writes only dirty accounts plus new audit rows, then commits or rolls back."
            },
            {
              "at": "unit-of-work-java-bank/UnitOfWork.java#UnitOfWork.isDirty",
              "say": "Dirty means 'differs from the snapshot'. Account 3 was loaded but untouched, so it gets no UPDATE."
            },
            {
              "at": "unit-of-work-java-bank/Connection.java#Connection.commit",
              "say": "Only now do the new balances replace the committed ones, both at the same moment."
            }
          ],
          "files": {
            "unit-of-work-java-bank/Account.java": "package bank;\n\n// Entity. Changing the balance only changes memory; saving is someone else's job.\npublic class Account {\n    private final long id;\n    private long balanceCents;\n\n    public Account(long id, long balanceCents) {\n        this.id = id;\n        this.balanceCents = balanceCents;\n    }\n\n    public void withdraw(long cents) {\n        if (cents > balanceCents) {\n            throw new IllegalStateException(\"account \" + id + \" has insufficient funds\");\n        }\n        balanceCents -= cents;\n    }\n\n    public void deposit(long cents) {\n        balanceCents += cents;\n    }\n\n    public long getId() {\n        return id;\n    }\n\n    public long getBalanceCents() {\n        return balanceCents;\n    }\n}\n",
            "unit-of-work-java-bank/Connection.java": "package bank;\n\nimport java.util.HashMap;\nimport java.util.Map;\n\n// Stand-in for a JDBC connection with one table: id -> balance.\npublic class Connection {\n    private final Map<Long, Long> committed = new HashMap<>();\n    private Map<Long, Long> working;\n\n    public void seed(long id, long balance) {\n        committed.put(id, balance);\n    }\n\n    public long selectBalance(long id) {\n        return committed.get(id);\n    }\n\n    public void startTransaction() {\n        working = new HashMap<>(committed);\n        System.out.println(\"BEGIN\");\n    }\n\n    public void update(long id, long balance) {\n        working.put(id, balance);\n        System.out.println(\"  UPDATE accounts SET balance=\" + balance + \" WHERE id=\" + id);\n    }\n\n    public void insertAudit(String line) {\n        System.out.println(\"  INSERT INTO audit VALUES ('\" + line + \"')\");\n    }\n\n    public void commit() {\n        committed.clear();\n        committed.putAll(working);\n        System.out.println(\"COMMIT\");\n    }\n\n    public void rollback() {\n        working = null;\n        System.out.println(\"ROLLBACK\");\n    }\n}\n",
            "unit-of-work-java-bank/Main.java": "package bank;\n\npublic class Main {\n    public static void main(String[] args) {\n        Connection connection = new Connection();\n        connection.seed(1, 10_000);\n        connection.seed(2, 2_500);\n        connection.seed(3, 700);\n\n        TransferService service = new TransferService(connection);\n        service.transfer(1, 2, 4_000);\n\n        try {\n            service.transfer(2, 1, 99_000);\n        } catch (IllegalStateException e) {\n            System.out.println(\"Refused before anything was written: \" + e.getMessage());\n        }\n    }\n}\n",
            "unit-of-work-java-bank/TransferService.java": "package bank;\n\n// Business logic edits objects and leaves persistence to the unit of work.\npublic class TransferService {\n    private final Connection connection;\n\n    public TransferService(Connection connection) {\n        this.connection = connection;\n    }\n\n    public void transfer(long fromId, long toId, long cents) {\n        UnitOfWork uow = new UnitOfWork(connection);\n        Account from = uow.load(fromId);\n        Account to = uow.load(toId);\n        Account untouched = uow.load(3); // loaded but never changed\n\n        from.withdraw(cents);\n        to.deposit(cents);\n        uow.registerAudit(\"transfer \" + cents + \" from \" + fromId + \" to \" + toId);\n\n        uow.commit(); // two UPDATEs and one INSERT, never a half-done transfer\n    }\n}\n",
            "unit-of-work-java-bank/UnitOfWork.java": "package bank;\n\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\n// Tracks the accounts loaded in one business transaction. It keeps one\n// object per id (identity map), remembers how each looked when loaded\n// (snapshot) and, on commit, writes only what changed, all at once.\npublic class UnitOfWork {\n    private final Connection connection;\n    private final Map<Long, Account> identityMap = new HashMap<>();\n    private final Map<Long, Long> snapshots = new HashMap<>();\n    private final List<String> newAuditLines = new ArrayList<>();\n\n    public UnitOfWork(Connection connection) {\n        this.connection = connection;\n    }\n\n    public Account load(long id) {\n        Account cached = identityMap.get(id);\n        if (cached != null) {\n            return cached;\n        }\n        long balance = connection.selectBalance(id);\n        Account account = new Account(id, balance);\n        identityMap.put(id, account);\n        snapshots.put(id, balance);\n        return account;\n    }\n\n    public void registerAudit(String line) {\n        newAuditLines.add(line);\n    }\n\n    public void commit() {\n        connection.startTransaction();\n        try {\n            for (Account account : identityMap.values()) {\n                if (isDirty(account)) {\n                    connection.update(account.getId(), account.getBalanceCents());\n                }\n            }\n            for (String line : newAuditLines) {\n                connection.insertAudit(line);\n            }\n            connection.commit();\n            identityMap.values().forEach(a -> snapshots.put(a.getId(), a.getBalanceCents()));\n            newAuditLines.clear();\n        } catch (RuntimeException e) {\n            connection.rollback();\n            throw e;\n        }\n    }\n\n    private boolean isDirty(Account account) {\n        return snapshots.get(account.getId()) != account.getBalanceCents();\n    }\n}\n"
          }
        },
        {
          "id": "unit-of-work-sqlalchemy-real",
          "title": "SQLAlchemy: Session.flush and UOWTransaction",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "sqlalchemy/sqlalchemy",
            "url": "https://github.com/sqlalchemy/sqlalchemy/blob/rel_2_0_36/lib/sqlalchemy/orm/unitofwork.py",
            "license": "MIT",
            "note": "orm/session.py and orm/unitofwork.py are trimmed excerpts (cuts marked) of SQLAlchemy 2.0.36. usage.py was written for Software City."
          },
          "story": "SQLAlchemy's Session is a unit of work. add() and attribute changes only mark objects as new or dirty; commit() flushes them through a UOWTransaction that sorts saves and deletes by dependency and runs them in one transaction.",
          "roles": {
            "Unit of Work": [
              "unit-of-work-sqlalchemy-real/orm/session.py#Session",
              "unit-of-work-sqlalchemy-real/orm/unitofwork.py#UOWTransaction"
            ],
            "Tracked Entity": [
              "unit-of-work-sqlalchemy-real/usage.py#Account",
              "unit-of-work-sqlalchemy-real/usage.py#TransferLog"
            ],
            "Business Operation": [
              "unit-of-work-sqlalchemy-real/usage.py#transfer"
            ],
            "Database": [
              "unit-of-work-sqlalchemy-real/orm/session.py#SessionTransaction"
            ]
          },
          "trace": [
            {
              "at": "unit-of-work-sqlalchemy-real/usage.py#transfer",
              "say": "The business code changes two balances and adds a log row. No SQL runs: the session only notes new and dirty objects."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/session.py#Session.add",
              "say": "add() places the object in the pending ('new') collection of the session."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/session.py#Session.commit",
              "say": "commit() asks the current SessionTransaction to commit, which first flushes until the session is clean."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/session.py#Session._flush",
              "say": "_flush gathers new, dirty and deleted states, registers each with a fresh UOWTransaction, then executes it inside a transaction."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/unitofwork.py#UOWTransaction.register_object",
              "say": "Each state is filed by mapper with an isdelete flag. The first object of a mapper also creates its SaveUpdateAll and DeleteAll actions."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/unitofwork.py#UOWTransaction.execute",
              "say": "execute() sorts all actions topologically, so parents are inserted before children and saves come before deletes."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/unitofwork.py#SaveUpdateAll.execute",
              "say": "One action per mapper hands all its states to save_obj, which batches the INSERT and UPDATE statements."
            },
            {
              "at": "unit-of-work-sqlalchemy-real/orm/unitofwork.py#UOWTransaction.finalize_flush_changes",
              "say": "After success, saved objects become persistent and deleted ones leave the session: the unit of work is clean again."
            }
          ],
          "files": {
            "unit-of-work-sqlalchemy-real/orm/session.py": "# Source: SQLAlchemy 2.0.36 — https://github.com/sqlalchemy/sqlalchemy/blob/rel_2_0_36/lib/sqlalchemy/orm/session.py\n# MIT License, Copyright (c) 2005-2024 SQLAlchemy authors and contributors. Included for study.\n\"\"\"Provides the Session class and related utilities.\"\"\"\n# … trimmed: license comment (see header) and 60 lines of imports …\nfrom .unitofwork import UOWTransaction\n\n\n# … trimmed: ~780 lines (SessionTransactionState, _SessionClassMethods, transaction origin) …\n\n\nclass SessionTransaction(_StateChange, TransactionalContext):\n    # … trimmed: docstring and ~420 lines of connection and savepoint bookkeeping …\n\n    @_StateChange.declare_states(\n        (SessionTransactionState.ACTIVE,), SessionTransactionState.PREPARED\n    )\n    def _prepare_impl(self) -> None:\n        if self._parent is None or self.nested:\n            self.session.dispatch.before_commit(self.session)\n\n        stx = self.session._transaction\n        assert stx is not None\n        if stx is not self:\n            for subtransaction in stx._iterate_self_and_parents(upto=self):\n                subtransaction.commit()\n\n        if not self.session._flushing:\n            for _flush_guard in range(100):\n                if self.session._is_clean():\n                    break\n                self.session.flush()\n            else:\n                raise exc.FlushError(\n                    \"Over 100 subsequent flushes have occurred within \"\n                    \"session.commit() - is an after_flush() hook \"\n                    \"creating new objects?\"\n                )\n\n        # … trimmed: 8 lines of two-phase commit support …\n\n        self._state = SessionTransactionState.PREPARED\n\n    @_StateChange.declare_states(\n        (SessionTransactionState.ACTIVE, SessionTransactionState.PREPARED),\n        SessionTransactionState.CLOSED,\n    )\n    def commit(self, _to_root: bool = False) -> None:\n        if self._state is not SessionTransactionState.PREPARED:\n            with self._expect_state(SessionTransactionState.PREPARED):\n                self._prepare_impl()\n\n        if self._parent is None or self.nested:\n            for conn, trans, should_commit, autoclose in set(\n                self._connections.values()\n            ):\n                if should_commit:\n                    trans.commit()\n\n            self._state = SessionTransactionState.COMMITTED\n            self.session.dispatch.after_commit(self.session)\n\n            self._remove_snapshot()\n\n        with self._expect_state(SessionTransactionState.CLOSED):\n            self.close()\n\n        if _to_root and self._parent:\n            self._parent.commit(_to_root=True)\n\n    # … trimmed: ~120 lines (rollback, close, context manager helpers) …\n\n\nclass Session(_SessionClassMethods, EventTarget):\n    # … trimmed: docstring and ~530 lines (constructor, begin, rollback) …\n\n    def commit(self) -> None:\n        # … trimmed: 30-line docstring …\n        trans = self._transaction\n        if trans is None:\n            trans = self._autobegin_t()\n\n        trans.commit(_to_root=True)\n\n    # … trimmed: ~1410 lines (execute, query, get, merge, expire, refresh …) …\n\n    def add(self, instance: object, _warn: bool = True) -> None:\n        # … trimmed: 24-line docstring …\n        if _warn and self._warn_on_events:\n            self._flush_warning(\"Session.add()\")\n\n        try:\n            state = attributes.instance_state(instance)\n        except exc.NO_STATE as err:\n            raise exc.UnmappedInstanceError(instance) from err\n\n        self._save_or_update_state(state)\n\n    # … trimmed: ~840 lines (add_all, _save_or_update_state, delete, get, merge, bulk helpers …) …\n\n    def flush(self, objects: Optional[Sequence[Any]] = None) -> None:\n        # … trimmed: 21-line docstring …\n\n        if self._flushing:\n            raise sa_exc.InvalidRequestError(\"Session is already flushing\")\n\n        if self._is_clean():\n            return\n        try:\n            self._flushing = True\n            self._flush(objects)\n        finally:\n            self._flushing = False\n\n    # … trimmed: 7 lines (_flush_warning) …\n\n    def _is_clean(self) -> bool:\n        return (\n            not self.identity_map.check_modified()\n            and not self._deleted\n            and not self._new\n        )\n\n    def _flush(self, objects: Optional[Sequence[object]] = None) -> None:\n        dirty = self._dirty_states\n        if not dirty and not self._deleted and not self._new:\n            self.identity_map._modified.clear()\n            return\n\n        flush_context = UOWTransaction(self)\n\n        if self.dispatch.before_flush:\n            self.dispatch.before_flush(self, flush_context, objects)\n            # re-establish \"dirty states\" in case the listeners\n            # added\n            dirty = self._dirty_states\n\n        deleted = set(self._deleted)\n        new = set(self._new)\n\n        dirty = set(dirty).difference(deleted)\n\n        # create the set of all objects we want to operate upon\n        if objects:\n            # specific list passed in\n            objset = set()\n            for o in objects:\n                try:\n                    state = attributes.instance_state(o)\n\n                except exc.NO_STATE as err:\n                    raise exc.UnmappedInstanceError(o) from err\n                objset.add(state)\n        else:\n            objset = None\n\n        # store objects whose fate has been decided\n        processed = set()\n\n        # put all saves/updates into the flush context.  detect top-level\n        # orphans and throw them into deleted.\n        if objset:\n            proc = new.union(dirty).intersection(objset).difference(deleted)\n        else:\n            proc = new.union(dirty).difference(deleted)\n\n        for state in proc:\n            is_orphan = _state_mapper(state)._is_orphan(state)\n\n            is_persistent_orphan = is_orphan and state.has_identity\n\n            if (\n                is_orphan\n                and not is_persistent_orphan\n                and state._orphaned_outside_of_session\n            ):\n                self._expunge_states([state])\n            else:\n                _reg = flush_context.register_object(\n                    state, isdelete=is_persistent_orphan\n                )\n                assert _reg, \"Failed to add object to the flush context!\"\n                processed.add(state)\n\n        # put all remaining deletes into the flush context.\n        if objset:\n            proc = deleted.intersection(objset).difference(processed)\n        else:\n            proc = deleted.difference(processed)\n        for state in proc:\n            _reg = flush_context.register_object(state, isdelete=True)\n            assert _reg, \"Failed to add object to the flush context!\"\n\n        if not flush_context.has_work:\n            return\n\n        flush_context.transaction = transaction = self._autobegin_t()._begin()\n        try:\n            self._warn_on_events = True\n            try:\n                flush_context.execute()\n            finally:\n                self._warn_on_events = False\n\n            self.dispatch.after_flush(self, flush_context)\n\n            flush_context.finalize_flush_changes()\n\n            # … trimmed: 26 lines that reset attribute history changed inside flush event hooks …\n\n            self.dispatch.after_flush_postexec(self, flush_context)\n\n            transaction.commit()\n\n        except:\n            with util.safe_reraise():\n                transaction.rollback(_capture_exception=True)\n    # … trimmed: ~800 lines (bulk operations, is_modified, dirty/new/deleted properties) …\n",
            "unit-of-work-sqlalchemy-real/orm/unitofwork.py": "# Source: SQLAlchemy 2.0.36 — https://github.com/sqlalchemy/sqlalchemy/blob/rel_2_0_36/lib/sqlalchemy/orm/unitofwork.py\n# MIT License, Copyright (c) 2005-2024 SQLAlchemy authors and contributors. Included for study.\n# … trimmed: 9-line license comment (see header) …\n\"\"\"The internals for the unit of work system.\n\nThe session's flush() process passes objects to a contextual object\nhere, which assembles flush tasks based on mappers and their properties,\norganizes them in order of dependency, and executes.\n\n\"\"\"\n# … trimmed: imports and the 120-line track_cascade_events() helper …\n\n\nclass UOWTransaction:\n    session: Session\n    transaction: SessionTransaction\n    attributes: Dict[str, Any]\n    deps: util.defaultdict[Mapper[Any], Set[DependencyProcessor]]\n    mappers: util.defaultdict[Mapper[Any], Set[InstanceState[Any]]]\n\n    def __init__(self, session: Session):\n        self.session = session\n\n        # dictionary used by external actors to\n        # store arbitrary state information.\n        self.attributes = {}\n\n        # dictionary of mappers to sets of\n        # DependencyProcessors, which are also\n        # set to be part of the sorted flush actions,\n        # which have that mapper as a parent.\n        self.deps = util.defaultdict(set)\n\n        # dictionary of mappers to sets of InstanceState\n        # items pending for flush which have that mapper\n        # as a parent.\n        self.mappers = util.defaultdict(set)\n\n        # a dictionary of Preprocess objects, which gather\n        # additional states impacted by the flush\n        # and determine if a flush action is needed\n        self.presort_actions = {}\n\n        # dictionary of PostSortRec objects, each\n        # one issues work during the flush within\n        # a certain ordering.\n        self.postsort_actions = {}\n\n        # a set of 2-tuples, each containing two\n        # PostSortRec objects where the second\n        # is dependent on the first being executed\n        # first\n        self.dependencies = set()\n\n        # dictionary of InstanceState-> (isdelete, listonly)\n        # tuples, indicating if this state is to be deleted\n        # or insert/updated, or just refreshed\n        self.states = {}\n\n        # … trimmed: 7 lines (post-update bookkeeping) …\n\n    @property\n    def has_work(self):\n        return bool(self.states)\n\n    # … trimmed: 92 lines (was_already_deleted, memo, get_attribute_history, preprocessors) …\n\n    def register_object(\n        self,\n        state: InstanceState[Any],\n        isdelete: bool = False,\n        listonly: bool = False,\n        cancel_delete: bool = False,\n        operation: Optional[str] = None,\n        prop: Optional[MapperProperty] = None,\n    ) -> bool:\n        if not self.session._contains_state(state):\n            # this condition is normal when objects are registered\n            # as part of a relationship cascade operation.  it should\n            # not occur for the top-level register from Session.flush().\n            if not state.deleted and operation is not None:\n                util.warn(\n                    \"Object of type %s not in session, %s operation \"\n                    \"along '%s' will not proceed\"\n                    % (orm_util.state_class_str(state), operation, prop)\n                )\n            return False\n\n        if state not in self.states:\n            mapper = state.manager.mapper\n\n            if mapper not in self.mappers:\n                self._per_mapper_flush_actions(mapper)\n\n            self.mappers[mapper].add(state)\n            self.states[state] = (isdelete, listonly)\n        else:\n            if not listonly and (isdelete or cancel_delete):\n                self.states[state] = (isdelete, False)\n        return True\n\n    # … trimmed: 6 lines (register_post_update) …\n\n    def _per_mapper_flush_actions(self, mapper):\n        saves = SaveUpdateAll(self, mapper.base_mapper)\n        deletes = DeleteAll(self, mapper.base_mapper)\n        self.dependencies.add((saves, deletes))\n\n        for dep in mapper._dependency_processors:\n            dep.per_property_preprocessors(self)\n\n        for prop in mapper.relationships:\n            if prop.viewonly:\n                continue\n            dep = prop._dependency_processor\n            dep.per_property_preprocessors(self)\n\n    # … trimmed: 21 lines (dependency filters) …\n\n    def states_for_mapper_hierarchy(self, mapper, isdelete, listonly):\n        checktup = (isdelete, listonly)\n        for mapper in mapper.base_mapper.self_and_descendants:\n            for state in self.mappers[mapper]:\n                if self.states[state] == checktup:\n                    yield state\n\n    def _generate_actions(self):\n        \"\"\"Generate the full, unsorted collection of PostSortRecs as\n        well as dependency pairs for this UOWTransaction.\n\n        \"\"\"\n        # execute presort_actions, until all states\n        # have been processed.   a presort_action might\n        # add new states to the uow.\n        while True:\n            ret = False\n            for action in list(self.presort_actions.values()):\n                if action.execute(self):\n                    ret = True\n            if not ret:\n                break\n\n        # see if the graph of mapper dependencies has cycles.\n        self.cycles = cycles = topological.find_cycles(\n            self.dependencies, list(self.postsort_actions.values())\n        )\n\n            # … trimmed: 26 lines that split cyclic per-mapper actions into per-state actions …\n\n\n        return {\n            a for a in self.postsort_actions.values() if not a.disabled\n        }.difference(cycles)\n\n    def execute(self) -> None:\n        postsort_actions = self._generate_actions()\n\n        postsort_actions = sorted(\n            postsort_actions,\n            key=lambda item: item.sort_key,\n        )\n        # sort = topological.sort(self.dependencies, postsort_actions)\n        # print \"--------------\"\n        # print \"\\ndependencies:\", self.dependencies\n        # … trimmed: 7 lines of commented-out debug prints …\n\n                self.dependencies, postsort_actions\n            ):\n                set_ = set(subset)\n                while set_:\n                    n = set_.pop()\n                    n.execute_aggregate(self, set_)\n        else:\n            for rec in topological.sort(self.dependencies, postsort_actions):\n                rec.execute(self)\n\n    def finalize_flush_changes(self) -> None:\n        \"\"\"Mark processed objects as clean / deleted after a successful\n        flush().\n\n        This method is called within the flush() method after the\n        execute() method has succeeded and the transaction has been committed.\n\n        \"\"\"\n        if not self.states:\n            return\n\n        states = set(self.states)\n        isdel = {\n            s for (s, (isdelete, listonly)) in self.states.items() if isdelete\n        }\n        other = states.difference(isdel)\n        if isdel:\n            self.session._remove_newly_deleted(isdel)\n        if other:\n            self.session._register_persistent(other)\n\n# … trimmed: 140 lines (Preprocess, PostSortRec, ProcessAll, PostUpdateAll) …\n\n\nclass SaveUpdateAll(PostSortRec):\n    __slots__ = (\"mapper\", \"sort_key\")\n\n    def __init__(self, uow, mapper):\n        self.mapper = mapper\n        self.sort_key = (\"SaveUpdateAll\", mapper._sort_key)\n        assert mapper is mapper.base_mapper\n\n    @util.preload_module(\"sqlalchemy.orm.persistence\")\n    def execute(self, uow):\n        util.preloaded.orm_persistence.save_obj(\n            self.mapper,\n            uow.states_for_mapper_hierarchy(self.mapper, False, False),\n            uow,\n        )\n    # … trimmed: 20 lines (per-state fallback for cyclic flushes, __repr__) …\n\n\n# … trimmed: DeleteAll (same shape, calls delete_obj) and the per-state record classes …\n",
            "unit-of-work-sqlalchemy-real/usage.py": "# Example usage written for Software City (not part of SQLAlchemy).\n# In a real project the import is: from sqlalchemy.orm import Session\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\n\nfrom .orm.session import Session\n\n\nclass Base(DeclarativeBase):\n    pass\n\n\nclass Account(Base):\n    __tablename__ = \"account\"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    owner: Mapped[str]\n    balance: Mapped[int]\n\n\nclass TransferLog(Base):\n    __tablename__ = \"transfer_log\"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    note: Mapped[str]\n\n\ndef transfer(session, from_id, to_id, amount):\n    source = session.get(Account, from_id)\n    target = session.get(Account, to_id)\n    source.balance -= amount  # no SQL yet: the session just sees a dirty object\n    target.balance += amount\n    session.add(TransferLog(note=\"%d from %d to %d\" % (amount, from_id, to_id)))\n\n\ndef run():\n    engine = create_engine(\"sqlite://\", echo=True)\n    Base.metadata.create_all(engine)\n    with Session(engine) as session:\n        session.add(Account(id=1, owner=\"ana\", balance=100))\n        session.add(Account(id=2, owner=\"ben\", balance=20))\n        session.commit()\n\n        transfer(session, 1, 2, 30)\n        session.commit()  # one flush: the UPDATEs and the INSERT in one transaction\n"
          }
        }
      ]
    },
    {
      "id": "active-record",
      "name": "Active Record",
      "family": "Domain & Data",
      "aka": [
        "Model.save()",
        "ORM model"
      ],
      "tagline": "An object that wraps one table row and knows how to save and load itself.",
      "intent": "Each class maps to a table and each instance to a row. The object carries both the data and the persistence methods (find, save, delete), so simple CRUD needs almost no extra code. The contrast is Data Mapper, where plain domain objects know nothing about the database and a separate mapper moves data in and out.",
      "analogy": "A self-service checkout: the shopper scans and pays for their own items. Fast for a small basket, but the shopper now has to know how the machine works. A staffed till (data mapper) lets the shopper ignore the machine entirely.",
      "cityShape": "Look for a base Model building whose save floor branches into insert and update floors with pipes going straight into the database or connection building. Every model building extends it, so business floors like publish or restock pipe into save inside the same class. In the Kotlin demo, the data-mapper district next door has a Product building with no pipes to the database at all.",
      "roles": [
        {
          "name": "Active Record Base",
          "desc": "Shared code that turns an object into SQL: find, save (insert or update), delete."
        },
        {
          "name": "Model",
          "desc": "A concrete class for one table: its fields plus business methods that may call save() themselves."
        },
        {
          "name": "Connection",
          "desc": "The database handle the records reach for directly, often global or static."
        },
        {
          "name": "Data Mapper (contrast)",
          "desc": "The alternative: a separate mapper class persists plain domain objects, which stay storage-free."
        },
        {
          "name": "Client",
          "desc": "Code that creates, loads, changes and saves records."
        }
      ],
      "whenToUse": [
        "CRUD-heavy apps where objects map one-to-one onto tables (admin panels, blogs, small shops).",
        "Your framework is built around it (Django, Rails, Laravel Eloquent) and you want to work with it, not against it.",
        "Business rules are simple enough that mixing them with persistence does not hurt."
      ],
      "pitfalls": [
        "Domain logic becomes hard to unit test because every model needs a database (or heavy mocking).",
        "Business methods that call save() themselves hide writes; loops over records can turn into hundreds of queries.",
        "As rules grow, models become huge 'fat models'; that is the moment to consider a data mapper, repositories and a unit of work."
      ],
      "related": [
        "repository",
        "unit-of-work",
        "dto",
        "single-responsibility",
        "god-object"
      ],
      "quiz": [
        {
          "q": "Which call is typical for Active Record but not for Data Mapper?",
          "options": [
            "mapper.update(product)",
            "post.save()",
            "repository.add(order)",
            "session.commit()"
          ],
          "answer": 1,
          "why": "In Active Record the object saves itself. With Data Mapper a separate mapper or repository persists a plain object."
        },
        {
          "q": "How does Django's save() decide between INSERT and UPDATE in the common case?",
          "options": [
            "It always deletes and re-inserts",
            "If the primary key is set it tries an UPDATE first and INSERTs only if no row was updated",
            "It asks the user",
            "It compares every field with the database"
          ],
          "answer": 1,
          "why": "_save_table checks pk_set; with a pk it runs _do_update, and if zero rows matched it falls back to _do_insert."
        }
      ],
      "demos": [
        {
          "id": "active-record-php-blog",
          "title": "Blog posts that save themselves",
          "lang": "PHP",
          "level": "beginner",
          "source": null,
          "story": "A hand-rolled Active Record base class with find, save and delete on SQLite. Post only adds its fields, its table name and a publish() method that saves itself.",
          "roles": {
            "Active Record Base": [
              "active-record-php-blog/src/Model.php#Model"
            ],
            "Model": [
              "active-record-php-blog/src/Post.php#Post"
            ],
            "Connection": [
              "active-record-php-blog/src/Db.php#Db"
            ],
            "Client": [
              "active-record-php-blog/main.php#main"
            ]
          },
          "trace": [
            {
              "at": "active-record-php-blog/main.php#main",
              "say": "main() creates a Post and simply calls save(). There is no repository or mapper in sight."
            },
            {
              "at": "active-record-php-blog/src/Model.php#Model.save",
              "say": "save() decides by itself: no id yet means INSERT, otherwise UPDATE."
            },
            {
              "at": "active-record-php-blog/src/Model.php#Model.insert",
              "say": "insert() turns the object's row into SQL and writes the new id back into the object."
            },
            {
              "at": "active-record-php-blog/src/Db.php#Db.connection",
              "say": "Records reach the database through a shared static connection, convenient but global."
            },
            {
              "at": "active-record-php-blog/src/Model.php#Model.find",
              "say": "find() is static: Post::find(1) runs SELECT and builds a Post from the row."
            },
            {
              "at": "active-record-php-blog/src/Post.php#Post.publish",
              "say": "A business method that changes a field and immediately saves. Logic and persistence are mixed by design."
            },
            {
              "at": "active-record-php-blog/src/Model.php#Model.update",
              "say": "This time the id is set, so save() sends an UPDATE for every column."
            },
            {
              "at": "active-record-php-blog/src/Model.php#Model.delete",
              "say": "Even deleting is a method on the object: the row removes itself."
            }
          ],
          "files": {
            "active-record-php-blog/main.php": "<?php\nrequire_once __DIR__ . '/src/Post.php';\n\nfunction main(): void\n{\n    $post = new Post();\n    $post->title = 'Hello, Active Record';\n    $post->save();                       // INSERT, and the post learns its id\n\n    $loaded = Post::find($post->id);     // SELECT, returns a Post object\n    $loaded->publish();                  // changes a field, then UPDATE\n\n    echo $loaded->title . ' published: ' . var_export(Post::find($post->id)->published, true) . \"\\n\";\n    $loaded->delete();                   // DELETE\n}\n\nmain();\n",
            "active-record-php-blog/src/Db.php": "<?php\n\n// One shared connection. Active Record models reach for it themselves.\nclass Db\n{\n    private static ?PDO $pdo = null;\n\n    public static function connection(): PDO\n    {\n        if (self::$pdo === null) {\n            self::$pdo = new PDO('sqlite::memory:');\n            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n            self::$pdo->exec('CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, published INTEGER)');\n        }\n        return self::$pdo;\n    }\n}\n",
            "active-record-php-blog/src/Model.php": "<?php\nrequire_once __DIR__ . '/Db.php';\n\n// The Active Record base class: every model can find, save and delete\n// ITSELF. Data and database access live in the same object.\nabstract class Model {\n    public ?int $id = null;\n\n    abstract protected static function table(): string;\n\n    abstract protected function toRow(): array;\n\n    abstract protected static function fromRow(array $row): static;\n\n    public static function find(int $id): ?static\n    {\n        $stmt = Db::connection()->prepare('SELECT * FROM ' . static::table() . ' WHERE id = ?');\n        $stmt->execute([$id]);\n        $row = $stmt->fetch(PDO::FETCH_ASSOC);\n        return $row ? static::fromRow($row) : null;\n    }\n\n    public function save(): void\n    {\n        if ($this->id === null) {\n            $this->insert();\n        } else {\n            $this->update();\n        }\n    }\n\n    public function delete(): void\n    {\n        Db::connection()->prepare('DELETE FROM ' . static::table() . ' WHERE id = ?')->execute([$this->id]);\n        $this->id = null;\n    }\n\n    private function insert(): void\n    {\n        $row = $this->toRow();\n        $columns = implode(', ', array_keys($row));\n        $marks = implode(', ', array_fill(0, count($row), '?'));\n        Db::connection()->prepare('INSERT INTO ' . static::table() . \" ($columns) VALUES ($marks)\")->execute(array_values($row));\n        $this->id = (int) Db::connection()->lastInsertId();\n    }\n\n    private function update(): void\n    {\n        $row = $this->toRow();\n        $sets = implode(', ', array_map(fn ($c) => \"$c = ?\", array_keys($row)));\n        $values = array_values($row);\n        $values[] = $this->id;\n        Db::connection()->prepare('UPDATE ' . static::table() . \" SET $sets WHERE id = ?\")->execute($values);\n    }\n}\n",
            "active-record-php-blog/src/Post.php": "<?php\nrequire_once __DIR__ . '/Model.php';\n\n// A model is one table row with behaviour. Post adds its own fields and\n// a business method that saves itself when done.\nclass Post extends Model {\n    public string $title = '';\n    public bool $published = false;\n\n    protected static function table(): string\n    {\n        return 'posts';\n    }\n\n    protected function toRow(): array\n    {\n        return ['title' => $this->title, 'published' => (int) $this->published];\n    }\n\n    protected static function fromRow(array $row): static\n    {\n        $post = new static();\n        $post->id = (int) $row['id'];\n        $post->title = $row['title'];\n        $post->published = (bool) $row['published'];\n        return $post;\n    }\n\n    public function publish(): void\n    {\n        $this->published = true;\n        $this->save();\n    }\n}\n"
          }
        },
        {
          "id": "active-record-kt-inventory",
          "title": "Inventory: Active Record vs Data Mapper",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "The same restock feature written twice. ProductRecord saves itself through a static db; Product is a plain object persisted by ProductMapper. Compare the import arrows: only one domain class depends on db.",
          "roles": {
            "Active Record Base": [
              "active-record-kt-inventory/activerecord/ProductRecord.kt#ProductRecord.save"
            ],
            "Model": [
              "active-record-kt-inventory/activerecord/ProductRecord.kt#ProductRecord"
            ],
            "Connection": [
              "active-record-kt-inventory/db/Database.kt#Database"
            ],
            "Data Mapper (contrast)": [
              "active-record-kt-inventory/datamapper/ProductMapper.kt#ProductMapper",
              "active-record-kt-inventory/datamapper/Product.kt#Product"
            ],
            "Client": [
              "active-record-kt-inventory/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "active-record-kt-inventory/Main.kt#main",
              "say": "main() first uses the Active Record style, then does the same job with a Data Mapper."
            },
            {
              "at": "active-record-kt-inventory/activerecord/ProductRecord.kt#ProductRecord.save",
              "say": "The record builds its own row and picks insert or update. Persistence code lives inside the domain class."
            },
            {
              "at": "active-record-kt-inventory/activerecord/ProductRecord.kt#ProductRecord.find",
              "say": "find() sits in the companion object and reads the shared db, the Kotlin version of a static finder."
            },
            {
              "at": "active-record-kt-inventory/activerecord/ProductRecord.kt#ProductRecord.restock",
              "say": "restock() validates, changes stock and saves itself. Testing it now needs a database."
            },
            {
              "at": "active-record-kt-inventory/datamapper/Product.kt#Product.restock",
              "say": "The data-mapper Product has the same rule but no save() and no db import: a pure unit to test."
            },
            {
              "at": "active-record-kt-inventory/datamapper/ProductMapper.kt#ProductMapper.update",
              "say": "The mapper owns the SQL side: it turns the Product into a row and writes it."
            },
            {
              "at": "active-record-kt-inventory/db/Database.kt#Database.update",
              "say": "Both styles end in the same UPDATE. The difference is who knows about it."
            }
          ],
          "files": {
            "active-record-kt-inventory/Main.kt": "import inventory.activerecord.ProductRecord\nimport inventory.datamapper.Product\nimport inventory.datamapper.ProductMapper\nimport inventory.db.Database\n\nfun main() {\n    val database = Database()\n\n    // Active Record: create, change and save through the object itself.\n    ProductRecord.db = database\n    val lamp = ProductRecord(null, \"LAMP-01\", 4)\n    lamp.save()\n    ProductRecord.find(lamp.id!!)?.restock(6)\n\n    // Data Mapper: the domain object changes, the mapper persists it.\n    val mapper = ProductMapper(database)\n    val chair = mapper.insert(Product(null, \"CHAIR-02\", 2))\n    chair.restock(3)\n    mapper.update(chair)\n}\n",
            "active-record-kt-inventory/activerecord/ProductRecord.kt": "package inventory.activerecord\n\nimport inventory.db.Database\n\n// ACTIVE RECORD: the object is a row. It knows its table and saves itself.\n// Simple and quick to write, but the domain class now depends on the database.\nclass ProductRecord(var id: Int?, var sku: String, var stock: Int) {\n\n    fun restock(amount: Int) {\n        require(amount > 0) { \"Restock amount must be positive\" }\n        stock += amount\n        save()\n    }\n\n    fun save() {\n        val row = mapOf(\"sku\" to sku, \"stock\" to stock)\n        val current = id\n        if (current == null) {\n            id = db.insert(\"products\", row)\n        } else {\n            db.update(\"products\", current, row)\n        }\n    }\n\n    companion object {\n        lateinit var db: Database\n\n        fun find(id: Int): ProductRecord? {\n            val row = db.select(\"products\", id) ?: return null\n            return ProductRecord(id, row[\"sku\"] as String, row[\"stock\"] as Int)\n        }\n    }\n}\n",
            "active-record-kt-inventory/datamapper/Product.kt": "package inventory.datamapper\n\n// DATA MAPPER contrast: a plain domain object. No imports from db,\n// no save(). It can be unit tested without any database at all.\nclass Product(val id: Int?, val sku: String, var stock: Int) {\n\n    fun restock(amount: Int) {\n        require(amount > 0) { \"Restock amount must be positive\" }\n        stock += amount\n    }\n}\n",
            "active-record-kt-inventory/datamapper/ProductMapper.kt": "package inventory.datamapper\n\nimport inventory.db.Database\n\n// The mapper moves data between Product objects and rows. Persistence\n// knowledge lives here, so Product stays ignorant of storage.\nclass ProductMapper(private val db: Database) {\n\n    fun find(id: Int): Product? {\n        val row = db.select(\"products\", id) ?: return null\n        return Product(id, row[\"sku\"] as String, row[\"stock\"] as Int)\n    }\n\n    fun insert(product: Product): Product {\n        val id = db.insert(\"products\", toRow(product))\n        return Product(id, product.sku, product.stock)\n    }\n\n    fun update(product: Product) {\n        db.update(\"products\", product.id ?: error(\"Insert before update\"), toRow(product))\n    }\n\n    private fun toRow(product: Product): Map<String, Any> {\n        return mapOf(\"sku\" to product.sku, \"stock\" to product.stock)\n    }\n}\n",
            "active-record-kt-inventory/db/Database.kt": "package inventory.db\n\n// A tiny in-memory \"database\": table name -> (id -> row).\nclass Database {\n    private val tables = mutableMapOf<String, MutableMap<Int, Map<String, Any>>>()\n    private var nextId = 1\n\n    fun insert(table: String, row: Map<String, Any>): Int {\n        val id = nextId++\n        tables.getOrPut(table) { mutableMapOf() }[id] = row\n        println(\"INSERT INTO $table $row -> id $id\")\n        return id\n    }\n\n    fun update(table: String, id: Int, row: Map<String, Any>) {\n        tables.getValue(table)[id] = row\n        println(\"UPDATE $table SET $row WHERE id = $id\")\n    }\n\n    fun select(table: String, id: Int): Map<String, Any>? {\n        return tables[table]?.get(id)\n    }\n}\n"
          }
        },
        {
          "id": "active-record-django-real",
          "title": "Django: Model.save()",
          "lang": "Python",
          "level": "advanced",
          "source": {
            "repo": "django/django",
            "url": "https://github.com/django/django/blob/5.1.9/django/db/models/base.py",
            "license": "BSD-3-Clause",
            "note": "django/db/models/base.py is a trimmed excerpt (cuts marked) of Django 5.1.9. blog/models.py and blog/usage.py were written for Software City."
          },
          "story": "Django models are Active Records: Article inherits save() and delete() from Model. Follow save() down to _save_table, which tries an UPDATE when the primary key is set and falls back to an INSERT.",
          "roles": {
            "Active Record Base": [
              "active-record-django-real/django/db/models/base.py#Model"
            ],
            "Model": [
              "active-record-django-real/blog/models.py#Article"
            ],
            "Connection": [
              "active-record-django-real/django/db/models/base.py#Model._do_insert",
              "active-record-django-real/django/db/models/base.py#Model._do_update"
            ],
            "Client": [
              "active-record-django-real/blog/usage.py#run"
            ]
          },
          "trace": [
            {
              "at": "active-record-django-real/blog/usage.py#run",
              "say": "run() creates an Article and calls save() on it, then changes it and saves again."
            },
            {
              "at": "active-record-django-real/django/db/models/base.py#Model.save",
              "say": "save() picks the database alias and works out update_fields, then hands over to save_base."
            },
            {
              "at": "active-record-django-real/django/db/models/base.py#Model.save_base",
              "say": "save_base sends pre_save, wraps the write in a transaction guard, calls _save_table, marks _state.adding False, sends post_save."
            },
            {
              "at": "active-record-django-real/django/db/models/base.py#Model._save_table",
              "say": "The heart: with a primary key it tries an UPDATE first; if nothing was updated it INSERTs and copies returned ids onto self."
            },
            {
              "at": "active-record-django-real/django/db/models/base.py#Model._do_update",
              "say": "Filter by pk and run an UPDATE. A row count of zero tells _save_table the row does not exist yet."
            },
            {
              "at": "active-record-django-real/django/db/models/base.py#Model._do_insert",
              "say": "The INSERT goes through the model's manager, which builds and runs the SQL."
            },
            {
              "at": "active-record-django-real/blog/models.py#Article.register_view",
              "say": "A business method that saves itself, limited to one column with update_fields."
            },
            {
              "at": "active-record-django-real/django/db/models/base.py#Model.delete",
              "say": "delete() collects related rows (cascades) and deletes them: the record removes itself."
            }
          ],
          "files": {
            "active-record-django-real/blog/models.py": "# Example model written for Software City (not part of Django).\nfrom django.db import models\nfrom django.db.models.base import Model\n\n\n# Subclassing Model makes Article an Active Record: each instance is a row\n# of the blog_article table and inherits save() and delete().\nclass Article(Model):\n    title = models.CharField(max_length=200)\n    views = models.PositiveIntegerField(default=0)\n\n    def register_view(self):\n        self.views += 1\n        self.save(update_fields=[\"views\"])\n",
            "active-record-django-real/blog/usage.py": "# Example usage written for Software City (not part of Django).\nfrom .models import Article\n\n\ndef run():\n    article = Article(title=\"Active Record in Django\")\n    article.save()           # no pk yet: Django INSERTs and stores the new id\n\n    article.title = \"Active Record, explained\"\n    article.save()           # pk set: Django tries an UPDATE first\n\n    article.register_view()  # the model saves itself with update_fields\n\n    article.delete()         # the instance deletes its own row\n",
            "active-record-django-real/django/db/models/base.py": "# Source: Django 5.1.9 — https://github.com/django/django/blob/5.1.9/django/db/models/base.py\n# BSD 3-Clause License, Copyright (c) Django Software Foundation and individual contributors. Included for study.\n# … trimmed: 20 lines of imports …\nfrom django.db import (\n    DJANGO_VERSION_PICKLE_KEY,\n    DatabaseError,\n    connection,\n    connections,\n    router,\n    transaction,\n)\n# … trimmed: 2 lines of imports …\nfrom django.db.models.deletion import CASCADE, Collector\n# … trimmed: ~410 lines of imports, helpers and the ModelBase metaclass …\n\n\nclass ModelState:\n    \"\"\"Store model instance state.\"\"\"\n\n    db = None\n    # If true, uniqueness validation checks will consider this a new, unsaved\n    # object. Necessary for correct validation of new instances of objects with\n    # explicit (non-auto) PKs. This impacts validation only; it has no effect\n    # on the actual save.\n    adding = True\n    fields_cache = ModelStateFieldsCacheDescriptor()\n\n\nclass Model(AltersData, metaclass=ModelBase):\n    # … trimmed: ~190 lines (__init__, from_db, __repr__, __eq__, pickling) …\n\n    def _get_pk_val(self, meta=None):\n        meta = meta or self._meta\n        return getattr(self, meta.pk.attname)\n\n    # … trimmed: ~165 lines (_set_pk_val, refresh_from_db, serializable_value) …\n\n    def save(\n        self,\n        *args,\n        force_insert=False,\n        force_update=False,\n        using=None,\n        update_fields=None,\n    ):\n        # … trimmed: 8-line docstring and a 10-line deprecation shim for positional arguments …\n\n\n        self._prepare_related_fields_for_save(operation_name=\"save\")\n\n        using = using or router.db_for_write(self.__class__, instance=self)\n        if force_insert and (force_update or update_fields):\n            raise ValueError(\"Cannot force both insert and updating in model saving.\")\n        # … trimmed: 39 lines that work out update_fields for deferred models …\n\n        self.save_base(\n            using=using,\n            force_insert=force_insert,\n            force_update=force_update,\n            update_fields=update_fields,\n        )\n\n    save.alters_data = True\n    # … trimmed: 52 lines (asave, _validate_force_insert) …\n\n    def save_base(\n        self,\n        raw=False,\n        force_insert=False,\n        force_update=False,\n        using=None,\n        update_fields=None,\n    ):\n        # … trimmed: 9-line docstring …\n        using = using or router.db_for_write(self.__class__, instance=self)\n        assert not (force_insert and (force_update or update_fields))\n        assert update_fields is None or update_fields\n        cls = origin = self.__class__\n        # Skip proxies, but keep the origin as the proxy model.\n        if cls._meta.proxy:\n            cls = cls._meta.concrete_model\n        meta = cls._meta\n        if not meta.auto_created:\n            pre_save.send(\n                sender=origin,\n                instance=self,\n                raw=raw,\n                using=using,\n                update_fields=update_fields,\n            )\n        # A transaction isn't needed if one query is issued.\n        if meta.parents:\n            context_manager = transaction.atomic(using=using, savepoint=False)\n        else:\n            context_manager = transaction.mark_for_rollback_on_error(using=using)\n        with context_manager:\n            parent_inserted = False\n            if not raw:\n                # Validate force insert only when parents are inserted.\n                force_insert = self._validate_force_insert(force_insert)\n                parent_inserted = self._save_parents(\n                    cls, using, update_fields, force_insert\n                )\n            updated = self._save_table(\n                raw,\n                cls,\n                force_insert or parent_inserted,\n                force_update,\n                using,\n                update_fields,\n            )\n        # Store the database on which the object was saved\n        self._state.db = using\n        # Once saved, this is no longer a to-be-added instance.\n        self._state.adding = False\n\n        # Signal that the save is complete\n        if not meta.auto_created:\n            post_save.send(\n                sender=origin,\n                instance=self,\n                created=(not updated),\n                update_fields=update_fields,\n                raw=raw,\n                using=using,\n            )\n\n    save_base.alters_data = True\n\n    # … trimmed: 46 lines (_save_parents for multi-table inheritance) …\n\n    def _save_table(\n        self,\n        raw=False,\n        cls=None,\n        force_insert=False,\n        force_update=False,\n        using=None,\n        update_fields=None,\n    ):\n        # … trimmed: 4-line docstring …\n        meta = cls._meta\n        non_pks_non_generated = [\n            f\n            for f in meta.local_concrete_fields\n            if not f.primary_key and not f.generated\n        ]\n\n        # … trimmed: 6 lines narrowing the fields when update_fields is given …\n\n        pk_val = self._get_pk_val(meta)\n        if pk_val is None:\n            pk_val = meta.pk.get_pk_value_on_save(self)\n            setattr(self, meta.pk.attname, pk_val)\n        pk_set = pk_val is not None\n        if not pk_set and (force_update or update_fields):\n            raise ValueError(\"Cannot force an update in save() with no primary key.\")\n        updated = False\n        # … trimmed: 12 lines that force an INSERT when the primary key has a default …\n        # If possible, try an UPDATE. If that doesn't update anything, do an INSERT.\n        if pk_set and not force_insert:\n            base_qs = cls._base_manager.using(using)\n            values = [\n                (\n                    f,\n                    None,\n                    (getattr(self, f.attname) if raw else f.pre_save(self, False)),\n                )\n                for f in non_pks_non_generated\n            ]\n            forced_update = update_fields or force_update\n            updated = self._do_update(\n                base_qs, using, pk_val, values, update_fields, forced_update\n            )\n            if force_update and not updated:\n                raise DatabaseError(\"Forced update did not affect any rows.\")\n            if update_fields and not updated:\n                raise DatabaseError(\"Save with update_fields did not affect any rows.\")\n        if not updated:\n            # … trimmed: 17 lines that fill the _order column for order_with_respect_to …\n            fields = [\n                f\n                for f in meta.local_concrete_fields\n                if not f.generated and (pk_set or f is not meta.auto_field)\n            ]\n            returning_fields = meta.db_returning_fields\n            results = self._do_insert(\n                cls._base_manager, using, fields, returning_fields, raw\n            )\n            if results:\n                for value, field in zip(results[0], returning_fields):\n                    setattr(self, field.attname, value)\n        return updated\n\n    def _do_update(self, base_qs, using, pk_val, values, update_fields, forced_update):\n        \"\"\"\n        Try to update the model. Return True if the model was updated (if an\n        update query was done and a matching row was found in the DB).\n        \"\"\"\n        filtered = base_qs.filter(pk=pk_val)\n        # … trimmed: 20 lines (models without non-key fields, select_on_save variant) …\n        return filtered._update(values) > 0\n\n    def _do_insert(self, manager, using, fields, returning_fields, raw):\n        # … trimmed: 4-line docstring …\n        return manager._insert(\n            [self],\n            fields=fields,\n            returning_fields=returning_fields,\n            using=using,\n            raw=raw,\n        )\n\n    # … trimmed: 53 lines (_prepare_related_fields_for_save) …\n\n    def delete(self, using=None, keep_parents=False):\n        if self.pk is None:\n            raise ValueError(\n                \"%s object can't be deleted because its %s attribute is set \"\n                \"to None.\" % (self._meta.object_name, self._meta.pk.attname)\n            )\n        using = using or router.db_for_write(self.__class__, instance=self)\n        collector = Collector(using=using, origin=self)\n        collector.collect([self], keep_parents=keep_parents)\n        return collector.delete()\n\n    delete.alters_data = True\n    # … trimmed: ~1200 lines (adelete, validation, system checks) …\n"
          }
        }
      ]
    },
    {
      "id": "dto",
      "name": "Data Transfer Object",
      "family": "Domain & Data",
      "aka": [
        "DTO",
        "View model",
        "Request/response model"
      ],
      "tagline": "A plain data object shaped for crossing a boundary, mapped from and to domain objects.",
      "intent": "At the edges of a system (HTTP APIs, message queues, UI screens) send and receive simple objects that hold only the fields that boundary needs, with no behaviour. A mapper converts between these DTOs and the richer domain objects, so internal fields stay private, clients cannot set what they should not, and the domain can change without breaking the API.",
      "analogy": "A restaurant menu is not the kitchen's recipe book. It lists the dish name and price in the form guests need; the recipe, supplier costs and prep notes stay in the kitchen, and the kitchen can change suppliers without reprinting the menu.",
      "cityShape": "DTO buildings are short or floorless: classes with fields and almost no functions. Between them and the tall domain buildings stands a mapper building whose toDto/ToResponse/FromOrder floors have pipes reaching both sides. The boundary building (controller or handler) has pipes to the mapper and DTOs, but its output never touches the domain's private fields.",
      "roles": [
        {
          "name": "DTO",
          "desc": "A behaviour-free data holder shaped for one boundary: request, response or view model."
        },
        {
          "name": "Domain Object",
          "desc": "The rich internal object with rules and fields that must not leak (hashes, costs, notes)."
        },
        {
          "name": "Mapper",
          "desc": "Converts between domain objects and DTOs; the one place that knows both shapes."
        },
        {
          "name": "Boundary",
          "desc": "The controller, handler or command handler that receives DTOs from outside and returns DTOs."
        }
      ],
      "whenToUse": [
        "An API or screen should show only some fields, or a reshaped view (formatted totals, flattened names).",
        "Clients must not be able to set certain fields (ids, prices, status) through mass assignment.",
        "You want to evolve the domain model without breaking external clients, or version the API separately.",
        "Data must be serialized (JSON, messages) and domain objects have behaviour or cycles that serialize badly."
      ],
      "pitfalls": [
        "Mapping boilerplate for every class; generate it or keep DTOs only at real boundaries, not between every layer.",
        "Putting business rules in DTOs turns them into a second, weaker domain model.",
        "Returning domain entities 'just this once' leaks private fields and couples clients to your internals."
      ],
      "related": [
        "value-object",
        "active-record",
        "adapter",
        "facade",
        "mvc",
        "client-server"
      ],
      "quiz": [
        {
          "q": "Why does the Go demo's CreateOrderRequest have no Status or price fields?",
          "options": [
            "To save memory",
            "So clients cannot set them; the server decides status and prices",
            "JSON cannot encode them",
            "Go structs are limited to four fields"
          ],
          "answer": 1,
          "why": "A request DTO defines exactly what a client may send. Fields that are absent cannot be mass-assigned, so '\"status\":\"shipped\"' is simply ignored."
        },
        {
          "q": "Where should the conversion from User to UserDto live?",
          "options": [
            "Inside UserDto as business logic",
            "In a mapper (or a static factory) at the boundary",
            "In the database",
            "In every controller separately"
          ],
          "answer": 1,
          "why": "One mapper per shape keeps the knowledge of both models in a single place, so the domain stays free of API concerns."
        }
      ],
      "demos": [
        {
          "id": "dto-java-users",
          "title": "User profile without the password hash",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "User holds a password hash and a failed-login counter. UserMapper copies only id, email and a formatted 'member since' into UserDto, which the controller turns into JSON.",
          "roles": {
            "DTO": [
              "dto-java-users/UserDto.java#UserDto"
            ],
            "Domain Object": [
              "dto-java-users/User.java#User"
            ],
            "Mapper": [
              "dto-java-users/UserMapper.java#UserMapper.toDto"
            ],
            "Boundary": [
              "dto-java-users/UserController.java#UserController"
            ]
          },
          "trace": [
            {
              "at": "dto-java-users/Main.java#Main.main",
              "say": "main creates a User with a password hash and asks the controller for user 7."
            },
            {
              "at": "dto-java-users/UserController.java#UserController.getUser",
              "say": "The controller loads the domain object but refuses to send it out as is. It asks the mapper for a DTO."
            },
            {
              "at": "dto-java-users/UserMapper.java#UserMapper.toDto",
              "say": "The mapper picks safe fields and reshapes the date into display text. The hash is simply never copied."
            },
            {
              "at": "dto-java-users/UserDto.java#UserDto.UserDto",
              "say": "The DTO is final fields and a constructor: nothing to protect, nothing to call, easy to serialize."
            },
            {
              "at": "dto-java-users/UserController.java#UserController.toJson",
              "say": "Serialization works on the DTO only, so the JSON shape is exactly the DTO's shape."
            },
            {
              "at": "dto-java-users/User.java#User.checkPassword",
              "say": "Behaviour and secrets stay on the domain object, inside the server."
            }
          ],
          "files": {
            "dto-java-users/Main.java": "package users;\n\nimport java.time.LocalDate;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        User mia = new User(7, \"mia@example.com\", \"9f86d081884c7d65\", LocalDate.of(2024, 3, 14));\n        UserController controller = new UserController(Map.of(7L, mia));\n\n        // The password hash and failed-login counter never appear in the response.\n        System.out.println(controller.getUser(7));\n    }\n}\n",
            "dto-java-users/User.java": "package users;\n\nimport java.time.LocalDate;\n\n// Domain object: has behaviour and data that must never leave the server.\npublic class User {\n    private final long id;\n    private final String email;\n    private final String passwordHash;\n    private final LocalDate createdOn;\n    private int failedLogins;\n\n    public User(long id, String email, String passwordHash, LocalDate createdOn) {\n        this.id = id;\n        this.email = email;\n        this.passwordHash = passwordHash;\n        this.createdOn = createdOn;\n    }\n\n    public boolean checkPassword(String hash) {\n        boolean ok = passwordHash.equals(hash);\n        failedLogins = ok ? 0 : failedLogins + 1;\n        return ok;\n    }\n\n    public long getId() {\n        return id;\n    }\n\n    public String getEmail() {\n        return email;\n    }\n\n    public LocalDate getCreatedOn() {\n        return createdOn;\n    }\n}\n",
            "dto-java-users/UserController.java": "package users;\n\nimport java.util.Map;\n\n// The boundary: it receives domain objects from inside and sends DTOs out.\npublic class UserController {\n    private final Map<Long, User> users;\n\n    public UserController(Map<Long, User> users) {\n        this.users = users;\n    }\n\n    public String getUser(long id) {\n        User user = users.get(id);\n        UserDto dto = UserMapper.toDto(user);\n        return toJson(dto);\n    }\n\n    private String toJson(UserDto dto) {\n        return \"{\\\"id\\\":\" + dto.id + \",\\\"email\\\":\\\"\" + dto.email + \"\\\",\\\"memberSince\\\":\\\"\" + dto.memberSince + \"\\\"}\";\n    }\n}\n",
            "dto-java-users/UserDto.java": "package users;\n\n// Data Transfer Object: only the fields the client may see, already in\n// the shape the screen needs. No behaviour, nothing to protect.\npublic class UserDto {\n    public final long id;\n    public final String email;\n    public final String memberSince;\n\n    public UserDto(long id, String email, String memberSince) {\n        this.id = id;\n        this.email = email;\n        this.memberSince = memberSince;\n    }\n}\n",
            "dto-java-users/UserMapper.java": "package users;\n\n// The one place that knows both shapes. Adding a field to User does not\n// leak it to clients unless someone adds it here on purpose.\npublic class UserMapper {\n    public static UserDto toDto(User user) {\n        String since = user.getCreatedOn().getMonth() + \" \" + user.getCreatedOn().getYear();\n        return new UserDto(user.getId(), user.getEmail(), since);\n    }\n}\n"
          }
        },
        {
          "id": "dto-go-orders-api",
          "title": "Orders API: request and response DTOs",
          "lang": "Go",
          "level": "intermediate",
          "source": null,
          "story": "JSON comes in as a CreateOrderRequest, is validated, mapped to a domain Order with server-side prices, and goes out as a flat OrderResponse. Cost prices and internal notes never reach the client.",
          "roles": {
            "DTO": [
              "dto-go-orders-api/api/dto.go#CreateOrderRequest",
              "dto-go-orders-api/api/dto.go#ItemRequest",
              "dto-go-orders-api/api/dto.go#OrderResponse"
            ],
            "Domain Object": [
              "dto-go-orders-api/domain/order.go#Order",
              "dto-go-orders-api/domain/order.go#Line"
            ],
            "Mapper": [
              "dto-go-orders-api/api/mapper.go#ToDomain",
              "dto-go-orders-api/api/mapper.go#ToResponse"
            ],
            "Boundary": [
              "dto-go-orders-api/api/handler.go#OrderHandler"
            ]
          },
          "trace": [
            {
              "at": "dto-go-orders-api/main.go#main",
              "say": "main posts JSON that sneakily includes \"status\":\"shipped\" and prints the response."
            },
            {
              "at": "dto-go-orders-api/api/handler.go#OrderHandler.Create",
              "say": "The handler decodes into the request DTO. Unknown JSON keys like status have nowhere to go and are dropped."
            },
            {
              "at": "dto-go-orders-api/api/dto.go#CreateOrderRequest.Validate",
              "say": "The DTO checks its own shape (required fields, positive quantities). Business rules come later, in the domain."
            },
            {
              "at": "dto-go-orders-api/api/mapper.go#ToDomain",
              "say": "The mapper looks up prices on the server and builds domain Lines, so a client can never choose its own price."
            },
            {
              "at": "dto-go-orders-api/domain/order.go#NewOrder",
              "say": "The domain applies its own rule (at least one line) and sets the status itself."
            },
            {
              "at": "dto-go-orders-api/api/mapper.go#ToResponse",
              "say": "Going out, the mapper flattens the order: item count and a formatted total, no cost prices or notes."
            },
            {
              "at": "dto-go-orders-api/domain/order.go#Order.TotalCents",
              "say": "The total is computed by the domain; the DTO only carries the result as display text."
            }
          ],
          "files": {
            "dto-go-orders-api/api/dto.go": "package api\n\nimport \"errors\"\n\n// Request DTO: exactly what a client may send, with JSON names.\n// Clients cannot set prices, status or ids because the fields do not exist.\ntype CreateOrderRequest struct {\n\tCustomerID string        `json:\"customer_id\"`\n\tItems      []ItemRequest `json:\"items\"`\n}\n\ntype ItemRequest struct {\n\tSKU      string `json:\"sku\"`\n\tQuantity int    `json:\"quantity\"`\n}\n\n// Validate checks the shape of the input, not business rules.\nfunc (r CreateOrderRequest) Validate() error {\n\tif r.CustomerID == \"\" {\n\t\treturn errors.New(\"customer_id is required\")\n\t}\n\tfor _, it := range r.Items {\n\t\tif it.SKU == \"\" || it.Quantity <= 0 {\n\t\t\treturn errors.New(\"each item needs a sku and a positive quantity\")\n\t\t}\n\t}\n\treturn nil\n}\n\n// Response DTO: a flat, display-ready view of an order.\ntype OrderResponse struct {\n\tID        string `json:\"id\"`\n\tStatus    string `json:\"status\"`\n\tItemCount int    `json:\"item_count\"`\n\tTotal     string `json:\"total\"`\n}\n",
            "dto-go-orders-api/api/handler.go": "package api\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"net/http\"\n\n\t\"example.com/shop/domain\"\n)\n\n// The HTTP boundary: JSON in -> request DTO -> domain -> response DTO -> JSON out.\ntype OrderHandler struct {\n\torders map[string]domain.Order\n\tnextID int\n}\n\nfunc NewOrderHandler() *OrderHandler {\n\treturn &OrderHandler{orders: map[string]domain.Order{}}\n}\n\nfunc (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {\n\tvar req CreateOrderRequest\n\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil {\n\t\thttp.Error(w, \"invalid JSON\", http.StatusBadRequest)\n\t\treturn\n\t}\n\tif err := req.Validate(); err != nil {\n\t\thttp.Error(w, err.Error(), http.StatusBadRequest)\n\t\treturn\n\t}\n\th.nextID++\n\torder, err := ToDomain(fmt.Sprintf(\"ord-%d\", h.nextID), req)\n\tif err != nil {\n\t\thttp.Error(w, err.Error(), http.StatusUnprocessableEntity)\n\t\treturn\n\t}\n\th.orders[order.ID] = order\n\tw.Header().Set(\"Content-Type\", \"application/json\")\n\tw.WriteHeader(http.StatusCreated)\n\tjson.NewEncoder(w).Encode(ToResponse(order))\n}\n",
            "dto-go-orders-api/api/mapper.go": "package api\n\nimport (\n\t\"fmt\"\n\n\t\"example.com/shop/domain\"\n)\n\n// Catalog prices live on the server; the request only names SKUs.\nvar catalog = map[string][2]int{\"MUG\": {1200, 450}, \"TEE\": {2500, 900}}\n\nfunc ToDomain(id string, req CreateOrderRequest) (domain.Order, error) {\n\tlines := make([]domain.Line, 0, len(req.Items))\n\tfor _, it := range req.Items {\n\t\tprice, ok := catalog[it.SKU]\n\t\tif !ok {\n\t\t\treturn domain.Order{}, fmt.Errorf(\"unknown sku %q\", it.SKU)\n\t\t}\n\t\tlines = append(lines, domain.Line{SKU: it.SKU, Quantity: it.Quantity, UnitCents: price[0], CostCents: price[1]})\n\t}\n\treturn domain.NewOrder(id, req.CustomerID, lines)\n}\n\nfunc ToResponse(o domain.Order) OrderResponse {\n\tcount := 0\n\tfor _, l := range o.Lines {\n\t\tcount += l.Quantity\n\t}\n\treturn OrderResponse{\n\t\tID:        o.ID,\n\t\tStatus:    o.Status,\n\t\tItemCount: count,\n\t\tTotal:     fmt.Sprintf(\"%.2f EUR\", float64(o.TotalCents())/100),\n\t}\n}\n",
            "dto-go-orders-api/domain/order.go": "package domain\n\nimport \"errors\"\n\n// Line and Order are domain types: they hold rules and internal data\n// (cost prices, notes) that the HTTP API must never expose.\ntype Line struct {\n\tSKU       string\n\tQuantity  int\n\tUnitCents int\n\tCostCents int\n}\n\ntype Order struct {\n\tID            string\n\tCustomerID    string\n\tLines         []Line\n\tStatus        string\n\tInternalNotes string\n}\n\nfunc NewOrder(id, customerID string, lines []Line) (Order, error) {\n\tif len(lines) == 0 {\n\t\treturn Order{}, errors.New(\"an order needs at least one line\")\n\t}\n\treturn Order{ID: id, CustomerID: customerID, Lines: lines, Status: \"placed\"}, nil\n}\n\nfunc (o Order) TotalCents() int {\n\ttotal := 0\n\tfor _, l := range o.Lines {\n\t\ttotal += l.Quantity * l.UnitCents\n\t}\n\treturn total\n}\n",
            "dto-go-orders-api/main.go": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http/httptest\"\n\t\"strings\"\n\n\t\"example.com/shop/api\"\n)\n\nfunc main() {\n\thandler := api.NewOrderHandler()\n\n\tbody := `{\"customer_id\":\"c-9\",\"items\":[{\"sku\":\"MUG\",\"quantity\":2},{\"sku\":\"TEE\",\"quantity\":1}],\"status\":\"shipped\"}`\n\treq := httptest.NewRequest(\"POST\", \"/orders\", strings.NewReader(body))\n\trec := httptest.NewRecorder()\n\thandler.Create(rec, req)\n\n\t// \"status\":\"shipped\" in the request is ignored: the DTO has no such field.\n\tfmt.Println(rec.Code, rec.Body.String())\n}\n"
          }
        },
        {
          "id": "dto-eshop-real",
          "title": "eShop: OrderDraftDTO from an Order",
          "lang": "C#",
          "level": "intermediate",
          "source": {
            "repo": "dotnet/eShop",
            "url": "https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.API/Application/Commands/CreateOrderDraftCommandHandler.cs",
            "license": "MIT",
            "note": "Files under Application/ and Domain/ are from Microsoft's eShop reference app at commit dc7ea49 (Order.cs trimmed, marked). DraftExample.cs was written for Software City."
          },
          "story": "To preview an order, eShop maps BasketItem DTOs to OrderItemDTOs, feeds them into a real Order so the domain rules apply, then maps the Order back out with OrderDraftDTO.FromOrder.",
          "roles": {
            "DTO": [
              "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs#OrderDraftDTO",
              "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs#OrderItemDTO",
              "dto-eshop-real/Application/BasketItem.cs#BasketItem",
              "dto-eshop-real/Application/CreateOrderDraftCommand.cs"
            ],
            "Domain Object": [
              "dto-eshop-real/Domain/Order.cs#Order"
            ],
            "Mapper": [
              "dto-eshop-real/Application/BasketItemExtensions.cs#BasketItemExtensions",
              "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs#OrderDraftDTO.FromOrder"
            ],
            "Boundary": [
              "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs#CreateOrderDraftCommandHandler"
            ]
          },
          "trace": [
            {
              "at": "dto-eshop-real/DraftExample.cs#DraftExample.Run",
              "say": "The example builds a command holding BasketItem DTOs, the shape another service sends in."
            },
            {
              "at": "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs#CreateOrderDraftCommandHandler.Handle",
              "say": "The handler is the boundary. It starts a draft Order and converts each incoming item first."
            },
            {
              "at": "dto-eshop-real/Application/BasketItemExtensions.cs#BasketItemExtensions.ToOrderItemDTO",
              "say": "An extension method maps BasketItem to OrderItemDTO, renaming Quantity to Units on the way."
            },
            {
              "at": "dto-eshop-real/Domain/Order.cs#Order.AddOrderItem",
              "say": "The DTO data enters the domain through a real method, so discounts and merging rules still apply."
            },
            {
              "at": "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs#OrderDraftDTO.FromOrder",
              "say": "FromOrder copies the item fields and asks the Order for its total. Callers get data, never the aggregate."
            }
          ],
          "files": {
            "dto-eshop-real/Application/BasketItem.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.API/Application/Models/BasketItem.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.API.Application.Models;\n\npublic class BasketItem\n{\n    public string Id { get; init; }\n    public int ProductId { get; init; }\n    public string ProductName { get; init; }\n    public decimal UnitPrice { get; init; }\n    public decimal OldUnitPrice { get; init; }\n    public int Quantity { get; init; }\n    public string PictureUrl { get; init; }\n}\n",
            "dto-eshop-real/Application/BasketItemExtensions.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.API/Extensions/BasketItemExtensions.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.API.Extensions;\n\npublic static class BasketItemExtensions\n{\n    public static IEnumerable<OrderItemDTO> ToOrderItemsDTO(this IEnumerable<BasketItem> basketItems)\n    {\n        foreach (var item in basketItems)\n        {\n            yield return item.ToOrderItemDTO();\n        }\n    }\n\n    public static OrderItemDTO ToOrderItemDTO(this BasketItem item)\n    {\n        return new OrderItemDTO()\n        {\n            ProductId = item.ProductId,\n            ProductName = item.ProductName,\n            PictureUrl = item.PictureUrl,\n            UnitPrice = item.UnitPrice,\n            Units = item.Quantity\n        };\n    }\n}\n",
            "dto-eshop-real/Application/CreateOrderDraftCommand.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.API/Application/Commands/CreateOrderDraftCommand.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.API.Application.Commands;\nusing eShop.Ordering.API.Application.Models;\n\npublic record CreateOrderDraftCommand(string BuyerId, IEnumerable<BasketItem> Items) : IRequest<OrderDraftDTO>;\n",
            "dto-eshop-real/Application/CreateOrderDraftCommandHandler.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.API/Application/Commands/CreateOrderDraftCommandHandler.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nnamespace eShop.Ordering.API.Application.Commands;\n\nusing eShop.Ordering.API.Extensions;\nusing eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\n// Regular CommandHandler\npublic class CreateOrderDraftCommandHandler\n    : IRequestHandler<CreateOrderDraftCommand, OrderDraftDTO>\n{\n    public Task<OrderDraftDTO> Handle(CreateOrderDraftCommand message, CancellationToken cancellationToken)\n    {\n        var order = Order.NewDraft();\n        var orderItems = message.Items.Select(i => i.ToOrderItemDTO());\n        foreach (var item in orderItems)\n        {\n            order.AddOrderItem(item.ProductId, item.ProductName, item.UnitPrice, item.Discount, item.PictureUrl, item.Units);\n        }\n\n        return Task.FromResult(OrderDraftDTO.FromOrder(order));\n    }\n}\n\npublic record OrderDraftDTO\n{\n    public IEnumerable<OrderItemDTO> OrderItems { get; init; }\n    public decimal Total { get; init; }\n\n    public static OrderDraftDTO FromOrder(Order order)\n    {\n        return new OrderDraftDTO()\n        {\n            OrderItems = order.OrderItems.Select(oi => new OrderItemDTO\n            {\n                Discount = oi.Discount,\n                ProductId = oi.ProductId,\n                UnitPrice = oi.UnitPrice,\n                PictureUrl = oi.PictureUrl,\n                Units = oi.Units,\n                ProductName = oi.ProductName\n            }),\n            Total = order.GetTotal()\n        };\n    }\n}\n\npublic record OrderItemDTO\n{\n    public int ProductId { get; init; }\n\n    public string ProductName { get; init; }\n\n    public decimal UnitPrice { get; init; }\n\n    public decimal Discount { get; init; }\n\n    public int Units { get; init; }\n\n    public string PictureUrl { get; init; }\n}\n",
            "dto-eshop-real/Domain/Order.cs": "// Source: eShop (dotnet/eShop, commit dc7ea49) — https://github.com/dotnet/eShop/blob/dc7ea499cd356924fb6689b3702964a5869dbae9/src/Ordering.Domain/AggregatesModel/OrderAggregate/Order.cs\n// MIT License, Copyright (c) .NET Foundation and Contributors. Included for study.\nusing System.ComponentModel.DataAnnotations;\n\nnamespace eShop.Ordering.Domain.AggregatesModel.OrderAggregate;\n\npublic class Order\n    : Entity, IAggregateRoot\n{\n    public DateTime OrderDate { get; private set; }\n\n    // … trimmed: 21 lines of properties (Address, Buyer, status, description, draft flag) …\n    private readonly List<OrderItem> _orderItems;\n   \n    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();\n\n    public int? PaymentId { get; private set; }\n\n    public static Order NewDraft()\n    {\n        var order = new Order\n        {\n            _isDraft = true\n        };\n        return order;\n    }\n\n    protected Order()\n    {\n        _orderItems = new List<OrderItem>();\n        _isDraft = false;\n    }\n    // … trimmed: 16 lines (full constructor that raises OrderStartedDomainEvent) …\n\n    // DDD Patterns comment\n    // This Order AggregateRoot's method \"AddOrderItem()\" should be the only way to add Items to the Order,\n    // so any behavior (discounts, etc.) and validations are controlled by the AggregateRoot \n    // in order to maintain consistency between the whole Aggregate. \n    public void AddOrderItem(int productId, string productName, decimal unitPrice, decimal discount, string pictureUrl, int units = 1)\n    {\n        var existingOrderForProduct = _orderItems.SingleOrDefault(o => o.ProductId == productId);\n\n        if (existingOrderForProduct != null)\n        {\n            //if previous line exist modify it with higher discount  and units..\n            if (discount > existingOrderForProduct.Discount)\n            {\n                existingOrderForProduct.SetNewDiscount(discount);\n            }\n\n            existingOrderForProduct.AddUnits(units);\n        }\n        else\n        {\n            //add validated new order item\n            var orderItem = new OrderItem(productId, productName, unitPrice, discount, pictureUrl, units);\n            _orderItems.Add(orderItem);\n        }\n    }\n\n    // … trimmed: 93 lines of status transitions not used by the draft flow …\n\n    public decimal GetTotal() => _orderItems.Sum(o => o.Units * o.UnitPrice);\n}\n",
            "dto-eshop-real/DraftExample.cs": "// Example usage written for Software City (not part of eShop).\nusing eShop.Ordering.API.Application.Commands;\nusing eShop.Ordering.API.Application.Models;\n\nnamespace eShop.Examples;\n\npublic class DraftExample\n{\n    public static async Task Run()\n    {\n        // What the basket service sends in: BasketItem DTOs, not domain objects.\n        var items = new List<BasketItem>\n        {\n            new BasketItem { ProductId = 7, ProductName = \".NET Hoodie\", UnitPrice = 40m, Quantity = 2, PictureUrl = \"7.png\" },\n            new BasketItem { ProductId = 9, ProductName = \"Mug\", UnitPrice = 8m, Quantity = 1, PictureUrl = \"9.png\" }\n        };\n        var command = new CreateOrderDraftCommand(\"buyer-1\", items);\n\n        // The handler builds a real Order to apply the rules, then returns only a DTO.\n        var handler = new CreateOrderDraftCommandHandler();\n        OrderDraftDTO draft = await handler.Handle(command, CancellationToken.None);\n\n        Console.WriteLine($\"{draft.OrderItems.Count()} lines, total {draft.Total}\");\n    }\n}\n"
          }
        }
      ]
    }
  ]
};
