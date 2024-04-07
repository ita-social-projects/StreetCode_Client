/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import './AdminLogin.style.scss';

import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import UserApi from '@/app/api/user/user.api';
import { ERROR_MESSAGES } from '@/app/common/constants/error-messages.constants';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx, { useModalContext } from '@/app/stores/root-store';
import UserLoginStore from '@/app/stores/user-login-store';

const AdminLogin:React.FC = () => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, messageContextHolder] = message.useMessage({ maxCount: 3 });
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = window._env_.RECAPTCHA_SITE_KEY;
    const { MESSAGE_LIMIT, SOMETHING_IS_WRONG, RECAPTCHA_CHECK } = ERROR_MESSAGES;

    const handleVerify = () => {
        setIsVerified(true);
    };

    const handleExpiration = () => {
        setIsVerified(false);
    };

    const handleLogin = async ({ login, password }: any) => {
        try {
            await userLoginStore.login(login, password);
        } catch (error) {
            message.error(
                'Неправильний логін чи пароль',
            );
        }
    };
    if (userLoginStore.isAccessTokenValid) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.BASE} />;
    }

    return (
        <Form form={form} className="admin-login-form" onFinish={handleLogin}>
            <Form.Item name="login" label="Логін" rules={[{ required: true, message: 'Введіть логін' }]}>
                <Input maxLength={20} />
            </Form.Item>

            <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введіть пароль' }]}>
                <Input.Password maxLength={20} />
            </Form.Item>
            <div className="captchaBlock">
                <ReCAPTCHA
                    className="required-captcha"
                    sitekey={siteKey}
                    onChange={handleVerify}
                    onExpired={handleExpiration}
                    ref={recaptchaRef}
                />
            </div>
            <Form.Item>
                <Button htmlType="submit" className="streetcode-custom-button">
                    Увійти
                </Button>
            </Form.Item>
        </Form>
    );
};
export default AdminLogin;
