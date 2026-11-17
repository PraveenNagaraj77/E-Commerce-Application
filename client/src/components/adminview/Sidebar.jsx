
import React, { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ChartPie,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBasket,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: BadgeCheck,
  },
];

const AdminSideBar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const MenuItems = ({ onNavigate }) => (
    <nav className="mt-8 flex flex-col gap-2" aria-label="Admin navigation">
      {adminSidebarMenuItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              navigate(item.path);
              onNavigate?.();
            }}
            aria-current={isActive ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const SidebarBrand = () => (
    <div
      onClick={() => {
        navigate("/admin/dashboard");
        setOpen?.(false);
      }}
      className="flex cursor-pointer items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <ChartPie size={22} />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight">Admin Panel</h1>
        <p className="text-xs text-muted-foreground">Store Management</p>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-6">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b pb-5 text-left">
              <SheetTitle>
                <SidebarBrand />
              </SheetTitle>
            </SheetHeader>
            <MenuItems onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-6 lg:flex">
        <SidebarBrand />
        <MenuItems />
      </aside>
    </Fragment>
  );
};

export default AdminSideBar;
