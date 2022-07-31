import parse, { attributesToProps, domToReact } from 'html-react-parser';

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

export const shortChartNames = (name) => {
    return shortenValue(name, 30);
};

export const shortenValue = (value, length) => {
    if (typeof value === "string" && value.length > length) {
        return value.substring(0, length) + "…";
    }
    return value;
};

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
