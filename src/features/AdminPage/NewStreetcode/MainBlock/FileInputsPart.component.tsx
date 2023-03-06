import './MainBlockAdmin.style.scss';

import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';

import { Upload, UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Dragger from 'antd/es/upload/Dragger';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';

const FileInputsPart:React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    return (
        <div className="file-upload-container">

            <FormItem
                name="animations"
                className="maincard-item"
                label="Анімація"
                rules={[{ required: true, message: 'Завантажте анімацію' }]}
            >

                <Upload
                    accept=".gif"
                    listType="picture-card"
                    multiple={false}
                    maxCount={1}
                    onPreview={handlePreview}
                >
                    <InboxOutlined />
                    <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                </Upload>
            </FormItem>
            <div className="photo-uploader-container">
                <FormItem
                    name="pictureBlackWhite"
                    className="maincard-item photo-form-item"
                    label="Чорнобіле"
                    rules={[{ required: true, message: 'Завантажте зображення' }]}
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Upload>
                </FormItem>

                <FormItem
                    name="pictureColor"
                    className="maincard-item photo-form-item"
                    label="Кольорове"
                    rules={[{ required: true, message: 'Завантажте зображення' }]}
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Upload>
                </FormItem>

                <FormItem
                    name="pictureRelations"
                    className="maincard-item photo-form-item"
                    label="Для зв'язків"
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Upload>
                </FormItem>
            </div>

            <FormItem
                name="audio"
                className="maincard-item"
                label="Аудіо"
            >
                <Dragger
                    accept=".mp3"
                >
                    <InboxOutlined />

                    <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                </Dragger>
            </FormItem>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
export default FileInputsPart;
