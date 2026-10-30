class_name Ship
extends CharacterBody2D

signal destroyed(ship)
signal fuel_low

@export var max_speed := 420.0
@export var thrust := 900.0
var fuel := 100.0
var hull := 100
const FUEL_BURN := 6.5

func _physics_process(delta):
    var input := Input.get_vector("left", "right", "up", "down")
    if input.length() > 0.1 and fuel > 0:
        velocity += input * thrust * delta
        burn_fuel(delta)
    else:
        velocity = velocity.move_toward(Vector2.ZERO, thrust * 0.2 * delta)
    velocity = velocity.limit_length(max_speed)
    move_and_slide()

func burn_fuel(delta):
    fuel = max(fuel - FUEL_BURN * delta, 0)
    if fuel < 15:
        emit_signal("fuel_low")

func refuel(amount):
    fuel = min(fuel + amount, 100.0)

func take_damage(amount):
    hull -= amount
    if hull <= 0:
        explode()

func explode():
    emit_signal("destroyed", self)
    queue_free()
