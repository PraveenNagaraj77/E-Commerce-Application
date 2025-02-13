import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

// ✅ Fetch the backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Get the base URL from .env

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
}

export const fetchAllFilterProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (filterParams && typeof filterParams === "object" && Object.keys(filterParams).length > 0) {
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value && value.length > 0) {  // Ensure empty filters are not included
            query.set(key.toLowerCase(), Array.isArray(value) ? value.join(",") : value);
          }
        });
      }

      if (sortParams) {
        query.set("sortBy", sortParams);
      }

      const queryString = query.toString();
      const apiUrl = queryString
        ? `${API_BASE_URL}/api/shop/products/get?${queryString}`
        : `${API_BASE_URL}/api/shop/products/get`;

      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    try {
      const apiUrl = `${API_BASE_URL}/api/shop/products/get/${id}`;
      const result = await axios.get(apiUrl);
      return result.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: 'shoppingProducts',
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilterProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilterProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilterProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  }
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
