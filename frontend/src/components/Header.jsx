import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';


const Header = () => {
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
            <Navbar.Brand>Top Performers</Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
