const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Dispositivo = sequelize.define('Dispositivo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identificadorUnico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plataforma: {
      type: DataTypes.ENUM('Android', 'iOS', 'Web', 'Otro'),
      allowNull: false,
    },
    usuarioId: { type: DataTypes.UUID, allowNull: true }, // ID del usuario (agente) asignado
    empresaId: {
      type: DataTypes.UUID,
      allowNull: false, // Un dispositivo debe pertenecer a una empresa
      references: {
        model: 'Empresas', // Asegúrate de que 'Empresas' sea el nombre de la tabla de tu modelo Empresa
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    // Asegura que un identificador de dispositivo sea único por empresa
    indexes: [{ unique: true, fields: ['identificadorUnico', 'empresaId'] }]
  });

  Dispositivo.associate = (models) => {
    // Asociación con el modelo Empresa
    Dispositivo.belongsTo(models.Empresa, { foreignKey: 'empresaId' });
    // Un dispositivo puede ser asignado a un usuario (agente)
    Dispositivo.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'agente' });
    // Un dispositivo puede tener muchos incidentes
    Dispositivo.hasMany(models.Incidente, { foreignKey: 'dispositivoId', as: 'incidentes' });
  };

  return Dispositivo;
};