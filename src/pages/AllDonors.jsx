import has from 'has';
import { charts, labels } from '../api/constants';
import { sortByNumericProp, substitute } from '../api/helpers';
import useData from '../context/DataContext';
import TisBarChart from '../components/charts/TisBarChart';

function AllDonors() {
    const { csvData } = useData();
    const sortByDonors = sortByNumericProp('num_unique_donors');

    // parse data
    const regional = [];
    const local = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, 'label') && row.label !== labels.elections.party_key) {
                const person = {
                    name: `${row.name}\n${substitute(
                        row[labels.elections.municipality_key] ?? '…'
                    )}`,
                    num_unique_donors: row.num_unique_donors,
                };
                if (
                    row[labels.elections.type_key] ===
                    labels.elections.regional.key
                ) {
                    regional.push(person);
                } else {
                    local.push(person);
                }
            }
        });
        regional.sort(sortByDonors);
        local.sort(sortByDonors);
    }

    return (
        <section>
            <header className="mb-4">
                <h1>Počet unikátnych darcov na kandidáta</h1>
            </header>
            <TisBarChart
                title={labels.elections.regional.name}
                data={regional}
                bars={charts.columns.donors}
                vertical
            />
            <TisBarChart
                title={labels.elections.local.name}
                data={local}
                bars={charts.columns.donors}
                vertical
            />
        </section>
    );
}

export default AllDonors;
