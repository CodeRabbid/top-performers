import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from "../slices/api/authApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import GoogleLogo from "../assets/google-logo.svg?react";

import { useGoogleLogin } from "@react-oauth/google";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const code = queryParameters.get("code");

    if (code) {
      (async () => {
        try {
          const res = await googleLogin({ code }).unwrap();
          dispatch(setCredentials({ ...res }));
        } catch (err) {
          console.error(err?.data?.message || err.error);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (userInfo?.access_token) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const googleLoginHandler = useGoogleLogin({
    ux_mode: "redirect",
    redirect_uri: "http://localhost:3000/login",
    flow: "auth-code",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button
            disabled={isLoading}
            type="submit"
            variant="primary"
            className="mt-2"
          >
            Log in
          </Button>
          <Button
            disabled={isLoading}
            variant="primary"
            className="mt-0"
            onClick={googleLoginHandler}
            style={{ backgroundColor: "rgb(230, 238, 252)", color: "black" }}
          >
            <GoogleLogo style={{ height: "18px", width: "18px" }} />
            &nbsp;Google Log in
          </Button>
        </div>
      </Form>

      {isLoading && <Loader />}

      <Row className="py-3">
        <Col>
          New Customer? <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
