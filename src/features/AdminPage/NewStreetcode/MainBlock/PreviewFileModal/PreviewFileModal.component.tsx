import './PreviewFileModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { message, Modal, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';

export const getBase64 = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

interface Props {
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    file: UploadFile | null,
}

const PreviewFileModal = ({ opened, setOpened, file }: Props) => {
    const [previewImage, setPreviewImage] = useState<string | undefined>();

    useEffect(() => {
        const loadPreviewImage = async () => {
            if (!file) {
                setPreviewImage(undefined);
                return;
            }
            let imageToPreview = file.url ?? file.thumbUrl;

            if (!file.preview) {
                const originFileObj = file.originFileObj as RcFile;
                if (originFileObj instanceof Blob) {
                    try {
                        const result = await getBase64(originFileObj);
                        imageToPreview = result;
                    } catch (error) {
                        message.error('Помилка при перегляді фото');
                        setPreviewImage(undefined);
                        return;
                    }
                }
            } else {
                imageToPreview = file.preview;
            }
            setPreviewImage(imageToPreview);
        };

        loadPreviewImage();
    }, [file]);

    const handleCancel = () => {
        setOpened(false);
    };

    return (
        <Modal open={opened} footer={null} onCancel={handleCancel}>
            <div className="modal-item-image">
                {previewImage && <img alt="uploaded" src={previewImage} />}
            </div>
        </Modal>
    );
};

export default PreviewFileModal;
