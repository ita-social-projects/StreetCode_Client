/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import './Login.styles.scss';

import { GoogleLogin } from '@react-oauth/google';
import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import { INVALID_LOGIN_ATTEMPT } from '@constants/error-messages.constants';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import validateEmail from '@utils/userValidators/validateEmail';

import { Button, Form, Input, message } from 'antd';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    message.config({
        duration: 2,
    });

    const navigateForgotPassword = () => {
        navigate(FRONTEND_ROUTES.AUTH.FORGOT_PASSWORD);
    };

    const navigateRegister = () => {
        navigate(FRONTEND_ROUTES.AUTH.REGISTER);
    };

    const handleLogin = async ({ login, password }: any) => {
        try {
            if (!executeRecaptcha) {
                return;
            }
            const token = await executeRecaptcha('login');
            await AuthService.loginAsync(login, password, token)
                .then(() => navigate(FRONTEND_ROUTES.BASE))
                .catch((ex) => {
                    if (ex.response?.data) {
                        Object.keys(ex.response.data.message).forEach((key) => {
                            message.error(`${ex.response.data[key].message}`);
                        });
                    }
                });
            recaptchaRef.current?.reset();
        } catch (error) {
            message.error(INVALID_LOGIN_ATTEMPT);
        }
    };

    if (AuthService.isLoggedIn()) {
        return <Navigate to={FRONTEND_ROUTES.OTHER_PAGES.PROFILE} />;
    }

    return (
        <div className="loginFormWrapper">
            <Form form={form} className="admin-login-form" onFinish={handleLogin}>
                <div className="loginTitleWrapper">
                    <p className="loginTitle">Вхід</p>
                    <p className="loginSubTitle">Введіть свої дані для входу</p>
                </div>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="login"
                    rules={[{ required: true, message: 'Введіть логін' }, { validator: validateEmail }]}
                >
                    <Input className="loginInput" maxLength={128} placeholder="Електронна пошта" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="password"
                    rules={[{ required: true, message: 'Введіть пароль' }]}
                >
                    <Input.Password className="passwordInput" placeholder="Пароль" />
                </Form.Item>
                <button
                    type="button"
                    className="forgotPassword"
                    onClick={navigateForgotPassword}
                >
                    Забули пароль?
                </button>
                <Button htmlType="submit" className="streetcode-custom-button loginButton">
                    <p>Увійти</p>
                </Button>
                <p className="registerNav">
                    Немає облікового запису?
                    <span className="registerNavButton" onClick={navigateRegister}> Зареєструватися</span>
                </p>
                <div className="continueWith">
                    <span className="line" />
                    <p className="continueText">або продовжити за допомогою</p>
                    <span className="line" />
                </div>
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            const idToken = credentialResponse.credential;
                            await AuthService.googleLoginAsync(idToken);
                            message.success('Успішна авторизація через Google!');
                            navigate(FRONTEND_ROUTES.BASE);
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
        </div>
    );
};
export default Login;
