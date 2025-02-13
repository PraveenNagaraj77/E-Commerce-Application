import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch the backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Read the base URL from .env

const initialState = {
  isLoading: false,
  cartItems: [],
  error: null,
};

// 🛒 Fetch Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shop/cart/get/${userId}`); // Add `/api/shop/cart/get/` to the base URL
      return response.data.data?.items || []; // Ensure it returns an array
    } catch (error) {
      console.error("Fetch Cart Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// ➕ Add Item to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shop/cart/add`, { userId, productId, quantity }); // Add `/api/shop/cart/add`
      return response.data.data?.items || []; // Ensure it returns an array
    } catch (error) {
      console.error("Add to Cart Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to add product to cart");
    }
  }
);

// ✏️ Update Cart Item Quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      if (!userId || !productId || quantity === undefined) {
        return rejectWithValue("Missing required fields: userId, productId, or quantity");
      }
      const response = await axios.put(`${API_BASE_URL}/api/shop/cart/updatecart`, { userId, productId, quantity }); // Add `/api/shop/cart/updatecart`
      return response.data.data?.items || []; // Ensure it returns an array
    } catch (error) {
      console.error("Update Cart Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item");
    }
  }
);

// ❌ Delete a Cart Item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/shop/cart/${userId}/${productId}`); // Add `/api/shop/cart/{userId}/{productId}`
      return productId; // Return productId for filtering in reducer
    } catch (error) {
      console.error("Delete Cart Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to delete cart item");
    }
  }
);

// 🗑️ Clear Cart (Syncs with Backend)
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/shop/cart/clear/${userId}`); // Add `/api/shop/cart/clear/{userId}`
      return [];
    } catch (error) {
      console.error("Clear Cart Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Cart Items
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

      // ➕ Add to Cart
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

      // ✏️ Update Cart Quantity
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

      // ❌ Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
        }
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🗑️ Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export Reducer
export default shoppingCartSlice.reducer;
