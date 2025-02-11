/* eslint-disable max-len */
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Position from '@models/additional-content/teampositions.model';
import useMobx from '@stores/root-store';
import { Button, Form, Input, message, Modal, Popover, UploadFile } from 'antd';
import {parseJsonNumber} from "ajv/dist/runtime/parseJson";
import position = parseJsonNumber.position;
import normaliseWhitespaces from '@/app/common/utils/normaliseWhitespaces';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import BUTTON_LABELS from "@constants/buttonLabels";

interface TeamPositionsAdminProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isModalVisible: boolean;
    initialData?: Position;
    isNewPosition?: (data: boolean) => void;
}

const TeamPositionsAdminModalComponent: React.FC<TeamPositionsAdminProps> = observer(({
    isModalVisible,
    setIsModalOpen,
    initialData,
    isNewPosition
}) => {
    const {teamPositionsStore} = useMobx();
    const [form] = Form.useForm();
    const isEditing = !!initialData;
    const closeModal = () => {
        setIsModalOpen(false);
    };

    useAsync(() => teamPositionsStore.fetchPositions(), []);

    useEffect(() => {
        if (initialData && isModalVisible) {
            form.setFieldsValue({
                position: initialData.position,
            });
        }
    }, [initialData, isModalVisible, form]);

    const validatePosition = uniquenessValidator(
        ()=>(teamPositionsStore.getPositionsArray.map((position) => position.position)), 
        ()=>(initialData?.position), 
        'Позиція з такою назвою вже існує'
    );

    const onSubmit = async (formData: any) => {
        await form.validateFields();

        const currentPosition = {
            ...(initialData?.id && { id: initialData?.id }),
            position: (formData.position as string).trim(),
        };

        if (currentPosition.position === initialData?.position) return;

        if (currentPosition.id) {
            await teamPositionsStore.updatePosition(currentPosition as Position);
        } else {
            await teamPositionsStore.createPosition(currentPosition);
        }

        if (isNewPosition !== undefined) {
            isNewPosition(true);
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
            message.success(`Позицію успішно ${isEditing ? 'змінено' : 'додано'}!`);
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
                <Popover content="Зберіг? Тоді виходь!" trigger="hover">
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
                        <h2>{isEditing ? 'Редагувати позицію' : 'Додати нову позицію'}</h2>
                    </div>
                    <Form.Item
                        name="position"
                        label="Назва: "
                        rules={[{required: true, message: 'Введіть назву', max: MAX_LENGTH.title},
                            {validator: validatePosition}
                        ]}
                        getValueProps={(value) => ({ value: normaliseWhitespaces(value) })}
                    >
                        <Input maxLength={MAX_LENGTH.title} showCount/>
                    </Form.Item>

                    <div className="center">
                        <Button
                            className="streetcode-custom-button"
                            onClick={() => handleOk()}
                        >
                            {BUTTON_LABELS.SAVE}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
});

export default TeamPositionsAdminModalComponent;
