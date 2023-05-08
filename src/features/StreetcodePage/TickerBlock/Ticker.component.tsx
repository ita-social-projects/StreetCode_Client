import './Ticker.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Ticker from 'react-awesome-ticker';
import subtitlesApi from '@api/additional-content/subtitles.api';
import useMobx from '@stores/root-store';

const TickerComponent = () => {
    const { getSubtitlesByStreetcodeId } = subtitlesApi;
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useMobx();

    const [subtitle, setSubtitle] = useState<string>('');

    useEffect(() => {
        if (getStreetCodeId !== errorStreetCodeId) {
            getSubtitlesByStreetcodeId(getStreetCodeId).then((response) => {
                setSubtitle(response.subtitleText); console.log(response);
            })
                .catch((error) => {
                    console.log(error);
                });
        }
    }), [getStreetCodeId];

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
