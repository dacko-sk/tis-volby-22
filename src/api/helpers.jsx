import parse, { attributesToProps, domToReact } from 'html-react-parser';
import has from 'has';
import {
    campaignMetadata,
    labels,
    transparencyClasses,
    transparencyIndicators,
} from './constants';

export const slovakFormat = (value, options) =>
    new Intl.NumberFormat('sk-SK', options).format(value);

export const numFormat = (value) => slovakFormat(value, {});

export const pctFormat = (value) => {
    const num = Number(value);
    if (!Number.isNaN(num)) {
        return `${numFormat(num)} %`;
    }
    return '';
};

export const badgePctFormat = (value) =>
    Number(value) > -1 ? pctFormat(value) : 'N/A';

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

export const fixUrl = (url) =>
    url.startsWith('http') ? url : `https://${url}`;

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
                            const val = col
                                .replaceAll('<td>', '')
                                .replaceAll(/<a[^>]*>/g, '')
                                .replaceAll(/<\/a>/g, '');
                            const num = Number(val.replaceAll(',', '.'));
                            cols.push(
                                !val || Number.isNaN(num)
                                    ? ecodeHTMLEntities(val)
                                    : num
                            );
                        }
                    });
                    tableData.push(cols);
                });

            const baseProps = Object.keys(campaignMetadata);
            let required = baseProps.length;
            Object.keys(transparencyIndicators).forEach((group) => {
                required += labels.indicators[group].criteria.length;
            });

            if (tableData.length >= required) {
                const analysis = {};
                let rowKey = 0;

                // base campaign data
                baseProps.forEach((prop) => {
                    // numeric check for score row - set to minus 1 (unknown) if score is not numeric
                    if (prop === campaignMetadata.score) {
                        tableData[rowKey].forEach((column, columnKey) => {
                            const num = Number(column);
                            if (Number.isNaN(num)) {
                                tableData[rowKey][columnKey] = -1;
                            }
                        });
                    }
                    analysis[prop] = tableData[rowKey];
                    rowKey += 1;
                });

                // transparency analysis indicators
                Object.keys(transparencyIndicators).forEach((group) => {
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
    let cls = transparencyClasses.unknown;
    const num = Number(score);
    if (!Number.isNaN(num) && num > -1) {
        cls = transparencyClasses.bad;
        if (score >= 40) {
            cls =
                score >= 70
                    ? transparencyClasses.good
                    : transparencyClasses.average;
        }
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
    BB: 'Banská Bystrica',
    BA: 'Bratislava',
    KE: 'Košice',
    NR: 'Nitra',
    PO: 'Prešov',
    TN: 'Trenčín',
    TT: 'Trnava',
    ZA: 'Žilina',
    'Banskobystrický samosprávny kraj': 'Banská Bystrica',
    'Bratislavský samosprávny kraj': 'Bratislava',
    'Košický samosprávny kraj': 'Košice',
    'Nitriansky samosprávny kraj': 'Nitra',
    'Prešovský samosprávny kraj': 'Prešov',
    'Trenčiansky samosprávny kraj': 'Trenčín',
    'Trnavský samosprávny kraj': 'Trnava',
    'Žilinský samosprávny kraj': 'Žilina',
};

export const regionalCity = (value) =>
    has(cities, value) ? cities[value] : value;

/**
 * Break text separated by newline character to react fragments separated with <br/> tag
 */
export const nl2r = (text) =>
    typeof text === 'string' && text.includes('\n')
        ? text.split('\n').map((fragment, index) => {
              const k = `${index}${fragment}`;
              return (
                  <span key={k}>
                      {index > 0 && <br />}
                      {fragment}
                  </span>
              );
          })
        : text;

export const sortByNumericProp = (prop, asc) => (a, b) =>
    asc ? a[prop] - b[prop] : b[prop] - a[prop];

export const sortBySpending = sortByNumericProp('outgoing', false);

export const sortByDonors = sortByNumericProp('donors', false);

export const removeAccentsFromString = (str) =>
    str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

export const compareStr = (a, b) =>
    a &&
    b &&
    removeAccentsFromString(a.toLowerCase().trim()) ===
        removeAccentsFromString(b.toLowerCase().trim());

export const contains = (haystack, needle) =>
    haystack &&
    needle &&
    removeAccentsFromString(haystack.toLowerCase()).includes(
        removeAccentsFromString(needle.toLowerCase().trim())
    );

export const swapName = (name) => {
    const [first, second] = name.split(' ');
    return first && second ? `${second} ${first}` : name;
};

export const setTitle = (title) => {
    document.title = `${title} : Samosprávne voľby 2022 : Transparency International Slovensko`;
};

export const scrollToTop = () => window.scrollTo(0, 0);
