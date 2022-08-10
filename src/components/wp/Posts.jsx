import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import has from 'has';
import { dateFormat, parseWpHtml } from '../../api/helpers';
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

  const navigate = useNavigate();
  const goTo = (article) => (event) => {
    navigate(routes.article(page, article.slug), {
      state: { article }
    });
  }

  if (isLoading || error) {
    return <Loading error={error} />;
  }

  console.log(headers);

  const articles = [];
  for (const article of data) {
    articles.push(
      <div key={ article.slug } id={ article.slug } className="row align-items-center" onClick={ goTo(article) }>
        <div className="col-12 col-sm-5 col-md-4 col-lg-3">
          <div className="thumb">
            <figure>
              <Media id={article.featured_media} fallback={props.img} />
            </figure>
          </div>
        </div>
        <div className="col">
          <h2>
            { article.title.rendered }
          </h2>
          <div className="article-date my-2">
            { dateFormat(article.date) }
          </div>
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
