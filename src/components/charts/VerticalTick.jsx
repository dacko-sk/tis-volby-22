import { Link } from 'react-router-dom';
import { labels } from '../../api/constants';
import { routes } from '../../api/routes';

export const tickFontSize = 13;

export const tickClassName = (i, rows) => {
    // special formatting for candidate names
    if (rows.length > 1 && i === 0) {
        return 'name';
    }
    // different colors for election types
    if (rows.length === 3 && i === 2) {
        return `cat-${
            rows[i] === labels.elections.regional.name ? 'regional' : 'local'
        }`;
    }
    return '';
};

export const tickLabel = (i, rows) => {
    // create link on first label if there are at least 2 rows
    if (rows.length > 1 && i === 0) {
        return <Link to={routes.candidate(rows[0], rows[1])}>{rows[0]}</Link>;
    }
    return rows[i];
};

function VerticalTick(props) {
    const { x, y, payload } = props;
    const parts = payload.value.split('\n');
    const rows = [];
    for (let i = 0; i < parts.length; i += 1) {
        rows.push(
            <tspan
                key={i}
                x={x}
                dy={`${i === 0 ? 0.855 - 0.5 * parts.length : 1}em`}
                className={tickClassName(i, parts)}
            >
                {tickLabel(i, parts)}
            </tspan>
        );
    }
    return (
        <text
            x={x}
            y={y}
            fill="#333"
            orientation="left"
            textAnchor="end"
            type="category"
            width="160"
            fontSize={tickFontSize}
        >
            {rows}
        </text>
    );
}

export default VerticalTick;
