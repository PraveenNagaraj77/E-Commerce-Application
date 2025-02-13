import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/shop/ordersSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.orders); // ✅ Prevent undefined error
  const { user } = useSelector((state) => state.auth);
  const { lastOrder } = useSelector((state) => state.cart); 

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user?.id, lastOrder]); // ✅ Ensured minimal re-renders

  // ✅ Sort orders (Latest First)
  const sortedOrders = orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ✅ Order Status Badge Styling
  const getStatusClass = (status) => clsx(
    "px-3 py-1 rounded-full text-xs font-semibold border border-gray-300",
    {
      "bg-yellow-200 text-yellow-800": status === "Pending",
      "bg-blue-200 text-blue-800": status === "Shipped",
      "bg-green-200 text-green-800": status === "Delivered",
      "bg-red-200 text-red-800": status === "Cancelled",
    }
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : sortedOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) =>
                  (order.items || []).map((item) => (
                    <TableRow key={item?.productId?._id || Math.random()}>
                      <TableCell className="flex items-center gap-3">
                        <img
                          src={item?.productId?.image || "https://via.placeholder.com/60"}
                          alt={item?.title || "Product"}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <span className="font-medium">{item?.title || "Unknown Product"}</span>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusClass(order.status)}>
                          {order.status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>${order.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyOrders;
