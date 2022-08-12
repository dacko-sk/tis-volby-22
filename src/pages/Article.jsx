import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import has from 'has';
import { dateFormat, parseWpHtml } from '../api/helpers';
import Loading from '../components/Loading';

function Article() {
    const params = useParams();
    const slug = has(params, 'slug') ? params.slug : null;
    const navigate = useNavigate();

    // try to set article data object from location.state
    const location = useLocation();
    let article =
        location.state && has(location.state, 'article')
            ? location.state.article
            : {};

    // load article data from API (if needed)
    const { isLoading, error, data } = useQuery(
        [`article_${slug}`],
        () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?slug=${slug}`
            ).then((response) => response.json()),
        {
            // run only if article data were not delivered via location.state
            enabled: !has(article, 'title'),
        }
    );

    if (!isLoading && !error && data && data.length) {
        // article successfully loaded from API - show it!
        article = {
            ...article,
            ...data[0],
        };
    }

    // this has to be wrapped in useEffect, otherwise react is bitching about rendering router before unfinished rendering of article :-D
    useEffect(() => {
        if (!isLoading && !error && data && !data.length) {
            // redirect to parent page (all articles) in case article does not exist in API
            navigate(location.pathname.replace(`/${slug}`, ''));
        }
    }, [isLoading, error, data, navigate, location.pathname, slug]);

    if (!has(article, 'title') || error) {
        // waiting for data or error in loding
        return <Loading error={error} />;
    }

    return (
        <section className="article">
            <header className="mb-4">
                <h1>{article.title.rendered}</h1>
            </header>
            <div className="article-date my-4">{dateFormat(article.date)}</div>
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        </section>
    );
}

export default Article;
