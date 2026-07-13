import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Proveedores from './pages/Proveedores';
import Evaluacion from './pages/Evaluacion';
import Historial from './pages/Historial';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          <Route path="*" element={<Navigate to="/proveedores" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
