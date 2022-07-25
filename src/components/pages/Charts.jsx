import React, { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { bars } from '../../api/constants';

import InOutChart from './../charts/InOutChart';

function Charts() {

  const [csvData, setCsvData] = useState({});
  const { readRemoteFile } = usePapaParse();

  useEffect(() => {
    readRemoteFile('https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation.csv', {
      worker: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setCsvData(results);
      },
    });
  }, []);

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
              outgoing: -1 * row.sum_outgoing,
          });
      } else {
          people.push({
              name: row.name + " (" + row.label + ")",
              incoming: row.sum_incoming,
              outgoing: -1 * row.sum_outgoing,
          });
  
          if (regions.hasOwnProperty(row.label)) {
              regions[row.label].incoming += row.sum_incoming;
              regions[row.label].outgoing += -1 * row.sum_outgoing;
          } else {
              regions[row.label] = {
                  name: row.label,
                  incoming: row.sum_incoming,
                  outgoing: -1 * row.sum_outgoing,
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
          Komunálne voľby 2022
        </h1>
      </header>
      <InOutChart title="Transparentné učty politických strán" data={parties} bars={bars} vertical />
      <InOutChart title="Transparentné učty kandidátov" data={people} bars={bars} vertical />
      <InOutChart title="Príjmy a výdavky podľa krajov" data={Object.values(regions)} bars={bars} />
    </section>
  );
}

export default Charts;
