import './MapBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStreetcodePageLoaderContext, useStreetcodeDataContext, useToponymContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import StreetcodeCoordinatesApi from '@/app/api/additional-content/streetcode-cooridnates.api';
import StatisticRecordApi from '@/app/api/analytics/statistic-record.api';
import CheckBoxComponent from '@/features/StreetcodePage/MapBlock/CheckBox/CheckBox.component';
import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import StatisticRecord from '@/models/analytics/statisticrecord.model';
import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';
import Toponym from '@/models/toponyms/toponym.model';

import 'leaflet/dist/leaflet.css';

import MapOSM from './Map/Map.component';

const MapBlock = () => {
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const toponymContext = useToponymContext();
    const streecodePageLoaderContext = useStreetcodePageLoaderContext();

    const [streetcodeCoordinates, setStreetcodeCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const [statisticRecord, setStatisticRecord] = useState<StatisticRecord[]>([]);

    useEffect(
        () => {
            const streetcodeId = getStreetCodeId;
            if (streetcodeId > 0) {
                let toponymPromise: Promise<Toponym[]> = Promise.resolve([]);
                if (!toponymContext.loaded) {
                    toponymPromise = toponymContext.fetchToponymByStreetcodeId(streetcodeId);
                }
                const statisticPromise = StatisticRecordApi.getAllByStreetcodeId(streetcodeId)
                    .then((resp) => setStatisticRecord(resp));

                Promise.all([statisticPromise, toponymPromise])
                    .then(() => streecodePageLoaderContext.addBlockFetched(StreetcodeBlock.Map));
            }
        },
        [getStreetCodeId],
    );

    return (
        <div className="mapBlockContainer">
            <BlockHeading headingText="Мапа історії" />
            <CheckBoxComponent streetcodeCoordinates={streetcodeCoordinates} toponyms={toponymContext.toponyms} />
            <MapOSM statisticRecord={statisticRecord} toponyms={toponymContext.toponyms} />
        </div>
    );
};

export default observer(MapBlock);
