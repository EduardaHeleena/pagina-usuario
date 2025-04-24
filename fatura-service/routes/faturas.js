const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/faturas-pagas/:clienteId", async (req, res) => {
  const { clienteId } = req.params;
  const { mes, ano, page = 1, limit = 5 } = req.query;
  const fileServerUrl = 'http://localhost:3003/arquivos';

  if (!clienteId) {
    return res.status(400).json({ error: "ID do cliente não informado." });
  }

  try {
    let where = "WHERE cliente_id = ? AND data_liquidacao IS NOT NULL";
    const params = [clienteId];

    if (mes) {
      where += " AND MONTH(data_liquidacao) = ?";
      params.push(Number(mes));
    }

    if (ano) {
      where += " AND YEAR(data_liquidacao) = ?";
      params.push(Number(ano));
    }

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
      ORDER BY data_liquidacao DESC
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
    console.error("Erro ao buscar faturas pagas:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas pagas' });
  }
});

module.exports = router;



