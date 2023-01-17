import './MapBlock.styles.scss';

import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RadioComponent from '@streetcode/MapBlock/Radio/Radio.component';
import 'leaflet/dist/leaflet.css';

import MapOSM from './Map/Map.component';

const MapBlock = () => (
    <div className="mapBlockContainer">
        <BlockHeading headingText="Мапа історії" />
        <RadioComponent/>
        <MapOSM />
    </div>
);
export default MapBlock;
