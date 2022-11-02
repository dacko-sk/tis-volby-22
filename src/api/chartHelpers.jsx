import { Link } from 'react-router-dom';

import { labels } from './constants';
import { compareStr, substitute } from './helpers';
import { routes, separators } from './routes';

export const tooltipNameFormat = (value) => {
    const parts = value.split(separators.newline);
    if (parts.length) {
        const nameParts = parts[0].split(separators.parts);
        const tags = [<strong key="name">{nameParts[0]}</strong>];
        parts.forEach((part, index) => {
            if (index > 0) {
                const subParts = part.split(separators.parts);
                const town = subParts.length > 1 ? subParts[1] : part;
                if (town !== '…') {
                    tags.push(<br key={`br${part}`} />);
                    tags.push(<span key={`val${part}`}>{town}</span>);
                }
            }
        });
        return <>{tags}</>;
    }
    return value;
};

export const tickClassName = (i, rows) => {
    // special formatting for candidate names
    if (rows.length > 1 && i === 0) {
        const nameParts = rows[0].split(separators.parts);
        return `name${nameParts.length > 1 ? ` elected` : ''}`;
    }
    // different colors for election types
    if (rows.length === 3 && i === 2) {
        return `cat-${
            rows[2] === labels.elections.regional.name ? 'regional' : 'local'
        }`;
    }
    return '';
};

export const tickLabel = (i, rows) => {
    // create link on first label if there are at least 2 rows
    if (rows.length > 1) {
        const nameParts = rows[0].split(separators.parts);
        const name = nameParts.length > 1 ? nameParts[0] : rows[0];
        const parts = rows[1].split(separators.parts);
        const town = parts.length > 1 ? parts[1] : rows[1];
        const region = parts.length > 1 ? parts[0] : null;
        switch (i) {
            case 0:
                return <Link to={routes.candidate(name, town)}>{name}</Link>;
            case 1:
                return town === '…' ? (
                    town
                ) : (
                    <Link to={routes.municipality(town, region)}>{town}</Link>
                );
            default:
                break;
        }
    }
    return rows[i];
};

export const getTickText = (row, showType) => {
    const n =
        row[labels.elections.name_key] +
        (row.isElected ? `${separators.parts}*` : '');
    const t = showType === true ? separators.newline + row.electionsName : '';
    return (
        n +
        separators.newline +
        row[labels.elections.region_key] +
        separators.parts +
        row.municipalityShortName +
        t
    );
};

export const findTickLink = (name, municipality, type, allAccounts) => {
    const t = type
        ? separators.newline +
          (type === labels.elections.regional.key
              ? labels.elections.regional.name
              : labels.elections.local.name)
        : '';
    let tick = name + separators.newline + substitute(municipality) + t;
    if (Array.isArray(allAccounts)) {
        allAccounts.some((row) => {
            if (
                compareStr(name, row[labels.elections.name_key]) &&
                compareStr(municipality, row[labels.elections.municipality_key])
            ) {
                tick = getTickText(row, true);
                return true;
            }
            return false;
        });
    }
    return tick;
};
