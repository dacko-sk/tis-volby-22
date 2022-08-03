import { createContext, useContext, useMemo, useState } from "react";
import { usePapaParse } from 'react-papaparse';
import has from 'has';

export const baseDate = 1659535519;

const initialState = {
    csvData: {
        lastUpdate: baseDate
    },
    setCsvData: () => {}
};

const DataContext = createContext(initialState);

export const DataProvider = ({ children }) => {
    const [csvData, setCsvData] = useState(initialState.csvData);

    const value = useMemo(
        () => ({ csvData, setCsvData }), 
        [csvData]
      );
    
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

const useData = () => {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
 
    // load election data from CSV API and store in context provider
    const { readRemoteFile } = usePapaParse();
    if (!has(context.csvData, 'data')) {
        console.log('requesting CSV data');
        readRemoteFile('https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation.csv', {
          worker: true,
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = processData(results);
            context.setCsvData(data);
            console.log('storing CSV data in context');
          },
        });
    }

    return context;
};

const processData = (data) => {
    let lastUpdate = baseDate;
    if (has(data, 'data')) {
        for (const row of data.data) {
            lastUpdate = Math.max(lastUpdate, row.timestamp ?? 0);
        }
        return {
            ...data,
            lastUpdate
        }
    }
    return data;
}

export default useData;
