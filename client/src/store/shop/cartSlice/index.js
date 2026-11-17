
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

const CART_API = `${API_BASE_URL}/api/shop/cart`;

const axiosConfig = {
  withCredentials: true,
};

const initialState = {
  isLoading: false,
  cartItems: [],
  error: null,
};

// Fetch authenticated user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CART_API}/get/${userId}`,
        axiosConfig
      );

      return response.data.data?.items || [];
    } catch (error) {
      console.error("Fetch Cart Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CART_API}/add`,
        { userId, productId, quantity },
        axiosConfig
      );

      return response.data.data?.items || [];
    } catch (error) {
      console.error("Add to Cart Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return rejectWithValue("Invalid product ID or quantity");
      }

      const response = await axios.put(
        `${CART_API}/updatecart`,
        { userId, productId, quantity },
        axiosConfig
      );

      return response.data.data?.items || [];
    } catch (error) {
      console.error("Update Cart Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

// Delete individual cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      if (!productId) {
        return rejectWithValue("Product ID is required");
      }

      const response = await axios.delete(
        `${CART_API}/${userId}/${productId}`,
        axiosConfig
      );

      return response.data.data?.items || [];
    } catch (error) {
      console.error("Delete Cart Item Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete cart item"
      );
    }
  }
);

// Clear authenticated user's cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CART_API}/clear/${userId}`,
        axiosConfig
      );

      return response.data.data?.items || [];
    } catch (error) {
      console.error("Clear Cart Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
 reducers: {
  resetCartState: (state) => {
    state.cartItems = [];
    state.error = null;
    state.isLoading = false;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});


export const { resetCartState } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
