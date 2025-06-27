const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { registrarUsuarioRules, updateUsuarioRules, toggleUsuarioActivoRules } = require('../validators/usuarioValidator');

// POST /api/v1/usuarios - Registrar un nuevo usuario
router.post('/', [verifyToken, checkRole(['admin_empresa']), ...registrarUsuarioRules()], usuarioController.registrarUsuario);

// GET /api/v1/usuarios - Listar usuarios de la empresa
router.get('/', [verifyToken, checkRole(['admin_empresa'])], usuarioController.listarUsuariosPorEmpresa);

// PUT /api/v1/usuarios/:id - Actualizar un usuario
router.put('/:id', [verifyToken, checkRole(['admin_empresa']), ...updateUsuarioRules()], usuarioController.updateUsuario);

// PATCH /api/v1/usuarios/:id/toggle-activo - Activar/desactivar un usuario
router.patch('/:id/toggle-activo', [verifyToken, checkRole(['admin_empresa']), ...toggleUsuarioActivoRules()], usuarioController.toggleUsuarioActivo);

module.exports = router;