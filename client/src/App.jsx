import { Route, Routes, Navigate } from "react-router-dom"; 
import "./App.css";
import AuthLayout from "./components/auth/AuthLayout";
import Authlogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/adminview/AdminLayout";
import AdminDashboard from "./pages/adminview/dashboard";
import AdminOrders from "./pages/adminview/orders";
import AdminFeatures from "./pages/adminview/features";
import AdminProducts from "./pages/adminview/products";
import ShoppingLayout from "./components/shoppingview/ShoppingLayout";
import NotFound from "./pages/notfound/NotFound";
import ShoppingHome from "./pages/shoppingview/home";
import ShoppingCheckout from "./pages/shoppingview/checkout";
import ShoppingAccount from "./pages/shoppingview/account";
import ShoppingList from "./pages/shoppingview/listing";
import ShoppingPayment from "./pages/shoppingview/ShoppingPayment"; 
import MyOrders from "./pages/shoppingview/MyOrders"; 
import CheckAuth from "./components/common/CheckAuth";
import UnAuthPage from "./pages/UnAuthPage/UnAuthPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/authslice";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black fixed top-0 left-0 w-full h-full z-50">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* ✅ Default Route - Redirect to Home */}
        <Route path="/" element={<Navigate to="/shop/home" />} />

        {/* ✅ Public Shopping Routes */}
        <Route path="/shop/*" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingList />} />
        </Route>

        {/* 🔒 Protected Shopping Routes (Requires Login) */}
        <Route
          path="/shop/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="payment" element={<ShoppingPayment />} />
          <Route path="myorders" element={<MyOrders />} />
        </Route>

        {/* 🔒 Authentication Routes (Redirect Logged-In Users) */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              isAuthenticated ? <Navigate to="/shop/home" /> : <Authlogin />
            }
          />
          <Route
            path="register"
            element={
              isAuthenticated ? <Navigate to="/shop/home" /> : <AuthRegister />
            }
          />
        </Route>

        {/* 🔒 Admin Routes (Only for Admins) */}
        <Route
          path="/admin/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} role="admin">
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* ❌ Not Found & Unauthorized Pages */}
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthPage" element={<UnAuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
