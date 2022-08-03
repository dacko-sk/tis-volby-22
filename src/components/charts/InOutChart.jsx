import has from 'has';
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
import { chart_columns } from '../../api/constants';
import { numFormat, wholeNumFormat, currencyFormat, wholeCurrencyFormat, shortenValue } from '../../api/helpers';
import HorizontalTick from './HorizontalTick';
import VerticalTick from './VerticalTick';
 
import './Charts.scss';
import LastUpdateTag from './LastUpdateTag';

function InOutChart(props) {
    const vertical = has(props, "vertical");
    const axisNumFormat = has(props, "currency") ? wholeCurrencyFormat : wholeNumFormat;
    const tooltipNumFormat = has(props, "currency") ? currencyFormat : numFormat;

    const shortChartNames = (name) => {
        const length = has(props, "namesLength") ? props.namesLength : 200;
        return shortenValue(name, length);
    };
    let bars = [];
    for (const bar of (has(props, "bars") ? props.bars : chart_columns)) {
        bars.push(<Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} />);
    }
    let labelLines = 1;
    for (const row of props.data) {
        labelLines = Math.max(labelLines, row.name.split("\n").length);
    }
    return (
        <div>
            {has(props, "title") && <h2>{props.title}</h2>}
            <LastUpdateTag />
            <div className="chart" style={{"height": (props.data.length * Math.max(2, labelLines) * 20) + "px"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={props.data}
                        layout={vertical ? "vertical" : "horizontal"}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 15,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3" horizontal={!vertical} vertical={vertical} />
                        {
                            vertical
                            ? <XAxis type="number" tickFormatter={axisNumFormat} />
                            : <XAxis type="category" dataKey="name" tickFormatter={shortChartNames} tick={labelLines > 1 ? <HorizontalTick /> : {}} height={15 + labelLines * 15} />
                        }
                        {
                            vertical
                            ? <YAxis type="category" dataKey="name" tickFormatter={shortChartNames} tick={labelLines > 1 ? <VerticalTick /> : {}} minTickGap={-10} width={160} />
                            : <YAxis type="number" tickFormatter={axisNumFormat} />
                        }
                        <Tooltip formatter={ tooltipNumFormat } />
                        <Legend />
                        { bars }
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
    
}

export default InOutChart;
