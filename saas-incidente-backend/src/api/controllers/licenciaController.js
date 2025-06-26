const { validationResult } = require('express-validator');
const { Licencia, Empresa, sequelize, Dispositivo } = require('../../models');
const crypto = require('crypto');

exports.crearLoteLicencias = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { empresaId, cantidad } = req.body;
  const t = await sequelize.transaction();

  try {
    // 1. Verificar que la empresa exista
    const empresa = await Empresa.findByPk(empresaId, { transaction: t });
    if (!empresa) {
      await t.rollback();
      return res.status(404).json({ message: 'La empresa especificada no fue encontrada.' });
    }

    // 2. Generar el lote de objetos de licencia
    const licenciasParaCrear = [];
    for (let i = 0; i < cantidad; i++) {
      licenciasParaCrear.push({
        // Generar una clave única y legible para la licencia
        key: `LIC-${empresa.nombre.substring(0, 4).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        status: 'disponible',
        empresaId: empresa.id,
      });
    }

    // 3. Crear las licencias en la base de datos de forma masiva (muy eficiente)
    const licenciasCreadas = await Licencia.bulkCreate(licenciasParaCrear, { transaction: t });

    // 4. Confirmar la transacción
    await t.commit();

    res.status(201).json({
      message: `${cantidad} licencias creadas y asignadas a la empresa "${empresa.nombre}" exitosamente.`,
      licencias: licenciasCreadas,
    });

  } catch (error) {
    await t.rollback();
    // Podría haber un error de unicidad si una key se repite, aunque es muy improbable.
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(500).json({ message: 'Error al generar claves de licencia únicas. Por favor, intente de nuevo.' });
    }
    console.error('Error al crear lote de licencias:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.getLicenciasSummaryByEmpresa = async (req, res) => {
  try {
    const summary = await Licencia.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Licencia.id')), 'totalLicencias'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN Licencia.status = 'activa' THEN 1 ELSE 0 END")), 'licenciasActivas'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN Licencia.status = 'disponible' THEN 1 ELSE 0 END")), 'licenciasDisponibles'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN Licencia.status = 'inactiva' THEN 1 ELSE 0 END")), 'licenciasInactivas'],
      ],
      include: [
        {
          model: Empresa,
          attributes: ['id', 'nombre'],
          required: true, // INNER JOIN para asegurar que solo se incluyan empresas existentes
        },
        {
          model: Dispositivo,
          attributes: ['nombre'],
          required: false, // LEFT JOIN para que las licencias sin dispositivo también aparezcan
        }
      ],
      group: ['Empresa.id', 'Empresa.nombre'], // Agrupar por empresa
      order: [[{ model: Empresa, as: 'Empresa' }, 'nombre', 'ASC']], // Ordenar por nombre de empresa
    });

    // Formatear la respuesta para que sea más legible
    const formattedSummary = summary.map(item => ({
      empresaId: item.Empresa.id,
      nombreEmpresa: item.Empresa.nombre,
      totalLicencias: parseInt(item.dataValues.totalLicencias, 10),
      licenciasActivas: parseInt(item.dataValues.licenciasActivas, 10),
      licenciasDisponibles: parseInt(item.dataValues.licenciasDisponibles, 10),
      licenciasInactivas: parseInt(item.dataValues.licenciasInactivas, 10),
    }));

    res.status(200).json(formattedSummary);

  } catch (error) {
    console.error('Error al obtener resumen de licencias por empresa:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};