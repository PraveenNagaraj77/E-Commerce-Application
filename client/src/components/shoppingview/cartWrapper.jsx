import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import UsercartItemsContent from './cartItemsContent';

const UsercartWrapper = ({ cartItems = [], onClose }) => { 
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // Ensure cartItems is always an array
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
    if (!cartItemsArray.length) {
      setTotalPrice(0);
      return;
    }

    const newTotal = cartItemsArray.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);

    setTotalPrice(parseFloat(newTotal.toFixed(2))); 
  }, [cartItemsArray]);

  // Close cart & navigate to checkout
  const handleCheckout = () => {
    if (onClose) onClose();
    navigate('/shop/account');
  };

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full"> 
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {/* Scrollable product list */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 px-2">
        {cartItemsArray.length ? (
          cartItemsArray.map((item) => (
            <UsercartItemsContent key={item.productId} cartItem={item} onClose={onClose} />
          ))
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        )}
      </div>

      {/* Fixed footer section */}
      <div className="border-t pt-4 bg-white">
        <div className="flex justify-between text-lg font-semibold px-4">
          <span>Total Amount</span>
          <span>${totalPrice}</span>
        </div>
        <Button className="w-full mt-4 py-3 text-lg font-semibold" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </SheetContent>
  );
};

export default UsercartWrapper;
