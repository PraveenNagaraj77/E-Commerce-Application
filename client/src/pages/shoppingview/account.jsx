import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner from "../../assets/banner1.jpg";
import { useNavigate } from "react-router-dom";
import {
  fetchAllAddress,
  addNewAddress,
  editAddress,
  deleteAddress,
  setSelectedAddress,
} from "../../store/shop/addressSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShoppingAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addressList, isLoading } = useSelector((state) => state.address);
  const { toast } = useToast();
  const userId = useSelector((state) => state.auth.user?.id);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllAddress(userId));
  }, [dispatch, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.pincode || !formData.phone) {
      toast({ title: "Error", description: "All fields are required!", variant: "destructive" });
      return;
    }
    const payload = { userId, ...formData };
    try {
      await dispatch(addNewAddress(payload));
      toast({ title: "Success", description: "Address added successfully!" });
      setEditMode(false);
      setFormData({ address: "", city: "", pincode: "", phone: "", notes: "" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to add address!", variant: "destructive" });
    }
  };

  const handleEdit = (address) => {
    setEditMode(true);
    setCurrentAddressId(address._id);
    setFormData({ ...address });
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress({ userId, addressId })).unwrap();
        toast({ title: "Address Deleted", description: "Deleted successfully!", variant: "success" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete address!", variant: "destructive" });
      }
    }
  };

  const handleSelectAddress = (address) => {
    dispatch(setSelectedAddress(address));
    toast({ title: "Selected for Checkout", description: "Address chosen for checkout.", variant: "info" });
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast({ title: "No Address Selected", description: "Please select an address before proceeding.", variant: "destructive" });
      return;
    }
    navigate(`/shop/checkout`);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4 sm:mb-6">
        <img src={banner} alt="Banner" className="w-full h-full object-cover rounded-lg" />
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Saved Addresses</h3>
          <div className="grid gap-3 sm:gap-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : addressList.length > 0 ? (
              addressList.map((address) => (
                <Card key={address._id} className="p-3 sm:p-4 shadow-md">
                  <CardContent>
                    <p className="text-sm sm:text-base"><strong>Address:</strong> {address.address}, {address.city} - {address.pincode}</p>
                    <p className="text-sm sm:text-base"><strong>Phone:</strong> {address.phone}</p>
                    <p className="text-sm sm:text-base"><strong>Notes:</strong> {address.notes || "No Notes"}</p>
                  </CardContent>
                  <div className="flex flex-col sm:flex-row gap-2 justify-between mt-2">
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(address)} variant="outline" className="p-1 sm:p-2">
                        <Edit size={16} />
                      </Button>
                      <Button onClick={() => handleDelete(address._id)} variant="destructive" className="p-1 sm:p-2">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <Button onClick={() => handleSelectAddress(address)} className="p-1 sm:p-2">
                      <CheckCircle size={16} /> {selectedAddress?._id === address._id ? "Selected" : "Choose"}
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p>No addresses found.</p>
            )}
          </div>
          <Button onClick={handleCheckout} className="mt-4 sm:mt-6 w-full bg-green-500 text-white p-2 sm:p-3">
            Proceed to Checkout
          </Button>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{editMode ? "Edit Address" : "Add New Address"}</h3>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
            {Object.keys(formData).map((field) => (
              <Input key={field} name={field} placeholder={field} value={formData[field]} onChange={handleChange} required className="p-2 sm:p-3" />
            ))}
            <Button type="submit" className="w-full p-2 sm:p-3">{editMode ? "Update Address" : "Add Address"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;