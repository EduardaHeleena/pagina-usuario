const axios = require("axios");
const UserRepository = require("../repositories/user.repository"); // Importa para buscar no banco

const login = async (email, senha) => {
  if (!email || !senha) {
    throw { status: 400, message: "Email e senha são obrigatórios" };
  }

  try {
    // Primeiro faz o login no serviço de autenticação
    const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/login`, {
      email,
      senha,
    });

    const { id, token } = response.data;

    // Agora busca os dados adicionais do usuário no banco
    const user = await UserRepository.getUserById(id);

    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    // Retorna todos os dados que você precisa
    return {
      id,
      nome: user.name,
      email: user.email,
      token,
      foto_perfil: user.profile_picture_base64,
    };

  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { status: 401, message: "Credenciais inválidas" };
    } else {
      console.error("Erro no login:", error);
      throw { status: 500, message: "Erro ao realizar login" };
    }
  }
};

module.exports = {
  login,
};
