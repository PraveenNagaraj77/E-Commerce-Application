import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { placeOrder } from "../../store/shop/ordersSlice";
import { clearCart } from "../../store/shop/cartSlice";
import { Loader2, CheckCircle } from "lucide-react";

// ✅ Get the backend URL from the environment
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Fetching from .env

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.id);
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
  const totalPrice = cartItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);

  const [paypalClientId, setPaypalClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const exchangeRate = 83;

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/shop/paypal/config`); // Use the environment variable
        const data = await response.json();
        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error("❌ Error fetching PayPal Client ID:", error);
        toast.error("Failed to load payment gateway.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientId();
  }, []);

  const formattedItems = cartItems.map((item) => ({
    productId: item.productId,
    title: item.title,
    image: item.image,
    quantity: item.quantity,
    price: item.salePrice,
  }));

  const handlePaymentSuccess = async (details) => {
    toast.success("Payment successful!");
    const paymentId = details.id || details.purchase_units?.[0]?.payments?.captures?.[0]?.id || "N/A";

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
    toast.success("Cash on Delivery selected!");

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

  const processOrder = async (orderData) => {
    try {
      const response = await dispatch(placeOrder(orderData)).unwrap();
      await dispatch(clearCart(orderData.userId));
      setOrderSuccess(true);

      setTimeout(() => {
        navigate("/shop/myorders", { state: { openOrdersTab: true } });
      }, 2000);
    } catch (error) {
      toast.error("Order placement failed!");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Complete Your Payment</h2>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Order Total: ₹{totalPrice}</h3>
        </div>

        <div className="mt-4">
          <label className="block font-semibold text-gray-700 mb-2">Select Payment Method:</label>
          <div className="flex gap-4">
            <button
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                paymentMethod === "paypal" ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal
            </button>
            <button
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                paymentMethod === "cod" ? "bg-green-600 text-white shadow-md" : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              Cash on Delivery
            </button>
          </div>
        </div>

        <div className="mt-6">
          {paymentMethod === "paypal" ? (
            isLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              </div>
            ) : paypalClientId ? (
              <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{ amount: { value: (totalPrice / exchangeRate).toFixed(2) } }],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => handlePaymentSuccess(details)).catch(() => toast.error("Payment verification failed!"));
                  }}
                  onError={() => toast.error("Payment failed!")}
                />
              </PayPalScriptProvider>
            ) : (
              <p className="text-red-500 font-semibold text-center">Failed to load payment options.</p>
            )
          ) : (
            <button
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4 shadow-md hover:bg-green-700 transition"
              onClick={handleCashOnDelivery}
            >
              Confirm Cash on Delivery
            </button>
          )}
        </div>
      </div>

      {/* ✅ Success Popup */}
      {orderSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
            <h2 className="text-lg font-bold text-green-600">🎉 Order Placed Successfully!</h2>
            <p className="text-gray-600 mt-2">Redirecting to your orders...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
