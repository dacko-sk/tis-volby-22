import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import has from 'has';
import { parseWpHtml } from '../../api/helpers';
import Media from './Media';

import './News.scss';

function Posts(props) {
  const [headers, setHeaders] = useState({
    total: 0,
    pages: 0
  });
  const categories = has(props, 'categories') ? props.categories.join() : '858';
  const slug = has(props, 'slug') ? props.slug : 'aktuality';
  const { isLoading, error, data } = useQuery(
    ['all_news' + categories],
    () => fetch('https://cms.transparency.sk/wp-json/wp/v2/posts?categories=' + categories + '&per_page=10').then(response => {
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

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  console.log(headers);

  const articles = [];
  for (const article of data) {
    articles.push(
      <div key={ article.slug } id={ article.slug } className="row align-items-center">
        <div className="col-12 col-sm-5 col-md-4 col-lg-3">
          <div className="news-thumb">
            <Link to={ '/' + slug + '/' + article.slug }>
              {article.featured_media 
                ? <Media id={article.featured_media} />
                : <img src={props.img} alt={article.title.rendered} />
              }
            </Link>
          </div>
        </div>
        <div className="col">
          <h2><Link to={ '/' + slug + '/' + article.slug }>{ article.title.rendered }</Link></h2>
      
          { parseWpHtml(article.excerpt.rendered) }
        </div>
      </div>
    );
  }

  return (
    <div className="wp-posts">
      { articles }
    </div>
  );
}

export default Posts;
