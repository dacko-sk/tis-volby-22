import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';

export const csvFile =
    'https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation.csv';
export const baseDate = 1659535519;
export const reloadMinutes = 70;

export const processData = (data) => {
    let lastUpdate = baseDate;
    if (has(data, 'data')) {
        data.data.forEach((row) => {
            lastUpdate = Math.max(lastUpdate, row.timestamp ?? 0);
        });
        return {
            ...data,
            lastUpdate,
        };
    }
    return data;
};

export const buildParserConfig = (storeDataCallback) => {
    return {
        worker: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            const data = processData(results);
            storeDataCallback(data);
        },
    };
};

const initialState = {
    csvData: {
        lastUpdate: baseDate,
    },
    setCsvData: () => {},
};

const DataContext = createContext(initialState);

export const DataProvider = function ({ children }) {
    const [csvData, setCsvData] = useState(initialState.csvData);

    const value = useMemo(() => ({ csvData, setCsvData }), [csvData]);

    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
};

const useData = () => {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }

    return context;
};

export default useData;
