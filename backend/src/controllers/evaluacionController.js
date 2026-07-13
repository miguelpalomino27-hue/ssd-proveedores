const { ejecutarAHP } = require('../services/ahp');
const { ejecutarTOPSIS } = require('../services/topsis');
const EvaluacionModel = require('../models/evaluacionModel');

/**
 * POST /api/evaluaciones/calcular
 * Cuerpo esperado:
 * {
 *   titulo: string,
 *   criterios: [{ nombre, tipo: 'beneficio'|'costo' }, ...],
 *   matrizAhp: number[][],           // comparacion por pares entre criterios
 *   proveedores: [{ nombre, valores: number[] }, ...]  // matriz de decision
 *   guardar: boolean                 // si true, persiste el resultado
 * }
 */
async function calcular(req, res) {
  try {
    const { titulo, criterios, matrizAhp, proveedores, guardar } = req.body;

    if (!Array.isArray(criterios) || criterios.length < 2) {
      return res.status(400).json({ mensaje: 'Se requieren al menos 2 criterios' });
    }
    if (!Array.isArray(proveedores) || proveedores.length < 2) {
      return res.status(400).json({ mensaje: 'Se requieren al menos 2 proveedores a comparar' });
    }

    const nombresCriterios = criterios.map((c) => c.nombre);
    const tipos = criterios.map((c) => c.tipo);

    // 1. AHP: pesos de criterios + consistencia
    const { pesos: pesosDetallados, consistencia } = ejecutarAHP(matrizAhp, nombresCriterios);

    if (!consistencia.esConsistente) {
      return res.status(422).json({
        mensaje:
          `La matriz de comparacion por pares es inconsistente (CR = ${consistencia.CR}, ` +
          'debe ser <= 0.10). Revise los juicios de comparacion antes de continuar.',
        consistencia,
      });
    }

    const pesos = pesosDetallados.map((p) => p.peso);

    // 2. TOPSIS: ranking de proveedores
    const matrizDecision = proveedores.map((p) => p.valores);
    const nombresProveedores = proveedores.map((p) => p.nombre);
    const resultado = ejecutarTOPSIS(matrizDecision, pesos, tipos, nombresProveedores);

    const respuesta = {
      titulo: titulo || 'Evaluacion sin titulo',
      criterios,
      pesos: pesosDetallados,
      consistencia,
      resultado,
    };

    if (guardar) {
      const usuarioId = req.usuario ? req.usuario.id : null;
      const guardada = await EvaluacionModel.crear({
        usuario_id: usuarioId,
        titulo: respuesta.titulo,
        criterios,
        matriz_ahp: matrizAhp,
        matriz_decision: matrizDecision,
        pesos: pesosDetallados,
        consistencia,
        resultado,
      });
      respuesta.id = guardada.id;
    }

    res.json(respuesta);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al calcular la evaluacion', error: err.message });
  }
}

async function listarMias(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const evaluaciones = await EvaluacionModel.listarPorUsuario(usuarioId);
    res.json(evaluaciones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al listar evaluaciones', error: err.message });
  }
}

async function obtener(req, res) {
  try {
    const evaluacion = await EvaluacionModel.obtenerPorId(req.params.id);
    if (!evaluacion) return res.status(404).json({ mensaje: 'Evaluacion no encontrada' });
    res.json(evaluacion);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener evaluacion', error: err.message });
  }
}

module.exports = { calcular, listarMias, obtener };
