import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { placeOrder } from "../../store/shop/ordersSlice/index"; // Import order action
import { clearCart } from "../../store/shop/cartSlice/index"; // Import clearCart action

const ShoppingCheckout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  
  const userId = useSelector((state) => state.auth.user?.id); // Correct userId field

console.log("🟢 Retrieved userId from Redux:", userId); // Debugging log

  const reduxSelectedAddress = useSelector((state) => state.address.selectedAddress);
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [selectedAddress, setSelectedAddress] = useState(reduxSelectedAddress || null);

  

  useEffect(() => {
    if (!reduxSelectedAddress) {
      const storedAddress = sessionStorage.getItem("selectedAddress");
      if (storedAddress) {
        setSelectedAddress(JSON.parse(storedAddress));
      }
    }
  }, [reduxSelectedAddress]);

  // Calculate Total Price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);

  const handlePlaceOrder = async () => {
    console.log("✅ Proceeding to Payment...");
  
    if (!selectedAddress) {
      toast.error("Please select an address before placing an order!");
      return;
    }
  
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
  
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }
  
    // Store order details in sessionStorage before payment
    sessionStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  
    // Navigate to Payment Page
    navigate("/shop/payment");
  };
  
  
  

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Checkout</h2>

      {/* Address Details */}
      <Card className="mb-6 shadow-lg p-4">
        <CardContent>
          <h3 className="text-lg md:text-xl font-semibold mb-2">Delivery Address</h3>
          {selectedAddress ? (
            <div className="text-sm md:text-lg text-gray-700">
              <p><strong>{selectedAddress.name}</strong></p>
              <p>{selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}</p>
              <p>Phone: {selectedAddress.phone}</p>
            </div>
          ) : (
            <p className="text-red-500 font-semibold text-sm md:text-base">
              No address selected! Please select an address before proceeding.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6 shadow-lg p-4">
        <CardContent>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Order Summary</h3>
          {cartItems.length > 0 ? (
            <ul className="divide-y divide-gray-300">
              {cartItems.map((item) => (
                <li key={item.productId} className="flex items-center py-3">
                  <img src={item.image} alt={item.title} className="w-12 h-12 md:w-16 md:h-16 rounded-lg mr-4 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm md:text-lg font-semibold">{item.title}</p>
                    <p className="text-gray-600 text-xs md:text-sm">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-sm md:text-lg">₹{item.salePrice * item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm md:text-base">Your cart is empty.</p>
          )}
          <div className="mt-4 text-lg md:text-xl font-bold text-right">Total: ₹{totalPrice}</div>
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Button variant="outline" className="w-full md:w-auto" onClick={() => navigate("/shop/account")}>
          <ArrowLeft size={16} className="mr-2" /> Change Address
        </Button>
        <Button
          onClick={handlePlaceOrder}
          className={`w-full md:w-auto text-lg px-4 py-2 ${cartItems.length === 0 || !selectedAddress ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          disabled={cartItems.length === 0 || !selectedAddress}
        >
          <CheckCircle size={20} className="mr-2" /> Place Order
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
