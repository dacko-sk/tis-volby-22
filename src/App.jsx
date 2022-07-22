import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import Layout from './components/structure/Layout';
import Charts from './components/pages/Charts';
import News from './components/pages/News';
import Analyses from './components/pages/Analyses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> }>
          <Route index element={ <Charts /> } />
          <Route path="aktuality" element={ <News /> } />
          <Route path="hodnotenia" element={ <Analyses /> } />

          { /* fallback */ }
          <Route path='*' element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
