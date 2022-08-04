import { imgPath } from '../../api/helpers';
import { segments } from '../../api/routes';
import Posts from '../wp/Posts';

function Analyses() {
  return (
    <section>
      <header>
        <h1 className="my-4">
          Hodnotenie transparentnosti kandidátov
        </h1>
      </header>
      <Posts categories={ [859] } page={ segments.ANALYSES } img={ imgPath('politician.png') } />
    </section>
  );
}

export default Analyses;
