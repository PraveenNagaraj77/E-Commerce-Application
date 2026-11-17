
import React from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/authslice";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Open admin navigation"
      >
        <AlignJustify size={20} />
      </Button>

      <div className="ml-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
