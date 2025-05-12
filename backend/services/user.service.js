const UserRepository = require("../repositories/user.repository");

const getAllUsers = async () => {
  return await UserRepository.getAllUsers();
};

const getUserById = async (id) => {
  const user = await UserRepository.getUserById(id);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  return user;
};

const updateUser = async (id, name, profile_picture_base64) => {
  await UserRepository.updateUser(id, name, profile_picture_base64);
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser
};
