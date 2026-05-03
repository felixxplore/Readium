// features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, refreshToken, verifyUser,initializeAuth } from "./authThunks";

interface AuthState {
  isAuthenticated: boolean;
  hasUsername: boolean | null;
  loading: boolean;
   user: null | {
    email: string;
    roles: string[];
  };
  status: "idle" | "loading" | "authenticated" | "unauthenticated";

  error: string | null;

}

const initialState: AuthState = {
  isAuthenticated: false,
  hasUsername: null,
  loading: false,
  user:null,
  status: "loading", // 🔥 start as loading (important)
  error: null,

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder 
      .addCase(verifyUser.fulfilled, (state, action) => { 
        state.isAuthenticated = true;
        state.hasUsername = action.payload.hasUsername;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.status = "unauthenticated";
        state.isAuthenticated = false;
        state.user = null;
      })
       .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.hasUsername = action.payload.hasUsername;
        state.status = "authenticated";
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.status = "unauthenticated";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
