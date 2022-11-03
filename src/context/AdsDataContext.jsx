import { createContext, useContext, useMemo, useState } from 'react';
import has from 'has';

import { findTickLink } from '../api/chartHelpers';
import { labels } from '../api/constants';

export const adsFile = 'https://data.gerulata.com/volby2022/candidates.csv';
export const baseDate = 1665871420;

export const processAdsData = (data) => {
    if (has(data, 'data')) {
        const pd = data;
        pd.data.forEach((row, index) => {
            pd.data[index].name = findTickLink(
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
    adsData: {
        lastUpdate: baseDate,
    },
    setAdsData: () => {},
};

const AdsDataContext = createContext(initialState);

export const AdsDataProvider = function ({ children }) {
    const [adsData, setAdsData] = useState(initialState.adsData);

    const value = useMemo(
        () => ({
            adsData,
            setAdsData,
        }),
        [adsData]
    );

    return (
        <AdsDataContext.Provider value={value}>
            {children}
        </AdsDataContext.Provider>
    );
};

const useAdsData = () => {
    const context = useContext(AdsDataContext);

    if (context === undefined) {
        throw new Error('useAdsData must be used within a AdsDataProvider');
    }

    return context;
};

export default useAdsData;
