import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import has from 'has';
import { labels } from '../api/constants';
import { currencyFormat, shortenValue, substitute } from '../api/helpers';
import { routes } from '../api/routes';
import Loading from '../components/Loading';
import useData from '../context/DataContext';

function Candidate() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    let candidate = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            const key = routes.candidate(
                row.name,
                substitute(row[labels.elections.municipality_key] ?? '…')
            );
            if (pathname === key) {
                candidate = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!candidate && has(csvData, 'data')) {
            // redirect to parent page (all articles) in case article does not exist in API
            navigate(routes.home);
        }
    }, [candidate, csvData, navigate]);

    if (!candidate || !has(csvData, 'data')) {
        return <Loading />;
    }

    return (
        <section className="candidate-page">
            <header className="mb-4">
                <h1>
                    {candidate.name}
                    {!!candidate[labels.elections.municipality_key] && (
                        <span className="orange">
                            <br />
                            {candidate[labels.elections.municipality_key]}
                        </span>
                    )}
                </h1>
            </header>
            <div>
                <Table striped bordered responsive hover>
                    <tbody>
                        <tr>
                            <td>Typ volieb</td>
                            <td>
                                {substitute(
                                    candidate[labels.elections.type_key] ??
                                        labels.elections.local.key
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Kraj</td>
                            <td>{substitute(candidate.label)}</td>
                        </tr>
                        <tr>
                            <td>{labels.charts.incoming}</td>
                            <td>{currencyFormat(candidate.sum_incoming)}</td>
                        </tr>
                        <tr>
                            <td>{labels.charts.outgoing}</td>
                            <td>{currencyFormat(candidate.sum_outgoing)}</td>
                        </tr>
                        <tr>
                            <td>Bilancia</td>
                            <td>{currencyFormat(candidate.balance)}</td>
                        </tr>
                        <tr>
                            <td>Počet príjmov</td>
                            <td>{candidate.num_incoming}</td>
                        </tr>
                        <tr>
                            <td>Počet výdavkov</td>
                            <td>{candidate.num_outgoing}</td>
                        </tr>
                        <tr>
                            <td>{labels.charts.uniqeDonors}</td>
                            <td>{candidate.num_unique_donors}</td>
                        </tr>
                        <tr>
                            <td>Transparentný účet</td>
                            <td>
                                <a
                                    href={candidate.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {shortenValue(
                                        candidate.url
                                            .replace('https://', '')
                                            .replace('www.', ''),
                                        32
                                    )}
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </section>
    );
}

export default Candidate;
