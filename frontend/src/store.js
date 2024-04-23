import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApiSlice } from "./slices/api/authApiSlice";
import { purchaseApiSlice } from "./slices/api/purchaseApiSlice";
import { apiSlice } from "./slices/api/baseApiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [purchaseApiSlice.reducerPath]: purchaseApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      authApiSlice.middleware,
    ]),
  devTools: true,
});

export default store;
