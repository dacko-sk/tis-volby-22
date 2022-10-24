import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { SocialIcon } from 'react-social-icons';

import { colorOrange } from '../../api/constants';
import { imgPath } from '../../api/helpers';

import CookieBanner from '../general/CookieBanner';
import DonateButton from '../general/DonateButton';
import FbFeed from '../general/FbFeed';

function Footer() {
    return (
        <footer className="mt-auto">
            <div className="footer-top py-5">
                <Container>
                    <h2 className="mb-3 text-center">Donori projektu</h2>
                    <Row className="justify-content-around">
                        <Col
                            className="d-flex mb-3 mb-md-0"
                            xs={10}
                            md={5}
                            xl={4}
                        >
                            <img
                                className="mw-100 align-self-center"
                                src={imgPath('Visegrad_logo_black.png')}
                            />
                        </Col>
                        <Col
                            className="d-flex mb-3 mb-md-0"
                            xs={10}
                            md={5}
                            xl={4}
                        >
                            <img
                                className="mw-100 align-self-center"
                                src={imgPath('ACF_logo.png')}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className="donors mt-2 mb-4 fst-italic">
                                Projekt ‘Aktívnym občianstvom ku kvalitnejšej
                                samospráve (With Active Citizenship for a Better
                                Selfgovernment)’ je podporený z programu ACF -
                                Slovakia, ktorý je financovaný z Finančného
                                mechanizmu EHP 2014-2021. Správcom programu je
                                Nadácia Ekopolis v partnerstve s Nadáciou
                                otvorenej spoločnosti Bratislava a Karpatskou
                                nadáciou.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} lg={4}>
                            <h2 className="mb-3">Kontakt</h2>
                            <a
                                href="https://www.transparency.sk"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="logo"
                                    src={imgPath('tis-logo-blue.png')}
                                    alt="Transparency International Slovensko"
                                />
                            </a>
                            <p className="mt-3">
                                Transparency International Slovensko
                                <br />
                                Bajkalská 25
                                <br />
                                827 18 Bratislava
                            </p>
                            <p>
                                <a href="tel:+421905613779">+421 905 613 779</a>
                                <br />
                                <a href="mailto:tis@transparency.sk">
                                    tis@transparency.sk
                                </a>
                                <br />
                                <a
                                    href="https://www.transparency.sk"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    www.transparency.sk
                                </a>
                            </p>
                            <h2 className="mt-4 mb-0">Sledujte nás</h2>
                            <div className="social-icons my-3">
                                <SocialIcon
                                    bgColor={colorOrange}
                                    className="me-2"
                                    url="https://www.facebook.com/transparencysk"
                                />
                                <SocialIcon
                                    bgColor={colorOrange}
                                    className="me-2"
                                    url="https://www.instagram.com/transparencysk"
                                />
                                <SocialIcon
                                    bgColor={colorOrange}
                                    className="me-2"
                                    url="https://twitter.com/transparencysk"
                                />
                                <SocialIcon
                                    bgColor={colorOrange}
                                    className="me-2"
                                    url="https://www.linkedin.com/company/transparency-international-slovakia"
                                />
                                <SocialIcon
                                    bgColor={colorOrange}
                                    url="https://www.youtube.com/user/TISlovensko"
                                />
                            </div>
                        </Col>
                        <Col md={6} lg={4}>
                            <h2 className="mb-3">Užitočné informácie</h2>
                            <ul className="arrows">
                                <li>
                                    <a
                                        href="https://volby.transparency.sk/parlament2020/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Parlamentné voľby 2020
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://volby.transparency.sk/prezident2019/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Prezidentské voľby 2019
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://transparency.sk/sk/sukromie/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Ochrana súkromia
                                    </a>
                                </li>
                            </ul>
                            <CookieBanner />
                            <h2 className="mt-4 mb-0">Newsletter</h2>
                            <Button
                                className="mt-3"
                                href="https://eepurl.com/doWD8X"
                                target="_blank"
                                variant="secondary"
                            >
                                Prihlásiť sa na newsletter
                            </Button>
                            <h2 className="mt-4 mb-0">Podporte Transparency</h2>
                            <DonateButton className="mt-3 mb-4" />
                        </Col>
                        <Col md={12} lg={4}>
                            <FbFeed
                                appId="210544879524339"
                                name="Transparency International Slovensko"
                                url="https://www.facebook.com/transparencysk"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="footer-bottom py-3">
                <Container>
                    <Row>
                        <Col>© 2022 Transparency International Slovensko</Col>
                        <Col xs="auto">
                            <a href="https://www.linkedin.com/in/hrtanek">
                                Webové riešenie
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
}

export default Footer;
