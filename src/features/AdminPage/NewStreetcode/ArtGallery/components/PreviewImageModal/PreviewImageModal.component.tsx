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

const PreviewFileModal:React.FC<{
     opened:boolean, setOpened:React.Dispatch<React.SetStateAction<boolean>>, file: UploadFile | null
    }> = ({ opened, setOpened, file }) => {
        const [fileProps, setFileProps] = useState<{
             previewImage:string, previewTitle:string }>({ previewImage: '', previewTitle: '' });
        const handleCancel = () => {
            setOpened(false);
        };
        useEffect(() => {
            async function uploadImageToModal() {
                if (file) {
                    if (!file.url && !file.preview) {
                        // eslint-disable-next-line no-param-reassign
                        file.preview = await getBase64(file.originFileObj as RcFile);
                    }
                    setFileProps({ previewImage: file.url || (file.preview as string),
                                   previewTitle: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1) });
                }
            }
            uploadImageToModal();
        }, [opened, file]);
        return (
            <Modal open={opened} title="Додаткові дані" style={{ top: 50 }} footer={null} onCancel={handleCancel}>
                <div className="artPreviewModal">
                    <img alt="uploaded" src={fileProps.previewImage} />
                    <p>Title</p>
                    <input />
                    <p>Description</p>
                    <textarea />
                    <button className="saveButton">Зберегти</button>
                </div>
            </Modal>
        );
    };
export default PreviewFileModal;
