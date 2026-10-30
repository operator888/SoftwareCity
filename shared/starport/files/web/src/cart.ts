import type { Product } from './api';

export interface Line { product: Product; qty: number; }

export const MAX_QTY = 99;
export const FREE_SHIPPING_FROM = 120;

export class Cart {
  private lines: Line[] = [];
  private coupon: string | null = null;

  add(product: Product, qty: number): void {
    const found = this.lines.find(l => l.product.id === product.id);
    if (found) {
      found.qty = Math.min(found.qty + qty, MAX_QTY);
    } else {
      this.lines.push({ product, qty: Math.min(qty, MAX_QTY) });
    }
  }

  remove(id: string): void {
    this.lines = this.lines.filter(l => l.product.id !== id);
  }

  count(): number {
    return this.lines.reduce((n, l) => n + l.qty, 0);
  }

  subtotal(): number {
    return this.lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  }

  applyCoupon(code: string): boolean {
    if (!/^[A-Z0-9]{6}$/.test(code)) return false;
    this.coupon = code;
    return true;
  }

  total(): number {
    let t = this.subtotal();
    if (this.coupon && this.coupon.startsWith('ORBIT')) t *= 0.9;
    else if (this.coupon && t > 200) t -= 15;
    const shipping = t >= FREE_SHIPPING_FROM || t === 0 ? 0 : 7.5;
    return Math.round((t + shipping) * 100) / 100;
  }

  items(): Line[] { return [...this.lines]; }
}
