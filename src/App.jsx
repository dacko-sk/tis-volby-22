import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.scss';
import Layout from './components/structure/Layout';
import Charts from './components/pages/Charts';
import GSCharts from './components/pages/GSCharts';
import News from './components/pages/News';
import Analyses from './components/pages/Analyses';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Layout /> }>
            <Route index element={ <Charts /> } />
            <Route path="gscharts" element={ <GSCharts /> } />
            <Route path="aktuality" element={ <News /> } />
            <Route path="hodnotenia" element={ <Analyses /> } />

            { /* fallback */ }
            <Route path='*' element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
