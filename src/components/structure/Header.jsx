import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { routes } from '../../api/routes';

import DonateButton from '../general/DonateButton';
import SearchField from '../general/SearchField';

import logoTis from '../../assets/img/tis-logo-blue.png';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="https://volby.transparency.sk">
                    <img src={logoTis} alt="Voľby 2022" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        defaultActiveKey={routes.home}
                        variant="pills"
                        className="me-auto"
                    >
                        <Nav.Link as={NavLink} to={routes.home} end>
                            Voľby 2022
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.charts}>
                            Grafy
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.news}>
                            Aktuality
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routes.analyses}>
                            Hodnotenia
                        </Nav.Link>
                    </Nav>
                    <SearchField />
                    <DonateButton xl />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
