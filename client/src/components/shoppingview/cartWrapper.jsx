import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import UsercartItemsContent from './cartItemsContent';

const UsercartWrapper = ({ cartItems = [], onClose }) => { // ✅ Added onClose prop
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // ✅ Initialize navigate function

  useEffect(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      setTotalPrice(0);
      return;
    }

    const newTotal = cartItems.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return sum + itemTotal;
    }, 0);

    setTotalPrice(newTotal);
  }, [cartItems]);

  // ✅ Close sheet & Navigate to Checkout
  const handleCheckout = () => {
    if (onClose) {
      console.log("Closing cart sheet..."); // ✅ Debug log
      onClose(); // ✅ Close the sheet
    }
    navigate('/shop/account');
  };

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => <UsercartItemsContent key={item.productId} cartItem={item} />)
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total Amount</span>
          <span className="font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* ✅ Checkout Button with Navigation & Close Sheet */}
      <Button className="w-full mt-6" onClick={handleCheckout}>
        CheckOut
      </Button>
    </SheetContent>
  );
};

export default UsercartWrapper;
