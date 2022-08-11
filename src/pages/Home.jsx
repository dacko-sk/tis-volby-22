import Top10 from '../components/charts/Top10';
import TotalSpending from '../components/TotalSpending';

function Home() {

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-uppercase">
          Samosprávne
          <br />
          voľby <span className="orange">2022</span>
        </h1>
      </header>
      <TotalSpending />
      <Top10 />
    </section>
  );
}

export default Home;
