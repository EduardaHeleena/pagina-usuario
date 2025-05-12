const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const seedDatabase = require("./seeds/initial_structure");

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Importando as rotas
const authRoutes = require("./routes/auth.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const userRoutes = require("./routes/user.routes");
const fiscalRoutes = require("./routes/fiscal.routes");
const boletoRoutes = require("./routes/bil.routes");
//const notificationRoutes = require("./routes/notification.routes");


// Registrando as rotas na aplicação
app.use("", authRoutes);
app.use("", invoiceRoutes);
app.use("", userRoutes);
app.use("", fiscalRoutes);
app.use("", boletoRoutes);
//app.use("/notificacoes", notificationRoutes);

if (process.env.NODE_ENV === "development") seedDatabase(); // Chama o script de seed

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
