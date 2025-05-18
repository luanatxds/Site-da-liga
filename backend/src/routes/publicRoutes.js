// backend/src/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

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
             include: { images: true }  // Inclui as imagens extras de cada projeto 
            });
        res.json(projects);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

module.exports = router;
