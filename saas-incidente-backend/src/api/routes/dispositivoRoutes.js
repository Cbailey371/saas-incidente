const express = require('express');
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { registrarDispositivoRules, assignAgentRules } = require('../validators/dispositivoValidator');

// POST /api/v1/dispositivos/registrar - Registrar un nuevo dispositivo
router.post('/registrar', [verifyToken, checkRole(['admin_empresa']), ...registrarDispositivoRules()], dispositivoController.registrarDispositivo);

// GET /api/v1/dispositivos - Listar dispositivos de la empresa
router.get('/', [verifyToken, checkRole(['admin_empresa'])], dispositivoController.listarDispositivosPorEmpresa);

// PATCH /api/v1/dispositivos/:id/assign-agent - Asignar un agente a un dispositivo
router.patch('/:id/assign-agent', [verifyToken, checkRole(['admin_empresa']), ...assignAgentRules()], dispositivoController.assignAgentToDevice);

module.exports = router;