import { GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { routes } from '../../api/routes';

const styles = {
    regular: {
        color: '#aaa',
        dashArray: '3',
        fillOpacity: 0.65,
        fillColor: '#2bace2',
        opacity: 1,
        weight: 2,
    },
    hover: {
        color: '#666',
        dashArray: '',
        fillOpacity: 0.65,
        fillColor: '#f06c50',
        weight: 5,
    },
};

function RegionsLayer() {
    const navigate = useNavigate();

    const featureOver = (mouseEvent) => {
        const layer = mouseEvent.target;
        layer.setStyle(styles.hover);

        // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
        // }
    };

    const featureOut = (mouseEvent) => {
        const layer = mouseEvent.target;
        layer.setStyle(styles.regular);

        // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToBack();
        // }
    };

    const featureClick = (pointerEvent) => {
        navigate(routes.region(pointerEvent.target.feature.properties.code));
    };

    const onEach = (feature, layer) => {
        const label = ['BA', 'NR', 'TN', 'TT'].includes(feature.properties.code)
            ? feature.properties.name.replace(' ', '<br/>')
            : feature.properties.name;
        let offset = [0, 0];
        switch (feature.properties.code) {
            case 'BA':
                offset = [5, 10];
                break;
            case 'NR':
            case 'TN':
                offset = [0, 5];
                break;
            case 'TT':
                offset = [10, -30];
                break;
            default:
                break;
        }
        layer.bindTooltip(`<strong>${label}</strong>`, {
            direction: 'center',
            offset,
            permanent: true,
        });
        layer.on({
            mouseover: featureOver,
            mouseout: featureOut,
            click: featureClick,
        });
    };

    const { isLoading, error, data } = useQuery(['regionsGeoJSON'], () =>
        fetch('/json/regions.geojson').then((res) => res.json())
    );
    if (isLoading || error) return null;

    // render react-leaflet GeoJSON when the data is ready
    return (
        <GeoJSON
            data={data}
            onEachFeature={onEach}
            pathOptions={styles.regular}
        />
    );
}

export default RegionsLayer;
