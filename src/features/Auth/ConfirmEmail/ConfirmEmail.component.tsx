import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthApi from '@api/authentication/auth.api';
import Loader from '@components/Loader/Loader.component';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { useAsync } from '@hooks/stateful/useAsync.hook';

import { message } from 'antd';

const ConfirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useAsync(async () => {
        if (hasRun.current) return;
        hasRun.current = true;

        const searchParams = new URLSearchParams(location.search);

        const token = searchParams.get('token');
        const userName = searchParams.get('username');

        if (!token || !userName) {
            navigate(FRONTEND_ROUTES.AUTH.LOGIN);
            return;
        }

        try {
            await AuthApi.confirmEmail({ userName, token });
            message.success('Ваш акаунт успішно створено. Тепер ви можете увійти в систему.');
        } catch (error) {
            message.error('Це посилання недійсне або протерміноване.'
                + ' Поверніться на сторінку відновлення паролю і спробуйте ще раз.');
        }

        navigate(FRONTEND_ROUTES.AUTH.LOGIN);
    }, []);

    return <Loader />;
};

export default ConfirmEmail;
