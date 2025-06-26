const { body, param } = require('express-validator');

exports.crearTipoIncidenteRules = () => {
  return [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio.')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres.'),
  ];
};

exports.updateTipoIncidenteRules = () => {
  return [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio.')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres.'),
  ];
};

exports.idParamRules = () => {
  return [
    param('id').isUUID(4).withMessage('El ID del tipo de incidente no es válido.'),
  ];
};