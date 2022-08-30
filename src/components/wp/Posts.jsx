import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Pagination from 'react-bootstrap/Pagination';
import has from 'has';
import { dateFormat, parseWpHtml } from '../../api/helpers';
import Media from './Media';
import Loading from '../general/Loading';

import './News.scss';
import { routes, segments } from '../../api/routes';

function Posts(props) {
    const [totalPages, setTotalPages] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const categories = has(props, 'categories')
        ? props.categories.join()
        : '858';
    const categoriesExclude = has(props, 'categoriesExclude')
        ? `&categories_exclude=${props.categoriesExclude.join()}`
        : '';
    const section = has(props, 'section') ? props.section : segments.NEWS;
    const { isLoading, error, data } = useQuery(
        [`all_posts_${categories}_${activePage}`],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?categories=${categories}${categoriesExclude}&per_page=10&page=${activePage}`
            ).then((response) => {
                if (response.headers) {
                    const wptp = Number(
                        response.headers.get('X-WP-TotalPages')
                    );
                    if (wptp > totalPages) {
                        setTotalPages(wptp);
                    }
                }
                // must return promise
                return response.json();
            })
    );

    const navigate = useNavigate();
    const getClickHandler = (article) => () => {
        navigate(routes.article(section, article.slug), {
            state: { article },
        });
    };
    const getKeyUpHandler = (article) => (event) => {
        if (event.keyCode === 13) {
            navigate(routes.article(section, article.slug), {
                state: { article },
            });
        }
    };

    const loadPage = (page) => () => {
        setActivePage(page);
    };

    const articles = [];
    let content = null;
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        data.forEach((article) => {
            articles.push(
                <div
                    key={article.slug}
                    id={article.slug}
                    className="row align-items-center"
                    onClick={getClickHandler(article)}
                    onKeyUp={getKeyUpHandler(article)}
                    role="link"
                    tabIndex={0}
                >
                    <div className="col-12 col-sm-5 col-md-4 col-lg-3">
                        <div className="thumb">
                            <figure>
                                <Media
                                    id={article.featured_media}
                                    fallback={props.img}
                                />
                            </figure>
                        </div>
                    </div>
                    <div className="col">
                        <h2>{article.title.rendered}</h2>
                        <div className="article-date my-2">
                            {dateFormat(article.date)}
                        </div>
                        {parseWpHtml(article.excerpt.rendered)}
                    </div>
                </div>
            );
        });
        content = articles.length ? (
            <div className="articles">{articles}</div>
        ) : (
            <Alert variant="secondary">
                {has(props, 'noResults')
                    ? props.noResults
                    : 'Neboli nájdené žiadne články.'}
            </Alert>
        );
    }

    const items = [];
    for (let i = 1; i <= totalPages; i += 1) {
        items.push(
            <Pagination.Item
                key={i}
                active={i === activePage}
                onClick={loadPage(i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    return (
        <div>
            {content}
            {items.length > 1 && (
                <Pagination className="justify-content-center mt-4">
                    {items}
                </Pagination>
            )}
        </div>
    );
}

export default Posts;
