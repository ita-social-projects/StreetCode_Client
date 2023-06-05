import './MapBlockAdmin.styles.scss';

import React from 'react';

import 'leaflet/dist/leaflet.css';

import StreetcodeCoordinate from '../../../../models/additional-content/coordinate.model';

import MapOSMAdmin from './MapAdmin/MapAdmin.component';
import StatisticsToponymsComponentAdmin from './StatisticsToponymsAdmin/StatisticsToponymsAdmin.component';

interface Props {
    coordinates: StreetcodeCoordinate[];
}
const MapBlockAdmin: React.FC<Props> = ({ coordinates }) => (
    <div className="adminContainer-block mapBlockContainerr">
        <h2>Мапа історії</h2>
        <MapOSMAdmin coordinates={coordinates} />
        <StatisticsToponymsComponentAdmin />
    </div>
);
export default MapBlockAdmin;
