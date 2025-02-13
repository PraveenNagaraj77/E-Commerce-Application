const paypal = require("paypal-rest-sdk");
require("dotenv").config();

// Configure PayPal with environment variables
paypal.configure({
  mode: process.env.PAYPAL_MODE, // 'sandbox' or 'live'
  client_id: process.env.PAYPAL_CLIENT,
  client_secret: process.env.PAYPAL_SECRET,
});

// Get PayPal Client ID for frontend
exports.getPaypalClientId = (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT });
};

// Create PayPal Order
exports.createPayment = async (req, res) => {
  try {
    const { totalAmount } = req.body; // Amount in USD

    const createPaymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/payment-success", // ✅ Replace with your frontend success page
        cancel_url: "http://localhost:5173/payment-cancel", // ✅ Replace with frontend cancel page
      },
      transactions: [
        {
          amount: {
            total: totalAmount,
            currency: "USD",
          },
          description: "Payment for your order",
        },
      ],
    };

    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        console.error("❌ PayPal Payment Error:", error);
        return res.status(500).json({ error: "Payment creation failed" });
      }

      // ✅ Ensure approval link exists before accessing
      const approvalUrl = payment?.links?.find((link) => link.rel === "approval_url")?.href;
      if (!approvalUrl) {
        return res.status(500).json({ error: "Approval URL not found" });
      }

      res.json({ approvalUrl });
    });
  } catch (error) {
    console.error("❌ PayPal Create Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Capture PayPal Payment (When approved)
exports.executePayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    if (!paymentId || !payerId) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const executePaymentJson = {
      payer_id: payerId,
    };

    paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
      if (error) {
        console.error("❌ PayPal Execution Error:", error);
        return res.status(500).json({ error: "Payment execution failed" });
      }

      res.json({ message: "✅ Payment successful", payment });
    });
  } catch (error) {
    console.error("❌ PayPal Execute Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
