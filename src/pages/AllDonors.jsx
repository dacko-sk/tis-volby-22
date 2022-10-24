import has from 'has';

import { labels } from '../api/constants';
import { setTitle, sortByDonors } from '../api/helpers';
import { separators } from '../api/routes';

import useData, { types } from '../context/DataContext';

import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import PartyCandidates from '../components/general/PartyCandidates';
import Title from '../components/structure/Title';

export const title = 'Počet unikátnych darcov na kandidáta';

function AllDonors() {
    const { csvData } = useData();

    // parse data
    const candidates = {
        [types.regional]: [],
        [types.local]: [],
    };
    const partyCandidates = {
        [types.regional]: [],
        [types.local]: [],
    };
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, labels.elections.region_key) && !row.isParty) {
                if (row.isTransparent) {
                    const person = {
                        name:
                            row[labels.elections.name_key] +
                            separators.newline +
                            row[labels.elections.region_key] +
                            separators.parts +
                            row.municipalityShortName,
                        donors: row.num_unique_donors,
                    };
                    candidates[
                        row.isRegional ? types.regional : types.local
                    ].push(person);
                } else {
                    partyCandidates[
                        row.isRegional ? types.regional : types.local
                    ].push(row);
                }
            }
        });
    }

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <TisBarChart
                bars={columnVariants.donors}
                data={candidates[types.regional].sort(sortByDonors)}
                title={labels.elections.regional.name}
                vertical
            />
            <PartyCandidates candidates={partyCandidates[types.regional]} />
            <TisBarChart
                bars={columnVariants.donors}
                data={candidates[types.local].sort(sortByDonors)}
                title={labels.elections.local.name}
                vertical
            />
            <PartyCandidates candidates={partyCandidates[types.local]} />
        </section>
    );
}

export default AllDonors;
