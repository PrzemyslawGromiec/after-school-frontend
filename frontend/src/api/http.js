const BASE = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type':'application/json', ...(options.headers||{}) },
    ...options
  });
  if (!res.ok) throw new Error(await res.text().catch(()=>res.statusText));
  return res.json();
}