import './Ticker.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Ticker from 'react-awesome-ticker';
import SubtitlesApi from '@api/additional-content/subtitles.api';
import TickerStringAboutUs from '@api/team/tickerString.api';
import { useStreetcodeDataContext } from '@stores/root-store';

const TickerComponent = ({ type }: { type: 'teamMembers' | 'subtitle' }) => {
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const [tickerText, setTickerText] = useState<string>('');

    useEffect(() => {
        if (type === 'teamMembers') {
            TickerStringAboutUs.getString()
                .then((res) => setTickerText(res));
        } else if (type === 'subtitle' && getStreetCodeId !== errorStreetCodeId) {
            SubtitlesApi.getSubtitlesByStreetcodeId(getStreetCodeId)
                .then((res) => {if(res.length > 0) setTickerText(res[0].subtitleText)}) ;
        }
    }, [type, getStreetCodeId, errorStreetCodeId]);

    return (
        tickerText.length
            ? (
                <div className="tickerContainer">
                    <Ticker pauseOnHover>
                        <div className="tickerItem">{tickerText}</div>
                    </Ticker>
                </div>
            ) : <></>
    );
};

export default observer(TickerComponent);
