import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Set Base URL for API Requests
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Base URL
});

const initialState = {
  isLoading: false,
  addressList: [],
  selectedAddress: null,
  error: null,
};

// ✅ Add New Address
export const addNewAddress = createAsyncThunk(
  "addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/shop/address/add", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding address");
    }
  }
);

// ✅ Fetch All Addresses for a User
export const fetchAllAddress = createAsyncThunk(
  "addresses/fetchAllAddress",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/shop/address/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching addresses");
    }
  }
);

// ✅ Edit Address
export const editAddress = createAsyncThunk(
  "addresses/editAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/shop/address/update/${userId}/${addressId}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating address");
    }
  }
);

// ✅ Delete Address
export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/shop/address/delete/${userId}/${addressId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting address");
    }
  }
);

// ✅ Main Address Slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // ✅ Store selected address in Redux & sessionStorage
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      sessionStorage.setItem("selectedAddress", JSON.stringify(action.payload));
    },
    // ✅ Clear selected address from Redux & sessionStorage
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      sessionStorage.removeItem("selectedAddress");
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Add Address Cases
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.data) {
          state.addressList.push(action.payload.data);
        }
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Fetch All Addresses Cases
      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data || [];
      })
      .addCase(fetchAllAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Edit Address Cases
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.map((addr) =>
          addr._id === action.payload.data._id ? action.payload.data : addr
        );
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Delete Address Cases
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.filter(
          (addr) => addr._id !== action.meta.arg.addressId
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export Reducers and Actions
export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
