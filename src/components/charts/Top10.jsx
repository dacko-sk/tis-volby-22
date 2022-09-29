import has from 'has';
import { labels } from '../../api/constants';
import { sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';
import useData from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10() {
    const { csvData } = useData();

    // parse data
    const people = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, labels.elections.region_key) && !row.isParty) {
                people.push({
                    name: `${row[labels.elections.name_key]}\n${
                        row.municipalityShortName
                    }\n${row.electionsName}`,
                    incoming: row.sum_incoming,
                    outgoing: row.sum_outgoing,
                });
            }
        });
        people.sort(sortBySpending);
    }

    return (
        <TisBarChart
            title="Top 10 kampaní kandidátov na primátorov a županov podľa výdavkov a príjmov"
            data={people.slice(0, 10)}
            buttonLink={routes.charts}
            currency
            vertical
        />
    );
}

export default Top10;
