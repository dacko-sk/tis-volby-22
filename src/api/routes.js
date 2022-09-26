export const separator = '/';

export const segments = {
    ANALYSES: 'hodnotenia',
    CAMPAIGNS: 'kampane',
    CANDIDATE: 'kandidat',
    CHARTS: 'grafy',
    DONORS: 'donori',
    NEWS: 'aktuality',
    REGION: 'kraj',
    ROOT: '/',
    SEARCH: 'vyhladavanie',
};

export const routes = {
    analyses: segments.ROOT + segments.ANALYSES,
    article: (page, slug) =>
        segments.ROOT + (page && slug ? page + separator + slug : ''),
    articles: (page) => segments.ROOT + (page || ''),
    campaigns: segments.ROOT + segments.CHARTS + separator + segments.CAMPAIGNS,
    candidate: (name, town) =>
        segments.ROOT +
        (name && town
            ? segments.CANDIDATE +
              separator +
              encodeURIComponent(
                  `${name.replaceAll(' ', '.')}~${town.replaceAll(' ', '.')}`
              )
            : ''),
    charts: segments.ROOT + segments.CHARTS,
    donors: segments.ROOT + segments.CHARTS + separator + segments.DONORS,
    home: segments.ROOT,
    news: segments.ROOT + segments.NEWS,
    region: (region) =>
        segments.ROOT + (region ? segments.REGION + separator + region : ''),
    search: (query) =>
        segments.ROOT + (query ? segments.SEARCH + separator + query : ''),
};
