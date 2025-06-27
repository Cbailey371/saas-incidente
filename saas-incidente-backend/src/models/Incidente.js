const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Incidente = sequelize.define('Incidente', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('abierto', 'en_proceso', 'resuelto', 'cerrado'),
      defaultValue: 'abierto',
      allowNull: false,
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta', 'critica'),
      defaultValue: 'media',
      allowNull: false,
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Foreign Keys
    usuarioId: { // El agente que reporta
      type: DataTypes.UUID,
      allowNull: false,
    },
    dispositivoId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    empresaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tipoIncidenteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    tableName: 'Incidentes',
    timestamps: true,
  });

  Incidente.associate = (models) => {
    Incidente.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'agente' });
    Incidente.belongsTo(models.Dispositivo, { foreignKey: 'dispositivoId', as: 'dispositivo' });
    Incidente.belongsTo(models.Empresa, { foreignKey: 'empresaId' });
    Incidente.belongsTo(models.TipoIncidente, { foreignKey: 'tipoIncidenteId', as: 'tipo' });
  };

  return Incidente;
};