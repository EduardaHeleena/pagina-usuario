const BoletoService = require("../services/bil.service");

const visualizarBoleto = async (req, res) => {
  try {
    await BoletoService.visualizarBoleto(req.params.invoiceNumber, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao visualizar boleto" });
  }
};

const downloadBoleto = async (req, res) => {
  try {
    await BoletoService.downloadBoleto(req.params.invoiceNumber, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao baixar boleto" });
  }
};

module.exports = {
  visualizarBoleto,
  downloadBoleto,
};
