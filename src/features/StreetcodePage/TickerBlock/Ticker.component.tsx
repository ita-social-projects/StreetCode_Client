import './Ticker.styles.scss';

import { useMemo } from 'react';
import Ticker from 'react-awesome-ticker';
import subtitlesApi from '@api/additional-content/subtitles.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Subtitle from '@models/additional-content/subtitles.model';
import useMobx from '@stores/root-store';

const createSubtitleString = (subtitles?: Subtitle[]): Map<number, string> => (
    new Map(subtitles?.map(({ id, subtitleText }) => [
        id,
        subtitleText
    ]))
);

const TickerComponent = () => {
    const { getSubtitlesByStreetcodeId } = subtitlesApi;
    const { streetcodeStore: { getStreetCodeId } } = useMobx();

    const { value } = useAsync(() => getSubtitlesByStreetcodeId(getStreetCodeId), [getStreetCodeId]);
    const subtitles = value as Subtitle[];

    const subtitleMap = useMemo(() => createSubtitleString(subtitles), [subtitles]);

    return (
        <Ticker className="tickerContainer">
            <div className="tickerItem">{Array.from(subtitleMap.values()).join('')}</div>
        </Ticker>
    );
};

export default TickerComponent;
