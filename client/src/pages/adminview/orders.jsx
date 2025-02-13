import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus, deleteOrder } from "../../store/shop/ordersSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.orders);
  const [sortedOrders, setSortedOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSortedOrders(sorted);
    }
  }, [orders]);

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return; // Prevent redundant API calls
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    toast.success("Order status updated!");
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
      toast.success("Order deleted successfully!");
    }
  };

  const getStatusClass = (status) =>
    clsx(
      "px-3 py-1 rounded-full text-xs font-semibold",
      {
        "bg-yellow-200 text-yellow-800": status === "Pending",
        "bg-blue-200 text-blue-800": status === "Shipped",
        "bg-green-200 text-green-800": status === "Delivered",
        "bg-red-200 text-red-800": status === "Cancelled",
      },
      "border border-gray-300"
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : sortedOrders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Products</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order._id}>
                    {/* Product Details */}
                    <TableCell>
                      <div className="space-y-4">
                        {order.items?.length > 0 ? (
                          order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row items-center gap-4 p-3 border rounded-lg shadow-sm bg-gray-50"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-16 rounded-md object-cover sm:w-20 sm:h-20"
                              />
                              <div className="mt-2 sm:mt-0">
                                <p className="font-semibold text-sm">{item.title}</p>
                                <p className="text-xs text-gray-600">Price: ${item.price}</p>
                                <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-red-500">No Products</p>
                        )}
                      </div>
                    </TableCell>

                    {/* Total Price */}
                    <TableCell className="font-medium">${order.totalPrice?.toFixed(2) || "0.00"}</TableCell>

                    {/* Date & Time */}
                    <TableCell>
                      {order.createdAt ? (
                        <>
                          {new Date(order.createdAt).toLocaleDateString()}{" "}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    {/* Order Status */}
                    <TableCell>
                      <Select
                        defaultValue={order.status || "Pending"}
                        onValueChange={(value) => handleStatusChange(order._id, value, order.status)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder={order.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Delete Action */}
                    <TableCell>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
