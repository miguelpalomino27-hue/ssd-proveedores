import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function manejarLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">SSD Proveedores</div>
      <div className="navbar-links">
        <Link to="/proveedores">Proveedores</Link>
        <Link to="/evaluacion">Nueva evaluación</Link>
        <Link to="/historial">Historial</Link>
      </div>
      <div className="navbar-user">
        <span>{usuario?.nombre}</span>
        <button onClick={manejarLogout}>Salir</button>
      </div>
    </nav>
  );
}
