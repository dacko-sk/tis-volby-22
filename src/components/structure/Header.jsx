import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { labels } from '../../api/constants';
import { imgPath } from '../../api/helpers';
import { routes } from '../../api/routes';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to={routes.home}>
                    <img src={imgPath('tis-logo-blue.png')} alt="Voľby 2022" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        defaultActiveKey={routes.home}
                        variant="pills"
                        className="me-auto"
                    >
                        <Nav.Link as={NavLink} to={routes.home}>
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
                    <Form className="mt-2 mt-lg-0 mx-0 mx-lg-3">
                        <InputGroup>
                            <Form.Control
                                placeholder={labels.search}
                                aria-label={labels.search}
                                aria-describedby="search-icon"
                                id="search"
                            />
                            <InputGroup.Text
                                id="search-icon"
                                className="d-lg-none d-xl-flex"
                            >
                                🔍
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>
                    <Button
                        className="btn-xl text-uppercase fw-bold"
                        href="https://transparency.sk/volby"
                        target="_blank"
                        variant="secondary"
                    >
                        Podporte
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
