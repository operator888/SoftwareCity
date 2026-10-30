from flask import Flask, jsonify, request
from models import Order, Product
from payments import charge, PaymentError
import inventory

app = Flask(__name__)
API_VERSION = "1.3"


@app.get("/api/products")
def list_products():
    return jsonify([p.to_dict() for p in inventory.all_products()])


@app.post("/api/orders")
def create_order():
    data = request.get_json() or {}
    lines = data.get("lines", [])
    if not lines:
        return jsonify(error="empty order"), 400
    for line in lines:
        if not inventory.reserve(line["id"], line["qty"]):
            inventory.release_all(lines)
            return jsonify(error="out of stock", id=line["id"]), 409
    order = Order.create(lines, data.get("coupon"))
    return jsonify(order.to_dict()), 201


@app.post("/api/orders/<order_id>/pay")
def pay(order_id):
    order = Order.get(order_id)
    if order is None:
        return jsonify(error="not found"), 404
    try:
        charge(order, request.get_json()["token"])
    except PaymentError as e:
        inventory.release_all(order.lines)
        return jsonify(status="failed", reason=str(e)), 402
    return jsonify(status="paid", id=order.id)


if __name__ == "__main__":
    app.run(debug=True)
