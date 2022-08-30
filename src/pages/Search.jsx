import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import has from 'has';
import Alert from 'react-bootstrap/Alert';
import { labels } from '../api/constants';
import { contains, substitute, substituteCity } from '../api/helpers';
import { routes } from '../api/routes';
import Loading from '../components/general/Loading';
import useData from '../context/DataContext';

function Search() {
    const params = useParams();
    const query = has(params, 'query') ? params.query : null;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            const city = row[labels.elections.municipality_key] ?? '…';
            const citySubst = substitute(city);
            if (
                contains(row.name, query) ||
                contains(city, query) ||
                contains(substituteCity(city), query) ||
                contains(substitute(row.label), query)
            ) {
                const link = routes.candidate(row.name, citySubst);
                candidates.push(
                    <Link to={link} key={row.index} className="candidate-card">
                        <p>{row.name}</p>
                        <p>{city}</p>
                        <p
                            className={`cat-${
                                row[labels.elections.type_key] ===
                                labels.elections.regional.key
                                    ? 'regional'
                                    : 'local'
                            }`}
                        >
                            {substitute(
                                row[labels.elections.type_key] ??
                                    labels.elections.local.key
                            )}
                        </p>
                    </Link>
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

            <h2>Kandidáti ({candidates.length})</h2>
            {candidates.length ? (
                <div className="candidates">{candidates}</div>
            ) : (
                <Alert variant="secondary">
                    Hľadanému výrazu nezodpovedá žiaden kandidát.
                </Alert>
            )}

            <h2>Aktuality (0)</h2>

            <h2>Hodnotenia (0)</h2>
        </section>
    );
}

export default Search;
