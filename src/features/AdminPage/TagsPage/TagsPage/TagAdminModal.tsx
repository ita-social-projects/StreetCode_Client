import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import React, {
    Dispatch, SetStateAction, useEffect
} from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, message, Modal, Popover
} from 'antd';

import Tag from '@/models/additional-content/tag.model';

interface SourceModalProps {
    isModalVisible: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    initialData?: Tag;
    isNewTag?: (data: boolean) => void;
}

const SourceModal: React.FC<SourceModalProps> = ({
    isModalVisible,
    setIsModalOpen,
    initialData,
    isNewTag,
}) => {
    const { tagsStore } = useMobx();
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    useAsync(() => tagsStore.fetchTags(), []);

    useEffect(() => {
        if (initialData && isModalVisible) {
            form.setFieldsValue({
                title: initialData.title,
            });
        }
    }, [initialData, isModalVisible, form]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const validateTag = async (rule: any, value: string) => {
        return new Promise<void>((resolve, reject) => {
            if (tagsStore.getTagArray.map((tag) => tag.title).includes(value)) {
                reject('Тег з такою назвою вже існує');
            } else {
                resolve();
            }
        });
    };

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentTag = {
            ...(initialData?.id && { id : initialData?.id }),
            title: formData.title,
        };

        if (currentTag.id) {
            await tagsStore.updateTag(currentTag as Tag);
        } else {
            await tagsStore.createTag(currentTag);
        }

        if (isNewTag !== undefined) {
            isNewTag(true);
        }
    };

    const handleCancel = () => {
        closeModal();
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('Тег успішно додано!', 2);
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
                title={isEditing ? 'Редагувати тег' : 'Додати новий тег'}
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
                <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialData} onKeyDown={(e)=> e.key == "Enter" ? e.preventDefault(): ''}>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву' },
                            {validator: validateTag}
                        ]}
                    >
                        <Input placeholder="Title" maxLength={50} showCount />
                    </Form.Item>
                    <div className="center">
                        <Button
                            className="streetcode-custom-button"
                            onClick={() => handleOk()}
                        >
                            Зберегти
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default SourceModal;
