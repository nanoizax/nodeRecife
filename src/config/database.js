const sql = require('mssql');

// Configuración de conexión a MSSQL / Configuração de conexão ao MSSQL
const sqlConfig = {
  user: process.env.SQL_USER,              // Usuario / Usuário
  password: process.env.SQL_PASSWORD,      // Contraseña / Senha
  database: process.env.SQL_DATABASE,      // Base de datos / Banco de dados
  server: process.env.SQL_SERVER,          // Servidor / Servidor
  options: {
    encrypt: true,                         // Encriptar conexión / Criptografar conexão
    trustServerCertificate: true,          // Aceptar certificado no confiable / Aceitar certificado não confiável
  },
};

// Función para conectar a MSSQL / Função para conectar ao MSSQL
const connectMSSQL = async () => {
  try {
    await sql.connect(sqlConfig);
    console.log('✅ Conexión MSSQL establecida / Conexão MSSQL estabelecida');
  } catch (err) {
    console.error('❌ Error al conectar a MSSQL / Erro ao conectar ao MSSQL:', err);
  }
};

module.exports = { connectMSSQL, sql };