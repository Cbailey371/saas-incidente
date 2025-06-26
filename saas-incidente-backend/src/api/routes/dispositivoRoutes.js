const express = require('express');
const router = express.Router();

const dispositivoController = require('../controllers/dispositivoController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { registrarDispositivoRules, assignAgentToDeviceRules } = require('../validators/dispositivoValidator');

// POST /api/v1/dispositivos - Registrar un nuevo dispositivo
// Protegida: solo para admin_empresa
router.post(
  '/',
  [verifyToken, checkRole(['admin_empresa']), ...registrarDispositivoRules()],
  dispositivoController.registrarDispositivo
);

// GET /api/v1/dispositivos - Listar dispositivos para la empresa del admin
// Protegida: solo para admin_empresa
router.get(
  '/',
  [verifyToken, checkRole(['admin_empresa'])],
  dispositivoController.listarDispositivosPorEmpresa
);

// PATCH /api/v1/dispositivos/:id/assign-agent - Asignar/Desasignar un agente a un dispositivo
// Protegida: solo para admin_empresa
router.patch(
  '/:id/assign-agent',
  [verifyToken, checkRole(['admin_empresa']), ...assignAgentToDeviceRules()],
  dispositivoController.assignAgentToDevice
);

module.exports = router;