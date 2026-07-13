const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');

async function registrar(req, res) {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: 'nombre, correo y password son obligatorios' });
    }
    const existente = await UsuarioModel.obtenerPorCorreo(correo);
    if (existente) {
      return res.status(409).json({ mensaje: 'El correo ya esta registrado' });
    }
    const usuario = await UsuarioModel.crear({ nombre, correo, password });
    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'correo y password son obligatorios' });
    }
    const usuario = await UsuarioModel.obtenerPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas' });
    }
    const passwordValido = await UsuarioModel.verificarPassword(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas' });
    }
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET || 'clave_de_desarrollo',
      { expiresIn: '8h' }
    );
    return res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesion', error: err.message });
  }
}

module.exports = { registrar, login };
