const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const pastaPerfil = path.join(__dirname, '../public/perfil');
if (!fs.existsSync(pastaPerfil)) {
  fs.mkdirSync(pastaPerfil, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaPerfil);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/upload/perfil', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const caminho = `perfil/${req.file.filename}`;
  res.status(200).json({ caminho });
});

module.exports = router;
