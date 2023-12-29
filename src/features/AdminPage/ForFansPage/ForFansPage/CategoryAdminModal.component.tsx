import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import React, {
    Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Audio from '@models/media/audio.model';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, message, Modal, Popover,
    UploadFile,
} from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import PreviewFileModal from '../../NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';

interface SourceModalProps {
    isModalVisible: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    initialData?: SourceCategoryAdmin;
    isNewCategory?: (data: boolean) => void;
}

const SourceModal: React.FC<SourceModalProps> = ({
    isModalVisible,
    setIsModalOpen,
    initialData,
    isNewCategory,
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
        }
    }, [initialData, isModalVisible, form]);

    const handleImageChange = (img: Image | Audio) => {
        imageId.current = img.id;
        setImage(img as Image);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentSource: SourceCategoryAdmin = {
            id: initialData ? initialData.id : 0,
            title: formData.title,
            imageId: imageId.current,
            image,
        };
        sourcesAdminStore.getSourcesAdmin.map((t) => t).forEach((t) => {
            if (formData.title == t.title || imageId.current == t.imageId) currentSource.id = t.id;
        });

        if (currentSource.id) {
            await sourcesAdminStore.updateSourceCategory(currentSource);
        } else {
            await sourcesAdminStore.addSourceCategory(currentSource);
        }

        if (isNewCategory !== undefined) {
            isNewCategory(true);
        }
    };

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const handleCancel = () => {
        closeModal();
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

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('Категорію успішно додано!', 2);
        } catch (error) {
            message.config({
                top: 100,
                duration: 3,
                maxCount: 3,
                rtl: true,
                prefixCls: 'my-message',
            });
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    return (
        <>
            <Modal
                title={isEditing ? 'Редагувати категорію' : 'Додати нову категорію'}
                open={isModalVisible}
                onCancel={closeModal}
                className="modalContainer"
                closeIcon={(
                    <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                        <CancelBtn className="iconSize" onClick={handleCancel} />
                    </Popover>
                )}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialData}>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву' }]}
                    >
                        <Input placeholder="Title" maxLength={23} showCount />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Картинка: "
                        rules={[{ required: true, message: 'Додайте зображення' }]}
                        getValueFromEvent={getValueFromEvent}
                        style={{ filter: 'grayscale(100%)' }}
                    >
                        <FileUploader
                            greyFilterForImage
                            onChange={(param) => {
                                setFileList(param.fileList);
                            }}
                            multiple={false}
                            accept=".jpeg,.png,.jpg,.webp"
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
                        <Button
                            disabled={fileList?.length === 0}
                            className="streetcode-custom-button"
                            onClick={() => handleOk()}
                        >
                            Зберегти
                        </Button>
                    </div>
                </Form>
            </Modal>
            <PreviewFileModal greyFilterForImage file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </>
    );
};

export default SourceModal;
