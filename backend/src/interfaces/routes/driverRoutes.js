const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

/* ────────────── MOTORISTAS / DRIVERS ────────────── */

// Listar motoristas / Listar motoristas
router.get('/', driverController.getAllDrivers);

// Crear motorista / Criar motorista
router.post('/', driverController.createDriver);

// Editar motorista / Editar motorista
router.put('/:id', driverController.updateDriver);

// Eliminar motorista / Deletar motorista
router.delete('/:id', driverController.deleteDriver);

// Listar motoristas con sus vehículos / Listar motoristas com seus veículos
router.get('/con-vehiculos', driverController.getDriversWithVehicles);

module.exports = router;