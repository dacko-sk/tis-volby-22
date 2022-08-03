import has from 'has';
import { labels } from '../../api/constants';
import { replace, sortBySpending } from '../../api/helpers';
import useData from '../context/DataContext';
import InOutChart from './../charts/InOutChart';

function Charts() {

  const { csvData } = useData();

  // parse data
  let people = [];
  let parties = [];
  let regions = {};
  if (has(csvData, 'data')) {
    for (const row of csvData.data) {
      if (has(row, 'label')) {
        if (row.label === labels.elections.party_key) {
          parties.push({
              name: row.name,
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
          });
      } else {
          people.push({
              name: row.name + "\n" + replace(row[labels.elections.type_key] ?? labels.elections.local.key) + "\n" + replace(row[labels.elections.municipality_key] ?? '…'),
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
          });
  
          if (has(regions, row.label)) {
              regions[row.label].incoming += row.sum_incoming;
              regions[row.label].outgoing += Math.abs(row.sum_outgoing);
          } else {
              regions[row.label] = {
                  name: row.label,
                  incoming: row.sum_incoming,
                  outgoing: Math.abs(row.sum_outgoing),
              }
          }
        }
      }
    }
    people.sort(sortBySpending);
    parties.sort(sortBySpending);
  }

  return (
    <section>
      <header>
        <h1 className="my-4">
          Grafy
        </h1>
      </header>
      <InOutChart title="Príjmy a výdavky podľa krajov" data={Object.values(regions).sort(sortBySpending)} namesLength={30} currency />
      <InOutChart title="Transparentné učty politických strán" data={parties} namesLength={30} currency vertical />
      <InOutChart title="Transparentné učty kandidátov" data={people} namesLength={30} currency vertical />
    </section>
  );
}

export default Charts;
