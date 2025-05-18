const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma'); // Verifique se está importado corretamente
const authenticate = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 📁 Criação do diretório uploads se não existir
const uploadFolder = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;  // Gera nome único com UUID
    cb(null, filename);
  }
});

const upload = multer({ storage });

// 👉 GET /projects - Listar todos os projetos
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true
      },
      orderBy: {
        year: 'desc'
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

// 👉 GET /projects/:id - Obter um projeto por ID
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true, // Se quiser incluir as imagens extras
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar projeto' });
  }
});

// 👉 POST /projects - Criar novo projeto
router.post('/', authenticate, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'extraImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const { name, type, description, year } = req.body;

    if (!name || !type || !req.files['coverImage']) {
      return res.status(400).json({ error: 'Nome, tipo e imagem principal são obrigatórios' });
    }

    // ✅ Cover Image
    const coverImageFile = req.files['coverImage'][0];
    const coverImageUrl = `/uploads/${coverImageFile.filename}`;

    // ✅ Extra Images
    const extraImagesFiles = req.files['extraImages'] || [];
    const extraImagesUrls = extraImagesFiles.map(file => ({
      url: `/uploads/${file.filename}`
    }));

    const project = await prisma.project.create({
      data: {
        name,
        type,
        description,
        imageUrl: coverImageUrl,
        year: parseInt(year) || new Date().getFullYear(),
        images: {
          create: extraImagesUrls
        }
      },
      include: {
        images: true
      }
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});




// 👉 PUT /projects/:id - Atualizar projeto
router.put('/:id', authenticate, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'extraImages', maxCount: 10 }
]), async (req, res) => {
  const { id } = req.params;
  const { name, type, description, year, imageUrl, existingExtraImages } = req.body;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { images: true }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Capa nova ou existente
    let newCoverImageUrl = existingProject.imageUrl;

    if (req.files['coverImage']?.length > 0) {
      // Nova capa enviada, apaga antiga
      const newCoverImageFile = req.files['coverImage'][0];
      newCoverImageUrl = `/uploads/${newCoverImageFile.filename}`;

      if (existingProject.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../', existingProject.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn('Erro ao deletar imagem antiga:', err.message);
          else console.log('Imagem de capa antiga deletada:', oldImagePath);
        });
      }
    } else if (imageUrl) {
      // Mantém a capa antiga (URL vindo do frontend)
      newCoverImageUrl = imageUrl;
    }

    // Imagens extras
    let newExtraImagesUrls = [];

    if (req.files['extraImages']?.length > 0) {
      newExtraImagesUrls = req.files['extraImages'].map(file => ({
        url: `/uploads/${file.filename}`
      }));
    } else if (existingExtraImages) {
      try {
        const parsed = JSON.parse(existingExtraImages);
        newExtraImagesUrls = parsed.map(url => ({ url }));
      } catch (e) {
        newExtraImagesUrls = [];
      }
    }

    // Atualiza projeto
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        description,
        year: year ? parseInt(year) : existingProject.year,
        imageUrl: newCoverImageUrl,
        images: {
          deleteMany: {}, // Apaga todas imagens antigas
          create: newExtraImagesUrls // Cria novas imagens extras
        }
      },
      include: { images: true }
    });

    return res.json(updatedProject);

  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    return res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});




// 👉 DELETE /projects/:id - Deletar projeto
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).end();
  } catch (error) {
    console.error('Erro ao excluir projeto:', error); // <--- Adicione isto
    res.status(500).json({ error: 'Erro ao excluir projeto' });
  }
});


module.exports = router;
