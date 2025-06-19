const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

/* ────────────── VEHÍCULOS / VEÍCULOS ────────────── */

// Listar vehículos / Listar veículos
router.get('/', vehicleController.getAllVehicles);

// Crear vehículo / Criar veículo
router.post('/', vehicleController.createVehicle);

// Editar vehículo / Editar veículo
router.put('/:id', vehicleController.updateVehicle);

// Eliminar vehículo / Deletar veículo
router.delete('/:id', vehicleController.deleteVehicle);

// Asignar motorista a un vehículo / Atribuir motorista a um veículo
router.post('/:id/assign-driver', vehicleController.assignDriverToVehicle);


module.exports = router;