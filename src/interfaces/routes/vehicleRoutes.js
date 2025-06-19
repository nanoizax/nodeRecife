const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Ruta para listar vehículos / Rota para listar veículos
router.get('/', vehicleController.getAllVehicles);

// Ruta para listar motoristas / Rota para listar motoristas
router.get('/motoristas', vehicleController.getAllDrivers);

// Ruta para consultar histórico de mantenimiento / Rota para consultar histórico de manutenção
router.get('/mantenimientos', vehicleController.getAllMaintenances);

module.exports = router;