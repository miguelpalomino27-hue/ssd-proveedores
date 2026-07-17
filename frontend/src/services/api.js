import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ssd-proveedores-production.up.railway.app/api',
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