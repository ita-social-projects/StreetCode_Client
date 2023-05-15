/* eslint-disable no-restricted-imports */
import Video from '@/models/media/video.model';

import TextInputInfo from './InputType/TextInputInfo.model';
import TextForm from './TextForm/TextForm.component';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
}

const TextBlock = ({ inputInfo, setInputInfo, video, setVideo }: Props) => (
    <TextForm inputInfo={inputInfo} setInputInfo={setInputInfo} video={video} setVideo={setVideo} />
);

export default TextBlock;
