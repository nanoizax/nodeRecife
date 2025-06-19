const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/mantenimientosController');

// Listar mantenimientos / Listar manutenções
router.get('/', maintenanceController.getAllMaintenances);

// Crear mantenimiento / Criar manutenção
router.post('/', maintenanceController.createMaintenance);

// Editar mantenimiento / Editar manutenção
router.put('/:id', maintenanceController.updateMaintenance);

// Eliminar mantenimiento / Deletar manutenção
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;