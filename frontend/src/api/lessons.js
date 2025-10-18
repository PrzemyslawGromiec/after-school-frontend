import { api } from './http'

export async function getLessons(params = {}) {
  if (import.meta.env.DEV) {
    const q = params.q ? `?q=${encodeURIComponent(params.q)}` : ''
    return api(`/lessons${q}`)
  }

  const res = await fetch(import.meta.env.BASE_URL + 'lessons.json', { cache: 'no-store' })
  const all = await res.json()
  const q = (params.q || '').toLowerCase()
  return q
    ? all.filter(l =>
        l.subject.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      )
    : all
}

export async function updateLesson(id, patch) {
  if (import.meta.env.DEV) {
    return api(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch)
    })
  }
  return { ok: true }
}