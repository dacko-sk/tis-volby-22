import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Media from '../Media';
import { images } from '../../../api/constants';

function AnalysesList({ article, clickHandler, keyUpHandler }) {
    return (
        <Col className="px-0" md={12}>
            <div
                id={article.slug}
                className="article p-3"
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <Row className="align-items-center">
                    <Col md={5} lg={3}>
                        <div className="thumb mb-2 mb-md-0">
                            <figure className="text-center text-xxl-start">
                                <Media
                                    id={article.featured_media}
                                    fallback={images.analyses}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{article.title.rendered}</h2>
                    </Col>
                </Row>
            </div>
        </Col>
    );
}

export default AnalysesList;
