import has from 'has';

import { getTickText } from '../api/chartHelpers';
import { labels } from '../api/constants';
import {
    setTitle,
    sortByDonors,
    // sortByNumericProp,
    sortBySpending,
} from '../api/helpers';
import { routes } from '../api/routes';

import useData from '../context/DataContext';

import Regions from '../components/charts/Regions';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Title from '../components/structure/Title';

const title = 'Grafy';
const unknownRegion = 'Nezistený';

function Charts() {
    const { csvData /* , adsData */ } = useData();

    // parse data
    const people = [];
    const parties = [];
    const regions = {};
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, labels.elections.region_key) && row.isTransparent) {
                const region =
                    row[labels.elections.region_key] || unknownRegion;
                if (row.isParty) {
                    parties.push({
                        name: row[labels.elections.name_key],
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                    });
                } else {
                    people.push({
                        name: getTickText(row, true),
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                        donors: row.num_unique_donors,
                    });

                    if (row[labels.elections.region_key]) {
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

            {/* {has(adsData, 'data') && window.location.search === '?fb=1' && (
                <TisBarChart
                    bars={columnVariants.adsSpending}
                    buttonText="Prehľad všetkých online kampaní"
                    buttonLink={routes.facebook}
                    currency
                    data={adsData.data
                        .sort(sortByNumericProp(labels.ads.spending.key))
                        .slice(0, 10)}
                    timestamp={adsData.lastUpdate}
                    title="Najväčšie online kampane na fb"
                    vertical
                />
            )} */}

            <TisBarChart
                title="Výdavky a príjmy jednotlivých kandidátov"
                data={people.sort(sortBySpending).slice(0, 10)}
                buttonText="Zobraziť všetkých"
                buttonLink={routes.campaigns}
                currency
                // scrollable
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
