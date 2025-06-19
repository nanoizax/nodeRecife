require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectMongo = require('./config/mongo');
const { connectMSSQL } = require('./config/database');

const app = express();
app.use(bodyParser.json());  // Parsear JSON / Fazer parse de JSON

// Importar rutas / Importar rotas
const telemetryRoutes = require('./interfaces/routes/telemetryRoutes');
const vehicleRoutes = require('./interfaces/routes/vehicleRoutes');
const authRoutes = require('./interfaces/routes/authRoutes');

// Registrar rutas / Registrar rotas
app.use('/telemetria', telemetryRoutes);
app.use('/vehiculos', vehicleRoutes);
app.use('/auth', authRoutes);

// Inicializar conexiones y levantar el servidor / Inicializar conexões e subir o servidor
(async () => {
  await connectMongo();
  await connectMSSQL();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT} / Servidor rodando na porta ${PORT}`);
  });
})();