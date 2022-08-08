export const separator = '/';

export const segments = {
    ROOT: '/',
    CHARTS: 'grafy',
    CAMPAIGNS: 'kampane',
    DONORS: 'donori',
    NEWS: 'aktuality',
    ANALYSES: 'hodnotenia',
}

export const routes = {
    home: segments.ROOT,
    charts: segments.ROOT + segments.CHARTS,
    campaigns: segments.ROOT + segments.CHARTS + separator + segments.CAMPAIGNS,
    donors: segments.ROOT + segments.CHARTS + separator + segments.DONORS,
    news: segments.ROOT + segments.NEWS,
    analyses: segments.ROOT + segments.ANALYSES,
    article: (page, slug) => segments.ROOT + page + '/' + slug,
}
