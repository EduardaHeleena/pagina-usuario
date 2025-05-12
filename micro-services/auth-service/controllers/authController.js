const bcrypt = require("bcrypt");
const pool = require("../config/database");
const { generateToken } = require("../utils/token");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const user = results[0];

    // Compara a senha criptografada
    const senhaValida = await bcrypt.compare(senha, user.password);
    if (senhaValida) {
      const token = generateToken(user); // Gera o JWT
      res.json({
        id: user.id,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ error: "Senha inválida" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
