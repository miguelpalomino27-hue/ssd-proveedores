const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const ctrl = require('../controllers/evaluacionController');

router.post('/calcular', verificarToken, ctrl.calcular);
router.get('/', verificarToken, ctrl.listarMias);
router.get('/:id', verificarToken, ctrl.obtener);

module.exports = router;
