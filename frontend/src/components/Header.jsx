import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <div id="logo">Top Performers</div>
            </Navbar.Brand>
          </LinkContainer>
          <Nav className="ms-auto">
            <>
              <LinkContainer to="/register">
                <Nav.Link>
                  <FaSignOutAlt /> <div id="register">Register</div>
                </Nav.Link>
              </LinkContainer>
            </>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
