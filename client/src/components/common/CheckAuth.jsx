import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  // If the user is NOT authenticated and NOT on login/register, redirect to login
  if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect authenticated users away from login/register to shop home
  if (isAuthenticated && location.pathname.startsWith("/auth")) {
    return <Navigate to="/shop/home" replace />;
  }

  // Prevent non-admin users from accessing admin routes
  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauthPage" replace />;
  }

  return children;
};

export default CheckAuth;
