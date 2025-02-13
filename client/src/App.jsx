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

  if (isLoading) return <Skeleton className="w-[800px] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* ✅ Default Route - Publicly Accessible */}
        <Route path="/" element={<Navigate to="/shop/home" />} />

        {/* ✅ Public Routes (No Authentication Required) */}
        <Route path="/shop/*" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} /> {/* ✅ Home Page is Public */}
          <Route path="listing" element={<ShoppingList />} /> {/* ✅ Product Listing is Public */}
        </Route>

        {/* 🔒 Protected Shopping Routes (Requires Login) */}
        <Route
          path="/shop/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="payment" element={<ShoppingPayment />} />
          <Route path="myorders" element={<MyOrders />} />
        </Route>

        {/* 🔒 Authentication Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Authlogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* 🔒 Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* ❌ Not Found Route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthPage" element={<UnAuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
