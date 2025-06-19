const mssql = require('../../config/database');

// Función reutilizable para ejecutar consultas / Função reutilizável para executar consultas
const executeQuery = async (query, inputs = []) => {
  const pool = await mssql.getConnection();
  const request = pool.request();
  inputs.forEach(({ name, type, value }) => request.input(name, type, value));
  return request.query(query);
};

/* ────────────── MOTORISTAS / DRIVERS ────────────── */

// Listar motoristas / Listar motoristas
exports.getAllDrivers = async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM Drivers');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al consultar motoristas / Erro ao consultar motoristas:', error);
    res.status(500).json({ error: 'Error al consultar motoristas / Erro ao consultar motoristas' });
  }
};

// Crear motorista / Criar motorista
exports.createDriver = async (req, res) => {
  const { Name, LicenseNumber } = req.body;

  if (!Name || !LicenseNumber) {
    return res.status(400).json({ error: 'Nombre y licencia son obligatorios / Nome e licença são obrigatórios' });
  }

  try {
    await executeQuery(
      'INSERT INTO Drivers (Name, LicenseNumber) VALUES (@Name, @LicenseNumber)',
      [
        { name: 'Name', type: mssql.sql.NVarChar, value: Name },
        { name: 'LicenseNumber', type: mssql.sql.NVarChar, value: LicenseNumber },
      ]
    );
    res.status(201).json({ message: 'Motorista creado / Motorista criado' });
  } catch (error) {
    console.error('❌ Error al crear motorista / Erro ao criar motorista:', error);
    res.status(500).json({ error: 'Error al crear motorista / Erro ao criar motorista' });
  }
};

// Editar motorista / Editar motorista
exports.updateDriver = async (req, res) => {
  const driverId = req.params.id;
  const { Name, LicenseNumber } = req.body;

  if (!Name || !LicenseNumber) {
    return res.status(400).json({ error: 'Nombre y licencia son obligatorios / Nome e licença são obrigatórios' });
  }

  try {
    await executeQuery(
      'UPDATE Drivers SET Name = @Name, LicenseNumber = @LicenseNumber WHERE Id = @driverId',
      [
        { name: 'driverId', type: mssql.sql.Int, value: driverId },
        { name: 'Name', type: mssql.sql.NVarChar, value: Name },
        { name: 'LicenseNumber', type: mssql.sql.NVarChar, value: LicenseNumber },
      ]
    );
    res.status(200).json({ message: 'Motorista actualizado / Motorista atualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar motorista / Erro ao atualizar motorista:', error);
    res.status(500).json({ error: 'Error al actualizar motorista / Erro ao atualizar motorista' });
  }
};

// ✅ Bloquear eliminación si tiene vehículos
// Eliminar motorista / Deletar motorista
exports.deleteDriver = async (req, res) => {
    const driverId = req.params.id;
  
    try {
      const pool = await mssql.getConnection();
  
      // Verificar si el motorista tiene vehículos asignados / Verificar se o motorista tem veículos atribuídos
      const vehicleResult = await pool.request()
        .input('driverId', mssql.sql.Int, driverId)
        .query('SELECT COUNT(*) AS vehicleCount FROM Vehicles WHERE DriverId = @driverId');
  
      const vehicleCount = vehicleResult.recordset[0].vehicleCount;
  
      if (vehicleCount > 0) {
        return res.status(400).json({ error: 'Este motorista tiene vehículos asignados. Primero debe desasignarlos / Este motorista possui veículos atribuídos. Desatribua antes de excluir.' });
      }
  
      // Eliminar motorista / Excluir motorista
      await pool.request()
        .input('driverId', mssql.sql.Int, driverId)
        .query('DELETE FROM Drivers WHERE Id = @driverId');
  
      res.status(200).json({ message: 'Motorista eliminado con éxito / Motorista excluído com sucesso' });
    } catch (error) {
      console.error('❌ Error al eliminar motorista / Erro ao excluir motorista:', error);
      res.status(500).json({ error: 'Error interno del servidor / Erro interno do servidor' });
    }
  };
  
// Motoristas con sus vehículos / Motoristas com seus veículos
exports.getDriversWithVehicles = async (req, res) => {
  try {
    const pool = await mssql.getConnection();

    const [drivers, vehicles] = await Promise.all([
      pool.request().query('SELECT * FROM Drivers').then(r => r.recordset),
      pool.request().query('SELECT * FROM Vehicles').then(r => r.recordset),
    ]);

    const data = drivers.map(driver => ({
      ...driver,
      vehicles: vehicles.filter(v => v.DriverId === driver.Id),
    }));

    res.json(data);
  } catch (error) {
    console.error('❌ Error al consultar motoristas con vehículos / Erro ao consultar motoristas com veículos:', error);
    res.status(500).json({ error: 'Error al consultar motoristas con vehículos / Erro ao consultar motoristas com veículos' });
  }
};