import Posts from '../wp/Posts';

function News() {
  return (
    <section>
      <header>
        <h1>
          Aktuality
        </h1>
      </header>
      <Posts categories={ [858] } slug="aktuality" img="news.png" />
    </section>
  );
}

export default News;
