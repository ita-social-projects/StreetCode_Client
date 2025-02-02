import './DeleteModalConfirm.styles.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import useMobx from '@stores/root-store';

import { message, Modal } from 'antd';

interface Props {
    emailForDeletion: string
    showDeleteConfirmedModal: boolean
}

const DeleteModalConfirm = ({ emailForDeletion, showDeleteConfirmedModal } : Props) => {
    const { userStore } = useMobx();
    const navigate = useNavigate();

    const handleDeleteConfirmation = () => {
        userStore.deleteUser(emailForDeletion)
            .catch(() => message.error('Виникла помилка при видаленні користувача'));
        navigate(FRONTEND_ROUTES.BASE);
    };
    return (
        <Modal
            title="Ваш обліковий запис було успішно видалено."
            open={showDeleteConfirmedModal}
            onCancel={handleDeleteConfirmation}
            footer={null}
            className="modalDeleteConfirmationContainer"
        >
            <p className="navText">
               Після закриття цього вікна ви автоматично будете перенаправленні на головну сторінку сайту.
            </p>
        </Modal>
    );
};

export default DeleteModalConfirm;
