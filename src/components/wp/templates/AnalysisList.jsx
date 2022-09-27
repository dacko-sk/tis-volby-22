import has from 'has';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { images, labels } from '../../../api/constants';
import { imgPath, transparencyClass } from '../../../api/helpers';

function AnalysisList({ article, clickHandler, keyUpHandler }) {
    const { analysis } = article;
    if (has(analysis, 'error')) {
        console.log(analysis.error);
        return null;
    }
    const cls = transparencyClass(analysis.score[0]);
    return (
        <Col className="px-0" md={12}>
            <div
                id={article.slug}
                className={`article analysis-preview ${cls} p-3`}
                onClick={clickHandler}
                onKeyUp={keyUpHandler}
                role="link"
                tabIndex={0}
            >
                <Row className="align-items-center">
                    <Col sm={4} md={5} lg={3}>
                        <div className="thumb mb-2 mb-md-0">
                            <figure className="text-center">
                                <img
                                    alt={
                                        labels.transparency[
                                            analysis.transparency
                                        ]
                                    }
                                    className="p-3"
                                    src={imgPath(images.analyses)}
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{article.title.rendered}</h2>
                        <Table responsive>
                            <tbody>
                                <tr>
                                    <th>{labels.municipality}</th>
                                    <td>{analysis.municipality[0]}</td>
                                </tr>
                                <tr>
                                    <th>{labels.party}</th>
                                    <td>{analysis.support[0]}</td>
                                </tr>
                                <tr>
                                    <th>{labels.analysis}</th>
                                    <td className="score">
                                        <span className={`badge me-1 ${cls}`}>
                                            {`${analysis.score[0]}`}%
                                        </span>
                                        {labels.transparency[cls]}
                                    </td>
                                </tr>
                                <tr className="d-none d-md-table-row">
                                    <th>{labels.analysisDate}</th>
                                    <td>{analysis.date[0]}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        </Col>
    );
}

export default AnalysisList;
