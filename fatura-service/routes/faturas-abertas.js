const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/faturas-abertas/:clienteId", async (req, res) => {

  const { clienteId } = req.params;
  const { page = 1, limit = 5 } = req.query;
  const fileServerUrl = 'http://localhost:3003/arquivos';

  try {
    const where = `
      WHERE cliente_id = ?
        AND data_liquidacao IS NULL
        AND data_vencimento >= CURDATE()
    `;
    const params = [clienteId];

    const countQuery = `SELECT COUNT(*) as total FROM faturas ${where}`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *,
        CONCAT('${fileServerUrl}/', boleto_path) AS boleto_url,
        CONCAT('${fileServerUrl}/', nota_fiscal_path) AS nota_fiscal_url
      FROM faturas
      ${where}
      ORDER BY data_vencimento ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [faturas] = await db.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      faturas
    });
  } catch (err) {
    console.error("Erro ao buscar faturas em aberto:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas em aberto' });
  }
});

module.exports = router;

