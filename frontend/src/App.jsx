import Header from "./components/Header";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <Container className="m-0" style={{ width: "120%", maxWidth: "100%" }}>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
