import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/shop/ordersSlice/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Statistics Calculation
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;

  // Sort orders by recent date
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // Show only recent 5 orders

  return (
    <div className="p-4 space-y-6">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-blue-100">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-lg sm:text-xl font-bold">{totalOrders}</CardContent>
        </Card>

        <Card className="bg-green-100">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-lg sm:text-xl font-bold">${totalRevenue.toFixed(2)}</CardContent>
        </Card>

        <Card className="bg-yellow-100">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-lg sm:text-xl font-bold">{pendingOrders}</CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs sm:text-sm">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-center text-gray-600">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-xs sm:text-sm">Customer</TableHead>
                    <TableHead className="text-xs sm:text-sm">Total Price</TableHead>
                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="text-xs sm:text-sm">{order.customerName || "N/A"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold text-xs sm:text-sm">{order.status}</TableCell>
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
