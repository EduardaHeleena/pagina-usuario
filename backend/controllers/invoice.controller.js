/*const InvoiceService = require("../services/invoice.service");

const getOpenInvoices = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const invoices = await InvoiceService.getOpenInvoices(clienteId);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faturas em aberto" });
  }
};

const getLateInvoices = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const invoices = await InvoiceService.getLateInvoices(clienteId);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faturas em atraso" });
  }
};

const getPaidInvoices = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const invoices = await InvoiceService.getPaidInvoices(clienteId);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faturas pagas" });
  }
};

module.exports = {
  getOpenInvoices,
  getLateInvoices,
  getPaidInvoices,
};*/

const InvoiceService = require("../services/invoice.service");
const { visualizarBoleto } = require("../services/invoice.service");
const getOpenInvoices = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const invoices = await InvoiceService.getOpenInvoices(clienteId);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faturas em aberto" });
  }
};

const getLateInvoices = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const invoices = await InvoiceService.getLateInvoices(clienteId);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faturas em atraso" });
  }
};

const getPaidInvoices = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const invoices = await InvoiceService.getPaidInvoices(clienteId);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faturas pagas" });
  }
};



const visualizarBoletoController = async (req, res) => {
  try {
    const stream = await visualizarBoleto(req.params.invoiceNumber);
    stream.pipe(res); // stream é o PDF vindo do serviço de boleto
  } catch (error) {
    console.error("Erro ao visualizar boleto:", error);
    res.status(500).json({ erro: "Erro ao visualizar boleto" });
  }
};


module.exports = {
  getOpenInvoices,
  getLateInvoices,
  getPaidInvoices,
  visualizarBoletoController,
};
