extends Node

const SAVE_PATH := "user://save.json"
var player = null
var day := 1
var settings := {"music": 0.7, "sfx": 0.9}

func register_player(p):
    player = p
    load_game()

func save_game():
    var data = {"credits": player.credits, "cargo": player.cargo, "day": day}
    var f = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    f.store_string(JSON.stringify(data))

func load_game():
    if not FileAccess.file_exists(SAVE_PATH):
        return
    var parsed = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
    match typeof(parsed):
        TYPE_DICTIONARY:
            player.credits = parsed.get("credits", 250)
            player.cargo = parsed.get("cargo", {})
            day = parsed.get("day", 1)
        _:
            push_warning("Save file corrupted")

func advance_day():
    day += 1
    for planet in get_tree().get_nodes_in_group("planets"):
        planet.generate_market()
    save_game()
