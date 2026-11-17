const express = require("express");
const router = express.Router();

const {
  authMiddleWare,
} = require("../../controllers/auth/authController");

const {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
} = require("../../controllers/shop/cartController");

// Every cart operation requires authentication.
router.post("/add", authMiddleWare, addToCart);
router.get("/get/:userId", authMiddleWare, fetchCartItems);
router.put("/updatecart", authMiddleWare, updateCartItemQuantity);
router.delete("/clear/:userId", authMiddleWare, clearCart);
router.delete("/:userId/:productId", authMiddleWare, deleteCartItem);

module.exports = router;