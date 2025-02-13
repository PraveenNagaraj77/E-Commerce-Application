const express = require("express");
const { 
  placeOrder, 
  getUserOrders, 
  getOrderDetails, 
  cancelOrder, 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder 
} = require("../../controllers/shop/orderController");

const router = express.Router();

// ✅ Get all orders (Admin View)
router.get("/", getAllOrders);

// ✅ Place a new order
router.post("/", placeOrder);

// ✅ Get all orders for a user
router.get("/:userId", getUserOrders);

// ✅ Get order details
router.get("/details/:orderId", getOrderDetails);  // ⬅️ This is the correct route

// ✅ Update order status
router.put("/:orderId", updateOrderStatus);

// ✅ Cancel an order
router.put("/cancel/:orderId", cancelOrder);

// ✅ Delete an order
router.delete("/:orderId", deleteOrder);

module.exports = router;
