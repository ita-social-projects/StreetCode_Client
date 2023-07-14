import { useEffect, useState } from 'react';
import YouTubePlayer from 'react-player/youtube';
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

const videoPattern = 'https?://www.youtube.com/watch.+';

const insertYouTubeId = (videoId: string): string => `https://youtube.com/embed/watch?=${videoId}`;

const LinkEditor = ({
    inputInfo, setInputInfo, video, setVideo, onChange,
}: Props) => {
    const [showPreview, setShowPreview] = useState(false);
    const [youtubeId, setYoutubeId] = useState<string>('');

    const getYouTubeId = (url: string): string | null => {
        // eslint-disable-next-line max-len
        const youtubeRegex = /\b(?:https?:\/\/(?:www\.|m\.)?youtube\.com\/(?:watch\?(?=.*v=\w+)|embed\/|v\/|shorts\/)|https?:\/\/youtu\.be\/|www\.youtube\.com\/redirect\?(?=.*q=)(?=.*(?:v|url)=\w+))(?:[-\w]+(?:.[-\w]+)*\/)*(?:watch\?.*(?:[\?&](?:v|embed|list)=\w+|index=\w+)|[\w\d_-]{11})\b/;
        const youtubeIdRegex = /[?&]v=([^&]+)/;

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
        const { value } = (e.target as HTMLInputElement);
        if (value) {
            const id = getYouTubeId(value);
            if (id) {
                const url = insertYouTubeId(id);
                setInputInfo({ ...inputInfo, link: url });
                setVideo(video);
                onChange('link', inputInfo?.link);
            }
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
            rules={[
                { required: true, message: 'Введіть посилання на youtube.com.' }]}
        >
            <div className="youtube-block">
                <Input
                    title="video"
                    value={inputInfo?.link}
                    className="smallerInput"
                    placeholder="Прик.: https://www.youtube.com/watch?"
                    // pattern={youtubeRegex}
                    name="link"
                    required={!parseId}
                    onChange={handleLinkChange}
                />
                <Button
                    className="streetcode-custom-button button-margin-vertical"
                    onClick={() => setShowPreview(!showPreview)}
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
