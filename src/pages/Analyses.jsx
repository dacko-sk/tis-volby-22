import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { labels } from '../api/constants';
import { setTitle, substitute } from '../api/helpers';
import { segments } from '../api/routes';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

export const analysesImg = 'politician.png';
export const analysesCat = [859];
export const elections = {
    // regional: 860,
    // local: 861,
};
export const regions = {
    // BA: 863,
    // BB: 862,
    // KE: 864,
    // NR: 865,
    // PO: 866,
    // TN: 867,
    // TT: 868,
    // ZA: 869,
};

const title = 'Hodnotenie transparentnosti kandidátov';

function Analyses() {
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
                            img={analysesImg}
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

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <Posts
                categories={analysesCat}
                categoriesExclude={Object.values(regions)}
                img={analysesImg}
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
