import React, { useRef } from 'react';

import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import Audio, { AudioCreate } from '@/models/media/audio.model';
import ImageCustom, { ImageCreate } from '@/models/media/image.model';

type UploaderWithoutChildren = Omit<UploadProps, 'children'>;

interface Props extends UploaderWithoutChildren {
    multiple?: boolean;
    children: JSX.Element[] | JSX.Element;
    edgeSwipe?: boolean;
    uploadTo:'image' | 'audio';
    greyFilterForImage: boolean;
    onSuccessUpload?:(value:ImageCustom | Audio)=>void;
}
const FileUploader:React.FC<Props> = ({
    onSuccessUpload, uploadTo, greyFilterForImage = false, children, ...uploadProps
}) => {
    const imageOrAudioDataAsURL = useRef<any[]>([]);
    const onUploadChange = (uploadParams: UploadChangeParam<UploadFile<any>>) => {
        if (!imageOrAudioDataAsURL.current.find((el) => el.uid === uploadParams.file.uid)) {
            const reader = new FileReader();
            reader.onloadend = (obj) => {
                let base64 = obj.target?.result;

                if (greyFilterForImage && base64) {
                    const img = new Image();
                    if (typeof base64 === 'string') {
                        img.src = base64;
                    }
                    if (img.height > 0 && img.width > 0 && img.src) {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        if (context !== null) {
                            canvas.width = img.width;
                            canvas.height = img.height;

                            context.drawImage(img, 0, 0);

                            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            const { data } = imageData;

                            for (let i = 0; i < data.length; i += 4) {
                                const red = data[i];
                                const green = data[i + 1];
                                const blue = data[i + 2];

                                const grayscale = (red + green + blue) / 3;

                                data[i] = grayscale;
                                data[i + 1] = grayscale;
                                data[i + 2] = grayscale;
                            }

                            context.putImageData(imageData, 0, 0);

                            base64 = canvas.toDataURL('image/webp');
                        }
                    }
                }

                imageOrAudioDataAsURL.current.push(
                    {
                        base64,
                        name: uploadParams.file.name,
                        uid: uploadParams.file.uid,
                    },
                );
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
    :Promise< ImageCustom | Audio> => {
        const imageOrAudioData = imageOrAudioDataAsURL.current.filter((el: any) => el.name === uplFile.name)[0]?.base64;

        const imageOrAudio: ImageCreate = {
            baseFormat: imageOrAudioData?.substring(
                (imageOrAudioData?.indexOf(',') || 0) + 1,
                imageOrAudioData?.length,
            ),
            extension: uplFile.name.substring(uplFile.name
                .lastIndexOf('.') + 1, uplFile.name.length),
            mimeType: uplFile.type!,
            title: uplFile.name,
        };

        if (uploadType === 'audio') {
            return AudiosApi.create(imageOrAudio as AudioCreate);
        }
        return ImagesApi.create(imageOrAudio as ImageCreate);
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
            {...uploadProps}
            customRequest={customRequest}
            onChange={onUploadChange}
        >
            {children}
        </Upload>
    );
};
export default FileUploader;
