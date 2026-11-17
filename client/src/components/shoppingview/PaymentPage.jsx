
import React, { useEffect, useMemo, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Wallet,
  Truck,
  MapPin,
  ShoppingBag,
  Loader2,
  PackageCheck,
} from "lucide-react";

import { placeOrder } from "../../store/shop/ordersSlice";
import { clearCart } from "../../store/shop/cartSlice";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EXCHANGE_RATE = 83;

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

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.user?.id);
  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [selectedAddress] = useState(() => {
    try {
      const address = sessionStorage.getItem("selectedAddress");
      return address ? JSON.parse(address) : null;
    } catch {
      return null;
    }
  });

  const [paypalClientId, setPaypalClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = useMemo(
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

  useEffect(() => {
    let isMounted = true;

    const fetchClientId = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/shop/paypal/config`
        );

        if (!response.ok) {
          throw new Error("Unable to load PayPal configuration");
        }

        const data = await response.json();

        if (!data.clientId) {
          throw new Error("PayPal Client ID is missing");
        }

        if (isMounted) {
          setPaypalClientId(data.clientId);
        }
      } catch (error) {
        console.error("Error fetching PayPal Client ID:", error);

        if (isMounted) {
          toast.error("Failed to load payment gateway.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchClientId();

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedItems = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: getUnitPrice(item),
      })),
    [cartItems]
  );

  const processOrder = async (orderData) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await dispatch(placeOrder(orderData)).unwrap();

      await dispatch(clearCart(orderData.userId));

      setOrderSuccess(true);

      toast.success("Order placed successfully!");

      setTimeout(() => {
        navigate("/shop/myorders", {
          state: { openOrdersTab: true },
        });
      }, 2000);

      return true;
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Order placement failed!");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    const paymentId =
      details.id ||
      details.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
      "N/A";

    const orderData = {
      userId,
      address: selectedAddress,
      items: formattedItems,
      totalPrice,
      status: "Paid",
      paymentId,
      paymentMethod: "PayPal",
    };

    await processOrder(orderData);
  };

  const handleCashOnDelivery = async () => {
    if (!userId || !selectedAddress || !cartItems.length) {
      toast.error("Please verify your order details.");
      return;
    }

    const orderData = {
      userId,
      address: selectedAddress,
      items: formattedItems,
      totalPrice,
      status: "Pending",
      paymentId: "COD",
      paymentMethod: "Cash on Delivery",
    };

    await processOrder(orderData);
  };

  const handlePaymentMethodChange = (method) => {
    if (isProcessing) return;
    setPaymentMethod(method);
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck size={36} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-950">
            Login Required
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to continue with your payment.
          </p>
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="mt-6 w-full rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <ShoppingBag size={38} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-950">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add products to your cart before making a payment.
          </p>
          <button
            type="button"
            onClick={() => navigate("/shop/listing")}
            className="mt-6 w-full rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (!selectedAddress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <MapPin size={38} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-950">
            Delivery Address Required
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please select a delivery address before proceeding to payment.
          </p>
          <button
            type="button"
            onClick={() => navigate("/shop/account")}
            className="mt-6 w-full rounded-xl bg-gray-950 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Select Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/shop/checkout")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to checkout
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Final Step
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Complete Your Payment
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Choose your preferred payment method to place your order.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={18} className="text-gray-700" />
              Secure checkout
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8 flex max-w-md items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-white">
                <CheckCircle2 size={15} />
              </span>
              Address
            </div>

            <div className="h-px flex-1 bg-gray-950" />

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-white">
                <CheckCircle2 size={15} />
              </span>
              Review
            </div>

            <div className="h-px flex-1 bg-gray-950" />

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-white">
                3
              </span>
              Payment
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

          {/* Payment Section */}
          <div className="space-y-6 lg:col-span-2">

            {/* Payment Methods */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <h2 className="font-semibold text-gray-950">
                  Choose Payment Method
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Select how you would like to pay.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">

                {/* PayPal */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handlePaymentMethodChange("paypal")}
                  className={`relative rounded-xl border p-5 text-left transition ${
                    paymentMethod === "paypal"
                      ? "border-gray-950 bg-gray-50 ring-1 ring-gray-950"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {paymentMethod === "paypal" && (
                    <CheckCircle2
                      size={19}
                      className="absolute right-4 top-4 text-gray-950"
                    />
                  )}

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <CreditCard size={22} className="text-blue-700" />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-950">
                    PayPal
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Pay securely through your PayPal account.
                  </p>
                </button>

                {/* COD */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handlePaymentMethodChange("cod")}
                  className={`relative rounded-xl border p-5 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-gray-950 bg-gray-50 ring-1 ring-gray-950"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {paymentMethod === "cod" && (
                    <CheckCircle2
                      size={19}
                      className="absolute right-4 top-4 text-gray-950"
                    />
                  )}

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    <Truck size={22} className="text-green-700" />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-950">
                    Cash on Delivery
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Pay when your order is delivered.
                  </p>
                </button>
              </div>
            </div>

            {/* Selected Payment Details */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <h2 className="font-semibold text-gray-950">
                  {paymentMethod === "paypal"
                    ? "Pay with PayPal"
                    : "Cash on Delivery"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {paymentMethod === "paypal"
                    ? "Complete your payment using the secure PayPal checkout."
                    : "Confirm your order now and pay when it arrives."}
                </p>
              </div>

              <div className="p-5 sm:p-6">
                {paymentMethod === "paypal" ? (
                  isLoading ? (
                    <div className="flex min-h-36 flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
                      <p className="text-sm text-gray-500">
                        Loading secure payment gateway...
                      </p>
                    </div>
                  ) : paypalClientId ? (
                    <div className="mx-auto max-w-md">
                      <PayPalScriptProvider
                        options={{
                          "client-id": paypalClientId,
                        }}
                      >
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            shape: "rect",
                            label: "pay",
                            height: 48,
                          }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: (
                                      totalPrice / EXCHANGE_RATE
                                    ).toFixed(2),
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            if (isProcessing) return;

                            return actions.order
                              .capture()
                              .then((details) => {
                                return handlePaymentSuccess(details);
                              })
                              .catch((error) => {
                                console.error(
                                  "Payment verification failed:",
                                  error
                                );
                                toast.error(
                                  "Payment verification failed!"
                                );
                              });
                          }}
                          onError={(error) => {
                            console.error("PayPal payment error:", error);
                            toast.error("Payment failed!");
                          }}
                        />
                      </PayPalScriptProvider>

                      <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                        You will complete your payment through PayPal's secure payment interface.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-red-50 p-5 text-center">
                      <p className="font-semibold text-red-700">
                        Payment gateway unavailable
                      </p>
                      <p className="mt-2 text-sm text-red-600">
                        We couldn't load PayPal. Please try again later or choose Cash on Delivery.
                      </p>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="rounded-xl bg-green-50 p-5">
                      <div className="flex items-start gap-3">
                        <Wallet
                          size={22}
                          className="mt-0.5 shrink-0 text-green-700"
                        />

                        <div>
                          <h3 className="font-semibold text-green-900">
                            Pay when your order arrives
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-green-800">
                            Your order will be placed now. You can pay the delivery person when your package arrives.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleCashOnDelivery}
                      className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          Confirm Cash on Delivery
                          <CheckCircle2 size={18} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Information */}
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-gray-700"
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Secure Payment Experience
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Your order details are handled through our secure checkout process.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6 lg:sticky lg:top-6">

            {/* Address */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-950">
                  Delivery Address
                </h2>

                <MapPin size={19} className="text-gray-500" />
              </div>

              <p className="mt-4 font-semibold text-gray-900">
                {selectedAddress.name}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {selectedAddress.address}
                {selectedAddress.city
                  ? `, ${selectedAddress.city}`
                  : ""}
                {selectedAddress.pincode
                  ? ` - ${selectedAddress.pincode}`
                  : ""}
              </p>

              {selectedAddress.phone && (
                <p className="mt-2 text-sm text-gray-500">
                  Phone: {selectedAddress.phone}
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate("/shop/account")}
                className="mt-4 text-xs font-semibold text-gray-600 hover:text-black"
              >
                Change Address
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold tracking-tight text-gray-950">
                Order Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your order
              </p>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => {
                  const unitPrice = getUnitPrice(item);
                  const quantity = Number(item.quantity) || 0;

                  return (
                    <div
                      key={String(
                        item.productId?._id || item.productId
                      )}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold text-gray-900">
                        {formatPrice(unitPrice * quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 border-t border-dashed border-gray-200 pt-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="text-xs text-gray-500">
                    Calculated at checkout
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-950">
                    Order Total
                  </span>

                  <span className="text-xl font-bold text-gray-950">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <PackageCheck size={17} />
                  Order confirmation after successful placement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Popup */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={34} className="text-green-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-950">
              Order Placed Successfully!
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Thank you for your purchase. Redirecting you to your orders...
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
              <Loader2 size={17} className="animate-spin" />
              Redirecting...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
