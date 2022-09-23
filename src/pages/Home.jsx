import Top10 from '../components/charts/Top10';
import TotalSpending from '../components/general/TotalSpending';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';
import { newsCategories } from './News';
import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';
import Map from '../components/map/Map';

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
            <Top10 />
            <h2>Najnovšie aktuality</h2>
            <Posts
                categories={newsCategories}
                condensed
                limit={2}
                section={segments.NEWS}
            />
        </section>
    );
}

export default Home;
