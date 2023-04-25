import './MapBlockAdmin.styles.scss';
import 'leaflet/dist/leaflet.css';
import MapOSMAdmin from './MapAdmin/MapAdmin.component';
import StatisticsToponymsComponentAdmin from './StatisticsToponymsAdmin/StatisticsToponymsAdmin.component';

const MapBlockAdmin = () => {

    return(
        <div className="adminContainer-block mapBlockContainerr">  
            <h2>Мапа історії</h2>
            <MapOSMAdmin  />
            <StatisticsToponymsComponentAdmin/>
        </div>
    );
}
export default MapBlockAdmin;