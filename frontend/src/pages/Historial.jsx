import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Historial() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    api.get('/evaluaciones').then(({ data }) => setEvaluaciones(data));
  }, []);

  async function verDetalle(id) {
    const { data } = await api.get(`/evaluaciones/${id}`);
    setDetalle(data);
  }

  return (
    <div>
      <h2>Historial de evaluaciones</h2>
      <table className="tabla">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((e) => (
            <tr key={e.id}>
              <td>{e.titulo}</td>
              <td>{new Date(e.creado_en).toLocaleString('es-PE')}</td>
              <td>
                <button className="link-btn" onClick={() => verDetalle(e.id)}>Ver detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalle && (
        <div className="resultado-card">
          <h3>{detalle.titulo}</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Proveedor</th>
                <th>CC*</th>
              </tr>
            </thead>
            <tbody>
              {[...detalle.resultado]
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
