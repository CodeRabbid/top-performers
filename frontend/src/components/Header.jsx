import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';


const Header = () => {
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
            <Navbar.Brand><div id="logo">Top Performers</div></Navbar.Brand>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
