import React, { useRef, useState } from 'react';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, UploadFile,
} from 'antd';

import Audio from '@/models/media/audio.model';

import PreviewFileModal from '../../NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';

interface AddSourceModalProps {
    isAddModalVisible: boolean;
    handleAddCancel: () => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({
    isAddModalVisible,
    handleAddCancel,
}) => {
    const { sourcesAdminStore } = useMobx();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [image, setImage] = useState<Image>();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    useAsync(() => sourcesAdminStore.fetchSourceCategories(), []);

    async function onSubmit(formData: any) {
        handleAddCancel();
        const newSource: SourceCategoryAdmin = {
            id: 0,
            title: formData.title,
            imageId: imageId.current,
            image,
        };
        await sourcesAdminStore.addSourceCategory(newSource);
        form.resetFields();
    }

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const handleCancel = () => {
        handleAddCancel();
        form.resetFields();
    };

    return (
        <div>
            <Modal
                title="Додати категорію"
                open={isAddModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву' }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Картинка: "
                        rules={[{ required: true, message: 'Додайте зображення' }]}
                    >
                        <FileUploader
                            multiple={false}
                            accept=".jpeg,.png,.jpg"
                            listType="picture-card"
                            maxCount={1}
                            uploadTo="image"
                            onSuccessUpload={(img: Image | Audio) => {
                                imageId.current = img.id;
                                setImage(img as Image);
                            }}
                            onRemove={() => {
                                ImagesApi.delete(imageId.current);
                            }}
                            onPreview={handlePreview}
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

export default AddSourceModal;
