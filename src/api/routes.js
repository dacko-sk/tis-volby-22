export const segments = {
    ROOT: '/',
    CHARTS: 'grafy',
    NEWS: 'aktuality',
    ANALYSES: 'hodnotenia',
}

export const routes = {
    home: segments.ROOT,
    cherts: segments.ROOT + segments.CHARTS,
    news: segments.ROOT + segments.NEWS,
    analyses: segments.ROOT + segments.ANALYSES,
    article: (page, slug) => segments.ROOT + page + '/' + slug,
}
