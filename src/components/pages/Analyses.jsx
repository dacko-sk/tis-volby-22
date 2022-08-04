import { imgPath } from '../../api/helpers';
import Posts from '../wp/Posts';

function Analyses() {
  return (
    <section>
      <header>
        <h1 className="my-4">
          Hodnotenie transparentnosti kandidátov
        </h1>
      </header>
      <Posts categories={ [859] } slug="hodnotenia" img={ imgPath('politician.png') } />
    </section>
  );
}

export default Analyses;
