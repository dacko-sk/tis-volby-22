import { LabelList } from 'recharts';
import has from 'has';

import { getTickText } from '../../api/chartHelpers';
import { colors, labels } from '../../api/constants';
import { wholeCurrencyFormat } from '../../api/helpers';
import { routes } from '../../api/routes';

import TisBarChart from './TisBarChart';

import data from '../../assets/json/top15.json';

function Top15() {
    // bars style
    const bars = [
        {
            key: 'regional',
            name: 'Výdavky kandidáta na župana',
            color: colors.colorOrange,
            stackId: 'totalSpending',
            label: {
                dataKey: 'regional',
                fill: 'white',
                outline: 2,
                formatter: wholeCurrencyFormat,
                position: 'insideLeft',
            },
        },
        {
            key: 'local',
            name: 'Výdavky kandidáta na primátora',
            color: colors.colorDarkBlue,
            stackId: 'totalSpending',
            label: {
                dataKey: 'local',
                fill: 'white',
                outline: 2,
                formatter: wholeCurrencyFormat,
                position: 'insideLeft',
            },
            labelList: (
                <LabelList
                    dataKey="remarkId"
                    position="insideRight"
                    fill="white"
                />
            ),
        },
    ];
    // data
    const campaigns = [];
    const remarks = [
        <em className="disclaimer text-start mt-2" key={0}>
            Zdroj: Záverečné správy kandidátov a politických strán a ich
            doplňujúce odpovede pre TIS
        </em>,
    ];
    data.campaigns.forEach((campaign) => {
        campaigns.push({
            name: getTickText(campaign, false),
            [campaign.electionsName === labels.elections.local.key
                ? 'local'
                : 'regional']: campaign.spending,
            remarkId: campaign.remarkId,
        });
        if (has(campaign, 'remarkId')) {
            remarks.push(
                <em className="disclaimer text-start" key={campaign.remarkId}>
                    {campaign.remarkId} {campaign.remark}
                </em>
            );
        }
    });

    return (
        <TisBarChart
            bars={bars}
            buttonLink={routes.charts}
            currency
            data={campaigns}
            lastUpdate={false}
            title="Top 15 kampaní v miestnych a župných voľbách 2022"
            vertical
        >
            {remarks}
        </TisBarChart>
    );
}

export default Top15;
