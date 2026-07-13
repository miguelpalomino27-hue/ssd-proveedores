import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(correo, password);
      navigate('/proveedores');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesion');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>SSD Proveedores</h1>
        <p className="subtitle">Sistema de Soporte de Decisiones - Region Ayacucho</p>
        <form onSubmit={manejarSubmit}>
          <label>Correo</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
