import './DiscardChangesModal.styles.scss';

import React from 'react';

import { Modal } from 'antd';

interface Props {
    onDiscardConfirm: (confirm: boolean) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const DiscardChangesModal = ({ onDiscardConfirm, isOpen, setIsOpen }: Props) => {
    const handleOnOk = () => {
        onDiscardConfirm(true);
        setIsOpen(false);
    };

    const handleOnCancel = () => {
        onDiscardConfirm(false);
        setIsOpen(false);
    };

    return (
        <Modal
            title="Зміни буде втрачено.
            Бажаєте продовжити?"
            open={isOpen}
            className="modalDiscardChangesContainer"
            onOk={handleOnOk}
            onCancel={handleOnCancel}
            cancelButtonProps={{ style: { display: 'none' } }}
            okText="Продовжити"
        />
    );
};

export default DiscardChangesModal;
