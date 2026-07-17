import { useEffect, useState } from 'react';
import api from './services/api';
import './styles.css';

function App() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    razon_social: '',
    ruc: '',
    rubro: '',
    telefono: ''
  });

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
    try {
      const res = await api.get('/proveedores');
      setProveedores(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editando) {
        await api.put(`/proveedores/${idEditar}`, form);
      } else {
        await api.post('/proveedores', form);
      }

      limpiarFormulario();
      obtenerProveedores();
    } catch (error) {
      console.error(error);
    }
  };

  const editarProveedor = (p) => {
    setForm({
      razon_social: p.razon_social,
      ruc: p.ruc,
      rubro: p.rubro,
      telefono: p.telefono
    });
    setEditando(true);
    setIdEditar(p.id);
  };

  const eliminarProveedor = async (id) => {
    if (!confirm('¿Eliminar proveedor?')) return;

    try {
      await api.delete(`/proveedores/${id}`);
      obtenerProveedores();
    } catch (error) {
      console.error(error);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      razon_social: '',
      ruc: '',
      rubro: '',
      telefono: ''
    });
    setEditando(false);
    setIdEditar(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h2>Gestión de Proveedores</h2>

      {/* FORMULARIO */}
      <div className="form-card">
        <div className="form-row">
          <input
            name="razon_social"
            placeholder="Razón Social"
            value={form.razon_social}
            onChange={handleChange}
          />
          <input
            name="ruc"
            placeholder="RUC"
            value={form.ruc}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="rubro"
            placeholder="Rubro"
            value={form.rubro}
            onChange={handleChange}
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button onClick={handleSubmit}>
            {editando ? 'Actualizar' : 'Registrar'}
          </button>

          {editando && (
            <button className="secundario" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* TABLA */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>🔄 Cargando proveedores...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Razón Social</th>
              <th>RUC</th>
              <th>Rubro</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length === 0 ? (
              <tr>
                <td colSpan="5">No hay proveedores</td>
              </tr>
            ) : (
              proveedores.map((p) => (
                <tr key={p.id}>
                  <td>{p.razon_social}</td>
                  <td>{p.ruc}</td>
                  <td>{p.rubro}</td>
                  <td>{p.telefono}</td>
                  <td>
                    <button
                      className="link-btn"
                      onClick={() => editarProveedor(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="link-btn peligro"
                      onClick={() => eliminarProveedor(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;