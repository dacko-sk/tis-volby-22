import has from 'has';
import Countdown from 'react-countdown';
import { currencyFormat } from '../../api/helpers';
import useData from '../context/DataContext';
import LastUpdateTag from './LastUpdateTag';
 
function TotalSpending() {

    const { csvData } = useData();

    // parse data
    let total = 0;
    if (has(csvData, 'data')) {
        for (const row of csvData.data) {
            total += Math.abs(row.sum_outgoing);
        } 
    }

    // Renderer callback with condition
    const renderer = ({ formatted, completed }) => {
        if (completed) {
            // Render a completed state
            return <p>Voľby sa skončili.</p>;
        } else {
            // Render a countdown
            return (
                <div className="countdown text-end hero-number">
                    <span className="countdown-d">{formatted.days}</span>:
                    <span className="countdown-h">{formatted.hours}</span>:
                    <span className="countdown-m">{formatted.minutes}</span>:
                    <span className="countdown-s">{formatted.seconds}</span>
                </div>
            );
        }
    };
  
    return (
        <div className="row">
            <div className="col-lg-6">
                <h4>Zostávajúci čas do volieb</h4>
                <Countdown
                    date="2022-10-29T07:00:00"
                    renderer={renderer}
                />
            </div>
            <div className="col-lg-6">
                <h4>Celkové výdavky kandidátov</h4>
                <p className="text-end hero-number">
                    { currencyFormat(total) }
                    <LastUpdateTag />
                </p>
            </div>
        </div>
    );
    
}

export default TotalSpending;