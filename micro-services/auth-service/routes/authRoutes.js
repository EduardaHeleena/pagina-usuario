// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Endpoint de login
router.post("/login", login);

// Endpoint para verificar se o token é válido
router.get("/verify-token", verifyToken, (req, res) => {
  res.json({ message: "Token é válido", user: req.user });
});

module.exports = router;
