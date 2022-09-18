import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import has from 'has';
import { labels } from '../api/constants';
import {
    currencyFormat,
    setTitle,
    shortenUrl,
    substitute,
} from '../api/helpers';
import { routes } from '../api/routes';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import useData from '../context/DataContext';

function Candidate() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse aggregated data
    let candidate = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            const key = routes.candidate(row.name, row.municipalityName);
            if (pathname === key) {
                candidate = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!candidate && has(csvData, 'data')) {
            // redirect to home page in case candidate does not exist
            navigate(routes.home);
        }
    }, [candidate, csvData, navigate]);

    if (!candidate || !has(csvData, 'data')) {
        return <Loading />;
    }

    setTitle(candidate.name);

    return (
        <section className="candidate-page">
            <Title
                multiline
                secondary={
                    candidate[labels.elections.municipality_key]
                        ? candidate.municipalityName
                        : null
                }
            >
                {candidate.displayName}
            </Title>
            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>Typ volieb</td>
                        <td>{candidate.electionsName}</td>
                    </tr>
                    {candidate.label && (
                        <tr>
                            <td>Kraj</td>
                            <td>{substitute(candidate.label)}</td>
                        </tr>
                    )}
                    {candidate.isTransparent && (
                        <>
                            <tr>
                                <td>{labels.charts.incoming}</td>
                                <td>
                                    {currencyFormat(candidate.sum_incoming)}
                                </td>
                            </tr>
                            <tr>
                                <td>{labels.charts.outgoing}</td>
                                <td>
                                    {currencyFormat(candidate.sum_outgoing)}
                                </td>
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
                                        {shortenUrl(candidate.url)}
                                    </a>
                                </td>
                            </tr>
                        </>
                    )}
                    {candidate[labels.parties.account_personal_key] &&
                        candidate[labels.parties.account_personal_key] !==
                            candidate.url && (
                            <tr>
                                <td>Osobný účet</td>
                                <td>
                                    <a
                                        href={
                                            candidate[
                                                labels.parties
                                                    .account_personal_key
                                            ]
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {shortenUrl(
                                            candidate[
                                                labels.parties
                                                    .account_personal_key
                                            ]
                                        )}
                                    </a>
                                </td>
                            </tr>
                        )}
                    {candidate[labels.parties.account_party_key] && (
                        <tr>
                            <td>Stranícky účet</td>
                            <td>
                                <a
                                    href={
                                        candidate[
                                            labels.parties.account_party_key
                                        ]
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {shortenUrl(
                                        candidate[
                                            labels.parties.account_party_key
                                        ]
                                    )}
                                </a>
                            </td>
                        </tr>
                    )}
                    {candidate[labels.parties.party_key] && (
                        <tr>
                            <td>Strana / koalícia</td>
                            <td>{candidate[labels.parties.party_key]}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <em className="disclaimer">
                {
                    labels[
                        candidate.isTransparent
                            ? 'disclaimerAccount'
                            : 'disclaimerParties'
                    ]
                }
            </em>
        </section>
    );
}

export default Candidate;
