// API Client configuration
// Connects to FastAPI Backend via REST endpoints.
// When backend is not reachable, gracefully uses isolated mock data.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend request to ${url} failed:`, err.message);
    throw err;
  }
}
