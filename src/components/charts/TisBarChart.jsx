import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import has from 'has';

import { colors, labels } from '../../api/constants';
import {
    numFormat,
    wholeNumFormat,
    currencyFormat,
    wholeCurrencyFormat,
    shortenValue,
} from '../../api/helpers';
import { separators } from '../../api/routes';

import HorizontalTick from './HorizontalTick';
import VerticalTick, { tickFontSize } from './VerticalTick';
import LastUpdateTag from '../general/LastUpdateTag';

import './Charts.scss';

export const columnVariants = {
    inOut: [
        {
            key: 'outgoing',
            name: labels.charts.outgoing,
            color: colors.colorOrange,
        },
        {
            key: 'incoming',
            name: labels.charts.incoming,
            color: colors.colorDarkBlue,
        },
    ],
    donors: [
        {
            key: 'donors',
            name: labels.charts.uniqeDonors,
            color: colors.colorDarkBlue,
        },
    ],
    adsSpending: [
        {
            key: labels.ads.spending.key,
            name: labels.ads.spending.title,
            color: colors.colorOrange,
        },
    ],
    adsAmount: [
        {
            key: labels.ads.amount.key,
            name: labels.ads.amount.title,
            color: colors.colorDarkBlue,
        },
        {
            key: labels.ads.amount_tagged.key,
            name: labels.ads.amount_tagged.title,
            color: colors.colorLightBlue,
            stackId: 'total',
        },
        {
            key: labels.ads.amount_untagged.key,
            name: labels.ads.amount_untagged.title,
            color: colors.colorOrange,
            stackId: 'total',
        },
    ],
};

const tooltipNameFormat = (value) => {
    const parts = value.split(separators.newline);
    if (parts.length) {
        const tags = [<strong key="name">{parts[0]}</strong>];
        parts.forEach((part, index) => {
            if (index > 0) {
                const subParts = part.split(separators.parts);
                const town = subParts.length > 1 ? subParts[1] : part;
                if (town !== '…') {
                    tags.push(<br key={`br${part}`} />);
                    tags.push(<span key={`val${part}`}>{town}</span>);
                }
            }
        });
        return <>{tags}</>;
    }
    return value;
};

function TisBarChart({
    bars = columnVariants.inOut,
    buttonLink,
    buttonText,
    currency = false,
    data,
    namesLength,
    scrollable = false,
    subtitle,
    timestamp,
    title,
    vertical = false,
}) {
    if (!data || !Array.isArray(data) || !data.length) {
        return null;
    }

    const axisNumFormat = currency ? wholeCurrencyFormat : wholeNumFormat;
    const tooltipNumFormat = currency ? currencyFormat : numFormat;
    const axisConfig = {
        fill: '#333',
        fontSize: tickFontSize,
    };
    const shortChartNames = (name) => shortenValue(name, namesLength ?? 200);
    const barElements = [];
    bars.forEach((bar) => {
        barElements.push(
            <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={bar.color}
                name={bar.name}
                stackId={has(bar, 'stackId') ? bar.stackId : null}
            />
        );
    });

    let labelLines = 1;
    data.forEach((row) => {
        labelLines = Math.max(
            labelLines,
            row.name.split(separators.newline).length
        );
    });

    return (
        <div className="chart-wrapper mb-3">
            {title && <h2>{title}</h2>}
            {subtitle && <h6>{subtitle}</h6>}
            <LastUpdateTag short={!!timestamp} timestamp={timestamp ?? null} />
            <div className={`chart-outer${scrollable ? ' scrollable' : ''}`}>
                <div
                    className="chart"
                    style={
                        vertical
                            ? {
                                  height: `${
                                      55 +
                                      data.length * Math.max(2, labelLines) * 20
                                  }px`,
                              }
                            : {}
                    }
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout={vertical ? 'vertical' : 'horizontal'}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 15,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3"
                                horizontal={!vertical}
                                vertical={vertical}
                            />
                            {vertical ? (
                                <XAxis
                                    type="number"
                                    tickFormatter={axisNumFormat}
                                    tick={axisConfig}
                                />
                            ) : (
                                <XAxis
                                    type="category"
                                    dataKey="name"
                                    tickFormatter={shortChartNames}
                                    tick={
                                        labelLines > 1 ? (
                                            <HorizontalTick />
                                        ) : (
                                            axisConfig
                                        )
                                    }
                                    minTickGap={-10}
                                    height={15 + labelLines * 15}
                                />
                            )}
                            {vertical ? (
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tickFormatter={shortChartNames}
                                    tick={
                                        labelLines > 1 ? (
                                            <VerticalTick />
                                        ) : (
                                            axisConfig
                                        )
                                    }
                                    minTickGap={-15}
                                    width={160}
                                />
                            ) : (
                                <YAxis
                                    type="number"
                                    tickFormatter={axisNumFormat}
                                    tick={axisConfig}
                                />
                            )}
                            <Tooltip
                                formatter={tooltipNumFormat}
                                labelFormatter={tooltipNameFormat}
                            />
                            <Legend />
                            {barElements}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {buttonLink && (
                <div className="buttons mt-3 text-center">
                    <Button as={Link} to={buttonLink} variant="secondary">
                        {buttonText ?? labels.showMore}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default TisBarChart;
