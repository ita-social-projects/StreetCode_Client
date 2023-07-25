import './MapBlockAdmin.styles.scss';

import React from 'react';

import 'leaflet/dist/leaflet.css';

import MapOSMAdmin from './MapAdmin/MapAdmin.component';
import StatisticsToponymsComponentAdmin from './StatisticsToponymsAdmin/StatisticsToponymsAdmin.component';

const MapBlockAdmin = React.memo(() => (
    <div className="adminContainer-block mapBlockContainerr">
        <h2>Мапа історії</h2>
        <MapOSMAdmin />
        <h2>Додавання топонімів на шар вулиць</h2>
        <StatisticsToponymsComponentAdmin />
    </div>
));
export default MapBlockAdmin;
