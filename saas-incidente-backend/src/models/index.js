const sequelize = require('../config/database');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

// Cargar modelos
db.Empresa = require('./Empresa')(sequelize, db.Sequelize);
db.Usuario = require('./Usuario')(sequelize, db.Sequelize);
db.Dispositivo = require('./Dispositivo')(sequelize, db.Sequelize);
db.Licencia = require('./Licencia')(sequelize, db.Sequelize);
db.TipoIncidente = require('./TipoIncidente')(sequelize, db.Sequelize);
db.Incidente = require('./Incidente')(sequelize, db.Sequelize);
db.ArchivoMultimedia = require('./ArchivoMultimedia')(sequelize, db.Sequelize);

// Definir asociaciones
// Una Empresa tiene muchos Usuarios
db.Empresa.hasMany(db.Usuario, {
  foreignKey: {
    name: 'empresaId',
    allowNull: false // Un usuario siempre debe pertenecer a una empresa
  }
});
// Un Usuario pertenece a una Empresa
db.Usuario.belongsTo(db.Empresa, {
  foreignKey: 'empresaId'
});

// Una Empresa tiene muchos Dispositivos
db.Empresa.hasMany(db.Dispositivo, { foreignKey: 'empresaId', allowNull: false });
db.Dispositivo.belongsTo(db.Empresa, { foreignKey: 'empresaId' });

// Una Empresa tiene muchas Licencias
db.Empresa.hasMany(db.Licencia, { foreignKey: 'empresaId', allowNull: false });
db.Licencia.belongsTo(db.Empresa, { foreignKey: 'empresaId' });

// Un Dispositivo tiene una Licencia (Relación 1 a 1)
db.Dispositivo.hasOne(db.Licencia, {
  foreignKey: 'dispositivoId',
  allowNull: true // La licencia no tiene dispositivo al principio
});
db.Licencia.belongsTo(db.Dispositivo, { foreignKey: 'dispositivoId' });

// Un Dispositivo puede tener un Usuario asignado (agente)
db.Dispositivo.belongsTo(db.Usuario, { foreignKey: 'usuarioId', as: 'usuarioAsignado' });
db.Usuario.hasOne(db.Dispositivo, { foreignKey: 'usuarioId', as: 'dispositivoAsignado' }); // Un usuario solo puede estar asignado a un dispositivo

// Una Empresa puede definir muchos Tipos de Incidente
db.Empresa.hasMany(db.TipoIncidente, { foreignKey: 'empresaId', allowNull: false });
db.TipoIncidente.belongsTo(db.Empresa, { foreignKey: 'empresaId' });

// Asociaciones del Incidente
db.Incidente.belongsTo(db.Usuario, { as: 'reportadoPor', foreignKey: 'usuarioId', allowNull: false });
db.Usuario.hasMany(db.Incidente, { foreignKey: 'usuarioId' });

db.Incidente.belongsTo(db.Empresa, { foreignKey: 'empresaId', allowNull: false });
db.Empresa.hasMany(db.Incidente, { foreignKey: 'empresaId' });

db.Incidente.belongsTo(db.Dispositivo, { foreignKey: 'dispositivoId', allowNull: false });
db.Dispositivo.hasMany(db.Incidente, { foreignKey: 'dispositivoId' });

db.Incidente.belongsTo(db.TipoIncidente, { foreignKey: 'tipoIncidenteId', allowNull: false });
db.TipoIncidente.hasMany(db.Incidente, { foreignKey: 'tipoIncidenteId' });

// Un Incidente tiene muchos Archivos Multimedia
db.Incidente.hasMany(db.ArchivoMultimedia, {
  foreignKey: 'incidenteId',
  allowNull: false,
  onDelete: 'CASCADE' // Si se borra un incidente, se borran sus archivos
});
db.ArchivoMultimedia.belongsTo(db.Incidente, { foreignKey: 'incidenteId' });

module.exports = db;