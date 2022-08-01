import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProvider } from './components/context/DataContext';

import Layout from './components/structure/Layout';
import Home from './components/pages/Home';
import Charts from './components/pages/Charts';
import News from './components/pages/News';
import Analyses from './components/pages/Analyses';

import './App.scss';

const queryClient = new QueryClient()

function App() {
  return (
    <DataProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Layout /> }>
              <Route index element={ <Home /> } />
              <Route path="grafy" element={ <Charts /> } />
              <Route path="aktuality" element={ <News /> } />
              <Route path="hodnotenia" element={ <Analyses /> } />

              { /* fallback */ }
              <Route path='*' element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </DataProvider>
  );
}

export default App;
