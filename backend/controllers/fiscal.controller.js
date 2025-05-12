const FiscalService = require("../services/fiscal.service");

const visualizarNotaFiscal = async (req, res) => {
  try {
    await FiscalService.visualizarNotaFiscal(req.params.invoiceNumber, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao visualizar nota fiscal" });
  }
};

const downloadNotaFiscal = async (req, res) => {
  try {
    await FiscalService.downloadNotaFiscal(req.params.invoiceNumber, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao baixar nota fiscal" });
  }
};

const listarNotasFiscais = async (req, res) => {
  try {
    const notas = await FiscalService.listarNotasFiscais();
    res.json(notas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar notas fiscais" });
  }
};

module.exports = {
  visualizarNotaFiscal,
  downloadNotaFiscal,
  listarNotasFiscais,
};
