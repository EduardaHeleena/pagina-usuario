const express = require("express");
const path = require("path");
const fs = require("fs");
const uploadRoutes = require("./routes/upload");
const app = express();
const PORT = 3003;
const pastaPublic = path.join(__dirname, "public");
const pastaPerfil = path.join(pastaPublic, "perfil");
const pastaArquivos = path.join(__dirname, "public", "arquivos");

if (!fs.existsSync(pastaPerfil)) {
  fs.mkdirSync(pastaPerfil, { recursive: true });
}
if (!fs.existsSync(pastaArquivos)) {
  fs.mkdirSync(pastaArquivos, { recursive: true });
}
app.use("/arquivos", express.static(pastaArquivos));
app.use("/arquivos", express.static(pastaPublic));
app.use(uploadRoutes);
app.listen(PORT, () => {
  console.log(`File service rodando em http://localhost:${PORT}`);
});
