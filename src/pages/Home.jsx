import Alert from 'react-bootstrap/Alert';
import { setTitle } from '../api/helpers';
import { segments } from '../api/routes';
import Top10 from '../components/charts/Top10';
import DonateButton from '../components/general/DonateButton';
import TotalSpending from '../components/general/TotalSpending';
import Map from '../components/map/Map';
import Title from '../components/structure/Title';
import Posts, { templates } from '../components/wp/Posts';
import { analysesCategories } from './Analyses';
import { newsCategories } from './News';

function Home() {
    setTitle('Úvod');

    return (
        <section>
            <Title uppercase secondary="2022">
                Samosprávne
                <br />
                voľby
            </Title>
            <TotalSpending />
            <div className="text-center">
                <DonateButton className="mt-3 mb-3" long xl />
            </div>
            <Map />
            <Top10 />
            <Alert variant="primary" className="mt-4">
                <svg
                    className="bi flex-shrink-0 me-2"
                    width="24"
                    height="24"
                    fill="currentColor"
                    role="img"
                    viewBox="0 0 16 16"
                    aria-label="Info:"
                >
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
                Zverejnili sme nové hodnotenie transparentností kampaní v župách
                a krajských mestách.
            </Alert>
            <Posts
                categories={[analysesCategories.top]}
                noResults="Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne."
                section={segments.ANALYSES}
                showMoreText="Zobraziť všetky hodnotenia"
                template={templates.featured}
            />
            <h2 className="mt-4">Najnovšie aktuality</h2>
            <Posts
                categories={newsCategories}
                limit={2}
                section={segments.NEWS}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
