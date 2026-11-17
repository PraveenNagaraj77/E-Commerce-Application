
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Allow unauthenticated users to access authentication pages
  if (!isAuthenticated && currentPath.startsWith("/auth")) {
    return children;
  }

  // Allow unauthenticated users to access public shopping pages
  if (
    !isAuthenticated &&
    (
      currentPath === "/" ||
      currentPath.startsWith("/shop")
    )
  ) {
    return children;
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect authenticated users away from login/register
  if (isAuthenticated && currentPath.startsWith("/auth")) {
    return <Navigate to="/shop/home" replace />;
  }

  // Prevent non-admin users from accessing admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    currentPath.startsWith("/admin")
  ) {
    return <Navigate to="/unauthPage" replace />;
  }

  return children;
};

export default CheckAuth;
