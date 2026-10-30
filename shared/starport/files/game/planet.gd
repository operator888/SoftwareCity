class_name Planet
extends Node2D

const DysonSphere = preload("res://game/dyson_sphere.gd")

@export var orbit_radius := 1800.0
@export var orbit_speed := 0.05
@export var dock_radius := 220.0
var angle := 0.0
var market := {}
var sphere = null

func _ready():
    add_to_group("planets")
    generate_market()
    if orbit_radius < 600:
        sphere = DysonSphere.new()
        add_child(sphere)

func _process(delta):
    angle += orbit_speed * delta
    position = Vector2(cos(angle), sin(angle)) * orbit_radius

func generate_market():
    var goods = ["ore", "water", "chips", "spice"]
    for g in goods:
        var base = 10 + randi() % 40
        if g == "spice" and orbit_radius > 3000:
            base *= 3
        market[g] = {"price": base, "stock": randi() % 200}

func price_of(item):
    if not market.has(item):
        return -1
    var m = market[item]
    var scarcity = 1.0 if m.stock > 50 else 1.6
    return int(m.price * scarcity)

func on_docked(ship):
    print("Docked: ", ship.name)

func on_undocked(ship):
    print("Undocked: ", ship.name)
