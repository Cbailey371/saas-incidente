const { validationResult } = require('express-validator');
const { Empresa, Usuario, Licencia, sequelize } = require('../../models');

exports.crearEmpresa = async (req, res) => {
  // 1. Validar la entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, adminEmail, adminPassword } = req.body;
  const t = await sequelize.transaction(); // 2. Iniciar transacción

  try {
    // 3. Verificar si la empresa o el email ya existen
    const empresaExistente = await Empresa.findOne({ where: { nombre } });
    if (empresaExistente) {
      return res.status(409).json({ message: 'Ya existe una empresa con ese nombre.' });
    }

    const emailExistente = await Usuario.findOne({ where: { email: adminEmail } });
    if (emailExistente) {
      return res.status(409).json({ message: 'El email del administrador ya está en uso.' });
    }

    // 4. Crear la empresa
    const nuevaEmpresa = await Empresa.create({
      nombre,
    }, { transaction: t });

    // 5. Crear el usuario administrador para esa empresa
    const adminUsuario = await Usuario.create({
      email: adminEmail,
      password: adminPassword,
      rol: 'admin_empresa',
      empresaId: nuevaEmpresa.id, // Asociar con la empresa recién creada
    }, { transaction: t });

    // 6. Si todo fue bien, confirmar la transacción
    await t.commit();

    // Ocultar la contraseña en la respuesta
    const adminUsuarioData = adminUsuario.toJSON();
    delete adminUsuarioData.password;

    res.status(201).json({
      message: 'Empresa y administrador creados exitosamente.',
      empresa: nuevaEmpresa,
      administrador: adminUsuarioData,
    });

  } catch (error) {
    // 7. Si algo falla, revertir la transacción
    await t.rollback();
    console.error('Error al crear empresa:', error);
    res.status(500).json({
      message: 'Error interno del servidor al crear la empresa.',
      error: error.message
    });
  }
};

exports.toggleEmpresaActiva = async (req, res) => {
  const errors = validationResult(req); // Para la validación del parámetro ID
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params; // ID de la empresa a activar/desactivar
  // No necesitamos el empresaId del token aquí, ya que es el admin_global

  const t = await sequelize.transaction();

  try {
    // 1. Buscar la empresa
    const empresa = await Empresa.findByPk(id, { transaction: t });

    if (!empresa) {
      await t.rollback();
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    // 2. Cambiar el estado 'activa' de la empresa
    empresa.activa = !empresa.activa;
    await empresa.save({ transaction: t });

    // 3. Desactivar/Activar todos los usuarios de esa empresa
    await Usuario.update(
      { activo: empresa.activa },
      { where: { empresaId: id }, transaction: t }
    );

    // 4. Desactivar/Activar todas las licencias de esa empresa
    // Si la empresa se desactiva, las licencias pasan a 'inactiva'.
    // Si la empresa se activa, las licencias disponibles vuelven a 'disponible',
    // y las activas se mantienen 'activa' (o se podrían revisar si el dispositivo sigue asignado).
    // Por simplicidad, si se desactiva la empresa, todas las licencias pasan a 'inactiva'.
    // Si se activa la empresa, las licencias 'inactiva' vuelven a 'disponible' si no tienen dispositivo asignado.
    const newLicenseStatus = empresa.activa ? 'disponible' : 'inactiva';
    await Licencia.update(
      { status: newLicenseStatus },
      { where: { empresaId: id, dispositivoId: null }, transaction: t } // Solo licencias no asignadas
    );
    // Las licencias activas que tienen un dispositivo asignado, se mantienen activas si la empresa se reactiva.
    // Si la empresa se desactiva, todas las licencias activas también se marcan como inactivas.
    if (!empresa.activa) {
        await Licencia.update({ status: 'inactiva' }, { where: { empresaId: id, dispositivoId: { [sequelize.Op.ne]: null } }, transaction: t });
    }

    // 5. Confirmar la transacción
    await t.commit();

    res.status(200).json({
      message: `Empresa "${empresa.nombre}" y sus recursos ${empresa.activa ? 'activados' : 'desactivados'} exitosamente.`,
      empresa: empresa,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al cambiar estado de empresa:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.listarEmpresas = async (req, res) => {
  // No se necesita empresaId del token, ya que el admin_global ve todas

  try {
    const empresas = await Empresa.findAll({
      attributes: ['id', 'nombre', 'activa'], // Solo los datos necesarios
      order: [['nombre', 'ASC']], // Ordenar por nombre para mejor visualización
    });

    res.status(200).json({
      message: 'Lista de empresas obtenida exitosamente.',
      empresas: empresas,
    });

  } catch (error) {
    console.error('Error al listar empresas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};