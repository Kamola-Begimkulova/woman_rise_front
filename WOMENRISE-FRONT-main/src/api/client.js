/**
 * Central API client. Every page/component talks to the backend through these
 * functions — do not call axios directly elsewhere. Shapes match
 * backend/app/schemas.py.
 */
import axios from 'axios'

// Dev: Vite proxies /api -> http://localhost:8000 (see vite.config.js).
// Prod: set VITE_API_URL to the deployed backend, e.g. https://your-api.onrender.com/api
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

const TOKEN_KEY = 'womenrise_token'

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Attach bearer token to every request when present.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ---------- Auth ----------
export const authApi = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
}

// ---------- Courses ----------
export const coursesApi = {
  list: (category) =>
    api.get('/courses', { params: category ? { category } : {} }).then((r) => r.data),
  get: (id) => api.get(`/courses/${id}`).then((r) => r.data),
  enroll: (id) => api.post(`/courses/${id}/enroll`).then((r) => r.data),
  myEnrollments: () => api.get('/enrollments').then((r) => r.data),
  setProgress: (enrollmentId, progress) =>
    api.patch(`/enrollments/${enrollmentId}/progress`, { progress }).then((r) => r.data),
}

// ---------- Marketplace ----------
export const marketApi = {
  list: (category) =>
    api.get('/products', { params: category ? { category } : {} }).then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
  mine: () => api.get('/products/mine').then((r) => r.data),
  create: (data) => api.post('/products', data).then((r) => r.data),
  checkout: (items) => api.post('/orders', { items }).then((r) => r.data),
  myOrders: () => api.get('/orders').then((r) => r.data),
}

// ---------- Community ----------
export const communityApi = {
  posts: (category) =>
    api.get('/community/posts', { params: category ? { category } : {} }).then((r) => r.data),
  getPost: (id) => api.get(`/community/posts/${id}`).then((r) => r.data),
  createPost: (data) => api.post('/community/posts', data).then((r) => r.data),
  like: (id) => api.post(`/community/posts/${id}/like`).then((r) => r.data),
  comment: (id, body) =>
    api.post(`/community/posts/${id}/comments`, { body }).then((r) => r.data),
}

// ---------- Mentors ----------
export const mentorApi = {
  list: () => api.get('/mentors').then((r) => r.data),
  request: (data) => api.post('/mentorship', data).then((r) => r.data),
  mine: () => api.get('/mentorship').then((r) => r.data),
}

// ---------- Stats ----------
export const statsApi = {
  get: () => api.get('/stats').then((r) => r.data),
}
