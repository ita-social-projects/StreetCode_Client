import './Map.styles.scss';

import { observer } from 'mobx-react-lite';
import { MapContainer, TileLayer } from 'react-leaflet';
import CustomMarker from '@streetcode/MapBlock/Map/Marker/MarkerWrapper.component';

import useMobx from '@/app/stores/root-store';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Toponym from '@/models/toponyms/toponym.model';

import CustomMarkerCluster from './MarkerCluster/MarkerClusterWrapper.component';

const defaultZoom = 6;
const centerOfUkraine = {
    latitude: 48.4501,
    longtitude: 31.3234,
};

interface Props {
    streetcodeCoordinates: StreetcodeCoordinate[],
    toponyms: Toponym[]
}

const MapOSM = ({ streetcodeCoordinates, toponyms }: Props) => {
    const { checkboxStore } = useMobx();
    const { checkBoxesState: { streetcodes, streets } } = checkboxStore;

    return (
        <div className="mapCentered">
            <MapContainer center={[centerOfUkraine.latitude, centerOfUkraine.longtitude]} zoom={defaultZoom} className="mapContainer" scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
                />
                {streetcodes?.isActive && (
                    <CustomMarkerCluster>
                        {streetcodeCoordinates?.map((sc) => <CustomMarker latitude={sc.latitude} longtitude={sc.longtitude} title={String(sc.id)} description={String(sc.streetcodeId)} />)}
                    </CustomMarkerCluster>
                )}
                {streets?.isActive && (
                    <CustomMarkerCluster>
                        {toponyms?.map((t) => <CustomMarker latitude={t.coordinate?.latitude} longtitude={t.coordinate?.longtitude} title={String(t.id)} description={`${t.streetType} ${t.streetName}`} />)}
                    </CustomMarkerCluster>
                )}
            </MapContainer>
        </div>
    );
};

export default observer(MapOSM);
