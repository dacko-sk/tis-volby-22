import parse, { attributesToProps, domToReact } from 'html-react-parser';
import has from 'has';
import { imgRootPath, labels, transparencyClasses } from './constants';

export const slovakFormat = (value, options) =>
    new Intl.NumberFormat('sk-SK', options).format(value);

export const numFormat = (value) => slovakFormat(value, {});

export const wholeNumFormat = (value) =>
    slovakFormat(value, {
        maximumFractionDigits: 0,
    });

export const currencyFormat = (value) =>
    slovakFormat(value, {
        style: 'currency',
        currency: 'EUR',
    });

export const wholeCurrencyFormat = (value) =>
    slovakFormat(value, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    });

export const shortenValue = (value, length, removals) => {
    if (value) {
        let shorten = value;
        if (Array.isArray(removals)) {
            removals.forEach((removal) => {
                shorten = shorten.replace(removal, '');
            });
        }
        if (typeof shorten === 'string' && shorten.length > length) {
            return `${shorten.substring(0, length)}…`;
        }
        return shorten;
    }
    return '';
};

export const shortenUrl = (value) =>
    shortenValue(value, 32, ['https://', 'www.']);

export const dateFormat = (timestamp) =>
    new Intl.DateTimeFormat('sk-SK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }).format(
        new Date(typeof timestamp === 'number' ? 1000 * timestamp : timestamp)
    );

