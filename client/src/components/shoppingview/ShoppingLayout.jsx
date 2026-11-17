
import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./Footer";

const ShoppingLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ShoppingHeader />

      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default ShoppingLayout;
