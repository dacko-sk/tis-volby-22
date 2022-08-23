import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import ReactGA from 'react-ga';
import { gaTrackingId } from '../../api/constants';
import useData, { csvFile, buildParserConfig } from '../../context/DataContext';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '../general/CookieBanner';

// const gtag = function (...args) {
//     window.dataLayer.push(args);
// };

function Layout() {
    const { setCsvData } = useData();
    const { readRemoteFile } = usePapaParse();
    const { pathname } = useLocation();
    const [gaReady, setGaReady] = useState(false);

    useEffect(() => {
        // load election data from CSV API and store in context provider
        // TODO: do this also if timestamp of data is older than 1 hour
        console.log('requesting CSV data');
        const parserConfig = buildParserConfig(setCsvData);
        readRemoteFile(csvFile, parserConfig);
    }, []);

    useEffect(() => {
        // init GA
        if (!window.location.href.includes('localhost')) {
            ReactGA.initialize(gaTrackingId);
            setGaReady(true);
        }
        // include https://www.googletagmanager.com/gtag/js?id=UA-134559494-1
        // window.dataLayer = window.dataLayer || [];
        // gtag('consent', 'default', {
        //     ad_storage: 'denied',
        //     ads_data_redaction: 'true',
        //     analytics_storage: 'denied',
        // });
        // gtag('js', new Date());
        // gtag('config', gaTrackingId, {
        //     send_page_view: false,
        // });

        // setGaReady(true);
    }, []);

    useEffect(() => {
        if (gaReady) {
            // send pageview to analytics
            ReactGA.pageview(pathname);
            // // gtag('config', gaTrackingId, {
            // //     page_path: pathname,
            // // });
            // gtag('set', 'page_path', pathname);
            // gtag('event', 'page_view');
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
