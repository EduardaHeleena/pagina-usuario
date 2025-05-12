/*const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");

// Rotas para faturas
router.get("/faturas-abertas/:clienteId", InvoiceController.getOpenInvoices);
router.get("/faturas-atraso/:clienteId", InvoiceController.getLateInvoices);
router.get("/faturas-pagas/:clienteId", InvoiceController.getPaidInvoices);

module.exports = router;*/
const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");

// Rotas para faturas
router.get("/faturas-abertas/:clienteId", InvoiceController.getOpenInvoices);
router.get("/faturas-atraso/:clienteId", InvoiceController.getLateInvoices);
router.get("/faturas-pagas/:clienteId", InvoiceController.getPaidInvoices);
router.get("/boleto/:invoiceNumber/visualizar", InvoiceController.visualizarBoletoController);


module.exports = router;
