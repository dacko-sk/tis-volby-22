import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { labels } from '../../api/constants';
import { routes } from '../../api/routes';

import './PartyCandidates.scss';

function PartyCandidates({ candidates, hideMunicipality }) {
    if (!candidates || !Array.isArray(candidates) || !candidates.length) {
        return null;
    }

    const rows = [];
    candidates.forEach((candidate) => {
        rows.push(
            <tr key={candidate.name}>
                <td>
                    <Link
                        className="fw-bold"
                        to={routes.candidate(
                            candidate.name,
                            candidate.municipalityShortName
                        )}
                    >
                        {candidate.name}
                    </Link>
                </td>
                {!hideMunicipality && (
                    <td>
                        {candidate[labels.elections.municipality_key] || null}
                    </td>
                )}
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
                        {!hideMunicipality && <th>{labels.municipality}</th>}
                        <th>{labels.party}</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    );
}

export default PartyCandidates;
