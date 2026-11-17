
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllAddress,
  addNewAddress,
  editAddress,
  deleteAddress,
  setSelectedAddress,
  clearSelectedAddress,
} from "../../store/shop/addressSlice";
import {
  MapPin,
  Phone,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Loader2,
  MapPinned,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const ShoppingAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userId = useSelector((state) => state.auth.user?.id);

  const {
    addressList = [],
    isLoading,
    selectedAddress,
    error,
  } = useSelector((state) => state.address);

  const [formData, setFormData] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAddress(userId));
    }
  }, [dispatch, userId]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditMode(false);
    setCurrentAddressId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      toast({
        title: "Login required",
        description: "Please log in to manage your addresses.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
    };

    if (
      !payload.address ||
      !payload.city ||
      !payload.pincode ||
      !payload.phone
    ) {
      toast({
        title: "Missing information",
        description: "Please complete all required address fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (editMode) {
        const response = await dispatch(
          editAddress({
            userId,
            addressId: currentAddressId,
            formData: payload,
          })
        ).unwrap();

        const updatedAddress = response?.data;

        if (selectedAddress?._id === currentAddressId && updatedAddress) {
          dispatch(setSelectedAddress(updatedAddress));
        }

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        });
      } else {
        await dispatch(
          addNewAddress({
            userId,
            ...payload,
          })
        ).unwrap();

        toast({
          title: "Address added",
          description: "Your new address has been saved.",
        });
      }

      resetForm();
    } catch (err) {
      toast({
        title: "Unable to save address",
        description:
          err?.message || err?.error || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditMode(true);
    setCurrentAddressId(address._id);

    setFormData({
      address: address.address || "",
      city: address.city || "",
      pincode: address.pincode || "",
      phone: address.phone || "",
      notes: address.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved address?"
    );

    if (!confirmed) return;

    setDeletingAddressId(addressId);

    try {
      await dispatch(
        deleteAddress({
          userId,
          addressId,
        })
      ).unwrap();

      if (selectedAddress?._id === addressId) {
        dispatch(clearSelectedAddress());
      }

      if (currentAddressId === addressId) {
        resetForm();
      }

      toast({
        title: "Address deleted",
        description: "The saved address has been removed.",
      });
    } catch (err) {
      toast({
        title: "Unable to delete address",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleSelectAddress = (address) => {
    dispatch(setSelectedAddress(address));

    toast({
      title: "Address selected",
      description: "This address will be used at checkout.",
    });
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast({
        title: "Select an address",
        description: "Choose a delivery address before proceeding.",
        variant: "destructive",
      });
      return;
    }

    navigate("/shop/checkout");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

      {/* Page Heading */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          My Account
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Delivery Addresses
        </h1>

        <p className="text-sm text-gray-500">
          Manage your saved addresses and choose where your orders should be delivered.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_0.9fr]">

        {/* Saved Addresses */}
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Saved Addresses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {addressList.length} saved{" "}
                {addressList.length === 1 ? "address" : "addresses"}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                document.getElementById("address-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="shrink-0 gap-2 rounded-lg"
            >
              <Plus size={16} />
              Add New
            </Button>
          </div>

          {isLoading && addressList.length === 0 ? (
            <div className="flex min-h-52 items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              Loading saved addresses...
            </div>
          ) : error && addressList.length === 0 ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              Unable to load your addresses. Please refresh and try again.
            </div>
          ) : addressList.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <MapPinned size={25} className="text-gray-400" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No saved addresses
              </h3>

              <p className="mt-1 max-w-xs text-sm text-gray-500">
                Add your delivery address to make checkout quicker.
              </p>

              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  document.getElementById("address-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="mt-5 gap-2 rounded-lg"
              >
                <Plus size={16} />
                Add your first address
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {addressList.map((address) => {
                const isSelected =
                  selectedAddress?._id === address._id;

                return (
                  <article
                    key={address._id}
                    className={`rounded-xl border bg-white p-4 transition sm:p-5 ${
                      isSelected
                        ? "border-gray-900 ring-1 ring-gray-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Home size={19} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words font-semibold text-gray-900">
                              Delivery Address
                            </h3>

                            {isSelected && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-800">
                                <CheckCircle2 size={12} />
                                Selected
                              </span>
                            )}
                          </div>

                          <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                            {address.address}, {address.city} - {address.pincode}
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <Phone size={14} />
                            {address.phone}
                          </p>

                          {address.notes && (
                            <p className="mt-2 break-words text-xs text-gray-400">
                              Note: {address.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleEdit(address)}
                          aria-label="Edit address"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(address._id)}
                          disabled={deletingAddressId === address._id}
                          aria-label="Delete address"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingAddressId === address._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() => handleSelectAddress(address)}
                        disabled={isSelected}
                        className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition sm:w-auto ${
                          isSelected
                            ? "cursor-default bg-gray-100 text-gray-500"
                            : "bg-gray-900 text-white hover:bg-gray-700"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 size={16} />
                            Selected for Checkout
                          </>
                        ) : (
                          <>
                            <MapPin size={16} />
                            Deliver to this address
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Checkout */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  Ready to checkout?
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedAddress
                    ? "Your selected delivery address is ready."
                    : "Select a delivery address to continue."}
                </p>
              </div>

              <CheckCircle2
                size={21}
                className={selectedAddress ? "text-green-600" : "text-gray-300"}
              />
            </div>

            <Button
              type="button"
              onClick={handleCheckout}
              disabled={!selectedAddress}
              className="mt-4 h-11 w-full gap-2 rounded-lg"
            >
              Proceed to Checkout
              <ArrowRight size={17} />
            </Button>
          </div>
        </section>

        {/* Address Form */}
        <section
          id="address-form"
          className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Address Details
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {editMode ? "Edit Address" : "Add New Address"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your delivery information below.
              </p>
            </div>

            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                aria-label="Cancel editing"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House number, street, area"
                required
                className="h-11 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="h-11 rounded-lg"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <Input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="PIN code"
                  inputMode="numeric"
                  required
                  className="h-11 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contact number"
                type="tel"
                required
                className="h-11 rounded-lg"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Delivery Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Landmark, delivery instructions (optional)"
                rows={3}
                className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full gap-2 rounded-lg"
              >
                {submitting ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : editMode ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={17} />
                )}

                {submitting
                  ? "Saving..."
                  : editMode
                  ? "Update Address"
                  : "Save Address"}
              </Button>

              {editMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                  className="h-10 w-full rounded-lg"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ShoppingAccount;
