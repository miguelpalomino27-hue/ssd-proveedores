const { pool } = require('../config/db');

const ProveedorModel = {
  async listarTodos() {
    const [filas] = await pool.query(
      'SELECT id, razon_social, ruc, rubro, telefono, activo, creado_en FROM proveedores WHERE activo = 1 ORDER BY id DESC'
    );
    return filas;
  },

  async obtenerPorId(id) {
    const [filas] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    return filas[0] || null;
  },

  async crear({ razon_social, ruc, rubro, telefono, direccion }) {
    const [resultado] = await pool.query(
      'INSERT INTO proveedores (razon_social, ruc, rubro, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
      [razon_social, ruc, rubro, telefono, direccion]
    );
    return this.obtenerPorId(resultado.insertId);
  },

  async actualizar(id, { razon_social, ruc, rubro, telefono, direccion }) {
    await pool.query(
      'UPDATE proveedores SET razon_social = ?, ruc = ?, rubro = ?, telefono = ?, direccion = ? WHERE id = ?',
      [razon_social, ruc, rubro, telefono, direccion, id]
    );
    return this.obtenerPorId(id);
  },

  // Borrado logico (no elimina el registro, coherente con el enfoque del
  // proyecto de referencia del curso IS-489)
  async eliminar(id) {
    const [resultado] = await pool.query('UPDATE proveedores SET activo = 0 WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },
};

module.exports = ProveedorModel;
