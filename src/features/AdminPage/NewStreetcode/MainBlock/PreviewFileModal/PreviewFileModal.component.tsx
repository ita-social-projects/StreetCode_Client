import './PreviewFileModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { Modal, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';

export const getBase64 = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
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
                        if (file.originFileObj) {
                            // eslint-disable-next-line no-param-reassign
                            file.preview = await getBase64(file.originFileObj as RcFile);
                        }
                    }
                    const imageSrc = file.url || (file.preview as string) || file.thumbUrl || '';
                    setFileProps({ previewImage: imageSrc,
                                   previewTitle: file.name || '' });
                }
            }
            uploadImageToModal();
        }, [opened, file]);
        return (
            <Modal open={opened} title={fileProps.previewTitle} footer={null} onCancel={handleCancel}>
                <div className="modal-item-image">
                    <img alt="uploaded" src={fileProps.previewImage} />
                </div>
            </Modal>
        );
    };
export default PreviewFileModal;
