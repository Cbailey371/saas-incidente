const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const empresaRoutes = require('./empresaRoutes');
const dispositivoRoutes = require('./dispositivoRoutes');
const licenciaRoutes = require('./licenciaRoutes');
const tipoIncidenteRoutes = require('./tipoIncidenteRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const incidenteRoutes = require('./incidenteRoutes');

router.use('/auth', authRoutes);
router.use('/empresas', empresaRoutes);
router.use('/dispositivos', dispositivoRoutes);
router.use('/licencias', licenciaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/incidentes', incidenteRoutes);
router.use('/tipos-incidente', tipoIncidenteRoutes);

module.exports = router;