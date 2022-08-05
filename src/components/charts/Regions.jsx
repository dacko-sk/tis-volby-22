import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { labels } from '../../api/constants';
import { replace, sortBySpending } from '../../api/helpers';
import useData from '../../context/DataContext';
import Loading from '../Loading';
import InOutChart from './InOutChart';
  
function Regions() {
console.log('accordions re-render');
    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();

    let regionsRegional = {};
    let regionsLocal = {};
    let regionsCharts = {};

    // parse data
    let people = [];
    if (has(csvData, 'data')) {
        for (const row of csvData.data) {
            if (has(row, 'label')) {
                if (row.label !== labels.elections.party_key) {
                    const key = replace(row.label);
                    if (!has(regionsCharts, key)) {
                        regionsCharts[key] = [];
                        regionsRegional[key] = [];
                        regionsLocal[key] = [];
                        regionsCharts[key] = false;
                    }
                    if (row[labels.elections.type_key] === labels.elections.regional.key) {
                        regionsRegional[key].push({
                            name: row.name,
                            incoming: row.sum_incoming,
                            outgoing: Math.abs(row.sum_outgoing),
                        });
                    } else {
                        regionsLocal[key].push({
                            name: row.name + "\n" + (row[labels.elections.municipality_key] ?? '…'),
                            incoming: row.sum_incoming,
                            outgoing: Math.abs(row.sum_outgoing),
                        });
                    }
                }
            }
        }
        people.sort(sortBySpending);
    }

    // initially all charts are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState(regionsCharts);

    // create accordion component
    let accordions = [];
    for (const region of Object.keys(regionsCharts)) {
        const chart = loadedRegions[region] ? (
            <div>
                { regionsRegional[region].length > 0 && <InOutChart title="Voľby do VÚC" data={ regionsRegional[region].sort(sortBySpending).slice(0, 10) } currency vertical /> }
                { regionsLocal[region].length > 0 && <InOutChart title="Miestne voľby" data={ regionsLocal[region].sort(sortBySpending).slice(0, 10) } currency vertical /> }
            </div>
        ) : <Loading />;
        accordions.push(
            <Accordion.Item key={ region } eventKey={ region }>
                <Accordion.Header>{ region }</Accordion.Header>
                <Accordion.Body>
                    { chart }
                </Accordion.Body>
            </Accordion.Item>
        );
    }
 
    const onSelect = (activeKey, event) => {
        // open/close accordion
        setActiveKey(activeKey);
        // start chart loading (if needed)
        if (activeKey && !loadedRegions[activeKey]) {
            setLoadedRegions(prevState => {
                return {
                    ...prevState,
                    [activeKey]: true,    
                }
            });
        }
    }
 
    return (
        <div className="my-3">
            <h2>Top 10 kampaní v jednotlivých krajoch</h2>
            <Accordion className="mt-3" activeKey={ activeKey } onSelect={onSelect}>
                { accordions }
            </Accordion>
        </div>
    );
    
}

export default Regions;
