/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';
import AuthService from '../services/auth-service/AuthService';

type PropsWithChildren = { children: ReactNode };
const ProtectedComponent:FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = AuthService.isLoggedIn();

    if (!isLoggedIn) {
        AuthService.refreshTokenAsync()
            .catch(() => navigate(FRONTEND_ROUTES.ADMIN.LOGIN));
        return null;
    }else{
        if (!AuthService.isAdmin()) {
            return <Navigate to={FRONTEND_ROUTES.OTHER_PAGES.ERROR404} />;
        }
    }

    return (
        <>
            {children}
        </>
    );
};
export default observer(ProtectedComponent);
