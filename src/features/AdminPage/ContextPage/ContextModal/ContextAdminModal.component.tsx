/* eslint-disable max-len */
import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import SubmitButton from '@components/SubmitButton.component';
import BUTTON_LABELS from '@constants/buttonLabels';
import { COMMON_TITLE } from '@constants/regex.constants';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Context from '@models/additional-content/context.model';
import useMobx from '@stores/root-store';

import {
    Form, Input, message, Modal, Popover,
} from 'antd';

import normaliseWhitespaces from '@/app/common/utils/normaliseWhitespaces';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';

import POPOVER_CONTENT from '../../JobsPage/JobsModal/constants/popoverContent';

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
    isNewContext,
}) => {
    const { contextStore } = useMobx();
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    const closeModal = () => {
        setIsModalOpen(false);
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
        () => (contextStore.getContextArray.map((context) => context.title)),
        () => (initialData?.title),
        'Контекст з такою назвою вже існує',
    );

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentContext = {
            ...(initialData?.id && { id: initialData?.id }),
            title: (formData.title as string).trim(),
        };

        if (currentContext.title === initialData?.title) {
            return;
        }

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
            message.success(`Контекст успішно ${isEditing ? 'змінено' : 'додано'}!`);
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

    const MAX_LENGTH = {
        title: 50,
    };

    return (
        <Modal
            className="modalContainer"
            open={isModalVisible}
            onCancel={closeModal}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
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
                    onKeyDown={(e) => (e.key === 'Enter' ? e.preventDefault() : '')}
                >
                    <div className="center">
                        <h2>{isEditing ? 'Редагувати контекст' : 'Додати контекст'}</h2>
                    </div>
                    <Form.Item
                        name="title"
                        label="Назва:"
                        rules={[
                            { required: true, message: 'Введіть назву', max: MAX_LENGTH.title },
                            { validator: validateContext },
                            {
                                pattern: COMMON_TITLE,
                                message: 'Назва не повинна містити спеціальних символів або цифр',
                            },
                        ]}
                        getValueProps={(value) => ({ value: normaliseWhitespaces(value) })}
                    >
                        <Input maxLength={MAX_LENGTH.title} showCount />
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
            </div>
        </Modal>
    );
});

export default ContextAdminModalComponent;
