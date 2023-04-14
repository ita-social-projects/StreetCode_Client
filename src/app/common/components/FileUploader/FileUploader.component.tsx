import React, { useRef } from 'react';
import { InboxOutlined } from '@ant-design/icons';

import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import ImagesApi from '@/app/api/media/images.api';
import { ImageCreate } from '@/models/media/image.model';

type UploaderWithoutChildren = Omit<UploadProps, 'children'>;

interface Props extends UploaderWithoutChildren {
    children: JSX.Element[] | JSX.Element;
    edgeSwipe?: boolean;
}
const FileUploader:React.FC<Props> = ({ children, ...uploadProps }) => {
    const imageDataAsURL = useRef<any | null>(null);
    const onUploadChange = (uploadParams:UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onloadend = (obj) => {
            imageDataAsURL.current = obj.target?.result;
        };
        reader.readAsDataURL(uploadParams.file.originFileObj as RcFile);
    };
    const customRequest = async (options: UploadRequestOption<any>) => {
        const {
            onSuccess, onError, file, action, onProgress,
        } = options;
        const uplFile = file as UploadFile;
        const checkInfo = () => {
            setTimeout(async () => {
                if (!imageDataAsURL.current) {
                    checkInfo();
                } else {
                    const image: ImageCreate = { baseFormat: imageDataAsURL.current
                        .substring(imageDataAsURL.current.indexOf(',') + 1, imageDataAsURL.current.length),
                                                 extension: uplFile.name.substring(uplFile.name
                                                     .lastIndexOf('.') + 1, uplFile.name.length),
                                                 mimeType: uplFile.type!,
                                                 alt: uplFile.name,
                                                 title: uplFile.name };
                    ImagesApi.create(image)
                        .then((respones) => {
                            onSuccess(respones);
                        })
                        .catch((err) => {
                            onError(err);
                        });
                }
            }, 150);
        };

        checkInfo();
    };
    return (
        <Upload
            {...uploadProps}
            customRequest={customRequest}
            onChange={onUploadChange}
        >
            {children}
        </Upload>
    );
};
export default FileUploader;
