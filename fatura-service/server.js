const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

app.get('/faturas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faturas');
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar todas as faturas:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
});

const faturasPagasRoutes = require('./routes/faturas');
const faturasAbertasRoutes = require('./routes/faturas-abertas');
const faturasAtrasoRoutes = require('./routes/faturas-atraso');
app.use(faturasPagasRoutes);
app.use(faturasAbertasRoutes);
app.use(faturasAtrasoRoutes);

app.listen(PORT, () => {
  console.log(`Fatura Service rodando em http://localhost:${PORT}`);
});
