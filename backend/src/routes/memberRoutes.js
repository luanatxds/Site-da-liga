const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authenticate = require('../middleware/authMiddleware');
const { getMemberById } = require('../controllers/membersController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Criação do diretório uploads se não existir
const uploadFolder = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// ⚙️ Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });


// 👉 GET /members - Buscar todos os membros
router.get('/', authenticate, async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(400).json({ error: 'Erro ao buscar membros' });
  }
});

router.get('/:id', authenticate, getMemberById);

// 👉 POST /members - Criar novo membro com upload de imagem
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { name, role, course, admission, linkedin } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newMember = await prisma.member.create({
      data: {
        name,
        role,
        course,
        admission: new Date(admission),
        linkedin,
        imageUrl
      }
    });
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar membro' });
  }
});


// 👉 PUT /members/:id - Atualizar membro (com suporte opcional a imagem)
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, role, course, admission, linkedin } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

  try {
    const updated = await prisma.member.update({
      where: { id: parseInt(id) },
      data: {
        name,
        role,
        course,
        admission: admission ? new Date(admission) : undefined,
        linkedin,
        imageUrl
      }
    });
    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    res.status(400).json({ error: 'Erro ao atualizar membro' });
  }
});

// 👉 DELETE /members/:id - Deletar membro
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.member.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Membro deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar membro' });
  }
});

module.exports = router;
