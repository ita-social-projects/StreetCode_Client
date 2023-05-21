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
import Toponym from '@/models/toponyms/toponym.model';

import CustomMarkerCluster from './MarkerCluster/MarkerClusterWrapper.component';

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
    const [defaultZoom, setDefaultZoom] = useState(6.4);
    const mapOptions = {
        gestureHandling: true,
    };
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 480) {
                setDefaultZoom(4.95);
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
    // if you need to use the previous second map
    // return (
    //     <div className="mapCentered">
    //         <MapContainer {...mapOptions} center={[centerOfUkraine.latitude, centerOfUkraine.longtitude]}
    //          zoom={defaultZoom} className="mapContainer"
    //           scrollWheelZoom={true}>
    //             <TileLayer
    //                 url="https://tile.openstreetmap.org.ua/styles/positron-gl-style/{z}/{x}/{y}.png"
    //             />
    //             {streetcodes?.isActive && (
    //                 <CustomMarkerCluster>
    //                     {streetcodeCoordinates?.map((sc) => <CustomMarker latitude={sc.latitude} longtitude={sc.longtitude} title={String(sc.id)} description={String(sc.streetcodeId)} />)}
    //                 </CustomMarkerCluster>
    //             )}
    //             {streets?.isActive && (
    //                 <CustomMarkerCluster>
    //                     {toponyms?.map((t) => <CustomMarker latitude={t.coordinate?.latitude} longtitude={t.coordinate?.longtitude} title={String(t.id)} description={`${t.streetType} ${t.streetName}`} />)}
    //                 </CustomMarkerCluster>
    //             )}
    //         </MapContainer>
    //     </div>
    // );

    return (
        <div className="mapCentered">

            <MapContainer
                {...mapOptions}
                center={[centerOfUkraine.latitude, centerOfUkraine.longtitude]}
                zoom={defaultZoom}
                maxZoom={20}
                minZoom={1}
                zoomControl={false}
                className="mapContainer"
                scrollWheelZoom
                key={defaultZoom}
            >
                <VectorTileLayer
                    styleUrl="https://api.maptiler.com/maps/3f3c1ffa-9171-437c-bcce-06eae220b63f/style.json?key=UhzbQOCzR2G1uwFnnJk9"
                />

                {streetcodes?.isActive && (
                    <CustomMarkerCluster>
                        {streetcodeCoordinates?.map((sc) => <CustomMarker key={sc.id} latitude={sc.latitude} longtitude={sc.longtitude} title={String(sc.id)} description={String(sc.streetcodeId)} />)}
                    </CustomMarkerCluster>
                )}
                {streets?.isActive && (
                    <CustomMarkerCluster>
                        {toponyms?.map((t) => <CustomMarker key={t.id} latitude={t.coordinate?.latitude} longtitude={t.coordinate?.longtitude} title={String(t.id)} description={`${t.streetType} ${t.streetName}`} />)}
                    </CustomMarkerCluster>
                )}

                <ZoomControl position="bottomleft" />
            </MapContainer>
        </div>
    );
};

export default observer(MapOSM);
