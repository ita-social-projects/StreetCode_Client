import './PreviewImageModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'antd';
import { RcFile } from 'antd/es/upload';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

const getBase64 = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

const PreviewFileModal: React.FC<{
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    streetcodeArt: StreetcodeArtCreateUpdate;
    onSave: (art: StreetcodeArtCreateUpdate) => void
}> = ({ opened, setOpened, onSave, streetcodeArt }) => {
    const [fileProps, setFileProps] = useState<{
        previewImage: string, previewTitle: string
    }>({ previewImage: '', previewTitle: '' });
    const [newTitle, setTitle] = useState<string>();
    const [newDesc, setDesc] = useState<string>();

    const handleCancel = () => {
        setOpened(false);
    };

    const handleSave = () => {
        streetcodeArt?.art.description = newDesc;
        streetcodeArt?.art.title = newTitle;

        console.log(streetcodeArt);

        onSave(streetcodeArt);
        setOpened(false);
    };

    useEffect(() => {
        setTitle(streetcodeArt?.art.title);
        setDesc(streetcodeArt?.art.description);
        const url = base64ToUrl(streetcodeArt?.art.image.base64, streetcodeArt?.art.image.mimeType);
        async function uploadImageToModal() {
            setFileProps({
                previewImage: url || '',
                previewTitle: streetcodeArt?.art.title || '',
            });
        }
        uploadImageToModal();
    }, [opened]);

    return (
        <Modal open={opened} title="Додаткові дані" style={{ top: 50 }} footer={null} onCancel={handleCancel}>
            <div className="artPreviewModal">
                <img alt="uploaded" src={fileProps.previewImage} />
                <p>Title</p>
                <input value={newTitle} onChange={(e) => setTitle(e.target.value)} />
                <p>Description</p>
                <textarea value={newDesc} onChange={(e) => setDesc(e.target.value)} />
                <Button onClick={handleSave} className="saveButton">Зберегти</Button>
            </div>
        </Modal>
    );
};
export default PreviewFileModal;
