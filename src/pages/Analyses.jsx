import Alert from 'react-bootstrap/Alert';
import { segments } from '../api/routes';
import Posts from '../components/wp/Posts';

function Analyses() {
  return (
    <section>
      <header className="mb-4">
        <h1>
          Hodnotenie transparentnosti kandidátov
        </h1>
      </header>
      <Alert variant="secondary">
        Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne.
      </Alert>
      <Posts categories={ [859] } page={ segments.ANALYSES } img="politician.png" />
    </section>
  );
}

export default Analyses;
