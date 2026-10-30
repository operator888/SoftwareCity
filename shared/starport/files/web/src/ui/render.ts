import { Cart } from '../cart';
import type { Product } from '../api';

export function renderCatalog(products: Product[], onAdd: (id: string) => void): void {
  const root = document.getElementById('catalog')!;
  root.innerHTML = '';
  for (const p of products) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>' + p.name + '</h3><p>' + formatPrice(p.price) + '</p>';
    const btn = document.createElement('button');
    btn.textContent = p.stock > 0 ? 'Add to cart' : 'Sold out';
    btn.disabled = p.stock === 0;
    btn.onclick = () => onAdd(p.id);
    card.appendChild(btn);
    root.appendChild(card);
  }
}

export function renderCart(cart: Cart): void {
  const el = document.getElementById('cart')!;
  const rows = cart.items().map(l => '<li>' + l.qty + ' x ' + l.product.name + '</li>').join('');
  el.innerHTML = '<ul>' + rows + '</ul><p>Total ' + formatPrice(cart.total()) + '</p><button id="pay">Pay</button>';
}

const formatPrice = (n: number): string => n.toFixed(2) + ' cr';
