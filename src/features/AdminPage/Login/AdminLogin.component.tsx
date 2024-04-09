/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import './AdminLogin.style.scss';

import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import { ERROR_MESSAGES, INVALID_LOGIN_ATTEMPT } from '@/app/common/constants/error-messages.constants';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import AuthStore from '@/app/stores/auth-store';
import useMobx, { useModalContext } from '@/app/stores/root-store';

const AdminLogin:React.FC = () => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = window._env_.RECAPTCHA_SITE_KEY;
    const { SOMETHING_IS_WRONG, RECAPTCHA_CHECK } = ERROR_MESSAGES;

    const handleVerify = () => {
        setIsVerified(true);
    };

    const handleExpiration = () => {
        setIsVerified(false);
    };

    const handleLogin = async ({ login, password }: any) => {
        if (isVerified) {
            try {
                const token = recaptchaRef?.current?.getValue();
                await userLoginStore.login(login, password, token)
                    .then(() => navigate(FRONTEND_ROUTES.ADMIN.BASE))
                    .catch(() => message.error(SOMETHING_IS_WRONG));
            } catch (error) {
                message.error(INVALID_LOGIN_ATTEMPT);
            }
        } else {
            message.error(RECAPTCHA_CHECK);
        }
    };

    if (AuthStore.isLoggedIn()) {
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
