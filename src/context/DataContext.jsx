import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';
import { labels } from '../api/constants';
import { substitute } from '../api/helpers';

export const aggregationFile =
    'https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation_no_returns_v2.csv';
export const baseDate = 1659535519;
export const reloadMinutes = 70;

export const types = {
    regional: 'miestne',
    local: 'župné',
};

export const processData = (data) => {
    if (has(data, 'data')) {
        const processed = data;
        let lastUpdate = baseDate;
        processed.data.forEach((row, index) => {
            lastUpdate = Math.max(lastUpdate, row.timestamp ?? 0);

            // trim certain columns
            [
                labels.elections.name_key,
                labels.elections.municipality_key,
                labels.elections.type_key,
            ].forEach((column) => {
                processed.data[index][column] = (row[column] ?? '').trim();
            });

            // helper properties
            processed.data[index].isParty =
                row[labels.elections.region_key] === labels.elections.party_key;
            processed.data[index].isTransparent =
                !!row[labels.elections.account_key];
            processed.data[index].isRegional = (
                row[labels.elections.type_key] ?? ''
            ).includes(labels.elections.regional.key);

            // additional names
            processed.data[index].municipalityShortName =
                substitute(
                    processed.data[index][labels.elections.municipality_key]
                ) || '…';
            processed.data[index].electionsName = processed.data[index]
                .isRegional
                ? labels.elections.regional.name
                : labels.elections.local.name;

            // parse numbers
            processed.data[index].sum_incoming = row.sum_incoming ?? 0;
            processed.data[index].sum_outgoing = Math.abs(
                row.sum_outgoing ?? 0
            );
            processed.data[index].balance = row.balance ?? 0;
            processed.data[index].num_incoming = row.num_incoming ?? 0;
            processed.data[index].num_outgoing = row.num_outgoing ?? 0;
            processed.data[index].num_unique_donors =
                row.num_unique_donors ?? 0;
        });
        return {
            ...processed,
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
        skipEmptyLines: true,
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
