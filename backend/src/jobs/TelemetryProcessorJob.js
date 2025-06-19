const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

// Configuración de Redis / Configuração do Redis
const connection = new Redis();

// Crear la cola / Criar a fila
const telemetryQueue = new Queue('telemetry', { connection });

// Worker para procesar jobs de telemetría / Worker para processar jobs de telemetria
const worker = new Worker('telemetry', async job => {
  console.log('📡 Procesando telemetría: ', job.data);
}, { connection });

// Función para agregar un nuevo job / Função para adicionar um novo job
const addTelemetryJob = async (data) => {
  await telemetryQueue.add('processTelemetry', data);
};

module.exports = { addTelemetryJob };