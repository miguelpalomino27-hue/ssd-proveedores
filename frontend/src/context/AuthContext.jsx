import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('ssd_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  async function login(correo, password) {
    const { data } = await api.post('/auth/login', { correo, password });
    localStorage.setItem('ssd_token', data.token);
    localStorage.setItem('ssd_usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function registrar(nombre, correo, password) {
    await api.post('/auth/registro', { nombre, correo, password });
    return login(correo, password);
  }

  function logout() {
    localStorage.removeItem('ssd_token');
    localStorage.removeItem('ssd_usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
