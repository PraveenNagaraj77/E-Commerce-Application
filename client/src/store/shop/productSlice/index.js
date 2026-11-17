
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilterProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams = {}, sortParams, search = "" } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          query.set(key.toLowerCase(), value.join(","));
        } else if (typeof value === "string" && value.trim()) {
          query.set(key.toLowerCase(), value.trim());
        }
      });

      if (search.trim()) {
        query.set("search", search.trim());
      }

      if (sortParams) {
        query.set("sortBy", sortParams);
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/shop/products/get?${query.toString()}`
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch products"
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/shop/products/get/${id}`
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch product details"
      );
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProductSlice",
  initialState,

  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilterProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilterProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
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
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
