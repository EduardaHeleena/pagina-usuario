const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const db = require("./db");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado" });

    const user = results[0];
    bcrypt.compare(senha, user.senha, (err, result) => {
      if (result) {
        res.json({
          id: user.id,
          nome: user.nome, 
          email: user.email,
          foto_perfil: user.foto_perfil || null,
          token: "fake-jwt-token"
        });
      } else {
        res.status(401).json({ error: "Senha inválida" });
      }
    });
  });
});

const upload = multer({ dest: "temp/" });

app.put("/usuario/perfil", upload.single("foto"), async (req, res) => {
  const { id, nome } = req.body;
  let fotoPerfil = null;

  try {
    if (req.file) {
      const formData = new FormData();
      formData.append("foto", fs.createReadStream(req.file.path));
      formData.append("pasta", "perfil");

      const resposta = await axios.post("http://localhost:3003/upload/perfil", formData, {
        headers: formData.getHeaders(),
      });

      fotoPerfil = resposta.data.caminho;;
      fs.unlinkSync(req.file.path);
    }

    let query = "UPDATE usuarios SET nome = ?";
    const params = [nome];

    if (fotoPerfil) {
      query += ", foto_perfil = ?";
      params.push(fotoPerfil);
    }

    query += " WHERE id = ?";
    params.push(id);

    await db.promise().query(query, params);

    res.json({ message: "Perfil atualizado com sucesso", foto_perfil: fotoPerfil });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro ao atualizar perfil." });
  }
});

app.listen(port, () => {
  console.log(`Auth Service rodando na porta ${port}`);
});
