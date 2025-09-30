import { api } from './http';
export const createOrder = (payload) => api('/orders', { method:'POST', body: JSON.stringify(payload) });
