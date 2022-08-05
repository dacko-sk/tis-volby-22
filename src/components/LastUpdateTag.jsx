import has from 'has';
import { dateFormat } from '../api/helpers';
import useData, { baseDate } from '../context/DataContext';
 
function LastUpdateTag() {

    const { csvData } = useData();
    const lastUpdate = has(csvData, 'lastUpdate') ? csvData.lastUpdate : baseDate;
  
    return <span className="updated">dáta z {dateFormat(lastUpdate)}</span>;
    
}

export default LastUpdateTag;
