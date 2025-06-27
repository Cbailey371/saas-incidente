const { body } = require('express-validator');

exports.crearLoteRules = () => {
  return [
    body('empresaId', 'El ID de la empresa es obligatorio.').notEmpty().isUUID(),
    body('cantidad', 'La cantidad debe ser un número entero mayor que 0.').isInt({ gt: 0 }),
  ];
};