import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import adminProductsSlice from './admin/products-slice/index';
import shoppingProductsSlice from './shop/productSlice/index';
import cartProductSlice from './shop/cartSlice/index';
import shopAddressSlice from './shop/addressSlice/index';
import ordersReducer from "./shop/ordersSlice/index"; // Import orders slice

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: adminProductsSlice,
        shopProducts: shoppingProductsSlice,
        cart: cartProductSlice,
        address: shopAddressSlice,
        orders: ordersReducer, // Add orders to store
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // ✅ Ensures async actions work
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
