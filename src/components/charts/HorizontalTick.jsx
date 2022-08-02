function HorizontalTick(props) {
    const { x, y, payload } = props;
    const parts = payload.value.split("\n");
    const rows = [];
    for (let i = 0; i < parts.length; i++) {
      rows.push(
        <tspan key={i} textAnchor="middle" x={x} dy={'1em'}>
          {parts[i]}
        </tspan>
      );
    }
    return (
      <text x={x} y={y} dy={0} fill="#333">
        {rows}
      </text>
    );
}

export default HorizontalTick;
