const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

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
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Verifica se o usuário já existe
    const id = 1;

    const [rows] = await authDb.query(`SELECT * FROM users WHERE id = ?`, [id]);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await authDb.query(
        `INSERT INTO users (id, email, password, admin) VALUES (?, ?, ?, ?)`,
        [id, 'teste@email.com', hashedPassword, true]
      );
      console.log("Usuário de seed inserido.");
    } else {
      console.log("Usuário já existe, não foi inserido novamente.");
    }

    await authDb.end();
  } catch (error) {
    console.error("Erro ao criar banco e inserir usuário:", error);
  }
}

module.exports = seedDatabase;
