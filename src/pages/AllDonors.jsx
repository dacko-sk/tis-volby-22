import has from 'has';
import { labels } from '../api/constants';
import { setTitle, sortByNumericProp } from '../api/helpers';
import useData from '../context/DataContext';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Title from '../components/structure/Title';

const title = 'Počet unikátnych darcov na kandidáta';

function AllDonors() {
    const { csvData } = useData();
    const sortByDonors = sortByNumericProp('donors');

    // parse data
    const regional = [];
    const local = [];
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, 'label') && !row.isParty) {
                const person = {
                    name: `${row.displayName}\n${row.municipalityName}`,
                    donors: row.num_unique_donors,
                };
                if (row.isRegional) {
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
                bars={columnVariants.donors}
                data={regional}
                partiesDisclaimer
                title={labels.elections.regional.name}
                vertical
            />
            <TisBarChart
                bars={columnVariants.donors}
                data={local}
                partiesDisclaimer
                title={labels.elections.local.name}
                vertical
            />
        </section>
    );
}

export default AllDonors;
