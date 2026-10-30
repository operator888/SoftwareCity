import time
from models import Order

MAX_RETRIES = 3
GATEWAY_URL = "https://payments.example/charge"


class PaymentError(Exception):
    pass


def charge(order: Order, token: str):
    if not token or not token.startswith("tok_"):
        raise PaymentError("invalid token")
    for attempt in range(MAX_RETRIES):
        ok = _send(order.total, token)
        if ok:
            order.status = "paid"
            return True
        elif attempt < MAX_RETRIES - 1:
            time.sleep(0.2 * (attempt + 1))
    order.status = "failed"
    raise PaymentError("gateway declined")


def _send(amount, token):
    return amount > 0 and len(token) > 8
