import parse, { attributesToProps, domToReact } from 'html-react-parser';
import has from 'has';
import { img_root_path, labels } from './constants';

export const numFormat = (value) => slovakFormat(value, {});

export const wholeNumFormat = (value) => slovakFormat(value, {
    maximumFractionDigits: 0
});

export const currencyFormat = (value) => slovakFormat(value, {
    style: 'currency', 
    currency: 'EUR', 
});

export const wholeCurrencyFormat = (value) => slovakFormat(value, {
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0
});

export const slovakFormat = (value, options) => new Intl.NumberFormat('sk-SK', options).format(value);

export const shortenValue = (value, length) => {
    if (typeof value === "string" && value.length > length) {
        return value.substring(0, length) + "…";
    }
    return value;
};
export const dateFormat = (timestamp) => new Intl.DateTimeFormat('sk-SK', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric'
}).format(new Date(1000 * timestamp));

export const parseWpHtml = (html) => parse(html, {
    replace: domNode => {
        if (domNode.name === 'img' && domNode.attribs && domNode.attribs.src) {
            // proxy image to force https
            const props = {
                ...attributesToProps(domNode.attribs),
                src: proxyHttpImages(domNode.attribs.src)
            };
            return <img {...props} />;
        } else if (domNode.name === 'a') {
            if (domNode.attribs && domNode.attribs.rel && domNode.attribs.rel.startsWith('lightbox')) {
                // remove lightbox links
                return domToReact(domNode.children);
            } else if (domNode.children.length && domNode.children[0].type === 'text' && domNode.children[0].data.startsWith('Continue reading')) {
                // remove "continue reading" links to WP domain
                return <></>
            }
        }
    }
});

const proxyHttpImages = (html) => {
    const regex = /(http:\/\/cms.transparency.sk\/[^",]+.(png|jpe?g|gif|svg))/i;
    return html.replace(regex, 'https://images.weserv.nl/?url=$1');
}

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
    'BB': 'Banskobystrický kraj',
    'BA': 'Bratislavský kraj',
    'KE': 'Košický kraj',
    'NR': 'Nitriansky kraj',
    'PO': 'Prešovský kraj',
    'TN': 'Trenčiansky kraj',
    'TT': 'Trnavský kraj',
    'ZA': 'Žilinský kraj',
};

export const replace = (value) => has(replacements, value) ? replacements[value] : value;

export const sortByNumericProp = (prop) => (a, b) => b[prop] - a[prop];

export const sortBySpending = sortByNumericProp('outgoing');

export const imgPath = (filename) => img_root_path + filename;
