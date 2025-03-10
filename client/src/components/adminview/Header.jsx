import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // 🔹 Import for navigation
import { logoutUser } from "@/store/authslice";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🔹 Initialize navigate

  function handleLogout() {
    dispatch(logoutUser());
    localStorage.removeItem("token"); 
    sessionStorage.clear(); 
    navigate("/", { replace: true });
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* Menu Toggle Button for Small Screens */}
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block" // Show on small screens and hide on larger screens
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex flex-1 justify-end">
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
