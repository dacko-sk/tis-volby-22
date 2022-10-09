import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';
import Top10 from '../components/charts/Top10';
import DonateButton from '../components/general/DonateButton';
import TotalSpending from '../components/general/TotalSpending';
import Map from '../components/map/Map';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';
import { newsCategories } from './News';

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
            <div className="text-center">
                <DonateButton className="mt-3 mb-3" long xl />
            </div>
            <Map />
            <Top10 />
            <h2>Najnovšie aktuality</h2>
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
