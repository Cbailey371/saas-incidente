const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('admin_global', 'admin_empresa', 'agente'),
      allowNull: false,
    },
    activo: { // Nuevo campo para activación/desactivación
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });

  // Hook para hashear la contraseña antes de guardar
  Usuario.beforeCreate(async (usuario) => {
    usuario.password = await bcrypt.hash(usuario.password, 10);
  });

  // Método para comparar contraseñas
  Usuario.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return Usuario;
};