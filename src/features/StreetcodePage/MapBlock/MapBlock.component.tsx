import './MapBlock.styles.scss';

import { useEffect, useState } from 'react';
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
    const [toponyms, setToponyms] = useState<Toponym[]>([]);

    const [streetcodeCoordinates, setStreetcodeCoordinates] = useState<StreetcodeCoordinate[]>([]);

    useEffect(
        () => {
            const streetcodeId = getStreetCodeId;
            if (streetcodeId > 0) {
                ToponymsApi.getByStreetcodeId(streetcodeId).then((res) => setToponyms(res));
                StreetcodeCoordinatesApi
                    .getByStreetcodeId(streetcodeId).then((res) => setStreetcodeCoordinates(res));
            }
        },
        [getStreetCodeId],
    );
    /*     const toponyms = useAsync(() => {
        const streetcodeId = getStreetCodeId;
        if (streetcodeId > 0) {
            ToponymsApi.getByStreetcodeId(streetcodeId);
        }
    }, [getStreetCodeId]).value as Toponym[];
    const streetcodeCoordinates = useAsync(() => {
        const streetcodeId = getStreetCodeId;
        if (streetcodeId > 0) {
            StreetcodeCoordinatesApi
                .getByStreetcodeId(streetcodeId);
        }
    }, [getStreetCodeId]).value as StreetcodeCoordinate[]; */

    return (
        <div className="mapBlockContainer container">
            <BlockHeading headingText="Мапа історії" />
            <CheckBoxComponent streetcodeCoordinates={streetcodeCoordinates} toponyms={toponyms} />
            <MapOSM streetcodeCoordinates={streetcodeCoordinates} toponyms={toponyms} />
        </div>
    );
};

export default MapBlock;
