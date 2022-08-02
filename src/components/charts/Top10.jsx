import has from 'has';
import { replace } from '../../api/helpers';
import useData from '../context/DataContext';

import InOutChart from './InOutChart';

function Top10() {

  const { csvData } = useData();

  console.log(csvData);
  // parse data
  let people = [];
  if (has(csvData, 'data')) {
    for (const row of csvData.data) {
      if (has(row, 'label')) {
        if (row.label !== "PS") {
          people.push({
              name: row.name + "\n" + row['typ volieb'] + "\n" + replace(row['samospráva']),
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
          });
        }
      }
    }
    people.sort((a,b) => b.outgoing - a.outgoing);
  }

  return (
      <InOutChart title="Top 10 kampaní kandidátov na primátorov a županov podľa príjmov a výdavkov" data={people.slice(0, 10)} currency vertical />
  );
}

export default Top10;
