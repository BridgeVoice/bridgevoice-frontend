// Central API base URL.
// Local dev: falls back to the local backend automatically.
// Production: set VITE_API_URL on the hosting platform at build time.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// fetch wrapper that attaches the logged-in user's JWT.
// Use for every backend call except register/login.
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch(url, { ...options, headers })
}
