import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  List,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/authslice";
import UsercartWrapper from "./cartWrapper";
import { fetchCart } from "@/store/shop/cartSlice";
import { Label } from "../ui/label";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function MenuItems() {
  const navigate = useNavigate();

  function handleNavigate(getCurrentMenuItem) {
    console.log("Navigating with menu item:", getCurrentMenuItem);

    sessionStorage.removeItem("Filters");

    let queryParams = "";

    if (getCurrentMenuItem.value !== "home") {
      const currentFilter = { category: [getCurrentMenuItem.id] };
      sessionStorage.setItem("Filters", JSON.stringify(currentFilter));
      console.log("Updated sessionStorage:", sessionStorage.getItem("Filters"));

      // Construct query params
      queryParams = `?category=${getCurrentMenuItem.id}`;
    }

    console.log("Navigating to:", getCurrentMenuItem.path + queryParams);
    navigate(getCurrentMenuItem.path + queryParams);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          key={menuItem.id || menuItem.label}
          className="text-sm font-medium cursor-pointer"
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCart, setOpenCart] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart(user?.id));
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Cart Icon with Badge */}
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          isAuthenticated ? setOpenCart(true) : navigate("/auth/login")
        }
        className="relative"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {cartItems.length}
          </span>
        )}
        <span className="sr-only">User Cart</span>
      </Button>

      {isAuthenticated ? (
        // User Dropdown when authenticated
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black cursor-pointer text-white font-extrabold">
                {user?.userName ? user.userName[0].toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>
              Logged in as {user?.userName || "Guest"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/shop/myorders")}>
              <List className="mr-2 h-4 w-4" />
              My Orders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // Login Button when not authenticated
        <Button onClick={() => navigate("/auth/login")}>Login</Button>
      )}

      {/* Cart Modal */}
      <Sheet open={openCart} onOpenChange={setOpenCart}>
        <SheetContent aria-describedby="cart-description">
          {/* ✅ Hidden Title for Accessibility */}
          <VisuallyHidden>
            <SheetTitle>Shopping Cart</SheetTitle>
          </VisuallyHidden>

          {/* ✅ Add Description to Fix `aria-describedby` Warning */}
          <p id="cart-description" className="sr-only">
            This is your shopping cart. Review and manage your selected items.
          </p>

          <UsercartWrapper
            cartItems={cartItems}
            onClose={() => setOpenCart(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

const ShoppingHeader = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(user, "user");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={"/shop/home"} className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">E-Commerce</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet modal={false}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Header Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <SheetTitle className="mb-4"></SheetTitle> {/* Added spacing */}
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
