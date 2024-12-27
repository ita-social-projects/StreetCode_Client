import '@features/AdminPage/AdminModal.styles.scss';
import '@features/AdminPage/CategoriesPage/CategoriesPage/CategoryAdminModal.styles.scss';

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

import imageValidator, { checkImageFileType } from '@/app/common/components/modals/validators/imageValidator';

import {
    Button, Form, Input, message, Modal, Popover,
    UploadFile,
} from 'antd';
import { UploadChangeParam, UploadFileStatus } from 'antd/es/upload/interface';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import PreviewFileModal from '../../NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import normaliseWhitespaces from '@/app/common/utils/normaliseWhitespaces';

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
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

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
                    setImage(img);
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
        setIsSaveButtonDisabled(true);
    };

    const validateCategory = uniquenessValidator(
        () => (sourcesAdminStore.getSourcesAdmin.map((source) => source.title)),
        () => (initialData?.title),
        'Категорія з такою назвою вже існує',
    );

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentSource: SourceCategoryAdmin = {
            id: initialData ? initialData.id : 0,
            title: (formData.title as string).trim(),
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

    const handleOk = async () => {
        try {
            await form.validateFields();

            const title = form.getFieldValue('title');

            if (!title.trim()) {
                message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
                return;
            }
            form.submit();
            message.success(`Категорію успішно ${isEditing ? "змінено" : "додано"}!`, 2);
            setIsSaveButtonDisabled(true);
        } catch (error) {
            message.config({
                top: 100,
                duration: 3,
                maxCount: 3,
                prefixCls: 'my-message',
            });
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    const handleInputChange = () => setIsSaveButtonDisabled(false);

    const checkFile = (file: UploadFile) => checkImageFileType(file.type);

    const handleFileChange = async (param: UploadChangeParam<UploadFile<unknown>>) => {
        if (checkFile(param.file)) {
            setFileList(param.fileList);
        }
        handleInputChange();
    };

    const handleRemove = (file: UploadFile) => {
        setFileList([]);
        setImage(null!);
    };

    return (
        <>
            <Modal
                title={isEditing ? 'Редагувати категорію' : 'Додати нову категорію'}
                open={isModalVisible}
                onCancel={closeModal}
                className="modalContainer categoryModal"
                closeIcon={(
                    <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
                        <CancelBtn className="iconSize" onClick={handleCancel} />
                    </Popover>
                )}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialData}>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву' },
                        { validator: validateCategory }
                        ]}
                        getValueProps={(value) => ({ value: normaliseWhitespaces(value) })}
                    >
                        <Input placeholder="Title" maxLength={23} showCount onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Картинка: "
                        rules={[
                            { required: true, message: 'Додайте зображення' },
                            { validator: imageValidator },
                        ]}
                    >
                        <FileUploader
                            greyFilterForImage
                            multiple={false}
                            accept=".jpeg,.png,.jpg,.webp"
                            listType="picture-card"
                            maxCount={1}
                            uploadTo="image"
                            beforeUpload={checkFile}
                            onChange={handleFileChange}
                            fileList={fileList}
                            onSuccessUpload={handleImageChange}
                            onPreview={handlePreview}
                            onRemove={handleRemove}
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
                            disabled={fileList?.length === 0 || isSaveButtonDisabled}
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
