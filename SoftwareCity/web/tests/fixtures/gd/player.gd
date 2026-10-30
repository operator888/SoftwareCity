extends Node2D
class_name Player

signal health_changed(new_value)
signal died

@export var max_speed := 200.0
@export var acceleration := 800.0
var velocity := Vector2.ZERO
var health := 100

func _ready() -> void:
    health = 100
    health_changed.emit(health)

func _physics_process(delta: float) -> void:
    var input := Input.get_vector("left", "right", "up", "down")
    if input.length() > 0.1:
        velocity = velocity.move_toward(input * max_speed, acceleration * delta)
    else:
        velocity = velocity.move_toward(Vector2.ZERO, acceleration * delta)
    move_and_slide()

func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)
    if health <= 0:
        died.emit()
