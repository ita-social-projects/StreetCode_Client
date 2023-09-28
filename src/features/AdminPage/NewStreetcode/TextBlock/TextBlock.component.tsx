/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import TextsApi from '@api/streetcode/text-content/texts.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';

import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import TextForm from './TextForm/TextForm.component';

interface Props {
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
    onChange: (fieldName: string, value: any) => void;
    parseId: number
}

const TextBlock = React.memo(({
    inputInfo, setInputInfo, video, setVideo, onChange, parseId,
}: Props) => {
    const [inputInfoAsync, setInputInfoAsync] = useState<Partial<Text>>();
    const [textForm, setTextForm] = useState<Element>();

    useAsync(async () => {
        if (parseId != null) {
            await TextsApi.getByStreetcodeId(parseId).then((result) => {
                setInputInfoAsync(result);
                setTextForm(<TextForm
                    inputInfo={result}
                    setInputInfo={setInputInfoAsync}
                    video={video}
                    setVideo={setVideo}
                    onChange={onChange}
                />);
            });
        }
    }, [parseId]);

    useEffect(() => {
        setInputInfo(inputInfoAsync);
    }, [inputInfoAsync]);

    return (
        <>
            {textForm}
        </>
    );
});

export default TextBlock;
