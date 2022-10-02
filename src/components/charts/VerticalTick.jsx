import { Link } from 'react-router-dom';
import { labels } from '../../api/constants';
import { routes, separators } from '../../api/routes';

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
    if (rows.length > 1) {
        const name = rows[0];
        const parts = rows[1].split(separators.parts);
        const town = parts.length > 1 ? parts[1] : rows[1];
        const region = parts.length > 1 ? parts[0] : null;
        switch (i) {
            case 0:
                return <Link to={routes.candidate(name, town)}>{name}</Link>;
            case 1:
                return town === '…' ? (
                    town
                ) : (
                    <Link to={routes.municipality(town, region)}>{town}</Link>
                );
            default:
                break;
        }
    }
    return rows[i];
};

function VerticalTick(props) {
    const { x, y, payload } = props;
    const parts = payload.value.split(separators.newline);
    const rows = [];
    parts.forEach((part, index) => {
        rows.push(
            <tspan
                key={part}
                x={x}
                dy={`${index === 0 ? 0.855 - 0.5 * parts.length : 1}em`}
                className={tickClassName(index, parts)}
            >
                {tickLabel(index, parts)}
            </tspan>
        );
    });
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
