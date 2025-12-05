import { api } from './http';
export function createOrder(payload) {
  return api('/orders', { method: 'POST', body: JSON.stringify(payload) });
}
