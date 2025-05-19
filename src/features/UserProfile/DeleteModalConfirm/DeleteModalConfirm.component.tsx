import './DeleteModalConfirm.styles.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import useMobx from '@stores/root-store';
import CheckCircleOutlined from '@assets/images/user-profile/check-circle.svg';
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
            title={null}
            open={showDeleteConfirmedModal}
            onCancel={handleDeleteConfirmation}
            footer={null}
            className="modalDeleteConfirmationContainer"
        >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
      <CheckCircleOutlined style={{ color: 'green', fontSize: '48px', marginBottom: 8 }} />
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Ваш обліковий запис було успішно видалено.
      </div>
    </div>
            <p className="navText">
               Після закриття цього вікна ви автоматично будете перенаправлені на головну сторінку сайту.
            </p>
        </Modal>
    );
};

export default DeleteModalConfirm;
