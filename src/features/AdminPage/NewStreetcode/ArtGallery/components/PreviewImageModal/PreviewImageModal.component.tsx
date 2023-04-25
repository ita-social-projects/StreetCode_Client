import './PreviewImageModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { Modal, UploadFile, Button } from 'antd';
import { RcFile } from 'antd/es/upload';

const getBase64 = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

interface Art {
    description: string;
    image: string;
    index: number;
    title: string;
    uid: any;
}

const PreviewFileModal: React.FC<{
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    file: UploadFile | null,
    art: Art | null;
    onSave: (art: Art) => void
}> = ({ opened, setOpened, file, onSave, art }) => {
    const [fileProps, setFileProps] = useState<{
        previewImage: string, previewTitle: string
    }>({ previewImage: '', previewTitle: '' });
    const [new_title, setTitle] = useState<string | null>(null);
    const [new_desc, setDesc] = useState<string | null>(null);
    const handleCancel = () => {
        setOpened(false);
    };
    const handleSave = () => {
        art.description = new_desc;
        art.title = new_title;
        onSave(art);
        setOpened(false);
    }
    useEffect(() => {
        setTitle(art?.title);
        setDesc(art?.description);
        async function uploadImageToModal() {
            if (file) {
                if (!file.url && !file.preview) {

                    file.preview = await getBase64(file.originFileObj as RcFile);
                }
                setFileProps({
                    previewImage: file.url || (file.preview as string),
                    previewTitle: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)

                });

            }
        }
        uploadImageToModal();
    }, [opened, file]);
    return (
        <Modal open={opened} title="Додаткові дані" style={{ top: 50 }} footer={null} onCancel={handleCancel}>
            <div className="artPreviewModal">
                <img alt="uploaded" src={fileProps.previewImage} />
                <p>Title</p>
                <input value={new_title} onChange={(e) => setTitle(e.target.value)} />
                <p>Description</p>
                <textarea value={new_desc } onChange={(e) => setDesc(e.target.value)}></textarea>
                <button onClick={handleSave} className="saveButton">Зберегти</button>
            </div>
        </Modal>
    );
};
export default PreviewFileModal;
