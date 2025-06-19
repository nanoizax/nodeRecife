const Telemetry = require('../../infrastructure/mongo/TelemetryModel');

// Crear nueva telemetría / Criar nova telemetria
exports.createTelemetry = async (req, res) => {
  try {
    const telemetryData = req.body;
    const newTelemetry = new Telemetry(telemetryData);
    await newTelemetry.save();
    res.status(201).json({ message: 'Telemetría registrada con éxito / Telemetria registrada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la telemetría / Erro ao salvar a telemetria', details: error });
  }
};

// Consultar y filtrar telemetría / Consultar e filtrar telemetria
exports.getTelemetry = async (req, res) => {
  try {
    const { dispositivoId, dataInicial, dataFinal, limit = 10, offset = 0 } = req.query;

    const query = {};
    if (dispositivoId) query.deviceId = dispositivoId;
    if (dataInicial || dataFinal) query.timestamp = {};
    if (dataInicial) query.timestamp.$gte = new Date(dataInicial);
    if (dataFinal) query.timestamp.$lte = new Date(dataFinal);

    const data = await Telemetry.find(query)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar la telemetría / Erro ao consultar a telemetria', details: error });
  }
};