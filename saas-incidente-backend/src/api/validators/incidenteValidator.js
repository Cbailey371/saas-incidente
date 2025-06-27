const { body } = require('express-validator');

exports.crearIncidenteRules = () => {
  return [
    body('titulo', 'El título es obligatorio y debe tener entre 5 y 100 caracteres.').isString().trim().isLength({ min: 5, max: 100 }),
    body('descripcion', 'La descripción es obligatoria.').isString().trim().notEmpty(),
    body('tipoIncidenteId', 'El ID del tipo de incidente es obligatorio.').notEmpty().isUUID(),
    body('dispositivoId', 'El ID del dispositivo es obligatorio.').notEmpty().isUUID(),
  ];
};