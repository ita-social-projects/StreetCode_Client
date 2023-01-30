import './Ticker.styles.scss';

import { useMemo } from 'react';
import Ticker from 'react-awesome-ticker';
import subtitlesApi from '@api/additional-content/subtitles.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import Subtitle, { SubtitleStatus } from '@models/additional-content/subtitles.model';

const createSubtitleString = (subtitles?: Subtitle[]): Map<number, string> => (
    new Map(subtitles?.map(({ id, firstName, lastName, subtitleStatus }) => [
        id,
        `${Object.keys(SubtitleStatus)[subtitleStatus]} ${firstName} ${lastName}, `,
    ]))
);

const TickerComponent = () => {
    const id = useRouteId();
    const { getSubtitlesByStreetcodeId } = subtitlesApi;

    const { value } = useAsync(() => getSubtitlesByStreetcodeId(id), [id]);
    const subtitles = value as Subtitle[];

    const subtitleMap = useMemo(() => createSubtitleString(subtitles), [subtitles]);

    return (
        <Ticker className="tickerContainer">
            <div className="tickerItem">{Array.from(subtitleMap.values()).join('')}</div>
        </Ticker>
    );
};

export default TickerComponent;
