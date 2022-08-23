import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
// import ReactGA from 'react-ga';
import { gaTrackingId } from '../../api/constants';
import useData, { csvFile, buildParserConfig } from '../../context/DataContext';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '../general/CookieBanner';

function Layout() {
    const { setCsvData } = useData();
    const { readRemoteFile } = usePapaParse();
    const { pathname } = useLocation();
    const [gaReady, setGaReady] = useState(false);

    useEffect(() => {
        // load election data from CSV API and store in context provider
        // TODO: do this also if timestamp of data is older than 1 hour
        const parserConfig = buildParserConfig(setCsvData);
        readRemoteFile(csvFile, parserConfig);
    }, []);

    useEffect(() => {
        // init GA
        if (!window.location.href.includes('localhost')) {
            // ReactGA.initialize(gaTrackingId);
            setGaReady(true);
        }
    }, []);

    useEffect(() => {
        if (gaReady) {
            // send pageview to analytics
            // ReactGA.pageview(pathname);
            window.gtag('config', gaTrackingId, {
                page_path: pathname,
            });
        }
    }, [gaReady, pathname]);

    useEffect(() => {
        // scroll to top when route changes
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="layout-default">
            <Header />
            <main className="container mb-4">
                <Outlet />
            </main>
            <Footer />
            <CookieBanner />
        </div>
    );
}

export default Layout;
