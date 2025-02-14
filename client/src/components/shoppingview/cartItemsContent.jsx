import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQuantity,
  deleteCartItem,
  fetchCart,
} from "../../store/shop/cartSlice";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UsercartItemsContent = ({ cartItem, userId }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  // Select cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const finalUserId = userId || currentUser?.id;

  // Fetch updated cart when component mounts
  useEffect(() => {
    if (finalUserId) {
      dispatch(fetchCart(finalUserId));
    }
  }, [dispatch, finalUserId]);

  // Get the updated cart item
  const updatedCartItem = useMemo(() => {
    if (cartItems.length === 0) return cartItem; // Avoid selecting from empty array
    return cartItems.find((item) => item.productId === cartItem?.productId) || cartItem;
  }, [cartItems, cartItem]);

  // Extract quantity & price
  const quantity = updatedCartItem?.quantity || 1;
  const price = updatedCartItem?.price || cartItem?.price || 0;
  const totalPrice = (price * quantity).toFixed(2);

  // Debugging
  useEffect(() => {
    console.log("🔄 Redux Cart Items Updated:", cartItems);
    console.log("🆕 Updated Cart Item:", updatedCartItem);
  }, [cartItems, updatedCartItem]);

  // Handle quantity update
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(
      updateCartItemQuantity({
        userId: finalUserId,
        productId: updatedCartItem.productId,
        quantity: newQuantity,
      })
    );
  };

  // Handle deletion
  const handleDelete = () => {
    dispatch(deleteCartItem({ userId: finalUserId, productId: updatedCartItem.productId }));
    toast({
      title: "Item removed from cart",
      description: "The product has been successfully removed.",
      status: "success",
    });
  };

  return (
    <div className="flex items-center justify-between border-b p-4">
      {/* Product Image */}
      <div className="w-16 h-16 overflow-hidden rounded-md">
        <img
          src={updatedCartItem?.image || "/placeholder.jpg"}
          alt={updatedCartItem?.title || "Product Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="font-semibold">{updatedCartItem?.title || "Product Name"}</h3>
        <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="p-2 border rounded"
        >
          -
        </button>
        <span className="font-bold">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-2 border rounded"
        >
          +
        </button>
      </div>

      {/* Total Price & Delete Button */}
      <div className="flex items-center space-x-4 ml-2">
        <span className="font-bold">${totalPrice}</span>
        <button onClick={handleDelete} className="text-red-500">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default UsercartItemsContent;
