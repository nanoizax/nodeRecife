const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

// Listar telemetrías / Listar telemetrias
router.get('/', telemetryController.getAllTelemetries);

// Crear nueva telemetría / Criar nova telemetria
router.post('/', telemetryController.createTelemetry);

module.exports = router;