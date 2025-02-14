import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import UsercartItemsContent from './cartItemsContent';

const UsercartWrapper = ({ cartItems = [], onClose }) => { 
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // ✅ Ensure cartItems is always an array
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
    if (!cartItemsArray.length) {
      setTotalPrice(0);
      return;
    }

    const newTotal = cartItemsArray.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);

    setTotalPrice(parseFloat(newTotal.toFixed(2))); // ✅ Fix floating point issue
  }, [cartItemsArray]);

  // ✅ Close cart & navigate to checkout
  const handleCheckout = () => {
    if (onClose) onClose(); // ✅ Close the sheet
    navigate('/shop/account');
  };

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItemsArray.length ? (
          cartItemsArray.map((item) => (
            <UsercartItemsContent key={item.productId} cartItem={item} onClose={onClose} />
          ))
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total Amount</span>
          <span className="font-bold">${totalPrice}</span>
        </div>
      </div>

      <Button className="w-full mt-6" onClick={handleCheckout}>
        CheckOut
      </Button>
    </SheetContent>
  );
};

export default UsercartWrapper;
