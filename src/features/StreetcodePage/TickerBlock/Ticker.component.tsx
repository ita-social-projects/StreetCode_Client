import './Ticker.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Ticker from 'react-awesome-ticker';
import SubtitlesApi from '@api/additional-content/subtitles.api';
import { useStreetcodeDataContext } from '@stores/root-store';

const TickerComponent = () => {
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();

    const [subtitle, setSubtitle] = useState<string>('');

    useEffect(() => {
        if (getStreetCodeId !== errorStreetCodeId) {
            SubtitlesApi.getSubtitlesByStreetcodeId(getStreetCodeId)
                .then((res) => setSubtitle(res.subtitleText));
        }
    }, [getStreetCodeId]);

    return (
        subtitle.length
            ? (
                <div className="tickerContainer">
                    <Ticker pauseOnHover>
                        <div className="tickerItem">{subtitle}</div>
                    </Ticker>
                </div>
            ) : <></>
    );
};

export default observer(TickerComponent);
