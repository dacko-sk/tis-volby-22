import has from 'has';
import { setTitle, sortByNumericProp, sortBySpending } from '../api/helpers';
import { routes } from '../api/routes';
import Regions from '../components/charts/Regions';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Title from '../components/structure/Title';
import useData from '../context/DataContext';

const title = 'Grafy';
const unknownRegion = 'Nezistený';

function Charts() {
    const { csvData } = useData();
    const sortByDonors = sortByNumericProp('donors');

    // parse data
    const people = [];
    const parties = [];
    const regions = {};
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, 'label')) {
                const region = row.label || unknownRegion;
                if (row.isParty) {
                    parties.push({
                        name: row.name,
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                    });
                } else {
                    people.push({
                        name: `${row.displayName}\n${row.municipalityName}\n${row.electionsName}`,
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                        donors: row.num_unique_donors,
                    });

                    if (row.label) {
                        if (has(regions, region)) {
                            regions[region].incoming += row.sum_incoming;
                            regions[region].outgoing += row.sum_outgoing;
                        } else {
                            regions[region] = {
                                name: region,
                                incoming: row.sum_incoming,
                                outgoing: row.sum_outgoing,
                            };
                        }
                    }
                }
            }
        });
        parties.sort(sortBySpending);
    }
    const donors = people.sort(sortByDonors).slice(0, 10);

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <TisBarChart
                title="Výdavky a príjmy podľa krajov"
                subtitle="Kumulatívne hodnoty za župné aj miestne voľby."
                data={Object.values(regions).sort(sortBySpending)}
                currency
            />
            <Regions />
            <TisBarChart
                title="Stranícke kampane"
                subtitle="Kumulatívne hodnoty za župné aj miestne voľby."
                data={parties}
                namesLength={30}
                currency
                vertical
            />
            <TisBarChart
                title="Výdavky a príjmy jednotlivých kandidátov"
                data={people.sort(sortBySpending)}
                buttonText="Zobraziť všetkých"
                buttonLink={routes.campaigns}
                currency
                partiesDisclaimer
                scrollable
                vertical
            />
            <TisBarChart
                title="Top 10 kandidátov s najvyšším počtom unikátnych darcov"
                data={donors}
                bars={columnVariants.donors}
                buttonText="Zobraziť všetkých"
                buttonLink={routes.donors}
                vertical
            />
        </section>
    );
}

export default Charts;
