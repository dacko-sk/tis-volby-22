import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { usePapaParse } from 'react-papaparse';
import has from 'has';

import { labels } from '../../api/constants';
import { currencyFormat, dateFormat } from '../../api/helpers';

import Loading from './Loading';

const indexColumn = 'index';
const allowedColumns = Object.keys(labels.account);

const formatColumn = (column, value) => {
    switch (column) {
        case 'amount':
            return currencyFormat(value);
        case 'date':
            return dateFormat(value);
        default:
            return value;
    }
};

export const getFileName = (candidate) => {
    if (
        !has(candidate, labels.elections.name_key) ||
        !has(candidate, labels.elections.account_key)
    ) {
        return null;
    }

    const match = candidate[labels.elections.account_key].match(
        /.*(?:SK\d{12})?(\d{10}).*/
    );
    return match && match.length > 1
        ? `/csv/accounts/${candidate[labels.elections.name_key]} ${
              match[1]
          }.csv`
        : null;
};

function AccountTransactions({ candidate }) {
    const file = getFileName(candidate);
    const [transactions, setTransactions] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const { readRemoteFile } = usePapaParse();

    // load data on first load
    useEffect(() => {
        const parserConfig = {
            worker: false,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (data) => {
                setTransactions(data);
            },
        };
        readRemoteFile(file, parserConfig);
    }, []);

    if (!transactions) {
        return <Loading />;
    }

    console.log(transactions);
    const headers = [];
    allowedColumns.forEach((column) => {
        headers.push(<th key={column}>{labels.account[column]}</th>);
    });
    const rows = [];
    transactions.data.every((tx) => {
        if (!showAll && rows.length >= 10) {
            return false;
        }
        const cols = [];
        allowedColumns.forEach((column) => {
            cols.push(<td key={column}>{formatColumn(column, tx[column])}</td>);
        });
        rows.push(<tr key={tx[indexColumn]}>{cols}</tr>);
        return true;
    });

    return (
        <div className="account-transactions">
            <h2 className="mt-4 mb-3">
                Prehľad transakcií na transparentnom účte
            </h2>
            <Table striped bordered responsive hover>
                <thead>
                    <tr>{headers}</tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            {!showAll && (
                <div className="text-center">
                    <Button
                        variant="secondary"
                        onClick={() => setShowAll(true)}
                    >
                        Zobraziť všetky transakcie
                    </Button>
                </div>
            )}
        </div>
    );
}

export default AccountTransactions;
