const { body } = require('express-validator');

exports.registrarUsuarioRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Debe proporcionar un email válido.')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número.'),

    body('rol')
      .isIn(['agente', 'admin_empresa']).withMessage('El rol no es válido. Debe ser "agente" o "admin_empresa".'),

    // Opcional: Validar que el rol sea 'agente' si se requiere un dispositivoId
    // body('dispositivoId')
    //   .optional() // Es opcional para el registro inicial
    //   .isUUID(4).withMessage('El ID del dispositivo no es válido.'),
  ];
};

exports.updateUsuarioRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Debe proporcionar un email válido.')
      .normalizeEmail(),
    body('rol')
      .isIn(['agente', 'admin_empresa']).withMessage('El rol no es válido. Debe ser "agente" o "admin_empresa".'),
    body('activo')
      .isBoolean().withMessage('El estado activo debe ser un booleano.'),
  ];
};

exports.idParamRules = () => {
  return [
    param('id').isUUID(4).withMessage('El ID del usuario no es válido.'),
  ];
};