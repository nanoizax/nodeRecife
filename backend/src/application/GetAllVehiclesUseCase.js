const VehicleRepository = require('../infrastructure/mssql/VehicleRepository');

// Caso de uso para listar todos los vehículos / Caso de uso para listar todos os veículos
class GetAllVehiclesUseCase {
  async execute() {
    return await VehicleRepository.getAllVehicles();
  }
}

module.exports = new GetAllVehiclesUseCase();