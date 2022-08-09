import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { imgPath } from '../../api/helpers';
import { routes } from '../../api/routes';

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to={routes.home}>
          <img src={ imgPath('tis-logo-blue.png') } alt="Voľby 2022" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav defaultActiveKey={routes.home} variant="pills" className="me-auto">
            <Nav.Link as={NavLink} to={routes.home}>Voľby 2022</Nav.Link>
            <Nav.Link as={NavLink} to={routes.charts}>Grafy</Nav.Link>
            <Nav.Link as={NavLink} to={routes.news}>Aktuality</Nav.Link>
            <Nav.Link as={NavLink} to={routes.analyses}>Hodnotenia</Nav.Link>
          </Nav>
          <a role="button" tabIndex="0" href="https://transparency.darujme.sk/volby/" target="_blank" className="btn btn-secondary btn-xl" rel="noreferrer">PODPORTE</a>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
