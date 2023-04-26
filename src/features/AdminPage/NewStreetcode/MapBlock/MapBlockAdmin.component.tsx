import './MapBlockAdmin.styles.scss';
import 'leaflet/dist/leaflet.css';
import MapOSMAdmin from './MapAdmin/MapAdmin.component';
import StatisticsToponymsComponentAdmin from './StatisticsToponymsAdmin/StatisticsToponymsAdmin.component';

import StreetcodeCoordinate from '../../../../models/additional-content/coordinate.model';
import React from 'react';
interface Props {
    coordinates: StreetcodeCoordinate[];
}
const MapBlockAdmin: React.FC<Props> = ({
    coordinates,
}) => {
    return (
        <div className="adminContainer-block mapBlockContainerr">  
        <h2>Мапа історії</h2>
            <MapOSMAdmin coordinates={coordinates} />
            <StatisticsToponymsComponentAdmin/>
        </div>
    );
}
export default MapBlockAdmin;