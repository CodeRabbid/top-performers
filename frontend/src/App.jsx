import Header from "./components/Header";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <ToastContainer />
        <Container className="my-2">
          <Outlet />
        </Container>
      </AuthProvider>
    </>
  );
}

export default App;
