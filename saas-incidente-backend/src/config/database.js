);

module.exports = sequelize;

const sequelize = require('../config/database');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

// Cargar modelos
db.Empresa = require('./Empresa')(sequelize, db.Sequelize);
db.Usuario = require('./Usuario')(sequelize, db.Sequelize);
// ... cargar otros modelos aquí

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

// ... definir otras asociaciones aquí

module.exports = db;
