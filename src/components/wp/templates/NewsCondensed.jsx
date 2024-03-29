import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dateFormat, parseWpHtml } from '../../../api/helpers';

import Media from '../Media';

function NewsCondensed({ article, clickHandler, keyUpHandler }) {
    return (
        <Col className="d-flex px-0" md={6}>
            <div
                id={article.slug}
                className="article p-3"
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <h2 className="d-none d-xxl-block">{article.title.rendered}</h2>

                <Row className="align-items-center align-items-xxl-start">
                    <Col xxl="auto" className="align-self-xxl-start">
                        <div className="thumb mb-2 mb-xxl-0 mt-xxl-2">
                            <figure className="text-center text-xxl-start">
                                <Media
                                    alt={article.title.rendered}
                                    id={article.featured_media}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2 className="d-block d-xxl-none">
                            {article.title.rendered}
                        </h2>
                        <div className="article-date my-2">
                            {dateFormat(article.date)}
                        </div>
                        {parseWpHtml(article.excerpt.rendered)}
                    </Col>
                </Row>
            </div>
        </Col>
    );
}

export default NewsCondensed;
