import './PreviewFileModal.styles.scss';

import React from 'react';

import { Modal, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';

export const getBase64 = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

interface Props {
    opened:boolean,
    setOpened:React.Dispatch<React.SetStateAction<boolean>>,
    file: UploadFile | null,
}

const PreviewFileModal = ({ opened, setOpened, file }: Props) => {
    const handleCancel = () => {
        setOpened(false);
    };

    return (
        <Modal open={opened} title={file?.name} footer={null} onCancel={handleCancel}>
            <div className="modal-item-image">
                <img alt="uploaded" src={file?.thumbUrl} />
            </div>
        </Modal>
    );
};
export default PreviewFileModal;
