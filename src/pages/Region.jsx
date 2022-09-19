import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';
import { labels } from '../api/constants';
import {
    regions,
    setTitle,
    sortByDonors,
    sortBySpending,
} from '../api/helpers';
import { routes } from '../api/routes';
import useData, { types } from '../context/DataContext';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Loading from '../components/general/Loading';
import PartyCandidates from '../components/general/PartyCandidates';
import Title from '../components/structure/Title';
import { title as spendingTitle } from './AllCampaigns';
import { title as donorsTitle } from './AllDonors';

function Region() {
    const [activeKey, setActiveKey] = useState(types.regional);

    const params = useParams();
    const region = has(params, 'region') ? params.region : null;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = {
        [types.regional]: [],
        [types.local]: [],
    };
    let donors = {};
    const partyCandidates = {
        [types.regional]: [],
        [types.local]: [],
    };
    if (has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (has(row, 'label') && row.label === region) {
                if (row.isTransparent) {
                    const person = {
                        name: `${row.name}\n${row.municipalityShortName}`,
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                        donors: row.num_unique_donors,
                    };
                    candidates[
                        row.isRegional ? types.regional : types.local
                    ].push(person);
                } else {
                    partyCandidates[
                        row.isRegional ? types.regional : types.local
                    ].push(row);
                }
            }
        });
        // clone arrays for different sort via unique donors
        donors = {
            [types.regional]: [...candidates[types.regional]].sort(
                sortByDonors
            ),
            [types.local]: [...candidates[types.local]].sort(sortByDonors),
        };
    }

    // create accordion component
    const accordions = [];
    Object.values(types).forEach((type) => {
        const content = has(csvData, 'data') ? (
            <div>
                <TisBarChart
                    currency
                    data={candidates[type].sort(sortBySpending)}
                    title={spendingTitle}
                    vertical
                />
                <TisBarChart
                    bars={columnVariants.donors}
                    data={donors[type]}
                    title={donorsTitle}
                    vertical
                />
                <PartyCandidates
                    candidates={partyCandidates[type]}
                    hideMunicipality={type === types.regional}
                />
            </div>
        ) : (
            <Loading />
        );
        accordions.push(
            <Accordion.Item key={type} eventKey={type}>
                <Accordion.Header>
                    {type === types.regional
                        ? labels.elections.regional.name
                        : labels.elections.local.name}
                </Accordion.Header>
                <Accordion.Body>{content}</Accordion.Body>
            </Accordion.Item>
        );
    });

    useEffect(() => {
        if (!has(regions, region)) {
            // redirect to home page in case region does not exist
            navigate(routes.home);
        }
    }, [region, navigate]);

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKey(ak);
    };

    setTitle(regions[region]);

    return (
        <section className="region-page">
            <Title>{regions[region]}</Title>
            <Accordion
                className="my-3"
                activeKey={activeKey}
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </section>
    );
}

export default Region;
