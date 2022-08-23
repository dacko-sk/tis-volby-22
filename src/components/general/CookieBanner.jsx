import { useState } from 'react';
import Button from 'react-bootstrap/Button';

import './CookieBanner.scss';

function CookieBanner() {
    const cookieAccept = 'tis-cookies';
    const cookieAcceptedVal = '1';
    const [accepted, setAccepted] = useState(false);

    if (accepted || localStorage.getItem(cookieAccept) === cookieAcceptedVal) {
        return <></>;
    }

    const handleClick = () => {
        localStorage.setItem(cookieAccept, cookieAcceptedVal);
        setAccepted(true);
    };

    return (
        <div className="cookie-banner text-center py-4">
            <p>
                Táto webová stránka používa cookies, aby vám priniesla čo
                najlepší online zážitok.{' '}
                <a
                    href="https://transparency.sk/sk/sukromie/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Zistiť viac
                </a>
            </p>
            <Button variant="success" onClick={handleClick}>
                Súhlasím
            </Button>
        </div>
    );
}

export default CookieBanner;
