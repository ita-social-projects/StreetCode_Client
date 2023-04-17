import React, { useRef } from 'react';
import { InboxOutlined } from '@ant-design/icons';

import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import ImagesApi from '@/app/api/media/images.api';
import Audio, { AudioCreate } from '@/models/media/audio.model';
import Image, { ImageCreate } from '@/models/media/image.model';

type UploaderWithoutChildren = Omit<UploadProps, 'children'>;

interface Props extends UploaderWithoutChildren {
    children: JSX.Element[] | JSX.Element;
    edgeSwipe?: boolean;
    uploadTo:'image' | 'audio';
    onSuccessUpload?:(value:Image | Audio)=>void;
}
const FileUploader:React.FC<Props> = ({ onSuccessUpload, uploadTo, children, ...uploadProps }) => {
    const imageDataAsURL = useRef<any | null>(null);
    const onUploadChange = (uploadParams:UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onloadend = (obj) => {
            imageDataAsURL.current = obj.target?.result;
        };
        reader.readAsDataURL(uploadParams.file.originFileObj as RcFile);
        if (uploadProps.onChange) {
            uploadProps.onChange(uploadParams);
        }
    };
    const onFileUpload = (uploadType:'image' | 'audio', uplFile:UploadFile)
    :Promise< Image | Audio> => {
        if (uploadType === 'audio') {
            const audio :AudioCreate = {
                baseFormat: imageDataAsURL.current
                    .substring(imageDataAsURL.current.indexOf(',') + 1, imageDataAsURL.current.length),
                extension: uplFile.name.substring(uplFile.name
                    .lastIndexOf('.') + 1, uplFile.name.length),
                mimeType: uplFile.type!,
                title: uplFile.name,
            };
        }
        const image: ImageCreate = { baseFormat: imageDataAsURL.current
            .substring(imageDataAsURL.current.indexOf(',') + 1, imageDataAsURL.current.length),
                                     extension: uplFile.name.substring(uplFile.name
                                         .lastIndexOf('.') + 1, uplFile.name.length),
                                     mimeType: uplFile.type!,
                                     alt: uplFile.name,
                                     title: uplFile.name };
        return ImagesApi.create(image);
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
                    onFileUpload(uploadTo, uplFile)
                        .then((respones) => {
                            onSuccess(respones);
                            if (onSuccessUpload) {
                                onSuccessUpload(respones);
                            }
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
