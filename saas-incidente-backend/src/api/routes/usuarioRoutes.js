const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { registrarUsuarioRules, updateUsuarioRules, idParamRules } = require('../validators/usuarioValidator');

// POST /api/v1/usuarios - Registrar un nuevo usuario para la empresa
// Protegida: solo para admin_empresa
router.post(
  '/',
  [verifyToken, checkRole(['admin_empresa']), ...registrarUsuarioRules()],
  usuarioController.registrarUsuario
);

// GET /api/v1/usuarios - Listar usuarios de la empresa
// Protegida: solo para admin_empresa
router.get(
  '/',
  [verifyToken, checkRole(['admin_empresa'])],
  usuarioController.listarUsuariosPorEmpresa
);

// PUT /api/v1/usuarios/:id - Actualizar un usuario
// Protegida: solo para admin_empresa
router.put('/:id', [verifyToken, checkRole(['admin_empresa']), ...idParamRules(), ...updateUsuarioRules()], usuarioController.updateUsuario);

// PATCH /api/v1/usuarios/:id/toggle-activo - Activar/Desactivar un usuario
// Protegida: solo para admin_empresa
router.patch('/:id/toggle-activo', [verifyToken, checkRole(['admin_empresa']), ...idParamRules()], usuarioController.toggleUsuarioActivo);

module.exports = router;