import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { registrar } = useAuth();
  const navigate = useNavigate();

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await registrar(nombre, correo, password);
      navigate('/proveedores');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <form onSubmit={manejarSubmit}>
          <label>Nombre completo</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <label>Correo</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="error">{error}</p>}
          <button type="submit">Registrarme</button>
        </form>
        <p className="link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
