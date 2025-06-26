const express = require('express');
const router = express.Router();

const empresaController = require('../controllers/empresaController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { crearEmpresaRules } = require('../validators/empresaValidator'); // Assuming idParamRules is in this file or a common validator
const { idParamRules } = require('../validators/tipoIncidenteValidator'); // Reusing idParamRules from tipoIncidenteValidator

// POST /api/v1/empresas
// Protegida: solo para admin_global
// Valida el cuerpo de la petición antes de llegar al controlador
router.post(
  '/',
  [verifyToken, checkRole(['admin_global']), ...crearEmpresaRules()],
  empresaController.crearEmpresa
);

// PATCH /api/v1/empresas/:id/toggle-activo - Activar/Desactivar una empresa
// Protegida: solo para admin_global
router.patch(
  '/:id/toggle-activo',
  [verifyToken, checkRole(['admin_global']), ...idParamRules()],
  empresaController.toggleEmpresaActiva
);

// GET /api/v1/empresas - Listar todas las empresas
// Protegida: solo para admin_global
router.get(
  '/',
  [verifyToken, checkRole(['admin_global'])],
  empresaController.listarEmpresas
);

module.exports = router;