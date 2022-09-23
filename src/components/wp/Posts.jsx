import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import has from 'has';
import { labels } from '../../api/constants';
import { scrollToTop } from '../../api/helpers';
import { routes, segments } from '../../api/routes';
import AnalysesList from './templates/AnalysesList';
import NewsCondensed from './templates/NewsCondensed';
import NewsList from './templates/NewsList';
import Loading from '../general/Loading';

import './News.scss';

function Posts(props) {
    const [totalPages, setTotalPages] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const limit = has(props, 'limit') ? props.limit : false;
    const blocksize = limit || 10;
    const categories = has(props, 'categories')
        ? `&categories=${props.categories.join()}`
        : '';
    const categoriesExclude = has(props, 'categoriesExclude')
        ? `&categories_exclude=${props.categoriesExclude.join()}`
        : '';
    const search = has(props, 'search') ? `&search=${props.search}` : '';
    const section = has(props, 'section') ? props.section : segments.NEWS;
    const condensed = has(props, 'condensed');
    const { isLoading, error, data } = useQuery(
        [`all_posts_${categories}_${search}_${blocksize}_${activePage}`],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=${blocksize}&page=${activePage}${categories}${categoriesExclude}${search}`
            ).then((response) => {
                if (response.headers) {
                    const wptp = Number(
                        response.headers.get('X-WP-TotalPages')
                    );
                    setTotalPages(wptp);
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
        scrollToTop();
    };

    const articles = [];
    let content = null;
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        data.forEach((article) => {
            if (section === segments.NEWS) {
                articles.push(
                    condensed ? (
                        <NewsCondensed
                            key={article.slug}
                            article={article}
                            clickHandler={getClickHandler(article)}
                            keyUpHandler={getKeyUpHandler(article)}
                        />
                    ) : (
                        <NewsList
                            key={article.slug}
                            article={article}
                            clickHandler={getClickHandler(article)}
                            keyUpHandler={getKeyUpHandler(article)}
                        />
                    )
                );
            } else {
                articles.push(
                    <AnalysesList
                        key={article.slug}
                        article={article}
                        clickHandler={getClickHandler(article)}
                        keyUpHandler={getKeyUpHandler(article)}
                    />
                );
            }
        });
        content = articles.length ? (
            <Row className={`articles${condensed ? ' condensed' : ''}`}>
                {articles}
            </Row>
        ) : (
            <Alert variant="secondary">
                {has(props, 'noResults')
                    ? props.noResults
                    : 'Neboli nájdené žiadne články.'}
            </Alert>
        );
    }

    let nav = null;
    if (limit) {
        nav = (
            <div className="buttons mt-3 text-center">
                <Button
                    as={Link}
                    to={routes.articles(section)}
                    variant="secondary"
                >
                    {labels.showMore}
                </Button>
            </div>
        );
    } else {
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
        if (items.length > 1) {
            nav = (
                <Pagination className="justify-content-center mt-4">
                    {items}
                </Pagination>
            );
        }
    }

    // reset active page to 1 if search query changes
    useEffect(() => {
        setActivePage(1);
    }, [search]);

    return (
        <div>
            {content}
            {nav}
        </div>
    );
}

export default Posts;
