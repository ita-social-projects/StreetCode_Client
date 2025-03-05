import './ForgotPasswordReset.styles.scss';

import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import AuthService from '@app/common/services/auth-service/AuthService';
import Password from '@components/Auth/Password.component';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

import { Button, Form, message } from 'antd';

const ForgotPasswordResetComponent: React.FC = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigator = useNavigate();
    const [isValid, setIsValid] = useState<boolean>(true);

    const handleUpdatePassword = async () => {
        const searchParams = new URLSearchParams(location.search);

        const token = searchParams.get('token');
        const username = searchParams.get('username');

        const newPassword = form.getFieldValue('password');
        const confirmPassword = form.getFieldValue('passwordConfirmation');

        await AuthService.sendForgotPasswordUpdate(newPassword, confirmPassword, username, token).then(() => {
            navigator(FRONTEND_ROUTES.AUTH.LOGIN);
            message.success('Новий пароль успішно збережено. Тепер ви можете увійти в систему.');
        }).catch(() => {
            message.error('Сталася помилка. Спробуйте пізніше.');
        });
    };

    const navigateToLogin = () => {
        navigator(FRONTEND_ROUTES.AUTH.LOGIN);
    };

    if (AuthService.isLoggedIn()) {
        return <Navigate to={FRONTEND_ROUTES.OTHER_PAGES.PROFILE} />;
    }

    return (
        <div className="forgotPasswordResetWrapper">
            <Form form={form} className="forgot-password-reset-form" onFinish={handleUpdatePassword}>
                <p className="forgotPasswordResetTitle">Відновлення паролю</p>
                <Password onPasswordValid={setIsValid} />
                <Button
                    htmlType="submit"
                    disabled={!isValid}
                    className="streetcode-custom-button forgotPasswordResetButton"
                >
                    <p>Відновити пароль</p>
                </Button>
                <div onClick={navigateToLogin} className="navigationWrapper">
                    <LeftOutlined style={{ cursor: 'pointer' }} />
                    <button type="button" className="returnNavButton">Повернутися до входу</button>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPasswordResetComponent;
