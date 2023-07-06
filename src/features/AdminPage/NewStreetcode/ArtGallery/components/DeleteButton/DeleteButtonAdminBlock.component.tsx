import React, { useEffect, useState } from 'react';

import { Button, Modal, UploadFile } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

interface Props {
    filesToRemove: UploadFile[]
    visible: boolean;
            //setVisibleModal(true);
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteButton = ({filesToRemove, visible, setVisibleModal}: Props) => {
    //const [fileProps, setFileProps] = useState<{previewImage: string, previewTitle: string}>({ previewImage: '', previewTitle: '' });
    //const [newTitle, setTitle] = useState<string>('');
    //const [newDesc, setDesc] = useState<string>('');

    // useEffect(() => {
    //     setTitle(streetcodeArt?.art.title ?? '');
    //     setDesc(streetcodeArt?.art.description ?? '');
    //     const url = base64ToUrl(streetcodeArt?.art.image.base64, streetcodeArt?.art.image.mimeType);
    //     setFileProps({
    //         previewImage: url || '',
    //         previewTitle: streetcodeArt?.art.title || '',
    //     });
    // }, [opened]);



    //const [visible, setVisible] = useState(false);
    useEffect(()=>{
        console.log('Delete button useEffect')
        console.log()
        if(filesToRemove.length > 0)
        {
            console.log('filesToRemove.length > 0')
        }
        else
        {
            console.log('filesToRemove.length < 0');
        }
    }, [visible]);
    
    function handleClick()
    {
        setVisibleModal(true);
    }

    if(filesToRemove.length > 0)
    {
        return(
            <>
            <Button danger onClick={handleClick}>I'm a delete button</Button>
            </>
        )
    }
};
export default DeleteButton;
