/* eslint-disable complexity */
import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import { Form, useParams } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';

import { Image, UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Upload from 'antd/es/upload/Upload';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import useMobx from '@/app/stores/root-store';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';

const FileInputsPart: React.FC = () => {
    const { newStreetcodeInfoStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [images, setImages] = useState<UploadFile[]>([]);
    const [image1, setImage1] = useState<UploadFile>();
    const [image2, setImage2] = useState<UploadFile>();
    const [image3, setImage3] = useState<UploadFile>();
    const [audios, setAudios] = useState<UploadFile[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    const afterBlackAndWhiteUpload = (image: Image) => {
        newStreetcodeInfoStore.BlackAndWhiteId = image.id;
    };
    const afterAnimationUpload = (image: Image) => {
        newStreetcodeInfoStore.AnimationId = image.id;
    };
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    useEffect(() => {
        if (parseId) {
            const fetchData = async () => {
                try {
                    await ImagesApi.getByStreetcodeId(parseId).then((result) => {
                        const newFileList = result.map((art: Image) => ({
                            uid: art.id,
                            name: art.alt,
                            status: 'done',
                            thumbUrl: base64ToUrl(art.base64, art.mimeType) ?? '',
                            type: art.mimeType,
                        }));

                        newStreetcodeInfoStore.AnimationId = result[0] ? result[0].id : -1;
                        newStreetcodeInfoStore.BlackAndWhiteId = result[1] ? result[1].id : -1;
                        newStreetcodeInfoStore.relatedFigureId = result[2] ? result[2].id : null;
                        setImages([...newFileList]);
                    });
                    await AudiosApi.getByStreetcodeId(parseId).then((result) => {
                        const newAudio: UploadFile = {
                            uid: `${result.id}`,
                            name: 'audio',
                            status: 'done',
                            thumbUrl: base64ToUrl(result.base64, result.mimeType) ?? '',
                            type: result.mimeType,
                        };
                        newStreetcodeInfoStore.audioId = result.id;
                        setAudios([newAudio]);
                    });
                } catch (error) { /* empty */ } finally { /* empty */ }
            };
            fetchData();
        }
    }, []);

    return (
        <div>
            <div className="photo-uploader-container">
                <FormItem
                    name="animations"
                    label="Анімація"
                    rules={[{ required: !(parseId && images.length > 0), message: parseId ? 'Змінити анімацію' : 'Завантажте анімацію' }]}
                >
                    <FileUploader
                        accept=".gif"
                        listType="picture-card"
                        multiple={false}
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={afterAnimationUpload}
                        onRemove={(file) => {
                            ImagesApi.delete(newStreetcodeInfoStore.animationId!);
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 0 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureBlackWhite"
                    label="Чорнобіле"
                    rules={[{ required: !(parseId && images.length > 1), message: parseId ? 'Змінити анімацію' : 'Завантажте анімацію' }]}
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={afterBlackAndWhiteUpload}
                        onRemove={(file) => {
                            ImagesApi.delete(newStreetcodeInfoStore.blackAndWhiteId!);
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 1 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureRelations"
                    label="Для зв'язків"
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(image:Image) => {
                            newStreetcodeInfoStore.relatedFigureId = image.id;
                        }}
                        onRemove={(file) => {
                            ImagesApi.delete(newStreetcodeInfoStore.relatedFigureId!);
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 2 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>
            </div>
            <div className="display-flex-row">
                <FormItem
                    name="audio"
                    label="Аудіо"
                >
                    <FileUploader
                        accept=".mp3"
                        maxCount={1}
                        listType="picture-card"
                        uploadTo="audio"
                        onRemove={(file) => {
                            AudiosApi.delete(newStreetcodeInfoStore.audioId!);
                        }}
                        onSuccessUpload={(audio:Audio) => {
                            newStreetcodeInfoStore.audioId = audio.id;
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && audios.length > 0 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>
            </div>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
export default FileInputsPart;
