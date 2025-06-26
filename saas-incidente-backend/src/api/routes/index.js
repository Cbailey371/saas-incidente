
const authRoutes = require('./authRoutes');
const empresaRoutes = require('./empresaRoutes');
const dispositivoRoutes = require('./dispositivoRoutes');
const tipoIncidenteRoutes = require('./tipoIncidenteRoutes');
const licenciaRoutes = require('./licenciaRoutes');
const incidenteRoutes = require('./incidenteRoutes');
// ... otros enrutadores

router.use('/auth', authRoutes);
router.use('/empresas', empresaRoutes);
router.use('/dispositivos', dispositivoRoutes);
// ...
router.use('/licencias', licenciaRoutes);
router.use('/incidentes', incidenteRoutes);
router.use('/tipos-incidente', tipoIncidenteRoutes);
// ... otros enrutadores

module.exports = router;


