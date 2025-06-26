const { validationResult } = require('express-validator');
const { Usuario, sequelize } = require('../../models');

exports.registrarUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, rol } = req.body;
  const { empresaId } = req.user; // ID de la empresa del admin_empresa autenticado

  try {
    // 1. Validar que el rol solicitado sea permitido para un admin_empresa
    if (rol === 'admin_global') {
      return res.status(403).json({ message: 'No tiene permisos para crear usuarios con el rol "admin_global".' });
    }

    // 2. Verificar si el email ya está en uso
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    // 3. Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      email,
      password, // La contraseña se hashea automáticamente por el hook en el modelo Usuario
      rol,
      empresaId, // Asociar el usuario con la empresa del admin_empresa
    });

    // Ocultar la contraseña en la respuesta
    const usuarioData = nuevoUsuario.toJSON();
    delete usuarioData.password;

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: usuarioData,
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.listarUsuariosPorEmpresa = async (req, res) => {
  const { empresaId } = req.user; // ID de la empresa del admin_empresa autenticado

  // Paginación (opcional, pero buena práctica)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Usuario.findAndCountAll({
      where: { empresaId },
      attributes: ['id', 'email', 'rol', 'activo'], // No devolver la contraseña
      limit,
      offset,
      order: [['email', 'ASC']],
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      usuarios: rows,
    });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.updateUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params; // ID del usuario a actualizar
  const { email, rol, activo } = req.body;
  const { empresaId } = req.user; // ID de la empresa del admin_empresa autenticado

  try {
    // 1. Buscar el usuario y verificar que pertenezca a la empresa del admin
    const usuario = await Usuario.findOne({
      where: { id, empresaId }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado o no pertenece a su empresa.' });
    }

    // 2. Validar que el rol solicitado sea permitido para un admin_empresa
    if (rol === 'admin_global') {
      return res.status(403).json({ message: 'No tiene permisos para asignar el rol "admin_global".' });
    }

    // 3. Verificar si el nuevo email ya está en uso por otro usuario de la misma empresa
    const emailExistente = await Usuario.findOne({
      where: {
        email,
        empresaId,
        id: { [sequelize.Op.ne]: id } // Excluir el propio usuario que estamos actualizando
      }
    });

    if (emailExistente) {
      return res.status(409).json({ message: 'El email ya está en uso por otro usuario de su empresa.' });
    }

    // 4. Actualizar los datos del usuario
    usuario.email = email;
    usuario.rol = rol;
    usuario.activo = activo;
    await usuario.save();

    // Ocultar la contraseña en la respuesta
    const usuarioData = usuario.toJSON();
    delete usuarioData.password;

    res.status(200).json({
      message: 'Usuario actualizado exitosamente.',
      usuario: usuarioData,
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.toggleUsuarioActivo = async (req, res) => {
  const errors = validationResult(req); // Para la validación del parámetro ID
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { empresaId } = req.user; // Obtenido del JWT

  try {
    const usuario = await Usuario.findOne({ where: { id, empresaId } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado o no pertenece a su empresa.' });
    }

    // No permitir que un admin_empresa se desactive a sí mismo (o a otro admin_empresa si es el único)
    // Esta lógica puede ser más compleja, por ahora, solo se desactiva el campo 'activo'
    usuario.activo = !usuario.activo;
    await usuario.save();

    const usuarioData = usuario.toJSON();
    delete usuarioData.password;

    res.status(200).json({
      message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente.`,
      usuario: usuarioData,
    });

  } catch (error) {
    console.error('Error al cambiar estado de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};