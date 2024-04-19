import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import {
  useLogoutMutation,
  useRefreshAccessTokenMutation,
} from "../slices/api/authApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const AuthProvider = ({ children }) => {
  const [refreshAccessToken] = useRefreshAccessTokenMutation();
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?.auth_provider) {
      (async () => {
        try {
          const res = await refreshAccessToken().unwrap();
          dispatch(setCredentials({ ...res }));
        } catch (err) {
          await logoutApiCall().unwrap();
          dispatch(logout());
        }
      })();
    }
  }, []);
  return <>{children}</>;
};

export default AuthProvider;
