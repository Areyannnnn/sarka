import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getSettings = () => api.get('/settings').then((r) => r.data);
export const updateSettings = (data) => api.put('/settings', data).then((r) => r.data);
export const uploadHeroImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/settings/hero-image', form).then((r) => r.data);
};
export const uploadMapFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/settings/map-file', form).then((r) => r.data);
};

export const getEvents = () => api.get('/events').then((r) => r.data);
export const createEvent = (formData) => api.post('/events', formData).then((r) => r.data);
export const updateEvent = (id, formData) => api.put(`/events/${id}`, formData).then((r) => r.data);
export const deleteEvent = (id) => api.delete(`/events/${id}`).then((r) => r.data);

export const getRsvps = () => api.get('/rsvps').then((r) => r.data);
export const createRsvp = (data) => api.post('/rsvps', data).then((r) => r.data);
export const deleteRsvp = (id) => api.delete(`/rsvps/${id}`).then((r) => r.data);

export const getComments = (eventId) =>
  api.get('/comments', { params: eventId ? { eventId } : {} }).then((r) => r.data);
export const createComment = (data) => api.post('/comments', data).then((r) => r.data);
export const deleteComment = (id) => api.delete(`/comments/${id}`).then((r) => r.data);

export default api;
