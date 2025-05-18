const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'minhasecret123';

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'Admin criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar admin' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verifica se o admin existe
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    if (!admin) {
      return res.status(400).json({ message: 'Admin não encontrado' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET, { expiresIn: '24h' });

    // Retorna o token
    res.status(200).json({
      message: 'Login bem-sucedido',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

