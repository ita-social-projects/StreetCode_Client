import './TextBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import videosApi from '@api/media/videos.api';
import textsApi from '@api/streetcode/text-content/texts.api';
import VideoPlayer from '@components/Video/Video.component';
import useMobx, { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import htmpReactParser from 'html-react-parser';

import getUrlHash from '@/app/common/utils/getUrlHash.utility';
import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import AdditionalText from './AdditionalTextBlock/AdditionalTextBlock.component';
import ReadMore from './ReadMore/ReadMore.component';

const TextComponent = () => {
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const { textVideoStore } = useMobx();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const [text, setText] = useState<Text>();
    const [video, setVideo] = useState<Video>();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        if (getStreetCodeId > 0) {
            Promise.all([
                textVideoStore.fetchStreetcodeText(getStreetCodeId),
                textVideoStore.fetchStreetcodeVideo(getStreetCodeId),
            ]).then(([textResult, videoResult]) => {
                setText(textResult);
                setVideo(videoResult);
                streecodePageLoaderContext.addBlockFetched();
            }).catch((error) => {
                console.error(error);
            }).then();
        }
    }, [getStreetCodeId]);

    useEffect(() => {
        const hash = getUrlHash(location);
        if (!isScrolled && hash === 'text') {
            const element = document.getElementById(hash);

            setTimeout(() => {
                if (element !== null) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setIsScrolled(true);
                }
            }, 1000);
        }
    });

    return (
        <div id="text">
            {text
                ? (
                    <div
                        className="textComponentContainer"
                    >
                        <BlockHeading headingText={String(text?.title)} />
                        <div className="textComponent">
                            <div className="TextContainer">
                                <ReadMore key={text?.title} text={String(text?.textContent)} />
                                <AdditionalText additionalText={htmpReactParser(text?.additionalText ?? '')} />
                            </div>
                        </div>
                        {video && video.url.length > 1
                            ? (
                                <div className="videoComponent">
                                    <VideoPlayer
                                        videoUrls={String(video?.url)}
                                    />
                                </div>
                            ) : <></>}
                    </div>
                ) : <></>}
        </div>
    );
};

export default observer(TextComponent);
