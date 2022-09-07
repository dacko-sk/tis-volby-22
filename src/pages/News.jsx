import { segments } from '../api/routes';
import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

export const newsImg = 'news.png';
export const newsCat = [858];

function News() {
    return (
        <section>
            <Title>Aktuality</Title>
            <Posts categories={newsCat} img={newsImg} section={segments.NEWS} />
        </section>
    );
}

export default News;
