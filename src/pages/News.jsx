import { segments } from '../api/routes';
import Posts from '../components/wp/Posts';

function News() {
    return (
        <section>
            <header className="mb-4">
                <h1>Aktuality</h1>
            </header>
            <Posts categories={[858]} section={segments.NEWS} img="news.png" />
        </section>
    );
}

export default News;
