import './AdminLogin.style.scss';

import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import UserApi from '@/app/api/user/user.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';
import UserLoginStore from '@/app/stores/user-login-store';
import { UserLoginResponce } from '@/models/user/user.model';

const AdminLogin:React.FC = () => {
    const { modalStore, userLoginStore } = useMobx();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const setConfirmationModal = () => {
        modalStore.setConfirmationModal('confirmation', () => {
            userLoginStore.refreshToken()
                .catch((e) => {});
            modalStore.setConfirmationModal('confirmation');
        }, 'Бажаєте продовжити сеанс?', undefined, () => {
            userLoginStore.clearUserData();
        });
    };

    const onSuccessfulLogin = (loginResponce: UserLoginResponce) => userLoginStore
        .setUserLoginResponce(loginResponce, setConfirmationModal);

    const login = (formValues:any) => {
        UserApi.login({ login: formValues.login, password: formValues.password })
            .then((logResp) => onSuccessfulLogin(logResp))
            .then(() => navigate(FRONTEND_ROUTES.ADMIN.BASE))
            .catch((er) => {
                message
                    .error('Неправильний логін чи пароль');
            });
    };
    if (UserLoginStore.isLoggedIn) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.BASE} />;
    }

    return (
        <Form form={form} className="admin-login-form" onFinish={login}>
            <Form.Item name="login" label="Логін" rules={[{ required: true, message: 'Введіть логін' }]}>
                <Input maxLength={20} />
            </Form.Item>

            <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введіть пароль' }]}>
                <Input.Password maxLength={20} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" className="streetcode-custom-button">
                    Увійти
                </Button>
            </Form.Item>
        </Form>
    );
};
export default AdminLogin;
