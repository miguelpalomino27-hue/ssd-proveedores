const { pool } = require('../config/db');

const EvaluacionModel = {
  async crear({ usuario_id, titulo, criterios, matriz_ahp, matriz_decision, pesos, consistencia, resultado }) {
    const [res] = await pool.query(
      `INSERT INTO evaluaciones
        (usuario_id, titulo, criterios_json, matriz_ahp_json, matriz_decision_json, pesos_json, consistencia_json, resultado_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario_id,
        titulo,
        JSON.stringify(criterios),
        JSON.stringify(matriz_ahp),
        JSON.stringify(matriz_decision),
        JSON.stringify(pesos),
        JSON.stringify(consistencia),
        JSON.stringify(resultado),
      ]
    );
    return this.obtenerPorId(res.insertId);
  },

  async obtenerPorId(id) {
    const [filas] = await pool.query('SELECT * FROM evaluaciones WHERE id = ?', [id]);
    if (!filas[0]) return null;
    return this._parsear(filas[0]);
  },

  async listarPorUsuario(usuario_id) {
    const [filas] = await pool.query(
      'SELECT id, titulo, creado_en FROM evaluaciones WHERE usuario_id = ? ORDER BY creado_en DESC',
      [usuario_id]
    );
    return filas;
  },

  // mysql2 deserializa automaticamente las columnas de tipo JSON en
  // objetos JS (a diferencia de columnas TEXT), por lo que no deben
  // volver a parsearse con JSON.parse. Este helper soporta ambos casos
  // por robustez ante cambios de driver o de tipo de columna.
  _campoJson(valor) {
    return typeof valor === 'string' ? JSON.parse(valor) : valor;
  },

  _parsear(fila) {
    return {
      id: fila.id,
      titulo: fila.titulo,
      criterios: this._campoJson(fila.criterios_json),
      matrizAhp: this._campoJson(fila.matriz_ahp_json),
      matrizDecision: this._campoJson(fila.matriz_decision_json),
      pesos: this._campoJson(fila.pesos_json),
      consistencia: this._campoJson(fila.consistencia_json),
      resultado: this._campoJson(fila.resultado_json),
      creadoEn: fila.creado_en,
    };
  },
};

module.exports = EvaluacionModel;
