import './PreviewImageModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { ArtCreate } from '@/models/media/art.model';

const PreviewFileModal: React.FC<{
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    art: ArtCreate;
    onSave: (art: ArtCreate) => void
}> = ({ opened, setOpened, onSave, art }) => {
    const [fileProps, setFileProps] = useState<{
        previewImage: string, previewTitle: string
    }>({ previewImage: '', previewTitle: '' });
    const [newTitle, setTitle] = useState<string>();
    const [newDesc, setDesc] = useState<string>();

    const handleCancel = () => {
        setOpened(false);
    };
    const handleSave = () => {
        art.description = newDesc;
        art.title = newTitle;
        onSave(art);
        setOpened(false);
    };
    useEffect(() => {
        if (opened) {
            console.log(art);
            setTitle(art?.title);
            setDesc(art?.description);
            const url = base64ToUrl(art?.image, art?.mimeType);
            setFileProps({
                previewImage: url || '',
                previewTitle: art?.title || '',
            });
        }
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
