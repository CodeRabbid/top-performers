import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import store from "./store";
import LoginScreen from "./screens/LoginScreen.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./components/AuthProvider";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import HomeScreen from "./screens/HomeScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        plugin_name="Memories App"
        cookiepolicy="single_host_origin"
      >
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </GoogleOAuthProvider>
    </AuthProvider>
  </Provider>
);
