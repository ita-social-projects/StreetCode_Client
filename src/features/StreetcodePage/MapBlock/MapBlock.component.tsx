import './MapBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStreetcodeDataContext, useToponymContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import CheckBoxComponent from '@/features/StreetcodePage/MapBlock/CheckBox/CheckBox.component';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';

import 'leaflet/dist/leaflet.css';

import MapOSM from './Map/Map.component';

import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import StatisticRecord from '@/models/analytics/statisticrecord.model';

const MapBlock = () => {
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const toponymContext = useToponymContext();

    const [streetcodeCoordinates, setStreetcodeCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const [statisticRecord, setStatisticRecord] = useState<StatisticRecord[]>([]);

    useEffect(
        () => {
            const streetcodeId = getStreetCodeId;
            if (streetcodeId > 0) {
                if (!toponymContext.loaded) {
                    toponymContext.fetchToponymByStreetcodeId(streetcodeId);
                }
                StatisticRecordApi.getAllByStreetcodeId(streetcodeId).then((resp)=>setStatisticRecord(resp));
            }
        },
        [getStreetCodeId],
    );

    return (
        <div className="mapBlockContainer container">
            <BlockHeading headingText="Мапа історії" />
            <CheckBoxComponent streetcodeCoordinates={streetcodeCoordinates} toponyms={toponymContext.toponyms} />
            <MapOSM statisticRecord={statisticRecord} toponyms={toponymContext.toponyms} />
        </div>
    );
};

export default observer(MapBlock);
