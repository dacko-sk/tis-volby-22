export const imgRootPath = '/img/';

export const images = {
    analyses: 'user_grey.png',
    news: 'news.png',
};

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

export const transparencyClasses = {
    good: 'good',
    average: 'average',
    bad: 'bad',
};

export const labels = {
    disclaimerAccount: 'Príjmy aj výdavky sú očistené o vrátené platby.',
    disclaimerCandidate:
        'Kandidát(ka), ktorý(á) na financovanie kampane využíva stranícky účet, viacero účtov alebo účet nemá a vizualizáciu príjmov a výdavkov preto nie je možné zobraziť.',
    disclaimerParties:
        'Zoznam ďalších kandidátov, ktorí na financovanie kampaní využívajú stranícke účty, viacero účtov alebo účty nemajú a vizualizáciu ich príjmov a výdavkov preto nie je možné zobraziť. Podrobnosti nájdete po rozkliknutí mena kandidáta. Kandidátov postupne dopĺňame.',
    elections: {
        type_key: 'typ volieb',
        municipality_key: 'samospráva',
        party_key: 'PS',
        region_key: 'label',
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
            'Grafy obsahujú iba dáta z transparentných účtov evidovaných podľa zákona na webe ministerstva vnútra a sú očistené o vrátené platby.',
        updated: 'Naposledy aktualizované',
        incoming: 'Príjmy',
        outgoing: 'Výdavky',
        uniqeDonors: 'Počet unikátnych darcov',
    },
    indicators: {
        account: {
            title: 'Transparentný účet',
            criteria: [
                'kandidát má osobitný účet (nevedie kampaň cez stranícky účet)',
                'zobrazuje platcov a príjemcov (základná zákonná podmienka)',
                'účet vedie dostatočne podrobne (vyhýba sa veľkým súhrnným platbám)',
                'popisuje výdavky na kampaň (obsahuje zrozumiteľné poznámky k platbám)',
                'zachytáva kampaň v reálnom čase (nevyužíva faktúry s dlhou dobou splatnosti)',
                'zachytáva aj výdavky pred začiatkom oficiálnej kampane',
                'kampaň je diverzifikovaná (nie je postavená na malom počte veľkých prispievateľov)',
            ],
        },
        financing: {
            title: 'Financovanie kampane',
            criteria: [
                'hodnovernosť prispievateľov (finančné pozadie umožňuje príspevok v danej výške)',
                'zverejnený plán kampane (plánovanej veľkosti, štruktúry, spôsobu financovania)',
                'vytvoril volebný web (existencia a kvalita)',
                'zverejnil volebný program (respektíve aspoň náznaky volebného programu)',
            ],
        },
        information: {
            title: 'Informovanosť o kampani',
            criteria: [
                'ponúka funkčný kontakt (kandidát reagoval na zaslanú otázku)',
                'dbá na označovanie kampane (označovanie volebnej inzercie – bilbordy, online, tlač)',
                'uvádza tvorcov kampane ( členov volebného tímu, agentúry), informuje o volebných akciách',
            ],
        },
    },
    municipality: 'Samospráva',
    name: 'Meno',
    parties: {
        account_personal_key: 'account',
        account_party_key: 'party_account',
        municipality_key: 'samospráva_right',
        party_key: 'party',
        region_key: 'label_right',
        type_key: 'typ volieb_right',
    },
    party: 'Strana / koalícia',
    transparency: {
        [transparencyClasses.good]: 'transparentná kampaň',
        [transparencyClasses.average]: 'kampaň s výhradami',
        [transparencyClasses.bad]: 'netransparentná kampaň',
    },
    score: ['nezistené/netýka sa', 'áno', 'čiastočne', 'nie'],
    search: 'Vyhľadávanie',
    showMore: 'Zobraziť viac',
    type: 'Typ volieb',
};

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
};

export const constants = {
    colors,
    errors,
    images,
    labels,
    transparencyClasses,
};

export default constants;
