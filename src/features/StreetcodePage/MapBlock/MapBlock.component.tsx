import './MapBlock.styles.scss';

import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import ToponymsApi from '@/app/api/map/toponyms.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import CheckBoxComponent from '@/features/StreetcodePage/MapBlock/CheckBox/CheckBox.component';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Toponym from '@/models/toponyms/toponym.model';

import 'leaflet/dist/leaflet.css';

import MapOSM from './Map/Map.component';

const MapBlock = () => {
    const { streetcodeStore: { getStreetCodeId } } = useMobx();
    const toponyms = useAsync(() => ToponymsApi
        .getAll(), []).value as Toponym[];
    const streetcodeCoordinates = useAsync(() => StreetcodeCoordinatesApi
        .getByStreetcodeId(getStreetCodeId), [getStreetCodeId]).value as StreetcodeCoordinate[];

    return (
        <div className="mapBlockContainer">
            <BlockHeading headingText="Мапа історії" />
            <CheckBoxComponent />
            <MapOSM streetcodeCoordinates={streetcodeCoordinates} toponyms={toponyms} />
        </div>
    );
};

export default MapBlock;
