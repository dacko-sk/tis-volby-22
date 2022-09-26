import has from 'has';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { labels, transparencyClasses } from '../../../api/constants';
import {
    parseAnalysisData,
    parseWpHtml,
    transparencyClass,
} from '../../../api/helpers';

function NewsDetail({ article }) {
    const analysis = has(article, 'analysis')
        ? article.analysis
        : parseAnalysisData(article.content.rendered);
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
            <h2 key={`${group}title`} className="mt-4 mb-3">
                {labels.indicators[group].title}
            </h2>
        );
        tables.push(
            <Table
                key={group}
                className="mb-0"
                striped
                bordered
                responsive
                hover
            >
                <tbody>{groups[group]}</tbody>
            </Table>
        );
    });
    const words = labels.transparency[cls].split(' ');
    const transparencyTag = [];
    words.forEach((word, index) => {
        if (index < words.length - 1) {
            transparencyTag.push(`${word} `);
            transparencyTag.push(
                <br className="d-none d-sm-block" key={word} />
            );
        } else {
            transparencyTag.push(word);
        }
    });

    return (
        <div className="analysis">
            <div className="row gy-3 gy-lg-0">
                <div className="col-lg-6">
                    <h2 className="text-lg-center">{analysis.type[0]}</h2>
                    <Table responsive>
                        <tbody>
                            <tr>
                                <th>{labels.municipality}</th>
                                <td className="text-end">
                                    {analysis.municipality[0]}
                                </td>
                            </tr>
                            <tr>
                                <th>{labels.party}</th>
                                <td className="text-end">
                                    {analysis.support[0]}
                                </td>
                            </tr>
                            <tr>
                                <th>{labels.analysisDate}</th>
                                <td className="text-end">{analysis.date[0]}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="col-lg-6">
                    <h2 className="text-lg-center">{labels.analysis}</h2>
                    <div className="hero-number mt-4">
                        <Row className="align-items-center justify-content-lg-center gx-2">
                            <Col xs="auto">
                                <span className={`badge me-1 ${cls}`}>
                                    {`${analysis.score[0]}`}%
                                </span>
                            </Col>
                            <Col xs="auto">
                                <h5>{transparencyTag}</h5>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            {tables}
        </div>
    );
}

export default NewsDetail;
