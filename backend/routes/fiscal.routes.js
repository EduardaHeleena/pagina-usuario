const express = require("express");
const router = express.Router();
const FiscalController = require("../controllers/fiscal.controller");

// Rota para visualizar PDF da nota fiscal via invoice_number
router.get("/nota-fiscal/:invoiceNumber/visualizar", FiscalController.visualizarNotaFiscal);

// Rota para download da nota fiscal via invoice_number
router.get("/nota-fiscal/:invoiceNumber/download", FiscalController.downloadNotaFiscal);

// Rota para listar todas as notas
router.get("/nota-fiscal", FiscalController.listarNotasFiscais);

module.exports = router;