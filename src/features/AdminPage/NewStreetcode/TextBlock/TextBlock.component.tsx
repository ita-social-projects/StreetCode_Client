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
    const [canLoad, setCanLoad] = useState<boolean>(parseId === null);

    useAsync(async () => {
        if (parseId != null) {
            const result = await TextsApi.getByStreetcodeId(parseId);
            setInputInfoAsync(result);
            setCanLoad(true);
        }
    }, [parseId]);

    useEffect(() => {
        setInputInfo(inputInfoAsync);
    }, [inputInfoAsync]);

    return (
        canLoad ? (
            <TextForm
                inputInfo={inputInfoAsync}
                setInputInfo={setInputInfoAsync}
                video={video}
                setVideo={setVideo}
                onChange={onChange}
            />
        )
            : <></>
    );
});

export default TextBlock;
