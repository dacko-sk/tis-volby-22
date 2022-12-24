import { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';

import { labels } from '../../api/constants';
import { compareStr, contains, swapName } from '../../api/helpers';

function FinalReportRow({ candidate }) {
    const [reports, setReports] = useState(null);
    const { readRemoteFile } = usePapaParse();

    // load data on first load
    useEffect(() => {
        const parserConfig = {
            worker: false,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (data) => {
                setReports(data);
            },
        };
        readRemoteFile('/csv/final_reports.csv', parserConfig);
    }, []);

    if (!reports) {
        return null;
    }

    let report = null;
    reports.data.some((row) => {
        if (
            compareStr(
                candidate[labels.elections.region_key],
                row[labels.reports.region_key]
            ) &&
            (contains(
                row[labels.reports.title_key],
                candidate[labels.elections.name_key]
            ) ||
                compareStr(
                    row[labels.reports.name_key],
                    candidate[labels.elections.name_key]
                ) ||
                compareStr(
                    swapName(row[labels.reports.name_key]),
                    candidate[labels.elections.name_key]
                ))
        ) {
            report = row;
            return true;
        }
        return false;
    });

    return report ? (
        <tr>
            <td>{labels.reports.label}</td>
            <td>
                <a
                    href={report[labels.reports.link_key]}
                    target="_blank"
                    rel="noreferrer"
                >
                    {report[labels.reports.title_key]}
                </a>
            </td>
        </tr>
    ) : null;
}

export default FinalReportRow;
