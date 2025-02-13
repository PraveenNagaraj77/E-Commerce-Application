import {
  BadgeCheck,
  ChartPie,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import React, { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const AdminSideBar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const adminSidebarMenuItems = [
    { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard /> },
    { id: "products", label: "Products", path: "/admin/products", icon: <ShoppingBasket /> },
    { id: "orders", label: "Orders", path: "/admin/orders", icon: <BadgeCheck /> },
  ];

  function MenuItems({ setOpen }) {
    return (
      <nav className="mt-8 flex flex-col gap-2">
        {adminSidebarMenuItems.map((menuItem) => {
          const isActive = location.pathname === menuItem.path;
          return (
            <div
              key={menuItem.id}
              onClick={() => {
                navigate(menuItem.path);
                if (setOpen) setOpen(false); // Close sidebar in mobile view
              }}
              className={`flex text-lg cursor-pointer items-center gap-3 rounded-md px-4 py-3 
                ${isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2 mt-5 mb-5">
                <ChartPie size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div onClick={() => navigate("/admin/dashboard")} className="flex cursor-pointer items-center gap-2">
          <ChartPie size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
};

export default AdminSideBar;
