import { useEffect } from 'react';
import has from 'has';
import { Outlet, useLocation } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import useData, {
    aggregationFile,
    baseDate,
    buildParserConfig,
    reloadMinutes,
} from '../../context/DataContext';
import { scrollToTop } from '../../api/helpers';
import Header from './Header';
import Footer from './Footer';
import DonateModal from '../general/DonateModal';

function Layout() {
    const { csvData, setCsvData } = useData();
    const lastUpdate = has(csvData, 'lastUpdate')
        ? csvData.lastUpdate
        : baseDate;
    const currentTime = new Date().getTime();
    const outdatedMinutes = (currentTime / 1000 - lastUpdate) / 60;
    const reloadData = outdatedMinutes > reloadMinutes;
    const { readRemoteFile } = usePapaParse();
    const { pathname } = useLocation();

    // load election data from CSV API and store in context provider
    useEffect(() => {
        let timer = null;
        const aggregationConfig = buildParserConfig(setCsvData);
        if (reloadData) {
            readRemoteFile(
                `${aggregationFile}?t=${currentTime}`,
                aggregationConfig
            );
        } else {
            // file is loaded and does not need reloading yet (we know the real last update time) - set timeout
            const minutes = reloadMinutes - outdatedMinutes;
            console.log(`CSV data will be reloaded in ${minutes} minutes`);
            timer = setTimeout(() => {
                readRemoteFile(
                    `${aggregationFile}?t=${currentTime}`,
                    aggregationConfig
                );
            }, minutes * 60 * 1000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [reloadData]);

    // send pageview to analytics on route change
    useEffect(() => {
        if (!window.location.href.includes('localhost')) {
            window.dataLayer.push({
                event: 'pageview',
                page: {
                    path: pathname,
                    title: document.title,
                },
            });
        }
    }, [pathname]);

    // scroll to top when route changes
    useEffect(() => {
        scrollToTop();
    }, [pathname]);

    return (
        <div className="layout-default">
            <Header />
            <main className="container mb-4">
                <Outlet />
            </main>
            <Footer />
            <DonateModal />
        </div>
    );
}

export default Layout;
