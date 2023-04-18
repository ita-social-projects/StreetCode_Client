import './MapBlockAdmin.styles.scss';
import 'leaflet/dist/leaflet.css';
import MapOSMAdmin from './MapAdmin/MapAdmin.component';
import StatisticsToponymsComponentAdmin from './StatisticsToponymsAdmin/StatisticsToponymsAdmin.component';

const MapBlockAdmin = () => {

    return(
        <div className="mapBlockContainerr">  
            <h2 className="streetcodeTitle">
               Мапа історії 
             </h2>
            <MapOSMAdmin  />
            <StatisticsToponymsComponentAdmin/>
        </div>
    );
}
export default MapBlockAdmin;