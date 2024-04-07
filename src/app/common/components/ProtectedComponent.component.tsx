/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import useMobx from '@/app/stores/root-store';
import UserLoginStore from '@/app/stores/user-login-store';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';

type PropsWithChildren = { children: ReactNode };
const ProtectedComponent:FC<PropsWithChildren> = ({ children }): JSX.Element => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    if (!userLoginStore.isAccessTokenValid) {
        const token = UserLoginStore.getAccessToken();
        if (token && token !== '') {
            userLoginStore
                .refreshToken()
                .catch(() => navigate(FRONTEND_ROUTES.ADMIN.LOGIN));
        } else {
            return <Navigate to={FRONTEND_ROUTES.ADMIN.LOGIN} />;
        }
    }
    if (!Array.isArray(children)) return <>{children}</>;
    return (
        <>
            {children.map((child) => child) }
        </>
    );
};
export default observer(ProtectedComponent);
