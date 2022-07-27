import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';

function News() {
  const [headers, setHeaders] = useState({
    total: 0,
    pages: 0
  });
  const { isLoading, error, data } = useQuery(
    ['all_news'],
    () => fetch('https://cms.transparency.sk/wp-json/wp/v2/posts?categories=854&per_page=10').then(response => {
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
      <div key={ article.slug } id={ article.slug }>
        <Link to={ '/aktuality/' + article.slug }>
          { article.title.rendered }
        </Link>
        { parse(article.content.rendered) }
      </div>
    );
  }

  return (
    <section>
      <header>
        <h1>
          Aktuality
        </h1>
      </header>
      { articles }
    </section>
  );
}

export default News;
