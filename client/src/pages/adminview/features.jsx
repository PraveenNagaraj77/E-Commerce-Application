
import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Dashboard",
    description: "Monitor your store activity and view important business metrics.",
    icon: LayoutDashboard,
    status: "Available",
    path: "/admin/dashboard",
  },
  {
    title: "Product Management",
    description: "Add, edit, delete, and manage your product inventory.",
    icon: Package,
    status: "Available",
    path: "/admin/products",
  },
  {
    title: "Order Management",
    description: "View customer orders and manage their fulfilment status.",
    icon: ShoppingBag,
    status: "Available",
    path: "/admin/orders",
  },
  {
    title: "Sales Analytics",
    description: "Track revenue, order trends, and store performance.",
    icon: BarChart3,
    status: "Coming Soon",
  },
  {
    title: "Customer Management",
    description: "Review customer information and purchasing activity.",
    icon: Users,
    status: "Coming Soon",
  },
  {
    title: "Payment Management",
    description: "Review payment methods and transaction information.",
    icon: CreditCard,
    status: "Coming Soon",
  },
  {
    title: "Store Settings",
    description: "Configure store preferences and application settings.",
    icon: Settings,
    status: "Coming Soon",
  },
  {
    title: "Security",
    description: "Manage administrative access and account security.",
    icon: ShieldCheck,
    status: "Coming Soon",
  },
];

const AdminFeatures = () => {
  return (
    <div className="w-full min-w-0 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Store Features
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Explore the tools available to manage and operate your store.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isAvailable = feature.status === "Available";

          return (
            <Card
              key={feature.title}
              className="rounded-xl border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <Icon size={21} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isAvailable
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {feature.status}
                  </span>
                </div>

                <h2 className="mt-5 text-base font-semibold text-gray-900">
                  {feature.title}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>

                {isAvailable && feature.path && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = feature.path;
                    }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-600"
                  >
                    Open feature
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminFeatures;
