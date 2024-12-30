import './Map.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import VectorTileLayer from 'react-leaflet-vector-tile-layer';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import CustomMarker from '@streetcode/MapBlock/Map/Marker/MarkerWrapper.component';
import * as L from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';

import useMobx from '@/app/stores/root-store';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import StatisticRecord from '@/models/analytics/statisticrecord.model';
import Toponym from '@/models/toponyms/toponym.model';

import CustomMarkerCluster from './MarkerCluster/MarkerClusterWrapper.component';

const centerOfUkraine = {
    latitude: 48.4501,
    longtitude: 31.3234,
};

interface Props {
    statisticRecord: StatisticRecord[],
    toponyms: Toponym[]
}

const MapOSM = ({ statisticRecord, toponyms }: Props) => {
    const { checkboxStore } = useMobx();
    const { checkBoxesState: { streetcodes, streets } } = checkboxStore;
    const [defaultZoom, setDefaultZoom] = useState(6.4);

    const mapOptions = {
        gestureHandling: true,
    };
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 480) {
                setDefaultZoom(4.9);
            } else if (window.innerWidth <= 1024) {
                setDefaultZoom(5.5);
            } else {
                setDefaultZoom(6.4);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

    return (
        <div className="mapCentered">

            <MapContainer
                {...mapOptions}
                center={[centerOfUkraine.latitude, centerOfUkraine.longtitude]}
                zoom={defaultZoom}
                maxZoom={20}
                minZoom={2}
                zoomControl={false}
                className="mapContainer"
                scrollWheelZoom
                key={defaultZoom}
            >
                <VectorTileLayer
                    styleUrl="https://api.maptiler.com/maps/50b0b22d-fc35-41d1-9a73-b4314d0eee92/style.json?key=NO3yf5cMdVzuGIkZRCtw"
                />

                {streetcodes?.isActive && (
                    <CustomMarkerCluster>
                        {statisticRecord?.map((sc) => <CustomMarker key={sc.id} latitude={sc.streetcodeCoordinate.latitude} longtitude={sc.streetcodeCoordinate.longtitude} title={String(sc.id)} description={sc.address} isStreetcode />)}
                    </CustomMarkerCluster>
                )}
                {streets?.isActive && (
                    <CustomMarkerCluster>
                        {toponyms?.map((t) => <CustomMarker key={t.id} latitude={t.coordinate?.latitude} longtitude={t.coordinate?.longtitude} title={String(t.id)} description={`${t.streetType} ${t.streetName}`} isStreetcode={false} />)}
                    </CustomMarkerCluster>
                )}

                <ZoomControl position="bottomleft" />
            </MapContainer>
        </div>
    );
};

export default observer(MapOSM);
