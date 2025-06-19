const mongoose = require('mongoose');

// Función para conectar a MongoDB / Função para conectar ao MongoDB
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,               // Usar nuevo parser / Usar novo parser
      useUnifiedTopology: true,            // Topología unificada / Topologia unificada
    });
    console.log('✅ Conexión a MongoDB establecida / Conexão ao MongoDB estabelecida');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB / Erro ao conectar ao MongoDB:', error);
  }
};

module.exports = connectMongo;