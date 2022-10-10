import has from 'has';
import Col from 'react-bootstrap/Col';
import { campaignMetadata as cmd, images } from '../../../api/constants';
import { numFormat, transparencyClass } from '../../../api/helpers';
import Media from '../Media';

function AnalysisFeatured({ article, clickHandler, keyUpHandler }) {
    const { analysis } = article;
    if (has(analysis, 'error')) {
        console.log(analysis.error);
        return null;
    }
    const cls = transparencyClass(analysis[cmd.score][0]);
    return (
        <Col md>
            <div
                id={article.slug}
                className={`article analysis-preview ${cls}`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <div
                    className="thumb mb-2 mb-md-0"
                    data-label={numFormat(analysis[cmd.score][0])}
                >
                    <figure className="text-center">
                        <Media
                            alt={article.title.rendered}
                            id={article.featured_media}
                            fallback={images.analyses}
                        />
                    </figure>
                    <div className="name text-center">
                        <span className={`badge ${cls}`}>
                            {article.title.rendered}
                        </span>
                    </div>
                </div>
            </div>
        </Col>
    );
}

export default AnalysisFeatured;
