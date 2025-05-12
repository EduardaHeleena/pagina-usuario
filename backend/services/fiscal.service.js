const axios = require("axios");
const FISCAL_SERVICE_URL = process.env.FISCAL_SERVICE_URL;

const criarNotaFiscal = async (dadosNota) => {
  try {
    const response = await axios.post(`${FISCAL_SERVICE_URL}/nota-fiscal`, dadosNota);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar nota fiscal:", error);
    throw new Error("Não foi possível criar a nota fiscal");
  }
};

const visualizarNotaFiscal = async (invoiceNumber, res) => {
  try {
    const response = await axios.get(`${FISCAL_SERVICE_URL}/nota-fiscal/${invoiceNumber}/visualizar`, {
      responseType: "stream"
    });
    res.setHeader("Content-Type", "application/pdf");
    response.data.pipe(res);
  } catch (error) {
    console.error("Erro ao visualizar nota:", error);
    res.status(500).json({ erro: "Erro ao visualizar PDF" });
  }
};

const downloadNotaFiscal = async (invoiceNumber, res) => {
  try {
    const response = await axios.get(`${FISCAL_SERVICE_URL}/nota-fiscal/${invoiceNumber}/download`, {
      responseType: "stream"
    });
    res.setHeader("Content-Disposition", `attachment; filename=nota_${invoiceNumber}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    response.data.pipe(res);
  } catch (error) {
    console.error("Erro ao baixar nota:", error);
    res.status(500).json({ erro: "Erro ao baixar PDF" });
  }
};

const listarNotasFiscais = async () => {
  const response = await axios.get(`${FISCAL_SERVICE_URL}/nota-fiscal`);
  return response.data;
};

module.exports = {
  criarNotaFiscal,
  visualizarNotaFiscal,
  downloadNotaFiscal,
  listarNotasFiscais
};
