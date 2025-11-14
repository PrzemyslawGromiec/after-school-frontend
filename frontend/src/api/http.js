const BASE = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;

export function api(path, options = {}) {
  return fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  }).then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t || res.statusText) }));
}