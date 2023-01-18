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
                url="https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=ca1iLUQfXoVna4YdmXyHnKcBHsR1otiY3JchCZ6nzGg8sWvaQaWjTbneuWAZD4vC"
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
