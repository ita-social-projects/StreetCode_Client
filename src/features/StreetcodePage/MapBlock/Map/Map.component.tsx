import './Map.styles.scss';

import { MapContainer, TileLayer } from 'react-leaflet';
import CustomMarker from "@streetcode/MapBlock/Map/Marker/MarkerWrapper.component";
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Toponym from '@/models/toponyms/toponym.model';
import MarkerClusterGroup from 'react-leaflet-cluster'

const defaultZoom: number = 6;
const centerOfUkraine = {
    latitude: 48.4501,
    longtitude: 31.3234
}

interface Props {
    streetcodeCoordinates: StreetcodeCoordinate[],
    toponyms: Toponym[]
}

const MapOSM = ({streetcodeCoordinates, toponyms}: Props) => (
    <div className='mapCentered'>
        <MapContainer center={[centerOfUkraine.latitude, centerOfUkraine.longtitude]} zoom={defaultZoom} className={'mapContainer'}>
            <TileLayer
                url="https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=zAHwa6HifYRoNEDddsNn"
            />
            <MarkerClusterGroup>
                {streetcodeCoordinates?.map(sc => <CustomMarker latitude={sc.latitude} longtitude={sc.longtitude} title={String(sc.id)} description={String(sc.streetcodeId)}/>)}
            </MarkerClusterGroup>
            <MarkerClusterGroup>
                {toponyms?.map(t => t.coordinates.map(c =>
            <CustomMarker latitude={c.latitude} longtitude={c.longtitude} title={String(c.id)} description={String(c.toponymId)}/>))}
            </MarkerClusterGroup>
        </MapContainer>
    </div>
);

export default MapOSM;
