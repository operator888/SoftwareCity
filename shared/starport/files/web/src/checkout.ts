import { Cart } from './cart';
import { createOrder, confirmPayment } from './api';

type Step = 'review' | 'paying' | 'done' | 'failed';
let step: Step = 'review';

export async function startCheckout(cart: Cart): Promise<Step> {
  if (cart.count() === 0) return step;
  step = 'paying';
  try {
    const order: any = await createOrder(cart.items().map(l => ({ id: l.product.id, qty: l.qty })));
    const token = await tokenize();
    const result: any = await confirmPayment(order.id, token);
    step = result.status === 'paid' ? 'done' : 'failed';
  } catch (e) {
    step = 'failed';
    showError(e);
  }
  return step;
}

async function tokenize(): Promise<string> {
  return 'tok_demo_' + Date.now();
}

function showError(e: unknown): void {
  const msg = e instanceof Error ? e.message : 'Unknown error';
  document.getElementById('cart')!.insertAdjacentHTML('beforeend', '<p class="err">' + msg + '</p>');
}
