const express = require("express");
const { getPaypalClientId, createPayment, executePayment } = require("../../controllers/shop/paypalController");

const router = express.Router();

router.get("/config", getPaypalClientId); // Fetch PayPal Client ID
router.post("/pay", createPayment);       // Create PayPal Payment
router.post("/execute", executePayment);  // Capture Payment

module.exports = router;
