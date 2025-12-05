const BASE = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  console.log('env', import.meta.env);
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}