import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import has from 'has';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { labels } from '../api/constants';
import {
    contains,
    sortByNumericProp,
    substitute,
    substituteCity,
} from '../api/helpers';
import { routes, segments } from '../api/routes';
import Loading from '../components/general/Loading';
import Posts from '../components/wp/Posts';
import useData from '../context/DataContext';
import { mainCat } from './Analyses';
import { newsCat } from './News';

function Search() {
    const params = useParams();
    const query = has(params, 'query') ? params.query : null;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = [];
    if (has(csvData, 'data')) {
        csvData.data
            .sort(sortByNumericProp('sum_outgoing', true))
            .forEach((row) => {
                const city = row[labels.elections.municipality_key] ?? '…';
                const citySubst = substitute(city);
                if (
                    row.label !== labels.elections.party_key &&
                    (contains(row.name, query) ||
                        contains(city, query) ||
                        contains(substituteCity(city), query) ||
                        contains(substitute(row.label), query))
                ) {
                    const link = routes.candidate(row.name, citySubst);
                    candidates.push(
                        <Col key={row.index} className="d-flex">
                            <Link
                                to={link}
                                className={`d-flex flex-column justify-content-between w-100 cat-${
                                    row[labels.elections.type_key] ===
                                    labels.elections.regional.key
                                        ? 'regional'
                                        : 'local'
                                }`}
                            >
                                <h3>{row.name}</h3>
                                {row[labels.elections.municipality_key] && (
                                    <div className="town my-3">{city}</div>
                                )}
                                <div className="type">
                                    {substitute(
                                        row[labels.elections.type_key] ??
                                            labels.elections.local.key
                                    )}
                                </div>
                            </Link>
                        </Col>
                    );
                }
            });
    }

    useEffect(() => {
        if (!query) {
            // redirect to root page if no query string is provided
            navigate(routes.home);
        }
    }, [query]);

    if (!has(csvData, 'data')) {
        return <Loading />;
    }

    return (
        <section className="search-results">
            <header className="mb-4">
                <h1>
                    Výsledky vyhľadávania výrazu
                    <br />
                    <span className="orange">„{query}“</span>
                </h1>
            </header>

            <h2 className="mb-4">Kandidáti</h2>
            {candidates.length ? (
                <Row className="candidates gx-4 gy-4">{candidates}</Row>
            ) : (
                <Alert variant="secondary">
                    Hľadanému výrazu nezodpovedá žiaden kandidát.
                </Alert>
            )}

            <h2 className="my-4">Aktuality</h2>
            <Posts
                categories={[newsCat]}
                img="news.png"
                noResults="Hľadaný výraz nebol nájdený v žiadnej z aktualít."
                section={segments.NEWS}
                search={query}
            />

            <h2 className="my-4">Hodnotenia</h2>
            <Posts
                categories={[mainCat]}
                img="politician.png"
                noResults="Hľadaný výraz nebol nájdený v žiadnom hodnotení."
                section={segments.ANALYSES}
                search={query}
            />
        </section>
    );
}

export default Search;
