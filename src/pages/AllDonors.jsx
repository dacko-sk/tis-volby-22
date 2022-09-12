import has from 'has';
import { charts, labels } from '../api/constants';
import { setTitle, sortByNumericProp, substitute } from '../api/helpers';
import useData from '../context/DataContext';
import TisBarChart from '../components/charts/TisBarChart';
import Title from '../components/structure/Title';

const title = 'Počet unikátnych darcov na kandidáta';

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

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
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
