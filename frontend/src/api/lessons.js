import { api } from './http';
export const getLessons   = (p={}) => api(`/lessons${p.q ? `?q=${encodeURIComponent(p.q)}` : ''}`);
export const updateLesson = (id, patch) => api(`/lessons/${id}`, { method:'PUT', body: JSON.stringify(patch) });
