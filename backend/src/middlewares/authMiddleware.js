const jwt = require('jsonwebtoken');

// Middleware de autenticación JWT / Middleware de autenticação JWT
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado / Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];  // ✅ Aquí quitamos el "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido / Token inválido' });
  }
};