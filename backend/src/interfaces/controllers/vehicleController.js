const mssql = require('../../config/database');

// Función reutilizable para consultas / Função reutilizável para consultas
const executeQuery = async (query, inputs = []) => {
  const pool = await mssql.getConnection();
  const request = pool.request();
  inputs.forEach(({ name, type, value }) => request.input(name, type, value));
  return request.query(query);
};

/* ────────────── VEHÍCULOS / VEÍCULOS ────────────── */

// Listar vehículos / Listar veículos
exports.getAllVehicles = async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT V.*, D.Name AS DriverName 
      FROM Vehicles V 
      LEFT JOIN Drivers D ON V.DriverId = D.Id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al consultar vehículos / Erro ao consultar veículos:', error);
    res.status(500).json({ error: 'Error al consultar vehículos / Erro ao consultar veículos' });
  }
};

// Crear vehículo / Criar veículo
exports.createVehicle = async (req, res) => {
  const { PlateNumber, Model, Year } = req.body;

  if (!PlateNumber || !Model || !Year) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios / Todos os campos são obrigatórios' });
  }

  try {
    await executeQuery(
      'INSERT INTO Vehicles (PlateNumber, Model, Year) VALUES (@PlateNumber, @Model, @Year)',
      [
        { name: 'PlateNumber', type: mssql.sql.NVarChar, value: PlateNumber },
        { name: 'Model', type: mssql.sql.NVarChar, value: Model },
        { name: 'Year', type: mssql.sql.Int, value: Year },
      ]
    );
    res.status(201).json({ message: 'Vehículo creado / Veículo criado' });
  } catch (error) {
    console.error('❌ Error al crear vehículo / Erro ao criar veículo:', error);
    res.status(500).json({ error: 'Error al crear vehículo / Erro ao criar veículo' });
  }
};

// Editar vehículo / Editar veículo
exports.updateVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  const { PlateNumber, Model, Year } = req.body;

  if (!PlateNumber || !Model || !Year) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios / Todos os campos são obrigatórios' });
  }

  try {
    await executeQuery(
      'UPDATE Vehicles SET PlateNumber = @PlateNumber, Model = @Model, Year = @Year WHERE Id = @vehicleId',
      [
        { name: 'vehicleId', type: mssql.sql.Int, value: vehicleId },
        { name: 'PlateNumber', type: mssql.sql.NVarChar, value: PlateNumber },
        { name: 'Model', type: mssql.sql.NVarChar, value: Model },
        { name: 'Year', type: mssql.sql.Int, value: Year },
      ]
    );
    res.status(200).json({ message: 'Vehículo actualizado / Veículo atualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar vehículo / Erro ao atualizar veículo:', error);
    res.status(500).json({ error: 'Error al actualizar vehículo / Erro ao atualizar veículo' });
  }
};

// Eliminar vehículo / Deletar veículo
exports.deleteVehicle = async (req, res) => {
  const vehicleId = req.params.id;

  try {
    await executeQuery(
      'DELETE FROM Vehicles WHERE Id = @vehicleId',
      [{ name: 'vehicleId', type: mssql.sql.Int, value: vehicleId }]
    );
    res.status(200).json({ message: 'Vehículo eliminado / Veículo deletado' });
  } catch (error) {
    console.error('❌ Error al eliminar vehículo / Erro ao deletar veículo:', error);
    res.status(500).json({ error: 'Error al eliminar vehículo / Erro ao deletar veículo' });
  }
};

// Asignar motorista a vehículo / Atribuir motorista a veículo
exports.assignDriverToVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  const { driverId } = req.body;

  try {
    await executeQuery(
      'UPDATE Vehicles SET DriverId = @driverId WHERE Id = @vehicleId',
      [
        { name: 'vehicleId', type: mssql.sql.Int, value: vehicleId },
        { name: 'driverId', type: mssql.sql.Int, value: driverId },
      ]
    );
    res.status(200).json({ message: 'Motorista asignado / Motorista atribuído' });
  } catch (error) {
    console.error('❌ Error al asignar motorista / Erro ao atribuir motorista:', error);
    res.status(500).json({ error: 'Error al asignar motorista / Erro ao atribuir motorista' });
  }
};

