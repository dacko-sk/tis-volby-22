import has from 'has';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import {
    campaignMetadata as cmd,
    labels,
    transparencyClasses,
    transparencyIndicators,
} from '../../../api/constants';
import {
    compareStr,
    fixUrl,
    numFormat,
    parseAnalysisData,
    parseWpHtml,
    transparencyClass,
} from '../../../api/helpers';
import { routes, segments } from '../../../api/routes';
import useData from '../../../context/DataContext';

function AnalysisDetail({ article }) {
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
    const cls = transparencyClass(analysis[cmd.score][0]);

    const groups = {};
    Object.keys(transparencyIndicators).forEach((group) => {
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
                className="indicators-table mb-0"
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

    const { csvData } = useData();
    // parse aggregated data
    let candidatePage = null;
    let municipalityPage = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            if (
                compareStr(
                    analysis[cmd.municipality][0],
                    row[labels.elections.municipality_key]
                ) ||
                compareStr(
                    analysis[cmd.municipality][0],
                    row.municipalityShortName
                )
            ) {
                municipalityPage = routes.municipality(
                    row.municipalityShortName,
                    row[labels.elections.region_key] ?? null
                );
                if (
                    compareStr(
                        article.title.rendered,
                        row[labels.elections.name_key]
                    )
                ) {
                    candidatePage = routes.candidate(
                        row[labels.elections.name_key],
                        row[labels.elections.municipality_key]
                    );
                    return true;
                }
            }
            return false;
        });
    }

    return (
        <div className="analysis">
            <div className="row gy-3 gy-lg-0">
                <div className="col-lg-6">
                    <h2 className="text-lg-center">{analysis[cmd.type][0]}</h2>
                    <Table responsive>
                        <tbody>
                            <tr>
                                <th>{labels.municipality}</th>
                                <td className="text-end">
                                    {municipalityPage ? (
                                        <Link to={municipalityPage}>
                                            {analysis[cmd.municipality][0]}
                                        </Link>
                                    ) : (
                                        analysis[cmd.municipality][0]
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>{labels.party}</th>
                                <td className="text-end">
                                    {analysis[cmd.support][0]}
                                </td>
                            </tr>
                            <tr>
                                <th>{labels.analysisDate}</th>
                                <td className="text-end">
                                    {analysis[cmd.date][0]}
                                </td>
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
                                    {`${numFormat(analysis[cmd.score][0])}`}%
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
            <h2 className="mt-4 mb-3">Referencie</h2>
            <Row className="mb-4">
                {candidatePage && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <Link to={candidatePage}>
                                    Transparentný účet
                                </Link>
                            </li>
                        </ul>
                    </Col>
                )}
                {analysis[cmd.fb][0] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(analysis[cmd.fb][0])}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {labels.fb}
                                </a>
                            </li>
                        </ul>
                    </Col>
                )}
                {analysis[cmd.web][0] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(analysis[cmd.web][0])}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {labels.web}
                                </a>
                            </li>
                        </ul>
                    </Col>
                )}
                <Col sm={12} md="auto">
                    <ul className="arrows">
                        <li>
                            <Link
                                to={routes.article(segments.NEWS, 'metodika')}
                            >
                                Metodika hodnotenia
                            </Link>
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default AnalysisDetail;
