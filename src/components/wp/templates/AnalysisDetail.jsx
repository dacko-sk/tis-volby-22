import has from 'has';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { labels, transparencyClasses } from '../../../api/constants';
import {
    parseAnalysesData,
    parseWpHtml,
    transparencyClass,
} from '../../../api/helpers';

function NewsDetail({ article }) {
    const analysis = parseAnalysesData(article.content.rendered);
    if (has(analysis, 'error')) {
        console.log(analysis.error);
        return (
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        );
    }
    const cls = transparencyClass(analysis.score[0]);

    const groups = {};
    ['account', 'financing', 'information'].forEach((group) => {
        groups[group] = [];
        Object.entries(analysis[group]).forEach(([key, valuesArray]) => {
            const value = valuesArray[0];
            let color = '';
            switch (value) {
                case 1:
                    color = transparencyClasses.good;
                    break;
                case 2:
                    color = transparencyClasses.average;
                    break;
                case 3:
                    color = transparencyClasses.bad;
                    break;
                default:
                    break;
            }
            groups[group].push(
                <tr key={key}>
                    <td>{key}</td>
                    <td>
                        <span className={`badge${color ? ` ${color}` : ''}`}>
                            {labels.score[value]}
                        </span>
                    </td>
                </tr>
            );
        });
    });
    const tables = [];
    Object.keys(groups).forEach((group) => {
        tables.push(
            <div key={group}>
                <h3>{labels.indicators[group].title}</h3>
                <Table striped bordered responsive hover>
                    <tbody>{groups[group]}</tbody>
                </Table>
            </div>
        );
    });

    return (
        <div className="analysis">
            <div className="row gy-3 gy-lg-0">
                <div className="col-lg-6">
                    <h3>{analysis.type[0]}</h3>
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
                        </tbody>
                    </Table>
                </div>
                <div className="col-lg-6">
                    <h3>Celkové hodnotenie</h3>
                    <Row>
                        <Col xs="auto">
                            <div className="hero-number">
                                <span className={`badge me-1 ${cls}`}>
                                    {`${analysis.score[0]}`}%
                                </span>
                            </div>
                        </Col>
                        <Col>{labels.transparency[cls]}</Col>
                    </Row>
                    <em className="disclaimer text-start">
                        Ku dňu {analysis.date[0]}.
                    </em>
                </div>
            </div>
            {tables}
        </div>
    );
}

export default NewsDetail;
