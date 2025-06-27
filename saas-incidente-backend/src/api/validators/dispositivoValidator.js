const { body, param } = require('express-validator');

exports.registrarDispositivoRules = () => {
  return [
    body('nombre', 'El nombre del dispositivo es obligatorio.').notEmpty().trim(),
    body('identificadorUnico', 'El identificador único es obligatorio.').notEmpty().trim(),
    body('plataforma', 'La plataforma es obligatoria.').isIn(['Android', 'iOS', 'Web', 'Otro']),
  ];
};

exports.assignAgentRules = () => {
  return [
    param('id', 'El ID del dispositivo es inválido.').isUUID(),
    // usuarioId can be null, so we only validate if it's provided
    body('usuarioId', 'El ID del usuario es inválido.').optional({ nullable: true }).isUUID(),
  ];
};