
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <div className="text-8xl font-extrabold tracking-tighter text-gray-100 sm:text-9xl">
          404
        </div>

        <div className="mx-auto -mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <SearchX size={27} className="text-gray-600" />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Page Not Found
        </p>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Looks like you're lost
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          The page you're looking for doesn't exist, may have been moved, or
          the link might be incorrect.
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
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
