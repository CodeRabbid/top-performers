import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApiSlice } from "./slices/api/authApiSlice";

const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApiSlice.middleware]),
  devTools: true,
});

export default store;
