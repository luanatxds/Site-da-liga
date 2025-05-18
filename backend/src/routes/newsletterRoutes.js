const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticate = require('../middleware/authMiddleware');

// Rota pública: cadastro de e-mail
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }

  try {
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    const newEmail = await prisma.newsletter.create({ data: { email } });
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar e-mail', error });
  }
});

// Rota protegida: listar e-mails (somente admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const emails = await prisma.newsletter.findMany();
    res.json(emails);
  } catch (error) {
    console.error('Erro ao buscar e-mails:', error);
    res.status(500).json({ message: 'Erro ao buscar e-mails', error });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
  const { id } = req.params;

  const emailExists = await prisma.newsletter.findUnique({
    where: { id: Number(id) },
  });

  if (!emailExists) {
    return res.status(404).json({ error: "Email não encontrado" });
  }

  await prisma.newsletter.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({ message: "Email excluído com sucesso" });

} catch (error) {
  console.error("Erro ao excluir email:", error);
  res.status(500).json({ error: error.message || "Erro interno no servidor" });
}
});


module.exports = router;
