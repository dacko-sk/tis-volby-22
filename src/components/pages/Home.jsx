import Top10 from '../charts/Top10';
import TotalSpending from '../charts/TotalSpending';

function Home() {

  return (
    <section>
      <header>
        <h1 className="my-4">
          Komunálne a župné voľby 2022
        </h1>
      </header>
      <TotalSpending />
      <Top10 />
    </section>
  );
}

export default Home;
