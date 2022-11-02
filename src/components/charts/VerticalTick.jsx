import { tickClassName, tickLabel } from '../../api/chartHelpers';
import { separators } from '../../api/routes';

export const tickFontSize = 13;

function VerticalTick({ x, y, payload }) {
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
