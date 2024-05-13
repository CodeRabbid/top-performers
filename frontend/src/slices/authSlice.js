import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("access_token")
    ? {
        access_token: localStorage.getItem("access_token"),
        user_info: localStorage.getItem("user_info"),
        auth_provider: localStorage.getItem("auth_provider"),
      }
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem("auth_provider", action.payload.auth_provider);
      localStorage.setItem("access_token", action.payload.access_token);
      localStorage.setItem("user_info", action.payload.user_info);
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("auth_provider");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
