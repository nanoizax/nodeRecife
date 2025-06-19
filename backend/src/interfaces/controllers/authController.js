const jwt = require('jsonwebtoken');

// Login básico con JWT / Login básico com JWT
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Simulación de autenticación / Simulação de autenticação
  // Aquí puedes reemplazar por una validación real en MSSQL
  if (username === 'admin' && password === '123456') {
    // Generar token JWT / Gerar token JWT
    const token = jwt.sign(
      { userId: 1, role: 'admin' },                  // Payload
      process.env.JWT_SECRET,                        // Clave secreta
      { expiresIn: '1h' }                            // Tiempo de expiración
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas / Credenciais inválidas' });
  }
};