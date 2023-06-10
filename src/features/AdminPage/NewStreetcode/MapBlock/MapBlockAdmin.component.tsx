import './MapBlockAdmin.styles.scss';

import React from 'react';
import StreetcodeCoordinate from '@models/additional-content/coordinate.model';

import 'leaflet/dist/leaflet.css';

import MapOSMAdmin from './MapAdmin/MapAdmin.component';
import StatisticsToponymsComponentAdmin from './StatisticsToponymsAdmin/StatisticsToponymsAdmin.component';

interface Props {
    coordinates: StreetcodeCoordinate[];
}
const MapBlockAdmin = React.memo(({ coordinates }: Props) => (
    <div className="adminContainer-block mapBlockContainerr">
        <h2>Мапа історії</h2>
        <MapOSMAdmin coordinates={coordinates} />
        <StatisticsToponymsComponentAdmin />
    </div>
));
export default MapBlockAdmin;
