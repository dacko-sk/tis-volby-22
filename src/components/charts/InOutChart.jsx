import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
   } from 'recharts';
 
function InOutChart(props) {
    const vertical = props.hasOwnProperty("vertical");
    let bars = [];
    if (props.hasOwnProperty("bars")) {
        for (const bar of props.bars) {
            bars.push(<Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} />);
        }
    }
    
    const tickFormatter = (name) => {
        if (typeof name === "string" && name.length > 30) {
            return name.substring(0, 30) + "…";
        }
        return name;
    };
    
    return (
        <div>
            <h2>{props.title}</h2>
            <div className="chart" style={{"height": (props.data.length * 40) + "px"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={props.data}
                        layout={vertical ? "vertical" : "horizontal"}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3" horizontal={!vertical} vertical={vertical} />
                        <XAxis type={vertical ? "number" : "category"} dataKey={vertical ? null : "name"} />
                        <YAxis type={vertical ? "category" : "number"} dataKey={vertical ? "name" : null} width={vertical ? 160 : 60} tickFormatter={vertical ? tickFormatter : null} />
                        <Tooltip />
                        <Legend />
                        { bars }
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
    
}

export default InOutChart;
