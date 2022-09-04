import { segments } from '../api/routes';
import Posts from '../components/wp/Posts';

export const newsImg = 'news.png';
export const newsCat = [858];

function News() {
    return (
        <section>
            <header className="mb-4">
                <h1>Aktuality</h1>
            </header>
            <Posts categories={newsCat} img={newsImg} section={segments.NEWS} />
        </section>
    );
}

export default News;
