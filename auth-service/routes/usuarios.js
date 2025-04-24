const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/perfil',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `perfil_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

router.put('/usuario/atualizar/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const fotoPath = req.file ? `/uploads/perfil/${req.file.filename}` : null;

  try {
    const query = `
      UPDATE usuarios 
      SET username = ?, ${fotoPath ? 'foto_perfil = ?' : ''}
      WHERE id = ?
    `;
    const params = fotoPath ? [nome, fotoPath, id] : [nome, id];

    await db.query(query, params);
    res.json({ success: true, message: "Perfil atualizado com sucesso!", foto_perfil: fotoPath });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro ao atualizar perfil." });
  }
});

module.exports = router;