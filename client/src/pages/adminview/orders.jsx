
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../store/shop/ordersSlice";
import {
  Search,
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Loader2,
  Package,
  MapPin,
  Phone,
  ChevronDown,
  IndianRupee,
} from "lucide-react";
import { toast } from "react-toastify";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatPrice = (price) =>
  currencyFormatter.format(Number(price) || 0);

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Shipped: "bg-blue-50 text-blue-700 ring-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
  Processing: "bg-violet-50 text-violet-700 ring-violet-200",
};

const statusOptions = [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const dispatch = useDispatch();

  const {
    orders = [],
    status,
    error,
  } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      return (
        new Date(b.createdAt || b.orderDate || 0) -
        new Date(a.createdAt || a.orderDate || 0)
      );
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return sortedOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const searchableText = [
        order._id,
        order.address?.name,
        order.address?.phone,
        order.address?.city,
        ...(order.items || []).map((item) => item.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(search);
    });
  }, [sortedOrders, searchTerm, statusFilter]);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      iconStyle: "bg-gray-100 text-gray-700",
    },
    {
      label: "Pending",
      value: orders.filter((order) => order.status === "Pending").length,
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      label: "Shipped",
      value: orders.filter((order) => order.status === "Shipped").length,
      icon: Truck,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
  ];

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) => total + (Number(order.totalPrice) || 0),
      0
    );

  const handleStatusChange = async (orderId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;

    setUpdatingOrderId(orderId);

    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();

      toast.success("Order status updated.");
    } catch (error) {
      toast.error(error || "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this order?"
    );

    if (!confirmed) return;

    setDeletingOrderId(orderId);

    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      toast.success("Order deleted successfully.");
    } catch (error) {
      toast.error(error || "Unable to delete order.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-7">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Store Management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and track deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(fetchOrders())}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}>
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue summary */}
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Order value excluding cancelled orders
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <IndianRupee size={17} />
          <span>{orders.length} total orders</span>
        </div>
      </div>

      {/* Orders section */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredOrders.length} orders found
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search orders, customers..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-gray-900"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter orders by status"
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-gray-900 sm:w-44"
              >
                <option value="All">All statuses</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && orders.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-gray-500">
            <Loader2 size={22} className="animate-spin" />
            Loading orders...
          </div>
        ) : status === "failed" && orders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <p className="font-semibold text-gray-900">
              Unable to load orders
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {error || "Please try again."}
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchOrders())}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Try again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Package size={22} className="text-gray-400" />
            </div>
            <p className="mt-3 font-semibold text-gray-900">
              {orders.length === 0 ? "No orders yet" : "No matching orders"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {orders.length === 0
                ? "Customer orders will appear here."
                : "Try changing your search or status filter."}
            </p>
            {(searchTerm || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-3 text-sm font-semibold text-gray-900 underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const currentStatus = order.status || "Pending";

              return (
                <article
                  key={order._id}
                  className="p-4 transition hover:bg-gray-50/60 sm:p-5"
                >
                  {/* Order heading */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(order.createdAt || order.orderDate)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[currentStatus] ||
                        "bg-gray-50 text-gray-600 ring-gray-200"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>

                  {/* Order information */}
                  <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.5fr_180px]">

                    {/* Customer */}
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Customer
                      </p>

                      <p className="break-words text-sm font-semibold text-gray-900">
                        {order.address?.name || "Customer"}
                      </p>

                      {order.address?.phone && (
                        <p className="mt-2 flex items-center gap-2 break-all text-xs text-gray-500">
                          <Phone size={13} className="shrink-0" />
                          {order.address.phone}
                        </p>
                      )}

                      {order.address && (
                        <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-gray-500">
                          <MapPin size={13} className="mt-1 shrink-0" />
                          <span className="break-words">
                            {[
                              order.address.address,
                              order.address.city,
                              order.address.pincode,
                            ].filter(Boolean).join(", ") || "Address unavailable"}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Products */}
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Products ({order.items?.length || 0})
                      </p>

                      <div className="space-y-3">
                        {order.items?.length > 0 ? (
                          order.items.map((item, index) => (
                            <div
                              key={item._id || `${order._id}-${index}`}
                              className="flex min-w-0 items-center gap-3"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title || "Product"}
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <Package size={18} className="text-gray-300" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="break-words text-sm font-medium text-gray-800">
                                  {item.title || "Product"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Qty: {Number(item.quantity) || 0}
                                  {" · "}
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">
                            No product details
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-row items-center justify-between border-t border-gray-100 pt-4 lg:flex-col lg:items-start lg:justify-start lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Order total
                        </p>
                        <p className="mt-2 text-xl font-bold text-gray-900">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>

                      <div className="mt-0 flex items-center gap-2 lg:mt-5">
                        <select
                          value={currentStatus}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) =>
                            handleStatusChange(
                              order._id,
                              event.target.value,
                              currentStatus
                            )
                          }
                          aria-label={`Update order ${order._id} status`}
                          className="h-9 max-w-[145px] rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 outline-none focus:border-gray-900 disabled:opacity-50"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        {updatingOrderId === order._id && (
                          <Loader2 size={16} className="animate-spin text-gray-500" />
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(order._id)}
                          disabled={deletingOrderId === order._id}
                          aria-label={`Delete order ${order._id}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingOrderId === order._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50/60 px-4 py-3 sm:px-5">
            <p className="text-xs text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminOrders;
