import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
} from "../../store/shop/ordersSlice";

import {
  Package,
  ShoppingBag,
  CalendarDays,
  MapPin,
  ArrowRight,
  RefreshCw,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
};

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

const getStatusDetails = (status) => {
  const normalizedStatus = (status || "Pending").toLowerCase();

  const statuses = {
    pending: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock3,
    },
    processing: {
      label: "Processing",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Package,
    },
    shipped: {
      label: "Shipped",
      className: "bg-violet-50 text-violet-700 border-violet-200",
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
  };

  return statuses[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Package,
  };
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], status, error } = useSelector(
    (state) => state.orders
  );

  const user = useSelector((state) => state.auth.user);
  const lastOrder = useSelector((state) => state.cart.lastOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user?.id, lastOrder]);

  const isLoading = status === "loading";

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt || b.orderDate || 0) -
      new Date(a.createdAt || a.orderDate || 0)
  );

  const totalOrders = sortedOrders.length;

  const totalSpent = sortedOrders.reduce(
    (total, order) => total + (Number(order.totalPrice) || 0),
    0
  );

  const getProductDetails = (item) => {
    const product = item?.productId;

    return {
      title: item?.title || product?.title || "Product",
      image:
        item?.image ||
        product?.image ||
        "https://placehold.co/120x120/f5f5f5/999999?text=Product",
      price: Number(item?.price) || 0,
      quantity: Number(item?.quantity) || 1,
    };
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pb-16">
      {/* Page Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Your account
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Track your purchases and view your order history.
              </p>
            </div>

            <button
              onClick={() => dispatch(fetchOrders(user?.id))}
              disabled={!user?.id || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:border-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh Orders
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="mt-2 text-2xl font-semibold text-gray-950">
                  {totalOrders}
                </p>
              </div>

              <div className="rounded-full bg-gray-100 p-3">
                <ShoppingBag size={21} className="text-gray-700" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Order Value</p>
                <p className="mt-2 text-2xl font-semibold text-gray-950">
                  {formatPrice(totalSpent)}
                </p>
              </div>

              <div className="rounded-full bg-gray-100 p-3">
                <Package size={21} className="text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
            <Loader2 className="mb-3 animate-spin text-gray-700" size={32} />
            <p className="text-sm text-gray-500">Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && status === "failed" && (
          <div className="rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
            <XCircle className="mx-auto mb-3 text-red-500" size={32} />

            <h2 className="text-lg font-semibold text-gray-900">
              Unable to load orders
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Something went wrong while fetching your orders."}
            </p>

            <button
              onClick={() => dispatch(fetchOrders(user?.id))}
              className="mt-5 rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Orders */}
        {!isLoading &&
          status !== "failed" &&
          sortedOrders.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag size={28} className="text-gray-500" />
              </div>

              <h2 className="text-xl font-semibold text-gray-950">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                You haven't placed any orders yet. Explore our collection and
                find something you love.
              </p>

              <button
                onClick={() => navigate("/shop/listing")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Start Shopping
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        {/* Orders */}
        {!isLoading && sortedOrders.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-950">
                Order History
              </h2>

              <span className="text-sm text-gray-500">
                {totalOrders} {totalOrders === 1 ? "order" : "orders"}
              </span>
            </div>

            {sortedOrders.map((order, index) => {
              const statusDetails = getStatusDetails(order.status);
              const StatusIcon = statusDetails.icon;
              const items = order.items || [];
              const address = order.address || {};

              return (
                <article
                  key={order._id || `order-${index}`}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Order placed
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                          <CalendarDays size={14} className="text-gray-400" />
                          {formatDate(order.createdAt || order.orderDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Order total
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-950">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Order ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-700">
                          {order._id || "Unavailable"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusDetails.className}`}
                      >
                        <StatusIcon size={13} />
                        {statusDetails.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-100 px-5">
                    {items.map((item, itemIndex) => {
                      const product = getProductDetails(item);

                      return (
                        <div
                          key={
                            item._id ||
                            item.productId?._id ||
                            `${order._id}-${itemIndex}`
                          }
                          className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.src =
                                    "https://placehold.co/120x120/f5f5f5/999999?text=Product";
                                }}
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                {product.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {product.quantity}
                              </p>

                              <p className="mt-1 text-sm font-medium text-gray-800">
                                {formatPrice(product.price)} each
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:min-w-[120px] sm:text-right">
                            <p className="text-xs text-gray-400">
                              Item total
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-950">
                              {formatPrice(
                                product.price * product.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery Address */}
                  {(address.name ||
                    address.address ||
                    address.city ||
                    address.pincode) && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                      <div className="flex items-start gap-2.5">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Delivery Address
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {address.name}
                          </p>

                          <p className="mt-1 text-sm leading-5 text-gray-500">
                            {[
                              address.address,
                              address.city,
                              address.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                          {address.phone && (
                            <p className="mt-1 text-xs text-gray-500">
                              Phone: {address.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;