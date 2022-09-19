import { useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import has from 'has';
import { labels } from '../../api/constants';
import { sortBySpending, substitute } from '../../api/helpers';
import useData, { types } from '../../context/DataContext';
import Loading from '../general/Loading';
import TisBarChart from './TisBarChart';
import { routes } from '../../api/routes';

function Regions() {
    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();

    const charts = {};
    const candidates = {};

    // parse data
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (
                has(row, 'label') &&
                row.label &&
                row.isTransparent &&
                !row.isParty
            ) {
                const region = row.label;
                if (!has(charts, region)) {
                    candidates[region] = {
                        [types.regional]: [],
                        [types.local]: [],
                    };
                    charts[region] = false;
                }

                const person = {
                    name: `${row.name}\n${row.municipalityShortName}`,
                    incoming: row.sum_incoming,
                    outgoing: row.sum_outgoing,
                };
                candidates[region][
                    row.isRegional ? types.regional : types.local
                ].push(person);
            }
        });
    }

    // initially all charts are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState(charts);

    // create accordion component
    const accordions = [];
    Object.keys(charts).forEach((region) => {
        const chart = loadedRegions[region] ? (
            <div>
                <TisBarChart
                    currency
                    data={candidates[region][types.regional]
                        .sort(sortBySpending)
                        .slice(0, 10)}
                    title={labels.elections.regional.name}
                    vertical
                />
                <TisBarChart
                    currency
                    data={candidates[region][types.local]
                        .sort(sortBySpending)
                        .slice(0, 10)}
                    title={labels.elections.local.name}
                    vertical
                />
                <div className="buttons mt-3 text-center">
                    <Button
                        as={Link}
                        to={routes.region(region)}
                        variant="secondary"
                    >
                        Zobraziť všetkých kandidátov v kraji
                    </Button>
                </div>
            </div>
        ) : (
            <Loading />
        );
        accordions.push(
            <Accordion.Item key={region} eventKey={region}>
                <Accordion.Header>{substitute(region)}</Accordion.Header>
                <Accordion.Body>{chart}</Accordion.Body>
            </Accordion.Item>
        );
    });

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKey(ak);
        // start chart loading (if needed)
        if (ak && !loadedRegions[ak]) {
            setLoadedRegions((prevState) => {
                return {
                    ...prevState,
                    [ak]: true,
                };
            });
        }
    };

    return (
        <div className="my-4">
            <h2>Top 10 kampaní v jednotlivých krajoch</h2>
            <Accordion
                className="mt-3"
                activeKey={activeKey}
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </div>
    );
}

export default Regions;
