export const separator = '/';

export const segments = {
    ROOT: '/',
    CHARTS: 'grafy',
    CAMPAIGNS: 'vsetci-kamdidati',
    NEWS: 'aktuality',
    ANALYSES: 'hodnotenia',
}

export const routes = {
    home: segments.ROOT,
    charts: segments.ROOT + segments.CHARTS,
    campaigns: segments.ROOT + segments.CHARTS + separator + segments.CAMPAIGNS,
    news: segments.ROOT + segments.NEWS,
    analyses: segments.ROOT + segments.ANALYSES,
    article: (page, slug) => segments.ROOT + page + '/' + slug,
}
