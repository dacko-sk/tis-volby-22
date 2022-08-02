function VerticalTick(props) {
    const { x, y, payload } = props;
    const parts = payload.value.split("\n");
    const rows = [];
    for (let i = 0; i < parts.length; i++) {
      rows.push(
        <tspan key={i} textAnchor="right" x={x} dy={(i === 0 ? (0.855 - 0.5 * parts.length) : 1) + 'em'}>
          {parts[i]}
        </tspan>
      );
    }
    return (
      <text x={x} y={y} fill="#333" orientation="left" textAnchor="end" type="category" width="160">
        {rows}
      </text>
    );
}

export default VerticalTick;
