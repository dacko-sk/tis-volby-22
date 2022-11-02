import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import has from 'has';

import { getTickText } from '../api/chartHelpers';
import { labels } from '../api/constants';
import {
    regions,
    setTitle,
    sortByDonors,
    sortBySpending,
} from '../api/helpers';
import { routes, segments } from '../api/routes';

import useData, { types } from '../context/DataContext';

import { title as spendingTitle } from './AllCampaigns';
import { title as donorsTitle } from './AllDonors';
import {
    analysesCategories,
    getExcludedCategories,
    title as analysesTitle,
} from './Analyses';
import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Loading from '../components/general/Loading';
import PartyCandidates from '../components/general/PartyCandidates';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

function Region() {
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
            if (
                has(row, labels.elections.region_key) &&
                row[labels.elections.region_key] === region
            ) {
                if (row.isTransparent) {
                    const person = {
                        name: getTickText(row),
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

    // create accordions for both types of elections
    const elections = [];
    Object.values(types).forEach((type) => {
        const typeId = analysesCategories.types[type];
        const regionId = analysesCategories.regions[region];
        const excludedIds = getExcludedCategories(typeId, regionId);
        elections.push(
            <div key={type}>
                <h2>
                    {type === types.regional
                        ? labels.elections.regional.name
                        : labels.elections.local.name}
                </h2>

                {has(csvData, 'data') ? (
                    <Accordion
                        className="my-3"
                        alwaysOpen
                        defaultActiveKey={[`${type}_s`]}
                    >
                        <Accordion.Item
                            key={`${type}_s`}
                            eventKey={`${type}_s`}
                        >
                            <Accordion.Header>{spendingTitle}</Accordion.Header>
                            <Accordion.Body>
                                <TisBarChart
                                    currency
                                    data={candidates[type].sort(sortBySpending)}
                                    vertical
                                />
                                <PartyCandidates
                                    candidates={partyCandidates[type]}
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item
                            key={`${type}_d`}
                            eventKey={`${type}_d`}
                        >
                            <Accordion.Header>{donorsTitle}</Accordion.Header>
                            <Accordion.Body>
                                <TisBarChart
                                    bars={columnVariants.donors}
                                    data={donors[type]}
                                    vertical
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item
                            key={`${type}_a`}
                            eventKey={`${type}_a`}
                        >
                            <Accordion.Header>
                                {analysesTitle +
                                    (type === types.local
                                        ? ' v krajskom meste'
                                        : '')}
                            </Accordion.Header>
                            <Accordion.Body>
                                <Posts
                                    categories={[typeId, regionId]}
                                    categoriesExclude={excludedIds}
                                    noResults="Pre tento typ volieb v tomto kraji doposiaľ nie sú k dispozícii žiadne hodnotenia."
                                    section={segments.ANALYSES}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ) : (
                    <Loading />
                )}
            </div>
        );
    });

    useEffect(() => {
        if (!has(regions, region)) {
            // redirect to home page in case region does not exist
            navigate(routes.home);
        }
    }, [region, navigate]);

    setTitle(regions[region]);

    return (
        <section className="region-page">
            <Title>{regions[region]}</Title>
            {elections}
        </section>
    );
}

export default Region;
