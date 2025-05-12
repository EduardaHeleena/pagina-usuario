const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await authService.login(email, senha);

    res.json(result);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Erro interno do servidor" });
  }
};
