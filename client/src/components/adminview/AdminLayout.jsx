import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./Sidebar";
import AdminHeader from "./Header";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Admin Sidebar - Hidden on small screens and shown on larger screens */}
      <AdminSideBar
        open={openSidebar}
        setOpen={setOpenSidebar}
        className="lg:block hidden" // Hide on small screens, show on larger screens
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col transition-all duration-300">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* Page Content */}
        <main className="flex flex-col flex-1 bg-gray-100 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar toggle on small screens */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className="bg-primary text-white p-2 rounded-full"
        >
          {/* Icon for opening/closing the sidebar */}
          {openSidebar ? 'Close' : 'Open'} Sidebar
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
