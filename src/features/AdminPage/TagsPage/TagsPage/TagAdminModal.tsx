import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import SubmitButton from '@components/SubmitButton.component';
import BUTTON_LABELS from '@constants/buttonLabels';
import { COMMON_TITLE } from '@constants/regex.constants';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';

import {
    Form, Input, message, Modal, Popover,
} from 'antd';

import normaliseWhitespaces from '@/app/common/utils/normaliseWhitespaces';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import Tag from '@/models/additional-content/tag.model';

import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';

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

    useAsync(() => tagsStore.fetchAllTags(), []);

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

    const validateTag = uniquenessValidator(
        () => (tagsStore.getTagArray.map((tag) => tag.title)),
        () => (initialData?.title),
        'Тег з такою назвою вже існує',
    );

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentTag = {
            ...(initialData?.id && { id: initialData?.id }),
            title: (formData.title as string).trim(),
        };

        if (currentTag.title === initialData?.title) {
            return;
        }

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
            message.success(`Тег успішно ${isEditing ? 'змінено' : 'додано'}!`, 2);
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

    return (
        <Modal
            open={isModalVisible}
            onCancel={closeModal}
            className="modalContainer"
            centered
            closeIcon={(
                <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
                    <CancelBtn className="iconSize" onClick={handleCancel} />
                </Popover>
            )}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={initialData}
                onKeyDown={(e) => (e.key === 'Enter' ? e.preventDefault() : '')}
            >
                <div className="center">
                    <h2>{isEditing ? 'Редагувати тег' : 'Додати тег'}</h2>
                </div>
                <Form.Item
                    name="title"
                    label="Назва:"
                    rules={[
                        { required: true, message: 'Введіть назву' },
                        { validator: validateTag },
                        {
                            pattern: COMMON_TITLE,
                            message: 'Назва не повинна містити спеціальних символів або цифр',
                        },
                    ]}
                    getValueProps={(value: string) => ({ value: normaliseWhitespaces(value) })}
                >
                    <Input placeholder="Title" maxLength={50} showCount />
                </Form.Item>
                <div className="center">
                    <SubmitButton
                        form={form}
                        initialData={initialData}
                        className="streetcode-custom-button"
                        onClick={() => handleOk()}
                    >
                        {BUTTON_LABELS.SAVE}
                    </SubmitButton>
                </div>
            </Form>
        </Modal>
    );
};

export default SourceModal;
