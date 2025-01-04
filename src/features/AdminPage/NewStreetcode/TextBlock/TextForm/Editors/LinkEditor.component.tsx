import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Youtube from 'react-youtube';
import Video from '@models/media/video.model';
import { Button, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';
import { Text } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
    onChange: (field: string, value: any) => void;
}

const insertYouTubeId = (videoId: string): string => `https://youtube.com/watch?=${videoId}`;
const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
const youtubeIdRegex = /[?&]v=([^&]+)/;

const LinkEditor = ({
    inputInfo, setInputInfo, video, setVideo, onChange,
}: Props) => {
    const [showPreview, setShowPreview] = useState(false);
    const [youtubeId, setYoutubeId] = useState<string>('');
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);

    useEffect(() => {
        setIsTitleEmpty(!inputInfo?.title || /^\s*$/.test(inputInfo.title));
    }, [inputInfo?.title]);

    const getYouTubeId = (url: string): string | null => {
        if (typeof url !== 'string') {
            return null;
        }
        const match = url.match(youtubeRegex) ?? url.match(youtubeIdRegex) ?? null;

        if (match) {
            const videoId = match[0].match(/[\w\d_-]{11}/);
            if (videoId) {
                setYoutubeId(videoId[0]);
                return videoId[0];
            }
        }
        return null;
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target as HTMLInputElement;
        const isTitleEmptyOrSpaces = !inputInfo?.title || /^\s*$/.test(inputInfo.title);
        if (value && !isTitleEmptyOrSpaces) { 
            const id = getYouTubeId(value);
            setInputInfo((info) => ({ ...info, link: value }));
            if (id) {
                const url = insertYouTubeId(id);
                setVideo(video);
                onChange('link', value);
            }
        }
    };

    const setShowPreviewState = (value: boolean) => {
        setShowPreview(value);
        const id = getYouTubeId(inputInfo?.link || '');
        if (id) {
            setYoutubeId(id);
        }
    };

    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <FormItem
            name="video"
            label="Відео"
            rules={[{ pattern: youtubeRegex, message: 'Вставте, будь ласка, тільки youtube.com посилання. Це поле не підтримує інші формати URL' }]}
        >   
            <div className="youtube-block">
                <Input
                    title="video"
                    className={isTitleEmpty ? "smallerInputDisabled" : "smallerInput"}
                    placeholder="Прик.: https://youtube.com/watch?=v3siIQi4nCQ або https://youtu.be/v3siIQi4nCQ"
                    name="link"
                    onChange={handleLinkChange}
                    onInput={() => setInputInfo((info) => ({ ...info, link: '' }))}
                    value={inputInfo?.link}
                    disabled={isTitleEmpty}
                    style={{ cursor: isTitleEmpty ? 'not-allowed' : 'auto' }}
                />
                <Button
                    className="streetcode-custom-button button-margin-vertical"
                    onClick={() => setShowPreviewState(!showPreview)}
                    disabled={isTitleEmpty}
                >
                    Попередній перегляд
                </Button>
                {inputInfo?.link && showPreview && (
                    <div>
                        <h4>Попередній перегляд</h4>
                        <Youtube opts={opts} videoId={youtubeId} />
                    </div>
                )}
            </div>
        </FormItem>
    );
};

export default LinkEditor;
