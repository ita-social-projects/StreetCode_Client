import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Youtube from 'react-youtube';
import Video from '@models/media/video.model';

import { Button, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
    onChange: (field: string, value: any) => void;
}

const insertYouTubeId = (videoId: string): string => `https://youtube.com/watch?=${videoId}`;
// eslint-disable-next-line max-len
const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
const youtubeIdRegex = /[?&]v=([^&]+)/;

const LinkEditor = ({
    inputInfo, setInputInfo, video, setVideo, onChange,
}: Props) => {
    const [showPreview, setShowPreview] = useState(false);
    const [youtubeId, setYoutubeId] = useState<string>('');

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

    useEffect(() => {
        setInputInfo((info) => ({ ...info, link: video?.url }));
    }, [video]);

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target as HTMLInputElement;
        if (value) {
            const id = getYouTubeId(value);
            if (id) {
                const url = insertYouTubeId(id);
                setInputInfo((info) => ({ ...info, link: value }));
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
            // eslint-disable-next-line max-len
            rules={[{ pattern: youtubeRegex, message: 'Вставте, будь ласка, тільки youtube.com посилання. Це поле не підтримує інші формати URL' },
                { required: !parseId && !inputInfo?.link, message: 'Вставте, будь ласка, youtube.com посилання.' }]}
        >
            <div className="youtube-block">
                <Input
                    title="video"
                    value={inputInfo?.link}
                    className="smallerInput"
                    placeholder="Прик.: https://youtube.com/watch?=v3siIQi4nCQ або https://youtu.be/v3siIQi4nCQ"
                    name="link"
                    required={!parseId}
                    onChange={handleLinkChange}
                    onInput={() => setInputInfo((info) => ({ ...info, link: '' }))}
                />
                <Button
                    className="streetcode-custom-button button-margin-vertical"
                    onClick={() => setShowPreviewState(!showPreview)}
                >
                    Попередній перегляд
                </Button>
                {
                    inputInfo?.link && showPreview ? (
                        <div>
                            <h4>Попередній перегляд</h4>
                            <Youtube opts={opts} videoId={youtubeId} />
                        </div>
                    ) : (
                        <div />
                    )
                }
            </div>
        </FormItem>
    );
};

export default LinkEditor;
