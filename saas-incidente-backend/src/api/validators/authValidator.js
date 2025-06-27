const { body } = require('express-validator');

exports.registerRules = () => {
  return [
    body('nombreEmpresa', 'El nombre de la empresa es requerido').notEmpty().trim(),
    body('email', 'Por favor, incluye un email válido').isEmail().normalizeEmail(),
    body('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
  ];
};

exports.loginRules = () => {
  return [
    body('email', 'Por favor, incluye un email válido').isEmail().normalizeEmail(),
    body('password', 'La contraseña es requerida').notEmpty(),
    body('identificadorUnico', 'El identificador único es opcional').optional().trim(),
  ];
};