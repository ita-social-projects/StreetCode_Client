import './RegistrationPage.styles.scss';

import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import Password from '@components/Auth/Password.component';
import { SOMETHING_IS_WRONG } from '@constants/error-messages.constants';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { UserRegisterRequest } from '@models/user/user.model';
import removeSpacesFromField from '@utils/removeSpacesFromField';
import validateEmail from '@utils/userValidators/validateEmail';
import validateLength from '@utils/userValidators/validateLength';
import validatePatternNameSurname from '@utils/userValidators/validatePatternNameSurname';
import validateRequired from '@utils/userValidators/validateRequired';

import {
    Button, Checkbox, CheckboxProps, Form, Input, message,
} from 'antd';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isPasswordValid, setIsPasswordValid] = React.useState<boolean>(false);
    const [isValid, setIsValid] = React.useState<boolean>(false);
    const [checked, setChecked] = useState(false);

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

    const onChange: CheckboxProps['onChange'] = (e) => {
        setChecked(e.target.checked);
    };

    console.log(isPasswordValid);
    return (
        <div className="registerFormWrapper">
            <Form
                form={form}
                className="register-form"
                onFinish={handleRegister}
                onChange={validateFields}
                layout="vertical"
            >
                <div className="registerTitleWrapper">
                    <p className="registerTitle">Реєстрація</p>
                    <p className="registerSubTitle">Створіть свій обліковий запис</p>
                </div>
                <Form.Item
                    normalize={removeSpacesFromField}
                    className="formItem"
                    wrapperCol={{ span: 24 }}
                    label="Ім'я"
                    name="name"
                    rules={[
                        {
                            validator: validateRequired("Ім'я"),
                        },
                        {
                            validator: validateLength("Ім'я", 2, 50),
                        },
                        {
                            validator: validatePatternNameSurname("Ім'я"),
                        },
                    ]}
                >
                    <Input minLength={2} maxLength={50} showCount className="registerInputField" />
                </Form.Item>
                <Form.Item
                    normalize={removeSpacesFromField}
                    className="formItem"
                    wrapperCol={{ span: 24 }}
                    name="surname"
                    label="Прізвище"
                    rules={[
                        {
                            validator: validateRequired('Прізвище'),
                        },
                        {
                            validator: validateLength('Прізвище', 2, 50),
                        },
                        {
                            validator: validatePatternNameSurname('Прізвище'),
                        },
                    ]}
                >
                    <Input maxLength={50} showCount className="registerInputField" />
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    className="formItem"
                    name="email"
                    label="Електронна адреса"
                    rules={[
                        {
                            validator: validateRequired('Пошту'),
                        },
                        {
                            validator: validateEmail,
                        },
                        {
                            validator: validateLength('Пошта', 2, 256),
                        },
                    ]}
                >
                    <Input maxLength={256} showCount className="registerInputField" />
                </Form.Item>
                <Password
                    setIsPasswordValid={setIsPasswordValid}
                    isPasswordValid={isPasswordValid}
                />
                <Checkbox className="agreeCheckbox" onChange={onChange}>
                    Я погоджуюсь з
                    {' '}
                    <Link
                        to={FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY}
                        className="privacy-link"
                    >
                        Політикою конфіденційності
                    </Link>
                </Checkbox>
                <div className="navWrapper">
                    <Button
                        disabled={!isValid || !checked || !isPasswordValid}
                        htmlType="submit"
                        className="registerButton streetcode-custom-button"
                    >
                        <p>Зареєструватися</p>
                    </Button>
                    <p className="loginNav">
                        У мене вже є акаунт.
                        <button
                            type="button"
                            onClick={navigateToLogin}
                            className="loginNavButton"
                        >
                            &nbsp; Увійти
                        </button>
                    </p>
                </div>
            </Form>
        </div>
    );
};
export default RegistrationPage;
