import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import { labels } from '../../api/constants';
import { routes } from '../../api/routes';

import './PartyCandidates.scss';

function PartyCandidates({ candidates }) {
    if (!candidates || !Array.isArray(candidates) || !candidates.length) {
        return null;
    }

    const rows = [];
    candidates.forEach((candidate) => {
        rows.push(
            <tr
                key={
                    candidate[labels.elections.name_key] +
                    candidate[labels.elections.municipality_key]
                }
            >
                <td>
                    <Link
                        className="fw-bold"
                        to={routes.candidate(
                            candidate[labels.elections.name_key],
                            candidate.municipalityShortName
                        )}
                    >
                        {candidate[labels.elections.name_key]}
                    </Link>
                </td>
                <td>
                    {candidate[labels.elections.municipality_key] && (
                        <Link
                            to={routes.municipality(
                                candidate.municipalityShortName,
                                candidate[labels.elections.region_key] ?? null
                            )}
                        >
                            {candidate[labels.elections.municipality_key]}
                        </Link>
                    )}
                </td>
                {candidate[labels.parties.party_key] && (
                    <td>{candidate[labels.parties.party_key]}</td>
                )}
            </tr>
        );
    });

    return (
        <div className="party-candidates">
            <em className="disclaimer text-start">
                {labels.disclaimerParties}
            </em>
            <Table striped bordered responsive hover>
                <thead>
                    <tr>
                        <th>{labels.name}</th>
                        <th>{labels.municipality}</th>
                        <th>{labels.party}</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    );
}

export default PartyCandidates;
