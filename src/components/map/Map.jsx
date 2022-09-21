import { MapContainer, TileLayer } from 'react-leaflet';
import RegionsLayer from './RegionsLayer';

import './Map.scss';

function Map() {
    let height = 400;
    let zoom = 7.5;
    if (window.innerWidth < 992) {
        if (window.innerWidth < 576) {
            height = 250;
            zoom = 6.5;
        } else {
            height = 300;
            zoom = 7.0;
        }
    }
    return (
        <div id="map" className="my-3" style={{ height: `${height}px` }}>
            <MapContainer
                center={[48.68, 19.65]}
                minZoom={6.5}
                maxZoom={12}
                zoom={zoom}
                zoomSnap={0.5}
                zoomDelta={0.5}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                    url="https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFja28iLCJhIjoiY2trd3lybWJnMHBlcjJvbzRxdzY5M2JqMyJ9.pizZabFsumonOfZ-js6RCg"
                    id="dacko/ckkwz2cuz020917oddvwqi641"
                    tileSize={256}
                />
                <RegionsLayer />
            </MapContainer>
        </div>
    );
}

export default Map;
