import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import has from 'has';
import { labels } from '../api/constants';
import { setTitle, sortByDonors, sortBySpending } from '../api/helpers';
import { routes, separators } from '../api/routes';
import useData from '../context/DataContext';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Loading from '../components/general/Loading';
import PartyCandidates from '../components/general/PartyCandidates';
import Title from '../components/structure/Title';
import { title as spendingTitle } from './AllCampaigns';
import { title as donorsTitle } from './AllDonors';

function Municipality() {
    const params = useParams();
    const municipality = has(params, 'town')
        ? params.town.replaceAll(separators.space, ' ')
        : null;
    let name = municipality;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = [];
    let donors = [];
    const partyCandidates = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (
                row[labels.elections.municipality_key] === municipality ||
                row.municipalityShortName === municipality
            ) {
                name = row[labels.elections.municipality_key];
                if (row.isTransparent) {
                    const person = {
                        name: `${row[labels.elections.name_key]}\n${
                            row.municipalityShortName
                        }`,
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                        donors: row.num_unique_donors,
                    };
                    candidates.push(person);
                } else {
                    partyCandidates.push(row);
                }
            }
        });
        // clone arrays for different sort via unique donors
        donors = [...candidates].sort(sortByDonors);
    }

    const content = has(csvData, 'data') ? (
        <div>
            <TisBarChart
                currency
                data={candidates.sort(sortBySpending)}
                title={spendingTitle}
                vertical
            />
            <PartyCandidates candidates={partyCandidates} />
            <TisBarChart
                bars={columnVariants.donors}
                data={donors}
                title={donorsTitle}
                vertical
            />
        </div>
    ) : (
        <Loading />
    );

    useEffect(() => {
        if (
            !candidates.length &&
            !partyCandidates.length &&
            has(csvData, 'data')
        ) {
            // redirect to home page in case candidate does not exist
            navigate(routes.home);
        }
    }, [candidates, partyCandidates, csvData, navigate]);

    setTitle(name);

    return (
        <section className="municipality-page">
            <Title>{name}</Title>
            {content}
        </section>
    );
}

export default Municipality;
