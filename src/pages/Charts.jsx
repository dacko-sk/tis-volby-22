import has from 'has';
import { charts, labels } from '../api/constants';
import { replace, sortByNumericProp, sortBySpending } from '../api/helpers';
import useData from '../context/DataContext';
import Regions from '../components/charts/Regions';
import TisBarChart from '../components/charts/TisBarChart';
import { routes } from '../api/routes';

function Charts() {

  const { csvData } = useData();
  const sortByDonors = sortByNumericProp('num_unique_donors');

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
              num_unique_donors: row.num_unique_donors,
          });
  
          if (has(regions, row.label)) {
              regions[row.label].incoming += row.sum_incoming;
              regions[row.label].outgoing += Math.abs(row.sum_outgoing);
          } else {
            regions[row.label] = {
              name: replace(row.label).replace(' ', "\n"),
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
            }
          }
        }
      }
    }
    parties.sort(sortBySpending);
  }
  const donors = people.sort(sortByDonors).slice(0, 10);

  return (
    <section>
      <header>
        <h1 className="my-4">
          Grafy
        </h1>
      </header>
      <TisBarChart title="Príjmy a výdavky podľa krajov" subtitle="Kumulatívne hodnoty za župné aj miestne voľby." data={Object.values(regions).sort(sortBySpending)} currency />
      <Regions />
      <TisBarChart title="Stranícke kampane" subtitle="Kumulatívne hodnoty za župné aj miestne voľby." data={ parties } namesLength={ 30 } currency vertical />
      <TisBarChart title="Výdavky a príjmy jednotlivých kandidátov" data={ people.sort(sortBySpending) } buttonText="Zobraziť všetkých" buttonLink={ routes.campaigns } currency vertical scrollable />
      <TisBarChart title="Top 10 kandidátov s najvyšším počtom unikátnych darcov" data={ donors } bars={ charts.columns.donors } buttonText="Zobraziť všetkých" buttonLink={ routes.donors } vertical />
    </section>
  );
}

export default Charts;
