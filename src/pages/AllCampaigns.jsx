import has from 'has';
import { labels } from '../api/constants';
import { sortBySpending, substitute } from '../api/helpers';
import useData from '../context/DataContext';
import TisBarChart from '../components/charts/TisBarChart';

function AllCampaigns() {
    const { csvData } = useData();

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
                    incoming: row.sum_incoming,
                    outgoing: Math.abs(row.sum_outgoing),
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
        regional.sort(sortBySpending);
        local.sort(sortBySpending);
    }

    return (
        <section>
            <header className="mb-4">
                <h1>Výdavky a príjmy všetkých kandidátov</h1>
            </header>
            <TisBarChart
                title={labels.elections.regional.name}
                data={regional}
                currency
                vertical
            />
            <TisBarChart
                title={labels.elections.local.name}
                data={local}
                currency
                vertical
            />
        </section>
    );
}

export default AllCampaigns;
