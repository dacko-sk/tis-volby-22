import has from 'has';
import { labels } from '../api/constants';
import { dateFormat } from '../api/helpers';
import useData, { baseDate } from '../context/DataContext';
 
function LastUpdateTag({ short }) {

    short = !!short;
    const { csvData } = useData();
    const lastUpdate = has(csvData, 'lastUpdate') ? csvData.lastUpdate : baseDate;
        
    return (
        <em className="updated">
            { short ? '' : labels.charts.disclaimer } { labels.charts.updated } { dateFormat(lastUpdate) }.
        </em>
    );
    
}

export default LastUpdateTag;
