const express = require('express');
const router = express.Router();
// const { verificarToken } = require('../middleware/auth'); ❌ desactivado
const ctrl = require('../controllers/proveedorController');

// ❌ router.use(verificarToken);  ← ELIMINADO

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;