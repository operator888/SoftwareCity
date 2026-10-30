import { Cart } from './cart';
import { fetchCatalog, Product } from './api';
import { renderCatalog, renderCart } from './ui/render';
import { startCheckout } from './checkout';

const cart = new Cart();
let products: Product[] = [];

async function boot(): Promise<void> {
  products = await fetchCatalog();
  renderCatalog(products, onAdd);
  renderCart(cart);
  document.getElementById('cart-toggle')!.addEventListener('click', toggleCart);
}

function onAdd(id: string): void {
  const p = products.find(x => x.id === id);
  if (!p) return;
  cart.add(p, 1);
  renderCart(cart);
}

function toggleCart(): void {
  const el = document.getElementById('cart')!;
  el.classList.toggle('open');
  if (el.classList.contains('open') && cart.count() > 0) {
    el.querySelector('#pay')?.addEventListener('click', () => startCheckout(cart));
  }
}

boot().catch(err => console.error('Boot failed', err));
