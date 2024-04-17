/* eslint-disable max-len */
import {observer} from 'mobx-react-lite';
import CancelBtn from '@images/utils/Cancel_btn.svg';

import {Button, Form, Input, message, Modal, Popover} from 'antd';

interface NewTimelineContextModalProps {
    open: boolean;
    setIsContextModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onChange: (field: string, value: any) => void;
}

const NewTimelineContextModal: React.FC<NewTimelineContextModalProps> = observer(({open, setIsContextModalOpen, onChange }) => {
    const [form] = Form.useForm();
    const clearModal = () => {
        // resetFields();
        setIsContextModalOpen(false);
        // setErrorMessage('');
    };

    const onSuccesfulSubmit = (formValues: any) => {
        console.log(formValues);
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('Контекст успішно додано!', 2);
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
            open={open}
            onCancel={() => {
                setIsContextModalOpen(false);
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                    <CancelBtn className="iconSize" onClick={clearModal} />
                </Popover>
            )}
        >
            <div className="modalContainer-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSuccesfulSubmit}
                >
                    <div className="center">
                        <h2>Контекст</h2>
                    </div>
                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{required: true, message: 'Введіть назву', max: MAX_LENGTH.title}]}
                    >
                        <Input maxLength={MAX_LENGTH.title} showCount onChange={(e) => onChange('title', e.target.value)} />
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

export default NewTimelineContextModal;
