/* eslint-disable max-len */
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Context from '@models/additional-content/context.model';
import useMobx from '@stores/root-store';
import { Button, Form, Input, message, Modal, Popover, UploadFile } from 'antd';
import normaliseWhitespaces from '@/app/common/utils/normaliseWhitespaces';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import VALIDATION_MESSAGES from '@/app/common/constants/validation-messages.constants';
import SUCCESS_MESSAGES from '@/app/common/constants/success-messages.constants';
import REQUIRED_FIELD_MESSAGES from '@/app/common/constants/required_field_messages.constrants';
import MODAL_MESSAGES from '@/app/common/constants/modal-messages.constants';

interface ContextAdminProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isModalVisible: boolean;
    initialData?: Context;
    isNewContext?: (data: boolean) => void;
}

const ContextAdminModalComponent: React.FC<ContextAdminProps> = observer(({
    isModalVisible,
    setIsModalOpen,
    initialData,
    isNewContext
}) => {
    const {contextStore} = useMobx();
    const [form] = Form.useForm();
    const isEditing = !!initialData;
	const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
			  setIsSaveButtonDisabled(true);
    };

    useAsync(() => contextStore.fetchContexts(), []);

    useEffect(() => {
        if (initialData && isModalVisible) {
            form.setFieldsValue({
                title: initialData.title,
            });
        }
    }, [initialData, isModalVisible, form]);

    const validateContext = uniquenessValidator(
        ()=>(contextStore.getContextArray.map((context) => context.title)), 
        ()=>(initialData?.title), 
        VALIDATION_MESSAGES.DUPLICATE_CONTEXT_TITLE
    );

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentContext = {
            ...(initialData?.id && { id: initialData?.id }),
            title: (formData.title as string).trim(),
        };

        if (currentContext.title === initialData?.title) return;

        if (currentContext.id) {
            await contextStore.updateContext(currentContext as Context);
        } else {
            await contextStore.createContext(currentContext);
        }

        if (isNewContext !== undefined) {
            isNewContext(true);
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
            message.success(SUCCESS_MESSAGES.CONTEXT_SAVED);
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

    const MAX_LENGTH = {
        title: 50,
    };

		const handleInputChange = () => setIsSaveButtonDisabled(false);

    return (
        <Modal
            className="modalContainer"
            open={isModalVisible}
            onCancel={closeModal}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content={MODAL_MESSAGES.REMINDER_TO_SAVE} trigger="hover">
                    <CancelBtn className="iconSize" onClick={handleCancel} />
                </Popover>
            )}
        >
            <div className="modalContainer-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                    initialValues={initialData}
                    onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : ''}
                >
                    <div className="center">
                        <h2>{isEditing ? 'Редагувати контекст' : 'Додати новий контекст'}</h2>
                    </div>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{required: true, message: REQUIRED_FIELD_MESSAGES.ENTER_TITLE, max: MAX_LENGTH.title},
                            {validator: validateContext}
                        ]}
                        getValueProps={(value) => ({ value: normaliseWhitespaces(value) })}
                    >
                        <Input maxLength={MAX_LENGTH.title} showCount onChange={handleInputChange} />
                    </Form.Item>

                    <div className="center">
                        <Button
								            disabled={isSaveButtonDisabled}
                            className="streetcode-custom-button"
                            onClick={() => handleOk()}
                        >
                            Зберегти
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
});

export default ContextAdminModalComponent;
