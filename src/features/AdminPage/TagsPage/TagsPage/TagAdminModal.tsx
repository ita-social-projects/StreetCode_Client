/* eslint-disable import/extensions */
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import BUTTON_LABELS from '@constants/buttonLabels';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, message, Modal, Popover,
} from 'antd';

import MODAL_MESSAGES from '@/app/common/constants/modal-messages.constants';
import REQUIRED_FIELD_MESSAGES from '@/app/common/constants/required_field_messages.constrants';
import SUCCESS_MESSAGES from '@/app/common/constants/success-messages.constants';
import VALIDATION_MESSAGES from '@/app/common/constants/validation-messages.constants';
import normaliseWhitespaces from '@/app/common/utils/normaliseWhitespaces';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
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
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    const updateSaveButtonState = () => {
        const title = form.getFieldValue('title')?.trim();
        const isChanged = initialData ? initialData.title !== title : true;
        const isEmpty = !title;
        const isExisting = isEmpty ? false : tagsStore.getTagArray.some((tag) => tag.title === title);

        setIsSaveButtonDisabled(!isChanged || isExisting || isEmpty);
    };

    useAsync(() => tagsStore.fetchAllTags(), []);

    useEffect(() => {
        if (initialData && isModalVisible) {
            form.setFieldsValue({
                title: initialData.title,
            });
        }
        updateSaveButtonState();
    }, [initialData, isModalVisible, form]);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsSaveButtonDisabled(true);
    };

    const validateTag = uniquenessValidator(
        () => (tagsStore.getTagArray.map((tag) => tag.title)),
        () => (initialData?.title),
        VALIDATION_MESSAGES.DUPLICATE_TAG_TITLE,
    );

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentTag = {
            ...(initialData?.id && { id: initialData?.id }),
            title: (formData.title as string).trim(),
        };

        if (currentTag.title === initialData?.title) return;

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
            message.success(SUCCESS_MESSAGES.TAG_SAVED, 2);
            setIsSaveButtonDisabled(true);
        } catch (error) {
            message.config({
                top: 100,
                duration: 3,
                maxCount: 3,
                prefixCls: 'my-message',
            });
            message.error(VALIDATION_MESSAGES.INVALID_VALIDATION);
        }
    };

    return (
        <Modal
            open={isModalVisible}
            onCancel={closeModal}
            className="modalContainer"
            closeIcon={(
                <Popover content={MODAL_MESSAGES.REMINDER_TO_SAVE} trigger="hover">
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
                onKeyDown={(e) => (e.key == 'Enter' ? e.preventDefault() : '')}
                onValuesChange={updateSaveButtonState}
            >
                <div className="center">
                    <h2>{isEditing ? 'Редагувати тег' : 'Додати тег'}</h2>
                </div>
                <Form.Item
                    name="title"
                    label="Назва: "
                    rules={[{ required: true, message: REQUIRED_FIELD_MESSAGES.ENTER_TITLE },
                        { validator: validateTag },
                    ]}
                    getValueProps={(value: string) => ({ value: normaliseWhitespaces(value) })}
                >
                    <Input maxLength={50} showCount />
                </Form.Item>
                <div className="center">
                    <Button
                        className="streetcode-custom-button"
                        disabled={isSaveButtonDisabled}
                        onClick={() => handleOk()}
                    >
                        {BUTTON_LABELS.SAVE}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default SourceModal;
