import { labels } from "../../api/constants";

function VerticalTick(props) {
    const { x, y, payload } = props;
    const parts = payload.value.split("\n");
    const rows = [];
    for (let i = 0; i < parts.length; i++) {
      rows.push(
        <tspan key={i} x={x} dy={(i === 0 ? (0.855 - 0.5 * parts.length) : 1) + 'em'} className={tickClassName(i, parts)}>
            {parts[i]}
        </tspan>
      );
    }
    return (
      <text x={x} y={y} fill="#333" orientation="left" textAnchor="end" type="category" width="160" fontSize={tickFontSize}>
          {rows}
      </text>
    );
}

export const tickFontSize = 13;

export const tickClassName = (i, rows) => {
    // special formatting for candidate names
    if (rows.length === 3) {
        switch (i) {
            case 0:
                return 'name';
            case 1:
                return 'cat-' + (rows[i] === labels.elections.regional.name ? 'regional' : 'local');
            default:
                return '';
        }
    }
    return '';
};

export default VerticalTick;
