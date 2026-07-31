// Central API base URL.
// Local dev: falls back to the local backend automatically.
// Production: set VITE_API_URL on the hosting platform at build time.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
