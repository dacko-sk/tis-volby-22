import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { segments } from '../api/routes';
import Posts from '../components/wp/Posts';
import { substitute } from '../api/helpers';
import { labels } from '../api/constants';

function Analyses() {
    const mainCat = 859;
    const elections = {
        // regional: 860,
        // local: 861,
    };
    const regions = {
        // BA: 863,
        // BB: 862,
        // KE: 864,
        // NR: 865,
        // PO: 866,
        // TN: 867,
        // TT: 868,
        // ZA: 869,
    };

    const [activeKey, setActiveKey] = useState(null);
    // initially all accordions are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState({});

    const accordions = [];
    Object.entries(regions).forEach(([region, regionId]) => {
        const types = [];
        if (has(loadedRegions, region) && loadedRegions[region]) {
            Object.entries(elections).forEach(([type, typeId]) => {
                const excluded = Object.values(elections)
                    .filter((id) => id !== typeId)
                    .concat(
                        Object.values(regions).filter((id) => id !== regionId)
                    );
                types.push(
                    <div key={typeId}>
                        <h2
                            className={
                                typeId === elections.local ? 'my-3' : 'mb-3'
                            }
                        >
                            {labels.elections[type].name}
                        </h2>
                        <Posts
                            categories={[typeId, regionId]}
                            categoriesExclude={excluded}
                            img="politician.png"
                            noResults="Pre tento typ volieb v tomto kraji doposiaľ nie sú k dispozícii žiadne hodnotenia."
                            section={segments.ANALYSES}
                        />
                    </div>
                );
            });
        }
        accordions.push(
            <Accordion.Item key={region} eventKey={region}>
                <Accordion.Header>{substitute(region)}</Accordion.Header>
                <Accordion.Body>{types}</Accordion.Body>
            </Accordion.Item>
        );
    });

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKey(ak);
        // start posts loading (if needed)
        if (ak && !(has(loadedRegions, ak) && loadedRegions[ak])) {
            setLoadedRegions((prevState) => {
                return {
                    ...prevState,
                    [ak]: true,
                };
            });
        }
    };

    return (
        <section>
            <header className="mb-4">
                <h1>Hodnotenie transparentnosti kandidátov</h1>
            </header>
            <Posts
                categories={[mainCat]}
                categoriesExclude={Object.values(regions)}
                img="politician.png"
                noResults="Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne."
                section={segments.ANALYSES}
            />
            <Accordion
                className="mt-3"
                activeKey={activeKey}
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </section>
    );
}

export default Analyses;
