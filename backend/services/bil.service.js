const axios = require("axios");
const BOLETO_SERVICE_URL = process.env.BOLETO_SERVICE_URL;

const visualizarBoleto = async (invoiceNumber, res) => {
  try {
    const response = await axios.get(`${BOLETO_SERVICE_URL}/boleto/${invoiceNumber}/visualizar`, {
      responseType: "stream"
    });
    res.setHeader("Content-Type", "application/pdf");
    response.data.pipe(res);
  } catch (error) {
    console.error("Erro ao visualizar boleto:", error);
    res.status(500).json({ erro: "Erro ao visualizar PDF do boleto" });
  }
};

const downloadBoleto = async (invoiceNumber, res) => {
  try {
    const response = await axios.get(`${BOLETO_SERVICE_URL}/boleto/${invoiceNumber}/download`, {
      responseType: "stream"
    });
    res.setHeader("Content-Disposition", `attachment; filename=boleto_${invoiceNumber}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    response.data.pipe(res);
  } catch (error) {
    console.error("Erro ao baixar boleto:", error);
    res.status(500).json({ erro: "Erro ao baixar PDF do boleto" });
  }
};

module.exports = {
  visualizarBoleto,
  downloadBoleto
};
