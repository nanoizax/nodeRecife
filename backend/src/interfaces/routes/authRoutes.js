const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para login / Rota para login
router.post('/login', authController.login);

module.exports = router;