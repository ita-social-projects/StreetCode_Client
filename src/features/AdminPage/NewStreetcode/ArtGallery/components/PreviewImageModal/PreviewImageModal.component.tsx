import './PreviewImageModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

interface Props {
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    streetcodeArt: StreetcodeArtCreateUpdate;
    arts: StreetcodeArtCreateUpdate[],
    setArts: React.Dispatch<React.SetStateAction<StreetcodeArtCreateUpdate[]>>,
    onChange: (field: string, value: any) => void,
}

const PreviewFileModal = ({
    opened, setOpened, streetcodeArt, arts, setArts, onChange,
}: Props) => {
    const [fileProps, setFileProps] = useState<{
        previewImage: string, previewTitle: string
    }>({ previewImage: '', previewTitle: '' });
    const [newTitle, setTitle] = useState<string>('');
    const [newDesc, setDesc] = useState<string>('');

    const handleCancel = () => {
        setOpened(false);
    };

    const handleSave = () => {
        const updated = arts.find((x) => x.art.image.id === streetcodeArt.art.image.id);
        if (!updated) {
            return;
        }
        updated.art.title = newTitle;
        updated.art.description = newDesc;

        setArts([...arts]);
        setOpened(false);
        onChange('art', updated.art);
    };

    useEffect(() => {
        setTitle(streetcodeArt?.art.title ?? '');
        setDesc(streetcodeArt?.art.description ?? '');
        const url = base64ToUrl(streetcodeArt?.art.image.base64, streetcodeArt?.art.image.mimeType);
        setFileProps({
            previewImage: url || '',
            previewTitle: streetcodeArt?.art.title || '',
        });
    }, [opened]);

    return (
        <Modal open={opened} title="Додаткові дані" style={{ top: 50 }} footer={null} onCancel={handleCancel}>
            <div className="artPreviewModal">
                <img alt="uploaded" src={fileProps.previewImage} />
                <p>Title</p>
                <input value={newTitle} placeholder="title" onChange={(e) => setTitle(e.target.value)} />
                <p>Description</p>
                <textarea value={newDesc} placeholder="description" onChange={(e) => setDesc(e.target.value)} />
                <Button onClick={handleSave} className="saveButton">Зберегти</Button>
            </div>
        </Modal>
    );
};
export default PreviewFileModal;
