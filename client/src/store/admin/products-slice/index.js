
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export const addNewProduct = createAsyncThunk(
  "products/addnewproduct",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${BACKEND_URL}/api/admin/products/add`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchallproducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        `${BACKEND_URL}/api/admin/products/get`
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editproduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `${BACKEND_URL}/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteproduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.delete(
        `${BACKEND_URL}/api/admin/products/delete/${id}`
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Add product
      .addCase(addNewProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Edit product
      .addCase(editProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Delete product
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default AdminProductsSlice.reducer;
