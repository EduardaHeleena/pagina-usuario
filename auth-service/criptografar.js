const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pagina_usuario",
});

db.connect();

const email = "teste@email.com";
const senha = "123456";

const senhaCriptografada = bcrypt.hashSync(senha, 10);

db.query(
  "UPDATE usuarios SET senha = ? WHERE email = ?",
  [senhaCriptografada, email],
  (err, result) => {
    if (err) throw err;
    console.log("Senha criptografada com sucesso!");
    db.end();
  }
);
