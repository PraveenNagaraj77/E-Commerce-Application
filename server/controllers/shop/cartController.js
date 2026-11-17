const mongoose = require("mongoose");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const getAuthenticatedUserId = (req) => req.user.id;

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const getFormattedCartItems = async (cart) => {
  if (!cart || !cart.items.length) {
    return [];
  }

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice totalStock",
  });

  const validItems = cart.items.filter((item) => item.productId);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  return validItems.map((item) => ({
    productId: item.productId._id,
    image: item.productId.image,
    title: item.productId.title,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
    totalStock: item.productId.totalStock,
    quantity: item.quantity,
  }));
};

const addToCart = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { productId, quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    const existingQuantity =
      itemIndex === -1 ? 0 : cart.items[itemIndex].quantity;

    const newQuantity = existingQuantity + quantity;

    if (
      Number.isFinite(product.totalStock) &&
      newQuantity > product.totalStock
    ) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} item(s) available in stock`,
      });
    }

    if (itemIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[itemIndex].quantity = newQuantity;
    }

    await cart.save();

    const items = await getFormattedCartItems(cart);

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: { items },
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    const cart = await Cart.findOne({ userId });
    const items = await getFormattedCartItems(cart);

    return res.status(200).json({
      success: true,
      data: { items },
    });
  } catch (error) {
    console.error("Fetch Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cart items",
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { productId, quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      Number.isFinite(product.totalStock) &&
      quantity > product.totalStock
    ) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} item(s) available in stock`,
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (entry) => entry.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;
    await cart.save();

    const items = await getFormattedCartItems(cart);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: { items },
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart quantity",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ userId });

      return res.status(200).json({
        success: true,
        message: "Cart item deleted successfully",
        data: { items: [] },
      });
    }

    await cart.save();

    const items = await getFormattedCartItems(cart);

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: { items },
    });
  } catch (error) {
    console.error("Delete Cart Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete cart item",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    await Cart.findOneAndDelete({ userId });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: { items: [] },
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to clear cart",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
};