const mysql = require("mysql2/promise");
const fs = require("fs").promises; // Importa o fs com suporte a Promises
const path = require("path");      // Para montar caminho corretamente

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Cria o banco se não existir
    await connection.query("CREATE DATABASE IF NOT EXISTS `" + process.env.DB_NAME + "`");

    // Fecha a conexão atual
    await connection.end();

    // Agora conecta usando o banco correto
    const authDb = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    // Cria a tabela users
    await authDb.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        profile_picture MEDIUMBLOB,
        image_type VARCHAR(10),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const id = 1;

    const [rows] = await authDb.query(`SELECT * FROM users WHERE id = ?`, [id]);
    if (rows.length === 0) {
      // Lê a imagem como buffer
      const { imageBuffer, image_type } = await getProfileImage();

      // Insere o usuário com a imagem e o nome do arquivo
      await authDb.query(`
        INSERT INTO users (id, email, name, profile_picture, image_type) VALUES (?, ?, ?, ?, ?)
      `, [
        id,
        "teste@email.com",
        "Mr. Teste",
        imageBuffer,
        image_type
      ]);

      console.log("Usuário de seed inserido.");
    } else {
      console.log("Usuário já existe, não foi inserido novamente.");
    }

    await authDb.end();
  } catch (error) {
    console.error("Erro ao criar banco e inserir usuário:", error);
  }
}

// Função para buscar qualquer arquivo que comece com "profile" e tenha extensão de imagem
async function getProfileImage() {
  const directoryPath = path.join(__dirname, "../../project_files/seed/");
  const files = await fs.readdir(directoryPath);

  // Filtra arquivos que começam com "profile" e têm extensões comuns de imagem
  const profileFile = files.find(file => /^profile\.(jpeg|jpg|png)$/i.test(file));

  if (!profileFile) {
    throw new Error("Nenhuma imagem de perfil encontrada.");
  }

  const imagePath = path.join(directoryPath, profileFile);
  const imageBuffer = await fs.readFile(imagePath);
  const imageExtension = path.extname(profileFile).slice(1).toLowerCase();

  return { 
    imageBuffer, 
    image_type: imageExtension
  };
}

module.exports = seedDatabase;
