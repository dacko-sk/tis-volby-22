import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import useData, { processData } from '../context/DataContext';
import Header from './Header';

function Layout(props) {

  const { setCsvData } = useData();
  // load election data from CSV API and store in context provider
  const { readRemoteFile } = usePapaParse();

  useEffect(() => {
    console.log('requesting CSV data');
    readRemoteFile('https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation.csv', {
      worker: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setCsvData(processData(results));
        console.log('storing CSV data in context');
      },
    });
  }, []);

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
