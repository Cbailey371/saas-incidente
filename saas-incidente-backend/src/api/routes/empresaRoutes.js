const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// GET /api/v1/empresas - Listar todas las empresas
router.get('/', [verifyToken, checkRole(['admin_global'])], empresaController.listarEmpresas);

// PATCH /api/v1/empresas/:id/toggle-activo - Activar/desactivar una empresa
router.patch('/:id/toggle-activo', [verifyToken, checkRole(['admin_global'])], empresaController.toggleEmpresaActiva);

module.exports = router;