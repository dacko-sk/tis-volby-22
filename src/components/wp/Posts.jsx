import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import has from 'has';
import { labels } from '../../api/constants';
import { parseAnalysisData, scrollToTop } from '../../api/helpers';
import { routes, segments } from '../../api/routes';
import AnalysisFeatured from './templates/AnalysisFeatured';
import AnalysisList from './templates/AnalysisList';
import NewsCondensed from './templates/NewsCondensed';
import NewsList from './templates/NewsList';
import Loading from '../general/Loading';

import './News.scss';

export const templates = {
    condensed: 'condensed',
    featured: 'featured',
    list: 'list',
};

const sortByScore = (a, b) => {
    if (has(b.analysis, 'score') && has(a.analysis, 'score')) {
        return (
            b.analysis.score[b.analysis.score.length - 1] -
            a.analysis.score[a.analysis.score.length - 1]
        );
    }
    return -1;
};

const getAnalysedData = (data) => {
    const analysedData = [];
    data.forEach((article) => {
        analysedData.push({
            ...article,
            analysis: parseAnalysisData(article.content.rendered),
        });
    });
    return analysedData.sort(sortByScore);
};

function Posts(props) {
    const [totalPages, setTotalPages] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const template =
        has(props, 'template') && has(templates, props.template)
            ? props.template
            : templates.list;
    const limit = has(props, 'limit') ? props.limit : false;
    const blocksize = limit || (template === templates.featured ? 20 : 10);
    const categories = has(props, 'categories')
        ? `&categories=${props.categories.join()}`
        : '';
    const categoriesExclude = has(props, 'categoriesExclude')
        ? `&categories_exclude=${props.categoriesExclude.join()}`
        : '';
    const search = has(props, 'search') ? `&search=${props.search}` : '';
    const section = has(props, 'section') ? props.section : segments.NEWS;
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
        if (section === segments.ANALYSES) {
            getAnalysedData(data).forEach((article) => {
                articles.push(
                    template === templates.featured ? (
                        <AnalysisFeatured
                            key={article.slug}
                            article={article}
                            clickHandler={getClickHandler(article)}
                            keyUpHandler={getKeyUpHandler(article)}
                        />
                    ) : (
                        <AnalysisList
                            key={article.slug}
                            article={article}
                            clickHandler={getClickHandler(article)}
                            keyUpHandler={getKeyUpHandler(article)}
                        />
                    )
                );
            });
        } else {
            data.forEach((article) => {
                articles.push(
                    template === templates.condensed ? (
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
            });
        }

        content = articles.length ? (
            <Row
                className={`articles ${template}${
                    template === templates.featured ? ' gy-3' : ''
                }`}
            >
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

    const title =
        template === templates.featured && articles.length ? (
            <h2>Top {articles.length} kampaní</h2>
        ) : null;

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
    } else if (template !== templates.featured) {
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
            {title}
            {content}
            {nav}
        </div>
    );
}

export default Posts;
