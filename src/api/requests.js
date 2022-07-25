export const getAggregatedCsv = () => {
    return fetch('https://raw.githubusercontent.com/matusv/transparent-account-data-slovak-elections-2022/main/aggregation.csv')
        .then(res => res.text())
};