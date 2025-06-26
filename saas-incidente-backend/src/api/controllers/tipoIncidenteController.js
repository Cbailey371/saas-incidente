const { validationResult } = require('express-validator');
const { TipoIncidente, sequelize } = require('../../models'); // Importar sequelize para Op

exports.listarTiposIncidentePorEmpresa = async (req, res) => {
  // El empresaId se obtiene del token del usuario autenticado
  const { empresaId } = req.user;

  try {
    const tiposIncidente = await TipoIncidente.findAll({
      where: { empresaId },
      attributes: ['id', 'nombre', 'activo'], // Incluir el estado activo
      order: [['nombre', 'ASC']], // Ordenar alfabéticamente
    });

    res.status(200).json(tiposIncidente);
  } catch (error) {
    console.error('Error al listar tipos de incidente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.updateTipoIncidente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params; // ID del tipo de incidente a actualizar
  const { nombre } = req.body;
  const { empresaId } = req.user; // Obtenido del JWT

  try {
    // 1. Verificar que el tipo de incidente exista y pertenezca a la empresa
    const tipoIncidente = await TipoIncidente.findOne({
      where: { id, empresaId }
    });

    if (!tipoIncidente) {
      return res.status(404).json({ message: 'Tipo de incidente no encontrado o no pertenece a su empresa.' });
    }

    // 2. Verificar si ya existe otro tipo con el mismo nombre para esta empresa (excluyendo el actual)
    const existente = await TipoIncidente.findOne({
      where: {
        nombre,
        empresaId,
        id: { [sequelize.Op.ne]: id } // Excluir el propio tipo de incidente que estamos actualizando
      }
    });

    if (existente) {
      return res.status(409).json({ message: 'Ya existe otro tipo de incidente con ese nombre en su empresa.' });
    }

    // 3. Actualizar el nombre
    tipoIncidente.nombre = nombre;
    await tipoIncidente.save();

    res.status(200).json({
      message: 'Tipo de incidente actualizado exitosamente.',
      tipoIncidente: tipoIncidente
    });

  } catch (error) {
    console.error('Error al actualizar tipo de incidente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.toggleTipoIncidenteActivo = async (req, res) => {
  const errors = validationResult(req); // Para la validación del parámetro ID
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { empresaId } = req.user; // Obtenido del JWT

  try {
    // 1. Verificar que el tipo de incidente exista y pertenezca a la empresa
    const tipoIncidente = await TipoIncidente.findOne({
      where: { id, empresaId }
    });

    if (!tipoIncidente) {
      return res.status(404).json({ message: 'Tipo de incidente no encontrado o no pertenece a su empresa.' });
    }

    // 2. Cambiar el estado 'activo'
    tipoIncidente.activo = !tipoIncidente.activo;
    await tipoIncidente.save();

    res.status(200).json({
      message: `Tipo de incidente ${tipoIncidente.activo ? 'activado' : 'desactivado'} exitosamente.`,
      tipoIncidente: tipoIncidente
    });

  } catch (error) {
    console.error('Error al cambiar estado de tipo de incidente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.crearTipoIncidente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre } = req.body;
  const { empresaId } = req.user; // Obtenido del JWT

  try {
    // Verificar si ya existe un tipo con el mismo nombre para esta empresa
    const existente = await TipoIncidente.findOne({
      where: { nombre, empresaId }
    });

    if (existente) {
      return res.status(409).json({ message: 'Ya existe un tipo de incidente con ese nombre en su empresa.' });
    }

    const nuevoTipo = await TipoIncidente.create({
      nombre,
      empresaId
    });

    res.status(201).json({
      message: 'Tipo de incidente creado exitosamente.',
      tipoIncidente: nuevoTipo
    });

  } catch (error) {
    console.error('Error al crear tipo de incidente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};