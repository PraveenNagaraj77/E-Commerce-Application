const express = require('express');
const router = express.Router();

const {
    addToCart,
    fetchCartItems,
    updateCartItemQuantity,
    deleteCartItem,
    clearCart // ✅ Add this import
} = require('../../controllers/shop/cartController');

// 🛒 Add item to cart
router.post('/add', addToCart);

// 🛒 Fetch cart items by userId
router.get('/get/:userId', fetchCartItems);

// 🛒 Update cart item quantity
router.put('/updatecart', updateCartItemQuantity);

router.delete('/clear/:userId', clearCart);  // Place this first
router.delete('/:userId/:productId', deleteCartItem);


module.exports = router;
