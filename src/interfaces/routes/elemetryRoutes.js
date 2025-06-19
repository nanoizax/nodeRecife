const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

// Ruta para crear telemetría / Rota para criar telemetria
router.post('/', telemetryController.createTelemetry);

// Ruta para consultar y filtrar telemetría / Rota para consultar e filtrar telemetria
router.get('/', telemetryController.getTelemetry);

module.exports = router;