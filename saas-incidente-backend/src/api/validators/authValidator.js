const { body } = require('express-validator');

exports.loginRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Debe proporcionar un email válido.')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria.'),
  ];
};

