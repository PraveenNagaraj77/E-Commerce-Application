
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowRight,
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  List,
  X,
} from "lucide-react";

import { shoppingViewHeaderMenuItems } from "@/config";
import { logoutUser } from "@/store/authslice";
import { fetchCart, resetCartState } from "@/store/shop/cartSlice";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";
import UsercartWrapper from "./cartWrapper";

// Navigation links shared by desktop and mobile.
function MenuItems({ onNavigate, mobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("Filters");

    let queryParams = "";

    if (menuItem.id !== "home") {
      const currentFilter = {
        category: [menuItem.id],
      };

      sessionStorage.setItem("Filters", JSON.stringify(currentFilter));
      queryParams = `?category=${menuItem.id}`;
    }

    navigate(menuItem.path + queryParams);
    onNavigate?.();
  }

  return (
    <nav
      aria-label="Main navigation"
      className={
        mobile
          ? "flex flex-col gap-2"
          : "flex items-center gap-6 xl:gap-8"
      }
    >
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isActive =
          menuItem.id === "home"
            ? location.pathname === "/shop/home"
            : location.pathname === "/shop/listing" &&
              new URLSearchParams(location.search).get("category") ===
                menuItem.id;

        return (
          <button
            key={menuItem.id}
            type="button"
            onClick={() => handleNavigate(menuItem)}
            aria-current={isActive ? "page" : undefined}
            className={`text-left text-sm font-medium transition-colors ${
              mobile
                ? "rounded-lg px-4 py-3 hover:bg-gray-100"
                : "relative py-6 hover:text-black"
            } ${
              isActive
                ? "text-black"
                : "text-gray-500"
            }`}
          >
            {menuItem.label}

            {!mobile && isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-black" />
            )}

            {mobile && (
              <ArrowRight className="ml-2 inline h-3.5 w-3.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openCart, setOpenCart] = useState(false);

  const totalCartItems = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();

      // Clear only the local Redux cart state.
      // The user's saved cart in the database is not deleted.
      dispatch(resetCartState());

      setOpenCart(false);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Shopping cart */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            isAuthenticated
              ? setOpenCart(true)
              : navigate("/auth/login")
          }
          className="relative h-10 w-10 rounded-full text-gray-700 hover:bg-gray-100 hover:text-black"
          aria-label={`Open shopping cart${totalCartItems ? `, ${totalCartItems} items` : ""}`}
        >
          <ShoppingCart className="h-5 w-5" />

          {totalCartItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
              {totalCartItems > 99 ? "99+" : totalCartItems}
            </span>
          )}
        </Button>

        {/* Account menu */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Open account menu"
                className="rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                <Avatar className="h-9 w-9 cursor-pointer border border-gray-200">
                  <AvatarFallback className="bg-gray-900 text-sm font-semibold text-white">
                    {user?.userName
                      ? user.userName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              className="mt-2 w-60 rounded-xl p-2"
            >
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-xs font-normal text-gray-500">
                  Logged in as
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                  {user?.userName || "Guest"}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/shop/account")}
                className="cursor-pointer rounded-lg px-3 py-2"
              >
                <UserCog className="mr-3 h-4 w-4" />
                My Account
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/shop/myorders")}
                className="cursor-pointer rounded-lg px-3 py-2"
              >
                <List className="mr-3 h-4 w-4" />
                My Orders
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="h-10 rounded-full bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Login
          </Button>
        )}
      </div>

      {/* Cart drawer */}
      <Sheet open={openCart} onOpenChange={setOpenCart}>
        <SheetContent
          side="right"
          className="w-full max-w-full p-0 sm:max-w-lg"
        >
          <UsercartWrapper
            cartItems={cartItems}
            onClose={() => setOpenCart(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

const ShoppingHeader = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // Load the authenticated user's cart.
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCart(user.id));
    } else if (!isAuthenticated) {
      dispatch(resetCartState());
    }
  }, [dispatch, isAuthenticated, user?.id]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-8">

        {/* Brand */}
        <Link
          to="/shop/home"
          onClick={() => {
            sessionStorage.removeItem("Filters");
            setOpenMobileMenu(false);
          }}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
            <HousePlug className="h-5 w-5" />
          </div>

          <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            E-Commerce
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden flex-1 justify-center lg:flex">
          <MenuItems />
        </div>

        {/* Header actions: visible on desktop and mobile */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderRightContent />

          {/* Mobile navigation drawer */}
          <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open navigation menu"
                className="h-10 w-10 rounded-full border-gray-200 lg:hidden"
              >
                {openMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[85%] max-w-sm border-r border-gray-100 bg-white p-0"
            >
              <div className="border-b border-gray-100 px-6 py-6">
                <SheetTitle className="text-left text-lg font-bold">
                  Browse Categories
                </SheetTitle>
                <p className="mt-1 text-sm text-gray-500">
                  Find what you're looking for.
                </p>
              </div>

              <div className="px-4 py-5">
                <MenuItems
                  mobile
                  onNavigate={() => setOpenMobileMenu(false)}
                />
              </div>

              <div className="mt-auto border-t border-gray-100 px-6 py-5">
                <p className="text-xs text-gray-400">
                  Discover your everyday essentials.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
