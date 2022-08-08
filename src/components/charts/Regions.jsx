import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { labels } from '../../api/constants';
import { replace, sortBySpending } from '../../api/helpers';
import useData from '../../context/DataContext';
import Loading from '../Loading';
import TisBarChart from './TisBarChart';
  
function Regions() {

    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();

    let regional = {};
    let local = {};
    let charts = {};

    // parse data
    let people = [];
    if (has(csvData, 'data')) {
        for (const row of csvData.data) {
            if (has(row, 'label')) {
                if (row.label !== labels.elections.party_key) {
                    const key = replace(row.label);
                    if (!has(charts, key)) {
                        charts[key] = [];
                        regional[key] = [];
                        local[key] = [];
                        charts[key] = false;
                    }
                    const person = {
                        name: row.name + "\n" + replace(row[labels.elections.municipality_key] ?? '…'),
                        incoming: row.sum_incoming,
                        outgoing: Math.abs(row.sum_outgoing),
                    };
                    if (row[labels.elections.type_key] === labels.elections.regional.key) {
                        regional[key].push(person);
                    } else {
                        local[key].push(person);
                    }
                }
            }
        }
        people.sort(sortBySpending);
    }

    // initially all charts are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState(charts);

    // create accordion component
    let accordions = [];
    for (const region of Object.keys(charts)) {
        const chart = loadedRegions[region] ? (
            <div>
                { regional[region].length > 0 && <TisBarChart title="Voľby do VÚC" data={ regional[region].sort(sortBySpending).slice(0, 10) } currency vertical /> }
                { local[region].length > 0 && <TisBarChart title="Miestne voľby" data={ local[region].sort(sortBySpending).slice(0, 10) } currency vertical /> }
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
        <div className="my-4">
            <h2>Top 10 kampaní v jednotlivých krajoch</h2>
            <Accordion className="mt-3" activeKey={ activeKey } onSelect={onSelect}>
                { accordions }
            </Accordion>
        </div>
    );
    
}

export default Regions;
