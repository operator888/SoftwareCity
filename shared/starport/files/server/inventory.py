from models import Product

_STOCK = {
    "ore": Product("ore", "Raw ore crate", 12.0, 140),
    "water": Product("water", "Ice block", 4.5, 600),
    "chips": Product("chips", "Nav chip", 89.0, 12),
    "spice": Product("spice", "Rigel spice", 140.0, 3),
}
_RESERVED = {}


def all_products():
    return list(_STOCK.values())


def price_of(pid):
    p = _STOCK.get(pid)
    return p.price if p else 0


def reserve(pid, qty):
    p = _STOCK.get(pid)
    if p is None or p.stock - _RESERVED.get(pid, 0) < qty:
        return False
    _RESERVED[pid] = _RESERVED.get(pid, 0) + qty
    return True


def release_all(lines):
    for line in lines:
        pid = line["id"]
        if pid in _RESERVED:
            _RESERVED[pid] = max(0, _RESERVED[pid] - line["qty"])
