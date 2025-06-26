const express = require('express');
const router = express.Router();

const tipoIncidenteController = require('../controllers/tipoIncidenteController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { crearTipoIncidenteRules, updateTipoIncidenteRules, idParamRules } = require('../validators/tipoIncidenteValidator');

// GET /api/v1/tipos-incidente
// Protegida: para cualquier usuario autenticado (agente o admin)
router.get(
  '/',
  verifyToken,
  tipoIncidenteController.listarTiposIncidentePorEmpresa
);

// POST /api/v1/tipos-incidente - Crear un nuevo tipo de incidente
// Protegida: solo para admin_empresa
router.post(
  '/',
  [verifyToken, checkRole(['admin_empresa']), ...crearTipoIncidenteRules()],
  tipoIncidenteController.crearTipoIncidente
);

// PUT /api/v1/tipos-incidente/:id - Actualizar un tipo de incidente
// Protegida: solo para admin_empresa
router.put(
  '/:id',
  [verifyToken, checkRole(['admin_empresa']), ...idParamRules(), ...updateTipoIncidenteRules()],
  tipoIncidenteController.updateTipoIncidente
);

// PATCH /api/v1/tipos-incidente/:id/toggle-activo - Activar/Desactivar un tipo de incidente
// Protegida: solo para admin_empresa
router.patch(
  '/:id/toggle-activo',
  [verifyToken, checkRole(['admin_empresa']), ...idParamRules()],
  tipoIncidenteController.toggleTipoIncidenteActivo
);

module.exports = router;