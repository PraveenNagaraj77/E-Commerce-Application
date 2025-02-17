import axios from 'axios'; 
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Load backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
    isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
    isLoading: true,
    user: JSON.parse(localStorage.getItem("user")) || null
};

export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/register`, formData, {
            withCredentials: true
        });

        return response.data;
    }
);

export const loginUser = createAsyncThunk('/auth/login',
    async (formData) => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, formData, {
            withCredentials: true
        });

        return response.data;
    }
);

export const logoutUser = createAsyncThunk('/auth/logout',
    async () => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
            withCredentials: true
        });

        return response.data;
    }
);

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async () => {
        const response = await axios.get(`${BACKEND_URL}/api/auth/checkauth`, {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-store,no-cache,must-revalidate,proxy-revalidate',
            }
        });

        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {}
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = true;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            
                // ✅ Store in localStorage
                if (action.payload.success) {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    localStorage.setItem("isAuthenticated", JSON.stringify(true));
                }
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = true;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            
                // ✅ Store in localStorage
                if (action.payload.success) {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    localStorage.setItem("isAuthenticated", JSON.stringify(true));
                } else {
                    localStorage.removeItem("user");
                    localStorage.removeItem("isAuthenticated");
                }
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            
                // ✅ Clear localStorage
                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            })
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
