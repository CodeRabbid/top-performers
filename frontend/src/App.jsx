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
      <Container
        style={{
          width: "100%",
          minWidth: "320px",
          maxWidth: "880px",
          marginLeft: "auto",
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}

export default App;
