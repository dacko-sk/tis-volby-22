import parse, { attributesToProps, domToReact } from 'html-react-parser';

export const numFormatSk = (value) => new Intl.NumberFormat('sk').format(value);

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
        } else if (domNode.name === 'a' && domNode.attribs && domNode.attribs.rel && domNode.attribs.rel.startsWith('lightbox')) {
            // remove lightbox links
            return domToReact(domNode.children);
        }
    }
});

const proxyHttpImages = (html) => {
    const regex = /(http:\/\/cms.transparency.sk\/[^",]+.(png|jpe?g|gif|svg))/i;
    return html.replace(regex, 'https://images.weserv.nl/?url=$1');
}