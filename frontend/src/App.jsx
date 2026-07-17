import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Proveedores from './pages/Proveedores';
import Evaluacion from './pages/Evaluacion';
import Historial from './pages/Historial';
import RutaProtegida from './components/RutaProtegida';
import './styles.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/proveedores"
        element={
          <RutaProtegida>
            <Proveedores />
          </RutaProtegida>
        }
      />
      <Route
        path="/evaluacion"
        element={
          <RutaProtegida>
            <Evaluacion />
          </RutaProtegida>
        }
      />
      <Route
        path="/historial"
        element={
          <RutaProtegida>
            <Historial />
          </RutaProtegida>
        }
      />

      <Route path="/" element={<Navigate to="/proveedores" replace />} />
      <Route path="*" element={<Navigate to="/proveedores" replace />} />
    </Routes>
  );
}

export default App;