const express = require('express');
const cors = require('cors');
const seedDatabase = require("./seeds/initial_structure");

const app = express();
app.use(cors());
app.use(express.json());

const invoicesRoutes = require("./routes/invoices");
app.use("", invoicesRoutes);

if (process.env.NODE_ENV === "development") seedDatabase(); // Chama o script de seed

const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Fatura Service rodando em http://localhost:${port}`);
});
