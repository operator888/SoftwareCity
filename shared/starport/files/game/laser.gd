extends Area2D

var speed := 1600.0
var damage := 12

func _physics_process(delta):
    position += Vector2.RIGHT.rotated(rotation) * speed * delta
    if position.length() > 20000:
        queue_free()

func _on_body_entered(body):
    if body.has_method("take_damage"):
        body.take_damage(damage)
    queue_free()
