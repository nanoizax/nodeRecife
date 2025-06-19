const { sql } = require('../../config/database');

// Listar vehículos / Listar veículos
exports.getAllVehicles = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM Vehicles');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar vehículos / Erro ao consultar veículos', details: error });
  }
};

// Listar motoristas / Listar motoristas
exports.getAllDrivers = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM Drivers');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar motoristas / Erro ao consultar motoristas', details: error });
  }
};

// Consultar mantenimiento / Consultar manutenção
exports.getAllMaintenances = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM MaintenanceHistory');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el historial de mantenimiento / Erro ao consultar o histórico de manutenção', details: error });
  }
};