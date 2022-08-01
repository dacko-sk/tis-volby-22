import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img src="/tis-logo-blue.png" alt="Voľby 2022" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav defaultActiveKey="/" variant="pills" className="me-auto">
            <Nav.Link as={NavLink} to="/">Grafy</Nav.Link>
            <Nav.Link as={NavLink} to="/aktuality">Aktuality</Nav.Link>
            <Nav.Link as={NavLink} to="/hodnotenia">Hodnotenia</Nav.Link>
          </Nav>
          <a role="button" tabIndex="0" href="https://transparency.sk/volby" target="_blank" className="btn btn-secondary btn-xl" rel="noreferrer">PODPORTE</a>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
