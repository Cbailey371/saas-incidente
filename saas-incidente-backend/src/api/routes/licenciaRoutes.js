const express = require('express');
const router = express.Router();

const licenciaController = require('../controllers/licenciaController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { crearLoteRules } = require('../validators/licenciaValidator');

// POST /api/v1/licencias/lote - Crear un lote de licencias para una empresa
// Protegida: solo para admin_global
router.post(
  '/lote',
  [verifyToken, checkRole(['admin_global']), ...crearLoteRules()],
  licenciaController.crearLoteLicencias
);

// GET /api/v1/licencias/summary - Obtener resumen de licencias por empresa
// Protegida: solo para admin_global
router.get(
  '/summary',
  [verifyToken, checkRole(['admin_global'])],
  licenciaController.getLicenciasSummaryByEmpresa
);

module.exports = router;