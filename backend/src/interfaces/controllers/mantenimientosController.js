const mssql = require('../../config/database');

// Función reutilizable / Função reutilizável
const executeQuery = async (query, inputs = []) => {
  const pool = await mssql.getConnection();
  const request = pool.request();
  inputs.forEach(({ name, type, value }) => request.input(name, type, value));
  return request.query(query);
};

/* ──────────── LISTAR MANTENIMIENTOS / LISTAR MANUTENÇÕES ──────────── */
exports.getAllMaintenances = async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM MaintenanceHistory');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar mantenimientos / Erro ao listar manutenções:', error);
    res.status(500).json({ error: 'Error al listar mantenimientos / Erro ao listar manutenções' });
  }
};

/* ──────────── CREAR MANTENIMIENTO / CRIAR MANUTENÇÃO ──────────── */
exports.createMaintenance = async (req, res) => {
    const { VehicleId, Description, MaintenanceDate } = req.body;
  
    if (!VehicleId || !Description || !MaintenanceDate) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios / Todos os campos são obrigatórios'
      });
    }
  
    try {
      // ✅ Verificar si el vehículo existe / Verificar se o veículo existe
      const vehicleCheck = await executeQuery(
        'SELECT Id FROM Vehicles WHERE Id = @VehicleId',
        [{ name: 'VehicleId', type: mssql.sql.Int, value: VehicleId }]
      );
  
      if (vehicleCheck.recordset.length === 0) {
        return res.status(404).json({
          error: 'El vehículo no existe / O veículo não existe'
        });
      }
  
      // ✅ Insertar el mantenimiento / Inserir a manutenção
      await executeQuery(
        'INSERT INTO MaintenanceHistory (VehicleId, Description, MaintenanceDate) VALUES (@VehicleId, @Description, @MaintenanceDate)',
        [
          { name: 'VehicleId', type: mssql.sql.Int, value: VehicleId },
          { name: 'Description', type: mssql.sql.NVarChar, value: Description },
          { name: 'MaintenanceDate', type: mssql.sql.DateTime, value: new Date(MaintenanceDate) },
        ]
      );
  
      res.status(201).json({ message: 'Mantenimiento creado / Manutenção criada' });
    } catch (error) {
      console.error('❌ Error al crear mantenimiento / Erro ao criar manutenção:', error);
      res.status(500).json({
        error: 'Error al crear mantenimiento / Erro ao criar manutenção',
        details: error,
      });
    }
  };

/* ──────────── EDITAR MANTENIMIENTO / EDITAR MANUTENÇÃO ──────────── */
exports.updateMaintenance = async (req, res) => {
  const maintenanceId = req.params.id;
  const { VehicleId, Description, MaintenanceDate } = req.body;

  if (!VehicleId || !Description || !MaintenanceDate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios / Todos os campos são obrigatórios' });
  }

  try {
    await executeQuery(
      'UPDATE MaintenanceHistory SET VehicleId = @VehicleId, Description = @Description, MaintenanceDate = @MaintenanceDate WHERE Id = @maintenanceId',
      [
        { name: 'maintenanceId', type: mssql.sql.Int, value: maintenanceId },
        { name: 'VehicleId', type: mssql.sql.Int, value: VehicleId },
        { name: 'Description', type: mssql.sql.NVarChar, value: Description },
        { name: 'MaintenanceDate', type: mssql.sql.DateTime, value: MaintenanceDate },
      ]
    );
    res.status(200).json({ message: 'Mantenimiento actualizado / Manutenção atualizada' });
  } catch (error) {
    console.error('❌ Error al actualizar mantenimiento / Erro ao atualizar manutenção:', error);
    res.status(500).json({ error: 'Error al actualizar mantenimiento / Erro ao atualizar manutenção' });
  }
};

/* ──────────── ELIMINAR MANTENIMIENTO / DELETAR MANUTENÇÃO ──────────── */
exports.deleteMaintenance = async (req, res) => {
  const maintenanceId = req.params.id;

  try {
    await executeQuery(
      'DELETE FROM MaintenanceHistory WHERE Id = @maintenanceId',
      [{ name: 'maintenanceId', type: mssql.sql.Int, value: maintenanceId }]
    );
    res.status(200).json({ message: 'Mantenimiento eliminado / Manutenção deletada' });
  } catch (error) {
    console.error('❌ Error al eliminar mantenimiento / Erro ao deletar manutenção:', error);
    res.status(500).json({ error: 'Error al eliminar mantenimiento / Erro ao deletar manutenção' });
  }
};