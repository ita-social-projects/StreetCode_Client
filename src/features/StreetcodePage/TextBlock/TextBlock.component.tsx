import './TextBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import videosApi from '@api/media/videos.api';
import textsApi from '@api/streetcode/text-content/texts.api';
import VideoPlayer from '@components/Video/Video.component';
import { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import htmpReactParser from 'html-react-parser';

import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import AdditionalText from './AdditionalTextBlock/AdditionalTextBlock.component';
import ReadMore from './ReadMore/ReadMore.component';

const TextComponent = () => {
    const { streetcodeStore: { getStreetCodeId } } = useStreetcodeDataContext();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { getByStreetcodeId: getVideo } = videosApi;
    const { getByStreetcodeId: getText } = textsApi;
    const [text, setText] = useState<Text>();
    const [video, setVideo] = useState<Video>();

    useEffect(() => {
        if (getStreetCodeId > 0) {
            Promise.all([getText(getStreetCodeId), getVideo(getStreetCodeId)])
                .then(([textResult, videoResult]) => {
                    setText(textResult);
                    setVideo(videoResult);
                    streecodePageLoaderContext.addBlockFetched();
                })
                .catch((error) => {
                    console.error(error);
                }).then();
        }
    }, [getStreetCodeId]);

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        const element = document.getElementById(hash);

        setTimeout(() => {
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1000);
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
                        {video.url.length > 1
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
