import { imgPath } from '../api/helpers';
import { segments } from '../api/routes';
import Posts from '../components/wp/Posts';

function News() {
  return (
    <section>
      <header>
        <h1 className="my-4">
          Aktuality
        </h1>
      </header>
      <Posts categories={ [858] } page={ segments.NEWS } img={ imgPath('news.png') } />
    </section>
  );
}

export default News;
