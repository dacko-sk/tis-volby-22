export const imgRootPath = '/img/';

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
    disclaimerParties:
        '* kandidát/ka bez transparentného účtu evidovaného na MV alebo s kampaňou financovanou z účtu politickej strany',
    elections: {
        type_key: 'typ volieb',
        municipality_key: 'samospráva',
        party_key: 'PS',
        local: {
            key: 'miestne',
            name: 'Miestne voľby',
        },
        regional: {
            key: 'župné',
            name: 'Župné voľby',
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
    parties: {
        account_personal_key: 'account',
        account_party_key: 'party_account',
        municipality_key: 'area/city',
        party_key: 'party',
    },
    search: 'Vyhľadávanie',
    showMore: 'Zobraziť viac',
};

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
};

export const constants = {
    colors,
    errors,
    labels,
};

export default constants;
