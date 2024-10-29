import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

function Posts({
    categories = [],
    categoriesExclude = [],
    limit = false,
    noResults,
    search = '',
    section = segments.NEWS,
    showMore = null,
    template = templates.list,
}) {
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const activePage = location.state?.page ?? 1;
    const blocksize = limit || (section === segments.ANALYSES ? 30 : 10);
    const catParam = categories.length
        ? `&categories=${categories.join()}`
        : '';
    const catExParam = categoriesExclude.length
        ? `&categories_exclude=${categoriesExclude.join()}`
        : '';
    const searchParam = search ? `&search=${search}` : '';
    const { isLoading, error, data } = useQuery(
        [`all_posts_${catParam}_${search}_${blocksize}_${activePage}`],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=${blocksize}&page=${activePage}${catParam}${catExParam}${searchParam}`
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
        // navigate to the same page, just pass the current page via state object to preserve history
        navigate(location.pathname, { state: { page } });
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
                {noResults ?? 'Neboli nájdené žiadne články.'}
            </Alert>
        );
    }

    const title =
        template === templates.featured && articles.length ? (
            <h2 className="mb-3">Top {articles.length} kampaní</h2>
        ) : null;

    let nav = null;
    if (showMore || limit) {
        nav = (
            <div className="buttons mt-3 text-center">
                <Button
                    as={Link}
                    to={routes.articles(section)}
                    variant="secondary"
                >
                    {showMore || labels.showMore}
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

    return (
        <div>
            {title}
            {content}
            {nav}
        </div>
    );
}

export default Posts;
