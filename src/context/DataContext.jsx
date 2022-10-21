import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';
import { labels } from '../api/constants';
import { compareStr, substitute } from '../api/helpers';
import { separators } from '../api/routes';

export const accountsFile =
    'https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation_no_returns_v2.csv';
export const adsFile = 'https://data.gerulata.com/volby2022/candidates.csv';
export const baseDate = 1665871420;
export const reloadMinutes = 70;

export const types = {
    regional: 'regional',
    local: 'local',
};

export const getChartTickLink = (name, municipality, type, allAccounts) => {
    const t = type
        ? separators.newline +
          (type === labels.elections.regional.key
              ? labels.elections.regional.name
              : labels.elections.local.name)
        : '';
    let tick = name + separators.newline + substitute(municipality) + t;
    if (Array.isArray(allAccounts)) {
        allAccounts.some((row) => {
            if (
                compareStr(name, row[labels.elections.name_key]) &&
                compareStr(municipality, row[labels.elections.municipality_key])
            ) {
                tick =
                    row[labels.elections.name_key] +
                    separators.newline +
                    row[labels.elections.region_key] +
                    separators.parts +
                    row.municipalityShortName +
                    separators.newline +
                    row.electionsName;
                return true;
            }
            return false;
        });
    }
    return tick;
};

export const processAccountsData = (data) => {
    if (has(data, 'data')) {
        const pd = data;
        let lastUpdate = baseDate;
        pd.data.forEach((row, index) => {
            lastUpdate = Math.max(lastUpdate, row.timestamp ?? 0);

            // trim certain columns
            [
                labels.elections.name_key,
                labels.elections.municipality_key,
                labels.elections.type_key,
            ].forEach((column) => {
                pd.data[index][column] = (row[column] ?? '').trim();
            });

            // helper properties
            pd.data[index].isParty =
                row[labels.elections.region_key] === labels.elections.party_key;
            pd.data[index].isTransparent = !!row[labels.elections.account_key];
            pd.data[index].isRegional = (
                row[labels.elections.type_key] ?? ''
            ).includes(labels.elections.regional.key);

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
            pd.data[index].duplicateExpenses = 0;
            if (pd.data[index][labels.elections.name_key] === 'Rudolf Kusý') {
                // expenses of Kusy from SMERodina,DV,KDH
                const extra = 99731.89 + 40000 + 35000 + 30000 + 50000;
                pd.data[index].sum_incoming += extra;
                pd.data[index].sum_outgoing += extra;
                pd.data[index].duplicateExpenses = extra;
                pd.data[index].num_incoming += 5;
                pd.data[index].num_outgoing += 5;
                pd.data[index].num_unique_donors += 3;
            } else if (
                // expenses of following candidates are accounted in (/ copied from) different row of the data
                ['Matúš Vallo', 'Marek Hattas'].includes(
                    pd.data[index][labels.elections.name_key]
                ) ||
                (pd.data[index][labels.elections.name_key] ===
                    'Zdenko Čambal' &&
                    pd.data[index].isRegional)
            ) {
                pd.data[index].duplicateExpenses = pd.data[index].sum_outgoing;
            }
        });
        return {
            ...pd,
            lastUpdate,
        };
    }
    return data;
};

export const processAdsData = (data) => {
    if (has(data, 'data')) {
        const pd = data;
        pd.data.forEach((row, index) => {
            pd.data[index].name = getChartTickLink(
                `${row[labels.ads.name_first.key]} ${
                    row[labels.ads.name_last.key]
                }`,
                row[labels.ads.municipality.key],
                row[labels.ads.type.key],
                []
            );
            pd.data[index][labels.ads.amount_tagged.key] = Math.max(
                0,
                row[labels.ads.amount.key] - row[labels.ads.amount_untagged.key]
            );
        });

        // set last update to 3 AM of the last night
        const d = new Date();
        if (d.getHours() < 3) {
            // too early, go back 1 day
            d.setDate(d.getDate() - 1);
        }
        d.setHours(3, 0, 0, 0);

        return {
            ...pd,
            lastUpdate: d.getTime() / 1000,
        };
    }
    return data;
};

export const buildParserConfig = (processCallback, storeDataCallback) => {
    return {
        worker: true,
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
    adsData: {
        lastUpdate: baseDate,
    },
    setAdsData: () => {},
};

const DataContext = createContext(initialState);

export const DataProvider = function ({ children }) {
    const [csvData, setCsvData] = useState(initialState.csvData);
    const [adsData, setAdsData] = useState(initialState.adsData);

    const value = useMemo(
        () => ({ csvData, setCsvData, adsData, setAdsData }),
        [csvData, adsData]
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
