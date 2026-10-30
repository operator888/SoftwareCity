import uuid
from dataclasses import dataclass, field

ORDERS = {}


@dataclass
class Product:
    id: str
    name: str
    price: float
    stock: int = 0

    def to_dict(self):
        return {"id": self.id, "name": self.name, "price": self.price, "stock": self.stock}


@dataclass
class Order:
    id: str
    lines: list
    coupon: str = None
    status: str = "open"
    total: float = 0.0

    @classmethod
    def create(cls, lines, coupon=None):
        order = cls(id=uuid.uuid4().hex[:10], lines=lines, coupon=coupon)
        order.total = order.compute_total()
        ORDERS[order.id] = order
        return order

    @classmethod
    def get(cls, order_id):
        return ORDERS.get(order_id)

    def compute_total(self):
        from inventory import price_of
        t = sum(price_of(l["id"]) * l["qty"] for l in self.lines)
        if self.coupon and self.coupon.startswith("ORBIT"):
            t *= 0.9
        return round(t, 2)

    def to_dict(self):
        return {"id": self.id, "status": self.status, "total": self.total}
