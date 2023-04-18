import './MainBlockAdmin.style.scss';

import React, { useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';

import { UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import useMobx from '@/app/stores/root-store';
import Image from '@/models/media/image.model';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';

const FileInputsPart:React.FC = () => {
    const { newStreetcodeFilesStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    const afterBlackAndWhiteUpload = (image:Image) => {
        newStreetcodeFilesStore.BlackAndWhiteId = image.id;
    };
    const afterAnimationUpload = (image:Image) => {
        newStreetcodeFilesStore.AnimationId = image.id;
    };
    return (
        <div className="file-upload-container">
            <div className="photo-uploader-container">
                <FormItem
                    name="animations"
                    className="maincard-item photo-form-item"
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
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureBlackWhite"
                    className="maincard-item photo-form-item"
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
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureRelations"
                    className="maincard-item photo-form-item"
                    label="Для зв'язків"
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </FileUploader>
                </FormItem>
            </div>

            <FormItem
                name="audio"
                className="maincard-item"
                label="Аудіо"
            >
                <FileUploader
                    accept=".mp3"
                    maxCount={1}
                    uploadTo="audio"
                >
                    <div className="audio-upload-box">
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </div>
                </FileUploader>
            </FormItem>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
export default FileInputsPart;
