import Top10 from '../components/charts/Top10';
import TotalSpending from '../components/TotalSpending';

function Home() {

  return (
    <section>
      <header>
        <h1 className="my-4 text-uppercase">
          Župné a miestne voľby 2022
        </h1>
      </header>
      <TotalSpending />
      <Top10 />
    </section>
  );
}

export default Home;
