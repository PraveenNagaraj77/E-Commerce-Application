const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

// ✅ Add to Cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate request body
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product exists in cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            cart.items.push({ productId, quantity });
        } else {
            cart.items[itemIndex].quantity += quantity;
        }

        // Save updated cart
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            data: cart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to add product to cart"
        });
    }
};

// ✅ Fetch Cart Items
const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                data: { items: [] }
            });
        }

        const validItems = cart.items.filter(item => item.productId);
        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        const populatedCartItems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity
        }));

        res.status(200).json({
            success: true,
            data: { items: populatedCartItems }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch cart items"
        });
    }
};

// ✅ Update Cart Item Quantity
const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body; // Get data from body

        // Validate inputs
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Product ID are required"
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Update the quantity
        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart item quantity updated successfully",
            data: cart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to update cart item quantity"
        });
    }
};

// ✅ Delete Cart Item
const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Product ID are required"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        cart.items.splice(itemIndex, 1);

        // If cart is empty after deletion, remove it
        if (cart.items.length === 0) {
            await Cart.findOneAndDelete({ userId });
            return res.status(200).json({
                success: true,
                message: "Cart is now empty, cart deleted"
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart item deleted successfully",
            data: cart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to delete cart item"
        });
    }
};


// ✅ Clear Entire Cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Find and delete the cart
        const cart = await Cart.findOneAndDelete({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        return res.status(200).json({ success: true, message: "Cart cleared successfully" });

    } catch (error) {
        console.error("❌ Clear Cart Error:", error);
        return res.status(500).json({ success: false, message: "Unable to clear cart" });
    }
};

module.exports = {
    addToCart,
    fetchCartItems,
    updateCartItemQuantity,
    deleteCartItem,
    clearCart
};
