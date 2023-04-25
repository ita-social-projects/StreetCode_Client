import { useEffect, useState } from 'react';

import { Button, Input, Tooltip } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';
import Video from '../../../../../../models/media/video.model';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
}

const toolTipColor = '#8D1F16';
const videoPattern = 'https?://www.youtube.com/watch.+';

const linkConverter = (link: string) => {
    let fixedlink = link;
    if (link.includes('&')) {
        const index = link.indexOf('&');
        fixedlink = link.slice(0, index);
    }
    return fixedlink.includes('/watch?v=')
        ? fixedlink.replace('/watch?v=', '/embed/')
        : fixedlink;
};

const LinkEditor = ({ inputInfo, setInputInfo, video, setVideo }: Props) => {
    const [showPreview, setShowPreview] = useState(false);
    useEffect(() => {
        setInputInfo(info => ({ ...info, link: video?.url.href }));
    }, [video])
    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, link: e.target.value });
        setVideo(video);
    };
    return (
        <FormItem name="video" rules={[{ required: true, message: 'Введіть посилання!' }]}>
            <div className="youtube-block">
                <h3>Відео</h3>
                <Input
                    title="video"
                    value={inputInfo?.link??""}
                    className="smallerInput"
                    placeholder="ex. https://www.youtube.com"
                    pattern={videoPattern}
                    name="link"
                    required
                    onChange={handleLinkChange}
                />
                <Tooltip
                    title={
                        inputInfo?.link?.includes('watch')
                            ? '' : 'Вкажіть посилання на youtube.com/watch!'
                    }
                    color={toolTipColor}
                >
                    <Button
                        disabled={!inputInfo?.link?.includes('watch')}
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        Попередній перегляд
                    </Button>
                </Tooltip>
                {
                    inputInfo?.link?.includes('watch') && showPreview ? (
                        <div>
                            <h4>Попередній перегляд</h4>
                            <iframe
                                title="video-preview"
                                src={
                                    linkConverter(inputInfo.link)
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
