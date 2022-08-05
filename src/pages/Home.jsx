import Top10 from '../components/charts/Top10';
import Regions from '../components/Regions';
import TotalSpending from '../components/TotalSpending';

function Home() {

  return (
    <section>
      <header>
        <h1 className="my-4 text-uppercase">
          Komunálne a župné voľby 2022
        </h1>
      </header>
      <TotalSpending />
      <Top10 />
      <Regions />
    </section>
  );
}

export default Home;
