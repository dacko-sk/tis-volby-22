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

export const processAdsData = (data) => {
    if (has(data, 'data')) {
        const processed = data;
        processed.data.forEach((row, index) => {
            processed.data[index].name = getChartTickLink(
                `${row[labels.ads.name_first.key]} ${
                    row[labels.ads.name_last.key]
                }`,
                row[labels.ads.municipality.key],
                row[labels.ads.type.key],
                []
            );
            processed.data[index][labels.ads.amount_tagged.key] = Math.max(
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
            ...processed,
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
