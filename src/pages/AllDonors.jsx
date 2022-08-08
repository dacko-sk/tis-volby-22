import has from 'has';
import { charts, labels } from '../api/constants';
import { replace, sortByNumericProp } from '../api/helpers';
import useData from '../context/DataContext';
import InOutChart from '../components/charts/InOutChart';

function AllDonors() {

  const { csvData } = useData();
  const sortByDonors = sortByNumericProp('num_unique_donors');

  // parse data
  let regional = [];
  let local = [];
  if (has(csvData, 'data')) {
    for (const row of csvData.data) {
      if (has(row, 'label') && row.label !== labels.elections.party_key) {
        const person = {
          name: row.name + "\n" + replace(row[labels.elections.municipality_key] ?? '…'),
          num_unique_donors: row.num_unique_donors,
        };
        if (row[labels.elections.type_key] === labels.elections.regional.key) {
          regional.push(person);
        } else {
          local.push(person);
        }
      }
    }
    regional.sort(sortByDonors);
    local.sort(sortByDonors);
  }

  return (
    <section>
      <header>
        <h1 className="my-4">
          Počet unikátnych darcov na kandidáta
        </h1>
      </header>
      <InOutChart title="Voľby do VÚC" data={ regional } bars={ charts.columns.donors } vertical />
      <InOutChart title="Miestne voľby" data={ local } bars={ charts.columns.donors } vertical />
    </section>
  );
}

export default AllDonors;
