const sql = require('mssql');

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

const getConnection = async () => {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
  }
  return pool;
};

const connectMSSQL = async () => {
  try {
    await getConnection();
    console.log('✅ MSSQL Connected');
  } catch (err) {
    console.error('❌ MSSQL Connection Error:', err);
  }
};

module.exports = {
  sql,
  getConnection,
  connectMSSQL
};