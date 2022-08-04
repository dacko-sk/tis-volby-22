import { useLocation } from 'react-router-dom'
import has from 'has';
import { parseWpHtml } from '../../api/helpers';
import Media from './../wp/Media';

function Article() {
  const location = useLocation();
  const article = location.state && has(location.state, 'article') ? location.state.article : {};

  return (
    <section>
      <header>
        <h1 className="my-4">
          { has(article, 'title') && article.title.rendered }
        </h1>
        { has(article, 'featured_media') && article.featured_media > 0 && <div className="text-center"><Media id={article.featured_media} /></div> }
      </header>
      <div className="article">
        { has(article, 'content') && parseWpHtml(article.content.rendered) }
      </div>
    </section>
  );
}

export default Article;
