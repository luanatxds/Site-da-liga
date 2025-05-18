const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'minhasecret123';

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Ex: "Bearer token"

  if (!token) {
    return res.status(403).json({ message: 'Token de autenticação necessário' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authenticate;

