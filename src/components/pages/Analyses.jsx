import Posts from '../wp/Posts';

function Analyses() {
  return (
    <section>
      <header>
        <h1>
          Hodnotenie transparentnosti kandidátov
        </h1>
      </header>
      <Posts categories={ [859] } slug="hodnotenia" />
    </section>
  );
}

export default Analyses;
