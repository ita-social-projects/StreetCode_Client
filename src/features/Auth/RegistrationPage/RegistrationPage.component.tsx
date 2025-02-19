import './RegistrationPage.styles.scss';

import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import Password from '@components/Auth/Password.component';
import { SOMETHING_IS_WRONG } from '@constants/error-messages.constants';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { UserRegisterRequest } from '@models/user/user.model';
import removeSpacesFromField from '@utils/removeSpacesFromField';
import validateEmail from '@utils/userValidators/validateEmail';
import validateLength from '@utils/userValidators/validateLength';
import validatePatternNameSurname from '@utils/userValidators/validatePatternNameSurname';

import { Button, Form, Input, message } from 'antd';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isPasswordValid, setIsPasswordValid] = React.useState<boolean>(false);
    const [isValid, setIsValid] = React.useState<boolean>(false);

    const navigateToLogin = () => {
        navigate(FRONTEND_ROUTES.AUTH.LOGIN);
    };

    const handleRegister = async (request: UserRegisterRequest) => {
        try {
            await AuthService.registerAsync(request)
                .then(() => navigate(FRONTEND_ROUTES.AUTH.LOGIN))
                .catch((ex) => {
                    Object.keys(ex.response.data.errors).forEach((key) => {
                        message.error(`${ex.response.data.errors[key]}`);
                    });
                });
        } catch (error) {
            message.error(SOMETHING_IS_WRONG);
        }
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
        <div className="registerFormWrapper">
            <Form form={form} className="register-form" onFinish={handleRegister} onChange={validateFields}>
                <div className="registerTitleWrapper">
                    <p className="registerTitle">Реєстрація</p>
                    <p className="registerSubTitle">Створіть свій обліковий запис</p>
                </div>
                <Form.Item
                    normalize={removeSpacesFromField}
                    wrapperCol={{ span: 24 }}
                    name="name"
                    rules={[
                        {
                            required: true, message: 'Введіть імʼя',
                        },
                        {
                            validator: validateLength("Ім'я", 2, 50),
                        },
                        {
                            validator: validatePatternNameSurname("Ім'я"),
                        },
                    ]}
                >
                    <Input placeholder="Ім'я" minLength={2} maxLength={50} showCount className="registerInputField" />
                </Form.Item>
                <Form.Item
                    normalize={removeSpacesFromField}
                    wrapperCol={{ span: 24 }}
                    name="surname"
                    rules={[
                        {
                            required: true, message: 'Введіть прізвище',
                        },
                        {
                            validator: validateLength('Прізвище', 2, 50),
                        },
                        {
                            validator: validatePatternNameSurname('Прізвище'),
                        },
                    ]}
                >
                    <Input placeholder="Прізвище" maxLength={50} showCount className="registerInputField" />
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="email"
                    rules={[
                        {
                            required: true, message: 'Введіть електронну пошту',
                        },
                        {
                            validator: validateEmail,
                        },
                        {
                            validator: validateLength('Пошта', 2, 254),
                        },
                    ]}
                >
                    <Input placeholder="Електронна пошта" maxLength={254} className="registerInputField" />
                </Form.Item>
                <Password onPasswordValid={setIsPasswordValid} />
                <Button
                    disabled={!isValid || !isPasswordValid}
                    htmlType="submit"
                    className="registerButton streetcode-custom-button"
                >
                    <p>Зареєструватися</p>
                </Button>
                <p className="loginNav">
                    Вже є обликовій запис?
                    <button type="button" onClick={navigateToLogin} className="loginNavButton">&nbsp; Увійти</button>
                </p>
            </Form>
        </div>
    );
};
export default RegistrationPage;
