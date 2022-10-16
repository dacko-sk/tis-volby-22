export const separators = {
    newline: '\n',
    parts: '~',
    space: '.',
    url: '/',
};

export const segments = {
    ANALYSES: 'hodnotenia',
    CAMPAIGNS: 'kampane',
    CANDIDATE: 'kandidat',
    CHARTS: 'grafy',
    DONORS: 'donori',
    FACEBOOK: 'fb',
    MUNICIPALITY: 'samosprava',
    NEWS: 'aktuality',
    REGION: 'kraj',
    ROOT: '/',
    SEARCH: 'vyhladavanie',
};

export const routes = {
    analyses: segments.ROOT + segments.ANALYSES,
    article: (page, slug) =>
        segments.ROOT + (page && slug ? page + separators.url + slug : ''),
    articles: (page) => segments.ROOT + (page || ''),
    campaigns:
        segments.ROOT + segments.CHARTS + separators.url + segments.CAMPAIGNS,
    candidate: (name, town) =>
        segments.ROOT +
        (name && town
            ? segments.CANDIDATE +
              separators.url +
              encodeURIComponent(
                  name.replaceAll(' ', separators.space) +
                      separators.parts +
                      town.replaceAll(' ', separators.space)
              )
            : ''),
    charts: segments.ROOT + segments.CHARTS,
    donors: segments.ROOT + segments.CHARTS + separators.url + segments.DONORS,
    facebook:
        segments.ROOT + segments.CHARTS + separators.url + segments.FACEBOOK,
    home: segments.ROOT,
    municipality: (town, region) => {
        const reg = region
            ? region.replaceAll(' ', separators.space) + separators.parts
            : '';
        return (
            segments.ROOT +
            (town
                ? segments.MUNICIPALITY +
                  separators.url +
                  encodeURIComponent(
                      reg + town.replaceAll(' ', separators.space)
                  )
                : '')
        );
    },
    news: segments.ROOT + segments.NEWS,
    region: (region) =>
        segments.ROOT +
        (region ? segments.REGION + separators.url + region : ''),
    search: (query) =>
        segments.ROOT + (query ? segments.SEARCH + separators.url + query : ''),
};
