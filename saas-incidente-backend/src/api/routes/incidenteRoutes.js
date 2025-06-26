const express = require('express');
const router = express.Router();

const incidenteController = require('../controllers/incidenteController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { crearIncidenteRules } = require('../validators/incidenteValidator');

// GET /api/v1/incidentes - Listar incidentes para la empresa del admin
// Protegida: solo para admin_empresa
router.get(
  '/',
  [verifyToken, checkRole(['admin_empresa'])],
  incidenteController.listarIncidentesPorEmpresa
);

// POST /api/v1/incidentes
// Protegida: solo para agentes.
// Usa multer para procesar un único archivo del campo 'media'.
router.post(
  '/',
  [verifyToken, checkRole(['agente'])],
  upload.single('media'), // Middleware de Multer para la subida de archivos
  crearIncidenteRules(),
  incidenteController.crearIncidente
);

// GET /api/v1/incidentes/export - Exportar incidentes a CSV
// Protegida: solo para admin_empresa
router.get(
  '/export',
  [verifyToken, checkRole(['admin_empresa'])],
  incidenteController.exportarIncidentesPorEmpresa
);

module.exports = router;