import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import has from 'has';
import { labels } from '../api/constants';
import { replace } from '../api/helpers';
import { routes } from '../api/routes';
import Loading from '../components/Loading';
import useData from '../context/DataContext';

function Candidate() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { csvData } = useData();

  // parse data
  let candidate = null;
  if (has(csvData, 'data')) {
    for (const row of csvData.data) {
      const key = routes.candidate(row.name, replace(row[labels.elections.municipality_key] ?? '…'));
      if (pathname === key) {
        candidate = row;
        break;
      }
    }
  }

  useEffect(() => {
    if (!candidate && has(csvData, 'data')) {
      // redirect to parent page (all articles) in case article does not exist in API
      navigate(routes.home);
    }
  }, [candidate, csvData, navigate]);

  if (!candidate || !has(csvData, 'data')) {
    return <Loading />
  }

  return (
    <section className="candidate-page">
      <header>
        <h1 className="my-4">
          { candidate.name }
        </h1>
      </header>
      <div>
        <table>
          <tbody>
            <tr>
              <td>Typ volieb</td>
              <td>{ replace(candidate[labels.elections.type_key] ?? labels.elections.local.key) }</td>
            </tr>
            <tr>
              <td>Samospráva</td>
              <td>{ (candidate[labels.elections.municipality_key] ?? '…') }</td>
            </tr>
            <tr>
              <td>Kraj</td>
              <td>{ replace(candidate.label) }</td>
            </tr>
            <tr>
              <td>{ labels.charts.incoming }</td>
              <td>{ candidate.sum_incoming }</td>
            </tr>
            <tr>
              <td>{ labels.charts.outgoing }</td>
              <td>{ candidate.sum_outgoing }</td>
            </tr>
            <tr>
              <td>Bilancia</td>
              <td>{ candidate.balance }</td>
            </tr>
            <tr>
              <td>Počet prijatých platieb</td>
              <td>{ candidate.num_incoming }</td>
            </tr>
            <tr>
              <td>Počet odchádzajúcich platieb</td>
              <td>{ candidate.num_outgoing }</td>
            </tr>
            <tr>
              <td>{ labels.charts.uniqeDonors }</td>
              <td>{ candidate.num_unique_donors }</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Candidate;
