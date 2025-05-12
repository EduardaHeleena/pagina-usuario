/*const pool = require("../config/database");

exports.getOpenInvoices = async (req, res) => {
  const { clienteId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  try {
    const where = `
      WHERE id_client = ?
        AND payment_date IS NULL
        AND due_date >= CURDATE()
    `;
    const params = [clienteId];

    const countQuery = `SELECT COUNT(*) as total FROM invoices ${where}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *
      FROM invoices
      ${where}
      ORDER BY due_date ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [invoices] = await pool.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      invoices
    });
  } catch (err) {
    console.error("Erro ao buscar faturas em aberto:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas em aberto' });
  }
};

exports.getOverdueInvoices = async (req, res) => {
  const { clienteId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  try {
    const where = `
      WHERE id_client = ?
        AND payment_date IS NULL
        AND due_date < CURDATE()
    `;
    const params = [clienteId];

    const countQuery = `SELECT COUNT(*) as total FROM invoices ${where}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *
      FROM invoices
      ${where}
      ORDER BY due_date ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [invoices] = await pool.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      invoices
    });
  } catch (err) {
    console.error("Erro ao buscar faturas vencidas:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas vencidas' });
  }
};

exports.getPaidInvoices = async (req, res) => {
  const { clienteId } = req.params;
  const { mes, ano, page = 1, limit = 5 } = req.query;

  if (!clienteId) {
    return res.status(400).json({ error: "ID do cliente não informado." });
  }

  try {
    let where = "WHERE id_client = ? AND payment_date IS NOT NULL";
    const params = [clienteId];

    if (mes) {
      where += " AND MONTH(payment_date) = ?";
      params.push(Number(mes));
    }

    if (ano) {
      where += " AND YEAR(payment_date) = ?";
      params.push(Number(ano));
    }

    const countQuery = `SELECT COUNT(*) as total FROM invoices ${where}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *
      FROM invoices
      ${where}
      ORDER BY payment_date DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [invoices] = await pool.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      invoices
    });
  } catch (err) {
    console.error("Erro ao buscar faturas pagas:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas pagas' });
  }
};*/
const pool = require("../config/database");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.getOpenInvoices = async (req, res) => {
  const { clienteId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  try {
    const where = `
      WHERE id_client = ?
        AND payment_date IS NULL
        AND due_date >= CURDATE()
    `;
    const params = [clienteId];

    const countQuery = `SELECT COUNT(*) as total FROM invoices ${where}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *
      FROM invoices
      ${where}
      ORDER BY due_date ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [invoices] = await pool.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      invoices
    });
  } catch (err) {
    console.error("Erro ao buscar faturas em aberto:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas em aberto' });
  }
};

exports.getOverdueInvoices = async (req, res) => {
  const { clienteId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  try {
    const where = `
      WHERE id_client = ?
        AND payment_date IS NULL
        AND due_date < CURDATE()
    `;
    const params = [clienteId];

    const countQuery = `SELECT COUNT(*) as total FROM invoices ${where}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *
      FROM invoices
      ${where}
      ORDER BY due_date ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [invoices] = await pool.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      invoices
    });
  } catch (err) {
    console.error("Erro ao buscar faturas vencidas:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas vencidas' });
  }
};

exports.getPaidInvoices = async (req, res) => {
  const { clienteId } = req.params;
  const { mes, ano, page = 1, limit = 5 } = req.query;

  if (!clienteId) {
    return res.status(400).json({ error: "ID do cliente não informado." });
  }

  try {
    let where = "WHERE id_client = ? AND payment_date IS NOT NULL";
    const params = [clienteId];

    if (mes) {
      where += " AND MONTH(payment_date) = ?";
      params.push(Number(mes));
    }

    if (ano) {
      where += " AND YEAR(payment_date) = ?";
      params.push(Number(ano));
    }

    const countQuery = `SELECT COUNT(*) as total FROM invoices ${where}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT *
      FROM invoices
      ${where}
      ORDER BY payment_date DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, Number(limit), offset];

    const [invoices] = await pool.query(dataQuery, dataParams);

    res.json({
      total,
      pagina: Number(page),
      limite: Number(limit),
      invoices
    });
  } catch (err) {
    console.error("Erro ao buscar faturas pagas:", err);
    res.status(500).json({ error: 'Erro ao buscar faturas pagas' });
  }
};