const { body } = require('express-validator');

exports.crearEmpresaRules = () => {
  return [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre de la empresa es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),

    body('adminEmail')
      .isEmail().withMessage('Debe proporcionar un email válido para el administrador.')
      .normalizeEmail(),

    body('adminPassword')
      .isLength({ min: 8 }).withMessage('La contraseña del administrador debe tener al menos 8 caracteres.')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número.'),
  ];
};

