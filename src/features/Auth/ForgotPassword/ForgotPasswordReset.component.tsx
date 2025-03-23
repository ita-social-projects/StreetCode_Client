import './ForgotPasswordReset.styles.scss';

import { FC, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '@app/common/services/auth-service/AuthService';
import Password from '@components/Auth/Password.component';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

import { Button, Form, message } from 'antd';

const ForgotPasswordResetComponent: FC = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigator = useNavigate();
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

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

    if (AuthService.isLoggedIn()) {
        return <Navigate to={FRONTEND_ROUTES.OTHER_PAGES.PROFILE} />;
    }

    return (
        <div className="forgotPasswordResetWrapper">
            <Form
                form={form}
                className="forgot-password-reset-form"
                onFinish={handleUpdatePassword}
                layout="vertical"
            >
                <p className="forgotPasswordResetTitle">Відновлення паролю</p>
                <Password
                    setIsPasswordValid={setIsPasswordValid}
                    isPasswordValid={isPasswordValid}
                />
                <Button
                    htmlType="submit"
                    disabled={!isPasswordValid}
                    className="streetcode-custom-button forgotPasswordResetButton"
                >
                    <p>Зберегти пароль</p>
                </Button>
            </Form>
        </div>
    );
};

export default ForgotPasswordResetComponent;
