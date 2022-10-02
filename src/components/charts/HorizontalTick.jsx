import { separators } from '../../api/routes';
import { tickClassName, tickFontSize, tickLabel } from './VerticalTick';

function HorizontalTick({ x, y, payload }) {
    const parts = payload.value.split(separators.newline);
    const rows = [];
    parts.forEach((part, index) => {
        rows.push(
            <tspan
                key={part}
                x={x}
                dy={`${index === 0 ? '0.71' : '1'}em`}
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
            orientation="bottom"
            textAnchor="middle"
            type="category"
            fontSize={tickFontSize}
        >
            {rows}
        </text>
    );
}

export default HorizontalTick;
