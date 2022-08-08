import { tickClassName, tickFontSize, tickLabel } from "./VerticalTick";

function HorizontalTick(props) {
    const { x, y, payload } = props;
    const parts = payload.value.split("\n");
    const rows = [];
    for (let i = 0; i < parts.length; i++) {
        rows.push(
            <tspan key={ i } x={ x } dy={ (i === 0 ? '0.71' : '1') + 'em' } className={ tickClassName(i, parts) }>
                { tickLabel(i, parts) }
            </tspan>
        );
    }
    return (
        <text x={ x } y={ y } fill="#333" orientation="bottom" textAnchor="middle" type="category" fontSize={ tickFontSize }>
            { rows }
        </text>
    );
}

export default HorizontalTick;
