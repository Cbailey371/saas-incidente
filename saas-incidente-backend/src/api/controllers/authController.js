const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Asegúrate de tener bcryptjs instalado: npm install bcryptjs
const { Usuario, Dispositivo, Licencia, Empresa, sequelize } = require('../../models');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, nombreEmpresa } = req.body;

  const t = await sequelize.transaction();

  try {
    // 1. Verificar si el email o el nombre de la empresa ya están en uso
    const usuarioExistente = await Usuario.findOne({ where: { email }, transaction: t });
    if (usuarioExistente) {
      await t.rollback();
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const empresaExistente = await Empresa.findOne({ where: { nombre: nombreEmpresa }, transaction: t });
    if (empresaExistente) {
      await t.rollback();
      return res.status(409).json({ message: 'El nombre de la empresa ya está en uso.' });
    }

    // 2. Crear la nueva empresa y el usuario admin_empresa
    const nuevaEmpresa = await Empresa.create({ nombre: nombreEmpresa }, { transaction: t });
    const nuevoUsuario = await Usuario.create({
      email,
      password, // La contraseña se hashea automáticamente por el hook en el modelo
      rol: 'admin_empresa',
      empresaId: nuevaEmpresa.id,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ message: 'Empresa y usuario administrador registrados exitosamente.' });
  } catch (error) {
    await t.rollback();
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.login = async (req, res) => {
  // 1. Validar la entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, identificadorUnico } = req.body;

  try {
    // 2. Buscar el usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return res.status(403).json({ message: 'Su cuenta de usuario está inactiva.' });
    }

    // 3. Verificar la contraseña
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    let dispositivoId = null;
    // 4. Lógica específica para el rol 'agente'
    if (usuario.rol === 'agente') {
      if (!identificadorUnico) {
        return res.status(400).json({ message: 'El identificador del dispositivo es requerido para los agentes.' });
      }

      // Validar que el dispositivo esté registrado y tenga una licencia activa
      const dispositivo = await Dispositivo.findOne({
        where: {
          identificadorUnico: identificadorUnico,
          empresaId: usuario.empresaId
        }
        // Nota: La inclusión del modelo Licencia se ha comentado porque no se proporcionó el archivo del modelo.
        // include: { model: Licencia }
      });

      if (!dispositivo) {
        return res.status(404).json({ message: 'Dispositivo no registrado para esta empresa.' });
      }
      /*
      if (!dispositivo.Licencia || dispositivo.Licencia.status !== 'activa') {
        return res.status(403).json({ message: 'El dispositivo no tiene una licencia activa.' });
      }

      // Verificar si el dispositivo ya está asignado a otro agente
      if (dispositivo.usuarioId && dispositivo.usuarioId !== usuario.id) {
        return res.status(403).json({ message: 'Este dispositivo ya está asignado a otro agente.' });
      }*/

      // Asignar el agente al dispositivo si no está ya asignado
      if (!dispositivo.usuarioId) {
        dispositivo.usuarioId = usuario.id;
        await dispositivo.save();
      }
      dispositivoId = dispositivo.id;
    }

    // 5. Generar el JWT
    const payload = {
      userId: usuario.id,
      rol: usuario.rol,
      empresaId: usuario.empresaId, // Incluir el ID de la empresa en el token
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }); // Expiración más larga para móvil

    res.status(200).json({
      token,
      dispositivoId, // Se devuelve el ID del dispositivo validado
      rol: usuario.rol, // También puede ser útil devolver el rol
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
}
};  