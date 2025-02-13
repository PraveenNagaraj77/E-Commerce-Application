import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  // Redirect unauthenticated users to login unless already on login/register page
  if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect authenticated users away from login/register
  if (isAuthenticated && location.pathname.startsWith("/auth")) {
    const redirectPath = user?.role === "admin" ? "/admin/dashboard" : "/shop/home";
    return <Navigate to={redirectPath} replace />;
  }

  // Prevent non-admin users from accessing admin routes
  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauthPage" replace />;
  }

  // Prevent admin users from accessing shop routes
  if (isAuthenticated && user?.role === "admin" && location.pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Render children if all checks pass
  return <div>{children}</div>;
};

export default CheckAuth;
