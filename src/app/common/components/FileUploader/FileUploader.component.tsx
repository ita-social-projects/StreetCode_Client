import React, { useRef } from 'react';

import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import Audio, {AudioCreate, AudioUpdate} from '@/models/media/audio.model'
import Image, { ImageCreate } from '@/models/media/image.model';

type UploaderWithoutChildren = Omit<UploadProps, 'children'>;

interface Props extends UploaderWithoutChildren {
    children: JSX.Element[] | JSX.Element;
    edgeSwipe?: boolean;
    uploadTo:'image' | 'audio';
    onSuccessUpload?:(value:Image | Audio)=>void;
}
const FileUploader:React.FC<Props> = ({ onSuccessUpload, uploadTo, children, ...uploadProps }) => {
    const imageOrAudioDataAsURL = useRef<any[]>([]);
    const onUploadChange = (uploadParams: UploadChangeParam<UploadFile<any>>) => {
        if(!imageOrAudioDataAsURL.current.find(el => el.uid === uploadParams.file.uid)){
            const reader = new FileReader();
            reader.onloadend = (obj) => {
                imageOrAudioDataAsURL.current.push({base64: obj.target?.result, name: uploadParams.file.name, uid: uploadParams.file.uid});
            };
            if (uploadParams.fileList.length === 0) {
                imageOrAudioDataAsURL.current = [];
            } else {
                const file = uploadParams.file.originFileObj as RcFile;
                if (file) {
                    reader.readAsDataURL(file);
                }
            }
            if (uploadProps.onChange) {
                uploadProps.onChange(uploadParams);
            }
        }
    };
    const onFileUpload = (uploadType:'image' | 'audio', uplFile:UploadFile)
    :Promise< Image | Audio> => {
        let imageOrAudioData = imageOrAudioDataAsURL.current.filter((el: any) => el.name === uplFile.name)[0]?.base64;

        const imageOrAudio: ImageCreate = {
            baseFormat: imageOrAudioData?.substring(imageOrAudioData?.indexOf(',') + 1, imageOrAudioData?.length),
            extension: uplFile.name.substring(uplFile.name
                .lastIndexOf('.') + 1, uplFile.name.length),
            mimeType: uplFile.type!,
            title: uplFile.name
        };

        if (uploadType === 'audio') {
            return AudiosApi.create(imageOrAudio as AudioCreate);
        }else{
            return ImagesApi.create(imageOrAudio as ImageCreate);
        }
    };
    const customRequest = async (options:any) => {
        const {
            onSuccess, onError, file, action, onProgress,
        } = options;
        const uplFile = file as UploadFile;
        const checkInfo = () => {
            setTimeout(async () => {
                if (!imageOrAudioDataAsURL.current) {
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
            multiple
            {...uploadProps}
            customRequest={customRequest}
            onChange={onUploadChange}
        >
            {children}
        </Upload>
    );
};
export default FileUploader;
