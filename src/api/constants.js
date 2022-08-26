export const imgRootPath = '/img/';
export const gaTrackingId = 'UA-134559494-1';

export const colorLightBlue = '#2bace2';
export const colorDarkBlue = '#1b335f';
export const colorOrange = '#f06c50';

export const colors = {
    colorLightBlue,
    colorDarkBlue,
    colorOrange,
};

export const labels = {
    disclaimerAccount: 'Príjmy aj výdavky sú očistené o vrátené platby.',
    elections: {
        type_key: 'typ volieb',
        municipality_key: 'samospráva',
        party_key: 'PS',
        local: {
            key: 'miestne',
            name: 'miestne voľby',
        },
        regional: {
            key: 'župné',
            name: 'župné voľby',
        },
    },
    charts: {
        disclaimer:
            'Grafy obsahujú iba dáta z transparentných účtov evidovaných podľa zákona na webe ministerstva vnútra a sú očistené o vrátené platby.',
        updated: 'Naposledy aktualizované',
        incoming: 'Príjmy',
        outgoing: 'Výdavky',
        uniqeDonors: 'Počet unikátnych darcov',
    },
    showMore: 'Zobraziť viac',
};

export const charts = {
    columns: {
        inOut: [
            {
                key: 'outgoing',
                name: labels.charts.outgoing,
                color: colorOrange,
            },
            {
                key: 'incoming',
                name: labels.charts.incoming,
                color: colorDarkBlue,
            },
        ],
        donors: [
            {
                key: 'num_unique_donors',
                name: labels.charts.uniqeDonors,
                color: colorDarkBlue,
            },
        ],
    },
};

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
};

export const constants = {
    colors,
    charts,
    errors,
    labels,
};

export default constants;
