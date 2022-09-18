import has from 'has';
import { labels } from '../api/constants';
import { setTitle, sortBySpending } from '../api/helpers';
import useData from '../context/DataContext';
import TisBarChart from '../components/charts/TisBarChart';
import Title from '../components/structure/Title';

const title = 'Výdavky a príjmy všetkých kandidátov';

function AllCampaigns() {
    const { csvData } = useData();

    // parse data
    const regional = [];
    const local = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, 'label') && !row.isParty) {
                const person = {
                    name: `${row.displayName}\n${row.municipalityName}`,
                    incoming: row.sum_incoming,
                    outgoing: row.sum_outgoing,
                };
                if (row.isRegional) {
                    regional.push(person);
                } else {
                    local.push(person);
                }
            }
        });
        regional.sort(sortBySpending);
        local.sort(sortBySpending);
    }

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <TisBarChart
                currency
                data={regional}
                partiesDisclaimer
                title={labels.elections.regional.name}
                vertical
            />
            <TisBarChart
                currency
                data={local}
                partiesDisclaimer
                title={labels.elections.local.name}
                vertical
            />
        </section>
    );
}

export default AllCampaigns;
