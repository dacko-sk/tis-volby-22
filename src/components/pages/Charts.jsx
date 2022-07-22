import React from 'react';
import useGoogleSheets from 'use-google-sheets';
import InOutChart from './../charts/InOutChart';

function Charts() {
  // TODO: move to ENV variables
  const SHEETS_API_KEY = "AIzaSyBA8VlrnV9eeAAJOwV_8bELrrj_7jDijSk";
  const SHEET_ID = "1fxMXJzm3iPUwaNOMevJ5Xh57uWSivD7Lc8RoLFdGZ7c";
  const { data, loading, error } = useGoogleSheets({
    apiKey: SHEETS_API_KEY,
    sheetId: SHEET_ID,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  console.log(data);
  // parse data
  let people = [];
  let parties = [];
  let regions = {};
  for (const row of data[0].data) {
    if (row.label === "PS") {
        parties.push({
            name: row.name,
            incoming: parseFloat(row.incoming),
            outgoing: -1 * parseFloat(row.outgoing),
        });
    } else {
        people.push({
            name: row.name + " (" + row.label + ")",
            incoming: parseFloat(row.incoming),
            outgoing: -1 * parseFloat(row.outgoing),
        });

        if (regions.hasOwnProperty(row.label)) {
            regions[row.label].incoming += parseFloat(row.incoming);
            regions[row.label].outgoing += -1 * parseFloat(row.outgoing);
        } else {
            regions[row.label] = {
                name: row.label,
                incoming: parseFloat(row.incoming),
                outgoing: -1 * parseFloat(row.outgoing),
            }
        }
    }
  }

  const bars = [
    {
        key: "incoming",
        name: "Príjmy",
        color: "#008101"
    }, 
    {
      key: "outgoing",
      name: "Výdavky",
      color: "#f80300"
    }
  ];

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
