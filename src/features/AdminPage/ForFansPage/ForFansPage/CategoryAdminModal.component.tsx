import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';

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

    return (
        <Modal
            title="Додати категорію"
            visible={isAddModalVisible}
            onCancel={handleAddCancel}
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
                        onSuccessUpload={(img: Image) => {
                            imageId.current = img.id;
                            setImage(img);
                        }}
                        onRemove={() => {
                            ImagesApi.delete(imageId.current);
                        }}
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
    );
};

export default AddSourceModal;
