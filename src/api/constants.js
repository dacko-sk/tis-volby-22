export const img_root_path = '/';

export const color_light_blue = '#2bace2';
export const color_dark_blue = '#1b335f';
export const color_orange = '#f06c50';

export const colors = {
    color_light_blue,
    color_dark_blue,
    color_orange,
}

export const chart_columns = [
    {
        key: "incoming",
        name: "Príjmy",
        color: color_dark_blue
    }, 
    {
      key: "outgoing",
      name: "Výdavky",
      color: color_orange
    }
];

export const labels = {
    elections: {
        type_key: 'typ volieb',
        municipality_key: 'samospráva',
        party_key: 'PS',
        local: {
            key: 'miestne',
            name: 'miestne voľby'
        },
        regional: {
            key: 'župné',
            name: 'župné voľby'
        },
    },
    loading: 'Načítavanie…',
    showMore: 'Zobraziť viac',
}

export const errors = {
    loading: 'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
}

export const constants = {
    colors,
    chart_columns,
    errors,
    labels,
}

export default constants;
