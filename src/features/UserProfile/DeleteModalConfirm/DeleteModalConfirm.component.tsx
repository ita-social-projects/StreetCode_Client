import './DeleteModalConfirm.styles.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import Image from '@models/media/image.model';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

interface Props {
    emailForDeletion: string
    showDeleteConfirmedModal: boolean
}

const DeleteModalConfirm = ({ emailForDeletion, showDeleteConfirmedModal } : Props) => {
    const { userStore } = useMobx();
    const navigate = useNavigate();

    const handleDeleteConfirmation = () => {
        userStore.deleteUser(emailForDeletion);
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
