const express = require("express");
const router = express.Router();
const bilController = require("../controllers/bil.controller");

// Visualizar o boleto no navegador
router.get("/boleto/:invoiceNumber/visualizar", bilController.visualizarBoleto);

// Baixar o boleto como PDF
router.get("/boleto/:invoiceNumber/download", bilController.downloadBoleto);

module.exports = router;
