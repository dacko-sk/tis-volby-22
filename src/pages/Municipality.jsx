import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import has from 'has';

import { labels } from '../api/constants';
import {
    regionalCity,
    setTitle,
    sortByDonors,
    sortBySpending,
} from '../api/helpers';
import { routes, segments, separators } from '../api/routes';

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

function Municipality() {
    const params = useParams();
    let town = null;
    let region = null;
    let type = types.local;
    if (has(params, 'municipality')) {
        const municipality = params.municipality.split(separators.parts);
        town = municipality[municipality.length > 1 ? 1 : 0].replaceAll(
            separators.space,
            ' '
        );
        region =
            municipality.length > 1
                ? municipality[0].replaceAll(separators.space, ' ')
                : null;
    }

    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = [];
    let donors = [];
    const partyCandidates = [];
    if (town && has(csvData, 'data')) {
        csvData.data.forEach((row) => {
            if (
                (row[labels.elections.municipality_key] === town ||
                    row.municipalityShortName === town) &&
                (!region || region === row[labels.elections.region_key])
            ) {
                town = row[labels.elections.municipality_key];
                type = row.isRegional ? types.regional : types.local;
                if (row.isTransparent) {
                    const person = {
                        name:
                            row[labels.elections.name_key] +
                            separators.newline +
                            row[labels.elections.region_key] +
                            separators.parts +
                            row.municipalityShortName,
                        incoming: row.sum_incoming,
                        outgoing: row.sum_outgoing,
                        donors: row.num_unique_donors,
                    };
                    candidates.push(person);
                } else {
                    partyCandidates.push(row);
                }
            }
        });
        // clone arrays for different sort via unique donors
        donors = [...candidates].sort(sortByDonors);
    }

    const content = has(csvData, 'data') ? (
        <div>
            <TisBarChart
                currency
                data={candidates.sort(sortBySpending)}
                title={spendingTitle}
                vertical
            />
            <PartyCandidates candidates={partyCandidates} />
            <TisBarChart
                bars={columnVariants.donors}
                data={donors}
                title={donorsTitle}
                vertical
            />
        </div>
    ) : (
        <Loading />
    );

    let analyses = null;
    // show for regional elections or local elections in regional towns
    if (type === types.regional || town === regionalCity(region)) {
        const typeId = analysesCategories.types[type];
        const regionId = analysesCategories.regions[region];
        const excludedIds = getExcludedCategories(typeId, regionId);
        analyses = (
            <div>
                <h2 className="mb-3">{analysesTitle}</h2>
                <Posts
                    categories={[typeId, regionId]}
                    categoriesExclude={excludedIds}
                    noResults="Pre tento typ volieb v tomto kraji doposiaľ nie sú k dispozícii žiadne hodnotenia."
                    section={segments.ANALYSES}
                />
            </div>
        );
    }

    useEffect(() => {
        if (
            !candidates.length &&
            !partyCandidates.length &&
            has(csvData, 'data')
        ) {
            // redirect to home page in case candidate does not exist
            navigate(routes.home);
        }
    }, [candidates, partyCandidates, csvData, navigate]);

    setTitle(town);

    return (
        <section className="municipality-page">
            <Title multiline secondary={labels.elections[type].name}>
                {town}
            </Title>
            {content}
            {analyses}
        </section>
    );
}

export default Municipality;
