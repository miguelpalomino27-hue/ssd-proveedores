import API_URL from '../config';

export const obtenerProveedores = async () => {
  const response = await fetch(`${API_URL}/api/proveedores`);
  const data = await response.json();
  return data;
};