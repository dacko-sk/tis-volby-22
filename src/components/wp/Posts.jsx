import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import has from 'has';
import { parseWpHtml } from '../../api/helpers';
import Media from './Media';
import Loading from '../Loading';

import './News.scss';
import { routes, segments } from '../../api/routes';

function Posts(props) {
  const [headers, setHeaders] = useState({
    total: 0,
    pages: 0
  });
  const categories = has(props, 'categories') ? props.categories.join() : '858';
  const page = has(props, 'page') ? props.page : segments.NEWS;
  const { isLoading, error, data } = useQuery(
    ['all_news' + categories],
    () => fetch('https://cms.transparency.sk/wp-json/wp/v2/posts?categories=' + categories + '&per_page=10').then(response => {
      console.log(categories + ' - articles fetched');
      if (response.headers) {
        setHeaders({
          total: response.headers.get('X-WP-Total'),
          pages: response.headers.get('X-WP-TotalPages'),
        });
      }
      // must return promise
      return response.json()
    })
  );

  if (isLoading || error) {
    return <Loading error={error} />;
  }

  console.log(headers);

  const articles = [];
  for (const article of data) {
    articles.push(
      <div key={ article.slug } id={ article.slug } className="row align-items-center">
        <div className="col-12 col-sm-5 col-md-4 col-lg-3">
          <div className="thumb">
            <Link to={ routes.article(page, article.slug) } state={{ article }}>
              {article.featured_media 
                ? <Media id={article.featured_media} />
                : <img src={props.img} alt={article.title.rendered} />
              }
            </Link>
          </div>
        </div>
        <div className="col">
          <h2>
            <Link to={ routes.article(page, article.slug) } state={{ article }}>
              { article.title.rendered }
            </Link>
          </h2>
      
          { parseWpHtml(article.excerpt.rendered) }
        </div>
      </div>
    );
  }

  return (
    <div className="articles">
      { articles }
    </div>
  );
}

export default Posts;
