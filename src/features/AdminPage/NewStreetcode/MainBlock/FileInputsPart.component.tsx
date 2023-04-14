import './MainBlockAdmin.style.scss';

import React, { useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

import { Upload, UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/es/upload';

import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import { ImageCreate } from '@/models/media/image.model';

import PreviewFileModal, { getBase64 } from './PreviewFileModal/PreviewFileModal.component';

const FileInputsPart:React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
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
