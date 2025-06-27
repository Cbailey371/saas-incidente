const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define('Empresa', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // El nombre de la empresa debería ser único
    },
    // Puedes añadir más campos aquí según tus necesidades (ej: direccion, telefono, etc.)
  }, {
    // Opciones del modelo
    tableName: 'Empresas', // Nombre de la tabla en la base de datos (por convención, plural)
    timestamps: true, // Para que Sequelize añada createdAt y updatedAt
  });

  Empresa.associate = (models) => {
    // Una empresa puede tener muchos dispositivos
    Empresa.hasMany(models.Dispositivo, {
      foreignKey: 'empresaId',
      as: 'dispositivos', // Alias para la relación
    });
    // Si tienes otros modelos asociados a Empresa (ej: Usuarios), añádelos aquí
    // Empresa.hasMany(models.Usuario, { foreignKey: 'empresaId', as: 'usuarios' });
  };

  return Empresa;
};