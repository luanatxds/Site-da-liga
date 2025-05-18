const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.JWT_SECRET || 'minhasecret123';

// Simulando um usuário fixo 
const adminUser = {
  email: 'admin@lfti.com',
  passwordHash: bcrypt.hashSync('LFTI@Adm2025!', 10) // senha: 123456
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email !== adminUser.email) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
