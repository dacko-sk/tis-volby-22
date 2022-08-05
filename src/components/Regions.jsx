import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { labels } from '../api/constants';
import { replace, sortBySpending } from '../api/helpers';
import useData from '../context/DataContext';
import Loading from './Loading';
import InOutChart from './charts/InOutChart';
  
function Regions() {

    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();

    let regions = {};
    let regionsCharts = {};

    // parse data
    let people = [];
    if (has(csvData, 'data')) {
        for (const row of csvData.data) {
            if (has(row, 'label')) {
                if (row.label !== labels.elections.party_key) {
                    const key = replace(row.label);
                    const person = {
                        name: row.name + "\n" + replace(row[labels.elections.type_key] ?? labels.elections.local.key) + "\n" + replace(row[labels.elections.municipality_key] ?? '…'),
                        incoming: row.sum_incoming,
                        outgoing: Math.abs(row.sum_outgoing),
                    };
                    if (has(regions, key)) {
                        regions[key].push(person);
                    } else {
                        regions[key] = [person];
                        regionsCharts[key] = false;
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
    for (const [region, people] of Object.entries(regions)) {
        const chart = loadedRegions[region] ? <InOutChart /*title={ region }*/ data={ people.sort(sortBySpending).slice(0, 10) } currency vertical /> : <Loading />;
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
        <div>
            <h2>Top 10 kampaní v jednotlivých krajoch</h2>
            <Accordion className="my-3" activeKey={ activeKey } onSelect={onSelect}>
                { accordions }
            </Accordion>
        </div>
    );
    
}

export default Regions;
