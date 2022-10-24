import has from 'has';

import { labels } from '../api/constants';
import { setTitle, sortByNumericProp } from '../api/helpers';

import useData from '../context/DataContext';

import TisBarChart, { columnVariants } from '../components/charts/TisBarChart';
import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';

const title = 'Online reklama';

function Facebook() {
    const { adsData } = useData();

    let content = <Loading />;

    if (has(adsData, 'data')) {
        const amounts = [
            ...adsData.data.sort(sortByNumericProp(labels.ads.amount.key)),
        ];
        content = (
            <div>
                <TisBarChart
                    bars={columnVariants.adsSpending}
                    currency
                    data={adsData.data.sort(
                        sortByNumericProp(labels.ads.spending.key)
                    )}
                    timestamp={adsData.lastUpdate}
                    title={labels.ads.spending.title}
                    vertical
                />
                <TisBarChart
                    bars={columnVariants.adsAmount}
                    data={amounts}
                    timestamp={adsData.lastUpdate}
                    title="Počet sponzorovaných príspevkov"
                    vertical
                />
            </div>
        );
    }

    setTitle(title);

    return (
        <section>
            <Title multiline secondary="facebook">
                {title}
            </Title>

            {content}
        </section>
    );
}

export default Facebook;
