import Button from 'react-bootstrap/Button';
import Top10 from '../components/charts/Top10';
import TotalSpending from '../components/general/TotalSpending';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';
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
            <div className="text-center">
                <Button
                    className="mt-3 mb-4 text-uppercase fw-bold"
                    href="https://transparency.sk/volby"
                    target="_blank"
                    variant="secondary"
                >
                    Darujte na kontrolu volieb
                </Button>
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
