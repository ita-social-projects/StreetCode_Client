import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Video from '@models/media/video.model';

import { Button, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
}

const videoPattern = 'https?://www.youtube.com/watch.+';

const linkConverter = (link: string) => {
    if (!link) {
        return link;
    }
    let fixedlink = link;

    if (link.indexOf('&') >= 0) {
        const index = link.indexOf('&');
        fixedlink = link.slice(0, index);
    }
    return fixedlink?.includes('/watch?v=')
        ? fixedlink.replace('/watch?v=', '/embed/')
        : fixedlink;
};

const LinkEditor = ({ inputInfo, setInputInfo, video, setVideo }: Props) => {
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        setInputInfo((info) => ({ ...info, link: video?.url.href }));
    }, [video]);

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, link: e.target.value });
        setVideo(video);
    };

    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    return (
        <FormItem
            name="video"
            label="Відео"
        >
            <div className="youtube-block">
                <Input
                    title="video"
                    value={inputInfo?.link ?? ''}
                    className="smallerInput"
                    placeholder="ex. https://www.youtube.com"
                    pattern={videoPattern}
                    name="link"
                    required={!parseId}
                    onChange={handleLinkChange}
                />
                <Button
                    // disabled={!inputInfo?.link?.includes('watch')}
                    className="streetcode-custom-button button-margin-vertical"
                    onClick={() => setShowPreview(!showPreview)}
                >
                        Попередній перегляд
                </Button>
                {
                    inputInfo?.link && showPreview && inputInfo.link.indexOf('watch') > -1 ? (
                        <div>
                            <h4>Попередній перегляд</h4>
                            <iframe
                                title="video-preview"
                                src={
                                    linkConverter(inputInfo?.link ?? '')
                                }
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            />
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
