const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');

// POST /api/v1/auth/register - Registro público para una nueva empresa y su admin
router.post('/register', registerRules(), authController.register);

// POST /api/v1/auth/login - Inicio de sesión para todos los roles
router.post('/login', loginRules(), authController.login);

module.exports = router;