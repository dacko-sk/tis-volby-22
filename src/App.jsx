import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContextProviders from './context/ContextProviders';
import { segments, separators } from './api/routes';

import AllCampaigns from './pages/AllCampaigns';
import AllDonors from './pages/AllDonors';
import Analyses from './pages/Analyses';
import Article from './pages/Article';
import Candidate from './pages/Candidate';
import Charts from './pages/Charts';
import Home from './pages/Home';
import Municipality from './pages/Municipality';
import News from './pages/News';
import Region from './pages/Region';
import Search from './pages/Search';

import Layout from './components/structure/Layout';

import './App.scss';

const queryClient = new QueryClient();

function App() {
    return (
        <ContextProviders>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path={segments.ROOT} element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route
                                path={segments.CHARTS}
                                element={<Charts />}
                            />
                            <Route
                                path={
                                    segments.CHARTS +
                                    separators.url +
                                    segments.CAMPAIGNS
                                }
                                element={<AllCampaigns />}
                            />
                            <Route
                                path={
                                    segments.CHARTS +
                                    separators.url +
                                    segments.DONORS
                                }
                                element={<AllDonors />}
                            />
                            <Route
                                path={`${segments.MUNICIPALITY}/:town`}
                                element={<Municipality />}
                            />
                            <Route path={segments.NEWS} element={<News />} />
                            <Route
                                path={`${segments.NEWS}/:slug`}
                                element={<Article />}
                            />
                            <Route
                                path={segments.ANALYSES}
                                element={<Analyses />}
                            />
                            <Route
                                path={`${segments.ANALYSES}/:slug`}
                                element={<Article />}
                            />
                            <Route
                                path={`${segments.CANDIDATE}/:slug`}
                                element={<Candidate />}
                            />
                            <Route
                                path={`${segments.REGION}/:region`}
                                element={<Region />}
                            />
                            <Route
                                path={`${segments.SEARCH}/:query`}
                                element={<Search />}
                            />

                            {/* fallback */}
                            <Route
                                path="*"
                                element={<Navigate to={segments.ROOT} />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ContextProviders>
    );
}

export default App;
