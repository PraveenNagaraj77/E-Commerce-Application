
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  PackageCheck,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

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

const ShoppingCheckout = () => {
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.user?.id);

  const reduxSelectedAddress = useSelector(
    (state) => state.address.selectedAddress
  );

  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [selectedAddress, setSelectedAddress] = useState(
    reduxSelectedAddress || null
  );

  useEffect(() => {
    if (reduxSelectedAddress) {
      setSelectedAddress(reduxSelectedAddress);
      return;
    }

    try {
      const storedAddress = sessionStorage.getItem("selectedAddress");

      if (storedAddress) {
        setSelectedAddress(JSON.parse(storedAddress));
      }
    } catch {
      sessionStorage.removeItem("selectedAddress");
      setSelectedAddress(null);
    }
  }, [reduxSelectedAddress]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + getUnitPrice(item) * (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const totalItems = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const handlePlaceOrder = () => {
    if (!userId) {
      toast.error("Please log in to continue.");
      navigate("/auth/login");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    sessionStorage.setItem(
      "selectedAddress",
      JSON.stringify(selectedAddress)
    );

    navigate("/shop/payment");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => navigate("/shop/account")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to addresses
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Almost there
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Checkout
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Review your order and delivery details before payment.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={18} className="text-gray-700" />
              Secure checkout
            </div>
          </div>

          {/* Checkout Progress */}
          <div className="mt-8 flex max-w-md items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-white">
                <CheckCircle2 size={15} />
              </span>
              Address
            </div>

            <div className="h-px flex-1 bg-gray-300" />

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-950 bg-white text-xs">
                2
              </span>
              Review
            </div>

            <div className="h-px flex-1 bg-gray-300" />

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xs">
                3
              </span>
              Payment
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

          {/* Left Section */}
          <div className="space-y-6 lg:col-span-2">

            {/* Delivery Address */}
            <Card className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <MapPin size={19} className="text-gray-800" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-950">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                {selectedAddress && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Selected
                  </span>
                )}
              </div>

              <CardContent className="p-5 sm:p-6">
                {selectedAddress ? (
                  <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-950">
                          {selectedAddress.name}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {selectedAddress.address}
                          {selectedAddress.city
                            ? `, ${selectedAddress.city}`
                            : ""}
                          {selectedAddress.pincode
                            ? ` - ${selectedAddress.pincode}`
                            : ""}
                        </p>

                        {selectedAddress.phone && (
                          <p className="mt-3 text-sm text-gray-600">
                            Phone: {selectedAddress.phone}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/shop/account")}
                        className="shrink-0 rounded-lg border-gray-300 bg-white hover:bg-gray-100"
                      >
                        Change Address
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center">
                    <MapPin
                      size={28}
                      className="mx-auto mb-3 text-gray-400"
                    />

                    <p className="font-medium text-gray-900">
                      No delivery address selected
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Select an address to continue with your order.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/shop/account")}
                      className="mt-4 rounded-lg"
                    >
                      Select Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <ShoppingBag size={19} className="text-gray-800" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-950">
                      Your Order
                    </h2>
                    <p className="text-xs text-gray-500">
                      {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/shop/account")}
                  className="text-xs font-semibold text-gray-600 transition hover:text-black"
                >
                  Edit Cart
                </button>
              </div>

              <CardContent className="p-5 sm:p-6">
                {cartItems.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => {
                      const unitPrice = getUnitPrice(item);
                      const quantity = Number(item.quantity) || 0;

                      const productId =
                        item.productId?._id || item.productId;

                      return (
                        <div
                          key={String(productId)}
                          className="flex items-center gap-4 py-5 first:pt-0 last:pb-0"
                        >
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title || "Product"}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag
                                  size={25}
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold text-gray-950 sm:text-base">
                              {item.title}
                            </p>

                            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                              {formatPrice(unitPrice)} × {quantity}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-gray-950 sm:text-base">
                              {formatPrice(unitPrice * quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <ShoppingBag
                      size={34}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-semibold text-gray-900">
                      Your cart is empty
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add some products before proceeding to checkout.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/shop/listing")}
                      className="mt-5 rounded-lg"
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:sticky lg:top-6">
            <Card className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-950">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your payment details.
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({totalItems})</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-xs text-gray-500">
                      Calculated at next step
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-950">
                        Subtotal
                      </span>

                      <span className="text-xl font-bold tracking-tight text-gray-950">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Final delivery charges, if applicable, will be shown in the next step.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={!cartItems.length || !selectedAddress || !userId}
                  className="mt-7 h-12 w-full rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Payment
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </Button>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-gray-600"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Your order details are protected. Payment will be processed securely in the next step.
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <PackageCheck size={17} />
                    Order review before payment
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <CreditCard size={17} />
                    Secure payment process
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="mt-4 text-center text-xs text-gray-400">
              Thank you for shopping with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
