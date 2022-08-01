import { bars } from '../../api/constants';
import TotalSpending from '../charts/TotalSpending';
import useData from '../context/DataContext';

import InOutChart from './../charts/InOutChart';

function Home() {

  const { csvData } = useData();

  console.log(csvData);
  // parse data
  let people = [];
  let parties = [];
  let regions = {};
  let totalSpending = 0;
  if (csvData.hasOwnProperty('data')) {
    for (const row of csvData.data) {
      const out = Math.abs(row.sum_outgoing);
      totalSpending += out;
      if (row.hasOwnProperty('label')) {
        if (row.label === "PS") {
          parties.push({
              name: row.name,
              incoming: row.sum_incoming,
              outgoing: out,
          });
      } else {
          people.push({
              name: row.name + " (" + row.label + ")",
              incoming: row.sum_incoming,
              outgoing: out,
          });
  
          if (regions.hasOwnProperty(row.label)) {
              regions[row.label].incoming += row.sum_incoming;
              regions[row.label].outgoing += out;
          } else {
              regions[row.label] = {
                  name: row.label,
                  incoming: row.sum_incoming,
                  outgoing: out,
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
        <h1 className="my-4">
          Komunálne a župné voľby 2022
        </h1>
      </header>
      <TotalSpending total={totalSpending} />
      <InOutChart title="Príjmy a výdavky podľa krajov" data={Object.values(regions)} currency bars={bars} />
    </section>
  );
}

export default Home;
