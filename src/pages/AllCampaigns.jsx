import has from 'has';

import { getTickText } from '../api/chartHelpers';
import { labels } from '../api/constants';
import { setTitle, sortBySpending } from '../api/helpers';

import useData, { types } from '../context/DataContext';

import TisBarChart from '../components/charts/TisBarChart';
import PartyCandidates from '../components/general/PartyCandidates';
import Title from '../components/structure/Title';

export const title = 'Výdavky a príjmy všetkých kandidátov';

function AllCampaigns() {
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
                        name: getTickText(row),
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
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
                currency
                data={candidates[types.regional].sort(sortBySpending)}
                title={labels.elections.regional.name}
                vertical
            />
            <PartyCandidates candidates={partyCandidates[types.regional]} />
            <TisBarChart
                currency
                data={candidates[types.local].sort(sortBySpending)}
                title={labels.elections.local.name}
                vertical
            />
            <PartyCandidates candidates={partyCandidates[types.local]} />
        </section>
    );
}

export default AllCampaigns;
