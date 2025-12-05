import { api } from './http';

export function getLessons(params = {}) {
  const q = params.q ? `?q=${encodeURIComponent(params.q)}` : '';
  return api(`/lessons${q}`);
}
export function updateLesson(id, patch) {
  return api(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
}
