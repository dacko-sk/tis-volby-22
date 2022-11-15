import has from 'has';

import { getTickText } from '../../api/chartHelpers';
import { labels } from '../../api/constants';
import { sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';

import useData from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10() {
    const { csvData } = useData();

    // parse data
    const people = {};
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, labels.elections.region_key) && !row.isParty) {
                const unqKey = `${row[labels.elections.region_key]}_${
                    row[labels.elections.name_key]
                }`;
                // add each candidate only once and prioritize regional campaign over local
                if (!has(people, unqKey) || row.isRegional) {
                    people[unqKey] = {
                        name: getTickText(row, true),
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                    };
                }
            }
        });
    }

    return (
        <TisBarChart
            title="Top 10 kampaní kandidátov na primátorov a županov podľa výdavkov a príjmov"
            data={Object.values(people).sort(sortBySpending).slice(0, 10)}
            buttonLink={routes.charts}
            currency
            vertical
        />
    );
}

export default Top10;
