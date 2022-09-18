import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { labels } from '../../api/constants';
import { sortBySpending, substitute } from '../../api/helpers';
import useData from '../../context/DataContext';
import Loading from '../general/Loading';
import TisBarChart from './TisBarChart';

export const types = {
    regional: 'r',
    local: 'l',
};

function Regions() {
    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();

    const charts = {};
    const candidates = {};
    const hasPartyCandidates = {};

    // parse data
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, 'label') && row.label && !row.isParty) {
                const region = substitute(row.label);
                if (!has(charts, region)) {
                    candidates[region] = {
                        [types.regional]: [],
                        [types.local]: [],
                    };
                    hasPartyCandidates[region] = {
                        [types.regional]: false,
                        [types.local]: false,
                    };
                    charts[region] = false;
                }
                const person = {
                    name: `${row.displayName}\n${row.municipalityName}`,
                    incoming: row.sum_incoming,
                    outgoing: row.sum_outgoing,
                    isTransparent: row.isTransparent,
                };
                candidates[region][
                    row.isRegional ? types.regional : types.local
                ].push(person);
            }
        });
        // slice top 10 candidates
        Object.keys(charts).forEach((region) => {
            Object.values(types).forEach((type) => {
                candidates[region][type] = candidates[region][type]
                    .sort(sortBySpending)
                    .slice(0, 10);
                candidates[region][type].some((candidate) => {
                    if (!candidate.isTransparent) {
                        hasPartyCandidates[region][type] = true;
                        return true;
                    }
                    return false;
                });
            });
        });
    }

    // initially all charts are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState(charts);

    // create accordion component
    const accordions = [];
    Object.keys(charts).forEach((region) => {
        const chart = loadedRegions[region] ? (
            <div>
                {candidates[region][types.regional].length > 0 && (
                    <TisBarChart
                        currency
                        data={candidates[region][types.regional]}
                        partiesDisclaimer={
                            hasPartyCandidates[region][types.regional]
                        }
                        title={labels.elections.regional.name}
                        vertical
                    />
                )}
                {candidates[region][types.local].length > 0 && (
                    <TisBarChart
                        currency
                        data={candidates[region][types.local]}
                        partiesDisclaimer={
                            hasPartyCandidates[region][types.local]
                        }
                        title={labels.elections.local.name}
                        vertical
                    />
                )}
            </div>
        ) : (
            <Loading />
        );
        accordions.push(
            <Accordion.Item key={region} eventKey={region}>
                <Accordion.Header>{region}</Accordion.Header>
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
