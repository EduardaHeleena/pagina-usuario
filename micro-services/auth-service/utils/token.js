const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, name: user.nome }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = {
  generateToken
}