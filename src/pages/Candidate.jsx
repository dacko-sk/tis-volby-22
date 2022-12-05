import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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

import useData from '../context/DataContext';

import AccountTransactions from '../components/general/AccountTransactions';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

function Candidate() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse aggregated data
    let candidate = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            const key = routes.candidate(
                row[labels.elections.name_key],
                row.municipalityShortName
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
            // redirect to home page in case candidate does not exist
            navigate(routes.home);
        }
    }, [candidate, csvData, navigate]);

    if (!candidate || !has(csvData, 'data')) {
        return <Loading />;
    }

    const partyAccounts = [];
    if (candidate[labels.parties.account_party_key] ?? false) {
        candidate[labels.parties.account_party_key]
            .split(';')
            .forEach((account) => {
                partyAccounts.push(
                    <a
                        key={account}
                        className="d-block"
                        href={account}
                        rel="noreferrer"
                        target="_blank"
                    >
                        {shortenUrl(account)}
                    </a>
                );
            });
    }

    setTitle(candidate[labels.elections.name_key]);

    return (
        <section className="candidate-page">
            <Title
                multiline
                secondary={candidate[labels.elections.municipality_key] || null}
            >
                {candidate[labels.elections.name_key]}
            </Title>
            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{labels.type}</td>
                        <td>{candidate.electionsName}</td>
                    </tr>
                    {candidate[labels.elections.region_key] && (
                        <tr>
                            <td>Kraj</td>
                            <td>
                                <Link
                                    to={routes.region(
                                        candidate[labels.elections.region_key]
                                    )}
                                >
                                    {substitute(
                                        candidate[labels.elections.region_key]
                                    )}
                                </Link>
                            </td>
                        </tr>
                    )}
                    {candidate[labels.elections.municipality_key] && (
                        <tr>
                            <td>{labels.municipality}</td>
                            <td>
                                <Link
                                    to={routes.municipality(
                                        candidate.municipalityShortName,
                                        candidate[
                                            labels.elections.region_key
                                        ] ?? null
                                    )}
                                >
                                    {
                                        candidate[
                                            labels.elections.municipality_key
                                        ]
                                    }
                                </Link>
                            </td>
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
                            {/* <tr>
                                <td>Transparentný účet</td>
                                <td>
                                    <a
                                        href={
                                            candidate[
                                                labels.elections.account_key
                                            ]
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {shortenUrl(
                                            candidate[
                                                labels.elections.account_key
                                            ]
                                        )}
                                    </a>
                                </td>
                            </tr> */}
                        </>
                    )}
                    {partyAccounts.length > 0 && (
                        <tr>
                            <td>
                                {partyAccounts.length > 1
                                    ? 'Stranícke účty'
                                    : 'Stranícky účet'}
                            </td>
                            <td>{partyAccounts}</td>
                        </tr>
                    )}
                    {candidate[labels.parties.party_key] && (
                        <tr>
                            <td>{labels.party}</td>
                            <td>{candidate[labels.parties.party_key]}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <em className="disclaimer">
                {candidate.isTransparent
                    ? labels.disclaimerAccount
                    : labels.disclaimerCandidate}
            </em>

            <AccountTransactions candidate={candidate} />
        </section>
    );
}

export default Candidate;
