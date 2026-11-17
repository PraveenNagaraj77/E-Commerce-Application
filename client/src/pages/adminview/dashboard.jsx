
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../store/shop/ordersSlice/index";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  IndianRupee,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-50 text-green-700";
    case "shipped":
      return "bg-blue-50 text-blue-700";
    case "processing":
      return "bg-purple-50 text-purple-700";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], status } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const statistics = useMemo(() => {
    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (total, order) =>
        total + (Number(order.totalPrice) || 0),
      0
    );

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const completedOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [orders]);

  const summaryCards = [
    {
      title: "Total Orders",
      value: statistics.totalOrders.toLocaleString("en-IN"),
      description: "All orders received",
      icon: ShoppingBag,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Revenue",
      value: currencyFormatter.format(statistics.totalRevenue),
      description: "Value of all recorded orders",
      icon: IndianRupee,
      iconStyle: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Orders",
      value: statistics.pendingOrders.toLocaleString("en-IN"),
      description: "Orders awaiting completion",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      title: "Delivered Orders",
      value: statistics.completedOrders.toLocaleString("en-IN"),
      description: "Successfully delivered",
      icon: BadgeCheck,
      iconStyle: "bg-purple-50 text-purple-600",
    },
  ];

  const isLoading = status === "loading";

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your store performance and recent activity.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/orders")}
          className="w-full gap-2 rounded-lg sm:w-auto"
        >
          View all orders
          <ArrowUpRight size={16} />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      {item.title}
                    </p>

                    <h2 className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
                  >
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest customer orders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Package size={16} />
            <span>Latest 5 orders</span>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-3 font-medium text-gray-800">
                No orders yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Order ID
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <TableCell className="whitespace-nowrap px-5 py-4">
                        <span className="font-medium text-gray-900">
                          #{order._id?.slice(-6).toUpperCase() || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="max-w-[180px] truncate px-5 py-4 text-sm text-gray-700">
                        {order.customerName ||
                          order.address?.fullName ||
                          order.address?.name ||
                          "N/A"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                        {currencyFormatter.format(
                          Number(order.totalPrice) || 0
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
