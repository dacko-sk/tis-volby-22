import has from 'has';
import { labels } from '../api/constants';
import { sortBySpending, substitute } from '../api/helpers';
import useData from '../context/DataContext';
import TisBarChart from '../components/charts/TisBarChart';

function AllCampaigns() {

  const { csvData } = useData();

  // parse data
  let regional = [];
  let local = [];
  if (has(csvData, 'data')) {
    for (const row of csvData.data) {
      if (has(row, 'label') && row.label !== labels.elections.party_key) {
        const person = {
          name: row.name + "\n" + substitute(row[labels.elections.municipality_key] ?? '…'),
          incoming: row.sum_incoming,
          outgoing: Math.abs(row.sum_outgoing),
        };
        if (row[labels.elections.type_key] === labels.elections.regional.key) {
          regional.push(person);
        } else {
          local.push(person);
        }
      }
    }
    regional.sort(sortBySpending);
    local.sort(sortBySpending);
  }

  return (
    <section>
      <header>
        <h1 className="my-4">
          Výdavky a príjmy všetkých kandidátov
        </h1>
      </header>
      <TisBarChart title="Voľby do VÚC" data={ regional } currency vertical />
      <TisBarChart title="Miestne voľby" data={ local } currency vertical />
    </section>
  );
}

export default AllCampaigns;
