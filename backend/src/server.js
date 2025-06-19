require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const connectMongo = require('./config/mongo');
const { connectMSSQL } = require('./config/database');

// Importar middlewares / Importar middlewares
const authMiddleware = require('./middlewares/authMiddleware');

// Importar rutas / Importar rotas
const authRoutes = require('./interfaces/routes/authRoutes');
const telemetryRoutes = require('./interfaces/routes/telemetryRoutes');
const vehicleRoutes = require('./interfaces/routes/vehicleRoutes');
const driverRoutes = require('./interfaces/routes/driverRoutes');
const maintenanceRoutes = require('./interfaces/routes/maintenanceRoutes');  // ✅ Aquí agregas la importación que faltaba

const app = express();

// Middleware para parsear JSON / Middleware para fazer parse de JSON
app.use(bodyParser.json());

// Middleware de logs HTTP / Middleware para logs HTTP
app.use(morgan('dev'));

// Middleware de CORS / Middleware para CORS
app.use(cors());

/* ────────────── RUTAS PÚBLICAS / ROTAS PÚBLICAS ────────────── */
app.use('/auth', authRoutes);

/* ────────────── RUTAS PROTEGIDAS / ROTAS PROTEGIDAS ────────────── */
app.use('/telemetria', authMiddleware, telemetryRoutes);
app.use('/vehiculos', authMiddleware, vehicleRoutes);
app.use('/motoristas', authMiddleware, driverRoutes);
app.use('/mantenimientos', authMiddleware, maintenanceRoutes);  // ✅ Ahora no dará error al levantar

/* ────────────── MANEJO GLOBAL DE ERRORES / TRATAMENTO GLOBAL DE ERROS ────────────── */
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  res.status(500).json({ error: 'Error interno del servidor / Erro interno do servidor' });
});

/* ────────────── INICIAR CONEXIONES Y SERVIDOR / INICIAR CONEXÕES E SERVIDOR ────────────── */
(async () => {
  await connectMongo();
  await connectMSSQL();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT} / Server running on port ${PORT}`);
  });
})();