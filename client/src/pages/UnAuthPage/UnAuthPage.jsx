
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnAuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <ShieldAlert size={32} className="text-red-500" />
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Access Restricted
        </p>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          You don't have access
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          Sorry, you don't have permission to view this page. Please sign in
          with an authorized account or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="h-11 gap-2 rounded-lg"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="h-11 gap-2 rounded-lg"
          >
            <Home size={16} />
            Homepage
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400">
          <LockKeyhole size={13} />
          Protected Area
        </div>
      </div>
    </div>
  );
};

export default UnAuthPage;
