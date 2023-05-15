import './TextBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import videosApi from '@api/media/videos.api';
import textsApi from '@api/streetcode/text-content/texts.api';
import VideoPlayer from '@components/Video/Video.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import ReadMore from './ReadMore/ReadMore.component';

import React, { useEffect, useState } from 'react';

interface Props {
    setTextBlockState: React.Dispatch<React.SetStateAction<boolean>>;
}
const TextComponent = ({ setTextBlockState }: Props) => {
    const { streetcodeStore: { getStreetCodeId } } = useMobx();
    const { getByStreetcodeId: getVideo } = videosApi;
    const { getByStreetcodeId: getText } = textsApi;
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const [text, setText] = useState(undefined);
    const [video, setVideo] = useState(undefined);

    useEffect(() => {
        if (getStreetCodeId > 0) {
            Promise.all([getText(getStreetCodeId), getVideo(getStreetCodeId)])
                .then(([textResult, videoResult]) => {
                    setText(textResult);
                    setVideo(videoResult);
                })
                .catch(error => {
                    console.error(error);
                    setText(undefined);
                    setVideo(undefined);
                });
        } else {
            setText(undefined);
            setVideo(undefined);
        }
    }, [getStreetCodeId]);

    useEffect(() => {
        if (text || video) {
            setShouldRender(true);
        }

        if (!(text && video) || (text && !video) || (video && videoLoaded)) {
            setTextBlockState(true);
        }
    }, [videoLoaded, text, video]);

    return (
        shouldRender
            ? (
                <div
                    id="text"
                    className="textComponentContainer container"
                >
                    <BlockHeading headingText={String(text?.title)} />
                    <div className="textComponent">
                        <div className="TextContainer">
                            <ReadMore text={String(text?.textContent)} />
                        </div>
                    </div>
                    <div className="videoComponent">
                        <VideoPlayer videoUrls={String(video?.url.href)} setVideoLoaded={setVideoLoaded} />
                        {/* <Video videoUrls={"f55dHPEY-0U"}/> */}
                    </div>
                </div>
            ) : null
    );
};

export default observer(TextComponent);
