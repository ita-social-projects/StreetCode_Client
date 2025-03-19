import './DeleteModal.styles.scss';

import React, { ChangeEvent } from 'react';

import { Button, Form, Input, Modal } from 'antd';

interface Props {
    open: boolean;
    onClose: () => void;
    emailForDeletion: string;
    handleOnChange: (value: ChangeEvent<HTMLInputElement>) => void;
    handleOnFinish: () => void;
}

const DeleteModal = ({
    open, onClose, emailForDeletion, handleOnChange, handleOnFinish,
}: Props) => (

    <Modal
        title="Видалення профілю"
        open={open}
        onCancel={onClose}
        footer={null}
        className="modalDeleteContainer"
    >
        <div className="deleteText">
            <p className="boldText">Ви впевнені, що хочете видалити свій акаунт?</p>
            <div className="mainDeleteText">
                <p>Видалення акаунта є незворотною дією та не може бути скасованим.</p>
                <p>
                    Це призведе до:
                </p>
                <ul>
                    <li>
                        Видалення всіх ваших персональних даних,
                        включаючи інформацію профілю, збережений прогрес і вибраний контент.
                    </li>
                    <li>Автоматичного виходу з системи.</li>
                    <li>Неможливості відновлення ваших даних у майбутньому.</li>
                </ul>
                <p className="boldText">
                        Якщо ви бажаєте продовжити, будь ласка, підтвердьте своє рішення.
                </p>
            </div>
        </div>
        <Form
            layout="vertical"
            onFinish={handleOnFinish}
            className="deleteModalFormWrapper"
        >
            <Form.Item label="Електронна адреса">
                <Input
                    value={emailForDeletion}
                    onChange={handleOnChange}
                    placeholder="Введіть вашу електронну адресу"
                    className="formItemDelete"
                    maxLength={50}
                    showCount
                />
            </Form.Item>
            <div className="confirmDeleteButton">
                <Button htmlType="submit">
                    Видалити профіль
                </Button>
            </div>
        </Form>
    </Modal>
);

export default DeleteModal;
