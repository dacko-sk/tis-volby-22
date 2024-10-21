export const colorLightBlue = '#2bace2';
export const colorDarkBlue = '#1b335f';
export const colorOrange = '#f06c50';
export const colorGrey = '#e9f2f9';

export const colors = {
    colorLightBlue,
    colorDarkBlue,
    colorOrange,
    colorGrey,
};

export const elections = {
    e24: 'e24',
    p24: 'p24',
    n23: 'n23',
    s22: 's22',
    n20: 'n20',
    p19: 'p19',
};

export const campaignMetadata = {
    type: 'type',
    municipality: 'municipality',
    support: 'support',
    fb: 'fb',
    web: 'web',
    date: 'date',
    score: 'score',
};

export const transparencyClasses = {
    good: 'good',
    average: 'average',
    bad: 'bad',
    unknown: 'unknown',
};

export const transparencyIndicators = {
    account: 'account',
    financing: 'financing',
    information: 'information',
};

export const labels = {
    account: {
        account_name: 'Názov účtu',
        date: 'Dátum',
        amount: 'Suma',
        // currency: 'Mena',
        message: 'Popis platby',
        tx_type: 'Druh platby',
        vs: 'VS',
        ss: 'ŠS',
    },
    ads: {
        amount: {
            key: 'total_ad_count',
            title: 'Všetky sponzorované príspevky',
        },
        amount_tagged: {
            key: 'total_ads_tagged',
            title: 'Označená politická reklama',
        },
        amount_untagged: {
            key: 'total_ads_missing_attribution',
            title: 'Nesprávne označená politická reklama',
        },
        municipality: {
            key: 'municipality',
        },
        name_first: {
            key: 'firstname',
        },
        name_last: {
            key: 'lastname',
        },
        spending: {
            key: 'total_spend',
            title: 'Výdavky na FB reklamu',
        },
        type: {
            key: 'type',
        },
    },
    analysis: 'Celkové hodnotenie',
    analysisDate: 'Hodnotenie ku dňu',
    disclaimerAccount: 'Príjmy aj výdavky sú očistené o vrátené platby.',
    disclaimerCandidate:
        'Kandidát(ka), ktorý(á) na financovanie kampane využíva stranícky účet, viacero účtov alebo účet nemá a vizualizáciu príjmov a výdavkov preto nie je možné zobraziť.',
    disclaimerParties:
        'Zoznam ďalších kandidátov, ktorí na financovanie kampaní využívajú stranícke účty, viacero účtov alebo účty nemajú a vizualizáciu ich príjmov a výdavkov preto nie je možné zobraziť. Podrobnosti nájdete po rozkliknutí mena kandidáta. Kandidátov postupne dopĺňame.',
    donate: 'Darujte',
    donateLong: 'Darujte na kontrolu volieb',
    elections: {
        [elections.p19]: 'Prezidentské\nvoľby 2019',
        [elections.n20]: 'Parlamentné\nvoľby 2020',
        [elections.s22]: 'Samosprávne\nvoľby 2022',
        [elections.n23]: 'Parlamentné\nvoľby 2023',
        [elections.e24]: 'Európske\nvoľby 2024',
        [elections.p24]: 'Prezidentské\nvoľby 2024',
        account_key: 'url',
        name_key: 'name',
        municipality_key: 'samosprava',
        party_key: 'PS',
        region_key: 'label',
        result_key: 'vysledok',
        result: {
            success: 'zvolený',
            failure: 'nezvolený',
        },
        type_key: 'typ_volieb',
        local: {
            key: 'miestne',
            name: 'Miestne voľby',
        },
        regional: {
            key: 'župné',
            name: 'Župné voľby',
        },
    },
    fb: 'FB profil',
    charts: {
        disclaimer:
            'Grafy obsahujú iba dáta z transparentných účtov evidovaných podľa zákona na webe ministerstva vnútra a niektoré manuálne dohľadané účty. Dáta sú očistené o vrátené platby.',
        updated: 'Naposledy aktualizované',
        incoming: 'Príjmy',
        outgoing: 'Výdavky',
        uniqeDonors: 'Počet unikátnych darcov',
    },
    home: { navTitle: 'Voľby 2022' },
    indicators: {
        [transparencyIndicators.account]: {
            title: 'Transparentný účet',
            criteria: [
                'existencia samostatného účtu',
                'oznamovacia povinnosť',
                'označovanie platcov a príjemcov',
                'podrobnosť účtu',
                'popisovanie výdavkov',
                'časová reálnosť výdavkov',
            ],
        },
        [transparencyIndicators.financing]: {
            title: 'Financovanie kampane',
            criteria: [
                'viaczdrojovosť',
                'nezávislosť od veľkých darov',
                'informovanie o predkampani',
                'plán kampane',
            ],
        },
        [transparencyIndicators.information]: {
            title: 'Informovanosť o kampani',
            criteria: [
                'existencia webu',
                'volebný program',
                'responzívnosť uvedeného kontaktu',
                'kampaňový tím/spolupracujúce agentúry',
                'predvolebné akcie',
                'označovanie inzercie',
            ],
        },
    },
    municipality: 'Samospráva',
    name: 'Meno',
    parties: {
        account_party_key: 'stranicky_ucet',
        party_key: 'strana',
        region_key: 'label_right',
    },
    party: 'Strana / koalícia',
    reports: {
        label: 'Záverečná správa',
        link_key: 'link',
        name_key: 'name',
        region_key: 'region',
        title_key: 'title',
    },
    root: 'Titulná stránka',
    transparency: {
        [transparencyClasses.good]: 'transparentná kampaň',
        [transparencyClasses.average]: 'kampaň s výhradami',
        [transparencyClasses.bad]: 'netransparentná kampaň',
        [transparencyClasses.unknown]: 'nedostatok dát / nehodnotené',
    },
    transparencyShort: {
        [transparencyClasses.good]: 'transparentná',
        [transparencyClasses.average]: 's výhradami',
        [transparencyClasses.bad]: 'netransparentná',
        [transparencyClasses.unknown]: 'N/A',
    },
    score: ['nezistené/netýka sa', 'áno', 'čiastočne', 'nie'],
    search: 'Vyhľadávanie',
    showMore: 'Zobraziť viac',
    type: 'Typ volieb',
    web: 'Volebný web',
};

export const links = {
    [elections.p19]: '/prezident2019/',
    [elections.n20]: '/parlament2020/',
    [elections.s22]: '/samosprava2022/',
    [elections.n23]: '/parlament2023/',
    [elections.p24]: '/prezident2024/',
    [elections.e24]: '/euro2024/',
    donateUrl: 'https://transparency.sk/volby',
};

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
};

export const constants = {
    campaignMetadata,
    colors,
    errors,
    labels,
    transparencyClasses,
    transparencyIndicators,
};

export default constants;
