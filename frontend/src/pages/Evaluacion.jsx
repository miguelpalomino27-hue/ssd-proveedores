import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';

const CRITERIOS_INICIALES = [
  { nombre: 'Precio unitario', tipo: 'costo' },
  { nombre: 'Calidad certificada', tipo: 'beneficio' },
  { nombre: 'Plazo de entrega', tipo: 'costo' },
];

function matrizVacia(n) {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 1)));
}

const COLORES_TIER = { alto: '#1f8a4c', medio: '#e0a800', bajo: '#c0392b' };

function tierDe(cercania) {
  if (cercania >= 0.6) return 'alto';
  if (cercania >= 0.4) return 'medio';
  return 'bajo';
}

export default function Evaluacion() {
  const [criterios, setCriterios] = useState(CRITERIOS_INICIALES);
  const [matrizAhp, setMatrizAhp] = useState(matrizVacia(3));
  const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [valores, setValores] = useState({}); // { proveedorId: [v1, v2, v3] }
  const [titulo, setTitulo] = useState('Evaluación de proveedores - materiales de construcción');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    api.get('/proveedores').then(({ data }) => setProveedoresDisponibles(data));
  }, []);

  function actualizarCeldaAhp(i, j, valor) {
    const v = parseFloat(valor) || 1;
    const nueva = matrizAhp.map((fila) => [...fila]);
    nueva[i][j] = v;
    nueva[j][i] = Number((1 / v).toFixed(4));
    setMatrizAhp(nueva);
  }

  function alternarProveedor(id) {
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setValores((prev) => ({ ...prev, [id]: prev[id] || criterios.map(() => 0) }));
  }

  function actualizarValor(id, idx, valor) {
    setValores((prev) => {
      const arr = [...(prev[id] || criterios.map(() => 0))];
      arr[idx] = parseFloat(valor) || 0;
      return { ...prev, [id]: arr };
    });
  }

  async function calcular(e) {
    e.preventDefault();
    setError('');
    setResultado(null);
    if (seleccionados.length < 2) {
      setError('Selecciona al menos 2 proveedores a comparar');
      return;
    }
    setCargando(true);
    try {
      const proveedores = seleccionados.map((id) => {
        const p = proveedoresDisponibles.find((x) => x.id === id);
        return { nombre: p.razon_social, valores: valores[id] };
      });
      const { data } = await api.post('/evaluaciones/calcular', {
        titulo,
        criterios,
        matrizAhp,
        proveedores,
        guardar: true,
      });
      setResultado(data);
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.mensaje);
      } else {
        setError(err.response?.data?.mensaje || 'Error al calcular la evaluación');
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h2>Nueva evaluación (AHP + TOPSIS)</h2>
      <form onSubmit={calcular}>
        <div className="form-card">
          <label>Título de la evaluación</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

          <h3>1. Matriz de comparación por pares de criterios (AHP)</h3>
          <p className="ayuda">
            Escala de Saaty: 1 = igual importancia, 3 = moderada, 5 = fuerte, 7 = muy fuerte, 9 = extrema.
          </p>
          <table className="tabla-matriz">
            <thead>
              <tr>
                <th></th>
                {criterios.map((c) => (
                  <th key={c.nombre}>{c.nombre}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criterios.map((c, i) => (
                <tr key={c.nombre}>
                  <th>{c.nombre}</th>
                  {criterios.map((_, j) => (
                    <td key={j}>
                      {i === j ? (
                        1
                      ) : i < j ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0.11"
                          max="9"
                          value={matrizAhp[i][j]}
                          onChange={(e) => actualizarCeldaAhp(i, j, e.target.value)}
                        />
                      ) : (
                        <span className="reciproco">{matrizAhp[i][j].toFixed(2)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>2. Selección de proveedores a comparar</h3>
          <div className="checklist">
            {proveedoresDisponibles.map((p) => (
              <label key={p.id} className="check-item">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(p.id)}
                  onChange={() => alternarProveedor(p.id)}
                />
                {p.razon_social}
              </label>
            ))}
          </div>

          {seleccionados.length > 0 && (
            <>
              <h3>3. Matriz de decisión (valor de cada proveedor por criterio)</h3>
              <table className="tabla-matriz">
                <thead>
                  <tr>
                    <th>Proveedor</th>
                    {criterios.map((c) => (
                      <th key={c.nombre}>
                        {c.nombre} <span className="tag">{c.tipo}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {seleccionados.map((id) => {
                    const p = proveedoresDisponibles.find((x) => x.id === id);
                    return (
                      <tr key={id}>
                        <th>{p.razon_social}</th>
                        {criterios.map((_, idx) => (
                          <td key={idx}>
                            <input
                              type="number"
                              step="0.01"
                              value={valores[id]?.[idx] ?? 0}
                              onChange={(e) => actualizarValor(id, idx, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={cargando}>
            {cargando ? 'Calculando...' : 'Calcular ranking (AHP + TOPSIS)'}
          </button>
        </div>
      </form>

      {resultado && (
        <div className="resultado-card">
          <h3>Resultados</h3>

          <div className="resumen-metricas">
            <div className="metrica">
              <span className="metrica-valor">{resultado.consistencia.CR}</span>
              <span className="metrica-label">Razón de consistencia (CR)</span>
            </div>
            <div className="metrica">
              <span className="metrica-valor">{resultado.consistencia.esConsistente ? 'Sí' : 'No'}</span>
              <span className="metrica-label">¿Matriz consistente? (CR ≤ 0.10)</span>
            </div>
            <div className="metrica">
              <span className="metrica-valor">{resultado.resultado.length}</span>
              <span className="metrica-label">Proveedores evaluados</span>
            </div>
          </div>

          <h4>Pesos de criterios (AHP)</h4>
          <ul className="lista-pesos">
            {resultado.pesos.map((p) => (
              <li key={p.criterio}>
                {p.criterio}: <strong>{(p.peso * 100).toFixed(1)}%</strong>
              </li>
            ))}
          </ul>

          <h4>Ranking de proveedores (TOPSIS)</h4>
          <ResponsiveContainer width="100%" height={Math.max(200, resultado.resultado.length * 60)}>
            <BarChart
              data={[...resultado.resultado].sort((a, b) => a.ranking - b.ranking)}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis type="category" dataKey="alternativa" width={180} />
              <Tooltip formatter={(v) => v.toFixed(4)} />
              <Bar dataKey="coeficienteCercania" name="Coeficiente de cercanía (CC*)">
                {resultado.resultado.map((r, idx) => (
                  <Cell key={idx} fill={COLORES_TIER[tierDe(r.coeficienteCercania)]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <table className="tabla">
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Proveedor</th>
                <th>CC* (cercanía al ideal)</th>
              </tr>
            </thead>
            <tbody>
              {[...resultado.resultado]
                .sort((a, b) => a.ranking - b.ranking)
                .map((r) => (
                  <tr key={r.alternativa}>
                    <td>#{r.ranking}</td>
                    <td>{r.alternativa}</td>
                    <td>{r.coeficienteCercania}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
