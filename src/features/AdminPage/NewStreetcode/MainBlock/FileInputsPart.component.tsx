import './MainBlockAdmin.style.scss';

import React, { useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';

import { UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import useMobx from '@/app/stores/root-store';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';

const FileInputsPart:React.FC = () => {
    const { newStreetcodeInfoStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    const afterBlackAndWhiteUpload = (image:Image) => {
        newStreetcodeInfoStore.BlackAndWhiteId = image.id;
    };
    const afterAnimationUpload = (image:Image) => {
        newStreetcodeInfoStore.AnimationId = image.id;
    };
    return (
        <div>
            <div className="photo-uploader-container">
                <FormItem
                    name="animations"
                    label="Анімація"
                    rules={[{ required: true, message: 'Завантажте анімацію' }]}
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
                        <p className="ant-upload-text">+Додати</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureBlackWhite"
                    label="Чорнобіле"
                    rules={[{ required: true, message: 'Завантажте зображення' }]}
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
                        <p className="ant-upload-text">+Додати</p>
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
                        <p className="ant-upload-text">+Додати</p>
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
                        <p className="ant-upload-text">+Додати</p>
                </FileUploader>
            </FormItem>
            </div>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
export default FileInputsPart;
