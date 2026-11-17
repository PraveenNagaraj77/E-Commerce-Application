
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./Sidebar";
import AdminHeader from "./Header";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50">
      <AdminSideBar
        open={openSidebar}
        setOpen={setOpenSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader setOpen={setOpenSidebar} />

        <main className="min-w-0 flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
