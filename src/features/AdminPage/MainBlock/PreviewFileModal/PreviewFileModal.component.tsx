import React, { useEffect, useState } from 'react';

import { Modal, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';

const getBase64 = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

const PreviewFileModal:React.FC<{
     opened:boolean, setOpened, file: UploadFile
    }> = ({ opened, setOpened, file }) => {
        const [fileProps, setFileProps] = useState<{ previewImage:string, previewTitile:string }>({ previewImage: '', previewTitile: '' });

        const handleCancel = () => {
            setOpened(false);
        };
        useEffect(() => {
            async function uploadImageToModal() {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj as RcFile);
                }
                setFileProps({ previewImage: file.url || (file.preview as string),
                               previewTitile: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1) });
                setOpened(true);
            }
            uploadImageToModal();
        }, [opened]);
        return (
            <Modal open={opened} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        );
    };
export default PreviewFileModal;
