const express = require("express");
const router = express.Router();
const invoicesController = require("../controllers/invoicesController");

router.get("/faturas-abertas/:clienteId", invoicesController.getOpenInvoices);
router.get("/faturas-atraso/:clienteId", invoicesController.getOverdueInvoices);
router.get("/faturas-pagas/:clienteId", invoicesController.getPaidInvoices);


module.exports = router;
