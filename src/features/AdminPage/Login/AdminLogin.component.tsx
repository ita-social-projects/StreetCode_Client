/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import './AdminLogin.style.scss';

import { GoogleLogin } from '@react-oauth/google';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import { ERROR_MESSAGES, INVALID_LOGIN_ATTEMPT } from '@/app/common/constants/error-messages.constants';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import AuthService from '@/app/common/services/auth-service/AuthService';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = window._env_.RECAPTCHA_SITE_KEY;
    const { RECAPTCHA_CHECK } = ERROR_MESSAGES;

    const handleVerify = () => {
        setIsVerified(true);
    };

    const handleExpiration = () => {
        setIsVerified(false);
    };

    message.config({
        duration: 2,
    });

    const handleLogin = async ({ login, password }: any) => {
        if (isVerified) {
            try {
                const token = recaptchaRef?.current?.getValue();
                await AuthService.loginAsync(login, password, token)
                    .then(() => navigate(FRONTEND_ROUTES.ADMIN.BASE))
                    .catch((ex) => {
                        for (const key in ex.response.data.errors) {
                            message.error(`${ex.response.data.errors[key]}`);
                        }
                    });
                recaptchaRef.current?.reset();
            } catch (error) {
                message.error(INVALID_LOGIN_ATTEMPT);
            }
        } else {
            message.error(RECAPTCHA_CHECK);
        }
    };

    if (AuthService.isLoggedIn()) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.BASE} />;
    }

    return (
        <>
            <Form form={form} className="admin-login-form" onFinish={handleLogin}>
                <Form.Item name="login" label="Логін" rules={[{ required: true, message: 'Введіть логін' }]}>
                    <Input maxLength={20} />
                </Form.Item>

                <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введіть пароль' }]}>
                    <Input.Password maxLength={30} />
                </Form.Item>
                <div className="captchaBlock center">
                    <ReCAPTCHA
                        className="required-captcha"
                        sitekey={siteKey}
                        onChange={handleVerify}
                        onExpired={handleExpiration}
                        ref={recaptchaRef}
                        hl="uk"
                    />
                </div>
                <Form.Item className="center">
                    <Button htmlType="submit" className="streetcode-custom-button">
                        Увійти
                    </Button>
                </Form.Item>
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            const idToken = credentialResponse.credential;
                            await AuthService.googleLoginAsync(idToken);
                            message.success('Успішна авторизація через Google!');
                            navigate(FRONTEND_ROUTES.ADMIN.BASE);
                        } catch (error) {
                            message.error('Помилка входу через Google');
                        }
                    }}
                    onError={() => {
                        message.error('Не вдалося увійти через Google');
                    }}
                    useOneTap
                />
            </Form>
        </>
    );
};
export default AdminLogin;
