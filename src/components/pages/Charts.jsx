import { bars } from '../../api/constants';
import useData from '../context/DataContext';

import InOutChart from './../charts/InOutChart';

function Charts() {

  const { csvData } = useData();

  console.log(csvData);
  // parse data
  let people = [];
  let parties = [];
  let regions = {};
  if (csvData.hasOwnProperty('data')) {
    for (const row of csvData.data) {
      if (row.hasOwnProperty('label')) {
        if (row.label === "PS") {
          parties.push({
              name: row.name,
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
          });
      } else {
          people.push({
              name: row.name + " (" + row.label + ")",
              incoming: row.sum_incoming,
              outgoing: Math.abs(row.sum_outgoing),
          });
  
          if (regions.hasOwnProperty(row.label)) {
              regions[row.label].incoming += row.sum_incoming;
              regions[row.label].outgoing += Math.abs(row.sum_outgoing);
          } else {
              regions[row.label] = {
                  name: row.label,
                  incoming: row.sum_incoming,
                  outgoing: Math.abs(row.sum_outgoing),
              }
          }
        }
      }
    }  
  } else {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <header>
        <h1>
          Grafy
        </h1>
      </header>
      <InOutChart title="Transparentné učty politických strán" data={parties} bars={bars} currency vertical />
      <InOutChart title="Transparentné učty kandidátov" data={people} bars={bars} currency vertical />
      <InOutChart title="Príjmy a výdavky podľa krajov" data={Object.values(regions)} currency bars={bars} />
    </section>
  );
}

export default Charts;
