import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useRefreshAccessTokenMutation } from "../slices/api/authApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

const AuthProvider = ({ children }) => {
  const [refreshAccessToken] = useRefreshAccessTokenMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?.auth_provider) {
      (async () => {
        const res = await refreshAccessToken().unwrap();
        console.log(res);
        dispatch(setCredentials({ ...res }));
      })();
    }
  }, []);
  return <>{children}</>;
};

export default AuthProvider;
