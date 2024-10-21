import { NavLink } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { elections as el, labels, links } from '../../api/constants';
import { routes } from '../../api/routes';

function SiteSelector({ site }) {
    return (
        <NavDropdown
            title={labels.home.navTitle}
            id="elections-menu"
            className={routes.home === document.location.pathname ? 'show' : ''}
        >
            {site ? (
                <NavDropdown.Item href="/">{labels.root}</NavDropdown.Item>
            ) : (
                <NavDropdown.Item as={NavLink} to={routes.home}>
                    {labels.root}
                </NavDropdown.Item>
            )}
            {Object.keys(el).map((e) =>
                site === e ? (
                    <NavDropdown.Item key={e} as={NavLink} to={routes.home}>
                        {labels.elections[e]}
                    </NavDropdown.Item>
                ) : (
                    <NavDropdown.Item key={e} href={links[e]}>
                        {labels.elections[e]}
                    </NavDropdown.Item>
                )
            )}
        </NavDropdown>
    );
}

export default SiteSelector;
