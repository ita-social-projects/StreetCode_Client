import React, { useEffect, useRef, useState } from 'react';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Audio from '@models/media/audio.model';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, UploadFile,
} from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import PreviewFileModal from '../../NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';

interface SourceModalProps {
    isModalVisible: boolean;
    onCancel: () => void;
    initialData?: SourceCategoryAdmin;
}

const SourceModal: React.FC<SourceModalProps> = ({
    isModalVisible,
    onCancel,
    initialData,
}) => {
    const { sourcesAdminStore } = useMobx();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [image, setImage] = useState<Image>();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const isEditing = !!initialData;
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useAsync(() => sourcesAdminStore.fetchSourceCategories(), []);

    const createFileListData = (img: Image) => {
        if (!initialData) {
            return [];
        }

        return [{
            name: '',
            url: base64ToUrl(img.base64, img.mimeType),
            thumbUrl: base64ToUrl(img.base64, img.mimeType),
            uid: `${initialData.id}`,
            status: 'done' as UploadFileStatus,
            type: img.mimeType,
        }];
    };

    useEffect(() => {
        if (initialData && isModalVisible) {
            imageId.current = initialData.imageId;
            form.setFieldsValue({
                title: initialData.title,
            });
            ImagesApi.getById(initialData.imageId)
                .then((img) => {
                    initialData.image = img;
                    form.setFieldsValue({
                        image: createFileListData(img),
                    });
                    setFileList(createFileListData(img));
                });
        } else {
            setFileList([]);
        }
    }, [initialData, isModalVisible, form]);

    const handleImageChange = (img: Image | Audio) => {
        imageId.current = img.id;
        setImage(img as Image);
    };

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentSource: SourceCategoryAdmin = {
            id: initialData ? initialData.id : 0,
            title: formData.title,
            imageId: imageId.current,
            image,
        };

        if (initialData) {
            await sourcesAdminStore.updateSourceCategory(currentSource);
        } else {
            await sourcesAdminStore.addSourceCategory(currentSource);
        }
        onCancel();
        form.resetFields();
    };

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const handleCancel = () => {
        onCancel();
        form.resetFields();
        setFileList([]);
    };

    const getValueFromEvent = (e: any) => {
        if (e && e.fileList) {
            return e.fileList;
        } if (e && e.file && e.fileList === undefined) {
            return [e.file];
        }
        return [];
    };

    return (
        <div>
            <Modal
                title={isEditing ? 'Редагувати категорію' : 'Додати нову категорію'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialData}>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву' }]}
                    >
                        <Input placeholder="Title" maxLength={100} showCount />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Картинка: "
                        rules={[{ required: true, message: 'Додайте зображення' }]}
                        getValueFromEvent={getValueFromEvent}
                    >
                        <FileUploader
                            onChange={(param) => {
                                setFileList(param.fileList);
                            }}
                            multiple={false}
                            accept=".jpeg,.png,.jpg"
                            listType="picture-card"
                            maxCount={1}
                            uploadTo="image"
                            fileList={fileList}
                            onSuccessUpload={handleImageChange}
                            onPreview={handlePreview}
                            defaultFileList={initialData
                                ? [{
                                    name: '',
                                    thumbUrl: base64ToUrl(initialData.image?.base64, initialData.image?.mimeType),
                                    uid: initialData.image?.id ? initialData.image.id.toString() : '-1',
                                    status: 'done',
                                }]
                                : []}
                        >
                            <p>Виберіть чи перетягніть файл</p>
                        </FileUploader>
                    </Form.Item>
                    <div className="center">
                        <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                            Зберегти
                        </Button>
                    </div>
                </Form>
            </Modal>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};

export default SourceModal;
