import './TextBlock.styles.scss';

import videosApi from '@api/media/videos.api';
import textsApi from '@api/streetcode/text-content/texts.api';
import VideoPlayer from '@components/Video/Video.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import ReadMore from './ReadMore/ReadMore.component';

const TextComponent = () => {
    const streetcodeId = useRouteId();
    const { getByStreetcodeId: getVideo } = videosApi;
    const { getByStreetcodeId: getText } = textsApi;

    const { value } = useAsync(
        () => Promise.all([getText(streetcodeId), getVideo(streetcodeId)]),
        [streetcodeId],
    );
    const [text, video] = (value as [Text, Video]) ?? [undefined, undefined];

    return (
        <div
            id='text'
            className="textComponentContainer"
        >
            <BlockHeading headingText={String(text?.title)} />
            <div className="textComponent">
                <div className="TextContainer">
                    <ReadMore text={String(text?.textContent)} />
                </div>
            </div>
            <div className="videoComponent">
                <VideoPlayer videoUrls={String(video?.url.href)} />
                {/* <Video videoUrls={"f55dHPEY-0U"}/> */}
            </div>
        </div>
    );
};

export default TextComponent;
