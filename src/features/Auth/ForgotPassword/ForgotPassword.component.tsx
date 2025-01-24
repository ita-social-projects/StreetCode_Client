import './ForgotPassword.styles.scss';

import { Navigate, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import AuthService from '@app/common/services/auth-service/AuthService';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import validateEmail from '@utils/userValidators/validateEmail';

import { Button, Form, Input, message } from 'antd';

const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const handleSendEmail = ({ email } : { email: string }) => {
        AuthService.sendForgotPassword(email);
        message.success('Пошту було успішно відправлено');
    };
    const navigator = useNavigate();

    const navigateToLogin = () => {
        navigator(FRONTEND_ROUTES.AUTH.LOGIN);
    };

    if (AuthService.isLoggedIn()) {
        return <Navigate to={FRONTEND_ROUTES.OTHER_PAGES.PROFILE} />;
    }

    return (
        <div className="forgotPasswordWrapper">
            <Form form={form} className="forgot-password-form" onFinish={handleSendEmail}>
                <div className="forgotPasswordTitleWrapper">
                    <p className="forgotPasswordTitle">Відновлення паролю</p>
                    <p className="forgotPasswordSubTitle">
                        Введіть електронну адресу,
                        яку ви використовували для реєстрації, і ми надішлемо вам інструкції
                    </p>
                </div>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="email"
                    rules={[{ required: true, message: 'Введіть пошту' }, { validator: validateEmail }]}
                >
                    <Input className="emailInputField" placeholder="Електронна пошта" maxLength={128} />
                </Form.Item>
                <Button htmlType="submit" className="streetcode-custom-button forgotPasswordButton">
                    <p>Відновити пароль</p>
                </Button>
                <div onClick={navigateToLogin} className="navigationWrapper">
                    <LeftOutlined />
                    <button type="button" className="returnNavButton">Повернутися до входу</button>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPassword;
