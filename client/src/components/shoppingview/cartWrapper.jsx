
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";

import { Button } from "../ui/button";
import UsercartItemsContent from "./cartItemsContent";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getUnitPrice = (item) => {
  const price = Number(item?.price) || 0;
  const salePrice = Number(item?.salePrice) || 0;

  return salePrice > 0 && salePrice < price ? salePrice : price;
};

const UsercartWrapper = ({ cartItems = [], onClose }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.id);

  const items = Array.isArray(cartItems) ? cartItems : [];

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + getUnitPrice(item) * (Number(item.quantity) || 0),
        0
      ),
    [items]
  );

  const handleCheckout = () => {
    if (!items.length || !userId) return;

    onClose?.();
    navigate("/shop/account");
  };

  const handleContinueShopping = () => {
    onClose?.();
    navigate("/shop/listing");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">

      {/* Cart heading */}
      <SheetHeader className="border-b border-gray-100 px-5 py-5 text-left sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle className="text-xl font-bold tracking-tight text-gray-950">
              Your Shopping Bag
            </SheetTitle>

            <SheetDescription className="mt-1 text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
            </SheetDescription>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </SheetHeader>

      {items.length > 0 ? (
        <>
          {/* Cart items */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <UsercartItemsContent
                  key={String(item.productId?._id || item.productId)}
                  cartItem={item}
                  userId={userId}
                />
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 sm:px-6">
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-700">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-950">
                    Subtotal
                  </span>

                  <span className="text-xl font-bold tracking-tight text-gray-950">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCheckout}
              className="h-12 w-full rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              Secure checkout
            </div>

            <button
              type="button"
              onClick={handleContinueShopping}
              className="mt-4 w-full text-center text-sm font-semibold text-gray-600 transition hover:text-gray-950"
            >
              Continue Shopping
            </button>
          </div>
        </>
      ) : (
        /* Empty cart */
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-gray-950">
            Your bag is empty
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
            Looks like you haven't added anything yet. Explore our collection
            and find something you love.
          </p>

          <Button
            type="button"
            onClick={handleContinueShopping}
            className="mt-7 h-11 rounded-xl bg-gray-950 px-7 font-semibold hover:bg-gray-800"
          >
            Explore Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsercartWrapper;
