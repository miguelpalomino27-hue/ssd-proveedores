import axios from 'axios';

// En local/Docker usa el proxy de nginx ('/api'); en producción se puede
// sobreescribir con VITE_API_URL (ej. en build de Railway/Vercel).
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

// 🔐 Interceptor para token (si luego lo usas)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;