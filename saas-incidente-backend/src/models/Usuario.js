const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
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
    // Nueva columna para asociar el usuario a una empresa
    empresaId: {
      type: DataTypes.UUID,
      allowNull: true, // Permite NULL para roles como 'admin_global'
      references: {
        model: 'Empresas', // Asegúrate de que 'Empresas' sea el nombre de la tabla de tu modelo Empresa
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Si la empresa se elimina, el usuario queda sin empresa (o puedes usar CASCADE si prefieres eliminar el usuario)
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

  Usuario.associate = (models) => {
    // Un usuario puede pertenecer a una empresa
    Usuario.belongsTo(models.Empresa, { foreignKey: 'empresaId' });
    // Un usuario (agente) puede tener muchos dispositivos asignados
    Usuario.hasMany(models.Dispositivo, { foreignKey: 'usuarioId', as: 'dispositivos' });
    // Un usuario (agente) puede crear muchos incidentes
    Usuario.hasMany(models.Incidente, { foreignKey: 'usuarioId', as: 'incidentes' });
  };

  return Usuario;
};