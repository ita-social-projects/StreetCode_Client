import './ForgotPassword.styles.scss';

import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import AuthService from '@app/common/services/auth-service/AuthService';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import validateEmail from '@utils/userValidators/validateEmail';
import validateRequired from '@utils/userValidators/validateRequired';

import { Button, Form, Input, message } from 'antd';

const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const navigator = useNavigate();
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(60);

    useEffect(() => {
        let buttonTimer: NodeJS.Timeout;
        let messageTimer: NodeJS.Timeout;

        if (isButtonDisabled) {
            buttonTimer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(buttonTimer);
                        setIsButtonDisabled(false);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);

            messageTimer = setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        }

        return () => {
            clearInterval(buttonTimer);
            clearTimeout(messageTimer);
        };
    }, [isButtonDisabled]);

    const handleSendEmail = async ({ email }: { email: string }) => {
        setIsButtonDisabled(true);
        setShowMessage(true);
        setCountdown(60);

        await AuthService.sendForgotPassword(email)
            .then(() => {
                message.success('Пошту було успішно відправлено');
            })
            .catch(() => {
                message.error('Сталася помилка. Спробуйте пізніше.');
            });
    };

    const navigateToLogin = () => {
        navigator(FRONTEND_ROUTES.AUTH.LOGIN);
    };

    const validateFields = async () => {
        await form.validateFields().then(() => {
            setIsValid(true);
        }).catch(() => {
            setIsValid(false);
        });
    };

    if (AuthService.isLoggedIn()) {
        return <Navigate to={FRONTEND_ROUTES.OTHER_PAGES.PROFILE} />;
    }

    return (
        <div className="forgotPasswordWrapper">
            <Form
                form={form}
                className="forgot-password-form"
                onFinish={handleSendEmail}
                layout="vertical"
            >
                <div className="forgotPasswordTitleWrapper">
                    <p className="forgotPasswordTitle">Відновлення паролю</p>
                    <p className="forgotPasswordSubTitle">
                        Введіть електронну адресу,
                        яку ви використовували для реєстрації, і ми надішлемо вам інструкції з посиланням.
                    </p>
                </div>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="email"
                    label="Електронна адреса"
                    rules={
                        [
                            { validator: validateRequired('пошту') },
                            { validator: validateEmail },
                        ]
                    }
                >
                    <Input
                        onChange={validateFields}
                        className="emailInputField"
                        maxLength={256}
                        showCount
                    />
                </Form.Item>
                <Button
                    disabled={!isValid || isButtonDisabled}
                    htmlType="submit"
                    className="streetcode-custom-button forgotPasswordButton"
                >
                    <p>
                        Надіслати посилання
                        { isButtonDisabled ? ` (${countdown})` : ''}
                    </p>
                </Button>
                {showMessage && (
                    <p className="forgotPasswordMessage">
                        Посилання надійде за 60 сек. Спробуйте ще раз, якщо не прийшло.
                    </p>
                )}
                <div onClick={navigateToLogin} className="navigationWrapper">
                    <LeftOutlined />
                    <button type="button" className="returnNavButton">Повернутися до входу</button>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPassword;
