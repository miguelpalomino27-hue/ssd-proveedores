import { useEffect, useState } from 'react';
import api from '../services/api';

const VACIO = { razon_social: '', ruc: '', rubro: '', telefono: '', direccion: '' };

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const res = await api.get('/proveedores');
      setProveedores(res.data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de proveedores');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editandoId) {
        await api.put(`/proveedores/${editandoId}`, form);
      } else {
        await api.post('/proveedores', form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || 'Error al guardar proveedor');
    }
  }

  function editar(p) {
    setForm({
      razon_social: p.razon_social,
      ruc: p.ruc,
      rubro: p.rubro || '',
      telefono: p.telefono || '',
      direccion: p.direccion || '',
    });
    setEditandoId(p.id);
  }

  async function eliminar(id) {
    if (!window.confirm('¿Desactivar este proveedor?')) return;
    try {
      await api.delete(`/proveedores/${id}`);
      await cargar();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar proveedor');
    }
  }

  return (
    <div>
      <h2>Gestión de proveedores</h2>

      <form className="form-card" onSubmit={manejarSubmit}>
        <div className="form-row">
          <div>
            <label>Razón social</label>
            <input
              value={form.razon_social}
              onChange={(e) => setForm({ ...form, razon_social: e.target.value })}
              required
            />
          </div>
          <div>
            <label>RUC (11 dígitos)</label>
            <input
              value={form.ruc}
              onChange={(e) => setForm({ ...form, ruc: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Rubro</label>
            <input
              value={form.rubro}
              onChange={(e) => setForm({ ...form, rubro: e.target.value })}
            />
          </div>
          <div>
            <label>Teléfono</label>
            <input
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>
        </div>

        <label>Dirección</label>
        <input
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        />

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar' : 'Registrar proveedor'}
          </button>

          {editandoId && (
            <button
              type="button"
              className="secundario"
              onClick={() => {
                setForm(VACIO);
                setEditandoId(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Razón social</th>
              <th>RUC</th>
              <th>Rubro</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td>{p.razon_social}</td>
                <td>{p.ruc}</td>
                <td>{p.rubro}</td>
                <td>{p.telefono}</td>
                <td>
                  <button className="link-btn" onClick={() => editar(p)}>
                    Editar
                  </button>
                  <button className="link-btn peligro" onClick={() => eliminar(p.id)}>
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}