// features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }) => {
    await api.post("/auth/register", data);
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (token: string) => {
    const res = await api.post("/auth/verify", null, { params:{token} });
    return res.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const setUsername = createAsyncThunk(
  "auth/username",
  async (username: string) => {
    await api.post("/user/set-username", { username });
  }
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email: string) => {
    await api.post("/auth/resend-verification", { email });
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/refresh");
      return res.data; // { user }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Refresh failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await api.post("/auth/logout");
  }
);

// This thunk now handles the "Initialization" of the app
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      // 1. Try to refresh the token (Backend will look at the Cookie)
      await api.post("/auth/refresh"); 
      
      // 2. If refresh succeeded, we have a new Access Cookie. 
      // Now fetch the actual user data.
      const res = await api.get("/user/me"); 
      return res.data; // { user: { email, roles }, hasUsername: true }
    } catch (err: any) {
      return rejectWithValue("Session expired");
    }
  }
);