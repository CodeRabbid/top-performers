import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("auth_provider")
    ? { auth_provider: localStorage.getItem("auth_provider") }
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem("auth_provider", action.payload.auth_provider);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
