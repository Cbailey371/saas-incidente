const express = require('express');
const router = express.Router();
const tipoIncidenteController = require('../controllers/tipoIncidenteController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas de ejemplo, la lógica real se implementará más adelante
router.get('/', [verifyToken, checkRole(['admin_empresa'])], tipoIncidenteController.placeholder);
router.post('/', [verifyToken, checkRole(['admin_empresa'])], tipoIncidenteController.placeholder);

module.exports = router;