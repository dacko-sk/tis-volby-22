import Top10 from '../components/charts/Top10';
import TotalSpending from '../components/general/TotalSpending';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';
import { newsCat, newsImg } from './News';
import { segments } from '../api/routes';

function Home() {
    return (
        <section>
            <Title uppercase secondary="2022">
                Samosprávne
                <br />
                voľby
            </Title>
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
