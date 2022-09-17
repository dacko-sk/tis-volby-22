import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import has from 'has';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { labels } from '../api/constants';
import {
    contains,
    setTitle,
    sortByNumericProp,
    substitute,
    substituteCity,
} from '../api/helpers';
import { routes, segments } from '../api/routes';
import { analysesImg, analysesCat } from './Analyses';
import { newsCat, newsImg } from './News';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';
import useData from '../context/DataContext';

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
                const city = row[labels.elections.municipality_key] ?? '';
                if (
                    !row.isParty &&
                    (contains(row.name, query) ||
                        contains(substitute(row.label ?? ''), query) ||
                        (city &&
                            (contains(city, query) ||
                                contains(substituteCity(city), query))))
                ) {
                    const link = routes.candidate(
                        row.name,
                        row.municipalityName
                    );
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
                                    <div className="town my-3">
                                        {row.municipalityName}
                                    </div>
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

    setTitle(`Výsledky vyhľadávania výrazu „${query}“`);

    return (
        <section className="search-results">
            <Title multiline secondary={`„${query}“`}>
                Výsledky vyhľadávania výrazu
            </Title>

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
                categories={newsCat}
                img={newsImg}
                noResults="Hľadaný výraz nebol nájdený v žiadnej z aktualít."
                section={segments.NEWS}
                search={query}
            />

            <h2 className="my-4">Hodnotenia</h2>
            <Posts
                categories={analysesCat}
                img={analysesImg}
                noResults="Hľadaný výraz nebol nájdený v žiadnom hodnotení."
                section={segments.ANALYSES}
                search={query}
            />
        </section>
    );
}

export default Search;
