import has from 'has';
import { labels } from '../../api/constants';
import { replace, sortBySpending } from '../../api/helpers';
import { routes } from '../../api/routes';
import useData from '../../context/DataContext';

import TisBarChart from './TisBarChart';

function Top10() {

  const { csvData } = useData();

  // parse data
  let people = [];
  if (has(csvData, 'data')) {
    for (const row of csvData.data) {
      if (has(row, 'label')) {
        if (row.label !== labels.elections.party_key) {
          people.push({
              name: row.name + "\n" + replace(row[labels.elections.type_key] ?? labels.elections.local.key) + "\n" + replace(row[labels.elections.municipality_key] ?? '…'),
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
          });
        }
      }
    }
    people.sort(sortBySpending);
  }

  return (
      <TisBarChart title="Top 10 kampaní kandidátov na primátorov a županov podľa výdavkov a príjmov" data={people.slice(0, 10)} buttonLink={ routes.charts } currency vertical />
  );
}

export default Top10;
