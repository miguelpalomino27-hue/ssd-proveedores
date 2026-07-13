const ProveedorModel = require('../models/proveedorModel');

async function listar(req, res) {
  try {
    const proveedores = await ProveedorModel.listarTodos();
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al listar proveedores', error: err.message });
  }
}

async function obtener(req, res) {
  try {
    const proveedor = await ProveedorModel.obtenerPorId(req.params.id);
    if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener proveedor', error: err.message });
  }
}

async function crear(req, res) {
  try {
    const { razon_social, ruc } = req.body;
    if (!razon_social || !ruc) {
      return res.status(400).json({ mensaje: 'razon_social y ruc son obligatorios' });
    }
    if (!/^\d{11}$/.test(ruc)) {
      return res.status(400).json({ mensaje: 'El RUC debe tener 11 digitos' });
    }
    const nuevo = await ProveedorModel.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear proveedor', error: err.message });
  }
}

async function actualizar(req, res) {
  try {
    const existente = await ProveedorModel.obtenerPorId(req.params.id);
    if (!existente) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    const actualizado = await ProveedorModel.actualizar(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar proveedor', error: err.message });
  }
}

async function eliminar(req, res) {
  try {
    const eliminado = await ProveedorModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    res.json({ mensaje: 'Proveedor desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar proveedor', error: err.message });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
