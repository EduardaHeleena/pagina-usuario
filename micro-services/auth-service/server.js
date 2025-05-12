// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const seedDatabase = require("./seeds/initial_structure");

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Rotas
app.use(authRoutes);

if (process.env.NODE_ENV === "development") seedDatabase(); // Chama o script de seed

app.listen(port, () => {
  console.log(`Auth Service rodando na porta ${port}`);
});
