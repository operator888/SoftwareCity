extends Node2D

const PANEL_COUNT := 96
const RINGS := 6
var panels := []
var energy := 0.0

func _ready():
    build_panels()

func build_panels():
    for ring in range(RINGS):
        var radius = 120 + ring * 18
        for i in range(PANEL_COUNT):
            var a = TAU * i / PANEL_COUNT + ring * 0.2
            if i % 3 == 0 and ring > 2:
                continue
            panels.append({"pos": Vector2(cos(a), sin(a)) * radius, "ring": ring, "health": 1.0})

func _process(delta):
    energy = 0.0
    for p in panels:
        if p.health > 0.2:
            energy += p.health * delta * (1.0 + p.ring * 0.1)
        elif p.health > 0:
            energy += p.health * delta * 0.3
    queue_redraw()

func damage_area(point, radius):
    for p in panels:
        if p.pos.distance_to(point) < radius:
            p.health = max(p.health - 0.5, 0)

func _draw():
    for p in panels:
        var c = Color(1, 0.75, 0.3, p.health)
        draw_rect(Rect2(p.pos - Vector2(3, 3), Vector2(6, 6)), c)
