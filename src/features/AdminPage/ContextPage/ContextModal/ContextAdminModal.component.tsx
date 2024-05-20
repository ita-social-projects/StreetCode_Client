/* eslint-disable max-len */
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Context from '@models/additional-content/context.model';
import useMobx from '@stores/root-store';
import { Button, Form, Input, message, Modal, Popover, UploadFile } from 'antd';

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
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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

    const validateContext = async (rule: any, value: string) => {
        return new Promise<void>((resolve, reject) => {
            if (contextStore.getContextArray.map((context) => context.title).includes(value)) {
                reject('Контекст з такою назвою вже існує');
            } else {
                resolve();
            }
        });
    };

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentContext = {
            ...(initialData?.id && {id: initialData?.id}),
            title: formData.title,
        };

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
        setFileList([]);
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('Контекст успішно додано!');
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
                <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
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
                        rules={[{required: true, message: 'Введіть назву', max: MAX_LENGTH.title},
                            {validator: validateContext}
                        ]}
                    >
                        <Input maxLength={MAX_LENGTH.title} showCount/>
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
            </div>
        </Modal>
    );
});

export default ContextAdminModalComponent;
