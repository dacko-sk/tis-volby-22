import parse, { attributesToProps, domToReact } from 'html-react-parser';

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