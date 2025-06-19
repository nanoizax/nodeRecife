const jwt = require('jsonwebtoken');

// Login básico con JWT / Login básico com JWT
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Simulación de validación (mock) / Simulação de validação (mock)
  if (username === 'admin' && password === '123456') {
    const token = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas / Credenciais inválidas' });
  }
};