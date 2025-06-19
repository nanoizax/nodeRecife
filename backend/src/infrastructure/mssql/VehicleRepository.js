const { sql } = require('../../config/database');

// Repositorio para manejar consultas a la base de vehículos en MSSQL
// Repositório para manipular consultas ao banco de veículos no MSSQL
class VehicleRepository {
  async getAllVehicles() {
    const result = await sql.query('SELECT * FROM Vehicles');
    return result.recordset;
  }

  async getAllDrivers() {
    const result = await sql.query('SELECT * FROM Drivers');
    return result.recordset;
  }

  async getAllMaintenances() {
    const result = await sql.query('SELECT * FROM MaintenanceHistory');
    return result.recordset;
  }
}

module.exports = new VehicleRepository();