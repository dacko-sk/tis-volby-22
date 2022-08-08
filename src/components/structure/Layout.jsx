import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import useData, { csvFile, buildParserConfig } from '../../context/DataContext';
import Header from './Header';

function Layout(props) {

  const { setCsvData } = useData();
  const { readRemoteFile } = usePapaParse();
  const { pathname } = useLocation();

  useEffect(() => {
    // load election data from CSV API and store in context provider
    console.log('requesting CSV data');
    const parserConfig = buildParserConfig(setCsvData);
    readRemoteFile(csvFile, parserConfig);
  }, []);

  useEffect(() => {
    // scroll to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="layout-default">
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
