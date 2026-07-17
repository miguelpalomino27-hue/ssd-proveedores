import api from './api';

// 🔍 Obtener todos
export const obtenerProveedores = () => api.get('/proveedores');

// ➕ Crear
export const crearProveedor = (data) => api.post('/proveedores', data);

// ✏️ Actualizar
export const actualizarProveedor = (id, data) =>
  api.put(`/proveedores/${id}`, data);

// ❌ Eliminar
export const eliminarProveedor = (id) =>
  api.delete(`/proveedores/${id}`);