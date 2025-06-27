const express = require('express');
const router = express.Router();
const { loginRules } = require('../validators/authValidator');
const authController = require('../controllers/authController');

// POST /api/v1/auth/login
router.post('/login', loginRules(), authController.login);

module.exports = router;

