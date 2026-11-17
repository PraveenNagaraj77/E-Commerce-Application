
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Home, UserPlus } from "lucide-react";

import CommonForm from "@/components/common/CommonForm";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/authslice";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function onSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const data = await dispatch(registerUser(formData)).unwrap();

      if (data?.success) {
        toast({
          title: data?.message || "Account created successfully",
        });

        navigate("/auth/login", { replace: true });
      } else {
        toast({
          title: data?.message || "Unable to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title:
          error?.message ||
          error?.error ||
          (typeof error === "string"
            ? error
            : "Registration failed. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-7">

      {/* Heading */}
      <div className="space-y-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
          <UserPlus size={21} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Join Us
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign up to explore products and enjoy a personalized shopping experience.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <CommonForm
        formControls={registerFormControls}
        buttonText={isSubmitting ? "Creating Account..." : "Create Account"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isSubmitting}
      />

      {/* Bottom Navigation */}
      <div className="space-y-5 border-t border-gray-200 pt-6">
        <p className="text-center text-sm text-gray-500">
          Already have an account?
          <Link
            className="ml-2 font-semibold text-gray-950 transition hover:text-gray-600 hover:underline"
            to="/auth/login"
          >
            Sign In
          </Link>
        </p>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AuthRegister;
