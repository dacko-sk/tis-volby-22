import parse, { attributesToProps, domToReact } from 'html-react-parser';
import has from 'has';
import { imgRootPath, labels } from './constants';

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

export const shortenValue = (value, length) => {
    if (typeof value === 'string' && value.length > length) {
        return `${value.substring(0, length)}…`;
    }
    return value;
};
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
            // proxy image to force https
            const props = {
                ...attributesToProps(attribs),
                src: proxyHttpImages(attribs.src),
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
        // otherwise no replacement
        return null;
    },
};

export const parseWpHtml = (html) => parse(html, parserOptions);

const replacements = {
    [labels.elections.local.key]: labels.elections.local.name,
    [labels.elections.regional.key]: labels.elections.regional.name,
    'Banskobystrický samosprávny kraj': 'BBSK',
    'Bratislavský samosprávny kraj': 'BSK',
    'Košický samosprávny kraj': 'KSK',
    'Nitriansky samosprávny kraj': 'NSK',
    'Prešovský samosprávny kraj': 'PSK',
    'Trenčiansky samosprávny kraj': 'TSK',
    'Trnavský samosprávny kraj': 'TTSK',
    'Žilinský samosprávny kraj': 'ŽSK',
    BB: 'Banskobystrický kraj',
    BA: 'Bratislavský kraj',
    KE: 'Košický kraj',
    NR: 'Nitriansky kraj',
    PO: 'Prešovský kraj',
    TN: 'Trenčiansky kraj',
    TT: 'Trnavský kraj',
    ZA: 'Žilinský kraj',
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

export const imgPath = (filename) => imgRootPath + filename;

export const removeAccentsFromString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const contains = (haystack, needle) =>
    removeAccentsFromString(haystack.toLowerCase()).includes(
        removeAccentsFromString(needle.toLowerCase())
    );
