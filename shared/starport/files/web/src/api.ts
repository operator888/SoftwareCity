export interface Product { id: string; name: string; price: number; stock: number; }

const BASE = '/api';
let cache: Product[] | null = null;

export async function fetchCatalog(): Promise<Product[]> {
  if (cache) return cache;
  const res = await request('GET', '/products');
  cache = res as Product[];
  return cache;
}

export async function createOrder(lines: { id: string; qty: number }[], coupon?: string) {
  return request('POST', '/orders', { lines, coupon });
}

export async function confirmPayment(orderId: string, token: string) {
  return request('POST', '/orders/' + orderId + '/pay', { token });
}

async function request(method: string, path: string, body?: unknown, attempt = 0): Promise<unknown> {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status >= 500 && attempt < 2) {
    await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    return request(method, path, body, attempt + 1);
  }
  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res.json();
}
