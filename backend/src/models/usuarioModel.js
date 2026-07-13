const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const UsuarioModel = {
  async obtenerPorCorreo(correo) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0] || null;
  },

  async crear({ nombre, correo, password, rol = 'analista' }) {
    const hash = await bcrypt.hash(password, 10);
    const [res] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, rol]
    );
    return { id: res.insertId, nombre, correo, rol };
  },

  async verificarPassword(passwordPlano, hash) {
    return bcrypt.compare(passwordPlano, hash);
  },
};

module.exports = UsuarioModel;
