// backend/src/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const path = require('path');

console.log('publicRoutes carregado');

// Rota pública para retornar membros sem exigir autenticação
router.get('/members', async (req, res) => {
    console.log('Rota /members acessada');

    try {
        const members = await prisma.member.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(members);
    } catch (error) {
        console.error('Erro ao buscar membros:', error);
        res.status(500).json({ error: 'Erro ao buscar membros' });
    }
});

// Nova rota para projetos

router.get('/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { id: 'desc' },
            include: { images: true }
        });

        // Adiciona o campo imageType para o projeto principal e o type para as imagens extras
        const projectsWithTypes = projects.map(project => {
            const ext = path.extname(project.imageUrl).toLowerCase();
            const imageType = ['.mp4', '.mov', '.avif', '.mkv'].includes(ext) ? 'video' : 'image';

            const imagesWithTypes = project.images.map(img => {
                const extImg = path.extname(img.url).toLowerCase();
                let type = 'image';
                if (['.mp4', '.mov', '.mkv', '.webm'].includes(extImg)) {
                    type = 'video';
                }
                return { ...img, type };
            });

            return {
                ...project,
                imageType,
                images: imagesWithTypes
            };
        });

        res.json(projectsWithTypes);

    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

module.exports = router;
