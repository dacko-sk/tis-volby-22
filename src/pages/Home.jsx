import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';

import { analysesCategories, newAnalysesAlert, winnersAlert } from './Analyses';
import { newsCategories } from './News';
import Top15 from '../components/charts/Top15';
import TotalSpending from '../components/general/TotalSpending';
import Map from '../components/map/Map';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';

function Home() {
    setTitle('Úvod');

    return (
        <section>
            <Title uppercase secondary="2022">
                Samosprávne
                <br />
                voľby
            </Title>

            <TotalSpending />

            <Map />

            <Top15 />

            {newAnalysesAlert}
            {winnersAlert}

            <Posts
                categories={[analysesCategories.top]}
                noResults="Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne."
                section={segments.ANALYSES}
                showMore="Zobraziť všetky hodnotenia"
                template={templates.featured}
            />

            <h2 className="mt-4">Najnovšie aktuality</h2>
            <Posts
                categories={newsCategories}
                limit={2}
                section={segments.NEWS}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