const proxyHttpImages = (html) => {
    const regex = /(http:\/\/cms.transparency.sk\/[^",]+.(png|jpe?g|gif|svg))/i;
    return html.replace(regex, 'https://images.weserv.nl/?url=$1');
};

const parserOptions = {
    replace: ({ name, attribs, children }) => {
        if (name === 'img' && attribs && attribs.src) {
            const props = {
                ...attributesToProps(attribs),
                // proxy image to force https
                src: proxyHttpImages(attribs.src),
                // add bootstrap 5 classes to images
                className: 'figure-img img-fluid',
            };
            return <img {...props} />;
        }
        if (name === 'a') {
            if (attribs && attribs.rel && attribs.rel.startsWith('lightbox')) {
                // remove lightbox links
                // will recursively run parser on children
                return domToReact(children, parserOptions);
            }
            if (
                children.length &&
                children[0].type === 'text' &&
                children[0].data.startsWith('Continue reading')
            ) {
                // remove "continue reading" links to WP domain
                return <></>;
            }
        }
        if (name === 'figure') {
            // add bootstrap 5 classes to figures
            return (
                <figure className={`figure ${attribs.class || ''}`}>
                    {domToReact(children, parserOptions)}
                </figure>
            );
        }
        if (name === 'figcaption') {
            // add bootstrap 5 classes to figcaptions
            return (
                <figcaption className="figure-caption text-center">
                    {domToReact(children, parserOptions)}
                </figcaption>
            );
        }
        // otherwise no replacement
        return null;
    },
};

export const parseWpHtml = (html) => parse(html, parserOptions);

export const ecodeHTMLEntities = (rawStr) =>
    rawStr
        ? rawStr.replace(
              /&#(\d+);/g,
              (match, dec) => `${String.fromCharCode(dec)}`
          )
        : '';

export const parseAnalysisData = (html) => {
    if (html) {
        const start = '<tbody><tr>';
        const end = '</tr></tbody>';
        const startPos = html.indexOf(start);
        const endPos = html.indexOf(end);
        if (startPos > -1 && endPos > -1) {
            const tableData = [];
            html.substring(startPos + start.length, endPos)
                .replaceAll('<tr>', '')
                .split('</tr>')
                .forEach((row) => {
                    const cols = [];
                    row.split('</td>').forEach((col, index) => {
                        // ignore first row (names), save the rest into tableData
                        if (index > 0 && col.trim()) {
                            const val = col.replaceAll('<td>', '');
                            const num = Number(val);
                            cols.push(
                                Number.isNaN(num) ? ecodeHTMLEntities(val) : num
                            );
                        }
                    });
                    tableData.push(cols);
                });
            const required =
                5 +
                labels.indicators.account.criteria.length +
                labels.indicators.financing.criteria.length +
                labels.indicators.information.criteria.length;
            if (tableData.length >= required) {
                const analysis = {
                    type: tableData[0],
                    municipality: tableData[1],
                    support: tableData[2],
                    date: tableData[3],
                    score: tableData[4],
                };
                let rowKey = 5;
                ['account', 'financing', 'information'].forEach((group) => {
                    analysis[group] = {};
                    labels.indicators[group].criteria.forEach((criterium) => {
                        analysis[group][criterium] = tableData[rowKey];
                        rowKey += 1;
                    });
                });
                return analysis;
            }
        }
    }
    return {
        error: 'Corrupted table format',
    };
};

export const transparencyClass = (score) => {
    let cls = transparencyClasses.bad;
    if (score >= 45) {
        cls =
            score >= 75
                ? transparencyClasses.good
                : transparencyClasses.average;
    }
    return cls;
};

export const regions = {
    BB: 'Banskobystrický kraj',
    BA: 'Bratislavský kraj',
    KE: 'Košický kraj',
    NR: 'Nitriansky kraj',
    PO: 'Prešovský kraj',
    TN: 'Trenčiansky kraj',
    TT: 'Trnavský kraj',
    ZA: 'Žilinský kraj',
};

const replacements = {
    ...regions,
    'Banskobystrický samosprávny kraj': 'BBSK',
    'Bratislavský samosprávny kraj': 'BSK',
    'Košický samosprávny kraj': 'KSK',
    'Nitriansky samosprávny kraj': 'NSK',
    'Prešovský samosprávny kraj': 'PSK',
    'Trenčiansky samosprávny kraj': 'TSK',
    'Trnavský samosprávny kraj': 'TTSK',
    'Žilinský samosprávny kraj': 'ŽSK',
    Banskobystrický: 'Banskobystrický samosprávny kraj',
    Bratislavský: 'Bratislavský samosprávny kraj',
    Košický: 'Košický samosprávny kraj',
    Nitriansky: 'Nitriansky samosprávny kraj',
    Prešovský: 'Prešovský samosprávny kraj',
    Trenčiansky: 'Trenčiansky samosprávny kraj',
    Trnavský: 'Trnavský samosprávny kraj',
    Žilinský: 'Žilinský samosprávny kraj',
};

export const substitute = (value) =>
    has(replacements, value) ? replacements[value] : value;

const cities = {
    'Banskobystrický samosprávny kraj': 'Banská Bystrica',
    'Bratislavský samosprávny kraj': 'Bratislava',
    'Košický samosprávny kraj': 'Košice',
    'Nitriansky samosprávny kraj': 'Nitra',
    'Prešovský samosprávny kraj': 'Prešov',
    'Trenčiansky samosprávny kraj': 'Trenčín',
    'Trnavský samosprávny kraj': 'Trnava',
    'Žilinský samosprávny kraj': 'Žilina',
};

export const substituteCity = (value) =>
    has(cities, value) ? cities[value] : value;

export const sortByNumericProp = (prop, asc) => (a, b) =>
    asc ? a[prop] - b[prop] : b[prop] - a[prop];

export const sortBySpending = sortByNumericProp('outgoing', false);

export const sortByDonors = sortByNumericProp('donors', false);

export const imgPath = (filename) => (filename ? imgRootPath + filename : '');

export const removeAccentsFromString = (str) =>
    str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

export const contains = (haystack, needle) =>
    haystack && needle
        ? removeAccentsFromString(haystack.toLowerCase()).includes(
              removeAccentsFromString(needle.toLowerCase())
          )
        : false;

export const setTitle = (title) => {
    document.title = `${title} : Samosprávne voľby 2022 : Transparency International Slovensko`;
};

export const scrollToTop = () => window.scrollTo(0, 0);
