const { validationResult } = require('express-validator');
const { Incidente, ArchivoMultimedia, Dispositivo, TipoIncidente, Usuario, sequelize } = require('../../models');
const { stringify } = require('csv-stringify'); // Importar la librería para CSV

// Helper para construir la cláusula WHERE para filtros de incidentes
const buildIncidenteWhereClause = (empresaId, queryParams) => {
  const {
    startDate,
    endDate,
    tipoIncidenteId,
    dispositivoId,
  } = queryParams;

  const whereClause = { empresaId };

  if (startDate) {
    whereClause.fecha = { ...whereClause.fecha, [sequelize.Op.gte]: new Date(startDate) };
  }
  if (endDate) {
    whereClause.fecha = { ...whereClause.fecha, [sequelize.Op.lte]: new Date(endDate) };
  }
  if (tipoIncidenteId) {
    whereClause.tipoIncidenteId = tipoIncidenteId;
  }
  if (dispositivoId) {
    whereClause.dispositivoId = dispositivoId;
  }
  return whereClause;
};

exports.crearIncidente = async (req, res) => {
  // El archivo ya fue procesado por multer y está en req.file
  // Los campos de texto están en req.body

  // 1. Validar campos de texto
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 2. Validar que se haya subido un archivo
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo multimedia.' });
  }

  const { titulo, descripcion, tipoIncidenteId, dispositivoId } = req.body;
  const { userId, empresaId } = req.user; // Datos del agente obtenidos del JWT

  const t = await sequelize.transaction();

  try {
    // 3. Verificar que el dispositivo y el tipo de incidente pertenezcan a la empresa del agente
    const dispositivo = await Dispositivo.findOne({
      where: { id: dispositivoId, empresaId: empresaId },
      transaction: t
    });
    if (!dispositivo) {
      await t.rollback();
      return res.status(403).json({ message: 'Acceso denegado. El dispositivo no pertenece a su empresa.' });
    }

    const tipoIncidente = await TipoIncidente.findOne({
        where: { id: tipoIncidenteId, empresaId: empresaId },
        transaction: t
    });
    if (!tipoIncidente) {
        await t.rollback();
        return res.status(404).json({ message: 'El tipo de incidente especificado no existe para su empresa.' });
    }

    // 4. Crear el registro del incidente
    const nuevoIncidente = await Incidente.create({
      titulo,
      descripcion,
      tipoIncidenteId,
      dispositivoId,
      usuarioId: userId,
      empresaId: empresaId,
    }, { transaction: t });

    // 5. Crear el registro del archivo multimedia asociado al incidente
    await ArchivoMultimedia.create({
      ruta: req.file.path, // Ruta donde multer guardó el archivo
      tipo: req.file.mimetype.startsWith('image/') ? 'imagen' : 'video',
      incidenteId: nuevoIncidente.id,
    }, { transaction: t });

    // 6. Confirmar la transacción
    await t.commit();

    res.status(201).json({
      message: 'Incidente reportado exitosamente.',
      incidente: nuevoIncidente,
    });

  } catch (error) {
    await t.rollback();
    console.error('Error al crear incidente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.exportarIncidentesPorEmpresa = async (req, res) => {
  const { empresaId } = req.user;
  const whereClause = buildIncidenteWhereClause(empresaId, req.query);

  try {
    const incidentes = await Incidente.findAll({
      where: whereClause,
      order: [['fecha', 'DESC']],
      include: [
        { model: Usuario, as: 'reportadoPor', attributes: ['email'] },
        { model: Dispositivo, attributes: ['nombre', 'identificadorUnico'] },
        { model: TipoIncidente, attributes: ['nombre'] },
        { model: ArchivoMultimedia, attributes: ['ruta'], required: false }, // LEFT JOIN para archivos
      ],
    });

    // Preparar los datos para el CSV
    const records = incidentes.map(incidente => ({
      'ID Incidente': incidente.id,
      'Título': incidente.titulo,
      'Descripción': incidente.descripcion,
      'Fecha': incidente.fecha.toLocaleString(),
      'Reportado Por (Email)': incidente.reportadoPor ? incidente.reportadoPor.email : 'N/A',
      'Dispositivo (Nombre)': incidente.Dispositivo ? incidente.Dispositivo.nombre : 'N/A',
      'Dispositivo (ID Único)': incidente.Dispositivo ? incidente.Dispositivo.identificadorUnico : 'N/A',
      'Tipo de Incidente': incidente.TipoIncidente ? incidente.TipoIncidente.nombre : 'N/A',
      'Rutas de Archivos': incidente.ArchivoMultimedia && incidente.ArchivoMultimedia.length > 0
        ? incidente.ArchivoMultimedia.map(file => file.ruta).join('; ')
        : 'N/A',
      'ID Empresa': incidente.empresaId,
    }));

    // Definir las columnas del CSV
    const columns = Object.keys(records[0] || {});

    // Generar el CSV
    stringify(records, { header: true, columns: columns }, (err, output) => {
      if (err) {
        console.error('Error al generar CSV:', err);
        return res.status(500).json({ message: 'Error al generar el archivo CSV.' });
      }

      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="incidentes_reporte_${new Date().toISOString().split('T')[0]}.csv"`);
      res.status(200).send(output);
    });

  } catch (error) {
    console.error('Error al exportar incidentes:', error);
    res.status(500).json({ message: 'Error interno del servidor al exportar incidentes.' });
  }
};

exports.listarIncidentesPorEmpresa = async (req, res) => {
  const { empresaId } = req.user;
  const whereClause = buildIncidenteWhereClause(empresaId, req.query);

  // Paginación
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Incidente.findAndCountAll({
      where: whereClause,
      limit, // Límite de paginación
      offset,
      order: [['fecha', 'DESC']], // Ordenar por los más recientes primero
      include: [ // Cargar datos relacionados para una vista completa
        {
          model: Usuario,
          as: 'reportadoPor',
          attributes: ['id', 'email'], // No exponer datos sensibles como la contraseña
        },
        {
          model: Dispositivo,
          attributes: ['id', 'nombre'],
        },
        {
          model: TipoIncidente,
          attributes: ['id', 'nombre'],
        },
        {
          model: ArchivoMultimedia,
          attributes: ['id', 'ruta', 'tipo'],
        },
      ],
    });

    res.status(200).json({ totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page, incidentes: rows });
  } catch (error) {
    console.error('Error al listar incidentes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};