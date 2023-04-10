import './AdminLogin.style.scss';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import UserApi from '@/app/api/user/user.api';
import { UserLoginResponce } from '@/models/user/user.model';

const AdminLogin:React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const onSuccessfulLogin = (loginResponce: UserLoginResponce) => {
        navigate('/admin-panel');
    };
    const login = (formValues:any) => {
        UserApi.login({ login: formValues.login, password: formValues.password })
            .then((logResp) => onSuccessfulLogin(logResp))
            .catch((er) => message
                .error('Неправильний логін чи пароль'));
    };

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
