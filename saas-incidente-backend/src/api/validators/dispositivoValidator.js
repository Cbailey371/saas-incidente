const { body } = require('express-validator');

exports.registrarDispositivoRules = () => {
  return [
    body('nombre')
      .trim().notEmpty().withMessage('El nombre del dispositivo es obligatorio.'),

    body('identificadorUnico')
      .trim().notEmpty().withMessage('El identificador único del dispositivo es obligatorio.'),

    body('plataforma')
      .isIn(['Android', 'iOS', 'Web', 'Otro']).withMessage('La plataforma no es válida.'),

    body('modelo').optional().trim(),
  ];
};

exports.assignAgentToDeviceRules = () => {
  return [
    body('usuarioId')
      .isUUID(4).withMessage('El ID del usuario es inválido.')
      .optional({ nullable: true }), // Puede ser null para desasignar
  ];
};