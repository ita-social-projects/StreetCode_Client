import './TextBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import videosApi from '@api/media/videos.api';
import textsApi from '@api/streetcode/text-content/texts.api';
import VideoPlayer from '@components/Video/Video.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import htmpReactParser from 'html-react-parser';

import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import AdditionalText from './AdditionalTextBlock/AdditionalTextBlock.component';
import ReadMore from './ReadMore/ReadMore.component';

interface Props {
    setTextBlockState: React.Dispatch<React.SetStateAction<boolean>>;
}
const TextComponent = ({ setTextBlockState }: Props) => {
    const { streetcodeStore: { getStreetCodeId } } = useMobx();
    const { getByStreetcodeId: getVideo } = videosApi;
    const { getByStreetcodeId: getText } = textsApi;

    const { value } = useAsync(
        () => Promise.all([getText(getStreetCodeId), getVideo(getStreetCodeId)]),
        [getStreetCodeId],
    );
    const [text, video] = (value as [Text, Video]) ?? [undefined, undefined];

    return (

        text
            ? (
                <div
                    id="text"
                    className="textComponentContainer"
                >
                    <BlockHeading headingText={String(text?.title)} />
                    <div className="textComponent">
                        <div className="TextContainer">
                            <ReadMore text={String(text?.textContent)} />
                            <AdditionalText аdditionalText={htmpReactParser(text?.аdditionalText ?? '')} />
                        </div>
                    </div>
                    <div className="videoComponent">
                        <VideoPlayer videoUrls={String(video?.url.href)} setTextBlockState={setTextBlockState} />
                        {/* <Video videoUrls={"f55dHPEY-0U"}/> */}
                    </div>

                </div>
            ) : <></>
    );
};

export default observer(TextComponent);
