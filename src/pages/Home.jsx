import Top10 from '../components/charts/Top10';
import TotalSpending from '../components/general/TotalSpending';
import Posts from '../components/wp/Posts';
import { newsCat, newsImg } from './News';
import { segments } from '../api/routes';

function Home() {
    return (
        <section>
            <header className="mb-4">
                <h1 className="text-uppercase">
                    Samosprávne
                    <br />
                    voľby <span className="orange">2022</span>
                </h1>
            </header>
            <TotalSpending />
            <Top10 />
            <h2>Najnovšie aktuality</h2>
            <Posts
                categories={newsCat}
                condensed
                img={newsImg}
                limit={2}
                section={segments.NEWS}
            />
        </section>
    );
}

export default Home;
