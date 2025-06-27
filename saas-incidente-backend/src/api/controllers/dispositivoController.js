const { validationResult } = require('express-validator');
const { Dispositivo, Licencia, Usuario, sequelize } = require('../../models');

exports.registrarDispositivo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, identificadorUnico, modelo, plataforma } = req.body;
  // Obtenemos el empresaId del token del usuario autenticado (admin_empresa)
  const { empresaId } = req.user;

  const t = await sequelize.transaction();

  try {
    // 1. Buscar una licencia disponible para esta empresa.
    // Usamos un bloqueo para evitar que dos peticiones tomen la misma licencia (race condition).
    const licenciaDisponible = await Licencia.findOne({
      where: { empresaId: empresaId, status: 'disponible' },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!licenciaDisponible) {
      await t.rollback();
      return res.status(400).json({ message: 'No hay licencias disponibles para su empresa.' });
    }

    // 2. Crear el nuevo dispositivo.
    const nuevoDispositivo = await Dispositivo.create({
      nombre,
      identificadorUnico,
      modelo,
      plataforma,
      empresaId,
    }, { transaction: t });

    // 3. Asignar la licencia al dispositivo y actualizar su estado.
    licenciaDisponible.status = 'activa';
    licenciaDisponible.fechaActivacion = new Date();
    licenciaDisponible.dispositivoId = nuevoDispositivo.id;
    await licenciaDisponible.save({ transaction: t });

    // 4. Si todo va bien, confirmar la transacción.
    await t.commit();

    res.status(201).json({
      message: 'Dispositivo registrado y licencia activada exitosamente.',
      dispositivo: nuevoDispositivo,
      licencia: licenciaDisponible,
    });

  } catch (error) {
    await t.rollback();
    // Manejar error de unicidad (dispositivo ya existe)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un dispositivo con ese identificador único en su empresa.' });
    }
    console.error('Error al registrar dispositivo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.assignAgentToDevice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id: dispositivoId } = req.params; // ID del dispositivo a modificar
  const { usuarioId } = req.body; // ID del usuario a asignar (puede ser null para desasignar)
  const { empresaId } = req.user; // ID de la empresa del admin_empresa autenticado

  const t = await sequelize.transaction();

  try {
    // 1. Verificar que el dispositivo exista y pertenezca a la empresa del admin
    const dispositivo = await Dispositivo.findOne({
      where: { id: dispositivoId, empresaId },
      transaction: t,
    });

    if (!dispositivo) {
      await t.rollback();
      return res.status(404).json({ message: 'Dispositivo no encontrado o no pertenece a su empresa.' });
    }

    // 2. Si se está asignando un usuario (usuarioId no es null)
    if (usuarioId) {
      // 2.1. Verificar que el usuario exista, pertenezca a la empresa y sea un 'agente'
      const agente = await Usuario.findOne({
        where: { id: usuarioId, empresaId, rol: 'agente' },
        transaction: t,
      });

      if (!agente) {
        await t.rollback();
        return res.status(404).json({ message: 'Usuario no encontrado, no pertenece a su empresa o no es un agente.' });
      }

      // 2.2. Verificar si el agente ya está asignado a otro dispositivo
      const dispositivoYaAsignado = await Dispositivo.findOne({
        where: { usuarioId, empresaId, id: { [sequelize.Op.ne]: dispositivoId } },
        transaction: t,
      });

      if (dispositivoYaAsignado) {
        await t.rollback();
        return res.status(409).json({ message: `El agente ya está asignado al dispositivo "${dispositivoYaAsignado.nombre}".` });
      }

      // 2.3. Asignar el agente al dispositivo
      dispositivo.usuarioId = usuarioId;
      await dispositivo.save({ transaction: t });
      res.status(200).json({ message: `Agente ${agente.email} asignado a ${dispositivo.nombre} exitosamente.`, dispositivo });

    } else { // 3. Si se está desasignando un usuario (usuarioId es null)
      dispositivo.usuarioId = null;
      await dispositivo.save({ transaction: t });
      res.status(200).json({ message: `Agente desasignado de ${dispositivo.nombre} exitosamente.`, dispositivo });
    }

    await t.commit();

  } catch (error) {
    await t.rollback();
    console.error('Error al asignar/desasignar agente a dispositivo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.listarDispositivosPorEmpresa = async (req, res) => {
  const { empresaId } = req.user; // Obtenido del token

  try {
    const dispositivos = await Dispositivo.findAll({
      where: { empresaId },
      attributes: ['id', 'nombre', 'identificadorUnico', 'usuarioId'],
      order: [['nombre', 'ASC']],
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['email'],
        required: false
      }]
    });

    res.status(200).json(dispositivos);
  } catch (error) {
    console.error('Error al listar dispositivos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};