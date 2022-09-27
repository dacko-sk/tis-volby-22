import has from 'has';
import Col from 'react-bootstrap/Col';
import { images } from '../../../api/constants';
import { transparencyClass } from '../../../api/helpers';
import Media from '../Media';

function AnalysisFeatured({ article, clickHandler, keyUpHandler }) {
    const { analysis } = article;
    if (has(analysis, 'error')) {
        console.log(analysis.error);
        return null;
    }
    const cls = transparencyClass(analysis.score[0]);
    return (
        <Col className="px-0" md>
            <div
                id={article.slug}
                className={`article analysis-preview ${cls} p-3`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <div className="thumb mb-2 mb-md-0">
                    <figure className="text-center">
                        <Media
                            alt={article.title.rendered}
                            id={article.featured_media}
                            fallback={images.analyses}
                        />
                    </figure>
                </div>
            </div>
        </Col>
    );
}

export default AnalysisFeatured;
