const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

dotenv.config();

// Criar pasta uploads se não existir
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middlewares
app.use(cors());


// Servir a pasta de uploads
app.use('/uploads', express.static(uploadFolder));

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas públicas
console.log('Registrando publicRoutes...');
const publicRoutes = require('./routes/publicRoutes');
app.use('/public', express.json(), publicRoutes);

// Rotas protegidas
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const projectRoutes = require('./routes/projectRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

app.use('/auth', express.json(), authRoutes);
app.use('/members', memberRoutes);
app.use('/projects', projectRoutes);
app.use('/newsletter', express.json(), newsletterRoutes);

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
