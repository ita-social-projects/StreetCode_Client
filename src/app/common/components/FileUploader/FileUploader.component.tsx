import * as React from 'react';
import { UploadRequestOption } from 'rc-upload/lib/interface';

import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import Audio, { AudioCreate } from '@/models/media/audio.model';
import ImageNew, { ImageAssigment, ImageCreate } from '@/models/media/image.model';

type UploaderWithoutChildren = Omit<UploadProps, 'children'>;

interface Props extends UploaderWithoutChildren {
    children: JSX.Element[] | JSX.Element;
    edgeSwipe?: boolean;
    uploadTo:'image' | 'audio';
    enableGrayscale?: boolean;
    imageType?: ImageAssigment;
    onSuccessUpload?:(value: ImageNew | Audio, file?: UploadFile)=>void;
}
const FileUploader:React.FC<Props> = ({
    onSuccessUpload, uploadTo, enableGrayscale = false, imageType, children, ...uploadProps
}) => {
    const applyGrayscale = (url:string) => new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            if (img.height > 0 && img.width > 0) {
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
                    resolve(canvas.toDataURL('image/webp'));
                } else {
                    reject(new Error('Failed to get canvas context'));
                }
            } else {
                reject(new Error('Image has invalid dimensions'));
            }
        };

        img.onerror = (e) => {
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });

    const onUploadChange = (uploadParams: UploadChangeParam<UploadFile<any>>) => {
        if (uploadProps.onChange) {
            uploadProps.onChange(uploadParams);
        }
    };

    const onFileUpload = (uploadType:'image' | 'audio', uplFile:UploadFile, url: string)
    :Promise< ImageNew | Audio> => {
        if (uploadType === 'audio') {
            const audio :AudioCreate = {
                baseFormat: url
                    .substring(url.indexOf(',') + 1, url.length),
                extension: uplFile.name.substring(uplFile.name
                    .lastIndexOf('.') + 1, uplFile.name.length),
                mimeType: uplFile.type!,
                title: uplFile.name,
            };
            return AudiosApi.create(audio);
        }
        const image: ImageCreate = { baseFormat: url
            .substring(url.indexOf(',') + 1, url.length),
                                     extension: uplFile.name.substring(uplFile.name
                                         .lastIndexOf('.') + 1, uplFile.name.length),
                                     mimeType: uplFile.type!,
                                     title: uplFile.name,
                                     alt: imageType !== undefined ? imageType.toString() : '0' };
        return ImagesApi.create(image);
    };

    const customRequest = async (options: UploadRequestOption) => {
        const { onSuccess, onError, action, onProgress } = options;

        const reader = new FileReader();

        reader.onloadend = async (obj) => {
            let baseString: any;
            baseString = obj.target?.result;
            if (enableGrayscale || imageType === ImageAssigment.blackandwhite) {
                await applyGrayscale(baseString).then((greyScaleUrl) => {
                    baseString = greyScaleUrl;
                });
            }

            await onFileUpload(uploadTo, file, baseString)
                .then((respones) => {
                    if (onSuccess) {
                        onSuccess(respones);
                    }
                    if (onSuccessUpload) {
                        onSuccessUpload(respones, file);
                    }
                })
                .catch((err) => {
                    if (onError) {
                        onError(err);
                    }
                });
        };

        const file = options.file as RcFile;

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <Upload
            {...uploadProps}
            customRequest={customRequest}
            onChange={onUploadChange}
            data-testid="fileuploader"
        >
            {children}
        </Upload>
    );
};
export default FileUploader;
