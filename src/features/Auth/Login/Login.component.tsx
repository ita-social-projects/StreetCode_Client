/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import './Login.styles.scss';

import { GoogleLogin } from '@react-oauth/google';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import { ERROR_MESSAGES, INVALID_LOGIN_ATTEMPT } from '@constants/error-messages.constants';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { UserRole } from '@models/user/user.model';
import validateEmail from '@utils/userValidators/validateEmail';

import { Button, Form, Input, message } from 'antd';
import useMobx from '@stores/root-store';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = window._env_.RECAPTCHA_SITE_KEY;
    const { RECAPTCHA_CHECK } = ERROR_MESSAGES;
    const location = useLocation();

    const handleVerify = () => {
        setIsVerified(true);
    };

    const handleExpiration = () => {
        setIsVerified(false);
    };

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
        if (!isVerified) {
            message.error(RECAPTCHA_CHECK);
            return;
        }

        try {
            const token = recaptchaRef?.current?.getValue();
            await AuthService.loginAsync(login, password, token);

            const userRole = AuthService.getUserRole();

            if (userRole === UserRole.Admin) {
                navigate(FRONTEND_ROUTES.ADMIN.BASE);
            } else {
                navigate(location.state?.previousUrl || FRONTEND_ROUTES.BASE);
            }
            message.success('Ви успішно увійшли в систему.');
            recaptchaRef.current?.reset();
        } catch (ex: any) {
            if (ex.response.data) {
                console.log(ex);
                ex.response.data.forEach((key: any) => {
                    message.error(`${key.message}`);
                });
            } else {
                message.error(INVALID_LOGIN_ATTEMPT);
            }
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
                    rules={[
                        {
                            required: true, message: 'Введіть логін',
                        },
                        {
                            validator: validateEmail,
                        },
                    ]}
                >
                    <Input className="loginInput" maxLength={128} placeholder="Електронна пошта" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="password"
                    rules={[
                        {
                            required: true, message: 'Введіть пароль',
                        },
                    ]}
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
                <ReCAPTCHA
                    style={{ height: 'auto' }}
                    sitekey={siteKey}
                    onChange={handleVerify}
                    onExpired={handleExpiration}
                    ref={recaptchaRef}
                    hl="uk"
                />
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
                            message.error('Помилка входу через Google. Будь ласка, спробуйте ще раз.');
                        }
                    }}
                    onError={() => {
                        message.error('Помилка входу через Google. Будь ласка, спробуйте ще раз.');
                    }}
                    useOneTap
                />
            </Form>
        </div>
    );
};
export default Login;
