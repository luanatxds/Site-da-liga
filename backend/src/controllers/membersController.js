const prisma = require('../lib/prisma');

async function getMemberById(req, res) {
  const { id } = req.params;

  try {
    const member = await prisma.member.findUnique({
      where: { id: parseInt(id) }
    });

    if (!member) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json(member);
  } catch (error) {
    console.error('Erro ao buscar membro por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { getMemberById };

