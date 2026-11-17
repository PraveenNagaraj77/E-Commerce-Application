
import React from "react";
import { Outlet } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Truck, Headphones } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-white">

      {/* Left Branding Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gray-950 px-12 py-12 text-white lg:flex xl:px-20">

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-950">
            <ShoppingBag size={23} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            SHOP<span className="text-gray-400">.</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Your Shopping Destination
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Discover products.
            <br />
            Shop with confidence.
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
            Explore collections, discover products you love, and enjoy a
            seamless shopping experience from start to finish.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <ShieldCheck size={19} className="text-gray-400" />
              Secure shopping experience
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Truck size={19} className="text-gray-400" />
              Convenient order management
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Headphones size={19} className="text-gray-400" />
              Customer support
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SHOP. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Designed & Developed by{" "}
            <span className="font-semibold text-white">Praveen</span>
          </p>
        </div>

        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full border border-white/5" />
        <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full border border-white/5" />
      </div>

      {/* Authentication Content */}
      <div className="flex min-w-0 flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-950 text-white">
              <ShoppingBag size={23} />
            </div>

            <h1 className="mt-3 text-xl font-bold tracking-tight text-gray-950">
              SHOP.
            </h1>
          </div>

          <Outlet />

          <p className="mt-8 text-center text-xs text-gray-400 lg:hidden">
            Designed & Developed by{" "}
            <span className="font-semibold text-gray-700">Praveen</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
