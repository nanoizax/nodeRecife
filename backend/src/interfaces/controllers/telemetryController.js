const mssql = require('../../config/database');
const Telemetry = require('../../infrastructure/mongo/TelemetryModel');

/* ────────────── Listar todas las telemetrías / Listar todas as telemetrias ────────────── */
exports.getAllTelemetries = async (req, res) => {
  try {
    const telemetries = await Telemetry.find().sort({ timestamp: -1 });

    const pool = await mssql.getConnection();

    const [vehicles, drivers] = await Promise.all([
      pool.request().query('SELECT Id, PlateNumber, Model FROM Vehicles').then(r => r.recordset),
      pool.request().query('SELECT Id, Name FROM Drivers').then(r => r.recordset),
    ]);

    const enriched = telemetries.map(t => ({
      ...t.toObject(),
      vehicle: vehicles.find(v => v.Id === t.vehicleId) || null,
      driver: drivers.find(d => d.Id === t.driverId) || null,
    }));

    res.json(enriched);
  } catch (error) {
    console.error('❌ Error al listar telemetrías / Erro ao listar telemetrias:', error);
    res.status(500).json({ error: 'Error al listar telemetrías / Erro ao listar telemetrias' });
  }
};

/* ────────────── Crear nueva telemetría / Criar nova telemetria ────────────── */
exports.createTelemetry = async (req, res) => {
  const { vehicleId, driverId, lat, lng, speed, engineStatus } = req.body;

  // Validación básica de campos obligatorios
  if (!vehicleId || !driverId || lat === undefined || lng === undefined || speed === undefined || !engineStatus) {
    return res.status(400).json({
      error: 'Todos los campos son obligatorios / Todos os campos são obrigatórios'
    });
  }

  try {
    const pool = await mssql.getConnection();

    /* ✅ Validar que el vehículo exista / Validar que o veículo exista */
    const vehicle = await pool.request()
      .input('vehicleId', mssql.sql.Int, vehicleId)
      .query('SELECT * FROM Vehicles WHERE Id = @vehicleId')
      .then(r => r.recordset[0]);

    if (!vehicle) {
      return res.status(400).json({ error: 'Vehículo no encontrado / Veículo não encontrado' });
    }

    /* ✅ Validar que el motorista exista / Validar que o motorista exista */
    const driver = await pool.request()
      .input('driverId', mssql.sql.Int, driverId)
      .query('SELECT * FROM Drivers WHERE Id = @driverId')
      .then(r => r.recordset[0]);

    if (!driver) {
      return res.status(400).json({ error: 'Motorista no encontrado / Motorista não encontrado' });
    }

    /* ✅ Crear y guardar la telemetría / Criar e salvar a telemetria */
    const telemetry = new Telemetry({
      vehicleId,
      driverId,
      lat,
      lng,
      speed,
      engineStatus,
      timestamp: new Date()
    });

    await telemetry.save();

    res.status(201).json({ message: 'Telemetría guardada / Telemetria salva' });

  } catch (error) {
    console.error('❌ Error al guardar telemetría / Erro ao salvar telemetria:', error);
    res.status(500).json({ error: 'Error al guardar telemetría / Erro ao salvar telemetria' });
  }
};