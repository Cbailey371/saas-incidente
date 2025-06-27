const { body, param } = require('express-validator');

exports.registrarUsuarioRules = () => {
  return [
    body('email', 'Por favor, introduce un email válido.').isEmail().normalizeEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    body('rol', 'El rol es inválido.').isIn(['admin_empresa', 'agente']),
  ];
};

exports.updateUsuarioRules = () => {
  return [
    param('id', 'El ID de usuario es inválido.').isUUID(),
    body('email', 'Por favor, introduce un email válido.').isEmail().normalizeEmail(),
    body('rol', 'El rol es inválido.').isIn(['admin_empresa', 'agente']),
    body('activo', 'El estado activo debe ser un booleano.').isBoolean(),
  ];
};

exports.toggleUsuarioActivoRules = () => {
    return [
        param('id', 'El ID de usuario es inválido.').isUUID(),
    ];
};