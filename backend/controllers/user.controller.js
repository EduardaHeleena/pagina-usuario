const UserService = require("../services/user.service");

const getUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, nome, foto } = req.body;

    // Chama o serviço para atualizar o usuário
    await UserService.updateUser(id, nome, foto);

    const user = await UserService.getUserById(id);
    return res.status(200).json({
      nome: user.name,
      foto_perfil: user.profile_picture_base64
    })
  } catch (err) {
    console.error("Erro ao atualizar usuário.", err);
    return res.status(500).json({ message: 'Erro no servidor ao atualizar usuário.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser
};
