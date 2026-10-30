extends Ship

const GameState = preload("res://game/game_state.gd")

var credits := 250
var cargo := {}
var docked_at = null
@onready var camera := $Camera2D

func _ready():
    connect("fuel_low", _on_fuel_low)
    GameState.register_player(self)

func _unhandled_input(event):
    if event.is_action_pressed("dock") and docked_at == null:
        try_dock()
    elif event.is_action_pressed("undock") and docked_at != null:
        undock()
    elif event.is_action_pressed("fire"):
        fire()

func try_dock():
    for planet in get_tree().get_nodes_in_group("planets"):
        if planet.global_position.distance_to(global_position) < planet.dock_radius:
            docked_at = planet
            planet.on_docked(self)
            refuel(100)
            return true
    return false

func undock():
    docked_at.on_undocked(self)
    docked_at = null

func fire():
    if fuel < 2:
        return
    var shot = preload("res://game/laser.gd").new()
    shot.position = global_position
    get_parent().add_child(shot)
    burn_fuel(0.3)

func buy(item, price, qty):
    var total = price * qty
    if total > credits:
        return false
    credits -= total
    cargo[item] = cargo.get(item, 0) + qty
    GameState.save_game()
    return true

func sell(item, price, qty):
    if cargo.get(item, 0) < qty:
        return false
    cargo[item] -= qty
    if cargo[item] == 0:
        cargo.erase(item)
    credits += price * qty
    return true

func _on_fuel_low():
    camera.shake(0.4)
