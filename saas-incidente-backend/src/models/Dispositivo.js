const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    modelo: { type: DataTypes.STRING },
    plataforma: {
      type: DataTypes.ENUM('Android', 'iOS', 'Web', 'Otro'),
      allowNull: false,
    },
    usuarioId: { type: DataTypes.UUID, allowNull: true }, // ID del usuario (agente) asignado
  }, {
    // Asegura que un identificador de dispositivo sea único por empresa
    indexes: [{ unique: true, fields: ['identificadorUnico', 'empresaId'] }]
  });

  return Dispositivo;
};