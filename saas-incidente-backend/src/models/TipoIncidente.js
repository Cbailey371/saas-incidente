const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoIncidente = sequelize.define('TipoIncidente', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: { // Nuevo campo para activación/desactivación
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    // empresaId se añade a través de las asociaciones
  });
  return TipoIncidente;
};