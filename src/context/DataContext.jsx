import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';

import { labels } from '../api/constants';
import { compareStr, contains, substitute } from '../api/helpers';
import { routes } from '../api/routes';

export const accountsFile =
    // 'https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation_no_returns_v2.csv';
    `${routes.home}csv/aggregation_no_returns_v2.csv`;
export const baseDate = 1669068712;
export const reloadMinutes = 70;

export const types = {
    regional: 'regional',
    local: 'local',
};

export const getFileName = (candidate) => {
    if (
        !has(candidate, labels.elections.name_key) ||
        !has(candidate, labels.elections.account_key)
    ) {
        return null;
    }

    const match = candidate[labels.elections.account_key].match(
        /.*(?:SK\d{12})?(\d{10}).*/
    );
    return match && match.length > 1
        ? `${routes.home}csv/accounts/${candidate[labels.elections.name_key]} ${
              match[1]
          }.csv`
        : null;
};

export const processAccountsData = (data) => {
    if (has(data, 'data')) {
        const pd = data;
        let lastUpdate = baseDate;
        pd.data.forEach((row, index) => {
            lastUpdate = Math.max(lastUpdate, row.timestamp ?? 0);

            // trim certain columns
            [
                labels.elections.account_key,
                labels.elections.name_key,
                labels.elections.municipality_key,
                labels.elections.type_key,
            ].forEach((column) => {
                pd.data[index][column] = (row[column] ?? '').trim();
            });

            // fix errors in account numbers
            if (
                contains(
                    pd.data[index][labels.elections.account_key],
                    'transparentneucty.sk/?1/#/'
                )
            ) {
                pd.data[index][labels.elections.account_key] = pd.data[index][
                    labels.elections.account_key
                ].replace('/?1/#/', '/#/');
            }

            // helper properties
            pd.data[index].isParty =
                row[labels.elections.region_key] === labels.elections.party_key;
            pd.data[index].isTransparent = !!row[labels.elections.account_key];
            pd.data[index].isRegional = (
                row[labels.elections.type_key] ?? ''
            ).includes(labels.elections.regional.key);
            pd.data[index].isElected =
                !pd.data[index].isParty &&
                row[labels.elections.result_key] ===
                    labels.elections.result.success;

            // additional names
            pd.data[index].municipalityShortName =
                substitute(pd.data[index][labels.elections.municipality_key]) ||
                '…';
            pd.data[index].electionsName = pd.data[index].isRegional
                ? labels.elections.regional.name
                : labels.elections.local.name;

            // parse numbers
            pd.data[index].sum_incoming = row.sum_incoming ?? 0;
            pd.data[index].sum_outgoing = Math.abs(row.sum_outgoing ?? 0);
            pd.data[index].balance = row.balance ?? 0;
            pd.data[index].num_incoming = row.num_incoming ?? 0;
            pd.data[index].num_outgoing = row.num_outgoing ?? 0;
            pd.data[index].num_unique_donors = row.num_unique_donors ?? 0;

            // special exceptions for certain candidates
            if (pd.data[index][labels.elections.name_key] === 'Rudolf Kusý') {
                const extra =
                    // sme rodina
                    99731.89 -
                    17672.69 +
                    // dobra volba
                    35000 +
                    40000 +
                    30000 +
                    // kdh
                    50000 +
                    30000 +
                    25000;
                pd.data[index].sum_incoming += extra;
                pd.data[index].sum_outgoing += extra;
                pd.data[index].duplicateExpenses = extra;
                pd.data[index].num_incoming += 7;
                pd.data[index].num_outgoing += 7;
                pd.data[index].num_unique_donors += 3;
            }
        });
        return {
            ...pd,
            lastUpdate,
        };
    }
    return data;
};

export const findRow = (csvData, name, mun) => {
    // parse aggregated data
    let matchedRow = null;
    if (has(csvData, 'data')) {
        csvData.data.some((row) => {
            if (
                (compareStr(mun, row[labels.elections.municipality_key]) ||
                    compareStr(mun, row.municipalityShortName)) &&
                compareStr(name, row[labels.elections.name_key])
            ) {
                matchedRow = row;
                return true;
            }
            return false;
        });
    }
    return matchedRow;
};

export const buildParserConfig = (processCallback, storeDataCallback) => {
    return {
        worker: false,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
            const data = processCallback(results);
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

    // selectors
    const findInCsvData = (name, mun) => findRow(csvData, name, mun);

    const value = useMemo(
        () => ({
            csvData,
            setCsvData,
            findInCsvData,
        }),
        [csvData]
    );

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
